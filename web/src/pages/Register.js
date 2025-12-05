import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkEmail = async (val) => {
    setEmail(val);
    if (!val) return setEmailError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return setEmailError('Email invalide');
    try {
      const res = await fetch(`${API_URL}/api/auth/check-email?email=${encodeURIComponent(val)}`);
      const data = await res.json();
      if (data.exists) setEmailError('Email déjà utilisé'); else setEmailError('');
    } catch (e) {
      setEmailError('Erreur vérification email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted || !privacyAccepted) return alert('Vous devez accepter les conditions et la politique');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phone, street, city, postalCode, termsAccepted, privacyAccepted }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      alert('Inscription réussie. Vérifiez votre email si nécessaire.');
      navigate('/login');
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => checkEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ flex: 1, padding: 8 }} />
          <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ flex: 1, padding: 8 }} />
        </div>
        <input type="tel" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 12 }} />
        <input type="text" placeholder="Rue" value={street} onChange={(e) => setStreet(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 12 }} />
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <input type="text" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} required style={{ flex: 1, padding: 8 }} />
          <input type="text" placeholder="Code postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required style={{ flex: 1, padding: 8 }} />
        </div>

        <div style={{ marginTop: 12, background: '#f0f0f0', padding: 12, borderRadius: 6 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
            J'accepte les <a href="/terms" target="_blank" rel="noreferrer">conditions</a>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />
            J'accepte la <a href="/privacy" target="_blank" rel="noreferrer">politique de confidentialité</a>
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 16, padding: '10px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 6 }}>
          {loading ? 'Chargement...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
}

export default Register;
