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
        const mapped = arr.map(part => ({
          id: part.id,
          name: part.nev,
          price: part.ar,
          stock: part.raktarkeszlet
        }));
        setParts(mapped);
        setFiltered(mapped);
      });
  }, []);

  useEffect(() => {
    setFiltered(parts.filter(part =>
      typeof part.name === 'string' && part.name.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, parts]);

  return (
    <div className="shop-container">
      <h1>Shop</h1>
      <form style={{marginBottom: '20px'}} onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>
      <div className="card-list">
        {filtered.map(part => (
          <div className="part-card" key={part.id}>
            <h3>{part.name}</h3>
            <p style={{ color: 'black' }}>Price: {part.price ? part.price + ' Ft' : 'N/A'}</p>
            <p style={{ color: 'black' }}>Stock: {part.stock !== undefined ? part.stock : 'N/A'}</p>
            <button onClick={() => onAddToCart(part)}>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;