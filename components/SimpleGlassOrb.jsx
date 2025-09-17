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
        className="absolute w-32 h-32 pointer-events-none transition-transform duration-75"
        style={{
          transform: `translate(${position.x - 64}px, ${position.y - 64}px)`,
        }}
      >
        {/* Glass orb with gradient and effects */}
        <div className="relative w-full h-full">
          {/* Main glass orb */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(207, 158, 255, 0.3), rgba(207, 158, 255, 0.1), transparent)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(207, 158, 255, 0.3)',
              boxShadow: '0 0 30px rgba(207, 158, 255, 0.4), inset 0 0 20px rgba(207, 158, 255, 0.2)',
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