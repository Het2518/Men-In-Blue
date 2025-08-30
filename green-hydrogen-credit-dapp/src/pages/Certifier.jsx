import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import VerifyOracleForm from '../components/Certifier/VerifyOracleForm';
import { Navigate } from 'react-router-dom';

const Certifier = () => {
  const { roles } = useContext(Web3Context);

  if (!roles.isCertifier) {
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
      <h1 className="text-4xl font-bold text-hydrogen-purple text-center mb-8 animate-pulse">
        Certifier Dashboard
      </h1>
      <VerifyOracleForm />
    </div>
  );
};

export default Certifier;
