const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
   baggage: String,
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
 
 const Booking1 = mongoose.model("Booking1", bookingSchema1, "bookings");


module.exports = mongoose.model('Booking', bookingSchema);
