import React, { useState } from 'react';
import { Sparkles, Award, Flame, Menu, X, Compass, Trophy, StickyNote, Lock, Crown, ShieldCheck, LogOut, Save, Download, Upload, FileText, RotateCcw } from 'lucide-react';
import { UserProgress } from '../types';
import { getUserLevelInfo } from '../lib/gamification';
import { Tooltip } from './Tooltip';
import { ConfirmModal } from './ConfirmModal';

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
  onLogout: () => void;
  onOpenCertificate: () => void;
  onOpenStreakModal: () => void;
  onOpenAchievements?: () => void;
  onOpenNotes?: () => void;
  onOpenUpgradeModal?: () => void;
  onOpenCapstoneModal?: () => void;
  onOpenInvoice?: () => void;
  onOpenUserProfile?: () => void;
  allModulesCompleted: boolean;
  onManualSave: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  progress,
  theme,
  onToggleTheme,
  onUpdateGoal,
  onAddMinutes,
  onSelectTab,
  activeTab,
  onLogout,
  onOpenCertificate,
  onOpenStreakModal,
  onOpenAchievements,
  onOpenNotes,
  onOpenUpgradeModal,
  onOpenInvoice,
  onOpenUserProfile,
  allModulesCompleted,
  onManualSave,
  onExportJSON,
  onImportJSON,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const levelInfo = getUserLevelInfo(progress.xp);
  const userTier = progress.userTier || 'free';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b bg-white/95 border-slate-200 text-slate-900 shadow-xs transition-colors duration-200">
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
              <div className="flex items-center whitespace-nowrap">
                <span className="font-black text-base text-slate-900 tracking-tight">
                  AI Navigator
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                Maxy Academy
              </span>
            </div>
          </div>

          {/* 2. CENTER NAVIGATION (Segmented Pill Bar) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl border bg-slate-100/90 border-slate-200 shrink-0">
            <button
              onClick={() => onSelectTab('path')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'path'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Peta Belajar</span>
            </button>

            {onOpenNotes && (
              <button
                onClick={onOpenNotes}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer whitespace-nowrap"
              >
                <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                <span>Catatan</span>
              </button>
            )}

            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer whitespace-nowrap"
              >
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Pencapaian</span>
              </button>
            )}
          </nav>

          {/* 3. RIGHT SECTION (Grouped User Stats & Utilities) */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-2.5 shrink-0 pr-1">
            {/* Streak & Level Stats Pill */}
            <Tooltip
              content={
                <div className="space-y-1 text-left min-w-[180px]">
                  <div className="font-bold text-amber-400 text-xs flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Status Belajar Anda
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Lvl {levelInfo.level} ({levelInfo.title}) • {progress.xp} XP • {progress.streakDays} Hari Streak
                  </p>
                  <p className="text-[10px] text-slate-400">Klik untuk melihat detail pencapaian &amp; level.</p>
                </div>
              }
            >
              <div
                onClick={onOpenStreakModal}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                {/* Streak */}
                <div className="flex items-center gap-1 text-amber-600 font-extrabold whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5 fill-amber-500/20 text-amber-500" />
                  <span>{progress.streakDays}d</span>
                </div>

                <div className="h-3.5 w-px bg-slate-200" />

                {/* Level & XP */}
                <div className="flex items-center gap-1 text-indigo-600 font-extrabold whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lvl {levelInfo.level} • {progress.xp}XP</span>
                </div>
              </div>
            </Tooltip>

            {/* Tier Access Badge (Elegant Luxury Style) */}
            <Tooltip
              content={
                <div className="space-y-1.5 text-left min-w-[200px]">
                  <div className="font-bold text-amber-400 text-xs flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" /> Status Akses Paket
                  </div>
                  {progress.userName && (
                    <p className="text-[11px] text-slate-900 font-semibold">{progress.userName}</p>
                  )}
                  {progress.userEmail && (
                    <p className="text-[10px] text-slate-500">{progress.userEmail}</p>
                  )}
                  <div className="border-t border-slate-200 pt-1 mt-1">
                    <p className="text-[11px] text-slate-700 font-medium">
                      📦 {(!progress.packageName || progress.packageName.trim().startsWith('{')) ? (userTier === 'free' ? 'Free Plan' : userTier === 'tier1' ? 'Tier 1 Plan' : 'Tier 2 VIP') : progress.packageName}
                    </p>
                    {progress.subscriptionExpiredAt ? (
                      <p className="text-[10px] text-emerald-600 mt-0.5 font-bold">
                        ✅ Aktif s/d {new Date(progress.subscriptionExpiredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    ) : userTier !== 'free' ? (
                      <p className="text-[10px] text-emerald-600 mt-0.5 font-bold">✅ Akses Aktif</p>
                    ) : (
                      <p className="text-[10px] text-amber-600 mt-0.5 font-bold">⚡ Free Trial (Modul 1-3)</p>
                    )}
                  </div>
                </div>
              }
            >
              {userTier === 'free' ? (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 font-bold text-xs transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Free Trial • Upgrade</span>
                </button>
              ) : userTier === 'tier1' ? (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Tier 1 Pro</span>
                </button>
              ) : (
                <button
                  onClick={onOpenUpgradeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20 shrink-0" />
                  <span>Tier 2 VIP</span>
                </button>
              )}
            </Tooltip>

            {/* Certificate Button (Always Accessible -> Scrolls to Certificate Section) */}
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title="Lihat Bagian Sertifikasi & Kelulusan"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sertifikat</span>
            </button>

            {/* User Profile Pill */}
            {progress.userName && (
              <Tooltip
                content={
                  <div className="space-y-1 text-left min-w-[180px]">
                    <div className="font-bold text-slate-900 text-xs">{progress.userName}</div>
                    {progress.userEmail && (
                      <p className="text-[10px] text-slate-600">{progress.userEmail}</p>
                    )}
                    {progress.userPhone && (
                      <p className="text-[10px] text-slate-400">📞 {progress.userPhone}</p>
                    )}
                    {progress.userInstitution && (
                      <p className="text-[10px] text-slate-400">🏢 {progress.userInstitution}</p>
                    )}
                    <p className="text-[10px] text-indigo-600 font-semibold pt-1 border-t border-slate-200">
                      ✏️ Klik untuk Edit Profil
                    </p>
                  </div>
                }
              >
                <button
                  onClick={onOpenUserProfile}
                  className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-xs cursor-pointer hover:border-slate-300"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 uppercase shadow-xs">
                    {progress.userName.charAt(0)}
                  </div>
                  <span className="truncate max-w-[100px]">{progress.userName}</span>
                </button>
              </Tooltip>
            )}

            {/* Hidden file input for Import JSON */}
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={onImportJSON}
              className="hidden"
            />

            {/* ACTION BUTTONS GROUP (Invoice, Reset, Logout) */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl border bg-slate-100 border-slate-200">
              {/* Invoice Receipt Button */}
              {onOpenInvoice && userTier !== 'free' && (
                <Tooltip content={<div className="font-bold text-xs text-slate-800">Invoice Pembayaran</div>}>
                  <button
                    onClick={onOpenInvoice}
                    aria-label="Invoice"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}

              {/* Icon Button: Reset Progress */}
              <Tooltip
                content={
                  <div className="space-y-0.5 text-center">
                    <div className="font-bold text-xs text-amber-500">Reset Progress</div>
                    <p className="text-[10px] text-slate-500">Hapus semua data (Dev Only)</p>
                  </div>
                }
              >
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  aria-label="Reset Progress"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <ConfirmModal
                  isOpen={isResetModalOpen}
                  title="Reset Progress"
                  message="Yakin ingin mereset seluruh progress simulasi?"
                  onConfirm={() => {
                    localStorage.clear();
                    window.location.reload();
                    setIsResetModalOpen(false);
                  }}
                  onCancel={() => setIsResetModalOpen(false)}
                />
              </Tooltip>

              {/* Icon Button: Logout */}
              <Tooltip
                content={
                  <div className="space-y-0.5 text-center">
                    <div className="font-bold text-xs text-rose-500">Keluar</div>
                    <p className="text-[10px] text-slate-500">Logout dari AI Navigator</p>
                  </div>
                }
              >
                <button
                  onClick={onLogout}
                  aria-label="Logout"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl border shrink-0 ${
              theme === 'light'
                ? 'bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-3 ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-900 shadow-xl' : 'bg-[#0d1322] border-slate-800 text-white shadow-xl'
        }`}>
          {progress.userName && (
            <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
              theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
            }`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-xs font-black text-white shrink-0 uppercase">
                {progress.userName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold truncate">{progress.userName}</span>
                {progress.userEmail && (
                  <span className={`text-[10px] truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{progress.userEmail}</span>
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
              className="p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-indigo-600 text-white shadow-md"
            >
              <Compass className="w-4 h-4 shrink-0" />
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
                <StickyNote className="w-4 h-4 text-amber-500 shrink-0" />
                Catatan Saya
              </button>
            )}

            {onOpenAchievements && (
              <button
                onClick={() => {
                  onOpenAchievements();
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border col-span-2 sm:col-span-1 ${
                  theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <Award className="w-4 h-4 text-purple-500 shrink-0" />
                Pencapaian
              </button>
            )}
          </div>

          <div 
            onClick={() => {
              if (onOpenStreakModal) onOpenStreakModal();
              setMobileMenuOpen(false);
            }}
            className={`flex flex-col gap-3 p-3 rounded-2xl border cursor-pointer hover:scale-[1.01] transition-transform ${
            theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold">
                <Flame className="w-4 h-4 fill-amber-500/20" />
                <span className="text-xs">{progress.streakDays} Hari Streak</span>
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300 font-extrabold">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Lvl {levelInfo.level} • {progress.xp} XP</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
                onClick={() => setIsResetModalOpen(true)}
                className={`p-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border ${
                  theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-amber-500" />
                Reset Progress
              </button>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border ${
                theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              }`}
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              Logout
            </button>
          </div>

          {userTier === 'free' ? (
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
          ) : userTier === 'tier1' ? (
            <button
              onClick={() => {
                if (onOpenUpgradeModal) onOpenUpgradeModal();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <ShieldCheck className="w-4 h-4" />
              Tier 1 Full
            </button>
          ) : (
            <button
              onClick={() => {
                if (onOpenUpgradeModal) onOpenUpgradeModal();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              Tier 2 VIP
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export const Header = React.memo(HeaderComponent);
