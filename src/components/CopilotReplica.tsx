import React, { useState, useEffect } from 'react';
import {
  Sparkles, Plus, Search, Image as ImageIcon, Compass, Folder,
  Bookmark, CheckSquare, LayoutGrid, Paperclip, Volume2, Mic, X,
  ChevronDown, ChevronRight, Info, Copy, Check, RotateCcw, ThumbsUp,
  ThumbsDown, Share2, ExternalLink, Lock, Settings, User, Download,
  Smartphone, Laptop, Bell, Brain, Headphones, FileText, Globe, Sliders,
  HelpCircle, LogOut, PanelLeft, Bot, Wand2, BookOpen, Send,
  MoreVertical, ShieldAlert, Zap, Layers, RefreshCw
} from 'lucide-react';

interface ModalContent {
  title: string;
  category: string;
  badge: string;
  description: string;
  keyFeatures: string[];
  howToUse: string;
}

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  modelUsed?: string;
  timestamp: string;
}

export const CopilotReplica: React.FC = () => {
  // Simulator View Mode State: Desktop vs Mobile
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'mobile';
    }
    return 'desktop';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('mobile');
    }
  }, []);

  // Sidebar Open State (for Mobile / Collapsible Desktop)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Profile / Settings Modal States
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Dropdown menus states
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Selected Model & Search Mode State
  const [selectedModel, setSelectedModel] = useState<{
    id: string;
    name: string;
    desc: string;
    icon: string;
  }>({
    id: 'smart',
    name: 'Smart',
    desc: 'Thinks deeply or quickly based on the task',
    icon: 'Sparkles',
  });

  // Temporary Chat Toggle State
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);

  // Explanatory Modal State
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);

  // Chat conversation state
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // User Profile
  const userProfile = {
    name: 'Maxy Academy',
    email: 'maxyacademy.one@gmail.com',
    plan: 'Free Plan',
    avatarText: 'MA',
  };

  // Detailed Modal Content Dictionary in Bahasa Indonesia
  const modalData: Record<string, ModalContent> = {
    'temporary-chat': {
      title: 'Temporary Chat (Mode Percakapan Sementara)',
      category: 'Privasi & Keamanan Data',
      badge: 'Incognito Mode',
      description: 'Fitur Temporary Chat memungkinkan Anda melakukan percakapan tanpa menyimpan riwayat obrolan ke perpustakaan (Library) atau melatih model Copilot.',
      keyFeatures: [
        'Riwayat percakapan otomatis terhapus saat sesi ditutup',
        'Data tidak digunakan untuk pelatihan model kecerdasan buatan',
        'Perlindungan privasi ekstra untuk data sensitif perusahaan atau pribadi'
      ],
      howToUse: 'Klik tombol [💬 Temporary] di sudut kanan atas header untuk mengaktifkan atau mematikan mode sementara.'
    },
    'new-chat': {
      title: 'New Chat (Mulai Sesi Percakapan Baru)',
      category: 'Manajemen Percakapan',
      badge: 'Reset Context',
      description: 'Membuka lembar kerja percakapan baru yang bersih dari konteks obrolan sebelumnya.',
      keyFeatures: [
        'Menghapus memori konteks sesi saat ini',
        'Siap menerima topik diskusi baru tanpa bias sebelumnya',
        'Mengoptimalkan kecepatan respon Copilot'
      ],
      howToUse: 'Klik tombol "New chat" di bilah navigasi kiri atau ikon pensil di seluler.'
    },
    'library': {
      title: 'Library (Perpustakaan & Riwayat)',
      category: 'Manajemen Konten',
      badge: 'History & Saved',
      description: 'Pusat penyimpanan riwayat percakapan, dokumen yang pernah dianalisis, dan hasil pembuatan gambar/konten sebelumnya.',
      keyFeatures: [
        'Pencarian riwayat percakapan lama dengan kata kunci',
        'Pengelompokan otomatis berdasarkan tanggal dan topik',
        'Akses cepat ke materi belajar dan prompt favorit'
      ],
      howToUse: 'Pilih menu "Library" di sidebar kiri untuk menjelajahi riwayat obrolan Anda.'
    },
    'tasks-preview': {
      title: 'Tasks (Microsoft Copilot Tasks PREVIEW)',
      category: 'Produktivitas & Otomasi',
      badge: 'Preview Feature',
      description: 'Fitur baru Copilot untuk mengelola daftar tugas harian, integrasi dengan Microsoft To Do, dan otomatisasi pengingat.',
      keyFeatures: [
        'Ekstraksi otomatis action items dari ringkasan percakapan',
        'Sinkronisasi langsung ke Microsoft 365 Tasks & Outlook',
        'Pengingat jadwal cerdas berbasis AI'
      ],
      howToUse: 'Klik "Tasks PREVIEW" untuk melihat daftar tugas otomatis yang disarankan AI.'
    },
    'projects': {
      title: 'Projects (Folder Proyek Terintegrasi)',
      category: 'Kolaborasi & Struktur',
      badge: 'Workspace',
      description: 'Wadah pengelompokan instruksi, berkas referensi, dan output AI ke dalam satu folder proyek terstruktur.',
      keyFeatures: [
        'Pengelompokan dokumen dan obrolan per klien atau mata kuliah',
        'Berbagi proyek dengan anggota tim lainnya',
        'Konteks kustom khusus untuk setiap proyek'
      ],
      howToUse: 'Klik ikon (+) di sebelah menu "Projects" untuk membuat ruang proyek baru.'
    },
    'discover': {
      title: 'Discover (Eksplorasi Tren & Referensi)',
      category: 'Riset & Berita',
      badge: 'Bing Search',
      description: 'Kumpulan artikel berita terkini, tren topik AI popular, dan inspirasi instruksi terpilih dari Microsoft Copilot.',
      keyFeatures: [
        'Update berita real-time dengan rujukan sumber terpercaya',
        'Rekomendasi prompt populer untuk berbagai keperluan',
        'Kategori topik dari bisnis, teknologi, hingga edukasi'
      ],
      howToUse: 'Pilih "Discover" di sidebar untuk melihat topik hangat dan inspirasi prompt.'
    },
    'imagine': {
      title: 'Imagine (Generator Gambar Designer / DALL-E 3)',
      category: 'Generasi Visual',
      badge: 'Copilot Designer',
      description: 'Ruang khusus untuk membuat ilustrasi, logo, foto realistis, dan desain grafis menggunakan teknologi OpenAI DALL-E 3.',
      keyFeatures: [
        'Pembuatan gambar resolusi tinggi dari prompt teks',
        'Variasi rasio aspek (1:1, 16:9, portrait)',
        'Gaya artistik beragam: Photorealistic, Cyberpunk, Watercolor, 3D Render'
      ],
      howToUse: 'Klik "Imagine" untuk masuk ke studio generasi visual Copilot.'
    },
    'experiments': {
      title: 'Experiments (Fitur Eksperimental & Lab)',
      category: 'Inovasi AI',
      badge: 'Copilot Labs',
      description: 'Akses awal ke kemampuan kecerdasan buatan masa depan yang sedang diuji oleh Microsoft AI.',
      keyFeatures: [
        'Uji coba model logika dan penalaran kode terbaru',
        'Integrasi visual audio multimodal eksperimental',
        'Umpan balik langsung kepada tim pengembang Microsoft'
      ],
      howToUse: 'Klik "Experiments" untuk mengaktifkan modul uji coba eksperimental.'
    },
    'model-smart': {
      title: 'Model: Smart Mode (Default Dynamic AI)',
      category: 'Pemilihan Model',
      badge: 'Dynamic Speed & Depth',
      description: 'Mode standar Copilot yang secara otomatis menyesuaikan kecepatan atau kedalaman berpikir berdasarkan kompleksitas pertanyaan.',
      keyFeatures: [
        'Respon cepat untuk pertanyaan sederhana',
        'Analisis mendalam otomatis jika mendeteksi prompt kompleks',
        'Efisien untuk penggunaan sehari-hari'
      ],
      howToUse: 'Buka menu dropdown model di dalam kotak pesan, lalu pilih "Smart".'
    },
    'model-think-deeper': {
      title: 'Model: Think Deeper (Deep Reasoning)',
      category: 'Pemilihan Model',
      badge: 'Complex Reasoning',
      description: 'Mode penalaran tingkat tinggi yang memikirkan langkah-langkah pemecahan masalah secara bertahap sebelum memberikan jawaban akhir.',
      keyFeatures: [
        'Penalaran sains, matematika, dan pemrograman tingkat lanjut',
        'Pemeriksaan logika berlapis untuk meminimalkan halusinasi',
        'Sangat cocok untuk pemecahan masalah sulit'
      ],
      howToUse: 'Pilih "Think deeper" di menu model untuk tugas yang membutuhkan logika tinggi.'
    },
    'model-study-learn': {
      title: 'Model: Study and Learn (Mode Edukasi)',
      category: 'Pemilihan Model',
      badge: 'Guided Learning',
      description: 'Mode khusus pembimbing akademis yang membantu membuat kuis, penjelasan konsep bertahap, dan kuis interaktif.',
      keyFeatures: [
        'Format penjelasan seperti tutor pribadi',
        'Penyusunan ringkasan materi dan flashcard',
        'Uji pemahaman dengan pertanyaan latihan bertahap'
      ],
      howToUse: 'Pilih "Study and learn" untuk pendampingan belajar yang terstruktur.'
    },
    'model-search': {
      title: 'Model: Search (Akses Web Real-Time Bing)',
      category: 'Pemilihan Model',
      badge: 'Web Grounding',
      description: 'Memfokuskan Copilot untuk melakukan pencarian web mendalam dengan kutipan sumber artikel resmi.',
      keyFeatures: [
        'Pencarian informasi terkini dari hasil indeks Bing Search',
        'Daftar sitasi dan tautan referensi langsung ke artikel asli',
        'Validasi klaim berbasis fakta aktual'
      ],
      howToUse: 'Pilih "Search" ketika memerlukan rujukan berita atau data pasar terkini.'
    },
    'plus-add-files': {
      title: 'Add Images or Files (Unggah Berkas)',
      category: 'Input Multimodal',
      badge: 'Document & Vision',
      description: 'Fitur untuk mengunggah berkas PDF, Word, Excel, CSV, atau gambar untuk dianalisis oleh Copilot.',
      keyFeatures: [
        'Membaca teks dari gambar (OCR)',
        'Ringkasan dokumen panjang dan ekstraksi tabel',
        'Analisis grafik dan visual data'
      ],
      howToUse: 'Klik tombol (+), lalu pilih "Add images or files" untuk memilih berkas dari perangkat.'
    },
    'plus-deep-research': {
      title: 'Start Deep Research (Riset Mendalam)',
      category: 'Riset Otomatis',
      badge: '5 Remaining / Day',
      description: 'Copilot akan menjelajahi puluhan situs web secara mandiri, mengumpulkan data, dan menyusun laporan riset komprehensif.',
      keyFeatures: [
        'Otomatisasi pencarian berantai di internet',
        'Sintesis informasi dari berbagai sumber menjadi laporan rapi',
        'Hemat jam kerja riset manual'
      ],
      howToUse: 'Pilih "Start deep research" di menu (+) untuk topik riset berskala besar.'
    },
    'plus-create-podcast': {
      title: 'Create a Podcast (Sintesis Suara Audio)',
      category: 'Generasi Audio',
      badge: '3 Remaining / Day',
      description: 'Mengubah ringkasan topik atau dokumen teks menjadi percakapan audio podcast dwibahasa yang natural.',
      keyFeatures: [
        'Dua narator AI berdiskusi interaktif',
        'Format penjelasan yang mudah didengar saat beraktivitas',
        'Pengunduhan berkas audio MP3'
      ],
      howToUse: 'Pilih "Create a podcast" di menu (+) untuk menghasilkan format audio dari percakapan.'
    },
    'plus-take-quiz': {
      title: 'Take a Quiz (Kuis Interaktif)',
      category: 'Evaluasi Pemahaman',
      badge: 'Interactive Learning',
      description: 'Membuat kuis pilihan ganda atau esai interaktif untuk menguji pemahaman Anda mengenai topik pilihan.',
      keyFeatures: [
        'Pertanyaan kuis yang disesuaikan tingkat kesulitan',
        'Evaluasi jawaban otomatis beserta pembahasan lengkap',
        'Laporan skor pemahaman materi'
      ],
      howToUse: 'Pilih "Take a quiz" di menu (+) untuk memulai sesi evaluasi mandiri.'
    },
    'plus-use-connectors': {
      title: 'Use Connectors (Integrasi Ekosistem)',
      category: 'Ekosistem Microsoft',
      badge: 'M365 Integration',
      description: 'Menghubungkan Copilot dengan Microsoft Outlook, OneDrive, Google Drive, atau layanan cloud lainnya.',
      keyFeatures: [
        'Akses data langsung dari email Outlook atau file OneDrive',
        'Perizinan akses aman dengan kredensial pengguna',
        'Pencarian lintas platform dalam satu tempat'
      ],
      howToUse: 'Pilih "Use connectors" untuk mengatur koneksi data dengan aplikasi kerja Anda.'
    },
    'copilot-voice': {
      title: 'Copilot Voice / Audio Mode',
      category: 'Interaksi Suara',
      badge: 'Real-time Voice',
      description: 'Fitur interaksi percakapan suara langsung dengan respon instan dan intonasi alamiah.',
      keyFeatures: [
        'Percakapan dua arah hands-free tanpa mengetik',
        'Deteksi bahasa otomatis dan suara jernih',
        'Pengalaman berbicara seperti dengan asisten manusia'
      ],
      howToUse: 'Klik ikon gelombang suara (||||) di sudut kanan kotak pesan untuk mengaktifkan percakapan suara.'
    },
    'account-settings': {
      title: 'Account & Copilot Settings',
      category: 'Pengaturan Pengguna',
      badge: 'User Preferences',
      description: 'Pusat pengaturan akun Maxy Academy, opsi bahasa suara (Wave/Auto-detect), tema Night/Light, memori, dan pengingat.',
      keyFeatures: [
        'Manajemen profil pengguna & alamat email',
        'Pengaturan bahasa interaksi dan nada suara AI',
        'Manajemen memori personalisasi dan pengingat (Reminders)'
      ],
      howToUse: 'Klik profil "Maxy Academy" di sudut kiri bawah untuk membuka menu pengaturan akun.'
    }
  };

  // Open modal handler
  const handleOpenModal = (key: string) => {
    setActiveModalKey(key);
  };

  // Send Prompt Handler
  const handleSendPrompt = (overrideText?: string) => {
    const textToSend = overrideText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInputPrompt('');
    setIsTyping(true);

    // Simulate Copilot Response
    setTimeout(() => {
      let botResponse = `Halo **Maxy Academy**! Saya adalah **Microsoft Copilot** (Mode: ${selectedModel.name}).\n\n`;
      
      if (textToSend.toLowerCase().includes('brainstorm') || textToSend.toLowerCase().includes('ide')) {
        botResponse += `Berikut adalah 3 ide inovatif yang disesuaikan dengan kebutuhan Anda:\n\n1. **Otomatisasi Dokumen**: Menggunakan Copilot di Word untuk membuat draf proposal kerja instan.\n2. **Analisis Data Cepat**: Pemanfaatan formula cerdas di Excel untuk mengolah tabel penjualan.\n3. **Materi Presentasi**: Mengubah draf tulisan menjadi slide PowerPoint yang menarik secara visual.`;
      } else if (textToSend.toLowerCase().includes('quiz') || textToSend.toLowerCase().includes('kuis')) {
        botResponse += `**Kuis Singkat Microsoft Copilot & AI (3 Soal)**:\n\n**Soal 1**: Apa keunggulan utama dari mode *Think Deeper* pada Copilot?\n- A) Menjawab lebih cepat tanpa analisis\n- B) Penalaran berlapis untuk memecahkan masalah kompleks\n- C) Menghapus riwayat obrolan secara otomatis\n\n*Jawab pertanyaan ini atau beri tahu topik yang ingin Anda latih!*`;
      } else {
        botResponse += `Terima kasih atas instruksi yang Anda berikan: *"${textToSend}"*.\n\nSebagai asisten AI cerdas terintegrasi dari Microsoft, saya dapat membantu Anda menganalisis data, menulis draf email profesional, mencari referensi web berlisensi resmi, hingga membuat ilustrasi grafis melalui Copilot Designer. Ada hal spesifik lain yang ingin Anda eksplorasi bersama?`;
      }

      const copilotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'copilot',
        text: botResponse,
        modelUsed: selectedModel.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, copilotMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCopyMessage = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputPrompt('');
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="relative rounded-2xl border border-[#1e2638] bg-[#0b0f19] text-slate-800 dark:text-slate-100 overflow-hidden shadow-2xl font-sans">
      {/* Top Header Bar for Simulator Controls & Device Switcher */}
      <div className="bg-[#0e1320] border-b border-[#1d2538] px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-cyan-400" />
            Microsoft Copilot Replica
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#192236] text-cyan-300 border border-[#23314f] text-[10px]">
            Simulasi Edukasi Live
          </span>
        </div>

        {/* View Mode Toggle (Desktop vs Mobile Simulator Mode) */}
        <div className="flex items-center gap-1 bg-[#080b12] p-1 rounded-xl border border-[#1e283d]">
          <button
            onClick={() => {
              setViewMode('desktop');
              setIsMobileDrawerOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'desktop'
                ? 'bg-cyan-600 text-slate-900 dark:text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop View</span>
          </button>
          <button
            onClick={() => {
              setViewMode('mobile');
              setIsMobileDrawerOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'mobile'
                ? 'bg-cyan-600 text-slate-900 dark:text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile View</span>
          </button>
        </div>
      </div>

      {/* Main Simulator Workspace Layout */}
      <div className={`relative flex overflow-hidden ${viewMode === 'mobile' ? 'max-w-[420px] mx-auto border border-[#1e2638] my-2 rounded-2xl shadow-2xl min-h-[640px]' : 'min-h-[620px]'}`}>
        
        {/* ========================================================= */}
        {/* DESKTOP SIDEBAR (Visible in Desktop Mode) */}
        {/* ========================================================= */}
        {viewMode === 'desktop' && isSidebarOpen && (
          <div className="w-64 bg-[#080b12] border-r border-[#192033] flex flex-col justify-between shrink-0 p-3 select-none">
            <div className="space-y-4">
              {/* Header Title with Sidebar Toggle */}
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Copilot
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 hover:bg-[#151c2e] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                  title="Toggle Sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Main Navigation List */}
              <div className="space-y-1 text-xs font-medium">
                <button
                  onClick={() => {
                    handleNewChat();
                    handleOpenModal('new-chat');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#131a2b] transition-colors text-left"
                >
                  <Plus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span>New chat</span>
                </button>

                <button
                  onClick={() => handleOpenModal('library')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <Bookmark className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Library</span>
                </button>

                <button
                  onClick={() => handleOpenModal('tasks-preview')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Tasks</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#1d273e] text-cyan-300 rounded border border-[#2b3a5c]">
                    PREVIEW
                  </span>
                </button>

                <button
                  onClick={() => handleOpenModal('projects')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Projects</span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white" />
                </button>
              </div>

              <div className="border-b border-[#161e30] my-2" />

              {/* Discovery & Tools List */}
              <div className="space-y-1 text-xs font-medium">
                <button
                  onClick={() => handleOpenModal('discover')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <Compass className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Discover</span>
                </button>

                <button
                  onClick={() => handleOpenModal('imagine')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Imagine</span>
                </button>

                <button
                  onClick={() => handleOpenModal('experiments')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <LayoutGrid className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Experiments</span>
                </button>
              </div>

              <div className="border-b border-[#161e30] my-2" />

              {/* Fictional Recents Item (Matching Screenshot 1) */}
              <div className="space-y-1 text-xs">
                <div className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b] flex items-center justify-between group cursor-pointer transition-colors">
                  <span className="truncate text-slate-600 dark:text-slate-300 text-[11px] font-normal">
                    Negative Keywords Report for Pro...
                  </span>
                  <MoreVertical className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </div>
            </div>

            {/* Bottom Profile Footer (Matching Screenshot 1 & 4) */}
            <div className="relative pt-2 border-t border-[#161e30]">
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-[#131a2b] transition-colors">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2.5 min-w-0 text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs shrink-0">
                    A
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{userProfile.plan}</p>
                  </div>
                </button>

                <button
                  onClick={() => handleOpenModal('account-settings')}
                  className="px-2.5 py-1 bg-transparent border border-slate-300 dark:border-slate-700 hover:border-slate-500 text-slate-700 dark:text-slate-200 text-[10px] font-semibold rounded-lg transition-colors shrink-0"
                >
                  Upgrade
                </button>
              </div>

              {/* Account Dropdown Popup Menu (Matching Screenshot 4) */}
              {isAccountMenuOpen && (
                <div className="absolute bottom-14 left-0 w-64 bg-[#0f1422] border border-[#232d45] rounded-2xl p-3 shadow-2xl z-50 text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="space-y-0.5 px-1 py-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-xs">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</p>
                  </div>

                  <div className="border-b border-[#1a2336]" />

                  <div className="space-y-0.5 font-medium">
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setIsSettingsModalOpen(true);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#1a2336] transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        handleOpenModal('account-settings');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#1a2336] transition-colors"
                    >
                      Memory
                    </button>
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        handleOpenModal('account-settings');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#1a2336] transition-colors"
                    >
                      Reminders
                    </button>
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        alert('Terima kasih atas masukan Anda!');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#1a2336] transition-colors"
                    >
                      Give feedback
                    </button>
                  </div>

                  <div className="border-b border-[#1a2336]" />

                  <div className="space-y-0.5">
                    <button
                      onClick={() => alert('Munduh aplikasi seluler Microsoft Copilot.')}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#1a2336] transition-colors"
                    >
                      Download mobile app
                    </button>
                    <button
                      onClick={() => alert('Mengunduh aplikasi Mac Microsoft Copilot.')}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#1a2336] transition-colors"
                    >
                      Download Mac app
                    </button>
                  </div>

                  {/* Banner Card */}
                  <div className="p-2.5 bg-[#172036] rounded-xl border border-[#2b3859] space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">Get the best of Copilot</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                      Higher limits, cloud storage, and Microsoft apps with Copilot built in
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      alert('Sesi keluar berhasil diformat.');
                    }}
                    className="w-full py-2 bg-[#1b2338] hover:bg-[#232d47] text-slate-700 dark:text-slate-200 font-semibold text-center rounded-xl transition-colors"
                  >
                    Sign out
                  </button>

                  <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    <button className="hover:underline">Privacy</button>
                    <span>•</span>
                    <button className="hover:underline">Terms</button>
                    <span>•</span>
                    <button className="hover:underline">FAQ</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsed Sidebar Restore Button (When sidebar closed) */}
        {viewMode === 'desktop' && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-3 left-3 z-20 p-2 bg-[#0d1322] border border-[#1e273e] hover:bg-[#161f36] text-slate-600 dark:text-slate-300 rounded-xl shadow-lg transition-colors"
            title="Open Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        {/* ========================================================= */}
        {/* MAIN VIEW AREA (Desktop & Mobile) */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col justify-between bg-[#0b0f19] relative min-w-0 p-4 sm:p-6 overflow-hidden">
          
          {/* Top Bar Right: Temporary Chat Button & Mobile Menu Trigger */}
          <div className="flex items-center justify-between w-full pb-2">
            <div className="flex items-center gap-2">
              {/* Mobile Drawer Trigger (Only in Mobile Mode or small screen) */}
              {(viewMode === 'mobile' || viewMode === 'desktop') && (
                <button
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className={`${viewMode === 'mobile' ? 'block' : 'lg:hidden block'} p-2 hover:bg-[#131b2e] rounded-xl text-slate-600 dark:text-slate-300 transition-colors`}
                  title="Open Navigation"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Temporary Chat Toggle Button (Matching Screenshots) */}
            <button
              onClick={() => {
                setIsTemporaryChat(!isTemporaryChat);
                handleOpenModal('temporary-chat');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isTemporaryChat
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200'
                  : 'bg-[#111726] border-[#1f2a42] text-slate-600 dark:text-slate-300 hover:bg-[#182136]'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full border border-dashed border-cyan-400 flex items-center justify-center text-[8px]">
                💬
              </div>
              <span>Temporary</span>
            </button>
          </div>

          {/* Center Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-6 space-y-6">
            
            {/* If no active messages, display Welcome Greeting & Inputs (Matching Screenshots) */}
            {messages.length === 0 ? (
              <div className="w-full space-y-6 text-center animate-in fade-in duration-300">
                {/* Greeting Header */}
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Nice to see you, Maxy Academy. What's new?
                </h1>

                {/* Input Container Box (Matching Screenshot 1 & 5) */}
                <div className="relative w-full bg-[#121826] border border-[#212c45] rounded-2xl p-4 shadow-xl text-left space-y-3">
                  {/* Top Row Text Area & Robot Avatar */}
                  <div className="flex items-start justify-between gap-2">
                    <textarea
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendPrompt();
                        }
                      }}
                      placeholder="Message Copilot"
                      rows={2}
                      className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none"
                    />

                    {/* Copilot Robot Head Avatar (Green Circle Icon - Screenshot 1) */}
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Bottom Controls Row inside Input Box */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 relative">
                      {/* Plus Button (+) */}
                      <button
                        onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                        className="p-1.5 hover:bg-[#1e2a45] rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors border border-[#233152]"
                        title="Add media or research tools"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {/* Model Selector Dropdown Button */}
                      <button
                        onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-[#192238] hover:bg-[#212e4c] rounded-xl text-slate-700 dark:text-slate-200 text-xs font-medium border border-[#273659] transition-colors"
                      >
                        <span>{selectedModel.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </button>

                      {/* Send Button if text entered */}
                      {inputPrompt.trim() && (
                        <button
                          onClick={() => handleSendPrompt()}
                          className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-900 dark:text-white rounded-xl transition-all shadow"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Dropdown Menu 1: Plus (+) Menu (Matching Screenshot 2 & 6) */}
                      {isPlusMenuOpen && (
                        <div className="absolute bottom-11 left-0 w-60 bg-[#0f1524] border border-[#222d48] rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              handleOpenModal('plus-add-files');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#1a2338] rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left"
                          >
                            <Paperclip className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            <span>Add images or files</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              handleOpenModal('imagine');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#1a2338] rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left"
                          >
                            <ImageIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            <span>Generate image</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              handleOpenModal('plus-deep-research');
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#1a2338] rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                              <span>Start deep research</span>
                            </div>
                            <span className="px-1.5 py-0.5 text-[9px] bg-[#1a2642] text-cyan-300 rounded border border-[#2b3f6e]">
                              5 remaining
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              handleOpenModal('plus-create-podcast');
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#1a2338] rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <Headphones className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                              <span>Create a podcast</span>
                            </div>
                            <span className="px-1.5 py-0.5 text-[9px] bg-[#1a2642] text-cyan-300 rounded border border-[#2b3f6e]">
                              3 remaining
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              handleOpenModal('plus-take-quiz');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#1a2338] rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left"
                          >
                            <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            <span>Take a quiz</span>
                          </button>

                          <div className="border-b border-[#1b253b] my-1" />

                          <button
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              handleOpenModal('plus-use-connectors');
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#1a2338] rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                              <span>Use connectors</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          </button>
                        </div>
                      )}

                      {/* Dropdown Menu 2: Model Selector Menu (Matching Screenshot 3 & 7) */}
                      {isModelMenuOpen && (
                        <div className="absolute bottom-11 left-16 w-64 bg-[#0f1524] border border-[#222d48] rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                          <button
                            onClick={() => {
                              setSelectedModel({
                                id: 'smart',
                                name: 'Smart',
                                desc: 'Thinks deeply or quickly based on the task',
                                icon: 'Sparkles',
                              });
                              setIsModelMenuOpen(false);
                              handleOpenModal('model-smart');
                            }}
                            className="w-full text-left p-2.5 hover:bg-[#1a2338] rounded-xl transition-colors space-y-0.5"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                              <Sparkles className="w-4 h-4 text-cyan-400" />
                              <span>Smart</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6">
                              Thinks deeply or quickly based on the task
                            </p>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedModel({
                                id: 'think-deeper',
                                name: 'Think deeper',
                                desc: 'Better for more complex topics',
                                icon: 'Brain',
                              });
                              setIsModelMenuOpen(false);
                              handleOpenModal('model-think-deeper');
                            }}
                            className="w-full text-left p-2.5 hover:bg-[#1a2338] rounded-xl transition-colors space-y-0.5"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                              <Brain className="w-4 h-4 text-purple-400" />
                              <span>Think deeper</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6">
                              Better for more complex topics
                            </p>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedModel({
                                id: 'study-learn',
                                name: 'Study and learn',
                                desc: 'Quizzes, guided learning, and more',
                                icon: 'BookOpen',
                              });
                              setIsModelMenuOpen(false);
                              handleOpenModal('model-study-learn');
                            }}
                            className="w-full text-left p-2.5 hover:bg-[#1a2338] rounded-xl transition-colors space-y-0.5"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                              <BookOpen className="w-4 h-4 text-emerald-400" />
                              <span>Study and learn</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6">
                              Quizzes, guided learning, and more
                            </p>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedModel({
                                id: 'search',
                                name: 'Search',
                                desc: 'Answers with enhanced references',
                                icon: 'Search',
                              });
                              setIsModelMenuOpen(false);
                              handleOpenModal('model-search');
                            }}
                            className="w-full text-left p-2.5 hover:bg-[#1a2338] rounded-xl transition-colors space-y-0.5"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                              <Search className="w-4 h-4 text-amber-400" />
                              <span>Search</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6">
                              Answers with enhanced references
                            </p>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Copilot Voice Mode Trigger Icon (Waveform - Screenshot 1) */}
                    <button
                      onClick={() => handleOpenModal('copilot-voice')}
                      className="p-1.5 hover:bg-[#1e2a45] text-slate-600 dark:text-slate-300 hover:text-cyan-300 rounded-xl transition-colors"
                      title="Copilot Voice Mode"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Suggestion Chips Below Input Box (Matching Screenshot 1 & 5) */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-2">
                  {[
                    'Brainstorm ideas',
                    'Learn something new',
                    'Craft a story',
                    'Take a quiz',
                    'Study for a test',
                    'Write an analysis',
                    'Write a speech',
                    'Rewrite a classic',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(chip)}
                      className="px-3.5 py-2 bg-[#121826] hover:bg-[#1a2338] border border-[#212c45] text-slate-600 dark:text-slate-300 rounded-xl transition-all text-xs font-normal shadow-sm hover:text-slate-900 dark:text-white"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Chat Message Stream */
              <div className="w-full space-y-4 overflow-y-auto max-h-[480px] pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } space-y-1 animate-in fade-in duration-200`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 px-1">
                      <span>{msg.sender === 'user' ? userProfile.name : 'Microsoft Copilot'}</span>
                      {msg.modelUsed && <span className="text-cyan-400">({msg.modelUsed})</span>}
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-cyan-600 text-slate-900 dark:text-white rounded-br-none'
                          : 'bg-[#121826] border border-[#212c45] text-slate-700 dark:text-slate-200 rounded-bl-none space-y-2'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Bot Response Interactive Actions */}
                      {msg.sender === 'copilot' && (
                        <div className="flex items-center gap-2 pt-2 border-t border-[#1b253b] text-slate-500 dark:text-slate-400">
                          <button
                            onClick={() => handleCopyMessage(idx, msg.text)}
                            className="p-1 hover:text-slate-900 dark:text-white rounded transition-colors"
                            title="Copy message"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button className="p-1 hover:text-slate-900 dark:text-white rounded transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-slate-900 dark:text-white rounded transition-colors">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSendPrompt('Silakan persingkat poin di atas.')}
                            className="p-1 hover:text-slate-900 dark:text-white rounded transition-colors"
                            title="Regenerate"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-[#121826] border border-[#212c45] rounded-2xl w-fit text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                    <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>Copilot sedang berpikir...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Disclaimer */}
          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-[#161f33]">
            Copilot is an AI and may make mistakes. Your{' '}
            <button onClick={() => handleOpenModal('temporary-chat')} className="underline hover:text-slate-700 dark:text-slate-200">
              conversation activity
            </button>
            , which includes content you share, now helps train AI.{' '}
            <button onClick={() => handleOpenModal('temporary-chat')} className="underline hover:text-slate-700 dark:text-slate-200">
              Opt out
            </button>
            .
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE DRAWER OVERLAY (Matching Screenshot 8) */}
        {/* ========================================================= */}
        {isMobileDrawerOpen && (
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex animate-in fade-in duration-200 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-72 max-w-[80%] bg-[#080b12] border-r border-[#192033] h-full flex flex-col justify-between p-4 space-y-4 animate-in slide-in-from-left duration-200 cursor-default"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-slate-900 dark:text-white">Copilot</span>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      handleNewChat();
                      handleOpenModal('new-chat');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#131a2b]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New chat</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('library');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b]"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Library</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('tasks-preview');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b]"
                  >
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-4 h-4" />
                      <span>Tasks</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] bg-[#1d273e] text-cyan-300 rounded">
                      PREVIEW
                    </span>
                  </button>
                </div>

                <div className="border-b border-[#161e30]" />

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('discover');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b]"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Discover</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('imagine');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b]"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Imagine</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('experiments');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#131a2b]"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Experiments</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#161e30]">
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#131a2b]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-900 dark:text-white">
                      A
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{userProfile.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{userProfile.plan}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 border border-slate-300 dark:border-slate-700 text-[10px] rounded text-slate-600 dark:text-slate-300">
                    Upgrade
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SETTINGS MODAL (Matching Screenshot 9) */}
      {/* ========================================================= */}
      {isSettingsModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f1422] border border-[#232d45] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b253b]">
              <span className="font-bold text-slate-900 dark:text-white tracking-wider text-xs">SETTINGS</span>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#1b253b] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{userProfile.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{userProfile.email}</p>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-300">Voice language</span>
                <span className="font-mono text-[10px] text-cyan-300 bg-[#172238] px-2 py-0.5 rounded">
                  AUTO-DETECT
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-300">Voice</span>
                <span className="font-mono text-[10px] text-cyan-300 bg-[#172238] px-2 py-0.5 rounded">
                  WAVE
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-300">Language</span>
                <span className="font-mono text-[10px] text-cyan-300 bg-[#172238] px-2 py-0.5 rounded">
                  EN
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-300">Theme</span>
                <span className="font-mono text-[10px] text-cyan-300 bg-[#172238] px-2 py-0.5 rounded">
                  NIGHT
                </span>
              </div>

              <div className="border-b border-[#1b253b] my-2" />

              <button
                onClick={() => handleOpenModal('plus-use-connectors')}
                className="w-full text-left py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                Connectors
              </button>
              <button
                onClick={() => handleOpenModal('account-settings')}
                className="w-full text-left py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                Memory
              </button>
              <button
                onClick={() => handleOpenModal('account-settings')}
                className="w-full text-left py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                Reminders
              </button>
              <button
                onClick={() => alert('Terima kasih atas masukan Anda!')}
                className="w-full text-left py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                Give feedback
              </button>
              <button
                onClick={() => handleOpenModal('account-settings')}
                className="w-full text-left py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                About
              </button>
            </div>

            <div className="p-3 bg-[#172036] rounded-2xl border border-[#2b3859] space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Get the best of Copilot</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-normal">
                Higher limits, cloud storage, and Microsoft apps with Copilot built in
              </p>
            </div>

            <button
              onClick={() => {
                setIsSettingsModalOpen(false);
                alert('Sesi keluar berhasil.');
              }}
              className="w-full py-2.5 bg-[#1b2338] hover:bg-[#232d47] text-slate-900 dark:text-white font-semibold text-center rounded-xl transition-colors"
            >
              Sign out
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
              <button className="hover:underline">Privacy</button>
              <span>•</span>
              <button className="hover:underline">Terms</button>
              <span>•</span>
              <button className="hover:underline">FAQ</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FEATURE EXPLANATION MODAL (ChatGPT Simulator Style) */}
      {/* ========================================================= */}
      {activeModalKey && modalData[activeModalKey] && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f1524] border border-[#232f4c] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative text-xs">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1d273f]">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {modalData[activeModalKey].badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                  {modalData[activeModalKey].title}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  Kategori: {modalData[activeModalKey].category}
                </span>
              </div>

              <button
                onClick={() => setActiveModalKey(null)}
                className="w-7 h-7 rounded-full bg-[#1b253d] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {modalData[activeModalKey].description}
            </p>

            {/* Key Features List */}
            <div className="bg-[#131b2d] p-3.5 rounded-2xl border border-[#202c48] space-y-2">
              <p className="font-bold text-cyan-300 text-[11px]">Keunggulan Utama Fitur:</p>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                {modalData[activeModalKey].keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How To Use Box */}
            <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30 space-y-1">
              <p className="font-bold text-emerald-300 text-[11px]">Cara Menggunakan:</p>
              <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed">
                {modalData[activeModalKey].howToUse}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveModalKey(null)}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-900 dark:text-white font-bold rounded-xl transition-all shadow-md text-xs"
            >
              Saya Mengerti (Tutup Panduan)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
