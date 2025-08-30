import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Mock user database for development
const MOCK_USERS = [
  {
    id: '1',
    email: 'producer@hydrachain.com',
    password: 'password123',
    name: 'John Producer',
    role: 'producer',
    company: 'Green Energy Co.',
    phone: '+1234567890',
    walletAddress: '0x742d35Cc5aF7482C6d2a5d5B0E8eE73c7D8a0Cd1',
    isVerified: true
  },
  {
    id: '2',
    email: 'buyer@hydrachain.com',
    password: 'password123',
    name: 'Sarah Buyer',
    role: 'buyer',
    company: 'Industrial Corp.',
    phone: '+1234567891',
    walletAddress: '0x123d35Cc5aF7482C6d2a5d5B0E8eE73c7D8a0Cd2',
    isVerified: true
  },
  {
    id: '3',
    email: 'certifier@hydrachain.com',
    password: 'password123',
    name: 'Mike Certifier',
    role: 'certifier',
    company: 'Certification Authority',
    phone: '+1234567892',
    walletAddress: '0x456d35Cc5aF7482C6d2a5d5B0E8eE73c7D8a0Cd3',
    isVerified: true
  },
  {
    id: '4',
    email: 'admin@hydrachain.com',
    password: 'admin123',
    name: 'Alex Admin',
    role: 'admin',
    company: 'HydraChain',
    phone: '+1234567893',
    walletAddress: '0x789d35Cc5aF7482C6d2a5d5B0E8eE73c7D8a0Cd4',
    isVerified: true
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for saved session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('hydrachain_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        toast.info(`Welcome back, ${userData.name}!`);
      } catch (error) {
        console.error('Error loading saved session:', error);
        localStorage.removeItem('hydrachain_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock database
      const foundUser = MOCK_USERS.find(u =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      if (!foundUser.isVerified) {
        throw new Error('Account not verified. Please contact admin.');
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;

      setUser(userWithoutPassword);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem('hydrachain_user', JSON.stringify(userWithoutPassword));

      toast.success(`Welcome, ${foundUser.name}!`);
      return { success: true, user: userWithoutPassword };

    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if email already exists
      const existingUser = MOCK_USERS.find(u =>
        u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        isVerified: true // Auto-verify in development
      };

      // Add to mock database
      MOCK_USERS.push(newUser);

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = newUser;

      setUser(userWithoutPassword);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem('hydrachain_user', JSON.stringify(userWithoutPassword));

      toast.success(`Account created successfully! Welcome, ${newUser.name}!`);
      return { success: true, user: userWithoutPassword };

    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hydrachain_user');
    toast.info('Logged out successfully');
  };

  // Get user roles for Web3Context integration
  const getUserRoles = () => {
    if (!user) return { isProducer: false, isBuyer: false, isCertifier: false, isAdmin: false };

    return {
      isProducer: user.role === 'producer' || user.role === 'admin',
      isBuyer: user.role === 'buyer' || user.role === 'admin',
      isCertifier: user.role === 'certifier' || user.role === 'admin',
      isAdmin: user.role === 'admin'
    };
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    getUserRoles,
    mockUsers: MOCK_USERS // For demo purposes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
