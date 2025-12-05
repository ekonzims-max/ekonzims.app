import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // if no token, redirect to forgot
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert('Les mots de passe ne correspondent pas');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      alert('Mot de passe réinitialisé, vous pouvez vous connecter');
      navigate('/login');
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <input type="password" placeholder="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <input type="password" placeholder="Confirmer le mot de passe" value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{ padding: '10px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 6 }}>
          {loading ? 'Traitement...' : 'Réinitialiser'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
