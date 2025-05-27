import React, { useEffect, useState } from "react";

// Order tracking page: displays order details and status
const OrderTrackingPage = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/myorder", {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    })
      .then((res) => {
        if (!res.ok) throw new Error('No active order or an error occurred!');
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div style={{ marginTop: 80, color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!order) return <div style={{ marginTop: 80, textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Order Tracking</h2>
      <div className="card mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-body">
          <p>
            <b>Order ID:</b> {order.id}
          </p>
          <p>
            <b>Date:</b> {new Date(order.date).toLocaleString()}
          </p>
          <p>
            <b>Shipping:</b> {order.shippingData}
          </p>
          <p>
            <b>Payment:</b> {order.paymentData}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
