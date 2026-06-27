**Governance:**
- [Memory Governance](memory_governance.md) — Only use project-local .claude/memories/, never home directory; version control is source of truth

**Specification & Architecture:**
- [UCP/1.0 Specification Summary](ucp_specification_summary.md) — Complete overview of transport, encryption, messages, AI, preferences, and bridge
- [Tech Stack Update](tech_stack_2026_06_27.md) — Hono, Zod, Drizzle, Docker Compose with PostgreSQL 18+; all latest versions

**Project Documentation:**
- [Spec Sync Gaps](spec_sync_gaps.md) — 15 documented gaps between local docs and spec; priorities for updates
- [Docs Updated](docs_update_2026_06_27.md) — All critical gaps fixed; Phase 1 checklist expanded with binding strings, timing, caching
- [Anonymization](anonymization_2026_06_27.md) — Removed user-specific paths; use relative terms like project root, home directory

**Frontend Implementation:**
- [Relay Frontend v1.0](relay_frontend_v1.md) — Desktop UI complete, Biome + TypeScript 7 integrated, 4 violations to fix before crypto layer
