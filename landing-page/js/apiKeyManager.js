/**
 * API Key Manager
 * Handles secure storage and retrieval of API keys
 */
class ApiKeyManager {
  constructor() {
    this.keys = {};
    this.storagePrefix = 'frc4d_api_';
  }

  /**
   * Initialize API key manager
   * Loads keys from environment variables, local storage, or prompts user
   * @returns {Promise<void>}
   */
  async initialize() {
    // Try to load from environment variables first
    await this.loadFromEnv();
    
    // Then try to load from local storage
    this.loadFromStorage();
    
    // Show UI for missing keys that are required
    this.checkRequiredKeys();
  }

  /**
   * Load API keys from environment variables
   * @returns {Promise<void>}
   */
  async loadFromEnv() {
    try {
      // Use the environment loader to get variables
      await envLoader.load();
      
      // Check for OpenAI API key
      const openaiKey = envLoader.get('OPENAI_API_KEY');
      if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
        this.setKey('openai', openaiKey);
      }
      
      // Check for Astronomical Service API key
      const astroKey = envLoader.get('ASTRO_SERVICE_API_KEY');
      if (astroKey && astroKey !== 'your_astro_service_api_key_here') {
        this.setKey('astro', astroKey);
      }
      
      // Add more keys as needed
      
    } catch (error) {
      console.warn('Error loading API keys from environment variables:', error);
    }
  }

  /**
   * Load API keys from local storage
   */
  loadFromStorage() {
    try {
      // Get all items from localStorage that start with our prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.storagePrefix)) {
          const apiName = key.replace(this.storagePrefix, '');
          const value = localStorage.getItem(key);
          if (value) {
            this.keys[apiName] = value;
          }
        }
      }
    } catch (error) {
      console.warn('Error loading API keys from storage:', error);
    }
  }

  /**
   * Check if required keys are present and prompt user if needed
   */
  checkRequiredKeys() {
    const requiredKeys = ['openai'];
    const missingKeys = requiredKeys.filter(key => !this.hasKey(key));
    
    if (missingKeys.length > 0) {
      this.showKeyInputUI(missingKeys);
    }
  }

  /**
   * Show UI for user to input missing API keys
   * @param {string[]} missingKeys - Array of missing key names
   */
  showKeyInputUI(missingKeys) {
    // Check if the API key modal already exists
    let modal = document.getElementById('api-key-modal');
    
    // If not, create it
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'api-key-modal';
      modal.className = 'api-key-modal';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'api-key-modal-content';
      
      const title = document.createElement('h2');
      title.textContent = 'API Keys Required';
      modalContent.appendChild(title);
      
      const description = document.createElement('p');
      description.textContent = 'Please enter the following API keys to enable all features:';
      modalContent.appendChild(description);
      
      const form = document.createElement('form');
      form.id = 'api-key-form';
      
      missingKeys.forEach(key => {
        const label = document.createElement('label');
        label.htmlFor = `${key}-api-key`;
        label.textContent = this.formatKeyName(key) + ' API Key:';
        
        const input = document.createElement('input');
        input.type = 'password';
        input.id = `${key}-api-key`;
        input.name = key;
        input.required = true;
        
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement('br'));
      });
      
      const saveButton = document.createElement('button');
      saveButton.type = 'submit';
      saveButton.textContent = 'Save Keys';
      form.appendChild(saveButton);
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        missingKeys.forEach(key => {
          const input = document.getElementById(`${key}-api-key`);
          if (input && input.value) {
            this.setKey(key, input.value);
          }
        });
        modal.style.display = 'none';
        window.location.reload(); // Reload to apply changes
      });
      
      modalContent.appendChild(form);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
    }
    
    // Show the modal
    modal.style.display = 'block';
  }

  /**
   * Format API key name for display
   * @param {string} keyName - API key name
   * @returns {string} - Formatted key name
   */
  formatKeyName(keyName) {
    return keyName.charAt(0).toUpperCase() + keyName.slice(1);
  }

  /**
   * Check if an API key exists
   * @param {string} name - API key name
   * @returns {boolean} - True if key exists
   */
  hasKey(name) {
    return !!this.keys[name];
  }

  /**
   * Get an API key
   * @param {string} name - API key name
   * @returns {string|null} - API key value or null if not found
   */
  getKey(name) {
    return this.keys[name] || null;
  }

  /**
   * Set an API key
   * @param {string} name - API key name
   * @param {string} value - API key value
   */
  setKey(name, value) {
    this.keys[name] = value;
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem(this.storagePrefix + name, value);
    } catch (error) {
      console.error('Error saving API key to storage:', error);
    }
  }

  /**
   * Clear an API key
   * @param {string} name - API key name
   */
  clearKey(name) {
    delete this.keys[name];
    
    // Remove from localStorage
    try {
      localStorage.removeItem(this.storagePrefix + name);
    } catch (error) {
      console.error('Error removing API key from storage:', error);
    }
  }
}

// Create singleton instance
const apiKeyManager = new ApiKeyManager();