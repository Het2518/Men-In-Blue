import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to your authentication endpoint
      console.log('Login attempt:', formData);
      
      // Mock authentication logic
      if (formData.email === 'test@example.com' && formData.password === 'password123') {
        // Redirect based on role
        const dashboardRoutes = {
          producer: '/dashboard/producer',
          buyer: '/dashboard/buyer',
          certifier: '/dashboard/certifier',
          admin: '/dashboard/admin'
        };
        
        // In a real app, you'd use React Router navigate
        console.log(`Login successful! Redirecting to: ${dashboardRoutes[formData.role]}`);
        
        // Store auth data (in real app, you'd use Context or state management)
        localStorage.setItem('userRole', formData.role);
        localStorage.setItem('userEmail', formData.email);
        
      } else {
        throw new Error('Invalid credentials');
      }
      
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              H₂
            </div>
            <span className="text-2xl font-bold text-green-800 ml-3">HydroChain</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-green-600 hover:text-green-500">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-green-600 hover:text-green-500">Privacy Policy</a>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
          <p className="text-xs text-blue-600">
            Email: test@example.com<br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;