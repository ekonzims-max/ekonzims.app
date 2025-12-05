# 🚀 GUIDE RAPIDE - DÉPLOIEMENT RAILWAY

## 📋 VARIABLES D'ENVIRONNEMENT À COPIER-COLLER

### ✅ BACKEND (9 variables)

```
PORT=5000
JWT_SECRET=ekonzims_jwt_secret_2025_super_securise_prod
SESSION_SECRET=ekonzims_session_secret_2025_super_securise_prod
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=ekonzims@gmail.com
EMAIL_PASS=wpls pojb wbmd acjh
NODE_ENV=production
```

**⚠️ IMPORTANT :** Après avoir configuré le frontend, revenez ajouter :
```
FRONTEND_URL=https://[adresse-de-votre-web].up.railway.app
```

---

### ✅ FRONTEND (1 variable)

**⚠️ À AJOUTER APRÈS avoir copié l'adresse du backend :**
```
REACT_APP_API_URL=https://[adresse-de-votre-backend].up.railway.app
```

---

## 🎯 ÉTAPES ULTRA-RAPIDES

### 1️⃣ CRÉER LE PROJET (2 min)
1. Allez sur : **https://railway.app**
2. Cliquez **"Start a New Project"**
3. Choisissez **"Login with GitHub"**
4. Autorisez Railway
5. Cliquez **"+ New Project"** → **"Deploy from GitHub repo"**
6. Sélectionnez **"ekonzims-max/ekonzims.com"**
7. Cliquez **"Deploy"**

### 2️⃣ AJOUTER POSTGRESQL (30 sec)
1. Cliquez **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. C'est fait ! ✅

### 3️⃣ CONFIGURER BACKEND (3 min)
1. Cliquez sur la boîte **"backend"**
2. Onglet **"Variables"**
3. Copiez-collez les 9 variables ci-dessus UNE PAR UNE
4. Onglet **"Settings"** → Section **"Domains"**
5. **COPIEZ l'URL** (exemple: `backend-production-xyz.up.railway.app`)

### 4️⃣ CONFIGURER FRONTEND (1 min)
1. Retournez au projet (cliquez sur le nom en haut)
2. Cliquez sur **"web"**
3. Onglet **"Variables"**
4. Ajoutez :
   ```
   REACT_APP_API_URL=https://[URL-copiée-du-backend]
   ```
5. Onglet **"Settings"** → **COPIEZ l'URL du web**

### 5️⃣ FINALISER BACKEND (30 sec)
1. Retournez au **"backend"** → **"Variables"**
2. Ajoutez :
   ```
   FRONTEND_URL=https://[URL-copiée-du-web]
   ```

### 6️⃣ ATTENDRE ET TESTER (2 min)
1. Attendez que les services redémarrent (voyants verts)
2. Ouvrez l'URL du **web** dans votre navigateur
3. **🎉 Votre plateforme est en ligne !**

---

## 🔗 LIENS DIRECTS

- **Railway Dashboard** : https://railway.app/dashboard
- **Nouveau Projet** : https://railway.app/new
- **Votre Repo GitHub** : https://github.com/ekonzims-max/ekonzims.com

---

## 📝 CHECKLIST

- [ ] Compte Railway créé
- [ ] Projet déployé depuis GitHub
- [ ] PostgreSQL ajouté
- [ ] 9 variables backend configurées
- [ ] URL backend copiée
- [ ] 1 variable frontend configurée
- [ ] URL frontend copiée
- [ ] Variable FRONTEND_URL ajoutée au backend
- [ ] Services redémarrés (voyants verts)
- [ ] Site testé et fonctionnel

---

## ⏱️ TEMPS TOTAL : ~10 MINUTES

---

## 💰 COÛT : $5/mois (tout inclus)
- Backend illimité
- Frontend illimité
- Base de données PostgreSQL
- SSL automatique
- Déploiement automatique depuis GitHub

---

## 🆘 PROBLÈME ?

Si un service ne démarre pas :
1. Cliquez sur le service
2. Onglet **"Deployments"**
3. Regardez les logs (dernière ligne rouge = erreur)
4. Contactez-moi avec le message d'erreur
