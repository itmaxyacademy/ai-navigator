import { UserProgress } from '../types';

export interface BadgeDefinition {
  id: string;
  title: string;
  category: 'milestone'; // Simplified category
  description: string;
  iconName: 'Zap' | 'Trophy' | 'Flame' | 'Sparkles' | 'Target' | 'CheckCircle2' | 'Award' | 'Star' | 'Compass' | 'ShieldCheck' | 'Video' | 'Music' | 'Bot' | 'Layers';
  gradientBg: string;
  borderColor: string;
  iconColor: string;
  xpReward: number;
  conditionDescription: string;
  checkUnlocked: (progress: UserProgress, totalModules: number) => boolean;
  getCalculatedProgress: (progress: UserProgress, totalModules: number) => { current: number; max: number; percent: number };
}

// Helper to calculate completion of a range
const checkRangeCompleted = (completedModules: number[] = [], start: number, end: number) => {
  let count = 0;
  for (let i = start; i <= end; i++) {
    if (completedModules.includes(i)) count++;
  }
  return count;
};

export const BADGES_LIST: BadgeDefinition[] = [
  {
    id: 'group_1',
    title: 'KELOMPOK 1 — Pengenalan & Prompting Dasar',
    category: 'milestone',
    description: 'RCTF, ChatGPT, Claude, Gemini, Perplexity, Copilot, Meta AI, & DeepSeek.',
    iconName: 'Sparkles',
    gradientBg: 'from-cyan-500/20 via-indigo-900/40 to-slate-900',
    borderColor: 'border-cyan-500/50',
    iconColor: 'text-cyan-400',
    xpReward: 100,
    conditionDescription: 'Selesaikan Modul 1 - 8',
    checkUnlocked: (p) => checkRangeCompleted(p.completedModules, 1, 8) === 8,
    getCalculatedProgress: (p) => {
      const current = checkRangeCompleted(p.completedModules, 1, 8);
      return { current, max: 8, percent: Math.round((current / 8) * 100) };
    },
  },
  {
    id: 'group_2',
    title: 'KELOMPOK 2 — AI Generatif Visual, Video & Riset Konten',
    category: 'milestone',
    description: 'NotebookLM, Google Flow, Leonardo.Ai, Stitch, Stable Diffusion, OpenArt, & Craiyon.',
    iconName: 'Video',
    gradientBg: 'from-purple-500/20 via-rose-900/40 to-slate-900',
    borderColor: 'border-purple-500/50',
    iconColor: 'text-purple-400',
    xpReward: 200,
    conditionDescription: 'Selesaikan Modul 9 - 15',
    checkUnlocked: (p) => checkRangeCompleted(p.completedModules, 9, 15) === 7,
    getCalculatedProgress: (p) => {
      const current = checkRangeCompleted(p.completedModules, 9, 15);
      return { current, max: 7, percent: Math.round((current / 7) * 100) };
    },
  },
  {
    id: 'group_3',
    title: 'KELOMPOK 3 — AI Generatif Audio, Musik & Dev Environment',
    category: 'milestone',
    description: 'ElevenLabs, Suno AI, Google AI Studio, & Sonauto / Treblo.',
    iconName: 'Music',
    gradientBg: 'from-amber-500/20 via-orange-900/40 to-slate-900',
    borderColor: 'border-amber-500/50',
    iconColor: 'text-amber-400',
    xpReward: 300,
    conditionDescription: 'Selesaikan Modul 16 - 19',
    checkUnlocked: (p) => checkRangeCompleted(p.completedModules, 16, 19) === 4,
    getCalculatedProgress: (p) => {
      const current = checkRangeCompleted(p.completedModules, 16, 19);
      return { current, max: 4, percent: Math.round((current / 4) * 100) };
    },
  },
  {
    id: 'group_4',
    title: 'KELOMPOK 4 — AI Agent & Produktivitas Kustom',
    category: 'milestone',
    description: 'Fathom Meeting Notetaker, Gemini Custom Gems, & Mistral Vibe Agent.',
    iconName: 'Bot',
    gradientBg: 'from-emerald-500/20 via-teal-900/40 to-slate-900',
    borderColor: 'border-emerald-500/50',
    iconColor: 'text-emerald-400',
    xpReward: 400,
    conditionDescription: 'Selesaikan Modul 20 - 22',
    checkUnlocked: (p) => checkRangeCompleted(p.completedModules, 20, 22) === 3,
    getCalculatedProgress: (p) => {
      const current = checkRangeCompleted(p.completedModules, 20, 22);
      return { current, max: 3, percent: Math.round((current / 3) * 100) };
    },
  },
  {
    id: 'group_5',
    title: 'KELOMPOK 5 — Skill Automation & Fungsi Lanjutan Platform',
    category: 'milestone',
    description: 'Claude Artifacts, Kimi AI, Lumo, Lovable, Gamma, Manus, & Notion AI.',
    iconName: 'Layers',
    gradientBg: 'from-blue-500/20 via-indigo-900/40 to-slate-900',
    borderColor: 'border-blue-500/50',
    iconColor: 'text-blue-400',
    xpReward: 500,
    conditionDescription: 'Selesaikan Modul 23 - 29',
    checkUnlocked: (p) => checkRangeCompleted(p.completedModules, 23, 29) === 7,
    getCalculatedProgress: (p) => {
      const current = checkRangeCompleted(p.completedModules, 23, 29);
      return { current, max: 7, percent: Math.round((current / 7) * 100) };
    },
  },
];
