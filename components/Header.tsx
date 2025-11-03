import React from 'react';

interface HeaderProps {
  eventName?: string;
  isEventOver: boolean;
}

export const Header: React.FC<HeaderProps> = ({ eventName, isEventOver }) => {
  return (
    <header className="flex flex-col items-center gap-4">
      <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 px-8 py-4">
        <h1 
          className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 whitespace-nowrap"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}
        >
          {eventName ? eventName : '행사 시작 카운트다운'}
        </h1>
      </div>
      {eventName && (
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 px-6 py-2">
          <p className={`text-lg md:text-xl tracking-wider ${isEventOver ? 'font-bold text-yellow-400' : 'text-gray-400'}`}>
            {isEventOver ? '행사가 시작되었습니다!' : '남은 시간'}
          </p>
        </div>
      )}
    </header>
  );
};