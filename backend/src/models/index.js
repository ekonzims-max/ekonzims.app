// Ce fichier permet de basculer automatiquement entre User (in-memory), UserSupabase et UserFirestore
// selon la configuration

const { isFirebaseEnabled } = require('../config/firebase');
const { isSupabaseEnabled } = require('../config/supabase');

// Charger le bon modèle selon la configuration
let UserModel;

if (isSupabaseEnabled()) {
  console.log('📊 Utilisation de Supabase PostgreSQL pour le stockage des utilisateurs');
  UserModel = require('./UserSupabase');
} else if (isFirebaseEnabled()) {
  console.log('📊 Utilisation de Firestore pour le stockage des utilisateurs');
  UserModel = require('./UserFirestore');
} else {
  console.log('📊 Utilisation du stockage en mémoire pour les utilisateurs');
  UserModel = require('./User');
}

module.exports = UserModel;
