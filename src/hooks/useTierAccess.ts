import { UserTier } from '../types';

export function useTierAccess(userTier: UserTier = 'free') {
  /**
   * Checks if a given module is accessible based on the user's tier.
   * - Modules 1 & 2 are accessible to everyone (Free Trial).
   * - Modules 3 through 29 require Tier 1 or Tier 2 membership.
   */
  const canAccessModule = (moduleId: number): boolean => {
    if (moduleId <= 2) return true;
    return userTier === 'tier1' || userTier === 'tier2';
  };

  /**
   * Helper function that checks access for a module.
   * If locked for Free Trial, triggers the upgrade modal callback and returns false.
   * Returns true if accessible.
   */
  const checkAndAccessModule = (
    moduleId: number,
    onUpgradeNeeded?: (targetModuleId: number) => void
  ): boolean => {
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
    isFree: userTier === 'free',
    isTier1: userTier === 'tier1',
    isTier2: userTier === 'tier2',
    hasFullAccess: userTier === 'tier1' || userTier === 'tier2',
    canAccessModule,
    checkAndAccessModule,
  };
}
