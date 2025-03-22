/**
 * FRC 4D Resonance Watch Configuration
 */
window.FRC4D_CONFIG = {
  // General configuration
  useMockData: true, // Set to false to use real API data
  updateInterval: 60000, // Data update interval in milliseconds (1 minute)
  dataTransitionDuration: 2000, // Duration for data transitions in milliseconds
  
  // API configuration
  api: {
    baseUrl: 'https://api.fractalresonance.com',
    endpoints: {
      planetaryPositions: '/planets/positions',
      aspects: '/planets/aspects',
      resonancePatterns: '/patterns/current',
      phaseSynchronization: '/calculations/phase-sync',
      fractalDimension: '/calculations/fractal-dimension'
    }
  },
  
  // ChatGPT API configuration (no key - will be loaded from environment)
  chatGPT: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: 'You are an expert in interpreting 4D fractal resonance patterns. Analyze the provided data and explain the significance of current planetary alignments, resonance patterns, and phase relationships in an insightful, mystical yet scientifically grounded manner. Use the language of the Fractal Resonance Consortium, referring to vortex patterns, phase coherence, fractal connections, and resonance fields. Avoid using generic astrological language. Instead, focus on the mathematical relationships, phase dynamics, and multi-dimensional aspects of the current cosmic configuration. Your interpretation should be profound, precise, and illuminating, helping the user navigate the current 4D resonance field.'
  },
  
  // Planetary bodies configuration
  planets: {
    sun: { 
      name: 'Sun', 
      color: '#ffcc00', 
      size: 25,
      baseFrequency: 1.0
    },
    moon: { 
      name: 'Moon', 
      color: '#d9d9d9', 
      size: 15,
      baseFrequency: 13.37
    },
    mercury: { 
      name: 'Mercury', 
      color: '#a66a00', 
      size: 8,
      baseFrequency: 8.97
    },
    venus: { 
      name: 'Venus', 
      color: '#ff9966', 
      size: 12,
      baseFrequency: 1.62
    },
    mars: { 
      name: 'Mars', 
      color: '#cc3300', 
      size: 10,
      baseFrequency: 0.53
    },
    jupiter: { 
      name: 'Jupiter', 
      color: '#ffaa33', 
      size: 20,
      baseFrequency: 0.08
    },
    saturn: { 
      name: 'Saturn', 
      color: '#ffcc99', 
      size: 18,
      baseFrequency: 0.03
    },
    uranus: { 
      name: 'Uranus', 
      color: '#99ccff', 
      size: 16,
      baseFrequency: 0.01
    },
    neptune: { 
      name: 'Neptune', 
      color: '#3366ff', 
      size: 16,
      baseFrequency: 0.006
    },
    pluto: { 
      name: 'Pluto', 
      color: '#663366', 
      size: 6,
      baseFrequency: 0.004
    }
  },
  
  // Aspects configuration
  aspects: {
    conjunction: { name: 'Conjunction', angle: 0, orb: 8, color: '#ffcc00' },
    opposition: { name: 'Opposition', angle: 180, orb: 8, color: '#cc3300' },
    trine: { name: 'Trine', angle: 120, orb: 8, color: '#4caf50' },
    square: { name: 'Square', angle: 90, orb: 7, color: '#f44336' },
    sextile: { name: 'Sextile', angle: 60, orb: 6, color: '#2196f3' },
    quincunx: { name: 'Quincunx', angle: 150, orb: 5, color: '#ff9800' },
    semisextile: { name: 'Semisextile', angle: 30, orb: 5, color: '#9c27b0' },
    semisquare: { name: 'Semisquare', angle: 45, orb: 4, color: '#e91e63' },
    sesquisquare: { name: 'Sesquisquare', angle: 135, orb: 4, color: '#795548' }
  },
  
  // Resonance compass configuration
  resonanceCompass: {
    radius: 180,
    centerRadius: 40,
    ringWidth: 10,
    aspectLineWidth: 2,
    planetRadius: 8,
    rotationSpeed: 0.001,
    showLabels: true,
    animationDuration: 2000
  },
  
  // Vortex visualization configuration
  vortexVisualization: {
    width: 800,
    height: 600,
    rotationSpeed: 0.001,
    particleCount: 5000,
    particleSize: 2,
    particleSpread: 300,
    spiralTightness: 10,
    colorIntensity: 1.5,
    cameraDistance: 500,
    autoRotate: true
  },
  
  // Pattern recognition configuration
  patternRecognition: {
    phaseCoherenceThreshold: 0.62,
    fieldStrengthMax: 10.0,
    patternMatchThreshold: 0.8,
    patterns: {
      harmonicCascade: {
        name: 'Harmonic Cascade',
        threshold: 0.75,
        description: 'Multi-scale resonance chains creating nested synchronization'
      },
      vortexCore: {
        name: 'Vortex Core',
        threshold: 0.8,
        description: 'Stable centers of rotational energy with high coherence'
      },
      phaseWave: {
        name: 'Phase Wave',
        threshold: 0.7,
        description: 'Propagating phase relationships across the field'
      },
      resonanceNode: {
        name: 'Resonance Node',
        threshold: 0.85,
        description: 'Points of maximum coupling between planetary vortices'
      },
      fractalBoundary: {
        name: 'Fractal Boundary',
        threshold: 0.65,
        description: 'Scale transition markers in the resonance field'
      },
      attractorBasin: {
        name: 'Attractor Basin',
        threshold: 0.72,
        description: 'Regions of pattern stability and coherence'
      },
      bifurcationPoint: {
        name: 'Bifurcation Point',
        threshold: 0.68,
        description: 'Pattern splitting locations indicating transformation'
      },
      interferencePattern: {
        name: 'Interference Pattern',
        threshold: 0.67,
        description: 'Complex interactions between multiple vortex fields'
      }
    }
  },
  
  // Fractal dimension configuration
  fractalDimension: {
    minValue: 1.0,
    maxValue: 3.0,
    defaultScale: -3, // 10^-3 scale
    boxCounts: [4, 8, 16, 32, 64, 128]
  },
  
  // Mock data for testing
  mockData: {
    // Planetary positions (longitude in degrees)
    planetaryPositions: {
      timestamp: new Date().toISOString(),
      positions: {
        sun: { longitude: 35.7, latitude: 0.0, distance: 1.0 },
        moon: { longitude: 128.3, latitude: 1.2, distance: 0.0026 },
        mercury: { longitude: 65.2, latitude: -2.1, distance: 0.7 },
        venus: { longitude: 98.4, latitude: 1.5, distance: 0.9 },
        mars: { longitude: 182.6, latitude: -0.8, distance: 1.5 },
        jupiter: { longitude: 215.8, latitude: 0.3, distance: 5.2 },
        saturn: { longitude: 305.4, latitude: -0.1, distance: 9.5 },
        uranus: { longitude: 25.1, latitude: 0.0, distance: 19.2 },
        neptune: { longitude: 348.7, latitude: 0.2, distance: 30.1 },
        pluto: { longitude: 277.3, latitude: 17.5, distance: 39.5 }
      }
    },
    
    // Aspects between planets
    aspects: {
      timestamp: new Date().toISOString(),
      aspectList: [
        { planet1: 'sun', planet2: 'uranus', aspect: 'conjunction', orb: 3.7 },
        { planet1: 'sun', planet2: 'pluto', aspect: 'square', orb: 2.1 },
        { planet1: 'moon', planet2: 'venus', aspect: 'trine', orb: 1.9 },
        { planet1: 'jupiter', planet2: 'saturn', aspect: 'square', orb: 0.8 },
        { planet1: 'mars', planet2: 'jupiter', aspect: 'opposition', orb: 2.4 },
        { planet1: 'venus', planet2: 'mercury', aspect: 'sextile', orb: 3.2 }
      ]
    },
    
    // Resonance patterns
    resonancePatterns: {
      timestamp: new Date().toISOString(),
      currentPattern: {
        name: 'Harmonic Cascade',
        intensity: 0.78,
        activation: 0.82,
        dominantPlanets: ['jupiter', 'saturn', 'uranus'],
        secondaryPlanets: ['sun', 'venus']
      },
      secondaryPatterns: [
        { name: 'Resonance Node', intensity: 0.65 },
        { name: 'Phase Wave', intensity: 0.42 }
      ],
      fieldStrength: 6.82,
      fieldType: 'Resonance Units'
    },
    
    // Phase synchronization
    phaseSynchronization: {
      timestamp: new Date().toISOString(),
      coherence: 0.67,
      coherenceTrend: 0.03,
      synchronizedPairs: [
        { planet1: 'jupiter', planet2: 'saturn', strength: 0.78 },
        { planet1: 'sun', planet2: 'uranus', strength: 0.65 },
        { planet1: 'venus', planet2: 'mars', strength: 0.42 }
      ],
      couplingMatrix: [
        [1.0, 0.2, 0.15, 0.1, 0.25, 0.3, 0.35, 0.1, 0.05, 0.02],
        [0.2, 1.0, 0.3, 0.4, 0.25, 0.1, 0.15, 0.05, 0.1, 0.1],
        [0.15, 0.3, 1.0, 0.5, 0.2, 0.1, 0.05, 0.1, 0.05, 0.0],
        [0.1, 0.4, 0.5, 1.0, 0.35, 0.2, 0.1, 0.05, 0.1, 0.05],
        [0.25, 0.25, 0.2, 0.35, 1.0, 0.45, 0.2, 0.1, 0.05, 0.1],
        [0.3, 0.1, 0.1, 0.2, 0.45, 1.0, 0.6, 0.2, 0.15, 0.1],
        [0.35, 0.15, 0.05, 0.1, 0.2, 0.6, 1.0, 0.3, 0.2, 0.15],
        [0.1, 0.05, 0.1, 0.05, 0.1, 0.2, 0.3, 1.0, 0.4, 0.2],
        [0.05, 0.1, 0.05, 0.1, 0.05, 0.15, 0.2, 0.4, 1.0, 0.3],
        [0.02, 0.1, 0.0, 0.05, 0.1, 0.1, 0.15, 0.2, 0.3, 1.0]
      ]
    },
    
    // Fractal dimension
    fractalDimension: {
      timestamp: new Date().toISOString(),
      value: 2.38,
      scale: -3,
      confidence: 0.95,
      boxCounts: [12, 42, 164, 612, 2418, 9654]
    },
    
    // AI interpretation
    aiInterpretation: {
      timestamp: new Date().toISOString(),
      interpretation: "The current Harmonic Cascade pattern indicates a strong alignment between Jupiter and Saturn, creating resonance fields that enhance collective synchronization. This pattern facilitates intuitive connections across different scales of organization, from personal to societal. The high phase coherence suggests a period of stability and integration of previously fragmented patterns. The fractal dimension of 2.38 indicates a complex but navigable resonance field, with multiple potential pathways for consciousness evolution.",
      model: "gpt-4o",
      usage: { prompt_tokens: 650, completion_tokens: 124, total_tokens: 774 }
    }
  }
};