import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
// import { WalletProvider } from './context/WalletContext';
// import { ContractProvider } from './context/ContractContext';
// import { ThemeProvider } from './context/ThemeContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Marketplace from './pages/Marketplace';
// import Credits from './pages/Credits';
// import Profile from './pages/Profile';
// import Analytics from './pages/Analytics';
// import NotFound from './pages/NotFound';

// Protected Route Component
// import ProtectedRoute from './components/auth/ProtectedRoute';

// Styles
// import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <ContractProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />



                <Footer />

                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      iconTheme: {
                        primary: '#00d4aa',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </ContractProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
