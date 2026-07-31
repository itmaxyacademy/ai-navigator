import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, Mic, Play, Pause, RotateCcw, RotateCw, Download, Share2,
  Search, Bell, HelpCircle, User, ChevronDown, Sliders, Sparkles,
  FileText, Music, Video, Image as ImageIcon, Wand2, Radio, Disc,
  Layers, Settings, Layout, Home, Folder, Plus, Check, X, Shield,
  Smartphone, Monitor, MessageSquare, Zap, Globe, Info, Clock, Lock,
  Upload, RefreshCw, Copy, CheckCircle2
} from 'lucide-react';

interface InfoModalData {
  title: string;
  category: string;
  badge: string;
  description: string;
  keyFeatures: string[];
  howToUse: string;
}

export const ElevenLabsReplica: React.FC = () => {
  // Device Mode: 'desktop' | 'mobile'
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Active Tool Tab State
  const [activeTab, setActiveTab] = useState<string>('speech');

  // Voice & Model Selection State
  const [selectedVoice, setSelectedVoice] = useState<string>('Aria - Maxy Educator');
  const [selectedModel, setSelectedModel] = useState<string>('Eleven Multilingual v2');

  // Quota state
  const [remainingQuota, setRemainingQuota] = useState<number>(82450);
  const [maxQuota] = useState<number>(100000);

  // Voice Settings Sliders
  const [stability, setStability] = useState<number>(50);
  const [clarity, setClarity] = useState<number>(75);
  const [styleExaggeration, setStyleExaggeration] = useState<number>(20);
  const [speakerBoost, setSpeakerBoost] = useState<boolean>(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);

  // Script Input State
  const [scriptText, setScriptText] = useState<string>(
    'Selamat datang di Maxy Academy. Di modul ini, kita akan mempelajari teknik membuat suara AI yang alami dan ekspresif... Perhatikan jeda koma, ritme kalimat, serta intonasi yang tepat!'
  );

  // Audio Playback & Speech Synthesis State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasGeneratedAudio, setHasGeneratedAudio] = useState<boolean>(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(18);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Element Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Image Generator State
  const [imagePrompt, setImagePrompt] = useState<string>('Brosur utama Maxy Academy dengan maskot AI futuristik 3D dan latar belakang kode neon');
  const [imageStyle, setImageStyle] = useState<string>('Photorealistic 8K');
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('16:9 Landscape');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImageResult, setGeneratedImageResult] = useState<boolean>(true);

  // Video Generator State
  const [videoPrompt, setVideoPrompt] = useState<string>('Instruktur Maxy Academy menjelaskan konsep Neural Network dengan efek visual hologram');
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [videoResolution, setVideoResolution] = useState<string>('1080p 30fps');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [generatedVideoResult, setGeneratedVideoResult] = useState<boolean>(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // SFX Generator State
  const [sfxPrompt, setSfxPrompt] = useState<string>('Suara petir dan hujan deras di malam hari');
  const [sfxDuration, setSfxDuration] = useState<number>(5);
  const [isGeneratingSfx, setIsGeneratingSfx] = useState<boolean>(false);
  const [generatedSfxResult, setGeneratedSfxResult] = useState<boolean>(true);
  const [isSfxPlaying, setIsSfxPlaying] = useState<boolean>(false);

  // Music Generator State
  const [musicPrompt, setMusicPrompt] = useState<string>('Melodi piano santai untuk latar belakang belajar di Maxy Academy');
  const [musicGenre, setMusicGenre] = useState<string>('Ambient Lofi');
  const [musicLength, setMusicLength] = useState<string>('60 Detik');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState<boolean>(false);
  const [generatedMusicResult, setGeneratedMusicResult] = useState<boolean>(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  // Voice Changer State
  const [voiceChangerFile, setVoiceChangerFile] = useState<string>('rekaman_suara_presentasi_maxy.mp3');
  const [voiceChangerTarget, setVoiceChangerTarget] = useState<string>('Adam - Tech Narrator');
  const [voiceChangerPitch, setVoiceChangerPitch] = useState<number>(0);
  const [isConvertingVoice, setIsConvertingVoice] = useState<boolean>(false);
  const [generatedVoiceChangerResult, setGeneratedVoiceChangerResult] = useState<boolean>(true);
  const [isVoiceChangerPlaying, setIsVoiceChangerPlaying] = useState<boolean>(false);

  // Voice Isolator State
  const [isolatorFile, setIsolatorFile] = useState<string>('podcast_maxy_raw_noisy.wav');
  const [isolatorStrength, setIsolatorStrength] = useState<number>(85);
  const [isIsolatingVoice, setIsIsolatingVoice] = useState<boolean>(false);
  const [generatedIsolatorResult, setGeneratedIsolatorResult] = useState<boolean>(true);
  const [isIsolatorPlaying, setIsIsolatorPlaying] = useState<boolean>(false);

  // Upscale State
  const [upscaleFile, setUpscaleFile] = useState<string>('suara_vokal_low_bitrate.mp3');
  const [upscaleQuality, setUpscaleQuality] = useState<string>('48kHz / 24-bit Studio WAV');
  const [isUpscalingAudio, setIsUpscalingAudio] = useState<boolean>(false);
  const [generatedUpscaleResult, setGeneratedUpscaleResult] = useState<boolean>(true);
  const [isUpscalePlaying, setIsUpscalePlaying] = useState<boolean>(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search Modal & Query State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Active Modal Popup State
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync Audio Element when audioUrl changes
  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setAudioDuration(audio.duration);
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.onerror = () => {
      setIsPlaying(false);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  // Clean up SpeechSynthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          handleSpeakSpeech();
        });
      }
    } else {
      handleSpeakSpeech();
    }
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(audioDuration, newTime));
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
    setCurrentTime(clamped);
  };

  const handleRewind = () => {
    handleSeek(currentTime - 10);
  };

  const handleForward = () => {
    handleSeek(currentTime + 10);
  };

  const handleSpeakSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Browser Anda tidak mendukung Speech Synthesis.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptText);
    
    utterance.lang = 'id-ID';
    utterance.rate = 0.85 + (clarity / 200);
    utterance.pitch = 0.9 + (styleExaggeration / 200);

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(audioDuration);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateSpeech = async () => {
    if (!scriptText || !scriptText.trim()) {
      setErrorMessage("Teks skrip tidak boleh kosong. Silakan ketik naskah terlebih dahulu.");
      showToast("Teks skrip kosong!");
      return;
    }

    if (scriptText.length > 2500) {
      setErrorMessage(`Teks skrip melebihi batas maksimum 2.500 karakter! (Saat ini: ${scriptText.length} karakter)`);
      showToast("Teks melebihi batas 2.500 karakter!");
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: scriptText.trim(),
          voice: selectedVoice,
          model: selectedModel,
          stability,
          clarity,
          styleExaggeration,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal memproses speech audio.");
      }

      setAudioUrl(data.audioUrl);
      if (data.duration) {
        setAudioDuration(data.duration);
      }
      setCurrentTime(0);
      setHasGeneratedAudio(true);

      const usedChars = scriptText.trim().length;
      setRemainingQuota((prev) => Math.max(0, prev - usedChars));

      showToast(`Speech audio berhasil digenerasi dengan suara ${selectedVoice}!`);

      setTimeout(() => {
        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;

        audio.onloadedmetadata = () => {
          if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
            setAudioDuration(audio.duration);
          }
        };
        audio.ontimeupdate = () => {
          setCurrentTime(audio.currentTime);
        };
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };

        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }, 150);

    } catch (err: any) {
      console.error("Speech generation error:", err);
      setErrorMessage(err.message || "Gagal membuat audio speech.");
      showToast("Terjadi kesalahan saat memproses audio.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAudio = () => {
    if (audioUrl) {
      const element = document.createElement('a');
      element.href = audioUrl;
      element.download = `ElevenLabs_${selectedVoice.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.wav`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      showToast('File audio hasil generate berhasil diunduh!');
    } else {
      handleDownloadTranscript();
    }
  };

  const handleDownloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([`[Maxy Academy Audio Transcript]\nVoice: ${selectedVoice}\nModel: ${selectedModel}\nDate: ${new Date().toLocaleString()}\n\nScript:\n${scriptText}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `MaxyAcademy_ElevenLabs_${selectedVoice.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('File transkrip audio berhasil diunduh ke perangkat Anda!');
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Tautan audio publik berhasil disalin ke clipboard!');
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    setTimeout(() => {
      setIsGeneratingImage(false);
      setGeneratedImageResult(true);
      showToast('Gambar AI berhasil digenerasi!');
    }, 1200);
  };

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setTimeout(() => {
      setIsGeneratingVideo(false);
      setGeneratedVideoResult(true);
      showToast('Video Lip-Sync AI berhasil diproses!');
    }, 1500);
  };

  const handleGenerateSfx = () => {
    setIsGeneratingSfx(true);
    setTimeout(() => {
      setIsGeneratingSfx(false);
      setGeneratedSfxResult(true);
      showToast('Efek Suara AI berhasil disintesis!');
    }, 1000);
  };

  const handleGenerateMusic = () => {
    setIsGeneratingMusic(true);
    setTimeout(() => {
      setIsGeneratingMusic(false);
      setGeneratedMusicResult(true);
      showToast('Komposisi Musik AI berhasil dibuat!');
    }, 1300);
  };

  const handleConvertVoice = () => {
    setIsConvertingVoice(true);
    setTimeout(() => {
      setIsConvertingVoice(false);
      setGeneratedVoiceChangerResult(true);
      showToast(`Voice Changer berhasil mengonversi suara ke ${voiceChangerTarget}!`);
    }, 1200);
  };

  const handleIsolateVoice = () => {
    setIsIsolatingVoice(true);
    setTimeout(() => {
      setIsIsolatingVoice(false);
      setGeneratedIsolatorResult(true);
      showToast('Voice Isolator berhasil membersihkan noise latar belakang!');
    }, 1200);
  };

  const handleUpscaleAudio = () => {
    setIsUpscalingAudio(true);
    setTimeout(() => {
      setIsUpscalingAudio(false);
      setGeneratedUpscaleResult(true);
      showToast(`Upscale selesai! Audio ditingkatkan ke ${upscaleQuality}!`);
    }, 1200);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'image':
        return (
          <div className="space-y-4">
            <div className="bg-[#111420] border border-[#21273b] rounded-3xl p-5 space-y-4 shadow-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-400" />
                    AI Image & Thumbnail Generator
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sintesis aset visual, gambar pendukung modul, dan thumbnail promosi untuk Maxy Academy.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => setImagePrompt('Banner utama modul Maxy Academy dengan maskot AI futuristik 3D')}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    🎨 Banner Modul
                  </button>
                  <button
                    onClick={() => setImagePrompt('Robot Maskot Educator Maxy Academy dalam gaya 3D Render HD')}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    🤖 Maskot AI
                  </button>
                  <button
                    onClick={() => setImagePrompt('Sertifikat kelulusan AI Software Engineer Maxy Academy ornamen emas')}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    📜 Sertifikat
                  </button>
                </div>
              </div>

              {/* Textarea Prompt */}
              <div className="relative bg-[#0b0e16] border border-[#1f263a] rounded-2xl p-4 space-y-2">
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Deskripsikan gambar yang ingin dibuat..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none min-h-[90px] leading-relaxed"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <select
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    className="bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Photorealistic 8K">📸 Photorealistic 8K</option>
                    <option value="Cinematic Lighting">🎬 Cinematic Lighting</option>
                    <option value="Anime Studio">🎨 Anime Studio</option>
                    <option value="3D Digital Art">👾 3D Digital Art</option>
                  </select>

                  <select
                    value={imageAspectRatio}
                    onChange={(e) => setImageAspectRatio(e.target.value)}
                    className="bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="16:9 Landscape">🖥️ 16:9 Landscape</option>
                    <option value="1:1 Square">⬛ 1:1 Square</option>
                    <option value="9:16 Portrait">📱 9:16 Portrait</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Image...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span>Generate Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Image Result Box */}
            {generatedImageResult && (
              <div className="bg-[#111420] border border-[#21273b] rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Hasil Gambar AI - {imageStyle}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 font-mono text-[10px] border border-purple-500/40">
                    {imageAspectRatio}
                  </span>
                </div>

                {/* Simulated Canvas Image Output */}
                <div className="relative aspect-video rounded-xl bg-gradient-to-br from-purple-900/60 via-slate-900 to-indigo-950 border border-[#23293e] overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-3 group shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-xl group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-8 h-8 text-purple-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
                      MAXY ACADEMY AI STUDIO
                    </h3>
                    <p className="text-xs text-purple-200/80 max-w-md line-clamp-2">
                      "{imagePrompt}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/40 text-[10px] text-slate-600 dark:text-slate-300 font-mono border border-white/10">
                      Resolution: 1920x1080 • Model: Eleven Labs Gen-3
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => showToast('Prompt disalin ke clipboard!')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181d2c] hover:bg-[#232a3f] rounded-xl text-slate-600 dark:text-slate-300 border border-[#2b334d]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Prompt</span>
                  </button>
                  <button
                    onClick={() => showToast('Gambar berhasil diunduh (PNG)!')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 font-bold rounded-xl text-slate-900 dark:text-white shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Gambar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="bg-[#111420] border border-[#21273b] rounded-3xl p-5 space-y-4 shadow-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-400" />
                    AI Video & Lip-Sync Studio
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sintesis video karakter bergerak dan lip-sync vokal otomatis untuk materi pembelajaran Maxy Academy.
                  </p>
                </div>
              </div>

              {/* Textarea Prompt */}
              <div className="relative bg-[#0b0e16] border border-[#1f263a] rounded-2xl p-4 space-y-2">
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Deskripsikan adegan video atau instruksi gerak karakter..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none min-h-[90px] leading-relaxed"
                />
              </div>

              {/* Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                    className="bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value={3}>⏱️ Durasi: 3 Detik</option>
                    <option value={5}>⏱️ Durasi: 5 Detik</option>
                    <option value={10}>⏱️ Durasi: 10 Detik</option>
                  </select>

                  <select
                    value={videoResolution}
                    onChange={(e) => setVideoResolution(e.target.value)}
                    className="bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="1080p 30fps">📹 1080p 30fps Full HD</option>
                    <option value="4K 60fps">🎬 4K 60fps Ultra HD</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingVideo ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing Video...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>Generate Video</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Video Canvas Result */}
            {generatedVideoResult && (
              <div className="bg-[#111420] border border-[#21273b] rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-indigo-400" />
                    Hasil Video AI Studio - {videoResolution}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 font-mono text-[10px] border border-indigo-500/40">
                    Lip-Sync Synchronized
                  </span>
                </div>

                {/* Simulated Interactive Video Player */}
                <div className="relative aspect-video rounded-xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border border-[#23293e] overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl group">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  
                  <button
                    onClick={() => {
                      setIsVideoPlaying(!isVideoPlaying);
                      showToast(isVideoPlaying ? 'Video dipause' : 'Memutar pratinjau video AI...');
                    }}
                    className="relative z-10 w-14 h-14 rounded-full bg-purple-600/90 hover:bg-purple-600 text-slate-900 dark:text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer"
                  >
                    {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>

                  <div className="relative z-10 text-center space-y-1 mt-3">
                    <p className="text-xs font-bold text-slate-900 dark:text-white max-w-md">
                      "{videoPrompt}"
                    </p>
                    <p className="text-[10px] text-purple-300 font-mono">
                      ElevenLabs Lip-Sync Engine v2.0
                    </p>
                  </div>

                  {/* Player Scrubber Bar Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 flex items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    <button onClick={() => setIsVideoPlaying(!isVideoPlaying)} className="cursor-pointer">
                      {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-purple-500 transition-all ${isVideoPlaying ? 'w-3/4 animate-pulse' : 'w-1/3'}`} />
                    </div>
                    <span>0:0{videoDuration} / 0:0{videoDuration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => showToast('File video MP4 HD berhasil diunduh!')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 font-bold rounded-xl text-slate-900 dark:text-white shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Video MP4</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'sfx':
        return (
          <div className="space-y-4">
            <div className="bg-[#111420] border border-[#21273b] rounded-3xl p-5 space-y-4 shadow-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    AI Sound Effects Generator (SFX)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sintesis efek suara mendalam dan realistis berbasis petunjuk naskah deskriptif.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => setSfxPrompt('Suara petir dan hujan deras di malam hari')}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    🌩️ Petir & Hujan
                  </button>
                  <button
                    onClick={() => setSfxPrompt('Suara tembakan senapan laser Sci-Fi futuristik')}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    🔫 Sci-Fi Laser
                  </button>
                  <button
                    onClick={() => setSfxPrompt('Ketikan keyboard mekanik cepat di studio Maxy Academy')}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    ⌨️ Keyboard Typing
                  </button>
                </div>
              </div>

              {/* Textarea Prompt */}
              <div className="relative bg-[#0b0e16] border border-[#1f263a] rounded-2xl p-4 space-y-2">
                <textarea
                  value={sfxPrompt}
                  onChange={(e) => setSfxPrompt(e.target.value)}
                  placeholder="Jelaskan suara yang ingin Anda buat..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none min-h-[90px] leading-relaxed"
                />
              </div>

              {/* Duration Slider */}
              <div className="bg-[#0b0e16] border border-[#1e2436] rounded-2xl p-3 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  <span>Durasi Efek Suara (1 - 22 detik):</span>
                  <span className="text-amber-400 font-mono">{sfxDuration} Detik</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="22"
                  value={sfxDuration}
                  onChange={(e) => setSfxDuration(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Controls */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleGenerateSfx}
                  disabled={isGeneratingSfx}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingSfx ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing SFX...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Sound Effect</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated SFX Audio Result */}
            {generatedSfxResult && (
              <div className="bg-[#111420] border border-[#21273b] rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Hasil Efek Suara SFX - {sfxDuration} Detik
                  </span>
                  <button
                    onClick={() => showToast('Berkas SFX WAV berhasil diunduh!')}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 rounded-lg text-xs font-bold text-slate-950 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download WAV</span>
                  </button>
                </div>

                <div className="bg-[#0b0e16] rounded-xl p-3.5 flex items-center gap-4 border border-[#1e2436]">
                  <button
                    onClick={() => {
                      setIsSfxPlaying(!isSfxPlaying);
                      showToast(isSfxPlaying ? 'SFX paused' : 'Memutar sampel SFX...');
                    }}
                    className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                  >
                    {isSfxPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <span className="truncate max-w-[200px]">"{sfxPrompt}"</span>
                      <span className="text-[10px] text-amber-400 font-mono">24-bit 48kHz WAV</span>
                    </div>
                    <div className="h-2 bg-[#1b2030] rounded-full overflow-hidden">
                      <div className={`h-full bg-amber-400 transition-all ${isSfxPlaying ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'music':
        return (
          <div className="space-y-4">
            <div className="bg-[#111420] border border-[#21273b] rounded-3xl p-5 space-y-4 shadow-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Music className="w-5 h-5 text-indigo-400" />
                    AI Music & Instrumental Studio
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gubah musik latar instrumental, jingle promosi, dan track audio atmosferik dengan AI.
                  </p>
                </div>
              </div>

              {/* Textarea Prompt */}
              <div className="relative bg-[#0b0e16] border border-[#1f263a] rounded-2xl p-4 space-y-2">
                <textarea
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  placeholder="Deskripsikan gaya musik, alat musik, dan suasana lagu..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none min-h-[90px] leading-relaxed"
                />
              </div>

              {/* Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <select
                    value={musicGenre}
                    onChange={(e) => setMusicGenre(e.target.value)}
                    className="bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Ambient Lofi">🎧 Ambient Lofi Chill</option>
                    <option value="Cinematic Orchestral">🎻 Cinematic Orchestral</option>
                    <option value="Cyberpunk Synthwave">⚡ Cyberpunk Synthwave</option>
                    <option value="Acoustic Chill">🎸 Acoustic Guitar Chill</option>
                  </select>

                  <select
                    value={musicLength}
                    onChange={(e) => setMusicLength(e.target.value)}
                    className="bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="30 Detik">⏱️ 30 Detik</option>
                    <option value="60 Detik">⏱️ 60 Detik</option>
                    <option value="2 Menit">⏱️ 2 Menit</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateMusic}
                  disabled={isGeneratingMusic}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingMusic ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Composing Music...</span>
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4" />
                      <span>Generate Music Track</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Music Track Result */}
            {generatedMusicResult && (
              <div className="bg-[#111420] border border-[#21273b] rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Disc className="w-4 h-4 text-indigo-400 animate-spin" />
                    Hasil Komposisi Musik AI - Maxy Academy Soundtrack
                  </span>
                  <button
                    onClick={() => showToast('Musik MP3 berhasil diunduh!')}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP3</span>
                  </button>
                </div>

                <div className="bg-[#0b0e16] rounded-xl p-3.5 flex items-center gap-4 border border-[#1e2436]">
                  <button
                    onClick={() => {
                      setIsMusicPlaying(!isMusicPlaying);
                      showToast(isMusicPlaying ? 'Musik paused' : 'Memutar musik AI...');
                    }}
                    className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-slate-900 dark:text-white font-bold flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                  >
                    {isMusicPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <span>"{musicPrompt}"</span>
                      <span className="text-[10px] text-indigo-400 font-mono">{musicGenre} • {musicLength}</span>
                    </div>
                    <div className="h-2 bg-[#1b2030] rounded-full overflow-hidden">
                      <div className={`h-full bg-indigo-500 transition-all ${isMusicPlaying ? 'w-1/2 animate-pulse' : 'w-1/3'}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'voice-changer':
        return (
          <div className="space-y-4">
            <div className="bg-[#111420] border border-[#21273b] rounded-3xl p-5 space-y-4 shadow-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-rose-400" />
                    AI Voice Changer (Speech-to-Speech)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ubah karakter vokal dari rekaman suara Anda menjadi pengisi suara AI Maxy Academy pilihan.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#2b334d] hover:border-purple-500/50 rounded-2xl p-4 text-center bg-[#0b0e16] space-y-2 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-rose-400 mx-auto" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    File Input: <span className="text-rose-300 font-mono">{voiceChangerFile}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Klik untuk mengganti berkas audio (MP3, WAV, M4A hingga 25MB)
                  </p>
                </div>
              </div>

              {/* Target Voice & Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Pilih Target Voice AI:</label>
                  <select
                    value={voiceChangerTarget}
                    onChange={(e) => setVoiceChangerTarget(e.target.value)}
                    className="w-full bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Aria - Maxy Educator">🎙️ Aria - Maxy Educator</option>
                    <option value="Adam - Tech Narrator">👨‍💻 Adam - Tech Narrator</option>
                    <option value="Serena - Warm Guide">🌸 Serena - Warm Guide</option>
                    <option value="Marcus - Executive Pitch">💼 Marcus - Executive Pitch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                    Pitch Shift Offset ({voiceChangerPitch} semitones):
                  </label>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    value={voiceChangerPitch}
                    onChange={(e) => setVoiceChangerPitch(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleConvertVoice}
                  disabled={isConvertingVoice}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50"
                >
                  {isConvertingVoice ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Converting Voice...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4" />
                      <span>Convert Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Converted Audio Result */}
            {generatedVoiceChangerResult && (
              <div className="bg-[#111420] border border-[#21273b] rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-400" />
                    Hasil Konversi Voice Changer - Target: {voiceChangerTarget}
                  </span>
                  <button
                    onClick={() => showToast('Audio hasil konversi berhasil diunduh!')}
                    className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Audio</span>
                  </button>
                </div>

                <div className="bg-[#0b0e16] rounded-xl p-3.5 flex items-center gap-4 border border-[#1e2436]">
                  <button
                    onClick={() => {
                      setIsVoiceChangerPlaying(!isVoiceChangerPlaying);
                      showToast(isVoiceChangerPlaying ? 'Audio paused' : 'Memutar suara hasil konversi...');
                    }}
                    className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-slate-900 dark:text-white font-bold flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                  >
                    {isVoiceChangerPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <span>{voiceChangerFile} ➔ {voiceChangerTarget}</span>
                      <span className="text-[10px] text-rose-400 font-mono">100% Speech-to-Speech</span>
                    </div>
                    <div className="h-2 bg-[#1b2030] rounded-full overflow-hidden">
                      <div className={`h-full bg-rose-500 transition-all ${isVoiceChangerPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'isolator':
        return (
          <div className="space-y-4">
            <div className="bg-[#111420] border border-[#21273b] rounded-3xl p-5 space-y-4 shadow-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-teal-400" />
                    AI Voice Isolator & Noise Remover
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ekstrak vokal murni dan bersihkan noise latar belakang dari rekaman audio podcast atau kelas.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#2b334d] hover:border-teal-500/50 rounded-2xl p-4 text-center bg-[#0b0e16] space-y-2 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-teal-400 mx-auto" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Berkas Input: <span className="text-teal-300 font-mono">{isolatorFile}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Klik untuk mengunggah berkas audio noisy (WAV, MP3, FLAC)
                  </p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="bg-[#0b0e16] border border-[#1e2436] rounded-2xl p-3 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  <span>Kekuatan Pembersihan Noise:</span>
                  <span className="text-teal-400 font-mono">{isolatorStrength}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isolatorStrength}
                  onChange={(e) => setIsolatorStrength(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleIsolateVoice}
                  disabled={isIsolatingVoice}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50"
                >
                  {isIsolatingVoice ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Isolating Vocal...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Isolate Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Clean Audio Result */}
            {generatedIsolatorResult && (
              <div className="bg-[#111420] border border-[#21273b] rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-teal-400" />
                    Vokal Bersih Terisolasi - Reduced -28dB Noise
                  </span>
                  <button
                    onClick={() => showToast('File audio Vokal Bersih WAV diunduh!')}
                    className="flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Clean WAV</span>
                  </button>
                </div>

                <div className="bg-[#0b0e16] rounded-xl p-3.5 flex items-center gap-4 border border-[#1e2436]">
                  <button
                    onClick={() => {
                      setIsIsolatorPlaying(!isIsolatorPlaying);
                      showToast(isIsolatorPlaying ? 'Audio paused' : 'Memutar vokal bersih...');
                    }}
                    className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-700 text-slate-900 dark:text-white font-bold flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                  >
                    {isIsolatorPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <span>{isolatorFile} ➔ Clean Vocal</span>
                      <span className="text-[10px] text-teal-400 font-mono">Noise Free</span>
                    </div>
                    <div className="h-2 bg-[#1b2030] rounded-full overflow-hidden">
                      <div className={`h-full bg-teal-400 transition-all ${isIsolatorPlaying ? 'w-3/4 animate-pulse' : 'w-1/2'}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'upscale':
        return (
          <div className="space-y-4">
            <div className="bg-[#111420] border border-[#21273b] rounded-3xl p-5 space-y-4 shadow-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Audio Upscaler & Studio Quality Enhancer
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tingkatkan bitrate, kejelasan frekuensi tinggi, dan kualitas studio audio rekaman Anda.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#2b334d] hover:border-amber-500/50 rounded-2xl p-4 text-center bg-[#0b0e16] space-y-2 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    File Input: <span className="text-amber-300 font-mono">{upscaleFile}</span> (128 kbps)
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Klik untuk mengunggah berkas audio bitrate rendah
                  </p>
                </div>
              </div>

              {/* Quality Selector */}
              <div className="text-xs space-y-1">
                <label className="block text-slate-600 dark:text-slate-300 font-bold">Target Kualitas Studio Master:</label>
                <select
                  value={upscaleQuality}
                  onChange={(e) => setUpscaleQuality(e.target.value)}
                  className="w-full bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="48kHz / 24-bit Studio WAV">🎙️ 48kHz / 24-bit Studio WAV</option>
                  <option value="96kHz High-Res Master">⚡ 96kHz High-Res Master Audio</option>
                  <option value="FLAC Lossless Studio">💎 FLAC Lossless Studio Master</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleUpscaleAudio}
                  disabled={isUpscalingAudio}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-xs active:scale-95 disabled:opacity-50"
                >
                  {isUpscalingAudio ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                      <span>Upscaling Audio...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Upscale Audio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Upscaled Audio Result */}
            {generatedUpscaleResult && (
              <div className="bg-[#111420] border border-[#21273b] rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Hasil Upscale Audio Studio Master - {upscaleQuality}
                  </span>
                  <button
                    onClick={() => showToast('Master Audio 24-bit WAV berhasil diunduh!')}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 rounded-lg text-xs font-bold text-slate-950 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Master WAV</span>
                  </button>
                </div>

                <div className="bg-[#0b0e16] rounded-xl p-3.5 flex items-center gap-4 border border-[#1e2436]">
                  <button
                    onClick={() => {
                      setIsUpscalePlaying(!isUpscalePlaying);
                      showToast(isUpscalePlaying ? 'Audio paused' : 'Memutar sampel studio master...');
                    }}
                    className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                  >
                    {isUpscalePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <span>128 kbps MP3 ➔ 2304 kbps Studio WAV</span>
                      <span className="text-[10px] text-amber-400 font-mono">High-Res Restoration</span>
                    </div>
                    <div className="h-2 bg-[#1b2030] rounded-full overflow-hidden">
                      <div className={`h-full bg-amber-400 transition-all ${isUpscalePlaying ? 'w-4/5 animate-pulse' : 'w-1/2'}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'speech':
      default:
        return (
          <div className="space-y-4">
            {/* Main Text to Speech Card */}
            <div className="bg-[#111420] border border-[#21273b] rounded-3xl p-5 space-y-4 shadow-2xl relative">
              {/* Header Title & Quick Prompt Pills */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-purple-400" />
                    Text to Speech AI Studio
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ubah skrip teks Anda menjadi rekaman suara vokal manusia alami dengan emosi tinggi.
                  </p>
                </div>

                {/* Quick-Prompt Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      setScriptText(
                        'Pada suatu malam yang cerah di perpustakaan Maxy Academy, sebuah algoritma AI baru berhasil menemukan kunci pemahaman emosi manusia...'
                      );
                      setErrorMessage(null);
                      showToast('Skrip sampel "Narrate a story" dimuat!');
                    }}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
                  >
                    🎙️ Narrate a story
                  </button>

                  <button
                    onClick={() => {
                      setScriptText(
                        'Mengapa AI tidak pernah marah ketika salah menjawab? Karena dia selalu punya opsi... regenerate response!'
                      );
                      setErrorMessage(null);
                      showToast('Skrip sampel "Tell a joke" dimuat!');
                    }}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
                  >
                    😄 Tell a joke
                  </button>

                  <button
                    onClick={() => {
                      setScriptText(
                        'Tingkatkan skill AI & Software Engineering Anda bersama Maxy Academy! Daftar kelas hari ini dan raih sertifikasi profesional berstandar industri.'
                      );
                      setErrorMessage(null);
                      showToast('Skrip sampel "Record an ad" dimuat!');
                    }}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
                  >
                    📢 Record an ad
                  </button>

                  <button
                    onClick={() => {
                      setScriptText(
                        'Tarik napas perlahan... hembuskan... Biarkan pikiran Anda tenang dan siap menyerap materi pembelajaran di Maxy Academy...'
                      );
                      setErrorMessage(null);
                      showToast('Skrip sampel "Guide a meditation" dimuat!');
                    }}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#252c45] rounded-xl border border-[#2d3652] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
                  >
                    🧘 Guide a meditation
                  </button>
                </div>
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-red-300 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="text-red-400 hover:text-slate-900 dark:text-white shrink-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Textarea Script Input */}
              <div className="relative bg-[#0b0e16] border border-[#1f263a] rounded-2xl p-4 space-y-2">
                <textarea
                  value={scriptText}
                  onChange={(e) => {
                    setScriptText(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Ketik skrip teks Anda di sini..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none resize-none min-h-[110px] leading-relaxed font-sans"
                />
                <div className="flex items-center justify-between pt-2 border-t border-[#181e2e] text-[11px] font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Bahasa Indonesia / English (Multilingual Support)</span>
                  <span className={scriptText.length > 2500 ? 'text-red-400 font-bold' : scriptText.length > 2000 ? 'text-amber-400' : 'text-slate-500 dark:text-slate-400'}>
                    {scriptText.length.toLocaleString()} / 2,500 characters
                  </span>
                </div>
              </div>

              {/* Model, Voice Selectors & More Options */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  {/* Voice Selector */}
                  <div className="relative min-w-[200px]">
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full bg-[#181d2c] border border-[#2b334d] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer appearance-none pr-8"
                    >
                      <option value="Aria - Maxy Educator">🎙️ Aria - Maxy Educator</option>
                      <option value="Adam - Tech Narrator">👨‍💻 Adam - Tech Narrator</option>
                      <option value="Serena - Warm Guide">🌸 Serena - Warm Guide</option>
                      <option value="Marcus - Executive Pitch">💼 Marcus - Executive Pitch</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {/* Model Selector */}
                  <div className="relative min-w-[190px]">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-[#181d2c] border border-[#2b334d] text-purple-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer appearance-none pr-8"
                    >
                      <option value="Eleven Multilingual v2">⚡ Eleven Multilingual v2</option>
                      <option value="Eleven Turbo v2.5">🚀 Eleven Turbo v2.5</option>
                      <option value="Eleven Flash v2.5">💥 Eleven Flash v2.5</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  {/* More Options Button */}
                  <button
                    onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                      showVoiceSettings
                        ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                        : 'bg-[#181d2c] hover:bg-[#232a3f] text-slate-600 dark:text-slate-300 border-[#2b334d]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>More options</span>
                  </button>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateSpeech}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-slate-900 dark:text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50 text-xs cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Audio...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Generate Speech</span>
                    </>
                  )}
                </button>
              </div>

              {/* Voice Settings Slider Modal Panel */}
              {showVoiceSettings && (
                <div className="bg-[#0b0e16] border border-purple-500/40 rounded-2xl p-4 text-xs space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-[#1b2133] pb-2">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Voice Settings Fine-Tuning
                    </span>
                    <button
                      onClick={() => setShowVoiceSettings(false)}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Stability Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                        <span>Stability</span>
                        <span className="font-mono text-purple-400">{stability}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stability}
                        onChange={(e) => setStability(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>More Variable</span>
                        <span>More Stable</span>
                      </div>
                    </div>

                    {/* Clarity / Similarity Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                        <span>Clarity + Similarity</span>
                        <span className="font-mono text-purple-400">{clarity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={clarity}
                        onChange={(e) => setClarity(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>

                    {/* Style Exaggeration Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                        <span>Style Exaggeration</span>
                        <span className="font-mono text-purple-400">{styleExaggeration}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={styleExaggeration}
                        onChange={(e) => setStyleExaggeration(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>None</span>
                        <span>Exaggerated</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rendered Generated Audio Result Player Card */}
            {hasGeneratedAudio && (
              <div
                className="bg-[#111420] border border-[#21273b] rounded-2xl p-4 space-y-3 shadow-xl hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 border border-purple-500/40">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        Generated Audio - {selectedVoice}
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {selectedModel} • {scriptText.length} characters • MP3/WAV Studio Audio
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShareLink}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#181d2c] hover:bg-[#232a3f] rounded-lg text-xs text-slate-600 dark:text-slate-300 border border-[#2b334d] cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={handleDownloadAudio}
                      className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white shadow-md cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Audio Controls & Interactive Waveform */}
                <div className="bg-[#0b0e16] rounded-xl p-3 flex items-center gap-4 border border-[#1a1f2e]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRewind}
                      title="Rewind 10s"
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={togglePlayAudio}
                      className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-slate-900 dark:text-white flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={handleForward}
                      title="Forward 10s"
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Interactive Waveform Bar Scrubber */}
                  <div
                    className="flex-1 flex items-center gap-1 h-8 px-2 cursor-pointer group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const pct = Math.max(0, Math.min(1, clickX / rect.width));
                      handleSeek(pct * audioDuration);
                    }}
                  >
                    {[40, 65, 30, 80, 95, 50, 70, 85, 40, 60, 90, 100, 75, 45, 80, 60, 35, 90, 70, 50, 85, 60, 40, 75, 95, 55, 30, 70, 85, 40, 60, 80, 50].map((val, idx) => {
                      const barPct = (idx / 33) * 100;
                      const currentPct = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;
                      const isPast = barPct <= currentPct;
                      let displayHeight = val;
                      if (isPlaying) {
                        displayHeight = Math.min(100, Math.max(20, val + Math.sin(idx + currentTime * 8) * 20));
                      }
                      return (
                        <div
                          key={idx}
                          style={{ height: `${displayHeight}%` }}
                          className={`flex-1 rounded-full transition-all duration-150 ${
                            isPast ? 'bg-purple-500 shadow-sm shadow-purple-500/50' : 'bg-[#1e2538] group-hover:bg-[#28324d]'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                    {formatTime(currentTime)} / {formatTime(audioDuration)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  // Detailed Modal Dictionary for ElevenLabs Elements
  const infoDictionary: Record<string, InfoModalData> = {
    'workspace-switcher': {
      title: "Workspace Switcher (Maxy Academy's Workspace)",
      category: 'Organization',
      badge: 'Team Account',
      description: 'Navigasi pengalih ruang kerja untuk mengelola proyek audio tim Maxy Academy, mengisolasi aset konten, dan mengatur hak akses anggota tim.',
      keyFeatures: [
        'Peralihan cepat antar workspace personal dan ruang kerja akademi',
        'Pengelolaan kuota karakter bulanan tim Maxy Academy',
        'Penyimpanan aset suara terpusat untuk kolaborasi'
      ],
      howToUse: 'Klik nama workspace di sudut kiri atas sidebar untuk membuka menu dropdown dan beralih ruang kerja.'
    },
    'menu-home': {
      title: 'Home Dashboard',
      category: 'Main Navigation',
      badge: 'Central Hub',
      description: 'Halaman utama tempat berkumpulnya seluruh alat generative audio ElevenLabs, riwayat generasi suara terbaru, dan jalan pintas ke proyek aktif.',
      keyFeatures: [
        'Akses satu klik ke alat Text to Speech, Sound Effects, dan Voice Isolator',
        'Tampilan aktivitas generasi audio terbaru milik Maxy Academy',
        'Rekomendasi model dan tips pembuatan audio'
      ],
      howToUse: 'Klik menu "Home" untuk kembali ke dasbor utama kapan saja.'
    },
    'menu-voices': {
      title: 'Voice Library & Custom Voices',
      category: 'Voice Studio',
      badge: 'Voice Cloning',
      description: 'Galeri perpustakaan ribuan suara AI komunitas global serta pusat pembuatan Voice Design dan Voice Cloning milik Maxy Academy.',
      keyFeatures: [
        'Voice Design: Membuat karakter suara baru berdasarkan parameter usia, gender, dan aksen',
        'Instant & Professional Voice Cloning: Mengkloning suara nyata pengguna dengan rekaman singkat',
        'Perpustakaan suara multibahasa berakurasi emosi tinggi'
      ],
      howToUse: 'Buka menu "Voices" untuk menjelajahi ribuan opsi suara atau membuat klon suara narator Maxy Academy.'
    },
    'menu-studio': {
      title: 'ElevenLabs Studio (Projects)',
      category: 'Long-Form Audio',
      badge: 'Audiobook & Podcast',
      description: 'Pusat pembuatan proyek audio berdurasi panjang seperti audiobook, narasi naskah video YouTube, modul pembelajaran, dan podcast multi-pembicara.',
      keyFeatures: [
        'Penyuntingan audio berbasis paragraf dan skrip utuh',
        'Dukungan penetapan karakter suara berbeda untuk tiap dialog pembicara',
        'Pengaturan jeda waktu (pause duration) dan perbaikan pengucapan kata demi kata'
      ],
      howToUse: 'Klik "Studio" untuk membuat proyek dokumen berdurasi panjang dan mengatur alur audio terstruktur.'
    },
    'menu-flows': {
      title: 'Conversational AI Flows',
      category: 'Interactive Audio',
      badge: 'Agent Workflow',
      description: 'Platform pembuatan agen suara AI interaktif untuk layanan pelanggan, asisten percakapan otomatis, dan bot wawancara suara waktu nyata.',
      keyFeatures: [
        'Integrasi LLM dengan sintesis suara latensi ultra-rendah (<300ms)',
        'Pemetaan alur percakapan visual bercabang (flowcharts)',
        'Pengujian percakapan langsung di dalam dasbor'
      ],
      howToUse: 'Masuk ke "Flows" untuk merancang agen suara interaktif untuk layanan informasi Maxy Academy.'
    },
    'menu-templates': {
      title: 'Audio Templates & Presets',
      category: 'Preset Studio',
      badge: 'Production Ready',
      description: 'Kumpulan templat skrip audio siap pakai untuk iklan radio, narasi trailer film, sulur suara meditasi, dan pengumuman resmi.',
      keyFeatures: [
        'Templat dengan kombinasi model suara dan pengaturan emosi teruji',
        'Penghematan waktu produksi untuk konten repetitif',
        'Praktik terbaik penataan jeda baca (punctuation pacing)'
      ],
      howToUse: 'Pilih "Templates" untuk mengutip struktur audio populer dan menyesuaikan skripnya sesuai kebutuhan.'
    },
    'menu-assets': {
      title: 'Asset Manager & Audio Vault',
      category: 'Storage',
      badge: 'Cloud Storage',
      description: 'Penyimpanan terpusat untuk semua berkas audio hasil unduhan, klip efek suara, file transkrip, dan sampel rekaman suara asli.',
      keyFeatures: [
        'Pengelompokan berkas audio berdasarkan kategori proyek',
        'Unduhan ulang beresolusi tinggi tanpa memotong kuota karakter',
        'Ekspor berkas berformat MP3, WAV, atau PCM'
      ],
      howToUse: 'Klik "Assets" untuk mengelola dan mengunduh kembali file audio yang telah dibuat sebelumnya.'
    },
    'pinned-tts': {
      title: 'Text to Speech (TTS)',
      category: 'Pinned Core Tool',
      badge: 'Most Used',
      description: 'Fitur utama untuk merubah teks tulisan menjadi rekaman suara manusia yang sangat alami, kaya emosi, dan ekspresif.',
      keyFeatures: [
        'Generasi suara multibahasa (termasuk Bahasa Indonesia)',
        'Pengaturan Stability dan Clarity untuk variasi intonasi',
        'Mendukung model Multilingual v2, Turbo v2.5, dan Flash'
      ],
      howToUse: 'Klik "Text to Speech" di section Pinned untuk membuka panel generasi suara dari skrip.'
    },
    'pinned-sfx': {
      title: 'AI Sound Effects Generator',
      category: 'Pinned Core Tool',
      badge: 'Audio FX',
      description: 'Alat pembuat efek suara (sound effects) dari deskripsi teks sederhana, seperti suara derap langkah, gemuruh petir, atau pintu berdecit.',
      keyFeatures: [
        'Generasi efek suara sinematik tanpa batas hak cipta',
        'Kontrol durasi efek suara dari 1 hingga 22 detik',
        'Hasil bersih berfrekuensi tinggi siap untuk video editing'
      ],
      howToUse: 'Pilih "Sound Effects", ketik deskripsi efek suara (misal: "futuristic UI click sound"), lalu klik Generate.'
    },
    'pinned-isolator': {
      title: 'Voice Isolator (Noise Removal)',
      category: 'Pinned Core Tool',
      badge: 'Audio Cleaner',
      description: 'Pembersih rekaman audio pintar yang memisahkan vokal manusia dari kebisingan latar belakang (background noise, angin, musik).',
      keyFeatures: [
        'Ekstraksi vokal jernih dari rekaman HP bernoise tinggi',
        'Penyelamatan materi podcast atau wawancara outdoor',
        'Proses cepat otomatis menggunakan AI audio restoration'
      ],
      howToUse: 'Unggah file rekaman Anda ke "Voice Isolator" untuk mendapatkan vokal studio bersih.'
    },
    'pinned-changer': {
      title: 'Speech-to-Speech Voice Changer',
      category: 'Pinned Core Tool',
      badge: 'Voice Transformation',
      description: 'Mengubah karakter suara dari rekaman vokal Anda sendiri menjadi karakter suara AI lain dengan mempertahankan irama, nada, dan emosi asli.',
      keyFeatures: [
        'Menjaga aksentuasi dan penekanan emosi asli manusia',
        'Konversi suara aktor pria menjadi wanita atau sebaliknya',
        'Sangat ideal untuk dubbing karakter animasi'
      ],
      howToUse: 'Unggah atau rekam vokal Anda, pilih suara target di "Voice Changer", dan hasilkan vokal baru.'
    },
    'pinned-music': {
      title: 'AI Music Generator',
      category: 'Pinned Core Tool',
      badge: 'Background Score',
      description: 'Generator musik latar belakang (BGM) berdasarkan deskripsi genre, suasana hati (mood), dan instrumen yang diinginkan.',
      keyFeatures: [
        'Pembuatan komposisi instrumen bebas royalty',
        'Pengaturan mood (calm, energetic, suspense, corporate)',
        'Penggabungan mulus dengan rekaman vokal narasi'
      ],
      howToUse: 'Pilih "Music", tulis prompt suasana lagu (misal: "inspiring ambient piano for edtech video"), lalu jalankan AI.'
    },
    'pinned-stt': {
      title: 'Speech to Text (Transcription)',
      category: 'Pinned Core Tool',
      badge: 'Transcription',
      description: 'Mesin transkripsi otomatis berkadar akurasi tinggi yang merubah rekaman percakapan suara menjadi teks dokumen lengkap dengan timestamp.',
      keyFeatures: [
        'Deteksi bahasa otomatis berakurasi tinggi',
        'Pemisahan pembicara (Speaker Diarization)',
        'Ekspor teks bertipe SRT untuk subtitlet video'
      ],
      howToUse: 'Unggah berkas audio percakapan ke "Speech to Text" untuk mengunduh naskah transkripnya.'
    },
    'pinned-dubbing': {
      title: 'AI Video & Audio Dubbing',
      category: 'Pinned Core Tool',
      badge: 'Localization',
      description: 'Alat penerjemah dan pengalih suara video otomatis ke 29+ bahasa dunia dengan kloning tone suara asli pembicara.',
      keyFeatures: [
        'Penerjemahan otomatis Bahasa Indonesia ke Inggris, Jepang, Mandarin, dll.',
        'Penyesuaian sinkronisasi bibir dan waktu bicara',
        'Mempertahankan emosi unik pembicara asli'
      ],
      howToUse: 'Unggah video YouTube atau berkas MP4 ke "Dubbing" dan pilih bahasa target terjemahan.'
    },
    'pinned-audiobooks': {
      title: 'Audiobook Publishing Suite',
      category: 'Pinned Core Tool',
      badge: 'Publishing',
      description: 'Modul khusus untuk menyusun naskah buku menjadi audio naskah komersial berformat bab (chapters) siap edar.',
      keyFeatures: [
        'Pengaturan struktur bab buku secara teratur',
        'Pemeriksaan konsistensi nada suara sepanjang ratusan halaman',
        'Pemeriksaan standar audio industri Audible/ACX'
      ],
      howToUse: 'Buka "Audiobooks" untuk memasukkan berkas EPUB/PDF buku Anda dan menghasilkan audio per bab.'
    },
    'topbar-search': {
      title: 'Global Search Bar (⌘K)',
      category: 'Top Bar',
      badge: 'Quick Lookup',
      description: 'Bilah pencarian cepat untuk menemukan nama suara, proyek audio, fitur alat, atau templat dalam waktu singkat.',
      keyFeatures: [
        'Pencarian lintas kategori (suara, berkas, fungsi)',
        'Dukungan pintasan keyboard Cmd+K / Ctrl+K',
        'Navigasi langsung tanpa melalui menu bertingkat'
      ],
      howToUse: 'Tekan Ctrl+K atau klik kolom search di top bar, lalu ketik kata kunci yang dicari.'
    },
    'topbar-feedback': {
      title: 'User Feedback & Request',
      category: 'Top Bar',
      badge: 'Community',
      description: 'Saluran komunikasi langsung untuk mengirimkan ulasan, laporan kendala teknis, atau permintaan fitur baru ke tim developer ElevenLabs.',
      keyFeatures: [
        'Pengiriman laporan bug beserta bukti tangkapan layar',
        'Upan balik kualitas sintesis suara Bahasa Indonesia',
        'Pemberian saran pengembangan produk'
      ],
      howToUse: 'Klik tombol "Feedback" untuk membuka formulir pesan ke pengembang.'
    },
    'topbar-docs': {
      title: 'Developer Docs & API Center',
      category: 'Top Bar',
      badge: 'Documentation',
      description: 'Dokumentasi teknis resmi, panduan SDK TypeScript/Python, dan referensi API Endpoint untuk integrasi ElevenLabs ke aplikasi.',
      keyFeatures: [
        'Panduan integrasi API Text-to-Speech real-time',
        'Dokumentasi WebSocket untuk streaming audio latensi rendah',
        'Contoh kode program lengkap'
      ],
      howToUse: 'Klik "Docs" untuk membaca dokumentasi API bagi pengembang aplikasi Maxy Academy.'
    },
    'topbar-ask': {
      title: 'Ask AI Copilot Assistant',
      category: 'Top Bar',
      badge: 'AI Assistant',
      description: 'Asisten AI interaktif yang siap menjawab pertanyaan tentang cara penataan prompt TTS, optimasi suara, dan pemecahan masalah audio.',
      keyFeatures: [
        'Saran langsung perbaikan naskah skrip audio',
        'Rekomendasi pemilihan model suara terbaik',
        'Panduan pemaksaan cara pengucapan kata asing'
      ],
      howToUse: 'Klik tombol "Ask" untuk berdiskusi dengan AI Asisten mengenai optimasi audio Anda.'
    },
    'topbar-notifications': {
      title: 'Notifications Bell',
      category: 'Top Bar',
      badge: 'Alerts',
      description: 'Pusat notifikasi untuk memantau status pemrosesan proyek audio panjang, pembaruan fitur baru, dan peringatan kuota karakter.',
      keyFeatures: [
        'Pemberitahuan selesainya proses dubbing video panjang',
        'Informasi pembaruan model suara Eleven Multilingual',
        'Peringatan saat kuota karakter mendekati batas'
      ],
      howToUse: 'Klik ikon lonceng untuk memeriksa pesan pemberitahuan terbaru.'
    },
    'topbar-profile': {
      title: 'Profile & Subscription Tier',
      category: 'Top Bar',
      badge: 'Account',
      description: 'Informasi profil pengguna Maxy Academy, penggunaan kuota karakter bulanan, dan pengaturan rencana langganan Pro.',
      keyFeatures: [
        'Indikator sisa kuota karakter real-time',
        'Manajemen API Key untuk pengembang',
        'Pengaturan informasi tagihan dan akun tim'
      ],
      howToUse: 'Klik foto profil di sudut kanan atas untuk melihat sisa kuota karakter dan pengaturan akun.'
    },
    'tool-tab-speech': {
      title: 'Tool Tab: Speech (TTS & Voice Generation)',
      category: 'Tool Tabs',
      badge: 'Core Focus',
      description: 'Tab alat utama untuk mengubah instruksi teks menjadi audio vokal manusia berkategori narasi, iklan, cerita, atau edukasi.',
      keyFeatures: [
        'Sintesis vokal dengan kontrol gaya intonasi komprehensif',
        'Dukungan puluhan pilihan emosi dan variasi suara',
        'Pratinjau instan dan penyuntingan skrip cepat'
      ],
      howToUse: 'Aktifkan tab "Speech" untuk mulai memasukkan naskah teks yang ingin diubah menjadi audio.'
    },
    'quick-narrate': {
      title: 'Quick Prompt: Narrate a Story',
      category: 'Quick Template',
      badge: 'Storytelling',
      description: 'Tombol pemicu cepat yang mengisikan contoh skrip narasi fiksi atau dongeng bertempo santai dengan ritme bercerita yang imersif.',
      keyFeatures: [
        'Mengatur skrip cerita imajinatif otomatis',
        'Sangat cocok dipadukan dengan voice "Adam" atau "Aria"',
        'Memberikan inspirasi penulisan jeda cerita'
      ],
      howToUse: 'Klik pemicu "Narrate a story" di atas kolom teks untuk memuat skrip sampel bercerita.'
    },
    'quick-joke': {
      title: 'Quick Prompt: Tell a Joke',
      category: 'Quick Template',
      badge: 'Humor',
      description: 'Tombol pemicu cepat untuk memuat contoh humor singkat dengan jeda waktu punchline yang disesuaikan secara pas.',
      keyFeatures: [
        'Pengaturan intonasi jenaka dan jeda punchline tawa',
        'Sangat baik untuk menguji keluwesan emosi suara AI',
        'Contoh ekspresi gembira'
      ],
      howToUse: 'Klik "Tell a joke" untuk mencoba performa intonasi komedi dari karakter suara yang dipilih.'
    },
    'quick-ad': {
      title: 'Quick Prompt: Record an Ad',
      category: 'Quick Template',
      badge: 'Marketing',
      description: 'Tombol pemicu cepat yang memuat skrip promosi iklan komersial berenergi tinggi dengan penekanan kata kunci penawaran.',
      keyFeatures: [
        'Intonasi antusias dan artikulasi tegas',
        'Penggunaan tanda seru dan kapitalisasi untuk dorongan energi vokal',
        'Ideal untuk voiceover materi pemasaran Maxy Academy'
      ],
      howToUse: 'Klik "Record an ad" untuk mempelajari gaya naskah promosi berenergi tinggi.'
    },
    'quick-meditation': {
      title: 'Quick Prompt: Guide a Meditation',
      category: 'Quick Template',
      badge: 'Calm & Relaxing',
      description: 'Tombol pemicu cepat yang mengisikan skrip panduan relaksasi dan meditasi dengan tempo lambat serta napas jeda panjang.',
      keyFeatures: [
        'Gaya suara lembut, berbisik tenang, dan bertempo lambat',
        'Penggunaan titik tiga (...) untuk memicu jeda napas dalam',
        'Sangat baik untuk modul kesehatan mental dan relaksasi'
      ],
      howToUse: 'Klik "Guide a meditation" untuk mencoba naskah bersuara lembut dan menenangkan.'
    },
    'selector-voice': {
      title: 'Voice Selector Dropdown',
      category: 'Voice Engine',
      badge: 'Character Choice',
      description: 'Menu pemilih karakter vokal AI yang akan membacakan skrip Anda. Setiap suara memiliki aksen, usia, dan warna emosi yang unik.',
      keyFeatures: [
        'Aria - Maxy Educator: Suara wanita hangat, jelas, dan profesional untuk modul pembelajaran',
        'Adam - Tech Narrator: Suara pria wibawa dan dalam untuk presentasi teknologi',
        'Serena - Warm Guide: Suara menenangkan untuk podcast dan relaksasi',
        'Marcus - Executive Pitch: Suara tegas untuk presentasi bisnis'
      ],
      howToUse: 'Klik dropdown nama suara untuk memilih vokal narator yang paling sesuai dengan topik naskah Anda.'
    },
    'selector-model': {
      title: 'Model Selector Dropdown',
      category: 'AI Model Engine',
      badge: 'Neural Network',
      description: 'Menu pemilih arsitektur jaringan saraf AI pemroses suara. Menentukan kecepatan generasi, fleksibilitas emosi, dan kecakapan multibahasa.',
      keyFeatures: [
        'Eleven Multilingual v2: Model terbaik untuk Bahasa Indonesia dengan pengucapan alami beremosi tinggi',
        'Eleven Turbo v2.5: Model latensi rendah berkecepatan tinggi untuk aplikasi real-time',
        'Eleven Flash v2.5: Model super cepat dan hemat kuota untuk konversi teks singkat'
      ],
      howToUse: 'Klik nama model untuk menentukan keseimbangan antara kualitas emosi dan kecepatan pemrosesan.'
    },
    'voice-settings-btn': {
      title: 'More Options (Voice Settings)',
      category: 'Audio Tuning',
      badge: 'Fine-Tuning Sliders',
      description: 'Panel pengatur detail karakteristik vokal seperti Stability (Stabilitas), Clarity (Kejelasan), Style Exaggeration, dan Speaker Boost.',
      keyFeatures: [
        'Stability: Mengontrol variasi nada (Rendah = Ekspresif/Emosional, Tinggi = Monoton/Konsisten)',
        'Clarity & Similarity Boost: Meningkatkan kejelasan artikulasi dan kemiripan dengan vokal asli',
        'Style Exaggeration: Memperkuat gaya dramatis dari karakter suara',
        'Speaker Boost: Meningkatkan kejernihan frekuensi audio vokal'
      ],
      howToUse: 'Klik "More options" atau ikon slider untuk membuka dialog penyetelan parameter stabilitas dan kejelasan suara.'
    },
    'generate-btn': {
      title: 'Generate Speech Button',
      category: 'Execution Engine',
      badge: 'Render Action',
      description: 'Tombol eksekusi utama berlatar gelap/hitam yang memicu mesin AI ElevenLabs merender teks tulisan menjadi berkas audio nyata.',
      keyFeatures: [
        'Mengirim skrip teks dan konfigurasi vokal ke server ElevenLabs',
        'Menghasilkan berkas audio beresolusi studio dalam waktu beberapa detik',
        'Memotong kuota karakter sesuai jumlah kata dalam naskah'
      ],
      howToUse: 'Setelah memasukkan naskah dan memilih suara, klik "Generate Speech" untuk memperdengarkan hasil suaranya.'
    },
    'player-bar': {
      title: 'Audio Player & Visualizer Bar',
      category: 'Playback Engine',
      badge: 'Audio Player',
      description: 'Bilah pemutar suara yang menampilkan gelombang frekuensi (waveform) hasil generasi audio lengkap dengan kontrol navigasi.',
      keyFeatures: [
        'Tombol Play/Pause dan Mundur/Maju 10 detik',
        'Visualisasi gelombang suara waktu nyata',
        'Tampilan durasi elapsed time / total duration'
      ],
      howToUse: 'Gunakan pemutar audio ini untuk mendengarkan hasil generasi vokal dan memeriksa kejernihan intonasi.'
    },
    'player-share': {
      title: 'Share Audio Link',
      category: 'Distribution',
      badge: 'Public Link',
      description: 'Fitur pembuat tautan publik untuk membagikan berkas audio buatan Anda kepada rekan tim Maxy Academy atau audiens tanpa perlu mengunduh file.',
      keyFeatures: [
        'Salin tautan singkat langsung ke clipboard',
        'Dukungan pratinjau audio terintegrasi di media sosial',
        'Akses cepat untuk review instruktur atau klien'
      ],
      howToUse: 'Klik tombol "Share" untuk menyalin tautan pembagian audio secara instan.'
    },
    'player-download': {
      title: 'Download Audio File (MP3 / WAV)',
      category: 'Export',
      badge: 'High Quality',
      description: 'Tombol pengunduhan berkas audio hasil generasi ke penyimpanan lokal perangkat Anda dalam format populer.',
      keyFeatures: [
        'Ekspor berkas MP3 192kbps untuk kebutuhan web dan media sosial',
        'Ekspor berkas WAV mentah tanpa kompresi untuk kebutuhan audio editing profesional',
        'Dukungan penyertaan file transkrip berformat SRT/VTT'
      ],
      howToUse: 'Klik ikon atau tombol "Download" untuk menyimpan file audio buatan Anda ke perangkat.'
    },
    'mobile-drawer': {
      title: 'Mobile Navigation Drawer',
      category: 'Responsive Navigation',
      badge: 'Mobile UI',
      description: 'Menu navigasi geser seluler yang merangkum seluruh alat utama ElevenLabs dalam antarmuka ramah sentuhan layar smartphone.',
      keyFeatures: [
        'Akses mudah ke seluruh section Pinned dan Workspace',
        'Desain bersih teroptimasi untuk layar kecil',
        'Sama persis dengan tata letak aplikasi seluler ElevenLabs resmi'
      ],
      howToUse: 'Tekan ikon menu tiga garis (hamburger) di sudut kanan atas pada tampilan Mobile untuk membuka atau menutup drawer ini.'
    }
  };

  const openModal = (key: string) => {
    setActiveModalKey(key);
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0a0c10] text-slate-800 dark:text-slate-100 overflow-hidden shadow-2xl font-sans">
      {/* Top Device & Simulator Header */}
      <div className="bg-[#12151e] border-b border-[#212638] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 ml-2">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            ElevenLabs Dashboard Simulator - Maxy Academy
          </span>
        </div>

        {/* View Mode Switcher: Desktop vs Mobile */}
        <div className="flex items-center bg-[#07090e] border border-[#232738] rounded-xl p-1 gap-1">
          <button
            onClick={() => {
              setViewMode('desktop');
              setIsMobileDrawerOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'desktop'
                ? 'bg-purple-600 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mobile'
                ? 'bg-purple-600 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 right-6 z-50 bg-[#1e1b2e] text-purple-200 text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-purple-500/50 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container according to View Mode */}
      {viewMode === 'desktop' ? (
        /* ================= DESKTOP VIEW ================= */
        <div className="flex min-h-[640px] bg-[#0a0c10]">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-[#0f121a] border-r border-[#1e2333] flex flex-col justify-between p-3.5 shrink-0 text-xs text-slate-600 dark:text-slate-300 select-none">
            <div className="space-y-4">
              {/* Workspace Switcher */}
              <div
                onClick={() => openModal('workspace-switcher')}
                className="flex items-center justify-between p-2 rounded-xl bg-[#161a26] border border-[#262c3f] hover:border-purple-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs shadow-md">
                    MA
                  </div>
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-slate-900 dark:text-white text-xs block truncate max-w-[120px]">
                      Maxy Academy
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono block">Pro Workspace</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:text-white" />
              </div>

              {/* Main Navigation Items */}
              <div className="space-y-1">
                <button
                  onClick={() => openModal('menu-home')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#1a1f2e] text-slate-900 dark:text-white font-semibold border border-purple-500/30 shadow-sm"
                >
                  <Home className="w-3.5 h-3.5 text-purple-400" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => openModal('menu-voices')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#151926] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Mic className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Voices</span>
                </button>

                <button
                  onClick={() => openModal('menu-studio')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#151926] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Studio</span>
                </button>

                <button
                  onClick={() => openModal('menu-flows')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#151926] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Flows</span>
                </button>

                <button
                  onClick={() => openModal('menu-templates')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#151926] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Layout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Templates</span>
                </button>

                <button
                  onClick={() => openModal('menu-assets')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#151926] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  <span>Assets</span>
                </button>
              </div>

              {/* Pinned Tools Section */}
              <div className="space-y-1 pt-2 border-t border-[#1a1f2e]">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Pinned Tools
                </div>

                <button
                  onClick={() => openModal('pinned-tts')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#151926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Text to Speech</span>
                </button>

                <button
                  onClick={() => openModal('pinned-sfx')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#151926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sound Effects</span>
                </button>

                <button
                  onClick={() => openModal('pinned-isolator')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#151926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Wand2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Voice Isolator</span>
                </button>

                <button
                  onClick={() => openModal('pinned-changer')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#151926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span>Voice Changer</span>
                </button>

                <button
                  onClick={() => openModal('pinned-music')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#151926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Music</span>
                </button>

                <button
                  onClick={() => openModal('pinned-stt')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#151926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>Speech to Text</span>
                </button>

                <button
                  onClick={() => openModal('pinned-dubbing')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#151926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dubbing</span>
                </button>

                <button
                  onClick={() => openModal('pinned-audiobooks')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#151926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                >
                  <Disc className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audiobooks</span>
                </button>
              </div>
            </div>

            {/* Bottom Sisa Quota Character Indicator */}
            <div className="pt-3 border-t border-[#1a1f2e] space-y-2">
              <div className="bg-[#141824] rounded-xl p-2.5 border border-[#21273b] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <span>Quota Characters</span>
                  <span className="text-purple-400 font-mono">
                    {remainingQuota.toLocaleString()} / {maxQuota.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0d14] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, (remainingQuota / maxQuota) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col justify-between overflow-y-auto bg-[#0a0c10]">
            {/* Top Bar Header */}
            <header className="bg-[#0f121a] border-b border-[#1e2333] px-6 py-3 flex items-center justify-between gap-4">
              {/* Search Bar */}
              <div
                onClick={() => openModal('topbar-search')}
                className="relative max-w-sm w-full cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search tools, voices, projects..."
                  readOnly
                  className="w-full bg-[#161a26] border border-[#242b3f] rounded-xl pl-9 pr-12 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none cursor-pointer"
                />
                <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-500 px-1.5 py-0.5 bg-[#0f121a] rounded border border-[#242b3f]">
                  ⌘K
                </span>
              </div>

              {/* Action Buttons & Profile */}
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <button
                  onClick={() => openModal('topbar-feedback')}
                  className="px-2.5 py-1 bg-[#161a26] hover:bg-[#202638] rounded-lg border border-[#242b3f] transition-colors"
                >
                  Feedback
                </button>

                <button
                  onClick={() => openModal('topbar-docs')}
                  className="px-2.5 py-1 bg-[#161a26] hover:bg-[#202638] rounded-lg border border-[#242b3f] transition-colors"
                >
                  Docs
                </button>

                <button
                  onClick={() => openModal('topbar-ask')}
                  className="flex items-center gap-1 px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg border border-purple-500/40 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Ask</span>
                </button>

                <button
                  onClick={() => openModal('topbar-notifications')}
                  className="p-1.5 bg-[#161a26] hover:bg-[#202638] rounded-lg border border-[#242b3f] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>

                {/* Profile */}
                <div
                  onClick={() => openModal('topbar-profile')}
                  className="flex items-center gap-2 pl-2 border-l border-[#21273b] cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs shadow-md">
                    M
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight group-hover:text-purple-300">
                      Maxy Academy
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-mono">Pro Plan</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Dashboard Main Workspace Area */}
            <div className="p-6 space-y-6 flex-1">
              {/* Tool Navigation Tabs Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1b2030] text-xs font-semibold">
                {[
                  { id: 'speech', label: 'Speech', icon: Volume2 },
                  { id: 'image', label: 'Image', icon: ImageIcon },
                  { id: 'video', label: 'Video', icon: Video },
                  { id: 'sfx', label: 'Sound Effects', icon: Sparkles },
                  { id: 'music', label: 'Music', icon: Music },
                  { id: 'voice-changer', label: 'Voice Changer', icon: Radio },
                  { id: 'isolator', label: 'Voice Isolator', icon: Wand2 },
                  { id: 'upscale', label: 'Upscale', icon: Zap },
                ].map((tool) => {
                  const ToolIcon = tool.icon;
                  const isActive = activeTab === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveTab(tool.id);
                        showToast(`Mode dialihkan ke ${tool.label}`);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/50 font-bold shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#141824]'
                      }`}
                    >
                      <ToolIcon className="w-3.5 h-3.5" />
                      <span>{tool.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Content Panel for Active Tab */}
              {renderActiveTabContent()}
            </div>

            {/* Bottom Footer Credits */}
            <footer className="bg-[#0f121a] border-t border-[#1e2333] px-6 py-2.5 text-center text-[11px] text-slate-500">
              ElevenLabs AI Voice Generator Simulator • Maxy Academy Software Engineering & AI Course
            </footer>
          </main>
        </div>
      ) : (
        /* ================= MOBILE VIEW ================= */
        <div className="relative min-h-[640px] bg-[#080a0e] text-slate-800 dark:text-slate-100 p-4 space-y-4 max-w-sm mx-auto border-x border-[#1a1e2d] shadow-2xl">
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2030]">
            <div
              onClick={() => openModal('workspace-switcher')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-slate-900 dark:text-white text-xs">
                MA
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                Maxy Academy
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal('topbar-notifications')}
                className="p-1.5 bg-[#161a26] border border-[#242b3f] rounded-xl text-slate-600 dark:text-slate-300"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(true);
                  openModal('mobile-drawer');
                }}
                className="p-1.5 bg-[#161a26] border border-[#242b3f] rounded-xl text-slate-600 dark:text-slate-300"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tool Navigation Tabs Bar Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#1b2030] text-[11px] font-semibold">
            {[
              { id: 'speech', label: 'Speech', icon: Volume2 },
              { id: 'image', label: 'Image', icon: ImageIcon },
              { id: 'video', label: 'Video', icon: Video },
              { id: 'sfx', label: 'SFX', icon: Sparkles },
              { id: 'music', label: 'Music', icon: Music },
              { id: 'voice-changer', label: 'Changer', icon: Radio },
              { id: 'isolator', label: 'Isolator', icon: Wand2 },
              { id: 'upscale', label: 'Upscale', icon: Zap },
            ].map((tool) => {
              const ToolIcon = tool.icon;
              const isActive = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTab(tool.id);
                    showToast(`Mode dialihkan ke ${tool.label}`);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/50 font-bold shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-[#141824]'
                  }`}
                >
                  <ToolIcon className="w-3 h-3" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Panel Mobile */}
          {renderActiveTabContent()}

          {/* Mobile Drawer Slide-over */}
          {isMobileDrawerOpen && (
            <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md p-4 space-y-4 animate-in fade-in duration-150 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#21273b] pb-2">
                  <span className="font-extrabold text-purple-400 text-sm">
                    ElevenLabs Mobile Drawer
                  </span>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 rounded-lg bg-[#181d2c] text-slate-600 dark:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      openModal('menu-home');
                    }}
                    className="w-full text-left py-2 px-3 bg-[#181d2c] rounded-xl text-slate-900 dark:text-white font-semibold"
                  >
                    🏠 Home
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      openModal('pinned-tts');
                    }}
                    className="w-full text-left py-2 px-3 hover:bg-[#141826] rounded-xl text-slate-600 dark:text-slate-300"
                  >
                    🎙️ Text to Speech
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      openModal('pinned-sfx');
                    }}
                    className="w-full text-left py-2 px-3 hover:bg-[#141826] rounded-xl text-slate-600 dark:text-slate-300"
                  >
                    ✨ Sound Effects
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      openModal('pinned-isolator');
                    }}
                    className="w-full text-left py-2 px-3 hover:bg-[#141826] rounded-xl text-slate-600 dark:text-slate-300"
                  >
                    🪄 Voice Isolator
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-2 bg-[#1d2235] text-slate-600 dark:text-slate-300 text-xs rounded-xl font-bold"
              >
                Tutup Menu
              </button>
            </div>
          )}
        </div>
      )}

      {/* DETAILED EXPLANATION MODAL POPUP */}
      {activeModalKey && infoDictionary[activeModalKey] && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111420] border border-purple-500/50 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#21273b] pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  {infoDictionary[activeModalKey].category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {infoDictionary[activeModalKey].title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalKey(null)}
                className="p-1.5 rounded-full bg-[#1c2235] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge */}
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {infoDictionary[activeModalKey].badge}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {infoDictionary[activeModalKey].description}
            </p>

            {/* Key Features */}
            <div className="space-y-1.5 bg-[#090b12] rounded-2xl p-3 border border-[#1b2033]">
              <span className="text-[11px] font-bold text-purple-300 block">
                Fitur & Keunggulan Utama:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                {infoDictionary[activeModalKey].keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to use */}
            <div className="space-y-1 bg-[#181d2e] rounded-2xl p-3 border border-[#28314e]">
              <span className="text-[11px] font-bold text-amber-300 block">
                Cara Penggunaan:
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed">
                {infoDictionary[activeModalKey].howToUse}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveModalKey(null)}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
