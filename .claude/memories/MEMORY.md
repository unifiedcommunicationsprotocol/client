**🎉 ALL 11 PHASES COMPLETE — PRODUCTION READY:**
- [All Phases Complete](all_phases_complete.md) — Complete UCP Client implementation with 178/178 tests, 0 errors, full E2E data flow
- [Session Status — Complete](session_status.md) — Final implementation status: Tailwind + SVG icons, production-ready
- [Tailwind Conversion Complete](tailwind_conversion_complete.md) — All 44 components (100%) converted from inline CSS to Tailwind classes
- [Emoji-to-SVG Replacement Complete](emoji_to_svg_replacement.md) — All emojis removed and replaced with SVG icons from Icon component (100% coverage)

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

**Current Work (Phase 7 — COMPLETE ✅):**
- [Phase 7 Complete](phase7_complete.md) — Database setup ✅, API routes ✅, UI integration ✅ (4/4 components wired), real-time ready ✅

**Design Handoff Implementation (All 8 Phases Complete):**
- [Design Handoff Implementation](design_handoff_implementation.md) — 8-phase systematic plan to match UI 1:1 with design
- [Phase 1 Layout Shell Complete](phase1_complete.md) — 3-column layout, 6-section nav, dark/light mode
- [Phase 2 Inbox Complete](phase2_inbox_complete.md) — Email threads, reply/forward, file upload modal
- [Phase 3 Messaging Complete](phase3_complete.md) — Channels, DMs, real-time compose bar
- [Phase 4 Notes Complete](phase4_complete.md) — ProseMirror rich editor, 8 toolbar buttons, auto-save
- [Phase 5 Calendar Complete](phase5_complete.md) — Week/month views, time grid, event cards
- [Phase 6 Contacts & Agents Complete](phase6_complete.md) — Contact profiles, agent grid, activity log
- [Phase 7 Settings Complete](phase7_complete.md) — Identity, Keys (UCP critical), email bridges
- [Phase 8 Onboarding Complete](phase8_complete.md) — **FINAL PHASE**: 3-step signup modal, crypto ready

**Frontend Implementation:**
- [Relay Frontend v1.0](relay_frontend_v1.md) — Desktop UI complete, Biome + TypeScript 7 integrated
- [Design System Complete](relay_design_complete.md) — 3-column layout, CSS variables, dark/light mode, semantic colors

**Architecture & System:**
- [Full-Stack Architecture v2.0](fullstack_architecture.md) — Bun serve() + Hono API + Drizzle DB (PostgreSQL)
- [Component Tree](component_tree.md) — 38+ components, hierarchical organization, integration points

**Configuration & Constraints:**
- [Biome Immutable](biome_immutable.md) — Do NOT modify biome.jsonc; all changes require explicit user approval
- [SVG Icon Rendering Issue](svg_icon_issue.md) — Navigation icons display as dots (design verified)
