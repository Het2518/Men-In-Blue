import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import logo from '../assets/images/green-hydrogen.svg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const demoLogin = (role) => {
    const demoAccounts = {
      producer: { email: 'producer@hydrachain.com', password: 'password123' },
      buyer: { email: 'buyer@hydrachain.com', password: 'password123' },
      certifier: { email: 'certifier@hydrachain.com', password: 'password123' },
      admin: { email: 'admin@hydrachain.com', password: 'admin123' }
    };

    setFormData(demoAccounts[role]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Logging in..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background particles */}
      <div className="particles absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle absolute animate-float" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`
          }}></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-hydrogen-dark/80 backdrop-blur-sm rounded-2xl border border-hydrogen-cyan/30 p-8 shadow-2xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img src={logo} alt="HydraChain" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your HydraChain account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="w-full"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="w-full pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-hydrogen-cyan to-hydrogen-blue text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="text-center mb-4">
              <span className="text-gray-400 text-sm">Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['producer', 'buyer', 'certifier', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => demoLogin(role)}
                  className="text-xs px-3 py-2 bg-hydrogen-cyan/20 text-hydrogen-cyan rounded-lg hover:bg-hydrogen-cyan/30 transition-colors capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-hydrogen-cyan hover:text-white transition-colors font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
