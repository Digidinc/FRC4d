/**
 * Charts Controller
 * Handles requests for generating and retrieving natal and transit charts
 */

const logger = require('../utils/logger');
const db = require('../models');
const calculations = require('../utils/calculations');
const redisClient = require('../utils/redis');

/**
 * Generate a natal chart based on date, time, and location
 */
exports.generateNatalChart = async (req, res) => {
  try {
    const { datetime, latitude, longitude, location_name } = req.body;

    // Validate input parameters
    if (!datetime || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: datetime, latitude, longitude' 
      });
    }

    // Parse datetime string to ensure valid format
    const parsedDate = new Date(datetime);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid datetime format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)'
      });
    }

    // Validate latitude and longitude
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values'
      });
    }

    // Cache key for this chart
    const cacheKey = `natal_chart:${datetime}:${latitude}:${longitude}`;
    
    // Try to get from cache first
    const cachedChart = await redisClient.getCache(cacheKey);
    if (cachedChart) {
      logger.debug('Retrieved natal chart from cache');
      return res.json({ 
        success: true, 
        cached: true, 
        chart: cachedChart 
      });
    }

    // Calculate planetary positions
    const planets = await calculations.calculatePlanetaryPositions(parsedDate, latitude, longitude);
    
    // Calculate houses
    const houses = await calculations.calculateHouses(parsedDate, latitude, longitude);
    
    // Calculate aspects between planets
    const aspects = await calculations.calculatePlanetaryAspects(planets);

    // Create chart object
    const chart = {
      datetime: parsedDate.toISOString(),
      latitude,
      longitude,
      location_name: location_name || null,
      planets,
      houses,
      aspects,
      // Add additional FRC-specific data
      resonance_pattern: calculations.determineResonancePattern(planets, aspects),
      fractal_dimension: calculations.calculateChartFractalDimension(planets, aspects)
    };

    try {
      // Save to database
      const savedChart = await db.NatalChart.create({
        datetime: parsedDate,
        latitude,
        longitude,
        location_name,
        chart_data: chart
      });

      // Add ID to chart object
      chart.id = savedChart.id;
      
      // Cache the chart for 1 day
      await redisClient.setCache(cacheKey, chart, 86400);
      
      return res.status(201).json({ 
        success: true, 
        cached: false, 
        chart 
      });
    } catch (dbError) {
      logger.error('Database error saving natal chart', { error: dbError });
      
      // Still return the calculated chart even if saving to DB failed
      return res.json({ 
        success: true, 
        cached: false, 
        chart,
        warning: 'Chart was calculated but could not be saved to database'
      });
    }
  } catch (error) {
    logger.error('Error generating natal chart', { error });
    return res.status(500).json({ 
      success: false, 
      message: 'Error generating natal chart', 
      error: error.message 
    });
  }
};

/**
 * Get a saved natal chart by ID
 */
exports.getNatalChart = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to get from cache first
    const cacheKey = `natal_chart_id:${id}`;
    const cachedChart = await redisClient.getCache(cacheKey);
    if (cachedChart) {
      logger.debug('Retrieved natal chart by ID from cache');
      return res.json({ 
        success: true, 
        cached: true, 
        chart: cachedChart 
      });
    }

    // Find chart in database
    const chartRecord = await db.NatalChart.findByPk(id);
    
    if (!chartRecord) {
      return res.status(404).json({ 
        success: false, 
        message: 'Natal chart not found' 
      });
    }

    // Cache the chart for 1 day
    await redisClient.setCache(cacheKey, chartRecord.chart_data, 86400);

    return res.json({ 
      success: true, 
      cached: false, 
      chart: chartRecord.chart_data 
    });
  } catch (error) {
    logger.error('Error retrieving natal chart', { error });
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving natal chart', 
      error: error.message 
    });
  }
};

/**
 * Calculate a transit chart (positions at a given time relative to a natal chart)
 */
exports.calculateTransitChart = async (req, res) => {
  try {
    const { natal_chart_id, transit_datetime } = req.body;

    // Validate input parameters
    if (!natal_chart_id || !transit_datetime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: natal_chart_id, transit_datetime' 
      });
    }

    // Parse transit datetime string
    const parsedDate = new Date(transit_datetime);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transit_datetime format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)'
      });
    }

    // Cache key for this transit chart
    const cacheKey = `transit_chart:${natal_chart_id}:${transit_datetime}`;
    
    // Try to get from cache first
    const cachedChart = await redisClient.getCache(cacheKey);
    if (cachedChart) {
      logger.debug('Retrieved transit chart from cache');
      return res.json({ 
        success: true, 
        cached: true, 
        chart: cachedChart 
      });
    }

    // Get natal chart from database
    const natalChart = await db.NatalChart.findByPk(natal_chart_id);
    
    if (!natalChart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Natal chart not found' 
      });
    }

    // Extract natal chart data
    const { latitude, longitude, chart_data: natalChartData } = natalChart;

    // Calculate transit planetary positions
    const transitPlanets = await calculations.calculatePlanetaryPositions(
      parsedDate, 
      latitude, 
      longitude
    );
    
    // Calculate aspects between transit planets and natal planets
    const transitToNatalAspects = await calculations.calculateTransitAspects(
      transitPlanets, 
      natalChartData.planets
    );

    // Calculate aspects between transit planets
    const transitToTransitAspects = await calculations.calculatePlanetaryAspects(transitPlanets);

    // Create transit chart object
    const transitChart = {
      natal_chart_id,
      transit_datetime: parsedDate.toISOString(),
      transit_planets: transitPlanets,
      transit_to_natal_aspects: transitToNatalAspects,
      transit_to_transit_aspects: transitToTransitAspects,
      // Add FRC-specific calculations
      current_phase_sync: calculations.calculateCurrentPhaseSync(natalChartData.planets, transitPlanets),
      resonance_pattern: calculations.determineTransitResonancePattern(
        natalChartData.planets, 
        transitPlanets, 
        transitToNatalAspects
      ),
      vortex_strength: calculations.calculateVortexStrength(
        natalChartData.planets, 
        transitPlanets, 
        transitToNatalAspects
      )
    };
    
    // Cache the transit chart for 6 hours
    await redisClient.setCache(cacheKey, transitChart, 21600);

    return res.json({ 
      success: true, 
      cached: false, 
      chart: transitChart 
    });
  } catch (error) {
    logger.error('Error calculating transit chart', { error });
    return res.status(500).json({ 
      success: false, 
      message: 'Error calculating transit chart', 
      error: error.message 
    });
  }
};