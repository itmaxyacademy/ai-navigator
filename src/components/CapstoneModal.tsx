import React, { useState } from 'react';
import { Award, X, Sparkles, Send, BookOpen, Info, CheckCircle2 } from 'lucide-react';
import { UserProgress, CapstoneSubmission } from '../types';

interface CapstoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSubmitCapstone: (submission: CapstoneSubmission) => void;
}

export const CapstoneModal: React.FC<CapstoneModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSubmitCapstone,
}) => {
  const [name, setName] = useState(progress.capstoneSubmission?.name || progress.certName || 'Siswa AI Navigator');
  const [email, setEmail] = useState(progress.capstoneSubmission?.email || progress.certEmail || 'siswa@ainavigator.id');
  const [title, setTitle] = useState(
    progress.capstoneSubmission?.title || 'Otomasi Workflow Pemasaran & Konten Berbasis RCTF & Multi-LLM'
  );
  const [submitted, setSubmitted] = useState(!!progress.capstoneSubmission);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !title.trim()) {
      alert('Mohon lengkapi Nama, Email, dan Judul Capstone Project!');
      return;
    }

    const submission: CapstoneSubmission = {
      name: name.trim(),
      email: email.trim(),
      title: title.trim(),
      submittedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    setSubmitted(true);
    onSubmitCapstone(submission);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-slate-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-white animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Formulir Capstone Project — Modul 29 Selesai</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Submission <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Capstone Project</span>
          </h2>

          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Selamat telah menyelesaikan seluruh 29 modul! Lengkapi formulir Capstone Project Anda sebagai syarat penerbitan <strong className="text-amber-300">Certificate of Completion</strong>.
          </p>
        </div>

        {/* Notice Box */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
          <div className="font-extrabold flex items-center gap-2 text-amber-300">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Catatan Penting Capstone:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-100/90 font-medium">
            Project Capstone ini bersifat <strong>submission portofolio &amp; dokumentasi kelulusan saja (tidak dinilai)</strong>. Data yang Anda masukkan akan tercantum pada sertifikat resmi Anda.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-200 block">
              Nama Lengkap (Ditampilkan di Sertifikat) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-200 block">
              Alamat Email Pascasarjana / Siswa <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: nama@email.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-200 block">
              Judul Capstone Project Anda <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Otomasi Pembuatan Konten Digital Menggunakan Prompting RCTF dan Claude Artifacts"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium leading-relaxed resize-none"
            />
          </div>

          {submitted && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Capstone Project telah tersimpan! Klik tombol di bawah untuk membuka Sertifikat.</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitted ? 'Buka Certificate of Completion' : 'Kirim Capstone & Request Sertifikasi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
