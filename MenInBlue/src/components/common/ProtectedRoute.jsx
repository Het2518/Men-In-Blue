import React from 'react';
import { AlertCircle, Lock, ArrowLeft } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermissions = [], 
  fallback = null 
}) => {
  // Get user data from localStorage (in real app, you'd use AuthContext)
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  const hasRequiredRole = (user, role) => {
    if (!role) return true; // No role requirement
    return user && user.role === role;
  };

  const hasRequiredPermissions = (user, permissions) => {
    if (!permissions || permissions.length === 0) return true;
    if (!user) return false;

    const rolePermissions = {
      admin: [
        'user_management',
        'system_administration',
        'view_all_credits',
        'audit_access',
        'platform_settings'
      ],
      producer: [
        'create_credits',
        'view_own_credits',
        'production_management',
        'facility_management'
      ],
      buyer: [
        'purchase_credits',
        'retire_credits',
        'marketplace_access',
        'compliance_reporting'
      ],
      certifier: [
        'verify_credits',
        'audit_production',
        'certification_management',
        'compliance_verification'
      ]
    };

    const userPermissions = rolePermissions[user.role] || [];
    return permissions.every(permission => userPermissions.includes(permission));
  };

  // Check authentication
  if (!isAuthenticated()) {
    return fallback || <LoginRequired />;
  }

  const user = getCurrentUser();
  
  // Check role requirement
  if (!hasRequiredRole(user, requiredRole)) {
    return fallback || <AccessDenied requiredRole={requiredRole} userRole={user?.role} />;
  }

  // Check permissions
  if (!hasRequiredPermissions(user, requiredPermissions)) {
    return fallback || <InsufficientPermissions requiredPermissions={requiredPermissions} />;
  }

  // All checks passed, render children
  return children;
};

// Login Required Component
const LoginRequired = () => {
  const handleLogin = () => {
    // In real app, you'd use React Router
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to access this page.
        </p>
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Access Denied Component
const AccessDenied = ({ requiredRole, userRole }) => {
  const roleLabels = {
    admin: 'Administrator',
    producer: 'Producer',
    buyer: 'Buyer',
    certifier: 'Certifier'
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    // Redirect based on user role
    const roleRoutes = {
      admin: '/dashboard/admin',
      producer: '/dashboard/producer',
      buyer: '/dashboard/buyer',
      certifier: '/dashboard/certifier'
    };
    
    window.location.href = roleRoutes[userRole] || '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          This page requires <strong>{roleLabels[requiredRole]}</strong> access level.
          {userRole && (
            <>
              <br />
              Your current role: <strong>{roleLabels[userRole]}</strong>
            </>
          )}
        </p>
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={handleGoBack}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Insufficient Permissions Component
const InsufficientPermissions = ({ requiredPermissions }) => {
  const handleGoBack = () => {
    window.history.back();
  };

  const formatPermission = (permission) => {
    return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Permissions</h2>
        <p className="text-gray-600 mb-4">
          You don't have the required permissions to access this page.
        </p>
        {requiredPermissions.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Required permissions:</p>
            <ul className="text-sm bg-gray-50 rounded-lg p-3">
              {requiredPermissions.map((permission, index) => (
                <li key={index} className="text-gray-700">
                  • {formatPermission(permission)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <p className="text-xs text-gray-500">
            Contact your administrator if you believe you should have access to this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;