import React from 'react';
import { CourseModule, UserProgress } from '../types';
import { ModuleOverview } from './ModuleOverview';
import { InteractiveReplicaViewer } from './InteractiveReplicaViewer';
import { PromptingGuideSection } from './PromptingGuideSection';
import { QuizComponent } from './QuizComponent';
import { ArrowLeft, BookOpen, Monitor, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface ModuleViewProps {
  module: CourseModule;
  progress: UserProgress;
  onBackToPath: () => void;
  onSectionChange: (section: 'overview' | 'replica' | 'prompting' | 'quiz') => void;
  onQuizComplete: (moduleId: number, score: number) => void;
  onNextModule?: () => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  module,
  progress,
  onBackToPath,
  onSectionChange,
  onQuizComplete,
  onNextModule,
}) => {
  const activeSection = progress.activeSection || 'overview';
  const isCompleted = progress.completedModules.includes(module.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={onBackToPath}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Peta Jalan
        </button>

        {/* Section Tabs Stepper */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => onSectionChange('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            1. Pengenalan & Keunggulan
          </button>

          <button
            onClick={() => onSectionChange('replica')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'replica'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            2. Tampilan Interaktif
          </button>

          <button
            onClick={() => onSectionChange('prompting')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'prompting'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            3. Cara Prompting
          </button>

          <button
            onClick={() => onSectionChange('quiz')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'quiz'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            4. Kuis Akhir
            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
          </button>
        </div>
      </div>

      {/* Active Section Content */}
      <div className="animate-fadeIn">
        {activeSection === 'overview' && (
          <ModuleOverview
            module={module}
            onAdvanceToReplica={() => onSectionChange('replica')}
          />
        )}

        {activeSection === 'replica' && (
          <InteractiveReplicaViewer
            module={module}
            onAdvanceToQuiz={() => onSectionChange('prompting')}
          />
        )}

        {activeSection === 'prompting' && (
          <PromptingGuideSection
            module={module}
            onAdvanceToQuiz={() => onSectionChange('quiz')}
          />
        )}

        {activeSection === 'quiz' && (
          <QuizComponent
            module={module}
            onQuizComplete={(score) => onQuizComplete(module.id, score)}
            onNextModule={onNextModule}
          />
        )}
      </div>
    </div>
  );
};
