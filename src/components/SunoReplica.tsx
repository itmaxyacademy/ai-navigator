import React, { useState, useEffect } from 'react';
import {
  Music, Sparkles, Play, Pause, Download, Share2, Dices, Plus, Sliders,
  Volume2, RotateCcw, RotateCw, X, ChevronDown, ChevronRight, Search,
  Filter, Wand2, Info, List, Radio, Disc, Upload, User, Copy, Check,
  Menu, Headphones, Globe, Zap, ArrowRight, Layers, Layout, RefreshCw,
  Home, Compass, FolderKanban, Bell, Shield, ExternalLink, Sparkle
} from 'lucide-react';

interface SongItem {
  id: string;
  title: string;
  style: string;
  duration: string;
  lyrics: string;
  createdAt: string;
  waveform: number[];
  isInstrumental: boolean;
}

interface InfoModalData {
  title: string;
  category: string;
  badge: string;
  description: string;
  keyFeatures: string[];
  howToUse: string;
}

export const SunoReplica: React.FC = () => {
  // Navigation Stage: 'landing' (Tahap 1) vs 'dashboard' (Tahap 2)
  const [currentStage, setCurrentStage] = useState<'landing' | 'dashboard'>('landing');

  // Mobile drawer / View tab
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'create' | 'workspace'>('create');

  // Credits & Error State
  const [credits, setCredits] = useState<number>(50);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dashboard Form Mode: 'simple' vs 'custom'
  const [mode, setMode] = useState<'simple' | 'custom'>('simple');
  const [isInstrumental, setIsInstrumental] = useState<boolean>(false);

  // Landing Page State
  const [landingPrompt, setLandingPrompt] = useState<string>(
    'Lagu upbeat EDM & Lofi tentang semangat belajar AI & coding di Maxy Academy'
  );
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const fullHeadline = 'Bikin lagu apa pun yang kamu bayangkan';

  // Animated Typing Effect for Landing Page
  useEffect(() => {
    if (typingIndex < fullHeadline.length) {
      const timer = setTimeout(() => {
        setTypingIndex((prev) => prev + 1);
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [typingIndex]);

  // Dashboard State inputs
  const [simplePrompt, setSimplePrompt] = useState<string>(
    'Lagu upbeat EDM & Lofi dengan vokal pria berenergi tentang meraih impian di Maxy Academy'
  );
  const [customLyrics, setCustomLyrics] = useState<string>(
    `[Verse 1]\nPagi hari buka laptop di Maxy Academy\nLayar menyala, koding siap dieksekusi\nPrompting AI dengan rumus terstruktur\nLangkah mantap, masa depan tak usah ragu!\n\n[Chorus]\nKita generasi cerdas berdaya AI\nBersama Maxy Academy wujudkan karya nyata!\nInovasi tanpa batas, raih mimpi tertinggi!`
  );
  const [customStyle, setCustomStyle] = useState<string>(
    'Indie Pop, 128 BPM, synthwave, energetic, crisp male vocals'
  );
  const [customTitle, setCustomTitle] = useState<string>('Langkah AI Maxy Academy');

  // Generation & Audio Player State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSongs, setGeneratedSongs] = useState<SongItem[]>([
    {
      id: 'song-1',
      title: 'Langkah AI Maxy Academy v1',
      style: 'Indie Pop, Synthwave, 128 BPM',
      duration: '2:45',
      isInstrumental: false,
      lyrics: '[Verse 1]\nPagi hari buka laptop di Maxy Academy...\n[Chorus]\nKita generasi cerdas berdaya AI...',
      createdAt: 'Baru saja',
      waveform: [35, 65, 80, 45, 90, 100, 70, 85, 40, 60, 95, 80, 50, 75, 90, 65, 40, 85, 90, 55, 70, 80, 45, 90],
    },
    {
      id: 'song-2',
      title: 'Semangat Koding Malam Maxy',
      style: 'Chill Lofi Hip-Hop, 88 BPM, Rhodes Piano',
      duration: '3:10',
      isInstrumental: true,
      lyrics: '(Instrumental Track - Tanpa Vokal)',
      createdAt: '10 menit yang lalu',
      waveform: [20, 40, 35, 50, 60, 45, 55, 70, 65, 50, 40, 60, 55, 70, 65, 80, 60, 45, 50, 40, 35, 50, 60, 40],
    },
  ]);

  const [activeSongId, setActiveSongId] = useState<string | null>('song-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [songProgress, setSongProgress] = useState<number>(30);

  // Simulated player playback progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSongProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Modal Info & Toast State
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Info Dictionary for All Suno AI Navigation & Features
  const infoDictionary: Record<string, InfoModalData> = {
    'menu-beranda': {
      title: 'Menu Beranda (Home)',
      category: 'Navigasi Suno AI',
      badge: 'Utama',
      description: 'Halaman utama tempat pengguna mengeksplorasi tren musik AI terbaru, lagu-lagu populer karya komunitas global, serta rekomendasi gaya lagu terkini.',
      keyFeatures: [
        'Melihat tren musik AI yang paling sering diputar',
        'Inspirasi prompt dan struktur lirik terbaik',
        'Akses cepat ke pembuatan lagu baru'
      ],
      howToUse: 'Klik "Beranda" untuk melihat katalog inspirasi musik utama Suno AI.'
    },
    'menu-jelajahi': {
      title: 'Menu Jelajahi (Explore)',
      category: 'Navigasi Suno AI',
      badge: 'Discovery',
      description: 'Fitur pencarian dan eksplorasi lagu AI berdasarkan genre (Pop, Lofi, Synthwave, Rock, EDM, Jazz), tempo BPM, serta suasana hati (mood).',
      keyFeatures: [
        'Filter musik berdasarkan instrumen dan genre',
        'Penyaringan berdasarkan kecepatan tempo & vokal',
        'Salin prompt dari lagu populer yang disukai'
      ],
      howToUse: 'Klik "Jelajahi", pilih kategori genre atau ketik kata kunci musik untuk menemukan lagu sampel.'
    },
    'menu-buat': {
      title: 'Menu Buat (Create)',
      category: 'Navigasi Suno AI',
      badge: 'Fitur Inti',
      description: 'Modul pembuat musik generatif utama Suno v4.5 yang mengubah naskah teks atau lirik terstruktur menjadi 2 versi lagu utuh berkualitas rekaman studio.',
      keyFeatures: [
        'Mode Sederhana (Simple Prompting)',
        'Mode Lanjutan (Custom Lyrics, Style & Title)',
        'Opsi Instrumental tanpa vokal'
      ],
      howToUse: 'Pilih "Buat", isi prompt atau lirik lagu, lalu klik tombol "Buat Lagu".'
    },
    'menu-studio': {
      title: 'Menu Studio Audio',
      category: 'Navigasi Suno AI',
      badge: 'Advanced Editor',
      description: 'Area kerja pengeditan vokal & instrumen tingkat lanjut untuk melakukan pemisahan trek (stem separation), mengedit vokal, dan mastering.',
      keyFeatures: [
        'Pemisahan trek Vokal & Instrumen',
        'Mastering equalizer & efek audio',
        'Pengaturan durasi & kesinambungan lagu'
      ],
      howToUse: 'Klik "Studio" untuk membuka alat pengeditan dan eksperimen audio lanjutan.'
    },
    'menu-pustaka': {
      title: 'Menu Pustaka Lagu (Library)',
      category: 'Navigasi Suno AI',
      badge: 'Workspace',
      description: 'Daftar pustaka tempat menyimpan seluruh koleksi lagu kreasi sendiri, unduhan berkas MP3, lirik terstruktur, dan riwayat generasi audio.',
      keyFeatures: [
        'Manajemen riwayat hasil pembuatan musik',
        'Unduh berkas audio MP3 resolusi tinggi',
        'Salin dan buat variasi lagu baru'
      ],
      howToUse: 'Klik "Pustaka Lagu" untuk mengakses dan mengunduh seluruh lagu buatan Anda.'
    },
    'menu-profile': {
      title: 'Profil Akun Maxy AI',
      category: 'Akun & Lisensi',
      badge: 'Unlimited Plan',
      description: 'Informasi status akun pengguna terintegrasi dengan akses tak terbatas (Unlimited Credits) dari lisensi resmi Maxy Academy AI Studio.',
      keyFeatures: [
        'Akses mesin sintesis Suno AI v4.5 tanpa batas',
        'Generasi 2 versi lagu bersamaan secara gratis',
        'Penyimpanan cloud tak terbatas untuk hasil karya'
      ],
      howToUse: 'Informasi akun aktif Anda otomatis terhubung dengan Maxy Academy.'
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Random Prompt Ideas Generator (Dice Button)
  const randomPrompts = [
    'Lagu pop Indonesia ceria tentang sukses belajar AI Software Engineer di Maxy Academy',
    'Cyberpunk Synthwave 140 BPM instrumental untuk latar koding malam hari',
    'Akustik Folk hangat tentang perjalanan karir teknologi bersama komunitas Maxy',
    'Orchestral Cinematic menggelegar untuk video kelulusan sertifikasi AI',
  ];

  const handleRandomizePrompt = () => {
    const randomChoice = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    if (currentStage === 'landing') {
      setLandingPrompt(randomChoice);
    } else {
      setSimplePrompt(randomChoice);
    }
    if (errorMessage) setErrorMessage(null);
    showToast('💡 Prompt acak berhasil dimasukkan!');
  };

  // Auto Generate Lyrics Handler for Custom Mode
  const handleAutoGenerateLyrics = () => {
    setCustomLyrics(
      `[Intro - Upbeat Synth]\n\n[Verse 1]\nDi kelas Maxy Academy kita belajar bersama\nMenguasai prompt engineering dan logika masa depan\nTak ada kata menyerah dalam setiap tantangan!\n\n[Pre-Chorus]\nKetika algoritma berpadu dengan imajinasi\n\n[Chorus]\nFly high, raih prestasi bersama Maxy AI!\nLagu ini bukti karya tanpa batas!\n\n[Outro - Fade Out]`
    );
    if (errorMessage) setErrorMessage(null);
    showToast('✨ Lirik otomatis berhasil digenerasi oleh AI!');
  };

  // Trigger Song Generation Handler
  const handleGenerateSong = async (promptOverride?: string) => {
    const promptToUse = promptOverride !== undefined ? promptOverride : (mode === 'simple' ? simplePrompt : customLyrics);

    if (mode === 'simple' && (!promptToUse || !promptToUse.trim())) {
      setErrorMessage('Deskripsi lagu tidak boleh kosong! Silakan ketik naskah atau gunakan tombol Acak.');
      showToast('❌ Deskripsi lagu kosong!');
      return;
    }

    if (mode === 'custom' && (!customLyrics.trim() && !customStyle.trim() && !customTitle.trim())) {
      setErrorMessage('Mohon isi minimal salah satu bidang (Lirik, Gaya, atau Judul Lagu)!');
      showToast('❌ Form Lanjutan kosong!');
      return;
    }

    if (credits < 2) {
      setErrorMessage('Kredit Anda tidak mencukupi! Anda memerlukan minimal 2 kredit per generasi lagu.');
      showToast('❌ Kredit tidak mencukupi!');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    showToast('🚀 Memproses generasi 2 versi lagu AI Suno v4.5...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const baseTitle = customTitle?.trim() || promptToUse?.trim().slice(0, 30) || 'Lagu Maxy AI';
      const styleTag = customStyle?.trim() || 'Upbeat Indie Pop, 128 BPM, Synthwave';
      const lyricsText = isInstrumental
        ? '(Instrumental Track - Tanpa Vokal)'
        : customLyrics?.trim() ||
          `[Intro - Upbeat Synth]\n\n[Verse 1]\n${promptToUse || 'Langkah awal belajar AI di Maxy Academy'}\nPersiapan matang menuju karir cemerlang\nCoding dan AI menyatu dalam harmoni!\n\n[Chorus]\nKita wujudkan karya musik AI generasi baru!\nSemangat tanpa batas bersama Maxy Academy!\n\n[Outro - Fade Out]`;

      const newVersions: SongItem[] = [
        {
          id: `song-${Date.now()}-1`,
          title: `${baseTitle} (v1)`,
          style: styleTag,
          duration: '2:45',
          isInstrumental: Boolean(isInstrumental),
          lyrics: lyricsText,
          createdAt: 'Baru saja',
          waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 55) + 40),
        },
        {
          id: `song-${Date.now()}-2`,
          title: `${baseTitle} (v2 Chill Remix)`,
          style: `${styleTag} - Acoustic Chill`,
          duration: '2:30',
          isInstrumental: Boolean(isInstrumental),
          lyrics: lyricsText,
          createdAt: 'Baru saja',
          waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 55) + 40),
        },
      ];

      const newCredits = Math.max(0, credits - 2);
      setCredits(newCredits);
      setGeneratedSongs((prev) => [...newVersions, ...prev]);

      if (newVersions.length > 0) {
        setActiveSongId(newVersions[0].id);
      }
      setIsPlaying(true);
      setSongProgress(5);
      setCurrentStage('dashboard');
      showToast(`🎉 2 Versi lagu berhasil dibuat secara luring! Sisa kredit: ${newCredits}`);
    } catch (err: any) {
      console.error('Song generation error:', err);
      setErrorMessage('Terjadi kesalahan saat memproses lagu.');
      showToast('❌ Gagal membuat lagu.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Play/Pause Toggle
  const handleTogglePlay = (id: string) => {
    if (activeSongId === id) {
      setIsPlaying(!isPlaying);
      showToast(!isPlaying ? '▶️ Memutar musik Suno...' : '⏸️ Musik dipause.');
    } else {
      setActiveSongId(id);
      setIsPlaying(true);
      showToast('▶️ Memutar lagu yang dipilih...');
    }
  };

  // Active Song Helper
  const activeSong = generatedSongs.find((s) => s.id === activeSongId) || generatedSongs[0];

  return (
    <div className="w-full bg-[#090b10] text-slate-800 dark:text-slate-100 rounded-2xl overflow-hidden border border-[#1b2133] shadow-2xl font-sans relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-pink-600 to-orange-600 text-slate-900 dark:text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-pink-400/40 animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 flex-wrap max-w-full">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Stage Navigation Switcher Header */}
      <div className="bg-[#0f121d] border-b border-[#1b2030] px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 flex-wrap max-w-full">
          <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] tracking-wide">
            SUNO AI V4.5
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
            Modul 17: Sintesis Musik & Songwriting
          </span>
        </div>

        {/* Stage Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-[#080a0f] p-1 rounded-xl border border-[#1e2436] flex-wrap max-w-full">
          <button
            onClick={() => {
              setCurrentStage('landing');
              showToast('Dialihkan ke Tahap 1: Landing Page Suno');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentStage === 'landing'
                ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            Tahap 1: Landing Page
          </button>

          <button
            onClick={() => {
              setCurrentStage('dashboard');
              showToast('Dialihkan ke Tahap 2: Dashboard Create');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentStage === 'dashboard'
                ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            Tahap 2: Dashboard Create
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAHAP 1: LANDING PAGE SUNO                                               */}
      {/* ========================================================================= */}
      {currentStage === 'landing' && (
        <div className="p-6 md:p-10 space-y-8 bg-gradient-to-b from-[#0e111a] via-[#090b10] to-[#0d0f18] min-h-[620px] relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Landing Header Bar */}
          <div className="flex items-center justify-between relative z-10 border-b border-[#1b2030] pb-5">
            <div className="flex items-center gap-3 flex-wrap max-w-full">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center text-slate-900 dark:text-white font-black text-lg shadow-lg shadow-pink-500/20">
                S
              </div>
              <span className="text-xl font-black tracking-widest text-slate-900 dark:text-white">SUNO</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold flex-wrap max-w-full">
              <button
                onClick={() => {
                  setCurrentStage('dashboard');
                  showToast('Masuk ke Dashboard Suno...');
                }}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  setCurrentStage('dashboard');
                  showToast('Selamat datang di Suno AI Maxy Academy!');
                }}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-slate-900 dark:text-white rounded-xl shadow-lg shadow-pink-600/25 transition-all active:scale-95"
              >
                Gabung Maxy Academy gratis
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold flex-wrap max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Sintesis Musik AI Generatif Terdepan</span>
            </div>

            {/* Typing Effect Headline */}
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight min-h-[60px]">
              {fullHeadline.slice(0, typingIndex)}
              <span className="inline-block w-1 h-8 md:h-10 bg-pink-500 ml-1 animate-pulse align-middle" />
            </h1>

            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Ubah ide, cerita, atau suasana hati Anda menjadi musik bertaraf studio dalam hitungan detik. Cukup ketik deskripsi lagu yang Anda bayangkan!
            </p>

            {/* Input Box: Chat untuk bikin musik */}
            <div className="bg-[#111422] border border-[#23293e] hover:border-pink-500/50 rounded-3xl p-4 shadow-2xl space-y-3 transition-colors text-left max-w-2xl mx-auto mt-6">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold px-1">
                <span className="flex items-center gap-1.5 text-pink-400 flex-wrap max-w-full">
                  <Wand2 className="w-4 h-4" />
                  Chat untuk bikin musik
                </span>
                <span className="text-[10px] text-slate-500 font-mono">v4.5 Engine</span>
              </div>

              <textarea
                value={landingPrompt}
                onChange={(e) => setLandingPrompt(e.target.value)}
                placeholder="Deskripsikan lagu yang ingin Anda buat (mis. genre, vokal, suasana)..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none min-h-[80px] leading-relaxed"
              />

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1a2032]">
                <div className="flex flex-wrap items-center gap-2">
                  {/* (+) Tambah Referensi Button */}
                  <button
                    onClick={() => {
                      setActiveModalKey('btn-plus');
                      showToast('Fungsi (+): Menambahkan sampel audio/referensi melodi');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181d2c] hover:bg-[#232a3f] text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold border border-[#2a324b] transition-colors flex-wrap max-w-full"
                  >
                    <Plus className="w-3.5 h-3.5 text-pink-400" />
                    <span>(+) Referensi</span>
                  </button>

                  {/* Tombol Lanjutan Button */}
                  <button
                    onClick={() => {
                      setMode('custom');
                      setCurrentStage('dashboard');
                      showToast('Membuka Opsi Lanjutan (Custom Mode)...');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181d2c] hover:bg-[#232a3f] text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold border border-[#2a324b] transition-colors flex-wrap max-w-full"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lanjutan</span>
                  </button>

                  {/* Dice / Random Button */}
                  <button
                    onClick={handleRandomizePrompt}
                    className="p-2 bg-[#181d2c] hover:bg-[#232a3f] text-slate-600 dark:text-slate-300 rounded-xl border border-[#2a324b] transition-colors"
                    title="Acak Prompt Inspirasi Musik"
                  >
                    <Dices className="w-4 h-4 text-orange-400" />
                  </button>
                </div>

                {/* Tombol "Buat" (Gradient Pink-Orange) */}
                <button
                  onClick={() => {
                    setSimplePrompt(landingPrompt);
                    handleGenerateSong(landingPrompt);
                  }}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 hover:from-pink-500 hover:to-orange-400 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex-wrap max-w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses Musik...</span>
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4" />
                      <span>Buat Lagu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Media Partner Logos (Generic / Neutral) */}
          <div className="pt-8 text-center space-y-3 relative z-10 border-t border-[#181d2a]">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dipercaya oleh Kreator & Komunitas Audio Global
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-70 text-slate-500 dark:text-slate-400 font-extrabold text-xs">
              <span className="flex items-center gap-1.5 hover:text-pink-400 transition-colors flex-wrap max-w-full">
                <Headphones className="w-4 h-4" /> TECH BEATS
              </span>
              <span className="flex items-center gap-1.5 hover:text-orange-400 transition-colors flex-wrap max-w-full">
                <Globe className="w-4 h-4" /> GLOBAL MUSIC AI
              </span>
              <span className="flex items-center gap-1.5 hover:text-purple-400 transition-colors flex-wrap max-w-full">
                <Disc className="w-4 h-4" /> SOUNDX STUDIO
              </span>
              <span className="flex items-center gap-1.5 hover:text-amber-400 transition-colors flex-wrap max-w-full">
                <Zap className="w-4 h-4" /> MAXY AUDIO LAB
              </span>
              <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors flex-wrap max-w-full">
                <Radio className="w-4 h-4" /> FUTURE SOUND
              </span>
            </div>
          </div>

          {/* Button Explanation Guide Cards */}
          <div className="bg-[#0f121e] border border-[#1d2335] rounded-2xl p-5 space-y-3 text-xs relative z-10 max-w-4xl mx-auto">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 flex-wrap max-w-full">
              <Info className="w-4 h-4 text-pink-400" />
              Penjelasan Fungsi Tombol Input Landing Page Suno:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-slate-600 dark:text-slate-300">
              <div className="bg-[#080a10] border border-[#1a1f30] p-3 rounded-xl space-y-1">
                <span className="font-bold text-pink-400 flex items-center gap-1 flex-wrap max-w-full">
                  <Plus className="w-3.5 h-3.5" /> (+) Referensi
                </span>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Mengunggah sampel lagu/suara acuan sebagai referensi gaya, tempo, atau irama lagu yang akan disintesis oleh AI.
                </p>
              </div>

              <div className="bg-[#080a10] border border-[#1a1f30] p-3 rounded-xl space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1 flex-wrap max-w-full">
                  <Sliders className="w-3.5 h-3.5" /> Tombol Lanjutan
                </span>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Membuka Custom Mode untuk mengatur lirik terpisah, tag gaya instrumen/genre, serta menuliskan judul lagu kreasi sendiri.
                </p>
              </div>

              <div className="bg-[#080a10] border border-[#1a1f30] p-3 rounded-xl space-y-1">
                <span className="font-bold text-orange-400 flex items-center gap-1 flex-wrap max-w-full">
                  <Dices className="w-3.5 h-3.5" /> Tombol Dice
                </span>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Mengacak ide deskripsi prompt lagu secara otomatis untuk memicu inspirasi genre dan cerita unik bagi pengguna.
                </p>
              </div>

              <div className="bg-[#080a10] border border-[#1a1f30] p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-400 flex items-center gap-1 flex-wrap max-w-full">
                  <Music className="w-3.5 h-3.5" /> Tombol Buat
                </span>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Memicu mesin AI Suno v4.5 untuk menghasilkan 2 versi lagu lengkap dan beralih langsung ke Dashboard Workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAHAP 2: DASHBOARD CREATE SUNO                                           */}
      {/* ========================================================================= */}
      {currentStage === 'dashboard' && (
        <div className="flex flex-col lg:flex-row min-h-[640px] bg-[#090b10] overflow-hidden">
          {/* Left Sidebar Menu */}
          <div className="w-full lg:w-56 bg-[#0d0f18] border-r border-[#1b2030] p-4 flex flex-col justify-between shrink-0 sticky top-0 self-start">
            <div className="space-y-5">
              {/* Suno Brand */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-orange-500 flex items-center justify-center text-slate-900 dark:text-white font-black text-base">
                    S
                  </div>
                  <span className="text-lg font-black tracking-widest text-slate-900 dark:text-white">SUNO</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-1.5 bg-[#161a28] rounded-lg text-slate-600 dark:text-slate-300"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              {/* User Account Info Box */}
              <div 
                onClick={() => { setActiveModalKey('menu-profile'); showToast('Membuka detail akun Maxy AI...'); }}
                className="bg-[#131724] border border-[#21273c] hover:border-pink-500/50 rounded-2xl p-3 flex items-center gap-2.5 cursor-pointer transition-colors"
                title="Klik untuk detail Akun"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-slate-900 dark:text-white font-bold flex items-center justify-center text-xs shrink-0">
                  MA
                </div>
                <div className="flex-1 overflow-hidden min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white break-words whitespace-normal leading-snug">wahyudi_maxy_academy</h4>
                  <p className="text-[10px] text-pink-400 font-semibold">Maxy AI (Unlimited)</p>
                </div>
                <Info className="w-3.5 h-3.5 text-slate-500 hover:text-pink-400 shrink-0" />
              </div>

              {/* Sidebar Navigation Items */}
              <nav className={`space-y-1 text-xs ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
                <button
                  onClick={() => { setActiveModalKey('menu-beranda'); showToast('Beranda Suno AI: Halaman tren & inspirasi musik utama'); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#151928] transition-colors"
                  title="Klik untuk informasi menu Beranda"
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4" />
                    <span>Beranda</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 hover:text-pink-400" />
                </button>

                <button
                  onClick={() => { setActiveModalKey('menu-jelajahi'); showToast('Jelajahi: Eksplorasi musik berdasarkan genre & mood'); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#151928] transition-colors"
                  title="Klik untuk informasi menu Jelajahi"
                >
                  <div className="flex items-center gap-3">
                    <Compass className="w-4 h-4" />
                    <span>Jelajahi</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 hover:text-pink-400" />
                </button>

                <button
                  onClick={() => { setMobileTab('create'); setActiveModalKey('menu-buat'); showToast('Buat (Create): Generator lagu & musik AI utama'); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-colors ${
                    mobileTab === 'create'
                      ? 'bg-gradient-to-r from-pink-600/20 to-orange-600/20 text-pink-300 border border-pink-500/40'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#151928]'
                  }`}
                  title="Klik untuk informasi menu Buat"
                >
                  <div className="flex items-center gap-3">
                    <Music className={`w-4 h-4 ${mobileTab === 'create' ? 'text-pink-400' : ''}`} />
                    <span>Buat (Create)</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-pink-400" />
                </button>

                <button
                  onClick={() => { setActiveModalKey('menu-studio'); showToast('Studio Audio: Fitur pengeditan & pemisahan vokal/instrumen'); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#151928] transition-colors"
                  title="Klik untuk informasi menu Studio"
                >
                  <div className="flex items-center gap-3">
                    <Radio className="w-4 h-4" />
                    <span>Studio</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 hover:text-pink-400" />
                </button>

                <button
                  onClick={() => { setMobileTab('workspace'); setActiveModalKey('menu-pustaka'); showToast('Pustaka Lagu: Menyimpan koleksi & unduhan MP3 Anda'); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-colors ${
                    mobileTab === 'workspace'
                      ? 'bg-gradient-to-r from-pink-600/20 to-orange-600/20 text-pink-300 border border-pink-500/40'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#151928]'
                  }`}
                  title="Klik untuk informasi menu Pustaka Lagu"
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className={`w-4 h-4 ${mobileTab === 'workspace' ? 'text-pink-400' : ''}`} />
                    <span>Pustaka Lagu</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-pink-400" />
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#1b2030] text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
              <p>Maxy Academy AI Learning</p>
              <p className="font-mono text-slate-500 dark:text-slate-400">Version 4.5 • AI Studio</p>
            </div>
          </div>

          {/* Main Area Container (Vertical Stack: Generator Form Top, Song Library Bottom) */}
          <div className="flex-1 flex flex-col overflow-y-auto min-w-0 bg-[#090b10]">
            {/* Top Section: Create Song Form (Full Width) */}
            <div className="w-full bg-[#0f121e] border-b border-[#1b2030] p-4 lg:p-5 space-y-4 shrink-0">
            {/* Top Mode Selector Tabs: Sederhana vs Lanjutan */}
            <div className="flex items-center justify-between border-b border-[#1b2030] pb-3">
              <div className="flex items-center gap-1.5 bg-[#080a10] p-1 rounded-xl border border-[#1a1f30] flex-wrap max-w-full">
                <button
                  onClick={() => {
                    setMode('simple');
                    showToast('Mode Sederhana aktif');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'simple'
                      ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                  }`}
                >
                  Sederhana
                </button>

                <button
                  onClick={() => {
                    setMode('custom');
                    showToast('Mode Lanjutan (Custom) aktif');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'custom'
                      ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                  }`}
                >
                  Lanjutan
                </button>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-[#151a28] text-pink-300 font-mono text-[10px] border border-[#21283d]">
                v4.5-all
              </span>
            </div>

            {/* Quick Option Pills */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-1 flex-wrap max-w-full">
              <button
                onClick={() => showToast('Opsi + Audio: Unggah klip audio')}
                className="px-2.5 py-1 bg-[#161a28] hover:bg-[#20273b] border border-[#232b42] rounded-lg text-slate-600 dark:text-slate-300 shrink-0"
              >
                + Audio
              </button>
              <button
                onClick={() => showToast('Opsi + Suara: Kloning sampel vokal baru')}
                className="px-2.5 py-1 bg-[#161a28] hover:bg-[#20273b] border border-[#232b42] rounded-lg text-slate-600 dark:text-slate-300 shrink-0 flex items-center gap-1 flex-wrap max-w-full"
              >
                + Suara <span className="px-1 py-0.2 bg-pink-600 text-[9px] text-slate-900 dark:text-white rounded font-bold">Baru</span>
              </button>
              <button
                onClick={handleRandomizePrompt}
                className="px-2.5 py-1 bg-[#161a28] hover:bg-[#20273b] border border-[#232b42] rounded-lg text-slate-600 dark:text-slate-300 shrink-0"
              >
                + Inspirasi
              </button>
            </div>

            {/* Error Alert Box */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-red-300 animate-in fade-in">
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400 hover:text-slate-900 dark:text-white shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* FORM SIMPLE MODE */}
            {mode === 'simple' ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Deskripsi Lagu (Song Prompt):</span>
                    <button onClick={handleRandomizePrompt} className="text-pink-400 hover:underline flex items-center gap-1 text-[10px] flex-wrap max-w-full">
                      <Dices className="w-3 h-3" /> Acak
                    </button>
                  </label>
                  <textarea
                    value={simplePrompt}
                    onChange={(e) => {
                      setSimplePrompt(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Mis. lagu upbeat tentang belajar AI di Maxy Academy..."
                    className="w-full bg-[#080a10] border border-[#20263a] rounded-2xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 min-h-[120px] resize-none leading-relaxed"
                  />
                </div>

                {/* Instrumental Toggle Switch */}
                <div className="bg-[#080a10] border border-[#20263a] rounded-2xl p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Instrumental</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Hasilkan musik tanpa vokal/lirik</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsInstrumental(!isInstrumental);
                      showToast(isInstrumental ? 'Toggle Instrumental mati (Dengan Vokal)' : 'Toggle Instrumental aktif (Tanpa Vokal)');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      isInstrumental ? 'bg-pink-600 justify-end' : 'bg-[#1a2030] justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>
            ) : (
              /* FORM CUSTOM MODE */
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Lyrics Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Lirik Lagu (Lyrics):</span>
                    <button
                      onClick={handleAutoGenerateLyrics}
                      className="text-pink-400 hover:underline flex items-center gap-1 text-[10px] flex-wrap max-w-full"
                    >
                      <Sparkles className="w-3 h-3 text-pink-400" /> Auto-Generate Lirik
                    </button>
                  </div>
                  <textarea
                    value={customLyrics}
                    onChange={(e) => {
                      setCustomLyrics(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Tuliskan lirik lagu Anda di sini (gunakan tag [Verse], [Chorus])..."
                    className="w-full bg-[#080a10] border border-[#20263a] rounded-2xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 min-h-[130px] font-mono leading-relaxed"
                  />
                </div>

                {/* Style / Genre Tags */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Gaya Musik (Style Tags):</label>
                  <input
                    type="text"
                    value={customStyle}
                    onChange={(e) => {
                      setCustomStyle(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Mis. Indie Pop, 120 bpm, synthwave, male vocal..."
                    className="w-full bg-[#080a10] border border-[#20263a] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
                  />
                  {/* Genre Quick Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['Indie Pop', 'Synthwave', 'Lofi Chill', 'Orchestral', '128 BPM'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setCustomStyle((prev) => `${prev}, ${tag}`);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className="px-2 py-0.5 bg-[#161a28] hover:bg-[#22293e] text-slate-600 dark:text-slate-300 text-[10px] rounded-md border border-[#242c43]"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title Box */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Judul Lagu (Title):</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => {
                      setCustomTitle(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Judul lagu..."
                    className="w-full bg-[#080a10] border border-[#20263a] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            )}

            {/* Main Generate Button */}
            <button
              onClick={() => handleGenerateSong()}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 hover:from-pink-500 hover:to-orange-400 text-slate-900 dark:text-white font-black text-xs rounded-2xl shadow-xl shadow-pink-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sintesis Musik AI...</span>
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" />
                  <span>Buat Musik (2 Kredit)</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Section: Song Library & Player Details (Full Width) */}
          <div className="w-full p-4 lg:p-5 space-y-5 flex-1 bg-[#090b10]">
            <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-[#1b2030] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap max-w-full">
                  <FolderKanban className="w-4 h-4 text-pink-400" />
                  Workspaces &gt; My Workspace
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Daftar lagu buatan Anda di Suno AI Maxy Academy</p>
              </div>

              <div className="flex items-center gap-2 text-xs flex-wrap max-w-full">
                <span className="px-2.5 py-1 bg-[#131725] text-slate-600 dark:text-slate-300 rounded-lg border border-[#21283e] font-mono text-[10px]">
                  {generatedSongs.length} Lagu
                </span>
              </div>
            </div>

            {/* Generated Songs Cards List */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {generatedSongs.map((song) => {
                const isSelected = activeSongId === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => setActiveSongId(song.id)}
                    className={`bg-[#0f121d] border rounded-2xl p-4 transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-pink-500/80 shadow-xl shadow-pink-600/10 bg-[#121624]'
                        : 'border-[#1e2436] hover:border-[#2b344d]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 w-full min-w-0">
                      <div className="flex items-center gap-3 flex-1 min-w-[200px] w-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlay(song.id);
                          }}
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-slate-900 dark:text-white shadow-lg shrink-0 transition-transform active:scale-90 ${
                            isSelected && isPlaying
                              ? 'bg-gradient-to-tr from-pink-600 to-orange-500'
                              : 'bg-[#1d2336] hover:bg-[#28314a] text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {isSelected && isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5 w-full leading-snug">
                            <span className="truncate max-w-full">{song.title}</span>
                            {song.isInstrumental && (
                              <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[8px] sm:text-[9px] rounded font-semibold shrink-0">
                                Instrumental
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate w-full mt-0.5 leading-snug">{song.style}</p>
                          <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono block w-full mt-1">{song.createdAt} • {song.duration}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 text-xs shrink-0 justify-end w-full sm:w-auto border-t sm:border-0 border-[#1b2030] pt-2 sm:pt-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`Lagu "${song.title}" berhasil diunduh (MP3)!`);
                          }}
                          className="p-2 bg-[#171b2a] hover:bg-[#22293e] text-slate-600 dark:text-slate-300 rounded-xl border border-[#232b42]"
                          title="Unduh MP3"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('Tautan lagu publik berhasil disalin!');
                          }}
                          className="p-2 bg-[#171b2a] hover:bg-[#22293e] text-slate-600 dark:text-slate-300 rounded-xl border border-[#232b42]"
                          title="Bagikan Lagu"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomTitle(`${song.title} Variation`);
                            setCustomStyle(song.style);
                            setMode('custom');
                            showToast('Prompt disalin untuk variasi baru!');
                          }}
                          className="px-2.5 py-1.5 bg-gradient-to-r from-pink-600/30 to-orange-600/30 hover:from-pink-600/50 hover:to-orange-600/50 text-pink-300 text-[11px] font-bold rounded-xl border border-pink-500/30"
                        >
                          Buat Variasi
                        </button>
                      </div>
                    </div>

                    {/* Waveform Visualization */}
                    <div className="bg-[#080a10] rounded-xl p-2.5 flex items-center gap-[2px] h-9 border border-[#1b2030] min-w-0 overflow-hidden">
                      {song.waveform.map((barHeight, idx) => {
                        const isPlayed = isSelected && isPlaying && idx < 12;
                        return (
                          <div
                            key={idx}
                            style={{ height: `${barHeight}%` }}
                            className={`flex-1 rounded-full transition-all ${
                              isPlayed
                                ? 'bg-gradient-to-t from-pink-500 to-orange-400 animate-pulse'
                                : 'bg-[#1c2234]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Currently Playing Bottom Floating Player Bar */}
            {activeSong && (
              <div className="bg-[#0f1321] border border-pink-500/40 rounded-2xl p-4 space-y-3 shadow-2xl relative">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <Disc className={`w-4 h-4 text-pink-400 ${isPlaying ? 'animate-spin' : ''}`} />
                    <span className="font-bold text-slate-900 dark:text-white">Sedang Diputar: {activeSong.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-pink-400">{activeSong.style}</span>
                </div>

                <div className="flex items-center gap-4 bg-[#080a10] p-3 rounded-xl border border-[#1a1f30] flex-wrap max-w-full">
                  <button
                    onClick={() => handleTogglePlay(activeSong.id)}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-orange-500 text-slate-900 dark:text-white font-bold flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                      <span>0:{Math.min(59, Math.floor(songProgress * 1.5)).toString().padStart(2, '0')}</span>
                      <span>{activeSong.duration}</span>
                    </div>
                    <div className="h-2 bg-[#1c2234] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-orange-500 transition-all duration-300"
                        style={{ width: `${songProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Interactive Feature Info Modal Popup */}
      {activeModalKey && infoDictionary[activeModalKey] && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#111422] border border-[#252c42] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative text-left">
            <button
              onClick={() => setActiveModalKey(null)}
              className="absolute top-4 right-4 p-2 bg-[#1a2032] hover:bg-[#252d47] text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {infoDictionary[activeModalKey].badge} • {infoDictionary[activeModalKey].category}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white pt-1">
                {infoDictionary[activeModalKey].title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {infoDictionary[activeModalKey].description}
            </p>

            <div className="space-y-2 bg-[#090b12] p-3.5 rounded-2xl border border-[#1d2338]">
              <h4 className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Fitur & Keunggulan Utama:
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc">
                {infoDictionary[activeModalKey].keyFeatures.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#151a2a] p-3.5 rounded-2xl border border-[#232b45] space-y-1 text-xs">
              <span className="font-bold text-amber-400 block">💡 Cara Penggunaan:</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{infoDictionary[activeModalKey].howToUse}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalKey(null)}
                className="px-5 py-2 bg-gradient-to-r from-pink-600 to-orange-600 hover:brightness-110 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer"
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
