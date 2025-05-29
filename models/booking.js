const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: String,
  phone: String,
  from: String,
  to: String,
  date: Date,
  confirmed: { type: Boolean, default: false },
  // другие поля по необходимости
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
