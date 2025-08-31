const { logRequest, logError, logWarn } = require('../config/logger');

const requestLoggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    
    if (res.statusCode >= 400 || req.originalUrl.includes('/api/')) {
      logRequest(req.method, req.originalUrl, res.statusCode, responseTime, ip);
    }
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};


const errorLoggingMiddleware = (err, req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  
  logError(`Error in ${req.method} ${req.originalUrl}`, err, {
    ip,
    userId: req.user?.id || null,
    statusCode: err.status || 500
  });
  
  next(err);
};


const securityLoggingMiddleware = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\.\//,
    /<script>/i,
    /union.*select/i,
    /javascript:/i
  ];
  
  const url = req.originalUrl || req.url;
  const suspicious = suspiciousPatterns.some(pattern => pattern.test(url));
  
  if (suspicious) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    logWarn(`Suspicious request: ${url}`, { ip, method: req.method });
  }
  
  next();
};

module.exports = {
  requestLoggingMiddleware,
  errorLoggingMiddleware,
  securityLoggingMiddleware
};
