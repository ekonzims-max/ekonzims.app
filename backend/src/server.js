const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Initialize Firebase configuration (must be before importing models)
require('./config/firebase');

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const servicesRoutes = require('./routes/services');
const adminRoutes = require('./routes/admin');
const oauthRoutes = require('./routes/oauth');
const passport = require('./config/passportConfig');
const session = require('express-session');

// Import email scheduler
const EmailScheduler = require('./services/emailScheduler');

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and passport (needed for OAuth flows)
app.use(session({
  secret: process.env.SESSION_SECRET || 'ekonzims_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes API
app.use('/api/auth', authRoutes);
// OAuth routes (google/facebook)
app.use('/api/auth', oauthRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/admin', adminRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur EkoNzims démarré sur le port ${PORT}`);
  
  // Initialiser les tâches automatisées d'emails
  if (process.env.ENABLE_EMAIL_SCHEDULER !== 'false') {
    EmailScheduler.initAll();
  }
});
