const User = require('../models/User');

async function checkUsers() {
  console.log('\n📊 Liste des utilisateurs:\n');

  const users = await User.getAll();

  if (users.length === 0) {
    console.log('❌ Aucun utilisateur trouvé dans la base de données.\n');
    console.log('✅ Le prochain compte créé sera automatiquement admin!\n');
  } else {
    console.log(`Total: ${users.length} utilisateur(s)\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Rôle: ${user.role === 'admin' ? '🔐 ADMIN' : '👤 USER'}`);
      console.log(`   Créé le: ${user.createdAt.toLocaleString('fr-FR')}`);
      console.log('');
    });

    const adminUsers = users.filter(u => u.role === 'admin');
    if (adminUsers.length > 0) {
      console.log(`✅ ${adminUsers.length} administrateur(s) trouvé(s):`);
      adminUsers.forEach(admin => console.log(`   - ${admin.email}`));
    } else {
      console.log('❌ Aucun administrateur trouvé.');
    }
    console.log('');
  }
}

checkUsers().catch(console.error);
