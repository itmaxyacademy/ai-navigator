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
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all duration-300 text-slate-900">
      {/* Header Bar */}
      <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm sm:text-base text-slate-900">Catatan Pribadi Pembelajaran</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                Modul {module.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simpan poin penting, ringkasan, atau draf prompt secara lokal di browser Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          {lastSaved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-bold">
              <Check className="w-3 h-3 text-emerald-600" />
              {isSaved ? lastSaved : 'Ada perubahan...'}
            </span>
          )}

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer shadow-xs"
            title={isExpanded ? 'Sembunyikan Catatan' : 'Buka Catatan'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
          {/* Quick Insert Templates */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sisip Templat:
            </span>
            <button
              onClick={() => handleInsertTemplate('📌 Poin Penting:\n- ')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3 text-indigo-600" />
              Poin Penting
            </button>
            <button
              onClick={() => handleInsertTemplate('💡 Ringkasan & Wawasan:\n- ')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3 text-amber-600" />
              Ringkasan
            </button>
            <button
              onClick={() => handleInsertTemplate('🚀 Draf Prompt Favorit:\n"..."')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3 text-purple-600" />
              Prompt Favorit
            </button>
            <button
              onClick={() => handleInsertTemplate('❓ Pertanyaan & Catatan Diskusi:\n- ')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3 text-emerald-600" />
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
              className="w-full bg-slate-50/80 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all leading-relaxed font-sans resize-y shadow-inner"
            />

            {!isSaved && (
              <span className="absolute bottom-3 right-3 text-[10px] text-amber-800 font-mono font-bold bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-lg shadow-xs">
                Belum Disimpan
              </span>
            )}
          </div>

          {/* Bottom Toolbar & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 text-xs">
            {/* Word count & last saved string */}
            <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
              <span>{wordCount} Kata</span>
              <span>•</span>
              <span>{charCount} Karakter</span>
              {lastSaved && (
                <>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline text-slate-500 font-sans">
                    {lastSaved}
                  </span>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 justify-end flex-wrap">
              {showClearConfirm ? (
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1.5 rounded-xl shadow-xs">
                  <span className="text-[10px] text-rose-700 font-bold px-2">Hapus catatan?</span>
                  <button
                    onClick={handleClearNote}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] transition-all cursor-pointer"
                  >
                    Ya, Hapus
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={!noteText}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-200 transition-all disabled:opacity-40 cursor-pointer"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleCopy}
                disabled={!noteText.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer font-bold"
                title="Salin Teks Catatan"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Salin</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={!noteText.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer font-bold"
                title="Unduh sebagai file .txt"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh .txt</span>
              </button>

              <button
                onClick={() => handleSave()}
                className={`px-5 py-2 rounded-xl font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{isSaved ? 'Tersimpan' : 'Simpan Catatan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
