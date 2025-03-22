/**
 * Planets Routes
 * Endpoints for retrieving planetary positions
 */

const express = require('express');
const router = express.Router();
const planetsController = require('../controllers/planetsController');

/**
 * @route GET /planets
 * @description Get current planetary positions
 * @access Public
 */
router.get('/', planetsController.getCurrentPlanetaryPositions);

/**
 * @route GET /planets/:date
 * @description Get planetary positions for a specific date (ISO format)
 * @access Public
 */
router.get('/:date', planetsController.getPlanetaryPositionsForDate);

/**
 * @route GET /planets/extended
 * @description Get extended planetary information including speed, declination, etc.
 * @access Public
 */
router.get('/extended', planetsController.getExtendedPlanetaryPositions);

module.exports = router;