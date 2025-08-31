import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../contexts/Web3Context';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Notification from '../components/common/Notification';
import logo from '../assets/images/green-hydrogen.svg';

const Login = () => {
  const [role, setRole] = useState('producer');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const { login, loading } = useAuth();
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const roleOptions = [
    { value: 'producer', label: 'Producer', icon: '🏭' },
    { value: 'buyer', label: 'Buyer', icon: '💰' },
    { value: 'certifier', label: 'Certifier', icon: '🔍' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });

    try {
      const connectedAccount = await connectWallet();
      if (!connectedAccount) {
        setNotification({ message: 'Wallet connection failed or was rejected.', type: 'error' });
        return;
      }

      const result = await login(role, connectedAccount);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setNotification({ message: result.error || 'Login failed. Make sure you are registered with this wallet and role.', type: 'error' });
      }
    } catch (error) {
      console.error("Login error:", error);
      setNotification({ message: 'An unexpected error occurred during login.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      {notification.message && <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ message: '', type: '' })} />}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src={logo} alt="HydraChain Logo" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">I am a...</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {roleOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setRole(option.value)}
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      role === option.value ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="mt-2 text-sm font-semibold text-gray-800">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center items-center" disabled={loading}>
                {loading ? <LoadingSpinner /> : (account ? 'Login' : 'Connect Wallet & Login')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
