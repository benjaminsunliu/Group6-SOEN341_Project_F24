const jwt = require('jsonwebtoken');
const jwtSecret = 'your_jwt_secret';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Access token from the cookie
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = user; // Attach user info to the request object
    next();
  });
};

module.exports = { authenticateToken };

//To use in routes: const authenticateToken = require('./middleware/authenticateToken');
