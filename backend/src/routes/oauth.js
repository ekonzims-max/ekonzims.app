const express = require('express');
const passport = require('passport');
const router = express.Router();

function generateToken(userId) {
  return Buffer.from(JSON.stringify({ userId, iat: Date.now() })).toString('base64');
}

// Google OAuth Routes
router.get('/google', 
  (req, res, next) => {
    console.log('🔵 Starting Google OAuth flow...');
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  (req, res, next) => {
    console.log('🔵 Google callback received');
    next();
  },
  passport.authenticate('google', { failureRedirect: '/login?error=google_failed' }),
  (req, res) => {
    console.log('✅ Google authentication successful');
    console.log('User:', req.user);
    const token = generateToken(req.user.userId);
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/login?oauth_token=${token}&oauth_user=${encodeURIComponent(JSON.stringify(req.user.user.toJSON()))}`;
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }
);

// Facebook OAuth Routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login?error=facebook_failed' }),
  (req, res) => {
    const token = generateToken(req.user.userId);
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/login?oauth_token=${token}&oauth_user=${encodeURIComponent(JSON.stringify(req.user.user.toJSON()))}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;
