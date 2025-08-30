import React, { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import { getCurrentTokenId, getBalance, fetchMetadata } from '../utils';
import { formatNumber, truncateAddress } from '../utils/format';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { account, web3, roles } = useContext(Web3Context);
  const [tokenId, setTokenId] = useState(0);
  const [balance, setBalance] = useState(0);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (web3 && account) {
        const currentTokenId = await getCurrentTokenId(web3);
        setTokenId(currentTokenId);
        const userBalance = await getBalance(web3, account, currentTokenId);
        setBalance(userBalance);
        const metadata = await fetchMetadata(currentTokenId);
        setMetadata(metadata);
      }
    };
    fetchData();
  }, [web3, account]);

  return (
    <div className="card max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-hydrogen-cyan">HydraChain Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-hydrogen-dark rounded-lg shadow-neon">
          <p className="text-lg"><strong>Address:</strong> {truncateAddress(account)}</p>
          <p className="text-lg"><strong>Roles:</strong>
            {roles.isProducer && <span className="text-hydrogen-green"> Producer</span>}
            {roles.isBuyer && <span className="text-hydrogen-blue"> Buyer</span>}
            {roles.isCertifier && <span className="text-hydrogen-purple"> Certifier</span>}
            {roles.isAdmin && <span className="text-yellow-400"> Admin</span>}
          </p>
        </div>
        <div className="p-4 bg-hydrogen-dark rounded-lg shadow-neon">
          <p className="text-lg"><strong>Current Token ID:</strong> {tokenId}</p>
          <p className="text-lg"><strong>Balance:</strong> {formatNumber(balance)} credits</p>
          {metadata && <p className="text-lg"><strong>Metadata:</strong> {metadata.name || 'N/A'}</p>}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {roles.isProducer && (
          <Link to="/producer" className="bg-hydrogen-green text-white px-4 py-2 rounded-lg hover:bg-hydrogen-cyan transition-all duration-300 animate-float">
            Issue Credits
          </Link>
        )}
        {roles.isBuyer && (
          <Link to="/buyer" className="bg-hydrogen-blue text-white px-4 py-2 rounded-lg hover:bg-hydrogen-purple transition-all duration-300 animate-float">
            Manage Credits
          </Link>
        )}
        {roles.isCertifier && (
          <Link to="/certifier" className="bg-hydrogen-purple text-white px-4 py-2 rounded-lg hover:bg-hydrogen-cyan transition-all duration-300 animate-float">
            Verify Oracle
          </Link>
        )}
        {roles.isAdmin && (
          <Link to="/admin" className="bg-yellow-400 text-hydrogen-dark px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all duration-300 animate-float">
            Admin Panel
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
