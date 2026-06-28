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
├── index.server.ts        # Bun serve() entry point (routes pattern)
├── index.html             # Frontend HTML entry (imports client/index.tsx)
├── client/
│   ├── index.tsx          # React entry point
│   ├── App.tsx            # Root component
│   ├── index.css          # Design system CSS
│   ├── AppContext.tsx     # Global state management
│   └── components/        # React components
├── server/
│   ├── api.ts             # Hono API gateway
│   └── routes/
│       ├── auth.ts        # Authentication endpoints
│       └── health.ts      # Health check
└── lib/
    └── db/
        ├── index.ts       # Drizzle client initialization
        └── schema.ts      # PostgreSQL schema
```

## Key Implementation Details

### 1. Server Entry Point (index.server.ts)
- Uses Bun's `serve()` with **routes pattern** (not custom fetch handler)
- Routes configuration:
  - `"/*": homepage` — Serve index.html for all routes (SPA fallback)
  - `"/api/*": api.fetch` — Pass API routes directly to Hono instance
- **HMR:** `development: { hmr: true }` enables hot module reloading
- No URL rewriting needed — Hono handles `/api/*` paths directly

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

## Critical Pattern: Routes Pattern

Use Bun's routes object instead of custom fetch handler:

```typescript
serve({
  routes: {
    "/*": homepage,        // SPA fallback: serve index.html for all routes
    "/api/*": api.fetch,   // API routes go directly to Hono instance
  },
  fetch(_req) {
    return new Response("Not Found", { status: 404 });
  },
  development: { hmr: true },
});
```

**Why:** Cleaner, simpler, and Bun's routes pattern handles path matching efficiently. No manual rewriting needed.

---

*Updated: 2026-06-27 — Full-stack refactor complete, database schema added*
