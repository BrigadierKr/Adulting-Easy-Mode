import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  BookOpen,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Lightbulb,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  HelpCircle,
  CheckSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GuideChapter } from '../types';

export const ExpandedGuideModal: React.FC = () => {
  const {
    content,
    isGuideOpen,
    setIsGuideOpen,
    completedGuideSections,
    toggleGuideSectionDone,
    setActiveTab,
    addXp
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>('guide-meters');
  const [copiedShare, setCopiedShare] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGuideOpen) {
        setIsGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuideOpen, setIsGuideOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isGuideOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGuideOpen]);

  const guide = content.guide;

  const filteredChapters = useMemo(() => {
    if (!guide?.chapters) return [];
    return guide.chapters.filter((chapter) => {
      const matchCategory =
        selectedCategory === 'all' || chapter.category === selectedCategory;
      if (!matchCategory) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const inTitle = chapter.title.toLowerCase().includes(q);
      const inSubtitle = chapter.subtitle.toLowerCase().includes(q);
      const inMomNote = chapter.momNote.toLowerCase().includes(q);
      const inSteps = chapter.steps.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.proTip && s.proTip.toLowerCase().includes(q)) ||
          (s.warning && s.warning.toLowerCase().includes(q))
      );
      const inFaq = chapter.faq?.some(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );

      return inTitle || inSubtitle || inMomNote || inSteps || inFaq;
    });
  }, [guide, selectedCategory, search]);

  const totalChapters = guide?.chapters?.length || 0;
  const completedCount = guide?.chapters?.filter((c) =>
    completedGuideSections.includes(c.id.toLowerCase())
  ).length || 0;
  const progressPercent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

  const handleShare = async () => {
    const shareText = `📖 ${guide.title}\n${guide.subtitle}\nПрочитано: ${completedCount}/${totalChapters} розділів.\nВижити у дорослому житті реально! 🏠`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: guide.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const jumpToModule = (category: string) => {
    setIsGuideOpen(false);
    if (category === 'meters' || category === 'rental') {
      setActiveTab('utilities');
    } else if (category === 'kitchen') {
      setActiveTab('kitchen');
    } else if (category === 'cleaning') {
      setActiveTab('cleaning');
    } else if (category === 'emergency' || category === 'repair') {
      setActiveTab('sos');
    }
  };

  if (!isGuideOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-fadeIn"
      onClick={() => setIsGuideOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div
        className="relative w-full max-w-4xl bg-[#FDFBF7] dark:bg-slate-900 border-4 border-black dark:border-slate-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-4 sm:my-8 text-[#1A1A1A] dark:text-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#FFD600] border-b-4 border-black p-4 sm:p-5 flex items-start justify-between gap-4 text-black shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-black text-white text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 tracking-wider">
                  v2.2 EXPANDED
                </span>
                <span className="bg-white text-black border border-black text-[10px] font-black uppercase px-2 py-0.5">
                  База знань дорослішання
                </span>
              </div>
              <h2
                id="guide-title"
                className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight mt-1"
              >
                {guide.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold opacity-90 mt-0.5">
                {guide.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 font-black text-xs uppercase flex items-center gap-1 active:translate-x-[1px] active:translate-y-[1px]"
              title={copiedShare ? 'Скопійовано!' : guide.printOrShareLabel}
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden md:inline">
                {copiedShare ? 'Скопійовано!' : 'Поділитись'}
              </span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 font-black text-xs uppercase hidden sm:flex items-center gap-1 active:translate-x-[1px] active:translate-y-[1px]"
              title="Друк / Зберегти як PDF"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden md:inline">Друк</span>
            </button>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-10 h-10 bg-black text-white hover:bg-red-600 border-2 border-black flex items-center justify-center font-black text-lg transition-colors active:translate-x-[1px] active:translate-y-[1px]"
              aria-label={guide.closeLabel}
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Gamification Progress Strip */}
        <div className="bg-[#4ECDC4] border-b-2 border-black px-4 py-2.5 text-black flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-black stroke-black shrink-0" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-tight">
              {guide.progressTitle}: {completedCount} / {totalChapters} ({progressPercent}%)
            </span>
            {completedCount === totalChapters && (
              <span className="bg-[#FFD600] border border-black text-[10px] font-black uppercase px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                Всі розділи пройдено! 🏆
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 sm:w-44 h-3.5 bg-white border-2 border-black overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              <div
                className="h-full bg-[#B2FF59] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-black uppercase opacity-90 hidden sm:inline">
              {guide.completeXpReward}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 border-b-2 border-black dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-slate-300 stroke-[3]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={guide.searchPlaceholder}
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-100 dark:bg-slate-900 border-2 border-black dark:border-slate-600 text-sm font-bold placeholder:text-neutral-500 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-[#FFD600] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black p-1 hover:text-red-500"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
                selectedCategory === 'all'
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:bg-yellow-400 dark:text-black'
                  : 'bg-white dark:bg-slate-700 text-black dark:text-slate-200 hover:bg-neutral-100'
              }`}
            >
              {guide.allCategoriesLabel}
            </button>
            {guide.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-black uppercase whitespace-nowrap border-2 border-black flex items-center gap-1.5 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFD600] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black'
                    : 'bg-white dark:bg-slate-700 text-black dark:text-slate-200 hover:bg-neutral-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chapters Content List */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-black dark:border-slate-700 bg-white dark:bg-slate-800">
              <span className="text-4xl block mb-2">🔍</span>
              <h3 className="font-black text-lg uppercase">Розділів не знайдено</h3>
              <p className="text-xs font-bold text-neutral-600 dark:text-slate-400 mt-1">
                Спробуйте змінити пошуковий запит або обрати іншу категорію.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-[#FFD600] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400"
              >
                Скинути фільтри
              </button>
            </div>
          ) : (
            filteredChapters.map((chapter) => {
              const isDone = completedGuideSections.includes(chapter.id.toLowerCase());
              const isExpanded = expandedChapterId === chapter.id;

              return (
                <div
                  key={chapter.id}
                  className={`border-3 border-black dark:border-slate-700 transition-all ${
                    isDone
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'bg-white dark:bg-slate-800'
                  } shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  {/* Chapter Header Accordion */}
                  <div
                    onClick={() =>
                      setExpandedChapterId(isExpanded ? null : chapter.id)
                    }
                    className="p-3.5 sm:p-4 cursor-pointer select-none flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD600] border-2 border-black flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {chapter.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {chapter.badge && (
                            <span className="bg-[#FF6B6B] text-white border border-black text-[9px] font-black uppercase px-1.5 py-0.2">
                              {chapter.badge}
                            </span>
                          )}
                          <span className="text-[10px] font-black uppercase opacity-70">
                            ⏱ {chapter.readTime}
                          </span>
                          {isDone && (
                            <span className="bg-[#B2FF59] text-black border border-black text-[9px] font-black uppercase px-1.5 py-0.2 flex items-center gap-1">
                              ✓ {guide.alreadyReadLabel}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-black uppercase tracking-tight truncate mt-0.5">
                          {chapter.title}
                        </h3>
                        <p className="text-xs font-bold text-neutral-600 dark:text-slate-400 line-clamp-1">
                          {chapter.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGuideSectionDone(chapter.id);
                        }}
                        className={`px-2.5 py-1.5 border-2 border-black font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] ${
                          isDone
                            ? 'bg-[#B2FF59] text-black hover:bg-lime-400'
                            : 'bg-white dark:bg-slate-700 text-black dark:text-white hover:bg-[#FFD600] dark:hover:text-black'
                        }`}
                        title={isDone ? guide.alreadyReadLabel : guide.markReadLabel}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
                            <span className="hidden sm:inline">Зараховано (+10 XP)</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 stroke-[2]" />
                            <span className="hidden sm:inline">{guide.markReadLabel}</span>
                          </>
                        )}
                      </button>

                      <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-neutral-100 dark:bg-slate-700">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 stroke-[3]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chapter Body (Expanded) */}
                  {isExpanded && (
                    <div className="border-t-2 border-black dark:border-slate-700 p-4 sm:p-5 space-y-5 bg-neutral-50/50 dark:bg-slate-900/40 animate-fadeIn">
                      {/* Mom's Note Callout */}
                      <div className="bg-[#FFF9C4] dark:bg-amber-950/40 border-2 border-black dark:border-amber-700 p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 text-black dark:text-amber-100">
                        <div className="w-9 h-9 bg-white dark:bg-amber-900 border-2 border-black dark:border-amber-600 rounded-full flex items-center justify-center text-lg shrink-0">
                          👵
                        </div>
                        <div className="text-xs sm:text-sm">
                          <span className="font-black uppercase tracking-tight block text-[11px] text-amber-900 dark:text-amber-300">
                            Порада від мами:
                          </span>
                          <p className="font-bold italic mt-0.5 leading-relaxed">
                            "{chapter.momNote}"
                          </p>
                        </div>
                      </div>

                      {/* Step-by-Step Instructions */}
                      <div className="space-y-3">
                        <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 stroke-[3] text-black dark:text-slate-200" />
                          Покрокова інструкція:
                        </h4>

                        <div className="space-y-3">
                          {chapter.steps.map((step) => (
                            <div
                              key={step.number}
                              className="bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2"
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 bg-black text-white dark:bg-yellow-400 dark:text-black font-black text-xs flex items-center justify-center shrink-0 border border-black">
                                  {step.number}
                                </span>
                                <div>
                                  <h5 className="font-black text-sm uppercase leading-tight">
                                    {step.title}
                                  </h5>
                                  <p className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-slate-300 mt-1 leading-relaxed">
                                    {step.description}
                                  </p>
                                </div>
                              </div>

                              {/* ProTip */}
                              {step.proTip && (
                                <div className="ml-8 bg-[#E8F5E9] dark:bg-emerald-950/40 border-l-4 border-emerald-600 p-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-start gap-1.5">
                                  <Lightbulb className="w-4 h-4 stroke-[2.5] text-emerald-700 shrink-0 mt-0.5" />
                                  <span>{step.proTip}</span>
                                </div>
                              )}

                              {/* Warning */}
                              {step.warning && (
                                <div className="ml-8 bg-[#FFEBEE] dark:bg-rose-950/40 border-l-4 border-rose-600 p-2 text-xs font-bold text-rose-900 dark:text-rose-200 flex items-start gap-1.5">
                                  <AlertTriangle className="w-4 h-4 stroke-[2.5] text-rose-700 shrink-0 mt-0.5" />
                                  <span>{step.warning}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Practical Checklist (if available) */}
                      {chapter.checklist && chapter.checklist.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            📋 Чекліст до розділу:
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                            {chapter.checklist.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 bg-neutral-100 dark:bg-slate-900 p-2 border border-black/30 dark:border-slate-700"
                              >
                                <span className="text-[#FF6B6B] font-black">✓</span>
                                <span className="text-neutral-800 dark:text-slate-200">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Chapter FAQ */}
                      {chapter.faq && chapter.faq.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 stroke-[3] text-black dark:text-slate-200" />
                            Часті запитання (FAQ):
                          </h4>
                          <div className="space-y-2">
                            {chapter.faq.map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs"
                              >
                                <p className="font-black text-black dark:text-white uppercase">
                                  ❓ {item.question}
                                </p>
                                <p className="font-semibold text-neutral-700 dark:text-slate-300 mt-1 pl-4 border-l-2 border-[#FFD600]">
                                  {item.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action footer inside chapter */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => jumpToModule(chapter.category)}
                          className="px-3 py-1.5 bg-[#B2FF59] hover:bg-lime-400 text-black border-2 border-black font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                        >
                          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Перейти до відповідного модуля в додатку</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleGuideSectionDone(chapter.id)}
                          className={`px-3 py-1.5 border-2 border-black font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            isDone
                              ? 'bg-[#B2FF59] text-black'
                              : 'bg-[#FFD600] text-black hover:bg-yellow-400'
                          }`}
                        >
                          {isDone ? '✓ Розділ завершено (+10 XP)' : '✓ Позначити як прочитаний (+10 XP)'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-800 border-t-4 border-black dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-black uppercase text-neutral-600 dark:text-slate-400">
            💡 Порада: Закріпіть знання на практиці у квізах розділу SOS!
          </div>
          <button
            onClick={() => setIsGuideOpen(false)}
            className="w-full sm:w-auto px-6 py-2.5 bg-black text-white dark:bg-yellow-400 dark:text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-800 active:translate-x-[1px] active:translate-y-[1px]"
          >
            {guide.closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
