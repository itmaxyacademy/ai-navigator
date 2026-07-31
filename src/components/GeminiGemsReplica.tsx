import React, { useState } from 'react';
import {
  Sparkles, Search, Gem, LayoutGrid, Heart, Settings, User,
  Plus, ArrowLeft, MoreVertical, Share2, Edit2, Trash2, Wand2,
  Mic, Paperclip, Send, RotateCcw, RotateCw, FileText, Info,
  CheckCircle2, ChevronDown, Check, HelpCircle, ExternalLink, RefreshCw,
  AlertCircle, X
} from 'lucide-react';

export interface CustomGem {
  id: string;
  name: string;
  description: string;
  instructions: string;
  defaultTool: string;
  iconBg: string;
  initial: string;
  isBuiltIn?: boolean;
  category?: 'google' | 'labs' | 'my-gems';
  tag?: string;
}

export const GeminiGemsReplica: React.FC = () => {
  // Navigation View: 'home' | 'gems-manager' | 'create-gem' | 'gem-chat' | 'search' | 'apps' | 'saved'
  const [currentView, setCurrentView] = useState<'home' | 'gems-manager' | 'create-gem' | 'gem-chat' | 'search' | 'apps' | 'saved'>('gems-manager');

  // Selected Active Gem for Chat Mode
  const [activeGem, setActiveGem] = useState<CustomGem | null>(null);

  // Gemini Mode Dropdown State
  const [selectedMode, setSelectedMode] = useState<string>('Pro Mendalam');
  const [isModeOpen, setIsModeOpen] = useState<boolean>(false);

  // Editing Gem ID (null if creating new, string if editing existing)
  const [editingGemId, setEditingGemId] = useState<string | null>(null);

  // Form State for Creating/Editing Gem
  const [formName, setFormName] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formInstructions, setFormInstructions] = useState<string>('');
  const [formTool, setFormTool] = useState<string>('Tidak ada alat default');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Chat State & Per-Gem Chat History
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'gemini'; text: string; label?: string }[]>([]);
  const [gemHistories, setGemHistories] = useState<Record<string, { sender: 'user' | 'gemini'; text: string; label?: string }[]>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Three-dots dropdown state
  const [activeDropdownGemId, setActiveDropdownGemId] = useState<string | null>(null);

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast message
  const [toast, setToast] = useState<string | null>(null);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // Mock List of Custom User Gems
  const [myGems, setMyGems] = useState<CustomGem[]>([
    {
      id: 'gem-1',
      name: 'Maxy Recruitment Screener AI',
      description: 'Asisten AI untuk tim Human Capital yang bertugas mengotomasi screening CV, menganalisis kesesuaian kandidat, dan merumuskan panduan wawancara terstruktur.',
      instructions: `Kamu adalah Recruitment Screener AI khusus untuk Maxy Academy.
Tugas utama:
1. Screening Otomatis: Mengekstrak informasi kunci dari CV atau profil kandidat.
2. Scoring Relevansi: Menilai tingkat kecocokan kandidat berdasarkan Job Description (JD).
3. Komparasi Kandidat: Menyajikan perbandingan kualifikasi antar pelamar dalam tabel.
4. Gap Analysis & Panduan Wawancara: Mengidentifikasi area yang kurang jelas dan menyusun draf pertanyaan spesifik.
Selalu jawab dengan struktur bullet points yang rapi dan profesional.`,
      defaultTool: 'Tidak ada alat default',
      iconBg: 'bg-purple-700',
      initial: 'R',
      category: 'my-gems'
    },
    {
      id: 'gem-2',
      name: 'TalentScout Maxy AI',
      description: 'Gem khusus pemetaan bakat dan analisis potensi pengembangan karier siswa bootcamp Maxy Academy.',
      instructions: 'Kamu adalah TalentScout Maxy AI. Bantu mengukur kompetensi teknis, soft skills, dan kesiapan kerja siswa.',
      defaultTool: 'Google Search',
      iconBg: 'bg-rose-700',
      initial: 'T',
      category: 'my-gems'
    },
    {
      id: 'gem-3',
      name: 'Maxy Code Reviewer AI',
      description: 'Gem kustom untuk inspeksi kode TypeScript, Vite, dan optimasi arsitektur React.',
      instructions: 'Kamu adalah Code Reviewer AI. Berikan saran refactoring, perbaiki bug, dan pastikan kepatuhan arsitektur clean code.',
      defaultTool: 'Python Code Interpreter',
      iconBg: 'bg-emerald-700',
      initial: 'M',
      category: 'my-gems'
    }
  ]);

  // Google Labs Gems
  const labsGems: CustomGem[] = [
    {
      id: 'labs-1',
      name: 'Recipe Genie',
      description: 'Transform your fridge leftovers into delicious, quick meals with step-by-step cooking steps.',
      instructions: 'You are Recipe Genie by Google Labs. Provide creative, delicious, easy-to-follow recipes using the input ingredients.',
      defaultTool: 'None',
      iconBg: 'bg-amber-900',
      initial: '🍳',
      category: 'labs'
    },
    {
      id: 'labs-2',
      name: 'Marketing Maven',
      description: 'Brainstorms with you on content strategy, branding, copy, and growth campaigns.',
      instructions: 'You are Marketing Maven by Google Labs. Generate actionable marketing strategies, engaging social headlines, and growth hacks.',
      defaultTool: 'None',
      iconBg: 'bg-blue-900',
      initial: '📈',
      category: 'labs'
    },
    {
      id: 'labs-3',
      name: 'Claymation Explainer',
      description: 'Turn any complex topic into an animated claymation infographic concept and script.',
      instructions: 'You are Claymation Explainer by Google Labs. Break down complex tech topics into fun, visual claymation storyboard concepts.',
      defaultTool: 'None',
      iconBg: 'bg-teal-900',
      initial: '🎨',
      category: 'labs'
    },
    {
      id: 'labs-4',
      name: 'Learning with YouTube',
      description: 'Turn your YouTube video or educational topic into an interactive quiz to help you learn.',
      instructions: 'You are Learning Assistant. Generate interactive quizzes, key takeaways, and study notes.',
      defaultTool: 'Google Search',
      iconBg: 'bg-red-900',
      initial: '▶️',
      category: 'labs'
    }
  ];

  // Google Built-In Gems
  const googleGems: CustomGem[] = [
    {
      id: 'goog-1',
      name: 'Storybook',
      description: 'Buat buku bergambar kustom, untuk anak-anak maupun dewasa, berdasarkan topik favorit Anda.',
      instructions: 'You are Storybook Creator by Google. Craft engaging, imaginative story chapters with visual image prompts.',
      defaultTool: 'None',
      iconBg: 'bg-cyan-900',
      initial: '📖',
      category: 'google',
      tag: 'Eksperimen'
    },
    {
      id: 'goog-2',
      name: 'Pencari ide',
      description: 'Temukan inspirasi dengan mudah. Dapatkan ide seru untuk acara, hadiah, proyek bisnis, dan strategi.',
      instructions: 'You are Idea Generator. Provide out-of-the-box creative ideas for events, business projects, and strategies.',
      defaultTool: 'None',
      iconBg: 'bg-amber-800',
      initial: '💡',
      category: 'google'
    },
    {
      id: 'goog-3',
      name: 'Konsultan karier',
      description: 'Wujudkan potensi karier Anda. Dapatkan rencana terperinci untuk mengasah keterampilan profesi.',
      instructions: 'You are Career Coach by Google. Provide career path recommendations, resume tips, and interview guidance.',
      defaultTool: 'None',
      iconBg: 'bg-purple-800',
      initial: '💼',
      category: 'google'
    },
    {
      id: 'goog-4',
      name: 'Partner coding',
      description: 'Tingkatkan keterampilan coding Anda. Dapatkan bantuan debugging, struktur logika, dan algoritma.',
      instructions: 'You are Coding Partner. Help debug code, explain algorithms, and write efficient TypeScript and Python scripts.',
      defaultTool: 'Python Code Interpreter',
      iconBg: 'bg-blue-800',
      initial: '💻',
      category: 'google'
    }
  ];

  // Handle Magic Improve System Instructions
  const handleMagicImprove = () => {
    if (!formInstructions.trim()) {
      setFormInstructions(`Kamu adalah ${formName || 'Asisten AI Maxy Academy'} dengan spesialisasi khusus.
Tugas utama:
1. Memberikan analisis terstruktur dan objektif.
2. Menyajikan jawaban dalam bahasa Indonesia yang ramah dan profesional.
3. Menggunakan bullet points untuk memudahkan pemahaman.
Batasan: Jangan memberikan asumsi tanpa data yang jelas.`);
    } else {
      setFormInstructions(prev => `${prev}\n\n[Sistem Peningkat Instruksi]: Selalu sertakan ringkasan eksekutif dan langkah konkret di setiap akhir jawaban.`);
    }
    showToastMsg('✨ Petunjuk diperbaiki secara otomatis oleh AI Magic!');
  };

  // Open Create Form for New Gem
  const handleOpenCreateForm = () => {
    setEditingGemId(null);
    setFormName('');
    setFormDescription('');
    setFormInstructions('');
    setFormTool('Tidak ada alat default');
    setCurrentView('create-gem');
    showToastMsg('Membuka Form Pembuatan Gem Baru');
  };

  // Open Edit Form for Existing Gem
  const handleEditGem = (gem: CustomGem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveDropdownGemId(null);
    setEditingGemId(gem.id);
    setFormName(gem.name);
    setFormDescription(gem.description);
    setFormInstructions(gem.instructions);
    setFormTool(gem.defaultTool || 'Tidak ada alat default');
    setCurrentView('create-gem');
    showToastMsg(`✏️ Mengedit Gem "${gem.name}"`);
  };

  // Delete Gem
  const handleDeleteGem = (gemId: string, gemName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveDropdownGemId(null);
    setMyGems(prev => prev.filter(g => g.id !== gemId));
    if (activeGem?.id === gemId) {
      setActiveGem(null);
      setCurrentView('gems-manager');
    }
    showToastMsg(`🗑️ Gem "${gemName}" berhasil dihapus.`);
  };

  // Share / Copy Gem ID or Link
  const handleShareGem = (gem: CustomGem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveDropdownGemId(null);
    const gemLink = `https://ai.studio/gems/${gem.id}`;
    navigator.clipboard?.writeText(gemLink);
    showToastMsg(`📋 Link Gem "${gem.name}" berhasil disalin ke clipboard!`);
  };

  // Handle Save Gem (Create or Update)
  const handleSaveGem = () => {
    if (!formName.trim()) {
      showToastMsg('❌ Nama Gem wajib diisi!');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      if (editingGemId) {
        // Update existing Gem
        setMyGems(prev => prev.map(g => {
          if (g.id === editingGemId) {
            return {
              ...g,
              name: formName.trim(),
              description: formDescription.trim() || 'Gem kustom buatan pengguna untuk alur kerja spesifik.',
              instructions: formInstructions.trim() || 'Kamu adalah asisten AI yang membantu tugas harian.',
              defaultTool: formTool,
              initial: formName.trim().charAt(0).toUpperCase()
            };
          }
          return g;
        }));

        const updatedGem = {
          id: editingGemId,
          name: formName.trim(),
          description: formDescription.trim() || 'Gem kustom buatan pengguna.',
          instructions: formInstructions.trim() || 'Kamu adalah asisten AI.',
          defaultTool: formTool,
          iconBg: 'bg-indigo-600',
          initial: formName.trim().charAt(0).toUpperCase(),
          category: 'my-gems' as const
        };

        if (activeGem?.id === editingGemId) {
          setActiveGem(updatedGem);
        }

        setIsSaving(false);
        showToastMsg(`✅ Gem "${formName}" berhasil diperbarui!`);
        setCurrentView('gems-manager');
      } else {
        // Create new Gem
        const newGem: CustomGem = {
          id: `gem-${Date.now()}`,
          name: formName.trim(),
          description: formDescription.trim() || 'Gem kustom buatan pengguna untuk alur kerja spesifik.',
          instructions: formInstructions.trim() || 'Kamu adalah asisten AI yang membantu tugas harian.',
          defaultTool: formTool,
          iconBg: 'bg-indigo-600',
          initial: formName.trim().charAt(0).toUpperCase(),
          category: 'my-gems'
        };

        setMyGems(prev => [newGem, ...prev]);
        setIsSaving(false);
        showToastMsg(`✨ Gem "${formName}" berhasil dibuat!`);

        // Initialize Chat & Auto Open Chat with New Gem
        const initialWelcome = [
          {
            sender: 'gemini' as const,
            text: `Halo Wahyudi! Sistem ${newGem.name} sudah aktif dan siap digunakan.\n\nSesuai Petunjuk Kustom (System Instruction):\n"${newGem.instructions}"\n\nSilakan ajukan pertanyaan atau instruksi awal Anda!`,
            label: `${newGem.name} • Gem Kustom`
          }
        ];
        setGemHistories(prev => ({ ...prev, [newGem.id]: initialWelcome }));
        setActiveGem(newGem);
        setChatMessages(initialWelcome);
        setCurrentView('gem-chat');
      }

      // Reset form fields
      setEditingGemId(null);
      setFormName('');
      setFormDescription('');
      setFormInstructions('');
    }, 600);
  };

  // Open Chat with Selected Gem
  const handleOpenGemChat = (gem: CustomGem) => {
    setActiveGem(gem);
    setChatError(null);

    // Load existing history or set default welcome message
    if (gemHistories[gem.id] && gemHistories[gem.id].length > 0) {
      setChatMessages(gemHistories[gem.id]);
    } else {
      const defaultWelcome = [
        {
          sender: 'gemini' as const,
          text: `Halo Wahyudi! Saya ${gem.name}.\n\nSaya telah dikonfigurasi dengan petunjuk khusus:\n"${gem.instructions}"\n\nBagaimana saya dapat membantu tugas Anda hari ini di Maxy Academy?`,
          label: `${gem.name} • Gem ${gem.category === 'my-gems' ? 'Kustom' : 'System'}`
        }
      ];
      setGemHistories(prev => ({ ...prev, [gem.id]: defaultWelcome }));
      setChatMessages(defaultWelcome);
    }

    setCurrentView('gem-chat');
    showToastMsg(`💬 Membuka ruang chat dengan ${gem.name}`);
  };

  // Handle Send Chat Prompt with Gemini API Call
  const handleSendPrompt = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatError(null);

    const userMsg = { sender: 'user' as const, text: userText };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);

    if (activeGem) {
      setGemHistories(prev => ({ ...prev, [activeGem.id]: updatedMessages }));
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini-gems-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          gemName: activeGem ? activeGem.name : 'Gemini AI',
          gemDescription: activeGem ? activeGem.description : '',
          systemInstruction: activeGem ? activeGem.instructions : 'Kamu adalah Gemini AI.',
          history: updatedMessages,
          mode: selectedMode,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Terjadi kesalahan pada Gemini AI server.');
      }

      const data = await res.json();
      const aiResponseText = data.text || 'Tidak ada respons dari Gemini AI.';

      const aiMsg = {
        sender: 'gemini' as const,
        text: aiResponseText,
        label: activeGem ? `${activeGem.name} • Gem ${activeGem.category === 'my-gems' ? 'Kustom' : 'System'}` : `Gemini AI (${selectedMode})`
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setChatMessages(finalMessages);

      if (activeGem) {
        setGemHistories(prev => ({ ...prev, [activeGem.id]: finalMessages }));
      }
    } catch (err: any) {
      console.error('Gemini Gems chat error:', err);
      setChatError(err.message || 'Gagal mengirim pesan ke Gemini AI.');

      // Fallback response for offline or server error
      const fallbackMsg = {
        sender: 'gemini' as const,
        text: activeGem
          ? `[${activeGem.name}] Menerima prompt: "${userText}"\n\nBerdasarkan Petunjuk System Instruction Gem (${activeGem.name}):\n1. Analisis Otomatis: Mengekstrak data kualifikasi dari input Anda.\n2. Scoring Relevansi: Tingkat kesesuaian mencapai 92% (Sangat Sesuai).\n3. Rekomendasi: Direkomendasikan untuk melanjutkan ke langkah eksekusi berikutnya.\n\n*(Simulasi respons Gem kustom)*`
          : `Saya Gemini (${selectedMode}). Menjawab: "${userText}"\n\nSebagai model AI serbaguna, saya dapat membantu Anda menganalisis data, menulis draf, atau menjawab pertanyaan umum.`,
        label: activeGem ? `${activeGem.name} • Gem Kustom` : `Gemini AI`
      };

      const finalFallback = [...updatedMessages, fallbackMsg];
      setChatMessages(finalFallback);

      if (activeGem) {
        setGemHistories(prev => ({ ...prev, [activeGem.id]: finalFallback }));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Filtered Gems for Search View
  const allGemsList = [...myGems, ...labsGems, ...googleGems];
  const filteredGems = searchQuery.trim()
    ? allGemsList.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : allGemsList;

  return (
    <div className="w-full min-h-[750px] bg-[#0f1013] text-slate-800 dark:text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row relative shadow-2xl">
      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-blue-400 flex items-center space-x-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Gemini Style Navigation) */}
      <aside className="w-full md:w-16 lg:w-60 bg-[#14161c] border-r border-slate-200 dark:border-slate-800/80 p-3 flex flex-row md:flex-col justify-between shrink-0 z-20">
        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-4 items-center md:items-start w-full">
          {/* Gemini Logo Header */}
          <div className="flex items-center space-x-3 px-2 py-1 cursor-pointer" onClick={() => setCurrentView('gems-manager')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-slate-900 dark:text-white fill-current" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 hidden lg:inline tracking-tight">Gemini Gems</span>
          </div>

          <hr className="hidden md:block border-slate-200 dark:border-slate-800 w-full my-1" />

          {/* New Chat Button */}
          <button
            onClick={() => {
              setActiveGem(null);
              setChatMessages([]);
              setCurrentView('home');
              showToastMsg('Membuka Percakapan Baru');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all ${currentView === 'home' && !activeGem ? 'bg-slate-100 dark:bg-slate-800 text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-700 dark:text-slate-200'}`}
            title="Percakapan baru"
          >
            <Edit2 className="w-4 h-4 shrink-0" />
            <span className="text-xs hidden lg:inline truncate">Percakapan baru</span>
          </button>

          {/* Search Button */}
          <button
            onClick={() => {
              setCurrentView('search');
              showToastMsg('Search: Mencari Gem kustom atau bawaan');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all ${currentView === 'search' ? 'bg-slate-100 dark:bg-slate-800 text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-700 dark:text-slate-200'}`}
            title="Search"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="text-xs hidden lg:inline truncate">Search</span>
          </button>

          {/* Gems Manager Button */}
          <button
            onClick={() => {
              setCurrentView('gems-manager');
              showToastMsg('Membuka Gem Manager');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all ${currentView === 'gems-manager' || currentView === 'create-gem' ? 'bg-blue-950/80 border border-blue-800/60 text-blue-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-700 dark:text-slate-200'}`}
            title="Pengelola Gem"
          >
            <Gem className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs hidden lg:inline truncate">Gems Manager</span>
          </button>

          {/* Apps Button */}
          <button
            onClick={() => {
              setCurrentView('apps');
              showToastMsg('Google Workspace Extensions & Apps');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all ${currentView === 'apps' ? 'bg-slate-100 dark:bg-slate-800 text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-700 dark:text-slate-200'}`}
            title="Apps"
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span className="text-xs hidden lg:inline truncate">Apps</span>
          </button>

          {/* Saved / Heart Button */}
          <button
            onClick={() => {
              setCurrentView('saved');
              showToastMsg('Item Disimpan & Percakapan Favorit');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all ${currentView === 'saved' ? 'bg-slate-100 dark:bg-slate-800 text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-700 dark:text-slate-200'}`}
            title="Disimpan"
          >
            <Heart className="w-4 h-4 shrink-0" />
            <span className="text-xs hidden lg:inline truncate">Disimpan</span>
          </button>
        </div>

        {/* Bottom Sidebar Settings & User */}
        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-3 items-center md:items-start pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <button
            onClick={() => showToastMsg('Pengaturan Gemini & Model AI')}
            className="w-full flex items-center space-x-3 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-700 dark:text-slate-200 text-xs"
            title="Settings"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Settings</span>
          </button>

          <div 
            onClick={() => showToastMsg('Profil Akun: Wahyudi (Maxy Academy)')}
            className="w-full flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:bg-slate-800/60 cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-700 border border-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              W
            </div>
            <div className="hidden lg:flex flex-col text-[11px] truncate">
              <span className="font-bold text-slate-700 dark:text-slate-200 truncate">Wahyudi</span>
              <span className="text-slate-500 text-[10px] truncate">Maxy Academy</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 flex flex-col bg-[#0b0c0f] overflow-hidden">
        {/* VIEW 1: HOME CHAT ("Percakapan Baru") */}
        {currentView === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-y-auto">
            <div className="max-w-xl w-full space-y-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Halo Wahyudi, apa yang Anda pikirkan?
              </h1>

              {/* Large Input Box */}
              <div className="bg-[#161821] border border-slate-300 dark:border-slate-700/80 rounded-2xl p-3 shadow-2xl text-left space-y-3 focus-within:border-blue-500 transition-colors">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrompt();
                    }
                  }}
                  placeholder="Minta Gemini..."
                  rows={3}
                  className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 resize-none focus:outline-none"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => showToastMsg('Tambah Lampiran / File Referensi')}
                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:bg-slate-800 text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-2">
                    {/* Mode Selector Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsModeOpen(!isModeOpen)}
                        className="bg-[#1d202c] border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1 hover:border-blue-500"
                      >
                        <span>{selectedMode}</span>
                        <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      </button>

                      {isModeOpen && (
                        <div className="absolute right-0 bottom-8 w-40 bg-[#1a1d28] border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl p-1 z-30 space-y-0.5 text-xs">
                          <button
                            onClick={() => {
                              setSelectedMode('Pro Mendalam');
                              setIsModeOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600/30 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-between"
                          >
                            <span>Pro Mendalam</span>
                            {selectedMode === 'Pro Mendalam' && <Check className="w-3 h-3 text-blue-400" />}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMode('Fast Flash 1.5');
                              setIsModeOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600/30 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-between"
                          >
                            <span>Fast Flash 1.5</span>
                            {selectedMode === 'Fast Flash 1.5' && <Check className="w-3 h-3 text-blue-400" />}
                          </button>
                        </div>
                      )}
                    </div>

                    <button onClick={() => showToastMsg('Input Suara / Mikrofon')} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:bg-slate-800">
                      <Mic className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleSendPrompt}
                      disabled={!chatInput.trim()}
                      className="p-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Gemini dapat membuat kesalahan, termasuk tentang orang, jadi periksa kembali responsnya.
              </p>
            </div>
          </div>
        )}

        {/* VIEW 2: SEARCH VIEW */}
        {currentView === 'search' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-[#0c0d11]">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <Search className="w-5 h-5 text-blue-400" />
                <span>Pencarian Gem Studio</span>
              </h2>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Gem berdasarkan nama atau deskripsi..."
                  className="w-full bg-[#161822] border border-slate-300 dark:border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Hasil Pencarian ({filteredGems.length} Gem):</span>
                {filteredGems.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-[#14161f] border border-slate-200 dark:border-slate-800 rounded-2xl">
                    Tidak ada Gem yang cocok dengan pencarian "{searchQuery}".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredGems.map(gem => (
                      <div
                        key={gem.id}
                        onClick={() => handleOpenGemChat(gem)}
                        className="bg-[#14161f] border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 p-3.5 rounded-xl cursor-pointer group transition-all shadow-md flex items-start space-x-3"
                      >
                        <div className={`w-9 h-9 rounded-xl ${gem.iconBg} flex items-center justify-center text-slate-900 dark:text-white font-bold text-sm shrink-0`}>
                          {gem.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-300 truncate">{gem.name}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{gem.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: APPS INTEGRATION VIEW */}
        {currentView === 'apps' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-[#0c0d11]">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <LayoutGrid className="w-5 h-5 text-blue-400" />
                <span>Google Workspace Extension Apps</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Integrasikan Gem AI Anda secara langsung dengan aplikasi produktivitas Google Workspace.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { name: 'Google Docs', desc: 'Sintesis draf & ringkasan dokumen otomatis', icon: '📄', active: true },
                  { name: 'Google Sheets', desc: 'Analisis tabel & rumus komputasi data', icon: '📊', active: true },
                  { name: 'Google Drive', desc: 'Pencarian berkas & basis pengetahuan', icon: '📁', active: true },
                  { name: 'Google Calendar', desc: 'Jadwal otomatis & pengingat tenggat', icon: '📅', active: false }
                ].map((app, idx) => (
                  <div key={idx} className="bg-[#14161f] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{app.name}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{app.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => showToastMsg(`Toggle koneksi ${app.name}`)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${app.active ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}
                    >
                      {app.active ? 'Aktif' : 'Sambungkan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: SAVED VIEW */}
        {currentView === 'saved' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-[#0c0d11]">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-400 fill-current" />
                <span>Saved Items & Favorite Conversations</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Simpan percakapan penting dan respons analisis Gem untuk referensi tim Maxy Academy.</p>

              <div className="space-y-3">
                <div className="bg-[#14161f] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-bold">
                    <span>Maxy Recruitment Screener AI</span>
                    <span className="text-slate-500 font-normal">Disimpan kemarin</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200">"Tabel komparasi 3 kandidat Fullstack AI Engineer: Kandidat A direkomendasikan dengan skor 94%."</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: GEM MANAGER ("Halaman Gems") */}
        {currentView === 'gems-manager' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-8 bg-[#0c0d11]">
            {/* Promo Banner: Google Labs */}
            <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-800/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-black/60 border border-blue-500/40 flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-6 h-6 text-blue-400 fill-current" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Buat aplikasi AI, Gem baru dari Google Labs
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Buat dan bagikan aplikasi mini AI serta alur kerja kustom dengan Google Labs. Coba Gem bawaan untuk memulai, atau remix untuk membuatnya sesuai keinginan Anda.
                </p>
              </div>
            </div>

            {/* Section 1: Gems made by Labs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                  <span>Gems made by Labs</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <button onClick={() => showToastMsg('Menampilkan semua Gems buatan Labs')} className="text-xs font-bold text-blue-400 hover:underline">
                  Show more &gt;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {labsGems.map(gem => (
                  <div
                    key={gem.id}
                    onClick={() => handleOpenGemChat(gem)}
                    className="bg-[#14161f] border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 p-4 rounded-2xl cursor-pointer group transition-all transform hover:-translate-y-1 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="text-2xl">{gem.initial}</div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-300 transition-colors">
                        {gem.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {gem.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Pengelola Gem > Dibuat oleh Google */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Pengelola Gem</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dibuat oleh Google</p>
                </div>
                <button onClick={() => showToastMsg('Menampilkan lebih banyak Gem Google')} className="text-xs font-bold text-blue-400 hover:underline">
                  Tampilkan lebih banyak &gt;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {googleGems.map(gem => (
                  <div
                    key={gem.id}
                    onClick={() => handleOpenGemChat(gem)}
                    className="bg-[#14161f] border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 p-4 rounded-2xl cursor-pointer group transition-all transform hover:-translate-y-1 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{gem.initial}</span>
                        {gem.tag && (
                          <span className="text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-full">
                            {gem.tag}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-300 transition-colors">
                        {gem.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {gem.description}
                      </p>
                    </div>
                    <div className="pt-2 text-right">
                      <MoreVertical className="w-4 h-4 text-slate-500 hover:text-slate-700 dark:text-slate-200 inline-block" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Gem Saya */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Gem Saya</h3>
                  <span title="Daftar asisten AI kustom yang Anda buat"><Info className="w-4 h-4 text-slate-500 cursor-pointer" /></span>
                </div>

                {/* + Gem Baru Button */}
                <button
                  onClick={handleOpenCreateForm}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md transition-all transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Gem Baru</span>
                </button>
              </div>

              {/* List of Custom User Gems */}
              <div className="space-y-3">
                {myGems.map(gem => (
                  <div
                    key={gem.id}
                    className="bg-[#14161f] border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 p-3.5 rounded-2xl flex items-center justify-between transition-all group shadow-md relative"
                  >
                    <div
                      onClick={() => handleOpenGemChat(gem)}
                      className="flex items-center space-x-3.5 cursor-pointer flex-1 min-w-0"
                    >
                      <div className={`w-10 h-10 rounded-xl ${gem.iconBg} border border-slate-600 flex items-center justify-center font-extrabold text-slate-900 dark:text-white text-base shadow shrink-0`}>
                        {gem.initial}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                          {gem.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-lg">
                          {gem.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center space-x-2 shrink-0 ml-3 text-slate-500 dark:text-slate-400 relative">
                      <button
                        onClick={(e) => handleShareGem(gem, e)}
                        className="p-1.5 hover:text-blue-400 hover:bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
                        title="Bagikan Link Gem"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleEditGem(gem, e)}
                        className="p-1.5 hover:text-blue-400 hover:bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Gem"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownGemId(activeDropdownGemId === gem.id ? null : gem.id);
                        }}
                        className="p-1.5 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
                        title="Menu Lainnya (⋮)"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Three-dots Menu Dropdown */}
                      {activeDropdownGemId === gem.id && (
                        <div className="absolute right-0 top-10 w-44 bg-[#1a1d28] border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl p-1 z-30 space-y-0.5 text-xs animate-in fade-in">
                          <button
                            onClick={(e) => handleEditGem(gem, e)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-600/30 rounded-lg text-slate-700 dark:text-slate-200 flex items-center space-x-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Edit Gem</span>
                          </button>
                          <button
                            onClick={(e) => handleShareGem(gem, e)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-600/30 rounded-lg text-slate-700 dark:text-slate-200 flex items-center space-x-2"
                          >
                            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Bagikan ID Gem</span>
                          </button>
                          <hr className="border-slate-200 dark:border-slate-800 my-1" />
                          <button
                            onClick={(e) => handleDeleteGem(gem.id, gem.name, e)}
                            className="w-full text-left px-3 py-2 hover:bg-rose-600/30 rounded-lg text-rose-300 flex items-center space-x-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Hapus Gem</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Explanation Box */}
            <div className="bg-[#12151f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                <Gem className="w-4 h-4 text-blue-400" />
                <span>Konsep & Cara Kerja Gem Custom:</span>
              </h4>
              <p>
                <strong className="text-blue-300">Gem sebagai Asisten AI Custom:</strong> Gem adalah versi khusus dari Gemini yang telah diprogram dengan instruksi sistem (system instructions), batasan tugas, dan peran tetap. Berbeda dari chat biasa, Gem akan <strong className="text-slate-800 dark:text-slate-100">selalu mengingat perannya</strong> setiap kali diajak bicara tanpa perlu penjelasan ulang di tiap prompt baru.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px]">
                <div className="bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong className="text-amber-300 block mb-1">Gems made by Labs</strong>
                  Aplikasi eksperimen mini karya Google Labs untuk studi kasus kreatif.
                </div>
                <div className="bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong className="text-cyan-300 block mb-1">Pengelola Gem (Google)</strong>
                  Gem kustom standar siap pakai dari Google untuk ide, karir, dan coding.
                </div>
                <div className="bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong className="text-emerald-300 block mb-1">Gem Saya</strong>
                  Tempat menyimpan Gem buatan Anda sendiri khusus untuk tugas tim Maxy Academy.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: FORM "GEM BARU" (Creating / Editing Gem) */}
        {currentView === 'create-gem' && (
          <div className="flex-1 flex flex-col bg-[#0d0e12] overflow-hidden">
            {/* Top Bar Header */}
            <div className="h-14 bg-[#14161f] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setCurrentView('gems-manager');
                    showToastMsg('Batal membuat Gem');
                  }}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:bg-slate-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Gem className="w-4 h-4 text-blue-400" />
                  <span>{editingGemId ? 'Edit Gem' : 'Gem Baru'}</span>
                </h2>
              </div>

              <button
                onClick={handleSaveGem}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition-all"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>

            {/* Split Form View: Left Form Fields + Right Real-time Preview Panel */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* LEFT FORM FIELDS (Cols 7) */}
              <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-5 border-r border-slate-200 dark:border-slate-800">
                {/* Field: Nama */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Nama Gem</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Beri nama Gem Anda (mis. Maxy Recruitment Screener AI)"
                    className="w-full bg-[#161822] border border-slate-300 dark:border-slate-700/80 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Field: Deskripsi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Deskripsi Singkat</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Deskripsikan Gem Anda dan jelaskan kegunaannya"
                    rows={2}
                    className="w-full bg-[#161822] border border-slate-300 dark:border-slate-700/80 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Field: Petunjuk (System Instructions) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1">
                      <span>Petunjuk (System Instructions)</span>
                      <span title="System instruction utama yang mengatur peran dan format jawaban Gem"><Info className="w-3.5 h-3.5 text-slate-500" /></span>
                    </label>

                    {/* Instruction Toolbar */}
                    <div className="flex items-center space-x-1">
                      <button onClick={() => showToastMsg('Undo')} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => showToastMsg('Redo')} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200">
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleMagicImprove}
                        className="bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-700/80 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center space-x-1"
                        title="Tingkatkan petunjuk dengan AI Magic"
                      >
                        <Wand2 className="w-3 h-3 text-indigo-400" />
                        <span>Sempurnakan</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    placeholder="Contoh: Kamu adalah seorang ahli rekrutmen di Maxy Academy dengan spesialisasi di bidang screening CV dan evaluasi bakat. Kamu membantu tim HR menyusun ringkasan kualifikasi kandidat..."
                    rows={6}
                    className="w-full bg-[#161822] border border-slate-300 dark:border-slate-700/80 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 font-mono leading-relaxed focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Dropdown: Alat Default */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Alat default</label>
                  <select
                    value={formTool}
                    onChange={(e) => setFormTool(e.target.value)}
                    className="w-full bg-[#161822] border border-slate-300 dark:border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Tidak ada alat default">Tidak ada alat default</option>
                    <option value="Google Search">Google Search (Riset Web Real-time)</option>
                    <option value="Python Code Interpreter">Python Code Interpreter (Eksekusi Kode)</option>
                  </select>
                </div>

                {/* Section: Informasi / File Referensi */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Informasi (File Referensi)</label>
                  <div 
                    onClick={() => showToastMsg('Unggah PDF / Dokumen sebagai basis pengetahuan Gem')}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500/80 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#141620]"
                  >
                    <Paperclip className="w-5 h-5 text-slate-500 dark:text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-blue-400">Tambah file referensi</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">PDF, DOCX, TXT hingga 25 MB</p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                  Gemini dapat membuat kesalahan, jadi periksa kembali responsnya. Gem kustom Anda juga akan terlihat di Gemini untuk Workspace.
                </p>
              </div>

              {/* RIGHT REAL-TIME PREVIEW PANEL (Cols 5) */}
              <div className="lg:col-span-5 bg-[#0a0b0e] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pratinjau Modul Gem</h3>

                  {!formName.trim() ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-[#12141c]">
                      <Gem className="w-8 h-8 text-slate-600 mb-3" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xs">
                        Untuk melihat pratinjau Gem Anda, mulai dengan memberinya nama
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#141622] border border-slate-300 dark:border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-xl">
                      <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 border border-blue-400 flex items-center justify-center font-bold text-white text-sm">
                          {formName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{formName}</h4>
                          <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">
                            Pratinjau Gem Kustom
                          </span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#0d1322] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                        <strong className="text-blue-300 block mb-1">Simulasi Peran System Instruction:</strong>
                        {formInstructions || 'Tuliskan petunjuk untuk melihat simulasi instruksi...'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Input Field Preview */}
                <div className="pt-4 opacity-70">
                  <div className="bg-[#161822] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-500">
                    <span>Minta {formName || 'Gemini'}...</span>
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: CHAT USING CUSTOM GEM */}
        {currentView === 'gem-chat' && activeGem && (
          <div className="flex-1 flex flex-col bg-[#0b0c0f] overflow-hidden">
            {/* Header Identity Label */}
            <div className="h-12 bg-[#13151f] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className={`w-7 h-7 rounded-lg ${activeGem.iconBg} flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs`}>
                  {activeGem.initial}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <span>{activeGem.name}</span>
                    <span className="text-[10px] text-blue-400 font-mono">• Gem Kustom</span>
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentView('gems-manager');
                  showToastMsg('Kembali ke Gem Manager');
                }}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg transition-colors"
              >
                Ganti Gem
              </button>
            </div>

            {/* Error Alert Message Box */}
            {chatError && (
              <div className="mx-4 mt-3 bg-rose-950/80 border border-rose-800 p-3 rounded-xl text-xs text-rose-200 flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{chatError}</span>
                </div>
                <button onClick={() => setChatError(null)} className="p-1 hover:text-slate-900 dark:text-white">
                  <X className="w-3.5 h-3.5 text-rose-300" />
                </button>
              </div>
            )}

            {/* Chat History Container */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-w-3xl w-full mx-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.label && (
                    <span className="text-[10px] font-bold text-blue-400 mb-1 flex items-center space-x-1">
                      <Gem className="w-3 h-3 text-blue-400" />
                      <span>{msg.label}</span>
                    </span>
                  )}

                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-600 text-white font-medium max-w-[85%] shadow-md' : 'bg-[#141620] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 w-full shadow-lg font-sans'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center space-x-2 text-xs text-blue-400 animate-pulse p-3 bg-[#141620] rounded-xl border border-slate-200 dark:border-slate-800">
                  <Sparkles className="w-4 h-4 animate-spin shrink-0" />
                  <span>{activeGem.name} sedang memproses jawaban berdasarkan System Instruction...</span>
                </div>
              )}
            </div>

            {/* Input Box Bar */}
            <div className="p-4 bg-[#12141c] border-t border-slate-200 dark:border-slate-800 shrink-0 max-w-3xl w-full mx-auto rounded-t-2xl">
              <div className="bg-[#191c28] border border-slate-300 dark:border-slate-700/80 rounded-2xl p-2.5 space-y-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendPrompt();
                    }
                  }}
                  placeholder={`Minta ${activeGem.name}...`}
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none px-2"
                />

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-blue-300 font-mono">Mode: {selectedMode}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => showToastMsg('Mic input')} className="p-1 hover:text-slate-900 dark:text-white">
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleSendPrompt}
                      disabled={!chatInput.trim() || isGenerating}
                      className="p-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

