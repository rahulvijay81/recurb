# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Docker configuration and docker-compose setup
- Health check endpoint
- Bundle size optimization
- Enhanced logging system

## [1.0.0] - 2024-XX-XX

### Added
- 🎉 Initial public release
- Multi-database support (SQLite, PostgreSQL, MySQL)
- JWT-based authentication system
- Role-based access control (Admin, Manager, Viewer)
- Subscription management (CRUD operations)
- Dashboard with financial overview
- Advanced analytics and forecasting
- Expense tracking and trends visualization
- Duplicate subscription detection
- Bulk import/export functionality
- Calendar view for subscription renewals
- Smart notifications and renewal alerts
- Multi-currency support
- Team collaboration features
- Audit logging system
- Dark mode support
- Responsive design for mobile/tablet/desktop
- Database migration system
- Backup and restore functionality
- Rate limiting on API endpoints
- CSRF protection
- Input validation with Zod schemas

### Security
- Password hashing with bcryptjs
- SQL injection prevention with parameterized queries
- Secure JWT token implementation
- Environment variable validation

---

## Release Notes

### Version 1.0.0 - Initial Release

This is the first public release of Recurb, a self-hosted subscription management platform.

**Key Features:**
- Complete subscription lifecycle management
- Advanced analytics and financial forecasting
- Multi-database support for flexibility
- Team collaboration with role-based permissions
- Beautiful, modern UI with dark mode
- Privacy-first, self-hosted solution

**Tech Stack:**
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand for state management
- Chart.js for analytics
- Shadcn/ui components

**Getting Started:**
See [README.md](README.md) for installation instructions.

**Documentation:**
- [Installation Guide](docs/installation.md)
- [Configuration](docs/configuration.md)
- [Contributing](CONTRIBUTING.md)

---

## Types of Changes

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities

[Unreleased]: https://github.com/rahulvijay81/recurb/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/rahulvijay81/recurb/releases/tag/v1.0.0
