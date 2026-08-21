import React, { useState, useEffect, useMemo } from 'react';
import { getLocalDateString, getDaysDifference } from '../lib/gamification';
import { getTodayChallengeSet, DailyChallengeSet, DailyQuestion } from '../data/dailyChallenges';
import { 
  Flame, CheckCircle2, XCircle, Sparkles, 
  HelpCircle, ArrowRight, Clock, ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface DailyChallengeWidgetProps {
  onAwardXp?: (amount: number, label: string) => void;
  className?: string;
}

interface CompletedState {
  dateCompleted: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  streak: number;
  userAnswers: number[];
}

export const DailyChallengeWidget: React.FC<DailyChallengeWidgetProps> = React.memo(({
  onAwardXp,
  className = '',
}) => {
  const todayStr = getLocalDateString();
  const challengeSet: DailyChallengeSet = useMemo(() => getTodayChallengeSet(todayStr), [todayStr]);

  const STORAGE_KEY_COMPLETED = 'ai_navigator_daily_challenge_completed_v1';
  const STORAGE_KEY_STREAK = 'ai_navigator_daily_challenge_streak_v1';
  const STORAGE_KEY_LAST_DATE = 'ai_navigator_daily_challenge_last_date_v1';

  // State
  const [completedData, setCompletedData] = useState<CompletedState | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (saved) {
        const parsed: CompletedState = JSON.parse(saved);
        if (parsed.dateCompleted === todayStr) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [currentStreak, setCurrentStreak] = useState<number>(() => {
    try {
      const lastDate = localStorage.getItem(STORAGE_KEY_LAST_DATE);
      const savedStreak = parseInt(localStorage.getItem(STORAGE_KEY_STREAK) || '0', 10);
      if (lastDate) {
        const diff = getDaysDifference(lastDate, todayStr);
        if (diff <= 1) {
          return savedStreak;
        } else {
          return 0; // Streak reset if skipped a day
        }
      }
      return savedStreak;
    } catch {
      return 0;
    }
  });

  // Active Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showReviewMode, setShowReviewMode] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Countdown timer to midnight
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion: DailyQuestion = challengeSet.questions[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIdx !== null || isProcessing) return; // Answer locked or debouncing
    setSelectedOptionIdx(idx);
  };

  const handleNextQuestion = () => {
    if (selectedOptionIdx === null || isProcessing) return;

    setIsProcessing(true);
    const nextAnswers = [...userAnswers, selectedOptionIdx];
    setUserAnswers(nextAnswers);

    if (currentQuestionIdx < challengeSet.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setTimeout(() => setIsProcessing(false), 300);
    } else {
      // Quiz Finished! Calculate result
      let correctCount = 0;
      nextAnswers.forEach((ans, i) => {
        if (ans === challengeSet.questions[i].correctIndex) {
          correctCount++;
        }
      });

      // Calculate streak & XP fairly
      const lastDate = localStorage.getItem(STORAGE_KEY_LAST_DATE);
      let newStreak = currentStreak;
      if (!lastDate || getDaysDifference(lastDate, todayStr) === 1) {
        newStreak += 1;
      } else if (getDaysDifference(lastDate, todayStr) > 1) {
        newStreak = 1;
      } else if (newStreak === 0) {
        newStreak = 1;
      }

      // Base XP: +10 per correct answer, plus +10 bonus for perfect 3/3
      let baseXp = correctCount * 10;
      if (correctCount === challengeSet.questions.length) {
        baseXp += 10;
      }

      // Streak Bonus: +2 XP per day of streak, capped at +10 XP max
      const streakBonus = Math.min(newStreak * 2, 10);
      const totalEarnedXp = baseXp + streakBonus;

      const completionRecord: CompletedState = {
        dateCompleted: todayStr,
        score: correctCount,
        totalQuestions: challengeSet.questions.length,
        xpEarned: totalEarnedXp,
        streak: newStreak,
        userAnswers: nextAnswers,
      };

      // Save to LocalStorage
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completionRecord));
        localStorage.setItem(STORAGE_KEY_STREAK, newStreak.toString());
        localStorage.setItem(STORAGE_KEY_LAST_DATE, todayStr);
      } catch (e) {
        console.error(e);
      }

      setCompletedData(completionRecord);
      setCurrentStreak(newStreak);
      setIsProcessing(false);

      // Trigger Confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      // Award XP
      if (onAwardXp && totalEarnedXp > 0) {
        onAwardXp(
          totalEarnedXp,
          `Tantangan Harian (${correctCount}/3 Benar + Streak ${newStreak} Hari)`
        );
      }
    }
  };

  return (
    <div className={`bg-white border-slate-200 text-slate-900 dark:bg-[#0d1322] dark:border-slate-800 dark:text-white border rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden space-y-4 ${className}`}>
      {/* Widget Header */}
      <div className="relative z-10 space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Flame className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                  Tantangan Kuis Harian
                </h3>
                <span className="text-[9px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                  DAILY QUIZ
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium">
                {challengeSet.title}
              </p>
            </div>
          </div>

          {/* Streak & Countdown Info */}
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-xl">
              <Flame className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <div className="text-left">
                <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 block leading-none">STREAK</span>
                <span className="text-xs font-black text-indigo-300 leading-none whitespace-nowrap">{currentStreak} Hari</span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body: Completed vs Active Quiz */}
      {completedData && !showReviewMode ? (
        /* COMPLETED CARD VIEW */
        <div className="relative z-10 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 block">
              Tantangan Hari Ini Selesai
            </span>
            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white break-words">
              Skor Anda: {completedData.score} dari {completedData.totalQuestions} Benar
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Anda berhasil mengklaim <strong className="text-indigo-300">+{completedData.xpEarned} XP</strong> hari ini.
            </p>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto pt-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl space-y-0.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">Bonus Streak</span>
              <span className="text-xs font-black text-indigo-300 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-indigo-400" />
                +{Math.min(completedData.streak * 2, 10)} XP
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl space-y-0.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">Tantangan Baru</span>
              <span className="text-xs font-black text-slate-600 dark:text-slate-300">Besok Pagi</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setShowReviewMode(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
              <span>Review Pembahasan</span>
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUIZ OR REVIEW MODE VIEW */
        <div className="relative z-10 space-y-4">
          {/* Review Header Banner */}
          {showReviewMode && (
            <div className="flex items-center justify-between bg-indigo-950 border border-indigo-800 p-2.5 rounded-xl text-xs">
              <span className="font-extrabold text-indigo-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Mode Review Pembahasan Kuis
              </span>
              <button
                onClick={() => setShowReviewMode(false)}
                className="text-xs font-bold text-indigo-300 hover:text-slate-900 dark:text-white underline cursor-pointer"
              >
                Kembali
              </button>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono font-bold text-indigo-300 bg-indigo-950 border border-indigo-800 px-2.5 py-0.5 rounded-full text-[10px]">
                {currentQuestion.topic}
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Soal {currentQuestionIdx + 1} / {challengeSet.questions.length}
              </span>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {challengeSet.questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentQuestionIdx
                      ? 'bg-indigo-400 scale-110'
                      : i < currentQuestionIdx
                      ? 'bg-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug break-words">
              {currentQuestion.question}
            </h4>

            {/* Options List */}
            <div className="space-y-2 pt-1">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedOptionIdx === optIdx;
                const isCorrect = optIdx === currentQuestion.correctIndex;
                const reviewUserAns = completedData?.userAnswers?.[currentQuestionIdx];

                let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500';

                if (showReviewMode) {
                  if (optIdx === currentQuestion.correctIndex) {
                    optionStyle = 'bg-emerald-950 border-emerald-600 text-emerald-200 font-bold';
                  } else if (optIdx === reviewUserAns && reviewUserAns !== currentQuestion.correctIndex) {
                    optionStyle = 'bg-rose-950 border-rose-600 text-rose-200';
                  }
                } else if (selectedOptionIdx !== null) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-extrabold';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-950 border-rose-500 text-rose-200 font-extrabold';
                  } else {
                    optionStyle = 'bg-white dark:bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => !showReviewMode && handleSelectOption(optIdx)}
                    disabled={selectedOptionIdx !== null || showReviewMode || isProcessing}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-3 ${
                      !showReviewMode && selectedOptionIdx === null ? 'cursor-pointer' : 'cursor-default'
                    } ${optionStyle}`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed break-words min-w-0">{opt}</span>
                    </div>

                    {(selectedOptionIdx !== null || showReviewMode) && (
                      <div className="shrink-0 mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          isSelected && <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {(selectedOptionIdx !== null || showReviewMode) && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-xl bg-indigo-950/60 border border-indigo-800 text-xs text-indigo-200 space-y-1"
              >
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Pembahasan Penjelasan:</span>
                </div>
                <p className="leading-relaxed text-xs text-slate-600 dark:text-slate-300 break-words">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-1">
            {showReviewMode ? (
              <div className="flex items-center justify-between w-full gap-2">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white disabled:opacity-40 cursor-pointer"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={currentQuestionIdx === challengeSet.questions.length - 1}
                  onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white disabled:opacity-40 cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end w-full">
                <button
                  disabled={selectedOptionIdx === null || isProcessing}
                  onClick={handleNextQuestion}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md ${
                    selectedOptionIdx !== null && !isProcessing
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {currentQuestionIdx < challengeSet.questions.length - 1
                      ? 'Lanjut ke Soal Berikutnya'
                      : 'Selesaikan Kuis Harian'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
