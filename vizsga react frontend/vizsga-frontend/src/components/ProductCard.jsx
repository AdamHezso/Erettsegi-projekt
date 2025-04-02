// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="description">{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <button className="add-to-cart">Add to Cart</button>
    </div>
  );
};

export default ProductCard;