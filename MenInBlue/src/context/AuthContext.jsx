import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useWallet from '../hooks/useWallet';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { account, isConnected } = useWallet();

  // Check authentication status when wallet changes
  const checkAuthStatus = useCallback(() => {
    setLoading(true);
    if (!isConnected || !account) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    const userData = localStorage.getItem(`user_${account}`);
    if (userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [account, isConnected]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login function
  const login = async (userData) => {
    localStorage.setItem(`user_${account}`, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return { success: true };
  };

  // Logout function
  const logout = () => {
    if (account) {
      localStorage.removeItem(`user_${account}`);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user function
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
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
