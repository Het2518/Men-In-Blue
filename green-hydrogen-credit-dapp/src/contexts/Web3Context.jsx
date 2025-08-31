<<<<<<< HEAD
import React, { createContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
=======
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import Web3 from 'web3';
import { initContract, checkRoles } from '../utils/contract';
import { metaMaskService, formatAddress, formatBalance } from '../utils/metamask';
>>>>>>> 5b834002a9c5d121a16d25f025ea419228980fbc
import { toast } from 'react-toastify';

const Web3Context = createContext();

<<<<<<< HEAD
export const useWeb3 = () => useContext(Web3Context);
=======
// Development mode flag - read from environment
const DEVELOPMENT_MODE = import.meta.env.VITE_DEVELOPMENT_MODE === 'true' ||
  import.meta.env.DEV ||
  import.meta.env.MODE === 'development';

// Mock data for development
const MOCK_DATA = {
  account: '0x742d35Cc5aF7482C6d2a5d5B0E8eE73c7D8a0Cd1',
  roles: { isProducer: true, isBuyer: true, isCertifier: true, isAdmin: true },
  balance: '1250.5678',
  tokenId: '1',
  networkId: '1',
  networkName: 'Ethereum Mainnet (Mock)'
};
>>>>>>> 5b834002a9c5d121a16d25f025ea419228980fbc

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
<<<<<<< HEAD

  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has disconnected.
      toast.info('Wallet disconnected.');
      setAccount(null);
      setWeb3(null);
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      toast.info(`Account changed to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
    }
  }, [account]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Clean up the event listener when the component unmounts
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [handleAccountsChanged]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to use this application.');
      return null;
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const userAccount = accounts[0];
        setAccount(userAccount);
        
        toast.success(`Wallet connected: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`);
        return userAccount;
      }
      return null;
    } catch (error) {
      if (error.code === 4001) {
        toast.warn('You rejected the connection request.');
=======
  const [contract, setContract] = useState(null);
  const [roles, setRoles] = useState({
    isProducer: false,
    isBuyer: false,
    isCertifier: false,
    isAdmin: false
  });
  const [balance, setBalance] = useState('0');
  const [networkId, setNetworkId] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(DEVELOPMENT_MODE);

  // Development mode initialization
  const initDevelopmentMode = useCallback(() => {
    console.log('🚀 Initializing Development Mode');
    setAccount(MOCK_DATA.account);
    setRoles(MOCK_DATA.roles);
    setBalance(MOCK_DATA.balance);
    setNetworkId(MOCK_DATA.networkId);
    setNetworkName(MOCK_DATA.networkName);
    setWeb3({ mockWeb3: true }); // Mock web3 object
    setIsConnected(true);

    toast.success(
      <div>
        <strong>🚀 Development Mode Active</strong>
        <br />
        Connected as: {formatAddress(MOCK_DATA.account)}
        <br />
        Balance: {formatBalance(MOCK_DATA.balance)} ETH
      </div>
    );
  }, []);

  // Production mode initialization
  const initProductionMode = useCallback(async () => {
    console.log('🔧 Initializing Production Mode');

    setIsConnecting(true);

    try {
      // Check if MetaMask is installed
      if (!metaMaskService.isMetaMaskInstalled()) {
        metaMaskService.showInstallPrompt();
        setIsConnecting(false);
        return;
      }

      // Initialize Web3
      const initResult = await metaMaskService.initialize();
      if (!initResult.success) {
        throw new Error(initResult.error);
      }

      // Get existing accounts without requesting permission
      const accountsResult = await metaMaskService.getAccounts();

      if (accountsResult.success && accountsResult.accounts.length > 0) {
        // User is already connected, check connection without requesting permission
        console.log('Existing MetaMask connection found');
        toast.info('MetaMask wallet detected. Click "Connect Wallet" to continue.');
      } else {
        // User needs to connect
        console.log('MetaMask ready, waiting for user to connect...');
        toast.info(
          <div>
            <strong>MetaMask Ready!</strong>
            <br />
            Click "Connect Wallet" to continue
          </div>
        );
      }
    } catch (error) {
      console.error('Production mode initialization failed:', error);
      toast.error(`Failed to initialize: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Connect to MetaMask
  const connectToMetaMaskInternal = useCallback(async (requestPermission = true) => {
    console.log('🔧 Starting MetaMask connection process...');
    setIsConnecting(true);

    try {
      let connectionResult;

      if (requestPermission) {
        // Request new connection
        connectionResult = await metaMaskService.connect();
      } else {
        // Check existing connection
        const accountsResult = await metaMaskService.getAccounts();
        if (accountsResult.success && accountsResult.accounts.length > 0) {
          const balanceResult = await metaMaskService.getBalance(accountsResult.accounts[0]);
          connectionResult = {
            success: true,
            account: accountsResult.accounts[0],
            accounts: accountsResult.accounts,
            balance: balanceResult.success ? balanceResult.balance : '0'
          };
        } else {
          connectionResult = { success: false, error: 'No accounts found' };
        }
      }

      if (!connectionResult.success) {
        throw new Error(connectionResult.error);
      }

      if (connectionResult.isDevelopment) {
        // Handle development mode
        initDevelopmentMode();
        return;
      }

      // Set account info
      setAccount(connectionResult.account);
      setBalance(connectionResult.balance || '0');
      setNetworkId(connectionResult.networkId);
      setNetworkName(metaMaskService.getNetworkName(connectionResult.networkId));
      setIsConnected(true);

      // Initialize Web3 and contract
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      try {
        const contractInstance = await initContract(web3Instance);
        setContract(contractInstance);

        if (contractInstance.isDemo) {
          toast.info(
            `🧪 Demo Mode: Using mock contract functionality.
            ${contractInstance.error ? 'Reason: ' + contractInstance.error : 'Contract not deployed at specified address.'}`
          );
        }

        // Check user roles
        const userRoles = await checkRoles(web3Instance, connectionResult.account);
        setRoles(userRoles);

        // Set up contract event listeners only for real contracts
        if (contractInstance && !contractInstance.isDemo) {
          contractInstance.events.CreditIssued().on('data', (event) => {
            toast.success(
              `🎉 Credit Issued: ${event.returnValues.amount} credits to ${formatAddress(event.returnValues.producer)}`
            );
          });

          contractInstance.events.CreditTransferred().on('data', (event) => {
            toast.info(
              `🔄 Transfer: ${event.returnValues.amount} credits from ${formatAddress(event.returnValues.from)} to ${formatAddress(event.returnValues.to)}`
            );
          });

          contractInstance.events.CreditRetired().on('data', (event) => {
            toast.warning(
              `♻️ Retired: ${event.returnValues.amount} credits by ${formatAddress(event.returnValues.holder)}`
            );
          });
        }
      } catch (contractError) {
        console.error('Contract initialization failed:', contractError);
        toast.warning('Connected to MetaMask, but contract not available. Using demo mode.');

        // Set demo roles
        setRoles({
          isProducer: true,
          isBuyer: true,
          isCertifier: true,
          isAdmin: true
        });
      }      // Success toast
      toast.success(
        <div>
          <strong>✅ Connected to MetaMask!</strong>
          <br />
          Account: {formatAddress(connectionResult.account)}
          <br />
          Network: {metaMaskService.getNetworkName(connectionResult.networkId)}
          <br />
          Balance: {formatBalance(connectionResult.balance)} ETH
        </div>
      );

    } catch (error) {
      console.error('MetaMask connection failed:', error);
      setIsConnected(false);

      if (error.message !== 'Connection rejected by user') {
        toast.error(`Connection failed: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [initDevelopmentMode]);

  // Connect to MetaMask (public method)
  const connectToMetaMask = useCallback(async () => {
    console.log('🦊 Connect button clicked!');
    console.log('MetaMask installed:', metaMaskService.isMetaMaskInstalled());
    console.log('Development mode:', isDevelopmentMode);

    if (!metaMaskService.isMetaMaskInstalled()) {
      console.warn('MetaMask not installed');
      metaMaskService.showInstallPrompt();
      return;
    }

    return connectToMetaMaskInternal(true);
  }, [connectToMetaMaskInternal, isDevelopmentMode]);

  // Disconnect from MetaMask
  const disconnectWallet = useCallback(() => {
    metaMaskService.disconnect();
    setWeb3(null);
    setAccount(null);
    setContract(null);
    setRoles({ isProducer: false, isBuyer: false, isCertifier: false, isAdmin: false });
    setBalance('0');
    setNetworkId(null);
    setNetworkName('');
    setIsConnected(false);
  }, []);

  // Switch between development and production mode
  const toggleMode = useCallback(() => {
    const newMode = !isDevelopmentMode;
    setIsDevelopmentMode(newMode);

    // Reset all state
    disconnectWallet();

    toast.info(`Switched to ${newMode ? 'Development' : 'Production'} mode`);

    // Reinitialize with new mode
    setTimeout(() => {
      if (newMode) {
        initDevelopmentMode();
      } else {
        initProductionMode();
      }
    }, 100);
  }, [isDevelopmentMode, disconnectWallet, initDevelopmentMode, initProductionMode]);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      if (isDevelopmentMode) {
        initDevelopmentMode();
>>>>>>> 5b834002a9c5d121a16d25f025ea419228980fbc
      } else {
        toast.error('Failed to connect wallet.');
        console.error('Error connecting wallet:', error);
      }
<<<<<<< HEAD
      return null;
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setAccount(null);
    setWeb3(null);
    toast.info("You have been disconnected from the app. You can disconnect from MetaMask through its interface.");
  }, []);

=======
    };

    init();
  }, [isDevelopmentMode, initDevelopmentMode, initProductionMode]); // Run when dependencies change

  // Set up MetaMask event listeners
  useEffect(() => {
    if (!isDevelopmentMode && metaMaskService.isMetaMaskInstalled()) {
      // Account changes
      metaMaskService.onAccountsChanged((accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          // Refresh balance and roles
          metaMaskService.getBalance(accounts[0]).then(result => {
            if (result.success) {
              setBalance(result.balance);
            }
          });

          if (web3) {
            checkRoles(web3, accounts[0]).then(setRoles);
          }
        }
      });

      // Network changes
      metaMaskService.onChainChanged((chainId) => {
        const newNetworkId = parseInt(chainId, 16).toString();
        setNetworkId(newNetworkId);
        setNetworkName(metaMaskService.getNetworkName(newNetworkId));
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [isDevelopmentMode, account, web3, disconnectWallet]);

  // Refresh connection data
  const refreshConnection = useCallback(async () => {
    if (!isConnected || !account) return;

    try {
      if (isDevelopmentMode) {
        // Refresh mock data
        setBalance(MOCK_DATA.balance);
        return;
      }

      // Refresh real data
      const balanceResult = await metaMaskService.getBalance(account);
      if (balanceResult.success) {
        setBalance(balanceResult.balance);
      }

      if (web3) {
        const userRoles = await checkRoles(web3, account);
        setRoles(userRoles);
      }
    } catch (error) {
      console.error('Failed to refresh connection:', error);
    }
  }, [isConnected, account, isDevelopmentMode, web3]);
>>>>>>> 5b834002a9c5d121a16d25f025ea419228980fbc

  const value = {
    // Connection state
    web3,
    account,
<<<<<<< HEAD
    connectWallet,
    disconnectWallet,
=======
    contract,
    isConnected,
    isConnecting,
    isDevelopmentMode,

    // Account info
    balance,
    formattedBalance: formatBalance(balance),
    formattedAccount: formatAddress(account),
    networkId,
    networkName,
    roles,

    // Actions
    connectToMetaMask,
    connectWallet: connectToMetaMask,
    disconnectWallet,
    toggleMode,
    refreshConnection,

    // Utilities
    metaMaskService,
    formatAddress,
    formatBalance,

    // Mock data for development
    mockData: MOCK_DATA
>>>>>>> 5b834002a9c5d121a16d25f025ea419228980fbc
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
<<<<<<< HEAD
=======

// Custom hook to use Web3Context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export { Web3Context };
>>>>>>> 5b834002a9c5d121a16d25f025ea419228980fbc
