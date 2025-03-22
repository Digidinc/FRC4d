/**
 * ResonanceCompass Class
 * Creates a circular planetary resonance visualization using D3.js
 */
class ResonanceCompass {
  constructor(config) {
    this.config = config;
    this.resonanceCompassConfig = config.resonanceCompassConfig;
    this.planetaryConfig = config.planetaryConfig;
    this.aspectConfig = config.aspectConfig;
    
    this.containerSelector = this.resonanceCompassConfig.containerSelector;
    this.width = this.resonanceCompassConfig.width;
    this.height = this.resonanceCompassConfig.height;
    this.margin = this.resonanceCompassConfig.margin;
    
    this.radius = Math.min(this.width, this.height) / 2 - Math.max(
      this.margin.top, 
      this.margin.right, 
      this.margin.bottom, 
      this.margin.left
    );
    
    this.zodiacRingWidth = this.resonanceCompassConfig.zodiacRingWidth;
    this.zodiacSigns = this.resonanceCompassConfig.zodiacSigns;
    
    this.initialized = false;
    this.planetaryPositions = [];
    this.aspects = [];
    this.phaseData = null;
    
    this.transitionDuration = config.generalConfig.dataTransitionDuration;
  }
  
  /**
   * Initialize the compass visualization
   */
  initialize() {
    if (this.initialized) return;
    
    // Select container and create SVG
    const container = d3.select(this.containerSelector);
    
    // Clear any existing content
    container.html('');
    
    this.svg = container.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
    
    // Create gradient definitions
    this.createGradients();
    
    // Create compass elements
    this.createZodiacRing();
    this.createDegreeMarkers();
    this.createAspectContainer();
    this.createPlanetaryOrbits();
    this.createPlanetarySymbols();
    this.createResonanceField();
    
    this.initialized = true;
  }
  
  /**
   * Create gradient definitions
   */
  createGradients() {
    const defs = this.svg.append('defs');
    
    // Zodiac ring gradient
    const zodiacGradient = defs.append('radialGradient')
      .attr('id', 'zodiacGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    zodiacGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1a1a2e')
      .attr('stop-opacity', 0.8);
      
    zodiacGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#16213e')
      .attr('stop-opacity', 0.9);
    
    // Resonance field gradient
    const resonanceGradient = defs.append('radialGradient')
      .attr('id', 'resonanceGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    resonanceGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(99, 102, 241, 0.3)');
      
    resonanceGradient.append('stop')
      .attr('offset', '80%')
      .attr('stop-color', 'rgba(138, 43, 226, 0.05)');
      
    resonanceGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(138, 43, 226, 0)');
  }
  
  /**
   * Create the zodiac ring
   */
  createZodiacRing() {
    // Draw zodiac background
    this.svg.append('circle')
      .attr('class', 'zodiac-ring-bg')
      .attr('r', this.radius)
      .attr('fill', 'url(#zodiacGradient)')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 1);
    
    // Draw zodiac sign segments
    const segmentAngle = 360 / this.zodiacSigns.length;
    
    this.zodiacSegments = this.svg.append('g')
      .attr('class', 'zodiac-segments');
    
    this.zodiacSigns.forEach((sign, i) => {
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;
      
      const arc = d3.arc()
        .innerRadius(this.radius - this.zodiacRingWidth)
        .outerRadius(this.radius)
        .startAngle(this.degToRad(startAngle))
        .endAngle(this.degToRad(endAngle));
      
      this.zodiacSegments.append('path')
        .attr('d', arc)
        .attr('fill', 'none')
        .attr('stroke', sign.color)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.4);
      
      // Add zodiac sign symbol
      const symbolAngle = this.degToRad(startAngle + segmentAngle / 2);
      const symbolRadius = this.radius - this.zodiacRingWidth / 2;
      const x = Math.sin(symbolAngle) * symbolRadius;
      const y = -Math.cos(symbolAngle) * symbolRadius;
      
      this.zodiacSegments.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '14px')
        .attr('fill', sign.color)
        .text(sign.symbol);
    });
  }
  
  /**
   * Create degree markers
   */
  createDegreeMarkers() {
    this.degreeMarkers = this.svg.append('g')
      .attr('class', 'degree-markers');
    
    for (let i = 0; i < 360; i += 10) {
      const isMain = i % 30 === 0;
      const markerLength = isMain ? 10 : 5;
      const angle = this.degToRad(i);
      const innerRadius = this.radius - this.zodiacRingWidth;
      
      const x1 = Math.sin(angle) * innerRadius;
      const y1 = -Math.cos(angle) * innerRadius;
      const x2 = Math.sin(angle) * (innerRadius - markerLength);
      const y2 = -Math.cos(angle) * (innerRadius - markerLength);
      
      this.degreeMarkers.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', isMain ? 'white' : 'rgba(255, 255, 255, 0.4)')
        .attr('stroke-width', isMain ? 1.5 : 0.5);
      
      if (isMain) {
        const textRadius = innerRadius - markerLength - 10;
        const textX = Math.sin(angle) * textRadius;
        const textY = -Math.cos(angle) * textRadius;
        
        this.degreeMarkers.append('text')
          .attr('x', textX)
          .attr('y', textY)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-family', 'monospace')
          .attr('font-size', '10px')
          .attr('fill', 'rgba(255, 255, 255, 0.6)')
          .text(i + '°');
      }
    }
  }
  
  /**
   * Create a container for aspects
   */
  createAspectContainer() {
    this.aspectContainer = this.svg.append('g')
      .attr('class', 'aspect-lines');
  }
  
  /**
   * Create planetary orbits
   */
  createPlanetaryOrbits() {
    this.orbitsContainer = this.svg.append('g')
      .attr('class', 'planetary-orbits');
    
    this.planetaryConfig.bodies.forEach(planet => {
      if (planet.orbitRadius === 0) return; // Skip for the Sun
      
      this.orbitsContainer.append('circle')
        .attr('class', `orbit-${planet.id}`)
        .attr('r', this.calculateOrbitRadius(planet.orbitRadius))
        .attr('fill', 'none')
        .attr('stroke', 'var(--color-border)')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '2,2');
    });
  }
  
  /**
   * Create planetary symbols
   */
  createPlanetarySymbols() {
    this.planetsContainer = this.svg.append('g')
      .attr('class', 'planetary-symbols');
  }
  
  /**
   * Create the resonance field visualization
   */
  createResonanceField() {
    this.resonanceField = this.svg.append('circle')
      .attr('class', 'resonance-field')
      .attr('r', this.calculateOrbitRadius(this.planetaryConfig.bodies[this.planetaryConfig.bodies.length - 1].orbitRadius * 1.1))
      .attr('fill', 'url(#resonanceGradient)')
      .attr('opacity', 0.5);
  }
  
  /**
   * Calculate orbit radius from config value
   * @param {number} configRadius - Radius value from config
   * @returns {number} - Actual radius to use in SVG
   */
  calculateOrbitRadius(configRadius) {
    const innerRadius = this.radius - this.zodiacRingWidth;
    const maxPlanetOrbit = this.planetaryConfig.bodies.reduce((max, planet) => 
      Math.max(max, planet.orbitRadius), 0);
    
    return (configRadius / maxPlanetOrbit) * innerRadius * 0.85;
  }
  
  /**
   * Update the compass with new data
   * @param {Object} data - Resonance data object
   */
  update(data) {
    if (!this.initialized) {
      this.initialize();
    }
    
    this.planetaryPositions = data.planetaryPositions;
    this.aspects = data.aspects;
    this.phaseData = data.phaseSynchronization;
    
    this.updatePlanetaryPositions();
    this.updateAspects();
    this.pulseResonanceField(data.resonancePattern.strength);
  }
  
  /**
   * Update planetary positions on the compass
   */
  updatePlanetaryPositions() {
    // Join data for planets
    const planets = this.planetsContainer
      .selectAll('.planet-symbol')
      .data(this.planetaryPositions, d => d.id);
    
    // Remove old planets
    planets.exit().remove();
    
    // Add new planets
    const enterPlanets = planets.enter()
      .append('g')
      .attr('class', d => `planet-symbol planet-${d.id}`);
    
    // Add planet circles
    enterPlanets.append('circle')
      .attr('r', d => d.id === 'sun' ? 8 : 5)
      .attr('fill', d => {
        const planetConfig = this.planetaryConfig.bodies.find(p => p.id === d.id);
        return planetConfig ? planetConfig.color : '#ffffff';
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 0.5);
    
    // Add planet labels
    enterPlanets.append('text')
      .attr('x', 0)
      .attr('y', d => d.id === 'sun' ? 0 : -8)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '9px')
      .attr('fill', '#fff')
      .text(d => {
        const planetConfig = this.planetaryConfig.bodies.find(p => p.id === d.id);
        return planetConfig ? planetConfig.name.charAt(0) : '';
      });
    
    // Update all planets (existing and new)
    const allPlanets = enterPlanets.merge(planets);
    
    // Transition planets to their new positions
    allPlanets.transition()
      .duration(this.transitionDuration)
      .attr('transform', d => {
        if (d.id === 'sun') {
          return 'translate(0, 0)';
        }
        
        const planetConfig = this.planetaryConfig.bodies.find(p => p.id === d.id);
        if (!planetConfig) return 'translate(0, 0)';
        
        const orbitRadius = this.calculateOrbitRadius(planetConfig.orbitRadius);
        const angle = this.degToRad(d.longitude);
        const x = Math.sin(angle) * orbitRadius;
        const y = -Math.cos(angle) * orbitRadius;
        
        return `translate(${x}, ${y})`;
      });
  }
  
  /**
   * Update aspect lines between planets
   */
  updateAspects() {
    // Join data for aspects
    const aspects = this.aspectContainer
      .selectAll('.aspect-line')
      .data(this.aspects, d => `${d.body1}-${d.body2}-${d.type}`);
    
    // Remove old aspects
    aspects.exit().remove();
    
    // Add new aspects
    const enterAspects = aspects.enter()
      .append('line')
      .attr('class', d => `aspect-line aspect-${d.type}`);
    
    // Update all aspects (existing and new)
    const allAspects = enterAspects.merge(aspects);
    
    // Transition aspects to their new positions
    allAspects.transition()
      .duration(this.transitionDuration)
      .attr('x1', d => {
        const planet1 = this.planetaryPositions.find(p => p.id === d.body1);
        if (!planet1) return 0;
        
        const planetConfig = this.planetaryConfig.bodies.find(p => p.id === d.body1);
        if (!planetConfig) return 0;
        
        if (planetConfig.orbitRadius === 0) return 0;
        
        const orbitRadius = this.calculateOrbitRadius(planetConfig.orbitRadius);
        const angle = this.degToRad(planet1.longitude);
        return Math.sin(angle) * orbitRadius;
      })
      .attr('y1', d => {
        const planet1 = this.planetaryPositions.find(p => p.id === d.body1);
        if (!planet1) return 0;
        
        const planetConfig = this.planetaryConfig.bodies.find(p => p.id === d.body1);
        if (!planetConfig) return 0;
        
        if (planetConfig.orbitRadius === 0) return 0;
        
        const orbitRadius = this.calculateOrbitRadius(planetConfig.orbitRadius);
        const angle = this.degToRad(planet1.longitude);
        return -Math.cos(angle) * orbitRadius;
      })
      .attr('x2', d => {
        const planet2 = this.planetaryPositions.find(p => p.id === d.body2);
        if (!planet2) return 0;
        
        const planetConfig = this.planetaryConfig.bodies.find(p => p.id === d.body2);
        if (!planetConfig) return 0;
        
        if (planetConfig.orbitRadius === 0) return 0;
        
        const orbitRadius = this.calculateOrbitRadius(planetConfig.orbitRadius);
        const angle = this.degToRad(planet2.longitude);
        return Math.sin(angle) * orbitRadius;
      })
      .attr('y2', d => {
        const planet2 = this.planetaryPositions.find(p => p.id === d.body2);
        if (!planet2) return 0;
        
        const planetConfig = this.planetaryConfig.bodies.find(p => p.id === d.body2);
        if (!planetConfig) return 0;
        
        if (planetConfig.orbitRadius === 0) return 0;
        
        const orbitRadius = this.calculateOrbitRadius(planetConfig.orbitRadius);
        const angle = this.degToRad(planet2.longitude);
        return -Math.cos(angle) * orbitRadius;
      })
      .attr('stroke', d => {
        const aspectConfig = this.aspectConfig.types.find(a => a.name === d.type);
        return aspectConfig ? aspectConfig.color : '#ffffff';
      })
      .attr('stroke-width', d => {
        const aspectConfig = this.aspectConfig.types.find(a => a.name === d.type);
        return aspectConfig ? aspectConfig.lineWidth : 1;
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', d => d.type === 'conjunction' ? '0' : '3,2');
  }
  
  /**
   * Pulse the resonance field based on resonance strength
   * @param {number} strength - Resonance strength value (0-1)
   */
  pulseResonanceField(strength) {
    // Normalize strength to a reasonable range
    const pulseOpacity = 0.3 + (strength * 0.5);
    const pulseDuration = 3000 - (strength * 1000); // Faster pulse for higher strength
    
    // Create a repeating pulse animation
    this.resonanceField
      .transition()
      .duration(pulseDuration / 2)
      .attr('opacity', pulseOpacity)
      .transition()
      .duration(pulseDuration / 2)
      .attr('opacity', 0.2)
      .on('end', () => this.pulseResonanceField(strength));
  }
  
  /**
   * Convert degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} - Angle in radians
   */
  degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
}