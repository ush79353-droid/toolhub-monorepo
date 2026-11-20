# AGENT STATUS — DEVELOPED

- **Status:** DEVELOPED (moved to Completed Tools)
- **Updated:** 2026-11-20 (repair pass — correct screenshot + official tax data)

## Resolution

1. Correct calculator screenshot restored (`Screenshot 2026-11-20 Florida Sales Tax Calculator.png`). Incorrect Finance & Renewals sidebar preserved as `Screenshot 2026-11-19 164436.incorrect-finance-renewals-sidebar.png`.
2. County discretionary surtax: Florida DOR Form DR-15DSS R. 11/25 (Calendar Year 2026).
3. ZIP→county: U.S. Census Bureau 2020 ZCTA→county relationship (Florida FIPS `12*`). Multi-county ZIPs require explicit county selection.
4. State rate 6%; discretionary surtax base capped at $5,000 (single-item assumption disclosed).

## Catalog

- slug: `florida-sales-tax-calculator`
- id: `6af46f0fa27d8d1d4e990028`
- `componentKey`: `FloridaSalesTaxCalculator`
- `isDeveloped` / `isActive`: true; `indexable`: false

## Commits

1. `41c7d638` — UI
2. `cdce4997` — verified tax lookup
3. `49904891` — registration / Mongo / Brain

