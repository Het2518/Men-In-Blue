import { useState, useCallback } from 'react';

// Custom hook for authentication logic
// This hook can be used independently or alongside the AuthContext
const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear any existing errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Mock API call - replace with your actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!response.ok) {
        // If actual API call fails
        if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
          // Mock successful login
          const userData = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: credentials.email,
            role: credentials.role,
            companyName: 'Demo Company',
            token: 'mock-token-' + Date.now()
          };

          // Store in localStorage
          localStorage.setItem('authToken', userData.token);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userRole', userData.role);

          return { success: true, user: userData };
        } else {
          throw new Error('Invalid email or password');
        }
      }

      const data = await response.json();
      
      // Store authentication data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role);

      return { success: true, user: data.user };

    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'companyName'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password strength
      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Mock API call - replace with your actual API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // For demo purposes, simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful registration
      const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        companyName: userData.companyName,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        token: 'mock-token-' + Date.now()
      };

      // Store authentication data
      localStorage.setItem('authToken', newUser.token);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('userRole', newUser.role);

      return { success: true, user: newUser };

    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    // Clear all stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Clear any errors
    setError(null);

    // In a real app, you might also want to make an API call to invalidate the token
    // await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() });

    return { success: true };
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }, []);

  // Get current user data
  const getCurrentUser = useCallback(() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }, []);

  // Get authentication headers for API requests
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    const user = getCurrentUser();
    return user && user.role === role;
  }, [getCurrentUser]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    const user = getCurrentUser();
    if (!user) return false;

    const rolePermissions = {
      admin: [
        'user_management',
        'system_administration', 
        'view_all_credits',
        'audit_access',
        'platform_settings'
      ],
      producer: [
        'create_credits',
        'view_own_credits',
        'production_management',
        'facility_management'
      ],
      buyer: [
        'purchase_credits',
        'retire_credits',
        'marketplace_access',
        'compliance_reporting'
      ],
      certifier: [
        'verify_credits',
        'audit_production',
        'certification_management',
        'compliance_verification'
      ]
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  }, [getCurrentUser]);

  // Update user profile
  const updateProfile = useCallback(async (updatedData) => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...currentUser,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };

    } catch (err) {
      const errorMessage = err.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Current and new passwords are required');
      }

      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };

    } catch (err) {
      const errorMessage = err.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify email
  const verifyEmail = useCallback(async (verificationCode) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!verificationCode) {
        throw new Error('Verification code is required');
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          emailVerified: true,
          verifiedAt: new Date().toISOString()
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }

      return { success: true };

    } catch (err) {
      const errorMessage = err.message || 'Email verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  return {
    // State
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    verifyEmail,
    
    // Utilities
    isAuthenticated,
    getCurrentUser,
    getAuthHeaders,
    hasRole,
    hasPermission,
    clearError
  };
};

export default useAuth;