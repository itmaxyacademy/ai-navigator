import { UserProgress } from '../types';

export interface BadgeDefinition {
  id: string;
  title: string;
  category: 'learning' | 'streak' | 'xp' | 'milestone';
  description: string;
  iconName: 'Zap' | 'Trophy' | 'Flame' | 'Sparkles' | 'Target' | 'CheckCircle2' | 'Award' | 'Star' | 'Compass' | 'ShieldCheck';
  gradientBg: string;
  borderColor: string;
  iconColor: string;
  xpReward: number;
  conditionDescription: string;
  checkUnlocked: (progress: UserProgress, totalModules: number) => boolean;
  getCalculatedProgress: (progress: UserProgress, totalModules: number) => { current: number; max: number; percent: number };
}

export const BADGES_LIST: BadgeDefinition[] = [
  {
    id: 'first_step',
    title: 'Langkah Perdana',
    category: 'learning',
    description: 'Selesaikan modul pertama Anda dalam perjalanan AI Navigator.',
    iconName: 'Zap',
    gradientBg: 'from-amber-500/20 via-indigo-900/40 to-slate-900',
    borderColor: 'border-amber-500/50',
    iconColor: 'text-amber-400',
    xpReward: 50,
    conditionDescription: 'Selesaikan 1 Modul',
    checkUnlocked: (p) => (p.completedModules?.length || 0) >= 1,
    getCalculatedProgress: (p) => {
      const current = Math.min(1, p.completedModules?.length || 0);
      return { current, max: 1, percent: Math.round((current / 1) * 100) };
    },
  },
  {
    id: 'quiz_master',
    title: 'Master Kuis',
    category: 'learning',
    description: 'Raih nilai 100% sempurna pada setidaknya satu kuis evaluasi modul.',
    iconName: 'Star',
    gradientBg: 'from-emerald-500/20 via-teal-900/40 to-slate-900',
    borderColor: 'border-emerald-500/50',
    iconColor: 'text-emerald-400',
    xpReward: 50,
    conditionDescription: 'Skor 100% pada Kuis Modul',
    checkUnlocked: (p) => {
      const scores = Object.values(p.moduleScores || {});
      // In quiz component, max score is standard 3/3 questions or percentage
      return scores.some((s) => s >= 3);
    },
    getCalculatedProgress: (p) => {
      const maxScore = Math.max(0, ...Object.values(p.moduleScores || {}));
      const current = Math.min(3, maxScore);
      return { current, max: 3, percent: Math.round((current / 3) * 100) };
    },
  },
  {
    id: 'streak_3',
    title: 'Penyala Api',
    category: 'streak',
    description: 'Pertahankan kebiasaan belajar berturut-turut selama 3 hari.',
    iconName: 'Flame',
    gradientBg: 'from-orange-500/20 via-amber-900/40 to-slate-900',
    borderColor: 'border-orange-500/50',
    iconColor: 'text-orange-400',
    xpReward: 75,
    conditionDescription: 'Streak Belajar 3 Hari',
    checkUnlocked: (p) => (p.streakDays || 0) >= 3,
    getCalculatedProgress: (p) => {
      const current = Math.min(3, p.streakDays || 0);
      return { current, max: 3, percent: Math.round((current / 3) * 100) };
    },
  },
  {
    id: 'streak_7',
    title: 'Konsistensi Seminggu',
    category: 'streak',
    description: 'Hebat! Anda telah belajar konsisten selama 7 hari berturut-turut.',
    iconName: 'Flame',
    gradientBg: 'from-rose-500/20 via-orange-900/40 to-slate-900',
    borderColor: 'border-rose-500/50',
    iconColor: 'text-rose-400',
    xpReward: 150,
    conditionDescription: 'Streak Belajar 7 Hari',
    checkUnlocked: (p) => (p.streakDays || 0) >= 7,
    getCalculatedProgress: (p) => {
      const current = Math.min(7, p.streakDays || 0);
      return { current, max: 7, percent: Math.round((current / 7) * 100) };
    },
  },
  {
    id: 'streak_10',
    title: 'Pahlawan Konsistensi',
    category: 'streak',
    description: 'Luar biasa! Pencapaian tingkat lanjut dengan streak 10 hari berturut-turut!',
    iconName: 'ShieldCheck',
    gradientBg: 'from-purple-500/20 via-pink-900/40 to-slate-900',
    borderColor: 'border-purple-500/50',
    iconColor: 'text-purple-400',
    xpReward: 250,
    conditionDescription: 'Streak Belajar 10 Hari',
    checkUnlocked: (p) => (p.streakDays || 0) >= 10,
    getCalculatedProgress: (p) => {
      const current = Math.min(10, p.streakDays || 0);
      return { current, max: 10, percent: Math.round((current / 10) * 100) };
    },
  },
  {
    id: 'checkpoint_pro',
    title: 'Penjelajah Checkpoint',
    category: 'learning',
    description: 'Selesaikan minimal 3 checkpoint mid-module untuk memperkuat pemahaman.',
    iconName: 'CheckCircle2',
    gradientBg: 'from-indigo-500/20 via-sky-900/40 to-slate-900',
    borderColor: 'border-indigo-500/50',
    iconColor: 'text-indigo-400',
    xpReward: 100,
    conditionDescription: 'Selesaikan 3 Checkpoint Mid-Module',
    checkUnlocked: (p) => (p.completedCheckpoints?.length || 0) >= 3,
    getCalculatedProgress: (p) => {
      const current = Math.min(3, p.completedCheckpoints?.length || 0);
      return { current, max: 3, percent: Math.round((current / 3) * 100) };
    },
  },
  {
    id: 'xp_500',
    title: 'Kolektor XP',
    category: 'xp',
    description: 'Raih total perolehan 500 Experience Points (XP) dari aktivitas belajar.',
    iconName: 'Sparkles',
    gradientBg: 'from-sky-500/20 via-blue-900/40 to-slate-900',
    borderColor: 'border-sky-500/50',
    iconColor: 'text-sky-400',
    xpReward: 100,
    conditionDescription: 'Raih Total 500 XP',
    checkUnlocked: (p) => (p.xp || 0) >= 500,
    getCalculatedProgress: (p) => {
      const current = Math.min(500, p.xp || 0);
      return { current, max: 500, percent: Math.round((current / 500) * 100) };
    },
  },
  {
    id: 'xp_1000',
    title: 'Pakar Prompting',
    category: 'xp',
    description: 'Capai total perolehan 1.000 XP dan buktikan dedikasi Anda menguasai AI.',
    iconName: 'Trophy',
    gradientBg: 'from-amber-400/20 via-yellow-900/40 to-slate-900',
    borderColor: 'border-amber-400/50',
    iconColor: 'text-amber-300',
    xpReward: 200,
    conditionDescription: 'Raih Total 1.000 XP',
    checkUnlocked: (p) => (p.xp || 0) >= 1000,
    getCalculatedProgress: (p) => {
      const current = Math.min(1000, p.xp || 0);
      return { current, max: 1000, percent: Math.round((current / 1000) * 100) };
    },
  },
  {
    id: 'halfway',
    title: 'Setengah Perjalanan',
    category: 'milestone',
    description: 'Selesaikan 50% dari seluruh kurikulum modul AI Navigator.',
    iconName: 'Compass',
    gradientBg: 'from-teal-500/20 via-emerald-900/40 to-slate-900',
    borderColor: 'border-teal-500/50',
    iconColor: 'text-teal-400',
    xpReward: 150,
    conditionDescription: 'Selesaikan 50% Kurikulum',
    checkUnlocked: (p, total) => {
      const half = Math.ceil(total / 2);
      return (p.completedModules?.length || 0) >= half;
    },
    getCalculatedProgress: (p, total) => {
      const half = Math.ceil(total / 2);
      const current = Math.min(half, p.completedModules?.length || 0);
      return { current, max: half, percent: Math.round((current / half) * 100) };
    },
  },
  {
    id: 'all_clear',
    title: 'Master AI Navigator',
    category: 'milestone',
    description: 'Selesaikan seluruh 18 modul kurikulum AI Navigator dari pemula hingga pakar!',
    iconName: 'Award',
    gradientBg: 'from-amber-500/30 via-orange-950 to-slate-900',
    borderColor: 'border-amber-400',
    iconColor: 'text-amber-300',
    xpReward: 300,
    conditionDescription: 'Selesaikan 100% Modul Kurikulum',
    checkUnlocked: (p, total) => (p.completedModules?.length || 0) >= total && total > 0,
    getCalculatedProgress: (p, total) => {
      const current = Math.min(total, p.completedModules?.length || 0);
      return { current, max: total, percent: Math.round((current / total) * 100) };
    },
  },
  {
    id: 'daily_goal_hero',
    title: 'Disiplin Harian',
    category: 'milestone',
    description: 'Penuhi target waktu belajar harian Anda minimal selama 1 hari.',
    iconName: 'Target',
    gradientBg: 'from-blue-500/20 via-indigo-900/40 to-slate-900',
    borderColor: 'border-blue-500/50',
    iconColor: 'text-blue-400',
    xpReward: 50,
    conditionDescription: 'Capai Target Menit Harian',
    checkUnlocked: (p) => {
      const goal = p.dailyGoalMinutes || 15;
      const history = p.dailyMinutesHistory || {};
      return Object.values(history).some((mins) => mins >= goal);
    },
    getCalculatedProgress: (p) => {
      const goal = p.dailyGoalMinutes || 15;
      const history = p.dailyMinutesHistory || {};
      const maxMins = Math.max(0, ...Object.values(history));
      const current = Math.min(goal, maxMins);
      return { current, max: goal, percent: Math.round((current / goal) * 100) };
    },
  },
];
