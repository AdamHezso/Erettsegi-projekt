// src/pages/Login.jsx
import React, { useState } from 'react';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('127.1.1.1:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            // Handle login success
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            username: e.target.value
                        }))}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            password: e.target.value
                        }))}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;