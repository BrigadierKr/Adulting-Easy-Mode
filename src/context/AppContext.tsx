import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, MeterEntry, BudgetData, AppContent } from '../types';
import { contents } from '../data/content';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  content: AppContent;
  activeTab: 'kitchen' | 'utilities' | 'cleaning' | 'sos' | 'achievements';
  setActiveTab: (tab: 'kitchen' | 'utilities' | 'cleaning' | 'sos' | 'achievements') => void;
  
  // Cleaning checklists
  dailyChecked: Record<number, boolean>;
  toggleDailyTask: (index: number) => void;
  weeklyChecked: Record<number, boolean>;
  toggleWeeklyTask: (index: number) => void;
  resetChecklists: () => void;

  // Meter Readings Tracker
  meterEntries: MeterEntry[];
  addMeterEntry: (entry: Omit<MeterEntry, 'id'>) => void;
  deleteMeterEntry: (id: string) => void;

  // Budget Calculator
  budget: BudgetData;
  updateBudget: (data: Partial<BudgetData>) => void;

  // Achievements
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => void;
  latestUnlocked: { id: string; title: string; icon: string } | null;
  clearLatestUnlocked: () => void;

  // Quizzes Completed
  completedQuizzes: string[];
  markQuizCompleted: (quizId: string) => void;

  // Search Modal
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // PWA Install
  isInstallable: boolean;
  installPwa: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_BUDGET: BudgetData = {
  income: 15000,
  housing: 6000,
  utilities: 2000,
  food: 4000,
  transport: 800,
  phone: 300,
  joy: 1000,
  reserve: 900,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'ua';
  });

  const [activeTab, setActiveTab] = useState<'kitchen' | 'utilities' | 'cleaning' | 'sos' | 'achievements'>('kitchen');

  const [dailyChecked, setDailyChecked] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('daily_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [weeklyChecked, setWeeklyChecked] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('weekly_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [meterEntries, setMeterEntries] = useState<MeterEntry[]>(() => {
    try {
      const saved = localStorage.getItem('meter_entries');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          date: '2026-07-01',
          electricity: 1240,
          coldWater: 85,
          hotWater: 42,
          gas: 110,
          note: 'Попередній місяць'
        },
        {
          id: '2',
          date: '2026-08-01',
          electricity: 1310,
          coldWater: 91,
          hotWater: 45,
          gas: 115,
          note: 'Поточні показники'
        }
      ];
    } catch {
      return [];
    }
  });

  const [budget, setBudget] = useState<BudgetData>(() => {
    try {
      const saved = localStorage.getItem('budget_data');
      return saved ? JSON.parse(saved) : DEFAULT_BUDGET;
    } catch {
      return DEFAULT_BUDGET;
    }
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unlocked_achievements');
      return saved ? JSON.parse(saved) : ['ach-16']; // Default unlocked 'Без паніки'
    } catch {
      return ['ach-16'];
    }
  });

  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('completed_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [latestUnlocked, setLatestUnlocked] = useState<{ id: string; title: string; icon: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const installPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('daily_checklist', JSON.stringify(dailyChecked));
  }, [dailyChecked]);

  useEffect(() => {
    localStorage.setItem('weekly_checklist', JSON.stringify(weeklyChecked));
  }, [weeklyChecked]);

  useEffect(() => {
    localStorage.setItem('meter_entries', JSON.stringify(meterEntries));
  }, [meterEntries]);

  useEffect(() => {
    localStorage.setItem('budget_data', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('unlocked_achievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    localStorage.setItem('completed_quizzes', JSON.stringify(completedQuizzes));
  }, [completedQuizzes]);

  const unlockAchievement = (id: string) => {
    if (!unlockedAchievements.includes(id)) {
      const newUnlocked = [...unlockedAchievements, id];
      setUnlockedAchievements(newUnlocked);
      
      const ach = contents[language].achievements.list.find((a) => a.id === id);
      if (ach) {
        setLatestUnlocked({ id: ach.id, title: ach.title, icon: ach.icon });
      }

      // Check for 10 achievements milestone
      if (newUnlocked.length >= 10 && !newUnlocked.includes('ach-20')) {
        setTimeout(() => unlockAchievement('ach-20'), 1500);
      }
    }
  };

  const clearLatestUnlocked = () => {
    setLatestUnlocked(null);
  };

  const toggleDailyTask = (index: number) => {
    setDailyChecked((prev) => {
      const updated = { ...prev, [index]: !prev[index] };
      
      // Check if all 5 daily tasks completed
      const totalDaily = contents[language].cleaning.dailyTasks.length;
      const countChecked = Object.keys(updated).filter((k) => updated[Number(k)]).length;
      if (countChecked >= totalDaily) {
        unlockAchievement('ach-12'); // Чиста перемога
      }
      return updated;
    });
  };

  const toggleWeeklyTask = (index: number) => {
    setWeeklyChecked((prev) => {
      const updated = { ...prev, [index]: !prev[index] };
      const totalWeekly = contents[language].cleaning.weeklyTasks.length;
      const countChecked = Object.keys(updated).filter((k) => updated[Number(k)]).length;
      if (countChecked >= totalWeekly) {
        unlockAchievement('ach-6'); // Майстер швабри
      }
      return updated;
    });
  };

  const resetChecklists = () => {
    setDailyChecked({});
    setWeeklyChecked({});
  };

  const addMeterEntry = (entry: Omit<MeterEntry, 'id'>) => {
    const newEntry: MeterEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setMeterEntries((prev) => [newEntry, ...prev]);
    unlockAchievement('ach-5'); // Показники вчасно
  };

  const deleteMeterEntry = (id: string) => {
    setMeterEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateBudget = (data: Partial<BudgetData>) => {
    setBudget((prev) => {
      const updated = { ...prev, ...data };
      unlockAchievement('ach-4'); // Економіст місяця
      return updated;
    });
  };

  const markQuizCompleted = (quizId: string) => {
    if (!completedQuizzes.includes(quizId)) {
      const updated = [...completedQuizzes, quizId];
      setCompletedQuizzes(updated);
      if (updated.length >= 2) {
        unlockAchievement('ach-19'); // Дорослий режим: ON
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        content: contents[language],
        activeTab,
        setActiveTab,
        dailyChecked,
        toggleDailyTask,
        weeklyChecked,
        toggleWeeklyTask,
        resetChecklists,
        meterEntries,
        addMeterEntry,
        deleteMeterEntry,
        budget,
        updateBudget,
        unlockedAchievements,
        unlockAchievement,
        latestUnlocked,
        clearLatestUnlocked,
        completedQuizzes,
        markQuizCompleted,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isInstallable,
        installPwa,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
