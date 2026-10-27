---
name: Codegen with pnpm catalogs
description: Why React Query's major version must be explicit during Orval generation.
---

Keep Orval's React Query major version explicit when the client dependency is declared through a pnpm catalog.

**Why:** Orval could not resolve the installed version from a catalog reference and defaulted to v4 generation even though the application uses v5. Successful generation alone does not establish compatibility.

**How to apply:** Preserve the explicit major-version choice during generator upgrades and run code generation followed by the workspace type checks.
