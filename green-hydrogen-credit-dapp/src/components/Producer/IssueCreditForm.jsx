import React, { useState, useContext } from 'react';
import { Web3Context } from '../../contexts/Web3Context';
import { issueCredit } from '../../utils/contract';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';

const IssueCreditForm = () => {
  const { web3, account } = useContext(Web3Context);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [metadataURI, setMetadataURI] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3 || !account) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      await issueCredit(web3, account, recipient, amount, metadataURI);
      toast.success('Credit issued successfully');
      setRecipient('');
      setAmount('');
      setMetadataURI('');
    } catch (error) {
      toast.error(error.message || 'Failed to issue credit');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-hydrogen-green mb-6">Issue Green Hydrogen Credit</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">Recipient Address</label>
          <Input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
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
        <div>
          <label className="block text-white mb-2">Metadata URI</label>
          <Input
            type="text"
            value={metadataURI}
            onChange={(e) => setMetadataURI(e.target.value)}
            placeholder="ipfs://..."
            className="animate-float"
          />
        </div>
        <Button type="submit" className="w-full">Issue Credit</Button>
      </div>
    </form>
  );
};

export default IssueCreditForm;
