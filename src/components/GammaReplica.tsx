import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, ArrowRight, ArrowLeft, RotateCcw, Send, Plus, Paperclip,
  FileText, Play, CheckCircle2, AlertCircle, RefreshCw, Layers, Layout,
  X, HelpCircle, Monitor, BookOpen, Briefcase, User, Sparkle, Upload
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const GammaReplica: React.FC = () => {
  // Flow State Management
  // Stages: 'landing' | 'onboarding' | 'creation_hub' | 'agent_input' | 'agent_chat'
  const [flowStage, setFlowStage] = useState<
    'landing' | 'onboarding' | 'creation_hub' | 'agent_input' | 'agent_chat'
  >('landing');

  // User Selection States
  const [useCase, setUseCase] = useState<'Pribadi' | 'Pekerjaan' | 'Pendidikan' | null>(null);
  const [createOption, setCreateOption] = useState<
    'Buat' | 'Menempelkan dalam teks' | 'Buat dari templat' | 'Impor file atau URL'
  >('Buat');

  // Input & Attachment States
  const [promptText, setPromptText] = useState<string>(
    'Ubah catatan rapat saya menjadi presentasi [ringkas]. Buatlah [tim saya] [menyelaraskan langkah dan pemilik berikutnya].'
  );
  const [pastedNotesText, setPastedNotesText] = useState<string>('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);

  // Chat & AI Generation States
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [revisionInput, setRevisionInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgressText, setLoadingProgressText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // General Simulation Modal State
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flowStage === 'agent_chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isLoading, flowStage]);

  // Handle Initial Submit from "Buat dengan Agent" Form
  const handleInitialSubmit = async () => {
    if (!promptText.trim()) {
      setErrorMessage('Silakan isi ide atau deskripsi presentasi terlebih dahulu.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    // Progressive loading messages simulation
    setLoadingProgressText('Melakukan penelitian...');
    const timer1 = setTimeout(() => setLoadingProgressText('Menyusun narasi...'), 1200);
    const timer2 = setTimeout(() => setLoadingProgressText('Menyusun slide...'), 2400);

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: promptText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([userMessage]);
    setFlowStage('agent_chat');

    try {
      const response = await fetch('/api/gamma-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText.trim(),
          notesText: pastedNotesText,
          fileName: attachedFileName,
          useCase,
          createOption,
          history: []
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal menghubungi Gamma Agent.');
      }

      const data = await response.json();

      const agentMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: data.text || 'Gamma Agent telah selesai memproses permintaan Anda.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, agentMessage]);
    } catch (err: any) {
      console.error('Gamma submit error:', err);
      let msg = err.message || 'Gagal memproses permintaan Gamma Agent.';
      if (typeof msg === 'string' && msg.startsWith('{')) {
        try {
          const parsed = JSON.parse(msg);
          msg = parsed.error?.message || parsed.error || msg;
        } catch (_) {}
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
      setLoadingProgressText('');
    }
  };

  // Handle Revision Submit inside Agent Chat
  const handleRevisionSubmit = async () => {
    if (!revisionInput.trim() || isLoading) return;

    const revisionText = revisionInput.trim();
    setRevisionInput('');
    setErrorMessage(null);
    setIsLoading(true);

    setLoadingProgressText('Menganalisis instruksi revisi...');
    const timer1 = setTimeout(() => setLoadingProgressText('Memperbarui slide presentasi...'), 1200);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: revisionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);

    try {
      const response = await fetch('/api/gamma-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: revisionText,
          notesText: pastedNotesText,
          fileName: attachedFileName,
          useCase,
          createOption,
          history: newHistory,
          isRevision: true
        })
      });

      clearTimeout(timer1);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal memperbarui presentasi.');
      }

      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: data.text || 'Slide presentasi telah diperbarui.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      console.error('Revision error:', err);
      setErrorMessage(err.message || 'Gagal memperbarui presentasi.');
    } finally {
      setIsLoading(false);
      setLoadingProgressText('');
    }
  };

  // Handle File Upload Simulation
  const handleFileUploadSimulated = () => {
    setAttachedFileName('Catatan_Rapat_Strategi_Kuartal.pdf');
    setPastedNotesText(
      'Ringkasan Catatan Rapat:\n- Penyelesaian milestone produk Q3.\n- Alokasi anggaran tim pemasaran.\n- Integrasi otomatisasi AI pada alur kerja utama.'
    );
    setShowNotesModal(false);
  };

  // Reset Conversation ("Jelas")
  const handleClearConversation = () => {
    setChatHistory([]);
    setRevisionInput('');
    setFlowStage('agent_input');
  };

  // Handle Back Navigation
  const handleBackNavigation = () => {
    if (flowStage === 'agent_chat') {
      setFlowStage('agent_input');
    } else if (flowStage === 'agent_input') {
      setFlowStage('creation_hub');
    } else if (flowStage === 'creation_hub') {
      setFlowStage('onboarding');
    } else if (flowStage === 'onboarding') {
      setFlowStage('landing');
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white text-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-[750px] font-sans select-none">
      {/* ---------------- STAGE 1: LANDING PAGE ---------------- */}
      {flowStage === 'landing' && (
        <div className="flex-1 flex flex-col bg-white">
          {/* Header Bar */}
          <header className="px-5 sm:px-8 py-4 flex items-center justify-between border-b border-slate-100 bg-white">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-black tracking-wider text-[#0e3073]">GAMMA</span>
              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
                <button onClick={() => setInfoModal({ title: 'Produk Gamma', content: 'Gamma mendukung pembuatan Presentasi, Dokumen, dan Halaman Web interaktif berbasis AI.' })} className="hover:text-slate-900 cursor-pointer">Produk</button>
                <button onClick={() => setInfoModal({ title: 'Solusi Gamma', content: 'Solusi terintegrasi untuk bisnis, akademisi, dan kreator konten.' })} className="hover:text-slate-900 cursor-pointer">Solusi</button>
                <button onClick={() => setInfoModal({ title: 'Tentang Gamma', content: 'Gamma dirancang untuk membantu Anda fokus pada ide tanpa kerumitan format desain.' })} className="hover:text-slate-900 cursor-pointer">Tentang</button>
                <button onClick={() => setInfoModal({ title: 'Harga Paket', content: 'Mulai secara gratis dengan kredit awal, lalu upgrade ke Paket Plus/Pro untuk fitur tanpa batas.' })} className="hover:text-slate-900 cursor-pointer">Harga</button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setFlowStage('onboarding')} className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer">Masuk</button>
              <button
                onClick={() => setFlowStage('onboarding')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0e44b8] hover:bg-[#0b3899] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Mulai secara gratis
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <main className="flex-1 max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-w-0">
            {/* Left Column Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-[#0e44b8] flex items-center justify-center font-bold text-xl shadow-sm">
                G
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-[#0f172a] leading-[1.1] tracking-tight">
                Wujudkan ide Anda menjadi nyata.
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
                Gamma adalah mitra desain AI Anda untuk presentasi, situs web, postingan media sosial, dan banyak lagi yang mudah dilakukan—sehingga Anda dapat fokus pada apa yang Anda lakukan dengan baik.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setFlowStage('onboarding')}
                  className="px-6 py-3.5 rounded-full bg-[#0e44b8] hover:bg-[#0b3899] text-slate-900 dark:text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Mulai secara gratis
                </button>
                <button
                  onClick={() => setInfoModal({ title: 'Tutorial Video Gamma', content: 'Simulasi pemutaran video pengenalan pembuatan presentasi AI otomatis di Gamma.' })}
                  className="px-6 py-3.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-sm transition-all cursor-pointer flex items-center gap-2 flex-wrap max-w-full"
                >
                  Tonton video ►
                </button>
              </div>
            </div>

            {/* Right Column Illustration */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-3xl bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-200 p-6 shadow-xl border border-blue-100 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                <div className="text-left font-mono font-bold text-blue-900 text-xl">
                  Q1 Growth Report
                </div>
                <div className="flex justify-center items-center py-6">
                  <div className="text-6xl animate-bounce">🍄</div>
                </div>
                <div className="self-start px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-xs font-bold text-blue-900 flex items-center gap-1.5 shadow-sm flex-wrap max-w-full">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Suggest images ✨
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-tr from-blue-300 via-indigo-200 to-purple-200 p-6 shadow-lg border border-purple-100 flex items-center justify-between">
                <div className="text-4xl">🌸</div>
                <div className="text-xs font-bold text-slate-700 bg-white/70 px-4 py-2 rounded-xl backdrop-blur-sm">
                  Tata Letak Otomatis AI
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ---------------- STAGE 2: ONBOARDING USE CASE ---------------- */}
      {flowStage === 'onboarding' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f2f6fd]">
          <div className="max-w-3xl w-full bg-[#f2f6fd] space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d2352] tracking-tight">
                Bagaimana Anda berencana untuk menggunakan Gamma?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Kami menggunakan jawaban Anda untuk mempersonalisasi pengalaman Anda
              </p>
            </div>

            {/* 3 Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Pribadi */}
              <button
                onClick={() => {
                  setUseCase('Pribadi');
                  setFlowStage('creation_hub');
                }}
                className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col items-center text-center space-y-4 cursor-pointer"
              >
                <div className="w-28 h-28 rounded-2xl bg-sky-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  🛋️
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">Untuk penggunaan pribadi</h3>
                </div>
              </button>

              {/* Card 2: Pekerjaan */}
              <button
                onClick={() => {
                  setUseCase('Pekerjaan');
                  setFlowStage('creation_hub');
                }}
                className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col items-center text-center space-y-4 cursor-pointer"
              >
                <div className="w-28 h-28 rounded-2xl bg-indigo-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  🖥️
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">Untuk pekerjaan</h3>
                </div>
              </button>

              {/* Card 3: Pendidikan */}
              <button
                onClick={() => {
                  setUseCase('Pendidikan');
                  setFlowStage('creation_hub');
                }}
                className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col items-center text-center space-y-4 cursor-pointer"
              >
                <div className="w-28 h-28 rounded-2xl bg-blue-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  📖
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">Untuk pendidikan</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sebagai siswa atau pendidik</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- STAGE 3: CREATION HUB ("Berkreasi dengan AI") ---------------- */}
      {flowStage === 'creation_hub' && (
        <div className="flex-1 flex flex-col bg-gradient-to-b from-[#e8f1fc] via-[#f4f8fe] to-white p-6 sm:p-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setFlowStage('landing')}
              className="px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 cursor-pointer flex-wrap max-w-full"
            >
              <span>🏠 Beranda</span>
            </button>
          </div>

          {/* Central Header */}
          <div className="max-w-4xl mx-auto w-full text-center space-y-3 mb-10">
            <h1 className="text-3xl sm:text-5xl font-black text-[#0c2452] tracking-tight">
              Berkreasi dengan AI
            </h1>
            <p className="text-slate-600 font-semibold text-sm sm:text-base">
              Bagaimana Anda ingin memulai?
            </p>
          </div>

          {/* 4 Option Cards Grid */}
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* Card 1: Buat (Recommended) with Cat Mascot */}
            <div className="relative pt-6">
              {/* Black Cat Mascot Speech Bubble */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-2xl shadow-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 whitespace-nowrap z-20 flex-wrap max-w-full">
                <span>Tidak yakin? Mulai dari sini!</span>
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-2xl z-10">🐱</div>

              <button
                onClick={() => {
                  setCreateOption('Buat');
                  setFlowStage('agent_input');
                }}
                className="w-full h-full p-6 rounded-2xl bg-white border-2 border-blue-400 shadow-xl hover:shadow-2xl transition-all flex flex-col items-start text-left space-y-4 cursor-pointer group"
              >
                <div className="w-full h-28 rounded-xl bg-gradient-to-r from-orange-400 via-rose-400 to-indigo-500 p-4 flex items-center justify-center text-slate-900 dark:text-white text-3xl shadow-md">
                  ✨
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <h3 className="text-base font-extrabold text-slate-900">Buat</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Membuat dari prompt satu baris dalam beberapa detik
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-pink-100 text-pink-700 font-extrabold text-[10px] tracking-wide">
                  ★ DIREKOMENDASIKAN
                </span>
              </button>
            </div>

            {/* Card 2: Menempelkan dalam teks */}
            <button
              onClick={() => {
                setCreateOption('Menempelkan dalam teks');
                setShowNotesModal(true);
                setFlowStage('agent_input');
              }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all flex flex-col items-start text-left space-y-4 cursor-pointer mt-6 sm:mt-6"
            >
              <div className="w-full h-28 rounded-xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-4 flex items-center justify-center text-slate-900 dark:text-white font-black text-3xl shadow-md">
                Aa
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900">Menempelkan dalam teks</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Membuat dari catatan, garis besar, atau konten yang sudah ada
                </p>
              </div>
            </button>

            {/* Card 3: Buat dari templat */}
            <button
              onClick={() => {
                setCreateOption('Buat dari templat');
                setPromptText('Buatkan presentasi laporan bisnis triwulan menggunakan templat profesional.');
                setFlowStage('agent_input');
              }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all flex flex-col items-start text-left space-y-4 cursor-pointer mt-6 sm:mt-6"
            >
              <div className="w-full h-28 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500 p-4 flex items-center justify-center text-slate-900 dark:text-white text-3xl shadow-md">
                📚
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900">Buat dari templat</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Membuat menggunakan struktur atau tata letak dari templat
                </p>
              </div>
            </button>

            {/* Card 4: Impor file atau URL */}
            <button
              onClick={() => {
                setCreateOption('Impor file atau URL');
                handleFileUploadSimulated();
                setFlowStage('agent_input');
              }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all flex flex-col items-start text-left space-y-4 cursor-pointer mt-6 sm:mt-6"
            >
              <div className="w-full h-28 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 p-4 flex items-center justify-center text-slate-900 dark:text-white text-3xl shadow-md">
                📤
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900">Impor file atau URL</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Menyempurnakan dokumen, presentasi, atau halaman web yang sudah ada
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- STAGE 4: AGENT INPUT ("Buat dengan Agent") ---------------- */}
      {flowStage === 'agent_input' && (
        <div className="relative flex-1 flex flex-col bg-[#0f172a] overflow-hidden p-6 sm:p-10">
          {/* Sleek Dark Background Simulation */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#131b2f] to-slate-950 pointer-events-none" />
          <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Top Left Navigation */}
          <div className="relative z-20 flex items-center justify-between mb-6">
            <button
              onClick={handleBackNavigation}
              className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          </div>

          {/* Centered Agent Input Card Modal */}
          <div className="relative z-20 max-w-2xl mx-auto w-full my-auto bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-center">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Buat dengan Agent
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium max-w-xl mx-auto">
                Ubah ide, catatan, dan file Anda menjadi presentasi, dokumen, dan unggahan sosial. Agent melakukan penelitian, mengutip sumber-sumbernya, dan membentuk narasinya.
              </p>
            </div>

            {/* Main Interactive Input Container */}
            <div className="bg-slate-950/50 border border-slate-700 focus-within:border-blue-500 rounded-2xl p-4 shadow-inner text-left space-y-3 transition-colors">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Deskripsikan ide presentasi, dokumen, atau topik yang ingin dibuat..."
                rows={4}
                className="w-full bg-transparent text-white text-sm sm:text-base font-medium placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />

              {/* Attached File/Notes Tag Badge */}
              {(pastedNotesText || attachedFileName) && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs font-bold w-fit">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="truncate max-w-[200px]">{attachedFileName || 'Catatan rapat terlampir'}</span>
                  <button
                    onClick={() => {
                      setPastedNotesText('');
                      setAttachedFileName(null);
                    }}
                    className="ml-2 text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick Prompt Suggestions */}
              {!promptText && !pastedNotesText && !attachedFileName && (
                <div className="pt-2 flex flex-wrap gap-2">
                  <button onClick={() => setPromptText('Buatkan presentasi tentang strategi pemasaran digital tahun 2024 untuk startup SaaS')} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors text-left">
                    🚀 Strategi Pemasaran Digital
                  </button>
                  <button onClick={() => setPromptText('Bantu saya merancang laporan evaluasi kinerja karyawan akhir tahun yang profesional')} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors text-left">
                    📊 Laporan Kinerja
                  </button>
                  <button onClick={() => setPromptText('Buat slide perkenalan perusahaan (Company Profile) yang elegan dan ringkas')} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors text-left">
                    🏢 Profil Perusahaan
                  </button>
                </div>
              )}

              {/* Bottom Control Bar Inside Box */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNotesModal(true)}
                    className="px-3 py-1.5 rounded-xl border border-dashed border-slate-600 hover:border-blue-500 bg-slate-900/50 text-slate-400 hover:text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Catatan rapat</span>
                  </button>
                </div>

                {/* Submit Action Button */}
                <button
                  onClick={handleInitialSubmit}
                  disabled={!promptText.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-blue-900/20 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <Play className="w-4 h-4 fill-current ml-1" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button onClick={() => setErrorMessage(null)} className="p-1 text-rose-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- STAGE 5: AGENT CHAT & PRESENTATION RESULT ---------------- */}
      {flowStage === 'agent_chat' && (
        <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">
          {/* Top Bar Header */}
          <header className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1 flex-wrap max-w-full">
              <button
                onClick={handleBackNavigation}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 flex-wrap max-w-full"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kembali</span>
              </button>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
                Presentasi Ringkas: Penyelarasan Langkah...
              </h3>
            </div>
          </header>

          {/* Main Chat Workspace */}
          <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 overflow-y-auto space-y-6 min-h-0 min-w-0">
            {/* Agent Header Control */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm flex-wrap max-w-full">
                <span className="text-blue-600">✦</span> Agent
              </div>
              <button
                onClick={handleClearConversation}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors flex-wrap max-w-full"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Jelas
              </button>
            </div>

            {/* Message History */}
            {chatHistory.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-100 text-slate-800 font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-sm space-y-3'
                  }`}
                >
                  {msg.sender === 'agent' && msg.text.includes('**Slide') ? (
                    <div className="space-y-4">
                      <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 font-medium">{msg.text.split('**Slide')[0]}</p>
                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                        {msg.text.split('**Slide').slice(1).map((slideText, idx) => (
                          <div key={idx} className="shrink-0 w-[280px] sm:w-[320px] h-[180px] sm:h-[200px] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-5 shadow-2xl snap-center flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                            <div className="text-white/60 text-[10px] font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                              <Layout className="w-3 h-3" /> Slide {slideText.split(':')[0]}
                            </div>
                            <div className="text-white text-sm sm:text-base font-semibold line-clamp-4 leading-relaxed mt-2">
                              {slideText.substring(slideText.indexOf(':') + 1).replace(/\*/g, '').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Inline Action if Agent asks for notes */}
                  {msg.sender === 'agent' && msg.text.includes('melihat catatan') && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowNotesModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-wrap max-w-full"
                      >
                        <Plus className="w-3.5 h-3.5" /> Paste Catatan Rapat
                      </button>
                      <button
                        onClick={handleFileUploadSimulated}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-wrap max-w-full"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload File (PDF/Word)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Progress State */}
            {isLoading && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-blue-700 space-y-2 animate-pulse shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900 flex-wrap max-w-full">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Gamma Agent Sedang Menyiapkan...</span>
                </div>
                <p className="text-slate-500 font-mono text-[11px]">{loadingProgressText}</p>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Revision Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="max-w-4xl mx-auto bg-white border-2 border-blue-500 rounded-2xl p-3 shadow-md space-y-2">
              <textarea
                value={revisionInput}
                onChange={(e) => setRevisionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRevisionSubmit();
                  }
                }}
                placeholder="Edit slide, ubah pengaturan, atau @sebutkan sumber"
                rows={2}
                className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none resize-none"
              />

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <button
                    onClick={() => setShowNotesModal(true)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                    title="Tambah Sumber"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleRevisionSubmit}
                  disabled={!revisionInput.trim() || isLoading}
                  className="w-8 h-8 rounded-full bg-[#0e44b8] text-slate-900 dark:text-white flex items-center justify-center hover:bg-[#0b3899] disabled:bg-slate-300 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL FOR PASTING NOTES ---------------- */}
      {showNotesModal && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Lampirkan Catatan Rapat / Teks
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={pastedNotesText}
              onChange={(e) => setPastedNotesText(e.target.value)}
              placeholder="Pastekan catatan rapat, notula, atau draf garis besar di sini..."
              rows={6}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleFileUploadSimulated}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer flex items-center gap-1.5 flex-wrap max-w-full"
              >
                <Upload className="w-3.5 h-3.5" /> Upload File Simulasi
              </button>

              <div className="flex items-center gap-2 flex-wrap max-w-full">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    if (flowStage === 'agent_chat') {
                      handleRevisionSubmit();
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0e44b8] text-slate-900 dark:text-white text-xs font-extrabold hover:bg-[#0b3899] cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- GENERAL INFORMATION MODAL ---------------- */}
      {infoModal && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-[#0e44b8] flex items-center justify-center text-2xl font-black">
              G
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">{infoModal.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{infoModal.content}</p>
            </div>
            <button
              onClick={() => setInfoModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#0e44b8] hover:bg-[#0b3899] text-slate-900 dark:text-white text-xs font-extrabold transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GammaReplica;
export const GammaSimulator = GammaReplica;
