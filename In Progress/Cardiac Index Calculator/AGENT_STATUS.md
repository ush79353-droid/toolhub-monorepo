# AGENT STATUS — Cardiac Index Calculator

**Status:** DEVELOPED — Mongo activation pending/retry if Atlas blocks  
**Claimed by:** cursor-composer-continuous-session-b-20261123-223333  
**Date:** 2026-11-23

## Module

- `frontend/src/tools/calculators/cardiac-index/`
- componentKey: `CardiacIndexCalculator`
- slug: `cardiac-index-calculator`
- Mongo `_id`: `6af46f10a27d8d1d4e99022d`

## Commits

- UI: `90eca006`
- Engine: absorbed into concurrent `2d9696d7` (arterial-age engine commit)
- Registration/Brain: pending this session’s reg commit

## Blocker (activation only)

- `npm run tool:assign` hit MongoDB Atlas server selection / IP whitelist errors on first attempts.
- Code + registry are complete. Re-run assign with `--set-active` when Atlas is reachable; preserve `indexable: false`.

## Scope shipped

- Yes: CO L/min + height/weight → CI = CO / Mosteller BSA (unrounded BSA).
- No: Fick Hb + arterial/venous sat/tension; estimated VO₂ = 125 × BSA when blank.
- Branch switch clears obsolete inputs. Share URL-only. No FX.
