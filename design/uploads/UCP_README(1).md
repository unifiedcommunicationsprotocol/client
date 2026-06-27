# UCP — Unified Communications Protocol

> *The open protocol for unified human and agent communications.*

UCP is an open protocol for unified human and agent communications. It replaces the fragmented legacy stack — IMAP, SMTP, CalDAV, CardDAV — with a single modern foundation covering email, messaging, calendar, contacts, and notes: push-first, E2E encrypted by default, structured, federated, and AI-native from the ground up.

**The protocol is the product.**

---

## Why UCP?

Email is 50 years old. IMAP was designed for slow, intermittent connections in the 1990s. SMTP has no native encryption. CalDAV and CardDAV are bolted-on afterthoughts. OAuth over SMTP is an embarrassment. Real-time messaging is a completely separate universe of incompatible apps. None of it was designed for AI agents.

The result is a stack that is:

- **Pull-based** — clients poll for new mail. IDLE is a hack.
- **Opaque** — everything is MIME, a format so complex that every parser gets it slightly wrong.
- **Insecure by default** — encryption is optional, PGP is unusable, S/MIME is enterprise-only.
- **Fragmented** — email, calendar, contacts, and messaging each live in separate silos with their own protocols, their own auth, their own pain. Notes have no open protocol at all.
- **Provider-locked** — your identity is hostage to your email provider.
- **Agent-hostile** — no standard surface for AI to read, write, or route communications.

UCP fixes all of it.

---

## Design Principles

**1. Push-first**
No polling. Connections are persistent. Clients MUST support WebSocket (over HTTP/1.1 or HTTP/2) and SHOULD support WebTransport (over HTTP/3 / QUIC). Messages arrive in real time.

**2. Structured by default**
Messages are typed JSON, not MIME blobs. Threading, read receipts, attachments, and metadata are first-class schema fields — not hacks layered on top. Message bodies are block-structured content; HTML is a bridge-layer concern, not a native format.

**3. E2E encrypted at the protocol level**
MLS (Messaging Layer Security, RFC 9420) is mandatory, not optional. The same standard adopted by WhatsApp, Google Messages, and Matrix. Not PGP. Not S/MIME. The wire format always carries an encrypted envelope; plaintext fields in this document describe the decrypted view after the recipient's client processes the message.

**4. Portable identity**
Your identity is an Ed25519 keypair, not a server account. Your address (`you@yourdomain.com`) is a human-readable alias anchored in DNS. Switch providers. Your identity follows you.

**5. Unified async and real-time**
Email, calendar, contacts, notes, and messaging over one connection, one auth flow, one protocol. Async and real-time are the same primitive with different delivery semantics — not different protocols. A message thread and an email thread are the same thing.

**6. AI-native**
Summaries, embeddings, categories, and routing metadata are first-class fields. Agent inboxes are a native concept. See [AI Metadata and E2E Encryption](#ai-metadata-and-e2e-encryption) for how these are reconciled with mandatory encryption.

**7. Federated**
Any server can talk to any other server. No central registry. No single point of control.

**8. Self-hostable**
The reference server ships as a single binary with zero external dependencies. Own your data.

---

## How It Works

### Identity

Every UCP identity is built on three Ed25519 keypairs generated together at account creation:

| Key | Purpose | Lives |
|---|---|---|
| **Identity key** | Signs signing keys and revocation records | Primary device + backup |
| **Signing key** | Signs all messages — rotated automatically every 60 days | Client |
| **Revocation key** | Emergency revocation only | Offline storage |

Human-readable addresses map to these keys via DNS. A full UCP identity anchors five DNS records:

```
_ucp.yourdomain.com        TXT  "v=ucp1; ik=<identity-pubkey>"
_ucp-sign.yourdomain.com   TXT  "v=ucp1; sk=<signing-pubkey>; exp=<timestamp>; sig=<sig>"
_ucp-revoke.yourdomain.com TXT  "v=ucp1; rk=<revocation-pubkey>"
_ucp-srv.yourdomain.com    TXT  "v=ucp1; endpoint=https://ucp.yourdomain.com; priority=10"
_ucp-server.yourdomain.com TXT  "v=ucp1; spk=<server-pubkey>"
```

Your address is `you@yourdomain.com`. Your identity key is what actually identifies you. The signing key rotates automatically — forward secrecy at the identity layer — while your identity stays stable. The revocation key lives offline and is your emergency brake.

For users without their own domain, hosted UCP servers provide addresses (e.g. `you@yourucp.im`) backed by the same keypair model. The tradeoff is explicit: hosted users trust the operator to publish DNS records on their behalf, exactly as they trust Gmail today. Own your domain; own your identity.

### Transport

UCP uses a single persistent connection primitive with two wire implementations, negotiated at handshake time:

- **WebSocket** (over HTTP/1.1 or HTTP/2) — baseline, MUST be supported by all clients and servers. Works through firewalls and corporate proxies.
- **WebTransport** (over HTTP/3 / QUIC) — preferred path, SHOULD be supported. Enables native QUIC streams, eliminating head-of-line blocking when multiplexing message types over a single connection.

No custom TCP ports. The same connection handles push delivery, federation, and API calls.

### Authentication

UCP authentication is keypair-based. Clients prove ownership of their signing key via a challenge-response flow — no password required. The server issues a short-lived session token on success. How a signing key is initially registered with a server (open signup, invite, payment) is implementation-defined and out of protocol scope.

### Message Schema

All UCP messages are structured and typed. The same schema covers email, chat, calendar events, notes, and contacts — differentiated by `type`. For UCP/1.0, `message.email` is the defined type; additional types are reserved for future versions. What follows is the **decrypted view** as seen by an authenticated client after MLS decryption; servers in transit see only the encrypted envelope.

Message bodies are block-structured content — headings, paragraphs, lists, code, images. This is the native UCP format. HTML is optional and treated as a render hint; it is never the source of truth for structured processing.

```json
{
  "id": "01J3K...",
  "version": "ucp/1.0",
  "type": "message.email",
  "from": "alex@yourdomain.com",
  "to": ["team@company.com"],
  "subject": "Q3 review",
  "body": {
    "blocks": [
      { "type": "paragraph", "content": [{ "text": "See the draft below." }] },
      { "type": "code", "lang": "go", "content": "fmt.Println(\"hello\")" }
    ],
    "html": "<p>...</p>"
  },
  "thread_id": "01J3K...",
  "attachments": [],
  "client_ts": 1720000000,
  "meta": {
    "ai": {
      "summary": "Alex is requesting feedback on the Q3 review draft.",
      "category": "work",
      "priority": 2
    }
  },
  "signature": "<base64-ed25519-sig>"
}
```

The `body.html` field is optional. Native UCP senders omit it entirely. The IMAP/SMTP bridge populates it from inbound HTML email and generates `body.blocks` via conversion. AI and search always operate on `body.blocks`, never on `body.html`.

The wire format wraps this payload in an MLS-encrypted `UCPEnvelope`. The envelope carries unencrypted routing metadata (`from`, `to`, `thread_id`, `signing_key`) and the MLS ciphertext — servers route without reading. See [`spec/encryption.md`](./spec/encryption.md) for the full envelope schema.

### Security Model

UCP provides layered security that makes each layer's compromise bounded:

- **MLS forward secrecy** — epoch keys are deleted after use. Compromise of current key material cannot expose past messages.
- **Signing key rotation** — automatic every 60 days. A compromised signing key is bounded to its 60-day window; past messages remain safe by MLS guarantee.
- **Identity key separation** — the identity key never signs messages directly. It only issues and revokes signing keys, and lives on the primary device or in backup storage.
- **Revocation key offline** — stored offline, never touches the network. Signs revocation records only. One deliberate ceremony during onboarding, then inert until needed.
- **Server blindness** — servers are zero-knowledge relays by default. They store and forward encrypted envelopes without decrypting content. Opt-in server processing is available for users who want server-side search or smart routing, declared explicitly in the identity record.

### AI Metadata and E2E Encryption

The `meta.ai` fields present an intentional design tension: if MLS encryption is mandatory and the server never sees plaintext, who generates summaries and categories?

UCP takes an explicit stance: **AI metadata is always client-generated or sender-supplied.** Three sources are valid:

- **Sender-supplied** — the sending client or agent populates `meta.ai` before encryption. Useful for autonomous agents sending structured messages.
- **Local client inference** — the recipient's client generates `meta.ai` post-decryption, locally. No plaintext leaves the device. When a message is forwarded or quoted, locally-generated metadata is promoted to the outbound payload so enrichment propagates naturally through threads.
- **Opt-in server processing** — a user may explicitly grant their UCP server a per-group decryption key share for inbox processing (search indexing, smart routing). This is a deliberate user action, not a default, and is declared in the identity record.

The default is local. The server default is zero-knowledge. This is specified explicitly in [`spec/ai.md`](./spec/ai.md).

### Recipient Preferences

UCP recipients declare preferences in their identity record that senders read before composing. This shifts control from sender to recipient:

- **`rendering`** (`html` | `blocks`, default `html`) — governs whether the client renders `body.html` or always uses `body.blocks`. The `blocks` preference structurally eliminates tracking pixels, remote image loads, and CSS fingerprinting — a privacy guarantee that falls out of the rendering model for free.
- **`read_receipts`** (`bool`, default `false`) — whether the client sends read receipts. Off by default; always opt-in.
- **`external_images`** (`bool`, default `false`) — whether the client auto-loads externally referenced images.
- **`language`** (`ISO 639-1`, default `"en"`) — preferred language for AI-generated metadata.

A `blocks`-only recipient is a signal to sending clients that they can skip generating `body.html` entirely, keeping messages leaner. Preferences are specified in [`spec/preferences.md`](./spec/preferences.md).

### Federation

Server-to-server routing follows the DNS-anchored model. A UCP server resolves `_ucp-srv.company.com` to find the destination server, establishes a mutually authenticated connection (both servers prove their identity via Ed25519 challenge-response), and delivers the encrypted envelope. No central routing. No single point of failure.

### Backwards Compatibility

UCP/1.0 ships with a built-in IMAP/SMTP bridge. This is a first-class deliverable, not an afterthought — it is the adoption path. Connect your Gmail, Outlook, or Fastmail account and UCP speaks legacy protocols on your behalf. Migration is incremental: you don't abandon your existing email address to use UCP.

Inbound SMTP messages are converted to UCP format and wrapped in a **bridge attestation** — a receipt signed by the server's keypair confirming when and from whom the message was received. Clients render these with a clear indicator: "Received via email bridge — not end-to-end encrypted." This is honest about the security boundary rather than hiding it.

CalDAV and CardDAV bridges are planned for UCP/1.1.

---

## Compared to Existing Protocols

**JMAP (RFC 8620/8621)** is a well-designed, push-capable, structured replacement for IMAP with real adoption (Fastmail, Stalwart, Cyrus). UCP's differences with JMAP are intentional but specific: JMAP covers email only, has no E2E encryption story, no portable identity, no real-time messaging primitive, and no unified schema across message types. If you only need modern email, JMAP is a strong, stable choice. UCP is the answer when you need everything unified.

**Matrix** solves real-time messaging and has serious federation momentum. It does not cover email, calendar, contacts, or notes, and its E2E story (via Olm/Megolm) predates MLS and has known limitations. Room state complexity makes it a poor fit for async email semantics.

| | IMAP/SMTP | JMAP | Matrix | UCP |
|---|---|---|---|---|
| Push-first | ✗ | ✓ | ✓ | ✓ |
| Structured messages | ✗ | Partial | Partial | ✓ |
| E2E by default | ✗ | ✗ | Partial (Olm/Megolm) | ✓ (MLS/RFC 9420) |
| Portable identity | ✗ | ✗ | ✗ | ✓ |
| Signing key rotation | ✗ | ✗ | ✗ | ✓ |
| Unified async + real-time | ✗ | ✗ | ✗ | ✓ |
| Email | ✓ | ✓ | ✗ | ✓ |
| Messaging | ✗ | ✗ | ✓ | ✓ (1.1) |
| Calendar + contacts | ✗ | ✗ | ✗ | ✓ (1.1) |
| Notes | ✗ | ✗ | ✗ | ✓ (1.1) |
| AI-native | ✗ | ✗ | ✗ | ✓ |
| Self-hostable | ✓ | ✓ | ✓ | ✓ |
| Federated | ✓ | ✗ | ✓ | ✓ |
| Legacy bridge | — | — | ✗ | ✓ |

---

## Specification

**The spec is the primary deliverable.** The reference implementation follows the spec; if they conflict, the spec wins. Protocol decisions made now are hard to undo.

The UCP specification lives in [`/spec`](./spec):

**UCP/1.0**
- [`spec/core.md`](./spec/core.md) — transport, identity, authentication, federation
- [`spec/messages.md`](./spec/messages.md) — message schema, block content model, threading, attachments
- [`spec/encryption.md`](./spec/encryption.md) — key hierarchy, signing key lifecycle, MLS envelope format
- [`spec/ai.md`](./spec/ai.md) — AI metadata surface, zero-knowledge defaults, opt-in server processing
- [`spec/preferences.md`](./spec/preferences.md) — recipient preferences, identity-declared capabilities
- [`spec/bridge.md`](./spec/bridge.md) — IMAP/SMTP bridge, bridge attestation model
- [`spec/api.md`](./spec/api.md) — client API, wire encoding, push events, message submission, inbox retrieval

> **⚠ Production status:** The UCP/1.0 spec is a draft suitable for implementation and testing. One known production blocker exists: the `UCPWelcomeExtension` type value (`0x0F01`) is a placeholder pending IANA registration. Any implementation shipping Welcome messages with this value will be permanently incompatible with the registered value. See `spec/encryption.md` § UCPWelcomeExtension for details. This notice will be removed when the registered value is published as a normative spec update.

**UCP/1.1+**
- [`spec/messaging.md`](./spec/messaging.md) — real-time messaging, threads, reactions, presence
- [`spec/calendar.md`](./spec/calendar.md) — calendar and scheduling
- [`spec/contacts.md`](./spec/contacts.md) — contacts and address book
- [`spec/notes.md`](./spec/notes.md) — notes, documents, and rich content

---

## Reference Implementation

The reference server is written in Go. It ships as a single binary.

```sh
git clone https://github.com/oheriko/ucp
cd ucp/server
go build -o ucp-server ./cmd/server
./ucp-server --config config.toml
```

### Server Structure

```
server/
├── src/
│   ├── transport/        # WebSocket (HTTP/1.1+HTTP/2) + WebTransport (HTTP/3)
│   ├── identity/         # Ed25519 keypairs, DNS resolution, signing key rotation
│   ├── crypto/           # MLS (RFC 9420)
│   ├── router/           # Federation + message routing
│   ├── store/            # Message storage
│   ├── bridge/           # IMAP/SMTP bridge (first-class)
│   ├── ai/               # AI metadata, server processing
│   └── api/              # Client-facing API
└── go.mod
```

---

## SDKs

| Language | Repo | Status |
|---|---|---|
| TypeScript | `ucp/sdk-ts` | Planned |
| Go | `ucp/sdk-go` | Planned |
| Python | `ucp/sdk-python` | Planned |
| Rust | `ucp/sdk-rust` | Planned |

---

## Roadmap

### UCP/1.0 — Email + Encryption + Bridge
- [ ] Core spec — transport, identity, authentication, federation
- [ ] Encrypted envelope spec (MLS wire format, three-keypair hierarchy)
- [ ] Email message schema (blocks-first body, optional HTML, forwarding)
- [ ] AI metadata spec (zero-knowledge defaults, opt-in server processing)
- [ ] Recipient preferences spec
- [ ] Client API spec (wire encoding, push events, message submission, inbox retrieval)
- [ ] DNS-anchored identity (five-record model)
- [ ] Reference server (Go)
- [ ] IMAP/SMTP bridge — *first-class adoption path*
- [ ] TypeScript SDK
- [ ] Protocol conformance test suite

### UCP/1.1 — Unified Primitives
- [ ] Messaging — real-time threads, reactions, presence
- [ ] Calendar (CalDAV bridge + native UCP calendar)
- [ ] Contacts (CardDAV bridge + native UCP contacts)
- [ ] Notes (no legacy bridge — first open protocol for notes)
- [ ] Go + Python + Rust SDKs
- [ ] Agent-addressable inboxes
- [ ] Label sync across devices

### UCP/2.0 — Decentralized
- [ ] P2P message routing (no server required for direct delivery)
- [ ] Offline-first sync
- [ ] Decentralized identity registry (no DNS dependency)
- [ ] Tasks, Files, Presence, Feeds

---

## Contributing

The spec is the most important thing to get right. Open an issue before proposing spec changes. Implementation PRs are welcome once the relevant spec section is stable.

```sh
go test ./...    # reference server tests
go vet ./...     # lints
gofmt -w .       # formatting
```

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full process.

---

## License

MIT © [oheriko](https://github.com/oheriko)
