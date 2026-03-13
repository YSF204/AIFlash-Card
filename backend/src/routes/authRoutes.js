const express = require('express');
const passport = require('../config/passport');
const { googleCallback, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

/**
 * I — Interface Segregation: auth routes are isolated from card/ai routes.
 */
const router = express.Router();

// Initiate Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google OAuth callback — passport verifies, then we issue JWT
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}?error=auth_failed` }),
  googleCallback
);

// Get current authenticated user
router.get('/me', auth, getMe);

module.exports = router;
