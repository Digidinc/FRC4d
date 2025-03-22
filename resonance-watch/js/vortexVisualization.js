/**
 * Vortex Visualization
 * Creates a 3D visualization of a vortex pattern using Three.js
 */
class VortexVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.config = CONFIG.vortexVisualization;
        
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.config.colors.background);
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            this.config.camera.fov,
            this.container.clientWidth / this.container.clientHeight,
            this.config.camera.near,
            this.config.camera.far
        );
        this.camera.position.set(
            this.config.camera.position.x,
            this.config.camera.position.y,
            this.config.camera.position.z
        );
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Create vortex elements
        this.createVortexCore();
        this.createVortexParticles();
        
        // Setup animation properties
        this.clock = new THREE.Clock();
        this.isAnimating = false;
        
        // Set up resize handling
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Initialize vortex properties
        this.vortexProperties = {
            phaseCoherence: 0.5,
            fractalDimension: 1.6,
            fieldStrength: 0.5
        };
    }
    
    /**
     * Create the vortex core geometry
     */
    createVortexCore() {
        // Create a group for the core
        this.coreGroup = new THREE.Group();
        this.scene.add(this.coreGroup);
        
        // Create the core geometry
        const coreGeometry = new THREE.TorusKnotGeometry(
            this.config.appearance.coreSize,
            this.config.appearance.coreSize / 4,
            100,
            16
        );
        
        // Create pulsating material
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: this.config.colors.core,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        // Create the core mesh
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.coreGroup.add(this.core);
        
        // Add a point light in the center
        const light = new THREE.PointLight(this.config.colors.core, 1, 100);
        light.position.set(0, 0, 0);
        this.coreGroup.add(light);
        
        // Add a glow sphere
        const glowGeometry = new THREE.SphereGeometry(
            this.config.appearance.coreSize * 1.2,
            32,
            32
        );
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.config.colors.core,
            transparent: true,
            opacity: 0.2
        });
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.coreGroup.add(this.glow);
    }
    
    /**
     * Create the vortex particle system
     */
    createVortexParticles() {
        const particleCount = this.config.appearance.particleCount;
        const particleSize = this.config.appearance.particleSize;
        
        // Create geometry for particles
        const particlesGeometry = new THREE.BufferGeometry();
        
        // Create arrays for position and velocity
        this.positions = new Float32Array(particleCount * 3);
        this.velocities = new Float32Array(particleCount * 3);
        this.spiralFactors = new Float32Array(particleCount);
        
        // Initialize particle positions in a spiral pattern
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            
            // Calculate spiral pattern
            const t = Math.random() * Math.PI * 2; // Angle
            const s = Math.random() * 80 + 10; // Distance from center
            
            // Position along spiral
            this.positions[idx] = Math.cos(t * 10) * s;
            this.positions[idx + 1] = Math.sin(t * 10) * s;
            this.positions[idx + 2] = (Math.random() - 0.5) * s / 2;
            
            // Random velocities
            this.velocities[idx] = (Math.random() - 0.5) * 0.02;
            this.velocities[idx + 1] = (Math.random() - 0.5) * 0.02;
            this.velocities[idx + 2] = (Math.random() - 0.5) * 0.02;
            
            // Spiral tightness factor
            this.spiralFactors[i] = Math.random() * this.config.appearance.spiralTightness;
        }
        
        // Add positions to geometry
        particlesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.positions, 3)
        );
        
        // Create material for particles
        const particleMaterial = new THREE.PointsMaterial({
            color: this.config.colors.particles,
            size: particleSize,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // Create the particle system
        this.particles = new THREE.Points(particlesGeometry, particleMaterial);
        this.scene.add(this.particles);
    }
    
    /**
     * Start the animation loop
     */
    start() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.clock.start();
            this.animate();
        }
    }
    
    /**
     * Stop the animation loop
     */
    stop() {
        this.isAnimating = false;
    }
    
    /**
     * Update the visualization with new resonance data
     * @param {Object} resonanceData - Current resonance pattern data
     */
    update(resonanceData) {
        // Update vortex properties
        this.vortexProperties.phaseCoherence = resonanceData.phaseCoherence || this.vortexProperties.phaseCoherence;
        this.vortexProperties.fractalDimension = resonanceData.fractalDimension || this.vortexProperties.fractalDimension;
        this.vortexProperties.fieldStrength = resonanceData.fieldStrength || this.vortexProperties.fieldStrength;
        
        // Update core material color based on pattern type
        if (resonanceData.patternType) {
            this.updateCoreColor(resonanceData.patternType);
        }
        
        // Update glow size based on field strength
        this.glow.scale.set(
            1 + this.vortexProperties.fieldStrength * 0.5,
            1 + this.vortexProperties.fieldStrength * 0.5,
            1 + this.vortexProperties.fieldStrength * 0.5
        );
        
        // Update particle system based on fractal dimension
        const particleMaterial = this.particles.material;
        particleMaterial.size = this.config.appearance.particleSize * 
            (0.8 + this.vortexProperties.fractalDimension * 0.2);
        
        particleMaterial.opacity = 0.5 + this.vortexProperties.fieldStrength * 0.5;
    }
    
    /**
     * Update the core color based on pattern type
     * @param {string} patternType - Current pattern type
     */
    updateCoreColor(patternType) {
        const colors = {
            ALIGNMENT: 0x4CAF50,     // Green
            DISSONANCE: 0xF44336,    // Red
            TRANSITION: 0xFFC107,    // Amber
            AMPLIFICATION: 0xE91E63, // Pink
            DISSOLUTION: 0x9C27B0,   // Purple
            EMERGENCE: 0x2196F3,     // Blue
            STABILIZATION: 0x00BCD4, // Cyan
            ACCELERATION: 0xFF9800   // Orange
        };
        
        const color = colors[patternType] || this.config.colors.core;
        
        // Update core material
        this.core.material.color.setHex(color);
        
        // Update glow
        this.glow.material.color.setHex(color);
        
        // Update light
        this.coreGroup.children[1].color.setHex(color);
    }
    
    /**
     * Animation loop
     */
    animate() {
        if (!this.isAnimating) return;
        
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        
        // Rotate core
        this.coreGroup.rotation.x += this.config.animation.rotationSpeed * 
            this.config.animation.coreRotationModifier * delta * 60;
        this.coreGroup.rotation.y += this.config.animation.rotationSpeed * 
            this.config.animation.coreRotationModifier * delta * 60;
        
        // Pulse core based on field strength
        const pulseScale = 1 + Math.sin(this.clock.elapsedTime * 2) * 0.1 * 
            this.vortexProperties.fieldStrength;
        this.core.scale.set(pulseScale, pulseScale, pulseScale);
        
        // Update particle positions
        this.updateParticles(delta);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Update particle positions
     * @param {number} delta - Time since last frame
     */
    updateParticles(delta) {
        const positions = this.particles.geometry.attributes.position.array;
        const particleCount = positions.length / 3;
        
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            
            // Get current position
            const x = positions[idx];
            const y = positions[idx + 1];
            const z = positions[idx + 2];
            
            // Calculate distance from center
            const distance = Math.sqrt(x * x + y * y + z * z);
            
            // Calculate rotation speed based on distance and fractal dimension
            const rotationSpeed = 0.01 * (1 / (distance * 0.01)) * 
                this.spiralFactors[i] * 
                (0.5 + this.vortexProperties.phaseCoherence * 0.5);
            
            // Apply spiral motion
            const angle = Math.atan2(y, x) + rotationSpeed;
            
            // Apply forces
            positions[idx] = Math.cos(angle) * distance;
            positions[idx + 1] = Math.sin(angle) * distance;
            
            // Slightly pull particles toward the center based on field strength
            const pull = 0.01 * this.vortexProperties.fieldStrength;
            positions[idx] *= (1 - pull);
            positions[idx + 1] *= (1 - pull);
            positions[idx + 2] *= (1 - pull);
            
            // Apply slight random movement
            positions[idx] += this.velocities[idx];
            positions[idx + 1] += this.velocities[idx + 1];
            positions[idx + 2] += this.velocities[idx + 2];
            
            // Keep particles within bounds
            if (distance > 100) {
                positions[idx] *= 0.95;
                positions[idx + 1] *= 0.95;
                positions[idx + 2] *= 0.95;
            }
        }
        
        // Flag the geometry for update
        this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        // Update camera aspect ratio
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.vortexVisualization = new VortexVisualization('vortex-visualization');
    window.vortexVisualization.start();
});