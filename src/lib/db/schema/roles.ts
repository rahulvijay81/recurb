export const createRolesTable = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  const autoIncrement = dbType === 'postgres' ? 'SERIAL' : dbType === 'mysql' ? 'INT AUTO_INCREMENT' : 'INTEGER';
  const primaryKey = dbType === 'postgres' ? 'PRIMARY KEY' : 'PRIMARY KEY AUTOINCREMENT';
  const timestamp = dbType === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

  return `
    CREATE TABLE IF NOT EXISTS roles (
      id ${dbType === 'postgres' ? autoIncrement : autoIncrement} ${dbType === 'sqlite' ? primaryKey : 'PRIMARY KEY'},
      name VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      organization_id INTEGER NOT NULL,
      is_system BOOLEAN DEFAULT 0,
      created_at ${timestamp} DEFAULT CURRENT_TIMESTAMP,
      updated_at ${timestamp} DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_roles_organization ON roles(organization_id);
  `;
};

export const createPermissionsTable = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  const autoIncrement = dbType === 'postgres' ? 'SERIAL' : dbType === 'mysql' ? 'INT AUTO_INCREMENT' : 'INTEGER';
  const primaryKey = dbType === 'postgres' ? 'PRIMARY KEY' : 'PRIMARY KEY AUTOINCREMENT';

  return `
    CREATE TABLE IF NOT EXISTS permissions (
      id ${dbType === 'postgres' ? autoIncrement : autoIncrement} ${dbType === 'sqlite' ? primaryKey : 'PRIMARY KEY'},
      role_id INTEGER NOT NULL,
      permission VARCHAR(100) NOT NULL,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      UNIQUE(role_id, permission)
    );

    CREATE INDEX IF NOT EXISTS idx_permissions_role ON permissions(role_id);
  `;
};

export interface Role {
  id: number;
  name: string;
  description?: string;
  organization_id: number;
  is_system: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RolePermission {
  id: number;
  role_id: number;
  permission: string;
}
