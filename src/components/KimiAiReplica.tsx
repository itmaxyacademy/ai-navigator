import React, { useState } from 'react';
import {
  Sparkles, Search, Code, LayoutGrid, FileText, Settings, Download,
  ChevronRight, ArrowRight, FolderPlus, CheckCircle2, Play, RefreshCw,
  X, Plus, FileSpreadsheet, Presentation, Layers, Bot, Sliders, HardDrive,
  Folder, Laptop, Compass, Database, Check, ExternalLink, HelpCircle,
  Terminal, Smartphone, Cloud, Cpu, Clock, Wrench, Share2, Shield,
  ChevronDown, MessageSquare, Globe, User, Gift, Send, AlertCircle
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'kimi';
  text: string;
}

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
}

interface WorkTask {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  steps?: string[];
  result?: string;
}

export const KimiAiReplica: React.FC = () => {
  // Global Active Stage: 'chat' | 'work' | 'code' | 'claw'
  const [activeStage, setActiveStage] = useState<'chat' | 'work' | 'code' | 'claw'>('chat');

  // Global State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // =========================================================
  // TAHAP 1: CHAT UTAMA STATE
  // =========================================================
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMode, setChatMode] = useState<'Instan' | 'Tinggi'>('Tinggi');
  const [showModeDropdown, setShowModeDropdown] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string>('Pilih proyek');
  const [showProjectDropdown, setShowProjectDropdown] = useState<boolean>(false);
  const [collapsedNav, setCollapsedNav] = useState<boolean>(false);
  const [activeFeatureChip, setActiveFeatureChip] = useState<string | null>(null);

  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'th-1',
      title: 'Analisis Kurikulum AI Maxy',
      messages: [
        { sender: 'user', text: 'Analisis struktur kurikulum AI Engineering Maxy Academy' },
        { sender: 'kimi', text: 'Struktur kurikulum AI Maxy Academy dirancang dengan rasio 70% praktik hands-on dan 30% teori dasar. Mencakup Prompt Engineering, LLM Integration, RAG Architecture, dan Multi-Agent Systems.' }
      ]
    },
    {
      id: 'th-2',
      title: 'Ringkasan Laporan AI 2026',
      messages: [
        { sender: 'user', text: 'Ringkas tren agentic AI tahun 2026' },
        { sender: 'kimi', text: 'Tren Agentic AI 2026 didominasi oleh autonomous task execution, WebBridge local file access, dan multi-agent swarms yang bekerja secara paralel tanpa intervensi manual berlebih.' }
      ]
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string | null>('th-1');
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([
    { sender: 'user', text: 'Analisis struktur kurikulum AI Engineering Maxy Academy' },
    { sender: 'kimi', text: 'Struktur kurikulum AI Maxy Academy dirancang dengan rasio 70% praktik hands-on dan 30% teori dasar. Mencakup Prompt Engineering, LLM Integration, RAG Architecture, dan Multi-Agent Systems.' }
  ]);

  // Start New Chat
  const handleStartNewChat = () => {
    setActiveThreadId(null);
    setActiveMessages([]);
    setChatInput('');
    setActiveFeatureChip(null);
    showToast('Obrolan Baru Dimulai (Memori Bersih)');
  };

  // Select Existing Thread
  const handleSelectThread = (thread: ChatThread) => {
    setActiveThreadId(thread.id);
    setActiveMessages(thread.messages);
    showToast(`Membuka obrolan: "${thread.title}"`);
  };

  // Send Main Chat Message
  const handleSendMainChat = async (overrideText?: string) => {
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setActiveMessages(prev => [...prev, userMsg]);
    if (!overrideText) setChatInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/kimi-ai-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'chat',
          prompt: textToSend,
          mode: chatMode,
          project: selectedProject,
          feature: activeFeatureChip
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal terhubung ke Kimi API');

      const kimiMsg: ChatMessage = { sender: 'kimi', text: data.text };
      setActiveMessages(prev => [...prev, kimiMsg]);

      // Update or create chat thread in sidebar
      if (!activeThreadId) {
        const newId = `th-${Date.now()}`;
        const newThread: ChatThread = {
          id: newId,
          title: data.titleSummary || textToSend.substring(0, 20) + '...',
          messages: [userMsg, kimiMsg]
        };
        setChatThreads(prev => [newThread, ...prev]);
        setActiveThreadId(newId);
      } else {
        setChatThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, messages: [...t.messages, userMsg, kimiMsg] } : t));
      }

    } catch (err: any) {
      console.error("Error Kimi Chat:", err);
      setErrorMessage(err.message || "Gagal mengirim pesan Kimi Chat.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // TAHAP 2: KIMI WORK STATE
  // =========================================================
  const [workTab, setWorkTab] = useState<'Work' | 'Chat'>('Work');
  const [workMode, setWorkMode] = useState<'Ask' | 'Agent' | 'Agent Swarm'>('Agent');
  const [workInput, setWorkInput] = useState<string>(
    'Open the browser and help me search for the latest AI industry trend report. Extract the key information from the first 3 pages and organize it into an Excel to ~/Documents/MaxyWorkspace'
  );

  const [tasks, setTasks] = useState<WorkTask[]>([
    { id: 't1', name: 'Kreasi Widget Dashboard Maxy', status: 'completed', steps: ['Membaca modul dashboard', 'Generate komponen React', 'Validasi linting'], result: 'Widget berhasil dibuat di /components/DashboardWidget.tsx' },
    { id: 't2', name: 'Organisasi Materi Kurikulum AI', status: 'in_progress', steps: ['Memindai folder kurikulum', 'Mengkategorikan tugas', 'Menyusun dokumen ringkasan'], result: 'Proses penyusunan 65%...' },
    { id: 't3', name: 'Panduan Pembuatan PPT Automatis', status: 'pending' },
    { id: 't4', name: 'Cara Memulai Vibecoding dengan Kimi', status: 'pending' },
  ]);
  const [isWorkRunning, setIsWorkRunning] = useState<boolean>(false);
  const [activeTaskResult, setActiveTaskResult] = useState<string | null>(null);

  // Run Kimi Work Task
  const handleRunWorkTask = async () => {
    if (!workInput.trim() || isWorkRunning) return;

    setErrorMessage(null);
    setIsWorkRunning(true);
    setActiveTaskResult(null);

    const taskId = `t-${Date.now()}`;
    const taskName = workInput.length > 35 ? workInput.substring(0, 35) + '...' : workInput;

    // Add task as in_progress
    const newTask: WorkTask = {
      id: taskId,
      name: taskName,
      status: 'in_progress',
      steps: ['Analisis instruksi tugas...', 'Menghubungkan WebBridge ke workspace local...']
    };
    setTasks(prev => [newTask, ...prev]);

    try {
      const res = await fetch('/api/kimi-ai-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'work',
          prompt: workInput,
          workTab,
          workMode,
          project: selectedProject
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses tugas Kimi Work');

      // Update task status to completed after short delay simulation
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === taskId ? {
          ...t,
          status: 'completed',
          steps: data.steps || ['Instruksi diproses', 'Eksekusi selesai'],
          result: data.content || 'Tugas Kimi Work berhasil diselesaikan!'
        } : t));

        setActiveTaskResult(data.content || 'Tugas selesai secara otonom.');
        setIsWorkRunning(false);
        showToast(`Tugas "${taskName}" Selesai Dikerjakan Agen!`);
      }, 1500);

    } catch (err: any) {
      console.error("Error Kimi Work:", err);
      setErrorMessage(err.message || "Gagal mengeksekusi tugas Kimi Work.");
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'pending' } : t));
      setIsWorkRunning(false);
    }
  };

  // Reset form for New Task
  const handleNewWorkTask = () => {
    setWorkInput('');
    setActiveTaskResult(null);
    showToast('Form tugas baru siap diisi');
  };

  // =========================================================
  // TAHAP 3: KIMI CODE STATE
  // =========================================================
  const [codeTab, setCodeTab] = useState<'terminal' | 'ide'>('terminal');
  const [cliOutput, setCliOutput] = useState<string[]>([
    `moonshot@KimiCode 🚀 welcome`,
    `==================================================`,
    `Kimi Code CLI (Model K2.7 Code) Ready`,
    `Ketik perintah di bawah atau klik tombol perintah contoh.`
  ]);
  const [cliInput, setCliInput] = useState<string>('');
  const [isTypingCli, setIsTypingCli] = useState<boolean>(false);

  // IDE State
  const [ideCodeInput, setIdeCodeInput] = useState<string>(
    `import React from 'react';\n\nexport const MaxyApp = () => {\n  // Kimi Code AI auto-completion active\n  return <div>Maxy Academy Kimi Code IDE</div>;\n};`
  );
  const [ideExplanation, setIdeExplanation] = useState<string | null>(null);

  // Run CLI Command via API
  const handleCliCommand = async (cmdToRun?: string) => {
    const cmd = cmdToRun || cliInput;
    if (!cmd.trim() || isTypingCli) return;

    setErrorMessage(null);
    setIsTypingCli(true);
    setCliOutput(prev => [...prev, `moonshot@KimiCode 🚀 ${cmd}`]);
    if (!cmdToRun) setCliInput('');

    try {
      const res = await fetch('/api/kimi-ai-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'code',
          command: cmd,
          type: 'cli'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengeksekusi command CLI');

      setCliOutput(prev => [...prev, data.output || `✓ Command '${cmd}' executed.`]);
    } catch (err: any) {
      console.error("Error Kimi Code CLI:", err);
      setCliOutput(prev => [...prev, `ERROR: ${err.message || 'Execution failed'}`]);
      setErrorMessage(err.message || "Gagal mengeksekusi komando terminal.");
    } finally {
      setIsTypingCli(false);
    }
  };

  // Run / Explain Code in IDE
  const handleRunIdeCode = async () => {
    if (!ideCodeInput.trim() || isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);
    setIdeExplanation(null);

    try {
      const res = await fetch('/api/kimi-ai-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'code',
          code: ideCodeInput,
          type: 'ide'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses kode di IDE');

      setIdeExplanation(data.output || 'Kode berhasil dieksekusi tanpa error sintaks.');
      showToast('Kimi Code IDE: Analisis Kode Selesai!');
    } catch (err: any) {
      console.error("Error Kimi IDE:", err);
      setErrorMessage(err.message || "Gagal memproses kode.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // TAHAP 4: KIMI CLAW STATE
  // =========================================================
  const [selectedDeployOption, setSelectedDeployOption] = useState<'cloud' | 'desktop' | 'android' | null>(null);
  const [deployingStatus, setDeployingStatus] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [openClawDeployedUrl, setOpenClawDeployedUrl] = useState<string | null>(null);

  // OpenClaw Chat State
  const [clawChatInput, setClawChatInput] = useState<string>('');
  const [clawMessages, setClawMessages] = useState<ChatMessage[]>([
    { sender: 'kimi', text: 'Halo! Saya OpenClaw (Kimi K2.6 Thinking). Saya aktif 24/7 dan memiliki memori jangka panjang untuk membantu tugas harian Anda.' }
  ]);

  // Deploy Claw Action
  const handleDeployClaw = (type: 'cloud' | 'desktop' | 'android') => {
    setSelectedDeployOption(type);
    setIsDeploying(true);

    if (type === 'cloud') {
      setDeployingStatus('Memulai kontainer cloud OpenClaw 24/7...');
      setTimeout(() => {
        setIsDeploying(false);
        const dummyUrl = `https://openclaw.cloud/agent-maxy-${Math.floor(100 + Math.random() * 900)}`;
        setOpenClawDeployedUrl(dummyUrl);
        setDeployingStatus(`OpenClaw Berhasil Dideploy! URL Akses: ${dummyUrl}`);
        showToast('OpenClaw Berhasil Dideploy ke Cloud!');
      }, 1800);
    } else if (type === 'desktop') {
      setDeployingStatus('Menyiapkan paket installer Desktop (.exe / .dmg)...');
      setTimeout(() => {
        setIsDeploying(false);
        setDeployingStatus('Unduhan aplikasi desktop dimulai (simulasi installer KimiClaw_Setup.dmg)');
        showToast('Unduhan Aplikasi Desktop Dimulai (Simulasi)');
      }, 1500);
    } else {
      setDeployingStatus('Membuat APK installer Android Kimi Claw...');
      setTimeout(() => {
        setIsDeploying(false);
        setDeployingStatus('Unduhan APK Android dimulai (simulasi KimiClaw_Mobile.apk)');
        showToast('Unduhan APK Android Dimulai (Simulasi)');
      }, 1500);
    }
  };

  // Send OpenClaw Chat Message via Gemini API
  const handleSendClawChat = async () => {
    if (!clawChatInput.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = { sender: 'user', text: clawChatInput };
    setClawMessages(prev => [...prev, userMsg]);
    const promptToSend = clawChatInput;
    setClawChatInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/kimi-ai-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'claw',
          prompt: promptToSend
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim pesan ke OpenClaw');

      const clawMsg: ChatMessage = { sender: 'kimi', text: data.text };
      setClawMessages(prev => [...prev, clawMsg]);
    } catch (err: any) {
      console.error("Error OpenClaw Chat:", err);
      setErrorMessage(err.message || "Gagal terhubung ke OpenClaw.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[750px] bg-[#0e0e11] text-slate-800 dark:text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col relative shadow-2xl">
      {/* Top Stage Control Header */}
      <div className="bg-[#16161a] border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs shrink-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-extrabold text-white text-xs shadow-lg">
            K
          </div>
          <span className="font-extrabold text-slate-700 dark:text-slate-200">Kimi AI Studio Simulator</span>
          <span className="text-slate-500 hidden sm:inline">| Work, Code CLI, OpenClaw & Thinking Engine</span>
        </div>

        {/* Stage Switcher Buttons */}
        <div className="flex items-center space-x-1 bg-[#0a0a0c] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveStage('chat')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
          >
            TAHAP 1: Chat Utama
          </button>
          <button
            onClick={() => setActiveStage('work')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'work' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
          >
            TAHAP 2: Kimi Work
          </button>
          <button
            onClick={() => setActiveStage('code')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
          >
            TAHAP 3: Kimi Code
          </button>
          <button
            onClick={() => setActiveStage('claw')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'claw' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
          >
            TAHAP 4: Kimi Claw
          </button>
        </div>
      </div>

      {/* Global Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400 flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-rose-900/80 border-b border-rose-700 text-rose-200 text-xs px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-300" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="hover:text-slate-900 dark:text-white font-bold">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 1: HALAMAN UTAMA KIMI (CHAT) */}
      {/* ========================================================= */}
      {activeStage === 'chat' && (
        <div className="flex-1 flex flex-col md:flex-row bg-[#121216] overflow-hidden">
          {/* Sidebar Left */}
          <aside className={`bg-[#0d0d10] border-r border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between shrink-0 transition-all ${collapsedNav ? 'w-16' : 'w-full md:w-64'}`}>
            <div className="space-y-4">
              {/* Header Logo + Toggle */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 font-black text-slate-900 dark:text-white flex items-center justify-center text-sm shadow">
                    K
                  </div>
                  {!collapsedNav && <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-wider">KIMI</span>}
                </div>

                <button
                  onClick={() => setCollapsedNav(!collapsedNav)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:bg-slate-800/60"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>

              {/* Obrolan Baru Button */}
              <button
                onClick={handleStartNewChat}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#1d1d24] hover:bg-[#252530] text-slate-800 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-700/60 shadow-sm transition-all text-xs"
              >
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  {!collapsedNav && <span>Obrolan baru</span>}
                </div>
                {!collapsedNav && (
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                    Ctrl K
                  </span>
                )}
              </button>

              {/* Chat Threads (Recent Chat History List) */}
              {!collapsedNav && chatThreads.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Riwayat Obrolan</div>
                  {chatThreads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => handleSelectThread(thread)}
                      className={`p-2 rounded-lg cursor-pointer truncate text-[11px] transition-colors ${activeThreadId === thread.id ? 'bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-800/60' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/50 hover:text-slate-700 dark:text-slate-200'}`}
                    >
                      💬 {thread.title}
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Menu Feature Chips */}
              {!collapsedNav && (
                <div className="space-y-1 font-semibold text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-1 mb-1">Fitur Pintar</div>
                  {[
                    { label: 'Klaster', icon: <Layers className="w-4 h-4 text-purple-400" /> },
                    { label: 'Slide', icon: <Presentation className="w-4 h-4 text-orange-400" /> },
                    { label: 'Riset Mendalam', icon: <Search className="w-4 h-4 text-amber-400" /> },
                    { label: 'Situs Web', icon: <Globe className="w-4 h-4 text-blue-400" /> },
                    { label: 'Dokumen', icon: <FileText className="w-4 h-4 text-teal-400" /> },
                    { label: 'Sheets', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> },
                  ].map((nav, nidx) => (
                    <button
                      key={nidx}
                      onClick={() => {
                        setActiveFeatureChip(nav.label);
                        showToast(`Tag Fitur Aktif: [${nav.label}]`);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left ${activeFeatureChip === nav.label ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-700' : 'hover:bg-slate-100 dark:bg-slate-800/50 hover:text-slate-900 dark:text-white'}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        {nav.icon}
                        <span>{nav.label}</span>
                      </div>
                      {activeFeatureChip === nav.label && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Advanced Products Section */}
              {!collapsedNav && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs font-bold">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Produk Lanjutan</div>
                  <button
                    onClick={() => setActiveStage('work')}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Bot className="w-4 h-4 text-indigo-400" />
                      <span>Kimi Work</span>
                    </div>
                    <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-800 px-1.5 py-0.5 rounded font-mono">
                      Beta
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveStage('code')}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200"
                  >
                    <Code className="w-4 h-4 text-purple-400" />
                    <span>Kimi Code</span>
                  </button>

                  <button
                    onClick={() => setActiveStage('claw')}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200"
                  >
                    <Cpu className="w-4 h-4 text-rose-400" />
                    <span>Kimi Claw</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom User Profile */}
            {!collapsedNav && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 font-bold text-white flex items-center justify-center text-xs">
                    M
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-700 dark:text-slate-200 truncate">Maxy Student</div>
                    <div className="text-[10px] text-slate-500">K3 Credits</div>
                  </div>
                </div>

                <button onClick={() => showToast('Unduh aplikasi desktop Kimi')} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </aside>

          {/* Main Chat Content Area */}
          <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 max-w-4xl mx-auto w-full relative overflow-y-auto space-y-6">
            {/* Active Chat Conversation or Big Header */}
            {activeMessages.length > 0 ? (
              <div className="flex-1 space-y-4 max-h-[480px] overflow-y-auto p-2 min-w-0">
                {activeMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 shadow-md ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[#1b1b22] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
                      <div className="font-bold text-[10px] text-indigo-300">
                        {msg.sender === 'user' ? 'Maxy Student' : '🤖 Kimi K2.5'}
                      </div>
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#1b1b22] border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-3 text-xs text-indigo-400 flex items-center space-x-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Kimi K2.5 sedang berpikir ({chatMode} Mode)...</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="my-auto space-y-6 text-center">
                <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-slate-900 dark:text-white font-mono drop-shadow-md">
                  KIMI
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Tanyakan apapun atau pilih inspirasi di bawah untuk mulai berdiskusi dengan Kimi K2.5.
                </p>
              </div>
            )}

            {/* Input Box Bar */}
            <div className="space-y-4">
              <div className="bg-[#1c1c24] border border-slate-300 dark:border-slate-700/80 rounded-3xl p-4 shadow-2xl space-y-3 text-left relative">
                {activeFeatureChip && (
                  <div className="inline-flex items-center space-x-1.5 bg-indigo-950 border border-indigo-700 px-2.5 py-0.5 rounded-full text-[10px] text-indigo-300 font-bold">
                    <span>Tag Fitur: {activeFeatureChip}</span>
                    <button onClick={() => setActiveFeatureChip(null)} className="hover:text-slate-900 dark:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMainChat())}
                  placeholder='Ketik "/" untuk memanggil plugin dan skill, atau masukkan pertanyaan...'
                  rows={2}
                  className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none resize-none font-medium"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => showToast('Tambah Lampiran File')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-xl bg-slate-100 dark:bg-slate-800/60">
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Mode Dropdown (Instan vs Tinggi) */}
                    <div className="relative">
                      <button
                        onClick={() => setShowModeDropdown(!showModeDropdown)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-[#141418] border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white"
                      >
                        <span>Instan</span>
                        <span className="text-indigo-400 font-bold ml-1">{chatMode}</span>
                        <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-500 dark:text-slate-400" />
                      </button>

                      {showModeDropdown && (
                        <div className="absolute left-0 mt-2 w-48 bg-[#181820] border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-40 text-xs space-y-1">
                          <div
                            onClick={() => {
                              setChatMode('Instan');
                              setShowModeDropdown(false);
                              showToast('Mode: Instan (Respon super cepat)');
                            }}
                            className={`p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:bg-slate-800 ${chatMode === 'Instan' ? 'bg-indigo-950 text-indigo-300 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                          >
                            <div className="font-bold">Instan</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Kecepatan tinggi, cocok untuk pertanyaan umum.</div>
                          </div>
                          <div
                            onClick={() => {
                              setChatMode('Tinggi');
                              setShowModeDropdown(false);
                              showToast('Mode: Tinggi (Respon mendalam dengan K2.5)');
                            }}
                            className={`p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:bg-slate-800 ${chatMode === 'Tinggi' ? 'bg-indigo-950 text-indigo-300 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                          >
                            <div className="font-bold">Tinggi</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Penalaran mendalam untuk tugas kompleks.</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendMainChat()}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-lg font-bold flex items-center space-x-1"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Dropdown "Pilih proyek" */}
                <div className="relative pt-1">
                  <button
                    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 font-bold"
                  >
                    <Folder className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{selectedProject}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showProjectDropdown && (
                    <div className="absolute left-0 bottom-8 w-56 bg-[#181820] border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-40 text-xs space-y-1">
                      {['Pilih proyek', 'Maxy AI Curriculum', 'Research & Case Studies', 'Student Assignments'].map((proj, pidx) => (
                        <div
                          key={pidx}
                          onClick={() => {
                            setSelectedProject(proj);
                            setShowProjectDropdown(false);
                            showToast(`Proyek dipilih: ${proj}`);
                          }}
                          className="p-2 rounded-xl hover:bg-slate-100 dark:bg-slate-800 cursor-pointer text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {proj}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row Shortcut Fitur Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { name: 'Klaster', icon: <Layers className="w-3.5 h-3.5 text-purple-400" /> },
                  { name: 'Slide', icon: <Presentation className="w-3.5 h-3.5 text-orange-400" /> },
                  { name: 'Riset Mendalam', icon: <Search className="w-3.5 h-3.5 text-amber-400" /> },
                  { name: 'Situs Web', icon: <Globe className="w-3.5 h-3.5 text-blue-400" /> },
                  { name: 'Dokumen', icon: <FileText className="w-3.5 h-3.5 text-teal-400" /> },
                  { name: 'Sheets', icon: <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> },
                ].map((sc, scidx) => (
                  <button
                    key={scidx}
                    onClick={() => {
                      setActiveFeatureChip(sc.name);
                      showToast(`Tag Fitur Ditambahkan: [${sc.name}]`);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${activeFeatureChip === sc.name ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-[#181820] hover:bg-[#22222c] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-white'}`}
                  >
                    {sc.icon}
                    <span>{sc.name}</span>
                  </button>
                ))}
              </div>

              {/* Section "Jelajahi inspirasi" */}
              <div className="bg-[#14141a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Jelajahi inspirasi</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Klik untuk mengisi otomatis ➔</span>
                </div>

                <div className="flex space-x-3 overflow-x-auto pb-2 text-left">
                  {[
                    'Analis data kurikulum AI Maxy Academy',
                    'Ringkas dokumen PDF 100 halaman jadi poin slide',
                    'Buat kode program React dengan Kimi Code',
                    'Automasi pencarian tren AI dengan Kimi Work',
                  ].map((insp, iidx) => (
                    <div
                      key={iidx}
                      onClick={() => {
                        setChatInput(insp);
                        showToast(`Input diisi: "${insp}"`);
                      }}
                      className="min-w-[200px] bg-[#1d1d26] hover:bg-[#262632] border border-slate-300 dark:border-slate-700/60 p-3 rounded-xl cursor-pointer text-slate-600 dark:text-slate-300 font-medium transition-all shrink-0 hover:border-indigo-500"
                    >
                      {insp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 2: KIMI WORK (RUANG KERJA AGENTIC) */}
      {/* ========================================================= */}
      {activeStage === 'work' && (
        <div className="flex-1 bg-[#121216] flex flex-col overflow-hidden">
          {/* Top Switcher Tab: Work / Chat */}
          <div className="bg-[#18181f] border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-[#0e0e12] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setWorkTab('Work')}
                className={`px-4 py-1.5 rounded-lg font-extrabold transition-all ${workTab === 'Work' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
              >
                🖥️ Work (Agentic Execution)
              </button>
              <button
                onClick={() => setWorkTab('Chat')}
                className={`px-4 py-1.5 rounded-lg font-bold transition-all ${workTab === 'Chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-white'}`}
              >
                💬 Chat (Conversational)
              </button>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800">
              {workTab === 'Work' ? 'Mode: Agen Otonom Multi-Langkah' : 'Mode: Percakapan Biasa'}
            </span>
          </div>

          {/* Body Split Screen */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Dalam Work */}
            <aside className="w-full md:w-64 bg-[#0c0c0f] border-r border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between shrink-0 text-xs overflow-y-auto space-y-4">
              <div className="space-y-4">
                <button
                  onClick={handleNewWorkTask}
                  className="w-full flex items-center space-x-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ New task</span>
                </button>

                <div className="space-y-1 font-semibold text-slate-600 dark:text-slate-300">
                  <div onClick={() => showToast('Kimi Skills Store')} className="p-2 rounded-xl hover:bg-slate-100 dark:bg-slate-800/50 cursor-pointer flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-sky-400" />
                    <span>Skills</span>
                  </div>
                  <div onClick={() => showToast('WebBridge: Akses File Lokal Komputer')} className="p-2 rounded-xl hover:bg-slate-100 dark:bg-slate-800/50 cursor-pointer flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span>WebBridge</span>
                  </div>
                  <div onClick={() => showToast('Cron job: Tugas Terjadwal Berulang')} className="p-2 rounded-xl hover:bg-slate-100 dark:bg-slate-800/50 cursor-pointer flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Cron job</span>
                  </div>
                </div>

                {/* Section Project */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Project</div>
                  {['Buat program kecil', 'Organisir dokumen Maxy', 'Galeri foto & video'].map((projName, pidx) => (
                    <div key={pidx} className="p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-800/50 cursor-pointer text-slate-600 dark:text-slate-300 truncate font-medium">
                      📁 {projName}
                    </div>
                  ))}
                </div>

                {/* Section TASKS with status colors */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-1">TASKS</div>
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        if (t.result) setActiveTaskResult(t.result);
                        showToast(`Melihat status task: ${t.name}`);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-800/50 cursor-pointer text-slate-600 dark:text-slate-300 truncate flex items-center space-x-2"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.status === 'in_progress' ? 'bg-blue-400 animate-pulse' : t.status === 'pending' ? 'bg-yellow-400' : 'bg-emerald-400'}`}></span>
                      <span className="break-words whitespace-normal leading-snug text-[11px] font-medium">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-500 dark:text-slate-400 text-[10px]">
                Moonshot AI Workspace
              </div>
            </aside>

            {/* Main Agent Area */}
            <main className="flex-1 p-6 sm:p-10 flex flex-col justify-center max-w-3xl mx-auto w-full space-y-6 overflow-y-auto">
              {/* Mascot + Title */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-950 border border-indigo-700 text-3xl shadow-xl">
                  🤖
                </div>
                <div className="space-y-1">
                  <div className="inline-block bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    {workTab === 'Work' ? 'Agentic Workspace Active' : 'Chat Mode Active'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                    Let's take something off your plate
                  </h2>
                </div>
              </div>

              {/* Agent Prompt Input Box */}
              <div className="bg-[#181820] border border-slate-300 dark:border-slate-700 rounded-3xl p-4 shadow-2xl space-y-4">
                <textarea
                  value={workInput}
                  onChange={(e) => setWorkInput(e.target.value)}
                  rows={4}
                  placeholder="Deskripsikan tugas multi-langkah yang ingin Anda selesaikan secara otonom..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder-slate-500 focus:outline-none resize-none font-mono leading-relaxed"
                />

                {/* Toolbar bawah input */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => showToast('Tambah File / Folder')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-xl bg-slate-100 dark:bg-slate-800/60">
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Toggle Mode Ask vs Agent vs Agent Swarm */}
                    <div className="flex items-center bg-[#0e0e12] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                      <button
                        onClick={() => {
                          setWorkMode('Ask');
                          showToast('Mode: Ask (Tanya jawab biasa)');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${workMode === 'Ask' ? 'bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        ✓ Ask
                      </button>
                      <button
                        onClick={() => {
                          setWorkMode('Agent');
                          showToast('Mode: Agent (Agen otonom tunggal)');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${workMode === 'Agent' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        Agent
                      </button>
                      <button
                        onClick={() => {
                          setWorkMode('Agent Swarm');
                          showToast('Mode: Agent Swarm (Multi-agent kolaboratif)');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${workMode === 'Agent Swarm' ? 'bg-purple-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        Agent Swarm
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleRunWorkTask}
                    disabled={isWorkRunning}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center space-x-1.5"
                  >
                    <span>{isWorkRunning ? 'Memproses...' : 'Kirim Ke Agent'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  📁 Project: {selectedProject}
                </div>
              </div>

              {/* Task Result Box */}
              {activeTaskResult && (
                <div className="p-4 bg-[#1b1b26] border border-indigo-200 dark:border-indigo-700/60 rounded-2xl text-xs text-slate-700 dark:text-slate-200 font-mono space-y-2 animate-fade-in shadow-xl">
                  <div className="font-bold text-indigo-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Laporan Eksekusi Tugas Kimi Work</span>
                  </div>
                  <div className="whitespace-pre-wrap">{activeTaskResult}</div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 3: KIMI CODE (CODING ASSISTANT) */}
      {/* ========================================================= */}
      {activeStage === 'code' && (
        <div className="flex-1 bg-[#0a0a0d] flex flex-col overflow-y-auto">
          {/* Navbar Kimi Code */}
          <nav className="bg-[#121218] border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-wider font-mono">KIMI Code</span>
            </div>

            <div className="flex items-center space-x-6 text-xs font-bold text-slate-600 dark:text-slate-300">
              <button onClick={() => showToast('Manfaat Keanggotaan Kimi Code')} className="hover:text-slate-900 dark:text-white">
                Manfaat Keanggotaan
              </button>
              <button onClick={() => showToast('Dokumentasi Kimi Code CLI')} className="hover:text-slate-900 dark:text-white">
                Dokumen
              </button>
              <button onClick={() => showToast('Konsol Kimi Code API')} className="hover:text-slate-900 dark:text-white">
                Konsol
              </button>
              <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" />
              <div className="w-7 h-7 rounded-full bg-indigo-600 font-bold text-white flex items-center justify-center text-xs">
                M
              </div>
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Satu langganan, bebas menulis di semua perangkat
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Akses lingkungan coding Kimi CLI dan IDE terintegrasi untuk refactoring & eksplorasi codebase.
              </p>
            </div>

            {/* Toggle Tab: Terminal / IDE */}
            <div className="flex justify-center">
              <div className="bg-[#16161e] p-1 rounded-2xl border border-slate-200 dark:border-slate-800 inline-flex space-x-1 text-xs">
                <button
                  onClick={() => setCodeTab('terminal')}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${codeTab === 'terminal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  <Terminal className="w-4 h-4 inline mr-1.5" />
                  Terminal CLI
                </button>
                <button
                  onClick={() => setCodeTab('ide')}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${codeTab === 'ide' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  <Code className="w-4 h-4 inline mr-1.5" />
                  IDE Editor
                </button>
              </div>
            </div>

            {/* Window Replica */}
            {codeTab === 'terminal' ? (
              /* Terminal View */
              <div className="bg-[#0e0e12] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-mono text-xs">
                {/* Window Bar */}
                <div className="bg-[#181820] px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2 font-bold">Kimi CLI Terminal</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    Model: K2.7 Code
                  </span>
                </div>

                {/* Terminal Body */}
                <div className="p-6 space-y-4 text-slate-700 dark:text-slate-200 min-h-[250px] max-h-[350px] overflow-y-auto">
                  {cliOutput.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-300">
                      {line}
                    </div>
                  ))}

                  {isTypingCli && (
                    <div className="text-indigo-400 animate-pulse">⚡ Kimi Code sedang mengeksekusi komando...</div>
                  )}

                  {/* CLI Custom Input */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                    <span className="text-indigo-400 font-bold">$</span>
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCliCommand()}
                      placeholder="Ketik perintah CLI (misal: git status, npm test, analyze architecture)..."
                      className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none min-w-0"
                    />
                    <button onClick={() => handleCliCommand()} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold">
                      Jalankan
                    </button>
                  </div>

                  {/* Sample Clickable Commands */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 space-y-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Klik perintah contoh:</div>
                    <div className="flex flex-wrap gap-2">
                      {['introduce yourself', 'npm run build', 'analyze codebase'].map((cmd, cidx) => (
                        <button
                          key={cidx}
                          onClick={() => handleCliCommand(cmd)}
                          className="px-3 py-1 bg-[#181822] hover:bg-indigo-950 text-indigo-300 border border-indigo-800/60 rounded-lg text-xs transition-all"
                        >
                          $ {cmd}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* IDE View */
              <div className="bg-[#0e0e12] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col space-y-3 p-4">
                <div className="bg-[#181820] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Kimi IDE Editor - Maxy Workspace</span>
                  <button
                    onClick={handleRunIdeCode}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow flex items-center space-x-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Jalankan & Analisis Kode</span>
                  </button>
                </div>

                <textarea
                  value={ideCodeInput}
                  onChange={(e) => setIdeCodeInput(e.target.value)}
                  rows={8}
                  className="w-full bg-[#070709] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />

                {ideExplanation && (
                  <div className="p-4 bg-[#14141c] border border-indigo-800 rounded-2xl text-xs text-slate-700 dark:text-slate-200 font-sans space-y-1">
                    <strong className="text-indigo-400 block font-bold">💡 Analisis Kimi Code IDE:</strong>
                    <div className="whitespace-pre-wrap">{ideExplanation}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 4: KIMI CLAW (DEPLOY AI AGENT) */}
      {/* ========================================================= */}
      {activeStage === 'claw' && (
        <div className="flex-1 bg-[#121216] flex flex-col overflow-y-auto">
          <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-8">
            {/* Header Card Besar Kimi Claw */}
            <div className="bg-gradient-to-r from-[#f7f2ea] to-[#efe6d8] text-slate-900 rounded-3xl p-8 border border-slate-300 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between">
              <div className="space-y-3 max-w-lg z-10">
                <div className="flex items-center space-x-2">
                  <h2 className="text-3xl font-black font-serif text-slate-900">Kimi Claw</h2>
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    Beta
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  <p>
                    <strong>Publikasikan OpenClaw dalam hitungan detik:</strong> OpenClaw adalah asisten AI dengan kepribadian dan memori. Kimi men-deploy-nya ke cloud untuk Anda hanya dengan satu klik. Online 24/7 tanpa pengaturan rumit.
                  </p>
                  <p>
                    <strong>Mengobrol dengan bebas melalui Kimi:</strong> Dikonfigurasi dengan Kimi K2.6 Thinking dan skill siap pakai.
                  </p>
                </div>
              </div>

              {/* Mascot Illustration */}
              <div className="mt-6 sm:mt-0 text-6xl select-none z-10 shrink-0">
                🦞
              </div>
            </div>

            {/* Section Mulai Deployment */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Mulai Deployment</h3>
                <button onClick={() => showToast('Menghubungkan ke OpenClaw eksisting...')} className="text-xs text-indigo-400 hover:underline flex items-center space-x-1">
                  <span>Tautkan OpenClaw yang sudah ada</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Deploy Options Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'cloud',
                    title: 'Di server cloud',
                    desc: 'Jaga data tetap terisolasi dan terapkan asisten 24/7 di server cloud.',
                    btnText: 'Buat',
                    icon: <Cloud className="w-8 h-8 text-indigo-400" />
                  },
                  {
                    id: 'desktop',
                    title: 'Di komputer saya',
                    desc: 'Terapkan langsung ke mesin Anda, kelola file lokal dengan aman.',
                    btnText: 'Unduh Aplikasi Desktop',
                    icon: <Laptop className="w-8 h-8 text-purple-400" />
                  },
                  {
                    id: 'android',
                    title: 'Di ponsel Android',
                    desc: 'Terapkan OpenClaw ke perangkat Android Anda yang tidak terpakai.',
                    btnText: 'Unduh',
                    icon: <Smartphone className="w-8 h-8 text-emerald-400" />
                  }
                ].map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleDeployClaw(card.id as any)}
                    className={`bg-[#1a1a22] border p-5 rounded-2xl space-y-4 cursor-pointer transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between ${selectedDeployOption === card.id ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-600'}`}
                  >
                    <div className="space-y-3">
                      <div>{card.icon}</div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{card.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                    </div>

                    <button className="w-full bg-[#252532] hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors">
                      {card.btnText}
                    </button>
                  </div>
                ))}
              </div>

              {/* Deployment Status Bar */}
              {deployingStatus && (
                <div className="bg-indigo-950/80 border border-indigo-700 p-4 rounded-2xl text-xs font-bold text-indigo-200 flex items-center space-x-3 shadow-lg">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{deployingStatus}</span>
                </div>
              )}
            </div>

            {/* Interactive OpenClaw Chat Box (Visible after deployment or option selected) */}
            <div className="bg-[#181822] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🦞</span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Mengobrol dengan OpenClaw Agent</h4>
                </div>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950 border border-rose-800 px-2.5 py-0.5 rounded-full">
                  K2.6 Thinking Active
                </span>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto p-1">
                {clawMessages.map((cMsg, cidx) => (
                  <div key={cidx} className={`flex ${cMsg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed ${cMsg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[#22222d] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'}`}>
                      <div className="font-bold text-[10px] text-indigo-300 mb-1">
                        {cMsg.sender === 'user' ? 'Maxy Student' : '🦞 OpenClaw'}
                      </div>
                      <div>{cMsg.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  value={clawChatInput}
                  onChange={(e) => setClawChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendClawChat()}
                  placeholder="Kirim pesan ke OpenClaw..."
                  className="flex-1 bg-[#121218] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 min-w-0"
                />
                <button
                  onClick={handleSendClawChat}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
