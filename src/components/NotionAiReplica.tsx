import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowUp,
  Calendar,
  CheckSquare,
  FolderOpen,
  BarChart3,
  Megaphone,
  Wand2,
  Check,
  AlignLeft,
  Minus,
  Mic,
  Smile,
  Search,
  MessageSquare,
  X,
  RotateCcw,
  Loader2,
  AlertCircle,
  Building2,
  Table,
  Info,
  ChevronRight,
  Send
} from 'lucide-react';

export const NotionAiReplica: React.FC = () => {
  // Global View Selector
  const [activeTab, setActiveTab] = useState<'builder' | 'editor' | 'landing'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('notion_tab');
    if (tab === 'builder' || tab === 'editor' || tab === 'landing') return tab;
    return 'landing';
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('notion_tab', activeTab);
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  // Load saved state from localStorage
  const savedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('notion_ai_state') || '{}') : {};

  // ==========================================
  // BAGIAN 1: MODAL BUILDER STATE
  // ==========================================
  const [builderPrompt, setBuilderPrompt] = useState<string>(
    savedState.builderPrompt || "Create a database for all marketing team members. Add information like their birthday, which office they're in, and their hobbies."
  );
  const [selectedTaskType, setSelectedTaskType] = useState<string>(savedState.selectedTaskType || 'default');
  const [builderLoading, setBuilderLoading] = useState<boolean>(false);
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [builderResult, setBuilderResult] = useState<string | null>(savedState.builderResult || null);

  const handleChipClick = (taskName: string, examplePrompt: string) => {
    setSelectedTaskType(taskName);
    setBuilderPrompt(examplePrompt);
    setBuilderError(null);
  };

  const handleBuilderSubmit = () => {
    if (!builderPrompt.trim()) {
      setBuilderError('Silakan ketik deskripsi halaman atau database yang ingin dibuat.');
      return;
    }
    setBuilderLoading(true);
    setBuilderError(null);

    setTimeout(() => {
      const topic = builderPrompt.trim();
      setBuilderResult(
        `✅ Notion AI berhasil membuat struktur untuk: "${topic}"

📄 **Halaman Baru Dibuat:**
• Judul: ${topic}
• Dibuat: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}

🗃️ **Properti Database yang Disarankan:**
| Nama Kolom       | Tipe Data      | Keterangan                        |
|------------------|----------------|-----------------------------------|
| Nama / Judul     | Title          | Identifikasi utama setiap entri   |
| Status           | Select         | To Do / In Progress / Done        |
| Prioritas        | Select         | Tinggi / Sedang / Rendah          |
| Tanggal Tenggat  | Date           | Deadline target penyelesaian      |
| Pemilik          | Person         | Siapa yang bertanggung jawab       |
| Catatan          | Rich Text      | Detail tambahan dan konteks       |

💡 **Struktur Halaman Disarankan:**
## ${topic}

### Ringkasan
> Tambahkan ringkasan singkat tentang tujuan halaman ini.

### Konten Utama
- [ ] Poin aksi pertama
- [ ] Poin aksi kedua  
- [ ] Poin aksi ketiga

### Referensi & Sumber
Tambahkan tautan atau file referensi yang relevan di sini.

🎉 Halaman siap digunakan! Klik 'Terima' untuk menyimpan ke workspace Notion Anda.`
      );
      setBuilderLoading(false);
    }, 2000);
  };

  // ==========================================
  // BAGIAN 2: INLINE AI EDITOR STATE
  // ==========================================
  const [originalText, setOriginalText] = useState<string>(
    savedState.originalText || "Creating alignment on product teams is essential for successful product development. Everyone on the team must be on the same page and working towards the same goal in order to create a successful product. This blog post will discuss how to create alignment on product teams, including the importance of understanding customer needs, developing a shared vision, and creating an atmosphere of collaboration."
  );
  const [selectedText, setSelectedText] = useState<string>(savedState.selectedText || savedState.originalText || "Creating alignment on product teams is essential for successful product development. Everyone on the team must be on the same page and working towards the same goal in order to create a successful product. This blog post will discuss how to create alignment on product teams, including the importance of understanding customer needs, developing a shared vision, and creating an atmosphere of collaboration.");
  const [isTextSelected, setIsTextSelected] = useState<boolean>(savedState.isTextSelected ?? true);
  const [editorInstruction, setEditorInstruction] = useState<string>(savedState.editorInstruction || '');
  const [aiEditedText, setAiEditedText] = useState<string | null>(savedState.aiEditedText || null);
  const [editorLoading, setEditorLoading] = useState<boolean>(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [lastInstructionUsed, setLastInstructionUsed] = useState<string>(savedState.lastInstructionUsed || '');

  const handleApplyEditorAi = (instructionToUse?: string) => {
    const inst = instructionToUse || editorInstruction || 'Improve writing';
    setLastInstructionUsed(inst);
    setEditorLoading(true);
    setEditorError(null);

    setTimeout(() => {
      const src = selectedText || originalText;
      let result = '';
      const lower = inst.toLowerCase();
      if (lower.includes('ringkas') || lower.includes('shorten') || lower.includes('summarize')) {
        result = `Ringkasan AI: ${src.split('.').slice(0, 2).join('.')}. Ini adalah versi yang lebih ringkas dan padat dari teks asli, menjaga poin-poin inti tetap jelas dan mudah dipahami.`;
      } else if (lower.includes('perbaiki') || lower.includes('improve') || lower.includes('fix')) {
        result = src.replace(/\. /g, '. ').trim() + ' Teks ini telah diperbaiki tata bahasanya, struktur kalimatnya diperhalus, dan alur bacanya dibuat lebih natural serta profesional oleh Notion AI.';
      } else if (lower.includes('terjemah') || lower.includes('translate') || lower.includes('english')) {
        result = `[Translated by Notion AI] ${src.slice(0, 80)}... This content has been translated while preserving the original meaning, context, and professional tone across all key points discussed.`;
      } else if (lower.includes('panjang') || lower.includes('expand') || lower.includes('longer')) {
        result = `${src}\n\nExpanded by Notion AI: Elaborasi lebih lanjut menunjukkan bahwa topik ini memiliki dimensi yang lebih luas. Pertama, perlu dipertimbangkan konteks historis dan latar belakang yang membentuk situasi saat ini. Kedua, dampak jangka panjang dari pendekatan ini dapat memengaruhi berbagai pemangku kepentingan secara signifikan. Ketiga, implementasi yang efektif memerlukan koordinasi lintas tim dan perencanaan yang matang.`;
      } else {
        result = `[Notion AI — ${inst}]: ${src.charAt(0).toUpperCase() + src.slice(1, 120)}... Teks telah diproses sesuai instruksi dengan mempertahankan nada profesional dan kelengkapan informasi yang disampaikan.`;
      }
      setAiEditedText(result);
      setEditorLoading(false);
    }, 1800);
  };

  const handleAcceptEdit = () => {
    if (aiEditedText) {
      setOriginalText(aiEditedText);
      setSelectedText(aiEditedText);
      setAiEditedText(null);
      setIsTextSelected(false);
    }
  };

  const handleRejectEdit = () => {
    setAiEditedText(null);
  };

  // ==========================================
  // BAGIAN 3: FEATURE LANDING PAGE STATE
  // ==========================================
  const [activeFeatureDemo, setActiveFeatureDemo] = useState<'Search' | 'Generate' | 'Analyze' | 'Chat' | null>(savedState.activeFeatureDemo || null);
  const [featureInput, setFeatureInput] = useState<string>(savedState.featureInput || '');
  const [featureMessages, setFeatureMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>(savedState.featureMessages || []);
  const [featureLoading, setFeatureLoading] = useState<boolean>(false);
  const [showSimulatedAuthModal, setShowSimulatedAuthModal] = useState<boolean>(false);

  // Sync state to localStorage on changes
  useEffect(() => {
    const stateToSave = {
      builderPrompt, selectedTaskType, builderResult,
      originalText, selectedText, isTextSelected, editorInstruction, aiEditedText, lastInstructionUsed,
      activeFeatureDemo, featureInput, featureMessages
    };
    localStorage.setItem('notion_ai_state', JSON.stringify(stateToSave));
  }, [
    builderPrompt, selectedTaskType, builderResult,
    originalText, selectedText, isTextSelected, editorInstruction, aiEditedText, lastInstructionUsed,
    activeFeatureDemo, featureInput, featureMessages
  ]);

  const handleOpenFeatureDemo = (feature: 'Search' | 'Generate' | 'Analyze' | 'Chat') => {
    setActiveFeatureDemo(feature);
    setFeatureMessages([
      {
        sender: 'ai',
        text: `Halo! Saya Notion AI - fitur **${feature}**. Silakan ajukan pertanyaan atau berikan instruksi dokumen Anda.`
      }
    ]);
  };

  const handleSendFeatureMessage = () => {
    if (!featureInput.trim() || !activeFeatureDemo || featureLoading) return;

    const userMsg = featureInput.trim();
    setFeatureInput('');
    setFeatureMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setFeatureLoading(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        Search: `🔍 **Hasil Pencarian Notion AI untuk "${userMsg}":**\n\nDitemukan 3 halaman yang relevan:\n• 📄 "${userMsg} — Ringkasan" (diperbarui 2 hari lalu)\n• 🗃️ "Database ${userMsg}" (12 entri)\n• 📝 "Catatan Rapat: ${userMsg}" (minggu lalu)\n\nKlik halaman mana yang ingin Anda buka?`,
        Generate: `✨ **Notion AI menghasilkan konten untuk "${userMsg}":**\n\n## ${userMsg}\n\nBerikut adalah draf awal yang dihasilkan AI berdasarkan topik Anda:\n\n• **Poin Utama #1:** Konteks dan latar belakang yang relevan dengan topik ini sangat penting untuk dipahami terlebih dahulu.\n• **Poin Utama #2:** Implementasi yang tepat memerlukan pendekatan sistematis dan kolaborasi tim.\n• **Poin Utama #3:** Evaluasi berkala memastikan hasil yang optimal dan perbaikan berkelanjutan.\n\n💡 *Apakah Anda ingin memperluas bagian tertentu?*`,
        Analyze: `📊 **Analisis Notion AI untuk "${userMsg}":**\n\n**Ringkasan Temuan:**\n• Panjang teks: estimasi 250-500 kata\n• Sentimen umum: Netral-Positif\n• Topik utama: ${userMsg.split(' ').slice(0, 3).join(', ')}\n\n**Rekomendasi:**\n1. Tambahkan lebih banyak data kuantitatif untuk memperkuat argumen\n2. Struktur dokumen sudah baik, pertimbangkan menambahkan ringkasan eksekutif\n3. Gunakan heading yang lebih deskriptif untuk navigasi yang lebih mudah`,
        Chat: `💬 **Notion AI menjawab "${userMsg}":**\n\nBerdasarkan konteks workspace Anda, berikut jawaban saya:\n\n${userMsg.includes('?') ? 'Pertanyaan yang bagus! ' : ''}Topik "${userMsg}" berkaitan erat dengan dokumen-dokumen di workspace Anda. Saya dapat membantu Anda mengorganisir informasi ini ke dalam struktur Notion yang lebih efisien, membuat template, atau mencari koneksi antar halaman yang relevan.\n\nAda hal spesifik lain yang ingin Anda tanyakan?`,
      };
      const reply = responses[activeFeatureDemo] || `Notion AI: Saya memahami permintaan Anda tentang "${userMsg}". Fitur ${activeFeatureDemo} sedang memproses dan akan memberikan hasil terbaik untuk workspace Anda.`;
      setFeatureMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setFeatureLoading(false);
    }, 1500);
  };

  // Helper untuk merender Markdown & Tabel secara responsif
  const renderFormattedResult = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeader: string[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
        if (cells.every(c => /^:?-+:?$/.test(c))) {
          return;
        }
        if (!inTable) {
          inTable = true;
          tableHeader = cells;
          tableRows = [];
        } else {
          tableRows.push(cells);
        }
      } else {
        if (inTable) {
          elements.push(
            <div key={`table-${index}`} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-xs bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[340px]">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-800 font-bold">
                    {tableHeader.map((th, hIdx) => (
                      <th key={hIdx} className="px-3 sm:px-4 py-2.5 whitespace-nowrap">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tableRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 sm:px-4 py-2.5 font-medium whitespace-normal break-words">
                          {cIdx === 1 ? (
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold border border-blue-100 inline-block">
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          inTable = false;
          tableHeader = [];
          tableRows = [];
        }

        if (trimmed === '') {
          elements.push(<div key={index} className="h-2" />);
        } else if (trimmed.startsWith('## ')) {
          elements.push(
            <h2 key={index} className="text-xl font-extrabold text-slate-900 mt-4 mb-2">
              {trimmed.replace('## ', '')}
            </h2>
          );
        } else if (trimmed.startsWith('### ')) {
          elements.push(
            <h3 key={index} className="text-base font-bold text-slate-800 mt-3 mb-1">
              {trimmed.replace('### ', '')}
            </h3>
          );
        } else if (trimmed.startsWith('> ')) {
          elements.push(
            <blockquote key={index} className="p-3 rounded-r-xl border-l-4 border-blue-500 bg-blue-50/50 text-slate-700 italic text-xs sm:text-sm my-2">
              {trimmed.replace('> ', '')}
            </blockquote>
          );
        } else if (trimmed.startsWith('- [ ] ')) {
          elements.push(
            <div key={index} className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm my-1">
              <input type="checkbox" readOnly checked={false} className="rounded text-blue-600 focus:ring-0" />
              <span>{trimmed.replace('- [ ] ', '')}</span>
            </div>
          );
        } else {
          const parts = trimmed.split(/(\*\*.*?\*\*)/g);
          elements.push(
            <p key={index} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={pIdx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </p>
          );
        }
      }
    });

    if (inTable) {
      elements.push(
        <div key="table-end" className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-xs bg-white">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[340px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-800 font-bold">
                {tableHeader.map((th, hIdx) => (
                  <th key={hIdx} className="px-3 sm:px-4 py-2.5 whitespace-nowrap">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 sm:px-4 py-2.5 font-medium whitespace-normal break-words">
                      {cIdx === 1 ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold border border-blue-100 inline-block">
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fbfbfb] text-slate-800 overflow-hidden shadow-xl flex flex-col min-h-[720px] font-sans select-none">
      {/* ---------------- TOP NAVIGATION BAR & TAB SWITCHER ---------------- */}
      <header className="px-5 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🦏</span>
          <span className="text-base font-extrabold text-slate-900 tracking-tight">Notion AI Simulator</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold uppercase">Maxy Academy</span>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'landing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🌟 Landing Page
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'builder' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏗️ Builder
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ✏️ AI Editor
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* BAGIAN 1: MODAL BUILDER ("What do you want to build today?") */}
      {/* ================================================================= */}
      {activeTab === 'builder' && (
        <div className="flex-1 bg-[#f7f7f5] flex items-start justify-center overflow-y-auto min-h-[600px] min-w-0 py-10 px-4">
          {builderResult ? (
            /* Result View: Notion-style page */
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
              {/* Page top bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span className="text-base">📄</span>
                  <span>Hasil Notion AI — Database Dibuat</span>
                </div>
                <button
                  onClick={() => setBuilderResult(null)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer transition-colors"
                >
                  ← Buat Struktur Lain
                </button>
              </div>
              {/* Page content */}
              <div className="p-6 sm:p-10 space-y-4">
                <div className="text-4xl">📋</div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">New Database Workspace</h1>
                <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-4">
                  <span className="flex items-center gap-1"><Table className="w-3.5 h-3.5" /> Table</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Board</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Timeline</span>
                </div>
                <div className="pt-2">
                  {renderFormattedResult(builderResult)}
                </div>
              </div>
            </div>
          ) : (
            /* Builder Modal Card */
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
              {/* Top nav row */}
              <div className="flex items-center justify-between">
                <button className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer leading-none">←</button>
                <button className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Center logo + headline */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl shadow-inner">
                  👃
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  What do you want to build today?
                </h2>
              </div>

              {/* Input box with blue ring */}
              <div className="relative rounded-2xl border-2 border-blue-500 bg-white shadow-xs">
                <textarea
                  value={builderPrompt}
                  onChange={(e) => setBuilderPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleBuilderSubmit(); }}}
                  placeholder="Describe the database, page, or workflow you want to build..."
                  rows={3}
                  className="w-full bg-transparent text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none resize-none leading-relaxed p-4"
                />
                <div className="flex justify-end px-3 pb-3">
                  <button
                    onClick={handleBuilderSubmit}
                    disabled={builderLoading || !builderPrompt.trim()}
                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all cursor-pointer disabled:bg-slate-300 shadow-xs"
                  >
                    {builderLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick action chips */}
              <div className="flex flex-col items-center gap-2">
                {[
                  { label: 'Make a plan', icon: <Calendar className="w-4 h-4 text-emerald-500" />, prompt: 'Create a project launch plan for Q3 marketing update with milestones, assignees, and target dates.' },
                  { label: 'Manage tasks', icon: <CheckSquare className="w-4 h-4 text-blue-500" />, prompt: 'Create a task management database with columns for Task Name, Assignee, Priority, Due Date, and Status.' },
                  { label: 'Collect feedback', icon: <FolderOpen className="w-4 h-4 text-amber-500" />, prompt: 'Create a customer feedback repository with columns for Customer, Rating, Category, Feedback Notes, and Action Item.' },
                  { label: 'Track pipeline', icon: <BarChart3 className="w-4 h-4 text-purple-500" />, prompt: 'Create a sales pipeline database with Deal Name, Company, Value, Stage, Contact Person, and Probability.' },
                  { label: 'Run campaign', icon: <Megaphone className="w-4 h-4 text-rose-500" />, prompt: 'Create a marketing campaign roadmap database with Campaign Name, Channel, Budget, Launch Date, and Expected Leads.' },
                ].map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => handleChipClick(chip.label, chip.prompt)}
                    className={`w-full max-w-xs px-4 py-2.5 rounded-full border text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      selectedTaskType === chip.label
                        ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                    }`}
                  >
                    {chip.icon}
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>

              {builderError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{builderError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* BAGIAN 2: INLINE AI EDITOR (Doc with Ask AI Popup) */}
      {/* ================================================================= */}
      {activeTab === 'editor' && (
        <div className="flex-1 bg-[#f9f9f8] flex justify-center overflow-y-auto min-h-[600px] p-4 sm:p-8">
          {/* Simulated Notion Doc page */}
          <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-12 space-y-5 relative shadow-xs">
            {/* Doc header */}
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">Introduction</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>By Product Team</span>
                <span>•</span>
                <span>Draft Document</span>
              </div>
            </div>

            {/* Selection toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs gap-2">
              <span className="font-semibold text-slate-600">Status Seleksi Teks Editor:</span>
              <button
                onClick={() => setIsTextSelected(!isTextSelected)}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  isTextSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isTextSelected ? '✓ Paragraph Selected' : 'Klik untuk Select Paragraf'}
              </button>
            </div>

            {/* Paragraph with highlight */}
            <div className="space-y-4">
              <p
                onClick={() => setIsTextSelected(true)}
                className={`text-sm leading-relaxed font-sans cursor-pointer p-4 rounded-xl transition-all ${
                  isTextSelected ? 'bg-blue-50 text-blue-950 font-medium' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {originalText}
              </p>

              {/* Floating AI toolbar */}
              {isTextSelected && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-150 max-w-full">
                  {/* Custom instruction input */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                    <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                    <input
                      type="text"
                      value={editorInstruction}
                      onChange={e => setEditorInstruction(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleApplyEditorAi(); }}
                      placeholder="Ask AI to edit or generate..."
                      className="flex-1 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent min-w-0"
                    />
                    <button
                      onClick={() => handleApplyEditorAi()}
                      disabled={editorLoading}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                    >
                      {editorLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUp className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Section header */}
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Edit or Review Selection</span>
                  </div>

                  {/* Menu items */}
                  <div className="px-2 pb-3 space-y-0.5">
                    {[
                      { label: 'Improve writing',      icon: <Wand2 className="w-4 h-4 text-purple-500" />,  inst: 'Improve writing' },
                      { label: 'Fix spelling & grammar', icon: <Check className="w-4 h-4 text-emerald-500" />, inst: 'Fix spelling & grammar' },
                      { label: 'Make longer',          icon: <AlignLeft className="w-4 h-4 text-blue-500" />, inst: 'Make longer' },
                      { label: 'Make shorter',         icon: <Minus className="w-4 h-4 text-amber-500" />,   inst: 'Make shorter' },
                      { label: 'Change tone',          icon: <Mic className="w-4 h-4 text-indigo-500" />,    inst: 'Change tone', hasArrow: true },
                      { label: 'Simplify language',    icon: <Smile className="w-4 h-4 text-rose-500" />,   inst: 'Simplify language' },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={() => handleApplyEditorAi(item.inst)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-sm font-semibold text-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.hasArrow && <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI result preview */}
              {aiEditedText && (
                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-800 border-b border-purple-100 pb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Notion AI — {lastInstructionUsed}</span>
                  </div>
                  <p className="text-sm text-purple-950 leading-relaxed font-sans">{aiEditedText}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button onClick={handleAcceptEdit} className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button onClick={handleRejectEdit} className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <X className="w-3.5 h-3.5" /> Discard
                    </button>
                    <button onClick={() => handleApplyEditorAi(lastInstructionUsed)} disabled={editorLoading} className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <RotateCcw className="w-3.5 h-3.5" /> Try again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* BAGIAN 3: FEATURE LANDING PAGE ("Meet the new Notion AI") */}
      {/* ================================================================= */}
      {activeTab === 'landing' && (
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
            {/* Hero row */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left: headline + CTA + trust */}
              <div className="flex-1 space-y-6">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Meet the new<br/>Notion AI
                </h1>
                <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-sm">
                  One tool that does it all. Search, generate, analyze, and chat—right inside Notion.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowSimulatedAuthModal(true)}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs transition-all cursor-pointer"
                  >
                    Get Notion free
                  </button>
                  <button
                    onClick={() => setShowSimulatedAuthModal(true)}
                    className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-blue-600 text-sm font-bold transition-all cursor-pointer"
                  >
                    Request a demo
                  </button>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Trusted by teams at</span>
                  <div className="flex flex-wrap items-center gap-5 text-slate-700 font-extrabold text-sm">
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" />TOYOTA</span>
                    <span>Discord</span>
                    <span>1Password</span>
                  </div>
                </div>
              </div>

              {/* Right: illustration card */}
              <div className="shrink-0">
                <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-3 shadow-inner">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-3xl sm:text-4xl shadow-xs">👃</div>
                  <div className="text-center">
                    <p className="text-sm font-extrabold text-slate-800">Notion AI Engine</p>
                    <p className="text-xs text-slate-400 font-medium">Built in Workspace</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'Search' as const,   icon: <Search className="w-5 h-5" />,       color: 'text-blue-500',   desc: 'Find answers from Notion, Slack, Google Drive & more' },
                { key: 'Generate' as const, icon: <Sparkles className="w-5 h-5" />,     color: 'text-purple-500', desc: 'Create & edit docs in your own style' },
                { key: 'Analyze' as const,  icon: <BarChart3 className="w-5 h-5" />,    color: 'text-emerald-500', desc: 'Get insights from PDFs & images' },
                { key: 'Chat' as const,     icon: <MessageSquare className="w-5 h-5" />, color: 'text-indigo-500', desc: 'Access knowledge from GPT-4 & Claude' },
              ].map(card => (
                <div
                  key={card.key}
                  onClick={() => handleOpenFeatureDemo(card.key)}
                  className={`p-5 rounded-2xl border cursor-pointer space-y-3 transition-all hover:shadow-md ${
                    activeFeatureDemo === card.key
                      ? 'bg-blue-50 border-blue-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs ${card.color}`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{card.key}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat demo drawer */}
            {activeFeatureDemo && (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-sm font-extrabold text-slate-800">Demo: Notion AI — {activeFeatureDemo}</span>
                  <button onClick={() => setActiveFeatureDemo(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {featureMessages.map((msg, i) => (
                    <div key={i} className={`px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed max-w-prose ${
                      msg.sender === 'user' ? 'bg-blue-600 text-white ml-auto text-right' : 'bg-white border border-slate-200 text-slate-800'
                    }`}>
                      {msg.text}
                    </div>
                  ))}
                  {featureLoading && (
                    <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs font-medium flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                      <span>Notion AI sedang memproses...</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-xs">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendFeatureMessage(); }}
                    placeholder={`Tanyakan ke Notion AI (${activeFeatureDemo})...`}
                    className="flex-1 bg-transparent text-sm font-medium text-slate-800 focus:outline-none px-2 min-w-0"
                  />
                  <button
                    onClick={handleSendFeatureMessage}
                    disabled={featureLoading || !featureInput.trim()}
                    className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:bg-slate-200 cursor-pointer transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- MODAL SIMULASI MAXY ACADEMY ---------------- */}
      {showSimulatedAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
              🦏
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">Simulasi Pembelajaran</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Ini adalah simulasi pembelajaran Maxy Academy, tidak terhubung ke akun Notion asli.
              </p>
            </div>
            <button
              onClick={() => setShowSimulatedAuthModal(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all cursor-pointer"
            >
              Mengerti & Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotionAiReplica;
export const NotionReplica = NotionAiReplica;
