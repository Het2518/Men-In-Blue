const express = require('express');
const producerServices = require('./services');
const authenticateProducer = require('../../middlewares/authenticateProducer');
const {status} = require('http-status');
const { generateResponse } = require('../../helper/utilities.services');
const { handleValidationErrors, producerValidation } = require('../../helper/utilities.validation');

const router = express.Router();

// POST /api/producers/register
router.post('/register', producerValidation.register, handleValidationErrors, async (req, res) => {
    try {
        // The walletAddress is a critical field for blockchain-based systems.
        const { companyName, contactEmail, walletAddress } = req.body;

        return await producerServices.registerProducer({ companyName, contactEmail, walletAddress }, res);

    } catch (error) {
        console.error('Register producer route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Registration failed');
    }
});

// POST /api/producers/login
router.post('/login', producerValidation.login, handleValidationErrors, async (req, res) => {
    try {
        const { walletAddress } = req.body;

        // In a blockchain context, login typically involves signing a message with the wallet.
        // The backend would verify this signature.
        return await producerServices.loginProducer({ walletAddress }, res);

    } catch (error) {
        console.error('Login producer route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Login failed');
    }
});

// --- Protected Endpoints (require a valid JWT token) ---

// POST /api/producers/logout
router.post('/logout', authenticateProducer, async (req, res) => {
    try {
        // Your authentication middleware (authenticateProducer) would handle the token verification.
        // This endpoint would clear the session/token on the backend.
        return await producerServices.logoutProducer(req.user.id, res);
    } catch (error) {
        console.error('Logout producer route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Logout failed');
    }
});

// POST /api/producers/projects
router.post('/projects', authenticateProducer, producerValidation.uploadProject, handleValidationErrors, async (req, res) => {
    try {
        const { projectName, ipfsHash, creditAmount } = req.body;
        
        // Use the userId from JWT token instead of producerId from body
        const producerId = req.user.userId;
        
        console.log('Upload project - JWT user:', req.user);
        console.log('Upload project - Using producerId:', producerId);
        
        return await producerServices.uploadProject({ 
            producerId, 
            projectName, 
            ipfsHash, 
            creditAmount 
        }, res);
    } catch (error) {
        console.error('Upload project route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to upload project');
    }
});

// GET /api/producers/credits
router.get('/credits', authenticateProducer, async (req, res) => {
    try {
        // The backend queries the blockchain to get the producer's credit balance.
        return await producerServices.getCredits(req.user.walletAddress, res);
    } catch (error) {
        console.error('Get credits route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retrieve credits');
    }
});

module.exports = router;
