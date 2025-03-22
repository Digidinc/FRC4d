/**
 * Calculations Routes
 * Endpoints for performing complex astronomical calculations
 */

const express = require('express');
const router = express.Router();
const calculationsController = require('../controllers/calculationsController');

/**
 * @route POST /calculations/phase-sync
 * @description Calculate phase synchronization using the FRC equation
 * @access Public
 * @body {theta_i, omega_i, couplings}
 */
router.post('/phase-sync', calculationsController.calculatePhaseSync);

/**
 * @route POST /calculations/resonance
 * @description Calculate resonance strength between two patterns
 * @access Public
 * @body {patternA, patternB}
 */
router.post('/resonance', calculationsController.calculateResonanceStrength);

/**
 * @route POST /calculations/fractal-dimension
 * @description Calculate fractal dimension of a pattern
 * @access Public
 * @body {pattern, epsilon}
 */
router.post('/fractal-dimension', calculationsController.calculateFractalDimension);

module.exports = router;