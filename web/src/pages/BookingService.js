import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BookingService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '10:00',
    address: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch service details
    fetch(`http://localhost:5000/api/services/${serviceId}`)
      .then(res => res.json())
      .then(data => setService(data))
      .catch(() => setError('Service not found'));
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('ekonzims_token');
    if (!token) {
      alert('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/services/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          scheduledDate: `${formData.scheduledDate}T${formData.scheduledTime}`,
          address: formData.address,
          phone: formData.phone,
          paymentMethod: 'online',
          cardNumber: formData.cardNumber,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      const booking = await response.json();
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return <div className="booking-page"><p>Chargement du service...</p></div>;
  }

  if (success) {
    return (
      <div className="booking-page" style={{ textAlign: 'center' }}>
        <h2>✅ Réservation confirmée !</h2>
        <p>Merci ! Votre nettoyage a été réservé et payé. Vous allez être redirigé...</p>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <h2>Réserver: {service.name}</h2>
      {error && <p style={{ color: 'red', marginBottom: 12 }}>❌ {error}</p>}

      <div style={{ display: 'flex', gap: 40, maxWidth: 1000, margin: '20px 0' }}>
        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <h3>Détails de la réservation</h3>
          <div>
            <label><strong>Date *</strong></label>
            <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, marginTop: 6, boxSizing: 'border-box' }} />
          </div>

          <div>
            <label><strong>Heure *</strong></label>
            <input type="time" name="scheduledTime" value={formData.scheduledTime} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, marginTop: 6, boxSizing: 'border-box' }} />
          </div>

          <div>
            <label><strong>Adresse *</strong></label>
            <input type="text" name="address" placeholder="Rue, numéro" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, marginTop: 6, boxSizing: 'border-box' }} />
          </div>

          <div>
            <label><strong>Téléphone *</strong></label>
            <input type="tel" name="phone" placeholder="+33 6 12 34 56 78" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, marginTop: 6, boxSizing: 'border-box' }} />
          </div>

          <h3 style={{ marginTop: 24 }}>Paiement en ligne</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Carte test: 4242 4242 4242 4242</p>
          
          <div>
            <label><strong>Numéro de carte *</strong></label>
            <input type="text" name="cardNumber" placeholder="4242 4242 4242 4242" value={formData.cardNumber} onChange={handleChange} maxLength="19" required style={{ width: '100%', padding: 8, marginBottom: 12, marginTop: 6, boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label><strong>Date expiration *</strong></label>
              <input type="text" name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, marginTop: 6, boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label><strong>CVV *</strong></label>
              <input type="text" name="cvv" placeholder="123" value={formData.cvv} onChange={handleChange} maxLength="3" required style={{ width: '100%', padding: 8, marginBottom: 12, marginTop: 6, boxSizing: 'border-box' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 6, fontSize: '1rem', cursor: 'pointer' }}>
            {loading ? 'Traitement...' : `Payer et réserver ${service.basePrice}€`}
          </button>
        </form>

        {/* Résumé */}
        <div style={{ flex: 1, background: '#f8f9fa', padding: 20, borderRadius: 8, height: 'fit-content' }}>
          <h3>Résumé de réservation</h3>
          <div style={{ marginBottom: 8 }}>
            <strong>{service.name}</strong>
          </div>
          <div style={{ marginBottom: 8, fontSize: '0.9rem', color: '#666' }}>
            Durée: {service.duration} minutes
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>{service.basePrice}€</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#27ae60', marginTop: 12, background: '#d4edda', padding: 8, borderRadius: 4 }}>
            ✓ Le paiement sera traité immédiatement
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingService;
