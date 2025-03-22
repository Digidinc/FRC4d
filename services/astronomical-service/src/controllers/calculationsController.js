/**
 * Calculations Controller
 * Handles requests for complex astronomical and resonance calculations
 */

const logger = require('../utils/logger');
const calculations = require('../utils/calculations');
const redisClient = require('../utils/redis');

/**
 * Calculate phase synchronization using the FRC equation
 * dθᵢ/dt = ωᵢ + ∑ⱼKᵢⱼsin(θⱼ-θᵢ)
 */
exports.calculatePhaseSync = async (req, res) => {
  try {
    const { theta_i, omega_i, couplings } = req.body;

    // Validate input parameters
    if (!theta_i || !omega_i || !couplings) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: theta_i, omega_i, couplings' 
      });
    }

    // Cache key based on input parameters
    const cacheKey = `phase_sync:${JSON.stringify({ theta_i, omega_i, couplings })}`;
    
    // Try to get from cache first
    const cachedResult = await redisClient.getCache(cacheKey);
    if (cachedResult) {
      logger.debug('Retrieved phase sync calculation from cache');
      return res.json({ 
        success: true, 
        cached: true, 
        result: cachedResult 
      });
    }

    // Calculate phase synchronization
    const result = calculations.calculatePhaseSync(theta_i, omega_i, couplings);
    
    // Cache the result for 1 hour
    await redisClient.setCache(cacheKey, result, 3600);

    return res.json({ 
      success: true, 
      cached: false, 
      result 
    });
  } catch (error) {
    logger.error('Error calculating phase synchronization', { error });
    return res.status(500).json({ 
      success: false, 
      message: 'Error calculating phase synchronization', 
      error: error.message 
    });
  }
};

/**
 * Calculate resonance strength between two patterns
 */
exports.calculateResonanceStrength = async (req, res) => {
  try {
    const { patternA, patternB } = req.body;

    // Validate input parameters
    if (!patternA || !patternB) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: patternA, patternB' 
      });
    }

    // Cache key based on input parameters
    const cacheKey = `resonance:${JSON.stringify({ patternA, patternB })}`;
    
    // Try to get from cache first
    const cachedResult = await redisClient.getCache(cacheKey);
    if (cachedResult) {
      logger.debug('Retrieved resonance calculation from cache');
      return res.json({ 
        success: true, 
        cached: true, 
        result: cachedResult 
      });
    }

    // Calculate resonance strength
    const resonanceStrength = calculations.calculateResonanceStrength(patternA, patternB);
    
    // Cache the result for 1 hour
    await redisClient.setCache(cacheKey, resonanceStrength, 3600);

    return res.json({ 
      success: true, 
      cached: false, 
      result: {
        resonanceStrength
      }
    });
  } catch (error) {
    logger.error('Error calculating resonance strength', { error });
    return res.status(500).json({ 
      success: false, 
      message: 'Error calculating resonance strength', 
      error: error.message 
    });
  }
};

/**
 * Calculate fractal dimension of a pattern
 */
exports.calculateFractalDimension = async (req, res) => {
  try {
    const { pattern, epsilon } = req.body;

    // Validate input parameters
    if (!pattern) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameter: pattern' 
      });
    }

    // Use default epsilon if not provided
    const epsilonValue = epsilon || 1.0;

    // Cache key based on input parameters
    const cacheKey = `fractal_dim:${JSON.stringify({ pattern, epsilonValue })}`;
    
    // Try to get from cache first
    const cachedResult = await redisClient.getCache(cacheKey);
    if (cachedResult) {
      logger.debug('Retrieved fractal dimension calculation from cache');
      return res.json({ 
        success: true, 
        cached: true, 
        result: cachedResult 
      });
    }

    // Calculate fractal dimension
    const fractalDimension = calculations.calculateFractalDimension(pattern, epsilonValue);
    
    // Cache the result for 1 day
    await redisClient.setCache(cacheKey, { fractalDimension }, 86400);

    return res.json({ 
      success: true, 
      cached: false, 
      result: {
        fractalDimension
      }
    });
  } catch (error) {
    logger.error('Error calculating fractal dimension', { error });
    return res.status(500).json({ 
      success: false, 
      message: 'Error calculating fractal dimension', 
      error: error.message 
    });
  }
};