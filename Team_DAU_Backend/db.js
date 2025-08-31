const mongoose = require('mongoose');
const {DB_CONNECTION_STRING} = require('./config');

async function connectDb(){
    try{
        await mongoose.connect(DB_CONNECTION_STRING);
        console.log("DB connected...");
    }
    catch(error){
        console.log("DB connection failed...");
    }
}

module.exports = {
    connectDb
}