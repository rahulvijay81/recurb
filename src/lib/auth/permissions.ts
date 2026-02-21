export const PERMISSIONS = {
  SUBSCRIPTIONS_READ: 'subscriptions:read',
  SUBSCRIPTIONS_CREATE: 'subscriptions:create',
  SUBSCRIPTIONS_UPDATE: 'subscriptions:update',
  SUBSCRIPTIONS_DELETE: 'subscriptions:delete',
  ANALYTICS_VIEW: 'analytics:view',
  TEAM_READ: 'team:read',
  TEAM_INVITE: 'team:invite',
  TEAM_UPDATE: 'team:update',
  TEAM_DELETE: 'team:delete',
  ROLES_MANAGE: 'roles:manage',
  AUDIT_VIEW: 'audit:view',
  SETTINGS_MANAGE: 'settings:manage',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.SUBSCRIPTIONS_READ,
    PERMISSIONS.SUBSCRIPTIONS_CREATE,
    PERMISSIONS.SUBSCRIPTIONS_UPDATE,
    PERMISSIONS.SUBSCRIPTIONS_DELETE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.TEAM_READ,
    PERMISSIONS.TEAM_INVITE,
    PERMISSIONS.TEAM_UPDATE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.ROLES_MANAGE,
  ],
  member: [
    PERMISSIONS.SUBSCRIPTIONS_READ,
    PERMISSIONS.SUBSCRIPTIONS_CREATE,
    PERMISSIONS.SUBSCRIPTIONS_UPDATE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.TEAM_READ,
  ],
  viewer: [
    PERMISSIONS.SUBSCRIPTIONS_READ,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.TEAM_READ,
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}
