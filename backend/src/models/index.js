// Ce fichier permet de basculer automatiquement entre User (in-memory) et UserFirestore
// selon la configuration Firebase

const { isFirebaseEnabled } = require('../config/firebase');

// Charger le bon modèle selon la configuration
let UserModel;

if (isFirebaseEnabled()) {
  console.log('📊 Utilisation de Firestore pour le stockage des utilisateurs');
  UserModel = require('./UserFirestore');
} else {
  console.log('📊 Utilisation du stockage en mémoire pour les utilisateurs');
  UserModel = require('./User');
}

module.exports = UserModel;
