import React from 'react';
import { Sparkles, CheckSquare, Square, RotateCcw, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CleaningModule: React.FC = () => {
  const {
    content,
    dailyChecked,
    toggleDailyTask,
    weeklyChecked,
    toggleWeeklyTask,
    resetChecklists,
  } = useApp();

  const dailyTasks = content.cleaning.dailyTasks;
  const weeklyTasks = content.cleaning.weeklyTasks;

  const dailyCompletedCount = Object.keys(dailyChecked).filter((k) => dailyChecked[Number(k)]).length;
  const dailyPercent = Math.round((dailyCompletedCount / dailyTasks.length) * 100);

  const weeklyCompletedCount = Object.keys(weeklyChecked).filter((k) => weeklyChecked[Number(k)]).length;
  const weeklyPercent = Math.round((weeklyCompletedCount / weeklyTasks.length) * 100);

  return (
    <div className="space-y-6 text-black">
      {/* Daily 7-Min Checklist [П-01] */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00E5FF] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                {content.cleaning.dailyTitle}
              </h2>
              <p className="text-xs font-bold italic text-black/80">
                {content.cleaning.dailySubtitle}
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-black text-white border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {dailyCompletedCount} / {dailyTasks.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-4 border-2 border-black bg-white overflow-hidden p-0.5 mb-5">
          <div
            className="h-full bg-[#00E5FF] border border-black transition-all duration-300"
            style={{ width: `${dailyPercent}%` }}
          ></div>
        </div>

        <div className="space-y-2.5">
          {dailyTasks.map((task, idx) => {
            const isChecked = !!dailyChecked[idx];
            return (
              <button
                key={idx}
                onClick={() => toggleDailyTask(idx)}
                className={`w-full p-3.5 border-2 border-black text-left flex items-center justify-between gap-3 transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                  isChecked
                    ? 'bg-[#B2FF59] text-black line-through font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-[#F7F7F2] text-black font-extrabold hover:bg-cyan-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <span className="text-sm">{task}</span>
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-black shrink-0 stroke-[3]" />
                ) : (
                  <Square className="w-5 h-5 text-black/40 shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>

        {dailyPercent === 100 && (
          <div className="mt-5 p-3.5 bg-[#FFD600] border-2 border-black text-black text-xs font-black uppercase text-center flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-bounce">
            <Award className="w-5 h-5 stroke-[3]" /> {content.cleaning.allDone}
          </div>
        )}
      </section>

      {/* Weekly Checklist [П-02] */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FF5252] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                {content.cleaning.weeklyTitle}
              </h2>
              <p className="text-xs font-bold italic text-black/80">
                Раз на тиждень для підтримки королівського затишку
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-black text-white border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {weeklyCompletedCount} / {weeklyTasks.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-4 border-2 border-black bg-white overflow-hidden p-0.5 mb-5">
          <div
            className="h-full bg-[#FF5252] border border-black transition-all duration-300"
            style={{ width: `${weeklyPercent}%` }}
          ></div>
        </div>

        <div className="space-y-2.5">
          {weeklyTasks.map((task, idx) => {
            const isChecked = !!weeklyChecked[idx];
            return (
              <button
                key={idx}
                onClick={() => toggleWeeklyTask(idx)}
                className={`w-full p-3.5 border-2 border-black text-left flex items-center justify-between gap-3 transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                  isChecked
                    ? 'bg-[#B2FF59] text-black line-through font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-[#F7F7F2] text-black font-extrabold hover:bg-rose-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <span className="text-sm">{task}</span>
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-black shrink-0 stroke-[3]" />
                ) : (
                  <Square className="w-5 h-5 text-black/40 shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={resetChecklists}
            className="px-4 py-2.5 bg-[#FFD600] hover:bg-yellow-300 border-2 border-black text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" /> {content.cleaning.resetAll}
          </button>
        </div>
      </section>
    </div>
  );
};
