import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../components/WalletConnect';
import logo from '../assets/images/green-hydrogen.svg';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <img src={logo} alt="Green Hydrogen" className="w-32 h-32 mb-8 animate-float" />
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center animate-pulse">
        HydraChain DApp
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 text-center max-w-2xl">
        Trade and manage green hydrogen credits on the blockchain with a secure, transparent, and eco-friendly platform.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/dashboard" className="bg-hydrogen-cyan text-white px-6 py-3 rounded-lg hover:bg-hydrogen-blue transition-all duration-300 animate-float">
          Go to Dashboard
        </Link>
        <WalletConnect />
      </div>
    </div>
  );
};

export default Home;
