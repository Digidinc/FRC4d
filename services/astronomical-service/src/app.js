/**
 * FRC Astronomical Service
 * Main application file
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

// Create Express app
const app = express();

// Trust proxy for proper client IP detection when behind a reverse proxy
app.set('trust proxy', 1);

// Parse JSON request bodies
app.use(express.json({ limit: '1mb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Compress responses
app.use(compression());

// Secure HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*').split(',');
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { 
    stream: { 
      write: message => logger.http(message.trim()) 
    } 
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rate limiter for API routes
if (process.env.NODE_ENV !== 'test') {
  app.use('/api', rateLimiter.standard);
}

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FRC Astronomical Service API'
}));

// API routes
app.use('/api', routes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;