import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { getDatabase } from '@/lib/db';

export async function GET() {
  try {
    const user = await requirePermission(PERMISSIONS.ROLES_MANAGE);
    const db = await getDatabase();
    
    const roles = await db.query(`
      SELECT id, name, description, is_system, organization_id
      FROM roles
      WHERE organization_id = ?
    `, [user.organizationId]);

    const rolesWithPermissions = await Promise.all(roles.map(async (role: any) => {
      const permissions = await db.query('SELECT permission FROM permissions WHERE role_id = ?', [role.id]);
      return { ...role, permissions: permissions.map((p: any) => p.permission) };
    }));

    return NextResponse.json(rolesWithPermissions);
  } catch (error: any) {
    console.error('Roles API error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission(PERMISSIONS.ROLES_MANAGE);
    const { name, description, permissions } = await req.json();
    const db = await getDatabase();

    const result = await db.execute(`
      INSERT INTO roles (name, description, organization_id, is_system)
      VALUES (?, ?, ?, 0)
    `, [name, description || null, user.organizationId]);

    const roleId = result.insertId;

    if (permissions?.length) {
      for (const perm of permissions) {
        await db.execute('INSERT INTO permissions (role_id, permission) VALUES (?, ?)', [roleId, perm]);
      }
    }

    return NextResponse.json({ id: roleId, name, description, permissions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}
