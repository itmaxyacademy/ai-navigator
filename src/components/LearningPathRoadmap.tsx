import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { 
  Sparkles, MessageSquare, Feather, Sparkle, Search, Bot, Share2, BrainCircuit, BookOpen,
  CheckCircle2, Lock, ArrowRight, Play, Trophy, Clock, Star, Award, Compass,
  Gift, Crown, Map as MapIcon, LayoutGrid, X, Zap, ChevronRight, Check, Video, Music, Terminal, Gem, Flame, Layers,
  Download, ShieldCheck, ExternalLink, HelpCircle, RefreshCw, CheckCircle, UserCheck, FileText, Target, Info, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CourseModule, UserProgress } from '../types';
import { useTierAccess } from '../hooks/useTierAccess';
import { calculateRemainingTimeMinutes, getUserLevelInfo } from '../lib/gamification';
import { LearningTipsWidget } from './LearningTipsWidget';

// Lazy-load heavy widgets — only downloaded when the user opens their respective tab
const DailyChallengeWidget = React.lazy(() => import('./DailyChallengeWidget').then(m => ({ default: m.DailyChallengeWidget })));
const ConceptFlashcardsWidget = React.lazy(() => import('./ConceptFlashcardsWidget').then(m => ({ default: m.ConceptFlashcardsWidget })));
const SkillRadarChartWidget = React.lazy(() => import('./SkillRadarChartWidget').then(m => ({ default: m.SkillRadarChartWidget })));
const ProgressAnalyticsWidget = React.lazy(() => import('./ProgressAnalyticsWidget').then(m => ({ default: m.ProgressAnalyticsWidget })));
const DailyXpTrendChart = React.lazy(() => import('./DailyXpTrendChart').then(m => ({ default: m.DailyXpTrendChart })));
const KnowledgeHeatmap = React.lazy(() => import('./KnowledgeHeatmap').then(m => ({ default: m.KnowledgeHeatmap })));

// Lightweight skeleton for Suspense fallback
const WidgetSkeleton = () => (
  <div className="w-full h-40 rounded-xl bg-slate-800/40 animate-pulse border border-slate-700/30" />
);

interface LearningPathRoadmapProps {
  modules: CourseModule[];
  progress: UserProgress;
  onSelectModule: (moduleId: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenStreakModal?: () => void;
  onOpenAchievements?: () => void;
  onIncrementRevisit?: (moduleId: number) => void;
  onAwardXp?: (amount: number, label: string) => void;
  onOpenChest?: (chestId: number, xpReward: number, chestTitle: string) => void;
  onOpenUpgradeModal?: (targetModuleId?: number) => void;
  onOpenCapstoneModal?: () => void;
  onOpenCertificateModal?: (certType?: 'capstone' | 'completion') => void;
}

// -----------------------------------------------------------------------------
// 5 KELOMPOK MODULE GROUPS
// -----------------------------------------------------------------------------
export interface GroupData {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  moduleRange: [number, number];
  themeGradient: string;
  borderColor: string;
  badgeBg: string;
  iconName: string;
}

export const PATH_GROUPS: GroupData[] = [
  {
    id: 1,
    title: "KELOMPOK 1 — Pengenalan & Prompting Dasar",
    subtitle: "RCTF, ChatGPT, Claude, Gemini, Perplexity, Copilot, Meta AI, & DeepSeek",
    badge: "Fondasi Utama (Modul 1-8)",
    moduleRange: [1, 8],
    themeGradient: "from-cyan-500 via-indigo-500 to-blue-600",
    borderColor: "border-cyan-500/40",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    iconName: "Sparkles",
  },
  {
    id: 2,
    title: "KELOMPOK 2 — AI Generatif Visual, Video & Riset Konten",
    subtitle: "NotebookLM, Google Flow, Leonardo.Ai, Stitch, Stable Diffusion, OpenArt, & Craiyon",
    badge: "Media & Riset (Modul 9-15)",
    moduleRange: [9, 15],
    themeGradient: "from-purple-500 via-rose-500 to-pink-600",
    borderColor: "border-purple-500/40",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    iconName: "Video",
  },
  {
    id: 3,
    title: "KELOMPOK 3 — AI Generatif Audio, Musik & Dev Environment",
    subtitle: "ElevenLabs, Suno AI, Google AI Studio, & Sonauto / Treblo",
    badge: "Audio & Dev (Modul 16-19)",
    moduleRange: [16, 19],
    themeGradient: "from-amber-500 via-orange-500 to-yellow-600",
    borderColor: "border-amber-500/40",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    iconName: "Music",
  },
  {
    id: 4,
    title: "KELOMPOK 4 — AI Agent & Produktivitas Kustom",
    subtitle: "Fathom Meeting Notetaker, Gemini Custom Gems, & Mistral Vibe Agent",
    badge: "Agent & Automation (Modul 20-22)",
    moduleRange: [20, 22],
    themeGradient: "from-emerald-500 via-teal-500 to-cyan-600",
    borderColor: "border-emerald-500/40",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    iconName: "Bot",
  },
  {
    id: 5,
    title: "KELOMPOK 5 — Skill Automation & Fungsi Lanjutan Platform",
    subtitle: "Claude Artifacts, Kimi AI, Lumo, Lovable, Gamma, Manus, & Notion AI",
    badge: "Skill Lanjutan (Modul 23-29)",
    moduleRange: [23, 29],
    themeGradient: "from-indigo-500 via-purple-500 to-amber-500",
    borderColor: "border-indigo-500/40",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    iconName: "Terminal",
  },
];

// -----------------------------------------------------------------------------
// TREASURE CHESTS DATA
// -----------------------------------------------------------------------------
export interface TreasureChestData {
  id: number;
  afterModuleId: number;
  title: string;
  bonusToolName: string;
  xpReward: number;
  badgeReward: string;
  icon: string;
  description: string;
  miniTutorial: {
    overview: string;
    keyTips: string[];
    samplePrompt: string;
  };
}

export const TREASURE_CHESTS: TreasureChestData[] = [
  {
    id: 1,
    afterModuleId: 4,
    title: "Peti Bonus Pemula",
    bonusToolName: "Midjourney v6 Prompting",
    xpReward: 100,
    badgeReward: "Midjourney Explorer",
    icon: "Gift",
    description: "Bonus spesial! Menguasai parameter `--ar 16:9`, `--v 6.0`, `--stylize` untuk menghasilkan karya seni visual hyper-realistic.",
    miniTutorial: {
      overview: "Midjourney adalah generator gambar AI paling estetis. Rahasianya ada pada struktur parameter aspek rasio dan gaya rendering.",
      keyTips: [
        "Tambahkan `--ar 16:9` untuk format lanskap cinematic.",
        "Gunakan `--v 6.0` untuk mendapatkan detail tekstur kulit & pencahayaan fotorealistis.",
        "Gunakan `--stylize 250` untuk meningkatkan keindahan artistik AI."
      ],
      samplePrompt: "/imagine prompt: Futuristic cyberpunk neon cityscape, volumetric lighting, photorealistic octane render --ar 16:9 --v 6.0"
    }
  },
  {
    id: 2,
    afterModuleId: 8,
    title: "Peti Harta Karun",
    bonusToolName: "Runway Gen-2 Video Studio",
    xpReward: 150,
    badgeReward: "Video Motion Master",
    icon: "Gift",
    description: "Bonus spesial! Mengubah gambar statis menjadi video animasi cinematic dengan Motion Brush & Camera Control.",
    miniTutorial: {
      overview: "Runway Gen-2 memungkinkan penciptaan video gerak dari teks atau gambar input.",
      keyTips: [
        "Gunakan Motion Brush untuk mengisolasi objek tertentu yang bergerak (misal: asap, air, mata).",
        "Atur Camera Motion Zoom-In halus untuk efek drama sinematik.",
        "Kombinasikan dengan gambar output Midjourney/Leonardo untuk hasil terbaik."
      ],
      samplePrompt: "Slow pan video of a glowing futuristic robot drinking coffee in a rainy cafe, cinematic 4k"
    }
  },
  {
    id: 3,
    afterModuleId: 12,
    title: "Peti Rahasia",
    bonusToolName: "Canva Magic Studio",
    xpReward: 200,
    badgeReward: "Canva Magic Designer",
    icon: "Gift",
    description: "Bonus spesial! Membuat presentasi, poster, dan materi pemasaran dalam sekali klik dengan Canva Magic Design.",
    miniTutorial: {
      overview: "Canva Magic Studio mengintegrasikan AI generative langsung ke dalam kanvas desain vektor dan slide.",
      keyTips: [
        "Ketik ide presentasi Anda di 'Magic Design for Presentations' untuk menghasilkan 10 slide utuh.",
        "Gunakan 'Magic Eraser' untuk menghapus objek yang tidak diinginkan dari foto.",
        "Manfaatkan 'Magic Switch' untuk mengubah bentuk slide menjadi postingan Instagram."
      ],
      samplePrompt: "Buat presentasi 5 slide tentang Strategi Pemasaran Digital dengan tema warna Navy & Emas"
    }
  },
  {
    id: 4,
    afterModuleId: 15,
    title: "Peti Emas",
    bonusToolName: "OpenAI Sora Video Generator",
    xpReward: 200,
    badgeReward: "Sora Visionary",
    icon: "Gift",
    description: "Bonus spesial! Pelajari dasar prompting video berdurasi hingga 60 detik dari OpenAI Sora dengan simulasi realistis.",
    miniTutorial: {
      overview: "OpenAI Sora memahami fisika dunia nyata dan menciptakan adegan kompleks dengan banyak karakter.",
      keyTips: [
        "Gambarkan kondisi pencahayaan dan gerakan kamera secara mendetail.",
        "Tentukan gaya visual (3D animation, 35mm film, anime, atau dokumenter).",
        "Sebutkan sudut pandang kamera (drone shot, close-up shot, tracking shot)."
      ],
      samplePrompt: "A stylish woman walks down a Tokyo street filled with warm glowing neon and animated city signage, 35mm film shot"
    }
  },
  {
    id: 5,
    afterModuleId: 19,
    title: "Peti Legenda",
    bonusToolName: "ElevenLabs Voice Cloning & Dubbing",
    xpReward: 250,
    badgeReward: "Voice Maestro",
    icon: "Gift",
    description: "Bonus spesial! Mengkloning suara manusia dan melakukan dubbing otomatis dalam 29+ bahasa dengan ekspresi alami.",
    miniTutorial: {
      overview: "ElevenLabs menghasilkan audio narasi yang tidak terdengar kaku dengan intonasi emosional nyata.",
      keyTips: [
        "Upload sampel rekaman suara jernih tanpa noise berdurasi 1-2 menit untuk instant voice cloning.",
        "Gunakan tag penjelas emosi seperti [whispering] atau [excited] untuk mengontrol intonasi.",
        "Aktifkan AI Dubbing untuk menerjemahkan video YouTube Anda ke bahasa Inggris/Jepang."
      ],
      samplePrompt: "Halo teman-teman! Selamat datang di modul pembelajaran AI Navigator. Hari ini kita akan membahas masa depan LLM."
    }
  },
  {
    id: 6,
    afterModuleId: 22,
    title: "Peti Master",
    bonusToolName: "Autonomous Web Agent Workflows",
    xpReward: 300,
    badgeReward: "Autonomous Agent Builder",
    icon: "Gift",
    description: "Bonus spesial! Membuat AI Agent otonom yang bisa menjelajah web, mengeksekusi kode, dan menyelesaikan tugas kompleks tanpa henti.",
    miniTutorial: {
      overview: "Agent Otonom dapat memecah tujuan utama menjadi sub-tugas berulang hingga target tercapai.",
      keyTips: [
        "Berikan tujuan yang jelas, terukur, dan batasan eksekusi yang tegas.",
        "Atur memori jangka panjang (Vector DB) agar agent tidak lupa konteks sebelumnya.",
        "Gunakan API key yang aman dan beri pengawasan pada eksekusi perintah terminal."
      ],
      samplePrompt: "Riset 5 kompetitor utama di industri SaaS LMS, kumpulkan fitur utamanya ke dalam tabel CSV, dan kirimkan ringkasannya."
    }
  },
  {
    id: 7,
    afterModuleId: 26,
    title: "Peti Terakhir",
    bonusToolName: "v0.dev & Bolt.new Full-Stack Generators",
    xpReward: 350,
    badgeReward: "AI Fullstack Pioneer",
    icon: "Gift",
    description: "Bonus spesial! Membangun aplikasi web React + Tailwind lengkap hanya dari satu kalimat prompt.",
    miniTutorial: {
      overview: "v0.dev oleh Vercel & Bolt.new membuat komponen UI dan aplikasi web fungsional dalam hitungan detik.",
      keyTips: [
        "Deskripsikan skema layout, palet warna, dan interaksi komponen secara rinci.",
        "Minta komponen Shadcn UI yang bersih dan responsif.",
        "Minta ekspor kode React TypeScript yang siap di-deploy."
      ],
      samplePrompt: "Build a modern crypto portfolio dashboard with dark theme, balance chart, recent transactions, and buy/sell modal using Tailwind CSS."
    }
  }
];

// -----------------------------------------------------------------------------
// CHECKPOINT MILESTONES DATA
// -----------------------------------------------------------------------------
export interface CheckpointMilestone {
  afterModuleId: number;
  title: string;
  levelBadge: string;
  message: string;
  themeGradient: string;
}

export const CHECKPOINT_MILESTONES: CheckpointMilestone[] = [
  {
    afterModuleId: 8,
    title: "🚀 Level Up: Master Prompting & Conversational AI!",
    levelBadge: "Prompt Engineer Level 1",
    message: "Luar biasa! Anda telah menyelesaikan Kelompok 1: 8 modul dasar prompting & AI percakapan terpopuler!",
    themeGradient: "from-cyan-500 to-blue-600",
  },
  {
    afterModuleId: 15,
    title: "🎨 Level Up: Kreator Visual & Video AI!",
    levelBadge: "Visual AI Specialist",
    message: "Hebat! Anda telah menyelesaikan Kelompok 2: Alat-alat AI terkemuka untuk media visual, video, dan riset!",
    themeGradient: "from-purple-500 to-rose-600",
  },
  {
    afterModuleId: 19,
    title: "🎵 Level Up: Maestro Audio & Developer AI!",
    levelBadge: "Audio & Dev Specialist",
    message: "Spektakuler! Anda telah menyelesaikan Kelompok 3: AI Voice, Suno Music Studio, dan Google AI Studio!",
    themeGradient: "from-amber-500 to-orange-600",
  },
  {
    afterModuleId: 22,
    title: "🤖 Level Up: Spesialis Agent & Produktivitas!",
    levelBadge: "AI Productivity Architect",
    message: "Dahsyat! Anda telah menyelesaikan Kelompok 4: Fathom, Custom Gems, dan Mistral Vibe Agents!",
    themeGradient: "from-emerald-500 to-teal-600",
  },
];

// -----------------------------------------------------------------------------
// HELPER ICON RENDERER
// -----------------------------------------------------------------------------
const getModuleIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />;
    case 'MessageSquare':
      return <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-300" />;
    case 'Feather':
      return <Feather className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />;
    case 'Sparkle':
      return <Sparkle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-300" />;
    case 'Search':
      return <Search className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300" />;
    case 'Bot':
      return <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300" />;
    case 'Share2':
      return <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-pink-300" />;
    case 'BrainCircuit':
      return <BrainCircuit className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-300" />;
    case 'BookOpen':
      return <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-300" />;
    case 'Video':
      return <Video className="w-6 h-6 sm:w-7 sm:h-7 text-rose-300" />;
    case 'Music':
      return <Music className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400" />;
    case 'Terminal':
      return <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />;
    case 'Gem':
      return <Gem className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />;
    default:
      return <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-300" />;
  }
};

// Mascot sitting on current active uncompleted node
const NavigatorMascot = ({ moduleTitle }: { moduleTitle: string }) => {
  return (
    <motion.div
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: [0, -5, 0], opacity: 1 }}
      transition={{
        y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }}
      className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none w-60"
    >
      {/* Speech Bubble */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-[11px] font-black px-3 py-1 rounded-2xl shadow-xl border border-indigo-300/60 text-center flex items-center gap-1.5 mb-1 whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
        <span>📍 Lanjutkan Belajar Di Sini</span>
      </div>

      {/* Cyber Mascot Avatar */}
      <div className="relative w-11 h-11">
        <div className="absolute inset-0 bg-indigo-500/40 rounded-full blur-md opacity-80 animate-pulse" />
        <div className="relative w-full h-full bg-slate-900 border-2 border-cyan-400 rounded-2xl p-0.5 shadow-xl flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <div className="w-7 h-5 bg-slate-950 rounded-lg border border-indigo-400 flex items-center justify-center relative overflow-hidden">
              <div className="w-4 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-sm" />
              <div className="absolute inset-0 flex items-center justify-around px-1">
                <div className="w-1 h-1 bg-cyan-200 rounded-full shadow-[0_0_6px_#22d3ee]" />
                <div className="w-1 h-1 bg-cyan-200 rounded-full shadow-[0_0_6px_#22d3ee]" />
              </div>
            </div>
            <span className="text-[7px] font-black text-cyan-300 tracking-tighter mt-0.5">AI NAVI</span>
          </div>
        </div>
      </div>

      {/* Down Triangle Arrow */}
      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-purple-600 -mt-0.5" />
    </motion.div>
  );
};

export const LearningPathRoadmap: React.FC<LearningPathRoadmapProps> = React.memo(({
  modules,
  progress,
  onSelectModule,
  searchQuery,
  onSearchChange,
  onOpenStreakModal,
  onOpenAchievements,
  onIncrementRevisit,
  onAwardXp,
  onOpenChest,
  onOpenUpgradeModal,
  onOpenCapstoneModal,
  onOpenCertificateModal,
}) => {
  const userTier = progress.userTier || 'free';
  const hasTier2 = Boolean(progress.hasTier2 || progress.paidTiers?.includes('tier2') || userTier === 'tier2');
  const { canAccessModule } = useTierAccess(userTier, progress.maxAllowedModuleId);
  const [viewMode, setViewMode] = useState<'map' | 'heatmap' | 'grid'>('map');
  const [sidebarTab, setSidebarTab] = useState<'challenge' | 'flashcards' | 'skills' | 'analytics' | 'tips'>('challenge');
  const [selectedNodeModule, setSelectedNodeModule] = useState<CourseModule | null>(null);
  
  // Chest and Milestone States
  const [unboxedChest, setUnboxedChest] = useState<TreasureChestData | null>(null);

  const allOpenedChestIds = useMemo(() => {
    return progress.openedChests || [];
  }, [progress.openedChests]);

  const [activeCheckpoint, setActiveCheckpoint] = useState<CheckpointMilestone | null>(null);
  const [showGraduationModal, setShowGraduationModal] = useState<boolean>(false);
  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null);

  // Ref to active module node for auto-scroll and certification banner
  const activeNodeRef = useRef<HTMLDivElement | null>(null);
  const certBannerRef = useRef<HTMLDivElement | null>(null);

  const isTier1User = !hasTier2;
  const tierTargetModules = isTier1User ? 22 : modules.length;
  const completedCount = progress.completedModules.length;
  const totalModules = tierTargetModules;
  const progressPercent = Math.min(100, Math.round((completedCount / totalModules) * 100));

  const timeCalc = useMemo(() => calculateRemainingTimeMinutes(progress.completedModules, modules), [progress.completedModules, modules]);
  const levelInfo = useMemo(() => getUserLevelInfo(progress.xp), [progress.xp]);

  // Fast O(1) lookups for roadmap layout items
  const groupStartMap = useMemo(() => {
    const map = new Map<number, (typeof PATH_GROUPS)[0]>();
    PATH_GROUPS.forEach(g => map.set(g.moduleRange[0], g));
    return map;
  }, []);

  const chestAfterMap = useMemo(() => {
    const map = new Map<number, TreasureChestData>();
    TREASURE_CHESTS.forEach(c => map.set(c.afterModuleId, c));
    return map;
  }, []);

  const milestoneAfterMap = useMemo(() => {
    const map = new Map<number, CheckpointMilestone>();
    CHECKPOINT_MILESTONES.forEach(m => map.set(m.afterModuleId, m));
    return map;
  }, []);

  // Highest unlocked or currently active module (null if all completed)
  const isAllModulesCompleted = progress.completedModules.length >= modules.length;
  const currentActiveModuleId = isAllModulesCompleted
    ? null
    : (progress.currentModuleId && !progress.completedModules.includes(progress.currentModuleId)
        ? progress.currentModuleId
        : (modules.find(m => !progress.completedModules.includes(m.id))?.id || null));

  // Smooth scroll to active node on mount / view switch (only if learning in progress)
  useEffect(() => {
    if (viewMode === 'map' && !isAllModulesCompleted && currentActiveModuleId && activeNodeRef.current) {
      const timer = setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  const handleChestClick = (chest: TreasureChestData) => {
    // Check prerequisite module completion
    const prereqCompleted = progress.completedModules.includes(chest.afterModuleId);
    if (!prereqCompleted) {
      setLockedTooltip(`🔒 Selesaikan Modul ${chest.afterModuleId} terlebih dahulu untuk membuka ${chest.title}!`);
      setTimeout(() => setLockedTooltip(null), 3500);
      return;
    }

    setUnboxedChest(chest);
  };

  const handleClaimChest = (chest: TreasureChestData) => {
    if (onOpenChest) {
      onOpenChest(chest.id, chest.xpReward, chest.title);
    } else if (onAwardXp) {
      onAwardXp(chest.xpReward, chest.title);
    }
    setUnboxedChest(null);
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.5 }
      });
    }, 100);
  };

  const handleCheckpointClick = (cp: CheckpointMilestone) => {
    setActiveCheckpoint(cp);
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 120);
  };

  const handleGraduationClick = () => {
    if (completedCount < totalModules) {
      setLockedTooltip(`🔒 Selesaikan seluruh ${totalModules} modul untuk membuka Puncak Kelulusan AI Master! (${completedCount}/${totalModules} Selesai)`);
      setTimeout(() => setLockedTooltip(null), 4000);
      return;
    }

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });

    if (hasTier2 && !progress.capstoneSubmission && onOpenCapstoneModal) {
      onOpenCapstoneModal();
    } else if (onOpenCertificateModal) {
      onOpenCertificateModal();
    } else {
      setShowGraduationModal(true);
    }

    if (certBannerRef.current) {
      certBannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Node position pattern left-center-right zig-zag
  const getNodePositionX = (index: number) => {
    const pattern = [50, 26, 50, 74, 50, 26, 50, 74];
    return pattern[index % pattern.length];
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 min-h-screen p-2 sm:p-6 rounded-2xl sm:rounded-3xl font-sans text-slate-900 dark:text-slate-100 bg-slate-100/90 dark:bg-[#070b19]">
      {/* ---------------- TOP HERO BANNER ---------------- */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-700/60 p-4 sm:p-6 md:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenStreakModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:scale-105 transition-transform cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>🔥 {progress.streakDays} Hari Streak</span>
              </button>

              {progress.isExpired && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Masa Aktif Selesai</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-1">
              <img
                src="https://cms.maxy.academy/uploads/LogoMaxy.png"
                alt="Maxy Academy Logo"
                className="h-8 sm:h-11 w-auto object-contain shrink-0 self-start sm:self-auto"
              />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                <span className="text-white font-extrabold">AI Navigator — </span>
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent block sm:inline">Platform Pembelajaran LLM Interaktif</span>
              </h1>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
              Kuasai 29 modul LLM modern dari dasar hingga mahir! Lewati setiap node zig-zag, dapatkan 3 bintang kuis, dan buka 7 Peti Karun Spesial dengan bonus tools AI eksklusif.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 text-xs">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/60 text-slate-200">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Progres: <strong className="text-amber-300">{completedCount}/{totalModules} Modul</strong> ({progressPercent}%)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/60 text-slate-200">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Sisa Waktu: <strong className="text-indigo-300">{timeCalc.formattedText}</strong></span>
              </div>
              <button
                onClick={onOpenStreakModal}
                className="flex items-center gap-2 bg-indigo-950/80 hover:bg-indigo-900/90 px-3 py-2 rounded-2xl border border-indigo-700/60 text-slate-200 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Lvl {levelInfo.level} ({levelInfo.title}): <strong className="text-amber-400">{progress.xp} XP</strong></span>
              </button>
              {onOpenAchievements && (
                <button
                  onClick={onOpenAchievements}
                  className="flex items-center gap-2 bg-amber-950/80 hover:bg-amber-900/90 px-3 py-2 rounded-2xl border border-amber-700/60 text-amber-200 transition-all cursor-pointer hover:scale-105"
                >
                  <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Peti Unlocked ({allOpenedChestIds.length}/{TREASURE_CHESTS.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress gauge card */}
          <div className="md:col-span-4 bg-slate-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-700/60 text-center space-y-2.5 sm:space-y-3 shadow-xl">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span className="font-bold text-slate-200">Progres Kelulusan</span>
              <span className="font-black text-amber-400 text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-md"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {completedCount === totalModules
                ? '🎉 Luar biasa! Semua 29 modul telah Anda kuasai! Klaim Sertifikat AI Master.'
                : `Selesaikan ${totalModules - completedCount} modul lagi untuk klaim Sertifikat Kelulusan AI Master.`}
            </p>
          </div>
        </div>
      </div>

      {/* Recharts Daily XP Trend Visualization */}
      <Suspense fallback={<WidgetSkeleton />}>
        <DailyXpTrendChart dailyXpHistory={progress.dailyXpHistory} totalXp={progress.xp} />
      </Suspense>

      {/* Toolbar: Mode Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Peta Pembelajaran</span>
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              viewMode === 'heatmap'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Knowledge Heatmap</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tampilan Kartu</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari modul atau topik LLM..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Floating Toast Tooltip for Locked Nodes */}
      <AnimatePresence>
        {lockedTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl font-extrabold text-xs shadow-2xl border border-amber-300 flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{lockedTooltip}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* MODULE COMPLETION VERIFICATION CHECKPOINT CARD */}
          {(() => {
            const requiredModulesCount = hasTier2 ? 29 : 22;
            const isFullyCompleted = completedCount >= requiredModulesCount;
            return (
              <div 
                ref={certBannerRef} 
                id="certificate-section" 
                className="w-full rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative text-slate-900 dark:text-white animate-fadeIn scroll-mt-24"
              >
                {/* Top Accent Gradient Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-indigo-600" />

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Top Row: Title, Badge, Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-sm">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            {hasTier2 ? 'Akreditasi Program • Tier 2 VIP Master' : 'Akreditasi Program • Tier 1 Basic'}
                          </span>
                          {isFullyCompleted && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Memenuhi Syarat Kelulusan
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                          {isFullyCompleted
                            ? `Selamat! Anda Telah Menyelesaikan Seluruh ${requiredModulesCount} Modul Pembelajaran`
                            : `Progres Sertifikasi: ${completedCount} dari ${requiredModulesCount} Modul Selesai`}
                        </h3>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 whitespace-nowrap self-start sm:self-auto shadow-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{completedCount} / {requiredModulesCount} Modul ({Math.round((completedCount / requiredModulesCount) * 100)}%)</span>
                    </div>
                  </div>

                  {/* Subtitle Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    {isFullyCompleted
                      ? 'Seluruh materi kompetensi dan simulasi AI praktis telah berhasil Anda kuasai. Anda berhak mengklaim kedua sertifikat resmi kelulusan di bawah ini untuk melengkapi portofolio profesional dan profil LinkedIn Anda.'
                      : `Tuntaskan ${requiredModulesCount - completedCount} modul pembelajaran lagi untuk membuka akses penerbitan dan pengunduhan sertifikat akreditasi resmi.`}
                  </p>

                  {/* Action Section */}
                  <div className="w-full pt-1">
                    {isFullyCompleted ? (
                      hasTier2 ? (
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-indigo-500" />
                              Klaim 2 Sertifikat Resmi Kelulusan (Bisa Klaim Keduanya):
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                            {/* Card 1: Sertifikat Resmi Kelulusan & Capstone (CAAI™) */}
                            {(() => {
                              const rawCapStatus = (progress.capstoneStatus || (progress.capstoneSubmission ? 'submitted' : 'not_started')).toLowerCase();
                              const isCapApproved = rawCapStatus === 'approved';
                              const isCapRevision = rawCapStatus === 'revision' || rawCapStatus === 'rejected';
                              const isCapInReview = rawCapStatus === 'in_review' || rawCapStatus === 'submitted';
                              const capTitle = progress.capstoneTitle || progress.capstoneSubmission?.title;

                              return (
                                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden shadow-xs ${
                                  isCapApproved
                                    ? 'bg-gradient-to-br from-amber-500/5 via-white to-amber-500/10 dark:from-amber-950/20 dark:via-slate-900 dark:to-amber-900/20 border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-400/30'
                                    : isCapRevision
                                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                                    : isCapInReview
                                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                                }`}>
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                          <Award className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                            Sertifikat Resmi CAAI™
                                          </h4>
                                          <span className="text-[10.5px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">
                                            Certified AI Associate (Capstone Project)
                                          </span>
                                        </div>
                                      </div>

                                      {isCapApproved ? (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black flex items-center gap-1 shrink-0">
                                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Disetujui Mentor
                                        </span>
                                      ) : isCapRevision ? (
                                        <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-black flex items-center gap-1 shrink-0">
                                          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Perlu Revisi
                                        </span>
                                      ) : isCapInReview ? (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-black flex items-center gap-1 shrink-0">
                                          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Sedang Direview
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-black shrink-0">
                                          Belum Dikumpulkan
                                        </span>
                                      )}
                                    </div>

                                    {/* Workflow Explanation Banner */}
                                    <div className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20 font-semibold flex items-center gap-1.5">
                                      <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                      <span>Alur CAAI™: Kumpulkan Capstone ➔ Penilaian Mentor ➔ Cetak Sertifikat</span>
                                    </div>

                                    {/* Project Details Box */}
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-xs">
                                      {capTitle ? (
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                                            <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            <span className="truncate">Proyek: <strong className="text-slate-900 dark:text-white font-bold">"{capTitle}"</strong></span>
                                          </div>
                                          {progress.capstoneScore !== undefined && progress.capstoneScore !== null && (
                                            <div className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-extrabold pl-5">
                                              Nilai Evaluasi: {progress.capstoneScore}/100
                                            </div>
                                          )}
                                          {isCapRevision && progress.capstoneNotes && (
                                            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold pl-5 pt-0.5 italic">
                                              Catatan Mentor: "{progress.capstoneNotes}"
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-slate-500 dark:text-slate-400 text-[10.5px] leading-relaxed">
                                          Kumpulkan tugas Capstone Project untuk dinilai oleh mentor resmi sebelum mencetak Sertifikat Resmi CAAI™.
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="pt-3.5 space-y-1.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (isCapApproved && onOpenCertificateModal) {
                                          onOpenCertificateModal('capstone');
                                        } else if (onOpenCapstoneModal) {
                                          onOpenCapstoneModal();
                                        }
                                      }}
                                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
                                        isCapApproved
                                          ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/20'
                                          : isCapRevision
                                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                                          : isCapInReview
                                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                                      }`}
                                    >
                                      <Award className="w-3.5 h-3.5" />
                                      <span>
                                        {isCapApproved
                                          ? 'Cetak Sertifikat Resmi CAAI™'
                                          : isCapRevision
                                          ? 'Perbaiki & Kumpulkan Ulang'
                                          : isCapInReview
                                          ? 'Cek Status Review Capstone'
                                          : 'Kumpulkan Capstone Project'}
                                      </span>
                                    </button>

                                    {/* Action link for log/details */}
                                    {isCapApproved ? (
                                      <div className="text-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold py-0.5">
                                        ✓ Data Capstone Terkunci (Telah Disetujui Mentor)
                                      </div>
                                    ) : (capTitle || isCapRevision || isCapInReview) && onOpenCapstoneModal ? (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onOpenCapstoneModal();
                                        }}
                                        className="w-full text-center text-[10.5px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold transition-colors cursor-pointer py-0.5"
                                      >
                                        {isCapRevision ? 'Lihat Feedback & Detail Pengumpulan' : 'Lihat Detail / Log Pengumpulan'}
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Card 2: Sertifikat Completion Standard (29 JP) */}
                            <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-500/5 via-white to-emerald-500/10 dark:from-emerald-950/20 dark:via-slate-900 dark:to-emerald-900/20 flex flex-col justify-between shadow-xs relative overflow-hidden">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                      <FileText className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                        Sertifikat Completion Standard
                                      </h4>
                                      <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                                        Kelulusan 29 Modul Pembelajaran (29 JP)
                                      </span>
                                    </div>
                                  </div>

                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black flex items-center gap-1 shrink-0">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Siap Unduh Instan
                                  </span>
                                </div>

                                {/* Instant Benefit Banner */}
                                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                  <span>Dapat langsung diunduh secara instan tanpa menunggu penilaian Capstone.</span>
                                </div>

                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-xs">
                                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10.5px]">
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>29 Modul Telah Selesai 100% (29 Jam Pelajaran)</span>
                                  </div>
                                  <p className="text-slate-500 dark:text-slate-400 text-[10.5px] leading-relaxed">
                                    Sertifikat kelulusan kurikulum resmi Maxy Academy dengan verifikasi online.
                                  </p>
                                </div>
                              </div>

                              <div className="pt-3.5 space-y-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onOpenCertificateModal) {
                                      onOpenCertificateModal('completion');
                                    }
                                  }}
                                  className="w-full py-2.5 px-3.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Download Sertifikat Completion (29 JP)</span>
                                </button>
                                <div className="text-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold py-0.5">
                                  ✓ Siap Cetak Kapan Saja
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Tier 1 Action Button */
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => onOpenCertificateModal && onOpenCertificateModal('completion')}
                            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            <Award className="w-4 h-4" />
                            <span>Download Sertifikat &amp; Transkrip 22 JP</span>
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="space-y-3 pt-2">
                        {hasTier2 && onOpenCapstoneModal && (
                          <button
                            type="button"
                            onClick={onOpenCapstoneModal}
                            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 hover:border-amber-500 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-sm"
                          >
                            <div className="flex items-center gap-2.5">
                              <FileText className="w-4 h-4 text-amber-500" />
                              <span className="font-extrabold">
                                {progress.capstoneSubmission ? `Judul Capstone: "${progress.capstoneSubmission.title}" (Klik untuk Edit)` : 'Input Judul & Link Project Capstone (Tier 2 VIP)'}
                              </span>
                            </div>
                            <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full font-black uppercase">
                              {progress.capstoneSubmission ? '✓ Tersimpan' : 'Buka Form'}
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            alert(`Anda telah menyelesaikan ${completedCount}/${requiredModulesCount} modul. Selesaikan hingga ${requiredModulesCount} modul (100%) untuk mengklaim sertifikat.`);
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                          <span>Status Progres Sertifikasi ({completedCount}/${requiredModulesCount} Modul Selesai)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* D3 KNOWLEDGE HEATMAP VIEW */}
          {viewMode === 'heatmap' && (
            <Suspense fallback={<WidgetSkeleton />}>
              <KnowledgeHeatmap
                modules={modules}
                progress={progress}
                onSelectModule={onSelectModule}
                onIncrementRevisit={onIncrementRevisit}
              />
            </Suspense>
          )}

          {/* ========================================================================= */}
          {/* INTERACTIVE SKILL TREE / DUOLINGO PATH (VERTICAL ZIG-ZAG ROADMAP)         */}
          {/* ========================================================================= */}
          {viewMode === 'map' && (
            <div className="relative max-w-2xl mx-auto py-8 sm:py-12 px-2 sm:px-8 bg-slate-100 dark:bg-slate-950/80 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              {/* Dotted Grid Background */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #f59e0b 1.5px, transparent 0)`,
                  backgroundSize: `28px 28px`
                }}
              />

              {/* Path Container */}
              <div className="relative flex flex-col items-center space-y-10 sm:space-y-12 z-10">
                {modules.map((module, index) => {
                  const isCompleted = progress.completedModules.includes(module.id);
                  const isCurrent = currentActiveModuleId !== null && module.id === currentActiveModuleId && !isCompleted;
                  
                  // Free Trial lock: User on 'free' tier can access Modules 1, 2, and 3 directly
                  const isFreeTrialLocked = !canAccessModule(module.id);

                  // Module is locked sequentially ONLY IF it's beyond accessible range and previous module not finished
                  const isLocked = index > 0 && !progress.completedModules.includes(modules[index - 1].id) && !isCurrent && !isCompleted && !canAccessModule(module.id);
                  
                  const posX = getNodePositionX(index);
                  const score = progress.moduleScores[module.id];

                  // Fast O(1) checks
                  const groupStart = groupStartMap.get(module.id);
                  const chestAfter = chestAfterMap.get(module.id);
                  const milestoneAfter = milestoneAfterMap.get(module.id);

                  // Calculate Star rating (1 to 3 stars if completed, based on 10-question quiz)
                  const starCount = isCompleted
                    ? (score !== undefined ? Math.min(3, Math.max(1, Math.ceil((score / 10) * 3))) : 3)
                    : 0;

                  return (
                    <React.Fragment key={module.id}>
                      {/* GROUP HEADER BANNER (If module is first in group) */}
                      {groupStart && (
                        <div className="w-full my-6 sm:my-8 py-4 sm:py-5 px-4 sm:px-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-700/90 shadow-2xl space-y-2 text-center relative overflow-hidden text-white">
                          <div className={`absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b ${groupStart.themeGradient}`} />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-sm ${groupStart.badgeBg}`}>
                              {groupStart.badge}
                            </span>
                            <span className="text-[11px] font-bold text-slate-300 bg-slate-800 px-3 py-0.5 rounded-full border border-slate-700">
                              Modul {groupStart.moduleRange[0]} - {groupStart.moduleRange[1]}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-sm">
                            {groupStart.title}
                          </h3>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl mx-auto">
                            {groupStart.subtitle}
                          </p>
                        </div>
                      )}

                      {/* MODULE ZIG-ZAG NODE ITEM */}
                      <div 
                        ref={isCurrent ? activeNodeRef : null}
                        className={`flex flex-col group w-full transition-all ${isCurrent ? 'pt-8' : ''}`}
                        style={{
                          alignItems: posX === 50 ? 'center' : posX < 50 ? 'flex-start' : 'flex-end',
                          paddingLeft: posX < 50 ? '6%' : '0',
                          paddingRight: posX > 50 ? '6%' : '0',
                        }}
                      >
                        <div className="relative flex flex-col items-center">
                          {/* NAVIGATOR MASCOT hovering on current uncompleted node */}
                          {isCurrent && (
                            <NavigatorMascot moduleTitle={module.title} />
                          )}

                          {/* NODE BUTTON */}
                          <button
                          onClick={() => {
                            if (isFreeTrialLocked) {
                              if (onOpenUpgradeModal) {
                                onOpenUpgradeModal(module.id);
                              } else {
                                setLockedTooltip(`🔒 Status Free Trial dapat mengakses Modul 1 hingga Modul 3. Silakan upgrade ke Tier 1 atau Tier 2!`);
                                setTimeout(() => setLockedTooltip(null), 3500);
                              }
                            } else if (isLocked) {
                              const prevModule = modules[index - 1];
                              setLockedTooltip(`🔒 Selesaikan Modul ${prevModule.id} (${prevModule.title}) terlebih dahulu!`);
                              setTimeout(() => setLockedTooltip(null), 3500);
                            } else {
                              setSelectedNodeModule(module);
                            }
                          }}
                          className={`relative group flex flex-col items-center focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95 ${
                            isCurrent ? 'z-20' : 'z-10'
                          }`}
                        >
                          {/* Glowing halo for active node */}
                          {isCurrent && (
                            <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/30 blur-md animate-pulse" />
                          )}

                          {/* Node Circle Shape */}
                          <div
                            className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl flex flex-col items-center justify-center relative shadow-xl transition-all border-4 ${
                              isCompleted
                                ? 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-800 border-emerald-300 text-white shadow-emerald-500/30'
                                : isFreeTrialLocked
                                ? 'bg-white dark:bg-slate-900 border-amber-500/50 text-amber-500 dark:text-amber-400 shadow-amber-500/10'
                                : isCurrent
                                ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-yellow-700 border-amber-200 text-slate-950 shadow-amber-400/50 ring-4 ring-amber-500/40'
                                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600 shadow-sm'
                            }`}
                          >
                            {/* Shimmer top gloss */}
                            <div className="absolute inset-x-2 top-1 h-3 bg-white/20 rounded-t-xl pointer-events-none" />

                            {/* Node Icon or Lock */}
                            <div className="relative z-10">
                              {isFreeTrialLocked ? (
                                <div className="flex flex-col items-center">
                                  <Lock className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                                  <span className="text-[7px] font-black text-amber-600 dark:text-amber-300 uppercase tracking-tighter mt-0.5">Free Trial</span>
                                </div>
                              ) : isLocked ? (
                                <Lock className="w-7 h-7 text-slate-400 dark:text-slate-600" />
                              ) : isCompleted ? (
                                <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
                              ) : (
                                getModuleIcon(module.icon)
                              )}
                            </div>

                            {/* Module Number Tag */}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full mt-1 z-10 ${
                              isCompleted
                                ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-400/40'
                                : isFreeTrialLocked
                                ? 'bg-amber-50 dark:bg-amber-950/90 text-amber-700 dark:text-amber-300 border border-amber-500/50'
                                : isCurrent
                                ? 'bg-slate-950/90 text-amber-300 border border-amber-400/60 font-bold'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                            }`}>
                              Modul {module.id}
                            </span>
                          </div>

                          {/* 3-Star Rating Indicator */}
                          <div className="flex items-center gap-1 mt-2 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-md">
                            {[1, 2, 3].map((starNum) => {
                              const hasStar = isCompleted && starNum <= starCount;
                              return (
                                <Star
                                  key={starNum}
                                  className={`w-3.5 h-3.5 ${
                                    hasStar
                                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_#f59e0b]'
                                      : 'text-slate-300 dark:text-slate-700'
                                  }`}
                                />
                              );
                            })}
                          </div>

                          {/* Module Short Title */}
                          <span className={`text-xs font-bold mt-1.5 max-w-[150px] text-center line-clamp-1 transition-colors ${
                            isCurrent
                              ? 'text-amber-500 dark:text-amber-300 font-black drop-shadow-sm'
                              : isCompleted
                              ? 'text-slate-800 dark:text-slate-100 font-extrabold group-hover:text-amber-400'
                              : 'text-slate-500 dark:text-slate-400 font-medium'
                          }`}>
                            {module.title}
                          </span>

                          {/* First Module Active "Mulai" Badge */}
                          {module.id === 1 && !isCompleted && (
                            <span className="mt-1 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] shadow-lg animate-bounce">
                              Mulai Di Sini!
                            </span>
                          )}
                        </button>
                        </div>
                      </div>

                      {/* ========================================================== */}
                      {/* TREASURE CHEST ITEM (Interspersed Rewards)                */}
                      {/* ========================================================== */}
                      {chestAfter && (
                        <div className="relative flex flex-col items-center my-3 z-10">
                          {(() => {
                            const isOpened = allOpenedChestIds.includes(chestAfter.id);
                            const isPrereqDone = progress.completedModules.includes(chestAfter.afterModuleId);

                            return (
                              <button
                                onClick={() => handleChestClick(chestAfter)}
                                className="group flex flex-col items-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                              >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-xl transition-all ${
                                  isOpened
                                    ? 'bg-gradient-to-b from-emerald-600 to-emerald-900 border-2 border-emerald-400 shadow-emerald-500/20'
                                    : isPrereqDone
                                    ? 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-700 border-2 border-amber-200 shadow-amber-500/40 ring-4 ring-amber-400/30 animate-bounce'
                                    : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-600'
                                }`}>
                                  <Gift className={`w-8 h-8 ${
                                    isOpened
                                      ? 'text-white'
                                      : isPrereqDone
                                      ? 'text-slate-950 fill-amber-200'
                                      : 'text-slate-500'
                                  }`} />

                                  {/* Unopened Alert Badge */}
                                  {!isOpened && isPrereqDone && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white text-[10px] font-black text-white flex items-center justify-center animate-pulse">
                                      !
                                    </div>
                                  )}

                                  {isOpened && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full text-slate-950 flex items-center justify-center font-bold text-xs">
                                      ✓
                                    </div>
                                  )}
                                </div>

                                <span className={`text-[11px] font-extrabold mt-1.5 flex items-center gap-1 ${
                                  isOpened ? 'text-emerald-400' : isPrereqDone ? 'text-amber-400 font-black' : 'text-slate-500'
                                }`}>
                                  <Sparkles className="w-3 h-3 text-amber-400" />
                                  {chestAfter.title} (+{chestAfter.xpReward} XP)
                                </span>
                              </button>
                            );
                          })()}
                        </div>
                      )}

                      {/* ========================================================== */}
                      {/* CHECKPOINT MILESTONE (Inter-Group Level Up)               */}
                      {/* ========================================================== */}
                      {milestoneAfter && (
                        <div className="w-full my-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/40 text-center space-y-1 shadow-lg z-10">
                          <button
                            onClick={() => handleCheckpointClick(milestoneAfter)}
                            className="w-full flex items-center justify-between text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-bold shrink-0">
                                🚀
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-extrabold text-amber-300 group-hover:text-amber-200 transition-colors">
                                  {milestoneAfter.title}
                                </h4>
                                <p className="text-[11px] text-slate-300">
                                  Lencana: <strong className="text-white font-bold">{milestoneAfter.levelBadge}</strong>
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* ========================================================== */}
                {/* FINAL CROWN NODE — "Puncak Kelulusan AI Master"           */}
                {/* ========================================================== */}
                <div className="relative flex flex-col items-center pt-8 z-10 w-full">
                  <button
                    onClick={handleGraduationClick}
                    className="group flex flex-col items-center hover:scale-105 transition-all cursor-pointer"
                  >
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center relative shadow-2xl transition-all border-4 ${
                      completedCount === totalModules
                        ? 'bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-600 border-amber-200 shadow-amber-500/60 ring-8 ring-amber-400/30 animate-pulse'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}>
                      <Crown className={`w-12 h-12 ${
                        completedCount === totalModules
                          ? 'text-slate-950 fill-amber-200 animate-bounce'
                          : 'text-slate-600'
                      }`} />
                    </div>

                    <span className={`text-sm font-black mt-3 flex items-center gap-1.5 ${
                      completedCount === totalModules ? 'text-amber-400' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Puncak Kelulusan AI Master
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                      {completedCount === totalModules
                        ? '🎉 Klik untuk Mengklaim Sertifikat Kelulusan Resmi!'
                        : `Terkunci — Selesaikan seluruh ${totalModules} modul untuk klaim sertifikat.`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GRID CARD VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {modules.map((module) => {
                const isFreeTrialLocked = !canAccessModule(module.id);
                const isCompleted = progress.completedModules.includes(module.id);
                const isCurrent = module.id === currentActiveModuleId;
                const score = progress.moduleScores[module.id];

                return (
                  <div
                    key={module.id}
                    onClick={() => {
                      if (isFreeTrialLocked && onOpenUpgradeModal) {
                        onOpenUpgradeModal(module.id);
                      } else {
                        onSelectModule(module.id);
                      }
                    }}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                      isCurrent
                        ? 'bg-white dark:bg-slate-900 border-amber-500/80 shadow-xl shadow-amber-500/10'
                        : isFreeTrialLocked
                        ? 'bg-white dark:bg-slate-50/80 dark:bg-slate-900/40 border-amber-500/30 hover:border-amber-500/60'
                        : isCompleted
                        ? 'bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border-emerald-500/40'
                        : 'bg-white dark:bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                          {isFreeTrialLocked ? <Lock className="w-6 h-6 text-amber-400" /> : getModuleIcon(module.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                              Modul {module.id}
                            </span>
                            {isFreeTrialLocked && (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                Free Trial
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{module.title}</h3>
                        </div>
                      </div>

                      <button className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-colors ${
                        isFreeTrialLocked
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}>
                        <span>{isFreeTrialLocked ? 'Upgrade' : 'Mulai'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-medium">
                      {module.subtitle} — {module.content.overview.tagline}
                    </p>

                    {isCompleted && score !== undefined && (
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800/80 text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Selesai
                        </span>
                        <span className="text-amber-400 font-bold">Skor Kuis: {score}/{module.content.quiz.length}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Sidebar Tab Controls Header */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <button
              onClick={() => setSidebarTab('challenge')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap min-w-0 ${
                sidebarTab === 'challenge'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-200/70 dark:hover:bg-slate-100 dark:bg-slate-800/50'
              }`}
            >
              <Flame className={`w-3 h-3 shrink-0 ${sidebarTab === 'challenge' ? 'text-slate-950 fill-slate-950' : 'text-amber-500'}`} />
              <span className="truncate">Tantangan</span>
            </button>

            <button
              onClick={() => setSidebarTab('flashcards')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap min-w-0 ${
                sidebarTab === 'flashcards'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-200/70 dark:hover:bg-slate-100 dark:bg-slate-800/50'
              }`}
            >
              <Layers className={`w-3 h-3 shrink-0 ${sidebarTab === 'flashcards' ? 'text-slate-950' : 'text-amber-500'}`} />
              <span className="truncate">Kartu</span>
            </button>

            <button
              onClick={() => setSidebarTab('skills')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap min-w-0 ${
                sidebarTab === 'skills'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-200/70 dark:hover:bg-slate-100 dark:bg-slate-800/50'
              }`}
            >
              <Compass className={`w-3 h-3 shrink-0 ${sidebarTab === 'skills' ? 'text-slate-950' : 'text-amber-500'}`} />
              <span className="truncate">Radar</span>
            </button>

            <button
              onClick={() => setSidebarTab('analytics')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap min-w-0 ${
                sidebarTab === 'analytics'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-200/70 dark:hover:bg-slate-100 dark:bg-slate-800/50'
              }`}
            >
              <Zap className={`w-3 h-3 shrink-0 ${sidebarTab === 'analytics' ? 'text-slate-950' : 'text-amber-500'}`} />
              <span className="truncate">Analisis</span>
            </button>

            <button
              onClick={() => setSidebarTab('tips')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap min-w-0 ${
                sidebarTab === 'tips'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-200/70 dark:hover:bg-slate-100 dark:bg-slate-800/50'
              }`}
            >
              <BookOpen className={`w-3 h-3 shrink-0 ${sidebarTab === 'tips' ? 'text-slate-950' : 'text-amber-500'}`} />
              <span className="truncate">Tips</span>
            </button>
          </div>

          {/* Active Sidebar Content */}
          <AnimatePresence mode="wait">
            {sidebarTab === 'challenge' && (
              <motion.div
                key="challenge-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={<WidgetSkeleton />}>
                  <DailyChallengeWidget onAwardXp={onAwardXp} />
                </Suspense>
              </motion.div>
            )}
            {sidebarTab === 'flashcards' && (
              <motion.div
                key="flashcards-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={<WidgetSkeleton />}>
                  <ConceptFlashcardsWidget onAwardXp={onAwardXp} />
                </Suspense>
              </motion.div>
            )}

            {sidebarTab === 'skills' && (
              <motion.div
                key="skills-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={<WidgetSkeleton />}>
                  <SkillRadarChartWidget
                    modules={modules}
                    progress={progress}
                    onSelectModule={onSelectModule}
                  />
                </Suspense>
              </motion.div>
            )}

            {sidebarTab === 'analytics' && (
              <motion.div
                key="analytics-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={<WidgetSkeleton />}>
                  <ProgressAnalyticsWidget progress={progress} />
                </Suspense>
              </motion.div>
            )}

            {sidebarTab === 'tips' && (
              <motion.div
                key="tips-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <LearningTipsWidget onAwardXp={onAwardXp} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Streak & Goal Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                Streak Belajar Harian
              </span>
              <span className="text-xs font-black text-amber-400">{progress.streakDays} Hari Beruntun</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Pertahankan konsistensi harian Anda dengan membaca minimal 1 Tip AI &amp; menyelesaikan modul secara teratur.
            </p>
            {onOpenStreakModal && (
              <button
                onClick={onOpenStreakModal}
                className="w-full py-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Lihat Target &amp; Riwayat Streak</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NODE CLICK PREVIEW MODAL                                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedNodeModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setSelectedNodeModule(null)}
                className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full hover:bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg">
                  {getModuleIcon(selectedNodeModule.icon)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Level Modul {selectedNodeModule.id}
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {selectedNodeModule.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedNodeModule.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedNodeModule.subtitle}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Fokus Pembelajaran:
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedNodeModule.content.overview.tagline}
                </p>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-900 text-[11px] font-medium">
                  <span>⏱ Estimasi: {selectedNodeModule.estimatedMinutes} Menit</span>
                  <span>❓ Kuis: {selectedNodeModule.content.quiz.length} Soal</span>
                  <span>✨ Hadiah: +100 XP</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const id = selectedNodeModule.id;
                    setSelectedNodeModule(null);
                    if (!canAccessModule(id)) {
                      if (onOpenUpgradeModal) {
                        onOpenUpgradeModal(id);
                      }
                    } else {
                      onSelectModule(id);
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {progress.completedModules.includes(selectedNodeModule.id)
                      ? 'Pelajari Kembali Modul Ini'
                      : 'Mulai Petualangan Modul Ini'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* TREASURE CHEST UNBOXING MODAL                                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {unboxedChest && (() => {
          const isClaimed = allOpenedChestIds.includes(unboxedChest.id);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center text-slate-900 dark:text-white"
              >
                <button
                  onClick={() => setUnboxedChest(null)}
                  className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full hover:bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-2xl border-2 ${
                  isClaimed
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-300 shadow-emerald-500/30'
                    : 'bg-gradient-to-b from-amber-400 to-amber-600 border-amber-200 shadow-amber-500/50'
                }`}>
                  <Gift className={`w-10 h-10 ${isClaimed ? 'text-white' : 'text-slate-950 fill-amber-200'}`} />
                </div>

                <div className="space-y-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isClaimed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isClaimed ? '✓ Bonus Telah Diklaim' : '🎉 Bonus Peti Harta Karun!'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-amber-300">{unboxedChest.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {unboxedChest.description}
                  </p>
                </div>

                {/* Bonus Mini Tutorial Preview */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-3 text-xs">
                  <div className="font-extrabold text-amber-300 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span>💡 Mini Tutorial: {unboxedChest.bonusToolName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      isClaimed
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isClaimed ? `✓ Sudah Diklaim (+${unboxedChest.xpReward} XP)` : `+${unboxedChest.xpReward} XP`}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {unboxedChest.miniTutorial.overview}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">Pro Tips:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 font-medium">
                      {unboxedChest.miniTutorial.keyTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-amber-200 select-all">
                    <span className="text-[9px] text-slate-500 font-sans block mb-1">Contoh Prompt:</span>
                    {unboxedChest.miniTutorial.samplePrompt}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isClaimed) {
                      setUnboxedChest(null);
                    } else {
                      handleClaimChest(unboxedChest);
                    }
                  }}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all cursor-pointer ${
                    isClaimed
                      ? 'bg-slate-800 hover:bg-slate-700 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  {isClaimed ? 'Tutup Tutorial' : `🎁 Buka Peti & Klaim (+${unboxedChest.xpReward} XP)`}
                </button>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CHECKPOINT MILESTONE MODAL                                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeCheckpoint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setActiveCheckpoint(null)}
                className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full hover:bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-2xl shadow-indigo-500/50">
                🚀
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block">
                  Milestone Reached!
                </span>
                <h3 className="text-xl font-black text-amber-300">{activeCheckpoint.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {activeCheckpoint.message}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-emerald-400 flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Gelar Lencana: {activeCheckpoint.levelBadge}</span>
              </div>

              <button
                onClick={() => setActiveCheckpoint(null)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-900 dark:text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer"
              >
                Lanjutkan ke Kelompok Berikutnya
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* FINAL GRADUATION CELEBRATION MODAL (CERTIFICATE)                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showGraduationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 text-slate-900 dark:text-white my-8"
            >
              <button
                onClick={() => setShowGraduationModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full hover:bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Canvas Preview */}
              <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-400/80 shadow-2xl space-y-4 text-center overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-center border-b border-amber-500/30 pb-4">
                  <div className="flex items-center gap-2 text-left">
                    <Crown className="w-8 h-8 text-amber-400" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                        AI NAVIGATOR ACADEMY
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">SERTIFIKAT KELULUSAN RESMI</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-500 text-slate-950">
                    AI MASTER 2026
                  </span>
                </div>

                <div className="py-4 space-y-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Sertifikat ini secara sah diberikan kepada:</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                    Praktisi LLM Master
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto font-medium leading-relaxed">
                    Atas keberhasilan menyelesaikan seluruh <strong>29 Modul Pembelajaran LLM Interaktif</strong>, mengumpulkan seluruh Peti Karun Spesialis, dan meraih nilai kuis tertinggi pada platform AI Navigator.
                  </p>
                </div>

                {/* Certificate Stats Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 bg-white dark:bg-[#0d1322] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Modul Selesai</span>
                    <strong className="text-amber-400 font-black text-base">{totalModules}/{totalModules}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Total XP</span>
                    <strong className="text-amber-400 font-black text-base">{progress.xp} XP</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Status Gelar</span>
                    <strong className="text-emerald-400 font-black text-base">AI Master</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>ID Verifikasi: AINAV-2026-M29-CERT</span>
                  <span>Diterbitkan: 29 Juli 2026</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    alert('Sertifikat Digital berhasil diunduh dalam format PNG!');
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = 800;
                    canvas.height = 600;
                    const ctx = canvas.getContext('2d');
                    
                    if (ctx) {
                      ctx.fillStyle = '#0f172a';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      
                      ctx.strokeStyle = '#f59e0b';
                      ctx.lineWidth = 10;
                      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
                      
                      ctx.fillStyle = '#f59e0b';
                      ctx.font = 'bold 24px Arial';
                      ctx.textAlign = 'center';
                      ctx.fillText('AI NAVIGATOR ACADEMY', canvas.width / 2, 100);
                      
                      ctx.fillStyle = '#ffffff';
                      ctx.font = 'bold 36px Arial';
                      ctx.fillText('SERTIFIKAT KELULUSAN RESMI', canvas.width / 2, 160);
                      
                      ctx.fillStyle = '#94a3b8';
                      ctx.font = '16px Arial';
                      ctx.fillText('Diberikan kepada:', canvas.width / 2, 250);
                      
                      ctx.fillStyle = '#fcd34d';
                      ctx.font = 'bold 48px Arial';
                      ctx.fillText('Praktisi LLM Master', canvas.width / 2, 320);
                      
                      ctx.fillStyle = '#94a3b8';
                      ctx.font = '14px Arial';
                      ctx.fillText('Atas keberhasilan menyelesaikan seluruh 29 Modul Pembelajaran LLM Interaktif,', canvas.width / 2, 400);
                      ctx.fillText('mengumpulkan seluruh Peti Karun Spesialis, dan meraih nilai kuis tertinggi.', canvas.width / 2, 430);
                      
                      ctx.fillStyle = '#64748b';
                      ctx.font = '12px Arial';
                      ctx.fillText('ID Verifikasi: AINAV-2026-M29-CERT', canvas.width / 2, 520);
                      ctx.fillText('Diterbitkan: 29 Juli 2026', canvas.width / 2, 540);
                      
                      const dataUrl = canvas.toDataURL('image/png');
                      const link = document.createElement('a');
                      link.href = dataUrl;
                      link.download = 'Sertifikat_AI_Master_2026.png';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Sertifikat Digital (PNG)</span>
                </button>
                <button
                  onClick={() => setShowGraduationModal(false)}
                  className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default LearningPathRoadmap;
