import React, { useState } from 'react';
import {
  Award, Trophy, Flame, Sparkles, Target, CheckCircle2, ShieldCheck, Lock, Star, Zap, Compass, Filter, Check, X, ArrowUpRight
} from 'lucide-react';
import { UserProgress } from '../types';
import { BADGES_LIST, BadgeDefinition } from '../lib/achievementsData';
import confetti from 'canvas-confetti';

interface AchievementsProps {
  progress: UserProgress;
  totalModulesCount: number;
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const Achievements: React.FC<AchievementsProps> = ({
  progress,
  totalModulesCount,
  isOpen = true,
  onClose,
  isModal = false,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);

  if (isModal && !isOpen) return null;

  // Calculate unlocked statuses
  const badgeStatuses = BADGES_LIST.map((badge) => {
    const isUnlocked = badge.checkUnlocked(progress, totalModulesCount);
    const progressInfo = badge.getCalculatedProgress(progress, totalModulesCount);
    return {
      badge,
      isUnlocked,
      progressInfo,
    };
  });

  const unlockedCount = badgeStatuses.filter((b) => b.isUnlocked).length;
  const totalCount = BADGES_LIST.length;
  const overallPercent = Math.round((unlockedCount / totalCount) * 100);

  // Filtering
  const filteredBadges = badgeStatuses.filter((item) => {
    if (filterTab === 'unlocked' && !item.isUnlocked) return false;
    if (filterTab === 'locked' && item.isUnlocked) return false;
    if (categoryFilter !== 'all' && item.badge.category !== categoryFilter) return false;
    return true;
  });

  const renderIcon = (name: BadgeDefinition['iconName'], isUnlocked: boolean, colorClass: string) => {
    const iconProps = { className: `w-6 h-6 ${isUnlocked ? colorClass : 'text-slate-500'}` };
    switch (name) {
      case 'Zap': return <Zap {...iconProps} />;
      case 'Trophy': return <Trophy {...iconProps} />;
      case 'Flame': return <Flame {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'Target': return <Target {...iconProps} />;
      case 'CheckCircle2': return <CheckCircle2 {...iconProps} />;
      case 'Award': return <Award {...iconProps} />;
      case 'Star': return <Star {...iconProps} />;
      case 'Compass': return <Compass {...iconProps} />;
      case 'ShieldCheck': return <ShieldCheck {...iconProps} />;
      default: return <Award {...iconProps} />;
    }
  };

  const handleTestConfetti = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const content = (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner / Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600/30 via-indigo-900/60 to-purple-950/60 border border-amber-500/30 p-6 shadow-xl">
        {/* Animated Background Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 relative group">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Lencana & Milestones
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {unlockedCount} dari {totalCount} Lencana Terbuka
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Pencapaian Belajar (Achievements)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
                Kumpulkan lencana prestisius dengan konsisten belajar, menyelesaikan kuis sempurna, dan memperpanjang streak!
              </p>
            </div>
          </div>

          {/* Overall Progress Gauge */}
          <div className="w-full md:w-auto bg-slate-950/70 border border-slate-800 rounded-2xl p-4 min-w-[200px] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Total Progres</span>
              <span className="text-amber-400 font-extrabold">{overallPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 transition-all duration-700 shadow-md shadow-amber-500/30"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 text-right">
              {totalCount - unlockedCount} Lencana lagi untuk dicapai
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            onClick={() => setFilterTab('unlocked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terbuka ({unlockedCount})
          </button>
          <button
            onClick={() => setFilterTab('locked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'locked'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terkunci ({totalCount - unlockedCount})
          </button>
        </div>

        {/* Category Dropdown/Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'streak', label: '🔥 Streak' },
            { id: 'learning', label: '📚 Modul' },
            { id: 'xp', label: '✨ XP' },
            { id: 'milestone', label: '🏆 Milestone' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                categoryFilter === cat.id
                  ? 'bg-slate-800 border-indigo-500/50 text-indigo-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map(({ badge, isUnlocked, progressInfo }) => {
          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative rounded-2xl border p-4 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group hover:scale-[1.02] ${
                isUnlocked
                  ? `bg-gradient-to-br ${badge.gradientBg} ${badge.borderColor} shadow-lg hover:shadow-indigo-500/10`
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Unlocked Shimmer Effect */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              )}

              {/* Card Header: Icon & XP Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all ${
                    isUnlocked
                      ? `bg-slate-900/80 ${badge.borderColor} shadow-md animate-pulse`
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                  style={{ animationDuration: '4s' }}
                >
                  {isUnlocked ? (
                    renderIcon(badge.iconName, true, badge.iconColor)
                  ) : (
                    <Lock className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> +{badge.xpReward} XP
                  </span>

                  {isUnlocked ? (
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Check className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      Terkunci
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 mb-4">
                <h3
                  className={`text-sm font-extrabold flex items-center gap-1.5 ${
                    isUnlocked ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Bottom Condition / Progress Bar */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 mt-auto">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">{badge.conditionDescription}</span>
                  <span
                    className={`font-mono font-bold ${
                      isUnlocked ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {progressInfo.current} / {progressInfo.max}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-indigo-600/70'
                    }`}
                    style={{ width: `${progressInfo.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12 bg-slate-950/40 rounded-3xl border border-slate-800 space-y-3">
          <Award className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">Tidak Ada Lencana Ditemukan</h4>
          <p className="text-xs text-slate-500">Coba ubah filter status atau kategori di atas.</p>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Banner */}
            <div className="text-center space-y-3 pt-2">
              <div className="relative inline-block">
                <div
                  className={`w-20 h-20 rounded-3xl border-2 mx-auto flex items-center justify-center shadow-2xl ${
                    selectedBadge.checkUnlocked(progress, totalModulesCount)
                      ? `bg-gradient-to-br ${selectedBadge.gradientBg} ${selectedBadge.borderColor} shadow-indigo-500/20 animate-bounce`
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                  style={{ animationDuration: '3s' }}
                >
                  {renderIcon(
                    selectedBadge.iconName,
                    selectedBadge.checkUnlocked(progress, totalModulesCount),
                    selectedBadge.iconColor
                  )}
                </div>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Lencana {selectedBadge.category}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{selectedBadge.title}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 text-center leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Kriteria Buka:</span>
                <span className="font-bold text-slate-200">{selectedBadge.conditionDescription}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Hadiah XP:</span>
                <span className="font-extrabold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> +{selectedBadge.xpReward} XP
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Status:</span>
                <span
                  className={`font-extrabold ${
                    selectedBadge.checkUnlocked(progress, totalModulesCount)
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedBadge.checkUnlocked(progress, totalModulesCount)
                    ? 'Terbuka 🎉'
                    : 'Belum Terbuka 🔒'}
                </span>
              </div>
            </div>

            {selectedBadge.checkUnlocked(progress, totalModulesCount) && (
              <button
                onClick={handleTestConfetti}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Rayakan Lencana Ini!
              </button>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }

  return content;
};
