---
name: tech_stack_2026_06_27
description: "Updated tech stack with Hono, Zod, Drizzle, and Docker Compose - all dependencies must use latest versions"
metadata: 
  node_type: memory
  type: project
  originSessionId: c09ed31f-68c0-4ffb-868b-cde13d4f3dd7
---

# Tech Stack Update — 2026-06-27

## Decision: Use Modern Fullstack Framework

Upgraded from basic Bun to modern, production-ready stack for UCP Client.

### Stack Choices

| Component | Technology | Reason |
|-----------|-----------|--------|
| Web Framework | **Hono** (latest) | Lightweight, cloud-native, unified routing for frontend + API on same port |
| Runtime | **Bun** (latest) | Fast, native TypeScript, zero-config |
| Validation | **Zod** (latest) | Runtime schema validation for all API inputs/outputs, type inference |
| Database ORM | **Drizzle** (latest) | TypeScript-first, type-safe queries, migrations, PostgreSQL 18+ native |
| Database | **PostgreSQL 18+** | Modern, secure, production-grade |
| Container Orchestration | **Docker Compose** | Local development, reproducible environment |

### Key Architecture Decisions

1. **Frontend + API on same port** (e.g., http://localhost:3000)
   - `/api/*` routes → Hono API handlers
   - `/*` routes → React SPA frontend
   - HMR (hot module reloading) in development

2. **Drizzle ORM** (not raw SQL or query builder)
   - Type-safe queries with TypeScript inference
   - Automatic migrations
   - Native PostgreSQL types

3. **Zod validation everywhere**
   - API request/response validation
   - Type inference for API contracts
   - Better error messages

4. **Docker Compose for local PostgreSQL**
   - File: `compose.yml` (not `docker-compose.yml`, uses new canonical name)
   - PostgreSQL 18 (not deprecated versions)
   - Volume persistence
   - Health checks

5. **All latest versions**
   - package.json `"version": "latest"` for all deps
   - Automatic security updates via version pinning to latest release
   - No old/deprecated versions

## Implementation Notes

### Environment Setup

**Install dependencies:**
```bash
bun install
```

**Start PostgreSQL:**
```bash
docker compose up -d
```

**Run development server:**
```bash
bun run dev  # Runs Hono server with HMR on port 3000
```

### File Structure (Fullstack)

- `src/index.server.ts` — Hono app definition + API routes
- `src/index.client.tsx` — React entry point
- `src/server/routes/*.ts` — API route handlers (organized by feature)
- `src/server/middleware/*.ts` — Hono middleware (Zod validation, auth, etc.)
- `src/lib/db.ts` — Drizzle ORM setup
- `src/lib/db/schema.ts` — Drizzle schema definitions
- `src/lib/db/migrations/*.sql` — Database migrations

### Key Constraints

- ✅ Always use latest versions (no pinning to X.Y.Z unless security issue)
- ✅ All API inputs validated with Zod
- ✅ All database queries via Drizzle (no raw SQL in application code)
- ❌ Never ship unvalidated data to database
- ❌ Never skip validation even for "internal" APIs

### Why This Stack

**Before:** Basic Bun.serve → simplistic, no validation, no ORM, manual routing

**After:** Hono + Zod + Drizzle
- Industry standard (Hono used by Cloudflare, Vercel, others)
- Type safety across the entire stack
- DX: hot reloading, autocomplete, automatic migrations
- Production-ready: validation, error handling, structured logging ready
- Ecosystem: integrations for auth, caching, observability

## Deprecation Notice

- ❌ `bunfig.toml` custom entry points — Hono handles routing, no special bundler config needed
- ❌ Manual route handlers in Bun.serve — use Hono app.get/post/put instead
- ❌ Inline validation — use Zod schemas in middleware
- ❌ Manual SQL queries — use Drizzle for all database access

## Documentation Updates

- `docs/llm.md` — Updated tech stack table, repository structure, coding conventions
- `package.json` — Updated scripts: `dev` now concurrently runs API server
- `tsconfig.json` — Added node types, bundler module resolution
- `compose.yml` — PostgreSQL 18 with health checks

---

**Locked in:** Using latest versions of all deps ensures security and access to latest features.
