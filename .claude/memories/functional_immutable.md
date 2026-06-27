---
name: functional_immutable
description: All code must be functional + immutable - const only, no classes, closures + HOFs
metadata:
  type: project
---

# Functional & Immutable Code Constraint

**Status:** Applied 2026-06-27 to all crypto + transport code

## The Rule

❌ **FORBIDDEN:**
- `let` or `var` (use `const` only)
- Classes (use functions + closures)
- Mutations (use spread `{...obj}`, structural copies)
- Imperative loops (use map/filter/reduce)
- Instance state/properties

✅ **REQUIRED:**
- `const` for all declarations
- Pure functions (same input → same output)
- Closures for state encapsulation
- Higher-order functions for configuration
- Immutable data structures
- Composition over imperative logic

## Why

- **Predictable:** Pure functions with no hidden state
- **Testable:** Same inputs always produce same outputs
- **Safe:** No accidental mutations across modules
- **Composable:** Functions chain together naturally
- **Parallelizable:** No shared mutable state

## Patterns

### ❌ OLD (Classes)
```typescript
class Transport {
  private ws: WebSocket;
  private challenge: string;
  
  async connect() {
    this.ws = new WebSocket(...);
    this.challenge = ...;
  }
}
```

### ✅ NEW (Closures)
```typescript
const createTransport = (config) => {
  let ws: WebSocket | null = null;
  let challenge: string | null = null;
  
  const connect = async () => {
    ws = new WebSocket(config.serverUrl);
    challenge = await getChallenge();
    return { ws, challenge };
  };
  
  return { connect, send, disconnect };
};
```

### ❌ OLD (Mutable state)
```typescript
let identityCache = new Map();
identityCache.set(address, identity);  // Mutation!
```

### ✅ NEW (Immutable)
```typescript
const cacheIdentity = (cache, address, identity) => ({
  ...cache,
  [address]: identity,
});

const newCache = cacheIdentity(cache, addr, id);
```

### ❌ OLD (Imperative loop)
```typescript
for (let i = 0; i < items.length; i++) {
  result.push(transform(items[i]));
}
```

### ✅ NEW (Functional)
```typescript
const result = items.map(transform);
```

## Files Refactored

- `src/lib/transport.ts` — Closure-based transport factory
- `src/lib/crypto/signing.ts` — Pure functions (already functional)
- `src/lib/crypto/identity.ts` — Pure functions + immutable cache
- `src/lib/crypto/mls.ts` — Phase 2 stubs (pure functions)
- `src/lib/useTransport.ts` — React hook (uses React's built-in immutability)

## Next Steps

When implementing new features:
1. No classes — use `const factory = (config) => ({ method, ...exports })`
2. No mutations — use spread operator for object updates
3. No let/var — use const everywhere
4. Pure functions — no side effects except at boundaries (I/O, React components)
5. Closures for state — configure functions at creation time

---

*Added: 2026-06-27 — All code converted to functional + immutable paradigm*
