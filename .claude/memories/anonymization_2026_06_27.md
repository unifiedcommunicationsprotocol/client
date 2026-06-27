---
name: anonymization_2026_06_27
description: Anonymized git home directory constraint to remove user-specific paths
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c09ed31f-68c0-4ffb-868b-cde13d4f3dd7
---

# Anonymization of Constraints — 2026-06-27

## Change
Removed user-specific paths from documentation while keeping constraint enforcement intact.

**Before:** Documentation explicitly mentioned `/home/erik`, `/home/erik/Code`, etc.
**After:** Generic references — `home directory (~)`, `parent directories`, `project root`

## Files Updated
- `docs/constraints.md` — Critical Environment Constraint section
- `docs/llm.md` — Hard Constraints > Environment subsection

## Rationale
- Keeps project docs shareable/forkable without revealing user directory structure
- Constraint remains enforceable (I know the actual boundaries)
- Future users/contributors don't need user's specific paths to understand the rule

## Principle for Future Work
When documenting constraints, security procedures, or operational guidelines:
- Use relative terms when possible (`project root`, `home directory`)
- Avoid absolute paths that identify the user's environment
- Documentation should be portable across different setups
- Remember: I have the context; docs don't need the specifics
