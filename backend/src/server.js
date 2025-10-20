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
  await connectDB();
  
  // Seed test users in development
  if (process.env.NODE_ENV === 'development') {
    await seedTestUsers();
  }

  // Start server
  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    logger.info(`API URL: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
  });

  return server;
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
