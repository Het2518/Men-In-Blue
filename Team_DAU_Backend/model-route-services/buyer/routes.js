const express = require('express');
const buyerServices = require('./services');
const authenticateProducer = require('../../middlewares/authenticateProducer'); // Using existing auth middleware
const { status } = require('http-status');
const { generateResponse } = require('../../helper/utilities.services');
const { handleValidationErrors, buyerValidation } = require('../../helper/utilities.validation');

const router = express.Router();

// POST /api/buyers/register
router.post('/register', buyerValidation.register, handleValidationErrors, async (req, res) => {
    try {
        const { companyName, contactEmail, walletAddress, industrySector } = req.body;
        return await buyerServices.registerBuyer({ companyName, contactEmail, walletAddress, industrySector }, res);
    } catch (error) {
        console.error('Register buyer route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Registration failed');
    }
});

// POST /api/buyers/login
router.post('/login', buyerValidation.login, handleValidationErrors, async (req, res) => {
    try {
        const { walletAddress } = req.body;
        return await buyerServices.loginBuyer({ walletAddress }, res);
    } catch (error) {
        console.error('Login buyer route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Login failed');
    }
});

// POST /api/buyers/logout
router.post('/logout', authenticateProducer, async (req, res) => {
    try {
        return await buyerServices.logoutBuyer(req.user.userId, res);
    } catch (error) {
        console.error('Logout buyer route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Logout failed');
    }
});

// GET /api/buyers/marketplace
router.get('/marketplace', authenticateProducer, async (req, res) => {
    try {
        // Fetches a list of all credits that are available for purchase
        return await buyerServices.getAvailableCredits(res);
    } catch (error) {
        console.error('Get marketplace route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retrieve marketplace');
    }
});

// POST /api/buyers/credits/:creditId/purchase
router.post('/credits/:creditId/purchase', authenticateProducer, buyerValidation.purchaseCredit, handleValidationErrors, async (req, res) => {
    try {
        const { creditId } = req.params;
        const { amount, pricePerCredit } = req.body;
        const buyerWalletAddress = req.user.identifier;
        const buyerId = req.user.userId;
        // Initiates a credit transfer on the blockchain
        return await buyerServices.purchaseCredit({ creditId, buyerId, buyerWalletAddress, amount, pricePerCredit }, res);
    } catch (error) {
        console.error('Purchase credit route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to purchase credit');
    }
});

// POST /api/buyers/credits/:creditId/retire
router.post('/credits/:creditId/retire', authenticateProducer, buyerValidation.retireCredit, handleValidationErrors, async (req, res) => {
    try {
        const { creditId } = req.params;
        const { amount, retirementReason } = req.body;
        const buyerWalletAddress = req.user.identifier;
        const buyerId = req.user.userId;
        // Retires the credit on the blockchain to prevent double-counting
        return await buyerServices.retireCredit({ creditId, buyerId, buyerWalletAddress, amount, retirementReason }, res);
    } catch (error) {
        console.error('Retire credit route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retire credit');
    }
});

module.exports = router;
