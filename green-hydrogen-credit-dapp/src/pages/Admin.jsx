import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import MetadataForm from '../components/Admin/MetadataForm';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { roles } = useContext(Web3Context);

  if (!roles.isAdmin) {
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
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 animate-pulse">
        Admin Dashboard
      </h1>
      <MetadataForm />
    </div>
  );
};

export default Admin;
