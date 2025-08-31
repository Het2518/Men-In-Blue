const { body, param, query, validationResult } = require('express-validator');
const { status } = require('http-status');
const { generateResponse } = require('./utilities.services');
const mongoose = require('mongoose');

// Utility function for checking validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value
        }));
        
        // Create a more detailed error response
        const errorResponse = {
            success: false,
            message: 'Validation failed',
            errors: errorMessages,
            errorCount: errorMessages.length
        };
        
        return res.status(status.BAD_REQUEST).json(errorResponse);
    }
    next();
};

// Custom validators
const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

const isValidUrl = (url) => {
    try {
        let testUrl = url.trim();
        if (!testUrl.match(/^https?:\/\//i)) {
            testUrl = 'https://' + testUrl;
        }
        
        const urlObj = new URL(testUrl);
        const hostname = urlObj.hostname;
        
        if (!hostname || hostname.length < 3 || !hostname.includes('.')) {
            return false;
        }
        
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
        return false;
    }
};

const isStrongPassword = (password) => {
    // At least 8 characters, with basic strength requirements
    return password && password.length >= 8;
};

// User validation arrays
const producerValidation = {
    // Producer registration validation
    register: [
        body('companyName')
            .trim()
            .notEmpty()
            .withMessage('Company name is required')
            .isLength({ min: 1, max: 100 })
            .withMessage('Company name must be between 1 and 100 characters'),

        body('contactEmail')
            .trim()
            .notEmpty()
            .withMessage('Contact email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        
        body('walletAddress')
            .trim()
            .notEmpty()
            .withMessage('Wallet address is required')
            .matches(/^0x[a-fA-F0-9]{40}$/i)
            .withMessage('A valid 42-character Ethereum wallet address (0x...) is required'),
    ],

    // Producer login validation
    login: [
        body('walletAddress')
            .trim()
            .notEmpty()
            .withMessage('Wallet address is required')
            .matches(/^0x[a-fA-F0-9]{40}$/i)
            .withMessage('A valid 42-character Ethereum wallet address (0x...) is required'),
    ],

    // Producer project upload validation
    uploadProject: [
        body('projectName')
            .trim()
            .notEmpty()
            .withMessage('Project name is required')
            .isLength({ min: 1, max: 100 })
            .withMessage('Project name must be between 1 and 100 characters'),
        
        body('ipfsHash')
            .trim()
            .notEmpty()
            .withMessage('IPFS hash is required')
            .isLength({ min: 46, max: 46 }) // Standard IPFS hash (CIDv0) is 46 characters
            .withMessage('A valid 46-character IPFS hash is required'),
    ],
};

// URL validation arrays
const urlValidation = {    // Create URL validation
    create: [
        body('sOriginalUrl')
            .trim()
            .custom((value, { req }) => {
                // sOriginalUrl is required for normal-url type, optional for dynamic-url
                const urlType = req.body.sUrlType || 'normal-url';
                if (urlType === 'normal-url' && (!value || value.trim() === '')) {
                    throw new Error('Original URL is required for normal URLs');
                }
                // If provided, it must be valid
                if (value && !isValidUrl(value)) {
                    throw new Error('Please provide a valid URL');
                }
                return true;
            }),
        
        body('sSlug')
            .optional()
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('Slug must be between 3 and 50 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Slug can only contain letters, numbers, hyphens, and underscores'),
        
        body('sTitle')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Title cannot exceed 100 characters'),
        
        body('sDescription')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),
        
        body('aTags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        
        body('aTags.*')
            .optional()
            .trim()
            .isLength({ min: 1, max: 20 })
            .withMessage('Each tag must be between 1 and 20 characters'),
        
        body('bActive')
            .optional()
            .isBoolean()
            .withMessage('Active status must be a boolean'),
    ],    // Update URL validation
    update: [
        param('id')
            .notEmpty()
            .withMessage('URL ID is required')
            .custom(isValidObjectId)
            .withMessage('Invalid URL ID format'),
        
        body('sUrlType')
            .optional()
            .isIn(['normal-url', 'dynamic-url'])
            .withMessage('URL type must be either normal-url or dynamic-url'),
        
        body('sOriginalUrl')
            .optional()
            .trim()
            .custom(isValidUrl)
            .withMessage('Please provide a valid original URL'),
        
        body('sTitle')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Title cannot exceed 100 characters'),
        
        body('sDescription')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),
        
        body('aTags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        
        body('aTags.*')
            .optional()
            .trim()
            .isLength({ min: 1, max: 20 })
            .withMessage('Each tag must be between 1 and 20 characters'),
        
        body('bActive')
            .optional()
            .isBoolean()
            .withMessage('Active status must be a boolean'),
        
        body('oDeepLinkConfig')
            .optional()
            .isObject()
            .withMessage('Deep link configuration must be an object'),
    ],

    // Get URL by ID validation
    getById: [
        param('id')
            .notEmpty()
            .withMessage('URL ID is required')
            .custom(isValidObjectId)
            .withMessage('Invalid URL ID format'),
    ],

    // Delete URL validation
    delete: [
        param('id')
            .notEmpty()
            .withMessage('URL ID is required')
            .custom(isValidObjectId)
            .withMessage('Invalid URL ID format'),
    ],

    // Get URL stats validation
    getStats: [
        param('slug')
            .trim()
            .notEmpty()
            .withMessage('Slug is required')
            .isLength({ min: 3, max: 50 })
            .withMessage('Slug must be between 3 and 50 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Invalid slug format'),
    ],

    // Toggle URL status validation
    toggleStatus: [
        param('id')
            .notEmpty()
            .withMessage('URL ID is required')
            .custom(isValidObjectId)
            .withMessage('Invalid URL ID format'),
    ],

    // Restore URL validation
    restore: [
        param('id')
            .notEmpty()
            .withMessage('URL ID is required')
            .custom(isValidObjectId)
            .withMessage('Invalid URL ID format'),
    ],
};

// Redirect URL validation arrays
const redirectValidation = {
    // Redirect to original URL validation
    redirect: [
        param('slug')
            .trim()
            .notEmpty()
            .withMessage('URL slug is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('Invalid slug length')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Invalid slug format'),
    ],

    // Get URL preview validation
    preview: [
        param('slug')
            .trim()
            .notEmpty()
            .withMessage('URL slug is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('Invalid slug length')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Invalid slug format'),
    ],

    // Get URL click stats validation
    clickStats: [
        param('slug')
            .trim()
            .notEmpty()
            .withMessage('URL slug is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('Invalid slug length')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Invalid slug format'),
    ],

    // URL health check validation
    healthCheck: [
        param('slug')
            .trim()
            .notEmpty()
            .withMessage('URL slug is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('Invalid slug length')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Invalid slug format'),
    ],
};

// Query parameter validations
const queryValidation = {
    // Pagination validation
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
    ],

    // Search validation
    search: [
        query('q')
            .optional()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Search query must be between 1 and 100 characters'),
    ],

    // Sort validation
    sort: [
        query('sortBy')
            .optional()
            .isIn(['createdAt', 'updatedAt', 'nClicks', 'sTitle'])
            .withMessage('Invalid sort field'),
        
        query('sortOrder')
            .optional()
            .isIn(['asc', 'desc'])
            .withMessage('Sort order must be either asc or desc'),
    ],

    // Filter validation
    filter: [
        query('active')
            .optional()
            .isBoolean()
            .withMessage('Active filter must be a boolean'),
        
        query('tags')
            .optional()
            .custom((value) => {
                if (typeof value === 'string') {
                    try {
                        const parsed = JSON.parse(value);
                        return Array.isArray(parsed);
                    } catch {
                        return false;
                    }
                }
                return Array.isArray(value);
            })
            .withMessage('Tags filter must be an array'),
    ],
};

const systemValidation = {
    healthCheck: [],
};

// Certifier validation arrays
const certifierValidation = {
    // Certifier registration validation
    register: [
        body('organizationName')
            .trim()
            .notEmpty()
            .withMessage('Organization name is required')
            .isLength({ min: 1, max: 100 })
            .withMessage('Organization name must be between 1 and 100 characters'),

        body('contactEmail')
            .trim()
            .notEmpty()
            .withMessage('Contact email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        
        body('walletAddress')
            .trim()
            .notEmpty()
            .withMessage('Wallet address is required')
            .matches(/^0x[a-fA-F0-9]{40}$/i)
            .withMessage('A valid 42-character Ethereum wallet address (0x...) is required'),
            
        body('accreditationId')
            .trim()
            .notEmpty()
            .withMessage('Accreditation ID is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('Accreditation ID must be between 1 and 50 characters'),
    ],

    // Certifier login validation
    login: [
        body('walletAddress')
            .trim()
            .notEmpty()
            .withMessage('Wallet address is required')
            .matches(/^0x[a-fA-F0-9]{40}$/i)
            .withMessage('A valid 42-character Ethereum wallet address (0x...) is required'),
    ],

    // Approve claim validation
    approveClaim: [
        param('claimId')
            .trim()
            .notEmpty()
            .withMessage('Claim ID is required')
            .isUUID()
            .withMessage('Invalid claim ID format'),
            
        body('carbonIntensityScore')
            .isNumeric()
            .withMessage('Carbon intensity score must be a number')
            .isFloat({ min: 0, max: 10 })
            .withMessage('Carbon intensity score must be between 0 and 10'),
    ],

    // Reject claim validation
    rejectClaim: [
        param('claimId')
            .trim()
            .notEmpty()
            .withMessage('Claim ID is required')
            .isUUID()
            .withMessage('Invalid claim ID format'),
            
        body('reason')
            .trim()
            .notEmpty()
            .withMessage('Rejection reason is required')
            .isLength({ min: 10, max: 500 })
            .withMessage('Rejection reason must be between 10 and 500 characters'),
    ],
};

// Buyer validation arrays
const buyerValidation = {
    // Buyer registration validation
    register: [
        body('companyName')
            .trim()
            .notEmpty()
            .withMessage('Company name is required')
            .isLength({ min: 1, max: 100 })
            .withMessage('Company name must be between 1 and 100 characters'),

        body('contactEmail')
            .trim()
            .notEmpty()
            .withMessage('Contact email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        
        body('walletAddress')
            .trim()
            .notEmpty()
            .withMessage('Wallet address is required')
            .matches(/^0x[a-fA-F0-9]{40}$/i)
            .withMessage('A valid 42-character Ethereum wallet address (0x...) is required'),
            
        body('industrySector')
            .optional()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Industry sector must be between 1 and 100 characters'),
    ],

    // Buyer login validation
    login: [
        body('walletAddress')
            .trim()
            .notEmpty()
            .withMessage('Wallet address is required')
            .matches(/^0x[a-fA-F0-9]{40}$/i)
            .withMessage('A valid 42-character Ethereum wallet address (0x...) is required'),
    ],

    // Purchase credit validation
    purchaseCredit: [
        param('creditId')
            .trim()
            .notEmpty()
            .withMessage('Credit ID is required')
            .isUUID()
            .withMessage('Invalid credit ID format'),
            
        body('amount')
            .isNumeric()
            .withMessage('Amount must be a number')
            .isFloat({ min: 0.01 })
            .withMessage('Amount must be greater than 0'),
            
        body('pricePerCredit')
            .isNumeric()
            .withMessage('Price per credit must be a number')
            .isFloat({ min: 0.01 })
            .withMessage('Price per credit must be greater than 0'),
    ],

    // Retire credit validation
    retireCredit: [
        param('creditId')
            .trim()
            .notEmpty()
            .withMessage('Credit ID is required')
            .isUUID()
            .withMessage('Invalid credit ID format'),
            
        body('amount')
            .isNumeric()
            .withMessage('Amount must be a number')
            .isFloat({ min: 0.01 })
            .withMessage('Amount must be greater than 0'),
            
        body('retirementReason')
            .trim()
            .notEmpty()
            .withMessage('Retirement reason is required')
            .isLength({ min: 5, max: 200 })
            .withMessage('Retirement reason must be between 5 and 200 characters'),
    ],
};

module.exports = {
    handleValidationErrors,
    producerValidation,
    certifierValidation,
    buyerValidation,
    urlValidation,
    redirectValidation,
    queryValidation,
    systemValidation,
    // Custom validators for reuse
    validators: {
        isValidObjectId,
        isValidUrl,
        isStrongPassword,
    },
};