const jwt = require('jsonwebtoken');
const Buyer = require('./model');
const { status } = require('http-status');
const { generateResponse } = require('../../helper/utilities.services');
const { JWT_SECRET, JWT_VALIDITY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_VALIDITY } = require('../../config/config');
const blockchainService = require('../../services/blockchainService');

class BuyerServices {

    // Service to register a new buyer
    async registerBuyer(buyerData, res) {
        try {
            const { companyName, contactEmail, walletAddress, industrySector } = buyerData;
            
            // Check if a buyer with this wallet address already exists
            const existingBuyerByWallet = await Buyer.findOne({ where: { walletAddress } });
            if (existingBuyerByWallet) {
                return generateResponse(res, status.CONFLICT, 'Buyer with this wallet address already exists');
            }

            // Check if a buyer with this company name already exists
            const existingBuyerByCompany = await Buyer.findOne({ where: { companyName } });
            if (existingBuyerByCompany) {
                return generateResponse(res, status.CONFLICT, 'Company name is already registered');
            }

            // Check if a buyer with this email already exists
            const existingBuyerByEmail = await Buyer.findOne({ where: { contactEmail } });
            if (existingBuyerByEmail) {
                return generateResponse(res, status.CONFLICT, 'Email address is already registered');
            }

            const newBuyer = await Buyer.create({
                companyName,
                contactEmail,
                walletAddress,
                industrySector,
                role: 'buyer'
            });

            // Grant consumer role on blockchain if configured
            try {
                if (blockchainService.isConfigured()) {
                    const txHash = await blockchainService.grantConsumerRole(walletAddress);
                    console.log(`Consumer role granted on blockchain: ${txHash}`);
                } else {
                    console.log('Blockchain not configured, skipping role grant');
                }
            } catch (blockchainError) {
                console.error('Failed to grant consumer role on blockchain:', blockchainError);
                // Continue registration even if blockchain operation fails
            }

            const accessToken = this.generateAccessToken(newBuyer.id, newBuyer.walletAddress);
            const refreshToken = this.generateRefreshToken(newBuyer.id);

            // logUserAction({ action: 'buyer_registered', buyerId: newBuyer.id, timestamp: new Date() });

            return generateResponse(res, status.CREATED, 'Buyer registered successfully', {
                buyer: newBuyer,
                accessToken,
                refreshToken
            });

        } catch (error) {
            console.error('Registration error:', error);
            
            // Handle Sequelize unique constraint errors
            if (error.name === 'SequelizeUniqueConstraintError') {
                const field = error.errors[0]?.path;
                let message = 'Registration failed: Duplicate entry';
                
                switch (field) {
                    case 'wallet_address':
                        message = 'Buyer with this wallet address already exists';
                        break;
                    case 'company_name':
                        message = 'Company name is already registered';
                        break;
                    case 'contact_email':
                        message = 'Email address is already registered';
                        break;
                    default:
                        message = 'Registration failed: Duplicate entry detected';
                }
                
                return generateResponse(res, status.CONFLICT, message);
            }
            
            // logServiceError({ service: 'buyerRegistration', error: error.message, stack: error.stack, timestamp: new Date() });
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Registration failed');
        }
    }
    
    // Service to log in a buyer
    async loginBuyer(loginData, res) {
        try {
            const { walletAddress } = loginData;
            const buyer = await Buyer.findOne({ where: { walletAddress } });
            if (!buyer) {
                return generateResponse(res, status.UNAUTHORIZED, 'Login failed: Invalid wallet address or buyer not found.');
            }

            const accessToken = this.generateAccessToken(buyer.id, buyer.walletAddress);
            const refreshToken = this.generateRefreshToken(buyer.id);

            // logUserAction({ action: 'buyer_login', buyerId: buyer.id, timestamp: new Date() });

            return generateResponse(res, status.OK, 'Login successful', {
                buyer,
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error('Login error:', error);
            // logServiceError({ service: 'buyerLogin', error: error.message, stack: error.stack, timestamp: new Date() });
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Login failed');
        }
    }

    // Service to log out a buyer
    async logoutBuyer(buyerId, res) {
        try {
            // logUserAction({ action: 'buyer_logout', buyerId: buyerId, timestamp: new Date() });
            return generateResponse(res, status.OK, 'Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
            // logServiceError({ service: 'buyerLogout', error: error.message, stack: error.stack, timestamp: new Date() });
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Logout failed');
        }
    }

    // Service to get all credits available for purchase
    async getAvailableCredits(res) {
        try {
            // This is a placeholder for a blockchain call.
            // A real implementation would query the smart contract to find all credits that are available for sale.
            const credits = await this.fetchAvailableCreditsFromBlockchain();
            
            return generateResponse(res, status.OK, 'Available credits retrieved successfully', { credits });
        } catch (error) {
            console.error('Get available credits error:', error);
            // logServiceError({ service: 'getAvailableCredits', error: error.message, stack: error.stack, timestamp: new Date() });
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retrieve credits');
        }
    }
    
    // Service to purchase a credit
    async purchaseCredit(purchaseData, res) {
        try {
            const { creditId, buyerId, buyerWalletAddress, amount, pricePerCredit } = purchaseData;

            // Placeholder for a blockchain call to transfer the credit.
            const txHash = await this.transferCreditOnBlockchain(creditId, buyerWalletAddress);

            // logUserAction({ action: 'credit_purchased', creditId, buyerId, buyerWalletAddress, amount, pricePerCredit, timestamp: new Date() });

            return generateResponse(res, status.OK, 'Credit purchased successfully', { 
                txHash,
                creditId,
                amount,
                totalPrice: amount * pricePerCredit
            });
        } catch (error) {
            console.error('Purchase credit error:', error);
            // logServiceError({ service: 'purchaseCredit', error: error.message, stack: error.stack, timestamp: new Date() });
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to purchase credit');
        }
    }

    // Service to retire a credit
    async retireCredit(retireData, res) {
        try {
            const { creditId, buyerId, buyerWalletAddress, amount, retirementReason } = retireData;
            
            // Placeholder for a blockchain call to retire the credit.
            const txHash = await this.retireCreditOnBlockchain(creditId, buyerWalletAddress);

            // logUserAction({ action: 'credit_retired', creditId, buyerId, buyerWalletAddress, amount, retirementReason, timestamp: new Date() });

            return generateResponse(res, status.OK, 'Credit retired successfully', { 
                txHash,
                creditId,
                amount,
                retirementReason
            });
        } catch (error) {
            console.error('Retire credit error:', error);
            // logServiceError({ service: 'retireCredit', error: error.message, stack: error.stack, timestamp: new Date() });
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retire credit');
        }
    }

    // Placeholder function to simulate blockchain interaction
    async fetchAvailableCreditsFromBlockchain() {
        return [{ id: 1, producer: '0xabc...', amount: 100, ipfsHash: 'Qm...', retired: false }];
    }
    
    async transferCreditOnBlockchain(creditId, toAddress) {
        return "0x-simulated-transfer-hash";
    }

    async retireCreditOnBlockchain(creditId, retiredByAddress) {
        return "0x-simulated-retire-hash";
    }
    
    // JWT token generation for access
    generateAccessToken(userId, identifier) {
        return jwt.sign({ userId, identifier }, JWT_SECRET, { expiresIn: JWT_VALIDITY || '15m' });
    }
    
    // JWT token generation for refresh
    generateRefreshToken(userId) {
        return jwt.sign({ type: 'refresh', userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_VALIDITY || '7d' });
    }
}

module.exports = new BuyerServices();
