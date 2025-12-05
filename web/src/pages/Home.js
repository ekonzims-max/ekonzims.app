import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <header className="hero">
        <h2>✨ Bienvenue sur EkoNzims ✨</h2>
        <p>Votre partenaire pour un nettoyage écologique et des produits bio de qualité supérieure</p>
        <button className="cta-button" onClick={() => navigate('/products')}>
          Découvrir nos produits
        </button>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>🛍️ E-commerce</h3>
          <p>Découvrez notre gamme complète de produits de nettoyage écologiques. Livraison rapide et paiement à la livraison pour votre sécurité.</p>
        </div>
        <div className="feature-card">
          <h3>🧹 Services Professionnels</h3>
          <p>Réservez nos services de nettoyage professionnel en ligne. Nos experts interviennent rapidement avec des produits 100% naturels.</p>
        </div>
        <div className="feature-card">
          <h3>♻️ 100% Écologique</h3>
          <p>Tous nos produits sont naturels, biodégradables et respectueux de l'environnement. Prenez soin de votre maison et de la planète.</p>
        </div>
      </section>

      <section style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#27ae60', marginBottom: '1rem', fontSize: '2.5rem' }}>
          🌿 Pourquoi choisir EkoNzims ?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '2rem auto 0',
          padding: '0 1rem'
        }}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
            <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Qualité Garantie</h4>
            <p style={{ color: '#7f8c8d' }}>Produits certifiés bio</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚚</div>
            <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Livraison Rapide</h4>
            <p style={{ color: '#7f8c8d' }}>Sous 48h partout</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💳</div>
            <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Paiement Sécurisé</h4>
            <p style={{ color: '#7f8c8d' }}>À la livraison ou en ligne</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
            <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Service Client</h4>
            <p style={{ color: '#7f8c8d' }}>Disponible 7j/7</p>
          </div>
        </div>
      </section>

      <section style={{
        padding: '4rem 1rem',
        backgroundColor: '#ffffff',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#27ae60', marginBottom: '2rem', fontSize: '2.5rem' }}>
          💚 Témoignages de nos clients
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            backgroundColor: '#f8f9fa',
            transition: 'transform 0.3s'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#555' }}>
              "Excellent service ! Les produits sont vraiment écologiques et efficaces. Je recommande vivement."
            </p>
            <strong style={{ color: '#27ae60' }}>- Marie D.</strong>
          </div>
          <div style={{
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#555' }}>
              "Le service de nettoyage est impeccable. L'équipe est professionnelle et ponctuelle."
            </p>
            <strong style={{ color: '#27ae60' }}>- Jean P.</strong>
          </div>
          <div style={{
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#555' }}>
              "Enfin des produits qui respectent l'environnement ! Livraison rapide et prix corrects."
            </p>
            <strong style={{ color: '#27ae60' }}>- Sophie L.</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
