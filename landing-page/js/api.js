/**
 * API Service Module
 * Handles communication with external APIs
 */
class ApiService {
  constructor() {
    this.config = window.FRC4D_CONFIG || {};
    this.mockData = this.config.mockData || {};
    this.useMockData = this.config.useMockData || true;
  }

  /**
   * Initialize the API service
   * @returns {Promise<void>}
   */
  async initialize() {
    // Wait for API key manager to initialize
    await apiKeyManager.initialize();
  }

  /**
   * Get planetary positions
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - Planetary position data
   */
  async getPlanetaryPositions(options = {}) {
    if (this.useMockData) {
      return this._getMockData('planetaryPositions');
    }

    const url = this._buildUrl('planetaryPositions', options);
    return this._makeRequest(url);
  }

  /**
   * Get aspects between planets
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - Aspect data
   */
  async getAspects(options = {}) {
    if (this.useMockData) {
      return this._getMockData('aspects');
    }

    const url = this._buildUrl('aspects', options);
    return this._makeRequest(url);
  }

  /**
   * Get resonance patterns
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - Resonance pattern data
   */
  async getResonancePatterns(options = {}) {
    if (this.useMockData) {
      return this._getMockData('resonancePatterns');
    }

    const url = this._buildUrl('resonancePatterns', options);
    return this._makeRequest(url);
  }

  /**
   * Get phase synchronization data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - Phase synchronization data
   */
  async getPhaseSynchronization(options = {}) {
    if (this.useMockData) {
      return this._getMockData('phaseSynchronization');
    }

    const url = this._buildUrl('phaseSynchronization', options);
    return this._makeRequest(url);
  }

  /**
   * Get fractal dimension data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - Fractal dimension data
   */
  async getFractalDimension(options = {}) {
    if (this.useMockData) {
      return this._getMockData('fractalDimension');
    }

    const url = this._buildUrl('fractalDimension', options);
    return this._makeRequest(url);
  }

  /**
   * Get AI interpretation of resonance patterns
   * @param {Object} data - Data to interpret
   * @returns {Promise<Object>} - AI interpretation
   */
  async getAIInterpretation(data) {
    if (this.useMockData) {
      return this._getMockData('aiInterpretation');
    }

    // Get the OpenAI API key
    const apiKey = apiKeyManager.getKey('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key is required for AI interpretation');
    }

    const endpoint = this.config.chatGPT?.endpoint || 'https://api.openai.com/v1/chat/completions';
    const model = this.config.chatGPT?.model || 'gpt-4o';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: this.config.chatGPT?.systemPrompt || 'You are an expert in interpreting 4D fractal resonance patterns. Analyze the provided data and explain the significance of current planetary alignments, resonance patterns, and phase relationships in an insightful, mystical yet scientifically grounded manner.'
            },
            {
              role: 'user',
              content: `Please interpret the following 4D resonance data:\n${JSON.stringify(data, null, 2)}`
            }
          ],
          temperature: this.config.chatGPT?.temperature || 0.7,
          max_tokens: this.config.chatGPT?.maxTokens || 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      return {
        interpretation: result.choices[0].message.content,
        model: result.model,
        usage: result.usage
      };
    } catch (error) {
      console.error('Error getting AI interpretation:', error);
      return {
        interpretation: 'Unable to generate interpretation. Please check your API key and try again.',
        error: error.message
      };
    }
  }

  /**
   * Build URL for API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {string} - Full URL
   */
  _buildUrl(endpoint, options) {
    const baseUrl = this.config.api?.baseUrl || 'https://api.fractalresonance.com';
    const apiEndpoints = this.config.api?.endpoints || {};
    const endpointPath = apiEndpoints[endpoint] || `/${endpoint}`;
    
    const url = new URL(baseUrl + endpointPath);
    
    // Add query parameters
    if (options) {
      Object.keys(options).forEach(key => {
        if (options[key] !== undefined && options[key] !== null) {
          url.searchParams.append(key, options[key]);
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Make an API request
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} - Response data
   */
  async _makeRequest(url, options = {}) {
    try {
      // Add the API key if available
      const astroKey = apiKeyManager.getKey('astro');
      if (astroKey) {
        options.headers = options.headers || {};
        options.headers['X-API-Key'] = astroKey;
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error making API request to ${url}:`, error);
      throw error;
    }
  }

  /**
   * Get mock data for testing
   * @param {string} dataType - Type of mock data to retrieve
   * @returns {Object} - Mock data
   */
  _getMockData(dataType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData[dataType] || {});
      }, 300); // Simulate network delay
    });
  }
}

// Create singleton instance
const apiService = new ApiService();