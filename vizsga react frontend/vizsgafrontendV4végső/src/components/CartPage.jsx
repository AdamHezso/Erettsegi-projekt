import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ cart, onUpdateCart }) => {
  const navigate = useNavigate();

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    onUpdateCart(updatedCart);
  };

  const handleRemove = (id) => {
    onUpdateCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="cart-container">
      <h1>Kosár</h1>
      {cart.length === 0 ? (
        <p>A kosár üres.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <span>{item.nev}</span>
                <span>Mennyiség: {item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                <button onClick={() => handleQuantityChange(item.id, -1)} disabled={item.quantity === 1}>-</button>
                <button onClick={() => handleRemove(item.id)}>Eltávolítás</button>
              </li>
            ))}
          </ul>
          <button style={{marginTop: '2rem', padding: '0.7rem 1.2rem', borderRadius: 6, background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', width: 200, fontWeight: 600}} onClick={() => navigate('/checkout')}>
            Tovább a kasszához
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;