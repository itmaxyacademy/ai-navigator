import { UserTier } from '../types';

export function useTierAccess(
  userTier: UserTier = 'free',
  maxAllowedModuleId?: number,
  isExpired: boolean = false
) {
  const effectiveMaxModule = maxAllowedModuleId || (
    userTier === 'tier2' ? 29 : userTier === 'tier1' ? 22 : 3
  );

  /**
   * Checks if a given module is accessible based on the user's tier & expiration.
   * - If expired (for paid tiers): modules cannot be rewatched/accessed.
   * - Free Trial: Modules 1 to 3
   * - Tier 1: Modules 1 to 22
   * - Tier 2 VIP: Modules 1 to 29 (All Modules)
   */
  const canAccessModule = (moduleId: number): boolean => {
    if (isExpired && userTier !== 'free') {
      return false;
    }
    return moduleId <= effectiveMaxModule;
  };

  /**
   * Helper function that checks access for a module.
   * If expired or locked for current tier, triggers the appropriate callback and returns false.
   * Returns true if accessible.
   */
  const checkAndAccessModule = (
    moduleId: number,
    onUpgradeNeeded?: (targetModuleId: number) => void,
    onExpiredNotice?: () => void
  ): boolean => {
    if (isExpired && userTier !== 'free') {
      if (onExpiredNotice) {
        onExpiredNotice();
      } else if (onUpgradeNeeded) {
        onUpgradeNeeded(moduleId);
      }
      return false;
    }
    if (canAccessModule(moduleId)) {
      return true;
    }
    if (onUpgradeNeeded) {
      onUpgradeNeeded(moduleId);
    }
    return false;
  };

  return {
    userTier,
    effectiveMaxModule,
    isExpired,
    isFree: userTier === 'free',
    isTier1: userTier === 'tier1',
    isTier2: userTier === 'tier2',
    hasFullAccess: userTier === 'tier2' && !isExpired,
    canAccessModule,
    checkAndAccessModule,
  };
}

