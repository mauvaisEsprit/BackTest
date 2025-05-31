const Booking1 = require("../models/booking1");
const { v4: uuidv4 } = require('uuid');
const { sendBookingReceivedEmail } = require("../utils/bookingReception");
const { sendConfirmationMail } = require("../utils/bookingConfirmation");
const i18next = require("../config/i18n");
const Prices = require("../models/prices");
const calculatePrice = require("../utils/calculatePrice");
const axios = require("axios");

// ➕ Создание бронирования
exports.createBooking = async (req, res) => {
  try {
    const locale = req.body.locale || 'ru'; // Устанавливаем язык по умолчанию
    const bookingNumber = uuidv4();
     

    const { from, to, price, isRoundTrip } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: "Адреса отправления и прибытия обязательны" });
    }

      // Геокодирование
    const [fromRes, toRes] = await Promise.all([
      axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: from, format: "json", limit: 1 },
      }),
      axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: to, format: "json", limit: 1 },
      }),
    ]);

    const fromCoords = fromRes.data[0];
    const toCoords = toRes.data[0];

    if (!fromCoords || !toCoords) {
      return res.status(400).json({ error: "Не удалось найти координаты по адресу" });
    }

    


    // Построение маршрута
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=false`;

    const osrmRes = await axios.get(osrmUrl);
    const route = osrmRes.data.routes[0];

    const distanceKm = route.distance / 1000;
    const durationMin = route.duration / 60;

    

    // Получение цен из настроек
    const prices = await Prices.findOne();
    const fare = calculatePrice(distanceKm, prices , isRoundTrip);
    
    console.log("Рассчитанная цена:", fare);


  const booking = new Booking1({
      ...req.body,
      bookingNumber,
      locale, 
      priceServer: fare, // Используем рассчитанную цену
    });

    await booking.save();

    

    await sendBookingReceivedEmail(booking);

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Ошибка при создании бронирования:", err);
    res.status(500).json({ error: "Ошибка при создании бронирования" });
  }
};

// 📄 Получение всех бронирований (для админки)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking1.find().sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Ошибка при получении бронирований" });
  }
};

// ✅ Подтверждение бронирования
exports.confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking1.findByIdAndUpdate(id, { confirmed: true }, { new: true });

    if (!booking) return res.status(404).json({ error: "Бронирование не найдено" });

    
    await sendConfirmationMail(booking);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при подтверждении бронирования" });
  }
};

// ❌ Удаление бронирования
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking1.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Бронирование не найдено" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при удалении бронирования" });
  }
};

