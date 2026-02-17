import { useState, useCallback } from "react";

// エラーハンドリングを行うフック
export const useErrorHandler = () => { 
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: Error | null, prefix = '') => {
    if (!error) {
      setError(null);
      return;
    }
    
    const message = prefix ? `${prefix}: ${error.message}` : error.message;
    setError(message);
  }, []);

  return {
    error,
    handleError,
  };
};