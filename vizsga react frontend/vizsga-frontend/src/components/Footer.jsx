// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css'; 

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-links">
          <h3>About Us</h3>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
        </div>
        
        <div className="social-links">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="#" target="_blank">Facebook</a></li>
            <li><a href="#" target="_blank">Twitter</a></li>
            <li><a href="#" target="_blank">Instagram</a></li>
          </ul>
        </div>
        
        <div className="copyright">
          <p>&copy; 2025 Auto Parts Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;