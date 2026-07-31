import React, { useState, useEffect } from 'react';
import { 
  Brain, Search, PanelLeft, Plus, ChevronDown, ChevronRight, 
  Paperclip, Send, Globe, Zap, Gem, Image as ImageIcon, 
  Download, Settings, HelpCircle, LogOut, X, Copy, Check, 
  RotateCcw, ThumbsUp, ThumbsDown, Sparkles, Monitor, Smartphone, 
  Menu, User, Atom, Cpu, CheckCircle2, MoreHorizontal, MessageSquare,
  ShieldCheck, RefreshCw, ArrowUp
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

export const DeepSeekReplica: React.FC = () => {
  // Active modal state for feature explanations
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);

  // View Mode: 'desktop' | 'mobile'
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

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Desktop sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Profile popup menu state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // DeepSeek Mode state: 'instant' | 'expert' | 'vision'
  const [selectedMode, setSelectedMode] = useState<'instant' | 'expert' | 'vision'>('instant');

  // DeepThink (R1) reasoning toggle
  const [isDeepThinkActive, setIsDeepThinkActive] = useState(true);

  // Search Web toggle
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Chat execution state
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'ai';
    text: string;
    thought?: string;
    showThought?: boolean;
    mode?: string;
    hasSearch?: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fictional Chat History items grouped by date (replaces old screenshot chats)
  const [chatHistory, setChatHistory] = useState([
    {
      period: '2026-07',
      items: [
        { id: 'h1', title: 'Panduan Arsitektur DeepSeek-R1 MoE', active: false },
        { id: 'h2', title: 'Implementasi LangChain & DeepSeek API', active: false },
        { id: 'h3', title: 'Studi Kasus Reasoning Model v3', active: false },
      ]
    },
    {
      period: '2026-03',
      items: [
        { id: 'h4', title: 'Optimasi Code Python Maxy AI', active: false },
        { id: 'h5', title: 'Analisis Benchmark Llama 3 vs DeepSeek', active: false },
        { id: 'h6', title: 'Arsitektur Multi-Head Latent Attention', active: false },
        { id: 'h7', title: 'Framework Agile & Prompting RCTF', active: false },
        { id: 'h8', title: 'Integrasi Database & REST API Express', active: false },
      ]
    },
    {
      period: '2026-02',
      items: [
        { id: 'h9', title: 'Sistem Rekomendasi ML Maxy Academy', active: false },
        { id: 'h10', title: 'Script Otomasi Data Pipeline ETL', active: false },
      ]
    }
  ]);

  // Modal explanation database
  const modalData: Record<string, ModalContent> = {
    'new-chat': {
      title: 'New Chat (Sesi Obrolan Baru)',
      category: 'Manajemen Percakapan',
      badge: 'Core DeepSeek',
      iconName: 'Plus',
      description: 'Membuka lembar obrolan baru dengan memori konteks bersih. Memungkinkan Anda memulai topik analisis baru tanpa terkontaminasi oleh percakapan sebelumnya.',
      keyFeatures: [
        'Mereset window konteks memori AI',
        'Menyimpan otomatis obrolan sebelumnya ke sidebar riwayat',
        'Mengembalikan parameter pemikiran (DeepThink/Search) ke opsi bawaan'
      ],
      howToUse: 'Klik tombol "+ New chat" di bagian atas sidebar atau tekan ikon tambah (+) di pojok kanan atas tampilan mobile.'
    },
    'deepthink': {
      title: 'DeepThink (R1) - Chain of Thought Engine',
      category: 'Penalaran Lanjutan (Reasoning)',
      badge: 'Inovasi DeepSeek-R1',
      iconName: 'Atom',
      description: 'Fitur andalan DeepSeek-R1 yang mengaktifkan mode pemikiran penalaran logika mendalam (Chain of Thought). AI akan melakukan simulasi pertimbangan dan langkah pemecahan masalah dalam blok <thought> sebelum menampilkan jawaban akhir.',
      keyFeatures: [
        'Transparansi penuh alur pikir AI (Chain of Thought)',
        'Pemeriksaan mandiri (self-correction) sebelum menjawab',
        'Sangat tangguh untuk soal matematika olimpiade, algoritma koding rumit, dan teka-teki logika'
      ],
      howToUse: 'Aktifkan tombol "DeepThink" di bagian bawah kotak input pesan sebelum mengirim pertanyaan logika atau koding.'
    },
    'search': {
      title: 'Search (Pencarian Web Real-Time)',
      category: 'Grounding & Akses Informasi',
      badge: 'Live Data',
      iconName: 'Globe',
      description: 'Mengintegrasikan mesin pencari web secara langsung dengan model DeepSeek untuk memberikan informasi paling mutakhir dan kutipan sumber ilmiah yang terverifikasi.',
      keyFeatures: [
        'Akses data ter-update secara real-time dari internet',
        'Memberikan referensi link dan atribusi sumber informasi',
        'Meminimalkan risiko halusinasi data terbaru'
      ],
      howToUse: 'Klik tombol "Search" di dalam kotak input pesan agar DeepSeek mencari referensi berita atau data terkini di web.'
    },
    'mode-instant': {
      title: 'Mode Instant (Fast Response)',
      category: 'Kecepatan & Efisiensi',
      badge: 'DeepSeek-V3',
      iconName: 'Zap',
      description: 'Mode standar bertenaga DeepSeek-V3 yang dioptimalkan untuk kecepatan respons kilat dan penggunaan sehari-hari seperti percakapan umum, penulisan cepat, dan rangkuman teks.',
      keyFeatures: [
        'Latensi sangat rendah (respons kilat)',
        'Sangat hemat resource komputasi',
        'Cocok untuk tugas kreatif, penerjemahan, dan percakapan santai'
      ],
      howToUse: 'Pilih tombol pill "Instant" di atas kotak percakapan untuk mengaktifkan pemrosesan cepat.'
    },
    'mode-expert': {
      title: 'Mode Expert (Deep Analytical Mode)',
      category: 'Komputasi Kompleks',
      badge: 'Professional',
      iconName: 'Gem',
      description: 'Mode analisis tingkat tinggi yang mengalokasikan parameter komputasi lebih besar untuk menangani arsitektur sistem, analisis data komprehensif, dan pembuatan dokumen teknis.',
      keyFeatures: [
        'Kedalaman analisis tingkat profesional',
        'Penanganan prompt teknis bernuansa spesifik',
        'Sintesis data multi-referensi yang akurat'
      ],
      howToUse: 'Klik pill "Expert" saat Anda membutuhkan analisis bisnis mendalam, ulasan arsitektur software, atau formulasi riset.'
    },
    'mode-vision': {
      title: 'Mode Vision (Multimodal Analisis Gambar)',
      category: 'Pengolahan Citra & Visual',
      badge: 'Multimodal AI',
      iconName: 'ImageIcon',
      description: 'Kemampuan analisis visual multimodal DeepSeek untuk membaca gambar, diagram arsitektur, screenshot kode error, tabel grafis, dan dokumen hasil scan.',
      keyFeatures: [
        'Ekstraksi teks dari gambar (OCR tingkat lanjut)',
        'Analisis diagram alur (flowchart) dan arsitektur UI/UX',
        'Deteksi bug dari screenshot tampilan aplikasi'
      ],
      howToUse: 'Pilih mode "Vision" dan lampirkan file gambar melalui ikon klip kertas (Paperclip).'
    },
    'attachment': {
      title: 'Upload Lampiran & Dokumen',
      category: 'Input Multimodal',
      badge: 'File Support',
      iconName: 'Paperclip',
      description: 'Fasilitas untuk melampirkan berkas dokumen (PDF, TXT, CSV, Python Script) atau gambar pendukung untuk dianalisis oleh DeepSeek.',
      keyFeatures: [
        'Dukungan multi-format file teks dan gambar',
        'Analisis isi dokumen secara instan',
        'Integrasi langsung dengan mode DeepThink R1'
      ],
      howToUse: 'Klik ikon klip kertas (📎) di pojok kanan bawah kotak pesan untuk memilih file dari perangkat Anda.'
    },
    'profile-maxy': {
      title: 'Profil Pengguna - Maxy Academy',
      category: 'Manajemen Akun',
      badge: 'Verified Account',
      iconName: 'User',
      description: 'Pusat pengaturan profil pengguna terverifikasi atas nama Maxy Academy. Menyediakan akses cepat ke pengaturan aplikasi, unduhan versi mobile, dan bantuan.',
      keyFeatures: [
        'Identitas pengguna aktif Maxy Academy',
        'Akses ke menu dropdown sistem dan lisensi',
        'Sinkronisasi riwayat obrolan antar-perangkat'
      ],
      howToUse: 'Klik area nama "Maxy Academy" atau ikon titik tiga (...) di sudut kiri bawah untuk membuka menu konteks pengguna.'
    },
    'download-app': {
      title: 'Download Mobile App',
      category: 'Aplikasi Lintas Platform',
      badge: 'iOS & Android',
      iconName: 'Smartphone',
      description: 'Fitur untuk mengunduh aplikasi resmi DeepSeek di smartphone (Android & iOS) agar dapat mengakses model DeepThink R1 secara portabel.',
      keyFeatures: [
        'Pencerminan riwayat obrolan real-time via cloud',
        'Dukungan input suara dan analisis kamera bawaan',
        'Notifikasi respons latar belakang'
      ],
      howToUse: 'Pilih opsi "Download mobile app" dari menu profil pengguna untuk mendapatkan QR Code unduhan.'
    },
    'settings': {
      title: 'Settings (Pengaturan DeepSeek)',
      category: 'Konfigurasi Sistem',
      badge: 'System Config',
      iconName: 'Settings',
      description: 'Panel preferensi sistem untuk mengatur tema visual (Dark/Light mode), bahasa antarmuka, batas token, dan integrasi API Key lokal.',
      keyFeatures: [
        'Pengaturan tema warna antarmuka',
        'Konfigurasi pemuatan memori sistem',
        'Manajemen privasi data dan riwayat'
      ],
      howToUse: 'Klik "Settings" dari menu profil di bagian bawah sidebar.'
    },
    'help-feedback': {
      title: 'Help & Feedback (Bantuan & Upan Balik)',
      category: 'Dukungan Pengguna',
      badge: 'Support',
      iconName: 'HelpCircle',
      description: 'Pusat dokumentasi resmi, panduan prompting DeepSeek, serta formulir pengiriman masukan untuk pengembang DeepSeek.',
      keyFeatures: [
        'Akses ke dokumentasi DeepSeek-V3/R1',
        'Panduan efisiensi token & prompt engineering',
        'Kanal pelaporan bug dan saran fitur'
      ],
      howToUse: 'Buka menu profil dan pilih "Help & Feedback" untuk membaca panduan resmi.'
    },
    'fictional-history': {
      title: 'Riwayat Obrolan Fiksi Maxy Academy',
      category: 'Navigasi Percakapan',
      badge: 'Saved Session',
      iconName: 'MessageSquare',
      description: 'Daftar topik percakapan pembelajaran dan riset AI yang tersimpan rapi di akun Maxy Academy berdasarkan urutan waktu (tahun dan bulan).',
      keyFeatures: [
        'Pengelompokan tanggal otomatis (2026-07, 2026-03, dll)',
        'Pencarian judul obrolan secara fleksibel',
        'Pemuatan ulang konteks diskusi hanya dengan satu klik'
      ],
      howToUse: 'Klik salah satu judul obrolan di sidebar untuk membuka kembali sesi percakapan tersebut.'
    },
    'thought-block': {
      title: '<thought> Chain of Thought Block',
      category: 'Interaktif R1 Reasoning',
      badge: 'Transparansi Logika',
      iconName: 'Brain',
      description: 'Blok transparan pemikiran internal DeepSeek-R1 yang menampilkan setiap penimbangan logika, deduksi matematika, dan verifikasi aturan sebelum menyusun jawaban akhir.',
      keyFeatures: [
        'Visualisasi proses berpikir AI secara bertahap',
        'Dapat diciutkan/dilebarkan sesuai kebutuhan baca',
        'Memperlihatkan koreksi diri saat AI menemukan kontradiksi logika'
      ],
      howToUse: 'Klik tombol "Thinking Process..." di atas jawaban DeepSeek untuk melihat alur pikir R1.'
    }
  };

  const openModal = (key: string) => {
    if (modalData[key]) {
      setActiveModal(modalData[key]);
    }
  };

  // Handle prompt submit simulation
  const handleSendMessage = (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: prompt,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    // Simulate AI response generation with optional DeepThink thought block
    setTimeout(() => {
      let thoughtContent = '';
      let responseText = '';

      if (isDeepThinkActive) {
        thoughtContent = `1. Memahami kueri pengguna: "${prompt}".\n2. Menganalisis menggunakan arsitektur Mixture of Experts (MoE) & Multi-head Latent Attention (MLA).\n3. Mengevaluasi batasan logika dan konteks riset Maxy Academy.\n4. Merumuskan solusi sistematis dan memverifikasi keakuratan sintaks/logika.`;
      }

      if (prompt.toLowerCase().includes('python') || prompt.toLowerCase().includes('code')) {
        responseText = `Berikut adalah contoh skrip Python teroptimasi yang direkomendasikan oleh DeepSeek-V3/R1 untuk Maxy Academy:\n\n\`\`\`python\nimport asyncio\nfrom typing import Dict, Any\n\nasync def process_maxy_ai_data(payload: Dict[str, Any]) -> Dict[str, Any]:\n    """\n    Fungsi pemrosesan data AI dengan efisiensi tinggi.\n    """\n    print(f"[DeepSeek Engine] Pemrosesan payload: {payload.get('task_name')}")\n    await asyncio.sleep(0.5) # Simulasi latensi rendah\n    return {\n        "status": "success",\n        "model": "DeepSeek-R1",\n        "accuracy": 0.994,\n        "result": "Data berhasil dianalisis oleh sistem Maxy Academy"\n    }\n\n# Jalankan pemrosesan\nif __name__ == "__main__":\n    result = asyncio.run(process_maxy_ai_data({"task_name": "Riset Reasoning MoE"}))\n    print(result)\n\`\`\`\n\n**Analisis Efisiensi:**\nKode di atas menggunakan model asinkron untuk mempertahankan pemprosesan throughput tinggi dengan konsumsi memori minimal.`;
      } else if (prompt.toLowerCase().includes('siapa') || prompt.toLowerCase().includes('maxy')) {
        responseText = `**Maxy Academy** adalah platform edukasi & teknologi terdepan yang fokus pada pengembangan talenta digital, kecerdasan buatan (AI), data science, dan rekayasa perangkat lunak.\n\nSistem DeepSeek terintegrasi penuh untuk membantu riset, modul interaktif, dan optimasi alur kerja pembelajaran di Maxy Academy.`;
      } else {
        responseText = `Terima kasih atas pertanyaan Anda di **DeepSeek Simulator (Maxy Academy)**!\n\nSebagai model AI berefisiensi tinggi, DeepSeek siap membantu Anda menyelesaikan berbagai masalah kompleks:\n\n1. **Penalaran Logika & Matematika**: Melalui tombol **DeepThink (R1)**, Anda dapat melihat alur logika <thought> secara transparan.\n2. **Akses Web Terkini**: Aktifkan fitur **Search** untuk mendapatkan kutipan data real-time.\n3. **Analisis Multimodal**: Gunakan mode **Vision** untuk memeriksa diagram atau screenshot kode.\n\nAda hal teknis spesifik yang ingin kita diskusikan bersama Maxy Academy hari ini?`;
      }

      const aiMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai' as const,
          text: responseText,
          thought: thoughtContent,
          showThought: true,
          mode: selectedMode,
          hasSearch: isSearchActive,
        }
      ]);
      setIsLoading(false);
    }, 1200);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThoughtVisibility = (msgId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId ? { ...msg, showThought: !msg.showThought } : msg
      )
    );
  };

  // Sidebar content component (used for both desktop and mobile drawer)
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#18191c] text-slate-600 dark:text-slate-300 select-none border-r border-[#26272c]">
      {/* Top Header: DeepSeek Logo & Controls */}
      <div className="p-3.5 flex items-center justify-between border-b border-[#26272c]/60">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => openModal('new-chat')}
        >
          {/* DeepSeek Logo Icon (Whale SVG) */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-900 dark:text-white fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
              <circle cx="13" cy="12" r="2"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white font-sans group-hover:text-blue-400 transition-colors">
            deepseek
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => openModal('search')}
            className="p-1.5 rounded-lg hover:bg-[#282a30] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              if (viewMode === 'desktop') {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              } else {
                setIsMobileSidebarOpen(false);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-[#282a30] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={() => {
            setMessages([]);
            openModal('new-chat');
            if (viewMode === 'mobile') setIsMobileSidebarOpen(false);
          }}
          className="w-full py-2 px-3.5 rounded-full bg-[#282a30] hover:bg-[#32353e] text-slate-800 dark:text-slate-100 font-medium text-sm flex items-center gap-2 border border-slate-300 dark:border-slate-700/50 shadow-sm transition-all group"
        >
          <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center group-hover:border-white">
            <Plus className="w-3 h-3 text-slate-700 dark:text-slate-200" />
          </div>
          <span>New chat</span>
        </button>
      </div>

      {/* Chat History List (Fictional conversations for Maxy Academy) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-700">
        {chatHistory.map((group) => (
          <div key={group.period} className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {group.period}
            </div>
            {group.items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  openModal('fictional-history');
                  handleSendMessage(`Buka kembali sesi percakapan "${item.title}"`);
                  if (viewMode === 'mobile') setIsMobileSidebarOpen(false);
                }}
                className="px-2.5 py-2 rounded-lg hover:bg-[#24262c] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white cursor-pointer transition-colors truncate flex items-center gap-2 group"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                <span className="truncate">{item.title}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Profile Bar - Maxy Academy */}
      <div className="relative p-3 border-t border-[#26272c] bg-[#151619]">
        {/* Profile Popup Menu */}
        {isProfileMenuOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-[#23252b] border border-slate-300 dark:border-slate-700/80 rounded-xl shadow-2xl p-1.5 space-y-0.5 text-xs z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              onClick={() => {
                setIsProfileMenuOpen(false);
                openModal('download-app');
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2d3038] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition-colors"
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Download mobile app</span>
            </button>
            <button
              onClick={() => {
                setIsProfileMenuOpen(false);
                openModal('settings');
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2d3038] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                setIsProfileMenuOpen(false);
                openModal('help-feedback');
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2d3038] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Help & Feedback</span>
            </button>
            <div className="my-1 border-t border-slate-300 dark:border-slate-700/60" />
            <button
              onClick={() => {
                setIsProfileMenuOpen(false);
                openModal('profile-maxy');
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2d3038] text-rose-400 flex items-center gap-2.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        )}

        {/* Profile Click Target */}
        <div
          onClick={() => {
            setIsProfileMenuOpen(!isProfileMenuOpen);
            openModal('profile-maxy');
          }}
          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#24262c] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center font-semibold text-slate-900 dark:text-white text-xs shrink-0 shadow-md">
              MA
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
              Maxy Academy
            </span>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 hover:text-slate-900 dark:text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#131417] overflow-hidden shadow-2xl text-slate-800 dark:text-slate-100 font-sans flex flex-col min-h-[720px] max-h-[880px]">
      {/* Interactive Replica Top Control Bar */}
      <div className="bg-[#18191c] border-b border-[#26272c] px-4 py-2.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 ml-2">
            <Atom className="w-4 h-4 text-blue-400 animate-pulse" />
            DeepSeek AI Replica (Maxy Academy)
          </span>
        </div>

        {/* Desktop / Mobile View Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#23252b] p-1 rounded-lg border border-slate-300 dark:border-slate-700/60">
          <button
            onClick={() => {
              setViewMode('desktop');
              setIsMobileSidebarOpen(false);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop View</span>
          </button>
          <button
            onClick={() => {
              setViewMode('mobile');
              setIsSidebarCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile View</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      {viewMode === 'mobile' ? (
        /* Mobile Device Outer Phone Frame Simulation */
        <div className="flex-1 flex items-center justify-center p-3 bg-[#0c0d0f] overflow-hidden">
          <div className="relative w-full max-w-[380px] h-[670px] rounded-[36px] border-[6px] border-slate-200 dark:border-slate-800 bg-[#131417] overflow-hidden shadow-2xl flex flex-col">
            {/* Mobile Sidebar Overlay Drawer */}
            {isMobileSidebarOpen && (
              <div className="absolute inset-0 z-40 flex">
                <div 
                  className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className="relative w-[82%] h-full z-50 animate-in slide-in-from-left duration-200">
                  {renderSidebarContent()}
                </div>
              </div>
            )}

            {/* Mobile Top Header */}
            <div className="p-3 border-b border-[#26272c] bg-[#18191c] flex items-center justify-between z-20 shrink-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 rounded-lg hover:bg-[#282a30] text-slate-600 dark:text-slate-300 transition-colors"
                title="Open Navigation Drawer"
              >
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-900 dark:text-white fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
                  </svg>
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">deepseek</span>
              </div>
              <button
                onClick={() => {
                  setMessages([]);
                  openModal('new-chat');
                }}
                className="p-1.5 rounded-lg hover:bg-[#282a30] text-slate-600 dark:text-slate-300 transition-colors"
                title="New Chat"
              >
                <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center hover:border-white">
                  <Plus className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
                </div>
              </button>
            </div>

            {/* Messages or Welcome Center Area */}
            <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.length === 0 ? (
                /* Initial Welcome Dashboard matching Mobile Screenshot */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 my-auto py-6">
                  {/* Whale Icon Header */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-900 dark:text-white fill-current">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
                        <circle cx="13" cy="12" r="2"/>
                      </svg>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Start chatting with {selectedMode === 'instant' ? 'Instant' : selectedMode === 'expert' ? 'Expert' : 'Vision'}
                    </h1>
                  </div>

                  {/* Mode Selector Switcher Pills */}
                  <div className="inline-flex items-center p-1 rounded-full bg-[#1c1e23] border border-[#2b2d35] shadow-inner">
                    <button
                      onClick={() => {
                        setSelectedMode('instant');
                        openModal('mode-instant');
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        selectedMode === 'instant'
                          ? 'bg-[#3b82f6] text-slate-900 dark:text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>Instant</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMode('expert');
                        openModal('mode-expert');
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        selectedMode === 'expert'
                          ? 'bg-[#3b82f6] text-slate-900 dark:text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Gem className="w-3 h-3" />
                      <span>Expert</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMode('vision');
                        openModal('mode-vision');
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        selectedMode === 'vision'
                          ? 'bg-[#3b82f6] text-slate-900 dark:text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Vision</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Chat Thread Messages */
                <div className="space-y-4 pb-20">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2 animate-in fade-in duration-200">
                      {msg.sender === 'user' ? (
                        <div className="flex justify-end">
                          <div className="bg-[#2b2d36] text-slate-800 dark:text-slate-100 px-3.5 py-2 rounded-2xl rounded-tr-sm max-w-[90%] text-xs leading-relaxed border border-slate-300 dark:border-slate-700/50">
                            {msg.text}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-md mt-0.5">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-900 dark:text-white fill-current">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
                            </svg>
                          </div>
                          <div className="flex-1 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                            {msg.thought && (
                              <div className="rounded-lg border border-blue-900/40 bg-blue-950/30 p-2 text-[11px] space-y-1">
                                <button
                                  onClick={() => {
                                    toggleThoughtVisibility(msg.id);
                                    openModal('thought-block');
                                  }}
                                  className="flex items-center justify-between w-full font-medium text-blue-300"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <Brain className="w-3.5 h-3.5 text-blue-400" />
                                    <span>Thinking Process (R1)</span>
                                  </div>
                                  {msg.showThought ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                </button>
                                {msg.showThought && (
                                  <div className="p-2 rounded bg-[#111317] font-mono text-[10px] text-slate-600 dark:text-slate-300 whitespace-pre-line">
                                    {msg.thought}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="whitespace-pre-line leading-relaxed font-sans">
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 animate-pulse text-xs text-slate-500 dark:text-slate-400">
                      <Atom className="w-4 h-4 text-blue-400 animate-spin" />
                      <span>DeepSeek thinking...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Mobile Prompt Input Box */}
            <div className="p-3 bg-[#131417] border-t border-[#26272c]/60 shrink-0">
              <div className="relative rounded-2xl bg-[#212328] border border-slate-300 dark:border-slate-700/60 p-2.5 shadow-xl transition-all">
                <div className="absolute top-2.5 right-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse block" />
                </div>
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message DeepSeek"
                  rows={2}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400/80 text-xs focus:outline-none resize-none pr-6"
                />
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-300 dark:border-slate-700/40 mt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDeepThinkActive(!isDeepThinkActive);
                        openModal('deepthink');
                      }}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 border ${
                        isDeepThinkActive
                          ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                          : 'bg-[#282a30] border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Atom className="w-3 h-3" />
                      <span>DeepThink</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchActive(!isSearchActive);
                        openModal('search');
                      }}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 border ${
                        isSearchActive
                          ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                          : 'bg-[#282a30] border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>Search</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openModal('attachment')}
                      className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={!inputPrompt.trim() || isLoading}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        inputPrompt.trim() && !isLoading
                          ? 'bg-blue-600 text-white shadow-md hover:bg-blue-500'
                          : 'bg-[#30333d] text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop View Workspace */
        <div className="relative flex-1 flex overflow-hidden">
          {/* Desktop View Sidebar */}
          {!isSidebarCollapsed && (
            <div className="w-64 shrink-0 h-full">
              {renderSidebarContent()}
            </div>
          )}

          {/* Main Chat Workspace Area */}
          <div className="flex-1 flex flex-col h-full bg-[#131417] overflow-hidden relative">
            {/* Desktop Uncollapse Button if collapsed */}
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="absolute top-3 left-3 z-30 p-2 rounded-lg bg-[#23252b] border border-slate-300 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-[#2d3038] shadow-lg transition-all"
                title="Expand Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {/* Messages or Welcome Center Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.length === 0 ? (
                /* Initial Welcome Dashboard matching Screenshot */
                <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto space-y-6 pt-4 pb-12">
                  {/* Whale Icon Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-900 dark:text-white fill-current">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
                        <circle cx="13" cy="12" r="2"/>
                      </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Start chatting with {selectedMode === 'instant' ? 'Instant' : selectedMode === 'expert' ? 'Expert' : 'Vision'}
                    </h1>
                  </div>

                  {/* Mode Selector Switcher Pills */}
                  <div className="inline-flex items-center p-1 rounded-full bg-[#1c1e23] border border-[#2b2d35] shadow-inner">
                    <button
                      onClick={() => {
                        setSelectedMode('instant');
                        openModal('mode-instant');
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        selectedMode === 'instant'
                          ? 'bg-[#3b82f6] text-slate-900 dark:text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Instant</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMode('expert');
                        openModal('mode-expert');
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        selectedMode === 'expert'
                          ? 'bg-[#3b82f6] text-slate-900 dark:text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Gem className="w-3.5 h-3.5" />
                      <span>Expert</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMode('vision');
                        openModal('mode-vision');
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        selectedMode === 'vision'
                          ? 'bg-[#3b82f6] text-slate-900 dark:text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Vision</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Chat Thread Messages */
                <div className="max-w-3xl mx-auto space-y-6 pb-24">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-3 animate-in fade-in duration-200">
                      {msg.sender === 'user' ? (
                        <div className="flex justify-end">
                          <div className="bg-[#2b2d36] text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] text-sm leading-relaxed shadow-sm border border-slate-300 dark:border-slate-700/50">
                            {msg.text}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-md mt-0.5">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-900 dark:text-white fill-current">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
                            </svg>
                          </div>

                          <div className="flex-1 space-y-3 overflow-hidden text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {msg.thought && (
                              <div className="rounded-xl border border-blue-900/40 bg-gradient-to-r from-blue-950/30 to-indigo-950/20 p-3 text-xs space-y-2">
                                <button
                                  onClick={() => {
                                    toggleThoughtVisibility(msg.id);
                                    openModal('thought-block');
                                  }}
                                  className="flex items-center justify-between w-full font-medium text-blue-300 hover:text-blue-200 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
                                    <span>Thinking Process (DeepSeek-R1 Chain of Thought)</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[11px] text-blue-400/80">
                                    <span>{msg.showThought ? 'Hide' : 'Show'}</span>
                                    {msg.showThought ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                  </div>
                                </button>

                                {msg.showThought && (
                                  <div className="p-2.5 rounded-lg bg-[#111317] border border-blue-900/30 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                    {msg.thought}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="whitespace-pre-line leading-relaxed font-sans">
                              {msg.text}
                            </div>

                            <div className="flex items-center gap-2 pt-1 text-slate-500">
                              <button
                                onClick={() => copyToClipboard(msg.id, msg.text)}
                                className="p-1.5 rounded-md hover:bg-[#25272e] hover:text-slate-600 dark:text-slate-300 transition-colors"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleSendMessage("Bisa jelaskan kembali dengan contoh lebih detail?")}
                                className="p-1.5 rounded-md hover:bg-[#25272e] hover:text-slate-600 dark:text-slate-300 transition-colors"
                                title="Regenerate"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 rounded-md hover:bg-[#25272e] hover:text-slate-600 dark:text-slate-300 transition-colors">
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 rounded-md hover:bg-[#25272e] hover:text-slate-600 dark:text-slate-300 transition-colors">
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-3 animate-pulse">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/50 flex items-center justify-center text-xs text-white">
                        <Atom className="w-4 h-4 animate-spin" />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">DeepSeek thinking...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom DeepSeek Prompt Box */}
            <div className="p-4 bg-[#131417] border-t border-[#26272c]/40 shrink-0">
              <div className="max-w-2xl mx-auto relative rounded-2xl bg-[#212328] border border-slate-300 dark:border-slate-700/60 p-3 shadow-xl transition-all focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/30">
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message DeepSeek"
                  rows={2}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400/80 text-sm focus:outline-none resize-none pr-8"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-300 dark:border-slate-700/40 mt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDeepThinkActive(!isDeepThinkActive);
                        openModal('deepthink');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                        isDeepThinkActive
                          ? 'bg-blue-950/60 border-blue-500/70 text-blue-300 shadow-sm'
                          : 'bg-[#282a30] border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Atom className="w-3.5 h-3.5" />
                      <span>DeepThink</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchActive(!isSearchActive);
                        openModal('search');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                        isSearchActive
                          ? 'bg-blue-950/60 border-blue-500/70 text-blue-300 shadow-sm'
                          : 'bg-[#282a30] border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openModal('attachment')}
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-[#2e313a] transition-colors"
                      title="Attach File"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={!inputPrompt.trim() || isLoading}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        inputPrompt.trim() && !isLoading
                          ? 'bg-blue-600 text-white shadow-md hover:bg-blue-500 scale-105'
                          : 'bg-[#30333d] text-slate-500 cursor-not-allowed'
                      }`}
                      title="Send Message"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                DeepSeek can make mistakes. Verify important information. Powered by Maxy Academy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Explanatory Feature Modal Dialog (ChatGPT Simulator Style) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#1c1e23] border border-slate-300 dark:border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    {activeModal.category}
                  </span>
                  {activeModal.badge && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50">
                      {activeModal.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {activeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p className="bg-[#141518] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                {activeModal.description}
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Fitur Utama & Keunggulan:
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {activeModal.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 space-y-1">
                <h4 className="font-semibold text-blue-300 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Cara Penggunaan di Simulator:
                </h4>
                <p className="text-blue-200/90 text-[11px] leading-relaxed">
                  {activeModal.howToUse}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md"
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
