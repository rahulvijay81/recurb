import { Pool, PoolClient } from 'pg';
import { DatabaseAdapter, DatabaseConfig } from '../index';

export class PostgresAdapter implements DatabaseAdapter {
  private pool: Pool | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    this.pool = new Pool({
      host: this.config.host || 'localhost',
      port: this.config.port || 5432,
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
      min: this.config.poolMin || 2,
      max: this.config.poolMax || 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.pool) throw new Error('Database not connected');
    const result = await this.pool.query(sql, params);
    return result.rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<{ affectedRows: number; insertId?: number }> {
    if (!this.pool) throw new Error('Database not connected');
    const result = await this.pool.query(sql, params);
    return {
      affectedRows: result.rowCount || 0,
      insertId: result.rows[0]?.id,
    };
  }

  async transaction<T>(callback: (adapter: DatabaseAdapter) => Promise<T>): Promise<T> {
    if (!this.pool) throw new Error('Database not connected');
    
    const client = await this.pool.connect();
    const txAdapter = new PostgresTransactionAdapter(client);
    
    try {
      await client.query('BEGIN');
      const result = await callback(txAdapter);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

class PostgresTransactionAdapter implements DatabaseAdapter {
  constructor(private client: PoolClient) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const result = await this.client.query(sql, params);
    return result.rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<{ affectedRows: number; insertId?: number }> {
    const result = await this.client.query(sql, params);
    return {
      affectedRows: result.rowCount || 0,
      insertId: result.rows[0]?.id,
    };
  }

  async transaction<T>(callback: (adapter: DatabaseAdapter) => Promise<T>): Promise<T> {
    return callback(this);
  }
}
