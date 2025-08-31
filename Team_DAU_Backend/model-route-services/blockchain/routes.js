const express = require('express');
const blockchainService = require('../../services/blockchainService');
const { status } = require('http-status');
const { generateResponse } = require('../../helper/utilities.services');
const authenticateProducer = require('../../middlewares/authenticateProducer');

const router = express.Router();

// Get credit balance for an address
router.get('/balance/:address/:tokenId', async (req, res) => {
    try {
        const { address, tokenId } = req.params;
        
        if (!blockchainService.isConfigured()) {
            return generateResponse(res, status.SERVICE_UNAVAILABLE, 'Blockchain service not configured');
        }
        
        const balance = await blockchainService.getBalance(address, tokenId);
        return generateResponse(res, status.OK, 'Balance retrieved successfully', { balance });
    } catch (error) {
        console.error('Get balance route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to get balance');
    }
});

// Get current token ID from contract
router.get('/current-token-id', async (req, res) => {
    try {
        if (!blockchainService.isConfigured()) {
            return generateResponse(res, status.SERVICE_UNAVAILABLE, 'Blockchain service not configured');
        }
        
        const currentTokenId = await blockchainService.contract.getCurrentTokenId();
        return generateResponse(res, status.OK, 'Current token ID retrieved', { currentTokenId: currentTokenId.toString() });
    } catch (error) {
        console.error('Get current token ID error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to get current token ID');
    }
});

// Verify oracle data
router.post('/verify-oracle', async (req, res) => {
    try {
        const { msgHash, signature } = req.body;
        
        if (!blockchainService.isConfigured()) {
            return generateResponse(res, status.SERVICE_UNAVAILABLE, 'Blockchain service not configured');
        }
        
        const isValid = await blockchainService.verifyOracleData(msgHash, signature);
        return generateResponse(res, status.OK, 'Oracle data verification result', { isValid });
    } catch (error) {
        console.error('Verify oracle data error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to verify oracle data');
    }
});

// Create oracle signature (for testing)
router.post('/create-oracle-signature', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!blockchainService.isConfigured()) {
            return generateResponse(res, status.SERVICE_UNAVAILABLE, 'Blockchain service not configured');
        }
        
        const result = await blockchainService.createOracleSignature(message);
        return generateResponse(res, status.OK, 'Oracle signature created', result);
    } catch (error) {
        console.error('Create oracle signature error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to create oracle signature');
    }
});

// Get blockchain configuration status
router.get('/status', async (req, res) => {
    try {
        const isConfigured = blockchainService.isConfigured();
        const contractAddress = process.env.CONTRACT_ADDRESS || 'Not configured';
        const rpcUrl = process.env.RPC_URL || 'Not configured';
        
        return generateResponse(res, status.OK, 'Blockchain status', {
            isConfigured,
            contractAddress: isConfigured ? contractAddress : 'Not configured',
            rpcUrl: isConfigured ? rpcUrl : 'Not configured'
        });
    } catch (error) {
        console.error('Get blockchain status error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to get blockchain status');
    }
});

module.exports = router;
