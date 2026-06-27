# UCP Client

> TypeScript + Bun reference client for the Unified Communications Protocol

**Status:** v1.0 scaffolded, ready for implementation

## What's Here

A production-ready skeleton for building an encrypted messaging client using:
- **TypeScript** — Type-safe, modern development
- **Bun** — Fast JavaScript runtime with native bundler
- **UCP Protocol** — E2E encrypted messaging over WebSocket

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- UCP Server running on `:5150` (see `../server/`)

### Development

```bash
bun install
bun run dev
```

Client starts on `http://localhost:3000` and connects to the UCP server.

### Build

```bash
bun run build
```

Production bundle in `dist/`.

## Features (Scaffolded)

- ✅ API client stub (`src/lib/api.ts`)
- ✅ TypeScript setup with strict mode
- ✅ Bun test runner configured
- ✅ Env config ready
- ⏳ UI implementation (ready for your code)
- ⏳ MLS encryption client (ready for your code)
- ⏳ WebSocket sync (ready for your code)

## Architecture

```
User Interface
    ↓
[API Client] → HTTP/WebSocket → UCP Server
    ↓
[Crypto] → MLS encryption, Ed25519
    ↓
[Storage] → Browser IndexedDB (optional)
```

## Configuration

See `.env` for server connection:

```
API_URL=http://localhost:5150
```

Change to your server's URL in production.

## Implementation Guide

The client implements UCP in three layers:

1. **Transport** — HTTP + WebSocket (in `src/lib/api.ts`)
2. **Crypto** — MLS encryption, Ed25519 signing
3. **UI** — Components and state management

Start with authentication flow in `src/lib/api.ts`:

```typescript
// Request challenge
const challenge = await requestChallenge("user@example.com");

// Sign with Ed25519
const signature = signChallenge(challenge, privateKey);

// Redeem for session
const session = await redeemChallenge("user@example.com", signature);
```

## Testing

```bash
bun test
```

## Production

```bash
# Build
bun run build

# Serve (example with simple HTTP server)
bunx http-server dist/
```

## Documentation

- [UCP Spec](../spec/)
- [Server API](../server/docs/IMPLEMENTATION.md)
- [Architecture](../server/docs/architecture.md)

---

**Ready to implement. Add your UI, crypto, and persistence.**
