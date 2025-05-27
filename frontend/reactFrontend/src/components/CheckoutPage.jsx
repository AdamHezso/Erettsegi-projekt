import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckoutPage({ cart, setCart }) {
  const [shipping, setShipping] = useState("");
  const [payment, setPayment] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOrder = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        shippingData: shipping,
        paymentData: payment,
        cart,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || "Order placed!");
        setCart([]);
        setTimeout(() => navigate("/order-tracking"), 1500);
      });
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Checkout</h2>
      <form
        className="mx-auto"
        style={{ maxWidth: 400 }}
        onSubmit={handleOrder}
      >
        <div className="mb-3">
          <label className="form-label">Shipping address</label>
          <input
            type="text"
            className="form-control"
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Payment info</label>
          <input
            type="text"
            className="form-control"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Place order
        </button>
        {message && <div className="alert alert-success mt-3">{message}</div>}
      </form>
    </div>
  );
}

export default CheckoutPage;
