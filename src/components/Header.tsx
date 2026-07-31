import React, { useState } from 'react';
import { Sparkles, Award, Flame, RotateCcw, Menu, X, Compass, Trophy, Sun, Moon, StickyNote, Lock, Crown, ShieldCheck, LogOut, Save, Download, Upload } from 'lucide-react';
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
  onManualSave: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onManualSave,
  onExportJSON,
  onImportJSON,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const levelInfo = getUserLevelInfo(progress.xp);
  const userTier = progress.userTier || 'free';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
      theme === 'light'
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
        : 'bg-white dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* 1. BRAND LOGO */}
          <div
            onClick={() => onSelectTab('path')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <img
              src="https://cms.maxy.academy/uploads/LogoMaxy.png"
              alt="Maxy Academy Logo"
              className="h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className={`font-black text-base tracking-tight ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-900 dark:text-white'
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
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Maxy Academy
              </span>
            </div>
          </div>

          {/* 2. CENTER NAVIGATION (Segmented Pill Bar) */}
          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-2xl border shrink-0 ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-100 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800'
          }`}>
            <button
              onClick={() => onSelectTab('path')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'path'
                  ? 'bg-indigo-600 text-slate-900 dark:text-white shadow-md shadow-indigo-600/30'
                  : theme === 'light'
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-white dark:bg-slate-900'
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
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-white dark:bg-slate-900'
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
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-white dark:bg-slate-900'
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
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Lvl {levelInfo.level} ({levelInfo.title}) • {progress.xp} XP • {progress.streakDays} Hari Streak
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Klik untuk melihat detail pencapaian &amp; level.</p>
                </div>
              }
            >
              <div
                onClick={onOpenStreakModal}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer hover:scale-[1.02] shadow-sm ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {/* Streak */}
                <div className="flex items-center gap-1 text-amber-500 font-extrabold whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
                  <span>{progress.streakDays}d</span>
                </div>

                <div className="h-4 w-px bg-slate-300 dark:bg-slate-100 dark:bg-slate-800" />

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
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Status Akses Paket
                  </div>
                  {progress.userName && (
                    <p className="text-[11px] text-slate-900 dark:text-white font-semibold">{progress.userName}</p>
                  )}
                  {progress.userEmail && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{progress.userEmail}</p>
                  )}
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 mt-1">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      📦 {(!progress.packageName || progress.packageName.trim().startsWith('{')) ? (userTier === 'free' ? 'Free Plan' : userTier === 'tier1' ? 'Tier 1 Plan' : 'Tier 2 VIP') : progress.packageName}
                    </p>
                    {progress.subscriptionExpiredAt ? (
                      <p className="text-[10px] text-emerald-400 mt-0.5">
                        ✅ Aktif s/d {new Date(progress.subscriptionExpiredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    ) : userTier !== 'free' ? (
                      <p className="text-[10px] text-emerald-400 mt-0.5">✅ Akses Aktif</p>
                    ) : (
                      <p className="text-[10px] text-amber-400 mt-0.5">⚡ Free Trial (Modul 1-2)</p>
                    )}
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-extrabold text-xs transition-all hover:scale-105 cursor-pointer shadow-md shadow-indigo-600/20 whitespace-nowrap"
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

            {/* User Profile Pill */}
            {progress.userName && (
              <Tooltip
                content={
                  <div className="space-y-1 text-left min-w-[180px]">
                    <div className="font-bold text-indigo-300 text-xs">{progress.userName}</div>
                    {progress.userEmail && (
                      <p className="text-[10px] text-slate-600 dark:text-slate-300">{progress.userEmail}</p>
                    )}
                    <p className="text-[10px] text-emerald-400 font-semibold pt-1 border-t border-slate-300 dark:border-slate-700">
                      ✓ Akun Terhubung ke API Maxy
                    </p>
                  </div>
                }
              >
                <div
                  className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm ${
                    theme === 'light'
                      ? 'bg-slate-100 border-slate-200 text-slate-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-[10px] font-black text-slate-900 dark:text-white shrink-0 uppercase shadow-inner">
                    {progress.userName.charAt(0)}
                  </div>
                  <span className="truncate max-w-[120px]">{progress.userName}</span>
                </div>
              </Tooltip>
            )}

            {/* Certificate Button (If All Modules Completed) */}
            {allModulesCompleted && (
              <button
                onClick={onOpenCertificate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white font-extrabold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
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
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">Klik untuk beralih tampilan</p>
                </div>
              }
            >
              <button
                onClick={onToggleTheme}
                aria-label="Toggle Theme"
                className={`p-2 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </Tooltip>

            {/* Hidden file input for Import JSON */}
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={onImportJSON}
              className="hidden"
            />

            {/* Icon Button: Manual Save */}
            <Tooltip
              content={
                <div className="space-y-0.5 text-center">
                  <div className="font-bold text-xs text-indigo-400">Save Progress</div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">Simpan manual data Anda</p>
                </div>
              }
            >
              <button
                onClick={onManualSave}
                aria-label="Save Progress"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-indigo-50 border-slate-300 text-slate-500 hover:text-indigo-600'
                    : 'bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-400'
                }`}
              >
                <Save className="w-4 h-4" />
              </button>
            </Tooltip>

            {/* Icon Button: Export JSON */}
            <Tooltip
              content={
                <div className="space-y-0.5 text-center">
                  <div className="font-bold text-xs text-emerald-400">Export Data</div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">Download file backup .json</p>
                </div>
              }
            >
              <button
                onClick={onExportJSON}
                aria-label="Export Data"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-emerald-50 border-slate-300 text-slate-500 hover:text-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-400'
                }`}
              >
                <Download className="w-4 h-4" />
              </button>
            </Tooltip>

            {/* Icon Button: Import JSON */}
            <Tooltip
              content={
                <div className="space-y-0.5 text-center">
                  <div className="font-bold text-xs text-amber-400">Import Data</div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">Upload file backup .json</p>
                </div>
              }
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="Import Data"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-amber-50 border-slate-300 text-slate-500 hover:text-amber-600'
                    : 'bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-400'
                }`}
              >
                <Upload className="w-4 h-4" />
              </button>
            </Tooltip>

            {/* Icon Button: Reset Progress */}
            <Tooltip
              content={
                <div className="space-y-0.5 text-center">
                  <div className="font-bold text-xs text-rose-400">Reset Progres</div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">Reset data &amp; mulai dari awal</p>
                </div>
              }
            >
              <button
                onClick={onResetProgress}
                aria-label="Reset Progress"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-rose-50 border-slate-300 text-slate-500 hover:text-rose-600'
                    : 'bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-400'
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
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">Logout dari AI Navigator</p>
                </div>
              }
            >
              <button
                onClick={onLogout}
                aria-label="Logout"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-rose-50 border-slate-300 text-slate-500 hover:text-rose-600'
                    : 'bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-400'
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
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-3 ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        }`}>
          {progress.userName && (
            <div className="flex items-center gap-3 p-3 rounded-2xl border bg-slate-50 dark:bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-xs font-black text-slate-900 dark:text-white shrink-0 uppercase">
                {progress.userName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold truncate">{progress.userName}</span>
                {progress.userEmail && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{progress.userEmail}</span>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectTab('path');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-indigo-600 text-slate-900 dark:text-white"
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
                  theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <StickyNote className="w-4 h-4 text-amber-500" />
                Catatan Saya
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 p-3 rounded-2xl border bg-slate-50 dark:bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-extrabold">{progress.streakDays} Hari Streak</span>
              <span className="text-slate-500 dark:text-slate-400">•</span>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{progress.xp} XP</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onManualSave();
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border ${
                theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Save className="w-4 h-4 text-indigo-500" />
              Save
            </button>
            <button
              onClick={() => {
                onExportJSON();
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border ${
                theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4 text-emerald-500" />
              Export
            </button>
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border ${
                theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4 text-amber-500" />
              Import
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
