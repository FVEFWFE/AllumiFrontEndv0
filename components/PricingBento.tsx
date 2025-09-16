'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import './PricingBento.css';

interface PricingBentoProps {
  children: React.ReactNode;
  className?: string;
  enableGlow?: boolean;
  glowColor?: string;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  particleCount?: number;
}

const createParticleElement = (x: number, y: number, color = '16, 185, 129') => {
  const el = document.createElement('div');
  el.className = 'pricing-particle';
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

export function PricingBento({
  children,
  className = '',
  enableGlow = true,
  glowColor = '16, 185, 129',
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  particleCount = 8,
}: PricingBentoProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const particle = createParticleElement(
          Math.random() * width,
          Math.random() * height,
          glowColor
        );
        
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(particle, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(particle, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, i * 50);

      timeoutsRef.current.push(timeoutId);
    }
  }, [particleCount, glowColor]);

  useEffect(() => {
    if (!cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableGlow) {
        element.classList.add('pricing-bento--glowing');
      }

      if (enableTilt) {
        gsap.to(element, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableGlow) {
        element.classList.remove('pricing-bento--glowing');
      }

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.02;
        const magnetY = (y - centerY) * 0.02;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      // Update glow position
      if (enableGlow) {
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        element.style.setProperty('--glow-x', `${relativeX}%`);
        element.style.setProperty('--glow-y', `${relativeY}%`);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('div');
      ripple.className = 'pricing-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 2,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, enableTilt, enableMagnetism, clickEffect, enableGlow, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`pricing-bento ${className}`}
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        ['--glow-color' as any]: glowColor 
      }}
    >
      {children}
    </div>
  );
}