# OmegaCalculators — Phase 3 Currency Conversion | Batch 17 of 21

**Execute this file ONLY after user approval.** This is Batch 17, with 4 implementation targets plus 1 already-verified pilot (read-only). Do not start another batch automatically.

## Exact audited batch targets (original audit indices 81–85)

1. **Software Contract Value Calculator** — `software-contract-value-calculator`; 1 selector(s); audit location: `frontend/src/tools/calculators/software-contract-value/...Form.tsx` (audit path is abbreviated; locate actual file).
2. **Website Ad Revenue Calculator** — `website-ad-revenue-calculator`; 2 selector(s); audit location: `frontend/src/tools/calculators/website-ad-revenue/WebsiteAdRevenueForm.tsx`.
3. **YouTube Money Calculator** — `youtube-money-calculator`; 3 selector(s); audit location: `frontend/src/tools/calculators/youtube-money/YoutubeMoneyForm.tsx`.
4. **Jensen's Alpha Calculator** — `jensens-alpha-calculator`; 2 selector(s); audit location: `frontend/src/tools/calculators/jensens-alpha/JensensAlphaForm.tsx`.
5. **Margin Interest Calculator** — `margin-interest-calculator`; 1 selector(s); audit location: `frontend/src/tools/calculators/margin-interest/MarginInterestForm.tsx`.

## Calculator-specific financial integrity checks

- **Software Contract Value**: Convert contract values, recurring payments and total contract value; preserve term and billing periods.
- **Website Ad Revenue**: Convert ad revenue, RPM/CPM and monetary totals; preserve traffic volume.
- **YouTube Money**: Convert YouTube revenue, CPM/RPM estimates and monetary results; do not convert view counts.
- **Jensen's Alpha**: Normalize beginning/ending portfolio values and compute portfolio return/alpha without FX-induced false outperformance.

### Pilot exception — MUST NOT edit Margin Interest

The **Margin Interest Calculator** (`margin-interest-calculator`, audit item #85) already has successful independently selectable input/result currency conversion and **was manually compared with the reference website**. It is included only to preserve audit numbering. **Do not change or re-commit its code**. Confirm its existing tracker status; if the tracker lacks a pilot row, add an accurate pilot reference without double-counting. Thus this batch has **4 implementation targets + 1 audit-only pilot**, not 5 new implementations.

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

1. Make a local commit containing **only implemented calculator/provider changes**: `fix(currency): integrate conversion batch 17 calculators`. If no implementation changes were completed, do not create a misleading implementation commit.
2. Update `brain/CURRENCY_CONVERSION_PROGRESS.md` with each listed tool's actual status (Complete / Pending / Blocked), this batch number, the exact calculator-code commit hash (or N/A), manual check **Pending** unless user explicitly confirmed it, and blockers. Preserve past batches and the 105-row audit baseline.
3. Commit only the updated tracking document in a **separate local documentation commit**: `docs(currency): track conversion batch 17`. This two-commit order lets the tracker contain the real implementation commit hash.
4. **DO NOT PUSH, PULL, SYNC, OR MODIFY ANY OTHER REPO BRANCH.**

### Required final answer

**Currency Conversion Batch 17/21** — list every target with Complete/Pending/Blocked; count completed and blocked; record calculator-code commit hash, tracking commit hash, stale/missing rate blockers, and **Manual QA: pending**. Confirm no other calculators were modified. **STOP after this batch; await explicit approval for the next.**

