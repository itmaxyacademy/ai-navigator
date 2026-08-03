import React, { useState } from 'react';
import { UserProgress } from '../types';

interface DevPanelProps {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

export const DevPanel: React.FC<DevPanelProps> = ({ progress, setProgress }) => {
  const [open, setOpen] = useState(false);
  const [targetModule, setTargetModule] = useState(29);

  const switchTier = (tier: 'free' | 'tier1' | 'tier2') => {
    setProgress((prev) => ({
      ...prev,
      userTier: tier,
      tier: tier,
      maxAllowedModuleId: tier === 'tier2' ? 29 : tier === 'tier1' ? 22 : 3,
      paidTiers: tier === 'tier2' ? ['tier1', 'tier2'] : tier === 'tier1' ? ['tier1'] : [],
      hasTier1: tier === 'tier1' || tier === 'tier2',
      hasTier2: tier === 'tier2',
    }));
  };

  const completeModules = () => {
    const modules = Array.from({ length: targetModule }, (_, i) => i + 1);
    setProgress((prev) => ({
      ...prev,
      completedModules: modules,
      currentModuleId: Math.min(targetModule + 1, 29),
    }));
  };

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-rose-600 hover:bg-rose-500 text-white p-3 rounded-full shadow-lg shadow-rose-600/30 text-xs font-black transition-transform hover:scale-110"
      >
        DEV
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-white dark:bg-slate-900 border-2 border-rose-500 p-4 rounded-xl shadow-2xl min-w-[280px] text-slate-800 dark:text-slate-200">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-black text-sm text-rose-600 flex items-center gap-2">
          🛠️ Local Dev Menu
        </h3>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold px-2 py-0.5">✕</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold block mb-1.5 uppercase tracking-wider text-slate-500">1. Switch Tier</label>
          <div className="flex gap-2">
            <button onClick={() => switchTier('free')} className={`px-2 py-1.5 text-xs font-bold border rounded-lg flex-1 ${progress.userTier === 'free' ? 'bg-rose-100 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'border-slate-300 dark:border-slate-700'}`}>Free</button>
            <button onClick={() => switchTier('tier1')} className={`px-2 py-1.5 text-xs font-bold border rounded-lg flex-1 ${progress.userTier === 'tier1' ? 'bg-rose-100 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'border-slate-300 dark:border-slate-700'}`}>Tier 1</button>
            <button onClick={() => switchTier('tier2')} className={`px-2 py-1.5 text-xs font-bold border rounded-lg flex-1 ${progress.userTier === 'tier2' ? 'bg-rose-100 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'border-slate-300 dark:border-slate-700'}`}>Tier 2</button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold block mb-1.5 uppercase tracking-wider text-slate-500">2. Complete Modules</label>
          <div className="flex gap-2 items-center">
            <input 
              type="number" 
              value={targetModule} 
              onChange={(e) => setTargetModule(Number(e.target.value))}
              className="w-16 px-2 py-1.5 text-sm font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-center"
              min={1} max={29}
            />
            <button onClick={completeModules} className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-600/20">
              Complete Modul 1-{targetModule}
            </button>
          </div>
        </div>
        
        <div className="pt-2 text-[10px] text-slate-500 italic text-center">
          *Menu ini hanya tampil di Localhost
        </div>
      </div>
    </div>
  );
};
