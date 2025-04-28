import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

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
          <button onClick={() => navigate('/')}>Főoldal</button>
          <button onClick={() => navigate('/shop')}>Áruház</button>
          <button onClick={() => navigate('/cart')}>Kosár</button>
          {isLoggedIn && hasOrder && (
            <button onClick={() => navigate('/order-tracking')}>Rendelés követés</button>
          )}
          {isLoggedIn && (
            <button onClick={() => navigate('/profile')}>Profil</button>
          )}
        </div>
        <div className="navbar-right">
          {isLoggedIn ? (
            <button onClick={onLogout}>Kijelentkezés</button>
          ) : (
            <button onClick={() => navigate('/login')}>Bejelentkezés</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
