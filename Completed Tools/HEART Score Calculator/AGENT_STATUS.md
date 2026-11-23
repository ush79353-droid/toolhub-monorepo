# AGENT STATUS — HEART Score Calculator

**Status:** COMPLETED  
**Claimed by:** cursor-composer-continuous-20261123-223255-bilal  
**Date:** 2026-11-23

## Tool identity

| Field | Value |
| :--- | :--- |
| Name | HEART Score Calculator |
| Slug | `heart-score-calculator` |
| `componentKey` | `HeartScoreCalculator` |
| Folder | `frontend/src/tools/calculators/heart-score/` |

## Mongo (before → after)

| Field | Before | After |
| :--- | :--- | :--- |
| `_id` | `6af46f10a27d8d1d4e99023f` | `6af46f10a27d8d1d4e99023f` |
| `slug` | `heart-score-calculator` | `heart-score-calculator` |
| `componentKey` | *(empty)* | `HeartScoreCalculator` |
| `isDeveloped` | `false` | `true` |
| `isActive` | `false` | `true` |
| `indexable` | `false` | `false` (preserved) |
| `pillar` / `subPillar` | `null` / `null` | `null` / `null` |

## Blockers

None.

## Commits (local only — no push)

1. `6e791af7` — UI  
2. `c81530e5` — engine + tests  
3. *(pending — registration/Brain this commit)*

## Verification

- `npx tsx src/tools/calculators/heart-score/calculation.test.ts` → **ok**
- `npm run tool:assign` with `--set-active` → **ok**
- `npx tsx src/modules/tools/tool.key.ts` → **tool.key ok**
- `backend` `npm run build` → **ok**
- Temporary files cleaned: **YES**

## Formula source

Six AJ et al. Neth Heart J 2008; Backus BE et al. Crit Pathw Cardiol 2013. Age &lt;45/45–64/≥65; five components 0–2; no ED disposition text.