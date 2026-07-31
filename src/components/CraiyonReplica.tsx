import React, { useState } from 'react';
import {
  Pencil, Palette, Sparkles, Image as ImageIcon, Search, Lock, User,
  Globe, Shield, ChevronDown, Plus, Download, RefreshCw, X, Menu,
  Layers, Settings, HelpCircle, Flame, ArrowUp, LayoutGrid, Clock,
  Folder, Home, Frame, Scissors, Check, Info, Smartphone, Monitor, AlertTriangle
} from 'lucide-react';

interface InfoModalData {
  title: string;
  category: string;
  badge: string;
  description: string;
  keyFeatures: string[];
  howToUse: string;
}

interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: string;
  provider?: string;
}

const INSPIRATIONS_DATA = [
  {
    id: 'insp-1',
    prompt: 'A cute fox with a red hat in a fairytale autumn forest',
    style: 'Art Style',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-2',
    prompt: 'Alien monster vs green giant in apocalyptic thunderstorm city',
    style: 'Cinematic 8K',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-3',
    prompt: 'Wise alien master riding a custom chopper motorcycle in desert sunset',
    style: 'Photorealistic',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-4',
    prompt: 'CTO Maxy Academy coding in cafe with snow background',
    style: 'Digital Art',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-5',
    prompt: 'Futuristic cyberpunk neon city with flying vehicles and rainy glass reflections',
    style: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'insp-6',
    prompt: 'Minimalist vector logo for Maxy Academy tech startup with glowing gradients',
    style: 'Logo Design',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
];

export const CraiyonReplica: React.FC = () => {
  // Device Mode State: 'desktop' | 'mobile'
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Active Tab State (Inspirations / Recents)
  const [activeTab, setActiveTab] = useState<'inspirations' | 'recents'>('inspirations');

  // Image Suite Active Sub-menu
  const [selectedSuite, setSelectedSuite] = useState<string>('image');

  // Input Prompt State
  const [promptText, setPromptText] = useState<string>(
    'make an image about CTO Maxy Academy coding in the cafe with snow background'
  );

  // Excluded Words (Negative Prompt) State
  const [excludedWords, setExcludedWords] = useState<string>('blurry, distorted, low resolution, bad anatomy');
  const [showExcludedInput, setShowExcludedInput] = useState<boolean>(false);

  // Style Preset State ('auto' | 'art' | 'drawing' | 'photo')
  const [stylePreset, setStylePreset] = useState<'auto' | 'art' | 'drawing' | 'photo'>('auto');

  // Aspect Ratio State ('auto' | '1:1' | '16:9' | '9:16')
  const [aspectRatio, setAspectRatio] = useState<'auto' | '1:1' | '16:9' | '9:16'>('auto');

  // Privacy State (Public / Private)
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // Generating & Error Handling State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Toast Notification State
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Current Generated Result
  const [generatedResult, setGeneratedResult] = useState<GeneratedImageItem | null>(null);

  // Recents History Array State
  const [recents, setRecents] = useState<GeneratedImageItem[]>([]);

  // Search Filter for Inspirations/Recents
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Active Modal Popup State
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);

  // Modal Info Registry for All Craiyon Buttons and Menus
  const infoDictionary: Record<string, InfoModalData> = {
    'image-suite-image': {
      title: 'Image Suite - General Generator',
      category: 'Image Suite',
      badge: 'Core Engine',
      description: 'Fitur utama Craiyon untuk menghasilkan berbagai macam ilustrasi, lukisan digital, karya seni fotorealistis, dan gambar visual dari instruksi teks bebas.',
      keyFeatures: [
        'Generasi gambar menggunakan Gemini / Imagen AI API',
        'Algoritma neural network pemrosesan bahasa alami modern',
        'Fleksibilitas gaya tanpa batasan topik'
      ],
      howToUse: 'Pilih opsi "Image", ketik deskripsi visual pada kotak prompt, lalu klik tombol panah oranye untuk merender.'
    },
    'image-suite-logo': {
      title: 'Logo Generator AI',
      category: 'Image Suite',
      badge: 'Branding Tool',
      description: 'Modul khusus untuk menciptakan ide logo vektor, maskot perusahaan, simbol bisnis, dan identitas visual merek secara cepat.',
      keyFeatures: [
        'Optimalisasi komposisi latar belakang bersih (clean background)',
        'Fokus pada garis tegas dan elemen simbolik',
        'Inspirasi konsep logo untuk Maxy Academy dan startup'
      ],
      howToUse: 'Klik tab "Logo", masukkan kata kunci nama usaha dan gaya desain (misal: "Minimalist tech logo for Maxy Academy"), lalu klik Generate.'
    },
    'image-suite-anime': {
      title: 'Anime & Manga Style AI',
      category: 'Image Suite',
      badge: 'Illustration',
      description: 'Pengatur gaya khusus yang memaksa mesin AI merender gambar dalam estetika animasi Jepang, manga cell-shading, dan seni komik 2D.',
      keyFeatures: [
        'Garis kontur khas lukisan anime modern',
        'Pencahayaan dramatis gaya Makoto Shinkai',
        'Pengenalan ekspresi mata dan gestur karakter anime'
      ],
      howToUse: 'Klik "Anime", tulis deskripsi adegan atau karakter yang Anda inginkan, dan dapatkan gambar bergaya anime secara instan.'
    },
    'image-suite-tattoo': {
      title: 'Tattoo Design Generator',
      category: 'Image Suite',
      badge: 'Creative Specialty',
      description: 'Fitur generator sketsa tato dengan kontur hitam-putih presisi, gaya neo-traditional, tribal, watercolor, atau stippling.',
      keyFeatures: [
        'Garis luar tebal (bold line art) yang siap dipakai sebagai stensil tato',
        'Pilihan kontras tinggi untuk pemisahan tinta yang jelas',
        'Eksplorasi simbolisme dan pola geometris'
      ],
      howToUse: 'Pilih "Tattoo", masukkan subjek tato (misal: "Phoenix bird tribal tattoo stencil"), lalu jalankan AI.'
    },
    'image-suite-homedesign': {
      title: 'Home & Interior Design AI',
      category: 'Image Suite',
      badge: 'Architecture',
      description: 'Asisten desainer interior visual untuk membuat konsep tata ruang rumah, dekorasi kamar, ruang kerja minimalis, dan gaya arsitektur.',
      keyFeatures: [
        'Pencahayaan ruang realistis dengan pencahayaan alami jendela',
        'Penataan furnitur modern, skandinavia, atau industrial',
        'Visualisasi suasana ruangan sebelum renovasi nyata'
      ],
      howToUse: 'Klik "Home design", tulis konsep ruangan (misal: "Modern Japandi studio desk setup with warm wooden lighting"), lalu render.'
    },
    'image-suite-poster': {
      title: 'Poster & Graphic Art Creator',
      category: 'Image Suite',
      badge: 'Marketing Art',
      description: 'Alat pembuat tata letak poster komersial, sampul buku, flyer acara, dan grafis promosi berkepadatan visual tinggi.',
      keyFeatures: [
        'Komposisi simetris cocok untuk judul dan teks tajam',
        'Penggabungan elemen abstrak dan fotografi profesional',
        'Dukungan gaya vintage, retrowave, atau pameran seni'
      ],
      howToUse: 'Pilih "Poster", ketik tema poster Anda (misal: "Cyberpunk AI Conference Poster for Maxy Academy"), lalu tekan Generate.'
    },
    'image-suite-bgremover': {
      title: 'AI Background Remover',
      category: 'Image Suite',
      badge: 'Utility Tool',
      description: 'Fitur penghapus latar belakang otomatis yang memisahkan objek utama dari background menjadi berkas PNG transparan secara presisi.',
      keyFeatures: [
        'Deteksi tepi objek pintar berakurasi tinggi',
        'Penghapusan latar belakang satu klik tanpa pengeditan manual',
        'Siap diintegrasikan ke materi pemasaran atau presentasi'
      ],
      howToUse: 'Unggah gambar hasil render atau foto Anda, klik "Remove Background", lalu unduh hasilnya bertipe PNG.'
    },
    'menu-studio': {
      title: 'Craiyon Studio (Canvas Editor)',
      category: 'Studio',
      badge: 'NEW Feature',
      description: 'Workspace pengeditan kanvas tingkat lanjut tempat Anda dapat menggabungkan beberapa generasi gambar, melakukan inpainting, dan penyuntingan layer.',
      keyFeatures: [
        'Ruang kerja multiversi gambar interaktif',
        'Penyuntingan parsial (Inpainting & Outpainting)',
        'Alat gabung gambar untuk pembuatan komposisi visual kompleks'
      ],
      howToUse: 'Klik "Studio (New)" untuk berpindah dari generator cepat ke ruang kanvas penyuntingan profesional.'
    },
    'menu-imagesearch': {
      title: 'AI Image Search & Prompt Finder',
      category: 'Discovery',
      badge: 'Prompt Database',
      description: 'Mesin pencari jutaan hasil gambar buatan komunitas Craiyon beserta teks prompt asli yang digunakan untuk membuatnya.',
      keyFeatures: [
        'Pencarian berdasarkan kata kunci visual atau ide konsep',
        'Salin teks prompt asli untuk dimodifikasi ulang',
        'Rekomendasi tak terhingga untuk memicu inspirasi baru'
      ],
      howToUse: 'Gunakan bilah pencarian "Image Search" di menu samping atau di atas galeri untuk menemukan hasil karya buatan pengguna lain.'
    },
    'menu-myimages': {
      title: 'My Images (Galeri Saya)',
      category: 'Account & Assets',
      badge: 'Cloud Storage',
      description: 'Pusat penyimpanan pribadi untuk semua gambar yang telah Anda sukai, tandai, atau simpan ke dalam koleksi akun Anda.',
      keyFeatures: [
        'Akses cepat ke gambar favorit tanpa risiko terhapus',
        'Pengelompokan folder berdasarkan proyek atau ide',
        'Unduhan masal beresolusi tinggi'
      ],
      howToUse: 'Klik "My images" untuk membuka daftar koleksi gambar yang telah Anda favoritkan selama sesi pembuatan.'
    },
    'menu-history': {
      title: 'Generation History (Riwayat Prompt)',
      category: 'Account & Assets',
      badge: 'Activity Log',
      description: 'Catatan kronologis semua percobaan prompt dan hasil generasi gambar yang pernah Anda hasilkan di Craiyon.',
      keyFeatures: [
        'Pencatatan tanggal, jam, dan variasi prompt',
        'Kemampuan memuat kembali prompt lama hanya dengan satu klik',
        'Penyimpanan otomatis agar ide penting tidak pernah hilang'
      ],
      howToUse: 'Buka tab "History" di menu samping untuk meninjau kembali eksperimen prompt sebelumnya.'
    },
    'menu-settings': {
      title: 'Account Settings (Pengaturan)',
      category: 'Account & Assets',
      badge: 'Preferences',
      description: 'Panel konfigurasi akun pengguna untuk mengelola profil Maxy Academy, preferensi kualitas gambar bawaan, dan metode pembayaran.',
      keyFeatures: [
        'Pengaturan tingkat privasi bawaan (Public vs Private)',
        'Manajemen langganan Pro dan batas kuota tanpa iklan',
        'Kunci bahasa antarmuka (English / Indonesia)'
      ],
      howToUse: 'Klik ikon roda gigi "Settings" untuk memperbarui profil atau menyesuaikan preferensi pemrosesan gambar.'
    },
    'menu-help': {
      title: 'Help & FAQ Center',
      category: 'Support',
      badge: 'Dokumentasi',
      description: 'Pusat bantuan interaktif berisi jawaban atas pertanyaan umum, tips menghindari kata terlarang, dan panduan teknis.',
      keyFeatures: [
        'Panduan mengatasi kendala generasi gagal atau lambat',
        'Kebijakan penggunaan komersial hak cipta gambar AI',
        'Layanan dukungan langsung untuk pengguna Pro'
      ],
      howToUse: 'Klik "Help" untuk membaca panduan troubleshooting dan kebijakan hak cipta gambar.'
    },
    'menu-upgradepro': {
      title: 'Upgrade to Craiyon Pro',
      category: 'Subscription',
      badge: 'Premium Plan',
      description: 'Paket berlangganan berbayar untuk menghilangkan iklan, mempercepat waktu render hingga 15 detik, serta membuka fitur unduh 4K tanpa watermark.',
      keyFeatures: [
        'Generasi super cepat (prioritas server teratas)',
        'Privasi penuh (mode generasi rahasia / Private mode)',
        'Bebas dari iklan dan batasan kuota antrean'
      ],
      howToUse: 'Klik tombol oranye "Upgrade to Pro" untuk memilih paket bulanan atau tahunan dengan keunggulan penuh.'
    },
    'control-uploadref': {
      title: 'Upload Reference Image',
      category: 'Prompt Control',
      badge: 'Image-to-Image',
      description: 'Fungsi unggah gambar acuan (Reference Image) untuk memandu skema warna, komposisi, atau bentuk objek utama kepada AI Craiyon.',
      keyFeatures: [
        'Menggunakan struktur visual gambar asli sebagai gambaran dasar',
        'Penggabungan panduan foto dengan instruksi teks baru',
        'Memudahkan pembuatan variasi bergaya sama'
      ],
      howToUse: 'Klik ikon gambar dengan tanda tambah (+) di sudut kanan kotak prompt, lalu pilih file foto acuan dari perangkat Anda.'
    },
    'control-public': {
      title: 'Public vs Private Generation Toggle',
      category: 'Privacy Control',
      badge: 'Data Security',
      description: 'Tombol sakelar untuk menentukan apakah hasil generasi gambar Anda akan ditampilkan secara terbuka di galeri komunitas atau dirahasiakan.',
      keyFeatures: [
        'Mode Public (Gratis): Gambar akan masuk ke database galeri publik Craiyon',
        'Mode Private (Pro): Gambar hanya dapat dilihat dan diunduh oleh akun Anda',
        'Penguncian kerahasiaan untuk proyek bisnis atau aset merek'
      ],
      howToUse: 'Klik tombol "Public" untuk mengubah status menjadi "Private" (memerlukan akun Craiyon Pro).'
    },
    'control-style': {
      title: 'AI Style Selector (Auto, Art, Drawing, Photo)',
      category: 'Style Control',
      badge: 'Visual Model',
      description: 'Pilihan opsi filter gaya utama yang memaksa model kecerdasan buatan menekankan teknik rendering visual tertentu.',
      keyFeatures: [
        'Auto: AI memilih gaya terbaik berdasarkan kata kunci prompt',
        'Art: Lukisan minyak digital, cat air, dan karya seni ekspresif',
        'Drawing: Sketsa pensil, ilustrasi vektor, dan gambar garis',
        'Photo: Fotografi realistis dengan detail lensa kamera dan bayangan nyata'
      ],
      howToUse: 'Klik tombol gaya (Auto/Art/Drawing/Photo) di dalam kotak prompt untuk mengunci pendekatan estetika yang diinginkan.'
    },
    'control-aspect': {
      title: 'Aspect Ratio Selector',
      category: 'Canvas Control',
      badge: 'Dimensions',
      description: 'Pengatur proporsi dimensi kanvas gambar (Square 1:1, Landscape 16:9, Portrait 9:16) untuk disesuaikan dengan kebutuhan media sosial.',
      keyFeatures: [
        '1:1 (Square): Cocok untuk feeds Instagram dan profil',
        '16:9 (Landscape): Sangat baik untuk YouTube thumbnail dan banner web',
        '9:16 (Portrait): Ideal untuk TikTok, Reels, dan WhatsApp Status'
      ],
      howToUse: 'Klik opsi "Auto" untuk memilih aspek rasio tertentu sebelum mengklik Generate.'
    },
    'control-excluded': {
      title: 'Excluded Words (Negative Prompting)',
      category: 'Quality Control',
      badge: 'Filter Terlarang',
      description: 'Fitur penting untuk mendaftarkan kata-kata atau elemen yang HARUS DIBUANG dari hasil gambar (misal: blurry, noise, text, watermark).',
      keyFeatures: [
        'Mencegah munculnya cacat visual seperti jari berlebih atau teks acak',
        'Meningkatkan kebersihan dan ketajaman hasil render',
        'Meningkatkan kontrol presisi pengguna terhadap AI'
      ],
      howToUse: 'Klik tombol "Excluded" untuk membuka bilah input kata terlarang, lalu masukkan elemen yang ingin dihindari dipisahkan dengan koma.'
    },
    'control-generate': {
      title: 'Orange Generate Action Button',
      category: 'Execution Engine',
      badge: 'Render Button',
      description: 'Tombol eksekusi utama berwarna oranye dengan ikon panah melingkar/ke atas yang memicu pengolahan prompt oleh kluster AI Craiyon.',
      keyFeatures: [
        'Mengirimkan seluruh instruksi teks, gaya, dan aturan terlarang ke mesin AI',
        'Memproses generasi gambar resolusi tinggi via Gemini / Imagen API',
        'Umpan balik indikator pemrosesan waktu nyata (real-time progress bar)'
      ],
      howToUse: 'Setelah memasukkan prompt dan mengatur opsi, klik tombol lingkaran oranye besar ini untuk memulai pembuatan seni visual.'
    },
    'tab-inspirations': {
      title: 'Inspirations Gallery Tab',
      category: 'Community Hub',
      badge: 'Trending Art',
      description: 'Tab kurasi yang menampilkan karya-karya terbaik dan paling populer yang dibuat oleh para kreator komunitas Craiyon secara global.',
      keyFeatures: [
        'Inspirasi beragam gaya seni dari jutaan pengguna Craiyon',
        'Memuat teks prompt asli yang dapat dipelajari dan ditiru',
        'Klik pada kartu contoh untuk menyalin teks prompt langsung ke input'
      ],
      howToUse: 'Klik tab "Inspirations" di bawah kotak prompt untuk menjelajahi galeri karya terbaik komunitas.'
    },
    'tab-recents': {
      title: 'Recents History Tab',
      category: 'Personal Workflow',
      badge: 'Quick Session',
      description: 'Tab tampilan cepat untuk melihat hasil gambar yang baru saja Anda buat dalam sesi penjelajahan browser saat ini.',
      keyFeatures: [
        'Penyimpanan lokal cepat tanpa perlu berpindah ke halaman akun',
        'Perbandingan antar percobaan generasi terbaru secara langsung',
        'Unduh dan bagikan karya secara cepat'
      ],
      howToUse: 'Klik tab "Recents" untuk meninjau kembali gambar hasil kreasi Anda sebelumnya.'
    },
    'search-images': {
      title: 'Search for Images Bar',
      category: 'Search Engine',
      badge: 'Fast Lookup',
      description: 'Bilah pencarian gambar dan kata kunci visual di sudut kanan atas galeri untuk menemukan hasil karya spesifik dalam basis data.',
      keyFeatures: [
        'Filter hasil pencarian secara instan berdasarkan kata kunci',
        'Pencarian gambar berdasarkan konsep seperti "cyberpunk", "anime", atau "Maxy Academy"',
        'Navigasi mulus antar inspirasi'
      ],
      howToUse: 'Ketik kata kunci pada kolom "Search for images...", lalu tekan Enter atau klik ikon kaca pembesar.'
    },
    'mobile-menu-drawer': {
      title: 'Mobile Menu Navigation Drawer',
      category: 'Mobile Navigation',
      badge: 'Responsive UI',
      description: 'Menu navigasi geser khusus tampilan perangkat seluler (smartphone) yang merangkum seluruh fitur utama Craiyon dalam tata letak ringkas.',
      keyFeatures: [
        'Navigasi sentuh intuitif untuk smartphone',
        'Akses lengkap ke Image Suite, Studio, dan Pengaturan Akun',
        'Sesuai dengan acuan Craiyon versi mobile'
      ],
      howToUse: 'Tekan ikon tiga garis (hamburger) di sudut kanan atas pada tampilan Mobile untuk membuka atau menutup drawer ini.'
    }
  };

  const openModal = (key: string) => {
    setActiveModalKey(key);
  };

  // Real AI Image Generation Handler
  const handleGenerate = async () => {
    if (!promptText.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          style: stylePreset,
          aspectRatio: aspectRatio === 'auto' ? '1:1' : aspectRatio,
          excludedWords: showExcludedInput ? excludedWords : '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat gambar dari API.');
      }

      if (data.imageUrl) {
        const newResult: GeneratedImageItem = {
          id: Date.now().toString(),
          url: data.imageUrl,
          prompt: promptText,
          style: stylePreset,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: data.provider,
        };

        setGeneratedResult(newResult);
        setRecents((prev) => [newResult, ...prev]);

        if (data.warning) {
          setToastNotice(data.warning);
          setTimeout(() => setToastNotice(null), 4000);
        } else {
          setToastNotice('Gambar AI berhasil dibuat!');
          setTimeout(() => setToastNotice(null), 3000);
        }
      } else {
        throw new Error('API tidak mengembalikan URL gambar yang valid.');
      }
    } catch (err: any) {
      console.error('Craiyon generator error:', err);
      setGenerationError(
        err.message || 'Terjadi kesalahan tidak terduga saat memanggil API AI Image Generator.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Inspiration Prompt Copy Handler
  const handleSelectInspiration = (inspirationPrompt: string) => {
    setPromptText(inspirationPrompt);
    setToastNotice('Teks contoh disalin ke input! Klik tombol Generate oranye untuk merender.');
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Filtered Inspirations / Recents
  const filteredInspirations = INSPIRATIONS_DATA.filter(
    (item) =>
      item.prompt.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.style.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredRecents = recents.filter(
    (item) =>
      item.prompt.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.style.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0d0f17] text-slate-800 dark:text-slate-100 overflow-hidden shadow-2xl font-sans">
      {/* Toast Notice Bar */}
      {toastNotice && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-orange-500 to-amber-600 text-slate-900 dark:text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl border border-white/20 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{toastNotice}</span>
          <button onClick={() => setToastNotice(null)} className="ml-2 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Device & Control Bar */}
      <div className="bg-[#131622] border-b border-[#212536] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 ml-2">
            <Pencil className="w-3.5 h-3.5 text-orange-400" />
            Craiyon Simulator - Maxy Academy
          </span>
        </div>

        {/* View Mode Switcher: Desktop vs Mobile */}
        <div className="flex items-center bg-[#090b10] border border-[#232738] rounded-xl p-1 gap-1">
          <button
            onClick={() => {
              setViewMode('desktop');
              setIsMobileDrawerOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'desktop'
                ? 'bg-orange-500 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mobile'
                ? 'bg-orange-500 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Main Container according to View Mode */}
      {viewMode === 'desktop' ? (
        /* ================= DESKTOP VIEW ================= */
        <div className="flex min-h-[620px] bg-[#0d0f17]">
          {/* Left Sidebar */}
          <aside className="w-64 bg-[#11131f] border-r border-[#1f2333] flex flex-col justify-between p-4 shrink-0 text-xs text-slate-600 dark:text-slate-300 select-none">
            <div className="space-y-4">
              {/* Logo Craiyon & Lang */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1f2333]">
                <div
                  onClick={() => openModal('image-suite-image')}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-slate-900 dark:text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
                    <Pencil className="w-4 h-4 fill-white" />
                  </div>
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                    Craiyon
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-[#1a1d2e] rounded-md border border-[#2a2f47] text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <span>🇺🇸</span>
                  <span>EN</span>
                </div>
              </div>

              {/* Image Suite Accordion Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between py-1 px-2 text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Image suite
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>

                <div className="pl-2 space-y-1">
                  <button
                    onClick={() => {
                      setSelectedSuite('image');
                      openModal('image-suite-image');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                      selectedSuite === 'image'
                        ? 'bg-[#1e2338] text-slate-900 dark:text-white font-semibold border border-orange-500/40'
                        : 'hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                    <span>Image</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSuite('logo');
                      openModal('image-suite-logo');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Logo</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSuite('anime');
                      openModal('image-suite-anime');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5 text-rose-400" />
                    <span>Anime</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSuite('tattoo');
                      openModal('image-suite-tattoo');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                  >
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tattoo</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSuite('homedesign');
                      openModal('image-suite-homedesign');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                  >
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Home design</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSuite('poster');
                      openModal('image-suite-poster');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                  >
                    <Frame className="w-3.5 h-3.5 text-purple-400" />
                    <span>Poster</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSuite('bgremover');
                      openModal('image-suite-bgremover');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                  >
                    <Scissors className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Background remover</span>
                  </button>
                </div>
              </div>

              {/* Studio */}
              <button
                onClick={() => openModal('menu-studio')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-600 dark:text-slate-300 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-medium">Studio</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-600 text-slate-900 dark:text-white rounded-md">
                  New
                </span>
              </button>

              {/* Image search */}
              <button
                onClick={() => openModal('menu-imagesearch')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>Image search</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* My account */}
              <div className="space-y-1">
                <button
                  onClick={() => openModal('menu-myimages')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-3.5 h-3.5" />
                    <span>My account</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <div className="pl-6 space-y-1 text-slate-500 dark:text-slate-400">
                  <button
                    onClick={() => openModal('menu-myimages')}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:text-slate-900 dark:text-white hover:bg-[#181b2a]"
                  >
                    <Folder className="w-3 h-3" />
                    <span>My images</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('recents');
                      openModal('menu-history');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:text-slate-900 dark:text-white hover:bg-[#181b2a]"
                  >
                    <Clock className="w-3 h-3" />
                    <span>History ({recents.length})</span>
                  </button>
                  <button
                    onClick={() => openModal('menu-settings')}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:text-slate-900 dark:text-white hover:bg-[#181b2a]"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>

              {/* Help */}
              <button
                onClick={() => openModal('menu-help')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#181b2a] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Help</span>
              </button>
            </div>

            {/* Bottom Upgrade & Sign Out */}
            <div className="space-y-3 pt-4 border-t border-[#1f2333]">
              <button
                onClick={() => openModal('menu-upgradepro')}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 text-xs transition-all active:scale-95"
              >
                Upgrade to Pro
              </button>

              <button
                onClick={() => openModal('menu-settings')}
                className="w-full flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white py-1.5 transition-colors"
              >
                <span>Sign out</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
            {/* Hero Title */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Free AI Image Generator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Create free AI images from text for art, photos, illustrations, and quick visual ideas.
              </p>
            </div>

            {/* Central Craiyon Prompt Box */}
            <div className="max-w-2xl mx-auto bg-[#131625] border border-[#23283e] rounded-3xl p-4 space-y-4 shadow-2xl relative">
              {/* Textarea Input & Reference Icon */}
              <div className="relative">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="A cute fox with a red hat..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none min-h-[70px] pr-10 font-medium"
                />
                <button
                  onClick={() => openModal('control-uploadref')}
                  title="Upload reference image"
                  className="absolute top-1 right-1 p-2 bg-[#1d2238] hover:bg-[#282f4d] rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white border border-[#2f375a] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Excluded Words Input Collapsible */}
              {showExcludedInput && (
                <div className="bg-[#0b0d14] border border-rose-500/30 rounded-2xl p-2.5 text-xs space-y-1 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px] text-rose-400 font-semibold">
                    <span>Excluded Words (Negative Prompt):</span>
                    <button onClick={() => setShowExcludedInput(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={excludedWords}
                    onChange={(e) => setExcludedWords(e.target.value)}
                    placeholder="blurry, low quality, bad anatomy..."
                    className="w-full bg-[#151929] border border-[#232942] rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              )}

              {/* Bottom Control Pills Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1c2033] text-xs">
                <div className="flex flex-wrap items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  {/* Reference */}
                  <button
                    onClick={() => openModal('control-uploadref')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1e30] hover:bg-[#242a42] rounded-xl border border-[#2a304a] transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Reference</span>
                  </button>

                  {/* Public / Private */}
                  <button
                    onClick={() => {
                      setIsPublic(!isPublic);
                      openModal('control-public');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1e30] hover:bg-[#242a42] rounded-xl border border-[#2a304a] transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isPublic ? 'Public' : 'Private (Pro)'}</span>
                  </button>

                  {/* Style Preset Selector */}
                  <button
                    onClick={() => {
                      const styles: ('auto' | 'art' | 'drawing' | 'photo')[] = ['auto', 'art', 'drawing', 'photo'];
                      const next = styles[(styles.indexOf(stylePreset) + 1) % styles.length];
                      setStylePreset(next);
                      openModal('control-style');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1e30] hover:bg-[#242a42] rounded-xl border border-[#2a304a] transition-colors"
                  >
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="capitalize">{stylePreset}</span>
                  </button>

                  {/* Aspect Ratio */}
                  <button
                    onClick={() => {
                      const ratios: ('auto' | '1:1' | '16:9' | '9:16')[] = ['auto', '1:1', '16:9', '9:16'];
                      const next = ratios[(ratios.indexOf(aspectRatio) + 1) % ratios.length];
                      setAspectRatio(next);
                      openModal('control-aspect');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1e30] hover:bg-[#242a42] rounded-xl border border-[#2a304a] transition-colors"
                  >
                    <Frame className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{aspectRatio === 'auto' ? 'Auto' : aspectRatio}</span>
                  </button>

                  {/* Excluded */}
                  <button
                    onClick={() => {
                      setShowExcludedInput(!showExcludedInput);
                      openModal('control-excluded');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                      showExcludedInput
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-[#1a1e30] hover:bg-[#242a42] text-slate-600 dark:text-slate-300 border-[#2a304a]'
                    }`}
                  >
                    <X className="w-3.5 h-3.5 text-rose-400" />
                    <span>Excluded</span>
                  </button>
                </div>

                {/* Orange Generate Action Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-900 dark:text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transition-transform active:scale-90 disabled:opacity-50 cursor-pointer"
                  title="Generate AI Image"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-900 dark:text-white" />
                  ) : (
                    <ArrowUp className="w-5 h-5 font-bold stroke-[3]" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message Display Banner */}
            {generationError && (
              <div className="max-w-2xl mx-auto bg-rose-950/80 border border-rose-500/60 p-4 rounded-2xl flex items-start gap-3 text-xs text-rose-200 shadow-xl animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-rose-300">Gagal Menggenerasi Gambar</h4>
                  <p className="leading-relaxed">{generationError}</p>
                </div>
                <button
                  onClick={handleGenerate}
                  className="px-3 py-1 bg-rose-800 hover:bg-rose-700 text-slate-900 dark:text-white font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Loading Indicator Overlay */}
            {isGenerating && (
              <div className="max-w-2xl mx-auto bg-[#131625]/90 border border-orange-500/40 p-8 rounded-3xl text-center space-y-4 shadow-2xl animate-pulse">
                <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/20">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Memproses Generasi Gambar AI...</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Sedang menghubungkan ke model Imagen API dengan prompt: <span className="text-orange-300 italic">"{promptText}"</span>
                  </p>
                </div>
                <div className="w-48 mx-auto bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full w-full animate-pulse" />
                </div>
              </div>
            )}

            {/* Newly Generated Result Card Preview or Initial Friendly Placeholder */}
            {generatedResult && !isGenerating ? (
              <div className="max-w-2xl mx-auto bg-[#131625] border border-orange-500/60 rounded-3xl p-4 space-y-3 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between text-xs font-bold border-b border-[#22273d] pb-2">
                  <span className="text-orange-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Hasil Generasi AI Terbaru
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">{generatedResult.timestamp}</span>
                </div>

                <div className="relative group rounded-2xl overflow-hidden border border-[#23283e] bg-black">
                  <img
                    src={generatedResult.url}
                    alt={generatedResult.prompt}
                    referrerPolicy="no-referrer"
                    className="w-full max-h-[450px] object-contain mx-auto"
                  />
                  <a
                    href={generatedResult.url}
                    download="craiyon-ai-image.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 p-2.5 bg-orange-500 hover:bg-orange-600 text-slate-900 dark:text-white rounded-xl shadow-lg flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" /> Unduh Gambar
                  </a>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <p className="font-semibold text-slate-900 dark:text-white line-clamp-2 italic">
                    "{generatedResult.prompt}"
                  </p>
                  <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 rounded-lg text-[10px] font-bold border border-indigo-700 shrink-0 ml-2">
                    Style: {generatedResult.style}
                  </span>
                </div>
              </div>
            ) : !isGenerating && (
              /* Friendly Initial Placeholder Box */
              <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#131625] to-[#0f111c] border border-[#23283e] hover:border-orange-500/30 rounded-3xl p-6 text-center space-y-4 shadow-xl transition-all">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
                  <div className="w-16 h-16 rounded-2xl bg-[#181c2e] border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/10">
                    <Sparkles className="w-8 h-8 text-orange-400" />
                  </div>
                </div>

                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                    <span>Siap Menggenerasi Gambar Pertama?</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ketik deskripsi visual di dalam kotak prompt di atas atau klik salah satu ide contoh di bawah, lalu tekan tombol <span className="text-orange-400 font-semibold">Generate</span> untuk memulai lukisan AI.
                  </p>
                </div>

                {/* Quick Inspiration Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px]">
                  <span className="text-slate-500 font-medium">💡 Coba prompt cepat:</span>
                  <button
                    onClick={() => handleSelectInspiration('A cute fox with a red hat in a fairytale autumn forest')}
                    className="px-3 py-1 bg-[#1a1e30] hover:bg-[#252b45] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-full border border-[#2a304b] transition-colors cursor-pointer"
                  >
                    🦊 Cutest Fox in Hat
                  </button>
                  <button
                    onClick={() => handleSelectInspiration('Futuristic cyberpunk neon city with flying vehicles')}
                    className="px-3 py-1 bg-[#1a1e30] hover:bg-[#252b45] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-full border border-[#2a304b] transition-colors cursor-pointer"
                  >
                    🌃 Cyberpunk City
                  </button>
                  <button
                    onClick={() => handleSelectInspiration('CTO Maxy Academy coding in cafe with snow background')}
                    className="px-3 py-1 bg-[#1a1e30] hover:bg-[#252b45] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-full border border-[#2a304b] transition-colors cursor-pointer"
                  >
                    💻 Maxy Academy CTO
                  </button>
                </div>
              </div>
            )}

            {/* Inspirations & Recents Bar */}
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 bg-[#111320] border border-[#1f2336] p-1 rounded-2xl">
                <button
                  onClick={() => {
                    setActiveTab('inspirations');
                    openModal('tab-inspirations');
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'inspirations'
                      ? 'bg-[#1e2338] text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                  }`}
                >
                  Inspirations ({INSPIRATIONS_DATA.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('recents');
                    openModal('tab-recents');
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'recents'
                      ? 'bg-[#1e2338] text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                  }`}
                >
                  Recents ({recents.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Cari prompt / gaya..."
                  className="w-full bg-[#111320] border border-[#1f2336] rounded-2xl pl-3 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Content Gallery (Inspirations or Recents Tab) */}
            {activeTab === 'inspirations' ? (
              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {filteredInspirations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectInspiration(item.prompt)}
                    className="group relative rounded-2xl overflow-hidden border border-[#22273d] bg-[#121524] shadow-lg hover:border-orange-500/60 transition-all cursor-pointer hover:scale-[1.02]"
                    title="Klik untuk menyalin contoh prompt ini"
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2">
                          {item.prompt}
                        </p>
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 transition-transform">
                          <Plus className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px]">
                        <span className="text-orange-400 font-semibold">{item.style}</span>
                        <span className="text-slate-500 dark:text-slate-400">Gunakan Prompt Ini</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Recents Tab Grid */
              <div className="max-w-5xl mx-auto space-y-4 pt-2">
                {recents.length === 0 ? (
                  <div className="text-center py-12 bg-[#121524] border border-[#22273d] rounded-3xl p-6 space-y-3">
                    <Clock className="w-10 h-10 text-slate-500 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">Belum Ada Riwayat Gambar</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Ketikkan instruksi pada kotak prompt di atas, lalu klik tombol Generate oranye untuk menyimpan hasil karya Anda di sini.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecents.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectInspiration(item.prompt)}
                        className="group relative rounded-2xl overflow-hidden border border-[#22273d] bg-[#121524] shadow-lg hover:border-orange-500/60 transition-all cursor-pointer"
                      >
                        <img
                          src={item.url}
                          alt={item.prompt}
                          referrerPolicy="no-referrer"
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex flex-col justify-end">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2">
                            "{item.prompt}"
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            <span className="text-amber-400 font-bold">{item.style}</span>
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      ) : (
        /* ================= MOBILE VIEW ================= */
        <div className="relative min-h-[640px] bg-[#0b0d14] text-slate-800 dark:text-slate-100 p-4 space-y-5 max-w-sm mx-auto border-x border-[#1a1e2d] shadow-2xl">
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2030]">
            <div
              onClick={() => openModal('image-suite-image')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-slate-900 dark:text-white shadow-md shadow-orange-500/30">
                <Pencil className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                Craiyon
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#181b29] rounded-md border border-[#272d42] text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <span>🇺🇸</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(true);
                  openModal('mobile-menu-drawer');
                }}
                className="p-1.5 bg-[#181b29] border border-[#272d42] rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero Mobile Text */}
          <div className="text-center space-y-1.5 pt-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Free AI Image Generator
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Create free AI images from text for art, photos, illustrations, and quick visual ideas.
            </p>
          </div>

          {/* Mobile Prompt Box */}
          <div className="bg-[#131625] border border-[#23283e] rounded-3xl p-4 space-y-3 shadow-xl relative">
            <div className="relative">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="A cute fox with a red hat..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none min-h-[55px] pr-8 font-medium"
              />
              <button
                onClick={() => openModal('control-uploadref')}
                className="absolute top-0 right-0 p-2 bg-[#1d2238] rounded-xl text-slate-600 dark:text-slate-300 border border-[#2f375a]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Bottom Controls Row */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1c2033] text-[11px]">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <button
                  onClick={() => openModal('control-public')}
                  className="flex items-center gap-1 px-2 py-1 bg-[#1a1e30] rounded-lg border border-[#2a304a]"
                >
                  <Lock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>Public</span>
                </button>

                <button
                  onClick={() => openModal('control-style')}
                  className="flex items-center gap-1 px-2 py-1 bg-[#1a1e30] rounded-lg border border-[#2a304a]"
                >
                  <Palette className="w-3 h-3 text-indigo-400" />
                  <span>Auto</span>
                </button>

                <button
                  onClick={() => openModal('control-aspect')}
                  className="flex items-center gap-1 px-2 py-1 bg-[#1a1e30] rounded-lg border border-[#2a304a]"
                >
                  <Frame className="w-3 h-3 text-cyan-400" />
                  <span>Auto</span>
                </button>
              </div>

              {/* Mobile Orange Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-slate-900 dark:text-white flex items-center justify-center shadow-lg shadow-orange-500/40 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900 dark:text-white" />
                ) : (
                  <ArrowUp className="w-4 h-4 font-bold stroke-[3]" />
                )}
              </button>
            </div>
          </div>

          {/* Generated Result Card in Mobile View */}
          {generatedResult && (
            <div className="space-y-3 pt-1 animate-in fade-in">
              <div className="relative rounded-2xl overflow-hidden border border-orange-500/50 bg-[#131625] shadow-lg">
                <img
                  src={generatedResult.url}
                  alt={generatedResult.prompt}
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
                <a
                  href={generatedResult.url}
                  download="craiyon-ai-image.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 p-2 rounded-lg bg-orange-500 text-slate-900 dark:text-white shadow-md hover:bg-orange-600 flex items-center gap-1 text-[10px] font-bold"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh
                </a>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium leading-tight">
                "{generatedResult.prompt}"
              </p>
            </div>
          )}

          {/* Mobile Recents / Inspirations Quick Tab */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold border-b border-[#22273d] pb-2">
              <span className="text-slate-600 dark:text-slate-300">Inspirasi Komunitas</span>
              <span className="text-orange-400 text-[10px]">Klik gambar untuk salin</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INSPIRATIONS_DATA.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectInspiration(item.prompt)}
                  className="rounded-xl overflow-hidden border border-[#23283e] bg-[#131625] h-28 relative cursor-pointer group"
                >
                  <img
                    src={item.url}
                    alt={item.prompt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                    <p className="text-[10px] text-slate-900 dark:text-white font-medium line-clamp-1">{item.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE DRAWER OVERLAY */}
          {isMobileDrawerOpen && (
            <div className="absolute inset-0 z-50 bg-[#090b11]/95 backdrop-blur-md p-5 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
              <div className="space-y-6">
                {/* Drawer Image Suite Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-200 font-semibold text-sm pb-2 border-b border-[#1e2336]">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-orange-400" />
                      Image suite
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </div>

                  <div className="pl-3 space-y-2 text-xs">
                    <button
                      onClick={() => {
                        setSelectedSuite('image');
                        openModal('image-suite-image');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-[#1b2033] text-slate-900 dark:text-white font-medium border border-orange-500/40"
                    >
                      <ImageIcon className="w-4 h-4 text-orange-400" />
                      <span>Image</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSuite('logo');
                        openModal('image-suite-logo');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#151928]"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Logo</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSuite('anime');
                        openModal('image-suite-anime');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#151928]"
                    >
                      <Pencil className="w-4 h-4 text-rose-400" />
                      <span>Anime</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSuite('tattoo');
                        openModal('image-suite-tattoo');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#151928]"
                    >
                      <Palette className="w-4 h-4 text-cyan-400" />
                      <span>Tattoo</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSuite('homedesign');
                        openModal('image-suite-homedesign');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#151928]"
                    >
                      <Home className="w-4 h-4 text-emerald-400" />
                      <span>Home design</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSuite('poster');
                        openModal('image-suite-poster');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#151928]"
                    >
                      <Frame className="w-4 h-4 text-purple-400" />
                      <span>Poster</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSuite('bgremover');
                        openModal('image-suite-bgremover');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#151928]"
                    >
                      <Scissors className="w-4 h-4 text-indigo-400" />
                      <span>Background remover</span>
                    </button>
                  </div>
                </div>

                {/* Studio */}
                <button
                  onClick={() => openModal('menu-studio')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 text-xs hover:bg-[#151928]"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-4 h-4 text-orange-400" />
                    <span className="font-medium">Studio</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-600 text-slate-900 dark:text-white rounded-md">
                    New
                  </span>
                </button>

                {/* Image search */}
                <button
                  onClick={() => openModal('menu-imagesearch')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 text-xs hover:bg-[#151928]"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4" />
                    <span>Image search</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* My account */}
                <button
                  onClick={() => openModal('menu-myimages')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 text-xs hover:bg-[#151928]"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    <span>My account</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Help */}
                <button
                  onClick={() => openModal('menu-help')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 text-xs hover:bg-[#151928]"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help</span>
                </button>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="space-y-3 pt-6 border-t border-[#1e2336] text-center">
                <button
                  onClick={() => openModal('menu-upgradepro')}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-slate-900 dark:text-white font-bold rounded-2xl shadow-lg text-xs"
                >
                  Upgrade to Pro
                </button>

                <button
                  onClick={() => openModal('menu-settings')}
                  className="w-full text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white py-1"
                >
                  Sign out
                </button>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full py-2.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white font-bold border border-[#272d42] rounded-2xl bg-[#131624]"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAILED EXPLANATION MODAL POPUP */}
      {activeModalKey && infoDictionary[activeModalKey] && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131625] border border-orange-500/50 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#23283e] pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  {infoDictionary[activeModalKey].category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {infoDictionary[activeModalKey].title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalKey(null)}
                className="p-1.5 rounded-full bg-[#1e2338] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge */}
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                {infoDictionary[activeModalKey].badge}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {infoDictionary[activeModalKey].description}
            </p>

            {/* Key Features */}
            <div className="space-y-1.5 bg-[#0b0d14] rounded-2xl p-3 border border-[#1f2438]">
              <span className="text-[11px] font-bold text-orange-300 block">
                Fitur & Keunggulan Utama:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                {infoDictionary[activeModalKey].keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to use */}
            <div className="space-y-1 bg-[#1a1e30] rounded-2xl p-3 border border-[#2b324f]">
              <span className="text-[11px] font-bold text-amber-300 block">
                Cara Penggunaan:
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed">
                {infoDictionary[activeModalKey].howToUse}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveModalKey(null)}
              className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
