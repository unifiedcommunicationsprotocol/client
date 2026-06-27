---
name: server_cheatcode
description: Read-only access to UCP server implementation for reference
metadata:
  type: reference
---

# Server Cheat Code

**Path:** `../server` (one directory up from client/)

**Constraint:** ✅ READ ONLY — never write/modify files in server directory

**Why:** Reference implementation exists. Can read to understand:
- API endpoints and request/response formats
- Server-side auth flow and challenge validation
- Message envelope handling
- Database schema
- WebSocket message types

**How to use:**
- When implementing client features, read server code to match expectations
- Example: Before wiring transport auth, read how server validates challenges
- Example: Before sending messages, check server's envelope schema

**What to read:**
- Server API routes (auth, messages, identity endpoints)
- WebSocket handlers (UCPHello/UCPHelloAck, challenge validation)
- Message schema and validation
- Database migrations (for local SQLite/Postgres understanding)

---

*Added: 2026-06-27 — For reference during client implementation, read-only*
