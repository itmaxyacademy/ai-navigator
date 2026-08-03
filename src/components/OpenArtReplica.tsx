import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Globe, Video, Image as ImageIcon, User, Volume2, Home, 
  Compass, Folder, Wrench, Search, Menu, X, ChevronRight, ChevronDown, 
  ArrowLeft, Play, Plus, Trash2, RotateCw, Crown, Gift, Sliders, 
  Maximize2, Film, Mic, HelpCircle, Check, Copy, ExternalLink, 
  Layers, Cpu, Info, SlidersHorizontal, RefreshCw, Download, 
  Zap, Wand2, ShieldCheck, Box, MessageSquare, Flame, Scissors, 
  Palette, Camera, PanelLeft, Share2, Eye, LayoutGrid, Tag, FolderHeart
} from 'lucide-react';

type MainTab = 'home' | 'image' | 'video' | 'world' | 'character' | 'audio' | 'director' | 'mcp';

interface ModalContent {
  title: string;
  category: string;
  badge?: string;
  description: string;
  keyFeatures: string[];
  howToUse: string;
}

export const OpenArtReplica: React.FC = () => {
  // Active main creation tab
  const [activeTab, setActiveTab] = useState<MainTab>('image');

  // Sub-tab for Image creation
  const [imageSubTab, setImageSubTab] = useState<'create' | 'variations'>('create');
  
  // Sub-tab for Video creation
  const [videoSubTab, setVideoSubTab] = useState<'start_end' | 'text_ref'>('start_end');

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

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Desktop sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Active info modal
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);

  // Form states
  const [promptText, setPromptText] = useState('');
  const [audioPromptText, setAudioPromptText] = useState('');
  const [selectedImageModel, setSelectedImageModel] = useState('Nano Banana Pro');
  const [selectedVideoModel, setSelectedVideoModel] = useState('Seedance 2.0');
  const [selectedAudioModel, setSelectedAudioModel] = useState('Eleven Multilingual v2');
  const [autoPolish, setAutoPolish] = useState(false);
  const [quantity, setQuantity] = useState(2);
  const [selectedVoice, setSelectedVoice] = useState('Thien An - Da Nang Accent');
  
  // Generation simulation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<Array<{
    id: string;
    type: 'image' | 'video' | 'audio' | 'character' | 'world';
    title: string;
    url: string;
    model: string;
    timestamp: string;
  }>>([
    {
      id: 'init-1',
      type: 'image',
      title: 'A cat sitting on a table, warm morning light',
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      model: 'Nano Banana Pro',
      timestamp: 'Just now'
    },
    {
      id: 'init-2',
      type: 'image',
      title: 'Suit hanging in pine forest, cinematic 4k',
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      model: 'Nano Banana Pro',
      timestamp: '5m ago'
    }
  ]);

  // Handle generation action
  const handleGenerate = (costCredits: number) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newId = Date.now().toString();
      
      let newTitle = promptText || audioPromptText || 'Maxy Academy AI Art Creation';
      let newUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
      
      if (activeTab === 'video') {
        newUrl = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80';
      } else if (activeTab === 'character') {
        newUrl = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80';
      } else if (activeTab === 'world') {
        newUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
      }

      setGeneratedResults(prev => [
        {
          id: newId,
          type: activeTab === 'audio' ? 'audio' : activeTab === 'video' ? 'video' : 'image',
          title: newTitle,
          url: newUrl,
          model: activeTab === 'video' ? selectedVideoModel : activeTab === 'audio' ? selectedAudioModel : selectedImageModel,
          timestamp: 'Just now'
        },
        ...prev
      ]);
    }, 1500);
  };

  // Explanation Modal Dictionary for OpenArt tools
  const modalInfoMap: Record<string, ModalContent> = {
    'upgrade': {
      title: 'OpenArt Pro & Credit Bank (💎 38 Credits)',
      category: 'Billing & Quota',
      badge: 'Pro Tier',
      description: 'Pengelola saldo kredit generasi di OpenArt. Setiap instruksi pembuatan gambar, video, karakter, atau audio memerlukan jumlah kredit tertentu (5 - 400 kredit).',
      keyFeatures: [
        'Akses prioritas tanpa antrean render',
        'Model eksklusif: Nano Banana Pro, Seedance 2.0, Eleven Multilingual v2',
        'Hasil resolusi tinggi hingga 4K tanpa watermark'
      ],
      howToUse: 'Klik tombol "Upgrade" hijau di baris navigasi atas untuk menambah saldo kredit studio Anda.'
    },
    'model-select': {
      title: 'AI Model Engine Selector',
      category: 'Model Generation',
      badge: 'Multi-Model',
      description: 'Pusat pemilihan mesin AI generatif di OpenArt. Anda dapat beralih antara Nano Banana Pro (Gambar), Seedance 2.0 (Video), Eleven Multilingual v2 (Voice), dan GPT Image 2.0.',
      keyFeatures: [
        'Nano Banana Pro: Terbaik untuk fotorealisme dan pencahayaan alami',
        'Seedance 2.0: Generasi gerakan video dari gambar dasar yang sangat mulus',
        'Eleven Multilingual v2: Sintesis suara manusia sintetis beraksen lokal'
      ],
      howToUse: 'Klik kartu model di atas kotak prompt untuk membuka dropdown pemilih mesin AI.'
    },
    'auto-polish': {
      title: 'Auto Polish (Smart AI Prompt Enhancer)',
      category: 'Pengoptimasi Prompt',
      badge: 'Magic Switch',
      description: 'Sakelar otomatisasi yang memperkaya prompt kata kunci singkat Anda dengan detail pencahayaan, jenis lensa kamera, dan tekstur artistik.',
      keyFeatures: [
        'Mengubah 3 kata kunci menjadi deskripsi profesional 30 kata',
        'Mencegah kecacatan fisik dan gambar buram secara otomatis',
        'Menyelaraskan gaya estetika pilihan'
      ],
      howToUse: 'Aktifkan toggle "Auto Polish" di sudut kanan bawah kotak prompt sebelum menekan tombol Generate.'
    },
    'director': {
      title: 'OpenArt Director Suite',
      category: 'Production Tool',
      badge: 'Enterprise',
      description: 'Studio produksi komprehensif untuk merangkai adegan storyboard, memadukan karakter, lokasi (world), dan dialog audio menjadi satu proyek klip utuh.',
      keyFeatures: [
        'Manajemen alur adegan video berurutan',
        'Konsistensi karakter dan ruang dari scene ke scene',
        'Penyelarasan gerak bibir (Lip-Sync) dan efek suara'
      ],
      howToUse: 'Akses menu "Director" di sidebar kiri untuk mengelola proyek pembuatan film atau materi promosi Maxy Academy.'
    },
    'mcp': {
      title: 'MCP (Model Context Protocol) Integration',
      category: 'Pengembang & Integrasi',
      badge: 'API & Pipeline',
      description: 'Alat pengintegrasian pipeline OpenArt dengan pustaka external dan alur kerja pengembang secara otomatis.',
      keyFeatures: [
        'Sinkronisasi dataset dan file asset cloud',
        'Panggilan API kustom untuk otomatisasi render massal',
        'Integrasi workflow desain enterprise'
      ],
      howToUse: 'Klik tab "MCP" di menu Create untuk mengonfigurasi skrip dan pengait webhook.'
    },
    'assets-director': {
      title: 'Director Projects (Proyek Sutradara)',
      category: 'Asset Manager',
      badge: 'Production Asset',
      description: 'Penyimpanan pusat untuk draft, adegan storyboard, timeline urutan video, dan skrip animasi film yang sedang dikerjakan dalam OpenArt Director Suite.',
      keyFeatures: [
        'Menyimpan alur adegan video multi-scene tanpa kehilangan konteks',
        'Ekspor langsung ke resolusi 4K dengan trek audio tersinkronisasi',
        'Kolaborasi tim Maxy Academy dan riwayat versi proyek'
      ],
      howToUse: 'Klik proyek dari daftar untuk melanjutkan pengeditan adegan atau membuat draf sutradara baru.'
    },
    'assets-characters': {
      title: 'Characters & Worlds Library',
      category: 'Asset Manager',
      badge: 'Consistency Engine',
      description: 'Pustaka model karakter konsisten (Persona ID) dan peta lokasi virtual (World Maps) Maxy Academy yang siap dipakai berulang kali.',
      keyFeatures: [
        'Mempertahankan struktur wajah & pakaian karakter hingga 99% sama',
        'Penyimpanan sudut pandang lingkungan 3D (pencahayaan & arsitektur)',
        'Tagging otomatis & integrasi prompt cepat'
      ],
      howToUse: 'Pilih avatar karakter atau world dari perpustakaan ini untuk langsung disematkan ke dalam prompt generasi.'
    },
    'assets-brandkit': {
      title: 'Brand Kit & Palette Manager',
      category: 'Asset Manager',
      badge: 'Enterprise Branding',
      description: 'Pusat aset identitas merek seperti logo Maxy Academy, palet warna kustom, gaya tipografi, dan watermark visual yang diterapkan secara otomatis.',
      keyFeatures: [
        'Overlay logo dan watermark otomatis pada hasil render final',
        'Sistem penguncian warna hex merek Maxy Academy',
        'Templat desain standar untuk materi pemasaran'
      ],
      howToUse: 'Unggah file SVG/PNG logo Anda dan atur warna bawaan merek untuk mempertahankan konsistensi visual studio.'
    },
    'assets-media': {
      title: 'Media Storage & Cloud Assets',
      category: 'Asset Manager',
      badge: 'Cloud Storage',
      description: 'Manajer penyimpanan cloud untuk semua hasil gambar, klip video, rekaman vokal, dan file referensi yang pernah diunggah atau dirender.',
      keyFeatures: [
        'Kapasitas penyimpanan tak terbatas untuk akun Pro',
        'Filter berdasarkan tanggal, model AI, dan jenis media',
        'Unduh langsung berkas mentah tanpa kompresi'
      ],
      howToUse: 'Gunakan menu Media untuk mencari kembali hasil karya terdahulu atau mengunggah gambar referensi baru.'
    },
    'inspire-templates': {
      title: 'OpenArt Prompt Templates & Presets',
      category: 'Inspirasi & Komunitas',
      badge: 'Community Hub',
      description: 'Koleksi ribuan templat prompt siap pakai yang dibuat oleh para kreator dan desainer profesional dari seluruh dunia.',
      keyFeatures: [
        'Variasi gaya: Cyberpunk, Photorealism, Anime, Cinematic, 3D Render',
        'Parameter model bawaan (Negative Prompt, Aspect Ratio, Seed)',
        'Sekali klik untuk menerapkan struktur prompt ke studio'
      ],
      howToUse: 'Pilih templat yang Anda sukai, lalu ganti objek kata kunci untuk membuat gambar unik beresolusi tinggi.'
    },
    'inspire-tutorials': {
      title: 'Interactive Tutorials & AI Masterclass',
      category: 'Pembelajaran',
      badge: 'Learning Center',
      description: 'Panduan langkah-demi-langkah dan panduan video interaktif untuk menguasai teknik prompt engineering dan fitur OpenArt lanjutan.',
      keyFeatures: [
        'Tutorial teknik penguncian karakter (Seedance & Nano Banana)',
        'Panduan penyuntingan adegan video Lip-Sync & Motion Sync',
        'Kiat hemat kredit generasi untuk hasil maksimal'
      ],
      howToUse: 'Buka tutorial pilihan Anda untuk mempelajari trik prompt dan terapkan langsung di canvas OpenArt.'
    },
    'inspire-blog': {
      title: 'OpenArt Official Blog & AI News',
      category: 'Berita & Pembaruan',
      badge: 'Whats New',
      description: 'Pusat wawasan, rilis model AI terbaru (Seedance 2.0, Eleven v2), artikel studi kasus, dan catatan pembaruan platform OpenArt.',
      keyFeatures: [
        'Pengumuman model generative AI generasi terbaru',
        'Studi kasus penggunaan AI dalam industri kreatif & pendidikan',
        'Tips optimasi alur kerja dari pakar AI'
      ],
      howToUse: 'Baca artikel blog terbaru untuk mengetahui tren teknologi AI art dan fitur baru yang diluncurkan.'
    },
    'pinned-motionsync': {
      title: 'Motion Sync Tool',
      category: 'Pinned Tools',
      badge: 'Advanced AI Motion',
      description: 'Alat penyelarasan gerak yang mengekstrak dan mentransfer trajektori gerakan dari video referensi ke objek atau karakter buatan Anda.',
      keyFeatures: [
        'Pencegatan gerakan tubuh & kamera (Camera Tracking)',
        'Animasi karakter sintetis yang mengikuti tarian/gerakan nyata',
        'Kontrol kecepatan dan kelancaran bingkai (FPS interpolation)'
      ],
      howToUse: 'Unggah video gerakan sumber, pilih gambar karakter Anda, lalu klik Synchronize Motion.'
    },
    'pinned-lipsync': {
      title: 'Lip-Sync AI Engine',
      category: 'Pinned Tools',
      badge: 'Facial Rigging',
      description: 'Fitur sinkronisasi bibir pintar yang mencocokkan gerakan mulut karakter pada gambar/video dengan audio percakapan atau voice-over.',
      keyFeatures: [
        'Pencocokan fonem mulut otomatis dengan fleksibilitas tinggi',
        'Dukungan bahasa Indonesia dan puluhan bahasa internasional',
        'Ekspresi wajah alami saat melafalkan kata-kata'
      ],
      howToUse: 'Pilih video/foto wajah karakter, unggah file suara atau ketik teks voice-over, lalu jalankan Lip-Sync.'
    }
  };

  const openInfo = (key: string) => {
    if (modalInfoMap[key]) {
      setActiveModal(modalInfoMap[key]);
    }
  };

  // Render Top Header Bar (Desktop & Mobile)
  const renderTopNavbar = () => (
    <div className={`px-3 sm:px-4 bg-[#111216] border-b border-[#22242d] flex items-center justify-between shrink-0 select-none text-xs ${viewMode === 'mobile' ? 'min-h-[56px] py-2 flex-wrap gap-2' : 'h-14'}`}>
      {/* Left: Brand Logo & Collapse Icon */}
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        <button
          onClick={() => {
            if (viewMode === 'mobile') {
              setIsMobileDrawerOpen(true);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
          className="p-1.5 hover:bg-[#1f212a] rounded-lg text-slate-600 dark:text-slate-300 transition-colors shrink-0"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
          {/* OpenArt Infinity Logo */}
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#10b981] via-[#06b6d4] to-[#a855f7] flex items-center justify-center text-slate-900 dark:text-white font-extrabold shadow-sm">
            <span className="text-sm leading-none font-bold">∞</span>
          </div>
          <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-wide">OpenArt</span>
          <span className="text-[10px] bg-[#222530] text-slate-600 dark:text-slate-300 font-semibold px-1.5 py-0.5 rounded border border-[#333745]">
            Free
          </span>
        </div>

        {/* Workspace Dropdown */}
        <div className={`${viewMode === 'mobile' ? 'hidden' : 'hidden xl:flex'} items-center gap-2 pl-3 border-l border-[#22242d] truncate`}>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#181a20] hover:bg-[#20232d] border border-[#2a2d39] rounded-lg cursor-pointer transition-colors text-slate-700 dark:text-slate-200 truncate">
            <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
              M
            </div>
            <span className="font-medium truncate max-w-[120px]">Maxy Academy's wor...</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          </div>

          <span className="text-slate-500">•</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium capitalize whitespace-nowrap">Create • {activeTab}</span>
        </div>
      </div>

      {/* Right Navbar Actions */}
      <div className="flex items-center gap-1.5 shrink-0 pl-1">
        <button className={`${viewMode === 'mobile' ? 'hidden' : 'hidden lg:flex'} items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-2 py-1 rounded-lg hover:bg-[#1c1e26] whitespace-nowrap`}>
          <span>Previous version</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <button className={`${viewMode === 'mobile' ? 'hidden' : 'hidden sm:flex'} items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-2 py-1 rounded-lg hover:bg-[#1c1e26] whitespace-nowrap`}>
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <button className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#1c1e26] rounded-lg">
          <Gift className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </button>

        {/* Upgrade Green Button with Diamond */}
        <button
          onClick={() => openInfo('upgrade')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-xs rounded-full shadow-md transition-all whitespace-nowrap"
        >
          <span className="text-xs">💎 38</span>
          <span className="hidden sm:inline bg-black/20 px-1.5 py-0.5 rounded-full text-[10px]">Upgrade</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-1 pl-1 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Maxy Academy"
            className="w-7 h-7 rounded-full object-cover border border-purple-500/50 shrink-0"
          />
          <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
        </div>
      </div>
    </div>
  );

  // Render Left Desktop Sidebar
  const renderDesktopSidebar = () => {
    if (isSidebarCollapsed) return null;

    return (
      <div className="w-56 bg-[#121318] border-r border-[#22242d] flex flex-col justify-between shrink-0 select-none text-xs p-2.5 space-y-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Workspace Box */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#1a1c23] border border-[#2b2e3a] text-slate-700 dark:text-slate-200 hover:border-purple-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <div className="w-5 h-5 rounded-md bg-cyan-600 flex items-center justify-center font-bold text-slate-900 dark:text-white text-[10px]">
                P
              </div>
              <span className="font-semibold text-xs">Personal Project</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>

          {/* Home Link */}
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-slate-900 dark:text-white border border-pink-500/50'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23]'
            }`}
          >
            <Home className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>Home</span>
          </button>

          {/* SECTION: CREATE */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              CREATE
            </span>

            {/* Director Button */}
            <button
              onClick={() => setActiveTab('director')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'director'
                  ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-slate-900 dark:text-white border border-pink-500/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23]'
              }`}
            >
              <Film className="w-4 h-4 text-pink-400" />
              <span>Director</span>
            </button>

            {/* Grid of 6 Tools */}
            <div className="grid grid-cols-2 gap-1 pt-1">
              {/* Video */}
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                  activeTab === 'video'
                    ? 'bg-purple-900/40 border-pink-500/80 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-[#181a20] border-[#252834] text-slate-600 dark:text-slate-300 hover:bg-[#20232c]'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>Video</span>
              </button>

              {/* Image */}
              <button
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                  activeTab === 'image'
                    ? 'bg-purple-900/40 border-pink-500/80 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-[#181a20] border-[#252834] text-slate-600 dark:text-slate-300 hover:bg-[#20232c]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Image</span>
              </button>

              {/* World */}
              <button
                onClick={() => setActiveTab('world')}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                  activeTab === 'world'
                    ? 'bg-purple-900/40 border-pink-500/80 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-[#181a20] border-[#252834] text-slate-600 dark:text-slate-300 hover:bg-[#20232c]'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>World</span>
              </button>

              {/* Character */}
              <button
                onClick={() => setActiveTab('character')}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                  activeTab === 'character'
                    ? 'bg-purple-900/40 border-pink-500/80 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-[#181a20] border-[#252834] text-slate-600 dark:text-slate-300 hover:bg-[#20232c]'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Character</span>
              </button>

              {/* Audio */}
              <button
                onClick={() => setActiveTab('audio')}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                  activeTab === 'audio'
                    ? 'bg-purple-900/40 border-pink-500/80 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-[#181a20] border-[#252834] text-slate-600 dark:text-slate-300 hover:bg-[#20232c]'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Audio</span>
              </button>

              {/* MCP */}
              <button
                onClick={() => openInfo('mcp')}
                className="flex items-center gap-2 p-2 rounded-xl border border-[#252834] bg-[#181a20] text-slate-600 dark:text-slate-300 hover:bg-[#20232c] text-xs font-medium transition-all flex-wrap max-w-full"
              >
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>MCP</span>
              </button>
            </div>
          </div>

          {/* SECTION: ASSETS */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              ASSETS
            </span>
            <button
              onClick={() => openInfo('assets-director')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <Film className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Director Projects</span>
            </button>
            <button
              onClick={() => openInfo('assets-characters')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Characters & Worlds</span>
            </button>
            <button
              onClick={() => openInfo('assets-brandkit')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <Box className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Brand Kit</span>
            </button>
            <button
              onClick={() => openInfo('assets-media')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <Folder className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Media</span>
            </button>
          </div>

          {/* SECTION: INSPIRE */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              INSPIRE
            </span>
            <button
              onClick={() => openInfo('inspire-templates')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => openInfo('inspire-tutorials')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <Compass className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Tutorials</span>
            </button>
            <button
              onClick={() => openInfo('inspire-blog')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Blog</span>
            </button>
          </div>

          {/* SECTION: PINNED TOOLS */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                PINNED TOOLS
              </span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </div>
            <button
              onClick={() => openInfo('pinned-motionsync')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Motion Sync</span>
            </button>
            <button
              onClick={() => openInfo('pinned-lipsync')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#1a1c23] transition-colors flex-wrap max-w-full"
            >
              <Mic className="w-3.5 h-3.5 text-purple-400" />
              <span>Lip-Sync</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Mobile Slide-Over Drawer (Matching Screenshot 4)
  const renderMobileDrawer = () => {
    if (!isMobileDrawerOpen) return null;

    return (
      <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
        <div className="w-72 h-full bg-[#13151b] border-r border-[#262936] text-slate-700 dark:text-slate-200 p-4 space-y-5 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#262936] pb-3">
              <div className="flex items-center gap-2 flex-wrap max-w-full">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#10b981] to-[#a855f7] flex items-center justify-center text-slate-900 dark:text-white font-extrabold text-sm">
                  ∞
                </div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white">OpenArt</span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#202430] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile User Row */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1c1f2a] border border-[#2d3142]">
              <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Maxy Academy"
                  className="w-8 h-8 rounded-full object-cover border border-purple-500"
                />
                <span className="font-bold text-xs text-slate-900 dark:text-white break-words whitespace-normal leading-snug max-w-[130px]">
                  Maxy Academy
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>

            {/* Personal Project Row */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1c1f2a] border border-[#2d3142]">
              <div className="flex items-center gap-2 flex-wrap max-w-full">
                <div className="w-6 h-6 rounded-md bg-cyan-600 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs">
                  P
                </div>
                <span className="font-semibold text-xs text-slate-900 dark:text-white">Personal Project</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>

            {/* Main Links */}
            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#1c1f2a] font-medium flex-wrap max-w-full"
              >
                <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('director');
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#1c1f2a] font-medium flex-wrap max-w-full"
              >
                <Film className="w-4 h-4 text-pink-400" />
                <span>Director</span>
              </button>

              {/* Create Sub-Grid Box */}
              <div className="bg-[#181a22] border border-[#282b3a] rounded-2xl p-3 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Create
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('video');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold ${
                      activeTab === 'video' ? 'bg-purple-900/50 text-slate-900 dark:text-white border border-pink-500' : 'bg-[#20232f] text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Video className="w-4 h-4 text-cyan-400" />
                    <span>Video</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('image');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`flex flex-row items-center gap-2 p-2 rounded-xl text-xs font-semibold border ${
                      activeTab === 'image' ? 'bg-pink-950/60 text-slate-900 dark:text-white border-pink-500' : 'bg-[#20232f] border-transparent text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    <span>Image</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('world');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold ${
                      activeTab === 'world' ? 'bg-purple-900/50 text-slate-900 dark:text-white border border-pink-500' : 'bg-[#20232f] text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>World</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('character');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold ${
                      activeTab === 'character' ? 'bg-purple-900/50 text-slate-900 dark:text-white border border-pink-500' : 'bg-[#20232f] text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Character</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('audio');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold ${
                      activeTab === 'audio' ? 'bg-purple-900/50 text-slate-900 dark:text-white border border-pink-500' : 'bg-[#20232f] text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <span>Audio</span>
                  </button>

                  <button
                    onClick={() => {
                      openInfo('mcp');
                      setIsMobileDrawerOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold bg-[#20232f] text-slate-700 dark:text-slate-200 flex-wrap max-w-full"
                  >
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>MCP</span>
                  </button>
                </div>
              </div>

              {/* ASSETS SECTION IN MOBILE DRAWER */}
              <div className="bg-[#181a22] border border-[#282b3a] rounded-2xl p-3 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Assets
                </span>
                <button
                  onClick={() => {
                    openInfo('assets-director');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <Film className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Director Projects</span>
                </button>
                <button
                  onClick={() => {
                    openInfo('assets-characters');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Characters & Worlds</span>
                </button>
                <button
                  onClick={() => {
                    openInfo('assets-brandkit');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <Box className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Brand Kit</span>
                </button>
                <button
                  onClick={() => {
                    openInfo('assets-media');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <Folder className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Media</span>
                </button>
              </div>

              {/* INSPIRE SECTION IN MOBILE DRAWER */}
              <div className="bg-[#181a22] border border-[#282b3a] rounded-2xl p-3 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Inspire
                </span>
                <button
                  onClick={() => {
                    openInfo('inspire-templates');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Templates</span>
                </button>
                <button
                  onClick={() => {
                    openInfo('inspire-tutorials');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <Compass className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Tutorials</span>
                </button>
                <button
                  onClick={() => {
                    openInfo('inspire-blog');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Blog</span>
                </button>
              </div>

              {/* PINNED TOOLS SECTION IN MOBILE DRAWER */}
              <div className="bg-[#181a22] border border-[#282b3a] rounded-2xl p-3 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Pinned Tools
                </span>
                <button
                  onClick={() => {
                    openInfo('pinned-motionsync');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Motion Sync</span>
                </button>
                <button
                  onClick={() => {
                    openInfo('pinned-lipsync');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#222532] flex-wrap max-w-full"
                >
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  <span>Lip-Sync</span>
                </button>
              </div>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white font-medium flex-wrap max-w-full">
                <HelpCircle className="w-4 h-4" />
                <span>Email Us</span>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white font-medium flex-wrap max-w-full">
                <Info className="w-4 h-4" />
                <span>Terms & Policies</span>
              </button>
            </div>
          </div>

          {/* Social Icons Footer */}
          <div className="pt-4 border-t border-[#262936] flex items-center justify-around text-slate-500 dark:text-slate-400">
            <button className="p-2 rounded-lg hover:bg-[#202430] hover:text-slate-900 dark:text-white">X</button>
            <button className="p-2 rounded-lg hover:bg-[#202430] hover:text-slate-900 dark:text-white">🎮</button>
            <button className="p-2 rounded-lg hover:bg-[#202430] hover:text-slate-900 dark:text-white">▶</button>
            <button className="p-2 rounded-lg hover:bg-[#202430] hover:text-slate-900 dark:text-white">📸</button>
          </div>
        </div>
      </div>
    );
  };

  // Render Mobile Bottom Sticky Navbar (Screenshots 1 - 6)
  const renderMobileBottomNav = () => (
    <div className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-[#0f1015]/95 backdrop-blur-md border-t border-[#222532] flex items-center justify-around z-40 px-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 select-none">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-slate-900 dark:text-white font-bold' : 'hover:text-slate-900 dark:text-white'}`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => openInfo('inspire-templates')}
        className="flex flex-col items-center gap-1 hover:text-slate-900 dark:text-white transition-colors"
      >
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span>Inspire</span>
      </button>

      {/* Big Central Glowing Create Button */}
      <button
        onClick={() => setActiveTab('image')}
        className="flex flex-col items-center gap-1 -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 flex items-center justify-center text-slate-900 dark:text-white shadow-lg shadow-pink-500/40 border-2 border-[#13141a]">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-slate-900 dark:text-white font-bold">Create</span>
      </button>

      <button
        onClick={() => openInfo('pinned-motionsync')}
        className="flex flex-col items-center gap-1 hover:text-slate-900 dark:text-white transition-colors"
      >
        <Wrench className="w-5 h-5 text-cyan-400" />
        <span>Tools</span>
      </button>

      <button
        onClick={() => openInfo('assets-media')}
        className="flex flex-col items-center gap-1 hover:text-slate-900 dark:text-white transition-colors"
      >
        <Folder className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        <span>Assets</span>
      </button>
    </div>
  );

  // Render Floating Bottom Mode Switcher Bar (inside middle panel)
  const renderFloatingModeBar = () => (
    <div className="flex items-center justify-center gap-1 p-1 bg-[#1a1d26]/90 backdrop-blur border border-[#2b2e3e] rounded-full shadow-xl max-w-sm mx-auto my-3">
      <button
        onClick={() => setActiveTab('video')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          activeTab === 'video'
            ? 'bg-white text-black shadow-md'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
        }`}
      >
        <Video className="w-3.5 h-3.5" />
        <span>Video</span>
      </button>

      <button
        onClick={() => setActiveTab('image')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          activeTab === 'image'
            ? 'bg-white text-black shadow-md'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
        }`}
      >
        <ImageIcon className="w-3.5 h-3.5" />
        <span>Image</span>
      </button>

      <button
        onClick={() => setActiveTab('character')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          activeTab === 'character'
            ? 'bg-white text-black shadow-md'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        <span>Character</span>
      </button>

      <button
        onClick={() => setActiveTab('world')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          activeTab === 'world'
            ? 'bg-white text-black shadow-md'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>World</span>
      </button>

      <button
        onClick={() => setActiveTab('audio')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          activeTab === 'audio'
            ? 'bg-white text-black shadow-md'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>Audio</span>
      </button>
    </div>
  );

  // MAIN TAB CONTENTS

  // 1. CREATE IMAGE VIEW (Screenshot 5 & Screenshot 10)
  const renderCreateImagePanel = () => (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0d0e12]">
      {/* Left Form Column */}
      <div className="w-full bg-[#12141a] border-b border-[#222430] p-4 md:p-6 space-y-4 shrink-0">
        <div className="space-y-4">
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <ChevronLeftIcon onClick={() => setActiveTab('home')} />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Create Image</h2>
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" onClick={() => openInfo('model-select')} />
            </div>
            <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" />
          </div>

          {/* Sub Tab Switcher Pills */}
          <div className="grid grid-cols-2 p-1 bg-[#1a1d26] border border-[#292c3a] rounded-2xl gap-1">
            <button
              onClick={() => setImageSubTab('create')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                imageSubTab === 'create'
                  ? 'bg-gradient-to-r from-purple-800 to-pink-800 text-slate-900 dark:text-white shadow-md border border-pink-500/50'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Create Image</span>
            </button>

            <button
              onClick={() => setImageSubTab('variations')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                imageSubTab === 'variations'
                  ? 'bg-gradient-to-r from-purple-800 to-pink-800 text-slate-900 dark:text-white shadow-md border border-pink-500/50'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Image Variations</span>
            </button>
          </div>

          {/* Model Selection Card */}
          <div
            onClick={() => openInfo('model-select')}
            className="p-3 bg-[#181b24] border border-[#2b2e3f] hover:border-purple-500/60 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 flex-wrap max-w-full">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs">
                G
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block uppercase">Model</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{selectedImageModel}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>

          {/* Describe Your Image Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span>Describe your image</span>
              <Maximize2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </div>

            <div className="bg-[#171a23] border border-[#2a2e3e] rounded-2xl p-3 space-y-3 relative focus-within:border-purple-500 transition-colors">
              {/* Optional Visual References Banner */}
              <div className="p-2.5 bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-indigo-900/40 border border-pink-500/40 rounded-xl flex items-center justify-between cursor-pointer hover:opacity-90">
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-md bg-amber-500 border border-black" />
                    <div className="w-5 h-5 rounded-md bg-rose-500 border border-black" />
                    <div className="w-5 h-5 rounded-md bg-indigo-500 border border-black" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-tight">Add visual references</span>
                    <span className="text-[9px] text-slate-600 dark:text-slate-300 block">JPEG/PNG/WEBP/GIF, 20 MB max</span>
                  </div>
                </div>
                <span className="text-[10px] text-pink-300 bg-pink-950 px-1.5 py-0.5 rounded border border-pink-700/50">
                  0/10
                </span>
              </div>

              {/* Text Area Input */}
              <textarea
                rows={3}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="What do you want to see? Example: 'A cat sitting on a table, warm morning light.'"
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none pt-1"
              />

              {/* Bottom Tools inside Prompt Box */}
              <div className="flex items-center justify-between pt-2 border-t border-[#252838] text-slate-500 dark:text-slate-400 text-xs">
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <button className="p-1.5 hover:bg-[#252838] rounded-lg hover:text-slate-900 dark:text-white" title="Crop & Ratio">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-[#252838] rounded-lg hover:text-slate-900 dark:text-white" title="Style Brush">
                    <Wand2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setPromptText('')}
                    className="p-1.5 hover:bg-[#252838] rounded-lg hover:text-rose-400" 
                    title="Clear"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Auto Polish Switch */}
                <div className="flex items-center gap-2 cursor-pointer flex-wrap max-w-full" onClick={() => setAutoPolish(!autoPolish)}>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Auto Polish</span>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${autoPolish ? 'bg-pink-600' : 'bg-[#2b2e3e]'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${autoPolish ? 'translate-x-4' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Output Format Picker */}
          <div className="p-3 bg-[#181b24] border border-[#2b2e3f] rounded-2xl flex items-center justify-between text-xs cursor-pointer hover:bg-[#1f222e]">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 flex-wrap max-w-full">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <span>Output</span>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white">4:3 | 1K</span>
          </div>
        </div>

        {/* Bottom Generate Button & Quantity Counter */}
        <div className="pt-2 space-y-3 border-t border-[#222430]">
          <div className="flex items-center justify-between gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-[#181b24] border border-[#2b2e3f] rounded-2xl px-3 py-2 text-xs font-extrabold text-slate-900 dark:text-white flex-wrap max-w-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-1"
              >
                -
              </button>
              <span>{quantity} / 4</span>
              <button
                onClick={() => setQuantity(Math.min(4, quantity + 1))}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-1"
              >
                +
              </button>
            </div>

            {/* Big Magenta Generate Button */}
            <button
              onClick={() => handleGenerate(80)}
              disabled={isGenerating}
              className="flex-1 py-3 bg-gradient-to-r from-[#d946ef] via-[#c026d3] to-[#a855f7] hover:brightness-110 text-slate-900 dark:text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all min-w-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">✨ 80</span>
                </>
              )}
            </button>
          </div>

          {/* Floating Mode Bar */}
          {renderFloatingModeBar()}
        </div>
      </div>

      {/* Right Gallery / Inspiration Column */}
      <div className="flex-1 bg-[#0d0e12] p-4 md:p-6 space-y-5 min-w-0">
        {/* Gallery Top Filter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-[#1f222d]">
          <div className="flex items-center gap-2 flex-wrap max-w-full">
            <button className="p-1.5 hover:bg-[#1a1d26] rounded-lg text-slate-900 dark:text-white">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-[#1a1d26] rounded-lg">
              <Tag className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-[#1a1d26] rounded-lg">
              <FolderHeart className="w-4 h-4" />
            </button>
          </div>

          <button className="px-3 py-1.5 bg-white text-black font-extrabold rounded-full text-xs shadow-md">
            Templates
          </button>
        </div>

        {/* Hero Banner (Turn your ideas into polished visuals) */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-pink-950/40 to-indigo-950/60 border border-purple-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create <span className="text-pink-400">Image</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm">
              Turn your ideas into polished visuals in seconds using Nano Banana Pro or SDXL engine.
            </p>
          </div>

          {/* Monster Family Illustration Card */}
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 w-full md:w-64 h-36 shrink-0 shadow-2xl bg-purple-950">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
              alt="Monster Family"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to stylized gradient if network blocks image
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold text-pink-300 border border-pink-500/40 flex items-center gap-1 flex-wrap max-w-full">
              <span>Monster family</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Results / Preset Inspiration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {generatedResults.map((item) => (
            <div key={item.id} className="group bg-[#151720] border border-[#252836] hover:border-purple-500 rounded-2xl overflow-hidden shadow-lg transition-all space-y-2 p-2">
              <div className="relative h-52 rounded-xl overflow-hidden bg-black">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded-md text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                  {item.model}
                </div>
              </div>
              <div className="p-1 space-y-1 text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block break-words whitespace-normal leading-snug">{item.title}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. CREATE VIDEO VIEW (Screenshot 6 & Screenshot 9)
  const renderCreateVideoPanel = () => (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0d0e12]">
      {/* Left Form Column */}
      <div className="w-full bg-[#12141a] border-b border-[#222430] p-4 md:p-6 space-y-4 shrink-0">
        <div className="space-y-4">
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <ChevronLeftIcon onClick={() => setActiveTab('home')} />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Frame to Video</h2>
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" onClick={() => openInfo('model-select')} />
            </div>
            <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" />
          </div>

          {/* Sub Tab Switcher Pills */}
          <div className="grid grid-cols-2 p-1 bg-[#1a1d26] border border-[#292c3a] rounded-2xl gap-1">
            <button
              onClick={() => setVideoSubTab('start_end')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                videoSubTab === 'start_end'
                  ? 'bg-gradient-to-r from-purple-800 to-pink-800 text-slate-900 dark:text-white shadow-md border border-pink-500/50'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>Start/End Frame</span>
            </button>

            <button
              onClick={() => setVideoSubTab('text_ref')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                videoSubTab === 'text_ref'
                  ? 'bg-gradient-to-r from-purple-800 to-pink-800 text-slate-900 dark:text-white shadow-md border border-pink-500/50'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-pink-400" />
              <span>Text with Reference</span>
            </button>
          </div>

          {/* Model Selection Card */}
          <div
            onClick={() => openInfo('model-select')}
            className="p-3 bg-[#181b24] border border-[#2b2e3f] hover:border-purple-500/60 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 flex-wrap max-w-full">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs">
                S
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block uppercase">Model</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{selectedVideoModel}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>

          {/* Set Start & End Frame Section */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Set start & end frame</span>
            
            <div className="grid grid-cols-2 gap-2 relative">
              {/* Start Frame Box */}
              <div className="p-4 bg-[#171a23] border border-dashed border-[#2f3346] hover:border-purple-500 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer min-h-[110px]">
                <div className="w-8 h-8 rounded-full bg-[#222634] flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Add a start frame</span>
                <span className="text-[10px] text-purple-400 font-semibold underline">History</span>
              </div>

              {/* Swap Icon Divider */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#202330] border border-[#303448] flex items-center justify-center text-slate-500 dark:text-slate-400 z-10">
                ⇆
              </div>

              {/* End Frame Box */}
              <div className="p-4 bg-[#171a23] border border-dashed border-[#2f3346] hover:border-purple-500 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer min-h-[110px]">
                <div className="w-8 h-8 rounded-full bg-[#222634] flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Add an end frame</span>
                <span className="text-[10px] text-slate-500 font-semibold">History</span>
              </div>
            </div>
          </div>

          {/* Describe Your Video Box */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span>Describe your video</span>
              <Maximize2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </div>

            <div className="bg-[#171a23] border border-[#2a2e3e] rounded-2xl p-3 space-y-2">
              <textarea
                rows={3}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe scene transitions, camera movement trajectories, or character actions with text..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Generate Button */}
        <div className="pt-2 space-y-3 border-t border-[#222430]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 bg-[#181b24] border border-[#2b2e3f] rounded-2xl px-3 py-2 text-xs font-extrabold text-slate-900 dark:text-white flex-wrap max-w-full">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-1">-</button>
              <span>{quantity} / 4</span>
              <button onClick={() => setQuantity(Math.min(4, quantity + 1))} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white px-1">+</button>
            </div>

            <button
              onClick={() => handleGenerate(400)}
              disabled={isGenerating}
              className="flex-1 py-3 bg-gradient-to-r from-[#d946ef] via-[#c026d3] to-[#a855f7] hover:brightness-110 text-slate-900 dark:text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all min-w-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Video...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">✨ 400</span>
                </>
              )}
            </button>
          </div>

          {renderFloatingModeBar()}
        </div>
      </div>

      {/* Right Gallery Column */}
      <div className="flex-1 bg-[#0d0e12] p-4 md:p-6 space-y-5 min-w-0">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-[#1f222d]">
          <div className="flex items-center gap-2 flex-wrap max-w-full">
            <button className="p-1.5 hover:bg-[#1a1d26] rounded-lg text-slate-900 dark:text-white"><LayoutGrid className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-[#1a1d26] rounded-lg"><Tag className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-[#1a1d26] rounded-lg"><FolderHeart className="w-4 h-4" /></button>
          </div>
          <button className="px-3 py-1.5 bg-white text-black font-extrabold rounded-full text-xs">Templates</button>
        </div>

        {/* Hero Video Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-cyan-950/60 border border-cyan-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frame to <span className="text-cyan-400">Video</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm">
              Bring still images to life with motion trajectories using Seedance 2.0.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 w-full md:w-64 h-36 shrink-0 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
              alt="Bowling Alley Motion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-black shadow-lg">
                <Play className="w-5 h-5 fill-black pl-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Templates Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative h-64 rounded-2xl overflow-hidden border border-[#252836] bg-black group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" alt="Clouds" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-left">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white">Cumulus Cloud Animation</span>
              <span className="text-[10px] text-cyan-300">Seedance 2.0 • 4s</span>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden border border-[#252836] bg-black group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80" alt="Dog" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-left">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white">Dog Walking on Wet Street</span>
              <span className="text-[10px] text-cyan-300">Seedance 2.0 • 4s</span>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden border border-[#252836] bg-black group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" alt="Portal" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-left">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white">Sci-Fi Portal Gate</span>
              <span className="text-[10px] text-cyan-300">Seedance 2.0 • 4s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. CREATE CHARACTER VIEW (Screenshot 2 & Screenshot 8)
  const renderCreateCharacterPanel = () => (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0d0e12]">
      {/* Left Column */}
      <div className="w-full bg-[#12141a] border-b border-[#222430] p-4 md:p-6 space-y-4 shrink-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <ChevronLeftIcon onClick={() => setActiveTab('home')} />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Character</h2>
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" />
            </div>
          </div>

          {/* Top Quick Cards: Create Character & Browse Library */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-[#181b24] border border-[#2b2e3f] hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 cursor-pointer">
              <User className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Create Character +</span>
            </div>

            <div className="p-3 bg-[#181b24] border border-[#2b2e3f] hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 cursor-pointer">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-pink-500" />
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <div className="w-4 h-4 rounded-full bg-amber-500" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Browse Library ›</span>
            </div>
          </div>

          {/* Quick Starts Cards */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Quick Starts</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative h-32 rounded-2xl overflow-hidden border border-[#2b2e3f] group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="Beach Girl" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-1.5 left-1.5 bg-amber-500 text-black px-1.5 py-0.5 rounded text-[9px] font-extrabold">New</div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[11px] font-extrabold text-slate-900 dark:text-white truncate drop-shadow">Create Character</div>
              </div>

              <div className="relative h-32 rounded-2xl overflow-hidden border border-[#2b2e3f] group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80" alt="Dog Glasses" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute bottom-1.5 left-1.5 bg-pink-600/90 text-slate-900 dark:text-white px-2 py-0.5 rounded-full text-[9px] font-bold">@fluffy in glasses ✨</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {renderFloatingModeBar()}
        </div>
      </div>

      {/* Right Templates Grid */}
      <div className="flex-1 bg-[#0d0e12] p-4 md:p-6 space-y-5 min-w-0">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-purple-950/40 to-indigo-950/60 border border-emerald-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create <span className="text-emerald-400">Character</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm">
              Design original consistent characters from any idea or image.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 w-full md:w-64 h-36 shrink-0 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=600&q=80" alt="Beach Ball Girl" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Character Library Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { name: 'Blake', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
            { name: 'Bram', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
            { name: 'Ethan', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80' },
            { name: 'Freya', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }
          ].map((c, i) => (
            <div key={i} className="bg-[#151720] border border-[#252836] hover:border-emerald-500 rounded-2xl p-2 space-y-2 group cursor-pointer">
              <div className="h-44 rounded-xl overflow-hidden bg-black">
                <img src={c.url} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block text-center">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 4. CREATE WORLD VIEW (Screenshot 3 & Screenshot 7)
  const renderCreateWorldPanel = () => (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0d0e12]">
      {/* Left Column */}
      <div className="w-full bg-[#12141a] border-b border-[#222430] p-4 md:p-6 space-y-4 shrink-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <ChevronLeftIcon onClick={() => setActiveTab('home')} />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">World</h2>
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-[#181b24] border border-[#2b2e3f] hover:border-amber-500 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 cursor-pointer">
              <Globe className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Create World +</span>
            </div>

            <div className="p-3 bg-[#181b24] border border-[#2b2e3f] hover:border-amber-500 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 cursor-pointer">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <div className="w-4 h-4 rounded-full bg-cyan-500" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Browse Library ›</span>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Quick Starts</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative h-32 rounded-2xl overflow-hidden border border-[#2b2e3f] group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Futuristic City" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur text-slate-900 dark:text-white px-2 py-0.5 rounded-full text-[9px] font-bold">Futuristic city ✨</div>
              </div>

              <div className="relative h-32 rounded-2xl overflow-hidden border border-[#2b2e3f] group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80" alt="Santorini" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute bottom-1.5 left-1.5 bg-cyan-600/90 text-slate-900 dark:text-white px-2 py-0.5 rounded-full text-[9px] font-bold">3D World Cam</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {renderFloatingModeBar()}
        </div>
      </div>

      {/* Right Gallery */}
      <div className="flex-1 bg-[#0d0e12] p-4 md:p-6 space-y-5 min-w-0">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-cyan-950/60 border border-amber-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create <span className="text-amber-400">World</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm">
              Build immersive worlds from any idea or image.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 w-full md:w-64 h-36 shrink-0 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Castle World" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Mountain Lake at Sunset', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
            { title: 'Grand Pastel Hotel Lobby', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
            { title: 'Whimsical Candy Land', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80' }
          ].map((w, i) => (
            <div key={i} className="bg-[#151720] border border-[#252836] hover:border-amber-500 rounded-2xl p-2 space-y-2 group cursor-pointer">
              <div className="h-40 rounded-xl overflow-hidden bg-black">
                <img src={w.url} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block text-center break-words whitespace-normal leading-snug">{w.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 5. CREATE AUDIO VIEW (Screenshot 1 & Screenshot 7)
  const renderCreateAudioPanel = () => (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0d0e12]">
      {/* Left Form */}
      <div className="w-full bg-[#12141a] border-b border-[#222430] p-4 md:p-6 space-y-4 shrink-0">
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <ChevronLeftIcon onClick={() => setActiveTab('home')} />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Create voice-over</h2>
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" />
            </div>
            <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400 cursor-pointer" />
          </div>

          {/* Model Card */}
          <div className="p-3 bg-[#181b24] border border-[#2b2e3f] rounded-2xl flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3 flex-wrap max-w-full">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-xs">
                ║║
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block uppercase">Audio Model</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{selectedAudioModel}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>

          {/* Prompt Box */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Prompt</span>
            <div className="bg-[#171a23] border border-[#2a2e3e] rounded-2xl p-3 space-y-3">
              <textarea
                rows={4}
                value={audioPromptText}
                onChange={(e) => setAudioPromptText(e.target.value)}
                placeholder="Enter your voice-over prompt..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-[#252838]">
                <Trash2 className="w-3.5 h-3.5 hover:text-rose-400 cursor-pointer" onClick={() => setAudioPromptText('')} />
                <span>0/10,000</span>
              </div>
            </div>
          </div>

          {/* Preset Prompts Pills */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Podcast Intro', 'Product Explainer', 'Ad Teaser', 'Brand Story'].map((p) => (
              <button
                key={p}
                onClick={() => setAudioPromptText(`[${p}] Welcome to Maxy Academy AI Studio. Today we explore OpenArt features.`)}
                className="p-2.5 bg-[#181b24] border border-[#2b2e3f] hover:border-purple-500 rounded-xl font-medium text-slate-600 dark:text-slate-300 text-left truncate"
              >
                ≡ {p}
              </button>
            ))}
          </div>

          {/* Voice Selector */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Voice</span>
            <div className="p-3 bg-[#181b24] border border-[#2b2e3f] hover:border-purple-500 rounded-2xl flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3 flex-wrap max-w-full">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-300 to-amber-500 flex items-center justify-center font-extrabold text-black text-sm">
                  T
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{selectedVoice}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block break-words whitespace-normal leading-snug max-w-[180px]">social_media · female · central...</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 space-y-3 border-t border-[#222430]">
          <button
            onClick={() => handleGenerate(5)}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-[#d946ef] via-[#c026d3] to-[#a855f7] hover:brightness-110 text-slate-900 dark:text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Audio...</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">✨ 5</span>
              </>
            )}
          </button>

          {renderFloatingModeBar()}
        </div>
      </div>

      {/* Right Panel: Empty Folder State (Screenshot 1 & Screenshot 7) */}
      <div className="flex-1 bg-[#0d0e12] p-6 flex flex-col items-center justify-center text-center space-y-4 min-w-0">
        <div className="w-20 h-20 rounded-3xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-xl">
          <Folder className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Nothing here yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">Generate your first voice-over file to see audio waveforms here.</p>
        </div>
        <button
          onClick={() => handleGenerate(5)}
          className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-slate-900 dark:text-white font-extrabold text-xs rounded-full shadow-lg flex items-center gap-1.5 flex-wrap max-w-full"
        >
          <span>✨ Go Generate</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // 6. HOME VIEW (Screenshot 11)
  const renderHomePanel = () => (
    <div className="flex-1 bg-[#0d0e12] p-6 overflow-y-auto space-y-8 text-center min-w-0">
      {/* Hero Header */}
      <div className="max-w-2xl mx-auto space-y-4 pt-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What would you like <br />
          to create today? <span className="inline-block">🪄</span>
        </h1>

        {/* Quick Tool Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button onClick={() => setActiveTab('director')} className="px-3.5 py-2 bg-[#181a24] hover:bg-[#202330] border border-[#2a2d3f] rounded-2xl text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap max-w-full">
            <Film className="w-3.5 h-3.5 text-pink-400" />
            <span>Director</span>
            <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-extrabold">NEW</span>
          </button>

          <button onClick={() => setActiveTab('video')} className="px-3.5 py-2 bg-[#181a24] hover:bg-[#202330] border border-[#2a2d3f] rounded-2xl text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap max-w-full">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>Video v</span>
          </button>

          <button onClick={() => setActiveTab('image')} className="px-3.5 py-2 bg-[#181a24] hover:bg-[#202330] border border-[#2a2d3f] rounded-2xl text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap max-w-full">
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>Image v</span>
          </button>

          <button onClick={() => setActiveTab('character')} className="px-3.5 py-2 bg-[#181a24] hover:bg-[#202330] border border-[#2a2d3f] rounded-2xl text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap max-w-full">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Character v</span>
          </button>

          <button onClick={() => setActiveTab('world')} className="px-3.5 py-2 bg-[#181a24] hover:bg-[#202330] border border-[#2a2d3f] rounded-2xl text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap max-w-full">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>World v</span>
          </button>

          <button onClick={() => setActiveTab('audio')} className="px-3.5 py-2 bg-[#181a24] hover:bg-[#202330] border border-[#2a2d3f] rounded-2xl text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap max-w-full">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Audio v</span>
          </button>
        </div>
      </div>

      {/* Feature Cards Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
        <div className="relative h-44 rounded-3xl overflow-hidden border border-[#252838] bg-black group cursor-pointer p-4 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" alt="Discount" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
          <span className="relative z-10 self-start bg-black/70 backdrop-blur text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/40">Upgrade to unlock</span>
          <span className="relative z-10 font-extrabold text-sm text-slate-900 dark:text-white leading-tight">Up to 40% OFF for the hottest models</span>
        </div>

        <div className="relative h-44 rounded-3xl overflow-hidden border border-[#252838] bg-black group cursor-pointer p-4 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80" alt="Seedance" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
          <span className="relative z-10 self-start bg-black/70 backdrop-blur text-cyan-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-cyan-500/40">Try Now</span>
          <div>
            <span className="relative z-10 font-extrabold text-sm text-slate-900 dark:text-white block">Seedance 2.0 Mini</span>
            <span className="relative z-10 text-[11px] text-cyan-300 block font-semibold">2x Faster · 50% Cheaper</span>
          </div>
        </div>

        <div className="relative h-44 rounded-3xl overflow-hidden border border-[#252838] bg-black group cursor-pointer p-4 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" alt="GPT Image" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
          <span className="relative z-10 self-start bg-black/70 backdrop-blur text-pink-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-pink-500/40">Try Now</span>
          <span className="relative z-10 font-extrabold text-sm text-slate-900 dark:text-white leading-tight">GPT Image 2.0 — A New Era of Image Generation</span>
        </div>

        <div className="relative h-44 rounded-3xl overflow-hidden border border-[#252838] bg-black group cursor-pointer p-4 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" alt="Video Model" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
          <span className="relative z-10 self-start bg-black/70 backdrop-blur text-purple-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-500/40">Try Now</span>
          <span className="relative z-10 font-extrabold text-sm text-slate-900 dark:text-white leading-tight">Seedance 2.0 — World's Most Powerful Video Model</span>
        </div>
      </div>

      <div className="pt-6">
        <h2 className="text-2xl font-black text-pink-500 tracking-wider uppercase pb-4">
          Vibe Direct Now
        </h2>
      </div>
    </div>
  );

  // Helper Chevron Icon
  function ChevronLeftIcon({ onClick }: { onClick: () => void }) {
    return (
      <button onClick={onClick} className="p-1 rounded-lg hover:bg-[#202330] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">
        <ArrowLeft className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="w-full space-y-3 font-sans">
      {/* MODE TOGGLE BAR (Desktop vs Mobile simulator switch) */}
      <div className="flex items-center justify-between p-2.5 bg-[#121318] border border-[#222432] rounded-2xl shadow-md text-xs">
        <div className="flex items-center gap-2 px-1 flex-wrap max-w-full">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="font-bold text-slate-700 dark:text-slate-200">OpenArt Studio Replica:</span>
        </div>
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-[#2a2d3e] flex-wrap max-w-full">
          <button
            onClick={() => {
              setViewMode('desktop');
              setIsMobileDrawerOpen(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'desktop' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            Desktop View
          </button>
          <button
            onClick={() => {
              setViewMode('mobile');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'mobile' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            Mobile View
          </button>
        </div>
      </div>

      {/* CANVAS CONTAINER */}
      <div className={`w-full bg-[#0d0e12] border border-[#222432] shadow-2xl overflow-hidden font-sans relative flex flex-col ${
        viewMode === 'mobile' ? 'max-w-md mx-auto rounded-3xl min-h-[640px]' : 'rounded-2xl h-[680px]'
      }`}>
        {/* Top Navbar */}
        {renderTopNavbar()}

        {/* Main Content Body */}
        <div className="flex-1 flex overflow-hidden relative min-w-0">
          {viewMode === 'desktop' && renderDesktopSidebar()}

          {/* Active Tab View Render */}
          {activeTab === 'home' && renderHomePanel()}
          {activeTab === 'image' && renderCreateImagePanel()}
          {activeTab === 'video' && renderCreateVideoPanel()}
          {activeTab === 'character' && renderCreateCharacterPanel()}
          {activeTab === 'world' && renderCreateWorldPanel()}
          {activeTab === 'audio' && renderCreateAudioPanel()}
          {activeTab === 'director' && renderHomePanel()}
        </div>

        {/* Mobile Sticky Bottom Nav */}
        {viewMode === 'mobile' && renderMobileBottomNav()}

        {/* Mobile Slide Drawer */}
        {renderMobileDrawer()}

        {/* Info Modal Popup */}
        {activeModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#151720] border border-purple-500/50 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#252838] pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                    {activeModal.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{activeModal.title}</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg hover:bg-[#202330] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{activeModal.description}</p>

              <div className="space-y-2 bg-[#1a1d29] p-3 rounded-2xl border border-[#2b2e40]">
                <span className="text-[11px] font-extrabold text-slate-900 dark:text-white block">✨ Fitur Utama:</span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                  {activeModal.keyFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-2xl text-xs text-purple-200">
                <span className="font-bold block mb-1">💡 Cara Menggunakan:</span>
                <span>{activeModal.howToUse}</span>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl shadow-lg"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
