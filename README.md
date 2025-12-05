# EkoNzims - Plateforme E-commerce et Nettoyage

EkoNzims est une plateforme intégrée combinant un site web et une application mobile pour les services d'e-commerce et de nettoyage écologique.

## 🌳 À Propos

- **E-commerce** : Vente de produits de nettoyage écologiques
- **Services** : Réservation de services de nettoyage professionnel
- **Multi-plateforme** : Web et Mobile (iOS/Android)
- **Technologie** : Node.js, React, React Native

## 📁 Structure du Projet

```
ekonzims.com/
├── backend/          # API REST et logique serveur
├── web/              # Application web React
├── mobile/           # Application mobile React Native
├── docs/             # Documentation
└── README.md         # Ce fichier
```

## 🚀 Démarrage Rapide

### Backend
```bash
cd backend
npm install
npm run dev
```

### Déploiement avec Docker Compose (local / serveur)

Ce dépôt inclut `Dockerfile` pour le backend et le web, et un fichier `docker-compose.yml` pour démarrer la base de données, l'API et le site web.

1) Construire et démarrer les services :

```powershell
cd C:\Users\LENOVO\Documents\GitHub\ekonzims.com
docker compose up --build -d
```

2) Arrêter et nettoyer :

```powershell
docker compose down
```

Remarques de sécurité :
- Placez vos secrets (SMTP, JWT, keys) dans un fichier `backend/.env` qui est déjà ignoré par Git.
- Changez les mots de passe et clés après tout test public ; ne commitez jamais de secrets.
- Pour la production, préférez un service géré (Render, Fly, Vercel, Heroku, AWS) et stockez les secrets dans leur vault.

Confidentialité :
- Le projet s'efforce de ne pas exposer d'informations personnelles. Avant de déployer publiquement, vérifiez et retirez toute donnée personnelle dans les fichiers de configuration et les logs.


### Web
```bash
cd web
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm start
```

## 📋 Fonctionnalités Principales

### E-commerce
- Catalogue de produits de nettoyage
- Panier d'achat
- Paiement sécurisé
- Gestion des commandes
- Suivi des livraisons

### Services de Nettoyage
- Réservation en ligne
- Devis automatiques
- Calendrier de disponibilités
- Évaluations et avis
- Facturations

### Utilisateurs
- Inscription/Connexion
- Profil utilisateur
- Historique commandes
- Liste de préférences

## 🛠️ Technologies

- **Backend** : Node.js, Express, MongoDB
- **Web** : React, Next.js, Tailwind CSS
- **Mobile** : React Native, Expo
- **Auth** : JWT
- **Paiement** : Stripe/PayPal

## 📝 Licence

À définir

## 👥 Contact

À définir
