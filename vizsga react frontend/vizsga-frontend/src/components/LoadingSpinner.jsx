// src/components/LoadingSpinner.jsx
import React from 'react';
import '../styles/LoadingSpinner.css'; 

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className={`loading-spinner ${sizes[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`} />
  );
};

export default LoadingSpinner;