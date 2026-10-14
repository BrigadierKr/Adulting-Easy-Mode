import React, { useState } from 'react';
import { Flame, Wrench, Sparkles, ChevronRight, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AutumnDropBanner: React.FC = () => {
  const { language, setActiveTab, completedDropCards } = useApp();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dismiss_autumn_banner') === 'true';
    } catch {
      return false;
    }
  });

  const allDropCards = [
    'h-01', 'h-02', 'h-03', 'h-04', 'h-05',
    'r-01', 'r-02', 'r-03', 'r-04', 'r-05'
  ];
  const completedCount = allDropCards.filter((id) => completedDropCards.includes(id)).length;

  if (isDismissed) {
    return (
      <div className="flex justify-between items-center p-2.5 bg-orange-100 dark:bg-amber-950/40 border-2 border-black dark:border-amber-700 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 text-black dark:text-amber-200">
          <span>🍂</span>
          <span>
            {language === 'ua' && 'Осінній дроп v2.0 активний'}
            {language === 'en' && 'Autumn Drop v2.0 is active'}
            {language === 'ru' && 'Осенний дроп v2.0 активен'}
          </span>
          <span className="px-2 py-0.5 bg-[#B2FF59] text-black border border-black text-[10px]">
            {completedCount}/{allDropCards.length}
          </span>
        </div>
        <button
          onClick={() => {
            setIsDismissed(false);
            localStorage.removeItem('dismiss_autumn_banner');
          }}
          className="text-[11px] underline font-extrabold text-black dark:text-amber-300 hover:text-red-600"
        >
          {language === 'ua' ? 'Показати деталі' : language === 'en' ? 'Show details' : 'Показать детали'}
        </button>
      </div>
    );
  }

  return (
    <section className="relative border-4 border-black bg-gradient-to-r from-[#FFF3E0] via-[#FFE0B2] to-[#FFD54F] dark:from-amber-950 dark:via-orange-950 dark:to-amber-900 p-4 sm:p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-[#FFD600] border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-3.5 h-3.5 stroke-[3] text-orange-400" />
          <span>
            {language === 'ua' && '🍂 ОСІННІЙ ДРОП v2.0'}
            {language === 'en' && '🍂 AUTUMN DROP v2.0'}
            {language === 'ru' && '🍂 ОСЕННИЙ ДРОП v2.0'}
          </span>
        </div>

        <button
          onClick={() => {
            setIsDismissed(true);
            localStorage.setItem('dismiss_autumn_banner', 'true');
          }}
          className="p-1 text-black/70 hover:text-black dark:text-amber-300 dark:hover:text-white"
          title="Приховати банер"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      <div className="space-y-1.5 mb-3">
        <h3 className="text-lg sm:text-xl font-black uppercase text-black dark:text-amber-100 tracking-tight leading-snug">
          {language === 'ua' && 'Опалювальний сезон + Дрібний ремонт без шоку!'}
          {language === 'en' && 'Heating Season + Handyman Basics Without Shock!'}
          {language === 'ru' && 'Отопительный сезон + Мелкий ремонт без шока!'}
        </h3>
        <p className="text-xs font-bold text-black/85 dark:text-amber-200">
          {language === 'ua' && '10 сезонних карток з кнопками «✓ Зроблено», перевірка батарей, D-профіль, WD-40, гібридне правило відео та 6 нових досягнень!'}
          {language === 'en' && '10 seasonal guides with "✓ Done" tracking, radiator bleeding, D-profile draft sealing, WD-40 rules, hybrid video safety, and 6 new achievements!'}
          {language === 'ru' && '10 сезонных карточек с кнопками «✓ Сделано», спуск воздуха, D-профиль, WD-40, гибридное правило видео и 6 новых достижений!'}
        </p>
      </div>

      {/* Progress & Quick Links */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-black/20 dark:border-amber-700/50">
        <div className="flex items-center gap-1.5 text-xs font-black text-black dark:text-amber-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-lime-400 stroke-[2.5]" />
          <span>
            {language === 'ua' && `Виконано карток дропу: ${completedCount}/${allDropCards.length}`}
            {language === 'en' && `Drop cards completed: ${completedCount}/${allDropCards.length}`}
            {language === 'ru' && `Выполнено карточек дропа: ${completedCount}/${allDropCards.length}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('utilities')}
            className="px-3 py-1.5 bg-[#FFD600] text-black border-2 border-black font-black text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Flame className="w-3.5 h-3.5 stroke-[2.5] text-red-600" />
            <span>{language === 'ua' ? 'Опалення' : language === 'en' ? 'Heating' : 'Отопление'}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          <button
            onClick={() => setActiveTab('sos')}
            className="px-3 py-1.5 bg-white text-black border-2 border-black font-black text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Wrench className="w-3.5 h-3.5 stroke-[2.5] text-slate-800" />
            <span>{language === 'ua' ? 'Ремонт' : language === 'en' ? 'Handyman' : 'Ремонт'}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>
    </section>
  );
};
