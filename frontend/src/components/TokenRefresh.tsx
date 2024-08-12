// TokenRefresh.tsx
import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const TokenRefresh: React.FC = () => {
  const { token, refreshToken } = useAuth();

  const checkTokenExpiration = useCallback(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration < 300000) {
        refreshToken().catch(error => {
          console.error('Failed to refresh token:', error);
        });
      }

      // Schedule next check
      const nextCheckTime = Math.min(timeUntilExpiration - 300000, 60000); // Check either 5 minutes before expiration or every minute, whichever comes first
      setTimeout(checkTokenExpiration, nextCheckTime);
    }
  }, [token, refreshToken]);

  useEffect(() => {
    const timeoutId = setTimeout(checkTokenExpiration, 60000); // Initial check after 1 minute
    return () => clearTimeout(timeoutId);
  }, [checkTokenExpiration]);

  return null; // This component doesn't render anything
};

export default TokenRefresh;