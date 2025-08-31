import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import ProfileDashboard from '../components/Profile/ProfileDashboard';
import ProfileSettings from '../components/Profile/ProfileSettings';
import ProfileAnalytics from '../components/Profile/ProfileAnalytics';
import ProfileTransactions from '../components/Profile/ProfileTransactions';
import ProfilePortfolio from '../components/Profile/ProfilePortfolio';
import Button from '../components/common/Button';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  // Get user role from Clerk metadata
  const userRole = user?.publicMetadata?.role || 'buyer';

  // Get active tab from URL or default to dashboard
  const getActiveTab = () => {
    const path = location.pathname.split('/').pop();
    const validTabs = ['dashboard', 'portfolio', 'transactions', 'analytics', 'settings'];
    return validTabs.includes(path) ? path : 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      component: ProfileDashboard,
      description: 'Overview and quick stats'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: '💼',
      component: ProfilePortfolio,
      description: 'Investment holdings and performance'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: '📋',
      component: ProfileTransactions,
      description: 'Transaction history and details'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      component: ProfileAnalytics,
      description: 'Performance metrics and insights'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      component: ProfileSettings,
      description: 'Account settings and preferences'
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/profile/${tabId}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  }; const getRoleColor = (role) => {
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

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component || ProfileDashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Profile Header - Fixed */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleColor(userRole)} flex items-center justify-center text-2xl shadow-xl border-2 border-white/20`}>
                {getRoleIcon(userRole)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.fullName || user?.firstName || 'Anonymous User'}</h1>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 bg-gradient-to-r ${getRoleColor(userRole)} text-white rounded-full text-sm font-medium shadow-lg`}>
                    {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                  </span>
                  <span className="text-gray-400 text-sm">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'text-blue-400 border-blue-400 bg-blue-500/10'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-500 hidden lg:block">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Indicator */}
      <div className="bg-gray-800/30 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Profile</span>
            <span className="text-gray-600">›</span>
            <span className="text-blue-400 font-medium">{activeTabData?.label}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <ActiveComponent />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900/50 backdrop-blur-lg border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Profile Center</h3>
              <p className="text-gray-400 text-sm">
                Manage your green energy credits, track investments, and monitor your environmental impact.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {tabs.slice(0, 3).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className="block text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Type:</span>
                  <span className="text-white capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Verification:</span>
                  <span className="text-green-400">Verified ✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Green Hydrogen Credit DApp. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
