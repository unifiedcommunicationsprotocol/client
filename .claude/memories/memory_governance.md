---
name: memory_governance
description: Governance principle — only use project-local memories in .claude/memories/, never user home directory
metadata:
  type: feedback
---

# Memory Governance — Use Project-Local Only

## Rule

**Only reference and update memories in `.claude/memories/` (this repo). Never use `~/.claude-me/` (home directory) for project context.**

- ✅ **Source of truth:** `.claude/memories/MEMORY.md` and linked memory files
- ❌ **Do not use:** User home directory memories (`~/.claude-me/projects/...`)
- ✅ **When updating:** Commit memory changes to git so all contributors can access them
- ✅ **Persistence:** Project memories are version controlled and available in every clone

## Why

1. **Shared context** — Contributors cloning this repo need the project memories immediately
2. **Version control** — Memory changes are tracked like code changes
3. **Portability** — Project works on any machine without depending on user's home directory setup
4. **Clarity** — One source of truth (the repo) instead of multiple scattered memories

## Implementation

When working on this project:
1. Load memories from `.claude/memories/` (automatic on Claude Code session)
2. Update MEMORY.md index when adding new memories
3. Commit memory changes: `git add .claude/memories/` + commit
4. Never reference `~/.claude-me/` memories for this project

## Example Flow

```
Session start:
  → Load .claude/memories/MEMORY.md
  → Access context from linked files
  → Work on project

Making discoveries:
  → Update .claude/memories/new_finding.md
  → Update .claude/memories/MEMORY.md index
  → Commit: "Add memory: new_finding"

Next session:
  → Load .claude/memories/MEMORY.md (from git)
  → All context is available to the next contributor
```
