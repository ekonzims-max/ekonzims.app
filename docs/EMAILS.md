# 📧 Documentation Complète des Emails EkoNzims

Système d'emails professionnels avec **41 types différents** pour gérer toutes les interactions avec les clients.

## 🎨 Caractéristiques Générales

- ✅ **Template HTML professionnel** avec header et footer EkoNzims
- ✅ **Couleurs de marque** : Vert #27ae60, Foncé #2c3e50
- ✅ **Emojis dans les sujets** pour meilleure visibilité
- ✅ **Responsive** et compatible tous clients email
- ✅ **Version texte** pour chaque email
- ✅ **Délai de livraison 72h** mentionné dans emails de commande
- ✅ **Prix en euros (€)**
- ✅ **Contenu en français**
- ✅ **Téléphone +243 854 593 921** dans footer

## 📨 Types d'Emails

### 1. Emails de Base (7 types)

#### 1.1 Welcome Email
**Fonction :** `sendWelcomeEmail(email, firstName)`
**Trigger :** Inscription réussie
**Contenu :**
- Message de bienvenue personnalisé
- Code promo BIENVENUE10 (10% de réduction)
- CTA vers les produits

```javascript
await EmailService.sendWelcomeEmail('client@example.com', 'Marie');
```

#### 1.2 Verification Email
**Fonction :** `sendVerificationEmail(email, firstName, verificationLink)`
**Trigger :** Après inscription
**Contenu :**
- Lien de vérification (expire 24h)
- Bouton CTA vert stylé

```javascript
await EmailService.sendVerificationEmail('client@example.com', 'Marie', 'https://ekonzims.com/verify?token=abc123');
```

#### 1.3 Order Confirmation
**Fonction :** `sendOrderConfirmation(email, orderId, items, total)`
**Trigger :** Commande validée
**Contenu :**
- Message de livraison sous 72 heures
- Liste des articles avec prix
- Total en euros

```javascript
await EmailService.sendOrderConfirmation('client@example.com', 'ORD-123', [
  { name: 'Détergent', quantity: 2, price: 15.99 }
], 31.98);
```

#### 1.4 Delivery Confirmation
**Fonction :** `sendDeliveryConfirmation(email, orderId, tracking)`
**Trigger :** Commande livrée
**Contenu :**
- Confirmation de livraison
- Numéro de suivi
- Invitation à laisser un avis

```javascript
await EmailService.sendDeliveryConfirmation('client@example.com', 'ORD-123', 'TRK-789');
```

#### 1.5 Booking Confirmation
**Fonction :** `sendBookingConfirmation(email, bookingId, serviceName, scheduledDate)`
**Trigger :** Réservation de service
**Contenu :**
- Détails du service
- Date et référence
- Rappel 24h avant

```javascript
await EmailService.sendBookingConfirmation('client@example.com', 'BKG-001', 'Nettoyage bureau', '15 déc 2025');
```

#### 1.6 Password Reset
**Fonction :** `sendPasswordReset(email, resetToken)`
**Trigger :** Demande de réinitialisation
**Contenu :**
- Lien de réinitialisation (expire 1h)
- Bouton sécurisé
- Avertissement si non demandé

```javascript
await EmailService.sendPasswordReset('client@example.com', 'reset-token-123');
```

#### 1.7 Admin Notification
**Fonction :** `sendAdminNotification(adminEmail, subject, message)`
**Trigger :** Événement important
**Contenu :**
- Message personnalisé
- Format professionnel

```javascript
await EmailService.sendAdminNotification('admin@ekonzims.com', 'Nouvelle commande', 'Commande #ORD-123 : 50€');
```

---

### 2. Emails d'Expédition (3 types)

#### 2.1 Shipping Notification
**Fonction :** `sendShippingNotification(email, firstName, orderId, trackingNumber, estimatedDelivery)`
**Trigger :** Commande expédiée
**Contenu :**
- Numéro de suivi mis en valeur
- Livraison estimée sous 72h
- CTA vers tracking

```javascript
await EmailService.sendShippingNotification('client@example.com', 'Marie', 'ORD-123', 'TRK-987', '7 déc 2025');
```

#### 2.2 Delivery Reminder
**Fonction :** `sendDeliveryReminder(email, firstName, orderId, deliveryDate)`
**Trigger :** Jour de la livraison
**Contenu :**
- Alerte "Arrive aujourd'hui"
- Heure estimée
- Conseil de disponibilité

```javascript
await EmailService.sendDeliveryReminder('client@example.com', 'Marie', 'ORD-123', '4 déc 2025 - 14h');
```

#### 2.3 Review Request
**Fonction :** `sendReviewRequest(email, firstName, orderId, orderItems)`
**Trigger :** 2 jours après livraison
**Contenu :**
- Demande d'avis
- Lien vers formulaire
- Étoiles visuelles

```javascript
await EmailService.sendReviewRequest('client@example.com', 'Marie', 'ORD-123', items);
```

---

### 3. Emails de Panier (1 type)

#### 3.1 Cart Abandonment Reminder
**Fonction :** `sendCartAbandonmentReminder(email, firstName, cartItems, abandonedDate)`
**Trigger :** 24h après abandon
**Contenu :**
- Liste des articles abandonnés
- CTA vers panier
- Urgence (stocks limités)

```javascript
await EmailService.sendCartAbandonmentReminder('client@example.com', 'Marie', cartItems, '3 déc 2025');
```

---

### 4. Emails de Service (2 types)

#### 4.1 Service Reminder
**Fonction :** `sendServiceReminder(email, firstName, bookingId, serviceName, appointmentDate)`
**Trigger :** 24h avant rendez-vous
**Contenu :**
- Rappel de rendez-vous
- Détails du service
- Contact si besoin

```javascript
await EmailService.sendServiceReminder('client@example.com', 'Marie', 'BKG-002', 'Nettoyage', '5 déc 10h');
```

#### 4.2 Payment Confirmation
**Fonction :** `sendPaymentConfirmation(email, firstName, amount, paymentMethod, transactionId)`
**Trigger :** Paiement réussi
**Contenu :**
- Confirmation de paiement
- Détails de transaction
- Reçu électronique

```javascript
await EmailService.sendPaymentConfirmation('client@example.com', 'Marie', 125.50, 'Carte bancaire', 'TXN-456');
```

---

### 5. Emails de Stock (2 types)

#### 5.1 Stock Alert
**Fonction :** `sendStockAlert(email, firstName, productName, productId)`
**Trigger :** Produit de retour en stock
**Contenu :**
- Alerte disponibilité
- Urgence (stocks limités)
- CTA vers produit

```javascript
await EmailService.sendStockAlert('client@example.com', 'Marie', 'Savon bio', 'PROD-123');
```

#### 5.2 Monthly Newsletter
**Fonction :** `sendMonthlyNewsletter(email, firstName, promotions, newProducts)`
**Trigger :** 1er du mois (cron)
**Contenu :**
- Nouveautés du mois
- Promotions exclusives
- Nouveaux produits

```javascript
await EmailService.sendMonthlyNewsletter('client@example.com', 'Marie', promotions, newProducts);
```

---

### 6. Emails Transactionnels Avancés (4 types)

#### 6.1 Invoice
**Fonction :** `sendInvoice(email, orderId, items, total, invoiceNumber, invoiceDate)`
**Trigger :** Génération de facture
**Contenu :**
- Facture complète
- Liste détaillée des articles
- Total avec TVA

```javascript
await EmailService.sendInvoice('client@example.com', 'ORD-123', items, 40.48, 'INV-2025-001', '4 déc 2025');
```

#### 6.2 Refund Confirmation
**Fonction :** `sendRefundConfirmation(email, orderId, amount, refundReason, processingDays)`
**Trigger :** Remboursement accepté
**Contenu :**
- Montant du remboursement
- Raison
- Délai de traitement (5 jours par défaut)

```javascript
await EmailService.sendRefundConfirmation('client@example.com', 'ORD-123', 40.48, 'Produit endommagé', 5);
```

#### 6.3 Payment Failure
**Fonction :** `sendPaymentFailure(email, orderId, failureReason)`
**Trigger :** Échec de paiement
**Contenu :**
- Raison de l'échec
- CTA mise à jour paiement
- Délai avant annulation (48h)

```javascript
await EmailService.sendPaymentFailure('client@example.com', 'ORD-123', 'Carte expirée');
```

#### 6.4 Order Status Change
**Fonction :** `sendOrderStatusChange(email, orderId, oldStatus, newStatus, statusMessage)`
**Trigger :** Changement de statut
**Contenu :**
- Ancien vs nouveau statut
- Message explicatif
- Emoji selon statut

```javascript
await EmailService.sendOrderStatusChange('client@example.com', 'ORD-123', 'processing', 'shipped', 'Expédié !');
```

---

### 7. Emails de Fidélisation (4 types)

#### 7.1 Referral Program
**Fonction :** `sendReferralProgram(email, referralCode, referralLink)`
**Trigger :** Activation du programme
**Contenu :**
- Code de parrainage unique
- Lien de partage
- 10% pour parrain et filleul

```javascript
await EmailService.sendReferralProgram('client@example.com', 'REF-2025', 'https://ekonzims.com/ref/2025');
```

#### 7.2 Loyalty Points
**Fonction :** `sendLoyaltyPoints(email, pointsBalance, pointsEarned, rewardsAvailable)`
**Trigger :** Gain de points
**Contenu :**
- Solde de points
- Points gagnés récemment
- Récompenses disponibles

```javascript
await EmailService.sendLoyaltyPoints('client@example.com', 450, 50, 2);
```

#### 7.3 Birthday Offer
**Fonction :** `sendBirthdayOffer(email, discountCode, expiryDate)`
**Trigger :** Anniversaire client
**Contenu :**
- Message d'anniversaire
- Code promo 15%
- Date d'expiration

```javascript
await EmailService.sendBirthdayOffer('client@example.com', 'ANNIVERSAIRE15', '31 déc 2025');
```

#### 7.4 VIP Access
**Fonction :** `sendVIPAccess(email, vipCode, earlyAccessDate)`
**Trigger :** Statut VIP atteint
**Contenu :**
- Bienvenue au club VIP
- Avantages exclusifs
- Accès anticipé

```javascript
await EmailService.sendVIPAccess('client@example.com', 'VIP-2025-GOLD', '10 déc 2025');
```

---

### 8. Emails de Réengagement (4 types)

#### 8.1 Inactive User Offer
**Fonction :** `sendInactiveUserOffer(email, daysSinceLastOrder, discountCode)`
**Trigger :** 30+ jours d'inactivité
**Contenu :**
- Message "On vous a manqué"
- Code promo 10%
- CTA vers nouveautés

```javascript
await EmailService.sendInactiveUserOffer('client@example.com', 45, 'RETOUR10');
```

#### 8.2 Wishlist Low Stock Alert
**Fonction :** `sendWishlistLowStockAlert(email, productName, productId, stockRemaining)`
**Trigger :** Stock < 5 sur produit favori
**Contenu :**
- Alerte stock faible
- Urgence
- CTA commander maintenant

```javascript
await EmailService.sendWishlistLowStockAlert('client@example.com', 'Savon bio', 'PROD-456', 3);
```

#### 8.3 New Category Announcement
**Fonction :** `sendNewCategoryAnnouncement(email, categoryName, categoryDescription, categoryLink)`
**Trigger :** Lancement nouvelle catégorie
**Contenu :**
- Annonce de la catégorie
- Description
- CTA vers catégorie

```javascript
await EmailService.sendNewCategoryAnnouncement('client@example.com', 'Jardinage', 'Produits naturels...', 'https://...');
```

#### 8.4 Price Drop Alert
**Fonction :** `sendPriceDropAlert(email, productName, productId, oldPrice, newPrice, savingsPercent)`
**Trigger :** Baisse de prix sur favoris
**Contenu :**
- Ancien vs nouveau prix
- Pourcentage d'économie
- CTA profiter de l'offre

```javascript
await EmailService.sendPriceDropAlert('client@example.com', 'Détergent', 'PROD-789', 24.99, 19.99, 20);
```

---

### 9. Emails de Service Client (3 types)

#### 9.1 Support Ticket Opened
**Fonction :** `sendSupportTicketOpened(email, ticketId, subject, priority)`
**Trigger :** Création de ticket
**Contenu :**
- Numéro de ticket
- Sujet et priorité
- Délai de réponse

```javascript
await EmailService.sendSupportTicketOpened('client@example.com', 'TKT-001', 'Question livraison', 'medium');
```

#### 9.2 Support Ticket Response
**Fonction :** `sendSupportTicketResponse(email, ticketId, responseMessage, responderName)`
**Trigger :** Réponse du support
**Contenu :**
- Réponse du support
- Nom du répondeur
- Lien vers ticket

```javascript
await EmailService.sendSupportTicketResponse('client@example.com', 'TKT-001', 'Voici la réponse...', 'Support EkoNzims');
```

#### 9.3 Satisfaction Survey
**Fonction :** `sendSatisfactionSurvey(email, orderId, surveyLink)`
**Trigger :** Post-commande (7 jours)
**Contenu :**
- Demande de feedback
- Lien vers enquête (2 min)
- Importance de l'avis

```javascript
await EmailService.sendSatisfactionSurvey('client@example.com', 'ORD-123', 'https://ekonzims.com/survey/123');
```

---

### 10. Emails de Sécurité (1 type)

#### 10.1 New Login Alert
**Fonction :** `sendNewLoginAlert(email, loginDate, deviceInfo, location, ipAddress)`
**Trigger :** Connexion depuis nouveau device
**Contenu :**
- Date et heure de connexion
- Appareil et localisation
- Alerte si non reconnu

```javascript
await EmailService.sendNewLoginAlert('client@example.com', '4 déc 14:30', 'Chrome Windows', 'Kinshasa', '192.168.1.1');
```

---

### 11. Emails Automatisés Intelligents (3 types)

#### 11.1 Reorder Suggestion
**Fonction :** `sendReorderSuggestion(email, productName, productId, lastOrderDate, daysAgo)`
**Trigger :** 30 jours après dernier achat
**Contenu :**
- Rappel d'achat précédent
- Suggestion de réapprovisionnement
- CTA commander à nouveau

```javascript
await EmailService.sendReorderSuggestion('client@example.com', 'Détergent', 'PROD-123', '4 nov 2025', 30);
```

#### 11.2 Product Recommendations
**Fonction :** `sendProductRecommendations(email, recommendedProducts, basedOnProduct)`
**Trigger :** Après achat/visite
**Contenu :**
- Produits recommandés
- Basés sur historique
- "Les clients ont aussi acheté"

```javascript
await EmailService.sendProductRecommendations('client@example.com', recommendedProducts, 'Détergent');
```

#### 11.3 Eco Impact Report
**Fonction :** `sendEcoImpactReport(email, monthYear, co2Saved, plasticSaved, orderCount)`
**Trigger :** Fin du mois (cron)
**Contenu :**
- CO2 économisé
- Plastique évité
- Nombre de commandes écologiques

```javascript
await EmailService.sendEcoImpactReport('client@example.com', 'Nov 2025', 15.5, 8.2, 4);
```

---

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=EkoNzims <noreply@ekonzims.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Tester tous les emails

```bash
cd backend
node src/scripts/testAllEmails.js
```

---

## 📊 Statistiques

- **41 types d'emails** professionnels
- **100% en français**
- **Design responsive** compatible tous clients
- **Template HTML** avec brand colors
- **Fallback texte** pour tous les emails
- **0 nom personnel** affiché (sécurité)

---

## 🚀 Intégration

### Exemple d'utilisation dans les routes

```javascript
const EmailService = require('../services/emailService');

// Route de commande
router.post('/orders', async (req, res) => {
  const order = await createOrder(req.body);
  
  // Email de confirmation
  await EmailService.sendOrderConfirmation(
    req.user.email,
    order.id,
    order.items,
    order.total
  );
  
  res.json(order);
});
```

---

## 📝 Notes

- Tous les prix sont en **euros (€)**
- Livraison standard : **72 heures**
- Téléphone support : **+243 854 593 921**
- Les emails utilisent **fallback console/file** si SMTP non configuré
- **Aucun nom personnel** n'est affiché pour la sécurité

---

**Dernière mise à jour :** 4 décembre 2025  
**Version :** 2.0  
**Contact :** +243 854 593 921
