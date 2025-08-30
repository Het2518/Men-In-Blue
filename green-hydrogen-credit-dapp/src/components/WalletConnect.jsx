import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Button from './common/Button';
import { truncateAddress } from '../utils/format';
import { toast } from 'react-toastify';

const WalletConnect = () => {
  const { account, web3, isDevelopmentMode, toggleMode } = useContext(Web3Context);

  const connectWallet = async () => {
    if (isDevelopmentMode) {
      // In development mode, just toggle to show that it's already "connected"
      toast.info('Already connected in development mode! Toggle to production mode to use MetaMask.');
      return;
    }

    if (web3) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.location.reload();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('Please install MetaMask or switch to development mode');
    }
  };

  const disconnectWallet = () => {
    if (isDevelopmentMode) {
      // In development mode, just toggle back to production
      toggleMode();
      toast.info('Switched to production mode');
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {account ? (
        <div className="flex items-center space-x-2">
          <span className="text-white font-semibold bg-hydrogen-dark px-4 py-2 rounded-lg shadow-neon">
            {truncateAddress(account)}
            {isDevelopmentMode && (
              <span className="ml-2 text-xs text-yellow-400">(Mock)</span>
            )}
          </span>
          <button
            onClick={disconnectWallet}
            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/20"
            title="Disconnect"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      ) : (
        <Button onClick={connectWallet}>
          {isDevelopmentMode ? 'Connect (Dev Mode)' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
