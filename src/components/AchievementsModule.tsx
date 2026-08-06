import React, { useState } from 'react';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AchievementsModule: React.FC = () => {
  const { content, unlockedAchievements } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const totalCount = content.achievements.list.length;
  const unlockedCount = unlockedAchievements.length;
  const percent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = content.achievements.list.filter((ach) => {
    if (filter === 'all') return true;
    return ach.category === filter;
  });

  return (
    <div className="space-y-6 text-black">
      {/* Header Banner */}
      <section className="bg-[#FFD600] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <Award className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              {content.achievements.title}
            </h2>
            <p className="text-xs font-bold italic text-black/90">
              {content.achievements.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black uppercase">
            <span>{content.achievements.unlockedCount}: {unlockedCount} / {totalCount}</span>
            <span>{percent}%</span>
          </div>
          <div className="h-5 border-2 border-black bg-white overflow-hidden p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div
              className="h-full bg-[#B2FF59] border border-black transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Усі (20)' },
          { id: 'kitchen', label: '🍳 Кухня' },
          { id: 'utilities', label: '💰 Комуналка' },
          { id: 'cleaning', label: '🧹 Прибирання' },
          { id: 'sos', label: '🚨 SOS' },
          { id: 'general', label: '🎓 Загальні' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] ${
              filter === f.id
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-yellow-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid of 20 Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredAchievements.map((ach) => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`p-4 border-3 border-black transition-all flex items-start gap-3.5 ${
                isUnlocked
                  ? 'bg-[#FFD600] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-[#F7F7F2] text-black/50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-75'
              }`}
            >
              <div
                className={`w-12 h-12 border-2 border-black flex items-center justify-center text-2xl shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  isUnlocked
                    ? 'bg-white text-black'
                    : 'bg-zinc-200 text-zinc-400'
                }`}
              >
                {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-black/50 stroke-[2.5]" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-black uppercase truncate text-black">
                    {ach.title}
                  </h3>
                  {isUnlocked && (
                    <CheckCircle2 className="w-5 h-5 text-black shrink-0 stroke-[3]" />
                  )}
                </div>
                <p className="text-xs font-bold text-black/85 leading-snug">
                  {ach.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
