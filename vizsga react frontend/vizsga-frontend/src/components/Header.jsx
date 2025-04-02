// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo">Auto Parts Store</Link>
        
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;