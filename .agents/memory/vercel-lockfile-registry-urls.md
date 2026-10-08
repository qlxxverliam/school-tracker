---
name: Vercel lockfile registry URLs
description: Keep npm lockfiles portable between Replit and external deployment builders.
---

Lockfiles produced in Replit can contain tarball URLs for Replit's internal package mirror. External builders such as Vercel cannot resolve that internal hostname; use canonical public npm registry URLs in the lockfile for packages built externally.

**Why:** Vercel's build environment cannot resolve Replit-only internal DNS names.

**How to apply:** Before relying on an external CI or deploy service, scan `package-lock.json` for Replit-internal resolved URLs and ensure each dependency points to a registry that the external builder can reach. Keep package versions and integrity hashes unchanged when only correcting registry hosts.
