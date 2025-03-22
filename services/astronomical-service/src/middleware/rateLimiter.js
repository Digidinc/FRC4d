/**
 * Rate Limiter Middleware
 * Implements rate limiting for API requests
 */

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const logger = require('../utils/logger');

// Initialize Redis client for rate limiting
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  keyPrefix: 'ratelimit:'
});

redisClient.on('error', (err) => {
  logger.error('Rate limiter Redis error', { error: err });
});

// Default rate limit settings
const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_REQUESTS = 100; // 100 requests per window

/**
 * Create a rate limiter middleware with customizable options
 * @param {Object} options - Configuration options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests per window
 * @param {string} options.keyPrefix - Prefix for Redis keys
 * @returns {Function} Express middleware
 */
const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || process.env.RATE_LIMIT_WINDOW_MS || DEFAULT_WINDOW_MS;
  const max = options.max || process.env.RATE_LIMIT_MAX_REQUESTS || DEFAULT_MAX_REQUESTS;
  const keyPrefix = options.keyPrefix || 'general:';

  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: keyPrefix
    }),
    windowMs: parseInt(windowMs),
    max: parseInt(max),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        limit: options.max,
        window: options.windowMs
      });
      
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.',
        retryAfter: Math.ceil(options.windowMs / 1000)
      });
    }
  });
};

// Export middleware creators for different endpoints
module.exports = {
  // General rate limiter for most endpoints
  standard: createRateLimiter({
    keyPrefix: 'standard:'
  }),
  
  // More permissive rate limiter for simple data endpoints
  relaxed: createRateLimiter({
    keyPrefix: 'relaxed:',
    max: process.env.RATE_LIMIT_RELAXED_MAX || 300
  }),
  
  // Stricter rate limiter for computationally expensive endpoints
  strict: createRateLimiter({
    keyPrefix: 'strict:',
    max: process.env.RATE_LIMIT_STRICT_MAX || 50
  }),
  
  // Custom rate limiter creation function
  create: createRateLimiter
};