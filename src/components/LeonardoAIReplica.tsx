import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Image as ImageIcon, Video, Volume2, Box, GitBranch, LayoutGrid, Maximize2,
  Settings, Zap, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Search, Plus, 
  HelpCircle, User, Crown, ArrowLeft, Sliders, Wand2, Download, Copy, Share2, Eye, 
  Shield, RefreshCw, X, Play, Compass, MessageSquare, Menu, ThumbsUp, ThumbsDown, 
  SlidersHorizontal, Layers, Lock, ArrowUp, MoreHorizontal, Upload, Info, Check, 
  Sliders as SlidersIcon, ExternalLink, Dices, Edit, FileText, Laptop, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeatureDetailModal {
  title: string;
  category: string;
  description: string;
  parameters?: string[];
  usageGuide?: string[];
}

export const LeonardoAIReplica: React.FC = () => {
  // Device view mode: 'desktop' | 'mobile' (Auto-detected via window width)
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

  // Navigation and view states
  const [activeView, setActiveView] = useState<'home' | 'creation'>('home');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isPromptPopoverOpen, setIsPromptPopoverOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<FeatureDetailModal | null>(null);

  // Generation settings
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [selectedStyle, setSelectedStyle] = useState('Dynamic');
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const [generationCount, setGenerationCount] = useState<number>(1);
  const [privateMode, setPrivateMode] = useState<boolean>(true);
  const [tokenBalance, setTokenBalance] = useState<number>(150);
  const [activeTab, setActiveTab] = useState<'Image' | 'Video' | 'Audio' | '3D' | 'Flow State' | 'Blueprints'>('Image');
  const [communityFilter, setCommunityFilter] = useState('All');

  // Prompt state
  const [promptInput, setPromptInput] = useState(
    'A dynamically innovative CTO of Maxy Academy, surrounded by the majestic snowy peaks of a mountain range. The scene captures the CTO in action, brainstorming and planning against the backdrop of the pristine, snow-covered mountains. The image could be a digitally enhanced photograph. The CTO\'s focused expression is framed by the vast, serene landscape, emphasizing the power and determination in their eyes. The colors are vivid and crisp, showcasing the intricate details of the snow-capped mountains. Overall, the image conveys a sense of awe-inspiring beauty and professional prowess.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [thumbsFeedback, setThumbsFeedback] = useState<'up' | 'down' | null>(null);

  // Helper to open explanation modal
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

  // Handle generation execution
  const handleGenerate = () => {
    if (!promptInput.trim()) return;
    if (tokenBalance < 12) {
      explainFeature(
        'Token Leonardo.Ai Habis',
        'System Notice',
        'Token harian Anda kurang dari 12 token. Silakan upgrade ke plan Pro Maxy Academy atau tunggu reset token harian besok.'
      );
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setTokenBalance(prev => Math.max(0, prev - 12));
      setActiveView('creation');

      explainFeature(
        'Generasi Leonardo.Ai Berhasil!',
        'AI Creation Engine',
        `Gambar generasi AI baru berhasil dibuat menggunakan model ${selectedModel} dengan gaya ${selectedStyle} (Rasio Aspect ${selectedAspect}). 12 Token telah dikurangi dari saldo Anda.`,
        [
          `Model Aktif: ${selectedModel}`,
          `Style Preset: ${selectedStyle}`,
          `Resolusi / Rasio: ${selectedAspect} (1024×1024)`,
          `Private Mode: ${privateMode ? 'Aktif (Hanya Anda)' : 'Publik'}`
        ],
        [
          '1. Salin perintah atau gunakan tombol Iterate untuk membuat variasi baru.',
          '2. Klik opsi Thumbs Up / Down untuk memberikan masukan kualitas.',
          '3. Gunakan tombol download untuk menyimpan hasil gambar dalam format 8K resolusi tinggi.'
        ]
      );
    }, 1500);
  };

  // Preset Blueprints Data matching Screenshots 1 & 4
  const featuredBlueprints = [
    {
      id: 'anime',
      title: 'Anime Portrait',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80',
      tag: 'Anime'
    },
    {
      id: '3d-ref',
      title: '3D Reference View Creator',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
      tag: '3D & Assets'
    },
    {
      id: 'product',
      title: 'Product Unboxing',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      tag: 'E-Commerce'
    },
    {
      id: 'motion',
      title: 'Motion Product Showcase',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80',
      tag: 'Video'
    },
    {
      id: 'runner',
      title: 'Runner Route Hologram',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80',
      tag: 'Sci-Fi'
    },
    {
      id: 'storyboard',
      title: 'Storyboard Sheet',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80',
      tag: 'Concept Art'
    },
    {
      id: 'cinematic',
      title: 'Cinematic Scenario Product Film',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
      tag: 'Film'
    }
  ];

  return (
    <div className="relative w-full rounded-2xl border border-[#232733] bg-[#0e0f12] text-slate-100 overflow-hidden shadow-2xl flex flex-col min-h-[720px] font-sans selection:bg-purple-600 selection:text-white">

      {/* Simulator Device View Mode Switcher Header Bar */}
      <div className="bg-[#07080a] border-b border-[#232733] px-3 sm:px-4 py-2 flex items-center justify-between z-40 shrink-0 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-slate-200">Mode Tampilan Leonardo AI Simulator:</span>
        </div>
        <div className="flex items-center bg-[#13151c] border border-[#232733] rounded-lg p-1 gap-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              deviceMode === 'desktop' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              deviceMode === 'mobile' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View</span>
          </button>
        </div>
      </div>

      {/* ==================== DESKTOP NAVIGATION SIDEBAR & CONTENT LAYOUT ==================== */}
      <div className="flex-1 flex overflow-hidden">

        {/* 1. DESKTOP LEFT PERMANENT SIDEBAR (Matches Screenshot 1 & 2) */}
        {deviceMode === 'desktop' && (
          <aside className="w-16 bg-[#13151c] border-r border-[#232733] flex flex-col items-center py-3 justify-between shrink-0 z-30">
            {/* Top Logo & Primary Nav Items */}
            <div className="flex flex-col items-center gap-4 w-full">
              {/* Leonardo Logo Icon */}
              <div 
                onClick={() => {
                  setActiveView('home');
                  explainFeature(
                    'Leonardo.Ai Logo & Home Feed',
                    'Main Navigation',
                    'Klik untuk kembali ke halaman utama (Home Feed), melihat Featured Blueprints, dan galeri kreasi komunitas.'
                  );
                }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform"
                title="Leonardo.Ai Home"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              <div className="w-8 h-[1px] bg-[#232733] my-1" />

              {/* Sidebar Buttons */}
              <button 
                onClick={() => {
                  setActiveView('home');
                  explainFeature('Home Menu', 'Navigation', 'Menampilkan dashboard utama Leonardo.Ai, rekomendasi blueprint terbaru, dan galeri karya komunitas.');
                }}
                className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-0.5 ${
                  activeView === 'home' ? 'bg-[#1e2230] text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-white hover:bg-[#181a24]'
                }`}
                title="Home"
              >
                <Compass className="w-5 h-5" />
                <span className="text-[9px] font-medium">Home</span>
              </button>

              <button 
                onClick={() => explainFeature('Personal Library', 'Asset Management', 'Tempat menyimpan seluruh koleksi gambar, model fine-tuned, dan aset 3D yang pernah Anda hasilkan di Maxy Academy.')}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#181a24] transition-all flex flex-col items-center gap-0.5"
                title="Library"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="text-[9px] font-medium">Library</span>
              </button>

              <button 
                onClick={() => {
                  setActiveView('creation');
                  explainFeature('Image Generation Tool', 'AI Tools', 'Menu utama pembuatan gambar AI. Atur prompt, model fine-tuned, aspect ratio, dan jalankan pemicu generasi gambar.');
                }}
                className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-0.5 ${
                  activeView === 'creation' ? 'bg-[#1e2230] text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-white hover:bg-[#181a24]'
                }`}
                title="Image Generation"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-[9px] font-medium">Image</span>
              </button>

              <button 
                onClick={() => explainFeature('Motion Video Generation', 'AI Tools', 'Fitur pembuat video AI pendek berdurasi 4-8 detik dari teks atau animasi dari gambar statis.')}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#181a24] transition-all flex flex-col items-center gap-0.5"
                title="Video Generator"
              >
                <Video className="w-5 h-5" />
                <span className="text-[9px] font-medium">Video</span>
              </button>

              <button 
                onClick={() => explainFeature('Audio & Sound FX Generator (New)', 'AI Tools', 'Fitur terbaru untuk menghasilkan efek suara, latar audio ambient, dan musik latar menggunakan AI.')}
                className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#181a24] transition-all flex flex-col items-center gap-0.5"
                title="Audio Generator"
              >
                <Volume2 className="w-5 h-5" />
                <span className="text-[9px] font-medium">Audio</span>
                <span className="absolute top-1 right-1 bg-purple-600 text-[8px] font-extrabold px-1 rounded text-white">NEW</span>
              </button>

              <button 
                onClick={() => explainFeature('3D Texture & Asset Generator', 'AI Tools', 'Menghasilkan tekstur UV map dan aset model 3D realistis siap pakai untuk game engine seperti Unreal & Unity.')}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#181a24] transition-all flex flex-col items-center gap-0.5"
                title="3D Generator"
              >
                <Box className="w-5 h-5" />
                <span className="text-[9px] font-medium">3D</span>
              </button>

              <button 
                onClick={() => explainFeature('Flow State Workflow Builder', 'AI Tools', 'Kanvas pemrosesan node-based untuk menggabungkan prompt, inpainting, upscaling, dan kontrol pose secara visual.')}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#181a24] transition-all flex flex-col items-center gap-0.5"
                title="Flow State"
              >
                <GitBranch className="w-5 h-5" />
                <span className="text-[9px] font-medium">Flow</span>
              </button>

              <button 
                onClick={() => explainFeature('Blueprints Gallery', 'AI Tools', 'Kumpulan template panduan gaya visual siap pakai untuk fotografi produk, gaya komik, dan karakter 3D.')}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#181a24] transition-all flex flex-col items-center gap-0.5"
                title="Blueprints"
              >
                <Layers className="w-5 h-5" />
                <span className="text-[9px] font-medium">Blueprints</span>
              </button>

              <button 
                onClick={() => explainFeature('Universal AI Upscaler', 'AI Tools', 'Meningkatkan kejernihan dan detail gambar hingga resolusi 8K tanpa kehilangan ketajaman.')}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#181a24] transition-all flex flex-col items-center gap-0.5"
                title="Upscaler"
              >
                <Maximize2 className="w-5 h-5" />
                <span className="text-[9px] font-medium">Upscaler</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center gap-3 w-full">
              <button 
                onClick={() => explainFeature('More Menu (...)', 'Navigation', 'Pilihan alat tambahan seperti Realtime Canvas, Canvas Editor, dan pelatihan model custom (Train Fine-Tuned Model).')}
                className="p-2 text-slate-400 hover:text-white hover:bg-[#181a24] rounded-xl"
                title="More Options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              <button 
                onClick={() => explainFeature('Settings', 'User Account', 'Pengaturan antarmuka, preferensi bahasa, notifikasi, serta manajemen API key Leonardo.Ai.')}
                className="p-2 text-slate-400 hover:text-white hover:bg-[#181a24] rounded-xl"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Token Counter Pill */}
              <button 
                onClick={() => explainFeature('Token Harian & Status Kredit', 'Subscription', `Saldo Token Anda saat ini: ${tokenBalance} Token. Direset setiap 24 jam sekali untuk akun gratis Maxy Academy.`)}
                className="p-1.5 bg-[#181a24] border border-[#232733] hover:border-emerald-500/50 rounded-xl flex flex-col items-center gap-0.5 cursor-pointer"
                title="Token Balance"
              >
                <div className="flex items-center gap-1 text-[#00e699] text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 fill-[#00e699]" />
                  <span>{tokenBalance}</span>
                </div>
                <span className="px-1 py-0.2 bg-[#00e699] text-slate-950 font-extrabold text-[8px] rounded">UPGRADE</span>
              </button>

              {/* User Avatar */}
              <div 
                onClick={() => explainFeature('Profil Pengguna VizSmartWeb3348', 'User Profile', 'Akun pengguna terhubung: maxyacademy.one@gmail.com dengan paket Free Tier Aktivasi.')}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center cursor-pointer border border-purple-400/40 shadow"
                title="Profile Account"
              >
                V
              </div>
            </div>
          </aside>
        )}

        {/* 2. MAIN WORKSPACE CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0e0f12] overflow-y-auto">

          {/* ==================== MOBILE TOP BAR (Matches Screenshot 4 & 6) ==================== */}
          {deviceMode === 'mobile' && (
            <div className="h-14 border-b border-[#232733] bg-[#13151c] px-4 flex items-center justify-between shrink-0 z-30 sticky top-0">
              {activeView === 'home' ? (
                <>
                  <div 
                    onClick={() => explainFeature('LEONARDO.AI Logo Mobile', 'Brand', 'Halaman utama Leonardo.Ai versi seluler.')}
                    className="font-black text-lg text-white tracking-wider cursor-pointer"
                  >
                    LEONARDO.AI
                  </div>
                  <button 
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="p-2 bg-[#1b1e29] border border-[#232733] rounded-xl text-slate-200 hover:text-white"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setActiveView('home')}
                      className="p-1.5 bg-[#1b1e29] border border-[#232733] rounded-lg text-slate-300"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-white text-sm">LEO</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => explainFeature('Tipe Generasi Mobile', 'Creation', 'Pilihan mode generasi aktif (Gambar / Video).')}
                      className="px-2.5 py-1 bg-[#1b1e29] border border-[#232733] text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                      <span>Image</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    <button 
                      onClick={() => explainFeature('Token Status Mobile', 'Credits', `Token harian: ${tokenBalance}`)}
                      className="px-2.5 py-1 bg-[#181a24] border border-emerald-500/40 rounded-full text-xs font-bold text-[#00e699] flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 fill-[#00e699]" />
                      <span>{tokenBalance}</span>
                    </button>

                    <button 
                      onClick={() => explainFeature('Progress Memulai (0/6)', 'Onboarding', 'Selesaikan 6 langkah pengenalan fitur untuk mendapatkan bonus 50 Token ekstra!')}
                      className="px-2 py-1 bg-[#1e2230] text-[10px] font-bold text-slate-300 rounded-lg border border-[#232733]"
                    >
                      Get Started 0/6
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==================== VIEW 1: HOME FEED (Matches Screenshot 1 & 4) ==================== */}
          {activeView === 'home' && (
            <div className="flex-1 space-y-6 pb-12">

              {/* Hero Banner Section */}
              <div className="relative w-full h-[280px] sm:h-[340px] bg-gradient-to-b from-purple-900/40 via-indigo-950/30 to-[#0e0f12] flex flex-col items-center justify-center text-center p-4 overflow-hidden border-b border-[#232733]">
                {/* Background Ambient Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80')` }}
                />

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase drop-shadow-lg z-10">
                  YOURS TO CREATE
                </h1>

                {/* Prompt Bar (Matches Screenshot 1 & 4) */}
                <div className="w-full max-w-2xl mt-6 z-10 px-2">
                  <div className="bg-[#141720]/90 backdrop-blur-md border border-purple-500/30 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center gap-2">
                    <button 
                      onClick={() => explainFeature('Tambahkan Gambar Referensi (Image Prompt)', 'Prompt Input', 'Mengunggah gambar acuan untuk mengarahkan komposisi, pose, atau gaya visual AI.')}
                      className="p-2 bg-[#1c202d] hover:bg-[#252a3b] rounded-xl text-slate-400 hover:text-white transition-colors shrink-0"
                      title="Upload Image Reference"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    <input 
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Type a prompt..."
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none px-2"
                    />

                    {/* AI Prompt Sparkles Assistant Button */}
                    <button 
                      onClick={() => {
                        setIsPromptPopoverOpen(!isPromptPopoverOpen);
                        explainFeature('Peningkat Prompt AI (Sparkles)', 'AI Assistant', 'Membuka menu bantuan pembuatan prompt otomatis dengan AI (Random Prompt, Improve Prompt, Edit with AI, Describe Image).');
                      }}
                      className="p-2 bg-[#1c202d] hover:bg-purple-950 border border-purple-500/40 rounded-xl text-purple-300 transition-colors shrink-0"
                      title="AI Prompt Assistant"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </button>

                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-[#1e1a38] hover:bg-[#28224d] text-slate-300 hover:text-white font-bold rounded-xl text-xs border border-purple-500/40 transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
                    </button>
                  </div>

                  {/* AI Prompt Helper Popover (Screenshot 3) */}
                  <AnimatePresence>
                    {isPromptPopoverOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-4 sm:right-auto mt-2 w-72 bg-[#161922] border border-[#2b3042] rounded-2xl p-2 shadow-2xl z-50 text-left space-y-1"
                      >
                        <button 
                          onClick={() => {
                            setPromptInput('A futuristic warrior mentor at Maxy Academy surrounded by cybernetic neon holograms and 8k architectural landscape...');
                            setIsPromptPopoverOpen(false);
                            explainFeature('New Random Prompt AI', 'AI Prompt', 'Menghasilkan ide prompt acak bertema cyberpunk futuristik karya Maxy Academy.');
                          }}
                          className="w-full p-2.5 hover:bg-[#202533] rounded-xl flex items-start gap-3 text-left transition-colors"
                        >
                          <Dices className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">New Random Prompt</p>
                            <p className="text-[10px] text-slate-400">Generate a random prompt with AI.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setPromptInput(prev => prev + ', cinematic lighting, ultra-detailed 8k resolution, photorealistic masterpiece');
                            setIsPromptPopoverOpen(false);
                            explainFeature('Improve Prompt AI', 'AI Prompt', 'Memperkaya kata kunci prompt Anda dengan parameter pencahayaan dan detail kamera tingkat lanjut.');
                          }}
                          className="w-full p-2.5 hover:bg-[#202533] rounded-xl flex items-start gap-3 text-left transition-colors"
                        >
                          <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Improve Prompt</p>
                            <p className="text-[10px] text-slate-400">Improve your current prompt.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            explainFeature('Edit With AI', 'AI Prompt', 'Gunakan instruksi alami untuk mengubah bagian tertentu dari prompt Anda secara presisi.');
                            setIsPromptPopoverOpen(false);
                          }}
                          className="w-full p-2.5 hover:bg-[#202533] rounded-xl flex items-start gap-3 text-left transition-colors"
                        >
                          <Edit className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Edit With AI</p>
                            <p className="text-[10px] text-slate-400">Use AI to make quick changes to your prompt.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            explainFeature('Describe With AI', 'AI Prompt', 'Unggah gambar dari komputer Anda dan biarkan AI menganalisis serta menuliskan teks deskripsi rincinya.');
                            setIsPromptPopoverOpen(false);
                          }}
                          className="w-full p-2.5 hover:bg-[#202533] rounded-xl flex items-start gap-3 text-left transition-colors"
                        >
                          <FileText className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Describe With AI</p>
                            <p className="text-[10px] text-slate-400">Upload an image and generate its description.</p>
                          </div>
                        </button>

                        <div className="pt-1 border-t border-[#232733] text-center">
                          <span className="text-[10px] text-slate-400 font-bold bg-[#1e2230] px-3 py-1 rounded-full inline-block">
                            99 Prompts Available
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick Action Pills Row (Matches Screenshot 1 & 4) */}
                <div className="flex items-center justify-center gap-3 mt-6 flex-wrap z-10">
                  <button 
                    onClick={() => {
                      setActiveView('creation');
                      setActiveTab('Image');
                      explainFeature('Image Mode', 'AI Mode', 'Beralih ke mode utama pembuat gambar beresolusi tinggi.');
                    }}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#181b26] border border-[#232733] group-hover:border-purple-500 flex items-center justify-center text-slate-300 group-hover:text-purple-300 transition-all shadow-lg">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-300">Image</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveTab('Video');
                      explainFeature('Video Mode', 'AI Mode', 'Mode pembuat animasi video sinematik.');
                    }}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#181b26] border border-[#232733] group-hover:border-purple-500 flex items-center justify-center text-slate-300 group-hover:text-purple-300 transition-all shadow-lg">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-300">Video</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveTab('Audio');
                      explainFeature('Audio Mode (New)', 'AI Mode', 'Mode pembuat trek audio dan nada latar baru.');
                    }}
                    className="flex flex-col items-center gap-1 group relative"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#181b26] border border-[#232733] group-hover:border-purple-500 flex items-center justify-center text-slate-300 group-hover:text-purple-300 transition-all shadow-lg">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-300">Audio</span>
                    <span className="absolute -top-1 bg-[#161922] border border-[#232733] text-white text-[8px] font-bold px-1 rounded-full">New</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveTab('3D');
                      explainFeature('3D Mode', 'AI Mode', 'Mode pembuat tekstur dan mesh 3D.');
                    }}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#181b26] border border-[#232733] group-hover:border-purple-500 flex items-center justify-center text-slate-300 group-hover:text-purple-300 transition-all shadow-lg">
                      <Box className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-300">3D</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveTab('Blueprints');
                      explainFeature('Blueprints Mode', 'AI Mode', 'Pilih dari puluhan panduan gaya blueprint siap pakai.');
                    }}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#181b26] border border-[#232733] group-hover:border-purple-500 flex items-center justify-center text-slate-300 group-hover:text-purple-300 transition-all shadow-lg">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-300">Blueprints</span>
                  </button>
                </div>
              </div>

              {/* Featured Blueprints Horizontal Carousel (Matches Screenshot 1 & 4) */}
              <div className="px-4 sm:px-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white tracking-wide">Featured Blueprints</h2>
                  <button 
                    onClick={() => explainFeature('View All Blueprints', 'Gallery', 'Menampilkan seluruh koleksi 50+ preset blueprint terbaik untuk berbagai industri.')}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>View More</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800">
                  {featuredBlueprints.map((bp) => (
                    <div 
                      key={bp.id}
                      onClick={() => {
                        setSelectedModel(bp.title);
                        setActiveView('creation');
                        explainFeature(
                          `Blueprint: ${bp.title}`,
                          'Blueprint Selection',
                          `Anda memilih preset blueprint "${bp.title}". Model dan gaya generasi disesuaikan secara otomatis untuk hasil maksimal.`
                        );
                      }}
                      className="min-w-[220px] sm:min-w-[240px] h-[320px] rounded-2xl overflow-hidden relative group cursor-pointer border border-[#232733] hover:border-purple-500/60 transition-all shrink-0 shadow-lg"
                    >
                      <img src={bp.image} alt={bp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f12] via-transparent to-transparent p-4 flex flex-col justify-end">
                        <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded-full w-max mb-1">
                          {bp.tag}
                        </span>
                        <h3 className="text-sm font-extrabold text-white leading-tight">{bp.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Creations Section (Matches Screenshot 1) */}
              <div className="px-4 sm:px-8 space-y-4 pt-4 border-t border-[#1d202b]">
                <h2 className="text-lg font-bold text-white tracking-wide">Community Creations</h2>

                {/* Filter tags row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {['Trending', 'All', 'Photography', 'Animals', 'Anime', 'Architecture', 'Character', 'Food', 'Sci-Fi'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setCommunityFilter(tag);
                        explainFeature(`Filter Komunitas: ${tag}`, 'Community Feed', `Menampilkan karya terbaik kreasi pengguna dengan kategori ${tag}.`);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                        communityFilter === tag 
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                          : 'bg-[#181b26] text-slate-400 border-[#232733] hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Community Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[
                    { title: 'Anime Warrior Maxy', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
                    { title: '3D Cybernetic Headset', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
                    { title: 'Futuristic Runner', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80' },
                    { title: 'Snow Mountain CTO', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80' },
                  ].map((item, i) => (
                    <div 
                      key={i}
                      onClick={() => explainFeature(`Karya Komunitas: ${item.title}`, 'Gallery View', 'Melihat detail prompt, seed number, dan parameter fine-tuned yang digunakan untuk menghasilkan gambar ini.')}
                      className="relative rounded-2xl overflow-hidden border border-[#232733] group cursor-pointer aspect-square"
                    >
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-2.5 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[11px] font-bold text-white truncate">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== VIEW 2: AI CREATION PAGE (Matches Screenshot 2, 6, 7) ==================== */}
          {activeView === 'creation' && (
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

              {/* DESKTOP / MOBILE LEFT SETTINGS PANEL (Matches Screenshot 2 & 6) */}
              <div className="w-full lg:w-80 bg-[#13151c] border-b lg:border-b-0 lg:border-r border-[#232733] p-4 space-y-5 overflow-y-auto shrink-0">
                
                {/* Header Back Button on Desktop */}
                <div className="flex items-center justify-between pb-2 border-b border-[#232733]">
                  <button 
                    onClick={() => setActiveView('home')}
                    className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Feed</span>
                  </button>
                  <span className="text-[11px] font-bold text-purple-400">LEONARDO.AI</span>
                </div>

                {/* Model Selector Dropdown (Screenshot 2) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Model</span>
                    <HelpCircle 
                      onClick={() => explainFeature('Model AI Selection', 'Settings', 'Pilih model dasar AI untuk menentukan karakter rendering (Auto, Lucid Origin, Leonardo Phoenix, SDXL).')}
                      className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-300" 
                    />
                  </label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-[#1c202d] border border-[#2b3042] text-xs text-white rounded-xl p-2.5 focus:border-purple-500 outline-none font-medium"
                  >
                    <option value="Auto">Auto (Recommended)</option>
                    <option value="Lucid Origin">Lucid Origin</option>
                    <option value="Leonardo Phoenix">Leonardo Phoenix (Pro 8K)</option>
                    <option value="Leonardo Lightning XL">Leonardo Lightning XL</option>
                    <option value="Anime Portrait XL">Anime Portrait XL</option>
                  </select>
                </div>

                {/* Style Selector Dropdown (Screenshot 2) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Style</label>
                  <select 
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full bg-[#1c202d] border border-[#2b3042] text-xs text-white rounded-xl p-2.5 focus:border-purple-500 outline-none font-medium"
                  >
                    <option value="Dynamic">Dynamic</option>
                    <option value="Cinematic">Cinematic</option>
                    <option value="Creative">Creative</option>
                    <option value="Vibrant">Vibrant</option>
                    <option value="Ray Tracing">Ray Tracing</option>
                  </select>
                </div>

                {/* Image Dimensions & Aspect Ratios (Screenshot 2) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Image Dimensions</span>
                    <HelpCircle 
                      onClick={() => explainFeature('Image Dimensions', 'Settings', 'Pilih rasio aspek gambar: 2:3 untuk portrait, 1:1 untuk sosmed, 16:9 untuk banner desktop.')}
                      className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-300" 
                    />
                  </label>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { ratio: '2:3', label: '2:3' },
                      { ratio: '1:1', label: '1:1' },
                      { ratio: '16:9', label: '16:9' },
                      { ratio: 'Custom', label: 'Custom' }
                    ].map((item) => (
                      <button
                        key={item.ratio}
                        onClick={() => setSelectedAspect(item.ratio)}
                        className={`py-2 text-xs font-bold rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          selectedAspect === item.ratio 
                            ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-lg' 
                            : 'bg-[#1c202d] border-[#2b3042] text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1">
                    <span className="px-2.5 py-1 bg-[#1e2230] border border-[#232733] text-purple-300 font-extrabold text-[10px] rounded-lg inline-block">
                      1024×1024
                    </span>
                  </div>
                </div>

                {/* Number of Generations (Screenshot 2) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Number of generations</span>
                    <HelpCircle 
                      onClick={() => explainFeature('Jumlah Generasi', 'Settings', 'Tentukan berapa banyak variasi gambar yang diproduksi sekaligus (1, 2, 3, atau 4 gambar).')}
                      className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-300" 
                    />
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setGenerationCount(num)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                          generationCount === num 
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                            : 'bg-[#1c202d] border-[#2b3042] text-slate-400'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Private Mode Toggle (Screenshot 2) */}
                <div 
                  onClick={() => {
                    setPrivateMode(!privateMode);
                    explainFeature(
                      'Private Mode Toggle',
                      'Privacy',
                      'Bila diaktifkan, hasil generasi gambar tidak akan dipublikasikan ke feed komunitas Leonardo.Ai Maxy Academy.'
                    );
                  }}
                  className="p-3 bg-[#1c202d] border border-[#2b3042] rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-[#00e699] flex items-center justify-center font-bold text-xs">
                      ❖
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Private Mode</p>
                      <p className="text-[10px] text-slate-400">Disembunyikan dari publik</p>
                    </div>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${privateMode ? 'bg-[#00e699]' : 'bg-slate-700'}`}>
                    <div className={`w-3 h-3 rounded-full bg-slate-950 transition-transform ${privateMode ? 'translate-x-4' : ''}`} />
                  </div>
                </div>

                {/* Reset to Defaults button */}
                <button 
                  onClick={() => {
                    setSelectedModel('Auto');
                    setSelectedStyle('Dynamic');
                    setSelectedAspect('1:1');
                    setGenerationCount(1);
                    explainFeature('Reset Parameter Selesai', 'Settings', 'Semua pengaturan telah dikembalikan ke standar bawaan.');
                  }}
                  className="w-full py-2 bg-[#181a24] hover:bg-[#202533] border border-[#232733] text-slate-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
              </div>

              {/* MAIN CREATION WORKSPACE & RESULTS (Matches Screenshot 2, 6, 7) */}
              <div className="flex-1 p-4 sm:p-6 bg-[#0e0f12] overflow-y-auto space-y-6">

                {/* Prompt Box Card */}
                <div className="bg-[#141720] border border-[#232733] rounded-2xl p-3 sm:p-4 space-y-3 shadow-2xl">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => explainFeature('Gambar Referensi', 'Prompt', 'Unggah gambar acuan untuk mengarahkan gaya AI.')}
                      className="p-3 bg-[#1c202d] border border-[#2b3042] rounded-xl text-slate-400 hover:text-white shrink-0"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    <textarea
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Enter your prompt here..."
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none min-h-[90px] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Prompt Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#202432]">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => explainFeature('Add Image Button', 'Prompt', 'Menambahkan elemen referensi visual tambahan.')}
                        className="px-3 py-1.5 bg-[#1c202d] border border-[#2b3042] text-xs font-bold text-slate-300 rounded-xl flex items-center gap-1 hover:text-white"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                        <span>Add</span>
                      </button>

                      <button 
                        onClick={() => {
                          setIsPromptPopoverOpen(!isPromptPopoverOpen);
                          explainFeature('Magic Sparkle Helper', 'Prompt', 'Pilihan perbaikan prompt AI otomatis.');
                        }}
                        className="p-1.5 bg-[#1c202d] border border-[#2b3042] rounded-xl text-purple-400 hover:text-white"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Generate Button with Token Stack (Matches Screenshot 2 & 6) */}
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-extrabold rounded-xl text-xs shadow-xl transition-all flex items-center gap-2"
                    >
                      <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
                      <div className="w-4 h-4 rounded-full bg-purple-900 border border-purple-400 flex items-center justify-center text-[9px]">
                        12
                      </div>
                    </button>
                  </div>
                </div>

                {/* Mode Tabs Row under Prompt (Screenshot 2) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#202432]">
                  {['Image', 'Video', 'Audio', '3D', 'Flow State', 'Blueprints'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab as any);
                        explainFeature(`Tab Aktif: ${tab}`, 'Workspace', `Menampilkan bidang kerja khusus ${tab}.`);
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                        activeTab === tab 
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                          : 'bg-[#141720] text-slate-400 border-[#202432] hover:text-white'
                      }`}
                    >
                      {tab} {tab === 'Audio' && <span className="ml-1 bg-purple-900 text-purple-300 text-[8px] px-1 rounded">New</span>}
                    </button>
                  ))}
                </div>

                {/* Free Plan Upgrade Banner (Matches Screenshot 2 & 6) */}
                <div className="p-4 bg-[#141720] border border-[#232733] rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#00e699] border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 fill-[#00e699]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">You are currently on a free plan.</p>
                      <p className="text-[11px] text-slate-400">Upgrade for additional tokens, private generations, and much more!</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => explainFeature('Upgrade Membership Plan', 'Subscription', 'Tingkatkan ke paket Pro untuk token tanpa batas dan tanpa antrean generasi.')}
                    className="px-4 py-2 bg-[#00e699] hover:bg-[#00cc88] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Upgrade Plan
                  </button>
                </div>

                {/* Generated Results Section Header (Matches Screenshot 2 & 7) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-300">Yesterday</h3>
                    <span className="text-xs text-slate-500">1 image generated</span>
                  </div>

                  {/* Generated Result Card (Matches Screenshot 2 & 7) */}
                  <div className="bg-[#141720] border border-[#232733] rounded-2xl p-4 space-y-4">
                    
                    {/* Prompt Header & Tags */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202432] pb-3">
                      <p className="text-xs text-slate-200 line-clamp-2 max-w-xl font-medium">
                        "{promptInput}"
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                        <button 
                          onClick={() => {
                            setPromptInput(promptInput);
                            explainFeature('Iterate Prompt', 'Generation', 'Menggunakan kembali prompt dan konfigurasi gambar ini untuk iterasi baru.');
                          }}
                          className="px-3 py-1 bg-[#1c202d] hover:bg-[#252a3b] border border-[#2b3042] text-xs font-bold text-purple-300 rounded-lg flex items-center gap-1"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Iterate</span>
                        </button>

                        <span className="px-2.5 py-1 bg-[#1e2230] border border-[#232733] text-[10px] font-bold text-slate-300 rounded-lg">
                          Lucid Origin
                        </span>

                        <span className="px-2.5 py-1 bg-[#1e2230] border border-[#232733] text-[10px] font-bold text-slate-300 rounded-lg">
                          1024×1024
                        </span>

                        <span className="px-2.5 py-1 bg-[#1e2230] border border-[#232733] text-[10px] font-bold text-slate-300 rounded-lg">
                          Dynamic
                        </span>
                      </div>
                    </div>

                    {/* Feedback Rating Section (Matches Screenshot 7) */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>How was this output?</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setThumbsFeedback('up')}
                          className={`p-1.5 rounded-lg border transition-all ${
                            thumbsFeedback === 'up' ? 'bg-emerald-500/20 border-emerald-500 text-[#00e699]' : 'bg-[#1c202d] border-[#2b3042] hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          onClick={() => setThumbsFeedback('down')}
                          className={`p-1.5 rounded-lg border transition-all ${
                            thumbsFeedback === 'down' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-[#1c202d] border-[#2b3042] hover:text-white'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    <div className="relative rounded-2xl overflow-hidden border border-[#232733] max-w-md bg-black">
                      <img 
                        src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80" 
                        alt="CTO Maxy Academy Result" 
                        className="w-full h-[360px] object-cover"
                      />

                      {/* Image Hover Actions */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button 
                          onClick={() => explainFeature('Download High Resolution', 'Export', 'Mengunduh gambar kualitas 8K tanpa watermark.')}
                          className="p-2 bg-black/70 hover:bg-black rounded-xl text-white backdrop-blur-md shadow-lg"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => explainFeature('Salin Tautan Gambar', 'Share', 'Menyalin tautan bagikan gambar ke papan klip.')}
                          className="p-2 bg-black/70 hover:bg-black rounded-xl text-white backdrop-blur-md shadow-lg"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Footer Wrap message & Back to top button (Matches Screenshot 7) */}
                    <div className="pt-6 border-t border-[#202432] flex flex-col items-center gap-3 text-center">
                      <p className="text-xs text-slate-400 font-medium">
                        That's a wrap! Time to generate more <span className="text-purple-400 font-bold">magic</span>.
                      </p>

                      <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-4 py-2 bg-[#1c202d] hover:bg-[#252a3b] border border-[#2b3042] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>Back to top</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ==================== MOBILE NAVIGATION DRAWER MODAL (Matches Screenshot 5) ==================== */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="absolute inset-0 z-50 flex bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 max-w-[85vw] h-full bg-[#13151c] border-r border-[#232733] p-5 flex flex-col justify-between overflow-y-auto text-slate-100"
            >
              <div className="space-y-6">
                {/* Header Title + Close Button */}
                <div className="flex items-center justify-between border-b border-[#232733] pb-4">
                  <span className="font-black text-xl text-white tracking-wide">LEONARDO.AI</span>
                  <button 
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-2 rounded-xl bg-[#1b1e29] text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Card (Screenshot 5) */}
                <div className="p-3 bg-[#181b26] border border-[#232733] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                      V
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">VizSmartWeb3348</p>
                      <p className="text-[10px] text-slate-400">Free Tier Account</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>

                {/* Token Balance Pill */}
                <div className="p-2.5 bg-[#181b26] border border-[#232733] rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#00e699] font-bold">
                    <Zap className="w-4 h-4 fill-[#00e699]" />
                    <span>{tokenBalance} Tokens</span>
                  </div>
                  <button className="px-2.5 py-1 bg-[#00e699] text-slate-950 font-extrabold text-[10px] rounded-lg">
                    Upgrade
                  </button>
                </div>

                {/* Navigation Items (Screenshot 5) */}
                <div className="space-y-1">
                  <button 
                    onClick={() => {
                      setActiveView('home');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                      activeView === 'home' ? 'bg-[#1e2230] text-purple-300 border border-purple-500/40' : 'text-slate-300 hover:bg-[#181b26]'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-purple-400" />
                    <span>Home</span>
                  </button>

                  <button 
                    onClick={() => {
                      explainFeature('Library', 'Navigation', 'Koleksi aset tersimpan.');
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-[#181b26] flex items-center gap-3"
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-400" />
                    <span>Library</span>
                  </button>

                  <div className="pt-3 pb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">AI TOOLS</p>
                  </div>

                  <button 
                    onClick={() => {
                      setActiveView('creation');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                      activeView === 'creation' ? 'bg-[#1e2230] text-purple-300 border border-purple-500/40' : 'text-slate-300 hover:bg-[#181b26]'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>Image</span>
                  </button>

                  <button 
                    onClick={() => {
                      explainFeature('Video Generator', 'AI Tools', 'Membuat animasi video dari gambar.');
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-[#181b26] flex items-center gap-3"
                  >
                    <Video className="w-4 h-4 text-slate-400" />
                    <span>Video</span>
                  </button>

                  <button 
                    onClick={() => {
                      explainFeature('Audio Generator (New)', 'AI Tools', 'Membuat trek suara buatan AI.');
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-[#181b26] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-4 h-4 text-slate-400" />
                      <span>Audio</span>
                    </div>
                    <span className="bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">New</span>
                  </button>

                  <button 
                    onClick={() => {
                      explainFeature('3D Generator', 'AI Tools', 'Generasi model 3D.');
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-[#181b26] flex items-center gap-3"
                  >
                    <Box className="w-4 h-4 text-slate-400" />
                    <span>3D</span>
                  </button>

                  <button 
                    onClick={() => {
                      explainFeature('Flow State', 'AI Tools', 'Alur kerja visual AI.');
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-[#181b26] flex items-center gap-3"
                  >
                    <GitBranch className="w-4 h-4 text-slate-400" />
                    <span>Flow State</span>
                  </button>

                  <button 
                    onClick={() => {
                      explainFeature('Blueprints Gallery', 'AI Tools', 'Galeri gaya blueprint.');
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-[#181b26] flex items-center gap-3"
                  >
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>Blueprints</span>
                  </button>
                </div>
              </div>

              {/* Bottom Version Label */}
              <div className="pt-4 border-t border-[#232733] text-[10px] text-slate-500 text-center">
                Leonardo.Ai Studio v3.5 • Maxy Academy
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== FEATURE EXPLANATION MODAL (Detailed Indonesian Explanations) ==================== */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#141720] border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-5"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)} 
                className="absolute top-4 right-4 p-2 rounded-full bg-[#1c202d] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Category Badge */}
              <div className="inline-block px-3 py-1 bg-purple-950/90 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                {activeModal.category}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  {activeModal.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {activeModal.description}
                </p>
              </div>

              {/* Parameters List if available */}
              {activeModal.parameters && activeModal.parameters.length > 0 && (
                <div className="p-3 bg-[#1c202d] border border-[#2b3042] rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-purple-300">Rincian Parameter Menu:</p>
                  <ul className="space-y-1">
                    {activeModal.parameters.map((param, index) => (
                      <li key={index} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{param}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Usage Guide if available */}
              {activeModal.usageGuide && activeModal.usageGuide.length > 0 && (
                <div className="p-3 bg-[#1e2230] border border-[#232733] rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-emerald-400">Cara Penggunaan:</p>
                  <ul className="space-y-1">
                    {activeModal.usageGuide.map((step, index) => (
                      <li key={index} className="text-[11px] text-slate-300 leading-normal">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Close Action */}
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-2xl text-xs shadow-lg transition-all"
              >
                Mengerti & Lanjutkan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Chat Bubble at Bottom Right (Matches Screenshots 1, 2, 4, 5) */}
      <div className="absolute bottom-4 right-4 z-40">
        <button 
          onClick={() => explainFeature('Dukungan Pelanggan & Bantuan AI', 'Support', 'Membuka obrolan langsung dengan tim dukungan pelanggan atau bot bantuan Leonardo.Ai.')}
          className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border border-purple-400/40"
          title="Leonardo Support Chat"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
        </button>
      </div>

    </div>
  );
};
