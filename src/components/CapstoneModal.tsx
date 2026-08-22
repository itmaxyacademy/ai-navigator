import React, { useState, useEffect } from 'react';
import { Award, X, Send, Info, CheckCircle2, Link2, FileText, User, Mail, Clock, AlertCircle, BookOpen, Sparkles, Check, ChevronRight, RefreshCw, Lock } from 'lucide-react';
import { UserProgress, CapstoneSubmission } from '../types';
import { CAPSTONE_BANK, CapstoneTopic } from '../data/capstoneBank';

interface CapstoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress?: UserProgress;
  onSubmit?: (submission: CapstoneSubmission) => void;
  onSubmitCapstone?: (submission: CapstoneSubmission) => void;
  initialName?: string;
  initialEmail?: string;
}

const CapstoneModalComponent: React.FC<CapstoneModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSubmit,
  onSubmitCapstone,
  initialName = '',
  initialEmail = '',
}) => {
  const submitHandler = onSubmitCapstone || onSubmit || (() => {});
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'bank'>('form');
  const [selectedBankTopic, setSelectedBankTopic] = useState<CapstoneTopic | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [capstoneUrl, setCapstoneUrl] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const completedModulesCount = (progress?.completedModules || []).length;
  const isProgress100 = completedModulesCount >= 29;

  // Sync state whenever modal opens or progress changes
  useEffect(() => {
    if (isOpen) {
      setName(
        progress?.capstoneSubmission?.name ||
        progress?.certName ||
        progress?.userName ||
        initialName ||
        ''
      );
      setEmail(
        progress?.capstoneSubmission?.email ||
        progress?.certEmail ||
        progress?.userEmail ||
        initialEmail ||
        ''
      );
      setTitle(
        progress?.capstoneTitle ||
        progress?.capstoneSubmission?.title ||
        (progress as any)?.certTitle ||
        ''
      );
      setCapstoneUrl(
        progress?.capstoneUrl ||
        progress?.capstoneSubmission?.capstoneUrl ||
        ''
      );
      setIsSavedSuccess(false);
      setErrors({});
      setActiveTab('form');
    }
  }, [isOpen, progress, initialName, initialEmail]);

  if (!isOpen) return null;

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const rawStatus = (progress?.capstoneStatus || (progress?.capstoneSubmission ? 'submitted' : 'not_started')).toLowerCase();
  const isApproved = rawStatus === 'approved';
  const isRevision = rawStatus === 'revision' || rawStatus === 'rejected';
  const isInReview = rawStatus === 'in_review' || rawStatus === 'submitted';
  const isSubmitted = isApproved || isRevision || isInReview || !!progress?.capstoneSubmission;
  const score = progress?.capstoneScore ?? (progress?.capstoneSubmission as any)?.score;
  const notes = progress?.capstoneNotes ?? (progress?.capstoneSubmission as any)?.notes;

  const handleSelectBankTopic = (topic: CapstoneTopic) => {
    setSelectedBankTopic(topic);
    setTitle(topic.title);
    setErrors(prev => ({ ...prev, title: '' }));
    setActiveTab('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isApproved) {
      onClose();
      return;
    }

    if (!isProgress100) {
      alert(`🔒 Pengumpulan Capstone Project Terkunci.\n\nAnda harus menyelesaikan seluruh 29 Modul Pembelajaran (100%) terlebih dahulu sebelum dapat mengumpulkan tugas Capstone.\n\nProgres belajar Anda saat ini: ${completedModulesCount}/29 modul.`);
      return;
    }

    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
    if (!email.trim()) {
      newErrors.email = 'Alamat email wajib diisi.';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (!title.trim()) newErrors.title = 'Judul Capstone Project wajib diisi.';
    if (!capstoneUrl.trim()) newErrors.capstoneUrl = 'Link URL atau repositori Capstone wajib diisi.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const submission: CapstoneSubmission = {
      name: name.trim(),
      email: email.trim(),
      title: title.trim(),
      capstoneUrl: capstoneUrl.trim(),
      submittedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    setIsSavedSuccess(true);
    submitHandler(submission);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white dark:bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-slate-900 dark:text-white animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Sertifikasi CAAI™ &amp; Capstone Project — Tier 2 VIP Master</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Pengajuan <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Capstone Project</span>
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
            Kumpulkan tugas Capstone Project Anda untuk mendapatkan gelar dan <strong>Sertifikat Resmi CAAI™</strong> setelah ditinjau dan disetujui oleh Mentor.
          </p>
        </div>

        {/* Status Indicator Banner */}
        <div className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
          isApproved
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : isRevision
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : isInReview
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
        }`}>
          <div className="flex items-center justify-between font-bold flex-wrap gap-2">
            <span className="flex items-center gap-1.5 font-bold">
              <span>Status Capstone:</span>
            </span>
            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Disetujui Mentor (Approved) {score !== undefined && score !== null ? `— Skor: ${score}/100` : ''}
              </span>
            ) : isRevision ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                Perlu Revisi (Revision) {score !== undefined && score !== null ? `— Skor: ${score}/100` : ''}
              </span>
            ) : isInReview ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Sedang Direview Mentor
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40 font-extrabold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                Belum Dikumpulkan
              </span>
            )}
          </div>

          <p className="text-[11px] leading-relaxed opacity-90">
            {isApproved
              ? 'Selamat! Proyek Capstone Anda telah dinilai dan disetujui resmi oleh Mentor. Judul dan URL pengumpulan telah dikunci untuk penerbitan Sertifikat Resmi CAAI™ Anda.'
              : isRevision
              ? 'Mentor meminta perbaikan pada proyek Anda. Silakan pelajari catatan revisi di bawah, perbaiki proyek Anda, dan kirimkan kembali pembaruan link proyek.'
              : isInReview
              ? 'Tugas proyek Anda telah diterima dan saat ini sedang dalam proses evaluasi oleh Mentor Pembimbing.'
              : 'Silakan isi judul dan link pengumpulan proyek di bawah. Jika belum memiliki topik sendiri, Anda dapat memilih studi kasus langsung dari Bank Capstone!'}
          </p>

          {/* Mentor Feedback / Notes */}
          {notes && (
            <div className="mt-2.5 p-3 rounded-xl bg-black/30 border border-white/10 text-xs space-y-1">
              <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider block">
                Catatan &amp; Evaluasi Mentor:
              </span>
              <p className="text-xs italic leading-relaxed text-white/95">"{notes}"</p>
            </div>
          )}
        </div>

        {/* Assigned Mentor Info */}
        {progress?.assignedMentorName && (
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-black text-xs">
                {progress.assignedMentorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-[9.5px] text-indigo-400 font-bold uppercase tracking-wider block">Mentor Pembimbing</span>
                <span className="font-extrabold text-white text-xs">{progress.assignedMentorName}</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold">
              Mentor Assigned
            </span>
          </div>
        )}

        {/* Navigation Tabs (Form vs Riwayat vs Bank Capstone) */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Formulir Pengajuan</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Riwayat &amp; Log</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bank Topik</span>
          </button>
        </div>

        {/* TAB 1: FORM PENGUMPULAN */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs animate-fadeIn">
            {/* Locked Info if Approved */}
            {isApproved && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pengumpulan Capstone telah disetujui resmi oleh Mentor dan dikunci untuk penerbitan sertifikat.</span>
              </div>
            )}

            {/* Save confirmation banner */}
            {isSavedSuccess && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pengajuan Capstone Project berhasil disimpan dan dikirimkan untuk verifikasi Mentor!</span>
              </div>
            )}

            {!isProgress100 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                    Pengumpulan Capstone Project Masih Terkunci
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Anda saat ini baru menyelesaikan <strong>{completedModulesCount}/29 modul</strong>. Selesaikan seluruh 29 modul pembelajaran kurikulum AI Navigator (100%) terlebih dahulu untuk membuka akses pengiriman tugas Capstone.
                  </p>
                </div>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nama Lengkap Siswa</span>
                <span className="text-rose-400 font-black">*</span>
              </label>
              <input
                type="text"
                disabled={!isProgress100 || isApproved}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                placeholder="Masukkan nama lengkap untuk sertifikat..."
                className={`w-full bg-slate-100 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none font-medium leading-relaxed ${!isProgress100 || isApproved ? 'opacity-70 cursor-not-allowed bg-slate-200 dark:bg-slate-800' : ''} ${errors.name ? 'border-rose-500 focus:border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'}`}
              />
              {errors.name && <p className="text-rose-400 text-[10px] font-semibold">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Alamat Email Terdaftar</span>
                <span className="text-rose-400 font-black">*</span>
              </label>
              <input
                type="email"
                disabled={!isProgress100 || isApproved}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                placeholder="nama@email.com"
                className={`w-full bg-slate-100 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none font-medium leading-relaxed ${!isProgress100 || isApproved ? 'opacity-70 cursor-not-allowed bg-slate-200 dark:bg-slate-800' : ''} ${errors.email ? 'border-rose-500 focus:border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'}`}
              />
              {errors.email && <p className="text-rose-400 text-[10px] font-semibold">{errors.email}</p>}
            </div>

            {/* Capstone Title */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Judul Capstone Project AI</span>
                  <span className="text-rose-400 font-black">*</span>
                </label>
                {isProgress100 && !isApproved && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('bank')}
                    className="text-[10.5px] text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Pilih dari Bank Capstone</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                disabled={!isProgress100 || isApproved}
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
                placeholder="Contoh: Implementasi Multi-LLM Prompt Engineering untuk Sistem Otomasi Bisnis"
                className={`w-full bg-slate-100 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none font-medium leading-relaxed ${!isProgress100 || isApproved ? 'opacity-70 cursor-not-allowed bg-slate-200 dark:bg-slate-800' : ''} ${errors.title ? 'border-rose-500 focus:border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'}`}
              />
              {errors.title && <p className="text-rose-400 text-[10px] font-semibold">{errors.title}</p>}
            </div>

            {/* Capstone URL / Repository Link */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Link Repositori / File Capstone Project</span>
                  <span className="text-rose-400 font-black">*</span>
                </label>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">GitHub / Google Drive / Notion / HuggingFace</span>
              </div>
              <input
                type="url"
                disabled={!isProgress100 || isApproved}
                value={capstoneUrl}
                onChange={(e) => { setCapstoneUrl(e.target.value); setErrors(prev => ({ ...prev, capstoneUrl: '' })); }}
                placeholder="Contoh: https://github.com/username/capstone-project atau https://drive.google.com/..."
                className={`w-full bg-slate-100 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none font-medium leading-relaxed resize-none ${!isProgress100 || isApproved ? 'opacity-70 cursor-not-allowed bg-slate-200 dark:bg-slate-800' : ''} ${errors.capstoneUrl ? 'border-rose-500 focus:border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'}`}
              />
              {errors.capstoneUrl && <p className="text-rose-400 text-[10px] font-semibold">{errors.capstoneUrl}</p>}
            </div>

            <div className="pt-2">
              {isApproved ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Proyek Disetujui • Tutup &amp; Siap Cetak Sertifikat</span>
                </button>
              ) : !isProgress100 ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Tuntaskan 29 Modul (100%) untuk Membuka Pengumpulan Capstone</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isRevision ? 'Kirim Ulang Hasil Revisi Capstone' : isSubmitted ? 'Perbarui & Simpan Pengajuan Capstone' : 'Kirim Capstone & Ajukan Approval Mentor'}</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* TAB 2: RIWAYAT & LOG PENGUMPULAN */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Riwayat &amp; Log Evaluasi Capstone
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Status Saat Ini:</span>
                  <span className={`font-bold ${
                    isApproved ? 'text-emerald-600 dark:text-emerald-400' : isRevision ? 'text-rose-600 dark:text-rose-400' : isInReview ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
                  }`}>
                    {isApproved ? '✓ Disetujui Mentor' : isRevision ? '⚠️ Perlu Revisi' : isInReview ? '⏳ Sedang Direview' : 'Belum Dikumpulkan'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Judul Proyek:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right max-w-[280px] truncate">
                    {title || 'Belum diisi'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Link Repositori:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-right max-w-[280px] truncate">
                    {capstoneUrl ? (
                      <a href={capstoneUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">
                        {capstoneUrl}
                      </a>
                    ) : 'Belum diisi'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Mentor Pembimbing:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {progress?.assignedMentorName || 'Tim Mentor Maxy Academy'}
                  </span>
                </div>

                {score !== undefined && score !== null && (
                  <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Nilai Evaluasi:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {score}/100
                    </span>
                  </div>
                )}

                {notes && (
                  <div className="pt-2">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Catatan &amp; Feedback Mentor:</span>
                    <p className="p-3 rounded-xl bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 italic text-slate-800 dark:text-slate-200">
                      "{notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isRevision && (
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Buka Formulir untuk Kirim Ulang Revisi</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 2: BANK CAPSTONE */}
        {activeTab === 'bank' && (
          <div className="space-y-3.5 animate-fadeIn max-h-[420px] overflow-y-auto pr-1">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Pilih salah satu topik studi kasus industri dari <strong>Bank Capstone</strong> di bawah ini jika Anda belum memiliki topik sendiri atau belum ditentukan oleh mentor. Klik <strong>"Pilih Topik Ini"</strong> untuk otomatis mengisinya ke formulir pengajuan.
              </p>
            </div>

            <div className="space-y-3">
              {CAPSTONE_BANK.map((item) => {
                const isCurrent = title.trim().toLowerCase() === item.title.trim().toLowerCase();
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                            {item.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.difficulty === 'Beginner'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : item.difficulty === 'Intermediate'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {item.difficulty}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                          {item.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectBankTopic(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white'
                        }`}
                      >
                        {isCurrent ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        <span>{isCurrent ? 'Terpilih' : 'Pilih Topik Ini'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-200/50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                      <div>
                        <span className="font-bold text-amber-400 block mb-0.5">🎯 Objektif Utama:</span>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-0.5 text-[10.5px]">
                          {item.objectives.slice(0, 2).map((obj, i) => (
                            <li key={i} className="truncate">{obj}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-cyan-400 block mb-0.5">🛠️ Rekomendasi Tools:</span>
                        <p className="text-slate-600 dark:text-slate-300 text-[10.5px]">
                          {item.recommendedTools.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CapstoneModal = React.memo(CapstoneModalComponent);
