const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: String,
  city: String,
  experience: Number,
  vehicle: String,
  licensePlate: String,
  photoUrl: String,
  role: { type: String, default: 'driver' },
  active: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema, 'drivers');
