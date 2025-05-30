const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('Не заданы переменные окружения ADMIN_EMAIL и ADMIN_PASSWORD');
}

router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Введите email и пароль' });
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: 'admin', email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Неверный логин или пароль' });
});

module.exports = router;
