import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific role required, check if user has it
  if (requiredRole && user) {
    const hasRole = user.role === requiredRole || user.role === 'admin';
    if (!hasRole) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center bg-hydrogen-dark/80 backdrop-blur-sm rounded-2xl border border-red-500/30 p-8 max-w-md">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-300 mb-6">
              You don't have the required role ({requiredRole}) to access this page.
              <br />
              <span className="text-sm text-gray-400 mt-2 block">
                Current role: {user.role}
              </span>
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-hydrogen-cyan text-white px-6 py-3 rounded-lg hover:bg-hydrogen-blue transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
