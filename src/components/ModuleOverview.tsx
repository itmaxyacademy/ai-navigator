import React from 'react';
import { 
  Sparkles, UserCheck, FileText, Target, Layout, Cpu, LayoutGrid, Mic, Store,
  PenTool, Code2, BookOpen, ShieldCheck, Layers, Globe, SearchCheck, Image, Link,
  Filter, FolderPlus, SlidersHorizontal, FileCode, Sliders, Sidebar, Share2,
  Code, MessageCircle, Wand2, Workflow, Coins, Download, ArrowRight, CheckCircle2, Star,
  Compass, Zap, Award
} from 'lucide-react';
import { CourseModule } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { MiniQuizCheckpoint } from './MiniQuizCheckpoint';
import { getSectionCheckpointQuestion } from '../lib/miniQuizData';

interface ModuleOverviewProps {
  module: CourseModule;
  onAdvanceToReplica: () => void;
  completedCheckpoints?: string[];
  onCompleteCheckpoint?: (checkpointId: string, xpBonus: number) => void;
}

const renderAdvantageIcon = (iconName: string, themeColor: string) => {
  const iconProps = { className: `w-5 h-5 ${themeColor}` };
  switch (iconName) {
    case 'UserCheck': return <UserCheck {...iconProps} />;
    case 'FileText': return <FileText {...iconProps} />;
    case 'Target': return <Target {...iconProps} />;
    case 'Layout': return <Layout {...iconProps} />;
    case 'Cpu': return <Cpu {...iconProps} />;
    case 'LayoutGrid': return <LayoutGrid {...iconProps} />;
    case 'Mic': return <Mic {...iconProps} />;
    case 'Store': return <Store {...iconProps} />;
    case 'PenTool': return <PenTool {...iconProps} />;
    case 'Code2': return <Code2 {...iconProps} />;
    case 'BookOpen': return <BookOpen {...iconProps} />;
    case 'ShieldCheck': return <ShieldCheck {...iconProps} />;
    case 'Layers': return <Layers {...iconProps} />;
    case 'Globe': return <Globe {...iconProps} />;
    case 'SearchCheck': return <SearchCheck {...iconProps} />;
    case 'Image': return <Image {...iconProps} />;
    case 'Link': return <Link {...iconProps} />;
    case 'Filter': return <Filter {...iconProps} />;
    case 'FolderPlus': return <FolderPlus {...iconProps} />;
    case 'SlidersHorizontal': return <SlidersHorizontal {...iconProps} />;
    case 'FileCode': return <FileCode {...iconProps} />;
    case 'Sliders': return <Sliders {...iconProps} />;
    case 'Sidebar': return <Sidebar {...iconProps} />;
    case 'Share2': return <Share2 {...iconProps} />;
    case 'Code': return <Code {...iconProps} />;
    case 'MessageCircle': return <MessageCircle {...iconProps} />;
    case 'Wand2': return <Wand2 {...iconProps} />;
    case 'Workflow': return <Workflow {...iconProps} />;
    case 'Coins': return <Coins {...iconProps} />;
    case 'Download': return <Download {...iconProps} />;
    default: return <Sparkles {...iconProps} />;
  }
};

// Color palettes for the 4 core feature cards matching the roadmap aesthetic
const CARD_THEMES = [
  {
    border: 'border-amber-200 dark:border-amber-800/60 hover:border-amber-300 dark:hover:border-amber-700',
    bg: 'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900/90',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400',
    tagBg: 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
    exampleBox: 'bg-amber-100/50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200',
  },
  {
    border: 'border-sky-200 dark:border-sky-800/60 hover:border-sky-300 dark:hover:border-sky-700',
    bg: 'bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900/90',
    iconBg: 'bg-sky-100 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400',
    tagBg: 'bg-sky-100/70 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    textColor: 'text-sky-700 dark:text-sky-400',
    exampleBox: 'bg-sky-100/50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70 text-sky-900 dark:text-sky-200',
  },
  {
    border: 'border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-700',
    bg: 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900/90',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400',
    tagBg: 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    exampleBox: 'bg-emerald-100/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200',
  },
  {
    border: 'border-purple-200 dark:border-purple-800/60 hover:border-purple-300 dark:hover:border-purple-700',
    bg: 'bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900/90',
    iconBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400',
    tagBg: 'bg-purple-100/70 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-400',
    exampleBox: 'bg-purple-100/50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70 text-purple-900 dark:text-purple-200',
  },
];

// Special actionable examples for Module 1 (RCTF)
const RCTF_EXAMPLES = [
  '💡 Contoh: "Bertindaklah sebagai Senior Growth Marketing Consultant..."',
  '💡 Contoh: "Untuk produk B2B SaaS dengan target 500 user pertama..."',
  '💡 Contoh: "Susun 3 strategi akuisisi user organik yang paling efektif..."',
  '💡 Contoh: "Sajikan dalam tabel 4 kolom (Strategi, Eksekusi, Waktu, KPI)..."',
];

export const ModuleOverview: React.FC<ModuleOverviewProps> = ({
  module,
  onAdvanceToReplica,
  completedCheckpoints,
  onCompleteCheckpoint,
}) => {
  const overview = module.content.overview;
  const overviewQuestion = getSectionCheckpointQuestion(module, 'overview');
  const isRCTF = module.id === 1;

  return (
    <div className="space-y-8">
      {/* Hero Header Info Card (Dark Navy Pill matching Roadmap Group Banner) */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top meta tags */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm">
              Modul {module.id} dari {MODULES_DATA.length}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-800/90 text-slate-300 border border-slate-700">
              {overview.developer} ({overview.releaseYear})
            </span>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {module.badge}
          </span>
        </div>

        {/* Title & Tagline */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md">
            {module.title}
          </h1>
          <p className="text-sm sm:text-base font-extrabold text-amber-300 mt-1.5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            {overview.tagline}
          </p>
        </div>

        {/* Intro Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-3 border-t border-slate-800 font-normal">
          {overview.description}
        </p>
      </div>

      {/* Key Advantages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Keunggulan Utama & Fitur Unggulan</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
            4 Pilar Kunci Modul {module.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overview.keyAdvantages.map((adv, idx) => {
            const theme = CARD_THEMES[idx % CARD_THEMES.length];
            return (
              <div
                key={idx}
                className={`${theme.bg} ${theme.border} border p-5 sm:p-6 rounded-3xl space-y-3 shadow-sm transition-all hover:shadow-md flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl ${theme.iconBg} border flex items-center justify-center shrink-0 shadow-sm`}>
                        {renderAdvantageIcon(adv.icon, theme.textColor)}
                      </div>
                      <div>
                        <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                          {adv.title}
                        </h3>
                        <span className={`text-[10px] font-black uppercase tracking-wider block mt-0.5 ${theme.textColor}`}>
                          Pilar 0{idx + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {adv.description}
                  </p>
                </div>

                {/* Example pill for RCTF / Special modules */}
                {isRCTF && RCTF_EXAMPLES[idx] && (
                  <div className="mt-2 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                    <span className={`text-[11px] font-bold block italic ${theme.exampleBox} px-3 py-1.5 rounded-xl border`}>
                      {RCTF_EXAMPLES[idx]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Use Cases & Unique Capabilities side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best For Card */}
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm text-slate-900 dark:text-white">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                Paling Cocok Digunakan Untuk:
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Skenario & Use Cases
              </span>
            </div>
          </div>

          <ul className="space-y-3">
            {overview.bestFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unique Capabilities Card */}
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm text-slate-900 dark:text-white">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                Kemampuan & Fitur Unik:
              </h3>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                Nilai Tambah & Diferensiasi
              </span>
            </div>
          </div>

          <ul className="space-y-3">
            {overview.uniqueCapabilities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mid-Module Mini-Quiz Checkpoint */}
      {onCompleteCheckpoint && (
        <MiniQuizCheckpoint
          checkpointId={overviewQuestion.id}
          title={overviewQuestion.title}
          question={overviewQuestion}
          completedCheckpoints={completedCheckpoints}
          onCompleteCheckpoint={onCompleteCheckpoint}
        />
      )}

      {/* Next Step Action Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onAdvanceToReplica}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span>Lanjut ke Tampilan Interaktif Simulasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
