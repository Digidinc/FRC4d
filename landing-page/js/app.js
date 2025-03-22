/**
 * Main Application
 * Coordinates all components and handles data updates
 */
class App {
  constructor() {
    this.config = window.FRC4D_CONFIG || {};
    this.updateInterval = this.config.updateInterval || 60000; // Default: 1 minute
    this.dataTransitionDuration = this.config.dataTransitionDuration || 2000; // Default: 2 seconds
    this.currentView = 'compass'; // Default view
    this.intervalId = null;
    this.isLoading = false;
    this.lastUpdateTime = null;
    
    // Visualization components
    this.resonanceCompass = null;
    this.vortexVisualization = null;
    
    // Elements
    this.elements = {
      compassViewBtn: document.getElementById('compass-view-btn'),
      vortexViewBtn: document.getElementById('vortex-view-btn'),
      compassContainer: document.getElementById('resonance-compass'),
      vortexContainer: document.getElementById('vortex-visualization'),
      currentPattern: document.getElementById('current-pattern'),
      patternIntensity: document.getElementById('pattern-intensity'),
      phaseCoherence: document.getElementById('phase-coherence'),
      coherenceTrend: document.getElementById('coherence-trend'),
      fractalDimension: document.getElementById('fractal-dimension'),
      dimensionScale: document.getElementById('dimension-scale'),
      fieldStrength: document.getElementById('field-strength'),
      fieldType: document.getElementById('field-type'),
      patternDescription: document.getElementById('pattern-description')
    };
  }

  /**
   * Initialize the application
   */
  async initialize() {
    // Initialize environment and API services
    await this._initializeServices();
    
    // Initialize visualization components
    this._initializeVisualizations();
    
    // Setup event listeners
    this._setupEventListeners();
    
    // Load initial data
    await this.updateData();
    
    // Start update interval
    this._startUpdateInterval();
    
    console.log('FRC 4D Resonance Watch initialized successfully.');
  }

  /**
   * Initialize environment and API services
   * @returns {Promise<void>}
   */
  async _initializeServices() {
    try {
      // Load environment variables
      await envLoader.load();
      
      // Initialize API key manager
      await apiKeyManager.initialize();
      
      // Initialize API service
      await apiService.initialize();
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  }

  /**
   * Initialize visualization components
   */
  _initializeVisualizations() {
    // Initialize Resonance Compass
    this.resonanceCompass = new ResonanceCompass({
      container: this.elements.compassContainer,
      config: this.config
    });
    
    // Initialize Vortex Visualization
    this.vortexVisualization = new VortexVisualization({
      container: this.elements.vortexContainer,
      config: this.config
    });
  }

  /**
   * Setup event listeners
   */
  _setupEventListeners() {
    // View selection buttons
    this.elements.compassViewBtn.addEventListener('click', () => this.switchView('compass'));
    this.elements.vortexViewBtn.addEventListener('click', () => this.switchView('vortex'));
    
    // Window resize event
    window.addEventListener('resize', this._handleResize.bind(this));
  }

  /**
   * Handle window resize
   */
  _handleResize() {
    if (this.resonanceCompass) {
      this.resonanceCompass.resize();
    }
    
    if (this.vortexVisualization) {
      this.vortexVisualization.resize();
    }
  }

  /**
   * Switch between visualization views
   * @param {string} view - View to switch to ('compass' or 'vortex')
   */
  switchView(view) {
    if (view === this.currentView) return;
    
    this.currentView = view;
    
    // Update button active states
    this.elements.compassViewBtn.classList.toggle('active', view === 'compass');
    this.elements.vortexViewBtn.classList.toggle('active', view === 'vortex');
    
    // Show/hide containers
    this.elements.compassContainer.classList.toggle('hidden', view !== 'compass');
    this.elements.vortexContainer.classList.toggle('hidden', view !== 'vortex');
    
    // Trigger resize on the now-visible visualization
    if (view === 'compass' && this.resonanceCompass) {
      this.resonanceCompass.resize();
    } else if (view === 'vortex' && this.vortexVisualization) {
      this.vortexVisualization.resize();
    }
  }

  /**
   * Start automatic data update interval
   */
  _startUpdateInterval() {
    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Set new interval
    this.intervalId = setInterval(() => this.updateData(), this.updateInterval);
  }

  /**
   * Update data from API
   * @returns {Promise<void>}
   */
  async updateData() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      // Get planetary positions
      const planetaryData = await apiService.getPlanetaryPositions();
      
      // Get aspects
      const aspectsData = await apiService.getAspects();
      
      // Get resonance patterns
      const resonanceData = await apiService.getResonancePatterns();
      
      // Get phase synchronization
      const phaseData = await apiService.getPhaseSynchronization();
      
      // Get fractal dimension
      const dimensionData = await apiService.getFractalDimension();
      
      // Combine all data
      const combinedData = {
        planets: planetaryData,
        aspects: aspectsData,
        patterns: resonanceData,
        phase: phaseData,
        dimension: dimensionData,
        timestamp: new Date()
      };
      
      // Update visualizations with new data
      this._updateVisualizations(combinedData);
      
      // Update metrics display
      this._updateMetrics(combinedData);
      
      // Get AI interpretation if API key is available
      if (apiKeyManager.hasKey('openai')) {
        this._updateInterpretation(combinedData);
      }
      
      // Record last update time
      this.lastUpdateTime = new Date();
      
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Update visualizations with new data
   * @param {Object} data - Combined resonance data
   */
  _updateVisualizations(data) {
    // Update Resonance Compass
    if (this.resonanceCompass) {
      this.resonanceCompass.updateData(data);
    }
    
    // Update Vortex Visualization
    if (this.vortexVisualization) {
      this.vortexVisualization.updateData(data);
    }
  }

  /**
   * Update metrics display with new data
   * @param {Object} data - Combined resonance data
   */
  _updateMetrics(data) {
    // Extract data
    const { patterns, phase, dimension } = data;
    
    // Update pattern information
    if (patterns && patterns.currentPattern) {
      this._animateTextChange(this.elements.currentPattern, patterns.currentPattern.name);
      this._animateTextChange(this.elements.patternIntensity, `Intensity: ${Math.round(patterns.currentPattern.intensity * 100)}%`);
    }
    
    // Update phase coherence
    if (phase && phase.coherence) {
      this._animateNumberChange(this.elements.phaseCoherence, phase.coherence.toFixed(2));
      
      const trendSymbol = phase.coherenceTrend > 0 ? '↑' : phase.coherenceTrend < 0 ? '↓' : '–';
      this._animateTextChange(this.elements.coherenceTrend, `${trendSymbol} ${Math.abs(phase.coherenceTrend).toFixed(2)}`);
    }
    
    // Update fractal dimension
    if (dimension && dimension.value) {
      this._animateNumberChange(this.elements.fractalDimension, dimension.value.toFixed(2));
      this._animateTextChange(this.elements.dimensionScale, `Scale: 10^${dimension.scale}`);
    }
    
    // Update field strength
    if (patterns && patterns.fieldStrength) {
      this._animateNumberChange(this.elements.fieldStrength, patterns.fieldStrength.toFixed(2));
      this._animateTextChange(this.elements.fieldType, patterns.fieldType || 'Resonance Units');
    }
  }

  /**
   * Get and update AI interpretation of data
   * @param {Object} data - Combined resonance data
   */
  async _updateInterpretation(data) {
    try {
      // Get AI interpretation
      const interpretation = await apiService.getAIInterpretation(data);
      
      // Update interpretation text
      if (interpretation && interpretation.interpretation) {
        this._animateTextChange(this.elements.patternDescription, interpretation.interpretation);
      }
    } catch (error) {
      console.error('Error updating interpretation:', error);
    }
  }

  /**
   * Animate text change with fade transition
   * @param {HTMLElement} element - Element to update
   * @param {string} newText - New text content
   */
  _animateTextChange(element, newText) {
    if (!element) return;
    
    // Don't animate if text hasn't changed
    if (element.textContent === newText) return;
    
    // Create transition effect
    element.style.transition = `opacity ${this.dataTransitionDuration / 2000}s ease-in-out`;
    element.style.opacity = 0;
    
    // Update text after fade out
    setTimeout(() => {
      element.textContent = newText;
      element.style.opacity = 1;
    }, this.dataTransitionDuration / 2);
  }

  /**
   * Animate number change with counting effect
   * @param {HTMLElement} element - Element to update
   * @param {string} newValue - New number value as string
   */
  _animateNumberChange(element, newValue) {
    if (!element) return;
    
    const currentValue = parseFloat(element.textContent);
    const targetValue = parseFloat(newValue);
    
    // Don't animate if value hasn't changed
    if (currentValue === targetValue) return;
    
    const startTime = performance.now();
    const duration = this.dataTransitionDuration;
    
    // Animation frame function
    const updateFrame = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Calculate current value
      const currentVal = currentValue + (targetValue - currentValue) * easedProgress;
      
      // Update element with formatted value
      element.textContent = currentVal.toFixed(2);
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(updateFrame);
      } else {
        // Ensure final value is exactly as specified
        element.textContent = newValue;
      }
    };
    
    // Start animation
    requestAnimationFrame(updateFrame);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.initialize();
});