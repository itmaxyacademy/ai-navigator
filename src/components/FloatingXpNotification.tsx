import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame, Award, Zap, Trophy, CheckCircle2 } from 'lucide-react';

export interface FloatingXpItem {
  id: string;
  amount: number;
  label: string;
  type: 'xp_new' | 'xp_repeat' | 'xp_milestone' | 'xp_graduation' | 'streak';
}

interface FloatingXpNotificationProps {
  notifications: FloatingXpItem[];
  onDismiss: (id: string) => void;
}

export const FloatingXpNotification: React.FC<FloatingXpNotificationProps> = ({
  notifications,
  onDismiss,
}) => {
  return (
    <div className="fixed top-20 right-6 sm:right-12 z-50 pointer-events-none flex flex-col items-end gap-3">
      <AnimatePresence>
        {notifications.map((item) => {
          let bgGradient = 'from-indigo-600 via-purple-600 to-indigo-800';
          let borderColor = 'border-indigo-400/80';
          let textColor = 'text-amber-300';
          let Icon = Sparkles;

          if (item.type === 'xp_repeat') {
            bgGradient = 'from-emerald-700 via-teal-800 to-slate-900';
            borderColor = 'border-emerald-400/80';
            textColor = 'text-emerald-200';
            Icon = Zap;
          } else if (item.type === 'xp_milestone') {
            bgGradient = 'from-purple-700 via-pink-700 to-indigo-900';
            borderColor = 'border-purple-300';
            textColor = 'text-purple-200';
            Icon = Award;
          } else if (item.type === 'xp_graduation') {
            bgGradient = 'from-amber-500 via-orange-600 to-yellow-600';
            borderColor = 'border-amber-300';
            textColor = 'text-amber-100';
            Icon = Trophy;
          } else if (item.type === 'streak') {
            bgGradient = 'from-amber-600 via-orange-700 to-red-700';
            borderColor = 'border-amber-400';
            textColor = 'text-amber-200';
            Icon = Flame;
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.6, rotate: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.8, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              onAnimationComplete={() => {
                setTimeout(() => onDismiss(item.id), 2500);
              }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r ${bgGradient} border-2 ${borderColor} shadow-2xl shadow-indigo-500/20 text-white backdrop-blur-md cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => onDismiss(item.id)}
            >
              <div className="p-2 rounded-xl bg-slate-950/40 border border-white/20 shrink-0">
                <Icon className={`w-6 h-6 ${textColor} animate-bounce`} />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`text-xl sm:text-2xl font-black ${textColor} tracking-tight font-mono drop-shadow-md`}>
                    +{item.amount} XP
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                </div>
                <span className="text-xs font-extrabold text-slate-100 opacity-90 drop-shadow">
                  {item.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
