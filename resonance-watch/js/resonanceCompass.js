/**
 * Resonance Compass Visualization
 * Creates and updates the circular planetary resonance visualization
 */
class ResonanceCompass {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.radius = Math.min(this.width, this.height) / 2 * 0.85;
        this.center = { x: this.width / 2, y: this.height / 2 };
        
        // Initialize SVG
        this.svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', `translate(${this.center.x}, ${this.center.y})`);
        
        // Create zodiac circles
        this.createZodiacRing();
        
        // Create placeholder for planets
        this.planetsGroup = this.svg.append('g')
            .attr('class', 'planets');
        
        // Create placeholder for aspects
        this.aspectsGroup = this.svg.append('g')
            .attr('class', 'aspects');
        
        // Create placeholder for field strength visualization
        this.fieldGroup = this.svg.append('g')
            .attr('class', 'field');
        
        // Create the field strength visualization
        this.createFieldVisualization();
        
        // Initialize with empty data
        this.planetaryData = null;
        this.aspectData = null;
    }
    
    /**
     * Create the zodiac ring with signs and degree markers
     */
    createZodiacRing() {
        const zodiacGroup = this.svg.append('g')
            .attr('class', 'zodiac');
        
        // Create the outer ring
        zodiacGroup.append('circle')
            .attr('r', this.radius)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(255, 255, 255, 0.1)')
            .attr('stroke-width', 2);
        
        // Create degree markers
        for (let i = 0; i < 360; i += 5) {
            const isMainDegree = i % 30 === 0;
            const markerLength = isMainDegree ? 10 : 5;
            const radians = (i - 90) * (Math.PI / 180);
            const x1 = (this.radius - markerLength) * Math.cos(radians);
            const y1 = (this.radius - markerLength) * Math.sin(radians);
            const x2 = this.radius * Math.cos(radians);
            const y2 = this.radius * Math.sin(radians);
            
            zodiacGroup.append('line')
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2)
                .attr('stroke', isMainDegree ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)')
                .attr('stroke-width', isMainDegree ? 2 : 1);
            
            // Add degree text for main degrees
            if (isMainDegree) {
                const textRadius = this.radius - 25;
                const textX = textRadius * Math.cos(radians);
                const textY = textRadius * Math.sin(radians);
                
                zodiacGroup.append('text')
                    .attr('x', textX)
                    .attr('y', textY)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', 'rgba(255, 255, 255, 0.5)')
                    .attr('font-size', '10px')
                    .text(i);
            }
        }
        
        // Add zodiac signs
        const zodiac = CONFIG.resonanceCompass.zodiac;
        
        zodiac.forEach(sign => {
            // Calculate the position for the zodiac symbol
            const centerDegree = sign.start + 15;
            const radians = (centerDegree - 90) * (Math.PI / 180);
            const symbolRadius = this.radius - 45;
            const x = symbolRadius * Math.cos(radians);
            const y = symbolRadius * Math.sin(radians);
            
            // Add the symbol
            zodiacGroup.append('text')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', this.getElementColor(sign.element))
                .attr('font-size', '16px')
                .text(sign.symbol);
            
            // Add sign boundaries
            const startRadians = (sign.start - 90) * (Math.PI / 180);
            const startX = this.radius * Math.cos(startRadians);
            const startY = this.radius * Math.sin(startRadians);
            
            zodiacGroup.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', startX)
                .attr('y2', startY)
                .attr('stroke', 'rgba(255, 255, 255, 0.1)')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '3,3');
        });
    }
    
    /**
     * Create the field strength visualization
     */
    createFieldVisualization() {
        // Create a radial gradient for the field
        const gradient = this.svg.append('defs')
            .append('radialGradient')
            .attr('id', 'field-gradient')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '50%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'var(--primary-color)')
            .attr('stop-opacity', 0.8);
        
        gradient.append('stop')
            .attr('offset', '70%')
            .attr('stop-color', 'var(--accent-color)')
            .attr('stop-opacity', 0.3);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'var(--accent-color)')
            .attr('stop-opacity', 0);
        
        // Create the field circle
        this.fieldCircle = this.fieldGroup.append('circle')
            .attr('r', this.radius * 0.7)
            .attr('fill', 'url(#field-gradient)')
            .attr('opacity', 0.5);
    }
    
    /**
     * Update the visualization with new data
     * @param {Object} planetaryData - Planetary position data
     * @param {Object} aspectData - Aspect data
     * @param {Object} resonanceData - Current resonance pattern data
     */
    update(planetaryData, aspectData, resonanceData) {
        this.planetaryData = planetaryData;
        this.aspectData = aspectData;
        
        // Update field strength visualization
        this.updateFieldStrength(resonanceData.fieldStrength);
        
        // Clear existing planets and aspects
        this.planetsGroup.selectAll('*').remove();
        this.aspectsGroup.selectAll('*').remove();
        
        // Draw aspects first (so they're behind planets)
        if (aspectData && aspectData.aspects) {
            this.drawAspects(aspectData.aspects);
        }
        
        // Draw planets
        if (planetaryData && planetaryData.planets) {
            this.drawPlanets(planetaryData.planets);
        }
    }
    
    /**
     * Update the field strength visualization
     * @param {number} fieldStrength - Field strength value (0-1)
     */
    updateFieldStrength(fieldStrength) {
        const minOpacity = CONFIG.resonanceCompass.fieldStrength.minOpacity;
        const maxOpacity = CONFIG.resonanceCompass.fieldStrength.maxOpacity;
        const opacity = minOpacity + (maxOpacity - minOpacity) * fieldStrength;
        
        // Animate the field strength change
        this.fieldCircle
            .transition()
            .duration(CONFIG.resonanceCompass.animation.duration)
            .ease(d3.easeCubic)
            .attr('opacity', opacity)
            .attr('r', this.radius * (0.5 + fieldStrength * 0.4));
    }
    
    /**
     * Draw planets on the compass
     * @param {Object} planets - Planetary data
     */
    drawPlanets(planets) {
        const planetEntries = Object.entries(planets);
        
        // Create a group for each planet
        const planetGroups = this.planetsGroup.selectAll('.planet')
            .data(planetEntries)
            .enter()
            .append('g')
            .attr('class', d => `planet ${d[0]}`)
            .attr('transform', d => {
                const longitude = d[1].longitude;
                const radians = (longitude - 90) * (Math.PI / 180);
                const distance = this.radius * 0.7; // 70% of the radius
                const x = distance * Math.cos(radians);
                const y = distance * Math.sin(radians);
                return `translate(${x}, ${y})`;
            });
        
        // Add planet circles
        planetGroups.append('circle')
            .attr('r', d => {
                const planet = d[0];
                const baseSize = 10;
                const sizeMultiplier = CONFIG.planets.sizes[planet] || 1;
                return baseSize * sizeMultiplier;
            })
            .attr('fill', 'var(--surface-color)')
            .attr('stroke', d => `var(--${d[0]}-color)`)
            .attr('stroke-width', 2);
        
        // Add planet symbols
        planetGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', d => `var(--${d[0]}-color)`)
            .attr('font-size', d => {
                const planet = d[0];
                const baseSize = 12;
                const sizeMultiplier = CONFIG.planets.sizes[planet] || 1;
                return `${baseSize * sizeMultiplier}px`;
            })
            .text(d => CONFIG.planets.symbols[d[0]] || '?');
        
        // Add longitude text
        planetGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .attr('y', 12)
            .attr('fill', 'rgba(255, 255, 255, 0.7)')
            .attr('font-size', '9px')
            .attr('font-family', 'Space Mono, monospace')
            .text(d => `${Math.round(d[1].longitude)}°`);
    }
    
    /**
     * Draw aspects between planets
     * @param {Array} aspects - Aspect data
     */
    drawAspects(aspects) {
        if (!this.planetaryData || !this.planetaryData.planets) return;
        
        aspects.forEach(aspect => {
            const planet1 = this.planetaryData.planets[aspect.planet1];
            const planet2 = this.planetaryData.planets[aspect.planet2];
            
            if (!planet1 || !planet2) return;
            
            // Calculate planet positions
            const radians1 = (planet1.longitude - 90) * (Math.PI / 180);
            const radians2 = (planet2.longitude - 90) * (Math.PI / 180);
            const distance = this.radius * 0.7; // Same as planet distance
            
            const x1 = distance * Math.cos(radians1);
            const y1 = distance * Math.sin(radians1);
            const x2 = distance * Math.cos(radians2);
            const y2 = distance * Math.sin(radians2);
            
            // Draw the aspect line
            this.aspectsGroup.append('line')
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2)
                .attr('stroke', this.getAspectColor(aspect.type))
                .attr('stroke-width', 1 + aspect.strength * 2)
                .attr('stroke-opacity', 0.3 + aspect.strength * 0.5)
                .attr('stroke-dasharray', this.getAspectDashArray(aspect.type));
        });
    }
    
    /**
     * Get color for zodiac element
     * @param {string} element - Element name (fire, earth, air, water)
     * @returns {string} - Color for the element
     */
    getElementColor(element) {
        const colors = {
            fire: '#F44336',
            earth: '#4CAF50',
            air: '#2196F3',
            water: '#9C27B0'
        };
        
        return colors[element] || 'white';
    }
    
    /**
     * Get color for aspect type
     * @param {string} aspectType - Aspect type
     * @returns {string} - Color for the aspect
     */
    getAspectColor(aspectType) {
        return `var(--${aspectType}-color)`;
    }
    
    /**
     * Get dash array for aspect line
     * @param {string} aspectType - Aspect type
     * @returns {string} - SVG dash array
     */
    getAspectDashArray(aspectType) {
        const dashArrays = {
            conjunction: '',
            opposition: '12,4',
            trine: '5,3',
            square: '3,3',
            sextile: '8,4,1,4'
        };
        
        return dashArrays[aspectType] || '';
    }
    
    /**
     * Resize the visualization
     */
    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.radius = Math.min(this.width, this.height) / 2 * 0.85;
        this.center = { x: this.width / 2, y: this.height / 2 };
        
        // Update SVG dimensions
        d3.select(this.container).select('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        
        this.svg.attr('transform', `translate(${this.center.x}, ${this.center.y})`);
        
        // If we have data, update to redraw with new dimensions
        if (this.planetaryData && this.aspectData) {
            this.update(this.planetaryData, this.aspectData);
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.resonanceCompass = new ResonanceCompass('resonance-compass');
    
    // Add window resize listener
    window.addEventListener('resize', () => {
        if (window.resonanceCompass) {
            window.resonanceCompass.resize();
        }
    });
});