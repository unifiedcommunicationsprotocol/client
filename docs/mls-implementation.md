# MLS (RFC 9420) Client Implementation

> Building client-side MLS group management for encrypted threading.

## Strategy

Two options for client-side MLS:

1. **FFI to mlspp** — C++ library (proven, audited, well-tested)
2. **Pure JavaScript** — Full RFC 9420 implementation in TypeScript/JavaScript

Recommendation: **Start with FFI to mlspp** (faster shipping, less risk). Fallback to pure-JS if FFI unavailable.

## Architecture

```
src/lib/mls/
├── client.ts              # MLS client operations (high-level API)
├── group-manager.ts       # Group state tracking (per-thread)
├── types.ts              # TypeScript types for RFC 9420
├── bindings.ts           # FFI to mlspp (or pure-JS fallback)
├── serialization.ts      # TLS wire format encoding/decoding
├── fixtures/
│   ├── test-vectors.json # RFC 9420 official test vectors
│   └── keypackages.json  # Real keypackage fixtures
└── mls.test.ts           # Comprehensive test suite
```

## Client API

### Create Group (new thread)

```typescript
const group = await mls.createGroup({
  id: groupId,
  ciphersuite: 'MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519',
  members: [alice, bob],  // addresses
})
```

### Add Member

```typescript
// 1. Fetch KeyPackage from new member
const keypackage = await server.getKeyPackage(newMember)

// 2. Create Add proposal
const proposal = await group.proposeAdd(keypackage)

// 3. Commit (advances epoch)
const commit = await group.commit()

// 4. Package Welcome + first message for new member
const welcome = group.getWelcome()
return { welcome, commit }
```

### Send Message

```typescript
const plaintext = JSON.stringify(message)  // Canonical JSON
const ciphertext = await group.encrypt(plaintext)
// Send ciphertext to server
```

### Receive Message

```typescript
// After MLS decryption
const plaintext = await group.decrypt(ciphertext, sender)
const message = JSON.parse(plaintext)
```

## Implementation Phases

### Phase 1: Serialization (Week 1)
- [ ] TLS wire format encoder/decoder (RFC 9420 §2)
- [ ] Uint8/16/32/64 encoding
- [ ] Bytes & opaque arrays
- [ ] Test vectors from RFC

### Phase 2: Group Creation (Week 2)
- [ ] KeyPackage creation & signing
- [ ] Credential binding (identity + signing key)
- [ ] Group initialization (empty tree)
- [ ] Test: create, add first member

### Phase 3: Tree Operations (Week 3)
- [ ] Binary tree: add/remove/update leaves
- [ ] Tree hash computation (SHA-256)
- [ ] Parent/sibling resolution
- [ ] Test: tree operations, indexing

### Phase 4: Encryption (Week 4)
- [ ] AES-128-GCM per-epoch encryption/decryption
- [ ] HPKE key derivation (RFC 9180)
- [ ] Sender data encryption
- [ ] Test: encrypt/decrypt round-trip

### Phase 5: Proposals & Commits (Week 5)
- [ ] Add/Remove/Update proposals
- [ ] Proposal reference hashing
- [ ] Commit bundling & finalization
- [ ] Epoch advancement
- [ ] Test: full Add → Commit → encrypt cycle

## Key Decisions

### 1. Ciphersuite (Mandatory)
- `MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519` (UCP required)
- AES-128-GCM (not Chacha20)
- X25519 (not Curve25519)
- Ed25519 (not other signature schemes)

### 2. Group State Storage
- IndexedDB: serialize group state after each change
- In-memory: cache for fast encrypt/decrypt
- Load on app start, write on every commit

### 3. Welcome Delivery
- Client generates Welcome when adding member
- Server buffers Welcome until first message committed
- Atomic delivery: Welcome + message delivered together

### 4. Error Handling
- **Decryption fail:** Request group state refresh (stale epoch?)
- **Signature fail:** Reject message (verif failed in phase 3)
- **Invalid proposal:** Log, ignore (apply valid ones only)

## Testing

### Unit Tests
```typescript
// Canonical test format (from RFC 9420 appendix)
const tests = [
  {
    name: "Create group, add member, encrypt",
    keyPackage: /* RFC vector */,
    expectedGroupState: /* hash */,
  },
]

for (const tc of tests) {
  test(tc.name, async () => {
    const group = await mls.createGroup(...)
    // ...verify against RFC vector
  })
}
```

### Integration Tests
1. **Create thread** → group initialization
2. **Add recipient** → KeyPackage fetch → Add proposal → commit
3. **Send message** → encrypt with current epoch
4. **New member joins** → Welcome generation + first message
5. **Receive message** → decrypt with correct epoch

## Performance

| Operation | Target |
|-----------|--------|
| Create group | <50 ms |
| Add member | <200 ms (includes KeyPackage fetch) |
| Encrypt message | <10 ms |
| Decrypt message | <5 ms |
| Commit (epoch advance) | <100 ms |

## Fallbacks

If mlspp FFI unavailable:
1. Try pure-JS implementation (slower but functional)
2. If pure-JS unavailable: client shows "Encryption unavailable" (UX failure, don't ship)

## References

- **RFC 9420 (MLS):** https://datatracker.ietf.org/doc/html/rfc9420
- **RFC 9180 (HPKE):** https://datatracker.ietf.org/doc/html/rfc9180
- **mlspp:** https://github.com/mlswg/mlspp
- **UCP Spec:** https://github.com/unifiedcommunicationsprotocol/spec

---

*Last updated: 2026-06-27*
