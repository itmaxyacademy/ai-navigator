import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Image as ImageIcon, FileText, Globe, Sparkles, Share2, Play, Download,
  Plus, X, ChevronDown, ChevronUp, ChevronRight, Copy, Check, Send, Eye, Compass,
  HelpCircle, RotateCcw, RotateCw, PenTool, Hand, Palette, Star, Frame, MousePointer,
  Menu, BarChart2, Film, Smartphone, Laptop, Zap, User, Lock, MapPin, Building2,
  SlidersHorizontal, CheckCircle2, ArrowUpRight, Megaphone, SmartphoneCharging,
  Layers, Settings, Search, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeatureExplanationModal {
  title: string;
  category: string;
  description: string;
  parameters?: string[];
  usageGuide?: string[];
}

export const GoogleStitchReplica: React.FC = () => {
  // Device mode state: 'desktop' | 'mobile' (Auto-detect screen size)
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'mobile';
    }
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setDeviceMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // UI Interactive States
  const [activeModal, setActiveModal] = useState<FeatureExplanationModal | null>(null);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('3 Flash');
  const [selectedTheme, setSelectedTheme] = useState('Amber (#ffb034)');
  const [isAgentLogOpen, setIsAgentLogOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<string>('pointer');
  const [zoomLevel, setZoomLevel] = useState(24);
  const [promptInput, setPromptInput] = useState('');
  const [chatLog, setChatLog] = useState([
    'Attendance Tracking: A dedicated page for checking in and out with map view & status indicators.',
    'Warrior Profile: A centralized view for staff details, employee ID & preferences.',
    'Authentication: Branded Login page to secure access for mentors and staff.',
    'Navigation: Streamlined bottom bar focusing on Dashboard, Attendance, and Profile.'
  ]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulatingGenerate, setIsSimulatingGenerate] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Modal display helper
  const explainFeature = (
    title: string,
    category: string,
    description: string,
    parameters?: string[],
    usageGuide?: string[]
  ) => {
    setActiveModal({
      title,
      category,
      description,
      parameters,
      usageGuide
    });
  };

  // Handle prompt submit
  const handlePromptSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    const newText = promptInput;
    setPromptInput('');
    setIsSimulatingGenerate(true);

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        `Pembaruan UI Stitch: " ${newText} " telah dirender di kanvas Maxy Warriors Attendance.`
      ]);
      setIsSimulatingGenerate(false);
      explainFeature(
        'Generasi Kanvas AI Stitch Selesai',
        'AI Execution Engine',
        `Perintah "${newText}" telah diproses menggunakan model Gemini ${selectedModel} dengan skema warna ${selectedTheme}. Semua komponen dan layar aplikasi terkait di kanvas Maxy Academy telah diperbarui secara otomatis!`,
        [
          `Model Aktif: Gemini ${selectedModel}`,
          `Theme Palette: ${selectedTheme}`,
          `Artboard Canvas: Maxy Warriors Attendance`,
          `Target Platform: Web & Mobile App`
        ],
        [
          '1. Periksa hasil perubahan visual pada artboard kanvas utama.',
          '2. Klik tombol Play (Preview) untuk menguji fungsi tombol & navigasi.',
          '3. Ekspor kode atau desain yang dihasilkan menggunakan tombol Export.'
        ]
      );
    }, 1200);
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-800 bg-[#121316] text-slate-100 overflow-hidden shadow-2xl flex flex-col min-h-[680px]">

      {/* Simulator Device View Mode Switcher Header Bar */}
      <div className="bg-[#0b0c0e] border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">Mode Tampilan Google Stitch Simulator:</span>
        </div>
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              deviceMode === 'desktop' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              deviceMode === 'mobile' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View</span>
          </button>
        </div>
      </div>
      {/* Top Header Navigation Bar */}
      <div className="h-14 border-b border-slate-800/80 bg-[#181a20]/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => explainFeature('Side Navigation Menu', 'Header Control', 'Membuka menu navigasi utama Google Stitch, daftar proyek kanvas Maxy Academy, template, dan pengaturan akun.')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Menu Utama Stitch"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => explainFeature('Proyek: Maxy Warriors Attendance Dashboard', 'Project Title', 'Nama proyek kanvas UI/UX saat ini untuk Maxy Academy. Klik untuk mengubah nama proyek atau melihat statistik artboard.')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-semibold text-sm sm:text-base text-slate-200 group-hover:text-cyan-400 transition-colors truncate max-w-[180px] sm:max-w-xs">
              Maxy Warriors Attendance Dashboard
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              Prototyping
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">

          {/* Interactive Play Preview Button */}
          <button
            onClick={() => {
              setPreviewModalOpen(true);
              explainFeature('Play Interactive Prototype (▷)', 'Preview Engine', 'Membuka pratinjau interaktif aplikasi Maxy Warriors Attendance layaknya aplikasi yang telah dipasang di HP asli.');
            }}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
            title="Pratinjau Interaktif (Play)"
          >
            <Play className="w-4 h-4 fill-slate-300" />
            <span className="hidden lg:inline text-xs font-medium">Preview</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => explainFeature('Export Prototype & Code', 'Export Options', 'Mengekspor proyek kanvas ke file Figma, kode React/Tailwind CSS, dokumen PDF, atau gambar PNG resolusi tinggi.')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => explainFeature('Share Project Canvas', 'Collaboration', 'Membagikan tautan kolaborasi kanvas Google Stitch kepada tim pengembang Maxy Academy atau pengguna publik.')}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-600/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => explainFeature('User Profile (Maxy Academy)', 'User Account', 'Akun pengguna yang sedang aktif: maxyacademy.one@gmail.com dengan hak akses Pro Stitch Canvas.')}
            className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center cursor-pointer border border-cyan-400/40 shadow-sm"
          >
            M
          </div>
        </div>
      </div>

      {/* Main Studio Area: Canvas + Floating Agent Log Panel */}
      <div className="relative flex-1 bg-[#121316] overflow-hidden min-h-[560px] flex">

        {/* Dot Grid Canvas Background */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, #334155 1px, transparent 1px)`,
            backgroundSize: `${zoomLevel < 30 ? 16 : 24}px ${zoomLevel < 30 ? 16 : 24}px`
          }}
        />

        {/* Floating Agent Log Sidebar (Desktop Mode or Collapsible Sheet on Mobile) */}
        <div className={`z-20 transition-all duration-300 ${
          deviceMode === 'mobile' 
            ? `absolute inset-x-2 bottom-20 max-h-[380px] bg-[#1a1d24]/95 border border-slate-700 rounded-2xl shadow-2xl p-4 overflow-y-auto ${isAgentLogOpen ? 'block' : 'hidden'}`
            : `w-80 border-r border-slate-800/80 bg-[#16181e]/90 backdrop-blur-md flex flex-col justify-between shrink-0 p-4 ${isAgentLogOpen ? 'block' : 'w-12 bg-[#16181e]'}`
        }`}>
          {/* Agent Log Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Agent Log</span>
            </div>
            <button
              onClick={() => {
                setIsAgentLogOpen(!isAgentLogOpen);
                explainFeature('Toggle Agent Log Panel', 'Sidebar Control', 'Menampilkan atau menyembunyikan panel riwayat instruksi agen AI.');
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              {isAgentLogOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {isAgentLogOpen && (
            <div className="flex-1 overflow-y-auto my-3 space-y-4 pr-1 text-xs">
              {/* User Prompt Chip */}
              <div 
                onClick={() => explainFeature('Catatan Warna UI (#ffb034)', 'Agent Memory', 'Agen AI mencatat bahwa warna primer Kinetic Academy disesuaikan ke Amber #ffb034.')}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold text-[10px] flex items-center justify-center">M</div>
                  <span className="text-slate-300 truncate">used #ffb034 as the primary theme...</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 1500);
                    }} 
                    className="p-1 hover:bg-slate-800 rounded text-slate-400"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Agent Generated Summary List */}
              <div className="space-y-3 text-slate-300 leading-relaxed bg-slate-900/50 rounded-xl p-3 border border-slate-800/60">
                <p className="font-semibold text-slate-200">Perubahan Antarmuka Maxy Academy:</p>
                <ul className="space-y-2 list-disc list-inside text-slate-300">
                  <li><strong className="text-amber-400">Attendance Tracking:</strong> Halaman khusus presisi dengan peta geofence & status lokasi kerja.</li>
                  <li><strong className="text-amber-400">Warrior Profile:</strong> Tampilan terpusat data karyawan, ID MAXY-8842-WAR, dan preferensi kerja.</li>
                  <li><strong className="text-amber-400">Authentication:</strong> Layar login bertema khusus untuk mentor, magang, dan staf penuh waktu.</li>
                  <li><strong className="text-amber-400">Navigation:</strong> Baris navigasi bawah yang disederhanakan (Dashboard, Attendance, Profile).</li>
                </ul>
                <p className="pt-2 text-slate-400 italic text-[11px] border-t border-slate-800">
                  "Saya juga telah memperbarui Dashboard Utama agar selaras dengan skema warna dan struktur navigasi baru. Bagaimana tampilan ini bagi Anda?"
                </p>
              </div>

              {/* Chat Log History */}
              {chatLog.length > 4 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">Riwayat Terbaru:</span>
                  {chatLog.slice(4).map((item, idx) => (
                    <div key={idx} className="p-2 bg-cyan-950/30 border border-cyan-800/40 rounded-lg text-cyan-200">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Agent Log Collapsible Bar */}
          <div 
            onClick={() => {
              setIsAgentLogOpen(!isAgentLogOpen);
              explainFeature('Agent Log Status Bar', 'System Log', 'Status pengawasan agen AI Stitch yang sedang memantau kanvas secara real-time.');
            }}
            className="pt-2 border-t border-slate-800 flex items-center justify-between cursor-pointer text-slate-400 hover:text-slate-200 text-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium">Agent log v2.4</span>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isAgentLogOpen ? '' : 'rotate-180'}`} />
          </div>
        </div>

        {/* Center Visual Infinite Canvas Workspace */}
        <div className="flex-1 relative overflow-auto p-4 sm:p-8 flex items-center justify-center z-10">
          
          {/* Render Artboards Grid on Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto my-auto py-6">

            {/* ARTBOARD 1: Kinetic Academy Design Tokens */}
            <div 
              onClick={() => explainFeature('Artboard: Kinetic Academy Theme Tokens', 'Design System', 'Papan acuan sistem desain yang memuat variasi warna primer (#6366f1, #00b6d4, #f59e0b) dan elemen tipografi Aa.')}
              className="bg-[#1e222d] rounded-2xl border border-slate-700/80 p-4 shadow-xl hover:border-cyan-500/80 transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60 mb-3">
                <LayoutGrid className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Kinetic Academy Tokens</span>
              </div>
              <div className="space-y-3 bg-[#15171e] p-3 rounded-xl border border-slate-800">
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-indigo-600 h-10 rounded-lg p-1 text-[9px] font-bold text-white">Primary</div>
                  <div className="bg-cyan-500 h-10 rounded-lg p-1 text-[9px] font-bold text-slate-950">Secondary</div>
                  <div className="bg-amber-500 h-10 rounded-lg p-1 text-[9px] font-bold text-slate-950">Tertiary</div>
                </div>
                <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg">
                  <span className="text-2xl font-bold font-serif text-white">Aa</span>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">HeadLine & Body</p>
                    <p className="text-[10px] font-bold text-cyan-400">Inter & Playfair</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold">Primary</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">Inverted</span>
                  <span className="px-2 py-0.5 border border-slate-600 text-slate-300 rounded text-[10px]">Outlined</span>
                </div>
              </div>
            </div>

            {/* ARTBOARD 2: Maxy Warriors Mobile App - Main Dashboard */}
            <div 
              onClick={() => explainFeature('Artboard: Maxy Warriors Mobile Dashboard', 'Mobile Screen', 'Tampilan layar utama aplikasi presisi Maxy Academy dengan status Offline, tombol Check In, acara mendatang, dan berita.')}
              className="bg-[#1e222d] rounded-2xl border border-slate-700/80 p-4 shadow-xl hover:border-cyan-500/80 transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60 mb-3">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Maxy Warriors Attendance</span>
              </div>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[10px]">M</div>
                    <span className="font-bold text-slate-200 text-[11px]">Maxy Warriors</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded font-bold">Offline</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400">Selamat datang kembali,</p>
                  <p className="font-extrabold text-sm text-white">Alex Mercer</p>
                </div>
                <div className="bg-indigo-950/60 border border-indigo-800/60 rounded-xl p-2.5 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300">Attendance Status:</span>
                    <span className="text-amber-400 font-bold">Checked Out</span>
                  </div>
                  <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-center text-xs shadow-md">
                    ➜ Check In Now
                  </button>
                </div>
                <div className="flex justify-around pt-1 border-t border-slate-800 text-[9px] text-slate-400">
                  <span className="text-cyan-400 font-bold">Dashboard</span>
                  <span>Attendance</span>
                  <span>Events</span>
                  <span>Profile</span>
                </div>
              </div>
            </div>

            {/* ARTBOARD 3: Kinetic Academy Gold Variant */}
            <div 
              onClick={() => explainFeature('Artboard: Kinetic Academy Gold Theme (#ffb034)', 'Design Theme', 'Variansi sistem warna Amber Gold yang diminta pengguna untuk branding tim Maxy Warriors.')}
              className="bg-[#1e222d] rounded-2xl border border-slate-700/80 p-4 shadow-xl hover:border-amber-500/80 transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60 mb-3">
                <Palette className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">Kinetic Gold Variant</span>
              </div>
              <div className="space-y-3 bg-[#15171e] p-3 rounded-xl border border-slate-800">
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-[#ffb034] h-10 rounded-lg p-1 text-[9px] font-bold text-slate-950">Primary Gold</div>
                  <div className="bg-slate-800 h-10 rounded-lg p-1 text-[9px] font-bold text-white">Dark Neutral</div>
                  <div className="bg-cyan-600 h-10 rounded-lg p-1 text-[9px] font-bold text-white">Cyan Accent</div>
                </div>
                <div className="flex items-center justify-between bg-amber-950/30 border border-amber-800/40 p-2 rounded-lg">
                  <span className="text-2xl font-bold font-serif text-amber-400">Aa</span>
                  <div className="text-right">
                    <p className="text-[10px] text-amber-200/80">Warriors Theme</p>
                    <p className="text-[10px] font-bold text-amber-400">#ffb034 Palette</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ARTBOARD 4: Attendance Map Screen */}
            <div 
              onClick={() => explainFeature('Artboard: Attendance Map & Geo-fence', 'Mobile Screen', 'Layar presisi dengan fitur Peta Geo-fence "Home Office (Geo-fence active)" dan pencatatan jam harian.')}
              className="bg-[#1e222d] rounded-2xl border border-slate-700/80 p-4 shadow-xl hover:border-cyan-500/80 transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60 mb-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Attendance Map View</span>
              </div>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-slate-100">Daily Attendance</p>
                <p className="text-[10px] text-slate-400">Track your physical presence & daily hours.</p>
                <div className="grid grid-cols-2 gap-1.5 my-1">
                  <button className="py-1 bg-emerald-600 text-white rounded font-bold text-[10px]">➜ Check In</button>
                  <button className="py-1 bg-slate-800 text-slate-300 rounded text-[10px]">Check Out</button>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="font-bold text-[10px] text-slate-200">Home Office (Geo-fence active)</p>
                    <p className="text-[9px] text-slate-400">Northwood Kinetic Hub</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ARTBOARD 5: Warrior Profile View */}
            <div 
              onClick={() => explainFeature('Artboard: Warrior Profile', 'Mobile Screen', 'Halaman profil terpusat rincian staf Alex Mercer (MENTOR), ID Karyawan MAXY-8842-WAR, dan preferensi kerja.')}
              className="bg-[#1e222d] rounded-2xl border border-slate-700/80 p-4 shadow-xl hover:border-cyan-500/80 transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60 mb-3">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Warrior Profile</span>
              </div>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs text-center">
                <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">AM</div>
                <div>
                  <p className="font-bold text-white text-xs">Alex Mercer</p>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">MENTOR</p>
                </div>
                <div className="text-left text-[10px] bg-slate-900 p-2 rounded-lg space-y-1 text-slate-300">
                  <p><span className="text-slate-500">EMAIL:</span> alex.mercer@maxyacademy.edu</p>
                  <p><span className="text-slate-500">EMPLOYEE ID:</span> MAXY-8842-WAR</p>
                  <p><span className="text-slate-500">JOIN DATE:</span> October 12, 2021</p>
                </div>
              </div>
            </div>

            {/* ARTBOARD 6: Warrior Login Screen */}
            <div 
              onClick={() => explainFeature('Artboard: Warrior Login Screen', 'Mobile Screen', 'Layar otentikasi login masuk yang aman untuk staf, mentor, dan peserta magang Maxy Academy.')}
              className="bg-[#1e222d] rounded-2xl border border-slate-700/80 p-4 shadow-xl hover:border-cyan-500/80 transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60 mb-3">
                <Lock className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Warrior Authentication</span>
              </div>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs text-center">
                <span className="font-extrabold text-amber-400 text-xs tracking-widest uppercase">MAXY WARRIORS</span>
                <p className="text-[10px] text-slate-300 font-bold">Welcome Back, Staff</p>
                <div className="space-y-1.5 text-left text-[10px]">
                  <div className="p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-400">staff@maxyacademy.com</div>
                  <div className="p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-400">••••••••</div>
                </div>
                <button className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded text-xs shadow-md">
                  Sign In
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Right Canvas Toolbar (Tools for Pointer, Frame, Edit, Hand, Image, Palette, Star) */}
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 bg-[#1a1d24]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl">
          {[
            { id: 'pointer', icon: MousePointer, title: 'Select / Pointer Tool', desc: 'Pilih, geser, atau ubah ukuran elemen artboard di kanvas Stitch.' },
            { id: 'frame', icon: Frame, title: 'Frame / Artboard Tool', desc: 'Tambah bingkai/artboard layar baru (Desktop, Tablet, Mobile).' },
            { id: 'pen', icon: PenTool, title: 'Edit / Pen Tool', desc: 'Gambar vektor, jalur koneksi alur kerja, atau catatan manual.' },
            { id: 'hand', icon: Hand, title: 'Hand / Pan Tool', desc: 'Geser pandangan kanvas tanpa mengubah posisi elemen.' },
            { id: 'image', icon: ImageIcon, title: 'Media / Asset Tool', desc: 'Pilih dan letakkan aset gambar di kanvas.' },
            { id: 'palette', icon: Palette, title: 'Style Theme Palette', desc: 'Pilih skema warna global untuk seluruh prototipe.' },
            { id: 'star', icon: Star, title: 'Highlight / Star Tool', desc: 'Tandai bagian artboard penting untuk tim kolaborasi.' },
          ].map((tool) => {
            const IconComp = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  explainFeature(tool.title, 'Canvas Toolbar', tool.desc);
                }}
                className={`p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={tool.title}
              >
                <IconComp className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Bottom Right Canvas Navigation Controls (Undo, Redo, Zoom, Help) */}
        <div className="absolute right-3 sm:right-4 bottom-24 z-20 flex items-center gap-1.5 bg-[#1a1d24]/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-2 py-1 shadow-xl text-xs">
          <button 
            onClick={() => explainFeature('Undo Action (↶)', 'Canvas History', 'Membatalkan perubahan terakhir pada kanvas Stitch.')}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => explainFeature('Redo Action (↷)', 'Canvas History', 'Mengembalikan perubahan yang telah dibatalkan.')}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => {
              const newZoom = zoomLevel === 24 ? 50 : zoomLevel === 50 ? 100 : 24;
              setZoomLevel(newZoom);
              explainFeature(`Zoom Level (${newZoom}%)`, 'Canvas Zoom', `Mengubah skala tampilan kanvas Stitch menjadi ${newZoom}%.`);
            }}
            className="px-2 py-0.5 font-bold text-slate-300 hover:text-cyan-400"
          >
            {zoomLevel}%
          </button>
          <button 
            onClick={() => explainFeature('Help & Keyboard Shortcuts (?)', 'Documentation', 'Melihat panduan tombol pintas keyboard dan dokumentasi Google Stitch.')}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Suggestion Pills Floating Above Prompt Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-20 z-20 flex flex-wrap justify-center gap-2 max-w-xl px-2">
          <button
            onClick={() => {
              setPromptInput('Add an attendance history log to the attendance screen with filter dates...');
              explainFeature('Suggestion Pill 1', 'Quick Prompt', 'Menyisipkan perintah cepat untuk menambahkan log riwayat presisi.');
            }}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/80 rounded-full px-3 py-1 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all"
          >
            <span>Add an attendance history log to the...</span>
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400 flex items-center justify-center">1</span>
          </button>

          <button
            onClick={() => {
              setPromptInput('Create a detailed view for a single warrior profile with stats...');
              explainFeature('Suggestion Pill 2', 'Quick Prompt', 'Menyisipkan perintah cepat untuk membuat rincian detail profil anggota.');
            }}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/80 rounded-full px-3 py-1 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all"
          >
            <span>Create a detailed view for a single n...</span>
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400 flex items-center justify-center">2</span>
          </button>
        </div>

      </div>

      {/* Bottom Interactive Prompt & Action Bar */}
      <div className="relative border-t border-slate-800/80 bg-[#16181e]/95 backdrop-blur-md p-3 sm:p-4 z-30">
        <form onSubmit={handlePromptSubmit} className="max-w-4xl mx-auto space-y-2">
          
          <div className="bg-[#1e212b] border border-slate-700/80 focus-within:border-cyan-500/80 rounded-2xl p-2 sm:p-3 shadow-xl transition-all">
            
            {/* Input Text Area */}
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="What would you like to change or create?"
              className="w-full bg-transparent border-none text-slate-100 placeholder-slate-400 focus:outline-none text-sm px-2 py-1"
            />

            {/* Prompt Action Toolbar Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 mt-2">
              
              <div className="flex items-center gap-1.5 sm:gap-2 relative">
                
                {/* Plus (+) Button with Popup Menu (Upload Files, Website URL, Variations) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlusMenuOpen(!isPlusMenuOpen);
                      setIsSlashMenuOpen(false);
                      explainFeature('Plus Action Menu (+)', 'Context Menu', 'Membuka pilihan untuk Upload Files, Website URL, dan Variations.');
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isPlusMenuOpen ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="Plus Action Menu (+)"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Plus Menu Modal Dropdown (Matching Screenshot 3) */}
                  <AnimatePresence>
                    {isPlusMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 bottom-12 w-56 bg-[#232733] border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlusMenuOpen(false);
                            explainFeature('Upload Files (Plus Menu)', 'Plus Action', 'Mengunggah file gambar, dokumen wireframe, atau aset desain lokal ke kanvas Stitch.');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl flex items-center gap-2 text-slate-200 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold">Upload Files</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsPlusMenuOpen(false);
                            explainFeature('Website URL (Plus Menu)', 'Plus Action', 'Memasukkan tautan URL situs web luar untuk diimprovisasi oleh agen Stitch.');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl flex items-center gap-2 text-slate-200 transition-colors"
                        >
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold">Website URL</span>
                        </button>

                        <div className="border-t border-slate-700/60 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setIsPlusMenuOpen(false);
                            explainFeature('Variations (Plus Menu)', 'Plus Action', 'Menghasilkan beberapa variasi opsi tata letak UI sekaligus dari instruksi yang ada.');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl flex items-center gap-2 text-slate-200 transition-colors"
                        >
                          <Layers className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold">Variations</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Slash (/) Button with Popup Menu (Image, Logo, Diagram, Animate, App Store, Web Assets, Marketing, Accessibility) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlashMenuOpen(!isSlashMenuOpen);
                      setIsPlusMenuOpen(false);
                      explainFeature('Slash Command Menu (/)', 'Context Menu', 'Membuka menu pintasan cepat untuk Image, Logo, Diagram, Animate, App Store Assets, Web Assets, Marketing Kit, dan Accessibility Audit.');
                    }}
                    className={`px-3 py-1.5 rounded-full font-serif font-extrabold text-sm flex items-center justify-center transition-all ${
                      isSlashMenuOpen ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="Slash Commands (/)"
                  >
                    /
                  </button>

                  {/* Slash Menu Modal Dropdown (Matching Screenshot 2) */}
                  <AnimatePresence>
                    {isSlashMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 bottom-12 w-64 bg-[#232733] border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 max-h-80 overflow-y-auto"
                      >
                        {[
                          { title: 'Image', icon: ImageIcon, color: 'text-cyan-400', desc: 'Menghasilkan ilustrasi atau foto realistis menggunakan model AI.' },
                          { title: 'Logo', icon: Zap, color: 'text-amber-400', desc: 'Membuat logo vektor & ikon merek Maxy Academy.' },
                          { title: 'Diagram', icon: BarChart2, color: 'text-emerald-400', desc: 'Menyusun alur pengguna (user flow) atau diagram arsitektur.' },
                          { title: 'Animate', icon: Film, color: 'text-purple-400', desc: 'Menambahkan efek transisi motion UI pada prototipe.' },
                          { title: 'App Store Assets', icon: SmartphoneCharging, color: 'text-rose-400', desc: 'Membuat tangkapan layar promosi & banner toko aplikasi.' },
                          { title: 'Web Assets', icon: Globe, color: 'text-cyan-300', desc: 'Menyiapkan aset banner hero, favicon, dan footer web.' },
                          { title: 'Marketing Kit', icon: Megaphone, color: 'text-orange-400', desc: 'Menghasilkan materi pemasaran medsos & poster peluncuran.' },
                          { title: 'Accessibility Audit', icon: Eye, color: 'text-indigo-400', desc: 'Menganalisis kontras warna WCAG AA dan kemudahan aksesibel.' },
                        ].map((item) => {
                          const IconComp = item.icon;
                          return (
                            <button
                              key={item.title}
                              type="button"
                              onClick={() => {
                                setIsSlashMenuOpen(false);
                                setPromptInput(`/${item.title.toLowerCase().replace(/ /g, '_')} `);
                                explainFeature(`${item.title} (Slash Command)`, 'Slash Action', item.desc);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 transition-colors"
                            >
                              <IconComp className={`w-4 h-4 ${item.color}`} />
                              <span className="font-semibold">{item.title}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Theme Color Dropdown (#ffb034) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsThemeDropdownOpen(!isThemeDropdownOpen);
                      explainFeature('Theme Color Selector', 'Style Settings', 'Memilih aksen warna dasar untuk generasi UI Stitch (Amber Gold, Cyan, Indigo, Emerald).');
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-200"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#ffb034]" />
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isThemeDropdownOpen && (
                    <div className="absolute left-0 bottom-10 w-44 bg-[#232733] border border-slate-700 rounded-xl p-2 shadow-xl z-50 text-xs space-y-1">
                      {['Amber (#ffb034)', 'Cyan (#06b6d4)', 'Indigo (#6366f1)', 'Emerald (#10b981)'].map((theme) => (
                        <button
                          key={theme}
                          type="button"
                          onClick={() => {
                            setSelectedTheme(theme);
                            setIsThemeDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-slate-800 rounded text-slate-200 flex items-center gap-2"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            theme.includes('ffb034') ? 'bg-[#ffb034]' :
                            theme.includes('06b6d4') ? 'bg-cyan-500' :
                            theme.includes('6366f1') ? 'bg-indigo-500' : 'bg-emerald-500'
                          }`} />
                          <span>{theme}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Model Selector (3 Flash) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModelDropdownOpen(!isModelDropdownOpen);
                      explainFeature('Model Selector (3 Flash)', 'AI Core Engine', 'Memilih model Gemini 3 Flash / 3 Pro yang digunakan untuk rendering kecepatan tinggi.');
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs font-bold text-cyan-300"
                  >
                    <span>{selectedModel}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isModelDropdownOpen && (
                    <div className="absolute left-0 bottom-10 w-40 bg-[#232733] border border-slate-700 rounded-xl p-2 shadow-xl z-50 text-xs space-y-1">
                      {['3 Flash', '3 Pro', '2.5 Flash'].map((model) => (
                        <button
                          key={model}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model);
                            setIsModelDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-slate-800 rounded text-slate-200 font-medium"
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Sparkles / Submit Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPromptInput('Optimize and improve Maxy Warriors Attendance UI structure with responsive auto-layout...');
                    explainFeature('Sparkles Prompt Optimizer', 'AI Assistant', 'Meningkatkan kualitas instruksi teks secara otomatis menggunakan kecerdasan buatan.');
                  }}
                  className="p-2 hover:bg-slate-800 text-amber-400 rounded-xl transition-colors"
                  title="Improve Prompt with AI"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={isSimulatingGenerate}
                  className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-lg shadow-cyan-600/30 disabled:opacity-50"
                  title="Send Instruction"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </form>
      </div>

      {/* Feature Explanation Modal Popup */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#1d212c] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 text-[10px] font-bold rounded-full border border-cyan-500/30 uppercase tracking-wider">
                  {activeModal.category}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  {activeModal.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {activeModal.description}
                </p>
              </div>

              {activeModal.parameters && activeModal.parameters.length > 0 && (
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <p className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Parameter & Spesifikasi Teknis:</span>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {activeModal.parameters.map((param, idx) => (
                      <li key={idx}>{param}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeModal.usageGuide && activeModal.usageGuide.length > 0 && (
                <div className="bg-cyan-950/40 p-3 rounded-2xl border border-cyan-800/50 space-y-1.5 text-xs text-slate-300">
                  <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cara Menggunakan (Panduan Langkah demi Langkah):</span>
                  </p>
                  <div className="space-y-1 text-[11px] text-cyan-100/90 font-medium">
                    {activeModal.usageGuide.map((step, idx) => (
                      <p key={idx} className="leading-relaxed">{step}</p>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl text-xs transition-all shadow-lg"
              >
                Mengerti & Lanjutkan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Play Preview Full Screen Modal */}
      <AnimatePresence>
        {previewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]"
            >
              <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Maxy Warriors Live Preview</span>
                </div>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 bg-slate-950 overflow-y-auto space-y-4 text-xs">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-400">MAXY ACADEMY</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-bold">ONLINE</span>
                  </div>
                  <p className="text-sm font-extrabold text-white">Halo, Alex Mercer!</p>
                  <p className="text-slate-400 text-[10px]">Lokasi: Main Campus (HQ)</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-700/50 rounded-2xl space-y-3">
                  <p className="font-bold text-white">Status Presisi Hari Ini</p>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-[10px]">
                    <span className="text-slate-300">Jam Masuk:</span>
                    <span className="text-cyan-400 font-bold">08:30 WIB</span>
                  </div>
                  <button 
                    onClick={() => alert('Presisi Berhasil Dicatat!')}
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-center shadow-lg"
                  >
                    ➜ Absen Masuk Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
