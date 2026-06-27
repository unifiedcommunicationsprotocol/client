# Deployment

## Targets

UCP Client runs on three platforms with shared TypeScript codebase:

1. **Web** — Single Page Application (Bun build → static HTML/JS)
2. **Desktop** — Electron or Tauri application (single binary)
3. **CLI** — Node.js/Bun command-line client (development/testing)

## Web Deployment

### Build

```bash
bun run build
# → dist/index.html + dist/app.js + dist/app.css
```

### Serve

```bash
# Development
bun run dev

# Production
bun --bun serve dist/
```

### CDN / Hosting

Deploy `dist/` folder to:
- Vercel / Netlify (simple, auto-HTTPS)
- AWS CloudFront + S3
- Cloudflare Pages
- Any static host

**HTTPS required** — browser Web Crypto API and WebSocket WSS only work over HTTPS.

### Environment Variables

```bash
# .env.production
API_URL=https://ucp.example.com   # UCP Server URL
ENVIRONMENT=production
```

## Desktop Deployment

### Electron Build

```bash
bun run build:electron
# → dist/ucp-client-1.0.0-x64-setup.exe
# → dist/ucp-client-1.0.0.dmg
# → dist/ucp-client-1.0.0.AppImage
```

### Tauri Build

```bash
bun run build:tauri
# → src-tauri/target/release/bundle/
```

### Code Signing

**macOS:**
```bash
export APPLE_ID=your@email.com
export APPLE_ID_PASSWORD=app-specific-password
bun run build:electron  # Auto-signs
```

**Windows:**
Obtain code signing certificate (DigiCert, Sectigo, etc.)
```bash
$env:WIN_CERT_FILE = "C:\path\to\cert.pfx"
$env:WIN_CERT_PASSWORD = "password"
bun run build:electron
```

### Auto-Update

Electron auto-updates check GitHub releases:
```bash
# Publish release with asset:
# ucp-client-1.0.1.exe
# latest.yml (metadata)
```

## CLI Deployment

For testing / headless use:

```bash
bun install
bun run ./cli.ts
```

## Configuration

All clients read from `.env`:

```bash
# Required
API_URL=https://ucp.example.com

# Optional
LOG_LEVEL=info                    # debug, info, warn, error
STORAGE_QUOTA_MB=500              # IndexedDB quota
KEEPALIVE_INTERVAL_MS=30000       # WebSocket ping interval
RECONNECT_MAX_DELAY_MS=60000      # Max backoff
```

## Security Checklist

- ✅ HTTPS only (WSS required, Web Crypto requires secure context)
- ✅ Content Security Policy (no `eval`, script from app origin only)
- ✅ CORS restricted to UCP server domains
- ✅ No sensitive data in localStorage (use IndexedDB + encryption)
- ✅ Signing keys encrypted at rest (Web Crypto API)
- ✅ Identity key never sent to server (backup offline only)
- ✅ No plaintext logging of messages or keys
- ✅ Code signed (desktop builds)

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| **Bundle Size** | <500 KB | Gzipped JS + CSS |
| **First Load** | <2s | On 3G, after cache warm |
| **Message Send** | <100 ms | MLS encrypt + sign + upload |
| **Message Receive** | <50 ms | Decrypt + verify + render |
| **MLS Group Ops** | <500 ms | Create, add member, commit |

## Monitoring

### Web

Sentry for error tracking:
```bash
export SENTRY_DSN="https://..."
# Auto-captured on build
```

### Desktop

Rollbar for app crashes (opt-in):
```bash
# User grants permission in Settings
```

### Metrics

- Message send success rate
- WebSocket connection stability
- Signature verification failures (possible compromise?)
- MLS decryption failures (stale epoch, group corruption)

## Rollback

### Web
1. Previous deployment in CDN history or GitHub release
2. Redeploy via CI/CD

### Desktop
1. GitHub release with `latest.yml` pointing to prior version
2. Users auto-update to latest non-broken release

---

*Last updated: 2026-06-27*
