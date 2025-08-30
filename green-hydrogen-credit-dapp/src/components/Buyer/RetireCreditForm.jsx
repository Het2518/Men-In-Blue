import React, { useState, useContext } from 'react';
import { Web3Context } from '../../contexts/Web3Context';
import { retireCredit } from '../../utils/contract';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';

const RetireCreditForm = () => {
  const { web3, account } = useContext(Web3Context);
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3 || !account) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      await retireCredit(web3, account, tokenId, amount);
      toast.success('Credit retired successfully');
      setTokenId('');
      setAmount('');
    } catch (error) {
      toast.error(error.message || 'Failed to retire credit');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-hydrogen-blue mb-6">Retire Credit</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">Token ID</label>
          <Input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter token ID"
            className="animate-float"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="animate-float"
          />
        </div>
        <Button type="submit" className="w-full">Retire Credit</Button>
      </div>
    </form>
  );
};

export default RetireCreditForm;
