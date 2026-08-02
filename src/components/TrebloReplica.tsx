import React, { useState, useEffect, useRef } from 'react';
import {
  Music, Sparkles, Play, Pause, Download, Share2, Plus, Sliders,
  Volume2, VolumeX, X, ChevronDown, ChevronRight, Search,
  Filter, Info, Radio, Disc, Upload, User, Copy, Check,
  Menu, Headphones, Globe, Zap, ArrowRight, Heart, Edit2,
  Trash2, ExternalLink, HelpCircle, FileText, Bell, MessageSquare,
  Home, Shield, CheckSquare, Layers, Lock, RotateCcw, Monitor, Smartphone
} from 'lucide-react';

export interface TrebloSong {
  id: string;
  title: string;
  style: string;
  duration: string;
  prompt: string;
  lyrics: string;
  createdAt: string;
  isNew?: boolean;
  isLiked: boolean;
  isInstrumental: boolean;
  coverColor: string;
  waveform: number[];
}

export const TrebloReplica: React.FC = () => {
  // Stage control: 'landing' (Tahap 1) vs 'workspace' (Tahap 2)
  const [stage, setStage] = useState<'landing' | 'workspace'>('landing');

  // Top banner alert in workspace
  const [showTopBanner, setShowTopBanner] = useState<boolean>(true);

  // Landing page prompt
  const [landingPrompt, setLandingPrompt] = useState<string>(
    'Lagu country pop santai tentang jaringan WiFi putus saat lagi presentasi koding AI di Maxy Academy...'
  );

  // Workspace Project Title
  const [projectTitle, setProjectTitle] = useState<string>('Simulasi AI Maxy');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  // Workspace Generate Form state
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');
  const [selectedModel, setSelectedModel] = useState<string>('v3');
  const [workspacePrompt, setWorkspacePrompt] = useState<string>(
    'Lagu country pop santai tentang jaringan WiFi putus saat lagi presentasi koding AI di Maxy Academy'
  );
  const [customTitleInput, setCustomTitleInput] = useState<string>('');
  const [customStyle, setCustomStyle] = useState<string>('country pop, bro-country, acoustic guitar, upbeat male vocals');
  const [customLyricsInput, setCustomLyricsInput] = useState<string>(
    `[Verse 1]\nLagi fokus koding di Maxy Academy\nKode terstruktur, siap untuk di-deploy\nTiba-tiba sinyal WiFi hilang misteri\nLayar terdiam, kawan-kawan pun melambaikan tangan...\n\n[Chorus]\nOoh WiFi putus di tengah sesi!\nTapi semangat AI takkan pernah terhenti!\nRefactor kode, koneksi kembali lagi!`
  );
  const [isInstrumental, setIsInstrumental] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter & Search in song list
  const [listSearch, setListSearch] = useState<string>('');
  const [showLikedOnly, setShowLikedOnly] = useState<boolean>(false);

  // Song Library
  const [songs, setSongs] = useState<TrebloSong[]>([
    {
      id: 'song-1',
      title: 'WiFi Putus Saat Coding',
      style: 'country pop, bro-country, folk/country, acoustic, male vocals',
      duration: '2:45',
      prompt: 'Lagu country pop santai tentang jaringan WiFi putus saat lagi presentasi koding AI di Maxy Academy',
      lyrics: `[Verse 1]\nLagi fokus koding di Maxy Academy\nKode terstruktur, siap untuk di-deploy\nTiba-tiba sinyal WiFi hilang misteri\nLayar terdiam, kawan-kawan pun melambaikan tangan...\n\n[Chorus]\nOoh WiFi putus di tengah sesi!\nTapi semangat AI takkan pernah terhenti!\nRefactor kode, koneksi kembali lagi!\n\n[Verse 2]\nBuka hotspot HP, simpan file lokal\nGemini AI tetap setia bantu jawab semua persoalan\nMaxy Academy bikin kami jadi profesional!`,
      createdAt: '3 menit yang lalu',
      isNew: false,
      isLiked: true,
      isInstrumental: false,
      coverColor: 'bg-gradient-to-br from-indigo-600 to-purple-800',
      waveform: [20, 45, 60, 85, 40, 95, 100, 70, 85, 50, 65, 90, 75, 40, 80, 95, 60, 50, 75, 90, 65, 40, 30, 15]
    },
    {
      id: 'song-2',
      title: 'Irama Prompting Gemini',
      style: 'synthwave, 128 bpm, indie electronic, upbeat synth, energetic',
      duration: '3:27',
      prompt: 'Lagu synthwave futuristik tentang meracik prompt presisi di Google AI Studio bersama Maxy Academy',
      lyrics: `[Verse 1]\nKetik System Instruction, atur Temperature nol koma dua\nJawabannya presisi, tanpa halusinasi yang hampa\nGemini 3 Flash memproses cepat bagai kilat\nBelajar di Maxy Academy terasa begitu hebat!\n\n[Chorus]\nIrama Prompting Gemini bergema di malam hari\nMembangun aplikasi impian yang mandiri!`,
      createdAt: 'Baru saja',
      isNew: true,
      isLiked: false,
      isInstrumental: false,
      coverColor: 'bg-gradient-to-br from-rose-600 to-pink-800',
      waveform: [30, 50, 75, 90, 60, 80, 70, 95, 85, 60, 70, 90, 100, 85, 65, 80, 95, 70, 60, 80, 50, 35, 20, 10]
    },
    {
      id: 'song-3',
      title: 'Melodi Belajar AI (Instrumental)',
      style: 'lofi hip hop, 85 bpm, rhodes piano, chill ambient beats',
      duration: '2:15',
      prompt: 'Musik instrumental Lofi santai untuk mengiringi sesi membaca modul koding AI Maxy Academy',
      lyrics: '(Instrumental Track - Tanpa Vokal)',
      createdAt: '15 menit yang lalu',
      isNew: false,
      isLiked: false,
      isInstrumental: true,
      coverColor: 'bg-gradient-to-br from-emerald-600 to-teal-800',
      waveform: [15, 30, 40, 35, 50, 45, 60, 55, 40, 50, 65, 55, 45, 60, 50, 40, 35, 50, 40, 30, 25, 20, 15, 10]
    }
  ]);

  // Selected Song for Detail Panel
  const [selectedSongId, setSelectedSongId] = useState<string>('song-1');

  // Editing Song Title in List or Panel
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>('');

  // Audio Player State
  const [activePlayerSongId, setActivePlayerSongId] = useState<string | null>('song-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerProgress, setPlayerProgress] = useState<number>(0); // 0 to 100
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Toast notice
  const [toast, setToast] = useState<string | null>(null);
  const [copiedLyrics, setCopiedLyrics] = useState<boolean>(false);

  // Mobile View Toggle in Workspace: 'editor' vs 'list' vs 'detail'
  const [mobileTab, setMobileTab] = useState<'editor' | 'list' | 'detail'>('editor');

  const selectedSong = songs.find(s => s.id === selectedSongId) || songs[0];
  const activePlayerSong = songs.find(s => s.id === activePlayerSongId) || songs[0];

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Simulate audio playback progress
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayerProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Execute Gemini AI Song Generation Call
  const executeGenerateSong = async (
    promptText: string,
    currentMode: 'simple' | 'advanced',
    currentInstrumental: boolean,
    currentStyle: string,
    currentLyrics: string,
    currentTitle: string
  ) => {
    setIsGenerating(true);
    setErrorMessage(null);
    showToastMsg('✨ Mengirim prompt ke Treblo Gemini AI Engine...');

    try {
      // Simulasi delay API backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sengaja throw error agar masuk ke blok fallback pembuat lagu lokal
      throw new Error('Trigger fallback lokal');

      const data = await res.json();
      const versions = data.versions || [];

      if (versions && versions.length > 0) {
        const generatedBatch: TrebloSong[] = versions.map((ver: any, idx: number) => {
          const colors = [
            'bg-gradient-to-br from-rose-600 to-amber-700',
            'bg-gradient-to-br from-blue-600 to-cyan-700',
            'bg-gradient-to-br from-violet-600 to-fuchsia-800',
            'bg-gradient-to-br from-emerald-600 to-lime-700'
          ];
          return {
            id: `song-${Date.now()}-${idx}`,
            title: ver.title || (currentTitle.trim() || (promptText.length > 25 ? promptText.slice(0, 25) + '...' : promptText) || 'Lagu Baru Maxy'),
            style: ver.style || currentStyle || 'pop, electronic, modern production',
            duration: ver.duration || '2:45',
            prompt: promptText || currentTitle || 'Prompt Kustom',
            lyrics: currentInstrumental
              ? '(Track Instrumental - Murni Musik tanpa Vokal)'
              : ver.lyrics || currentLyrics || '[Verse 1]\nLagu AI ciptaanmu.',
            createdAt: 'Baru saja',
            isNew: true,
            isLiked: false,
            isInstrumental: currentInstrumental,
            coverColor: colors[Math.floor(Math.random() * colors.length)],
            waveform: ver.waveform || Array.from({ length: 24 }, () => Math.floor(Math.random() * 60) + 35)
          };
        });

        setSongs(prev => [...generatedBatch, ...prev]);
        setSelectedSongId(generatedBatch[0].id);
        setActivePlayerSongId(generatedBatch[0].id);
        setIsPlaying(true);
        setPlayerProgress(0);
        showToastMsg(`🎵 Lagu "${generatedBatch[0].title}" berhasil di-generate oleh Gemini AI!`);
      } else {
        throw new Error('Format data lagu tidak sesuai.');
      }
    } catch (err: any) {
      console.error('Treblo generate error:', err);
      
      // Fallback local song creation so user experience remains seamless
      const newId = `song-${Date.now()}`;
      const fallbackTitle = currentTitle.trim() || (promptText.length > 25 ? promptText.slice(0, 25) + '...' : promptText) || 'Lagu Baru Maxy';
      const fallbackLyrics = currentInstrumental
        ? '(Track Instrumental - Murni Musik tanpa Vokal)'
        : currentMode === 'advanced' && currentLyrics.trim()
          ? currentLyrics
          : `[Verse 1]\nIde lagu "${promptText}" diproses oleh Treblo AI Engine\nIrama synthwave dan harmoni vokal berpadu indah\nMaxy Academy mewujudkan kreasi musik impianmu!\n\n[Chorus]\nOoh dengarkan melodi baru berirama cepat!\nKreativitas AI tanpa batas di genggamanmu!\n\n[Verse 2]\nLangkah demi langkah meracik prompt yang tepat\nHasil karya musik luar biasa tercipta hebat!\n\n[Outro - Fade Out]`;

      const fallbackSong: TrebloSong = {
        id: newId,
        title: fallbackTitle,
        style: currentMode === 'advanced' ? (currentStyle || 'country pop, acoustic') : 'country pop, upbeat synthwave',
        duration: '2:45',
        prompt: promptText || 'Lagu Kustom',
        lyrics: fallbackLyrics,
        createdAt: 'Baru saja',
        isNew: true,
        isLiked: false,
        isInstrumental: currentInstrumental,
        coverColor: 'bg-gradient-to-br from-rose-600 to-amber-700',
        waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 70) + 30)
      };

      setSongs(prev => [fallbackSong, ...prev]);
      setSelectedSongId(newId);
      setActivePlayerSongId(newId);
      setIsPlaying(true);
      setPlayerProgress(0);
      showToastMsg(`🎵 Lagu "${fallbackTitle}" berhasil di-generate!`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Start building song from Landing Page
  const handleMakeMySong = () => {
    if (!landingPrompt.trim()) {
      setErrorMessage('Deskripsi ide lagu di Landing Page tidak boleh kosong!');
      showToastMsg('❌ Silakan masukkan deskripsi ide lagu terlebih dahulu!');
      return;
    }
    setErrorMessage(null);
    const promptText = landingPrompt.trim();
    setWorkspacePrompt(promptText);
    setStage('workspace');
    showToastMsg('🚀 Pindah ke Dashboard & langsung membuat lagu...');
    executeGenerateSong(promptText, activeTab, isInstrumental, customStyle, customLyricsInput, customTitleInput);
  };

  // Trigger song generation in workspace
  const handleGenerateSong = () => {
    if (activeTab === 'simple' && !workspacePrompt.trim()) {
      setErrorMessage('Silakan masukkan deskripsi ide lagu terlebih dahulu!');
      showToastMsg('❌ Deskripsi ide lagu tidak boleh kosong!');
      return;
    }

    if (activeTab === 'advanced' && !customTitleInput.trim() && !customStyle.trim() && !customLyricsInput.trim() && !workspacePrompt.trim()) {
      setErrorMessage('Silakan isi setidaknya satu kolom (Judul, Genre/Style, Lirik, atau Prompt)!');
      showToastMsg('❌ Kolom input di mode Advanced masih kosong!');
      return;
    }

    setErrorMessage(null);
    executeGenerateSong(workspacePrompt, activeTab, isInstrumental, customStyle, customLyricsInput, customTitleInput);
  };

  const toggleLike = (songId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSongs(prev => prev.map(s => s.id === songId ? { ...s, isLiked: !s.isLiked } : s));
    const song = songs.find(s => s.id === songId);
    if (song) {
      showToastMsg(song.isLiked ? `Dihapus dari Liked Songs` : `❤️ Ditambahkan ke Liked Songs`);
    }
  };

  const handleCopyLyrics = () => {
    if (selectedSong?.lyrics) {
      navigator.clipboard?.writeText(selectedSong.lyrics);
      setCopiedLyrics(true);
      setTimeout(() => setCopiedLyrics(false), 2000);
      showToastMsg('📋 Lirik berhasil disalin ke clipboard!');
    }
  };

  const startRenameSong = (song: TrebloSong, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingSongId(song.id);
    setEditingTitleValue(song.title);
  };

  const saveRenameSong = (songId: string) => {
    if (editingTitleValue.trim()) {
      setSongs(prev => prev.map(s => s.id === songId ? { ...s, title: editingTitleValue.trim() } : s));
      showToastMsg('✏️ Judul lagu berhasil diperbarui!');
    }
    setEditingSongId(null);
  };

  const filteredSongs = songs.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(listSearch.toLowerCase()) ||
                          s.style.toLowerCase().includes(listSearch.toLowerCase()) ||
                          s.prompt.toLowerCase().includes(listSearch.toLowerCase());
    const matchesLiked = showLikedOnly ? s.isLiked : true;
    return matchesSearch && matchesLiked;
  });

  return (
    <div className="w-full min-h-[750px] bg-[#0c0a09] text-slate-800 dark:text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col relative shadow-2xl">
      {/* Toast Banner Notification */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 bg-rose-600 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl border border-rose-400 flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-rose-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* TAHAP 1: LANDING PAGE */}
      {stage === 'landing' && (
        <div className="w-full flex-1 flex flex-col bg-[#0d090a] text-slate-800 dark:text-slate-100 relative overflow-y-auto">
          {/* Top Navbar */}
          <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-[#0d090a]/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2.5 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-900/40">
                  <Music className="w-5 h-5 text-slate-900 dark:text-white" />
                </div>
                <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white">Treblo</span>
              </div>

              <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                <a href="#explore" onClick={(e) => { e.preventDefault(); showToastMsg('Menu Explore diklik'); }} className="hover:text-rose-400 transition-colors">Explore</a>
                <a href="#styles" onClick={(e) => { e.preventDefault(); showToastMsg('Menu Styles diklik'); }} className="hover:text-rose-400 transition-colors">Styles</a>
                <a href="#developers" onClick={(e) => { e.preventDefault(); showToastMsg('Menu Developers API diklik'); }} className="hover:text-rose-400 transition-colors">Developers</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); showToastMsg('Menu About diklik'); }} className="hover:text-rose-400 transition-colors">About</a>
                <a href="#blog" onClick={(e) => { e.preventDefault(); showToastMsg('Menu Blog diklik'); }} className="hover:text-rose-400 transition-colors">Blog</a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleMakeMySong()}
                className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white px-3.5 py-2 rounded-lg font-medium transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => handleMakeMySong()}
                className="text-xs sm:text-sm bg-rose-600 hover:bg-rose-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-rose-900/30 transition-all transform hover:scale-105"
              >
                Sign up
              </button>
            </div>
          </nav>

          {/* Hero Promotional Content */}
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center flex flex-col items-center justify-center relative z-10">
            <div className="inline-flex items-center space-x-2 bg-rose-950/60 border border-rose-800/60 px-3.5 py-1.5 rounded-full text-xs text-rose-300 mb-6 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Ditenagai Treblo AI Engine v3 — Modul #19 Maxy Academy</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white uppercase mb-4 leading-none drop-shadow-xl">
              TURN ANY IDEA <br />
              INTO A <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300">FULL SONG.</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mb-10 font-medium">
              Hit songs by you, in any style. And it's actually free.
            </p>

            {/* Prompt Entry Point Box */}
            <div className="w-full max-w-2xl bg-white dark:bg-[#0d1322] border border-slate-300 dark:border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl relative group hover:border-rose-500/50 transition-all">
              <textarea
                value={landingPrompt}
                onChange={(e) => setLandingPrompt(e.target.value)}
                placeholder="A country song about my WiFi going out mid-meeting..."
                rows={3}
                className="w-full bg-transparent text-slate-800 dark:text-slate-100 text-sm sm:text-base placeholder-slate-500 resize-none focus:outline-none pr-2"
              />

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/80 mt-2">
                <button
                  onClick={() => {
                    setStage('workspace');
                    setActiveTab('advanced');
                    showToastMsg('Membuka mode ADVANCED di Workspace...');
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-800 transition-colors uppercase tracking-wider"
                >
                  <Sliders className="w-3.5 h-3.5 text-rose-400" />
                  <span>ADVANCED</span>
                </button>

                <button
                  onClick={handleMakeMySong}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-slate-900 dark:text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-rose-950/80 transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  <span>Make my song</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">
              💡 Deskripsikan ide lagu dalam bahasa natural — Treblo akan otomatis menghasilkan lirik & aransemen musik sekaligus!
            </p>

            {/* Featured Song Showcase Grid */}
            <div className="w-full mt-16 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-rose-400" />
                <span>Contoh Hasil Lagu Komunitas Maxy Academy</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  onClick={() => {
                    setStage('workspace');
                    setSelectedSongId('song-1');
                    setActivePlayerSongId('song-1');
                    setIsPlaying(true);
                  }}
                  className="bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-xl p-3 flex items-center space-x-3 cursor-pointer group transition-all"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Music className="w-6 h-6 text-slate-900 dark:text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-rose-400 break-words whitespace-normal leading-snug">WiFi Putus Saat Coding</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 break-words whitespace-normal leading-snug">Country Pop • Maxy Academy</p>
                    <span className="inline-block mt-1 text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-medium">Click to Play</span>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    setStage('workspace');
                    setSelectedSongId('song-2');
                    setActivePlayerSongId('song-2');
                    setIsPlaying(true);
                  }}
                  className="bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-xl p-3 flex items-center space-x-3 cursor-pointer group transition-all"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-rose-600 to-pink-800 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Sparkles className="w-6 h-6 text-slate-900 dark:text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-rose-400 break-words whitespace-normal leading-snug">Irama Prompting Gemini</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 break-words whitespace-normal leading-snug">Synthwave • Maxy Academy</p>
                    <span className="inline-block mt-1 text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-medium">Click to Play</span>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    setStage('workspace');
                    setSelectedSongId('song-3');
                    setActivePlayerSongId('song-3');
                    setIsPlaying(true);
                  }}
                  className="bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-xl p-3 flex items-center space-x-3 cursor-pointer group transition-all"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Headphones className="w-6 h-6 text-slate-900 dark:text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-rose-400 break-words whitespace-normal leading-snug">Melodi Belajar AI</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 break-words whitespace-normal leading-snug">Lofi Chill • Maxy Academy</p>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-medium">Instrumental</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAHAP 2: CREATE WORKSPACE */}
      {stage === 'workspace' && (
        <div className="w-full flex-1 flex flex-col bg-[#0f0d0e] text-slate-800 dark:text-slate-100 overflow-hidden relative">
          {/* Top Alert Banner */}
          {showTopBanner && (
            <div className="w-full bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center space-x-2 mx-auto">
                <Sparkles className="w-3.5 h-3.5 text-rose-200 animate-pulse" />
                <span>Treblo is now available on iOS and Android.</span>
                <a 
                  href="#download" 
                  onClick={(e) => { e.preventDefault(); showToastMsg('Membuka link download aplikasi mobile Treblo'); }}
                  className="underline underline-offset-2 hover:text-rose-100 ml-1 font-bold"
                >
                  Download the app.
                </a>
              </div>
              <button 
                onClick={() => setShowTopBanner(false)}
                className="p-1 hover:bg-rose-700/50 rounded-md transition-colors"
                title="Tutup pengumuman"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Workspace Layout */}
          <div className="flex-1 flex overflow-hidden relative min-w-0">
            {/* LEFT SIDEBAR */}
            <aside className="w-56 bg-[#141012] border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 hidden md:flex">
              {/* Logo & Collapse Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
                <div 
                  onClick={() => setStage('landing')}
                  className="flex items-center space-x-2 cursor-pointer group"
                  title="Kembali ke Landing Page"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center">
                    <Music className="w-4 h-4 text-slate-900 dark:text-white" />
                  </div>
                  <span className="font-extrabold text-base tracking-wider text-slate-900 dark:text-white group-hover:text-rose-400 transition-colors">Treblo</span>
                </div>
                <button 
                  onClick={() => showToastMsg('Sidebar collapsed')}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:bg-slate-800"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
              </div>

              {/* Main Nav Items */}
              <div className="p-3 space-y-1 text-xs font-medium border-b border-slate-200 dark:border-slate-800/60">
                <button 
                  onClick={() => setStage('landing')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/50 transition-colors"
                >
                  <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Home</span>
                </button>

                <button 
                  onClick={() => showToastMsg('Membuka fitur Search')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/50 transition-colors"
                >
                  <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Search</span>
                </button>

                <button 
                  onClick={() => showToastMsg('Membuka form Feedback')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Feedback</span>
                </button>

                {/* Radio Menu with Listener Badge */}
                <button 
                  onClick={() => showToastMsg('Radio Streaming Treblo: 26 Pendengar Aktif')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>Radio</span>
                  </div>
                  <span className="bg-rose-950 text-rose-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    26
                  </span>
                </button>

                {/* Active Create Menu */}
                <button 
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-rose-950/80 border border-rose-800/50 text-rose-300 font-bold shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Create</span>
                </button>
              </div>

              {/* Your Library Section */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>Your Library</span>
                  <button 
                    onClick={() => showToastMsg('Playlist baru ditambahkan!')}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center space-x-1 text-[11px] bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700"
                  >
                    <span>+ Playlist</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">My Music</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button 
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        showToastMsg(isPlaying ? 'Playback di-pause' : 'Memutar semua koleksi');
                      }}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs py-1.5 rounded-md font-medium flex items-center justify-center space-x-1 min-w-0"
                    >
                      <Play className="w-3 h-3 fill-current text-rose-400" />
                      <span>Play</span>
                    </button>
                    <button 
                      onClick={() => showToastMsg('Shuffle koleksi lagu')}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs py-1.5 rounded-md font-medium flex items-center justify-center space-x-1 min-w-0"
                    >
                      <Disc className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      <span>Shuffle</span>
                    </button>
                  </div>

                  <div className="relative pt-1">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md py-1 px-2 pl-7 text-[11px] text-slate-700 dark:text-slate-200 placeholder-slate-500 focus:outline-none"
                    />
                    <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2.5" />
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                    <button 
                      onClick={() => showToastMsg('Membuka profil Maxy Academy')}
                      className="w-full flex items-center space-x-2.5 px-2 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/40 text-xs"
                    >
                      <User className="w-3.5 h-3.5 text-rose-400" />
                      <span>Your Profile</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowLikedOnly(!showLikedOnly);
                        showToastMsg(showLikedOnly ? 'Menampilkan semua lagu' : 'Menampilkan Liked Songs');
                      }}
                      className={`w-full flex items-center space-x-2.5 px-2 py-1.5 rounded-md text-xs transition-colors ${showLikedOnly ? 'bg-rose-950/80 text-rose-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/40'}`}
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>Liked Songs</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Icons & Footer Links */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-500 space-y-2">
                <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
                  <button onClick={() => showToastMsg('Discord Maxy Community')} title="Discord"><MessageSquare className="w-3.5 h-3.5 hover:text-rose-400" /></button>
                  <button onClick={() => showToastMsg('X (Twitter)')} title="Twitter"><Globe className="w-3.5 h-3.5 hover:text-rose-400" /></button>
                  <button onClick={() => showToastMsg('Dokumentasi API Treblo')} title="API Docs"><FileText className="w-3.5 h-3.5 hover:text-rose-400" /></button>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-slate-500">
                  <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:underline">Terms</a>
                  <span>•</span>
                  <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:underline">Privacy</a>
                  <span>•</span>
                  <a href="#api" onClick={(e) => e.preventDefault()} className="hover:underline">API</a>
                  <span>•</span>
                  <a href="#faq" onClick={(e) => e.preventDefault()} className="hover:underline">FAQ</a>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#0e0c0d]">
              {/* Workspace Header */}
              <header className="h-12 border-b border-slate-200 dark:border-slate-800/80 px-4 flex items-center justify-between shrink-0 bg-[#120f11]">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                    <button 
                      onClick={() => setStage('landing')}
                      className="p-1 hover:bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300"
                      title="Kembali"
                    >
                      &lt;
                    </button>
                    <button className="p-1 hover:bg-slate-100 dark:bg-slate-800 rounded text-slate-500 opacity-50" disabled>&gt;</button>
                  </div>

                  {/* Project Title (Editable) */}
                  <div className="flex items-center space-x-1.5">
                    {isEditingTitle ? (
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        onBlur={() => setIsEditingTitle(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                        autoFocus
                        className="bg-white dark:bg-slate-900 text-rose-300 text-xs font-bold px-2 py-0.5 rounded border border-rose-500 focus:outline-none"
                      />
                    ) : (
                      <span 
                        onClick={() => setIsEditingTitle(true)}
                        className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-rose-400 flex items-center space-x-1"
                        title="Klik untuk ubah judul proyek"
                      >
                        <span>{projectTitle}</span>
                        <Edit2 className="w-3 h-3 text-slate-500" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Header Icons */}
                <div className="flex items-center space-x-3">
                  <button onClick={() => showToastMsg('Notifikasi sistem')} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 relative">
                    <Bell className="w-4 h-4" />
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full absolute -top-0.5 -right-0.5"></span>
                  </button>

                  <div 
                    onClick={() => showToastMsg('Profil Pengguna: Maxy Academy')}
                    className="w-7 h-7 rounded-full bg-rose-950 border border-rose-700/80 flex items-center justify-center text-rose-300 font-bold text-xs cursor-pointer"
                  >
                    M
                  </div>
                </div>
              </header>

              {/* Mobile View Switcher Tab Bar */}
              <div className="flex md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <button 
                  onClick={() => setMobileTab('editor')}
                  className={`flex-1 py-2 text-center border-b-2 ${mobileTab === 'editor' ? 'border-rose-500 text-rose-400' : 'border-transparent'}`}
                >
                  Generate
                </button>
                <button 
                  onClick={() => setMobileTab('list')}
                  className={`flex-1 py-2 text-center border-b-2 ${mobileTab === 'list' ? 'border-rose-500 text-rose-400' : 'border-transparent'}`}
                >
                  Daftar Lagu ({songs.length})
                </button>
                <button 
                  onClick={() => setMobileTab('detail')}
                  className={`flex-1 py-2 text-center border-b-2 ${mobileTab === 'detail' ? 'border-rose-500 text-rose-400' : 'border-transparent'}`}
                >
                  Detail Lirik
                </button>
              </div>

              {/* Responsive 3-Panel Grid Workspace */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-w-0">
                {/* PANEL TENGAH: AREA GENERATE (Cols 1-3 on Desktop) */}
                <div className={`md:col-span-4 xl:col-span-3 border-r border-slate-200 dark:border-slate-800/80 p-4 overflow-y-auto flex flex-col space-y-4 bg-[#110e10] ${mobileTab === 'editor' ? 'block' : 'hidden md:block'}`}>
                  {/* Model Notice Box */}
                  <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 text-xs text-amber-200/90 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-300">
                      <Info className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>v3 Preview</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-200/80">
                      v3 is currently in preview and sometimes produces lower quality results. Please report issues to team members on our Discord server.
                    </p>
                  </div>

                  {/* Mode Tabs (Simple / Advanced) */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="bg-white dark:bg-slate-900 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-800 text-xs font-medium">
                      <button
                        onClick={() => setActiveTab('simple')}
                        className={`px-3 py-1 rounded-lg transition-colors ${activeTab === 'simple' ? 'bg-rose-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
                      >
                        Simple
                      </button>
                      <button
                        onClick={() => setActiveTab('advanced')}
                        className={`px-3 py-1 rounded-lg transition-colors ${activeTab === 'advanced' ? 'bg-rose-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
                      >
                        Advanced
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">Model</span>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-300 font-semibold px-2 py-1 rounded-lg text-xs focus:outline-none"
                      >
                        <option value="v3">v3</option>
                        <option value="v2">v2 Legacy</option>
                      </select>
                      <button 
                        onClick={() => {
                          setWorkspacePrompt('');
                          setCustomLyricsInput('');
                          showToastMsg('Form direset');
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Reset Form"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* SIMPLE MODE INPUT */}
                  {activeTab === 'simple' && (
                    <div className="space-y-3 flex-1 flex flex-col">
                      <div className="relative bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex-1 flex flex-col focus-within:border-rose-500/60 transition-colors">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                          <span>Deskripsi Ide Lagu (Prompt)</span>
                        </div>
                        <textarea
                          value={workspacePrompt}
                          onChange={(e) => setWorkspacePrompt(e.target.value)}
                          placeholder="Contoh: a country song about my WiFi going out mid-meeting..."
                          rows={5}
                          className="w-full flex-1 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 resize-none focus:outline-none min-w-0"
                        />
                        <div className="flex items-center justify-end pt-2">
                          <button 
                            onClick={() => showToastMsg('Fitur unggah file musik/audio contoh')}
                            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 p-1.5 rounded-md hover:bg-slate-100 dark:bg-slate-800"
                            title="Upload audio reference"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADVANCED MODE INPUTS */}
                  {activeTab === 'advanced' && (
                    <div className="space-y-3 flex-1 flex flex-col text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Judul Manual (Custom Song Title)</label>
                        <input
                          type="text"
                          value={customTitleInput}
                          onChange={(e) => setCustomTitleInput(e.target.value)}
                          placeholder="e.g. WiFi Putus di Maxy Academy"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Genre & Style Tags</label>
                        <input
                          type="text"
                          value={customStyle}
                          onChange={(e) => setCustomStyle(e.target.value)}
                          placeholder="e.g. country pop, bro-country, acoustic guitar, male vocals"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-rose-300 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Kustom Lirik Lagu (Lyrics)</label>
                        <textarea
                          value={customLyricsInput}
                          onChange={(e) => setCustomLyricsInput(e.target.value)}
                          placeholder="[Verse 1] Tulis lirik kustom di sini..."
                          rows={5}
                          className="w-full flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-rose-500 font-mono min-w-0"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Alert Message Box */}
                  {errorMessage && (
                    <div className="bg-rose-950/80 border border-rose-800/80 p-3 rounded-xl text-xs text-rose-200 flex items-center justify-between gap-2 animate-in fade-in">
                      <div className="flex items-center space-x-2">
                        <Info className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                      <button onClick={() => setErrorMessage(null)} className="p-1 hover:text-slate-900 dark:text-white">
                        <X className="w-3.5 h-3.5 text-rose-300" />
                      </button>
                    </div>
                  )}

                  {/* Instrumental Toggle */}
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Instrumental</span>
                    <button
                      onClick={() => setIsInstrumental(!isInstrumental)}
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${isInstrumental ? 'bg-rose-600 justify-end' : 'bg-slate-700 justify-start'}`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                    </button>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateSong}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-slate-900 dark:text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-rose-950/80 flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-rose-200" />
                        <span>Generating Track...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-900 dark:text-white" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>

                {/* PANEL TENGAH-KANAN: DAFTAR HASIL LAGU (Cols 4-7 on Desktop) */}
                <div className={`md:col-span-4 xl:col-span-4 border-r border-slate-200 dark:border-slate-800/80 p-3 flex flex-col space-y-3 bg-[#0e0c0d] overflow-y-auto ${mobileTab === 'list' ? 'block' : 'hidden md:block'}`}>
                  {/* Filters Bar */}
                  <div className="flex items-center justify-between text-xs gap-1.5">
                    <button 
                      onClick={() => showToastMsg('Modal Filter Style & Modul')}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 shrink-0"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Filters</span>
                    </button>

                    <button 
                      onClick={() => setShowLikedOnly(!showLikedOnly)}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 shrink-0 border border-slate-200 dark:border-slate-800 transition-colors ${showLikedOnly ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${showLikedOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>Liked</span>
                    </button>

                    <div className="relative flex-1 min-w-0">
                      <input
                        type="text"
                        value={listSearch}
                        onChange={(e) => setListSearch(e.target.value)}
                        placeholder="Search titles, style"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2 pl-6 text-[11px] text-slate-700 dark:text-slate-200 placeholder-slate-500 focus:outline-none"
                      />
                      <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
                    </div>
                  </div>

                  {/* Songs List */}
                  <div className="space-y-2 flex-1 min-w-0">
                    {filteredSongs.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        Tidak ada lagu yang cocok dengan pencarian.
                      </div>
                    ) : (
                      filteredSongs.map((song) => {
                        const isSelected = song.id === selectedSongId;
                        const isThisPlaying = isPlaying && activePlayerSongId === song.id;

                        return (
                          <div
                            key={song.id}
                            onClick={() => {
                              setSelectedSongId(song.id);
                              if (mobileTab === 'list') setMobileTab('detail');
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-white dark:bg-[#0d1322] border-rose-500/70 shadow-lg' : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:border-slate-700'}`}
                          >
                            <div className="flex items-start justify-between space-x-2">
                              <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (activePlayerSongId === song.id) {
                                      setIsPlaying(!isPlaying);
                                    } else {
                                      setActivePlayerSongId(song.id);
                                      setSelectedSongId(song.id);
                                      setIsPlaying(true);
                                      setPlayerProgress(0);
                                    }
                                  }}
                                  className="w-9 h-9 rounded-full bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-300 shrink-0 hover:scale-105 transition-transform mt-0.5"
                                >
                                  {isThisPlaying ? <Pause className="w-4 h-4 fill-current text-rose-400" /> : <Play className="w-4 h-4 fill-current text-rose-400 ml-0.5" />}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                    {editingSongId === song.id ? (
                                      <input
                                        type="text"
                                        value={editingTitleValue}
                                        onChange={(e) => setEditingTitleValue(e.target.value)}
                                        onBlur={() => saveRenameSong(song.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && saveRenameSong(song.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                        className="bg-white dark:bg-slate-900 border border-rose-500 text-xs text-rose-300 font-bold px-1.5 py-0.5 rounded focus:outline-none w-full"
                                      />
                                    ) : (
                                      <span className="text-xs font-bold text-slate-900 dark:text-white hover:text-rose-400 transition-colors truncate" title={song.title}>
                                        {song.title}
                                      </span>
                                    )}
                                    <button 
                                      onClick={(e) => startRenameSong(song, e)}
                                      className="text-slate-500 hover:text-rose-400 p-0.5 shrink-0"
                                      title="Edit judul lagu"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>

                                    {song.isNew && (
                                      <span className="bg-rose-600 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full uppercase shrink-0">
                                        New
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono" title={song.style}>
                                    {song.style}
                                  </p>
                                </div>
                              </div>

                              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0 mt-1">
                                {song.duration}
                              </span>
                            </div>

                            {/* Prompt preview snippet */}
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-1.5 pl-11">
                              "{song.prompt}"
                            </p>

                            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/40 text-slate-500 dark:text-slate-400 text-xs">
                              <span className="text-[10px] text-slate-500">{song.createdAt}</span>

                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={(e) => toggleLike(song.id, e)}
                                  className="p-1 hover:text-rose-400 transition-colors"
                                  title="Like / Unlike"
                                >
                                  <Heart className={`w-3.5 h-3.5 ${song.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showToastMsg('Menu opsi lagu');
                                  }}
                                  className="p-1 hover:text-slate-700 dark:text-slate-200"
                                >
                                  •••
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* PANEL KANAN: DETAIL LAGU TERPILIH (Cols 8-12 on Desktop) */}
                <div className={`md:col-span-4 xl:col-span-5 p-4 overflow-y-auto flex flex-col space-y-4 bg-[#120f11] ${mobileTab === 'detail' ? 'block' : 'hidden md:block'}`}>
                  {/* Top Bar of Detail */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{selectedSong.title}</span>
                        <button onClick={(e) => startRenameSong(selectedSong, e)} className="text-slate-500 hover:text-rose-400">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{selectedSong.createdAt}</span>
                    </div>

                    <button 
                      onClick={() => setMobileTab('list')}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-md hover:bg-slate-100 dark:bg-slate-800 md:hidden"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Visual Waveform Box */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-inner">
                    <div className="h-16 flex items-end justify-between space-x-1 px-2">
                      {selectedSong.waveform.map((val, idx) => (
                        <div
                          key={idx}
                          style={{ height: `${val}%` }}
                          className={`flex-1 rounded-t transition-all ${idx * 4 <= playerProgress ? 'bg-gradient-to-t from-rose-600 to-pink-400' : 'bg-slate-700'}`}
                        ></div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>0:00</span>
                      <span>{selectedSong.duration}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <button
                        onClick={() => {
                          setActivePlayerSongId(selectedSong.id);
                          setIsPlaying(!isPlaying);
                        }}
                        className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-md"
                      >
                        {isPlaying && activePlayerSongId === selectedSong.id ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play</span>
                          </>
                        )}
                      </button>

                      <button 
                        onClick={() => showToastMsg('Tautan lagu disalin ke clipboard')}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium px-3 py-2 rounded-lg flex items-center space-x-1"
                      >
                        <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>Share</span>
                      </button>

                      <button 
                        onClick={() => showToastMsg('Membuka audio editor')}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium px-3 py-2 rounded-lg flex items-center space-x-1"
                      >
                        <span>Edit</span>
                        <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      </button>

                      <div className="flex items-center space-x-1">
                        <button onClick={() => showToastMsg('Mengunduh file MP3')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => showToastMsg('Info metadata lagu')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white" title="Info">
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section: Prompt */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Prompt</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 leading-relaxed italic">
                      "{selectedSong.prompt}"
                    </p>
                  </div>

                  {/* Section: Lyrics */}
                  <div className="space-y-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Lyrics</h4>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={handleCopyLyrics}
                          className="text-slate-500 dark:text-slate-400 hover:text-rose-400 text-xs flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded"
                          title="Salin lirik"
                        >
                          {copiedLyrics ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLyrics ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex-1 overflow-y-auto text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-wrap min-w-0">
                      {selectedSong.lyrics}
                    </div>
                  </div>
                </div>
              </div>

              {/* PERSISTENT BOTTOM AUDIO PLAYER */}
              <div className="h-16 bg-[#161214] border-t border-slate-200 dark:border-slate-800/90 px-4 flex items-center justify-between shrink-0 text-xs z-20">
                {/* Left: Song Info */}
                <div className="flex items-center space-x-3 w-1/4">
                  <div className={`w-10 h-10 rounded-lg ${activePlayerSong.coverColor} flex items-center justify-center shrink-0 shadow-md`}>
                    <Music className="w-5 h-5 text-slate-900 dark:text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs break-words whitespace-normal leading-snug">{activePlayerSong.title}</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 break-words whitespace-normal leading-snug">Maxy Academy Student</p>
                  </div>
                  <button 
                    onClick={(e) => toggleLike(activePlayerSong.id, e)}
                    className="text-slate-500 dark:text-slate-400 hover:text-rose-400 p-1"
                  >
                    <Heart className={`w-4 h-4 ${activePlayerSong.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Center: Controls & Progress Bar */}
                <div className="flex-1 max-w-md mx-4 flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                      }}
                      className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                  </div>

                  <div className="w-full flex items-center space-x-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>0:{playerProgress < 10 ? `0${playerProgress}` : playerProgress}</span>
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = Math.round((clickX / rect.width) * 100);
                        setPlayerProgress(pct);
                      }}
                      className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer relative overflow-hidden min-w-0"
                    >
                      <div 
                        style={{ width: `${playerProgress}%` }}
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full"
                      ></div>
                    </div>
                    <span>{activePlayerSong.duration}</span>
                  </div>
                </div>

                {/* Right: Volume & Close */}
                <div className="flex items-center justify-end space-x-3 w-1/4">
                  <div className="flex items-center space-x-1.5">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-16 accent-rose-500 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <button 
                    onClick={() => setStage('landing')}
                    className="text-slate-500 hover:text-slate-900 dark:text-white p-1"
                    title="Tutup Player / Kembali ke Landing Page"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};
