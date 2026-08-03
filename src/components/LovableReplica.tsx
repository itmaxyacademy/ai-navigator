import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, ArrowRight, Mic, ChevronDown, Check, Copy, RefreshCw,
  AlertCircle, X, Code2, Eye, Layout, Monitor, Smartphone, Tablet,
  Terminal, Shield, Users, DollarSign, HelpCircle, FileText, Download,
  MessageSquare, Play, Info, ArrowLeft, Send
} from 'lucide-react';

interface LovableMessage {
  id: string;
  sender: 'user' | 'lovable';
  text: string;
  codeSnippet?: string;
  timestamp: string;
  modeUsed?: 'Bangun' | 'Chat';
}

export const LovableReplica: React.FC = () => {
  // Mode selection state: "Bangun" vs "Chat"
  const [mode, setMode] = useState<'Bangun' | 'Chat'>('Bangun');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState<boolean>(false);

  // Input & Prompt state
  const [inputPrompt, setInputPrompt] = useState<string>('');

  // Speech / Microphone Simulation State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingNote, setRecordingNote] = useState<string | null>(null);

  // Loading & Progressive Progress State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');

  // Error State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active View State: 'landing' vs 'workspace'
  const [viewState, setViewState] = useState<'landing' | 'workspace'>('landing');

  // Workspace State
  const [history, setHistory] = useState<LovableMessage[]>([]);
  const [currentCodeSnippet, setCurrentCodeSnippet] = useState<string>('');
  const [workspaceTab, setWorkspaceTab] = useState<'preview' | 'code' | 'split'>('split');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [previewClickCount, setPreviewClickCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [contactSuccessToast, setContactSuccessToast] = useState<boolean>(false);
  const [activeTemplateOverride, setActiveTemplateOverride] = useState<'auto' | 'saas' | 'course' | 'portfolio' | 'ecommerce'>('auto');

  // Modals state
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [infoModalTitle, setInfoModalTitle] = useState<string>('');
  const [infoModalContent, setInfoModalContent] = useState<string>('');

  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState<string | null>(null);

  // Auto scroll in workspace
  const workspaceChatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewState === 'workspace') {
      workspaceChatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isLoading, viewState]);
  // Helper to detect active template based on user prompt or manual override
  const getActiveTemplate = (): 'saas' | 'course' | 'portfolio' | 'ecommerce' => {
    if (activeTemplateOverride !== 'auto') return activeTemplateOverride;
    const lastUserPrompt = history.slice().reverse().find((m) => m.sender === 'user')?.text?.toLowerCase() || '';
    if (lastUserPrompt.includes('kursus') || lastUserPrompt.includes('sertifikasi') || lastUserPrompt.includes('dashboard') || lastUserPrompt.includes('maxy')) {
      return 'course';
    }
    if (lastUserPrompt.includes('portfolio') || lastUserPrompt.includes('developer') || lastUserPrompt.includes('rancang studio')) {
      return 'portfolio';
    }
    if (lastUserPrompt.includes('e-commerce') || lastUserPrompt.includes('store') || lastUserPrompt.includes('toko') || lastUserPrompt.includes('belanja')) {
      return 'ecommerce';
    }
    return 'saas';
  };

  // Handle Speech / Microphone Simulation
  const handleMicrophoneClick = () => {
    if (isRecording) return;

    setIsRecording(true);
    setRecordingNote('Merekam suara... Ucapkan deskripsi halaman arahan Anda.');

    const samplePrompts = [
      'Minta Lovable membuat halaman arahan untuk platform pembelajaran AI dengan sertifikasi resmi',
      'Minta Lovable membuat halaman arahan untuk aplikasi manajemen tugas tim terenkripsi',
      'Minta Lovable membuat halaman arahan untuk studio desain produk digital modern'
    ];

    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];

    setTimeout(() => {
      setInputPrompt(randomPrompt);
      setIsRecording(false);
      setRecordingNote('Suara berhasil direkam & dikonversi menjadi teks! (Simulasi Web Speech API)');
      setTimeout(() => setRecordingNote(null), 4000);
    }, 2500);
  };

  // Handle Submit & Generation
  const handleGenerate = async (explicitText?: string) => {
    const promptToSubmit = (explicitText || inputPrompt).trim();

    if (!promptToSubmit) {
      setErrorMessage('Silakan ketik deskripsi aplikasi atau halaman arahan yang ingin dibuat.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    // Progressive loading messages simulation
    setLoadingStepText('Menganalisis permintaan...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStepText('Menyusun struktur halaman...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setLoadingStepText('Menghasilkan kode React + Tailwind...');
    }, 2500);

    const userMsg: LovableMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: promptToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modeUsed: mode
    };

    setHistory((prev) => [...prev, userMsg]);
    setViewState('workspace');
    setInputPrompt('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const generatedSnippet = `// Full-Stack App Component (Lovable AI Offline)
import React, { useState } from 'react';

export default function GeneratedApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 font-sans">
      <h2 className="text-xl font-bold text-emerald-400">✨ ${promptToSubmit}</h2>
      <p className="text-xs text-slate-300">Aplikasi siap pakai (Full-Stack Prototype Generated Offline)</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow"
      >
        Klik Saya: {count}
      </button>
    </div>
  );
}`;

      const lovableMsg: LovableMessage = {
        id: `l-${Date.now()}`,
        sender: 'lovable',
        text: `Lovable AI telah berhasil membangun komponen web secara luring untuk: "${promptToSubmit}".`,
        codeSnippet: generatedSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modeUsed: mode
      };

      setHistory((prev) => [...prev, lovableMsg]);
      setCurrentCodeSnippet(generatedSnippet);
    } catch (err: any) {
      console.error('Lovable generate error:', err);
    } finally {
      setIsLoading(false);
      setLoadingStepText('');
    }
  };

  // Open Simulation Alert Modal for Navbar buttons
  const handleOpenNavSimulationModal = (buttonName: string) => {
    setInfoModalTitle(`Fitur Simulasi (${buttonName})`);
    setInfoModalContent(
      `Ini adalah simulasi pembelajaran Maxy Academy untuk pengenalan Lovable AI Builder. Tombol "${buttonName}" tidak terhubung ke layanan otentikasi asli Lovable.`
    );
    setIsInfoModalOpen(true);
  };

  // Open Banner Modal
  const handleOpenBannerModal = () => {
    setInfoModalTitle('Integrasi Lovable di ChatGPT & Claude');
    setInfoModalContent(
      'Aplikasi Lovable kini dapat diintegrasikan secara langsung ke dalam alur kerja ChatGPT dan Claude melalui plugin resmi. Anda dapat mengobrol dengan AI di platform favorit Anda dan mentransfer konteks desain secara mulus.'
    );
    setIsInfoModalOpen(true);
  };

  // Handle Copy Code
  const handleCopyCode = () => {
    if (!currentCodeSnippet) return;
    navigator.clipboard.writeText(currentCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#07060f] text-slate-800 dark:text-slate-100 overflow-hidden shadow-2xl flex flex-col min-h-[750px] font-sans select-none">
      {/* Visual Ambient Background Gradient Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-900/40 via-purple-900/30 via-pink-600/20 to-transparent blur-[120px] rounded-full opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-[350px] bg-gradient-to-t from-pink-600/25 via-rose-500/15 to-transparent blur-[100px] opacity-70" />
      </div>

      {/* TOP NAVBAR */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/40 bg-[#07060f]/60 backdrop-blur-md">
        {/* Left: Brand Logo */}
        <div
          onClick={() => setViewState('landing')}
          className="flex items-center gap-2 cursor-pointer group flex-wrap max-w-full"
        >
          <span className="text-xl">❤️</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-purple-300 transition-colors">
            Lovable
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="relative">
            <button
              onClick={() => setIsNavDropdownOpen(isNavDropdownOpen === 'solusi' ? null : 'solusi')}
              className="flex items-center gap-1 hover:text-slate-900 dark:text-white transition-colors cursor-pointer flex-wrap max-w-full"
            >
              <span>Solusi</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </button>
            {isNavDropdownOpen === 'solusi' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#141222] border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-2xl space-y-1 text-xs">
                <div className="p-2 hover:bg-slate-100 dark:bg-slate-800/80 rounded-lg cursor-pointer" onClick={() => handleOpenNavSimulationModal('Solusi Landing Page')}>Landing Page Builder</div>
                <div className="p-2 hover:bg-slate-100 dark:bg-slate-800/80 rounded-lg cursor-pointer" onClick={() => handleOpenNavSimulationModal('Solusi Web App')}>Web Application</div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsNavDropdownOpen(isNavDropdownOpen === 'sumber' ? null : 'sumber')}
              className="flex items-center gap-1 hover:text-slate-900 dark:text-white transition-colors cursor-pointer flex-wrap max-w-full"
            >
              <span>Sumber daya</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </button>
            {isNavDropdownOpen === 'sumber' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#141222] border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-2xl space-y-1 text-xs">
                <div className="p-2 hover:bg-slate-100 dark:bg-slate-800/80 rounded-lg cursor-pointer" onClick={() => handleOpenNavSimulationModal('Dokumentasi')}>Dokumentasi API</div>
                <div className="p-2 hover:bg-slate-100 dark:bg-slate-800/80 rounded-lg cursor-pointer" onClick={() => handleOpenNavSimulationModal('Panduan')}>Panduan Prompting</div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleOpenNavSimulationModal('Komunitas')}
            className="hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
          >
            Komunitas
          </button>
          <button
            onClick={() => handleOpenNavSimulationModal('Harga')}
            className="hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
          >
            Harga
          </button>
          <button
            onClick={() => handleOpenNavSimulationModal('Keamanan')}
            className="hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
          >
            Keamanan
          </button>
        </nav>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap max-w-full">
          <button
            onClick={() => handleOpenNavSimulationModal('Masuk')}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Masuk
          </button>
          <button
            onClick={() => handleOpenNavSimulationModal('Mulai sekarang')}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-white/10"
          >
            Mulai sekarang
          </button>
        </div>
      </header>

      {/* MAIN CONTENT LANDING OR WORKSPACE */}
      {viewState === 'landing' ? (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-4xl mx-auto space-y-8">
          {/* Announcement Pill Banner */}
          <button
            onClick={handleOpenBannerModal}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b1730]/80 border border-indigo-500/30 hover:border-indigo-400 text-xs text-slate-700 dark:text-slate-200 transition-all cursor-pointer group shadow-xl flex-wrap max-w-full"
          >
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
              Baru
            </span>
            <span className="font-medium">Aplikasi Lovable kini berfungsi di ChatGPT dan Claude</span>
            <span className="group-hover:translate-x-0.5 transition-transform text-slate-500 dark:text-slate-400">→</span>
          </button>

          {/* Headlines */}
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Bangun sesuatu dengan Lovable
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Buat aplikasi dan situs web dengan mengobrol bersama AI
            </p>
          </div>

          {/* Central Input Box */}
          <div className="w-full max-w-2xl space-y-3">
            <div className="relative bg-[#1a1728]/90 border border-slate-300 dark:border-slate-700/80 focus-within:border-purple-500 rounded-3xl p-4 transition-all shadow-2xl backdrop-blur-xl">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="Minta Lovable membuat halaman arahan untuk..."
                rows={3}
                className="w-full bg-transparent text-slate-900 dark:text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
              />

              {/* Bottom Control Row Inside Card */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
                {/* Left Side: Circular Action Button */}
                <button
                  onClick={() => handleGenerate('Buatkan landing page SaaS untuk alat otomatisasi alur kerja AI')}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Gunakan Contoh Prompt Cepat"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </button>

                {/* Right Side Controls */}
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  {/* Mode Selector Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                      className="px-3 py-1.5 rounded-xl bg-[#231f36] border border-slate-300 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer flex-wrap max-w-full"
                    >
                      <span>{mode}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </button>

                    {isModeDropdownOpen && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#1a1728] border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-left space-y-1">
                        <button
                          onClick={() => {
                            setMode('Bangun');
                            setIsModeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                            mode === 'Bangun' ? 'bg-purple-900/60 text-purple-200 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-bold">Bangun</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Generate kode aplikasi &amp; landing page</div>
                          </div>
                          {mode === 'Bangun' && <Check className="w-4 h-4 text-purple-400" />}
                        </button>

                        <button
                          onClick={() => {
                            setMode('Chat');
                            setIsModeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                            mode === 'Chat' ? 'bg-purple-900/60 text-purple-200 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-bold">Chat / Tanya</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Brainstorming &amp; rancang ide UI/UX</div>
                          </div>
                          {mode === 'Chat' && <Check className="w-4 h-4 text-purple-400" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Microphone / Speech Simulation Icon Button */}
                  <button
                    onClick={handleMicrophoneClick}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                    title="Suara ke Teks (Simulasi Web Speech API)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Submit Arrow Button */}
                  <button
                    onClick={() => handleGenerate()}
                    disabled={!inputPrompt.trim() || isLoading}
                    className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      inputPrompt.trim() && !isLoading
                        ? 'bg-white hover:bg-slate-200 text-slate-950 shadow-lg shadow-white/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                    title="Kirim Prompt"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Preset Prompt Suggestion Chips */}
            <div className="pt-3 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Pilih contoh prompt instan untuk langsung mencoba:</span>
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl mx-auto">
                {[
                  'Buatkan landing page SaaS untuk alat otomatisasi alur kerja AI',
                  'Buat dashboard kursus & sertifikasi AI Maxy Academy',
                  'Rancang studio portfolio web developer modern',
                  'Buat e-commerce storefront AI agent serba otomatis',
                ].map((presetText, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputPrompt(presetText);
                      handleGenerate(presetText);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#1e1933] hover:bg-[#282145] border border-purple-500/30 hover:border-purple-400 text-purple-200 text-xs font-semibold transition-all cursor-pointer shadow-md hover:scale-[1.02] flex items-center gap-2 text-left"
                  >
                    <span>{presetText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recording Notification */}
            {recordingNote && (
              <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-200 text-xs flex items-center justify-center gap-2 animate-fadeIn">
                <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>{recordingNote}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="p-1 text-rose-300 hover:text-slate-900 dark:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </main>
      ) : (
        /* WORKSPACE VIEW: BUILDER STUDIO */
        <div className="relative z-10 flex-1 flex flex-col overflow-hidden bg-[#0a0814]">
          {/* Workspace Top Toolbar */}
          <div className="px-4 py-2.5 bg-[#120f22] border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 gap-3 md:gap-0 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setViewState('landing')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Home</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                <span className="text-purple-400 font-bold">Lovable Workspace</span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                  Mode: {mode}
                </span>
              </div>
            </div>

            {/* Middle: Tab Switcher (Preview / Code / Split) */}
            <div className="flex items-center bg-[#1b1730] p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
              <button
                onClick={() => setWorkspaceTab('split')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  workspaceTab === 'split' ? 'bg-[#6149f6] text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setWorkspaceTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  workspaceTab === 'code' ? 'bg-[#6149f6] text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setWorkspaceTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  workspaceTab === 'preview' ? 'bg-[#6149f6] text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-[#221d38] border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin' : 'Salin Kode'}</span>
              </button>
            </div>
          </div>

          {/* Workspace Body Grid */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-w-0">
            {/* LEFT PANEL: CHAT & CODE EDITOR */}
            {(workspaceTab === 'split' || workspaceTab === 'code') && (
              <div
                className={`${
                  workspaceTab === 'split' ? 'w-full h-1/2 md:w-1/2 md:h-full border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800' : 'w-full h-full'
                } flex flex-col bg-[#0d0b1a] overflow-hidden`}
              >
                {/* Chat History Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 min-w-0">
                  {history.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-[#6149f6] text-slate-900 dark:text-white ml-auto max-w-lg'
                          : 'bg-[#151226] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 max-w-2xl'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        <span>{msg.sender === 'user' ? 'Anda' : 'Lovable AI'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="p-4 rounded-2xl bg-[#151226] border border-slate-200 dark:border-slate-800 text-xs text-purple-300 space-y-2 animate-pulse">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white flex-wrap max-w-full">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                        <span>Lovable Builder Sedang Bekerja...</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{loadingStepText}</p>
                    </div>
                  )}

                  <div ref={workspaceChatBottomRef} />
                </div>

                {/* Code Preview Box */}
                {currentCodeSnippet && (
                  <div className="h-64 border-t border-slate-200 dark:border-slate-800 bg-[#080712] flex flex-col shrink-0">
                    <div className="px-3 py-1.5 bg-[#120f22] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5 flex-wrap max-w-full">
                        <Code2 className="w-3.5 h-3.5 text-purple-400" /> Component.tsx
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="text-[10px] text-purple-400 hover:text-purple-300 font-bold"
                      >
                        Salin Semuanya
                      </button>
                    </div>
                    <pre className="flex-1 p-3 text-[11px] font-mono text-purple-200 overflow-auto whitespace-pre leading-relaxed select-text min-w-0">
                      <code>{currentCodeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Input Prompt Box at Bottom of Left Panel */}
                <div className="p-3 bg-[#110e20] border-t border-slate-200 dark:border-slate-800 shrink-0">
                  <div className="relative bg-[#1a1728] border border-slate-300 dark:border-slate-700 rounded-xl p-2 flex items-center gap-2 flex-wrap max-w-full">
                    <input
                      type="text"
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGenerate();
                      }}
                      placeholder="Minta perubahan atau iterasi desain..."
                      className="flex-1 bg-transparent text-slate-900 dark:text-white text-xs placeholder-slate-500 focus:outline-none min-w-0"
                    />
                    <button
                      onClick={() => handleGenerate()}
                      disabled={!inputPrompt.trim() || isLoading}
                      className="p-1.5 rounded-lg bg-[#6149f6] text-slate-900 dark:text-white hover:bg-[#523be3] disabled:bg-slate-100 dark:bg-slate-800 disabled:text-slate-500 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* RIGHT PANEL: LIVE PREVIEW RENDER */}
            {(workspaceTab === 'split' || workspaceTab === 'preview') && (
              <div
                className={`${
                  workspaceTab === 'split' ? 'w-full h-1/2 md:w-1/2 md:h-full' : 'w-full h-full'
                } bg-[#080712] flex flex-col overflow-hidden`}
              >
                {/* Device Responsiveness Toolbar */}
                <div className="px-4 py-2 bg-[#120f22] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        previewDevice === 'desktop' ? 'bg-[#6149f6] text-slate-900 dark:text-white' : 'hover:bg-slate-100 dark:bg-slate-800'
                      }`}
                      title="Desktop Mode"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('tablet')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        previewDevice === 'tablet' ? 'bg-[#6149f6] text-slate-900 dark:text-white' : 'hover:bg-slate-100 dark:bg-slate-800'
                      }`}
                      title="Tablet Mode"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        previewDevice === 'mobile' ? 'bg-[#6149f6] text-slate-900 dark:text-white' : 'hover:bg-slate-100 dark:bg-slate-800'
                      }`}
                      title="Mobile Mode"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Dynamic Template Switcher Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Desain Template:</span>
                    {[
                      { id: 'saas', label: '⚡ SaaS' },
                      { id: 'course', label: '🎓 Edu LMS' },
                      { id: 'portfolio', label: '🎨 Portfolio' },
                      { id: 'ecommerce', label: '🛒 Store' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTemplateOverride(t.id as any)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                          getActiveTemplate() === t.id
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Frame Container */}
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100 dark:bg-slate-950 min-w-0">
                  <div
                    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 w-full ${
                      previewDevice === 'desktop'
                        ? 'max-w-full h-full'
                        : previewDevice === 'tablet'
                        ? 'max-w-md h-[550px]'
                        : 'max-w-xs h-[500px]'
                    }`}
                  >
                    {/* Simulated Component Render - Dynamic Template Preview */}
                    <div className="h-full overflow-y-auto font-sans bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white">
                      
                      {getActiveTemplate() === 'course' ? (
                        /* TEMPLATE 2: EDU LMS & CERTIFICATION DASHBOARD */
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          <header className="px-5 py-3 border-b border-slate-800 bg-[#0d0f17]/90 backdrop-blur flex items-center justify-between sticky top-0 z-20">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white text-xs">
                                🎓
                              </div>
                              <span className="font-extrabold text-xs text-white">Maxy AI Academy</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">1,450 XP</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">Tier 2 Ready</span>
                            </div>
                          </header>

                          <main className="p-5 space-y-4 flex-1">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Dashboard Kursus Interaktif</span>
                              <h2 className="text-xl font-extrabold text-white">Laporan Progres Sertifikasi AI</h2>
                              <p className="text-xs text-slate-400">Seluruh 29 modul kurikulum berhasil diselesaikan secara lengkap.</p>
                            </div>

                            {/* Progress Card */}
                            <div className="p-4 rounded-2xl bg-[#121420] border border-slate-800 space-y-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-emerald-400">Progres Modul Kursus</span>
                                <span className="font-mono font-bold text-white">29 / 29 Modul (100%)</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-full" />
                              </div>
                            </div>

                            {/* Interactive Quiz Tester Widget */}
                            <div className="p-4 rounded-2xl bg-[#141226] border border-purple-800/60 space-y-3">
                              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Mini Quiz Simulator
                              </span>
                              <p className="text-xs text-slate-200">Berapa jumlah modul total pada Jalur Pembelajaran AI Master?</p>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => setSelectedQuizOption(1)}
                                  className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                    selectedQuizOption === 1
                                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                                  }`}
                                >
                                  ✓ 29 Modul (Tier 2 Master)
                                </button>
                                <button
                                  onClick={() => setSelectedQuizOption(2)}
                                  className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                    selectedQuizOption === 2
                                      ? 'bg-rose-600 text-white border-rose-400'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                                  }`}
                                >
                                  22 Modul (Tier 1 Fundamental)
                                </button>
                              </div>
                              {selectedQuizOption === 1 && (
                                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold text-center animate-fadeIn">
                                  🎉 Jawaban Tepat! Anda berhak klaim Sertifikat Tier 2.
                                </div>
                              )}
                            </div>
                          </main>
                        </div>
                      ) : getActiveTemplate() === 'portfolio' ? (
                        /* TEMPLATE 3: MODERN DEVELOPER PORTFOLIO */
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          <header className="px-5 py-3 border-b border-slate-800 bg-[#0d0f17]/90 backdrop-blur flex items-center justify-between sticky top-0 z-20">
                            <span className="font-extrabold text-xs text-indigo-400 flex items-center gap-1.5">
                              ⚡ alexchen.dev
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              🟢 Open for Hire
                            </span>
                          </header>

                          <main className="p-5 space-y-4 flex-1">
                            <div className="space-y-2">
                              <h1 className="text-2xl font-extrabold text-white">Alex Chen</h1>
                              <p className="text-xs text-indigo-300 font-medium">Senior AI &amp; Full-Stack Engineer</p>
                              <p className="text-xs text-slate-400 leading-relaxed">Spesialis dalam membangun agen AI otonom, Web Apps berkecepatan tinggi, dan integrasi LLM.</p>
                            </div>

                            {/* Tech Stack Pills */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {['React 19', 'TypeScript', 'Tailwind CSS', 'Gemini 1.5', 'Python'].map((tech, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono">
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {/* Interactive Contact Form Simulator */}
                            <div className="p-4 rounded-2xl bg-[#121420] border border-slate-800 space-y-2.5">
                              <span className="text-xs font-bold text-white">Kirim Pesan Langsung</span>
                              <input
                                type="text"
                                placeholder="Tulis pesan kerjasama..."
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  setContactSuccessToast(true);
                                  setTimeout(() => setContactSuccessToast(false), 3000);
                                }}
                                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer"
                              >
                                Send Message 🚀
                              </button>
                              {contactSuccessToast && (
                                <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-700 text-indigo-200 text-xs font-bold text-center animate-fadeIn">
                                  ✉️ Pesan Anda berhasil dikirim ke Alex Chen!
                                </div>
                              )}
                            </div>
                          </main>
                        </div>
                      ) : getActiveTemplate() === 'ecommerce' ? (
                        /* TEMPLATE 4: E-COMMERCE AI STOREFRONT */
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          <header className="px-5 py-3 border-b border-slate-800 bg-[#0d0f17]/90 backdrop-blur flex items-center justify-between sticky top-0 z-20">
                            <span className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                              🛒 CyberStore AI
                            </span>
                            <button
                              onClick={() => setCartCount(c => c + 1)}
                              className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold cursor-pointer"
                            >
                              🛒 Keranjang ({cartCount})
                            </button>
                          </header>

                          <main className="p-5 space-y-4 flex-1">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-600/30 to-rose-600/30 border border-amber-500/40 space-y-1">
                              <span className="text-[10px] font-bold text-amber-300">PROMO GADGET AI 2026</span>
                              <h3 className="text-sm font-extrabold text-white">Diskon 30% Peralatan AI Pro</h3>
                            </div>

                            {/* Product Cards Grid */}
                            <div className="grid grid-cols-2 gap-2.5">
                              <div className="p-3 rounded-xl bg-[#121420] border border-slate-800 space-y-2">
                                <div className="w-full h-16 rounded-lg bg-slate-800 flex items-center justify-center text-2xl">🎧</div>
                                <div className="text-[11px] font-bold text-white">AI Neural Headphones</div>
                                <div className="text-[10px] text-amber-400 font-bold">Rp 1.499.000</div>
                                <button
                                  onClick={() => setCartCount(c => c + 1)}
                                  className="w-full py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] cursor-pointer"
                                >
                                  + Beli
                                </button>
                              </div>

                              <div className="p-3 rounded-xl bg-[#121420] border border-slate-800 space-y-2">
                                <div className="w-full h-16 rounded-lg bg-slate-800 flex items-center justify-center text-2xl">🤖</div>
                                <div className="text-[11px] font-bold text-white">Smart AI Desk Robot</div>
                                <div className="text-[10px] text-amber-400 font-bold">Rp 2.299.000</div>
                                <button
                                  onClick={() => setCartCount(c => c + 1)}
                                  className="w-full py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] cursor-pointer"
                                >
                                  + Beli
                                </button>
                              </div>
                            </div>
                          </main>
                        </div>
                      ) : (
                        /* TEMPLATE 1 (DEFAULT): SAAS AI WORKFLOW AUTOMATION */
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          <header className="px-5 py-3 border-b border-slate-800/80 bg-[#0d0f17]/90 backdrop-blur flex items-center justify-between sticky top-0 z-20">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 font-extrabold text-white text-xs">
                                ⚡
                              </div>
                              <span className="font-extrabold text-xs tracking-tight text-white flex items-center gap-1.5">
                                Lovable Studio <span className="px-2 py-0.5 text-[9px] rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">Live Pro</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">v2.4 Production Ready</span>
                              <button 
                                onClick={() => setPreviewClickCount(c => c + 1)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5" /> Launch App ({previewClickCount})
                              </button>
                            </div>
                          </header>

                          {/* Main Hero & Content Section */}
                          <main className="p-5 space-y-5 flex-1">
                            {/* Dynamic Hero Badge */}
                            <div className="space-y-3 text-center sm:text-left pt-1">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-inner">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                                <span>AI Generated Result • Lovable V4 Engine</span>
                              </div>

                              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                                {history.find((m) => m.sender === 'user')?.text || 'Buatkan landing page SaaS untuk alat otomatisasi alur kerja AI'}
                              </h1>

                              <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                                Antarmuka aplikasi web modern ini dibuat secara otomatis dengan komponen React interaktif, sistem gaya Tailwind CSS, serta kompatibilitas penuh untuk perangkat seluler dan desktop.
                              </p>
                            </div>

                            {/* Interactive Feature Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {/* Card 1: Interactive State Tester */}
                              <div className="p-4 rounded-2xl bg-[#121420] border border-slate-800 hover:border-purple-500/50 transition-all space-y-2.5 shadow-xl group">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> State Interaktif Live
                                  </span>
                                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple-900/40 text-purple-300 border border-purple-700/50 font-mono">React Hook</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                  Uji coba langsung tombol state di bawah ini. Nilai state akan diperbarui secara real-time di antarmuka.
                                </p>
                                <button
                                  onClick={() => setPreviewClickCount(c => c + 1)}
                                  className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg group-hover:shadow-purple-500/20"
                                >
                                  <span>Klik Uji State (Counter: {previewClickCount})</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-purple-300" />
                                </button>
                              </div>

                              {/* Card 2: Performance Metrics */}
                              <div className="p-4 rounded-2xl bg-[#121420] border border-slate-800 hover:border-emerald-500/50 transition-all space-y-2.5 shadow-xl">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Responsif &amp; Siap Pakai
                                  </span>
                                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 font-mono">100% Uptime</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                  Tata letak dan gaya CSS diuji siap pakai secara langsung di produksi dengan performa optimal.
                                </p>
                                <div className="flex items-center gap-2.5 pt-0.5">
                                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[94%]" />
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-400 font-mono">99.4% Score</span>
                                </div>
                              </div>
                            </div>
                          </main>
                        </div>
                      )}

                      {/* Footer */}
                      <footer className="px-5 py-2.5 border-t border-slate-800/80 bg-[#0d0f17] flex items-center justify-between text-[10px] text-slate-400 shrink-0">
                        <span>© 2026 Lovable AI Navigator • Maxy Academy</span>
                        <span className="text-purple-400 font-mono">Status: Ready</span>
                      </footer>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INFO / SIMULATION MODAL */}
      {isInfoModalOpen && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141224] border border-purple-800/80 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#6149f6] flex items-center justify-center text-2xl shadow-lg">
              ❤️
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{infoModalTitle}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{infoModalContent}</p>
            </div>

            <button
              onClick={() => setIsInfoModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#6149f6] hover:bg-[#523be3] text-slate-900 dark:text-white text-xs font-extrabold transition-all cursor-pointer"
            >
              Mengerti &amp; Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LovableReplica;
export const LovableSimulator = LovableReplica;
