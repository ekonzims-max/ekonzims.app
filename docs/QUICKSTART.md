# Guide de Démarrage Rapide

## Prérequis
- Node.js 16+
- npm ou yarn
- MongoDB local ou Atlas
- Compte Stripe (optionnel mais recommandé)

## Installation Rapide

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/ekonzims.com.git
cd ekonzims.com
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Editer .env avec vos données
npm run dev
```

### 3. Web
```bash
cd web
npm install
npm run dev
```

Accédez à `http://localhost:3000`

### 4. Mobile
```bash
cd mobile
npm install
npm start
```

Scannez le QR code avec Expo Go

## Variables d'Environnement Backend

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ekonzims
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## API Locale

- Backend: `http://localhost:5000/api`
- Web: `http://localhost:3000`
- Mobile: Exposer sur `http://votre_ip:5000/api`

## Commandes Utiles

### Backend
```bash
npm run dev        # Démarrage en développement
npm test          # Lancer les tests
npm run lint      # Vérifier le code
```

### Web
```bash
npm start         # Démarrage
npm build         # Production build
npm test          # Tests
```

### Mobile
```bash
npm start         # Démarrage
npm run android   # Ouvrir sur Android
npm run ios       # Ouvrir sur iOS
```

## Structure des Dossiers

```
backend/
├── src/
│   ├── server.js          # Point d'entrée
│   ├── routes/            # Routes API
│   ├── controllers/       # Logique métier
│   ├── models/            # Schémas MongoDB
│   ├── middleware/        # Middleware Express
│   └── config/            # Configuration
├── package.json
└── .env

web/
├── src/
│   ├── App.js             # Composant racine
│   ├── pages/             # Pages
│   ├── components/        # Composants réutilisables
│   ├── services/          # Appels API
│   └── styles/            # CSS
├── public/
└── package.json

mobile/
├── App.js                 # Point d'entrée
├── screens/               # Écrans
├── components/            # Composants
├── services/              # Appels API
└── package.json
```

## Troubleshooting

### Erreur MongoDB
```
Assurez-vous que MongoDB fonctionne ou utilisez MongoDB Atlas
```

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :5000
# Tuer le processus
kill -9 <PID>
```

### Module not found
```bash
rm -rf node_modules
npm install
```

## Prochaines Étapes

1. Implémenter l'authentification JWT
2. Créer les modèles de base de données
3. Implémenter CRUD produits
4. Intégrer Stripe
5. Tester sur mobile
6. Déployer sur un serveur de production

## Aide

Pour des questions, consultez la documentation complète dans `docs/` ou créez une issue.
