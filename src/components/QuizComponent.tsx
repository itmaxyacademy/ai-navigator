import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Trophy, RefreshCw, ArrowRight, Award, HelpCircle } from 'lucide-react';
import { CourseModule, BankQuestion } from '../types';

interface QuizComponentProps {
  module: CourseModule;
  onQuizComplete: (score: number) => void;
  onNextModule?: () => void;
  quizLength?: number;
}

// Utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  module,
  onQuizComplete,
  onNextModule,
  quizLength = 10,
}) => {
  const [quizQuestions, setQuizQuestions] = useState<BankQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadAndPrepareQuestions = async () => {
    setIsLoading(true);
    try {
      // Lazy load JSON
      const { default: QUESTION_BANK } = await import('../data/questionBank.json');
      
      const bankModule = QUESTION_BANK.modules.find((m: any) => m.moduleId === module.id);
      let pool: BankQuestion[] = [];

      if (bankModule && bankModule.questions.length > 0) {
        pool = bankModule.questions;
      } else {
        pool = (module.content.quiz || []).map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options.map((opt, idx) => ({ id: idx.toString(), text: opt })),
          correctOptionId: q.correctAnswer.toString(),
          explanation: q.explanation,
        }));
      }

      const shuffledPool = shuffleArray(pool);
      const selected = shuffledPool.slice(0, quizLength);
      const preparedQuestions = selected.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));

      setQuizQuestions(preparedQuestions);
      setCurrentQuestionIdx(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
    } catch (error) {
      console.error("Failed to load question bank:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAndPrepareQuestions();
  }, [module.id, quizLength]);

  // Wait until questions are prepared
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-semibold">Mempersiapkan Soal Kuis...</p>
      </div>
    );
  }
  
  if (quizQuestions.length === 0) return null;

  const currentQuestion = quizQuestions[currentQuestionIdx];
  const isAnsweredCurrent = selectedAnswers[currentQuestionIdx] !== undefined;

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIdx]: optionId,
    });
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionId) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    // Normalize score to percentage if total differs, or pass absolute correct count.
    // The previous app used absolute correct count out of standard 3 questions.
    // Now that length varies, we pass the absolute count, but let's ensure onQuizComplete handles it.
    // However, badges might expect scores out of something.
    // Wait, onQuizComplete receives `score`. In `App.tsx`, it's stored as absolute.
    onQuizComplete(score);

    // Trigger confetti if passed (60%+)
    if (score >= Math.ceil(quizQuestions.length * 0.6)) {
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
    // Reshuffle on restart for a completely new quiz experience
    loadAndPrepareQuestions();
  };

  const score = calculateScore();
  const isPassed = score >= Math.ceil(quizQuestions.length * 0.6);

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm">
            Bagian 4 Dari 4: Evaluasi &amp; Kuis Pemahaman
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1.5">
            Kuis Modul {module.id}: {module.title}
          </h2>
        </div>
        <div className="sm:text-right">
          <span className="text-xs text-amber-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono font-bold">
            Soal {currentQuestionIdx + 1} / {quizQuestions.length}
          </span>
        </div>
      </div>

      {!isSubmitted ? (
        /* Active Question Card */
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Question Title */}
          <div className="space-y-2 pb-2 border-b border-slate-800">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" /> Soal Nomor {currentQuestionIdx + 1}
            </span>
            <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between min-h-[4rem] h-auto cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-400 text-white ring-2 ring-indigo-400/60 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span className="flex items-start gap-3.5 w-full">
                    <span
                      className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border mt-0.5 shadow-sm ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-300'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="break-words whitespace-normal leading-relaxed flex-1 pt-0.5">{opt.text}</span>
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
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Kembali
            </button>

            {currentQuestionIdx < quizQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                disabled={!isAnsweredCurrent}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Pertanyaan Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-emerald-600/30 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                <span>Selesaikan Kuis &amp; Kirim</span>
                <Award className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Results Card */
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              {isPassed ? '🎉 Luar Biasa! Anda Lulus Kuis' : '💡 Tetap Semangat! Coba Ulangi Kuis'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Skor Anda: <strong className="text-amber-400 text-base font-black">{score} / {quizQuestions.length}</strong> Benar ({Math.round((score / quizQuestions.length) * 100)}%)
            </p>
          </div>

          {/* Question Review Breakdown */}
          <div className="space-y-4 text-left border-t border-slate-800 pt-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Pembahasan Kunci Jawaban:</h4>
            {quizQuestions.map((q, idx) => {
              const userAnsId = selectedAnswers[idx];
              const isCorrect = userAnsId === q.correctOptionId;
              const userAnsText = q.options.find(o => o.id === userAnsId)?.text;
              const correctAnsText = q.options.find(o => o.id === q.correctOptionId)?.text;
              
              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2.5 shadow-md ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-rose-950/30 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 font-bold text-white leading-relaxed">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span>{idx + 1}. {q.question}</span>
                  </div>
                  <div className="text-slate-300 pl-6.5 space-y-1">
                    <div>Jawaban Anda: <strong className={isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>{userAnsText}</strong></div>
                    {!isCorrect && (
                      <div className="text-emerald-300 font-bold mt-0.5">
                        Jawaban Benar: {correctAnsText}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-300 italic mt-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      💡 {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-5 border-t border-slate-800">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" /> Ulangi Kuis Baru
            </button>

            {onNextModule && (
              <button
                onClick={onNextModule}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
              >
                <span>Lanjut ke Modul {module.id + 1}</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
