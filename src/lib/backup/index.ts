import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface BackupConfig {
  type: 'sqlite' | 'postgres';
  database: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  backupPath: string;
}

export interface BackupResult {
  success: boolean;
  filePath?: string;
  error?: string;
  size?: number;
  timestamp: Date;
}

export async function createBackup(config: BackupConfig): Promise<BackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = config.backupPath;

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  try {
    if (config.type === 'sqlite') {
      return await backupSQLite(config, timestamp, backupDir);
    } else if (config.type === 'postgres') {
      return await backupPostgres(config, timestamp, backupDir);
    }
    throw new Error(`Unsupported database type: ${config.type}`);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    };
  }
}

async function backupSQLite(config: BackupConfig, timestamp: string, backupDir: string): Promise<BackupResult> {
  const fileName = `backup-sqlite-${timestamp}.db`;
  const backupPath = path.join(backupDir, fileName);
  
  fs.copyFileSync(config.database, backupPath);
  
  const stats = fs.statSync(backupPath);
  
  return {
    success: true,
    filePath: backupPath,
    size: stats.size,
    timestamp: new Date(),
  };
}

async function backupPostgres(config: BackupConfig, timestamp: string, backupDir: string): Promise<BackupResult> {
  const fileName = `backup-postgres-${timestamp}.sql`;
  const backupPath = path.join(backupDir, fileName);
  
  const env = { ...process.env };
  if (config.password) {
    env.PGPASSWORD = config.password;
  }

  const cmd = [
    'pg_dump',
    config.host ? `-h ${config.host}` : '',
    config.port ? `-p ${config.port}` : '',
    config.username ? `-U ${config.username}` : '',
    `-d ${config.database}`,
    `-f "${backupPath}"`,
  ].filter(Boolean).join(' ');

  await execAsync(cmd, { env });
  
  const stats = fs.statSync(backupPath);
  
  return {
    success: true,
    filePath: backupPath,
    size: stats.size,
    timestamp: new Date(),
  };
}

export async function restoreBackup(config: BackupConfig, backupFile: string): Promise<BackupResult> {
  try {
    if (config.type === 'sqlite') {
      return await restoreSQLite(config, backupFile);
    } else if (config.type === 'postgres') {
      return await restorePostgres(config, backupFile);
    }
    throw new Error(`Unsupported database type: ${config.type}`);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    };
  }
}

async function restoreSQLite(config: BackupConfig, backupFile: string): Promise<BackupResult> {
  if (!fs.existsSync(backupFile)) {
    throw new Error(`Backup file not found: ${backupFile}`);
  }

  const backupPath = `${config.database}.backup-${Date.now()}`;
  if (fs.existsSync(config.database)) {
    fs.copyFileSync(config.database, backupPath);
  }

  fs.copyFileSync(backupFile, config.database);
  
  return {
    success: true,
    filePath: config.database,
    timestamp: new Date(),
  };
}

async function restorePostgres(config: BackupConfig, backupFile: string): Promise<BackupResult> {
  if (!fs.existsSync(backupFile)) {
    throw new Error(`Backup file not found: ${backupFile}`);
  }

  const env = { ...process.env };
  if (config.password) {
    env.PGPASSWORD = config.password;
  }

  const cmd = [
    'psql',
    config.host ? `-h ${config.host}` : '',
    config.port ? `-p ${config.port}` : '',
    config.username ? `-U ${config.username}` : '',
    `-d ${config.database}`,
    `-f "${backupFile}"`,
  ].filter(Boolean).join(' ');

  await execAsync(cmd, { env });
  
  return {
    success: true,
    filePath: backupFile,
    timestamp: new Date(),
  };
}

export async function cleanOldBackups(backupPath: string, retentionDays: number): Promise<number> {
  if (!fs.existsSync(backupPath)) {
    return 0;
  }

  const files = fs.readdirSync(backupPath);
  const now = Date.now();
  const maxAge = retentionDays * 24 * 60 * 60 * 1000;
  let deleted = 0;

  for (const file of files) {
    if (!file.startsWith('backup-')) continue;
    
    const filePath = path.join(backupPath, file);
    const stats = fs.statSync(filePath);
    
    if (now - stats.mtimeMs > maxAge) {
      fs.unlinkSync(filePath);
      deleted++;
    }
  }

  return deleted;
}

export function listBackups(backupPath: string): Array<{ file: string; size: number; date: Date }> {
  if (!fs.existsSync(backupPath)) {
    return [];
  }

  const files = fs.readdirSync(backupPath);
  
  return files
    .filter(file => file.startsWith('backup-'))
    .map(file => {
      const filePath = path.join(backupPath, file);
      const stats = fs.statSync(filePath);
      return {
        file,
        size: stats.size,
        date: stats.mtime,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
