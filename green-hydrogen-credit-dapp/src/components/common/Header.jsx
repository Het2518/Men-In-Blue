import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import Button from './Button';

const Header = () => {
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(isSignedIn ? '/dashboard' : '/');
  };

  // Get user role from Clerk metadata
  const userRole = user?.publicMetadata?.role || 'buyer';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', show: isSignedIn },
    { path: '/producer', label: 'Producer', show: isSignedIn && (userRole === 'producer' || userRole === 'admin') },
    { path: '/buyer', label: 'Buyer', show: isSignedIn && (userRole === 'buyer' || userRole === 'admin') },
    { path: '/certifier', label: 'Certifier', show: isSignedIn && (userRole === 'certifier' || userRole === 'admin') },
    { path: '/admin', label: 'Admin', show: isSignedIn && userRole === 'admin' },
    { path: '/profile', label: 'Profile', show: isSignedIn }
  ];

  return (
    <header className="bg-hydrogen-dark/90 backdrop-blur-sm py-4 px-6 flex justify-between items-center shadow-neon sticky top-0 z-50">
      <div
        className="text-2xl font-bold text-hydrogen-cyan cursor-pointer hover:text-white transition-colors duration-300"
        onClick={handleLogoClick}
      >
        HydraChain
      </div>

      {/* Navigation Menu */}
      <SignedIn>
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
      </SignedIn>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Authentication Controls */}
        <SignedIn>
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <div className="text-white text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-gray-400 text-xs capitalize">{userRole}</div>
            </div>

            {/* Clerk User Button - handles profile and logout */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "bg-gray-800 border border-gray-600",
                  userButtonPopoverText: "text-white",
                  userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700",
                  userButtonPopoverFooter: "hidden"
                }
              }}
            />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center space-x-2">
            <Link to="/sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
