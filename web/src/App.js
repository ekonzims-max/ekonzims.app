import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import BookingService from './pages/BookingService';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { CartProvider, CartContext } from './context/CartContext';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const token = localStorage.getItem('ekonzims_token') || sessionStorage.getItem('ekonzims_token');
    const userData = localStorage.getItem('ekonzims_user') || sessionStorage.getItem('ekonzims_user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ekonzims_token');
    localStorage.removeItem('ekonzims_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">🌿 EkoNzims</h1>
          <ul className="nav-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/products">Produits</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li>
              <a 
                href="/ekonzims-mobile.apk" 
                download
                style={{ 
                  background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}
              >
                📱 Télécharger l'App
              </a>
            </li>
            <li><Link to="/cart">Panier {cart.length > 0 && `(${cart.length})`}</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/account">{user?.firstName || 'Compte'}</Link></li>
                <li><a onClick={handleLogout} style={{ cursor: 'pointer', color: 'white' }}>Déconnexion</a></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Se connecter</Link></li>
                <li><Link to="/register">S'inscrire</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking/:serviceId" element={<BookingService />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🌿 EkoNzims</h3>
            <p>Votre partenaire pour un nettoyage écologique et responsable. Produits bio et services professionnels.</p>
            <div className="social-links">
              <a href="#" title="Facebook">📘</a>
              <a href="#" title="Twitter">🐦</a>
              <a href="#" title="Instagram">📷</a>
              <a href="#" title="LinkedIn">💼</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Liens Rapides</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/">Accueil</Link>
              <Link to="/products">Produits</Link>
              <Link to="/services">Services</Link>
              <Link to="/cart">Panier</Link>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Informations</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/terms">Conditions d'utilisation</Link>
              <Link to="/privacy">Politique de confidentialité</Link>
              <a href="mailto:contact@ekonzims.com">Contact</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Nous Contacter</h3>
            <p>📧 contact@ekonzims.com</p>
            <p>📞 <a href="tel:+243854593921" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>+243 854 593 921</a></p>
            <p>📍 Kinshasa, RDC</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 EkoNzims - Tous droits réservés | Nettoyage Écologique & Produits Bio</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;
