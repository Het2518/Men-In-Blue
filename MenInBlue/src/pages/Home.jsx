import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

const HydroChainLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const particlesRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particle animation effect for hero
  useEffect(() => {
    const createParticle = () => {
      if (particlesRef.current) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: #00ff88;
          border-radius: 50%;
          opacity: 0.7;
          left: ${Math.random() * 100}%;
          animation: particle-float ${Math.random() * 3 + 5}s linear forwards;
        `;
        particlesRef.current.appendChild(particle);
        setTimeout(() => particle.remove(), 8000);
      }
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes particle-float {
          0% { transform: translateY(100vh) translateX(0); opacity: 1; }
          100% { transform: translateY(-100px) translateX(100px); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .floating { animation: float 6s ease-in-out infinite; }
        .fade-in { animation: fadeInUp 1s ease forwards; }
        .gradient-text {
          background: linear-gradient(45deg, #ffffff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glow-button {
          background: linear-gradient(45deg, #00ff88, #00d4ff);
          box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
          transition: all 0.3s ease;
        }
        .glow-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 255, 136, 0.5);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 255, 136, 0.2);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          border-color: #00ff88;
          box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2);
          transform: translateY(-10px);
        }
        @media (max-width: 768px) {
          .glass-card:hover {
            transform: translateY(-5px);
          }
          .glow-button:hover {
            transform: translateY(-1px);
          }
          .floating {
            animation-duration: 4s;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black bg-opacity-95 backdrop-blur-lg border-b border-green-500 border-opacity-20 shadow-lg' 
          : 'bg-black bg-opacity-90 backdrop-blur-lg border-b border-green-500 border-opacity-20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                H₂
              </div>
              <span className="text-xl sm:text-2xl font-bold gradient-text">
                HydroChain
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white hover:text-green-400 transition-colors font-medium relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#platform" className="text-white hover:text-green-400 transition-colors font-medium relative group">
                Platform
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#features" className="text-white hover:text-green-400 transition-colors font-medium relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#how-it-works" className="text-white hover:text-green-400 transition-colors font-medium relative group">
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="text-white hover:text-green-400 transition-colors font-medium relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            <div className="hidden md:block">
              <a href="#platform" className="glow-button text-black px-4 sm:px-6 py-2 rounded-full font-bold text-sm sm:text-base">
                Get Started
              </a>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-95 backdrop-blur-lg border-t border-green-500 border-opacity-20">
            <div className="px-4 py-4 space-y-3">
              <a href="#home" className="block text-white hover:text-green-400 py-2 transition-colors">Home</a>
              <a href="#platform" className="block text-white hover:text-green-400 py-2 transition-colors">Platform</a>
              <a href="#features" className="block text-white hover:text-green-400 py-2 transition-colors">Features</a>
              <a href="#how-it-works" className="block text-white hover:text-green-400 py-2 transition-colors">How It Works</a>
              <a href="#contact" className="block text-white hover:text-green-400 py-2 transition-colors">Contact</a>
              <a href="#platform" className="block glow-button text-black px-6 py-2 rounded-full font-bold text-center mt-4">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center relative bg-gradient-to-br from-green-900 from-opacity-10 to-cyan-900 to-opacity-10">
        <div 
          ref={particlesRef}
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 1 }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          <div className="fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 gradient-text leading-tight px-4 sm:px-0">
              Green Hydrogen Credit Trading Platform
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto opacity-90 leading-relaxed px-4 sm:px-6 lg:px-0">
              The world's most trusted blockchain-based platform for certifying, trading, and managing green hydrogen credits. 
              Transparent, secure, and efficient.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
              <a href="#platform" className="glow-button text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold flex items-center justify-center space-x-2 w-full sm:w-auto">
                <span>Access Platform</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#features" className="bg-transparent text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold border-2 border-green-500 hover:bg-green-500 hover:bg-opacity-10 transition-all duration-300 text-center w-full sm:w-auto">
                Learn More
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0">
              <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 mb-1 sm:mb-2">24/7</div>
                <div className="text-gray-300 text-xs sm:text-sm">Platform Availability</div>
              </div>
              <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 mb-1 sm:mb-2">100%</div>
                <div className="text-gray-300 text-xs sm:text-sm">Blockchain Security</div>
              </div>
              <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 mb-1 sm:mb-2">Real-time</div>
                <div className="text-gray-300 text-xs sm:text-sm">Credit Verification</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Access Section */}
      <section id="platform" className="py-16 sm:py-20 bg-black bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4 sm:mb-6 px-4 sm:px-0">
              Choose Your Access Level
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
              Select your role to access our comprehensive hydrogen credit management system
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: '🏭',
                title: 'Producer Portal',
                description: 'For hydrogen production companies and renewable energy facilities',
                features: ['Submit production certificates', 'Track credit generation', 'Monitor facility performance', 'Access production analytics', 'Manage credit inventory']
              },
              {
                icon: '🛒',
                title: 'Buyer Portal', 
                description: 'For companies purchasing green hydrogen credits for sustainability goals',
                features: ['Browse credit marketplace', 'Purchase verified credits', 'Retire credits for reporting', 'Track purchase history', 'Generate compliance reports']
              },
              {
                icon: '🔍',
                title: 'Certifier Portal',
                description: 'For certification bodies and third-party auditors',
                features: ['Review production certificates', 'Verify hydrogen credentials', 'Approve credit issuance', 'Conduct facility audits', 'Generate audit reports']
              },
              {
                icon: '⚙️',
                title: 'Admin Portal',
                description: 'For system administrators and regulatory oversight',
                features: ['System management', 'User administration', 'Monitor platform integrity', 'Generate system reports', 'Compliance oversight']
              }
            ].map((type, index) => (
              <div key={index} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden floating group" style={{animationDelay: `${index * 0.5}s`}}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                
                <div className="p-4 sm:p-6 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 mx-auto">
                    {type.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    {type.title}
                  </h3>
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                    {type.description}
                  </p>
                  
                  <ul className="text-left space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-xs sm:text-sm text-gray-300">
                        <span className="text-green-400 mr-2 mt-1 font-bold flex-shrink-0">✓</span>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full glow-button text-black py-2 sm:py-3 px-3 sm:px-4 rounded-full font-bold text-sm sm:text-base">
                    Login as {type.title.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-black bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4 sm:mb-6 px-4 sm:px-0">
              Platform Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
              Comprehensive tools for the entire green hydrogen credit lifecycle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '🔐', title: 'Blockchain Security', description: 'Immutable ledger technology ensures credit authenticity and prevents fraud or double-counting.' },
              { icon: '📊', title: 'Real-time Analytics', description: 'Live dashboards with comprehensive insights into production, trading, and market trends.' },
              { icon: '✅', title: 'Automated Verification', description: 'Smart contracts streamline the certification process with automated verification workflows.' },
              { icon: '🌐', title: 'Global Marketplace', description: 'Connect with buyers and sellers worldwide in our secure, transparent trading environment.' },
              { icon: '📱', title: 'Mobile Access', description: 'Access your account and manage credits on-the-go with our responsive web platform.' },
              { icon: '🛡️', title: 'Compliance Ready', description: 'Built-in reporting tools ensure compliance with international green energy standards.' }
            ].map((feature, index) => (
              <div key={index} className="glass-card p-6 sm:p-8 rounded-xl sm:rounded-2xl floating relative overflow-hidden group" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-400 rounded-lg flex items-center justify-center mb-4 sm:mb-6 text-xl sm:text-2xl">
                  {feature.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-gradient-to-br from-green-900 from-opacity-5 to-cyan-900 to-opacity-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4 sm:mb-6 px-4 sm:px-0">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
              Simple steps to participate in the green hydrogen credit ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '1', title: 'Register & Verify', description: 'Create your account and complete identity verification for your chosen role' },
              { number: '2', title: 'Submit Documentation', description: 'Upload production certificates, purchase orders, or audit credentials' },
              { number: '3', title: 'Blockchain Verification', description: 'Our smart contracts automatically verify and process your submissions' },
              { number: '4', title: 'Trade & Track', description: 'Buy, sell, or retire credits with full transparency and traceability' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-400 text-black rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mb-3 sm:mb-4 mx-auto">
                  {step.number}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 px-2 sm:px-0">
                  {step.title}
                </h4>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base px-2 sm:px-0">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-green-900 from-opacity-20 to-cyan-900 to-opacity-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4 sm:mb-6">
            Ready to Join the Green Hydrogen Revolution?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 opacity-90 leading-relaxed">
            Start trading verified green hydrogen credits today and contribute to a sustainable future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <a href="#platform" className="glow-button text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold w-full sm:w-auto">
              Get Started Now
            </a>
            <a href="#contact" className="glow-button text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold w-full sm:w-auto">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 sm:py-16 bg-black bg-opacity-95 border-t border-green-500 border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <h4 className="text-green-400 font-bold mb-3 sm:mb-4 text-base sm:text-lg">HydroChain</h4>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base px-4 sm:px-0">
                Leading the future of green hydrogen credit trading with blockchain technology.
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="text-green-400 font-bold mb-3 sm:mb-4 text-base sm:text-lg">Platform</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="/producer" className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base">Producer Portal</a></li>
                <li><a href="/buyer" className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base">Buyer Portal</a></li>
                <li><a href="/certifier" className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base">Certifier Portal</a></li>
                <li><a href="/admin" className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base">Admin Portal</a></li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="text-green-400 font-bold mb-3 sm:mb-4 text-base sm:text-lg">Support</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="/docs" className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base">Documentation</a></li>
                <li><a href="/help" className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base">Help Center</a></li>
                <li><a href="/api" className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base">API Reference</a></li>
                <li><a href="/status" className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base">System Status</a></li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="text-green-400 font-bold mb-3 sm:mb-4 text-base sm:text-lg">Contact</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-300">
                <li className="text-sm sm:text-base">support@hydrochain.com</li>
                <li className="text-sm sm:text-base">+1 (555) 123-4567</li>
                <li className="text-sm sm:text-base">San Francisco, CA</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base px-4 sm:px-0">© 2025 HydroChain. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HydroChainLanding;