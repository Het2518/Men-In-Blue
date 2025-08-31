const STATUS_CODES = require('http').STATUS_CODES;

class AppError extends Error{
    constructor(nStatusCode, sMessage="Error message is not available..."){
        super(sMessage);
        this.statusCode = nStatusCode;
        this.status = STATUS_CODES[this.statusCode];
        this.message = sMessage;
        console.log("AppError");
    }
}

module.exports = AppError;