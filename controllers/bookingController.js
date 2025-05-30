const Booking1 = require("../models/booking1");
const { v4: uuidv4 } = require('uuid');
const { sendBookingReceivedEmail } = require("../utils/bookingReception");
const { sendConfirmationMail } = require("../utils/bookingConfirmation");
const i18next = require("../config/i18n");

// ➕ Создание бронирования
exports.createBooking = async (req, res) => {
  try {
    const locale = req.body.locale || 'ru'; // Устанавливаем язык по умолчанию
    const bookingNumber = uuidv4();
     const booking = new Booking1({
      ...req.body,
      bookingNumber,
      locale, 
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

