import React from 'react';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <div className="account-page" style={{ maxWidth: 900, margin: '20px auto', lineHeight: 1.8 }}>
      <h1>Conditions d'Utilisation</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Dernière mise à jour : 3 décembre 2025</p>

      <section style={{ marginBottom: 30 }}>
        <h2>1. Acceptation des Conditions</h2>
        <p>
          En accédant et en utilisant la plateforme EkoNzims (ci-après "le Service"), vous acceptez d'être lié(e) par ces Conditions d'Utilisation. 
          Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Service.
        </p>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>2. Description du Service</h2>
        <p>
          EkoNzims est une plateforme e-commerce et de services de nettoyage écologique qui permet aux utilisateurs de :
        </p>
        <ul>
          <li>Acheter des produits de nettoyage durables</li>
          <li>Réserver des services de nettoyage professionnel</li>
          <li>Gérer leurs commandes et réservations</li>
          <li>Consulter l'historique de leurs transactions</li>
        </ul>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>3. Compte Utilisateur</h2>
        <p>
          Pour utiliser certains services, vous devez créer un compte. Vous êtes responsable de :
        </p>
        <ul>
          <li>La confidentialité de vos identifiants de connexion</li>
          <li>L'exactitude des informations fournies lors de l'inscription</li>
          <li>Toutes les activités menées sous votre compte</li>
          <li>Notifier EkoNzims immédiatement en cas d'accès non autorisé</li>
        </ul>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>4. Utilisation Acceptable</h2>
        <p>
          Vous acceptez de ne pas utiliser le Service pour :
        </p>
        <ul>
          <li>Violer les lois, réglementations ou droits d'autrui</li>
          <li>Transmettre des contenus offensants, abusifs ou discriminatoires</li>
          <li>Dérober les données personnelles d'autres utilisateurs</li>
          <li>Accéder à des systèmes sans autorisation</li>
          <li>Diffuser des malwares ou logiciels malveillants</li>
          <li>Spammer ou harceler d'autres utilisateurs</li>
        </ul>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>5. Transactions et Paiements</h2>
        <p>
          Toutes les transactions sont traitées via des partenaires de paiement sécurisés. Vous acceptez que :
        </p>
        <ul>
          <li>Les prix affichés sont en euros (EUR)</li>
          <li>Les frais de livraison s'ajoutent au total de la commande</li>
          <li>Les paiements sont non-remboursables sauf en cas d'erreur de service</li>
          <li>EkoNzims se réserve le droit d'annuler les commandes suspectes</li>
        </ul>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>6. Services de Nettoyage</h2>
        <p>
          Les services de nettoyage sont fournis par des prestataires partenaires. EkoNzims agit en tant que courtier et :
        </p>
        <ul>
          <li>Ne garantit pas l'exactitude des devis fournis</li>
          <li>N'est pas responsable des défauts de prestation du prestataire</li>
          <li>Vous encourage à signaler tout problème dans les 48 heures suivant le service</li>
          <li>Propose un système de notation et d'avis pour chaque prestataire</li>
        </ul>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>7. Limitation de Responsabilité</h2>
        <p>
          DANS LES LIMITES PERMISES PAR LA LOI, EKONZIMS NE SERA PAS RESPONSABLE DE :
        </p>
        <ul>
          <li>Les pertes indirectes ou consécutives</li>
          <li>Les pertes de profits, revenus ou données</li>
          <li>Les défaillances techniques ou interruptions du Service</li>
          <li>Les actions des tiers ou prestataires partenaires</li>
        </ul>
        <p>
          La responsabilité totale d'EkoNzims est limitée au montant que vous avez payé au cours des 12 derniers mois.
        </p>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>8. Propriété Intellectuelle</h2>
        <p>
          Tous les contenus du Service (textes, images, logos, code) sont la propriété d'EkoNzims ou de ses licenciers. 
          Vous n'êtes autorisé(e) à utiliser ces contenus que pour votre usage personnel et non commercial.
        </p>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>9. Modification du Service</h2>
        <p>
          EkoNzims se réserve le droit de modifier, suspendre ou interrompre le Service à tout moment, avec ou sans préavis.
        </p>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>10. Résiliation du Compte</h2>
        <p>
          Vous pouvez demander la suppression de votre compte à tout moment. EkoNzims peut suspendre ou supprimer votre compte 
          pour violation des présentes conditions.
        </p>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>11. Droit Applicable</h2>
        <p>
          Ces conditions sont régies par la loi française. Tout litige sera soumis à la juridiction des tribunaux compétents en France.
        </p>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>12. Contact et Support</h2>
        <p>
          Pour toute question concernant ces Conditions d'Utilisation, veuillez nous contacter à :
        </p>
        <p>
          <strong>Email :</strong> support@ekonzims.com<br />
          <strong>Adresse :</strong> 123 Rue Écologique, 75000 Paris, France<br />
          <strong>Téléphone :</strong> +33 1 23 45 67 89
        </p>
      </section>

      <div style={{ background: '#f0f0f0', padding: 20, borderRadius: 8, marginTop: 30 }}>
        <p style={{ marginBottom: 10 }}>
          <Link to="/privacy" style={{ color: '#27ae60', textDecoration: 'underline' }}>
            Voir notre Politique de Confidentialité
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

export default Terms;
