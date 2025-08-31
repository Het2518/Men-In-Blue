import React from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import Button from './Button';
import { formatAddress, formatBalance } from '../../utils/format';
import './WalletConnection.css';

const WalletConnection = () => {
  const {
    isConnected,
    account,
    balance,
    networkName,
    isConnecting,
    isDevelopmentMode,
    connectToMetaMask,
    disconnectWallet,
    roles
  } = useWeb3();

  const getRoleDisplay = () => {
    if (!roles || Object.keys(roles).length === 0) return 'No roles assigned';

    const activeRoles = [];
    if (roles.isAdmin) activeRoles.push('Admin');
    if (roles.isProducer) activeRoles.push('Producer');
    if (roles.isCertifier) activeRoles.push('Certifier');
    if (roles.isBuyer) activeRoles.push('Buyer');

    return activeRoles.length > 0 ? activeRoles.join(', ') : 'User';
  };

  const getConnectionStatus = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    if (isDevelopmentMode) return 'Development Mode';
    return 'Not Connected';
  };

  const getStatusColor = () => {
    if (isConnecting) return 'orange';
    if (isConnected) return 'green';
    if (isDevelopmentMode) return 'blue';
    return 'red';
  };

  if (!isConnected) {
    return (
      <div className="wallet-connection disconnected">
        <div className="wallet-status">
          <div className="status-indicator">
            <span
              className={`status-dot ${getStatusColor()}`}
              title={getConnectionStatus()}
            />
            <span className="status-text">{getConnectionStatus()}</span>
          </div>

          {!isDevelopmentMode && (
            <div className="connection-info">
              <p className="info-text">
                Connect your MetaMask wallet to interact with the Green Hydrogen Credit system
              </p>
            </div>
          )}
        </div>

        <div className="connection-actions">
          {!isDevelopmentMode ? (
            <Button
              onClick={connectToMetaMask}
              disabled={isConnecting}
              variant="primary"
              className="connect-button"
            >
              {isConnecting ? (
                <>
                  <span className="loading-spinner" />
                  Connecting...
                </>
              ) : (
                <>
                  🦊 Connect MetaMask
                </>
              )}
            </Button>
          ) : (
            <div className="dev-mode-info">
              <p>Development mode - using mock wallet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connection connected">
      <div className="wallet-header">
        <div className="status-indicator">
          <span
            className={`status-dot ${getStatusColor()}`}
            title={getConnectionStatus()}
          />
          <span className="status-text">{getConnectionStatus()}</span>
        </div>

        {!isDevelopmentMode && (
          <Button
            onClick={disconnectWallet}
            variant="outline"
            size="sm"
            className="disconnect-button"
          >
            Disconnect
          </Button>
        )}
      </div>

      <div className="wallet-info">
        <div className="info-row">
          <label>Account:</label>
          <span className="account-address" title={account}>
            {formatAddress(account)}
          </span>
        </div>

        <div className="info-row">
          <label>Balance:</label>
          <span className="balance">
            {formatBalance(balance)} ETH
          </span>
        </div>

        <div className="info-row">
          <label>Network:</label>
          <span className="network">
            {networkName || 'Unknown'}
          </span>
        </div>

        <div className="info-row">
          <label>Role:</label>
          <span className="roles">
            {getRoleDisplay()}
          </span>
        </div>
      </div>

      {isDevelopmentMode && (
        <div className="dev-mode-badge">
          <span>🧪 Development Mode</span>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
