---
name: ucp_specification_summary
description: "Complete UCP/1.0 specification overview — transport, encryption, messages, AI metadata, preferences, and IMAP/SMTP bridge"
metadata: 
  node_type: memory
  type: reference
  originSessionId: c09ed31f-68c0-4ffb-868b-cde13d4f3dd7
---

# UCP/1.0 Specification — Complete Summary

## Core Philosophy

UCP (Unified Communications Protocol) is a replacement for IMAP/SMTP/CalDAV/CardDAV designed for:
- **Push-first** — persistent WebSocket/WebTransport, no polling
- **E2E encrypted by default** — MLS (RFC 9420) mandatory
- **Portable identity** — Ed25519 keypairs anchored in DNS
- **AI-native** — metadata (summaries, categories) as first-class fields
- **Federated** — server-to-server delivery
- **Self-hostable** — single binary, zero external deps

---

## Transport Layer (`spec/core.md`)

### Connection Types
- **WebSocket** (HTTP/1.1, HTTP/2) — baseline, all clients/servers MUST support
- **WebTransport** (HTTP/3/QUIC) — preferred, eliminates head-of-line blocking

### Handshake Flow
1. Client → Server: `UCPHello { version, auth_token, capabilities }`
2. Server → Client: `UCPHelloAck { version, server_id, server_sig, capabilities, stale_key_shares }`
3. Server cryptographically proves identity via Ed25519 signature binding to session token

### Authentication
- Challenge-response using signing key (no passwords)
- Server verifies signature, issues short-lived session token (max 24 hours)
- Tokens refreshable and revocable
- Challenge single-use, 60-second expiry

### Federation
- Server-to-server mutual authentication via Ed25519 challenge-response
- Persistent authenticated connection reused for all deliveries
- Bundled delivery for new threads (Welcome + first message atomic)
- 48-hour retry window with exponential backoff (1min → 4hr max)

---

## Identity Model (`spec/core.md`, `spec/encryption.md`)

### Three Keypair Hierarchy
| Key | Purpose | Storage | Rotation |
|-----|---------|---------|----------|
| **Identity key** | Signs signing keys, revocation records | Primary device + offline backup | Never (emergency only) |
| **Signing key** | Signs all messages | Client | Every 60 days (auto) |
| **Revocation key** | Emergency revocation only | Offline storage | Never |

### DNS Records (5 records per identity)
```
_ucp.domain             TXT  "v=ucp1; ik=<base64-identity-pubkey>"
_ucp-sign.domain        TXT  "v=ucp1; sk=<base64-signing-pubkey>; exp=<timestamp>; sig=<identity-sig>"
_ucp-revoke.domain      TXT  "v=ucp1; rk=<base64-revocation-pubkey>"
_ucp-srv.domain         TXT  "v=ucp1; endpoint=https://ucp.domain; priority=10"
_ucp-server.domain      TXT  "v=ucp1; spk=<base64-server-pubkey>"
```

### Key Rotation Flow
1. Generate new signing keypair
2. Identity key signs binding string: `signing_key:<key>:<expires>`
3. Publish via `PUT /identity/signing-key`
4. Old key enters **48-hour grace period** (valid for verification only)
5. New key becomes active immediately for signing
6. After 48 hours, old key marked expired

### Revocation
- Issued by revocation key (offline) when identity compromised
- Signed record published to server well-known endpoint + DNS
- Clients reject all future messages from revoked identity

---

## Message Schema (`spec/messages.md`)

### Core Fields (Decrypted view)
```json
{
  "id": "<ulid>",
  "version": "ucp/1.0",
  "type": "message.email",
  "from": "alex@example.com",
  "to": ["team@company.com"],
  "cc": [],
  "bcc": [],
  "subject": "Q3 review",
  "body": {
    "blocks": [...],
    "html": "<p>Optional</p>"
  },
  "attachments": [],
  "thread_id": "<ulid>",
  "in_reply_to": null,
  "references": [],
  "priority": 3,
  "client_ts": 1720000000,
  "meta": { "ai": {...}, "labels": [] },
  "signature": "<base64-ed25519-sig>"
}
```

### Block Types
- `paragraph` — text with inline marks
- `heading` — levels 1-3
- `list` — ordered/unordered
- `code` — syntax highlighted
- `blockquote` — nested blocks
- `image` — attachment or external URL
- `divider` — horizontal rule

### Inline Marks
- `bold`, `italic`, `code`, `strikethrough`, `link` (with href)

### Threading
- New thread: `thread_id = id`, `in_reply_to = null`
- Reply: same `thread_id`, `in_reply_to = parent_id`, `references = [..., parent_id]`
- Forward: new thread, `origin` field populated

### BCC Handling
- Separate MLS groups for BCC recipients
- BCC group ID: `SHA-256("group_bcc:" || thread_id || ":" || recipient_address)`
- BCC recipients see only their own address in `bcc` field

### Edits & Deletions
- Edit: `content_type: 0x04`, replaces message body
- Delete: `content_type: 0x05`, tombstones message
- Only original sender can edit/delete
- Content-type delivered as separate MLS PrivateMessage

### Read Receipts
- `content_type: 0x03`
- Opt-in per recipient preference
- Never sent for bridge-attested messages

---

## Encryption (`spec/encryption.md`)

### MLS Configuration
- **Ciphersuite:** `MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519` (required)
- **Alternative:** `MLS_256_DHKEMP384_AES256GCM_SHA384_P384` (optional)

### Credential Binding
```json
{
  "credential_type": "signing_key",
  "signing_key": "<base64-signing-pubkey>",
  "identity": "you@example.com",
  "identity_key": "<base64-identity-pubkey>",
  "identity_sig": "<base64-identity-key-sig>"
}
```
- Identity key signs the signing key binding
- MLS credential references current signing key (rotated on key rotation via MLS Update)

### Groups and Threads
- **Primary group:** one per thread, all `to`/`cc` recipients
- **Auxiliary BCC groups:** one per BCC recipient
- Group ID derivation: `SHA-256("group:" || thread_id)`
- New thread: Welcome + first message must be delivered atomically via `UCPBundledDeliver`

### KeyPackages
- Published at `/.well-known/ucp/keypackages/<address>`
- Contains HPKE public keys + UCP credential
- Must be refreshed on signing key rotation
- Server rejects KeyPackages with mismatched signing key

### UCPEnvelope (Wire Format)
```json
{
  "v": "ucp/1.0",
  "type": "welcome | handshake | application",
  "thread_id": "<thread-id>",
  "from": "alex@example.com",
  "to": ["team@company.com"],
  "signing_key": "<base64-signing-pubkey>",
  "server_ts": null,
  "mls": "<base64-TLS-serialized-MLSMessage>"
}
```
- Unencrypted routing metadata visible to server
- MLS message type: mls_welcome, mls_public_message, or mls_private_message

### UCPApplicationData (Plaintext inside MLS PrivateMessage)
```
ContentType content_type;  // 0x01=message, 0x03=receipt, 0x04=edit, 0x05=delete, 0x06=attachment
opaque content<0..2^32-1>;  // JSON payload
```

### Security Properties
- Forward secrecy: MLS epoch key deletion
- Post-compromise security: MLS Update on signing key rotation
- Sender auth: Ed25519 signing key signature
- Identity binding: Identity key → signing key → MLS credential chain

---

## AI Metadata (`spec/ai.md`)

### Three-Source Model
1. **Sender-supplied** — populated pre-encryption by sending client/agent
2. **Local client inference** — generated post-decryption by recipient's client; promoted on forward/quote
3. **Opt-in server processing** — user grants decryption key share for search/summary/routing

### Zero-Knowledge Default
- Server never sees plaintext by default
- Local inference is primary path
- Server processing is explicit user action

### `meta.ai` Schema
```json
{
  "summary": "Natural language summary",
  "category": "work | personal | newsletter | notification | transactional | social",
  "priority": 1-5,  // 1=urgent, 5=bulk
  "embeddings": [0.023, -0.117, ...]  // LOCAL ONLY, never transmitted
}
```

### Server Processing
- User declares in identity record: `server_processing: { enabled: true, scopes: ["search", "summary", "routing"] }`
- Client derives per-group key via MLS-Exporter: `MLS-Exporter("server_processing", "", Hash.length)`
- Key scoped to specific group and epoch
- Stale key shares detected on decryption failure; client re-shares on reconnect
- Revocation: immediate discard + delete plaintext derivatives within 24 hours

---

## Recipient Preferences (`spec/preferences.md`)

### Declared in Identity Record
```json
{
  "rendering": "html | blocks",  // default "html"
  "read_receipts": boolean,      // default false
  "external_images": boolean,    // default false
  "language": "ISO-639-1"        // default "en"
}
```

### Effects
- **`rendering: blocks`** — client ignores HTML, structurally eliminates tracking pixels & CSS fingerprinting
- **`read_receipts: true`** — client sends receipt when message viewed
- **`external_images: true`** — client auto-loads remote images
- **`language`** — hint for AI metadata generation

### Sender Behavior
- Fetch preferences before composing (cached for session)
- Native UCP clients SHOULD omit HTML for `blocks` recipients
- Bridge always generates both (recipient's client ignores HTML if preference is `blocks`)

---

## IMAP/SMTP Bridge (`spec/bridge.md`)

### Two Operating Modes
1. **Inbound Gateway** — UCP server accepts inbound SMTP, converts to UCP
2. **Account Bridge** — user connects existing email account (Gmail, Outlook, etc.)

### Bridge Attestation
```json
"bridge_attestation": {
  "source": "smtp",
  "smtp_from": "sender@gmail.com",
  "smtp_message_id": "<abc123@gmail.com>",
  "received_at": 1720000000,
  "receiving_server": "ucp.example.com",
  "threading_gap": false,
  "dkim": "pass | fail | none",
  "server_sig": "<base64-server-ed25519-sig>"
}
```
- Honest indicator: "Received via email bridge — not end-to-end encrypted"
- Verifiable against server's public key from `/.well-known/ucp/server-key`
- Bridge-attested messages have `bridge_attestation` (no `signature`)

### HTML to Block Conversion
- `<p>` → `paragraph`, `<h1-3>` → `heading`, `<ul>` → `list` etc.
- Tables not supported in 1.0 (preserved in HTML only)
- Inline images (MIME parts) uploaded as attachments
- External images preserved as `external_url`
- Unknown elements extract text, wrap in paragraph

### UCP to SMTP Conversion
- Generate SMTP `Message-ID`, `In-Reply-To`, `References`
- Blocks rendered to both plain text and HTML
- Attachments added as MIME parts
- DKIM-sign all outbound messages

### Threading
- Maintains mapping: SMTP Message-ID ↔ UCP ULID
- Inbound: resolve via `References` then `In-Reply-To`
- Outbound: generate Message-ID from UCP ULID
- Retain mapping for 3+ years (extensible)

---

## Key Integration Points for Client

### Signing
- All native messages signed with signing key
- Canonical form: UTF-8 JSON, keys sorted lexicographically, no whitespace, signature field omitted
- Verification happens in two phases:
  1. **Envelope verification** (pre-decryption): confirm signing_key matches active/grace key
  2. **Payload verification** (post-decryption): verify signature over canonical message

### MLS Group Management
- Create group from recipient KeyPackages
- Commit Add proposals for recipients
- Handle Welcome message (contains thread metadata in extension)
- Track epoch for key rotation
- Handle stale key shares on server processing

### Storage
- Messages indexed by thread_id
- Thread ordering via client_ts (primary), server_ts (tiebreaker)
- Preserve unknown fields for forward compatibility
- Support edits/deletions by reference

### Preferences Caching
- Fetch recipient preferences before composing
- Cache for session duration
- Respect rendering, receipt, image, language preferences
- Omit HTML for `blocks` recipients (optimization)
