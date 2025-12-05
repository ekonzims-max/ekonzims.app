#!/usr/bin/env node
// Simple CLI to send test emails using EmailService

require('dotenv').config();
const EmailService = require('../services/emailService');

async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || process.env.TEST_EMAIL_TYPE || 'order';
  const to = args[1] || process.env.TEST_EMAIL_TO || process.env.EMAIL_USER;

  if (!to) {
    console.error('Missing recipient. Usage: node sendTestEmail.js [type] [to]');
    process.exit(1);
  }

  try {
    let res;
    if (type === 'welcome') {
      res = await EmailService.sendWelcomeEmail(to, 'Test User');
    } else if (type === 'order') {
      const items = [
        { name: 'Nettoyage standard', quantity: 1, price: 49.99 },
        { name: 'Shampoing canapé', quantity: 1, price: 29.0 },
      ];
      res = await EmailService.sendOrderConfirmation(to, 'CLI-TEST-001', items, 78.99);
    } else if (type === 'delivery') {
      res = await EmailService.sendDeliveryConfirmation(to, 'CLI-TEST-001', 'TRACK-CLI-123');
    } else if (type === 'booking') {
      res = await EmailService.sendBookingConfirmation(to, 'BOOK-CLI-001', 'Ménage complet', '2025-12-10 10:00');
    } else if (type === 'reset') {
      res = await EmailService.sendPasswordReset(to, 'RESET-TOKEN-CLI');
    } else {
      console.error('Unknown type. Allowed: welcome, order, delivery, booking, reset');
      process.exit(1);
    }

    console.log('Result:', res);
    process.exit(0);
  } catch (err) {
    console.error('Error sending test email:', err);
    process.exit(2);
  }
}

main();
