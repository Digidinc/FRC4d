# FRC 4D Resonance Watch Landing Page

An immersive cosmic resonance visualization for the fractalresonance.com landing page, showcasing the FRC 4D Resonance Technology.

## Features

- **Real-time Resonance Visualization**: Display current planetary positions and resonance patterns
- **Dual Visualization Modes**:
  - Resonance Compass (2D): Shows planetary positions and aspects
  - Vortex Visualization (3D): Displays dynamic resonance field in 3D space
- **Pattern Recognition**: Identifies and names current resonance patterns
- **Metrics Display**: Shows phase coherence, fractal dimension, and field strength
- **AI-Powered Interpretation**: Uses ChatGPT-4o to provide meaningful insights on current resonance patterns

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript (no frameworks)
- **3D Visualization**: Three.js for vortex visualization
- **2D Visualization**: Canvas API for resonance compass
- **Responsive Design**: Works on desktop and mobile devices
- **Data Source**: Uses mock data by default, can connect to Astronomical Service API

## Setup & Usage

### Installation

1. Clone the repository
2. Navigate to the `landing-page` directory
3. Open `index.html` in a browser or serve with a local server

### Environment Configuration

The application uses environment variables for API keys:

1. Create a `.env` file in the landing-page directory based on `.env.example`
2. Add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ASTRO_SERVICE_API_KEY=your_astro_service_api_key_here
   ```
3. The `.env` file is not committed to the repository (it's in `.gitignore`)

### Configuration Options

The application has a comprehensive configuration system in `js/config.js`:

- **API Endpoints**: Configure URLs for the Astronomical Service API
- **Visualization Settings**: Customize appearance and behavior of visualizations
- **Planetary Data**: Configure planets, their colors, sizes, and frequencies
- **Aspect Configuration**: Define aspects and their properties
- **Mock Data**: Default mock data for testing without API

### Using Real-Time Data

To use real astronomical data instead of mock data:

1. Set `useMockData: false` in `js/config.js`
2. Ensure your Astronomical Service API is running
3. Add your API key to the `.env` file

### Using AI Interpretation

The resonance watch includes AI-powered interpretation of patterns:

1. Add your OpenAI API key to the `.env` file
2. The system will automatically detect and use your API key
3. If no key is available, the application will use pre-generated interpretations

## Implementation

### Core Files

- `index.html`: Main HTML structure
- `styles.css`: All styling and responsive design
- `js/config.js`: Configuration options and mock data
- `js/envLoader.js`: Environment variables loader
- `js/apiKeyManager.js`: Secure API key handling
- `js/api.js`: API service to fetch data
- `js/app.js`: Main application controller
- `js/resonanceCompass.js`: 2D visualization
- `js/vortexVisualization.js`: 3D visualization
- `assets/logo.svg`: FRC logo

### Security Considerations

- API keys are never committed to the repository
- Keys are stored securely in the browser's localStorage
- Environment variables are loaded at runtime
- A visual interface for entering API keys is provided when needed

## Development

### Adding New Features

- Add new visualization modes in the visualization modules
- Extend the API service for new data endpoints
- Modify the configuration for different visualization parameters

### Extending the API Key Manager

The API key manager is designed to be extensible:

1. Add new key entries to `.env.example`
2. Update the `apiKeyManager.js` to recognize new key types
3. Update the UI prompt to include the new keys

## License

© 2025 Fractal Resonance Consortium. All rights reserved.