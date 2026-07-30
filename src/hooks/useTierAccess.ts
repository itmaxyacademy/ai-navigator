import { UserTier } from '../types';

export function useTierAccess(userTier: UserTier = 'free', maxAllowedModuleId?: number) {
  const effectiveMaxModule = maxAllowedModuleId || (
    userTier === 'tier2' ? 29 : userTier === 'tier1' ? 22 : 3
  );

  /**
   * Checks if a given module is accessible based on the user's tier.
   * - Free Trial: Modules 1 to 3
   * - Tier 1: Modules 1 to 22
   * - Tier 2 VIP: Modules 1 to 29 (All Modules)
   */
  const canAccessModule = (moduleId: number): boolean => {
    return moduleId <= effectiveMaxModule;
  };

  /**
   * Helper function that checks access for a module.
   * If locked for current tier, triggers the upgrade modal callback and returns false.
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
    effectiveMaxModule,
    isFree: userTier === 'free',
    isTier1: userTier === 'tier1',
    isTier2: userTier === 'tier2',
    hasFullAccess: userTier === 'tier2',
    canAccessModule,
    checkAndAccessModule,
  };
}
