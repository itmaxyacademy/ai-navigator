import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, Check, X, Tag, CheckCircle2 } from 'lucide-react';
import { UserTier } from '../types';
import { verifyVoucher } from '../services/api';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: UserTier;
  onUpgradeTier?: (tier: 'tier1' | 'tier2', voucherCode?: string, customAmount?: number) => void;
  onSelectTier?: (tier: 'tier1' | 'tier2', voucherCode?: string, customAmount?: number) => void;
  targetModuleId?: number | null;
  isLoading?: boolean;
  loadingTier?: 'tier1' | 'tier2' | null;
  packages?: Record<string, { price: number; fake_price: number; name?: string }>;
  prefilledVoucher?: string;
  prefilledTier?: 'tier1' | 'tier2' | null;
}

interface ActiveVoucherInfo {
  code: string;
  applicableTier: 'all' | 'tier1' | 'tier2';
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValRaw: number;
  maxDiscount: number | null;
  message?: string;
}

const UpgradeModalComponent: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentTier = 'free',
  onUpgradeTier,
  onSelectTier,
  targetModuleId,
  isLoading = false,
  loadingTier = null,
  packages,
  prefilledVoucher = '',
  prefilledTier = null,
}) => {
  const [voucherInput, setVoucherInput] = useState(prefilledVoucher || '');
  const [activeVoucher, setActiveVoucher] = useState<ActiveVoucherInfo | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isVerifyingVoucher, setIsVerifyingVoucher] = useState(false);

  // Auto-verify pre-filled voucher from landing-navigator redirect
  useEffect(() => {
    if (isOpen && prefilledVoucher) {
      setVoucherInput(prefilledVoucher);
      const cleaned = prefilledVoucher.toUpperCase();
      verifyVoucher(cleaned).then((res) => {
        const dData = res?.data?.valid ? res.data : (res?.valid ? res : null);
        if (dData && dData.valid) {
          const appTier = (dData.applicable_tier || 'all').toLowerCase() as 'all' | 'tier1' | 'tier2';
          const discType = (dData.discount_type || 'FIXED').toUpperCase() as 'PERCENTAGE' | 'FIXED';
          const discValRaw = typeof dData.discount_val_raw === 'number' ? dData.discount_val_raw : (typeof dData.discount_amount === 'number' ? dData.discount_amount : 0);
          const maxDisc = typeof dData.max_discount === 'number' ? dData.max_discount : null;

          setActiveVoucher({
            code: cleaned,
            applicableTier: appTier,
            discountType: discType,
            discountValRaw: discValRaw,
            maxDiscount: maxDisc,
            message: dData.message || 'Voucher berhasil diterapkan!',
          });
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prefilledVoucher]);

  if (!isOpen) return null;

  const rawTier1Price = packages?.tier1?.price ?? 49500;
  const rawTier1FakePriceNum = packages?.tier1?.fake_price ?? 125000;
  const tier1FakePrice = `Rp ${rawTier1FakePriceNum.toLocaleString('id-ID')}`;
  const tier1DiscountPercent = rawTier1FakePriceNum > rawTier1Price
    ? Math.round(((rawTier1FakePriceNum - rawTier1Price) / rawTier1FakePriceNum) * 100)
    : 60;

  const rawTier2Price = packages?.tier2?.price ?? 299500;
  const rawTier2FakePriceNum = packages?.tier2?.fake_price ?? 899000;
  const tier2FakePrice = `Rp ${rawTier2FakePriceNum.toLocaleString('id-ID')}`;
  const tier2DiscountPercent = rawTier2FakePriceNum > rawTier2Price
    ? Math.round(((rawTier2FakePriceNum - rawTier2Price) / rawTier2FakePriceNum) * 100)
    : 67;

  // Dynamic prices after voucher discount per Tier
  let tier1Discount = 0;
  let isTier1VoucherEligible = false;
  if (activeVoucher) {
    if (activeVoucher.applicableTier === 'all' || activeVoucher.applicableTier === 'tier1') {
      isTier1VoucherEligible = true;
      if (activeVoucher.discountType === 'PERCENTAGE') {
        let disc = (rawTier1Price * activeVoucher.discountValRaw) / 100;
        if (activeVoucher.maxDiscount && disc > activeVoucher.maxDiscount) {
          disc = activeVoucher.maxDiscount;
        }
        tier1Discount = disc;
      } else {
        tier1Discount = activeVoucher.discountValRaw;
      }
    }
  }

  let tier2Discount = 0;
  let isTier2VoucherEligible = false;
  if (activeVoucher) {
    if (activeVoucher.applicableTier === 'all' || activeVoucher.applicableTier === 'tier2') {
      isTier2VoucherEligible = true;
      if (activeVoucher.discountType === 'PERCENTAGE') {
        let disc = (rawTier2Price * activeVoucher.discountValRaw) / 100;
        if (activeVoucher.maxDiscount && disc > activeVoucher.maxDiscount) {
          disc = activeVoucher.maxDiscount;
        }
        tier2Discount = disc;
      } else {
        tier2Discount = activeVoucher.discountValRaw;
      }
    }
  }

  const finalTier1PriceNum = Math.max(0, rawTier1Price - tier1Discount);
  const tier1Price = `Rp ${finalTier1PriceNum.toLocaleString('id-ID')}`;

  const finalTier2PriceNum = Math.max(0, rawTier2Price - tier2Discount);
  const tier2Price = `Rp ${finalTier2PriceNum.toLocaleString('id-ID')}`;

  const handleClaimVoucher = async () => {
    setVoucherError(null);
    const cleaned = voucherInput.trim().toUpperCase();
    if (!cleaned) return;

    setIsVerifyingVoucher(true);
    const res = await verifyVoucher(cleaned);
    setIsVerifyingVoucher(false);

    const dData = res?.data?.valid ? res.data : (res?.valid ? res : null);
    if (dData && dData.valid) {
      const appTier = (dData.applicable_tier || 'all').toLowerCase() as 'all' | 'tier1' | 'tier2';
      const discType = (dData.discount_type || 'FIXED').toUpperCase() as 'PERCENTAGE' | 'FIXED';
      const discValRaw = typeof dData.discount_val_raw === 'number' ? dData.discount_val_raw : (typeof dData.discount_amount === 'number' ? dData.discount_amount : 0);
      const maxDisc = typeof dData.max_discount === 'number' ? dData.max_discount : null;

      setActiveVoucher({
        code: cleaned,
        applicableTier: appTier,
        discountType: discType,
        discountValRaw: discValRaw,
        maxDiscount: maxDisc,
        message: dData.message || 'Voucher berhasil diterapkan!',
      });
    } else {
      setActiveVoucher(null);
      setVoucherError(res?.data?.message || res?.message || 'Kode voucher tidak valid atau sudah kadaluwarsa.');
    }
  };

  const handleSelect = (tier: 'tier1' | 'tier2') => {
    let code: string | undefined = undefined;
    let finalAmount = tier === 'tier1' ? rawTier1Price : rawTier2Price;

    if (tier === 'tier1') {
      if (activeVoucher && isTier1VoucherEligible) {
        code = activeVoucher.code;
        finalAmount = finalTier1PriceNum;
      }
    } else {
      if (activeVoucher && isTier2VoucherEligible) {
        code = activeVoucher.code;
        finalAmount = finalTier2PriceNum;
      }
    }

    if (onSelectTier) onSelectTier(tier, code, finalAmount);
    else if (onUpgradeTier) onUpgradeTier(tier, code, finalAmount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex justify-center">
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-6xl w-full p-5 sm:p-8 space-y-4 shadow-2xl text-slate-900 dark:text-white animate-fadeIn m-auto">
        {/* Close Button (Min 44x44px touch target) */}
        <button
          onClick={onClose}
          aria-label="Tutup Modal Paket"
          className="absolute top-4 right-4 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffb034]/20 border border-[#ffb034]/40 text-slate-900 dark:text-amber-300 text-xs font-bold">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>
              {targetModuleId
                ? (currentTier === 'free' ? `Modul ${targetModuleId} Terkunci (Batas Free Trial)` : `Modul ${targetModuleId} Terkunci (Batas Paket)`)
                : 'Akses Kelas AI Navigator'}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-3">
            Upgrade Akses Pembelajaran <span className="text-[#d98200] dark:text-amber-400">AI Navigator</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {targetModuleId ? (
              <>
                Status Anda saat ini adalah <strong className="text-[#d98200] dark:text-amber-400">{currentTier === 'free' ? 'Free Trial' : currentTier === 'tier1' ? 'Tier 1' : 'Tier 2'}</strong>{currentTier === 'free' ? ' (hanya dapat mengakses Modul 1 hingga Modul 3)' : ''}. Pilih paket di bawah untuk membuka akses ke seluruh <strong className="text-slate-900 dark:text-white">29 Modul Pembelajaran</strong> &amp; fitur sertifikasi!
              </>
            ) : (
              <>
                Status Anda saat ini adalah <strong className="text-[#d98200] dark:text-amber-400">{currentTier === 'free' ? 'Free Trial' : currentTier === 'tier1' ? 'Tier 1' : 'Tier 2'}</strong>. Pilih paket di bawah untuk membuka akses ke seluruh <strong className="text-slate-900 dark:text-white">29 Modul Pembelajaran</strong> &amp; fitur sertifikasi!
              </>
            )}
          </p>
        </div>

        {/* Voucher Claim Section */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800 dark:text-amber-300">
            <Tag className="w-4 h-4 text-amber-500" />
            <span>Punya Kode Voucher / Promo? Klaim Di Sini</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
              placeholder="Masukkan kode voucher..."
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleClaimVoucher}
              disabled={isVerifyingVoucher || !voucherInput.trim()}
              className="px-4 py-2 bg-[#ffb034] hover:bg-[#e09b2d] disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {isVerifyingVoucher ? 'Memeriksa...' : 'Klaim Voucher'}
            </button>
          </div>
          {activeVoucher && (
            <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Voucher <code className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300 font-mono">{activeVoucher.code}</code> berhasil diklaim
                {activeVoucher.applicableTier === 'tier1' && ' (Khusus Tier 1 Basic)'}
                {activeVoucher.applicableTier === 'tier2' && ' (Khusus Tier 2 VIP Master)'}
                {activeVoucher.applicableTier === 'all' && ' (Semua Paket)'}!
              </span>
            </div>
          )}
          {voucherError && (
            <div className="mt-2 text-xs text-rose-400 font-medium">
              {voucherError}
            </div>
          )}
        </div>

        {/* Pricing & Tier Options (3-Column Layout identical to Landing Page) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 items-stretch">

          {/* CARD 1: FREE TRIAL */}
          <div className={`p-6 sm:p-7 rounded-[2rem] bg-white text-slate-900 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden ${
            currentTier === 'free'
              ? 'ring-2 ring-emerald-500/40 border-emerald-500'
              : ''
          }`}>
            {/* Promo Soft Launching Tag */}
            <div className="absolute top-0 right-0 bg-slate-900 text-[#ffb034] font-black text-[10px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider shadow-xs">
              PROMO SOFT LAUNCHING
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-slate-500 font-black uppercase tracking-wider">
                    FREE TRIAL
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Free Tier: Pengenalan AI</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-black shrink-0 shadow-xs">
                  3 MODUL
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cocok untuk eksplorasi awal — coba 3 modul pengenalan AI tanpa biaya
              </p>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black tracking-wide">
                    100% GRATIS
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">Rp 0</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Akses coba 3 modul • Tanpa komitmen</div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Akses 3 modul pengenalan AI</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Latihan langsung pakai AI</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Gabung komunitas belajar</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Upgrade kapan saja</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
            >
              Coba Gratis (3 Modul)
            </button>
          </div>

          {/* CARD 2: TIER 1: BELAJAR BASIC */}
          <div className={`p-6 sm:p-7 rounded-[2rem] bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
            currentTier === 'tier1'
              ? 'ring-2 ring-amber-500/40 border-amber-500'
              : ''
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-[#d98200] font-extrabold uppercase tracking-wider">
                    BASIC TIER
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Tier 1: Belajar Basic</h3>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#ffb034]/20 border border-[#ffb034]/50 text-slate-900 text-xs font-mono font-black shrink-0 shadow-xs">
                  21 JP
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                21 Hari pembelajaran mandiri untuk membangun dasar AI &amp; portfolio awal
              </p>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                    {tier1FakePrice}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-black tracking-wide">
                    HEMAT {tier1DiscountPercent}%
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{tier1Price}</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Sekali bayar • Akses mandiri 21 hari</div>
                {activeVoucher && isTier1VoucherEligible && tier1Discount > 0 && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 self-start">
                    <span>Diskon Voucher: -Rp {tier1Discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {activeVoucher && !isTier1VoucherEligible && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 self-start">
                    <span>Voucher ini hanya berlaku untuk Tier 2</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span>21 modul belajar atur sendiri waktumu</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span>Evaluasi otomatis tiap modul</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span>Sertifikat Penyelesaian Program (21 JP)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span>Akses komunitas AI Navigator</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span>Upgrade kapan saja</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelect('tier1')}
              disabled={currentTier === 'tier1' || isLoading}
              className={`w-full py-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentTier === 'tier1' || isLoading
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : finalTier1PriceNum === 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {loadingTier === 'tier1' ? (
                <span>{finalTier1PriceNum === 0 ? 'Mengaktifkan Akses Gratis...' : 'Memproses Pembayaran Xendit...'}</span>
              ) : (
                <span>{currentTier === 'tier1' ? 'Tier 1 Aktif' : finalTier1PriceNum === 0 ? 'Klaim Gratis dengan Voucher (Rp 0)' : `Pilih Tier 1 (${tier1Price})`}</span>
              )}
            </button>
          </div>

          {/* CARD 3: TIER 2: FULL MENTORING & CAAI™ CERTIFICATION (DARK SLEEK GOLD) */}
          <div className={`p-6 sm:p-7 rounded-[2rem] bg-slate-900 text-white border-2 border-[#ffb034] shadow-2xl shadow-[#ffb034]/15 relative flex flex-col justify-between space-y-6 transition-all ${
            currentTier === 'tier2'
              ? 'ring-2 ring-[#ffb034]/70'
              : ''
          }`}>
            <div className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-[#ffb034] text-slate-900 font-black text-[10px] uppercase tracking-wider shadow-md">
              RECOMMENDED CERTIFICATION
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-[#ffb034] font-extrabold uppercase tracking-wider">
                    PRO CAAI™ TIER
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 leading-tight">
                    Tier 2: Full Mentoring &amp; CAAI™ Certification
                  </h3>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#ffb034] text-slate-900 text-xs font-mono font-black shrink-0 shadow-md">
                  28 JP
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                28 Hari lengkap dengan mentoring + capstone project untuk CV &amp; LinkedIn-mu
              </p>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                    {tier2FakePrice}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-black tracking-wide flex items-center gap-1 shadow-sm">
                    HEMAT {tier2DiscountPercent}%
                  </span>
                </div>
                <div className="text-3xl font-black text-[#ffb034] tracking-tight">{tier2Price}</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Sekali bayar • Mentoring + Sertifikasi CAAI™</div>
                {activeVoucher && isTier2VoucherEligible && tier2Discount > 0 && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/40 self-start">
                    <span>Diskon Voucher: -Rp {tier2Discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {activeVoucher && !isTier2VoucherEligible && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/40 self-start">
                    <span>Voucher ini hanya berlaku untuk Tier 1</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 pt-4 border-t border-slate-800">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#ffb034] shrink-0 mt-0.5" />
                  <span>Semua akses Paket Basic</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#ffb034] shrink-0 mt-0.5" />
                  <span>7 Hari Pendampingan Mentor via Grup Chat</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#ffb034] shrink-0 mt-0.5" />
                  <span>Dibimbing membuat karya nyata pakai AI — step by step, dinilai mentor</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#ffb034] shrink-0 mt-0.5" />
                  <span>Sertifikat Resmi Certified Applied AI™ Level 1 (28 JP)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#ffb034] shrink-0 mt-0.5" />
                  <span>Lencana digital terverifikasi — tambahkan ke CV dan LinkedIn</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelect('tier2')}
              disabled={currentTier === 'tier2' || isLoading}
              className={`w-full py-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentTier === 'tier2' || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : finalTier2PriceNum === 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02]'
                  : 'bg-[#ffb034] hover:bg-[#e59d2a] text-slate-900 shadow-lg shadow-[#ffb034]/25 hover:shadow-xl hover:shadow-[#ffb034]/35'
              }`}
            >
              {loadingTier === 'tier2' ? (
                <span>{finalTier2PriceNum === 0 ? 'Mengaktifkan Akses Gratis...' : 'Memproses Pembayaran Xendit...'}</span>
              ) : (
                <span>{currentTier === 'tier2' ? 'Tier 2 Aktif' : finalTier2PriceNum === 0 ? 'Klaim Gratis dengan Voucher (Rp 0)' : `Pilih Tier 2 (${tier2Price})`}</span>
              )}
            </button>
          </div>

        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1.5 justify-center sm:justify-start">
            <Lock className="w-3.5 h-3.5" />
            Pembayaran aman &amp; otomatis mengaktifkan modul secara instant.
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

export const UpgradeModal = React.memo(UpgradeModalComponent);

