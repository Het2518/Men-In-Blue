import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useWeb3 } from '../../hooks/useWeb3';
import Button from './Button';
import { formatAddress, formatBalance } from '../../utils/format';
import './WalletConnection.css';

const WalletConnection = () => {
  const { user } = useUser();
  const {
    isConnected,
    account,
    balance,
    networkName,
    isConnecting,
    connectToMetaMask,
    disconnectWallet,
    roles
  } = useWeb3();

  // Get user role from Clerk
  const userRole = user?.publicMetadata?.role || 'buyer';

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
    return 'Not Connected';
  };

  const getStatusColor = () => {
    if (isConnecting) return 'orange';
    if (isConnected) return 'green';
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

          <div className="connection-info">
            <p className="info-text">
              Connect your MetaMask wallet to interact with the Green Hydrogen Credit system.
              You are signed in as {user?.firstName} {user?.lastName} with {userRole} privileges.
            </p>
          </div>
        </div>

        <div className="connection-actions">
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

        <Button
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="disconnect-button"
        >
          Disconnect
        </Button>
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

        <div className="info-row">
          <label>User:</label>
          <span className="user-info">
            {user?.firstName} {user?.lastName} ({userRole})
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;
