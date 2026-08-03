import React, { useState } from 'react';
import {
  Sparkles, Terminal, Code2, Cpu, Play, Send, Plus, Search, MapPin, Sliders,
  Check, X, ChevronDown, Monitor, Smartphone, RotateCw, Maximize2, Share2,
  Columns, MoreVertical, LayoutGrid, Compass, Clock, BookOpen, ExternalLink,
  Key, Shield, CreditCard, Copy, ArrowLeft, RefreshCw, FileText, CheckCircle2,
  Wand2, Zap, Layers, MessageSquare, Mic, Paperclip, Dices, Globe, Eye,
  Settings, Folder, Box, ChevronRight, ChevronLeft, HelpCircle, User, Sparkle, Menu
} from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  status: 'Published' | 'Active' | 'Draft';
  pinned?: boolean;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  model: string;
  remixes: number;
  gradient: string;
}

export const GoogleAIStudioReplica: React.FC = () => {
  // Main view state in sidebar: 'playground' | 'build_workspace' | 'my_apps' | 'gallery' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'playground' | 'build_workspace' | 'my_apps' | 'gallery' | 'dashboard'>('playground');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Stage toggle inside Playground: 'playground' (Tahap 1) vs 'build_workspace' (Tahap 2)
  const [selectedGridMode, setSelectedGridMode] = useState<string>('featured');
  const [gridFilterMode, setGridFilterMode] = useState<'models' | 'agents'>('models');
  const [playgroundMobileTab, setPlaygroundMobileTab] = useState<'prompt' | 'settings'>('prompt');

  // Prompt Inputs & Loading & Error States
  const [playgroundPrompt, setPlaygroundPrompt] = useState<string>(
    'Buat aplikasi web interaktif Maxy AI Navigator dengan dashboard modul pembelajaran LLM'
  );
  const [recentPrompts, setRecentPrompts] = useState<string[]>([
    'Maxy AI Navigator',
    'Optimasi Kode Game Arcade',
    'Riset Prompting LLM',
    'Generator Modul Pembelajaran',
  ]);
  const [playgroundOutput, setPlaygroundOutput] = useState<{
    text: string;
    imageUrl?: string;
    modelUsed: string;
    groundingSources?: Array<{ title?: string; url: string; snippet?: string }>;
    timestamp: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isGroundingChipActive, setIsGroundingChipActive] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Run Settings State (TAHAP 1)
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-flash-preview');
  const [systemInstruction, setSystemInstruction] = useState<string>(
    'Anda adalah AI Assistant profesional buatan Maxy Academy. Hasilkan kode React TypeScript yang bersih, modular, dan terstruktur.'
  );
  const [temperature, setTemperature] = useState<number>(1.0);
  const [thinkingLevel, setThinkingLevel] = useState<'High' | 'Medium' | 'Low'>('High');
  const [isThinkingOpen, setIsThinkingOpen] = useState<boolean>(false);

  // Tools Toggles State
  const [toolsState, setToolsState] = useState({
    structuredOutputs: false,
    codeExecution: true,
    functionCalling: false,
    groundingSearch: true,
    groundingMaps: false,
  });

  // Build Workspace State (TAHAP 2)
  const [workspaceAppTitle, setWorkspaceAppTitle] = useState<string>('Maxy AI Navigator');
  const [workspaceTab, setWorkspaceTab] = useState<'preview' | 'code'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [workspaceInput, setWorkspaceInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; duration?: string; bullets?: string[] }>
  >([
    {
      sender: 'user',
      text: 'Buat aplikasi web interaktif Maxy AI Navigator dengan dashboard modul pembelajaran LLM',
    },
    {
      sender: 'ai',
      duration: 'Ran for 12s',
      text: 'Aplikasi "Maxy AI Navigator" berhasil dibangun!',
      bullets: [
        'Interactive Dashboard: Navigasi 18 modul LLM dari ChatGPT hingga Google AI Studio.',
        'Live Simulator & Playground: Fasilitas uji coba prompt dan parameter suhu/thinking level.',
        'Real-time Code & Preview Sync: Tab perbandingan kode TypeScript dan tampilan visual live.',
        'Responsive Light & Dark Aesthetic: Desain ramah pengguna teroptimasi mobile dan desktop.',
      ],
    },
  ]);

  // Gallery Filter State
  const [galleryFilter, setGalleryFilter] = useState<string>('Featured');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handler for Running Prompt via API
  const handleRunPrompt = async (customPrompt?: string, openWorkspace = false) => {
    const promptToUse = customPrompt !== undefined ? customPrompt : playgroundPrompt;

    if (!promptToUse || !promptToUse.trim()) {
      setErrorMessage('Prompt tidak boleh kosong! Silakan ketik instruksi atau pilih dari Recent Prompts.');
      showToast('❌ Prompt kosong!');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    showToast(`🚀 Memproses request dengan model ${selectedModel}...`);

    try {
      // Simulasi delay API backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data = {
        text: `Ini adalah respons hasil simulasi dari ${selectedModel} untuk instruksi Anda:\n\n"${promptToUse}"\n\nSemua parameter seperti Temperature (${temperature}) dan Thinking Level (${thinkingLevel}) telah diterapkan pada simulasi ini.`,
        modelUsed: selectedModel,
        groundingSources: [],
        imageUrl: undefined
      };

      const outputData = {
        text: data.text || 'Tidak ada teks respons yang diterima.',
        imageUrl: data.imageUrl,
        modelUsed: data.modelUsed || selectedModel,
        groundingSources: data.groundingSources,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setPlaygroundOutput(outputData);

      // Add to Recent Prompts
      const summaryTitle = promptToUse.length > 28 ? promptToUse.slice(0, 28) + '...' : promptToUse;
      setRecentPrompts((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== summaryTitle.toLowerCase());
        return [summaryTitle, ...filtered].slice(0, 8);
      });

      // Update Workspace Title if user ran a new app creation prompt
      if (promptToUse.length > 5) {
        const firstWords = promptToUse.split(' ').slice(0, 4).join(' ');
        setWorkspaceAppTitle(firstWords.charAt(0).toUpperCase() + firstWords.slice(1));
      }

      // Add entry to Chat Messages
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'user',
          text: promptToUse,
        },
        {
          sender: 'ai',
          duration: `Ran for 3s • ${data.modelUsed || selectedModel}`,
          text: data.imageUrl ? `Gambar berhasil digenerasi untuk prompt: "${promptToUse}"` : (data.text?.slice(0, 160) + '...'),
          bullets: [
            `Model: ${data.modelUsed || selectedModel}`,
            `Temperature: ${temperature.toFixed(1)} | Thinking Level: ${thinkingLevel}`,
            `Active Tools: ${Object.entries(toolsState).filter(([, v]) => v).map(([k]) => k).join(', ') || 'Standard'}`,
          ],
        },
      ]);

      if (openWorkspace) {
        setActiveTab('build_workspace');
        showToast('🎉 Aplikasi berhasil dibangun & dibuka di Build Workspace!');
      } else {
        showToast('✨ Respons Gemini AI Studio berhasil dihasilkan!');
      }
    } catch (err: any) {
      console.error('Playground run error:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses request.');
      showToast('❌ Gagal memproses prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for Start Building legacy wrapper
  const handleStartBuilding = (customPrompt?: string) => {
    handleRunPrompt(customPrompt, true);
  };

  // Handler for chat input in Build Workspace
  const handleSendWorkspaceMessage = async () => {
    if (!workspaceInput.trim() || isGenerating) return;
    const msg = workspaceInput;
    setWorkspaceInput('');
    setIsGenerating(true);

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: msg },
    ]);

    try {
      // Simulasi delay API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const responseText = 'Langkah iterasi simulasi berhasil diselesaikan. Kode telah diperbarui sesuai instruksi.';

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          duration: 'Ran for 3s',
          text: `Pembaruan diselesaikan berdasarkan instruksi Anda:`,
          bullets: [
            `Instruksi: "${msg}"`,
            responseText.slice(0, 120) + '...',
            `Konfigurasi: Temp ${temperature.toFixed(1)} | Thinking: ${thinkingLevel}`,
          ],
        },
      ]);
      showToast('Perubahan berhasil diterapkan pada Live Preview!');
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          duration: 'Error',
          text: `Gagal memproses iterasi: ${err.message}`,
        },
      ]);
      showToast('❌ Gagal memperbarui aplikasi.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Mock Data for My Apps
  const myAppsList: AppItem[] = [
    {
      id: 'app-1',
      name: 'Maxy AI Navigator',
      description: 'Platform Pembelajaran LLM Interaktif untuk Pemula & Profesional Maxy Academy',
      updatedAt: '1 jam yang lalu',
      createdAt: '2 hari yang lalu',
      status: 'Active',
      pinned: true,
    },
    {
      id: 'app-2',
      name: 'Maxy Quiz Multiverse',
      description: 'Generate interactive arcade mini-game quizzes from notes using Gemini AI',
      updatedAt: '9 jam yang lalu',
      createdAt: '1 hari yang lalu',
      status: 'Published',
      pinned: true,
    },
    {
      id: 'app-3',
      name: 'Smart Code Refactor Pro',
      description: 'Automated code syntax refactorer & linter powered by Gemini 3 Thinking Engine',
      updatedAt: '3 hari yang lalu',
      createdAt: '5 hari yang lalu',
      status: 'Draft',
    },
  ];

  // Mock Data for Community Gallery
  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-1',
      title: 'Nano Banana 2 Lite & Gemini Omni Flash',
      description: 'Ultra-fast, cost-efficient image generation and video creation with conversational step-by-step editing.',
      category: 'Featured',
      model: 'Gemini 3 / Nano Banana',
      remixes: 1240,
      gradient: 'from-amber-500/20 via-orange-500/20 to-rose-500/20',
    },
    {
      id: 'gal-2',
      title: '3D Interactive Globe Visualizer',
      description: 'Explore real-time spatial data and map visualizations rendered via WebGL and Gemini Search Grounding.',
      category: 'Games and Visualizations',
      model: 'Gemini 3 Pro',
      remixes: 850,
      gradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    },
    {
      id: 'gal-3',
      title: 'Maxy Code Explainer Bot',
      description: 'Interactive code analyzer with step-by-step line explanation and AST diagram builder.',
      category: 'Tools',
      model: 'Gemini 3 Flash Preview',
      remixes: 620,
      gradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    },
    {
      id: 'gal-4',
      title: 'Retro Arcade Quiz Game',
      description: 'Arcade style gamified learning experience with sound effects and adaptive question difficulty.',
      category: 'Games and Visualizations',
      model: 'Gemini 3.6 Flash',
      remixes: 910,
      gradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20',
    },
  ];

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-[750px]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400 text-xs font-medium flex items-center gap-2 animate-bounce flex-wrap max-w-full">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 p-3 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Google AI Studio</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Container Layout */}
      <div className="flex flex-1 overflow-hidden min-w-0 relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar Navigation */}
        <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-56 sm:w-64'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 select-none absolute lg:relative z-50 sticky top-0 self-start transition-all duration-200 ${isMobileMenuOpen ? 'translate-x-0 flex shadow-2xl' : '-translate-x-full lg:translate-x-0 hidden lg:flex'}`}>
          <div className="p-3 sm:p-4 flex flex-col space-y-5">
            <div className="space-y-5">
              {/* Logo / Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('playground')}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-slate-900 dark:text-white font-bold shadow-md shrink-0">
                    <Sparkles className="w-4 h-4 text-slate-900 dark:text-white" />
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="truncate">
                      <h1 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-wide truncate">
                        Google AI Studio
                      </h1>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Maxy Edition</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* Sidebar Sections */}
              <nav className="space-y-4 text-xs font-medium">
                {/* EXPLORE */}
                <div>
                  {!isSidebarCollapsed && (
                    <p className="px-2 mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Explore
                    </p>
                  )}
                  <div className="space-y-0.5">
                    <button
                      onClick={() => { setActiveTab('playground'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                        activeTab === 'playground'
                          ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'
                      } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title="Playground"
                    >
                      <Terminal className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span>Playground</span>}
                    </button>

                    <button
                      onClick={() => {
                        showToast('Riwayat prompt dibuka pada section Recent');
                        setActiveTab('playground');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title="History"
                    >
                      <Clock className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span>History</span>}
                    </button>
                  </div>
                </div>

                {/* BUILD */}
                <div>
                  {!isSidebarCollapsed && (
                    <p className="px-2 mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Build
                    </p>
                  )}
                  <div className="space-y-0.5">
                    <button
                      onClick={() => { handleStartBuilding('Buat aplikasi web baru dengan Gemini AI'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-blue-300 hover:from-blue-600/40 hover:to-indigo-600/40 border border-blue-500/30 transition-all font-semibold ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title="+ New app"
                    >
                      <Plus className="w-4 h-4 text-blue-400 shrink-0" />
                      {!isSidebarCollapsed && <span>+ New app</span>}
                    </button>

                    <button
                      onClick={() => { setActiveTab('my_apps'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                        activeTab === 'my_apps'
                          ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'
                      } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title="My apps"
                    >
                      <LayoutGrid className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span>My apps</span>}
                    </button>

                    <button
                      onClick={() => { setActiveTab('gallery'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                        activeTab === 'gallery'
                          ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'
                      } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title="Gallery"
                    >
                      <Compass className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span>Gallery</span>}
                    </button>
                  </div>
                </div>

                {/* MANAGE */}
                <div>
                  {!isSidebarCollapsed && (
                    <p className="px-2 mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Manage
                    </p>
                  )}
                  <div className="space-y-0.5">
                    <button
                      onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
                        activeTab === 'dashboard'
                          ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'
                      } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title="Dashboard & API Keys"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Key className="w-4 h-4 shrink-0" />
                        {!isSidebarCollapsed && <span className="truncate">Dashboard & Keys</span>}
                      </div>
                      {!isSidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                    </button>

                    <button
                      onClick={() => { showToast('Membuka dokumentasi resmi Google AI Studio'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title="Documentation"
                    >
                      <BookOpen className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span>Documentation</span>}
                    </button>
                  </div>
                </div>
              </nav>
            </div>

            {/* User Profile at Bottom (Compact & Clean) */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
              <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0">
                    M
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">Maxy Academy</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        PRO
                      </span>
                    </div>
                  )}
                </div>

                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-1 text-slate-500 shrink-0">
                    <Settings className="w-3.5 h-3.5 hover:text-slate-600 dark:text-slate-300 cursor-pointer" onClick={() => showToast('Pengaturan Akun Maxy Academy')} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col overflow-y-auto">
          {/* ========================================================= */}
          {/* VIEW 1: TAHAP 1 - PLAYGROUND (Main Prompting Screen)       */}
          {/* ========================================================= */}
          {activeTab === 'playground' && (
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
              {/* Mobile Tab Switcher */}
              <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0d1322] shrink-0">
                <div className="flex items-center bg-slate-100 dark:bg-slate-950 rounded-xl p-1">
                  <button
                    onClick={() => setPlaygroundMobileTab('prompt')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${playgroundMobileTab === 'prompt' ? 'bg-white dark:bg-slate-800 shadow text-blue-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <Terminal className="w-4 h-4" />
                    Prompt & Chat
                  </button>
                  <button
                    onClick={() => setPlaygroundMobileTab('settings')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${playgroundMobileTab === 'settings' ? 'bg-white dark:bg-slate-800 shadow text-blue-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <Sliders className="w-4 h-4" />
                    Run Settings
                  </button>
                </div>
              </div>

              {/* Left/Center Main Playground View */}
              <div className={`flex-1 p-5 sm:p-7 flex-col justify-between space-y-6 overflow-y-auto border-r border-slate-200 dark:border-slate-800/60 ${playgroundMobileTab === 'prompt' ? 'flex' : 'hidden lg:flex'}`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/60 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-wrap max-w-full">
                      <Terminal className="w-5 h-5 text-blue-400" />
                      Playground
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Eksplorasi prompt, konfigurasikan model Gemini 3, dan bangun aplikasi secara interaktif.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setShowSettingsPanel(!showSettingsPanel);
                        showToast(showSettingsPanel ? 'Panel Run Settings disembunyikan' : 'Panel Run Settings ditampilkan');
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        showSettingsPanel
                          ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-md'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                      }`}
                      title="Tampilkan / Sembunyikan Panel Run Settings"
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                      <span>Run Settings</span>
                    </button>
                    <button
                      onClick={() => showToast('Link Playground disalin ke clipboard!')}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-all text-xs flex items-center gap-1.5 flex-wrap max-w-full"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                    <button
                      onClick={() => showToast('Mode Bandingkan (Compare) Diaktifkan')}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-all text-xs flex items-center gap-1.5 flex-wrap max-w-full"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Compare</span>
                    </button>
                    <button className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section RECENT */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Recent Prompts
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recentPrompts.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPlaygroundPrompt(item);
                          if (errorMessage) setErrorMessage(null);
                          showToast(`Prompt "${item}" dimuat!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-2 transition-all group cursor-pointer flex-wrap max-w-full"
                      >
                        <Clock className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Alert Box */}
                {errorMessage && (
                  <div className="bg-rose-500/10 border border-rose-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-rose-300 animate-in fade-in">
                    <div className="flex items-center gap-2 flex-wrap max-w-full">
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                    <button
                      onClick={() => setErrorMessage(null)}
                      className="text-rose-400 hover:text-slate-900 dark:text-white shrink-0 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Section Models Grid Mode */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 flex-wrap max-w-full">
                      <span>Pilih Mode Generasi</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-normal">
                        Gemini 3 Capability
                      </span>
                    </h3>

                    {/* Toggle Models / Agents */}
                    <div className="bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center text-xs">
                      <button
                        onClick={() => setGridFilterMode('models')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          gridFilterMode === 'models'
                            ? 'bg-blue-600 text-white font-semibold shadow-md'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        Models
                      </button>
                      <button
                        onClick={() => setGridFilterMode('agents')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          gridFilterMode === 'agents'
                            ? 'bg-blue-600 text-white font-semibold shadow-md'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        Agents
                      </button>
                    </div>
                  </div>

                  {/* Grid Cards (6 Modes) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'featured',
                        title: 'Featured',
                        desc: 'Test out our most advanced and newest models (Gemini 3 Flash Preview & Pro).',
                        icon: Sparkles,
                        color: 'text-amber-400',
                      },
                      {
                        id: 'code_chat',
                        title: 'Code and Chat',
                        desc: 'Build chatbots, agents, and code with Gemini 3 reasoning.',
                        icon: Code2,
                        color: 'text-blue-400',
                      },
                      {
                        id: 'image_gen',
                        title: 'Image Generation',
                        desc: 'Create and edit images with Nano Banana and Imagen 3.',
                        icon: Wand2,
                        color: 'text-purple-400',
                      },
                      {
                        id: 'video_gen',
                        title: 'Video Generation',
                        desc: 'Generate videos with Veo models, state-of-the-art video generation.',
                        icon: Eye,
                        color: 'text-rose-400',
                      },
                      {
                        id: 'speech_music',
                        title: 'Speech and Music',
                        desc: 'Explore text-to-speech, audio synthesis, and music generation models.',
                        icon: Mic,
                        color: 'text-emerald-400',
                      },
                      {
                        id: 'realtime',
                        title: 'Real-time',
                        desc: 'Real-time low latency voice and video streaming with Live API.',
                        icon: Zap,
                        color: 'text-cyan-400',
                      },
                    ].map((card) => {
                      const IconComp = card.icon;
                      const isSelected = selectedGridMode === card.id;
                      return (
                        <div
                          key={card.id}
                          onClick={() => {
                            setSelectedGridMode(card.id);
                            if (errorMessage) setErrorMessage(null);
                            showToast(`Mode "${card.title}" dipilih`);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:border-slate-700 hover:bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 ${card.color}`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">{card.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{card.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Start Building Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      Mode Terpilih: <strong className="text-blue-300 capitalize">{selectedGridMode.replace('_', ' ')}</strong>
                    </p>
                    <button
                      onClick={() => handleStartBuilding()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-slate-900 dark:text-white font-bold text-xs shadow-lg shadow-blue-500/20 border border-blue-400/30 flex items-center gap-2 transition-all cursor-pointer flex-wrap max-w-full"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Start building</span>
                    </button>
                  </div>
                </div>

                {/* Prompt Input Box & Toolbar */}
                <div className="space-y-2 pt-2">
                  <div className="relative rounded-2xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 transition-all p-3 shadow-xl">
                    <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="capitalize text-blue-400 flex items-center gap-1.5 flex-wrap max-w-full">
                        <Sparkles className="w-3.5 h-3.5" />
                        Mode: {selectedGridMode.replace('_', ' ')}
                      </span>
                      {selectedGridMode === 'image_gen' && (
                        <span className="text-purple-400 font-mono text-[10px] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                          Imagen 3 / Nano Banana
                        </span>
                      )}
                    </div>

                    <textarea
                      value={playgroundPrompt}
                      onChange={(e) => {
                        setPlaygroundPrompt(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder={
                        selectedGridMode === 'image_gen'
                          ? 'Deskripsikan gambar visual yang ingin Anda buat dengan Imagen 3 (mis. "Futuristic Cyberpunk City with neon lights in rain")...'
                          : selectedGridMode === 'code_chat'
                          ? 'Ketik instruksi koding, analisis logika program, atau percakapan dengan Gemini 3...'
                          : selectedGridMode === 'speech_music'
                          ? 'Deskripsikan narasi audio, efek suara, atau komposisi musik yang ingin dibuat...'
                          : selectedGridMode === 'video_gen'
                          ? 'Deskripsikan skenario video dan arah sinematografi yang diinginkan...'
                          : selectedGridMode === 'realtime'
                          ? 'Ketik instruksi streaming percakapan atau kontrol Live API...'
                          : 'Start typing a prompt or app requirement to see what our models can do...'
                      }
                      rows={selectedGridMode === 'image_gen' ? 4 : 3}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                    />

                    {/* Toolbar inside input box */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Tools Button */}
                        <button
                          onClick={() => showToast('Tools dropdown: pilih Grounding Search, Maps, atau Custom Functions')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer flex-wrap max-w-full"
                        >
                          <Sliders className="w-3.5 h-3.5 text-blue-400" />
                          <span>Tools</span>
                        </button>

                        {/* Removable Chip: Grounding with Google Search */}
                        {isGroundingChipActive && (
                          <div className="px-2.5 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-1.5 font-medium flex-wrap max-w-full">
                            <Search className="w-3.5 h-3.5 text-blue-400" />
                            <span>Grounding with Google Search</span>
                            <button
                              onClick={() => {
                                setIsGroundingChipActive(false);
                                setToolsState((prev) => ({ ...prev, groundingSearch: false }));
                                showToast('Chip Grounding Search dihapus');
                              }}
                              className="p-0.5 hover:bg-blue-900/80 rounded transition-all text-blue-400 hover:text-slate-900 dark:text-white cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => showToast('Gunakan perintah suara untuk merekam prompt')}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all cursor-pointer"
                        >
                          <Mic className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => showToast('Tambahkan file sampel/referensi ke prompt')}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all cursor-pointer"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Run Button */}
                      <button
                        onClick={() => handleRunPrompt(undefined, false)}
                        disabled={isGenerating}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer flex-wrap max-w-full"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Running...</span>
                          </>
                        ) : (
                          <>
                            <span>Run</span>
                            <span className="text-[10px] text-blue-200 opacity-80 font-normal">Ctrl ↵</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Output / Response Panel in Playground */}
                {(playgroundOutput || isGenerating) && (
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800/80 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2 flex-wrap max-w-full">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Output Response</span>
                      </h3>
                      {playgroundOutput && (
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap max-w-full">
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                            {playgroundOutput.modelUsed}
                          </span>
                          <span>{playgroundOutput.timestamp}</span>
                        </div>
                      )}
                    </div>

                    {isGenerating ? (
                      <div className="p-6 rounded-2xl bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400 text-xs animate-pulse">
                        <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                        <span>Gemini AI Studio sedang mengolah request Anda...</span>
                      </div>
                    ) : playgroundOutput ? (
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800/90 space-y-4 shadow-2xl">
                        {playgroundOutput.imageUrl && (
                          <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700/80 shadow-2xl">
                            <img
                              src={playgroundOutput.imageUrl}
                              alt="Generasi AI"
                              className="w-full h-auto object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-slate-100 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono overflow-x-auto max-h-[350px]">
                          {playgroundOutput.text}
                        </div>

                        {playgroundOutput.groundingSources && playgroundOutput.groundingSources.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 flex-wrap max-w-full">
                              <Globe className="w-3 h-3" />
                              Sumber Grounding Google Search:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {playgroundOutput.groundingSources.map((src, idx) => (
                                <a
                                  key={idx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-1 hover:underline flex-wrap max-w-full"
                                >
                                  <span>{src.title || src.url}</span>
                                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(playgroundOutput.text);
                              showToast('Respons disalin ke clipboard!');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer flex-wrap max-w-full"
                          >
                            <Copy className="w-3.5 h-3.5 text-blue-400" />
                            <span>Copy Output</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('build_workspace');
                              showToast('Buka di Build Workspace');
                            }}
                            className="px-4 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer flex-wrap max-w-full"
                          >
                            <span>Open in Workspace</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Right Panel: RUN SETTINGS (Floating Drawer Overlay) */}
              {showSettingsPanel && (
                <aside className="absolute right-0 top-0 bottom-0 z-30 w-80 bg-white dark:bg-[#0d1322] border-l border-slate-200 dark:border-slate-800 p-5 space-y-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-400" />
                      <span>Run Settings</span>
                    </h3>
                    <button
                      onClick={() => setShowSettingsPanel(false)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Tutup Panel Settings"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                {/* Active Model Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      showToast(`Model diubah ke ${e.target.value}`);
                    }}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="gemini-3-pro">Gemini 3 Pro</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                    Our most intelligent model built for speed, combining frontier intelligence with superior search and grounding.
                  </p>
                </div>

                {/* System Instructions */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>System instructions</span>
                    <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                  </label>
                  <textarea
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                    placeholder="Optional tone and style instructions for the model..."
                    rows={3}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs rounded-xl p-2.5 focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-500">
                    Atur peran khusus (seperti "Senior Software Architect") sebelum prompt diproses.
                  </p>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-2.5 bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Temperature</label>
                    <span className="text-xs font-bold text-blue-400 font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      {temperature.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="2.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    {temperature <= 0.3
                      ? '🔒 Rendah (0.0 - 0.3): Deterministik, konsisten, presisi koding.'
                      : temperature <= 1.2
                      ? '⚖️ Seimbang (0.4 - 1.2): Kreativitas alami dengan logika terjaga.'
                      : '🎨 Tinggi (1.3 - 2.0): Sangat ekspresif & eksploratif.'}
                  </p>
                </div>

                {/* Thinking Level Dropdown */}
                <div className="space-y-2 relative">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Thinking level</label>
                  <div
                    onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:border-slate-300 dark:border-slate-700"
                  >
                    <span className="font-semibold text-blue-300">{thinkingLevel}</span>
                    <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>

                  {isThinkingOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-1 z-20 space-y-1">
                      {(['High', 'Medium', 'Low'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setThinkingLevel(level);
                            setIsThinkingOpen(false);
                            showToast(`Thinking level diubah ke ${level}`);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                            thinkingLevel === level
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800'
                          }`}
                        >
                          <span>{level}</span>
                          {thinkingLevel === level && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">
                    High = Pemikiran mendalam multi-langkah untuk penyelesaian masalah kompleks.
                  </p>
                </div>

                {/* Tools Section Toggles */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Tools Toggle
                  </span>

                  {/* Toggle 1: Structured outputs */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div>
                      <span className="text-slate-700 dark:text-slate-200 font-medium block">Structured outputs</span>
                      <span className="text-[10px] text-slate-500">JSON Schema enforcement</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap max-w-full">
                      <button
                        onClick={() => showToast('Edit JSON Schema untuk Structured Outputs')}
                        className="text-[10px] text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setToolsState((prev) => ({ ...prev, structuredOutputs: !prev.structuredOutputs }));
                          showToast(`Structured outputs: ${!toolsState.structuredOutputs ? 'ON' : 'OFF'}`);
                        }}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all ${
                          toolsState.structuredOutputs ? 'bg-blue-600 justify-end' : 'bg-slate-100 dark:bg-slate-800 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Toggle 2: Code execution */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div>
                      <span className="text-slate-700 dark:text-slate-200 font-medium block">Code execution</span>
                      <span className="text-[10px] text-slate-500">Jalankan skrip Python/JS aman</span>
                    </div>
                    <button
                      onClick={() => {
                        setToolsState((prev) => ({ ...prev, codeExecution: !prev.codeExecution }));
                        showToast(`Code execution: ${!toolsState.codeExecution ? 'ON' : 'OFF'}`);
                      }}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all ${
                        toolsState.codeExecution ? 'bg-blue-600 justify-end' : 'bg-slate-100 dark:bg-slate-800 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>

                  {/* Toggle 3: Function calling */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div>
                      <span className="text-slate-700 dark:text-slate-200 font-medium block">Function calling</span>
                      <span className="text-[10px] text-slate-500">Panggil API eksternal</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap max-w-full">
                      <button
                        onClick={() => showToast('Edit Deklarasi Fungsi API')}
                        className="text-[10px] text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setToolsState((prev) => ({ ...prev, functionCalling: !prev.functionCalling }));
                          showToast(`Function calling: ${!toolsState.functionCalling ? 'ON' : 'OFF'}`);
                        }}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all ${
                          toolsState.functionCalling ? 'bg-blue-600 justify-end' : 'bg-slate-100 dark:bg-slate-800 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Toggle 4: Grounding with Google Search */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div>
                      <span className="text-slate-700 dark:text-slate-200 font-medium block">Grounding Google Search</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Source: G Google Search</span>
                    </div>
                    <button
                      onClick={() => {
                        const nextVal = !toolsState.groundingSearch;
                        setToolsState((prev) => ({ ...prev, groundingSearch: nextVal }));
                        setIsGroundingChipActive(nextVal);
                        showToast(`Grounding Search: ${nextVal ? 'ON' : 'OFF'}`);
                      }}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all ${
                        toolsState.groundingSearch ? 'bg-blue-600 justify-end' : 'bg-slate-100 dark:bg-slate-800 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>

                  {/* Toggle 5: Grounding with Google Maps */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div>
                      <span className="text-slate-700 dark:text-slate-200 font-medium block">Grounding Google Maps</span>
                      <span className="text-[10px] text-slate-500">Lokasi & data spasial</span>
                    </div>
                    <button
                      onClick={() => {
                        setToolsState((prev) => ({ ...prev, groundingMaps: !prev.groundingMaps }));
                        showToast(`Grounding Maps: ${!toolsState.groundingMaps ? 'ON' : 'OFF'}`);
                      }}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all ${
                        toolsState.groundingMaps ? 'bg-blue-600 justify-end' : 'bg-slate-100 dark:bg-slate-800 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}

          {/* ========================================================= */}
          {/* VIEW 2: TAHAP 2 - BUILD WORKSPACE (App Development Canvas) */}
          {/* ========================================================= */}
          {activeTab === 'build_workspace' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Workspace Top Header Bar */}
              <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 px-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 flex-wrap max-w-full">
                  <button
                    onClick={() => setActiveTab('playground')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all flex-wrap max-w-full"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
                    <span>Back to start</span>
                  </button>

                  <div className="h-4 w-[1px] bg-slate-100 dark:bg-slate-800" />

                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <input
                      value={workspaceAppTitle}
                      onChange={(e) => setWorkspaceAppTitle(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-blue-500 px-1"
                    />
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <button
                    onClick={() => showToast('Aplikasi di-Remix!')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 flex-wrap max-w-full"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Remix</span>
                  </button>
                  <button
                    onClick={() => showToast('Link pembagian disalin ke clipboard!')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 flex-wrap max-w-full"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => showToast('Aplikasi berhasil dipublikasikan ke Maxy Academy Cloud!')}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Publish
                  </button>
                </div>
              </div>

              {/* Workspace Main Vertical Stack (Chat Top, Live Preview Bottom) */}
              <div className="flex-1 flex flex-col overflow-y-auto bg-slate-100 dark:bg-slate-950">
                {/* Top Panel: Chat & AI Iteration */}
                <div className="w-full bg-white dark:bg-[#0d1322] border-b border-slate-200 dark:border-slate-800 p-4 md:p-5 flex flex-col justify-between shrink-0 space-y-4">
                  {/* Chat History List */}
                  <div className="space-y-4 overflow-y-auto flex-1 pr-1 min-w-0">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="space-y-2">
                        {msg.sender === 'user' ? (
                          <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-3.5 text-xs text-slate-700 dark:text-slate-200">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                              User Prompt
                            </span>
                            <p className="leading-relaxed font-medium">{msg.text}</p>
                          </div>
                        ) : (
                          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-xs text-slate-600 dark:text-slate-300 space-y-2 shadow-lg">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-purple-400 flex items-center gap-1 flex-wrap max-w-full">
                                <Sparkles className="w-3 h-3" />
                                Gemini 3.6 Flash
                              </span>
                              <span className="text-slate-500 font-mono">{msg.duration || 'Ran for 10s'}</span>
                            </div>

                            <p className="text-slate-700 dark:text-slate-200 font-semibold">{msg.text}</p>

                            {msg.bullets && (
                              <ul className="space-y-1.5 pt-1">
                                {msg.bullets.map((b, bIdx) => (
                                  <li key={bIdx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                                    <span className="text-blue-400 font-bold">•</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {isGenerating && (
                      <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 animate-pulse flex-wrap max-w-full">
                        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                        <span>Gemini 3 sedang menulis kode & memperbarui preview...</span>
                      </div>
                    )}
                  </div>

                  {/* Quick-chip Suggestions & Chat Input */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '+ AI Features',
                        '+ Tambah Modul 18',
                        '+ Fitur Analisis',
                      ].map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => {
                            setWorkspaceInput(`Tambahkan ${chip.replace('+', '')} ke dalam aplikasi`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-all"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    <div className="relative rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 flex items-center gap-2 flex-wrap max-w-full">
                      <input
                        value={workspaceInput}
                        onChange={(e) => setWorkspaceInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendWorkspaceMessage()}
                        placeholder="Make changes, add new features, ask for anything..."
                        className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none min-w-0"
                      />
                      <button className="p-1.5 text-slate-500 hover:text-slate-600 dark:text-slate-300">
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-slate-600 dark:text-slate-300">
                        <Paperclip className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleSendWorkspaceMessage}
                        className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Panel: Live App Preview & Code Viewer */}
                <div className="w-full bg-slate-100 dark:bg-slate-950 flex flex-col min-h-[520px] p-2 md:p-4 space-y-3">
                  {/* Preview Toolbar */}
                  <div className="bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 p-2.5 px-4 flex items-center justify-between">
                    {/* Tabs: Preview vs Code */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex-wrap max-w-full">
                      <button
                        onClick={() => setWorkspaceTab('preview')}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                          workspaceTab === 'preview'
                            ? 'bg-blue-600 text-white font-bold shadow-md'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => setWorkspaceTab('code')}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                          workspaceTab === 'code'
                            ? 'bg-blue-600 text-white font-bold shadow-md'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </button>
                    </div>

                    {/* Controls right */}
                    <div className="flex items-center gap-2 flex-wrap max-w-full">
                      {/* Device Toggle */}
                      <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 flex-wrap max-w-full">
                        <button
                          onClick={() => setDeviceMode('desktop')}
                          className={`p-1 rounded-lg transition-all ${
                            deviceMode === 'desktop' ? 'bg-slate-100 dark:bg-slate-800 text-blue-400' : 'text-slate-500'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeviceMode('mobile')}
                          className={`p-1 rounded-lg transition-all ${
                            deviceMode === 'mobile' ? 'bg-slate-100 dark:bg-slate-800 text-blue-400' : 'text-slate-500'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => showToast('Memuat ulang Live Preview')}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => showToast('Mode Layar Penuh')}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Main Display Box */}
                  <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-auto min-w-0">
                    {workspaceTab === 'preview' ? (
                      /* Live Interactive App Preview */
                      <div
                        className={`transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
                          deviceMode === 'mobile' ? 'w-[360px] h-[520px]' : 'w-full h-full min-h-[450px]'
                        }`}
                      >
                        {/* App Topbar */}
                        <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap max-w-full">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-2">
                              {workspaceAppTitle}
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            LIVE v1.0
                          </span>
                        </div>

                        {/* App Interactive Body */}
                        <div className="p-6 flex-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 space-y-6 overflow-y-auto min-w-0">
                          <div className="text-center space-y-2">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold inline-block">
                              Powered by Gemini 3
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                              Maxy AI Navigator Platform
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                              Selamat datang di hub pembelajaran LLM interaktif Maxy Academy. Pelajari 18 modul mulai dari prompt engineering hingga Google AI Studio.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                              <p className="text-slate-500 dark:text-slate-400 text-[10px]">Total Modul</p>
                              <p className="text-lg font-bold text-amber-400">18 Modul AI</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                              <p className="text-slate-500 dark:text-slate-400 text-[10px]">Status Engine</p>
                              <p className="text-lg font-bold text-emerald-400">Active v3.6</p>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                              <span>Modul Terbaru: Google AI Studio</span>
                              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Pelajari cara memanfaatkan Grounding, System Instructions, Temperature, dan Thinking Level untuk membuat app bertaraf dunia.
                            </p>
                            <button
                              onClick={() => showToast('Simulasi Pengujian Modul Berhasil!')}
                              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
                            >
                              Uji Coba Simulator
                            </button>
                          </div>
                        </div>

                        {/* App Footer */}
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 text-center">
                          Build with ❤️ at Maxy Academy
                        </div>
                      </div>
                    ) : (
                      /* Live TypeScript Code Viewer */
                      <div className="w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 overflow-auto font-mono text-xs text-slate-600 dark:text-slate-300 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-[11px] text-slate-500">
                          <span>App.tsx - Maxy AI Navigator</span>
                          <button
                            onClick={() => showToast('Kode TypeScript disalin!')}
                            className="flex items-center gap-1 text-blue-400 hover:underline flex-wrap max-w-full"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </button>
                        </div>
                        <pre className="text-blue-300 leading-relaxed">
                          {`import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

// Maxy Academy AI Studio Integration
export const MaxyAINavigator = () => {
  const [model, setModel] = useState('${selectedModel}');
  const [temperature, setTemperature] = useState(${temperature});
  const [thinkingLevel, setThinkingLevel] = useState('${thinkingLevel}');

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const handleGenerate = async (prompt: string) => {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: temperature,
        systemInstruction: "${systemInstruction}",
        tools: [
          ${toolsState.groundingSearch ? '{ googleSearch: {} },' : ''}
          ${toolsState.codeExecution ? '{ codeExecution: {} },' : ''}
        ]
      }
    });
    return response.text;
  };

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-950 text-white">
      <h1>Maxy AI Navigator Dashboard</h1>
      {/* Interactive Render */}
    </div>
  );
};`}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: MY APPS PAGE                                       */}
          {/* ========================================================= */}
          {activeTab === 'my_apps' && (
            <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap max-w-full">
                    <LayoutGrid className="w-5 h-5 text-blue-400" />
                    My Apps
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Daftar aplikasi buatan Anda di Google AI Studio Maxy Academy.
                  </p>
                </div>

                <button
                  onClick={() => handleStartBuilding('Buat aplikasi baru dari scratch')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all flex-wrap max-w-full"
                >
                  <Plus className="w-4 h-4" />
                  <span>New App</span>
                </button>
              </div>

              {/* Table / Cards List */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Aplikasi</span>
                  <span>Diperbarui</span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {myAppsList.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        setWorkspaceAppTitle(app.name);
                        setActiveTab('build_workspace');
                        showToast(`Membuka workspace "${app.name}"`);
                      }}
                      className="p-4 hover:bg-slate-100 dark:bg-slate-800/50 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap max-w-full">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{app.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              app.status === 'Active'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{app.description}</p>
                      </div>

                      <div className="text-right text-xs text-slate-500">
                        <p>{app.updatedAt}</p>
                        <p className="text-[10px] text-slate-600">Dibuat: {app.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 4: COMMUNITY GALLERY PAGE                            */}
          {/* ========================================================= */}
          {activeTab === 'gallery' && (
            <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
              <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap max-w-full">
                  <Compass className="w-6 h-6 text-purple-400" />
                  Community App Gallery
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Temukan & remix aplikasi, game, dan proyek AI buatan komunitas Maxy Academy.
                </p>

                {/* Categories filter chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Featured',
                    'All apps',
                    'Gemini 3',
                    'Games and Visualizations',
                    'Tools',
                  ].map((cat, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => setGalleryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        galleryFilter === cat
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-500">{item.remixes} remixes</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-500">{item.model}</span>
                      <button
                        onClick={() => {
                          setWorkspaceAppTitle(`Remix: ${item.title}`);
                          setActiveTab('build_workspace');
                          showToast(`Membuka remix "${item.title}"`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs border border-purple-500/30 transition-all flex items-center gap-1.5 flex-wrap max-w-full"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Remix App</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 5: DASHBOARD > API KEYS PAGE                          */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap max-w-full">
                    <Key className="w-5 h-5 text-amber-400" />
                    API Keys Dashboard
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kelola API Keys Gemini untuk project Maxy Academy Anda.
                  </p>
                </div>

                <button
                  onClick={() => showToast('API Key Baru Berhasil Dibuat!')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all flex-wrap max-w-full"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create API key</span>
                </button>
              </div>

              {/* API Key Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 grid grid-cols-12 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="col-span-3">Key</span>
                  <span className="col-span-4">Project</span>
                  <span className="col-span-3">Dibuat</span>
                  <span className="col-span-2 text-right">Billing Tier</span>
                </div>

                <div className="p-4 grid grid-cols-12 text-xs text-slate-700 dark:text-slate-200 items-center border-b border-slate-200 dark:border-slate-800/80">
                  <div className="col-span-3 font-mono text-amber-300 flex items-center gap-2 flex-wrap max-w-full">
                    <span>...g90g</span>
                    <button
                      onClick={() => showToast('API Key disalin!')}
                      className="text-slate-500 hover:text-slate-900 dark:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="col-span-4">
                    <p className="font-bold text-slate-900 dark:text-white">MAXY Academy Task 1</p>
                    <p className="text-[10px] text-slate-500 font-mono">gen-lang-client-0345334223</p>
                  </div>
                  <div className="col-span-3 text-slate-500 dark:text-slate-400">
                    27 Jan 2026
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Free Tier
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
