// Core data types for the application

export type UserType = {
  id: string;
  email: string;
  name: string;
  plan: 'basic' | 'pro' | 'team';
  created_at: string;
  updated_at: string;
};

export type SubscriptionType = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: 'monthly' | 'quarterly' | 'annual' | 'custom';
  start_date: string;
  next_renewal_date: string;
  provider: string;
  auto_renewal: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type InvoiceType = {
  id: string;
  subscription_id: string;
  file_path: string;
  issue_date: string;
  amount: number;
  created_at: string;
};

export type ReminderType = {
  id: string;
  subscription_id: string;
  days_before: number;
  notification_type: 'email' | 'slack' | 'discord';
  created_at: string;
};

// Team plan types
export type TeamType = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type TeamMemberType = {
  id: string;
  team_id: string;
  user_id: string;
  role: 'admin' | 'viewer';
  created_at: string;
};

export type CommentType = {
  id: string;
  subscription_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type IntegrationType = {
  id: string;
  team_id: string;
  service_type: 'slack' | 'discord';
  config_json: Record<string, any>;
  created_at: string;
  updated_at: string;
};

// API response types
export type ApiResponse<T> = {
  data: T;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
};