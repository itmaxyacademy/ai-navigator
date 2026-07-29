import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Trophy, RefreshCw, ArrowRight, Award, HelpCircle } from 'lucide-react';
import { CourseModule } from '../types';

interface QuizComponentProps {
  module: CourseModule;
  onQuizComplete: (score: number) => void;
  onNextModule?: () => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  module,
  onQuizComplete,
  onNextModule,
}) => {
  const questions = module.content.quiz;
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIdx];
  const isAnsweredCurrent = selectedAnswers[currentQuestionIdx] !== undefined;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIdx]: optionIndex,
    });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    onQuizComplete(score);

    // Trigger confetti if passed (at least 2 correct or 60%+)
    if (score >= Math.ceil(questions.length * 0.6)) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
  };

  const score = calculateScore();
  const isPassed = score >= Math.ceil(questions.length * 0.6);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Bagian 3 Dari 3: Evaluasi
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            Kuis Akhir Modul {module.id}: {module.title}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-mono">
            Pertanyaan {currentQuestionIdx + 1} dari {questions.length}
          </span>
        </div>
      </div>

      {!isSubmitted ? (
        /* Active Question Card */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Question Title */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Soal Nomor {currentQuestionIdx + 1}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-950 border-indigo-500 text-white ring-1 ring-indigo-500/50 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Kembali
            </button>

            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                disabled={!isAnsweredCurrent}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
              >
                Pertanyaan Berikutnya <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                Selesaikan Kuis & Kirim <Award className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Results Card */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">
              {isPassed ? '🎉 Selamat! Anda Lulus Kuis' : '💡 Tetap Semangat! Coba Lagi'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Skor Anda: <strong className="text-amber-400 text-base">{score} / {questions.length}</strong> Benar
            </p>
          </div>

          {/* Question Review Breakdown */}
          <div className="space-y-4 text-left border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pembahasan Jawaban:</h4>
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800/40'
                      : 'bg-rose-950/30 border-rose-800/40'
                  }`}
                >
                  <div className="flex items-start gap-2 font-semibold text-white">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span>{idx + 1}. {q.question}</span>
                  </div>
                  <div className="text-slate-300 pl-6">
                    <div>Jawaban Anda: <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>{q.options[userAns]}</strong></div>
                    {!isCorrect && (
                      <div className="text-emerald-300 font-semibold mt-0.5">
                        Jawaban Benar: {q.options[q.correctAnswer]}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 italic mt-1 bg-slate-950 p-2 rounded border border-slate-800">
                      💡 {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Ulangi Kuis
            </button>

            {onNextModule && (
              <button
                onClick={onNextModule}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                Lanjut ke Modul Berikutnya <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
