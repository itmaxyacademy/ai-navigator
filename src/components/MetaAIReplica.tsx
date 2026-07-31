import React, { useState, useEffect } from 'react';
import {
  Sparkles, Plus, Search, Image as ImageIcon, LayoutGrid, Paperclip, X,
  ChevronRight, Info, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown,
  Share2, ExternalLink, Settings, User, Smartphone, Laptop, Bell,
  Globe, LogOut, PanelLeft, Bot, Send, MoreVertical, Calendar,
  Dumbbell, Utensils, Mail, Play, Keyboard, Upload, HelpCircle,
  FileText, Clock, Zap, ShieldCheck, CheckSquare, Wand2, Eye
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
  sender: 'user' | 'meta';
  text: string;
  imageUrl?: string;
  modelUsed?: string;
  timestamp: string;
}

export const MetaAIReplica: React.FC = () => {
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Selected Mode / Instant Mode Toggle State
  const [selectedMode, setSelectedMode] = useState<'Instant' | 'Llama 3.3'>('Instant');

  // Active Category Chip Filter State
  const [activeChip, setActiveChip] = useState<string>('New');

  // Explanatory Modal State
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);

  // Media Modal Upload Tab State
  const [uploadTab, setUploadTab] = useState<'recent' | 'creations'>('recent');

  // Chat conversation state
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // User Profile Data
  const userProfile = {
    username: 'maxyacademy2026',
    name: 'Maxy Academy 2026',
    email: 'maxyacademy.one@gmail.com',
    avatarText: 'MA',
  };

  // Sample Images for "Add Media and Files" Modal (Matching Screenshots)
  const sampleUploads = [
    { id: '1', title: 'Maxy AI Hub Lounge', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80' },
    { id: '2', title: 'Ruang Diskusi Maxy', url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=300&q=80' },
    { id: '3', title: 'Co-Working Space', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80' },
    { id: '4', title: 'Maxy AI Office Interior', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80' },
    { id: '5', title: 'Character Sheet Batik A', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { id: '6', title: 'Character Sheet Batik B', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  ];

  const sampleCreations = [
    { id: 'c1', title: 'Meta Imagine Cyberpunk City', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
    { id: 'c2', title: 'Futuristic Sci-Fi Car', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=300&q=80' },
    { id: 'c3', title: 'Batik Modern Concept', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80' },
  ];

  // Comprehensive Modal Data Dictionary in Bahasa Indonesia
  const modalData: Record<string, ModalContent> = {
    'new-chat': {
      title: 'New Chat (Mulai Sesi Baru Meta AI)',
      category: 'Manajemen Obrolan',
      badge: 'Reset Sesi',
      description: 'Membuka sesi percakapan baru dengan Meta AI tanpa membawa histori atau konteks obrolan sebelumnya.',
      keyFeatures: [
        'Atur ulang memori percakapan untuk topik baru',
        'Respon yang bersih dari konteks diskusi lama',
        'Pintasan keyboard cepat: Shift + Cmd + O'
      ],
      howToUse: 'Klik menu "New chat" di sidebar atau gunakan tombol pintasan keyboard Shift + Cmd + O.'
    },
    'search': {
      title: 'Search (Pencarian Obrolan & Informasi)',
      category: 'Navigasi & Pencarian',
      badge: 'Cmd + K',
      description: 'Fitur pencarian cepat untuk menemukan topik percakapan lama di riwayat atau melakukan pencarian web berbasis Llama 3.3.',
      keyFeatures: [
        'Pencarian kata kunci instan di seluruh arsip pesan',
        'Integrasi dengan indeks pencarian web terkini',
        'Pintasan keyboard cepat: Cmd + K'
      ],
      howToUse: 'Klik "Search" di sidebar atau tekan tombol Cmd + K pada keyboard.'
    },
    'media': {
      title: 'Media (Galeri Berkas & Ilustrasi)',
      category: 'Manajemen Aset',
      badge: 'Media Library',
      description: 'Pusat galeri penyimpanan foto yang diunggah serta gambar hasil kreativitas Meta Imagine.',
      keyFeatures: [
        'Penyimpanan terorganisir untuk semua gambar yang diunggah',
        'Akses cepat ke hasil generasi foto Meta Imagine',
        'Kemudahan mengunduh atau membagikan kembali gambar ke sosial media'
      ],
      howToUse: 'Pilih "Media" di sidebar untuk melihat seluruh koleksi foto dan karya visual Anda.'
    },
    'artifacts': {
      title: 'Artifacts (Ruang Pratinjau Kode & Dokumen)',
      category: 'Produktivitas & Pengodean',
      badge: 'Interactive Output',
      description: 'Fitur untuk menampilkan hasil pengodean (HTML, React, CSS), dokumen markdown, dan diagram secara berdampingan di panel khusus.',
      keyFeatures: [
        'Pemisahan tampilan pesan chat dan pratinjau hasil karya',
        'Eksekusi dan render kode secara interaktif',
        'Kemudahan menyalin dan mengunduh berkas proyek'
      ],
      howToUse: 'Pilih menu "Artifacts" di sidebar untuk membuka manajer artefak dokumen dan kode.'
    },
    'scheduled': {
      title: 'Scheduled Tasks (Tugas Terjadwal & Pengingat)',
      category: 'Otomasi & Asisten',
      badge: 'Automation',
      description: 'Menjadwalkan instruksi Meta AI untuk mengeksekusi tugas rutin seperti ringkasan berita harian atau pengingat jadwal.',
      keyFeatures: [
        'Otomatisasi permintaan berulang secara harian/mingguan',
        'Pengiriman notifikasi langsung ke akun WhatsApp atau Instagram',
        'Manajemen rutinitas AI yang efisien'
      ],
      howToUse: 'Klik "Scheduled" untuk mengatur dan memantau tugas terencana Anda.'
    },
    'vibes': {
      title: 'Vibes / Vibes.ai (Generasi Konten Kreatif & Video)',
      category: 'Kreativitas & Tren',
      badge: 'Meta Creative Lab',
      description: 'Fitur eksperimental Meta AI untuk menghasilkan naskah video pendek (Reels/Shorts), tren ide visual, dan musik latar.',
      keyFeatures: [
        'Saran konsep video viral untuk Instagram Reels & TikTok',
        'Generasi ide visual atmosferik (Vibes)',
        'Pembuat cerita komik dan narasi visual'
      ],
      howToUse: 'Pilih "Vibes" di sidebar untuk menjelajahi laboratorium ide konten kreatif Meta.'
    },
    'history-1': {
      title: 'History: Panduan Lingkungan Maxy AI Hub',
      category: 'Riwayat Obrolan Fiksi',
      badge: 'Edukasi Maxy',
      description: 'Sesi obrolan fiksi mengenai panduan tata tertib, fasilitas co-working, dan penggunaan hub teknologi di Maxy Academy.',
      keyFeatures: [
        'Dokumentasi fasilitas belajar dan norma lingkungan',
        'Saran optimasi penggunaan AI dalam laboratorium',
        'Arsip diskusi yang tersimpan aman di cloud Meta'
      ],
      howToUse: 'Klik judul riwayat di sidebar kiri untuk memuat kembali isi percakapan.'
    },
    'history-2': {
      title: 'History: Storyboard Komik Maxy Academy',
      category: 'Riwayat Obrolan Fiksi',
      badge: 'Desain Kreatif',
      description: 'Sesi pembuatan alur cerita dan karakter komik edukasi Maxy Academy menggunakan bantuan Meta Imagine.',
      keyFeatures: [
        'Skenario komik edukasi per panel',
        'Generasi gambar karakter dalam busana Batik khas',
        'Format siap cetak dan siap unggah'
      ],
      howToUse: 'Klik pada riwayat "Storyboard Komik Maxy Academy" di sidebar.'
    },
    'instant-mode': {
      title: 'Mode Instant vs Llama 3.3',
      category: 'Pengaturan Mesin LLM',
      badge: 'Llama 3.3 70B',
      description: 'Pilihan mode pemrosesan Meta AI. Mode Instant memberikan jawaban ultra-cepat, sedangkan Llama 3.3 memberikan penalaran analitis mendalam.',
      keyFeatures: [
        'Instant: Kecepatan respon tinggi untuk percakapan harian',
        'Llama 3.3: Model terbuka tercanggih untuk coding, sains, dan analisa data',
        'Grounding data real-time berbasis ekosistem Meta & Bing'
      ],
      howToUse: 'Klik tombol mode di sudut kanan bawah kotak pesan untuk berpindah antara Instant dan Llama 3.3.'
    },
    'add-media-modal': {
      title: 'Add Media and Files (Unggah Berkas)',
      category: 'Input Multimodal',
      badge: 'Upload & Vision',
      description: 'Modal untuk mengunggah dokumen, foto, atau memilih dari riwayat unggahan sebelumnya untuk dianalisis oleh penglihatan AI Meta.',
      keyFeatures: [
        'Dukungan Drag & Drop berkas gambar, dokumen, dan tabel',
        'Akses cepat ke tab "Recent uploads" dan "Creations"',
        'Analisis visual OCR dan deskripsi objek dalam foto'
      ],
      howToUse: 'Klik tombol (+) di dalam kotak input obrolan untuk membuka jendela modal ini.'
    },
    'profile-menu': {
      title: 'Profile Menu maxyacademy2026',
      category: 'Pengaturan Akun Meta',
      badge: 'User Profile',
      description: 'Pusat identitas akun pengguna, akses ke preferensi privasi Meta AI, setelan pintasan keyboard, dan tautan ekosistem AI.',
      keyFeatures: [
        'Melihat profil & identitas akun Maxy Academy 2026',
        'Pengaturan pintasan keyboard (Cmd + /)',
        'Tautan langsung ke Vibes.ai, AI Demos, dan Identifikasi AI'
      ],
      howToUse: 'Klik pada nama akun "maxyacademy2026" di sudut kiri bawah sidebar untuk membuka menu ini.'
    },
    'ai-demos': {
      title: 'AI Demos & Meta AI Research',
      category: 'Inovasi & Riset Meta',
      badge: 'Meta FAIR Lab',
      description: 'Showcase demonstrasi teknologi AI terbaru buatan Meta Fundamental AI Research (FAIR) seperti Segment Anything dan Voicebox.',
      keyFeatures: [
        'Akses ke alat segmentasi objek foto otomatis',
        'Generasi rekaman suara sintetis ultra-natural',
        'Uji coba model open-source Llama versi paling mutakhir'
      ],
      howToUse: 'Pilih "AI Demos" dari menu profil pengguna.'
    },
    'ai-identification': {
      title: 'AI Identification & Watermarking (SynthID / C2PA)',
      category: 'Etika & Keamanan AI',
      badge: 'Transparency',
      description: 'Sistem penandaan watermark digital otomatis pada konten media yang dihasilkan oleh Meta AI untuk transparansi publik.',
      keyFeatures: [
        'Pendeteksian watermark tak kasat mata pada foto buatan AI',
        'Pencegahan disinformasi dan penyalahgunaan identitas sintetis',
        'Compliance dengan standar C2PA industri'
      ],
      howToUse: 'Akses menu "AI identification" untuk memeriksa keaslian karya media AI.'
    }
  };

  const handleOpenModal = (key: string) => {
    setActiveModalKey(key);
  };

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

    setTimeout(() => {
      let botResponse = `Halo **maxyacademy2026**! Saya adalah **Meta AI** ditenagai oleh model **Llama 3.3**.\n\n`;

      if (textToSend.toLowerCase().includes('workout') || textToSend.toLowerCase().includes('olahraga')) {
        botResponse += `Berikut adalah **Rencana Latihan Harian 20 Menit** (Tanpa Alat):\n\n1. **Jumping Jacks**: 3 Set x 45 Detik (Pemanasan Cardio)\n2. **Bodyweight Squats**: 3 Set x 15 Repetisi (Kekuatan Kaki)\n3. **Push-Ups / Kneeling Push-Ups**: 3 Set x 12 Repetisi (Dada & Tricep)\n4. **Plank Hold**: 3 Set x 45 Detik (Kekuatan Core)`;
      } else if (textToSend.toLowerCase().includes('recipe') || textToSend.toLowerCase().includes('resep')) {
        botResponse += `Resep **Smoothie High-Protein Muscle Recover**:\n- 1 Pisang Matang\n- 1 Scoop Protein Powder Vanila\n- 250ml Susu Almond / Kedelai\n- 1 Sdm Selai Kacang Alami\n- Es Batu secukupnya\n\n*Blender selama 45 detik hingga lembut dan nikmati setelah latihan!*`;
      } else if (textToSend.toLowerCase().includes('komik') || textToSend.toLowerCase().includes('storyboard')) {
        botResponse += `🎨 **Storyboard Komik Maxy Academy (Panel 1-3)**:\n\n**Panel 1**: Karakter Utama (Siswa Maxy) sedang menatap laptop di Co-Working Space Maxy AI Hub.\n**Panel 2**: Meta AI memberikan saran kode Llama 3.3 secara visual di layar.\n**Panel 3**: Siswa tersenyum gembira karena program berhasil dikompilasi!`;
      } else {
        botResponse += `Terima kasih atas instruksi Anda: *"${textToSend}"*.\n\nSebagai asisten AI cerdas berbasis **Llama 3.3 Open Source**, saya dapat membantu Anda menganalisis data, membuat draf konten media sosial untuk WhatsApp/Instagram, merancang naskah komik, hingga membuat ilustrasi instan melalui Meta Imagine. Ada yang ingin kita eksplorasi lebih jauh?`;
      }

      const metaMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'meta',
        text: botResponse,
        modelUsed: selectedMode === 'Instant' ? 'Llama 3.3 Instant' : 'Llama 3.3 Deep',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, metaMsg]);
      setIsTyping(false);
    }, 1100);
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
    <div className="relative rounded-2xl border border-[#27272a] bg-[#121214] text-slate-800 dark:text-slate-100 overflow-hidden shadow-2xl font-sans">
      {/* Top Header Bar for Simulator View Controls */}
      <div className="bg-[#18181b] border-b border-[#27272a] px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Meta Swirl Gradient Ring Icon */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-400 p-1 flex items-center justify-center animate-pulse">
            <div className="w-full h-full bg-[#18181b] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-purple-400 to-fuchsia-400" />
            </div>
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5">
            Meta AI Replica (Llama 3.3)
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 text-[10px]">
            Simulasi Edukasi Live
          </span>
        </div>

        {/* View Mode Switcher (Desktop View vs Mobile View) */}
        <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-[#27272a]">
          <button
            onClick={() => {
              setViewMode('desktop');
              setIsMobileDrawerOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'desktop'
                ? 'bg-purple-600 text-white shadow'
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
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile View</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div
        className={`relative flex overflow-hidden ${
          viewMode === 'mobile'
            ? 'max-w-[420px] mx-auto border border-[#27272a] my-2 rounded-2xl shadow-2xl min-h-[640px]'
            : 'min-h-[620px]'
        }`}
      >
        {/* ========================================================= */}
        {/* DESKTOP SIDEBAR (Matching Screenshots 1, 3) */}
        {/* ========================================================= */}
        {viewMode === 'desktop' && isSidebarOpen && (
          <div className="w-64 bg-[#18181b] border-r border-[#27272a] flex flex-col justify-between shrink-0 p-3 select-none z-10">
            <div className="space-y-4">
              {/* Header Title with Meta Swirl Logo + Toggle */}
              <div className="flex items-center justify-between px-2 pt-1">
                <button
                  onClick={() => handleOpenModal('new-chat')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-indigo-500 p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-[#18181b] rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400" />
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 hover:bg-[#27272a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                  title="Collapse Sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Main Sidebar Navigation Links (Matching Screenshot 1) */}
              <div className="space-y-1 text-xs font-medium">
                <button
                  onClick={() => {
                    handleNewChat();
                    handleOpenModal('new-chat');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#27272a] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Plus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    <span>New chat</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">⇧⌘O</span>
                </button>

                <button
                  onClick={() => handleOpenModal('search')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Search</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">⌘K</span>
                </button>

                <button
                  onClick={() => handleOpenModal('media')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Media</span>
                </button>

                <button
                  onClick={() => handleOpenModal('artifacts')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <LayoutGrid className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Artifacts</span>
                </button>

                <button
                  onClick={() => handleOpenModal('scheduled')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Scheduled</span>
                </button>

                <button
                  onClick={() => handleOpenModal('vibes')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] hover:text-slate-900 dark:text-white transition-colors text-left"
                >
                  <Play className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Vibes</span>
                </button>
              </div>

              {/* History Section Header & Items (Matching Screenshot 1 & Requested Fictional Items) */}
              <div className="pt-2 space-y-1">
                <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  History
                </p>

                <button
                  onClick={() => {
                    handleOpenModal('history-1');
                    handleSendPrompt('Jelaskan Panduan Lingkungan Maxy AI Hub');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] hover:text-slate-900 dark:text-white transition-colors text-xs truncate block"
                >
                  Panduan Lingkungan Maxy AI ...
                </button>

                <button
                  onClick={() => {
                    handleOpenModal('history-2');
                    handleSendPrompt('Buatkan Storyboard Komik Maxy Academy');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] hover:text-slate-900 dark:text-white transition-colors text-xs truncate block"
                >
                  Storyboard Komik Maxy Acad...
                </button>
              </div>
            </div>

            {/* Bottom Profile Row maxyacademy2026 (Matching Screenshot 1 & 3) */}
            <div className="relative pt-2 border-t border-[#27272a]">
              <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-[#27272a] transition-colors">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700/80 border border-emerald-500/50 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
                    <span className="text-[10px]">MA</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {userProfile.username}
                  </span>
                </button>

                <button
                  onClick={() => handleOpenModal('profile-menu')}
                  className="p-1.5 hover:bg-[#3f3f46] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors shrink-0"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Menu Popup (Matching Screenshot 3) */}
              {isProfileMenuOpen && (
                <div className="absolute bottom-12 left-0 w-60 bg-[#1f1f23] border border-[#333338] rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenModal('profile-menu');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#2c2c32] transition-colors text-left font-medium"
                  >
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>View profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsSettingsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#2c2c32] transition-colors text-left font-medium"
                  >
                    <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      alert('Pintasan Keyboard:\n- New chat: ⇧⌘O\n- Search: ⌘K\n- Shortcuts: ⌘/');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#2c2c32] transition-colors text-left font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <Keyboard className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Keyboard shortcuts</span>
                    </div>
                    <span className="text-[10px] text-slate-500">⌘/</span>
                  </button>

                  <div className="border-b border-[#2d2d34] my-1" />

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenModal('vibes');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#2c2c32] transition-colors text-left font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <Play className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Vibes.ai</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenModal('ai-demos');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#2c2c32] transition-colors text-left font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutGrid className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>AI Demos</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenModal('ai-identification');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#2c2c32] transition-colors text-left font-medium"
                  >
                    <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>AI identification</span>
                  </button>

                  <div className="border-b border-[#2d2d34] my-1" />

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      alert('Sesi keluar berhasil diformat.');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-[#2c2c32] transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>

                  {/* Footer Copyright */}
                  <div className="pt-2 text-[10px] text-slate-500 text-center space-y-1">
                    <p>Meta © 2026</p>
                    <p className="text-[9px] text-slate-600">
                      Privacy • Terms • AI Terms • Cookies
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Restore Sidebar Button when Collapsed */}
        {viewMode === 'desktop' && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-3 left-3 z-20 p-2 bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-slate-600 dark:text-slate-300 rounded-xl shadow-lg transition-colors"
            title="Open Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        {/* ========================================================= */}
        {/* MAIN DISPLAY AREA (Desktop & Mobile Viewport) */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col justify-between bg-[#121214] relative min-w-0 p-4 sm:p-6 overflow-y-auto">
          {/* Top Bar for Mobile Menu Trigger */}
          <div className="flex items-center justify-between w-full pb-2">
            <div>
              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className={`${
                  viewMode === 'mobile' ? 'block' : 'lg:hidden block'
                } p-2 hover:bg-[#27272a] rounded-xl text-slate-600 dark:text-slate-300 transition-colors`}
                title="Open Sidebar Navigation"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Workspace Content */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-4 space-y-6">
            {messages.length === 0 ? (
              <div className="w-full space-y-6 text-center animate-in fade-in duration-300">
                {/* Headline Text (Matching Screenshots) */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-snug font-sans">
                  Where should we start?
                </h1>

                {/* Main Input Box (Matching Screenshot 1) */}
                <div className="relative w-full bg-[#232326] border border-[#333338] rounded-2xl p-4 shadow-2xl text-left space-y-4">
                  {/* Textarea & Green Online Status Indicator */}
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
                      placeholder="Ask Meta AI..."
                      rows={2}
                      className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none font-sans"
                    />

                    {/* Green Active Dot Icon */}
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shrink-0 mt-1" />
                  </div>

                  {/* Bottom Controls Row inside Input Box */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Plus (+) Media Button */}
                    <button
                      onClick={() => {
                        setIsMediaModalOpen(true);
                        handleOpenModal('add-media-modal');
                      }}
                      className="p-2 hover:bg-[#323238] rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors border border-[#3a3a42] bg-[#1a1a1d]"
                      title="Add media and files"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Mode Tag & Send Arrow Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const nextMode = selectedMode === 'Instant' ? 'Llama 3.3' : 'Instant';
                          setSelectedMode(nextMode);
                          handleOpenModal('instant-mode');
                        }}
                        className="px-3 py-1 bg-[#1a1a1d] hover:bg-[#323238] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white text-xs font-medium rounded-full border border-[#3a3a42] transition-colors"
                      >
                        {selectedMode}
                      </button>

                      <button
                        onClick={() => handleSendPrompt()}
                        disabled={!inputPrompt.trim()}
                        className={`p-2.5 rounded-full transition-all shadow ${
                          inputPrompt.trim()
                            ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer'
                            : 'bg-indigo-900/60 text-slate-500 cursor-not-allowed'
                        }`}
                        title="Send Message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Filter Chips (Matching Screenshot 1) */}
                <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 text-xs pt-1">
                  {[
                    { label: 'New', key: 'New' },
                    { label: 'Create images', key: 'Create images' },
                    { label: 'Analyze this', key: 'Analyze this' },
                    { label: 'Do something fun', key: 'Do something fun' },
                  ].map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => {
                        setActiveChip(chip.key);
                        if (chip.key === 'Create images') {
                          handleSendPrompt('Buatkan lukisan pemandangan batik modern');
                        }
                      }}
                      className={`px-4 py-1.5 rounded-full font-medium text-xs border transition-all ${
                        activeChip === chip.key
                          ? 'bg-[#323238] text-slate-900 dark:text-white border-[#4f4f58]'
                          : 'bg-[#1e1e22] text-slate-600 dark:text-slate-300 border-[#2b2b30] hover:bg-[#28282e]'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Cards Grid (Matching Screenshots 1 & 4) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                  <button
                    onClick={() => handleSendPrompt('Create a 20-min daily workout')}
                    className="p-4 bg-[#1e1e22] hover:bg-[#28282e] border border-[#2b2b30] rounded-2xl transition-all space-y-3 group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      Create a 20-min daily workout
                    </p>
                  </button>

                  <button
                    onClick={() => handleSendPrompt('Make a trending seasonal recipe')}
                    className="p-4 bg-[#1e1e22] hover:bg-[#28282e] border border-[#2b2b30] rounded-2xl transition-all space-y-3 group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:text-purple-300">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      Make a trending seasonal recipe
                    </p>
                  </button>

                  <button
                    onClick={() => handleSendPrompt('Recap my calendar and email')}
                    className="p-4 bg-[#1e1e22] hover:bg-[#28282e] border border-[#2b2b30] rounded-2xl transition-all space-y-3 group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-fuchsia-950/80 border border-fuchsia-800/50 flex items-center justify-center text-fuchsia-400 group-hover:text-fuchsia-300">
                      <Mail className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      Recap my calendar and email
                    </p>
                  </button>

                  <button
                    onClick={() => handleSendPrompt('Audit my paid subscriptions')}
                    className="p-4 bg-[#1e1e22] hover:bg-[#28282e] border border-[#2b2b30] rounded-2xl transition-all space-y-3 group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300">
                      <Search className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      Audit my paid subscriptions
                    </p>
                  </button>

                  <button
                    onClick={() => handleSendPrompt('Explain sci-fi cars with real physics')}
                    className="p-4 bg-[#1e1e22] hover:bg-[#28282e] border border-[#2b2b30] rounded-2xl transition-all space-y-3 group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:text-purple-300">
                      <Zap className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      Explain sci-fi cars with real physics
                    </p>
                  </button>

                  <button
                    onClick={() => handleSendPrompt('Build a high-protein meal plan')}
                    className="p-4 bg-[#1e1e22] hover:bg-[#28282e] border border-[#2b2b30] rounded-2xl transition-all space-y-3 group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-fuchsia-950/80 border border-fuchsia-800/50 flex items-center justify-center text-fuchsia-400 group-hover:text-fuchsia-300">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      Build a high-protein meal plan
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Chat Stream View */
              <div className="w-full space-y-4 overflow-y-auto max-h-[480px] pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } space-y-1 animate-in fade-in duration-200`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 px-1">
                      <span>{msg.sender === 'user' ? userProfile.username : 'Meta AI'}</span>
                      {msg.modelUsed && <span className="text-purple-400">({msg.modelUsed})</span>}
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-[#1e1e22] border border-[#2b2b30] text-slate-700 dark:text-slate-200 rounded-bl-none space-y-2'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                      {msg.sender === 'meta' && (
                        <div className="flex items-center gap-3 pt-2 text-slate-500 dark:text-slate-400 border-t border-[#2b2b30] text-[11px]">
                          <button
                            onClick={() => handleCopyMessage(idx, msg.text)}
                            className="hover:text-slate-900 dark:text-white flex items-center gap-1 transition-colors"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedIndex === idx ? 'Tersalin' : 'Salin'}</span>
                          </button>
                          <button className="hover:text-slate-900 dark:text-white">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button className="hover:text-slate-900 dark:text-white">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <button className="hover:text-slate-900 dark:text-white">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-medium p-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                    <span>Meta AI sedang berpikir (Llama 3.3)...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE DRAWER OVERLAY (Matching Screenshots 5, 6) */}
        {/* ========================================================= */}
        {isMobileDrawerOpen && (
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex animate-in fade-in duration-200 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-72 max-w-[80%] bg-[#18181b] border-r border-[#27272a] h-full flex flex-col justify-between p-4 space-y-4 animate-in slide-in-from-left duration-200 cursor-default"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-indigo-500 p-0.5 flex items-center justify-center">
                      <div className="w-full h-full bg-[#18181b] rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400" />
                      </div>
                    </div>
                    <span className="font-bold text-base text-slate-900 dark:text-white">Meta AI</span>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs font-medium">
                  <button
                    onClick={() => {
                      handleNewChat();
                      handleOpenModal('new-chat');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#27272a]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New chat</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('search');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('media');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a]"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Media</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('artifacts');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a]"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Artifacts</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('scheduled');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a]"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Scheduled</span>
                  </button>
                </div>

                <div className="border-b border-[#27272a]" />

                <div className="space-y-1 text-xs">
                  <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase">
                    History
                  </p>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('history-1');
                      handleSendPrompt('Jelaskan Panduan Lingkungan Maxy AI Hub');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] truncate block"
                  >
                    Panduan Lingkungan Maxy AI ...
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleOpenModal('history-2');
                      handleSendPrompt('Buatkan Storyboard Komik Maxy Academy');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#27272a] truncate block"
                  >
                    Storyboard Komik Maxy Acad...
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272a]">
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setIsProfileMenuOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#27272a]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
                      MA
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {userProfile.username}
                    </span>
                  </div>
                  <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MEDIA UPLOAD MODAL ("Add media and files" - Screenshot 2 & 7) */}
      {/* ========================================================= */}
      {isMediaModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#222226] border border-[#36363d] rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Add media and files
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Upload whatever you want</p>
              </div>
              <button
                onClick={() => setIsMediaModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#33333b] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div className="border-2 border-dashed border-[#3a3a44] hover:border-purple-500/80 bg-[#19191c] rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#28282e] flex items-center justify-center mx-auto text-slate-600 dark:text-slate-300 group-hover:text-purple-400 group-hover:bg-purple-950/40 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Click to browse, or drag & drop here
              </p>
            </div>

            {/* Upload Tabs: Recent Uploads vs Creations */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs font-semibold border-b border-[#33333a] pb-2">
                <button
                  onClick={() => setUploadTab('recent')}
                  className={`pb-1 transition-colors relative ${
                    uploadTab === 'recent'
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Recent uploads
                  {uploadTab === 'recent' && (
                    <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setUploadTab('creations')}
                  className={`pb-1 transition-colors relative ${
                    uploadTab === 'creations'
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Creations
                  {uploadTab === 'creations' && (
                    <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
                  )}
                </button>
              </div>

              {/* Thumbnail Gallery Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {(uploadTab === 'recent' ? sampleUploads : sampleCreations).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsMediaModalOpen(false);
                      handleSendPrompt(`Tolong analisis gambar "${item.title}" yang saya unggah`);
                    }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#383842] hover:border-purple-500 cursor-pointer group shadow-sm"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-slate-900 dark:text-white font-medium p-1 text-center">
                      Select
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDUCATIONAL EXPLANATORY MODAL (Matching ChatGPT Simulator) */}
      {/* ========================================================= */}
      {activeModalKey && modalData[activeModalKey] && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#1f1f23] border border-[#333338] rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60 rounded-full uppercase tracking-wider">
                  {modalData[activeModalKey].badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug pt-1">
                  {modalData[activeModalKey].title}
                </h3>
                <p className="text-xs text-purple-400 font-medium">
                  Kategori: {modalData[activeModalKey].category}
                </p>
              </div>

              <button
                onClick={() => setActiveModalKey(null)}
                className="p-1.5 rounded-full hover:bg-[#2e2e35] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-[#2d2d34]">
              <p>{modalData[activeModalKey].description}</p>

              <div className="space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white text-xs">Keunggulan & Fitur Utama:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
                  {modalData[activeModalKey].keyFeatures.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#151518] rounded-xl border border-[#2b2b32] space-y-1">
                <p className="font-bold text-purple-300 text-[11px]">Cara Menggunakan:</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{modalData[activeModalKey].howToUse}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalKey(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SETTINGS MODAL */}
      {/* ========================================================= */}
      {isSettingsModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1f1f23] border border-[#333338] rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-[#2d2d34] pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Pengaturan Meta AI</h3>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#2d2d34] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#17171a] rounded-xl border border-[#28282e]">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Akun Pengguna</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{userProfile.username}</p>
                </div>
                <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700/50">
                  Meta Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#17171a] rounded-xl border border-[#28282e]">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Model Mesin Default</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Llama 3.3 70B Open Source</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Aktif</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#17171a] rounded-xl border border-[#28282e]">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Watermarking Digital</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">SynthID & C2PA Metadata</p>
                </div>
                <span className="text-[10px] text-purple-300 font-bold">On</span>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Tutup Pengaturan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
