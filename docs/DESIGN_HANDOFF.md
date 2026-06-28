# Handoff: Relay Client

## Overview

Relay is a UCP (Unified Communications Protocol) messaging client with cryptographic identity. It unifies email, real-time messaging, calendar, contacts, and notes in a single app. Users are identified by Ed25519 keypairs anchored to DNS records — no passwords, no central authority.

## About the Design Files

The file `Relay Client.dc.html` in this bundle is a **high-fidelity design prototype** built in HTML. It shows intended look, layout, interactions, and flows with precision. It is **not** production code — do not ship it directly. Your task is to **recreate this UI in your target stack** (React 19 + Tailwind v4 recommended) using your codebase's established patterns, a proper backend, and real auth flows (better-auth.com is the intended auth library).

## Fidelity

**High-fidelity.** Colors, typography, spacing, border radii, shadows, and all interaction states are final. Recreate pixel-accurately. The prototype uses mock/static data — real implementations will fetch from API.

---

## Layout Shell

The app is a full-viewport (`100vh`) flex row with `overflow: hidden`.

```
┌──────┬────────────────┬──────────────────────────────────┐
│ Nav  │ Secondary      │ Main content                     │
│ 52px │ ~280px         │ flex: 1                          │
│      │ (conditional)  │                                  │
└──────┴────────────────┴──────────────────────────────────┘
```

### Left Navigation (`52px` wide, full height)
- Background: `--r-sf`, right border `--r-bd`
- Flex column, `justify-content: space-between`
- **Top section:** icon buttons for Inbox, Messaging, Calendar, Notes, Contacts, Agents
- **Bottom section:** Settings gear icon + User avatar button (opens dropdown menu)
- Each nav button: `40×40px`, `border-radius: 8px`, icon `16×16px`
- Active state: `background: var(--r-accd)`, icon `color: var(--r-acc)`
- Hover: `background: var(--r-hov)`
- User avatar: `32×32px` circle, initials "Y", `background: #4F46E5`, opens a dropdown

### User Avatar Dropdown
Position: `bottom: 60px, left: 8px`, `width: 200px`
- Header: display name "You" + handle `you@relay.im` (monospace)
- Row: Theme toggle (dark/light mode) with inline submenu
- Row: Settings → navigates to settings view
- Row: Sign out

### Secondary Panel (left of main content)
Shown for: Inbox, Messaging, Contacts, Notes. Hidden for Calendar, Agents, Settings, Identity.
Width: `280px`, `border-right: 1px solid var(--r-bd)`, full height, flex column.

---

## Views

### 1. Inbox (Email)

**Secondary panel — Thread list**
- Header: "Inbox" title + Compact/Spacious toggle + compose button (`28×28px`, accent bg)
- Thread rows (2 variants):

**Compact (Variant A):**
- Padding: `9px 12px`, gap `10px`
- Avatar: `28×28px` circle, initials, colored bg
- From (12.5px, 600 if unread), subject (12.5px, 500), preview (11.5px, truncated 1 line)
- Time top-right, unread dot (`6×6px`, accent color)
- Left border: `2px solid` — transparent (native), amber `#D97706` (bridge), purple `#8B5CF6` (agent)

**Spacious (Variant B):**
- Padding: `14px 12px`, avatar `36×36px`
- Preview: 2-line clamp
- Category pill + Bridge/Agent labels always visible below preview

Thread row selected state: `background: var(--r-sel)`

**Main content — Thread detail**
- Header: subject (16px, 700), from address (monospace, 12px, `--r-t3`)
- Category pill (10px, 600, colored bg/text per category)
- Bridge badge: amber pill "Bridged via Gmail/Fastmail"
- Agent badge: purple pill "Agent action"
- Messages: vertical stack, each message in a card (`background: var(--r-sf)`, `border: 1px solid var(--r-bd)`, `border-radius: 8px`, `padding: 16px 18px`)
  - Avatar `32×32px` + sender name (13px, 600) + handle (11px monospace) + time
  - E2E lock icon (green `#22C55E`) or open lock (amber, bridge messages)
  - Body paragraphs (14px, line-height 1.7)
  - Attachments: pill chips with file icon, name, size
- Reply/Forward toolbar at bottom (Reply + Forward buttons)

**Reply/Forward compose area**
- Container: `border: 1px solid var(--r-bd)`, `border-radius: 8px`, `background: var(--r-sf2)`
- Header row: mode label (Reply/Forward) + To: field (forward mode) + CC/BCC toggle buttons + close ✕
- CC row (conditional): `padding: 6px 12px`, label + input
- BCC row (conditional): same
- Attachment preview chip (if file attached): filename + size + remove ✕
- Textarea: auto-expanding, `min-height: 80px`, no border, transparent bg, `padding: 12px`
- Forward: shows quoted original message below textarea with left-border quote style
- Footer: paperclip attach button + send button (`padding: 6px 18px`, accent bg)

**Compose modal** (new message)
- Centered overlay, `width: 560px`, `border-radius: 10px`
- To/CC/BCC/Subject fields, full textarea body

**File upload modal**
- Centered overlay, `width: 400px`
- Drag & drop zone with dashed border
- Or click to select — triggers hidden `<input type="file">`
- Shows selected file name + size, confirm button

---

### 2. Messaging

**Secondary panel — Channel/DM list**
- Section headers: "Channels" / "Direct messages" (10px, 600, uppercase, `--r-t3`)
- Channel rows: `# general` with unread count badge, `padding: 7px 8px`, `border-radius: 6px`
- DM rows: avatar `24×24px` circle + name + online indicator dot
- Active: `background: var(--r-sel)`, text `--r-t1`

**Main content — Message thread**
- Header: channel name (14px, 600) + handle for DMs (11.5px monospace)
- E2E badge: green lock + "End-to-end encrypted" for native channels
- Messages: grouped by sender, avatar `28×28px`, name (12px, 600), time (11px)
- Message text: 13.5px, line-height 1.6
- Attachments shown as file chips inline
- Compose bar at bottom: paperclip icon + auto-resize textarea + send button
  - Paperclip opens file upload modal
  - Enter sends (Shift+Enter newline)
  - Send button: `28×28px`, accent bg, arrow icon

---

### 3. Calendar

**Header bar:**
- Week/Month toggle buttons (segmented control)
- "Today" button
- `<` / `>` week/month navigation
- Current date range label (13px, 500)
- "+ New event" button

**Week view:**
- 7-column grid with time gutter (52px wide) on left
- Day headers: Mon–Sun, date number
- Today column: accent color header, accent left-border on time column
- Hourly grid lines (24 rows visible with overflow-y scroll)
- Events: absolutely positioned colored cards with title + time, `border-radius: 5px`
- Event click → detail popover (title, time, description, attendees, edit/delete)

**Month view:**
- 7-column grid, day cells with date number
- Event dots/chips per day
- Today: accent circle on date number

---

### 4. Notes

**Secondary panel — Note list**
- Header: "Notes" + `+` new note button (`26×26px`, accent dimmed bg)
- Note rows: `padding: 8px 10px`, `border-radius: 6px`
  - Pin icon (accent) for pinned notes
  - Title (13px, 500, `--r-t1`) + updated label (11px, `--r-t3`)
  - Preview text (11.5px, 2-line clamp, `--r-t3`)
- Selected: `background: var(--r-sel)`

**Main content — Note editor**
- Title input: `font-size: 22px`, `font-weight: 700`, `letter-spacing: -0.03em`, no border, transparent bg, `padding: 24px 40px 0`
- Metadata row: updated time + tags (`padding: 0 40px 14px`)
- **ProseMirror rich text editor** mounted below (prosemirror-markdown, prosemirror-schema-basic, prosemirror-schema-list)
  - Toolbar (shown above editor, always visible): B / I / ` / H1 / H2 / ❝ / •
  - Toolbar buttons: `28×26px`, `border-radius: 5px`, active state `background: var(--r-accd)`, `color: var(--r-acc)`
  - Floating selection toolbar: appears on text selection, dark pill (`background: #18181f`, `border-radius: 8px`)
  - Markdown input rules: `# ` → H1, `## ` → H2, `> ` → blockquote, `- ` → bullet list, `1. ` → ordered list

**ProseMirror styles (apply globally):**
```css
.ProseMirror p          { margin-bottom: 10px; line-height: 1.75; }
.ProseMirror h1         { font-size: 22px; font-weight: 700; letter-spacing: -0.03em; margin: 22px 0 8px; line-height: 1.25; }
.ProseMirror h2         { font-size: 17px; font-weight: 600; letter-spacing: -0.02em; margin: 18px 0 6px; line-height: 1.3; }
.ProseMirror h3         { font-size: 14px; font-weight: 600; margin: 14px 0 5px; }
.ProseMirror blockquote { border-left: 3px solid accent; margin: 14px 0; padding: 4px 0 4px 16px; font-style: italic; }
.ProseMirror code       { background: surface2; border: 1px solid border; border-radius: 4px; padding: 1px 5px; font-family: monospace; font-size: 12px; color: accent; }
.ProseMirror pre        { background: surface2; border: 1px solid border; border-radius: 7px; padding: 14px 16px; overflow-x: auto; margin: 14px 0; }
.ProseMirror ul         { padding-left: 22px; list-style: disc; margin: 8px 0; }
.ProseMirror ol         { padding-left: 22px; list-style: decimal; margin: 8px 0; }
.ProseMirror li         { margin-bottom: 4px; line-height: 1.7; }
```
Content stored and loaded as Markdown (prosemirror-markdown serializer/parser).

---

### 5. Contacts

**Secondary panel:** contact list with avatar, name, handle, category pill
**Main content:** contact detail — avatar (48px), name (18px, 700), handle (monospace), UCP verified badge, sections for email/phone/notes

---

### 6. Agents

Full-page view (no secondary panel):
- Agent cards in a grid: name, description, last run time, status badge, enable/disable toggle
- Activity log: timestamped list of agent actions with green dot indicators

---

### 7. Settings

Two-column layout: settings sidebar (220px) + content area (flex:1, `overflow-y: auto`, `padding: 36px 44px`, `max-width: 640px`).

**Settings sidebar sections:**

**General**
- Appearance
- Notifications
- Preferences

**Privacy**
- Identity
- Keys
- Read receipts

**Bridges**
- Email bridge
- Calendar bridge
- Contacts (CardDAV)

**Messaging**
- Images

Each sidebar item: `padding: 6px 8px`, `border-radius: 5px`, `font-size: 13px`
Active: `background: var(--r-sel)`, `color: var(--r-t1)`, `font-weight: 500`

#### Appearance settings
- **Theme:** Light / Dark radio toggle (segmented)
- **Thread list density:** Compact / Spacious toggle (affects thread row height, avatar size, preview lines)
- **Message rendering:** Blocks / Compact

#### Notifications settings
- Sound: toggle
- Badge: toggle

#### Identity page
- UCP address display: `you@relay.im` in a card
- Avatar upload
- Display name field
- **Active keyset selector card:** shows active keyset name, identity key fingerprint, signing key fingerprint + expiry, "Manage keys →" link
- Inactive keysets listed below with "Use this →" to switch

#### Keys page
- Header: "Keys" + "New keyset" button (accent, top-right)
- Keyset list: cards per keyset showing name, active dot (green/gray), identity/signing/revocation key fingerprints, created date
  - Active keyset: `border: 1px solid rgba(99,102,241,0.4)`, accent tint bg
  - Actions: "Use this keyset" (accent, only on inactive), "Rotate signing key", "Delete"
  - Rename: inline input on "Rename" click (inactive keysets only)
- **Inline keygen ceremony** (4 steps, replaces button when active):
  1. **Spinner:** "Generating Ed25519 keypairs… nothing leaves your browser"
  2. **Name + Review:** text input for keyset name; 3 key cards (identity, signing, revocation)
  3. **Revocation key ceremony:** full private key shown, Copy + Download .txt buttons, "I've saved offline" checkbox gates Continue
  4. **DNS records:** 5 TXT records table (`_ucp`, `_ucp-sign`, `_ucp-revoke`, `_ucp-srv`, `_ucp-server`)
  5. **Done:** summary card with fingerprints
- **Empty state:** centered card with shield icon, "No keysets yet", generate CTA
- **Danger zone** (bottom, when keysets exist): "Revoke identity…" → opens revoke modal

**Revoke identity modal:**
- `width: 400px`, centered overlay
- Reason select (compromised / lost / rotation)
- Type `REVOKE` to confirm input (Space Mono)
- Confirm button: disabled/gray until text matches, turns red when valid

#### Email bridge settings
Supported providers: Gmail, Fastmail, IMAP/SMTP (generic)

For each provider card:
- Logo icon + name + description
- "Connect" button → OAuth modal (for Gmail/Fastmail) or IMAP credentials form

**OAuth modal** (`width: 380px`):
1. **Info screen:** provider logo, scopes list, E2E encryption notice, "Authorize with [Provider]" button
2. **Connecting spinner**
3. **Connected confirmation:** green check, email address, "Done"

**IMAP modal** (`width: 400px`):
- Fields: IMAP host, port, username, password, SMTP host, port
- "Test connection" → spinner → success/error

Connected providers show: email address, green "Connected" badge, "Disconnect" link

#### Calendar bridge settings
- Google Calendar, Apple Calendar (CalDAV), Outlook
- Same OAuth/credentials flow as email bridge
- Connected: shows account name + "Connected" + "Disconnect"

#### Contacts (CardDAV)
- iCloud Contacts, Google Contacts, custom CardDAV server
- Same connection flow

#### Read receipts
- Toggle: send read receipts / request read receipts

#### Images settings
- Toggle: auto-load remote images (default off for privacy)

---

### 8. Onboarding Modal (first-time only)

Full-screen overlay: `background: rgba(0,0,0,0.65)`, `backdrop-filter: blur(6px)`
Modal: `width: 480px`, `border-radius: 14px`, `padding: 36px 40px 32px`
Closeable at any time via ✕ button (top-right).

**Welcome screen:**
- Relay logo (indigo `#6366F1` rounded square, arrow icon)
- "Welcome to Relay" (26px, 700, tracking -0.03em)
- 3 feature cards: Cryptographic identity / Open protocol / Bridge existing email
- "Get started →" CTA + "I already have an account" text link

**Step 1 — Identity** (progress bar 1/3):
- Shows generated keypair (identity key, signing key, revocation key fingerprints)
- Input: UCP address (e.g. `yourname@yourdomain.com`)
- "Bring your own domain" flow:
  - Domain input field + "Verify records" button
  - DNS records table (5 TXT records) with animated verification states (checking → green ✓)
  - Continue unlocks after all records pass
- "Continue →" button

**Step 2 — Connect email** (progress bar 2/3):
- Gmail card + Fastmail card, each with "Connect…" button
- Clicking opens the OAuth flow inline (same as settings bridge)
- Can skip / connect later

**Step 3 — Ready:**
- Summary: address confirmed, connected accounts listed
- "Open Relay →" finishes onboarding

---

## Interactions & Behavior

### Navigation
- Left nav icon click → sets view, resets secondary panel scroll
- Clicking a thread in list → loads thread detail, marks as read
- Clicking a note → loads note in editor, initializes ProseMirror with markdown content
- Clicking a channel/DM → loads message thread

### Theme
- Dark/light toggle: switches CSS custom property values on `:root`
- Default: dark

### Email reply/forward
- Reply: pre-fills To from thread sender
- Forward: blank To field (user must type recipient)
- CC/BCC: toggle rows, each independent
- Textarea auto-expands (`scrollHeight` on input)
- Send: appends message to thread (`customThreadMsgs` state), clears compose area

### File attachments (email + messaging)
- Paperclip → file upload modal → file input → selected file shown as chip
- File chip shows: file icon, name, size, × remove
- Send includes attachment data

### Calendar
- Week navigation: `calWeekOffset` increments/decrements
- "Today": resets `calWeekOffset` to 0
- Event click: shows detail panel/popover
- "+ New event": opens create event modal

### Notes
- New note: prepends to list, auto-selects, focuses title input
- Title edits: stored in `noteEdits[index].title`
- Body edits: stored as Markdown in `noteEdits[index].body` via ProseMirror serializer
- Pinned notes: shown with pin icon at top of list

### Keygen ceremony
- All key generation happens in-browser via `crypto.getRandomValues()` (currently mocked — replace with actual Web Crypto API Ed25519 keygen)
- Private keys must never be transmitted
- Revocation key download: plaintext file with warning header
- DNS records: display only — user copies to their DNS provider

### Bridge OAuth
- "Connect" → modal opens
- "Authorize" → spinner (2s simulated) → success
- In production: redirect to better-auth OAuth flow, return token, store provider connection
- IMAP: "Test connection" → POST credentials to backend → success/error

### Settings sidebar navigation
- Each item sets `view` to `settings/{section}`
- Identity and Keys are special routes under Privacy

### Revoke modal
- Type `REVOKE` exactly to enable button
- On confirm: clears all keysets from state, terminates sessions (in production: broadcast revocation record to DNS + server)

### Density toggle (Compact/Spacious)
- Compact (A): smaller avatars, 1-line preview, no category pills in list
- Spacious (B): larger avatars, 2-line preview, category/bridge/agent pills always visible

---

## State Shape

```typescript
interface AppState {
  // Navigation
  view: 'inbox' | 'messaging' | 'calendar' | 'notes' | 'contacts' | 'agents' |
        'identity' |
        'settings/appearance' | 'settings/notifications' | 'settings/preferences' |
        'settings/read_receipts' | 'settings/images' | 'settings/bridge' |
        'settings/cal_bridge' | 'settings/card_bridge' | 'settings/keys';
  
  // Email
  selectedThread: number;
  composing: boolean;
  replyOpen: boolean;
  replyText: string;
  replyIsForward: boolean;
  replyShowCc: boolean;
  replyShowBcc: boolean;
  replyTo: string;
  replyCc: string;
  replyBcc: string;
  customThreadMsgs: Record<number, Message[]>;

  // Messaging
  activeCalendarChannel: string | null;  // channel id
  activeDmChannel: string | null;
  msgText: string;
  msgPendingAttachment: { name: string; size: string } | null;

  // File upload
  showFileUpload: boolean;
  fileUploadTarget: 'email' | 'messaging' | null;

  // UI
  variant: 'A' | 'B';  // compact / spacious
  darkMode: boolean;
  showUserMenu: boolean;
  showDarkMenu: boolean;

  // Onboarding
  onboardingStep: number;  // -1=done, 0=welcome, 1=identity, 2=email, 3=ready
  byodMode: boolean;
  byodDomain: string;
  byodVerifying: boolean;
  byodVerified: boolean;
  connectingProvider: 'gmail' | 'fastmail' | null;
  emailConnectStep: 'idle' | 'auth' | 'connecting' | 'done';
  connectedEmails: { provider: string; address: string }[];

  // Calendar
  calViewType: 'week' | 'month';
  calWeekOffset: number;
  calSelectedEvent: CalEvent | null;
  calShowDetail: boolean;

  // Notes
  selectedNote: number;
  noteEdits: Record<number, { title?: string; body?: string }>;
  customNotes: Note[];

  // Contacts
  selectedContact: number;

  // Settings
  settingsSection: string;
  renderingMode: 'blocks' | 'compact';
  readReceipts: boolean;
  autoLoadImages: boolean;
  notifSound: boolean;
  notifBadge: boolean;

  // Bridge
  bridgeShowOauth: boolean;
  bridgeProvider: string | null;
  bridgeStep: 'info' | 'connecting' | 'done';
  bridgeImapFields: Record<string, string>;
  caldavConnected: boolean;
  caldavTesting: boolean;
  carddavTesting: boolean;

  // Keys
  keygenStep: 0 | 1 | 2 | 3 | 4 | 5;
  keygenKeys: GeneratedKeyset | null;
  keygenRevSaved: boolean;
  keygenName: string;
  keysets: Keyset[];
  activeKeysetId: string | null;
  editingKeysetId: string | null;
  editingKeysetName: string;

  // Revocation
  showRevokeModal: boolean;
  revokeReason: 'compromised' | 'lost' | 'rotation';
  revokeConfirmText: string;
}

interface Keyset {
  id: string;
  label: string;
  createdAt: string;
  identityKey: { pub: string; priv: string };
  signingKey: { pub: string; priv: string; expLabel: string };
  revocationKey: { pub: string; priv: string };
  dnsRecords: DnsRecord[];
}
```

---

## Design Tokens

### Colors (Dark mode — default)

| Token | Value | Usage |
|---|---|---|
| `--r-bg` | `#09090B` | App background |
| `--r-sf` | `#111113` | Surface (panels, cards) |
| `--r-sf2` | `#18181B` | Elevated surface (inputs, tooltips) |
| `--r-bd` | `#1E1E22` | Border |
| `--r-bd2` | `#28282C` | Stronger border / disabled bg |
| `--r-t1` | `#FAFAFA` | Primary text |
| `--r-t2` | `#A1A1AA` | Secondary text |
| `--r-t3` | `#52525B` | Tertiary text / placeholders |
| `--r-acc` | `#6366F1` | Accent (indigo) |
| `--r-accd` | `rgba(99,102,241,0.15)` | Accent dimmed bg |
| `--r-br` | `#D97706` | Bridge indicator (amber) |
| `--r-brbg` | `rgba(217,119,6,0.08)` | Bridge bg tint |
| `--r-ag` | `#8B5CF6` | Agent indicator (violet) |
| `--r-safe` | `#22C55E` | Success / verified (green) |
| `--r-sel` | `rgba(99,102,241,0.09)` | Selected row bg |
| `--r-hov` | `rgba(255,255,255,0.03)` | Hover bg |

### Colors (Light mode)

| Token | Value |
|---|---|
| `--r-bg` | `#F0F0F4` |
| `--r-sf` | `#FFFFFF` |
| `--r-sf2` | `#F5F5F8` |
| `--r-bd` | `#E4E4E9` |
| `--r-bd2` | `#D4D4DA` |
| `--r-t1` | `#18181B` |
| `--r-t2` | `#71717A` |
| `--r-t3` | `#A1A1AA` |
| `--r-acc` | `#4F46E5` |
| `--r-accd` | `rgba(79,70,229,0.10)` |
| `--r-br` | `#B45309` |
| `--r-brbg` | `rgba(180,83,9,0.06)` |
| `--r-ag` | `#7C3AED` |
| `--r-safe` | `#16A34A` |
| `--r-sel` | `rgba(79,70,229,0.08)` |
| `--r-hov` | `rgba(0,0,0,0.028)` |

### Semantic / functional colors (not in token system)
- Danger / destructive: `#EF4444`
- Warning (revocation key): `#FBBF24`
- Gmail red: `#EA4335`
- Fastmail blue: `#1C6EF2`

### Typography

| Role | Family | Size | Weight | Letter spacing |
|---|---|---|---|---|
| Body | Space Grotesk | 14px | 400 | — |
| Label | Space Grotesk | 13px | 500 | — |
| Caption | Space Grotesk | 12px | 400 | — |
| Micro label | Space Grotesk | 10–11px | 600 | +0.07–0.08em |
| Section heading | Space Grotesk | 20–22px | 700 | -0.02–0.03em |
| Modal heading | Space Grotesk | 26px | 700 | -0.03em |
| Monospace (handles, keys, DNS) | Space Mono | 11–12px | 400 | — |

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;500&display=swap
```

### Spacing

Consistent 4px base unit. Common values: 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44px.

### Border radii

- `4px` — pills, small badges
- `5–6px` — buttons, inputs, small cards
- `7–8px` — cards, panels
- `10–12px` — modals, large cards
- `14px` — large modals (onboarding)
- `50%` — avatars

### Shadows

- Modal: `box-shadow: 0 32px 96px rgba(0,0,0,0.6)` (dark), `0 24px 64px rgba(0,0,0,0.5)`
- Small popover: `box-shadow: 0 8px 32px rgba(0,0,0,0.4)`

### Animations

```css
@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes spin   { to   { transform:rotate(360deg); } }
```

- Modals appear: `animation: fadeUp 0.2–0.25s ease`
- Overlays: `animation: fadeIn 0.15–0.2s ease`
- Transitions: `background 120ms`, `color 80ms` on interactive elements
- Spinner: `animation: spin 0.8s linear infinite`, `border-top-color: accent`

---

## Libraries to Integrate

| Purpose | Library |
|---|---|
| Auth (OAuth, IMAP bridge auth) | [better-auth](https://better-auth.com) |
| Rich text (Notes) | prosemirror-state, prosemirror-view, prosemirror-markdown, prosemirror-commands, prosemirror-keymap, prosemirror-history, prosemirror-inputrules, prosemirror-schema-list |
| Key generation | Web Crypto API (`crypto.subtle.generateKey` with Ed25519) |
| Calendar | Full custom implementation (no lib used in prototype) |

---

## UCP Protocol Reference

The app implements the **Unified Communications Protocol (UCP)**. Key spec details:

- Identity = Ed25519 keypair. Identity key signs signing keys.
- Signing key: 60-day rotation, signs all outbound messages
- Revocation key: emergency use only, MUST be stored offline
- DNS records (all TXT):
  - `_ucp` → `v=ucp1; ik=<identity-key-base64url>`
  - `_ucp-sign` → `v=ucp1; sk=<signing-key>; exp=<unix-timestamp>; sig=<sig>`
  - `_ucp-revoke` → `v=ucp1; rk=<revocation-key-pubkey>`
  - `_ucp-srv` → `v=ucp1; endpoint=https://...; priority=10`
  - `_ucp-server` → `v=ucp1; spk=<server-pubkey>`
- Full spec: https://github.com/unifiedcommunicationsprotocol/spec

---

## Scrollbar Styling

```css
::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.18); border-radius: 2px; }
```

---

## Files in This Package

- `README.md` — this document
- `Relay Client.dc.html` — the high-fidelity design prototype (open in a browser to interact with it)
