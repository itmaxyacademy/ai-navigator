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
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white">{title}</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                +25 XP Diklaim
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Anda telah menyelesaikan checkpoint ini dan memperkuat pemahaman materi!
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-semibold text-slate-400 hover:text-white underline cursor-pointer shrink-0"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border-2 border-indigo-500/30 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl space-y-4 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 animate-pulse">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400">
                Mid-Module Checkpoint
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">{title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black">
          <Trophy className="w-3.5 h-3.5" />
          +25 XP Bonus
        </div>
      </div>

      {/* Question */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-slate-100 leading-relaxed">
          {question.question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {question.options.map((opt, idx) => {
            let optionStyle =
              'bg-slate-950/80 hover:bg-slate-800/90 border-slate-800 text-slate-200';

            if (isSubmitted) {
              if (idx === question.correctAnswer) {
                optionStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 font-bold';
              } else if (idx === selectedOption) {
                optionStyle = 'bg-rose-950/90 border-rose-500 text-rose-100 font-bold';
              } else {
                optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSubmit(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
              >
                <span className="w-5 h-5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-normal">{opt}</span>

                {isSubmitted && idx === question.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isSubmitted && idx === selectedOption && idx !== question.correctAnswer && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Explanation */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="font-extrabold flex items-center gap-1.5 text-sm">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tepat Sekali! (+25 XP)
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" /> Kurang Tepat, Mari Pelajari Lagi
              </>
            )}
          </div>
          <p className="leading-relaxed opacity-95">{question.explanation}</p>

          {!isCorrect && (
            <button
              onClick={handleReset}
              className="mt-2 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          )}
        </div>
      )}
    </div>
  );
};
