# Levothyroxine Dosage Calculator — AGENT STATUS

**Status:** COMPLETE — APPROVED EDUCATIONAL SCOPE (healthy-adult teaching estimate; other branches gated)  
**Agent:** cursor-composer-20261122034000-levo  
**MongoDB _id:** `6af46f10a27d8d1d4e9901d9`  
**Slug:** `levothyroxine-dosage-calculator`  
**componentKey:** `LevothyroxineDosageCalculator`  
**isDeveloped:** true · **isActive:** true · **indexable:** false (preserved)  
**embedEnabled:** true

## Scope delivered

- Screenshot UI preserved (Personal information + Health conditions).
- Devine IBW utilities; dosing weight = min(actual, IBW).
- Educational mcg/day only for age 15–50 + FT4 Low + no heart disease + Devine-eligible height: `1.6 × dosingWeight`.
- Over 50 / heart disease / Normal FT4 / short height / missing inputs remain gated (no invented SCH/cardiac dose table).

## Commits

1. UI: `3426381f`
2. Engine (initial gate): `f3a6bb63`
3. Engine (Devine + teaching estimate): `9c515926` (bundled with ownership/tracker updates in that commit)
4. Integration: (this registration/Brain commit)

## Sources

- Omni: https://www.omnicalculator.com/health/levothyroxine-dosage
- DailyMed SYNTHROID setid `1e11ad30-1041-4520-10b0-8f9d30d30fcc` (updated 2024-02-20)
- Devine BJ (1974) IBW equations (pharmacy reference use; ≥60 in)
