const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Driver = require('../models/driver');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Введите email и пароль' });

  try {
    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(401).json({ message: 'Неверный логин или пароль' });

    const isMatch = await bcrypt.compare(password, driver.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Неверный логин или пароль' });

    const token = jwt.sign(
      { role: 'driver', email: driver.email, id: driver._id },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    const name = driver.name;

    res.json({ token, role: 'driver', name: name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
