import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';
import { useAuth } from '../hooks/useAuth';
import { getCurrentTokenId, getBalance } from '../utils/contract';
import { fetchMetadata } from '../utils/ipfs';
import { formatNumber, truncateAddress } from '../utils/format';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

const Dashboard = () => {
  const { web3 } = useContext(Web3Context);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tokenId, setTokenId] = useState(0);
  const [balance, setBalance] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        if (web3 && user?.walletAddress) {
          const currentTokenId = await getCurrentTokenId(web3);
          setTokenId(currentTokenId);
          const userBalance = await getBalance(web3, user.walletAddress, currentTokenId);
          setBalance(userBalance);
          const meta = await fetchMetadata(currentTokenId);
          setMetadata(meta);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [web3, user, navigate, isAuthenticated]);

  const roleButtons = [
    {
      title: 'Producer Panel',
      description: 'Issue new green hydrogen credits',
      icon: '🏭',
      color: 'from-green-500 to-green-600',
      show: user?.role === 'producer' || user?.role === 'admin',
      onClick: () => navigate('/producer')
    },
    {
      title: 'Buyer Panel',
      description: 'Purchase and manage credits',
      icon: '💰',
      color: 'from-blue-500 to-blue-600',
      show: user?.role === 'buyer' || user?.role === 'admin',
      onClick: () => navigate('/buyer')
    },
    {
      title: 'Certifier Panel',
      description: 'Verify oracle data',
      icon: '🔍',
      color: 'from-purple-500 to-purple-600',
      show: user?.role === 'certifier' || user?.role === 'admin',
      onClick: () => navigate('/certifier')
    },
    {
      title: 'Admin Panel',
      description: 'System administration',
      icon: '⚙️',
      color: 'from-yellow-500 to-yellow-600',
      show: user?.role === 'admin',
      onClick: () => navigate('/admin')
    }
  ];

  const activeRoles = roleButtons.filter(role => role.show); if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 relative">
      {/* Background particles */}
      <div className="particles absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="particle absolute animate-float" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`
          }}></div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-hydrogen-cyan to-hydrogen-blue bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xl text-gray-300">Welcome back! Manage your green hydrogen credits.</p>
        </div>

        {/* Account Info Card */}
        <div className="bg-hydrogen-dark/80 backdrop-blur-sm rounded-2xl border border-hydrogen-cyan/30 p-8 mb-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-hydrogen-cyan mb-6">Account Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-hydrogen-dark/50 p-4 rounded-xl border border-hydrogen-cyan/20">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Wallet Address</h3>
              <p className="text-white font-mono text-lg">{user?.walletAddress ? truncateAddress(user.walletAddress) : 'Not connected'}</p>
            </div>

            <div className="bg-hydrogen-dark/50 p-4 rounded-xl border border-hydrogen-cyan/20">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Current Token ID</h3>
              <p className="text-hydrogen-cyan font-semibold text-lg">{tokenId}</p>
            </div>

            <div className="bg-hydrogen-dark/50 p-4 rounded-xl border border-hydrogen-cyan/20">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Credit Balance</h3>
              <p className="text-green-400 font-semibold text-lg">{formatNumber(balance)} credits</p>
            </div>
          </div>

          {/* Roles */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Active Roles</h3>
            <div className="flex flex-wrap gap-2">
              {user?.role === 'producer' && <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Producer</span>}
              {user?.role === 'buyer' && <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Buyer</span>}
              {user?.role === 'certifier' && <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Certifier</span>}
              {user?.role === 'admin' && <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Admin</span>}
              {!user?.role && <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-sm">No role assigned</span>}
            </div>
          </div>

          {metadata && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Token Metadata</h3>
              <p className="text-white">{metadata.name || 'No metadata available'}</p>
            </div>
          )}
        </div>

        {/* Action Panels */}
        {activeRoles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRoles.map((role, index) => (
                <div
                  key={index}
                  className="bg-hydrogen-dark/80 backdrop-blur-sm rounded-xl border border-hydrogen-cyan/30 p-6 hover:border-hydrogen-cyan/60 transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={role.onClick}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{role.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{role.title}</h3>
                    <p className="text-gray-400 mb-4">{role.description}</p>
                    <Button
                      className={`w-full bg-gradient-to-r ${role.color} text-white hover:scale-105 transition-all duration-300`}
                    >
                      Access Panel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No roles message */}
        {activeRoles.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-hydrogen-dark/50 rounded-xl p-8 border border-hydrogen-cyan/20 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-4">No Access Roles</h3>
              <p className="text-gray-400">
                You don't have any roles assigned yet. Contact the admin to get access to the platform features.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
