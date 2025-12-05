import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Token de vérification manquant');
      setLoading(false);
      return;
    }

    // Call backend to verify email
    fetch(`${API_URL}/api/auth/verify-email/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage('✓ Email vérifié avec succès ! Redirection vers la connexion...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(data.error || 'Erreur lors de la vérification');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams, navigate]);

  return (
    <div className="account-page">
      <h2>Vérification d'Email</h2>
      {loading && <p>Vérification en cours...</p>}
      {message && <p style={{ color: 'green', fontSize: '1.1em' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontSize: '1.1em' }}>{error}</p>}
    </div>
  );
}

export default VerifyEmail;
