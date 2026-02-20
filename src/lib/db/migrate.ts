import { getDatabase } from './index';
import { createAllTables, dropAllTables } from './schema';

export async function runMigrations(): Promise<void> {
  const db = await getDatabase();
  const dbType = (process.env.DB_TYPE as 'sqlite' | 'postgres' | 'mysql') || 'sqlite';

  console.log(`Running migrations for ${dbType}...`);

  try {
    await db.connect();
    
    const tables = createAllTables(dbType);
    
    for (const tableSql of tables) {
      const statements = tableSql.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await db.execute(statement.trim());
        }
      }
    }

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function rollbackMigrations(): Promise<void> {
  const db = await getDatabase();

  console.log('Rolling back migrations...');

  try {
    const dropStatements = dropAllTables();
    
    for (const statement of dropStatements) {
      await db.execute(statement);
    }

    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
}
