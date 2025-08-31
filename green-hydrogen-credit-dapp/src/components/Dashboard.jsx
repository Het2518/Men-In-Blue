import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import WalletConnection from './common/WalletConnection';
import Button from './common/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    isConnected,
    balance,
    networkName,
    roles
  } = useWeb3();

  // Get user role from Clerk metadata
  const userRole = user?.publicMetadata?.role || 'buyer';

  const handleNavigation = (path) => {
    navigate(`/${path}`);
  };

  // Role-based feature definitions
  const roleFeatures = {
    admin: {
      title: 'Administrator',
      color: 'from-red-500 to-red-700',
      icon: '🔧',
      description: 'Full system administration and management',
      actions: [
        { key: 'admin', label: 'Admin Panel', icon: '🔧', path: 'admin' },
        { key: 'producer', label: 'Producer View', icon: '⚡', path: 'producer' },
        { key: 'buyer', label: 'Buyer Marketplace', icon: '🛒', path: 'buyer' },
        { key: 'certifier', label: 'Certifier Portal', icon: '🏅', path: 'certifier' }
      ]
    },
    producer: {
      title: 'Producer',
      color: 'from-green-500 to-green-700',
      icon: '⚡',
      description: 'Issue and manage green hydrogen credits',
      actions: [
        { key: 'producer', label: 'Producer Dashboard', icon: '⚡', path: 'producer' },
        { key: 'buyer', label: 'Marketplace', icon: '🛒', path: 'buyer' }
      ]
    },
    buyer: {
      title: 'Buyer',
      color: 'from-blue-500 to-blue-700',
      icon: '🛒',
      description: 'Purchase and trade green hydrogen credits',
      actions: [
        { key: 'buyer', label: 'Buyer Marketplace', icon: '🛒', path: 'buyer' }
      ]
    },
    certifier: {
      title: 'Certifier',
      color: 'from-purple-500 to-purple-700',
      icon: '🏅',
      description: 'Verify and certify green hydrogen production',
      actions: [
        { key: 'certifier', label: 'Certifier Portal', icon: '🏅', path: 'certifier' },
        { key: 'buyer', label: 'Marketplace', icon: '🛒', path: 'buyer' }
      ]
    }
  };

  const currentRoleInfo = roleFeatures[userRole] || roleFeatures.buyer;

  // Portfolio stats (mock data for demo)
  const portfolioStats = {
    totalCredits: 0,
    totalValue: 0,
    carbonOffset: 0,
    activeTransactions: 0
  };

  if (isConnected && userRole === 'buyer') {
    portfolioStats.totalCredits = 156;
    portfolioStats.totalValue = 12450.50;
    portfolioStats.carbonOffset = 312.5;
    portfolioStats.activeTransactions = 3;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-400 text-lg">
                {currentRoleInfo.description}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${currentRoleInfo.color} text-white font-semibold flex items-center gap-2`}>
              <span className="text-2xl">{currentRoleInfo.icon}</span>
              <span>{currentRoleInfo.title}</span>
            </div>
          </div>
        </div>

        {/* Wallet Connection Card */}
        <div className="mb-8">
          <WalletConnection />
        </div>

        {isConnected ? (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">💰</div>
                  <div className="text-blue-400 text-sm font-medium">Wallet Balance</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {parseFloat(balance).toFixed(4)} ETH
                </div>
                <div className="text-gray-400 text-sm">
                  Network: {networkName || 'Unknown'}
                </div>
              </div>

              {userRole === 'buyer' && (
                <>
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">🌱</div>
                      <div className="text-green-400 text-sm font-medium">Total Credits</div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {portfolioStats.totalCredits}
                    </div>
                    <div className="text-gray-400 text-sm">Green Hydrogen Credits</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">📊</div>
                      <div className="text-purple-400 text-sm font-medium">Portfolio Value</div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      ${portfolioStats.totalValue.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">USD Value</div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">🌍</div>
                      <div className="text-yellow-400 text-sm font-medium">Carbon Offset</div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {portfolioStats.carbonOffset} tons
                    </div>
                    <div className="text-gray-400 text-sm">CO2 Equivalent</div>
                  </div>
                </>
              )}
            </div>

            {/* Role-Based Actions */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">{currentRoleInfo.icon}</span>
                Available Actions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRoleInfo.actions.map((action) => {
                  const isActive = roles[`is${action.key.charAt(0).toUpperCase() + action.key.slice(1)}`];

                  return (
                    <div
                      key={action.key}
                      className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${isActive
                          ? 'bg-gradient-to-br from-green-500/20 to-green-600/30 border-green-500/30'
                          : 'bg-gradient-to-br from-gray-500/10 to-gray-600/20 border-gray-500/20'
                        } backdrop-blur-sm rounded-2xl p-6 border`}
                      onClick={() => handleNavigation(action.path)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{action.icon}</div>
                        {isActive && (
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        {action.label}
                      </h3>

                      <p className="text-gray-400 text-sm mb-4">
                        {action.key === 'admin' && 'Manage system settings and user permissions'}
                        {action.key === 'producer' && 'Issue new credits and manage production'}
                        {action.key === 'buyer' && 'Browse and purchase green hydrogen credits'}
                        {action.key === 'certifier' && 'Verify and approve credit applications'}
                      </p>

                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                        }`}>
                        {isActive ? 'Access Granted' : 'Role Required'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate('/profile')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </Button>

                {userRole === 'buyer' && (
                  <Button
                    onClick={() => navigate('/buyer')}
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    Browse Marketplace
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Not Connected State */
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🔗</div>
              <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-400 text-lg mb-8">
                Connect your MetaMask wallet to access the Green Hydrogen Credit platform.
                You are signed in as <span className="text-white font-semibold">{user?.firstName} {user?.lastName}</span> with <span className="text-blue-400 font-semibold capitalize">{userRole}</span> privileges.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Fast & Secure</h3>
                  <p className="text-gray-400 text-sm">Connect securely using MetaMask wallet integration</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                  <div className="text-3xl mb-3">🌱</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Green Trading</h3>
                  <p className="text-gray-400 text-sm">Trade verified green hydrogen credits on blockchain</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
