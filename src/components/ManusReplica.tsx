import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Plus, ArrowUp, Layout, Globe, Palette, Gamepad2, ChevronDown,
  ArrowLeft, CheckCircle2, Circle, Loader2, FileText, AlertCircle, X,
  Terminal, Code2, Copy, Check, Info, FileSpreadsheet, FileCode, Sliders,
  RefreshCw, Play, Share2, Download
} from 'lucide-react';

interface ExecutionStep {
  id: number;
  text: string;
  status: 'pending' | 'in_progress' | 'completed';
  timestamp?: string;
}

interface TaskItem {
  id: string;
  prompt: string;
  taskType: string;
  attachedFile?: string | null;
  steps: ExecutionStep[];
  resultText: string;
  createdAt: string;
}

export const ManusReplica: React.FC = () => {
  // State Management
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [taskInput, setTaskInput] = useState<string>('');
  const [taskType, setTaskType] = useState<string>('default');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Execution & Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionStep[]>([]);
  const [activeResultText, setActiveResultText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History State
  const [taskHistory, setTaskHistory] = useState<TaskItem[]>([]);
  const [followUpInput, setFollowUpInput] = useState<string>('');

  // UI Interactive Toggle States
  const [showMoreDropdown, setShowMoreDropdown] = useState<boolean>(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showMetaBannerModal, setShowMetaBannerModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'workspace') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [executionLogs, isLoading, view]);

  // Handle Quick Action Chip Clicks
  const handleSelectChip = (category: string, promptTemplate: string) => {
    setTaskType(category);
    setTaskInput(promptTemplate);
    setShowMoreDropdown(false);
    setErrorMessage(null);
  };

  // Handle Task Submission
  const handleSendTask = async (promptOverride?: string) => {
    const targetPrompt = promptOverride || taskInput;

    if (!targetPrompt || !targetPrompt.trim()) {
      setErrorMessage('Silakan isi tugas atau pertanyaan terlebih dahulu.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const initialSteps: ExecutionStep[] = [
      { id: 1, text: '🔍 Menganalisis permintaan & mengidentifikasi konteks...', status: 'in_progress', timestamp: '00:01' },
      { id: 2, text: '🧠 Menyusun rencana eksekusi otonom bertahap...', status: 'pending' },
      { id: 3, text: `⚡ Mengeksekusi modul [${taskType === 'default' ? 'Otonom' : taskType}]...`, status: 'pending' },
      { id: 4, text: '✨ Memverifikasi kelengkapan dan format hasil...', status: 'pending' },
      { id: 5, text: '✅ Task selesai dieksekusi oleh Manus Agent.', status: 'pending' },
    ];

    setExecutionLogs(initialSteps);
    setActiveResultText('');
    setView('workspace');

    // Timer animations for progressive logs
    const t1 = setTimeout(() => {
      setExecutionLogs((prev) =>
        prev.map((s) =>
          s.id === 1 ? { ...s, status: 'completed' } : s.id === 2 ? { ...s, status: 'in_progress', timestamp: '00:02' } : s
        )
      );
    }, 1200);

    const t2 = setTimeout(() => {
      setExecutionLogs((prev) =>
        prev.map((s) =>
          s.id === 2 ? { ...s, status: 'completed' } : s.id === 3 ? { ...s, status: 'in_progress', timestamp: '00:03' } : s
        )
      );
    }, 2400);

    const t3 = setTimeout(() => {
      setExecutionLogs((prev) =>
        prev.map((s) =>
          s.id === 3 ? { ...s, status: 'completed' } : s.id === 4 ? { ...s, status: 'in_progress', timestamp: '00:04' } : s
        )
      );
    }, 3600);

    try {
      const response = await fetch('/api/manus-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: targetPrompt.trim(),
          taskType,
          fileName: attachedFile,
          history: taskHistory.map((t) => ({ sender: 'user', text: t.prompt })),
        }),
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal menghubungi Manus Agent.');
      }

      const data = await response.json();

      setExecutionLogs((prev) =>
        prev.map((s) => ({ ...s, status: 'completed' }))
      );

      setActiveResultText(data.resultText || 'Tugas telah selesai diproses oleh Manus Agent.');

      const newTaskItem: TaskItem = {
        id: `task-${Date.now()}`,
        prompt: targetPrompt.trim(),
        taskType,
        attachedFile,
        steps: initialSteps.map((s) => ({ ...s, status: 'completed' })),
        resultText: data.resultText || '',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTaskHistory((prev) => [newTaskItem, ...prev]);
    } catch (err: any) {
      console.error('Manus error:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses tugas.');
      setExecutionLogs((prev) =>
        prev.map((s) => (s.status === 'in_progress' ? { ...s, status: 'pending', text: `❌ ${s.text}` } : s))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Follow-up inside Workspace
  const handleFollowUpSubmit = () => {
    if (!followUpInput.trim() || isLoading) return;
    const inputCopy = followUpInput.trim();
    setFollowUpInput('');
    handleSendTask(inputCopy);
  };

  // Copy Result Text
  const handleCopyResult = () => {
    if (!activeResultText) return;
    navigator.clipboard.writeText(activeResultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Attach Simulated File
  const handleAttachSimulatedFile = (fileName: string) => {
    setAttachedFile(fileName);
    setShowAttachmentModal(false);
  };

  // Reset to Landing
  const handleResetToLanding = () => {
    setView('landing');
    setTaskInput('');
    setTaskType('default');
    setErrorMessage(null);
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-[#fbfbfb] text-slate-800 overflow-hidden shadow-xl flex flex-col min-h-[750px] font-sans select-none">
      {/* ---------------- NAVBAR HEADER ---------------- */}
      <header className="px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between z-30 shrink-0">
        {/* Logo */}
        <div onClick={handleResetToLanding} className="flex items-center gap-2 cursor-pointer group flex-wrap max-w-full">
          <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            ✋
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            manus
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <button onClick={() => setShowMetaBannerModal(true)} className="hover:text-slate-900 transition-colors cursor-pointer">Features</button>
          <button onClick={() => setShowMetaBannerModal(true)} className="hover:text-slate-900 transition-colors cursor-pointer">Solutions</button>
          <button onClick={() => setShowMetaBannerModal(true)} className="hover:text-slate-900 transition-colors cursor-pointer">Resources</button>
          <button onClick={() => setShowMetaBannerModal(true)} className="hover:text-slate-900 transition-colors cursor-pointer">Events</button>
          <button onClick={() => setShowMetaBannerModal(true)} className="hover:text-slate-900 transition-colors cursor-pointer">Team</button>
          <button onClick={() => setShowMetaBannerModal(true)} className="hover:text-slate-900 transition-colors cursor-pointer">Pricing</button>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 flex-wrap max-w-full">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* ---------------- VIEW 1: LANDING PAGE ---------------- */}
      {view === 'landing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-[#fafafa]">
          {/* Top Announcement Banner */}
          <div className="mb-12">
            <button
              onClick={() => setShowMetaBannerModal(true)}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 text-xs font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer group flex-wrap max-w-full"
            >
              <span>Manus is now part of Meta — bringing AI to businesses worldwide</span>
              <span className="text-slate-500 dark:text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-5xl font-serif text-slate-800 tracking-tight font-normal">
              What can I do for you?
            </h1>
          </div>

          {/* Input Box Container */}
          <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-4 space-y-3 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
            <textarea
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendTask();
                }
              }}
              placeholder="Assign a task or ask anything"
              rows={3}
              className="w-full bg-transparent text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
            />

            {/* Attached File Chip */}
            {attachedFile && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex-wrap max-w-full">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>{attachedFile}</span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {/* Left Plus Button */}
              <button
                onClick={() => setShowAttachmentModal(true)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Attach file or context"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Right Submit Button */}
              <button
                onClick={() => handleSendTask()}
                disabled={!taskInput.trim() || isLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  taskInput.trim()
                    ? 'bg-white dark:bg-slate-900 text-white hover:bg-slate-100 dark:bg-slate-800 shadow-md'
                    : 'bg-slate-100 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Row */}
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl">
            <button
              onClick={() => handleSelectChip('Create slides', 'Buatkan slide presentasi tentang strategi pemasaran digital AI 2026')}
              className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                taskType === 'Create slides'
                  ? 'bg-white dark:bg-slate-900 text-white border-slate-200 dark:border-slate-900 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Create slides</span>
            </button>

            <button
              onClick={() => handleSelectChip('Build website', 'Buatkan aplikasi web landing page interaktif untuk startup AI')}
              className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                taskType === 'Build website'
                  ? 'bg-white dark:bg-slate-900 text-white border-slate-200 dark:border-slate-900 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Build website</span>
            </button>

            <button
              onClick={() => handleSelectChip('Design', 'Buatkan konsep desain UI/UX, skema warna HSL, dan panduan tipografi modern')}
              className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                taskType === 'Design'
                  ? 'bg-white dark:bg-slate-900 text-white border-slate-200 dark:border-slate-900 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design</span>
            </button>

            <button
              onClick={() => handleSelectChip('Create games', 'Buatkan game web HTML5 Canvas sederhana kontrol keyboard player')}
              className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                taskType === 'Create games'
                  ? 'bg-white dark:bg-slate-900 text-white border-slate-200 dark:border-slate-900 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Create games</span>
            </button>

            {/* More Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer flex-wrap max-w-full"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>

              {/* More Dropdown Menu */}
              {showMoreDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-40 text-left animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => handleSelectChip('Analyze data', 'Analisis data eksekutif berikut dan sajikan wawasan kunci')}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left flex items-center gap-2 flex-wrap max-w-full"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
                    <span>Analyze data</span>
                  </button>
                  <button
                    onClick={() => handleSelectChip('Write report', 'Susun laporan komprehensif berstruktur tentang perkembangan proyek')}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left flex items-center gap-2 flex-wrap max-w-full"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-500" />
                    <span>Write report</span>
                  </button>
                  <button
                    onClick={() => handleSelectChip('Automate workflow', 'Rancang alur kerja otomatisasi bertahap untuk tim engineering')}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left flex items-center gap-2 flex-wrap max-w-full"
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Automate workflow</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mt-6 max-w-md w-full p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap max-w-full">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="p-1 hover:text-rose-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- VIEW 2: AUTONOMOUS AGENT WORKSPACE ---------------- */}
      {view === 'workspace' && (
        <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">
          {/* Workspace Sub-Header */}
          <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 flex-wrap max-w-full">
              <button
                onClick={handleResetToLanding}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors flex-wrap max-w-full"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
              <div className="flex items-center gap-2 flex-wrap max-w-full">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                  {taskType}
                </span>
                <span className="text-xs font-extrabold text-slate-800 break-words whitespace-normal leading-snug max-w-md">
                  {taskInput}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                isLoading
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                <span>{isLoading ? 'Executing...' : 'Completed'}</span>
              </span>
            </div>
          </div>

          {/* 2-Column Split Workspace */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden min-w-0">
            {/* Left Panel: Execution Steps Log (4 cols) */}
            <div className="lg:col-span-4 border-r border-slate-200 bg-white p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 flex-wrap max-w-full">
                  <Terminal className="w-4 h-4 text-purple-600" />
                  <span>Log Langkah Eksekusi</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Manus Engine v2</span>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {executionLogs.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                      step.status === 'completed'
                        ? 'bg-slate-50 border-slate-200 text-slate-800 font-medium'
                        : step.status === 'in_progress'
                        ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold shadow-xs'
                        : 'bg-slate-50/50 border-slate-100 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : step.status === 'in_progress' ? (
                        <Loader2 className="w-4 h-4 text-purple-600 animate-spin shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <p>{step.text}</p>
                        {step.timestamp && (
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">{step.timestamp}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Right Panel: Workspace Result & Output Canvas (8 cols) */}
            <div className="lg:col-span-8 bg-[#f8fafc] p-6 flex flex-col min-h-0 overflow-hidden">
              {/* Output Header Bar */}
              <div className="bg-white border border-slate-200 rounded-t-2xl px-5 py-3 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 flex-wrap max-w-full">
                  <Code2 className="w-4 h-4 text-slate-500" />
                  <span>Hasil Eksekusi Agent</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <button
                    onClick={handleCopyResult}
                    disabled={!activeResultText}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 flex-wrap max-w-full"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tercopy' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Output Content Body */}
              <div className="flex-1 bg-white border-x border-b border-slate-200 rounded-b-2xl p-6 overflow-y-auto space-y-4 shadow-sm min-w-0">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 text-center py-16">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-xl animate-bounce">
                        ✋
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-800">Manus Agent Sedang Bekerja...</h4>
                      <p className="text-xs text-slate-500 max-w-sm font-medium">
                        Mengeksekusi rencana secara otonom, melakukan verifikasi, dan menyiapkan hasil akhir.
                      </p>
                    </div>
                  </div>
                ) : activeResultText ? (
                  <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-800">
                    {activeResultText}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-12 text-xs font-medium">
                    Belum ada hasil untuk ditayangkan.
                  </div>
                )}
              </div>

              {/* Follow-up Prompt Input Box */}
              <div className="mt-4 pt-2">
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-md flex items-center gap-2 flex-wrap max-w-full">
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleFollowUpSubmit();
                      }
                    }}
                    placeholder="Minta Manus melakukan revisi atau tugas tambahan..."
                    className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
                  />
                  <button
                    onClick={handleFollowUpSubmit}
                    disabled={!followUpInput.trim() || isLoading}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 text-white flex items-center justify-center hover:bg-slate-100 dark:bg-slate-800 disabled:bg-slate-200 cursor-pointer transition-all"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 1: ATTACHMENT SIMULATION ---------------- */}
      {showAttachmentModal && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Pilih Lampiran Simulasi</h3>
              <button onClick={() => setShowAttachmentModal(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Pilih file konteks yang akan disertakan ke Manus Agent:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleAttachSimulatedFile('Spesifikasi_Kebutuhan_Proyek.pdf')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Spesifikasi_Kebutuhan_Proyek.pdf</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">PDF • 1.2 MB</span>
              </button>

              <button
                onClick={() => handleAttachSimulatedFile('Data_Analisis_Pasar_2026.csv')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Data_Analisis_Pasar_2026.csv</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">CSV • 450 KB</span>
              </button>
            </div>
            <button
              onClick={() => setShowAttachmentModal(false)}
              className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: AUTH SIMULATION ALERT ---------------- */}
      {showAuthModal && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
              ✋
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">Simulasi Pembelajaran</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Ini adalah simulasi pembelajaran Maxy Academy, tidak terhubung ke akun Manus asli.
              </p>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-extrabold transition-all cursor-pointer"
            >
              Mengerti & Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: META ANNOUNCEMENT BANNER MODAL ---------------- */}
      {showMetaBannerModal && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
              ∞
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">Manus x Meta Announcement</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Manus telah resmi menjadi bagian dari ekosistem Meta untuk mempercepat pengembangan teknologi AI Agent otonom skala enterprise di seluruh dunia.
              </p>
            </div>
            <button
              onClick={() => setShowMetaBannerModal(false)}
              className="w-full py-2.5 rounded-2xl bg-white dark:bg-slate-900 text-white text-xs font-extrabold cursor-pointer"
            >
              Tutup Pengumuman
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManusReplica;
export const ManusSimulator = ManusReplica;
