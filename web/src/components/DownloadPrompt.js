import React from 'react';

function DownloadPrompt({ onClose }) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Téléchargez notre application mobile</h3>
        <p>Pour une meilleure expérience, installez l'application EkoNzims sur votre téléphone.</p>

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={linkStyle}>
            Google Play
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} style={linkStyle}>
            App Store
          </a>
        </div>

        <p style={{ marginTop: 12, color: '#666' }}>Ou scannez le QR code depuis l'application Expo (si vous testez).</p>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button onClick={onClose} style={closeBtnStyle}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle = {
  background: 'white',
  padding: 20,
  borderRadius: 8,
  width: 360,
  boxShadow: '0 6px 24px rgba(0,0,0,0.2)'
};

const linkStyle = {
  display: 'inline-block',
  padding: '8px 12px',
  background: '#27ae60',
  color: 'white',
  borderRadius: 6,
  textDecoration: 'none'
};

const closeBtnStyle = {
  padding: '8px 12px',
  background: '#ccc',
  border: 'none',
  borderRadius: 6,
};

export default DownloadPrompt;
