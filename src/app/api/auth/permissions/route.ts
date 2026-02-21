import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/auth/permissions';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { permission } = await req.json();
    const allowed = hasPermission(user.role, permission as Permission);

    return NextResponse.json({ allowed });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check permission' }, { status: 500 });
  }
}
