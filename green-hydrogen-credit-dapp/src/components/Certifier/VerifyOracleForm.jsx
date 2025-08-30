import React, { useState, useContext } from 'react';
import { Web3Context } from '../../contexts/Web3Context';
import { verifyOracleData } from '../../utils/contract';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';

const VerifyOracleForm = () => {
  const { web3 } = useContext(Web3Context);
  const [msgHash, setMsgHash] = useState('');
  const [oracleSig, setOracleSig] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      const isValid = await verifyOracleData(web3, msgHash, oracleSig);
      setResult(isValid);
      toast.success(`Oracle data verification: ${isValid ? 'Valid' : 'Invalid'}`);
    } catch (error) {
      toast.error(error.message || 'Failed to verify oracle data');
      console.error(error);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-hydrogen-purple mb-6">Verify Oracle Data</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">Message Hash</label>
          <Input
            type="text"
            value={msgHash}
            onChange={(e) => setMsgHash(e.target.value)}
            placeholder="0x..."
            className="animate-float"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Oracle Signature</label>
          <Input
            type="text"
            value={oracleSig}
            onChange={(e) => setOracleSig(e.target.value)}
            placeholder="0x..."
            className="animate-float"
          />
        </div>
        <Button type="submit" className="w-full">Verify</Button>
      </form>
      {result !== null && (
        <p className={`mt-4 text-lg ${result ? 'text-hydrogen-green' : 'text-red-400'}`}>
          Result: {result ? 'Valid' : 'Invalid'}
        </p>
      )}
    </div>
  );
};

export default VerifyOracleForm;
