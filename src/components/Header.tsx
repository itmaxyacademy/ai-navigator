import React, { useState } from 'react';
import { Sparkles, Award, Flame, Search, BookOpen, Layers, RotateCcw, Menu, X, Compass } from 'lucide-react';
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
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-amber-400">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span>{progress.streakDays} Hari</span>
            </div>

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
    </header>
  );
};
