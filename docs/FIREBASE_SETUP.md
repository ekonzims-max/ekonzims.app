# 🔥 Configuration Firebase Firestore pour EkoNzims

## Vue d'ensemble

Le système supporte maintenant **Firebase Firestore** comme base de données persistante, avec un **fallback automatique** vers le stockage en mémoire si Firebase n'est pas configuré.

## 📋 Avantages de Firestore

✅ **Persistance des données** - Les données survivent aux redémarrages  
✅ **Scalabilité** - Gère facilement des milliers d'utilisateurs  
✅ **Temps réel** - Synchronisation instantanée  
✅ **Sécurité** - Règles de sécurité intégrées  
✅ **Gratuit** - Plan gratuit généreux (50k lectures/jour)

## 🚀 Configuration Firebase

### Étape 1: Créer un projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur **"Ajouter un projet"**
3. Nom du projet: `ekonzims` (ou votre choix)
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur **"Créer le projet"**

### Étape 2: Activer Firestore

1. Dans votre projet Firebase, allez à **"Firestore Database"**
2. Cliquez sur **"Créer une base de données"**
3. Choisissez **"Mode production"** (vous pourrez modifier les règles après)
4. Sélectionnez la région: **`europe-west`** (le plus proche de l'Europe)
5. Cliquez sur **"Activer"**

### Étape 3: Générer les credentials

1. Dans Firebase Console, allez à **⚙️ Paramètres du projet**
2. Onglet **"Comptes de service"**
3. Cliquez sur **"Générer une nouvelle clé privée"**
4. Un fichier JSON sera téléchargé (ex: `ekonzims-firebase-adminsdk-xxxxx.json`)

### Étape 4: Configurer l'application

**Option A: Utiliser le fichier de credentials (Recommandé)**

1. Renommez le fichier téléchargé en `firebase-credentials.json`
2. Placez-le dans `backend/config/firebase-credentials.json`
3. Dans `backend/.env`, décommentez et configurez:

```env
FIREBASE_CREDENTIALS_PATH=./config/firebase-credentials.json
FIREBASE_PROJECT_ID=votre-project-id
```

**Option B: Utiliser Application Default Credentials**

1. Installez Google Cloud SDK
2. Exécutez: `gcloud auth application-default login`
3. Dans `backend/.env`:

```env
FIREBASE_PROJECT_ID=votre-project-id
```

### Étape 5: Configurer les règles de sécurité Firestore

Dans Firebase Console > Firestore Database > Règles:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection users - lecture admin uniquement
    match /users/{userId} {
      allow read: if request.auth != null && 
                    (request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Collection orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // Collection services
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Collection products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🔄 Mode de fonctionnement

### Avec Firebase configuré
```
✅ Firebase initialisé avec succès
📊 Toutes les données sont stockées dans Firestore
🔄 Persistance garantie entre les redémarrages
```

### Sans Firebase configuré
```
⚠️  Firebase non configuré - Mode développement (in-memory)
📊 Les données sont stockées en mémoire
⚠️  Les données seront perdues au redémarrage
```

## 📝 Utilisation dans le code

Le modèle User a été adapté pour utiliser Firestore de manière transparente:

```javascript
// Les méthodes sont maintenant async
const user = await User.findByEmail('test@example.com');
const allUsers = await User.getAll();
const newUser = await User.create('email@example.com', 'password', 'John', 'Doe');
```

## 🔧 Migration des données existantes

Si vous avez déjà des utilisateurs en mémoire et souhaitez les migrer vers Firestore:

```javascript
// Script de migration (à créer si nécessaire)
const User = require('./models/User');
const UserFirestore = require('./models/UserFirestore');

async function migrate() {
  const inMemoryUsers = User.getAll(); // Anciens utilisateurs
  
  for (const user of inMemoryUsers) {
    await UserFirestore.create(
      user.email, 
      user.password, // Déjà hashé
      user.firstName,
      user.lastName,
      user.phone
    );
  }
  
  console.log(`✅ ${inMemoryUsers.length} utilisateurs migrés`);
}
```

## 🧪 Test de la configuration

Pour vérifier que Firebase fonctionne:

```bash
cd backend
node -e "const {db, isFirebaseEnabled} = require('./src/config/firebase'); console.log('Firebase enabled:', isFirebaseEnabled());"
```

## 📊 Collections Firestore

### Collection: `users`
```javascript
{
  id: "uuid-auto-generated",
  email: "user@example.com",
  password: "hashed-password",
  firstName: "John",
  lastName: "Doe",
  phone: "+243...",
  role: "user" | "admin",
  emailVerified: true,
  createdAt: Timestamp,
  // ... autres champs
}
```

### Collection: `orders` (à venir)
### Collection: `services` (à venir)
### Collection: `products` (à venir)

## 🔐 Sécurité

⚠️ **IMPORTANT**: Ne committez JAMAIS le fichier `firebase-credentials.json` !

Ajoutez à `.gitignore`:
```
backend/config/firebase-credentials.json
```

## 💰 Coûts

Plan gratuit Firebase (Spark):
- ✅ 50,000 lectures/jour
- ✅ 20,000 écritures/jour
- ✅ 20,000 suppressions/jour
- ✅ 1 GB de stockage

Pour EkoNzims, cela devrait être largement suffisant pour commencer !

## 🆘 Dépannage

### Erreur: "Could not load the default credentials"
**Solution**: Vérifiez que `FIREBASE_CREDENTIALS_PATH` pointe vers le bon fichier

### Erreur: "Permission denied"
**Solution**: Vérifiez les règles de sécurité Firestore

### Les données ne persistent pas
**Solution**: Vérifiez que Firebase est bien initialisé (voir les logs au démarrage)

## 📚 Ressources

- Documentation Firebase: https://firebase.google.com/docs/firestore
- Console Firebase: https://console.firebase.google.com/
- Tarification: https://firebase.google.com/pricing

---

**Status actuel**: Mode développement (in-memory)  
**Pour activer Firestore**: Suivez les étapes ci-dessus
