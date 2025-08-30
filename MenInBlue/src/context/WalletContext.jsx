import React, { createContext, useContext, useState } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // Example wallet state (replace with actual logic)
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Example connect/disconnect functions
  const connectWallet = (acc) => {
    setAccount(acc);
    setIsConnected(true);
  };
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider value={{ account, isConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

// useWallet hook moved to hooks/useWallet.jsx for Fast Refresh compatibility
