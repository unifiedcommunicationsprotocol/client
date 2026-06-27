# UCP Client Implementation Guide

> A reference implementation of the Unified Communications Protocol (UCP) client in TypeScript + Bun.

## Status

⏳ **Scaffolded (v1.0)**
- API client stub (`src/lib/api.ts`)
- TypeScript configuration ready
- Bun build + test setup
- Ready for core implementation

## Core Responsibilities

The UCP client is **cryptographically responsible** for:

1. **Key Management**
   - Generate identity key (Ed25519) at signup — stored offline/encrypted
   - Generate signing key (Ed25519) for authentication — stored on device
   - Rotate signing key every 60 days with grace period
   - Publish DNS records for identity resolution (`_ucp`, `_ucp-sign`)

2. **Message Signing & Verification**
   - Sign all outbound messages with signing key
   - Verify all inbound messages against sender's signing key
   - Resolve sender's identity via DNS and server endpoints
   - Check signing key binding to identity key

3. **MLS Group Management (RFC 9420)**
   - Create groups for each thread
   - Fetch KeyPackages from recipients
   - Issue Add/Remove/Update proposals
   - Manage epoch advancement on membership changes
   - Encrypt messages with epoch-specific keys

4. **Attachment Encryption**
   - Encrypt file content to MLS group
   - Upload ciphertext to server `/content` endpoint
   - Store attachment metadata locally

5. **Connection Management**
   - Establish persistent WebSocket to server
   - Handle authentication (challenge-response with Ed25519)
   - Maintain 30-second keepalive pings
   - Reconnect with exponential backoff (1s → 60s)

## Architecture

```
┌────────────────────────────────────────────────┐
│          UCP Client (TypeScript/Bun)           │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │         UI / Application Layer            │ │
│  │  (Compose, thread list, settings, etc.)  │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │      Message & State Management           │ │
│  │  ├─ Thread store (IndexedDB)              │ │
│  │  ├─ Receipt tracking                      │ │
│  │  ├─ Editing/deletion                      │ │
│  │  └─ AI metadata (local only)              │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │       MLS & Encryption Layer              │ │
│  │  ├─ Group state management                │ │
│  │  ├─ Epoch encryption/decryption           │ │
│  │  ├─ Proposal bundling (Add/Remove/Update)│ │
│  │  └─ Welcome message handling              │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │     Signing & Verification Layer          │ │
│  │  ├─ Ed25519 message signing               │ │
│  │  ├─ Signature verification                │ │
│  │  ├─ Identity resolution (DNS)             │ │
│  │  └─ Key rotation automation               │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │        API Client & Transport             │ │
│  │  ├─ WebSocket connection                  │ │
│  │  ├─ Challenge-response auth               │ │
│  │  ├─ Message envelope handling             │ │
│  │  └─ Content upload/download               │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │    Server (UCP) ← HTTPS/WebSocket         │ │
│  │                                           │ │
│  │  [Relay encrypted blobs, serve keys,     │ │
│  │   route federation, verify signatures]   │ │
│  └─────────────────────────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘
```

## Implementation Phases

### Phase 1: Foundation (Sprint 1-2)

#### Authentication & Connection
- [ ] WebSocket connection establishment (try WebTransport first, fallback to WebSocket)
- [ ] `UCPHello` handshake: send `{ version, auth_token, capabilities }`
- [ ] Receive `UCPHelloAck`: verify `server_sig` against `_ucp-server` DNS key
  - Binding string format: `"server_hello:" || auth_token || server_id`
  - Verify signature covers both session token and server identity
- [ ] Challenge-response authentication: single-use 32-byte challenge, 60-second expiry
- [ ] WebSocket keepalive: 30-second pings, 10-second pong timeout
- [ ] Exponential backoff reconnect: 1s → 60s with ±20% jitter

#### Cryptography Basics
- [ ] Ed25519 key generation (`tweetnacl.js` or `libsodium.js`)
- [ ] Message signing: canonical JSON (sorted keys, UTF-8, no whitespace)
- [ ] Message verification: check signature before payload processing
- [ ] Canonical form must match exactly: all fields sorted, `signature` field omitted before signing

#### Identity & Key Resolution
- [ ] DNS SRV/TXT lookups: `_ucp-srv`, `_ucp-sign`, `_ucp-revoke`, `_ucp-server`
- [ ] Fetch `/.well-known/ucp/identity/<address>` for current key state
- [ ] Cache identity endpoint results for session (invalidate on key change or revocation)
- [ ] Verify signing key binding to identity key via identity_sig
- [ ] Check for revocation record; reject all messages from revoked identity

#### Message Envelope Serialization
- [ ] Build `UCPEnvelope`: `{ v, type, thread_id, from, to, signing_key, server_ts, mls }`
- [ ] Note: `server_ts` is always null on send (server assigns on receipt)
- [ ] Serialize MLS ciphertext to base64 for transport
- [ ] Parse inbound envelopes; verify envelope fields before MLS decryption

### Phase 2: MLS (Sprint 3-4)
- [ ] MLS group creation
- [ ] KeyPackage fetching + storage
- [ ] Message encryption/decryption (RFC 9420)
- [ ] Epoch advancement on membership changes
- [ ] Proposal bundling (Add/Remove/Update)
- [ ] Welcome message handling

### Phase 3: UI & UX (Sprint 5-6)
- [ ] Thread list + message display
- [ ] Compose flow (recipient picker, MLS add-member)
- [ ] Real-time sync (WebSocket subscription)
- [ ] Read receipts (optional)
- [ ] Editing/deletion
- [ ] Attachment upload/download

### Phase 4: Polish (Sprint 7+)
- [ ] AI metadata (local summaries, categories)
- [ ] BCC support (separate MLS groups)
- [ ] Contact management
- [ ] Search (local only, no embeddings to server)
- [ ] Multi-device sync
- [ ] Offline support (message queueing)

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Runtime** | Bun 1.0+ | Fast TypeScript/JavaScript |
| **Language** | TypeScript | Type safety, strict mode |
| **Build** | Bun build | No webpack/rollup needed |
| **Crypto (Signing)** | tweetnacl.js or libsodium.js | Ed25519 signing |
| **Crypto (MLS)** | mlspp (via FFI) or pure-JS impl | RFC 9420 required |
| **Storage** | IndexedDB | Message & thread state |
| **DNS** | Node.js dns module or browser DNS API | Identity resolution |
| **HTTP/WS** | Fetch API + WebSocket API | Standard browser APIs |
| **Testing** | Bun test runner | Table-driven tests |

## Key Constraints

1. **No plaintext secrets on server** — identity key never sent to server
2. **MLS required** — all messages encrypted to group, server cannot decrypt
3. **Ed25519 signing mandatory** — every message signed, every sender verified
4. **Single-use challenges** — 60-second lifetime, one-time use only
5. **Signing key rotation** — automatic every 60 days, grace period 48 hours
6. **Forward compatibility** — unknown message blocks/marks must be preserved
7. **No local labels in 1.0** — labels are device-local, not synced
8. **No embeddings to server** — AI metadata stays local

## References

- **UCP Specification:** https://github.com/unifiedcommunicationsprotocol/spec
- **RFC 9420 (MLS):** https://datatracker.ietf.org/doc/html/rfc9420
- **RFC 9180 (HPKE):** https://datatracker.ietf.org/doc/html/rfc9180
- **Ed25519:** https://ed25519.cr.yp.to/

## Contributing

This is a reference implementation. Contributions welcome for:
- Core MLS group state machine
- Signing & verification logic
- UI/UX components
- Testing & coverage
- Documentation
