// src/hooks/useErrorHandler.js
import { useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (callback) => {
    setIsLoading(true);
    setError(null);
    
    return callback()
      .catch(error => {
        console.error('Error:', error);
        setError({
          message: error.response?.data?.message || 'An unexpected error occurred',
          status: error.response?.status || 500
        });
      })
      .finally(() => setIsLoading(false));
  };

  const clearError = () => setError(null);

  return { handleError, error, isLoading, clearError };
};