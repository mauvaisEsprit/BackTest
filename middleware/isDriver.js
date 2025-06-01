const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Нет токена' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'driver') {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    req.driver = decoded; // вот здесь ключевой момент — записываем в req.driver
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(403).json({ message: 'Неверный токен' });
  }
};
