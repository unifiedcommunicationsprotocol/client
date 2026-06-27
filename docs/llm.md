# UCP Client — AI Navigation Guide

> This file is the project constitution. It loads in every Claude Code session.
> `CLAUDE.md` and `AGENTS.md` in the project root are symlinks to this file.
> Procedures belong in `.claude/skills/`, not here.

---

## Project Overview

**What:** Reference implementation of the **UCP Client** — TypeScript/Bun application that implements the client side of the Unified Communications Protocol (UCP), a modern encrypted messaging protocol replacing IMAP/SMTP/CalDAV/CardDAV.

**Why:** Legacy email is insecure by default, fragmented across protocols, and agent-hostile. UCP Client provides a reference implementation showing how modern clients should:
- Sign and verify messages with Ed25519
- Implement MLS (RFC 9420) for group encryption
- Manage identity independently via DNS
- Never trust the server with plaintext content
- Support real-time push delivery via WebSocket

**Status:** v1.0 scaffolded. Core API stubs ready. MLS group management and signing/verification implementation pending.

**Repo:** github.com/unifiedcommunicationsprotocol/server (in `client/` directory)

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Language** | TypeScript (latest) | Type safety for crypto operations |
| **Runtime** | Bun (latest) | Fast builds, native APIs, zero-config |
| **Web Framework** | Hono (latest) | Lightweight, cloud-native, both frontend/API on same port |
| **Build** | Bun build | No webpack/vite/esbuild needed |
| **Database** | PostgreSQL 18+ (via Docker Compose) | Local dev via `compose.yml`, Drizzle ORM |
| **Database ORM** | Drizzle (latest) | TypeScript-first ORM, migrations, type-safe |
| **Validation** | Zod (latest) | Schema validation for API requests/responses |
| **Crypto (Signing)** | tweetnacl.js or libsodium.js | Ed25519 signing/verification |
| **Crypto (MLS)** | mlspp (FFI) or pure-JS | RFC 9420 required |
| **Frontend Storage** | IndexedDB | Browser standard, async, large capacity |
| **Transport** | WebSocket API | Persistent push connection to server |
| **Testing** | Bun test | Table-driven tests; no Jest |
| **Deployment** | Web + Desktop + CLI | Bun build → static JS; Electron/Tauri for desktop |

---

## Repository Structure

```
client/
├── src/
│   ├── index.server.ts          # Hono API server + frontend fallback (same port)
│   ├── index.client.tsx         # React frontend entry point
│   ├── client/
│   │   ├── App.tsx              # Root React component
│   │   ├── index.html           # HTML template
│   │   ├── index.css            # Styling
│   │   ├── APITester.tsx        # Dev testing component
│   │   └── [other components]
│   ├── lib/
│   │   ├── api.ts               # Hono API client (RPC-style via Hono)
│   │   ├── crypto/
│   │   │   ├── signing.ts       # Ed25519 sign/verify
│   │   │   ├── mls.ts           # RFC 9420 group management
│   │   │   └── identity.ts      # DNS resolution, key verification
│   │   ├── storage.ts           # IndexedDB adapter
│   │   ├── transport.ts         # WebSocket connection + reconnect
│   │   ├── db.ts                # Drizzle ORM client
│   │   └── db/
│   │       ├── schema.ts        # Drizzle schema definitions
│   │       └── migrations/      # Database migrations
│   └── server/
│       ├── routes/
│       │   ├── auth.ts          # Authentication endpoints
│       │   ├── messages.ts      # Message endpoints
│       │   └── [other routes]
│       └── middleware/
│           ├── validate.ts      # Zod validation middleware
│           └── auth.ts          # Auth middleware
├── docs/
│   ├── IMPLEMENTATION.md        # Build + API guide
│   ├── architecture.md          # System design
│   ├── constraints.md           # Hard/soft constraints
│   ├── decisions.md             # Architecture decision records
│   ├── deployment.md            # Web/Desktop/CLI deployment
│   ├── testing.md               # Test strategy
│   ├── mls-implementation.md    # RFC 9420 implementation plan
│   ├── context.md               # Domain language
│   ├── spec.md                  # Feature spec template
│   └── llm.md                   # This file
├── package.json                 # Dependencies (Hono, Zod, Drizzle, etc.)
├── tsconfig.json                # TypeScript config (strict)
├── bunfig.toml                  # Bun config
├── compose.yml                  # Docker Compose (PostgreSQL 18+)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── README.md                    # Project overview
```

---

## Coding Conventions

- **TypeScript strict mode** — all code is type-safe
- **Ed25519 everywhere** — no password auth, all crypto via signing keys
- **Canonical JSON** — messages signed over sorted-key, UTF-8 JSON
- **MLS mandatory** — all messages encrypted to group, server never decrypts
- **Hono for routing** — lightweight, type-safe HTTP framework (both frontend/API on same port)
- **Zod for validation** — runtime schema validation on all API inputs
- **Drizzle ORM** — type-safe queries, migrations, PostgreSQL 18+
- **Tests first** — table-driven tests, Bun test runner
- **No external dependencies** where possible — use Web Crypto API, standard APIs
- **Async-only** — no sync operations (IndexedDB, Drizzle are async)
- **Named exports** — easier to trace in tools
- **Docker Compose for local dev** — PostgreSQL 18+ via `compose.yml`

---

## Key Files & Modules

### Critical (Must Implement)

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/crypto/signing.ts` | Ed25519 sign/verify | ⏳ Skeleton |
| `src/lib/crypto/mls.ts` | RFC 9420 group ops | ⏳ Skeleton |
| `src/lib/crypto/identity.ts` | DNS resolution + verification | ⏳ Skeleton |
| `src/lib/api.ts` | Server endpoints (challenge, session, send, etc.) | ✅ Stubs ready |
| `src/lib/transport.ts` | WebSocket + reconnect | ⏳ Skeleton |

### Supporting

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/storage.ts` | IndexedDB wrapper | ⏳ Skeleton |
| `src/lib/ui/` | React/Svelte components | ⏳ Placeholder |
| `src/mock-server.ts` | Test mock for integration tests | ⏳ Skeleton |

---

## Architecture Principles

**From UCP Spec:**

1. **Push-first** — persistent WebSocket, client receives messages (never polls)
2. **E2E encrypted by default** — MLS mandatory; server never decrypts
3. **Portable identity** — Ed25519 keypairs anchored in DNS; users own their identity
4. **Zero-knowledge server** — plaintext content stays on client
5. **Structured messages** — typed JSON blocks, not MIME
6. **AI-native** — summaries, categories are first-class (local processing)

**Client-specific:**

- **Crypto responsibility** — client owns all signing, verification, MLS group state
- **Server as relay** — server stores/forwards ciphertext; no decryption
- **Three-phase verification** — envelope → MLS → inner signature (all must pass)
- **Signing key rotation** — automatic every 60 days; 48-hour grace period
- **Offline support** — message queueing, sync on reconnect
- **MLS group per thread** — one group per conversation; BCC as separate groups

---

## Hard Constraints

### Environment
- ❌ **NEVER** run git commands in home directory (`~`) or parent directories — only safe in this project directory
- ✅ Git operations only in project root and subdirectories

### Cryptography
- ❌ Never store identity key on device (back up offline)
- ❌ Never send plaintext to server (always MLS-encrypted)
- ❌ Never trust unverified sender (all three phases required)
- ✅ Always rotate signing key every 60 days
- ✅ Always preserve unknown blocks/marks (forward compatibility)

### Protocol
- ❌ Never modify RFC 9420 ciphersuite
- ❌ Never reuse MLS group for multiple threads
- ❌ Never skip identity resolution
- ✅ Always sign messages with canonical JSON
- ✅ Always bundle Welcome + first message atomically

---

## Skill Checklist

Use these commands to work on the client:

- `/align` — Clarify design before major work
- `/spec-create` — Start a formal feature spec
- `/spec-review` — Review spec before implementing
- `/tdd` — Build with tests as driver
- `/diagnose` — Debug crypto/verification issues
- `/decision` — Log architecture decision
- `/commit` — Create well-formed git commit

---

## References

- **UCP Specification:** https://github.com/unifiedcommunicationsprotocol/spec
- **RFC 9420 (MLS):** https://datatracker.ietf.org/doc/html/rfc9420
- **RFC 9180 (HPKE):** https://datatracker.ietf.org/doc/html/rfc9180
- **Bun Docs:** https://bun.sh/docs
- **Architecture Decisions:** `docs/decisions.md`
- **Implementation Plan:** `docs/IMPLEMENTATION.md`

---

## Next Steps

1. **Implement Ed25519 signing** (`src/lib/crypto/signing.ts`)
   - Use tweetnacl.js or libsodium.js
   - Canonical JSON serialization
   - Tests with fixtures

2. **Implement MLS group management** (`src/lib/crypto/mls.ts`)
   - FFI to mlspp (or pure-JS fallback)
   - Group creation, member add/remove
   - Encrypt/decrypt operations
   - Welcome message handling

3. **Implement identity verification** (`src/lib/crypto/identity.ts`)
   - DNS SRV + TXT lookups
   - Server identity endpoint
   - Signing key credential binding

4. **Implement WebSocket transport** (`src/lib/transport.ts`)
   - Challenge-response auth
   - Persistent connection + keepalive
   - Exponential backoff reconnect

5. **Build UI** (`src/lib/ui/`)
   - Thread list
   - Message compose + send
   - Recipient picker
   - Real-time sync

---

*Last updated: 2026-06-27*
