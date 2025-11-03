import React, { useEffect, useState, useRef } from 'react';

interface CountdownCardProps {
  value: number;
  label: string;
}

// This component renders a single digit with a flip animation
const AnimatedDigit = ({ animateTo }: { animateTo: string }) => {
  const [currentDigit, setCurrentDigit] = useState(animateTo);
  const [previousDigit, setPreviousDigit] = useState(animateTo);
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutIdRef = useRef<number | null>(null);


  // When the target digit changes, trigger the flip animation
  useEffect(() => {
    if (currentDigit !== animateTo) {
      // If there's an existing animation timeout, clear it.
      // This prevents the animation from being cut short if the digit changes again quickly.
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      
      setPreviousDigit(currentDigit);
      setCurrentDigit(animateTo);
      setIsFlipping(true);

      // Set a new timeout to remove the flipping class after the animation completes.
      timeoutIdRef.current = window.setTimeout(() => {
        setIsFlipping(false);
        timeoutIdRef.current = null;
      }, 600); // This duration must match the CSS animation duration.
    }
  }, [animateTo, currentDigit]);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flip-digit">
      {/* Static top half of the new digit, always visible */}
      <div className="digit-top">
        <span>{currentDigit}</span>
      </div>
      {/* Bottom half: shows previous digit during flip, current digit otherwise */}
      <div className="digit-bottom">
        <span>{isFlipping ? previousDigit : currentDigit}</span>
      </div>
      {/* The animated flipping element */}
      <div className={`flipper ${isFlipping ? 'flipping' : ''}`}>
        {/* The top half of the flipper, shows the old digit and flips down */}
        <div className="flipper-top">
          <span>{isFlipping ? previousDigit : currentDigit}</span>
        </div>
        {/* The bottom half of the flipper, shows the new digit and is revealed at the end */}
        <div className="flipper-bottom">
          <span>{currentDigit}</span>
        </div>
      </div>
    </div>
  );
};


export const CountdownCard: React.FC<CountdownCardProps> = ({ value, label }) => {
  const paddedValue = String(value).padStart(2, '0');
  const [digit1, digit2] = paddedValue.split('');

  return (
    <div className="flex flex-col items-center justify-center bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl border border-white/10">
      <div className="flex gap-1 md:gap-2 perspective">
        <AnimatedDigit animateTo={digit1} />
        <AnimatedDigit animateTo={digit2} />
      </div>
      <span className="mt-4 text-sm md:text-lg font-medium text-gray-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
};