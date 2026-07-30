import React, { useState } from 'react';
import {
  Sparkles, Search, Code, Settings, Download, ArrowRight, FolderPlus,
  RefreshCw, X, Plus, FileSpreadsheet, Presentation, Layers, Bot, Sliders,
  Folder, Check, Send, AlertCircle, Edit2, Trash2, Eye, FileText, ShieldAlert
} from 'lucide-react';

interface StudentData {
  id: number;
  name: string;
  course: string;
  grade: number;
  status: string;
}

interface ChatThread {
  id: string;
  title: string;
  messages: Array<{ sender: 'user' | 'claude'; text: string }>;
}

export const ClaudeFeaturesReplica: React.FC = () => {
  // Active Stage control: 'sidebar' (Stage 1) | 'artifacts' (Stage 2) | 'cowork' (Stage 3) | 'office' (Stage 4)
  const [activeStage, setActiveStage] = useState<'sidebar' | 'artifacts' | 'cowork' | 'office'>('sidebar');

  // Global status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // =========================================================
  // STAGE 1: NAVIGASI & CHAT UTAMA STATE
  // =========================================================
  const [selectedNav, setSelectedNav] = useState<string>('Obrolan');
  const [recentsList, setRecentsList] = useState<ChatThread[]>([
    {
      id: 'rec-1',
      title: 'Pembersihan Data Kurikulum Maxy',
      messages: [
        { sender: 'user', text: 'Bagaimana alur terbaik pembersihan data kurikulum kursus AI Maxy?' },
        { sender: 'claude', text: 'Rekomendasi alur pembersihan data:\n1. Hapus duplikasi entri modul.\n2. Normalisasi format judul & deskripsi.\n3. Validasi keterikatan tugas dengan mini quiz.' }
      ]
    },
    {
      id: 'rec-2',
      title: 'Analisis Tech Stack React',
      messages: [
        { sender: 'user', text: 'Rekomendasikan tech stack modern React 2026 untuk dashboard siswa.' },
        { sender: 'claude', text: 'Gunakan Vite + React 18, Tailwind CSS v4, Lucide React icons, dan Zustand/Context API untuk state management yang ringan.' }
      ]
    },
    {
      id: 'rec-3',
      title: 'Draf Kontrak Kerja Instruktur Maxy',
      messages: [
        { sender: 'user', text: 'Buatkan draf poin kerahasiaan materi (NDA) untuk instruktur.' },
        { sender: 'claude', text: 'Instruktur sepakat menjaga kerahasiaan materi modul, data siswa, serta kode sumber platform Maxy Academy selama dan setelah masa kontrak.' }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState<string | null>('rec-1');
  const [activeMessages, setActiveMessages] = useState<Array<{ sender: 'user' | 'claude'; text: string }>>([
    { sender: 'user', text: 'Bagaimana alur terbaik pembersihan data kurikulum kursus AI Maxy?' },
    { sender: 'claude', text: 'Rekomendasi alur pembersihan data:\n1. Hapus duplikasi entri modul.\n2. Normalisasi format judul & deskripsi.\n3. Validasi keterikatan tugas dengan mini quiz.' }
  ]);
  const [navChatInput, setNavChatInput] = useState<string>('');

  // Start New Chat (Clear area)
  const handleStartNewChat = () => {
    setActiveChatId(null);
    setActiveMessages([]);
    setNavChatInput('');
    setSelectedNav('Obrolan');
    showToast('Obrolan Baru Dimulai (Memori Bersih)');
  };

  // Select Recent Chat
  const handleSelectRecent = (recent: ChatThread) => {
    setActiveChatId(recent.id);
    setActiveMessages(recent.messages);
    setSelectedNav('Obrolan');
    showToast(`Membuka chat: "${recent.title}"`);
  };

  // Send Nav Chat Message
  const handleSendNavChat = async (promptText?: string) => {
    const textToSend = promptText || navChatInput;
    if (!textToSend.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg = { sender: 'user' as const, text: textToSend };
    setActiveMessages(prev => [...prev, userMsg]);
    if (!promptText) setNavChatInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/claude-features-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'nav',
          prompt: textToSend
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghubungi Gemini API');

      const aiMsg = { sender: 'claude' as const, text: data.text };
      setActiveMessages(prev => [...prev, aiMsg]);

      // If this was a new chat or active chat, update or append to Recents list
      if (!activeChatId) {
        const newId = `rec-${Date.now()}`;
        const newThread: ChatThread = {
          id: newId,
          title: data.titleSummary || textToSend.substring(0, 20) + '...',
          messages: [userMsg, aiMsg]
        };
        setRecentsList(prev => [newThread, ...prev]);
        setActiveChatId(newId);
      } else {
        setRecentsList(prev => prev.map(item => item.id === activeChatId ? { ...item, messages: [...item.messages, userMsg, aiMsg] } : item));
      }
    } catch (err: any) {
      console.error("Error Nav Chat:", err);
      setErrorMessage(err.message || "Gagal memproses pesan chat.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // STAGE 2: ARTIFACTS STATE
  // =========================================================
  const [showArtifactModal, setShowArtifactModal] = useState<boolean>(false);
  const [artifactPrompt, setArtifactPrompt] = useState<string>('');
  const [artifactRevisionPrompt, setArtifactRevisionPrompt] = useState<string>('');
  const [showArtifactPreview, setShowArtifactPreview] = useState<boolean>(true);
  const [artifactTab, setArtifactTab] = useState<'preview' | 'code'>('preview');

  const [currentArtifact, setCurrentArtifact] = useState<{
    title: string;
    summary: string;
    code: string;
  }>({
    title: 'maxy_dashboard_component.tsx',
    summary: 'Komponen UI Portal Siswa Maxy Academy dengan statistik modul, indikator kelulusan, dan tombol interaktif.',
    code: `export function MaxyStudentPortal() {
  return (
    <div className="p-6 bg-[#18181b] text-white rounded-2xl border border-amber-500/30 font-sans">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4">
        <h2 className="text-base font-bold text-amber-400">✨ Maxy Student Portal</h2>
        <span className="bg-emerald-950 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-800">Status: Aktif</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-[#242427] p-3 rounded-xl border border-neutral-800">
          <div className="text-neutral-400">Progress Pembelajaran</div>
          <div className="text-lg font-bold text-white mt-1">88% Complete</div>
        </div>
        <div className="bg-[#242427] p-3 rounded-xl border border-neutral-800">
          <div className="text-neutral-400">Modul Selesai</div>
          <div className="text-lg font-bold text-amber-400 mt-1">22 / 25 Modul</div>
        </div>
      </div>
    </div>
  );
}`
  });

  // Handle Generate / Revise Artifact via Gemini API
  const handleGenerateArtifact = async (isRevision = false) => {
    const promptToSubmit = isRevision ? artifactRevisionPrompt : artifactPrompt;
    if (!promptToSubmit.trim() || isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const fullReqPrompt = isRevision
        ? `REVISI ARTIFAK SEBELUMNYA ("${currentArtifact.title}"): ${promptToSubmit}\n\nKODE SEBELUMNYA:\n${currentArtifact.code}`
        : promptToSubmit;

      const res = await fetch('/api/claude-features-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'artifacts',
          prompt: fullReqPrompt
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghasilkan artefak');

      setCurrentArtifact({
        title: data.title || 'generated_artifact.tsx',
        summary: data.summary || 'Artefak berhasil diproses.',
        code: data.code || '// Kode artefak'
      });

      setShowArtifactPreview(true);
      setShowArtifactModal(false);
      if (isRevision) setArtifactRevisionPrompt('');
      else setArtifactPrompt('');
      showToast('Artefak Berhasil Dihasilkan oleh Gemini API!');
    } catch (err: any) {
      console.error("Error Artifact Gen:", err);
      setErrorMessage(err.message || "Gagal menghasilkan artefak.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // STAGE 3: COWORK AGENT STATE
  // =========================================================
  const [selectedQuickAction, setSelectedQuickAction] = useState<string>('Crunch data');
  const [coworkPrompt, setCoworkPrompt] = useState<string>(
    'Summarize my meetings from this week and find action items. Where do you think I can be more efficient?'
  );
  const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('Course Curriculum');
  const [attachedFolder, setAttachedFolder] = useState<string | null>(null);
  const [coworkRunning, setCoworkRunning] = useState<boolean>(false);
  const [coworkProgressStep, setCoworkProgressStep] = useState<number>(0);
  const [coworkStepsList, setCoworkStepsList] = useState<string[]>([
    'Membaca dokumen & rekaman rapat',
    'Mengekstrak poin utama & action items',
    'Menganalisis efisiensi alur kerja',
    'Menyusun ringkasan eksekutif akhir'
  ]);
  const [coworkFinalResult, setCoworkFinalResult] = useState<string | null>(null);

  const quickActions = [
    { title: 'Create a file', icon: '📄', prompt: 'Create a project roadmap document for Maxy Academy Q3 course rollout.' },
    { title: 'Crunch data', icon: '📊', prompt: 'Summarize my meetings from this week and find action items. Where do you think I can be more efficient?' },
    { title: 'Make a prototype', icon: '🎨', prompt: 'Build an interactive React prototype for student course registration.' },
    { title: 'Prep for the day', icon: '☀️', prompt: 'Review my unread messages and calendar events to draft my daily priority list.' },
    { title: 'Organize files', icon: '📁', prompt: 'Scan my downloads folder and organize student assignment submissions by course.' },
    { title: 'Send a message', icon: '💬', prompt: 'Draft a progress update message to the Maxy Academy lead instructor team.' },
  ];

  // Handle Cowork Execution with Gemini API
  const handleRunCowork = async () => {
    if (!coworkPrompt.trim() || coworkRunning) return;

    setErrorMessage(null);
    setCoworkRunning(true);
    setCoworkProgressStep(1);
    setCoworkFinalResult(null);

    try {
      const res = await fetch('/api/claude-features-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'cowork',
          prompt: coworkPrompt,
          context: { folderName: attachedFolder }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses tugas Cowork');

      if (data.steps && data.steps.length > 0) {
        setCoworkStepsList(data.steps);
      }

      // Simulate step progress animation
      setTimeout(() => setCoworkProgressStep(2), 800);
      setTimeout(() => setCoworkProgressStep(3), 1600);
      setTimeout(() => {
        setCoworkProgressStep(4);
        setCoworkFinalResult(data.content || 'Tugas Cowork Selesai.');
        setCoworkRunning(false);
        showToast('Eksekusi Agen Cowork Selesai Secara Otonom!');
      }, 2500);

    } catch (err: any) {
      console.error("Error Cowork:", err);
      setErrorMessage(err.message || "Gagal memproses tugas Cowork.");
      setCoworkRunning(false);
      setCoworkProgressStep(0);
    }
  };

  // =========================================================
  // STAGE 4: EXCEL & PPT STATE
  // =========================================================
  const [officeApp, setOfficeApp] = useState<'excel' | 'powerpoint'>('excel');

  // Editable Student Data Table State
  const [studentData, setStudentData] = useState<StudentData[]>([
    { id: 1, name: 'Budi Santoso', course: 'Fullstack Web', grade: 88, status: 'Lulus' },
    { id: 2, name: 'Siti Rahma', course: 'AI Engineering', grade: 94, status: 'Lulus' },
    { id: 3, name: 'Ahmad Fauzi', course: 'Fullstack Web', grade: 72, status: 'Remedial' },
    { id: 4, name: 'Dewi Lestari', course: 'AI Engineering', grade: 91, status: 'Lulus' },
    { id: 5, name: 'Rian Hidayat', course: 'Data Science', grade: 65, status: 'Remedial' }
  ]);

  const [officeInput, setOfficeInput] = useState<string>('');
  const [officeChat, setOfficeChat] = useState<Array<{ role: 'user' | 'claude'; text: string }>>([]);

  // PPT Slides generated state
  const [pptSlides, setPptSlides] = useState<Array<{ title: string; subtitle: string; points: string[] }>>([
    {
      title: 'Peluncuran Kurikulum AI Maxy Academy Q3',
      subtitle: 'Modul Interaktif Praktis & Hands-on Simulator',
      points: [
        'Mengintegrasikan Claude 3.7 Sonnet, Gemini Gems, & Mistral Vibe',
        'Simulasi dunia nyata untuk 1,000+ mahasiswa terdaftar',
        'Sertifikasi resmi standar industri'
      ]
    }
  ]);

  // Handle editing table cell
  const handleUpdateStudent = (id: number, field: keyof StudentData, value: any) => {
    setStudentData(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Handle adding new student row
  const handleAddStudentRow = () => {
    const newId = Date.now();
    setStudentData(prev => [
      ...prev,
      { id: newId, name: 'Siswa Baru', course: 'AI Engineering', grade: 85, status: 'Lulus' }
    ]);
    showToast('Baris data baru ditambahkan ke tabel Excel!');
  };

  // Handle Office Submit to Gemini API
  const handleOfficeSubmit = async (customPrompt?: string) => {
    const promptToSend = customPrompt || officeInput;
    if (!promptToSend.trim() || isLoading) return;

    setErrorMessage(null);
    setOfficeChat(prev => [...prev, { role: 'user', text: promptToSend }]);
    if (!customPrompt) setOfficeInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/claude-features-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'office',
          prompt: promptToSend,
          context: {
            officeApp,
            tableData: studentData
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses permintaan Office');

      setOfficeChat(prev => [...prev, { role: 'claude', text: data.text }]);

      // If PPT mode, update slide deck sample based on prompt
      if (officeApp === 'powerpoint') {
        setPptSlides([
          {
            title: `Presentasi: ${promptToSend}`,
            subtitle: 'Dihasilkan otomatis oleh Claude for PowerPoint',
            points: [
              'Analisis mendalam berdasarkan konteks Maxy Academy',
              'Struktur visual terpotong menjadi 4 poin eksekutif',
              'Siap diekspor ke Microsoft PowerPoint (.pptx)'
            ]
          }
        ]);
      }

      showToast(`Asisten Claude for ${officeApp === 'excel' ? 'Excel' : 'PPT'} Berhasil Merespons!`);
    } catch (err: any) {
      console.error("Error Office Chat:", err);
      setErrorMessage(err.message || "Gagal memproses permintaan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[750px] bg-[#141416] text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-800 flex flex-col relative shadow-2xl">
      
      {/* Top Navigation Bar Across All Stages */}
      <div className="bg-[#1c1c20] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
            ✳
          </div>
          <span className="font-extrabold text-slate-100 text-sm">Claude Features Studio</span>
          <span className="text-slate-500 text-xs hidden sm:inline">| Artifacts, Cowork & Office Extensions</span>
        </div>

        {/* Stage Switcher Controls */}
        <div className="flex items-center space-x-1 bg-[#121214] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { setActiveStage('sidebar'); setSelectedNav('Obrolan'); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeStage === 'sidebar' ? 'bg-amber-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 1: Navigasi
          </button>
          <button
            onClick={() => setActiveStage('artifacts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeStage === 'artifacts' ? 'bg-amber-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 2: Artifacts
          </button>
          <button
            onClick={() => setActiveStage('cowork')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeStage === 'cowork' ? 'bg-amber-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 3: Cowork
          </button>
          <button
            onClick={() => setActiveStage('office')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeStage === 'office' ? 'bg-amber-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 4: Excel & PPT
          </button>
        </div>
      </div>

      {/* Global Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-amber-400 flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-200" />
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
          <button onClick={() => setErrorMessage(null)} className="hover:text-white font-bold">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 1: SIDEBAR UTAMA & NAVIGASI CLAUDE */}
      {/* ========================================================= */}
      {activeStage === 'sidebar' && (
        <div className="flex-1 flex flex-col md:flex-row bg-[#1b1b1e] overflow-hidden">
          {/* Left Claude Sidebar */}
          <aside className="w-full md:w-64 bg-[#141416] border-r border-slate-800 p-3.5 flex flex-col justify-between shrink-0 text-xs space-y-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Header Logo */}
              <div className="flex items-center justify-between px-1">
                <span className="font-serif text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span className="text-amber-500 font-sans">✳</span> Claude
                </span>
                <div className="flex items-center space-x-1 text-slate-400">
                  <button onClick={() => showToast('Pencarian riwayat obrolan aktif')} className="p-1 hover:text-white">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Baru Button */}
              <button
                onClick={handleStartNewChat}
                className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl border border-slate-700 bg-[#222226] hover:bg-[#2a2a30] text-slate-100 font-bold transition-all shadow-sm"
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span>Chat baru</span>
              </button>

              {/* Main Navigation List */}
              <div className="space-y-1 font-semibold text-slate-300">
                {[
                  { id: 'Obrolan', label: 'Obrolan', icon: <Bot className="w-4 h-4 text-amber-400" /> },
                  { id: 'Proyek', label: 'Proyek', icon: <Folder className="w-4 h-4 text-blue-400" /> },
                  { id: 'Artefak', label: 'Artefak', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
                  { id: 'Kode', label: 'Kode', icon: <Code className="w-4 h-4 text-purple-400" />, badge: 'Tingkatkan' },
                  { id: 'Sesuaikan', label: 'Sesuaikan', icon: <Settings className="w-4 h-4 text-slate-400" /> },
                  { id: 'Cowork & Add-ins', label: 'Cowork & Add-ins', icon: <Sparkles className="w-4 h-4 text-orange-400" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedNav(item.id);
                      if (item.id === 'Artefak') setActiveStage('artifacts');
                      else if (item.id === 'Cowork & Add-ins') setActiveStage('cowork');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${selectedNav === item.id ? 'bg-[#28282d] text-white font-bold' : 'hover:bg-slate-800/50 hover:text-slate-100'}`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.5 rounded font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Terbaru (Recent Chat History) Section */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                  <span>Terbaru</span>
                  <Sliders className="w-3 h-3 text-slate-500" />
                </div>

                <div className="space-y-0.5 text-slate-400">
                  {recentsList.map((recent) => (
                    <div
                      key={recent.id}
                      onClick={() => handleSelectRecent(recent)}
                      className={`p-2 rounded-lg cursor-pointer truncate text-[11px] transition-colors ${activeChatId === recent.id ? 'bg-[#28282d] text-amber-300 font-bold' : 'hover:bg-slate-800/50 hover:text-slate-200'}`}
                    >
                      {recent.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom User Profile Panel */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-orange-700 font-bold text-white flex items-center justify-center text-xs">
                  MA
                </div>
                <div className="truncate">
                  <div className="font-bold text-slate-200 truncate">Maxy Student</div>
                  <div className="text-[10px] text-slate-500">Paket gratis</div>
                </div>
              </div>
              <button onClick={() => showToast('Unduh aplikasi desktop Claude')} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* Main Workspace Area (Chat View vs Feature Grid) */}
          <main className="flex-1 p-4 sm:p-8 flex flex-col justify-between overflow-y-auto max-w-4xl mx-auto space-y-6 w-full">
            {selectedNav === 'Obrolan' ? (
              <div className="flex-1 flex flex-col justify-between space-y-4 h-full min-h-[500px]">
                {/* Chat Messages Stream */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px] p-2">
                  {activeMessages.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold flex items-center justify-center text-xl mx-auto shadow-lg">
                        ✳
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif text-white font-medium">
                        Halo, Maxy Student
                      </h2>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Mulai percakapan baru dengan Claude 3.7 Sonnet. Tanyakan pertanyaan, minta analisis kode, atau draf dokumen.
                      </p>
                    </div>
                  ) : (
                    activeMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xl rounded-2xl p-3.5 text-xs leading-relaxed space-y-1.5 shadow-md ${msg.sender === 'user' ? 'bg-amber-600 text-white rounded-tr-none' : 'bg-[#222226] border border-slate-800 text-slate-100 rounded-tl-none'}`}>
                          <div className="font-bold text-[10px] text-amber-300">
                            {msg.sender === 'user' ? 'Maxy Student' : '✳ Claude 3.7 Sonnet'}
                          </div>
                          <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                        </div>
                      </div>
                    ))
                  )}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#222226] border border-slate-800 rounded-2xl rounded-tl-none p-3 text-xs text-amber-400 flex items-center space-x-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Claude sedang memproses jawaban via Gemini API...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input Bar */}
                <div className="p-3 bg-[#222226] border border-slate-800 rounded-2xl flex items-center space-x-2 shadow-xl">
                  <input
                    type="text"
                    value={navChatInput}
                    onChange={(e) => setNavChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendNavChat()}
                    placeholder="Mulai percakapan dengan Claude..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2"
                  />
                  <button
                    onClick={() => handleSendNavChat()}
                    disabled={isLoading}
                    className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-xl font-bold shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Feature Cards Map Overview */
              <div className="space-y-6 my-auto">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full inline-block">
                    Navigasi Ekosistem Claude
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Peta Fitur & Ruang Kerja Claude
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Klik salah satu kartu fitur di bawah ini untuk langsung berpindah ke tahap simulasi terkait.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Obrolan (Chat Utama)',
                      icon: <Bot className="w-5 h-5 text-amber-400" />,
                      desc: 'Antarmuka percakapan standar untuk mengajukan pertanyaan dan brainstorming ide.',
                      action: () => setSelectedNav('Obrolan')
                    },
                    {
                      title: 'Proyek (Projects)',
                      icon: <Folder className="w-5 h-5 text-blue-400" />,
                      desc: 'Mengelompokkan percakapan dan dokumen referensi ke dalam satu ruang kerja terisolasi.',
                      action: () => { setSelectedNav('Proyek'); showToast('Proyek: Mengunci dokumen referensi untuk tim Maxy Academy'); }
                    },
                    {
                      title: 'Artefak (Artifacts - Tahap 2)',
                      icon: <Layers className="w-5 h-5 text-emerald-400" />,
                      desc: 'Pratinjau langsung kode, aplikasi web, dan dokumen terpisah di panel samping.',
                      action: () => setActiveStage('artifacts')
                    },
                    {
                      title: 'Kode (Code Workspace)',
                      icon: <Code className="w-5 h-5 text-purple-400" />,
                      desc: 'Ruang kerja eksekusi dan refactoring kode secara mendalam (Fitur Pro).',
                      action: () => showToast('Fitur Kode memerlukan paket Tingkatkan/Pro')
                    },
                    {
                      title: 'Sesuaikan (Customization)',
                      icon: <Settings className="w-5 h-5 text-slate-400" />,
                      desc: 'Atur instruksi kustom, gaya bahasa, dan preferensi respon sesuai kebutuhan.',
                      action: () => showToast('Atur kustomisasi instruksi profil Claude Anda')
                    },
                    {
                      title: 'Cowork & Add-ins (Tahap 3 & 4)',
                      icon: <Sparkles className="w-5 h-5 text-orange-400" />,
                      desc: 'Fitur agen otonom Cowork dan ekstensi produktivitas langsung di Excel & PPT.',
                      action: () => setActiveStage('cowork')
                    }
                  ].map((card, cidx) => (
                    <div
                      key={cidx}
                      onClick={card.action}
                      className="bg-[#222227] border border-slate-800 hover:border-amber-500/60 p-4 rounded-2xl space-y-2 cursor-pointer transition-all hover:-translate-y-0.5 shadow-md"
                    >
                      <div className="flex items-center space-x-2.5">
                        {card.icon}
                        <h3 className="font-bold text-sm text-slate-100">{card.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 2: ARTIFACTS (GENERATOR KODE & PREVIEW) */}
      {/* ========================================================= */}
      {activeStage === 'artifacts' && (
        <div className="flex-1 bg-[#18181b] flex flex-col overflow-y-auto">
          <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#141416]">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-2xl font-bold text-white">Claude Artifacts Studio</h2>
            </div>
            <button
              onClick={() => setShowArtifactModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Artefak baru</span>
            </button>
          </header>

          <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col space-y-6">
            {/* Artifact Workspace Container */}
            <div className="bg-[#202025] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-mono text-amber-300 ml-2 font-bold">{currentArtifact.title}</span>
                </div>

                <div className="flex items-center space-x-2 bg-[#141416] p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setArtifactTab('preview')}
                    className={`px-3 py-1 rounded-lg font-bold ${artifactTab === 'preview' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                  >
                    Pratinjau Live
                  </button>
                  <button
                    onClick={() => setArtifactTab('code')}
                    className={`px-3 py-1 rounded-lg font-bold ${artifactTab === 'code' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                  >
                    Tampilan Kode
                  </button>
                </div>
              </div>

              {/* Summary Description Box */}
              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200">
                <strong className="block font-bold text-amber-300 mb-1">📌 Ringkasan Artefak:</strong>
                <p>{currentArtifact.summary}</p>
              </div>

              {/* Artifact Tab Display */}
              {artifactTab === 'preview' ? (
                <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
                  <div className="p-4 bg-[#1b1b1e] rounded-xl border border-amber-500/30 font-mono text-slate-200 whitespace-pre-wrap">
                    {currentArtifact.code.substring(0, 400)}
                    {currentArtifact.code.length > 400 && '\n... [Kode lengkap tersedia di tab Tampilan Kode]'}
                  </div>
                </div>
              ) : (
                <pre className="bg-[#121214] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
                  {currentArtifact.code}
                </pre>
              )}

              {/* Revision Box (Re-edit Option) */}
              <div className="pt-3 border-t border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-300">💡 Minta Revisi / Edit Ulang Artefak Ini:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={artifactRevisionPrompt}
                    onChange={(e) => setArtifactRevisionPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateArtifact(true)}
                    placeholder="Misal: Tambahkan tombol eksport PDF atau ganti tema menjadi dark luxury..."
                    className="flex-1 bg-[#141416] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleGenerateArtifact(true)}
                    disabled={isLoading}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow flex items-center space-x-1"
                  >
                    <span>Revisi</span>
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* New Artifact Input Modal */}
          {showArtifactModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#202025] border border-slate-700 text-slate-100 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h3 className="font-bold text-base text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Buat Artefak Baru dengan Gemini API</span>
                  </h3>
                  <button onClick={() => setShowArtifactModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-300">Deskripsikan Komponen / Dokumen yang Ingin Dibuat:</label>
                  <textarea
                    value={artifactPrompt}
                    onChange={(e) => setArtifactPrompt(e.target.value)}
                    rows={4}
                    placeholder="Contoh: Buatkan komponen React kalkulator nilai siswa dengan antarmuka visual Tailwind..."
                    className="w-full bg-[#141416] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setShowArtifactModal(false)}
                    className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleGenerateArtifact(false)}
                    disabled={isLoading}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5"
                  >
                    <span>Generate Artefak</span>
                    {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 3: COWORK (RUANG KERJA AGENTIC OTONOM) */}
      {/* ========================================================= */}
      {activeStage === 'cowork' && (
        <div className="flex-1 bg-[#f7f5f0] text-slate-900 flex flex-col overflow-y-auto relative">
          <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300 px-3 py-1 rounded-full inline-block">
                Claude Agentic Workspace
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Cowork Space
              </h2>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((qa, qidx) => (
                <div
                  key={qidx}
                  onClick={() => {
                    setSelectedQuickAction(qa.title);
                    setCoworkPrompt(qa.prompt);
                    showToast(`Prompt diisi dari kartu: ${qa.title}`);
                  }}
                  className={`bg-white border rounded-2xl p-4 flex items-center space-x-3 cursor-pointer shadow-sm transition-all hover:shadow-md ${selectedQuickAction === qa.title ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-400'}`}
                >
                  <span className="text-xl">{qa.icon}</span>
                  <span className="font-bold text-xs text-slate-800">{qa.title}</span>
                </div>
              ))}
            </div>

            {/* Input Prompt Box */}
            <div className="bg-white border border-slate-300 rounded-3xl p-4 shadow-xl space-y-4">
              <textarea
                value={coworkPrompt}
                onChange={(e) => setCoworkPrompt(e.target.value)}
                rows={3}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none font-medium"
              />

              {attachedFolder && (
                <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl text-xs text-blue-800 font-bold">
                  <Folder className="w-3.5 h-3.5" />
                  <span>Folder terhubung: {attachedFolder}</span>
                  <button onClick={() => setAttachedFolder(null)} className="hover:text-red-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowFilePicker(true)}
                  className="flex items-center space-x-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <FolderPlus className="w-4 h-4 text-amber-700" />
                  <span>Work in a folder +</span>
                </button>

                <button
                  onClick={handleRunCowork}
                  disabled={coworkRunning}
                  className="bg-[#c25e38] hover:bg-[#a84c2b] disabled:opacity-50 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center space-x-1.5"
                >
                  <span>Let's go</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Checklist Card */}
            {coworkProgressStep > 0 && (
              <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl max-w-md mx-auto w-full space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Progress Eksekusi Cowork</span>
                  </h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {coworkProgressStep < 4 ? 'Sedang Eksekusi...' : 'Selesai'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {coworkStepsList.map((stepLabel, idx) => {
                    const stepNum = idx + 1;
                    const isDone = coworkProgressStep > stepNum || coworkProgressStep === 4;
                    const isCurrent = coworkProgressStep === stepNum && coworkProgressStep < 4;

                    return (
                      <div key={idx} className="flex items-center space-x-3">
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            ✓
                          </div>
                        ) : isCurrent ? (
                          <div className="w-6 h-6 rounded-full border-2 border-amber-600 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 animate-spin">
                            ↻
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {stepNum}
                          </div>
                        )}
                        <span className={`font-semibold ${isDone ? 'text-slate-800 line-through' : isCurrent ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                          {stepLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {coworkFinalResult && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-slate-800 space-y-1.5 font-mono whitespace-pre-wrap">
                    {coworkFinalResult}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Folder Selection Modal */}
          {showFilePicker && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[85vh]">
                <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                    <Folder className="w-4 h-4 text-amber-600" />
                    <span>Select Folder for Cowork Context</span>
                  </div>
                  <button onClick={() => setShowFilePicker(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <label className="text-xs font-bold text-slate-700">Nama Folder / Pilih Folder Kerja:</label>
                  <input
                    type="text"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {['Course Curriculum', 'Maxy Projects', 'Market Analysis', 'Contracts', 'Expenses', 'Transcripts'].map((fName, fidx) => (
                      <div
                        key={fidx}
                        onClick={() => setSelectedFolder(fName)}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-all ${selectedFolder === fName ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-400 bg-white'}`}
                      >
                        <Folder className={`w-8 h-8 ${selectedFolder === fName ? 'text-amber-600' : 'text-blue-500'}`} />
                        <span className="font-bold text-slate-800 text-[11px] truncate w-full">{fName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Selected: {selectedFolder}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowFilePicker(false)}
                      className="px-4 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        setAttachedFolder(selectedFolder);
                        setShowFilePicker(false);
                        showToast(`Folder "${selectedFolder}" Terhubung ke Cowork!`);
                      }}
                      className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow"
                    >
                      Hubungkan Folder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 4: EXCEL & POWERPOINT EXTENSIONS */}
      {/* ========================================================= */}
      {activeStage === 'office' && (
        <div className="flex-1 bg-[#121214] flex flex-col overflow-hidden">
          {/* Sub-tab Switcher Header */}
          <div className="bg-[#18181c] border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <span className="text-slate-400">Claude Productivity Add-ins:</span>
              <button
                onClick={() => setOfficeApp('excel')}
                className={`px-3 py-1.5 rounded-xl flex items-center space-x-2 transition-all ${officeApp === 'excel' ? 'bg-emerald-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Claude for Excel</span>
              </button>
              <button
                onClick={() => setOfficeApp('powerpoint')}
                className={`px-3 py-1.5 rounded-xl flex items-center space-x-2 transition-all ${officeApp === 'powerpoint' ? 'bg-orange-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Presentation className="w-4 h-4" />
                <span>Claude for PowerPoint</span>
              </button>
            </div>
          </div>

          {/* Office Main Workspace Split Screen */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Main Office Simulation Canvas */}
            <div className="flex-1 bg-white text-slate-900 p-4 sm:p-6 overflow-y-auto">
              {officeApp === 'excel' ? (
                /* Excel Editable Table */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-sm text-emerald-800 flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Maxy_Student_Grades_Q3.xlsx (Editable State)</span>
                    </span>
                    <button
                      onClick={handleAddStudentRow}
                      className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded-lg shadow"
                    >
                      + Tambah Baris Siswa
                    </button>
                  </div>

                  <div className="border rounded-xl overflow-hidden text-xs shadow-md">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b font-mono text-slate-700">
                          <th className="p-2 border-r">#</th>
                          <th className="p-2 border-r">Nama Siswa</th>
                          <th className="p-2 border-r">Kursus</th>
                          <th className="p-2 border-r">Nilai</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-mono text-slate-800">
                        {studentData.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="p-2 border-r bg-slate-50 font-bold text-slate-500">{row.id}</td>
                            <td className="p-2 border-r">
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => handleUpdateStudent(row.id, 'name', e.target.value)}
                                className="w-full bg-transparent focus:bg-amber-50 rounded px-1"
                              />
                            </td>
                            <td className="p-2 border-r">
                              <input
                                type="text"
                                value={row.course}
                                onChange={(e) => handleUpdateStudent(row.id, 'course', e.target.value)}
                                className="w-full bg-transparent focus:bg-amber-50 rounded px-1"
                              />
                            </td>
                            <td className="p-2 border-r">
                              <input
                                type="number"
                                value={row.grade}
                                onChange={(e) => handleUpdateStudent(row.id, 'grade', Number(e.target.value))}
                                className="w-20 bg-transparent focus:bg-amber-50 rounded px-1 font-bold"
                              />
                            </td>
                            <td className="p-2 font-bold">
                              <select
                                value={row.status}
                                onChange={(e) => handleUpdateStudent(row.id, 'status', e.target.value)}
                                className={`bg-transparent focus:bg-amber-50 rounded px-1 ${row.status === 'Lulus' ? 'text-emerald-700' : 'text-amber-700'}`}
                              >
                                <option value="Lulus">Lulus</option>
                                <option value="Remedial">Remedial</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* PowerPoint Slide Canvas */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-sm text-orange-800 flex items-center space-x-2">
                      <Presentation className="w-4 h-4" />
                      <span>Maxy_AI_Course_Presentation.pptx</span>
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-800 font-mono px-2 py-0.5 rounded">PPT Add-in Active</span>
                  </div>

                  <div className="space-y-4">
                    {pptSlides.map((slide, sidx) => (
                      <div key={sidx} className="bg-slate-900 text-white rounded-2xl p-6 min-h-[180px] flex flex-col justify-center space-y-3 shadow-lg border border-slate-800">
                        <span className="text-orange-400 font-mono text-xs uppercase tracking-widest">Slide {sidx + 1}</span>
                        <h3 className="text-xl font-bold font-serif">{slide.title}</h3>
                        <p className="text-xs text-amber-200">{slide.subtitle}</p>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                          {slide.points.map((pt, pidx) => (
                            <li key={pidx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Claude Add-in Panel */}
            <div className="w-full md:w-80 bg-[#18181c] border-l border-slate-800 p-4 flex flex-col justify-between shrink-0 space-y-4 text-xs">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 font-bold text-amber-400 border-b border-slate-800 pb-2">
                  <Bot className="w-4 h-4" />
                  <span>Claude Side Panel ({officeApp === 'excel' ? 'Excel' : 'PPT'})</span>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Quick Actions</span>
                  {(officeApp === 'excel' ? [
                    "Hitung rata-rata nilai per kursus",
                    "Buat formula VLOOKUP status kelulusan",
                    "Temukan data duplikat & bersihkan"
                  ] : [
                    "Buat 5 slide presentasi dari draf Maxy",
                    "Restrukturisasi layout slide ini",
                    "Ringkas dokumen PDF jadi poin slide"
                  ]).map((qp, qpidx) => (
                    <button
                      key={qpidx}
                      onClick={() => handleOfficeSubmit(qp)}
                      disabled={isLoading}
                      className="w-full text-left p-2 rounded-xl bg-[#222228] hover:bg-[#2a2a32] text-slate-300 transition-all border border-slate-800 text-[11px] font-medium"
                    >
                      {qp}
                    </button>
                  ))}
                </div>

                {/* Chat History */}
                {officeChat.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800 max-h-48 overflow-y-auto">
                    {officeChat.map((msg, midx) => (
                      <div key={midx} className={`p-2.5 rounded-xl text-[11px] ${msg.role === 'user' ? 'bg-amber-950 text-amber-200 border border-amber-800 text-right' : 'bg-[#222228] text-slate-200 border border-slate-800'}`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={officeInput}
                  onChange={(e) => setOfficeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOfficeSubmit();
                  }}
                  placeholder={`Minta Claude bantu di ${officeApp}...`}
                  className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleOfficeSubmit()}
                  disabled={isLoading}
                  className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-xl font-bold shadow"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
