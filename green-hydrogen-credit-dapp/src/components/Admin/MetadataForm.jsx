import React, { useState, useContext } from 'react';
import { Web3Context } from '../../contexts/Web3Context';
import { setMetadataURI } from '../../utils/contract';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';

const MetadataForm = () => {
  const { web3, account } = useContext(Web3Context);
  const [newURI, setNewURI] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3 || !account) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      await setMetadataURI(web3, account, newURI);
      toast.success('Metadata URI updated successfully');
      setNewURI('');
    } catch (error) {
      toast.error(error.message || 'Failed to update metadata URI');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Update Metadata URI</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">New Metadata URI</label>
          <Input
            type="text"
            value={newURI}
            onChange={(e) => setNewURI(e.target.value)}
            placeholder="ipfs://..."
            className="animate-float"
          />
        </div>
        <Button type="submit" className="w-full">Update URI</Button>
      </div>
    </form>
  );
};

export default MetadataForm;
