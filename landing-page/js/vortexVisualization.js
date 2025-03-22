/**
 * VortexVisualization Class
 * Creates a 3D visualization of a vortex pattern using Three.js
 */
class VortexVisualization {
  constructor(config) {
    this.config = config;
    this.vortexConfig = config.vortexVisualizationConfig;
    this.containerSelector = this.vortexConfig.containerSelector;
    
    // Configuration values
    this.particleCount = this.vortexConfig.particleCount;
    this.particleSize = this.vortexConfig.particleSize;
    this.rotationSpeed = this.vortexConfig.rotationSpeed;
    this.cameraDistance = this.vortexConfig.cameraDistance;
    this.fieldOfView = this.vortexConfig.fieldOfView;
    this.particleColors = this.vortexConfig.particleColors;
    
    // Animation state
    this.animationFrame = null;
    this.mouseX = 0;
    this.mouseY = 0;
    
    // Scene objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particleSystem = null;
    this.container = null;
    
    // Data state
    this.initialized = false;
    this.phaseCoherence = 0.67; // Default value
    this.fractalDimension = 2.38; // Default value
    this.resonanceStrength = 0.78; // Default value
    
    // Bind event handler methods
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.animate = this.animate.bind(this);
  }
  
  /**
   * Initialize the vortex visualization
   */
  initialize() {
    if (this.initialized) return;
    
    // Get container element
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) {
      console.error('Vortex visualization container not found:', this.containerSelector);
      return;
    }
    
    // Get container dimensions
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      width / height,
      1,
      10000
    );
    this.camera.position.z = this.cameraDistance;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
    
    // Create particles
    this.createParticles();
    
    // Add event listeners
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('mousemove', this.onMouseMove);
    
    // Start animation
    this.animate();
    
    this.initialized = true;
  }
  
  /**
   * Create particle system
   */
  createParticles() {
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: this.particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    
    // Create particle positions, colors, and velocities
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const velocities = new Float32Array(this.particleCount * 3);
    
    // Generate particles
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Create particle in a spiral vortex pattern
      const radius = Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 200;
      
      // Apply fractal dimension to positions
      const fractalFactor = this.fractalDimension * 0.1;
      positions[i3] = radius * Math.cos(theta) * Math.sin(phi) * fractalFactor;
      positions[i3 + 1] = height * fractalFactor;
      positions[i3 + 2] = radius * Math.sin(theta) * Math.sin(phi) * fractalFactor;
      
      // Get random color from palette
      const colorIndex = Math.floor(Math.random() * this.particleColors.length);
      const color = new THREE.Color(this.particleColors[colorIndex]);
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Set particle velocity based on position and phase coherence
      velocities[i3] = -(positions[i3 + 2] * 0.02 + 0.01);
      velocities[i3 + 1] = positions[i3] * 0.02 * (this.phaseCoherence * 0.5);
      velocities[i3 + 2] = positions[i3] * 0.02;
    }
    
    // Add attributes to geometry
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Store velocities for animation
    this.velocities = velocities;
    
    // Create particle system
    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particleSystem);
  }
  
  /**
   * Handle window resize event
   */
  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  /**
   * Handle mouse move event
   * @param {Event} event - Mouse event
   */
  onMouseMove(event) {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  
  /**
   * Animate the vortex
   */
  animate() {
    this.animationFrame = requestAnimationFrame(this.animate);
    
    if (!this.particleSystem) return;
    
    // Rotate based on mouse position
    this.particleSystem.rotation.x += (this.mouseY * 0.01 - this.particleSystem.rotation.x) * 0.05;
    this.particleSystem.rotation.y += (this.mouseX * 0.01 - this.particleSystem.rotation.y) * 0.05;
    
    // Apply rotation
    this.particleSystem.rotation.y += this.rotationSpeed;
    
    // Get positions
    const positions = this.particleSystem.geometry.attributes.position.array;
    
    // Apply phase coherence and fractal dimension to particle motion
    const coherenceFactor = this.phaseCoherence * 0.003;
    const fractalFactor = this.fractalDimension * 0.001;
    const resonanceFactor = this.resonanceStrength * 0.01;
    
    // Update particle positions
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Apply velocity with phase coherence
      positions[i3] += this.velocities[i3] * coherenceFactor;
      positions[i3 + 1] += this.velocities[i3 + 1] * coherenceFactor;
      positions[i3 + 2] += this.velocities[i3 + 2] * coherenceFactor;
      
      // Apply spiral motion
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Distance from center
      const distance = Math.sqrt(x * x + z * z);
      
      // Apply fractal dimension to motion
      if (distance > 0) {
        positions[i3] += (-z / distance) * fractalFactor;
        positions[i3 + 2] += (x / distance) * fractalFactor;
      }
      
      // Apply resonance strength to pulse effect
      const pulse = Math.sin(Date.now() * 0.001) * resonanceFactor + 1;
      positions[i3] *= pulse;
      positions[i3 + 1] *= pulse;
      positions[i3 + 2] *= pulse;
      
      // Reset particles that move too far away
      const totalDistance = Math.sqrt(x * x + y * y + z * z);
      if (totalDistance > 300) {
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;
      }
    }
    
    // Mark positions for update
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Update the vortex with new data
   * @param {Object} data - Resonance data
   */
  update(data) {
    if (!this.initialized) {
      this.initialize();
    }
    
    // Update properties
    this.phaseCoherence = data.phaseSynchronization.phaseCoherence;
    this.fractalDimension = data.fractalDimension;
    this.resonanceStrength = data.resonancePattern.strength;
    
    // Update particle properties if system exists
    if (this.particleSystem) {
      // Update particle colors based on pattern
      const colors = this.particleSystem.geometry.attributes.color.array;
      const pattern = data.resonancePattern.id;
      
      // Apply different color schemes based on pattern
      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        let color;
        
        switch(pattern) {
          case 'ALIGNMENT':
            color = new THREE.Color(
              this.lerp(0.2, 0.8, Math.random()), 
              this.lerp(0.7, 1.0, Math.random()), 
              this.lerp(0.4, 0.7, Math.random())
            );
            break;
          case 'TRANSITION':
            color = new THREE.Color(
              this.lerp(0.5, 0.8, Math.random()), 
              this.lerp(0.3, 0.6, Math.random()), 
              this.lerp(0.8, 1.0, Math.random())
            );
            break;
          case 'AMPLIFICATION':
            color = new THREE.Color(
              this.lerp(0.8, 1.0, Math.random()), 
              this.lerp(0.4, 0.6, Math.random()), 
              this.lerp(0.2, 0.4, Math.random())
            );
            break;
          case 'DISSOLUTION':
            color = new THREE.Color(
              this.lerp(0.2, 0.4, Math.random()), 
              this.lerp(0.3, 0.5, Math.random()), 
              this.lerp(0.7, 1.0, Math.random())
            );
            break;
          case 'EMERGENCE':
            color = new THREE.Color(
              this.lerp(0.7, 0.9, Math.random()), 
              this.lerp(0.7, 0.9, Math.random()), 
              this.lerp(0.1, 0.3, Math.random())
            );
            break;
          default:
            // Get random color from palette
            const colorIndex = Math.floor(Math.random() * this.particleColors.length);
            color = new THREE.Color(this.particleColors[colorIndex]);
        }
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      
      // Mark colors for update
      this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
  }
  
  /**
   * Clean up visualization resources
   */
  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('mousemove', this.onMouseMove);
    
    if (this.container && this.renderer) {
      this.container.removeChild(this.renderer.domElement);
    }
    
    // Clear Three.js objects
    if (this.scene && this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.particleSystem.geometry.dispose();
      this.particleSystem.material.dispose();
    }
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particleSystem = null;
    this.initialized = false;
  }
  
  /**
   * Linear interpolation helper
   * @param {number} a - Start value
   * @param {number} b - End value
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} - Interpolated value
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }
}