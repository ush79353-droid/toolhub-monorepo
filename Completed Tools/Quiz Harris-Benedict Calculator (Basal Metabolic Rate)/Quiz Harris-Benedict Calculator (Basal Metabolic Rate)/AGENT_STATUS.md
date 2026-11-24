# AGENT_STATUS — Quiz Harris-Benedict Calculator (Basal Metabolic Rate)

- Status: DEVELOPED — Phase 1 UI+ENG only (no registry / no Mongo / no push)
- Developer: B (Cursor)
- ComponentKey: QuizHarrisBenedictCalculator (not registered yet)
- Module: `frontend/src/tools/calculators/quiz-harris-benedict/`
- Slug (catalog expected): quiz-harris-benedict-calculator-basal-metabolic-rate (unverified — Mongo blocked)
- Commits:
  - UI: `b260d6bb` — Add Quiz Harris-Benedict Calculator UI shell.
  - ENG: `fec8f456` — Wire scoring via validation + shared BEE helpers.
- Note: `calculation.ts` / `validation.ts` / `calculation.test.ts` first appeared in race commit `674d01f1` (colleague REG for other tools); dedicated ENG wiring is `fec8f456`. Quiz key **not** in registry/`tool.key.ts`.
- Checks: `npx tsx src/tools/calculators/quiz-harris-benedict/calculation.test.ts` → ok (0/7, 7/7, change-one → 6; BEE `light_sedentary===1.2`; sex-specific HB differ)
- FX: none
- Mongo: BLOCKED this session (Phase 1)
- Registry: deferred (Phase 1)
- Temporary files cleaned: YES
