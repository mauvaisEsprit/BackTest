const Driver = require('../models/driver');
const bcrypt = require('bcryptjs');

async function addDriver(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const newDriver = new Driver({ email, passwordHash });
  await newDriver.save();

  console.log('Водитель добавлен:', email);
}

module.exports = addDriver;