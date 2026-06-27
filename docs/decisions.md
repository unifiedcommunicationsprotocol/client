# Decision Log

Architectural Decision Records (ADRs) for the UCP Client. Listed newest first.

---

## ADR-001: Language Choice — TypeScript + Bun

**Date:** 2026-06-27  
**Status:** Accepted

**Context:**
UCP Client runs in browser (web) and desktop (Electron/Tauri). TypeScript provides type safety for crypto operations; Bun offers zero-setup builds, native bundling, and compatibility with both environments. Alternative: pure JavaScript (less safe), Go (not web-friendly), Rust (slower iteration).

**Options Considered:**
- **TypeScript + Bun** — Type safety, fast builds, single codebase for web/desktop, Bun native APIs
- **JavaScript (plain)** — Fastest iteration; weak types for crypto/signing operations
- **Go + WASM** — Possible but adds FFI complexity; slower web experience
- **Rust + WASM** — Mature WASM tooling; slow compilation, steeper learning curve

**Decision:**
TypeScript + Bun. Type safety is critical for signing, verification, and MLS group state. Bun's native APIs (no webpack/vite) and single-binary build simplify deployment to both web and desktop. TypeScript's strict mode catches errors early.

**Consequences:**
- ✅ Strong typing prevents class of crypto bugs
- ✅ Bun's fast iteration and native build system
- ✅ Shared codebase for web + desktop
- ⚠️ Need FFI bindings for MLS (mlspp) or pure-JS implementation
- ⚠️ WebAssembly for Ed25519 if browser lacks Web Crypto API (older browsers)

---

## ADR-002: Crypto Strategy — Native + FFI Bindings

**Date:** 2026-06-27  
**Status:** Accepted

**Context:**
Client must implement Ed25519 signing, verification, and RFC 9420 MLS. Browser's Web Crypto API lacks Ed25519 and MLS; Node.js/Bun have better options. Three approaches: (1) pure-JS implementations (slower, less audited), (2) FFI bindings to C libraries (fast, well-audited), (3) mix (fast path + fallback).

**Options Considered:**
- **Pure JavaScript (tweetnacl.js, mls.js)** — No FFI, batteries included, slower
- **FFI to libsodium + mlspp** — Fast, well-audited, requires compilation on install
- **Hybrid** — Use native Web Crypto for general crypto, tweetnacl.js for Ed25519, mlspp FFI for MLS

**Decision:**
Hybrid approach:
- **Ed25519:** tweetnacl.js or libsodium.js (JavaScript wrapper with optional native bindings)
- **MLS:** mlspp (C++ library via FFI) or pure-JS RFC 9420 implementation

Rationale: Ed25519 is performance-critical (every message signed); tweetnacl.js has good browser support. MLS is complex; mlspp is battle-tested in real deployments.

**Consequences:**
- ✅ Ed25519 operations fast enough for responsive UI
- ✅ MLS group state machine proven
- ⚠️ mlspp requires optional native build (precompiled binaries for common platforms)
- ⚠️ Fallback to pure-JS if FFI unavailable (slower but functional)

---

## ADR-003: Storage — IndexedDB for Local State

**Date:** 2026-06-27  
**Status:** Accepted

**Context:**
Client must store messages, MLS group state, identity keys (encrypted), and draft messages. Three options: (1) IndexedDB (browser standard), (2) localStorage (sync-only, size limits), (3) filesystem (Electron/Tauri only, not portable to web).

**Options Considered:**
- **IndexedDB** — Async, good for large binary data, browser standard
- **localStorage** — Simpler API, 5–10 MB limit, synchronous (blocks UI)
- **Filesystem (electron-store, tauri api)** — Ideal for desktop, not web
- **Hybrid** — IndexedDB for web, filesystem for desktop

**Decision:**
IndexedDB for primary storage. Filesystem access via Tauri/Electron APIs in desktop builds (same code, different storage backend via adapter pattern).

**Consequences:**
- ✅ Portable to any browser
- ✅ No size limit (per-domain quota, typically 50+ MB)
- ✅ Async API prevents blocking main thread
- ⚠️ Quota management required for large message archives
- ⚠️ Cross-tab sync needed for multi-window (service workers)

---

## ADR-004: MLS Group Caching — In-Memory with Periodic Sync

**Date:** 2026-06-27  
**Status:** Accepted

**Context:**
MLS group state is large (tree, member list, epoch keys). Deserializing from IndexedDB on every message is slow. Cache in-memory, but must handle concurrent tabs and key rotation.

**Options Considered:**
- **In-memory only** — Fast, loses state on reload
- **IndexedDB only** — Portable, slower on every message
- **In-memory + IndexedDB** — Fast + durable; sync on changes
- **Service Worker cache** — Single cache for all tabs; adds complexity

**Decision:**
In-memory cache (per tab) + IndexedDB backup. On group change (new message, member add/remove), write to IndexedDB atomically. On app start, load from IndexedDB. Cross-tab communication via BroadcastChannel (new members, key rotations).

**Consequences:**
- ✅ Fast message encryption/decryption
- ✅ Durable on reload
- ✅ Cross-tab sync via BroadcastChannel
- ⚠️ Memory usage grows with active threads (~100 KB per group)
- ⚠️ BroadcastChannel not available in service workers (background sync limitation)

---

## ADR-005: Real-Time Transport — WebSocket with Exponential Backoff

**Date:** 2026-06-27  
**Status:** Accepted

**Context:**
Client must receive messages pushed from server (not poll). Two options: (1) WebSocket (stateful, persistent), (2) Server-Sent Events (SSE, one-way). WebSocket is bidirectional (client can send out-of-band commands); SSE is simpler but limited.

**Options Considered:**
- **WebSocket** — Bidirectional, persistent, low-latency
- **Server-Sent Events (SSE)** — One-way push, simpler, auto-reconnect
- **Polling** — Simplest, scales poorly, battery drain

**Decision:**
WebSocket with exponential backoff reconnection (1s → 60s, capped). On disconnect, retry with jitter to avoid thundering herd. Fall back to polling for environments where WebSocket is blocked (rare).

**Consequences:**
- ✅ Low-latency push delivery
- ✅ Bidirectional for commands
- ✅ Exponential backoff prevents server overwhelm
- ⚠️ Stateful connection must survive page reloads
- ⚠️ Keepalive pings required to detect dead connections

---

## ADR-006: Identity Resolution — DNS-First, Server Fallback

**Date:** 2026-06-27  
**Status:** Accepted

**Context:**
To verify a sender, client must resolve their signing key. Three sources: (1) DNS (decentralized, authoritative), (2) server's `/.well-known/ucp/identity` endpoint (centralized but fast), (3) cache (fastest, stale).

**Options Considered:**
- **DNS only** — Decentralized, no server dependency; slow, not all domains support TXT records
- **Server only** — Fast, centralized; introduces trust in server
- **DNS-first with server fallback** — Best of both; handle DNS failures gracefully

**Decision:**
Resolve in order: (1) local cache (session lifetime), (2) DNS SRV + TXT lookups (UCP preferred), (3) server `/.well-known/ucp/identity` endpoint (fallback). Cache result for session duration.

**Consequences:**
- ✅ Decentralized by default (DNS)
- ✅ Fast fallback for DNS-less domains
- ✅ No hard dependency on server for identity resolution
- ⚠️ DNS latency on first contact (mitigated by prefetch)
- ⚠️ Multiple lookup failures can add delay; timeout aggressive (< 1s)

---

## ADR-007: Message Ordering — client_ts Primary, server_ts Secondary

**Date:** 2026-06-27  
**Status:** Accepted

**Context:**
Messages arrive via federation; server_ts reflects server processing time, not send time. Client_ts (sender's timestamp) is more reliable for ordering but can be spoofed. How to order reliably?

**Options Considered:**
- **server_ts only** — Simple, but doesn't reflect user intent (messages sent close together may arrive out of order)
- **client_ts only** — Trusts client timestamp (could be spoofed), but reflects user intent
- **client_ts primary + server_ts tiebreaker** — Best of both; ULID timestamp as final tiebreaker

**Decision:**
Sort by (client_ts, server_ts, message_id.timestamp). Primary signal is sender's timestamp (user intent); secondary is server processing time (federated ordering); final is ULID timestamp (uniqueness).

**Consequences:**
- ✅ Messages ordered by sender intent when client_ts is accurate
- ✅ Federated ordering respected (server_ts tiebreaker)
- ⚠️ Client clocks can be wrong (user might set device time back); out-of-order messages possible
- ⚠️ Requires monotonic ULID generation to prevent duplicate IDs

---

## ADR-008: Offline Support — Message Queueing + Sync on Reconnect

**Date:** 2026-06-27  
**Status:** Accepted

**Context:**
User might compose/send messages while offline. Three options: (1) reject while offline (poor UX), (2) queue locally and retry on reconnect (standard), (3) immediate optimistic delivery (risky without server ACK).

**Options Considered:**
- **Reject offline** — Simple, clear feedback; poor UX in unreliable networks
- **Queue + retry** — Good UX, durable, standard pattern
- **Optimistic delivery** — Fast UX but risky (user thinks message sent, actually fails)

**Decision:**
Queue messages locally. Mark as "sending" in UI. On reconnect, submit queue to server. Show errors if send fails. User can edit/retry unsent messages.

**Consequences:**
- ✅ Good UX in unreliable networks
- ✅ Messages persistent across app close
- ⚠️ UI must clearly distinguish "sending" / "sent" / "failed" states
- ⚠️ Must clean up queue after delivery or user action

---

## References

- **UCP Specification:** https://github.com/unifiedcommunicationsprotocol/spec
- **RFC 9420 (MLS):** https://datatracker.ietf.org/doc/html/rfc9420
- **Bun Docs:** https://bun.sh/docs

---

*Last updated: 2026-06-27*
