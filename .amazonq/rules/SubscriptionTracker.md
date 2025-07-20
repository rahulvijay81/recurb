# Subscription Tracker Rules

## Feature Gating by Plan

**Basic**: Manual CRUD, CSV import/export, auto-renewal flags, tags/categories, MRR/YRR
**Pro**: Basic + monthly breakdowns, trends, forecasting, duplicate detection, invoice upload, calendar, vendor summaries, enhanced exports, custom reminders
**Team**: Pro + team management, shared notes, audit logs, Slack/Discord webhooks

Implement via middleware (server) and Zustand (client). Return 403 for unauthorized access.

## Core Rules

1. **Naming**: Components `PascalCase`, hooks `useCamelCase`, utils `camelCase`
2. **Types**: Zod schemas in `lib/schemas/`, strict typing, no `any`
3. **UI**: Use shadcn/ui components from `src/components/ui`
4. **Auth**: Next.js + PostgreSQL + JWT with `plan` claims for gating
5. **State**: Global Zustand store for user/plan, feature stores for local state
6. **Errors**: Return `{ error?, data? }`, toast notifications, no raw stacks
7. **Data**: `cache: 'force-cache'` for analytics, `cache: 'no-store'` for forms
8. **Security**: No `.env` commits, validate all inputs
9. **Performance**: Lighthouse ≥90, semantic HTML, ARIA labels