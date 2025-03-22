/**
 * Astronomical Service - Server Initialization
 * Starts the Express server and handles shutdown
 */

// Import dependencies
const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');
const redis = require('./utils/redis');
const swisseph = require('swisseph');

// Get port from environment or default to 4001
const port = process.env.PORT || 4001;

// Set the Swiss Ephemeris path
const ephePath = process.env.EPHE_PATH || './ephemeris';
swisseph.swe_set_ephe_path(ephePath);

// Log startup information
logger.info(`Setting Swiss Ephemeris path to: ${ephePath}`);
logger.info(`Node environment: ${process.env.NODE_ENV || 'development'}`);

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(port, () => {
  logger.info(`Astronomical Service listening on port ${port}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  // Handle specific listen errors
  switch (error.code) {
    case 'EACCES':
      logger.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown function
function shutdown() {
  logger.info('Shutting down server...');
  
  // Close server first, stop accepting new connections
  server.close((err) => {
    if (err) {
      logger.error('Error during server close', { error: err.message });
      process.exit(1);
    }
    
    logger.info('Server closed');
    
    // Close Redis connection
    redis.closeConnection();
    
    // Close database connections if needed
    // db.close();
    
    logger.info('Shutdown complete');
    process.exit(0);
  });
  
  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000); // 10 seconds
}

// Handle process termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { 
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
  // Don't shutdown for unhandled rejections, just log them
});