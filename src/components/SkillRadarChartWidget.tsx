import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { Target, Award, ChevronRight } from 'lucide-react';
import { CourseModule, UserProgress } from '../types';

interface SkillRadarChartWidgetProps {
  modules: CourseModule[];
  progress: UserProgress;
  onSelectModule?: (moduleId: number) => void;
  className?: string;
}

export interface DomainSkill {
  key: string;
  domain: string;
  shortDomain: string;
  score: number; // 0 to 100
  moduleIds: number[];
  levelLabel: string;
  recommendationModuleId: number;
}

const DOMAIN_DEFINITIONS = [
  {
    key: 'prompting',
    domain: 'Prompt Engineering',
    shortDomain: 'Prompting',
    moduleIds: [1, 10, 11, 21],
  },
  {
    key: 'llm_theory',
    domain: 'Teori & Arsitektur LLM',
    shortDomain: 'Arsitektur LLM',
    moduleIds: [2, 3, 4, 7],
  },
  {
    key: 'rag_knowledge',
    domain: 'RAG & Pengetahuan',
    shortDomain: 'RAG & Data',
    moduleIds: [5, 8, 22],
  },
  {
    key: 'multimodal',
    domain: 'Generasi Multimodal',
    shortDomain: 'Multimodal',
    moduleIds: [12, 13, 14, 15, 16],
  },
  {
    key: 'tools_workflow',
    domain: 'Tools & Produktivitas',
    shortDomain: 'Tools AI',
    moduleIds: [6, 9, 17, 18, 19, 20, 23],
  },
];

export const SkillRadarChartWidget: React.FC<SkillRadarChartWidgetProps> = React.memo(({
  modules,
  progress,
  onSelectModule,
  className = '',
}) => {
  const [selectedDomainKey, setSelectedDomainKey] = useState<string | null>(null);

  // Compute skill levels dynamically from user progress (memoized)
  const domainSkills: DomainSkill[] = useMemo(() => {
    return DOMAIN_DEFINITIONS.map((def) => {
      const domainModules = modules.filter((m) => def.moduleIds.includes(m.id));
      const totalDomainModules = domainModules.length || 1;

      let completedCount = 0;
      let totalScoreSum = 0;

      domainModules.forEach((m) => {
        const isCompleted = progress.completedModules.includes(m.id);
        if (isCompleted) {
          completedCount++;
          const quizScore = progress.moduleScores[m.id];
          const maxQuestions = m.content.quiz.length || 1;
          if (quizScore !== undefined) {
            totalScoreSum += (quizScore / maxQuestions) * 100;
          } else {
            totalScoreSum += 80;
          }
        }
      });

      const completionRate = completedCount / totalDomainModules;
      const avgScore = completedCount > 0 ? totalScoreSum / completedCount : 0;
      let computedScore = Math.round(completionRate * 60 + (avgScore / 100) * 40);

      if (computedScore === 0 && progress.xp > 0) {
        computedScore = 20; // Beginner baseline
      }

      let levelLabel = 'Pemula';
      if (computedScore >= 80) levelLabel = 'Ahli (Expert)';
      else if (computedScore >= 50) levelLabel = 'Menengah (Intermediate)';
      else if (computedScore >= 20) levelLabel = 'Dasar (Basic)';

      const uncompletedModule = domainModules.find((m) => !progress.completedModules.includes(m.id));
      const recommendationModuleId = uncompletedModule ? uncompletedModule.id : domainModules[0]?.id || 1;

      return {
        key: def.key,
        domain: def.domain,
        shortDomain: def.shortDomain,
        score: Math.min(computedScore, 100),
        moduleIds: def.moduleIds,
        levelLabel,
        recommendationModuleId,
      };
    });
  }, [modules, progress.completedModules, progress.moduleScores, progress.xp]);

  const chartData = useMemo(() => domainSkills.map((ds) => ({
    subject: ds.shortDomain,
    score: ds.score,
    fullDomain: ds.domain,
    levelLabel: ds.levelLabel,
  })), [domainSkills]);

  const activeDomain = domainSkills.find((d) => d.key === selectedDomainKey) || domainSkills[0];
  const activeRecModule = modules.find((m) => m.id === activeDomain.recommendationModuleId);

  return (
    <div className={`bg-white border-slate-200 text-slate-900 dark:bg-[#0d1322] dark:border-slate-800 dark:text-white border rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden space-y-4 ${className}`}>
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight break-words">Radar Kompetensi AI</h3>
              <span className="text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                Pemetaan Skill
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
              Evaluasi tingkat keahlian dalam 5 bidang utama LLM
            </p>
          </div>
        </div>
      </div>

      {/* Radar Chart Container */}
      <div className="h-60 w-full relative pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#cbd5e1" fontSize={11} tick={{ fill: '#cbd5e1', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
            <Radar name="Penguasaan Skill" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-extrabold text-slate-900 dark:text-white">{data.fullDomain}</p>
                      <p className="text-indigo-300 font-bold">Skor: {data.score}/100 ({data.levelLabel})</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Domain Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
        {domainSkills.map((ds) => {
          const isSelected = (selectedDomainKey === ds.key) || (!selectedDomainKey && ds.key === domainSkills[0].key);
          return (
            <button
              key={ds.key}
              onClick={() => setSelectedDomainKey(ds.key)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              <span className="text-[10px] font-bold block truncate">{ds.shortDomain}</span>
              <span className="text-xs font-black block">{ds.score}%</span>
            </button>
          );
        })}
      </div>

      {/* Active Domain Detail & Recommendation Box */}
      <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <span className="font-extrabold text-slate-900 dark:text-white">{activeDomain.domain}</span>
          <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded-md">
            Status: {activeDomain.levelLabel} ({activeDomain.score}/100)
          </span>
        </div>

        {activeRecModule && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800 gap-2 flex-wrap">
            <div className="text-xs text-slate-600 dark:text-slate-300 min-w-0">
              <span className="text-slate-500 dark:text-slate-400">Rekomendasi Modul: </span>
              <strong className="text-slate-900 dark:text-white">{activeRecModule.title}</strong>
            </div>

            {onSelectModule && (
              <button
                onClick={() => onSelectModule(activeRecModule.id)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white flex items-center gap-1 transition-all cursor-pointer shrink-0"
              >
                <span>Buka Modul</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
