const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Test database connection with retry logic
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      logger.info('Database connection established successfully');
      
      // Wait a bit more to ensure tables are created from schema.sql
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify tables exist
      const [results] = await sequelize.query("SHOW TABLES");
      if (results.length === 0) {
        logger.warn('Database connected but no tables found. Waiting for schema initialization...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        logger.info(`Database ready with ${results.length} tables`);
      }
      
      return;
    } catch (error) {
      logger.warn(`Database connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        logger.info(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error('Unable to connect to database after multiple attempts:', error);
        process.exit(1);
      }
    }
  }
};

module.exports = { sequelize, connectDB };
