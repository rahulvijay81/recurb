import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { getDatabase } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requirePermission(PERMISSIONS.ROLES_MANAGE);
    const { name, description, permissions } = await req.json();
    const db = await getDatabase();

    await db.execute(`
      UPDATE roles
      SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND organization_id = ? AND is_system = 0
    `, [name, description || null, params.id, user.organizationId]);

    await db.execute('DELETE FROM permissions WHERE role_id = ?', [params.id]);

    if (permissions?.length) {
      for (const perm of permissions) {
        await db.execute('INSERT INTO permissions (role_id, permission) VALUES (?, ?)', [params.id, perm]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requirePermission(PERMISSIONS.ROLES_MANAGE);
    const db = await getDatabase();

    await db.execute(`
      DELETE FROM roles
      WHERE id = ? AND organization_id = ? AND is_system = 0
    `, [params.id, user.organizationId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
