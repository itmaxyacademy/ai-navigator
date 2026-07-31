import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Settings,
  Grid,
  Share2,
  Copy,
  BarChart2,
  Sparkles,
  Sliders,
  MoreVertical,
  ChevronRight,
  Play,
  FileText,
  Upload,
  Globe,
  HardDrive,
  Link,
  X,
  Send,
  HelpCircle,
  Monitor,
  Smartphone,
  Check,
  RefreshCw,
  Mic,
  Video,
  FileSpreadsheet,
  Layers,
  BrainCircuit,
  MessageSquare,
  Award,
  Zap,
  Info,
  CheckSquare,
  Square,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalContent {
  title: string;
  category: string;
  badge: string;
  description: string;
  keyFeatures: string[];
  howToUse: string;
  actionButtonText?: string;
  actionKey?: string;
}

export const GeminiNotebookReplica: React.FC = () => {
  // Device view mode: 'desktop' or 'mobile'
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
  // Active mobile tab: 'sources' | 'chat' | 'studio'
  const [mobileTab, setMobileTab] = useState<'sources' | 'chat' | 'studio'>('chat');

  // Notebook state
  const [notebookTitle, setNotebookTitle] = useState('Human Capital Development');
  const [isShared, setIsShared] = useState(true);

  // Active Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [explanationModal, setExplanationModal] = useState<ModalContent | null>(null);

  // Configure Chat modal state
  const [chatGoal, setChatGoal] = useState<'Default' | 'Learning Guide' | 'Custom'>('Default');
  const [responseLength, setResponseLength] = useState<'Default' | 'Longer' | 'Shorter'>('Default');

  // Customize Experience modal state
  const [isCustomSummary, setIsCustomSummary] = useState(false);
  const [customSummaryText, setCustomSummaryText] = useState(
    'Buku panduan eksekutif Maxy Academy mengenai transformasi Human Capital Indonesia 2045 berbasis AI, pendidikan inklusif, dan strategi efisiensi talenta digital.'
  );

  // Sources state
  const [sources, setSources] = useState([
    { id: 1, title: 'Coaching for Human Capital Development in Digital Era.pdf', type: 'PDF', checked: true },
    { id: 2, title: 'Data-Driven Decision Making in Entrepreneurship.pdf', type: 'PDF', checked: true },
    { id: 3, title: 'Digital Human Formulasi Pengembangan Talent 2025.pdf', type: 'PDF', checked: true },
    { id: 4, title: 'Education, Human Capital Investment, and AI.pdf', type: 'PDF', checked: true },
    { id: 5, title: 'Human Capital, Innovation, and Disruption Strategy.pdf', type: 'PDF', checked: true },
    { id: 6, title: 'Manajemen Pengembangan Human Capital Maxy Academy.pdf', type: 'PDF', checked: true },
    { id: 7, title: 'Optimal Enterprise Structures & Process Flow.pdf', type: 'PDF', checked: true },
    { id: 8, title: 'Silabus Pengembangan Human Capital Maxy Academy.doc', type: 'DOC', checked: true },
    { id: 9, title: 'SKKNI 2020-149 SKKNI Manajemen Sumber Daya Manusia.pdf', type: 'PDF', checked: true },
    { id: 10, title: 'TEORI PEMBANGUNAN SUMBER DAYA MANUSIA MODERN.pdf', type: 'PDF', checked: true },
    { id: 11, title: 'The Education Myth: How Human Capital Works.pdf', type: 'PDF', checked: true },
    { id: 12, title: 'The Rise of Neoliberal Philosophy in HR.pdf', type: 'PDF', checked: true },
    { id: 13, title: 'Transformasi Human Capital Indonesia 2045 (Maxy).pdf', type: 'PDF', checked: true },
  ]);

  const [selectAll, setSelectAll] = useState(true);
  const [searchSourceQuery, setSearchSourceQuery] = useState('');

  // Interactive Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'gemini';
    text: string;
    sourcesCount?: number;
    citations?: string[];
  }>>([
    {
      id: 'm1',
      sender: 'user',
      text: 'Berdasarkan 13 sumber dokumen ini, apa pilar utama transformasi Human Capital Indonesia 2045 yang dirumuskan oleh Maxy Academy?',
    },
    {
      id: 'm2',
      sender: 'gemini',
      text: `Berdasarkan analisis terintegrasi dari 13 dokumen riset Anda, berikut 3 pilar utama transformasi Human Capital Maxy Academy untuk Golden Indonesia 2045:

1. **Recurve Strategy & Adopsi AI**: Menggabungkan kecerdasan buatan (AI) dengan pengembangan karakter kepemimpinan untuk meningkatkan produktivitas tenaga kerja [Sumber 1, 6, 13].
2. **Standardisasi SKKNI & Sertifikasi Digital**: Penyelarasan silabus pelatihan dengan Standar Kompetensi Kerja Nasional Indonesia (SKKNI) guna menekan mismatch ketenagakerjaan [Sumber 8, 9].
3. **Data-Driven Decision Making**: Menerapkan analitik SDM berbasis data untuk evaluasi kinerja objektif dan pelatihan berkesinambungan [Sumber 2, 7].`,
      sourcesCount: 13,
      citations: ['Sumber 1', 'Sumber 6', 'Sumber 8', 'Sumber 9', 'Sumber 13'],
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudioTitle, setActiveAudioTitle] = useState('Membongkar "Human Capital": Dari Teori ke Eksekusi Maxy Academy');

  // Studio Artifacts List
  const [studioArtifacts, setStudioArtifacts] = useState([
    {
      id: 'a1',
      type: 'audio',
      title: 'Membongkar "Human Capital": Dari Teori ke Eksekusi Maxy Academy',
      duration: '19:29',
      sourcesCount: 13,
      timeAgo: 'Baru saja',
    },
    {
      id: 'a2',
      type: 'note',
      title: 'Human Capital Development Quiz for Maxy Academy Students',
      timeAgo: '2 hari lalu',
    },
    {
      id: 'a3',
      type: 'audio',
      title: 'Human Capital Transformation Podcast #2 (Ringkasan Eksekutif)',
      duration: '50:49',
      sourcesCount: 12,
      timeAgo: '5 hari lalu',
    },
    {
      id: 'a4',
      type: 'note',
      title: 'Rekomendasi Kebijakan Pengembangan Talent Digital 2045',
      timeAgo: '1 minggu lalu',
    },
  ]);

  // Feature Explanation Dictionary (ChatGPT Simulator Style)
  const featureModalData: Record<string, ModalContent> = {
    'sources-panel': {
      title: 'Panel Sumber Dokumen (Sources Panel)',
      category: 'Grounded Data Management',
      badge: 'Hingga 50 Dokumen',
      description: 'Fitur unik Gemini Notebook yang memungkinkan Anda mengunggah PDF, Google Docs, link website, teks, dan video YouTube. AI hanya akan memberikan respon berbasis data yang ada di panel ini (Zero Hallucination).',
      keyFeatures: [
        'Dukungan format PDF, DOCX, TXT, Google Drive, URL Web, & YouTube transcript',
        'Toggle centang untuk memilih sumber mana yang ingin diaktifkan pada chat',
        'Pencarian web otomatis langsung dari dalam notebook untuk menambah referensi'
      ],
      howToUse: 'Klik "+ Add sources" untuk mengunggah berkas atau memasukkan link. Centang dokumen yang ingin dijadikan acuan analisa.'
    },
    'configure-chat': {
      title: 'Pengaturan Gaya Chat (Configure Chat)',
      category: 'Persona & Response Customization',
      badge: 'Kustomisasi AI',
      description: 'Sesuaikan gaya percakapan NotebookLM sesuai kebutuhan riset Anda. Anda dapat menentukan peran AI (seperti Learning Guide atau Pakar SDM) dan mengatur panjang respon.',
      keyFeatures: [
        'Pilihan Peran: Default, Learning Guide (Panduan Belajar), atau Custom Persona',
        'Pengaturan Panjang Respon: Default, Longer (Mendalam), atau Shorter (Ringkas)',
        'Respon yang disesuaikan secara dinamis tanpa mengubah isi data sumber'
      ],
      howToUse: 'Klik ikon sliders di header Chat untuk membuka modal "Configure Chat", pilih gaya persona lalu simpan.'
    },
    'audio-overview': {
      title: 'Audio Overview (Podcast AI 2 Narator)',
      category: 'Studio Output',
      badge: 'Fitur Unggulan',
      description: 'Mengubah kumpulan dokumen riset Anda menjadi diskusi podcast audio berdurasi ~10-20 menit secara otomatis. Dibawakan oleh 2 host AI (pria & wanita) dengan gaya percakapan alami, interaktif, dan mudah dipahami.',
      keyFeatures: [
        'Diskusi interaktif 2 narator AI yang mendalami poin-poin krusial dari dokumen',
        'Penyederhanaan materi akademik & teknis menjadi obrolan audio santai',
        'Dapat didengarkan secara streaming atau diunduh untuk belajar saat bepergian'
      ],
      howToUse: 'Klik kartu "Audio Overview" di Studio untuk mendengarkan diskusi podcast yang digenerasi dari dokumen Anda.',
      actionButtonText: '▶️ Putar Podcast Audio AI',
      actionKey: 'play-audio'
    },
    'slide-deck': {
      title: 'Slide Deck (Presentasi Otomatis)',
      category: 'Presentation Studio',
      badge: 'BETA Feature',
      description: 'Menghasilkan struktur slide presentasi yang siap pakai dari seluruh berkas riset Anda. Lengkap dengan poin-poin utama, ringkasan eksekutif, dan susunan materi terstruktur per slide.',
      keyFeatures: [
        'Generasi alur slide otomatis dari pendahuluan hingga kesimpulan',
        'Ekstraksi data statistik dan fakta penting langsung dari sumber terverifikasi',
        'Siap diimpor ke Google Slides atau Microsoft PowerPoint'
      ],
      howToUse: 'Klik "Slide Deck" di Studio untuk menghasilkan draf presentasi otomatis berdasarkan dokumen aktif.',
      actionButtonText: '📊 Generasi Slide Deck Presentasi',
      actionKey: 'generate-slide-deck'
    },
    'video-overview': {
      title: 'Video Overview (Ringkasan Visual & Skrip Video)',
      category: 'Multimedia Studio',
      badge: 'Visual Content',
      description: 'Membuat ringkasan skrip video pendek (format penjelasan ala YouTube/Reels/TikTok) yang merangkum poin-poin krusial dokumen riset Anda secara dinamis dengan panduan narasi visual.',
      keyFeatures: [
        'Format skrip video lengkap dengan petunjuk adegan visual (b-roll) dan voiceover',
        'Pembagian segmen video berdasarkan bab atau topik utama dokumen',
        'Ideal untuk materi penjelasan cepat dan video pembelajaran singkat'
      ],
      howToUse: 'Klik "Video Overview" di Studio untuk membuat skrip dan ringkasan visual video.',
      actionButtonText: '🎬 Buat Skrip & Video Overview',
      actionKey: 'generate-video'
    },
    'mind-map': {
      title: 'Mind Map (Peta Konsep & Visualisasi Hubungan)',
      category: 'Knowledge Mapping',
      badge: 'Visual Diagram',
      description: 'Memetakan keterkaitan antar konsep, teori, dan data dalam dokumen Anda ke dalam diagram cabang (Mind Map) interaktif untuk mempermudah pemahaman struktur riset.',
      keyFeatures: [
        'Visualisasi hierarki topik dari cabang utama hingga sub-topik mendetail',
        'Menghubungkan benang merah antara berbagai berkas riset yang berbeda',
        'Format interaktif yang dapat diperluas sesuai fokus analisis'
      ],
      howToUse: 'Klik "Mind Map" di Studio untuk menyusun diagram cabang keterkaitan konsep secara visual.',
      actionButtonText: '🧠 Tampilkan Mind Map Konsep',
      actionKey: 'generate-mindmap'
    },
    'reports': {
      title: 'Reports (Laporan Eksekutif & Ringkasan Komprehensif)',
      category: 'Executive Synthesis',
      badge: 'Document Synthesis',
      description: 'Menyusun laporan eksekutif resmi yang menggabungkan temuan utama, analisis SWOT, rekomendasi kebijakan, dan matriks strategi dari seluruh berkas yang Anda analisis.',
      keyFeatures: [
        'Format dokumen profesional dengan bab terstruktur dan ringkasan eksekutif',
        'Penyorotan rekomendasi tindakan nyata (actionable insights) untuk manajemen',
        'Sitasi lengkap yang terhubung langsung ke berkas sumber'
      ],
      howToUse: 'Klik "Reports" di Studio untuk menyusun draft laporan eksekutif komprehensif.',
      actionButtonText: '📑 Susun Laporan Eksekutif',
      actionKey: 'generate-reports'
    },
    'flashcards': {
      title: 'Flashcards (Kartu Hafalan Interaktif)',
      category: 'Interactive Learning',
      badge: 'Study Assistant',
      description: 'Menghasilkan himpunan kartu hafalan (Flashcards) dua sisi yang berisi istilah kunci, definisi, dan konsep penting dari materi dokumen Anda untuk latihan mandiri.',
      keyFeatures: [
        'Pertanyaan/Terminologi di sisi depan dan Penjelasan di sisi belakang',
        'Deteksi otomatis istilah teknis dan konsep penting dari dokumen',
        'Metode pengulangan berjeda (spaced repetition) untuk memantapkan pemahaman'
      ],
      howToUse: 'Klik "Flashcards" di Studio untuk membuka modul latihan kartu hafalan interaktif.',
      actionButtonText: '🎴 Buka Flashcards Interaktif',
      actionKey: 'generate-flashcards'
    },
    'quiz': {
      title: 'Quiz (Kuis & Soal Pilihan Ganda)',
      category: 'Assessment Studio',
      badge: 'Evaluasi Pemahaman',
      description: 'Membuat bank soal kuis pilihan ganda lengkap dengan kunci jawaban, pembahasan mendetail, dan sitasi dokumen untuk menguji pemahaman Anda atau tim terhadap materi.',
      keyFeatures: [
        'Variasi tingkat kesulitan soal (Dasar, Menengah, Lanjutan)',
        'Kunci jawaban disertai pembahasan ilmiah dari dokumen sumber',
        'Sangat berguna untuk evaluasi peserta pelatihan di Maxy Academy'
      ],
      howToUse: 'Klik "Quiz" di Studio untuk menyusun soal uji pemahaman secara otomatis.',
      actionButtonText: '❓ Mulai Kuis Pilihan Ganda',
      actionKey: 'generate-quiz'
    },
    'infographic': {
      title: 'Infographic (Infografis Ringkasan Data)',
      category: 'Visual Analytics',
      badge: 'BETA Feature',
      description: 'Merangkum angka, data statistik, tren, dan alur proses dari dokumen menjadi tata letak infografis visual yang bersih dan siap dibagikan.',
      keyFeatures: [
        'Penyajian angka statistik utama dalam format grafik dan diagram ringkas',
        'Highlight poin-poin penting dengan tata letak visual berdaya tarik tinggi',
        'Sangat efisien untuk presentasi laporan visual cepat'
      ],
      howToUse: 'Klik "Infographic" di Studio untuk membuat ringkasan infografis visual.',
      actionButtonText: '📈 Tampilkan Infografis',
      actionKey: 'generate-infographic'
    },
    'data-table': {
      title: 'Data Table (Tabel Matriks & Spreadsheet Data)',
      category: 'Data Structuring',
      badge: 'Structured Data',
      description: 'Mengekstrak data terstruktur, perbandingan angka, jadwal, dan matriks evaluasi dari berbagai dokumen lalu menyajikannya dalam bentuk tabel yang dapat diekspor.',
      keyFeatures: [
        'Ekstraksi otomatis tabel perbandingan dan matriks indikator KPI',
        'Format bersih yang mudah disalin ke Google Sheets atau Microsoft Excel',
        'Sangat efisien untuk analisis komparatif antar beberapa laporan'
      ],
      howToUse: 'Klik "Data Table" di Studio untuk mengekstrak dan menyusun tabel data terstruktur.',
      actionButtonText: '📋 Ekstrak Tabel Data Terstruktur',
      actionKey: 'generate-datatable'
    },
    'copy': {
      title: 'Copy Link (Salin Tautan Notebook)',
      category: 'Quick Sharing',
      badge: 'Navigasi Atas',
      description: 'Fitur untuk menyalin tautan unik (URL) NotebookLM ini langsung ke clipboard perangkat Anda. Tautan ini memudahkan berbagi riset dengan rekan kerja.',
      keyFeatures: [
        'Salin URL instan satu kali klik',
        'Akses cepat bagi rekan tim yang sudah diberi izin akses',
        'Mempermudah penyebaran bahan riset di grup komunikasi Maxy Academy'
      ],
      howToUse: 'Klik tombol "Copy" di bar navigasi atas untuk menyalin link notebook.',
      actionButtonText: '📋 Salin Tautan Sekarang',
      actionKey: 'do-copy'
    },
    'share': {
      title: 'Share (Bagikan Akses Notebook)',
      category: 'Collaboration',
      badge: 'Access Control',
      description: 'Mengatur tingkat privasi dan membagikan akses notebook ini kepada orang lain. Anda dapat mengatur apakah penerima dapat mengedit atau hanya melihat.',
      keyFeatures: [
        'Pengaturan opsi akses: Private, Shared dengan email, atau Public Link',
        'Pengaturan hak akses: Viewer (Hanya Baca) atau Editor (Pengedit)',
        'Kolaborasi interaktif pada berkas dokumen dan chat grounded'
      ],
      howToUse: 'Klik tombol "Share" di bar navigasi atas untuk mengelola hak akses dan mengundang kolaborator.',
      actionButtonText: '👥 Bagikan Akses Notebook',
      actionKey: 'do-share'
    },
    'analytics': {
      title: 'Analytics (Analitik Penggunaan Notebook)',
      category: 'Performance Insights',
      badge: 'Data Analytics',
      description: 'Dasbor statistik yang memperlihatkan aktivitas riset di dalam notebook ini: jumlah query chat, dokumen terbanyak disitasi, serta durasi penggunaan studio.',
      keyFeatures: [
        'Statistik frekuensi sitasi untuk setiap berkas dokumen di Sources Panel',
        'Metrik pertanyaan paling sering diajukan dan kategori topik riset',
        'Laporan efisiensi riset tim Maxy Academy'
      ],
      howToUse: 'Klik tombol "Analytics" di bar navigasi atas untuk membuka statistik penggunaan notebook.',
      actionButtonText: '📊 Lihat Analitik Riset',
      actionKey: 'do-analytics'
    },
    'settings': {
      title: 'Settings (Pengaturan & Branding Notebook)',
      category: 'System Configuration',
      badge: 'Preferences',
      description: 'Jendela pengaturan utama notebook untuk mengubah judul proyek, mengunggah banner sampul kustom, menyunting ringkasan manual, dan mengatur privasi.',
      keyFeatures: [
        'Ubah judul proyek riset & upload banner sampul kustom',
        'Set Custom Notebook Summary untuk memberikan instruksi konteks awal pada AI',
        'Pengaturan privasi dan manajemen hapus/ekspor notebook'
      ],
      howToUse: 'Klik tombol "Settings" di bar navigasi atas untuk membuka modal kustomisasi notebook.',
      actionButtonText: '⚙️ Buka Pengaturan Notebook',
      actionKey: 'do-settings'
    },
    'studio-tools': {
      title: 'Studio Alat Bantu Belajar & Presentasi',
      category: 'Content Generation',
      badge: 'Multi-Format Output',
      description: 'Menghasilkan berbagai format materi pembelajaran secara otomatis dari sumber Anda, termasuk Mind Map, Slide Deck, Flashcards, Quiz, Infografis, dan Data Table.',
      keyFeatures: [
        'Slide Deck & Mind Map otomatis untuk bahan presentasi',
        'Quiz & Flashcards interaktif untuk menguji pemahaman',
        'Infografis & Data Table untuk merangkum data statistik'
      ],
      howToUse: 'Pilih salah satu kartu di Studio (misalnya Slide Deck atau Quiz) untuk membuat artefak baru secara instan.'
    },
    'customize-experience': {
      title: 'Kustomisasi Pengalaman & Ringkasan Notebook',
      category: 'Notebook Branding',
      badge: 'Metadata & Cover',
      description: 'Ubah judul notebook, unggah gambar sampul khusus, serta tetapkan ringkasan kustom yang menggambarkan inti riset Maxy Academy.',
      keyFeatures: [
        'Pengubahan Judul & Banner Sampul Notebook',
        'Set Custom Notebook Summary untuk instruksi pengenalan khusus',
        'Gunakan sebagai templat riset tim atau organisasi'
      ],
      howToUse: 'Klik tombol "Customize" di bawah judul notebook pada panel Chat untuk membuka opsi kustomisasi.'
    }
  };

  const handleModalAction = (actionKey?: string) => {
    if (!actionKey) return;
    setExplanationModal(null);
    switch (actionKey) {
      case 'play-audio':
        setIsPlayingAudio(true);
        setActiveAudioTitle('Membongkar "Human Capital": Dari Teori ke Eksekusi Maxy Academy');
        break;
      case 'generate-slide-deck':
        alert('Slide Deck presentasi otomatis dari 13 sumber berhasil digenerasi!');
        break;
      case 'generate-video':
        alert('Video Overview & Skrip Narasi berhasil diproses!');
        break;
      case 'generate-mindmap':
        alert('Mind Map cabang konsep Human Capital berhasil dibuat!');
        break;
      case 'generate-reports':
        alert('Laporan Eksekutif Maxy Academy berhasil disusun!');
        break;
      case 'generate-flashcards':
        alert('Kartu Flashcard Hafalan Konsep berhasil dibuat!');
        break;
      case 'generate-quiz':
        alert('Soal Kuis Pilihan Ganda berhasil digenerasi!');
        break;
      case 'generate-infographic':
        alert('Infografis Ringkasan Transformasi Talent 2045 berhasil dibuat!');
        break;
      case 'generate-datatable':
        alert('Tabel Data Terstruktur & Matriks KPI berhasil diekstrak!');
        break;
      case 'do-copy':
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
        }
        alert('Tautan Notebook Maxy Academy berhasil disalin ke clipboard!');
        break;
      case 'do-share':
        alert('Menu Bagikan Akses Notebook Maxy Academy terbuka!');
        break;
      case 'do-analytics':
        alert('Menampilkan dasbor analitik dan statistik sitasi notebook!');
        break;
      case 'do-settings':
        setActiveModal('customize-exp');
        break;
      default:
        break;
    }
  };

  // Select/Deselect All Sources
  const handleToggleSelectAll = () => {
    const nextState = !selectAll;
    setSelectAll(nextState);
    setSources(sources.map(s => ({ ...s, checked: nextState })));
  };

  const handleToggleSource = (id: number) => {
    setSources(sources.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  // Send Message in Chat
  const handleSendMessage = () => {
    if (!chatInput.trim() || isGenerating) return;
    const userText = chatInput.trim();
    setChatInput('');

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: userText,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    setTimeout(() => {
      const activeCount = sources.filter(s => s.checked).length;
      let aiText = `Berdasarkan ${activeCount} sumber dokumen yang Anda aktifkan:\n\n Mengenai "${userText}", analisis dokumen Maxy Academy menunjukkan bahwa penerapan strategi ini membutuhkan koordinasi lintas divisi, evaluasi berbasis matriks KPI digital, serta peningkatan kompetensi hardskill & softskill secara terukur.`;
      
      if (chatGoal === 'Learning Guide') {
        aiText += `\n\n💡 **Panduan Belajar**: Coba pertimbangkan kuis interaktif atau modul simulasi untuk menguji pemahaman tim mengenai topik ini.`;
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'gemini' as const,
        text: aiText,
        sourcesCount: activeCount,
        citations: ['Sumber 1', 'Sumber 3', 'Sumber 6'],
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 1000);
  };

  const filteredSources = sources.filter(s =>
    s.title.toLowerCase().includes(searchSourceQuery.toLowerCase())
  );

  const activeSourcesCount = sources.filter(s => s.checked).length;

  return (
    <div className="space-y-4">
      {/* Device View Mode Switcher Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-slate-900 dark:text-white font-extrabold shadow-lg shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Gemini Notebook (NotebookLM) Simulator</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Grounded AI Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengalaman interaktif riset berbasis data grounded untuk Maxy Academy.
            </p>
          </div>
        </div>

        {/* Desktop / Mobile View Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'desktop'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View (3 Panel)</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mobile'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View (Tabbed)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN NOTEBOOK APPLICATION FRAME                                           */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-[#12151c] text-slate-800 dark:text-slate-100 overflow-hidden shadow-2xl font-sans min-h-[680px]">
        {/* TOP BAR / NAVIGATION HEADER (Matching Screenshots) */}
        <div className="bg-[#1a1e28] border-b border-slate-200 dark:border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
          {/* Left Logo & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Gemini Spiral Logo */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
            </div>
            
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate max-w-[180px] sm:max-w-xs">
              {notebookTitle}
            </span>

            <button
              onClick={() => setIsShared(!isShared)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60 transition-colors"
            >
              <span>{isShared ? '👥 Shared' : '🔒 Private'}</span>
            </button>
          </div>

          {/* Top Center / Right Navigation Buttons */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <button
              onClick={() => setActiveModal('add-sources')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-white text-slate-950 font-bold transition-all shadow-md text-xs"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950" />
              <span>Create notebook</span>
            </button>

            <button
              onClick={() => setExplanationModal(featureModalData['copy'])}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60 transition-colors"
              title="Copy Link Notebook"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Copy</span>
            </button>

            <button
              onClick={() => setExplanationModal(featureModalData['analytics'])}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60 transition-colors"
              title="Notebook Analytics"
            >
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            <button
              onClick={() => setExplanationModal(featureModalData['share'])}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60 transition-colors"
              title="Share Notebook"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => setExplanationModal(featureModalData['settings'])}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60 transition-colors"
              title="Notebook Settings"
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <button
              onClick={() => setExplanationModal(featureModalData['sources-panel'])}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:bg-slate-800"
              title="Panduan Fitur"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* User Avatar Maxy Academy */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center border border-indigo-300/40 shadow-sm ml-1">
              MA
            </div>
          </div>
        </div>

        {/* MOBILE TABS (Shown only when viewMode === 'mobile') */}
        {viewMode === 'mobile' && (
          <div className="bg-[#161a23] border-b border-slate-200 dark:border-slate-800 flex items-center justify-around text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-2">
            <button
              onClick={() => setMobileTab('sources')}
              className={`pb-1 px-3 border-b-2 transition-all ${
                mobileTab === 'sources'
                  ? 'border-blue-400 text-blue-400 font-extrabold'
                  : 'border-transparent hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              Sources ({activeSourcesCount})
            </button>
            <button
              onClick={() => setMobileTab('chat')}
              className={`pb-1 px-3 border-b-2 transition-all ${
                mobileTab === 'chat'
                  ? 'border-blue-400 text-blue-400 font-extrabold'
                  : 'border-transparent hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setMobileTab('studio')}
              className={`pb-1 px-3 border-b-2 transition-all ${
                mobileTab === 'studio'
                  ? 'border-blue-400 text-blue-400 font-extrabold'
                  : 'border-transparent hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              Studio ({studioArtifacts.length})
            </button>
          </div>
        )}

        {/* AUDIO PLAYER OVERLAY BANNER (When Playing Audio) */}
        {isPlayingAudio && (
          <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 border-b border-blue-500/40 px-4 py-2.5 flex items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0 animate-pulse">
                <Mic className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900 dark:text-white block truncate">{activeAudioTitle}</span>
                <span className="text-[10px] text-blue-200">Sedang Diputar · Audio Overview Podcast (2 Host AI)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsPlayingAudio(false)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[11px]"
              >
                Hentikan
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN 3-COLUMN CONTENT GRID (Desktop View or Mobile Tab Switch)             */}
        {/* ========================================================================= */}
        <div className={`grid grid-cols-1 ${viewMode === 'desktop' ? 'lg:grid-cols-12' : ''} min-h-[600px] text-xs divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80`}>
          
          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 1: SOURCES PANEL (Matching Image 1 & 5)                          */}
          {/* ----------------------------------------------------------------------- */}
          {(viewMode === 'desktop' || mobileTab === 'sources') && (
            <div className={`${viewMode === 'desktop' ? 'lg:col-span-3' : 'w-full'} bg-[#151922] p-4 flex flex-col justify-between space-y-4`}>
              <div className="space-y-3">
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Sources</h3>
                    <button
                      onClick={() => setExplanationModal(featureModalData['sources-panel'])}
                      className="text-slate-500 dark:text-slate-400 hover:text-amber-400"
                      title="Pelajari Sources Panel"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {activeSourcesCount}/{sources.length} aktif
                  </span>
                </div>

                {/* + Add Sources Button */}
                <button
                  onClick={() => setActiveModal('add-sources')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-700 text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-slate-700/80 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span>Add sources</span>
                </button>

                {/* Search sources bar */}
                <div className="relative">
                  <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-2 space-y-2">
                    <input
                      type="text"
                      value={searchSourceQuery}
                      onChange={(e) => setSearchSourceQuery(e.target.value)}
                      placeholder="Search the web for new sources"
                      className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none text-xs"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          🌐 Web ▾
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          ⚡ Fast Research ▾
                        </span>
                      </div>
                      <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Select All Checkbox Header */}
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleSelectAll}
                      className="flex items-center gap-1.5 hover:text-slate-900 dark:text-white font-semibold"
                    >
                      {selectAll ? (
                        <CheckSquare className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                      <span>Select all</span>
                    </button>
                  </div>
                </div>

                {/* Source File Checkbox List */}
                <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {filteredSources.map((source) => (
                    <div
                      key={source.id}
                      onClick={() => handleToggleSource(source.id)}
                      className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        source.checked
                          ? 'bg-white dark:bg-[#0d1322] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                          : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-900 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                          source.type === 'PDF' 
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {source.type}
                        </span>
                        <span className="truncate text-xs font-medium group-hover:text-slate-900 dark:text-white transition-colors">
                          {source.title}
                        </span>
                      </div>

                      <div className="shrink-0">
                        {source.checked ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Info Footnote */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Total Grounded Sources: {sources.length}</span>
                <button
                  onClick={() => setActiveModal('add-sources')}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  + Tambah Berkas
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 2: CHAT PANEL (Matching Image 1, 2, 6)                            */}
          {/* ----------------------------------------------------------------------- */}
          {(viewMode === 'desktop' || mobileTab === 'chat') && (
            <div className={`${viewMode === 'desktop' ? 'lg:col-span-6' : 'w-full'} bg-[#12151d] p-4 sm:p-5 flex flex-col justify-between space-y-4`}>
              {/* Chat Header Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Chat Grounded AI</h3>
                  <button
                    onClick={() => setExplanationModal(featureModalData['configure-chat'])}
                    className="text-slate-500 dark:text-slate-400 hover:text-amber-400"
                    title="Pelajari Chat Grounded"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Configure Chat Button (Sliders icon) */}
                  <button
                    onClick={() => setActiveModal('configure-chat')}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs"
                    title="Configure Chat"
                  >
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden sm:inline font-semibold text-[11px]">Configure</span>
                  </button>

                  <button
                    onClick={() => setActiveModal('customize-exp')}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Top Summary Header Banner (Image 1 replica) */}
              <div className="bg-[#181c27] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇮🇩</span>
                    <button
                      onClick={() => setActiveModal('customize-exp')}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700/80 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Customize</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Updated Apr 20, 2026
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {notebookTitle}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {activeSourcesCount} sources · Maxy Academy Research Studio
                  </p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-28 overflow-y-auto">
                  {isCustomSummary ? customSummaryText : (
                    <>
                      Teks ini menyajikan analisis komprehensif mengenai transformasi <strong>Human Capital Indonesia 2045</strong> yang dikembangkan oleh <strong>Maxy Academy</strong>. Pembahasan berfokus pada efisiensi talenta digital, adopsi AI, standardisasi kurikulum SKKNI, serta optimasi strategi pengelolaan bakat.
                    </>
                  )}
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xl rounded-2xl p-4 space-y-2 text-xs leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-[#181c27] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'
                    }`}>
                      <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px] font-bold opacity-80">
                        <span>{msg.sender === 'user' ? 'Maxy Academy' : 'Gemini NotebookLM'}</span>
                        {msg.sourcesCount && (
                          <span className="text-blue-300 font-mono">📄 Grounded on {msg.sourcesCount} sources</span>
                        )}
                      </div>

                      <div className="whitespace-pre-line text-xs font-normal">
                        {msg.text}
                      </div>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1">
                          {msg.citations.map((cit, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono cursor-pointer hover:underline"
                            >
                              {cit}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-[#181c27] border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Gemini Notebook sedang menganalisis {activeSourcesCount} sumber...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bottom Bar (Matching Screenshots) */}
              <div className="relative pt-2">
                <div className="bg-[#181c27] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Start typing..."
                    className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none text-xs resize-none h-12"
                  />

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-mono">{activeSourcesCount} sources active</span>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isGenerating}
                      className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 dark:bg-slate-800 text-white rounded-xl transition-all shadow-md shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 text-center mt-1.5">
                  Gemini Notebook can be inaccurate; please double check its responses.
                </p>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 3: STUDIO PANEL (Matching Image 1 & 5)                            */}
          {/* ----------------------------------------------------------------------- */}
          {(viewMode === 'desktop' || mobileTab === 'studio') && (
            <div className={`${viewMode === 'desktop' ? 'lg:col-span-3' : 'w-full'} bg-[#151922] p-4 flex flex-col justify-between space-y-4`}>
              <div className="space-y-4">
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Studio</h3>
                    <button
                      onClick={() => setExplanationModal(featureModalData['studio-tools'])}
                      className="text-slate-500 dark:text-slate-400 hover:text-amber-400"
                      title="Pelajari Studio Tools"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    9 Format Output
                  </span>
                </div>

                {/* Studio Output Cards Grid (9 items from Image 1) */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Audio Overview */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['audio-overview'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 text-left transition-all group flex flex-col justify-between h-20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Mic className="w-4 h-4 text-blue-400" />
                      <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300">
                        <Info className="w-3 h-3" />
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Audio Overview</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Podcast 2 Host</span>
                    </div>
                  </button>

                  {/* Slide Deck (BETA) */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['slide-deck'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-amber-500/50 text-left transition-all group flex flex-col justify-between h-20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          BETA
                        </span>
                        <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300">
                          <Info className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Slide Deck</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Bahan Presentasi</span>
                    </div>
                  </button>

                  {/* Video Overview */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['video-overview'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/50 text-left transition-all group flex flex-col justify-between h-20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300">
                        <Info className="w-3 h-3" />
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Video Overview</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Ringkasan Visual</span>
                    </div>
                  </button>

                  {/* Mind Map */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['mind-map'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-purple-500/50 text-left transition-all group flex flex-col justify-between h-20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <BrainCircuit className="w-4 h-4 text-purple-400" />
                      <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300">
                        <Info className="w-3 h-3" />
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Mind Map</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Peta Struktur Konsep</span>
                    </div>
                  </button>

                  {/* Reports */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['reports'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-cyan-500/50 text-left transition-all group flex flex-col justify-between h-20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300">
                        <Info className="w-3 h-3" />
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Reports</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Laporan Komprehensif</span>
                    </div>
                  </button>

                  {/* Flashcards */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['flashcards'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-rose-500/50 text-left transition-all group flex flex-col justify-between h-20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Award className="w-4 h-4 text-rose-400" />
                      <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300">
                        <Info className="w-3 h-3" />
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Flashcards</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Latihan Mandiri</span>
                    </div>
                  </button>

                  {/* Quiz */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['quiz'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-amber-500/50 text-left transition-all group flex flex-col justify-between h-20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300">
                        <Info className="w-3 h-3" />
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Quiz</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Uji Pemahaman</span>
                    </div>
                  </button>

                  {/* Infographic (BETA) */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['infographic'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-indigo-500/50 text-left transition-all group flex flex-col justify-between h-20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <BarChart2 className="w-4 h-4 text-indigo-400" />
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          BETA
                        </span>
                        <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300">
                          <Info className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Infographic</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Visual Statistik</span>
                    </div>
                  </button>

                  {/* Data Table */}
                  <button
                    onClick={() => setExplanationModal(featureModalData['data-table'])}
                    className="p-2.5 rounded-xl bg-[#1c212e] hover:bg-[#23293a] border border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/50 text-left transition-all group flex flex-col justify-between h-20 col-span-2 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span className="p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-amber-300 flex items-center gap-1 text-[10px]">
                        <Info className="w-3 h-3" />
                        <span>Detail Fitur</span>
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Data Table</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400">Eksport Matriks & Tabel Analitis</span>
                    </div>
                  </button>
                </div>

                {/* Generated Artefacts List (Matching Image 1) */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Artefak & Catatan Tersimpan
                  </span>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {studioArtifacts.map((art) => (
                      <div
                        key={art.id}
                        className="p-2.5 rounded-xl bg-[#181d28] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 hover:border-slate-300 dark:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {art.type === 'audio' ? (
                            <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                              <Mic className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                          )}

                          <div className="truncate">
                            <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">{art.title}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {art.duration ? `${art.duration} · ${art.sourcesCount} sources` : art.timeAgo}
                            </span>
                          </div>
                        </div>

                        {art.type === 'audio' && (
                          <button
                            onClick={() => {
                              setIsPlayingAudio(true);
                              setActiveAudioTitle(art.title);
                            }}
                            className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shrink-0"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Add Note Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const title = prompt('Masukkan judul catatan baru untuk Maxy Academy:');
                    if (title) {
                      setStudioArtifacts(prev => [
                        { id: Date.now().toString(), type: 'note', title, timeAgo: 'Baru saja' },
                        ...prev,
                      ]);
                    }
                  }}
                  className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Add note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CONFIGURE CHAT MODAL (Matching Image 2 & 6)                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal === 'configure-chat' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#181c26] border border-slate-300 dark:border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Configure Chat</h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full hover:bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Notebooks can be customized to help you achieve different goals: do research, help learn, show various perspectives, or converse in a particular style and tone.
              </p>

              {/* Goal / Style / Role Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white block">
                  Define your conversational goal, style, or role
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Default', 'Learning Guide', 'Custom'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setChatGoal(mode)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        chatGoal === mode
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {chatGoal === mode && <Check className="w-3.5 h-3.5" />}
                      <span>{mode}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  {chatGoal === 'Default' && 'Best for general purpose research and brainstorming tasks.'}
                  {chatGoal === 'Learning Guide' && 'Best for interactive tutoring, step-by-step explanations, and quiz questions.'}
                  {chatGoal === 'Custom' && 'Set custom role prompt for Maxy Academy HR Senior Advisor.'}
                </p>
              </div>

              {/* Choose Response Length */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-900 dark:text-white block">
                  Choose your response length
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Default', 'Longer', 'Shorter'] as const).map((len) => (
                    <button
                      key={len}
                      onClick={() => setResponseLength(len)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        responseLength === len
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {responseLength === len && <Check className="w-3.5 h-3.5" />}
                      <span>{len}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: CUSTOMIZE EXPERIENCE MODAL (Matching Image 3 & 8)               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal === 'customize-exp' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#181c26] border border-slate-300 dark:border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white truncate pr-4">
                  Customize the experience of &quot;{notebookTitle}&quot;
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full hover:bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Banner Upload Box */}
              <div className="w-full h-36 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                <div className="text-center space-y-2">
                  <Upload className="w-8 h-8 text-slate-500 dark:text-slate-400 mx-auto" />
                  <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-600">
                    Upload banner
                  </button>
                </div>
              </div>

              {/* Notebook Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Notebook title</label>
                <input
                  type="text"
                  value={notebookTitle}
                  onChange={(e) => setNotebookTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              {/* Custom Summary Toggle */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Set custom notebook summary</span>
                  <button
                    onClick={() => setIsCustomSummary(!isCustomSummary)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                      isCustomSummary ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isCustomSummary ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  By default, Gemini Notebook autogenerates a summary that refreshes every time you open the notebook. You can choose to override this by manually setting a custom summary.
                </p>

                {isCustomSummary && (
                  <textarea
                    value={customSummaryText}
                    onChange={(e) => setCustomSummaryText(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 h-20"
                  />
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: ADD SOURCES MODAL (Matching Image 4 & 7)                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal === 'add-sources' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#181c26] border border-slate-300 dark:border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Create Audio and Video Overviews from <span className="text-emerald-400">YouTube videos & Documents</span>
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full hover:bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Web Input */}
              <div className="bg-slate-100 dark:bg-slate-950 border border-blue-500/60 rounded-2xl p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Search the web for new sources"
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none text-xs"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                      🌐 Web ▾
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                      ⚡ Fast Research ▾
                    </span>
                  </div>
                  <Search className="w-4 h-4 text-blue-400" />
                </div>
              </div>

              {/* Drop files box */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 rounded-2xl p-6 text-center space-y-3">
                <p className="text-sm font-bold text-slate-900 dark:text-white">or drop your files</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">pdf, images, docs, audio, and more</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={() => {
                      const name = prompt('Nama dokumen PDF/DOC baru:');
                      if (name) {
                        setSources(prev => [
                          { id: Date.now(), title: `${name}.pdf`, type: 'PDF', checked: true },
                          ...prev,
                        ]);
                        setActiveModal(null);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Upload files</span>
                  </button>

                  <button
                    onClick={() => {
                      const url = prompt('Masukkan URL Website / YouTube:');
                      if (url) {
                        setSources(prev => [
                          { id: Date.now(), title: `Web: ${url}`, type: 'DOC', checked: true },
                          ...prev,
                        ]);
                        setActiveModal(null);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-rose-400" />
                    <span>Websites</span>
                  </button>

                  <button
                    onClick={() => alert('Menghubungkan ke Google Drive Maxy Academy...')}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-1.5"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    <span>Drive</span>
                  </button>

                  <button
                    onClick={() => {
                      const text = prompt('Tempel teks acuan baru:');
                      if (text) {
                        setSources(prev => [
                          { id: Date.now(), title: `Catatan Teks: ${text.slice(0, 20)}...`, type: 'DOC', checked: true },
                          ...prev,
                        ]);
                        setActiveModal(null);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied text</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar Limit */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Kapasitas Sumber Dokumen</span>
                  <span>{sources.length} / 50</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${(sources.length / 50) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* FEATURE EXPLANATION MODAL (ChatGPT Simulator Style)                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {explanationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#181c26] border border-blue-500/40 rounded-3xl p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {explanationModal.badge}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{explanationModal.category}</span>
                </div>
                <button
                  onClick={() => setExplanationModal(null)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full hover:bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{explanationModal.title}</h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                {explanationModal.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Key Features & Capabilities:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {explanationModal.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-blue-300">💡 Cara Mengaplikasikan:</span>
                <p className="text-slate-600 dark:text-slate-300">{explanationModal.howToUse}</p>
              </div>

              {explanationModal.actionButtonText && (
                <button
                  onClick={() => handleModalAction(explanationModal.actionKey)}
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
