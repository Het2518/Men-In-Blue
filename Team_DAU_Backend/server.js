require('dotenv').config()
const express = require('express')
const path = require('path')
const http = require('http')
const config = require('./config/config')
const { connectDB } = require('./database/sequelize')
const app = express()
const server = http.createServer(app)


app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, 'views')))

app.set('view engine', 'ejs')

require('./middlewares/index')(app)

require('./middlewares/routes')(app)

const { errorLoggingMiddleware } = require('./middlewares/logging');
app.use(errorLoggingMiddleware);

// Start server with database connection
const startServer = async () => {
  try {
    // Connect to PostgreSQL database first
    const dbConnected = await connectDB();
    
    // Start the server 
    server.listen(config.PORT || 3000, () => {
      console.log(`Server is running on port: ${config.PORT || 3000}`);
    });
    
  } catch (error) {
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
};

// Start the application
startServer();
