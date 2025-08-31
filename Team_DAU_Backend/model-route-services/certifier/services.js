const jwt = require('jsonwebtoken');
const Certifier = require('./model');
const { status } = require('http-status');
const { generateResponse } = require('../../helper/utilities.services');
const { JWT_SECRET, JWT_VALIDITY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_VALIDITY } = require('../../config/config');
const blockchainService = require('../../services/blockchainService');

class CertifierServices {

    // Service to register a new certifier
    async registerCertifier(certifierData, res) {
        try {
            const { organizationName, contactEmail, walletAddress, accreditationId } = certifierData;

            const existingCertifier = await Certifier.findOne({
                where: { walletAddress }
            });

            if (existingCertifier) {
                return generateResponse(res, status.CONFLICT, 'Certifier with this wallet address already exists');
            }

            const existingOrganization = await Certifier.findOne({
                where: { organizationName }
            });
            if (existingOrganization) {
                return generateResponse(res, status.CONFLICT, 'Organization name is already registered');
            }

            const existingEmail = await Certifier.findOne({
                where: { contactEmail }
            });
            if (existingEmail) {
                return generateResponse(res, status.CONFLICT, 'Email address is already registered');
            }

            const existingAccreditation = await Certifier.findOne({
                where: { accreditationId }
            });
            if (existingAccreditation) {
                return generateResponse(res, status.CONFLICT, 'Accreditation ID is already registered');
            }

            const newCertifier = await Certifier.create({
                organizationName,
                contactEmail,
                walletAddress,
                accreditationId,
                role: 'certifier'
            });

            try {
                if (blockchainService.isConfigured()) {
                    const txHash = await blockchainService.grantAuditorRole(walletAddress);
                    console.log(`Auditor role granted on blockchain: ${txHash}`);
                } else {
                    console.log('Blockchain not configured, skipping role grant');
                }
            } catch (blockchainError) {
                console.error('Failed to grant auditor role on blockchain:', blockchainError);
            }

            const accessToken = this.generateAccessToken(newCertifier.id, newCertifier.walletAddress);
            const refreshToken = this.generateRefreshToken(newCertifier.id);

            return generateResponse(res, status.CREATED, 'Certifier registered successfully', {
                certifier: newCertifier,
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error('Certifier registration error:', error);
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                const field = error.errors[0]?.path;
                let message = 'Registration failed: Duplicate entry';
                
                switch (field) {
                    case 'wallet_address':
                        message = 'Certifier with this wallet address already exists';
                        break;
                    case 'organization_name':
                        message = 'Organization name is already registered';
                        break;
                    case 'contact_email':
                        message = 'Email address is already registered';
                        break;
                    case 'accreditation_id':
                        message = 'Accreditation ID is already registered';
                        break;
                    default:
                        message = 'Registration failed: Duplicate entry detected';
                }
                
                return generateResponse(res, status.CONFLICT, message);
            }
            
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Registration failed');
        }
    }
    
    // Service to log in a certifier
    async loginCertifier(loginData, res) {
        try {
            const { walletAddress } = loginData;

            const certifier = await Certifier.findOne({
                where: { walletAddress }
            });
            if (!certifier) {
                return generateResponse(res, status.UNAUTHORIZED, 'Invalid credentials');
            }

            const accessToken = this.generateAccessToken(certifier.id, certifier.walletAddress);
            const refreshToken = this.generateRefreshToken(certifier.id);

            return generateResponse(res, status.OK, 'Login successful', {
                certifier,
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error('Certifier login error:', error);
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Login failed');
        }
    }

    // Service to get all pending claims for a certifier
    async getPendingClaims(res) {
        try {
            const pendingClaims = [];

            return generateResponse(res, status.OK, 'Pending claims retrieved successfully', { claims: pendingClaims });
        } catch (error) {
            console.error('Get pending claims error:', error);
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retrieve claims');
        }
    }

    // Service to approve a claim
    async approveClaim(claimData, res) {
        try {
            const { claimId, certifierId, carbonIntensityScore } = claimData;
            
            const txHash = await this.issueCreditOnBlockchain(100, "placeholder-ipfs-hash");


            return generateResponse(res, status.OK, 'Claim approved and credit minted', { txHash });
        } catch (error) {
            console.error('Approve claim error:', error);
            // logServiceError({ service: 'approveClaim', error: error.message, timestamp: new Date() });
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to approve claim');
        }
    }

    // Service to reject a claim
    async rejectClaim(claimData, res) {
        try {
            const { claimId, certifierId, reason } = claimData;
            

            return generateResponse(res, status.OK, 'Claim rejected successfully');
        } catch (error) {
            console.error('Reject claim error:', error);
            return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to reject claim');
        }
    }
    
    // Placeholder for blockchain interaction
    async issueCreditOnBlockchain(amount, ipfsHash) {
        // Use a Web3 library to call the smart contract's `issueCredit` function.
        // const contract = new ethers.Contract(contractAddress, abi, certifierSigner);
        // const tx = await contract.issueCredit(amount, ipfsHash);
        // await tx.wait(); // Wait for the transaction to be mined
        return "0x-simulated-transaction-hash";
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

module.exports = new CertifierServices();
