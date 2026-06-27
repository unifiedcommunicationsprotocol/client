---
name: commit_workflow
description: Always update docs and memory BEFORE creating commits; essential pattern
metadata:
  type: feedback
---

## Commit Workflow: Update Docs + Memory First

**Rule:** Before creating ANY commit, update docs and memory to reflect changes.

**Why:** 
- Docs are the source of truth for current implementation status
- Memory ensures future sessions have full context without re-reading everything
- Prevents drift between code state and documentation
- Makes commit messages short; details go in docs/memory

**How to Apply (Every Commit):**

1. **Update docs/** — Reflects implementation progress
   - `IMPLEMENTATION.md`: Status section, checklist of done/pending
   - `architecture.md`: System design changes
   - Feature docs: If new subsystem, create `feature-name.md`

2. **Update `.claude/memories/MEMORY.md` index** — Points to all relevant memories
   - Keep entries under ~150 chars
   - Include date if status-dependent (e.g., "Tech Stack 2026-06-27")

3. **Update or create relevant memory file** — Captures non-obvious context
   - If major feature: new memory file in `.claude/memories/`
   - If refinement: update existing memory
   - Use frontmatter format: `---\nname: kebab-case\ndescription: one-line\nmetadata:\n  type: feedback/project/reference\n---`

4. **THEN create commit** — Keep message brief, details in docs
   - Commit message: Why + what (1-2 sentences)
   - Reference docs in commit: "See docs/IMPLEMENTATION.md for details"
   - Use signature: `Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>`

## Example Workflow

```bash
# 1. Make code changes
# 2. Update docs/IMPLEMENTATION.md (status, checklist)
# 3. Create/update .claude/memories/feature-name.md
# 4. Update .claude/memories/MEMORY.md index
# 5. Run: bun run lint && bun run typecheck
# 6. Create commit with full context

git add -A
git commit -m "$(cat <<'EOF'
Implement feature X with state management

- Action 1
- Action 2
- Wired to all 6 sections

See docs/IMPLEMENTATION.md for status.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_...
EOF
)"
```

## Current Status Example

After interactive MVP completion:
- Updated `docs/IMPLEMENTATION.md` — Status now shows v1.0 Interactive MVP
- Updated `relay_frontend_v1.md` — Added "Interactive Implementation Complete" section
- Commit message focused on design alignment fixes

**Future commits must follow this pattern to keep project state coherent.**
