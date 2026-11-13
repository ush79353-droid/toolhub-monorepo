---
trigger: always_on
description: "Shared Project Brain workflow, architecture boundaries, and multi-developer Git rules for Mega Tools (Omega Calculators)."
---

# Mega Tools / Omega Calculators — Shared Project Brain Rule

Follow the shared repository instructions in root `AGENTS.md` on every task.

## Mandatory Workflow

- **Before coding:** Read `brain/README.md`, `brain/CURRENT_STATE.md`, `brain/ARCHITECTURE.md`, and the `brain/` document(s) relevant to your task. Inspect the actual source files and check `git status` before making assumptions.
- **After completing a task:** Run relevant verification (`npm run type-check`, `npm run lint`, and targeted checks), update affected `brain/` documents (`CURRENT_STATE.md`, `TASKS.md`, `CHANGELOG.md`, `DECISIONS.md` if applicable, plus any affected domain docs). Non-calculator work keeps that Brain update in the same commit. New calculators follow ADR-019 (`.agents/rules/git-commits.md`): milestone commits, then a closing Brain commit, pushed together.

## Non-Negotiable Architecture & Safety Guards

- Keep `frontend/` (Next.js App Router) and `backend/` (Express + MongoDB) as **two independent applications** with no npm workspaces.
- Enforce `Browser → Next.js Server → Express API → MongoDB`. Browser components must never call Express directly or read `API_INTERNAL_URL`.
- Preserve the locked palette and UI patterns documented in `brain/DESIGN_SYSTEM.md`.
- New calculators follow `brain/ARCHITECTURE.md` §7 and the checklist in `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`. Page design stays `brain/TOOL_DETAIL_PAGE_STANDARDS.md`.
- Maintain strict TypeScript (`strict: true`) and never invent APIs, models, or completed features that are not verified in code.
- Never commit `.env`, `.env.local`, credentials, or secrets, and never force push or overwrite another developer's work. Sync Brain updates via `git fetch` / `git pull` and resolve conflicts explicitly.

