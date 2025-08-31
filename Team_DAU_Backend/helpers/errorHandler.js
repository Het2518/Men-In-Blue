const generateResponse = require('../helpers/responseHandler');

module.exports = function(error, req, res, next){
    error.statusCode = error.statusCode || 500;
    console.log({error});
    console.log("::Error handler::");

    generateResponse(res, error.statusCode, error.message);
}
