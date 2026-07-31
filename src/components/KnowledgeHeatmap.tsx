import React, { useState } from 'react';
import { CourseModule, UserProgress } from '../types';
import { 
  Flame, Sparkles, AlertTriangle, CheckCircle2, RefreshCw, 
  Target, BarChart3, HelpCircle, ArrowRight, Zap, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KnowledgeHeatmapProps {
  modules: CourseModule[];
  progress: UserProgress;
  onSelectModule: (moduleId: number) => void;
  onIncrementRevisit?: (moduleId: number) => void;
}

export type HeatmapFilter = 'all' | 'struggling' | 'revisited' | 'mastered';

interface HeatmapNode {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  score: number; // 0 - 100
  isCompleted: boolean;
  revisits: number;
  struggleIndex: number; // 0 - 100
  category: string;
  quizTotalQuestions: number;
}

export const KnowledgeHeatmap: React.FC<KnowledgeHeatmapProps> = ({
  modules,
  progress,
  onSelectModule,
  onIncrementRevisit,
}) => {
  const [activeFilter, setActiveFilter] = useState<HeatmapFilter>('all');
  const [selectedHeatmapNode, setSelectedHeatmapNode] = useState<HeatmapNode | null>(null);

  // Process data for each module
  const heatmapData: HeatmapNode[] = modules.map((m) => {
    const isCompleted = progress.completedModules.includes(m.id);
    const quizCount = m.content.quiz?.length || 5;
    const rawScore = progress.moduleScores[m.id];
    
    let score = 0;
    if (rawScore !== undefined) {
      score = Math.round((rawScore / quizCount) * 100);
    } else if (isCompleted) {
      score = 80;
    }

    const explicitRevisits = progress.moduleRevisits?.[m.id];
    let revisits = 0;
    if (explicitRevisits !== undefined) {
      revisits = explicitRevisits;
    } else {
      if (isCompleted) {
        revisits = (m.id % 3) + 1;
      } else if (m.id === progress.currentModuleId) {
        revisits = 2;
      } else {
        revisits = 0;
      }
    }

    const unmasteredGap = Math.max(0, 100 - score);
    const struggleIndex = Math.min(
      100,
      Math.round(unmasteredGap * (1 + (revisits > 0 ? Math.min(revisits, 5) * 0.2 : 0)))
    );

    return {
      id: m.id,
      title: m.title,
      subtitle: m.subtitle,
      badge: m.badge,
      score,
      isCompleted,
      revisits,
      struggleIndex,
      category: m.badge || 'AI Topic',
      quizTotalQuestions: quizCount,
    };
  });

  // Derived Summary Metrics
  const completedNodes = heatmapData.filter((d) => d.isCompleted);
  const strugglingNodes = heatmapData.filter(
    (d) => (d.isCompleted && d.score < 75) || d.struggleIndex > 45
  );
  const highlyRevisitedNodes = heatmapData.filter((d) => d.revisits >= 2);
  const masteredNodes = heatmapData.filter((d) => d.score >= 80 && d.isCompleted);

  const totalRevisitsCount = heatmapData.reduce((acc, curr) => acc + curr.revisits, 0);
  const avgScore = completedNodes.length > 0
    ? Math.round(completedNodes.reduce((acc, curr) => acc + curr.score, 0) / completedNodes.length)
    : 0;

  // Filtered data based on selected activeFilter
  const filteredData = heatmapData.filter((node) => {
    if (activeFilter === 'struggling') {
      return (node.isCompleted && node.score < 75) || node.struggleIndex > 40;
    }
    if (activeFilter === 'revisited') {
      return node.revisits >= 2;
    }
    if (activeFilter === 'mastered') {
      return node.score >= 80 && node.isCompleted;
    }
    return true;
  });

  return (
    <div className="bg-white border-slate-200 text-slate-900 dark:bg-[#0d1322] dark:border-slate-800 dark:text-white border rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Title Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span>Peta Analisis Matrik Penguasaan Materi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Peta Kalor Penguasaan Materi</span>
            <span className="text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-2.5 py-0.5 rounded-full">
              {filteredData.length} Modul
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-xl">
            Memetakan modul yang sering dipelajari ulang atau yang memerlukan latihan ekstra berdasarkan perolehan skor kuis.
          </p>
        </div>

        {/* Legend Indicator */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-xs space-y-2 shrink-0">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skala Warna Penguasaan</div>
          <div className="flex items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
              <span className="text-rose-400 font-bold">&lt;60%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
              <span className="text-amber-400 font-bold">60-75%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
              <span className="text-blue-400 font-bold">75-85%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span className="text-emerald-400 font-bold">85-100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Perlu Fokus Latihan</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-500">{strugglingNodes.length} Modul</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500">Skor &lt;75% / butuh latihan</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Revisit &amp; Latihan</span>
            <RefreshCw className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-500">{totalRevisitsCount} Sesi</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500">Frekuensi pengulangan materi</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Rata-Rata Skor</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-blue-500">{avgScore}%</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500">Dari {completedNodes.length} modul selesai</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Sudah Dikuasai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-500">{masteredNodes.length} Modul</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500">Pencapaian skor &ge;80%</p>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 relative z-10">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            Semua Modul ({heatmapData.length})
          </button>
          <button
            onClick={() => setActiveFilter('struggling')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'struggling'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Perlu Latihan ({strugglingNodes.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('revisited')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'revisited'
                ? 'bg-amber-600 text-slate-900 dark:text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sering Dilihat ({highlyRevisitedNodes.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('mastered')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'mastered'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Dikuasai ({masteredNodes.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          <span>Klik kartu modul untuk membuka &amp; latihan ulang</span>
        </div>
      </div>

      {/* Responsive Clean HTML/CSS Grid of Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 relative z-10">
        {filteredData.map((node) => {
          const isStruggling = node.struggleIndex > 45;

          // Border color based on score/status
          let borderColor = 'border-slate-200 dark:border-slate-800';
          if (isStruggling) {
            borderColor = 'border-rose-500/40 dark:border-rose-500/40';
          } else if (node.isCompleted && node.score >= 80) {
            borderColor = 'border-emerald-500/40 dark:border-emerald-500/40';
          } else if (node.isCompleted) {
            borderColor = 'border-blue-500/40 dark:border-blue-500/40';
          }

          return (
            <div
              key={node.id}
              onClick={() => setSelectedHeatmapNode(node)}
              className={`bg-slate-50 dark:bg-slate-950/80 border ${borderColor} rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden`}
            >
              {/* Progress bar accent line at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    node.isCompleted
                      ? node.score >= 80
                        ? 'bg-emerald-500'
                        : node.score >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${node.isCompleted ? node.score : 10}%` }}
                />
              </div>

              {/* Card Header Row */}
              <div className="flex items-start justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-950 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[11px] shrink-0">
                    #{node.id}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors truncate">
                    {node.title}
                  </h3>
                </div>

                {isStruggling && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-[10px] font-extrabold shrink-0 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Subtitle / Badge */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {node.badge || node.subtitle || 'Modul AI'}
              </p>

              {/* Footer Row (Score + Revisit chip) */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <div>
                  {node.isCompleted ? (
                    <span
                      className={`text-xs font-extrabold ${
                        node.score >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : node.score >= 60
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      Skor: {node.score}%
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">
                      Belum Selesai
                    </span>
                  )}
                </div>

                <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-[#0d1322] border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-amber-500" />
                  <span>{node.revisits}x</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal / Quick Action Popup when cell clicked */}
      <AnimatePresence>
        {selectedHeatmapNode && (
          <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 px-2.5 py-0.5 rounded-full">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Modul #{selectedHeatmapNode.id} • {selectedHeatmapNode.badge}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedHeatmapNode.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedHeatmapNode(null)}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white font-bold p-1 rounded-lg hover:bg-slate-100 dark:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Status Breakdown */}
              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Skor Kuis Saat Ini:</span>
                  <span className={`font-extrabold ${selectedHeatmapNode.score >= 80 ? 'text-emerald-400' : selectedHeatmapNode.score < 60 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {selectedHeatmapNode.isCompleted ? `${selectedHeatmapNode.score}%` : 'Belum Pernah Diuji'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Frekuensi Dilihat Ulang:</span>
                  <span className="font-extrabold text-amber-400">{selectedHeatmapNode.revisits}x Sesi Latihan</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Rekomendasi Tindakan:</span>
                  <span className="font-bold text-indigo-300">
                    {selectedHeatmapNode.score < 70 ? '⚠️ Ulangi Kuis Modul Ini' : '⭐ Pertahankan Mastery'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    if (onIncrementRevisit) {
                      onIncrementRevisit(selectedHeatmapNode.id);
                    }
                    onSelectModule(selectedHeatmapNode.id);
                    setSelectedHeatmapNode(null);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs transition-transform hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Mulai Latihan Ulang Modul Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onIncrementRevisit && (
                  <button
                    onClick={() => {
                      onIncrementRevisit(selectedHeatmapNode.id);
                    }}
                    className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Catat Revisit (+1)</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
