const User = require('../models/User');

async function createSuperAdmin() {
  console.log('\n🔐 Création du compte Super-Admin...\n');

  try {
    // Vérifier si un utilisateur existe déjà avec cet email
    const existingUser = await User.findByEmail('nziminzimij@gmail.com');
    
    if (existingUser) {
      console.log('⚠️  Un compte existe déjà avec cet email.');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Rôle actuel: ${existingUser.role}`);
      
      // Promouvoir en admin si ce n'est pas déjà le cas
      if (existingUser.role !== 'admin') {
        await User.makeAdmin(existingUser.id);
        console.log('✅ Compte promu en admin avec succès!\n');
      } else {
        console.log('✅ Ce compte est déjà admin.\n');
      }
    } else {
      // Créer le nouveau compte super-admin
      const superAdmin = await User.create(
        'nziminzimij@gmail.com',
        '16021968',
        'Super',
        'Admin',
        '+243 854 593 921',
        '',
        '',
        ''
      );
      
      // Forcer le rôle admin (normalement le premier compte est déjà admin)
      superAdmin.role = 'admin';
      superAdmin.emailVerified = true; // Auto-vérifier l'email
      
      console.log('✅ Compte Super-Admin créé avec succès!\n');
      console.log('📧 Email: nziminzimij@gmail.com');
      console.log('🔑 Mot de passe: 16021968');
      console.log('🔐 Rôle: ADMIN');
      console.log('✉️  Email vérifié: Oui');
      console.log(`🆔 ID: ${superAdmin.id}\n`);
    }
    
    // Afficher tous les admins
    const allUsers = await User.getAll();
    const admins = allUsers.filter(u => u.role === 'admin');
    
    console.log(`📊 Total utilisateurs: ${allUsers.length}`);
    console.log(`👑 Total administrateurs: ${admins.length}\n`);
    
    if (admins.length > 0) {
      console.log('Liste des administrateurs:');
      admins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.email} (ID: ${admin.id})`);
      });
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createSuperAdmin().catch(console.error);
