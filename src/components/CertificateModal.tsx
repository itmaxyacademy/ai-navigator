import React, { useState } from 'react';
import { Award, X, Sparkles, CheckCircle2, Printer, Compass, ShieldCheck, Mail, User, Crown, ExternalLink, BookOpen } from 'lucide-react';
import { UserProgress } from '../types';
import { issueCertificateApi } from '../services/api';
import { MODULES_DATA } from '../data/modulesData';

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn my-8 text-white">
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Certificate (2 Halaman)
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
                  <Printer className="w-4 h-4" /> Cetak / PDF (Halaman 1 &amp; 2)
                </button>
              </div>
            </div>

            {/* HALAMAN 1: Printable Certificate Frame */}
            {templateObjects.length > 0 && bgImage ? (
              <div
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-cover bg-center border-4 border-amber-500/40 my-2"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  aspectRatio: '850 / 600',
                }}
              >
                {templateObjects.map((obj: any, i: number) => {
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
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none drop-shadow-md"
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
                })}
              </div>
            ) : (
              <div
                className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/40 rounded-2xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-2xl bg-cover bg-center"
                style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
              >
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
                  Telah berhasil menyelesaikan seluruh <strong>{displayModules.length} Modul Pembelajaran AI Navigator ({displayModules.length} JP)</strong>, meliputi penguasaan Teknik Prompting RCTF, ChatGPT, Claude, Gemini, Perplexity, Copilot, Meta AI, DeepSeek, v0.dev, Bolt.new, dan Capstone Project.
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
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {displayModules.length} Modul Selesai ({displayModules.length} JP)
                    </span>
                  )}
                </div>

                {/* Signatures & Verification Info */}
                <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 max-w-lg mx-auto text-left gap-3">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold">Tanggal Kelulusan:</span>
                    <strong className="text-slate-200">{todayStr}</strong>
                    {certNumber && <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{certNumber}</span>}
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 font-bold">UUID Certify Maxy:</span>
                    <strong className="text-amber-400 font-mono text-[11px] block">{certUuid || 'AIN-2026-CERT-29M'}</strong>
                    {verifyUrl ? (
                      <a
                        href={verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline inline-flex items-center gap-1 mt-1 cursor-pointer print:hidden"
                      >
                        <span>Verifikasi Keaslian Maxy Certify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <a
                        href={`https://cms.maxy.academy/certificate/verify/${certUuid || 'AIN-2026-CERT-29M'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline inline-flex items-center gap-1 mt-1 cursor-pointer print:hidden"
                      >
                        <span>Verifikasi Keaslian Maxy Certify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* HALAMAN 2: Transkrip Kurikulum Pembelajaran & Bobot 1 JP Per Modul */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/40 rounded-2xl p-6 sm:p-8 text-left space-y-5 relative overflow-hidden shadow-2xl print:break-before-page">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <h3 className="text-lg font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    TRANSKRIP KURIKULUM &amp; BEBAN BELAJAR (HALAMAN 2)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Lampiran Resmi Certificate of Completion – AI Navigator ({userTier === 'tier2' ? 'Tier 2 VIP Master' : 'Tier 1 Self-Paced Basic'})
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-slate-200 block">{userName}</span>
                  <span className="text-[10px] text-amber-400 font-mono block">{certNumber || 'AIN-2026-CERT'}</span>
                </div>
              </div>

              {/* Table Transkrip Modul */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-amber-400 font-bold uppercase text-[10px] tracking-wider bg-slate-900/80">
                      <th className="py-2.5 px-2.5 text-center w-10">No</th>
                      <th className="py-2.5 px-3 w-1/3">Judul Modul Pembelajaran</th>
                      <th className="py-2.5 px-3">Deskripsi Singkat Subtitle</th>
                      <th className="py-2.5 px-2 text-center w-16">Bobot</th>
                      <th className="py-2.5 px-2 text-center w-20">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {displayModules.map((m, idx) => (
                      <tr key={m.id} className="hover:bg-slate-900/50">
                        <td className="py-2 px-2 font-mono text-slate-400 text-center">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-white">
                          {m.title}
                          {m.badge && <span className="block text-[10px] text-indigo-400 font-normal mt-0.5">{m.badge}</span>}
                        </td>
                        <td className="py-2 px-3 text-slate-300 text-[11px] leading-snug">
                          {m.subtitle}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-amber-400">1 JP</td>
                        <td className="py-2 px-2 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            LULUS
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-800 font-bold text-xs text-white bg-slate-900/90">
                      <td colSpan={3} className="py-3 px-3 text-right text-slate-300">TOTAL BEBAN PELAJARAN:</td>
                      <td className="py-3 px-2 text-center text-amber-400 font-extrabold text-sm">
                        {displayModules.length} JP
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer Transkrip */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
                <span>* 1 JP (Jam Pelajaran) setara dengan 45 menit kegiatan pembelajaran terstruktur.</span>
                <span className="font-mono text-indigo-400">UUID Certify: {certUuid || 'AIN-2026-CERT-29M'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
