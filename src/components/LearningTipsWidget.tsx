import React, { useState } from 'react';
import { LEARNING_TIPS, LearningTip } from '../data/learningTips';
import { 
  Lightbulb, Sparkles, Copy, Check, Bookmark, BookmarkCheck, 
  ChevronLeft, ChevronRight, Shuffle
} from 'lucide-react';
import { getLocalDateString } from '../lib/gamification';

interface LearningTipsWidgetProps {
  onAwardXp?: (amount: number, label: string) => void;
  className?: string;
  compact?: boolean;
}

export const LearningTipsWidget: React.FC<LearningTipsWidgetProps> = ({
  onAwardXp,
  className = '',
  compact = false,
}) => {
  // Deterministic Daily Tip Index based on Date String
  const getTodayTipIndex = () => {
    const todayStr = getLocalDateString();
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % LEARNING_TIPS.length;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getTodayTipIndex);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [completedTipIds, setCompletedTipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ai_navigator_completed_tips_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedTipIds, setBookmarkedTipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ai_navigator_bookmarked_tips_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentTip: LearningTip = LEARNING_TIPS[currentIndex] || LEARNING_TIPS[0];
  const isDailyTip = currentIndex === getTodayTipIndex();
  const isBookmarked = bookmarkedTipIds.includes(currentTip.id);
  const isUnderstood = completedTipIds.includes(currentTip.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % LEARNING_TIPS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + LEARNING_TIPS.length) % LEARNING_TIPS.length);
  };

  const handleRandom = () => {
    let nextIdx = Math.floor(Math.random() * LEARNING_TIPS.length);
    if (nextIdx === currentIndex) {
      nextIdx = (nextIdx + 1) % LEARNING_TIPS.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleCopyPrompt = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const toggleBookmark = (id: string) => {
    const next = isBookmarked
      ? bookmarkedTipIds.filter((t) => t !== id)
      : [...bookmarkedTipIds, id];
    setBookmarkedTipIds(next);
    try {
      localStorage.setItem('ai_navigator_bookmarked_tips_v1', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkUnderstood = () => {
    if (isUnderstood) return;
    const next = [...completedTipIds, currentTip.id];
    setCompletedTipIds(next);
    try {
      localStorage.setItem('ai_navigator_completed_tips_v1', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }

    if (onAwardXp) {
      onAwardXp(10, `Tip AI: ${currentTip.title}`);
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden space-y-4 ${className}`}>
      {/* Widget Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 shrink-0">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-white tracking-tight break-words">Tips Belajar AI</h3>
              {isDailyTip && (
                <span className="text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Tip Hari Ini
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">Pahami konsep LLM &amp; rahasia formula prompt efektif</p>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
            title="Tip Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleRandom}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
            title="Tip Acak"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
            title="Tip Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tip Box */}
      <div className="relative z-10 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
        {/* Tip Title & Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">
              {currentTip.category} • {currentTip.level}
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug break-words">
              {currentTip.title}
            </h4>
          </div>

          <button
            onClick={() => toggleBookmark(currentTip.id)}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isBookmarked
                ? 'bg-indigo-950 border-indigo-800 text-indigo-400'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={isBookmarked ? 'Simpan di Bookmark' : 'Tandai Bookmark'}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Tip Explanation */}
        <p className="text-xs text-slate-300 leading-relaxed break-words">
          {currentTip.explanation}
        </p>

        {/* Example Prompt Snippet */}
        {currentTip.promptExample && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono font-bold text-indigo-300">Contoh Implementasi Prompt:</span>
              <button
                onClick={() => handleCopyPrompt(currentTip.promptExample)}
                className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-indigo-400" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap break-words leading-relaxed">
              {currentTip.promptExample}
            </pre>
          </div>
        )}

        {/* Understood Action Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] text-slate-500">
            Tip {currentIndex + 1} dari {LEARNING_TIPS.length}
          </span>

          <button
            onClick={handleMarkUnderstood}
            disabled={isUnderstood}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isUnderstood
                ? 'bg-slate-900 border border-slate-800 text-emerald-400 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md'
            }`}
          >
            {isUnderstood ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sudah Dipahami (+10 XP)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Pahami Tip Ini (+10 XP)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
