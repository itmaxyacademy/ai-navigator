import React from 'react';
import { Lock, Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { UserTier } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: UserTier;
  onUpgradeTier?: (tier: 'tier1' | 'tier2') => void;
  onSelectTier?: (tier: 'tier1' | 'tier2') => void;
  targetModuleId?: number | null;
  isLoading?: boolean;
  loadingTier?: 'tier1' | 'tier2' | null;
  packages?: Record<string, { price: number; fake_price: number; name?: string }>;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentTier = 'free',
  onUpgradeTier,
  onSelectTier,
  targetModuleId,
  isLoading = false,
  loadingTier = null,
  packages,
}) => {
  if (!isOpen) return null;

  const tier1Price = packages?.tier1?.price ? `Rp ${packages.tier1.price.toLocaleString('id-ID')}` : 'Rp 49.500';
  const tier1FakePrice = packages?.tier1?.fake_price ? `Rp ${packages.tier1.fake_price.toLocaleString('id-ID')}` : 'Rp 125.000';

  const tier2Price = packages?.tier2?.price ? `Rp ${packages.tier2.price.toLocaleString('id-ID')}` : 'Rp 299.500';
  const tier2FakePrice = packages?.tier2?.fake_price ? `Rp ${packages.tier2.fake_price.toLocaleString('id-ID')}` : 'Rp 750.000';

  const handleSelect = (tier: 'tier1' | 'tier2') => {
    if (onSelectTier) onSelectTier(tier);
    else if (onUpgradeTier) onUpgradeTier(tier);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex justify-center">
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-6xl w-full p-5 sm:p-8 space-y-4 shadow-2xl text-slate-900 dark:text-white animate-fadeIn m-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>
              {targetModuleId
                ? (currentTier === 'free' ? `Modul ${targetModuleId} Terkunci (Batas Free Trial)` : `Modul ${targetModuleId} Terkunci (Batas Paket)`)
                : 'Akses Kelas AI Navigator'}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-3">
            Upgrade Akses Pembelajaran <span className="text-amber-400">AI Navigator</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {targetModuleId ? (
              <>
                Status Anda saat ini adalah <strong className="text-amber-400">{currentTier === 'free' ? 'Free Trial' : currentTier === 'tier1' ? 'Tier 1' : 'Tier 2'}</strong>{currentTier === 'free' ? ' (hanya dapat mengakses Modul 1 hingga Modul 3)' : ''}. Pilih paket di bawah untuk membuka akses ke seluruh <strong className="text-slate-900 dark:text-white">29 Modul Pembelajaran</strong> &amp; fitur sertifikasi!
              </>
            ) : (
              <>
                Status Anda saat ini adalah <strong className="text-amber-400">{currentTier === 'free' ? 'Free Trial' : currentTier === 'tier1' ? 'Tier 1' : 'Tier 2'}</strong>. Pilih paket di bawah untuk membuka akses ke seluruh <strong className="text-slate-900 dark:text-white">29 Modul Pembelajaran</strong> &amp; fitur sertifikasi!
              </>
            )}
          </p>
        </div>

        {/* Pricing & Tier Options (3-Column Layout from Foto Pertama) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 items-stretch">

          {/* CARD 1: FREE TRIAL / STARTER */}
          <div className={`relative bg-white text-slate-900 border-2 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all ${
            currentTier === 'free'
              ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl'
              : 'border-emerald-500/60 hover:border-emerald-500 shadow-md'
          }`}>
            {/* Top Badge: PROMO SOFT LAUNCHING */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> PROMO SOFT LAUNCHING
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pt-1">
                <span className="text-emerald-600 font-extrabold text-[11px] uppercase tracking-wider">
                  FREE TRIAL
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  3 HARI
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Free Trial / Starter</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  Promo Soft Launching - Akses Uji Coba 3 Hari Modul Dasar &amp; Pengenalan AI Navigator
                </p>
              </div>

              <div className="py-3 border-y border-slate-100 flex flex-col">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">Gratis (Rp 0)</div>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Akses Coba Tanpa Komitmen</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Akses 3 Hari Modul Pengenalan AI &amp; Prompting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Latihan Simulasi Prompt Engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Pratinjau Kuis Pilihan Ganda</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Akses Komunitas Komunitas Belajar</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Bisa Upgrade ke Tier 1 / Tier 2 Kapan Saja</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl font-black text-xs bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              Coba Gratis (3 Hari)
            </button>
          </div>

          {/* CARD 2: TIER 1: SELF-PACED BASIC */}
          <div className={`relative bg-white text-slate-900 border rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all ${
            currentTier === 'tier1'
              ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
              : 'border-slate-200 hover:border-slate-300 shadow-md'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between pt-1">
                <span className="text-amber-600 font-extrabold text-[11px] uppercase tracking-wider">
                  BASIC TIER
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                  21 JP
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Tier 1: Self-Paced Basic</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  21 Hari Pembelajaran Mandiri + Sertifikat Completion (21 JP)
                </p>
              </div>

              <div className="py-3 border-y border-slate-100 flex flex-col">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{tier1Price}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium line-through mt-0.5">
                  Normal: {tier1FakePrice}
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Akses 21 Hari Modul Interaktif Self-Paced</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Kuis Pilihan Ganda &amp; Evaluasi Otomatis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Certificate of Completion (21 Jam Pelajaran / JP)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Akses Komunitas Belajar AI Navigator</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Bisa Di-upsell ke Tier 2 kapan saja</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelect('tier1')}
              disabled={currentTier === 'tier1' || isLoading}
              className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentTier === 'tier1' || isLoading
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 shadow-sm hover:scale-[1.02]'
              }`}
            >
              {loadingTier === 'tier1' ? (
                <span>Memproses Pembayaran Xendit...</span>
              ) : (
                <span>{currentTier === 'tier1' ? 'Tier 1 Aktif' : `Pilih Tier 1 (${tier1Price})`}</span>
              )}
            </button>
          </div>

          {/* CARD 3: TIER 2: FULL MENTORING & CAAI™ CERTIFICATION */}
          <div className={`relative bg-slate-100 dark:bg-slate-950 text-white border-2 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all ${
            currentTier === 'tier2'
              ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-2xl shadow-amber-500/20'
              : 'border-amber-500/60 hover:border-amber-400 shadow-xl'
          }`}>
            {/* Recommended Tag */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
              RECOMMENDED CERTIFICATION
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pt-1">
                <span className="text-amber-400 font-extrabold text-[11px] uppercase tracking-wider">
                  PRO CAAI™ TIER
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
                  28 JP
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  Tier 2: Full Mentoring &amp; CAAI™ Certification
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium leading-relaxed">
                  28 Hari (21 Hari Self-Paced + 7 Hari Mentoring) + Sertifikat CAAI™ Level 1 (28 JP)
                </p>
              </div>

              <div className="py-3 border-y border-slate-200 dark:border-slate-800 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-400">{tier2Price}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium line-through">{tier2FakePrice}</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span>Semua Akses Tier 1 (21 Hari Modul Self-Paced)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span>7 Hari Sesi Live Mentoring di ai.maxy.academy</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span>Bimbingan 1-on-1 Penyusunan Capstone Project</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span>Wajib Submit Project &amp; Review dari Mentor</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span>Sertifikat Resmi CAAI™ Level 1 (28 JP) terhubung Accredify</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span>Digital Badge LinkedIn &amp; Verifikasi Kriptografis</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelect('tier2')}
              disabled={currentTier === 'tier2' || isLoading}
              className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentTier === 'tier2' || isLoading
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl shadow-amber-400/20 hover:scale-[1.02]'
              }`}
            >
              {loadingTier === 'tier2' ? (
                <span>Memproses Pembayaran Xendit...</span>
              ) : (
                <span>{currentTier === 'tier2' ? 'Tier 2 VIP Aktif' : `Pilih Tier 2 (${tier2Price})`}</span>
              )}
            </button>
          </div>

        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
          <span>
            🔒 Pembayaran aman &amp; otomatis mengaktifkan modul secara instant.
          </span>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white underline text-xs font-semibold cursor-pointer"
          >
            Lanjutkan dengan Free Trial (Modul 1 – 3)
          </button>
        </div>
      </div>
    </div>
  );
};

