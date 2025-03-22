/**
 * Server Initialization
 * Starts the Express server and handles graceful shutdown
 */

require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./models');
const logger = require('./utils/logger');
const redisClient = require('./utils/redis');

// Get port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Track connections to handle graceful shutdown
const connections = {};
let connectionCounter = 0;

// Handle new connections
server.on('connection', (conn) => {
  const id = connectionCounter++;
  connections[id] = conn;
  
  conn.on('close', () => {
    delete connections[id];
  });
});

// Start the server
async function startServer() {
  try {
    // Initialize database connection
    if (process.env.NODE_ENV !== 'test') {
      await db.sequelize.authenticate();
      logger.info('Database connection established successfully');
      
      // Sync database models (don't force in production)
      if (process.env.NODE_ENV === 'development') {
        // In development, you can use sync with alter: true
        await db.sequelize.sync({ alter: true });
        logger.info('Database models synchronized (alter mode)');
      } else {
        // In production, just verify the connection without altering tables
        await db.sequelize.sync({ force: false });
        logger.info('Database models verified without altering tables');
      }
    }

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Graceful shutdown function
async function shutdown(signal) {
  logger.info(`${signal} received, starting graceful shutdown`);
  
  // Stop accepting new connections
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  // Close existing connections
  Object.keys(connections).forEach(key => {
    connections[key].destroy();
    delete connections[key];
  });
  
  try {
    // Close database connection
    if (db.sequelize) {
      await db.sequelize.close();
      logger.info('Database connection closed');
    }
    
    // Close Redis connection
    await redisClient.closeConnection();
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { error });
    process.exit(1);
  }
}

// Handle process signals for graceful shutdown
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error });
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
  shutdown('unhandledRejection');
});

// Start the server (unless we're running tests that import this file)
if (process.env.NODE_ENV !== 'test' || require.main === module) {
  startServer();
}

module.exports = { server, startServer, shutdown };