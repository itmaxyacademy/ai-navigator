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
      <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
        Panduan cara prompting untuk modul ini sedang disiapkan.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Panduan Prompting Spesifik LLM
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Cara Prompting Efektif di {guide.llmName}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {guide.summary}
            </p>
          </div>

          <button
            onClick={onAdvanceToQuiz}
            className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
          >
            <span>Lanjut ke Kuis Akhir</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Best Practices Cards Row */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Prinsip Utama Prompting {guide.llmName}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guide.bestPractices.map((practice, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2 relative overflow-hidden"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                0{idx + 1}
              </div>
              <p className="text-slate-200 text-xs font-medium leading-relaxed">
                {practice}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature-Specific Prompting Tips List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Tips & Contoh Prompt Per Fitur {guide.llmName}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {guide.tips.length} Teknik Tersedia
          </span>
        </div>

        <div className="space-y-6">
          {guide.tips.map((tip, index) => (
            <div
              key={index}
              className="rounded-3xl bg-slate-900 border border-slate-800/90 p-6 space-y-5 hover:border-indigo-500/40 transition-all shadow-xl relative"
            >
              {/* Tip Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                      {tip.featureName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                      {tip.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {tip.title}
                  </h4>
                </div>
              </div>

              {/* Explanation */}
              <p className="text-slate-300 text-xs leading-relaxed">
                {tip.explanation}
              </p>

              {/* Copyable Prompt Example Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <Terminal className="w-3.5 h-3.5" />
                    Contoh Formula Prompt Siap Pakai:
                  </span>
                  <button
                    onClick={() => handleCopy(tip.promptExample, index)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/60 px-3 py-1 rounded-lg border border-indigo-800/50 transition-all"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200/90 whitespace-pre-wrap leading-relaxed relative">
                  {tip.promptExample}
                </div>
              </div>

              {/* Pro Tip Callout Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-800/40 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-amber-300">Pro Tip Pakar: </span>
                  <span className="text-slate-300 leading-relaxed">{tip.proTip}</span>
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-white">Sudah Menguasai Teknik Prompting {guide.llmName}?</h4>
          <p className="text-xs text-slate-300">Uji pemahaman Anda melalui kuis interaktif untuk mendapatkan skor & badge!</p>
        </div>
        <button
          onClick={onAdvanceToQuiz}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0"
        >
          <span>Mulai Kuis Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
