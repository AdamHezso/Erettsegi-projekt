import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

// Cart page: displays cart items, allows quantity change and removal
const CartPage = ({ cart, onUpdateCart }) => {
  const navigate = useNavigate();

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    onUpdateCart(updatedCart);
  };

  const handleRemove = (id) => {
    onUpdateCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Cart</h2>
      {cart.length === 0 ? (
        <div className="alert alert-info text-center">Your cart is empty.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (Ft)</th>
                <th>Quantity</th>
                <th>Total (Ft)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="text-end fw-bold">
                  Total:
                </td>
                <td colSpan={2} className="fw-bold">
                  {total} Ft
                </td>
              </tr>
            </tbody>
          </table>
          <button
            style={{
              marginTop: "2rem",
              padding: "0.7rem 1.2rem",
              borderRadius: 6,
              background: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              width: 200,
              fontWeight: 600,
            }}
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;