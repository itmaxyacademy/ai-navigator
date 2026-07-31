import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, PanelLeft, Folder, Code, MoreHorizontal, Plus, Mic, 
  ChevronDown, FileText, Globe, X, Copy, Check, Send, 
  HelpCircle, Monitor, Smartphone, MessageSquare, ExternalLink,
  Layers, Settings, Sliders, Palette, LogOut, ArrowUpRight,
  ShieldAlert, BookOpen, Terminal, Eye, Radio, Wand2, Paperclip,
  Github, Cpu, Sparkle
} from 'lucide-react';

interface ModalContent {
  title: string;
  category: string;
  badge?: string;
  iconName: string;
  description: string;
  keyFeatures: string[];
  howToUse: string;
}

export const ClaudeReplica: React.FC = () => {
  // Active modal state for feature explanations
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);

  // View Mode state: 'desktop' | 'mobile'
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

  // Mobile drawer sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Desktop collapsed sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Plus (+) Dropdown menu state
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  // Model Picker Dropdown state
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Sonnet 5');

  // User Profile Popup Menu state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Web Search toggle inside plus menu
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(true);

  // Chat execution state
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; hasArtifact?: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showArtifactPanel, setShowArtifactPanel] = useState(true);

  // Modal explanation dictionary for Claude features
  const modalData: Record<string, ModalContent> = {
    'new-chat': {
      title: 'New Chat (Sesi Obrolan Baru)',
      category: 'Manajemen Percakapan',
      badge: 'Utama',
      iconName: 'Plus',
      description: 'Memulai percakapan baru dengan memori konteks bersih. Claude akan mengabaikan riwayat obrolan sebelumnya untuk memastikan fokus penuh pada instruksi baru Anda.',
      keyFeatures: [
        'Mereset jendela memori kontekstual',
        'Membuat utas percakapan baru di panel histori',
        'Mencegah pencemaran konteks dari topik yang tidak relevan'
      ],
      howToUse: 'Klik tombol "+ New chat" di bagian atas sidebar kiri untuk langsung membuka kanvas obrolan baru.'
    },
    'chats': {
      title: 'Chats (Riwayat Obrolan)',
      category: 'Manajemen Percakapan',
      badge: 'Histori',
      iconName: 'MessageSquare',
      description: 'Daftar lengkap seluruh percakapan yang pernah Anda lakukan dengan Claude. Diurutkan berdasarkan tanggal dan waktu interaksi.',
      keyFeatures: [
        'Pencarian cepat judul percakapan masa lalu',
        'Penyimpanan otomatis seluruh balasan & berkas',
        'Pengorganisasian utas obrolan interaktif'
      ],
      howToUse: 'Klik menu "Chats" untuk melihat atau mengelola daftar seluruh percakapan tersimpan.'
    },
    'projects': {
      title: 'Claude Projects (Ruang Kerja Berbasis Dokumen)',
      category: 'Konteks & Pengetahuan Proyek',
      badge: 'Fitur Unggulan',
      iconName: 'Folder',
      description: 'Fitur unik Claude yang memungkinkan Anda membuat ruang kerja khusus dengan melampirkan berkas acuan (PDF, TXT, Kode) hingga 200,000+ token konteks. Seluruh percakapan di dalam proyek akan secara otomatis memahami dokumen acuan tersebut.',
      keyFeatures: [
        'Basis pengetahuan kustom terisolasi per proyek',
        'Penyimpanan dokumen referensi jangka panjang',
        'Penyelarasan instruksi sistem (System Prompt) untuk tim'
      ],
      howToUse: 'Buka menu Projects, buat proyek baru (misal: "Riset Legal" atau "UI Redesign"), lalu unggah dokumen referensi proyek Anda.'
    },
    'artifacts': {
      title: 'Claude Artifacts (Pratinjau Live Kode & Visual)',
      category: 'Fitur Unggulan Anthropic',
      badge: 'Eksklusif Claude',
      iconName: 'Layers',
      description: 'Jendela pratinjau interaktif di sebelah kanan obrolan yang merender komponen web React, dokumen Markdown, SVG, atau diagram Mermaid secara real-time saat Claude mengodekan jawaban.',
      keyFeatures: [
        'Pratinjau langsung aplikasi React & HTML/CSS interaktif',
        'Pemisahan otomatis antara penjelasan teks dan hasil karya (Artifact)',
        'Kemampuan mengedit & mengunduh komponen secara independen'
      ],
      howToUse: 'Minta Claude membuat komponen UI atau diagram. Claude akan otomatis membuka jendela Artifacts di sisi kanan layar untuk ditampilkan secara live.'
    },
    'code': {
      title: 'Code & Programming Assistance',
      category: 'Pengembangan Perangkat Lunak',
      badge: 'Pro Capability',
      iconName: 'Code',
      description: 'Mode khusus untuk refactoring kode, pemecahan bug (debugging), arsitektur sistem, dan logika algoritma tingkat tinggi menggunakan model Claude 3.7 / 3.5 Sonnet.',
      keyFeatures: [
        'Pemahaman mendalam tentang repositori & arsitektur berkas',
        'Ekstralima kecerdasan dalam menemukan bug tersembunyi',
        'Penulisan kode berskala produksi yang rapi dan modular'
      ],
      howToUse: 'Klik menu Code untuk melihat panduan koding atau unggah berkas sumber kode Anda via tombol (+) untuk dianalisis.'
    },
    'customize': {
      title: 'Customize (Instruksi & Gaya Bahasa)',
      category: 'Personalisasi AI',
      badge: 'Gaya Bahasa',
      iconName: 'Sliders',
      description: 'Pengaturan nada bicara dan format jawaban kustom agar Claude merespons sesuai preferensi Anda (misal: lebih ringkas, bahasa formal, atau gaya mengajar).',
      keyFeatures: [
        'Penyesuaian nada penulisan alami manusia',
        'Penetapan batasan panjang jawaban secara permanen',
        'Pengaturan profil pengguna dan konteks pekerjaan'
      ],
      howToUse: 'Atur instruksi kustom Anda di menu Customize agar Claude mengingat gaya balasan favorit Anda untuk seluruh obrolan.'
    },
    'design': {
      title: 'Design Products & Prototyping',
      category: 'Desain Visual & UX',
      badge: 'Visual UI',
      iconName: 'Palette',
      description: 'Modul desain untuk membantu membuat wireframe UI/UX, desain poster, panduan merek, hingga Tailwind CSS layout.',
      keyFeatures: [
        'Generasi komponen UI Tailwind & SVG',
        'Penyusunan palet warna & panduan tipografi',
        'Konversi sketsa menjadi kode antarmuka web'
      ],
      howToUse: 'Klik menu Design di sidebar untuk mengeksplorasi pembuatan komponen visual dan tata letak UI.'
    },
    'recents': {
      title: 'Recents (Riwayat Percakapan Fiktif)',
      category: 'Akses Cepat Obrolan',
      badge: 'Histori Terakhir',
      iconName: 'MessageSquare',
      description: 'Daftar obrolan terbaru yang pernah dilakukan. Anda dapat mengklik judul obrolan fiksi mana pun di sidebar untuk memuat ulang percakapan contoh.',
      keyFeatures: [
        'Akses instan ke percakapan sebelumnya',
        'Penyaringan berdasarkan topik atau proyek',
        'Pengelolaan histori obrolan yang rapi'
      ],
      howToUse: 'Klik salah satu topik obrolan fiksi di bawah daftar Recents untuk langsung melihat contoh percakapan interaktif.'
    },
    'user-profile': {
      title: 'Profil Pengguna & Akun (Maxy Academy)',
      category: 'Pengaturan Akun',
      badge: 'Akun Pengguna',
      iconName: 'Settings',
      description: 'Menu pengelolaan akun pengguna Maxy Academy, pengaturan bahasa, preferensi tema, status paket berlangganan, dan opsi keluar.',
      keyFeatures: [
        'Informasi akun: maxyacademy.one@gmail.com',
        'Navigasi langsung ke Pengaturan (Settings)',
        'Unduh aplikasi desktop & ekstensi tambahan'
      ],
      howToUse: 'Klik nama akun "Maxy Academy" di pojok kiri bawah sidebar untuk membuka menu pop-up pengaturan akun.'
    },
    'plus-menu': {
      title: 'Menu Lampiran & Alat Tambahan (+ Button)',
      category: 'Input Multimodal',
      badge: 'Action Bar',
      iconName: 'Plus',
      description: 'Pintu masuk utama untuk melampirkan berkas/foto, mengambil tangkapan layar, menambahkan repositori GitHub, memilih Skills, atau mengaktifkan pencarian web real-time.',
      keyFeatures: [
        'Unggah dokumen & foto (Ctrl+U)',
        'Integrasi langsung dengan GitHub & Connectors',
        'Pencarian Web Real-time (Web Search)'
      ],
      howToUse: 'Klik ikon (+) di sebelah kiri kotak input pesan untuk membuka daftar opsi lampiran dan alat tambahan.'
    },
    'model-selector': {
      title: 'Pilihan Model Claude (Model Selector)',
      category: 'Mesin AI Anthropic',
      badge: 'Model Engine',
      iconName: 'Cpu',
      description: 'Pusat pemilihan model kecerdasan buatan Anthropic: Sonnet 5 (efisien & seimbang), Opus 5 (tugas kompleks & penalaran tinggi), Haiku 4.5 (super cepat), dan Fable 5.',
      keyFeatures: [
        'Sonnet 5: Pilihan ideal untuk koding & tugas sehari-hari',
        'Opus 5: Model terkuat untuk analisis dan masalah rumit',
        'Haiku 4.5: Respon instan untuk pertanyaan singkat'
      ],
      howToUse: 'Klik tombol "Sonnet 5 Medium" di kanan bawah input box untuk berpindah antar varian model Claude.'
    },
    'web-search': {
      title: 'Web Search (Pencarian Web Real-time)',
      category: 'Grounding & Fakta Terbaru',
      badge: 'Real-time Data',
      iconName: 'Globe',
      description: 'Fitur penelusuran web otomatis agar Claude dapat mencari berita terkini, data pasar, dan referensi terbaru yang terjadi setelah batas pelatihan model.',
      keyFeatures: [
        'Informasi terkini dan terkonfirmasi dengan rujukan web',
        'Sitasi otomatis sumber berita dan artikel',
        'Pencarian fakta instan tanpa meninggalkan percakapan'
      ],
      howToUse: 'Pastikan opsi "Web search" di dalam menu (+) tercentang agar Claude mencari data langsung dari internet.'
    },
    'quick-prompt': {
      title: 'Kategori Prompt Cepat (Quick Pills)',
      category: 'Inspirasi Instruksi',
      badge: 'Pintasan Cepat',
      iconName: 'Sparkles',
      description: 'Tombol pintas untuk langsung mengisi contoh instruksi populer seperti Penulisan (Write), Pembelajaran (Learn), Koding (Code), Produktivitas (Life stuff), dan Rekomendasi AI (Claude\'s choice).',
      keyFeatures: [
        'Pemicu cepat berbagai kasus penggunaan LLM',
        'Pilihan topik yang difilter khusus',
        'Mempercepat penulisan instruksi bagi pemula'
      ],
      howToUse: 'Klik salah satu tombol kategori di bawah kotak input pesan untuk langsung mengisi instruksi sampel ke dalam kolom percakapan.'
    }
  };

  // Open explanation modal helper
  const handleOpenModal = (key: string) => {
    if (modalData[key]) {
      setActiveModal(modalData[key]);
    }
  };

  // Send prompt handler
  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!promptText) setInputPrompt('');
    setIsLoading(true);

    setTimeout(() => {
      let aiText = `[Respon Simulasi Claude (${selectedModel})]\n\nTerima kasih! Saya telah memproses instruksi Anda: "${textToSend}" dengan kemampuan analisis mendalam dan bahasa yang alami.\n\n` +
        `• **Gaya Bahasa**: Responsif, terstruktur, dan bernada alami tanpa frasa kaku.\n` +
        `• **Fitur Pendukung**: Anda dapat menguji fitur Artifacts di sebelah kanan untuk melihat hasil generasi visual atau komponen terpisah.`;
      
      let hasArtifact = false;
      if (textToSend.toLowerCase().includes('code') || textToSend.toLowerCase().includes('buatkan') || textToSend.toLowerCase().includes('ui') || textToSend.toLowerCase().includes('gambar')) {
        hasArtifact = true;
        aiText += `\n\n✨ **Artifacts Diperbarui**: Jendela pratinjau komponen React interaktif telah dirender secara live di panel samping!`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText, hasArtifact }]);
      setIsLoading(false);
    }, 450);
  };

  const handleCopyMessage = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Fictional recent conversations data
  const fictionalRecents = [
    {
      title: "Desain UI Kit & Maskot AI",
      messages: [
        { sender: 'user' as const, text: 'Buatkan konsep UI Kit modern & karakter maskot AI untuk aplikasi edukasi Maxy Academy.' },
        { sender: 'ai' as const, text: 'Tentu! Berikut draf antarmuka UI Kit dengan komponen clean light/dark theme, beserta desain maskot AI bernama "Maxy Bot" yang ramah dan futuristik.', hasArtifact: true }
      ]
    },
    {
      title: "Analisis Strategi Marketing 2026",
      messages: [
        { sender: 'user' as const, text: 'Bagaimana tren strategi marketing digital untuk lembaga edukasi AI di tahun 2026?' },
        { sender: 'ai' as const, text: 'Berdasarkan analisis pasar, tren utama meliputi: 1) Video pendek edukatif berfokus kasus nyata, 2) Simulasi LLM gratis dalam modul pembelajaran, 3) Program sertifikasi resmi berbasis standar industri.' }
      ]
    },
    {
      title: "Ringkasan Kontrak & Dokumen Legal",
      messages: [
        { sender: 'user' as const, text: 'Rangkum poin-poin krusial dari draft MoU kerja sama berikut dalam 3 poin eksekutif.' },
        { sender: 'ai' as const, text: 'Berikut ringkasan eksekutif MoU:\n1. Skema pembagian hak dan kewajiban lisensi materi edukasi.\n2. Jadwal pelaksanaan program selama 12 bulan.\n3. Klausul kerahasiaan data (NDA) dan penyelesaian sengketa.' }
      ]
    },
    {
      title: "Optimasi Kode React & TypeScript",
      messages: [
        { sender: 'user' as const, text: 'Bagaimana cara mencegah re-render berlebihan di komponen React dengan custom hook?' },
        { sender: 'ai' as const, text: 'Gunakan kombinasi `useCallback` untuk fungsi yang diturunkan ke props, dan `useMemo` untuk komputasi berat. Pastikan dependency array hanya berisi variabel primitif terstabilkan.', hasArtifact: true }
      ]
    },
    {
      title: "Prompt RCTF & Pedoman Penulisan",
      messages: [
        { sender: 'user' as const, text: 'Jelaskan penerapan formula RCTF (Role, Context, Task, Format) untuk kebutuhan copywriting.' },
        { sender: 'ai' as const, text: 'Formula RCTF memastikan AI memberikan hasil presisi:\n- **Role**: Copywriter Senior SaaS\n- **Context**: Peluncuran produk AI baru\n- **Task**: Buat 3 opsi headline landing page\n- **Format**: Tabel perbandingan benefit' }
      ]
    }
  ];

  return (
    <div className="w-full bg-[#171717] text-neutral-100 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl font-sans relative">
      
      {/* Top Controls: Switch View Mode & Quick Info Banner */}
      <div className="bg-[#1f1f1f] border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap max-w-full">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-semibold text-neutral-200">Claude Interactive Simulator</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
            Anthropic UI Replica
          </span>
        </div>

        {/* Desktop / Mobile Toggle Buttons */}
        <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-neutral-800 flex-wrap max-w-full">
          <button
            onClick={() => { setViewMode('desktop'); setIsMobileSidebarOpen(false); }}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'desktop' ? 'bg-amber-600 text-slate-900 dark:text-white shadow' : 'text-neutral-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'mobile' ? 'bg-amber-600 text-slate-900 dark:text-white shadow' : 'text-neutral-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Workspace Outer Container */}
      <div className={`relative flex ${viewMode === 'mobile' ? 'max-w-sm mx-auto my-4 border-x border-neutral-800 rounded-3xl overflow-hidden shadow-2xl min-h-[680px]' : 'w-full min-h-[640px]'}`}>
        
        {/* ========================================================= */}
        {/* DESKTOP / MOBILE SIDEBAR */}
        {/* ========================================================= */}
        <aside className={`
          ${viewMode === 'mobile' 
            ? `absolute inset-y-0 left-0 z-40 w-72 bg-[#171717] border-r border-neutral-800 transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : isSidebarCollapsed
            ? 'w-0 overflow-hidden border-none opacity-0 transition-all duration-300'
            : 'w-64 bg-[#171717] border-r border-neutral-800/80 flex-shrink-0 flex flex-col justify-between transition-all duration-300'
          }
        `}>
          <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] flex-1 min-w-0">
            
            {/* Sidebar Top Title Header & Close / Toggle */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2 flex-wrap max-w-full">
                <span className="text-xl font-serif tracking-tight font-bold text-neutral-100">Claude</span>
                <button
                  onClick={() => handleOpenModal('new-chat')}
                  className="p-1 text-neutral-400 hover:text-slate-900 dark:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Penjelasan Claude Sidebar"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-neutral-400 flex-wrap max-w-full">
                <button 
                  onClick={() => handleOpenModal('chats')} 
                  className="p-1.5 hover:bg-neutral-800 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
                {viewMode === 'mobile' ? (
                  <button 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 hover:bg-neutral-800 text-neutral-300 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="p-1.5 hover:bg-neutral-800 hover:text-slate-900 dark:text-white text-neutral-400 rounded-lg transition-colors"
                    title="Collapse Sidebar"
                  >
                    <PanelLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Primary Action List */}
            <div className="space-y-0.5 text-xs">
              <div
                onClick={() => {
                  setMessages([]);
                  if (viewMode === 'mobile') setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-200 hover:bg-neutral-800/80 transition-colors font-medium text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                  <Plus className="w-4 h-4 text-neutral-400 group-hover:text-amber-400" />
                  <span>New chat</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenModal('new-chat'); }}
                  className="opacity-0 group-hover:opacity-100 text-amber-400 hover:scale-110 transition-all"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>

              <div
                onClick={() => handleOpenModal('chats')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                  <MessageSquare className="w-4 h-4 text-neutral-400" />
                  <span>Chats</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenModal('chats'); }}
                  className="opacity-0 group-hover:opacity-100 text-amber-400"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>

              <div
                onClick={() => handleOpenModal('projects')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                  <Folder className="w-4 h-4 text-neutral-400" />
                  <span>Projects</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenModal('projects'); }}
                  className="opacity-0 group-hover:opacity-100 text-amber-400"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => handleOpenModal('artifacts')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Artifacts</span>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  Live
                </span>
              </button>

              <button
                onClick={() => handleOpenModal('code')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                  <Code className="w-4 h-4 text-neutral-400" />
                  <span>Code</span>
                </div>
                <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
                  Upgrade
                </span>
              </button>

              <div
                onClick={() => handleOpenModal('customize')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                  <Sliders className="w-4 h-4 text-neutral-400" />
                  <span>Customize</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenModal('customize'); }}
                  className="opacity-0 group-hover:opacity-100 text-amber-400"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Products Sub-section */}
            <div className="pt-2">
              <div className="px-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1">
                Products
              </div>
              <div
                onClick={() => handleOpenModal('design')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-xs text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                  <Palette className="w-4 h-4 text-neutral-400" />
                  <span>Design</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenModal('design'); }}
                  className="opacity-0 group-hover:opacity-100 text-amber-400"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Recents Sub-section (Clean Fictional Conversations in Indonesian) */}
            <div className="pt-2 border-t border-neutral-800/60">
              <div className="flex items-center justify-between px-3 mb-1 text-[11px] font-medium text-neutral-500">
                <span className="uppercase tracking-wider">Recents</span>
                <button onClick={() => handleOpenModal('recents')} className="hover:text-neutral-300">
                  <Sliders className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-0.5 text-xs text-neutral-300">
                {fictionalRecents.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMessages(item.messages);
                      if (viewMode === 'mobile') setIsMobileSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800/80 truncate block hover:text-slate-900 dark:text-white transition-colors group relative"
                  >
                    <span className="break-words whitespace-normal leading-snug block pr-4">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Bottom User Footer Profile (Maxy Academy) */}
          <div className="p-3 border-t border-neutral-800/80 bg-[#171717] relative">
            
            {/* User Profile Popup Menu */}
            {isProfileMenuOpen && (
              <div className="absolute bottom-16 left-3 right-3 bg-[#242424] border border-neutral-700 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-bottom-2">
                <div className="px-3 py-2 border-b border-neutral-700 text-[11px] text-neutral-400 font-mono truncate">
                  maxyacademy.one@gmail.com
                </div>
                <button 
                  onClick={() => { handleOpenModal('user-profile'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left"
                >
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <Settings className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Settings</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Shift+⌘+,</span>
                </button>
                <button 
                  onClick={() => { handleOpenModal('user-profile'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left"
                >
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Language</span>
                  </div>
                  <span className="text-neutral-500">&gt;</span>
                </button>
                <button 
                  onClick={() => { handleOpenModal('user-profile'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left"
                >
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Get help</span>
                  </div>
                </button>
                
                <div className="border-t border-neutral-700 my-1" />

                <button 
                  onClick={() => { handleOpenModal('model-selector'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left flex-wrap max-w-full"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upgrade plan</span>
                </button>
                <button 
                  onClick={() => { handleOpenModal('user-profile'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left flex-wrap max-w-full"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Get apps and extensions</span>
                </button>
                <button 
                  onClick={() => { handleOpenModal('user-profile'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left flex-wrap max-w-full"
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Learn more</span>
                </button>

                <div className="border-t border-neutral-700 my-1" />

                <button 
                  onClick={() => { setIsProfileMenuOpen(false); setMessages([]); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-500/20 text-rose-300 rounded-xl text-left flex-wrap max-w-full"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}

            <div 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center justify-between cursor-pointer p-1.5 hover:bg-neutral-800 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-wrap max-w-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 text-slate-900 dark:text-white font-bold flex items-center justify-center text-xs shrink-0 shadow">
                  MA
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Maxy Academy</div>
                  <div className="text-[10px] text-neutral-400">Free plan</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-neutral-400 flex-wrap max-w-full">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenModal('user-profile'); }} 
                  className="p-1 hover:text-slate-900 dark:text-white"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                </button>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

          </div>
        </aside>

        {/* Mobile Backdrop Overlay */}
        {viewMode === 'mobile' && isMobileSidebarOpen && (
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
          />
        )}

        {/* ========================================================= */}
        {/* MAIN CHAT WORKSPACE AREA */}
        {/* ========================================================= */}
        <main className="flex-1 bg-[#1e1e1e] flex flex-col justify-between min-w-0 relative">
          
          {/* Header Top Bar */}
          <div className="px-4 py-3 border-b border-neutral-800/80 flex items-center justify-between bg-[#1e1e1e]">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              {/* Sidebar Toggle Icon for Mobile or Collapsed */}
              <button
                onClick={() => viewMode === 'mobile' ? setIsMobileSidebarOpen(!isMobileSidebarOpen) : setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1.5 text-neutral-400 hover:text-slate-900 dark:text-white hover:bg-neutral-800 rounded-xl transition-colors"
                title="Toggle Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-neutral-300 hidden sm:inline-block">
                Claude 3.7 Sonnet
              </span>
            </div>

            {/* Top Center Upgrade Pill */}
            <button
              onClick={() => handleOpenModal('model-selector')}
              className="px-3 py-1 bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors flex-wrap max-w-full"
            >
              <span>Free plan</span>
              <span className="text-neutral-500">•</span>
              <span className="text-amber-400 font-bold">Upgrade</span>
            </button>

            {/* Top Right Feedback / Ghost Icon */}
            <div className="flex items-center gap-2 text-neutral-400 flex-wrap max-w-full">
              <button
                onClick={() => handleOpenModal('artifacts')}
                className="p-1.5 hover:text-slate-900 dark:text-white hover:bg-neutral-800 rounded-lg text-xs flex items-center gap-1 text-amber-400 flex-wrap max-w-full"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Artifacts</span>
              </button>
            </div>
          </div>

          {/* Main Content View (Empty State vs Active Messages) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[520px] min-w-0">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[380px] text-center max-w-xl mx-auto space-y-6 my-auto">
                
                {/* Greeting Heading with Anthropic Orange Starburst */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-slate-900 dark:text-white text-lg font-bold shadow-lg shadow-orange-500/20">
                      ✳
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-neutral-100 font-medium tracking-tight">
                      Good afternoon, Maxy Academy
                    </h1>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Bagaimana Claude dapat membantu pekerjaan dan ide Anda hari ini?
                  </p>
                </div>

                {/* Big Dark Input Card Box */}
                <div className="w-full bg-[#262626] border border-neutral-700/80 rounded-2xl p-4 shadow-2xl relative text-left space-y-3">
                  <textarea
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendPrompt();
                      }
                    }}
                    placeholder="How can I help you today?"
                    rows={3}
                    className="w-full bg-transparent text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none resize-none leading-relaxed"
                  />

                  {/* Active indicator dot */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />

                  {/* Bottom Bar Inside Input Box */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-700/50 relative">
                    
                    {/* Left: Plus (+) Button for Attachments */}
                    <div className="relative">
                      <button
                        onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                        className="p-1.5 bg-neutral-700/60 hover:bg-neutral-600/80 text-neutral-200 rounded-xl transition-all flex items-center justify-center"
                        title="Tambah lampiran & konektor"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {/* Plus Dropdown Popup Menu */}
                      {isPlusMenuOpen && (
                        <div className="absolute left-0 bottom-10 w-64 bg-[#2a2a2a] border border-neutral-700 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5 animate-in fade-in slide-in-from-bottom-2">
                          <button
                            onClick={() => { handleOpenModal('plus-menu'); setIsPlusMenuOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left"
                          >
                            <div className="flex items-center gap-2 flex-wrap max-w-full">
                              <Paperclip className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Add files or photos</span>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-mono">⌘U</span>
                          </button>

                          <button
                            onClick={() => { handleOpenModal('plus-menu'); setIsPlusMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left flex-wrap max-w-full"
                          >
                            <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Take a screenshot</span>
                          </button>

                          <button
                            onClick={() => { handleOpenModal('projects'); setIsPlusMenuOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left"
                          >
                            <div className="flex items-center gap-2 flex-wrap max-w-full">
                              <Folder className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Add to project</span>
                            </div>
                            <span className="text-neutral-500">&gt;</span>
                          </button>

                          <button
                            onClick={() => { handleOpenModal('code'); setIsPlusMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left flex-wrap max-w-full"
                          >
                            <Github className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Add from GitHub</span>
                          </button>

                          <div className="border-t border-neutral-700 my-1" />

                          <button
                            onClick={() => { handleOpenModal('plus-menu'); setIsPlusMenuOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left"
                          >
                            <div className="flex items-center gap-2 flex-wrap max-w-full">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>Skills</span>
                            </div>
                            <span className="text-neutral-500">&gt;</span>
                          </button>

                          <button
                            onClick={() => { handleOpenModal('plus-menu'); setIsPlusMenuOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left"
                          >
                            <div className="flex items-center gap-2 flex-wrap max-w-full">
                              <Layers className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Add connector</span>
                            </div>
                            <span className="text-neutral-500">&gt;</span>
                          </button>

                          <button
                            onClick={() => { handleOpenModal('plus-menu'); setIsPlusMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 text-left flex-wrap max-w-full"
                          >
                            <Wand2 className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Add plugins...</span>
                          </button>

                          <div className="border-t border-neutral-700 my-1" />

                          <div 
                            onClick={() => setIsWebSearchEnabled(!isWebSearchEnabled)}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-xl text-neutral-200 cursor-pointer"
                          >
                            <div className="flex items-center gap-2 flex-wrap max-w-full">
                              <Globe className="w-3.5 h-3.5 text-sky-400" />
                              <span>Web search</span>
                            </div>
                            {isWebSearchEnabled && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Controls: Model Selector Dropdown & Send Button */}
                    <div className="flex items-center gap-2 relative flex-wrap max-w-full">
                      
                      {/* Model Selector Pill */}
                      <button
                        onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
                        className="px-2.5 py-1 bg-neutral-700/50 hover:bg-neutral-700 rounded-lg text-xs font-medium text-neutral-300 flex items-center gap-1.5 transition-colors flex-wrap max-w-full"
                      >
                        <span>{selectedModel}</span>
                        <span className="text-[10px] text-neutral-400">Medium</span>
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </button>

                      {/* Model Selector Popup Menu */}
                      {isModelPickerOpen && (
                        <div className="absolute right-0 bottom-10 w-72 bg-[#2a2a2a] border border-neutral-700 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-bottom-2 text-left">
                          
                          <div 
                            onClick={() => { setSelectedModel('Fable 5'); setIsModelPickerOpen(false); }}
                            className="p-2 hover:bg-neutral-700/60 rounded-xl cursor-pointer flex items-start justify-between"
                          >
                            <div>
                              <div className="font-bold text-neutral-100 flex items-center gap-1.5 flex-wrap max-w-full">
                                <span>Fable 5</span>
                                <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded text-[9px]">Pro</span>
                              </div>
                              <div className="text-[10px] text-neutral-400">For your toughest challenges</div>
                            </div>
                            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-[10px]">Upgrade</span>
                          </div>

                          <div 
                            onClick={() => { setSelectedModel('Opus 5'); setIsModelPickerOpen(false); }}
                            className="p-2 hover:bg-neutral-700/60 rounded-xl cursor-pointer flex items-start justify-between"
                          >
                            <div>
                              <div className="font-bold text-neutral-100 flex items-center gap-1.5 flex-wrap max-w-full">
                                <span>Opus 5</span>
                                <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded text-[9px]">Pro</span>
                              </div>
                              <div className="text-[10px] text-neutral-400">For complex tasks</div>
                            </div>
                            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-[10px]">Upgrade</span>
                          </div>

                          <div 
                            onClick={() => { setSelectedModel('Sonnet 5'); setIsModelPickerOpen(false); }}
                            className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl cursor-pointer flex items-start justify-between"
                          >
                            <div>
                              <div className="font-bold text-amber-300 flex items-center gap-1.5 flex-wrap max-w-full">
                                <span>Sonnet 5</span>
                                <Check className="w-3 h-3 text-amber-400" />
                              </div>
                              <div className="text-[10px] text-amber-200/70">Most efficient for everyday tasks</div>
                            </div>
                          </div>

                          <div 
                            onClick={() => { setSelectedModel('Haiku 4.5'); setIsModelPickerOpen(false); }}
                            className="p-2 hover:bg-neutral-700/60 rounded-xl cursor-pointer flex items-start justify-between"
                          >
                            <div>
                              <div className="font-bold text-neutral-100">Haiku 4.5</div>
                              <div className="text-[10px] text-neutral-400">Fastest for quick answers</div>
                            </div>
                          </div>

                          <div className="border-t border-neutral-700 my-1" />

                          <button
                            onClick={() => { handleOpenModal('model-selector'); setIsModelPickerOpen(false); }}
                            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-neutral-700/60 rounded-lg text-neutral-300 text-left"
                          >
                            <span>Effort</span>
                            <span className="text-neutral-400 text-[10px]">Medium &gt;</span>
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => handleSendPrompt()}
                        className="p-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl shadow transition-all flex items-center justify-center"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>

                {/* Quick Category Prompt Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleSendPrompt('Buatkan draf penulisan email profesional untuk mitra bisnis.')}
                    className="px-3 py-1.5 bg-[#262626] hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl border border-neutral-700 flex items-center gap-1.5 transition-colors flex-wrap max-w-full"
                  >
                    <span>✏️</span> Write
                  </button>
                  <button
                    onClick={() => handleSendPrompt('Jelaskan konsep dasar Machine Learning dengan analogi sederhana.')}
                    className="px-3 py-1.5 bg-[#262626] hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl border border-neutral-700 flex items-center gap-1.5 transition-colors flex-wrap max-w-full"
                  >
                    <span>🎓</span> Learn
                  </button>
                  <button
                    onClick={() => handleSendPrompt('Buatkan komponen button React dengan Tailwind CSS.')}
                    className="px-3 py-1.5 bg-[#262626] hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl border border-neutral-700 flex items-center gap-1.5 transition-colors flex-wrap max-w-full"
                  >
                    <span>&lt;/&gt;</span> Code
                  </button>
                  <button
                    onClick={() => handleSendPrompt('Berikan tips manajemen waktu kerja harian.')}
                    className="px-3 py-1.5 bg-[#262626] hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl border border-neutral-700 flex items-center gap-1.5 transition-colors flex-wrap max-w-full"
                  >
                    <span>☕</span> Life stuff
                  </button>
                  <button
                    onClick={() => handleSendPrompt('Rekomendasikan ide proyek AI inovatif untuk portofolio.')}
                    className="px-3 py-1.5 bg-[#262626] hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl border border-neutral-700 flex items-center gap-1.5 transition-colors flex-wrap max-w-full"
                  >
                    <span>💡</span> Claude&apos;s choice
                  </button>
                </div>

              </div>
            ) : (
              /* Active Chat Stream View */
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-amber-600/90 text-slate-900 dark:text-white rounded-tr-none'
                          : 'bg-[#262626] border border-neutral-700/80 text-neutral-100 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="font-bold flex items-center gap-1 text-[11px] flex-wrap max-w-full">
                          {msg.sender === 'user' ? (
                            'Maxy Academy'
                          ) : (
                            <>
                              <span className="text-amber-400">✳ Claude ({selectedModel})</span>
                            </>
                          )}
                        </span>

                        {msg.sender === 'ai' && (
                          <button
                            onClick={() => handleCopyMessage(idx, msg.text)}
                            className="text-neutral-400 hover:text-slate-900 dark:text-white flex items-center gap-1 text-[10px] flex-wrap max-w-full"
                          >
                            {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedIndex === idx ? 'Tersalin' : 'Salin'}
                          </button>
                        )}
                      </div>

                      <div className="whitespace-pre-wrap font-sans text-xs">
                        {msg.text}
                      </div>

                      {/* Claude Artifacts Window Panel Mockup */}
                      {msg.hasArtifact && showArtifactPanel && (
                        <div className="mt-3 p-3 bg-[#171717] border border-amber-500/30 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-amber-400 text-[11px] font-bold">
                            <span className="flex items-center gap-1 flex-wrap max-w-full">
                              <Eye className="w-3.5 h-3.5" /> Artifacts Preview: React UI Component
                            </span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                              Live Render
                            </span>
                          </div>
                          <div className="p-4 bg-[#222222] rounded-lg text-center flex items-center justify-center">
                            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all text-xs">
                              ✨ Live Interaktif Component Claude
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#262626] border border-neutral-700/80 rounded-2xl rounded-tl-none p-3 text-xs text-neutral-400 flex items-center gap-2 flex-wrap max-w-full">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span>Claude sedang berpikir & merangkum jawaban...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Chat Input Bar (if messages exist) */}
          {messages.length > 0 && (
            <div className="p-3 border-t border-neutral-800 bg-[#1e1e1e]">
              <div className="bg-[#262626] border border-neutral-700/80 rounded-xl p-2 flex items-center gap-2 flex-wrap max-w-full">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                  placeholder="Ketik instruksi balasan untuk Claude..."
                  className="flex-1 bg-transparent text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none px-2 min-w-0"
                />
                <button
                  onClick={() => handleSendPrompt()}
                  className="p-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* FEATURE EXPLANATION MODAL (JUST LIKE CHATGPT SIMULATOR) */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#242424] border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-700 pb-4">
              <div className="flex items-center gap-3 flex-wrap max-w-full">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                  ✳
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {activeModal.category}
                    </span>
                    {activeModal.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {activeModal.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {activeModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-neutral-400 hover:text-slate-900 dark:text-white hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Description */}
            <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
              <p>{activeModal.description}</p>

              {/* Key Features Bullet Points */}
              <div className="bg-[#1a1a1a] p-3.5 rounded-xl border border-neutral-800 space-y-2">
                <div className="font-bold text-amber-400 text-[11px] flex items-center gap-1.5 flex-wrap max-w-full">
                  <Sparkles className="w-3.5 h-3.5" /> Key Capabilities:
                </div>
                <ul className="space-y-1.5 pl-2">
                  {activeModal.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-300">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How To Use Section */}
              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-amber-200">
                <div className="font-bold text-[11px] mb-1">💡 Cara Menggunakan:</div>
                <p>{activeModal.howToUse}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-neutral-700">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
              >
                Paham & Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
