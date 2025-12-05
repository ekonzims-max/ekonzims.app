const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
require('dotenv').config();

const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

function makeToken(user) {
  // Create a token with subject and expiration (in seconds)
  const now = Math.floor(Date.now() / 1000);
  // Parse simple duration like '7d' into seconds if given
  let exp = now + 7 * 24 * 60 * 60;
  if (typeof JWT_EXPIRE === 'string' && JWT_EXPIRE.endsWith('d')) {
    const days = parseInt(JWT_EXPIRE.slice(0, -1), 10) || 7;
    exp = now + days * 24 * 60 * 60;
  }
  const payload = { sub: user._id.toString(), email: user.email, iat: now, exp };
  return jwt.encode(payload, JWT_SECRET);
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, firstName, lastName });
    await user.save();
    const token = makeToken(user);
    res.status(201).json({ id: user._id, email: user.email, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = makeToken(user);
    res.json({ id: user._id, email: user.email, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected profile
const auth = require('../middleware/auth');
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
