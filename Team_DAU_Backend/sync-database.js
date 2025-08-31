const { sequelize } = require('./database/sequelize');

// Import all models to register them with Sequelize
const Producer = require('./model-route-services/producer/model');
const Certifier = require('./model-route-services/certifier/model');
const Buyer = require('./model-route-services/buyer/model');

async function syncDatabase() {
    try {
        console.log('Starting database synchronization...');
        
        // Test the connection first
        await sequelize.authenticate();
        console.log('Database connection verified');
        
        // Sync all models (this will create tables)
        await sequelize.sync({ force: false, alter: true });
        console.log('All tables synchronized successfully!');
        
        // List all models that were synced
        console.log('\Models synchronized:');
        console.log('- Producer');
        console.log('- Certifier'); 
        console.log('- Buyer');
        
        console.log('\Database setup completed successfully!');
        
    } catch (error) {
        console.error('Database sync failed:', error);
        throw error;
    }
}

// Run sync
syncDatabase()
    .then(() => {
        console.log('Sync completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Sync failed:', error);
        process.exit(1);
    });
