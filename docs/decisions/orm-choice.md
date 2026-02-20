# ORM Choice: Drizzle vs Prisma

**Date**: 2024
**Status**: Recommended - Drizzle ORM
**Decision Maker**: Development Team

## Context

Recurb requires a robust ORM for multi-database support (SQLite, PostgreSQL, MySQL) with strong TypeScript integration, optimal performance, and minimal bundle size for self-hosted deployments.

## Options Evaluated

### 1. Drizzle ORM
### 2. Prisma

## Comparison Matrix

| Criteria | Drizzle | Prisma | Winner |
|----------|---------|--------|--------|
| **Performance** | ~2-3x faster queries | Baseline | ✅ Drizzle |
| **Bundle Size** | ~30KB | ~500KB+ | ✅ Drizzle |
| **TypeScript** | Native TS, type-safe | Generated types | ✅ Drizzle |
| **Multi-DB** | SQLite, PostgreSQL, MySQL | SQLite, PostgreSQL, MySQL | 🟰 Tie |
| **Migrations** | SQL-based, manual | Auto-generate, declarative | ⚠️ Trade-off |
| **Learning Curve** | SQL knowledge helpful | Abstracted, easier | ⚠️ Prisma |
| **Query Builder** | SQL-like, composable | Fluent API | 🟰 Tie |
| **Edge Runtime** | Full support | Limited | ✅ Drizzle |
| **Connection Pooling** | Built-in support | Requires Prisma Accelerate | ✅ Drizzle |
| **Schema as Code** | TypeScript schema | Prisma schema language | ✅ Drizzle |
| **Maturity** | Newer, growing | Mature, established | ⚠️ Prisma |

## Detailed Analysis

### Performance

**Drizzle**:
- Zero-overhead abstraction over SQL
- No query engine runtime
- Direct SQL execution
- Benchmarks show 2-3x faster than Prisma in most scenarios

**Prisma**:
- Query engine adds overhead
- Additional process/binary required
- Good for most use cases but slower at scale

**Verdict**: Drizzle wins for self-hosted performance-critical app

### Bundle Size

**Drizzle**:
- ~30KB core
- No runtime engine
- Tree-shakeable
- Critical for self-hosted deployments

**Prisma**:
- ~500KB+ client
- Requires query engine binary (~20MB)
- Larger Docker images

**Verdict**: Drizzle significantly better for deployment size

### TypeScript Support

**Drizzle**:
```typescript
// Schema is TypeScript
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
});

// Inferred types
type Subscription = typeof subscriptions.$inferSelect;
```

**Prisma**:
```prisma
// Separate schema language
model Subscription {
  id     Int     @id @default(autoincrement())
  name   String
  amount Decimal @db.Decimal(10, 2)
}

// Generated types
import { Subscription } from '@prisma/client'
```

**Verdict**: Drizzle's native TypeScript is more maintainable

### Multi-Database Support

**Both** support SQLite, PostgreSQL, and MySQL with similar APIs.

**Drizzle**:
```typescript
// Easy adapter switching
import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/better-sqlite3';
```

**Prisma**:
```prisma
datasource db {
  provider = "postgresql" // or "sqlite" or "mysql"
}
```

**Verdict**: Tie - both handle multi-DB well

### Migrations

**Drizzle**:
- SQL-based migrations
- Manual control
- `drizzle-kit generate` creates SQL files
- More transparent, easier to debug

**Prisma**:
- Declarative schema
- `prisma migrate dev` auto-generates
- Less control but faster iteration
- Better for rapid prototyping

**Verdict**: Trade-off - Drizzle for control, Prisma for speed

### Edge Runtime Support

**Drizzle**:
- Full Cloudflare Workers support
- Vercel Edge Functions compatible
- No binary dependencies

**Prisma**:
- Limited edge support
- Requires Prisma Accelerate (paid)
- Binary engine incompatible with edge

**Verdict**: Drizzle wins for modern deployment targets

### Developer Experience

**Drizzle**:
- SQL-like syntax (familiar to SQL developers)
- Composable queries
- Less magic, more explicit
- Steeper learning curve for SQL beginners

**Prisma**:
- Intuitive fluent API
- Excellent documentation
- Great for SQL beginners
- More abstraction

**Verdict**: Depends on team - Prisma easier for beginners

## Decision: Drizzle ORM

### Rationale

1. **Performance**: 2-3x faster queries critical for self-hosted deployments
2. **Bundle Size**: 30KB vs 500KB+ matters for Docker images and startup time
3. **TypeScript-First**: Native TS schema aligns with project standards
4. **Edge Support**: Future-proof for serverless/edge deployments
5. **Control**: SQL-based migrations provide transparency for enterprise users
6. **No Vendor Lock-in**: No proprietary schema language

### Trade-offs Accepted

- Steeper learning curve (mitigated by team SQL knowledge)
- Manual migration management (acceptable for controlled releases)
- Smaller ecosystem (growing rapidly, sufficient for needs)

## Implementation Plan

### Phase 1: Setup (T1.2)
```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as sqliteDrizzle } from 'drizzle-orm/better-sqlite3';

export const createDbConnection = (config: DbConfig) => {
  switch (config.type) {
    case 'postgres': return drizzle(pool);
    case 'sqlite': return sqliteDrizzle(db);
    case 'mysql': return drizzle(connection);
  }
};
```

### Phase 2: Schema (T1.3)
```typescript
// src/lib/db/schema/subscriptions.ts
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  billingCycle: varchar('billing_cycle', { length: 20 }).notNull(),
  nextBillingDate: timestamp('next_billing_date'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Phase 3: Migrations (T1.4)
```bash
# Generate migration
npx drizzle-kit generate:pg

# Apply migration
npx drizzle-kit push:pg
```

## Dependencies

```json
{
  "dependencies": {
    "drizzle-orm": "^0.29.0",
    "postgres": "^3.4.0",
    "better-sqlite3": "^9.2.0",
    "mysql2": "^3.6.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.0",
    "@types/better-sqlite3": "^7.6.0"
  }
}
```

## Resources

- [Drizzle Documentation](https://orm.drizzle.team/)
- [Drizzle GitHub](https://github.com/drizzle-team/drizzle-orm)
- [Performance Benchmarks](https://github.com/drizzle-team/drizzle-orm/blob/main/benchmarks.md)
- [Migration Guide](https://orm.drizzle.team/kit-docs/overview)

## Review Date

Re-evaluate in 6 months or if:
- Drizzle ecosystem stagnates
- Prisma adds edge runtime support
- Performance requirements change significantly

---

**Approved By**: Development Team
**Next Steps**: Proceed with T1.2 (Database Abstraction Layer)
