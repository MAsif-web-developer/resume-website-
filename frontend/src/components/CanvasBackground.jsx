import React, { useEffect, useRef } from 'react';

const CanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    const maxParticles = 90;
    
    // 3D coordinates system state
    let rotationX = 0.001; // Constant rotation speeds
    let rotationY = 0.0025;
    let currentRotationX = 0;
    let currentRotationY = 0;
    
    // Mouse inputs for drift/tilt
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = { current: 0, target: 0 };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      // Normalize mouse positions around center (-0.5 to 0.5)
      mouse.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouse.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    const handleScroll = () => {
      scrollY.target = window.scrollY * 0.0015; // scroll rotation speed multiplier
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Initial canvas setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create 3D particles distributed on a sphere
    const initParticles = () => {
      particles = [];
      const sphereRadius = Math.min(230, window.innerWidth * 0.22);
      
      for (let i = 0; i < maxParticles; i++) {
        // Golden spiral distribution on sphere for beautiful spacing
        const phi = Math.acos(-1 + (2 * i) / maxParticles);
        const theta = Math.sqrt(maxParticles * Math.PI) * phi;
        
        const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
        const z = sphereRadius * Math.cos(phi);
        
        particles.push({
          x,
          y,
          z,
          baseSize: Math.random() * 1.8 + 1,
        });
      }
    };

    initParticles();

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Interpolate mouse & scroll actions for inertia/smoothness
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;
      scrollY.current += (scrollY.target - scrollY.current) * 0.06;
      
      // Accumulate rotations (base rotation + mouse offsets + scroll offsets)
      currentRotationX += rotationX + (mouse.y * 0.005);
      currentRotationY += rotationY + (mouse.x * 0.005) + (scrollY.current * 0.01);

      const cosX = Math.cos(currentRotationX);
      const sinX = Math.sin(currentRotationX);
      const cosY = Math.cos(currentRotationY);
      const sinY = Math.sin(currentRotationY);

      // Determine colors based on active theme
      const isDark = document.documentElement.classList.contains('dark');
      const accentRGB = isDark ? '6, 182, 212' : '59, 130, 246'; // cyan vs blue
      const nodeColor = `rgba(${accentRGB}, 0.25)`;
      const lineColor = `rgba(${accentRGB}, 0.04)`;

      // Project particles to 2D
      const projected = [];
      const focalLength = 380; // Distance of camera perspective

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Rotate around Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;
        
        // Rotate around X axis
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;
        
        // Apply camera zoom/perspective projection
        const scale = focalLength / (focalLength + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        
        projected.push({
          x: projX,
          y: projY,
          z: z2, // Keep z depth for visual line opacity calculations
          size: p.baseSize * scale,
          opacity: scale * 0.65 // further nodes are dimmer
        });
      }

      // Draw Connection Lines
      const maxDistance = Math.min(130, window.innerWidth * 0.12);
      ctx.lineWidth = 0.65;
      
      for (let i = 0; i < projected.length; i++) {
        const pA = projected[i];
        
        for (let j = i + 1; j < projected.length; j++) {
          const pB = projected[j];
          
          // Only link nodes if they are relatively close in 3D projected space
          const dx = pA.x - pB.x;
          const dy = pA.y - pB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Factor depth (z) into connection transparency
            const meanZ = (pA.z + pB.z) / 2;
            const depthFactor = Math.max(0.1, 1 - (meanZ / 250)); // smaller factor for background nodes
            const opacity = (1 - (distance / maxDistance)) * 0.08 * depthFactor;
            
            ctx.strokeStyle = `rgba(${accentRGB}, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        }
      }

      // Draw Particles/Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRGB}, ${p.opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Listen to theme switches to re-init node colors
    const observer = new MutationObserver(() => {
      // Small trigger to force colors update (handled in animate render scope)
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
    />
  );
};

export default CanvasBackground;
