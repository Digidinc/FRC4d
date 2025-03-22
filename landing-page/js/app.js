/**
 * Main Application Controller
 * Coordinates all components and handles data updates
 */
class App {
  constructor() {
    // Load configuration
    this.config = CONFIG;
    
    // Create API service
    this.apiService = new ApiService(this.config);
    
    // Data state
    this.cosmicData = null;
    this.activeVisualization = 'resonanceCompass';
    
    // Bind methods
    this.handleVisualizationToggle = this.handleVisualizationToggle.bind(this);
    this.updateData = this.updateData.bind(this);
    this.updateMetrics = this.updateMetrics.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }
  
  /**
   * Initialize the application
   */
  async initialize() {
    console.log('Initializing FRC 4D Resonance Watch Landing Page...');
    
    // Create visualization components
    this.resonanceCompass = new ResonanceCompass(this.config);
    this.vortexVisualization = new VortexVisualization(this.config);
    
    // Set up visualization toggle
    this.setupVisualizationToggle();
    
    // Load initial data
    try {
      await this.updateData();
      
      // Start update interval
      this.startUpdateInterval();
      
      console.log('Initialization complete');
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }
  
  /**
   * Set up visualization toggle buttons
   */
  setupVisualizationToggle() {
    const toggleButtons = document.querySelectorAll('.vis-toggle');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetVis = button.getAttribute('data-target');
        this.handleVisualizationToggle(targetVis);
        
        // Update button states
        toggleButtons.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-target') === targetVis);
        });
      });
    });
  }
  
  /**
   * Handle visualization toggle
   * @param {string} visId - Visualization ID to activate
   */
  handleVisualizationToggle(visId) {
    if (this.activeVisualization === visId) return;
    
    // Store active visualization
    this.activeVisualization = visId;
    
    // Update visualization visibility
    const visualizations = ['resonanceCompass', 'vortexVisualization'];
    
    visualizations.forEach(vis => {
      const element = document.getElementById(vis);
      if (element) {
        element.classList.toggle('active-vis', vis === visId);
      }
    });
    
    // Initialize the visualization if it's active
    if (visId === 'resonanceCompass' && this.cosmicData) {
      this.resonanceCompass.update(this.cosmicData);
    } else if (visId === 'vortexVisualization' && this.cosmicData) {
      this.vortexVisualization.update(this.cosmicData);
    }
  }
  
  /**
   * Start data update interval
   */
  startUpdateInterval() {
    // Clear any existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Set new interval
    this.updateInterval = setInterval(
      this.updateData,
      this.config.generalConfig.updateInterval
    );
  }
  
  /**
   * Update cosmic resonance data
   */
  async updateData() {
    try {
      // Fetch new data
      const newData = await this.apiService.getCosmicResonanceData();
      
      // Store data
      this.cosmicData = newData;
      
      // Update UI metrics
      this.updateMetrics();
      
      // Update description
      this.updateDescription();
      
      // Update active visualization
      if (this.activeVisualization === 'resonanceCompass') {
        this.resonanceCompass.update(newData);
      } else if (this.activeVisualization === 'vortexVisualization') {
        this.vortexVisualization.update(newData);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  
  /**
   * Update UI metrics
   */
  updateMetrics() {
    if (!this.cosmicData) return;
    
    // Get elements
    const patternBadge = document.getElementById('patternBadge');
    const phaseCoherence = document.getElementById('phaseCoherence');
    const fractalDimension = document.getElementById('fractalDimension');
    const fieldStrength = document.getElementById('fieldStrength');
    
    // Update pattern badge
    if (patternBadge) {
      patternBadge.textContent = this.cosmicData.resonancePattern.id;
      
      // Remove all pattern classes
      const patterns = this.config.patternRecognitionConfig.patterns.map(p => p.id.toLowerCase());
      patterns.forEach(pattern => {
        patternBadge.classList.remove(`pattern-${pattern}`);
      });
      
      // Add current pattern class
      patternBadge.classList.add(`pattern-${this.cosmicData.resonancePattern.id.toLowerCase()}`);
    }
    
    // Update metrics with animation
    this.animateValue(
      phaseCoherence, 
      parseFloat(phaseCoherence.textContent), 
      this.cosmicData.phaseSynchronization.phaseCoherence, 
      2
    );
    
    this.animateValue(
      fractalDimension, 
      parseFloat(fractalDimension.textContent), 
      this.cosmicData.fractalDimension, 
      2
    );
    
    this.animateValue(
      fieldStrength, 
      parseInt(fieldStrength.textContent), 
      Math.round(this.cosmicData.resonancePattern.strength * 100), 
      0,
      '%'
    );
  }
  
  /**
   * Update pattern description
   */
  updateDescription() {
    if (!this.cosmicData) return;
    
    const patternDescription = document.getElementById('patternDescription');
    if (patternDescription) {
      patternDescription.textContent = this.cosmicData.resonancePattern.description;
    }
  }
  
  /**
   * Animate value change
   * @param {Element} element - DOM element to update
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} decimals - Number of decimal places
   * @param {string} suffix - Optional suffix to append
   */
  animateValue(element, start, end, decimals = 0, suffix = '') {
    if (!element) return;
    
    // Ensure start is a number
    start = isNaN(start) ? 0 : start;
    
    // Animation duration in ms
    const duration = this.config.generalConfig.dataTransitionDuration;
    const startTime = performance.now();
    
    // Animation function
    const updateValue = (timestamp) => {
      // Calculate progress
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate current value
      const value = start + (end - start) * progress;
      
      // Format value
      const formatted = value.toFixed(decimals) + suffix;
      
      // Update element
      element.textContent = formatted;
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    // Start animation
    requestAnimationFrame(updateValue);
  }
  
  /**
   * Clean up resources
   */
  cleanup() {
    // Clear update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Clean up visualizations
    if (this.vortexVisualization) {
      this.vortexVisualization.cleanup();
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.initialize();
  
  // Store app instance for potential cleanup
  window.resonanceApp = app;
});