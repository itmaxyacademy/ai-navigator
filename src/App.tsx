import React, { useState, useEffect } from 'react';
import { MODULES_DATA } from './data/modulesData';
import { UserProgress } from './types';
import { Header } from './components/Header';
import { LearningPathRoadmap } from './components/LearningPathRoadmap';
import { ModuleView } from './components/ModuleView';
import { CertificateModal } from './components/CertificateModal';
import { Compass, Heart } from 'lucide-react';

const STORAGE_KEY = 'ai_navigator_user_progress_v1';

const defaultProgress: UserProgress = {
  completedModules: [],
  moduleScores: {},
  currentModuleId: 1,
  activeSection: 'overview',
  xp: 0,
  streakDays: 1,
  unlockedBadges: [],
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }
    return defaultProgress;
  });

  const [activeTab, setActiveTab] = useState<'path' | 'module'>('path');
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [certificateOpen, setCertificateOpen] = useState(false);

  // Save progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }, [progress]);

  // Handle module selection from roadmap
  const handleSelectModule = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setProgress((prev) => ({
      ...prev,
      currentModuleId: moduleId,
      activeSection: 'overview',
    }));
    setActiveTab('module');
  };

  // Handle section switching inside a module (overview, replica, prompting, quiz)
  const handleSectionChange = (section: 'overview' | 'replica' | 'prompting' | 'quiz') => {
    setProgress((prev) => ({
      ...prev,
      activeSection: section,
    }));
  };

  // Handle quiz completion
  const handleQuizComplete = (moduleId: number, score: number) => {
    const isAlreadyCompleted = progress.completedModules.includes(moduleId);
    const addedXp = isAlreadyCompleted ? 20 : 100;

    setProgress((prev) => {
      const newCompleted = isAlreadyCompleted
        ? prev.completedModules
        : [...prev.completedModules, moduleId];

      return {
        ...prev,
        completedModules: newCompleted,
        moduleScores: {
          ...prev.moduleScores,
          [moduleId]: Math.max(prev.moduleScores[moduleId] || 0, score),
        },
        xp: prev.xp + addedXp,
      };
    });
  };

  // Advance to next module from quiz
  const handleNextModule = () => {
    if (!selectedModuleId) return;
    if (selectedModuleId < MODULES_DATA.length) {
      const nextId = selectedModuleId + 1;
      setSelectedModuleId(nextId);
      setProgress((prev) => ({
        ...prev,
        currentModuleId: nextId,
        activeSection: 'overview',
      }));
    } else {
      // Completed all modules!
      setActiveTab('path');
      setCertificateOpen(true);
    }
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh progres belajar?')) {
      setProgress(defaultProgress);
      setSelectedModuleId(null);
      setActiveTab('path');
    }
  };

  const currentModule = MODULES_DATA.find((m) => m.id === selectedModuleId);
  const allModulesCompleted = progress.completedModules.length === MODULES_DATA.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        progress={progress}
        activeTab={activeTab === 'module' ? 'path' : activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'path') {
            setSelectedModuleId(null);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetProgress={handleResetProgress}
        onOpenCertificate={() => setCertificateOpen(true)}
        allModulesCompleted={allModulesCompleted}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'path' && (
          <LearningPathRoadmap
            modules={MODULES_DATA}
            progress={progress}
            onSelectModule={handleSelectModule}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeTab === 'module' && currentModule && (
          <ModuleView
            module={currentModule}
            progress={progress}
            onBackToPath={() => {
              setActiveTab('path');
              setSelectedModuleId(null);
            }}
            onSectionChange={handleSectionChange}
            onQuizComplete={handleQuizComplete}
            onNextModule={handleNextModule}
          />
        )}
      </main>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
        progress={progress}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-200">AI Navigator</span>
            <span>— Platform Pembelajaran LLM Interaktif untuk Pemula</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Pembelajar AI Indonesia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
