import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/common/Header';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import Producer from './pages/Producer';
import Buyer from './pages/Buyer';
import Certifier from './pages/Certifier';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-hydrogen-dark via-slate-900 to-hydrogen-dark">
          <Header />

          <main>
            <Routes>
              {/* Public route - Home page accessible to everyone */}
              <Route path="/" element={<Home />} />

              {/* Protected routes - require authentication */}
              <Route
                path="/dashboard"
                element={
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                }
              />

              <Route
                path="/producer"
                element={
                  <SignedIn>
                    <Producer />
                  </SignedIn>
                }
              />

              <Route
                path="/buyer"
                element={
                  <SignedIn>
                    <Buyer />
                  </SignedIn>
                }
              />

              <Route
                path="/certifier"
                element={
                  <SignedIn>
                    <Certifier />
                  </SignedIn>
                }
              />

              <Route
                path="/admin"
                element={
                  <SignedIn>
                    <Admin />
                  </SignedIn>
                }
              />

              {/* Profile routes */}
              <Route
                path="/profile"
                element={
                  <SignedIn>
                    <Profile />
                  </SignedIn>
                }
              />
              <Route
                path="/profile/:tab"
                element={
                  <SignedIn>
                    <Profile />
                  </SignedIn>
                }
              />

              {/* Catch all route - redirect to sign in if not authenticated */}
              <Route
                path="*"
                element={
                  <>
                    <SignedIn>
                      <Home />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
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
  );
};

export default App;
