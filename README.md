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

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form, Zod
- **Authentication**: JWT
- **Data Visualization**: Chart.js

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo Accounts

For demonstration purposes, you can use the following accounts:

- **Free Plan**: free@example.com / password
- **Pro Plan**: pro@example.com / password
- **Team Plan**: team@example.com / password

## Project Structure

- `src/app`: Next.js App Router pages
- `src/components`: React components
  - `ui`: shadcn/ui components
  - `common`: Shared components
  - `subscriptions`: Subscription-related components
  - `analytics`: Analytics and chart components
  - `auth`: Authentication components
- `src/hooks`: Custom React hooks
  - `store`: Zustand stores
- `src/lib`: Utility functions and shared code
  - `schemas`: Zod schemas
  - `types`: TypeScript types
  - `auth`: Authentication utilities
  - `api`: API utilities

## Feature Implementation

- **Plan-based Access Control**: Implemented via middleware and Zustand store
- **Subscription CRUD**: Form-based UI with validation
- **CSV Import/Export**: File upload with validation
- **Analytics**: Interactive charts with Chart.js
- **Team Collaboration**: Role-based access control

## License

This project is licensed under the MIT License.