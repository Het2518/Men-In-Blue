import React, { createContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { toast } from 'react-toastify';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

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
      } else {
        toast.error('Failed to connect wallet.');
        console.error('Error connecting wallet:', error);
      }
      return null;
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setAccount(null);
    setWeb3(null);
    toast.info("You have been disconnected from the app. You can disconnect from MetaMask through its interface.");
  }, []);


  const value = {
    web3,
    account,
    connectWallet,
    disconnectWallet,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
