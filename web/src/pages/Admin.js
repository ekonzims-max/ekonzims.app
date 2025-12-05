import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalBookings: 0, revenue: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const userData = localStorage.getItem('ekonzims_user');
    const token = localStorage.getItem('ekonzims_token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    
    // Vérifier le rôle admin depuis l'objet utilisateur
    if (user.role === 'admin') {
      setIsAdmin(true);
      
      // Charger les stats avec le token admin
      fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 403 || res.status === 401) {
            alert('Accès refusé. Vous n\'êtes pas administrateur.');
            navigate('/');
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data) setStats(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      alert('Accès refusé. Vous n\'êtes pas administrateur.');
      navigate('/');
    }
  }, [navigate]);

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}><p>Chargement...</p></div>;
  }

  if (!isAdmin) {
    return <div style={{ padding: 20 }}><p>Accès non autorisé</p></div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h2>🔐 Dashboard Admin</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginTop: 20 }}>
        <div style={{ background: '#e3f2fd', padding: 20, borderRadius: 8 }}>
          <h3>👥 Utilisateurs</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: '#e8f5e9', padding: 20, borderRadius: 8 }}>
          <h3>📦 Commandes</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalOrders}</p>
        </div>
        <div style={{ background: '#fff3e0', padding: 20, borderRadius: 8 }}>
          <h3>📅 Réservations</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalBookings}</p>
        </div>
        <div style={{ background: '#f3e5f5', padding: 20, borderRadius: 8 }}>
          <h3>💰 Revenus</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.revenue}€</p>
        </div>
      </div>

      <h3 style={{ marginTop: 40 }}>🛠️ Gestion</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <button style={{ padding: 12, background: '#27ae60', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Gérer Produits
        </button>
        <button style={{ padding: 12, background: '#27ae60', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Gérer Commandes
        </button>
        <button style={{ padding: 12, background: '#27ae60', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Gérer Prestataires
        </button>
        <button style={{ padding: 12, background: '#27ae60', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Gérer Utilisateurs
        </button>
      </div>
    </div>
  );
}

export default Admin;
