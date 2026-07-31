import React, { useState, useEffect } from 'react';
import { 
  Palette, Image as ImageIcon, Video, Sparkles, Sliders, Settings, HelpCircle,
  Zap, Search, X, Check, Copy, Download, ChevronRight, ChevronDown, Upload,
  Layers, Lock, Crown, ArrowUp, RefreshCw, Wand2, Eye, Shield, FileText,
  SlidersHorizontal, Play, Laptop, Smartphone, Menu, Plus, Compass, Sparkle,
  Grid, ExternalLink, Filter, CheckCircle2, History, Database, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeatureModal {
  title: string;
  category: string;
  description: string;
  parameters?: string[];
  usageGuide?: string[];
}

interface StyleOption {
  id: string;
  name: string;
  badge?: string;
  image: string;
}

export const StableDiffusionReplica: React.FC = () => {
  // Device view mode: 'desktop' | 'mobile'
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
  const [activeModal, setActiveModal] = useState<FeatureModal | null>(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [modelTab, setModelTab] = useState<'OpenAI' | 'Seedream' | 'Nano Banana'>('Seedream');
  
  // Selection states
  const [selectedModel, setSelectedModel] = useState('Seedream 3.5');
  const [selectedStyle, setSelectedStyle] = useState('Auto');
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const [generationMode, setGenerationMode] = useState<'Fast' | 'Standard' | 'High Quality'>('Fast');
  const [outputQuantity, setOutputQuantity] = useState<number>(2);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [advancedControlsOpen, setAdvancedControlsOpen] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(20);
  const [promptInput, setPromptInput] = useState('A futuristic cybernetic learning hub at Maxy Academy with student warriors, glowing blue holograms, cinematic lighting, ultra-detailed 8k render...');
  const [styleSearchQuery, setStyleSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('AI Image Generator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Generated images gallery
  const [generatedGallery, setGeneratedGallery] = useState([
    {
      id: 'gen-1',
      title: 'Maxy Academy Futuristic Campus Cyberpunk',
      model: 'Seedream 3.5',
      style: 'Cinematic',
      aspect: '16:9',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      prompt: 'A futuristic cybernetic learning hub at Maxy Academy with student warriors...'
    },
    {
      id: 'gen-2',
      title: 'Warrior AI Instructor Portrait',
      model: 'Seedream 5.0',
      style: 'Photograph',
      aspect: '1:1',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80',
      prompt: 'Portrait of a female AI warrior mentor at Maxy Academy in neon twilight...'
    }
  ]);

  // List of All Styles for Modal
  const stylesList: StyleOption[] = [
    { id: 'auto', name: 'Auto', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' },
    { id: 'design', name: 'Design', badge: 'Fast & Good', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80' },
    { id: 'photograph', name: 'Photograph', badge: 'FEATURED', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
    { id: 'cinematic', name: 'Cinematic', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80' },
    { id: 'realista', name: 'Realista', badge: 'BETA', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80' },
    { id: 'animation', name: 'Animation', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80' },
    { id: 'comic', name: 'Comic Book', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=80' },
    { id: 'cyberpunk', name: 'Cyberpunk', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&q=80' },
    { id: 'sai-analog', name: 'sai-analog film', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=80' },
    { id: 'fantasy', name: 'Fantasy art', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80' },
    { id: 'clay', name: 'Craft Clay', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&q=80' },
    { id: 'lineart', name: 'Line Art', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80' },
    { id: 'pixel', name: 'Pixel Art', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&q=80' },
    { id: 'graffiti', name: 'Street Graffiti', image: 'https://images.unsplash.com/photo-1500462828071-6216bd46c468?w=300&q=80' },
    { id: 'gta', name: 'Game GTA', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&q=80' },
    { id: 'papercraft', name: 'Papercraft Paper', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80' },
  ];

  const filteredStyles = stylesList.filter(s => 
    s.name.toLowerCase().includes(styleSearchQuery.toLowerCase())
  );

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
    if (credits < outputQuantity * 2) {
      explainFeature(
        'Kredit Tidak Cukup',
        'System Notice',
        'Kredit harian Anda kurang. Silakan klik "Get Credit" atau upgrade ke plan Pro Maxy Academy.'
      );
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCredits(prev => Math.max(0, prev - outputQuantity * 2));
      const newGen = {
        id: `gen-${Date.now()}`,
        title: `Generasi Maxy Academy (${selectedStyle})`,
        model: selectedModel,
        style: selectedStyle,
        aspect: selectedAspect,
        image: selectedStyle === 'Cyberpunk' 
          ? 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80'
          : selectedStyle === 'Animation'
          ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80'
          : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        prompt: promptInput
      };
      setGeneratedGallery(prev => [newGen, ...prev]);

      explainFeature(
        'Generasi AI Gambar Selesai!',
        'Stable Diffusion / Yeri AI Engine',
        `Gambar berhasil diproduksi menggunakan model ${selectedModel} dengan gaya ${selectedStyle} (Rasio ${selectedAspect}, Mode ${generationMode}). Kredit tersisa: ${credits - outputQuantity * 2}.`,
        [
          `Model: ${selectedModel}`,
          `Gaya Visual: ${selectedStyle}`,
          `Rasio Gambar: ${selectedAspect}`,
          `Jumlah Output: ${outputQuantity} Gambar`,
          `Watermark: ${watermarkEnabled ? 'Aktif' : 'Non-aktif'}`
        ]
      );
    }, 1400);
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-[720px] font-sans">
      
      {/* Simulator Device View Mode Switcher Header Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between z-40 shrink-0 text-slate-900 dark:text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Mode Tampilan Stable Diffusion Simulator:</span>
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1 gap-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              deviceMode === 'desktop' ? 'bg-blue-600 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
              deviceMode === 'mobile' ? 'bg-blue-600 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View</span>
          </button>
        </div>
      </div>
      
      {/* Top Notice Banner (Matching Screenshot 1) */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-30">
        <div className="flex items-center gap-2 text-slate-600">
          <span>You're on the Free plan. Upgrade for more credits, access to every model, and watermark-free generations.</span>
        </div>
        <button
          onClick={() => explainFeature('Upgrade Membership', 'Subscription', 'Tingkatkan akun Maxy Academy Anda ke paket Pro untuk mendapatkan kredit tanpa batas dan bebas watermark!')}
          className="relative px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white font-bold rounded-lg text-xs transition-all shadow flex items-center gap-1"
        >
          <span>Upgrade</span>
          <span className="absolute -top-2 -right-2 bg-rose-500 text-slate-900 dark:text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow border border-white">
            50% OFF
          </span>
        </button>
      </div>

      {/* Main App Bar Header */}
      <div className="h-14 border-b border-slate-200 bg-white px-3 sm:px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              explainFeature('Toggle Navigation Sidebar', 'Navigation', 'Membuka atau menyembunyikan bilah navigasi menu utama.');
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => explainFeature('Yeri AI / Stable Diffusion Studio', 'Brand Identity', 'Yeri AI Studio: Platform kecerdasan buatan terdepan untuk pembuatan gambar, foto realistis, dan video karya Maxy Academy.')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-pink-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Palette className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight">
              Yeri <span className="text-blue-600">AI</span>
            </span>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">

          {/* Credit Balance Pill */}
          <button
            onClick={() => explainFeature('Kredit Harian AI', 'Credits', `Akun Maxy Academy saat ini memiliki ${credits} kredit tersisa untuk merender gambar.`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 border border-sky-200 text-sky-800 rounded-full text-xs font-bold shadow-sm hover:bg-sky-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Credit: {credits}</span>
          </button>

          {/* Get Credit Button */}
          <button
            onClick={() => {
              setCredits(prev => prev + 20);
              explainFeature('Topup Credit Selesai', 'Credits', 'Kredit harian Maxy Academy berhasil ditambah +20 kredit secara gratis!');
            }}
            className="hidden sm:flex px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-slate-900 dark:text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            Get Credit
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => explainFeature('User Profile (Maxy Academy)', 'User Account', 'Akun aktif: maxyacademy.one@gmail.com - Status: Free Member (20 Credits).')}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center cursor-pointer border border-slate-300 shadow-sm"
          >
            M
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        
        {/* Desktop Left Sidebar (Screenshots 1 & 2) */}
        {deviceMode === 'desktop' && isSidebarOpen && (
          <div className="w-56 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 p-3 overflow-y-auto text-xs text-slate-600 space-y-4">
            
            <div className="space-y-4">
              <button 
                onClick={() => {
                  setActiveSidebarTab('Home');
                  explainFeature('Home Dashboard', 'Sidebar Nav', 'Kembali ke halaman utama katalog Yeri AI.');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 font-medium ${activeSidebarTab === 'Home' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-100'}`}
              >
                <Compass className="w-4 h-4" />
                <span>Home</span>
              </button>

              {/* AI Image Section */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Image</span>
                <button 
                  onClick={() => {
                    setActiveSidebarTab('AI Image Generator');
                    explainFeature('AI Image Generator', 'Sidebar Nav', 'Studio utama pembuat gambar dari deskripsi teks (Text-to-Image).');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 font-medium ${activeSidebarTab === 'AI Image Generator' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-100'}`}
                >
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>AI Image Generator</span>
                </button>
                <button 
                  onClick={() => explainFeature('AI Photo Effects', 'Sidebar Nav', 'Fitur penyuntingan efek foto portrait dan pencahayaan pintar.')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-100"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Photo Effects</span>
                </button>
              </div>

              {/* AI Video Section */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Video</span>
                <button 
                  onClick={() => explainFeature('AI Video Generator', 'Sidebar Nav', 'Mengubah foto statis atau teks menjadi video gerak cinematic.')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-100"
                >
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>AI Video Generator</span>
                </button>
                <button 
                  onClick={() => explainFeature('AI Video Templates', 'Sidebar Nav', 'Kumpulan template animasi video promosi siap pakai.')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-100"
                >
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>AI Video Templates</span>
                </button>
              </div>

              {/* AI Image Editor */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Image Editor</span>
                <button 
                  onClick={() => explainFeature('Image Upscaler (Pro)', 'Sidebar Nav', 'Meningkatkan resolusi gambar hingga 4K/8K tanpa kehilangan detail.')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-indigo-600" />
                    <span>Image Upscaler</span>
                  </div>
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                </button>
                <button 
                  onClick={() => explainFeature('Background Remover', 'Sidebar Nav', 'Menghapus latar belakang foto secara otomatis dengan ketajaman piksel tinggi.')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-100"
                >
                  <X className="w-4 h-4 text-rose-500" />
                  <span>Background Remover</span>
                </button>
                <button 
                  onClick={() => explainFeature('Expand Image', 'Sidebar Nav', 'Melakukan outpainting gambar untuk memperluas bingkai secara seamless.')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-100"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-600" />
                  <span>Expand Image</span>
                </button>
              </div>

              {/* General Section */}
              <div className="space-y-1 border-t border-slate-200 pt-2">
                <button 
                  onClick={() => explainFeature('Prompt Database', 'Sidebar Nav', 'Perpustakaan contoh prompt pilihan dari para kreator profesional.')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-100"
                >
                  <Database className="w-4 h-4 text-slate-500" />
                  <span>Prompt Database</span>
                </button>
                <button 
                  onClick={() => explainFeature('Creation History', 'Sidebar Nav', 'Riwayat hasil generasi gambar yang pernah dibuat oleh akun Maxy Academy.')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-100"
                >
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Creation History</span>
                </button>
              </div>
            </div>

            {/* Bottom Upgrade Button */}
            <button 
              onClick={() => explainFeature('View Plans', 'Subscription', 'Melihat pilihan paket langganan bulanan dan tahunan Yeri AI.')}
              className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-slate-900 dark:text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition-colors"
            >
              <Crown className="w-4 h-4" />
              <span>View plans</span>
            </button>
          </div>
        )}

        {/* Studio Center Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Title Banner */}
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              AI Image Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter a prompt or upload reference images to create and edit images with AI.
            </p>
          </div>

          {/* MAIN PROMPT CARD - DESKTOP VIEW (Matching Screenshot 1) */}
          {deviceMode === 'desktop' ? (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-blue-500/80 p-4 shadow-xl space-y-4">
              
              <div className="flex gap-4">
                {/* Dashed Reference Upload Box */}
                <div 
                  onClick={() => explainFeature('Edit Image / Reference Upload', 'Image Reference', 'Unggah gambar acuan (PNG, JPG, WEBP hingga 10MB) untuk melakukan Image-to-Image atau Inpainting.')}
                  className="w-28 h-28 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 rounded-2xl flex flex-col items-center justify-center text-center p-2 cursor-pointer transition-colors shrink-0 group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 mt-1">Edit Image</span>
                </div>

                {/* Text Area Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Describe the image you want to create (at least 3 characters)"
                    className="w-full h-28 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none pr-12"
                  />
                  <span className="absolute bottom-1 right-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {promptInput.length} / 5000
                  </span>
                </div>
              </div>

              {/* Bottom Quick Controls Toolbar Row (Matching Screenshot 1) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Image Dropdown */}
                  <button 
                    onClick={() => explainFeature('Image Input Mode', 'Control', 'Mode referensi gambar aktif.')}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-medium text-slate-700 flex items-center gap-1"
                  >
                    <span>Image</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </button>

                  {/* Model Selector Dropdown (Triggers Modal 1) */}
                  <button 
                    onClick={() => {
                      setIsModelModalOpen(true);
                      explainFeature('Model Selector', 'Model Choice', 'Membuka popup pilihan model AI (Seedream 3.5, Seedream 5.0, OpenAI GPT Image 2, Nano Banana Pro).');
                    }}
                    className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg font-bold text-sky-800 flex items-center gap-1.5"
                  >
                    <BarChart2Icon className="w-3.5 h-3.5 text-sky-600" />
                    <span>{selectedModel}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
                  </button>

                  {/* Style Selector Dropdown (Triggers Modal 2) */}
                  <button 
                    onClick={() => {
                      setIsStyleModalOpen(true);
                      explainFeature('Style Selector', 'Visual Style', 'Membuka galeri All Styles (Auto, Design, Photograph, Cinematic, Realista, Cyberpunk, dll).');
                    }}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-medium text-slate-700 flex items-center gap-1"
                  >
                    <span>Style: <strong>{selectedStyle}</strong></span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </button>

                  {/* Aspect Ratio Pill */}
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
                    <span className="text-[11px] font-bold text-slate-600">🔲 {selectedAspect}</span>
                  </div>

                  {/* Speed Pill */}
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
                    <span className="text-[11px] font-bold text-slate-600">⚡ {generationMode}</span>
                  </div>

                  {/* Resolution Pill */}
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
                    <span className="text-[11px] font-bold text-slate-600">1K</span>
                  </div>

                  {/* Quantity Pill */}
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
                    <span className="text-[11px] font-bold text-slate-600">🖼️ {outputQuantity}</span>
                    <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  </div>

                  {/* Watermark Toggle */}
                  <div 
                    onClick={() => {
                      setWatermarkEnabled(!watermarkEnabled);
                      explainFeature('Watermark Toggle', 'Settings', `Watermark disesuaikan menjadi ${!watermarkEnabled ? 'Aktif' : 'Non-aktif'}.`);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <span className="text-[11px] font-semibold text-slate-700">Watermark</span>
                    <div className={`w-7 h-4 rounded-full p-0.5 transition-colors ${watermarkEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${watermarkEnabled ? 'translate-x-3' : ''}`} />
                    </div>
                  </div>

                  {/* Filter/Settings Icon */}
                  <button 
                    onClick={() => explainFeature('Advanced Parameter Controls', 'Settings', 'Mengatur Seed number, Sampler steps, dan CFG Guidance Scale.')}
                    className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Action Generate Button */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sky-700 font-bold text-xs bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>{outputQuantity * 2}</span>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-10 h-10 bg-slate-400 hover:bg-blue-600 text-slate-900 dark:text-white rounded-full flex items-center justify-center transition-all shadow-md disabled:opacity-50"
                    title="Generate Image"
                  >
                    <ArrowUp className="w-5 h-5 font-bold" />
                  </button>
                </div>

              </div>

            </div>
          ) : (
            /* MOBILE VIEW LAYOUT (Matching Screenshots 4, 5, 6) */
            <div className="max-w-md mx-auto space-y-4 text-slate-800">
              
              {/* Image Upload Box */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800">Image</label>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">ℹ️ PNG, JPG, GIF, WEBP up to 10MB</p>
                <div 
                  onClick={() => explainFeature('Edit Image Upload', 'Mobile Input', 'Unggah gambar referensi untuk proses pengeditan.')}
                  className="border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-xl p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">Edit Image (PNG, JPG up to 10MB)</span>
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-800">Prompt</label>
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Describe anything in your mind, use short sentences, separated by commas."
                  className="w-full h-24 bg-blue-50/20 border border-blue-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Model Dropdown Box (Screenshot 4/5) */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800">Model</label>
                <div 
                  onClick={() => setIsModelModalOpen(true)}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-400"
                >
                  <div className="flex items-center gap-2">
                    <BarChart2Icon className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedModel}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">All-around image quality, fast results, low cost</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
              </div>

              {/* Style Grid (Screenshot 5) */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800">Style</label>
                  <button 
                    onClick={() => setIsStyleModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    More <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stylesList.slice(0, 6).map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setSelectedStyle(st.name);
                        explainFeature(`Gaya Visual: ${st.name}`, 'Mobile Style', `Memilih gaya visual ${st.name} untuk pengerjaan gambar.`);
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                        selectedStyle === st.name ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <img src={st.image} alt={st.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-xs font-bold text-slate-800 truncate">{st.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector Grid (Screenshot 5/6) */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800">Aspect Ratio</label>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {['Auto', '1:1', '4:3', '3:4', '5:4', '4:5', '2:3', '9:16', '16:9', '1:2', '2:1'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setSelectedAspect(ratio)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl border text-center transition-all ${
                        selectedAspect === ratio ? 'border-blue-600 bg-blue-600 text-slate-900 dark:text-white font-extrabold shadow' : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <p className="text-xs">{ratio}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generation Mode (Screenshot 6) */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800">Generation Mode</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {(['Fast', 'Standard', 'High Quality'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setGenerationMode(m)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        generationMode === m ? 'bg-white text-blue-600 shadow' : 'text-slate-500'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Quantity (Screenshot 6) */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800">Output Quantity</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {[1, 2, 4].map((q) => (
                    <button
                      key={q}
                      onClick={() => setOutputQuantity(q)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        outputQuantity === q ? 'bg-white text-blue-600 shadow' : 'text-slate-500'
                      }`}
                    >
                      <span>{q}</span>
                      {q === 4 && <Crown className="w-3 h-3 text-amber-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Controls Accordion */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
                <button
                  onClick={() => setAdvancedControlsOpen(!advancedControlsOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className={`w-4 h-4 transition-transform ${advancedControlsOpen ? 'rotate-90' : ''}`} />
                    <span>Advanced Controls</span>
                  </div>
                </button>
                {advancedControlsOpen && (
                  <div className="pt-2 border-t border-slate-100 text-xs space-y-2 text-slate-600">
                    <p>Seed Number: Random (-1)</p>
                    <p>CFG Scale: 7.0</p>
                    <p>Sampling Steps: 30</p>
                  </div>
                )}
              </div>

              {/* Watermark Toggle */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Watermark</span>
                </div>
                <div 
                  onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${watermarkEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${watermarkEnabled ? 'translate-x-4' : ''}`} />
                </div>
              </div>

              {/* Sticky Bottom Generate Button (Screenshot 6) */}
              <div className="sticky bottom-2 z-20 bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-3 shadow-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Credits Required:</span>
                  <span className="font-bold text-sky-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    {outputQuantity * 2} credits
                  </span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white font-extrabold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{isGenerating ? 'Generating Images...' : 'Generate'}</span>
                </button>
              </div>

            </div>
          )}

          {/* Promotional Banner: GPT Image 2 (Matching Screenshots 1 & 4) */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-950 rounded-2xl p-4 border border-cyan-800/50 shadow-xl flex flex-wrap items-center justify-between gap-3 text-slate-900 dark:text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center font-black text-cyan-300">
                GPT
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base">
                  GPT Image 2 is now <span className="text-amber-400 font-black">50% off</span> for a limited time, free to try
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Dapatkan perenderan gambar definisi tinggi dengan model GPT Image 2 dari OpenAI.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedModel('OpenAI GPT Image 2');
                explainFeature('Mencoba GPT Image 2', 'Model Selector', 'Model AI telah dialihkan ke OpenAI GPT Image 2 dengan diskon kredit 50%!');
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all"
            >
              Try now ➔
            </button>
          </div>

          {/* Popular Models Section (Matching Screenshot 1) */}
          <div className="max-w-4xl mx-auto space-y-3">
            <h3 className="text-lg font-black text-slate-900 text-center sm:text-left">
              Popular Models
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div 
                onClick={() => {
                  setSelectedModel('OpenAI GPT Image 2');
                  explainFeature('Model: GPT Image 2', 'Popular Models', 'Model perenderan gambar berbasis OpenAI GPT Image 2 untuk hasil estetika fotorealistik.');
                }}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md hover:border-blue-500 transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-amber-400 uppercase">Featured</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-400">GPT Image 2</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">High quality image rendering & accurate prompt following.</p>
              </div>

              <div 
                onClick={() => {
                  setSelectedModel('Seedream 5.0');
                  explainFeature('Model: Seedream 5.0', 'Popular Models', 'Seedream 5.0: Pencarian web real-time & kontrol pengeditan mikro presisi.');
                }}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md hover:border-blue-500 transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-sky-400 uppercase">PRO 5.0</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-400">Seedream 5.0</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Real-time web retrieval & precise editing controls.</p>
              </div>

              <div 
                onClick={() => {
                  setSelectedModel('Nano Banana 2');
                  explainFeature('Model: Nano Banana 2', 'Popular Models', 'Nano Banana 2: Mode sketsa ke cerita, secepat kilat dengan wawasan web.');
                }}
                className="bg-amber-50 dark:bg-amber-950/90 text-amber-100 rounded-2xl p-4 border border-amber-800/60 shadow-md hover:border-amber-400 transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-amber-400 uppercase">Sketch to Story</span>
                <h4 className="font-bold text-sm text-amber-200 group-hover:text-amber-400">Nano Banana 2</h4>
                <p className="text-[10px] text-amber-300/80 mt-1">Consistent characters, fast 4K & web aware.</p>
              </div>

              <div 
                onClick={() => {
                  setSelectedModel('Nano Banana Pro');
                  explainFeature('Model: Nano Banana Pro', 'Popular Models', 'Nano Banana Pro: Khusus untuk foto komersial produk 4K.');
                }}
                className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md hover:border-blue-500 transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-emerald-400 uppercase">4K Product Ready</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-400">Nano Banana Pro</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Ultra detail, clean text rendering, multi-reference.</p>
              </div>

            </div>
          </div>

          {/* Generated Gallery Display */}
          <div className="max-w-4xl mx-auto space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-black text-slate-900">
              Galeri Hasil Generasi Maxy Academy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedGallery.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md space-y-3 p-3">
                  <div className="relative rounded-xl overflow-hidden group">
                    <img src={item.image} alt={item.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 right-2 bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 text-slate-900 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur">
                      {item.aspect}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 italic">"{item.prompt}"</p>
                    <div className="flex items-center justify-between mt-3 text-xs pt-2 border-t border-slate-100">
                      <span className="font-bold text-blue-600">{item.model} • {item.style}</span>
                      <button 
                        onClick={() => explainFeature('Download High-Res Image', 'Export', 'Mengunduh hasil karya generasi gambar resolusi tinggi tanpa watermark.')}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MODAL 1: MODEL SELECTOR (Matching Screenshot 2) */}
      <AnimatePresence>
        {isModelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-800 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">MODEL</span>
                <button 
                  onClick={() => setIsModelModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                
                {/* Left Tabs */}
                <div className="sm:col-span-4 space-y-1">
                  <button
                    onClick={() => setModelTab('OpenAI')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors ${
                      modelTab === 'OpenAI' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>OpenAI</span>
                    <span className="px-1.5 py-0.5 bg-rose-500 text-slate-900 dark:text-white text-[9px] font-extrabold rounded-full">HOT</span>
                  </button>

                  <button
                    onClick={() => setModelTab('Seedream')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors ${
                      modelTab === 'Seedream' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Seedream</span>
                  </button>

                  <button
                    onClick={() => setModelTab('Nano Banana')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors ${
                      modelTab === 'Nano Banana' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Nano Banana</span>
                  </button>
                </div>

                {/* Right Model Cards List (Matching Screenshot 2) */}
                <div className="sm:col-span-8 space-y-2 max-h-80 overflow-y-auto pr-1">
                  
                  {/* Model 1: Seedream 5.0 */}
                  <div 
                    onClick={() => {
                      setSelectedModel('Seedream 5.0');
                      setIsModelModalOpen(false);
                      explainFeature('Seedream 5.0 Dipilih', 'Model Selector', 'Model Seedream 5.0 diaktifkan dengan fitur pencarian web real-time.');
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedModel === 'Seedream 5.0' ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <BarChart2Icon className="w-4 h-4 text-sky-600" />
                        <span className="font-extrabold text-sm text-slate-900">Seedream 5.0</span>
                      </div>
                      <Crown className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Real-time web retrieval and precise editing controls.</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>⏱️ 47 sec</span>
                      <span>⚛️ 22+ credits</span>
                    </div>
                  </div>

                  {/* Model 2: Seedream 4.5 */}
                  <div 
                    onClick={() => {
                      setSelectedModel('Seedream 4.5');
                      setIsModelModalOpen(false);
                      explainFeature('Seedream 4.5 Dipilih', 'Model Selector', 'Model Seedream 4.5 diaktifkan untuk konsistensi subjek tinggi.');
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedModel === 'Seedream 4.5' ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <BarChart2Icon className="w-4 h-4 text-sky-600" />
                        <span className="font-extrabold text-sm text-slate-900">Seedream 4.5</span>
                      </div>
                      <Crown className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Stronger subject consistency and text rendering.</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>⏱️ 60 sec</span>
                      <span>⚛️ 22+ credits</span>
                    </div>
                  </div>

                  {/* Model 3: Seedream 4 */}
                  <div 
                    onClick={() => {
                      setSelectedModel('Seedream 4');
                      setIsModelModalOpen(false);
                      explainFeature('Seedream 4 Dipilih', 'Model Selector', 'Model Seedream 4 diaktifkan untuk gambar berseni konsisten.');
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedModel === 'Seedream 4' ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <BarChart2Icon className="w-4 h-4 text-sky-600" />
                        <span className="font-extrabold text-sm text-slate-900">Seedream 4</span>
                      </div>
                      <Crown className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Support images with cohesive, consistent styles.</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>⏱️ 18 sec</span>
                      <span>⚛️ 14+ credits</span>
                    </div>
                  </div>

                  {/* Model 4: Seedream 3.5 */}
                  <div 
                    onClick={() => {
                      setSelectedModel('Seedream 3.5');
                      setIsModelModalOpen(false);
                      explainFeature('Seedream 3.5 Dipilih', 'Model Selector', 'Model standar Seedream 3.5 diaktifkan untuk generasi super cepat.');
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedModel === 'Seedream 3.5' ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/30' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <BarChart2Icon className="w-4 h-4 text-sky-600" />
                        <span className="font-extrabold text-sm text-slate-900">Seedream 3.5</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">All-around image quality, fast results, low cost.</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>⏱️ 10 sec</span>
                      <span>⚛️ 1+ credits</span>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ALL STYLES GALLERY (Matching Screenshot 3) */}
      <AnimatePresence>
        {isStyleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-800 space-y-4 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900">All Styles</h3>
                <button 
                  onClick={() => setIsStyleModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  value={styleSearchQuery}
                  onChange={(e) => setStyleSearchQuery(e.target.value)}
                  placeholder="Search styles..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Styles Grid (Matching Screenshot 3) */}
              <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pr-1">
                {filteredStyles.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedStyle(st.name);
                      setIsStyleModalOpen(false);
                      explainFeature(`Gaya Visual: ${st.name}`, 'Style Gallery', `Gaya visual ${st.name} berhasil dipasang.`);
                    }}
                    className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all flex flex-col items-center text-center p-1.5 ${
                      selectedStyle === st.name ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/30' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="relative w-full h-24 rounded-xl overflow-hidden">
                      <img src={st.image} alt={st.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {st.badge && (
                        <span className="absolute top-1 left-1 bg-rose-500 text-slate-900 dark:text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow">
                          {st.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-1.5 truncate w-full px-1">
                      {st.name}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feature Explanation Modal Popup */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white border border-blue-500/40 rounded-3xl p-6 shadow-2xl text-slate-800 space-y-4"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {activeModal.category}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  {activeModal.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeModal.description}
                </p>
              </div>

              {activeModal.parameters && activeModal.parameters.length > 0 && (
                <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/80 space-y-1 text-xs">
                  <p className="font-bold text-blue-900 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                    <span>Parameter & Spesifikasi Teknis:</span>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-blue-900 text-[11px]">
                    {activeModal.parameters.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeModal.usageGuide && activeModal.usageGuide.length > 0 && (
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 space-y-1 text-xs">
                  <p className="font-bold text-sky-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Cara Menggunakan (Panduan Langkah demi Langkah):</span>
                  </p>
                  <div className="space-y-1 text-[11px] text-sky-950 font-medium">
                    {activeModal.usageGuide.map((step, i) => (
                      <p key={i} className="leading-relaxed">{step}</p>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white font-extrabold rounded-2xl text-xs shadow-lg transition-all"
              >
                Tutup Penjelasan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Helper Icon for Model Bar Chart
function BarChart2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}
