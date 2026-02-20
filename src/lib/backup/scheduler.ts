import cron from 'node-cron';
import { createBackup, cleanOldBackups, type BackupConfig } from './index';

export class BackupScheduler {
  private task: cron.ScheduledTask | null = null;
  private config: BackupConfig;
  private schedule: string;
  private retentionDays: number;

  constructor(config: BackupConfig, schedule: string = '0 2 * * *', retentionDays: number = 30) {
    this.config = config;
    this.schedule = schedule;
    this.retentionDays = retentionDays;
  }

  start(): void {
    if (this.task) {
      console.log('Backup scheduler already running');
      return;
    }

    if (!cron.validate(this.schedule)) {
      throw new Error(`Invalid cron schedule: ${this.schedule}`);
    }

    this.task = cron.schedule(this.schedule, async () => {
      console.log(`[${new Date().toISOString()}] Running scheduled backup...`);
      
      try {
        const result = await createBackup(this.config);
        
        if (result.success) {
          console.log(`[${new Date().toISOString()}] Backup completed: ${result.filePath}`);
          
          const deleted = await cleanOldBackups(this.config.backupPath, this.retentionDays);
          if (deleted > 0) {
            console.log(`[${new Date().toISOString()}] Cleaned ${deleted} old backup(s)`);
          }
        } else {
          console.error(`[${new Date().toISOString()}] Backup failed: ${result.error}`);
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Backup error:`, error);
      }
    });

    console.log(`Backup scheduler started with schedule: ${this.schedule}`);
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('Backup scheduler stopped');
    }
  }

  isRunning(): boolean {
    return this.task !== null;
  }
}

export function createBackupScheduler(
  config: BackupConfig,
  schedule?: string,
  retentionDays?: number
): BackupScheduler {
  return new BackupScheduler(
    config,
    schedule || process.env.BACKUP_SCHEDULE || '0 2 * * *',
    retentionDays || parseInt(process.env.BACKUP_RETENTION_DAYS || '30')
  );
}
