import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Button from './common/Button';
import { truncateAddress } from '../utils/format';
import { toast } from 'react-toastify';

const WalletConnect = () => {
  const { account, web3 } = useContext(Web3Context);

  const connectWallet = async () => {
    if (web3) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.location.reload();
      } catch (error) {
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('Please install MetaMask');
    }
  };

  return (
    <div className="flex items-center">
      {account ? (
        <span className="text-white font-semibold bg-hydrogen-dark px-4 py-2 rounded-lg shadow-neon">
          {truncateAddress(account)}
        </span>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </div>
  );
};

export default WalletConnect;
