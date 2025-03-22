/**
 * Astronomical Service - Main Application
 * Express server for the FRC 4D Resonance Tool
 */

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import utilities
const logger = require('./utils/logger');

// Create Express application
const app = express();

// Configure security middleware
app.use(helmet());

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Configure request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure request logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));

// Configure rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // default: 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // default: 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
  skip: (req) => {
    // Skip rate limiting for internal requests (if applicable)
    return req.ip === '127.0.0.1' || req.ip === '::1';
  }
});

// Apply rate limiting to all requests
app.use(limiter);

// Define routes
app.get('/', (req, res) => {
  res.json({
    name: 'Astronomical Service',
    version: process.env.SERVICE_VERSION || '0.1.0',
    status: 'running'
  });
});

// Import routes
const planetRoutes = require('./routes/planets');
const aspectRoutes = require('./routes/aspects');
const calculationRoutes = require('./routes/calculations');
const chartRoutes = require('./routes/charts');

// Use routes
app.use('/planets', planetRoutes);
app.use('/aspects', aspectRoutes);
app.use('/calculations', calculationRoutes);
app.use('/charts', chartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error', { 
    error: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Return appropriate error response
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';
  
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
});

// Not found middleware (must be after other routes)
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
});

// Export the app for server.js
module.exports = app;