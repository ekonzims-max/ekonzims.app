import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

function Checkout() {
  const { cart, getTotal, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('ekonzims_token');
    if (!token) {
      alert('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/products/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: getTotal(),
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la commande');
      }

      const order = await response.json();
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Paiement</h2>
        <p>Votre panier est vide</p>
        <Link to="/products">← Continuer les achats</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-page" style={{ textAlign: 'center' }}>
        <h2>✅ Commande confirmée !</h2>
        <p>Merci pour votre achat. Vous allez être redirigé...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Paiement</h2>
      <div style={{ display: 'flex', gap: 40, maxWidth: 1000, margin: '20px 0' }}>
        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <h3>Adresse de livraison</h3>
          <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, boxSizing: 'border-box' }} />
          <input type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, boxSizing: 'border-box' }} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, boxSizing: 'border-box' }} />
          <input type="text" name="street" placeholder="Rue" value={formData.street} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, boxSizing: 'border-box' }} />
          <input type="text" name="city" placeholder="Ville" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, boxSizing: 'border-box' }} />
          <input type="text" name="postalCode" placeholder="Code postal" value={formData.postalCode} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 12, boxSizing: 'border-box' }} />

          <div style={{ background: '#d4edda', padding: 12, borderRadius: 6, marginBottom: 12 }}>
            <strong style={{ color: '#155724' }}>💳 Paiement à la livraison</strong>
            <p style={{ fontSize: '0.9rem', color: '#155724', marginTop: 6 }}>Vous paierez directement au livreur. Aucune information de carte requise.</p>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 6, fontSize: '1rem', cursor: 'pointer' }}>
            {loading ? 'Traitement...' : `Confirmer la commande ${getTotal()}€`}
          </button>
        </form>

        {/* Résumé */}
        <div style={{ flex: 1, background: '#f8f9fa', padding: 20, borderRadius: 8, height: 'fit-content' }}>
          <h3>Résumé de commande</h3>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>{item.name} x{item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>{getTotal()}€</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
