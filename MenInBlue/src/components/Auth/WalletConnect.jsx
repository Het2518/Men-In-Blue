import React, { useState, useEffect } from 'react';
import { Wallet, AlertCircle, CheckCircle, ExternalLink, Loader, Zap } from 'lucide-react';

const WalletConnect = ({ onConnect, onDisconnect, className = '' }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(null);

  // Mock wallet providers
  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask wallet',
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isMetaMask
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect using WalletConnect protocol',
      isInstalled: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect using Coinbase Wallet',
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet
    },
    {
      id: 'injected',
      name: 'Injected Wallet',
      icon: '💼',
      description: 'Connect using browser wallet',
      isInstalled: typeof window !== 'undefined' && window.ethereum
    }
  ];

  // Check for existing connection on component mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const walletInfo = {
            address: accounts[0],
            provider: 'metamask',
            chainId: await window.ethereum.request({ method: 'eth_chainId' })
          };
          setConnectedWallet(walletInfo);
          if (onConnect) onConnect(walletInfo);
          fetchBalance(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const fetchBalance = async (address) => {
    try {
      if (window.ethereum) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        // Convert from wei to ETH (simplified)
        const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
        setBalance(ethBalance.toFixed(4));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0.0000');
    }
  };

  const connectWallet = async (provider) => {
    setIsConnecting(true);
    setError('');

    try {
      let walletInfo = null;

      switch (provider.id) {
        case 'metamask':
          if (!provider.isInstalled) {
            throw new Error('MetaMask is not installed. Please install MetaMask first.');
          }
          
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          
          const chainId = await window.ethereum.request({
            method: 'eth_chainId'
          });

          walletInfo = {
            address: accounts[0],
            provider: 'metamask',
            chainId: chainId,
            name: provider.name
          };
          
          await fetchBalance(accounts[0]);
          break;

        case 'walletconnect':
          // Mock WalletConnect connection
          await new Promise(resolve => setTimeout(resolve, 2000));
          walletInfo = {
            address: '0x1234567890abcdef1234567890abcdef12345678',
            provider: 'walletconnect',
            chainId: '0x1',
            name: provider.name
          };
          setBalance('1.2345');
          break;

        case 'coinbase':
          if (!provider.isInstalled) {
            throw new Error('Coinbase Wallet is not installed.');
          }
          // Mock Coinbase connection
          await new Promise(resolve => setTimeout(resolve, 1500));
          walletInfo = {
            address: '0xabcdef1234567890abcdef1234567890abcdef12',
            provider: 'coinbase',
            chainId: '0x1',
            name: provider.name
          };
          setBalance('0.5678');
          break;

        case 'injected':
          if (!provider.isInstalled) {
            throw new Error('No wallet detected in browser.');
          }
          // Mock injected wallet connection
          await new Promise(resolve => setTimeout(resolve, 1000));
          walletInfo = {
            address: '0x9876543210fedcba9876543210fedcba98765432',
            provider: 'injected',
            chainId: '0x1',
            name: provider.name
          };
          setBalance('2.1000');
          break;

        default:
          throw new Error('Unsupported wallet provider');
      }

      setConnectedWallet(walletInfo);
      if (onConnect) onConnect(walletInfo);

    } catch (error) {
      setError(error.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setConnectedWallet(null);
      setBalance(null);
      setError('');
      if (onDisconnect) onDisconnect();
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon',
      '0xa': 'Optimism'
    };
    return networks[chainId] || 'Unknown Network';
  };

  if (connectedWallet) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Connected Wallet</h3>
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Connected</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                W
              </div>
              <div>
                <p className="font-medium text-gray-900">{connectedWallet.name}</p>
                <p className="text-sm text-gray-500">{formatAddress(connectedWallet.address)}</p>
              </div>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Disconnect
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Balance</p>
              <p className="text-lg font-semibold text-blue-900">
                {balance ? `${balance} ETH` : 'Loading...'}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Network</p>
              <p className="text-sm font-semibold text-green-900">
                {getNetworkName(connectedWallet.chainId)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Ready for blockchain transactions
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 text-sm">
          Connect your wallet to interact with the blockchain and manage your green hydrogen credits
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {walletProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => connectWallet(provider)}
            disabled={isConnecting}
            className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
              provider.isInstalled
                ? 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{provider.icon}</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">{provider.name}</p>
                <p className="text-sm text-gray-500">{provider.description}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {!provider.isInstalled ? (
                <div className="flex items-center text-gray-400">
                  <span className="text-xs mr-2">Not installed</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              ) : isConnecting ? (
                <Loader className="w-5 h-5 text-green-600 animate-spin" />
              ) : (
                <div className="text-green-600">
                  <span className="text-sm font-medium">Connect</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By connecting your wallet, you agree to our{' '}
          <a href="/terms" className="text-green-600 hover:text-green-700">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
};

export default WalletConnect;