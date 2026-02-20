# Backup & Restore System

Recurb includes a comprehensive backup and restore system supporting SQLite and PostgreSQL databases.

## Features

- **Manual Backups**: CLI tools for on-demand backups
- **Scheduled Backups**: Automatic backups using cron schedules
- **Retention Policy**: Automatic cleanup of old backups
- **Multiple Database Support**: SQLite file copy and PostgreSQL pg_dump
- **API Endpoints**: Trigger backups via REST API

## Quick Start

### Manual Backup

```bash
npm run backup
```

Options:
- `--path <directory>`: Custom backup directory (default: `./backups`)
- `--clean`: Clean old backups after creating new one

Example:
```bash
npm run backup -- --path ./my-backups --clean
```

### Restore from Backup

```bash
npm run restore
```

Options:
- `--file <path>`: Specific backup file to restore
- `--path <directory>`: Backup directory to search (default: `./backups`)
- `--yes`: Skip confirmation prompt

Example:
```bash
npm run restore -- --file ./backups/backup-sqlite-2024-01-15.db --yes
```

### Scheduled Backups

Run as a background service:

```bash
npm run backup:service
```

Or use a process manager like PM2:

```bash
pm2 start npm --name "recurb-backup" -- run backup:service
```

## Configuration

Add to your `.env` file:

```env
# Enable scheduled backups
BACKUP_ENABLED=true

# Cron schedule (default: 2 AM daily)
BACKUP_SCHEDULE=0 2 * * *

# Retention period in days
BACKUP_RETENTION_DAYS=30

# Backup directory
BACKUP_PATH=./backups

# Database configuration
DATABASE_TYPE=sqlite
DATABASE_URL=file:./data/recurb.db

# For PostgreSQL
# DATABASE_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=recurb
# DB_PASSWORD=secret
# DATABASE_URL=postgresql://recurb:secret@localhost:5432/recurb
```

## Cron Schedule Examples

- `0 2 * * *` - Daily at 2 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Weekly on Sunday at midnight
- `0 3 1 * *` - Monthly on the 1st at 3 AM

## API Usage

### Create Backup

```bash
POST /api/backup
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "success": true,
  "filePath": "./backups/backup-sqlite-2024-01-15.db",
  "size": 1048576,
  "timestamp": "2024-01-15T02:00:00.000Z"
}
```

### List Backups

```bash
GET /api/backup
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "backups": [
    {
      "file": "backup-sqlite-2024-01-15.db",
      "size": 1048576,
      "date": "2024-01-15T02:00:00.000Z"
    }
  ]
}
```

### Clean Old Backups

```bash
DELETE /api/backup
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "deleted": 5
}
```

## Database-Specific Notes

### SQLite

- Backups are simple file copies
- Database is locked briefly during backup
- Restore overwrites the current database file
- Original database is backed up before restore

### PostgreSQL

- Requires `pg_dump` and `psql` utilities installed
- Uses `PGPASSWORD` environment variable for authentication
- Backup creates SQL dump file
- Restore executes SQL commands

## Best Practices

1. **Test Restores**: Regularly test backup restoration
2. **Off-site Storage**: Copy backups to external storage (S3, etc.)
3. **Monitor Disk Space**: Ensure adequate space for backups
4. **Secure Backups**: Encrypt sensitive backup files
5. **Document Recovery**: Maintain recovery procedures

## Troubleshooting

### PostgreSQL: pg_dump not found

Install PostgreSQL client tools:

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Permission Denied

Ensure the backup directory is writable:

```bash
mkdir -p ./backups
chmod 755 ./backups
```

### Backup Service Not Running

Check if enabled in `.env`:

```env
BACKUP_ENABLED=true
```

Verify cron schedule is valid:

```bash
# Test schedule syntax
npm run backup:service
```

## Production Deployment

### Docker

Add to `docker-compose.yml`:

```yaml
services:
  backup:
    build: .
    command: npm run backup:service
    volumes:
      - ./backups:/app/backups
      - ./data:/app/data
    env_file:
      - .env
    restart: unless-stopped
```

### Systemd Service

Create `/etc/systemd/system/recurb-backup.service`:

```ini
[Unit]
Description=Recurb Backup Service
After=network.target

[Service]
Type=simple
User=recurb
WorkingDirectory=/opt/recurb
ExecStart=/usr/bin/npm run backup:service
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable recurb-backup
sudo systemctl start recurb-backup
```

## Recovery Procedures

### Full Database Recovery

1. Stop the application
2. Run restore command
3. Verify data integrity
4. Restart the application

```bash
# Stop app
pm2 stop recurb

# Restore backup
npm run restore -- --file ./backups/backup-sqlite-2024-01-15.db --yes

# Restart app
pm2 start recurb
```

### Point-in-Time Recovery (PostgreSQL)

For PostgreSQL with WAL archiving, consult PostgreSQL documentation for PITR procedures.

## Support

For issues or questions, see the main documentation or open an issue on GitHub.
