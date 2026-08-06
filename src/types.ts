export type Language = 'ua' | 'en' | 'ru';
export type ThemeMode = 'system' | 'light' | 'dark';

export interface Recipe {
  id: string;
  title: string;
  query: string;
  timeMinutes: number;
  waterRatio?: string;
  steps: string[];
  humor: string;
}

export interface KitchenContent {
  title: string;
  recipesTitle: string;
  recipes: Recipe[];
  sosTitle: string;
  sosSteps: string[];
  quizTitle: string;
}

export interface MeterEntry {
  id: string;
  date: string;
  electricity: number;
  coldWater: number;
  hotWater: number;
  gas: number;
  note?: string;
}

export interface BudgetData {
  income: number;
  housing: number;
  utilities: number;
  food: number;
  transport: number;
  phone: number;
  joy: number;
  reserve: number;
}

export interface LaundrySymbol {
  id: string;
  category: 'washing' | 'bleaching' | 'drying' | 'ironing' | 'drycleaning';
  symbol: string;
  title: string;
  desc: string;
  momNote: string;
}

export interface SosCard {
  id: string;
  query: string;
  title: string;
  badge?: string;
  steps: string[];
  humor?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'kitchen' | 'utilities' | 'cleaning' | 'sos' | 'general';
}

export interface AppContent {
  appName: string;
  tagline: string;
  dontPanic: string;
  tipTitle: string;
  modules: {
    kitchen: string;
    utilities: string;
    cleaning: string;
    sos: string;
    achievements: string;
  };
  kitchen: {
    recipesTitle: string;
    recipes: Recipe[];
    sosTitle: string;
    sosSteps: string[];
    quizTitle: string;
    quiz: QuizQuestion[];
    timerStart: string;
    timerStop: string;
    timerDone: string;
  };
  utilities: {
    guideTitle: string;
    guideSteps: string[];
    guideNote: string;
    trackerTitle: string;
    reminderTitle: string;
    reminderText: string;
    enableNotifications: string;
    notificationsEnabled: string;
    copyReadingsText: string;
    copied: string;
    meters: {
      electricity: string;
      coldWater: string;
      hotWater: string;
      gas: string;
    };
    budgetTitle: string;
    budgetSubtitle: string;
    incomeLabel: string;
    formulaTitle: string;
    joyMandatory: string;
    shoppingTip: string;
  };
  cleaning: {
    dailyTitle: string;
    dailySubtitle: string;
    dailyTasks: string[];
    weeklyTitle: string;
    weeklyTasks: string[];
    resetAll: string;
    allDone: string;
  };
  sos: {
    searchPlaceholder: string;
    cards: SosCard[];
    laundryTitle: string;
    laundrySubtitle: string;
    laundrySymbols: LaundrySymbol[];
    quizTitle: string;
    quiz: QuizQuestion[];
    shareCard: string;
    linkCopied: string;
  };
  achievements: {
    title: string;
    subtitle: string;
    unlockedCount: string;
    list: Achievement[];
  };
  tips: string[];
}
