# Project Structure

This document outlines the organization and structure of the Subscription Tracker project codebase.

## Directory Structure

```
/
├── .kiro/                  # Kiro AI assistant configuration
│   ├── specs/              # Specifications for features
│   └── steering/           # Steering documents for AI guidance
├── app/                    # Next.js App Router structure
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard pages
│   │   ├── subscriptions/  # Subscription management
│   │   ├── analytics/      # Analytics views
│   │   ├── calendar/       # Renewal calendar
│   │   ├── invoices/       # Invoice management
│   │   ├── settings/       # User settings
│   │   └── team/           # Team management (Team plan)
│   ├── landing/            # Marketing/landing pages
│   └── pricing/            # Pricing plans
├── components/             # Reusable React components
│   ├── ui/                 # UI components (buttons, inputs, etc.)
│   ├── layout/             # Layout components
│   ├── dashboard/          # Dashboard-specific components
│   └── forms/              # Form components
├── lib/                    # Utility functions and shared code
│   ├── supabase/           # Supabase client and helpers
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── store/                  # Zustand state management
├── public/                 # Static assets
└── styles/                 # Global styles and Tailwind configuration
```

## Key Components

- **Authentication System**: Handles user registration, login, and plan selection using Supabase Auth
- **Subscription Manager**: Core functionality for CRUD operations on subscriptions
- **Analytics Dashboard**: Visualizations and reports for subscription data
- **Plan-based Feature Access**: Controls feature access based on user's subscription plan
- **Team Collaboration**: Enables team-based subscription management (Team plan)

## Architecture Patterns

- **Feature-based Organization**: Code is organized by feature rather than by technical role
- **Server Components**: Leverages Next.js server components for data fetching and rendering
- **Client Components**: Uses client components for interactive UI elements
- **API Routes**: Implements backend functionality through Next.js API routes
- **Database Access**: Uses Supabase client for database operations

## Naming Conventions

### Files and Directories

- Use kebab-case for file and directory names
- Page components use `page.tsx` naming convention (Next.js App Router)
- Layout components use `layout.tsx` naming convention
- API routes use `route.ts` naming convention

### Code Elements

- **Components**: PascalCase for component names (e.g., `SubscriptionCard.tsx`)
- **Functions/Methods**: camelCase for function names
- **Variables**: camelCase for variable names
- **Constants**: UPPER_SNAKE_CASE for global constants
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `SubscriptionType`)

## Import/Module Organization

- Group imports by external libraries first, then internal modules
- Use absolute imports with path aliases for better readability
- Organize component imports alphabetically

## Testing Structure

- **Unit Tests**: Located alongside the component/function being tested with `.test.ts(x)` suffix
- **Integration Tests**: Located in `__tests__` directories within feature folders
- **E2E Tests**: Located in `cypress` or `playwright` directory at the root level

## Configuration Files

- **.env.local**: Environment variables for local development
- **next.config.js**: Next.js configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
- **package.json**: Project dependencies and scripts

## Database Schema

### Tables

- **users**: User accounts and profile information
  - id, email, name, avatar_url, created_at, updated_at

- **subscriptions**: Core subscription data
  - id, user_id, name, amount, currency, billing_cycle, start_date, next_renewal_date, provider, auto_renewal, created_at, updated_at

- **subscription_tags**: Tags for categorizing subscriptions
  - id, subscription_id, tag_name

- **invoices**: Invoice documents linked to subscriptions
  - id, subscription_id, file_path, issue_date, amount, created_at

- **reminders**: Custom notification settings
  - id, subscription_id, days_before, notification_type, created_at

- **teams**: Team information (Team plan)
  - id, name, owner_id, created_at, updated_at

- **team_members**: Team membership and roles
  - id, team_id, user_id, role, created_at, updated_at

- **comments**: Shared notes on subscriptions (Team plan)
  - id, subscription_id, user_id, content, created_at

- **integrations**: External service connections (Team plan)
  - id, team_id, service_type, config_json, created_at, updated_at

### Relationships

- Users have many Subscriptions
- Subscriptions have many Tags
- Subscriptions have many Invoices
- Subscriptions have many Reminders
- Teams have many Team Members
- Subscriptions have many Comments
- Teams have many Integrations

## Plan-Based Access Control

The application implements feature access control based on the user's subscription plan:

### Implementation Strategy

1. **Plan Information Storage**:
   - Store user plan information in the users table
   - Plans: 'basic', 'pro', 'team'

2. **Feature Flag System**:
   - Create a central feature access control module in `lib/plans/features.ts`
   - Define feature availability by plan in a configuration object

3. **Access Control Components**:
   - Create a `PlanGate` component that conditionally renders features based on user's plan
   - Example: `<PlanGate feature="calendar" fallback={<UpgradeBanner />}>{children}</PlanGate>`

4. **API Route Protection**:
   - Implement middleware to check plan requirements before processing API requests
   - Return appropriate error responses for unauthorized feature access

5. **UI Adaptation**:
   - Show/hide UI elements based on plan level
   - Provide upgrade prompts for features requiring higher plans

---
*Note: Update this document as the project structure evolves.*