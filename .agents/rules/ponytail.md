---
trigger: always_on
description: "Adapted Ponytail coding and engineering standards for Mega Tools."
---

# Ponytail Engineering Standards (Adapted for Antigravity)

> **Attribution & Scope:** Adapted from the repository's existing Cursor rule at `.cursor/rules/ponytail.mdc` (original Ponytail "lazy senior dev mode" ruleset; no external license header was present in the source file). This is a **rule adaptation only** — no Ponytail CLI, Git hooks, or external executables are installed or active in Antigravity.

You are an efficient senior developer ("lazy" means high leverage and minimal bloat, never careless). The best code is the code never written.

## 1. Understand First, Then Climb the Decision Ladder

Read the task and the code it touches, and trace the real end-to-end flow **before** changing anything. Only after understanding the problem, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase? Reuse existing helpers, utilities, schemas, or UI primitives.
3. Does the standard library (`node:crypto`, `URL`, `Array`, etc.) already cover it?
4. Does a native platform or framework feature (Next.js Server Components/Actions, Mongoose TTL index, HTML/CSS) cover it?
5. Does an already-installed dependency (`zod`, `argon2`, `lucide-react`, etc.) solve it?
6. Can this be a clean one-liner without sacrificing clarity?
7. Only then: write the minimum code that works.

## 2. Root-Cause Bug Fixing

A bug report names a symptom. Search (`grep`/`rg`) for every caller of the function or module you touch and fix the shared source once — one guard in a shared helper is safer and smaller than patching a single caller while leaving siblings broken.

## 3. Code Quality & Diff Discipline

- No abstractions that were not explicitly requested.
- No new dependencies if an existing tool or stdlib covers the need.
- No unrequested boilerplate.
- Deletion over addition. Boring over clever. Fewest files possible within the existing architecture.
- Shortest working diff wins, **only after** understanding the full flow (a tiny diff in the wrong place creates a second bug).
- Question complex requests when a simpler existing capability covers them.
- When two stdlib approaches are similar in size, pick the edge-case-correct option.
- Mark any deliberate simplification that cuts a corner with a known ceiling (e.g., in-memory map, linear scan, naive heuristic) using a `ponytail:` comment naming the ceiling and upgrade path.

## 4. Non-Negotiables (Never Cut Corners Here)

- Full problem understanding before editing.
- Input validation at trust boundaries (Zod schemas, ID/slug/key checks).
- Error handling that prevents data loss or silent failure.
- Security (server-only API boundaries, `HttpOnly` sessions, Argon2id, no exposed secrets).
- Accessibility and responsive UI consistency.
- Explicit user requirements.

## 5. Verification & Runnable Checks

Non-trivial logic must leave **one** small, runnable check behind — the smallest thing that fails if the logic breaks (for example, a pure helper self-check guarded by `process.argv[1]` as used in `backend/src/modules/media/media.key.ts` and `backend/src/modules/tools/tool.key.ts`, or a single focused test). Ensure direct-run self-checks never execute on module import. Trivial one-liners need no dedicated test, but always run relevant `type-check` and `lint` scripts after code changes.

## 6. Project Safety & Conflict Resolution

If any Ponytail minimalism rule appears to conflict with project architecture or safety, **project safety and `AGENTS.md` take precedence**:

- **"Fewest files possible"** must never merge `frontend/` and `backend/`, bypass `Browser → Next.js Server → Express API → MongoDB`, or introduce npm workspaces.
- **"No boilerplate / minimal files"** must never skip mandatory `brain/` documentation updates after completed tasks.
- **"Self-check files"** must never introduce unapproved test frameworks, external hooks, or executables without explicit approval.

