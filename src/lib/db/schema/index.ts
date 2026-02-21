import { createOrganizationsTable } from './organizations';
import { createUsersTable } from './users';
import { createSubscriptionsTable } from './subscriptions';
import { createCategoriesTable } from './categories';
import { createAuditLogsTable } from './audit_logs';
import { createSystemConfigTable } from './system_config';
import { createFeatureFlagsTable } from './feature_flags';

export * from './organizations';
export * from './users';
export * from './subscriptions';
export * from './categories';
export * from './audit_logs';
export * from './system_config';
export * from './feature_flags';
export * from './rollback';

export const createAllTables = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  return [
    createSystemConfigTable(dbType),
    createOrganizationsTable(dbType),
    createUsersTable(dbType),
    createCategoriesTable(dbType),
    createSubscriptionsTable(dbType),
    createAuditLogsTable(dbType),
    createFeatureFlagsTable(dbType),
  ];
};
