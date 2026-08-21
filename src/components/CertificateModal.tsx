import React, { useState, useRef } from 'react';
import { Award, X, Sparkles, CheckCircle2, Download, Printer, Compass, ShieldCheck, Mail, User, Crown, ExternalLink, BookOpen, Loader2, Lock, FileText, Clock } from 'lucide-react';
import { UserProgress } from '../types';
import { issueCertificateApi } from '../services/api';
import { MODULES_DATA } from '../data/modulesData';
import { isCertificateEligible } from '../lib/gamification';

export interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  certType?: 'capstone' | 'completion';
  onSaveCertDetails?: (name: string, email: string, phone?: string, institution?: string, certUuid?: string, certNumber?: string) => void;
  onOpenCapstone?: () => void;
  packages?: Record<string, { price: number; fake_price: number; name?: string; certificate_bg_image?: string | null; certificate_bg_image_capstone?: string | null }>;
}

const CertificateModalComponent: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  certType = 'capstone',
  onSaveCertDetails,
  onOpenCapstone,
  packages,
}) => {
  // Prioritize logged-in user name from account over stored certName
  const actualUserName = (progress as any)?.userName || progress?.capstoneSubmission?.name || progress?.certName || '';
  const actualUserEmail = (progress as any)?.userEmail || progress?.capstoneSubmission?.email || progress?.certEmail || '';
  const actualUserPhone = (progress as any)?.userPhone || progress?.certPhone || '';
  const actualUserInstitution = (progress as any)?.userInstitution || progress?.certInstitution || '';

  const [userName, setUserName] = useState(actualUserName || '');
  const [userEmail, setUserEmail] = useState(actualUserEmail || '');
  const [userPhone, setUserPhone] = useState(actualUserPhone || '');
  const [userInstitution, setUserInstitution] = useState(actualUserInstitution || '');
  // Always show verification input form first before displaying certificate as requested
  const [isVerified, setIsVerified] = useState(false);
  const [certUuid, setCertUuid] = useState<string>('');
  const [certNumber, setCertNumber] = useState<string>('');
  const [verifyUrl, setVerifyUrl] = useState<string>('');
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activePageTab, setActivePageTab] = useState<number>(1);

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const page4Ref = useRef<HTMLDivElement>(null);
  const [certWidth, setCertWidth] = useState(850);
  const syncedKeyRef = useRef<string>('');

  React.useEffect(() => {
    if (isOpen) {
      const uName = (progress as any)?.userName || progress?.capstoneSubmission?.name || progress?.certName || '';
      const uEmail = (progress as any)?.userEmail || progress?.capstoneSubmission?.email || progress?.certEmail || '';
      const uPhone = (progress as any)?.userPhone || progress?.certPhone || '';
      const uInst = (progress as any)?.userInstitution || progress?.certInstitution || '';

      if (uName) setUserName(uName);
      if (uEmail) setUserEmail(uEmail);
      if (uPhone) setUserPhone(uPhone);
      if (uInst) setUserInstitution(uInst);

      let existingUuid = (progress as any)?.certUuid || '';
      let existingCertNum = (progress as any)?.certNumber || '';

      if (!existingUuid) {
        existingUuid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4${Math.random().toString(36).substring(2, 5)}-a${Math.random().toString(36).substring(2, 5)}-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
      }
      if (!existingCertNum) {
        existingCertNum = `No. ${String(Date.now()).slice(-4)}/AIN/NAV/${new Date().getFullYear()}`;
      }

      setCertUuid(existingUuid);
      setCertNumber(existingCertNum);
      setVerifyUrl(`https://cms.maxy.academy/certificate/verify/${existingUuid}`);

      // Auto-verify if all required details exist or if certificate was already requested
      if (progress?.certRequested || (progress as any)?.certUuid || (uName && uEmail && uPhone && uInst)) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    }
  }, [isOpen]);

  // Keep certificate preview scaled responsive to its container width with throttled frame & debounce
  React.useEffect(() => {
    if (!isOpen || !isVerified) return;
    const targetNode = page1Ref.current || page2Ref.current || page3Ref.current || page4Ref.current;
    if (!targetNode) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        for (let entry of entries) {
          const w = Math.round(entry.contentRect.width);
          if (w > 0 && Math.abs(w - certWidth) > 6) {
            setCertWidth(w);
          }
        }
      }, 40);
    });

    observer.observe(targetNode);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [isVerified, isOpen, activePageTab]);

  // Background silent sync with backend database (Guarded single execution per identity)
  React.useEffect(() => {
    if (!isOpen || !isVerified || !certUuid) return;
    const uName = userName || (progress as any)?.userName || progress?.certName || '';
    const uEmail = userEmail || (progress as any)?.userEmail || progress?.certEmail || '';
    if (!uName || !uEmail) return;

    // If UUID is already synced and stored in progress, don't re-trigger
    if ((progress as any)?.certUuid && (progress as any)?.certUuid === certUuid) return;

    const syncKey = `${uName}_${uEmail}_${certUuid}_${certType}`;
    if (syncedKeyRef.current === syncKey) return;
    syncedKeyRef.current = syncKey;

    issueCertificateApi(uName, uEmail, certType)
      .then((res) => {
        if (res?.success && res?.data?.uuid) {
          setCertUuid(res.data.uuid);
          if (res.data.certificate_number) setCertNumber(res.data.certificate_number);
          if (res.data.verify_url) setVerifyUrl(res.data.verify_url);
          if (onSaveCertDetails) {
            onSaveCertDetails(uName, uEmail, userPhone, userInstitution, res.data.uuid, res.data.certificate_number);
          }
        }
      })
      .catch(() => {});
  }, [isOpen, isVerified, certUuid, userName, userEmail]);

  if (!isOpen) return null;

  const userTier = progress.userTier || 'free';
  const hasTier2 = Boolean(progress.hasTier2 || progress.paidTiers?.includes('tier2') || userTier === 'tier2');
  const hasMentor = Boolean(progress.assignedMentorId || progress.assignedMentorName);
  const hasCapstone = Boolean(progress.capstoneSubmission || (progress.capstoneTitle && progress.capstoneUrl));
  const isEligible = isCertificateEligible(progress);

  if (!isEligible) {
    const targetTotal = hasTier2 ? 29 : 22;
    const completedCount = (progress.completedModules || []).filter(id => id <= targetTotal).length;
    const remainingCount = Math.max(0, targetTotal - completedCount);

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-black text-xl text-slate-900 dark:text-white">Sertifikat Kelulusan Terkunci</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Sertifikat resmi hanya dapat diterbitkan apabila Anda telah menyelesaikan <strong className="text-amber-500">100% seluruh modul</strong> pembelajaran.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-left">
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
              <span>Status Paket:</span>
              <span className="text-amber-500 uppercase">{hasTier2 ? 'Tier 2 VIP Master' : userTier === 'tier1' ? 'Tier 1 Basic' : 'Free Trial'}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Syarat Kelulusan:</span>
              <span>100% (Modul 1 s/d Modul {targetTotal})</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Modul Diselesaikan:</span>
              <span className="font-mono text-emerald-500 font-bold">{completedCount} / {targetTotal} Modul</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (completedCount / targetTotal) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-400">
            {userTier === 'free'
              ? 'Silakan upgrade ke Paket Tier 1 atau Tier 2 dan selesaikan seluruh modul untuk membuka sertifikat.'
              : `Selesaikan ${remainingCount} modul tersisa untuk klaim sertifikat kelulusan Anda!`}
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Lanjutkan Belajar Modul
          </button>
        </div>
      </div>
    );
  }

  const isCapstoneApproved = progress.capstoneStatus === 'approved';

  if (hasTier2 && !isCapstoneApproved) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-500/40 p-6 sm:p-8 text-center space-y-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
            <Clock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-extrabold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Tier 2 VIP Master — Review Capstone</span>
            </div>
            <h3 className="font-black text-xl text-slate-900 dark:text-white">
              {!hasCapstone
                ? 'Capstone Project Belum Dikumpulkan'
                : !hasMentor
                ? 'Mentor Belum Ditugaskan'
                : 'Sertifikat Menunggu Approval Mentor'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {!hasCapstone
                ? 'Sertifikat resmi CAAI™ Tier 2 mewajibkan pengumpulan Capstone Project (Judul & Link Proyek).'
                : !hasMentor
                ? 'Penugasan Mentor Resmi oleh Admin/Mentor diperlukan sebelum sertifikat kelulusan dapat disetujui.'
                : 'Pengajuan Capstone Project Anda telah tersimpan dan diteruskan ke Mentor. Sertifikat resmi CAAI™ Tier 2 hanya dapat dicetak setelah disetujui (Approved) oleh Mentor Pembimbing.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5 text-left">
            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
              <span className="font-bold">Mentor Pembimbing:</span>
              <span className="font-extrabold text-indigo-400">{progress.assignedMentorName || 'Belum Ditugaskan'}</span>
            </div>
            <div className="flex justify-between items-start text-slate-700 dark:text-slate-300 gap-2">
              <span className="font-bold shrink-0">Judul Capstone:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200 text-right truncate max-w-[240px]">
                {progress.capstoneTitle || progress.capstoneSubmission?.title || 'Belum Diisi'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
              <span className="font-bold">Status Review:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
                {!hasCapstone
                  ? 'Belum Mengajukan'
                  : progress.capstoneStatus === 'in_review'
                  ? 'Sedang Direview Mentor'
                  : 'Menunggu Approval Mentor'}
              </span>
            </div>
            {progress.capstoneNotes && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-amber-300">
                <span className="font-bold block text-slate-400 text-[10px]">Catatan / Feedback Mentor:</span>
                <p className="italic mt-0.5 leading-relaxed">"{progress.capstoneNotes}"</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            {onOpenCapstone && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCapstone();
                }}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>{!hasCapstone ? 'Isi Form Capstone' : 'Edit / Perbarui Capstone'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tierKey = hasTier2 ? 'tier2' : 'tier1';
  const pkgObj = packages?.[tierKey] || packages?.['tier2'] || packages?.['tier1'];

  const isCapstone = certType === 'capstone';
  const bgImage = isCapstone
    ? (pkgObj?.certificate_bg_image_capstone || packages?.['tier2']?.certificate_bg_image_capstone || null)
    : (pkgObj?.certificate_bg_image || packages?.['tier2']?.certificate_bg_image || packages?.['tier1']?.certificate_bg_image || null);

  const templateDataRaw = isCapstone
    ? ((pkgObj as any)?.certificate_template_data_capstone || (packages?.['tier2'] as any)?.certificate_template_data_capstone || null)
    : ((pkgObj as any)?.certificate_template_data || (packages?.['tier2'] as any)?.certificate_template_data || (packages?.['tier1'] as any)?.certificate_template_data || null);

  let templateObjects: Array<any> = [];
  if (templateDataRaw) {
    try {
      const parsed = typeof templateDataRaw === 'string' ? JSON.parse(templateDataRaw) : templateDataRaw;
      if (parsed && Array.isArray(parsed.objects)) {
        templateObjects = parsed.objects;
      }
    } catch (e) {
      console.error('Failed to parse template JSON:', e);
    }
  }

  const hasCustomCapstoneCanvasObj = templateObjects.length > 0 && templateObjects.some(
    (obj: any) => obj.id === 'CAPSTONE_TITLE' || obj.id === 'CAPSTONE' || (typeof obj.text === 'string' && (obj.text.includes('Judul Capstone') || obj.text.includes('CAPSTONE_TITLE')))
  );

  const hasCmsTemplate = Boolean(bgImage || templateObjects.length > 0);

  const isTier1 = !hasTier2;
  const displayModules = isTier1 ? MODULES_DATA.slice(0, 22) : MODULES_DATA;

  // Split modules into 10-module chunks per page for large, crisp, legible 13.5px font rendering
  const part1Modules = displayModules.slice(0, 10);
  const part2Modules = displayModules.slice(10, 20);
  const part3Modules = displayModules.slice(20);

  const capstoneTitle = (hasTier2 && certType === 'capstone')
    ? (progress.capstoneTitle || progress.capstoneSubmission?.title || (progress as any).certTitle || 'Otomasi Workflow Pemasaran & Konten Berbasis RCTF & Multi-LLM')
    : null;

  const now = new Date();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' });
  const dayNum = now.getDate();
  const yearNum = now.getFullYear();
  const todayStr = `Jakarta, ${monthName} ${dayNum}, ${yearNum}`;

  const handleVerifyCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('Mohon isi Nama Lengkap untuk verifikasi sertifikat!');
      return;
    }
    if (!userEmail.trim()) {
      alert('Mohon isi Alamat Email untuk verifikasi sertifikat!');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
      alert('Format email tidak valid. Mohon periksa kembali.');
      return;
    }

    // Validation for CAAI Capstone Certificate: requires Capstone Project & Mentor Approval
    if (hasTier2 && certType === 'capstone') {
      if (!hasCapstone) {
        alert('Penerbitan Sertifikat Resmi CAAI™ memerlukan pengumpulan Capstone Project (Judul & Link Project). Silakan isi formulir Capstone terlebih dahulu.');
        if (onOpenCapstone) {
          onClose();
          onOpenCapstone();
        }
        return;
      }
      if (progress.capstoneStatus !== 'approved') {
        const statusMsg = progress.capstoneStatus === 'revision'
          ? 'Perlu Revisi (Catatan: ' + (progress.capstoneNotes || 'Perbaiki proyek Anda') + ')'
          : progress.capstoneStatus === 'in_review'
          ? 'Sedang Direview Mentor'
          : 'Menunggu Approval Mentor';
        alert('Penerbitan Sertifikat Resmi CAAI™ memerlukan persetujuan (Approval) Capstone Project oleh Mentor Pembimbing. Status saat ini: ' + statusMsg + '. Silakan tunggu hingga Mentor menyetujui hasil proyek Anda di CMS atau cek catatan revisi.');
        return;
      }
    }

    setIsIssuing(true);
    try {
      const res = await issueCertificateApi(userName.trim(), userEmail.trim(), certType);
      if (res.success && res.data) {
        setCertUuid(res.data.uuid);
        setCertNumber(res.data.certificate_number);
        setVerifyUrl(res.data.verify_url);
        if (onSaveCertDetails) {
          onSaveCertDetails(
            userName.trim(),
            userEmail.trim(),
            userPhone.trim(),
            userInstitution.trim(),
            res.data.uuid,
            res.data.certificate_number
          );
        }
      } else {
        if (res.error) {
          alert('Peringatan: ' + res.error);
        }
        if (onSaveCertDetails) {
          onSaveCertDetails(userName.trim(), userEmail.trim(), userPhone.trim(), userInstitution.trim());
        }
      }
    } catch (err) {
      console.error('Cert issuance error:', err);
    } finally {
      setIsIssuing(false);
      setIsVerified(true);
    }
  };

  // Off-screen clone capture helper: completely prevents visible preview flicker or expansion
  const captureOffscreenNode = async (el: HTMLElement, toJpegFn: (node: HTMLElement, options?: any) => Promise<string>): Promise<string> => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.style.width = '1123px';
    wrapper.style.height = '794px';
    wrapper.style.zIndex = '-9999';
    wrapper.style.overflow = 'hidden';
    wrapper.style.backgroundColor = '#ffffff';

    const cloned = el.cloneNode(true) as HTMLElement;
    cloned.style.display = 'block';
    cloned.style.width = '1123px';
    cloned.style.height = '794px';
    cloned.style.margin = '0';
    cloned.style.borderRadius = '0';
    cloned.style.border = 'none';

    // Force scaler wrapper to adapt to 1123px width instead of screen width
    const scaler = cloned.querySelector('.cert-scaler') as HTMLElement;
    if (scaler) {
      scaler.style.transform = `scale(${1123 / 850})`;
    }

    wrapper.appendChild(cloned);
    document.body.appendChild(wrapper);

    try {
      const dataUrl = await toJpegFn(cloned, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      return dataUrl;
    } finally {
      if (document.body.contains(wrapper)) {
        document.body.removeChild(wrapper);
      }
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    // Give React a tick to mount all 4 page refs in DOM before capturing offscreen clones
    await new Promise((r) => setTimeout(r, 80));

    if (!page1Ref.current || !page2Ref.current) {
      setIsDownloading(false);
      return;
    }

    const p1 = page1Ref.current;
    const p2 = page2Ref.current;
    const p3 = page3Ref.current;
    const p4 = page4Ref.current;

    const safeName = (userName || 'Siswa').replace(/[^a-zA-Z0-9]/g, '_');

    try {
      const [{ toJpeg }, { default: jsPDF }] = await Promise.all([
        import('html-to-image'),
        import('jspdf'),
      ]);

      // Capture off-screen clones so the visible preview on screen NEVER flickers or expands
      const imgData1 = await captureOffscreenNode(p1, toJpeg);
      const imgData2 = await captureOffscreenNode(p2, toJpeg);
      let imgData3: string | null = null;
      if (p3) {
        imgData3 = await captureOffscreenNode(p3, toJpeg);
      }
      let imgData4: string | null = null;
      if (p4) {
        imgData4 = await captureOffscreenNode(p4, toJpeg);
      }

      const pdfWidth = 297;
      const pdfHeight = 210;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Page 1: Sertifikat Utama
      pdf.addImage(imgData1, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      // Page 2: Transkrip Part 1
      pdf.addPage();
      pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      // Page 3: Transkrip Part 2
      if (imgData3) {
        pdf.addPage();
        pdf.addImage(imgData3, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      // Page 4: Transkrip Part 3 (if Tier 2 29 modules)
      if (imgData4) {
        pdf.addPage();
        pdf.addImage(imgData4, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Sertifikat_AI_Navigator_${safeName}.pdf`);
    } catch (err) {
      console.warn('html-to-image PDF error, attempting html2canvas fallback:', err);
      try {
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
          import('html2canvas'),
          import('jspdf'),
        ]);

        const canvas1 = await html2canvas(p1, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff', logging: false });
        const canvas2 = await html2canvas(p2, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff', logging: false });
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        pdf.addImage(canvas1.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
        pdf.addPage();
        pdf.addImage(canvas2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
        pdf.save(`Sertifikat_AI_Navigator_${safeName}.pdf`);
      } catch (fallbackErr) {
        console.error('All client PDF engines failed, triggering print dialog:', fallbackErr);
        window.print();
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper: render a single module row for the full-width transcript table
  const renderModuleRow = (m: (typeof MODULES_DATA)[0], globalIdx: number, localIdx: number) => (
    <tr key={m.id} style={{ backgroundColor: localIdx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
      <td style={{ padding: '4px 8px', fontFamily: 'monospace', color: '#334155', fontWeight: 800, textAlign: 'center', borderRight: '1px solid #cbd5e1', fontSize: '13px', width: '42px' }}>
        {globalIdx}
      </td>
      <td style={{ padding: '4px 10px', fontWeight: 800, color: '#0f172a', fontSize: '13.5px', lineHeight: 1.3 }}>
        {m.title}
        <span style={{ display: 'block', fontSize: '11px', color: '#475569', fontWeight: 500, marginTop: '1px' }}>{m.subtitle}</span>
      </td>
      <td style={{ padding: '4px 8px', textAlign: 'center', fontWeight: 900, color: '#1d4ed8', borderLeft: '1px solid #cbd5e1', fontSize: '12.5px', width: '70px' }}>
        1 JP
      </td>
      <td style={{ padding: '4px 8px', textAlign: 'center', borderLeft: '1px solid #cbd5e1', width: '80px' }}>
        <span style={{ padding: '2px 8px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '10.5px', fontWeight: 900, borderRadius: '4px' }}>
          LULUS
        </span>
      </td>
    </tr>
  );

  const totalPages = 1 + 1 + (part2Modules.length > 0 ? 1 : 0) + (part3Modules.length > 0 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn my-8 text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer z-10"
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
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Verifikasi Identitas <span className="text-amber-400">Sertifikat</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto">
                Silakan isi dan periksa kembali Nama &amp; Email Anda. Data ini akan dicetak secara sah pada <strong>Certificate of Completion &amp; Transkrip Kurikulum Modul</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyCert} className="space-y-4 max-w-md mx-auto bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Nama Lengkap Penerima Sertifikat
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
                  placeholder="Ketik nama lengkap Anda..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200 block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Alamat Email Siswa
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
                  placeholder="nama@domain.com"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
                  placeholder="08123456789"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200 block flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  Asal Instansi / Universitas / Perusahaan
                </label>
                <input
                  type="text"
                  required
                  value={userInstitution}
                  onChange={(e) => setUserInstitution(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
                  placeholder="e.g. Universitas Indonesia / Maxy Academy"
                />
              </div>

              {/* Expiration Notice if expired */}
              {progress.isExpired && (
                <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-500/40 text-blue-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Masa Akses Modul Berakhir (6 Bulan)</span>
                  </div>
                  <p className="text-[11px] text-blue-100/90 leading-relaxed">
                    Sertifikat resmi dan transkrip kelulusan Anda tetap berlaku seumur hidup dan dapat diunduh/dicetak kapan saja.
                  </p>
                </div>
              )}

              {/* Tier 2 Mentor & Capstone Prerequisites Info Box */}
              {hasTier2 && (
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">Syarat Sertifikasi Tier 2 VIP Master:</span>
                  
                  {/* Mentor Requirement */}
                  {hasMentor ? (
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold block uppercase">Mentor Ditugaskan:</span>
                        <span className="font-extrabold text-white text-xs">{progress.assignedMentorName}</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-400">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>Mentor Belum Ditugaskan</span>
                      </div>
                      <p className="text-[10px] text-amber-200/90">
                        Penugasan mentor oleh Admin/Mentor diperlukan untuk penerbitan sertifikat Tier 2 VIP Master.
                      </p>
                    </div>
                  )}

                  {/* Capstone Requirement */}
                  {hasCapstone ? (
                    <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="overflow-hidden">
                          <span className="text-[10px] text-indigo-400 font-bold block uppercase">Judul Capstone Project:</span>
                          <span className="font-extrabold text-white text-xs truncate max-w-[260px] block">
                            {progress.capstoneTitle || progress.capstoneSubmission?.title || 'Capstone Project AI Navigator'}
                          </span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      </div>
                      {onOpenCapstone && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenCapstone();
                          }}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Lihat / Edit Judul &amp; Link Capstone</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                      <div className="font-bold flex items-center gap-1.5 text-amber-400">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>Capstone Project Belum Dikumpulkan</span>
                      </div>
                      <p className="text-[10px] text-amber-200/90">
                        Silakan lengkapi Judul &amp; Link Capstone Project Anda sebagai syarat kelulusan Tier 2.
                      </p>
                      {onOpenCapstone && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenCapstone();
                          }}
                          className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition-all cursor-pointer shadow-md"
                        >
                          Isi Form Capstone Project
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mentor Approval Status Requirement (Only for CAAI Capstone Cert) */}
                  {certType === 'capstone' && (
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${progress.capstoneStatus === 'approved' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : progress.capstoneStatus === 'revision' ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-amber-950/40 border-amber-500/30 text-amber-300'}`}>
                      <div>
                        <span className={`text-[10px] font-bold block uppercase ${progress.capstoneStatus === 'approved' ? 'text-emerald-400' : progress.capstoneStatus === 'revision' ? 'text-rose-400' : 'text-amber-400'}`}>
                          Status Approval Sertifikasi CAAI™:
                        </span>
                        <span className="font-extrabold text-white text-xs block">
                          {progress.capstoneStatus === 'approved'
                            ? `Disetujui Mentor (Approved) ${progress.capstoneScore ? `— Skor: ${progress.capstoneScore}/100` : ''}`
                            : progress.capstoneStatus === 'revision'
                            ? 'Perlu Revisi dari Siswa'
                            : (progress.capstoneStatus === 'in_review' ? 'Sedang Direview Mentor' : 'Menunggu Approval Mentor')}
                        </span>
                        {progress.capstoneStatus !== 'approved' && (
                          <p className="text-[10px] text-amber-200/90 mt-0.5">
                            {progress.capstoneStatus === 'revision'
                              ? `Catatan Revisi: "${progress.capstoneNotes || 'Perbaiki link proyek'}". Silakan perbaiki melalui form Capstone.`
                              : 'Menunggu konfirmasi approval dari mentor agar Sertifikat Resmi CAAI™ dapat diterbitkan.'}
                          </p>
                        )}
                      </div>
                      {progress.capstoneStatus === 'approved' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isIssuing || (hasTier2 && certType === 'capstone' && progress.capstoneStatus !== 'approved')}
                className={`w-full py-3 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 ${
                  hasTier2 && certType === 'capstone' && progress.capstoneStatus !== 'approved'
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed border border-slate-400/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 cursor-pointer hover:scale-[1.01]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isIssuing
                    ? 'Memuat UUID...'
                    : hasTier2 && certType === 'capstone' && progress.capstoneStatus !== 'approved'
                    ? 'Menunggu Approval Capstone dari Mentor'
                    : 'Terbitkan Certificate & Transkrip'}
                </span>
              </button>
            </form>
          </div>
        ) : (
          /* Official Certificate & Transcript View */
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mt-8 sm:mt-2 pr-10 sm:pr-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sertifikat Terverifikasi
                </span>
                <button
                  onClick={() => setIsVerified(false)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-400 underline font-medium cursor-pointer"
                >
                  Ubah Nama/Email
                </button>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading || isIssuing}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                {isDownloading ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                ) : (
                  <Download className="w-4.5 h-4.5" />
                )}
                <span>{isDownloading ? 'Mengekstrak PDF Lengkap...' : `Download Sertifikat PDF (${totalPages} Halaman Resmi)`}</span>
              </button>
            </div>

            {/* Page Tabs Switcher (Render 1 page at a time for high-performance viewing) */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActivePageTab(1)}
                className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePageTab === 1
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Hal 1: Sertifikat</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePageTab(2)}
                className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePageTab === 2
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Hal 2: Transkrip (1-10)</span>
              </button>
              {part2Modules.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActivePageTab(3)}
                  className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activePageTab === 3
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Hal 3: Transkrip (11-20)</span>
                </button>
              )}
              {part3Modules.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActivePageTab(4)}
                  className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activePageTab === 4
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Hal 4: Transkrip (21-29)</span>
                </button>
              )}
            </div>

            <div id="printable-certificate-area" className="space-y-6 relative">

            {/* ============ HALAMAN 1: SERTIFIKAT ============ */}
            {(activePageTab === 1 || isDownloading) && (
              <div
                ref={page1Ref}
                className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-700"
                style={{ display: activePageTab === 1 || isDownloading ? 'block' : 'none', aspectRatio: '850 / 600' }}
              >
                <div 
                  className="cert-scaler absolute top-0 left-0"
                  style={{
                    width: '850px',
                    height: '600px',
                    transformOrigin: 'top left',
                    transform: `scale(${certWidth / 850})`
                  }}
                >
                {hasCmsTemplate ? (
                  <div
                    data-cert-bg
                    className="relative w-full h-full bg-cover bg-center bg-no-repeat overflow-hidden bg-slate-900"
                    style={{
                      backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                    }}
                  >
                    {bgImage && (
                      <img
                        src={bgImage}
                        crossOrigin="anonymous"
                        alt="Certificate Template Background"
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                    )}
                    {templateObjects.length > 0 ? (
                      templateObjects.map((obj: any, i: number) => {
                        if (obj.text === 'UID' || obj.text === 'uid') return null; // Skip stray duplicate label

                        const isUuidObj = obj.id === 'UUID' || (typeof obj.text === 'string' && (obj.text.includes('f7ad0d5c') || obj.text.includes('1a1d2a89') || obj.text.toLowerCase().includes('uuid')));
                        const isNameObj = obj.id === 'NAME' || (typeof obj.text === 'string' && obj.text.includes('Nama Siswa'));
                        const isCertNumObj = obj.id === 'NO_SERTIF' || (typeof obj.text === 'string' && obj.text.includes('No. 0255'));
                        const isDateObj = obj.id === 'DATE' || (typeof obj.text === 'string' && obj.text.includes('Jakarta,'));
                        const isCapstoneTitleObj = obj.id === 'CAPSTONE_TITLE' || obj.id === 'CAPSTONE' || (typeof obj.text === 'string' && (obj.text.includes('Judul Capstone') || obj.text.includes('CAPSTONE_TITLE')));

                        let content = obj.text || '';
                        if (isNameObj) content = userName || 'Siswa AI Navigator';
                        else if (isUuidObj) content = certUuid || (progress as any)?.certUuid || (isIssuing ? 'Memuat...' : '-');
                        else if (isCertNumObj) content = certNumber || (progress as any)?.certNumber || (isIssuing ? 'Memuat...' : '-');
                        else if (isDateObj) content = todayStr;
                        else if (isCapstoneTitleObj) content = capstoneTitle ? `Judul Capstone: ${capstoneTitle}` : '';

                        // Canvas editor (Fabric.js 850x600) stores top/left as pixel coords
                        let isCentered = obj.textAlign === 'center' || obj.originX === 'center';
                        let topPercent = ((obj.top || 0) / 600) * 100;
                        let leftPercent = ((obj.left || 0) / 850) * 100;

                        // Keep the recipient name position aligned perfectly
                        if (isNameObj) {
                          leftPercent = 49.5;
                          isCentered = true;
                          if (!obj.top || (obj.top >= 160 && obj.top <= 280)) {
                            topPercent = 41;
                          }
                        }

                        // LARGER & BOLDER FONT SIZES FOR RECIPIENT NAME, DATE & UUID AS REQUESTED
                        const finalFontSize = isNameObj
                          ? Math.max(26, Math.round(obj.fontSize ? obj.fontSize * 1.15 : 32))
                          : isUuidObj
                          ? Math.max(13, Math.round(obj.fontSize ? obj.fontSize * 1.05 : 13))
                          : isDateObj
                          ? Math.max(14, Math.round(obj.fontSize ? obj.fontSize * 1.05 : 14))
                          : isCertNumObj
                          ? Math.max(14, Math.round(obj.fontSize ? obj.fontSize * 1.05 : 14))
                          : Math.max(12, Math.round(obj.fontSize ? obj.fontSize * 0.9 : 14));

                        return (
                          <div
                            key={i}
                            className="absolute whitespace-nowrap pointer-events-none z-10"
                            style={{
                              top: `${topPercent}%`,
                              left: `${leftPercent}%`,
                              transform: isCentered ? 'translateX(-50%)' : 'none',
                              fontSize: `${finalFontSize}px`,
                              fontFamily: obj.fontFamily || (isUuidObj ? 'Courier New, monospace' : 'Poppins, sans-serif'),
                              fontWeight: obj.fontWeight || (isNameObj ? 900 : 700),
                              color: obj.fill || (isNameObj ? '#d97706' : (isUuidObj ? '#2563eb' : '#0f172a')),
                              textAlign: isCentered ? 'center' : ((obj.textAlign as any) || 'left'),
                              lineHeight: 1.2,
                              textShadow: isNameObj ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                            }}
                          >
                            {content}
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                          <h3 className="text-3xl sm:text-5xl font-black text-amber-500 drop-shadow-md">{userName || 'Siswa AI Navigator'}</h3>
                        </div>
                        <div className="absolute bottom-[10%] left-[8%] pointer-events-none text-sm text-slate-800 font-bold">
                          {todayStr}
                        </div>
                        <div className="absolute bottom-[10%] right-[8%] pointer-events-none text-sm text-blue-800 font-mono font-bold">
                          {certUuid || ''}
                        </div>
                      </>
                    )}
                    {capstoneTitle && !hasCustomCapstoneCanvasObj && (
                      <div
                        className="absolute whitespace-nowrap pointer-events-none z-10 text-center"
                        style={{
                          top: '51.5%',
                          left: '49.5%',
                          transform: 'translateX(-50%)',
                          fontSize: '11.5px',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 700,
                          color: '#b45309',
                          backgroundColor: 'rgba(254, 243, 199, 0.95)',
                          padding: '3px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(245, 158, 11, 0.5)',
                          maxWidth: '82%',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                        }}
                      >
                        Judul Capstone Project: "{capstoneTitle}"
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fallback: Digital Certificate */
                  <div className="w-full h-full bg-white relative flex flex-col items-center justify-center p-8 text-center">
                    {/* Gold border accent */}
                    <div className="absolute inset-2 border-2 border-amber-400/60 rounded-lg pointer-events-none" />
                    <div className="absolute inset-3.5 border border-amber-300/30 rounded pointer-events-none" />

                    {/* Top decorative line */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
                      <div className="w-12 h-[1px] bg-amber-400" />
                      <img
                        src="https://cms.maxy.academy/uploads/LogoMaxy.png"
                        crossOrigin="anonymous"
                        alt="Maxy Academy Logo"
                        className="h-7 w-auto object-contain"
                      />
                      <div className="w-12 h-[1px] bg-amber-400" />
                    </div>

                    <div className="space-y-1 mt-4">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.3em] uppercase block">Maxy Academy — AI Navigator Program</span>
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                        CERTIFICATE
                      </h2>
                      <p className="text-sm text-slate-500 font-medium italic">Of Completion</p>
                    </div>

                    <p className="text-xs text-slate-500 mt-3">This certificate is proudly presented to:</p>

                    <div className="mt-2 pb-1.5 border-b-2 border-amber-400/50 px-8">
                      <h3 className="text-2xl sm:text-4xl font-black text-amber-500" style={{ fontFamily: 'Georgia, serif' }}>
                        {userName || 'Siswa AI Navigator'}
                      </h3>
                    </div>

                    {capstoneTitle && (
                      <div className="mt-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-4 py-1.5 rounded-xl inline-block max-w-md shadow-sm">
                        Judul Capstone Project: "{capstoneTitle}"
                      </div>
                    )}

                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mt-3">
                      telah berhasil menyelesaikan seluruh <strong>{displayModules.length} Modul Pembelajaran AI Navigator ({displayModules.length} JP)</strong> dengan predikat <strong className="text-emerald-700">LULUS</strong>.
                    </p>

                    {/* Bottom section */}
                    <div className="flex items-end justify-between w-full max-w-md mt-auto pt-4">
                      <div className="text-left">
                        <p className="text-xs text-slate-700 font-bold">{todayStr}</p>
                        {certNumber && <p className="text-xs text-slate-500 font-mono mt-0.5">{certNumber}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-blue-700 font-mono font-bold">{certUuid || ''}</p>
                        <p className="text-xs text-amber-600 font-bold mt-0.5">CTO & Founder, Maxy Academy</p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            )}

            {/* ============ HALAMAN 2: TRANSKRIP PART 1 (FULL-WIDTH 1-COLUMN TABLE) ============ */}
            {(activePageTab === 2 || isDownloading) && (
              <div
                ref={page2Ref}
                className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-700"
                style={{ display: activePageTab === 2 || isDownloading ? 'block' : 'none', aspectRatio: '850 / 600', backgroundColor: '#ffffff' }}
              >
                <div 
                  className="cert-scaler absolute top-0 left-0"
                  style={{
                    width: '850px',
                    height: '600px',
                    transformOrigin: 'top left',
                    transform: `scale(${certWidth / 850})`
                  }}
                >
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '2px solid #1e3a5f', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src="https://cms.maxy.academy/uploads/LogoMaxyBgWhite.png"
                        crossOrigin="anonymous"
                        alt="Maxy Academy Logo"
                        style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Transkrip Kurikulum Modul Pembelajaran (Bagian 1)
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '1px', fontWeight: 600 }}>
                          Lampiran Resmi Certificate of Completion – AI Navigator ({hasTier2 ? 'Tier 2 VIP Master' : 'Tier 1 Self-Paced Basic'})
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#1e3a5f' }}>{userName || 'Siswa AI Navigator'}</div>
                      <div style={{ fontSize: '10px', color: '#475569', fontFamily: 'monospace', fontWeight: 700 }}>{certNumber || 'No. 0255/AIN/NAV/2026'}</div>
                    </div>
                  </div>

                  {/* Full-Width 1-Column Table Part 1 */}
                  <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#1e3a5f', color: '#ffffff', fontSize: '12.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '42px', borderRight: '1px solid #2d4a6f' }}>No</th>
                          <th style={{ padding: '6px 10px' }}>Judul Modul Pembelajaran &amp; Deskripsi Materi</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '70px', borderLeft: '1px solid #2d4a6f' }}>Bobot</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '80px', borderLeft: '1px solid #2d4a6f' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {part1Modules.map((m, idx) => renderModuleRow(m, idx + 1, idx))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Part 1 */}
                  <div style={{ paddingTop: '6px', marginTop: '6px', borderTop: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#475569' }}>
                    <span>Halaman 2 dari {totalPages} • Transkrip Kurikulum Modul Pembelajaran AI Navigator</span>
                    <span style={{ fontFamily: 'monospace', color: '#1e3a5f', fontWeight: 800 }}>UUID: {certUuid || (progress as any)?.certUuid || (isIssuing ? 'Memuat...' : '-')}</span>
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* ============ HALAMAN 3: TRANSKRIP PART 2 (FULL-WIDTH 1-COLUMN TABLE) ============ */}
            {part2Modules.length > 0 && (activePageTab === 3 || isDownloading) && (
              <div
                ref={page3Ref}
                className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-700"
                style={{ display: activePageTab === 3 || isDownloading ? 'block' : 'none', aspectRatio: '850 / 600', backgroundColor: '#ffffff' }}
              >
              <div 
                className="cert-scaler absolute top-0 left-0"
                style={{
                  width: '850px',
                  height: '600px',
                  transformOrigin: 'top left',
                  transform: `scale(${certWidth / 850})`
                }}
              >
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '2px solid #1e3a5f', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src="https://cms.maxy.academy/uploads/LogoMaxyBgWhite.png"
                      crossOrigin="anonymous"
                      alt="Maxy Academy Logo"
                      style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
                    />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Transkrip Kurikulum Modul Pembelajaran (Bagian 2)
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '1px', fontWeight: 600 }}>
                          Lampiran Resmi Certificate of Completion – AI Navigator ({hasTier2 ? 'Tier 2 VIP Master' : 'Tier 1 Self-Paced Basic'})
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#1e3a5f' }}>{userName || 'Siswa AI Navigator'}</div>
                      <div style={{ fontSize: '10px', color: '#475569', fontFamily: 'monospace', fontWeight: 700 }}>{certNumber || 'No. 0255/AIN/NAV/2026'}</div>
                    </div>
                  </div>

                  {/* Full-Width 1-Column Table Part 2 */}
                  <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#1e3a5f', color: '#ffffff', fontSize: '12.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '42px', borderRight: '1px solid #2d4a6f' }}>No</th>
                          <th style={{ padding: '6px 10px' }}>Judul Modul Pembelajaran &amp; Deskripsi Materi</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '70px', borderLeft: '1px solid #2d4a6f' }}>Bobot</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '80px', borderLeft: '1px solid #2d4a6f' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {part2Modules.map((m, idx) => renderModuleRow(m, part1Modules.length + idx + 1, idx))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Part 2 or Summary */}
                  {part3Modules.length > 0 ? (
                    <div style={{ paddingTop: '6px', marginTop: '6px', borderTop: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#475569' }}>
                      <span>Halaman 3 dari {totalPages} • Transkrip Kurikulum Modul Pembelajaran AI Navigator</span>
                      <span style={{ fontFamily: 'monospace', color: '#1e3a5f', fontWeight: 800 }}>UUID: {certUuid || (progress as any)?.certUuid || (isIssuing ? 'Memuat...' : '-')}</span>
                    </div>
                  ) : (
                    <div style={{ paddingTop: '6px', marginTop: '6px', borderTop: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '10.5px', color: '#334155', lineHeight: 1.4 }}>
                        <div>* Total Beban Belajar: <strong style={{ color: '#1e3a5f', fontSize: '11px' }}>{displayModules.length} JP</strong> (1 JP = 45 menit pembelajaran terstruktur &amp; evaluasi).</div>
                        <div>* Status Kelulusan: <strong style={{ color: '#047857' }}>100% LULUS TERVERIFIKASI</strong>.</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#1e3a5f', fontWeight: 900 }}>UUID: {certUuid || (progress as any)?.certUuid || (isIssuing ? 'Memuat...' : '-')}</div>
                        <div style={{ fontSize: '10.5px', color: '#b45309', fontWeight: 800, marginTop: '1px' }}>Maxy Academy — Executive Education Board</div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            )}

            {/* ============ HALAMAN 4: TRANSKRIP PART 3 (FOR TIER 2 29 MODULES) ============ */}
            {part3Modules.length > 0 && (activePageTab === 4 || isDownloading) && (
              <div
                ref={page4Ref}
                className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-700"
                style={{ display: activePageTab === 4 || isDownloading ? 'block' : 'none', aspectRatio: '850 / 600', backgroundColor: '#ffffff' }}
              >
              <div 
                className="cert-scaler absolute top-0 left-0"
                style={{
                  width: '850px',
                  height: '600px',
                  transformOrigin: 'top left',
                  transform: `scale(${certWidth / 850})`
                }}
              >
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '2px solid #1e3a5f', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src="https://cms.maxy.academy/uploads/LogoMaxyBgWhite.png"
                      crossOrigin="anonymous"
                      alt="Maxy Academy Logo"
                      style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
                    />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Transkrip Kurikulum Modul Pembelajaran (Bagian 3)
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '1px', fontWeight: 600 }}>
                          Lampiran Resmi Certificate of Completion – AI Navigator (Tier 2 VIP Master)
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#1e3a5f' }}>{userName || 'Siswa AI Navigator'}</div>
                      <div style={{ fontSize: '10px', color: '#475569', fontFamily: 'monospace', fontWeight: 700 }}>{certNumber || 'No. 0255/AIN/NAV/2026'}</div>
                    </div>
                  </div>

                  {/* Full-Width 1-Column Table Part 3 */}
                  <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#1e3a5f', color: '#ffffff', fontSize: '12.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '42px', borderRight: '1px solid #2d4a6f' }}>No</th>
                          <th style={{ padding: '6px 10px' }}>Judul Modul Pembelajaran &amp; Deskripsi Materi</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '70px', borderLeft: '1px solid #2d4a6f' }}>Bobot</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '80px', borderLeft: '1px solid #2d4a6f' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {part3Modules.map((m, idx) => renderModuleRow(m, part1Modules.length + part2Modules.length + idx + 1, idx))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary & Legal Verification Footer */}
                  <div style={{ paddingTop: '6px', marginTop: '6px', borderTop: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '10.5px', color: '#334155', lineHeight: 1.4 }}>
                      <div>* Total Beban Belajar: <strong style={{ color: '#1e3a5f', fontSize: '11px' }}>{displayModules.length} JP</strong> (1 JP = 45 menit pembelajaran terstruktur &amp; evaluasi).</div>
                      <div>* Status Kelulusan: <strong style={{ color: '#047857' }}>100% LULUS TERVERIFIKASI</strong>.</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#1e3a5f', fontWeight: 900 }}>UUID: {certUuid || (progress as any)?.certUuid || (isIssuing ? 'Memuat...' : '-')}</div>
                      <div style={{ fontSize: '10.5px', color: '#b45309', fontWeight: 800, marginTop: '1px' }}>Maxy Academy — Executive Education Board</div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Verification Link */}
            {(verifyUrl || certUuid) && (
              <div className="text-center pt-2">
                <a
                  href={verifyUrl || `https://cms.maxy.academy/certificate/verify/${certUuid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Verifikasi Keaslian Sertifikat</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CertificateModal = React.memo(CertificateModalComponent);
