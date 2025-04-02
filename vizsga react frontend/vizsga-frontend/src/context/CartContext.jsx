// src/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity })
            });
            const data = await response.json();
            setCartItems(prev => [...prev, data]);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });
            const data = await response.json();
            setCartItems(prev => prev.map(item => 
                item.id === itemId ? data : item
            ));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE'
            });
            setCartItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            updateQuantity, 
            removeFromCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => useContext(CartContext);