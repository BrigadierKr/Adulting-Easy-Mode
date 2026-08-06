import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TipOfTheDay } from './components/TipOfTheDay';
import { KitchenModule } from './components/KitchenModule';
import { UtilitiesModule } from './components/UtilitiesModule';
import { CleaningModule } from './components/CleaningModule';
import { QuickFixModule } from './components/QuickFixModule';
import { AchievementsModule } from './components/AchievementsModule';
import { AchievementToast } from './components/AchievementToast';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { maybeNotifyMeterReadings } from './utils/reminders';

const MainContent: React.FC = () => {
  const { activeTab, content } = useApp();

  useEffect(() => {
    maybeNotifyMeterReadings(content.utilities.reminderText);
  }, [content]);

  return (
    <div className="min-h-screen bg-[#F7F7F2] dark:bg-slate-950 text-[#1A1A1A] dark:text-slate-100 pb-20 font-sans selection:bg-[#FFD600] selection:text-black transition-colors duration-200">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        <TipOfTheDay />

        {activeTab === 'kitchen' && <KitchenModule />}
        {activeTab === 'utilities' && <UtilitiesModule />}
        {activeTab === 'cleaning' && <CleaningModule />}
        {activeTab === 'sos' && <QuickFixModule />}
        {activeTab === 'achievements' && <AchievementsModule />}
      </main>

      <footer className="mt-12 max-w-3xl mx-auto px-4 border-t-4 border-black dark:border-slate-700 pt-6 pb-28 flex flex-col sm:flex-row justify-between items-center text-xs font-black uppercase tracking-tight gap-3">
        <div className="flex gap-4">
          <span className="underline hover:text-red-600 dark:hover:text-red-400 cursor-pointer">САМ СОБІ МАМА</span>
          <span className="underline hover:text-red-600 dark:hover:text-red-400 cursor-pointer">КУРС ВИЖИВАННЯ</span>
        </div>
        <div className="flex items-center text-black dark:text-slate-200 font-extrabold">
          <span className="mr-1.5 text-base">⚡️</span> Дані зберігаються локально. Офлайн-режим.
        </div>
      </footer>

      <Navigation />
      <GlobalSearchModal />
      <AchievementToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
