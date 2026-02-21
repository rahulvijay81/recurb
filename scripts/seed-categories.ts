import { getDatabase } from '../src/lib/db/index';

const defaultCategories = [
  { name: 'Entertainment', description: 'Movies, music, and entertainment services', color: '#FF6B6B', icon: 'tv' },
  { name: 'Software', description: 'Software tools and applications', color: '#4ECDC4', icon: 'code' },
  { name: 'Cloud Services', description: 'Cloud hosting and infrastructure', color: '#45B7D1', icon: 'cloud' },
  { name: 'Productivity', description: 'Productivity and collaboration tools', color: '#96CEB4', icon: 'briefcase' },
  { name: 'Streaming', description: 'Video and audio streaming services', color: '#FFEAA7', icon: 'play' },
  { name: 'Utilities', description: 'Utility services and bills', color: '#DFE6E9', icon: 'zap' },
  { name: 'Education', description: 'Learning and educational platforms', color: '#74B9FF', icon: 'book' },
  { name: 'Health & Fitness', description: 'Health and fitness subscriptions', color: '#55EFC4', icon: 'heart' },
  { name: 'News & Media', description: 'News and media subscriptions', color: '#FD79A8', icon: 'newspaper' },
  { name: 'Other', description: 'Other subscriptions', color: '#B2BEC3', icon: 'more-horizontal' },
];

async function seedCategories() {
  try {
    const db = await getDatabase();
    await db.connect();

    console.log('Seeding default categories...');

    for (const category of defaultCategories) {
      try {
        await db.execute(
          `INSERT INTO categories (name, description, color, icon, organization_id) 
           VALUES (?, ?, ?, ?, ?)`,
          [category.name, category.description, category.color, category.icon, 1]
        );
        console.log(`✓ Added category: ${category.name}`);
      } catch (error: any) {
        if (error?.message?.includes('UNIQUE')) {
          console.log(`- Category already exists: ${category.name}`);
        } else {
          throw error;
        }
      }
    }

    console.log('Default categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed categories:', error);
    process.exit(1);
  }
}

seedCategories();
