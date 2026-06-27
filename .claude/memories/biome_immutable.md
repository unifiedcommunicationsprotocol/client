---
name: biome_immutable
description: Biome configuration is immutable — do not modify it
metadata:
  type: feedback
---

**DO NOT modify biome.jsonc**

User has reset biome.jsonc to default. Any future changes to Biome configuration must be rejected with clear explanation.

**Why:** Strict linting/formatting is a core part of the project setup. Changes require explicit user approval.

**How to apply:** When tempted to fix Biome errors by modifying config, ask the user instead. Fix the code, not the linter.
