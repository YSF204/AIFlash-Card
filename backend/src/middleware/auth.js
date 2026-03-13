const authService = require('../services/AuthService');
const User = require('../models/User');

/**
 * S — Single Responsibility: JWT extraction and verification only.
 */
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'No token provided' });

    const token = header.split(' ')[1];
    const decoded = authService.verifyToken(token);

    const user = await User.findById(decoded.id).select('-__v');
    if (!user)
      return res.status(401).json({ success: false, message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = auth;
