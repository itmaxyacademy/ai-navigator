import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierCompleted: 'tier1' | 'tier2';
  onOpenCertificate: () => void;
}

const MilestoneCelebrationModalComponent: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  onClose,
  tierCompleted,
  onOpenCertificate,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger grand confetti fireworks burst
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: tierCompleted === 'tier2' 
            ? ['#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#10b981']
            : ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'],
        });
      } catch (e) {
        console.error('Confetti error:', e);
      }
    }
  }, [isOpen, tierCompleted]);

  if (!isOpen) return null;

  const isTier2 = tierCompleted === 'tier2';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0f111a] border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative text-center overflow-hidden">
        {/* Glowing Background Radial */}
        <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-30 ${isTier2 ? 'bg-purple-600' : 'bg-emerald-600'}`} />
        <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-30 ${isTier2 ? 'bg-amber-600' : 'bg-teal-600'}`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Trophy Icon Badge */}
        <div className="relative z-10 space-y-3">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl shadow-2xl border ${
            isTier2
              ? 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 border-amber-400/50 shadow-purple-600/50'
              : 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-emerald-400/50 shadow-emerald-600/50'
          }`}>
            {isTier2 ? <Trophy className="w-10 h-10 text-amber-300 animate-bounce" /> : <Award className="w-10 h-10 text-white animate-bounce" />}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Pencapaian Kurikulum Terbuka</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {isTier2 ? 'Master AI Navigator Qualified' : 'Tier 1 Fundamental Selesai'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {isTier2
              ? 'Selamat! Anda telah menyelesaikan seluruh 29 Modul Kurikulum Master AI Navigator dengan sempurna. Dokumen sertifikat digital dan transkrip akademik Anda siap diterbitkan.'
              : 'Selamat! Anda berhasil menyelesaikan 22 Modul Tingkat Fundamental. Anda telah resmi memenuhi syarat penerbitan Sertifikat Tier 1 AI Navigator.'}
          </p>
        </div>

        {/* Accomplishment Highlights Card */}
        <div className="relative z-10 p-4 rounded-2xl bg-[#141724] border border-slate-800 text-left space-y-2.5 text-xs text-slate-200">
          <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-2">
            <span className="text-slate-300">Ringkasan Pencapaian:</span>
            <span className="font-mono text-emerald-400">100% Terverifikasi</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isTier2 ? '29 Modul Lengkap (Tier 1 + Tier 2 Master)' : '22 Modul Lengkap (Tier 1 Fundamental)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Seluruh Praktik Simulator &amp; Evaluasi Mandiri Selesai</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Dokumen Sertifikat Digital &amp; Transkrip Akademik Ready</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 space-y-2.5 pt-1">
          <button
            onClick={() => {
              onClose();
              onOpenCertificate();
            }}
            className="w-full py-3.5 rounded-2xl font-bold text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Award className="w-4 h-4 stroke-[2]" />
            <span>Buka &amp; Klaim Sertifikat Resmi</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Lanjut Belajar
          </button>
        </div>
      </div>
    </div>
  );
};

export const MilestoneCelebrationModal = React.memo(MilestoneCelebrationModalComponent);
