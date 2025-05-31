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

    if (pricePerHour === undefined || pricePerKm === undefined) {
      return res.status(400).json({ error: "Необходимы поля pricePerHour и pricePerKm" });
    }

    if (
      typeof pricePerHour !== 'number' ||
      typeof pricePerKm !== 'number' ||
      typeof minFare !== 'number' ||
      typeof pricePerMin !== 'number'
    ) {
      return res.status(400).json({ error: "Ожидаются числовые значения pricePerHour и pricePerKm" });
    }

    const roundTo2 = (val) => Math.round(val * 100) / 100;

    const prices = await Prices.findOneAndUpdate(
      { locale },
      {
        pricePerHour: roundTo2(pricePerHour),
        pricePerKm: roundTo2(pricePerKm),
      },
      { new: true, upsert: true }
    );

    res.json(prices);
  } catch (err) {
    console.error("Ошибка при обновлении цен:", err);
    res.status(500).json({ error: "Ошибка при обновлении цен" });
  }
};
