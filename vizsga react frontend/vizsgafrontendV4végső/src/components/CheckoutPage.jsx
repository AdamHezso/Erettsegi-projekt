import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = ({ cart, setCart }) => {
  const [paymentData, setPaymentData] = useState('');
  const [shippingData, setShippingData] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    fetch('http://localhost:3000/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paymentData, shippingData, cart })
      });
      const data = await response.json();
      if (response.ok && data.id) {
        setOrderId(data.id);
        if (typeof setCart === 'function') {
          setCart([]);
          localStorage.removeItem('cart');
        }
      } else {
        setError(data.message || 'Error placing order!');
      }
    } catch (err) {
      setError('Network error!');
    }
  };

  if (orderId) {
    return (
      <div style={{ marginTop: 80, textAlign: 'center' }}>
        <h2>Order successful!</h2>
        <p>Order ID: <b>{orderId}</b></p>
        <p>You can track your order with this ID.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', minWidth: 320, color: 'black' }}>
        <h2>Checkout</h2>
        <div style={{ marginBottom: 16 }}>
          <label>Payment data:</label>
          <input type="text" value={paymentData} onChange={e => setPaymentData(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Shipping data:</label>
          <input type="text" value={shippingData} onChange={e => setShippingData(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ padding: 10, borderRadius: 6, background: '#007bff', color: '#fff', border: 'none', width: '100%' }}>Place order</button>
        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
      </form>
    </div>
  );
};

export default CheckoutPage;
