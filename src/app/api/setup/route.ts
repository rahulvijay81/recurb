import { NextRequest, NextResponse } from 'next/server';
import { completeSetup, isSetupComplete } from '@/lib/setup/wizard';
import { runMigrations } from '@/lib/db/migrate';
import { z } from 'zod';

const setupSchema = z.object({
  dbType: z.enum(['sqlite', 'postgres', 'mysql']),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8),
  adminName: z.string().min(1),
  orgName: z.string().min(1),
  orgPlan: z.enum(['free', 'pro', 'team']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = setupSchema.parse(body);

    const setupComplete = await isSetupComplete();
    if (setupComplete) {
      return NextResponse.json({ error: 'Setup already completed' }, { status: 400 });
    }

    await runMigrations();
    await completeSetup(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 });
  }
}

export async function GET() {
  const complete = await isSetupComplete();
  return NextResponse.json({ complete });
}
