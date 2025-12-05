const express = require('express');
const Service = require('../models/Service');
const User = require('../models/User');
const EmailService = require('../services/emailService');

const router = express.Router();

// Get all services
router.get('/', (req, res) => {
  res.json({ services: Service.getAll() });
});

// Get service by ID
router.get('/:id', (req, res) => {
  const service = Service.getById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
});

// Create booking
router.post('/booking', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { serviceId, scheduledDate, address, phone, paymentMethod, cardNumber } = req.body;

  let userId;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const booking = Service.createBooking(userId, serviceId, scheduledDate, address, paymentMethod, cardNumber, phone);
    
    // Send confirmation email
    const user = User.findById(userId);
    const service = Service.getById(serviceId);
    if (user && service) {
      await EmailService.sendBookingConfirmation(user.email, booking.id, service.name, scheduledDate);
    }
    
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user bookings
router.get('/user/bookings', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let userId;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.json({ bookings: Service.getBookingsByUserId(userId) });
});

module.exports = router;
