
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CountdownCard } from './components/CountdownCard';
import { TimeLeft } from './types';
import { BackgroundSelector, backgroundOptions } from './components/BackgroundSelector';

// Helper function to calculate time parts from a total difference in milliseconds
const calculateTimeParts = (totalDifference: number): TimeLeft => {
  const absoluteDifference = Math.abs(totalDifference);
  return {
    days: Math.floor(absoluteDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((absoluteDifference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((absoluteDifference / 1000 / 60) % 60),
    seconds: Math.floor((absoluteDifference / 1000) % 60),
  };
};

const App: React.FC = () => {
  const [eventName, setEventName] = useState<string>('');
  const [targetDateInput, setTargetDateInput] = useState<string>('');
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEventOver, setIsEventOver] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [background, setBackground] = useState<string>('slate');
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemainingOnPause, setTimeRemainingOnPause] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    const savedBackground = localStorage.getItem('countdownBackground');
    if (savedBackground && backgroundOptions[savedBackground]) {
      setBackground(savedBackground);
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isClient || !targetDate || isPaused) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now.getTime();
      setIsEventOver(difference <= 0);
      setTimeLeft(calculateTimeParts(difference));

      if (startDate) {
        if (difference <= 0) {
          setProgress(100);
        } else {
          const totalDuration = targetDate - startDate;
          const elapsed = now.getTime() - startDate;
          setProgress(Math.min(100, (elapsed / totalDuration) * 100));
        }
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, targetDate, startDate, isPaused]);
  
  const formatDateTimeLocal = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const addTime = (minutes: number) => {
    let baseDate = new Date();
    if (targetDateInput) {
      const currentDate = new Date(targetDateInput);
      if (!isNaN(currentDate.getTime()) && currentDate.getTime() > Date.now()) {
        baseDate = currentDate;
      }
    }
    const newTargetTime = new Date(baseDate.getTime() + minutes * 60 * 1000);
    setTargetDateInput(formatDateTimeLocal(newTargetTime));
  };

  const adjustTime = (unit: 'hours' | 'minutes' | 'seconds', amount: number) => {
    if (!targetDateInput) return;
    const date = new Date(targetDateInput);
    if (isNaN(date.getTime())) return;
    if (unit === 'hours') date.setHours(date.getHours() + amount);
    if (unit === 'minutes') date.setMinutes(date.getMinutes() + amount);
    if (unit === 'seconds') date.setSeconds(date.getSeconds() + amount);
    setTargetDateInput(formatDateTimeLocal(date));
  };
  
  const handleDateTimeReset = () => {
    setTargetDateInput('');
  };

  const handleNameNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (eventName.trim()) {
      setFormStep(2);
    } else {
      alert('이벤트 이름을 입력해주세요.');
    }
  };
  
  const handleBack = () => {
    setFormStep(1);
  };

  const handleSetCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDateInput) {
      alert('이벤트 날짜와 시간을 선택해주세요.');
      return;
    }
    const date = new Date(targetDateInput).getTime();
    if (date <= new Date().getTime()) {
      alert('미래의 날짜와 시간을 선택해주세요.');
      return;
    }
    if (eventName.trim()) {
      setStartDate(new Date().getTime());
      setTargetDate(date);
    }
  };
  
  const handlePauseResume = () => {
    if (isEventOver) return;

    if (isPaused) {
      // Resume
      if (timeRemainingOnPause && targetDate && startDate) {
        const now = new Date().getTime();
        const newTargetDate = now + timeRemainingOnPause;
        const pauseDuration = newTargetDate - targetDate;

        setTargetDate(newTargetDate);
        setStartDate(startDate + pauseDuration);
        
        setIsPaused(false);
        setTimeRemainingOnPause(null);
      }
    } else {
      // Pause
      if (targetDate) {
        setTimeRemainingOnPause(targetDate - new Date().getTime());
        setIsPaused(true);
      }
    }
  };

  const handleReset = () => {
    setTargetDate(null);
    setEventName('');
    setTargetDateInput('');
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setFormStep(1);
    setIsEventOver(false);
    setStartDate(null);
    setProgress(0);
    setIsPaused(false);
    setTimeRemainingOnPause(null);
  };

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground);
    localStorage.setItem('countdownBackground', newBackground);
  };

  const renderCurrentTime = () => (
    <p
      className="text-slate-300 tracking-wider whitespace-nowrap mt-4"
      style={{ 
        fontFamily: "'Malgun Gothic', sans-serif",
        fontSize: 'clamp(0.875rem, 3vw, 1.25rem)' 
      }}
    >
      <span className="font-semibold text-slate-400">현재 시간: </span>
      {currentTime.toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
      }).replace(' (', '(')}
    </p>
  );

  return (
    <div className={`h-full ${backgroundOptions[background]?.classes || backgroundOptions.slate.classes} text-white flex flex-col items-center p-4 font-sans rounded-xl border-2 border-slate-700 shadow-2xl overflow-y-auto`}>
      <main className="flex flex-col items-center justify-center text-center w-full max-w-3xl flex-grow my-auto">
        
        {targetDate && startDate ? (
          <>
            <Header 
              eventName={eventName} 
              isEventOver={isEventOver} 
              progress={progress}
            />
            {isClient && renderCurrentTime()}
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 px-6 py-2 mt-4">
              <p className={`text-lg md:text-xl tracking-wider ${isEventOver ? 'font-bold text-yellow-400' : 'text-gray-400'}`}>
                {isEventOver ? '행사가 시작되었습니다!' : '남은 시간'}
              </p>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center">
             {formStep === 1 ? (
                <div className="w-full bg-slate-700/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 px-2 sm:px-4 py-4 overflow-hidden">
                    <h1 className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center whitespace-nowrap"
                        style={{ fontSize: 'clamp(2rem, 10vw, 4.5rem)' }}>
                        이벤트 카운터
                    </h1>
                </div>
             ) : (
                <Header eventName={eventName} isEventOver={false} progress={0} showProgressBar={false} />
             )}
             {isClient && renderCurrentTime()}
          </div>
        )}

        {!targetDate ? (
          <form
            onSubmit={handleSetCountdown}
            className="mt-8 w-full max-w-lg bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-2xl border border-white/10 backdrop-blur-sm"
          >
            {formStep === 1 ? (
              <>
                 <h2 className="text-2xl font-bold mb-6 text-gray-200">이벤트 이름 입력</h2>
                <div>
                  <input
                    id="event-name"
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="예: 새해맞이"
                    required
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNameNext}
                  className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors"
                >
                  다음
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-200">날짜 및 시간 설정</h2>
                </div>
                <div>
                  <label
                    htmlFor="target-date"
                    className="block text-sm font-medium text-gray-400 text-left mb-2"
                  >
                    이벤트 날짜 및 시간
                  </label>
                  <input
                    id="target-date"
                    type="datetime-local"
                    value={targetDateInput}
                    onChange={(e) => setTargetDateInput(e.target.value)}
                    required
                    step="1"
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-400 text-left mb-2">
                        시간 추가
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button type="button" onClick={() => addTime(60)} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors text-sm">1시간</button>
                        <button type="button" onClick={() => addTime(30)} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors text-sm">30분</button>
                        <button type="button" onClick={() => addTime(15)} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors text-sm">15분</button>
                        <button type="button" onClick={() => addTime(5)} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors text-sm">5분</button>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-400 text-left mb-2">
                        시간 정밀 조정
                    </label>
                    <div className="grid grid-cols-3 gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                        {([['시간', 'hours'], ['분', 'minutes'], ['초', 'seconds']] as const).map(([label, unit]) => (
                            <div key={unit} className="flex flex-col items-center gap-2">
                                <span className="text-sm font-semibold text-gray-300 uppercase">{label}</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => adjustTime(unit, -1)}
                                        disabled={!targetDateInput}
                                        className="w-10 h-8 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg flex items-center justify-center transition-colors"
                                        aria-label={`${label} 감소`}
                                    >
                                        -
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => adjustTime(unit, 1)}
                                        disabled={!targetDateInput}
                                        className="w-10 h-8 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg flex items-center justify-center transition-colors"
                                        aria-label={`${label} 증가`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="mt-8 flex gap-4 w-full">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        처음으로
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors"
                    >
                        시작
                    </button>
                    <button
                        type="button"
                        onClick={handleDateTimeReset}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        aria-label="날짜 및 시간 초기화"
                    >
                        초기화
                    </button>
                 </div>
              </>
            )}
          </form>
        ) : (
          <>
            <div
              className={`mt-12 grid ${
                timeLeft.days > 0 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
              } gap-4 md:gap-8 w-full`}
            >
              {timeLeft.days > 0 && (
                <CountdownCard value={timeLeft.days} label="일" />
              )}
              <CountdownCard value={timeLeft.hours} label="시간" />
              <CountdownCard value={timeLeft.minutes} label="분" />
              <CountdownCard value={timeLeft.seconds} label="초" />
            </div>
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={handlePauseResume}
                disabled={isEventOver}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaused ? '재시작' : '잠시멈춤'}
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                {isEventOver ? '새 카운트다운 설정' : '재설정'}
              </button>
            </div>
          </>
        )}
      </main>
      <footer className="w-full text-center py-4 flex flex-col items-center gap-4">
        {!targetDate && (
          <BackgroundSelector 
            selectedBackground={background}
            onBackgroundChange={handleBackgroundChange}
          />
        )}
        <p className="text-sm text-gray-500">React와 Tailwind로 만든 카운트다운</p>
      </footer>
    </div>
  );
};

export default App;
