import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import WalletConnection from './common/WalletConnection';
import Button from './common/Button';
import './Dashboard.css';

const Dashboard = ({ onNavigate }) => {
  const {
    isConnected,
    balance,
    networkName,
    roles,
    isDevelopmentMode
  } = useWeb3();

  const getRoleButtons = () => {
    const buttons = [];

    if (roles?.isAdmin) {
      buttons.push(
        <Button
          key="admin"
          onClick={() => onNavigate('admin')}
          variant="primary"
          className="role-button admin-button"
        >
          🔧 Admin Panel
        </Button>
      );
    }

    if (roles?.isProducer) {
      buttons.push(
        <Button
          key="producer"
          onClick={() => onNavigate('producer')}
          variant="success"
          className="role-button producer-button"
        >
          ⚡ Producer Dashboard
        </Button>
      );
    }

    if (roles?.isCertifier) {
      buttons.push(
        <Button
          key="certifier"
          onClick={() => onNavigate('certifier')}
          variant="info"
          className="role-button certifier-button"
        >
          🏅 Certifier Portal
        </Button>
      );
    }

    if (roles?.isBuyer) {
      buttons.push(
        <Button
          key="buyer"
          onClick={() => onNavigate('buyer')}
          variant="warning"
          className="role-button buyer-button"
        >
          🛒 Buyer Marketplace
        </Button>
      );
    }

    // If no specific roles, show all options (for development/testing)
    if (buttons.length === 0) {
      return [
        <Button
          key="admin"
          onClick={() => onNavigate('admin')}
          variant="outline"
          className="role-button"
        >
          🔧 Admin Panel
        </Button>,
        <Button
          key="producer"
          onClick={() => onNavigate('producer')}
          variant="outline"
          className="role-button"
        >
          ⚡ Producer Dashboard
        </Button>,
        <Button
          key="certifier"
          onClick={() => onNavigate('certifier')}
          variant="outline"
          className="role-button"
        >
          🏅 Certifier Portal
        </Button>,
        <Button
          key="buyer"
          onClick={() => onNavigate('buyer')}
          variant="outline"
          className="role-button"
        >
          🛒 Buyer Marketplace
        </Button>
      ];
    }

    return buttons;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🌱 Green Hydrogen Credit Dashboard</h1>
        <p className="dashboard-subtitle">
          Decentralized carbon credit trading platform for green hydrogen production
        </p>
      </div>

      <WalletConnection />

      {isConnected ? (
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome to your dashboard!</h2>
            <p>
              {isDevelopmentMode ?
                'You are in development mode. All features are available for testing.' :
                'Select your role to access the corresponding features.'
              }
            </p>
          </div>

          <div className="role-navigation">
            <h3>Available Actions</h3>
            <div className="role-buttons">
              {getRoleButtons()}
            </div>
          </div>

          <div className="system-info">
            <div className="info-grid">
              <div className="info-card">
                <h4>Network</h4>
                <p>{networkName || 'Unknown'}</p>
              </div>
              <div className="info-card">
                <h4>Balance</h4>
                <p>{parseFloat(balance).toFixed(4)} ETH</p>
              </div>
              <div className="info-card">
                <h4>Status</h4>
                <p className="status-connected">Connected ✅</p>
              </div>
              {isDevelopmentMode && (
                <div className="info-card dev-mode">
                  <h4>Mode</h4>
                  <p>🧪 Development</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="connect-prompt">
          <div className="prompt-content">
            <h2>🔗 Connect Your Wallet</h2>
            <p>
              {isDevelopmentMode ?
                'Development mode is active. The system is ready for testing.' :
                'Please connect your MetaMask wallet to access the Green Hydrogen Credit platform.'
              }
            </p>

            <div className="features-preview">
              <h3>Platform Features</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <div>
                    <strong>Issue Credits</strong>
                    <p>Producers can issue new hydrogen credits</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏅</span>
                  <div>
                    <strong>Verify Production</strong>
                    <p>Certifiers validate and approve credits</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛒</span>
                  <div>
                    <strong>Trade Credits</strong>
                    <p>Buyers can purchase and retire credits</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔧</span>
                  <div>
                    <strong>Platform Management</strong>
                    <p>Admins control system parameters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
