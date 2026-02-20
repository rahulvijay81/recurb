export const createUsersTable = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  const autoIncrement = dbType === 'postgres' ? 'SERIAL' : dbType === 'mysql' ? 'INT AUTO_INCREMENT' : 'INTEGER';
  const primaryKey = dbType === 'postgres' ? 'PRIMARY KEY' : 'PRIMARY KEY AUTOINCREMENT';
  const timestamp = dbType === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

  return `
    CREATE TABLE IF NOT EXISTS users (
      id ${dbType === 'postgres' ? autoIncrement : autoIncrement} ${dbType === 'sqlite' ? primaryKey : 'PRIMARY KEY'},
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      organization_id INTEGER NOT NULL,
      created_at ${timestamp} DEFAULT CURRENT_TIMESTAMP,
      updated_at ${timestamp} DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
  `;
};

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  role: string;
  organization_id: number;
  created_at: Date;
  updated_at: Date;
}
