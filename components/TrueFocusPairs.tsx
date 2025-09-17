import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './TrueFocusPairs.css';

interface TrueFocusPairsProps {
  firstPair?: string;
  secondPair?: string;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

const TrueFocusPairs = ({
  firstPair = 'Stop Guessing',
  secondPair = 'Start Growing',
  blurAmount = 8,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 1.5,
  pauseBetweenAnimations = 0.5
}: TrueFocusPairsProps) => {
  const words1 = firstPair.split(' ');
  const words2 = secondPair.split(' ');
  const allWords = [...words1, ...words2];
  
  const [activeGroup, setActiveGroup] = useState(0); // 0 for first pair, 1 for second pair
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const interval = setInterval(
      () => {
        setActiveGroup(prev => (prev + 1) % 2);
      },
      (animationDuration + pauseBetweenAnimations) * 1000
    );

    return () => clearInterval(interval);
  }, [animationDuration, pauseBetweenAnimations]);

  useEffect(() => {
    if (!containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    
    // Calculate bounding box for the active word pair
    const startIndex = activeGroup === 0 ? 0 : words1.length;
    const endIndex = activeGroup === 0 ? words1.length - 1 : allWords.length - 1;
    
    if (!wordRefs.current[startIndex] || !wordRefs.current[endIndex]) return;
    
    const firstWordRect = wordRefs.current[startIndex]!.getBoundingClientRect();
    const lastWordRect = wordRefs.current[endIndex]!.getBoundingClientRect();
    
    const left = Math.min(firstWordRect.left, lastWordRect.left);
    const right = Math.max(firstWordRect.right, lastWordRect.right);
    const top = Math.min(firstWordRect.top, lastWordRect.top);
    const bottom = Math.max(firstWordRect.bottom, lastWordRect.bottom);

    setFocusRect({
      x: left - parentRect.left - 10,
      y: top - parentRect.top - 10,
      width: right - left + 20,
      height: bottom - top + 20
    });
  }, [activeGroup, words1.length, allWords.length]);

  return (
    <div className="focus-pairs-container inline-flex flex-wrap" ref={containerRef}>
      {allWords.map((word, index) => {
        const isInFirstGroup = index < words1.length;
        const isActive = (activeGroup === 0 && isInFirstGroup) || (activeGroup === 1 && !isInFirstGroup);
        const isLastOfFirstGroup = index === words1.length - 1;
        
        return (
          <React.Fragment key={index}>
            <span
              ref={el => (wordRefs.current[index] = el)}
              className={`focus-pair-word ${isActive ? 'active' : ''} ${isLastOfFirstGroup ? 'sm:mr-2' : ''}`}
              style={{
                filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
                ['--border-color' as any]: borderColor,
                ['--glow-color' as any]: glowColor,
                transition: `filter ${animationDuration}s ease`,
                marginRight: index === words1.length - 1 ? '0.5em' : '0.3em',
                display: 'inline-block'
              }}
            >
              {word}
            </span>
            {isLastOfFirstGroup && (
              <br className="sm:hidden" />
            )}
          </React.Fragment>
        );
      })}

      <motion.div
        className="focus-pair-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: 1
        }}
        transition={{
          duration: animationDuration,
          ease: "easeInOut"
        }}
        style={{
          ['--border-color' as any]: borderColor,
          ['--glow-color' as any]: glowColor
        }}
      >
        <span className="pair-corner top-left"></span>
        <span className="pair-corner top-right"></span>
        <span className="pair-corner bottom-left"></span>
        <span className="pair-corner bottom-right"></span>
      </motion.div>
    </div>
  );
};

export default TrueFocusPairs;