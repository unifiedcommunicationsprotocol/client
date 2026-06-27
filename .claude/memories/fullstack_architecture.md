---
name: fullstack_architecture
description: Bun full-stack architecture with Hono API + React frontend + Drizzle database
metadata:
  type: project
---

# Full-Stack Architecture (v2.0)

**Pattern:** Bun's full-stack server (from https://bun.com/docs/bundler/fullstack)

## Structure

```
src/
├── index.server.ts        # Bun serve() entry point
├── index.client.tsx       # React frontend entry
├── server/
│   ├── api.ts             # Hono API gateway (mounts all route groups)
│   └── routes/
│       ├── auth.ts        # Authentication endpoints
│       └── health.ts      # Health check
└── lib/
    └── db/
        ├── index.ts       # Drizzle client initialization
        └── schema.ts      # PostgreSQL schema (Drizzle ORM)
```

## Key Implementation Details

### 1. Server Entry Point (index.server.ts)
- Uses `serve()` from Bun (not manual Hono setup)
- Fetch handler with URL routing:
  - `/api/*` → Rewrite to remove prefix, pass to Hono
  - `*` → Serve frontend HTML (SPA)
- **URL Rewriting:** Critical detail — Hono sees paths without `/api` prefix
  - Strip `/api` from URL pathname before calling `api.fetch()`
  - Prevents 404s on nested routes

### 2. API Gateway (server/api.ts)
- Single Hono instance mounting all route groups
- Routes organized by concern (auth, health, messages, etc.)
- Handles JSON responses, error status codes
- Falls back to 404 for unmatched paths

### 3. Route Groups (server/routes/*.ts)
- Each file exports a Hono sub-app
- Mounted at `/auth`, `/health`, etc. in gateway
- Example structure:
  ```typescript
  const authRoutes = new Hono();
  authRoutes.post("/challenge", ...);
  authRoutes.post("/session", ...);
  export default authRoutes;
  ```
- Mounted as: `api.route("/auth", authRoutes)`
- Accessible at: `/api/auth/challenge`, `/api/auth/session`

### 4. Database Layer (lib/db/)
- **schema.ts:** Drizzle ORM table definitions (PostgreSQL)
  - identities, threads, groups, messages, keypackages, sessions, drafts
  - Full UCP data model with timestamps, JSONB for complex fields
  - Uses `drizzle-orm/pg-core` for PostgreSQL types
- **index.ts:** Drizzle client via Bun SQL (native)
  - Uses `drizzle-orm/bun-sql` (Bun's native PostgreSQL)
  - No external npm drivers needed
  - Exports db instance + all schema exports
  - Environment variable: `DATABASE_URL` (default: postgres://localhost/ucp_client)
- **drizzle.config.ts:** Migration config for drizzle-kit
  - Driver: `pg` (PostgreSQL)
  - Output: `./drizzle/` directory

## Development vs Production

**Development mode:**
- HMR enabled via `development: { hmr: true }`
- Frontend served from source: `/src/index.client.tsx`
- API routes reloaded on change

**Production mode:**
- Single binary: `bun run build` → `dist/index.server.js`
- Frontend bundled: `/app.js` (built by build.ts)
- No HMR overhead

## Testing

```bash
# Dev server
bun run dev

# Test API
curl -X POST http://localhost:3000/api/auth/challenge
curl http://localhost:3000/api/health

# Frontend
curl http://localhost:3000  # Returns HTML

# Build for production
bun run build
bun ./dist/index.server.js
```

## Database Setup

```bash
# Local PostgreSQL (Docker)
docker compose up -d

# Run migrations (TODO: set up Drizzle migrations)
# bun run migrate

# Connect
psql postgres://localhost/ucp_client
```

## Critical Pattern: URL Rewriting

When API is mounted in Hono via `api.route()`, Hono sees full paths. The server must strip the `/api` prefix before passing to Hono:

```typescript
if (url.pathname.startsWith("/api")) {
  const rewrittenUrl = new URL(req.url);
  rewrittenUrl.pathname = rewrittenUrl.pathname.slice(4); // Remove "/api"
  return api.fetch(new Request(rewrittenUrl, req));
}
```

Without this, all routes return 404.

---

*Updated: 2026-06-27 — Full-stack refactor complete, database schema added*
