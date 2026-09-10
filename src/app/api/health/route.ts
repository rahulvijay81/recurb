import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import packageJson from '../../../../package.json';

export async function GET() {
  try {
    const db = await getDatabase();
    await db.query('SELECT 1');
    return NextResponse.json(
      {
        status: 'ok',
        db: 'connected',
        version: packageJson.version,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check database error:', error);

    return NextResponse.json(
      {
        status: 'ok',
        db: 'error',
        version: packageJson.version,
      },
      { status: 503 }
    );
  }
}
