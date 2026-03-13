const jwt = require('jsonwebtoken');

/**
 * S — Single Responsibility: JWT operations only.
 * D — Dependency Inversion: consumers depend on this service, not jwt directly.
 */
class AuthService {
  /**
   * Sign a JWT for a given user document.
   * @param {Object} user - Mongoose User document
   * @returns {string} Signed JWT
   */
  signToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  /**
   * Verify a JWT and return the decoded payload.
   * @param {string} token
   * @returns {Object} Decoded payload
   * @throws On invalid / expired token
   */
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new AuthService();
