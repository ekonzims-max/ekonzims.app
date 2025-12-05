import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle OAuth callback
  useEffect(() => {
    const oauthToken = searchParams.get('oauth_token');
    const oauthUser = searchParams.get('oauth_user');
    const oauthError = searchParams.get('error');

    if (oauthError) {
      setError('Erreur de connexion Google. Veuillez réessayer.');
      return;
    }

    if (oauthToken && oauthUser) {
      try {
        const user = JSON.parse(decodeURIComponent(oauthUser));
        localStorage.setItem('ekonzims_token', oauthToken);
        localStorage.setItem('ekonzims_user', JSON.stringify(user));
        setAuth(true);
        navigate('/');
      } catch (e) {
        setError('Erreur lors de la connexion Google');
      }
    }
  }, [searchParams, setAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de connexion');
      }
      const data = await res.json();
      if (remember) {
        localStorage.setItem('ekonzims_token', data.token);
        localStorage.setItem('ekonzims_user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('ekonzims_token', data.token);
        sessionStorage.setItem('ekonzims_user', JSON.stringify(data.user));
      }
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 520, marginTop: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label><strong>Email</strong></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 6 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label><strong>Mot de passe</strong></label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Votre mot de passe" style={{ width: '100%', padding: 8, marginTop: 6 }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 8, top: 12, background: 'transparent', border: 'none', cursor: 'pointer' }}>{showPassword ? '🙈' : '👁️'}</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Se souvenir de moi
          </label>
          <a href="/forgot-password" style={{ color: '#27ae60' }}>Mot de passe oublié ?</a>
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 6 }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <p>Ou</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="http://localhost:5000/api/auth/google" style={{ padding: '8px 12px', background: '#4285F4', color: 'white', borderRadius: 6, textDecoration: 'none' }}>Se connecter avec Google</a>
          <a href="/register" style={{ padding: '8px 12px', background: '#6c757d', color: 'white', borderRadius: 6, textDecoration: 'none' }}>Créer un compte</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
