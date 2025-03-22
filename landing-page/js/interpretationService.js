/**
 * Interpretation Service
 * Uses ChatGPT-4o to generate interpretations of resonance patterns
 */
class InterpretationService {
  constructor(config) {
    this.config = config.chatGptConfig;
    this.enabled = this.config.enabled;
    this.apiKey = this.config.apiKey;
    this.endpoint = this.config.endpoint;
    this.model = this.config.model;
    this.systemPrompt = this.config.systemPrompt;
    this.temperature = this.config.temperature;
    this.maxTokens = this.config.maxTokens;
    
    // Cache for interpretations to avoid repeated API calls
    this.interpretationCache = new Map();
    
    // Status flags
    this.isLoading = false;
    this.hasError = false;
    this.errorMessage = '';
  }
  
  /**
   * Check if the service is properly configured
   * @returns {boolean} - Whether the service is configured
   */
  isConfigured() {
    return this.enabled && this.apiKey && this.apiKey.trim() !== '';
  }
  
  /**
   * Generate a cache key for a specific data set
   * @param {Object} data - Resonance data
   * @returns {string} - Cache key
   */
  generateCacheKey(data) {
    const pattern = data.resonancePattern.id;
    const phaseCoherence = data.phaseSynchronization.phaseCoherence.toFixed(2);
    const fractalDimension = data.fractalDimension.toFixed(2);
    const aspectsKey = data.aspects.map(a => `${a.body1}-${a.body2}-${a.type}`).sort().join('|');
    
    return `${pattern}|${phaseCoherence}|${fractalDimension}|${aspectsKey}`;
  }
  
  /**
   * Prepare the data for the ChatGPT prompt
   * @param {Object} data - Resonance data
   * @returns {string} - Formatted data for prompt
   */
  prepareDataForPrompt(data) {
    const getPlanetName = (id) => {
      const planet = this.config.planetaryConfig?.bodies.find(p => p.id === id);
      return planet ? planet.name : id.charAt(0).toUpperCase() + id.slice(1);
    };
    
    // Format planetary positions
    const planetaryPositions = data.planetaryPositions.map(planet => {
      return `${getPlanetName(planet.id)}: ${planet.longitude.toFixed(1)}° (${this.getLongitudeSign(planet.longitude)})`;
    }).join('\n');
    
    // Format aspects
    const aspects = data.aspects.map(aspect => {
      return `${getPlanetName(aspect.body1)} ${this.getAspectSymbol(aspect.type)} ${getPlanetName(aspect.body2)} (orb: ${aspect.orb.toFixed(1)}°)`;
    }).join('\n');
    
    // Format resonance pattern data
    const pattern = data.resonancePattern;
    
    return `
PLANETARY POSITIONS:
${planetaryPositions}

ASPECTS:
${aspects}

RESONANCE METRICS:
Pattern: ${pattern.id}
Phase Coherence: ${data.phaseSynchronization.phaseCoherence.toFixed(2)}
Fractal Dimension: ${data.fractalDimension.toFixed(2)}
Field Strength: ${(pattern.strength * 100).toFixed(0)}%

CURRENT DESCRIPTION:
${pattern.description}

Please provide a deeper interpretation of this resonance pattern, focusing on:
1. The significance of the current planetary alignments for consciousness
2. How the fractal dimension of ${data.fractalDimension.toFixed(2)} shapes the experience
3. The meaning of the ${pattern.id} pattern in relation to personal and collective fields
4. Practical ways to navigate this resonance pattern
`;
  }
  
  /**
   * Get the zodiac sign for a longitude value
   * @param {number} longitude - Longitude in degrees
   * @returns {string} - Zodiac sign
   */
  getLongitudeSign(longitude) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const normalizedLongitude = ((longitude % 360) + 360) % 360; // Ensure positive value
    const signIndex = Math.floor(normalizedLongitude / 30);
    return signs[signIndex];
  }
  
  /**
   * Get symbol for aspect type
   * @param {string} aspectType - Type of aspect
   * @returns {string} - Symbol representation
   */
  getAspectSymbol(aspectType) {
    const symbols = {
      'conjunction': '☌',
      'opposition': '☍',
      'trine': '△',
      'square': '□',
      'sextile': '⚹'
    };
    return symbols[aspectType] || aspectType;
  }
  
  /**
   * Get an interpretation for the provided resonance data
   * @param {Object} data - Resonance data
   * @returns {Promise<string>} - Interpretation text
   */
  async getInterpretation(data) {
    if (!this.isConfigured()) {
      return this.getDefaultInterpretation(data);
    }
    
    // Reset status
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    
    // Check cache first
    const cacheKey = this.generateCacheKey(data);
    if (this.interpretationCache.has(cacheKey)) {
      this.isLoading = false;
      return this.interpretationCache.get(cacheKey);
    }
    
    try {
      const prompt = this.prepareDataForPrompt(data);
      const response = await this.callChatGptApi(prompt);
      
      // Cache the result
      this.interpretationCache.set(cacheKey, response);
      
      this.isLoading = false;
      return response;
    } catch (error) {
      console.error('Error generating interpretation:', error);
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = error.message || 'Error generating interpretation';
      
      // Fall back to default interpretation
      return this.getDefaultInterpretation(data);
    }
  }
  
  /**
   * Call the ChatGPT API
   * @param {string} prompt - User prompt
   * @returns {Promise<string>} - ChatGPT response
   */
  async callChatGptApi(prompt) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  /**
   * Get a default interpretation when API is not available
   * @param {Object} data - Resonance data
   * @returns {string} - Default interpretation
   */
  getDefaultInterpretation(data) {
    return data.resonancePattern.description;
  }
  
  /**
   * Update API key and enable the service
   * @param {string} apiKey - New OpenAI API key
   */
  updateApiKey(apiKey) {
    this.apiKey = apiKey;
    this.enabled = apiKey && apiKey.trim() !== '';
    
    // Clear cache when API key changes
    this.interpretationCache.clear();
    
    // Save to localStorage for persistence
    if (this.enabled) {
      try {
        localStorage.setItem('frc_chatgpt_api_key', apiKey);
      } catch (error) {
        console.warn('Could not save API key to localStorage:', error);
      }
    }
  }
  
  /**
   * Load API key from localStorage
   */
  loadApiKey() {
    try {
      const savedApiKey = localStorage.getItem('frc_chatgpt_api_key');
      if (savedApiKey) {
        this.updateApiKey(savedApiKey);
      }
    } catch (error) {
      console.warn('Could not load API key from localStorage:', error);
    }
  }
  
  /**
   * Clear the API key
   */
  clearApiKey() {
    this.apiKey = '';
    this.enabled = false;
    this.interpretationCache.clear();
    
    try {
      localStorage.removeItem('frc_chatgpt_api_key');
    } catch (error) {
      console.warn('Could not remove API key from localStorage:', error);
    }
  }
}