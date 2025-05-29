const mongoose = require('mongoose');

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
  duration: Number,
  id: String,
  tripPurpose: String,
  garant: Boolean,
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Создаём модель с именем "Booking1" и явно указываем коллекцию "bookings"
const Booking = mongoose.model("Booking", bookingSchema1, "bookings");

module.exports = Booking;
