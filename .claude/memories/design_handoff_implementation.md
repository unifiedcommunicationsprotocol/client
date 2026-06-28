---
name: design_handoff_implementation
description: Systematic implementation checklist to match Relay UI 1:1 with design handoff
metadata:
  type: project
---

# Design Handoff Implementation Plan

**Status:** Planning phase — saved 2026-06-28
**Source:** ~/Downloads/design_handoff_relay_client/README.md
**Reference:** docs/DESIGN_HANDOFF.md (25KB comprehensive spec)

## Current State vs Target

✅ **Complete:**
- Basic React + AppContext structure (60+ fields in state)
- Tailwind v4 CSS with design tokens (colors, animations)
- Onboarding component (scaffolded)
- Navigation buttons SVG icons

❌ **Missing/Incomplete:**
- Layout shell (3-column grid)
- Left nav (52px width, flex column)
- Secondary panels (280px conditional)
- All 8 view implementations
- Settings sidebar (220px)
- Modal overlays (onboarding, compose, file upload, etc.)
- Interactions (all)
- Many UI components

## Implementation Phases

### Phase 1: Layout Shell & Navigation (Critical Path) ✅ COMPLETE
Priority: HIGH — enables all other views

- [x] 3-column layout container (nav 52px | secondary 280px | main flex:1)
- [x] Left navigation sidebar
  - [x] Icon buttons: Inbox, Messaging, Calendar, Notes, Contacts, Agents
  - [x] Settings gear icon
  - [x] User avatar (40px circle, initials "Y")
  - [x] Active state styling (--r-accd bg, --r-acc text)
  - [x] Hover state (--r-hov bg)
- [x] User avatar dropdown menu
  - [x] Display name + handle
  - [x] Dark/light theme toggle
  - [x] Settings link
- [x] Secondary panel container (shown/hidden based on view)

**Files created/modified:**
- ✅ `src/client/components/LayoutShell.tsx` (new)
- ✅ `src/client/components/LeftNav.tsx` (new)
- ✅ `src/client/components/MainApp.tsx` (refactored to use LayoutShell)

**Status:** Phase 1 implemented 2026-06-28, commit TBD

### Phase 2: Inbox View (Complex, High Value)
Priority: HIGH — core email functionality

- [ ] Thread list (secondary panel, 280px)
  - [ ] Header: "Inbox" + Variant toggle (Compact/Spacious) + Compose button (28px)
  - [ ] Thread rows (compact & spacious variants)
    - [ ] Avatar (28px or 36px), initials, colored backgrounds
    - [ ] From (12.5px-14px), subject, preview (1-2 line clamp)
    - [ ] Timestamp (top-right)
    - [ ] Unread indicator (6px dot, accent color)
    - [ ] Left border (2px): bridge (amber), agent (purple), native (transparent)
    - [ ] Selected state (--r-sel background)
  - [ ] Thread row interactions (click → load thread)
  
- [ ] Thread detail (main content area)
  - [ ] Header: subject (16px 700), from (monospace 12px)
  - [ ] Category pill, Bridge badge, Agent badge
  - [ ] Message cards (--r-sf bg, 1px --r-bd border, 8px radius)
    - [ ] Avatar (32px) + sender name (13px 600) + handle (11px mono) + time
    - [ ] E2E lock icon (green) or open lock (amber)
    - [ ] Body paragraphs (14px line-height 1.7)
    - [ ] Attachments (pill chips with file icon, name, size)
  - [ ] Reply/Forward toolbar
  
- [ ] Reply/Forward compose
  - [ ] Container: 1px --r-bd border, 8px radius, --r-sf2 bg
  - [ ] Mode label (Reply/Forward) + To field (forward) + CC/BCC toggles + close ✕
  - [ ] CC row (conditional): label + input
  - [ ] BCC row (conditional): label + input
  - [ ] Attachment preview chip (filename + size + remove ✕)
  - [ ] Textarea: auto-expanding, min 80px, transparent, 12px padding
  - [ ] Footer: paperclip attach + send button (6px padding 18px, accent bg)
  
- [ ] Compose modal (new message)
  - [ ] Centered overlay (560px width)
  - [ ] To/CC/BCC/Subject fields
  - [ ] Full textarea body
  
- [ ] File upload modal
  - [ ] Centered overlay (400px)
  - [ ] Drag & drop zone (dashed border)
  - [ ] File input trigger
  - [ ] Selected file display (name + size)
  - [ ] Confirm button

**Files to create:**
- `src/client/components/InboxView.tsx`
- `src/client/components/ThreadList.tsx`
- `src/client/components/ThreadDetail.tsx`
- `src/client/components/ComposeArea.tsx`
- `src/client/components/ComposeModal.tsx`
- `src/client/components/FileUploadModal.tsx`

### Phase 3: Messaging View
Priority: MEDIUM — real-time chat

- [ ] Channel/DM list (secondary)
  - [ ] "Channels" section header
  - [ ] Channel rows: # general + unread badge
  - [ ] "Direct messages" section header
  - [ ] DM rows: avatar (24px) + name + online dot
  - [ ] Active: --r-sel bg
- [ ] Message thread (main)
  - [ ] Header: channel name (14px 600)
  - [ ] E2E badge: green lock + "End-to-end encrypted"
  - [ ] Messages: grouped by sender, avatar (28px), name (12px 600), time (11px)
  - [ ] Message text (13.5px, line-height 1.6)
  - [ ] Attachments as file chips
- [ ] Compose bar (bottom)
  - [ ] Paperclip icon + textarea + send button (28px square)
  - [ ] Auto-resize textarea
  - [ ] Enter sends, Shift+Enter newline

**Files to create:**
- `src/client/components/MessagingView.tsx`
- `src/client/components/ChannelList.tsx`
- `src/client/components/MessageThread.tsx`
- `src/client/components/ComposeBar.tsx`

### Phase 4: Notes View (ProseMirror Rich Editor)
Priority: MEDIUM — requires prosemirror setup

- [ ] Note list (secondary)
  - [ ] Header: "Notes" + new button (26px, accent dimmed)
  - [ ] Note rows (8px 10px padding)
    - [ ] Pin icon (accent) for pinned
    - [ ] Title (13px 500) + updated label (11px --r-t3)
    - [ ] Preview (11.5px 2-line clamp)
    - [ ] Selected: --r-sel bg
- [ ] Note editor (main)
  - [ ] Title input (22px 700, transparent, 24px 40px padding)
  - [ ] Metadata row: updated time + tags
  - [ ] **ProseMirror rich editor**
    - [ ] Toolbar: B/I/`/H1/H2/❝/•
    - [ ] Toolbar buttons: 28x26px, 5px radius, active --r-accd bg
    - [ ] Floating selection toolbar (dark pill, #18181f bg, 8px radius)
    - [ ] Markdown input rules: # H1, ## H2, > blockquote, - bullet, 1. ordered
- [ ] ProseMirror styles (already in CSS, verify working)

**Libraries to add:**
- prosemirror-state
- prosemirror-view
- prosemirror-markdown
- prosemirror-commands
- prosemirror-keymap
- prosemirror-history
- prosemirror-inputrules
- prosemirror-schema-list

**Files to create:**
- `src/client/components/NotesView.tsx`
- `src/client/components/NoteList.tsx`
- `src/client/components/NoteEditor.tsx`
- `src/lib/prosemirror-setup.ts` (editor instance, toolbar, markdown)

### Phase 5: Calendar View
Priority: MEDIUM — custom implementation

- [ ] Header bar
  - [ ] Week/Month toggle (segmented)
  - [ ] "Today" button
  - [ ] < / > navigation
  - [ ] Date range label (13px 500)
  - [ ] "+ New event" button
- [ ] Week view
  - [ ] 7-column grid + time gutter (52px)
  - [ ] Day headers: Mon-Sun, date
  - [ ] Today column: accent header, accent left border
  - [ ] 24 hourly rows (overflow-y scroll)
  - [ ] Events: absolutely positioned cards, colored, 5px radius, title + time
  - [ ] Event click → detail popover
- [ ] Month view
  - [ ] 7-column grid, day cells
  - [ ] Event dots/chips per day
  - [ ] Today: accent circle on date

**Files to create:**
- `src/client/components/CalendarView.tsx`
- `src/client/components/CalendarWeek.tsx`
- `src/client/components/CalendarMonth.tsx`

### Phase 6: Contacts & Agents Views
Priority: LOW

- [ ] Contacts
  - [ ] Contact list (secondary)
  - [ ] Contact detail (avatar 48px, name 18px 700, handle, verified badge, sections)
- [ ] Agents
  - [ ] Full-page grid layout
  - [ ] Agent cards (name, description, last run, status, toggle)
  - [ ] Activity log

### Phase 7: Settings Panel (Complex, Many Sub-Views)
Priority: MEDIUM — required for key management

- [ ] Settings layout: sidebar (220px) + content (flex:1, 36px 44px padding, max 640px)
- [ ] Sidebar sections:
  - [ ] General: Appearance, Notifications, Preferences
  - [ ] Privacy: Identity, Keys, Read receipts
  - [ ] Bridges: Email, Calendar, Contacts
  - [ ] Messaging: Images
- [ ] Appearance settings
  - [ ] Theme toggle (Light/Dark)
  - [ ] Thread density (Compact/Spacious)
  - [ ] Message rendering (Blocks/Compact)
- [ ] Notifications settings
  - [ ] Sound toggle
  - [ ] Badge toggle
- [ ] Identity page
  - [ ] UCP address display card
  - [ ] Avatar upload
  - [ ] Display name field
  - [ ] Active keyset card (name, fingerprints, "Manage keys →")
  - [ ] Inactive keysets (switcher)
- [ ] Keys page ⭐ **Critical for UCP**
  - [ ] "New keyset" button
  - [ ] Keyset cards (name, active dot, fingerprints, created date)
  - [ ] Active keyset: 1px rgba(99,102,241,0.4) border, accent tint
  - [ ] Actions: "Use this" (accent, inactive only), "Rotate", "Delete"
  - [ ] Rename: inline input
  - [ ] **Keygen ceremony (4 steps)**
    - [ ] Step 1: Spinner "Generating… nothing leaves browser"
    - [ ] Step 2: Name + Review (3 key cards)
    - [ ] Step 3: Revocation key (show private, Copy + Download, offline checkbox)
    - [ ] Step 4: DNS records table (5 TXT records)
    - [ ] Step 5: Done summary
  - [ ] Empty state: shield icon + "No keysets yet"
  - [ ] Danger zone: "Revoke identity…" → modal
- [ ] Revoke modal
  - [ ] 400px centered overlay
  - [ ] Reason select (compromised/lost/rotation)
  - [ ] Type "REVOKE" to confirm (Space Mono)
  - [ ] Confirm button: disabled gray → red when valid
- [ ] Email bridge settings
  - [ ] Gmail card + Fastmail card + IMAP card
  - [ ] "Connect" buttons → OAuth modal
  - [ ] OAuth modal (380px): info screen, spinner, success
  - [ ] IMAP modal (400px): host, port, username, password fields
  - [ ] Connected: email address + "Connected" badge + "Disconnect"
- [ ] Calendar bridge
  - [ ] Google, Apple (CalDAV), Outlook
  - [ ] Same OAuth/credentials flow
- [ ] Contacts (CardDAV)
  - [ ] iCloud, Google, custom CardDAV
  - [ ] Same connection flow
- [ ] Read receipts toggle
- [ ] Images toggle (auto-load remote)

**Files to create:**
- `src/client/components/SettingsView.tsx`
- `src/client/components/SettingsSidebar.tsx`
- `src/client/components/AppearanceSettings.tsx`
- `src/client/components/NotificationsSettings.tsx`
- `src/client/components/IdentitySettings.tsx`
- `src/client/components/KeysSettings.tsx`
- `src/client/components/KeygenCeremony.tsx`
- `src/client/components/RevokeModal.tsx`
- `src/client/components/EmailBridgeSettings.tsx`
- `src/client/components/OAuthModal.tsx`
- `src/client/components/CalendarBridgeSettings.tsx`
- `src/client/components/ContactsBridgeSettings.tsx`

### Phase 8: Onboarding Modal
Priority: HIGH — first-time user flow

- [ ] Full-screen overlay (rgba(0,0,0,0.65), blur 6px)
- [ ] Modal (480px, 14px radius, 36px 40px 32px padding)
- [ ] Close button (28px, top-right)
- [ ] Welcome screen
  - [ ] Relay logo (36px indigo box, arrow icon)
  - [ ] "Welcome to Relay" (26px 700, tracking -0.03em)
  - [ ] 3 feature cards (Crypto / Open protocol / Bridge email)
  - [ ] "Get started →" CTA + "I already have an account" link
- [ ] Step 1 — Identity
  - [ ] Progress bar (1/3)
  - [ ] Generated keypair display (identity, signing, revocation)
  - [ ] UCP address input
  - [ ] "Bring your own domain" flow
    - [ ] Domain input + "Verify records" button
    - [ ] DNS records table (5 TXT, animated verification states)
    - [ ] Continue unlocks after all pass
  - [ ] "Continue →" button
- [ ] Step 2 — Connect email
  - [ ] Progress bar (2/3)
  - [ ] Gmail card + Fastmail card + "Connect" buttons
  - [ ] OAuth flow inline
  - [ ] Skip / continue later option
- [ ] Step 3 — Ready
  - [ ] Progress bar (3/3)
  - [ ] Summary (address, connected accounts)
  - [ ] "Open Relay →" finishes

**Already scaffolded:** `src/client/components/Onboarding.tsx`
**Files to create:**
- `src/client/components/OnboardingWelcome.tsx`
- `src/client/components/OnboardingIdentity.tsx`
- `src/client/components/OnboardingEmail.tsx`
- `src/client/components/OnboardingReady.tsx`

## State Shape Validation

Current AppContext has ~60 fields. Cross-check against handoff spec (lines 399-502):
- Navigation fields ✓
- Email fields ✓
- Messaging fields ✓
- UI fields ✓
- Onboarding fields ✓
- Calendar fields ✓
- Notes fields ✓
- Contacts fields ✓
- Settings fields ✓
- Bridge fields ✓
- Keys fields ✓
- Revocation fields ✓

**Action:** Verify all fields exist, add missing ones.

## Color Token Updates

Handoff specifies dark mode as default (lines 509-528).
Current CSS has both light & dark. Verify alignment:
- Dark: `#09090B` bg, `#111113` sf, `#18181B` sf2, etc.
- Light: `#F0F0F4` bg, `#FFFFFF` sf, `#F5F5F8` sf2, etc.
- Bridge (amber): `#D97706` dark, `#B45309` light
- Agent (violet): `#8B5CF6` dark, `#7C3AED` light

**Action:** Add bridge (`--r-br`, `--r-brbg`) and agent (`--r-ag`) to Tailwind CSS variables.

## Next Immediate Steps

**This week:**
1. Implement Phase 1 (Layout Shell & Navigation) — unblocks all other work
2. Implement Phase 2 (Inbox) — highest value, demonstrates full flow

**Critical blocking issues:**
- [ ] Verify AppContext has all required state fields
- [ ] Add missing color tokens to CSS (bridge, agent)
- [ ] Wire navigation buttons to dispatch actions
- [ ] Ensure layout shell renders correctly

## Session 1 Completion (2026-06-28)

**Phase 1: Layout Shell & Navigation — COMPLETE ✅**
- Commit: `0176baa`
- All code in place, TypeScript strict mode passes
- Ready for Phase 2 to build within this layout

**Key Implementation Details for Resuming:**

### LayoutShell Component (src/client/components/LayoutShell.tsx)
- Takes props: `showSecondary`, `secondaryContent`, `mainContent`
- Renders: nav (52px) | secondary (280px if shown) | main (flex:1)
- Secondary hidden for: Calendar, Agents, Settings, Identity views
- Secondary shown for: Inbox, Messaging, Notes, Contacts

### LeftNav Component (src/client/components/LeftNav.tsx)
- Fixed 52px width, dark background (var(--r-sf))
- Nav items: Inbox, Messages, Calendar, Contacts, Notes, Agents (40×40px buttons)
- Settings (⚙️) at bottom, User avatar (Y, #4F46E5) at very bottom
- Active state: var(--r-accd) bg + var(--r-acc) text
- User dropdown: theme toggle, settings link
- All dispatch actions working: setView, toggleDarkMode

### MainApp Refactored (src/client/components/MainApp.tsx)
- Delegates all layout to LayoutShell
- Determines showSecondary based on view type
- Renders main content via renderMainContent()
- Simple, clean, 60 lines

### AppContext State (verified)
- All required fields exist for Inbox (selectedThread, replyOpen, etc.)
- Action types: selectThread (string|null), setView (string), etc.
- View values: 'inbox' | 'messaging' | 'calendar' | 'notes' | 'contacts' | 'agents' | 'settings/*'

### Tailwind CSS (src/client/index.css)
- All design tokens imported (colors, animations, ProseMirror styles)
- CSS variables for light/dark mode
- @layer: theme, base, utilities
- 288 lines, production ready

---

## Resuming in Next Session

**Start with Phase 2: Inbox View**

### Phase 2 Checklist (5 components needed)

1. **InboxThreadList** (Secondary panel)
   - Already started! See notes below
   - Shows thread rows with compact/spacious variants
   - Header: "Inbox" + unread count + variant toggle + compose button
   - Thread rows: avatar, from, subject, preview, time, unread dot
   - Thread metadata: category pill, bridge badge, agent badge (spacious only)
   - Compact variant: 28px avatar, 1-line preview, no badges
   - Spacious variant: 36px avatar, 2-line preview, all badges visible
   - Actions: Click thread → selectThread(threadId), toggle variant → setVariant

2. **ThreadDetail** (Main content area)
   - Header: subject (16px 700), from (monospace 12px --r-t3)
   - Metadata: category pill, Bridge badge, Agent badge
   - Messages: vertical stack, each message in card (--r-sf bg, 1px --r-bd border)
     - Avatar (32px) + sender name (13px 600) + handle (11px mono) + time
     - E2E lock icon (green #22C55E) or open lock (amber #D97706 for bridged)
     - Body (14px, line-height 1.7)
     - Attachments: pill chips (file icon, name, size)
   - Reply/Forward toolbar at bottom (Reply button, Forward button)

3. **ComposeArea** (Reply/Forward)
   - Container: 1px --r-bd border, 8px radius, --r-sf2 bg
   - Header row: mode label + To field (forward only) + CC/BCC toggles + close ✕
   - CC/BCC rows (conditional): label + input
   - Attachment preview chip: filename + size + remove ✕
   - Textarea: auto-expanding, min 80px, transparent, 12px padding
   - Footer: paperclip + send button (6px 18px padding, accent bg)

4. **ComposeModal** (New message)
   - Centered overlay, 560px width
   - To/CC/BCC/Subject fields
   - Full textarea body
   - Send button

5. **FileUploadModal** (Attachment picker)
   - Centered overlay, 400px width
   - Drag & drop zone (dashed border)
   - File input trigger
   - Selected file display (name + size)
   - Confirm button

### Important State for Phase 2

- `selectedThread`: string (thread ID) or null
- `replyOpen`: boolean
- `replyIsForward`: boolean
- `replyText`: string
- `replyShowCc`, `replyShowBcc`: boolean
- `replyTo`, `replyCc`, `replyBcc`: string
- `customThreadMsgs`: Record<number, Message[]>
- `showFileUpload`: boolean
- `fileUploadTarget`: 'email' | null

### Design Reference

See **docs/DESIGN_HANDOFF.md lines 54-106** for Inbox view specification.

---

*Session 1 Completed: 2026-06-28*
*Next: Start Phase 2 (Inbox View) in fresh session*
*Ref: docs/DESIGN_HANDOFF.md (649 lines, comprehensive spec)*
