import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import Web3 from 'web3';
import { initContract, checkRoles } from '../utils/contract';
import { metaMaskService, formatAddress, formatBalance } from '../utils/metamask';
import { toast } from 'react-toastify';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const { user, isSignedIn } = useUser();

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
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

  // Get user roles based on Clerk user metadata
  const getUserRoles = useCallback(() => {
    if (!user) return { isProducer: false, isBuyer: false, isCertifier: false, isAdmin: false };

    const userRole = user.publicMetadata?.role || 'buyer'; // Default to buyer

    return {
      isProducer: userRole === 'producer' || userRole === 'admin',
      isBuyer: userRole === 'buyer' || userRole === 'admin',
      isCertifier: userRole === 'certifier' || userRole === 'admin',
      isAdmin: userRole === 'admin'
    };
  }, [user]);

  // Connect to MetaMask
  const connectToMetaMask = useCallback(async () => {
    if (!isSignedIn) {
      toast.error('Please sign in first to connect your wallet');
      return;
    }

    console.log('🦊 Connecting to MetaMask for user:', user.emailAddresses[0]?.emailAddress);
    setIsConnecting(true);

    try {
      // Check if MetaMask is installed
      if (!metaMaskService.isMetaMaskInstalled()) {
        metaMaskService.showInstallPrompt();
        setIsConnecting(false);
        return;
      }

      // Connect to MetaMask
      const connectionResult = await metaMaskService.connect();

      if (!connectionResult.success) {
        throw new Error(connectionResult.error);
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
            `🧪 Demo Mode: Using mock contract functionality. ${contractInstance.error ? 'Reason: ' + contractInstance.error : 'Contract not deployed at specified address.'}`
          );
        }

        // Check user roles from contract
        const contractRoles = await checkRoles(web3Instance, connectionResult.account);

        // Combine Clerk roles with contract roles
        const clerkRoles = getUserRoles();
        setRoles({
          isProducer: clerkRoles.isProducer || contractRoles.isProducer,
          isBuyer: clerkRoles.isBuyer || contractRoles.isBuyer,
          isCertifier: clerkRoles.isCertifier || contractRoles.isCertifier,
          isAdmin: clerkRoles.isAdmin || contractRoles.isAdmin
        });

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

        // Set roles based on Clerk user data
        setRoles(getUserRoles());
      }

      // Success toast
      toast.success(
        <div>
          <strong>✅ Connected to MetaMask!</strong>
          <br />
          User: {user.firstName} {user.lastName}
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
  }, [isSignedIn, user, getUserRoles]);

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

    toast.info('Wallet disconnected');
  }, []);

  // Auto-disconnect wallet when user signs out
  useEffect(() => {
    if (!isSignedIn && isConnected) {
      disconnectWallet();
    }
  }, [isSignedIn, isConnected, disconnectWallet]);

  // Set up MetaMask event listeners
  useEffect(() => {
    if (isConnected && metaMaskService.isMetaMaskInstalled()) {
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
            checkRoles(web3, accounts[0]).then(contractRoles => {
              const clerkRoles = getUserRoles();
              setRoles({
                isProducer: clerkRoles.isProducer || contractRoles.isProducer,
                isBuyer: clerkRoles.isBuyer || contractRoles.isBuyer,
                isCertifier: clerkRoles.isCertifier || contractRoles.isCertifier,
                isAdmin: clerkRoles.isAdmin || contractRoles.isAdmin
              });
            });
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
  }, [isConnected, account, web3, disconnectWallet, getUserRoles]);

  // Refresh connection data
  const refreshConnection = useCallback(async () => {
    if (!isConnected || !account || !isSignedIn) return;

    try {
      // Refresh balance
      const balanceResult = await metaMaskService.getBalance(account);
      if (balanceResult.success) {
        setBalance(balanceResult.balance);
      }

      if (web3) {
        const contractRoles = await checkRoles(web3, account);
        const clerkRoles = getUserRoles();
        setRoles({
          isProducer: clerkRoles.isProducer || contractRoles.isProducer,
          isBuyer: clerkRoles.isBuyer || contractRoles.isBuyer,
          isCertifier: clerkRoles.isCertifier || contractRoles.isCertifier,
          isAdmin: clerkRoles.isAdmin || contractRoles.isAdmin
        });
      }
    } catch (error) {
      console.error('Failed to refresh connection:', error);
    }
  }, [isConnected, account, isSignedIn, web3, getUserRoles]);

  const value = {
    // Connection state
    web3,
    account,
    contract,
    isConnected,
    isConnecting,

    // User info from Clerk
    user,
    isSignedIn,

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
    refreshConnection,
    getUserRoles,

    // Utilities
    metaMaskService,
    formatAddress,
    formatBalance
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Context };
