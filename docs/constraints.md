# Client Implementation Constraints

Hard constraints for UCP client. Must be respected unconditionally.

---

## Critical Environment Constraint

### ⚠️ NEVER Run Git Commands in Home Directory

**DO NOT run `git` commands in `~` or `/home/erik` or any parent directory of this project.**

- ✅ Git operations are ONLY safe in `/home/erik/Code/unifiedcommunicationsprotocol/client` and subdirectories
- ❌ Never run git commands like `git clone`, `git init`, `git status`, etc. in:
  - `~` (home directory)
  - `/home/erik` (user directory)
  - `/home/erik/Code` (any parent)
- ❌ This includes indirect git operations (e.g., cloning repos, checking status, pulling branches)
- ✅ When fetching external repos (like UCP spec), use Bash tools to clone into `/tmp/claude-*` or project subdirectories only

**Why:** Running git in unintended directories can corrupt the user's local environment, affect other projects, or create unwanted state changes.

---

## Cryptography & Security (Non-negotiable)

### NEVER
- ❌ Store identity key on device (back up offline only)
- ❌ Send plaintext message content to server (always MLS-encrypted)
- ❌ Trust a message without verifying all three phases (envelope → MLS → inner signature)
- ❌ Skip identity resolution (DNS lookup or server verification required)
- ❌ Reuse MLS group for multiple threads (one group per thread_id)
- ❌ Log secrets, challenges, private keys, or decrypted content
- ❌ Commit secrets, tokens, credentials, or key material
- ❌ Bypass Ed25519 signing (every message signed, every sender verified)
- ❌ Accept non-canonical JSON for signature (sorted keys, UTF-8, no whitespace)
- ❌ Skip grace period on signing key rotation (48-hour overlap required)

### ALWAYS
- Verify `_ucp-server` DNS TXT record on server connection (Ed25519 signature binding)
- Rotate signing key automatically every 60 days
- Publish DNS records for identity resolution (`_ucp`, `_ucp-sign`, `_ucp-revoke`)
- Use persistent WebSocket with exponential backoff reconnect (1s → 60s)
- Serialize messages to canonical JSON (sorted keys, UTF-8) before signing
- Preserve unknown block types and inline marks (forward compatibility)
- Handle both MLS decryption failure AND signature verification failure
- Maintain single active session per account

## Protocol Compliance

### NEVER
- ❌ Modify RFC 9420 ciphersuite (must use `MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519`)
- ❌ Simplify MLS implementation (all 5 phases required: serialization, tree, encryption, proposals, handshakes)
- ❌ Allow new members to see prior thread history (MLS property, not optional)
- ❌ Use same MLS group for to/cc AND bcc (separate BCC groups required)
- ❌ Send envelope without MLS encryption (all messages encrypted to group)
- ❌ Accept messages with invalid signatures (all three phases or reject)
- ❌ Send Welcome separately from first message (bundle atomically)
- ❌ Change message signing algorithm (Ed25519 only)

### ALWAYS
- Bundle Welcome + first message atomically (server must handle atomic delivery)
- Create one MLS group per thread_id
- Create one BCC group per BCC recipient (sender + recipient only)
- Implement challenge-response authentication (Ed25519 over random challenge)
- Use ULID for message.id (includes timestamp, globally unique)
- Use client_ts as primary message ordering signal (server_ts only for tiebreaker)
- Verify envelope signature BEFORE attempting MLS decryption
- Verify inner message signature AFTER MLS decryption

## Storage & Client State

### NEVER
- ❌ Cache plaintext message content longer than necessary
- ❌ Store identity key anywhere on device (backup offline only)
- ❌ Persist signing key in plaintext (use platform keychain/secure storage)
- ❌ Trust cached keys without refresh (60+ day age warrants refresh)
- ❌ Clear MLS group state without user action
- ❌ Sync labels across devices (device-local in v1.0)

### ALWAYS
- Use IndexedDB for local message storage (encrypted payloads only)
- Implement offline message queueing with retry-on-reconnect
- Refresh identity keys if local cache >60 days old
- Handle stale key shares on reconnect (request server assistance)
- Expire sessions after 24 hours or app close

## UX & Behavior

### NEVER
- ❌ Display `meta.headers` in UI (bridge artifacts only)
- ❌ Send `meta.embeddings` to server (local semantic search only)
- ❌ Apply AI-inferred priority to SMTP headers (message.priority only)
- ❌ Use `message.email` for real-time chat (deferred to message.chat in v1.1)
- ❌ Auto-login without user action (require button click)
- ❌ Show unverified messages as trusted
- ❌ Allow editing/deleting messages from bridge (server-attested SMTP messages immutable)

### ALWAYS
- Show message state: sent → delivered (server ACK) → read (receipt)
- Implement typing indicators (MLS content_type)
- Make read receipts optional (user-configurable)
- Handle failed sends with local queueing + retry
- Gracefully handle decryption errors, network timeouts, stale epochs
- Prompt user for recovery if identity key needed (restore from backup)

## Dependencies

### NEVER
- ❌ Add external TLS/crypto library (use native Web Crypto API where available)
- ❌ Use password-based authentication (challenge-response only)
- ❌ Depend on centralized key server (DNS-anchored keys only)
- ❌ Use Node.js built-ins in browser (Bun-native APIs only)

### ALWAYS
- Use Ed25519 implementation (tweetnacl.js or libsodium.js)
- Use MLS implementation (mlspp FFI or pure-JS RFC 9420)
- Use DNS library for SRV/TXT lookups
- Use IndexedDB for client storage
- Test with actual UCP server (not mocks)

## Testing

### ALWAYS
- Test message signing → verification end-to-end
- Test MLS group creation → member addition → encryption
- Test identity resolution (DNS + server)
- Test reconnection with exponential backoff
- Test offline message queueing
- Test signing key rotation and grace period
- Test BCC group isolation
- Test all three verification phases
- Test forward compatibility (unknown blocks/marks)

## Forward Compatibility & Extension

### NEVER
- ❌ Strip unknown fields from messages (preserve at all nesting levels)
- ❌ Reject messages with unknown `type` values (ignore gracefully)
- ❌ Reject messages with unknown block types (render fallback instead)
- ❌ Reject messages with unknown inline marks (render as unstyled text)
- ❌ Send embeddings or AI metadata to server (local only)
- ❌ Send read receipts for bridge-attested messages (SMTP messages immutable)
- ❌ Use 0x0F01 (UCPWelcomeExtension type) in production (IANA placeholder only)

### ALWAYS
- Preserve JSON structure including unknown fields during serialization/deserialization
- Pass through unknown message fields when forwarding or quoting
- Treat unknown content-type values as unsupported and discard
- Treat content-type 0x02 (reaction, reserved for 1.1) as unknown and discard
- Include forward compatibility hint in code: "unknown extensions are forward-compatible"

## Attachment & Content Handling

### ALWAYS
- Verify attachment epoch matches message envelope epoch (server rejects mismatch with `attachment_epoch_mismatch`)
- Upload attachments BEFORE sending message referencing them
- Store attachment metadata: id, name, mime_type, size, sha256
- Verify SHA-256 of decrypted content matches metadata before rendering
- Accept both `attachment_id` (native) and `external_url` (bridge/linked) in image blocks

### NEVER
- ❌ Load external images automatically (respect `external_images` preference)
- ❌ Use `body.html` for structured processing (always use `body.blocks`)
- ❌ Skip SHA-256 integrity verification on attachments

## Message Verification Phases

**All three phases MUST pass or message is rejected and plaintext discarded:**

1. **Envelope Verification (before MLS decryption):**
   - Resolve sender's address to server endpoint and fetch keys
   - Confirm `signing_key` in envelope matches sender's active or grace signing key (or server key for bridge)
   - Verify identity key signature over signing key binding string: `signing_key:<key>:<expires>`
   - Check that no revocation record is present

2. **MLS Decryption:**
   - Decrypt message using MLS group state
   - Verify MLS authentication tag
   - Return plaintext and continuation tag

3. **Payload Verification (after MLS decryption, native UCP only):**
   - Parse decrypted message JSON
   - Verify `signature` field using signing key confirmed in phase 1
   - Check message.from matches authenticated sender address
   - Bridge messages skip phase 3 (use bridge_attestation instead)

**Bridge-attested messages:** Verify `bridge_attestation.server_sig` against server's public key from `/.well-known/ucp/server-key` after MLS decryption.

## System Messages

Three defined types in 1.0; all are delivery or state notifications, never federated:

| Type | Source | Description | Signature |
|------|--------|-------------|-----------|
| `system.delivery_failure` | Server | Delivery failed after retry window (48 hours) | Carries `server_sig` (Ed25519) |
| `system.member_added` | Client | MLS Add commit processed locally | No signature (MLS provides auth) |
| `system.member_removed` | Client | MLS Remove commit processed locally | No signature (MLS provides auth) |

**Verification:** Server-generated messages MUST have signature verified against server key before rendering. Discard silently if verification fails.

## Recipient Preferences & Caching

**Fetch Strategy:**
- Resolve recipient's identity to get `/.well-known/ucp/identity/<address>`
- Extract `preferences` object (rendering, read_receipts, external_images, language)
- Cache for duration of session
- Re-fetch at start of next session

**Preference Impact on Composition:**
- `rendering: "blocks"` — omit `body.html` entirely (optimization + respect)
- `read_receipts: false` — do not send receipts (default)
- `external_images: false` — preserve external URLs but client won't load them
- `language: "en"` — hint for AI metadata generation (sender-supplied `meta.ai`)

## References

- **UCP Specification:** https://github.com/unifiedcommunicationsprotocol/spec
- **RFC 9420 (MLS):** https://datatracker.ietf.org/doc/html/rfc9420
- **RFC 9180 (HPKE):** https://datatracker.ietf.org/doc/html/rfc9180

---

*Last updated: 2026-06-27 — Synced with spec; critical gaps addressed*
