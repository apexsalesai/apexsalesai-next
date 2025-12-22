// Echo Breaker Subscription & Limits Management

export type SubscriptionTier = 'free' | 'professional' | 'enterprise';

export interface SubscriptionLimits {
  monthlyVerifications: number;
  monthlyExports: number;
  canExportPDF: boolean;
  canShareVerifications: boolean;
  canAddNotes: boolean;
  canAddTags: boolean;
  canAccessAnalytics: boolean;
  maxStoredVerifications: number;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    monthlyVerifications: 10,
    monthlyExports: 0, // No exports on free tier
    canExportPDF: false,
    canShareVerifications: false,
    canAddNotes: false,
    canAddTags: false,
    canAccessAnalytics: false,
    maxStoredVerifications: 10,
  },
  professional: {
    monthlyVerifications: 100,
    monthlyExports: 50,
    canExportPDF: true,
    canShareVerifications: true,
    canAddNotes: true,
    canAddTags: true,
    canAccessAnalytics: true,
    maxStoredVerifications: 500,
  },
  enterprise: {
    monthlyVerifications: -1, // Unlimited
    monthlyExports: -1, // Unlimited
    canExportPDF: true,
    canShareVerifications: true,
    canAddNotes: true,
    canAddTags: true,
    canAccessAnalytics: true,
    maxStoredVerifications: -1, // Unlimited
  },
};

export interface SubscriptionFeature {
  name: string;
  description: string;
  tier: SubscriptionTier;
  icon: string;
}

export const SUBSCRIPTION_FEATURES: SubscriptionFeature[] = [
  {
    name: 'PDF Export',
    description: 'Export verification records as citation-ready PDFs',
    tier: 'professional',
    icon: '📄',
  },
  {
    name: 'Share Verifications',
    description: 'Share verification links with team members',
    tier: 'professional',
    icon: '🔗',
  },
  {
    name: 'Add Notes & Tags',
    description: 'Organize verifications with custom notes and tags',
    tier: 'professional',
    icon: '🏷️',
  },
  {
    name: 'Usage Analytics',
    description: 'Track verification history and export analytics',
    tier: 'professional',
    icon: '📊',
  },
  {
    name: 'Compliance Exports',
    description: 'Export audit trails for compliance requirements',
    tier: 'enterprise',
    icon: '🔒',
  },
  {
    name: 'Team Management',
    description: 'Manage team access and shared verifications',
    tier: 'enterprise',
    icon: '👥',
  },
];

export const SUBSCRIPTION_PRICING = {
  professional: {
    monthly: 29,
    annual: 290, // ~$24/month
    currency: 'USD',
  },
  enterprise: {
    monthly: 99,
    annual: 990, // ~$82/month
    currency: 'USD',
  },
};

/**
 * Check if user can perform an action based on their subscription
 */
export function canPerformAction(
  tier: SubscriptionTier,
  action: keyof SubscriptionLimits
): boolean {
  const limits = SUBSCRIPTION_LIMITS[tier];
  return limits[action] === true || limits[action] === -1;
}

/**
 * Check if user has reached their monthly limit
 */
export function hasReachedLimit(
  tier: SubscriptionTier,
  currentUsage: number,
  limitType: 'monthlyVerifications' | 'monthlyExports'
): boolean {
  const limits = SUBSCRIPTION_LIMITS[tier];
  const limit = limits[limitType];
  
  // -1 means unlimited
  if (limit === -1) return false;
  
  return currentUsage >= limit;
}

/**
 * Get remaining usage for a limit
 */
export function getRemainingUsage(
  tier: SubscriptionTier,
  currentUsage: number,
  limitType: 'monthlyVerifications' | 'monthlyExports'
): number {
  const limits = SUBSCRIPTION_LIMITS[tier];
  const limit = limits[limitType];
  
  // -1 means unlimited
  if (limit === -1) return Infinity;
  
  return Math.max(0, limit - currentUsage);
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(feature: string): string {
  return `Upgrade to Professional to unlock ${feature} and other premium features.`;
}
