import React, { useState } from 'react';
import {
  Sparkles, Search, Compass, Calendar, FileText, ArrowRight, X,
  Plus, Check, MessageSquare, Briefcase, Code, Clock, Layers,
  ChevronDown, Mic, Send, ExternalLink, HelpCircle, User, CreditCard,
  Grid, Globe, Shield, Zap, Sliders, CheckCircle2, ChevronRight, Play, RefreshCw, AlertTriangle
} from 'lucide-react';

export const MistralVibeReplica: React.FC = () => {
  // Stage control: 'landing' | 'onboarding' | 'workspace'
  const [activeStage, setActiveStage] = useState<'landing' | 'onboarding' | 'workspace'>('landing');

  // Workspace active tab: 'Chat' | 'Work' | 'Code'
  const [workspaceTab, setWorkspaceTab] = useState<'Chat' | 'Work' | 'Code'>('Work');

  // Onboarding Carousel Slide Index (0 to 3)
  const [carouselSlide, setCarouselSlide] = useState<number>(0);

  // App Connected State (Google Workspace, GitHub, Slack)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showConnectBanner, setShowConnectBanner] = useState<boolean>(true);

  // Speed Mode State
  const [speedMode, setSpeedMode] = useState<string>('Fast');
  const [isSpeedOpen, setIsSpeedOpen] = useState<boolean>(false);

  // Input & Chat State in Workspace / Landing
  const [promptInput, setPromptInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'agent'; content: string; steps?: string[]; error?: boolean }[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [runningSteps, setRunningSteps] = useState<string[]>([]);
  const [agentError, setAgentError] = useState<string | null>(null);

  // Active Project Context & Projects List State
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<string[]>(['Maxy Academy Q3 Launch', 'AI Course Curriculum']);

  // Dynamic Suggestions State
  const [customSuggestions, setCustomSuggestions] = useState<string[]>([]);

  // Sidebar Collapse State
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const onboardingSlides = [
    {
      title: 'Le Chat is now Vibe',
      badge: 'New',
      description: 'Meet your AI agent for long-horizon tasks and coding, fluent in your knowledge and tools.',
    },
    {
      title: 'Autonomous Task Execution',
      badge: 'Agentic Engine',
      description: 'Vibe breaks down complex projects into sequential steps, executing research, code generation, and app integrations.',
    },
    {
      title: 'Fluent in Your Tools',
      badge: 'Integrations',
      description: 'Connect Google Drive, Slack, GitHub, and email to give Vibe full context over your organizational knowledge base.',
    },
    {
      title: 'Work, Code & Chat Modes',
      badge: 'Specialized Modes',
      description: 'Seamlessly toggle between deep analytical workflows, code synthesis, and quick conversational reasoning.',
    }
  ];

  // Handle Prompt Submission to Gemini API
  const handleRunAgent = async (customPrompt?: string) => {
    const textToSend = customPrompt || promptInput;
    if (!textToSend.trim()) return;

    if (activeStage === 'landing') {
      setActiveStage('workspace');
    }

    setPromptInput('');
    setAgentError(null);
    const userMsg = { role: 'user' as const, content: textToSend };
    setChatHistory(prev => [...prev, userMsg]);
    setIsAgentRunning(true);

    // Initial progressive steps
    const initialSteps = [
      `Memindai konteks mode ${workspaceTab}${activeProject ? ` (Proyek: ${activeProject})` : ''}...`,
      'Menghubungkan ke Vibe Agentic Engine & Gemini API...',
      'Mengeksekusi alur kerja mandiri (Long-Horizon Execution)...'
    ];
    setRunningSteps([initialSteps[0]]);

    // Step animation interval
    let stepIndex = 1;
    const stepInterval = setInterval(() => {
      if (stepIndex < initialSteps.length) {
        setRunningSteps(prev => [...prev, initialSteps[stepIndex]]);
        stepIndex++;
      }
    }, 700);

    try {
      const response = await fetch('/api/mistral-vibe-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          mode: workspaceTab,
          project: activeProject,
          isConnected: isConnected,
          speedMode: speedMode,
          history: chatHistory.slice(-6)
        })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      const finalSteps = data.steps && data.steps.length > 0 ? data.steps : initialSteps;
      const finalContent = data.content || '📌 Hasil Eksekusi Mandiri:\n- Permintaan berhasil diproses oleh Mistral Vibe Agent.';

      // Add agent response
      setChatHistory(prev => [
        ...prev,
        { role: 'agent', content: finalContent, steps: finalSteps }
      ]);

      // Add new suggestion if provided
      if (data.suggestedTask) {
        setCustomSuggestions(prev => Array.from(new Set([data.suggestedTask, ...prev])));
      }

      showToast(`⚡ Eksekusi selesai dalam mode ${workspaceTab}`);

    } catch (err: any) {
      clearInterval(stepInterval);
      console.error("Vibe Agent Error:", err);
      const errMsg = err.message || "Gagal menghubungkan ke Mistral Vibe API.";
      setAgentError(errMsg);

      // Fallback response with error state
      setChatHistory(prev => [
        ...prev,
        {
          role: 'agent',
          error: true,
          steps: ['Memproses permintaan...', '⚠️ Mengalami kendala koneksi API'],
          content: `⚠️ Error Eksekusi: ${errMsg}\n\n📌 Catatan Pembetulan:\n- Pastikan sistem terhubung ke internet.\n- Mode ${workspaceTab} akan mencoba kembali secara otomatis jika prompt dikirim ulang.`
        }
      ]);
    } finally {
      setIsAgentRunning(false);
      setRunningSteps([]);
    }
  };

  return (
    <div className="w-full min-h-[750px] bg-[#0c0d0e] text-slate-800 dark:text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col relative shadow-2xl">
      {/* Stage Indicator Bar */}
      <div className="bg-[#141518] border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs shrink-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-orange-600 flex items-center justify-center font-black text-slate-900 dark:text-white text-[10px] shadow">
            M
          </div>
          <span className="font-extrabold text-slate-700 dark:text-slate-200">Mistral Vibe Studio</span>
          <span className="text-slate-500 hidden sm:inline">| Simulasi Interactive Agent</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#0a0b0d] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveStage('landing')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'landing' ? 'bg-orange-600 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
          >
            TAHAP 1: Landing Page
          </button>
          <button
            onClick={() => setActiveStage('onboarding')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'onboarding' ? 'bg-orange-600 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
          >
            TAHAP 2: Onboarding Modal
          </button>
          <button
            onClick={() => setActiveStage('workspace')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'workspace' ? 'bg-orange-600 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
          >
            TAHAP 3: Workspace Utama
          </button>
        </div>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-orange-600 text-slate-900 dark:text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-orange-400 flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-orange-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* STAGE 1: LANDING PAGE PRODUK */}
      {activeStage === 'landing' && (
        <div className="flex-1 bg-[#fbf9f6] text-slate-900 overflow-y-auto flex flex-col">
          {/* Top Navbar */}
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-2 font-black text-xl tracking-tighter text-black cursor-pointer">
                <div className="w-7 h-7 bg-black text-orange-500 font-mono font-black flex items-center justify-center text-sm rounded">
                  M
                </div>
                <span>mistral</span>
              </div>

              {/* Menu Links */}
              <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-700">
                <span className="hover:text-black cursor-pointer">Products</span>
                <span className="hover:text-black cursor-pointer">Solutions</span>
                <span className="hover:text-black cursor-pointer">Research</span>
                <span className="hover:text-black cursor-pointer">Developers</span>
                <span className="hover:text-black cursor-pointer">Blog</span>
                <span className="hover:text-black cursor-pointer">Customers</span>
                <span className="hover:text-black cursor-pointer">Company</span>
              </nav>
            </div>

            <div className="flex items-center space-x-3 text-xs font-bold">
              <button 
                onClick={() => showToast('Start building: Akses API & Developer Console')}
                className="px-3 py-1.5 rounded hover:bg-slate-100 text-slate-800 flex items-center space-x-1 border border-slate-300"
              >
                <span>Start building</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              <button
                onClick={() => setActiveStage('onboarding')}
                className="bg-black hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-1.5 rounded flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Try Vibe</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
            </div>
          </header>

          {/* Main Hero Content */}
          <div className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-10 space-y-8 flex flex-col justify-center">
            {/* Breadcrumb */}
            <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
              PRODUCTS · VIBE
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
              <span className="line-through text-slate-500 dark:text-slate-400 font-light mr-1">Work</span>
              <span>Vibe.</span>
            </h1>

            {/* Orange Hero Box Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Tagline & CTA */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex space-x-1 text-slate-500 dark:text-slate-400 text-sm font-mono">
                    <span>↓</span>
                    <span>↓</span>
                    <span>↓</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
                    Your AI agent for long-horizon tasks, fluent in your knowledge and tools.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => setActiveStage('onboarding')}
                    className="bg-black hover:bg-white dark:bg-slate-900 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg flex items-center space-x-2 transition-transform hover:scale-105"
                  >
                    <span>Try it free</span>
                    <ArrowRight className="w-4 h-4 text-orange-400" />
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Orange Card */}
              <div className="lg:col-span-7 bg-[#f95c16] rounded-3xl p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative flex flex-col justify-between space-y-6 overflow-hidden">
                {/* Pixel Cat Icon */}
                <div className="absolute top-4 right-8 opacity-90 font-mono text-xs bg-black/20 px-2 py-0.5 rounded text-slate-900 dark:text-white flex items-center space-x-1">
                  <span>🐱</span>
                  <span className="text-[10px]">vibe-agent</span>
                </div>

                {/* Search Bar Input */}
                <div className="space-y-4 pt-4">
                  <div className="bg-white rounded-2xl p-2.5 flex items-center shadow-lg text-slate-800">
                    <input
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRunAgent();
                      }}
                      placeholder="Ask me anything..."
                      className="w-full bg-transparent px-3 text-sm focus:outline-none placeholder-slate-400 font-medium"
                    />
                    <button
                      onClick={() => handleRunAgent()}
                      disabled={!promptInput.trim()}
                      className="w-9 h-9 bg-[#f95c16] hover:bg-orange-700 disabled:opacity-50 text-slate-900 dark:text-white rounded-xl flex items-center justify-center shrink-0 shadow transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>

                  {/* 4 Quick Prompt Examples */}
                  <div className="bg-white rounded-2xl p-3 shadow-lg text-slate-800 space-y-2 text-xs font-semibold">
                    {[
                      { icon: <Grid className="w-4 h-4 text-slate-500" />, text: "Draft a framework for running QBRs" },
                      { icon: <Search className="w-4 h-4 text-slate-500" />, text: "Deep research on the latest AI news" },
                      { icon: <Compass className="w-4 h-4 text-slate-500" />, text: "Plan my next trip to Japan" },
                      { icon: <Calendar className="w-4 h-4 text-slate-500" />, text: "Summarize my unread emails and draft responses" }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setPromptInput(item.text);
                          handleRunAgent(item.text);
                        }}
                        className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        {item.icon}
                        <span className="truncate">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Explanatory Banner for Educational Context */}
            <div className="bg-slate-100 border border-slate-300 rounded-2xl p-5 text-xs text-slate-700 space-y-2">
              <strong className="text-slate-900 text-sm block">💡 Positioning Product: Mistral Vibe (Agent vs Chatbot Biasa)</strong>
              <p>
                Mistral Vibe bukan sekadar chatbot biasa yang menjawab pertanyaan sepotong-sepotong. Vibe dirancang sebagai <strong className="text-slate-900">AI Agent mandiri untuk tugas jangka panjang (long-horizon tasks)</strong> yang mampu menghubungkan data perusahaan, menulis kode kompleks, serta mengeksekusi rencana secara bertahap.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: ONBOARDING MODAL "MEET VIBE" OVERLAY */}
      {activeStage === 'onboarding' && (
        <div className="flex-1 bg-[#090a0c] relative flex items-center justify-center p-4">
          {/* Blurred background preview of workspace */}
          <div className="absolute inset-0 opacity-20 pointer-events-none filter blur-sm bg-gradient-to-br from-slate-900 via-black to-slate-950 p-8 space-y-6">
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>
            <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full"></div>
          </div>

          {/* Modal Overlay Box */}
          <div className="relative w-full max-w-md bg-[#12141a] border border-slate-300 dark:border-slate-700 rounded-3xl overflow-hidden shadow-2xl z-20 flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => {
                setActiveStage('workspace');
                showToast('Masuk ke Workspace Utama');
              }}
              className="absolute top-4 right-4 z-30 p-2 bg-black/40 hover:bg-black/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Illustration Graphic Area */}
            <div className="bg-gradient-to-b from-slate-900 via-[#181a24] to-[#12141a] p-8 text-center border-b border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative min-h-[200px]">
              {/* Grid Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2330_1px,transparent_1px),linear-gradient(to_bottom,#1f2330_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

              <div className="relative z-10 space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Meet</h2>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-[#f95c16] rounded-lg flex items-center justify-center font-black text-slate-900 dark:text-white text-lg shadow-lg">
                    M
                  </div>
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Vibe</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  {onboardingSlides[carouselSlide].badge}
                </span>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {onboardingSlides[carouselSlide].title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {onboardingSlides[carouselSlide].description}
                </p>
              </div>

              {/* Carousel Footer & Dots */}
              <div className="flex items-center justify-between pt-2">
                {/* Dot Navigation */}
                <div className="flex items-center space-x-1.5">
                  {onboardingSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselSlide(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${carouselSlide === idx ? 'bg-[#f95c16] w-6' : 'bg-slate-700 hover:bg-slate-500'}`}
                    />
                  ))}
                </div>

                {/* Next / Finish Button */}
                <button
                  onClick={() => {
                    if (carouselSlide < onboardingSlides.length - 1) {
                      setCarouselSlide(prev => prev + 1);
                    } else {
                      setActiveStage('workspace');
                      showToast('Selesai Onboarding! Selamat datang di Workspace Vibe.');
                    }
                  }}
                  className="bg-white hover:bg-slate-200 text-black font-extrabold text-xs px-5 py-2 rounded-xl transition-all shadow-md"
                >
                  {carouselSlide < onboardingSlides.length - 1 ? 'Next' : 'Get Started'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: WORKSPACE UTAMA */}
      {activeStage === 'workspace' && (
        <div className="flex-1 flex flex-col md:flex-row bg-[#0b0c0e] text-slate-800 dark:text-slate-100 overflow-hidden">
          {/* LEFT SIDEBAR */}
          <aside className={`${sidebarCollapsed ? 'w-16' : 'w-full md:w-64'} bg-[#121318] border-r border-slate-200 dark:border-slate-800/80 p-3 flex flex-col justify-between shrink-0 transition-all duration-200 z-20`}>
            <div className="space-y-4">
              {/* Header Logo + Search & Toggle Icons */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-[#f95c16] rounded-lg flex items-center justify-center font-black text-slate-900 dark:text-white text-sm shadow">
                    M
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex items-center space-x-1 font-extrabold text-sm text-slate-900 dark:text-white cursor-pointer">
                      <span>Vibe</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button onClick={() => showToast('Search: Cari riwayat chat/project sebelumnya')} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 rounded-lg">
                    <Search className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 rounded-lg hidden md:block"
                    title="Toggle Sidebar"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!sidebarCollapsed && (
                <>
                  {/* Tab Switcher: Chat | Work | Code */}
                  <div className="grid grid-cols-3 bg-[#1a1c24] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <button
                      onClick={() => {
                        setWorkspaceTab('Chat');
                        showToast('Mode Chat: Diskusi umum & interaksi cepat');
                      }}
                      className={`py-1.5 rounded-lg transition-all ${workspaceTab === 'Chat' ? 'bg-[#252834] text-slate-900 dark:text-white shadow' : 'hover:text-slate-700 dark:text-slate-200'}`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => {
                        setWorkspaceTab('Work');
                        showToast('Mode Work: Eksekusi tugas & integrasi aplikasi');
                      }}
                      className={`py-1.5 rounded-lg transition-all ${workspaceTab === 'Work' ? 'bg-[#f95c16] text-slate-900 dark:text-white shadow' : 'hover:text-slate-700 dark:text-slate-200'}`}
                    >
                      Work
                    </button>
                    <button
                      onClick={() => {
                        setWorkspaceTab('Code');
                        showToast('Mode Code: Sintesis & refactoring kode');
                      }}
                      className={`py-1.5 rounded-lg transition-all ${workspaceTab === 'Code' ? 'bg-[#252834] text-slate-900 dark:text-white shadow' : 'hover:text-slate-700 dark:text-slate-200'}`}
                    >
                      Code
                    </button>
                  </div>

                  {/* Menu Options */}
                  <div className="space-y-1 pt-1 text-xs">
                    <button
                      onClick={() => {
                        setChatHistory([]);
                        showToast('Percakapan Baru Dimulai');
                      }}
                      className="w-full flex items-center space-x-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold transition-all"
                    >
                      <Plus className="w-4 h-4 text-orange-400" />
                      <span>New Chat</span>
                    </button>

                    <button
                      onClick={() => showToast('Context: Tempat menyimpan preferensi & basis data tim')}
                      className="w-full flex items-center space-x-3 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-700 dark:text-slate-200 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Context</span>
                    </button>

                    <button
                      onClick={() => showToast('Scheduled (Preview): Jadwalkan tugas otomatis berulang')}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-700 dark:text-slate-200 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4" />
                        <span>Scheduled</span>
                      </div>
                      <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-800 px-1.5 py-0.5 rounded font-mono">
                        Preview
                      </span>
                    </button>
                  </div>

                  {/* Projects Section */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                      <span>Projects</span>
                      <button
                        onClick={() => {
                          const newProj = prompt('Masukkan nama proyek baru:');
                          if (newProj && newProj.trim()) {
                            setProjects(prev => [...prev, newProj.trim()]);
                            setActiveProject(newProj.trim());
                            showToast(`Proyek "${newProj.trim()}" ditambahkan & diaktifkan!`);
                          }
                        }}
                        className="p-1 hover:text-slate-900 dark:text-white"
                        title="Tambah Proyek"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {projects.map((p, idx) => {
                        const isSelected = activeProject === p;
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (isSelected) {
                                setActiveProject(null);
                                showToast('Konteks proyek dinonaktifkan (Umum)');
                              } else {
                                setActiveProject(p);
                                showToast(`Konteks proyek aktif: ${p}`);
                              }
                            }}
                            className={`p-2 rounded-xl text-xs cursor-pointer truncate flex items-center justify-between transition-all ${isSelected ? 'bg-orange-600/30 border border-orange-500/50 text-orange-200 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800/60'}`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-orange-400' : 'bg-slate-500'}`}></span>
                              <span className="truncate">{p}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom User Info Panel */}
            {!sidebarCollapsed && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center space-x-3 px-1">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs shrink-0">
                    M
                  </div>
                  <div className="truncate text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-200 truncate">Maxy Team</div>
                    <div className="text-[10px] text-slate-500">Free Plan</div>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Upgrade to Pro: Buka akses model penalaran & kuota agent tanpa batas')}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-900 dark:text-white font-extrabold text-xs p-2.5 rounded-xl shadow flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Upgrade to Pro</span>
                  </div>
                  <CreditCard className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            )}
          </aside>

          {/* MAIN WORKSPACE AREA */}
          <main className="flex-1 flex flex-col bg-[#090a0c] overflow-y-auto p-4 sm:p-8 relative justify-between">
            {/* Upper Content Area */}
            <div className="max-w-2xl w-full mx-auto space-y-6 pt-4">
              {/* Central Big Logo */}
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-[#f95c16] rounded-2xl flex items-center justify-center font-black text-slate-900 dark:text-white text-2xl shadow-xl">
                  M
                </div>
              </div>

              {/* Dynamic Greeting & Active Project Context Badge */}
              <div className="space-y-2 text-center">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {workspaceTab === 'Work' && "Quiet hours Maxy, steady work"}
                  {workspaceTab === 'Chat' && "What's on your mind today, Maxy?"}
                  {workspaceTab === 'Code' && "Build, refactor, and deploy code, Maxy"}
                </h2>

                {activeProject && (
                  <div className="inline-flex items-center space-x-1.5 bg-orange-950/60 border border-orange-800/80 text-orange-300 text-[11px] font-semibold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    <span>Konteks Proyek: <strong>{activeProject}</strong></span>
                    <button onClick={() => setActiveProject(null)} className="ml-1 text-orange-400 hover:text-slate-900 dark:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* App Connected Banner */}
              {showConnectBanner && (
                <div className={`border rounded-2xl p-3.5 flex items-center justify-between shadow-lg text-xs transition-all ${isConnected ? 'bg-emerald-950/40 border-emerald-800/80' : 'bg-[#141620] border-slate-300 dark:border-slate-700/80'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${isConnected ? 'bg-emerald-900/60 border-emerald-700' : 'bg-blue-950 border-blue-800'}`}>
                      {isConnected ? <Check className="w-4 h-4 text-emerald-400" /> : <Globe className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 block">
                        {isConnected ? 'Apps Connected (Google Workspace, GitHub, Slack)' : 'Work mode is better with your apps connected'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isConnected ? 'Vibe Agent memiliki akses konteks basis data organisasi' : 'Google Workspace, GitHub, Slack'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setIsConnected(!isConnected);
                        showToast(isConnected ? 'Koneksi Aplikasi Dibatalkan' : 'Aplikasi Terhubung Secara Sukses!');
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${isConnected ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                    >
                      {isConnected ? 'Connected ✓' : 'Connect'}
                    </button>
                    <button onClick={() => setShowConnectBanner(false)} className="p-1 text-slate-500 hover:text-slate-600 dark:text-slate-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Interactive Input Box */}
              <div className="bg-[#161822] border border-slate-300 dark:border-slate-700/80 rounded-2xl p-3 shadow-2xl space-y-3 focus-within:border-orange-500 transition-colors">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRunAgent();
                  }}
                  placeholder={activeProject ? `Tanyakan atau minta Vibe eksekusi tugas untuk ${activeProject}...` : "Type / for quick access"}
                  className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none px-1"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => showToast('Tambah File / Perintah /')} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:bg-slate-800">
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Speed Toggle Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsSpeedOpen(!isSpeedOpen)}
                        className="bg-[#1d202c] border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1 text-[11px]"
                      >
                        <span>{speedMode}</span>
                        <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      </button>

                      {isSpeedOpen && (
                        <div className="absolute left-0 bottom-8 w-36 bg-[#1a1d28] border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl p-1 z-30 space-y-0.5 text-xs">
                          {['Fast', 'Reasoning', 'Pro Agent'].map(m => (
                            <button
                              key={m}
                              onClick={() => {
                                setSpeedMode(m);
                                setIsSpeedOpen(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-orange-600/30 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-between text-[11px]"
                            >
                              <span>{m}</span>
                              {speedMode === m && <Check className="w-3 h-3 text-orange-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => showToast('Input Suara / Mikrofon')} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:bg-slate-800">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRunAgent()}
                      disabled={!promptInput.trim() || isAgentRunning}
                      className="p-1.5 bg-[#f95c16] hover:bg-orange-600 disabled:opacity-40 text-slate-900 dark:text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progressive Agent Loading Box */}
              {isAgentRunning && (
                <div className="p-4 bg-[#141620] rounded-2xl border border-orange-500/50 shadow-xl space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-extrabold text-orange-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mistral Vibe Agent executing autonomous steps ({workspaceTab} Mode)...</span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-300">
                    {runningSteps.map((stepText, sIdx) => (
                      <div key={sIdx} className="flex items-center space-x-2 animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{stepText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat / Agent Execution Output Area */}
              {chatHistory.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {chatHistory.map((item, idx) => (
                    <div key={idx} className={`space-y-2 ${item.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${item.role === 'user' ? 'bg-orange-600 text-slate-900 dark:text-white font-bold max-w-[85%]' : item.error ? 'bg-red-950/60 border border-red-800 text-red-200 w-full' : 'bg-[#141620] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 w-full'}`}>
                        {item.steps && item.steps.length > 0 && (
                          <div className="mb-3 p-2.5 bg-black/40 rounded-xl space-y-1.5 text-[11px] text-orange-300 font-mono border border-slate-200 dark:border-slate-800">
                            <span className="font-bold block text-slate-500 dark:text-slate-400">⚡ Execution Steps:</span>
                            {item.steps.map((st, sidx) => (
                              <div key={sidx} className="flex items-center space-x-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{st}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{item.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Section: Suggested for you */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400">Suggested for you</span>
                  <button onClick={() => showToast('Menampilkan rekomendasi tugas agen')} className="text-slate-500 hover:text-slate-600 dark:text-slate-300 flex items-center space-x-1 text-[11px]">
                    <span>Discover more</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Dynamic Custom Suggestions from Gemini API */}
                  {customSuggestions.map((sugText, cIdx) => (
                    <div
                      key={`custom-${cIdx}`}
                      onClick={() => {
                        setPromptInput(sugText);
                        handleRunAgent(sugText);
                      }}
                      className="bg-orange-950/30 border border-orange-500/40 hover:border-orange-500 p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm text-orange-200"
                    >
                      <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="truncate font-semibold">{sugText}</span>
                      <span className="ml-auto text-[9px] bg-orange-900/60 px-1.5 py-0.5 rounded text-orange-300">Baru</span>
                    </div>
                  ))}

                  {/* Standard Mode Suggestions */}
                  {(workspaceTab === 'Work' ? [
                    { icon: <Briefcase className="w-4 h-4 text-orange-400" />, text: "Setup and discover what Work can do" },
                    { icon: <Search className="w-4 h-4 text-blue-400" />, text: "Deep research on the latest AI news" },
                    { icon: <Globe className="w-4 h-4 text-emerald-400" />, text: "Connect your apps for better answers" }
                  ] : workspaceTab === 'Code' ? [
                    { icon: <Code className="w-4 h-4 text-emerald-400" />, text: "Refactor React components for performance" },
                    { icon: <Zap className="w-4 h-4 text-amber-400" />, text: "Write unit tests for API endpoints" }
                  ] : [
                    { icon: <MessageSquare className="w-4 h-4 text-blue-400" />, text: "Draft a strategic plan for Q3" },
                    { icon: <Sparkles className="w-4 h-4 text-purple-400" />, text: "Summarize key market trends for 2026" }
                  ]).map((sug, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPromptInput(sug.text);
                        handleRunAgent(sug.text);
                      }}
                      className="bg-[#141620] border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/60 p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm text-slate-700 dark:text-slate-200"
                    >
                      {sug.icon}
                      <span className="truncate font-medium">{sug.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Help Icon */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => showToast('Bantuan & Dokumentasi Mistral Vibe')}
                className="p-2 bg-[#141620] hover:bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full border border-slate-200 dark:border-slate-800 shadow"
                title="Help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

