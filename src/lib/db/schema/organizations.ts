export const createOrganizationsTable = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  const autoIncrement = dbType === 'postgres' ? 'SERIAL' : dbType === 'mysql' ? 'INT AUTO_INCREMENT' : 'INTEGER';
  const primaryKey = dbType === 'postgres' ? 'PRIMARY KEY' : 'PRIMARY KEY AUTOINCREMENT';
  const timestamp = dbType === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

  return `
    CREATE TABLE IF NOT EXISTS organizations (
      id ${dbType === 'postgres' ? autoIncrement : autoIncrement} ${dbType === 'sqlite' ? primaryKey : 'PRIMARY KEY'},
      name VARCHAR(255) NOT NULL,
      plan VARCHAR(50) NOT NULL DEFAULT 'free',
      settings TEXT,
      created_at ${timestamp} DEFAULT CURRENT_TIMESTAMP,
      updated_at ${timestamp} DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_organizations_plan ON organizations(plan);
  `;
};

export interface Organization {
  id: number;
  name: string;
  plan: 'free' | 'pro' | 'team';
  settings?: string;
  created_at: Date;
  updated_at: Date;
}
