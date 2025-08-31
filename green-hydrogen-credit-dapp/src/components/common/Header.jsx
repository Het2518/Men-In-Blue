import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Web3Context } from '../../contexts/Web3Context';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

const Header = () => {
  const { isDevelopmentMode, toggleMode } = useContext(Web3Context);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(isAuthenticated ? '/dashboard' : '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', show: isAuthenticated },
    { path: '/producer', label: 'Producer', show: isAuthenticated && (user?.role === 'producer' || user?.role === 'admin') },
    { path: '/buyer', label: 'Buyer', show: isAuthenticated && (user?.role === 'buyer' || user?.role === 'admin') },
    { path: '/certifier', label: 'Certifier', show: isAuthenticated && (user?.role === 'certifier' || user?.role === 'admin') },
    { path: '/admin', label: 'Admin', show: isAuthenticated && user?.role === 'admin' },
    { path: '/profile', label: 'Profile', show: isAuthenticated }
  ];

  return (
    <header className="bg-hydrogen-dark/90 backdrop-blur-sm py-4 px-6 flex justify-between items-center shadow-neon sticky top-0 z-50">
      <div
        className="text-2xl font-bold text-hydrogen-cyan cursor-pointer hover:text-white transition-colors duration-300"
        onClick={handleLogoClick}
      >
        HydraChain
        {isDevelopmentMode && (
          <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
            DEV MODE
          </span>
        )}
      </div>

      {/* Navigation Menu */}
      {isAuthenticated && (
        <nav className="hidden md:flex space-x-6">
          {navItems.map(({ path, label, show }) =>
            show && (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${location.pathname === path || location.pathname.startsWith(path + '/')
                  ? 'bg-hydrogen-cyan text-hydrogen-dark font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-hydrogen-dark/50'
                  }`}
              >
                {label}
              </Link>
            )
          )}
        </nav>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Development Mode Toggle */}
        <button
          onClick={toggleMode}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDevelopmentMode
            ? 'bg-yellow-500 text-black hover:bg-yellow-600'
            : 'bg-hydrogen-cyan text-white hover:bg-hydrogen-blue'
            }`}
          title={isDevelopmentMode ? 'Switch to Production Mode' : 'Switch to Development Mode'}
        >
          {isDevelopmentMode ? '🚧 DEV' : '🌐 PROD'}
        </button>

        {/* Authentication Controls */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <div className="text-white text-sm font-medium">{user?.name}</div>
              <div className="text-gray-400 text-xs capitalize">{user?.role}</div>
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-hydrogen-cyan rounded-full flex items-center justify-center text-hydrogen-dark font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/20"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
