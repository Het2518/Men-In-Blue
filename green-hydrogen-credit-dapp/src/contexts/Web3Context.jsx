import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { initContract, checkRoles } from '../utils/contract';
import { toast } from 'react-toastify';

const Web3Context = createContext();

// Development mode flag - set to true to bypass MetaMask
const DEVELOPMENT_MODE = true;

// Mock data for development
const MOCK_DATA = {
  account: '0x742d35Cc5aF7482C6d2a5d5B0E8eE73c7D8a0Cd1',
  roles: { isProducer: true, isBuyer: true, isCertifier: true, isAdmin: true },
  balance: '1250000',
  tokenId: '1'
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [roles, setRoles] = useState({ isProducer: false, isBuyer: false, isCertifier: false, isAdmin: false });
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(DEVELOPMENT_MODE);

  // Development mode initialization
  const initDevelopmentMode = () => {
    setAccount(MOCK_DATA.account);
    setRoles(MOCK_DATA.roles);
    setWeb3({ mockWeb3: true }); // Mock web3 object
    toast.success(`🚀 Development Mode: Connected as ${MOCK_DATA.account.slice(0, 6)}...${MOCK_DATA.account.slice(-4)}`);
    toast.info('💡 Running in development mode without MetaMask');
  };

  // Production mode initialization
  const initProductionMode = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const contractInstance = await initContract(web3Instance);
          setContract(contractInstance);
          const userRoles = await checkRoles(web3Instance, accounts[0]);
          setRoles(userRoles);
          toast.success(`Connected as ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);

          // Listen for contract events
          if (contractInstance) {
            contractInstance.events.CreditIssued().on('data', (event) => {
              toast.info(`Credit Issued: ${event.returnValues.amount} credits to ${event.returnValues.producer}`);
            });
            contractInstance.events.CreditTransferred().on('data', (event) => {
              toast.info(`Credit Transferred: ${event.returnValues.amount} credits from ${event.returnValues.from} to ${event.returnValues.to}`);
            });
            contractInstance.events.CreditRetired().on('data', (event) => {
              toast.info(`Credit Retired: ${event.returnValues.amount} credits by ${event.returnValues.holder}`);
            });
          }
        }
      } catch (error) {
        toast.error('Failed to connect to wallet');
        console.error(error);
      }
    } else {
      toast.error('Please install MetaMask');
    }
  };

  useEffect(() => {
    const init = async () => {
      if (isDevelopmentMode) {
        initDevelopmentMode();
      } else {
        await initProductionMode();
      }
    };
    init();
  }, [isDevelopmentMode]);

  useEffect(() => {
    if (!isDevelopmentMode && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
        if (accounts[0] && web3) {
          checkRoles(web3, accounts[0]).then(setRoles);
          toast.info('Account changed');
        }
      });
    }
  }, [web3, isDevelopmentMode]);

  // Function to toggle between development and production mode
  const toggleMode = () => {
    setIsDevelopmentMode(!isDevelopmentMode);
    // Reset state
    setAccount(null);
    setRoles({ isProducer: false, isBuyer: false, isCertifier: false, isAdmin: false });
    setWeb3(null);
    setContract(null);
  };

  const value = {
    web3,
    account,
    contract,
    roles,
    isDevelopmentMode,
    toggleMode,
    mockData: MOCK_DATA
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Context };
