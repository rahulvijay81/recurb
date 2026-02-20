# Recurb - Self-Hosted Development Plan

## Overview
Open-source subscription tracker for companies/enterprises with self-hosted deployment options.

## 1. Database Strategy

### Multi-Database Support
- **SQLite**: Default, zero-config, 1-10 users
- **PostgreSQL**: Enterprise, 10+ users, better concurrency
- **MySQL**: Optional, existing infrastructure support

### Implementation
- Use Drizzle ORM or Prisma
- Single schema, auto-migrations
- `DATABASE_TYPE=sqlite|postgres|mysql`

## 2. Deployment Models

### A. Docker Compose (Recommended)
- Next.js app container
- Optional PostgreSQL container
- Optional Redis container
- One command: `docker-compose up`

### B. Standalone Binary
- Bundled Next.js standalone output
- SQLite included by default
- Single executable (Windows/Linux/macOS)

### C. Kubernetes/Cloud
- Helm charts for enterprise
- Horizontal scaling support

## 3. Licensing Model

### Open Source Core (MIT/Apache 2.0)
- Free + Basic features
- SQLite support
- Self-hosted deployment
- Community support

### Enterprise Add-ons (Optional Paid)
- SSO/SAML integration
- Advanced audit logs
- Priority support
- Custom integrations
- Multi-tenancy

## 4. Configuration System

### Environment Variables
```
DATABASE_TYPE=sqlite|postgres
DATABASE_URL=file:./data/recurb.db
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_WEBHOOKS=true
MAX_FILE_SIZE_MB=10
JWT_SECRET=auto-generated
SESSION_TIMEOUT_HOURS=24
RATE_LIMIT_REQUESTS_PER_MINUTE=60
MULTI_TENANT_MODE=false
```

### Admin Panel
- `/admin/setup` - First-run wizard
- Database configuration
- Admin user creation
- Organization settings
- Feature toggles

## 5. Revised Feature Tiers

### Free (Self-Hosted Core)
- Unlimited users (single org)
- Unlimited subscriptions
- Manual CRUD, CSV import/export
- Basic analytics (MRR/YRR)
- SQLite database
- Email notifications (SMTP)

### Pro (Self-Hosted + Advanced)
- Everything in Free
- PostgreSQL support
- Advanced analytics (forecasting, trends)
- Invoice uploads (local/S3)
- Calendar view, vendor summaries
- Custom reminders
- API access

### Enterprise (Self-Hosted + Premium)
- Everything in Pro
- Multi-tenancy
- SSO/SAML/LDAP
- Advanced RBAC (custom roles)
- Audit logs with retention
- Webhooks (Slack/Discord/custom)
- High availability
- Professional support

## 6. Installation Methods

### One-Click Installer
```bash
curl -fsSL https://recurb.sh/install | sh
```

### Docker
```bash
docker run -p 3000:3000 -v ./data:/app/data recurb/app
```

### Manual
```bash
git clone https://github.com/yourorg/recurb
npm install && npm run build
npm start
```

## 7. Tech Stack Changes

### Add
- Drizzle ORM or Prisma (multi-DB)
- better-sqlite3 (SQLite)
- pg (PostgreSQL)
- Redis (optional, sessions/cache)
- Bull/BullMQ (background jobs)
- MinIO or S3 SDK (file storage)

### Remove/Make Optional
- Cloud-specific services
- Vendor lock-in dependencies

## 8. Documentation Structure

```
docs/
├── installation/
│   ├── docker.md
│   ├── standalone.md
│   ├── kubernetes.md
│   └── cloud-providers.md
├── configuration/
│   ├── database.md
│   ├── authentication.md
│   ├── email.md
│   └── storage.md
├── deployment/
│   ├── production-checklist.md
│   ├── backup-restore.md
│   └── scaling.md
└── api/
    └── rest-api.md
```

## 9. Migration Phases

### Phase 1: Core Refactor
- [ ] Implement ORM layer (Drizzle/Prisma)
- [ ] Abstract database operations
- [ ] Environment-based configuration
- [ ] Database adapters (SQLite/PostgreSQL/MySQL)

### Phase 2: Self-Hosted Features
- [ ] Docker setup (Dockerfile + docker-compose.yml)
- [ ] Admin setup wizard (/setup route)
- [ ] Backup/restore CLI tools
- [ ] Health check endpoints
- [ ] Installation scripts

### Phase 3: Enterprise Features
- [ ] Multi-tenancy support
- [ ] SSO/SAML integration
- [ ] Advanced RBAC system
- [ ] Audit logging
- [ ] Webhook system

## 10. Monetization Options

### Open Core Model
- Free self-hosted version
- Paid cloud-hosted version

### Support Plans
- Community (free)
- Business ($99/mo)
- Enterprise (custom)

### Additional Revenue
- Marketplace (paid plugins)
- Managed hosting service
- Professional services

## 11. Immediate Action Items

1. **Choose ORM**: Drizzle (lightweight) vs Prisma (feature-rich)
2. **Create Docker Setup**: Dockerfile + docker-compose.yml
3. **Database Abstraction**: src/lib/db/ with adapters
4. **Setup Wizard**: /setup route for first-run
5. **Update Documentation**: Self-hosting guides
6. **CI/CD Pipeline**: GitHub Actions for builds
7. **Release Strategy**: Semantic versioning, changelog

## 12. Security Considerations

- Auto-generate JWT secrets on first run
- Secure default configurations
- Rate limiting on all endpoints
- Input validation and sanitization
- Regular security audits
- Dependency vulnerability scanning
- HTTPS enforcement in production

## 13. Performance Targets

- Lighthouse score ≥90
- API response time <200ms (p95)
- Support 1000+ concurrent users (PostgreSQL)
- Database query optimization
- CDN for static assets
- Efficient caching strategy

## 14. Community & Support

- GitHub Discussions for community
- Discord/Slack for real-time help
- Contribution guidelines (CONTRIBUTING.md)
- Code of conduct (CODE_OF_CONDUCT.md)
- Issue templates
- PR templates
- Regular release cycles

## 15. Testing Strategy

- Unit tests (Jest)
- Integration tests (API routes)
- E2E tests (Playwright)
- Database migration tests
- Docker image tests
- Performance benchmarks
- Security scanning (SAST/DAST)
