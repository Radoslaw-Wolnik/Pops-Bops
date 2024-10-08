import React, { createContext, useState, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister, getMe, ApiError, refreshAuthToken } from '../services/api';
import { FullUser } from '../types';


export interface AuthContextType {
  user: FullUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  updateCurrentUser: (updatedUser: FullUser) => void;
  refreshToken: () => Promise<void>;

  justRegistered: boolean;
  clearJustRegistered: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [justRegistered, setJustRegistered] = useState(false);

  /* when storing token in local storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);*/

  const fetchUserData = useCallback(async () => {
    try {
      const response = await getMe();
      setUser(response);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await apiLogin({email, password});
      await fetchUserData();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during login');
      }
    }
  }, [fetchUserData]);

  const register = useCallback(async (email: string, username: string, password: string) => {
    try {
      const response = await apiRegister({ email, username, password });
      if (response){
        await login(email, password);
        setJustRegistered(true);
      }
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during registration');
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      await refreshAuthToken();
      await fetchUserData();
    } catch (error) {
      // Handle error (e.g., redirect to login page)
      console.error('Failed to refresh token:', error);
      logout();
    }
  }, []);

  const updateCurrentUser = useCallback((updatedUser: FullUser) => {
    setUser(updatedUser);
  }, []);

  const clearJustRegistered = useCallback(() => {
    setJustRegistered(false);
  }, []);

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateCurrentUser,
    refreshToken,

    justRegistered,
    clearJustRegistered,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};