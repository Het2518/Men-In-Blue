import React from 'react';
import { Leaf, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-hydrogen" />
              <span className="text-xl font-bold">
                GreenH<sub>2</sub> Credits
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Building a transparent, blockchain-based system for tracking and trading
              green hydrogen credits. Accelerating the clean energy transition.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="/marketplace" className="text-gray-400 hover:text-white">Marketplace</a></li>
              <li><a href="/docs" className="text-gray-400 hover:text-white">Documentation</a></li>
              <li><a href="/support" className="text-gray-400 hover:text-white">Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="/compliance" className="text-gray-400 hover:text-white">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-gray-800">
          <p className="text-gray-400 text-center">
            © 2025 GreenH<sub>2</sub> Credits. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
