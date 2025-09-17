/* eslint-disable react/no-unknown-property */
'use client';

import { useRef, useEffect, useState } from 'react';

export default function SimpleGlassOrb() {
  const orbRef = useRef(null);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setPosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      style={{ zIndex: 15 }}
    >
      <div
        ref={orbRef}
        className="absolute w-40 h-40 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${position.x - 80}px, ${position.y - 80}px)`,
        }}
      >
        {/* Glass orb with gradient and effects */}
        <div className="relative w-full h-full">
          {/* Outer glow */}
          <div 
            className="absolute -inset-8 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle at center, rgba(207, 158, 255, 0.15), transparent)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* Main glass orb */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(207, 158, 255, 0.4), rgba(207, 158, 255, 0.2), rgba(207, 158, 255, 0.05))',
              backdropFilter: 'blur(10px) brightness(1.1)',
              border: '3px solid rgba(207, 158, 255, 0.5)',
              boxShadow: '0 0 40px rgba(207, 158, 255, 0.6), inset 0 0 30px rgba(207, 158, 255, 0.3), 0 0 80px rgba(207, 158, 255, 0.2)',
            }}
          />
          
          {/* Inner glow */}
          <div 
            className="absolute inset-4 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(207, 158, 255, 0.2), transparent)',
              filter: 'blur(4px)',
            }}
          />
          
          {/* Highlight */}
          <div 
            className="absolute top-4 left-4 w-8 h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.6), transparent)',
              filter: 'blur(2px)',
            }}
          />
        </div>
      </div>
    </div>
  );
}