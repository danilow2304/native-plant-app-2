const jwt = require('jsonwebtoken');

// Protected-route middleware: rejects any request without a valid JWT.
module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET); // checks signature + expiry
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
