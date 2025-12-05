import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h2>Panier</h2>
        <p>Votre panier est vide</p>
        <Link to="/products" style={{ color: '#27ae60', textDecoration: 'none' }}>← Continuer les achats</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Panier ({cart.length} produit{cart.length > 1 ? 's' : ''})</h2>
      
      <div style={{ maxWidth: 800, margin: '20px 0' }}>
        {cart.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: '1px solid #ddd' }}>
            <div>
              <h4>{item.name}</h4>
              <p style={{ color: '#666' }}>{item.price}€ x {item.quantity}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                style={{ width: 50, padding: 6 }}
              />
              <button
                onClick={() => removeFromCart(item.id)}
                style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 20, background: '#f8f9fa', borderRadius: 8, maxWidth: 800, marginTop: 20 }}>
        <h3>Résumé</h3>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: {getTotal()}€</p>
        <Link to="/checkout" style={{ display: 'inline-block', padding: '10px 20px', background: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: 6, marginTop: 12 }}>
          Procéder au paiement
        </Link>
      </div>
    </div>
  );
}

export default Cart;
