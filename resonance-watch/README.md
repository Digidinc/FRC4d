# 4D Vortex Resonance Watch

A real-time visualization tool for the FRC 4D Resonance framework that displays planetary vortex patterns, aspect relationships, and resonance fields.

## Features

- **Resonance Compass**: Circular zodiac interface showing current planetary positions with aspects and field strength visualization
- **3D Vortex Visualization**: Animated particle system representing the current resonance field based on phase coherence and fractal dimension
- **Real-time Pattern Recognition**: Identifies and displays current resonance patterns (ALIGNMENT, TRANSITION, etc.) with descriptions
- **Multiple Visualization Modes**: Toggle between different experiences of the resonance field
- **Responsive Design**: Adapts to various screen sizes and devices

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Visualization Libraries**: 
  - D3.js for 2D Resonance Compass
  - Three.js for 3D Vortex Visualization
- **API Integration**: Connects to the Astronomical Service API for real-time data

## Installation

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/Digidinc/FRC4d.git
   ```
2. Navigate to the resonance-watch directory:
   ```
   cd FRC4d/resonance-watch
   ```
3. Open `index.html` in a modern browser

### Web Deployment

1. Upload all files in the `resonance-watch` directory to your web hosting
2. Ensure the Astronomical Service API is accessible from your domain
3. Update API configuration in `js/config.js` (set `useMockData` to false)

## API Integration

The application can work in two modes:

1. **Mock Data Mode**: Uses static data for testing (default)
2. **API Mode**: Connects to the Astronomical Service API for real-time data

To connect to the API:

1. Update the API base URL in `js/config.js`:
   ```javascript
   api: {
     baseUrl: 'https://your-api-domain.com/api/v1',
     // other settings...
   }
   ```
2. Set `useMockData` to `false` in `js/app.js`

## Core Mathematical Implementation

The visualization implements core FRC equations:

### Phase Synchronization

```javascript
// Implemented in api.js - calculatePhaseSync()
function calculatePhaseCoherence(planets) {
  // Sum of sine components and cosine components across all planets
  let sinSum = 0, cosSum = 0;
  
  planets.forEach(planet => {
    // Convert longitude to radians
    const angle = planet.longitude * Math.PI / 180;
    sinSum += Math.sin(angle);
    cosSum += Math.cos(angle);
  });
  
  // Calculate the resultant vector length and normalize
  const r = Math.sqrt(sinSum*sinSum + cosSum*cosSum) / planets.length;
  return r; // Value between 0-1
}
```

### Fractal Dimension Calculation

```javascript
// Implemented in api.js - calculateFractalDimension()
function calculateFractalDimension(aspectData, boxSizes) {
  // Implementation of box-counting algorithm for fractal dimension
  const slopes = [];
  
  for (let i = 1; i < boxSizes.length; i++) {
    const logSize1 = Math.log(1/boxSizes[i-1]);
    const logSize2 = Math.log(1/boxSizes[i]);
    const logCount1 = Math.log(countBoxes(aspectData, boxSizes[i-1]));
    const logCount2 = Math.log(countBoxes(aspectData, boxSizes[i]));
    
    const slope = (logCount2 - logCount1) / (logSize2 - logSize1);
    slopes.push(slope);
  }
  
  // Average the slopes to get the fractal dimension
  return slopes.reduce((sum, value) => sum + value, 0) / slopes.length;
}
```

## Usage

- Toggle between visualization modes using the buttons at the top
- Observe the current resonance pattern displayed at the top of the screen
- View active aspects and their strengths in the sidebar
- Real-time data updates automatically (default every 60 seconds)

## License

© 2023 Fractal Resonance Consortium