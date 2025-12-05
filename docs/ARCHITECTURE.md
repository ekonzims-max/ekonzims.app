# 📋 Documentation EkoNzims

## Architecture Générale

```
┌─────────────────────────────────────────────────────────────┐
│                    EkoNzims Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Web App    │  │  Mobile App  │  │  Admin Panel │       │
│  │   (React)    │  │(React Native)│  │ (À implém.)  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                  │                │
│         └─────────────────┼──────────────────┘                │
│                           │                                   │
│                  ┌────────▼────────┐                          │
│                  │  API REST Node  │                          │
│                  │   (Express)     │                          │
│                  └────────┬────────┘                          │
│                           │                                   │
│         ┌─────────────────┼─────────────────┐                │
│         │                 │                 │                │
│    ┌────▼────┐    ┌──────▼──────┐   ┌──────▼──────┐         │
│    │ MongoDB  │    │   Firebase  │   │  Stripe API │        │
│    │ Database │    │ (Optional)  │   │  (Paiement) │        │
│    └──────────┘    └─────────────┘   └─────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration Initiale

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Editer .env avec vos variables
npm run dev
```

### Web Setup
```bash
cd web
npm install
npm run dev
# Ouvre sur http://localhost:3000
```

### Mobile Setup
```bash
cd mobile
npm install
npm start
# Scan le QR code avec Expo Go
```

## 📱 Modules Principaux

### Backend API Endpoints

#### Utilisateurs
- `POST /api/users/register` - Enregistrement
- `POST /api/users/login` - Connexion
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mise à jour profil

#### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails produit
- `POST /api/products` - Créer produit (admin)
- `DELETE /api/products/:id` - Supprimer produit (admin)

#### Commandes
- `POST /api/orders` - Créer commande
- `GET /api/orders/:id` - Détails commande
- `GET /api/orders` - Mes commandes
- `PUT /api/orders/:id/status` - Mettre à jour statut

#### Services
- `GET /api/services` - Liste services
- `POST /api/services/booking` - Réserver un service
- `GET /api/services/availability` - Disponibilités

#### Paiement
- `POST /api/payments/create-intent` - Créer paiement
- `POST /api/payments/webhook` - Webhook Stripe

## 🗄️ Schéma Base de Données

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  role: Enum('user', 'admin', 'service_provider'),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  image: String,
  sku: String,
  eco_certified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [
    {
      productId: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: Enum('pending', 'confirmed', 'shipped', 'delivered'),
  shippingAddress: Object,
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Service (Nettoyage)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  basePrice: Number,
  duration: Number,
  category: String,
  providers: [ObjectId],
  reviews: [
    {
      userId: ObjectId,
      rating: Number,
      comment: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  _id: ObjectId,
  serviceId: ObjectId,
  userId: ObjectId,
  providerId: ObjectId,
  scheduledDate: Date,
  status: Enum('pending', 'confirmed', 'in-progress', 'completed', 'cancelled'),
  address: Object,
  notes: String,
  price: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentification

- JWT utilisé pour l'authentification
- Tokens stockés en localStorage (web) et AsyncStorage (mobile)
- Refresh tokens pour l'extension de sessions
- Passwords hashed avec bcryptjs

## 💳 Paiement

- Stripe intégré pour les paiements
- Stripe Webhooks pour confirmation
- Gestion sécurisée des données bancaires
- Factures automatiques générées

## 🚀 Déploiement

### Backend (Heroku/Railway)
```bash
git push heroku main
```

### Web (Vercel)
```bash
vercel deploy
```

### Mobile (Expo/App Store)
```bash
eas build
```

## 📊 À Implémenter

- [ ] Authentification complète
- [ ] Système de panier persistant
- [ ] Paiement Stripe intégré
- [ ] Notification push
- [ ] Admin dashboard
- [ ] Système d'évaluation
- [ ] Chat support
- [ ] Analytics
- [ ] Email transactionnel

## 🐛 Support

Pour les problèmes, consultez la documentation complète ou créez une issue sur le repository.
