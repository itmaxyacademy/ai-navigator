import React, { useState } from 'react';
import { FLASHCARDS_DATA, Flashcard, ConfidenceLevel } from '../data/flashcards';
import { 
  RotateCw, Check, AlertCircle, HelpCircle, ChevronLeft, ChevronRight, 
  Shuffle, Layers, Award, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConceptFlashcardsWidgetProps {
  onAwardXp?: (amount: number, label: string) => void;
  className?: string;
}

export const ConceptFlashcardsWidget: React.FC<ConceptFlashcardsWidgetProps> = ({
  onAwardXp,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isDebounced, setIsDebounced] = useState<boolean>(false);

  // Confidence state stored in localStorage { [cardId]: ConfidenceLevel }
  const [confidenceMap, setConfidenceMap] = useState<Record<string, ConfidenceLevel>>(() => {
    try {
      const saved = localStorage.getItem('ai_navigator_flashcards_confidence_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track cards that have already awarded XP to prevent re-harvesting
  const [awardedXpCardIds, setAwardedXpCardIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ai_navigator_flashcards_xp_awarded_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories = ['Semua', 'Prompting', 'Arsitektur LLM', 'RAG & Memory', 'Parameter & Tuning', 'Keamanan & Etika'];

  // Filter flashcards by selected category
  const filteredCards = selectedCategory === 'Semua' 
    ? FLASHCARDS_DATA 
    : FLASHCARDS_DATA.filter((c) => c.category === selectedCategory);

  const safeIndex = currentIndex < filteredCards.length ? currentIndex : 0;
  const currentCard: Flashcard = filteredCards[safeIndex] || FLASHCARDS_DATA[0];
  const currentConfidence = confidenceMap[currentCard.id];

  // Stats calculation
  const totalCardsCount = FLASHCARDS_DATA.length;
  const masteredCount = Object.values(confidenceMap).filter((v) => v === 'mastered').length;
  const masteredPct = Math.round((masteredCount / totalCardsCount) * 100);

  const handleNext = () => {
    if (isDebounced) return;
    setIsDebounced(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
      setIsDebounced(false);
    }, 150);
  };

  const handlePrev = () => {
    if (isDebounced) return;
    setIsDebounced(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
      setIsDebounced(false);
    }, 150);
  };

  const handleShuffle = () => {
    if (isDebounced) return;
    setIsDebounced(true);
    setIsFlipped(false);
    setTimeout(() => {
      let nextIdx = Math.floor(Math.random() * filteredCards.length);
      if (nextIdx === safeIndex && filteredCards.length > 1) {
        nextIdx = (nextIdx + 1) % filteredCards.length;
      }
      setCurrentIndex(nextIdx);
      setIsDebounced(false);
    }, 150);
  };

  const handleSelectCategory = (cat: string) => {
    setIsFlipped(false);
    setSelectedCategory(cat);
    setCurrentIndex(0);
  };

  const handleSetConfidence = (level: ConfidenceLevel) => {
    if (isDebounced) return;
    setIsDebounced(true);

    const isFirstTimeMastered = level === 'mastered' && !awardedXpCardIds.includes(currentCard.id);

    const nextMap = {
      ...confidenceMap,
      [currentCard.id]: level,
    };
    setConfidenceMap(nextMap);

    try {
      localStorage.setItem('ai_navigator_flashcards_confidence_v1', JSON.stringify(nextMap));
    } catch (e) {
      console.error(e);
    }

    if (isFirstTimeMastered) {
      const updatedAwarded = [...awardedXpCardIds, currentCard.id];
      setAwardedXpCardIds(updatedAwarded);
      try {
        localStorage.setItem('ai_navigator_flashcards_xp_awarded_v1', JSON.stringify(updatedAwarded));
      } catch (e) {
        console.error(e);
      }

      if (onAwardXp) {
        onAwardXp(5, `Kuasai Istilah: ${currentCard.term}`);
      }
    }

    // Auto-advance to next card
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleResetConfidence = () => {
    if (window.confirm('Reset semua riwayat tingkat pemahaman flashcard?')) {
      setConfidenceMap({});
      try {
        localStorage.removeItem('ai_navigator_flashcards_confidence_v1');
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className={`bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-white border rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden space-y-4 ${className}`}>
      {/* Widget Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight break-words">Flashcard Konsep AI</h3>
              <span className="text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                Kartu Istilah
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
              Uji pemahaman istilah penting &amp; parameter LLM
            </p>
          </div>
        </div>

        {/* Mastered Counter Tag */}
        <div className="text-right shrink-0">
          <span className="text-xs font-black text-indigo-300 flex items-center gap-1 justify-end">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>{masteredPct}% Mastered</span>
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {masteredCount}/{totalCardsCount} Istilah
          </span>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleSelectCategory(cat)}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flippable Card Container */}
      <div className="relative z-10 min-h-[250px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}-${selectedCategory}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={() => !isDebounced && setIsFlipped(!isFlipped)}
            className={`w-full min-h-[250px] p-5 rounded-2xl border cursor-pointer select-none transition-all duration-300 relative flex flex-col justify-between shadow-lg ${
              isFlipped
                ? 'bg-slate-950 border-indigo-600'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Card Header Tag */}
            <div className="flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono font-bold text-indigo-300 bg-indigo-950 border border-indigo-800 px-2.5 py-0.5 rounded-full text-[10px] truncate">
                  {currentCard.category}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full font-bold shrink-0">
                  {currentCard.level}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                {currentConfidence === 'mastered' && (
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" /> Paham
                  </span>
                )}
                {currentConfidence === 'medium' && (
                  <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Ragu
                  </span>
                )}
                {currentConfidence === 'need_review' && (
                  <span className="text-[10px] font-extrabold text-rose-400 bg-rose-950 border border-rose-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Review
                  </span>
                )}
                <span className="text-slate-500 text-[10px] font-mono">
                  {isFlipped ? 'Jawaban' : 'Klik Buka'}
                </span>
              </div>
            </div>

            {/* Card Main Body */}
            {!isFlipped ? (
              /* FRONT SIDE */
              <div className="my-auto py-4 space-y-2 text-center min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block">
                  Istilah LLM #{safeIndex + 1}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight break-words">
                  {currentCard.term}
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed italic break-words">
                  "{currentCard.teaser}"
                </p>
                <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-indigo-300 font-bold">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Klik kartu untuk melihat definisi &amp; contoh</span>
                </div>
              </div>
            ) : (
              /* BACK SIDE */
              <div className="my-auto py-2 space-y-3 min-w-0">
                <h5 className="text-sm sm:text-base font-extrabold text-indigo-300 border-b border-slate-800 pb-1.5 flex items-center justify-between gap-2">
                  <span className="break-words min-w-0">{currentCard.term}</span>
                  <span className="text-[10px] font-mono font-normal text-slate-400 shrink-0">Penjelasan</span>
                </h5>

                <p className="text-xs text-slate-200 leading-relaxed font-medium break-words">
                  {currentCard.definition}
                </p>

                {currentCard.analogy && (
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300 leading-relaxed break-words">
                    💡 <strong className="text-indigo-300">Analogi:</strong> {currentCard.analogy}
                  </div>
                )}

                {currentCard.example && (
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed break-words">
                    📝 <strong className="text-indigo-300 font-sans">Contoh:</strong> {currentCard.example}
                  </div>
                )}
              </div>
            )}

            {/* Card Bottom Rating Controls (When Flipped) */}
            {isFlipped ? (
              <div 
                className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[10px] font-bold text-slate-400 shrink-0">
                  Tingkat Pemahaman:
                </span>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                  <button
                    disabled={isDebounced}
                    onClick={() => handleSetConfidence('need_review')}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer border ${
                      currentConfidence === 'need_review'
                        ? 'bg-rose-600 text-white border-rose-400'
                        : 'bg-slate-900 border-slate-800 text-rose-300 hover:bg-slate-800'
                    }`}
                  >
                    Belum Paham
                  </button>
                  <button
                    disabled={isDebounced}
                    onClick={() => handleSetConfidence('medium')}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer border ${
                      currentConfidence === 'medium'
                        ? 'bg-amber-600 text-white border-amber-400'
                        : 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
                    }`}
                  >
                    Ragu
                  </button>
                  <button
                    disabled={isDebounced}
                    onClick={() => handleSetConfidence('mastered')}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer border ${
                      currentConfidence === 'mastered'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-emerald-300 hover:bg-slate-800'
                    }`}
                  >
                    Paham {!awardedXpCardIds.includes(currentCard.id) ? '(+5 XP)' : ''}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>Kartu {safeIndex + 1} dari {filteredCards.length}</span>
                <span>Klik untuk Balik Kartu</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
            title="Kartu Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
            title="Acak Kartu"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
            title="Kartu Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleResetConfidence}
          className="text-[10px] font-bold text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Status</span>
        </button>
      </div>
    </div>
  );
};
