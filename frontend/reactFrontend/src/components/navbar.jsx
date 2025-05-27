import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

// Navbar component: handles navigation and login/logout buttons
function Navbar({ isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false);
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

  // Menüelemek
  const menuItems = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/cart', label: 'Cart' },
    ...(isLoggedIn
      ? [
          { to: '/profile', label: 'Profile' },
          ...(hasOrder ? [{ to: '/order-tracking', label: 'Order Tracking' }] : []),
          { to: '/', label: 'Log out', onClick: () => { onLogout(); navigate('/'); } }
        ]
      : [{ to: '/login', label: 'Log ins' }]
    ),
  ];

  return (
    <header className="navbar-header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">TribiTrabi</Link>
          {/* Hamburger gomb mobilon */}
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Menü"
            onClick={() => setOpen(!open)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Menüelemek: mobilon lenyíló, nagyobb képernyőn vízszintes */}
          <div className={`collapse navbar-collapse${open ? " show" : ""}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {menuItems.map((item, idx) => (
                <li className="nav-item" key={idx}>
                  <Link
                    className="nav-link"
                    to={item.to}
                    onClick={() => {
                      setOpen(false);
                      if (item.onClick) item.onClick();
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
