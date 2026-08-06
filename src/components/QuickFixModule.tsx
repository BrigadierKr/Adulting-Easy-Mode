import React, { useState } from 'react';
import { AlertTriangle, Search, Share2, Check, HelpCircle, Tags, ChevronDown, ChevronUp, MessageSquareQuote, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { LaundrySymbol } from '../types';

export const QuickFixModule: React.FC = () => {
  const { content, unlockAchievement, markQuizCompleted } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>('S-01');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlipCard = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
    unlockAchievement('ach-10'); // Залізна людина
  };

  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
    if (id === 'S-01') unlockAchievement('ach-16'); // Без паніки
    if (id === 'S-02') unlockAchievement('ach-7'); // Сифон-ніндзя
    if (id === 'S-03') unlockAchievement('ach-11'); // Кросівковий сомельє
    if (id === 'S-04') unlockAchievement('ach-9'); // Розморожувач
  };

  const handleShare = (title: string, id: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Інструкція "Сам собі мама": ${title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${title} - ${window.location.href}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredCards = content.sos.cards.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.query.toLowerCase().includes(search.toLowerCase()) ||
      c.steps.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredSymbols = content.sos.laundrySymbols.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleQuizOption = (qId: string, idx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    markQuizCompleted('sos_quiz');
  };

  return (
    <div className="space-y-6 text-black">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-black stroke-[3]" />
        <input
          type="text"
          placeholder={content.sos.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border-3 border-black bg-white text-sm font-extrabold text-black placeholder:text-black/50 focus:outline-hidden focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        />
      </div>

      {/* SOS Panic Cards */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#FF5252] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              🚨 Швидка побутова допомога
            </h2>
            <p className="text-xs font-bold italic text-black/80">
              Екстрені алгоритми дій у разі хатніх форс-мажорів
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {filteredCards.map((card) => {
            const isOpen = expandedCard === card.id;
            return (
              <div
                key={card.id}
                className="border-3 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <button
                  onClick={() => toggleCard(card.id)}
                  className="w-full p-4 flex items-center justify-between text-left gap-3 focus:outline-hidden hover:bg-yellow-50 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-[#FF5252] text-white border border-black mb-1.5 inline-block shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {card.badge || 'SOS'}
                    </span>
                    <h3 className="text-base font-black text-black uppercase">
                      {card.title}
                    </h3>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-black stroke-[3]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-black stroke-[3]" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t-3 border-black bg-white space-y-3">
                    {/* YouTube Bridge Button */}
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(card.query || card.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-black text-[#FFD600] font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD600] hover:text-black transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 min-h-[44px] mt-2 mb-1"
                    >
                      <Video className="w-4 h-4 stroke-[2.5]" />
                      <span>{content.sos.watchVideo}</span>
                    </a>

                    <div className="p-2.5 bg-[#FFD600] border-2 border-black text-xs font-black text-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {content.dontPanic}
                    </div>

                    <ol className="space-y-2 text-xs font-bold text-black">
                      {card.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 p-2 bg-[#F7F7F2] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span className="w-5 h-5 bg-black text-white text-[10px] font-black flex items-center justify-center shrink-0 border border-black">
                            {idx + 1}
                          </span>
                          <span className="font-extrabold">{step}</span>
                        </li>
                      ))}
                    </ol>

                    {card.humor && (
                      <p className="text-xs font-bold italic text-black bg-[#B2FF59] p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        💬 «{card.humor}»
                      </p>
                    )}

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleShare(card.title, card.id)}
                        className="px-3.5 py-1.5 bg-white border-2 border-black text-xs font-black text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedId === card.id ? <Check className="w-4 h-4 text-black stroke-[3]" /> : <Share2 className="w-4 h-4 text-black stroke-[3]" />}
                        {copiedId === card.id ? content.sos.linkCopied : content.sos.shareCard}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Laundry Symbol Decoder [S-05] */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#FFD600] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Tags className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              {content.sos.laundryTitle}
            </h2>
            <p className="text-xs font-bold italic text-black/80">
              {content.sos.laundrySubtitle}
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { id: 'all', label: 'Усі значки' },
            { id: 'washing', label: 'Прання' },
            { id: 'bleaching', label: 'Відбілювання' },
            { id: 'drying', label: 'Сушка' },
            { id: 'ironing', label: 'Прасування' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] ${
                selectedCategory === cat.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-yellow-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3D Flip Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-2">
          {filteredSymbols.map((sym) => {
            const isFlipped = !!flippedCards[sym.id];
            return (
              <div
                key={sym.id}
                className="h-48 cursor-pointer select-none"
                style={{ perspective: '1000px' }}
                onClick={() => toggleFlipCard(sym.id)}
                aria-label={`${sym.title} - ${isFlipped ? sym.desc : 'натисніть щоб розвернути'}`}
              >
                <motion.div
                  className="w-full h-full relative"
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front face (White) */}
                  <div
                    className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 border-3 border-black dark:border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 flex flex-col items-center justify-between text-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="w-full text-right">
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-zinc-100 dark:bg-slate-700 text-black dark:text-slate-200 border border-black dark:border-slate-500">
                        {sym.category}
                      </span>
                    </div>
                    <div className="text-4xl font-black text-black dark:text-white">{sym.symbol}</div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-black dark:text-white leading-tight line-clamp-2 mb-1">
                        {sym.title}
                      </h4>
                      <span className="text-[10px] font-extrabold text-black/60 dark:text-slate-400 flex items-center justify-center gap-1">
                        <span>🔄</span> Тапни підказку
                      </span>
                    </div>
                  </div>

                  {/* Back face (Yellow) */}
                  <div
                    className="absolute inset-0 w-full h-full bg-[#FFD600] text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 flex flex-col justify-between text-center"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="space-y-1">
                      <span className="text-2xl block">{sym.symbol}</span>
                      <p className="text-[11px] font-black uppercase leading-tight border-b border-black/20 pb-1">
                        {sym.desc}
                      </p>
                    </div>
                    <div className="bg-white p-1.5 border-2 border-black text-[10px] font-bold italic line-clamp-3 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black">
                      «{sym.momNote}»
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SOS Quiz */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#B2FF59] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <HelpCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            {content.sos.quizTitle}
          </h2>
        </div>

        <div className="space-y-5">
          {content.sos.quiz.map((q) => {
            const selected = selectedQuizAnswers[q.id];
            return (
              <div key={q.id} className="p-4 bg-[#F7F7F2] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-sm font-black text-black mb-3">
                  {q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selected === optIdx;
                    const isCorrect = q.correctIndex === optIdx;
                    let btnStyle = 'bg-white border-2 border-black text-black hover:bg-[#FFD600] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-[#B2FF59] border-2 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-[#FF5252] border-2 border-black text-white font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#FFD600] border-2 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleQuizOption(q.id, optIdx)}
                        className={`p-3 text-xs font-bold text-left transition-all active:translate-x-[1px] active:translate-y-[1px] ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-xs font-bold text-black italic bg-white p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!quizSubmitted ? (
          <button
            onClick={handleQuizSubmit}
            disabled={Object.keys(selectedQuizAnswers).length < content.sos.quiz.length}
            className="mt-5 w-full py-3.5 bg-black hover:bg-zinc-800 disabled:opacity-50 text-white border-2 border-black font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Перевірити знання SOS
          </button>
        ) : (
          <div className="mt-5 p-3 bg-[#B2FF59] border-2 border-black text-black text-xs font-black uppercase text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            🎉 Молодчина! Тепер тебе не злякати жодним форс-мажором!
          </div>
        )}
      </section>
    </div>
  );
};
