# Recurb - Subscription Management Dashboard

Recurb is a full-stack Next.js application for managing and visualizing recurring expenses across three service tiers.

## Features

### Free Plan
- Manual CRUD operations for subscriptions (up to 5)
- Tags and categories
- Basic MRR display

### Pro Plan
- Unlimited subscriptions
- CSV import/export
- Auto-renewal flags
- Tags and categories
- MRR/YRR display
- All Free features
- Unlimited subscriptions
- CSV import/export
- Auto-renewal flags
- MRR/YRR display
- Monthly breakdowns
- Category-wise trends
- Expense forecasting
- Duplicate detection
- PDF/IMG invoice uploads and linkage
- Enhanced exports
- Calendar view
- Vendor summaries
- Custom reminder scheduling and email renewals

### Team Plan
- All Pro features
- User management with roles
- Shared notes/comments
- Audit logs
- Slack/Discord webhook alerts

## Tech Stack

- **Frontend**: Next.js 15.4 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form, Zod
- **Authentication**: JWT (jose), bcryptjs
- **Database**: SQLite (better-sqlite3) with PostgreSQL/MySQL support
- **Data Visualization**: Chart.js, react-chartjs-2
- **UI Components**: Radix UI, Lucide Icons
- **File Handling**: React Dropzone, PapaParse (CSV)
- **Date Handling**: date-fns, react-day-picker

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-subscription-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` and configure your settings (JWT_SECRET, database, etc.)

4. Run database migrations:
```bash
npm run migrate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── subscriptions/     # Subscription management
│   ├── analytics/         # Analytics & reports
│   ├── calendar/          # Calendar view
│   ├── team/              # Team management
│   ├── settings/          # User settings
│   └── setup/             # Initial setup wizard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── common/           # Shared components
│   ├── subscriptions/    # Subscription components
│   ├── analytics/        # Chart components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard widgets
│   ├── team/             # Team components
│   ├── notifications/    # Notification system
│   └── settings/         # Settings components
├── hooks/                 # Custom React hooks
│   └── store/            # Zustand stores
├── lib/                   # Utilities & shared code
│   ├── db/               # Database layer
│   ├── schemas/          # Zod validation schemas
│   ├── types/            # TypeScript types
│   ├── auth/             # Auth utilities
│   ├── api/              # API utilities
│   ├── backup/           # Backup/restore logic
│   ├── config/           # Configuration
│   ├── setup/            # Setup utilities
│   └── utils/            # Helper functions
├── data/                  # Static data files
└── middleware.ts          # Next.js middleware

scripts/
├── migrate.ts             # Database migrations
├── rollback.ts            # Rollback migrations
├── backup.ts              # Manual backup
├── backup-service.ts      # Automated backup service
└── restore.ts             # Restore from backup

data/
└── recurb.db              # SQLite database (default)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run backup` - Create manual database backup
- `npm run backup:service` - Start automated backup service
- `npm run restore` - Restore database from backup

## Database Support

Recurb supports multiple database backends:

- **SQLite** (default) - Best for development and small deployments
- **PostgreSQL** - Recommended for production
- **MySQL** - Alternative production option

Configure via `DATABASE_TYPE` and `DATABASE_URL` in `.env.local`

## Key Features Implementation

- **Multi-tier Access Control**: Plan-based features via middleware and Zustand
- **Subscription Management**: Full CRUD with validation and file uploads
- **CSV Import/Export**: Bulk operations with PapaParse
- **Analytics Dashboard**: Interactive charts and forecasting
- **Team Collaboration**: Role-based access, shared notes, audit logs
- **Calendar View**: Visual subscription timeline
- **Backup/Restore**: Automated and manual database backups
- **Setup Wizard**: First-run configuration flow

## License

This project is licensed under the MIT License.