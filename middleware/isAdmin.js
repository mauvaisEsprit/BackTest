const jwt = require('jsonwebtoken');

module.exports = function isAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.sendStatus(403);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};
