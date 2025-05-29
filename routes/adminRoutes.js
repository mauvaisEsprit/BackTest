const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const isAdmin = require('../middleware/isAdmin');
const sendEmailToClient = require('../utils/sendEmailToClient');

// Получить все бронирования
router.get('/bookings', isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Подтвердить бронирование
router.post('/bookings/:id/confirm', isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.sendStatus(404);

    booking.confirmed = true;
    await booking.save();

    await sendEmailToClient(
      booking.email,
      'Бронирование подтверждено',
      `Номер вашей брони: ${booking._id}`
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Удалить бронирование (по желанию)
router.delete('/bookings/:id', isAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
