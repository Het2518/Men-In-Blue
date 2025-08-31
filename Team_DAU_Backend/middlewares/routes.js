const {status} = require('http-status');
const express = require('express');
const { generateResponse } = require('../helper/utilities.services');

module.exports = (app) => {
  // User authentication routes
  app.use('/api/producer', require('../model-route-services/producer/routes'));

  // Certifier routes
  app.use('/api/certifier', require('../model-route-services/certifier/routes'));

  // Buyer routes
  app.use('/api/buyer', require('../model-route-services/buyer/routes'));

  // Blockchain utility routes
  app.use('/api/blockchain', require('../model-route-services/blockchain/routes'));

  // Health check endpoint
  app.get('/api/health-check', (req, res) => {
    const sDate = new Date();
    return generateResponse(res, 200, 'Server response...', {Date: sDate.toJSON(), responseTime: new Date()-sDate})
  })

  // 404 handler for API routes
  app.use('/api', (req, res, next) => {
    if (!res.headersSent) {
      return generateResponse(res, 404, 'API endpoint not found');
    }
    next();
  });
}
