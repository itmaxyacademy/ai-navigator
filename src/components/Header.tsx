import React, { useState } from 'react';
import { Sparkles, Award, Flame, Search, BookOpen, Layers, RotateCcw, Menu, X, Compass, Trophy, Sun, Moon, Info, StickyNote, Lock, Crown, ShieldCheck } from 'lucide-react';
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
  searchQuery,
  onSearchChange,
  onResetProgress,
  onOpenCertificate,
  onOpenStreakModal,
  onOpenAchievements,
  onOpenNotes,
  onOpenUpgradeModal,
  onOpenCapstoneModal,
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <div
            onClick={() => onSelectTab('path')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 border border-indigo-500 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className={`font-extrabold text-base tracking-tight ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  AI Navigator
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full">
                  Pemula
                </span>
              </div>
              <p className={`text-[10px] hidden xl:block whitespace-nowrap ${
                theme === 'light' ? 'text-slate-600 font-semibold' : 'text-slate-400'
              }`}>
                Panduan Interaktif Pengenalan LLM
              </p>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className={`hidden lg:flex items-center gap-1.5 p-1 rounded-xl border shrink-0 ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <Tooltip
              content={
                <div className="space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" /> Peta Belajar (Digital Map)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Alur pembelajaran terstruktur dari dasar LLM hingga model canggih.
                  </p>
                </div>
              }
            >
              <button
                onClick={() => onSelectTab('path')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-200" />
                <span>Peta Belajar</span>
              </button>
            </Tooltip>

            {onOpenNotes && (
              <Tooltip
                content={
                  <div className="space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <StickyNote className="w-3.5 h-3.5" /> Catatan Pribadi Saya
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Buka koleksi catatan ringkasan dan poin penting.
                    </p>
                  </div>
                }
              >
                <button
                  onClick={onOpenNotes}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer whitespace-nowrap"
                >
                  <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                  <span>Catatan Saya</span>
                </button>
              </Tooltip>
            )}
          </nav>

          {/* User Stats & Badges */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {/* Circular Daily Learning Goal Ring */}
            <Tooltip
              content={
                <div className="space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Target Menit Harian
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Cincin progres melacak durasi belajar harian Anda.
                  </p>
                </div>
              }
            >
              <DailyGoalRing
                dailyGoalMinutes={progress.dailyGoalMinutes}
                dailyMinutesHistory={progress.dailyMinutesHistory}
                onUpdateGoal={onUpdateGoal}
                onAddMinutes={onAddMinutes}
              />
            </Tooltip>

            {/* Clickable Level Badge */}
            <Tooltip
              content={
                <div className="space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Level Kepakaran AI
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Menunjukkan tingkatan keahlian Anda.
                  </p>
                </div>
              }
            >
              <button
                onClick={onOpenStreakModal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0 ${levelInfo.badgeColor}`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Lvl {levelInfo.level}: {levelInfo.title}</span>
              </button>
            </Tooltip>

            {/* Clickable Streak Badge */}
            <Tooltip
              content={
                <div className="space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Rentetan Aktivitas (Streak)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Berapa hari berturut-turut Anda aktif belajar.
                  </p>
                </div>
              }
            >
              <button
                onClick={onOpenStreakModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-amber-500/40 text-xs font-bold text-amber-400 transition-all hover:scale-105 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
                <span>{progress.streakDays} Hari Streak</span>
              </button>
            </Tooltip>

            {/* Clickable XP Badge */}
            <Tooltip
              content={
                <div className="space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Experience Points (XP)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Poin pengalaman yang didapatkan dari Kuis & Checkpoint.
                  </p>
                </div>
              }
            >
              <button
                onClick={onOpenStreakModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-700/60 text-xs font-bold text-indigo-200 transition-all hover:scale-105 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{progress.xp} XP</span>
              </button>
            </Tooltip>

            {/* User Tier Status Badge */}
            <Tooltip
              content={
                <div className="space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Status Keanggotaan Paket
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {userTier === 'free'
                      ? 'Free Trial (Terbatas Modul 1 & 2). Klik untuk Upgrade ke Tier 1 / Tier 2.'
                      : userTier === 'tier1'
                      ? 'Tier 1 Aktif — Akses Penuh Seluruh Modul 1-29 & Sertifikat.'
                      : 'Tier 2 VIP Master — Akses Penuh + Bimbingan Mentoring & Review.'}
                  </p>
                </div>
              }
            >
              {userTier === 'free' ? (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-extrabold text-amber-300 transition-all hover:scale-105 cursor-pointer shadow-sm whitespace-nowrap shrink-0 animate-pulse"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Free Trial (1-2) • Upgrade</span>
                </button>
              ) : userTier === 'tier1' ? (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-bold text-indigo-300 transition-all hover:scale-105 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Tier 1 Full</span>
                </button>
              ) : (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-xs font-black transition-all hover:scale-105 cursor-pointer shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0"
                >
                  <Crown className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                  <span>Tier 2 VIP Master</span>
                </button>
              )}
            </Tooltip>

            {/* Achievements Button */}
            {onOpenAchievements && (
              <Tooltip
                content={
                  <div className="space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Lencana & Achievements
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Lihat daftar lencana pencapaian Anda.
                    </p>
                  </div>
                }
              >
                <button
                  onClick={onOpenAchievements}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/40 text-xs font-bold text-purple-200 transition-all hover:scale-105 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Pencapaian</span>
                </button>
              </Tooltip>
            )}

            {/* Certificate Button */}
            {allModulesCompleted && (
              <Tooltip
                content={
                  <div className="space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Sertifikat Kelulusan
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Klik untuk melihat sertifikat kelulusan resmi!
                    </p>
                  </div>
                }
              >
                <button
                  onClick={onOpenCertificate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>Sertifikat</span>
                </button>
              </Tooltip>
            )}

            {/* Theme Toggle Button */}
            <Tooltip
              content={
                <div className="space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Mode Tampilan (Theme)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Beralih antara Mode Gelap atau Mode Terang.
                  </p>
                </div>
              }
            >
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 text-slate-200 border border-slate-700/60 transition-all hover:scale-105 cursor-pointer shadow-sm text-xs font-bold whitespace-nowrap shrink-0"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="hidden xl:inline">Mode Terang</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="hidden xl:inline">Mode Gelap</span>
                  </>
                )}
              </button>
            </Tooltip>

            {/* Reset */}
            <Tooltip
              content={
                <div className="space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Progres Belajar
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Mengulang kembali perjalanan belajar Anda.
                  </p>
                </div>
              }
            >
              <button
                onClick={onResetProgress}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="pb-2 border-b border-slate-800">
            <button
              onClick={() => {
                onSelectTab('path');
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 bg-indigo-600 text-white"
            >
              <Compass className="w-4 h-4" />
              Peta Belajar (Digital Map Journey)
            </button>
          </div>

          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <DailyGoalRing
                dailyGoalMinutes={progress.dailyGoalMinutes}
                dailyMinutesHistory={progress.dailyMinutesHistory}
                onUpdateGoal={onUpdateGoal}
                onAddMinutes={onAddMinutes}
              />
            </div>
            <button
              onClick={() => {
                onToggleTheme();
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Mode Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Mode Gelap</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Stats */}
          <div className="flex items-center justify-between text-xs py-2 bg-slate-950 px-3 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                onOpenStreakModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-amber-400 font-bold"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>🔥 {progress.streakDays} Hari</span>
            </button>

            {onOpenAchievements && (
              <button
                onClick={() => {
                  onOpenAchievements();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 text-purple-300 font-bold"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Lencana</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenStreakModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-indigo-300 font-bold"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{progress.xp} XP</span>
            </button>

            <button
              onClick={() => {
                onResetProgress();
                setMobileMenuOpen(false);
              }}
              className="text-rose-400 hover:underline text-xs font-medium"
            >
              Reset
            </button>
          </div>

          {allModulesCompleted && (
            <button
              onClick={() => {
                onOpenCertificate();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Klaim Sertifikat AI Navigator
            </button>
          )}
        </div>
      )}
    </header>
  );
};
