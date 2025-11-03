import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CountdownCard } from './components/CountdownCard';
import { TimeLeft } from './types';

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
  const [formStep, setFormStep] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEventOver, setIsEventOver] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isClient || !targetDate) return;

    const timer = setInterval(() => {
      const difference = targetDate - new Date().getTime();
      setIsEventOver(difference <= 0);
      setTimeLeft(calculateTimeParts(difference));
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, targetDate]);

  const handleDateNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (targetDateInput) {
      const date = new Date(targetDateInput).getTime();
      if (date > new Date().getTime()) {
        setFormStep(2);
      } else {
        alert('미래의 날짜와 시간을 선택해주세요.');
      }
    } else {
      alert('이벤트 날짜와 시간을 먼저 선택해주세요.');
    }
  };
  
  const handleBack = () => {
    setFormStep(1);
  };

  const handleSetCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName.trim() && targetDateInput) {
      const date = new Date(targetDateInput).getTime();
      setTargetDate(date);
    } else {
      alert('이벤트 이름을 입력해주세요.');
    }
  };

  const handleReset = () => {
    setTargetDate(null);
    setEventName('');
    setTargetDateInput('');
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setFormStep(1);
    setIsEventOver(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-4 font-sans rounded-xl border-2 border-slate-700 shadow-2xl">
      <main className="flex flex-col items-center text-center w-full max-w-3xl">
        <Header eventName={targetDate ? eventName : undefined} isEventOver={isEventOver} />

        {!targetDate ? (
          <form
            onSubmit={handleSetCountdown}
            className="mt-12 w-full max-w-md bg-slate-800/50 p-8 rounded-xl shadow-2xl border border-white/10 backdrop-blur-sm"
          >
            {formStep === 1 ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-200">새 이벤트 설정</h2>
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
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDateNext}
                  className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors"
                >
                  다음
                </button>
              </>
            ) : (
              <>
                 <h2 className="text-2xl font-bold mb-6 text-gray-200">이벤트 이름 입력</h2>
                 <div className="mb-4 text-left">
                    <p className="text-sm font-medium text-gray-400">선택된 시간:</p>
                    <p className="font-semibold text-purple-300">
                      {(() => {
                        if (!targetDateInput) return '';
                        const date = new Date(targetDateInput);
                        const dateOptions: Intl.DateTimeFormatOptions = {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          weekday: 'short',
                        };
                        const timeOptions: Intl.DateTimeFormatOptions = {
                           timeStyle: 'short'
                        };
                        const datePart = date.toLocaleDateString('ko-KR', dateOptions).replace(' (', '(');
                        const timePart = date.toLocaleTimeString('ko-KR', timeOptions);
                        return `${datePart} ${timePart}`;
                      })()}
                    </p>
                 </div>
                <div>
                  <label
                    htmlFor="event-name"
                    className="block text-lg font-medium text-gray-400 text-left mb-2"
                  >
                    이벤트 이름
                  </label>
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
                 <div className="mt-8 flex gap-4 w-full">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        뒤로
                    </button>
                    <button
                    type="submit"
                    className="w-2/3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors"
                    >
                    카운트다운 시작
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
            <button
              onClick={handleReset}
              className="mt-12 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {isEventOver ? '새 카운트다운 설정' : '재설정'}
            </button>
          </>
        )}
      </main>
      <footer className="absolute bottom-12 left-0 right-0 text-center space-y-4">
        {isClient && (
          <p
            className="text-slate-300 tracking-wider whitespace-nowrap"
            style={{ 
              fontFamily: "'Malgun Gothic', sans-serif",
              fontSize: 'clamp(0.875rem, 4vw, 1.5rem)' 
            }}
          >
            현재 시간: {currentTime.toLocaleString('ko-KR', {
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
        )}
        <p className="text-sm text-gray-500">A React & Tailwind Countdown Experience</p>
      </footer>
    </div>
  );
};

export default App;