import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Notification from './components/common/Notification';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import Producer from './pages/Producer';
import Buyer from './pages/Buyer';
import Certifier from './pages/Certifier';
import Admin from './pages/Admin';

const App = () => {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-hydrogen-cyan to-hydrogen-dark">
          <Notification />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/producer" element={<Producer />} />
            <Route path="/buyer" element={<Buyer />} />
            <Route path="/certifier" element={<Certifier />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
};

export default App;
