const app = require('./app');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');
const { seedTestUsers } = require('./utils/seedDatabase');

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Connect to database and seed test data
const startServer = async () => {
  try {
    // Connect to database with retry logic
    await connectDB();
    
    // Seed test users (check if already seeded first)
    try {
      const [users] = await require('./config/database').sequelize.query("SELECT COUNT(*) as count FROM users");
      if (users[0].count === 0) {
        logger.info('No users found, seeding database...');
        await seedTestUsers();
      } else {
        logger.info(`Database already has ${users[0].count} users, skipping seed`);
      }
    } catch (seedError) {
      logger.warn('Seed check/execution failed (non-critical):', seedError.message);
    }

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`API URL: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
      logger.info('Backend is ready to accept requests');
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer().then((server) => {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', err);
    server.close(() => {
      process.exit(1);
    });
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Process terminated');
    });
  });
}).catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
  });
});
