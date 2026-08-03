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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Bagian 3 Dari 3: Evaluasi Acak
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Kuis Akhir Modul {module.id}: {module.title}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Pertanyaan {currentQuestionIdx + 1} dari {quizQuestions.length}
          </span>
        </div>
      </div>

      {!isSubmitted ? (
        /* Active Question Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Question Title */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Soal Nomor {currentQuestionIdx + 1}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
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
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between min-h-[4rem] h-auto ${
                    isSelected
                      ? 'bg-indigo-950 border-indigo-500 text-slate-900 dark:text-white ring-1 ring-indigo-500/50 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-700 hover:bg-white dark:bg-slate-900'
                  }`}
                >
                  <span className="flex items-start gap-3 w-full">
                    <span
                      className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border mt-0.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="break-words whitespace-normal leading-relaxed flex-1">{opt.text}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl"
            >
              Kembali
            </button>

            {currentQuestionIdx < quizQuestions.length - 1 ? (
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
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                Selesaikan Kuis &amp; Kirim <Award className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Results Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isPassed ? '🎉 Selamat! Anda Lulus Kuis' : '💡 Tetap Semangat! Coba Lagi'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Skor Anda: <strong className="text-amber-400 text-base">{score} / {quizQuestions.length}</strong> Benar
            </p>
          </div>

          {/* Question Review Breakdown */}
          <div className="space-y-4 text-left border-t border-slate-200 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pembahasan Jawaban:</h4>
            {quizQuestions.map((q, idx) => {
              const userAnsId = selectedAnswers[idx];
              const isCorrect = userAnsId === q.correctOptionId;
              const userAnsText = q.options.find(o => o.id === userAnsId)?.text;
              const correctAnsText = q.options.find(o => o.id === q.correctOptionId)?.text;
              
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800/40'
                      : 'bg-rose-950/30 border-rose-800/40'
                  }`}
                >
                  <div className="flex items-start gap-2 font-semibold text-slate-900 dark:text-white">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span>{idx + 1}. {q.question}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 pl-6">
                    <div>Jawaban Anda: <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>{userAnsText}</strong></div>
                    {!isCorrect && (
                      <div className="text-emerald-300 font-semibold mt-0.5">
                        Jawaban Benar: {correctAnsText}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 bg-slate-100 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                      💡 {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Ulangi Kuis Acak Baru
            </button>

            {onNextModule && (
              <button
                onClick={onNextModule}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
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
