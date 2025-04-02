// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useCartContext } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/CartPage.css';

const CartPage = () => {
  const { cartItems } = useCartContext();
  const { handleError, isLoading } = useErrorHandler();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    handleError(async () => {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setTotal(data.reduce((sum, item) => 
        sum + item.price * item.quantity, 0
      ));
    });
  }, [cartItems]);

  if (isLoading) return <LoadingSpinner />;
  if (!cartItems.length) return <div>Your cart is empty</div>;

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <p>Total: ${total.toFixed(2)}</p>
        <button>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;