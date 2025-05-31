const { min } = require("moment-timezone");
const Prices = require("../models/prices");


exports.getPrices = async (req, res) => {
  try {
    const locale = req.query.locale || 'fr';
    let prices = await Prices.findOne({ locale });

    if (!prices) {
      
      // Вернём созданные цены, а не 404
      return res.status(404).json({ error: "Цены не найдены" });
    }

    res.json(prices);
  } catch (err) {
    console.error("Ошибка при получении цен:", err);
    res.status(500).json({ error: "Ошибка при получении цен" });
  }
};


exports.updatePrices = async (req, res) => {
  try {
    const locale = (req.query.locale || 'fr').toLowerCase();
    const { pricePerHour, pricePerKm, minFare, pricePerMin } = req.body;

    const roundTo2 = (val) => Math.round(val * 100) / 100;

    const updates = {};

    if (typeof pricePerHour === 'number') updates.pricePerHour = roundTo2(pricePerHour);
    if (typeof pricePerKm === 'number') updates.pricePerKm = roundTo2(pricePerKm);
    if (typeof minFare === 'number') updates.minFare = roundTo2(minFare);
    if (typeof pricePerMin === 'number') updates.pricePerMin = roundTo2(pricePerMin);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Нечего обновлять: ни одно поле не передано или неверного типа" });
    }

    updates.locale = locale; // обязательно для upsert

    const prices = await Prices.findOneAndUpdate(
      { locale },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json(prices);
  } catch (err) {
    console.error("Ошибка при обновлении цен:", err);
    res.status(500).json({ error: "Ошибка при обновлении цен" });
  }
};
