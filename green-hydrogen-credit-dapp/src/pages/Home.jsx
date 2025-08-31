import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import logo from '../assets/images/green-hydrogen.svg';

const Home = () => {
  const { isDevelopmentMode } = useContext(Web3Context);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Automatically redirect to dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="particles absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="particle absolute animate-float" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`
          }}></div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={logo}
            alt="Green Hydrogen"
            className="w-32 h-32 mx-auto animate-float filter drop-shadow-lg"
          />
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-hydrogen-cyan to-hydrogen-blue bg-clip-text text-transparent">
          HydraChain
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
          Trade and manage green hydrogen credits on the blockchain with a secure,
          transparent, and eco-friendly platform powered by Web3 technology.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link to="/login">
            <Button size="lg" className="min-w-[200px]">
              Get Started
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Development Mode Info */}
        {isDevelopmentMode && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mb-12 max-w-2xl mx-auto">
            <h3 className="text-yellow-300 font-semibold mb-3">🚧 Development Mode Active</h3>
            <p className="text-yellow-300 text-sm mb-4">
              You can test the app with demo accounts! No MetaMask required.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-yellow-600/30 p-2 rounded">
                <div className="font-semibold">Producer</div>
                <div className="text-yellow-200">producer@hydrachain.com</div>
              </div>
              <div className="bg-blue-600/30 p-2 rounded">
                <div className="font-semibold">Buyer</div>
                <div className="text-blue-200">buyer@hydrachain.com</div>
              </div>
              <div className="bg-purple-600/30 p-2 rounded">
                <div className="font-semibold">Certifier</div>
                <div className="text-purple-200">certifier@hydrachain.com</div>
              </div>
              <div className="bg-red-600/30 p-2 rounded">
                <div className="font-semibold">Admin</div>
                <div className="text-red-200">admin@hydrachain.com</div>
              </div>
            </div>
            <p className="text-yellow-200 text-xs mt-3">
              Password for all demo accounts: <code className="bg-yellow-600/30 px-1 rounded">password123</code> (admin123 for admin)
            </p>
          </div>
        )}

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-hydrogen-dark/50 backdrop-blur-sm p-6 rounded-xl border border-hydrogen-cyan/20 hover:border-hydrogen-cyan/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-hydrogen-cyan mb-3">🌱 Eco-Friendly</h3>
            <p className="text-gray-300">Support sustainable energy through blockchain-verified green hydrogen credits.</p>
          </div>
          <div className="bg-hydrogen-dark/50 backdrop-blur-sm p-6 rounded-xl border border-hydrogen-cyan/20 hover:border-hydrogen-cyan/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-hydrogen-cyan mb-3">🔒 Secure</h3>
            <p className="text-gray-300">Built on blockchain technology ensuring transparency and immutable records.</p>
          </div>
          <div className="bg-hydrogen-dark/50 backdrop-blur-sm p-6 rounded-xl border border-hydrogen-cyan/20 hover:border-hydrogen-cyan/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-hydrogen-cyan mb-3">⚡ Fast Trading</h3>
            <p className="text-gray-300">Instant credit transfers and real-time market data for efficient trading.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
