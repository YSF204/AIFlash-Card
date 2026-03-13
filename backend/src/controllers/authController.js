const authService = require('../services/AuthService');

/**
 * S — Single Responsibility: handles HTTP auth concerns only.
 * D — Dependency Inversion: depends on AuthService abstraction.
 */

/** Called after passport.authenticate() succeeds — issue JWT and redirect */
const googleCallback = (req, res) => {
  try {
    const token = authService.signToken(req.user);
    // Redirect to frontend with JWT in query param (frontend stores it)
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
  }
};

/** GET /api/auth/me — return current user from JWT */
const getMe = (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { googleCallback, getMe };
