# AGENT STATUS — Keto Calculator

**Status:** DEVELOPED — Mongo pending  
**Claimed by:** cursor-composer-keto (Developer B / Cursor)  
**Date:** 2026-11-24

## Commits (ADR-019)
1. **UI** `d763e7af81db00bbd224a0de2b96c6eca65e1300` — Add Keto Calculator UI.
2. **Engine** `0e063ae7ed7f7afd3469efc01a3d90c76b888424` — Add Keto Calculator engine and finish results wiring.
3. **Registration** `1bf1914773ae6539631b9deb24221d9185abd95f` — batched by parallel agent (Katch-McArdle + Keto + Lidocaine). **Out of Phase-1 scope for this claim** (session asked UI+Engine only).

## Checks
- `npx tsx src/tools/calculators/keto/calculation.test.ts` → **ok**
- Fixture: 2,000 kcal @ 75/5/20 → 1,500 / 100 / 400 kcal · ≈166.7 / 25 / 100 g
- Invalid macro totals rejected

## Module
`frontend/src/tools/calculators/keto/` → `KetoCalculator`  
No FX. Screenshot-first: details/goal + expandable Fats/Carbs/Proteins.

## Sources
- Mifflin–St Jeor × PAL
- JAMA 2020 / UK MKD teaching: 75% fat · 5% carb · 20% protein
- Atwater 9 / 4 / 4 kcal/g
- Normal ±500 / Strict ±1,000 kcal/day

## Blockers
- **Mongo `tool:assign` blocked** (session + Atlas) — catalog undeveloped/inactive until assign retries.
- No push/fetch/pull this session.

## Temporary files cleaned
YES
