import React, { useEffect } from 'react';
import { Award, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AchievementToast: React.FC = () => {
  const { latestUnlocked, clearLatestUnlocked } = useApp();

  useEffect(() => {
    if (latestUnlocked) {
      const timer = setTimeout(() => {
        clearLatestUnlocked();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [latestUnlocked, clearLatestUnlocked]);

  if (!latestUnlocked) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl shadow-2xl border border-yellow-300/40 flex items-center justify-between gap-3 animate-bounce">
      <div className="flex items-center gap-3">
        <div className="text-3xl p-2 bg-white/20 rounded-xl shrink-0">
          {latestUnlocked.icon || '🏆'}
        </div>
        <div>
          <div className="text-[10px] uppercase font-extrabold tracking-wider text-yellow-200 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Нове досягнення!
          </div>
          <div className="text-sm font-bold tracking-tight">
            «{latestUnlocked.title}»
          </div>
        </div>
      </div>

      <button
        onClick={clearLatestUnlocked}
        className="p-1 rounded-lg hover:bg-white/20 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
