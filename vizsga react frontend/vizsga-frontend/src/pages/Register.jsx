// src/pages/Register.jsx
import React, { useState } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import '../styles/Register.css';

const Register = () => {
  const { handleError, isLoading } = useErrorHandler();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleError(async () => {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('127.1.1.1:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Handle successful registration
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    });
  };

  if (isLoading) return <div>Registering...</div>;

  return (
    <div className="register-page">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              username: e.target.value
            }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              email: e.target.value
            }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              password: e.target.value
            }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              confirmPassword: e.target.value
            }))}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;