# Levothyroxine Dosage Calculator — AGENT STATUS

**Status:** PARTIALLY_IMPLEMENTED — CLINICAL_REVIEW_BLOCKED  
**Agent:** cursor-composer-20261122020244-24028  
**MongoDB _id:** `6af46f10a27d8d1d4e9901d9`  
**Slug:** `levothyroxine-dosage-calculator`  
**componentKey:** (none — not registered/activated)  
**isDeveloped:** false · **isActive:** false · **indexable:** false (preserved)

## What shipped locally

- Screenshot UI shell (Personal information + Health conditions + empty mcg/day field + share/reload/clear/feedback).
- Engine returns only gated outcomes; **`doseMcgPerDay` always `null`**.
- FDA DailyMed SYNTHROID (2024-02-20) cited for educational label context only.

## Commits

1. UI: `3426381f`
2. Engine: `f3a6bb63`
3. Integration/activation: **not created** (clinical gate)

## Still blocked for activation

Specialist / clinical-approval package for individualized mcg/day prescribing is not present. No `tool:assign`, no registry wiring, no `isDeveloped`/`isActive` flip.

## References consulted

- DailyMed SYNTHROID setid `1e11ad30-1041-4520-10b0-8f9d30d30fcc` (updated 2024-02-20) — adult 1.6 mcg/kg/day full replacement; lower start if cardiac/geriatric; titrate on TSH or free-T4.
- FDA label 021402s038 Table 1 (same teaching).
