'use client';

import { useState, useEffect } from 'react';
import { X, HelpCircle, Info } from 'lucide-react';

interface TooltipGuideProps {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showOnce?: boolean;
  children: React.ReactNode;
}

export default function TooltipGuide({
  id,
  title,
  content,
  position = 'top',
  showOnce = true,
  children
}: TooltipGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    const shownKey = `tooltip_shown_${id}`;
    const hasShown = localStorage.getItem(shownKey);

    if (!hasShown && !hasBeenShown) {
      // Show tooltip after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        if (showOnce) {
          localStorage.setItem(shownKey, 'true');
          setHasBeenShown(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [id, showOnce, hasBeenShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-accent';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-accent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-accent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-accent';
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-t-accent';
    }
  };

  return (
    <div className="relative inline-block">
      {children}

      {isVisible && (
        <div
          className={`absolute z-50 ${getPositionClasses()} animate-fade-in`}
          style={{ minWidth: '250px' }}
        >
          <div className="bg-accent text-white rounded-lg shadow-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <h3 className="font-semibold text-sm">{title}</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs leading-relaxed">{content}</p>

            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses()}`}
              style={{
                borderTopWidth: position === 'bottom' ? '0' : '4px',
                borderBottomWidth: position === 'top' ? '0' : '4px',
                borderLeftWidth: position === 'right' ? '0' : '4px',
                borderRightWidth: position === 'left' ? '0' : '4px'
              }}
            />
          </div>
        </div>
      )}

      {/* Help Icon for manual trigger */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute -top-2 -right-2 p-1 bg-accent/20 hover:bg-accent/30 rounded-full transition opacity-0 group-hover:opacity-100"
      >
        <HelpCircle className="w-3 h-3 text-accent" />
      </button>
    </div>
  );
}