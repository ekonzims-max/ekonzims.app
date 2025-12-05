const cron = require('node-cron');
const EmailService = require('../services/emailService');
const User = require('../models/User');
const Order = require('../models/Order');

/**
 * Configuration des tâches automatisées par email
 * Nécessite: npm install node-cron
 */

class EmailScheduler {
  
  // Newsletter mensuelle - 1er de chaque mois à 9h
  static scheduleMonthlyNewsletter() {
    cron.schedule('0 9 1 * *', async () => {
      console.log('📧 Envoi de la newsletter mensuelle...');
      
      try {
        const users = User.getAll();
        const monthYear = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        
        // Promotions du mois (à adapter selon votre logique)
        const promotions = [
          { title: '20% sur les produits de nettoyage', description: 'Valable tout le mois' },
          { title: 'Livraison gratuite', description: 'Dès 50€ d\'achat' }
        ];
        
        // Nouveaux produits (à adapter)
        const newProducts = [
          { name: 'Savon naturel', price: 8.50 },
          { name: 'Brosse écologique', price: 12.99 }
        ];
        
        const promises = users.map(user =>
          EmailService.sendMonthlyNewsletter(user.email, user.firstName || 'Client', promotions, newProducts)
        );
        
        await Promise.all(promises);
        console.log(`✅ Newsletter envoyée à ${users.length} utilisateurs`);
      } catch (error) {
        console.error('❌ Erreur envoi newsletter:', error);
      }
    });
  }

  // Rapport d'impact écologique - dernier jour du mois à 18h
  static scheduleEcoImpactReports() {
    cron.schedule('0 18 28-31 * *', async () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Vérifier si demain est le 1er du mois (donc aujourd'hui est le dernier jour)
      if (tomorrow.getDate() !== 1) return;
      
      console.log('🌍 Envoi des rapports d\'impact écologique...');
      
      try {
        const users = User.getAll();
        const orders = Order.getAll();
        const monthYear = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        
        const promises = users.map(user => {
          const userOrders = orders.filter(o => o.userId === user.id);
          const co2Saved = (userOrders.length * 2.5).toFixed(1);
          const plasticSaved = (userOrders.length * 1.2).toFixed(1);
          
          return EmailService.sendEcoImpactReport(
            user.email,
            monthYear,
            co2Saved,
            plasticSaved,
            userOrders.length
          );
        });
        
        await Promise.all(promises);
        console.log(`✅ Rapports envoyés à ${users.length} utilisateurs`);
      } catch (error) {
        console.error('❌ Erreur envoi rapports:', error);
      }
    });
  }

  // Rappels de panier abandonné - tous les jours à 10h
  static scheduleCartAbandonmentReminders() {
    cron.schedule('0 10 * * *', async () => {
      console.log('🛒 Vérification des paniers abandonnés...');
      
      try {
        // À implémenter: récupérer les paniers abandonnés depuis plus de 24h
        // Pour l'exemple, on simule
        const abandonedCarts = []; // Votre logique ici
        
        const promises = abandonedCarts.map(cart =>
          EmailService.sendCartAbandonmentReminder(
            cart.userEmail,
            cart.firstName || 'Client',
            cart.items,
            cart.abandonedDate
          )
        );
        
        await Promise.all(promises);
        console.log(`✅ Rappels envoyés pour ${abandonedCarts.length} paniers`);
      } catch (error) {
        console.error('❌ Erreur rappels panier:', error);
      }
    });
  }

  // Suggestions de réapprovisionnement - tous les lundis à 9h
  static scheduleReorderSuggestions() {
    cron.schedule('0 9 * * 1', async () => {
      console.log('🔄 Envoi des suggestions de réapprovisionnement...');
      
      try {
        const users = User.getAll();
        const orders = Order.getAll();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const promises = [];
        
        users.forEach(user => {
          const userOrders = orders.filter(o => 
            o.userId === user.id && 
            new Date(o.createdAt) <= thirtyDaysAgo &&
            new Date(o.createdAt) >= new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
          );
          
          userOrders.forEach(order => {
            order.items?.forEach(item => {
              promises.push(
                EmailService.sendReorderSuggestion(
                  user.email,
                  item.name,
                  item.id || 'PROD-123',
                  new Date(order.createdAt).toLocaleDateString('fr-FR'),
                  30
                )
              );
            });
          });
        });
        
        await Promise.all(promises);
        console.log(`✅ ${promises.length} suggestions envoyées`);
      } catch (error) {
        console.error('❌ Erreur suggestions:', error);
      }
    });
  }

  // Rappels de rendez-vous - tous les jours à 10h (24h avant)
  static scheduleServiceReminders() {
    cron.schedule('0 10 * * *', async () => {
      console.log('⏰ Envoi des rappels de rendez-vous...');
      
      try {
        // À implémenter: récupérer les rendez-vous de demain
        const tomorrowBookings = []; // Votre logique ici
        
        const promises = tomorrowBookings.map(booking =>
          EmailService.sendServiceReminder(
            booking.userEmail,
            booking.firstName || 'Client',
            booking.id,
            booking.serviceName,
            booking.appointmentDate
          )
        );
        
        await Promise.all(promises);
        console.log(`✅ Rappels envoyés pour ${tomorrowBookings.length} rendez-vous`);
      } catch (error) {
        console.error('❌ Erreur rappels rendez-vous:', error);
      }
    });
  }

  // Demandes d'avis - tous les jours à 16h (2 jours après livraison)
  static scheduleReviewRequests() {
    cron.schedule('0 16 * * *', async () => {
      console.log('⭐ Envoi des demandes d\'avis...');
      
      try {
        const orders = Order.getAll();
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        
        const recentlyDelivered = orders.filter(o => 
          o.status === 'delivered' &&
          new Date(o.deliveredAt) <= twoDaysAgo &&
          new Date(o.deliveredAt) >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        );
        
        const promises = recentlyDelivered.map(order => {
          const user = User.findById(order.userId);
          return EmailService.sendReviewRequest(
            user.email,
            user.firstName || 'Client',
            order.id,
            order.items || []
          );
        });
        
        await Promise.all(promises);
        console.log(`✅ Demandes envoyées pour ${recentlyDelivered.length} commandes`);
      } catch (error) {
        console.error('❌ Erreur demandes d\'avis:', error);
      }
    });
  }

  // Clients inactifs - tous les lundis à 10h
  static scheduleInactiveUserOffers() {
    cron.schedule('0 10 * * 1', async () => {
      console.log('💚 Envoi des offres de réengagement...');
      
      try {
        const users = User.getAll();
        const orders = Order.getAll();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const inactiveUsers = users.filter(user => {
          const userOrders = orders.filter(o => o.userId === user.id);
          if (userOrders.length === 0) return false;
          
          const lastOrder = userOrders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          
          return lastOrder && new Date(lastOrder.createdAt) < thirtyDaysAgo;
        });
        
        const promises = inactiveUsers.map(user => {
          const userOrders = orders.filter(o => o.userId === user.id);
          const lastOrder = userOrders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          
          const daysSinceLastOrder = lastOrder ? 
            Math.floor((Date.now() - new Date(lastOrder.createdAt)) / (1000 * 60 * 60 * 24)) : 90;
          
          return EmailService.sendInactiveUserOffer(
            user.email,
            daysSinceLastOrder,
            'RETOUR10'
          );
        });
        
        await Promise.all(promises);
        console.log(`✅ Offres envoyées à ${inactiveUsers.length} utilisateurs inactifs`);
      } catch (error) {
        console.error('❌ Erreur offres réengagement:', error);
      }
    });
  }

  // Anniversaires - tous les jours à 8h
  static scheduleBirthdayOffers() {
    cron.schedule('0 8 * * *', async () => {
      console.log('🎂 Envoi des offres d\'anniversaire...');
      
      try {
        const users = User.getAll();
        const today = new Date();
        
        const birthdayUsers = users.filter(user => {
          if (!user.birthDate) return false;
          const birthDate = new Date(user.birthDate);
          return birthDate.getDate() === today.getDate() && 
                 birthDate.getMonth() === today.getMonth();
        });
        
        const promises = birthdayUsers.map(user =>
          EmailService.sendBirthdayOffer(
            user.email,
            `ANNIVERSAIRE${user.id}`,
            new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
          )
        );
        
        await Promise.all(promises);
        console.log(`✅ ${birthdayUsers.length} offres d'anniversaire envoyées`);
      } catch (error) {
        console.error('❌ Erreur offres anniversaire:', error);
      }
    });
  }

  // Initialiser toutes les tâches
  static initAll() {
    console.log('🚀 Initialisation des tâches automatisées d\'emails...\n');
    
    this.scheduleMonthlyNewsletter();
    console.log('✓ Newsletter mensuelle: 1er de chaque mois à 9h');
    
    this.scheduleEcoImpactReports();
    console.log('✓ Rapports écologiques: Dernier jour du mois à 18h');
    
    this.scheduleCartAbandonmentReminders();
    console.log('✓ Rappels panier abandonné: Tous les jours à 10h');
    
    this.scheduleReorderSuggestions();
    console.log('✓ Suggestions réapprovisionnement: Lundis à 9h');
    
    this.scheduleServiceReminders();
    console.log('✓ Rappels rendez-vous: Tous les jours à 10h');
    
    this.scheduleReviewRequests();
    console.log('✓ Demandes d\'avis: Tous les jours à 16h');
    
    this.scheduleInactiveUserOffers();
    console.log('✓ Offres réengagement: Lundis à 10h');
    
    this.scheduleBirthdayOffers();
    console.log('✓ Offres anniversaire: Tous les jours à 8h');
    
    console.log('\n✅ Toutes les tâches automatisées sont configurées !');
  }
}

module.exports = EmailScheduler;
