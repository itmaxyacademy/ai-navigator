import React, { useState } from 'react';
import { Award, X, Sparkles, CheckCircle2, Printer, Download, Share2, Compass } from 'lucide-react';
import { UserProgress } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  const [userName, setUserName] = useState('Siswa AI Navigator');

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Input Name field */}
        <div className="space-y-1 max-w-sm print:hidden">
          <label className="text-xs font-bold text-slate-300 block">
            Masukkan Nama Lengkap Anda Untuk Sertifikat:
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="Ketik nama Anda di sini..."
          />
        </div>

        {/* Printable Certificate Frame */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/40 rounded-2xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          {/* Certificate Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
            </div>
            <div className="text-left">
              <span className="text-sm font-extrabold text-white tracking-wider block">AI NAVIGATOR</span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">Akademi Pembelajaran LLM</span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-3xl font-extrabold text-amber-300 uppercase tracking-widest">
              SERTIFIKAT KELULUSAN
            </h2>
            <p className="text-xs text-slate-400">
              Diberikan Secara Resmi Sebagai Penghargaan Atas Penyelesaian Modul
            </p>
          </div>

          {/* User Name */}
          <div className="py-2 border-b-2 border-amber-500/40 max-w-md mx-auto">
            <h3 className="text-2xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-amber-200 to-indigo-200 bg-clip-text text-transparent">
              {userName || 'Siswa AI Navigator'}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Telah berhasil menyelesaikan seluruh <strong>13 Modul Utama AI Navigator</strong>, meliputi penguasaan Teknik Prompting RCTF, ChatGPT, Claude, Gemini, Perplexity, Microsoft Copilot, Meta AI, DeepSeek, Gemini Notebook, Google Flow, Leonardo.Ai, Google Stitch, dan Stable Diffusion.
          </p>

          {/* Badges Earned */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Master RCTF Prompting
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Multi-LLM Practitioner
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {progress.xp} Total XP
            </span>
          </div>

          {/* Signatures & Date */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 max-w-md mx-auto">
            <div>
              <span className="block text-[10px] text-slate-500">Tanggal Kelulusan:</span>
              <strong className="text-slate-200">{todayStr}</strong>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500">Verifikasi ID:</span>
              <strong className="text-indigo-400 font-mono">AIN-2026-CERT-8M</strong>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Printer className="w-4 h-4" /> Cetak / Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
