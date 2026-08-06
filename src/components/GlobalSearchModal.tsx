import React, { useState } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const { content, isSearchOpen, setIsSearchOpen, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  // Search recipes
  const matchedRecipes = content.kitchen.recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.query.toLowerCase().includes(query.toLowerCase()) ||
      r.steps.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  // Search SOS cards
  const matchedSos = content.sos.cards.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.query.toLowerCase().includes(query.toLowerCase()) ||
      c.steps.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  // Search Laundry symbols
  const matchedSymbols = content.sos.laundrySymbols.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectResult = (tab: 'kitchen' | 'utilities' | 'cleaning' | 'sos') => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Швидкий пошук (гречка, сифон, кросівки, значки, лічильник)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!query.trim() ? (
            <p className="text-center text-xs text-slate-400 py-8">
              Введіть запит для швидкого пошуку по всьому застосунку
            </p>
          ) : (
            <>
              {/* Recipes Results */}
              {matchedRecipes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
                    🍳 Рецепти ({matchedRecipes.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedRecipes.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelectResult('kitchen')}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <span>{r.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SOS Results */}
              {matchedSos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
                    🚨 Швидка допомога ({matchedSos.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedSos.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectResult('sos')}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-red-50 dark:hover:bg-red-950/40 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <span>{c.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Laundry Symbols Results */}
              {matchedSymbols.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-2">
                    🏷️ Значки для прання ({matchedSymbols.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedSymbols.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSelectResult('sos')}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <span>{s.symbol} {s.title} — {s.desc}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedRecipes.length === 0 && matchedSos.length === 0 && matchedSymbols.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-8">
                  Нічого не знайдено за запитом «{query}»
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
