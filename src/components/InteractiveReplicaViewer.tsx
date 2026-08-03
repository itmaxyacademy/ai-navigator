import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateWithGemini } from '../services/gemini';
import { 
  Sparkles, Info, Send, Copy, Check, ChevronRight, RefreshCw,
  Code2, Brain, Terminal, Eye, ExternalLink
} from 'lucide-react';
import { CourseModule, RCTFState } from '../types';
import { ChatGPTReplica } from './ChatGPTReplica';
import { ClaudeReplica } from './ClaudeReplica';
import { GeminiReplica } from './GeminiReplica';
import { PerplexityReplica } from './PerplexityReplica';
import { CopilotReplica } from './CopilotReplica';
import { MetaAIReplica } from './MetaAIReplica';
import { DeepSeekReplica } from './DeepSeekReplica';
import { GeminiNotebookReplica } from './GeminiNotebookReplica';
import { GoogleFlowReplica } from './GoogleFlowReplica';
import { LeonardoAIReplica } from './LeonardoAIReplica';
import { GoogleStitchReplica } from './GoogleStitchReplica';
import { StableDiffusionReplica } from './StableDiffusionReplica';
import { OpenArtReplica } from './OpenArtReplica';
import { CraiyonReplica } from './CraiyonReplica';
import { ElevenLabsReplica } from './ElevenLabsReplica';
import { SunoReplica } from './SunoReplica';
import { GoogleAIStudioReplica } from './GoogleAIStudioReplica';
import { TrebloReplica } from './TrebloReplica';
import { FathomReplica } from './FathomReplica';
import { GeminiGemsReplica } from './GeminiGemsReplica';
import { MistralVibeReplica } from './MistralVibeReplica';
import { ClaudeFeaturesReplica } from './ClaudeFeaturesReplica';
import { KimiAiReplica } from './KimiAiReplica';
import { LumoReplica } from './LumoReplica';
import { LovableReplica } from './LovableReplica';
import { GammaReplica } from './GammaReplica';
import { ManusReplica } from './ManusReplica';
import { NotionAiReplica } from './NotionAiReplica';
import { MiniQuizCheckpoint } from './MiniQuizCheckpoint';
import { getSectionCheckpointQuestion } from '../lib/miniQuizData';

interface InteractiveReplicaViewerProps {
  module: CourseModule;
  onAdvanceToQuiz: () => void;
  completedCheckpoints?: string[];
  onCompleteCheckpoint?: (checkpointId: string, xpBonus: number) => void;
}

export const InteractiveReplicaViewer: React.FC<InteractiveReplicaViewerProps> = ({
  module,
  onAdvanceToQuiz,
  completedCheckpoints,
  onCompleteCheckpoint,
}) => {
  const replica = module.content.interactiveReplica;
  const replicaQuestion = getSectionCheckpointQuestion(module, 'replica');

  // Helper to build 4-line RCTF prompt string
  const buildRCTFPromptString = (r: RCTFState) => {
    return `[ROLE]: ${r.role}\n[CONTEXT]: ${r.context}\n[TASK]: ${r.task}\n[FORMAT]: ${r.format}`;
  };

  // Special UI states per LLM
  // Module 1 (RCTF)
  const [rctf, setRctf] = useState<RCTFState>({
    role: 'Pakar Komunikasi & Edukasi AI',
    context: 'Untuk mahasiswa yang baru belajar AI',
    task: 'Jelaskan cara kerja dasar LLM dalam 2 kalimat ringkas',
    format: 'Poin-poin sederhana dengan analogi koki restoran',
  });

  // Prompt execution state
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [currentResponse, setCurrentResponse] = useState<string>(replica.simulatedResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Practice Verification State
  const [isPracticeVerified, setIsPracticeVerified] = useState<boolean>(false);

  const triggerPracticeVerified = () => {
    if (!isPracticeVerified) {
      setIsPracticeVerified(true);
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      } catch (e) {}
    }
  };

  // Sync prompt on module change or initial load
  useEffect(() => {
    setIsPracticeVerified(false);
    if (module.id === 1) {
      setUserPrompt(buildRCTFPromptString(rctf));
    } else {
      setUserPrompt(replica.initialPrompt);
    }
    setCurrentResponse(replica.simulatedResponse);
  }, [module.id]);

  // Handler for RCTF input updates with real-time prompt sync
  const handleRctfChange = (field: keyof RCTFState, value: string) => {
    const updated = { ...rctf, [field]: value };
    setRctf(updated);
    if (module.id === 1) {
      setUserPrompt(buildRCTFPromptString(updated));
    }
  };

  // Module 3 (Claude Artifacts)
  const [showArtifactPanel, setShowArtifactPanel] = useState(true);

  // Module 6 (Copilot Styles)
  const [copilotStyle, setCopilotStyle] = useState<'creative' | 'balanced' | 'precise'>('balanced');

  // Module 8 (DeepSeek Reasoning)
  const [showThoughtAccordion, setShowThoughtAccordion] = useState(true);

  // Execute Prompt Handler (Offline Mode)
  const handleExecutePrompt = async () => {
    setIsLoading(true);
    
    try {
      const realAiResponse = await generateWithGemini(userPrompt);
      if (realAiResponse) {
        if (module.id === 1) {
          setCurrentResponse(`[Respon Live AI Prompt Terstruktur RCTF]\n\n${realAiResponse}`);
        } else {
          setCurrentResponse(`[Respon Live AI (${replica.llmName})]\n\n${realAiResponse}`);
        }
      } else {
        // Fallback jika API habis atau gagal
        if (module.id === 1) {
          setCurrentResponse(
            `[Respon Simulasi AI Prompt Terstruktur RCTF]\n\nHalo! Bertindak sebagai ${rctf.role || 'Asisten AI'}:\n\nBerdasarkan situasi (${rctf.context || 'Konteks Umum'}), berikut adalah solusi tugas "${rctf.task || 'Tugas Utama'}":\n\n1. **Poin Utama**: Large Language Model bekerja dengan memprediksi kata berikutnya paling logis berdasarkan ribuan data yang telah dipelajari.\n2. **Analogi Koki**: Bayangkan LLM seperti koki handal yang meracik masakan (jawaban) berdasarkan resep dan pesanan khusus (prompt) yang Anda berikan.\n\n(Hasil disusun rapi sesuai format: ${rctf.format || 'Poin-poin sederhana'})`
          );
        } else {
          setCurrentResponse(
            `[Respon Simulasi ${replica.llmName}]\n\nInstruksi "${userPrompt}" berhasil diproses secara instan!\n\nBerikut adalah respon terstruktur sesuai fitur utama ${replica.llmName}. Eksperimen dengan variasi kata kunci untuk melihat perubahan hasil.`
          );
        }
      }
    } catch (err) {
      if (module.id === 1) {
        setCurrentResponse(
          `[Respon Simulasi AI Prompt Terstruktur RCTF]\n\nHalo! Bertindak sebagai ${rctf.role || 'Asisten AI'}:\n\nBerdasarkan situasi (${rctf.context || 'Konteks Umum'}), berikut adalah solusi tugas "${rctf.task || 'Tugas Utama'}":\n\n1. **Poin Utama**: Large Language Model bekerja dengan memprediksi kata berikutnya paling logis berdasarkan ribuan data yang telah dipelajari.\n2. **Analogi Koki**: Bayangkan LLM seperti koki handal yang meracik masakan (jawaban) berdasarkan resep dan pesanan khusus (prompt) yang Anda berikan.\n\n(Hasil disusun rapi sesuai format: ${rctf.format || 'Poin-poin sederhana'})`
        );
      } else {
        setCurrentResponse(
          `[Respon Simulasi ${replica.llmName}]\n\nInstruksi "${userPrompt}" berhasil diproses secara instan!\n\nBerikut adalah respon terstruktur sesuai fitur utama ${replica.llmName}. Eksperimen dengan variasi kata kunci untuk melihat perubahan hasil.`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(userPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModulePracticeMission = (modId: number, modTitle: string): string => {
    switch (modId) {
      case 1:
        return 'Lengkapi 4 parameter kerangka RCTF (Role, Context, Task, Format) di bawah untuk memicu pembuat prompt terstruktur!';
      case 2:
        return 'Eksplorasi perintah percakapan, beralih model GPT-4o / Reasoning, atau klik sampel prompt ChatGPT di dalam simulator!';
      case 3:
        return 'Uji fitur Artifacts dengan membuat komponen kode React/SVG dan perhatikan bagaimana panel pratinjau muncul di sisi kanan!';
      case 4:
        return 'Coba fitur pemrosesan multimodal Gemini dengan memasukkan teks atau mengunggah sampel gambar untuk dianalisis!';
      case 5:
        return 'Ketik topik pencarian untuk melihat bagaimana Perplexity AI menyajikan jawaban terstruktur dengan sitasi sumber klaim!';
      case 6:
        return 'Uji 3 gaya respons Copilot (Creative, Balanced, Precise) untuk melihat perbedaan nada bahasa dan integrasi Office!';
      case 7:
        return 'Simulasikan percakapan dengan model open-weights Meta AI Llama 3 untuk pembuatan teks & ide konten media sosial!';
      case 8:
        return 'Aktifkan mode "Reasoning Chain R1" untuk melihat langkah penalaran terperinci AI sebelum memberikan jawaban akhir!';
      case 9:
        return 'Unggah sampel dokumen/PDF ke NotebookLM untuk membuat ringkasan rangkuman, FAQ otomatis, serta draf skrip Audio Overview!';
      case 10:
        return 'Susun rantai alur kerja otomatisasi Google Flow dengan menghubungkan node pemicu, analisis AI, dan tindakan output!';
      case 11:
        return 'Ketik deskripsi prompt visual dan atur gaya artistik (PhotoReal, Anime, Alchemy) untuk menghasilkan karya seni digital!';
      case 12:
        return 'Gabungkan komponen UI React dan Tailwind CSS menggunakan Google Stitch untuk membangun tata letak aplikasi cerdas!';
      case 13:
        return 'Uji pengaturan Sampler, CFG Scale, dan Negative Prompt pada Stable Diffusion untuk mengontrol detail sintesis gambar!';
      case 14:
        return 'Gunakan canvas OpenArt untuk melatih gaya visual, menerapkan Inpainting, atau mengubah sketsa draf menjadi lukisan realistis!';
      case 15:
        return 'Ketik deskripsi gambar visual dan klik "Generate Image (Offline AI Engine)" untuk memproses 4 variasi gambar secara instan!';
      case 16:
        return 'Ketik naskah teks, pilih karakter suara (Rachel/Adam), lalu klik "Generate Voice Audio" untuk mendengarkan audio suara sintetis!';
      case 17:
        return 'Ketik judul lagu dan genre musik, lalu klik "Generate 2 Song Versions" untuk memutar lagu lengkap dengan lirik instan!';
      case 18:
        return 'Uji pembuatan System Instructions, atur parameter Temperature & Top-P, serta dapatkan kode cURL/Python API secara langsung!';
      case 19:
        return 'Komposisikan trek musik latar dan efek audio AI dengan menyesuaikan Tempo, Instrumen, serta Mood di studio Treblo!';
      case 20:
        return 'Pilih sampel notulensi rapat Fathom AI dan jalankan analisis otomatis untuk menghasilkan poin aksi & ringkasan eksekutif!';
      case 21:
        return 'Pilih persona Gem spesialis (Marketing Pro, Coding Coach, Study Buddy) dan mulailah konsultasi terfokus sesuai topik!';
      case 22:
        return 'Ketik instruksi tugas pengembangan perangkat lunak dan saksikan agen Mistral Vibe merencanakan serta mengeksekusi kode secara mandiri!';
      case 23:
        return 'Jelajahi integrasi Claude Studio mulai dari tahap Pembuatan Proyek, Manajemen Pengetahuan, hingga Penulisan Dokumen Artefak!';
      case 24:
        return 'Uji kapasitas analisis dokumen konteks 2 Juta Token dengan beralih di antara mode Kimi AI (Chat, Work, Code, Claw)!';
      case 25:
        return 'Jalankan asisten Lumo AI multimodal untuk pencarian jawaban presisi tinggi, pemrosesan dokumen visual, dan pembuatan gambar!';
      case 26:
        return 'Klik salah satu chip prompt cepat atau ketik deskripsi aplikasi web Anda untuk melihat keajaiban pembuatan antarmuka React instan!';
      case 27:
        return 'Ketik topik presentasi dan biarkan Gamma AI menyusun slide presentasi, dokumen, atau halaman web terstruktur secara otomatis!';
      case 28:
        return 'Jalankan agen mandiri Manus AI untuk mengeksekusi riset mendalam, navigasi web, dan penyusunan laporan kompleks tanpa henti!';
      case 29:
        return 'Manfaatkan Notion AI untuk meringkas catatan rapat, memformat tabel database otomatis, dan menyusun draf dokumen kerja!';
      default:
        return `Uji coba interaksi di dalam simulator di bawah untuk memahami fitur utama dari platform ${modTitle}!`;
    }
  };

  return (
    <div className="space-y-6" onClick={triggerPracticeVerified}>
      {/* Top Banner Guide */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Bagian 2 Dari 3
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Simulasi Tampilan &amp; Panduan Fitur</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Tampilan Interaktif {replica.llmName}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Pelajari panduan fitur utama dan coba simulasi instruksi secara interaktif di bawah ini.
          </p>
        </div>

        <button
          onClick={onAdvanceToQuiz}
          className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-900 dark:text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
        >
          Saya Paham, Siap Uji Kuis Modul <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 🎯 Micro-Mission Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-900 border border-purple-500/40 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-xl shrink-0">
            🎯
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Misi Praktik Modul {module.id}
            </span>
            <p className="text-xs font-bold text-white leading-snug">
              {getModulePracticeMission(module.id, module.title)}
            </p>
          </div>
        </div>

        {isPracticeVerified ? (
          <span className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" /> Praktik Terverifikasi (+50 XP)
          </span>
        ) : (
          <span className="shrink-0 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
            ⚡ Klik / Uji Coba Simulator
          </span>
        )}
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Interface Replica (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {module.id === 2 ? (
            <ChatGPTReplica />
          ) : module.id === 3 ? (
            <ClaudeReplica />
          ) : module.id === 4 ? (
            <GeminiReplica />
          ) : module.id === 5 ? (
            <PerplexityReplica />
          ) : module.id === 6 ? (
            <CopilotReplica />
          ) : module.id === 7 ? (
            <MetaAIReplica />
          ) : module.id === 8 || module.slug === 'deepseek' ? (
            <DeepSeekReplica />
          ) : module.id === 9 || module.slug === 'gemini-notebook' ? (
            <GeminiNotebookReplica />
          ) : module.id === 10 || module.slug === 'google-flow' ? (
            <GoogleFlowReplica />
          ) : module.id === 11 || module.slug === 'leonardo-ai' ? (
            <LeonardoAIReplica />
          ) : module.id === 12 || module.slug === 'google-stitch' ? (
            <GoogleStitchReplica />
          ) : module.id === 13 || module.slug === 'stable-diffusion' ? (
            <StableDiffusionReplica />
          ) : module.id === 14 || module.slug === 'openart' ? (
            <OpenArtReplica />
          ) : module.id === 15 || module.slug === 'craiyon' ? (
            <CraiyonReplica />
          ) : module.id === 16 || module.slug === 'elevenlabs' ? (
            <ElevenLabsReplica />
          ) : module.id === 17 || module.slug === 'suno' ? (
            <SunoReplica />
          ) : module.id === 18 || module.slug === 'google-ai-studio' ? (
            <GoogleAIStudioReplica />
          ) : module.id === 19 || module.slug === 'sonauto' || module.slug === 'treblo' ? (
            <TrebloReplica />
          ) : module.id === 20 || module.slug === 'fathom' ? (
            <FathomReplica />
          ) : module.id === 21 || module.slug === 'gemini-gems' ? (
            <GeminiGemsReplica />
          ) : module.id === 22 || module.slug === 'mistral-vibe' ? (
            <MistralVibeReplica />
          ) : module.id === 23 || module.slug === 'claude-features' ? (
            <ClaudeFeaturesReplica />
          ) : module.id === 24 || module.slug === 'kimi-ai' ? (
            <KimiAiReplica />
          ) : module.id === 25 || module.slug === 'lumo-ai' || module.slug === 'lumo' || (replica?.llmName && replica.llmName.toLowerCase().includes('lumo')) ? (
            <LumoReplica />
          ) : module.id === 26 || module.slug === 'lovable' || module.slug === 'lovable-ai' || (replica?.llmName && replica.llmName.toLowerCase().includes('lovable')) ? (
            <LovableReplica />
          ) : module.id === 27 || module.slug === 'gamma' || module.slug === 'gamma-ai' || (replica?.llmName && replica.llmName.toLowerCase().includes('gamma')) ? (
            <GammaReplica />
          ) : module.id === 28 || module.slug === 'manus' || module.slug === 'manus-ai' || (replica?.llmName && replica.llmName.toLowerCase().includes('manus')) ? (
            <ManusReplica />
          ) : module.id === 29 || module.slug === 'notion' || module.slug === 'notion-ai' || (replica?.llmName && replica.llmName.toLowerCase().includes('notion')) ? (
            <NotionAiReplica />
          ) : (
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-2xl">
              {/* Top Bar Replica Header */}
              <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 ml-2">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    {replica.llmName} Simulator
                  </span>
                </div>

                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-300 border border-slate-300 dark:border-slate-700">
                  {replica.badgeText}
                </span>
              </div>

            {/* Special Interactive Controls Section per Module */}
            {module.id === 1 && (
              <div className="p-4 bg-white dark:bg-[#0d1322] border-b border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Formula RCTF Interactive Builder
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Edit parameter di bawah untuk memperbarui prompt
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-amber-400 font-semibold block mb-1">[R] ROLE (Peran):</label>
                    <input
                      type="text"
                      value={rctf.role}
                      onChange={(e) => handleRctfChange('role', e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                      placeholder="Peran AI..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-indigo-400 font-semibold block mb-1">[C] CONTEXT (Konteks):</label>
                    <input
                      type="text"
                      value={rctf.context}
                      onChange={(e) => handleRctfChange('context', e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="Konteks situasi..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-emerald-400 font-semibold block mb-1">[T] TASK (Tugas Utama):</label>
                    <input
                      type="text"
                      value={rctf.task}
                      onChange={(e) => handleRctfChange('task', e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Tugas utama..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-400 font-semibold block mb-1">[F] FORMAT (Format Result):</label>
                    <input
                      type="text"
                      value={rctf.format}
                      onChange={(e) => handleRctfChange('format', e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Format output..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Special Controls: Claude Artifacts Toggle (Module 3) */}
            {module.id === 3 && (
              <div className="p-3 bg-amber-950/40 border-b border-amber-800/40 flex items-center justify-between text-xs">
                <span className="text-amber-200 font-medium flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-amber-400" /> Mode Artifacts Active (Anthropic Jendela Terpisah)
                </span>
                <button
                  onClick={() => setShowArtifactPanel(!showArtifactPanel)}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors"
                >
                  {showArtifactPanel ? 'Sembunyikan Panel' : 'Tampilkan Panel Preview'}
                </button>
              </div>
            )}

            {/* Special Controls: Copilot Styles (Module 6) */}
            {module.id === 6 && (
              <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Pilih Conversation Style:</span>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setCopilotStyle('creative')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${copilotStyle === 'creative' ? 'bg-pink-600 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Creative
                  </button>
                  <button
                    onClick={() => setCopilotStyle('balanced')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${copilotStyle === 'balanced' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Balanced
                  </button>
                  <button
                    onClick={() => setCopilotStyle('precise')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${copilotStyle === 'precise' ? 'bg-emerald-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Precise
                  </button>
                </div>
              </div>
            )}

            {/* Special Controls: DeepSeek Reasoning Thought Accordion (Module 8) */}
            {module.id === 8 && (
              <div className="p-3 bg-blue-950/50 border-b border-blue-800/50 flex items-center justify-between text-xs">
                <span className="text-blue-300 font-bold flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-blue-400" /> DeepSeek-R1 Thought Chain Mode
                </span>
                <button
                  onClick={() => setShowThoughtAccordion(!showThoughtAccordion)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
                >
                  {showThoughtAccordion ? 'Tutup <thought>' : 'Buka <thought>'}
                </button>
              </div>
            )}

            {/* Main Interactive Chat Area */}
            <div className="p-5 space-y-4 min-h-[360px] max-h-[480px] overflow-y-auto relative">
              {/* User Prompt Bubble */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-lg text-xs leading-relaxed shadow-md">
                  <p className="font-semibold text-[10px] text-indigo-200 mb-1">
                    {module.id === 1 ? 'Prompt RCTF Terstruktur:' : 'Pengguna:'}
                  </p>
                  <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                    {userPrompt}
                  </div>
                </div>
              </div>

              {/* AI Thought Accordion for DeepSeek (Module 8) */}
              {module.id === 8 && showThoughtAccordion && (
                <div className="bg-white dark:bg-slate-900 border border-blue-800/60 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-blue-400 font-mono text-[11px] font-bold">
                    <span className="flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5" /> &lt;thought&gt; (Proses Berpikir R1 - 4.2 Detik)
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">MoE Activated</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed italic bg-slate-100 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                    1. Menganalisis batasan teka-teki: Kotak Apel, Jeruk, dan Campuran. All labels are wrong.<br />
                    2. Menguji pilihan kotak pertama: Jika membuka &apos;Campuran&apos;, isinya tidak mungkin campuran (karena label salah). Maka isinya 100% murni.<br />
                    3. Menarik deduksi logis secara berantai untuk sisa 2 kotak lainnya...
                  </p>
                </div>
              )}

              {/* AI Response Bubble */}
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-xl text-xs leading-relaxed space-y-2 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {replica.llmName} Output
                    </span>
                    <button
                      onClick={handleCopyPrompt}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center gap-1 text-[10px]"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin' : 'Salin Prompt'}
                    </button>
                  </div>

                  <div className="whitespace-pre-line text-slate-700 dark:text-slate-200">
                    {currentResponse}
                  </div>

                  {/* Claude Artifacts Window Panel Mockup inside */}
                  {module.id === 3 && showArtifactPanel && (
                    <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-950 border border-amber-800/60 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-amber-400 text-[11px] font-bold">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Artifacts Preview: React Button Component
                        </span>
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                          Live Render
                        </span>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-lg text-center flex items-center justify-center">
                        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all text-xs">
                          ✨ Tombol Interaktif Claude
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Perplexity Citations Box (Module 5) */}
                  {module.id === 5 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Rujukan Sitasi Real-time:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <a href="#cit1" className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-cyan-400" /> [1] TechReport AI 2026
                        </a>
                        <a href="#cit2" className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-cyan-400" /> [2] Statista Report
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Interactive Prompt Input Box */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 space-y-3">
              {module.id === 1 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Hasil Prompt Box (Terupdate Otomatis 4 Baris):
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Format Baris Terpisah [R, C, T, F]
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Hasil prompt terstruktur..."
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-200 leading-relaxed focus:outline-none focus:border-amber-500 resize-none selection:bg-amber-500 selection:text-slate-950"
                  />
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                    <button
                      onClick={handleCopyPrompt}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin!' : 'Salin Prompt Box'}
                    </button>
                    <button
                      onClick={handleExecutePrompt}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-900 dark:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                    >
                      {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Proses Ke Simulator
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder={`Tulis atau ubah instruksi untuk ${replica.llmName}...`}
                    className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleExecutePrompt}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 shrink-0"
                  >
                    {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Kirim
                  </button>
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        {/* Right Column: Feature Breakdown Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                Panduan Fitur Platform
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {replica.hotspots.length} Fitur Utama
              </span>
            </div>

            {/* Feature Cards List */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {replica.hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1.5 transition-all hover:border-slate-300 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {hotspot.title}
                    </h4>
                    {hotspot.tag && (
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {hotspot.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {hotspot.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Mid-Module Checkpoint */}
            {onCompleteCheckpoint && (
              <div className="pt-2">
                <MiniQuizCheckpoint
                  checkpointId={replicaQuestion.id}
                  title={replicaQuestion.title}
                  question={replicaQuestion}
                  completedCheckpoints={completedCheckpoints}
                  onCompleteCheckpoint={onCompleteCheckpoint}
                />
              </div>
            )}

            {/* Advance Button */}
            <button
              onClick={onAdvanceToQuiz}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-900 dark:text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              Saya Paham, Siap Uji Kuis Modul <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
