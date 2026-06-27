---
name: phase1_crypto_complete
description: Phase 1 cryptography layer complete - WebSocket, Ed25519, identity resolution
metadata:
  type: project
---

# Phase 1 Cryptography Layer — Complete

**Status:** Core crypto + transport implemented (2026-06-27)
**Commits:** 671ca9f (Biome fixes), 69c877d (Crypto + Transport)

## What's Implemented

### WebSocket Transport (`src/lib/transport.ts`)
- `UCPTransport` class with full lifecycle management
- **Handshake:** Send UCPHello, receive UCPHelloAck with challenge
- **Authentication:** 60-second single-use challenge validation
- **Keepalive:** 30-second pings with ping/pong cycle
- **Reconnection:** 1s→60s exponential backoff with ±20% jitter
- **Events:** onOpen, onMessage, onError, onClose, onReconnect callbacks
- Methods: `connect()`, `send()`, `disconnect()`, `getChallenge()`, `isReady()`

### Ed25519 Signing (`src/lib/crypto/signing.ts`)
- **tweetnacl.js** lazy-loaded to avoid SSR bundling issues
- `generateKeyPair()` → {publicKey, secretKey} (base64)
- `generateSigningKey()` → KeyPair + createdAt/expiresAt (60-day expiration)
- `signMessage(msg, secretKey)` → signature (base64)
- `verifySignature(msg, sig, publicKey)` → boolean
- **Canonical JSON:** RFC 9420 spec (sorted keys, no whitespace, UTF-8)
- `generateThreadId()` → ULID-like timestamp + randomness
- `hashSha256()` → SHA-256 hash of string

### Identity Resolution (`src/lib/crypto/identity.ts`)
- `resolveIdentity(address)` → {address, signingPublicKey, signingKeyId, resolvedAt, expiresAt}
- **HTTP endpoint:** `/.well-known/ucp/identity/<address>` (HTTPS first, HTTP fallback)
- **Caching:** 1-hour TTL, check before fetching, in-memory Map
- `verifyMessageSigner(msg, sig, senderAddress)` → boolean (resolves sender, verifies)
- `clearIdentityCache()` → manual invalidation
- `getCachedIdentity()` → fetch from cache without HTTP
- `prefetchIdentities(addresses)` → batch cache warm-up
- **DNS stub:** `fetchIdentityFromDns()` throws "not yet implemented" (Phase 2)

### MLS Placeholder (`src/lib/crypto/mls.ts`)
- Stub functions for Phase 2:
  - `createGroup()`, `encryptMessage()`, `decryptMessage()`
  - `addMember()`, `removeMember()`, `getGroupState()`
  - `publishKeyPackage()`
- All throw "Phase 2" errors with clear messaging

### React Integration (`src/lib/useTransport.ts`)
- `useTransport(config)` hook managing full transport lifecycle
- **State:** isConnected, isConnecting, error, reconnectAttempt, lastMessage
- **Methods:** send(msg), disconnect()
- Auto-cleanup on unmount
- Lifecycle: config → connect (with error handling) → callbacks update state → disconnect

### Crypto Index (`src/lib/crypto/index.ts`)
- Central export for all crypto + identity + MLS + signing functions
- One-line imports: `import { generateKeyPair, signMessage, ... } from "@/lib/crypto"`

## Known Limitations & TODOs

1. **MLS Group Management** — Not implemented, Phase 2 placeholder
2. **DNS Resolution** — Stub, needs Node.js dns module or browser API
3. **Server Signature Verification** — Commented as "TODO", trusts WSS connection for now
4. **KeyPackage Storage** — Not persisted, needed for MLS
5. **Key Rotation Automation** — Signing key expiration tracked but not enforced

## How to Use

### Generate Keys
```typescript
import { generateSigningKey } from "@/lib/crypto";
const key = await generateSigningKey();
// {publicKey, secretKey, createdAt, expiresAt, revoked}
```

### Sign & Verify
```typescript
import { signMessage, verifySignature } from "@/lib/crypto";
const msg = { user: "alice@example.com", text: "hello" };
const sig = await signMessage(msg, secretKey);
const valid = await verifySignature(msg, sig, publicKey);
```

### Connect to Server
```typescript
import { useTransport } from "@/lib/useTransport";

const { isConnected, error, send, disconnect } = useTransport({
  serverUrl: "wss://ucp.example.com",
  authToken: "...",
  clientId: "browser-client",
});

// Send message when connected
if (isConnected) {
  send({ type: "message", text: "hello" });
}
```

### Resolve Identity
```typescript
import { resolveIdentity, verifyMessageSigner } from "@/lib/crypto";

// Get someone's signing key
const identity = await resolveIdentity("bob@example.com");
// {address, signingPublicKey, signingKeyId, resolvedAt, expiresAt}

// Verify they signed a message
const valid = await verifyMessageSigner(msg, sig, "bob@example.com");
```

## Next Steps

### Immediate (This Sprint)
1. **Wire transport into AppContext**
   - Add transportConfig state (serverUrl, authToken)
   - Hook useTransport when session starts
   - Dispatch actions on message/error/reconnect

2. **Implement onboarding crypto flow**
   - Step 1: generateSigningKey() + store in IndexedDB
   - Step 2: Display public key for DNS record setup
   - Step 3: Start transport with authToken

3. **Test with mock server**
   - Create mock WebSocket server in test suite
   - Verify handshake, challenge, keepalive cycles

### Phase 2 (Next Sprint)
1. **MLS group management** (RFC 9420)
2. **KeyPackage publication & fetching**
3. **Message encryption/decryption**
4. **IndexedDB storage** for keys, threads, groups

### Phase 3+
1. **DNS fallback** for identity resolution
2. **Server signature verification** with Ed25519
3. **Key rotation automation**
4. **BCC groups** (separate MLS per recipient)

## Files & Commits

### Phase 1 Crypto Implementation (Complete)
- **Commits:**
  - 671ca9f: Biome auto-fix formatting (23 files)
  - 69c877d: WebSocket transport + Ed25519 signing + identity resolution
  - 5475b34: tweetnacl.js Buffer-based encoding (all crypto tested ✅)
  - d8deb21: Refactor to functional + immutable (const only, no classes)
  - 7b991cf: AppContext integration + OnboardingCrypto component
  - 9326be8: Mock server + round-trip tests (5/5 pass ✅)

### Files Changed
- **New:** transport.ts, signing.ts, identity.ts, mls.ts, useTransport.ts, crypto/index.ts
- **Refactored:** All crypto to functional (closures, no mutations, pure functions)
- **AppContext:** Added transport state + actions, signing key state
- **Onboarding:** New OnboardingCrypto.tsx component (Step 1: key generation)
- **Testing:** mockServer.ts, __tests__/roundtrip.test.ts
- **Dependencies:** tweetnacl@1.0.3 (Ed25519)
- **Constraints:** Added functional programming rules (docs + memory)

### Test Results
```
✅ Key generation: Ed25519 keypair (44-char public, 88-char secret)
✅ Message signing: Canonical JSON with tweetnacl.js
✅ Signature verification: Pass/fail detection working
✅ Canonical JSON: {a:1,b:2} ≡ {b:2,a:1} → same signature
✅ Server handshake: UCPHello/UCPHelloAck with challenge
✅ Full round-trip: Key gen → sign → verify → handshake
```

---

## Next Steps (In Progress)

### Immediate (Sprint 1)
1. ✅ Implement Ed25519 signing/verification
2. ✅ Implement WebSocket transport with handshake
3. ✅ Implement identity resolution (with HTTP fallback stub)
4. ✅ Wire transport into AppContext
5. ✅ Implement onboarding Step 1 (key generation)
6. ✅ Create mock server for testing
7. ✅ Test full round-trip

### Next (Sprint 1 Continuation)
1. **Integrate OnboardingCrypto into main onboarding flow**
   - Replace mock key generation in Onboarding.tsx
   - Wire Step 1 → Step 2 transition

2. **Implement Onboarding Step 2: Claim address**
   - relay.im address claiming
   - BYOD (bring your own domain) mode

3. **Implement Onboarding Step 3: Connect transport**
   - Generate auth token from signing key + challenge
   - Connect to real/mock UCP server
   - Display connection status

4. **Create integration test**
   - Client generates key → claims address → connects → sends message
   - Mock server verifies message signature
   - Client receives response

### Phase 2 (Next Sprint)
1. MLS group management (RFC 9420)
2. IndexedDB storage (keys, threads, groups)
3. Message encryption/decryption

---

*Updated: 2026-06-27 — Phase 1 crypto complete, AppContext integrated, Round-trip tested ✅*
