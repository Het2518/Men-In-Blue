// config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new Sequelize instance with your database configuration
const sequelize = new Sequelize(
  // Database name is passed as the first argument
  process.env.DB_NAME,
  // Username is the second argument
  process.env.DB_USER,
  // Password is the third argument
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    // Set to false to hide SQL queries from the console
    logging: false,
    
    // For production environments, you may need to add SSL settings
    // depending on your hosting provider (e.g., Heroku, AWS RDS)
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
  }
);

// Function to test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Database connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Export the sequelize instance and connection function
module.exports = { sequelize, connectDB };
