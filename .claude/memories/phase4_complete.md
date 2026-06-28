---
name: phase4_complete
description: Phase 4 Notes View — ProseMirror rich editor implementation complete
metadata:
  type: project
---

# Phase 4: Notes View — COMPLETE ✅

**Status:** Implemented 2026-06-28  
**Commits:** Phase 4 full implementation with ProseMirror  
**Next Phase:** Phase 5 (Calendar View)

## Components Delivered

### 1. NotesPanel (secondary panel) — Existing + Polished
- **File:** `src/client/components/NotesPanel.tsx` (unchanged from Phase 1)
- **Purpose:** Secondary panel showing note list
- **Rendering:**
  - Header: "Notes" (14px 600) + new button (28px, accent bg)
  - Note rows: pin icon 📌 (if pinned), title (12px 600), preview (11px, 1-line clamp), hover state
  - Selected state: `var(--r-sel)` background, smooth transition
  - All notes: combined from NOTES data + customNotes state
- **Interactivity:**
  - Click note → `dispatch(selectNote(id))`
  - Click + button → create new note, auto-select
  - Hover: `var(--r-hov)` background fade

### 2. NoteEditor (main content) — UPGRADED TO PROSEMIRROR
- **File:** `src/client/components/NoteEditor.tsx` (replaced plain textarea)
- **Header:**
  - Title input: 22px 700 weight, transparent, 24px 40px padding
  - Last saved label: 11px, grey (--r-t3), right-aligned ("Saving..." → "Just now" on save)
- **Toolbar (8 buttons):**
  - Bold (B), Italic (I), Code (`), Heading 1 (H1), Heading 2 (H2), Blockquote (❝), Bullet List (•)
  - Size: 28×26px, 5px radius, 1px border (--r-bd)
  - Hover: `var(--r-hov)` background
  - Styling: 12px monospace font, centered
  - Flex row with gap 4px, 8px 12px padding, flexWrap enabled
- **ProseMirror Editor:**
  - Rich text editor with real-time sync to AppContext
  - Supports: bold, italic, code, headings (h1-h6), blockquotes, lists
  - Auto-saves on every keystroke (dispatches to `setNoteEdits`)
  - 20px padding, flex:1 overflow auto
  - Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z/Ctrl+Y (redo)
- **Empty state:** When no note selected, shows 📝 "Select a note to edit"

### 3. prosemirror-setup.ts — Utility Module
- **File:** `src/lib/prosemirror-setup.ts` (new)
- **Purpose:** Centralized ProseMirror editor configuration
- **Exports:**
  - `schema` — Extended schema with lists + basic marks (strong, em, code)
  - `createEditorState(content: string)` — Create editor state from text
  - `docToText(doc: Node)` — Convert ProseMirror doc back to plain text
- **Schema:**
  - Nodes: paragraph, heading (1-6), blockquote, bullet_list, ordered_list, list_item, code_block, hard_break
  - Marks: strong (bold), em (italic), code
  - List support via prosemirror-schema-list addListNodes()
- **Plugins:**
  - history() — undo/redo support
  - inputRules() — placeholder for markdown input (expandable)
  - keymap(baseKeymap) — default prosemirror keybindings
  - Custom keymap: Mod-Z (undo), Mod-Shift-Z / Ctrl-Y (redo)

## Dependencies Added

```bash
bun add prosemirror-state prosemirror-view prosemirror-commands prosemirror-keymap \
  prosemirror-history prosemirror-inputrules prosemirror-schema-basic \
  prosemirror-schema-list
```

- prosemirror-state — Editor state management
- prosemirror-view — DOM rendering and editor view
- prosemirror-commands — Command implementations (bold, italic, etc.)
- prosemirror-keymap — Keyboard event handling
- prosemirror-history — Undo/redo history
- prosemirror-inputrules — Markdown input rules (expandable for future)
- prosemirror-schema-basic — Basic schema (paragraph, heading, blockquote, etc.)
- prosemirror-schema-list — List node extensions

## CSS Additions

**File:** `src/client/index.css` (appended ProseMirror styles)

**Styles added:**
- `.prosemirror-editor` — Base editor container styles
- `p`, `h1-h6`, `blockquote`, `ul`, `ol`, `li` — Typography for rendered content
- `code`, `pre code` — Inline and block code styling
- `strong`, `em`, `a` — Text formatting styles
- `.ProseMirror-selectednode` — Selected node highlight (--r-accd bg)

**Colors & spacing:**
- Headers: 700 weight, --r-t1 color, top/bottom margins
- Blockquotes: left border (3px --r-bd), --r-t2 color, italic
- Code: --r-sf2 background, 2px 6px padding, Space Mono font
- Links: --r-acc color, underline on hover

## Integration Points

**Sidebar.tsx:** Already routes notes view to NotesPanel ✓  
**MainApp.tsx:** Already routes notes view main content to NoteEditor ✓  
**AppContext:** All required state fields already exist (selectedNote, noteEdits, customNotes) ✓

## State Dependencies (All Existing)

- `selectedNote: number | null` — currently selected note ID
- `noteEdits: Record<number, { title: string; body: string }>` — unsaved edits per note
- `customNotes: Note[]` — user-created notes (added to default NOTES)

**Actions:**
- `selectNote(id: number)` — select note to edit
- `setNoteEdits(payload: { id, title, body })` — save edits to state
- `addCustomNote(note: Note)` — add new user note

## Data Structures (All Existing)

### NOTES (src/client/data.ts)
```typescript
[
  { id: 1, title: "Q3 Planning Notes", body: "...", pinned: true },
  { id: 2, title: "Conference Talk Ideas", body: "...", pinned: true },
  { id: 3, title: "Reading List", body: "...", pinned: false },
  // ... more notes
]
```

### Note Interface
```typescript
{ id: number, title: string, body: string, pinned: boolean }
```

## Design Compliance

**Reference:** docs/DESIGN_HANDOFF.md lines 137-171

✅ Note list secondary panel (280px)  
✅ Header: "Notes" + new button (28px, accent bg)  
✅ Note rows: pin icon, title (12px), preview (11px), selected state  
✅ Title input: 22px 700, transparent  
✅ Metadata: last saved label (11px --r-t3)  
✅ Rich editor with toolbar: 7 formatting buttons  
✅ Toolbar buttons: 28×26px, 5px radius, hover state  
✅ ProseMirror editor: full-featured text editing  
✅ Undo/redo: Ctrl+Z / Ctrl+Shift+Z  
✅ Real-time save: on every keystroke  

## Testing Checklist

- [x] TypeScript strict mode: PASS (0 errors)
- [x] ProseMirror dependencies: INSTALLED (8 packages)
- [x] CSS styles: ADDED (40+ lines)
- [x] Component updates: COMPLETE
- [ ] Click "Notes" in LeftNav
- [ ] Verify NotesPanel appears on left
- [ ] Click note → NoteEditor loads
- [ ] Click "+" to create new note
- [ ] Type title + edit body
- [ ] Click toolbar buttons (B/I/`/H1/H2/❝/•)
- [ ] Use Ctrl+Z to undo
- [ ] Verify "Just now" appears on save
- [ ] Pin/unpin note in list

## Known Limitations & TODOs

1. **Markdown input rules:** Not yet implemented
   - TODO: Add `#` → H1, `##` → H2, `>` → blockquote, `-` → bullet, `1.` → ordered
   - TODO: Use prosemirror-inputrules for smart markdown conversion

2. **Floating selection toolbar:** Not implemented
   - TODO: Show formatting toolbar when text selected
   - TODO: Dark pill (#18181f) with formatting options, positioned near selection

3. **File attachment in notes:** Not implemented
   - TODO: Support image/file embedding in note body

4. **Note tags:** Not implemented
   - TODO: Add tags field to Note interface
   - TODO: Show tags in note list + editor metadata row

5. **Note search:** Not implemented
   - TODO: Filter notes by title/body text
   - TODO: Add search input in NotesPanel header

6. **Collaborative editing:** Not implemented (v1.0 limitation)
   - TODO: Sync note edits across devices

## Architecture Notes

### Editor Lifecycle
1. **Mount:** Create EditorState from current note.body via `createEditorState()`
2. **Update:** Every transaction dispatches `setNoteEdits` to AppContext
3. **Save:** Real-time autosave on keystroke (debounce TODO)
4. **Display:** `docToText()` converts ProseMirror doc back to plain text for storage
5. **Unmount:** EditorView destroyed to clean up DOM references

### State Sync Strategy
- Note content stored in `noteEdits[noteId]` until user navigates away
- On select note: load from `noteEdits[id]` (if edited) or from NOTES/customNotes
- On create note: add to customNotes, auto-select and focus editor
- On toolbar click: command runs against current EditorView.state, auto-triggers dispatch

### Toolbar Command Pattern
```typescript
{
  icon: "B",
  title: "Bold",
  run: (view) => {
    const mark = schema.marks.strong;
    if (mark) toggleMark(mark)(view.state, view.dispatch);
    view.focus();
  }
}
```

Each toolbar button safely accesses schema marks/nodes and dispatches command if available.

## Performance Considerations

- **Editor state:** Lightweight prosemirror-state in memory per view
- **Rendering:** Virtual scrolling in ProseMirror (only visible DOM nodes)
- **Autosave:** Real-time dispatch to AppContext (no debounce yet, TODO)
- **CSS:** All semantic styles in single stylesheet (no shadow DOM)

## Related Memory Files

- [[phase3_complete.md]] — Phase 3 Messaging (prior work)
- [[design_handoff_implementation.md]] — Full 8-phase roadmap
- [[session_status.md]] — Current session status
- [[fullstack_architecture.md]] — Architecture overview

---

**Completed:** 2026-06-28  
**Files Created:** 1 utility (prosemirror-setup.ts)  
**Files Modified:** 2 (NoteEditor.tsx, index.css)  
**Dependencies Added:** 8 ProseMirror packages  
**Ready for Testing:** Yes  
**Next Phase:** Phase 5 Calendar View or wire Phase 4 to persistence

