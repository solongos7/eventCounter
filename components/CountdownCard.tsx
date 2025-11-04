import React, { useEffect, useState } from 'react';

interface CountdownCardProps {
  value: number;
  label: string;
}

// This component renders a single digit with a flip animation
const AnimatedDigit = ({ animateTo }: { animateTo: string }) => {
  const [currentDigit, setCurrentDigit] = useState(animateTo);
  const [previousDigit, setPreviousDigit] = useState(animateTo);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (currentDigit !== animateTo) {
      // The current digit is about to be replaced, so it becomes the "previous" one for the animation.
      setPreviousDigit(currentDigit);
      // Start the flipping animation.
      setIsFlipping(true);
    }
  }, [animateTo, currentDigit]);

  const handleAnimationEnd = () => {
    // Once the animation is complete, update the current digit to the new target value.
    setCurrentDigit(animateTo);
    // Stop the animation state.
    setIsFlipping(false);
  };

  return (
    <div className="flip-digit">
      {/* Static top half. Before flip, shows current. During flip, shows the NEW digit underneath the flipper. */}
      <div className="digit-top">
        <span>{isFlipping ? animateTo : currentDigit}</span>
      </div>
      
      {/* 
        Static bottom half.
        When flipping, it shows the PREVIOUS digit and gets covered by the flipper.
        When not flipping, it shows the CURRENT stable digit.
        This prevents the "pop" at the end of the animation, as the content doesn't change
        at the same time the flipper disappears. The flipper's bottom half (with the new digit)
        provides the final visual state.
      */}
      <div className="digit-bottom">
        <span>{isFlipping ? previousDigit : currentDigit}</span>
      </div>
      
      {/* The flipper element is only present during the animation. */}
      {isFlipping && (
        <div className="flipper flipping" onAnimationEnd={handleAnimationEnd}>
          {/* Top of flipper, shows the PREVIOUS digit and flips down. */}
          <div className="flipper-top">
            <span>{previousDigit}</span>
          </div>
          {/* Bottom of flipper, shows the NEW digit, revealed at the end. */}
          <div className="flipper-bottom">
            <span>{animateTo}</span>
          </div>
        </div>
      )}
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