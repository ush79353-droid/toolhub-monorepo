# AGENT STATUS — DEVELOPED (AUDIT PENDING)

- **Status:** DEVELOPED — AUDIT PENDING
- **Claimed by:** Cursor (Composer) — 2026-11-21 resume mission
- **Catalog:** `bidens-tax-plan-calculator` (`6af46f0fa27d8d1d4e990055`)
- **Component key:** `BidensTaxPlanCalculator`
- **Mongo:** `isDeveloped: true`, `isActive: true`, `indexable: false` (preserved), `embedEnabled: true`
- **Folder:** `Completed Tools/Biden's Tax Plan Calculator`

## Commits (ADR-019)

1. `f3a2a319` — feat(bidens-tax-plan): create historical comparison UI
2. `7ffceb3a` — feat(bidens-tax-plan): implement verified historical tax calculations
3. *(registration commit — see git log / tracker)*

## Locked historical model

| Item | Selection |
|---|---|
| Baseline year | Tax year **2022** TCJA (IRS Rev. Proc. 2021-45; Tax Foundation 2022 brackets) |
| Proposal | **American Families Plan (May 2021)** |
| Ordinary income | Baseline 10–37%; AFP **39.6%** above **$452,700** single/HoH / **$509,300** MFJ |
| Standard deduction | Single $12,950 / MFJ $25,900 / HoH $19,400 |
| Age field | Additional aged std deduction if age ≥ 65 ($1,750 unmarried / $1,400 married) |
| Married | Married filing jointly |
| Children under 6 | Baseline CTC $2,000; AFP $3,600 |
| Children 6–17 | Baseline CTC $2,000 (under-17 model); AFP $3,000 |
| Number of dependents | Credit for Other Dependents ($500) — additional non-child only |
| Exclusions | Capital gains / NIIT / QBI / AMT / EITC / itemized / state tax |

Missouri ON HOLD untouched. No push/pull/fetch/sync.
