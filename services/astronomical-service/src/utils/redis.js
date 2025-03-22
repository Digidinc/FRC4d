/**
 * Redis Cache Utility
 * Provides functions for caching data with Redis
 */

const Redis = require('ioredis');
const logger = require('./logger');

// Get Redis configuration from environment variables
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  // Retry strategy to handle Redis connection issues
  retryStrategy: (times) => {
    // Exponential backoff with max 30 seconds
    const delay = Math.min(times * 100, 30000);
    logger.info(`Redis connection retry attempt ${times} in ${delay}ms`);
    return delay;
  }
};

// Create Redis client
const redisClient = new Redis(redisConfig);

// Set up event handlers
redisClient.on('connect', () => {
  logger.info('Connected to Redis server');
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error', { error: err.message });
});

redisClient.on('reconnecting', () => {
  logger.info('Reconnecting to Redis server');
});

// Default TTL (time to live) for cache entries in seconds
const DEFAULT_TTL = process.env.REDIS_TTL || 3600; // 1 hour

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<Object|null>} - Cached data or null if not found
 */
async function getCache(key) {
  try {
    const data = await redisClient.get(key);
    
    if (!data) {
      logger.debug(`Cache miss for key: ${key}`);
      return null;
    }
    
    logger.debug(`Cache hit for key: ${key}`);
    return JSON.parse(data);
  } catch (error) {
    logger.error('Error getting data from cache', { error: error.message, key });
    return null;
  }
}

/**
 * Store data in cache
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {number} ttlInSeconds - Time to live in seconds (optional)
 * @returns {Promise<boolean>} - Success status
 */
async function setCache(key, data, ttlInSeconds = DEFAULT_TTL) {
  try {
    // Store data as JSON string
    const serializedData = JSON.stringify(data);
    
    // Set with expiration
    await redisClient.set(key, serializedData, 'EX', ttlInSeconds);
    
    logger.debug(`Cached data for key: ${key} (TTL: ${ttlInSeconds}s)`);
    return true;
  } catch (error) {
    logger.error('Error setting data in cache', { error: error.message, key });
    return false;
  }
}

/**
 * Delete specific key from cache
 * @param {string} key - Cache key to delete
 * @returns {Promise<boolean>} - Success status
 */
async function deleteCache(key) {
  try {
    const result = await redisClient.del(key);
    const success = result > 0;
    
    if (success) {
      logger.debug(`Deleted cache key: ${key}`);
    } else {
      logger.debug(`Cache key not found for deletion: ${key}`);
    }
    
    return success;
  } catch (error) {
    logger.error('Error deleting cache key', { error: error.message, key });
    return false;
  }
}

/**
 * Delete all keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., "planets:*")
 * @returns {Promise<number>} - Number of keys deleted
 */
async function deleteCachePattern(pattern) {
  try {
    // Use scan to find all matching keys (safer than KEYS command)
    const keys = [];
    let cursor = '0';
    
    do {
      // Scan for matching keys
      const result = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = result[0];
      
      // Add found keys to our list
      const matchingKeys = result[1];
      if (matchingKeys.length > 0) {
        keys.push(...matchingKeys);
      }
    } while (cursor !== '0');
    
    // Delete the keys in batches
    let totalDeleted = 0;
    
    if (keys.length > 0) {
      // Delete keys in chunks to avoid blocking Redis
      const CHUNK_SIZE = 100;
      for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
        const chunk = keys.slice(i, i + CHUNK_SIZE);
        const deleted = await redisClient.del(...chunk);
        totalDeleted += deleted;
      }
      
      logger.info(`Deleted ${totalDeleted} cache keys matching pattern: ${pattern}`);
    } else {
      logger.debug(`No cache keys found matching pattern: ${pattern}`);
    }
    
    return totalDeleted;
  } catch (error) {
    logger.error('Error deleting cache pattern', { error: error.message, pattern });
    return 0;
  }
}

/**
 * Flush the entire Redis database
 * @returns {Promise<boolean>} - Success status
 */
async function flushCache() {
  try {
    await redisClient.flushdb();
    logger.warn('Flushed entire Redis cache');
    return true;
  } catch (error) {
    logger.error('Error flushing cache', { error: error.message });
    return false;
  }
}

/**
 * Increment a counter in Redis
 * @param {string} key - Counter key
 * @param {number} increment - Amount to increment (default: 1)
 * @param {number} ttlInSeconds - Time to live in seconds (optional)
 * @returns {Promise<number|null>} - New counter value or null on error
 */
async function incrementCounter(key, increment = 1, ttlInSeconds = DEFAULT_TTL) {
  try {
    // Increment the counter
    const value = await redisClient.incrby(key, increment);
    
    // Set expiration if this is a new key
    if (value === increment) {
      await redisClient.expire(key, ttlInSeconds);
    }
    
    return value;
  } catch (error) {
    logger.error('Error incrementing counter', { error: error.message, key });
    return null;
  }
}

/**
 * Close the Redis connection
 */
function closeConnection() {
  redisClient.quit();
  logger.info('Redis connection closed');
}

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  flushCache,
  incrementCounter,
  closeConnection,
  redisClient
};