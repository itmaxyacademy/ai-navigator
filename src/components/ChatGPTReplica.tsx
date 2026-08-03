import React, { useState, useEffect } from 'react';
import { generateWithGemini } from '../services/gemini';
import { 
  Sparkles, Search, PanelLeft, Image as ImageIcon, BookOpen, Plug, 
  Folder, Code, MoreHorizontal, Plus, Mic, Radio, ChevronDown, 
  FileText, BarChart3, Globe, Brain, X, Copy, Check, Send, 
  SquarePen, HelpCircle, Zap, Camera, Paperclip, Lightbulb,
  Monitor, Smartphone, Menu, MessageSquare, Wand2, ExternalLink
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

export const ChatGPTReplica: React.FC = () => {
  // Active modal state
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);

  // View Mode state: 'desktop' | 'mobile'
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

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Desktop sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Plus (+) Dropdown state
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  // Chat execution state
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Model selection dropdown state
  const [selectedModel, setSelectedModel] = useState('ChatGPT');
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);

  // Modal explanation data dictionary
  const modalData: Record<string, ModalContent> = {
    'new-chat': {
      title: 'New Chat (Obrolan Baru)',
      category: 'Manajemen Percakapan',
      badge: 'Core Feature',
      iconName: 'SquarePen',
      description: 'Memulai sesi percakapan baru dengan memori konteks bersih (clean context window). Memastikan pertanyaan baru tidak terdistorsi oleh topik obrolan sebelumnya.',
      keyFeatures: [
        'Membersihkan riwayat memori sementara',
        'Membuat thread percakapan terpisah di histori',
        'Mengoptimalkan respons AI agar fokus pada topik baru'
      ],
      howToUse: 'Klik ikon "New chat" di sidebar kiri atau gunakan pintasan keyboard Ctrl+Shift+O kapan saja Anda ingin memulai obrolan topik baru.'
    },
    'images': {
      title: 'Images / DALL-E 3',
      category: 'Multimodal Generatif Visual',
      badge: 'Visual AI',
      iconName: 'Image',
      description: 'Fitur pembuat dan pengedit gambar otomatis bertenaga DALL-E 3. Mampu menghasilkan ilustrasi, desain produk, foto realistis, hingga diagram dari instruksi teks.',
      keyFeatures: [
        'Pembuatan gambar berkualitas tinggi dari deskripsi teks',
        'In-painting & pengeditan bagian gambar tertentu',
        'Penyesuaian rasio aspek (1:1, 16:9, 9:16) dan gaya visual'
      ],
      howToUse: 'Ketik "Buatkan gambar..." di kotak pesan, atau klik menu Images untuk mengeksplorasi galeri dan template gambar DALL-E.'
    },
    'library': {
      title: 'Library & My GPTs',
      category: 'Koleksi & Asisten Kustom',
      badge: 'Personalization',
      iconName: 'BookOpen',
      description: 'Pusat penyimpanan percakapan penting, template prompt favorit, instruksi khusus (Custom Instructions), dan koleksi bot GPTs buatan komunitas.',
      keyFeatures: [
        'Akses cepat ke Custom GPTs favorit Anda',
        'Penyimpanan instruksi persona pengguna (Custom Instructions)',
        'Pengorganisasian arsip obrolan dan referensi penting'
      ],
      howToUse: 'Buka Library untuk mengelola instruksi khusus Anda atau meluncurkan GPT spesialis seperti Canvas Designer atau Code Tutor.'
    },
    'plugins': {
      title: 'Plugins & External Extensions',
      category: 'Integrasi Ekosistem Pihak Ke-3',
      badge: 'Integration',
      iconName: 'Plug',
      description: 'Ekstensi tambahan untuk menghubungkan ChatGPT dengan aplikasi eksternal seperti Zapier, WolframAlpha, Expedia, Canva, dan database real-time.',
      keyFeatures: [
        'Panggilan API langsung ke aplikasi pihak ketiga',
        'Komputasi matematika presisi tinggi via Wolfram',
        'Otomatisasi alur kerja dan pencarian tiket/hotel'
      ],
      howToUse: 'Aktifkan plugin pilihan di Toko Plugin sebelum memulaiObrolan agar ChatGPT dapat mengakses data eksternal secara otomatis.'
    },
    'projects': {
      title: 'Projects / Workspace Folders',
      category: 'Manajemen Proyek & Kolaborasi',
      badge: 'Organization',
      iconName: 'Folder',
      description: 'Ruang kerja terstruktur untuk mengelompokkan dokumen, prompt khusus, dan konteks obrolan dalam satu folder proyek yang rapi.',
      keyFeatures: [
        'Folderisasi thread chat berdasarkan nama proyek',
        'Pengunggahan berkas referensi bersama untuk seluruh obrolan proyek',
        'Isolasi konteks proyek agar riset tetap terorganisir'
      ],
      howToUse: 'Buat Project baru, unggah dokumen acuan proyek, dan mulailah obrolan di dalam folder proyek tersebut.'
    },
    'codex': {
      title: 'Codex / Code Interpreter',
      category: 'Pemrograman & Analisis Data',
      badge: 'Advanced Data',
      iconName: 'Code',
      description: 'Lingkungan eksekusi kode Python terisolasi (sandbox) yang mampu menjalankan skrip pemrograman, menganalisis dataset Excel/CSV, dan merender grafik instan.',
      keyFeatures: [
        'Eksekusi skrip Python langsung di server terisolasi',
        'Pembersihan, analisis statistik, & pemrosesan file data',
        'Generasi grafik interaktif & ekspor berkas (.xlsx, .png, .pdf)'
      ],
      howToUse: 'Unggah berkas Excel/CSV Anda via tombol (+), lalu minta Codex melakukan analisis data atau pembuatan grafik otomatis.'
    },
    'plus-menu': {
      title: 'Menu Lampiran & Fitur Spesialis (+ Button)',
      category: 'Input Multimodal',
      badge: 'Action Bar',
      iconName: 'Plus',
      description: 'Pintu masuk utama untuk melampirkan berkas, memicu pembuatan gambar DALL-E, mengaktifkan analisis data Python, atau beralih ke pencarian web real-time.',
      keyFeatures: [
        'Pengunggah file dokumen & gambar',
        'Pilihan mode pencarian web & reasoning',
        'Koneksi langsung ke fitur ekosistem OpenAI'
      ],
      howToUse: 'Klik tombol (+) di sebelah kiri bar input pesan untuk membuka pilihan lampiran atau mode analisis.'
    },
    'upload-file': {
      title: 'Upload File / Document Parsing',
      category: 'Pengolahan Dokumen',
      badge: 'Multimodal',
      iconName: 'FileText',
      description: 'Mengunggah berkas PDF, Word, TXT, Excel, atau CSV untuk dibaca, dirangkum, diekstrak datanya, atau diubah formatnya oleh AI.',
      keyFeatures: [
        'Pembacaan dokumen multi-halaman PDF & Docx',
        'Pencarian informasi spesifik di dalam file besar',
        'Rangkuman eksekutif dan ekstraksi tabel'
      ],
      howToUse: 'Klik tombol (+), pilih "Upload file", lalu pilih dokumen dari komputer Anda untuk diproses oleh ChatGPT.'
    },
    'create-image': {
      title: 'Create an Image (DALL-E 3 Shortcut)',
      category: 'Generasi Visual',
      badge: 'DALL-E 3',
      iconName: 'ImageIcon',
      description: 'Pintasan langsung untuk mengaktifkan pembuat gambar DALL-E 3 dengan perintah teks visual spesifik.',
      keyFeatures: [
        'Penerjemahan deskripsi bahasa alami menjadi gambar visual',
        'Pilihan gaya: Digital Art, 3D Render, Oil Painting, Line Art',
        'Generasi cepat dengan resolusi tinggi'
      ],
      howToUse: 'Pilih "Create an image" di menu (+), lalu ketik deskripsi objek atau suasana gambar yang ingin dibuat.'
    },
    'code-analysis': {
      title: 'Code Analysis & Data Science',
      category: 'Analisis Data',
      badge: 'Python Sandbox',
      iconName: 'BarChart3',
      description: 'Mengaktifkan lingkungan analisis kode Python untuk memeriksa bug, menjalankan manipulasi data Pandas/Numpy, atau plot visual.',
      keyFeatures: [
        'Refactoring & debugging kode instan',
        'Pemrosesan tabel data spasial & finansial',
        'Visualisasi grafik matplotlib & seaborn'
      ],
      howToUse: 'Pilih "Code analysis" di menu (+), lalu tempelkan kode program Anda atau unggah file data.'
    },
    'web-search': {
      title: 'Web Search / Browse with Bing',
      category: 'Riset Real-Time',
      badge: 'Live Web',
      iconName: 'Globe',
      description: 'Menghubungkan ChatGPT ke mesin pencari web secara langsung untuk menyajikan berita terbaru, artikel ilmiah, dan harga pasar terkini lengkap dengan rujukan sitasi.',
      keyFeatures: [
        'Pencarian informasi langsung di internet',
        'Sertaan pranala sitasi (citation links) terverifikasi',
        'Pembaruan data terkini tanpa batas cut-off pelatihan'
      ],
      howToUse: 'Pilih "Look something up" atau "Web search" di menu (+) untuk menanyakan peristiwa terkini.'
    },
    'reason-think': {
      title: 'Reason / Deep Thinking (o1 / o3-mini)',
      category: 'Penalaran Logika',
      badge: 'Reasoning Engine',
      iconName: 'Brain',
      description: 'Model penalaran mendalam yang secara otomatis berpikir secara sistematis sebelum menjawab. Sangat kuat untuk masalah matematika, logika rumit, dan algoritma koding.',
      keyFeatures: [
        'Rantai pemikiran internal (Thought Chain) terstruktur',
        'Akurasi ekstra untuk sains, fisika, & logika',
        'Minim halusinasi pada masalah kuantitatif'
      ],
      howToUse: 'Pilih "Reason / Think" di menu (+) saat Anda menghadapi soal matematika atau algoritma koding yang kompleks.'
    },
    'dictate': {
      title: 'Dictate (Dikte Suara / Speech-to-Text)',
      category: 'Input Suara',
      badge: 'Whisper Engine',
      iconName: 'Mic',
      description: 'Fitur transkripsi suara instan bertenaga OpenAI Whisper. Mengubah suara lisan Anda menjadi teks akurat langsung di kotak pesan tanpa perlu mengetik.',
      keyFeatures: [
        'Transkripsi bahasa Indonesia & asing secara presisi',
        'Akurasi tinggi terhadap istilah teknis & pemanduan otomatis',
        'Penghemat waktu tanpa perlu mengetik manual'
      ],
      howToUse: 'Klik ikon Mikrofon di sudut kanan bar input, bicaralah dengan jelas, dan teks akan terisi otomatis.'
    },
    'start-voice': {
      title: 'Start Voice / Advanced Voice Mode',
      category: 'Percakapan Suara Real-Time',
      badge: 'Interactive Voice',
      iconName: 'Radio',
      description: 'Modus percakapan suara dua arah secara langsung dengan intonasi emosional alami, respon ultra-cepat, dan kemampuan dipotong (interupsi) saat berbicara.',
      keyFeatures: [
        'Interaksi suara langsung dengan latensi ultra-rendah',
        'Intonasi, humor, dan ekspresi nada suara mirip manusia',
        'Latihan percakapan bahasa asing & simulasi wawancara kerja'
      ],
      howToUse: 'Klik ikon Gelombang Suara (Waveform) di sudut kanan bar input untuk masuk ke layar percakapan suara interaktif.'
    },
    'upgrade': {
      title: 'Upgrade Plan (ChatGPT Plus & Team)',
      category: 'Langganan & Lisensi OpenAI',
      badge: 'Plus & Enterprise',
      iconName: 'Sparkles',
      description: 'Layanan langganan berbayar OpenAI yang membuka akses penuh ke model AI paling cerdas (GPT-4o & seri o1), kapasitas analisis dokumen besar, pembuatan gambar DALL-E 3 tanpa hambatan, dan Advanced Voice Mode.',
      keyFeatures: [
        'Akses prioritas tanpa antrean ke GPT-4o & model penalaran o1/o3-mini',
        'Batas penggunaan (Rate Limit) hingga 5x lebih tinggi dari skema Gratis',
        'Akses langsung ke Advanced Voice Mode dengan interaksi audio alami',
        'Pembuatan gambar DALL-E 3 dan analisis koding Python tanpa batas',
        'Fitur kolaborasi ruang kerja (Workspace Projects) untuk tim'
      ],
      howToUse: 'Klik tombol Upgrade di pojok kanan atas atau bawah sidebar, pilih paket langganan (Plus $20/bulan atau Team), lalu selesaikan prosedur pembayaran.'
    },
    'camera': {
      title: 'Camera / Ambil Foto Langsung',
      category: 'Input Visual Real-Time',
      badge: 'Mobile Camera',
      iconName: 'Camera',
      description: 'Mengambil gambar secara instan menggunakan kamera smartphone/perangkat Anda untuk langsung dianalisis oleh ChatGPT.',
      keyFeatures: [
        'Pengambilan foto objek, dokumen, papan tulis, atau error layar secara langsung',
        'Analisis visual OCR & pemajangan solusi matematis/koding',
        'Pertanyaan kontekstual dari lingkungan nyata sekitar Anda'
      ],
      howToUse: 'Klik ikon Camera di menu (+), izinkan akses kamera pada perangkat Anda, lalu ambil foto objek yang ingin ditanyakan.'
    },
    'photos': {
      title: 'Photos / Galeri Gambar',
      category: 'Analisis Gambar & Media',
      badge: 'Visual Upload',
      iconName: 'Image',
      description: 'Pilih satu atau beberapa gambar dari galeri perangkat Anda untuk dianalisis, diekstrak teksnya, atau dijadikan acuan referensi desain.',
      keyFeatures: [
        'Pengunggah multi-gambar bersamaan dari galeri HP',
        'Identifikasi tumbuhan, hewan, lokasi wisata, atau komponen elektronik',
        'Penerjemahan teks dari tangkapan layar (screenshot)'
      ],
      howToUse: 'Klik ikon Photos di menu (+), pilih foto dari galeri Anda, lalu beri perintah analisis pada kotak pesan.'
    },
    'files': {
      title: 'Files / Unggah Berkas Dokumen',
      category: 'Pengolahan Berkas',
      badge: 'Document Parsing',
      iconName: 'Paperclip',
      description: 'Unggah berkas dokumen (PDF, Word, TXT, CSV, Excel) dari memori penyimpanan perangkat untuk dibaca dan dirangkum secara otomatis.',
      keyFeatures: [
        'Ekstraksi informasi cepat dari dokumen tebal',
        'Analisis data statistik & tabel finansial',
        'Konversi format file & pembuatan ringkasan eksekutif'
      ],
      howToUse: 'Klik ikon Files di menu (+), pilih berkas dokumen dari manajer file HP/PC Anda, dan minta ChatGPT memprosesnya.'
    },
    'thinking': {
      title: 'Thinking / Penalaran Mendalam (o1 & o3)',
      category: 'Reasoning Engine',
      badge: 'Deep Thought',
      iconName: 'Lightbulb',
      description: 'Mode pemikiran mendalam di mana AI merencanakan langkah-langkah logika secara sistematis sebelum memberikan jawaban final.',
      keyFeatures: [
        'Kemampuan pemecahan masalah matematika & fisika tingkat lanjut',
        'Debugging algoritma pemrograman dan struktur data kompleks',
        'Proses penalaran transparan (Thought Chain)'
      ],
      howToUse: 'Aktifkan opsi Thinking di menu (+), lalu ajukan pertanyaan kuantitatif atau masalah logika yang membutuhkan penalaran mendalam.'
    },
    'model-picker': {
      title: 'Model Selector (ChatGPT-4o / o1)',
      category: 'Pengaturan Model AI',
      badge: 'Engine Switcher',
      iconName: 'Zap',
      description: 'Menu untuk memilih arsitektur AI yang aktif. GPT-4o untuk obrolan umum multimodal yang cepat, atau seri o1 untuk penalaran sains dan logika mendalam.',
      keyFeatures: [
        'ChatGPT Plus: Model paling cerdas & cepat',
        'ChatGPT Standard: Performa handal untuk tugas sehari-hari',
        'Akses instan ke penalaran mendalam o1/o3-mini'
      ],
      howToUse: 'Klik dropdown "ChatGPT" di pojok kiri atas layar untuk mengganti model sesuai kebutuhan tugas Anda.'
    }
  };

  const handleOpenModal = (key: string) => {
    if (modalData[key]) {
      setActiveModal(modalData[key]);
    }
    setIsPlusMenuOpen(false);
    setIsModelPickerOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputPrompt.trim()) return;

    const userText = inputPrompt;
    setInputPrompt('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // Coba panggil AI asli (dibatasi 3x)
      const realAiResponse = await generateWithGemini(userText);
      
      if (realAiResponse) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `[Respon Live AI (${selectedModel})]\n\n${realAiResponse}`
          }
        ]);
      } else {
        // Fallback ke simulasi jika kuota habis atau gagal
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `[Respon Simulasi ChatGPT (${selectedModel})]\n\nTerima kasih telah mengajukan instruksi: "${userText}".\n\nSebagai model AI multimodal dari OpenAI, saya siap membantu Anda menyelesaikan tugas ini secara offline. Gunakan menu (+) untuk melampirkan berkas, mencoba DALL-E 3, atau menguji fitur suara!`
          }
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `[Respon Simulasi ChatGPT (${selectedModel})]\n\nTerima kasih telah mengajukan instruksi: "${userText}".\n\nSebagai model AI multimodal dari OpenAI, saya siap membantu Anda menyelesaikan tugas ini secara offline. Gunakan menu (+) untuk melampirkan berkas, mencoba DALL-E 3, atau menguji fitur suara!`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Model Dropdown Component (Matches Uploaded Screenshot Image 4)
  const renderModelDropdown = () => (
    <div className="absolute top-11 left-0 w-72 bg-[#2f2f2f] border border-neutral-700/80 rounded-2xl shadow-2xl p-2 z-50 space-y-1.5 text-xs text-left animate-in fade-in duration-150">
      {/* ChatGPT Plus */}
      <div 
        onClick={() => {
          handleOpenModal('upgrade');
          setIsModelPickerOpen(false);
        }}
        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-700/70 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3 flex-wrap max-w-full">
          <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-slate-900 dark:text-white shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-left">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">ChatGPT Plus</span>
            <span className="text-[10px] text-neutral-400 block leading-tight">Our smartest model & more</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal('upgrade');
            setIsModelPickerOpen(false);
          }}
          className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-slate-900 dark:text-white font-bold text-[11px] rounded-full border border-neutral-600 transition-colors shadow-sm"
        >
          Upgrade
        </button>
      </div>

      {/* ChatGPT */}
      <div 
        onClick={() => {
          setSelectedModel('ChatGPT');
          setIsModelPickerOpen(false);
        }}
        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-700/70 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 flex-wrap max-w-full">
          <div className="w-7 h-7 rounded-full bg-black border border-neutral-700 flex items-center justify-center text-slate-900 dark:text-white shrink-0">
            <svg className="w-4 h-4 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0813 4.7792-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4954 4.4953zM3.6 18.304a4.4707 4.4707 0 0 1-.5358-3.0141l.142.0852 4.7839 2.7582a.771.771 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0806.0806 0 0 1-.0332.0615L9.74 19.9502A4.4992 4.4992 0 0 1 3.6 18.304zm-1.3887-10.8a4.4707 4.4707 0 0 1 2.3453-1.9684v5.6726a.7806.7806 0 0 0 .3928.6765l5.8286 3.3638-2.0152 1.1638a.0806.0806 0 0 1-.0711 0l-4.8303-2.7866A4.4992 4.4992 0 0 1 2.2113 7.504zm15.4216 2.4552l-5.8333-3.3685 2.0152-1.1638a.0806.0806 0 0 1 .0711 0l4.8303 2.7866a4.4992 4.4992 0 0 1-.6731 8.1299v-5.7058a.7806.7806 0 0 0-.4102-.6784zm3.0335-3.0141a4.4707 4.4707 0 0 1 .5358 3.0141l-.142-.0852-4.7839-2.7582a.771.771 0 0 0-.7806 0l-5.838 3.3685V8.1519a.0806.0806 0 0 1 .0332-.0615l4.84-2.7914a4.4992 4.4992 0 0 1 6.1355 1.6433zM8.3065 12.863l-2.02-1.1638a.0806.0806 0 0 1-.038-.052V6.0646a4.504 4.504 0 0 1 7.3718-3.4545l-.1419.0813-4.7792 2.7582a.7948.7948 0 0 0-.3927.6813v6.7321zm2.1803-3.1382l2.3608-1.3651 2.3608 1.3651v2.7301l-2.3608 1.3652-2.3608-1.3652z"/>
            </svg>
          </div>
          <div className="text-left">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">ChatGPT</span>
            <span className="text-[10px] text-neutral-400 block leading-tight">Great for everyday tasks</span>
          </div>
        </div>
        <Check className="w-4 h-4 text-slate-900 dark:text-white" />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-3 font-sans">
      
      {/* VIEW MODE TOGGLE (Desktop vs Mobile View) */}
      <div className="flex items-center justify-between p-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 px-1 flex-wrap max-w-full">
          <span className="text-xs font-bold text-neutral-300">Tampilan Simulator:</span>
        </div>
        <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-neutral-800 flex-wrap max-w-full">
          <button
            onClick={() => {
              setViewMode('desktop');
              setIsMobileSidebarOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'desktop'
                ? 'bg-neutral-800 text-emerald-400 shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View (Default)</span>
          </button>
          <button
            onClick={() => {
              setViewMode('mobile');
              setIsPlusMenuOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mobile'
                ? 'bg-neutral-800 text-emerald-400 shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: DESKTOP LAYOUT */}
      {viewMode === 'desktop' && (
        <div className="flex h-[620px] w-full bg-[#171717] text-slate-800 dark:text-slate-100 rounded-2xl overflow-hidden font-sans border border-neutral-800 shadow-2xl relative">
          
          {/* LEFT SIDEBAR REPLICA */}
          <div className={`${
            isSidebarCollapsed
              ? 'w-0 overflow-hidden border-none opacity-0 transition-all duration-300'
              : 'w-60 bg-[#171717] border-r border-neutral-800 flex flex-col justify-between shrink-0 select-none transition-all duration-300'
          }`}>
            {/* Top Header & Nav Items */}
            <div className="p-3 space-y-3">
              {/* Top Bar Icons */}
              <div className="flex items-center justify-between px-2 pt-1 pb-2">
                <button
                  onClick={() => {
                    setMessages([]);
                    setInputPrompt('');
                  }}
                  className="flex items-center gap-2 group cursor-pointer p-1 rounded-xl hover:bg-neutral-800/80 transition-all flex-wrap max-w-full"
                  title="Kembali ke halaman 'Where should we begin?'"
                >
                  <div className="w-7 h-7 rounded-full bg-black border border-neutral-700 flex items-center justify-center shadow-md group-hover:border-neutral-500 transition-colors">
                    <svg className="w-4 h-4 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0813 4.7792-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4954 4.4953zM3.6 18.304a4.4707 4.4707 0 0 1-.5358-3.0141l.142.0852 4.7839 2.7582a.771.771 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0806.0806 0 0 1-.0332.0615L9.74 19.9502A4.4992 4.4992 0 0 1 3.6 18.304zm-1.3887-10.8a4.4707 4.4707 0 0 1 2.3453-1.9684v5.6726a.7806.7806 0 0 0 .3928.6765l5.8286 3.3638-2.0152 1.1638a.0806.0806 0 0 1-.0711 0l-4.8303-2.7866A4.4992 4.4992 0 0 1 2.2113 7.504zm15.4216 2.4552l-5.8333-3.3685 2.0152-1.1638a.0806.0806 0 0 1 .0711 0l4.8303 2.7866a4.4992 4.4992 0 0 1-.6731 8.1299v-5.7058a.7806.7806 0 0 0-.4102-.6784zm3.0335-3.0141a4.4707 4.4707 0 0 1 .5358 3.0141l-.142-.0852-4.7839-2.7582a.771.771 0 0 0-.7806 0l-5.838 3.3685V8.1519a.0806.0806 0 0 1 .0332-.0615l4.84-2.7914a4.4992 4.4992 0 0 1 6.1355 1.6433zM8.3065 12.863l-2.02-1.1638a.0806.0806 0 0 1-.038-.052V6.0646a4.504 4.504 0 0 1 7.3718-3.4545l-.1419.0813-4.7792 2.7582a.7948.7948 0 0 0-.3927.6813v6.7321zm2.1803-3.1382l2.3608-1.3651 2.3608 1.3651v2.7301l-2.3608 1.3652-2.3608-1.3652z"/>
                    </svg>
                  </div>
                </button>
                <div className="flex items-center gap-1 flex-wrap max-w-full">
                  <button 
                    onClick={() => handleOpenModal('web-search')}
                    className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
                    title="Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-slate-900 dark:text-white transition-colors"
                    title="Collapse Sidebar"
                  >
                    <PanelLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Menu Items List */}
              <nav className="space-y-0.5 text-xs font-medium">
                <button
                  onClick={() => handleOpenModal('new-chat')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-slate-900 dark:text-white font-semibold transition-colors group flex-wrap max-w-full"
                >
                  <SquarePen className="w-4 h-4 text-neutral-300 group-hover:text-emerald-400 transition-colors" />
                  <span>New chat</span>
                </button>

                <button
                  onClick={() => handleOpenModal('images')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800/60 text-neutral-300 hover:text-slate-900 dark:text-white transition-colors group flex-wrap max-w-full"
                >
                  <ImageIcon className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                  <span>Images</span>
                </button>

                <button
                  onClick={() => handleOpenModal('library')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800/60 text-neutral-300 hover:text-slate-900 dark:text-white transition-colors group flex-wrap max-w-full"
                >
                  <BookOpen className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
                  <span>Library</span>
                </button>

                <button
                  onClick={() => handleOpenModal('plugins')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800/60 text-neutral-300 hover:text-slate-900 dark:text-white transition-colors group flex-wrap max-w-full"
                >
                  <Plug className="w-4 h-4 text-neutral-400 group-hover:text-purple-400 transition-colors" />
                  <span>Plugins</span>
                </button>

                <button
                  onClick={() => handleOpenModal('projects')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800/60 text-neutral-300 hover:text-slate-900 dark:text-white transition-colors group flex-wrap max-w-full"
                >
                  <Folder className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                  <span>Projects</span>
                </button>

                <button
                  onClick={() => handleOpenModal('codex')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800/60 text-neutral-300 hover:text-slate-900 dark:text-white transition-colors group flex-wrap max-w-full"
                >
                  <Code className="w-4 h-4 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                  <span>Codex</span>
                </button>

                <button
                  onClick={() => handleOpenModal('library')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800/60 text-neutral-400 hover:text-slate-900 dark:text-white transition-colors flex-wrap max-w-full"
                >
                  <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                  <span>More</span>
                </button>
              </nav>

              {/* Recents Section */}
              <div className="pt-3 border-t border-neutral-800/80 space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase px-3 tracking-wider">
                  Recents
                </span>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setMessages([
                      { sender: 'user', text: 'Permintaan Gambar Karakter Maskot AI' },
                      { sender: 'ai', text: 'Berikut adalah draf desain karakter maskot AI yang lucu & bersahabat untuk aplikasi edukasi.' }
                    ])}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800/50 truncate block hover:text-slate-900 dark:text-white"
                  >
                    Permintaan Gambar Karakter
                  </button>
                  <button
                    onClick={() => setMessages([
                      { sender: 'user', text: 'Analisis Strategi Marketing 2026' },
                      { sender: 'ai', text: 'Analisis strategi marketing digital dengan fokus pada TikTok & Instagram Reels.' }
                    ])}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:bg-neutral-800/50 truncate block hover:text-slate-900 dark:text-white"
                  >
                    Analisis Strategi Marketing
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom User Profile Card */}
            <div className="p-3 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 flex-wrap max-w-full">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-inner">
                  MA
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Maxy Academy</span>
                  <span className="text-[10px] text-neutral-400 block">Free Plan</span>
                </div>
              </div>
              <button
                onClick={() => handleOpenModal('upgrade')}
                className="px-2.5 py-1 text-[10px] font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>

          {/* MAIN CENTER CANVAS AREA */}
          <div className="flex-1 bg-[#212121] flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Header Bar */}
            <div className="h-14 px-5 border-b border-neutral-800/60 flex items-center justify-between shrink-0 bg-[#212121]/90 backdrop-blur">
              {/* Left Actions / Model Selector */}
              <div className="flex items-center gap-2 flex-wrap max-w-full">
                {isSidebarCollapsed && (
                  <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-slate-900 dark:text-white rounded-lg transition-colors"
                    title="Expand Sidebar"
                  >
                    <PanelLeft className="w-4 h-4" />
                  </button>
                )}
                {/* Model Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-neutral-800 text-sm font-bold text-slate-900 dark:text-white transition-colors flex-wrap max-w-full"
                  >
                    <span>{selectedModel}</span>
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  </button>

                  {/* Model Picker Popup Dropdown */}
                  {isModelPickerOpen && renderModelDropdown()}
                </div>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center gap-2 flex-wrap max-w-full">
                <button
                  onClick={() => handleOpenModal('upgrade')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-emerald-400 rounded-full border border-neutral-700 transition-colors flex-wrap max-w-full"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade</span>
                </button>
              </div>
            </div>

            {/* Center Scrollable Chat Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-center max-w-3xl mx-auto w-full">
              
              {messages.length === 0 ? (
                /* Starting View: "Where should we begin?" */
                <div className="text-center space-y-6 my-auto">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Where should we begin?
                  </h1>

                  {/* Central Input Box Capsule */}
                  <div className="relative bg-[#2f2f2f] border border-neutral-700/80 rounded-3xl p-3 shadow-2xl transition-all focus-within:border-neutral-500">
                    
                    {/* Text Area Input */}
                    <textarea
                      rows={2}
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask anything"
                      className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-neutral-400 focus:outline-none resize-none px-2 pt-1"
                    />

                    {/* Bottom Bar Controls inside Capsule */}
                    <div className="flex items-center justify-between pt-2 px-1">
                      
                      {/* Left (+) Button & Dropdown Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                          className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-full text-neutral-200 transition-colors flex items-center justify-center"
                          title="Add Attachments / Tools (+)"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        {/* PLUS DROPDOWN MENU */}
                        {isPlusMenuOpen && (
                          <div className="absolute bottom-12 left-0 w-64 bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-xs text-left">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                              Pilih Lampiran / Mode AI
                            </div>

                            <button
                              onClick={() => handleOpenModal('upload-file')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <FileText className="w-4 h-4 text-emerald-400" />
                              <span>Upload file / Documents</span>
                            </button>

                            <button
                              onClick={() => handleOpenModal('create-image')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <ImageIcon className="w-4 h-4 text-amber-400" />
                              <span>Create an image (DALL-E 3)</span>
                            </button>

                            <button
                              onClick={() => handleOpenModal('code-analysis')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <BarChart3 className="w-4 h-4 text-indigo-400" />
                              <span>Code & Data analysis</span>
                            </button>

                            <button
                              onClick={() => handleOpenModal('web-search')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <Globe className="w-4 h-4 text-cyan-400" />
                              <span>Web search / Browse</span>
                            </button>

                            <button
                              onClick={() => handleOpenModal('reason-think')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <Brain className="w-4 h-4 text-purple-400" />
                              <span>Reason / Think (o1/o3)</span>
                            </button>

                            <div className="pt-1 border-t border-neutral-800">
                              <button
                                onClick={() => handleOpenModal('plus-menu')}
                                className="w-full text-center py-1.5 text-[10px] font-bold text-neutral-400 hover:text-slate-900 dark:text-white"
                              >
                                ℹ️ Penjelasan Lengkap Fitur (+)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Action Icons: Dictate & Start Voice */}
                      <div className="flex items-center gap-2 flex-wrap max-w-full">
                        {/* Dictate (Microphone) Button */}
                        <button
                          onClick={() => handleOpenModal('dictate')}
                          className="p-2 hover:bg-neutral-700/80 rounded-full text-neutral-300 hover:text-slate-900 dark:text-white transition-colors"
                          title="Dictate (Speech to Text)"
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        {/* Start Voice (Waveform) Button */}
                        <button
                          onClick={() => handleOpenModal('start-voice')}
                          className="p-2 bg-neutral-200 hover:bg-white text-black rounded-full transition-all shadow-md hover:scale-105"
                          title="Start Voice Mode"
                        >
                          <Radio className="w-4 h-4" />
                        </button>

                        {/* Send Button */}
                        {inputPrompt.trim() && (
                          <button
                            onClick={handleSendMessage}
                            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all shadow-md"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Cards Under Box */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setInputPrompt('Buatkan gambar poster kafe kopi modern bernuansa vintage.');
                        handleOpenModal('create-image');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#2f2f2f] hover:bg-neutral-700 border border-neutral-700/60 rounded-2xl text-xs font-semibold text-neutral-200 transition-colors flex-wrap max-w-full"
                    >
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Create an image</span>
                    </button>

                    <button
                      onClick={() => {
                        setInputPrompt('Bantu saya mengedit email lamaran kerja agar terlihat profesional.');
                        handleOpenModal('upload-file');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#2f2f2f] hover:bg-neutral-700 border border-neutral-700/60 rounded-2xl text-xs font-semibold text-neutral-200 transition-colors flex-wrap max-w-full"
                    >
                      <SquarePen className="w-4 h-4 text-emerald-400" />
                      <span>Write or edit</span>
                    </button>

                    <button
                      onClick={() => {
                        setInputPrompt('Cari informasi terbaru perkembangan teknologi AI Generatif 2026.');
                        handleOpenModal('web-search');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#2f2f2f] hover:bg-neutral-700 border border-neutral-700/60 rounded-2xl text-xs font-semibold text-neutral-200 transition-colors flex-wrap max-w-full"
                    >
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Look something up</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Messages View */
                <div className="space-y-4 my-auto">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                          msg.sender === 'user'
                            ? 'bg-neutral-700 text-slate-900 dark:text-white rounded-tr-none'
                            : 'bg-[#2f2f2f] border border-neutral-700 text-neutral-200 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-neutral-600/40">
                          <span className="font-bold text-[10px] text-neutral-400">
                            {msg.sender === 'user' ? 'Pengguna' : selectedModel}
                          </span>
                          {msg.sender === 'ai' && (
                            <button
                              onClick={() => handleCopy(msg.text, idx)}
                              className="text-neutral-400 hover:text-slate-900 dark:text-white flex items-center gap-1 text-[10px] flex-wrap max-w-full"
                            >
                              {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copiedIndex === idx ? 'Tersalin' : 'Salin'}
                            </button>
                          )}
                        </div>
                        <p className="whitespace-pre-line font-mono">{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#2f2f2f] border border-neutral-700 text-neutral-400 rounded-2xl px-4 py-3 text-xs flex items-center gap-2 flex-wrap max-w-full">
                        <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>ChatGPT sedang mengetik...</span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Sticky Input for Ongoing Chat */}
                  <div className="pt-4">
                    <div className="relative bg-[#2f2f2f] border border-neutral-700 rounded-2xl p-2.5 flex items-center gap-2 flex-wrap max-w-full">
                      <div className="relative">
                        <button
                          onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                          className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-full text-neutral-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        {/* PLUS DROPDOWN MENU */}
                        {isPlusMenuOpen && (
                          <div className="absolute bottom-12 left-0 w-64 bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-xs text-left">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                              Pilih Lampiran / Mode AI
                            </div>

                            <button
                              onClick={() => handleOpenModal('upload-file')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <FileText className="w-4 h-4 text-emerald-400" />
                              <span>Upload file / Documents</span>
                            </button>

                            <button
                              onClick={() => handleOpenModal('create-image')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <ImageIcon className="w-4 h-4 text-amber-400" />
                              <span>Create an image (DALL-E 3)</span>
                            </button>

                            <button
                              onClick={() => handleOpenModal('code-analysis')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <BarChart3 className="w-4 h-4 text-indigo-400" />
                              <span>Code & Data analysis</span>
                            </button>

                            <button
                              onClick={() => handleOpenModal('web-search')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <Globe className="w-4 h-4 text-cyan-400" />
                              <span>Web search / Browse</span>
                            </button>

                            <button
                              onClick={() => handleOpenModal('reason-think')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-slate-900 dark:text-white text-left font-medium flex-wrap max-w-full"
                            >
                              <Brain className="w-4 h-4 text-purple-400" />
                              <span>Reason / Think (o1/o3)</span>
                            </button>

                            <div className="pt-1 border-t border-neutral-800">
                              <button
                                onClick={() => handleOpenModal('plus-menu')}
                                className="w-full text-center py-1.5 text-[10px] font-bold text-neutral-400 hover:text-slate-900 dark:text-white"
                              >
                                ℹ️ Penjelasan Lengkap Fitur (+)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Tulis balasan..."
                        className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none placeholder-neutral-500 min-w-0"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: MOBILE LAYOUT (Matches Uploaded Mobile Screenshots) */}
      {viewMode === 'mobile' && (
        <div className="w-full max-w-[390px] mx-auto h-[640px] bg-black text-slate-900 dark:text-white rounded-[32px] border-4 border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col justify-between font-sans select-none">
          
          {/* MOBILE TOP HEADER BAR (Image 1) */}
          <div className="h-14 px-4 bg-black border-b border-neutral-900 flex items-center justify-between shrink-0 z-20">
            {/* Left: Hamburger Menu Icon */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 hover:bg-neutral-800 rounded-xl text-neutral-200 transition-colors"
              title="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Center: Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
                className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white hover:text-neutral-300 transition-colors flex-wrap max-w-full"
              >
                <span>{selectedModel}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>
              {isModelPickerOpen && renderModelDropdown()}
            </div>

            {/* Right: Upgrade & Chat Icon */}
            <div className="flex items-center gap-2 flex-wrap max-w-full">
              <button
                onClick={() => handleOpenModal('upgrade')}
                className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors flex-wrap max-w-full"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade</span>
              </button>
              <button
                onClick={() => {
                  setMessages([]);
                  setInputPrompt('');
                  handleOpenModal('new-chat');
                }}
                className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-300"
                title="New Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MOBILE MAIN CANVAS AREA */}
          <div className="flex-1 bg-black overflow-y-auto p-4 flex flex-col justify-end space-y-4 relative">
            
            {messages.length === 0 ? (
              <div className="space-y-3 my-auto w-full">
                {/* Quick suggestions stacked above input capsule matching Image 1 */}
                <div className="space-y-2 pt-12">
                  <div 
                    onClick={() => {
                      setInputPrompt('Buatkan gambar poster kafe kopi modern.');
                      handleOpenModal('create-image');
                    }}
                    className="flex items-center justify-between p-3 bg-black border border-neutral-900 rounded-2xl hover:bg-neutral-900 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-wrap max-w-full">
                      <ImageIcon className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-medium text-neutral-200">Create an image</span>
                    </div>
                    <X className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-300" />
                  </div>

                  <div 
                    onClick={() => {
                      setInputPrompt('Bantu saya mengedit tulisan ini.');
                      handleOpenModal('upload-file');
                    }}
                    className="flex items-center justify-between p-3 bg-black border border-neutral-900 rounded-2xl hover:bg-neutral-900 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-wrap max-w-full">
                      <SquarePen className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-medium text-neutral-200">Write or edit</span>
                    </div>
                    <X className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-300" />
                  </div>

                  <div 
                    onClick={() => {
                      setInputPrompt('Cari informasi terbaru di web.');
                      handleOpenModal('web-search');
                    }}
                    className="flex items-center justify-between p-3 bg-black border border-neutral-900 rounded-2xl hover:bg-neutral-900 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-wrap max-w-full">
                      <Globe className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-medium text-neutral-200">Look something up</span>
                    </div>
                    <X className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-300" />
                  </div>
                </div>
              </div>
            ) : (
              /* Active Messages List in Mobile View */
              <div className="space-y-3 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-neutral-800 text-slate-900 dark:text-white rounded-tr-none'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-line font-mono">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-xs text-neutral-400 flex items-center gap-2 flex-wrap max-w-full">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>ChatGPT sedang mengetik...</span>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE INPUT CAPSULE (Image 1 & 2) */}
            <div className="relative pt-2">
              
              {/* MOBILE (+) POPOVER MENU (Image 2) */}
              {isPlusMenuOpen && (
                <div className="absolute bottom-16 left-0 w-60 bg-[#1c1c1e] border border-neutral-800 rounded-3xl p-2.5 shadow-2xl z-50 space-y-1 text-xs text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-2">
                  <button
                    onClick={() => handleOpenModal('camera')}
                    className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-800 text-left transition-colors flex-wrap max-w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-200">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-neutral-200">Camera</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal('photos')}
                    className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-800 text-left transition-colors flex-wrap max-w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-200">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-neutral-200">Photos</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal('files')}
                    className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-800 text-left transition-colors flex-wrap max-w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-200">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-neutral-200">Files</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal('create-image')}
                    className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-800 text-left transition-colors flex-wrap max-w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-200">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-neutral-200">Create image</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal('thinking')}
                    className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-800 text-left transition-colors flex-wrap max-w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-200">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-neutral-200">Thinking</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal('web-search')}
                    className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-800 text-left transition-colors flex-wrap max-w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-200">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-neutral-200">Web search</span>
                  </button>
                </div>
              )}

              {/* INPUT CAPSULE BOX */}
              <div className="bg-[#212121] border border-neutral-800 rounded-[28px] p-3 shadow-2xl flex flex-col justify-between space-y-2">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything"
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none placeholder-neutral-500 px-1"
                />

                <div className="flex items-center justify-between pt-1">
                  {/* (+) Button */}
                  <button
                    onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                    className="w-8 h-8 rounded-full bg-[#2f2f2f] hover:bg-neutral-700 text-neutral-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Right Action Icons */}
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <button 
                      onClick={() => handleOpenModal('plus-menu')}
                      className="p-1.5 text-neutral-400 hover:text-slate-900 dark:text-white"
                      title="Preset Tools"
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => handleOpenModal('dictate')}
                      className="w-8 h-8 rounded-full bg-[#2f2f2f] hover:bg-neutral-700 text-neutral-200 flex items-center justify-center transition-colors"
                      title="Dictate"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => handleOpenModal('start-voice')}
                      className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg relative hover:scale-105 transition-transform"
                      title="Start Voice Mode"
                    >
                      <Radio className="w-4 h-4" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 border-2 border-black" />
                    </button>

                    {inputPrompt.trim() && (
                      <button
                        onClick={handleSendMessage}
                        className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE SIDEBAR DRAWER OVERLAY (Image 3) */}
          {isMobileSidebarOpen && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-start animate-in fade-in duration-200">
              <div className="w-[82%] h-full bg-black border-r border-neutral-900 p-4 flex flex-col justify-between text-xs space-y-3 overflow-y-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                  <button
                    onClick={() => {
                      setMessages([]);
                      setInputPrompt('');
                      setIsMobileSidebarOpen(false);
                    }}
                    className="w-7 h-7 rounded-full bg-black border border-neutral-800 flex items-center justify-center text-slate-900 dark:text-white"
                  >
                    <svg className="w-4 h-4 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0813 4.7792-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4954 4.4953zM3.6 18.304a4.4707 4.4707 0 0 1-.5358-3.0141l.142.0852 4.7839 2.7582a.771.771 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0806.0806 0 0 1-.0332.0615L9.74 19.9502A4.4992 4.4992 0 0 1 3.6 18.304zm-1.3887-10.8a4.4707 4.4707 0 0 1 2.3453-1.9684v5.6726a.7806.7806 0 0 0 .3928.6765l5.8286 3.3638-2.0152 1.1638a.0806.0806 0 0 1-.0711 0l-4.8303-2.7866A4.4992 4.4992 0 0 1 2.2113 7.504zm15.4216 2.4552l-5.8333-3.3685 2.0152-1.1638a.0806.0806 0 0 1 .0711 0l4.8303 2.7866a4.4992 4.4992 0 0 1-.6731 8.1299v-5.7058a.7806.7806 0 0 0-.4102-.6784zm3.0335-3.0141a4.4707 4.4707 0 0 1 .5358 3.0141l-.142-.0852-4.7839-2.7582a.771.771 0 0 0-.7806 0l-5.838 3.3685V8.1519a.0806.0806 0 0 1 .0332-.0615l4.84-2.7914a4.4992 4.4992 0 0 1 6.1355 1.6433zM8.3065 12.863l-2.02-1.1638a.0806.0806 0 0 1-.038-.052V6.0646a4.504 4.504 0 0 1 7.3718-3.4545l-.1419.0813-4.7792 2.7582a.7948.7948 0 0 0-.3927.6813v6.7321zm2.1803-3.1382l2.3608-1.3651 2.3608 1.3651v2.7301l-2.3608 1.3652-2.3608-1.3652z"/>
                    </svg>
                  </button>

                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <button 
                      onClick={() => { handleOpenModal('web-search'); setIsMobileSidebarOpen(false); }}
                      className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-1 font-medium">
                  <button
                    onClick={() => { handleOpenModal('new-chat'); setIsMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-900 text-slate-900 dark:text-white font-semibold text-xs flex-wrap max-w-full"
                  >
                    <SquarePen className="w-4 h-4 text-neutral-300" />
                    <span>New chat</span>
                  </button>

                  <button
                    onClick={() => { handleOpenModal('images'); setIsMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-900 text-neutral-300 text-xs flex-wrap max-w-full"
                  >
                    <ImageIcon className="w-4 h-4 text-neutral-400" />
                    <span>Images</span>
                  </button>

                  <button
                    onClick={() => { handleOpenModal('library'); setIsMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-900 text-neutral-300 text-xs flex-wrap max-w-full"
                  >
                    <BookOpen className="w-4 h-4 text-neutral-400" />
                    <span>Library</span>
                  </button>

                  <button
                    onClick={() => { handleOpenModal('plugins'); setIsMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-900 text-neutral-300 text-xs flex-wrap max-w-full"
                  >
                    <Plug className="w-4 h-4 text-neutral-400" />
                    <span>Plugins</span>
                  </button>

                  <button
                    onClick={() => { handleOpenModal('projects'); setIsMobileSidebarOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-900 text-neutral-300 text-xs"
                  >
                    <div className="flex items-center gap-3 flex-wrap max-w-full">
                      <Folder className="w-4 h-4 text-neutral-400" />
                      <span>Projects</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-neutral-500" />
                  </button>

                  <button
                    onClick={() => { handleOpenModal('codex'); setIsMobileSidebarOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-900 text-neutral-300 text-xs"
                  >
                    <div className="flex items-center gap-3 flex-wrap max-w-full">
                      <Code className="w-4 h-4 text-neutral-400" />
                      <span>Codex</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                  </button>

                  <button
                    onClick={() => { handleOpenModal('library'); setIsMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-900 text-neutral-400 text-xs flex-wrap max-w-full"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span>More</span>
                  </button>
                </nav>

                {/* Recents */}
                <div className="pt-2 border-t border-neutral-900 space-y-1">
                  <div className="flex items-center justify-between px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    <span>Recents</span>
                    <div className="flex items-center gap-2 flex-wrap max-w-full">
                      <MoreHorizontal className="w-3.5 h-3.5 text-neutral-500" />
                      <SquarePen className="w-3.5 h-3.5 text-neutral-500" />
                    </div>
                  </div>

                  <div className="space-y-0.5 text-xs text-neutral-300">
                    <button
                      onClick={() => {
                        setMessages([
                          { sender: 'user', text: 'Permintaan Gambar Karakter Maskot AI' },
                          { sender: 'ai', text: 'Berikut adalah draf desain karakter maskot AI yang lucu & bersahabat untuk aplikasi edukasi.' }
                        ]);
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-900 truncate block hover:text-slate-900 dark:text-white"
                    >
                      Permintaan Gambar Karakter
                    </button>
                    <button
                      onClick={() => {
                        setMessages([
                          { sender: 'user', text: 'Analisis Strategi Marketing 2026' },
                          { sender: 'ai', text: 'Analisis strategi marketing digital dengan fokus pada TikTok & Instagram Reels.' }
                        ]);
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:bg-neutral-900 truncate block hover:text-slate-900 dark:text-white"
                    >
                      Analisis Strategi Marketing
                    </button>
                  </div>
                </div>

                {/* User Profile Footer */}
                <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                      MA
                    </div>
                    <div className="text-left leading-tight">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Maxy Academy</span>
                      <span className="text-[10px] text-neutral-500 block">Free</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleOpenModal('upgrade'); setIsMobileSidebarOpen(false); }}
                    className="px-2.5 py-1 text-[10px] font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-full border border-neutral-800"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* POPUP EXPLANATION MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1e1e1e] border border-neutral-700 rounded-3xl max-w-lg w-full p-6 space-y-5 text-left shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeModal.badge || 'ChatGPT Feature'}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {activeModal.category}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap max-w-full">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {activeModal.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-slate-900 dark:text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
              <p className="text-sm text-neutral-200 leading-normal">
                {activeModal.description}
              </p>

              {/* Key Features List */}
              <div className="bg-[#121212] p-4 rounded-2xl border border-neutral-800 space-y-2">
                <span className="font-bold text-emerald-400 block text-xs">
                  ✨ Kemampuan Kunci & Manfaat Utama:
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-neutral-300">
                  {activeModal.keyFeatures.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>

              {/* How to Use Box */}
              <div className="bg-neutral-800/60 p-3.5 rounded-xl border border-neutral-700/60 space-y-1">
                <span className="font-bold text-amber-300 block text-[11px] flex items-center gap-1 flex-wrap max-w-full">
                  <HelpCircle className="w-3.5 h-3.5" /> Cara Menggunakan:
                </span>
                <p className="text-neutral-300 italic text-[11px]">
                  {activeModal.howToUse}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-900 dark:text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                Saya Paham, Tutup Modal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
