const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const hpp = require('hpp')
const { 
  requestLoggingMiddleware,
  errorLoggingMiddleware,
  securityLoggingMiddleware
} = require('./logging')

module.exports = (app) => {
  app.use(requestLoggingMiddleware)
  app.use(securityLoggingMiddleware)

  app.use(cors())
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }  }))
  app.disable('x-powered-by')
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(hpp())

  app.use(compression({
    filter: function (req, res) {
      if (req.headers['x-no-compression']) {
        return false
      }
      return compression.filter(req, res)
    }  }))
  
}
