import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatNumber, truncateAddress } from '../../utils/format';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalCredits: 0,
    carbonOffset: 0,
    joinDate: null,
    lastActivity: null
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStats({
          totalTransactions: Math.floor(Math.random() * 100) + 20,
          totalCredits: Math.floor(Math.random() * 1000) + 100,
          carbonOffset: (Math.random() * 50 + 10).toFixed(2),
          joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });

        setActivities([
          {
            id: 1,
            type: 'credit_issued',
            amount: 150,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: 2,
            type: 'credit_transferred',
            amount: 75,
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: 3,
            type: 'credit_retired',
            amount: 50,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            status: 'completed'
          }
        ]);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const getRoleColor = (role) => {
    const colors = {
      producer: 'from-green-500 to-emerald-600',
      buyer: 'from-blue-500 to-cyan-600',
      certifier: 'from-purple-500 to-violet-600',
      admin: 'from-yellow-500 to-orange-600'
    };
    return colors[role] || 'from-gray-500 to-gray-600';
  };

  const getRoleIcon = (role) => {
    const icons = {
      producer: '🏭',
      buyer: '💰',
      certifier: '🔍',
      admin: '⚙️'
    };
    return icons[role] || '👤';
  };

  const getActivityIcon = (type) => {
    const icons = {
      credit_issued: '✨',
      credit_transferred: '📤',
      credit_retired: '♻️'
    };
    return icons[type] || '📋';
  };

  const getActivityColor = (type) => {
    const colors = {
      credit_issued: 'text-green-400',
      credit_transferred: 'text-blue-400',
      credit_retired: 'text-purple-400'
    };
    return colors[type] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRoleColor(user?.role)} flex items-center justify-center text-4xl shadow-2xl`}>
                {getRoleIcon(user?.role)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user?.name || 'Anonymous User'}</h1>
              <p className="text-gray-300 mb-3">{user?.email}</p>
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-2 bg-gradient-to-r ${getRoleColor(user?.role)} text-white rounded-full text-sm font-medium shadow-lg`}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
                <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm">
                  {truncateAddress(user?.walletAddress)}
                </span>
                <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm">
                  Active Member
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                Edit Profile
              </Button>
              <Button variant="primary" size="sm">
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(stats.totalTransactions)}</h3>
            <p className="text-gray-400 text-sm">Total Transactions</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(stats.totalCredits)}</h3>
            <p className="text-gray-400 text-sm">Total Credits</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-2xl">🌱</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.carbonOffset}t</h3>
            <p className="text-gray-400 text-sm">Carbon Offset</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <span className="text-2xl">🏆</span>
              </div>
              <span className="text-green-400 text-sm font-medium">New</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Gold</h3>
            <p className="text-gray-400 text-sm">Member Status</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-8">
          <div className="flex flex-wrap border-b border-white/20">
            {['overview', 'activity', 'achievements', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-all duration-200 ${activeTab === tab
                    ? 'text-white border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Member Since:</span>
                        <span className="text-white">{stats.joinDate?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Activity:</span>
                        <span className="text-white">{stats.lastActivity?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Verification Status:</span>
                        <span className="text-green-400">Verified ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">KYC Status:</span>
                        <span className="text-green-400">Completed ✓</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Credits Issued:</span>
                        <span className="text-white">{Math.floor(stats.totalCredits * 0.6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Credits Purchased:</span>
                        <span className="text-white">{Math.floor(stats.totalCredits * 0.3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Credits Retired:</span>
                        <span className="text-white">{Math.floor(stats.totalCredits * 0.1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Environmental Impact:</span>
                        <span className="text-green-400">High 🌟</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className={`p-3 rounded-xl ${getActivityColor(activity.type)} bg-current/20`}>
                        <span className="text-xl">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">
                          {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {activity.amount} credits • {activity.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
