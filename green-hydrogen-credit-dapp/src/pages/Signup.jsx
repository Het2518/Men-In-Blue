import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import logo from '../assets/images/green-hydrogen.svg';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    role: 'buyer' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'producer', label: 'Producer - Issue green hydrogen credits', icon: '🏭' },
    { value: 'buyer', label: 'Buyer - Purchase and retire credits', icon: '💰' },
    { value: 'certifier', label: 'Certifier - Verify and audit credits', icon: '🔍' }
  ];

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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword: _, ...userData } = formData;
    const result = await signup(userData);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Creating account..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
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
            <h1 className="text-3xl font-bold text-white mb-2">Join HydraChain</h1>
            <p className="text-gray-400">Create your account to start trading</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                className="w-full"
              />
            </div>

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

            <div>
              <Input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                error={errors.company}
                className="w-full"
              />
            </div>

            <div>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                className="w-full"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Select Your Role</label>
              <div className="space-y-2">
                {roleOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-600 hover:border-hydrogen-cyan/50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleChange}
                      className="mt-1 text-hydrogen-cyan"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-white font-medium capitalize">{option.value}</span>
                      </div>
                      <p className="text-sm text-gray-400">{option.label.split(' - ')[1]}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role}</p>}
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

            <div>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-hydrogen-cyan to-hydrogen-blue text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-hydrogen-cyan hover:text-white transition-colors font-semibold">
                Sign in
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

export default Signup;
