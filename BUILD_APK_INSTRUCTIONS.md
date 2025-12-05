# 📱 Instructions pour générer l'APK Android

## Votre application mobile utilise Expo React Native

### Méthode 1 : Build avec Expo (Recommandé)

1. **Installer Expo CLI globalement** :
```powershell
npm install -g eas-cli
```

2. **Se connecter à Expo** :
```powershell
cd mobile
eas login
```

3. **Configurer le build** :
```powershell
eas build:configure
```

4. **Générer l'APK** :
```powershell
eas build -p android --profile preview
```

5. **Télécharger l'APK** :
   - Expo vous donnera un lien pour télécharger l'APK
   - Téléchargez le fichier et renommez-le en `ekonzims-mobile.apk`
   - Placez-le dans `web/public/ekonzims-mobile.apk`

### Méthode 2 : Build local (Plus rapide mais nécessite Android Studio)

1. **Installer les dépendances** :
```powershell
cd mobile
npm install
```

2. **Ejecter d'Expo (optionnel)** :
```powershell
expo eject
```

3. **Build Android** :
```powershell
cd android
.\gradlew assembleRelease
```

4. **L'APK sera dans** :
```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

5. **Copier l'APK** :
```powershell
Copy-Item mobile\android\app\build\outputs\apk\release\app-release.apk web\public\ekonzims-mobile.apk
```

### Méthode 3 : Utiliser un service de build en ligne

- **Expo Application Services (EAS)** : https://expo.dev/
- **AppCenter** : https://appcenter.ms/
- **Bitrise** : https://www.bitrise.io/

### Note Importante

Pour l'instant, j'ai créé un fichier placeholder. Pour que le téléchargement fonctionne vraiment :
1. Générez l'APK avec une des méthodes ci-dessus
2. Remplacez le fichier `web/public/ekonzims-mobile.apk` par votre vraie APK

### Tester l'APK localement

Pour tester si le téléchargement fonctionne :
1. Ouvrez http://localhost:3000
2. Cliquez sur "📱 Télécharger l'App"
3. Le fichier devrait se télécharger (pour l'instant c'est le placeholder)

---

**📞 Contact** : +243 854 593 921  
**🌿 EkoNzims** - Nettoyage Écologique
