/**
 * Charts Routes
 * Endpoints for creating and retrieving natal and transit charts
 */

const express = require('express');
const router = express.Router();
const chartsController = require('../controllers/chartsController');

/**
 * @route POST /natal-chart
 * @description Generate a natal chart based on date, time, and location
 * @access Public
 * @body {datetime, latitude, longitude, location_name?}
 */
router.post('/natal-chart', chartsController.generateNatalChart);

/**
 * @route GET /natal-chart/:id
 * @description Get a saved natal chart by ID
 * @access Public
 */
router.get('/natal-chart/:id', chartsController.getNatalChart);

/**
 * @route POST /transit-chart
 * @description Calculate a transit chart (positions at a given time relative to a natal chart)
 * @access Public
 * @body {natal_chart_id, transit_datetime}
 */
router.post('/transit-chart', chartsController.calculateTransitChart);

module.exports = router;