// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function(allowedRoles = []) {
  return function(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Нет токена' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Нет токена' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.driver = decoded;

      // Если роли не заданы — доступ всем авторизованным
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Нет доступа' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: 'Неверный токен' });
    }
  };
};
