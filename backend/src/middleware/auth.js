const jwt = require('jwt-simple');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No authorization header' });

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid authorization format' });

  const token = parts[1];
  try {
    const payload = jwt.decode(token, JWT_SECRET);
    // Check expiration if provided
    if (payload.exp && Date.now() > payload.exp * 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware pour vérifier si l'utilisateur est admin
async function adminMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No authorization header' });

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid authorization format' });

  const token = parts[1];
  try {
    const payload = jwt.decode(token, JWT_SECRET);
    if (payload.exp && Date.now() > payload.exp * 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.isAdmin()) return res.status(403).json({ error: 'Access denied. Admin only.' });
    
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
