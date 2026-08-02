import React, { useState } from 'react';
import {
  Sparkles,
  ArrowUp,
  Calendar,
  CheckSquare,
  FolderOpen,
  BarChart3,
  Megaphone,
  Wand2,
  Check,
  AlignLeft,
  Minus,
  Mic,
  Smile,
  Search,
  FileText,
  MessageSquare,
  X,
  RotateCcw,
  Loader2,
  AlertCircle,
  Building2,
  Table,
  Info,
  ChevronRight,
  Send,
  Plus
} from 'lucide-react';

export const NotionAiReplica: React.FC = () => {
  // Global View Selector
  const [activeTab, setActiveTab] = useState<'builder' | 'editor' | 'landing'>('builder');

  // ==========================================
  // BAGIAN 1: MODAL BUILDER STATE
  // ==========================================
  const [builderPrompt, setBuilderPrompt] = useState<string>(
    "Create a database for all marketing team members. Add information like their birthday, which office they're in, and their hobbies."
  );
  const [selectedTaskType, setSelectedTaskType] = useState<string>('default');
  const [builderLoading, setBuilderLoading] = useState<boolean>(false);
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [builderResult, setBuilderResult] = useState<string | null>(null);

  const handleChipClick = (taskName: string, examplePrompt: string) => {
    setSelectedTaskType(taskName);
    setBuilderPrompt(examplePrompt);
    setBuilderError(null);
  };

  const handleBuilderSubmit = async () => {
    if (!builderPrompt.trim()) {
      setBuilderError('Silakan ketik deskripsi halaman atau database yang ingin dibuat.');
      return;
    }
    setBuilderLoading(true);
    setBuilderError(null);

    try {
      const response = await fetch('/api/notion-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'builder',
          prompt: builderPrompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi Notion AI.');
      }

      const data = await response.json();
      setBuilderResult(data.resultText || 'Database berhasil dibuat.');
    } catch (err: any) {
      console.error('Notion AI Builder Error:', err);
      setBuilderError(err.message || 'Terjadi kesalahan saat memproses permintaan.');
    } finally {
      setBuilderLoading(false);
    }
  };

  // ==========================================
  // BAGIAN 2: INLINE AI EDITOR STATE
  // ==========================================
  const [originalText, setOriginalText] = useState<string>(
    "Creating alignment on product teams is essential for successful product development. Everyone on the team must be on the same page and working towards the same goal in order to create a successful product. This blog post will discuss how to create alignment on product teams, including the importance of understanding customer needs, developing a shared vision, and creating an atmosphere of collaboration."
  );
  const [selectedText, setSelectedText] = useState<string>(originalText);
  const [isTextSelected, setIsTextSelected] = useState<boolean>(true);
  const [editorInstruction, setEditorInstruction] = useState<string>('');
  const [aiEditedText, setAiEditedText] = useState<string | null>(null);
  const [editorLoading, setEditorLoading] = useState<boolean>(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [lastInstructionUsed, setLastInstructionUsed] = useState<string>('');

  const handleApplyEditorAi = async (instructionToUse?: string) => {
    const inst = instructionToUse || editorInstruction || 'Improve writing';
    setLastInstructionUsed(inst);
    setEditorLoading(true);
    setEditorError(null);

    try {
      const response = await fetch('/api/notion-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'editor',
          selectedText: selectedText || originalText,
          instruction: inst,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi Notion AI Editor.');
      }

      const data = await response.json();
      setAiEditedText(data.resultText || selectedText);
    } catch (err: any) {
      console.error('Notion AI Editor Error:', err);
      setEditorError(err.message || 'Terjadi kesalahan saat mengedit teks.');
    } finally {
      setEditorLoading(false);
    }
  };

  const handleAcceptEdit = () => {
    if (aiEditedText) {
      setOriginalText(aiEditedText);
      setSelectedText(aiEditedText);
      setAiEditedText(null);
      setIsTextSelected(false);
    }
  };

  const handleRejectEdit = () => {
    setAiEditedText(null);
  };

  // ==========================================
  // BAGIAN 3: FEATURE LANDING PAGE STATE
  // ==========================================
  const [activeFeatureDemo, setActiveFeatureDemo] = useState<'Search' | 'Generate' | 'Analyze' | 'Chat' | null>(null);
  const [featureInput, setFeatureInput] = useState<string>('');
  const [featureMessages, setFeatureMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [featureLoading, setFeatureLoading] = useState<boolean>(false);
  const [showSimulatedAuthModal, setShowSimulatedAuthModal] = useState<boolean>(false);

  const handleOpenFeatureDemo = (feature: 'Search' | 'Generate' | 'Analyze' | 'Chat') => {
    setActiveFeatureDemo(feature);
    setFeatureMessages([
      {
        sender: 'ai',
        text: `Halo! Saya Notion AI - fitur **${feature}**. Silakan ajukan pertanyaan atau berikan instruksi dokumen Anda.`
      }
    ]);
  };

  const handleSendFeatureMessage = async () => {
    if (!featureInput.trim() || !activeFeatureDemo || featureLoading) return;

    const userMsg = featureInput.trim();
    setFeatureInput('');
    setFeatureMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setFeatureLoading(true);

    try {
      const response = await fetch('/api/notion-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'feature_chat',
          feature: activeFeatureDemo,
          prompt: userMsg,
          history: featureMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses fitur Notion AI.');
      }

      const data = await response.json();
      setFeatureMessages(prev => [...prev, { sender: 'ai', text: data.resultText }]);
    } catch (err: any) {
      setFeatureMessages(prev => [
        ...prev,
        { sender: 'ai', text: `❌ Terjadi kesalahan: ${err.message || 'Gagal merespons.'}` }
      ]);
    } finally {
      setFeatureLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fbfbfb] text-slate-800 overflow-hidden shadow-xl flex flex-col min-h-[720px] font-sans select-none">
      {/* ---------------- TOP NAVIGATION BAR & TAB SWITCHER ---------------- */}
      <header className="px-5 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-30 shrink-0">
        <div className="flex items-center gap-2.5 flex-wrap max-w-full">
          <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            🦏
          </div>
          <span className="text-base font-extrabold text-slate-900 tracking-tight">
            Notion AI Simulator
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold uppercase">
            Maxy Academy
          </span>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold flex-wrap max-w-full">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Modal Builder
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Inline AI Editor
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Landing Page
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* BAGIAN 1: MODAL BUILDER ("What do you want to build today?") */}
      {/* ================================================================= */}
      {activeTab === 'builder' && (
        <div className="flex-1 bg-[#4d4d4d]/90 p-6 sm:p-12 flex items-center justify-center relative overflow-y-auto min-h-[600px] min-w-0">
          {/* Simulated Browser Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-9 bg-[#2d2d2d] border-b border-slate-300 dark:border-slate-700 px-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-3 font-semibold text-slate-600 dark:text-slate-300">Acme / Notion AI Workspace</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap max-w-full">
              <span className="text-[11px] hover:text-slate-900 dark:text-white cursor-pointer">Personalize</span>
            </div>
          </div>

          {/* If Result exists, display generated database structure preview */}
          {builderResult ? (
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 flex-wrap max-w-full">
                  <Table className="w-4 h-4 text-blue-600" />
                  <span>Hasil Database / Halaman Notion AI</span>
                </div>
                <button
                  onClick={() => setBuilderResult(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Buat Struktur Lain
                </button>
              </div>

              <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-8 sm:p-12 overflow-y-auto">
                {/* Simulated Notion Page Header */}
                <div className="mb-8 space-y-3">
                  <div className="text-5xl">📄</div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
                    New Database Workspace
                  </h1>
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Table className="w-3.5 h-3.5" /> Table</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Board</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Timeline</span>
                  </div>
                </div>
                
                <div className="prose prose-slate max-w-none text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap text-slate-800">
                  {builderResult}
                </div>
              </div>
            </div>
          ) : (
            /* Modal Card UI matching Image 1 */
            <div className="max-w-2xl w-full bg-[#f8f8f8] rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10 relative space-y-6 animate-in fade-in zoom-in-95 mt-6">
              {/* Top Icons */}
              <div className="flex items-center justify-between">
                <button className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer">
                  ←
                </button>
                <button className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Center Logo Face */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl font-bold font-serif text-slate-800">
                  👃
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  What do you want to build today?
                </h2>
              </div>

              {/* Input Box with Blue Border */}
              <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-4 shadow-xs space-y-3">
                <textarea
                  value={builderPrompt}
                  onChange={(e) => setBuilderPrompt(e.target.value)}
                  placeholder="Describe the database, page, or workflow you want to build..."
                  rows={3}
                  className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
                />

                {/* Submit Arrow Button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleBuilderSubmit}
                    disabled={builderLoading || !builderPrompt.trim()}
                    className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all cursor-pointer disabled:bg-slate-300 shadow-sm"
                    title="Generate with Notion AI"
                  >
                    {builderLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ArrowUp className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Action Chips Stack */}
              <div className="flex flex-col items-center gap-2.5">
                <button
                  onClick={() =>
                    handleChipClick(
                      'Make a plan',
                      'Create a project launch plan for Q3 marketing update with milestones, assignees, and target dates.'
                    )
                  }
                  className={`px-4 py-2 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTaskType === 'Make a plan'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Make a plan</span>
                </button>

                <button
                  onClick={() =>
                    handleChipClick(
                      'Manage tasks',
                      'Create a task management database with columns for Task Name, Assignee, Priority, Due Date, and Status.'
                    )
                  }
                  className={`px-4 py-2 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTaskType === 'Manage tasks'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>Manage tasks</span>
                </button>

                <button
                  onClick={() =>
                    handleChipClick(
                      'Collect feedback',
                      'Create a customer feedback repository with columns for Customer, Rating, Category, Feedback Notes, and Action Item.'
                    )
                  }
                  className={`px-4 py-2 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTaskType === 'Collect feedback'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <FolderOpen className="w-4 h-4 text-amber-600" />
                  <span>Collect feedback</span>
                </button>

                <button
                  onClick={() =>
                    handleChipClick(
                      'Track pipeline',
                      'Create a sales pipeline database with Deal Name, Company, Value, Stage, Contact Person, and Probability.'
                    )
                  }
                  className={`px-4 py-2 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTaskType === 'Track pipeline'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span>Track pipeline</span>
                </button>

                <button
                  onClick={() =>
                    handleChipClick(
                      'Run campaign',
                      'Create a marketing campaign roadmap database with Campaign Name, Channel, Budget, Launch Date, and Expected Leads.'
                    )
                  }
                  className={`px-4 py-2 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTaskType === 'Run campaign'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-rose-600" />
                  <span>Run campaign</span>
                </button>
              </div>

              {/* Error Message */}
              {builderError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 flex-wrap max-w-full">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{builderError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* BAGIAN 2: INLINE AI EDITOR (Doc with Ask AI Popup) */}
      {/* ================================================================= */}
      {activeTab === 'editor' && (
        <div className="flex-1 bg-[#fcfbf9] p-6 sm:p-12 flex justify-center overflow-y-auto min-h-[600px] min-w-0">
          <div className="max-w-3xl w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-md space-y-6 relative">
            {/* Document Header */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Introduction
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium flex-wrap max-w-full">
                <span>By Product Team</span>
                <span>•</span>
                <span>Draft Document</span>
              </div>
            </div>

            {/* Selection Simulation Toggle Control */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">
                Status Seleksi Teks Editor:
              </span>
              <button
                onClick={() => setIsTextSelected(!isTextSelected)}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                  isTextSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isTextSelected ? '✓ Paragraph Selected' : 'Klik untuk Select Paragraf'}
              </button>
            </div>

            {/* Paragraph Body with Highlight Effect */}
            <div className="relative font-serif leading-relaxed text-sm sm:text-base">
              {/* Highlighted text block */}
              <p
                onClick={() => setIsTextSelected(true)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isTextSelected ? 'bg-blue-100/80 text-blue-950 font-medium' : 'text-slate-800'
                }`}
              >
                {originalText}
              </p>

              {/* Floating Popup: Ask AI to edit or generate... */}
              {isTextSelected && (
                <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 max-w-lg w-full space-y-2 animate-in fade-in duration-150 border-blue-200">
                  {/* Custom Instruction Input Bar */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-500 focus-within:bg-white flex-wrap max-w-full">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <input
                      type="text"
                      value={editorInstruction}
                      onChange={(e) => setEditorInstruction(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyEditorAi();
                      }}
                      placeholder="Ask AI to edit or generate..."
                      className="flex-1 bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
                    />
                    <button
                      onClick={() => handleApplyEditorAi()}
                      disabled={editorLoading}
                      className="w-6 h-6 rounded-full bg-slate-200 hover:bg-blue-600 hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                    >
                      {editorLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Dropdown Menu Header */}
                  <div className="pt-2 px-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                      Edit or review selection
                    </span>

                    {/* Menu Options */}
                    <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                      <button
                        onClick={() => handleApplyEditorAi('Improve writing')}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left transition-colors cursor-pointer flex-wrap max-w-full"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>Improve writing</span>
                      </button>

                      <button
                        onClick={() => handleApplyEditorAi('Fix spelling & grammar')}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left transition-colors cursor-pointer flex-wrap max-w-full"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fix spelling & grammar</span>
                      </button>

                      <button
                        onClick={() => handleApplyEditorAi('Make longer')}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left transition-colors cursor-pointer flex-wrap max-w-full"
                      >
                        <AlignLeft className="w-3.5 h-3.5 text-blue-600" />
                        <span>Make longer</span>
                      </button>

                      <button
                        onClick={() => handleApplyEditorAi('Make shorter')}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left transition-colors cursor-pointer flex-wrap max-w-full"
                      >
                        <Minus className="w-3.5 h-3.5 text-amber-600" />
                        <span>Make shorter</span>
                      </button>

                      <button
                        onClick={() => handleApplyEditorAi('Change tone')}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                          <Mic className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Change tone</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </button>

                      <button
                        onClick={() => handleApplyEditorAi('Simplify language')}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left transition-colors cursor-pointer flex-wrap max-w-full"
                      >
                        <Smile className="w-3.5 h-3.5 text-rose-600" />
                        <span>Simplify language</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Edited Preview & Action Box */}
              {aiEditedText && (
                <div className="mt-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 max-w-full overflow-hidden border border-purple-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900 border-b border-purple-100 pb-2">
                    <span className="flex items-center gap-1.5 flex-wrap max-w-full">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Notion AI Edit Result ({lastInstructionUsed})
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-purple-950 leading-relaxed font-sans font-medium">
                    {aiEditedText}
                  </p>

                  {/* Accept / Reject / Try again buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 max-w-full">
                    <button
                      onClick={handleAcceptEdit}
                      className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors flex-wrap max-w-full"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={handleRejectEdit}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-purple-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors flex-wrap max-w-full"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApplyEditorAi(lastInstructionUsed)}
                      disabled={editorLoading}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-purple-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors flex-wrap max-w-full"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try again</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {editorError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 flex-wrap max-w-full">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{editorError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* BAGIAN 3: FEATURE LANDING PAGE ("Meet the new Notion AI") */}
      {/* ================================================================= */}
      {activeTab === 'landing' && (
        <div className="flex-1 bg-[#fbfbfb] p-6 sm:p-12 flex flex-col items-center justify-center overflow-y-auto">
          <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-10 relative">
            {/* Top Landing Content & Illustration */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column Text */}
              <div className="md:col-span-7 space-y-6">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Meet the new Notion AI
                </h1>

                <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed max-w-md">
                  One tool that does it all. Search, generate, analyze, and chat—right inside Notion.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowSimulatedAuthModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Get Notion free
                  </button>

                  <button
                    onClick={() => setShowSimulatedAuthModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-600 text-xs font-bold transition-all cursor-pointer"
                  >
                    Request a demo
                  </button>
                </div>

                {/* Trusted Logos Bar */}
                <div className="pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Trusted by teams at
                  </span>
                  <div className="flex items-center gap-6 text-slate-700 font-extrabold text-xs">
                    <div className="flex items-center gap-1 flex-wrap max-w-full">
                      <Building2 className="w-4 h-4 text-slate-800" />
                      <span>TOYOTA</span>
                    </div>
                    <span>Discord</span>
                    <span>1Password</span>
                  </div>
                </div>
              </div>

              {/* Right Column Illustration */}
              <div className="md:col-span-5 flex justify-center">
                <div className="w-56 h-56 rounded-3xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                  <div className="w-16 h-16 rounded-full bg-white border border-slate-300 flex items-center justify-center text-3xl shadow-xs">
                    👃
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-900 block">Notion AI Engine</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Built in Workspace</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Interactive Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              {/* Card 1: Search */}
              <div
                onClick={() => handleOpenFeatureDemo('Search')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  activeFeatureDemo === 'Search'
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs">
                  <Search className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900">Search</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Find answers from Notion, Slack, Google Drive & more
                  </p>
                </div>
              </div>

              {/* Card 2: Generate */}
              <div
                onClick={() => handleOpenFeatureDemo('Generate')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  activeFeatureDemo === 'Generate'
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900">Generate</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Create & edit docs in your own style
                  </p>
                </div>
              </div>

              {/* Card 3: Analyze */}
              <div
                onClick={() => handleOpenFeatureDemo('Analyze')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  activeFeatureDemo === 'Analyze'
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-xs">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900">Analyze</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Get insights from PDFs & images
                  </p>
                </div>
              </div>

              {/* Card 4: Chat */}
              <div
                onClick={() => handleOpenFeatureDemo('Chat')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  activeFeatureDemo === 'Chat'
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900">Chat</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Access knowledge from GPT-4 & Claude
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Feature Demo Chat Drawer */}
            {activeFeatureDemo && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <span className="text-xs font-extrabold text-slate-900">
                      Demo Interactive Fitur: Notion AI ({activeFeatureDemo})
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveFeatureDemo(null)}
                    className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages Container */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {featureMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl text-xs font-medium max-w-xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {featureLoading && (
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs font-medium flex items-center gap-2 flex-wrap max-w-full">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>Notion AI sedang mencari jawaban...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input Bar */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex-wrap max-w-full">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendFeatureMessage();
                    }}
                    placeholder={`Tanyakan sesuatu ke Notion AI (${activeFeatureDemo})...`}
                    className="flex-1 bg-transparent text-xs font-medium text-slate-800 focus:outline-none px-2 min-w-0"
                  />
                  <button
                    onClick={handleSendFeatureMessage}
                    disabled={featureLoading || !featureInput.trim()}
                    className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:bg-slate-200 cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- MODAL SIMULASI MAXY ACADEMY ---------------- */}
      {showSimulatedAuthModal && (
        <div className="fixed inset-0 bg-slate-100 dark:bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
              🦏
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">Simulasi Pembelajaran</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Ini adalah simulasi pembelajaran Maxy Academy, tidak terhubung ke akun Notion asli.
              </p>
            </div>
            <button
              onClick={() => setShowSimulatedAuthModal(false)}
              className="w-full py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-extrabold transition-all cursor-pointer"
            >
              Mengerti & Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotionAiReplica;
export const NotionReplica = NotionAiReplica;
