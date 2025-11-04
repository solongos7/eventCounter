import React from 'react';

// A map of background keys to their display names and full Tailwind CSS classes
export const backgroundOptions: { [key: string]: { name: string; classes: string } } = {
  slate: { name: '슬레이트', classes: 'bg-gradient-to-br from-gray-900 to-slate-800' },
  ocean: { name: '오션', classes: 'bg-gradient-to-br from-blue-900 to-indigo-900' },
  sunset: { name: '선셋', classes: 'bg-gradient-to-br from-purple-800 to-pink-800' },
  aurora: { name: '오로라', classes: 'bg-animated-aurora' },
};

interface BackgroundSelectorProps {
  selectedBackground: string;
  onBackgroundChange: (backgroundKey: string) => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ selectedBackground, onBackgroundChange }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-gray-400">배경 테마</p>
      <div className="flex justify-center items-center gap-3 p-2 bg-slate-800/50 rounded-full border border-white/10">
        {Object.keys(backgroundOptions).map((key) => (
          <button
            key={key}
            onClick={() => onBackgroundChange(key)}
            className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white ${
              selectedBackground === key ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''
            } ${backgroundOptions[key].classes}`}
            aria-label={`${backgroundOptions[key].name} 테마 선택`}
            title={backgroundOptions[key].name}
          />
        ))}
      </div>
    </div>
  );
};
