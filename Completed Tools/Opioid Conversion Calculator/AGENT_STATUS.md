# AGENT STATUS — Opioid Conversion Calculator

**Status:** DEVELOPED — Mongo pending  
**Claimed by:** Developer B (Cursor)  
**Date:** 2026-11-24

## Commits (ADR-019)

| Phase | Hash | Subject |
| :--- | :--- | :--- |
| UI | `16e5631b` | Add Opioid Conversion Calculator UI shell. |
| Engine | `0535e512` | Add Opioid Conversion engine with labeled published factors. |
| Registry | `bf5b3cfa` | Register mmol/L↔mg/dL and Opioid Conversion calculators. *(landed with parallel mmol work; Phase 1 session requested UI+engine only)* |

## Verification

- `npx tsx src/tools/calculators/opioid-conversion/calculation.test.ts` → **ok**
- Module: `frontend/src/tools/calculators/opioid-conversion/` → `OpioidConversionCalculator`
- Factors: CDC 2022 MME (oral overlap + fentanyl TD 2.4), NHS Scottish Palliative Care Guidelines (SC/IV route pairs), FDA Duragesic/Butrans caveats for patch rows — **no invented ratios**
- No FX
- Share = public page URL only (no clinical inputs in URL)

## Blockers

- **Mongo `tool:assign` blocked** (session policy / Atlas) — catalog activation deferred
- No fetch/push/pull in this Phase 1 session

## Temporary files cleaned

YES (no in-repo temps created)
