/**
 * Aspects Routes
 * Endpoints for retrieving planetary aspects
 */

const express = require('express');
const router = express.Router();
const aspectsController = require('../controllers/aspectsController');

/**
 * @route GET /aspects
 * @description Get current planetary aspects
 * @access Public
 */
router.get('/', aspectsController.getCurrentAspects);

/**
 * @route GET /aspects/:date
 * @description Get aspects for a specific date (ISO format)
 * @access Public
 */
router.get('/:date', aspectsController.getAspectsForDate);

/**
 * @route GET /aspects/strength/:threshold
 * @description Get aspects with strength above the specified threshold
 * @access Public
 */
router.get('/strength/:threshold', aspectsController.getAspectsByStrength);

module.exports = router;