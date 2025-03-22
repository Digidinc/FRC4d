/**
 * Configuration for the FRC 4D Resonance Watch Landing Page
 */
const CONFIG = {
  // General configuration
  generalConfig: {
    useMockData: true, // Set to false to use real astronomical data
    updateInterval: 5000, // Update interval in milliseconds
    dataTransitionDuration: 1000, // Duration of transitions when data updates
  },
  
  // API configuration
  apiConfig: {
    baseUrl: '/services/astronomical-service/api', // Path to the Astronomical Service API
    endpoints: {
      planetaryPositions: '/planets/positions',
      aspects: '/aspects/current',
      resonancePatterns: '/calculations/resonance-patterns',
      phaseSynchronization: '/calculations/phase-sync',
      fractalDimension: '/calculations/fractal-dimension',
    },
  },
  
  // ChatGPT API configuration
  chatGptConfig: {
    apiKey: '', // Add your OpenAI API key here
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 600,
    enabled: false, // Set to true once API key is added
    systemPrompt: "You are an expert in fractal resonance patterns, consciousness vortices, and multidimensional mathematics. Interpret the provided planetary positions, aspects, and resonance metrics in terms of their meaning for human consciousness and perception. Your interpretations should be insightful, poetic, and reveal deeper patterns across scales. Connect astronomical patterns to archetypal fields and personal awareness."
  },
  
  // Planetary configuration
  planetaryConfig: {
    bodies: [
      { id: 'sun', name: 'Sun', color: '#ffcf6f', baseFrequency: 1.0, orbitRadius: 0 },
      { id: 'moon', name: 'Moon', color: '#dbdbdb', baseFrequency: 13.37, orbitRadius: 20 },
      { id: 'mercury', name: 'Mercury', color: '#a0a0a0', baseFrequency: 8.97, orbitRadius: 35 },
      { id: 'venus', name: 'Venus', color: '#e8bc8e', baseFrequency: 1.62, orbitRadius: 50 },
      { id: 'mars', name: 'Mars', color: '#e34a33', baseFrequency: 12.34, orbitRadius: 80 },
      { id: 'jupiter', name: 'Jupiter', color: '#e9a347', baseFrequency: 0.89, orbitRadius: 110 },
      { id: 'saturn', name: 'Saturn', color: '#c7a97e', baseFrequency: 0.36, orbitRadius: 140 },
      { id: 'uranus', name: 'Uranus', color: '#b2d3e8', baseFrequency: 0.12, orbitRadius: 170 },
      { id: 'neptune', name: 'Neptune', color: '#5b7ebd', baseFrequency: 0.06, orbitRadius: 200 },
      { id: 'pluto', name: 'Pluto', color: '#9c7a99', baseFrequency: 0.04, orbitRadius: 230 }
    ]
  },
  
  // Aspect configuration
  aspectConfig: {
    types: [
      { name: 'conjunction', angle: 0, orb: 8, color: '#ff9500', lineWidth: 2 },
      { name: 'opposition', angle: 180, orb: 8, color: '#ff3b30', lineWidth: 2 },
      { name: 'trine', angle: 120, orb: 6, color: '#4cd964', lineWidth: 2 },
      { name: 'square', angle: 90, orb: 6, color: '#ff3b30', lineWidth: 1.5 },
      { name: 'sextile', angle: 60, orb: 5, color: '#34aadc', lineWidth: 1.5 }
    ]
  },
  
  // Resonance Compass configuration
  resonanceCompassConfig: {
    containerSelector: '#resonanceCompass',
    width: 700,
    height: 700,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    zodiacRingWidth: 25,
    zodiacSigns: [
      { name: 'Aries', symbol: '♈', color: '#ff3b30' },
      { name: 'Taurus', symbol: '♉', color: '#4cd964' },
      { name: 'Gemini', symbol: '♊', color: '#ffcc00' },
      { name: 'Cancer', symbol: '♋', color: '#4cd964' },
      { name: 'Leo', symbol: '♌', color: '#ff9500' },
      { name: 'Virgo', symbol: '♍', color: '#4cd964' },
      { name: 'Libra', symbol: '♎', color: '#ffcc00' },
      { name: 'Scorpio', symbol: '♏', color: '#ff3b30' },
      { name: 'Sagittarius', symbol: '♐', color: '#ff9500' },
      { name: 'Capricorn', symbol: '♑', color: '#4cd964' },
      { name: 'Aquarius', symbol: '♒', color: '#34aadc' },
      { name: 'Pisces', symbol: '♓', color: '#34aadc' }
    ]
  },
  
  // Vortex Visualization configuration
  vortexVisualizationConfig: {
    containerSelector: '#vortexVisualization',
    particleCount: 10000,
    particleSize: 0.1,
    rotationSpeed: 0.001,
    cameraDistance: 250,
    fieldOfView: 60,
    particleColors: [
      '#4cd964', // Green
      '#34aadc', // Blue
      '#5856d6', // Indigo
      '#ff9500', // Orange
      '#ffcc00', // Yellow
      '#ff3b30'  // Red
    ]
  },
  
  // Pattern Recognition configuration
  patternRecognitionConfig: {
    patterns: [
      {
        id: 'ALIGNMENT',
        name: 'ALIGNMENT',
        threshold: 0.85,
        description: 'A period of harmonic resonance across multiple planetary vortices, creating ideal conditions for conscious navigation of the resonance field. This pattern facilitates clear perception and intention setting.'
      },
      {
        id: 'TRANSITION',
        name: 'TRANSITION',
        threshold: 0.65,
        description: 'The current phase transition indicates a significant shift in the resonance field as Mars forms a trine aspect with Jupiter, activating a harmonic cascade effect. This creates a window of opportunity for conscious navigation of transformative patterns.'
      },
      {
        id: 'AMPLIFICATION',
        name: 'AMPLIFICATION',
        threshold: 0.75,
        description: 'A powerful amplification of specific resonance patterns is occurring, intensifying both challenges and opportunities. Key planetary relationships are magnifying certain archetypal themes within the collective field.'
      },
      {
        id: 'DISSOLUTION',
        name: 'DISSOLUTION',
        threshold: 0.55,
        description: 'Old patterns are dissolving as Neptune's influence increases, creating temporary uncertainty but making space for new possibilities. This is an excellent time for releasing outdated structures and attachments.'
      },
      {
        id: 'EMERGENCE',
        name: 'EMERGENCE',
        threshold: 0.70,
        description: 'New resonance patterns are emerging from the field, bringing fresh potentials and unexpected developments. This is an excellent time for innovation and exploring new directions.'
      },
      {
        id: 'STABILIZATION',
        name: 'STABILIZATION',
        threshold: 0.80,
        description: 'The resonance field is reaching a point of equilibrium, with stable resonance patterns that support long-term projects and sustained focus. This pattern facilitates grounding and practical implementation.'
      }
    ]
  },
  
  // Fractal Dimension configuration
  fractalDimensionConfig: {
    minValue: 1.0,
    maxValue: 3.0,
    defaultValue: 2.38,
    significantDigits: 2
  },
  
  // Mock Data for Testing
  mockData: {
    planetaryPositions: [
      { id: 'sun', longitude: 0, latitude: 0, distance: 1 },
      { id: 'moon', longitude: 45, latitude: 1, distance: 0.002 },
      { id: 'mercury', longitude: 15, latitude: 2, distance: 0.4 },
      { id: 'venus', longitude: 75, latitude: -1, distance: 0.7 },
      { id: 'mars', longitude: 120, latitude: 0.5, distance: 1.5 },
      { id: 'jupiter', longitude: 240, latitude: -0.5, distance: 5.2 },
      { id: 'saturn', longitude: 270, latitude: 0.2, distance: 9.5 },
      { id: 'uranus', longitude: 300, latitude: 0, distance: 19.2 },
      { id: 'neptune', longitude: 330, latitude: 0.1, distance: 30.1 },
      { id: 'pluto', longitude: 290, latitude: 17, distance: 39.5 }
    ],
    
    aspects: [
      { body1: 'mars', body2: 'jupiter', type: 'trine', angle: 120, orb: 2.3 },
      { body1: 'venus', body2: 'saturn', type: 'square', angle: 90, orb: 3.8 },
      { body1: 'sun', body2: 'mercury', type: 'conjunction', angle: 0, orb: 7.5 },
      { body1: 'moon', body2: 'venus', type: 'sextile', angle: 60, orb: 2.1 },
      { body1: 'jupiter', body2: 'pluto', type: 'square', angle: 90, orb: 5.2 }
    ],
    
    resonancePattern: {
      id: 'TRANSITION',
      strength: 0.78,
      phaseCoherence: 0.67,
      fractalDimension: 2.38,
      description: 'The current phase transition indicates a significant shift in the resonance field as Mars forms a trine aspect with Jupiter, activating a harmonic cascade effect. This creates a window of opportunity for conscious navigation of transformative patterns. Venus approaching a square with Saturn suggests potential restructuring of value systems, while Mercury's fast-moving position near the Sun amplifies information transfer across all resonance domains.'
    }
  }
};