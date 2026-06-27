# UCP Client — Domain Language

> Shared vocabulary for the AI agent and the team.
> One term = one definition. Update whenever a new concept gets a name.

---

## Core Concepts

| Term | Definition |
|------|------------|
| **Identity Key** | Ed25519 keypair; generated at signup; backed up offline; signs signing keys for rotation |
| **Signing Key** | Ed25519 keypair; active for 60 days; auto-rotates; signs all messages & protocol records |
| **Challenge** | 32-byte random value from server; single-use; 60-second lifetime; client signs over to prove identity |
| **Session** | Opaque bearer token; 24-hour lifetime; grants API access; invalidated on logout or key rotation |
| **MLS Group** | Cryptographic group state for a thread; manages members, epochs, encryption keys (RFC 9420) |
| **Epoch** | Key derivation window; increments on membership change (Add/Remove/Update); all messages in epoch N use same key |
| **Envelope** | Top-level message wrapper; includes "from", "to" (unencrypted headers for routing); contains MLS ciphertext |
| **Message** | Content inside encrypted envelope; includes subject, body blocks, signature, metadata (AI, labels) |
| **Block** | Structural element of message body; types: paragraph, heading, list, code, blockquote, image, divider |
| **Thread** | Conversation; maps to one MLS group; shared across recipients; messages ordered by client_ts |
| **Recipient** | User receiving a message; to/cc recipients in primary group; bcc in separate group |
| **BCC Group** | Auxiliary MLS group; one per BCC recipient + sender; completely hidden from other recipients |
| **KeyPackage** | MLS public key material; one per signing key; published at `/.well-known/ucp/keypackages/<address>` |
| **Credential** | MLS credential; binds signing key to identity; includes identity_sig proving signing key binding |
| **Proposal** | MLS membership change; types: Add (new member), Remove (departure), Update (key rotation) |
| **Commit** | MLS handshake message; bundles proposals; advances epoch; includes confirmation tag |
| **Welcome** | MLS message for new members; contains group secret & tree state; server-buffered until message committed |
| **Attestation** | Server signature on bridge messages (SMTP arrivals); proves server processed message; clients verify against `_ucp-server` DNS |

## Domain Objects

| Term | Type | Definition |
|------|------|------------|
| **sender** | address | Email-like identity; used in DNS & server endpoints; verified against signing key |
| **address** | string | `user@domain`; sender identity; resolved via DNS SRV + server identity endpoint |
| **thread_id** | ULID | Unique per conversation; maps to one MLS group ID: `SHA256("group:" + thread_id)` |
| **message_id** | ULID | Sender-generated; globally unique; includes timestamp |
| **group_id** | hash | `SHA256("group:" + thread_id)` for primary; `SHA256("group_bcc:" + thread_id + ":" + address)` for BCC |
| **envelope** | bytes | Serialized message wrapper; includes headers (from, to), MLS ciphertext, signature |
| **ciphertext** | bytes | MLS-encrypted message; decrypted with group's current epoch key |
| **signature** | base64 | Ed25519(canonical_json, signing_key); verified before message display |
| **server_ts** | unix | Assigned by server at storage time; used as tiebreaker when multiple messages have same client_ts |
| **client_ts** | unix | Sender's timestamp; primary signal for message ordering; includes nanosecond precision |
| **bundle_id** | string | Server-assigned idempotency key; prevents double-processing of Welcome + message |
| **session_token** | string | Opaque bearer token; 24-hour lifetime; sent in `Authorization: Bearer` header |
| **challenge** | base64 | 32-byte random value; client signs over with Ed25519; single-use, 60s lifetime |

## States

| State | Definition | Transitions |
|-------|------------|-------------|
| **Not Authenticated** | No session token | → Authenticated (challenge → sign → redeem) |
| **Authenticated** | Valid session token | → Not Authenticated (logout, token expires, key rotates) |
| **Composing** | Message in draft (not sent) | → Pending (user clicks Send) |
| **Pending** | Message queued locally (offline or await ACK) | → Sent (server ACKs), Failed (network error) |
| **Sent** | Server ACKed; enqueued for federation | → Delivered (recipient ACKs), Failed (non-retryable error) |
| **Delivered** | Recipient's server ACKed | → Read (recipient sends receipt) |
| **Read** | Recipient read; receipt received | (terminal) |
| **Failed** | Send failed; local queue retained | → Pending (user retry) |
| **Key Rotation** | Signing key >60 days old | → New Key (client generates, publishes) |
| **Grace Period** | Old signing key still verifying (48h overlap) | → Expired (old key rejected) |

## Verification Phases

| Phase | Action | Failure → |
|-------|--------|-----------|
| **Phase 1** | Verify envelope.signature against sender's signing key (from DNS/server) | Reject message; discard |
| **Phase 2** | Decrypt MLS ciphertext with group's current epoch key | Request group refresh from server (stale epoch?) |
| **Phase 3** | Verify inner message.signature against sender's signing key | Log error; don't display |

All three must pass for message display.

## Abbreviations

| Abbrev | Expands to | Definition |
|--------|------------|------------|
| **MLS** | Messaging Layer Security | RFC 9420 encryption standard; mandatory ciphersuite: MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519 |
| **HPKE** | Hybrid Public Key Encryption | RFC 9180; key derivation used in MLS |
| **ULID** | Universally Unique Lexicographically Sortable Identifier | 128-bit ID with millisecond timestamp; used for message.id |
| **E2E** | End-to-End | Encryption from sender to recipient; server never has plaintext |
| **BCC** | Blind Carbon Copy | Recipient hidden from other recipients; separate MLS group |
| **RFC** | Request for Comments | IETF standard document |
| **SMTP** | Simple Mail Transfer Protocol | Legacy email protocol; supported via bridge attestation |
| **IMAP** | Internet Message Access Protocol | Legacy email protocol; supported via bridge attestation |
| **SRV** | Service Record | DNS record type; UCP uses `_ucp-srv` to find server |
| **TXT** | Text Record | DNS record type; UCP publishes `_ucp`, `_ucp-sign`, `_ucp-revoke`, `_ucp-server` |

---

*Last updated: 2026-06-27*
