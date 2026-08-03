import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Konfirmasi',
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="bg-[#111422] border border-[#252c42] rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-left">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-bold text-slate-100 mb-4">{title}</h3>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[#22293e] text-slate-300 rounded hover:bg-[#2a3245]"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500"
          >
            Ya, Reset
          </button>
        </div>
      </div>
    </div>
  );
};
