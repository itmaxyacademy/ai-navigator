import React, { useState } from 'react';
import {
  Sparkles, Search, Code, LayoutGrid, FileText, Settings, Download,
  ChevronRight, ArrowRight, FolderPlus, CheckCircle2, Play, RefreshCw,
  X, Plus, FileSpreadsheet, Presentation, Layers, Bot, Sliders, HardDrive,
  Folder, Laptop, Compass, Database, Check, ExternalLink, HelpCircle,
  Terminal, Smartphone, Cloud, Cpu, Clock, Wrench, Share2, Shield,
  ChevronDown, MessageSquare, Globe, User, Gift
} from 'lucide-react';

export const KimiAiReplica: React.FC = () => {
  // Active Stage: 'chat' | 'work' | 'code' | 'claw'
  const [activeStage, setActiveStage] = useState<'chat' | 'work' | 'code' | 'claw'>('chat');

  // Stage 1 Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'Instan' | 'Tinggi'>('Tinggi');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState('Pilih proyek');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [collapsedNav, setCollapsedNav] = useState(false);

  // Stage 2 Work State
  const [workTab, setWorkTab] = useState<'Work' | 'Chat'>('Work');
  const [workMode, setWorkMode] = useState<'Ask' | 'Agent' | 'Agent Swarm'>('Agent');
  const [workInput, setWorkInput] = useState(
    'Open the browser and help me search for the latest AI industry trend report. Extract the key information from the first 3 pages and organize it into an Excel to ~/Documents/MaxyWorkspace'
  );
  const [tasks, setTasks] = useState<{ id: string; name: string; status: 'in_progress' | 'pending' | 'completed' }[]>([
    { id: 't1', name: 'Kreasi Widget Dashboard Maxy', status: 'completed' },
    { id: 't2', name: 'Organisasi Materi Kurikulum AI', status: 'in_progress' },
    { id: 't3', name: 'Panduan Pembuatan PPT Automatis', status: 'pending' },
    { id: 't4', name: 'Cara Memulai Vibecoding dengan Kimi', status: 'pending' },
  ]);
  const [isWorkRunning, setIsWorkRunning] = useState(false);

  // Stage 3 Code State
  const [codeTab, setCodeTab] = useState<'terminal' | 'ide'>('terminal');
  const [cliOutput, setCliOutput] = useState<string[]>([]);
  const [isTypingCli, setIsTypingCli] = useState(false);

  // Stage 4 Claw State
  const [selectedDeployOption, setSelectedDeployOption] = useState<'cloud' | 'desktop' | 'android' | null>(null);
  const [deployingStatus, setDeployingStatus] = useState<string | null>(null);

  // Global Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Run Work Agent Task
  const handleRunWorkTask = () => {
    if (!workInput.trim()) return;
    setIsWorkRunning(true);
    showToast('Agen Kimi Work mulai menjalankan tugas...');

    const newTaskName = workInput.length > 35 ? workInput.substring(0, 35) + '...' : workInput;

    setTimeout(() => {
      setTasks(prev => [
        { id: Date.now().toString(), name: newTaskName, status: 'in_progress' },
        ...prev
      ]);
      setIsWorkRunning(false);
      showToast('Tugas baru berhasil ditambahkan ke antrean Kimi Work!');
    }, 1200);
  };

  // Run CLI Command
  const handleCliCommand = (cmd: string) => {
    if (isTypingCli) return;
    setIsTypingCli(true);

    let responseLines: string[] = [];
    if (cmd === 'introduce yourself') {
      responseLines = [
        `moonshot@KimiCode 🚀 introduce yourself`,
        `Model: K2.7 Code`,
        `--------------------------------------------------`,
        `• Halo! Saya Kimi Code CLI, asisten AI koding khusus dari Moonshot AI.`,
        `• Kapabilitas Utama Saya:`,
        `  1. Software Development - Menulis, refactoring, dan debugging kode.`,
        `  2. Codebase Analysis - Memahami proyek skala besar dan struktur repositori.`,
        `  3. Technical Tasks - Menjalankan automasi command terminal & pengolahan file.`,
        `  4. Research - Pencarian dokumentasi teknis dan sintesis sintaks terbaru.`
      ];
    } else if (cmd === 'npm run build') {
      responseLines = [
        `moonshot@KimiCode 🚀 npm run build`,
        `> maxy-academy-applet@1.0.0 build`,
        `> vite build && esbuild server.ts --bundle`,
        `✓ 142 modules transformed.`,
        `dist/index.html                     0.45 kB`,
        `dist/assets/index-Dk91k2s.js       342.12 kB`,
        `✓ Build completed in 1.24s successfully!`
      ];
    } else {
      responseLines = [
        `moonshot@KimiCode 🚀 ${cmd}`,
        `Menjalankan analisis untuk komando '${cmd}'...`,
        `[Kimi Code K2.7] Tugas selesai tanpa kendala sintaks.`
      ];
    }

    setCliOutput(prev => [...prev, ...responseLines]);
    setTimeout(() => {
      setIsTypingCli(false);
    }, 500);
  };

  // Deploy Claw Action
  const handleDeployClaw = (type: 'cloud' | 'desktop' | 'android') => {
    setSelectedDeployOption(type);
    const labelMap = {
      cloud: 'Server Cloud 24/7',
      desktop: 'Aplikasi Desktop Komputer',
      android: 'Perangkat Mobile Android'
    };
    setDeployingStatus(`Menyiapkan deployment OpenClaw di ${labelMap[type]}...`);
    setTimeout(() => {
      setDeployingStatus(`OpenClaw Berhasil Dideploy di ${labelMap[type]}!`);
      showToast(`Agent OpenClaw Aktif di ${labelMap[type]}`);
    }, 1800);
  };

  return (
    <div className="w-full min-h-[750px] bg-[#0e0e11] text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-800 flex flex-col relative shadow-2xl">
      {/* Top Stage Control Header */}
      <div className="bg-[#16161a] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs shrink-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-extrabold text-white text-xs shadow-lg">
            K
          </div>
          <span className="font-extrabold text-slate-200">Kimi AI Studio</span>
          <span className="text-slate-500 hidden sm:inline">| Kimi Work, Code, Claw & Scheduled Tasks</span>
        </div>

        <div className="flex items-center space-x-1 bg-[#0a0a0c] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveStage('chat')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 1: Chat Utama
          </button>
          <button
            onClick={() => setActiveStage('work')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'work' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 2: Kimi Work
          </button>
          <button
            onClick={() => setActiveStage('code')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 3: Kimi Code
          </button>
          <button
            onClick={() => setActiveStage('claw')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'claw' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 4: Kimi Claw
          </button>
        </div>
      </div>

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400 flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* TAHAP 1: HALAMAN UTAMA KIMI (CHAT) */}
      {activeStage === 'chat' && (
        <div className="flex-1 flex flex-col md:flex-row bg-[#121216] overflow-hidden">
          {/* Sidebar Left */}
          <aside className={`bg-[#0d0d10] border-r border-slate-800 p-3 flex flex-col justify-between shrink-0 transition-all ${collapsedNav ? 'w-16' : 'w-full md:w-64'}`}>
            <div className="space-y-4">
              {/* Header Logo + Toggle */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 font-black text-white flex items-center justify-center text-sm shadow">
                    K
                  </div>
                  {!collapsedNav && <span className="font-extrabold text-base text-white tracking-wider">KIMI</span>}
                </div>

                <button
                  onClick={() => setCollapsedNav(!collapsedNav)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>

              {/* Obrolan Baru Button */}
              <button
                onClick={() => showToast('Obrolan Baru Dimulai')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#1d1d24] hover:bg-[#252530] text-slate-100 font-bold border border-slate-700/60 shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  {!collapsedNav && <span>Obrolan baru</span>}
                </div>
                {!collapsedNav && (
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                    Ctrl K
                  </span>
                )}
              </button>

              {/* Navigation Menu */}
              {!collapsedNav && (
                <div className="space-y-1 font-semibold text-xs text-slate-300">
                  {[
                    { label: 'Plugin', icon: <Wrench className="w-4 h-4 text-sky-400" /> },
                    { label: 'Tugas Terjadwal', icon: <Clock className="w-4 h-4 text-emerald-400" /> },
                    { label: 'Klaster', icon: <Layers className="w-4 h-4 text-purple-400" /> },
                    { label: 'Slide', icon: <Presentation className="w-4 h-4 text-orange-400" /> },
                    { label: 'Riset Mendalam', icon: <Search className="w-4 h-4 text-amber-400" /> },
                    { label: 'Situs Web', icon: <Globe className="w-4 h-4 text-blue-400" /> },
                    { label: 'Dokumen', icon: <FileText className="w-4 h-4 text-teal-400" /> },
                    { label: 'Sheets', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> },
                  ].map((nav, nidx) => (
                    <button
                      key={nidx}
                      onClick={() => showToast(`Fitur Navigasi: ${nav.label}`)}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all text-left"
                    >
                      {nav.icon}
                      <span>{nav.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Advanced Products Section */}
              {!collapsedNav && (
                <div className="pt-2 border-t border-slate-800 space-y-1 text-xs font-bold">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Produk Lanjutan</div>
                  <button
                    onClick={() => setActiveStage('work')}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 text-slate-200"
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
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-800/50 text-slate-200"
                  >
                    <Code className="w-4 h-4 text-purple-400" />
                    <span>Kimi Code</span>
                  </button>

                  <button
                    onClick={() => setActiveStage('claw')}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-800/50 text-slate-200"
                  >
                    <Cpu className="w-4 h-4 text-rose-400" />
                    <span>Kimi Claw</span>
                  </button>
                </div>
              )}

              {/* Invite to Earn Banner */}
              {!collapsedNav && (
                <div
                  onClick={() => showToast('Invite Friends & Claim K3 Credits!')}
                  className="bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-800/60 p-3 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all space-y-1"
                >
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                    <Gift className="w-4 h-4" />
                    <span>Invite to Earn</span>
                  </div>
                  <div className="text-[10px] text-slate-300">Up to 1-year K3 Credits</div>
                </div>
              )}
            </div>

            {/* Bottom User Profile */}
            {!collapsedNav && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 font-bold text-white flex items-center justify-center text-xs">
                    M
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-200 truncate">Maxy Student</div>
                    <div className="text-[10px] text-slate-500">Tingkatkan</div>
                  </div>
                </div>

                <button onClick={() => showToast('Unduh aplikasi desktop Kimi')} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </aside>

          {/* Main Area */}
          <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 max-w-4xl mx-auto w-full relative">
            {/* Top Upgrade Header Button */}
            <div className="flex justify-end">
              <button
                onClick={() => showToast('Upgrade Paket Kimi Anda untuk akses K3 tanpa batas')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-1.5 transition-all"
              >
                <span>♬ Upgrade paket Anda</span>
              </button>
            </div>

            {/* Center Area: Big Logo + Input Area */}
            <div className="my-auto space-y-8 text-center">
              <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-white font-mono drop-shadow-md">
                KIMI
              </h1>

              {/* Input Box */}
              <div className="bg-[#1c1c24] border border-slate-700/80 rounded-3xl p-4 shadow-2xl space-y-3 text-left relative">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder='Ketik "/" untuk memanggil plugin dan skill'
                  rows={2}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none font-medium"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => showToast('Tambah Lampiran File')} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60">
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Mode Dropdown (Instan vs Tinggi) */}
                    <div className="relative">
                      <button
                        onClick={() => setShowModeDropdown(!showModeDropdown)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-[#141418] border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
                      >
                        <span>Instan</span>
                        <span className="text-indigo-400 font-bold ml-1">{chatMode}</span>
                        <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
                      </button>

                      {showModeDropdown && (
                        <div className="absolute left-0 mt-2 w-48 bg-[#181820] border border-slate-700 rounded-2xl shadow-2xl p-2 z-40 text-xs space-y-1">
                          <div
                            onClick={() => {
                              setChatMode('Instan');
                              setShowModeDropdown(false);
                              showToast('Mode: Instan (Respon super cepat)');
                            }}
                            className={`p-2 rounded-xl cursor-pointer hover:bg-slate-800 ${chatMode === 'Instan' ? 'bg-indigo-950 text-indigo-300 font-bold' : 'text-slate-300'}`}
                          >
                            <div className="font-bold">Instan</div>
                            <div className="text-[10px] text-slate-400">Kecepatan tinggi, cocok untuk pertanyaan umum.</div>
                          </div>
                          <div
                            onClick={() => {
                              setChatMode('Tinggi');
                              setShowModeDropdown(false);
                              showToast('Mode: Tinggi (Respon mendalam dengan K2.5/K3)');
                            }}
                            className={`p-2 rounded-xl cursor-pointer hover:bg-slate-800 ${chatMode === 'Tinggi' ? 'bg-indigo-950 text-indigo-300 font-bold' : 'text-slate-300'}`}
                          >
                            <div className="font-bold">Tinggi</div>
                            <div className="text-[10px] text-slate-400">Penalaran mendalam untuk tugas kompleks.</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!chatInput.trim()) return;
                      showToast(`Pesan terkirim dalam mode ${chatMode}!`);
                      setChatInput('');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl shadow-lg font-bold"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Dropdown "Pilih proyek" */}
                <div className="relative pt-1">
                  <button
                    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 font-bold"
                  >
                    <Folder className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{selectedProject}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showProjectDropdown && (
                    <div className="absolute left-0 bottom-8 w-56 bg-[#181820] border border-slate-700 rounded-2xl shadow-2xl p-2 z-40 text-xs space-y-1">
                      {['Pilih proyek', 'Maxy AI Curriculum', 'Research & Case Studies', 'Student Assignments'].map((proj, pidx) => (
                        <div
                          key={pidx}
                          onClick={() => {
                            setSelectedProject(proj);
                            setShowProjectDropdown(false);
                            showToast(`Proyek dipilih: ${proj}`);
                          }}
                          className="p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-slate-300 font-medium"
                        >
                          {proj}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row Shortcut Fitur */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                    onClick={() => showToast(`Shortcut Fitur: ${sc.name}`)}
                    className="flex items-center space-x-1.5 bg-[#181820] hover:bg-[#22222c] border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
                  >
                    {sc.icon}
                    <span>{sc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section "Jelajahi inspirasi" */}
            <div className="bg-[#14141a] border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Jelajahi inspirasi</span>
                </span>
                <span className="text-[10px] text-slate-500">Gulir untuk menjelajah ➔</span>
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
                      showToast(`Inspirasi dipilih: "${insp}"`);
                    }}
                    className="min-w-[200px] bg-[#1d1d26] hover:bg-[#262632] border border-slate-700/60 p-3 rounded-xl cursor-pointer text-slate-300 font-medium transition-all shrink-0"
                  >
                    {insp}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* TAHAP 2: KIMI WORK (RUANG KERJA AGENTIC) */}
      {activeStage === 'work' && (
        <div className="flex-1 bg-[#121216] flex flex-col overflow-hidden">
          {/* Top Switcher Tab: Work / Chat */}
          <div className="bg-[#18181f] border-b border-slate-800 px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-[#0e0e12] p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setWorkTab('Work')}
                className={`px-4 py-1.5 rounded-lg font-extrabold transition-all ${workTab === 'Work' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
              >
                🖥️ Work
              </button>
              <button
                onClick={() => setActiveStage('chat')}
                className="px-4 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white"
              >
                💬 Chat
              </button>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800">
              Agentic Workspace Active
            </span>
          </div>

          {/* Body Split Screen */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Dalam Work */}
            <aside className="w-full md:w-64 bg-[#0c0c0f] border-r border-slate-800 p-3.5 flex flex-col justify-between shrink-0 text-xs">
              <div className="space-y-4">
                <button
                  onClick={() => showToast('Membuat tugas baru di Kimi Work')}
                  className="w-full flex items-center space-x-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>New task</span>
                </button>

                <div className="space-y-1 font-semibold text-slate-300">
                  <div onClick={() => showToast('Kimi Skills Store')} className="p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-sky-400" />
                    <span>Skills</span>
                  </div>
                  <div onClick={() => showToast('WebBridge: Akses File Lokal Komputer')} className="p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span>WebBridge</span>
                  </div>
                  <div onClick={() => showToast('Cron job: Tugas Terjadwal Berulang')} className="p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Cron job</span>
                  </div>
                </div>

                {/* Section Project */}
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Project</div>
                  {['Buat program kecil', 'Organisir dokumen Maxy', 'Galeri foto & video'].map((projName, pidx) => (
                    <div key={pidx} className="p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer text-slate-300 truncate font-medium">
                      📁 {projName}
                    </div>
                  ))}
                </div>

                {/* Section Tasks */}
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Tasks</div>
                  {tasks.map((t) => (
                    <div key={t.id} className="p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer text-slate-300 truncate flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${t.status === 'in_progress' ? 'bg-blue-400 animate-pulse' : t.status === 'pending' ? 'bg-yellow-400' : 'bg-emerald-400'}`}></span>
                      <span className="truncate text-[11px]">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 font-bold text-slate-400">
                Moonshot AI Workspace
              </div>
            </aside>

            {/* Main Agent Area */}
            <main className="flex-1 p-6 sm:p-10 flex flex-col justify-center max-w-3xl mx-auto w-full space-y-6">
              {/* Mascot + Title */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-950 border border-indigo-700 text-3xl shadow-xl">
                  🤖
                </div>
                <div className="space-y-1">
                  <div className="inline-block bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Beta Preview
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Let's take something off your plate
                  </h2>
                </div>
              </div>

              {/* Agent Prompt Input Box */}
              <div className="bg-[#181820] border border-slate-700 rounded-3xl p-4 shadow-2xl space-y-4">
                <textarea
                  value={workInput}
                  onChange={(e) => setWorkInput(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none resize-none font-mono leading-relaxed"
                />

                {/* Toolbar bawah input */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => showToast('Tambah File / Folder')} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60">
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Toggle Mode Ask vs Agent vs Agent Swarm */}
                    <div className="flex items-center bg-[#0e0e12] p-1 rounded-xl border border-slate-800 text-xs">
                      <button
                        onClick={() => {
                          setWorkMode('Ask');
                          showToast('Mode: Ask (Tanya jawab biasa)');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${workMode === 'Ask' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                      >
                        ✓ Ask
                      </button>
                      <button
                        onClick={() => {
                          setWorkMode('Agent');
                          showToast('Mode: Agent (Agen otonom tunggal)');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${workMode === 'Agent' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                      >
                        Agent
                      </button>
                      <button
                        onClick={() => {
                          setWorkMode('Agent Swarm');
                          showToast('Mode: Agent Swarm (Multi-agent kolaboratif)');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${workMode === 'Agent Swarm' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
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
                    <span>{isWorkRunning ? 'Menjalankan...' : 'Kirim Ke Agent'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  📁 Project: Choose a project ▾
                </div>
              </div>

              {/* Explanatory Box */}
              <div className="bg-[#181822] border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
                <strong className="text-white text-sm block">💡 Penjelasan Konsep: Kimi Work Agentic Workspace</strong>
                <p>
                  <strong className="text-indigo-400">Kimi Work</strong> dirancang untuk menyelesaikan tugas multi-langkah kompleks secara otonom dengan akses direktori lokal via <strong className="text-emerald-400">WebBridge</strong>.
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li><strong>Ask:</strong> Menjawab pertanyaan seperti AI biasa.</li>
                  <li><strong>Agent:</strong> Mengeksekusi tugas otonom langkah-demi-langkah.</li>
                  <li><strong>Agent Swarm:</strong> Mengirimkan beberapa agen AI yang bekerja secara paralel untuk mempercepat tugas skala besar.</li>
                  <li><strong>Cron Job:</strong> Menjadwalkan tugas otomatis berulang (mis. ringkasan laporan mingguan).</li>
                </ul>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* TAHAP 3: KIMI CODE (CODING ASSISTANT) */}
      {activeStage === 'code' && (
        <div className="flex-1 bg-[#0a0a0d] flex flex-col overflow-y-auto">
          {/* Navbar Kimi Code */}
          <nav className="bg-[#121218] border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-base text-white tracking-wider font-mono">KIMI Code</span>
            </div>

            <div className="flex items-center space-x-6 text-xs font-bold text-slate-300">
              <button onClick={() => showToast('Manfaat Keanggotaan Kimi Code')} className="hover:text-white">
                Manfaat Keanggotaan
              </button>
              <button onClick={() => showToast('Dokumentasi Kimi Code CLI')} className="hover:text-white">
                Dokumen
              </button>
              <button onClick={() => showToast('Konsol Kimi Code API')} className="hover:text-white">
                Konsol
              </button>
              <Globe className="w-4 h-4 text-slate-400 cursor-pointer" />
              <div className="w-7 h-7 rounded-full bg-indigo-600 font-bold text-white flex items-center justify-center text-xs">
                M
              </div>
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Satu langganan, bebas menulis di semua perangkat
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Akses lingkungan coding Kimi CLI dan IDE terintegrasi untuk refactoring & eksplorasi codebase.
              </p>
            </div>

            {/* Toggle Tab: Terminal / IDE */}
            <div className="flex justify-center">
              <div className="bg-[#16161e] p-1 rounded-2xl border border-slate-800 inline-flex space-x-1 text-xs">
                <button
                  onClick={() => setCodeTab('terminal')}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${codeTab === 'terminal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  <Terminal className="w-4 h-4 inline mr-1.5" />
                  Terminal
                </button>
                <button
                  onClick={() => setCodeTab('ide')}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${codeTab === 'ide' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  <Code className="w-4 h-4 inline mr-1.5" />
                  IDE
                </button>
              </div>
            </div>

            {/* Window Replica */}
            {codeTab === 'terminal' ? (
              /* Terminal View */
              <div className="bg-[#0e0e12] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-mono text-xs">
                {/* Window Bar */}
                <div className="bg-[#181820] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-400 ml-2 font-bold">Kimi CLI</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    Model: K2.7 Code
                  </span>
                </div>

                {/* Terminal Body */}
                <div className="p-6 space-y-4 text-slate-200 min-h-[250px] max-h-[350px] overflow-y-auto">
                  <div className="bg-[#181822] p-4 rounded-xl border border-indigo-900/50 space-y-1">
                    <div className="text-indigo-400 font-bold">Welcome to Kimi Code CLI!</div>
                    <div className="text-slate-400 text-[11px]">Send /help for help information.</div>
                    <div className="text-slate-500 text-[11px]">Model: K2.7 Code</div>
                  </div>

                  {cliOutput.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed text-slate-300">
                      {line}
                    </div>
                  ))}

                  {/* Sample Clickable Commands */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
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
              <div className="bg-[#0e0e12] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col h-[320px]">
                <div className="bg-[#181820] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <span>Kimi IDE - Maxy Academy Workspace</span>
                  <span>TypeScript / React</span>
                </div>
                <div className="flex-1 flex">
                  <div className="w-48 bg-[#121218] border-r border-slate-800 p-3 space-y-2 text-[11px] text-slate-400">
                    <div className="font-bold text-slate-200">📁 src/</div>
                    <div className="pl-3 text-indigo-400 font-bold">📄 App.tsx</div>
                    <div className="pl-3">📄 types.ts</div>
                    <div className="pl-3">📄 server.ts</div>
                  </div>
                  <div className="flex-1 p-4 bg-[#0a0a0d] text-slate-300 overflow-y-auto space-y-1">
                    <div><span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-emerald-300">'react'</span>;</div>
                    <div><span className="text-purple-400">export const</span> MaxyApp = () =&gt; &#123;</div>
                    <div className="pl-4 text-slate-500">// Kimi Code AI auto-completion active</div>
                    <div className="pl-4"><span className="text-blue-400">return</span> &lt;<span className="text-amber-300">div</span>&gt;Maxy Academy Kimi Code IDE&lt;/<span className="text-amber-300">div</span>&gt;;</div>
                    <div>&#125;;</div>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation Box */}
            <div className="bg-[#161620] border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
              <strong className="text-white text-sm block">💡 Penjelasan Konsep: Kimi Code</strong>
              <p>
                <strong className="text-purple-400">Kimi Code</strong> difokuskan khusus untuk aktivitas rekayasa perangkat lunak (debugging, pemahaman repositori besar, dan eksekusi komando terminal).
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li><strong>Perbedaan dengan Kimi Work:</strong> Kimi Work menangani tugas dokumen & riset umum, sedangkan Kimi Code fokus penuh pada lingkungan pengembangan perangkat lunak (CLI & IDE).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAHAP 4: KIMI CLAW (DEPLOY AI AGENT) */}
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
                    <strong>Mengobrol dengan bebas melalui Kimi:</strong> Dikonfigurasi dengan Kimi K2.6 Thinking dan skill siap pakai; berjalan di berbagai aplikasi pesan.
                  </p>
                </div>
              </div>

              {/* Lobster / Claw Mascot Illustration */}
              <div className="mt-6 sm:mt-0 text-6xl select-none z-10 shrink-0">
                🦞
              </div>
            </div>

            {/* Section Mulai */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">Mulai Deployment</h3>
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
                    className={`bg-[#1a1a22] border p-5 rounded-2xl space-y-4 cursor-pointer transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between ${selectedDeployOption === card.id ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/20' : 'border-slate-800 hover:border-slate-600'}`}
                  >
                    <div className="space-y-3">
                      <div>{card.icon}</div>
                      <h4 className="font-bold text-sm text-white">{card.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                    </div>

                    <button className="w-full bg-[#252532] hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition-colors">
                      {card.btnText}
                    </button>
                  </div>
                ))}
              </div>

              {/* Deployment Status Bar */}
              {deployingStatus && (
                <div className="bg-indigo-950/80 border border-indigo-700 p-4 rounded-2xl text-xs font-bold text-indigo-200 flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{deployingStatus}</span>
                </div>
              )}
            </div>

            {/* Explanation Box */}
            <div className="bg-[#181822] border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
              <strong className="text-white text-sm block">💡 Penjelasan Konsep: Kimi Claw / OpenClaw</strong>
              <p>
                <strong className="text-rose-400">Kimi Claw</strong> memungkinkan pengguna menyebarkan (deploy) asisten AI otonom pribadi yang memiliki kepribadian dan memori sendiri secara independen.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li><strong>Server Cloud:</strong> Terbaik untuk uptime 24/7 dan keandalan tingkat tinggi.</li>
                <li><strong>Komputer Saya (Desktop):</strong> Terbaik untuk privasi penuh dan akses langsung ke sistem file lokal.</li>
                <li><strong>Ponsel Android:</strong> Memanfaatkan HP lama menjadi server AI personal terdedikasi.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
