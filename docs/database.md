# Database Setup — PostgreSQL + Drizzle + Bun SQL

UCP Client uses **Bun's native PostgreSQL driver** with Drizzle ORM for type-safe database operations.

## Architecture

- **Driver:** Bun SQL (`bun:sql`) — native PostgreSQL support, zero external dependencies
- **ORM:** Drizzle (`drizzle-orm/bun-sql`)
- **Schema:** `src/lib/db/schema.ts` (PostgreSQL tables via `drizzle-orm/pg-core`)
- **Migrations:** Drizzle Kit (`drizzle-kit`) — generate SQL migrations

## Local Development Setup

### 1. Start PostgreSQL

```bash
# Using Docker Compose (already configured)
docker compose up -d

# Or manually
docker run -d \
  -e POSTGRES_DB=ucp_client \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:18
```

### 2. Set Environment Variable

```bash
export DATABASE_URL="postgres://postgres:password@localhost:5432/ucp_client"
```

Or create `.env`:
```
DATABASE_URL=postgres://postgres:password@localhost:5432/ucp_client
```

### 3. Generate Migrations

```bash
# Create initial migration from schema
bunx drizzle-kit generate --dialect postgresql
```

This creates SQL files in `drizzle/` directory.

### 4. Run Migrations

Create `src/lib/db/migrate.ts`:

```typescript
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { db } from "./index";

console.log("Running migrations...");
migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations complete!");
```

Run before server start:
```bash
bun src/lib/db/migrate.ts
```

## Database Schema

All tables defined in `src/lib/db/schema.ts`:

| Table | Purpose |
|-------|---------|
| `identities` | User identity keys (identity_key, signing_key, revocation_key) |
| `threads` | Conversations (recipients, subject, timestamps) |
| `groups` | MLS groups (one per thread, plus BCC groups) |
| `messages` | Message content (encrypted payload, signatures, metadata) |
| `keypackages` | Cached MLS KeyPackages per recipient |
| `sessions` | Active user sessions (token, expiry) |
| `drafts` | Unsent message drafts |

## Querying

```typescript
import { db } from "./lib/db";
import { messages, threads } from "./lib/db/schema";

// Select
const msgs = await db.select().from(messages);

// Insert
await db.insert(messages).values({ ... });

// Update
await db.update(threads).set({ ... }).where(...);

// Delete
await db.delete(sessions).where(...);
```

## Bun SQL vs External Drivers

**Why Bun SQL?**
- ✅ Zero npm dependencies (built into Bun runtime)
- ✅ Native PostgreSQL bindings
- ✅ Fast connection pooling
- ✅ Works in Bun executable

**Equivalent to:**
- ❌ `postgres` npm package (external driver)
- ❌ `pg` npm package (external driver)

## References

- [Bun SQL Docs](https://bun.com/docs/runtime/sql)
- [Drizzle + Bun SQL](https://orm.drizzle.team/docs/connect-bun-sql)
- [Drizzle Kit Docs](https://orm.drizzle.team/docs/kit-overview)
- [PostgreSQL Dialect](https://orm.drizzle.team/docs/sql-schema-declaration/postgresql)
