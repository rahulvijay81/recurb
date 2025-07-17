# Technical Stack

This document outlines the technical stack, build system, and development workflows for the Subscription Tracker project.

## Tech Stack

- **Programming Language(s)**: TypeScript
- **Framework(s)**: Next.js (full-stack framework)
- **Database**: Supabase (PostgreSQL)
- **Frontend**: React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API routes, Supabase
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Infrastructure**: To be determined (likely Vercel for Next.js hosting)

## Dependencies

- **Next.js**: Full-stack React framework for server-rendered applications
- **TypeScript**: Typed superset of JavaScript for improved developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Reusable UI component library built on Radix UI
- **Lucid React Icons**: Simple, clean icon library for React applications
- **Supabase**: Open-source Firebase alternative with PostgreSQL database
- **Zustand**: Lightweight state management solution
- **Axios**: Promise-based HTTP client for API requests
- **React Hook Form**: Form validation library (recommended for forms)
- **Zod**: TypeScript-first schema validation (recommended for validation)

## Build System

- **Build Tool**: Next.js build system
- **Package Manager**: npm or yarn (to be decided)

## Common Commands

### Setup

```bash
# Install dependencies
npm install
# or
yarn install

# Setup environment variables
cp .env.example .env.local
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev

# Open browser at localhost:3000
```

### Testing

```bash
# Run all tests
npm run test
# or
yarn test

# Run specific test suite
npm run test:unit
# or
yarn test:unit
```

### Building

```bash
# Build for production
npm run build
# or
yarn build

# Start production build locally
npm run start
# or
yarn start
```

### Deployment

```bash
# Deploy to Vercel (recommended)
vercel

# Deploy to production
vercel --prod
```

## Code Quality Tools

- **Linter**: ESLint with Next.js configuration
- **Formatter**: Prettier
- **Static Analysis**: TypeScript compiler

## CI/CD

- **CI Platform**: GitHub Actions (recommended)
- **Pipelines**: 
  - Build and test on pull requests
  - Deploy to staging on merge to development branch
  - Deploy to production on merge to main branch

---
*Note: Update this document as the tech stack evolves.*