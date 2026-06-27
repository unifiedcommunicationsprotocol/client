# Client Architecture

## Overview

The UCP client is a **cryptographically responsible** TypeScript application that implements the client side of the Unified Communications Protocol. Unlike traditional email clients that outsource encryption to the server, the UCP client owns all cryptographic operations: Ed25519 signing, MLS group management, identity verification, and message encryption.

The client connects to a UCP server via persistent WebSocket, exchanges challenge-response authentication, creates MLS groups for threads, and routes encrypted messages through the server to other clients. The server is **zero-knowledge by default** — it stores and relays ciphertext without decrypting.

## Component Architecture

```
┌─────────────────────────────────────────────────────┐
│            Presentation Layer                        │
│  ┌────────────────────────────────────────────────┐ │
│  │ UI Components (React/Svelte/vanilla?)          │ │
│  │  • Thread list                                 │ │
│  │  • Message display                             │ │
│  │  • Compose window                              │ │
│  │  • Contact picker                              │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│       State Management & Message Logic                │
│  ┌────────────────────────────────────────────────┐ │
│  │ Thread Store                                   │ │
│  │  • Threads (recipients, metadata)             │ │
│  │  • Messages (signed envelope + MLS payload)   │ │
│  │  • Drafts (pending send)                      │ │
│  │  • Read state (receipts)                      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Message Composition Engine                     │ │
│  │  • Build block structure                      │ │
│  │  • Track recipients (to, cc, bcc)             │ │
│  │  • Generate message ID (ULID)                 │ │
│  │  • Create envelope + MLS payload              │ │
│  │  • Queue for send                             │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Inbound Message Handler                       │ │
│  │  • Decrypt MLS ciphertext                     │ │
│  │  • Verify message signature                   │ │
│  │  • Apply edits/deletes                        │ │
│  │  • Update thread state                        │ │
│  │  • Generate read receipts                     │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│          Encryption & Group Management               │
│  ┌────────────────────────────────────────────────┐ │
│  │ MLS Group Manager                              │ │
│  │  • CreateGroup(recipients) → GroupState       │ │
│  │  • FetchKeyPackages(addresses)                │ │
│  │  • ProposeAdd/Remove/Update                   │ │
│  │  • HandleWelcome(msg, group_id)               │ │
│  │  • GetEpochKey(group_id) → encryption key     │ │
│  │  • AdvanceEpoch(group_id, commit)             │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ MLS Crypto (RFC 9420)                          │ │
│  │  • Tree operations (add/remove leaves)        │ │
│  │  • Epoch key derivation (HPKE)                │ │
│  │  • Encrypt/decrypt with epoch key             │ │
│  │  • Credential validation                      │ │
│  │  • Proposal reference hashing                 │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Attachment Encryption                         │ │
│  │  • Encrypt file to MLS group                  │ │
│  │  • Generate attachment metadata               │ │
│  │  • Queue for upload                           │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│        Signing, Verification & Key Management        │
│  ┌────────────────────────────────────────────────┐ │
│  │ Identity Manager                               │ │
│  │  • Generate Ed25519 keypairs at signup        │ │
│  │  • Store signing key (device)                 │ │
│  │  • Back up identity key (offline)             │ │
│  │  • Maintain revocation key (emergency)        │ │
│  │  • Publish DNS records (_ucp, _ucp-sign)      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Signing & Verification                        │ │
│  │  • SignMessage(msg, signing_key)              │ │
│  │  • VerifySignature(msg, sig, sender_key)      │ │
│  │  • ResolveIdentity(address) → keys            │ │
│  │  • CheckBinding(signing_key, identity_key)    │ │
│  │  • RotateSigningKey() [auto, 60-day]          │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ DNS Resolution                                 │
│  │  • Query _ucp-srv (server address)             │ │
│  │  • Query _ucp-sign (signing key)               │ │
│  │  • Query _ucp-revoke (revocation key)          │ │
│  │  • Cache results (session lifetime)            │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│        API Client & Transport Layer                  │
│  ┌────────────────────────────────────────────────┐ │
│  │ API Client (src/lib/api.ts)                    │ │
│  │  • REST endpoints (auth, content, inbox)      │ │
│  │  • WebSocket management                       │ │
│  │  • Envelope serialization/deserialization    │ │
│  │  • Error handling & retries                   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Connection Manager                            │ │
│  │  • Establish WebSocket to server              │ │
│  │  • Challenge-response auth (Ed25519)          │ │
│  │  • 30-second keepalive pings                  │ │
│  │  • Exponential backoff reconnect (1s → 60s)  │ │
│  │  • Handle server-generated messages           │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Local Storage (IndexedDB)                     │ │
│  │  • Messages (id, thread_id, ciphertext)       │ │
│  │  • Groups (group_id, state, epoch)            │ │
│  │  • Keys (signing_key, identity_sig)           │ │
│  │  • KeyPackages (address → cached packages)    │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
            ┌────────────────────┐
            │  UCP Server        │
            │  (via HTTPS/WSS)   │
            │                    │
            │ Authenticates      │
            │ Relays encrypted   │
            │ Serves key material│
            │ Routes federation  │
            └────────────────────┘
```

## Data Flow: Sending a Message

```
1. User composes message
   ├─ Selects recipients (to, cc, bcc)
   ├─ Types subject + body blocks
   └─ Clicks "Send"

2. Compose engine builds message
   ├─ Generate ULID for message.id
   ├─ Get thread_id (existing or new)
   ├─ Get MLS group for thread
   ├─ Fetch KeyPackages for any new recipients
   └─ If new thread, create MLS group with Add proposals

3. Client signs message
   ├─ Serialize message as canonical JSON
   ├─ Sign with local signing_key (Ed25519)
   └─ Store signature in message

4. MLS encrypts for group
   ├─ Get current epoch key
   ├─ Encrypt message JSON to MLS ciphertext
   ├─ For BCC: create separate group, encrypt variant
   └─ Generate confirmation tag

5. Build UCPEnvelope
   ├─ Wrap encrypted message
   ├─ Add "from", "to" (unencrypted header for routing)
   ├─ Add signature
   └─ Serialize to bytes

6. Upload any attachments
   ├─ Encrypt file content to MLS group
   ├─ POST /content with ciphertext
   └─ Receive attachment ID

7. Send envelope to server
   ├─ POST /api/message/send with UCPEnvelope
   ├─ Server stores, assigns server_ts, queues for federation
   └─ Client receives ACK

8. Broadcast to other clients via WebSocket
   ├─ Server forwards to other recipients' connections
   └─ (Each client receives, decrypts, stores locally)
```

## Data Flow: Receiving a Message

```
1. Server forwards UCPEnvelope via WebSocket
   ├─ Client receives envelope blob
   └─ Parses headers (from, to, thread_id)

2. Phase 1: Envelope Verification
   ├─ Resolve sender's identity (DNS or server)
   ├─ Fetch sender's signing key + identity binding
   ├─ Verify envelope.signature against signing key
   └─ If fails: reject message, discard

3. Phase 2: MLS Decryption
   ├─ Look up MLS group by thread_id
   ├─ Feed envelope.mls_ciphertext to MLS decryption
   ├─ MLS returns plaintext + confirmation_tag
   └─ If fails (unknown group, stale epoch): request Welcome from server

4. Phase 3: Message Verification
   ├─ Parse decrypted message JSON
   ├─ Verify message.signature against sender's signing key
   ├─ Check message.from == sender address
   └─ If fails: log error, don't display

5. Update local state
   ├─ Store message in IndexedDB (thread_id, message_id)
   ├─ Update thread last_message_ts
   ├─ Apply edits/deletes if present
   └─ Notify UI (thread list updates)

6. User action: mark read
   ├─ Generate read receipt (MLS message.receipt)
   ├─ Encrypt receipt to thread's MLS group
   ├─ Send via WebSocket or /api/message/send
   └─ (Server broadcasts to sender)
```

## Key Invariants

1. **Message Authenticity** — Every message verified before display (envelope + MLS + inner signature)
2. **Group Atomicity** — Welcome + first message bundled atomically; server buffers Welcome until message committed
3. **Epoch Consistency** — All messages in epoch N encrypted with same key; epoch N+1 starts after commit
4. **Identity Binding** — Signing key credential includes identity_sig binding to identity key, preventing key confusion
5. **Signing Key Rotation** — Auto-rotate at 60 days; grace period allows 48 hours of old key verification
6. **BCC Privacy** — Separate MLS group per BCC recipient; each receives only their own visibility
7. **No Plaintext** — No unencrypted message content persisted; all MLS payloads are ciphertext

## Threading Model

**ID Derivation:**
- **Thread ID** — ULID generated by message sender at creation time (unique globally, includes timestamp)
- **Primary MLS Group ID** — `SHA-256("group:" || thread_id)` — deterministic derivation from thread ID
- **BCC MLS Group ID** — `SHA-256("group_bcc:" || thread_id || ":" || bcc_recipient_address)` — separate group per BCC recipient

**Message Ordering:**
- **Primary:** `client_ts` (sender-assigned timestamp inside encrypted payload)
- **Secondary tiebreaker:** `server_ts` (server-assigned delivery timestamp, used only when client_ts identical)
- **Final tiebreaker:** ULID timestamp component (monotonically increasing per sender)

**Threading:**
- **In-Reply-To** — References previous message ID; client shows reply context
- **Conversation Threading** — Group all messages in `references` chain; collapse in UI
- See `spec/core.md` § Timestamps and Ordering for canonical ordering rules

## Storage Schema (IndexedDB)

```
threads
├─ id (thread_id)
├─ recipients (array of addresses)
├─ created_at
├─ updated_at
└─ last_message_ts

messages
├─ id (message.id)
├─ thread_id (FK)
├─ from (sender address)
├─ subject
├─ body_blocks (array of blocks)
├─ client_ts (sender's timestamp)
├─ server_ts
├─ signature (base64)
├─ encrypted_payload (base64 MLS ciphertext)
└─ metadata (ai, labels, headers)

groups
├─ id (group_id)
├─ thread_id (FK)
├─ is_bcc (boolean)
├─ bcc_recipient (address if BCC)
├─ epoch (current epoch number)
├─ tree_state (MLS group state bytes)
└─ updated_at

attachments
├─ id (attachment.id)
├─ message_id (FK)
├─ filename
├─ size
├─ sha256 (content hash)
├─ encrypted_ciphertext (base64)
└─ created_at

drafts
├─ id (ULID)
├─ thread_id (or null for new)
├─ recipients (array)
├─ subject
├─ body_blocks
└─ created_at
```

## Application Payload Content Types

MLS `PrivateMessage` payloads carry a single-byte `content_type` identifier followed by the JSON content:

| Type | Value | Description | Spec |
|------|-------|-------------|------|
| message | 0x01 | Email message (includes forwards) | messages.md |
| receipt | 0x03 | Read receipt | messages.md |
| edit | 0x04 | Message body edit | messages.md |
| delete | 0x05 | Message deletion/tombstone | messages.md |
| attachment | 0x06 | Attachment content (server endpoint) | messages.md |
| *reserved* | 0x02 | Reaction (UCP/1.1, MUST reject as unknown in 1.0) | — |

**Parsing Rule:** Deserialize content_type first; dispatch on type before parsing JSON. Unknown types MUST be treated as forward-compatible and discarded without error.

## References

- **UCP Specification:** https://github.com/unifiedcommunicationsprotocol/spec (core, messages, encryption, ai, preferences, bridge specs)
- **Note on `spec/api.md`:** Listed in spec README but not yet published; use `IMPLEMENTATION.md` and `api.ts` stubs as interim reference for REST endpoints
- **RFC 9420 (MLS):** https://datatracker.ietf.org/doc/html/rfc9420
- **RFC 9180 (HPKE):** https://datatracker.ietf.org/doc/html/rfc9180
