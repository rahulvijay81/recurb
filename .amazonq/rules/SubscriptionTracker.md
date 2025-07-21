# Subscription Tracker Rules

## Feature Gating by Plan

**Free**: Manual CRUD (5 subscriptions max), basic MRR display
**Basic**: Manual CRUD, CSV import/export, auto-renewal flags, tags/categories, MRR/YRR
**Pro**: Basic + monthly breakdowns, trends, forecasting, duplicate detection, invoice upload, calendar, vendor summaries, enhanced exports, custom reminders
**Team**: Pro + team management, shared notes, audit logs, Slack/Discord webhooks

Implement via middleware (server) and Zustand (client). Return 403 for unauthorized access.

## Core Rules

1. **Naming**: Components `PascalCase`, hooks `useCamelCase`, utils `camelCase`
2. **Types**: Zod schemas in `src/lib/schemas/`, strict typing, no `any`
3. **UI**: Use shadcn/ui components from `src/components/ui/`
4. **Auth**: Next.js + JWT with `plan` claims for gating
5. **State**: Zustand stores in `src/hooks/store/`, global auth/user store, feature-specific stores
6. **Errors**: Return `{ error?, data? }`, toast notifications, no raw stacks
7. **Data**: `cache: 'force-cache'` for analytics, `cache: 'no-store'` for forms
8. **Security**: No `.env` commits, validate all inputs
9. **Performance**: Lighthouse ≥90, semantic HTML, ARIA labels

## Project Structure

- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: React components organized by feature
  - `ui/`: shadcn/ui components
  - `common/`: Shared components (header, layout, etc.)
  - `auth/`, `dashboard/`, `subscriptions/`, `analytics/`, `team/`: Feature components
- `src/hooks/store/`: Zustand stores for state management
- `src/lib/`: Utilities and shared code
  - `schemas/`: Zod validation schemas
  - `types/`: TypeScript type definitions
  - `auth/`: Authentication utilities
  - `utils/`: Helper functions
- `src/data/`: Static data files (currencies.json)
- `src/middleware.ts`: Next.js middleware for auth/routing