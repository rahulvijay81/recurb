#!/usr/bin/env node
import { runMigrations } from '../src/lib/db/migrate.js';
import { closeDatabase } from '../src/lib/db/index.js';

async function main() {
  try {
    await runMigrations();
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
