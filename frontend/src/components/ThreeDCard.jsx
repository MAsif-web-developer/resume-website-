import React, { useRef, useState } from 'react';

const ThreeDCard = ({ children, className = '', glowColor = 'rgba(99, 102, 241, 0.15)' }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Mouse position relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates around the center (from -0.5 to 0.5)
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    setCoords({ x: normalizedX, y: normalizedY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  // 3D rotations based on normalized coordinates (e.g. max 12 degrees tilt)
  const maxTilt = 12;
  const rotateX = -coords.y * maxTilt;
  const rotateY = coords.x * maxTilt;
  
  // Spotlight position relative to the element in %
  const spotX = (coords.x + 0.5) * 100;
  const spotY = (coords.y + 0.5) * 100;

  const cardStyle = {
    transform: isHovered 
      ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)` 
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    transformStyle: 'preserve-3d',
  };

  const shineStyle = {
    background: `radial-gradient(circle 180px at ${spotX}% ${spotY}%, ${glowColor}, transparent 80%)`,
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      className={`relative transition-all duration-300 ${className}`}
    >
      {/* 3D highlight overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 rounded-inherit" 
        style={shineStyle} 
      />
      <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default ThreeDCard;
