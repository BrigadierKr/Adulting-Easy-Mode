import { Language } from '../types';

export const XP_THRESHOLDS = [0, 100, 300, 600];

export const getLocalDateString = (d = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
};

export const calculateStreak = (days: string[]): number => {
  if (!days || days.length === 0) return 0;
  const daySet = new Set(days);
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  // If today is active, count backwards from today
  if (daySet.has(today)) {
    let streakCount = 0;
    const checkDate = new Date();
    while (daySet.has(getLocalDateString(checkDate))) {
      streakCount++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streakCount;
  }

  // If today is not yet active, but yesterday was active, streak is alive
  if (daySet.has(yesterday)) {
    let streakCount = 0;
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1);
    while (daySet.has(getLocalDateString(checkDate))) {
      streakCount++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streakCount;
  }

  return 0;
};

/**
 * Soft active day rule (v2.2):
 * Marks today's date in active_days if not present yet, without granting XP.
 */
export const markDayActive = (days: string[]): { updatedDays: string[]; isNewlyActive: boolean } => {
  const today = getLocalDateString();
  if (days.includes(today)) {
    return { updatedDays: days, isNewlyActive: false };
  }
  const nextDays = [...days, today];
  try {
    localStorage.setItem('active_days', JSON.stringify(nextDays));
  } catch {
    // ignore
  }
  return { updatedDays: nextDays, isNewlyActive: true };
};

export const getPluralForm = (num: number, forms: [string, string, string], lang: Language): string => {
  if (lang === 'en') {
    return num === 1 ? forms[0] : forms[1];
  }
  const abs = Math.abs(num) % 100;
  const rem = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (rem > 1 && rem < 5) return forms[1];
  if (rem === 1) return forms[0];
  return forms[2];
};

export interface LevelInfo {
  levelIndex: number;
  levelName: string;
  currentThreshold: number;
  nextThreshold: number;
  progressPercent: number;
  isMaxLevel: boolean;
  xpNeededForNext: number;
}

export const getLevelInfo = (xp: number, levels: string[]): LevelInfo => {
  let levelIndex = 0;
  if (xp >= XP_THRESHOLDS[3]) {
    levelIndex = 3;
  } else if (xp >= XP_THRESHOLDS[2]) {
    levelIndex = 2;
  } else if (xp >= XP_THRESHOLDS[1]) {
    levelIndex = 1;
  } else {
    levelIndex = 0;
  }

  const currentThreshold = XP_THRESHOLDS[levelIndex];
  const nextThreshold = levelIndex < 3 ? XP_THRESHOLDS[levelIndex + 1] : XP_THRESHOLDS[3];
  const isMaxLevel = levelIndex >= 3;

  let progressPercent = 100;
  let xpNeededForNext = 0;

  if (!isMaxLevel) {
    const range = nextThreshold - currentThreshold;
    const gained = Math.max(0, xp - currentThreshold);
    progressPercent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));
    xpNeededForNext = Math.max(0, nextThreshold - xp);
  }

  const levelName = levels[levelIndex] || levels[0] || 'Школяр';

  return {
    levelIndex,
    levelName,
    currentThreshold,
    nextThreshold,
    progressPercent,
    isMaxLevel,
    xpNeededForNext,
  };
};
