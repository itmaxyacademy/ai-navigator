import React, { useState } from 'react';
import { 
  Sparkles, MessageSquare, Feather, Sparkle, Search, Bot, Share2, BrainCircuit, BookOpen,
  CheckCircle2, Lock, ArrowRight, Play, Trophy, Clock, Star, Award, Compass,
  Gift, Crown, Map, LayoutGrid, X, Zap, ChevronRight, Check, Video, Music, Terminal, Gem
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CourseModule, UserProgress } from '../types';

interface LearningPathRoadmapProps {
  modules: CourseModule[];
  progress: UserProgress;
  onSelectModule: (moduleId: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const getModuleIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles className="w-7 h-7 text-amber-300" />;
    case 'MessageSquare':
      return <MessageSquare className="w-7 h-7 text-emerald-300" />;
    case 'Feather':
      return <Feather className="w-7 h-7 text-amber-400" />;
    case 'Sparkle':
      return <Sparkle className="w-7 h-7 text-blue-300" />;
    case 'Search':
      return <Search className="w-7 h-7 text-cyan-300" />;
    case 'Bot':
      return <Bot className="w-7 h-7 text-purple-300" />;
    case 'Share2':
      return <Share2 className="w-7 h-7 text-pink-300" />;
    case 'BrainCircuit':
      return <BrainCircuit className="w-7 h-7 text-indigo-300" />;
    case 'BookOpen':
      return <BookOpen className="w-7 h-7 text-blue-300" />;
    case 'Video':
      return <Video className="w-7 h-7 text-rose-300" />;
    case 'Music':
      return <Music className="w-7 h-7 text-pink-400" />;
    case 'Terminal':
      return <Terminal className="w-7 h-7 text-blue-400" />;
    case 'Gem':
      return <Gem className="w-7 h-7 text-blue-400" />;
    case 'Bot':
      return <Bot className="w-7 h-7 text-orange-400" />;
    default:
      return <Sparkles className="w-7 h-7 text-indigo-300" />;
  }
};

// Mascot component sitting on top of current active node
const NavigatorMascot = ({ moduleTitle }: { moduleTitle: string }) => {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: [0, -8, 0], opacity: 1 }}
      transition={{
        y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
        opacity: { duration: 0.4 }
      }}
      className="absolute -top-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none w-52"
    >
      {/* Speech Bubble */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-xl border border-indigo-300/40 text-center flex items-center gap-1.5 mb-1 whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
        <span>Di sini: {moduleTitle.split(' ')[0]}!</span>
      </div>

      {/* Futuristic Cyber Mascot Avatar */}
      <div className="relative w-14 h-14">
        {/* Glow halo behind mascot */}
        <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md animate-ping opacity-60" />
        
        <div className="relative w-full h-full bg-slate-900 border-2 border-cyan-400 rounded-2xl p-1 shadow-2xl flex items-center justify-center bg-gradient-to-b from-indigo-900/90 to-slate-950">
          <div className="relative flex flex-col items-center">
            {/* Mascot Head / Visor */}
            <div className="w-10 h-7 bg-slate-950 rounded-xl border border-cyan-400/80 flex items-center justify-center relative overflow-hidden">
              <div className="w-7 h-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-sm" />
              {/* Cute glowing eyes */}
              <div className="absolute inset-0 flex items-center justify-around px-2">
                <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#22d3ee]" />
                <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#22d3ee]" />
              </div>
            </div>
            {/* Headphones */}
            <div className="absolute -top-1 w-11 h-4 border-t-2 border-indigo-400 rounded-t-full pointer-events-none" />
            <span className="text-[8px] font-bold text-cyan-300 tracking-tighter mt-0.5">AI NAVI</span>
          </div>
        </div>
      </div>

      {/* Down Triangle Arrow */}
      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-indigo-600 -mt-0.5" />
    </motion.div>
  );
};

export const LearningPathRoadmap: React.FC<LearningPathRoadmapProps> = ({
  modules,
  progress,
  onSelectModule,
  searchQuery,
  onSearchChange,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [selectedNodeModule, setSelectedNodeModule] = useState<CourseModule | null>(null);
  const [unboxedChest, setUnboxedChest] = useState<number | null>(null);

  const completedCount = progress.completedModules.length;
  const totalModules = modules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const remainingModules = totalModules - completedCount;
  const estimatedMinutes = remainingModules === 0 ? 0 : Math.ceil(remainingModules * 3.75);

  // Highest unlocked or currently active module
  const currentActiveModuleId = progress.currentModuleId || (
    modules.find(m => !progress.completedModules.includes(m.id))?.id || 1
  );

  const handleChestClick = (chestId: number, title: string) => {
    setUnboxedChest(chestId);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Node position arrangement on the map path (X offset percentages: 20%, 50%, 80%, etc)
  const getNodePositionX = (index: number) => {
    const pattern = [50, 28, 50, 72, 50, 28, 50, 72, 50];
    return pattern[index % pattern.length];
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Peta Belajar Digital Interaktif</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Peta Jalan Pembelajaran <span className="bg-gradient-to-r from-amber-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">AI Navigator</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Jelajahi petualangan menguasai LLM modern step-by-step! Selesaikan setiap level node untuk mengumpulkan XP, Bintang Kuis, serta membuka Peti Karun Spesifik LLM.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-300">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Progres: <strong>{completedCount}/{totalModules} Modul</strong> ({progressPercent}%)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-300">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Estimasi: <strong>~{estimatedMinutes} Menit</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-300">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Total XP: <strong>{progress.xp} XP</strong></span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-950/80 rounded-2xl p-5 border border-slate-800 text-center space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Status Petualangan</span>
              <span className="font-bold text-amber-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {completedCount === totalModules
                ? '🎉 Selamat! Semua level telah Anda kuasai!'
                : `Masih ada ${totalModules - completedCount} level lagi untuk klaim Sertifikat.`}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Mode Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Peta Journey (Interactive Map)</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tampilan Kartu</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari modul atau topik LLM..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE DIGITAL MAP JOURNEY VIEW (DUOLINGO-STYLE S-CURVE TRAIL)      */}
      {/* ========================================================================= */}
      {viewMode === 'map' && (
        <div className="relative max-w-xl mx-auto py-12 px-4 sm:px-8 bg-slate-950/60 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
          {/* Cyber Grid Pattern Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
              backgroundSize: `24px 24px`
            }}
          />

          {/* S-Curve Path Winding Nodes Container */}
          <div className="relative flex flex-col items-center space-y-16 z-10">
            {modules.map((module, index) => {
              const isCompleted = progress.completedModules.includes(module.id);
              const isCurrent = module.id === currentActiveModuleId;
              const posX = getNodePositionX(index);
              const score = progress.moduleScores[module.id];

              // Insert Milestone Chest after module 4
              const showMidChest = module.id === 4;

              return (
                <React.Fragment key={module.id}>
                  {/* MODULE NODE ITEM */}
                  <div 
                    className="relative flex flex-col items-center group w-full"
                    style={{
                      alignItems: posX === 50 ? 'center' : posX < 50 ? 'flex-start' : 'flex-end',
                      paddingLeft: posX < 50 ? '12%' : '0',
                      paddingRight: posX > 50 ? '12%' : '0',
                    }}
                  >
                    {/* NAVIGATOR MASCOT sitting on current node */}
                    {isCurrent && (
                      <NavigatorMascot moduleTitle={module.title} />
                    )}

                    {/* CIRCULAR 3D DIGITAL BUTTON NODE */}
                    <button
                      onClick={() => setSelectedNodeModule(module)}
                      className={`relative group flex flex-col items-center focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-95 ${
                        isCurrent ? 'z-20' : 'z-10'
                      }`}
                    >
                      {/* Glow Ring Behind Current Node */}
                      {isCurrent && (
                        <div className="absolute inset-0 -m-3 rounded-full bg-cyan-400/30 blur-md animate-pulse" />
                      )}

                      {/* Main Node Circle */}
                      <div
                        className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center relative shadow-2xl transition-all border-4 ${
                          isCompleted
                            ? 'bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-800 border-emerald-300 text-white shadow-emerald-500/30'
                            : isCurrent
                            ? 'bg-gradient-to-b from-cyan-400 via-indigo-600 to-purple-700 border-cyan-200 text-white shadow-cyan-400/50 ring-4 ring-indigo-500/40'
                            : 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-slate-700 text-slate-400 shadow-black/60'
                        }`}
                      >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-x-2 top-1 h-3 bg-white/20 rounded-t-xl pointer-events-none" />

                        {/* Node Icon */}
                        <div className="relative z-10">
                          {isCompleted ? (
                            <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
                          ) : (
                            getModuleIcon(module.icon)
                          )}
                        </div>

                        {/* Small Module Number Tag */}
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-0.5 z-10 ${
                          isCompleted
                            ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-400/40'
                            : isCurrent
                            ? 'bg-slate-950/80 text-cyan-300 border border-cyan-400/40'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          Modul {module.id}
                        </span>
                      </div>

                      {/* Stars Below Node (Duolingo style) */}
                      <div className="flex items-center gap-1 mt-2 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800/80 shadow-md">
                        {[1, 2, 3].map((starNum) => {
                          const hasStar = isCompleted && (
                            score !== undefined 
                              ? (score >= starNum * (module.content.quiz.length / 3))
                              : true
                          );
                          return (
                            <Star
                              key={starNum}
                              className={`w-3.5 h-3.5 ${
                                hasStar
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_#f59e0b]'
                                  : 'text-slate-700'
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Label under node */}
                      <span className="text-xs font-bold text-slate-200 mt-1 max-w-[130px] text-center line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {module.title}
                      </span>
                    </button>
                  </div>

                  {/* MID-WAY MILESTONE CHEST (After Module 4) */}
                  {showMidChest && (
                    <div className="relative flex flex-col items-center my-4 z-10">
                      <button
                        onClick={() => handleChestClick(1, "Peti Karun AI Explorer")}
                        className="group flex flex-col items-center hover:scale-110 active:scale-95 transition-all"
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-400 via-orange-500 to-amber-700 border-2 border-amber-200 shadow-xl shadow-amber-500/20 flex items-center justify-center relative ${
                          unboxedChest === 1 ? 'ring-4 ring-amber-400 animate-bounce' : ''
                        }`}>
                          <Gift className="w-8 h-8 text-slate-950 fill-amber-200" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border border-white text-[9px] font-bold text-white flex items-center justify-center">
                            !
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-300 mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Peti Mid-Journey (+200 XP)
                        </span>
                      </button>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* END OF JOURNEY CHEST / CROWN NODE */}
            <div className="relative flex flex-col items-center pt-6 z-10">
              <button
                onClick={() => handleChestClick(2, "Mahkota Kelulusan AI Master")}
                className="group flex flex-col items-center hover:scale-110 transition-all"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-600 border-4 border-amber-200 shadow-2xl shadow-amber-500/40 flex items-center justify-center relative">
                  <Crown className="w-10 h-10 text-slate-950 fill-amber-200 animate-pulse" />
                </div>
                <span className="text-xs font-extrabold text-amber-400 mt-2 flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Puncak Kelulusan AI Master
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GRID CARD VIEW (ALTERNATIVE ACCESSIBLE TILE VIEW)                        */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {modules.map((module) => {
            const isCompleted = progress.completedModules.includes(module.id);
            const isCurrent = module.id === currentActiveModuleId;
            const score = progress.moduleScores[module.id];

            return (
              <div
                key={module.id}
                onClick={() => onSelectModule(module.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                  isCurrent
                    ? 'bg-slate-900 border-indigo-500/80 shadow-xl shadow-indigo-500/10'
                    : isCompleted
                    ? 'bg-slate-900/80 border-emerald-500/40'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getModuleIcon(module.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Modul {module.id}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{module.title}</h3>
                    </div>
                  </div>

                  <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
                    <span>Mulai</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {module.subtitle} — {module.content.overview.tagline}
                </p>

                {isCompleted && score !== undefined && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Selesai
                    </span>
                    <span className="text-amber-400 font-bold">Skor: {score}/{module.content.quiz.length}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* NODE CLICK PREVIEW MODAL                                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedNodeModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedNodeModule(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-lg">
                  {getModuleIcon(selectedNodeModule.icon)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Level Modul {selectedNodeModule.id}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedNodeModule.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedNodeModule.title}</h3>
                  <p className="text-xs text-slate-400">{selectedNodeModule.subtitle}</p>
                </div>
              </div>

              {/* Module Description */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Fokus Pembelajaran:
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedNodeModule.content.overview.tagline}
                </p>
                <div className="flex items-center gap-4 text-slate-400 pt-2 border-t border-slate-900 text-[11px]">
                  <span>⏱ Estimasi: {selectedNodeModule.estimatedMinutes} Menit</span>
                  <span>❓ Kuis: {selectedNodeModule.content.quiz.length} Soal</span>
                  <span>✨ Hadiah: +100 XP</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const id = selectedNodeModule.id;
                    setSelectedNodeModule(null);
                    onSelectModule(id);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
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
      {/* CHEST UNBOXING MODAL                                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {unboxedChest !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-sm bg-slate-900 border border-amber-500/50 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/50">
                <Gift className="w-10 h-10 text-slate-950 fill-amber-200 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-amber-400">Selamat! Peti Karun Terbuka!</h3>
                <p className="text-xs text-slate-300">
                  {unboxedChest === 1
                    ? 'Anda berhasil meraih Milestone Mid-Journey! Bonus +200 XP ditambahkan.'
                    : 'Puncak AI Master! Anda berhak mengklaim Sertifikat Kelulusan Resmi!'}
                </p>
              </div>

              <button
                onClick={() => setUnboxedChest(null)}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                Klaim Hadiah & Lanjutkan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
