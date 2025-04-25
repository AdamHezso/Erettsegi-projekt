import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/cart')
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => console.error(err));
  }, []);

  const updateQuantity = (id, qty) => {
    fetch(`http://localhost:3000/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: qty })
    })
      .then(res => res.json())
      .then(() => setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item)));
  };

  return (
    <div>
      <h2>Kosár</h2>
      {cart.map(item => (
        <div key={item.id}>
          {item.nev} - {item.ar} Ft x
          <input
            type="number"
            value={item.quantity}
            min={1}
            onChange={e => updateQuantity(item.id, Number(e.target.value))}
            style={{ width: 40, marginLeft: 5 }}
          />
        </div>
      ))}
      <button onClick={() => navigate('/checkout')}>Tovább a fizetéshez</button>
    </div>
  );
}

export default CartPage;