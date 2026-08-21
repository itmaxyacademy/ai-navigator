import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Zap, ArrowRight, ShieldCheck, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface MiniQuizQuestion {
  id: string;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface MiniQuizCheckpointProps {
  checkpointId: string;
  title?: string;
  question: MiniQuizQuestion;
  completedCheckpoints?: string[];
  onCompleteCheckpoint: (checkpointId: string, xpBonus: number) => void;
}

export const MiniQuizCheckpoint: React.FC<MiniQuizCheckpointProps> = ({
  checkpointId,
  title = 'Checkpoint Pemahaman Singkat',
  question,
  completedCheckpoints = [],
  onCompleteCheckpoint,
}) => {
  const isAlreadyCompleted = completedCheckpoints.includes(checkpointId);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (optionIdx: number) => {
    if (isSubmitted || isAlreadyCompleted) return;

    setSelectedOption(optionIdx);
    setIsSubmitted(true);

    const correct = optionIdx === question.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      // Trigger mini confetti
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#6366f1', '#38bdf8', '#f59e0b'],
      });

      // Award +25 XP
      onCompleteCheckpoint(checkpointId, 25);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  if (isAlreadyCompleted) {
    return (
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-white">{title}</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                +25 XP Diklaim
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Anda telah menyelesaikan checkpoint ini dan memperkuat pemahaman materi!
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer shrink-0"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-white transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">
              Mid-Module Checkpoint
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">{title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black shadow-sm">
          <Trophy className="w-3.5 h-3.5" />
          +25 XP Bonus
        </div>
      </div>

      {/* Question */}
      <div className="space-y-3">
        <p className="text-sm font-black text-white leading-relaxed">
          {question.question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {question.options.map((opt, idx) => {
            let optionStyle =
              'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white';

            if (isSubmitted) {
              if (idx === question.correctAnswer) {
                optionStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 font-bold ring-1 ring-emerald-500/40';
              } else if (idx === selectedOption) {
                optionStyle = 'bg-rose-950/90 border-rose-500 text-rose-100 font-bold ring-1 ring-rose-500/40';
              } else {
                optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSubmit(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 font-mono text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed pt-0.5">{opt}</span>

                {isSubmitted && idx === question.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                )}
                {isSubmitted && idx === selectedOption && idx !== question.correctAnswer && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Explanation */}
      {isSubmitted && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2 animate-fadeIn shadow-lg ${
            isCorrect
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="font-black flex items-center gap-2 text-sm">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Tepat Sekali! (+25 XP)
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400" /> Kurang Tepat, Mari Pelajari Lagi
              </>
            )}
          </div>
          <p className="leading-relaxed opacity-95 text-xs sm:text-sm">{question.explanation}</p>

          {!isCorrect && (
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2 bg-rose-900/80 hover:bg-rose-800 text-rose-100 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
            >
              Coba Lagi
            </button>
          )}
        </div>
      )}
    </div>
  );
};
