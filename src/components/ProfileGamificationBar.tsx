import React, { useState } from 'react';
import { HelpCircle, ChevronUp, Sparkles, X, Flame, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPluralForm } from '../utils/gamification';

export const ProfileGamificationBar: React.FC = () => {
  const {
    xp,
    streak,
    levelInfo,
    content,
    language,
    xpToast,
    clearXpToast,
    streakLostToast,
    dismissStreakLostToast,
  } = useApp();

  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const streakWord = getPluralForm(
    streak,
    content.gamification.streakForms,
    language
  );

  return (
    <div className="relative border-b-4 border-black dark:border-slate-700 bg-[#FFFBEA] dark:bg-slate-900 transition-colors">
      {/* Floating XP Toast */}
      {xpToast && (
        <div
          onClick={clearXpToast}
          className="fixed top-18 right-4 z-50 animate-bounce cursor-pointer flex items-center gap-2 px-3.5 py-2 bg-[#FFD600] border-3 border-black text-black font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {xpToast.customText ? (
            <span>{xpToast.customText}</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-black stroke-black animate-spin" />
              <span>+{xpToast.amount} {content.gamification.xpLabel}</span>
            </>
          )}
        </div>
      )}

      {/* Streak Lost Alert Banner */}
      {streakLostToast && (
        <div className="bg-red-500 text-white px-4 py-2.5 border-b-3 border-black flex items-center justify-between gap-3 text-xs sm:text-sm font-black shadow-[0_2px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚠️</span>
            <div>
              <span className="uppercase tracking-tight underline mr-1.5">
                {content.gamification.streakLostTitle}:
              </span>
              <span className="font-bold opacity-95">
                {content.gamification.streakLostText}
              </span>
            </div>
          </div>
          <button
            onClick={dismissStreakLostToast}
            className="p-1 bg-black text-white hover:bg-neutral-800 border-2 border-white text-xs uppercase font-extrabold px-2.5 py-1 shrink-0"
          >
            OK
          </button>
        </div>
      )}

      {/* Main Profile Strip */}
      <div className="max-w-3xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Left Stats: Streak & Level */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 border-2 border-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              streak > 0
                ? 'bg-[#FF6D00] text-white'
                : 'bg-zinc-200 dark:bg-slate-800 text-zinc-600 dark:text-slate-400'
            }`}
            title={`Стрік: ${streak} ${streakWord}`}
          >
            <Flame className="w-4 h-4 stroke-[2.5]" />
            <span>
              {streak} {streakWord}
            </span>
          </div>

          {/* Level Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFD600] border-2 border-black text-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            title={`${content.gamification.levelLabel}: ${levelInfo.levelName}`}
          >
            <Award className="w-4 h-4 stroke-[2.5]" />
            <span className="truncate max-w-[120px] sm:max-w-none">
              {levelInfo.levelName}
            </span>
          </div>
        </div>

        {/* Right Stats: XP & Progress Bar & Rules Button */}
        <div className="flex-1 min-w-[200px] flex items-center justify-end gap-2 sm:gap-3">
          <div className="flex-1 max-w-xs flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-black uppercase text-black dark:text-slate-200">
              <span>{xp} {content.gamification.xpLabel}</span>
              <span className="text-[10px] text-black/70 dark:text-slate-400">
                {levelInfo.isMaxLevel
                  ? 'MAX 👑'
                  : `${levelInfo.progressPercent}% (${levelInfo.xpNeededForNext} ${language === 'ua' ? 'до наст.' : language === 'en' ? 'to next' : 'до след.'})`}
              </span>
            </div>
            {/* Neo-brutalist Progress Bar */}
            <div className="h-3 w-full bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-600 overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] p-0.5">
              <div
                className="h-full bg-[#B2FF59] border border-black dark:border-transparent transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Help Toggle Button */}
          <button
            onClick={() => setIsRulesOpen(!isRulesOpen)}
            className="p-1 sm:px-2 sm:py-1 bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-600 text-black dark:text-slate-200 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD600] dark:hover:bg-yellow-400 dark:hover:text-black transition-all flex items-center gap-1 active:translate-x-[1px] active:translate-y-[1px]"
            title={content.gamification.xpRulesTitle}
            aria-expanded={isRulesOpen}
          >
            <HelpCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline font-black">?</span>
            {isRulesOpen && <ChevronUp className="w-3.5 h-3.5 ml-0.5 stroke-[3]" />}
          </button>
        </div>
      </div>

      {/* Collapsible XP Rules Panel */}
      {isRulesOpen && (
        <div className="border-t-3 border-black dark:border-slate-700 bg-white dark:bg-slate-950 p-4 shadow-inner animate-in fade-in duration-150">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h4 className="text-sm font-black uppercase text-black dark:text-white">
                  {content.gamification.xpRulesTitle}
                </h4>
              </div>
              <button
                onClick={() => setIsRulesOpen(false)}
                className="p-1 text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-slate-800 border-2 border-black dark:border-slate-700"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-black dark:text-slate-200">
              {content.gamification.xpRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-[#F7F7F2] dark:bg-slate-900 border-2 border-black dark:border-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="text-base">⚡</span>
                  <span className="leading-snug">{rule}</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-bold italic text-black/70 dark:text-slate-400 pt-1">
              {language === 'ua'
                ? '💡 Рівні: Школяр (0 XP) → Резидент (100 XP) → Побутовий майстер (300 XP) → Легенда ЖК (600+ XP).'
                : language === 'en'
                ? '💡 Levels: Beginner (0 XP) → Resident (100 XP) → Home Master (300 XP) → Building Legend (600+ XP).'
                : '💡 Уровни: Школьник (0 XP) → Резидент (100 XP) → Бытовой мастер (300 XP) → Легенда ЖК (600+ XP).'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
