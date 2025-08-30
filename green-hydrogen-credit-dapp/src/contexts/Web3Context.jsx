import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { initContract, checkRoles } from '../utils/contract';
import { toast } from 'react-toastify';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [roles, setRoles] = useState({ isProducer: false, isBuyer: false, isCertifier: false, isAdmin: false });

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const contractInstance = await initContract(web3Instance);
          setContract(contractInstance);
          const userRoles = await checkRoles(web3Instance, accounts[0]);
          setRoles(userRoles);
          toast.success(`Connected as ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);

          // Listen for contract events
          contractInstance.events.CreditIssued().on('data', (event) => {
            toast.info(`Credit Issued: ${event.returnValues.amount} credits to ${event.returnValues.producer}`);
          });
          contractInstance.events.CreditTransferred().on('data', (event) => {
            toast.info(`Credit Transferred: ${event.returnValues.amount} credits from ${event.returnValues.from} to ${event.returnValues.to}`);
          });
          contractInstance.events.CreditRetired().on('data', (event) => {
            toast.info(`Credit Retired: ${event.returnValues.amount} credits by ${event.returnValues.holder}`);
          });
        } catch (error) {
          toast.error('Failed to connect to wallet');
          console.error(error);
        }
      } else {
        toast.error('Please install MetaMask');
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
        if (accounts[0] && web3) {
          checkRoles(web3, accounts[0]).then(setRoles);
        }
      });
    }
  }, [web3]);

  return (
    <Web3Context.Provider value={{ web3, account, contract, roles }}>
      {children}
    </Web3Context.Provider>
  );
};
