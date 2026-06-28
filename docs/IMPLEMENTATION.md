# UCP Client Implementation Guide

> A reference implementation of the Unified Communications Protocol (UCP) client in TypeScript + Bun.

## Status

🚀 **v1.0 Frontend Complete: All 8 Phases + 100% Tailwind + SVG Icons** 🎉

**MAJOR MILESTONES:**
- ✅ All 44 components converted to Tailwind CSS (100% coverage, 0 inline styles)
- ✅ All emojis replaced with SVG icons from Icon component (20+ icons, 100% coverage)

**Phase 1: Layout Shell & Navigation (✅ Complete)**
- ✅ 3-column layout: LeftNav (52px) + Secondary (280px) + Main (flex:1)
- ✅ Navigation system: All 6 sections (Inbox, Messages, Calendar, Contacts, Notes, Agents)
- ✅ Design system: Dark/light mode, CSS variables, Tailwind v4
- ✅ Global state management: 60+ fields via AppContext + useReducer
- ✅ User menu: Avatar, theme toggle, settings link

**Phase 2: Inbox View (✅ Complete)**
- ✅ InboxThreadList: Thread list with compact/spacious variants, search, compose button, badges
- ✅ ThreadDetail: Selected thread display, message cards, E2E lock indicators
- ✅ ComposeArea: Inline reply/forward with CC/BCC toggles, auto-expanding textarea
- ✅ FileUploadModal: Drag & drop file upload with file preview
- ✅ State management: selectedThread, replyOpen, replyText, customThreadMsgs, etc.

**Phase 3: Messaging View (✅ Complete)**
- ✅ ChannelList: Secondary panel with channels + DMs, selected state styling
- ✅ MessageThread: Main content with message cards, E2E badges, sender grouping
- ✅ ComposeBar: Bottom compose widget with auto-resize, Enter-sends behavior
- ✅ Real-time messaging structure (ready for WebSocket integration)

**Phase 4: Notes with ProseMirror (✅ Complete)**
- ✅ NoteEditor: Rich text editor with 8 toolbar buttons (B/I/`/H1/H2/quote/list)
- ✅ ProseMirror integration: Full schema, history, input rules, keymap
- ✅ Auto-save on keystroke to AppContext
- ✅ Undo/redo support (Ctrl+Z / Ctrl+Shift+Z)
- ✅ 40+ lines of ProseMirror CSS styling
- ✅ SVG icons for editor toolbar (all emojis replaced)

**Phase 5: Calendar View (✅ Complete)**
- ✅ CalendarWeek: Time grid (24 rows × 56px height), sticky headers, event cards
- ✅ CalendarMonth: Month grid (6 rows × 7 cols), event chips, overflow indicators
- ✅ CalendarView: Header with Week/Month toggle, date navigation, + New event button
- ✅ Event positioning and rendering

**Phase 6: Contacts & Agents (✅ Complete)**
- ✅ ContactDetail: Updated to 48px avatar, 18px 700 name per design spec
- ✅ AgentsView: Full agent grid with cards, status indicators, activity log
- ✅ Agent dashboard with color-coded status dots

**Phase 7: Settings (✅ Complete)**
- ✅ SettingsView: Main container with 220px sidebar + centered content
- ✅ SettingsSidebar: 3 category sections (General, Privacy & Security, Integrations)
- ✅ AppearanceSettings: Theme toggle (Light/Dark) + thread density (Compact/Spacious)
- ✅ IdentitySettings: UCP address display + display name input + active keyset card
- ✅ KeysSettings: Keyset cards with fingerprints, status indicators, action buttons ⭐
- ✅ EmailBridgeSettings: Provider cards (Gmail, Fastmail, Other) with connect buttons

**Phase 8: Onboarding Modal (✅ Complete)**
- ✅ Onboarding: Full-screen 3-step modal (overlay + fade-up animation)
- ✅ Step 1: Cryptographic Identity — Ed25519 keypair generation readiness
- ✅ Step 2: Claim Address — relay.im or custom domain options
- ✅ Step 3: Connect Email — 3 provider buttons (Gmail, Fastmail, Other)
- ✅ Integration: Wired in App.tsx, blocks auth until complete

**Icon System (✅ Complete)**
- ✅ Icon.tsx component with 20+ SVG icons
- ✅ Dynamic sizing support (size parameter)
- ✅ CSS variable theming (currentColor)
- ✅ Email providers: Gmail, Fastmail, IMAP, Google, CalDAV, CardDAV
- ✅ Actions: paperclip, send, email, lock, unlock
- ✅ Status: check, close, dot (nav indicators)
- ✅ Editor: bold, italic, code, h1, h2, quote, list
- ✅ Navigation: inbox, messages, calendar, contacts, notes, agents, settings
- ✅ Theme: moon, sun
- ✅ All 16 emoji-using components converted (100% coverage)

**Overall Statistics**
- ✅ 44 components built
- ✅ ~4200+ lines of frontend code (including Icon system)
- ✅ 100% TypeScript strict mode
- ✅ Biome linting clean
- ✅ All 8 design handoff phases matched 1:1
- ✅ 100% Tailwind CSS conversion
- ✅ 100% emoji-to-icon replacement

**Next: API Integration & Cryptography**
- [ ] Crypto layer: Ed25519 signing + MLS groups (`src/lib/crypto/signing.ts`)
- [ ] Database layer: Drizzle + PostgreSQL (local message storage)
- [ ] WebSocket connection to UCP server (`src/lib/transport.ts`)
- [ ] OAuth flows (Gmail, Fastmail)
- [ ] DNS record verification
- [ ] Message signing/verification flow
- [ ] MLS group management (RFC 9420)

## Core Responsibilities

The UCP client is **cryptographically responsible** for:

1. **Key Management**
   - Generate identity key (Ed25519) at signup — stored offline/encrypted
   - Generate signing key (Ed25519) for authentication — stored on device
   - Rotate signing key every 60 days with grace period
   - Publish DNS records for identity resolution (`_ucp`, `_ucp-sign`)

2. **Message Signing & Verification**
   - Sign all outbound messages with signing key
   - Verify all inbound messages against sender's signing key
   - Resolve sender's identity via DNS and server endpoints
   - Check signing key binding to identity key

3. **MLS Group Management (RFC 9420)**
   - Create groups for each thread
   - Fetch KeyPackages from recipients
   - Issue Add/Remove/Update proposals
   - Manage epoch advancement on membership changes
   - Encrypt messages with epoch-specific keys

4. **Attachment Encryption**
   - Encrypt file content to MLS group
   - Upload ciphertext to server `/content` endpoint
   - Store attachment metadata locally

5. **Connection Management**
   - Establish persistent WebSocket to server
   - Handle authentication (challenge-response with Ed25519)
   - Maintain 30-second keepalive pings
   - Reconnect with exponential backoff (1s → 60s)

## Architecture

```
┌────────────────────────────────────────────────┐
│          UCP Client (TypeScript/Bun)           │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │         UI / Application Layer            │ │
│  │  (Compose, thread list, settings, etc.)  │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │      Message & State Management           │ │
│  │  ├─ Thread store (IndexedDB)              │ │
│  │  ├─ Receipt tracking                      │ │
│  │  ├─ Editing/deletion                      │ │
│  │  └─ AI metadata (local only)              │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │       MLS & Encryption Layer              │ │
│  │  ├─ Group state management                │ │
│  │  ├─ Epoch encryption/decryption           │ │
│  │  ├─ Proposal bundling (Add/Remove/Update)│ │
│  │  └─ Welcome message handling              │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │     Signing & Verification Layer          │ │
│  │  ├─ Ed25519 message signing               │ │
│  │  ├─ Signature verification                │ │
│  │  ├─ Identity resolution (DNS)             │ │
│  │  └─ Key rotation automation               │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │        API Client & Transport             │ │
│  │  ├─ WebSocket connection                  │ │
│  │  ├─ Challenge-response auth               │ │
│  │  ├─ Message envelope handling             │ │
│  │  └─ Content upload/download               │ │
│  └────────────┬─────────────────────────────┘ │
│               │                               │
│  ┌────────────▼─────────────────────────────┐ │
│  │    Server (UCP) ← HTTPS/WebSocket         │ │
│  │                                           │ │
│  │  [Relay encrypted blobs, serve keys,     │ │
│  │   route federation, verify signatures]   │ │
│  └─────────────────────────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘
```

## Implementation Phases

### Phase 0: UI & Design ✅ **COMPLETE**

#### UI Implementation ✅ **COMPLETE**
- [x] Relay client design (3-column layout)
- [x] Onboarding modal (3-step identity generation → address → email bridge)
- [x] Thread list with unread indicators
- [x] Message viewer + composer (fully interactive)
- [x] Navigation (Inbox, Messaging, Calendar, Contacts, Notes, Agents, Settings)
- [x] Design system (Space Grotesk/Mono, semantic colors, dark/light theme)
- [x] All 10 settings pages (Appearance, Notifications, Identity, Keys, Bridges)
- [x] Calendar (week/month views)
- [x] Contacts & Agents views
- [x] Notes with ProseMirror rich editor

#### Styling & Polish ✅ **COMPLETE**
- [x] 100% Tailwind CSS conversion (44/44 components)
- [x] 100% emoji-to-SVG icon replacement (16/16 components)
- [x] Icon.tsx component (20+ reusable SVG icons)
- [x] CSS variables for theming (dark/light mode)
- [x] Responsive design (sm:, md:, lg: breakpoints)

#### Code Quality ✅ **COMPLETE**
- [x] TypeScript 7 strict mode (0 errors)
- [x] Biome linting + formatting (strict rules)
- [x] Hono server + React on same port
- [x] `bun run check/lint/format/typecheck` scripts

### Phase 1: API & Authentication — **READY FOR START**

#### Authentication & Connection
- [ ] WebSocket connection establishment (try WebTransport first, fallback to WebSocket)
- [ ] `UCPHello` handshake: send `{ version, auth_token, capabilities }`
- [ ] Receive `UCPHelloAck`: verify `server_sig` against `_ucp-server` DNS key
- [ ] Challenge-response authentication: single-use 32-byte challenge, 60-second expiry
- [ ] WebSocket keepalive: 30-second pings, 10-second pong timeout
- [ ] Exponential backoff reconnect: 1s → 60s with ±20% jitter

#### Cryptography Basics
- [ ] Ed25519 key generation (`tweetnacl.js` or `libsodium.js`)
- [ ] Message signing: canonical JSON (sorted keys, UTF-8, no whitespace)
- [ ] Message verification: check signature before payload processing

#### Identity & Key Resolution
- [ ] DNS SRV/TXT lookups: `_ucp-srv`, `_ucp-sign`, `_ucp-revoke`, `_ucp-server`
- [ ] Fetch `/.well-known/ucp/identity/<address>` for current key state
- [ ] Verify signing key binding to identity key via identity_sig

#### Message Envelope Serialization
- [ ] Build `UCPEnvelope` handling
- [ ] Parse/serialize inbound/outbound envelopes

### Phase 2: Encryption & MLS
- [ ] MLS group creation (RFC 9420)
- [ ] KeyPackage fetching + storage
- [ ] Message encryption/decryption
- [ ] Epoch advancement on membership changes
- [ ] Proposal bundling (Add/Remove/Update)
- [ ] Welcome message handling
- [ ] Integration with message send/receive

### Phase 3: Database & Storage
- [ ] Drizzle ORM setup + PostgreSQL schema
- [ ] Thread storage (local cache of server state)
- [ ] Message storage + indexing
- [ ] Key storage (signing key, identity key backup)
- [ ] Attachment metadata storage
- [ ] IndexedDB for browser-local state

### Phase 4: Real-time Messaging
- [ ] Thread list + message display (live updates)
- [ ] Compose flow (recipient picker, MLS add-member)
- [ ] Real-time sync (WebSocket subscription)
- [ ] Read receipts (optional)
- [ ] Editing/deletion flows
- [ ] Attachment upload/download

### Phase 5: Bridge Integration
- [ ] OAuth flows (Gmail, Fastmail)
- [ ] IMAP email import
- [ ] CalDAV calendar sync
- [ ] CardDAV contacts sync
- [ ] Bridge message wrapping & attestation
- [ ] External source labeling

### Phase 6: Polish & Optimization
- [ ] AI metadata (local summaries, categories)
- [ ] BCC support (separate MLS groups)
- [ ] Contact management
- [ ] Search (local only, no embeddings to server)
- [ ] Multi-device sync
- [ ] Offline support (message queueing)
- [ ] Performance optimization

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Runtime** | Bun 1.0+ | Fast TypeScript/JavaScript |
| **Language** | TypeScript | Type safety, strict mode |
| **Build** | Bun build | No webpack/rollup needed |
| **Crypto (Signing)** | tweetnacl.js or libsodium.js | Ed25519 signing |
| **Crypto (MLS)** | mlspp (via FFI) or pure-JS impl | RFC 9420 required |
| **Storage** | IndexedDB | Message & thread state |
| **DNS** | Node.js dns module or browser DNS API | Identity resolution |
| **HTTP/WS** | Fetch API + WebSocket API | Standard browser APIs |
| **Testing** | Bun test runner | Table-driven tests |

## Key Constraints

1. **No plaintext secrets on server** — identity key never sent to server
2. **MLS required** — all messages encrypted to group, server cannot decrypt
3. **Ed25519 signing mandatory** — every message signed, every sender verified
4. **Single-use challenges** — 60-second lifetime, one-time use only
5. **Signing key rotation** — automatic every 60 days, grace period 48 hours
6. **Forward compatibility** — unknown message blocks/marks must be preserved
7. **No local labels in 1.0** — labels are device-local, not synced
8. **No embeddings to server** — AI metadata stays local

## References

- **UCP Specification:** https://github.com/unifiedcommunicationsprotocol/spec
- **RFC 9420 (MLS):** https://datatracker.ietf.org/doc/html/rfc9420
- **RFC 9180 (HPKE):** https://datatracker.ietf.org/doc/html/rfc9180
- **Ed25519:** https://ed25519.cr.yp.to/

## Contributing

This is a reference implementation. Contributions welcome for:
- Core MLS group state machine
- Signing & verification logic
- UI/UX components
- Testing & coverage
- Documentation
