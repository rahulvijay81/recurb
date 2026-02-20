#!/usr/bin/env node
import { config } from 'dotenv';
import { createBackupScheduler } from '../src/lib/backup/scheduler';

config();

const enabled = process.env.BACKUP_ENABLED === 'true';

if (!enabled) {
  console.log('Scheduled backups are disabled. Set BACKUP_ENABLED=true to enable.');
  process.exit(0);
}

const backupConfig = {
  type: (process.env.DATABASE_TYPE as 'sqlite' | 'postgres') || 'sqlite',
  database: process.env.DATABASE_URL?.replace('file:', '') || './data/recurb.db',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  backupPath: process.env.BACKUP_PATH || './backups',
};

const scheduler = createBackupScheduler(backupConfig);

scheduler.start();

console.log('Backup scheduler service started');
console.log(`Schedule: ${process.env.BACKUP_SCHEDULE || '0 2 * * *'}`);
console.log(`Retention: ${process.env.BACKUP_RETENTION_DAYS || '30'} days`);

process.on('SIGINT', () => {
  console.log('\nShutting down backup scheduler...');
  scheduler.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down backup scheduler...');
  scheduler.stop();
  process.exit(0);
});
