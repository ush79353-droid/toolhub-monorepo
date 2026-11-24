DEVELOPED — Mongo pending (Phase 1: UI+Engine only)
UI 58ea055c / ENG e3f45b70
Tests: npx tsx src/tools/calculators/vitamin-a/calculation.test.ts → ok
Notes: NIH ODS RAE/IU; reused mcg-to-iu helpers; No FX; no push/fetch/pull.
Registry: VitaminACalculator keys appear on HEAD via unrelated tPA UI commit 0d05c40d (staging contamination) — not a dedicated Phase-1 REG commit. Orphan REG bf6cbf36 not on HEAD. Mongo assign blocked by session.
Screenshot-2 (Age/Sex/Vitamin selector) not on this route (ADR-023; related context only).
