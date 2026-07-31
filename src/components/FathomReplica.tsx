import React, { useState, useEffect } from 'react';
import {
  Video, Mic, FileText, Sparkles, Play, Pause, Volume2, VolumeX,
  Maximize, Share2, MoreHorizontal, Copy, Check, Search, Settings,
  HelpCircle, Star, User, Calendar, Clock, ArrowLeft, ChevronDown,
  CheckSquare, Square, Zap, Send, MessageSquare, AlertCircle, X,
  ExternalLink, Mail, Layers, Radio, ListFilter, Users, Bookmark,
  Bell, TrendingUp, RefreshCw, CheckCircle2, Info
} from 'lucide-react';

export interface MeetingCall {
  id: string;
  uniqueId: string;
  title: string;
  date: string;
  fullDate: string;
  time: string;
  monthGroup: 'June' | 'May';
  durationMins: number;
  hasAudio: boolean;
  participantsCount: number;
  participants: { name: string; avatarBg: string; initial: string }[];
  summary: {
    objective: string;
    keyPoints: { topic: string; details: string }[];
  };
  transcript: { speaker: string; time: string; text: string }[];
  actionItems: {
    id: string;
    text: string;
    timestamp: string;
    assignee: string;
    isCompleted: boolean;
  }[];
}

export const FathomReplica: React.FC = () => {
  // Navigation State: 'my-calls' (Tahap 1) | 'call-detail' (Tahap 2)
  const [activeStage, setActiveStage] = useState<'my-calls' | 'call-detail'>('my-calls');

  // Top Navigation Tabs in Tahap 1
  const [navTab, setNavTab] = useState<'my-calls' | 'team-calls' | 'playlists' | 'alerts' | 'deals'>('my-calls');

  // Selected Meeting Call for Detail View
  const [selectedCallId, setSelectedCallId] = useState<string>('call-1');

  // Detail View Content Tabs: 'summary' | 'transcript' | 'ask-fathom'
  const [detailTab, setDetailTab] = useState<'summary' | 'transcript' | 'ask-fathom'>('summary');

  // Summary generation progress simulation
  const [generatingProgress, setGeneratingProgress] = useState<number>(27);
  const [isNoteReady, setIsNoteReady] = useState<boolean>(false);

  // Summary options
  const [summaryMode, setSummaryMode] = useState<string>('Enhanced');
  const [summaryLang, setSummaryLang] = useState<string>('ID');

  // Copy Feedback States
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);
  const [copiedFollowUp, setCopiedFollowUp] = useState<boolean>(false);
  const [copiedForState, setCopiedForState] = useState<boolean>(false);

  // Ask Fathom Panel (Tahap 1) State
  const [globalAskInput, setGlobalAskInput] = useState<string>('');
  const [globalAskMessages, setGlobalAskMessages] = useState<{ sender: 'user' | 'fathom'; text: string }[]>([]);
  const [globalAskLoading, setGlobalAskLoading] = useState<boolean>(false);
  const [globalAskScope, setGlobalAskScope] = useState<string>('My Calls');

  // Ask Fathom Tab (Tahap 2) State
  const [callAskInput, setCallAskInput] = useState<string>('');
  const [callAskMessages, setCallAskMessages] = useState<{ sender: 'user' | 'fathom'; text: string }[]>([]);
  const [callAskLoading, setCallAskLoading] = useState<boolean>(false);

  // Transcript Search State
  const [transcriptSearch, setTranscriptSearch] = useState<string>('');

  // Video Player Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1x');
  const [playerProgress, setPlayerProgress] = useState<number>(0);

  // Toast notice
  const [toast, setToast] = useState<string | null>(null);

  // Mock Meetings Data
  const [meetings, setMeetings] = useState<MeetingCall[]>([
    {
      id: 'call-1',
      uniqueId: 'mxy-8821-app',
      title: 'Review Kurikulum & Demo AI Maxy Academy',
      date: 'Jun 19',
      fullDate: 'Jun 19, 2026',
      time: '6:57 AM',
      monthGroup: 'June',
      durationMins: 72,
      hasAudio: true,
      participantsCount: 3,
      participants: [
        { name: 'Nabila Maxy', avatarBg: 'bg-amber-800', initial: 'N' },
        { name: 'Wahyudi Maxy', avatarBg: 'bg-emerald-800', initial: 'W' },
        { name: 'Fathom Notetaker', avatarBg: 'bg-purple-800', initial: 'F' }
      ],
      summary: {
        objective: 'Meninjau demo produk Maxy Academy dan menyelaraskan prioritas pengembangan kurikulum AI.',
        keyPoints: [
          {
            topic: 'Maxy AI Engine & Applet Architecture',
            details: 'Demo menunjukkan sistem koding AI berkinerja tinggi. Arahan: fokus pada pelacakan progres dan pencatatan aktivitas inti tanpa over-engineering.'
          },
          {
            topic: 'Dasbor Penjualan & Pelatihan Tim',
            details: 'UI dasbor harus disederhanakan untuk eksekutif (Pak Budi), menyediakan ringkasan tingkat tinggi metrik kunci (prospek berisiko, total nilai pipeline).'
          },
          {
            topic: 'Peningkatan Modul Pembelajaran Interactive LLM',
            details: 'Peserta menyetujui penambahan simulator interaktif untuk Google AI Studio, Treblo Music, dan Fathom Notetaker.'
          }
        ]
      },
      transcript: [
        { speaker: 'Nabila Maxy', time: '0:15', text: 'Selamat pagi rekan-rekan Maxy Academy, mari kita mulai sesi peninjauan demo produk dan kurikulum AI hari ini.' },
        { speaker: 'Wahyudi Maxy', time: '1:05', text: 'Terima kasih Nabila. Fokus utama kita adalah menyelaraskan fitur pelacakan aktivitas siswa agar tetap ringan dan responsif.' },
        { speaker: 'Nabila Maxy', time: '3:20', text: 'Saya setuju. Untuk dasbor penjualan Pak Budi, kita cukup tampilkan angka penting seperti total prospek dan status pendaftaran.' },
        { speaker: 'Wahyudi Maxy', time: '6:59', text: 'Oke, tolong siapkan Google Form survey dampak pelatihan dan distribusikan ke seluruh peserta setelah sesi.' },
        { speaker: 'Nabila Maxy', time: '12:40', text: 'Siap, laporan aktivitas Fathom juga akan saya kirimkan setiap hari ke grup koordinasi.' }
      ],
      actionItems: [
        { id: 'act-1', text: 'Buat Google Form untuk survey dampak pelatihan; distribusikan ke peserta setelah sesi', timestamp: '@ 6:59', assignee: 'Nabila Maxy', isCompleted: false },
        { id: 'act-2', text: 'Periksa log aktivitas Fathom; kirim laporan harian ke grup tim', timestamp: '@ 12:40', assignee: 'Nabila Maxy', isCompleted: true },
        { id: 'act-3', text: 'Tambahkan aset desain baru ke slide presentasi kurikulum 20', timestamp: '@ 25:15', assignee: 'Nabila Maxy', isCompleted: false },
        { id: 'act-4', text: 'Lakukan alignment program pelatihan dengan tim eksekutif (CEO Circle & Operasional)', timestamp: '@ 56:23', assignee: 'Wahyudi Maxy', isCompleted: false },
        { id: 'act-5', text: 'Perbarui dasbor penjualan untuk Pak Budi: daftar panggilan harian dan prospek berisiko', timestamp: '@ 1:04:01', assignee: 'Nabila Maxy', isCompleted: false }
      ]
    },
    {
      id: 'call-2',
      uniqueId: 'mxy-2311-noaudio',
      title: 'Sync Tim Pengembang FlowBuddy (Silent Session)',
      date: 'Jun 11',
      fullDate: 'Jun 11, 2026',
      time: '10:00 AM',
      monthGroup: 'June',
      durationMins: 23,
      hasAudio: false,
      participantsCount: 2,
      participants: [
        { name: 'Developer Tim', avatarBg: 'bg-slate-700', initial: 'D' },
        { name: 'Fathom Bot', avatarBg: 'bg-slate-50 dark:bg-[#0f172a]', initial: 'F' }
      ],
      summary: {
        objective: 'Sesi koordinasi internal (Peringatan: Tidak ada rekaman suara yang terdeteksi).',
        keyPoints: [
          {
            topic: 'Peringatan Audio',
            details: 'Sistem mencatat durasi 23 menit tetapi mikrofon tidak diaktifkan selama rapat berlangsung.'
          }
        ]
      },
      transcript: [
        { speaker: 'System', time: '0:00', text: '[NO AUDIO DETECTED - Silakan periksa izin mikrofon pada panggilan berikutnya]' }
      ],
      actionItems: [
        { id: 'act-201', text: 'Jadwalkan ulang sesi sync teknis dengan mikrofon terhubung', timestamp: '@ 0:01', assignee: 'Developer Tim', isCompleted: false }
      ]
    },
    {
      id: 'call-3',
      uniqueId: 'mxy-4490-eval',
      title: 'Evaluasi Dashboard Penjualan Pak Budi',
      date: 'Jun 9',
      fullDate: 'Jun 9, 2026',
      time: '2:15 PM',
      monthGroup: 'June',
      durationMins: 24,
      hasAudio: true,
      participantsCount: 3,
      participants: [
        { name: 'Pak Budi', avatarBg: 'bg-blue-800', initial: 'B' },
        { name: 'Nabila Maxy', avatarBg: 'bg-amber-800', initial: 'N' },
        { name: 'Wahyudi Maxy', avatarBg: 'bg-emerald-800', initial: 'W' }
      ],
      summary: {
        objective: 'Meninjau laporan berkala penjualan dan menetapkan target akuisisi peserta baru.',
        keyPoints: [
          {
            topic: 'Target Akuisisi',
            details: 'Target kuartal ini disepakati meningkat 20% dengan fokus pada bootcamp AI Engineer.'
          }
        ]
      },
      transcript: [
        { speaker: 'Pak Budi', time: '0:30', text: 'Saya melihat kenaikan antusiasme pada modul pembelajaran LLM.' }
      ],
      actionItems: [
        { id: 'act-301', text: 'Kirimkan draf brosur program AI ke Pak Budi', timestamp: '@ 15:20', assignee: 'Nabila Maxy', isCompleted: false }
      ]
    },
    {
      id: 'call-4',
      uniqueId: 'mxy-3310-gemini',
      title: 'Workshop Gemini 3 Engine & Agentic Coding',
      date: 'Jun 9',
      fullDate: 'Jun 9, 2026',
      time: '4:00 PM',
      monthGroup: 'June',
      durationMins: 31,
      hasAudio: true,
      participantsCount: 4,
      participants: [
        { name: 'Trainer Maxy', avatarBg: 'bg-purple-800', initial: 'T' },
        { name: 'Nabila Maxy', avatarBg: 'bg-amber-800', initial: 'N' }
      ],
      summary: {
        objective: 'Pelatihan teknis integrasi Gemini 3 Flash dan Antigravity Agent.',
        keyPoints: [
          {
            topic: 'Integrasi API',
            details: 'Pembahasan pembuatan proxy server-side untuk menyembunyikan API Keys.'
          }
        ]
      },
      transcript: [
        { speaker: 'Trainer Maxy', time: '1:10', text: 'Selalu gunakan server-side route untuk mengamankan Gemini API key.' }
      ],
      actionItems: [
        { id: 'act-401', text: 'Update file .env.example di repository utama', timestamp: '@ 20:10', assignee: 'Trainer Maxy', isCompleted: true }
      ]
    },
    {
      id: 'call-5',
      uniqueId: 'mxy-1102-strat',
      title: 'Perencanaan Strategis Kuartal 3 Maxy Academy',
      date: 'Jun 3',
      fullDate: 'Jun 3, 2026',
      time: '11:00 AM',
      monthGroup: 'June',
      durationMins: 17,
      hasAudio: true,
      participantsCount: 2,
      participants: [
        { name: 'CEO Maxy', avatarBg: 'bg-rose-800', initial: 'C' },
        { name: 'Wahyudi Maxy', avatarBg: 'bg-emerald-800', initial: 'W' }
      ],
      summary: {
        objective: 'Penetapan milestone ekspansi materi AI dan sertifikasi kompetensi.',
        keyPoints: [
          {
            topic: 'Sertifikasi Kompetensi',
            details: 'Sertifikat otomatis disiapkan untuk peserta yang menyelesaikan 20 modul.'
          }
        ]
      },
      transcript: [
        { speaker: 'CEO Maxy', time: '0:45', text: 'Pastikan seluruh 20 modul memiliki simulator interaktif yang kaya.' }
      ],
      actionItems: [
        { id: 'act-501', text: 'Finalisasi kurikulum modul 20 Fathom Notetaker', timestamp: '@ 10:15', assignee: 'Wahyudi Maxy', isCompleted: true }
      ]
    }
  ]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const selectedCall = meetings.find(m => m.id === selectedCallId) || meetings[0];

  // Progress Bar Simulation when opening a meeting
  useEffect(() => {
    if (activeStage === 'call-detail') {
      setIsNoteReady(false);
      setGeneratingProgress(27);

      const timer1 = setTimeout(() => setGeneratingProgress(65), 800);
      const timer2 = setTimeout(() => setGeneratingProgress(90), 1600);
      const timer3 = setTimeout(() => {
        setGeneratingProgress(100);
        setIsNoteReady(true);
      }, 2300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [selectedCallId, activeStage]);

  // Audio progress animation simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayerProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 600);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Search query for meetings list
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [askError, setAskError] = useState<string | null>(null);

  // Handle Global Ask Fathom Submit
  const handleGlobalAskSubmit = async (promptText?: string) => {
    const text = promptText || globalAskInput;
    if (!text.trim()) return;

    setGlobalAskInput(text);
    const userMsg = { sender: 'user' as const, text };
    setGlobalAskMessages(prev => [...prev, userMsg]);
    setGlobalAskInput('');
    setGlobalAskLoading(true);
    setAskError(null);

    try {
      const res = await fetch('/api/fathom-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          meetingsContext: meetings,
          scope: globalAskScope,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal menghubungi Fathom Gemini AI.');
      }

      const data = await res.json();
      const fathomAnswer = data.answer || 'Tidak ada jawaban.';

      setGlobalAskMessages(prev => [...prev, { sender: 'fathom', text: fathomAnswer }]);
      showToastMsg('✨ Jawaban Fathom AI berhasil diterima!');
    } catch (err: any) {
      console.error('Fathom ask error:', err);
      setAskError(err.message || 'Terjadi kesalahan saat memproses pertanyaan.');

      // Fallback response for offline / error
      let fallbackAnswer = '';
      const q = text.toLowerCase();
      if (q.includes('summarize') || q.includes('minggu ini')) {
        fallbackAnswer = 'Berdasarkan 5 rapat Anda minggu ini: Tim berhasil menyelesaikan peninjauan kurikulum AI Maxy Academy, mengonfirmasi penambahan simulator Fathom, serta merencanakan peningkatan dasbor penjualan Pak Budi.';
      } else if (q.includes('urgent') || q.includes('mendesak')) {
        fallbackAnswer = 'Hal mendesak baru-baru ini: Distribusi survey dampak pelatihan ke peserta setelah sesi dan pembaruan dasbor prospek penjualan Pak Budi.';
      } else if (q.includes('promised') || q.includes('janji')) {
        fallbackAnswer = 'Tugas yang dijanjikan minggu ini: (1) Distribusi Google Form survey oleh Nabila, (2) Laporan harian Fathom ke grup tim, (3) Alignment program dengan tim eksekutif oleh Wahyudi.';
      } else {
        fallbackAnswer = `[Fathom AI - Scope: ${globalAskScope}] Menjawab: "${text}" — Seluruh hasil rekaman rapat Anda telah terindeks secara aman. Tidak ditemukan kendala kritis pada proyek Maxy Academy.`;
      }

      setGlobalAskMessages(prev => [...prev, { sender: 'fathom', text: fallbackAnswer }]);
    } finally {
      setGlobalAskLoading(false);
    }
  };

  // Handle Call Detail Ask Fathom Submit
  const handleCallAskSubmit = async (promptText?: string) => {
    const text = promptText || callAskInput;
    if (!text.trim()) return;

    setCallAskInput(text);
    const userMsg = { sender: 'user' as const, text };
    setCallAskMessages(prev => [...prev, userMsg]);
    setCallAskInput('');
    setCallAskLoading(true);

    try {
      const res = await fetch('/api/fathom-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Regarding meeting "${selectedCall.title}": ${text}`,
          meetingsContext: [selectedCall],
          scope: 'Selected Meeting Call',
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal memproses pertanyaan.');
      }

      const data = await res.json();
      setCallAskMessages(prev => [...prev, { sender: 'fathom', text: data.answer }]);
    } catch (err: any) {
      let fathomAnswer = '';
      if (text.toLowerCase().includes('why') || text.toLowerCase().includes('mengapa')) {
        fathomAnswer = `Rapat "${selectedCall.title}" dijadwalkan untuk meninjau progres pengembangan produk Maxy Academy, menyeleraskan kurikulum AI, dan mengatasi isu fitur yang berlebihan (over-engineering).`;
      } else if (text.toLowerCase().includes('progress') || text.toLowerCase().includes('kemajuan')) {
        fathomAnswer = 'Langkah kunci untuk kemajuan: (1) Distribusi Google Form survey pelatihan, (2) Penyederhanaan UI dasbor eksekutif Pak Budi, (3) Pelaporan harian aktivitas Fathom Notetaker.';
      } else {
        fathomAnswer = `[Fathom AI] Mengenai "${selectedCall.title}": Peserta rapat menyetujui poin aksi utama dan menetapkan penanggung jawab untuk setiap tugas.`;
      }

      setCallAskMessages(prev => [...prev, { sender: 'fathom', text: fathomAnswer }]);
    } finally {
      setCallAskLoading(false);
    }
  };

  // Toggle Action Item Checkbox
  const toggleActionItem = (meetingId: string, actId: string) => {
    setMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          actionItems: m.actionItems.map(a => a.id === actId ? { ...a, isCompleted: !a.isCompleted } : a)
        };
      }
      return m;
    }));
    showToastMsg('Status Action Item diperbarui!');
  };

  // Copy helper
  const handleCopySummary = () => {
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
    showToastMsg('Ringkasan rapat berhasil disalin!');
  };

  const handleCopyTranscript = () => {
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
    showToastMsg('Transkrip rapat berhasil disalin!');
  };

  const handleCopyFollowUp = () => {
    setCopiedFollowUp(true);
    setTimeout(() => setCopiedFollowUp(false), 2000);
    showToastMsg('Follow-up Email berhasil disalin!');
  };

  const handleCopyFor = () => {
    setCopiedForState(true);
    setTimeout(() => setCopiedForState(false), 2000);
    showToastMsg('Action items berhasil disalin untuk clipboard!');
  };

  const filteredTranscript = selectedCall.transcript.filter(t => 
    t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  const filteredMeetings = meetings.filter(call => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = call.title.toLowerCase().includes(q);
      const matchParticipant = call.participants.some(p => p.name.toLowerCase().includes(q));
      if (!matchTitle && !matchParticipant) return false;
    }

    if (navTab === 'my-calls') {
      return call.hasAudio;
    } else if (navTab === 'team-calls') {
      return true;
    } else if (navTab === 'playlists') {
      const titleLower = call.title.toLowerCase();
      return titleLower.includes('kurikulum') || titleLower.includes('workshop') || titleLower.includes('sync') || titleLower.includes('perencanaan');
    } else if (navTab === 'alerts') {
      const titleLower = call.title.toLowerCase();
      return !call.hasAudio || titleLower.includes('evaluasi') || titleLower.includes('silent');
    } else if (navTab === 'deals') {
      const titleLower = call.title.toLowerCase();
      return titleLower.includes('penjualan') || titleLower.includes('evaluasi');
    }
    return true;
  });

  return (
    <div className="w-full min-h-[750px] bg-[#0d0f12] text-slate-800 dark:text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col relative shadow-2xl">
      {/* Global Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-cyan-400 flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* GLOBAL HEADER */}
      <header className="h-14 bg-[#12151a] border-b border-slate-200 dark:border-slate-800/90 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Fathom Logo */}
          <div 
            onClick={() => {
              setActiveStage('my-calls');
              showToastMsg('Kembali ke My Calls (Tahap 1)');
            }}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-950/50 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-slate-900 dark:text-white fill-current" />
            </div>
            <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white font-mono">FATHOM</span>
          </div>

          {/* Search Call Recordings */}
          <div className="relative hidden md:block w-64 lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Call Recordings"
              className="w-full bg-[#1b2028] border border-slate-300 dark:border-slate-700/70 rounded-xl py-1.5 px-3 pl-9 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Right Header Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={() => showToastMsg('Upgrade Fathom Pro - Akses Tanpa Batas')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            Upgrade
          </button>

          <button 
            onClick={() => showToastMsg('Pengaturan Akun & Notetaker')}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800 rounded-lg text-xs flex items-center space-x-1"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden lg:inline">Settings</span>
          </button>

          <button 
            onClick={() => showToastMsg('Help & Feedback Center')}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800 rounded-lg text-xs flex items-center space-x-1"
            title="Help & Feedback"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden lg:inline">Help & Feedback</span>
          </button>

          {/* Rewards Badge */}
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/80 px-2.5 py-1 rounded-lg flex items-center space-x-1 text-xs font-bold text-amber-400 shadow-inner">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>45</span>
          </div>

          {/* User Profile Icon */}
          <div 
            onClick={() => showToastMsg('Profil Pengguna: Wahyudi (Maxy Academy)')}
            className="w-8 h-8 rounded-full bg-purple-700 border border-purple-500 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs cursor-pointer hover:ring-2 hover:ring-cyan-400 transition-all"
            title="Wahyudi (Maxy Academy)"
          >
            W
          </div>
        </div>
      </header>

      {/* TAHAP 1: MY CALLS (HALAMAN UTAMA DAFTAR REKAMAN) */}
      {activeStage === 'my-calls' && (
        <div className="flex-1 flex flex-col bg-[#0b0d10] overflow-hidden">
          {/* Sub Navigation Bar */}
          <div className="px-6 pt-3 pb-0 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-[#111419] shrink-0 overflow-x-auto">
            <div className="flex items-center space-x-6 text-xs font-bold text-slate-500 dark:text-slate-400">
              <button
                onClick={() => {
                  setNavTab('my-calls');
                  showToastMsg('Menampilkan My Calls');
                }}
                className={`pb-3 border-b-2 transition-colors ${navTab === 'my-calls' ? 'border-cyan-400 text-cyan-400' : 'border-transparent hover:text-slate-700 dark:text-slate-200'}`}
              >
                My Calls
              </button>

              <button
                onClick={() => {
                  setNavTab('team-calls');
                  showToastMsg('Team Calls: Rekaman rapat milik seluruh tim Maxy Academy');
                }}
                className={`pb-3 border-b-2 transition-colors ${navTab === 'team-calls' ? 'border-cyan-400 text-cyan-400' : 'border-transparent hover:text-slate-700 dark:text-slate-200'}`}
              >
                Team Calls
              </button>

              <button
                onClick={() => {
                  setNavTab('playlists');
                  showToastMsg('Playlists: Kumpulan potongan rekaman dikurasi untuk topik tertentu');
                }}
                className={`pb-3 border-b-2 transition-colors ${navTab === 'playlists' ? 'border-cyan-400 text-cyan-400' : 'border-transparent hover:text-slate-700 dark:text-slate-200'}`}
              >
                Playlists
              </button>

              <button
                onClick={() => {
                  setNavTab('alerts');
                  showToastMsg('Alerts: Notifikasi otomatis saat kata kunci tertentu disebut dalam rapat');
                }}
                className={`pb-3 border-b-2 transition-colors ${navTab === 'alerts' ? 'border-cyan-400 text-cyan-400' : 'border-transparent hover:text-slate-700 dark:text-slate-200'}`}
              >
                Alerts
              </button>

              <button
                onClick={() => {
                  setNavTab('deals');
                  showToastMsg('Deals: Integrasi rekaman rapat dengan data penjualan / CRM');
                }}
                className={`pb-3 border-b-2 transition-colors ${navTab === 'deals' ? 'border-cyan-400 text-cyan-400' : 'border-transparent hover:text-slate-700 dark:text-slate-200'}`}
              >
                Deals
              </button>
            </div>
          </div>

          {/* Main Content Grid: Left Calls Cards List (Cols 8) + Right Ask Fathom Panel (Cols 4) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* LEFT CALLS LIST AREA */}
            <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* Group Month: June */}
              <div>
                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>June</span>
                </h3>

                {filteredMeetings.length === 0 ? (
                  <div className="bg-[#141820] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
                    <Video className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tidak ada rekaman rapat yang sesuai dengan filter/pencarian ini.</p>
                    <p className="text-xs text-slate-500">Coba ubah tab navigasi atau kata kunci di kolom pencarian.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredMeetings.map(call => (
                      <div
                        key={call.id}
                        onClick={() => {
                          setSelectedCallId(call.id);
                          setActiveStage('call-detail');
                        }}
                        className="bg-[#141820] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 rounded-xl overflow-hidden cursor-pointer group transition-all transform hover:-translate-y-1 shadow-lg flex flex-col justify-between"
                      >
                      {/* Card Thumbnail Box */}
                      <div className="h-32 bg-white dark:bg-slate-900 relative flex items-center justify-center p-3 border-b border-slate-200 dark:border-slate-800/80">
                        {/* Participants Avatar Grid */}
                        <div className="flex items-center space-x-2">
                          {call.participants.map((p, idx) => (
                            <div 
                              key={idx}
                              className={`w-10 h-10 rounded-full ${p.avatarBg} border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs shadow-md group-hover:scale-110 transition-transform`}
                              title={p.name}
                            >
                              {p.initial}
                            </div>
                          ))}
                        </div>

                        {/* Special "NO AUDIO" Warning Banner */}
                        {!call.hasAudio && (
                          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex items-center justify-center text-red-300 font-bold text-xs space-x-1.5 animate-pulse">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span>NO AUDIO</span>
                          </div>
                        )}

                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 bg-slate-100 dark:bg-slate-950/90 border border-slate-300 dark:border-slate-700/80 text-[10px] font-bold text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded shadow">
                          {call.durationMins} mins
                        </div>
                      </div>

                      {/* Card Info Details */}
                      <div className="p-3">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-300 line-clamp-2 leading-snug mb-2">
                          {call.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <span>{call.date}</span>
                          <span className="text-cyan-400/80 font-bold group-hover:underline">Buka Detail &gt;</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>

              {/* Info Note on Navigation Tabs */}
              <div className="bg-[#12161f] border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Panduan Navigasi Tambahan Fathom:</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  <li><strong className="text-slate-600 dark:text-slate-300">Team Calls:</strong> Membuka akses rekaman rapat kolektif milik seluruh anggota tim Maxy Academy.</li>
                  <li><strong className="text-slate-600 dark:text-slate-300">Playlists:</strong> Kumpulan potongan klip rekaman penting yang dapat dikelompokkan berdasarkan materi pelatihan.</li>
                  <li><strong className="text-slate-600 dark:text-slate-300">Alerts:</strong> Notifikasi otomatis saat frasa penting (seperti "kendala", "anggaran", "bug") disebutkan.</li>
                  <li><strong className="text-slate-600 dark:text-slate-300">Deals:</strong> Integrasi cerdas hasil percakapan rapat langsung dengan status pipeline penjualan/CRM.</li>
                </ul>
              </div>
            </div>

            {/* RIGHT "ASK FATHOM" ACCOUNT-LEVEL PANEL */}
            <div className="lg:col-span-4 border-l border-slate-200 dark:border-slate-800/80 bg-[#101318] p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">ASK FATHOM</span>
                  </div>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono">Cross-Meeting Assistant</span>
                </div>

                {/* Account-level Promo Banner */}
                <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed">
                  <span className="font-bold text-amber-300">🎁 Account-level Ask Fathom is here!</span> We're gifting you unlimited use until Aug 1. Limits may apply after.{' '}
                  <a href="#learn" onClick={(e) => { e.preventDefault(); showToastMsg('Informasi kuota Ask Fathom'); }} className="underline font-bold text-amber-400">
                    Learn More
                  </a>
                </div>

                {/* Chat History Messages */}
                {globalAskMessages.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {globalAskMessages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`text-xs p-2.5 rounded-xl max-w-[90%] leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-600 text-slate-900 dark:text-white font-medium' : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {globalAskLoading && (
                  <div className="flex items-center space-x-2 text-xs text-cyan-400 animate-pulse pt-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Fathom sedang menganalisis seluruh rekaman rapat Anda...</span>
                  </div>
                )}

                {askError && (
                  <div className="bg-rose-950/80 border border-rose-800 p-2.5 rounded-xl text-xs text-rose-200 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{askError}</span>
                    </div>
                    <button onClick={() => setAskError(null)} className="text-rose-400 hover:text-slate-900 dark:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Quick Chips Ready-to-Use Questions */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Pertanyaan Cepat Lintas-Rapat:</span>

                  <button
                    onClick={() => handleGlobalAskSubmit('Summarize my meetings from this week')}
                    className="w-full text-left bg-[#181d26] hover:bg-[#202733] border border-slate-300 dark:border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between group"
                  >
                    <span>Summarize my meetings from this week</span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                  </button>

                  <button
                    onClick={() => handleGlobalAskSubmit('Things recently mentioned as urgent')}
                    className="w-full text-left bg-[#181d26] hover:bg-[#202733] border border-slate-300 dark:border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between group"
                  >
                    <span>Things recently mentioned as urgent</span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                  </button>

                  <button
                    onClick={() => handleGlobalAskSubmit("Things I promised I'd do by this week")}
                    className="w-full text-left bg-[#181d26] hover:bg-[#202733] border border-slate-300 dark:border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between group"
                  >
                    <span>Things I promised I'd do by this week</span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* Bottom Input Field & Scope Selector */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 mt-4">
                <div className="relative">
                  <textarea
                    value={globalAskInput}
                    onChange={(e) => setGlobalAskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGlobalAskSubmit();
                      }
                    }}
                    placeholder="Ask anything..."
                    rows={2}
                    className="w-full bg-[#181d26] border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 pr-10 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => handleGlobalAskSubmit()}
                    disabled={!globalAskInput.trim()}
                    className="absolute right-2 bottom-3 p-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-900 dark:text-white rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Scope Pencarian:</span>
                  <select
                    value={globalAskScope}
                    onChange={(e) => setGlobalAskScope(e.target.value)}
                    className="bg-[#181d26] border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs text-cyan-300 font-bold focus:outline-none"
                  >
                    <option value="My Calls">My Calls</option>
                    <option value="Team Calls">Team Calls</option>
                    <option value="All Record">All Record</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAHAP 2: CALL DETAIL (DETAIL REKAMAN SELESAI RAPAT) */}
      {activeStage === 'call-detail' && (
        <div className="flex-1 flex flex-col bg-[#0b0d10] overflow-hidden">
          {/* Back Navigation Bar */}
          <div className="h-10 bg-[#12161e] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                setActiveStage('my-calls');
                showToastMsg('Kembali ke daftar rekaman');
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke My Calls</span>
            </button>

            <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Waktu Rapat: {selectedCall.time}</span>
              <span>•</span>
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">ID: {selectedCall.uniqueId}</span>
            </div>
          </div>

          {/* Main Call Detail Layout Grid (Left Video & Tabs + Right Action Items) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* LEFT AREA: Video Player & Tabs (Cols 8) */}
            <div className="lg:col-span-8 flex flex-col border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-[#0d0f13]">
              {/* VIDEO PLAYER AREA */}
              <div className="bg-black p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col space-y-3">
                {/* Participants Grid Screen */}
                <div className="w-full h-48 sm:h-64 bg-[#14171d] rounded-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
                  <div className="grid grid-cols-3 gap-3 w-full h-full max-w-lg">
                    {selectedCall.participants.map((p, idx) => (
                      <div key={idx} className={`rounded-xl ${p.avatarBg} border border-slate-300 dark:border-slate-700/80 flex flex-col items-center justify-center relative shadow-md`}>
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900/60 border border-slate-600 flex items-center justify-center font-bold text-slate-900 dark:text-white text-base shadow">
                          {p.initial}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 mt-2 bg-slate-100 dark:bg-slate-950/80 px-2 py-0.5 rounded truncate max-w-[90%]">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Top Bar Info Overlay */}
                  <div className="absolute top-2 left-3 text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center space-x-2 bg-slate-100 dark:bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{selectedCall.time} | {selectedCall.uniqueId}</span>
                  </div>
                </div>

                {/* Video Controls Bar */}
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1 px-1">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-900 dark:text-white rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                      {Math.floor((playerProgress * selectedCall.durationMins * 60) / 100 / 60)}:
                      {String(Math.floor((playerProgress * selectedCall.durationMins * 60) / 100 % 60)).padStart(2, '0')} / {selectedCall.durationMins}:00
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 mx-4 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setPlayerProgress(Math.floor((clickX / rect.width) * 100));
                  }}>
                    <div className="bg-cyan-500 h-full transition-all" style={{ width: `${playerProgress}%` }}></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        const speeds = ['1x', '1.25x', '1.5x', '2x'];
                        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                        setPlaybackSpeed(speeds[nextIdx]);
                        showToastMsg(`Kecepatan putar: ${speeds[nextIdx]}`);
                      }}
                      className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold px-2 py-1 rounded border border-slate-300 dark:border-slate-700"
                    >
                      {playbackSpeed}
                    </button>
                    <button onClick={() => showToastMsg('Fullscreen video')} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* TABS HEADER: SUMMARY | TRANSCRIPT | ASK FATHOM */}
              <div className="bg-[#12161e] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-6 text-xs font-bold">
                  <button
                    onClick={() => setDetailTab('summary')}
                    className={`pb-3 border-b-2 transition-colors ${detailTab === 'summary' ? 'border-cyan-400 text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 border-transparent'}`}
                  >
                    SUMMARY
                  </button>

                  <button
                    onClick={() => setDetailTab('transcript')}
                    className={`pb-3 border-b-2 transition-colors ${detailTab === 'transcript' ? 'border-cyan-400 text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 border-transparent'}`}
                  >
                    TRANSCRIPT
                  </button>

                  <button
                    onClick={() => setDetailTab('ask-fathom')}
                    className={`pb-3 border-b-2 transition-colors ${detailTab === 'ask-fathom' ? 'border-cyan-400 text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 border-transparent'}`}
                  >
                    ASK FATHOM
                  </button>
                </div>
              </div>

              {/* TAB 1: SUMMARY CONTENT */}
              {detailTab === 'summary' && (
                <div className="p-4 sm:p-6 space-y-5">
                  {/* Promo Announcement Banner */}
                  <div className="bg-emerald-950/50 border border-emerald-800/70 rounded-xl p-3 text-xs text-emerald-200 leading-relaxed flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-300">NEW:</span> Ask Fathom, Advanced AI Summaries and AI Action Items are now FREE for your first 5 calls every month 🎁. Try them out below.{' '}
                      <a href="#learn" onClick={(e) => { e.preventDefault(); showToastMsg('Info kuota Fathom gratis'); }} className="underline font-bold text-emerald-400">
                        Learn More
                      </a>
                    </div>
                  </div>

                  {/* Summary Options Toolbar */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <select
                        value={summaryMode}
                        onChange={(e) => setSummaryMode(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-cyan-300 font-bold text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option value="Enhanced">Enhanced Summary</option>
                        <option value="Executive">Executive Brief</option>
                        <option value="Standard">Standard Bullets</option>
                      </select>

                      <button onClick={() => showToastMsg('Pengaturan format summary')} className="p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200">
                        <Settings className="w-3.5 h-3.5" />
                      </button>

                      <select
                        value={summaryLang}
                        onChange={(e) => setSummaryLang(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs px-2 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option value="ID">ID Bahasa Indonesia</option>
                        <option value="EN">EN English</option>
                      </select>
                    </div>

                    <button
                      onClick={handleCopySummary}
                      className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>

                  {/* Generating State or Ready Summary */}
                  {!isNoteReady ? (
                    <div className="bg-[#12161f] border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-3">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden max-w-md mx-auto">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300" style={{ width: `${generatingProgress}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                        Please wait, AI note is generating... ({generatingProgress}%)
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#121620] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed shadow-inner">
                      {/* Section 1: Tujuan Rapat */}
                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-1 flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-cyan-400" />
                          <span>Tujuan Rapat</span>
                        </h4>
                        <p className="bg-cyan-950/40 border border-cyan-800/40 p-3 rounded-xl text-cyan-100 font-medium">
                          {selectedCall.summary.objective}
                        </p>
                      </div>

                      {/* Section 2: Pokok-Pokok Penting */}
                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Pokok-Pokok Penting</span>
                        </h4>
                        <div className="space-y-3">
                          {selectedCall.summary.keyPoints.map((pt, idx) => (
                            <div key={idx} className="bg-white dark:bg-emerald-50/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl space-y-1">
                              <h5 className="font-bold text-cyan-300 text-xs sm:text-sm">{pt.topic}</h5>
                              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{pt.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TRANSCRIPT CONTENT */}
              {detailTab === 'transcript' && (
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Top Search & Copy Toolbar */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={transcriptSearch}
                        onChange={(e) => setTranscriptSearch(e.target.value)}
                        placeholder="Search Transcript"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-1.5 px-3 pl-9 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    </div>

                    <button
                      onClick={handleCopyTranscript}
                      className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors"
                    >
                      {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTranscript ? 'Copied!' : 'Copy Transcript'}</span>
                    </button>
                  </div>

                  {/* Sequential Chat Bubble Dialog */}
                  <div className="space-y-3 pt-2">
                    {filteredTranscript.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        Tidak ditemukan kata kunci pada transkrip ini.
                      </div>
                    ) : (
                      filteredTranscript.map((tr, idx) => (
                        <div key={idx} className="bg-[#121620] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 space-y-1 hover:border-slate-300 dark:border-slate-700 transition-colors">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-cyan-300">{tr.speaker}</span>
                            <span className="font-mono text-[11px] text-slate-500">@ {tr.time}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
                            {tr.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: ASK FATHOM (MEETING SPECIFIC) */}
              {detailTab === 'ask-fathom' && (
                <div className="p-4 sm:p-6 space-y-5">
                  <div className="text-center space-y-2 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center text-slate-900 dark:text-white shadow-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Hi, what can I tell you about this meeting?
                    </h3>
                  </div>

                  {/* Quick Chips for Meeting */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleCallAskSubmit('Why was this meeting scheduled?')}
                      className="bg-[#181d26] hover:bg-[#202733] border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl transition-colors font-medium"
                    >
                      Why was this meeting scheduled?
                    </button>
                    <button
                      onClick={() => handleCallAskSubmit('What would help make progress?')}
                      className="bg-[#181d26] hover:bg-[#202733] border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl transition-colors font-medium"
                    >
                      What would help make progress?
                    </button>
                  </div>

                  {/* Chat Messages */}
                  {callAskMessages.length > 0 && (
                    <div className="space-y-3 pt-3">
                      {callAskMessages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`text-xs p-3 rounded-xl max-w-[85%] leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-600 text-slate-900 dark:text-white font-medium' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {callAskLoading && (
                    <div className="flex items-center justify-center space-x-2 text-xs text-cyan-400 animate-pulse pt-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Fathom AI sedang menganalisis rekaman rapat ini...</span>
                    </div>
                  )}

                  {/* Input Box */}
                  <div className="relative pt-2">
                    <input
                      type="text"
                      value={callAskInput}
                      onChange={(e) => setCallAskInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCallAskSubmit()}
                      placeholder="Ask Fathom AI..."
                      className="w-full bg-[#181d26] border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-3 pr-10 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => handleCallAskSubmit()}
                      disabled={!callAskInput.trim()}
                      className="absolute right-2 top-3.5 p-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-900 dark:text-white rounded-lg transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: ACTION ITEMS (Cols 4) */}
            <div className="lg:col-span-4 bg-[#101318] p-4 sm:p-5 flex flex-col space-y-4 overflow-y-auto border-t lg:border-t-0">
              {/* Meeting Header Title */}
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    {selectedCall.title}
                  </h2>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => showToastMsg('Link rapat disalin ke clipboard')} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white" title="Share">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => showToastMsg('Menu titik tiga')} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white" title="Options">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {selectedCall.fullDate}
                </p>
              </div>

              {/* Action Items Title & Export Buttons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 tracking-wider">
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                    <span>ACTION ITEMS</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                    {selectedCall.actionItems.filter(a => a.isCompleted).length}/{selectedCall.actionItems.length}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyFor}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Copy className="w-3 h-3 text-cyan-400" />
                    <span>{copiedForState ? 'Copied!' : 'Copy for ...'}</span>
                  </button>

                  <button
                    onClick={handleCopyFollowUp}
                    className="flex-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>{copiedFollowUp ? 'Copied!' : 'Copy Follow-up Email'}</span>
                  </button>
                </div>
              </div>

              {/* Checklist Items List */}
              <div className="space-y-3 flex-1">
                {selectedCall.actionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleActionItem(selectedCall.id, item.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${item.isCompleted ? 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-60' : 'bg-[#151a22] border-slate-200 dark:border-slate-800 hover:border-cyan-500/50'}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.isCompleted ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs flex-1">
                      <p className={`leading-relaxed font-medium ${item.isCompleted ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                        {item.text}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center space-x-1 text-cyan-400/90 font-mono">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>{item.timestamp}</span>
                        </span>

                        <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold">
                          👤 {item.assignee}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
