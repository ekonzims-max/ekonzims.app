import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  if (loading) return <div className="products-page"><LoadingSpinner message="Chargement des produits..." /></div>;

  return (
    <div className="products-page">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#27ae60', marginBottom: '0.5rem' }}>🛍️ Nos Produits Écologiques</h2>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Découvrez notre gamme de produits bio et naturels</p>
      </div>
      
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Rechercher un produit..."
      />
      
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
          <p style={{ fontSize: '1.2rem' }}>😔 Aucun produit trouvé</p>
          <button 
            onClick={() => setFilteredProducts(products)}
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
            Afficher tous les produits
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧴</div>
              <h3>{product.name}</h3>
              <p style={{ fontSize: '0.95rem', color: '#7f8c8d', margin: '0.5rem 0' }}>
                {product.description || 'Produit de nettoyage écologique'}
              </p>
              <p className="price">{product.price}€</p>
              <p style={{ fontSize: '0.9rem', color: product.stock > 10 ? '#27ae60' : '#e74c3c', fontWeight: '600' }}>
                {product.stock > 0 ? `✅ En stock (${product.stock})` : '❌ Rupture de stock'}
              </p>
              <button 
                onClick={() => { 
                  addToCart(product); 
                  alert('✅ Produit ajouté au panier!'); 
                }}
                disabled={product.stock === 0}
                style={{
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {product.stock === 0 ? '❌ Indisponible' : '🛒 Ajouter au panier'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
