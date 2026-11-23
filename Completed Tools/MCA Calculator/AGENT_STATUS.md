# AGENT STATUS — MCA Calculator

**Status:** COMPLETED  
**Claimed by:** cursor-composer-subagent-20261123  
**Date:** 2026-11-23

## Mongo (before → after)

| Field | Before | After |
| :--- | :--- | :--- |
| `_id` | `6af46f10a27d8d1d4e99021d` | `6af46f10a27d8d1d4e99021d` |
| `slug` | `mca-calculator` | `mca-calculator` |
| `componentKey` | *(empty)* | `McaCalculator` |
| `isDeveloped` | `false` | `true` |
| `isActive` | `false` | `true` |
| `indexable` | `false` | `false` (preserved) |
| `pillar` / `subPillar` | `null` / `null` | `null` / `null` |

## Clinical sources

- Singleton medians: Mari G et al. N Engl J Med 2000;342:9-14 (Table as in Mari G. Ultrasound Obstet Gynecol 2005;25:323-330). Screenshot fixture 14 w → **19.3** cm/s verified.
- Twin medians: O'Gorman N et al. Ultrasound Obstet Gynecol 2009 MCDA 50th-centile table weeks **15–37** only. Weeks 14 and 38–40 show gap notice; no discordance or 1.5 MoM anemia thresholds.

## Commits (local only, no push)

Listed in delivery report after `git commit`.

## Verification

- `npx tsx src/tools/calculators/mca/calculation.test.ts` → **ok**
- `npm run tool:assign` with `--set-active` → **ok**
- `npx tsx src/modules/tools/tool.key.ts` → **tool.key ok**
- Temporary files cleaned: **YES**

## Blockers

None.