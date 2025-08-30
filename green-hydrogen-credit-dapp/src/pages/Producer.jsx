import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import IssueCreditForm from '../components/Producer/IssueCreditForm';
import { Navigate } from 'react-router-dom';

const Producer = () => {
  const { roles } = useContext(Web3Context);

  if (!roles.isProducer) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <h1 className="text-4xl font-bold text-hydrogen-green text-center mb-8 animate-pulse">
        Producer Dashboard
      </h1>
      <IssueCreditForm />
    </div>
  );
};

export default Producer;
