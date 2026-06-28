---
name: phase3_messaging_readiness
description: Phase 3 Messaging View — complete readiness checklist for fresh session start
metadata:
  type: project
---

# Phase 3: Messaging View — Complete Readiness Checklist

**Status:** Ready to implement (2026-06-28)
**Previous Commit:** `f2d74a8` (Docs & Memory Update)
**Next Session:** Start here for Phase 3

## What to Build

### Components to Create (2 main + 2 supporting)

1. **ChannelList** (`src/client/components/ChannelList.tsx`)
   - Secondary panel (280px width, left side)
   - Shows two sections: "Channels" + "Direct Messages"
   - Section headers: gray text (10px 600), uppercase, --r-t3 color
   - Channel rows: `# general` with unread badge, padding 7px 8px, radius 6px
   - DM rows: avatar 24px circle + name + online indicator dot
   - Selected state: background var(--r-sel), text --r-t1
   - Click row → dispatch selectChannel(id) or selectDM(id)

2. **MessageThread** (`src/client/components/MessageThread.tsx`)
   - Main content area (right side, flex:1)
   - Header: channel name (14px 600) + handle for DMs (11.5px monospace)
   - E2E badge: green lock 🔒 + "End-to-end encrypted" (native channels only)
   - Messages grouped by sender:
     - Avatar 28px circle + sender name (12px 600) + time (11px)
     - Message text: 13.5px, line-height 1.6
     - Attachments shown as file chips (inline)
   - Compose bar at bottom (see below)

3. **ComposeBar** (`src/client/components/ComposeBar.tsx`)
   - Bottom of MessageThread
   - Flex row: paperclip icon + auto-resize textarea + send button (28px square)
   - Textarea: 13px, placeholder "Type a message..."
   - Send button: 28×28px, accent bg, arrow icon
   - Keyboard: Enter sends, Shift+Enter = newline
   - Paperclip opens FileUploadModal (set msgShowFileModal=true)

4. **ChannelsPanel & DMsPanel** (Optional separate components or nested in ChannelList)
   - Can combine into ChannelList with conditional rendering
   - Section headers for "Channels" and "Direct messages"

### Design Reference

**File:** `docs/DESIGN_HANDOFF.md` lines 108-126

```
Messaging Section:

Secondary panel (280px):
- "Channels" header (10px 600 uppercase --r-t3)
- Channel rows: # general (unread badge if count > 0)
- "Direct messages" header
- DM rows: avatar 24px + name + online dot
- Selected: background var(--r-sel), text --r-t1

Main content:
- Header: channel name (14px 600) + DM handle (11.5px mono)
- E2E badge: 🔒 "End-to-end encrypted" (green)
- Messages grouped by sender (avatar 28px, name 12px 600, time 11px)
- Message text: 13.5px, line-height 1.6
- Compose bar: 📎 + textarea + send 28×28px
```

## State Fields to Use

**Already exist in AppContext:**
- `selectedChannel` (string | null)
- `selectedDM` (string | null)
- `msgInputText` (string) — compose textarea value
- `customChanMsgs` (Record<string, MsgEntry[]>) — messages per channel
- `msgShowFileModal` (boolean) — for attachment picker
- `msgPendingAttachment` (MsgAttachment | null)
- `msgDragOver` (boolean) — for drag highlight

**Actions already exist:**
- `selectChannel(id: string)` → dispatch selectChannel
- `selectDM(id: string)` → dispatch selectDM
- `setMsgInputText(text: string)` → dispatch setMsgInputText
- `addChanMsg(channel: string, msg: MsgEntry)` → dispatch addChanMsg
- `setMsgShowFileModal(bool)` → dispatch setMsgShowFileModal
- `setMsgPendingAttachment(file | null)` → dispatch setMsgPendingAttachment

**No new state needed** — all fields already present!

## Data Structures Ready

### MSG_CHANNELS (src/client/data.ts)
```typescript
export const MSG_CHANNELS = [
  { id: "general", name: "general", members: 124 },
  { id: "engineering", name: "engineering", members: 42 },
  { id: "protocol-spec", name: "protocol-spec", members: 18 },
];
```

### MSG_DMS (src/client/data.ts)
```typescript
export const MSG_DMS = [
  { id: "dm-1", name: "Sarah Chen", avatar: "SC", color: "#6366F1" },
  { id: "dm-2", name: "Miguel Torres", avatar: "MT", color: "#0EA5E9" },
];
```

### MsgEntry (src/client/data.ts)
```typescript
export interface MsgEntry {
  id: string
  from: string
  timestamp: string
  body: string
}
```

### Sample Messages (hardcoded for now)
Currently in AppContext initial state's `customChanMsgs`:
- general: [3 messages]
- engineering: [2 messages]
- dm-1 (Sarah): [2 messages]
- dm-2 (Miguel): [1 message]

## Integration Points

### Sidebar.tsx
Current:
```typescript
{state.view === "messaging" && <MessagesPanel />}
```

Update to:
```typescript
{state.view === "messaging" && <ChannelList />}
```

(Remove or keep MessagesPanel for reference, but route messaging view to ChannelList)

### MainApp.tsx
Current:
```typescript
case "messaging":
  return <MessagingView />;
```

Update to:
```typescript
case "messaging":
  return <MessageThread />;
```

(Replace MessagingView with new MessageThread)

### App.tsx
Already set up with FileUploadModal at root level, so compose bar button will work:
```typescript
<FileUploadModal />  // ← already rendered
```

Just dispatch `setMsgShowFileModal(true)` from ComposeBar paperclip button.

### LayoutShell.tsx
Already handles:
- `showSecondary` includes "messaging" in list
- Renders secondary panel when true
- Routes to ChannelList via Sidebar

**No changes needed** — component routing already in place!

## Step-by-Step Implementation

### Step 1: Create ChannelList Component
**File:** `src/client/components/ChannelList.tsx`

- Render header sections ("Channels", "Direct messages")
- Map MSG_CHANNELS and MSG_DMS to rows
- On click: dispatch selectChannel(id) or selectDM(id)
- Show selected state: background var(--r-sel)
- Show online indicator for DMs (simple dot)
- Show unread badge for channels (style like Inbox)

**Expected size:** ~250 lines

### Step 2: Create MessageThread Component
**File:** `src/client/components/MessageThread.tsx`

- Get selected channel/DM from state: `state.selectedChannel || state.selectedDM`
- Find name from MSG_CHANNELS or MSG_DMS
- Render header: name (14px 600) + handle if DM (11.5px mono)
- Show E2E badge (green) — always on (assume native channels)
- Get messages from `customChanMsgs[channelId]` or sample data
- Render messages grouped by sender (avatar 28px, name, time)
- Render ComposeBar at bottom
- Empty state if no channel/DM selected

**Expected size:** ~300 lines

### Step 3: Create ComposeBar Component
**File:** `src/client/components/ComposeBar.tsx`

- Flex row: paperclip + textarea + send button
- Textarea value: `state.msgInputText` → dispatch setMsgInputText
- Textarea resize handler (grow as user types)
- Enter key: send message + clear textarea
- Shift+Enter: newline (don't send)
- Paperclip button: dispatch setMsgShowFileModal(true)
- Send button: console.log message (TODO: wire to API)
- Send button disabled if empty

**Expected size:** ~150 lines

### Step 4: Update Sidebar.tsx
- Change `<MessagesPanel />` to `<ChannelList />`
- Verify routing works

### Step 5: Update MainApp.tsx
- Change `<MessagingView />` to `<MessageThread />`
- Verify routing works

### Step 6: Test Integration
- Click "Messaging" in LeftNav
- Verify ChannelList appears on left
- Click channel/DM → MessageThread loads with messages
- Type in compose bar → send button enables
- Enter key sends, Shift+Enter newlines
- Paperclip opens file upload modal

## Styling Notes

**Colors & Spacing (from DESIGN_HANDOFF.md):**
- Section headers: 10px 600 uppercase --r-t3
- Channel/DM rows: padding 7px 8px, radius 6px
- Selected: var(--r-sel) background, var(--r-t1) text
- Message sender: 12px 600, timestamp 11px
- Message body: 13.5px, line-height 1.6
- Compose bar height: ~48px (textarea + padding)

**Icons:**
- Channels: `#` prefix in text
- Online indicator: small colored dot (emoji or CSS circle)
- Paperclip: 📎 emoji or SVG
- Send: ➜ or arrow SVG

## Known Limitations / TODOs

1. **Message Sending:** ComposeBar just console.logs
   - TODO: POST to /api/messages/send
   - TODO: Add message to customChanMsgs optimistically
   - TODO: Clear textarea on success

2. **Real-time Updates:** Messages don't auto-load
   - TODO: Listen on WebSocket for new messages
   - TODO: Append to customChanMsgs on receive

3. **Online Status:** Hardcoded dot
   - TODO: Sync from WebSocket presence events

4. **Unread Badges:** Not tracked per channel
   - TODO: Track unread count per channel in AppContext
   - TODO: Reset on view channel

5. **Message Grouping:** Simple consecutive-sender grouping
   - TODO: Better UX (avatar + name once per group, not every message)

6. **Attachments:** File upload modal created, not wired
   - TODO: Handle file upload in compose bar
   - TODO: Show attachment preview in compose

## File Checklist

### New Files to Create
- [ ] `src/client/components/ChannelList.tsx` (280px secondary panel)
- [ ] `src/client/components/MessageThread.tsx` (main content area)
- [ ] `src/client/components/ComposeBar.tsx` (bottom compose widget)

### Files to Modify
- [ ] `src/client/components/Sidebar.tsx` (route to ChannelList)
- [ ] `src/client/components/MainApp.tsx` (route to MessageThread)

### Tests/Verification
- [ ] TypeScript strict mode passes
- [ ] Biome linting clean
- [ ] Click messaging section
- [ ] Select channel/DM
- [ ] Type message + send
- [ ] Paperclip opens file modal

## Session Start Checklist

When starting fresh:

1. ✅ Read this file (you are here)
2. ⬜ Verify current git status: `git log --oneline -3`
   - Should see `f2d74a8 Docs & Memory Update...`
3. ⬜ Review DESIGN_HANDOFF.md lines 108-126 for spec
4. ⬜ Check AppContext state fields exist (all do)
5. ⬜ Review data.ts for MSG_CHANNELS, MSG_DMS
6. ⬜ Create ChannelList.tsx
7. ⬜ Create MessageThread.tsx
8. ⬜ Create ComposeBar.tsx
9. ⬜ Update Sidebar.tsx + MainApp.tsx
10. ⬜ Test integration (select messaging, click channels/DMs)
11. ⬜ Update memory + commit

## Related Memory Files

- [[phase2_inbox_complete.md]] — Phase 2 components (similar patterns)
- [[design_handoff_implementation.md]] — Full 8-phase roadmap
- [[fullstack_architecture.md]] — Architecture & routing
- [[commit_workflow.md]] — How to commit changes

---

**Next Session: Start from this checklist, follow Step 1-6, test, commit.**

*Created: 2026-06-28 — Ready for Phase 3 implementation*
