const Booking2 = require("../models/booking2");
const { v4: uuidv4 } = require('uuid');
const sendHourlyBookingConfirmationEmail  = require("../utils/hourlyConfirmation");
const { sendHourlyBookingReceptionEmail } = require("../utils/hourlyReception");

// ➕ Создание аренды
exports.createHourlyBooking = async (req, res) => {
  try {
    const locale = req.body.locale || 'ru';
    const bookingNumber = uuidv4();
    const booking = new Booking2({ ...req.body, bookingNumber, locale });
    await booking.save();

    await sendHourlyBookingReceptionEmail(booking);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Ошибка при создании аренды:", err);
    res.status(500).json({ error: "Ошибка при создании аренды" });
  }
};

// 📄 Получение всех заявок на аренду (для админки)
exports.getHourlyBookings = async (req, res) => {
  try {
    const bookings = await Booking2.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Ошибка при получении данных аренды" });
  }
};

// ✅ Подтверждение аренды
exports.confirmHourlyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking2.findByIdAndUpdate(id, { confirmed: true }, { new: true });

    if (!booking) return res.status(404).json({ error: "Аренда не найдена" });

    await sendHourlyBookingConfirmationEmail(booking);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при подтверждении аренды" });
  }
};

exports.deleteHourlyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking2.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Бронирование не найдено" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при удалении бронирования" });
  }
};
