import React, { useState } from 'react';
import { Award, X, Sparkles, CheckCircle2, Printer, Compass, ShieldCheck, Mail, User, Crown } from 'lucide-react';
import { UserProgress } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSaveCertDetails?: (name: string, email: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSaveCertDetails,
}) => {
  const [userName, setUserName] = useState(
    progress.certName || progress.capstoneSubmission?.name || 'Siswa AI Navigator'
  );
  const [userEmail, setUserEmail] = useState(
    progress.certEmail || progress.capstoneSubmission?.email || 'siswa@ainavigator.id'
  );
  const [isVerified, setIsVerified] = useState(!!progress.certRequested || !!progress.certName);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleVerifyCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      alert('Mohon isi Nama Lengkap dan Email untuk verifikasi sertifikat!');
      return;
    }
    setIsVerified(true);
    if (onSaveCertDetails) {
      onSaveCertDetails(userName.trim(), userEmail.trim());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const userTier = progress.userTier || 'free';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Verification Step Form (Request Sertifikasi) */}
        {!isVerified ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Request Sertifikat Kelulusan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Verifikasi Identitas <span className="text-amber-400">Sertifikat</span>
              </h2>
              <p className="text-xs text-slate-300 font-medium max-w-md mx-auto">
                Silakan isi dan periksa kembali Nama &amp; Email Anda. Data ini akan dicetak secara sah pada <strong>Certificate of Completion</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyCert} className="space-y-4 max-w-md mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-200 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Nama Lengkap Penerima Sertifikat
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                  placeholder="Ketik nama lengkap Anda..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200 block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Alamat Email Siswa
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                  placeholder="nama@domain.com"
                />
              </div>

              {progress.capstoneSubmission && (
                <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800 text-indigo-200 text-[11px] space-y-0.5">
                  <span className="font-bold block text-indigo-300">📌 Capstone Submission Terhubung:</span>
                  <p className="font-mono text-slate-300 truncate">"{progress.capstoneSubmission.title}"</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Terbitkan Certificate of Completion</span>
              </button>
            </form>
          </div>
        ) : (
          /* Official Certificate Frame View */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Certificate
                </span>
                <button
                  onClick={() => setIsVerified(false)}
                  className="text-xs text-slate-400 hover:text-amber-400 underline font-medium cursor-pointer"
                >
                  Ubah Nama/Email
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak / PDF
                </button>
              </div>
            </div>

            {/* Printable Certificate Frame */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/40 rounded-2xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
              {/* Decorative Blur Effect */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header Badge */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                    <Compass className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-sm font-black text-white tracking-wider block">AI NAVIGATOR</span>
                  <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase block">Akademi Pembelajaran LLM</span>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-3xl font-black text-amber-300 uppercase tracking-widest">
                  CERTIFICATE OF COMPLETION
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Sertifikat Kelulusan Resmi Pembelajaran Modul
                </p>
              </div>

              {/* Recipient Name */}
              <div className="py-2 border-b-2 border-amber-500/40 max-w-md mx-auto">
                <h3 className="text-2xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-amber-200 to-indigo-200 bg-clip-text text-transparent">
                  {userName || 'Siswa AI Navigator'}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-1">{userEmail}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
                Telah berhasil menyelesaikan seluruh <strong>29 Modul Pembelajaran AI Navigator</strong>, meliputi penguasaan Teknik Prompting RCTF, ChatGPT, Claude, Gemini, Perplexity, Copilot, Meta AI, DeepSeek, v0.dev, Bolt.new, dan Capstone Project.
              </p>

              {/* Capstone Project Title if present */}
              {progress.capstoneSubmission && (
                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl max-w-md mx-auto text-xs space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Judul Capstone Project:</span>
                  <p className="text-slate-200 font-semibold italic">"{progress.capstoneSubmission.title}"</p>
                </div>
              )}

              {/* Badges Earned */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Master RCTF Prompting
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Multi-LLM Practitioner
                </span>
                {userTier === 'tier2' ? (
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-slate-950" /> Tier 2 VIP Graduate
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 29 Modul Selesai ({progress.xp} XP)
                  </span>
                )}
              </div>

              {/* Signatures & Verification Info */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 max-w-md mx-auto text-left">
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold">Tanggal Kelulusan:</span>
                  <strong className="text-slate-200">{todayStr}</strong>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500 font-bold">ID Verifikasi Sertifikat:</span>
                  <strong className="text-indigo-400 font-mono">AIN-2026-CERT-29M</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
