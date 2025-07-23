const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticate };
