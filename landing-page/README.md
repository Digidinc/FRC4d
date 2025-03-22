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

## Technical Details

The landing page is built with standard web technologies:

- **HTML5** - For structure and content
- **CSS3** - For styling and animations
- **JavaScript** - For interactivity and data handling
- **D3.js** - For the 2D resonance compass visualization
- **Three.js** - For the 3D vortex visualization

## Implementation

The landing page utilizes the Astronomical Service API to fetch real-time planetary positions and calculate resonance patterns. By default, it uses mock data for demonstration purposes.

### Key Components

1. **`config.js`** - Configuration settings for the application
2. **`api.js`** - Handles communication with the Astronomical Service API
3. **`resonanceCompass.js`** - Creates the 2D circular visualization
4. **`vortexVisualization.js`** - Creates the 3D vortex visualization
5. **`app.js`** - Main controller coordinating all components

### Mathematical Foundations

The visualization is based on the core mathematical principles from the FRC 4D Resonance framework:

- **Phase Synchronization Equation**: `dθᵢ/dt = ωᵢ + ∑ⱼKᵢⱼsin(θⱼ-θᵢ)`
- **Fractal Dimension Calculation**: `D = log(N(ε))/log(1/ε)`

## Deployment

To deploy this landing page:

1. Upload all files to your web server
2. Configure the Astronomical Service API endpoint in `js/config.js`
3. Set `useMockData` to `false` in `js/config.js` to use live data

## Development

For local development:

1. Clone the repository
2. Serve the directory using a local web server
3. Modify `js/config.js` to adjust visualization parameters

## Integration

This landing page is designed to work with the FRC 4D Resonance Tool suite and can be integrated with the full application when ready.