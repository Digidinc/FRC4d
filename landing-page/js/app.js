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
    
    // Create interpretation service
    this.interpretationService = new InterpretationService(this.config);
    
    // Data state
    this.cosmicData = null;
    this.activeVisualization = 'resonanceCompass';
    
    // Bind methods
    this.handleVisualizationToggle = this.handleVisualizationToggle.bind(this);
    this.updateData = this.updateData.bind(this);
    this.updateMetrics = this.updateMetrics.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.setupApiKeyForm = this.setupApiKeyForm.bind(this);
    this.handleApiKeySubmit = this.handleApiKeySubmit.bind(this);
  }
  
  /**
   * Initialize the application
   */
  async initialize() {
    console.log('Initializing FRC 4D Resonance Watch Landing Page...');
    
    // Load API key from storage
    this.interpretationService.loadApiKey();
    
    // Create visualization components
    this.resonanceCompass = new ResonanceCompass(this.config);
    this.vortexVisualization = new VortexVisualization(this.config);
    
    // Set up visualization toggle
    this.setupVisualizationToggle();
    
    // Set up API key form
    this.setupApiKeyForm();
    
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
   * Set up API key form and modal
   */
  setupApiKeyForm() {
    // Create API key form modal if it doesn't exist
    if (!document.getElementById('apiKeyModal')) {
      this.createApiKeyModal();
    }
    
    // Get form elements
    const apiKeyForm = document.getElementById('apiKeyForm');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeyModal = document.getElementById('apiKeyModal');
    const openApiKeyBtn = document.getElementById('openApiKeyModal');
    const closeApiKeyBtn = document.getElementById('closeApiKeyModal');
    const apiKeyStatus = document.getElementById('apiKeyStatus');
    
    // Set initial form values
    if (apiKeyInput && this.interpretationService.apiKey) {
      apiKeyInput.value = this.interpretationService.apiKey;
      if (apiKeyStatus) {
        apiKeyStatus.textContent = 'API Key: Configured';
        apiKeyStatus.classList.add('status-configured');
      }
    }
    
    // Add event listeners
    if (apiKeyForm) {
      apiKeyForm.addEventListener('submit', this.handleApiKeySubmit);
    }
    
    if (openApiKeyBtn) {
      openApiKeyBtn.addEventListener('click', () => {
        apiKeyModal.style.display = 'flex';
      });
    }
    
    if (closeApiKeyBtn) {
      closeApiKeyBtn.addEventListener('click', () => {
        apiKeyModal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === apiKeyModal) {
        apiKeyModal.style.display = 'none';
      }
    });
  }
  
  /**
   * Create API key modal dialog
   */
  createApiKeyModal() {
    const modal = document.createElement('div');
    modal.id = 'apiKeyModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Configure ChatGPT API</h3>
          <button id="closeApiKeyModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <p>Enter your OpenAI API key to enable ChatGPT-4o interpretations of the resonance patterns. Your API key will be stored locally in your browser.</p>
          <form id="apiKeyForm">
            <div class="form-group">
              <label for="apiKeyInput">API Key:</label>
              <input type="password" id="apiKeyInput" placeholder="sk-..." required>
            </div>
            <div class="button-group">
              <button type="submit" class="submit-button">Save API Key</button>
              <button type="button" id="clearApiKey" class="clear-button">Clear API Key</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add clear API key button event
    const clearApiKeyBtn = document.getElementById('clearApiKey');
    if (clearApiKeyBtn) {
      clearApiKeyBtn.addEventListener('click', () => {
        this.interpretationService.clearApiKey();
        const apiKeyInput = document.getElementById('apiKeyInput');
        if (apiKeyInput) {
          apiKeyInput.value = '';
        }
        const apiKeyStatus = document.getElementById('apiKeyStatus');
        if (apiKeyStatus) {
          apiKeyStatus.textContent = 'API Key: Not Configured';
          apiKeyStatus.classList.remove('status-configured');
        }
        
        // Update pattern description with default description
        if (this.cosmicData) {
          this.updateDescription();
        }
      });
    }
    
    // Add API key config button to UI
    const patternDescription = document.querySelector('.pattern-description');
    if (patternDescription) {
      const apiKeyButton = document.createElement('div');
      apiKeyButton.className = 'api-key-config';
      apiKeyButton.innerHTML = `
        <button id="openApiKeyModal" class="api-key-button">Configure ChatGPT API</button>
        <span id="apiKeyStatus" class="api-key-status">API Key: Not Configured</span>
      `;
      patternDescription.appendChild(apiKeyButton);
    }
    
    // Add modal styles
    if (!document.getElementById('modalStyles')) {
      const styles = document.createElement('style');
      styles.id = 'modalStyles';
      styles.textContent = `
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: var(--color-background-lighter);
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--color-border);
        }
        
        .modal-header h3 {
          margin: 0;
          color: var(--color-accent);
        }
        
        .close-button {
          background: none;
          border: none;
          color: var(--color-text);
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.25rem;
          border: 1px solid var(--color-border);
          background-color: rgba(0, 0, 0, 0.2);
          color: var(--color-text);
          font-family: monospace;
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
        }
        
        .submit-button, .clear-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          border: none;
        }
        
        .submit-button {
          background-color: var(--color-primary);
          color: white;
        }
        
        .clear-button {
          background-color: rgba(255, 59, 48, 0.7);
          color: white;
        }
        
        .api-key-config {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }
        
        .api-key-button {
          background-color: var(--color-primary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
        }
        
        .api-key-status {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        
        .status-configured {
          color: var(--jupiter-color);
        }
        
        .interpretation-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 3rem;
          margin-top: 1rem;
        }
        
        .spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: var(--color-accent);
          animation: spin 1s ease-in-out infinite;
          margin-right: 1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styles);
    }
  }
  
  /**
   * Handle API key form submission
   * @param {Event} event - Form submission event
   */
  handleApiKeySubmit(event) {
    event.preventDefault();
    
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeyModal = document.getElementById('apiKeyModal');
    const apiKeyStatus = document.getElementById('apiKeyStatus');
    
    if (apiKeyInput && apiKeyInput.value) {
      // Update API key in service
      this.interpretationService.updateApiKey(apiKeyInput.value);
      
      // Update UI
      if (apiKeyStatus) {
        apiKeyStatus.textContent = 'API Key: Configured';
        apiKeyStatus.classList.add('status-configured');
      }
      
      // Close modal
      if (apiKeyModal) {
        apiKeyModal.style.display = 'none';
      }
      
      // Update description with AI interpretation
      if (this.cosmicData) {
        this.updateDescription(true);
      }
    }
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
   * @param {boolean} forceAiUpdate - Force AI interpretation update
   */
  async updateDescription(forceAiUpdate = false) {
    if (!this.cosmicData) return;
    
    const patternDescription = document.getElementById('patternDescription');
    if (!patternDescription) return;
    
    // Only generate AI interpretation if API key is configured or force update is requested
    if (this.interpretationService.isConfigured() || forceAiUpdate) {
      // Show loading indicator
      this.showDescriptionLoading(patternDescription);
      
      try {
        // Get AI interpretation
        const interpretation = await this.interpretationService.getInterpretation(this.cosmicData);
        
        // Update description
        patternDescription.textContent = interpretation;
      } catch (error) {
        console.error('Error getting interpretation:', error);
        patternDescription.textContent = this.cosmicData.resonancePattern.description;
      } finally {
        // Hide loading indicator
        this.hideDescriptionLoading(patternDescription);
      }
    } else {
      // Use default description
      patternDescription.textContent = this.cosmicData.resonancePattern.description;
    }
  }
  
  /**
   * Show loading indicator for description
   * @param {Element} descriptionElement - Description element
   */
  showDescriptionLoading(descriptionElement) {
    // Save original text
    descriptionElement.dataset.originalText = descriptionElement.textContent;
    
    // Create loading indicator if it doesn't exist
    let loadingIndicator = document.querySelector('.interpretation-loading');
    if (!loadingIndicator) {
      loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'interpretation-loading';
      loadingIndicator.innerHTML = '<div class="spinner"></div><span>Generating AI interpretation...</span>';
      descriptionElement.parentNode.insertBefore(loadingIndicator, descriptionElement.nextSibling);
    } else {
      loadingIndicator.style.display = 'flex';
    }
    
    // Hide description temporarily
    descriptionElement.style.opacity = '0.5';
  }
  
  /**
   * Hide loading indicator for description
   * @param {Element} descriptionElement - Description element
   */
  hideDescriptionLoading(descriptionElement) {
    // Hide loading indicator
    const loadingIndicator = document.querySelector('.interpretation-loading');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    
    // Show description
    descriptionElement.style.opacity = '1';
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