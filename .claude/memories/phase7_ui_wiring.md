---
name: phase7_ui_wiring
description: Phase 7 — Wire React UI to messaging backend and set up database
metadata:
  type: project
---

# Phase 7: UI Integration & Database Setup

**Goal:** Connect React frontend (44 components) to backend messaging system (178 tests passing) and set up PostgreSQL database for local development.

## Current State

✅ **Backend:** 178 tests passing + API routes wired
- Phase 1: API & Authentication (71 tests)
- Phase 2: MLS Group Management (18 tests)
- Phase 3: Database & Storage (22 tests)
- Phase 4: Real-time Messaging (18 tests)
- Phase 5: Bridge Integration (21 tests)
- Phase 6: Polish & Optimization (23 tests)
- ✅ REST endpoints working (health, threads, messages)

✅ **Frontend:** 44 components, 100% Tailwind, NOW WIRED to backend
- ✅ 3-column layout (nav + secondary + main)
- ✅ All message/inbox/calendar/contacts/notes/agents views
- ✅ AppContext state management (60+ fields)
- ✅ All 10 settings pages
- ✅ ComposeArea wired to /api/message/send
- ✅ InboxThreadList wired to /api/thread/list

✅ **Database:** PostgreSQL running
- PostgreSQL 18 via Docker Compose
- DATABASE_URL configured
- Drizzle schema ready

## Implementation Plan

### 1. Database Setup (PostgreSQL)
**Status:** ✅ Complete
- [x] Start Docker: `docker compose up -d` 
- [x] Verify PostgreSQL listening on 5432
- [x] Add DATABASE_URL to .env
- [x] Fixed compose.yml volume path for PostgreSQL 18
- [ ] Run Drizzle migrations (pending)

**Files:**
- `compose.yml` ✅ (ready)
- `src/lib/db/schema.ts` ✅ (Drizzle schema complete)
- `src/lib/db/client.ts` ✅ (operations ready)

### 2. API Endpoints Wiring
**Status:** ✅ Complete
- [x] Add `/api/message/send` endpoint
- [x] Add `/api/message/list` endpoint  
- [x] Add `/api/thread/list` endpoint
- [x] Add `/api/thread/create` endpoint
- [x] Wire to backend messaging module (`src/lib/messaging.ts`)

**Files Created:**
- `src/server/routes/messages.ts` ✅ (3 endpoints: send, list, status)
- `src/server/routes/threads.ts` ✅ (3 endpoints: create, list, get)
- `src/lib/messaging.ts` ✅ (backend ready)

### 3. UI Component Wiring
**Status:** ✅ In Progress (50%)
- [x] ComposeArea → `POST /api/message/send`
- [x] InboxThreadList → `GET /api/thread/list`
- [ ] ThreadDetail → `GET /api/message/list?thread_id=...`
- [ ] ComposeBar (Messaging) → `POST /api/message/send`
- [ ] Real-time updates (WebSocket) → `src/lib/transport.ts`

**Components Updated:**
- `src/client/components/ComposeArea.tsx` ✅ (wired send handler)
- `src/client/components/InboxThreadList.tsx` ✅ (wired thread list with fallback)
- `src/client/components/ThreadDetail.tsx` ⏳ (next)
- `src/client/components/ComposeBar.tsx` ⏳ (next)

### 4. Real MLS & Encryption
**Status:** ⏳ Conditional
- [ ] Integrate mlspp FFI (if targeting native build)
- [ ] Test encrypted message flow end-to-end
- [ ] Configure webpack/bundler for WASM fallback

**Files:**
- `src/lib/crypto/mls.ts` ✅ (currently simulated)

### 5. Email Import (IMAP)
**Status:** ⏳ Conditional (depends on bridge auth flow)
- [ ] Add IMAP client module
- [ ] Wire to OAuth flow (Gmail, Fastmail)
- [ ] Implement message fetch → local storage

**Files:**
- `src/lib/bridge.ts` ✅ (OAuth ready, IMAP pending)

## Next Immediate Steps

### Step 1: Start PostgreSQL
```bash
docker compose up -d
```

### Step 2: Configure Database URL
Add to `.env`:
```
DATABASE_URL=postgresql://ucp_user:ucp_password@localhost:5432/ucp_client
```

### Step 3: Create Message & Thread Routes
- `src/server/routes/messages.ts` — send, list, edit, delete
- `src/server/routes/threads.ts` — list, create, archive

### Step 4: Wire AppContext to API
Modify message send handler:
```typescript
// src/client/AppContext.tsx
const handleSendMessage = async (message: Message) => {
  const response = await fetch('/api/message/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  // Update state on success
}
```

### Step 5: Test End-to-End
- Compose message in UI
- Send via API
- Retrieve from database
- Display in thread list

## Architecture Decisions

**Database:** PostgreSQL 18+ via Docker Compose (compose.yml)
**ORM:** Drizzle (schema.ts complete)
**API:** Hono (lightweight, type-safe)
**Transport:** WebSocket (src/lib/transport.ts ready)
**Crypto:** tweetnacl.js + mlspp FFI (optional)

## Testing Strategy

1. Unit tests (existing 178 passing)
2. Integration tests (API ↔ database)
3. E2E tests (UI ↔ API ↔ database)
4. Manual testing (dev server + browser)

## Blocked By

- Nothing — all components ready

## Depends On

- Docker (for PostgreSQL)
- Bun (for dev server)
- PostgreSQL credentials (in .env)

---

**Ready to implement. Database setup first, then API wiring, then UI integration.**
