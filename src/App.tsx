import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { MODULES_DATA } from './data/modulesData';
import { UserProgress, CapstoneSubmission, UserTier } from './types';
import { Header } from './components/Header';
import { LearningPathRoadmap } from './components/LearningPathRoadmap';
import { ModuleView } from './components/ModuleView';
import { StreakModal } from './components/StreakModal';
import { Achievements } from './components/Achievements';
import { AllNotesModal } from './components/AllNotesModal';
import { UpgradeModal } from './components/UpgradeModal';
import { PaymentInvoiceModal } from './components/PaymentInvoiceModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { DevPanel } from './components/DevPanel';

// Lazy-load heavy modals — only downloaded when user opens them
const CertificateModal = React.lazy(() => import('./components/CertificateModal').then(m => ({ default: m.CertificateModal })));
const CapstoneModal = React.lazy(() => import('./components/CapstoneModal').then(m => ({ default: m.CapstoneModal })));
const UserProfileModal = React.lazy(() => import('./components/UserProfileModal').then(m => ({ default: m.UserProfileModal })));

import { useTierAccess } from './hooks/useTierAccess';
import { BADGES_LIST } from './lib/achievementsData';
import { FloatingXpNotification, FloatingXpItem } from './components/FloatingXpNotification';
import { getLocalDateString, getDaysDifference, isCertificateEligible } from './lib/gamification';
import { Compass, Sparkles, Clock, Lock, Award, X } from 'lucide-react';
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
    let parsed: Partial<UserProgress> = {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        parsed = JSON.parse(saved);
        delete (parsed as any).userTier;
        delete (parsed as any).tier;
        delete (parsed as any).maxAllowedModuleId;
        delete (parsed as any).paidTiers;
        delete (parsed as any).hasTier1;
        delete (parsed as any).hasTier2;
        delete (parsed as any).packageName;
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }

    const cachedName = localStorage.getItem('maxy_user_name');
    const cachedEmail = localStorage.getItem('maxy_user_email');
    const cachedTier = (localStorage.getItem('maxy_user_tier') as UserTier) || undefined;
    const cachedHasTier1 = localStorage.getItem('maxy_has_tier1') === 'true';
    const cachedHasTier2 = localStorage.getItem('maxy_has_tier2') === 'true';
    const cachedPackageName = localStorage.getItem('maxy_package_name') || undefined;

    const resolvedTier = (cachedTier === 'tier1' || cachedTier === 'tier2') ? cachedTier : 'free';
    const resolvedMaxAllowed = resolvedTier === 'tier2' ? 29 : (resolvedTier === 'tier1' ? 22 : 3);
    const resolvedHasTier1 = resolvedTier === 'tier1' || resolvedTier === 'tier2';
    const resolvedHasTier2 = resolvedTier === 'tier2';
    const resolvedPaidTiers = resolvedTier === 'tier2' ? ['tier1', 'tier2'] : (resolvedTier === 'tier1' ? ['tier1'] : []);

    return {
      ...defaultProgress,
      ...parsed,
      completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
      openedChests: Array.isArray(parsed.openedChests) ? parsed.openedChests : [],
      completedCheckpoints: Array.isArray(parsed.completedCheckpoints) ? parsed.completedCheckpoints : [],
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
      moduleScores: parsed.moduleScores || {},
      xp: Number(parsed.xp) || 0,
      streakDays: Number(parsed.streakDays) || 1,
      currentModuleId: Number(parsed.currentModuleId) || 1,
      userTier: resolvedTier,
      tier: resolvedTier,
      maxAllowedModuleId: resolvedMaxAllowed,
      paidTiers: resolvedPaidTiers as UserTier[],
      hasTier1: resolvedHasTier1,
      hasTier2: resolvedHasTier2,
      userName: cachedName || parsed.userName || undefined,
      userEmail: cachedEmail || parsed.userEmail || undefined,
      userPhone: parsed.userPhone || parsed.certPhone || undefined,
      userInstitution: parsed.userInstitution || parsed.certInstitution || undefined,
      packageName: cachedPackageName || undefined,
      capstoneTitle: parsed.capstoneTitle || parsed.capstoneSubmission?.title || undefined,
      capstoneUrl: parsed.capstoneUrl || parsed.capstoneSubmission?.capstoneUrl || undefined,
      capstoneStatus: parsed.capstoneStatus || (parsed.capstoneSubmission ? 'submitted' : undefined),
      capstoneScore: parsed.capstoneScore,
      capstoneNotes: parsed.capstoneNotes,
      capstoneSubmission: parsed.capstoneSubmission,
      assignedMentorName: parsed.assignedMentorName,
      assignedMentorId: parsed.assignedMentorId,
    };
  });

  const { canAccessModule } = useTierAccess(progress.userTier, progress.maxAllowedModuleId, progress.isExpired);

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
  const [expiredModalOpen, setExpiredModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [activeInvoiceOrderId, setActiveInvoiceOrderId] = useState<string | null>(null);
  const [isCloudProgressLoaded, setIsCloudProgressLoaded] = useState<boolean>(false);
  const [isAuthValidating, setIsAuthValidating] = useState<boolean>(() => {
    if (isLocalDevEnv) return false;
    return true;
  });
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [paymentLoadingTier, setPaymentLoadingTier] = useState<'tier1' | 'tier2' | null>(null);
  const [cmsPackages, setCmsPackages] = useState<Record<string, { price: number; fake_price: number; name?: string }>>({});
  // State untuk verifikasi pembayaran setelah kembali dari Xendit
  const [isVerifyingPayment, setIsVerifyingPayment] = useState<boolean>(false);
  const [paymentVerifyStatus, setPaymentVerifyStatus] = useState<'success' | 'cancelled' | 'timeout' | null>(null);
  const [selectedCertType, setSelectedCertType] = useState<'capstone' | 'completion'>('capstone');
  const [userProfileModalOpen, setUserProfileModalOpen] = useState<boolean>(false);
  const [milestoneModalState, setMilestoneModalState] = useState<{ isOpen: boolean; tierCompleted: 'tier1' | 'tier2' }>({
    isOpen: false,
    tierCompleted: 'tier1',
  });

  // Trigger Onboarding Profile Modal ONLY IF user has missing details (e.g. Google OAuth login missing phone/institution)
  // AND has NOT already completed/dismissed it
  useEffect(() => {
    if (!isAuthValidating && isCloudProgressLoaded) {
      const isMissingInfo = !progress.userPhone || !progress.userInstitution || !progress.userName || !progress.userEmail;
      if (isMissingInfo && !progress.hasDismissedOnboarding) {
        const timer = setTimeout(() => {
          setUserProfileModalOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [
    isAuthValidating,
    isCloudProgressLoaded,
    progress.userPhone,
    progress.userInstitution,
    progress.userName,
    progress.userEmail,
    progress.hasDismissedOnboarding,
  ]);


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
                  isExpired: sub?.is_expired || false,
                  expiredAt: sub?.expired_at || null,
                  expiredDays: sub?.expired_days || null,
                  assignedMentorId: sub?.assigned_mentor_id || prev.assignedMentorId || null,
                  assignedMentorName: sub?.assigned_mentor_name || prev.assignedMentorName || null,
                  mentorAssignedAt: sub?.mentor_assigned_at || prev.mentorAssignedAt || null,
                  capstoneTitle: sub?.capstone_title || prev.capstoneTitle || null,
                  capstoneUrl: sub?.capstone_url || prev.capstoneUrl || null,
                  capstoneStatus: sub?.capstone_status || prev.capstoneStatus || null,
                  capstoneNotes: sub?.capstone_notes || prev.capstoneNotes || null,
                  capstoneAssignedByMentor: sub?.capstone_assigned_by_mentor || prev.capstoneAssignedByMentor || null,
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

  // Deteksi redirect dari landing-navigator: ?upgrade=true&tier=tier1|tier2&voucher=XXXX
  const [upgradePrefilledVoucher, setUpgradePrefilledVoucher] = useState<string>('');
  const [upgradePrefilledTier, setUpgradePrefilledTier] = useState<'tier1' | 'tier2' | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const upgradeParam = urlParams.get('upgrade');
    const tierParam = urlParams.get('tier');
    const voucherParam = urlParams.get('voucher');

    if (upgradeParam === 'true') {
      // Bersihkan query params
      window.history.replaceState({}, document.title, window.location.pathname);

      if (tierParam === 'tier1' || tierParam === 'tier2') {
        setUpgradePrefilledTier(tierParam);
      }
      if (voucherParam) {
        setUpgradePrefilledVoucher(voucherParam);
      }
      // Buka UpgradeModal setelah auth selesai (delay kecil supaya token sudah terbaca)
      setTimeout(() => setUpgradeModalOpen(true), 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('ai_navigator_theme_v1');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark'; // Default to dark theme for consistent, futuristic aesthetic
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_navigator_theme_v1', theme);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Auth Guard: Sync user profile & active tier subscription from API Gateway api.maxy.academy
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const token = tokenFromUrl || localStorage.getItem('maxy_access_token');

    const getLandingUrl = () => {
      return 'https://ainavigator.maxy.academy?login=true';
    };

    const redirectToLogin = () => {
      if (!isLocalDevEnv) {
        localStorage.removeItem('maxy_access_token');
        localStorage.removeItem('maxy_refresh_token');
        setIsAuthValidating(false);
        window.location.href = getLandingUrl();
      } else {
        setIsAuthValidating(false);
      }
    };

    if (!token) {
      if (!isLocalDevEnv) {
        redirectToLogin();
        return;
      }
      setIsCloudProgressLoaded(true);
      setIsAuthValidating(false);
      return;
    }

    if (tokenFromUrl) {
      localStorage.setItem('maxy_access_token', tokenFromUrl);
    }

    // Safety fallback: jika API lambat/502/overload, render dari cache setelah 1.5s (ada cache) atau 2.5s (fresh login)
    // API fetchWithAuth sudah di-set timeout 3s, sehingga ini hanya backup jika Promise.all tidak resolve
    const hasCachedData = Boolean(localStorage.getItem(STORAGE_KEY));
    const safetyDelayMs = hasCachedData ? 1500 : 2500;
    const safetyTimeout = setTimeout(() => {
      setIsCloudProgressLoaded(true);
      setIsAuthValidating((prev) => {
        if (prev) {
          console.warn('Auth validation timeout safety triggered — rendering app with cached progress.');
        }
        return false;
      });
    }, safetyDelayMs);

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

          const prevCachedEmail = localStorage.getItem('maxy_user_email');
          const isDifferentUser = Boolean(prevCachedEmail && user?.email && prevCachedEmail.toLowerCase() !== user.email.toLowerCase());
          if (isDifferentUser) {
            try {
              localStorage.removeItem(STORAGE_KEY);
            } catch (_) {}
          }

          const resolvedName = user?.name || user?.nickname || user?.email || undefined;
          const resolvedEmail = user?.email || undefined;
          const resolvedPkgName = sub?.package_name || undefined;

          if (resolvedName) localStorage.setItem('maxy_user_name', resolvedName);
          if (resolvedEmail) localStorage.setItem('maxy_user_email', resolvedEmail);
          
          if (userTier !== 'free') {
            localStorage.setItem('maxy_user_tier', userTier);
            localStorage.setItem('maxy_has_tier1', hasTier1 ? 'true' : 'false');
            localStorage.setItem('maxy_has_tier2', hasTier2 ? 'true' : 'false');
            if (resolvedPkgName) localStorage.setItem('maxy_package_name', resolvedPkgName);
          } else {
            localStorage.setItem('maxy_user_tier', 'free');
            localStorage.setItem('maxy_has_tier1', 'false');
            localStorage.setItem('maxy_has_tier2', 'false');
            localStorage.removeItem('maxy_package_name');
          }

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
            const basePrev = isDifferentUser ? defaultProgress : prev;
            if (!cloudData) {
              return {
                ...defaultProgress,
                ...basePrev,
                userTier,
                tier: userTier,
                maxAllowedModuleId: maxAllowed,
                paidTiers,
                hasTier1,
                hasTier2,
                userName: user?.name || basePrev.userName || undefined,
                userEmail: user?.email || basePrev.userEmail || undefined,
                packageName: sub?.package_name || prev.packageName || undefined,
                subscriptionExpiredAt: sub?.expired_at || null,
                isExpired: sub?.is_expired || false,
                expiredAt: sub?.expired_at || null,
                expiredDays: sub?.expired_days || null,
                assignedMentorId: sub?.assigned_mentor_id || prev.assignedMentorId || null,
                assignedMentorName: sub?.assigned_mentor_name || prev.assignedMentorName || null,
                mentorAssignedAt: sub?.mentor_assigned_at || prev.mentorAssignedAt || null,
                capstoneTitle: sub?.capstone_title || prev.capstoneTitle || null,
                capstoneUrl: sub?.capstone_url || prev.capstoneUrl || null,
                capstoneStatus: sub?.capstone_status || prev.capstoneStatus || null,
                capstoneScore: sub?.capstone_score !== undefined ? sub.capstone_score : (prev.capstoneScore ?? null),
                capstoneNotes: sub?.capstone_notes || prev.capstoneNotes || null,
                capstoneReviewedAt: sub?.capstone_reviewed_at || prev.capstoneReviewedAt || null,
                capstoneAssignedByMentor: sub?.capstone_assigned_by_mentor || prev.capstoneAssignedByMentor || null,
                capstoneAssignedAt: sub?.capstone_assigned_at || prev.capstoneAssignedAt || null,
              };
            }

            const cloudModules = Array.isArray(cloudData.completedModules) ? cloudData.completedModules : [];
            const localModules = Array.isArray(prev.completedModules) ? prev.completedModules : [];
            
            // If admin explicitly overrode progress in CMS, respect cloudModules. Otherwise, do union with localModules so progress is never lost on refresh!
            const mergedCompletedModules = cloudData.adminOverrideAt
              ? cloudModules
              : Array.from(new Set([...localModules, ...cloudModules]));

            const mergedUnlockedBadges = Array.from(
              new Set([...(cloudData.unlockedBadges || []), ...(prev.unlockedBadges || [])])
            );
            const mergedOpenedChests = Array.from(
              new Set([...(cloudData.openedChests || []), ...(prev.openedChests || [])])
            );
            const mergedCompletedCheckpoints = Array.from(
              new Set([...(cloudData.completedCheckpoints || []), ...(prev.completedCheckpoints || [])])
            );
            const mergedModuleScores = { ...(prev.moduleScores || {}) };
            if (cloudData.moduleScores && typeof cloudData.moduleScores === 'object') {
              Object.entries(cloudData.moduleScores).forEach(([modId, score]) => {
                mergedModuleScores[modId] = Math.max(mergedModuleScores[modId] || 0, Number(score) || 0);
              });
            }

            const mergedXp = Math.max(Number(cloudData.xp) || 0, Number(prev.xp) || 0);
            const mergedStreakDays = Math.max(Number(cloudData.streakDays) || 1, Number(prev.streakDays) || 1);
            const mergedCurrentModuleId = Math.max(Number(cloudData.currentModuleId) || 1, Number(prev.currentModuleId) || 1);

            try {
              const cleanToStore = {
                completedModules: mergedCompletedModules,
                unlockedBadges: mergedUnlockedBadges,
                completedCheckpoints: mergedCompletedCheckpoints,
                openedChests: mergedOpenedChests,
                moduleScores: mergedModuleScores,
                xp: mergedXp,
                streakDays: mergedStreakDays,
                currentModuleId: mergedCurrentModuleId,
                certName: cloudData?.certName || user?.name || undefined,
                certEmail: cloudData?.certEmail || user?.email || undefined,
                certPhone: cloudData?.certPhone || user?.phone || undefined,
                certInstitution: cloudData?.certInstitution || user?.university || undefined,
                userPhone: cloudData?.userPhone || user?.phone || undefined,
                userInstitution: cloudData?.userInstitution || user?.university || undefined,
                capstoneTitle: sub?.capstone_title || cloudData?.capstoneTitle || (cloudData as any)?.capstoneSubmission?.title || prev.capstoneTitle || prev.capstoneSubmission?.title || undefined,
                capstoneUrl: sub?.capstone_url || cloudData?.capstoneUrl || (cloudData as any)?.capstoneSubmission?.capstoneUrl || prev.capstoneUrl || prev.capstoneSubmission?.capstoneUrl || undefined,
                capstoneStatus: sub?.capstone_status || cloudData?.capstoneStatus || prev.capstoneStatus || undefined,
                capstoneScore: sub?.capstone_score !== undefined ? sub.capstone_score : (cloudData?.capstoneScore ?? prev.capstoneScore ?? undefined),
                capstoneNotes: sub?.capstone_notes || cloudData?.capstoneNotes || prev.capstoneNotes || undefined,
                capstoneSubmission: cloudData?.capstoneSubmission || prev.capstoneSubmission || undefined,
                assignedMentorName: sub?.assigned_mentor_name || prev.assignedMentorName || undefined,
                assignedMentorId: sub?.assigned_mentor_id || prev.assignedMentorId || undefined,
              };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanToStore));
            } catch (_) {}

            return {
              ...defaultProgress,
              ...prev,
              ...cloudData,
              completedModules: mergedCompletedModules,
              unlockedBadges: mergedUnlockedBadges,
              completedCheckpoints: mergedCompletedCheckpoints,
              openedChests: mergedOpenedChests,
              moduleScores: mergedModuleScores,
              xp: mergedXp,
              streakDays: mergedStreakDays,
              currentModuleId: mergedCurrentModuleId,
              certName: cloudData?.certName || user?.name || (isDifferentUser ? undefined : prev.certName),
              certEmail: cloudData?.certEmail || user?.email || (isDifferentUser ? undefined : prev.certEmail),
              certPhone: cloudData?.certPhone || (isDifferentUser ? undefined : prev.certPhone) || user?.phone || undefined,
              certInstitution: cloudData?.certInstitution || (isDifferentUser ? undefined : prev.certInstitution) || user?.university || undefined,
              userTier,
              tier: userTier,
              maxAllowedModuleId: maxAllowed,
              paidTiers,
              hasTier1,
              hasTier2,
              userName: user?.name || cloudData?.userName || (isDifferentUser ? undefined : prev.userName),
              userEmail: user?.email || cloudData?.userEmail || (isDifferentUser ? undefined : prev.userEmail),
              userPhone: user?.phone || cloudData?.userPhone || (isDifferentUser ? undefined : prev.userPhone),
              userInstitution: user?.university || cloudData?.userInstitution || (isDifferentUser ? undefined : prev.userInstitution),
              packageName: sub?.package_name || prev.packageName || undefined,
              subscriptionExpiredAt: sub?.expired_at || null,
              isExpired: sub?.is_expired || false,
              expiredAt: sub?.expired_at || null,
              expiredDays: sub?.expired_days || null,
              assignedMentorId: cloudData?.assignedMentorId || sub?.assigned_mentor_id || prev.assignedMentorId || null,
              assignedMentorName: cloudData?.assignedMentorName || sub?.assigned_mentor_name || prev.assignedMentorName || null,
              mentorAssignedAt: cloudData?.mentorAssignedAt || sub?.mentor_assigned_at || prev.mentorAssignedAt || null,
              capstoneTitle: sub?.capstone_title || cloudData?.capstoneTitle || (cloudData as any)?.capstoneSubmission?.title || prev.capstoneTitle || prev.capstoneSubmission?.title || null,
              capstoneUrl: sub?.capstone_url || cloudData?.capstoneUrl || (cloudData as any)?.capstoneSubmission?.capstoneUrl || prev.capstoneUrl || prev.capstoneSubmission?.capstoneUrl || null,
              capstoneStatus: sub?.capstone_status || cloudData?.capstoneStatus || prev.capstoneStatus || null,
              capstoneScore: (sub?.capstone_score !== undefined && sub?.capstone_score !== null) ? sub.capstone_score : (cloudData?.capstoneScore !== undefined ? cloudData.capstoneScore : (prev.capstoneScore ?? null)),
              capstoneNotes: sub?.capstone_notes || cloudData?.capstoneNotes || prev.capstoneNotes || null,
              capstoneReviewedAt: sub?.capstone_reviewed_at || cloudData?.capstoneReviewedAt || prev.capstoneReviewedAt || null,
              capstoneAssignedByMentor: sub?.capstone_assigned_by_mentor || cloudData?.capstoneAssignedByMentor || prev.capstoneAssignedByMentor || null,
              capstoneAssignedAt: sub?.capstone_assigned_at || cloudData?.capstoneAssignedAt || prev.capstoneAssignedAt || null,
            };
          });

          setIsCloudProgressLoaded(true);
          setIsAuthValidating(false);
        } else {
          redirectToLogin();
        }
      })
      .catch((err) => {
        clearTimeout(safetyTimeout);
        console.warn('Network or server error during auth validation, using cached local progress:', err);
        setIsCloudProgressLoaded(true);
        setIsAuthValidating(false);
      });
  }, []);

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('maxy_access_token') : null;

    // Protection: Never overwrite localStorage with empty progress while cloud data is still loading
    if (token && !isCloudProgressLoaded && (!progress.completedModules || progress.completedModules.length === 0)) {
      return;
    }

    try {
      const cleanLocal = { ...progress } as Record<string, unknown>;
      delete cleanLocal.userTier;
      delete cleanLocal.tier;
      delete cleanLocal.maxAllowedModuleId;
      delete cleanLocal.paidTiers;
      delete cleanLocal.hasTier1;
      delete cleanLocal.hasTier2;
      delete cleanLocal.packageName;
      delete cleanLocal.subscriptionExpiredAt;
      delete cleanLocal.userName;
      delete cleanLocal.userEmail;

      // Protection against race condition: don't overwrite non-empty storage with empty state during initialization
      const existingSaved = localStorage.getItem(STORAGE_KEY);
      if (existingSaved && (!progress.completedModules || progress.completedModules.length === 0) && (progress.xp === 0 || !progress.xp)) {
        try {
          const parsed = JSON.parse(existingSaved);
          if (parsed && Array.isArray(parsed.completedModules) && parsed.completedModules.length > 0) {
            cleanLocal.completedModules = parsed.completedModules;
            cleanLocal.xp = parsed.xp || cleanLocal.xp;
            cleanLocal.moduleScores = parsed.moduleScores || cleanLocal.moduleScores;
            cleanLocal.unlockedBadges = parsed.unlockedBadges || cleanLocal.unlockedBadges;
          }
        } catch (_) {}
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanLocal));
    } catch (e: unknown) {
      const err = e as { name?: string; code?: number };
      if (err?.name === 'QuotaExceededError' || err?.code === 22) {
        try {
          // Prune older extraneous cache keys
          const keysToPrune = ['notion_ai_state', 'ai_navigator_flashcards_confidence_v1', 'ai_navigator_opened_chests'];
          keysToPrune.forEach(k => localStorage.removeItem(k));
          
          // Save essential only
          const essential = {
            completedModules: progress.completedModules,
            currentModuleId: progress.currentModuleId,
            moduleScores: progress.moduleScores,
            xp: progress.xp,
            streakDays: progress.streakDays,
            unlockedBadges: progress.unlockedBadges,
            hasSeenCertPopup: progress.hasSeenCertPopup,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(essential));
        } catch (_) {
          // Ignore fallback storage error
        }
      }
    }

    if (!token || !isCloudProgressLoaded) return;

    const timer = setTimeout(() => {
      saveCloudProgress(token, progress as unknown as Record<string, unknown>);
    }, 2000);

    return () => clearTimeout(timer);
  }, [progress, isAuthValidating, isCloudProgressLoaded]);

  // Handle module selection from roadmap
  const handleSelectModule = useCallback((moduleId: number) => {
    if (progress.isExpired && progress.userTier !== 'free') {
      setExpiredModalOpen(true);
      return;
    }
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
  }, [progress.isExpired, progress.userTier, canAccessModule]);

  const handleIncrementRevisit = useCallback((moduleId: number) => {
    setProgress((prev) => ({
      ...prev,
      moduleRevisits: {
        ...(prev.moduleRevisits || {}),
        [moduleId]: ((prev.moduleRevisits || {})[moduleId] || 0) + 1,
      },
    }));
  }, []);

  // Handle General XP Awarding (e.g. from Learning Tips, Daily Challenges)
  const handleAwardXp = useCallback((amount: number, label: string) => {
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
  }, []);

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
    if (!isAlreadyCompleted) {
      if (moduleId === 22 || newCompleted.length === 22) {
        setTimeout(() => {
          setMilestoneModalState({ isOpen: true, tierCompleted: 'tier1' });
        }, 500);
      } else if (moduleId === 29 || newCompleted.length === 29) {
        setTimeout(() => {
          setMilestoneModalState({ isOpen: true, tierCompleted: 'tier2' });
        }, 500);
      }
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

  // Handle Tier Upgrade Selection via Payment API Checkout (Xendit Invoice or Free Voucher Giveaway)
  const handleUpgradeTier = async (selectedTier: 'tier1' | 'tier2', voucherCode?: string, customAmount?: number) => {
    setIsPaymentLoading(true);
    setPaymentLoadingTier(selectedTier);

    try {
      const res = await checkoutUpgrade(selectedTier, customAmount, voucherCode);
      const dataObj = res?.data?.data || res?.data || res;
      const invoiceUrl =
        dataObj?.payment_url ||
        dataObj?.invoice_url ||
        res?.payment_url ||
        res?.invoice_url;

      // Check if order was activated directly for free (100% Discount / Giveaway Voucher)
      const isPaidDirectly =
        dataObj?.status === 'paid' ||
        dataObj?.is_giveaway ||
        res?.status === 'paid' ||
        res?.is_giveaway ||
        (dataObj?.amount === 0 && (res?.success || res?.status === 200));

      if (isPaidDirectly) {
        setUpgradeModalOpen(false);
        setPaymentVerifyStatus('success');

        // Immediate profile refetch to update tier & module access in React state
        const token = localStorage.getItem('maxy_access_token');
        if (token) {
          fetchUserProfile(token).then((profileRes) => {
            if (profileRes?.success && profileRes?.data) {
              const sub = profileRes.data.subscription;
              const user = profileRes.data.user;
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
            }
          });
        }

        try {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#f59e0b', '#6366f1', '#10b981'] });
        } catch (_) { /* ignore */ }

        setTimeout(() => setPaymentVerifyStatus(null), 8000);
        return;
      }

      if (invoiceUrl) {
        window.location.href = invoiceUrl;
        return;
      }

      alert(res?.message || res?.error || 'Gagal membuat halaman pembayaran. Silakan coba lagi.');
    } catch (err) {
      console.error('Payment checkout error:', err);
      alert('Terjadi kesalahan saat memproses transaksi.');
    } finally {
      setIsPaymentLoading(false);
      setPaymentLoadingTier(null);
    }
  };

  // Handle Capstone Submission
  const handleSubmitCapstone = useCallback((submission: CapstoneSubmission) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        capstoneSubmission: submission,
        capstoneTitle: submission.title,
        certTitle: submission.title,
        capstoneUrl: submission.capstoneUrl,
        capstoneStatus: prev.capstoneStatus === 'approved' ? 'approved' : 'submitted',
        capstoneAssignedAt: submission.submittedAt,
        certName: submission.name,
        certEmail: submission.email,
        certRequested: true,
      };
      const token = localStorage.getItem('maxy_access_token');
      if (token) {
        saveCloudProgress(token, next as unknown as Record<string, unknown>).catch(() => {});
      }
      return next;
    });
    setCapstoneModalOpen(false);
    addFloatingXp(500, 'Capstone Project Berhasil Disimpan!', 'xp_graduation');
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#6366f1', '#10b981', '#ec4899'],
      });
    }, 150);
  }, []);

  const handleSaveCertDetails = useCallback((
    name: string,
    email: string,
    phone?: string,
    institution?: string,
    certUuid?: string,
    certNumber?: string
  ) => {
    setProgress((prev) => {
      if (
        prev.userName === name &&
        prev.userEmail === email &&
        (!phone || prev.userPhone === phone) &&
        (!institution || prev.userInstitution === institution) &&
        (!certUuid || (prev as any).certUuid === certUuid) &&
        (!certNumber || (prev as any).certNumber === certNumber) &&
        prev.certRequested
      ) {
        return prev;
      }

      const next = {
        ...prev,
        certName: name,
        certEmail: email,
        userName: name,
        userEmail: email,
        userPhone: phone || prev.userPhone || prev.certPhone || undefined,
        userInstitution: institution || prev.userInstitution || prev.certInstitution || undefined,
        certPhone: phone || prev.certPhone || undefined,
        certInstitution: institution || prev.certInstitution || undefined,
        certRequested: true,
        certUuid: certUuid || (prev as any).certUuid || undefined,
        certNumber: certNumber || (prev as any).certNumber || undefined,
      };
      const token = localStorage.getItem('maxy_access_token');
      if (token) {
        saveCloudProgress(token, next as unknown as Record<string, unknown>).catch((err) =>
          console.error('Failed to sync cert details to cloud:', err)
        );
      }
      return next;
    });
  }, []);

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

  const handleOpenCertificateSection = useCallback(() => {
    setActiveTab('path');
    setSelectedModuleId(null);
    setTimeout(() => {
      const certElem = document.getElementById('certificate-section');
      if (certElem) {
        certElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        certElem.classList.add('ring-4', 'ring-amber-400', 'transition-all');
        setTimeout(() => {
          certElem.classList.remove('ring-4', 'ring-amber-400');
        }, 2500);
      }
    }, 120);
  }, []);

  const handleOpenStreakModal = useCallback(() => setStreakModalOpen(true), []);
  const handleCloseStreakModal = useCallback(() => setStreakModalOpen(false), []);

  const handleOpenAchievements = useCallback(() => setAchievementsOpen(true), []);
  const handleCloseAchievements = useCallback(() => setAchievementsOpen(false), []);

  const handleOpenNotes = useCallback(() => setAllNotesOpen(true), []);
  const handleCloseNotes = useCallback(() => setAllNotesOpen(false), []);

  const handleOpenUpgradeModal = useCallback((targetId?: number) => {
    if (targetId !== undefined) setTargetUpgradeModuleId(targetId || null);
    setUpgradeModalOpen(true);
  }, []);
  const handleCloseUpgradeModal = useCallback(() => {
    setUpgradeModalOpen(false);
    setUpgradePrefilledVoucher('');
    setUpgradePrefilledTier(null);
  }, []);

  const handleOpenCapstoneModal = useCallback(() => setCapstoneModalOpen(true), []);
  const handleCloseCapstoneModal = useCallback(() => setCapstoneModalOpen(false), []);

  const handleOpenInvoiceModal = useCallback(() => setInvoiceModalOpen(true), []);
  const handleCloseInvoiceModal = useCallback(() => setInvoiceModalOpen(false), []);

  const handleOpenUserProfile = useCallback(() => setUserProfileModalOpen(true), []);
  const handleCloseUserProfile = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      hasDismissedOnboarding: true,
    }));
    setUserProfileModalOpen(false);
  }, []);

  const handleSelectTab = useCallback((tab: 'path') => {
    setActiveTab(tab);
    if (tab === 'path') {
      setSelectedModuleId(null);
    }
  }, []);

  const handleBackToPath = useCallback(() => {
    setActiveTab('path');
    setSelectedModuleId(null);
  }, []);

  const handleSearchChange = useCallback((q: string) => setSearchQuery(q), []);

  const handleOpenCertificateModal = useCallback((certType?: 'capstone' | 'completion') => {
    if (certType) setSelectedCertType(certType);
    setCertificateOpen(true);
  }, []);
  const handleCloseCertificateModal = useCallback(() => setCertificateOpen(false), []);

  const handleCloseMilestoneModal = useCallback(() => {
    setMilestoneModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);
  const handleOpenCertificateFromMilestone = useCallback(() => {
    setMilestoneModalState((prev) => ({ ...prev, isOpen: false }));
    setCertificateOpen(true);
  }, []);

  const handleSaveProfile = useCallback((data: { name: string; email: string; phone: string; institution: string }) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        userName: data.name,
        userEmail: data.email,
        userPhone: data.phone,
        userInstitution: data.institution,
        hasDismissedOnboarding: true,
      };
      const token = localStorage.getItem('maxy_access_token');
      if (token) {
        saveCloudProgress(token, next as unknown as Record<string, unknown>).catch(() => {});
      }
      return next;
    });
    setUserProfileModalOpen(false);
  }, []);

  const handleOpenChest = useCallback((chestId: number, xpReward: number, chestTitle: string) => {
    setProgress((prev) => {
      const alreadyOpened = (prev.openedChests || []).includes(chestId);
      if (alreadyOpened) return prev;
      const nextOpened = [...(prev.openedChests || []), chestId];
      const nextXp = prev.xp + xpReward;
      const next = {
        ...prev,
        openedChests: nextOpened,
        xp: nextXp,
      };
      const token = localStorage.getItem('maxy_access_token');
      if (token) {
        saveCloudProgress(token, next as unknown as Record<string, unknown>).catch(() => {});
      }
      return next;
    });
    addFloatingXp(xpReward, `Peti: ${chestTitle}`, 'xp_milestone');
  }, []);

  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isFreshTokenLogin = Boolean(urlParams?.get('token'));
  const hasCachedModules = Boolean(progress.completedModules && progress.completedModules.length > 0);
  const isInitialLoading = isFreshTokenLogin 
    ? !isCloudProgressLoaded 
    : (!hasCachedModules && (!isCloudProgressLoaded || isAuthValidating));

  if (isInitialLoading) {
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
          <span>Memuat Sesi &amp; Peta Belajar AI Navigator...</span>
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
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onLogout={handleLogout}
        onOpenCertificate={handleOpenCertificateSection}
        onOpenStreakModal={handleOpenStreakModal}
        onOpenAchievements={handleOpenAchievements}
        onOpenNotes={handleOpenNotes}
        onOpenUpgradeModal={handleOpenUpgradeModal}
        onOpenCapstoneModal={handleOpenCapstoneModal}
        onOpenInvoice={handleOpenInvoiceModal}
        onOpenUserProfile={handleOpenUserProfile}
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
            onSearchChange={handleSearchChange}
            onOpenStreakModal={handleOpenStreakModal}
            onOpenAchievements={handleOpenAchievements}
            onAwardXp={handleAwardXp}
            onOpenChest={handleOpenChest}
            onOpenUpgradeModal={handleOpenUpgradeModal}
            onOpenCapstoneModal={handleOpenCapstoneModal}
            onOpenCertificateModal={handleOpenCertificateModal}
          />
        )}

        {activeTab === 'module' && currentModule && (
          <ModuleView
            module={currentModule}
            progress={progress}
            onBackToPath={handleBackToPath}
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
        onClose={handleCloseUpgradeModal}
        currentTier={progress.userTier || 'free'}
        onSelectTier={handleUpgradeTier}
        targetModuleId={targetUpgradeModuleId}
        isLoading={isPaymentLoading}
        loadingTier={paymentLoadingTier}
        packages={cmsPackages}
        prefilledVoucher={upgradePrefilledVoucher}
        prefilledTier={upgradePrefilledTier}
      />

      {/* Capstone Project Submission Modal */}
      <Suspense fallback={null}>
        <CapstoneModal
          isOpen={capstoneModalOpen}
          onClose={handleCloseCapstoneModal}
          progress={progress}
          onSubmit={handleSubmitCapstone}
          onSubmitCapstone={handleSubmitCapstone}
          initialName={progress.certName || ''}
          initialEmail={progress.certEmail || ''}
        />
      </Suspense>

      {/* Certificate Modal */}
      <Suspense fallback={null}>
        <CertificateModal
          isOpen={certificateOpen}
          onClose={handleCloseCertificateModal}
          progress={progress}
          certType={selectedCertType}
          onSaveCertDetails={handleSaveCertDetails}
          onOpenCapstone={handleOpenCapstoneModal}
          packages={cmsPackages}
        />
      </Suspense>

      {/* Onboarding User Profile Modal (For Google OAuth or incomplete profiles) */}
      <Suspense fallback={null}>
        <UserProfileModal
          isOpen={userProfileModalOpen}
          onClose={handleCloseUserProfile}
          progress={progress}
          onSaveProfile={handleSaveProfile}
        />
      </Suspense>

      {/* Milestone Celebration Modal */}
      <MilestoneCelebrationModal
        isOpen={milestoneModalState.isOpen}
        onClose={handleCloseMilestoneModal}
        tierCompleted={milestoneModalState.tierCompleted}
        onOpenCertificate={handleOpenCertificateFromMilestone}
      />

      {/* Streak & Gamification Modal */}
      <StreakModal
        isOpen={streakModalOpen}
        onClose={handleCloseStreakModal}
        progress={progress}
        totalModulesCount={MODULES_DATA.length}
      />

      {/* Achievements & Badges Modal */}
      <Achievements
        isModal
        isOpen={achievementsOpen}
        onClose={handleCloseAchievements}
        progress={progress}
        totalModulesCount={MODULES_DATA.length}
      />

      {/* All Notes Collection Modal */}
      <AllNotesModal
        isOpen={allNotesOpen}
        onClose={handleCloseNotes}
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

      {/* Expiration Lock Modal (Masa Aktif 6 Bulan Berakhir) */}
      {expiredModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="relative bg-white dark:bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900 dark:text-white text-center">
            <button
              onClick={() => setExpiredModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold inline-block">
                Masa Akses Modul Selesai (6 Bulan)
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Akses Modul Telah Berakhir</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                Masa akses aktif 6 bulan untuk membuka dan mengulang modul interaktif telah berakhir. Namun, seluruh sertifikat dan transkrip kelulusan resmi Anda tetap aktif dan dapat dicetak/diunduh kapan saja!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-left">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Status Akses:</span>
                <span className="text-amber-500 uppercase">{progress.userTier === 'tier2' ? 'Tier 2 VIP Master (Expired)' : 'Tier 1 Basic (Expired)'}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Akses Sertifikat &amp; Transkrip:</span>
                <span className="text-emerald-400 font-bold">Aktif Seumur Hidup</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setExpiredModalOpen(false);
                  setCertificateOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Buka &amp; Download Sertifikat Kelulusan</span>
              </button>

              <button
                onClick={() => {
                  setExpiredModalOpen(false);
                  setUpgradeModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                Perpanjang Masa Akses / Upgrade Paket
              </button>
            </div>
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
    </div>
  );
}
