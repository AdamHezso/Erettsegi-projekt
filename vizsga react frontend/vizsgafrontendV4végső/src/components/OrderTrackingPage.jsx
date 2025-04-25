import React, { useEffect, useState } from 'react';

const OrderTrackingPage = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:3000/myorder', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    })
      .then(res => {
        if (!res.ok) throw new Error('Nincs aktív rendelésed vagy hiba történt!');
        return res.json();
      })
      .then(data => setOrder(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div style={{ marginTop: 80, color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!order) return <div style={{ marginTop: 80, textAlign: 'center' }}>Betöltés...</div>;

  return (
    <div style={{ marginTop: 300, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', minWidth: 320,color: 'black' }}>
        <h2>Rendelés követés</h2>
        <p><b>Rendelés azonosító:</b> {order.id}</p>
        <p><b>Dátum:</b> {new Date(order.datum).toLocaleString()}</p>
        <p><b>Fizetési adatok:</b> {order.fizetesiAdatok}</p>
        <p><b>Szállítási adatok:</b> {order.szallitasiAdatok}</p>
        {/* Itt bővíthető a rendelés állapotával, stb. */}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
