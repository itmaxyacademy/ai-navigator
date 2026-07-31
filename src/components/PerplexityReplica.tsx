import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, PanelLeft, Folder, Settings, Plug, 
  Clock, ArrowUpRight, Bell, Glasses, Menu, Plus, Mic, 
  ChevronDown, ChevronRight, ChevronUp, Check, Lock, Telescope, Gavel, 
  BookOpen, Compass, TrendingUp, Wallet, Heart, GraduationCap, 
  User, Download, Moon, HelpCircle, LogOut, Paperclip, Monitor, 
  Smartphone, X, Send, ExternalLink, Copy, LayoutGrid, Bot,
  GitBranch, Brain, Share2, Bookmark, ThumbsUp, ThumbsDown,
  RefreshCw, Radio
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

export const PerplexityReplica: React.FC = () => {
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

  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active modal for feature explanation
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);

  // Popover menus state
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isSearchModeMenuOpen, setIsSearchModeMenuOpen] = useState(false);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Mobile bottom sheets and modals states
  const [isMobileAccountSettingsOpen, setIsMobileAccountSettingsOpen] = useState(false);
  const [isMobilePlusMenuOpen, setIsMobilePlusMenuOpen] = useState(false);
  const [isMobileSearchModeOpen, setIsMobileSearchModeOpen] = useState(false);
  const [isMobileModelPickerOpen, setIsMobileModelPickerOpen] = useState(false);

  // Selection states
  const [selectedSearchMode, setSelectedSearchMode] = useState('Search');
  const [selectedModel, setSelectedModel] = useState('Sonar 2');
  const [isComputerActive, setIsComputerActive] = useState(false);

  // Customize submenu expanded in sidebar
  const [isCustomizeExpanded, setIsCustomizeExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);

  // Interactive search state
  const [inputPrompt, setInputPrompt] = useState('');
  const [searchHistory, setSearchHistory] = useState<Array<{
    query: string;
    answer: string;
    sources: Array<{ title: string; url: string; domain: string }>;
    timestamp: string;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeQueryIndex, setActiveQueryIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: 'Maxy Academy',
    email: 'maxyacademy.one@gmail.com',
    username: 'maxyacademy',
    avatarText: 'MA',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  });

  // Modal Explanations Dictionary
  const modalData: Record<string, ModalContent> = {
    'new-search': {
      title: 'New Search / Threads',
      category: 'Pencarian Baru',
      badge: 'Core Feature',
      iconName: 'Plus',
      description: 'Memulai pencarian informasi baru dengan kanvas bersih. Memastikan pencarian berikutnya tidak terpengaruh oleh konteks pertanyaan sebelumnya.',
      keyFeatures: [
        'Atur ulang rantai penalaran dan sumber pencarian',
        'Simpan thread pencarian baru ke riwayat',
        'Pencarian real-time dengan model AI terbaru'
      ],
      howToUse: 'Klik tombol "+ New" di sidebar kiri atau header mobile kapan saja untuk memulai pencarian topik baru.'
    },
    'computer': {
      title: 'Computer Search Mode',
      category: 'Konektivitas & Agen Lokal',
      badge: 'Pro Feature',
      iconName: 'Monitor',
      description: 'Fitur integrasi untuk memungkinkan Perplexity mengakses sistem berkas lokal, aplikasi desktop, atau terminal komputer Anda secara aman.',
      keyFeatures: [
        'Menganalisis dokumen PDF/Code dari direktori komputer',
        'Menjalankan skrip dan otomasi tugas desktop',
        'Sinkronisasi riwayat kerja antag perangkat'
      ],
      howToUse: 'Aktifkan mode Computer pada tombol pengalih atau di sidebar untuk memberikan izin akses lokal ke AI.'
    },
    'spaces': {
      title: 'Spaces (Folder Proyek)',
      category: 'Organisasi & Kolaborasi',
      badge: 'Productivity',
      iconName: 'Folder',
      description: 'Wadah kolaboratif untuk mengelompokkan pencarian, dokumen, prompt khusus, dan riset berdasarkan proyek atau topik tertentu.',
      keyFeatures: [
        'Mengelompokkan thread riset dalam satu folder proyek',
        'Berbagi Spaces dengan anggota tim atau publik',
        'Menambahkan instruksi khusus (system prompt) per Space'
      ],
      howToUse: 'Klik "Spaces" di sidebar untuk membuat folder proyek baru dan mengumpulkan referensi riset.'
    },
    'artifacts': {
      title: 'Artifacts',
      category: 'Hasil Visual & Kode',
      badge: 'Visual Render',
      iconName: 'LayoutGrid',
      description: 'Jendela terpisah untuk mengisolasi dan merender hasil berupa kode HTML/React, diagram Mermaid, dokumen panjang, atau antarmuka interaktif.',
      keyFeatures: [
        'Live preview komponen web dan aplikasi',
        'Penyuntingan teks dan kode berdampingan',
        'Ekspor hasil ke file atau repositori'
      ],
      howToUse: 'Buka panel Artifacts untuk melihat pratinjau langsung dari kode atau diagram yang dihasilkan Perplexity.'
    },
    'customize': {
      title: 'Customize & Connectors',
      category: 'Kustomisasi AI',
      badge: 'Personalization',
      iconName: 'Settings',
      description: 'Pusat pengaturan integrasi sumber data eksternal, instruksi kustom, alur kerja (Workflows), dan memori jangka panjang.',
      keyFeatures: [
        'Connectors: Hubungkan ke Google Drive, GitHub, Notion, Slack',
        'Skills: Aktifkan keahlian khusus seperti analisis data & matematika',
        'Workflows & Memory: Atur memori profil dan alur riset otomatis'
      ],
      howToUse: 'Pilih submenu di bawah Customize untuk mengaktifkan konektor data atau mengelola memori AI.'
    },
    'deep-research': {
      title: 'Deep Research Mode',
      category: 'Riset Akademik & Ilmiah',
      badge: 'Pro Locked 🔒',
      iconName: 'Telescope',
      description: 'Mode pencarian tingkat tinggi yang menjelajahi puluhan situs web, jurnal terindeks, dan dokumen teknis secara otonom untuk menyusun laporan komprehensif.',
      keyFeatures: [
        'Memindai 50+ sumber web dan jurnal secara simultan',
        'Menyusun analisis laporan multi-halaman berkedalaman tinggi',
        'Pengutipan sitasi ilmiah otomatis dengan link aktif'
      ],
      howToUse: 'Pilih "Deep Research" pada dropdown mode pencarian (Memerlukan langganan Perplexity Pro).'
    },
    'model-council': {
      title: 'Model Council (Max)',
      category: 'Multi-LLM Consensus',
      badge: 'Max Plan 🔒',
      iconName: 'Gavel',
      description: 'Fitur konsensus di mana beberapa model LLM terbaik (GPT-5.6, Claude Opus, Gemini 3.1) menjawab pertanyaan yang sama secara independen dan menyintesis jawaban terbaik.',
      keyFeatures: [
        'Membandingkan jawaban dari 3+ LLM flagship bersamaan',
        'Mendeteksi dan mengeliminasi halusinasi melalui verifikasi silang',
        'Rangkuman analitis dengan sudut pandang dari berbagai model'
      ],
      howToUse: 'Pilih "Model council" dari menu dropdown mode pencarian untuk mengaktifkan konsensus multi-AI.'
    },
    'learn-step-by-step': {
      title: 'Learn Step-by-Step',
      category: 'Edukasi & Pemahaman',
      badge: 'Interactive Tutoring',
      iconName: 'BookOpen',
      description: 'Mode penjelasan bertahap yang memecah topik rumit menjadi langkah-langkah ringkas dilengkapi pertanyaan pemahaman interaktif.',
      keyFeatures: [
        'Penjelasan berjenjang dari tingkat dasar hingga tingkat mahir',
        'Disertai kuis singkat di setiap tahapan materi',
        'Penyesuaian kecepatan belajar sesuai respon pengguna'
      ],
      howToUse: 'Pilih "Learn step by step" untuk mempelajari konsep sains, koding, atau matematika secara terstruktur.'
    },
    'models-locked': {
      title: 'Top AI Models Selection',
      category: 'Pengalihan Model AI Flagship',
      badge: 'Pro Models 🔒',
      iconName: 'Lock',
      description: 'Pilihan model AI tercanggih di industri termasuk Sonar 2, GPT-5.6 Terra, GPT-5.6 Sol, Gemini 3.1 Pro, Claude Sonnet 5, Claude Opus 5, GLM 5.2, Kimi K2.6, dan Grok 4.5.',
      keyFeatures: [
        'Ganti model kapan saja dalam sesi percakapan',
        'Akses eksklusif ke model koding dan penalaran matematika',
        'Dukungan konteks jendela panjang (hingga 1M+ token)'
      ],
      howToUse: 'Buka menu "Model ⌄" di kanan bawah input box untuk memilih model AI favorit Anda.'
    },
    'account-settings': {
      title: 'Account & Plan Settings',
      category: 'Pengaturan Profil',
      badge: 'User Profile',
      iconName: 'User',
      description: 'Halaman manajemen akun pengguna Maxy Academy. Kelola nama lengkap, username, email, metode pembayaran, tema tampilan, dan bahasa aplikasi.',
      keyFeatures: [
        'Pengaturan nama profil: Maxy Academy',
        'Manajemen email: maxyacademy.one@gmail.com',
        'Opsi Upgrade Plan & Aplikasi Desktop'
      ],
      howToUse: 'Klik nama profil Anda di sudut kiri bawah untuk membuka kartu pengaturan akun.'
    },
    'category-menu': {
      title: 'Discover & Topical Hubs',
      category: 'Eksplorasi Topik Populer',
      badge: 'Topical Search',
      iconName: 'Compass',
      description: 'Pusat navigasi khusus untuk menjelajahi riset terkini di bidang Finance, Personal CFO, Health, Academic, dan Patents.',
      keyFeatures: [
        'Finance: Analisis pasar saham dan tren keuangan real-time',
        'Academic: Filter khusus pencarian jurnal dan makalah ilmiah',
        'Patents: Pencarian paten teknologi global terindeks'
      ],
      howToUse: 'Klik ikon menu tiga garis ≡ di sudut kanan atas untuk membuka kategori riset spesifik.'
    }
  };

  const handleOpenModal = (key: string) => {
    if (modalData[key]) {
      setActiveModal(modalData[key]);
    }
  };

  // Perform Simulated Perplexity Search
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim()) return;

    setIsSearching(true);
    const query = inputPrompt;
    setInputPrompt('');

    setTimeout(() => {
      const newSearch = {
        query,
        answer: `Berdasarkan penelusuran real-time dari 12 sumber terverifikasi:\n\n1. **Ringkasan Utama**: Perplexity AI memanfaatkan gabungan indeks pencarian web terkini dan model bahasa besar (LLM) untuk memberikan jawaban langsung yang dilengkapi dengan rujukan sumber (sitasi) tepercaya.\n2. **Analisis Konsep**: Berbeda dari mesin pencari konvensional yang memberikan daftar tautan, Perplexity menyintesis informasi dari berbagai artikel ilmiah, berita, dan basis data resmi secara transparan.\n3. **Kesimpulan**: Pengguna dapat memverifikasi fakta secara langsung melalui kartu rujukan di bawah jawaban.`,
        sources: [
          { title: 'Teknologi AI & LLM Search 2026', url: 'https://perplex-tech.org/report', domain: 'perplex-tech.org' },
          { title: 'Jurnal Komputasi & AI Indonesia', url: 'https://jurnal-ai.id/artikel-sitasi', domain: 'jurnal-ai.id' },
          { title: 'Pusat Riset Maxy Academy', url: 'https://maxyacademy.com/research', domain: 'maxyacademy.com' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSearchHistory((prev) => [newSearch, ...prev]);
      setActiveQueryIndex(0);
      setIsSearching(false);
    }, 600);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Top View Mode Selector Bar */}
      <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl p-2.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-neutral-200">Perplexity AI Interactive Simulator</span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">
            Sonar 2 · Deep Research
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'desktop'
                ? 'bg-neutral-800 text-slate-900 dark:text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'mobile'
                ? 'bg-neutral-800 text-slate-900 dark:text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER FRAME (DESKTOP OR MOBILE SIMULATION) */}
      <div className={`transition-all duration-300 w-full ${
        viewMode === 'mobile' ? 'max-w-[390px]' : 'max-w-5xl'
      }`}>
        <div className={`bg-[#141414] text-neutral-100 rounded-2xl overflow-hidden font-sans border border-neutral-800 shadow-2xl relative ${
          viewMode === 'mobile' ? 'h-[720px] flex flex-col' : 'h-[640px] flex'
        }`}>

          {/* ========================================================= */}
          {/* MOBILE VIEW LAYOUT */}
          {/* ========================================================= */}
          {viewMode === 'mobile' ? (
            <div className="flex flex-col h-full w-full relative bg-[#141414]">
              {/* Mobile Header Bar */}
              <div className="h-14 px-4 border-b border-neutral-800/80 flex items-center justify-between shrink-0 bg-[#141414]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-300 transition-colors"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white tracking-tight">
                    <span className="text-cyan-400 text-lg font-mono">✳</span>
                    <span className="text-sm font-semibold">perplexity</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal('category-menu')}
                    className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                  >
                    <Glasses className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Drawer Overlay */}
              {isMobileSidebarOpen && (
                <div className="absolute inset-0 z-50 flex">
                  {/* Backdrop */}
                  <div
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  />

                  {/* Drawer Content */}
                  <div className="relative w-72 bg-[#181818] border-r border-neutral-800 h-full flex flex-col justify-between p-3.5 z-10 animate-in slide-in-from-left duration-200">
                    <div className="space-y-4 overflow-y-auto max-h-[calc(100%-70px)]">
                      {/* Logo Header */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 text-xl font-bold font-mono">✳</span>
                          <span className="font-bold text-slate-900 dark:text-white text-base">perplexity</span>
                        </div>
                        <button
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className="p-1 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-neutral-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* New Button */}
                      <button
                        onClick={() => {
                          setIsMobileSidebarOpen(false);
                          handleOpenModal('new-search');
                        }}
                        className="w-full bg-[#212121] hover:bg-neutral-800 border border-neutral-700/60 text-slate-900 dark:text-white rounded-xl py-2.5 px-3 flex items-center gap-2 font-medium text-xs shadow-sm transition-colors"
                      >
                        <Plus className="w-4 h-4 text-neutral-300" />
                        <span>New</span>
                      </button>

                      {/* Mobile Nav Links */}
                      <div className="space-y-1 text-xs">
                        <button
                          onClick={() => handleOpenModal('computer')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Monitor className="w-4 h-4 text-neutral-400" />
                            <span>Computer</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                        </button>

                        <button
                          onClick={() => handleOpenModal('spaces')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Folder className="w-4 h-4 text-neutral-400" />
                            <span>Spaces</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                        </button>

                        <button
                          onClick={() => handleOpenModal('artifacts')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutGrid className="w-4 h-4 text-neutral-400" />
                            <span>Artifacts</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                        </button>

                        {/* Customize Submenu */}
                        <div>
                          <button
                            onClick={() => setIsCustomizeExpanded(!isCustomizeExpanded)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <Settings className="w-4 h-4 text-neutral-400" />
                              <span>Customize</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isCustomizeExpanded ? '' : '-rotate-90'}`} />
                          </button>

                          {isCustomizeExpanded && (
                            <div className="ml-8 space-y-1 my-1 border-l border-neutral-800 pl-2 text-[11px] text-neutral-400">
                              <button
                                onClick={() => handleOpenModal('customize')}
                                className="w-full text-left py-1 px-2 hover:text-slate-900 dark:text-white rounded hover:bg-neutral-800/50"
                              >
                                Connectors
                              </button>
                              <button
                                onClick={() => handleOpenModal('customize')}
                                className="w-full text-left py-1 px-2 hover:text-slate-900 dark:text-white rounded hover:bg-neutral-800/50"
                              >
                                Skills
                              </button>
                              <button
                                onClick={() => handleOpenModal('customize')}
                                className="w-full text-left py-1 px-2 hover:text-slate-900 dark:text-white rounded hover:bg-neutral-800/50"
                              >
                                Workflows
                              </button>
                              <button
                                onClick={() => handleOpenModal('customize')}
                                className="w-full text-left py-1 px-2 hover:text-slate-900 dark:text-white rounded hover:bg-neutral-800/50"
                              >
                                Memory
                              </button>
                            </div>
                          )}
                        </div>

                        {/* History */}
                        <div>
                          <button
                            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <Clock className="w-4 h-4 text-neutral-400" />
                              <span>History</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isHistoryExpanded ? '' : '-rotate-90'}`} />
                          </button>

                          {isHistoryExpanded && (
                            <div className="ml-8 my-1 pl-2 text-[11px] text-neutral-500 italic py-1">
                              No recent sessions
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Drawer Bottom User */}
                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-slate-900 dark:text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {userProfile.avatarText}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{userProfile.username}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsMobileSidebarOpen(false);
                          handleOpenModal('account-settings');
                        }}
                        className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Main Canvas Body */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between relative">
                {/* Search History or Welcoming Heading */}
                {searchHistory.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 my-auto">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-normal text-neutral-200 tracking-tight">
                      What do you want to know?
                    </h2>
                  </div>
                ) : (
                  <div className="space-y-4 pb-20">
                    {searchHistory.map((item, idx) => (
                      <div key={idx} className="bg-[#1c1c1c] border border-neutral-800/80 rounded-2xl p-3.5 space-y-2 text-xs">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="text-cyan-400 font-mono text-sm">Q:</span>
                          <span>{item.query}</span>
                        </div>
                        <div className="text-neutral-300 leading-relaxed whitespace-pre-line border-t border-neutral-800/60 pt-2 text-[11px]">
                          {item.answer}
                        </div>
                        {/* Sources */}
                        <div className="pt-2 border-t border-neutral-800/60">
                          <span className="text-[10px] font-bold text-neutral-400 block mb-1">Rujukan Terkait:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.sources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-cyan-300 rounded-md border border-neutral-800 text-[10px] flex items-center gap-1"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span className="truncate max-w-[120px]">{src.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mobile Bottom Search Input Card (Matching Screenshot 7) */}
                <div className="sticky bottom-0 bg-[#1e1f20] border border-neutral-700/80 rounded-2xl p-3 shadow-2xl space-y-2 text-xs">
                  <textarea
                    rows={2}
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSearchSubmit();
                      }
                    }}
                    placeholder="Type @ for connectors"
                    className="w-full bg-transparent text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none text-xs leading-relaxed"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsMobilePlusMenuOpen(true)}
                        className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
                        title="Upload & Connectors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsMobileSearchModeOpen(true)}
                        className="flex items-center gap-1 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 text-[11px] transition-colors"
                      >
                        <Search className="w-3 h-3 text-neutral-400" />
                        <span className="text-[10px] truncate max-w-[80px]">{selectedSearchMode}</span>
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </button>

                      <button
                        onClick={() => handleOpenModal('computer')}
                        className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <button
                        onClick={() => setIsMobileModelPickerOpen(true)}
                        className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors flex items-center gap-1"
                        title="Select Model"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => alert('Mode mikrofon aktif.')}
                        className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSearchSubmit()}
                        disabled={isSearching}
                        className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-900 font-bold flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* MOBILE BOTTOM SHEETS & OVERLAYS (Matching Screenshots 1,2,3,4) */}
              {/* ========================================================= */}

              {/* 1. Account Settings Modal (Screenshot 1) */}
              {isMobileAccountSettingsOpen && (
                <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end p-0 animate-in fade-in duration-200">
                  <div className="bg-[#181818] border-t border-neutral-800 rounded-t-3xl max-h-[92%] overflow-y-auto w-full p-4 text-neutral-100 shadow-2xl relative space-y-4 animate-in slide-in-from-bottom duration-200">
                    {/* Header Row */}
                    <div className="flex items-center justify-between pb-1">
                      <button className="flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-white hover:text-neutral-300">
                        <span>Account</span>
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      </button>
                      <button
                        onClick={() => setIsMobileAccountSettingsOpen(false)}
                        className="w-7 h-7 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="border-b border-neutral-800/80" />

                    {/* Profile Info Row */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700/80 shrink-0 flex items-center justify-center">
                          {userProfile.avatarUrl ? (
                            <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-900 dark:text-white font-bold text-sm">{userProfile.avatarText}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                          <p className="text-xs text-neutral-400 truncate">{userProfile.username}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert('Fitur ganti avatar.')}
                        className="w-full py-2 bg-transparent border border-neutral-700/80 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-xl transition-colors text-center"
                      >
                        Change avatar
                      </button>
                    </div>

                    {/* Full Name Field */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-medium text-neutral-400 block">Full Name</label>
                      <p className="text-xs text-neutral-200 font-normal">{userProfile.name}</p>
                      <button
                        onClick={() => {
                          const newName = prompt('Masukkan Full Name baru:', userProfile.name);
                          if (newName) setUserProfile({ ...userProfile, name: newName });
                        }}
                        className="px-3 py-1.5 bg-transparent border border-neutral-700/80 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg transition-colors inline-block"
                      >
                        Change full name
                      </button>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-medium text-neutral-400 block">Username</label>
                      <p className="text-xs text-neutral-200 font-normal">{userProfile.username}</p>
                      <button
                        onClick={() => {
                          const newUsername = prompt('Masukkan Username baru:', userProfile.username);
                          if (newUsername) setUserProfile({ ...userProfile, username: newUsername });
                        }}
                        className="px-3 py-1.5 bg-transparent border border-neutral-700/80 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg transition-colors inline-block"
                      >
                        Change username
                      </button>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1 pt-1">
                      <label className="text-[11px] font-medium text-neutral-400 block">Email</label>
                      <p className="text-xs text-neutral-200 font-normal">{userProfile.email}</p>
                    </div>

                    <div className="border-b border-neutral-800/80 my-2" />

                    {/* Your Subscription */}
                    <div className="space-y-2 pt-1 pb-2">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Your Subscription</h4>
                      
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-xs text-neutral-200 font-medium leading-snug">
                            Unlock the most powerful search experience with Perplexity
                          </p>
                          <p className="text-[11px] text-neutral-400 leading-normal">
                            Get the most out of Perplexity with Pro.{' '}
                            <button onClick={() => handleOpenModal('account-settings')} className="text-teal-400 hover:underline">
                              Learn more
                            </button>
                          </p>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[9px] font-bold flex flex-col items-center justify-center shrink-0 leading-none">
                          <span>Pr</span>
                          <span>o</span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert('Proses upgrade plan Perplexity Pro...')}
                        className="mt-2 px-4 py-2 bg-neutral-200 hover:bg-white text-neutral-900 font-bold text-xs rounded-xl transition-colors shadow-md"
                      >
                        Upgrade plan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Attachment / Plus Menu Bottom Sheet (Screenshot 2) */}
              {isMobilePlusMenuOpen && (
                <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
                  <div className="bg-[#181818] border-t border-neutral-800 rounded-t-3xl p-4 text-neutral-200 space-y-3 shadow-2xl animate-in slide-in-from-bottom duration-200">
                    {/* Top Header */}
                    <div className="flex items-center justify-end pb-1">
                      <button
                        onClick={() => setIsMobilePlusMenuOpen(false)}
                        className="w-7 h-7 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setIsMobilePlusMenuOpen(false);
                          alert('Pilih file atau gambar dari perangkat.');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                      >
                        <Paperclip className="w-4 h-4 text-neutral-300" />
                        <span className="font-medium text-slate-900 dark:text-white text-xs">Upload files or images</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMobilePlusMenuOpen(false);
                          handleOpenModal('customize');
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Plug className="w-4 h-4 text-neutral-300" />
                          <span className="font-medium text-slate-900 dark:text-white text-xs">Connectors</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                      </button>

                      <button
                        onClick={() => {
                          setIsMobilePlusMenuOpen(false);
                          handleOpenModal('spaces');
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Folder className="w-4 h-4 text-neutral-300" />
                          <span className="font-medium text-slate-900 dark:text-white text-xs">Spaces</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Search Mode Bottom Sheet (Screenshot 3) */}
              {isMobileSearchModeOpen && (
                <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
                  <div className="bg-[#181818] border-t border-neutral-800 rounded-t-3xl p-4 text-neutral-200 space-y-3 shadow-2xl animate-in slide-in-from-bottom duration-200">
                    {/* Top Header */}
                    <div className="flex items-center justify-end pb-1">
                      <button
                        onClick={() => setIsMobileSearchModeOpen(false)}
                        className="w-7 h-7 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mode List */}
                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setSelectedSearchMode('Search');
                          setIsMobileSearchModeOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Search className="w-4 h-4 text-neutral-300" />
                          <span className="font-medium text-slate-900 dark:text-white text-xs">Search</span>
                        </div>
                        {selectedSearchMode === 'Search' && <Check className="w-4 h-4 text-teal-400" />}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSearchMode('Deep research');
                          setIsMobileSearchModeOpen(false);
                          handleOpenModal('deep-research');
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Telescope className="w-4 h-4 text-neutral-400" />
                          <span className="font-medium text-neutral-300 text-xs">Deep research</span>
                        </div>
                        <Lock className="w-3.5 h-3.5 text-neutral-500" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSearchMode('Model council');
                          setIsMobileSearchModeOpen(false);
                          handleOpenModal('model-council');
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Gavel className="w-4 h-4 text-neutral-400" />
                          <span className="font-medium text-neutral-300 text-xs">Model council</span>
                          <span className="px-1.5 py-0.5 text-[9px] bg-neutral-800 text-neutral-400 rounded border border-neutral-700/60 font-medium">Max</span>
                        </div>
                        <Lock className="w-3.5 h-3.5 text-neutral-500" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSearchMode('Learn step by step');
                          setIsMobileSearchModeOpen(false);
                          handleOpenModal('learn-step-by-step');
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-neutral-300" />
                          <span className="font-medium text-slate-900 dark:text-white text-xs">Learn step by step</span>
                        </div>
                        {selectedSearchMode === 'Learn step by step' && <Check className="w-4 h-4 text-teal-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Model Selection Bottom Sheet (Screenshot 4) */}
              {isMobileModelPickerOpen && (
                <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
                  <div className="bg-[#181818] border-t border-neutral-800 rounded-t-3xl p-4 text-neutral-200 space-y-3 max-h-[85%] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200">
                    {/* Top Header */}
                    <div className="flex items-center justify-end pb-1">
                      <button
                        onClick={() => setIsMobileModelPickerOpen(false)}
                        className="w-7 h-7 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Banner Box */}
                    <button
                      onClick={() => {
                        setIsMobileModelPickerOpen(false);
                        handleOpenModal('models-locked');
                      }}
                      className="w-full border border-teal-500/40 bg-teal-950/20 hover:bg-teal-900/30 rounded-xl p-3 flex items-center justify-between text-xs text-neutral-100 font-medium transition-colors"
                    >
                      <span>Access the top AI models</span>
                      <ChevronRight className="w-4 h-4 text-teal-400" />
                    </button>

                    {/* Model List */}
                    <div className="space-y-0.5 text-xs">
                      {[
                        { name: 'Sonar 2', icon: Radio, isMax: false },
                        { name: 'GPT-5.6 Terra', icon: Bot, isMax: false },
                        { name: 'GPT-5.6 Sol', icon: Bot, isMax: true },
                        { name: 'Gemini 3.1 Pro', icon: Sparkles, isMax: false },
                        { name: 'Claude Sonnet 5', icon: Sparkles, isMax: false },
                        { name: 'Claude Opus 5', icon: Sparkles, isMax: true },
                        { name: 'GLM 5.2', icon: Brain, isMax: false },
                        { name: 'Kimi K2.6', icon: Bot, isMax: false },
                        { name: 'Grok 4.5', icon: Compass, isMax: false },
                        { name: 'Nemotron 3 Ultra', icon: Sparkles, isMax: false },
                      ].map((m, idx) => {
                        const IconComp = m.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedModel(m.name);
                              setIsMobileModelPickerOpen(false);
                              handleOpenModal('models-locked');
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <IconComp className="w-4 h-4 text-neutral-400" />
                              <span className="font-medium text-neutral-200 text-xs">{m.name}</span>
                              {m.isMax && (
                                <span className="px-1.5 py-0.5 text-[9px] bg-neutral-800 text-neutral-400 rounded border border-neutral-700/60 font-medium">
                                  Max
                                </span>
                              )}
                            </div>
                            <Lock className="w-3.5 h-3.5 text-neutral-500" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ========================================================= */
            /* DESKTOP VIEW LAYOUT (Matching Screenshot 1) */
            /* ========================================================= */
            <div className="flex h-full w-full relative">
              {/* DESKTOP LEFT SIDEBAR */}
              <div className={`bg-[#141414] border-r border-neutral-800 flex flex-col justify-between shrink-0 select-none transition-all duration-300 ${
                isSidebarCollapsed ? 'w-0 overflow-hidden opacity-0 border-none' : 'w-60 p-3'
              }`}>
                <div className="space-y-3 overflow-y-auto max-h-[calc(100%-110px)] pr-1">
                  {/* Top Bar Logo & Collapse */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 text-xl font-bold font-mono">✳</span>
                    </div>
                    <button
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                      title="Collapse Sidebar"
                    >
                      <PanelLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* New Button */}
                  <button
                    onClick={() => handleOpenModal('new-search')}
                    className="w-full bg-[#1e1f20] hover:bg-neutral-800 border border-neutral-700/60 text-slate-900 dark:text-white rounded-xl py-2 px-3 flex items-center gap-2 font-medium text-xs shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4 text-neutral-300" />
                    <span>New</span>
                  </button>

                  {/* Main Nav Items */}
                  <div className="space-y-0.5 text-xs">
                    <button
                      onClick={() => handleOpenModal('computer')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 hover:text-slate-900 dark:text-white transition-colors text-left"
                    >
                      <Monitor className="w-4 h-4 text-neutral-400" />
                      <span>Computer</span>
                    </button>

                    <button
                      onClick={() => handleOpenModal('spaces')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 hover:text-slate-900 dark:text-white transition-colors text-left"
                    >
                      <Folder className="w-4 h-4 text-neutral-400" />
                      <span>Spaces</span>
                    </button>

                    <button
                      onClick={() => handleOpenModal('artifacts')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 hover:text-slate-900 dark:text-white transition-colors text-left"
                    >
                      <LayoutGrid className="w-4 h-4 text-neutral-400" />
                      <span>Artifacts</span>
                    </button>

                    {/* Customize with sub-items */}
                    <div>
                      <button
                        onClick={() => setIsCustomizeExpanded(!isCustomizeExpanded)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 hover:text-slate-900 dark:text-white transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Settings className="w-4 h-4 text-neutral-400" />
                          <span>Customize</span>
                        </div>
                      </button>

                      {isCustomizeExpanded && (
                        <div className="ml-8 space-y-1 my-1 border-l border-neutral-800 pl-2 text-[11px] text-neutral-400">
                          <button
                            onClick={() => handleOpenModal('customize')}
                            className="w-full text-left py-1 px-2 hover:text-slate-900 dark:text-white rounded hover:bg-neutral-800/50"
                          >
                            Connectors
                          </button>
                          <button
                            onClick={() => handleOpenModal('customize')}
                            className="w-full text-left py-1 px-2 hover:text-slate-900 dark:text-white rounded hover:bg-neutral-800/50"
                          >
                            Skills
                          </button>
                          <button
                            onClick={() => handleOpenModal('customize')}
                            className="w-full text-left py-1 px-2 hover:text-slate-900 dark:text-white rounded hover:bg-neutral-800/50"
                          >
                            Workflows
                          </button>
                          <button
                            onClick={() => handleOpenModal('customize')}
                            className="w-full text-left py-1 px-2 hover:text-slate-900 dark:text-white rounded hover:bg-neutral-800/50"
                          >
                            Memory
                          </button>
                        </div>
                      )}
                    </div>

                    {/* History Section */}
                    <div className="pt-2 border-t border-neutral-800/60">
                      <button
                        onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 hover:text-slate-900 dark:text-white transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-neutral-400" />
                          <span>History</span>
                        </div>
                      </button>

                      {isHistoryExpanded && (
                        <div className="ml-8 my-1 text-[11px] text-neutral-500 italic py-1">
                          No recent sessions
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Sidebar Bottom Profile & Upgrade */}
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <button
                    onClick={() => handleOpenModal('account-settings')}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-700/60 hover:bg-neutral-800 text-neutral-300 hover:text-slate-900 dark:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Upgrade plan</span>
                  </button>

                  <div className="flex items-center justify-between px-1.5 py-1">
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="flex items-center gap-2 min-w-0 hover:bg-neutral-800 p-1 rounded-xl transition-colors text-left"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-slate-900 dark:text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                        {userProfile.avatarText}
                      </div>
                      <span className="text-xs font-medium text-neutral-200 truncate max-w-[90px]">
                        {userProfile.name}
                      </span>
                      <ChevronUp className="w-3 h-3 text-neutral-400" />
                    </button>

                    <button
                      onClick={() => alert('Notifikasi: Tidak ada pemberitahuan baru.')}
                      className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* DESKTOP MAIN CONTENT AREA */}
              <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#141414] relative">
                {/* Desktop Header */}
                <div className="h-14 px-6 border-b border-neutral-800/60 flex items-center justify-between shrink-0 bg-[#141414]">
                  <div className="flex items-center gap-2">
                    {isSidebarCollapsed && (
                      <button
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                        title="Expand Sidebar"
                      >
                        <PanelLeft className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenModal('account-settings')}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-full border border-neutral-700/60 font-medium transition-colors"
                    >
                      Free plan · Upgrade
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal('category-menu')}
                      className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-xl transition-colors"
                      title="Anonymous Mode"
                    >
                      <Glasses className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                      className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-xl transition-colors"
                      title="Category Menu"
                    >
                      <Menu className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Central Canvas Workspace */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between max-w-3xl mx-auto w-full relative">
                  {searchHistory.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 my-auto">
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Search</span>
                      <h1 className="text-3xl font-normal text-slate-900 dark:text-white tracking-tight">
                        What do you want to know?
                      </h1>
                    </div>
                  ) : (
                    <div className="space-y-6 pb-24 w-full">
                      {searchHistory.map((item, idx) => (
                        <div key={idx} className="bg-[#1a1a1a] border border-neutral-800/80 rounded-2xl p-5 space-y-3 shadow-lg">
                          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/60 pb-2">
                            <span className="font-semibold text-slate-900 dark:text-white text-base">Q: {item.query}</span>
                            <span className="text-[10px]">{item.timestamp}</span>
                          </div>
                          <div className="text-neutral-200 leading-relaxed whitespace-pre-line text-xs">
                            {item.answer}
                          </div>

                          {/* Sources Cards */}
                          <div className="pt-3 border-t border-neutral-800/60">
                            <span className="text-[11px] font-bold text-neutral-400 block mb-2">Rujukan Real-time:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {item.sources.map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-[#212121] hover:bg-neutral-800 rounded-xl border border-neutral-700/60 text-cyan-300 text-xs flex items-center justify-between gap-1 transition-colors"
                                >
                                  <div className="min-w-0">
                                    <p className="font-medium truncate text-slate-900 dark:text-white text-[11px]">{src.title}</p>
                                    <p className="text-[10px] text-neutral-400 truncate">{src.domain}</p>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Desktop Central Input Card (Matching Screenshot 1) */}
                  <div className="sticky bottom-4 bg-[#1e1f20] border border-neutral-700/80 rounded-2xl p-4 shadow-2xl space-y-3 text-xs w-full">
                    <textarea
                      rows={2}
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSearchSubmit();
                        }
                      }}
                      placeholder="Type / for search modes"
                      className="w-full bg-transparent text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none text-sm leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1">
                      {/* Left Input Actions */}
                      <div className="flex items-center gap-2">
                        {/* (+) Button Popover Trigger */}
                        <div className="relative">
                          <button
                            onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-xl transition-colors"
                            title="Attachments / Connectors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          {/* Attachment / Connectors Popover (Screenshot 2) */}
                          {isPlusMenuOpen && (
                            <div className="absolute left-0 bottom-10 bg-[#1e1f20] border border-neutral-700/80 rounded-2xl p-2 shadow-2xl w-56 text-xs text-neutral-200 z-50 space-y-1 animate-in fade-in">
                              <button
                                onClick={() => {
                                  alert('Pilih berkas dari komputer Anda.');
                                  setIsPlusMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                              >
                                <Paperclip className="w-4 h-4 text-neutral-400" />
                                <span>Upload files or images</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleOpenModal('customize');
                                  setIsPlusMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <Plug className="w-4 h-4 text-neutral-400" />
                                  <span>Connectors</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                              </button>
                              <button
                                onClick={() => {
                                  handleOpenModal('spaces');
                                  setIsPlusMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <Folder className="w-4 h-4 text-neutral-400" />
                                  <span>Spaces</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Search Modes Dropdown (Screenshot 3) */}
                        <div className="relative">
                          <button
                            onClick={() => setIsSearchModeMenuOpen(!isSearchModeMenuOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262626] hover:bg-neutral-800 rounded-xl border border-neutral-700/60 text-xs font-medium text-neutral-200 transition-colors"
                          >
                            <Search className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{selectedSearchMode}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                          </button>

                          {/* Search Modes Popover Menu */}
                          {isSearchModeMenuOpen && (
                            <div className="absolute left-0 bottom-10 bg-[#1e1f20] border border-neutral-700/80 rounded-2xl p-2 shadow-2xl w-60 text-xs text-neutral-200 z-50 space-y-1 animate-in fade-in">
                              <button
                                onClick={() => {
                                  setSelectedSearchMode('Search');
                                  setIsSearchModeMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Search className="w-4 h-4 text-neutral-400" />
                                  <span>Search</span>
                                </div>
                                {selectedSearchMode === 'Search' && <Check className="w-4 h-4 text-cyan-400" />}
                              </button>

                              <button
                                onClick={() => {
                                  handleOpenModal('deep-research');
                                  setIsSearchModeMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left opacity-90"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Telescope className="w-4 h-4 text-neutral-400" />
                                  <span>Deep research</span>
                                </div>
                                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                              </button>

                              <button
                                onClick={() => {
                                  handleOpenModal('model-council');
                                  setIsSearchModeMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left opacity-90"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Gavel className="w-4 h-4 text-neutral-400" />
                                  <span>Model council</span>
                                  <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-700">Max</span>
                                </div>
                                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                              </button>

                              <button
                                onClick={() => {
                                  handleOpenModal('learn-step-by-step');
                                  setIsSearchModeMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                              >
                                <BookOpen className="w-4 h-4 text-neutral-400" />
                                <span>Learn step by step</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Computer Mode Button */}
                        <button
                          onClick={() => {
                            setIsComputerActive(!isComputerActive);
                            handleOpenModal('computer');
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                            isComputerActive 
                              ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
                              : 'bg-[#262626] border-neutral-700/60 text-neutral-200 hover:bg-neutral-800'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          <span>Computer</span>
                        </button>
                      </div>

                      {/* Right Input Actions */}
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Active AI Engine" />

                        {/* Model Selector Dropdown (Screenshot 4) */}
                        <div className="relative">
                          <button
                            onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
                            className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-neutral-800 rounded-xl text-neutral-300 text-xs font-medium transition-colors"
                          >
                            <span>Model</span>
                            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                          </button>

                          {/* Model List Popover (Screenshot 4) */}
                          {isModelPickerOpen && (
                            <div className="absolute right-0 bottom-10 bg-[#1e1f20] border border-neutral-700/80 rounded-2xl p-2.5 shadow-2xl w-64 text-xs text-neutral-200 z-50 space-y-1.5 animate-in fade-in max-h-[320px] overflow-y-auto">
                              <div
                                onClick={() => {
                                  handleOpenModal('models-locked');
                                  setIsModelPickerOpen(false);
                                }}
                                className="p-2 bg-[#282a2c] hover:bg-neutral-700/60 rounded-xl border border-neutral-700/60 text-cyan-300 font-medium flex items-center justify-between cursor-pointer"
                              >
                                <span>Access the top AI models</span>
                                <ChevronRight className="w-4 h-4 text-cyan-400" />
                              </div>

                              <div className="space-y-0.5 pt-1">
                                {[
                                  { name: 'Sonar 2', badge: '' },
                                  { name: 'GPT-5.6 Terra', badge: '' },
                                  { name: 'GPT-5.6 Sol', badge: 'Max' },
                                  { name: 'Gemini 3.1 Pro', badge: '' },
                                  { name: 'Claude Sonnet 5', badge: '' },
                                  { name: 'Claude Opus 5', badge: 'Max' },
                                  { name: 'GLM 5.2', badge: '' },
                                  { name: 'Kimi K2.6', badge: '' },
                                  { name: 'Grok 4.5', badge: '' },
                                  { name: 'Nemotron 2 Ultra', badge: '' },
                                ].map((m, mIdx) => (
                                  <button
                                    key={mIdx}
                                    onClick={() => {
                                      handleOpenModal('models-locked');
                                      setIsModelPickerOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-neutral-800 rounded-xl text-neutral-300 transition-colors text-left"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Sparkles className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                      <span className="truncate">{m.name}</span>
                                      {m.badge && (
                                        <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded border border-neutral-700">
                                          {m.badge}
                                        </span>
                                      )}
                                    </div>
                                    <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => alert('Mode input suara aktif.')}
                          className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-xl transition-colors"
                          title="Voice Input"
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleSearchSubmit()}
                          disabled={isSearching}
                          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-white text-neutral-900 font-bold flex items-center justify-center shadow-md transition-colors"
                          title="Submit Query"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Right Category Menu Popover (Screenshot 5) */}
                {isCategoryMenuOpen && (
                  <>
                    <div
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="absolute inset-0 z-40 bg-transparent"
                    />
                    <div className="absolute right-4 top-14 bg-[#1e1f20] border border-neutral-700/80 rounded-2xl p-2.5 shadow-2xl w-56 text-xs text-neutral-200 z-50 space-y-1 animate-in fade-in">
                      {[
                        { title: 'Discover', icon: Compass },
                        { title: 'Finance', icon: TrendingUp },
                        { title: 'Personal CFO', icon: Wallet },
                        { title: 'Health', icon: Heart },
                        { title: 'Academic', icon: GraduationCap },
                        { title: 'Patents', icon: Gavel },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              handleOpenModal('category-menu');
                              setIsCategoryMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                          >
                            <Icon className="w-4 h-4 text-neutral-400" />
                            <span>{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Bottom Left Account Menu Popover (Screenshot 6) */}
                {isAccountMenuOpen && (
                  <>
                    <div
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="absolute inset-0 z-40 bg-transparent"
                    />
                    <div className="absolute left-3 bottom-14 bg-[#1e1f20] border border-neutral-700/80 rounded-2xl p-3 shadow-2xl w-72 max-h-[500px] overflow-y-auto text-xs text-neutral-200 z-50 space-y-2 animate-in fade-in">
                      {/* Profile Card Header */}
                      <div className="p-2 bg-[#262626] rounded-xl border border-neutral-700/60 space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                            {userProfile.avatarText}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate text-xs">{userProfile.name}</p>
                            <p className="text-[10px] text-neutral-400 truncate">{userProfile.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-0.5 pt-1 border-t border-neutral-800">
                        <button
                          onClick={() => {
                            alert('Tambah akun baru.');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                        >
                          <Plus className="w-4 h-4 text-neutral-400" />
                          <span>Add account</span>
                        </button>

                        <button
                          onClick={() => {
                            handleOpenModal('account-settings');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Settings className="w-4 h-4 text-neutral-400" />
                            <span>All settings</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono">⇧⌘,</span>
                        </button>

                        <button
                          onClick={() => {
                            handleOpenModal('account-settings');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                        >
                          <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                          <span>Upgrade plan</span>
                        </button>

                        <button
                          onClick={() => {
                            alert('Mengunduh aplikasi desktop Perplexity...');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                        >
                          <Download className="w-4 h-4 text-neutral-400" />
                          <span>Install apps</span>
                        </button>

                        <button
                          onClick={() => {
                            alert('Tema Tampilan: System (Dark)');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Moon className="w-4 h-4 text-neutral-400" />
                            <span>Appearance</span>
                          </div>
                          <span className="text-[10px] text-neutral-400">System (Dark)</span>
                        </button>

                        <button
                          onClick={() => {
                            alert('Bantuan Perplexity AI');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <HelpCircle className="w-4 h-4 text-neutral-400" />
                            <span>Help</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                        </button>

                        <button
                          onClick={() => {
                            alert('Sesi keluar berhasil.');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 rounded-xl text-rose-400 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* FEATURE EXPLANATION MODAL (Matching ChatGPT/Gemini Modals) */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1e1f20] border border-neutral-700 rounded-2xl max-w-lg w-full p-6 text-neutral-100 shadow-2xl relative space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {activeModal.category}
                  </span>
                  {activeModal.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {activeModal.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  {activeModal.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
              <p className="text-neutral-200">{activeModal.description}</p>

              <div className="space-y-1.5 bg-[#262626] p-3 rounded-xl border border-neutral-700/60">
                <h4 className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                  <Check className="w-4 h-4 text-cyan-400" /> Fitur Kunci & Keunggulan:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-neutral-300 pl-1">
                  {activeModal.keyFeatures.map((feat, fIdx) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1 bg-[#141414] p-3 rounded-xl border border-neutral-800">
                <h4 className="font-bold text-neutral-200 text-[11px]">Cara Menggunakan:</h4>
                <p className="text-neutral-400 italic text-[11px]">{activeModal.howToUse}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-900 dark:text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
