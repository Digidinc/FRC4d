/**
 * Configuration for the 4D Resonance Watch
 * Contains settings for the API, visualization components, and pattern detection
 */
const CONFIG = {
    // API Configuration
    api: {
        baseUrl: "https://api.fractalresonance.com/astronomical-service",
        endpoints: {
            planets: "/planets",
            aspects: "/aspects",
            phaseSync: "/calculations/phase-sync",
            natalChart: "/natal-chart"
        },
        updateFrequency: 60000 // 1 minute
    },
    
    // Planetary Configuration
    planets: {
        display: ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"],
        symbols: {
            sun: "☉",
            moon: "☽",
            mercury: "☿",
            venus: "♀",
            mars: "♂",
            jupiter: "♃",
            saturn: "♄",
            uranus: "♅",
            neptune: "♆",
            pluto: "♇"
        },
        sizes: {
            sun: 1.5,
            moon: 1.3,
            mercury: 0.8,
            venus: 0.9,
            mars: 0.85,
            jupiter: 1.2,
            saturn: 1.1,
            uranus: 0.9,
            neptune: 0.85,
            pluto: 0.7
        }
    },
    
    // Aspect Configuration
    aspects: {
        types: {
            conjunction: { angle: 0, orb: 10, symbol: "☌" },
            opposition: { angle: 180, orb: 10, symbol: "☍" },
            trine: { angle: 120, orb: 8, symbol: "△" },
            square: { angle: 90, orb: 8, symbol: "□" },
            sextile: { angle: 60, orb: 6, symbol: "⚹" }
        },
        minStrength: 0.3 // Minimum strength to display aspects
    },
    
    // Resonance Compass Configuration
    resonanceCompass: {
        zodiac: [
            { name: "Aries", symbol: "♈", start: 0, element: "fire" },
            { name: "Taurus", symbol: "♉", start: 30, element: "earth" },
            { name: "Gemini", symbol: "♊", start: 60, element: "air" },
            { name: "Cancer", symbol: "♋", start: 90, element: "water" },
            { name: "Leo", symbol: "♌", start: 120, element: "fire" },
            { name: "Virgo", symbol: "♍", start: 150, element: "earth" },
            { name: "Libra", symbol: "♎", start: 180, element: "air" },
            { name: "Scorpio", symbol: "♏", start: 210, element: "water" },
            { name: "Sagittarius", symbol: "♐", start: 240, element: "fire" },
            { name: "Capricorn", symbol: "♑", start: 270, element: "earth" },
            { name: "Aquarius", symbol: "♒", start: 300, element: "air" },
            { name: "Pisces", symbol: "♓", start: 330, element: "water" }
        ],
        animation: {
            duration: 1000, // milliseconds
            ease: "cubic-in-out"
        },
        fieldStrength: {
            minOpacity: 0.2,
            maxOpacity: 0.8
        }
    },
    
    // Vortex Visualization Configuration
    vortexVisualization: {
        camera: {
            fov: 75,
            near: 0.1,
            far: 1000,
            position: { x: 0, y: 0, z: 150 }
        },
        animation: {
            rotationSpeed: 0.01,
            coreRotationModifier: 0.5,
            particleSpeed: 0.02
        },
        appearance: {
            coreSize: 8,
            particleCount: 2000,
            particleSize: 0.8,
            spiralTightness: 10
        },
        colors: {
            background: 0x000814,
            core: 0x4CAF50,
            particles: 0x00BCD4
        }
    },
    
    // Pattern Detection Settings
    patternDetection: {
        thresholds: {
            alignment: 0.75,
            dissonance: 0.35,
            amplification: 0.7,
            dissolution: 0.4,
            emergence: 0.65,
            stabilization: 0.6
        },
        timeWindow: 30 * 60 * 1000 // 30 minutes in milliseconds
    },
    
    // Fractal Dimension Settings
    fractalDimension: {
        boxCountingSettings: {
            minBoxSize: 1,
            maxBoxSize: 128,
            stepFactor: 2
        },
        iterations: 10
    }
};