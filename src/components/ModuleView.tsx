import React, { useState } from 'react';
import { CourseModule, UserProgress } from '../types';
import { ModuleOverview } from './ModuleOverview';
import { InteractiveReplicaViewer } from './InteractiveReplicaViewer';
import { PromptingGuideSection } from './PromptingGuideSection';
import { QuizComponent } from './QuizComponent';
import { PersonalNotes } from './PersonalNotes';
import { FocusTimerWidget } from './FocusTimerWidget';
import { ArrowLeft, BookOpen, Monitor, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface ModuleViewProps {
  module: CourseModule;
  progress: UserProgress;
  onBackToPath: () => void;
  onSectionChange: (section: 'overview' | 'replica' | 'prompting' | 'quiz') => void;
  onQuizComplete: (moduleId: number, score: number) => void;
  onNextModule?: () => void;
  onCompleteCheckpoint?: (checkpointId: string, xpBonus: number) => void;
  onAwardFocusXp?: (minutesCompleted: number, xpReward: number) => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  module,
  progress,
  onBackToPath,
  onSectionChange,
  onQuizComplete,
  onNextModule,
  onCompleteCheckpoint,
  onAwardFocusXp,
}) => {
  const activeSection = progress.activeSection || 'overview';
  const isCompleted = progress.completedModules.includes(module.id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-2xl border border-indigo-400 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm p-3.5 sm:p-4 rounded-3xl">
        <button
          onClick={onBackToPath}
          className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-2 border border-slate-200 transition-all cursor-pointer shrink-0 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" /> Kembali <span className="hidden sm:inline">ke Peta Jalan</span>
        </button>

        {/* Section Tabs Stepper */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => onSectionChange('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            1. Pengenalan & Keunggulan
          </button>

          <button
            onClick={() => onSectionChange('replica')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'replica'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            2. Tampilan Interaktif
          </button>

          <button
            onClick={() => onSectionChange('prompting')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'prompting'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            3. Cara Prompting
          </button>

          <button
            onClick={() => onSectionChange('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'quiz'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            4. Kuis Akhir
            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-1" />}
          </button>
        </div>
      </div>

      {/* Focus Timer Pomodoro Widget */}
      <FocusTimerWidget
        moduleTitle={module.title}
        onCompleteFocusBlock={(minutes, xp) => {
          if (onAwardFocusXp) {
            onAwardFocusXp(minutes, xp);
          }
          showToast(`Hebat! Sesi Focus ${minutes} Menit Selesai (+${xp} XP)`);
        }}
      />

      {/* Active Section Content */}
      <div className="animate-fadeIn space-y-6">
        {activeSection === 'overview' && (
          <ModuleOverview
            module={module}
            onAdvanceToReplica={() => onSectionChange('replica')}
            completedCheckpoints={progress.completedCheckpoints}
            onCompleteCheckpoint={onCompleteCheckpoint}
          />
        )}

        {activeSection === 'replica' && (
          <InteractiveReplicaViewer
            module={module}
            onAdvanceToQuiz={() => onSectionChange('prompting')}
            completedCheckpoints={progress.completedCheckpoints}
            onCompleteCheckpoint={onCompleteCheckpoint}
          />
        )}

        {activeSection === 'prompting' && (
          <PromptingGuideSection
            module={module}
            onAdvanceToQuiz={() => onSectionChange('quiz')}
            completedCheckpoints={progress.completedCheckpoints}
            onCompleteCheckpoint={onCompleteCheckpoint}
          />
        )}

        {activeSection === 'quiz' && (
          <QuizComponent
            module={module}
            onQuizComplete={(score) => onQuizComplete(module.id, score)}
            onNextModule={onNextModule}
          />
        )}

        {/* Personal Notes Section for the Current Module */}
        <PersonalNotes module={module} onShowToast={showToast} />
      </div>
    </div>
  );
};
