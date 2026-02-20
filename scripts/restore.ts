#!/usr/bin/env node
import { restoreBackup, listBackups, type BackupConfig } from '../src/lib/backup';
import { config } from 'dotenv';
import readline from 'readline';

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

  let backupFile = flags.file as string;

  if (!backupFile) {
    const backups = listBackups(backupConfig.backupPath);
    
    if (backups.length === 0) {
      console.error('❌ No backups found!');
      process.exit(1);
    }

    console.log('📋 Available backups:\n');
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.file}`);
      console.log(`   Size: ${formatBytes(backup.size)}`);
      console.log(`   Date: ${backup.date.toISOString()}\n`);
    });

    const selection = await prompt('Select backup number (or press Enter for latest): ');
    const index = selection ? parseInt(selection) - 1 : 0;
    
    if (index < 0 || index >= backups.length) {
      console.error('❌ Invalid selection!');
      process.exit(1);
    }

    backupFile = `${backupConfig.backupPath}/${backups[index].file}`;
  }

  if (!flags.yes) {
    console.log('\n⚠️  WARNING: This will overwrite your current database!');
    const confirm = await prompt('Are you sure you want to continue? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Restore cancelled.');
      process.exit(0);
    }
  }

  console.log('\n🔄 Starting restore...');
  console.log(`Database: ${backupConfig.type}`);
  console.log(`Backup file: ${backupFile}`);

  const result = await restoreBackup(backupConfig, backupFile);

  if (result.success) {
    console.log('✅ Restore completed successfully!');
    console.log(`Time: ${result.timestamp.toISOString()}`);
  } else {
    console.error('❌ Restore failed!');
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

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

main().catch(console.error);
