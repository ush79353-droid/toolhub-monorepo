# OmegaCalculators — Phase 3 Currency Conversion | Batch 14 of 21

**Execute this file ONLY after user approval.** This is Batch 14, with 5 implementation targets. Do not start another batch automatically.

## Exact audited batch targets (original audit indices 66–70)

1. **Lerner Index Calculator** — `lerner-index-calculator`; 2 selector(s); audit location: `frontend/src/tools/calculators/lerner-index/LernerIndexForm.tsx`.
2. **Liquid Net Worth Calculator** — `liquid-net-worth-calculator`; 1 selector(s); audit location: `frontend/src/tools/calculators/liquid-net-worth/LiquidNetWorthForm.tsx`.
3. **Man-Hours Calculator** — `man-hours-calculator`; 3 selector(s); audit location: `frontend/src/tools/calculators/man-hours/ManHoursForm.tsx`.
4. **Online Marketing Conversion Calculator** — `online-marketing-conversion-calculator`; 1 selector(s); audit location: `frontend/src/tools/calculators/online-marketing-conversion/...Form.tsx` (audit path is abbreviated; locate actual file).
5. **Operating Asset Turnover Calculator** — `operating-asset-turnover-calculator`; 1 selector(s); audit location: `frontend/src/tools/calculators/operating-asset-turnover/...Form.tsx` (audit path is abbreviated; locate actual file).

## Calculator-specific financial integrity checks

- **Lerner Index**: Normalize selling price and marginal cost; Lerner index must remain invariant.
- **Liquid Net Worth**: Normalize liquid assets and liabilities before subtraction; support negative net-worth outcomes.
- **Man-Hours**: Keep monetary wage/compensation inputs converted while preserving worker counts, hours and productivity results.
- **Online Marketing Conversion**: Convert ad spend, order value and marketing revenue; keep visits/leads/conversion percentages unchanged.
- **Operating Asset Turnover**: Normalize net revenue and operating assets; turnover ratio should remain invariant.

## Successful pilot + shared infrastructure

Use the **already user-verified Margin Interest pilot** as the behavioural reference, not as a module to modify.

Reuse existing Phase 2 code only: `frontend/src/tools/shared/{convert-currency.ts,money-value.ts,useConvertibleMoney.ts,currency-rates.ts,CurrencyRatesProvider.tsx}`, server loader `frontend/src/server/currency/rates.ts`, and existing Express `GET /api/v1/currency/rates?base=USD`. Use **existing** rate direction: `amount × rates[target] / rates[source]`. No new provider/DB table/hardcoded or browser→Express FX requests.

### Conversion contract

- A currency selection must convert the **actual money amount**, not just its symbol. Preserve the existing input/result selector structure: independent currencies only **where the existing UI has the controls**; do not add currency selectors.
- If the UI offers several currencies across money fields, convert and normalize inputs to a common calculation currency **before** financial maths, then convert monetary results into their chosen display currencies. Changing only a result currency must never change an input amount or underlying result.
- Canonical values remain unrounded; **convert first, round only for display**. Changing PKR→USD→PKR must not create drift or double-convert; edits after FX switching must work correctly.
- Keep ratios, percentages, rates, dates, counts, crypto/physical quantities and terms unconverted. Preserve calculations, labels, defaults, modes, dynamic fields, charts, styling and existing OmegaCalculators design.
- If a monetary formula changes when only currency labels change, fix normalization rather than altering its mathematical definition. Preserve negative monetary amounts and cash-flow signs.
- Missing/invalid FX rates: **block only the attempted conversion** and show a clear unavailable state; never swap symbols silently or assume 1:1. Rates older than 48h: retain existing stale-rate warning and transparently allow stored-snapshot conversion. Do not claim the rate is live.
- Reuse existing conditional Next.js loader/provider wiring for **approved slugs only**. If wiring is missing, apply the smallest conditional extension without affecting any other tool. Do **not** globally change shared `CurrencySelect`, calculator registries, database activation, or sitemap.

### Ownership and scope

Modify ONLY the calculator modules listed as **work targets** in this file, minimal conditional rate-provider wiring if strictly necessary, and `brain/CURRENCY_CONVERSION_PROGRESS.md`. Leave colleague-owned calculators, earlier batches, and unrelated tools untouched. Check ownership/evidence and report conflicts instead of editing uncertain modules. No new fields, page redesign, SEO changes, global regex replacements or unrelated refactoring.

### Read progress before making changes

Read `brain/CURRENCY_CONVERSION_PROGRESS.md` and preserve all 105 original audit-target rows and previous statuses. If earlier batches are incomplete, **report** them; do not repair them under this batch. Do not label an unverified integration as complete.

### Efficient process and validation

Inspect the listed modules and monetary calculation paths; make narrow changes; perform lightweight **static** review of modified call sites and conversion/normalization flows only. Do not run browser/Playwright, automated tests, lint, typecheck, builds or heavy QA. User will manually compare with the reference website. State explicitly what was **not** tested.

### Local Git + tracking (mandatory)

1. Make a local commit containing **only implemented calculator/provider changes**: `fix(currency): integrate conversion batch 14 calculators`. If no implementation changes were completed, do not create a misleading implementation commit.
2. Update `brain/CURRENCY_CONVERSION_PROGRESS.md` with each listed tool's actual status (Complete / Pending / Blocked), this batch number, the exact calculator-code commit hash (or N/A), manual check **Pending** unless user explicitly confirmed it, and blockers. Preserve past batches and the 105-row audit baseline.
3. Commit only the updated tracking document in a **separate local documentation commit**: `docs(currency): track conversion batch 14`. This two-commit order lets the tracker contain the real implementation commit hash.
4. **DO NOT PUSH, PULL, SYNC, OR MODIFY ANY OTHER REPO BRANCH.**

### Required final answer

**Currency Conversion Batch 14/21** — list every target with Complete/Pending/Blocked; count completed and blocked; record calculator-code commit hash, tracking commit hash, stale/missing rate blockers, and **Manual QA: pending**. Confirm no other calculators were modified. **STOP after this batch; await explicit approval for the next.**

