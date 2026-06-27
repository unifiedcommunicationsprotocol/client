---
name: relay_frontend_v1
description: Relay client desktop UI (v1.0) — Bun full-stack executable with React frontend from Claude Design
metadata:
  type: project
---

## Relay Client v1.0 Frontend Implementation

**Status:** Frontend UI complete, infrastructure ready, crypto/DB layer pending

### What We Built

**Desktop Application (Bun Full-Stack Executable)**
- Single binary: Hono server + React frontend on same port (default 3000)
- Target: Desktop (Electron/Tauri), CLI via Bun, future web via browser

**Relay UI Design** (imported from Claude Design project `b1269346-a37e-43af-89d2-76529faacf9d`)
- **Onboarding Modal:** 3-step flow
  - Step 1: Generate Ed25519 keypairs (identity key + signing key)
  - Step 2: Claim address (relay.im or BYOD)
  - Step 3: Connect existing email (Gmail/Fastmail bridge)
- **Main App:** 3-column layout
  - Left: Icon nav (Inbox, Messaging, Calendar, Contacts, Notes, Agents, Settings)
  - Center: Dynamic sidebar (section items + thread list with unread badges)
  - Right: Main content (inbox/messaging view, or settings)
- **Inbox View:** Thread list → message viewer → composer
  - Threads show sender avatar, preview, timestamp, unread count
  - Messages display with sender name, timestamp, content
  - Compose area with draft/send buttons

**Design System**
- Fonts: Space Grotesk (UI, weights 300-700), Space Mono (crypto keys)
- Colors: Semantic palette via CSS variables
  - Primary accent: #6366F1 (indigo)
  - Success: #22C55E (green)
  - Danger: #EF4444 (red)
  - Text: 3-level hierarchy (t1/t2/t3)
  - Surfaces: bg/sf/sf2 with borders
- Theme: Light/dark mode via `prefers-color-scheme` media query
- Animations: fadeUp, fadeIn, smooth transitions

**Developer Experience**
- Biome 2.5.1: Strict linting + formatting
  - Rules: recommended preset + strict accessibility
  - Scripts: `bun run lint/format/check` (all with --write)
  - Config: biome.json with VCS git integration
- TypeScript 7 preview: `@typescript/native-preview@7.0.0-dev`
  - Replaced regular typescript (preview only)
  - Type checking: `bun run typecheck` (passes, strict mode)
- Build: Updated build.ts for Bun full-stack executable

### File Structure

```
src/
├── index.server.ts              # Hono server + frontend fallback
├── index.client.tsx             # React entry point
└── client/
    ├── App.tsx                  # Root (onboarding vs main app)
    ├── index.css                # Design system CSS
    ├── APITester.tsx            # Stub (can be removed)
    └── components/
        ├── Onboarding.tsx       # 3-step modal
        ├── MainApp.tsx          # 3-column layout + nav
        ├── Sidebar.tsx          # Sidebar with thread list
        └── Inbox.tsx            # Thread + message view
```

### Known Issues to Fix

**Biome Violations (4 errors)**
- 3x `noLabelWithoutControl`: Labels in Onboarding.tsx need proper `htmlFor` associations
- 1x `noAssignInExpressions`: Assignment in frontend.tsx JSX needs refactoring

**Dev Server Issue**
- `bun run dev` fails: separate dev:api/dev:frontend scripts don't work for full-stack executable
- Solution: Need single dev script that runs Hono with HMR

### Next Steps

1. **Fix Biome violations** (4 errors) → pass strict checks
2. **Drizzle + SQLite:** Set up local storage schema (threads, messages, groups, keys)
3. **Crypto layer:** Ed25519 signing + MLS groups (tweetnacl.js)
4. **WebSocket:** Connect to UCP server (challenge-response auth)
5. **Full-stack build:** `bun run build` → single executable binary

### Dependencies

**Updated package.json**
- Removed: regular `typescript` (replaced by native-preview)
- Added: `@biomejs/biome@^2.5.1`
- Kept: `@typescript/native-preview@^7.0.0-dev.20260421.2`

**Scripts**
- `bun run check`: Biome lint + format + typecheck (all in one)
- `bun run lint`: Biome lint only
- `bun run format`: Biome format only
- `bun run typecheck`: TypeScript 7 type check
- `bun run dev`: Broken (needs fix)
- `bun run build`: Build executable
- `bun run start`: Run production binary

### Design Decisions

1. **Bun Full-Stack:** Single executable simplifies deployment vs Electron/Tauri complexity
2. **Space Grotesk/Mono:** Modern, readable, supports all required weights for UI and crypto display
3. **CSS Variables:** Dark/light theme support without component library overhead
4. **Inline Styles (React):** Component clarity over CSS-in-JS (avoids styled-components)
5. **Biome Strict:** Enforce accessibility, type safety, code quality from day 1
6. **TypeScript 7 Preview:** Native support, better type inference, no webpack overhead

---

*Updated: 2026-06-27 — v1.0 frontend UI complete, Biome + TypeScript 7 integrated*
