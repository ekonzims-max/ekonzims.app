const EmailService = require('../services/emailService');

async function testAllEmails() {
  const testEmail = 'test@example.com';
  console.log('🚀 Test de tous les emails EkoNzims...\n');

  try {
    // === EMAILS DE BASE ===
    console.log('1. Welcome Email...');
    await EmailService.sendWelcomeEmail(testEmail, 'Client');
    
    console.log('2. Verification Email...');
    await EmailService.sendVerificationEmail(testEmail, 'Client', 'https://ekonzims.com/verify?token=abc123');
    
    console.log('3. Order Confirmation...');
    await EmailService.sendOrderConfirmation(testEmail, 'ORD-12345', [
      { name: 'Détergent écologique', quantity: 2, price: 15.99 },
      { name: 'Savon naturel', quantity: 1, price: 8.50 }
    ], 40.48);
    
    console.log('4. Delivery Confirmation...');
    await EmailService.sendDeliveryConfirmation(testEmail, 'ORD-12345', 'TRK-789456');
    
    console.log('5. Booking Confirmation...');
    await EmailService.sendBookingConfirmation(testEmail, 'BKG-001', 'Nettoyage professionnel', '15 décembre 2025 à 14h00');
    
    console.log('6. Password Reset...');
    await EmailService.sendPasswordReset(testEmail, 'reset-token-123');
    
    console.log('7. Admin Notification...');
    await EmailService.sendAdminNotification(testEmail, 'Nouvelle commande', 'Une nouvelle commande #ORD-12345 a été reçue pour 40.48€');

    // === EMAILS D'EXPÉDITION ===
    console.log('8. Shipping Notification...');
    await EmailService.sendShippingNotification(testEmail, 'Client', 'ORD-12345', 'TRK-987654', '7 décembre 2025');
    
    console.log('9. Delivery Reminder...');
    await EmailService.sendDeliveryReminder(testEmail, 'Client', 'ORD-12345', '4 décembre 2025 - 14h00');
    
    console.log('10. Review Request...');
    await EmailService.sendReviewRequest(testEmail, 'Client', 'ORD-12345', [
      { name: 'Détergent écologique', quantity: 2 }
    ]);

    // === EMAILS DE PANIER ===
    console.log('11. Cart Abandonment Reminder...');
    await EmailService.sendCartAbandonmentReminder(testEmail, 'Client', [
      { name: 'Savon naturel', quantity: 1, price: 8.50 },
      { name: 'Éponge biodégradable', quantity: 3, price: 4.99 }
    ], '3 décembre 2025');

    // === EMAILS DE SERVICE ===
    console.log('12. Service Reminder...');
    await EmailService.sendServiceReminder(testEmail, 'Client', 'BKG-002', 'Nettoyage de bureaux', '5 décembre 2025 à 10h00');
    
    console.log('13. Payment Confirmation...');
    await EmailService.sendPaymentConfirmation(testEmail, 'Client', 125.50, 'Carte bancaire', 'TXN-456789');

    // === EMAILS DE STOCK ===
    console.log('14. Stock Alert...');
    await EmailService.sendStockAlert(testEmail, 'Client', 'Détergent écologique bio', 'PROD-123');
    
    console.log('15. Monthly Newsletter...');
    await EmailService.sendMonthlyNewsletter(testEmail, 'Client', [
      { title: 'Promo Hiver', description: '20% sur tous les produits de nettoyage' },
      { title: 'Livraison gratuite', description: 'Dès 50€ d\'achat' }
    ], [
      { name: 'Brosse écologique', price: 12.99 },
      { name: 'Vinaigre nettoyant', price: 6.50 }
    ]);

    // === EMAILS TRANSACTIONNELS AVANCÉS ===
    console.log('16. Invoice...');
    await EmailService.sendInvoice(testEmail, 'ORD-12345', [
      { name: 'Détergent écologique', quantity: 2, price: 15.99 },
      { name: 'Savon naturel', quantity: 1, price: 8.50 }
    ], 40.48, 'INV-2025-001', '4 décembre 2025');
    
    console.log('17. Refund Confirmation...');
    await EmailService.sendRefundConfirmation(testEmail, 'ORD-12345', 40.48, 'Produit endommagé', 5);
    
    console.log('18. Payment Failure...');
    await EmailService.sendPaymentFailure(testEmail, 'ORD-12346', 'Carte expirée');
    
    console.log('19. Order Status Change...');
    await EmailService.sendOrderStatusChange(testEmail, 'ORD-12345', 'processing', 'shipped', 'Votre commande a été expédiée et arrivera sous 72 heures.');

    // === EMAILS DE FIDÉLISATION ===
    console.log('20. Referral Program...');
    await EmailService.sendReferralProgram(testEmail, 'REF-CLIENT-2025', 'https://ekonzims.com/ref/CLIENT-2025');
    
    console.log('21. Loyalty Points...');
    await EmailService.sendLoyaltyPoints(testEmail, 450, 50, 2);
    
    console.log('22. Birthday Offer...');
    await EmailService.sendBirthdayOffer(testEmail, 'ANNIVERSAIRE15', '31 décembre 2025');
    
    console.log('23. VIP Access...');
    await EmailService.sendVIPAccess(testEmail, 'VIP-2025-GOLD', '10 décembre 2025');

    // === EMAILS DE RÉENGAGEMENT ===
    console.log('24. Inactive User Offer...');
    await EmailService.sendInactiveUserOffer(testEmail, 45, 'RETOUR10');
    
    console.log('25. Wishlist Low Stock Alert...');
    await EmailService.sendWishlistLowStockAlert(testEmail, 'Savon au lait de chèvre', 'PROD-456', 3);
    
    console.log('26. New Category Announcement...');
    await EmailService.sendNewCategoryAnnouncement(
      testEmail, 
      'Produits de jardinage écologiques', 
      'Découvrez notre nouvelle gamme de produits pour un jardinage 100% naturel et respectueux de l\'environnement.',
      'https://ekonzims.com/categories/jardinage'
    );
    
    console.log('27. Price Drop Alert...');
    await EmailService.sendPriceDropAlert(testEmail, 'Détergent premium bio', 'PROD-789', 24.99, 19.99, 20);

    // === EMAILS DE SERVICE CLIENT ===
    console.log('28. Support Ticket Opened...');
    await EmailService.sendSupportTicketOpened(testEmail, 'TKT-001', 'Question sur la livraison', 'medium');
    
    console.log('29. Support Ticket Response...');
    await EmailService.sendSupportTicketResponse(
      testEmail, 
      'TKT-001', 
      'Merci pour votre question. Votre commande sera livrée sous 72 heures. Vous recevrez un email de confirmation dès l\'expédition.',
      'Service Client EkoNzims'
    );
    
    console.log('30. Satisfaction Survey...');
    await EmailService.sendSatisfactionSurvey(testEmail, 'ORD-12345', 'https://ekonzims.com/survey/ORD-12345');

    // === EMAILS DE SÉCURITÉ ===
    console.log('31. New Login Alert...');
    await EmailService.sendNewLoginAlert(
      testEmail, 
      '4 décembre 2025 à 14:30', 
      'Chrome sur Windows 11', 
      'Kinshasa, RDC', 
      '192.168.1.100'
    );

    // === EMAILS AUTOMATISÉS INTELLIGENTS ===
    console.log('32. Reorder Suggestion...');
    await EmailService.sendReorderSuggestion(testEmail, 'Détergent écologique', 'PROD-123', '4 novembre 2025', 30);
    
    console.log('33. Product Recommendations...');
    await EmailService.sendProductRecommendations(testEmail, [
      { name: 'Savon liquide bio', price: 12.99, description: 'Doux pour la peau' },
      { name: 'Brosse vaisselle écologique', price: 7.50, description: 'Fibres naturelles' },
      { name: 'Éponge loofah naturelle', price: 5.99, description: '100% biodégradable' }
    ], 'Détergent écologique');
    
    console.log('34. Eco Impact Report...');
    await EmailService.sendEcoImpactReport(testEmail, 'Novembre 2025', 15.5, 8.2, 4);

    console.log('\n✅ Tous les 34 types d\'emails ont été envoyés avec succès !');
    console.log('\n📧 Vérifiez le fichier backend/logs/emails.log pour voir les détails.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test des emails:', error);
  }
}

// Exécuter le test
testAllEmails().then(() => {
  console.log('\n🎉 Test terminé !');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
