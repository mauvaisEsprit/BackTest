// Схема для второй формы (Почасовая аренда)
const mongoose = require("mongoose");

const bookingSchema2 = new mongoose.Schema({
  locale: { type: String, default: "ru" },
  pickupLocation: String,
  duration: Number,
  date: Date,
  name: String,
  phone: String,
  email: String,
  tripPurpose: String,
  totalPrice: Number,
  priceServer: Number,
  bookingNumber: { type: String, required: true, unique: true },
  id: String,
  garant: Boolean,
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Booking2 = mongoose.model("Booking2", bookingSchema2, "hourly_bookings");

module.exports = Booking2;