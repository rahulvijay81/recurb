export const createAuditLogsTable = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  const autoIncrement = dbType === 'postgres' ? 'SERIAL' : dbType === 'mysql' ? 'INT AUTO_INCREMENT' : 'INTEGER';
  const primaryKey = dbType === 'postgres' ? 'PRIMARY KEY' : 'PRIMARY KEY AUTOINCREMENT';
  const timestamp = dbType === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

  return `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id ${dbType === 'postgres' ? autoIncrement : autoIncrement} ${dbType === 'sqlite' ? primaryKey : 'PRIMARY KEY'},
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id INTEGER,
      user_id INTEGER NOT NULL,
      organization_id INTEGER NOT NULL,
      changes TEXT,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at ${timestamp} DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
  `;
};

export interface AuditLog {
  id: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  user_id: number;
  organization_id: number;
  changes?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}
