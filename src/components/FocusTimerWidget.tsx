import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Clock, Sparkles, Volume2, VolumeX, 
  Maximize2, Minimize2, CheckCircle2, Zap, Coffee, Flame, Shield, ChevronDown, ChevronUp, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusTimerWidgetProps {
  moduleTitle?: string;
  onCompleteFocusBlock: (minutesCompleted: number, xpReward: number) => void;
}

export type TimerMode = 'focus25' | 'focus15' | 'focus50' | 'shortBreak' | 'longBreak';

interface ModeConfig {
  label: string;
  minutes: number;
  xpReward: number;
  type: 'focus' | 'break';
  color: string;
}

const TIMER_MODES: Record<TimerMode, ModeConfig> = {
  focus25: { label: '25 Min Focus', minutes: 25, xpReward: 50, type: 'focus', color: 'from-indigo-500 to-purple-600' },
  focus15: { label: '15 Min Quick', minutes: 15, xpReward: 30, type: 'focus', color: 'from-blue-500 to-indigo-600' },
  focus50: { label: '50 Min Deep', minutes: 50, xpReward: 120, type: 'focus', color: 'from-purple-600 to-rose-600' },
  shortBreak: { label: '5 Min Istirahat', minutes: 5, xpReward: 0, type: 'break', color: 'from-emerald-500 to-teal-600' },
  longBreak: { label: '15 Min Santai', minutes: 15, xpReward: 0, type: 'break', color: 'from-amber-500 to-orange-600' },
};

export const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({
  moduleTitle,
  onCompleteFocusBlock,
}) => {
  const [selectedMode, setSelectedMode] = useState<TimerMode>('focus25');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientSound, setAmbientSound] = useState<'off' | 'binaural' | 'rain'>('off');
  const [completedBlocksCount, setCompletedBlocksCount] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<{ stop: () => void } | null>(null);

  const currentConfig = TIMER_MODES[selectedMode];
  const totalSeconds = currentConfig.minutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100));

  // Initialize Web Audio API
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play gentle completion chime
  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Play a 3-note ascending chord (C5, E5, G5)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.25, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  // Manage ambient audio generation (Alpha Binaural Beats or Rain Noise)
  useEffect(() => {
    if (ambientNodeRef.current) {
      ambientNodeRef.current.stop();
      ambientNodeRef.current = null;
    }

    if (!isRunning || ambientSound === 'off' || !soundEnabled) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (ambientSound === 'binaural') {
        // Binaural Alpha Beat: Left 200Hz, Right 210Hz (10Hz difference for deep focus)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const masterGain = ctx.createGain();

        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(200, ctx.currentTime);

        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(210, ctx.currentTime);

        masterGain.gain.setValueAtTime(0.04, ctx.currentTime); // Soft volume

        oscL.connect(merger, 0, 0); // left
        oscR.connect(merger, 0, 1); // right
        merger.connect(masterGain);
        masterGain.connect(ctx.destination);

        oscL.start();
        oscR.start();

        ambientNodeRef.current = {
          stop: () => {
            try {
              oscL.stop();
              oscR.stop();
            } catch (err) {
              // ignore
            }
          },
        };
      } else if (ambientSound === 'rain') {
        // Synthesize soft rain white noise with bandpass filter
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.03, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();

        ambientNodeRef.current = {
          stop: () => {
            try {
              whiteNoise.stop();
            } catch (err) {
              // ignore
            }
          },
        };
      }
    } catch (e) {
      console.warn('Ambient sound synthesis error:', e);
    }

    return () => {
      if (ambientNodeRef.current) {
        ambientNodeRef.current.stop();
        ambientNodeRef.current = null;
      }
    };
  }, [isRunning, ambientSound, soundEnabled]);

  // Timer Tick Interval Effect
  useEffect(() => {
    let interval: any = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            playCompletionChime();

            // Trigger reward if focus session
            if (currentConfig.type === 'focus') {
              onCompleteFocusBlock(currentConfig.minutes, currentConfig.xpReward);
              setCompletedBlocksCount((c) => c + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, selectedMode]);

  // Mode change handler
  const handleSelectMode = (mode: TimerMode) => {
    setSelectedMode(mode);
    setIsRunning(false);
    setSecondsRemaining(TIMER_MODES[mode].minutes * 60);
  };

  // Reset current timer
  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(currentConfig.minutes * 60);
  };

  // Format time display (MM:SS)
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Zen Mode Overlay */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-slate-100"
          >
            <button
              onClick={() => setIsZenMode(false)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" /> Keluar Mode Zen Focus
            </button>

            <div className="text-center space-y-6 max-w-lg w-full">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                  <Flame className="w-4 h-4 text-amber-400" /> Mode Bebas Distraksi (Zen)
                </span>
                <h2 className="text-3xl font-extrabold text-white">{moduleTitle || 'Sesi Pembelajaran Aktif'}</h2>
              </div>

              {/* Big Timer Clock Display */}
              <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="#1e293b"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="url(#zenGradient)"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 110}
                    strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="zenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                  <span className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
                    {formatTime(secondsRemaining)}
                  </span>
                  <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                    {currentConfig.label}
                  </span>
                </div>
              </div>

              {/* Zen Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`p-4 rounded-full shadow-2xl transition-transform hover:scale-105 cursor-pointer ${
                    isRunning ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Bar / Widget Component */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl transition-all">
        {/* Compact Bar Always Visible */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-r ${currentConfig.color} text-white shadow-lg`}>
              <Clock className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">Focus Timer</span>
                {currentConfig.xpReward > 0 && (
                  <span className="text-[10px] font-extrabold bg-indigo-950 border border-indigo-700 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    +{currentConfig.xpReward} Focus XP
                  </span>
                )}
                {completedBlocksCount > 0 && (
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                    Selesai: {completedBlocksCount} Sesi
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{currentConfig.label}</span>
                <span>•</span>
                <span className="font-mono font-bold text-indigo-300">{formatTime(secondsRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Quick Play Controls & Toggle Expand */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-md ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Jeda' : 'Mulai Focus'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsZenMode(true)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 cursor-pointer"
              title="Mode Zen (Layar Penuh)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-800/80">
          <div
            className={`h-full bg-gradient-to-r ${currentConfig.color} transition-all duration-1000 ease-linear`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Expanded Panel for Presets & Ambient Audio */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4 border-t border-slate-800 mt-3 space-y-4 overflow-hidden"
            >
              {/* Preset Selection Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Sesi Belajar / Istirahat
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {(Object.keys(TIMER_MODES) as TimerMode[]).map((modeKey) => {
                    const cfg = TIMER_MODES[modeKey];
                    const isSel = selectedMode === modeKey;
                    return (
                      <button
                        key={modeKey}
                        onClick={() => handleSelectMode(modeKey)}
                        className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                          isSel
                            ? 'bg-indigo-950 border-indigo-500 text-white shadow-lg'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="truncate">{cfg.label}</div>
                        <div className="text-[10px] text-indigo-300 font-mono">
                          {cfg.xpReward > 0 ? `+${cfg.xpReward} Focus XP` : 'Istirahat'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audio Controls (Ambient Sounds & Chimes) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                {/* Audio chime toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold border cursor-pointer ${
                    soundEnabled
                      ? 'bg-slate-800 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  <span>{soundEnabled ? 'Suara Lonceng Aktif' : 'Mute Lonceng'}</span>
                </button>

                {/* Ambient noise selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-purple-400" /> Soundscape:
                  </span>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setAmbientSound('off')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        ambientSound === 'off' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Mati
                    </button>
                    <button
                      onClick={() => setAmbientSound('binaural')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        ambientSound === 'binaural' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Binaural Alpha (10Hz)
                    </button>
                    <button
                      onClick={() => setAmbientSound('rain')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        ambientSound === 'rain' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Suara Hujan
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
