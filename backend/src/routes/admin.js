const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Service = require('../models/Service');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();
const EmailService = require('../services/emailService');

// Toutes les routes admin nécessitent une authentification admin
router.use(adminMiddleware);

// Obtenir les statistiques
router.get('/stats', async (req, res) => {
  const users = await User.getAll();
  const orders = Order.getAll();
  const bookings = Service.getAllBookings();
  
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

  res.json({
    totalUsers: users.length,
    totalOrders: orders.length,
    totalBookings: bookings.length,
    revenue: totalRevenue.toFixed(2),
  });
});

// Lister les utilisateurs
router.get('/users', async (req, res) => {
  res.json({ users: await User.getAll() });
});

// Lister les commandes
router.get('/orders', (req, res) => {
  res.json({ orders: Order.getAll() });
});

// Lister les réservations
router.get('/bookings', (req, res) => {
  res.json({ bookings: Service.getAllBookings() });
});

// Endpoint de test pour emails (dev)
router.post('/test-email', async (req, res) => {
  const { type, to } = req.body;
  if (!type || !to) return res.status(400).json({ error: 'type and to required' });

  try {
    let result;
    if (type === 'welcome') {
      result = await EmailService.sendWelcomeEmail(to, 'Client');
    } else if (type === 'order') {
      const items = [{ name: 'Nettoyage standard', quantity: 1, price: 49.99 }];
      result = await EmailService.sendOrderConfirmation(to, 'TEST1234', items, 49.99);
    } else if (type === 'delivery') {
      result = await EmailService.sendDeliveryConfirmation(to, 'TEST1234', 'TRACK123');
    } else if (type === 'booking') {
      result = await EmailService.sendBookingConfirmation(to, 'BOOK123', 'Ménage', '2025-12-10 10:00');
    } else {
      return res.status(400).json({ error: 'unknown type' });
    }

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === NOUVEAUX ENDPOINTS POUR EMAILS AVANCÉS ===

// Envoyer une newsletter
router.post('/send-newsletter', async (req, res) => {
  const { promotions, newProducts } = req.body;
  try {
    const users = User.getAll();
    const promises = users.map(user => 
      EmailService.sendMonthlyNewsletter(user.email, user.firstName || 'Client', promotions || [], newProducts || [])
    );
    await Promise.all(promises);
    res.json({ success: true, sent: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer rapport d'impact écologique
router.post('/send-eco-reports', async (req, res) => {
  const { monthYear } = req.body;
  try {
    const users = User.getAll();
    const orders = Order.getAll();
    
    const promises = users.map(user => {
      const userOrders = orders.filter(o => o.userId === user.id);
      const co2Saved = (userOrders.length * 2.5).toFixed(1);
      const plasticSaved = (userOrders.length * 1.2).toFixed(1);
      
      return EmailService.sendEcoImpactReport(
        user.email,
        monthYear || 'Ce mois',
        co2Saved,
        plasticSaved,
        userOrders.length
      );
    });
    
    await Promise.all(promises);
    res.json({ success: true, sent: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer alerte de stock
router.post('/send-stock-alert', async (req, res) => {
  const { productName, productId, userEmails } = req.body;
  if (!productName || !productId || !userEmails) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    const promises = userEmails.map(email =>
      EmailService.sendStockAlert(email, 'Client', productName, productId)
    );
    await Promise.all(promises);
    res.json({ success: true, sent: userEmails.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer remboursement
router.post('/send-refund', async (req, res) => {
  const { email, orderId, amount, reason } = req.body;
  if (!email || !orderId || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    await EmailService.sendRefundConfirmation(email, orderId, amount, reason || 'Demande client', 5);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer facture
router.post('/send-invoice', async (req, res) => {
  const { email, orderId, items, total, invoiceNumber, invoiceDate } = req.body;
  if (!email || !orderId || !items || !total) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    await EmailService.sendInvoice(
      email,
      orderId,
      items,
      total,
      invoiceNumber || `INV-${Date.now()}`,
      invoiceDate || new Date().toLocaleDateString('fr-FR')
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer code parrainage
router.post('/send-referral', async (req, res) => {
  const { email, referralCode } = req.body;
  if (!email || !referralCode) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    const referralLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/ref/${referralCode}`;
    await EmailService.sendReferralProgram(email, referralCode, referralLink);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer points de fidélité
router.post('/send-loyalty-points', async (req, res) => {
  const { email, pointsBalance, pointsEarned, rewardsAvailable } = req.body;
  if (!email || pointsBalance === undefined) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    await EmailService.sendLoyaltyPoints(email, pointsBalance, pointsEarned || 0, rewardsAvailable || 0);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer offre anniversaire
router.post('/send-birthday-offer', async (req, res) => {
  const { email, discountCode, expiryDate } = req.body;
  if (!email || !discountCode) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    await EmailService.sendBirthdayOffer(email, discountCode, expiryDate || '31 décembre 2025');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer alerte connexion
router.post('/send-login-alert', async (req, res) => {
  const { email, loginDate, deviceInfo, location, ipAddress } = req.body;
  if (!email || !loginDate) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    await EmailService.sendNewLoginAlert(email, loginDate, deviceInfo || 'Unknown', location || 'Unknown', ipAddress || 'Unknown');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Envoyer suggestions de produits
router.post('/send-recommendations', async (req, res) => {
  const { email, recommendedProducts, basedOnProduct } = req.body;
  if (!email || !recommendedProducts) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    await EmailService.sendProductRecommendations(email, recommendedProducts, basedOnProduct || 'vos achats précédents');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Promouvoir un utilisateur en admin (super-admin uniquement ou premier admin)
router.post('/make-admin/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.makeAdmin(userId);
    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer tous les comptes utilisateurs
router.delete('/delete-all-users', async (req, res) => {
  try {
    await User.deleteAll();
    res.json({ success: true, message: 'Tous les comptes ont été supprimés' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

