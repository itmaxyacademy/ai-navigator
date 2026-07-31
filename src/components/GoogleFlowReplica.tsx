import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Image as ImageIcon, Video, User, Film, Upload, Wand2, Trash2,
  PanelLeftClose, Search, SlidersHorizontal, Plus, HelpCircle, Settings, MoreVertical,
  ChevronLeft, X, Edit3, ThumbsUp, ThumbsDown, Copy, Flag, Send, Play, Sparkles,
  Info, Download, BookOpen, Tv, ShieldAlert, FileText, Check, Layers, Sliders,
  FolderPlus, UserPlus, Clapperboard, RefreshCw, Volume2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalExplanationData {
  title: string;
  category: string;
  badge: string;
  description: string;
  keyFeatures: string[];
  howToUse: string;
  actionButtonText?: string;
  actionKey?: string;
}

export const GoogleFlowReplica: React.FC = () => {
  // Device layout state: desktop vs mobile
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'mobile';
    }
    return 'desktop';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setDeviceMode('mobile');
    }
  }, []);
  
  // Navigation active tab
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>('All Media');
  
  // Modals and dropdown states
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [explanationModal, setExplanationModal] = useState<ModalExplanationData | null>(null);

  // Settings State inside Agent Settings
  const [confirmBeforeGenerating, setConfirmBeforeGenerating] = useState<'Always' | 'Never'>('Always');
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('16:9');
  const [imageBatchCount, setImageBatchCount] = useState<string>('x2');
  const [imageModel, setImageModel] = useState<string>('Nano Banana 2');
  const [videoAspectRatio, setVideoAspectRatio] = useState<string>('16:9');
  const [videoBatchCount, setVideoBatchCount] = useState<string>('x1');
  const [videoModel, setVideoModel] = useState<string>('Omni Flash');

  // Filter / View Mode state
  const [viewMode, setViewMode] = useState<'Grid' | 'Batch'>('Grid');
  const [gridSize, setGridSize] = useState<'S' | 'M' | 'L'>('L');
  const [soundOnHover, setSoundOnHover] = useState(false);
  const [returnSilentVideos, setReturnSilentVideos] = useState(false);
  const [showTileDetails, setShowTileDetails] = useState(false);
  const [clearPromptOnSubmit, setClearPromptOnSubmit] = useState(true);

  // Chat/Agent prompt state
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; text: string; time?: string }>>([
    {
      id: '1',
      text: 'Video animasi Captain Maxy sudah dijadwalkan dan menunggu dalam antrean. Saya akan kabari jika Anda menanyakan statusnya nanti!',
    },
    {
      id: '2',
      text: 'Saya telah menjadwalkan pembuatan video animasi penuh 10 detik yang memperlihatkan Captain Maxy di Briefing Room. Video ini akan menyambung secara seamless dengan gerakan whip-pan dari gudang logistik, menampilkan wawasan Captain Maxy saat bersiap menjalankan misi.',
    },
    {
      id: '3',
      text: 'Video ini sekarang sedang dalam antrean. Anda bisa mengecek statusnya kembali dalam beberapa menit!',
    }
  ]);

  // Comprehensive Dictionary of Feature Explanation Modals
  const featureExplanations: Record<string, ModalExplanationData> = {
    // Sidebar items
    'All Media': {
      title: 'All Media (Semua Berkas Media)',
      category: 'Galeri Utama',
      badge: 'Media Library',
      description: 'Menampilkan seluruh aset media dalam proyek Google Flow Anda, termasuk gambar hasil generasi, skrip video, karakter AI, dan berkas yang Anda unggah.',
      keyFeatures: [
        'Tampilan terpadu dari seluruh aset gambar dan video generasi AI',
        'Pencarian dan penyaringan instan berdasarkan nama atau tipe berkas',
        'Akses cepat ke detail prompt dan benih (seed) konsistensi karakter'
      ],
      howToUse: 'Klik "All Media" di sidebar kiri untuk meninjau seluruh koleksi visual proyek Captain Maxy Maxy Academy.',
      actionButtonText: '📂 Buka Koleksi All Media'
    },
    'Images': {
      title: 'Images (Galeri Gambar Generasi)',
      category: 'Aset Visual',
      badge: 'Image Studio',
      description: 'Menyaring galeri hanya untuk menampilkan hasil reka gambar resolusi tinggi yang digenerasi oleh model AI (seperti Nano Banana 2 & Imagen 3).',
      keyFeatures: [
        'Koleksi gambar tunggal dan variasi batch (1x - 4x)',
        'Dukungan berbagai aspek rasio (16:9, 4:3, 1:1, 3:4, 9:16)',
        'Ekspor instan dan konversi langsung dari gambar ke animasi video'
      ],
      howToUse: 'Pilih "Images" untuk melihat hasil gambar diam karakter Captain Maxy dan latar belakang logistik.',
      actionButtonText: '🖼️ Lihat Galeri Gambar'
    },
    'Videos': {
      title: 'Videos (Galeri Video & Animasi)',
      category: 'Aset Multimedia',
      badge: 'Video Studio',
      description: 'Menampilkan seluruh hasil animasi video berdurasi 5-10 detik yang dihasilkan oleh model Omni Flash dan Veo dari petunjuk teks atau sampel gambar.',
      keyFeatures: [
        'Pemutaran pratinjau langsung dengan efek gerak seamless',
        'Kontrol suara bawaan (sound on hover) dan pengaturan kecepatan pemutaran',
        'Siap diunduh untuk kebutuhan pembuatan iklan, Reels, dan modul Maxy Academy'
      ],
      howToUse: 'Klik "Videos" untuk meninjau klip video animasi Captain Maxy yang telah digenerasi.',
      actionButtonText: '🎬 Putar Koleksi Video'
    },
    'Characters': {
      title: 'Characters (Karakter Konsisten AI)',
      category: 'Consistency Engine',
      badge: 'AI Character Anchor',
      description: 'Pusat pengelolaan karakter AI (seperti Captain Maxy) agar wajah, pakaian, dan proporsi tubuhnya tetap konsisten di berbagai adegan gambar dan video.',
      keyFeatures: [
        'Penyimpanan referensi wajah dan busana karakter (Character Seed)',
        'Pemanggilan nama karakter langsung di dalam prompt (misal: "Captain Maxy di gudang")',
        'Pengaturan ekspresi emosi dan sudut kamera per adegan'
      ],
      howToUse: 'Gunakan tab "Characters" untuk mendaftarkan dan mengelola karakter utama riset Maxy Academy.',
      actionButtonText: '👤 Kelola Karakter AI'
    },
    'Scenes': {
      title: 'Scenes (Penyusun Adegan & Storyboard)',
      category: 'Storyboard Studio',
      badge: 'Scene Director',
      description: 'Fitur untuk merangkai beberapa klip video dan gambar menjadi urutan adegan (storyboard) linier sebelum diekspor menjadi video utuh.',
      keyFeatures: [
        'Pengaturan urutan kronologis adegan dari awal hingga akhir',
        'Gerakan kamera transisi (whip-pan, zoom-in, pan-left) antar adegan',
        'Penyelarasan suasana pencahayaan dan gaya visual antar klip'
      ],
      howToUse: 'Klik "Scenes" untuk menyusun alur cerita video animasi Captain Maxy.',
      actionButtonText: '🎞️ Buka Director Scenes'
    },
    'Uploads': {
      title: 'Uploads (Unggah Berkas Referensi)',
      category: 'Data Source',
      badge: 'External Media',
      description: 'Tempat menyimpan berkas foto, gambar sketsa, atau logo Maxy Academy yang diunggah dari komputer/HP untuk dijadikan acuan gaya oleh AI.',
      keyFeatures: [
        'Dukungan format JPG, PNG, WEBP, dan MP4 hingga 100MB',
        'Gunakan berkas unggahan sebagai Image-to-Video atau Style Reference',
        'Penyimpanan aman di cloud Google Flow'
      ],
      howToUse: 'Klik "Uploads" untuk menambahkan logo Maxy Academy atau referensi visual kustom.',
      actionButtonText: '📤 Unggah Berkas Baru'
    },
    'Tools': {
      title: 'Tools (Alat Pengeditan Lanjutan)',
      category: 'AI Suite',
      badge: 'Editing Suite',
      description: 'Akses ke perkakas kecerdasan buatan lanjutan seperti Upscaling 4K, Background Removal, Inpainting, Outpainting, dan Audio Synthesizer.',
      keyFeatures: [
        'Upscale resolusi gambar dan video secara instan',
        'Penghapus latar belakang otomatis dan ganti adegan',
        'Sintesis suara narator untuk klip video animation'
      ],
      howToUse: 'Pilih "Tools" untuk memproses efek visual lanjutan pada adegan yang sudah dibuat.',
      actionButtonText: '🛠️ Buka Tools AI'
    },
    'Trash': {
      title: 'Trash (Keranjang Sampah)',
      category: 'Storage Management',
      badge: 'Recycle Bin',
      description: 'Tempat penyimpanan sementara untuk berkas gambar atau video yang dihapus. Berkas dapat dipulihkan kembali sebelum dihapus permanen dalam 30 hari.',
      keyFeatures: [
        'Pemulihan berkas instan dengan 1 klik',
        'Pembersihan otomatis berkas kedaluwarsa setelah 30 hari',
        'Manajemen kapasitas penyimpanan proyek'
      ],
      howToUse: 'Buka "Trash" jika Anda tidak sengaja menghapus klip adegan Captain Maxy.',
      actionButtonText: '🗑️ Buka Trash'
    },

    // Create dropdown items
    'Upload media': {
      title: 'Upload Media (Unggah Berkas Baru)',
      category: 'Create Action',
      badge: '+ Menu',
      description: 'Mengunggah gambar atau video dari perangkat lokal Anda untuk digunakan sebagai bahan prompt atau acuan gaya dalam proyek Google Flow.',
      keyFeatures: [
        'Mendukung drag-and-drop berkas langsung ke layar simulator',
        'Mengubah foto nyata menjadi animasi karakter AI',
        'Proses impor cepat dengan dukungan cloud storage'
      ],
      howToUse: 'Pilih opsi ini dari menu "+" untuk mengunggah bahan visual baru.',
      actionButtonText: '⬆️ Unggah Berkas'
    },
    'Create Collection': {
      title: 'Create Collection (Buat Bundel Koleksi)',
      category: 'Create Action',
      badge: '+ Menu',
      description: 'Mengelompokkan klip video dan gambar terkait ke dalam satu bundel koleksi (seperti album "Gabungan" adegan gudang logistik).',
      keyFeatures: [
        'Pengorganisasian aset berdasarkan topik atau kampanye',
        'Ekspor sekaligus seluruh isi koleksi dalam 1 file ZIP',
        'Kemudahan berbagi dengan tim kerja Maxy Academy'
      ],
      howToUse: 'Gunakan opsi ini untuk membuat grup koleksi adegan baru.',
      actionButtonText: '📁 Buat Koleksi Baru'
    },
    'Create Character': {
      title: 'Create Character (Daftarkan Karakter Baru)',
      category: 'Create Action',
      badge: '+ Menu',
      description: 'Mendaftarkan persona karakter baru ke dalam database AI Google Flow dengan menetapkan nama, referensi wajah, dan deskripsi pakaian.',
      keyFeatures: [
        'Proses pendaftaran karakter presisi tinggi',
        'Menjamin konsistensi fitur wajah di ratusan variasi adegan',
        'Memudahkan pembuatan seri animasi edukasi Maxy Academy'
      ],
      howToUse: 'Klik opsi ini untuk mendaftarkan karakter seperti "Captain Maxy" atau instruktur baru.',
      actionButtonText: '👤 Buat Karakter'
    },
    'Create Scene': {
      title: 'Create Scene (Rancang Adegan Video)',
      category: 'Create Action',
      badge: '+ Menu',
      description: 'Membuka editor penyusun adegan untuk merencanakan pergerakan kamera, deskripsi suasana (prompt), dan latar musik.',
      keyFeatures: [
        'Dukungan prompt sinematik terstruktur',
        'Pemilihan pergerakan kamera (Pan, Tilt, Zoom, Dolly, Whip-pan)',
        'Pengeset durasi animasi (5s - 10s)'
      ],
      howToUse: 'Pilih "Create Scene" untuk mulai menyusun skrip visual baru.',
      actionButtonText: '🎬 Buat Adegan Video'
    },

    // Agent Settings Items
    'Confirm before generating': {
      title: 'Confirm Before Generating (Konfirmasi Sebelum Generasi)',
      category: 'Agent Setting',
      badge: 'Credits Protection',
      description: 'Pengaturan keamanan yang menentukan apakah Agent AI harus meminta persetujuan Anda sebelum mulai memproses pembuatan media yang mengonsumsi kuota credits.',
      keyFeatures: [
        'Opsi "Always": Meminta konfirmasi di chat sebelum memotong kredit generasi',
        'Opsi "Never": Otomatis langsung memproses prompt tanpa henti untuk efisiensi tinggi',
        'Mencegah pemborosan kuota pada pembuatan video berdurasi panjang'
      ],
      howToUse: 'Atur ke "Always" jika Anda ingin memeriksa estimasi waktu sebelum video dibuat.',
      actionButtonText: '⚙️ Atur Konfirmasi'
    },
    'Image generation default': {
      title: 'Image Generation Default (Pengaturan Default Gambar)',
      category: 'Agent Setting',
      badge: 'Visual Model',
      description: 'Menentukan rasio aspek (16:9, 4:3, 1:1, 3:4, 9:16), jumlah variasi hasil sekaligus (1x, x2, x3, x4), dan jenis model image generator.',
      keyFeatures: [
        'Pilihan model unggulan: 🍌 Nano Banana 2 & Imagen 3',
        'Variasi rasio sesuai platform target (16:9 Youtube, 9:16 TikTok/Reels)',
        'Mode generasi simultan hingga 4 variasi gambar per prompt'
      ],
      howToUse: 'Sesuaikan rasio aspek ke 16:9 untuk presentasi atau 9:16 untuk konten ponsel.',
      actionButtonText: '⚙️ Simpan Setting Gambar'
    },
    'Video generation default': {
      title: 'Video Generation Default (Pengaturan Default Video)',
      category: 'Agent Setting',
      badge: 'Video Model',
      description: 'Konfigurasi bawaan untuk pembuatan video animasi AI, mencakup pilihan rasio aspek, jumlah klip per prompt, dan mesin utama video (Omni Flash).',
      keyFeatures: [
        'Model Omni Flash: Generasi animasi cepat dengan pergerakan fisika alami',
        'Pergerakan kamera otomatis dan pencahayaan dinamis',
        'Pilihan output landscape (16:9) atau portrait (9:16)'
      ],
      howToUse: 'Pilih Omni Flash dan rasio 16:9 untuk kualitas sinematik terbaik.',
      actionButtonText: '⚙️ Simpan Setting Video'
    },

    // View Mode & Filter
    'View Mode Settings': {
      title: 'View Mode & Filter Gallery (Pengaturan Tampilan Galeri)',
      category: 'Interface Filter',
      badge: 'Layout Control',
      description: 'Modal pengaturan tata letak galeri Google Flow. Mengatur mode Grid/Batch, ukuran ubin (S/M/L), efek audio saat kursor diarahkan, serta detail prompt.',
      keyFeatures: [
        'Modus "Grid" untuk lanskap visual luas vs "Batch" untuk bundel proyek',
        'Fitur "Sound on hover" untuk mendengarkan audio klip saat kursor diarahkan',
        'Pengaturan "Clear prompt on submit" untuk kemudahan pembaruan prompt'
      ],
      howToUse: 'Klik ikon filter di samping kolom pencarian atas untuk mengatur kenyamanan tampilan galeri.',
      actionButtonText: '🎛️ Terapkan Pengaturan Tampilan'
    },

    // More Options Menu Items
    'Download Project': {
      title: 'Download Project (Unduh Seluruh Proyek)',
      category: 'More Options',
      badge: '⋮ Menu',
      description: 'Mengekspor seluruh aset gambar, video, dan berkas skrip proyek "Captain Maxy 04" ke dalam satu arsip ZIP siap pakai.',
      keyFeatures: [
        'Unduh file resolusi penuh tanpa kompresi berlebihan',
        'Termasuk file metadata prompt dan informasi seed karakter',
        'Sangat efisien untuk pengarsipan tim Maxy Academy'
      ],
      howToUse: 'Pilih dari menu "⋮" di pojok kanan atas untuk mengunduh proyek.',
      actionButtonText: '💾 Unduh Proyek ZIP'
    },
    'Flow Help Center': {
      title: 'Flow Help Center & TV (Pusat Bantuan & Tutorial)',
      category: 'More Options',
      badge: '⋮ Menu',
      description: 'Akses ke dokumentasi resmi, panduan langkah demi langkah, video tutorial Flow TV, dan informasi pembaruan versi (changelog).',
      keyFeatures: [
        'Panduan lengkap teknik prompting video AI sinematik',
        'Video contoh dari pakar pembuat film AI internasional',
        'Saluran umpan balik langsung ke pengembang Google Flow'
      ],
      howToUse: 'Klik untuk membaca tips dan panduan resmi pembuatan animasi AI.',
      actionButtonText: '📚 Buka Help Center'
    }
  };

  // Trigger prompt submit simulation
  const handleSendPrompt = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    const newPrompt = promptInput;
    setPromptInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          text: `Pembuatan video baru berdasarkan instruksi "${newPrompt}" telah dijadwalkan secara otomatis oleh Agent Omni Flash. Klip adegan Captain Maxy sedang dirender dalam antrean!`,
        }
      ]);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Device Mode Toggle & Quick Help Banner */}
      <div className="bg-[#12151e] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-slate-900 dark:text-white font-bold shadow-lg shadow-indigo-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Google Flow Interactive Replica
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Studio Mode
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uji pengalaman Studio Google Flow resmi untuk proyek animasi <span className="text-amber-300 font-semibold">Maxy Academy</span>. Klik setiap tombol untuk penjelasan modal!
            </p>
          </div>
        </div>

        {/* View Switcher: Desktop vs Mobile */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              deviceMode === 'desktop'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            💻 Desktop View
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              deviceMode === 'mobile'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            📱 Mobile View
          </button>
        </div>
      </div>

      {/* REPLICA WRAPPER CONTAINER */}
      <div className={`mx-auto transition-all duration-300 ${deviceMode === 'mobile' ? 'max-w-sm border-8 border-slate-200 dark:border-slate-900 rounded-[36px] shadow-2xl bg-black p-1' : 'w-full'}`}>
        <div className="bg-[#0b0d14] text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden min-h-[640px] flex flex-col font-sans relative">
          
          {/* TOP HEADER BAR */}
          <div className="bg-[#12151e]/90 border-b border-slate-200 dark:border-slate-800/80 px-3 py-2.5 flex items-center justify-between gap-2 z-20 shrink-0">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setExplanationModal(featureExplanations['All Media'])}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                title="Kembali ke Dashboard Proyek"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm tracking-wide">
                  Captain Maxy 04
                </span>
                <button 
                  onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                  className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle: Search Bar with Filter/View Mode Button */}
            <div className="flex-1 max-w-md mx-2">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-slate-500 dark:text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search media..."
                  className="w-full bg-[#1c212e] border border-slate-200 dark:border-slate-800/80 rounded-xl pl-9 pr-9 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="absolute right-2 p-1 text-slate-500 dark:text-slate-400 hover:text-amber-300 rounded hover:bg-slate-100 dark:bg-slate-800/60"
                  title="View Mode & Filter Settings"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Actions Top Bar */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Add Media / Create button */}
              <div className="relative">
                <button
                  onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 transition-colors flex items-center justify-center"
                  title="Create Media, Collection, Character"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Create Dropdown Menu (Image 2 & Image 8) */}
                <AnimatePresence>
                  {showCreateDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-10 w-48 bg-[#181c28] border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 space-y-0.5"
                    >
                      <button
                        onClick={() => {
                          setShowCreateDropdown(false);
                          setExplanationModal(featureExplanations['Upload media']);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-blue-400" />
                        <span>Upload media</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateDropdown(false);
                          setExplanationModal(featureExplanations['Create Collection']);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <FolderPlus className="w-4 h-4 text-amber-400" />
                        <span>Create Collection</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateDropdown(false);
                          setExplanationModal(featureExplanations['Create Character']);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-emerald-400" />
                        <span>Create Character</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateDropdown(false);
                          setExplanationModal(featureExplanations['Create Scene']);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <Clapperboard className="w-4 h-4 text-purple-400" />
                        <span>Create Scene</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Help Button */}
              <button
                onClick={() => setExplanationModal(featureExplanations['Flow Help Center'])}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 transition-colors"
                title="Help & Flow Center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Agent Settings Button */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 transition-colors"
                title="Agent Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* More Vertical Options */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 transition-colors"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* More Options Dropdown Menu (Image 4 & Image 9) */}
                <AnimatePresence>
                  {showMoreDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-10 w-52 bg-[#181c28] border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 space-y-0.5 text-xs"
                    >
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          setExplanationModal(featureExplanations['Download Project']);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-400" />
                        <span>Download Project</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          setExplanationModal(featureExplanations['Flow Help Center']);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Product Help</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          setExplanationModal(featureExplanations['Flow Help Center']);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Flow Help Center</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          alert('Maxy Academy Google Flow Changelog Versi 2.4 Active!');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        <span>View all changelogs</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          alert('Membuka Flow TV Showcase!');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <Tv className="w-3.5 h-3.5 text-rose-400" />
                        <span>Flow TV</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          alert('Google Flow Studio Powered by Gemini & Veo Models for Maxy Academy');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                        <span>About Flow</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          setExplanationModal(featureExplanations['Flow Help Center']);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Learn Flow</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          alert('Umpan balik telah dikirim ke tim Maxy Academy!');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Send app feedback</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreDropdown(false);
                          alert('Privacy & Legal Notice Maxy Academy AI Studio');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 hover:text-slate-900 dark:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>Privacy Notice</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Avatar - Maxy Academy */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Maxy Academy User"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50 cursor-pointer"
                  onClick={() => alert('Maxy Academy Profile Admin')}
                />
              </div>
            </div>
          </div>

          {/* MAIN BODY WORKSPACE */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* LEFT NAVIGATION SIDEBAR (Desktop & Mobile Drawer) */}
            <div className={`${deviceMode === 'mobile' ? 'w-14 border-r border-slate-200 dark:border-slate-800/80 bg-[#0d1017]' : 'w-48 border-r border-slate-200 dark:border-slate-800/80 bg-[#0d1017] hidden md:flex'} flex-col justify-between py-3 shrink-0`}>
              {/* Navigation List */}
              <div className="space-y-1 px-2">
                {[
                  { name: 'All Media', icon: LayoutGrid, count: 6 },
                  { name: 'Images', icon: ImageIcon, count: 4 },
                  { name: 'Videos', icon: Video, count: 2 },
                  { name: 'Characters', icon: User, count: 1 },
                  { name: 'Scenes', icon: Film, count: 3 },
                  { name: 'Uploads', icon: Upload, count: 0 },
                  { name: 'Tools', icon: Wand2 },
                  { name: 'Trash', icon: Trash2 },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeSidebarTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveSidebarTab(item.name);
                        if (featureExplanations[item.name]) {
                          setExplanationModal(featureExplanations[item.name]);
                        }
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#1e2436] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700/60 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/40'
                      }`}
                      title={item.name}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                        {deviceMode === 'desktop' && <span>{item.name}</span>}
                      </div>
                      {deviceMode === 'desktop' && item.count !== undefined && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Bottom Notice */}
              {deviceMode === 'desktop' && (
                <div className="px-3 pt-3 border-t border-slate-200 dark:border-slate-800/60 space-y-2">
                  <button
                    onClick={() => setExplanationModal(featureExplanations['All Media'])}
                    className="w-full text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:bg-slate-800/50"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                    <span>Collapse</span>
                  </button>
                  <p className="text-[10px] text-slate-500 leading-tight px-1">
                    Google Flow can make mistakes, so double check it
                  </p>
                </div>
              )}
            </div>

            {/* CENTER GALLERY GRID (Image 1 reference) */}
            <div className="flex-1 bg-[#0b0d14] p-3 sm:p-4 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                
                {/* Tile 1: Warehouse pallets with boxes (Portrait Video) */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 aspect-[9/16] max-h-[260px] sm:max-h-[320px]">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                    alt="Warehouse Pallets"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-900 dark:text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-md p-2 rounded-xl text-[10px] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-bold text-amber-300 block">Adegan 1: Gudang Logistik</span>
                    <span>Whip-pan kamera dari tumpukan kardus.</span>
                  </div>
                </div>

                {/* Tile 2: Gabungan Collection Card (City/Monas with Indonesia Flags) */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 aspect-[9/16] max-h-[260px] sm:max-h-[320px] flex flex-col justify-between p-3">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-slate-900/60 to-transparent z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=600&q=80"
                    alt="Jakarta Skyline Monas"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-20 flex items-center justify-between">
                    <span className="p-1.5 rounded-lg bg-black/60 text-slate-900 dark:text-white backdrop-blur-md">
                      <Film className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                      Gabungan Proyek
                    </span>
                  </div>

                  <div className="relative z-20 space-y-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Gabungan</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                        <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=100&q=80" alt="thumb1" className="w-full h-full object-cover" />
                      </div>
                      <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="thumb2" className="w-full h-full object-cover" />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-amber-300">
                        +1
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tile 3: Captain Maxy in warehouse with boxes */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 aspect-[9/16] max-h-[260px] sm:max-h-[320px]">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                    alt="Captain Maxy Character"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-900 dark:text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-md p-2 rounded-xl text-[10px] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800/60">
                    <span className="font-bold text-emerald-300 block">Captain Maxy (Logistics)</span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">Character Anchor Active</span>
                  </div>
                </div>

                {/* Tile 4: Captain Maxy in High-Tech Briefing Room */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 aspect-[9/16] max-h-[260px] sm:max-h-[320px]">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
                    alt="Captain Maxy Briefing Room"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-900 dark:text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-md p-2 rounded-xl text-[10px] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800/60">
                    <span className="font-bold text-blue-300 block">Briefing Room Command</span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">Seamless Whip-pan Transition</span>
                  </div>
                </div>

                {/* Tile 5: Captain Maxy Portrait Close-up */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 aspect-[9/16] max-h-[260px] sm:max-h-[320px]">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
                    alt="Captain Maxy Close-up"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-900 dark:text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                </div>

                {/* Tile 6: Monas City View */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 aspect-[9/16] max-h-[260px] sm:max-h-[320px]">
                  <img
                    src="https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=600&q=80"
                    alt="Monas Landscape"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-900 dark:text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT AGENT CHAT PANEL (Matches Image 1 & Image 6) */}
            <div className={`${deviceMode === 'mobile' ? 'hidden' : 'w-80 border-l border-slate-200 dark:border-slate-800/80 bg-[#0f121a]'} flex flex-col justify-between shrink-0 z-10`}>
              {/* Agent Panel Header */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="p-1 rounded text-slate-500 dark:text-slate-400">
                    <LayoutGrid className="w-4 h-4" />
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    Seamless Character Ani...
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3 text-xs leading-relaxed">
                {/* Generated Media Thumbnail */}
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-video relative group">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-8 h-8 text-slate-900 dark:text-white fill-white/80" />
                  </div>
                </div>

                {/* Messages */}
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-[#181c28] p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed space-y-1">
                    <p>{msg.text}</p>
                  </div>
                ))}

                {isGenerating && (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-[11px] text-indigo-300 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Agent Omni Flash sedang merender adegan...</span>
                  </div>
                )}

                {/* Message Feedback Action Bar */}
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 pt-1 px-1">
                  <button className="hover:text-slate-900 dark:text-white"><ThumbsUp className="w-3.5 h-3.5" /></button>
                  <button className="hover:text-slate-900 dark:text-white"><ThumbsDown className="w-3.5 h-3.5" /></button>
                  <button className="hover:text-slate-900 dark:text-white"><Copy className="w-3.5 h-3.5" /></button>
                  <button className="hover:text-slate-900 dark:text-white"><Flag className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* Bottom Prompt Input Area */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-[#12151e] space-y-2">
                <div className="relative bg-[#1a1f2c] border border-slate-300 dark:border-slate-700/80 rounded-2xl p-2.5 space-y-2">
                  <textarea
                    rows={2}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendPrompt();
                      }
                    }}
                    placeholder="What do you want to create?"
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none"
                  />

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <button 
                        onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                        className="p-1 hover:text-slate-900 dark:text-white rounded"
                        title="Add reference file"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setShowSettingsModal(true)}
                        className="p-1 hover:text-slate-900 dark:text-white rounded"
                        title="Prompt script editor"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setShowFilterModal(true)}
                        className="p-1 hover:text-slate-900 dark:text-white rounded"
                        title="Generation parameters"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleSendPrompt}
                      disabled={!promptInput.trim() || isGenerating}
                      className={`p-1.5 rounded-xl transition-all ${
                        promptInput.trim()
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* MODAL 1: AGENT SETTINGS MODAL (Image 5 & Image 7) */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-[#181c28] border border-slate-300 dark:border-slate-700 rounded-3xl overflow-hidden shadow-2xl text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Agent settings</span>
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Settings Form */}
              <div className="p-5 space-y-6 overflow-y-auto text-xs">
                
                {/* Section 1: Confirm before generating */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-200">Confirm before generating</span>
                    <button
                      onClick={() => setExplanationModal(featureExplanations['Confirm before generating'])}
                      className="text-amber-400 hover:underline text-[10px] flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" /> Info
                    </button>
                  </div>

                  <div className="bg-[#12151e] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="confirm"
                        checked={confirmBeforeGenerating === 'Always'}
                        onChange={() => setConfirmBeforeGenerating('Always')}
                        className="mt-0.5 accent-blue-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Always</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug block">
                          Agent will ask for confirmation before generating media.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer border-t border-slate-200 dark:border-slate-800/80 pt-2.5">
                      <input
                        type="radio"
                        name="confirm"
                        checked={confirmBeforeGenerating === 'Never'}
                        onChange={() => setConfirmBeforeGenerating('Never')}
                        className="mt-0.5 accent-blue-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Never</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug block">
                          Agent will generate media and spend credits automatically.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section 2: Image generation default */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-200">Image generation default</span>
                    <button
                      onClick={() => setExplanationModal(featureExplanations['Image generation default'])}
                      className="text-amber-400 hover:underline text-[10px] flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" /> Info
                    </button>
                  </div>

                  {/* Aspect Ratio Selector */}
                  <div className="grid grid-cols-5 gap-1.5 bg-[#12151e] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {['16:9', '4:3', '1:1', '3:4', '9:16'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setImageAspectRatio(ratio)}
                        className={`py-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 ${
                          imageAspectRatio === ratio
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 shadow'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="w-4 h-2.5 border border-current rounded-sm" />
                        <span>{ratio}</span>
                      </button>
                    ))}
                  </div>

                  {/* Batch Selector */}
                  <div className="grid grid-cols-4 gap-1.5 bg-[#12151e] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {['1x', 'x2', 'x3', 'x4'].map((batch) => (
                      <button
                        key={batch}
                        onClick={() => setImageBatchCount(batch)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                          imageBatchCount === batch
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {batch}
                      </button>
                    ))}
                  </div>

                  {/* Model Dropdown */}
                  <select
                    value={imageModel}
                    onChange={(e) => setImageModel(e.target.value)}
                    className="w-full bg-[#12151e] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="Nano Banana 2">🍌 Nano Banana 2</option>
                    <option value="Imagen 3 High-Res">✨ Imagen 3 High-Res</option>
                  </select>
                </div>

                {/* Section 3: Video generation default */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-200">Video generation default</span>
                    <button
                      onClick={() => setExplanationModal(featureExplanations['Video generation default'])}
                      className="text-amber-400 hover:underline text-[10px] flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" /> Info
                    </button>
                  </div>

                  {/* Aspect Ratio Selector */}
                  <div className="grid grid-cols-2 gap-2 bg-[#12151e] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {['16:9', '9:16'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setVideoAspectRatio(ratio)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          videoAspectRatio === ratio
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="w-4 h-2.5 border border-current rounded-sm" />
                        <span>{ratio}</span>
                      </button>
                    ))}
                  </div>

                  {/* Batch Selector */}
                  <div className="grid grid-cols-4 gap-1.5 bg-[#12151e] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {['1x', 'x2', 'x3', 'x4'].map((batch) => (
                      <button
                        key={batch}
                        onClick={() => setVideoBatchCount(batch)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                          videoBatchCount === batch
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {batch}
                      </button>
                    ))}
                  </div>

                  {/* Model Dropdown */}
                  <select
                    value={videoModel}
                    onChange={(e) => setVideoModel(e.target.value)}
                    className="w-full bg-[#12151e] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="Omni Flash">Omni Flash (High Frame Rate)</option>
                    <option value="Veo 2 Cinematic">Veo 2 Cinematic AI</option>
                  </select>
                </div>

              </div>

              {/* Bottom Action */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-[#12151e]">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs shadow-lg transition-all"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: FILTER & VIEW MODE MODAL (Image 3) */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#181c28] border border-slate-300 dark:border-slate-700 rounded-3xl p-5 space-y-5 text-slate-800 dark:text-slate-100 shadow-2xl text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" /> View Mode & Filter
                </span>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* View Mode */}
              <div className="space-y-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium block">View Mode</span>
                <div className="grid grid-cols-2 gap-2 bg-[#12151e] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setViewMode('Grid')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-2 ${
                      viewMode === 'Grid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode('Batch')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-2 ${
                      viewMode === 'Batch' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Layers className="w-4 h-4" /> Batch
                  </button>
                </div>
              </div>

              {/* Grid Size */}
              <div className="space-y-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium block">Grid Size</span>
                <div className="grid grid-cols-3 gap-2 bg-[#12151e] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold">
                  {(['S', 'M', 'L'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size)}
                      className={`py-2 rounded-xl ${
                        gridSize === size ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Sound on hover</span>
                  <button
                    onClick={() => setSoundOnHover(!soundOnHover)}
                    className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                      soundOnHover ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {soundOnHover ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Return silent videos</span>
                  <button
                    onClick={() => setReturnSilentVideos(!returnSilentVideos)}
                    className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                      returnSilentVideos ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {returnSilentVideos ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Show tile details</span>
                  <button
                    onClick={() => setShowTileDetails(!showTileDetails)}
                    className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                      showTileDetails ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {showTileDetails ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Clear prompt on submit</span>
                  <button
                    onClick={() => setClearPromptOnSubmit(!clearPromptOnSubmit)}
                    className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                      clearPromptOnSubmit ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {clearPromptOnSubmit ? 'On' : 'Off'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Terapkan Filter
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: EXPLANATION MODAL (ChatGPT Simulator style for every single feature) */}
      <AnimatePresence>
        {explanationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-[#181c28] border border-slate-300 dark:border-slate-700 rounded-3xl p-6 space-y-5 text-slate-800 dark:text-slate-100 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
                      {explanationModal.badge}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{explanationModal.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    {explanationModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setExplanationModal(null)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-[#12151e] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                {explanationModal.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Keunggulan Utama Fitur:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {explanationModal.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-2xl space-y-1 text-xs">
                <span className="font-bold text-indigo-300 block">💡 Panduan Penggunaan Maxy Academy:</span>
                <p className="text-slate-600 dark:text-slate-300">{explanationModal.howToUse}</p>
              </div>

              {explanationModal.actionButtonText && (
                <button
                  onClick={() => {
                    alert(`Fitur "${explanationModal.title}" siap digunakan di Google Flow Maxy Academy!`);
                    setExplanationModal(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 dark:text-white font-extrabold text-xs shadow-lg transition-all border border-blue-400/40"
                >
                  {explanationModal.actionButtonText}
                </button>
              )}

              <button
                onClick={() => setExplanationModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all border border-slate-300 dark:border-slate-700"
              >
                Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
