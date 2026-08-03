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
import { PaymentInvoiceModal } from './components/PaymentInvoiceModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { DevPanel } from './components/DevPanel';
import { useTierAccess } from './hooks/useTierAccess';
import { BADGES_LIST } from './lib/achievementsData';
import { FloatingXpNotification, FloatingXpItem } from './components/FloatingXpNotification';
import { getLocalDateString, getDaysDifference, isCertificateEligible } from './lib/gamification';
import { Compass, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

import { fetchUserProfile, checkoutUpgrade, loadCloudProgress, saveCloudProgress, fetchAiNavigatorPackages, verifyPaymentOrder } from './services/api';

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

const isLocalDevEnv = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.') ||
  window.location.hostname.startsWith('10.')
);

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed.userTier;
        delete parsed.tier;
        delete parsed.maxAllowedModuleId;
        delete parsed.packageName;
        delete parsed.subscriptionExpiredAt;
        delete parsed.userName;
        delete parsed.userEmail;
        return {
          ...defaultProgress,
          ...parsed,
          userTier: isLocalDevEnv ? 'tier2' : 'free',
          tier: isLocalDevEnv ? 'tier2' : 'free',
          maxAllowedModuleId: isLocalDevEnv ? 29 : 3,
          paidTiers: isLocalDevEnv ? ['tier1', 'tier2'] : [],
          hasTier1: isLocalDevEnv,
          hasTier2: isLocalDevEnv,
          userName: isLocalDevEnv ? 'Local Developer' : undefined,
          userEmail: isLocalDevEnv ? 'dev@localhost' : undefined,
          packageName: isLocalDevEnv ? 'Local Dev — VIP Access' : undefined,
        };
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }
    return {
      ...defaultProgress,
      userTier: isLocalDevEnv ? 'tier2' : 'free',
      tier: isLocalDevEnv ? 'tier2' : 'free',
      maxAllowedModuleId: isLocalDevEnv ? 29 : 3,
      paidTiers: isLocalDevEnv ? ['tier1', 'tier2'] : [],
      hasTier1: isLocalDevEnv,
      hasTier2: isLocalDevEnv,
      userName: isLocalDevEnv ? 'Local Developer' : undefined,
      userEmail: isLocalDevEnv ? 'dev@localhost' : undefined,
      packageName: isLocalDevEnv ? 'Local Dev — VIP Access' : undefined,
    };
  });

  const { canAccessModule } = useTierAccess(progress.userTier, progress.maxAllowedModuleId);

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
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [activeInvoiceOrderId, setActiveInvoiceOrderId] = useState<string | null>(null);
  const [isAuthValidating, setIsAuthValidating] = useState<boolean>(() => !isLocalDevEnv);
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [paymentLoadingTier, setPaymentLoadingTier] = useState<'tier1' | 'tier2' | null>(null);
  const [cmsPackages, setCmsPackages] = useState<Record<string, { price: number; fake_price: number; name?: string }>>({});
  // State untuk verifikasi pembayaran setelah kembali dari Xendit
  const [isVerifyingPayment, setIsVerifyingPayment] = useState<boolean>(false);
  const [paymentVerifyStatus, setPaymentVerifyStatus] = useState<'success' | 'cancelled' | 'timeout' | null>(null);
  const [milestoneModalState, setMilestoneModalState] = useState<{ isOpen: boolean; tierCompleted: 'tier1' | 'tier2' }>({
    isOpen: false,
    tierCompleted: 'tier1',
  });


  useEffect(() => {
    fetchAiNavigatorPackages().then((res) => {
      if (res.success && res.data) {
        setCmsPackages(res.data);
      }
    });
  }, []);

  // Deteksi return dari halaman Xendit — verifikasi status pembayaran sebelum update tier
  useEffect(() => {
    if (isLocalDevEnv) return; // Skip di local dev

    const urlParams = new URLSearchParams(window.location.search);
    const paymentParam = urlParams.get('payment');
    const orderId = urlParams.get('order_id');

    // Bersihkan query params dari URL tanpa reload halaman
    const cleanUrl = window.location.pathname;
    if (paymentParam) {
      window.history.replaceState({}, document.title, cleanUrl);
    }

    if (paymentParam === 'cancelled') {
      // User balik tanpa bayar — tampilkan notifikasi singkat, tidak ubah tier
      setPaymentVerifyStatus('cancelled');
      setTimeout(() => setPaymentVerifyStatus(null), 5000);
      return;
    }

    if (paymentParam === 'success' && orderId) {
      // User balik setelah bayar — mulai polling untuk konfirmasi pembayaran dari webhook Xendit
      setActiveInvoiceOrderId(orderId);
      setIsVerifyingPayment(true);

      const MAX_POLLS = 5;
      const POLL_INTERVAL_MS = 2500;
      let pollCount = 0;

      const pollStatus = async () => {
        pollCount++;
        const result = await verifyPaymentOrder(orderId);

        if (result.isPaid) {
          // Pembayaran dikonfirmasi — refresh user profile untuk update tier
          setIsVerifyingPayment(false);
          setPaymentVerifyStatus('success');

          const token = localStorage.getItem('maxy_access_token');
          if (token) {
            // Re-fetch profile agar tier ter-update dari backend
            fetchUserProfile(token).then((res) => {
              if (res.success && res.data) {
                const sub = res.data.subscription;
                const user = res.data.user;
                const rawTier = sub?.active_tier || sub?.tier || (sub?.is_paid ? 'tier1' : 'free');
                const userTier: UserProgress['userTier'] = (rawTier === 'tier_2' || rawTier === 'tier2') ? 'tier2' : (rawTier === 'tier_1' || rawTier === 'tier1') ? 'tier1' : 'free';
                const maxAllowed = sub?.max_allowed_module_id || (userTier === 'tier2' ? 29 : userTier === 'tier1' ? 22 : 3);
                const paidTiers: UserProgress['paidTiers'] = sub?.paid_tiers ? (sub.paid_tiers.map((t: string) => (t === 'tier_2' ? 'tier2' : t === 'tier_1' ? 'tier1' : t))) : (userTier !== 'free' ? [userTier] : []);
                const hasTier1 = Boolean(sub?.has_tier1 || paidTiers.includes('tier1'));
                const hasTier2 = Boolean(sub?.has_tier2 || paidTiers.includes('tier2'));

                setProgress((prev) => ({
                  ...prev,
                  userTier,
                  tier: userTier,
                  maxAllowedModuleId: maxAllowed,
                  paidTiers,
                  hasTier1,
                  hasTier2,
                  userName: user?.name || prev.userName,
                  userEmail: user?.email || prev.userEmail,
                  packageName: sub?.package_name || prev.packageName,
                  subscriptionExpiredAt: sub?.expired_at || null,
                }));

                // Konfetti celebrasi pembayaran berhasil
                try {
                  confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#f59e0b', '#6366f1', '#10b981'] });
                } catch (_) { /* ignore */ }
              }
            });
          }

          setTimeout(() => setPaymentVerifyStatus(null), 8000);
          return;
        }

        if (pollCount < MAX_POLLS) {
          // Coba lagi setelah interval — webhook mungkin belum tiba
          setTimeout(pollStatus, POLL_INTERVAL_MS);
        } else {
          // Habis polling — belum ada konfirmasi, minta user untuk refresh manual
          setIsVerifyingPayment(false);
          setPaymentVerifyStatus('timeout');
          setTimeout(() => setPaymentVerifyStatus(null), 15000);
        }
      };

      // Mulai polling pertama setelah 1.5 detik (beri waktu webhook tiba)
      setTimeout(pollStatus, 1500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      localStorage.setItem('ai_navigator_theme_v1', 'dark');
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, [theme]);

  // Auth Guard: Sync user profile & active tier subscription from API Gateway api.maxy.academy
  useEffect(() => {
    if (isLocalDevEnv) {
      localStorage.removeItem('maxy_access_token');
      localStorage.removeItem('maxy_refresh_token');
      setIsAuthValidating(false);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const token = tokenFromUrl || localStorage.getItem('maxy_access_token');

    const getLandingUrl = () => {
      return 'https://ainavigator.maxy.academy?login=true';
    };

    const redirectToLogin = () => {
      localStorage.removeItem('maxy_access_token');
      localStorage.removeItem('maxy_refresh_token');
      setIsAuthValidating(false);
      window.location.href = getLandingUrl();
    };

    if (!token) {
      redirectToLogin();
      return;
    }

    if (tokenFromUrl) {
      localStorage.setItem('maxy_access_token', tokenFromUrl);
    }

    // Safety fallback: pastikan loading overlay "Memverifikasi Sesi" paling lambat hilang dalam 3 detik jika API lambat
    const safetyTimeout = setTimeout(() => {
      setIsAuthValidating((prev) => {
        if (prev) {
          console.warn('Auth validation timeout safety triggered — rendering app with cached progress.');
        }
        return false;
      });
    }, 3000);

    Promise.all([
      fetchUserProfile(token),
      loadCloudProgress(token).catch((err) => {
        console.warn('loadCloudProgress failed, using local progress:', err);
        return null;
      }),
    ])
      .then(([res, cloudDataRaw]) => {
        clearTimeout(safetyTimeout);
        if (res && res.success && res.data) {
          const sub = res.data.subscription;
          const user = res.data.user;
          const rawTier = sub?.active_tier || sub?.tier || (sub?.is_paid ? 'tier1' : 'free');
          const userTier: UserProgress['userTier'] = (rawTier === 'tier_2' || rawTier === 'tier2') ? 'tier2' : (rawTier === 'tier_1' || rawTier === 'tier1') ? 'tier1' : 'free';
          const maxAllowed = sub?.max_allowed_module_id || (userTier === 'tier2' ? 29 : userTier === 'tier1' ? 22 : 3);
          const paidTiers: UserProgress['paidTiers'] = sub?.paid_tiers ? (sub.paid_tiers.map((t: string) => (t === 'tier_2' ? 'tier2' : t === 'tier_1' ? 'tier1' : t))) : (userTier !== 'free' ? [userTier] : []);
          const hasTier1 = Boolean(sub?.has_tier1 || paidTiers.includes('tier1'));
          const hasTier2 = Boolean(sub?.has_tier2 || paidTiers.includes('tier2'));

          const cloudData = cloudDataRaw ? { ...(cloudDataRaw as unknown as UserProgress) } : null;
          if (cloudData) {
            delete (cloudData as Record<string, unknown>).userTier;
            delete (cloudData as Record<string, unknown>).tier;
            delete (cloudData as Record<string, unknown>).maxAllowedModuleId;
            delete (cloudData as Record<string, unknown>).paidTiers;
            delete (cloudData as Record<string, unknown>).hasTier1;
            delete (cloudData as Record<string, unknown>).hasTier2;
            delete (cloudData as Record<string, unknown>).packageName;
            delete (cloudData as Record<string, unknown>).subscriptionExpiredAt;
          }

          setProgress((prev) => {
            if (!cloudData) {
              return {
                ...defaultProgress,
                ...prev,
                userTier,
                tier: userTier,
                maxAllowedModuleId: maxAllowed,
                paidTiers,
                hasTier1,
                hasTier2,
                userName: user?.name || prev.userName || undefined,
                userEmail: user?.email || prev.userEmail || undefined,
                packageName: sub?.package_name || prev.packageName || undefined,
                subscriptionExpiredAt: sub?.expired_at || null,
              };
            }

            const cloudModules = cloudData.completedModules !== undefined ? cloudData.completedModules : (prev.completedModules || []);
            const mergedCompletedModules = (cloudData.adminOverrideAt || cloudData.completedModules !== undefined)
              ? cloudModules
              : Array.from(new Set([...(prev.completedModules || []), ...cloudModules]));

            const mergedUnlockedBadges = Array.from(
              new Set([...(cloudData.unlockedBadges || []), ...(prev.unlockedBadges || [])])
            );
            const mergedCompletedCheckpoints = Array.from(
              new Set([...(cloudData.completedCheckpoints || []), ...(prev.completedCheckpoints || [])])
            );
            const mergedModuleScores = { ...(prev.moduleScores || {}), ...(cloudData.moduleScores || {}) };

            const mergedXp = cloudData.xp !== undefined ? cloudData.xp : (prev.xp || 0);
            const mergedStreakDays = cloudData.streakDays !== undefined ? cloudData.streakDays : (prev.streakDays || 1);
            const mergedCurrentModuleId = cloudData.currentModuleId || prev.currentModuleId || 1;

            return {
              ...defaultProgress,
              ...prev,
              ...cloudData,
              completedModules: mergedCompletedModules,
              unlockedBadges: mergedUnlockedBadges,
              completedCheckpoints: mergedCompletedCheckpoints,
              moduleScores: mergedModuleScores,
              xp: mergedXp,
              streakDays: mergedStreakDays,
              currentModuleId: mergedCurrentModuleId,
              certName: cloudData.certName || prev.certName || user?.name || undefined,
              certEmail: cloudData.certEmail || prev.certEmail || user?.email || undefined,
              userTier,
              tier: userTier,
              maxAllowedModuleId: maxAllowed,
              paidTiers,
              hasTier1,
              hasTier2,
              userName: user?.name || prev.userName || undefined,
              userEmail: user?.email || prev.userEmail || undefined,
              packageName: sub?.package_name || prev.packageName || undefined,
              subscriptionExpiredAt: sub?.expired_at || null,
            };
          });

          setIsAuthValidating(false);
        } else {
          redirectToLogin();
        }
      })
      .catch((err) => {
        clearTimeout(safetyTimeout);
        console.warn('Network or server error during auth validation, using cached local progress:', err);
        setIsAuthValidating(false);
      });
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    localStorage.removeItem('maxy_access_token');
    localStorage.removeItem('maxy_refresh_token');
    localStorage.removeItem(STORAGE_KEY);
    const isLocalDev = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.')
    );
    if (isLocalDev) {
      window.location.reload();
      return;
    }
    const target = 'https://ainavigator.maxy.academy';
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

  // Check and trigger certificate popup automatically if 100% completed
  useEffect(() => {
    if (isCertificateEligible(progress) && !progress.hasSeenCertPopup) {
      const timer = setTimeout(() => {
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#f59e0b', '#fbbf24', '#fcd34d'], // Gold confetti
          });
        } catch (e) {
          // ignore
        }
        setCertificateOpen(true);
        setProgress((prev) => ({ ...prev, hasSeenCertPopup: true }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [progress.completedModules, progress.userTier, progress.hasSeenCertPopup]);

  // Save progress to local storage & sync to cloud database (debounced 2s)
  useEffect(() => {
    try {
      const cleanLocal = { ...progress } as Record<string, unknown>;
      delete cleanLocal.userTier;
      delete cleanLocal.tier;
      delete cleanLocal.maxAllowedModuleId;
      delete cleanLocal.packageName;
      delete cleanLocal.subscriptionExpiredAt;
      delete cleanLocal.userName;
      delete cleanLocal.userEmail;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanLocal));
    } catch (e) {
      console.error('Failed to save progress', e);
    }

    if (isAuthValidating) return;
    const token = localStorage.getItem('maxy_access_token');
    if (!token) return;

    const timer = setTimeout(() => {
      saveCloudProgress(token, progress as unknown as Record<string, unknown>);
    }, 2000);

    return () => clearTimeout(timer);
  }, [progress, isAuthValidating]);

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

    // Milestone Celebration Check (Tier 1: Module 22, Tier 2: Module 29)
    if (moduleId === 22 || newCompleted.length === 22) {
      setTimeout(() => {
        setMilestoneModalState({ isOpen: true, tierCompleted: 'tier1' });
      }, 500);
    } else if (moduleId === 29 || newCompleted.length === 29) {
      setTimeout(() => {
        setMilestoneModalState({ isOpen: true, tierCompleted: 'tier2' });
      }, 500);
    }
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

  // Handle Tier Upgrade Selection via Payment API Checkout (Xendit Invoice)
  const handleUpgradeTier = async (selectedTier: 'tier1' | 'tier2') => {
    setIsPaymentLoading(true);
    setPaymentLoadingTier(selectedTier);

    try {
      const res = await checkoutUpgrade(selectedTier);
      const invoiceUrl =
        res?.data?.payment_url ||
        res?.data?.invoice_url ||
        res?.data?.data?.payment_url ||
        res?.data?.data?.invoice_url ||
        res?.payment_url ||
        res?.invoice_url;

      if (invoiceUrl) {
        window.location.href = invoiceUrl;
        return;
      }

      alert(res?.message || res?.error || 'Gagal membuat halaman pembayaran. Silakan coba lagi.');
    } catch (err) {
      console.error('Payment checkout error:', err);
      alert('Terjadi kesalahan saat menghubungkan ke payment gateway.');
    } finally {
      setIsPaymentLoading(false);
      setPaymentLoadingTier(null);
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
    const userTier = progress.userTier || 'free';
    const maxModuleForTier = userTier === 'tier2' ? 29 : 22;
    
    if (selectedModuleId < MODULES_DATA.length) {
      const nextId = selectedModuleId + 1;
      setSelectedModuleId(nextId);
      setProgress((prev) => ({
        ...prev,
        currentModuleId: nextId,
        activeSection: 'overview',
      }));
    }
    
    // Check if user just completed all modules for their tier
    const completedCount = progress.completedModules.length;
    if (completedCount >= maxModuleForTier) {
      setActiveTab('path');
      if (userTier === 'tier2' && !progress.capstoneSubmission) {
        // Tier 2: Must submit capstone first
        setCapstoneModalOpen(true);
      } else {
        // Tier 1 or Tier 2 with capstone already submitted
        setCertificateOpen(true);
      }
    }
  };

  // Data Management
  const handleManualSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    const token = localStorage.getItem('maxy_access_token');
    if (token) {
      saveCloudProgress(token, progress as unknown as Record<string, unknown>);
    }
    alert('Progres berhasil disimpan ke memori lokal & cloud!');
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(progress, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Format nama file: ainavigator-progress-NamaUser-YYYY-MM-DD.json
    const safeName = progress.userName ? progress.userName.replace(/[^a-zA-Z0-9]/g, '_') + '-' : '';
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `ainavigator-progress-${safeName}${dateStr}.json`;
    
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && typeof json === 'object') {
          // Simple validation
          setProgress((prev) => ({ ...prev, ...json }));
          alert('Data berhasil di-import! Progres telah diperbarui.');
        } else {
          alert('Format file tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan file valid.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const currentModule = MODULES_DATA.find((m) => m.id === selectedModuleId);
  // Sertifikat hanya aktif jika user 100% menyelesaikan seluruh modul (Tier 1: Modul 1-22, Tier 2: Modul 1-29)
  const allModulesCompleted = isCertificateEligible(progress);

  if (isAuthValidating) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans ${
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-100 dark:bg-slate-950 text-white'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-[#ffb034]/20 border border-[#ffb034]/40 flex items-center justify-center mb-4 animate-pulse shadow-lg shadow-[#ffb034]/10">
          <Sparkles className="w-6 h-6 text-[#ffb034]" />
        </div>
        <div className={`flex items-center gap-2.5 text-xs font-bold ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-600 dark:text-slate-300'
        }`}>
          <span className="w-4 h-4 border-2 border-[#ffb034] border-t-transparent rounded-full animate-spin" />
          <span>Memverifikasi Sesi AI Navigator...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'light' ? 'bg-slate-100/80 text-slate-900' : 'bg-[#070b14] text-slate-100'
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
        onLogout={handleLogout}
        onOpenCertificate={() => setCertificateOpen(true)}
        onOpenStreakModal={() => setStreakModalOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenNotes={() => setAllNotesOpen(true)}
        onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
        onOpenCapstoneModal={() => setCapstoneModalOpen(true)}
        onOpenInvoice={() => setInvoiceModalOpen(true)}
        allModulesCompleted={allModulesCompleted}
        onManualSave={handleManualSave}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
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
        isLoading={isPaymentLoading}
        loadingTier={paymentLoadingTier}
        packages={cmsPackages}
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
        packages={cmsPackages}
      />

      {/* Milestone Celebration Modal */}
      <MilestoneCelebrationModal
        isOpen={milestoneModalState.isOpen}
        onClose={() => setMilestoneModalState((prev) => ({ ...prev, isOpen: false }))}
        tierCompleted={milestoneModalState.tierCompleted}
        onOpenCertificate={() => {
          setMilestoneModalState((prev) => ({ ...prev, isOpen: false }));
          setCertificateOpen(true);
        }}
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

      {/* ── Payment Verification Overlays ── */}

      {/* Loading Screen: Memverifikasi pembayaran setelah redirect dari Xendit */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 text-white">
          <div className="w-16 h-16 rounded-full border-4 border-amber-400/30 border-t-amber-400 animate-spin" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-white">Memverifikasi Pembayaran...</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              Mohon tunggu sebentar, kami sedang mengkonfirmasi pembayaran Anda dengan Xendit.
            </p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400/40 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Payment Invoice Modal */}
      <PaymentInvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        orderId={activeInvoiceOrderId}
        userName={progress.userName}
        userEmail={progress.userEmail}
      />

      {/* Toast: Pembayaran berhasil dikonfirmasi */}
      {paymentVerifyStatus === 'success' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[201] animate-fadeIn">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-900/50 max-w-md">
            <span className="text-2xl">🎉</span>
            <div className="flex-1">
              <p className="font-black text-sm">Pembayaran Berhasil Dikonfirmasi!</p>
              <p className="text-xs text-emerald-100 mt-0.5">Akses modul Anda sudah aktif. Selamat belajar!</p>
            </div>
            <button
              onClick={() => setInvoiceModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs hover:bg-emerald-100 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
            >
              Lihat Invoice
            </button>
          </div>
        </div>
      )}

      {/* Toast: Pembayaran dibatalkan */}
      {paymentVerifyStatus === 'cancelled' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[201] animate-fadeIn">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-700 text-white shadow-2xl max-w-sm">
            <span className="text-2xl">↩️</span>
            <div>
              <p className="font-black text-sm">Pembayaran Dibatalkan</p>
              <p className="text-xs text-slate-300 mt-0.5">Anda dapat memilih tier kapan saja dari menu upgrade.</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast: Timeout — webhook belum tiba */}
      {paymentVerifyStatus === 'timeout' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[201] animate-fadeIn">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-amber-600 text-white shadow-2xl shadow-amber-900/50 max-w-sm">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-black text-sm">Pembayaran Masih Diproses</p>
              <p className="text-xs text-amber-100 mt-0.5">
                Konfirmasi sedang dikirim oleh Xendit. Silakan refresh halaman dalam 1-2 menit, atau hubungi support jika belum aktif.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <img
              src="https://cms.maxy.academy/uploads/LogoMaxy.png"
              alt="Maxy Academy Logo"
              className="h-6 w-auto object-contain"
            />
            <span className="font-bold text-slate-700 dark:text-slate-200">AI Navigator</span>
            <span>— Platform Pembelajaran LLM Interaktif Maxy Academy</span>
          </div>

        </div>
      </footer>
      {/* Local Dev Menu */}
      {isLocalDevEnv && (
        <DevPanel progress={progress} setProgress={setProgress} />
      )}
    </div>
  );
}
