import { SqliteAdapter } from './adapters/sqlite';
import { PostgresAdapter } from './adapters/postgres';
import { MysqlAdapter } from './adapters/mysql';

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<{ affectedRows: number; insertId?: number }>;
  transaction<T>(callback: (adapter: DatabaseAdapter) => Promise<T>): Promise<T>;
}

export type DatabaseType = 'sqlite' | 'postgres' | 'mysql';

export interface DatabaseConfig {
  type: DatabaseType;
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  poolMin?: number;
  poolMax?: number;
}

let dbInstance: DatabaseAdapter | null = null;

export function createDatabase(config: DatabaseConfig): DatabaseAdapter {
  switch (config.type) {
    case 'sqlite':
      return new SqliteAdapter(config);
    case 'postgres':
      return new PostgresAdapter(config);
    case 'mysql':
      return new MysqlAdapter(config);
    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}

export async function getDatabase(): Promise<DatabaseAdapter> {
  if (!dbInstance) {
    const config: DatabaseConfig = {
      type: (process.env.DB_TYPE as DatabaseType) || 'sqlite',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
      database: process.env.DB_NAME || './data/recurb.db',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      poolMin: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN) : 2,
      poolMax: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX) : 10,
    };

    dbInstance = createDatabase(config);
  }

  return dbInstance;
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.disconnect();
    dbInstance = null;
  }
}
