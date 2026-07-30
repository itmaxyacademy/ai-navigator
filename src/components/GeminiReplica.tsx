import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Image as ImageIcon,
  Grid,
  Gem,
  BookOpen,
  Plus,
  Settings,
  User,
  Paperclip,
  HardDrive,
  Music,
  Layout,
  Brain,
  Check,
  Mic,
  Activity,
  FileText,
  HelpCircle,
  X,
  ChevronRight,
  Monitor,
  Smartphone,
  Zap,
  Sliders,
  Globe,
  MapPin,
  Send,
  RotateCcw,
  Bot,
  ExternalLink,
  Shield,
  Clock,
  Download,
  Share2,
  Lock,
  Cpu,
  Layers,
  Sparkle,
  PanelLeft,
  Smile,
  RefreshCw,
  Link,
  Sun,
  Moon,
  CreditCard,
  MessageSquare,
  Upload
} from 'lucide-react';

interface GeminiFeatureModalInfo {
  title: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  keyFeatures: string[];
  examplePrompt?: string;
}

export const GeminiReplica: React.FC = () => {
  // View mode: 'desktop' or 'mobile'
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Active Dropdowns & Menus
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'Dark' | 'Light' | 'System'>('Light');

  // Active Selected Model
  const [selectedModel, setSelectedModel] = useState<'3.5 Flash-Lite' | '3.6 Flash' | '3.1 Pro' | 'Extended thinking'>('3.6 Flash');

  // Input & Messages
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'gemini'; text: string; modelUsed?: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modal State for Feature Explanations
  const [activeModal, setActiveModal] = useState<GeminiFeatureModalInfo | null>(null);

  // Fictional Indonesian Recent Conversations for Maxy Academy
  const recentChats = [
    'Pengembangan Komik Jakarta Dungeon',
    'Frosted Glass Theme Components Overview',
    'Kurikulum Bahasa Inggris Pemula ala Duolingo',
    'Draf Kurikulum Bahasa Inggris Pemula',
    'Building a Duolingo AI Tutor',
    'AI Dev Team for Game Creation',
    'Riset Pasar & Competitor Intelligence',
    'Analisis Data Penjualan Q2 Maxy Academy',
  ];

  // Feature Explanation Dictionary
  const featureExplanations: Record<string, GeminiFeatureModalInfo> = {
    'search-chats': {
      title: 'Search Chats (Pencarian Riwayat)',
      badge: 'Navigasi Cerdas',
      icon: <Search className="w-6 h-6 text-blue-400" />,
      description: 'Fitur untuk mencari percakapan lama Anda secara instan berdasarkan kata kunci, topik, atau berkas yang pernah Anda lampirkan.',
      keyFeatures: [
        'Pencarian teks semantik cerdas.',
        'Pencarian berkas atau instruksi khusus secara cepat.',
        'Mengelompokkan hasil berdasarkan tanggal dan relevansi.'
      ],
      examplePrompt: 'Ketik kata kunci seperti "Duolingo" atau "Komik" di bilah pencarian.'
    },
    'images': {
      title: 'Imagen 3 (Penghasil Gambar AI)',
      badge: 'Multimodal Generative',
      icon: <ImageIcon className="w-6 h-6 text-purple-400" />,
      description: 'Model pembuat gambar terbaru dari Google DeepMind yang menghasilkan ilustrasi, foto fotorealistik, dan elemen desain dengan detail luar biasa.',
      keyFeatures: [
        'Render teks pada gambar yang sangat jernih.',
        'Kemampuan memahami gaya artistik (fotografi, lukisan, 3D render).',
        'Generasi gambar aman dan bebas artefak.'
      ],
      examplePrompt: 'Buatkan gambar seekor kucing astronot membaca buku di permukaan bulan, gaya ilustrasi digital 3D.'
    },
    'library': {
      title: 'Gemini Library (Pustaka Dokumen)',
      badge: 'Pustaka Terpusat',
      icon: <Grid className="w-6 h-6 text-emerald-400" />,
      description: 'Pusat penyimpanan semua berkas, hasil penelitian, draf tulisan, dan gambar yang pernah Anda buat bersama Gemini.',
      keyFeatures: [
        'Akses cepat ke berkas hasil olahan AI.',
        'Sinkronisasi otomatis dengan Google Drive.',
        'Pencarian berkas berdasarkan jenis dokumen.'
      ]
    },
    'gems': {
      title: 'Gemini Gems (Asisten AI Spesialis)',
      badge: 'Personalized AI',
      icon: <Gem className="w-6 h-6 text-amber-400" />,
      description: 'Gems adalah versi kustom dari Gemini yang dikonfigurasi untuk menjadi pakar dalam peran tertentu, seperti Coding Partner, Writing Coach, atau Brainstormer.',
      keyFeatures: [
        'Dapat diberi instruksi dasar dan berkas pengetahuan khusus.',
        'Dapat dipanggil kapan saja untuk tugas berulang.',
        'Dapat dibagikan ke anggota tim.'
      ],
      examplePrompt: 'Gunakan Gem "Code Tutor" untuk meninjau efisiensi kode JavaScript Anda.'
    },
    'notebooks': {
      title: 'Gemini Notebooks / NotebookLM',
      badge: 'Riset & Sintesis',
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
      description: 'Ruang kerja penelitian berbasis AI yang didesain untuk menganalisis puluhan berkas PDF, catatan, dan artikel secara bersamaan tanpa halusinasi.',
      keyFeatures: [
        'Membuat ringkasan eksekutif dan lembar fakta (Fact Sheet) otomatis.',
        'Setiap jawaban disertai sitasi kutipan sumber berkas asli.',
        'Generasi rangkuman Audio Podcast otomatis.'
      ]
    },
    'drive': {
      title: 'Integrasi Google Drive (@Drive)',
      badge: 'Ekosistem Workspace',
      icon: <HardDrive className="w-6 h-6 text-emerald-400" />,
      description: 'Menghubungkan Gemini secara langsung ke berkas Google Drive Anda (Google Docs, Sheets, Slide, PDF) untuk dianalisis tanpa perlu mengunduh berkas.',
      keyFeatures: [
        'Akses langsung berkas pribadi atau tim dengan izin aman.',
        'Dapat membaca spreadsheet besar dan membuat rangkuman.',
        'Merekap isi puluhan dokumen dalam hitungan detik.'
      ],
      examplePrompt: '@Drive Baca dokumen "Kurikulum 2026.docx" dan buatkan 5 poin kesimpulannya.'
    },
    'create-image': {
      title: 'Create Image (Imagen 3)',
      badge: 'Alat Visual',
      icon: <ImageIcon className="w-6 h-6 text-pink-400" />,
      description: 'Membuat visualisasi karya seni, spanduk, atau konsep visual unik secara langsung di dalam ruang chat.',
      keyFeatures: [
        'Dukungan berbagai aspek rasio (1:1, 16:9, 9:16).',
        'Pencahayaan realistis dan tekstur fisik tajam.'
      ]
    },
    'create-music': {
      title: 'Create Music (Google Lyria)',
      badge: 'Audio Generative',
      icon: <Music className="w-6 h-6 text-indigo-400" />,
      description: 'Teknologi musik generative buatan Google yang mampu merancang melodi, instrumen, dan lagu latar berdasarkan suasana hati (mood).',
      keyFeatures: [
        'Generasi instrumen latar untuk video & presentasi.',
        'Penyesuaian tempo, genre, dan nuansa musik.'
      ]
    },
    'canvas': {
      title: 'Gemini Canvas (Ruang Kerja Kode & Teks)',
      badge: 'Ruang Kerja Interaktif',
      icon: <Layout className="w-6 h-6 text-blue-400" />,
      description: 'Panel terpisah berdampingan yang memungkinkan pengguna dan AI menyunting draf tulisan atau baris kode secara bertahap bersama-sama.',
      keyFeatures: [
        'Editor teks & kode interaktif side-by-side.',
        'Saran perbaikan dan pintasan pengeditan cepat.',
        'Ekspor langsung ke Google Docs atau Google Colab.'
      ]
    },
    'deep-research': {
      title: 'Deep Research (Riset Mendalam)',
      badge: 'Pencarian Otonom',
      icon: <Brain className="w-6 h-6 text-violet-400" />,
      description: 'Agen riset mandiri yang menjelajahi puluhan sumber web, membaca laporan teknis, dan menyusun laporan riset komprehensif dalam beberapa menit.',
      keyFeatures: [
        'Pencarian multi-langkah otonom.',
        'Pembuatan laporan riset berstruktur lengkap dengan rujukan.',
        'Analisis kompetitor dan tren industri terkini.'
      ]
    },
    'model-flash-lite': {
      title: 'Gemini 3.5 Flash-Lite',
      badge: 'Super Cepat & Ringan',
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      description: 'Varian Gemini yang dirancang khusus untuk kecepatan respons maksimal dan tugas-tugas ringan dengan latensi paling rendah.',
      keyFeatures: [
        'Waktu tunggu respons nyaris nol detik.',
        'Ideal untuk percakapan singkat, terjemahan instan, dan klasifikasi teks.'
      ]
    },
    'model-flash': {
      title: 'Gemini 3.6 Flash',
      badge: 'All-Around Standard',
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      description: 'Model standar serbaguna Google yang menyeimbangkan kecepatan luar biasa dengan penalaran multimodal cerdas.',
      keyFeatures: [
        'Kapasitas konteks hingga 1 juta+ token.',
        'Kecepatan tinggi untuk penggunaan harian, koding, dan pengolahan gambar.'
      ]
    },
    'model-pro': {
      title: 'Gemini 3.1 Pro',
      badge: 'Advanced Reasoning & Math',
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      description: 'Model flagship Google untuk masalah matematika rumit, logika tingkat tinggi, dan pemrograman arsitektur sistem kompleks.',
      keyFeatures: [
        'Penalaran logika mutakhir.',
        'Kemampuan koding dan analisis data numerik terbaik di kelasnya.'
      ]
    },
    'model-thinking': {
      title: 'Extended Thinking Mode',
      badge: 'Deep Reasoning Engine',
      icon: <Brain className="w-6 h-6 text-rose-400" />,
      description: 'Mode penalaran berpikir mendalam (Chain-of-Thought) di mana Gemini secara internal mengevaluasi berbagai kemungkinan sebelum memberikan jawaban.',
      keyFeatures: [
        'Pemecahan masalah kalkulus, fisika, dan algoritma tingkat tinggi.',
        'Meminimalkan kesalahan logika dan halusinasi.'
      ]
    },
    'personal-intelligence': {
      title: 'Personal Intelligence (Kecerdasan Personal)',
      badge: 'Personalisasi AI',
      icon: <User className="w-6 h-6 text-cyan-400" />,
      description: 'Mengatur bagaimana Gemini mengenal preferensi, latar belakang profesional, dan gaya komunikasi Anda.',
      keyFeatures: [
        'Gemini mengingat preferensi gaya jawaban favorit Anda.',
        'Pengaturan privasi dan kontrol memori yang transparan.'
      ]
    },
    'import-memory': {
      title: 'Import Memory to Gemini',
      badge: 'Fitur Baru',
      icon: <Download className="w-6 h-6 text-amber-400" />,
      description: 'Memungkinkan Anda mengimpor catatan preferensi atau profil Anda dari aplikasi lain agar Gemini langsung mengenal kebiasaan kerja Anda.',
      keyFeatures: [
        'Migrasi memori instan tanpa perlu setting dari awal.',
        'Privasi penuh dan kontrol atas data yang diimpor.'
      ]
    },
    'location': {
      title: 'Location Context (Surabaya, Jawa Timur)',
      badge: 'Konteks Geografis',
      icon: <MapPin className="w-6 h-6 text-rose-400" />,
      description: 'Gemini memanfaatkan konteks lokasi Anda secara aman untuk memberikan rekomendasi tempat, cuaca, dan info lokal yang tepat sasaran.',
      keyFeatures: [
        'Rekomendasi rute, restoran, dan tempat kerja lokal.',
        'Jawaban yang relevan dengan zona waktu dan aturan lokal.'
      ]
    }
  };

  const handleOpenModal = (key: string) => {
    if (featureExplanations[key]) {
      setActiveModal(featureExplanations[key]);
    } else {
      setActiveModal({
        title: 'Fitur Gemini Simulator',
        badge: 'Eksplorasi Interaktif',
        icon: <Sparkles className="w-6 h-6 text-blue-400" />,
        description: 'Fitur ini disimulasikan untuk memberikan gambaran pengalaman langsung menggunakan antarmuka Google Gemini secara nyata.',
        keyFeatures: [
          'Navigasi antarmuka bersih & responsif.',
          'Model multimodal cerdas bawaan Google.',
          'Integrasi ekosistem Google Workspace.'
        ]
      });
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userText = inputValue;
    setInputValue('');

    const newMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: newMsgId, sender: 'user', text: userText }]);
    setIsGenerating(true);

    setTimeout(() => {
      let replyText = '';
      if (userText.toLowerCase().includes('drive') || userText.includes('@Drive')) {
        replyText = ' Saya telah mengakses Google Drive Maxy Academy. Berkas **"Draf Kurikulum Bahasa Inggris Pemula"** telah dianalisis dan siap diproses lebih lanjut!';
      } else if (userText.toLowerCase().includes('gambar') || userText.toLowerCase().includes('image')) {
        replyText = ' Menggunakan **Imagen 3**, saya telah menghasilkan konsep ilustrasi visual berkualitas tinggi sesuai permintaan Anda!';
      } else {
        replyText = `Halo Maxy Academy! Sebagai Google Gemini dengan model **${selectedModel}**, saya siap membantu Anda menyelesaikan tugas, koding, riset, maupun penulisan ide kreatif secara instan.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'gemini',
          text: replyText,
          modelUsed: selectedModel,
        },
      ]);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="w-full bg-[#131314] text-neutral-200 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col font-sans select-none">
      {/* ========================================================= */}
      {/* TOP CONTROL BAR (View Mode Toggle & App Header) */}
      {/* ========================================================= */}
      <div className="bg-[#1e1f20] border-b border-neutral-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-neutral-400 z-10">
        <div className="flex items-center gap-2">
          {/* Gemini Spark Logo */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-400 to-amber-300 flex items-center justify-center p-0.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          </div>
          <span className="font-semibold text-neutral-200 text-sm tracking-tight flex items-center gap-1.5">
            Gemini Simulator <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">Google AI</span>
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-neutral-900/90 rounded-lg p-0.5 border border-neutral-700/60">
          <button
            onClick={() => {
              setViewMode('desktop');
              setIsMobileSidebarOpen(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'desktop' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'mobile' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN CONTAINER (DESKTOP / MOBILE CONTAINER) */}
      {/* ========================================================= */}
      <div
        className={`relative w-full overflow-hidden transition-all duration-300 flex ${
          viewMode === 'mobile' ? 'max-w-sm mx-auto my-4 rounded-3xl border-2 border-neutral-700 h-[620px] shadow-2xl' : 'h-[620px]'
        }`}
      >
        {/* ========================================================= */}
        {/* MOBILE HEADER (Only when viewMode === 'mobile') */}
        {/* ========================================================= */}
        {viewMode === 'mobile' && (
          <div className="absolute top-0 left-0 right-0 h-13 bg-[#1e1f20]/95 backdrop-blur-md border-b border-neutral-800/80 px-3 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <div className="w-4 h-3.5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-neutral-300 rounded-full"></span>
                  <span className="w-full h-0.5 bg-neutral-300 rounded-full"></span>
                  <span className="w-full h-0.5 bg-neutral-300 rounded-full"></span>
                </div>
              </button>
              
              {/* Model Picker Trigger on Mobile */}
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800/90 text-neutral-200 hover:bg-neutral-700/80 transition-colors"
              >
                <span>Gemini {selectedModel}</span>
                <ChevronRight className="w-3 h-3 rotate-90 text-neutral-400" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages([])}
                className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {/* Avatar Profile */}
              <button
                onClick={() => setIsSettingsMenuOpen(true)}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-[11px] font-bold border border-amber-400/40"
              >
                MA
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SIDEBAR (DESKTOP PERSISTENT / MOBILE SLIDE-OUT) */}
        {/* ========================================================= */}
        <aside
          className={`
            ${
              viewMode === 'mobile'
                ? `absolute inset-y-0 left-0 z-40 w-72 bg-[#1e1f20] border-r border-neutral-800 transform transition-transform duration-300 ease-in-out ${
                    isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  }`
                : isSidebarCollapsed
                ? 'w-0 overflow-hidden border-none opacity-0 transition-all duration-300'
                : 'w-64 bg-[#1e1f20] border-r border-neutral-800/80 flex-shrink-0 flex flex-col justify-between transition-all duration-300'
            }
          `}
        >
          {/* Top Section */}
          <div className="p-3 space-y-3 overflow-y-auto flex-1">
            {/* Header / Brand in Sidebar */}
            <div className="flex items-center justify-between px-2 pt-1 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-400 to-amber-300 flex items-center justify-center p-0.5">
                  <Sparkles className="w-4 h-4 text-black fill-black" />
                </div>
                <span className="font-semibold text-sm tracking-tight text-neutral-100">Gemini</span>
              </div>
              {viewMode === 'mobile' ? (
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Collapse Sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* New Chat Button */}
            <button
              onClick={() => {
                setMessages([]);
                if (viewMode === 'mobile') setIsMobileSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#282a2c] hover:bg-neutral-700/80 text-neutral-200 transition-colors font-medium text-xs shadow-sm border border-neutral-700/50"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>New chat</span>
            </button>

            {/* Navigation List */}
            <div className="space-y-0.5 text-xs pt-1">
              <button
                onClick={() => handleOpenModal('search-chats')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
                  <span>Search chats</span>
                </div>
              </button>

              <button
                onClick={() => handleOpenModal('images')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-neutral-400 group-hover:text-purple-400" />
                  <span>Images</span>
                </div>
              </button>

              <button
                onClick={() => handleOpenModal('library')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400" />
                  <span>Library</span>
                </div>
              </button>

              <button
                onClick={() => handleOpenModal('gems')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Gem className="w-4 h-4 text-neutral-400 group-hover:text-amber-400" />
                  <span>Gems</span>
                </div>
              </button>

              <button
                onClick={() => handleOpenModal('notebooks')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-neutral-400 group-hover:text-cyan-400" />
                  <span>Notebooks</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>

            {/* Recents Section */}
            <div className="pt-3 border-t border-neutral-800/80">
              <div className="px-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Recents</span>
              </div>
              <div className="space-y-0.5 text-xs">
                {recentChats.map((title, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMessages([
                        {
                          id: '1',
                          sender: 'user',
                          text: `Tunjukkan progres tentang "${title}"`,
                        },
                        {
                          id: '2',
                          sender: 'gemini',
                          text: `Berikut adalah analisis lengkap dan draf terbaru untuk proyek **${title}** milik Maxy Academy!`,
                        },
                      ]);
                      if (viewMode === 'mobile') setIsMobileSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition-colors text-left truncate"
                  >
                    <span className="truncate">{title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Profile Bar */}
          <div className="p-3 border-t border-neutral-800/80 bg-[#1e1f20]">
            <button
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-[11px] font-bold border border-amber-400/40 flex-shrink-0">
                  MA
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-neutral-200 truncate">Maxy Academy</div>
                  <div className="text-[10px] text-neutral-500 truncate">maxyacademy.one@gmail.com</div>
                </div>
              </div>
              <Settings className="w-4 h-4 text-neutral-400 flex-shrink-0 hover:text-neutral-200" />
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay Backdrop */}
        {viewMode === 'mobile' && isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
          />
        )}

        {/* ========================================================= */}
        {/* MAIN CANVAS AREA */}
        {/* ========================================================= */}
        <main className={`flex-1 bg-[#131314] flex flex-col relative overflow-hidden ${viewMode === 'mobile' ? 'pt-13' : ''}`}>
          {/* Top Left Sidebar Expand Toggle (Desktop Only when collapsed) */}
          {viewMode === 'desktop' && isSidebarCollapsed && (
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl bg-[#1e1f20] hover:bg-neutral-800 border border-neutral-800 shadow-md transition-colors"
                title="Expand Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top Bar Right (Upgrade Button & Profile - Desktop Only) */}
          {viewMode === 'desktop' && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
              <button
                onClick={() => handleOpenModal('import-memory')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium shadow-md hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Upgrade</span>
              </button>
              <button
                onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-md hover:ring-2 hover:ring-amber-400/50 transition-all"
              >
                MA
              </button>
            </div>
          )}

          {/* Central Workspace / Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center relative">
            {/* Background Gradient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-900/10 to-transparent pointer-events-none" />

            {messages.length === 0 ? (
              /* Empty State (Greeting) */
              <div className="w-full max-w-2xl mx-auto text-center space-y-6 z-10 animate-in fade-in duration-300">
                {/* Multicolored Gemini Starburst */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-amber-400 p-0.5 shadow-xl shadow-indigo-500/10">
                  <div className="w-full h-full bg-[#131314] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-normal text-neutral-100 tracking-tight">
                  What's next, <span className="font-semibold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Maxy Academy</span>?
                </h1>

                {/* Quick Suggestion Pills */}
                <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
                  <button
                    onClick={() => {
                      setInputValue('@Drive Analisis draf kurikulum koding terbaru');
                    }}
                    className="px-3 py-2 rounded-xl bg-[#1e1f20] hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center gap-1.5"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span>@Drive Kurikulum</span>
                  </button>
                  <button
                    onClick={() => {
                      setInputValue('Buatkan gambar ilustrasi AI Tutor dengan Imagen 3');
                    }}
                    className="px-3 py-2 rounded-xl bg-[#1e1f20] hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>Buat Gambar AI</span>
                  </button>
                  <button
                    onClick={() => {
                      setInputValue('Lakukan Deep Research tentang tren AI 2026');
                    }}
                    className="px-3 py-2 rounded-xl bg-[#1e1f20] hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center gap-1.5"
                  >
                    <Brain className="w-3.5 h-3.5 text-violet-400" />
                    <span>Deep Research</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Conversation Stream */
              <div className="w-full max-w-2xl space-y-4 z-10 py-4 my-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'gemini' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-black flex-shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#282a2c] text-neutral-100 rounded-br-none border border-neutral-700/60'
                          : 'bg-[#1e1f20] text-neutral-200 rounded-bl-none border border-neutral-800'
                      }`}
                    >
                      {msg.modelUsed && (
                        <div className="text-[10px] text-blue-400 font-mono mb-1 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Gemini {msg.modelUsed}</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex gap-3 items-center text-xs text-neutral-400 animate-pulse">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Gemini sedang berpikir...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* INPUT PROMPT BAR & TOOLS ("Ask Gemini") */}
          {/* ========================================================= */}
          <div className="p-3 sm:p-4 z-10 bg-[#131314] border-t border-neutral-800/40">
            <form
              onSubmit={handleSendMessage}
              className="relative w-full max-w-2xl mx-auto bg-[#1e1f20] rounded-2xl sm:rounded-3xl border border-neutral-700/70 p-2 sm:p-2.5 shadow-xl flex items-center justify-between gap-2 focus-within:border-blue-500/70 transition-colors"
            >
              {/* Plus Button for Attachments & Tools */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                  className="w-8 h-8 rounded-full bg-[#282a2c] hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors"
                  title="Uploads & Tools"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Tools Popup Menu */}
                {isToolsMenuOpen && (
                  <div className="absolute bottom-11 left-0 z-50 w-56 bg-[#1e1f20] border border-neutral-700 rounded-2xl shadow-2xl p-1.5 space-y-0.5 text-xs animate-in fade-in slide-in-from-bottom-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenModal('library');
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:bg-neutral-800 text-left"
                    >
                      <Paperclip className="w-4 h-4 text-blue-400" />
                      <span>Upload files</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenModal('drive');
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:bg-neutral-800 text-left"
                    >
                      <HardDrive className="w-4 h-4 text-emerald-400" />
                      <span>Add from Drive</span>
                    </button>
                    <div className="h-px bg-neutral-800 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenModal('create-image');
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:bg-neutral-800 text-left"
                    >
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                      <span>Create image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenModal('create-music');
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:bg-neutral-800 text-left"
                    >
                      <Music className="w-4 h-4 text-indigo-400" />
                      <span>Create music</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenModal('canvas');
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:bg-neutral-800 text-left"
                    >
                      <Layout className="w-4 h-4 text-cyan-400" />
                      <span>Canvas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenModal('deep-research');
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:bg-neutral-800 text-left"
                    >
                      <Brain className="w-4 h-4 text-violet-400" />
                      <span>Deep research</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Input Text Field */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Gemini"
                className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none px-1"
              />

              {/* Right Input Controls */}
              <div className="flex items-center gap-1.5 relative">
                {/* Status Dot */}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />

                {/* Model Dropdown Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#282a2c] hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors border border-neutral-700/50"
                  >
                    <span>{selectedModel}</span>
                    <ChevronRight className="w-3 h-3 rotate-90 text-neutral-400" />
                  </button>

                  {/* Model Dropdown List */}
                  {isModelDropdownOpen && (
                    <div className="absolute bottom-10 right-0 z-50 w-64 bg-[#1e1f20] border border-neutral-700 rounded-2xl shadow-2xl p-2 space-y-1 text-xs animate-in fade-in slide-in-from-bottom-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModel('3.5 Flash-Lite');
                          setIsModelDropdownOpen(false);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-neutral-800 text-left flex items-start justify-between"
                      >
                        <div>
                          <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                            <span>3.5 Flash-Lite</span>
                            <span className="text-[9px] bg-neutral-700 text-neutral-300 px-1 py-0.2 rounded font-mono">New</span>
                          </div>
                          <div className="text-[10px] text-neutral-400">Fastest answers</div>
                        </div>
                        {selectedModel === '3.5 Flash-Lite' && <Check className="w-4 h-4 text-blue-400 mt-0.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModel('3.6 Flash');
                          setIsModelDropdownOpen(false);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-neutral-800 text-left flex items-start justify-between"
                      >
                        <div>
                          <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                            <span>3.6 Flash</span>
                            <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-mono">New</span>
                          </div>
                          <div className="text-[10px] text-neutral-400">All-around help</div>
                        </div>
                        {selectedModel === '3.6 Flash' && <Check className="w-4 h-4 text-blue-400 mt-0.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModel('3.1 Pro');
                          setIsModelDropdownOpen(false);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-neutral-800 text-left flex items-start justify-between"
                      >
                        <div>
                          <div className="font-semibold text-neutral-200">3.1 Pro</div>
                          <div className="text-[10px] text-neutral-400">Advanced math & code</div>
                        </div>
                        {selectedModel === '3.1 Pro' && <Check className="w-4 h-4 text-blue-400 mt-0.5" />}
                      </button>

                      <div className="h-px bg-neutral-800 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModel('Extended thinking');
                          setIsModelDropdownOpen(false);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-neutral-800 text-left flex items-start justify-between"
                      >
                        <div>
                          <div className="font-semibold text-neutral-200">Extended thinking</div>
                          <div className="text-[10px] text-neutral-400">Complex problem solving</div>
                        </div>
                        {selectedModel === 'Extended thinking' && <Check className="w-4 h-4 text-blue-400 mt-0.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Mic / Send Button */}
                {inputValue.trim() ? (
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenModal('search-chats')}
                    className="w-8 h-8 rounded-full bg-[#282a2c] hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors"
                  >
                    <Mic className="w-4 h-4 text-blue-400" />
                  </button>
                )}
              </div>
            </form>
          </div>
          {/* FLOATING SETTINGS POPOVER MENU (Anchored above settings button / inside frame) */}
          {isSettingsMenuOpen && (
            <>
              {/* Click-outside backdrop overlay */}
              <div
                onClick={() => {
                  setIsSettingsMenuOpen(false);
                  setIsThemeSubmenuOpen(false);
                }}
                className="absolute inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
              />

              {/* Floating Popover Menu Card */}
              <div
                className={`absolute z-50 bg-[#1e1f20] border border-neutral-700/80 rounded-[22px] shadow-2xl p-2.5 max-h-[500px] overflow-y-auto text-xs text-neutral-200 animate-in fade-in zoom-in-95 duration-150 ${
                  viewMode === 'mobile'
                    ? 'bottom-2 left-2 right-2 w-[calc(100%-16px)]'
                    : 'bottom-16 left-3 w-72'
                }`}
              >
                {/* Menu List matching uploaded screenshots */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      handleOpenModal('search-chats');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>Activity</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenModal('personal-intelligence');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>Personal Intelligence</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenModal('import-memory');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Upload className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="truncate">Import memory to Gemini</span>
                    </div>
                    <span className="text-[10px] bg-neutral-700 text-neutral-200 px-2 py-0.5 rounded-full font-medium shrink-0">New</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Avatar profil diperbarui.');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <Smile className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>Avatar</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Batas penggunaan: Aktif.');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>Usage limits</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenModal('gems');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <Gem className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Gems</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Tidak ada tautan publik.');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <Link className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>Your public links</span>
                  </button>

                  {/* Theme Selector with Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsThemeSubmenuOpen(!isThemeSubmenuOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Sun className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span>Theme</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isThemeSubmenuOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Submenu Popover for Theme (System, Light, Dark) */}
                    {isThemeSubmenuOpen && (
                      <div className={viewMode === 'mobile' 
                        ? "ml-7 my-1 p-1 bg-[#282a2c] rounded-xl border border-neutral-700/80 space-y-0.5 animate-in fade-in"
                        : "absolute left-[calc(100%+6px)] bottom-0 bg-[#1e1f20] border border-neutral-700/80 rounded-2xl p-1.5 shadow-2xl w-32 space-y-0.5 z-50 animate-in fade-in"
                      }>
                        <button
                          onClick={() => {
                            setActiveTheme('System');
                            setIsThemeSubmenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-neutral-800 text-xs text-neutral-200 transition-colors"
                        >
                          <span>System</span>
                          {activeTheme === 'System' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </button>
                        <button
                          onClick={() => {
                            setActiveTheme('Light');
                            setIsThemeSubmenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-neutral-800 text-xs text-neutral-200 transition-colors"
                        >
                          <span>Light</span>
                          {activeTheme === 'Light' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </button>
                        <button
                          onClick={() => {
                            setActiveTheme('Dark');
                            setIsThemeSubmenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-neutral-800 text-xs text-neutral-200 transition-colors"
                        >
                          <span>Dark</span>
                          {activeTheme === 'Dark' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      handleOpenModal('import-memory');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <CreditCard className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>View subscriptions</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenModal('notebooks');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Gemini Notebook</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Terima kasih atas masukan Anda!');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <MessageSquare className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>Send feedback</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Pusat Bantuan Google Gemini');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span>Help</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>

                {/* Bottom Location Section */}
                <div className="mt-1 pt-2 border-t border-neutral-700/60 px-3 pb-1 text-xs text-neutral-300 space-y-0.5">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                    <span className="truncate">Surabaya, East Java, Indonesia</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 pl-3.5">
                    Based on your places (Work)
                  </div>
                  <button
                    onClick={() => {
                      alert('Lokasi telah diperbarui ke Surabaya, East Java, Indonesia');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="text-[10px] text-neutral-300 hover:underline pl-3.5 pt-0.5 font-medium block"
                  >
                    Update location
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* EXPLANATORY FEATURE MODAL (Matching ChatGPT/Claude Modals) */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#1e1f20] border border-neutral-700 rounded-3xl shadow-2xl p-6 text-neutral-100 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-neutral-800 border border-neutral-700">
                  {activeModal.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-100">{activeModal.title}</h3>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                    {activeModal.badge}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-300 leading-relaxed">
              {activeModal.description}
            </p>

            {/* Key Features */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Keunggulan Utama:
              </div>
              <ul className="space-y-1">
                {activeModal.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example Prompt if present */}
            {activeModal.examplePrompt && (
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                <span className="text-[10px] text-neutral-400 block font-mono mb-1">Contoh Penggunaan Prompt:</span>
                <p className="text-blue-300 italic font-mono">"{activeModal.examplePrompt}"</p>
              </div>
            )}

            {/* Close / Try Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs hover:opacity-90 transition-opacity shadow-lg"
            >
              Paham, Lanjutkan Eksplorasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
