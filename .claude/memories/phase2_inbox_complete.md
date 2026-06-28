---
name: phase2_inbox_complete
description: Phase 2 Inbox View complete — InboxThreadList, ThreadDetail, ComposeArea, FileUploadModal
metadata:
  type: project
---

# Phase 2: Inbox View — Complete

**Status:** Implemented 2026-06-28
**Commit:** `3d7d877` (Phase 2 Complete: Inbox View Implementation)

## Components Implemented

### 1. InboxThreadList (Secondary Panel)
**File:** `src/client/components/InboxThreadList.tsx`

**Purpose:** Shows thread list in 280px secondary panel on left of main content

**Features:**
- Header: "Inbox" title + unread count badge + variant toggle (C/S) + compose button (28px accent)
- Search input (live filter on from/subject/preview)
- Thread rows with two variants:
  - **Compact (C):** 28px avatar, 1-line preview, no badges
  - **Spacious (S):** 36px avatar, 2-line preview, category/bridge/agent badges visible
- Per-thread styling:
  - Left border 2px: amber (#D97706) for bridge, purple (#8B5CF6) for agent, transparent for native
  - Selected state: background var(--r-sel)
  - Unread indicator: 6px dot (accent color) when unread > 0
  - Avatar: colored circle with initials
  - From + timestamp top row, subject, preview, metadata

**State Used:**
- `state.variant` (A = compact, B = spacious) → dispatch setVariant
- `state.selectedThread` (string | null) → dispatch selectThread(threadId)
- `state.composing` (true opens ComposeModal) → dispatch setComposing(true)

### 2. ThreadDetail (Main Content Area)
**File:** `src/client/components/ThreadDetail.tsx`

**Purpose:** Shows selected thread's messages + reply/forward interface

**Features:**
- Header (sticky): subject (16px 700) + from (monospace 12px --r-t3)
- Badges: Bridge pill (amber bg/text), Agent pill (purple bg/text)
- Message cards (background var(--r-sf), border 1px var(--r-bd), radius 8px)
  - Avatar 32px (colored circle)
  - Sender name (13px 600) + handle (11px monospace --r-t3) + time
  - E2E lock indicator: green 🔒 (encrypted=true) or amber 🔓 (encrypted=false)
  - Body (14px, line-height 1.7, white-space preserved)
- Reply/Forward toolbar: two buttons at bottom (hidden when replyOpen=true)
  - Reply → dispatch setReplyOpen(true), setReplyIsForward(false)
  - Forward → dispatch setReplyOpen(true), setReplyIsForward(true)
- ComposeArea rendered inline when replyOpen=true

**Data Flow:**
- Reads from THREAD_MSGS[state.selectedThread] or state.customThreadMsgs[state.selectedThread]
- Falls back to empty array if no thread selected
- Empty state: "No thread selected" message (📧 emoji)

### 3. ComposeArea (Reply/Forward Widget)
**File:** `src/client/components/ComposeArea.tsx`

**Purpose:** Inline reply/forward composer, shows when replyOpen=true

**Features:**
- Container: border 1px var(--r-bd), radius 8px, background var(--r-sf2), margin bottom 20px
- Header row: mode label (Reply/Forward uppercase) + CC/BCC toggles + close button (✕)
- CC input row (conditional on replyShowCc=true): label "CC" + input "Add CC recipients..."
- BCC input row (conditional on replyShowBcc=true): label "BCC" + input "Add BCC recipients..."
- Forward mode: To field in header (forward only)
- Textarea: 12px padding, min-height 80px, transparent bg, border-none, placeholder "Type your reply..."
- Footer: paperclip button (📎, placeholder) + Send button (accent bg, disabled when empty)

**State Managed:**
- `state.replyOpen` → toggle on/off
- `state.replyIsForward` → determines mode label
- `state.replyText` → textarea value
- `state.replyTo`, `state.replyCc`, `state.replyBcc` → input values
- `state.replyShowCc`, `state.replyShowBcc` → conditional row display
- handleClose() → resets all reply state
- handleSend() → console.log (TODO: wire to API)

### 4. FileUploadModal (Drag & Drop Upload)
**File:** `src/client/components/FileUploadModal.tsx`

**Purpose:** Modal for file attachment in messages

**Features:**
- Full-screen overlay (rgba(0,0,0,0.5), click to close)
- Centered modal (width 400px, background var(--r-sf), border 1px var(--r-bd), shadow)
- Header: "Upload file" title + close button (✕)
- Two states:
  - **No file selected:** Drag & drop zone (dashed border, padding 40px, icon 📁)
    - Hover: border accent, background var(--r-accd)
    - Click or drag → file input handler
  - **File selected:** Card showing filename (📄) + size + remove button (✕)
- Footer: Cancel + Attach buttons (Attach disabled if no file)

**State Managed:**
- `state.msgShowFileModal` (boolean) → controls visibility
- `state.msgPendingAttachment` (MsgAttachment | null) → current file
  - id, name, size, type fields
- Dispatches setMsgPendingAttachment (add/remove file)
- TODO: Wire to ComposeArea attachment button

## Integration

### AppContext State
All required fields already exist:
- `selectedThread` (string | null)
- `replyOpen` (boolean)
- `replyIsForward` (boolean)
- `replyText` (string)
- `replyShowCc` / `replyShowBcc` (boolean)
- `replyTo` / `replyCc` / `replyBcc` (string)
- `customThreadMsgs` (Record<string, ThreadMsg[]>)
- `msgShowFileModal` (boolean)
- `msgPendingAttachment` (MsgAttachment | null)
- `variant` (A | B)

### Component Wiring

**Sidebar.tsx:**
- Conditional render: `state.view === "inbox"` → `<InboxThreadList />`
- Other views handled by existing components (MessagesPanel, CalendarPanel, etc.)

**MainApp.tsx:**
- `showSecondary`: includes "inbox" in list
- `renderMainContent()`: case "inbox" → `<ThreadDetail />` (replaced old ThreadView)

**App.tsx:**
- Root level: `<ComposeModal />` + `<FileUploadModal />`
- ComposeModal triggered by compose button (state.composing)
- FileUploadModal triggered by state.msgShowFileModal

## Data Structures

**THREADS** (src/client/data.ts):
```typescript
{
  id: string
  from: string
  subject: string
  preview: string
  timestamp: string
  unread: number
  avatar: string        // initials (e.g., "SC")
  avatarColor: string   // hex color
}
```

**THREAD_MSGS:**
```typescript
Record<string, ThreadMsg[]>
ThreadMsg {
  id: string
  from: string
  to?: string
  cc?: string
  timestamp: string
  subject: string
  body: string
  encrypted: boolean
}
```

## Testing Notes

**Manual Verification:**
- Click thread in InboxThreadList → ThreadDetail loads with messages
- Toggle C/S variant → thread rows change avatar size + preview lines
- Search filter → threads filter by from/subject/preview
- Click Reply → ComposeArea appears below messages
- Click Forward → ComposeArea appears with To field
- Type in compose → Send button enables
- Click CC/BCC toggles → rows appear/disappear
- File upload modal drag & drop → file selected shows name + size

**Accessibility:**
- Label elements have htmlFor associations (cc-input, bcc-input)
- Buttons have type="button" explicitly set
- Semantic HTML (no unnecessary divs for interaction)
- Color contrast checked via CSS variables

## Known Limitations / TODOs

1. **Attachments:** File upload modal created but not wired to ComposeArea
   - Need button in ComposeArea footer to trigger msgShowFileModal
   - Need to handle file object (File API) → send to server

2. **Message Sending:** handleSend in ComposeArea just console.logs
   - TODO: POST to /api/messages/send with encrypted body
   - TODO: Update UI optimistically, clear compose on success

3. **Search:** Basic client-side search (from/subject/preview only)
   - TODO: Server-side search with pagination for large inboxes
   - TODO: Search filters (unread, from date, has attachment)

4. **Real-time Updates:** Messages don't auto-load
   - TODO: Listen on WebSocket for new messages
   - TODO: Append to customThreadMsgs on receive

5. **Bridge Messages:** Detection hardcoded (checks subject for "Gmail"/"GitHub", "scheduler")
   - TODO: Add `bridge` / `agent` flags to THREAD_MSGS data structure

## Next Phases

### Phase 3: Messaging View
- ChannelList (secondary) + MessageThread (main)
- Real-time message streaming
- Online indicators, typing status

### Phase 4: Notes View
- ProseMirror rich editor
- Pin/favorite notes
- Real-time collaboration

### Phase 5: Calendar View
- Week/month toggle
- Event CRUD
- Caldav sync (bridge)

---

*Session 2 Completed: 2026-06-28*
*Commit: 3d7d877 — Phase 2 Complete: Inbox View Implementation*
