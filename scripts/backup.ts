#!/usr/bin/env node
import { createBackup, cleanOldBackups, type BackupConfig } from '../src/lib/backup';
import { config } from 'dotenv';
import path from 'path';

config();

async function main() {
  const args = process.argv.slice(2);
  const flags = parseArgs(args);

  const backupConfig: BackupConfig = {
    type: (process.env.DATABASE_TYPE as 'sqlite' | 'postgres') || 'sqlite',
    database: process.env.DATABASE_URL?.replace('file:', '') || './data/recurb.db',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    backupPath: flags.path || process.env.BACKUP_PATH || './backups',
  };

  console.log('🔄 Starting backup...');
  console.log(`Database: ${backupConfig.type}`);
  console.log(`Backup path: ${backupConfig.backupPath}`);

  const result = await createBackup(backupConfig);

  if (result.success) {
    console.log('✅ Backup completed successfully!');
    console.log(`File: ${result.filePath}`);
    console.log(`Size: ${formatBytes(result.size || 0)}`);
    console.log(`Time: ${result.timestamp.toISOString()}`);

    if (flags.clean) {
      const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');
      console.log(`\n🧹 Cleaning backups older than ${retentionDays} days...`);
      const deleted = await cleanOldBackups(backupConfig.backupPath, retentionDays);
      console.log(`Deleted ${deleted} old backup(s)`);
    }
  } else {
    console.error('❌ Backup failed!');
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }
}

function parseArgs(args: string[]): Record<string, string | boolean> {
  const flags: Record<string, string | boolean> = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        flags[key] = nextArg;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  
  return flags;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

main().catch(console.error);
