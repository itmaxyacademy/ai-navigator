import React, { useState, useEffect } from 'react';
import { Award, X, Send, Info, CheckCircle2, Link2, FileText, User, Mail, Clock, AlertCircle } from 'lucide-react';
import { UserProgress, CapstoneSubmission } from '../types';

interface CapstoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress?: UserProgress;
  onSubmit?: (submission: CapstoneSubmission) => void;
  onSubmitCapstone?: (submission: CapstoneSubmission) => void;
  initialName?: string;
  initialEmail?: string;
}

export const CapstoneModal: React.FC<CapstoneModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSubmit,
  onSubmitCapstone,
  initialName = '',
  initialEmail = '',
}) => {
  const submitHandler = onSubmitCapstone || onSubmit || (() => {});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [capstoneUrl, setCapstoneUrl] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        ''
      );
      setCapstoneUrl(
        progress?.capstoneUrl ||
        progress?.capstoneSubmission?.capstoneUrl ||
        ''
      );
      setIsSavedSuccess(false);
      setErrors({});
    }
  }, [isOpen, progress, initialName, initialEmail]);

  if (!isOpen) return null;

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const capStatus = progress?.capstoneStatus || (progress?.capstoneSubmission ? 'submitted' : 'not_started');
  const isApproved = capStatus === 'approved';
  const isSubmitted = capStatus === 'submitted' || capStatus === 'in_review' || !!progress?.capstoneSubmission;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white dark:bg-slate-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-slate-900 dark:text-white animate-fadeIn">
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
            <span>Formulir Capstone Project — Tier 2 VIP Master</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Pengajuan <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Capstone Project</span>
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Lengkapi dan perbarui data Capstone Project Anda. Hasil proyek akan ditinjau dan disetujui oleh Mentor sebelum sertifikat kelulusan dapat diterbitkan.
          </p>
        </div>

        {/* Status Box */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-700 dark:text-slate-300">Status Review Capstone:</span>
            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Disetujui Mentor (Approved)
              </span>
            ) : isSubmitted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Menunggu Review / Approval Mentor
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40 font-extrabold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                Belum Diajukan
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {isApproved
              ? 'Capstone Project Anda telah diverifikasi dan disetujui (Approved) oleh Mentor Pembimbing. Anda kini dapat mencetak Sertifikat Tier 2 resmi Anda.'
              : isSubmitted
              ? 'Pengajuan Anda telah diterima di sistem. Mentor akan mereview kualitas hasil proyek Anda. Anda tetap dapat mengedit judul atau link di bawah ini jika diperlukan.'
              : 'Silakan isi Judul Capstone dan Link Pengumpulan di bawah ini lalu klik Kirim.'}
          </p>
        </div>

        {/* Mentor Info Box if assigned */}
        {progress?.assignedMentorName && (
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-black">
                {progress.assignedMentorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Mentor Pembimbing</span>
                <span className="font-extrabold text-white text-xs">{progress.assignedMentorName}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold">
              Mentor Assigned
            </span>
          </div>
        )}

        {/* Mentor Notes / Feedback if present */}
        {progress?.capstoneNotes && (
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Catatan / Arahan dari Mentor:</span>
            <p className="text-xs italic text-amber-100/90 leading-relaxed">"{progress.capstoneNotes}"</p>
          </div>
        )}

        {/* Save confirmation banner */}
        {isSavedSuccess && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pengajuan Capstone Project berhasil disimpan dan dikirimkan ke Mentor!</span>
          </div>
        )}

        {/* Editable Form - ALWAYS Available */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Nama Lengkap Penerima Sertifikat <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
              placeholder="Masukkan nama lengkap Anda..."
              className={`w-full bg-slate-100 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none font-medium ${errors.name ? 'border-rose-500 focus:border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'}`}
            />
            {errors.name && <p className="text-rose-400 text-[10px] font-semibold">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              Alamat Email Siswa <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
              placeholder="contoh: nama@email.com"
              className={`w-full bg-slate-100 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none font-medium ${errors.email ? 'border-rose-500 focus:border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'}`}
            />
            {errors.email && <p className="text-rose-400 text-[10px] font-semibold">{errors.email}</p>}
          </div>

          {/* Capstone Title */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              Judul Capstone Project <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
              placeholder="Contoh: Otomasi Workflow Pemasaran & Konten Berbasis RCTF & Multi-LLM"
              className={`w-full bg-slate-100 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none font-medium ${errors.title ? 'border-rose-500 focus:border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'}`}
            />
            {errors.title && <p className="text-rose-400 text-[10px] font-semibold">{errors.title}</p>}
          </div>

          {/* Capstone URL / Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              Link Pengumpulan Capstone Project <span className="text-rose-400">*</span>
            </label>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
              Masukkan tautan pengumpulan proyek (Google Drive, GitHub, Notion, Figma, dsb.).
            </p>
            <textarea
              rows={3}
              value={capstoneUrl}
              onChange={(e) => { setCapstoneUrl(e.target.value); setErrors(prev => ({ ...prev, capstoneUrl: '' })); }}
              placeholder="Contoh: https://github.com/username/capstone-project atau https://drive.google.com/..."
              className={`w-full bg-slate-100 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none font-medium leading-relaxed resize-none ${errors.capstoneUrl ? 'border-rose-500 focus:border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'}`}
            />
            {errors.capstoneUrl && <p className="text-rose-400 text-[10px] font-semibold">{errors.capstoneUrl}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitted ? 'Perbarui & Simpan Capstone Project' : 'Kirim Capstone & Ajukan Review Mentor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
