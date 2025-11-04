
import React, { useLayoutEffect, useRef } from 'react';

interface HeaderProps {
  eventName: string;
  isEventOver: boolean;
  progress: number;
  showProgressBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ eventName, isEventOver, progress, showProgressBar = true }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      const title = titleRef.current;
      const container = containerRef.current;
      if (!title || !container) return;
      
      // Reset font size to a large value to get an accurate scrollWidth for scaling
      title.style.fontSize = '120px';

      const containerWidth = container.clientWidth;
      const titleWidth = title.scrollWidth;

      const minFontSizePx = 16;
      const maxFontSizePx = 120; 

      if (titleWidth === 0) return;

      // Calculate the ideal font size based on the ratio, with a more generous safety buffer
      const scaleRatio = containerWidth / titleWidth;
      let finalSize = 120 * scaleRatio * 0.95; // Use a 5% safety buffer
      
      // Clamp the final size within our defined boundaries
      finalSize = Math.max(minFontSizePx, Math.min(finalSize, maxFontSizePx));

      title.style.fontSize = `${finalSize}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [eventName]);

  return (
    <header className="flex flex-col items-center gap-2 w-full">
      <div 
        ref={containerRef}
        className="w-full bg-slate-700/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 px-2 sm:px-4 py-4 overflow-hidden"
      >
        <h1 
          ref={titleRef}
          className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center whitespace-nowrap"
        >
          {eventName}
        </h1>
      </div>

      {!isEventOver && showProgressBar && (
        <div className="w-full max-w-xl bg-slate-700 rounded-full h-3 mt-2 border border-slate-600 overflow-hidden">
            <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" 
                style={{ 
                  width: `${progress}%`, 
                  transition: 'width 0.5s linear' 
                }}
            ></div>
        </div>
      )}
    </header>
  );
};
