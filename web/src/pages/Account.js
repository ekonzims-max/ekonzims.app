import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Account() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('ekonzims_user');
    const token = localStorage.getItem('ekonzims_token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Charger les réservations
    fetch('http://localhost:5000/api/services/user/bookings', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []))
      .catch(err => console.error(err));
  }, [navigate]);

  if (!user) {
    return <div className="account-page"><p>Chargement...</p></div>;
  }

  // derive a safe display name: prefer backend `displayName`, otherwise mask local values
  const displayName = user.displayName || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName[0]}.` : (user.firstName || 'Client'));

  return (
    <div className="account-page">
      <h2>Mon Compte</h2>
      
      <div style={{ maxWidth: 600, background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <h3>Informations personnelles</h3>
        <p><strong>Nom affiché:</strong> {displayName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Membre depuis:</strong> {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
      </div>

      <h3>Mes réservations de services</h3>
      {bookings.length === 0 ? (
        <p>Aucune réservation</p>
      ) : (
        <div style={{ maxWidth: 600 }}>
          {bookings.map(booking => (
            <div key={booking.id} style={{ background: 'white', padding: 12, marginBottom: 12, borderRadius: 6, borderLeft: '4px solid #27ae60' }}>
              <p><strong>Service ID:</strong> {booking.serviceId}</p>
              <p><strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString('fr-FR')}</p>
              <p><strong>Prix:</strong> {booking.price}€</p>
              <p><strong>Statut:</strong> <span style={{ background: '#e8f5e9', padding: '2px 8px', borderRadius: 4 }}>{booking.status}</span></p>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 30 }}>Paramètres</h3>
      <button onClick={() => {
        localStorage.removeItem('ekonzims_token');
        localStorage.removeItem('ekonzims_user');
        navigate('/login');
      }} style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
        Déconnexion
      </button>
    </div>
  );
}

export default Account;
