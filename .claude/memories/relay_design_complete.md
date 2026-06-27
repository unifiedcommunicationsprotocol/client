---
name: relay_design_complete
description: Complete Relay UI design - 3-column layout, color system, onboarding flow, implementation roadmap
metadata:
  type: project
---

# Relay UI Design — Complete Reference

**Status:** Design reviewed from HTML + 19 screenshots. Ready for implementation.

## Architecture (3-Column Layout)

```
┌─────────────────────────────────────────┐
│  Left Nav  │  Center Sidebar  │  Main   │
│   (52px)   │     (272px)      │ (flex)  │
├─────────────────────────────────────────┤
│   Dark     │   Light/Dark     │  Full   │
│   Icons    │   Context List   │ Content │
└─────────────────────────────────────────┘
```

### 1. Left Navigation (52px, Always Dark)
- Background: `#0A0A0D` (almost black)
- Relay logo + icon button at top
- Navigation buttons (in icon form):
  - Inbox (envelope)
  - Messages (chat bubble)
  - Calendar
  - Contacts (person)
  - Notes (document)
  - Agents (wizard icon)
  - Settings
- User avatar menu at bottom (clickable)
- Unread indicator (blue dot on Inbox icon if hasUnread)

### 2. Center Sidebar (272px, Light/Dark)
**Inbox Panel:**
- Header: "Inbox" title + unread count badge
- Toolbar: Variant toggle (A/V), Compose button (+ blue)
- Search bar
- Thread list (scrollable):
  - Avatar (colored background, initials)
  - Sender name (bold)
  - Timestamp
  - Subject line
  - Preview text (2 lines, gray)
  - Metadata: Category pill (colored), Bridge tag, Agent tag
  - Unread indicator (blue dot on left)

**Messages Panel:**
- "Messages" header
- Channels section (#hashtag channels)
- Direct Messages section (DM avatars + names)

**Calendar Panel:**
- Month/week selector
- Upcoming events list

**Contacts Panel:**
- Search bar
- Contact list with avatars
- Name + handle (gray)
- "On Relay" indicator (green dot if active)

**Notes Panel:**
- "Notes" header + add button
- Note list with:
  - Pin icon (if pinned)
  - Title (bold)
  - Preview text (gray)
  - Updated date

**Agents Panel:**
- Active agents with status dot
- "Add agent" button (dashed border)

**Settings Panel:**
- Account (Appearance, Notifications, Preferences)
- Privacy (Read receipts, External images)
- Integrations (Email bridge, Calendar bridge)
- Setup (Run setup wizard)

### 3. Main Content Area (Flex, Full Width)

**Inbox Thread View:**
- Header: Thread subject + info bar
  - Bridge indicator (if bridged)
  - Metadata tags
- Message list (scrollable):
  - Sender avatar + name
  - Timestamp + read indicator
  - Message body (rich text)
  - Quoted text (indented)
- Reply area:
  - "Reply to [sender]" label
  - Text input: "Write a reply..."
  - Send button (blue, disabled if empty)

**Settings Detail Views:**
- Right sidebar shows selected category content
- Options and toggles

## Color System

### Semantic Palette (CSS Variables)
- `--r-bg`: Main background (`#0f1419` dark, `#ffffff` light)
- `--r-sf`: Surface (`#1a1f2e` dark, `#f9fafb` light)
- `--r-sf2`: Surface secondary (`#252d3d` dark, `#f3f4f6` light)
- `--r-bd`: Border (`#3f4757` dark, `#e5e7eb` light)
- `--r-bd2`: Border secondary (`#4a5368` dark, `#d1d5db` light)
- `--r-t1`: Text primary (`#f3f4f6` dark, `#1f2937` light)
- `--r-t2`: Text secondary (`#d1d5db` dark, `#6b7280` light)
- `--r-t3`: Text tertiary (`#9ca3af` both)
- `--r-acc`: Accent (`#6366F1` both)
- `--r-accd`: Accent disabled (`#3730a3` dark, `#d1d5f0` light)
- `--r-safe`: Success (`#22C55E` both)
- `--r-danger`: Danger (`#EF4444` both)
- `--r-hov`: Hover (`#1a1f2e` dark, `#f5f5f5` light)
- `--r-sel`: Selection (`#312e81` dark, `#eef2ff` light)

### Avatar Colors (Thread List)
- Rotating palette: `#6366F1`, `#EA4335`, `#9333EA`, `#0EA5E9`, `#22C55E`, `#FBBF24`, `#EC4899`, etc.

## Onboarding Modal (Overlay)

- Fixed position, centered
- 480px width (responsive: max-width calc(100vw - 32px))
- Background: `var(--r-sf)` with border + shadow
- Z-index: 201 (overlay at 200)
- Animation: `fadeUp 0.25s ease`

**Steps:**
1. **Welcome** - Intro with benefits (Crypto, Open protocol, Bridge email)
2. **Identity** - Generated keypair display (ik, sk, rk with status icons)
3. **Address** - Claim relay.im or BYOD with DNS records table
4. **Email Bridge** - OAuth connect (Gmail/Fastmail) with permissions

**Progress Bar:** 3 segments, filled by step (hidden on welcome)

## Typography

- **Font Family:** Space Grotesk (UI), Space Mono (monospace)
- **Sizes:** 10.5px (small), 11px, 12px, 13px, 14px (body), 16px, 18px (titles), 26px (h1)
- **Weights:** 300 (light), 400, 500 (medium), 600 (bold), 700 (heavy)

## Components

### Button Styles
- **Primary:** Indigo background, white text, hover: darker, lift effect
- **Secondary:** Surface background, text primary, border, hover: lighter surface
- **Disabled:** 50% opacity
- **Icon buttons:** 26-34px squares

### Input Fields
- Border: `var(--r-bd)`, rounded 6px
- Focus: Border `var(--r-acc)`, shadow `rgba(99,102,241,0.1)`
- Placeholder: `var(--r-t3)`
- Textarea: Space Mono font

### Animations
- `fadeUp`: 0.3s (opacity 0→1, translateY 8px→0)
- `fadeIn`: 0.3s (opacity 0→1)
- `spin`: 0.7s infinite (rotate 360deg)

### Unread Indicators
- Blue dot: 5px radius, `#6366F1` with dark border
- Badge: Indigo background, white text, 10px font-weight:700, rounded-full

## Current State vs Design Gap

**Currently Implemented:**
- Basic folder structure (App.tsx, Onboarding.tsx, components/)
- Tailwind + CSS variables loaded
- Placeholder components with inline styles
- No actual routing or state management

**NOT Implemented:**
- ❌ 3-column layout structure
- ❌ Icon navigation (left nav)
- ❌ Thread list with avatars and metadata
- ❌ Message view with threading
- ❌ Settings panel navigation
- ❌ Onboarding modal flow
- ❌ Real unread tracking
- ❌ Category pills
- ❌ Bridge/Agent tags
- ❌ User menu
- ❌ Search functionality
- ❌ Compose modal

## Next Steps (Implementation Roadmap)

### Phase 1: Core Layout
1. **Layout.tsx** - 3-column flex layout (nav, sidebar, content)
2. **IconNav.tsx** - Dark left nav with 52px width, icon buttons, user menu
3. **ContextSidebar.tsx** - 272px center sidebar, section-specific panels
4. **MainContent.tsx** - Flex content area with current view

### Phase 2: Inbox & Threading
1. **ThreadList.tsx** - List of threads with avatars, metadata, search
2. **ThreadView.tsx** - Message display, quoted replies, compose area
3. **ComposeArea.tsx** - Reply input, Send button, draft handling

### Phase 3: Navigation & Sections
1. **MessagesPanel.tsx** - Channels + DMs
2. **CalendarPanel.tsx** - Events list
3. **ContactsPanel.tsx** - Contact list with Relay indicator
4. **NotesPanel.tsx** - Notes with pin indicator
5. **AgentsPanel.tsx** - Agent cards with status
6. **SettingsPanel.tsx** - Settings menu + detail views

### Phase 4: Onboarding
1. **OnboardingModal.tsx** - Centered modal overlay
2. **Step 0-3 components** - Welcome, Identity, Address, Email bridge

### Phase 5: Polish
1. Dark/light theme toggle
2. Unread tracking
3. Search implementation
4. User menu (logout, settings, theme)
5. Real API integration

---

*Updated: 2026-06-27 — Design complete, ready for component rebuild*
