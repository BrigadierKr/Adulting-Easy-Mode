import React, { useState, useMemo } from 'react';
import { Award, Lock, CheckCircle2, Share2, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalDateString, getPluralForm } from '../utils/gamification';

export const AchievementsModule: React.FC = () => {
  const { content, language, unlockedAchievements, activeDays, streak, levelInfo, xp } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [copiedToast, setCopiedToast] = useState(false);

  const totalCount = content.achievements.list.length;
  const unlockedCount = unlockedAchievements.length;
  const percent = Math.round((unlockedCount / totalCount) * 100);

  // Last 7 days in chronological order ending today
  const last7Days = useMemo(() => {
    const list: { date: string; active: boolean; label: string; isToday: boolean }[] = [];
    const locale = language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'uk-UA';
    const todayStr = getLocalDateString();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const dayLabel = d.toLocaleDateString(locale, { weekday: 'short' });
      list.push({
        date: dateStr,
        active: activeDays.includes(dateStr),
        label: dayLabel,
        isToday: dateStr === todayStr,
      });
    }
    return list;
  }, [activeDays, language]);

  const handleShareWeek = async () => {
    const gridString = last7Days.map((d) => (d.active ? '🟨' : '⬜')).join('');
    const streakWord = getPluralForm(
      streak,
      content.gamification.streakForms,
      language
    );
    const link = typeof window !== 'undefined' ? window.location.origin : '';

    const text = content.gamification.shareTemplate
      .replace('{appName}', content.appName)
      .replace('{period}', content.gamification.periodLabel)
      .replace('{grid}', gridString)
      .replace('{streak}', String(streak))
      .replace('{streakWord}', streakWord)
      .replace('{level}', levelInfo.levelName)
      .replace('{xp}', String(xp))
      .replace('{cta}', content.gamification.ctaLine)
      .replace('{link}', link);

    if (navigator.share) {
      try {
        await navigator.share({
          title: content.appName,
          text: text,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      // Fallback
    }
  };

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

      {/* Gamification Wordle Share Card */}
      <section className="bg-white dark:bg-slate-900 border-4 border-black dark:border-slate-700 p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black dark:text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🟩</span>
              <h3 className="text-base font-black uppercase tracking-tight">
                Wordle-тиждень · {content.gamification.periodLabel}
              </h3>
            </div>
            <p className="text-xs font-bold text-black/70 dark:text-slate-300 mt-0.5">
              🔥 {streak} {getPluralForm(streak, content.gamification.streakForms, language)} · 🏅 {levelInfo.levelName} · {xp} {content.gamification.xpLabel}
            </p>
          </div>

          <button
            onClick={handleShareWeek}
            className="self-start sm:self-auto px-4 py-2 bg-[#FFD600] dark:bg-yellow-400 text-black border-3 border-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all flex items-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
          >
            {copiedToast ? (
              <>
                <Check className="w-4 h-4 stroke-[3] text-emerald-700" />
                <span>{content.sos.linkCopied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 stroke-[3]" />
                <span>{content.gamification.shareButton}</span>
              </>
            )}
          </button>
        </div>

        {/* 7-Day Wordle Activity Grid Visualization */}
        <div className="bg-[#F7F7F2] dark:bg-slate-950 border-3 border-black dark:border-slate-700 p-3.5 shadow-inner">
          <div className="grid grid-cols-7 gap-2 text-center">
            {last7Days.map((d, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase text-black/60 dark:text-slate-400">
                  {d.label}
                </span>
                <div
                  className={`w-full aspect-square max-w-[44px] flex items-center justify-center border-2 border-black font-black text-base transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    d.active
                      ? 'bg-[#FFD600] text-black'
                      : 'bg-white dark:bg-slate-800 text-neutral-300 dark:text-slate-600'
                  }`}
                  title={`${d.date}: ${d.active ? 'Активний день' : 'Пропуск'}`}
                >
                  {d.active ? '🟨' : '⬜'}
                </div>
                {d.isToday && (
                  <span className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">
                    {language === 'ua' ? 'Сьогодні' : language === 'en' ? 'Today' : 'Сегодня'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {[
          {
            id: 'all',
            label: language === 'ua' ? `Усі (${totalCount})` : language === 'en' ? `All (${totalCount})` : `Все (${totalCount})`
          },
          {
            id: 'kitchen',
            label: language === 'ua' ? '🍳 Кухня' : language === 'en' ? '🍳 Kitchen' : '🍳 Кухня'
          },
          {
            id: 'utilities',
            label: language === 'ua' ? '💰 Комуналка & Опалення' : language === 'en' ? '💰 Utilities & Heat' : '💰 Коммуналка & Отопление'
          },
          {
            id: 'cleaning',
            label: language === 'ua' ? '🧹 Прибирання' : language === 'en' ? '🧹 Cleaning' : '🧹 Уборка'
          },
          {
            id: 'sos',
            label: language === 'ua' ? '🚨 SOS & Ремонт' : language === 'en' ? '🚨 SOS & Handyman' : '🚨 SOS & Ремонт'
          },
          {
            id: 'general',
            label: language === 'ua' ? '🎓 Загальні' : language === 'en' ? '🎓 General' : '🎓 Общие'
          },
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
