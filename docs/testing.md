# Testing

## Strategy

**Principle:** Test crypto, verification, and MLS independently; integration tests with mock server.

| Layer | Approach | Notes |
|-------|----------|-------|
| **Crypto** (Ed25519, MLS) | Unit tests | Use fixtures, not real keypairs |
| **Signing & Verification** | Unit + integration | Canonical JSON, real Ed25519 ops |
| **MLS Group State** | Unit tests | Tree operations, epoch advancement |
| **Message Handling** | Integration tests | Send → decrypt → verify full flow |
| **DNS Resolution** | Mock | Stub DNS lookups for determinism |
| **WebSocket** | Integration tests | Mock server echo, reconnect backoff |
| **IndexedDB** | Unit tests | Fake IDB or in-memory store |

## Tools

| Layer | Tool | Notes |
|-------|------|-------|
| **Unit & Integration** | Bun test runner | Built-in; no Jest needed |
| **Crypto** | tweetnacl.js / libsodium.js fixtures | Real Ed25519, not mocks |
| **MLS** | mlspp test vectors or pure-JS fixtures | RFC 9420 compliance |
| **Mock Server** | Local HTTP + WebSocket server | Deterministic test environment |
| **Coverage** | Bun coverage | 80% threshold target |

## Running Tests

```bash
# all tests
bun test

# watch mode
bun test --watch

# specific file
bun test src/lib/crypto/signing.test.ts

# with coverage
bun test --coverage
```

## Test Structure

```
src/
├── lib/
│   ├── crypto/
│   │   ├── signing.ts
│   │   ├── signing.test.ts          # Ed25519 signing/verification
│   │   ├── mls.ts
│   │   ├── mls.test.ts              # Tree ops, encryption, proposals
│   │   └── fixtures/                # Test vectors (RFC 9420, keys)
│   ├── api.ts
│   ├── api.test.ts                  # API client, envelope handling
│   ├── identity.ts
│   ├── identity.test.ts             # DNS resolution, verification
│   └── storage.ts
│       └── storage.test.ts          # IndexedDB operations
└── mock-server.ts                   # Test HTTP + WebSocket server
```

## Conventions

- **Test files co-located:** `foo.ts` → `foo.test.ts`
- **Table-driven tests:** Use arrays of `{ input, expected, description }`
- **Fixtures over mocks:** Use real crypto libraries, not stubs
- **Deterministic:** All random values injected (no `Math.random()`)
- **No flakes:** All async tests have explicit timeouts

## What Must Always Be Tested

### Critical Path (100% coverage required)
- ✅ **Signing:** Canonical JSON serialization → Ed25519 → signature verification
- ✅ **Verification (3-phase):** Envelope → MLS decryption → inner signature
- ✅ **MLS operations:** CreateGroup → Add → Commit → Decrypt
- ✅ **Identity resolution:** DNS SRV → server fetch → credential binding
- ✅ **Challenge-response:** Issue challenge → sign → redeem → session
- ✅ **BCC isolation:** Separate groups, visibility constraints

### High Priority (>90% coverage)
- ✅ Message ordering: client_ts primary, server_ts tiebreaker
- ✅ Signing key rotation: 60-day cycle, 48-hour grace period
- ✅ Reconnection: exponential backoff, state recovery
- ✅ Offline queueing: persist drafts, retry on reconnect
- ✅ Block preservation: unknown blocks/marks forward-compatible
- ✅ Stale epoch handling: request group refresh from server

### Medium Priority (>75% coverage)
- Typing indicators
- Read receipts (optional)
- Attachment encryption/upload
- Edit & delete propagation
- Draft management

## Test Fixtures

### RFC 9420 Test Vectors
```
fixtures/mls/
├── tree-ops.json        # Tree add/remove operations
├── encryption.json      # Epoch key encryption fixtures
├── proposals.json       # Proposal reference hashing
└── welcome.json         # Welcome message parsing
```

### Ed25519 Signing Fixtures
```
fixtures/crypto/
├── messages.json        # Canonical JSON test cases
├── signatures.json      # Known good signatures
└── identities.json      # Identity key bindings
```

### Server Responses
```
fixtures/server/
├── challenge.json       # Challenge responses
├── keypackages.json     # KeyPackage listings
├── identity.json        # Identity endpoint responses
└── envelope-ack.json    # Message ACKs
```

## Mock Server

Provides deterministic WebSocket server for testing:

```typescript
import { startMockServer } from './mock-server'

const server = startMockServer()
await server.waitForConnection()
// Client connects, sends messages, etc.
server.send({ type: 'message', ... })
```

Features:
- ✅ Accepts envelopes, assigns server_ts
- ✅ Echoes messages back (simulates broadcast)
- ✅ Supports reconnection testing
- ✅ Logs all traffic for debugging

## Example: Signing Verification Test

```typescript
import { test, expect } from "bun:test"
import * as nacl from "tweetnacl"
import { signMessage, verifySignature } from "./signing"

const tests = [
  {
    name: "sign and verify happy path",
    message: { id: "msg_123", from: "alice@example.com", body: "hello" },
    expectedPass: true,
  },
  {
    name: "reject modified message",
    message: { id: "msg_123", from: "alice@example.com", body: "hello" },
    tamper: (msg) => (msg.body = "goodbye"),
    expectedPass: false,
  },
  {
    name: "canonical JSON: sorted keys",
    message: { z: 1, a: 2, m: 3 },
    expectedJSONKeys: ["a", "m", "z"],
    expectedPass: true,
  },
]

for (const tc of tests) {
  test(tc.name, () => {
    const keypair = nacl.sign.keyPair()
    const msg = { ...tc.message }
    if (tc.tamper) tc.tamper(msg)

    const signature = signMessage(msg, keypair.secretKey)
    const verified = verifySignature(msg, signature, keypair.publicKey)

    expect(verified).toBe(tc.expectedPass)
    if (tc.expectedJSONKeys) {
      expect(Object.keys(JSON.parse(JSON.stringify(msg)))).toEqual(tc.expectedJSONKeys)
    }
  })
}
```

## References

- **UCP Specification:** https://github.com/unifiedcommunicationsprotocol/spec
- **RFC 9420 (MLS):** https://datatracker.ietf.org/doc/html/rfc9420
- **Bun Test:** https://bun.sh/docs/cli/test

---

*Last updated: 2026-06-27*
