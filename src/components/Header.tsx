import React, { useState } from 'react';
import { Sparkles, Award, Flame, RotateCcw, Menu, X, Compass, Trophy, Sun, Moon, StickyNote, Lock, Crown, ShieldCheck, LogOut } from 'lucide-react';
import { UserProgress } from '../types';
import { getUserLevelInfo } from '../lib/gamification';
import { DailyGoalRing } from './DailyGoalRing';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  progress: UserProgress;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onUpdateGoal: (newGoalMinutes: number) => void;
  onAddMinutes?: (extraMins: number) => void;
  onSelectTab: (tab: 'path') => void;
  activeTab: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetProgress: () => void;
  onLogout: () => void;
  onOpenCertificate: () => void;
  onOpenStreakModal: () => void;
  onOpenAchievements?: () => void;
  onOpenNotes?: () => void;
  onOpenUpgradeModal?: () => void;
  onOpenCapstoneModal?: () => void;
  allModulesCompleted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  theme,
  onToggleTheme,
  onUpdateGoal,
  onAddMinutes,
  onSelectTab,
  activeTab,
  onResetProgress,
  onLogout,
  onOpenCertificate,
  onOpenStreakModal,
  onOpenAchievements,
  onOpenNotes,
  onOpenUpgradeModal,
  allModulesCompleted,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const levelInfo = getUserLevelInfo(progress.xp);
  const userTier = progress.userTier || 'free';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
      theme === 'light'
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
        : 'bg-slate-900/95 border-slate-800 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* 1. BRAND LOGO */}
          <div
            onClick={() => onSelectTab('path')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 border border-indigo-500 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className={`font-black text-base tracking-tight ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  AI Navigator
                </span>
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full border ${
                  theme === 'light'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                }`}>
                  Pemula
                </span>
              </div>
              <p className={`text-[10px] hidden xl:block whitespace-nowrap ${
                theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'
              }`}>
                Panduan Interaktif Pengenalan LLM
              </p>
            </div>
          </div>

          {/* 2. CENTER NAVIGATION (Segmented Pill Bar) */}
          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-2xl border shrink-0 ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <button
              onClick={() => onSelectTab('path')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'path'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : theme === 'light'
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Peta Belajar</span>
            </button>

            {onOpenNotes && (
              <button
                onClick={onOpenNotes}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  theme === 'light'
                    ? 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                <span>Catatan</span>
              </button>
            )}

            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  theme === 'light'
                    ? 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-purple-500" />
                <span>Pencapaian</span>
              </button>
            )}
          </nav>

          {/* 3. RIGHT SECTION (Grouped User Stats & Utilities) */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-2.5 shrink-0 pr-1 sm:pr-2">
            
            {/* Daily Goal Ring - standalone, no Tooltip wrapper to avoid glitch */}
            <DailyGoalRing
              dailyGoalMinutes={progress.dailyGoalMinutes}
              dailyMinutesHistory={progress.dailyMinutesHistory}
              onUpdateGoal={onUpdateGoal}
              onAddMinutes={onAddMinutes}
            />

            {/* Streak & Level Stats Pill */}
            <Tooltip
              content={
                <div className="space-y-1 text-left">
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Status Belajar Anda
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Lvl {levelInfo.level} ({levelInfo.title}) • {progress.xp} XP • {progress.streakDays} Hari Streak
                  </p>
                  <p className="text-[10px] text-slate-400">Klik untuk melihat detail pencapaian &amp; level.</p>
                </div>
              }
            >
              <div
                onClick={onOpenStreakModal}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer hover:scale-[1.02] shadow-sm ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                {/* Streak */}
                <div className="flex items-center gap-1 text-amber-500 font-extrabold whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
                  <span>{progress.streakDays}d</span>
                </div>

                <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />

                {/* Level & XP */}
                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-300 font-extrabold whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lvl {levelInfo.level} • {progress.xp}XP</span>
                </div>
              </div>
            </Tooltip>

            {/* Tier Access Badge */}
            <Tooltip
              content={
                <div className="space-y-1.5 text-left min-w-[200px]">
                  {/* User Identity */}
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0">
                      {(progress.userName || 'U').charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate">{progress.userName || 'Pengguna'}</span>
                  </div>
                  {progress.userEmail && (
                    <p className="text-[10px] text-slate-400 pl-7">{progress.userEmail}</p>
                  )}
                  <div className="border-t border-slate-700 pt-1.5 mt-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                      <Crown className="w-3 h-3 text-amber-400" />
                      {progress.packageName || (userTier === 'tier2' ? 'VIP Master' : userTier === 'tier1' ? 'AI Practitioner' : 'Free Plan')}
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      {userTier === 'free'
                        ? 'Free Trial — Akses Modul 1 & 2. Upgrade untuk membuka semua!'
                        : userTier === 'tier1'
                        ? 'Tier 1 Aktif — Akses Penuh Seluruh Modul 1-29.'
                        : 'Tier 2 VIP Master — Akses Penuh + Bimbingan Eksklusif.'}
                    </p>
                    {progress.subscriptionExpiredAt ? (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Berlaku hingga: <span className="text-emerald-400 font-semibold">
                          {new Date(progress.subscriptionExpiredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </p>
                    ) : userTier !== 'free' ? (
                      <p className="text-[10px] text-emerald-400 mt-0.5">✓ Akses Seumur Hidup</p>
                    ) : null}
                  </div>
                </div>
              }
            >
              {userTier === 'free' ? (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all hover:scale-105 cursor-pointer shadow-md shadow-amber-500/20 whitespace-nowrap"
                >
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Free Trial • Upgrade</span>
                </button>
              ) : userTier === 'tier1' ? (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all hover:scale-105 cursor-pointer shadow-md shadow-indigo-600/20 whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Tier 1 Full</span>
                </button>
              ) : (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs transition-all hover:scale-105 cursor-pointer shadow-md shadow-amber-500/20 whitespace-nowrap"
                >
                  <Crown className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                  <span>Tier 2 VIP</span>
                </button>
              )}
            </Tooltip>

            {/* Certificate Button (If All Modules Completed) */}
            {allModulesCompleted && (
              <button
                onClick={onOpenCertificate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Sertifikat</span>
              </button>
            )}

            {/* Icon Button: Theme Toggle */}
            <Tooltip
              content={
                <div className="space-y-0.5 text-center">
                  <div className="font-bold text-xs">{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</div>
                  <p className="text-[10px] text-slate-300">Klik untuk beralih tampilan</p>
                </div>
              }
            >
              <button
                onClick={onToggleTheme}
                aria-label="Toggle Theme"
                className={`p-2 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </Tooltip>

            {/* Icon Button: Reset Progress */}
            <Tooltip
              content={
                <div className="space-y-0.5 text-center">
                  <div className="font-bold text-xs text-rose-400">Reset Progres</div>
                  <p className="text-[10px] text-slate-300">Reset data &amp; mulai dari awal</p>
                </div>
              }
            >
              <button
                onClick={onResetProgress}
                aria-label="Reset Progress"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-rose-50 border-slate-300 text-slate-500 hover:text-rose-600'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-rose-400'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </Tooltip>

            {/* Icon Button: Logout */}
            <Tooltip
              content={
                <div className="space-y-0.5 text-center">
                  <div className="font-bold text-xs text-rose-400">Keluar</div>
                  <p className="text-[10px] text-slate-300">Logout dari AI Navigator</p>
                </div>
              }
            >
              <button
                onClick={onLogout}
                aria-label="Logout"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-rose-50 border-slate-300 text-slate-500 hover:text-rose-600'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-rose-400'
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </Tooltip>

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl border shrink-0 ${
              theme === 'light'
                ? 'bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-3 ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectTab('path');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-indigo-600 text-white"
            >
              <Compass className="w-4 h-4" />
              Peta Belajar
            </button>

            {onOpenNotes && (
              <button
                onClick={() => {
                  onOpenNotes();
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${
                  theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <StickyNote className="w-4 h-4 text-amber-500" />
                Catatan Saya
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 p-3 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-extrabold">{progress.streakDays} Hari Streak</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{progress.xp} XP</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-bold"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

          {userTier === 'free' && (
            <button
              onClick={() => {
                if (onOpenUpgradeModal) onOpenUpgradeModal();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Upgrade ke Tier 1 / Tier 2
            </button>
          )}
        </div>
      )}
    </header>
  );
};
