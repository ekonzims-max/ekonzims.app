const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const EmailService = require('../services/emailService');

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  res.json({ products: Product.getAll() });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = Product.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Create order
router.post('/order', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { items, totalAmount, shippingAddress } = req.body;
  // Simple token decode (in production use proper JWT)
  let userId;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const order = Order.create(userId, items, totalAmount, shippingAddress);
  
  // Send confirmation email
  const user = User.findById(userId);
  if (user) {
    await EmailService.sendOrderConfirmation(user.email, order.id, items, totalAmount);
  }
  
  res.status(201).json(order);
});

module.exports = router;
