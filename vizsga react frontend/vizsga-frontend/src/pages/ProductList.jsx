// src/pages/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductList = () => {
    const { handleError, isLoading } = useErrorHandler();
    const [products, setProducts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        handleError(async () => {
            const response = await fetch('127.1.1.1:3000/parts');
            const data = await response.json();
            setProducts(data);
        });
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % products.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [products]);

    if (isLoading) return <LoadingSpinner />;
    if (!products.length) return <div>No products available</div>;

    return (
        <div className="product-list">
            <div className="featured-product">
                <img 
                    src={products[currentImageIndex].image_url} 
                    alt={products[currentImageIndex].name}
                />
                <div className="product-info">
                    <h2>{products[currentImageIndex].name}</h2>
                    <p>{products[currentImageIndex].description}</p>
                    <p className="price">${products[currentImageIndex].price}</p>
                    <button>Add to Cart</button>
                </div>
            </div>
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;