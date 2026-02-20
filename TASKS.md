# Recurb - Development Tasks

## Phase 1: Core Refactor (Foundation)

### P0 - Critical Path

- [ ] **T1.1** Choose ORM (Drizzle vs Prisma)
  - Research: Performance, bundle size, TypeScript support
  - Decision: Document rationale in `docs/decisions/orm-choice.md`

- [ ] **T1.2** Database Abstraction Layer
  - Create `src/lib/db/index.ts` with connection factory
  - Create `src/lib/db/adapters/sqlite.ts`
  - Create `src/lib/db/adapters/postgres.ts`
  - Create `src/lib/db/adapters/mysql.ts`
  - Add connection pooling
  - Timeline: 3 days
  - Depends on: T1.1

- [ ] **T1.3** Define Database Schema
  - Create `src/lib/db/schema/` directory
  - Define tables: users, subscriptions, organizations, audit_logs
  - Add indexes and constraints
  - Timeline: 2 days
  - Depends on: T1.2

- [ ] **T1.4** Migration System
  - Setup auto-migration on startup
  - Create manual migration CLI: `npm run migrate`
  - Add rollback support
  - Timeline: 2 days
  - Depends on: T1.3

### P1 - High Priority

- [ ] **T1.5** Environment Configuration
  - Create `.env.example` with all variables
  - Add `src/lib/config/env.ts` with validation (Zod)
  - Add runtime config validation
  - Timeline: 1 day

- [ ] **T1.6** Refactor Existing API Routes
  - Update `/api/subscriptions/*` to use new DB layer
  - Update `/api/auth/*` to use new DB layer
  - Update `/api/analytics/*` to use new DB layer
  - Timeline: 3 days
  - Depends on: T1.4

- [ ] **T1.7** Update Zustand Stores
  - Ensure compatibility with new API responses
  - Add error handling for DB connection issues
  - Timeline: 1 day
  - Depends on: T1.6

## Phase 2: Self-Hosted Features

### P0 - Critical Path

- [ ] **T2.1** Docker Setup
  - Create `Dockerfile` (multi-stage build)
  - Create `docker-compose.yml` (app + PostgreSQL + Redis)
  - Create `.dockerignore`
  - Add health check endpoint: `/api/health`
  - Timeline: 2 days

- [ ] **T2.2** Setup Wizard
  - Create `/setup` route (protected, first-run only)
  - UI: Database selection, admin user creation, org settings
  - Create `src/lib/setup/wizard.ts` logic
  - Store setup completion flag in DB
  - Timeline: 3 days
  - Depends on: T1.6

- [ ] **T2.3** Installation Scripts
  - Create `scripts/install.sh` (Linux/macOS)
  - Create `scripts/install.ps1` (Windows)
  - Add dependency checks (Node.js, Docker)
  - Timeline: 2 days

### P1 - High Priority

- [ ] **T2.4** Backup/Restore System
  - Create `scripts/backup.ts` (CLI tool)
  - Create `scripts/restore.ts` (CLI tool)
  - Support SQLite file copy + PostgreSQL pg_dump
  - Add scheduled backups (cron/Bull)
  - Timeline: 3 days

- [ ] **T2.5** Admin Panel
  - Create `/admin` route group
  - Pages: System info, database status, user management
  - Add feature toggles UI
  - Timeline: 4 days
  - Depends on: T2.2

- [ ] **T2.6** Health & Monitoring
  - Endpoint: `/api/health` (DB, Redis, disk space)
  - Endpoint: `/api/metrics` (Prometheus format)
  - Add structured logging (Winston/Pino)
  - Timeline: 2 days

## Phase 3: Enterprise Features

### P1 - High Priority

- [ ] **T3.1** Multi-Tenancy
  - Add `organization_id` to all tables
  - Create tenant isolation middleware
  - Add tenant context to Zustand stores
  - Update all queries with tenant filtering
  - Timeline: 5 days
  - Depends on: T1.6

- [ ] **T3.2** Advanced RBAC
  - Define permission system in `src/lib/auth/permissions.ts`
  - Create `roles` and `permissions` tables
  - Update middleware for permission checks
  - UI: Role management in admin panel
  - Timeline: 4 days
  - Depends on: T2.5

- [ ] **T3.3** Audit Logging
  - Create `audit_logs` table
  - Add audit middleware for all mutations
  - UI: Audit log viewer in admin panel
  - Add log retention policies
  - Timeline: 3 days
  - Depends on: T3.2

### P2 - Medium Priority

- [ ] **T3.4** SSO/SAML Integration
  - Add `passport-saml` or similar library
  - Create `/api/auth/saml/*` routes
  - UI: SAML configuration in admin panel
  - Support multiple identity providers
  - Timeline: 5 days
  - Depends on: T2.5

- [ ] **T3.5** Webhook System
  - Create `webhooks` table
  - Add webhook delivery queue (Bull)
  - Support Slack, Discord, custom endpoints
  - UI: Webhook management
  - Add retry logic and failure handling
  - Timeline: 4 days

- [ ] **T3.6** API Access
  - Create API key system
  - Add `/api/v1/*` REST endpoints
  - Generate OpenAPI/Swagger docs
  - Add rate limiting per API key
  - Timeline: 4 days

## Phase 4: Documentation & Release

### P0 - Critical Path

- [ ] **T4.1** Installation Docs
  - Write `docs/installation/docker.md`
  - Write `docs/installation/standalone.md`
  - Write `docs/installation/kubernetes.md`
  - Add troubleshooting section
  - Timeline: 2 days

- [ ] **T4.2** Configuration Docs
  - Write `docs/configuration/database.md`
  - Write `docs/configuration/authentication.md`
  - Write `docs/configuration/email.md`
  - Write `docs/configuration/storage.md`
  - Timeline: 2 days

- [ ] **T4.3** API Documentation
  - Generate OpenAPI spec
  - Setup Swagger UI at `/api/docs`
  - Write `docs/api/rest-api.md`
  - Add code examples (curl, JavaScript, Python)
  - Timeline: 2 days
  - Depends on: T3.6

### P1 - High Priority

- [ ] **T4.4** Deployment Guides
  - Write `docs/deployment/production-checklist.md`
  - Write `docs/deployment/backup-restore.md`
  - Write `docs/deployment/scaling.md`
  - Add security best practices
  - Timeline: 2 days

- [ ] **T4.5** Community Setup
  - Create `CONTRIBUTING.md`
  - Create `CODE_OF_CONDUCT.md`
  - Setup GitHub issue templates
  - Setup PR templates
  - Create Discord/Slack community
  - Timeline: 1 day

- [ ] **T4.6** CI/CD Pipeline
  - GitHub Actions: Lint, test, build
  - Docker image build and push
  - Automated releases (semantic versioning)
  - Security scanning (Snyk/Dependabot)
  - Timeline: 2 days

## Phase 5: Testing & Quality

### P0 - Critical Path

- [ ] **T5.1** Unit Tests
  - Test database adapters
  - Test API utilities
  - Test authentication logic
  - Target: 80% coverage
  - Timeline: 4 days

- [ ] **T5.2** Integration Tests
  - Test all API routes
  - Test database migrations
  - Test multi-tenant isolation
  - Timeline: 3 days
  - Depends on: T5.1

- [ ] **T5.3** E2E Tests
  - Setup Playwright
  - Test critical flows: signup, subscription CRUD, analytics
  - Test setup wizard
  - Timeline: 3 days

### P1 - High Priority

- [ ] **T5.4** Performance Testing
  - Load test with k6 or Artillery
  - Database query optimization
  - Add caching where needed
  - Target: <200ms API response (p95)
  - Timeline: 2 days

- [ ] **T5.5** Security Audit
  - SAST scanning (SonarQube)
  - Dependency vulnerability scan
  - Penetration testing
  - Fix critical/high issues
  - Timeline: 3 days

## Quick Wins (Can be done anytime)

- [ ] **QW1** Add `CHANGELOG.md`
- [ ] **QW2** Setup GitHub Discussions
- [ ] **QW3** Create demo video/GIF for README
- [ ] **QW4** Add badges to README (build status, coverage, license)
- [ ] **QW5** Create `LICENSE` file (MIT/Apache 2.0)
- [ ] **QW6** Setup Dependabot for dependency updates
- [ ] **QW7** Add `.editorconfig` for consistent formatting
- [ ] **QW8** Create issue labels and milestones

## Estimated Timeline

- **Phase 1**: 2 weeks
- **Phase 2**: 2 weeks
- **Phase 3**: 3 weeks
- **Phase 4**: 1.5 weeks
- **Phase 5**: 2 weeks

**Total**: ~10.5 weeks (2.5 months)

## Priority Legend

- **P0**: Critical path, blocks other work
- **P1**: High priority, important for release
- **P2**: Medium priority, nice to have
- **P3**: Low priority, future enhancement

## Task Status

- [ ] Not started
- [x] Completed
- [~] In progress
- [!] Blocked

## Notes

- Update this file as tasks are completed
- Add new tasks as requirements emerge
- Link to GitHub issues for detailed tracking
- Review priorities weekly
