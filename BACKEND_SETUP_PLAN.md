# Backend Setup Plan

## Current State Analysis
- ✅ JWT auth utilities exist
- ✅ Middleware for route protection
- ✅ Zod schemas defined
- ❌ No database layer
- ❌ No ORM setup
- ❌ No API routes implementation
- ❌ No data persistence

## Backend Architecture Plan

### Phase 1: Database Layer Setup

#### 1.1 Choose ORM
**Recommended: Drizzle ORM** (lightweight, type-safe, multi-DB)
```bash
npm install drizzle-orm better-sqlite3 pg
npm install -D drizzle-kit @types/better-sqlite3
```

#### 1.2 Database Configuration
**File: `src/lib/db/config.ts`**
- Read `DATABASE_TYPE` from env
- Create connection based on type
- Export db instance

**File: `src/lib/db/schema.ts`**
- Define tables: users, subscriptions, teams, audit_logs, notes
- Use Drizzle schema syntax
- Export types

**File: `drizzle.config.ts`**
- Configure migrations
- Set dialect based on DATABASE_TYPE

#### 1.3 Migration System
```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Visual DB editor
```

### Phase 2: API Routes Implementation

#### 2.1 Auth API Routes
**`/api/auth/register` (POST)**
- Validate with Zod schema
- Hash password (bcrypt)
- Create user in DB
- Return JWT token

**`/api/auth/login` (POST)**
- Validate credentials
- Verify password
- Return JWT token
- Set httpOnly cookie

**`/api/auth/logout` (POST)**
- Clear auth cookie
- Return success

**`/api/auth/me` (GET)**
- Get current user from token
- Return user data

#### 2.2 Subscription API Routes
**`/api/subscriptions` (GET)**
- List user subscriptions
- Support pagination, filtering, sorting
- Check plan limits

**`/api/subscriptions` (POST)**
- Create subscription
- Validate with Zod
- Check plan limits (Free: 5 max)
- Return created subscription

**`/api/subscriptions/[id]` (GET)**
- Get single subscription
- Verify ownership

**`/api/subscriptions/[id]` (PUT)**
- Update subscription
- Validate with Zod
- Verify ownership

**`/api/subscriptions/[id]` (DELETE)**
- Delete subscription
- Verify ownership
- Cascade delete related data

**`/api/subscriptions/import` (POST)**
- Parse CSV file
- Validate rows
- Bulk insert
- Return success/errors

**`/api/subscriptions/export` (GET)**
- Export to CSV
- Apply filters
- Return file

#### 2.3 Analytics API Routes
**`/api/analytics/overview` (GET)**
- Calculate MRR, YRR
- Count active subscriptions
- Group by category
- Return summary

**`/api/analytics/trends` (GET)**
- Monthly breakdown
- Category trends
- Forecasting (Pro+)
- Return chart data

**`/api/analytics/vendors` (GET)**
- Group by vendor
- Calculate totals
- Return vendor summaries

#### 2.4 Team API Routes (Team Plan)
**`/api/team/members` (GET, POST)**
- List team members
- Invite new members

**`/api/team/members/[id]` (PUT, DELETE)**
- Update member role
- Remove member

**`/api/team/notes` (GET, POST)**
- Shared notes on subscriptions

#### 2.5 Settings API Routes
**`/api/settings/profile` (GET, PUT)**
- User profile data
- Update preferences

**`/api/settings/notifications` (GET, PUT)**
- Notification preferences
- Email settings

### Phase 3: Database Models

#### 3.1 Users Table
```typescript
{
  id: uuid (PK)
  email: string (unique)
  password: string (hashed)
  name: string
  plan: enum (free, basic, pro, team)
  role: enum (owner, admin, member, viewer)
  teamId: uuid (FK, nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3.2 Subscriptions Table
```typescript
{
  id: uuid (PK)
  userId: uuid (FK)
  teamId: uuid (FK, nullable)
  name: string
  vendor: string
  amount: decimal
  currency: string
  billingCycle: enum (monthly, yearly, quarterly)
  nextBillingDate: date
  category: string
  tags: string[]
  autoRenew: boolean
  status: enum (active, cancelled, paused)
  notes: text
  invoiceUrl: string (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3.3 Teams Table
```typescript
{
  id: uuid (PK)
  name: string
  plan: enum (team)
  ownerId: uuid (FK)
  settings: json
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3.4 Audit Logs Table
```typescript
{
  id: uuid (PK)
  userId: uuid (FK)
  teamId: uuid (FK, nullable)
  action: string
  resource: string
  resourceId: uuid
  metadata: json
  createdAt: timestamp
}
```

#### 3.5 Notes Table
```typescript
{
  id: uuid (PK)
  subscriptionId: uuid (FK)
  userId: uuid (FK)
  content: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Phase 4: Repository Pattern

#### 4.1 Create Repositories
**File: `src/lib/db/repositories/user.repository.ts`**
- findById, findByEmail
- create, update, delete
- findByTeamId

**File: `src/lib/db/repositories/subscription.repository.ts`**
- findByUserId, findByTeamId
- create, update, delete
- findUpcoming (for reminders)
- calculateMRR, calculateYRR

**File: `src/lib/db/repositories/team.repository.ts`**
- findById, create, update
- addMember, removeMember
- updateMemberRole

**File: `src/lib/db/repositories/audit.repository.ts`**
- create (log action)
- findByUserId, findByTeamId
- findByResource

### Phase 5: Business Logic Layer

#### 5.1 Services
**File: `src/lib/services/auth.service.ts`**
- register, login, logout
- verifyToken, refreshToken
- Password hashing/verification

**File: `src/lib/services/subscription.service.ts`**
- CRUD operations
- Plan limit checks
- Duplicate detection
- Import/export logic

**File: `src/lib/services/analytics.service.ts`**
- Calculate MRR/YRR
- Generate trends
- Forecasting algorithms
- Category breakdowns

**File: `src/lib/services/notification.service.ts`**
- Send email reminders
- Webhook triggers
- Schedule notifications

### Phase 6: Middleware & Guards

#### 6.1 API Middleware
**File: `src/lib/middleware/auth.middleware.ts`**
- Verify JWT token
- Attach user to request
- Handle token refresh

**File: `src/lib/middleware/plan.middleware.ts`**
- Check plan access
- Return 403 if unauthorized
- Feature gating logic

**File: `src/lib/middleware/rate-limit.middleware.ts`**
- Rate limiting per user
- Prevent abuse

**File: `src/lib/middleware/validation.middleware.ts`**
- Validate request body with Zod
- Return 400 on validation error

### Phase 7: Environment Configuration

#### 7.1 Update .env.example
```env
# Database
DATABASE_TYPE=sqlite
DATABASE_URL=file:./data/recurb.db
# or
# DATABASE_TYPE=postgres
# DATABASE_URL=postgresql://user:pass@localhost:5432/recurb

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=24h

# App
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@recurb.com

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Features
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_WEBHOOKS=true
ENABLE_FILE_UPLOADS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Phase 8: Utility Functions

#### 8.1 Database Utilities
**File: `src/lib/db/seed.ts`**
- Seed demo data
- Create default categories
- Create test users

**File: `src/lib/db/backup.ts`**
- Backup database
- Restore from backup
- Schedule backups

#### 8.2 API Utilities
**File: `src/lib/api/response.ts`**
- Standard response format
- Error response helper
- Success response helper

**File: `src/lib/api/error-handler.ts`**
- Global error handler
- Log errors
- Return user-friendly messages

### Phase 9: Testing Setup

#### 9.1 Test Database
- Use SQLite in-memory for tests
- Mock external services
- Seed test data

#### 9.2 API Tests
- Test all endpoints
- Test authentication
- Test authorization
- Test validation

### Phase 10: Docker Setup

#### 10.1 Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### 10.2 docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_TYPE=postgres
      - DATABASE_URL=postgresql://recurb:password@db:5432/recurb
    depends_on:
      - db
  
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=recurb
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=recurb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Implementation Order

### Week 1: Database Foundation
1. Install Drizzle ORM
2. Create database schema
3. Setup migrations
4. Create repositories
5. Test CRUD operations

### Week 2: Auth & Core APIs
1. Implement auth service
2. Create auth API routes
3. Update middleware
4. Test authentication flow

### Week 3: Subscription APIs
1. Implement subscription service
2. Create subscription API routes
3. Add plan limit checks
4. Test CRUD operations

### Week 4: Analytics & Advanced Features
1. Implement analytics service
2. Create analytics API routes
3. Add import/export
4. Test calculations

### Week 5: Team Features & Polish
1. Implement team service
2. Create team API routes
3. Add audit logging
4. Docker setup

## File Structure After Setup

```
src/
├── lib/
│   ├── db/
│   │   ├── config.ts              # DB connection
│   │   ├── schema.ts              # Drizzle schema
│   │   ├── seed.ts                # Seed data
│   │   ├── backup.ts              # Backup utilities
│   │   └── repositories/          # Data access layer
│   │       ├── user.repository.ts
│   │       ├── subscription.repository.ts
│   │       ├── team.repository.ts
│   │       └── audit.repository.ts
│   ├── services/                  # Business logic
│   │   ├── auth.service.ts
│   │   ├── subscription.service.ts
│   │   ├── analytics.service.ts
│   │   ├── team.service.ts
│   │   └── notification.service.ts
│   ├── middleware/                # API middleware
│   │   ├── auth.middleware.ts
│   │   ├── plan.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── validation.middleware.ts
│   └── api/
│       ├── response.ts            # Response helpers
│       └── error-handler.ts       # Error handling
├── app/
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── subscriptions/
│       │   ├── route.ts           # GET, POST
│       │   ├── [id]/route.ts      # GET, PUT, DELETE
│       │   ├── import/route.ts
│       │   └── export/route.ts
│       ├── analytics/
│       │   ├── overview/route.ts
│       │   ├── trends/route.ts
│       │   └── vendors/route.ts
│       ├── team/
│       │   ├── members/route.ts
│       │   └── notes/route.ts
│       └── settings/
│           ├── profile/route.ts
│           └── notifications/route.ts
└── drizzle.config.ts              # Drizzle configuration
```

## Next Steps

1. **Choose ORM**: Confirm Drizzle ORM
2. **Install Dependencies**: Run npm install commands
3. **Create Database Schema**: Define all tables
4. **Setup Migrations**: Configure drizzle-kit
5. **Implement Repositories**: Data access layer
6. **Create API Routes**: One by one
7. **Test Each Feature**: Unit + integration tests
8. **Docker Setup**: Containerize application
