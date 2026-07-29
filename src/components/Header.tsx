import React, { useState } from 'react';
import { Sparkles, Award, Flame, Search, BookOpen, Layers, RotateCcw, Menu, X, Compass, CheckCircle2, Calendar, Trophy, Zap, Target } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress: UserProgress;
  onSelectTab: (tab: 'path') => void;
  activeTab: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetProgress: () => void;
  onOpenCertificate: () => void;
  allModulesCompleted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onSelectTab,
  activeTab,
  searchQuery,
  onSearchChange,
  onResetProgress,
  onOpenCertificate,
  allModulesCompleted,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onSelectTab('path')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  AI Navigator
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Pemula
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Panduan Interaktif Pengenalan LLM</p>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTab('path')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Compass className="w-4 h-4 text-indigo-200" />
              Peta Belajar (Digital Map Journey)
            </button>
          </nav>

          {/* User Stats & Badges */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak Button */}
            <button
              onClick={() => setShowStreakModal(true)}
              title="Lihat Aturan Daily Streak"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-pulse" />
              <span>{progress.streakDays} Hari Streak</span>
            </button>

            {/* XP */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{progress.xp} XP</span>
            </div>

            {/* Certificate Button */}
            {allModulesCompleted && (
              <button
                onClick={onOpenCertificate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
              >
                <Award className="w-4 h-4" />
                Sertifikat
              </button>
            )}

            {/* Reset */}
            <button
              onClick={onResetProgress}
              title="Reset Progres Belajar"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
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

          {/* Mobile Stats */}
          <div className="flex items-center justify-between text-xs py-2 bg-slate-950 px-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-slate-300">Streak: {progress.streakDays} Hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-300">XP: {progress.xp}</span>
            </div>
            <button
              onClick={() => {
                onResetProgress();
                setMobileMenuOpen(false);
              }}
              className="text-rose-400 hover:underline text-xs"
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

      {/* Gamification & Daily Streak Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowStreakModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Flame className="w-7 h-7 text-amber-500 fill-amber-500 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Daily Streak & Gamifikasi
                </h3>
                <p className="text-xs text-amber-400 font-semibold">
                  🔥 Streak Aktif: {progress.streakDays} Hari Berturut-turut
                </p>
              </div>
            </div>

            {/* Content Rules */}
            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Logika & Aturan Daily Streak
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed">
                  <li>Selesaikan minimal <strong>1 Kuis / Modul</strong> setiap hari sebelum pukul 24:00.</li>
                  <li>Streak bertambah <strong>+1 Hari</strong> setiap kali Anda belajar di hari berturut-turut.</li>
                  <li>Jika Anda tidak aktif selama 1 hari penuh, api streak akan <strong>terputus (reset ke 1)</strong>.</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" /> Perhitungan XP & Reward
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>Modul Baru</span>
                    <span className="font-bold text-emerald-400">+100 XP</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>Ulang Modul</span>
                    <span className="font-bold text-indigo-400">+20 XP</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>Peti Mid-Journey</span>
                    <span className="font-bold text-amber-400">+200 XP</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>Sertifikat Akhir</span>
                    <span className="font-bold text-purple-400">+500 XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Action */}
            <button
              onClick={() => setShowStreakModal(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-indigo-600 font-bold text-xs text-white rounded-xl shadow-lg hover:brightness-110 transition-all"
            >
              Mengerti & Lanjutkan Belajar!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
