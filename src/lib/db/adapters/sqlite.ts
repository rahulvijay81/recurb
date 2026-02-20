import Database from 'better-sqlite3';
import { DatabaseAdapter, DatabaseConfig } from '../index';

export class SqliteAdapter implements DatabaseAdapter {
  private db: Database.Database | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    this.db = new Database(this.config.database, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    });
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error('Database not connected');
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<{ affectedRows: number; insertId?: number }> {
    if (!this.db) throw new Error('Database not connected');
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...params);
    return {
      affectedRows: result.changes,
      insertId: result.lastInsertRowid as number,
    };
  }

  async transaction<T>(callback: (adapter: DatabaseAdapter) => Promise<T>): Promise<T> {
    if (!this.db) throw new Error('Database not connected');
    
    const txn = this.db.transaction(() => callback(this));
    return txn() as T;
  }
}
