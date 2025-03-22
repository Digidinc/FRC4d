/**
 * API Routes Index
 * Centralizes and exports all route modules
 */

const express = require('express');
const router = express.Router();
const planetRoutes = require('./planets');
const aspectRoutes = require('./aspects');
const calculationRoutes = require('./calculations');
const chartRoutes = require('./charts');

// Map routes to their base paths
router.use('/planets', planetRoutes);
router.use('/aspects', aspectRoutes);
router.use('/calculations', calculationRoutes);
router.use('/charts', chartRoutes);

// API version and status route
router.get('/', (req, res) => {
  res.json({
    service: 'FRC Astronomical Service',
    version: process.env.SERVICE_VERSION || '0.1.0',
    status: 'operational',
    endpoints: {
      planets: '/planets',
      aspects: '/aspects',
      calculations: '/calculations',
      charts: '/charts'
    }
  });
});

module.exports = router;