import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CookingTimerProps {
  initialMinutes: number;
  recipeTitle: string;
}

export const CookingTimer: React.FC<CookingTimerProps> = ({ initialMinutes, recipeTitle }) => {
  const { content, unlockAchievement } = useApp();
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setTimeLeft(initialMinutes * 60);
    setIsRunning(false);
    setIsFinished(false);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
      playAlarmSound();
      unlockAchievement('ach-14'); // Яйце-ідеал
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const playAlarmSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio context error', e);
    }
  };

  const toggleTimer = () => {
    if (isFinished) {
      setTimeLeft(initialMinutes * 60);
      setIsFinished(false);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(initialMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mt-4 p-4 bg-[#FFD600] border-3 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isFinished ? 'bg-[#FF5252] text-white animate-bounce' : 'bg-black text-white'}`}>
          <Bell className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-[11px] uppercase font-black tracking-wider text-black">
            Таймер: {recipeTitle}
          </div>
          <div className="text-2xl font-black font-mono tracking-tighter text-black">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTimer}
          className={`px-4 py-2 border-2 border-black text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] ${
            isRunning
              ? 'bg-black text-white hover:bg-zinc-800'
              : isFinished
              ? 'bg-[#B2FF59] text-black hover:bg-lime-400'
              : 'bg-white text-black hover:bg-zinc-100'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 stroke-[3]" /> {content.kitchen.timerStop}
            </>
          ) : (
            <>
              <Play className="w-4 h-4 stroke-[3]" /> {content.kitchen.timerStart}
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="p-2 bg-white border-2 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100 transition-all active:translate-x-[1px] active:translate-y-[1px]"
          title="Скинути"
        >
          <RotateCcw className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {isFinished && (
        <div className="w-full text-center text-xs font-black uppercase text-white bg-[#FF5252] border-2 border-black py-2 px-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">
          {content.kitchen.timerDone}
        </div>
      )}
    </div>
  );
};
