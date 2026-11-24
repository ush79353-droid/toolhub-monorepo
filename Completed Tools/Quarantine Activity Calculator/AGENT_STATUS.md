DEVELOPED — Mongo pending — Developer B (Cursor)
Module: frontend/src/tools/calculators/quarantine-activity/ → QuarantineActivityCalculator
No FX. Tests: npx tsx …/calculation.test.ts → ok.

Commits:
- UI: 511e4b87 (module shell / stub calc; labeled “UI and engine” prematurely)
- Engine: 17df9bfe (Mifflin–St Jeor × Omni PAL + MET deltas; full assert tests)
- Cleanup note: 8c719f38 removed accidental calculation.engine-draft.ts
- Registry (out of Phase-1 session scope): 49d700e0 by another process

Scope (ADR-023): Sex/age/height/weight; Work/Home/Exercises → PAL 1.2–2.4; maintenance kcal/day; ≤3 removed + ≤3 added MET activities. Not clinical isolation date windows.

Blockers: Mongo assign blocked by session. Parent “date arithmetic” wording ignored — screenshot is PAL/MET energy only.

Temporary files cleaned: YES
