const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { register, login, getMe, googleCallback, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Local auth
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

module.exports = router;
