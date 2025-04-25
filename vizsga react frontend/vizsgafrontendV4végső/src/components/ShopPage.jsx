import React, { useState, useEffect } from 'react';
import './ShopPage.css';

const ShopPage = ({ onAddToCart }) => {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/parts')
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setParts(arr);
        setFiltered(arr);
      });
  }, []);

  useEffect(() => {
    setFiltered(parts.filter(part =>
      typeof part.nev === 'string' && part.nev.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, parts]);

  return (
    <div className="shop-container">
      <h1>Áruház</h1>
      <form style={{marginBottom: '20px'}} onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          placeholder="Keresés név alapján..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>
      <div className="card-list">
        {filtered.map(part => (
          <div className="part-card" key={part.id}>
            <h3>{part.nev}</h3>
            <p style={{ color: 'black' }}>Ár: {part.ar ? part.ar + ' Ft' : 'N/A'}</p>
            <p style={{ color: 'black' }}>Raktárkészlet: {part.raktarkeszlet !== undefined ? part.raktarkeszlet : 'N/A'}</p>
            <button onClick={() => onAddToCart(part)}>Kosárba</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;