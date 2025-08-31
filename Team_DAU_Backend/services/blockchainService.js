const { ethers } = require('ethers');
const contractABI = require('../contracts/GreenHydrogenCreditABI.json');

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        this.privateKey = process.env.ADMIN_PRIVATE_KEY;
        this.oraclePrivateKey = process.env.ORACLE_PRIVATE_KEY;
        
        if (this.privateKey && this.contractAddress) {
            // Create wallet instance
            this.adminWallet = new ethers.Wallet(this.privateKey, this.provider);
            this.oracleWallet = new ethers.Wallet(this.oraclePrivateKey, this.provider);
            
            // Create contract instance
            this.contract = new ethers.Contract(this.contractAddress, contractABI, this.adminWallet);
        } else {
            console.warn('Blockchain configuration missing. Some features will not work.');
        }
    }

    // Check if blockchain is configured
    isConfigured() {
        return this.contract !== undefined;
    }

    // Issue new credits (for producers)
    async issueCredit(producerAddress, amount, metadataURI) {
        try {
            if (!this.isConfigured()) {
                throw new Error('Blockchain not configured');
            }
            
            const tx = await this.contract.issueCredit(producerAddress, amount, metadataURI);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error issuing credit:', error);
            throw error;
        }
    }

    // Transfer credits between addresses
    async transferCredit(from, to, tokenId, amount, fromPrivateKey) {
        try {
            if (!this.isConfigured()) {
                throw new Error('Blockchain not configured');
            }
            
            const fromWallet = new ethers.Wallet(fromPrivateKey, this.provider);
            const contractWithFromWallet = this.contract.connect(fromWallet);
            
            const tx = await contractWithFromWallet.transferCredit(from, to, tokenId, amount);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error transferring credit:', error);
            throw error;
        }
    }

    // Retire credits
    async retireCredit(tokenId, amount, holderPrivateKey) {
        try {
            if (!this.isConfigured()) {
                throw new Error('Blockchain not configured');
            }
            
            const holderWallet = new ethers.Wallet(holderPrivateKey, this.provider);
            const contractWithHolderWallet = this.contract.connect(holderWallet);
            
            const tx = await contractWithHolderWallet.retireCredit(tokenId, amount);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error retiring credit:', error);
            throw error;
        }
    }

    // Get credit balance for an address
    async getBalance(address, tokenId) {
        try {
            if (!this.isConfigured()) {
                throw new Error('Blockchain not configured');
            }
            
            const balance = await this.contract.balanceOf(address, tokenId);
            return balance.toString();
        } catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }

    // Get all credits for a producer
    async getCreditsForProducer(producerAddress) {
        try {
            if (!this.isConfigured()) {
                throw new Error('Blockchain not configured');
            }
            
            const currentTokenId = await this.contract.getCurrentTokenId();
            const credits = [];
            
            for (let i = 1; i <= currentTokenId; i++) {
                const balance = await this.contract.balanceOf(producerAddress, i);
                if (balance > 0) {
                    credits.push({
                        tokenId: i,
                        balance: balance.toString(),
                        producer: producerAddress
                    });
                }
            }
            
            return credits;
        } catch (error) {
            console.error('Error getting producer credits:', error);
            throw error;
        }
    }

    // Get all available credits in marketplace
    async getAvailableCredits() {
        try {
            if (!this.isConfigured()) {
                throw new Error('Blockchain not configured');
            }
            
            const currentTokenId = await this.contract.getCurrentTokenId();
            const credits = [];
            
            for (let i = 1; i <= currentTokenId; i++) {
                const totalSupply = await this.contract.totalSupply(i);
                if (totalSupply > 0) {
                    credits.push({
                        tokenId: i,
                        totalSupply: totalSupply.toString(),
                        available: true
                    });
                }
            }
            
            return credits;
        } catch (error) {
            console.error('Error getting available credits:', error);
            throw error;
        }
    }

    // Grant roles
    async grantProducerRole(address) {
        try {
            if (!this.isConfigured()) {
                console.warn('Blockchain not configured, skipping role grant');
                return 'simulation';
            }
            
            const PRODUCER_ROLE = await this.contract.PRODUCER_ROLE();
            const tx = await this.contract.grantRole(PRODUCER_ROLE, address);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error granting producer role:', error);
            throw error;
        }
    }

    async grantAuditorRole(address) {
        try {
            if (!this.isConfigured()) {
                console.warn('Blockchain not configured, skipping role grant');
                return 'simulation';
            }
            
            const AUDITOR_ROLE = await this.contract.AUDITOR_ROLE();
            const tx = await this.contract.grantRole(AUDITOR_ROLE, address);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error granting auditor role:', error);
            throw error;
        }
    }

    async grantConsumerRole(address) {
        try {
            if (!this.isConfigured()) {
                console.warn('Blockchain not configured, skipping role grant');
                return 'simulation';
            }
            
            const CONSUMER_ROLE = await this.contract.CONSUMER_ROLE();
            const tx = await this.contract.grantRole(CONSUMER_ROLE, address);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error granting consumer role:', error);
            throw error;
        }
    }

    // Verify oracle data
    async verifyOracleData(msgHash, signature) {
        try {
            if (!this.isConfigured()) {
                throw new Error('Blockchain not configured');
            }
            
            const isValid = await this.contract.verifyOracleData(msgHash, signature);
            return isValid;
        } catch (error) {
            console.error('Error verifying oracle data:', error);
            throw error;
        }
    }

    // Create oracle signature
    async createOracleSignature(message) {
        try {
            if (!this.oracleWallet) {
                throw new Error('Oracle wallet not configured');
            }
            
            const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
            const signature = await this.oracleWallet.signMessage(ethers.getBytes(messageHash));
            return { messageHash, signature };
        } catch (error) {
            console.error('Error creating oracle signature:', error);
            throw error;
        }
    }
}

module.exports = new BlockchainService();
