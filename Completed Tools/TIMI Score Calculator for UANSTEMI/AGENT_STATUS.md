# AGENT STATUS — TIMI Score Calculator for UANSTEMI

**Status:** DEVELOPED — Phase 1 UI+Engine (Mongo blocked this session)  
**Claimed by:** Developer B (Cursor)  
**Date:** 2026-11-24

## Module

`frontend/src/tools/calculators/timi-uanstemi/` → `TimiUanstemiCalculator`

## Commits

- **UI:** `0b517e61` — calculator shell; seven No/Yes Antman factors; ADR-016 visuals; engine stubs; no registry
- **Engine:** `da33c365` — Antman JAMA 2000 scoring; TIMI 11B 14-day composite table; 0–1 display rounds to 5%; self-check; No FX

## Tests

`cd frontend && npx tsx src/tools/calculators/timi-uanstemi/calculation.test.ts` → **ok**

## Scope (ADR-023)

Screenshot seven factors (all default No): age ≥65; ≥3 CAD risk factors; known CAD stenosis ≥50%; ASA past 7 days; ≥2 angina in 24 h; EKG/ST deviation ≥0.5 mm; positive cardiac marker. Score 0–7 with educational 14-day composite risk copy. No FX.

## Blockers / notes

- **Mongo blocked** (session) — no `tool:assign`.
- Phase 1 asked **no registry**; later commit `a756ebc4` registered TIMI UA/NSTEMI outside this agent’s Phase 1 scope (not this session’s push).
- No push/fetch/pull (session policy).

## Temporary files cleaned

YES
