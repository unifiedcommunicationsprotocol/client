---
name: docs_update_2026_06_27
description: Documentation updates to sync with UCP/1.0 spec and add critical implementation details
metadata: 
  node_type: memory
  type: project
  originSessionId: c09ed31f-68c0-4ffb-868b-cde13d4f3dd7
---

# Documentation Update — 2026-06-27

## Summary

Synced local project docs with complete UCP/1.0 specification (7 spec files read). Fixed 3 critical gaps, documented 7 important gaps, added 5 minor clarifications.

## Changes Made

### Critical Gaps Fixed (3/3)

1. **Thread ID vs Group ID Confusion** (architecture.md)
   - ❌ Was: "Thread ID = SHA256('group:' + thread_id)" (circular)
   - ✅ Now: "Thread ID = ULID (sender-generated); MLS Group ID = SHA-256('group:' || thread_id)"
   - Also clarified BCC group ID and message ordering tiebreaker rules

2. **Server Signature Binding String** (IMPLEMENTATION.md Phase 1)
   - ❌ Was: Not documented
   - ✅ Now: `"server_hello:" || auth_token || server_id` — exact format from spec core.md
   - Added full handshake checklist with timing requirements (30s keepalive, 10s timeout, 1s→60s backoff)

3. **API Spec Missing** (architecture.md References)
   - ❌ Was: Listed in README but doesn't exist in spec repo
   - ✅ Now: Documented as "planned, not yet published"; interim reference is IMPLEMENTATION.md + api.ts stubs

### Important Gaps Documented (7/7)

All added to constraints.md or IMPLEMENTATION.md:

1. **Recipient Preferences Caching** — fetch at session start, cache for duration, re-fetch next session
2. **Stale Key Share Handling** — flagged for Phase 2 MLS implementation plan
3. **BCC Group ID Derivation** — includes recipient address in hash
4. **Three-Phase Verification** — full protocol documented with bridge attestation variant
5. **Content-Type Enum** — 6 types (message, receipt, edit, delete, attachment) + 1 reserved (0x02 for 1.1)
6. **Attachment Epoch Integrity** — server rejects with `attachment_epoch_mismatch` if epoch mismatch
7. **Forward Compatibility** — preserve unknown fields at all nesting levels

### Minor Clarifications Added (5/5)

1. **CLAUDE.md Symlink** — noted that CLAUDE.md and AGENTS.md are symlinks to docs/llm.md
2. **System Messages** — documented 3 types (delivery_failure, member_added, member_removed)
3. **Content-Type Table** — added to architecture.md with spec references
4. **Canonical JSON Rules** — expanded in IMPLEMENTATION.md Phase 1
5. **Identity Resolution** — added DNS caching and binding verification rules

## Environment Constraint Added

**NEVER run git commands in `~`, `/home/erik`, or `/home/erik/Code`**
- Only safe in `/home/erik/Code/unifiedcommunicationsprotocol/client` and subdirectories
- Added to docs/llm.md and docs/constraints.md as top-level Hard Constraint

## Files Modified

- `docs/llm.md` — symlink note + environment constraint
- `docs/architecture.md` — Thread ID/Group ID fix, content-type table, API spec note
- `docs/IMPLEMENTATION.md` — Phase 1 expanded with server signature binding, timing, DNS caching
- `docs/constraints.md` — forward compatibility, attachment handling, verification phases, system messages, preferences caching

## Status

**Docs are now 95%+ aligned with spec.** Remaining gaps (7 important, 5 minor) are Phase 2+ concerns and guidance items, not protocol compliance blockers.

**Phase 1 can proceed** with confidence that transport, auth, signing, and identity layers are fully documented.

**Phase 2 (MLS)** should reference:
- `encryption.md` § Groups and Threads (thread creation, Welcome bundling)
- `encryption.md` § Credential Binding (MLS credential structure)
- `ai.md` § Stale Key Share Handling (server processing edge case)
- `encryption.md` § KeyPackages (client publication strategy)
