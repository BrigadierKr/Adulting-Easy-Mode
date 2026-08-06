import React from 'react';
import { Search, Download, Award, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const Header: React.FC = () => {
  const {
    content,
    language,
    setLanguage,
    setIsSearchOpen,
    isInstallable,
    installPwa,
    unlockedAchievements,
    setActiveTab,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b-4 border-black px-4 py-3 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        {/* App Title & Logo */}
        <button
          onClick={() => setActiveTab('kitchen')}
          className="flex items-center gap-2.5 text-left focus:outline-hidden group"
        >
          <div className="w-11 h-11 bg-[#FFD600] border-3 border-black text-black flex items-center justify-center font-black text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            🤱
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-black uppercase leading-none">
              {content.appName}
            </h1>
            <p className="text-[11px] font-bold italic text-black/75 line-clamp-1 mt-0.5">
              {content.tagline}
            </p>
          </div>
        </button>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Achievements Count Badge */}
          <button
            onClick={() => setActiveTab('achievements')}
            className="px-2.5 py-1.5 bg-[#FFD600] border-2 border-black text-black text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all active:translate-x-[1px] active:translate-y-[1px]"
            title="Перейти до досягнень"
          >
            <Award className="w-4 h-4 text-black stroke-[3]" />
            <span>{unlockedAchievements.length}/20</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#B2FF59] transition-all active:translate-x-[1px] active:translate-y-[1px]"
            title="Пошук"
          >
            <Search className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={installPwa}
              className="p-2 bg-[#B2FF59] border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-400 transition-all active:translate-x-[1px] active:translate-y-[1px]"
              title="Встановити як PWA застосунок"
            >
              <Download className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex bg-white border-2 border-black p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {(['ua', 'en', 'ru'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 py-0.5 text-[10px] font-black uppercase transition-all ${
                  language === lang
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
