import React from 'react';
import { Utensils, Gauge, Sparkles, AlertTriangle, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navigation: React.FC = () => {
  const { content, activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'kitchen', label: content.modules.kitchen, icon: Utensils, activeBg: 'bg-[#FFD600]' },
    { id: 'utilities', label: content.modules.utilities, icon: Gauge, activeBg: 'bg-[#B2FF59]' },
    { id: 'cleaning', label: content.modules.cleaning, icon: Sparkles, activeBg: 'bg-[#00E5FF]' },
    { id: 'sos', label: content.modules.sos, icon: AlertTriangle, activeBg: 'bg-[#FF5252] text-white' },
    { id: 'achievements', label: content.modules.achievements, icon: Award, activeBg: 'bg-[#FFD600]' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F7F2] dark:bg-slate-900 border-t-4 border-black dark:border-slate-700 px-2 py-2.5 shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center py-2 px-1 border-2 border-black dark:border-slate-600 transition-all ${
                isActive
                  ? `${tab.activeBg} font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-1`
                  : 'bg-white dark:bg-slate-800 text-black/80 dark:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-700 font-bold hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5 stroke-[2.5]" />
              <span className="text-[10px] uppercase font-black tracking-tight leading-none truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
