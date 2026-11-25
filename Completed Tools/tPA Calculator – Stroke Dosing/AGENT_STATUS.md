# AGENT STATUS — tPA Calculator – Stroke Dosing

**Status:** DEVELOPED — Mongo pending
**Claimed by:** Developer B (Cursor)
**Date:** 2026-11-24

## Scope
- Module: `frontend/src/tools/calculators/tpa-stroke/`
- componentKey: `TpaStrokeCalculator`
- FDA/DailyMed Activase (alteplase) AIS: 0.9 mg/kg ≤ 90 mg; 10% bolus / 90% infusion — **No FX**

## Commits
- UI: `0d05c40d` — Add tPA Stroke Dosing Calculator UI shell
- Engine: `5551a638` — Add tPA Stroke Dosing engine from FDA/DailyMed Activase AIS labeling
- Registry: `2f5652b5` — Register tPA Stroke Dosing and Vitamin D calculators (landed outside Phase-1-only session auth; Mongo still blocked)

## Checks
- `npx tsx src/tools/calculators/tpa-stroke/calculation.test.ts` → **ok**

## Blockers
- Mongo assign blocked (session / Atlas)
- Activation / `tool:assign` not run this session

## Temporary files cleaned
YES
