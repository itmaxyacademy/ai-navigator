import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CourseModule, UserProgress } from '../types';
import { 
  Flame, Sparkles, AlertTriangle, CheckCircle2, RefreshCw, 
  Target, BarChart3, HelpCircle, ArrowRight, Zap, BookOpen, Layers
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
  struggleIndex: number; // 0 - 100 formula: (100 - score) * (1 + revisits * 0.25)
  category: string;
  quizTotalQuestions: number;
}

export const KnowledgeHeatmap: React.FC<KnowledgeHeatmapProps> = ({
  modules,
  progress,
  onSelectModule,
  onIncrementRevisit,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [activeFilter, setActiveFilter] = useState<HeatmapFilter>('all');
  const [hoveredModule, setHoveredModule] = useState<HeatmapNode | null>(null);
  const [selectedHeatmapNode, setSelectedHeatmapNode] = useState<HeatmapNode | null>(null);

  // Process data for each module
  const heatmapData: HeatmapNode[] = modules.map((m) => {
    const isCompleted = progress.completedModules.includes(m.id);
    const quizCount = m.content.quiz?.length || 5;
    const rawScore = progress.moduleScores[m.id];
    
    // Score percentage: if unattempted but completed, default 80%; if uncompleted 0% or fallback score
    let score = 0;
    if (rawScore !== undefined) {
      score = Math.round((rawScore / quizCount) * 100);
    } else if (isCompleted) {
      score = 80; // default for legacy completed without score
    }

    // Revisits: from progress.moduleRevisits or simulated base from completion/current status
    const explicitRevisits = progress.moduleRevisits?.[m.id];
    let revisits = 0;
    if (explicitRevisits !== undefined) {
      revisits = explicitRevisits;
    } else {
      // Generate realistic baseline if not explicitly set yet
      if (isCompleted) {
        revisits = (m.id % 3) + 1; // 1 to 3 revisits
      } else if (m.id === progress.currentModuleId) {
        revisits = 2;
      } else {
        revisits = 0;
      }
    }

    // Struggle Index: Higher if low score and high revisits (needs focus!)
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

  // Draw Heatmap with D3.js
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 700;
    // Calculate grid dimensions
    const cols = containerWidth > 640 ? 4 : 2;
    const itemWidth = Math.floor((containerWidth - (cols - 1) * 16 - 32) / cols);
    const itemHeight = 110;
    const rows = Math.ceil(filteredData.length / cols);
    const svgHeight = Math.max(180, rows * (itemHeight + 16) + 32);

    svg
      .attr('width', containerWidth)
      .attr('height', svgHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${svgHeight}`);

    const g = svg
      .append('g')
      .attr('transform', 'translate(16, 16)');

    // D3 Color Scale for Scores: Red (0%) -> Amber (60%) -> Emerald (100%)
    const scoreColorScale = d3.scaleLinear<string>()
      .domain([0, 50, 75, 100])
      .range(['#ef4444', '#f59e0b', '#3b82f6', '#10b981']);

    // D3 Color Scale for Uncompleted / Not Started
    const uncompletedColor = '#1e293b';

    // Tooltip selection
    const tooltip = d3.select(tooltipRef.current);

    // Draw Heatmap Cells
    const cells = g
      .selectAll('.heatmap-cell')
      .data(filteredData)
      .enter()
      .append('g')
      .attr('class', 'heatmap-cell')
      .attr('transform', (d, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return `translate(${col * (itemWidth + 16)}, ${row * (itemHeight + 16)})`;
      })
      .style('cursor', 'pointer');

    // Background Card Rect
    cells
      .append('rect')
      .attr('width', itemWidth)
      .attr('height', itemHeight)
      .attr('rx', 16)
      .attr('ry', 16)
      .attr('fill', (d) => {
        if (!d.isCompleted && d.score === 0) return uncompletedColor;
        // Interpolate base fill color with dark opacity for rich dark UI
        return d3.color(scoreColorScale(d.score))?.copy({ opacity: 0.18 }).toString() || '#1e1b4b';
      })
      .attr('stroke', (d) => {
        if (d.struggleIndex > 50) return '#f43f5e'; // Rose border for high struggle
        if (d.revisits >= 3) return '#f59e0b'; // Amber border for high revisit
        if (d.isCompleted) return scoreColorScale(d.score);
        return '#334155';
      })
      .attr('stroke-width', (d) => (d.struggleIndex > 50 || d.revisits >= 3 ? 2.5 : 1.5))
      .attr('filter', 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.3))');

    // Top Accent Score Bar (D3 progress indicator inside cell)
    cells
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', (d) => Math.max(12, Math.round((itemWidth * d.score) / 100)))
      .attr('height', 4)
      .attr('rx', 2)
      .attr('fill', (d) => (d.isCompleted ? scoreColorScale(d.score) : '#475569'));

    // Module ID Badge Circle
    const badgeG = cells
      .append('g')
      .attr('transform', 'translate(14, 20)');

    badgeG
      .append('circle')
      .attr('r', 12)
      .attr('fill', (d) => (d.isCompleted ? scoreColorScale(d.score) : '#334155'));

    badgeG
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text((d) => `#${d.id}`);

    // Module Title
    cells
      .append('text')
      .attr('x', 34)
      .attr('y', 23)
      .attr('fill', '#f8fafc')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d) => (d.title.length > 20 ? d.title.substring(0, 18) + '...' : d.title));

    // Module Category / Subtitle
    cells
      .append('text')
      .attr('x', 14)
      .attr('y', 44)
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .text((d) => d.badge || 'Modul AI');

    // Score Tag (Percentage)
    cells
      .append('text')
      .attr('x', 14)
      .attr('y', 68)
      .attr('fill', (d) => (d.isCompleted ? scoreColorScale(d.score) : '#64748b'))
      .attr('font-size', '13px')
      .attr('font-weight', '800')
      .text((d) => (d.isCompleted ? `Skor: ${d.score}%` : 'Belum Selesai'));

    // Revisit / Practice Count Chip
    const revisitG = cells
      .append('g')
      .attr('transform', `translate(${itemWidth - 68}, 54)`);

    revisitG
      .append('rect')
      .attr('width', 54)
      .attr('height', 20)
      .attr('rx', 10)
      .attr('fill', (d) => (d.revisits >= 2 ? '#451a03' : '#1e293b'))
      .attr('stroke', (d) => (d.revisits >= 2 ? '#f59e0b' : '#334155'))
      .attr('stroke-width', 1);

    revisitG
      .append('text')
      .attr('x', 27)
      .attr('y', 13)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.revisits >= 2 ? '#fbbf24' : '#94a3b8'))
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text((d) => `🔄 ${d.revisits}x`);

    // Struggle Warning Badge if struggle index > 45
    cells.each(function (d) {
      if (d.struggleIndex > 45) {
        const warningG = d3.select(this)
          .append('g')
          .attr('transform', `translate(${itemWidth - 30}, 14)`);

        warningG
          .append('circle')
          .attr('r', 9)
          .attr('fill', '#881337')
          .attr('stroke', '#f43f5e')
          .attr('stroke-width', 1.5);

        warningG
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('fill', '#fecdd3')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text('!');
      }
    });

    // Hover & Click Interactions
    cells
      .on('mouseenter', function (event, d) {
        setHoveredModule(d);
        d3.select(this)
          .transition()
          .duration(150)
          .attr('transform', function () {
            const currentTransform = d3.select(this).attr('transform');
            const match = /translate\(([^,]+),\s*([^)]+)\)/.exec(currentTransform);
            if (match) {
              const x = parseFloat(match[1]);
              const y = parseFloat(match[2]);
              return `translate(${x}, ${y - 4})`;
            }
            return currentTransform;
          });

        d3.select(this).select('rect').attr('stroke-width', 3);

        // Show Tooltip
        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        tooltip
          .style('opacity', '1')
          .style('left', `${Math.min(mouseX + 20, containerWidth - 220)}px`)
          .style('top', `${mouseY + 10}px`);
      })
      .on('mousemove', function (event) {
        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        tooltip
          .style('left', `${Math.min(mouseX + 20, containerWidth - 220)}px`)
          .style('top', `${mouseY + 10}px`);
      })
      .on('mouseleave', function (event, d) {
        setHoveredModule(null);
        d3.select(this)
          .transition()
          .duration(150)
          .attr('transform', function () {
            const currentTransform = d3.select(this).attr('transform');
            const match = /translate\(([^,]+),\s*([^)]+)\)/.exec(currentTransform);
            if (match) {
              const x = parseFloat(match[1]);
              const y = parseFloat(match[2]);
              return `translate(${x}, ${y + 4})`;
            }
            return currentTransform;
          });

        d3.select(this)
          .select('rect')
          .attr('stroke-width', () => (d.struggleIndex > 50 || d.revisits >= 3 ? 2.5 : 1.5));

        tooltip.style('opacity', '0');
      })
      .on('click', (event, d) => {
        setSelectedHeatmapNode(d);
      });

  }, [filteredData, activeFilter]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Title Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
            <span>Visualisasi D3.js Knowledge Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Peta Kalor Penguasaan Materi</span>
            <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 px-2.5 py-0.5 rounded-full">
              D3 Heatmap
            </span>
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
            Peta kalor interaktif memetakan modul yang sering dipelajari ulang atau yang memerlukan latihan ekstra berdasarkan perolehan skor kuis.
          </p>
        </div>

        {/* Legend Indicator */}
        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-2 shrink-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skala Warna Penguasaan</div>
          <div className="flex items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
              <span className="text-rose-300 font-bold">&lt;60%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
              <span className="text-amber-300 font-bold">60-75%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
              <span className="text-blue-300 font-bold">75-85%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span className="text-emerald-300 font-bold">85-100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Perlu Fokus Latihan</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">{strugglingNodes.length} Modul</div>
          <p className="text-[10px] text-slate-500">Skor &lt;75% atau index kesulitan tinggi</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Revisit & Latihan</span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{totalRevisitsCount} Sesi</div>
          <p className="text-[10px] text-slate-500">Frekuensi pengulangan materi</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rata-Rata Skor</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-blue-400">{avgScore}%</div>
          <p className="text-[10px] text-slate-500">Dari {completedNodes.length} modul selesai</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sudah Dikuasai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{masteredNodes.length} Modul</div>
          <p className="text-[10px] text-slate-500">Pencapaian skor &ge;80%</p>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 relative z-10">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua Modul ({heatmapData.length})
          </button>
          <button
            onClick={() => setActiveFilter('struggling')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'struggling'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
            <span>Perlu Latihan ({strugglingNodes.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('revisited')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'revisited'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
            <span>Sering Dilihat ({highlyRevisitedNodes.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('mastered')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'mastered'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Dikuasai ({masteredNodes.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Klik sel modul untuk membuka &amp; latihan ulang</span>
        </div>
      </div>

      {/* D3 SVG Container */}
      <div ref={containerRef} className="relative w-full min-h-[220px] rounded-2xl bg-slate-950/80 border border-slate-800 p-2 overflow-x-auto">
        <svg ref={svgRef} className="w-full h-auto block" />

        {/* Floating D3 Tooltip Element */}
        <div
          ref={tooltipRef}
          className="absolute opacity-0 pointer-events-none transition-opacity duration-150 z-30 bg-slate-900 border border-indigo-500/60 p-3 rounded-2xl shadow-2xl text-xs space-y-1.5 max-w-xs backdrop-blur-md"
        >
          {hoveredModule && (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white">Modul #{hoveredModule.id}: {hoveredModule.title}</span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700 px-1.5 py-0.5 rounded font-mono">
                  {hoveredModule.badge}
                </span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span>Skor Kuis:</span>
                  <strong className={hoveredModule.score >= 80 ? 'text-emerald-400' : hoveredModule.score < 60 ? 'text-rose-400' : 'text-amber-400'}>
                    {hoveredModule.isCompleted ? `${hoveredModule.score}%` : 'Belum Selesai'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Sesi Latihan / Revisit:</span>
                  <strong className="text-amber-400">{hoveredModule.revisits}x</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tingkat Kesulitan Latihan:</span>
                  <strong className={hoveredModule.struggleIndex > 50 ? 'text-rose-400' : 'text-slate-300'}>
                    {hoveredModule.struggleIndex}%
                  </strong>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-800/80 text-[10px] text-indigo-300 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Klik sel untuk mulai fokus latihan modul ini!</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal / Quick Action Popup when cell clicked */}
      <AnimatePresence>
        {selectedHeatmapNode && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 px-2.5 py-0.5 rounded-full">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Modul #{selectedHeatmapNode.id} • {selectedHeatmapNode.badge}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{selectedHeatmapNode.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedHeatmapNode(null)}
                  className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Status Breakdown */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Skor Kuis Saat Ini:</span>
                  <span className={`font-extrabold ${selectedHeatmapNode.score >= 80 ? 'text-emerald-400' : selectedHeatmapNode.score < 60 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {selectedHeatmapNode.isCompleted ? `${selectedHeatmapNode.score}%` : 'Belum Pernah Diuji'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Frekuensi Dilihat Ulang:</span>
                  <span className="font-extrabold text-amber-400">{selectedHeatmapNode.revisits}x Sesi Latihan</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Rekomendasi Tindakan:</span>
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
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-3 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs transition-transform hover:scale-[1.02]"
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
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-1.5 shrink-0"
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
