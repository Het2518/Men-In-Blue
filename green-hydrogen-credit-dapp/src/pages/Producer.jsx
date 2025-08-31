import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import IssueCreditForm from '../components/Producer/IssueCreditForm';
import { Navigate } from 'react-router-dom';

import ProducerCertificateManager from '../components/Producer/ProducerCertificateManager';

const Producer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <ProducerCertificateManager />
      </div>
    </div>
  );
};

export default Producer;
