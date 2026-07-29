import React, { useState } from 'react';
import {
  Sparkles, Search, Code, LayoutGrid, FileText, Settings, Download,
  ChevronRight, ArrowRight, FolderPlus, CheckCircle2, Play, RefreshCw,
  X, Plus, FileSpreadsheet, Presentation, Layers, Bot, Sliders, HardDrive,
  Folder, Laptop, Compass, Database, Check, ExternalLink, HelpCircle
} from 'lucide-react';

export const ClaudeFeaturesReplica: React.FC = () => {
  // Stage control: 'sidebar' | 'artifacts' | 'cowork' | 'office'
  const [activeStage, setActiveStage] = useState<'sidebar' | 'artifacts' | 'cowork' | 'office'>('sidebar');

  // Sidebar selected nav item
  const [selectedNav, setSelectedNav] = useState<string>('Obrolan');

  // Stage 2 Artifacts state: whether preview is open
  const [showArtifactPreview, setShowArtifactPreview] = useState<boolean>(false);
  const [artifactTab, setArtifactTab] = useState<'preview' | 'code'>('preview');

  // Stage 3 Cowork state
  const [selectedQuickAction, setSelectedQuickAction] = useState<string>('Crunch data');
  const [coworkPrompt, setCoworkPrompt] = useState<string>(
    'Summarize my meetings from this week and find action items. Where do you think I can be more efficient?'
  );
  const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('Course Curriculum');
  const [attachedFolder, setAttachedFolder] = useState<string | null>(null);
  const [coworkRunning, setCoworkRunning] = useState<boolean>(false);
  const [coworkProgressStep, setCoworkProgressStep] = useState<number>(0);

  // Stage 4 Excel / PPT state
  const [officeApp, setOfficeApp] = useState<'excel' | 'powerpoint'>('excel');
  const [officeInput, setOfficeInput] = useState<string>('');
  const [officeChat, setOfficeChat] = useState<{ role: 'user' | 'claude'; text: string }[]>([]);

  // Global Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Quick Action Options for Cowork
  const quickActions = [
    { title: 'Create a file', icon: '📄', prompt: 'Create a project roadmap document for Maxy Academy Q3 course rollout.' },
    { title: 'Crunch data', icon: '📊', prompt: 'Summarize my meetings from this week and find action items. Where do you think I can be more efficient?' },
    { title: 'Make a prototype', icon: '🎨', prompt: 'Build an interactive React prototype for student course registration.' },
    { title: 'Prep for the day', icon: '☀️', prompt: 'Review my unread messages and calendar events to draft my daily priority list.' },
    { title: 'Organize files', icon: '📁', prompt: 'Scan my downloads folder and organize student assignment submissions by course.' },
    { title: 'Send a message', icon: '💬', prompt: 'Draft a progress update message to the Maxy Academy lead instructor team.' },
  ];

  // Handle Cowork "Let's go"
  const handleRunCowork = () => {
    setCoworkRunning(true);
    setCoworkProgressStep(1);

    setTimeout(() => {
      setCoworkProgressStep(2);
    }, 1000);

    setTimeout(() => {
      setCoworkProgressStep(3);
    }, 2000);

    setTimeout(() => {
      setCoworkProgressStep(4);
      setCoworkRunning(false);
      showToast('Tugas Cowork Selesai! Ringkasan dan Action Items Berhasil Disusun.');
    }, 3200);
  };

  // Handle Office Chat Submit
  const handleOfficeSubmit = (text?: string) => {
    const query = text || officeInput;
    if (!query.trim()) return;

    setOfficeChat(prev => [...prev, { role: 'user', text: query }]);
    setOfficeInput('');

    setTimeout(() => {
      let resp = '';
      if (officeApp === 'excel') {
        resp = `[Claude for Excel]\n\nFormula direkomendasikan:\n\`=AVERAGEIF(C2:C100, "Fullstack Web", D2:D100)\`\n\nAnalisis Singkat:\nData nilai siswa Maxy Academy menunjukkan tingkat kelulusan 92%. Ditemukan 3 entri duplikat yang telah ditandai untuk dibersihkan.`;
      } else {
        resp = `[Claude for PowerPoint]\n\nStruktur Slide Dihasilkan (5 Slide):\n1. Title: Peluncuran Kurikulum AI Maxy Academy Q3\n2. Problem Statement: Tantangan adopsi AI di industri\n3. Solution Overview: Modul Interaktif & Hands-on Labs\n4. Key Metrics: Target 1000+ peserta lulus\n5. Next Steps & Timeline.`;
      }
      setOfficeChat(prev => [...prev, { role: 'claude', text: resp }]);
    }, 800);
  };

  return (
    <div className="w-full min-h-[750px] bg-[#141416] text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-800 flex flex-col relative shadow-2xl">
      {/* Top Stage Control Header */}
      <div className="bg-[#1c1c20] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs shrink-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-amber-600 flex items-center justify-center font-bold text-white text-xs shadow">
            C
          </div>
          <span className="font-extrabold text-slate-200">Claude Features Studio</span>
          <span className="text-slate-500 hidden sm:inline">| Artifacts, Cowork & Productivity Extensions</span>
        </div>

        <div className="flex items-center space-x-1 bg-[#121214] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveStage('sidebar')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'sidebar' ? 'bg-amber-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 1: Navigasi
          </button>
          <button
            onClick={() => setActiveStage('artifacts')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'artifacts' ? 'bg-amber-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 2: Artifacts
          </button>
          <button
            onClick={() => setActiveStage('cowork')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'cowork' ? 'bg-amber-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 3: Cowork
          </button>
          <button
            onClick={() => setActiveStage('office')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${activeStage === 'office' ? 'bg-amber-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TAHAP 4: Excel & PPT
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-amber-400 flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* STAGE 1: SIDEBAR UTAMA & NAVIGASI CLAUDE */}
      {activeStage === 'sidebar' && (
        <div className="flex-1 flex flex-col md:flex-row bg-[#1b1b1e] overflow-hidden">
          {/* Left Claude Sidebar */}
          <aside className="w-full md:w-64 bg-[#141416] border-r border-slate-800 p-3.5 flex flex-col justify-between shrink-0 text-xs">
            <div className="space-y-4">
              {/* Header Logo */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-xl font-bold tracking-tight text-white">Claude</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-400">
                  <button onClick={() => showToast('Cari riwayat percakapan')} className="p-1 hover:text-white">
                    <Search className="w-4 h-4" />
                  </button>
                  <button onClick={() => showToast('Toggle Sidebar')} className="p-1 hover:text-white">
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Baru Button */}
              <button
                onClick={() => {
                  setSelectedNav('Obrolan');
                  showToast('Obrolan Baru Dimulai');
                }}
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
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedNav(item.id);
                      if (item.id === 'Artefak') setActiveStage('artifacts');
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

              {/* Produk Section */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Produk</div>
                <div
                  onClick={() => showToast('Desain: Ekstensi UI & Visual Studio Claude')}
                  className="p-2 rounded-xl text-slate-300 hover:bg-slate-800/50 cursor-pointer flex items-center space-x-2.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Desain</span>
                </div>
              </div>

              {/* Terbaru (Chat History) Section */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                  <span>Terbaru</span>
                  <button onClick={() => showToast('Urutkan riwayat')} className="p-0.5 hover:text-slate-300">
                    <Sliders className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-0.5 text-slate-400">
                  {[
                    'Pembersihan Data Kurikulum Maxy',
                    'Analisis Tech Stack React',
                    'Draf Kontrak Kerja Instruktur Maxy',
                    'Modul AI Course Review',
                    'Pengembangan Website Maxy Academy'
                  ].map((hist, hidx) => (
                    <div
                      key={hidx}
                      onClick={() => showToast(`Membuka chat: "${hist}"`)}
                      className="p-2 rounded-lg hover:bg-slate-800/50 hover:text-slate-200 cursor-pointer truncate text-[11px]"
                    >
                      {hist}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom User Profile Panel */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-7 h-7 rounded-full bg-amber-700 font-bold text-white flex items-center justify-center text-xs">
                  M
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

          {/* Main Area: Navigation Map Overview */}
          <main className="flex-1 p-6 sm:p-10 flex flex-col justify-center max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full inline-block">
                Navigasi Ekosistem Claude
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Peta Fitur & Ruang Kerja Claude
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Claude menyediakan navigasi terstruktur untuk mengelola berbagai jenis interaksi, mulai dari percakapan cepat hingga pengerjaan proyek dan artefak interaktif.
              </p>
            </div>

            {/* Menu Description Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Obrolan (Chat Utama)',
                  icon: <Bot className="w-5 h-5 text-amber-400" />,
                  desc: 'Antarmuka percakapan standar untuk mengajukan pertanyaan, brainstorming ide, atau merangkum teks dalam satu langkah.',
                  action: () => setSelectedNav('Obrolan')
                },
                {
                  title: 'Proyek (Projects)',
                  icon: <Folder className="w-5 h-5 text-blue-400" />,
                  desc: 'Mengelompokkan percakapan dan file referensi ke dalam satu konteks khusus (seperti folder kerja) agar Claude konsisten.',
                  action: () => showToast('Proyek: Mengunci dokumen referensi untuk tim Maxy Academy')
                },
                {
                  title: 'Artefak (Artifacts)',
                  icon: <Layers className="w-5 h-5 text-emerald-400" />,
                  desc: 'Menampilkan hasil berupa kode, halaman web, atau dokumen terpisah yang bisa langsung dipratinjau, diedit, dan digunakan ulang.',
                  action: () => setActiveStage('artifacts')
                },
                {
                  title: 'Kode (Code Workspace)',
                  icon: <Code className="w-5 h-5 text-purple-400" />,
                  desc: 'Ruang kerja khusus eksekusi dan refactoring kode secara mendalam (Tersedia pada paket Tingkatkan/Pro).',
                  action: () => showToast('Fitur Kode memerlukan paket Tingkatkan')
                },
                {
                  title: 'Sesuaikan (Customization)',
                  icon: <Settings className="w-5 h-5 text-slate-400" />,
                  desc: 'Atur instruksi kustom, gaya bahasa, dan preferensi respon sesuai standar gaya penulisan Maxy Academy.',
                  action: () => showToast('Atur kustomisasi profil Claude Anda')
                },
                {
                  title: 'Cowork & Add-ins (Tingkat Lanjut)',
                  icon: <Sparkles className="w-5 h-5 text-orange-400" />,
                  desc: 'Jelajahi fitur Cowork untuk agen otonom dan ekstensi produktivitas langsung di Microsoft Excel & PowerPoint.',
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
          </main>
        </div>
      )}

      {/* STAGE 2: ARTIFACTS (EMPTY STATE & PREVIEW) */}
      {activeStage === 'artifacts' && (
        <div className="flex-1 bg-[#18181b] flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#141416]">
            <h2 className="font-serif text-2xl font-bold text-white">Artefak</h2>
            <div className="flex items-center space-x-3">
              <button onClick={() => showToast('Cari Artefak')} className="p-2 text-slate-400 hover:text-white rounded-lg">
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowArtifactPreview(!showArtifactPreview);
                  showToast(showArtifactPreview ? 'Menutup Artefak' : 'Membuka Contoh Artefak Interaktif');
                }}
                className="bg-slate-100 hover:bg-white text-black font-extrabold text-xs px-4 py-2 rounded-xl shadow transition-colors"
              >
                {showArtifactPreview ? 'Tutup Pratinjau' : 'Artefak baru'}
              </button>
            </div>
          </header>

          {/* Main Body */}
          <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-8">
            {!showArtifactPreview ? (
              /* Empty State Illustration */
              <div className="text-center space-y-6 py-8">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-3xl bg-[#222228] border border-slate-700 flex items-center justify-center shadow-2xl relative">
                    {/* Shapes Illustration */}
                    <div className="flex items-center space-x-2 text-amber-400 font-mono text-xl">
                      <div className="w-5 h-5 border-2 border-amber-400 rounded"></div>
                      <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-amber-400"></div>
                      <div className="w-5 h-5 border-2 border-amber-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Apa yang akan Anda buat dengan artefak?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Jika Anda bisa membayangkannya, Anda bisa mewujudkannya. Wujudkan aplikasi, permainan, templat, dan perangkat dari ide menjadi kenyataan.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowArtifactPreview(true);
                    showToast('Membuka Contoh Artefak Interaktif');
                  }}
                  className="bg-[#28282e] hover:bg-[#32323a] text-white font-bold text-xs px-6 py-3 rounded-xl border border-slate-700 shadow-lg transition-transform hover:scale-105"
                >
                  Artefak baru
                </button>
              </div>
            ) : (
              /* Interactive Artifact Preview Window */
              <div className="bg-[#202025] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-mono text-slate-300 ml-2">maxy_dashboard_artifact.tsx</span>
                  </div>

                  <div className="flex items-center space-x-2 bg-[#141416] p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setArtifactTab('preview')}
                      className={`px-3 py-1 rounded-lg font-bold ${artifactTab === 'preview' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setArtifactTab('code')}
                      className={`px-3 py-1 rounded-lg font-bold ${artifactTab === 'code' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                    >
                      Code
                    </button>
                  </div>
                </div>

                {artifactTab === 'preview' ? (
                  <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="font-bold text-base text-amber-400">Maxy Student Portal</span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">Active Session</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#1b1b1e] p-3 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Progress Kelas</div>
                        <div className="text-lg font-bold text-white">85% Complete</div>
                      </div>
                      <div className="bg-[#1b1b1e] p-3 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Modul Selesai</div>
                        <div className="text-lg font-bold text-amber-400">22 / 23 Modul</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <pre className="bg-[#121214] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`export function MaxyPortal() {
  return (
    <div className="p-4 bg-slate-900 rounded-xl">
      <h2>Maxy Student Portal</h2>
      <p>Progress: 85% Complete</p>
    </div>
  );
}`}
                  </pre>
                )}
              </div>
            )}

            {/* Explanation Box */}
            <div className="bg-[#1e1e23] border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
              <strong className="text-white text-sm block">💡 Penjelasan Konsep: Artifacts pada Claude</strong>
              <p>
                <strong className="text-amber-400">Artifacts</strong> adalah fitur khusus tempat Claude membuat dokumen, komponen kode, diagram, atau antarmuka aplikasi di panel terpisah di sebelah chat.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li><strong>Perbedaan dengan Chat Biasa:</strong> Jawaban chat bersifat linier, sedangkan Artifacts bersifat persistent (dapat disimpan, diedit ulang, dan diunduh secara independen).</li>
                <li><strong>Output yang Bisa Dihasilkan:</strong> Kode program (React, HTML/CSS), SVG Diagram, Dokumen Markdown panjang, serta Prototipe UI interaktif.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: COWORK (RUANG KERJA AGENTIC) */}
      {activeStage === 'cowork' && (
        <div className="flex-1 bg-[#f7f5f0] text-slate-900 flex flex-col overflow-y-auto relative">
          {/* Main Grid Canvas Area */}
          <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300 px-3 py-1 rounded-full inline-block">
                Claude Agentic Workspace
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Cowork Space
              </h2>
            </div>

            {/* Quick Actions Grid (6 cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((qa, qidx) => (
                <div
                  key={qidx}
                  onClick={() => {
                    setSelectedQuickAction(qa.title);
                    setCoworkPrompt(qa.prompt);
                    showToast(`Aksi dipilih: ${qa.title}`);
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

            {/* Progress Checklist Card (When Running / Done) */}
            {coworkProgressStep > 0 && (
              <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl max-w-md mx-auto w-full space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Progress Tugas Cowork</span>
                  </h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {coworkProgressStep < 4 ? 'Sedang Berjalan...' : 'Selesai'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { num: 1, label: 'Read meeting recordings & transcripts' },
                    { num: 2, label: 'Pull out key points and action items' },
                    { num: 3, label: 'Analyze efficiency opportunities for Maxy Academy' },
                    { num: 4, label: 'Write final executive summary' }
                  ].map((step) => {
                    const isDone = coworkProgressStep > step.num || coworkProgressStep === 4;
                    const isCurrent = coworkProgressStep === step.num && coworkProgressStep < 4;

                    return (
                      <div key={step.num} className="flex items-center space-x-3">
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
                            {step.num}
                          </div>
                        )}
                        <span className={`font-semibold ${isDone ? 'text-slate-800 line-through' : isCurrent ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Explanatory Box */}
            <div className="bg-white/80 border border-slate-300 rounded-2xl p-5 text-xs text-slate-700 space-y-2">
              <strong className="text-slate-900 text-sm block">💡 Penjelasan Konsep: Cowork Agentic Workspace</strong>
              <p>
                <strong className="text-amber-800">Cowork</strong> merubah cara kerja AI dari sekadar penyedia jawaban menjadi <strong>agen otonom</strong> yang menyelesaikan serangkaian langkah secara bertahap.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li><strong>Work in a folder:</strong> Memberi akses bagi Claude untuk membaca seluruh dokumen lokal dalam folder pilihan secara langsung.</li>
                <li><strong>Card Progress:</strong> Menampilkan transparansi langkah yang sedang dieksekusi oleh agen secara bertahap.</li>
              </ul>
            </div>
          </div>

          {/* FILE PICKER MODAL (FINDER / EXPLORER STYLE) */}
          {showFilePicker && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[85vh]">
                {/* File Picker Header */}
                <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                    <Folder className="w-4 h-4 text-amber-600" />
                    <span>Select Folder for Cowork Context</span>
                  </div>
                  <button onClick={() => setShowFilePicker(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* File Picker Body (2 Columns) */}
                <div className="flex-1 flex overflow-hidden text-xs">
                  {/* Left Sidebar Favorites */}
                  <div className="w-44 bg-slate-50 border-r border-slate-200 p-3 space-y-3 font-semibold text-slate-600 shrink-0">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Favorites</div>
                      {['Recents', 'Desktop', 'Documents', 'Downloads'].map((fav, fidx) => (
                        <div key={fidx} className={`p-1.5 rounded-lg cursor-pointer ${fav === 'Documents' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'}`}>
                          {fav}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Locations</div>
                      {['Macintosh HD', 'iCloud Drive', 'Network'].map((loc, lidx) => (
                        <div key={lidx} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                          {loc}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Main Folder Grid */}
                  <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto">
                    {[
                      'Course Curriculum',
                      'Maxy Projects',
                      'Market Analysis',
                      'Contracts',
                      'Expenses',
                      'Transcripts'
                    ].map((fName, fidx) => (
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

                {/* File Picker Footer */}
                <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Selected: {selectedFolder}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowFilePicker(false)}
                      className="px-4 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setAttachedFolder(selectedFolder);
                        setShowFilePicker(false);
                        showToast(`Folder "${selectedFolder}" Terhubung ke Cowork!`);
                      }}
                      className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow"
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: EXCEL & POWERPOINT EXTENSIONS */}
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
                /* Excel Sheet Replica */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-sm text-emerald-800 flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Maxy_Student_Grades_Q3.xlsx</span>
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded">Excel Add-in Active</span>
                  </div>

                  <div className="border rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b font-mono text-slate-600">
                          <th className="p-2 border-r">A</th>
                          <th className="p-2 border-r">B (Nama Siswa)</th>
                          <th className="p-2 border-r">C (Kursus)</th>
                          <th className="p-2 border-r">D (Nilai)</th>
                          <th className="p-2">E (Status)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-mono">
                        <tr><td className="p-2 border-r bg-slate-50">1</td><td className="p-2 border-r">Budi Santoso</td><td className="p-2 border-r">Fullstack Web</td><td className="p-2 border-r">88</td><td className="p-2 text-emerald-600 font-bold">Lulus</td></tr>
                        <tr><td className="p-2 border-r bg-slate-50">2</td><td className="p-2 border-r">Siti Rahma</td><td className="p-2 border-r">AI Engineering</td><td className="p-2 border-r">94</td><td className="p-2 text-emerald-600 font-bold">Lulus</td></tr>
                        <tr><td className="p-2 border-r bg-slate-50">3</td><td className="p-2 border-r">Ahmad Fauzi</td><td className="p-2 border-r">Fullstack Web</td><td className="p-2 border-r">72</td><td className="p-2 text-amber-600 font-bold">Remedial</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* PowerPoint Slide Canvas Replica */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-sm text-orange-800 flex items-center space-x-2">
                      <Presentation className="w-4 h-4" />
                      <span>Maxy_AI_Course_Presentation.pptx</span>
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-800 font-mono px-2 py-0.5 rounded">PPT Add-in Active</span>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-8 min-h-[200px] flex flex-col justify-center space-y-3 shadow-lg">
                    <span className="text-orange-400 font-mono text-xs uppercase tracking-widest">Slide 1 of 5</span>
                    <h3 className="text-2xl font-bold font-serif">Peluncuran Modul AI Agent Maxy Academy</h3>
                    <p className="text-xs text-slate-300">Menghadirkan pemahaman praktis Claude, Gemini Gems, dan Mistral Vibe untuk efisiensi alur kerja.</p>
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
                      className="w-full text-left p-2 rounded-xl bg-[#222228] hover:bg-[#2a2a32] text-slate-300 transition-all border border-slate-800 text-[11px]"
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
                  className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-xl font-bold"
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
