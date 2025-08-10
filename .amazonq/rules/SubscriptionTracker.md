# Recurb - Subscription Tracker Rules

## Feature Gating by Plan

**Free**: Manual CRUD (5 subscriptions max), basic MRR display, read-only analytics
**Basic**: Manual CRUD (unlimited), CSV import/export, auto-renewal flags, tags/categories, MRR/YRR, basic notifications
**Pro**: Basic + monthly breakdowns, trends, forecasting, duplicate detection, invoice upload, calendar view, vendor summaries, enhanced exports, custom reminders, email notifications
**Team**: Pro + user management, role-based access, shared notes/comments, audit logs, Slack/Discord webhooks, team analytics, bulk operations

Implement via middleware (server) and Zustand (client). Return 403 for unauthorized access with clear error messages.

## Core Development Rules

### 1. Code Standards
- **Naming**: Components `PascalCase`, hooks `useCamelCase`, utils `camelCase`, constants `UPPER_SNAKE_CASE`
- **Files**: kebab-case for files, match component names for components
- **Types**: Zod schemas in `src/lib/schemas/`, strict typing, no `any`, prefer `unknown` over `any`
- **Imports**: Absolute imports with `@/` alias, group by external/internal/relative

### 2. UI/UX Standards
- **Components**: Use shadcn/ui from `src/components/ui/`, extend with variants
- **Styling**: Tailwind CSS, use design tokens, responsive-first approach
- **Forms**: React Hook Form + Zod validation, consistent error states
- **Loading**: Skeleton components, optimistic updates where possible
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### 3. Authentication & Authorization
- **Auth**: Next.js + JWT with `plan`, `role`, `permissions` claims
- **Sessions**: Secure httpOnly cookies, refresh token rotation
- **Middleware**: Route protection, plan validation, role checks
- **Client**: Zustand auth store with persistence, automatic token refresh

### 4. State Management
- **Global**: Zustand stores in `src/hooks/store/`
- **Auth Store**: User data, plan info, permissions
- **Feature Stores**: Subscriptions, analytics, team data
- **Local**: React state for component-specific data
- **Server**: React Query for API state, optimistic updates

### 5. Error Handling
- **API**: Return `{ success: boolean, data?, error?, message? }`
- **Client**: Toast notifications, form field errors, fallback UI
- **Logging**: Structured logs, no sensitive data, error boundaries
- **Validation**: Zod schemas on both client and server

### 6. Data & Caching
- **Analytics**: `cache: 'force-cache'`, revalidate on data changes
- **Forms**: `cache: 'no-store'`, immediate consistency
- **Static**: ISR for dashboard summaries, edge caching
- **Real-time**: WebSocket for team features, optimistic updates

### 7. Security
- **Environment**: No `.env` commits, validate all env vars
- **Input**: Sanitize and validate all user inputs
- **CORS**: Strict origin policies, secure headers
- **Rate Limiting**: API endpoints, file uploads, auth attempts
- **File Uploads**: Type validation, size limits, virus scanning

### 8. Performance
- **Metrics**: Lighthouse ≥90, Core Web Vitals
- **Images**: Next.js Image component, WebP format
- **Bundles**: Code splitting, dynamic imports for heavy features
- **Database**: Query optimization, connection pooling
- **CDN**: Static assets, image optimization

## Enhanced Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── common/           # Shared components (Header, Footer, etc.)
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── subscriptions/    # Subscription CRUD components
│   ├── analytics/        # Charts and analytics components
│   ├── team/             # Team management components
│   └── forms/            # Reusable form components
├── hooks/                # Custom React hooks
│   ├── store/            # Zustand stores
│   ├── api/              # API hooks (React Query)
│   └── utils/            # Utility hooks
├── lib/                  # Utilities and shared code
│   ├── schemas/          # Zod validation schemas
│   ├── types/            # TypeScript type definitions
│   ├── auth/             # Authentication utilities
│   ├── api/              # API client utilities
│   ├── utils/            # Helper functions
│   ├── constants/        # App constants
│   └── config/           # Configuration files
├── data/                 # Static data files
│   ├── currencies.json   # Currency definitions
│   ├── categories.json   # Default categories
│   └── plans.json        # Plan configurations
└── middleware.ts         # Next.js middleware
```

## API Design Standards

### REST Conventions
- **Endpoints**: `/api/v1/resource` format
- **Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Status**: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- **Pagination**: `?page=1&limit=20&sort=createdAt&order=desc`
- **Filtering**: `?category=software&status=active&search=netflix`

### Response Format
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: { total: number; page: number; limit: number; };
}
```

## Testing Standards

- **Unit**: Jest + Testing Library for components and utilities
- **Integration**: API route testing with mock data
- **E2E**: Playwright for critical user flows
- **Coverage**: Minimum 80% for business logic
- **Mocking**: MSW for API mocking in tests

## Deployment & DevOps

- **Environment**: Development, Staging, Production
- **CI/CD**: GitHub Actions with automated testing
- **Monitoring**: Error tracking, performance monitoring
- **Backups**: Automated database backups
- **Scaling**: Horizontal scaling for API, CDN for assets