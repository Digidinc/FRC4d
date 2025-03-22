/**
 * Main Application Controller
 * Coordinates all components and handles data updates
 */
class App {
    constructor() {
        this.updateInterval = null;
        this.updateFrequency = CONFIG.api.updateFrequency;
        
        // Mock data for development (when API is not available)
        this.useMockData = true; // Set to false when API is ready
        
        // Track active visualization mode
        this.currentMode = 'resonance-compass';
        
        // Initialize the application
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        // Initialize date and time display
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        // Set up mode selector buttons
        this.initializeModeSelector();
        
        // Start data updates
        await this.updateData();
        this.startPeriodicUpdates();
        
        // Handle page visibility changes (pause updates when not visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopPeriodicUpdates();
            } else {
                this.startPeriodicUpdates();
                this.updateData(); // Immediate update when becoming visible
            }
        });
    }
    
    /**
     * Initialize mode selector buttons
     */
    initializeModeSelector() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                modeButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to the clicked button
                button.classList.add('active');
                
                // Update current mode
                this.currentMode = button.getAttribute('data-mode');
                
                // Handle mode change
                this.handleModeChange();
            });
        });
    }
    
    /**
     * Handle visualization mode change
     */
    handleModeChange() {
        // For now, we'll just log the mode change
        // In a full implementation, this would switch between different visualization components
        console.log(`Mode changed to: ${this.currentMode}`);
        
        // Example: Show/hide different visualization containers based on mode
        // This would be expanded in a real implementation
        if (this.currentMode === 'resonance-compass') {
            document.getElementById('resonance-compass').style.display = 'block';
            document.getElementById('vortex-visualization').style.display = 'none';
        } else if (this.currentMode === 'fractal-depth') {
            document.getElementById('resonance-compass').style.display = 'none';
            document.getElementById('vortex-visualization').style.display = 'block';
        }
    }
    
    /**
     * Start periodic data updates
     */
    startPeriodicUpdates() {
        if (!this.updateInterval) {
            this.updateInterval = setInterval(() => this.updateData(), this.updateFrequency);
        }
    }
    
    /**
     * Stop periodic data updates
     */
    stopPeriodicUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    /**
     * Update all data and visualizations
     */
    async updateData() {
        try {
            let planetaryData, aspectData, resonanceData;
            
            if (this.useMockData) {
                // Use mock data for development
                [planetaryData, aspectData, resonanceData] = await this.getMockData();
            } else {
                // Get data from API
                const now = new Date().toISOString();
                
                // Get planetary positions and aspects in parallel
                [planetaryData, aspectData] = await Promise.all([
                    apiService.getPlanetaryPositions(true),
                    apiService.getAspects(now)
                ]);
                
                // Get current resonance pattern
                resonanceData = await apiService.getCurrentResonancePattern();
            }
            
            // Update the UI with the new data
            this.updateUI(planetaryData, aspectData, resonanceData);
            
            // Update last updated time
            document.getElementById('last-updated').textContent = 'Just now';
            
            // Update visualization based on current mode
            this.updateVisualization(planetaryData, aspectData, resonanceData);
            
        } catch (error) {
            console.error('Error updating data:', error);
            document.getElementById('last-updated').textContent = 'Update failed';
        }
    }
    
    /**
     * Update the UI with new data
     */
    updateUI(planetaryData, aspectData, resonanceData) {
        // Update pattern name and description
        document.getElementById('pattern-name').textContent = 
            `[${resonanceData.patternType}]`;
        document.getElementById('pattern-description').textContent = 
            resonanceData.description;
        
        // Update resonance data values
        document.getElementById('phase-coherence').textContent = 
            resonanceData.phaseCoherence.toFixed(2);
        document.getElementById('fractal-dimension').textContent = 
            resonanceData.fractalDimension.toFixed(2);
        document.getElementById('field-strength').textContent = 
            resonanceData.fieldStrength.toFixed(2);
        
        // Update aspect list
        this.updateAspectList(aspectData);
    }
    
    /**
     * Update the visualization based on current mode
     */
    updateVisualization(planetaryData, aspectData, resonanceData) {
        // Update the resonance compass
        if (window.resonanceCompass) {
            window.resonanceCompass.update(planetaryData, aspectData, resonanceData);
        }
        
        // Update the vortex visualization
        if (window.vortexVisualization) {
            window.vortexVisualization.update(resonanceData);
        }
        
        // Future: Update other visualization modes when implemented
    }
    
    /**
     * Update the aspect list in the UI
     */
    updateAspectList(aspectData) {
        const aspectContainer = document.querySelector('.planet-aspects');
        aspectContainer.innerHTML = ''; // Clear current aspects
        
        // Sort aspects by strength (strongest first)
        const sortedAspects = [...aspectData.aspects]
            .sort((a, b) => b.strength - a.strength)
            .slice(0, 5); // Show top 5 aspects
        
        sortedAspects.forEach(aspect => {
            // Create aspect element
            const aspectElement = document.createElement('div');
            aspectElement.className = 'aspect';
            aspectElement.setAttribute('data-strength', aspect.strength.toFixed(2));
            
            // Create planets element
            const planetsElement = document.createElement('div');
            planetsElement.className = 'planets';
            
            // Add first planet
            const planet1Element = document.createElement('span');
            planet1Element.className = `planet ${aspect.planet1}`;
            planet1Element.textContent = CONFIG.planets.symbols[aspect.planet1] || aspect.planet1;
            planetsElement.appendChild(planet1Element);
            
            // Add aspect symbol
            const aspectTypeElement = document.createElement('span');
            aspectTypeElement.className = `aspect-type ${aspect.type}`;
            aspectTypeElement.textContent = CONFIG.aspects.types[aspect.type]?.symbol || aspect.type;
            planetsElement.appendChild(aspectTypeElement);
            
            // Add second planet
            const planet2Element = document.createElement('span');
            planet2Element.className = `planet ${aspect.planet2}`;
            planet2Element.textContent = CONFIG.planets.symbols[aspect.planet2] || aspect.planet2;
            planetsElement.appendChild(planet2Element);
            
            // Create aspect info element
            const aspectInfoElement = document.createElement('div');
            aspectInfoElement.className = 'aspect-info';
            
            // Add aspect name
            const aspectNameElement = document.createElement('div');
            aspectNameElement.className = 'aspect-name';
            aspectNameElement.textContent = `${aspect.planet1} ${aspect.type} ${aspect.planet2}`;
            aspectInfoElement.appendChild(aspectNameElement);
            
            // Add aspect degree
            const aspectDegreeElement = document.createElement('div');
            aspectDegreeElement.className = 'aspect-degree';
            aspectDegreeElement.textContent = `${aspect.angle.toFixed(1)}°`;
            aspectInfoElement.appendChild(aspectDegreeElement);
            
            // Add aspect strength bar
            const aspectStrengthBarElement = document.createElement('div');
            aspectStrengthBarElement.className = 'aspect-strength-bar';
            
            const fillElement = document.createElement('div');
            fillElement.className = 'fill';
            fillElement.style.width = `${aspect.strength * 100}%`;
            
            aspectStrengthBarElement.appendChild(fillElement);
            aspectInfoElement.appendChild(aspectStrengthBarElement);
            
            // Assemble aspect element
            aspectElement.appendChild(planetsElement);
            aspectElement.appendChild(aspectInfoElement);
            
            // Add to container
            aspectContainer.appendChild(aspectElement);
        });
    }
    
    /**
     * Update date and time display
     */
    updateDateTime() {
        const now = new Date();
        
        // Format date: Wed, Jun 21, 2023
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Format time: 14:25:36
        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        document.getElementById('current-date').textContent = dateStr;
        document.getElementById('current-time').textContent = timeStr;
    }
    
    /**
     * Get mock data for development
     * @returns {Array} - [planetaryData, aspectData, resonanceData]
     */
    async getMockData() {
        // Mock planetary positions
        const planetaryData = {
            planets: {
                sun: { name: 'Sun', longitude: 105.5, latitude: 0.0, speed: 0.98 },
                moon: { name: 'Moon', longitude: 210.3, latitude: 1.2, speed: 12.5 },
                mercury: { name: 'Mercury', longitude: 100.2, latitude: -1.5, speed: 1.2 },
                venus: { name: 'Venus', longitude: 98.7, latitude: 0.5, speed: 1.1 },
                mars: { name: 'Mars', longitude: 300.1, latitude: -0.8, speed: 0.5 },
                jupiter: { name: 'Jupiter', longitude: 225.8, latitude: 0.1, speed: 0.1 },
                saturn: { name: 'Saturn', longitude: 315.2, latitude: 0.0, speed: 0.05 },
                uranus: { name: 'Uranus', longitude: 30.5, latitude: 0.0, speed: 0.02 },
                neptune: { name: 'Neptune', longitude: 15.3, latitude: 0.0, speed: 0.01 },
                pluto: { name: 'Pluto', longitude: 285.7, latitude: 0.0, speed: 0.005 }
            }
        };
        
        // Mock aspect data
        const aspectData = {
            aspects: [
                { planet1: 'sun', planet2: 'jupiter', type: 'trine', angle: 120.3, strength: 0.92 },
                { planet1: 'moon', planet2: 'mars', type: 'square', angle: 89.7, strength: 0.78 },
                { planet1: 'venus', planet2: 'mercury', type: 'conjunction', angle: 2.3, strength: 0.86 },
                { planet1: 'saturn', planet2: 'pluto', type: 'square', angle: 90.5, strength: 0.71 },
                { planet1: 'sun', planet2: 'neptune', type: 'opposition', angle: 179.2, strength: 0.65 },
                { planet1: 'jupiter', planet2: 'uranus', type: 'sextile', angle: 61.1, strength: 0.55 }
            ]
        };
        
        // Mock resonance data
        const patternTypes = [
            'ALIGNMENT', 'DISSONANCE', 'TRANSITION', 'AMPLIFICATION',
            'DISSOLUTION', 'EMERGENCE', 'STABILIZATION', 'ACCELERATION'
        ];
        
        // Cycle through pattern types for testing
        const cycleMinutes = Math.floor(Date.now() / (1000 * 60)) % patternTypes.length;
        const patternType = patternTypes[cycleMinutes];
        
        // Generate resonance data
        const resonanceData = {
            patternType,
            description: this.generateMockDescription(patternType),
            phaseCoherence: 0.4 + Math.random() * 0.5,
            fractalDimension: 1.3 + Math.random() * 1.4,
            fieldStrength: 0.4 + Math.random() * 0.5,
            timestamp: new Date().toISOString()
        };
        
        return [planetaryData, aspectData, resonanceData];
    }
    
    /**
     * Generate a mock description for a pattern type
     * @param {string} patternType - Pattern type identifier
     * @returns {string} - Pattern description
     */
    generateMockDescription(patternType) {
        const descriptions = {
            ALIGNMENT: [
                'Harmonic alignment of Jupiter-Venus in flow state configuration',
                'Strong resonance field forming through trine alignment',
                'Coherent Sun-Jupiter pattern facilitating flowing energy'
            ],
            DISSONANCE: [
                'Challenging interaction between Moon and Mars creates tension',
                'Dissonant pattern requires integration of square energies',
                'Complex frequency mismatch between planetary vortices'
            ],
            TRANSITION: [
                'Shifting field between Venus and Mars patterns',
                'Transitional phase with square configuration emerging',
                'Pattern evolution occurring through Moon movement'
            ],
            AMPLIFICATION: [
                'Intensification of conjunction energy through resonance',
                'Amplified Mercury-Venus field creating strong creative potential',
                'Growing field strength through harmonic reinforcement'
            ],
            DISSOLUTION: [
                'Dissolving opposition pattern releasing stored momentum',
                'Fading coherence as Pluto pattern diffuses',
                'Energy distribution phase with decreasing field definition'
            ],
            EMERGENCE: [
                'New Jupiter-Uranus pattern emerging from field dynamics',
                'Fresh configuration forming with innovative characteristics',
                'Spontaneous pattern generation through sextile interaction'
            ],
            STABILIZATION: [
                'Stabilizing field with Saturn-Neptune as anchor points',
                'Steady-state resonance through trine configuration',
                'Balanced energy distribution with sustainable field coherence'
            ],
            ACCELERATION: [
                'Rapid evolution of Mars-Uranus relationship',
                'Increasing momentum in square configuration',
                'Accelerating field dynamics with phase velocity increase'
            ]
        };
        
        const options = descriptions[patternType] || descriptions.TRANSITION;
        return options[Math.floor(Math.random() * options.length)];
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});