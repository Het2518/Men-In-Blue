import Web3 from 'web3';
import { toast } from 'react-toastify';

// MetaMask connection utilities
export class MetaMaskService {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.isConnected = false;
    this.networkId = import.meta.env.VITE_NETWORK_ID || '1';
    this.networkName = import.meta.env.VITE_NETWORK_NAME || 'Ethereum Mainnet';
    this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // Check if we're in development mode
  isDevelopmentMode() {
    return import.meta.env.VITE_DEVELOPMENT_MODE === 'true' ||
      import.meta.env.DEV ||
      import.meta.env.MODE === 'development';
  }

  /**
   * Show MetaMask installation prompt
   */
  showInstallPrompt() {
    const installUrl = 'https://metamask.io/download/';

    // Try to create a more user-friendly prompt
    const message = [
      'MetaMask is required to use this application.',
      '',
      'MetaMask is a crypto wallet that allows you to interact with blockchain applications securely.',
      '',
      'Would you like to install MetaMask now?'
    ].join('\n');

    const shouldOpen = confirm(message);

    if (shouldOpen) {
      window.open(installUrl, '_blank');
    }

    // Also show console instructions
    const consoleMessage = [
      '🦊 MetaMask Required',
      '',
      'This application requires MetaMask to function properly.',
      'Please install MetaMask from: https://metamask.io/download/',
      '',
      'After installation, refresh this page to continue.'
    ].join('\n');

    console.warn(consoleMessage);
  }

  // Initialize Web3 connection
  async initialize() {
    if (!this.isMetaMaskInstalled()) {
      if (!this.isDevelopmentMode()) {
        this.showInstallPrompt();
        return { success: false, error: 'MetaMask not installed' };
      } else {
        console.log('🚀 Development mode: Using mock Web3');
        return { success: true, isDevelopment: true };
      }
    }

    try {
      this.web3 = new Web3(window.ethereum);
      return { success: true, web3: this.web3 };
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      toast.error('Failed to initialize Web3 connection');
      return { success: false, error: error.message };
    }
  }

  // Request account access
  async requestAccounts() {
    if (!this.isMetaMaskInstalled()) {
      this.showInstallPrompt();
      return { success: false, error: 'MetaMask not installed' };
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Connecting to MetaMask...');

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      toast.dismiss(loadingToast);

      if (accounts.length === 0) {
        toast.warning('No accounts found. Please unlock MetaMask.');
        return { success: false, error: 'No accounts available' };
      }

      this.account = accounts[0];
      this.isConnected = true;

      // Show success message
      toast.success(
        <div>
          <strong>Connected to MetaMask!</strong>
          <br />
          Account: {accounts[0].slice(0, 6)}...{accounts[0].slice(-4)}
        </div>
      );

      return {
        success: true,
        account: accounts[0],
        accounts: accounts
      };

    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);

      if (error.code === 4001) {
        toast.error('Connection rejected by user');
      } else {
        toast.error(`Connection failed: ${error.message}`);
      }

      return { success: false, error: error.message };
    }
  }

  // Get current accounts
  async getAccounts() {
    if (!this.isMetaMaskInstalled()) {
      return { success: false, error: 'MetaMask not installed' };
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      return { success: true, accounts };
    } catch (error) {
      console.error('Failed to get accounts:', error);
      return { success: false, error: error.message };
    }
  }

  // Check current network
  async checkNetwork() {
    if (!this.isMetaMaskInstalled()) {
      return { success: false, error: 'MetaMask not installed' };
    }

    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      const currentNetwork = parseInt(chainId, 16).toString();
      const expectedNetwork = this.networkId;

      if (currentNetwork !== expectedNetwork) {
        toast.warning(
          <div>
            <strong>Wrong Network!</strong>
            <br />
            Please switch to {this.networkName}
            <br />
            Current: {this.getNetworkName(currentNetwork)}
          </div>
        );

        return {
          success: false,
          error: 'Wrong network',
          currentNetwork,
          expectedNetwork
        };
      }

      return { success: true, networkId: currentNetwork };
    } catch (error) {
      console.error('Failed to check network:', error);
      return { success: false, error: error.message };
    }
  }

  // Switch network
  async switchNetwork() {
    if (!this.isMetaMaskInstalled()) {
      return { success: false, error: 'MetaMask not installed' };
    }

    try {
      const chainIdHex = '0x' + parseInt(this.networkId).toString(16);

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      });

      toast.success(`Switched to ${this.networkName}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error(`Failed to switch network: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Get network name from ID
  getNetworkName(networkId) {
    const networks = {
      '1': 'Ethereum Mainnet',
      '3': 'Ropsten Testnet',
      '4': 'Rinkeby Testnet',
      '5': 'Goerli Testnet',
      '42': 'Kovan Testnet',
      '137': 'Polygon Mainnet',
      '80001': 'Polygon Mumbai',
      '56': 'BSC Mainnet',
      '97': 'BSC Testnet'
    };
    return networks[networkId] || `Unknown Network (${networkId})`;
  }

  // Get account balance
  async getBalance(account) {
    if (!this.web3) {
      return { success: false, error: 'Web3 not initialized' };
    }

    try {
      const balance = await this.web3.eth.getBalance(account);
      const balanceInEth = this.web3.utils.fromWei(balance, 'ether');

      return {
        success: true,
        balance: balanceInEth,
        balanceWei: balance
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign message
  async signMessage(message, account) {
    if (!this.isMetaMaskInstalled()) {
      return { success: false, error: 'MetaMask not installed' };
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
      });

      return { success: true, signature };
    } catch (error) {
      console.error('Failed to sign message:', error);
      toast.error('Failed to sign message');
      return { success: false, error: error.message };
    }
  }

  // Listen for account changes
  onAccountsChanged(callback) {
    if (!this.isMetaMaskInstalled()) return;

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.isConnected = false;
        this.account = null;
        toast.info('MetaMask disconnected');
      } else {
        this.account = accounts[0];
        this.isConnected = true;
        toast.info(
          `Account changed to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
        );
      }
      callback(accounts);
    });
  }

  // Listen for network changes
  onChainChanged(callback) {
    if (!this.isMetaMaskInstalled()) return;

    window.ethereum.on('chainChanged', (chainId) => {
      const networkId = parseInt(chainId, 16).toString();
      toast.info(`Network changed to ${this.getNetworkName(networkId)}`);
      callback(chainId);
      // Reload page to reset state
      window.location.reload();
    });
  }

  // Disconnect (cleanup)
  disconnect() {
    this.web3 = null;
    this.account = null;
    this.isConnected = false;
    toast.info('Disconnected from MetaMask');
  }

  // Full connection flow
  async connect() {
    const initResult = await this.initialize();
    if (!initResult.success) {
      return initResult;
    }

    if (initResult.isDevelopment) {
      return {
        success: true,
        isDevelopment: true,
        account: '0x742d35Cc5aF7482C6d2a5d5B0E8eE73c7D8a0Cd1' // Mock account
      };
    }

    const accountResult = await this.requestAccounts();
    if (!accountResult.success) {
      return accountResult;
    }

    const networkResult = await this.checkNetwork();
    if (!networkResult.success && networkResult.error === 'Wrong network') {
      const switchResult = await this.switchNetwork();
      if (!switchResult.success) {
        return networkResult;
      }
    }

    const balanceResult = await this.getBalance(accountResult.account);

    return {
      success: true,
      account: accountResult.account,
      accounts: accountResult.accounts,
      balance: balanceResult.success ? balanceResult.balance : '0',
      networkId: networkResult.success ? networkResult.networkId : this.networkId
    };
  }
}

// Create singleton instance
export const metaMaskService = new MetaMaskService();

// Utility functions
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance) => {
  if (!balance) return '0';
  return parseFloat(balance).toFixed(4);
};

export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
