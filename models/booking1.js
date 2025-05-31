// Схема для первой формы (Обычная поездка)
const mongoose = require("mongoose");
const uuidv4 = require("uuid").v4;

const bookingSchema1 = new mongoose.Schema({
  locale: { type: String, default: "ru" },
  from: String,
  to: String,
  date: Date,
  returnDate: Date,
  adults: Number,
  children: Number,
  name: String,
  phone: String,
  email: String,
  baggage: Boolean,
  comment: String,
  isRoundTrip: Boolean,
  price: Number,
  priceServer: Number,
  duration: Number,
  bookingNumber: { type: String, required: true, unique: true },
  id:  String,
  tripPurpose: String,
  garant: Boolean,
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Booking1 = mongoose.model("Booking1", bookingSchema1, "bookings");

module.exports = Booking1;