/**
 * Logger Configuration
 * Uses Winston for logging with console and file transports
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');

// Determine logging level from environment or default to info
const level = process.env.LOG_LEVEL || 'info';

// Define log format with timestamp, error stack trace, and metadata
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json(),
  format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
);

// Define console format for readable logs in development
const consoleFormat = format.combine(
  format.colorize(),
  format.printf(
    ({ level, message, timestamp, stack, metadata }) => {
      // Include stack trace for errors and display relevant metadata
      const metaStr = Object.keys(metadata).length > 0 
        ? `\n${JSON.stringify(metadata, null, 2)}` 
        : '';
      
      return stack
        ? `${timestamp} ${level}: ${message}\n${stack}${metaStr}`
        : `${timestamp} ${level}: ${message}${metaStr}`;
    }
  )
);

// Set up transports (where logs will be sent)
const transportsArray = [
  // Console transport for all environments
  new transports.Console({
    level,
    format: consoleFormat
  })
];

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  // Log directory
  const logDir = path.join(process.cwd(), 'logs');
  
  // Add combined log file (all levels)
  transportsArray.push(
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      level,
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  
  // Add error log file (error level only)
  transportsArray.push(
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create and configure the logger
const logger = createLogger({
  level,
  format: logFormat,
  defaultMeta: { service: 'astronomical-service' },
  transports: transportsArray,
  // Handle exceptions and exit process on error
  exceptionHandlers: [
    new transports.Console({
      format: consoleFormat
    }),
    ...(process.env.NODE_ENV === 'production' 
      ? [new transports.File({ 
          filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
          format: logFormat
        })] 
      : [])
  ],
  exitOnError: false
});

// Log startup
logger.info(`Logger initialized in ${process.env.NODE_ENV || 'development'} environment`);

module.exports = logger;