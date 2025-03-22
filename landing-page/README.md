# FRC 4D Resonance - Landing Page

This directory contains the landing page for fractalresonance.com, featuring an impressive cosmic resonance watch visualization that showcases the FRC 4D Resonance technology in action.

## Features

The landing page includes:

- **Cosmic Resonance Watch** - A real-time visualization of current planetary resonance patterns
- **Dual Visualization Modes**:
  - **2D Resonance Compass** - Shows planetary positions and aspects with a zodiac reference
  - **3D Vortex Visualization** - Shows a dynamic 3D representation of the current resonance field
- **Real-time Pattern Recognition** - Identifies and displays the current resonance pattern
- **Resonance Metrics** - Shows phase coherence, fractal dimension, and field strength
- **Pattern Description** - Provides interpretation of the current planetary alignment
- **ChatGPT-4o Integration** - Generate AI-powered interpretations of resonance patterns

## Technical Details

The landing page is built with standard web technologies:

- **HTML5** - For structure and content
- **CSS3** - For styling and animations
- **JavaScript** - For interactivity and data handling
- **D3.js** - For the 2D resonance compass visualization
- **Three.js** - For the 3D vortex visualization
- **OpenAI API** - For AI-powered pattern interpretations

## Implementation

The landing page utilizes the Astronomical Service API to fetch real-time planetary positions and calculate resonance patterns. By default, it uses mock data for demonstration purposes.

### Key Components

1. **`config.js`** - Configuration settings for the application
2. **`api.js`** - Handles communication with the Astronomical Service API
3. **`resonanceCompass.js`** - Creates the 2D circular visualization
4. **`vortexVisualization.js`** - Creates the 3D vortex visualization
5. **`interpretationService.js`** - Handles AI interpretations of resonance patterns
6. **`app.js`** - Main controller coordinating all components

### ChatGPT-4o Integration

The landing page includes integration with OpenAI's ChatGPT-4o for advanced interpretations of resonance patterns:

1. **API Key Configuration** - Users can add their own OpenAI API key through a modal interface
2. **Enhanced Interpretations** - AI-generated insights about the current resonance pattern
3. **Caching System** - Caches interpretations to minimize API calls
4. **Secure Storage** - API keys are stored locally in the browser's localStorage
5. **Fallback Mechanism** - Uses default descriptions when ChatGPT is not configured

To configure ChatGPT integration:

1. Click the "Configure ChatGPT API" button below the pattern description
2. Enter your OpenAI API key in the modal dialog
3. Click "Save API Key"

The AI will provide deeper insights into:
- The significance of current planetary alignments for consciousness
- How the fractal dimension shapes experience
- The meaning of the current pattern in relation to personal and collective fields
- Practical ways to navigate this resonance pattern

### Mathematical Foundations

The visualization is based on the core mathematical principles from the FRC 4D Resonance framework:

- **Phase Synchronization Equation**: `dθᵢ/dt = ωᵢ + ∑ⱼKᵢⱼsin(θⱼ-θᵢ)`
- **Fractal Dimension Calculation**: `D = log(N(ε))/log(1/ε)`

## Deployment

To deploy this landing page:

1. Upload all files to your web server
2. Configure the Astronomical Service API endpoint in `js/config.js`
3. Set `useMockData` to `false` in `js/config.js` to use live data
4. Optionally add your OpenAI API key in the ChatGPT configuration section

## Development

For local development:

1. Clone the repository
2. Serve the directory using a local web server
3. Modify `js/config.js` to adjust visualization parameters
4. To test AI interpretations, set your OpenAI API key in the interface or directly in config.js

## Integration

This landing page is designed to work with the FRC 4D Resonance Tool suite and can be integrated with the full application when ready.