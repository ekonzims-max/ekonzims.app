import React, { useState } from 'react';

function SearchBar({ onSearch, placeholder = "Rechercher..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} style={{
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
      maxWidth: '600px',
      margin: '0 auto 2rem'
    }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: '1rem 1.5rem',
          border: '2px solid #e0e0e0',
          borderRadius: '50px',
          fontSize: '1rem',
          outline: 'none',
          transition: 'all 0.3s',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
        onFocus={(e) => e.target.style.borderColor = '#27ae60'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      />
      <button
        type="submit"
        style={{
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.3s',
          boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(39, 174, 96, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(39, 174, 96, 0.3)';
        }}
      >
        🔍 Rechercher
      </button>
    </form>
  );
}

export default SearchBar;
