const admin = require('firebase-admin');
require('dotenv').config();

// Configuration Firebase
// Vous pouvez utiliser soit les credentials JSON, soit les variables d'environnement
let firebaseApp;

try {
  // Option 1: Utiliser un fichier de credentials (recommandé pour production)
  if (process.env.FIREBASE_CREDENTIALS_PATH) {
    const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }
  // Option 2: Utiliser les variables d'environnement
  else if (process.env.FIREBASE_PROJECT_ID) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }
  // Option 3: Mode développement sans Firebase (fallback à in-memory)
  else {
    console.log('⚠️  Firebase non configuré - Mode développement (in-memory)');
    firebaseApp = null;
  }
  
  if (firebaseApp) {
    console.log('✅ Firebase initialisé avec succès');
  }
} catch (error) {
  console.error('❌ Erreur d\'initialisation Firebase:', error.message);
  console.log('⚠️  Utilisation du mode in-memory');
  firebaseApp = null;
}

// Exporter Firestore DB
const db = firebaseApp ? admin.firestore() : null;

// Si Firestore est disponible, configurer les settings
if (db) {
  db.settings({
    ignoreUndefinedProperties: true,
    timestampsInSnapshots: true
  });
}

module.exports = {
  admin,
  db,
  isFirebaseEnabled: () => db !== null
};
