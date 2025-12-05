const express = require('express');
const User = require('../models/User');
const EmailService = require('../services/emailService');

const router = express.Router();

// Génération simple de JWT (remplacer par jwt-simple en production)
function generateToken(userId) {
  return Buffer.from(JSON.stringify({ userId, iat: Date.now() })).toString('base64');
}

function verifyToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return decoded.userId;
  } catch {
    return null;
  }
}

// Register
router.post('/register', async (req, res) => {
  const { 
    email, password, firstName, lastName, phone = '', street = '', city = '', postalCode = '',
    latitude = null, longitude = null,
    termsAccepted = false, privacyAccepted = false, marketingConsent = false, geolocalizationConsent = false
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (!termsAccepted || !privacyAccepted) {
    return res.status(400).json({ error: 'You must accept terms and privacy policy' });
  }

  try {
    const user = await User.create(email, password, firstName || '', lastName || '', phone, street, city, postalCode);
    user.latitude = latitude;
    user.longitude = longitude;
    user.termsAccepted = termsAccepted;
    user.termsAcceptedAt = new Date();
    user.privacyAccepted = privacyAccepted;
    user.privacyAcceptedAt = new Date();
    user.marketingConsent = marketingConsent;
    user.geolocalizationConsent = geolocalizationConsent;

    const token = generateToken(user.id);
    // Auto-verify in development or when explicitly requested via env var
    const autoVerify = process.env.AUTO_VERIFY_EMAIL === 'true' || process.env.NODE_ENV === 'development';
    if (autoVerify) {
      user.emailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpire = null;
      // send a simple welcome email (non-blocking)
      EmailService.sendWelcomeEmail(email, firstName || 'User').catch(() => {});

      res.status(201).json({
        user: user.toJSON(),
        token,
        message: 'Registration successful. Account auto-verified (dev mode).'
      });
      return;
    }

    // Send verification email in normal mode
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify-email?token=${user.emailVerificationToken}`;
    await EmailService.sendVerificationEmail(email, firstName || 'User', verificationLink);

    res.status(201).json({
      user: user.toJSON(),
      token,
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Verification token required' });
  }

  try {
    const user = await User.verifyEmail(token);
    res.json({ success: true, message: 'Email verified successfully', user: user.toJSON() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Verify email via GET (from email link)
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: 'Verification token required' });
  }

  try {
    const user = await User.verifyEmail(token);
    res.json({ success: true, message: 'Email verified successfully', user: user.toJSON() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Check email availability
router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const exists = !!(await User.findByEmail(email));
  res.json({ exists });
});

// Forgot password - generate token and send email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const token = await User.generatePasswordReset(email);
    await EmailService.sendPasswordReset(email, token);
    res.json({ success: true, message: 'Password reset email sent if the account exists.' });
  } catch (err) {
    // For security, do not reveal whether the email exists
    await EmailService.sendPasswordReset(email, '');
    res.json({ success: true, message: 'Password reset email sent if the account exists.' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and new password required' });
  try {
    const user = await User.resetPassword(token, password);
    res.json({ success: true, message: 'Password reset successful' , user: user.toJSON()});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = await User.findByEmail(email);
  if (!user || !User.validatePassword(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user.id);
  res.json({ user: user.toJSON(), token });
});

// Get current user
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = verifyToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user.toJSON());
});

// Export token verification middleware
router.verifyToken = verifyToken;

module.exports = router;
