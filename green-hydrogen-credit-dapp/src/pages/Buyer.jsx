import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import TransferCreditForm from '../components/Buyer/TransferCreditForm';
import RetireCreditForm from '../components/Buyer/RetireCreditForm';
import { Navigate } from 'react-router-dom';

const Buyer = () => {
  const { roles } = useContext(Web3Context);

  if (!roles.isBuyer) {
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
      <h1 className="text-4xl font-bold text-hydrogen-blue text-center mb-8 animate-pulse">
        Buyer Dashboard
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <TransferCreditForm />
        <RetireCreditForm />
      </div>
    </div>
  );
};

export default Buyer;
