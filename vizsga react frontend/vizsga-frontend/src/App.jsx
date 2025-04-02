// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
                <Footer />
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;