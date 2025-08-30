import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Settings,
  Users,
  Shield,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const getNavigationByRole = (role) => {
    const common = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const roleSpecific = {
      producer: [
        { name: 'My Credits', href: '/credits', icon: CreditCard },
        { name: 'Production', href: '/production', icon: FileText },
      ],
      certifier: [
        { name: 'Certifications', href: '/certifications', icon: Shield },
        { name: 'Audit Reports', href: '/audit-reports', icon: FileText },
      ],
      buyer: [
        { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
        { name: 'My Credits', href: '/credits', icon: CreditCard },
      ],
      admin: [
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'System', href: '/admin/system', icon: Settings },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
      ]
    };

    return [...common, ...(roleSpecific[role] || [])];
  };

  const navigation = getNavigationByRole(user?.role);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-hydrogen text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-hydrogen rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
