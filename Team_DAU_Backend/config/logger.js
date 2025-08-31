const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple format for single log file
const simpleFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: simpleFormat,
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info'
    }),
    
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

// Simple logging functions
const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

const logError = (message, error = null, meta = {}) => {
  const errorMeta = error ? { error: error.message, stack: error.stack, ...meta } : meta;
  logger.error(message, errorMeta);
};

const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

// Simplified activity logging
const logActivity = (action, userId = null, details = {}) => {
  logInfo(`${action}`, { userId, ...details });
};

// Simplified redirect logging
const logRedirect = (vanityUrl, originalUrl, ip = null, details = {}) => {
  logInfo(`Redirect: ${vanityUrl} -> ${originalUrl}`, { ip, ...details });
};

// Simplified request logging
const logRequest = (method, url, statusCode, responseTime, ip = null) => {
  const level = statusCode >= 400 ? 'warn' : 'info';
  const message = `${method} ${url} ${statusCode} (${responseTime}ms)`;
  
  if (level === 'warn') {
    logWarn(message, { ip });
  } else {
    logInfo(message, { ip });
  }
};

module.exports = {
  logger,
  logInfo,
  logError,
  logWarn,
  logActivity,
  logRedirect,
  logRequest
};
