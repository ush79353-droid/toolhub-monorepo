---
trigger: always_on
description: "Three-commit delivery for Omega Calculators (UI, engine, registration; ADR-019)."
---

# Calculator Git commits (Antigravity)

ADR-019. This rule does not change ADR-016 (Auto Loan visual shell) or ADR-018 (calculator module).

For every successfully developed calculator, use exactly **three meaningful commits**:

1. **UI** — Calculator UI, components, fields, and layout (form/results presentation, `detail.tsx` shell, shared shell reuse). No registry/sitemap/Mongo activation in this commit.
2. **Engine** — Calculation formulas, validation, results wiring, tests, and Phase 2 FX integration where applicable. No empty commit when FX is not used — ship formulas/validation/results only.
3. **Registration & cleanup** — Frontend/backend registration (`keys.ts`, `registry/index.ts`, `registry/details.ts`, `tool.key.ts`), sitemap, authorized MongoDB `tool:assign` / activation, SEO, Brain docs (`CURRENT_STATE.md`, `TASKS.md`, `CHANGELOG.md`, and any ADR), temporary-file cleanup, and final delivery cleanup. Always last.

Rules:

- Exactly three commits per completed calculator. Never create empty, duplicate, padded, or artificial commits.
- If development is skipped or blocked, do not create unnecessary commits.
- Do not register a calculator key or activate Mongo before the UI and engine commits exist for that tool.
- Stage only files belonging to the current calculator/task. Never include colleague changes or unrelated files.
- Delete temporary files created during the task (ADR-025) before the final commit.
- After commits, **do not auto-push** unless the user explicitly asks in that request; the operator may sync GitHub manually. Never force-push or rewrite shared history.
- The delivery report lists all three commit hashes separately and the checks run (note local-only vs pushed when applicable).

Non-calculator work keeps its Brain update in the same commit as the code it describes.
