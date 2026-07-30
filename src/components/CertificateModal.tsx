import React, { useState, useRef } from 'react';
import { Award, X, Sparkles, CheckCircle2, Download, Compass, ShieldCheck, Mail, User, Crown, ExternalLink, BookOpen, Loader2 } from 'lucide-react';
import { UserProgress } from '../types';
import { issueCertificateApi } from '../services/api';
import { MODULES_DATA } from '../data/modulesData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSaveCertDetails?: (name: string, email: string) => void;
  packages?: Record<string, { price: number; fake_price: number; name?: string; certificate_bg_image?: string | null }>;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSaveCertDetails,
  packages,
}) => {
  const [userName, setUserName] = useState(
    progress?.certName || progress?.capstoneSubmission?.name || 'Siswa AI Navigator'
  );
  const [userEmail, setUserEmail] = useState(
    progress?.certEmail || progress?.capstoneSubmission?.email || 'siswa@ainavigator.id'
  );
  const [isVerified, setIsVerified] = useState(!!progress?.certRequested || !!progress?.certName);
  const [certUuid, setCertUuid] = useState<string>('');
  const [certNumber, setCertNumber] = useState<string>('');
  const [verifyUrl, setVerifyUrl] = useState<string>('');
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const userTier = progress.userTier || 'free';
  const tierKey = userTier === 'tier2' ? 'tier2' : 'tier1';
  const bgImage = packages?.[tierKey]?.certificate_bg_image;
  const templateDataRaw = (packages?.[tierKey] as any)?.certificate_template_data;

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

  const isTier1 = userTier === 'tier1' || userTier === 'free';
  const displayModules = isTier1 ? MODULES_DATA.slice(0, 22) : MODULES_DATA;
  const halfLength = Math.ceil(displayModules.length / 2);
  const leftModules = displayModules.slice(0, halfLength);
  const rightModules = displayModules.slice(halfLength);

  const now = new Date();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' });
  const dayNum = now.getDate();
  const yearNum = now.getFullYear();
  const todayStr = `Jakarta, ${monthName} ${dayNum}, ${yearNum}`;

  const handleVerifyCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      alert('Mohon isi Nama Lengkap dan Email untuk verifikasi sertifikat!');
      return;
    }
    setIsIssuing(true);
    try {
      const res = await issueCertificateApi(userName.trim(), userEmail.trim());
      if (res.success && res.data) {
        setCertUuid(res.data.uuid);
        setCertNumber(res.data.certificate_number);
        setVerifyUrl(res.data.verify_url);
      }
    } catch (err) {
      console.error('Cert issuance error:', err);
    } finally {
      setIsIssuing(false);
      setIsVerified(true);
      if (onSaveCertDetails) {
        onSaveCertDetails(userName.trim(), userEmail.trim());
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    setIsDownloading(true);

    try {
      // Capture Page 1
      const canvas1 = await html2canvas(page1Ref.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      // Capture Page 2
      const canvas2 = await html2canvas(page2Ref.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // A4 Landscape dimensions in mm
      const pdfWidth = 297;
      const pdfHeight = 210;

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Page 1
      const img1 = canvas1.toDataURL('image/png');
      pdf.addImage(img1, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Page 2
      pdf.addPage();
      const img2 = canvas2.toDataURL('image/png');
      pdf.addImage(img2, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const safeName = (userName || 'certificate').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Sertifikat_AI_Navigator_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Gagal mengunduh PDF. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper: render a single module row for the transcript table
  const renderModuleRow = (m: (typeof MODULES_DATA)[0], globalIdx: number, localIdx: number) => (
    <tr key={m.id} className={localIdx % 2 === 0 ? 'bg-white' : 'bg-blue-50/40'}>
      <td className="py-[3px] px-2 font-mono text-slate-500 font-bold text-center border-r border-slate-200 text-[9px]">{globalIdx}</td>
      <td className="py-[3px] px-2 font-semibold text-slate-800 text-[9px] leading-tight">
        {m.title}
        <span className="block text-[7.5px] text-slate-400 font-normal leading-none mt-0.5">{m.subtitle}</span>
      </td>
      <td className="py-[3px] px-1.5 text-center font-bold text-blue-700 border-l border-slate-200 text-[9px]">1 JP</td>
      <td className="py-[3px] px-1.5 text-center border-l border-slate-200">
        <span className="px-1.5 py-[1px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[7.5px] font-black rounded">LULUS</span>
      </td>
    </tr>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
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
                Silakan isi dan periksa kembali Nama &amp; Email Anda. Data ini akan dicetak secara sah pada <strong>Certificate of Completion &amp; Transkrip Kurikulum Modul</strong>.
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
                disabled={isIssuing}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isIssuing ? 'Menerbitkan Certify UUID...' : 'Terbitkan Certificate & Transkrip'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Official Certificate & Transcript View */
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sertifikat Terverifikasi
                </span>
                <button
                  onClick={() => setIsVerified(false)}
                  className="text-xs text-slate-400 hover:text-amber-400 underline font-medium cursor-pointer"
                >
                  Ubah Nama/Email
                </button>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isDownloading ? 'Memproses PDF...' : 'Download Sertifikat PDF (2 Halaman)'}</span>
              </button>
            </div>

            {/* ============ HALAMAN 1: SERTIFIKAT ============ */}
            <div
              ref={page1Ref}
              className="w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700"
              style={{ aspectRatio: '850 / 600' }}
            >
              {bgImage ? (
                <div
                  className="relative w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  {templateObjects.length > 0 ? (
                    templateObjects.map((obj: any, i: number) => {
                      let content = obj.text || '';
                      if (obj.id === 'NAME') content = userName || 'Siswa AI Navigator';
                      else if (obj.id === 'UUID') content = certUuid || 'f7ad0d5c-6528-4517-9074-70ee377a03fb';
                      else if (obj.id === 'NO_SERTIF') content = certNumber || 'No. 0255/AIN/NAV/2026';
                      else if (obj.id === 'DATE') content = todayStr;

                      const topPercent = (obj.top / 600) * 100;
                      const leftPercent = (obj.left / 850) * 100;

                      return (
                        <div
                          key={i}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
                          style={{
                            top: `${topPercent}%`,
                            left: `${leftPercent}%`,
                            fontSize: `${obj.fontSize ? Math.max(12, Math.round(obj.fontSize * 0.85)) : 20}px`,
                            fontFamily: obj.fontFamily || 'Poppins',
                            fontWeight: obj.fontWeight || 'normal',
                            color: obj.fill || '#ffffff',
                            textAlign: (obj.textAlign as any) || 'center',
                          }}
                        >
                          {content}
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div className="absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <h3 className="text-2xl sm:text-4xl font-black text-amber-300 drop-shadow-lg">{userName || 'Siswa AI Navigator'}</h3>
                      </div>
                      <div className="absolute bottom-[10%] left-[8%] pointer-events-none text-xs text-slate-700 font-bold">
                        {todayStr}
                      </div>
                      <div className="absolute bottom-[10%] right-[8%] pointer-events-none text-xs text-blue-800 font-mono font-bold">
                        {certUuid || 'f7ad0d5c-6528-4517-9074-70ee377a03fb'}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Fallback: Digital Certificate */
                <div className="w-full h-full bg-white relative flex flex-col items-center justify-center p-8 text-center">
                  {/* Gold border accent */}
                  <div className="absolute inset-2 border-2 border-amber-400/60 rounded-lg pointer-events-none" />
                  <div className="absolute inset-3.5 border border-amber-300/30 rounded pointer-events-none" />

                  {/* Top decorative line */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="w-16 h-[1px] bg-amber-400" />
                    <Compass className="w-5 h-5 text-amber-500" />
                    <div className="w-16 h-[1px] bg-amber-400" />
                  </div>

                  <div className="space-y-1 mt-4">
                    <span className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase block">Maxy Academy — AI Navigator Program</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                      CERTIFICATE
                    </h2>
                    <p className="text-sm text-slate-500 font-medium italic">Of Completion</p>
                  </div>

                  <p className="text-xs text-slate-500 mt-3">This certificate is proudly presented to:</p>

                  <div className="mt-2 pb-1.5 border-b-2 border-amber-400/50 px-8">
                    <h3 className="text-xl sm:text-3xl font-black text-blue-800" style={{ fontFamily: 'Georgia, serif' }}>
                      {userName || 'Siswa AI Navigator'}
                    </h3>
                  </div>

                  <p className="text-[10px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-3">
                    telah berhasil menyelesaikan seluruh <strong>{displayModules.length} Modul Pembelajaran AI Navigator ({displayModules.length} JP)</strong> dengan predikat <strong className="text-emerald-700">LULUS</strong>.
                  </p>

                  {/* Bottom section */}
                  <div className="flex items-end justify-between w-full max-w-md mt-auto pt-4">
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500">{todayStr}</p>
                      {certNumber && <p className="text-[9px] text-slate-400 font-mono mt-0.5">{certNumber}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-mono">{certUuid || 'AIN-2026-CERT'}</p>
                      <p className="text-[10px] text-amber-600 font-bold mt-0.5">CTO & Founder, Maxy Academy</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============ HALAMAN 2: TRANSKRIP ============ */}
            <div
              ref={page2Ref}
              className="w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-white"
              style={{ aspectRatio: '850 / 600' }}
            >
              <div className="w-full h-full flex flex-col p-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-blue-800 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider">
                        Transkrip Kurikulum &amp; Beban Belajar
                      </h3>
                      <p className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">
                        Lampiran Resmi Certificate of Completion – AI Navigator ({userTier === 'tier2' ? 'Tier 2 VIP Master' : 'Tier 1 Self-Paced Basic'})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-blue-900 block leading-tight">{userName || 'Siswa AI Navigator'}</span>
                    <span className="text-[8px] text-slate-500 font-mono block leading-none">{certNumber || 'No. 0255/AIN/NAV/2026'}</span>
                  </div>
                </div>

                {/* 2-Column Table */}
                <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 overflow-hidden">
                  {/* Column 1 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-blue-800 text-white text-[8px] font-bold uppercase tracking-wider">
                          <th className="py-1.5 px-2 text-center w-6 border-r border-blue-700">No</th>
                          <th className="py-1.5 px-2">Judul Modul</th>
                          <th className="py-1.5 px-1.5 text-center w-10 border-l border-blue-700">Bobot</th>
                          <th className="py-1.5 px-1.5 text-center w-12 border-l border-blue-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leftModules.map((m, idx) => renderModuleRow(m, idx + 1, idx))}
                      </tbody>
                    </table>
                  </div>

                  {/* Column 2 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-blue-800 text-white text-[8px] font-bold uppercase tracking-wider">
                          <th className="py-1.5 px-2 text-center w-6 border-r border-blue-700">No</th>
                          <th className="py-1.5 px-2">Judul Modul</th>
                          <th className="py-1.5 px-1.5 text-center w-10 border-l border-blue-700">Bobot</th>
                          <th className="py-1.5 px-1.5 text-center w-12 border-l border-blue-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rightModules.map((m, idx) => renderModuleRow(m, leftModules.length + idx + 1, idx))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2.5 mt-2.5 border-t border-slate-200 flex items-center justify-between text-[8.5px] text-slate-500">
                  <span>Total Beban: <strong className="text-blue-900">{displayModules.length} JP</strong> (1 JP = 45 menit pembelajaran terstruktur)</span>
                  <span className="font-mono text-blue-900 font-bold text-[8px]">UUID: {certUuid || 'f7ad0d5c-6528-4517-9074-70ee377a03fb'}</span>
                </div>
              </div>
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
