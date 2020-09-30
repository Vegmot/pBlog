const jwt = require('jsonwebtoken');
const config = require('config');
require('dotenv').config();

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // check if !token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorisation denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get(process.env.JWTSECRET));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
