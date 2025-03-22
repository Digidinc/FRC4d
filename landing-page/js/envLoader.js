/**
 * Environment Variables Loader
 * Loads environment variables from a .env file
 */
class EnvLoader {
  constructor() {
    this.env = {};
    this.loaded = false;
  }

  /**
   * Load environment variables from .env file
   * @returns {Promise<Object>} - Environment variables object
   */
  async load() {
    if (this.loaded) {
      return this.env;
    }

    try {
      const response = await fetch('.env');
      
      // If .env file exists, parse it
      if (response.ok) {
        const text = await response.text();
        this.parseEnv(text);
        this.loaded = true;
        console.log('Environment variables loaded successfully');
      } else {
        console.warn('No .env file found. Using default or UI-provided values.');
      }
    } catch (error) {
      console.warn('Error loading .env file:', error);
    }

    return this.env;
  }

  /**
   * Parse environment variables from text content
   * @param {string} content - Content of .env file
   */
  parseEnv(content) {
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') {
        continue;
      }
      
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        
        this.env[key] = value;
      }
    }
  }

  /**
   * Get environment variable value
   * @param {string} key - Environment variable key
   * @param {string} defaultValue - Default value if not found
   * @returns {string} - Environment variable value
   */
  get(key, defaultValue = '') {
    return this.env[key] || defaultValue;
  }
}

// Create singleton instance
const envLoader = new EnvLoader();