import React, { useState, useEffect } from 'react';
import { MODULES_DATA } from './data/modulesData';
import { UserProgress, CapstoneSubmission } from './types';
import { Header } from './components/Header';
import { LearningPathRoadmap } from './components/LearningPathRoadmap';
import { ModuleView } from './components/ModuleView';
import { CertificateModal } from './components/CertificateModal';
import { StreakModal } from './components/StreakModal';
import { Achievements } from './components/Achievements';
import { AllNotesModal } from './components/AllNotesModal';
import { UpgradeModal } from './components/UpgradeModal';
import { CapstoneModal } from './components/CapstoneModal';
import { useTierAccess } from './hooks/useTierAccess';
import { BADGES_LIST } from './lib/achievementsData';
import { FloatingXpNotification, FloatingXpItem } from './components/FloatingXpNotification';
import { getLocalDateString, getDaysDifference } from './lib/gamification';
import { Compass, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

import { fetchUserProfile, refreshAccessToken, checkoutUpgrade } from './services/api';

const STORAGE_KEY = 'ai_navigator_user_progress_v1';

const defaultProgress: UserProgress = {
  completedModules: [],
  moduleScores: {},
  currentModuleId: 1,
  activeSection: 'overview',
  xp: 0,
  streakDays: 1,
  unlockedBadges: [],
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }
    return defaultProgress;
  });

  const { canAccessModule } = useTierAccess(progress.userTier);

  const [activeTab, setActiveTab] = useState<'path' | 'module'>('path');
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [allNotesOpen, setAllNotesOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [targetUpgradeModuleId, setTargetUpgradeModuleId] = useState<number | null>(null);
  const [capstoneModalOpen, setCapstoneModalOpen] = useState(false);
  const [isAuthValidating, setIsAuthValidating] = useState<boolean>(true);

  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('ai_navigator_theme_v1');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error('Failed to load theme preference', e);
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_navigator_theme_v1', theme);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Auth Guard: Sync user profile & active tier subscription from API Gateway api.maxy.academy
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const refreshTokenParam = urlParams.get('refresh_token');
    const token = tokenFromUrl || localStorage.getItem('maxy_access_token');

    const redirectToLogin = () => {
      localStorage.removeItem('maxy_access_token');
      localStorage.removeItem('maxy_refresh_token');
      const targetOrigin = window.location.hostname.includes('maxy.academy')
        ? 'https://navigator.maxy.academy?login=true'
        : '/?login=true';
      window.location.href = targetOrigin;
    };

    if (!token) {
      redirectToLogin();
      return;
    }

    if (tokenFromUrl) {
      localStorage.setItem('maxy_access_token', tokenFromUrl);
    }
    if (refreshTokenParam) {
      localStorage.setItem('maxy_refresh_token', refreshTokenParam);
    }

    const applySession = (res: { success: boolean; data?: { user?: { name?: string; email?: string }; subscription?: { tier?: string; is_paid?: boolean; max_allowed_module_id?: number; package_name?: string; expired_at?: string | null; expired_days?: number } } }) => {
      if (res.success && res.data) {
        const sub = res.data.subscription;
        const user = res.data.user;
        const rawTier = sub?.tier || (sub?.is_paid ? 'tier1' : 'free');
        const userTier: UserProgress['userTier'] = (rawTier === 'tier_2' || rawTier === 'tier2') ? 'tier2' : (rawTier === 'tier_1' || rawTier === 'tier1') ? 'tier1' : 'free';
        const maxAllowed = sub?.max_allowed_module_id || (userTier === 'tier2' ? 29 : userTier === 'tier1' ? 22 : 3);

        setProgress((prev) => ({
          ...prev,
          userTier,
          tier: userTier,
          maxAllowedModuleId: maxAllowed,
          userName: user?.name || prev.userName,
          userEmail: user?.email || prev.userEmail,
          packageName: sub?.package_name || (userTier === 'tier2' ? 'VIP Master' : userTier === 'tier1' ? 'AI Practitioner' : 'Free Plan'),
          subscriptionExpiredAt: sub?.expired_at ?? null,
        }));
        setIsAuthValidating(false);
        return true;
      }
      return false;
    };

    fetchUserProfile(token).then(async (res) => {
      if (!applySession(res)) {
        // Try auto-refresh before giving up
        const newToken = await refreshAccessToken();
        if (newToken) {
          const retryRes = await fetchUserProfile(newToken);
          if (!applySession(retryRes)) {
            redirectToLogin();
          }
        } else {
          redirectToLogin();
        }
      }
    });

    // Auto-refresh access token every 12 minutes (JWT_ACCESS_TTL is 15 min)
    const refreshInterval = setInterval(async () => {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        clearInterval(refreshInterval);
        redirectToLogin();
      }
    }, 12 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    localStorage.removeItem('maxy_access_token');
    localStorage.removeItem('maxy_refresh_token');
    const target = window.location.hostname.includes('maxy.academy')
      ? 'https://navigator.maxy.academy?login=true'
      : '/?login=true';
    window.location.href = target;
  };

  // Floating XP Notifications State
  const [floatingXpItems, setFloatingXpItems] = useState<FloatingXpItem[]>([]);

  const addFloatingXp = (amount: number, label: string, type: FloatingXpItem['type']) => {
    const newItem: FloatingXpItem = {
      id: `${Date.now()}-${Math.random()}`,
      amount,
      label,
      type,
    };
    setFloatingXpItems((prev) => [...prev, newItem]);
  };

  const handleDismissFloatingXp = (id: string) => {
    setFloatingXpItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Startup streak check: if last completed date is older than yesterday, reset streakDays = 1
  useEffect(() => {
    if (progress.lastCompletedDate) {
      const todayStr = getLocalDateString();
      const diff = getDaysDifference(progress.lastCompletedDate, todayStr);
      if (diff > 1 && progress.streakDays !== 1) {
        setProgress((prev) => ({
          ...prev,
          streakDays: 1,
        }));
      }
    }
  }, []);

  // Check and unlock new badges automatically when milestones are hit
  useEffect(() => {
    const currentlyUnlocked = progress.unlockedBadges || [];
    const newlyUnlockedIds: string[] = [];

    BADGES_LIST.forEach((badge) => {
      if (!currentlyUnlocked.includes(badge.id)) {
        if (badge.checkUnlocked(progress, MODULES_DATA.length)) {
          newlyUnlockedIds.push(badge.id);
        }
      }
    });

    if (newlyUnlockedIds.length > 0) {
      setProgress((prev) => ({
        ...prev,
        unlockedBadges: [...(prev.unlockedBadges || []), ...newlyUnlockedIds],
      }));

      // Trigger celebration for each newly unlocked badge
      newlyUnlockedIds.forEach((id) => {
        const badgeDef = BADGES_LIST.find((b) => b.id === id);
        if (badgeDef) {
          addFloatingXp(badgeDef.xpReward, `Lencana Terbuka: ${badgeDef.title}`, 'xp_milestone');
          try {
            confetti({
              particleCount: 65,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#a855f7', '#10b981', '#3b82f6'],
            });
          } catch (e) {
            // Ignore if confetti fails
          }
        }
      });
    }
  }, [
    progress.completedModules,
    progress.moduleScores,
    progress.streakDays,
    progress.xp,
    progress.completedCheckpoints,
    progress.dailyMinutesHistory,
  ]);

  // Save progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }, [progress]);

  // Handle module selection from roadmap
  const handleSelectModule = (moduleId: number) => {
    if (!canAccessModule(moduleId)) {
      setTargetUpgradeModuleId(moduleId);
      setUpgradeModalOpen(true);
      return;
    }
    setSelectedModuleId(moduleId);
    setProgress((prev) => ({
      ...prev,
      currentModuleId: moduleId,
      activeSection: 'overview',
      moduleRevisits: {
        ...(prev.moduleRevisits || {}),
        [moduleId]: ((prev.moduleRevisits || {})[moduleId] || 0) + 1,
      },
    }));
    setActiveTab('module');
  };

  const handleIncrementRevisit = (moduleId: number) => {
    setProgress((prev) => ({
      ...prev,
      moduleRevisits: {
        ...(prev.moduleRevisits || {}),
        [moduleId]: ((prev.moduleRevisits || {})[moduleId] || 0) + 1,
      },
    }));
  };

  // Handle General XP Awarding (e.g. from Learning Tips, Daily Challenges)
  const handleAwardXp = (amount: number, label: string) => {
    const todayStr = getLocalDateString();
    setProgress((prev) => {
      const currentHistory = prev.dailyXpHistory || {};
      const currentTodayXp = currentHistory[todayStr] || 0;
      return {
        ...prev,
        xp: prev.xp + amount,
        dailyXpHistory: {
          ...currentHistory,
          [todayStr]: currentTodayXp + amount,
        },
      };
    });
    addFloatingXp(amount, label, 'xp_new');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // Ignore
    }
  };

  // Handle Focus Timer XP awards & daily minutes update
  const handleAwardFocusXp = (minutesCompleted: number, xpReward: number) => {
    const todayStr = getLocalDateString();
    setProgress((prev) => {
      const currentMinutes = prev.dailyMinutesHistory?.[todayStr] || 0;
      return {
        ...prev,
        xp: prev.xp + xpReward,
        dailyMinutesHistory: {
          ...(prev.dailyMinutesHistory || {}),
          [todayStr]: currentMinutes + minutesCompleted,
        },
      };
    });
    addFloatingXp(xpReward, `Sesi Focus ${minutesCompleted} Min!`, 'xp_new');
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // Ignore
    }
  };

  // Handle section switching inside a module (overview, replica, prompting, quiz)
  const handleSectionChange = (section: 'overview' | 'replica' | 'prompting' | 'quiz') => {
    setProgress((prev) => ({
      ...prev,
      activeSection: section,
    }));
  };

  // Handle quiz completion with full XP & Streak calculation logic
  const handleQuizComplete = (moduleId: number, score: number) => {
    const isAlreadyCompleted = progress.completedModules.includes(moduleId);
    let addedXp = isAlreadyCompleted ? 20 : 100;

    if (isAlreadyCompleted) {
      addFloatingXp(20, 'Pengulangan Kuis Modul', 'xp_repeat');
    } else {
      addFloatingXp(100, 'Modul Selesai!', 'xp_new');
    }

    let newCompleted = progress.completedModules;
    if (!isAlreadyCompleted) {
      newCompleted = [...progress.completedModules, moduleId];

      // Milestone Check: Midpoint (+200 XP bonus)
      const midpoint = Math.floor(MODULES_DATA.length / 2);
      if (newCompleted.length === midpoint || moduleId === midpoint) {
        addedXp += 200;
        setTimeout(() => {
          addFloatingXp(200, 'Milestone Pertengahan Kurikulum!', 'xp_milestone');
        }, 400);
      }

      // Graduation Check: Final completion (+500 XP bonus)
      if (newCompleted.length === MODULES_DATA.length) {
        addedXp += 500;
        setTimeout(() => {
          addFloatingXp(500, 'Bonus Kelulusan Seluruh Modul!', 'xp_graduation');
        }, 800);
      }
    }

    // Calculate Streak & Date logic
    const todayStr = getLocalDateString();
    let newStreak = progress.streakDays || 1;

    if (!progress.lastCompletedDate) {
      newStreak = 1;
    } else {
      const diff = getDaysDifference(progress.lastCompletedDate, todayStr);
      if (diff === 1) {
        // Last completed yesterday -> increment streak
        newStreak = (progress.streakDays || 1) + 1;
      } else if (diff > 1) {
        // Missed > 1 day -> reset streak to 1
        newStreak = 1;
      } else if (diff === 0) {
        // Already completed today -> keep current streak
        newStreak = progress.streakDays || 1;
      }
    }

    setProgress((prev) => {
      const currentHistory = prev.dailyXpHistory || {};
      const currentTodayXp = currentHistory[todayStr] || 0;
      const currentMinHistory = prev.dailyMinutesHistory || {};
      const currentTodayMins = currentMinHistory[todayStr] || 0;
      const moduleEstMins = MODULES_DATA.find((m) => m.id === moduleId)?.estimatedMinutes || 10;

      return {
        ...prev,
        completedModules: newCompleted,
        moduleScores: {
          ...prev.moduleScores,
          [moduleId]: Math.max(prev.moduleScores[moduleId] || 0, score),
        },
        xp: prev.xp + addedXp,
        streakDays: newStreak,
        lastCompletedDate: todayStr,
        dailyXpHistory: {
          ...currentHistory,
          [todayStr]: currentTodayXp + addedXp,
        },
        dailyMinutesHistory: {
          ...currentMinHistory,
          [todayStr]: currentTodayMins + moduleEstMins,
        },
      };
    });
  };

  const handleUpdateGoal = (newGoalMinutes: number) => {
    setProgress((prev) => ({
      ...prev,
      dailyGoalMinutes: newGoalMinutes,
    }));
  };

  const handleAddMinutes = (extraMins: number) => {
    const todayStr = getLocalDateString();
    setProgress((prev) => {
      const currentMinHistory = prev.dailyMinutesHistory || {};
      const currentTodayMins = currentMinHistory[todayStr] || 0;
      // Cap at 180 minutes max daily to ensure fair learning progress and prevent spamming
      if (currentTodayMins >= 180) return prev;
      return {
        ...prev,
        dailyMinutesHistory: {
          ...currentMinHistory,
          [todayStr]: Math.min(180, currentTodayMins + extraMins),
        },
      };
    });
  };

  const handleCompleteCheckpoint = (checkpointId: string, xpBonus: number) => {
    const todayStr = getLocalDateString();

    setProgress((prev) => {
      const currentCheckpoints = prev.completedCheckpoints || [];
      if (currentCheckpoints.includes(checkpointId)) return prev;

      const currentHistory = prev.dailyXpHistory || {};
      const currentTodayXp = currentHistory[todayStr] || 0;

      return {
        ...prev,
        xp: prev.xp + xpBonus,
        completedCheckpoints: [...currentCheckpoints, checkpointId],
        dailyXpHistory: {
          ...currentHistory,
          [todayStr]: currentTodayXp + xpBonus,
        },
      };
    });

    addFloatingXp(xpBonus, 'Checkpoint Mid-Module', 'xp_new');
  };

  // Handle Tier Upgrade Selection
  const handleUpgradeTier = (selectedTier: 'tier1' | 'tier2') => {
    setProgress((prev) => ({
      ...prev,
      userTier: selectedTier,
    }));
    setUpgradeModalOpen(false);
    addFloatingXp(
      300,
      `Berhasil Upgrade ke ${selectedTier === 'tier1' ? 'Tier 1 Full Access' : 'Tier 2 VIP Master'}!`,
      'xp_graduation'
    );
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#6366f1', '#10b981', '#ec4899'],
      });
    } catch (e) {
      // Ignore
    }

    if (targetUpgradeModuleId) {
      handleSelectModule(targetUpgradeModuleId);
      setTargetUpgradeModuleId(null);
    }
  };

  // Handle Capstone Submission
  const handleSubmitCapstone = (submission: CapstoneSubmission) => {
    setProgress((prev) => ({
      ...prev,
      capstoneSubmission: submission,
      certName: submission.name,
      certEmail: submission.email,
      certRequested: true,
    }));
    setCapstoneModalOpen(false);
    addFloatingXp(500, 'Capstone Project Berhasil Dikirim!', 'xp_graduation');
    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#6366f1', '#10b981', '#ec4899'],
      });
    } catch (e) {
      // Ignore
    }
    setCertificateOpen(true);
  };

  const handleSaveCertDetails = (name: string, email: string) => {
    setProgress((prev) => ({
      ...prev,
      certName: name,
      certEmail: email,
      certRequested: true,
    }));
  };

  // Advance to next module from quiz
  const handleNextModule = () => {
    if (!selectedModuleId) return;
    if (selectedModuleId < MODULES_DATA.length) {
      const nextId = selectedModuleId + 1;
      setSelectedModuleId(nextId);
      setProgress((prev) => ({
        ...prev,
        currentModuleId: nextId,
        activeSection: 'overview',
      }));
    } else {
      // Completed all 29 modules! Trigger Capstone Modal first or Certificate
      setActiveTab('path');
      if (!progress.capstoneSubmission) {
        setCapstoneModalOpen(true);
      } else {
        setCertificateOpen(true);
      }
    }
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh progres belajar?')) {
      setProgress(defaultProgress);
      setSelectedModuleId(null);
      setActiveTab('path');
    }
  };

  const currentModule = MODULES_DATA.find((m) => m.id === selectedModuleId);
  const allModulesCompleted = progress.completedModules.length === MODULES_DATA.length;

  if (isAuthValidating) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-[#ffb034]/20 border border-[#ffb034]/40 flex items-center justify-center mb-4 animate-pulse shadow-lg shadow-[#ffb034]/10">
          <Sparkles className="w-6 h-6 text-[#ffb034]" />
        </div>
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-300">
          <span className="w-4 h-4 border-2 border-[#ffb034] border-t-transparent rounded-full animate-spin" />
          <span>Memverifikasi Sesi AI Navigator...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    } selection:bg-indigo-500 selection:text-white`}>
      {/* Header */}
      <Header
        progress={progress}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onUpdateGoal={handleUpdateGoal}
        onAddMinutes={handleAddMinutes}
        activeTab={activeTab === 'module' ? 'path' : activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'path') {
            setSelectedModuleId(null);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetProgress={handleResetProgress}
        onLogout={handleLogout}
        onOpenCertificate={() => setCertificateOpen(true)}
        onOpenStreakModal={() => setStreakModalOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenNotes={() => setAllNotesOpen(true)}
        onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
        onOpenCapstoneModal={() => setCapstoneModalOpen(true)}
        allModulesCompleted={allModulesCompleted}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'path' && (
          <LearningPathRoadmap
            modules={MODULES_DATA}
            progress={progress}
            onSelectModule={handleSelectModule}
            onIncrementRevisit={handleIncrementRevisit}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenStreakModal={() => setStreakModalOpen(true)}
            onOpenAchievements={() => setAchievementsOpen(true)}
            onAwardXp={handleAwardXp}
            onOpenUpgradeModal={(targetId) => {
              setTargetUpgradeModuleId(targetId || null);
              setUpgradeModalOpen(true);
            }}
            onOpenCapstoneModal={() => setCapstoneModalOpen(true)}
            onOpenCertificateModal={() => setCertificateOpen(true)}
          />
        )}

        {activeTab === 'module' && currentModule && (
          <ModuleView
            module={currentModule}
            progress={progress}
            onBackToPath={() => {
              setActiveTab('path');
              setSelectedModuleId(null);
            }}
            onSectionChange={handleSectionChange}
            onQuizComplete={handleQuizComplete}
            onNextModule={handleNextModule}
            onCompleteCheckpoint={handleCompleteCheckpoint}
            onAwardFocusXp={handleAwardFocusXp}
          />
        )}
      </main>

      {/* Upgrade Modal (Tier 1 / Tier 2) */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentTier={progress.userTier || 'free'}
        onSelectTier={handleUpgradeTier}
        targetModuleId={targetUpgradeModuleId}
      />

      {/* Capstone Project Submission Modal */}
      <CapstoneModal
        isOpen={capstoneModalOpen}
        onClose={() => setCapstoneModalOpen(false)}
        progress={progress}
        onSubmit={handleSubmitCapstone}
        onSubmitCapstone={handleSubmitCapstone}
        initialName={progress.certName || ''}
        initialEmail={progress.certEmail || ''}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
        progress={progress}
        onSaveCertDetails={handleSaveCertDetails}
      />

      {/* Streak & Gamification Modal */}
      <StreakModal
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        progress={progress}
        totalModulesCount={MODULES_DATA.length}
      />

      {/* Achievements & Badges Modal */}
      <Achievements
        isModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        progress={progress}
        totalModulesCount={MODULES_DATA.length}
      />

      {/* All Notes Collection Modal */}
      <AllNotesModal
        isOpen={allNotesOpen}
        onClose={() => setAllNotesOpen(false)}
        onSelectModule={handleSelectModule}
      />

      {/* Floating XP Animation Feedback Overlay */}
      <FloatingXpNotification
        notifications={floatingXpItems}
        onDismiss={handleDismissFloatingXp}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-200">AI Navigator</span>
            <span>— Platform Pembelajaran LLM Interaktif untuk Pemula</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Pembelajar AI Indonesia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
