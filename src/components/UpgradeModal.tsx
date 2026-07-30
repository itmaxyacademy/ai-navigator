import React from 'react';
import { Lock, Sparkles, Check, Zap, Crown, ShieldCheck, X, Star, ArrowRight } from 'lucide-react';
import { UserTier } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: UserTier;
  onUpgradeTier?: (tier: 'tier1' | 'tier2') => void;
  onSelectTier?: (tier: 'tier1' | 'tier2') => void;
  targetModuleId?: number | null;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentTier = 'free',
  onUpgradeTier,
  onSelectTier,
  targetModuleId,
}) => {
  if (!isOpen) return null;

  const handleSelect = (tier: 'tier1' | 'tier2') => {
    if (onSelectTier) onSelectTier(tier);
    else if (onUpgradeTier) onUpgradeTier(tier);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-white animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>
              {targetModuleId
                ? `Modul ${targetModuleId} Terkunci (Batas Free Trial)`
                : 'Akses Kelas AI Navigator'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Upgrade Akses Pembelajaran <span className="text-amber-400">AI Navigator</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {targetModuleId ? (
              <>
                Status Anda saat ini adalah <strong className="text-amber-400">Free Trial</strong> (hanya dapat mengakses Modul 1 & Modul 2). Pilih paket di bawah untuk membuka akses ke seluruh <strong className="text-white">29 Modul Pembelajaran</strong> &amp; fitur sertifikasi!
              </>
            ) : (
              <>
                Tingkatkan akun Anda ke <strong className="text-amber-400">Tier 1</strong> atau <strong className="text-amber-400">Tier 2</strong> untuk membuka akses penuh ke seluruh 29 modul, sertifikat resmi, dan bimbingan VIP.
              </>
            )}
          </p>
        </div>

        {/* Pricing & Tier Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* TIER 1 CARD */}
          <div className={`relative bg-slate-950/80 border rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all ${
            currentTier === 'tier1'
              ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl'
              : 'border-slate-800 hover:border-slate-700'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-extrabold uppercase tracking-wider">
                  Tier 1 — Akses Penuh
                </span>
                {currentTier === 'tier1' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    Paket Anda
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Modul 1 s/d Modul 29</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Buka seluruh modul kurikulum LLM</p>
              </div>

              <div className="py-2 border-y border-slate-800/80 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white">Rp 149.000</span>
                <span className="text-xs text-slate-400 font-medium">/ akses selamanya</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Akses Penuh ke seluruh <strong className="text-white">Modul 1 - 29</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bebas Buka Semua 7 Peti Harta Karun &amp; Bonus Tools AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Simulator Interactive Replica (ChatGPT, Claude, Gemini, dll.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sertifikat Resmi <strong className="text-amber-300">Certificate of Completion</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Submission Capstone Project Portofolio</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelect('tier1')}
              disabled={currentTier === 'tier1'}
              className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentTier === 'tier1'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02]'
              }`}
            >
              <span>{currentTier === 'tier1' ? 'Tier 1 Aktif' : 'Pilih Tier 1 (Rp 149k)'}</span>
              {currentTier !== 'tier1' && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* TIER 2 CARD (RECOMMENDED / VIP) */}
          <div className={`relative bg-slate-950 border rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all ${
            currentTier === 'tier2'
              ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-2xl shadow-amber-500/20'
              : 'border-amber-500/50 hover:border-amber-400 shadow-xl'
          }`}>
            {/* Recommended Tag */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-slate-950" /> POPULER &amp; VIP
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold uppercase tracking-wider">
                  Tier 2 — VIP Master
                </span>
                {currentTier === 'tier2' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                    Paket Anda
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-amber-300 flex items-center gap-1.5">
                  Full Akses + Fitur Upselling VIP
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Bimbingan intensif &amp; review portofolio personal</p>
              </div>

              <div className="py-2 border-y border-slate-800/80 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-amber-400">Rp 299.000</span>
                <span className="text-xs text-slate-400 font-medium">/ akses selamanya</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-start gap-2 text-amber-200 font-bold">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                  <span>Semua Fitur Tier 1 (Modul 1 - 29 + Sertifikat)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong className="text-amber-300">Sesi Mentoring 1-on-1</strong> dengan AI Specialist (45 Menit)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong className="text-amber-300">Personal Review &amp; Feedback</strong> untuk Capstone Project</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong className="text-amber-300">Prioritas Verifikasi</strong> &amp; Sertifikat Digital Cetak High-Res</span>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Bundel 500+ Template Advanced Prompt RCTF &amp; Masterclass AI Webcast</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelect('tier2')}
              disabled={currentTier === 'tier2'}
              className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentTier === 'tier2'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/30 hover:scale-[1.02]'
              }`}
            >
              <span>{currentTier === 'tier2' ? 'Tier 2 VIP Aktif' : 'Upgrade ke Tier 2 (VIP)'}</span>
              {currentTier !== 'tier2' && <Crown className="w-4 h-4 fill-current" />}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <span>
            🔒 Pembayaran aman &amp; otomatis mengaktifkan modul secara instant.
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white underline text-xs font-semibold cursor-pointer"
          >
            Lanjutkan dengan Free Trial (Modul 1 &amp; 2)
          </button>
        </div>
      </div>
    </div>
  );
};
