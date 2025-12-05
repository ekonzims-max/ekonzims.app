import React from 'react';
import { Link } from 'react-router-dom';

function Privacy() {
  return (
    <div className="account-page" style={{ maxWidth: 900, margin: '20px auto', lineHeight: 1.8, fontSize: '0.95em' }}>
      <h1>Politique de Confidentialité</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>
        <strong>Dernière mise à jour :</strong> 3 décembre 2025 | 
        <strong> Applicable à partir de :</strong> 3 décembre 2025
      </p>

      <nav style={{ background: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 30 }}>
        <p style={{ fontWeight: 'bold', marginBottom: 10 }}>Table des matières :</p>
        <ul style={{ marginLeft: 20, fontSize: '0.9em' }}>
          <li><a href="#1" style={{ color: '#27ae60' }}>1. Introduction et Responsable du Traitement</a></li>
          <li><a href="#2" style={{ color: '#27ae60' }}>2. Données Collectées</a></li>
          <li><a href="#3" style={{ color: '#27ae60' }}>3. Fondement Juridique du Traitement</a></li>
          <li><a href="#4" style={{ color: '#27ae60' }}>4. Utilisation des Données</a></li>
          <li><a href="#5" style={{ color: '#27ae60' }}>5. Partage avec des Tiers</a></li>
          <li><a href="#6" style={{ color: '#27ae60' }}>6. Durée de Conservation</a></li>
          <li><a href="#7" style={{ color: '#27ae60' }}>7. Sécurité des Données</a></li>
          <li><a href="#8" style={{ color: '#27ae60' }}>8. Vos Droits RGPD</a></li>
          <li><a href="#9" style={{ color: '#27ae60' }}>9. Cookies et Suivi</a></li>
          <li><a href="#10" style={{ color: '#27ae60' }}>10. Transferts Internationaux</a></li>
          <li><a href="#11" style={{ color: '#27ae60' }}>11. Modifications de la Politique</a></li>
          <li><a href="#12" style={{ color: '#27ae60' }}>12. Contact et Recours</a></li>
        </ul>
      </nav>

      <section id="1" style={{ marginBottom: 30 }}>
        <h2>1. Introduction et Responsable du Traitement</h2>
        <p>
          EkoNzims (ci-après "nous", "notre" ou "Société") respecte votre vie privée et s'engage à protéger vos données personnelles 
          conformément au Règlement Général sur la Protection des Données (RGPD UE 2016/679) et à la Loi Informatique et Libertés (LIL) française.
        </p>
        <p>
          <strong>Responsable du Traitement :</strong><br />
          EkoNzims SARL<br />
          123 Rue Écologique<br />
          75000 Paris, France<br />
          Email : privacy@ekonzims.com<br />
          Téléphone : +33 1 23 45 67 89<br />
          SIRET : 123 456 789 00012
        </p>
        <p>
          <strong>Délégué à la Protection des Données (DPO) :</strong><br />
          dpo@ekonzims.com
        </p>
      </section>

      <section id="2" style={{ marginBottom: 30 }}>
        <h2>2. Données Collectées</h2>
        <p>
          Nous collectons les catégories suivantes de données personnelles :
        </p>

        <h3 style={{ marginTop: 20 }}>2.1 Données d'Identification</h3>
        <ul>
          <li>Prénom et Nom</li>
          <li>Adresse email</li>
          <li>Mot de passe (hashé)</li>
          <li>Numéro de téléphone</li>
          <li>Photo de profil (optionnel)</li>
        </ul>

        <h3 style={{ marginTop: 20 }}>2.2 Données d'Adresse</h3>
        <ul>
          <li>Rue et numéro</li>
          <li>Ville</li>
          <li>Code postal</li>
          <li>Pays</li>
          <li>Coordonnées GPS (latitude/longitude) — collectées avec votre consentement explicite</li>
        </ul>

        <h3 style={{ marginTop: 20 }}>2.3 Données de Transaction</h3>
        <ul>
          <li>Historique des commandes (date, montant, articles)</li>
          <li>Historique des réservations de services</li>
          <li>Détails de facturation</li>
          <li>Informations de livraison</li>
          <li>Numéro de suivi colis</li>
        </ul>

        <h3 style={{ marginTop: 20 }}>2.4 Données de Paiement</h3>
        <ul>
          <li>Les données de carte bancaire sont traitées par Stripe. EkoNzims ne stocke pas directement les numéros de carte.</li>
          <li>Seul le dernier numéro à 4 chiffres et la date d'expiration sont conservés</li>
        </ul>

        <h3 style={{ marginTop: 20 }}>2.5 Données de Communication</h3>
        <ul>
          <li>Emails envoyés (confirmation de commande, suivi de livraison, notifications)</li>
          <li>Messages de support client</li>
          <li>Commentaires et avis sur les produits/services</li>
        </ul>

        <h3 style={{ marginTop: 20 }}>2.6 Données d'Utilisation et Logs</h3>
        <ul>
          <li>Adresse IP</li>
          <li>Type de navigateur et système d'exploitation</li>
          <li>Pages visitées et durée de visite</li>
          <li>Lien de provenance (referrer)</li>
          <li>Données de géolocalisation approximatives (via IP)</li>
          <li>Interactions avec le site (clics, scrolls, formulaires)</li>
        </ul>

        <h3 style={{ marginTop: 20 }}>2.7 Données de Consentement et Préférences</h3>
        <ul>
          <li>Consentement aux conditions d'utilisation (date/heure)</li>
          <li>Consentement à la politique de confidentialité (date/heure)</li>
          <li>Consentement au marketing par email</li>
          <li>Consentement à la géolocalisation</li>
          <li>Préférences de communication</li>
        </ul>

        <h3 style={{ marginTop: 20 }}>2.8 Données Biométriques (le cas échéant)</h3>
        <ul>
          <li>Si vous utilisez la connexion par empreinte digitale ou reconnaissance faciale via OAuth, ces données sont traitées par le fournisseur d'authentification uniquement</li>
        </ul>
      </section>

      <section id="3" style={{ marginBottom: 30 }}>
        <h2>3. Fondement Juridique du Traitement</h2>
        <p>
          Nous traitons vos données sur la base des fondements juridiques suivants :
        </p>
        <ul>
          <li><strong>Contrat (Art. 6.1.b RGPD) :</strong> Exécution de nos obligations envers vous (commandes, livraisons, support)</li>
          <li><strong>Consentement (Art. 6.1.a RGPD) :</strong> Marketing, newsletters, profiling (vous pouvez le retirer)</li>
          <li><strong>Obligations légales (Art. 6.1.c RGPD) :</strong> Conformité fiscale, lutte anti-fraude, lutte anti-blanchiment</li>
          <li><strong>Intérêts légitimes (Art. 6.1.f RGPD) :</strong> Amélioration du service, sécurité, prévention de fraude</li>
          <li><strong>Intérêt public (Art. 6.1.e RGPD) :</strong> Conformité réglementaire</li>
        </ul>
      </section>

      <section id="4" style={{ marginBottom: 30 }}>
        <h2>4. Utilisation des Données</h2>
        <p>
          Nous utilisons vos données pour :
        </p>
        <ul>
          <li>Créer et gérer votre compte utilisateur</li>
          <li>Traiter vos commandes et paiements</li>
          <li>Vous envoyer des confirmations de commande et mises à jour de livraison</li>
          <li>Fournir un support client</li>
          <li>Vous recommander des produits basés sur votre historique</li>
          <li>Personnaliser votre expérience sur le site</li>
          <li>Analyser les tendances d'utilisation et d'achat</li>
          <li>Détecter et prévenir la fraude</li>
          <li>Se conformer aux obligations légales et réglementaires</li>
          <li>Vous envoyer des communications marketing (avec consentement)</li>
          <li>Mesurer l'efficacité des campagnes marketing</li>
          <li>Améliorer la qualité du service et des produits</li>
          <li>Gérer les réclamations et litiges</li>
          <li>Optimiser les itinéraires de livraison (via géolocalisation)</li>
          <li>Facturer et archiver les transactions</li>
        </ul>
      </section>

      <section id="5" style={{ marginBottom: 30 }}>
        <h2>5. Partage avec des Tiers</h2>
        <p>
          Vos données peuvent être partagées avec :
        </p>
        <ul>
          <li><strong>Prestataires de Paiement :</strong> Stripe pour traiter les transactions sécurisées</li>
          <li><strong>Fournisseurs de Livraison :</strong> La Poste, DPD, GLS (adresse de livraison requise)</li>
          <li><strong>Fournisseurs de Services de Nettoyage :</strong> Partenaires vérifiés (nom, téléphone, adresse)</li>
          <li><strong>Service Email :</strong> Nodemailer/Gmail (confirmations, factures, newsletters)</li>
          <li><strong>Fournisseurs d'Authentification :</strong> Google, Facebook (si vous utilisez OAuth)</li>
          <li><strong>Hébergeur Cloud :</strong> Pour stocker et sauvegarder les données</li>
          <li><strong>Autorités Publiques :</strong> Si légalement requis (police, justice, DGCCRF)</li>
          <li><strong>Sociétés du Groupe EkoNzims :</strong> Pour améliorer les services</li>
        </ul>
        <p>
          <strong>Important :</strong> Nous n'effectuons PAS de profilage automatisé (scoring de crédit) sans consentement explicite.
        </p>
      </section>

      <section id="6" style={{ marginBottom: 30 }}>
        <h2>6. Durée de Conservation</h2>
        <ul>
          <li><strong>Données de Compte :</strong> Pendant la durée du compte + 3 ans après suppression (conformité fiscale)</li>
          <li><strong>Données de Transaction :</strong> 10 ans (archivage légal des factures)</li>
          <li><strong>Données de Paiement :</strong> 13 mois après la dernière transaction (conformité PCI)</li>
          <li><strong>Données de Communication :</strong> 3 ans après la dernière interaction</li>
          <li><strong>Logs d'Utilisation :</strong> 12 mois maximum (sécurité)</li>
          <li><strong>Données de Marketing :</strong> Jusqu'au retrait du consentement</li>
          <li><strong>Données Biométriques :</strong> Non conservées (traitées par le fournisseur uniquement)</li>
        </ul>
      </section>

      <section id="7" style={{ marginBottom: 30 }}>
        <h2>7. Sécurité des Données</h2>
        <p>
          Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données :
        </p>
        <ul>
          <li><strong>Chiffrement :</strong> HTTPS/TLS pour tous les transferts de données</li>
          <li><strong>Authentification :</strong> Mots de passe hashés avec SHA-256</li>
          <li><strong>Contrôle d'Accès :</strong> Accès limité aux employés autorisés</li>
          <li><strong>Pare-feu :</strong> Protection contre les accès non autorisés</li>
          <li><strong>Sauvegardes :</strong> Sauvegarde régulière et archivage sécurisé</li>
          <li><strong>Audit :</strong> Audits de sécurité réguliers par des tiers</li>
          <li><strong>Formation :</strong> Formation du personnel à la protection des données</li>
        </ul>
        <p>
          <strong>Limitations :</strong> Aucune transmission de données sur Internet n'est 100% sécurisée. Vous transmettez les données à vos propres risques.
        </p>
      </section>

      <section id="8" style={{ marginBottom: 30 }}>
        <h2>8. Vos Droits RGPD</h2>
        <p>
          Vous disposez des droits suivants concernant vos données personnelles :
        </p>

        <h3 style={{ marginTop: 20 }}>8.1 Droit d'Accès (Art. 15 RGPD)</h3>
        <p>
          Vous pouvez demander l'accès à toutes vos données personnelles que nous détenons. 
          Nous vous fournirons une copie dans un délai de 30 jours.
        </p>

        <h3 style={{ marginTop: 20 }}>8.2 Droit de Rectification (Art. 16 RGPD)</h3>
        <p>
          Vous pouvez corriger ou mettre à jour vos données personnelles à tout moment via votre profil. 
          Si vous ne pouvez pas le faire, contactez-nous.
        </p>

        <h3 style={{ marginTop: 20 }}>8.3 Droit à l'Oubli / Suppression (Art. 17 RGPD)</h3>
        <p>
          Sous certaines conditions, vous pouvez demander la suppression de vos données. 
          Cependant, nous pouvons conserver certaines données pour des obligations légales.
        </p>

        <h3 style={{ marginTop: 20 }}>8.4 Droit à la Limitation du Traitement (Art. 18 RGPD)</h3>
        <p>
          Vous pouvez demander à limiter l'utilisation de vos données à certains cas particuliers.
        </p>

        <h3 style={{ marginTop: 20 }}>8.5 Droit à la Portabilité (Art. 20 RGPD)</h3>
        <p>
          Vous pouvez demander une copie de vos données dans un format structuré et portabilité vers un autre service.
        </p>

        <h3 style={{ marginTop: 20 }}>8.6 Droit d'Opposition (Art. 21 RGPD)</h3>
        <p>
          Vous pouvez vous opposer au traitement de vos données pour marketing ou profilage. 
          Utilisez le lien "Désinscription" dans les emails.
        </p>

        <h3 style={{ marginTop: 20 }}>8.7 Droit Relatif à la Prise de Décision Automatisée (Art. 22 RGPD)</h3>
        <p>
          Vous avez le droit de ne pas être soumis(e) à une décision basée uniquement sur le traitement automatisé 
          (sauf exceptions légales). Contactez-nous pour plus d'informations.
        </p>

        <h3 style={{ marginTop: 20 }}>Exercer Vos Droits</h3>
        <p>
          Pour exercer l'un de ces droits, veuillez nous écrire à :<br />
          <strong>Email :</strong> privacy@ekonzims.com<br />
          <strong>Adresse :</strong> 123 Rue Écologique, 75000 Paris, France
        </p>
        <p>
          <strong>Délai de Réponse :</strong> 30 jours calendaires (extensible de 60 jours supplémentaires si complexe).
        </p>
      </section>

      <section id="9" style={{ marginBottom: 30 }}>
        <h2>9. Cookies et Suivi</h2>
        <p>
          Nous utilisons les cookies et technologies similaires pour :
        </p>
        <ul>
          <li><strong>Cookies Essentiels :</strong> Authentification, sécurité, stockage des préférences</li>
          <li><strong>Cookies d'Analyse :</strong> Google Analytics pour comprendre votre navigation (anonymisé)</li>
          <li><strong>Cookies de Marketing :</strong> Facebook Pixel, Google Ads (avec consentement)</li>
          <li><strong>Local Storage :</strong> Stockage du panier et du token d'authentification</li>
        </ul>
        <p>
          <strong>Gestion des Cookies :</strong> Vous pouvez gérer vos préférences dans votre navigateur ou via notre banneau de consentement.
        </p>
      </section>

      <section id="10" style={{ marginBottom: 30 }}>
        <h2>10. Transferts Internationaux</h2>
        <p>
          Vos données sont principalement hébergées en France/UE. 
          Cependant, certains prestataires peuvent être situés en dehors de l'UE (USA).
        </p>
        <p>
          Pour les transferts vers les USA ou pays non-adéquats, nous utilisons :
        </p>
        <ul>
          <li>Clauses Contractuelles Type (SCCs) approuvées par la Commission Européenne</li>
          <li>Actes d'Adéquation (si disponibles)</li>
          <li>Votre consentement explicite</li>
        </ul>
      </section>

      <section id="11" style={{ marginBottom: 30 }}>
        <h2>11. Modifications de la Politique</h2>
        <p>
          Nous pouvons modifier cette politique de confidentialité à tout moment. 
          Les modifications seront affichées sur cette page avec une nouvelle date de mise à jour.
        </p>
        <p>
          L'utilisation continue du Service après modifications implique votre acceptation.
        </p>
      </section>

      <section id="12" style={{ marginBottom: 30 }}>
        <h2>12. Contact et Recours</h2>
        <p>
          <strong>Questions sur la Confidentialité ?</strong><br />
          Email : privacy@ekonzims.com<br />
          Téléphone : +33 1 23 45 67 89<br />
          Adresse : 123 Rue Écologique, 75000 Paris, France
        </p>

        <p style={{ marginTop: 20 }}>
          <strong>Délégué à la Protection des Données (DPO) :</strong><br />
          dpo@ekonzims.com
        </p>

        <p style={{ marginTop: 20 }}>
          <strong>Recours Auprès de l'Autorité Compétente :</strong><br />
          Si vous estimez que vos droits ont été violés, vous pouvez déposer plainte auprès de :<br />
          <strong>CNIL (Commission Nationale de l'Informatique et des Libertés)</strong><br />
          3 Place de Fontenoy<br />
          75007 Paris, France<br />
          Téléphone : +33 (0)1 53 73 22 22<br />
          Site : www.cnil.fr
        </p>
      </section>

      <div style={{ background: '#f0f0f0', padding: 20, borderRadius: 8, marginTop: 40 }}>
        <p style={{ marginBottom: 10 }}>
          <Link to="/terms" style={{ color: '#27ae60', textDecoration: 'underline' }}>
            Voir nos Conditions d'Utilisation
          </Link>
        </p>
        <p>
          <Link to="/login" style={{ color: '#27ae60', textDecoration: 'underline' }}>
            Retour à l'inscription
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Privacy;
