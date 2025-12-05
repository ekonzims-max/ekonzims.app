import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setFilteredServices(data.services || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredServices(services);
      return;
    }
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  if (loading) return <div className="services-page"><LoadingSpinner message="Chargement des services..." /></div>;

  return (
    <div className="services-page">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#27ae60', marginBottom: '0.5rem' }}>🧹 Nos Services Professionnels</h2>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Réservez votre service de nettoyage en ligne</p>
      </div>
      
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Rechercher un service..."
      />
      
      {filteredServices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
          <p style={{ fontSize: '1.2rem' }}>😔 Aucun service trouvé</p>
          <button 
            onClick={() => setFilteredServices(services)}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            Afficher tous les services
          </button>
        </div>
      ) : (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h3>{service.name}</h3>
              <p style={{ fontSize: '0.95rem', color: '#7f8c8d', margin: '0.5rem 0' }}>
                {service.description || 'Service de nettoyage professionnel'}
              </p>
              <p style={{ fontSize: '0.95rem', color: '#555', margin: '0.5rem 0' }}>
                ⏱️ Durée: {service.duration} min
              </p>
              <p className="price">À partir de {service.basePrice}€</p>
              <button onClick={() => {
                const token = localStorage.getItem('ekonzims_token') || sessionStorage.getItem('ekonzims_token');
                if (!token) {
                  alert('⚠️ Veuillez vous connecter pour réserver un service');
                  navigate('/login');
                } else {
                  navigate(`/booking/${service.id}`);
                }
              }}>
                📅 Réserver maintenant
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;
