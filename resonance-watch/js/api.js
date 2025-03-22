/**
 * API Service for the 4D Resonance Watch
 * Handles communication with the Astronomical Service API
 */
class ApiService {
    constructor() {
        this.baseUrl = CONFIG.api.baseUrl;
        this.endpoints = CONFIG.api.endpoints;
        this.cache = {};
        this.lastUpdate = null;
    }

    /**
     * Get the current planetary positions
     * @param {boolean} extended - Whether to include extended planet information
     * @param {Array} planets - Optional list of planets to include
     * @returns {Promise<Object>} - Planetary position data
     */
    async getPlanetaryPositions(extended = false, planets = null) {
        const url = new URL(`${this.baseUrl}${this.endpoints.planets}`);
        
        // Add query parameters
        if (extended) {
            url.searchParams.append('extended', 'true');
        }
        
        if (planets && Array.isArray(planets)) {
            url.searchParams.append('planets', planets.join(','));
        }
        
        try {
            const cacheKey = url.toString();
            
            // Check if we have a fresh cache (less than 1 minute old)
            if (this.cache[cacheKey] && 
                (Date.now() - this.cache[cacheKey].timestamp) < 60000) {
                return this.cache[cacheKey].data;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the result
            this.cache[cacheKey] = {
                data,
                timestamp: Date.now()
            };
            
            this.lastUpdate = new Date();
            
            return data;
        } catch (error) {
            console.error('Error fetching planetary positions:', error);
            
            // If we have cached data, return it as a fallback
            const cacheKey = url.toString();
            if (this.cache[cacheKey]) {
                console.log('Using cached data as fallback');
                return this.cache[cacheKey].data;
            }
            
            throw error;
        }
    }

    /**
     * Get aspects between planets for a given datetime
     * @param {string} datetime - ISO date string
     * @param {Array} aspectTypes - Types of aspects to include
     * @param {number} minStrength - Minimum aspect strength (0-1)
     * @returns {Promise<Object>} - Aspect data
     */
    async getAspects(datetime = null, aspectTypes = null, minStrength = CONFIG.aspects.minStrength) {
        const url = new URL(`${this.baseUrl}${this.endpoints.aspects}`);
        
        // Add query parameters
        if (datetime) {
            url.searchParams.append('datetime', datetime);
        }
        
        if (aspectTypes && Array.isArray(aspectTypes)) {
            url.searchParams.append('aspectTypes', aspectTypes.join(','));
        }
        
        url.searchParams.append('minStrength', minStrength.toString());
        
        try {
            const cacheKey = url.toString();
            
            // Check if we have a fresh cache (less than 1 minute old)
            if (this.cache[cacheKey] && 
                (Date.now() - this.cache[cacheKey].timestamp) < 60000) {
                return this.cache[cacheKey].data;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the result
            this.cache[cacheKey] = {
                data,
                timestamp: Date.now()
            };
            
            return data;
        } catch (error) {
            console.error('Error fetching aspects:', error);
            
            // If we have cached data, return it as a fallback
            const cacheKey = url.toString();
            if (this.cache[cacheKey]) {
                console.log('Using cached data as fallback');
                return this.cache[cacheKey].data;
            }
            
            throw error;
        }
    }

    /**
     * Calculate phase synchronization using the FRC equation
     * @param {number} theta_i - Initial phase
     * @param {number} omega_i - Natural frequency
     * @param {Array} couplings - Array of coupling objects
     * @returns {Promise<Object>} - Phase synchronization data
     */
    async calculatePhaseSync(theta_i, omega_i, couplings) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.phaseSync}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    theta_i,
                    omega_i,
                    couplings
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error calculating phase synchronization:', error);
            throw error;
        }
    }

    /**
     * Get current resonance pattern
     * Combines data from multiple endpoints to determine the current pattern
     * @returns {Promise<Object>} - Current resonance pattern data
     */
    async getCurrentResonancePattern() {
        try {
            // Get planetary positions and aspects
            const [positions, aspects] = await Promise.all([
                this.getPlanetaryPositions(true),
                this.getAspects()
            ]);
            
            // Calculate the phase coherence
            const phaseCoherence = this.calculatePhaseCoherence(positions);
            
            // Calculate fractal dimension
            const fractalDimension = this.calculateFractalDimension(positions);
            
            // Calculate field strength
            const fieldStrength = this.calculateFieldStrength(aspects);
            
            // Determine the dominant pattern type
            const patternType = this.determinePatternType(phaseCoherence, fractalDimension, fieldStrength);
            
            // Generate pattern description
            const description = this.generatePatternDescription(patternType, aspects, positions);
            
            return {
                patternType,
                description,
                phaseCoherence,
                fractalDimension,
                fieldStrength,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting current resonance pattern:', error);
            throw error;
        }
    }

    /**
     * Calculate phase coherence from planetary positions
     * @param {Object} positions - Planetary position data
     * @returns {number} - Phase coherence value (0-1)
     */
    calculatePhaseCoherence(positions) {
        // This is a simplified implementation
        // In production, this would use the phase synchronization equation from the astronomical service
        
        // Extract longitudes from positions
        const longitudes = Object.values(positions.planets || positions)
            .map(planet => planet.longitude);
        
        // Calculate the circular mean and standard deviation
        let sinSum = 0;
        let cosSum = 0;
        
        for (const longitude of longitudes) {
            const angle = longitude * (Math.PI / 180); // Convert to radians
            sinSum += Math.sin(angle);
            cosSum += Math.cos(angle);
        }
        
        const r = Math.sqrt(Math.pow(sinSum / longitudes.length, 2) + 
                           Math.pow(cosSum / longitudes.length, 2));
        
        // r is 0 for complete dispersion and 1 for complete concentration
        // We scale it to produce a reasonable range of values for our display
        return Math.min(0.95, Math.max(0.3, r * 1.2));
    }

    /**
     * Calculate fractal dimension from planetary positions
     * @param {Object} positions - Planetary position data
     * @returns {number} - Fractal dimension value
     */
    calculateFractalDimension(positions) {
        // This is a simplified calculation
        // In production, this would use the fractal dimension calculations from the astronomical service
        
        // For now, return a value in a reasonable range based on pattern structure
        const aspectCount = this.countMajorAspects(positions);
        const baseDimension = 1.3; // Minimum dimension
        const maxContribution = 1.4; // Maximum additional contribution
        
        return baseDimension + (aspectCount / 20) * maxContribution;
    }

    /**
     * Count major aspects between planets
     * @param {Object} positions - Planetary position data
     * @returns {number} - Number of aspects
     */
    countMajorAspects(positions) {
        const planets = Object.values(positions.planets || positions);
        let aspectCount = 0;
        
        // Check each planet pair for aspects
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const planet1 = planets[i];
                const planet2 = planets[j];
                
                const distance = Math.abs(planet1.longitude - planet2.longitude);
                const normalizedDistance = Math.min(distance, 360 - distance);
                
                // Check for major aspects with generous orbs
                const majorAspects = [0, 60, 90, 120, 180]; // Conjunction, sextile, square, trine, opposition
                for (const aspect of majorAspects) {
                    if (Math.abs(normalizedDistance - aspect) <= 10) {
                        aspectCount++;
                        break;
                    }
                }
            }
        }
        
        return aspectCount;
    }

    /**
     * Calculate field strength based on aspects
     * @param {Object} aspects - Aspect data
     * @returns {number} - Field strength value (0-1)
     */
    calculateFieldStrength(aspects) {
        if (!aspects || !aspects.aspects || !aspects.aspects.length) {
            return 0.5; // Default middle value
        }
        
        // Calculate average aspect strength
        const strengthSum = aspects.aspects.reduce((sum, aspect) => sum + aspect.strength, 0);
        const avgStrength = strengthSum / aspects.aspects.length;
        
        // Apply a logarithmic scaling to emphasize stronger aspects
        return Math.min(0.95, Math.max(0.3, 0.4 + Math.log10(1 + avgStrength * 9) / 2));
    }

    /**
     * Determine the pattern type based on resonance metrics
     * @param {number} phaseCoherence - Phase coherence value
     * @param {number} fractalDimension - Fractal dimension value
     * @param {number} fieldStrength - Field strength value
     * @returns {string} - Pattern type identifier
     */
    determinePatternType(phaseCoherence, fractalDimension, fieldStrength) {
        const thresholds = CONFIG.patternDetection.thresholds;
        
        // Simple threshold-based classification
        if (phaseCoherence > thresholds.alignment && fieldStrength > thresholds.alignment) {
            return 'ALIGNMENT';
        } else if (phaseCoherence < thresholds.dissonance) {
            return 'DISSONANCE';
        } else if (fractalDimension > 2.0 && fieldStrength > thresholds.emergence) {
            return 'EMERGENCE';
        } else if (fractalDimension > 2.2) {
            return 'ACCELERATION';
        } else if (fieldStrength > thresholds.amplification) {
            return 'AMPLIFICATION';
        } else if (phaseCoherence > thresholds.stabilization) {
            return 'STABILIZATION';
        } else if (fieldStrength < thresholds.dissolution) {
            return 'DISSOLUTION';
        } else {
            return 'TRANSITION';
        }
    }

    /**
     * Generate a description of the current pattern
     * @param {string} patternType - Pattern type identifier
     * @param {Object} aspects - Aspect data
     * @param {Object} positions - Planetary position data
     * @returns {string} - Human-readable pattern description
     */
    generatePatternDescription(patternType, aspects, positions) {
        // Find the strongest aspect
        const strongestAspect = aspects?.aspects?.reduce((strongest, aspect) => {
            return (!strongest || aspect.strength > strongest.strength) ? aspect : strongest;
        }, null);
        
        // Description templates
        const templates = {
            ALIGNMENT: [
                `Harmonic alignment of {{planet1}}-{{planet2}} in flow state configuration`,
                `Strong resonance field forming through {{aspect}} alignment`,
                `Coherent {{planet1}}-{{planet2}} pattern facilitating {{quality}} energy`
            ],
            DISSONANCE: [
                `Challenging interaction between {{planet1}} and {{planet2}} creates tension`,
                `Dissonant pattern requires integration of {{aspect}} energies`,
                `Complex frequency mismatch between planetary vortices`
            ],
            TRANSITION: [
                `Shifting field between {{planet1}} and {{planet2}} patterns`,
                `Transitional phase with {{aspect}} configuration emerging`,
                `Pattern evolution occurring through {{planet1}} movement`
            ],
            AMPLIFICATION: [
                `Intensification of {{aspect}} energy through resonance`,
                `Amplified {{planet1}}-{{planet2}} field creating strong {{quality}} potential`,
                `Growing field strength through harmonic reinforcement`
            ],
            DISSOLUTION: [
                `Dissolving {{aspect}} pattern releasing stored momentum`,
                `Fading coherence as {{planet1}} pattern diffuses`,
                `Energy distribution phase with decreasing field definition`
            ],
            EMERGENCE: [
                `New {{planet1}}-{{planet2}} pattern emerging from field dynamics`,
                `Fresh configuration forming with {{quality}} characteristics`,
                `Spontaneous pattern generation through {{aspect}} interaction`
            ],
            STABILIZATION: [
                `Stabilizing field with {{planet1}}-{{planet2}} as anchor points`,
                `Steady-state resonance through {{aspect}} configuration`,
                `Balanced energy distribution with sustainable field coherence`
            ],
            ACCELERATION: [
                `Rapid evolution of {{planet1}}-{{planet2}} relationship`,
                `Increasing momentum in {{aspect}} configuration`,
                `Accelerating field dynamics with phase velocity increase`
            ]
        };
        
        // Get a random template for the pattern type
        const template = templates[patternType][Math.floor(Math.random() * templates[patternType].length)];
        
        // If we don't have aspect data, return a generic description
        if (!strongestAspect) {
            return template
                .replace(/{{planet1}}/g, 'planetary')
                .replace(/{{planet2}}/g, 'vortex')
                .replace(/{{aspect}}/g, 'resonant')
                .replace(/{{quality}}/g, 'transformative');
        }
        
        // Get names of the planets in the strongest aspect
        const planet1 = strongestAspect.planet1 || 'planetary';
        const planet2 = strongestAspect.planet2 || 'vortex';
        
        // Get the aspect type
        const aspect = strongestAspect.type || 'resonant';
        
        // Determine energy quality based on aspect type
        const qualities = {
            conjunction: 'initiating',
            sextile: 'creative',
            square: 'dynamic',
            trine: 'flowing',
            opposition: 'integrative'
        };
        
        const quality = qualities[aspect] || 'transformative';
        
        // Replace placeholders in the template
        return template
            .replace(/{{planet1}}/g, planet1)
            .replace(/{{planet2}}/g, planet2)
            .replace(/{{aspect}}/g, aspect)
            .replace(/{{quality}}/g, quality);
    }
}

// Create a global instance of the API service
const apiService = new ApiService();