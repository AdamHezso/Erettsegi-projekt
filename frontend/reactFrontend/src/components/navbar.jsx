import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

// Navbar component: handles navigation and login/logout buttons
function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [hasOrder, setHasOrder] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setHasOrder(false);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setHasOrder(false);
      return;
    }
    fetch('http://localhost:3000/myorder', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => setHasOrder(true))
      .catch(() => setHasOrder(false));
  }, [isLoggedIn]);

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/shop')}>Shop</button>
          <button onClick={() => navigate('/cart')}>Cart</button>
          {isLoggedIn && hasOrder && (
            <button onClick={() => navigate('/order-tracking')}>Order tracking</button>
          )}
          {isLoggedIn && (
            <button onClick={() => navigate('/profile')}>Profile</button>
          )}
        </div>
        <div className="navbar-right">
          {isLoggedIn ? (
            <button onClick={onLogout}>Log out</button>
          ) : (
            <button onClick={() => navigate('/login')}>Log in</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
