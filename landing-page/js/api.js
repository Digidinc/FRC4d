/**
 * API Service for the FRC 4D Resonance Watch
 * Handles communication with the Astronomical Service API
 */
class ApiService {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.apiConfig.baseUrl;
    this.useMockData = config.generalConfig.useMockData;
    this.endpoints = config.apiConfig.endpoints;
    this.mockData = config.mockData;
  }

  /**
   * Generic fetch method with error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise} - Response data
   */
  async fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  /**
   * Get current planetary positions
   * @returns {Promise} - Planetary positions data
   */
  async getPlanetaryPositions() {
    if (this.useMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.mockData.planetaryPositions);
        }, 300);
      });
    }
    
    return this.fetchData(this.endpoints.planetaryPositions);
  }

  /**
   * Get current planetary aspects
   * @returns {Promise} - Aspects data
   */
  async getAspects() {
    if (this.useMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.mockData.aspects);
        }, 300);
      });
    }
    
    return this.fetchData(this.endpoints.aspects);
  }

  /**
   * Get current resonance pattern
   * @returns {Promise} - Resonance pattern data
   */
  async getResonancePattern() {
    if (this.useMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.mockData.resonancePattern);
        }, 300);
      });
    }
    
    return this.fetchData(this.endpoints.resonancePatterns);
  }

  /**
   * Get phase synchronization data
   * @returns {Promise} - Phase synchronization data
   */
  async getPhaseSynchronization() {
    if (this.useMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            phaseCoherence: this.mockData.resonancePattern.phaseCoherence,
            phaseCouplingMatrix: [
              [1.0, 0.3, 0.5, 0.2, 0.7, 0.4, 0.1, 0.3, 0.2, 0.1],
              [0.3, 1.0, 0.4, 0.6, 0.3, 0.2, 0.3, 0.1, 0.2, 0.1],
              [0.5, 0.4, 1.0, 0.5, 0.2, 0.3, 0.4, 0.2, 0.1, 0.2],
              [0.2, 0.6, 0.5, 1.0, 0.5, 0.4, 0.2, 0.3, 0.1, 0.1],
              [0.7, 0.3, 0.2, 0.5, 1.0, 0.7, 0.4, 0.3, 0.2, 0.3],
              [0.4, 0.2, 0.3, 0.4, 0.7, 1.0, 0.6, 0.5, 0.4, 0.3],
              [0.1, 0.3, 0.4, 0.2, 0.4, 0.6, 1.0, 0.7, 0.5, 0.4],
              [0.3, 0.1, 0.2, 0.3, 0.3, 0.5, 0.7, 1.0, 0.6, 0.5],
              [0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.5, 0.6, 1.0, 0.7],
              [0.1, 0.1, 0.2, 0.1, 0.3, 0.3, 0.4, 0.5, 0.7, 1.0]
            ]
          });
        }, 300);
      });
    }
    
    return this.fetchData(this.endpoints.phaseSynchronization);
  }

  /**
   * Get fractal dimension data
   * @returns {Promise} - Fractal dimension data
   */
  async getFractalDimension() {
    if (this.useMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ fractalDimension: this.mockData.resonancePattern.fractalDimension });
        }, 300);
      });
    }
    
    return this.fetchData(this.endpoints.fractalDimension);
  }

  /**
   * Get all cosmic resonance data at once
   * @returns {Promise} - Combined data
   */
  async getCosmicResonanceData() {
    try {
      const [
        planetaryPositions,
        aspects,
        resonancePattern,
        phaseSynchronization,
        fractalDimension
      ] = await Promise.all([
        this.getPlanetaryPositions(),
        this.getAspects(),
        this.getResonancePattern(),
        this.getPhaseSynchronization(),
        this.getFractalDimension()
      ]);
      
      return {
        planetaryPositions,
        aspects,
        resonancePattern,
        phaseSynchronization,
        fractalDimension: fractalDimension.fractalDimension
      };
    } catch (error) {
      console.error('Error fetching cosmic resonance data:', error);
      throw error;
    }
  }
}