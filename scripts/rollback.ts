#!/usr/bin/env node
import { rollbackMigrations } from '../src/lib/db/migrate.js';
import { closeDatabase } from '../src/lib/db/index.js';

async function main() {
  const confirm = process.argv.includes('--confirm');
  
  if (!confirm) {
    console.error('WARNING: This will drop all tables and delete all data!');
    console.error('Run with --confirm flag to proceed: npm run migrate:rollback -- --confirm');
    process.exit(1);
  }

  try {
    await rollbackMigrations();
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
}

main();
