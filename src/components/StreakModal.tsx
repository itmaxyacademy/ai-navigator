import React from 'react';
import {
  Flame, Sparkles, Award, CheckCircle2, ShieldCheck, X, Clock, Zap, ArrowRight, Trophy, Star
} from 'lucide-react';
import { UserProgress } from '../types';
import { getUserLevelInfo, getLocalDateString, getDaysDifference } from '../lib/gamification';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  totalModulesCount: number;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  progress,
  totalModulesCount,
}) => {
  if (!isOpen) return null;

  const todayStr = getLocalDateString();
  const levelInfo = getUserLevelInfo(progress.xp);

  const isCompletedToday = progress.lastCompletedDate === todayStr;

  const levelsList = [
    { level: 1, name: 'Novice', range: '0 – 199 XP' },
    { level: 2, name: 'Apprentice', range: '200 – 599 XP' },
    { level: 3, name: 'Specialist', range: '600 – 1.199 XP' },
    { level: 4, name: 'Architect', range: '1.200 – 1.999 XP' },
    { level: 5, name: 'Grandmaster', range: '2.000+ XP' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-full bg-slate-100 dark:bg-slate-950/40 hover:bg-slate-100 dark:bg-slate-950/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <Flame className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Api Harian & Level System
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Streak {progress.streakDays} Hari Berturut-turut! 🔥
              </h2>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Today Status Alert */}
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              isCompletedToday
                ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'
                : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
            }`}
          >
            <div className="p-2 rounded-xl bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 shrink-0">
              {isCompletedToday ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Clock className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              )}
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-extrabold text-sm">
                {isCompletedToday
                  ? 'Api Harian Aktif Hari Ini! 🎉'
                  : 'Selesaikan 1 Modul Hari Ini! ⏳'}
              </div>
              <p className="opacity-90 leading-relaxed">
                {isCompletedToday
                  ? 'Selamat! Anda telah menyelesaikan setidaknya 1 aktivitas modul hari ini. Streak Anda aman!'
                  : 'Selesaikan minimal 1 kuis atau aktivitas modul sebelum jam 24:00 untuk mempertahankan streak harian Anda.'}
              </p>
            </div>
          </div>

          {/* User Level Card */}
          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Level Pengguna
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black border ${levelInfo.badgeColor}`}
              >
                Level {levelInfo.level}: {levelInfo.title}
              </span>
            </div>

            {/* Level XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Total XP: <strong className="text-amber-400">{progress.xp} XP</strong></span>
                <span>
                  {levelInfo.maxXp
                    ? `${levelInfo.currentLevelXp} / ${levelInfo.requiredLevelXp} XP Ke Level Berikutnya`
                    : 'Level Maksimum Tercapai!'}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Level Breakdown Pills */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
                Tingkatan Level Gamifikasi:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                {levelsList.map((lvl) => {
                  const isCurrent = levelInfo.level === lvl.level;
                  return (
                    <div
                      key={lvl.level}
                      className={`p-2 rounded-xl border flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-indigo-950/80 border-indigo-500 text-slate-900 dark:text-white font-bold ring-1 ring-indigo-500/50'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Star className={`w-3 h-3 ${isCurrent ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                        Lvl {lvl.level}: {lvl.name}
                      </span>
                      <span className="text-[10px] opacity-80">{lvl.range}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* XP Rules & Rewards Section */}
          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Aturan Perolehan XP & Streak
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <div className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Modul Baru Selesai
                </div>
                <div className="text-amber-400 font-black text-base">+100 XP</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Setiap kali Anda menyelesaikan kuis modul baru.</p>
              </div>

              <div className="p-3 bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <div className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" /> Milestone Pertengahan
                </div>
                <div className="text-purple-400 font-black text-base">+200 XP Bonus</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Bonus spesial saat mencapai pertengahan kurikulum.</p>
              </div>

              <div className="p-3 bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <div className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Re-attempt Kuis
                </div>
                <div className="text-emerald-400 font-black text-base">+20 XP</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Setiap pengulangan kuis pada modul yang sudah selesai.</p>
              </div>

              <div className="p-3 bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <div className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" /> Kelulusan & Sertifikat
                </div>
                <div className="text-amber-400 font-black text-base">+500 XP Bonus</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Saat menyelesaikan seluruh {totalModulesCount} modul.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <span>Tutup & Lanjutkan Belajar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
