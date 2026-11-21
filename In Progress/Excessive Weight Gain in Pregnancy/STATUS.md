# BLOCKED — 2026-11-22 (engine ready)

**Owner:** Cursor continuous agent  
**Status:** BLOCKED on thin UI only (engine unblocked)

## Blocker

Prompt requires reusing the **Pregnancy Weight Gain Calculator** engine without a duplicate catalog/engine path. That shared engine now exists at:

`frontend/src/tools/calculators/pregnancy-weight-gain/calculation.ts`

(`computeGestationalGainBounds`, singleton week model, twin term bands). Pregnancy Weight Gain Calculator is registered/activated (`PregnancyWeightGainCalculator`, slug `pregnancy-weight-gain-calculator`, Mongo `6af46f10a27d8d1d4e9901f2`).

Remaining work for this tool: screenshot-scoped thin UI (pre-pregnancy height/weight → BMI; week default 40; twins **No/Yes radios**; min/max weight and gain; no current-weight / excess classification) on catalog row `6af46f10a27d8d1d4e9901f0` / `excessive-weight-gain-in-pregnancy`, plus registry/activation. Not completed in the PWG delivery session.

## Mongo

- `_id`: `6af46f10a27d8d1d4e9901f0`
- `slug`: `excessive-weight-gain-in-pregnancy`
- pillar: `6af451c1a27d8d1d4e98f983`
- subPillar: null
- undeveloped / inactive / indexable false (do not activate without the thin UI module)

## Next step

Implement Excessive as a thin calculator module importing `pregnancy-weight-gain/calculation.ts`, then `tool:assign` with `--set-active` preserving indexable.
