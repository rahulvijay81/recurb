import { getDatabase } from '../src/lib/db/index';

async function checkDatabase() {
  try {
    const db = await getDatabase();
    
    console.log('=== USERS ===');
    const users = await db.query('SELECT id, email, name, role, organization_id FROM users');
    console.log(users);
    
    console.log('\n=== ORGANIZATIONS ===');
    const orgs = await db.query('SELECT id, name FROM organizations');
    console.log(orgs);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
