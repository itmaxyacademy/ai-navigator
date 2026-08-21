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
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4 text-emerald-950">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-slate-900">{title}</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-xs">
                +25 XP Diklaim
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-normal">
              Anda telah menyelesaikan checkpoint ini dan memperkuat pemahaman materi!
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer shrink-0"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 text-slate-900 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
              Mid-Module Checkpoint
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900">{title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black shadow-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          +25 XP Bonus
        </div>
      </div>

      {/* Question */}
      <div className="space-y-3">
        <p className="text-sm font-black text-slate-900 leading-relaxed">
          {question.question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {question.options.map((opt, idx) => {
            let optionStyle =
              'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-800';

            if (isSubmitted) {
              if (idx === question.correctAnswer) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-400';
              } else if (idx === selectedOption) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-1 ring-rose-400';
              } else {
                optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSubmit(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed pt-0.5">{opt}</span>

                {isSubmitted && idx === question.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                )}
                {isSubmitted && idx === selectedOption && idx !== question.correctAnswer && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-2xl border text-xs space-y-1 animate-in fade-in duration-200 ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 font-black">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Benar Sekali! (+25 XP)</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Kurang Tepat, Cermati Pembahasan:</span>
              </>
            )}
          </div>
          <p className="text-slate-600 leading-relaxed pt-1 font-normal">
            💡 {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
