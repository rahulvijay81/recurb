# Architecture Documentation

This document provides a comprehensive overview of Recurb's architecture, design patterns, and technical implementation.

## 📐 System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React 19   │  │  Zustand     │  │  Chart.js    │      │
│  │   Next.js 15 │  │  (State)     │  │  (Analytics) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js API │  │  Middleware  │  │  Auth (JWT)  │      │
│  │    Routes    │  │  (CSRF/Rate) │  │  + RBAC      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   SQLite     │  │  PostgreSQL  │  │    MySQL     │      │
│  │   (Default)  │  │  (Optional)  │  │  (Optional)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 15 (App Router, React Server Components)
- React 19 (UI rendering)
- TypeScript (Type safety)
- Tailwind CSS 4 (Styling)
- Shadcn/ui (Component library)
- Zustand 4.5 (State management)
- Chart.js (Data visualization)

**Backend:**
- Next.js API Routes (RESTful API)
- JWT (Authentication)
- bcryptjs (Password hashing)
- Zod (Schema validation)
- Node-cron (Scheduled tasks)

**Database:**
- SQLite (Default, zero-config)
- PostgreSQL (Production-ready)
- MySQL (Alternative option)
- Database adapters for multi-DB support

---

## 🗄️ Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'viewer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_cycle TEXT NOT NULL,
  category TEXT,
  next_billing_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  notes TEXT,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id INTEGER,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### shared_notes
```sql
CREATE TABLE shared_notes (
  id INTEGER PRIMARY KEY,
  subscription_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Entity Relationships

```
users (1) ──────< (N) subscriptions
users (1) ──────< (N) audit_logs
users (1) ──────< (N) shared_notes
subscriptions (1) ──────< (N) shared_notes
```

### Indexes

```sql
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## 🔐 Authentication Flow

### Login Process

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │   API    │         │ Database │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │ POST /api/auth/login                    │
     │ {email, password}  │                     │
     ├───────────────────>│                     │
     │                    │ Query user          │
     │                    ├────────────────────>│
     │                    │                     │
     │                    │<────────────────────┤
     │                    │ Verify password     │
     │                    │ (bcrypt.compare)    │
     │                    │                     │
     │                    │ Generate JWT        │
     │                    │ (jose library)      │
     │                    │                     │
     │ {token, user}      │                     │
     │<───────────────────┤                     │
     │                    │                     │
     │ Store in cookie    │                     │
     │ (httpOnly, secure) │                     │
     │                    │                     │
```

### JWT Token Structure

```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Role-Based Access Control (RBAC)

**Roles:**
- `admin` - Full system access
- `manager` - Manage subscriptions, view analytics
- `viewer` - Read-only access

**Permission Matrix:**

| Action                  | Admin | Manager | Viewer |
|------------------------|-------|---------|--------|
| View subscriptions     | ✅    | ✅      | ✅     |
| Create subscriptions   | ✅    | ✅      | ❌     |
| Edit subscriptions     | ✅    | ✅      | ❌     |
| Delete subscriptions   | ✅    | ✅      | ❌     |
| View analytics         | ✅    | ✅      | ✅     |
| Manage team            | ✅    | ❌      | ❌     |
| System settings        | ✅    | ❌      | ❌     |
| Audit logs             | ✅    | ❌      | ❌     |

---

## 🔌 API Design Patterns

### RESTful API Structure

```
/api
├── /auth
│   ├── /login          POST   - User login
│   ├── /logout         POST   - User logout
│   └── /me             GET    - Current user info
├── /subscriptions
│   ├── /               GET    - List subscriptions
│   ├── /               POST   - Create subscription
│   ├── /[id]           GET    - Get subscription
│   ├── /[id]           PUT    - Update subscription
│   ├── /[id]           DELETE - Delete subscription
│   ├── /import         POST   - Bulk import
│   └── /export         GET    - Export data
├── /analytics
│   ├── /overview       GET    - Dashboard stats
│   ├── /trends         GET    - Spending trends
│   └── /forecast       GET    - Financial forecast
├── /dashboard
│   └── /stats          GET    - Dashboard data
├── /admin
│   ├── /users          GET    - List users
│   └── /audit-logs     GET    - Audit logs
└── /setup
    └── /                POST   - Initial setup
```

### Request/Response Format

**Request:**
```typescript
// POST /api/subscriptions
{
  "name": "Netflix",
  "amount": 15.99,
  "currency": "USD",
  "billing_cycle": "monthly",
  "category": "Entertainment",
  "next_billing_date": "2024-02-01"
}
```

**Response (Success):**
```typescript
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Netflix",
    "amount": 15.99,
    // ... other fields
  }
}
```

**Response (Error):**
```typescript
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "amount": "Must be a positive number"
  }
}
```

### Middleware Stack

```
Request
  ↓
[CORS Headers]
  ↓
[Rate Limiting]
  ↓
[CSRF Protection]
  ↓
[JWT Verification]
  ↓
[Permission Check]
  ↓
[Route Handler]
  ↓
Response
```

---

## 🏪 State Management

### Zustand Store Architecture

```typescript
// Store structure
stores/
├── use-auth-store.ts          // Authentication state
├── use-subscription-store.ts  // Subscription data
├── use-notification-store.ts  // Notifications
├── use-team-store.ts          // Team management
├── use-audit-store.ts         // Audit logs
├── use-notes-store.ts         // Shared notes
└── use-theme-store.ts         // UI theme
```

### Store Pattern

```typescript
// Example: use-subscription-store.ts
interface SubscriptionStore {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (data: SubscriptionInput) => Promise<void>;
  updateSubscription: (id: number, data: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: number) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,
  
  fetchSubscriptions: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      set({ subscriptions: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  // ... other actions
}));
```

### State Flow

```
Component
  ↓ (useStore hook)
Store (Zustand)
  ↓ (API call)
API Route
  ↓ (Database query)
Database
  ↓ (Response)
Store Update
  ↓ (Re-render)
Component
```

---

## 🚀 Deployment Architecture

### Deployment Options

#### 1. Vercel (Recommended for Next.js)

```
┌─────────────────────────────────────┐
│         Vercel Edge Network         │
│  ┌───────────────────────────────┐  │
│  │   Next.js Application         │  │
│  │   (Serverless Functions)      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│    External Database (Optional)     │
│  ┌───────────────────────────────┐  │
│  │  PostgreSQL / MySQL           │  │
│  │  (Neon, PlanetScale, etc.)    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### 2. Docker Self-Hosted

```
┌─────────────────────────────────────┐
│         Docker Container            │
│  ┌───────────────────────────────┐  │
│  │   Next.js App                 │  │
│  │   Port: 3000                  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   SQLite Database             │  │
│  │   Volume: /data               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### 3. Traditional VPS

```
┌─────────────────────────────────────┐
│            VPS Server               │
│  ┌───────────────────────────────┐  │
│  │   Nginx (Reverse Proxy)       │  │
│  │   Port: 80/443                │  │
│  └───────────────────────────────┘  │
│              ↕                      │
│  ┌───────────────────────────────┐  │
│  │   Next.js (PM2)               │  │
│  │   Port: 3000                  │  │
│  └───────────────────────────────┘  │
│              ↕                      │
│  ┌───────────────────────────────┐  │
│  │   Database                    │  │
│  │   (SQLite/PostgreSQL/MySQL)   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Environment Configuration

```bash
# Database
DATABASE_TYPE=sqlite|postgres|mysql
DATABASE_URL=<connection_string>

# Authentication
JWT_SECRET=<random_secret_key>
JWT_EXPIRES_IN=7d

# Security
ENCRYPTION_KEY=<encryption_key>
CSRF_SECRET=<csrf_secret>

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"
```

---

## 📁 Project Structure

```
recurb/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── subscriptions/     # Subscription pages
│   │   ├── analytics/         # Analytics pages
│   │   ├── auth/              # Auth pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── subscriptions/    # Subscription components
│   │   └── common/           # Shared components
│   ├── lib/                   # Core libraries
│   │   ├── db/               # Database adapters
│   │   ├── auth/             # Auth utilities
│   │   ├── schemas/          # Zod schemas
│   │   └── utils/            # Helper functions
│   ├── hooks/                 # Custom React hooks
│   │   └── store/            # Zustand stores
│   └── middleware.ts          # Next.js middleware
├── scripts/                   # Utility scripts
│   ├── migrate.ts            # Database migrations
│   ├── backup.ts             # Backup utility
│   └── seed-categories.ts    # Seed data
├── public/                    # Static assets
└── data/                      # SQLite database (default)
```

---

## 🔒 Security Architecture

### Security Layers

1. **Transport Security**: HTTPS/TLS encryption
2. **Authentication**: JWT tokens with httpOnly cookies
3. **Authorization**: Role-based access control
4. **Input Validation**: Zod schema validation
5. **SQL Injection Prevention**: Parameterized queries
6. **CSRF Protection**: Token-based validation
7. **Rate Limiting**: API endpoint throttling
8. **Password Security**: bcrypt hashing with salt

### Security Best Practices

- Secrets stored in environment variables
- No sensitive data in client-side code
- Regular dependency updates
- Audit logging for sensitive operations
- Secure session management
- Input sanitization

---

## 📊 Performance Optimizations

- **Server Components**: Reduce client-side JavaScript
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Database Indexing**: Optimized queries
- **Caching**: API response caching
- **Lazy Loading**: Component-level lazy loading
- **Memoization**: React.memo and useMemo

---

## 🔄 Data Flow Example

### Creating a Subscription

```
1. User fills form → SubscriptionForm component
2. Form validation → Zod schema
3. Submit → useSubscriptionStore.addSubscription()
4. API call → POST /api/subscriptions
5. Middleware → Auth check, CSRF validation
6. Route handler → Validate input, insert DB
7. Database → Insert record, return ID
8. Response → Success with subscription data
9. Store update → Add to subscriptions array
10. UI update → Component re-renders with new data
11. Audit log → Record creation action
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Database Migration Guide](docs/database.md)
- [API Reference](docs/api.md)

---

For questions or contributions, see [CONTRIBUTING.md](CONTRIBUTING.md).
