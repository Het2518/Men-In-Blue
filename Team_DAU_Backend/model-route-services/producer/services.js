const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Producer = require('./model'); // Use the new Producer model
const { status } = require('http-status');
const { generateResponse } = require('../../helper/utilities.services');
const { JWT_SECRET, JWT_VALIDITY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_VALIDITY } = require('../../config/config');
const blockchainService = require('../../services/blockchainService');
// const { logUserAction, logServiceError } = require('../../utils/simpleLogging');

class ProducerServices {

    // Service to register a new producer
    async registerProducer(producerData, res) {
        try {
            const { companyName, contactEmail, walletAddress } = producerData;

            // Check if a producer with this wallet address already exists
            const existingProducer = await Producer.findOne({
                where: { walletAddress }
            });

            if (existingProducer) {
                return generateResponse(res, status.CONFLICT, 'Producer with this wallet address already exists');
            }

            // Check if a producer with this company name already exists
            const existingCompanyName = await Producer.findOne({
                where: { companyName }
            });
            if (existingCompanyName) {
                return generateResponse(res, status.CONFLICT, 'Company name is already registered');
            }

            // Create new producer
            const newProducer = await Producer.create({
                companyName,
                contactEmail,
                walletAddress,
                role: 'producer' // Ensure the role is explicitly set
            });

            // Grant producer role on blockchain if configured
            try {
                if (blockchainService.isConfigured()) {
                    const txHash = await blockchainService.grantProducerRole(walletAddress);
                    console.log(`Producer role granted on blockchain: ${txHash}`);
                } else {
                    console.log('Blockchain not configured, skipping role grant');
                }
            } catch (blockchainError) {
                console.error('Failed to grant producer role on blockchain:', blockchainError);
                // Continue registration even if blockchain operation fails
            }

            // logUserAction({
            //     action: 'producer_registered',
            //     producerId: newProducer.id,
            //     walletAddress: newProducer.walletAddress,
            //     timestamp: new Date()
            // });

            // Generate tokens for the new producer
            const accessToken = this.generateAccessToken(newProducer.id, newProducer.walletAddress);
            const refreshToken = this.generateRefreshToken(newProducer.id);

            return generateResponse(res, status.CREATED, 'Producer registered successfully', {
                producer: newProducer,
                accessToken,
                refreshToken
            });

        } catch (error) {
            console.error('Registration error:', error);
            // logServiceError({
            //     service: 'producerRegistration',
            //     error: error.message,
            //     stack: error.stack,
            //     timestamp: new Date()
            // });
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Registration failed');
        }
    }

    // Service to log in a producer
    async loginProducer(loginData, res) {
        try {
            const { walletAddress } = loginData;

            // Find producer by wallet address
            const producer = await Producer.findOne({
                where: { walletAddress }
            });
            if (!producer) {
                return generateResponse(res, status.UNAUTHORIZED, 'Invalid credentials');
            }

            // logUserAction({
            //     action: 'producer_login',
            //     producerId: producer.id,
            //     walletAddress: producer.walletAddress,
            //     timestamp: new Date()
            // });

            const accessToken = this.generateAccessToken(producer.id, producer.walletAddress);
            const refreshToken = this.generateRefreshToken(producer.id);

            return generateResponse(res, status.OK, 'Login successful', {
                producer,
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error('Login error:', error);
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Login failed');
        }
    }

    // Service to log out a producer
    async logoutProducer(producerId, res) {
        // In a blockchain context, a simple logout might just invalidate the token server-side.
        // More complex logic could manage a list of active refresh tokens if needed.
        try {
            // logUserAction({
            //     action: 'producer_logout',
            //     producerId: producerId,
            //     timestamp: new Date()
            // });

            // For now, assume stateless JWTs and respond with success.
            return generateResponse(res, status.OK, 'Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Logout failed');
        }
    }

    // Service to handle a producer's project upload
    async uploadProject(projectData, res) {
        try {
            const { producerId, projectName, ipfsHash, creditAmount } = projectData;

            // Find the producer
            const producer = await Producer.findByPk(producerId);
            if (!producer) {
                return generateResponse(res, status.NOT_FOUND, 'Producer not found');
            }

            // Issue credit on blockchain if configured
            let txHash = null;
            try {
                if (blockchainService.isConfigured()) {
                    txHash = await blockchainService.issueCredit(
                        producer.walletAddress,
                        creditAmount || 100, // Default to 100 credits if not specified
                        ipfsHash || `https://ipfs.io/ipfs/${projectName}`
                    );
                    console.log(`Credits issued on blockchain: ${txHash}`);
                } else {
                    console.log('Blockchain not configured, simulating credit issuance');
                    txHash = 'simulation_tx_hash';
                }
            } catch (blockchainError) {
                console.error('Failed to issue credits on blockchain:', blockchainError);
                return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to issue credits on blockchain');
            }

            // Store project data in database (if Project model exists)
            // const newProject = await Project.create({
            //     producerId,
            //     projectName,
            //     ipfsHash,
            //     status: 'approved',
            //     txHash
            // });

            // logUserAction({
            //     action: 'project_uploaded',
            //     producerId,
            //     projectName,
            //     ipfsHash,
            //     txHash,
            //     timestamp: new Date()
            // });

            return generateResponse(res, status.CREATED, 'Project uploaded and credits issued', {
                projectName,
                ipfsHash,
                txHash,
                creditAmount: creditAmount || 100
            });
        } catch (error) {
            console.error('Project upload error:', error);
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Project upload failed');
        }
    }

    // Service to get all credits for a producer
    async getCredits(walletAddress, res) {
        try {
            let credits = [];
            
            if (blockchainService.isConfigured()) {
                // Get real credits from blockchain
                credits = await blockchainService.getCreditsForProducer(walletAddress);
            } else {
                // Simulate credits if blockchain not configured
                console.log('Blockchain not configured, returning simulated credits');
                credits = [
                    { tokenId: 1, balance: '100', producer: walletAddress },
                    { tokenId: 2, balance: '50', producer: walletAddress }
                ];
            }
            
            // logUserAction({
            //     action: 'get_producer_credits',
            //     walletAddress: walletAddress,
            //     creditCount: credits.length,
            //     timestamp: new Date()
            // });

            return generateResponse(res, status.OK, 'Credits retrieved successfully', { credits });
        } catch (error) {
            console.error('Get credits error:', error);
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retrieve credits');
        }
    }
    
    // Placeholder function to simulate blockchain interaction
    async fetchCreditsFromBlockchain(walletAddress) {
        // This is where you would use Ethers.js or Web3.js to interact with your smart contract
        // const contract = new ethers.Contract(contractAddress, abi, provider);
        // const credits = await contract.getCreditsByProducer(walletAddress);
        return [];
    }

    // JWT token generation for access
    generateAccessToken(userId, identifier) {
        return jwt.sign(
            { userId, identifier },
            JWT_SECRET,
            { expiresIn: JWT_VALIDITY || '15m' }
        );
    }
    
    // JWT token generation for refresh
    generateRefreshToken(userId) {
        return jwt.sign(
            { type: 'refresh', userId },
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_VALIDITY || '7d' }
        );
    }
}

module.exports = new ProducerServices();
