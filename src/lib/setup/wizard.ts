import { getDatabase } from '../db';
import bcrypt from 'bcryptjs';

export async function isSetupComplete(): Promise<boolean> {
  try {
    const db = await getDatabase();
    await db.connect();
    
    const configResult = await db.query<{ value: string }>(
      "SELECT value FROM system_config WHERE key = 'setup_complete'"
    );
    
    if (configResult.length === 0 || configResult[0].value !== 'true') {
      return false;
    }
    
    const userCount = await db.query<{ count: number }>(
      "SELECT COUNT(*) as count FROM users"
    );
    
    return userCount[0].count > 0;
  } catch (error) {
    console.error('isSetupComplete error:', error);
    return false;
  }
}

export async function completeSetup(data: {
  dbType: 'sqlite' | 'postgres' | 'mysql';
  adminEmail: string;
  adminPassword: string;
  adminName: string;
  orgName: string;
  orgPlan: 'free' | 'pro' | 'team';
}): Promise<void> {
  const db = await getDatabase();
  await db.connect();
  
  await db.transaction(async (tx) => {
    const orgResult = await tx.execute(
      'INSERT INTO organizations (name, plan) VALUES (?, ?)',
      [data.orgName, data.orgPlan]
    );

    const passwordHash = await bcrypt.hash(data.adminPassword, 10);
    
    await tx.execute(
      'INSERT INTO users (email, password_hash, name, role, organization_id) VALUES (?, ?, ?, ?, ?)',
      [data.adminEmail, passwordHash, data.adminName, 'owner', orgResult.insertId]
    );

    await tx.execute(
      "INSERT OR REPLACE INTO system_config (key, value) VALUES ('setup_complete', 'true')"
    );
  });
}
