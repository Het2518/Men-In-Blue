const STATUS_CODES = require('http').STATUS_CODES;
const status = require('http-status');

module.exports = function generateResponse(res, nStatusCode, sMessage, oData){
    if(!oData){
        res.status(nStatusCode).json({"Message: ": sMessage});
    }
    else{
        res.status(nStatusCode).json({"Message": sMessage, "Data": oData});
    }
}