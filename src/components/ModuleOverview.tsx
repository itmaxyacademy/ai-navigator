import React from 'react';
import { 
  Sparkles, UserCheck, FileText, Target, Layout, Cpu, LayoutGrid, Mic, Store,
  PenTool, Code2, BookOpen, ShieldCheck, Layers, Globe, SearchCheck, Image, Link,
  Filter, FolderPlus, SlidersHorizontal, FileCode, Sliders, Sidebar, Share2,
  Code, MessageCircle, Wand2, Workflow, Coins, Download, ArrowRight, CheckCircle2, Star
} from 'lucide-react';
import { CourseModule } from '../types';
import { MiniQuizCheckpoint } from './MiniQuizCheckpoint';
import { getSectionCheckpointQuestion } from '../lib/miniQuizData';

interface ModuleOverviewProps {
  module: CourseModule;
  onAdvanceToReplica: () => void;
  completedCheckpoints?: string[];
  onCompleteCheckpoint?: (checkpointId: string, xpBonus: number) => void;
}

const renderAdvantageIcon = (iconName: string) => {
  const props = { className: "w-5 h-5 text-indigo-400" };
  switch (iconName) {
    case 'UserCheck': return <UserCheck {...props} className="w-5 h-5 text-amber-400" />;
    case 'FileText': return <FileText {...props} className="w-5 h-5 text-indigo-400" />;
    case 'Target': return <Target {...props} className="w-5 h-5 text-emerald-400" />;
    case 'Layout': return <Layout {...props} className="w-5 h-5 text-purple-400" />;
    case 'Cpu': return <Cpu {...props} className="w-5 h-5 text-emerald-400" />;
    case 'LayoutGrid': return <LayoutGrid {...props} className="w-5 h-5 text-blue-400" />;
    case 'Mic': return <Mic {...props} className="w-5 h-5 text-pink-400" />;
    case 'Store': return <Store {...props} className="w-5 h-5 text-amber-400" />;
    case 'PenTool': return <PenTool {...props} className="w-5 h-5 text-amber-500" />;
    case 'Code2': return <Code2 {...props} className="w-5 h-5 text-indigo-400" />;
    case 'BookOpen': return <BookOpen {...props} className="w-5 h-5 text-emerald-400" />;
    case 'ShieldCheck': return <ShieldCheck {...props} className="w-5 h-5 text-purple-400" />;
    case 'Layers': return <Layers {...props} className="w-5 h-5 text-blue-400" />;
    case 'Globe': return <Globe {...props} className="w-5 h-5 text-cyan-400" />;
    case 'SearchCheck': return <SearchCheck {...props} className="w-5 h-5 text-emerald-400" />;
    case 'Image': return <Image {...props} className="w-5 h-5 text-purple-400" />;
    case 'Link': return <Link {...props} className="w-5 h-5 text-cyan-400" />;
    case 'Filter': return <Filter {...props} className="w-5 h-5 text-indigo-400" />;
    case 'FolderPlus': return <FolderPlus {...props} className="w-5 h-5 text-amber-400" />;
    case 'SlidersHorizontal': return <SlidersHorizontal {...props} className="w-5 h-5 text-emerald-400" />;
    case 'FileCode': return <FileCode {...props} className="w-5 h-5 text-blue-400" />;
    case 'Sliders': return <Sliders {...props} className="w-5 h-5 text-purple-400" />;
    case 'Sidebar': return <Sidebar {...props} className="w-5 h-5 text-cyan-400" />;
    case 'Share2': return <Share2 {...props} className="w-5 h-5 text-pink-400" />;
    case 'Code': return <Code {...props} className="w-5 h-5 text-indigo-400" />;
    case 'MessageCircle': return <MessageCircle {...props} className="w-5 h-5 text-emerald-400" />;
    case 'Wand2': return <Wand2 {...props} className="w-5 h-5 text-pink-400" />;
    case 'Workflow': return <Workflow {...props} className="w-5 h-5 text-blue-400" />;
    case 'Coins': return <Coins {...props} className="w-5 h-5 text-amber-400" />;
    case 'Download': return <Download {...props} className="w-5 h-5 text-emerald-400" />;
    default: return <Sparkles {...props} className="w-5 h-5 text-amber-400" />;
  }
};

export const ModuleOverview: React.FC<ModuleOverviewProps> = ({
  module,
  onAdvanceToReplica,
  completedCheckpoints,
  onCompleteCheckpoint,
}) => {
  const overview = module.content.overview;
  const overviewQuestion = getSectionCheckpointQuestion(module, 'overview');

  return (
    <div className="space-y-8">
      {/* Header Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Modul {module.id} dari 13
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
              {overview.developer} ({overview.releaseYear})
            </span>
          </div>

          <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {module.badge}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {module.title}
          </h1>
          <p className="text-sm sm:text-base text-indigo-300 font-medium mt-1">
            {overview.tagline}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
          {overview.description}
        </p>
      </div>

      {/* Key Advantages Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Keunggulan Utama & Fitur Unggulan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {overview.keyAdvantages.map((adv, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-2 transition-all hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                {renderAdvantageIcon(adv.icon)}
              </div>
              <h3 className="font-bold text-sm text-white">{adv.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {adv.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases & Unique Capabilities side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best For */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Paling Cocok Digunakan Untuk:
          </h3>
          <ul className="space-y-2">
            {overview.bestFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unique Capabilities */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Kemampuan Unik:
          </h3>
          <ul className="space-y-2">
            {overview.uniqueCapabilities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{item}</span>
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
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
        >
          Lanjut ke Tampilan Interaktif Simulasi <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
