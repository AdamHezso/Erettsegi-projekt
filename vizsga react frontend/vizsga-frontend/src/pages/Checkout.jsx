// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useCartContext } from '../context/CartContext';

const Checkout = () => {
    const { cartItems } = useCartContext();
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentInfo,
                    shippingInfo
                })
            });
            const data = await response.json();
            // Handle order success
        } catch (error) {
            console.error('Checkout failed:', error);
        }
    };

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <div className="shipping-info">
                    <h3>Shipping Information</h3>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo(prev => ({
                                ...prev,
                                address: e.target.value
                            }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo(prev => ({
                                ...prev,
                                city: e.target.value
                            }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input
                            type="text"
                            value={shippingInfo.state}
                            onChange={(e) => setShippingInfo(prev => ({
                                ...prev,
                                state: e.target.value
                            }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Zip</label>
                        <input
                            type="text"
                            value={shippingInfo.zip}
                            onChange={(e) => setShippingInfo(prev => ({
                                ...prev,
                                zip: e.target.value
                            }))}
                        />
                    </div>
                </div>
                
                <div className="payment-info">
                    <h3>Payment Information</h3>
                    <div className="form-group">
                        <label>Card Number</label>
                        <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo(prev => ({
                                ...prev,
                                cardNumber: e.target.value
                            }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry</label>
                        <input
                            type="text"
                            value={paymentInfo.expiry}
                            onChange={(e) => setPaymentInfo(prev => ({
                                ...prev,
                                expiry: e.target.value
                            }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>CVV</label>
                        <input
                            type="text"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo(prev => ({
                                ...prev,
                                cvv: e.target.value
                            }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Name on Card</label>
                        <input
                            type="text"
                            value={paymentInfo.name}
                            onChange={(e) => setPaymentInfo(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                    </div>
                </div>
                
                <button type="submit">Complete Order</button>
            </form>
        </div>
    );
};

export default Checkout;