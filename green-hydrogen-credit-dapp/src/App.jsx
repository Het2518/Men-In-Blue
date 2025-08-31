import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/common/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';
import Producer from './pages/Producer';
import Buyer from './pages/Buyer';
import Certifier from './pages/Certifier';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <Web3Provider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-hydrogen-dark via-slate-900 to-hydrogen-dark">
            <Header />

            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/producer"
                  element={
                    <ProtectedRoute requiredRole="producer">
                      <Producer />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/buyer"
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <Buyer />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/certifier"
                  element={
                    <ProtectedRoute requiredRole="certifier">
                      <Certifier />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* Profile routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:tab"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Toast notifications */}
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              style={{
                '--toastify-color-dark': '#1a1a2e',
                '--toastify-color-success': '#00e5c3',
                '--toastify-color-error': '#ff6b6b',
                '--toastify-color-warning': '#ffd93d',
                '--toastify-color-info': '#74b9ff'
              }}
            />
          </div>
        </Router>
      </Web3Provider>
    </AuthProvider>
  );
};

export default App;
