import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Erreur');
      alert('Si un compte existe, un email de réinitialisation a été envoyé');
      navigate('/login');
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <h2>Mot de passe oublié</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <input type="email" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{ padding: '10px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 6 }}>
          {loading ? 'Envoi...' : 'Envoyer l\'email de réinitialisation'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
