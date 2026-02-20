import { createOrganizationsTable } from './organizations';
import { createUsersTable } from './users';
import { createSubscriptionsTable } from './subscriptions';
import { createAuditLogsTable } from './audit_logs';

export * from './organizations';
export * from './users';
export * from './subscriptions';
export * from './audit_logs';
export * from './rollback';

export const createAllTables = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  return [
    createOrganizationsTable(dbType),
    createUsersTable(dbType),
    createSubscriptionsTable(dbType),
    createAuditLogsTable(dbType),
  ];
};
