import React, { useState } from 'react';
import { Target, CheckCircle2, Clock, Zap, ChevronDown, Edit3, X, Sparkles } from 'lucide-react';
import { getLocalDateString } from '../lib/gamification';

interface DailyGoalRingProps {
  dailyGoalMinutes?: number;
  dailyMinutesHistory?: Record<string, number>;
  onUpdateGoal: (newGoalMinutes: number) => void;
  onAddMinutes?: (extraMins: number) => void;
  compact?: boolean;
}

export const DailyGoalRing: React.FC<DailyGoalRingProps> = ({
  dailyGoalMinutes = 15,
  dailyMinutesHistory = {},
  onUpdateGoal,
  onAddMinutes,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState(dailyGoalMinutes.toString());

  const todayStr = getLocalDateString();
  const minutesToday = dailyMinutesHistory[todayStr] || 0;
  const goalMinutes = dailyGoalMinutes || 15;
  const percent = Math.min(100, Math.round((minutesToday / goalMinutes) * 100));
  const isGoalReached = minutesToday >= goalMinutes;

  // SVG Ring Calculations
  const radius = 16;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius; // ~100.53
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const goalOptions = [10, 15, 20, 30, 45, 60];

  return (
    <div className="relative inline-block">
      {/* Header Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={`Target Belajar Harian: ${minutesToday}/${goalMinutes} Menit (${percent}%)`}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all hover:scale-105 cursor-pointer shadow-sm ${
          isGoalReached
            ? 'bg-emerald-950/80 hover:bg-emerald-900/90 border-emerald-500/60 text-emerald-200'
            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-700/90 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
        }`}
      >
        {/* SVG Circular Progress Ring */}
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 40 40">
            {/* Background Circle */}
            <circle
              cx="20"
              cy="20"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-700/60 fill-none"
            />
            {/* Progress Circle */}
            <circle
              cx="20"
              cy="20"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`fill-none transition-all duration-500 ${
                isGoalReached ? 'text-emerald-400' : 'text-indigo-400'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isGoalReached ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <span className="text-[10px] font-black font-mono leading-none text-indigo-300">
                {percent}%
              </span>
            )}
          </div>
        </div>

        {/* Text Label */}
        {!compact && (
          <div className="flex flex-col items-start text-left leading-tight pr-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Target className="w-2.5 h-2.5 text-indigo-400" /> Target
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {minutesToday}/{goalMinutes}m
            </span>
          </div>
        )}
      </button>

      {/* Goal Settings Popover Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5 text-slate-800 dark:text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Target Belajar Harian</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tetapkan komitmen menit belajar per hari.</p>
              </div>
            </div>

            {/* Status Card */}
            <div
              className={`p-4 rounded-2xl border space-y-2 ${
                isGoalReached
                  ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'
                  : 'bg-indigo-950/40 border-indigo-800/80 text-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Progres Hari Ini
                </span>
                <span className="text-sm font-black">
                  {minutesToday} / {goalMinutes} Menit ({percent}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isGoalReached
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-[11px] opacity-90 leading-relaxed">
                {isGoalReached
                  ? '🎉 Luar biasa! Anda telah mencapai target belajar harian hari ini.'
                  : `Kurang ${Math.max(0, goalMinutes - minutesToday)} menit lagi untuk menyelesaikan target hari ini!`}
              </p>
            </div>

            {/* Target Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Pilih Target Menit / Hari:</label>
              <div className="grid grid-cols-3 gap-2">
                {goalOptions.map((mins) => {
                  const isSelected = goalMinutes === mins;
                  return (
                    <button
                      key={mins}
                      onClick={() => {
                        onUpdateGoal(mins);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-slate-900 dark:text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {mins} Mins
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Quick Add Activity (+5 mins) */}
            {onAddMinutes && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Membaca materi tambahan?</div>
                <button
                  onClick={() => onAddMinutes(5)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-indigo-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  +5 Menit
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
