import React, { useState, useEffect } from 'react';
import { CourseModule } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { 
  X, StickyNote, Download, Copy, Trash2, Search, Check, 
  ExternalLink, FileText, Sparkles, BookOpen
} from 'lucide-react';

interface AllNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: number) => void;
}

interface SavedNoteItem {
  moduleId: number;
  moduleTitle: string;
  badge: string;
  text: string;
  lastSaved: string;
}

export const AllNotesModal: React.FC<AllNotesModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const [notesList, setNotesList] = useState<SavedNoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNoteModuleId, setSelectedNoteModuleId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load all notes from localStorage
  const loadAllNotes = () => {
    const items: SavedNoteItem[] = [];
    MODULES_DATA.forEach((module) => {
      const storageKey = `maxy_notes_module_${module.id}`;
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (typeof parsed === 'string' && parsed.trim()) {
            items.push({
              moduleId: module.id,
              moduleTitle: module.title,
              badge: module.badge,
              text: parsed,
              lastSaved: 'Tersimpan',
            });
          } else if (parsed && typeof parsed.text === 'string' && parsed.text.trim()) {
            items.push({
              moduleId: module.id,
              moduleTitle: module.title,
              badge: module.badge,
              text: parsed.text,
              lastSaved: parsed.lastSaved || 'Tersimpan',
            });
          }
        }
      } catch (e) {
        console.error(`Failed loading notes for module ${module.id}`, e);
      }
    });

    setNotesList(items);
    if (items.length > 0 && selectedNoteModuleId === null) {
      setSelectedNoteModuleId(items[0].moduleId);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAllNotes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Filter notes by search
  const filteredNotes = notesList.filter(
    (item) =>
      item.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSelectedNote = notesList.find((item) => item.moduleId === selectedNoteModuleId) || filteredNotes[0];

  // Export ALL notes to a single TXT file
  const handleExportAll = () => {
    if (notesList.length === 0) return;
    let fullTxt = `=======================================================\n`;
    fullTxt += `RANGKUMAN CATATAN PRIBADI BELAJAR - MAXY AI NAVIGATOR\n`;
    fullTxt += `Total Catatan: ${notesList.length} Modul\n`;
    fullTxt += `Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID')}\n`;
    fullTxt += `=======================================================\n\n`;

    notesList.forEach((item) => {
      fullTxt += `-------------------------------------------------------\n`;
      fullTxt += `MODUL ${item.moduleId}: ${item.moduleTitle.toUpperCase()}\n`;
      fullTxt += `Badge: ${item.badge} | Waktu Disimpan: ${item.lastSaved}\n`;
      fullTxt += `-------------------------------------------------------\n`;
      fullTxt += `${item.text}\n\n`;
    });

    const filename = `Rangkuman_Semua_Catatan_Maxy_AI_Navigator.txt`;
    const element = document.createElement('a');
    const file = new Blob([fullTxt], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`📥 Semua catatan berhasil diekspor (${filename})`);
  };

  // Copy single note
  const handleCopyNote = (item: SavedNoteItem) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.moduleId);
    showToast(`📋 Catatan Modul ${item.moduleId} disalin!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete note
  const handleDeleteNote = (moduleId: number) => {
    localStorage.removeItem(`maxy_notes_module_${moduleId}`);
    loadAllNotes();
    showToast(`🗑️ Catatan Modul ${moduleId} dihapus.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-indigo-600 text-slate-900 dark:text-white font-bold text-xs shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <StickyNote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Koleksi Catatan Pribadi
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {notesList.length} Modul Memiliki Catatan
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akses semua catatan dan poin penting dari seluruh modul pembelajaran yang Anda simpan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notesList.length > 0 && (
              <button
                onClick={handleExportAll}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Ekspor Semua (.txt)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white dark:bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci di modul atau isi catatan..."
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Layout: Master-Detail */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Master List (Left Column) */}
          <div className="md:col-span-5 p-3 overflow-y-auto space-y-2 max-h-[300px] md:max-h-none">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center space-y-3 text-slate-500 dark:text-slate-400">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">
                  {notesList.length === 0
                    ? 'Belum ada catatan tersimpan. Buka modul apa saja dan tulis catatan pertama Anda!'
                    : 'Tidak ada catatan yang cocok dengan pencarian.'}
                </p>
              </div>
            ) : (
              filteredNotes.map((item) => {
                const isSelected = currentSelectedNote?.moduleId === item.moduleId;
                return (
                  <div
                    key={item.moduleId}
                    onClick={() => setSelectedNoteModuleId(item.moduleId)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500/50 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-800/80 hover:border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Modul {item.moduleId}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {item.lastSaved}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.moduleTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail View (Right Column) */}
          <div className="md:col-span-7 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
            {currentSelectedNote ? (
              <>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-400">
                          Modul {currentSelectedNote.moduleId}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">• {currentSelectedNote.badge}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {currentSelectedNote.moduleTitle}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectModule(currentSelectedNote.moduleId);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Buka Modul</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Note text box */}
                  <div className="bg-[#080c16] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap max-h-[280px] overflow-y-auto">
                    {currentSelectedNote.text}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {currentSelectedNote.text.split(/\s+/).length} Kata | {currentSelectedNote.text.length} Karakter
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteNote(currentSelectedNote.moduleId)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-rose-950/60 hover:text-rose-400 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
                      title="Hapus Catatan Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopyNote(currentSelectedNote)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedId === currentSelectedNote.moduleId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Salin Teks</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <BookOpen className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-xs">Pilih salah satu catatan modul di sebelah kiri untuk melihat detail isi catatan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
