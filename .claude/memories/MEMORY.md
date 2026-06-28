**🚀 START HERE:**
- [Session Status](session_status.md) — Current status, what's done, what's next, quick reference

**Governance & Workflow:**
- [Memory Governance](memory_governance.md) — Only use project-local .claude/memories/, never home directory; version control is source of truth
- [Commit Workflow](commit_workflow.md) — ALWAYS update docs + memory BEFORE creating commits; keeps project coherent
- [Functional & Immutable](functional_immutable.md) — const only, no classes, closures + HOFs, pure functions
- [Server Cheat Code](server_cheatcode.md) — Read-only access to ../server for API/auth reference

**Specification & Architecture:**
- [UCP/1.0 Specification Summary](ucp_specification_summary.md) — Complete overview of transport, encryption, messages, AI, preferences, and bridge
- [Tech Stack Update](tech_stack_2026_06_27.md) — Hono, Zod, Drizzle, Docker Compose with PostgreSQL 18+; all latest versions

**Project Documentation:**
- [Spec Sync Gaps](spec_sync_gaps.md) — 15 documented gaps between local docs and spec; priorities for updates
- [Docs Updated](docs_update_2026_06_27.md) — All critical gaps fixed; Phase 1 checklist expanded with binding strings, timing, caching
- [Anonymization](anonymization_2026_06_27.md) — Removed user-specific paths; use relative terms like project root, home directory
- [Phase 2 Inbox Complete](phase2_inbox_complete.md) — InboxThreadList, ThreadDetail, ComposeArea, FileUploadModal implemented; ready for Phase 3

**Frontend Implementation:**
- [Relay Frontend v1.0](relay_frontend_v1.md) — Desktop UI complete, Biome + TypeScript 7 integrated
- [Phase 2 Inbox Complete](phase2_inbox_complete.md) — InboxThreadList, ThreadDetail, ComposeArea, FileUploadModal; full documentation

**Phase Implementation:**
- [Design Handoff Implementation](design_handoff_implementation.md) — 8-phase systematic plan to match UI 1:1 with design
- [Phase 1 Crypto Complete](phase1_crypto_complete.md) — WebSocket transport, Ed25519 signing, identity resolution
- [Phase 3 Messaging Complete](phase3_complete.md) — ChannelList, MessageThread, ComposeBar fully integrated
- [Phase 4 Notes Complete](phase4_complete.md) — ProseMirror rich editor, toolbar, real-time autosave
- [Phase 5 Calendar Complete](phase5_complete.md) — Week/Month views, time grid, event cards
- [Phase 6 Contacts & Agents Complete](phase6_complete.md) — Contact profiles, agent grid, activity log
- [Phase 7 Settings Complete](phase7_complete.md) — **JUST FINISHED**: Identity, Keys (UCP critical), bridge stubs

**Architecture & System:**
- [Full-Stack Architecture v2.0](fullstack_architecture.md) — Bun serve() + Hono API + Drizzle DB (PostgreSQL)
- [Relay UI Design Complete](relay_design_complete.md) — 3-column layout, color system, onboarding flow

**Configuration & Constraints:**
- [Biome Immutable](biome_immutable.md) — Do NOT modify biome.jsonc; all changes require explicit user approval
- [SVG Icon Rendering Issue](svg_icon_issue.md) — Navigation icons display as dots (design verified)
- [Commit Workflow](commit_workflow.md) — Update memory/docs BEFORE committing
- [Functional & Immutable](functional_immutable.md) — const only, no classes, pure functions
