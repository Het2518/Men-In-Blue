const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { generateResponse } = require('../helper/utilities.services');
const { status } = require('http-status');
const { logWarn, logError } = require('../config/logger');

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      const ip = req.ip || req.connection?.remoteAddress;
      logWarn('Authentication failed: No authorization header', { ip, url: req.originalUrl });
      return generateResponse(res, status.UNAUTHORIZED, 'Access denied. Authorization header is missing.');
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token || token === 'Bearer' || token === authHeader) {
      const ip = req.ip || req.connection?.remoteAddress;
      logWarn('Authentication failed: No valid token', { ip, url: req.originalUrl });
      return generateResponse(res, status.UNAUTHORIZED, 'Access denied. Token is missing or malformed.');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    const ip = req.ip || req.connection?.remoteAddress;
    logError('Authentication failed: Invalid token', error, {
      url: req.originalUrl,
      hasToken: !!req.header('Authorization'),
      ip
    });

    if (error instanceof jwt.JsonWebTokenError) {
        return generateResponse(res, status.UNAUTHORIZED, 'Access denied. Token is invalid or expired.');
    }
    
    return generateResponse(res, status.UNAUTHORIZED, 'Invalid token');
  }
};

module.exports = authenticateUser;