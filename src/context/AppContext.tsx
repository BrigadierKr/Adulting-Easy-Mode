import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, ThemeMode, MeterEntry, BudgetData, AppContent } from '../types';
import { contents } from '../data/content';
import {
  calculateStreak,
  getLocalDateString,
  getYesterdayDateString,
  getLevelInfo,
  LevelInfo,
} from '../utils/gamification';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  effectiveTheme: 'light' | 'dark';
  content: AppContent;
  activeTab: 'kitchen' | 'utilities' | 'cleaning' | 'sos' | 'achievements';
  setActiveTab: (tab: 'kitchen' | 'utilities' | 'cleaning' | 'sos' | 'achievements') => void;
  
  // Gamification (v2.1)
  xp: number;
  streak: number;
  activeDays: string[];
  addXp: (amount: number, reason?: string) => void;
  levelInfo: LevelInfo;
  xpToast: { amount: number; id: number; customText?: string } | null;
  clearXpToast: () => void;
  markDayActive: () => boolean;
  streakLostToast: boolean;
  dismissStreakLostToast: () => void;

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
  markQuizCompleted: (quizId: string, isFlawless?: boolean) => void;

  // Autumn Drop Cards Completed
  completedDropCards: string[];
  toggleDropCardDone: (cardId: string) => void;

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

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved as ThemeMode) || 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to system theme changes automatically
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const effectiveTheme: 'light' | 'dark' =
    themeMode === 'system'
      ? (systemPrefersDark ? 'dark' : 'light')
      : themeMode;

  // Apply dark class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('app_theme', mode);
  };

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

  // Gamification State (v2.1)
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('xp_total');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [activeDays, setActiveDays] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('active_days');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [xpToast, setXpToast] = useState<{ amount: number; id: number; customText?: string } | null>(null);
  const [streakLostToast, setStreakLostToast] = useState<boolean>(false);

  const streak = useMemo(() => calculateStreak(activeDays), [activeDays]);

  const levelInfo = useMemo(() => {
    return getLevelInfo(xp, contents[language].gamification.levels);
  }, [xp, language]);

  // On mount: check if streak was broken (lastActive < yesterday)
  useEffect(() => {
    if (activeDays.length === 0) return;
    const sorted = [...activeDays].sort();
    const lastActive = sorted[sorted.length - 1];
    const yesterday = getYesterdayDateString();

    if (lastActive && lastActive < yesterday) {
      const key = `streak_lost_seen_${lastActive}`;
      if (!localStorage.getItem(key)) {
        setStreakLostToast(true);
        localStorage.setItem(key, 'true');
      }
    }
  }, []);

  // Auto-hide XP toast
  useEffect(() => {
    if (!xpToast) return;
    const timer = setTimeout(() => {
      setXpToast(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [xpToast]);

  const dismissStreakLostToast = () => setStreakLostToast(false);
  const clearXpToast = () => setXpToast(null);

  /**
   * Soft active day rule (v2.2):
   * Adds today to active_days without granting XP and triggers notification toast.
   */
  const markDayActive = (): boolean => {
    const today = getLocalDateString();
    if (!activeDays.includes(today)) {
      const nextDays = [...activeDays, today];
      setActiveDays(nextDays);
      localStorage.setItem('active_days', JSON.stringify(nextDays));
      const toastText =
        language === 'en'
          ? '🔥 Day counted! +0 XP'
          : language === 'ru'
          ? '🔥 День засчитан! +0 XP'
          : '🔥 День зараховано! +0 XP';
      setXpToast({ amount: 0, customText: toastText, id: Date.now() });
      return true;
    }
    return false;
  };

  const addXp = (amount: number) => {
    if (amount <= 0) return;

    setXp((prev) => {
      const nextXp = prev + amount;
      localStorage.setItem('xp_total', String(nextXp));
      return nextXp;
    });

    const today = getLocalDateString();
    setActiveDays((prev) => {
      if (!prev.includes(today)) {
        const nextDays = [...prev, today];
        localStorage.setItem('active_days', JSON.stringify(nextDays));
        return nextDays;
      }
      return prev;
    });

    setXpToast({ amount, id: Date.now() });
  };

  // Streak milestones: 7 days -> ach-27, 30 days -> ach-28
  useEffect(() => {
    if (streak >= 7 && !unlockedAchievements.includes('ach-27')) {
      unlockAchievement('ach-27');
    }
    if (streak >= 30 && !unlockedAchievements.includes('ach-28')) {
      unlockAchievement('ach-28');
    }
  }, [streak, unlockedAchievements]);

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

      // XP reward for new achievement: +25 XP
      addXp(25);

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
    markDayActive();
    setDailyChecked((prev) => {
      const isChecking = !prev[index];
      const updated = { ...prev, [index]: isChecking };
      
      // Check if all daily tasks completed
      const totalDaily = contents[language].cleaning.dailyTasks.length;
      const countChecked = Object.keys(updated).filter((k) => updated[Number(k)]).length;
      if (countChecked >= totalDaily && isChecking) {
        unlockAchievement('ach-12'); // Чиста перемога
        addXp(10); // Daily completed: +10 XP
      }
      return updated;
    });
  };

  const toggleWeeklyTask = (index: number) => {
    markDayActive();
    setWeeklyChecked((prev) => {
      const isChecking = !prev[index];
      const updated = { ...prev, [index]: isChecking };
      const totalWeekly = contents[language].cleaning.weeklyTasks.length;
      const countChecked = Object.keys(updated).filter((k) => updated[Number(k)]).length;
      if (countChecked >= totalWeekly && isChecking) {
        unlockAchievement('ach-6'); // Майстер швабри
        addXp(20); // Weekly completed: +20 XP
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
    addXp(15); // Meter entry: +15 XP
  };

  const deleteMeterEntry = (id: string) => {
    setMeterEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateBudget = (data: Partial<BudgetData>) => {
    setBudget((prev) => {
      const updated = { ...prev, ...data };
      unlockAchievement('ach-4'); // Економіст місяця
      addXp(5); // Budget updated: +5 XP
      return updated;
    });
  };

  const [completedDropCards, setCompletedDropCards] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('completed_drop_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('completed_drop_cards', JSON.stringify(completedDropCards));
  }, [completedDropCards]);

  const toggleDropCardDone = (cardId: string) => {
    const normId = cardId.toLowerCase();
    setCompletedDropCards((prev) => {
      const isAlreadyDone = prev.includes(normId);
      const updated = isAlreadyDone
        ? prev.filter((id) => id !== normId)
        : [...prev, normId];

      if (!isAlreadyDone) {
        // Seasonal card marked done: +10 XP
        addXp(10);

        // Unlock card-specific achievements:
        if (normId === 'h-01') unlockAchievement('ach-21');
        if (normId === 'h-03') unlockAchievement('ach-22');
        if (normId === 'h-04') unlockAchievement('ach-23');
        if (normId === 'r-03') unlockAchievement('ach-24');
        if (normId === 'r-04') unlockAchievement('ach-25');

        // Check if all autumn drop cards (10 cards: h-01..h-05, r-01..r-05) are completed -> ach-26
        const allDropCardIds = [
          'h-01', 'h-02', 'h-03', 'h-04', 'h-05',
          'r-01', 'r-02', 'r-03', 'r-04', 'r-05'
        ];
        const allDone = allDropCardIds.every((id) => updated.includes(id));
        if (allDone) {
          unlockAchievement('ach-26');
        }
      }

      return updated;
    });
  };

  const markQuizCompleted = (quizId: string, isFlawless = false) => {
    // Award XP: +20 XP if flawless, otherwise +15 XP
    addXp(isFlawless ? 20 : 15);

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
        themeMode,
        setThemeMode,
        effectiveTheme,
        content: contents[language],
        activeTab,
        setActiveTab,
        xp,
        streak,
        activeDays,
        addXp,
        levelInfo,
        xpToast,
        clearXpToast,
        markDayActive,
        streakLostToast,
        dismissStreakLostToast,
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
        completedDropCards,
        toggleDropCardDone,
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

