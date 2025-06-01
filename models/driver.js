const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

module.exports = mongoose.model('Driver', driverSchema, 'drivers');
