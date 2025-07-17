// Plan-based feature access control system

export type PlanType = 'basic' | 'pro' | 'team';

// Define which features are available for each plan
export const FEATURES = {
  // Basic plan features
  subscription_management: ['basic', 'pro', 'team'],
  csv_import_export: ['basic', 'pro', 'team'],
  auto_renewal_flag: ['basic', 'pro', 'team'],
  tagging_categorization: ['basic', 'pro', 'team'],
  basic_analytics: ['basic', 'pro', 'team'],
  
  // Pro plan features
  advanced_analytics: ['pro', 'team'],
  invoice_management: ['pro', 'team'],
  custom_reminders: ['pro', 'team'],
  calendar_view: ['pro', 'team'],
  duplicate_detection: ['pro', 'team'],
  vendor_summary: ['pro', 'team'],
  additional_export_formats: ['pro', 'team'],
  
  // Team plan features
  team_management: ['team'],
  role_based_access: ['team'],
  shared_notes: ['team'],
  activity_logging: ['team'],
  slack_integration: ['team'],
  discord_integration: ['team'],
};

/**
 * Check if a user with a specific plan has access to a feature
 * @param userPlan The user's subscription plan
 * @param feature The feature to check access for
 * @returns boolean indicating whether the user has access
 */
export const hasAccess = (userPlan: PlanType, feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature].includes(userPlan);
};

/**
 * Get all features available for a specific plan
 * @param plan The subscription plan
 * @returns Array of feature keys available for the plan
 */
export const getAvailableFeatures = (plan: PlanType): (keyof typeof FEATURES)[] => {
  return Object.entries(FEATURES)
    .filter(([_, plans]) => plans.includes(plan))
    .map(([feature, _]) => feature as keyof typeof FEATURES);
};