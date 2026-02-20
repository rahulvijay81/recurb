import { NextRequest, NextResponse } from 'next/server';
import { createBackup, listBackups, cleanOldBackups } from '@/lib/backup';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const config = {
      type: (process.env.DATABASE_TYPE as 'sqlite' | 'postgres') || 'sqlite',
      database: process.env.DATABASE_URL?.replace('file:', '') || './data/recurb.db',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      backupPath: process.env.BACKUP_PATH || './backups',
    };

    const result = await createBackup(config);

    if (result.success) {
      return NextResponse.json({
        success: true,
        filePath: result.filePath,
        size: result.size,
        timestamp: result.timestamp,
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Backup failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const backupPath = process.env.BACKUP_PATH || './backups';
    const backups = listBackups(backupPath);

    return NextResponse.json({ backups });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list backups' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const backupPath = process.env.BACKUP_PATH || './backups';
    const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');
    
    const deleted = await cleanOldBackups(backupPath, retentionDays);

    return NextResponse.json({ deleted });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to clean backups' },
      { status: 500 }
    );
  }
}
