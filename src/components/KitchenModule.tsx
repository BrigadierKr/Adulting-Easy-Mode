import React, { useState } from 'react';
import { Utensils, Flame, Clock, Droplets, MessageCircle, HelpCircle, CheckCircle2, ChevronDown, ChevronUp, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CookingTimer } from './CookingTimer';

export const KitchenModule: React.FC = () => {
  const { content, unlockAchievement, markQuizCompleted } = useApp();
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>('K-01');
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleRecipe = (id: string) => {
    setExpandedRecipe((prev) => (prev === id ? null : id));
    unlockAchievement('ach-3'); // Гречка-гуру або огляд
  };

  const handleQuizOption = (qId: string, idx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    markQuizCompleted('kitchen_quiz');
    unlockAchievement('ach-1'); // Не спалив кухню
  };

  return (
    <div className="space-y-6">
      {/* 5-Minute Recipes Grid */}
      <section className="bg-[#FFD600] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <Utensils className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                {content.kitchen.recipesTitle}
              </h2>
              <p className="text-xs font-bold italic text-black/80">
                Прості та смачні страви без виклику ДСНС
              </p>
            </div>
          </div>
          <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hidden sm:inline-block">
            Пріоритет #1
          </span>
        </div>

        <div className="space-y-3.5">
          {content.kitchen.recipes.map((recipe) => {
            const isOpen = expandedRecipe === recipe.id;
            return (
              <div
                key={recipe.id}
                className="border-3 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <button
                  onClick={() => toggleRecipe(recipe.id)}
                  className="w-full p-4 flex items-center justify-between text-left gap-3 focus:outline-hidden hover:bg-yellow-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black px-2.5 py-1 bg-black text-white border border-black uppercase tracking-wider">
                      {recipe.id}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-black uppercase">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-bold text-black/75 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-black stroke-[3]" /> {recipe.timeMinutes} хв
                        </span>
                        {recipe.waterRatio && (
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3.5 h-3.5 text-black stroke-[3]" /> {recipe.waterRatio}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-black stroke-[3]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-black stroke-[3]" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-2 border-t-3 border-black bg-white space-y-3">
                    {/* YouTube Bridge Button */}
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.query || recipe.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-black text-[#FFD600] font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD600] hover:text-black transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <Video className="w-4 h-4 stroke-[2.5]" />
                      <span>{content.kitchen.watchVideo}</span>
                    </a>

                    <ol className="space-y-2 text-sm text-black font-bold list-decimal list-inside pt-1">
                      {recipe.steps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>

                    <div className="p-3 bg-[#FFD600] border-2 border-black text-xs font-bold text-black flex items-start gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <MessageCircle className="w-4 h-4 text-black shrink-0 mt-0.5 stroke-[3]" />
                      <p className="italic">«{recipe.humor}»</p>
                    </div>

                    <CookingTimer initialMinutes={recipe.timeMinutes} recipeTitle={recipe.title} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SOS Food is Burning Emergency Card */}
      <section className="bg-[#FF5252] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white relative">
        <div className="bg-black text-white px-4 py-1.5 font-black text-sm uppercase italic border-2 border-black inline-block mb-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          {content.dontPanic}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] animate-bounce">
            <Flame className="w-6 h-6 text-[#FFD600] stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {content.kitchen.sosTitle}
            </h2>
            <p className="text-xs font-extrabold uppercase text-yellow-300 tracking-wider">
              Екстрені дії за 30 секунд
            </p>
          </div>
        </div>

        <ul className="space-y-2.5 text-sm text-black mt-3">
          {content.kitchen.sosSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-6 h-6 bg-black text-white text-xs font-black flex items-center justify-center shrink-0 border border-black">
                {idx + 1}
              </span>
              <span className="font-extrabold">{step}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => unlockAchievement('ach-15')}
            className="px-5 py-2.5 bg-[#FFD600] border-2 border-black text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[3]" /> Я врятував страву!
          </button>
        </div>
      </section>

      {/* Kitchen Quiz */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-[#B2FF59] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <HelpCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            {content.kitchen.quizTitle}
          </h2>
        </div>

        <div className="space-y-5">
          {content.kitchen.quiz.map((q) => {
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
            disabled={Object.keys(selectedQuizAnswers).length < content.kitchen.quiz.length}
            className="mt-5 w-full py-3.5 bg-black hover:bg-zinc-800 disabled:opacity-50 text-white border-2 border-black font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Перевірити відповіді
          </button>
        ) : (
          <div className="mt-5 p-3 bg-[#B2FF59] border-2 border-black text-black text-xs font-black uppercase text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            🎉 Вітаємо! Квіз пройдено! Досягнення розблоковано!
          </div>
        )}
      </section>
    </div>
  );
};
