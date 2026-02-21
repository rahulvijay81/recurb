import mysql from 'mysql2/promise';
import { DatabaseAdapter, DatabaseConfig } from '../index';

export class MysqlAdapter implements DatabaseAdapter {
  private pool: mysql.Pool | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    this.pool = mysql.createPool({
      host: this.config.host || 'localhost',
      port: this.config.port || 3306,
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
      connectionLimit: this.config.poolMax || 10,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
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
    const [rows] = await this.pool.execute(sql, params);
    return rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<{ affectedRows: number; insertId?: number }> {
    if (!this.pool) throw new Error('Database not connected');
    const [result] = await this.pool.execute(sql, params);
    const resultSet = result as mysql.ResultSetHeader;
    return {
      affectedRows: resultSet.affectedRows,
      insertId: resultSet.insertId,
    };
  }

  async transaction<T>(callback: (adapter: DatabaseAdapter) => Promise<T>): Promise<T> {
    if (!this.pool) throw new Error('Database not connected');
    
    const connection = await this.pool.getConnection();
    const txAdapter = new MysqlTransactionAdapter(connection);
    
    try {
      await connection.beginTransaction();
      const result = await callback(txAdapter);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

class MysqlTransactionAdapter implements DatabaseAdapter {
  constructor(private connection: mysql.PoolConnection) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await this.connection.execute(sql, params);
    return rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<{ affectedRows: number; insertId?: number }> {
    const [result] = await this.connection.execute(sql, params);
    const resultSet = result as mysql.ResultSetHeader;
    return {
      affectedRows: resultSet.affectedRows,
      insertId: resultSet.insertId,
    };
  }

  async transaction<T>(callback: (adapter: DatabaseAdapter) => Promise<T>): Promise<T> {
    return callback(this);
  }
}
