import { CourseModule } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number | null;
  currentLevelXp: number;
  requiredLevelXp: number;
  progressPercent: number;
  badgeColor: string;
  gradientBg: string;
}

export function getUserLevelInfo(xp: number): LevelInfo {
  if (xp < 200) {
    return {
      level: 1,
      title: 'Novice',
      minXp: 0,
      maxXp: 199,
      currentLevelXp: xp,
      requiredLevelXp: 200,
      progressPercent: Math.min(100, Math.max(0, (xp / 200) * 100)),
      badgeColor: 'text-slate-300 border-slate-700 bg-slate-800/80',
      gradientBg: 'from-slate-700 to-slate-900',
    };
  } else if (xp < 600) {
    return {
      level: 2,
      title: 'Apprentice',
      minXp: 200,
      maxXp: 599,
      currentLevelXp: xp - 200,
      requiredLevelXp: 400, // 600 - 200
      progressPercent: Math.min(100, Math.max(0, ((xp - 200) / 400) * 100)),
      badgeColor: 'text-emerald-400 border-emerald-800/60 bg-emerald-950/60',
      gradientBg: 'from-emerald-600 to-teal-900',
    };
  } else if (xp < 1200) {
    return {
      level: 3,
      title: 'Specialist',
      minXp: 600,
      maxXp: 1199,
      currentLevelXp: xp - 600,
      requiredLevelXp: 600, // 1200 - 600
      progressPercent: Math.min(100, Math.max(0, ((xp - 600) / 600) * 100)),
      badgeColor: 'text-sky-400 border-sky-800/60 bg-sky-950/60',
      gradientBg: 'from-sky-600 to-indigo-900',
    };
  } else if (xp < 2000) {
    return {
      level: 4,
      title: 'Architect',
      minXp: 1200,
      maxXp: 1999,
      currentLevelXp: xp - 1200,
      requiredLevelXp: 800, // 2000 - 1200
      progressPercent: Math.min(100, Math.max(0, ((xp - 1200) / 800) * 100)),
      badgeColor: 'text-purple-400 border-purple-800/60 bg-purple-950/60',
      gradientBg: 'from-purple-600 to-pink-900',
    };
  } else {
    return {
      level: 5,
      title: 'Grandmaster',
      minXp: 2000,
      maxXp: null,
      currentLevelXp: xp - 2000,
      requiredLevelXp: 0,
      progressPercent: 100,
      badgeColor: 'text-amber-400 border-amber-800/60 bg-amber-950/60',
      gradientBg: 'from-amber-500 to-orange-800',
    };
  }
}

export function getLocalDateString(dateObj: Date = new Date()): string {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  try {
    const d1 = new Date(dateStr1 + 'T00:00:00');
    const d2 = new Date(dateStr2 + 'T00:00:00');
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 3600 * 24));
  } catch (e) {
    return 0;
  }
}

export function calculateRemainingTimeMinutes(
  completedModuleIds: number[],
  modules: CourseModule[]
): { remainingMinutes: number; remainingCount: number; formattedText: string } {
  const uncompleted = modules.filter((m) => !completedModuleIds.includes(m.id));
  const remainingCount = uncompleted.length;

  if (remainingCount === 0) {
    return {
      remainingMinutes: 0,
      remainingCount: 0,
      formattedText: '0 Menit (Selesai!)',
    };
  }

  // Dynamic formula: Remaining Modules x 3.75 minutes per item
  const totalRemainingMins = Math.round(remainingCount * 3.75);

  return {
    remainingMinutes: totalRemainingMins,
    remainingCount,
    formattedText: `~${totalRemainingMins} Menit (${remainingCount} Sisa Modul)`,
  };
}

export function isCertificateEligible(progress: { completedModules?: number[]; userTier?: string; hasTier2?: boolean; paidTiers?: string[] }): boolean {
  const completed = progress?.completedModules || [];
  const userTier = progress?.userTier || 'free';
  const hasTier2 = progress?.hasTier2 || progress?.paidTiers?.includes('tier2') || userTier === 'tier2' || completed.some(id => id > 22);

  if (hasTier2) {
    // Tier 2 requires 100% completion of ALL 29 modules (Modul 1 through Modul 29)
    const requiredModules = Array.from({ length: 29 }, (_, i) => i + 1);
    return requiredModules.every((id) => completed.includes(id));
  } else if (userTier === 'tier1' || progress?.paidTiers?.includes('tier1')) {
    // Tier 1 requires 100% completion of ALL 22 modules (Modul 1 through Modul 22)
    const requiredModules = Array.from({ length: 22 }, (_, i) => i + 1);
    return requiredModules.every((id) => completed.includes(id));
  }

  return false; // Free trial users are not eligible for certificates
}
