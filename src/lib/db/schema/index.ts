import { createOrganizationsTable } from './organizations';
import { createUsersTable } from './users';
import { createSubscriptionsTable } from './subscriptions';
import { createAuditLogsTable } from './audit_logs';
import { createSystemConfigTable } from './system_config';

export * from './organizations';
export * from './users';
export * from './subscriptions';
export * from './audit_logs';
export * from './system_config';
export * from './rollback';

export const createAllTables = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  return [
    createSystemConfigTable(dbType),
    createOrganizationsTable(dbType),
    createUsersTable(dbType),
    createSubscriptionsTable(dbType),
    createAuditLogsTable(dbType),
  ];
};
