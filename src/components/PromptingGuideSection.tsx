import React, { useState } from 'react';
import { CourseModule } from '../types';
import { MiniQuizCheckpoint } from './MiniQuizCheckpoint';
import { getSectionCheckpointQuestion } from '../lib/miniQuizData';
import { 
  Sparkles, Copy, Check, Lightbulb, Zap, HelpCircle, 
  ArrowRight, Compass, ShieldAlert, CheckCircle2, MessageSquare, Terminal
} from 'lucide-react';

interface PromptingGuideSectionProps {
  module: CourseModule;
  onAdvanceToQuiz: () => void;
  completedCheckpoints?: string[];
  onCompleteCheckpoint?: (checkpointId: string, xpBonus: number) => void;
}

export const PromptingGuideSection: React.FC<PromptingGuideSectionProps> = ({
  module,
  onAdvanceToQuiz,
  completedCheckpoints,
  onCompleteCheckpoint,
}) => {
  const guide = module.content.promptingGuide;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const promptingQuestion = getSectionCheckpointQuestion(module, 'prompting');

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!guide) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-3xl border border-slate-800">
        Panduan cara prompting untuk modul ini sedang disiapkan.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900 dark:text-slate-100">
      {/* Top Banner Header (Dark Navy matching Roadmap Group Banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0d1322] border border-slate-800 p-6 sm:p-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Panduan Prompting Spesifik LLM
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cara Prompting Efektif di {guide.llmName}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              {guide.summary}
            </p>
          </div>

          <button
            onClick={onAdvanceToQuiz}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2.5 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Lanjut ke Kuis Akhir</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Best Practices Cards Row */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Prinsip Utama Prompting {guide.llmName}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guide.bestPractices.map((practice, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all space-y-2.5 shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black text-xs">
                0{idx + 1}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs font-medium leading-relaxed">
                {practice}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature-Specific Prompting Tips List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Tips & Contoh Formula Prompt {guide.llmName}</span>
          </h3>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {guide.tips.length} Teknik Tersedia
          </span>
        </div>

        <div className="space-y-6">
          {guide.tips.map((tip, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all shadow-sm relative text-slate-900 dark:text-slate-100"
            >
              {/* Tip Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {tip.featureName}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {tip.badge}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white pt-1">
                    {tip.title}
                  </h4>
                </div>
              </div>

              {/* Explanation */}
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                {tip.explanation}
              </p>

              {/* Copyable Prompt Example Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                    <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Contoh Formula Prompt Siap Pakai:
                  </span>
                  <button
                    onClick={() => handleCopy(tip.promptExample, index)}
                    className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 px-3.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 transition-all cursor-pointer font-bold shadow-xs"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-300">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-200 whitespace-pre-wrap leading-relaxed relative shadow-inner">
                  {tip.promptExample}
                </div>
              </div>

              {/* Pro Tip Callout Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 shadow-xs">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-black text-amber-900 dark:text-amber-300">Pro Tip Pakar: </span>
                  <span className="text-amber-950/80 dark:text-amber-200/90 leading-relaxed font-medium">{tip.proTip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mid-Module Mini-Quiz Checkpoint */}
      {onCompleteCheckpoint && (
        <MiniQuizCheckpoint
          checkpointId={promptingQuestion.id}
          title={promptingQuestion.title}
          question={promptingQuestion}
          completedCheckpoints={completedCheckpoints}
          onCompleteCheckpoint={onCompleteCheckpoint}
        />
      )}

      {/* Bottom CTA to Quiz */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base sm:text-lg font-black text-white">Sudah Menguasai Teknik Prompting {guide.llmName}?</h4>
          <p className="text-xs text-slate-300">Uji pemahaman Anda melalui kuis interaktif untuk mendapatkan skor & lencana modul!</p>
        </div>
        <button
          onClick={onAdvanceToQuiz}
          className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <span>Mulai Kuis Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
