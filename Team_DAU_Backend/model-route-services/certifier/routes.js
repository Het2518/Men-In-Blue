const express = require('express');
const certifierServices = require('./services');
const authenticateProducer = require('../../middlewares/authenticateProducer'); // Using existing auth middleware
const { status } = require('http-status');
const { generateResponse } = require('../../helper/utilities.services');
const { handleValidationErrors, certifierValidation } = require('../../helper/utilities.validation');

const router = express.Router();

// POST /api/certifiers/register
router.post('/register', certifierValidation.register, handleValidationErrors, async (req, res) => {
    try {
        const { organizationName, contactEmail, walletAddress, accreditationId } = req.body;
        return await certifierServices.registerCertifier({ organizationName, contactEmail, walletAddress, accreditationId }, res);
    } catch (error) {
        console.error('Register certifier route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Registration failed');
    }
});

// POST /api/certifiers/login
router.post('/login', certifierValidation.login, handleValidationErrors, async (req, res) => {
    try {
        const { walletAddress } = req.body;
        return await certifierServices.loginCertifier({ walletAddress }, res);
    } catch (error) {
        console.error('Login certifier route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Login failed');
    }
});

// GET /api/certifiers/claims
router.get('/claims', authenticateProducer, async (req, res) => {
    try {
        // Fetches all claims with a 'pending_review' status from the database.
        return await certifierServices.getPendingClaims(res);
    } catch (error) {
        console.error('Get pending claims route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retrieve claims');
    }
});

// POST /api/certifiers/claims/:claimId/approve
router.post('/claims/:claimId/approve', authenticateProducer, certifierValidation.approveClaim, handleValidationErrors, async (req, res) => {
    try {
        const { claimId } = req.params;
        const { carbonIntensityScore } = req.body;
        const certifierId = req.user.userId;
        // Approves the claim, updates the database, and calls the smart contract to mint the credit.
        return await certifierServices.approveClaim({ claimId, certifierId, carbonIntensityScore }, res);
    } catch (error) {
        console.error('Approve claim route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to approve claim');
    }
});

// POST /api/certifiers/claims/:claimId/reject
router.post('/claims/:claimId/reject', authenticateProducer, certifierValidation.rejectClaim, handleValidationErrors, async (req, res) => {
    try {
        const { claimId } = req.params;
        const { reason } = req.body;
        const certifierId = req.user.userId;
        // Rejects the claim and updates the database. No blockchain interaction needed for a rejection.
        return await certifierServices.rejectClaim({ claimId, certifierId, reason }, res);
    } catch (error) {
        console.error('Reject claim route error:', error);
        return generateResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to reject claim');
    }
});

module.exports = router;
