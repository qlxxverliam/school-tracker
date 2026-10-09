---
name: Vercel deployment
description: Preserve this project's Vercel hosting assumptions and lockfile portability.
---

This project is hosted on Vercel. Keep the app deployable as a regular Vite build, without relying on Replit-only runtime behavior. Lockfiles produced in Replit can contain tarball URLs for Replit's internal package mirror, which Vercel cannot resolve; use canonical public npm registry URLs for packages built externally.

**Why:** The user said this project is hosted on Vercel, and its builder cannot resolve Replit-only internal DNS names.

**How to apply:** Preserve the Vite build flow and avoid Replit-only production assumptions. Before external builds, scan `package-lock.json` for Replit-internal resolved URLs and ensure each dependency points to a reachable registry. Keep versions and integrity hashes unchanged when correcting registry hosts.
