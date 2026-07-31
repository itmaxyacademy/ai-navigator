import React, { useState, useEffect } from 'react';
import { CourseModule } from '../types';
import { 
  FileText, Save, Download, Copy, Trash2, Sparkles, 
  ChevronDown, ChevronUp, Check, Plus, StickyNote, X, RefreshCw
} from 'lucide-react';

interface PersonalNotesProps {
  module: CourseModule;
  isCompact?: boolean;
  onShowToast?: (msg: string) => void;
}

export const PersonalNotes: React.FC<PersonalNotesProps> = ({
  module,
  isCompact = false,
  onShowToast,
}) => {
  const storageKey = `maxy_notes_module_${module.id}`;
  const [noteText, setNoteText] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Load note from localStorage when module changes
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (typeof parsed === 'string') {
          setNoteText(parsed);
          setLastSaved('Tersimpan sebelumnya');
        } else if (parsed && typeof parsed.text === 'string') {
          setNoteText(parsed.text);
          setLastSaved(parsed.lastSaved || 'Tersimpan');
        }
      } else {
        setNoteText('');
        setLastSaved(null);
      }
    } catch (e) {
      console.error('Failed to load personal notes', e);
      setNoteText('');
    }
    setIsSaved(true);
    setShowClearConfirm(false);
  }, [module.id, storageKey]);

  // Save note function
  const handleSave = (textToSave?: string) => {
    const text = textToSave !== undefined ? textToSave : noteText;
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const payload = {
        text,
        lastSaved: `Hari ini, ${timeStr}`,
        updatedAt: now.toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      setLastSaved(`Hari ini, ${timeStr}`);
      setIsSaved(true);
      if (onShowToast) onShowToast('📝 Catatan pribadi berhasil disimpan ke browser!');
    } catch (e) {
      console.error('Failed to save personal notes', e);
      if (onShowToast) onShowToast('❌ Gagal menyimpan catatan.');
    }
  };

  // Auto-save debounced on input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setNoteText(newText);
    setIsSaved(false);
  };

  // Quick insertion helpers
  const handleInsertTemplate = (template: string) => {
    const updated = noteText ? `${noteText}\n\n${template}` : template;
    setNoteText(updated);
    setIsSaved(false);
    handleSave(updated);
  };

  // Copy to Clipboard
  const handleCopy = () => {
    if (!noteText.trim()) return;
    navigator.clipboard.writeText(noteText);
    setCopied(true);
    if (onShowToast) onShowToast('📋 Catatan disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Note as TXT
  const handleDownload = () => {
    if (!noteText.trim()) return;
    const filename = `Catatan_Modul_${module.id}_${module.badge.replace(/\s+/g, '_')}.txt`;
    const headerContent = `=== CATATAN PRIBADI - MAXY AI NAVIGATOR ===\nModul ${module.id}: ${module.title}\nBadge: ${module.badge}\nTerakhir Disimpan: ${lastSaved || 'Baru saja'}\n===========================================\n\n`;
    const fullContent = headerContent + noteText;

    const element = document.createElement('a');
    const file = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    if (onShowToast) onShowToast(`📥 Catatan diunduh sebagai ${filename}`);
  };

  // Clear Note
  const handleClearNote = () => {
    setNoteText('');
    localStorage.removeItem(storageKey);
    setLastSaved(null);
    setIsSaved(true);
    setShowClearConfirm(false);
    if (onShowToast) onShowToast('🗑️ Catatan pribadi modul ini telah dihapus.');
  };

  // Calculate statistics
  const wordCount = noteText.trim() ? noteText.trim().split(/\s+/).length : 0;
  const charCount = noteText.length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div className="bg-slate-100 dark:bg-slate-950/80 p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Catatan Pribadi (Personal Notes)</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Modul {module.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simpan poin penting, ringkasan, atau draf prompt secara lokal di browser Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          {lastSaved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
              <Check className="w-3 h-3" />
              {isSaved ? lastSaved : 'Ada perubahan...'}
            </span>
          )}

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            title={isExpanded ? 'Sembunyikan Catatan' : 'Buka Catatan'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {isExpanded && (
        <div className="p-4 space-y-3.5 animate-in fade-in duration-200">
          {/* Quick Insert Templates */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Sisip Templat:
            </span>
            <button
              onClick={() => handleInsertTemplate('📌 Poin Penting:\n- ')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3 text-indigo-400" />
              Poin Penting
            </button>
            <button
              onClick={() => handleInsertTemplate('💡 Ringkasan & Wawasan:\n- ')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3 text-amber-400" />
              Ringkasan
            </button>
            <button
              onClick={() => handleInsertTemplate('🚀 Draf Prompt Favorit:\n"..."')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3 text-purple-400" />
              Prompt Favorit
            </button>
            <button
              onClick={() => handleInsertTemplate('❓ Pertanyaan & Catatan Diskusi:\n- ')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              Pertanyaan
            </button>
          </div>

          {/* Textarea Input */}
          <div className="relative">
            <textarea
              value={noteText}
              onChange={handleTextChange}
              placeholder={`Tuliskan rangkuman, rumus prompt, atau hal penting dari ${module.title} di sini...\nCatatan tersimpan otomatis di browser secara lokal.`}
              rows={isCompact ? 4 : 6}
              className="w-full bg-[#090d16] border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none transition-all leading-relaxed font-sans resize-y"
            />

            {!isSaved && (
              <span className="absolute bottom-3 right-3 text-[10px] text-amber-400 font-mono bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-md">
                Belum Disimpan
              </span>
            )}
          </div>

          {/* Bottom Toolbar & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-800/60 text-xs">
            {/* Word count & last saved string */}
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              <span>{wordCount} Kata</span>
              <span>•</span>
              <span>{charCount} Karakter</span>
              {lastSaved && (
                <>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline text-slate-500 dark:text-slate-400 font-sans">
                    {lastSaved}
                  </span>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 justify-end">
              {showClearConfirm ? (
                <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-800/80 p-1 rounded-xl">
                  <span className="text-[10px] text-rose-300 font-bold px-2">Hapus catatan?</span>
                  <button
                    onClick={handleClearNote}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-slate-900 dark:text-white font-bold text-[10px] transition-all cursor-pointer"
                  >
                    Ya, Hapus
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={!noteText}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-rose-950/50 hover:text-rose-400 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-all disabled:opacity-40 cursor-pointer"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleCopy}
                disabled={!noteText.trim()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                title="Salin Teks Catatan"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Salin</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={!noteText.trim()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                title="Unduh sebagai file .txt"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unduh .txt</span>
              </button>

              <button
                onClick={() => handleSave()}
                className={`px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-slate-900 dark:text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white animate-pulse'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Tersimpan' : 'Simpan Catatan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
