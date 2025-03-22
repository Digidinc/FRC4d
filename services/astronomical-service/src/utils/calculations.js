/**
 * Astronomical Calculations Utility
 * Implements core mathematical functions for the FRC 4D Resonance Tool
 */

const swisseph = require('swisseph');
const logger = require('./logger');

/**
 * Calculate Julian day number for a given date
 * @param {Date|string} date - Date object or ISO string
 * @returns {number} - Julian day number
 */
function calculateJulianDay(date) {
  const d = date instanceof Date ? date : new Date(date);
  
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1; // JavaScript months are 0-based
  const day = d.getUTCDate();
  const hour = d.getUTCHours() + d.getUTCMinutes()/60 + d.getUTCSeconds()/3600;
  
  return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
}

/**
 * Calculate phase synchronization using the Kuramoto model
 * Implementation of the FRC phase synchronization equation: dθᵢ/dt = ωᵢ + ∑ⱼKᵢⱼsin(θⱼ-θᵢ)
 * 
 * @param {number} theta_i - Current phase of vortex i (in radians)
 * @param {number} omega_i - Natural frequency of vortex i
 * @param {Array} couplings - Array of objects with { j, theta_j, K_ij } values representing coupling with other vortices
 * @returns {number} - Phase change rate (dθᵢ/dt)
 */
function calculatePhaseSync(theta_i, omega_i, couplings) {
  // Start with natural frequency
  let dtheta_dt = omega_i;
  
  // Add coupling effects
  for (const coupling of couplings) {
    const { theta_j, K_ij } = coupling;
    
    // Apply the sine of the phase difference, weighted by coupling strength
    dtheta_dt += K_ij * Math.sin(theta_j - theta_i);
  }
  
  return dtheta_dt;
}

/**
 * Calculate coupling strength between two planets
 * @param {Object} planet1 - First planet object with position and properties
 * @param {Object} planet2 - Second planet object with position and properties
 * @returns {number} - Coupling strength between 0 and 1
 */
function calculateCouplingStrength(planet1, planet2) {
  // Get angular distance between planets
  const distance = Math.abs(planet1.longitude - planet2.longitude);
  const normalizedDistance = normalizeDistance(distance);
  
  // Calculate aspect strength based on distance
  const aspectStrength = calculateAspectStrength(normalizedDistance);
  
  // Get mass coefficients for both planets
  const massCoeff1 = getPlanetaryMassCoefficient(planet1.name);
  const massCoeff2 = getPlanetaryMassCoefficient(planet2.name);
  
  // Calculate coupling strength based on aspect strength and mass coefficients
  const couplingStrength = aspectStrength * Math.sqrt(massCoeff1 * massCoeff2);
  
  // Log the calculation for debugging
  logger.debug(`Coupling strength between ${planet1.name} and ${planet2.name}: ${couplingStrength.toFixed(4)}`);
  
  return couplingStrength;
}

/**
 * Normalize angular distance to account for the circular nature of the zodiac
 * @param {number} distance - Angular distance in degrees
 * @returns {number} - Normalized distance (shortest path between angles)
 */
function normalizeDistance(distance) {
  // Ensure the distance is the shorter of the two possible paths around the circle
  return Math.min(distance, 360 - distance);
}

/**
 * Calculate aspect strength based on angular distance
 * @param {number} distance - Normalized angular distance
 * @returns {number} - Aspect strength between 0 and 1
 */
function calculateAspectStrength(distance) {
  // Define aspect angles and orbs
  const aspects = [
    { angle: 0, orb: 10 },     // Conjunction
    { angle: 60, orb: 6 },     // Sextile
    { angle: 90, orb: 8 },     // Square
    { angle: 120, orb: 8 },    // Trine
    { angle: 180, orb: 10 }    // Opposition
  ];
  
  // Find the closest aspect
  let minDiff = 180;
  let closestAspect = null;
  
  for (const aspect of aspects) {
    const diff = Math.abs(distance - aspect.angle);
    if (diff < minDiff) {
      minDiff = diff;
      closestAspect = aspect;
    }
  }
  
  // If within orb, calculate strength (1 at exact aspect, 0 at edge of orb)
  if (minDiff <= closestAspect.orb) {
    return 1 - (minDiff / closestAspect.orb);
  }
  
  // Not within any aspect orb
  return 0;
}

/**
 * Get mass coefficient for planet (determines influence in coupling calculations)
 * @param {string} planetName - Name of the planet
 * @returns {number} - Mass coefficient
 */
function getPlanetaryMassCoefficient(planetName) {
  const coefficients = {
    sun: 1.0,
    moon: 0.8,
    mercury: 0.3,
    venus: 0.5,
    mars: 0.4,
    jupiter: 0.7,
    saturn: 0.6,
    uranus: 0.4,
    neptune: 0.3,
    pluto: 0.2
  };
  
  return coefficients[planetName.toLowerCase()] || 0.5;
}

/**
 * Calculate resonance strength between two patterns
 * Implementation of the resonance formula:
 * R(ΨA, ΨB) = |∫∫ω ΨA*(r,t,ω)ΨB(r,t,ω)drdω|²/∫∫ω|ΨA|²drdω∫∫ω|ΨB|²drdω
 * 
 * This is simplified to work with discrete data points.
 * 
 * @param {Object} patternA - First pattern data
 * @param {Object} patternB - Second pattern data
 * @returns {number} - Resonance strength between 0 and 1
 */
function calculateResonanceStrength(patternA, patternB) {
  // Convert patterns to frequency bins for comparison
  const freqBinsA = patternToFrequencyBins(patternA);
  const freqBinsB = patternToFrequencyBins(patternB);
  
  // Calculate overlap integral (numerator)
  let overlapSum = 0;
  
  // Calculate normalization factors (denominator parts)
  let normA = 0;
  let normB = 0;
  
  // For each frequency bin, calculate contribution to the integrals
  for (let i = 0; i < freqBinsA.length; i++) {
    // Complex conjugate of A multiplied by B (simplified as real numbers here)
    overlapSum += freqBinsA[i] * freqBinsB[i];
    
    // Squared magnitudes for normalization
    normA += freqBinsA[i] * freqBinsA[i];
    normB += freqBinsB[i] * freqBinsB[i];
  }
  
  // Apply the formula: |overlap|²/(normA * normB)
  const resonanceStrength = normA > 0 && normB > 0 ? 
    (overlapSum * overlapSum) / (normA * normB) : 0;
  
  return Math.min(1, Math.max(0, resonanceStrength));
}

/**
 * Convert a pattern to frequency bins for resonance calculations
 * @param {Object} pattern - Pattern data (planetary positions, aspects, etc.)
 * @returns {Array} - Array of frequency magnitudes
 */
function patternToFrequencyBins(pattern) {
  // Number of bins for the frequency representation
  const numBins = 360;
  const bins = new Array(numBins).fill(0);
  
  // If pattern contains planets, use their positions
  if (pattern.planets) {
    for (const [name, planet] of Object.entries(pattern.planets)) {
      const binIndex = Math.floor(planet.longitude) % 360;
      const weight = getPlanetaryMassCoefficient(name);
      bins[binIndex] += weight;
    }
  }
  
  // If pattern contains aspects, use them to modulate the bins
  if (pattern.aspects) {
    for (const aspect of pattern.aspects) {
      // Find the midpoint of the aspect
      const planet1 = pattern.planets[aspect.planet1];
      const planet2 = pattern.planets[aspect.planet2];
      
      if (planet1 && planet2) {
        // Calculate midpoint (handling the wrap-around at 360°)
        let midpoint = (planet1.longitude + planet2.longitude) / 2;
        if (Math.abs(planet1.longitude - planet2.longitude) > 180) {
          midpoint += 180;
        }
        midpoint = midpoint % 360;
        
        // Add the aspect influence to the bins
        const binIndex = Math.floor(midpoint);
        bins[binIndex] += aspect.strength * 0.5; // Scale aspect contribution
      }
    }
  }
  
  return bins;
}

/**
 * Calculate fractal dimension of a pattern using box counting algorithm
 * Implementation of the formula: D = log(N(ε))/log(1/ε)
 * 
 * @param {Object} pattern - Pattern data
 * @param {number} epsilon - Box size for counting algorithm
 * @returns {number} - Estimated fractal dimension
 */
function calculateFractalDimension(pattern, epsilon = 0.1) {
  // Extract points from pattern for box counting
  const points = [];
  
  // If pattern has planets, use their positions
  if (pattern.planets) {
    for (const planet of Object.values(pattern.planets)) {
      // Convert longitude and latitude to cartesian coordinates for box counting
      const x = Math.cos(planet.longitude * Math.PI / 180) * Math.cos(planet.latitude * Math.PI / 180);
      const y = Math.sin(planet.longitude * Math.PI / 180) * Math.cos(planet.latitude * Math.PI / 180);
      const z = Math.sin(planet.latitude * Math.PI / 180);
      
      points.push({ x, y, z });
    }
  }
  
  // If no points, cannot calculate dimension
  if (points.length === 0) {
    return 0;
  }
  
  // Use box counting with multiple scales to get better estimate
  const scales = [epsilon, epsilon*2, epsilon*4, epsilon*8];
  const counts = [];
  
  for (const scale of scales) {
    counts.push(countBoxes(points, scale));
  }
  
  // Calculate dimension from log-log slope
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  const n = scales.length;
  
  for (let i = 0; i < n; i++) {
    const x = Math.log(1/scales[i]);
    const y = Math.log(counts[i]);
    
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }
  
  // Linear regression slope formula
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  return Math.max(1, Math.min(3, slope)); // Limit to reasonable range
}

/**
 * Count number of boxes needed to cover points at given scale
 * Helper function for fractal dimension calculation
 * 
 * @param {Array} points - Array of 3D points
 * @param {number} scale - Box size
 * @returns {number} - Number of boxes needed
 */
function countBoxes(points, scale) {
  const boxes = new Set();
  
  for (const point of points) {
    // Convert coordinates to box indices
    const ix = Math.floor(point.x / scale);
    const iy = Math.floor(point.y / scale);
    const iz = Math.floor(point.z / scale);
    
    // Create a unique string key for this box
    const key = `${ix},${iy},${iz}`;
    boxes.add(key);
  }
  
  return boxes.size;
}

module.exports = {
  calculateJulianDay,
  calculatePhaseSync,
  calculateCouplingStrength,
  normalizeDistance,
  calculateAspectStrength,
  getPlanetaryMassCoefficient,
  calculateResonanceStrength,
  calculateFractalDimension
};