import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { account, isConnected } = useWallet();

  useEffect(() => {
    checkAuthStatus();
  }, [account, isConnected]);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);

      if (!isConnected || !account) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Check if user exists in localStorage (for demo purposes)
      // In production, you'd validate with your backend
      const userData = localStorage.getItem(`user_${account}`);

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      // Store user data
      localStorage.setItem(`user_${account}`, JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    if (account) {
      localStorage.removeItem(`user_${account}`);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    if (account) {
      localStorage.setItem(`user_${account}`, JSON.stringify(newUser));
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
