### 2026-11-17 — Salary Calculator With Overtime (Screenshot-First + FX)
- **Summary:** Shipped Salary Calculator With Overtime on existing catalog slug `salary-calculator-with-overtime` (`SalaryWithOvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb8`). Collapsible Regular worktime + Overtime; In total; Share/Reload/Clear/feedback. Defaults hours/month. Activated.
- **Formulas:** OT hourly = regular hourly × multiplier; regular monthly = hourly × weekly hours × 52/12; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Blank OT hours → 0. Duration/rate/frequency units normalize without mixing quantities.
- **FX:** Independent currencies on all monetary selectors; compute in regular-pay currency at full precision; re-express results; display rounding only. Hours, time units, and multiplier never convert. Stale/missing rate handling via `CURRENCY_CONVERSION_SLUGS`.
- **Example:** 500/hr × 160 hr/month × 1.5 × 20 OT hr/month → OT rate 750; regular 80,000; OT 15,000; total 95,000.
- **Important Files:** `frontend/src/tools/calculators/salary-with-overtime/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-salary-with-overtime-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Gross Rent Multiplier Calculator (Screenshot-First + FX)
- **Summary:** Shipped Gross Rent Multiplier Calculator on existing catalog slug `gross-rent-multiplier-calculator` (`GrossRentMultiplierCalculator`, catalog `6af46f0fa27d8d1d4e98ffbc`). Three screenshot fields: property price, gross rental income (mo/yr), dimensionless GRM. Share/Reload/Clear/feedback. Activated.
- **Formulas:** GRM = property price ÷ annual gross rental income. Monthly income ×12. Require positive income; safe zero/invalid guards. Display e.g. `11.76` without currency.
- **FX:** Independent currencies on price + income; normalize into property-price currency before division so currency-only changes do not alter GRM. Period never FX-converted. `CURRENCY_CONVERSION_SLUGS` + stale/missing handling.
- **Example:** 1,000,000 / 85,000 yr → GRM ≈ 11.76.
- **Important Files:** `frontend/src/tools/calculators/gross-rent-multiplier/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-gross-rent-multiplier-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Overtime Paycheck Calculator (Screenshot-First + FX)
- **Summary:** Shipped Overtime Paycheck Calculator on existing catalog slug `overtime-paycheck-calculator` (`OvertimePaycheckCalculator`, catalog `6af46f0fa27d8d1d4e98ffb7`). Collapsible Regular work time + Overtime; In total; Share/Reload/Clear/feedback. Activated. Distinct from `overtime-calculator`.
- **Formulas:** OT hourly = regular hourly × multiplier; regular monthly = hourly × weekly hours × 52/12; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Blank OT hours → 0. Duration/rate/frequency units normalize without mixing quantities. No tax/withholding fields.
- **FX:** Independent currencies on all monetary selectors; compute in regular-pay currency at full precision; re-express results; display rounding only. Hours, time units, and multiplier never convert. Stale/missing rate handling via `CURRENCY_CONVERSION_SLUGS`.
- **Example:** 20/hr × 40 hr/week × 1.5 × 10 OT hr/month → OT rate 30; regular ≈ 3,466.67; OT 300; total ≈ 3,766.67.
- **Important Files:** `frontend/src/tools/calculators/overtime-paycheck/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-overtime-paycheck-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped Overtime Calculator on existing catalog slug `overtime-calculator` (`OvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb1`). Collapsible Regular work time + Overtime; In total; Share/Reload/Clear/feedback. Activated.
- **Formulas:** OT hourly = regular hourly × multiplier; regular monthly = hourly × weekly hours × 52/12; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Duration/rate/frequency units normalize without mixing hourly/weekly/monthly quantities.
- **FX:** Independent currencies on all monetary selectors; compute in regular-pay currency at full precision; re-express results; display rounding only. Hours, time units, and multiplier never convert. Stale/missing rate handling via `CURRENCY_CONVERSION_SLUGS`.
- **Example:** 500/hr × 40 hr/week × 1.5 × 20 OT hr/month → OT rate 750; regular ≈ 86,666.67; OT 15,000; total ≈ 101,666.67.
- **Important Files:** `frontend/src/tools/calculators/overtime/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-overtime-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Georgia Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped Georgia Overtime Calculator on existing catalog slug `georgia-overtime-calculator` (`GeorgiaOvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb4`). Regular work time + overtime + in-total sections; Share/Reload/Clear/feedback. Activated.
- **Formulas:** Regular monthly = hourly × weekly hours × 52/12; OT hourly = hourly × multiplier; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Unit normalization for rate/duration/frequency; blank OT hours → 0; negative pay/hours rejected.
- **FX:** Independent currencies on all money selectors; normalize into regular-pay currency at full precision; display rounding only. Hours, time units, and multiplier never convert. Stale/missing rate handling via `CURRENCY_CONVERSION_SLUGS`.
- **Legal:** Estimate only — does not claim Georgia/FLSA eligibility or workweek compliance.
- **Example:** 20/hr × 40 hr/week × 1.5 × 10 OT hr/month → regular ≈ 3,466.67; OT rate 30; OT pay 300; total ≈ 3,766.67.
- **Important Files:** `frontend/src/tools/calculators/georgia-overtime/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-georgia-overtime-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — California Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped California Overtime Calculator on existing catalog slug `california-overtime-calculator` (`CaliforniaOvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb2`). Collapsible Regular work time + Overtime; In total; Share/Reload/Clear/feedback. Activated.
- **Formulas:** Regular Monthly = Hourly × Weekly Hours × 52/12; OT Rate = Hourly × Multiplier; OT Pay = OT Rate × OT Hours/month; Total = Regular + OT. Blank OT hours → 0. Unit selectors normalize pay/time. Does **not** model daily OT, double time, or seventh-day rules — not a legal-compliance claim.
- **FX:** Independent currencies on regular pay + four money results; math in regular-pay currency; result selectors re-express only. Hours/units/multiplier never FX-convert. `CURRENCY_CONVERSION_SLUGS` + stale/missing handling.
- **Example:** 20/hr × 40 hr/week × 1.5 × 10 OT hr/month → regular ≈ 3,466.67; OT rate 30; OT pay 300; total ≈ 3,766.67.
- **Important Files:** `frontend/src/tools/calculators/california-overtime/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-california-overtime-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Variable Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Variable Annuity Calculator on existing catalog slug `variable-annuity-calculator` (`VariableAnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffb0`). Final-balance mode; starting balance, ages/length sync, contribution, payment frequency, due/ordinary, return, compounding, contribution growth; tax section (US federal / Single); results summary + table. Share/Reload/Clear/feedback. Activated.
- **Formulas:** `i = (1+r/m)^(m/q)−1`; growing-annuity FV for contributions; due ×(1+i). Example: 10,000 + 100/mo due / 12% yearly compound / 35y → ≈ 1,079,079.31 before tax; 420 contributions; total contributed 42,000.
- **Tax:** Year-by-year tax on investment gains using published IRS TY2024 Single ordinary brackets (Rev. Proc. 2023-34); brackets inflate with inflation; income grows with stated rate. Not Omni’s proprietary taxable model — may differ from third-party screenshots. No invented brackets.
- **FX:** Independent currencies on starting balance, contribution, and annual income; normalize into starting-balance currency. Rates/ages/durations never convert.
- **Important Files:** `frontend/src/tools/calculators/variable-annuity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-variable-annuity-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Pretax self-check matched screenshot. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Florida Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped Florida Overtime Calculator on existing catalog slug `florida-overtime-calculator` (`FloridaOvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb3`). Collapsible Regular work time + Overtime sections; In total; Share/Reload/Clear/feedback. Activated.
- **Formulas:** Regular monthly = hourly × weekly hours × 52/12; OT hourly = regular hourly × multiplier; monthly OT = OT hourly × monthly OT hours; total = regular + OT. Blank OT hours treated as zero. Unit selectors normalize pay/time. Does not invent daily overtime rules or claim statutory compliance.
- **FX:** Independent currencies on regular pay + four money results; normalize into regular-pay currency for math; result selectors re-express only. Hours/units/multiplier never convert. `CURRENCY_CONVERSION_SLUGS` + stale/missing handling.
- **Example:** 20/hr × 40 hr/week × 1.5 × 10 OT hr/month → regular ≈ 3,466.67; OT rate 30; OT pay 300; total ≈ 3,766.67.
- **Important Files:** `frontend/src/tools/calculators/florida-overtime/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-florida-overtime-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Colleague `overtime/` WIP left untouched. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Immediate Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Immediate Annuity Calculator on existing catalog slug `immediate-annuity-calculator` (`ImmediateAnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffad`). Five solve modes (withdraw default, invest, duration, rate, remain); payment frequency; beginning/end timing; start date; optional compounding; optional remaining balance + withdrawal growth; yearly schedule; independent Phase 2 FX. Activated.
- **Formulas:** Reuses shared annuity engine — period rate `i = (1 + r/m)^(m/q) − 1` (default m = payment frequency); ordinary/due withdrawal schedule; inverse solves for PV/PMT/n/r/FV; totals and last withdrawal date from full-precision schedule.
- **FX:** Independent currencies on amount to invest, withdrawal amount, and optional remaining balance; normalize into invest currency before solving. Rates, lengths, growth percents, and dates never convert. Stale/missing rate handling via `CURRENCY_CONVERSION_SLUGS`.
- **Example:** 100,000 PKR / 10y / 1.5% / monthly / beginning → PMT ≈ 896.79; 120 withdrawals; total ≈ 107,615.28; return ≈ 7,615.28.
- **Important Files:** `frontend/src/tools/calculators/immediate-annuity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-immediate-annuity-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Math self-check ≈ Omni. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Growing Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Growing Annuity Calculator on existing catalog slug `growing-annuity-calculator` (`GrowingAnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffac`). Solve PV/FV/payment; deposit/withdrawal; ordinary/due; growth; independent Phase 2 FX. Activated.
- **Formulas:** `i = (1 + r/m)^(m/q) − 1`; `g = (1 + G)^(1/q) − 1`; period schedule due/ordinary; total payments geometric sum; total return = FV − opening − net contributions.
- **FX:** Independent currencies on initial deposit, annuity amount, target FV; normalize into initial-deposit currency. Rates/dates/frequencies/counts never convert.
- **Example:** 0 / 1,000/mo due / 6y / 5% / 3% growth → FV ≈ 91,514.60; deposits ≈ 78,682.51; return ≈ 12,832.09.
- **Important Files:** `frontend/src/tools/calculators/growing-annuity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-growing-annuity-tool.ts`, `brain/*`.
- **Verification:** Catalog undeveloped before coding. MongoDB activated. Lint/builds/tests omitted per user. No push.

### 2026-11-17 — Deferred Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Deferred Annuity Calculator on existing catalog slug `deferred-annuity-calculator` (`DeferredAnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffaa`). Know mode default how-much-I-can-withdraw; advanced checkbox; deferral until date (or period when advanced); lump sum + monthly contribution; accumulation/payout rates; payout length yrs/mos. Results summary + table (balance at first withdrawal, monthly/total withdrawal, contribution, return, count, last date). Share/Reload/Clear/feedback. Activated.
- **Formulas:** Ordinary monthly `r = annual%/1200`. Accumulation `FV = PV(1+r)^n + PMT*((1+r)^n-1)/r`. Withdrawal `PMT = FV*r/(1-(1+r)^(-m))`. Total contribution = monthly deposits only; total return = withdrawals − lump − deposits. Zero-rate and impossible-payout guards.
- **FX:** Independent currencies on lump sum, monthly contribution, and (duration-mode) withdrawal amount; normalize into lump currency before math (Margin Interest / Phase 2). Rates/dates/durations never convert. `CURRENCY_CONVERSION_SLUGS` + stale/missing handling.
- **Example:** 20,000 + 500/mo · defer 180 months · 1.5%/1.5% · 20y payout → monthly withdrawal ≈ 607.53; balance ≈ 125,901.64.
- **Important Files:** `frontend/src/tools/calculators/deferred-annuity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-deferred-annuity-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated (`isDeveloped`/`isActive`/`indexable`). Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

# Development Changelog (`CHANGELOG.md`)

> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.

### 2026-11-17 — Texas Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped Texas Overtime Calculator on existing catalog slug `texas-overtime-calculator` (`TexasOvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb9`). Regular work time + overtime + in-total sections; unit selectors; Share/Reload/Clear/feedback. Activated.
- **Formulas:** Regular monthly = hourly × weekly hours × 52/12; OT hourly = hourly × multiplier; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Pay/time unit normalization via weekly schedule.
- **FX:** Independent currencies on regular pay and each pay result (Margin Interest / Florida OT pattern). Hours and multiplier never convert. `CURRENCY_CONVERSION_SLUGS` + stale/missing handling.
- **Example:** 20/hr · 40 hrs/week · 1.5× · 10 OT hrs/month → regular ≈ 3,466.67; OT 300; total ≈ 3,766.67.
- **Important Files:** `frontend/src/tools/calculators/texas-overtime/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-texas-overtime-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/tests omitted per user. No push.


### 2026-11-17 — Illinois Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped Illinois Overtime Calculator on existing catalog slug `illinois-overtime-calculator` (`IllinoisOvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb5`). Sections: Regular work time, Overtime, In total. Defaults 40 hours/week and 1.5× multiplier. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Regular monthly = hourly × weekly hours × 52/12; OT hourly = hourly × multiplier; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Time-unit conversions supported; blank OT hours = 0.
- **FX:** Independent currencies on regular pay and all money result fields (Margin Interest / Phase 2). Normalize compute in regular-pay currency; rates/hours/multiplier never convert. `CURRENCY_CONVERSION_SLUGS` + stale/missing handling.
- **Example:** 20/hr · 40 hr/week · 1.5× · 10 OT hr/month → regular ≈ 3,466.67; OT rate 30; OT pay 300; total ≈ 3,766.67.
- **Important Files:** `frontend/src/tools/calculators/illinois-overtime/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-illinois-overtime-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.
### 2026-11-17 — Present Value of Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Present Value of Annuity Calculator on existing catalog slug `present-value-of-annuity-calculator` (`PresentValueOfAnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffaf`). Ordinary/due, frequencies, growth section, independent FX. Activated.
- **Formulas:** i = (1+r/m)^(m/q)−1; n = round(years×q); ordinary PV = PMT×(1−(1+i)^(−n))/i; due ×(1+i); growing closed forms when g ≠ 0.
- **FX:** Independent currencies on payment + present value via shared Mongo rates. Rates/term/frequencies/growth never convert.
- **Example:** 100 @ 5% / 3y yearly ordinary → ≈ 272.32; due ≈ 285.94.
- **Important Files:** `frontend/src/tools/calculators/present-value-of-annuity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-present-value-of-annuity-tool.ts`, `brain/*`.
- **Verification:** Catalog undeveloped before coding. MongoDB activated. Lint/builds/tests omitted per user. No push.


### 2026-11-17 — Annuity Payout Calculator (Screenshot-First + FX)
- **Summary:** Shipped Annuity Payout Calculator on existing catalog slug `annuity-payout-calculator` (`AnnuityPayoutCalculator`, catalog `6af46f0fa27d8d1d4e98ffa9`). Modes: fixed length (default) and fixed payment. Main specs: initial balance, payout frequency, ordinary/due, length or payment, annuity rate; checkbox unlocks compounding, final balance, and annual growth. Narrative results for withdrawal, duration, total interest, and applicable final balance. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Default period rate `r = (1+i)^(1/k)−1`; with compounding `r = (1+i/m)^(m/k)−1`. Ordinary level payout `PMT = PV × r / (1 − (1+r)^(-n))`; due divides by `(1+r)`; `r = 0` → `PV/n`. Growing annuity closed form when growth ≠ 0. Total interest from the withdrawal schedule. Fixed-payment mode solves period count to the target final balance.
- **FX:** Independent currencies on initial balance, fixed-payment amount, and final balance (Margin Interest / Phase 2). Normalize payment and final into the initial-balance currency before solving. Rates, lengths, and frequencies never convert. Stale/missing rate handling reused via `CURRENCY_CONVERSION_SLUGS`.
- **Example:** 100,000 PKR / 6% / 10 years / monthly / ordinary → payment ≈ 1,102.24; total interest ≈ 32,268.83.
- **Important Files:** `frontend/src/tools/calculators/annuity-payout/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-annuity-payout-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Math self-check matched screenshot. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

---

### 2026-11-17 — New York Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped New York Overtime Calculator on existing catalog slug `new-york-overtime-calculator` (`NewYorkOvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb6`). Regular work time + overtime + in-total sections; Share/Reload/Clear/feedback. Activated.
- **Formulas:** Regular monthly = hourly × weekly hours × 52/12; OT hourly = hourly × multiplier; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Unit normalization for rate/duration/frequency; blank OT hours → 0; negative pay/hours rejected.
- **FX:** Independent currencies on all money selectors; normalize into regular-pay currency at full precision; display rounding only. Hours, time units, and multiplier never convert. Stale/missing rate handling via `CURRENCY_CONVERSION_SLUGS`.
- **Legal:** Estimate only — does not claim New York/FLSA eligibility or workweek compliance.
- **Example:** 20/hr × 40 hr/week × 1.5 × 10 OT hr/month → regular ≈ 3,466.67; OT rate 30; OT pay 300; total ≈ 3,766.67.
- **Important Files:** `frontend/src/tools/calculators/new-york-overtime/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-new-york-overtime-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Margin and VAT Calculator (Screenshot-First + FX)
- **Summary:** Shipped Margin and VAT Calculator on existing catalog slug `margin-and-vat-calculator` (`MarginAndVatCalculator`, catalog `6af46f0fa27d8d1d4e98ffa2`). Eight screenshot fields: VAT %, net cost, gross cost, margin %, markup %, my net price, my gross price, profit. Last-edited driver sync; margin/markup pins for price-from-cost. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Gross = Net × (1+VAT/100); inverse Net = Gross ÷ (1+VAT/100); Profit = Net price − Net cost; Margin = Profit/Net price×100; Markup = Profit/Net cost×100; Net price = Net cost/(1−Margin/100) or Net cost×(1+Markup/100).
- **FX:** Independent currencies on five money selectors (Margin Interest / LTV pattern). Normalize into net-cost currency before math; re-express derived money per field currency. VAT/margin/markup never converted.
- **Example:** Net cost 100 / VAT 20% / margin 20% → gross cost 120, net price 125, gross price 150, profit 25, markup 25%.
- **Important Files:** `frontend/src/tools/calculators/margin-and-vat/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-margin-and-vat-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Annuity Calculator on existing catalog slug `annuity-calculator` (`AnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffa8`). Solve for initial deposit / final balance / annuity amount / time length / rate of return; deposit or withdrawal; ordinary or due; payment + compounding frequencies; start date; linked annual/periodic growth. Results summary + table (opening/final balance, periodic payment, totals, count, last payment date). Share/Reload/Clear/feedback. Activated.
- **Formulas:** Period rate `i = (1 + r/m)^(m/q) − 1`. Schedule-based FV for ordinary/due with optional growth; inverse modes via closed form or bisection. Dates from payment-period calendar math.
- **FX:** Independent currencies on initial deposit, annuity amount, and target final balance; normalize into initial-deposit currency. Rates/dates/durations never FX-converted.
- **Example:** 0 opening · 1,000 monthly due · 6y · 5% monthly compound · no growth → final ≈ 84,113.28; total deposits 72,000; return ≈ 12,113.28; last deposit Oct 17, 2032 from Nov 17, 2026 start.
- **Important Files:** `frontend/src/tools/calculators/annuity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-annuity-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped (`6af46f0fa27d8d1d4e98ffa8`). Screenshot math self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Future Value of Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Future Value of Annuity Calculator on existing catalog slug `future-value-of-annuity-calculator` (`FutureValueOfAnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffab`). Payment, interest rate, term yrs/mos, compounding/payment frequency, ordinary/due radios, future-value result; Advanced parameters: growth rate, number of periods, equivalent rates. Share/Reload/Clear/feedback. Activated.
- **Formulas:** i = (1+r/m)^(m/q)−1 (discrete) or e^(r/q)−1 (continuous); n = round(years×q). Ordinary FV = PMT×((1+i)^n−1)/i; due ×(1+i); zero interest FV = PMT×n; growing-annuity variants when g ≠ 0.
- **FX:** Independent currencies on payment and result; compute in payment currency then convert once. Rates/term/frequencies never convert.
- **Example:** 100 @ 5% / 3y yearly/yearly ordinary → 315.25; due → 331.0125.
- **Important Files:** `frontend/src/tools/calculators/future-value-of-annuity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-future-value-of-annuity-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Annuity Calculator on existing catalog slug `annuity-calculator` (`AnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffa8`). Solve for initial deposit / final balance / annuity amount / time length / rate of return; deposit or withdrawal; ordinary or due; payment + compounding frequencies; start date; linked annual/periodic growth. Results summary + table (opening/final balance, periodic payment, totals, count, last payment date). Share/Reload/Clear/feedback. Activated.
- **Formulas:** Period rate `i = (1 + r/m)^(m/q) − 1`. Schedule-based FV for ordinary/due with optional growth; inverse modes via closed form or bisection. Dates from payment-period calendar math.
- **FX:** Independent currencies on initial deposit, annuity amount, and target final balance; normalize into initial-deposit currency. Rates/dates/durations never FX-converted.
- **Example:** 0 opening · 1,000 monthly due · 6y · 5% monthly compound · no growth → final ≈ 84,113.28; total deposits 72,000; return ≈ 12,113.28; last deposit Oct 17, 2032 from Nov 17, 2026 start.
- **Important Files:** `frontend/src/tools/calculators/annuity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-annuity-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped (`6af46f0fa27d8d1d4e98ffa8`). Screenshot math self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Margin Call Calculator (Screenshot-First + FX)
- **Summary:** Shipped Margin Call Calculator on existing catalog slug `margin-call-calculator` (`MarginCallCalculator`, catalog `6af46f0fa27d8d1d4e98ffa4`). Sections: Account details, Contract specification, Trading, collapsible Total margin amounts. Point value = tick × ticks/point; long P/L = points × point value × contracts; short = −long; equity = deposit + P/L; call when equity < total maintenance. Independent real FX (Margin Interest pattern). Activated.
- **Contract assumptions:** Presets set ticks-per-point only (E-Mini S&P 500 → 4). Tick value and margins are user-entered — no live prices or invented margin schedules.
- **Example:** Tick 3,459.70 × 4 → point value 13,838.80; long buy 5,000 / sell 5,010 / 2 contracts → P/L 276,776.
- **Important Files:** `frontend/src/tools/calculators/margin-call/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-margin-call-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped. Math self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Net Debt Calculator (Screenshot-First + FX)
- **Summary:** Shipped Net Debt Calculator on existing catalog slug `net-debt-calculator` (`NetDebtCalculator`, catalog `6af46f0fa27d8d1d4e98ff9c`). Accordion sections for cash, short-term debt, long-term debt, plus Net debt summary. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Cash total = Cash + Cash equivalents. Short-term debt = Σ ST items. Long-term debt = Σ LT items. Net debt = ST + LT − cash total (negative allowed when cash exceeds debt). Blank lines = 0; never NaN/Infinity.
- **FX:** Independent currencies on all money selectors (Margin Interest / Phase 2). Normalize into cash currency before addition/subtraction; section totals and net debt re-express in their display currencies. Full precision; display rounding only. Stale/missing rate handling reused.
- **Example:** Cash 50,000 + eq 10,000; ST 40,000; LT 100,000 → net debt 80,000.
- **Important Files:** `frontend/src/tools/calculators/net-debt/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-net-debt-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Gross Margin Calculator (Screenshot-First + FX)
- **Summary:** Shipped Gross Margin Calculator on existing catalog slug `gross-margin-calculator` (`GrossMarginCalculator`, catalog `6af46f0fa27d8d1d4e98ffa0`). Gross profit section: revenue, COGS, gross profit; Gross margin section: margin %. Independent real FX on three money selectors (Margin Interest pattern). Share/Reload/Clear/feedback. Activated.
- **Formulas:** Gross Profit = Revenue − COGS; Gross Margin (%) = (Gross Profit / Revenue) × 100. COGS normalizes into revenue currency; profit display currency independent; margin % never FX-converted. Zero revenue blocked; negative profit/margin allowed; never NaN/Infinity.
- **Example:** Revenue 100,000 / COGS 60,000 → profit 40,000 / margin 40.00%.
- **Important Files:** `frontend/src/tools/calculators/gross-margin/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-gross-margin-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Margin and Markup Calculator (Screenshot-First + FX)
- **Summary:** Shipped Margin and Markup Calculator on existing catalog slug `margin-and-markup-calculator` (`MarginAndMarkupCalculator`, catalog `6af46f0fa27d8d1d4e98ffa1`). Fields: cost FX, compare-two checkbox, margin %, markup %, revenue FX, profit FX; optional second shared-cost scenario. Bidirectional driver sync. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Profit = Revenue − Cost; Margin = Profit/Revenue×100; Markup = Profit/Cost×100; Revenue = Cost/(1−Margin/100) or Cost×(1+Markup/100).
- **Comparison:** Checkbox reveals Scenario 2 sharing cost + money currencies (Omni two-set).
- **Example:** Cost 100 / margin 35% → revenue ≈ 153.85, markup ≈ 53.85%.
- **Important Files:** `frontend/src/tools/calculators/margin-and-markup/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-margin-and-markup-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Operating Margin Calculator (Screenshot-First + FX)
- **Summary:** Shipped Operating Margin Calculator on existing catalog slug `operating-margin-calculator` (`OperatingMarginCalculator`, catalog `6af46f0fa27d8d1d4e98ffa7`). Sections: Operating income (revenue, COGS, operating expenses, calculated operating income) + Result (operating margin %). Share/Reload/Clear/feedback. Distinct from EBITDA Margin / Gross Margin. Activated.
- **Formulas:** Operating Income = Revenue − COGS − Operating Expenses; Operating Margin (%) = (Operating Income / Revenue) × 100. Zero revenue blocked; negative income/margin allowed.
- **FX:** Independent currencies on all four money fields; normalize COGS + opex into revenue currency; income display currency independent; currency-only changes preserve margin %. Percentage never FX-converted.
- **Example:** 1,000,000 − 400,000 − 250,000 → income 350,000 / margin 35.00%.
- **Important Files:** `frontend/src/tools/calculators/operating-margin/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-operating-margin-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Margin of Safety Calculator (Screenshot-First + FX)
- **Summary:** Shipped Margin of Safety Calculator on existing catalog slug `margin-of-safety-calculator` (`MarginOfSafetyCalculator`, catalog `6af46f0fa27d8d1d4e98ffa6`). Current/breakeven sales, per-unit section, MoS money/ratio/%/units. Independent FX on five money selectors. Activated.
- **Formulas:** MoS = Current − Breakeven; Ratio = MoS/Current; % = Ratio×100; Units = MoS/Selling Price; optional Current = Volume×Price. Cost price not used for breakeven.
- **Example:** 500,000 − 350,000 @ 50 → 150,000 / 0.30 / 30% / 3,000 units.
- **Important Files:** `frontend/src/tools/calculators/margin-of-safety/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-margin-of-safety-tool.ts`, `brain/*`.
- **Verification:** Catalog undeveloped before coding. Formula self-check. Mongo activated. Lint/builds/tests omitted per user. No push/pull/sync.

### 2026-11-17 — Margin Calculator Classic (Screenshot-First + FX)
- **Summary:** Shipped Margin Calculator Classic on existing catalog slug `margin-calculator-classic` (`MarginCalculatorClassic`, catalog `6af46f0fa27d8d1d4e98ffa3`). Four fields: cost, margin % (pin), revenue, profit. Bidirectional solve with last-edited driver; margin pin holds %. Share/Reload/Clear/feedback. Separate from `margin-calculator`. Activated.
- **Formulas:** Profit = Revenue − Cost; Margin (%) = (Profit / Revenue) × 100; Revenue = Cost / (1 − Margin/100); Revenue = Cost + Profit. Margin 100% and zero revenue blocked safely.
- **FX:** Independent currencies on cost/revenue/profit; normalize into cost currency; currency-only changes preserve margin %. Percentage never FX-converted.
- **Example:** Cost 100 / Margin 20% pinned → Revenue 125, Profit 25.
- **Important Files:** `frontend/src/tools/calculators/margin-calculator-classic/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-margin-calculator-classic-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Debt Snowball Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt Snowball Calculator on existing catalog slug `debt-snowball-calculator` (`DebtSnowballCalculator`, catalog `6af46f0fa27d8d1d4e98ff97`). Debt count Two–Six; per-debt balance/rate/payment; aim dropdown (minimum / snowball / avalanche); repayment totals + optional increase; compare radio; horizontally scrollable payoff table. Independent real FX on all money selectors (Margin Interest pattern). Activated.
- **Formulas:** Normalize mixed-currency balances/payments/increase into debt #1 balance currency. Minimum = independent per-debt schedules (combined payment can fall). Snowball/avalanche keep `Σ mins + increase` constant; interest accrues before principal; snowball targets smallest balance; avalanche targets highest rate; final month skips interest when principal fits.
- **Example:** 1,500 @ 2.5% / 120 + 4,000 @ 6.2% / 150; increase 0 → total 5,500 / pay 270; min ≈ 5.19%* / 29 mo / payable ≈ 5,836.47 / interest ≈ 336.47; snowball ≈ 22 mo / payable ≈ 5,791.30 / interest ≈ 291.30.
- **Important Files:** `frontend/src/tools/calculators/debt-snowball/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-debt-snowball-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Omni math self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — EBITDA Margin Calculator (Screenshot-First + FX)
- **Summary:** Shipped EBITDA Margin Calculator on existing catalog slug `ebitda-margin-calculator` (`EbitdaMarginCalculator`, catalog `6af46f0fa27d8d1d4e98ff9f`). Three fields only: total revenues, EBITDA, EBITDA margin %. Independent real FX on both money selectors; normalize into total-revenues currency before dividing; currency-only changes preserve the margin. Share/Reload/Clear/feedback. Activated.
- **Formulas:** EBITDA Margin (%) = (EBITDA ÷ Total Revenues) × 100. Total revenues must be nonzero. Negative EBITDA/margin allowed; never displays NaN or Infinity.
- **Example:** 1,000,000 / 250,000 → 25.00%.
- **Important Files:** `frontend/src/tools/calculators/ebitda-margin/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ebitda-margin-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding (`6af46f0fa27d8d1d4e98ff9f`). Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Debt-to-Capital Ratio Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt-to-Capital Ratio Calculator on existing catalog slug `debt-to-capital-ratio-calculator` (`DebtToCapitalRatioCalculator`, catalog `6af46f0fa27d8d1d4e98ff9a`). Three fields: interest bearing debt, shareholder's equity, dimensionless debt to capital ratio. Independent real FX. Activated.
- **Formulas:** Debt / (Debt + Equity). Debt + equity != 0.
- **Example:** 400,000 / 600,000 -> 0.40.
- **Important Files:** `frontend/src/tools/calculators/debt-to-capital-ratio/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-debt-to-capital-ratio-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.
### 2026-11-17 — Debt to Asset Ratio Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt to Asset Ratio Calculator on existing catalog slug `debt-to-asset-ratio-calculator` (`DebtToAssetRatioCalculator`, catalog `6af46f0fa27d8d1d4e98ff98`). Five fields: long-term debt, short-term debt, total debt (calculated + independent FX), total assets, debt to assets ratio %. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Total Debt = Long-term + Short-term. Debt to Assets Ratio (%) = (Total Debt / Total Assets) × 100. Assets must be &gt; 0; zero debt → 0%; ratios above 100% uncapped.
- **FX:** Independent currencies on all four money selectors; debts normalize into total-assets currency before the ratio; total-debt currency only re-expresses the calculated sum. Currency-only changes preserve the ratio. Percentage never FX-converted.
- **Example:** 100,000 + 50,000 / 300,000 → total debt 150,000; ratio 50%.
- **Important Files:** `frontend/src/tools/calculators/debt-to-asset-ratio/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-debt-to-asset-ratio-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Debt Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt Calculator on existing catalog slug `debt-calculator` (`DebtCalculator`, catalog `6af46f0fa27d8d1d4e98ff91`). Number of debts (Two–Six); per-debt balance/rate/payment; consolidation rate + prepaid fee; debt summary with total debt, monthly payment, and horizontally scrollable comparison table (Min. payment / Snowball / Avalanche / Consolidation). Independent real FX on all money selectors (Margin Interest pattern). Activated.
- **Formulas:** Total debt = Σ balances; monthly payment = Σ scheduled payments. Month-by-month amortization; final month skips interest when remaining principal fits in budget. Min = scheduled payments only (weighted-average APR*). Snowball/avalanche keep combined budget and redirect freed payments. Consolidation amortizes combined principal at consolidation rate with same payment; prepaid fee reduces net advance for cash-flow APR only (not double-counted into principal).
- **Example:** 4,500 @ 6.2% / 120 + 12,000 @ 18.2% / 220; consol 9.5% + fee 200 → total 16,500 / pay 340; min ≈ 14.93%* / 14,178.03 / 117 mo; snowball & avalanche ≈ 16.35% / 10,695.50 / 80 mo; consolidation ≈ 10.01% / 4,403.04 / 62 mo.
- **Important Files:** `frontend/src/tools/calculators/debt/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-debt-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Reference math self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Debt Service Coverage Ratio Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt Service Coverage Ratio Calculator (DSCR) on existing catalog slug `debt-service-coverage-ratio-calculator-dscr` (`DebtServiceCoverageRatioCalculator`, catalog `6af46f0fa27d8d1d4e98ff96`). Debt service section (rate/term/loan/payment), collapsible NOI builder (GI/expenses%/vacancy%), NOI + DSCR `×` result. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Amortizing monthly payment `M = P × r / (1 − (1+r)^(-n))` with `r = annual%/1200`, `n = term months` (zero interest → `P/n`). Optional NOI = `(1 − expenses%)(1 − vacancy%) × GI`. DSCR = monthly NOI ÷ monthly debt service (payment field). Periods aligned to monthly; zero debt service blocked; never NaN/Infinity.
- **FX:** Independent currencies on total loan, loan payment, and NOI (plus GI in the builder). Payment + NOI normalize into total-loan currency at full precision before monthly alignment. Currency-only changes preserve DSCR. Rate/term/DSCR never FX-converted. Stale/missing rate handling reused.
- **Example:** 1,000,000 @ 4%/20y → payment ≈ 4,183.42; NOI 9,000 → DSCR ≈ 2.15×.
- **Important Files:** `frontend/src/tools/calculators/debt-service-coverage-ratio/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-debt-service-coverage-ratio-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding (`6af46f0fa27d8d1d4e98ff96`). Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Debt Avalanche Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt Avalanche Calculator on existing catalog slug `debt-avalanche-calculator` (`DebtAvalancheCalculator`, catalog `6af46f0fa27d8d1d4e98ff93`). Debt count dropdown (default Two); per-debt balance/rate/payment with independent FX; total-debt result currency. Baseline = fixed minimums (no reallocation); avalanche keeps combined monthly budget and directs freed payments to the highest APR. Results: savings narrative + scrollable comparison table (APR, monthly payment, payoff term, total payable, total interest). Activated.
- **Example:** 1,000 @ 6% / 100 + 5,000 @ 12% / 200 → baseline 29 mo / interest ≈ 810.92; avalanche 23 mo / interest ≈ 693.71; save ≈ 117.21 and 6 months.
- **Important Files:** `frontend/src/tools/calculators/debt-avalanche/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-debt-avalanche-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Math self-check vs screenshot. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — After-tax Cost of Debt Calculator (Screenshot-First + FX)
- **Summary:** Shipped After-tax Cost of Debt Calculator on existing catalog slug `after-tax-cost-of-debt-calculator` (`AfterTaxCostOfDebtCalculator`, catalog `6af46f0fa27d8d1d4e98ff92`). Two sections: Marginal corporate tax rate (net income + pre-tax income with independent FX); After-tax cost of debt (tax %, read-only after-tax %, cost of debt %). `taxRateSource` avoids circular income↔tax updates. Activated.
- **Formulas:** Marginal Tax Rate (%) = (1 − Net Income / Pre-tax Income) × 100 (effective estimate, not statutory bracket). After-tax Cost of Debt (%) = Cost of Debt (%) × (1 − Tax Rate (%) / 100). Zero pre-tax income blocked for derived tax; zero tax allowed.
- **FX:** Independent currencies on both incomes; pretax normalized into net-income currency before the ratio. Currency-only changes preserve percentages. Percentages never FX-converted. Stale/missing rate handling reused.
- **Example:** Net 800,000 / Pretax 1,000,000 / Cost 8% → tax 20%; after-tax cost 6.4%.
- **Important Files:** `frontend/src/tools/calculators/after-tax-cost-of-debt/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-after-tax-cost-of-debt-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Interest Rate Parity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Interest Rate Parity Calculator on existing catalog slug `interest-rate-parity-calculator` (`InterestRateParityCalculator`, catalog `6af46f0fa27d8d1d4e98ff8e`). Covered/Uncovered radios, contract days, annualised↔period price/base rates (360-day), spot + calculated forward with quote-currency selectors. Share/Reload/Clear/feedback. Activated.
- **Quote convention:** Spot/forward = price-currency units per one base-currency unit.
- **Formulas:** Period % = Annualised % × (days/360). Covered F = S×(1+r_p)/(1+r_b). Uncovered E[S] = S×(1+(r_p−r_b)) (expected future spot, not a locked forward).
- **FX:** Selectors are quote currencies for the FX rate. Spot currency change re-quotes via stored MongoDB rates; forward selector re-expresses the calculated quote once. Rates/days never convert.
- **Example:** Covered · 90d · 0.8%/3.2% annualised · spot 0.1735 → period 0.2%/0.8%; F ≈ 0.1725.
- **Important Files:** `frontend/src/tools/calculators/interest-rate-parity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-interest-rate-parity-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Times Interest Earned Ratio Calculator (Screenshot-First + FX)
- **Summary:** Shipped Times Interest Earned Ratio Calculator on existing catalog slug `times-interest-earned-ratio-calculator` (`TimesInterestEarnedCalculator`, catalog `6af46f0fa27d8d1d4e98ff8a`). Three fields only: EBIT, total interest, dimensionless TIE ratio. Independent real FX on both money selectors; normalize into EBIT currency before dividing; currency-only changes preserve the ratio. Share/Reload/Clear/feedback. Activated.
- **Formulas:** TIE Ratio = EBIT ÷ Total Interest (total interest > 0). Zero/negative EBIT allowed; never displays NaN or Infinity.
- **Example:** 400,000 / 100,000 → 4.00.
- **Important Files:** `frontend/src/tools/calculators/times-interest-earned/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-times-interest-earned-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding (`6af46f0fa27d8d1d4e98ff8a`). Formula self-check (400k/100k → 4.00). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Loan Interest Calculator (Screenshot-First + FX)
- **Summary:** Shipped Loan Interest Calculator on existing catalog slug `loan-interest-calculator` (`LoanInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff86`). Loan details: balance, term yrs/mos, APR %, payment frequency, compounding frequency → interest, total payment, frequency-labeled repayment, yearly balances chart. Independent real FX on four money selectors (Margin Interest pattern). Activated.
- **Formulas:** r = (1 + APR/(100 × m))^(m/p) − 1; n = years × p; Payment = P × r / (1 − (1+r)^(-n)); r = 0 → P/n; Total = Payment × n; Interest = Total − Principal. Chart samples full amortization at year marks.
- **Example:** 10,000 PKR / 10y / 4% monthly/monthly → payment ≈ 101.25; total ≈ 12,149.42; interest ≈ 2,149.42.
- **Important Files:** `frontend/src/tools/calculators/loan-interest/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-loan-interest-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — TDS Interest Calculator (Screenshot-First, Fixed INR)
- **Summary:** Shipped TDS Interest Calculator on existing catalog slug `tds-interest-calculator` (`TdsInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff89`). Three modes: late deduction (s.201(1A) 1%/month), late payment (s.201(1A) 1.5%/month after Rule 30 due date), late filing (s.234E ₹200/day capped at TDS). Conditional fields per mode; fixed INR; within-deadline message for late filing. Activated.
- **Assumptions:** Non-government Rule 30 deposit due dates (7th next month; March → 30 April). Standard quarterly return due dates (31 Jul / 31 Oct / 31 Jan / 31 May). No CBDT extension circulars. No government-deductor same-day deposit toggle.
- **Example:** Late filing ₹10,000 / FY 2027 Q1 / filed 2026-11-17 → within deadline (due 31 Jul 2027). Late deduction Apr 15→May 2 → ₹200. Late payment Apr deduction paid May 12 → ₹300.
- **Important Files:** `frontend/src/tools/calculators/tds-interest/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-tds-interest-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped. Formula self-check vs Omni/IT Act examples. MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Post Judgment Interest Calculator (Screenshot-First, Fixed USD)
- **Summary:** Shipped Post Judgment Interest Calculator on existing catalog slug `post-judgment-interest-calculator` (`PostJudgmentInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff87`). Fields: judgment amount ($), interest rate %, date of judgment, date of writ, time passed (wks/days), accumulated interest. Federal Reserve link. Share / Reload / Clear / feedback. Fixed USD — no currency selector.
- **Formulas:** Elapsed days = civil days judgment→writ; weeks/leftover from elapsed; Interest = Amount × (Rate/100) × (Days/365). Same-day and 0% → $0. Writ before judgment rejected.
- **Example:** $10,000 / 5% / 73 days → $100.00.
- **Important Files:** `frontend/src/tools/calculators/post-judgment-interest/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-post-judgment-interest-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Math self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Interest Coverage Ratio Calculator (Screenshot-First + FX)
- **Summary:** Shipped Interest Coverage Ratio Calculator on existing catalog slug `interest-coverage-ratio-calculator` (`InterestCoverageRatioCalculator`, catalog `6af46f0fa27d8d1d4e98ff84`). Three fields only: EBIT, interest expense, dimensionless interest coverage ratio. Independent real FX on both money selectors; normalize into EBIT currency before dividing; currency-only changes preserve the ratio. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Interest Coverage Ratio = EBIT ÷ Interest Expense (interest expense > 0). Zero/negative EBIT allowed; never displays NaN or Infinity.
- **Example:** 400,000 / 100,000 → 4.00.
- **Important Files:** `frontend/src/tools/calculators/interest-coverage-ratio/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-interest-coverage-ratio-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check (400k/100k → 4; 0 EBIT → 0; negative EBIT → negative ratio; zero interest → null). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-17 — Interest Per Day Calculator (Screenshot-First + FX)
- **Summary:** Shipped Interest Per Day Calculator on existing catalog slug `interest-per-day-calculator` (`InterestPerDayCalculator`, catalog `6af46f0fa27d8d1d4e98ff85`). Screenshot fields: loan balance, annual interest rate %, interest per day, interest rate per day % (`%` unit dropdowns only). Independent real FX on loan balance + interest per day (Margin Interest pattern); percentages never converted. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Daily Rate (%) = Annual / 365; Interest Per Day = Loan Balance × (Annual / 100) / 365.
- **Example:** 100,000 PKR @ 7.3% → 20 PKR/day and 0.02%/day.
- **Important Files:** `frontend/src/tools/calculators/interest-per-day/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-interest-per-day-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Cash Back or Low Interest Calculator (Screenshot-First, Fixed USD)
- **Summary:** Shipped Cash Back or Low Interest Calculator on existing catalog slug `cash-back-or-low-interest-calculator` (`CashBackOrLowInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff81`). Inputs: cash back + high APR, low APR, auto price, term months, down, trade-in, US state (identity only), sales tax %, title/registration fees, include-all-fees checkbox. Results: verdict + both offers (loan, tax, upfront, monthly, total payments, interest, total cost). Fixed USD; no currency selectors.
- **Formulas:** Tax = price × %/100; cash-back loan = price − down − trade-in − cashBack [+ tax + fees if financed]; low-rate loan omits cashBack; r = APR/1200; Payment = P×r/(1−(1+r)^(-n)); r=0 → P/n; totalCost = price + interest + tax + fees − cashBack (once).
- **Tax handling:** Manual sales tax % only. State dropdown lists verified US states/DC; never auto-fills rates (no verified per-state table in repo).
- **Example:** $50,000 / $1,000 @ 5% vs 2% / 60 mo / $10,000 down / 7% tax / $2,000 fees upfront → cash-back ≈ $735.98/mo · total ≈ $59,658.69; low-rate ≈ $701.11/mo · total ≈ $57,566.62 (low rate better; interest savings ≈ $3,092).
- **Important Files:** `frontend/src/tools/calculators/cash-back-or-low-interest/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cash-back-or-low-interest-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Reference math self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Mortgage Interest Calculator (Screenshot-First + FX)
- **Summary:** Shipped Mortgage Interest Calculator on existing catalog slug `mortgage-interest-calculator` (`MortgageInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff76`). Screenshot fields: principal FX, term yrs/mos, interest %, compounding radios (Yearly / Semi-annually Canada / Quarterly / Monthly UK&US), optional fees checkbox (points, up-front FX, annual FX), Fixed-rate only, monthly payment / mortgage interest / APR / total payments with independent result FX, chart/schedule/both, schedule-from date, annual balances chart, monthly amortization table. Activated when Mongo assign succeeds.
- **Formulas:** Monthly r from compounding; M = P×r/(1−(1+r)^(-n)); r=0 → P/n; interest = Σ schedule interest; total = (M + annualFee/12)×n + points + up-front; APR = 12×IRR×100 on net proceeds.
- **Example:** 250,000 / 20y / 5% Monthly (UK & US) → payment ≈ 1,649.89; interest ≈ 145,973.44; total ≈ 395,973.44; APR = 5.
- **Important Files:** `frontend/src/tools/calculators/mortgage-interest/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-interest-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Reference math matches screenshot defaults. Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Car Loan EMI Calculator (Screenshot-First + FX)
- **Summary:** Shipped Car Loan EMI Calculator on existing catalog slug `car-loan-emi-calculator` (`CarLoanEmiCalculator`, catalog `6af46f0fa27d8d1d4e98ff50`). Screenshot fields: car price, money you have, trade-in, sales tax %, loan amount, interest rate, term yrs/mos, monthly payment, total interest. Independent real FX on six money selectors; mixed inputs normalize into loan-amount currency. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Tax = Price × %/100; Loan = Price + Tax − Money − Trade-in; n = 12Y+M; r = APR/1200; Payment = P×r/(1−(1+r)^(-n)); r=0 → P/n; Interest = Payment×n − P.
- **Example:** 2,000,000 − 400,000 − 100,000 @ 0% tax / 12% / 5y → P 1,500,000; payment ≈ 33,366.67; interest ≈ 502,000.29.
- **Important Files:** `frontend/src/tools/calculators/car-loan-emi/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-car-loan-emi-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding (`6af46f0fa27d8d1d4e98ff50`). Formula self-check passed (2,000,000 − 400,000 − 100,000 @ 12%/5y → ≈ 33,366.67 / 502,000.29). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Loan Repayment Calculator | Loan Payoff Calculator (Screenshot-First + FX)
- **Summary:** Shipped Loan Repayment Calculator | Loan Payoff Calculator on existing catalog slug `loan-repayment-calculator-loan-payoff-calculator` (`LoanRepaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ff58`). Payment types: even total / even principal / balloon (blocked — no residual in reference). Loan amount + extra monthly with independent FX; balances chart; yearly datasheet; early-payoff savings. Activated.
- **Example:** 10,000 PKR / 10y / 7.5% monthly → ≈ 118.70 monthly; interest ≈ 4,244.18.
- **Important Files:** `frontend/src/tools/calculators/loan-repayment/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-loan-repayment-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Mortgage Comparison Calculator (Screenshot-First + FX)
- **Summary:** Shipped Mortgage Comparison Calculator on existing catalog slug `mortgage-comparison-calculator` (`MortgageComparisonCalculator`, catalog `6af46f0fa27d8d1d4e98ff75`). Screenshot is a single mortgage scenario (no dual-form comparison UI verified). Specs + Further specifications (PMI / tax / insurance / other) + summary + doughnut. Independent real FX on money fields; normalize into home-value currency. Activated.
- **Comparison note:** Dual Scenario A/B UI not evidenced; comparison is by changing inputs on one form (Omni “compare constructions” wording).
- **Example:** 150,000 / 10% / 4.5% / 30y → payment ≈ 684.03; 360 payments ≈ 246,249.06; interest ≈ 111,249.06; PMI ≈ 4,106.25; total with costs ≈ 250,355.31.
- **Important Files:** `frontend/src/tools/calculators/mortgage-comparison/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-comparison-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Jumbo Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped Jumbo Loan Calculator on existing catalog slug `jumbo-loan-calculator` (`JumboLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff54`). Screenshot fields: property price, down payment, down payment %, jumbo loan amount, loan term yrs/mos, interest rate, first day, monthly payment. Bidirectional down-payment sync without circular updates. Independent FX on four monetary selectors; mixed inputs normalize into property-price currency. Share result / Reload / Clear / feedback. Activated.
- **Formulas:** Down = Price × %/100; Loan = Price − Down; n = 12Y+M; r = APR/1200; Payment = P×r/(1−(1+r)^(-n)); r=0 → P/n. Payoff ≈ first day + n months.
- **Example:** 750,000 / 20% / 30y / 6.5% → loan 600,000; monthly ≈ 3,792.41.
- **Important Files:** `frontend/src/tools/calculators/jumbo-loan/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-jumbo-loan-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Reference math self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Home Improvement Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped Home Improvement Loan Calculator on existing catalog slug `home-improvement-loan-calculator` (`HomeImprovementLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff65`). Loan inputs: amount FX, term yrs/mos, interest %, synced application fee %/amount FX, home loan fees FX. Payment summary: monthly payment, fee-adjusted APR (cash-flow IRR), term, principal, total interest, loan fees, total payments, annual balances chart (balance / principal paid / interest paid). Independent real FX on three money inputs; fees normalized into loan currency. Activated.
- **Example:** 50,000 PKR / 5y / 7.5% / application fee 0.4% (200) → monthly ≈ 1,001.90; APR ≈ 7.669%; interest ≈ 10,113.85; fees 200; total ≈ 60,313.85.
- **Important Files:** `frontend/src/tools/calculators/home-improvement-loan/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-home-improvement-loan-tool.ts`, `brain/*`.
- **Verification:** Formula self-check vs screenshot. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Mortgage Rate Calculator (Screenshot-First + FX)
- **Summary:** Shipped Mortgage Rate Calculator on existing catalog slug `mortgage-rate-calculator` (`MortgageRateCalculator`, catalog `6af46f0fa27d8d1d4e98ff7b`). Main configuration (loan FX, term yrs/mos, rate %, compounding Yearly / Semi-annually Canada / Quarterly / Monthly UK & US, Fixed-rate only) + fees (points %, up-front FX, annual FX). Results: monthly payment, fee-adjusted APR, paid interest, total payments. Independent FX on six money fields; mixed inputs normalized into loan currency. No ARM formulas. Activated.
- **Example:** 200,000 PKR / 30y / 5% Monthly (UK & US) → payment ≈ 1,073.64; interest ≈ 186,511.57; total ≈ 386,511.57; APR 5%. With 1 point → APR ≈ 5.089%.
- **Important Files:** `frontend/src/tools/calculators/mortgage-rate/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-rate-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Update Interest Calculator to Reference (Screenshot-First, Fixed USD)
- **Summary:** Implemented Interest Calculator on existing undeveloped catalog slug `interest-calculator` (`InterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff7e`). Inputs: initial investment, annual/monthly contributions, beginning/end timing, interest rate, compounding (default annually), years/months, tax %, inflation %. Results: ending balance, total principal, contributions, total interest, interest on initial vs contributions, inflation-adjusted buying power, doughnut (initial/contributions/interest). After-tax rate and monthly compound step; separate initial/contribution buckets. Fixed USD — no FX selectors in the reference. Activated.
- **Example:** $20,000 / $5,000 annual beginning / 5y / 5% annually / tax 0% / inflation 3% → ending $54,535.20; principal $45,000; contributions $25,000; interest $9,535.20; inflation-adjusted $47,042.54.
- **Important Files:** `frontend/src/tools/calculators/interest/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-interest-tool.ts`, `brain/*`.
- **Verification:** Reference math self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Add VA Mortgage Calculator (Screenshot-First, Fixed USD)
- **Summary:** Shipped VA Mortgage Calculator on existing catalog slug `va-mortgage-calculator` (`VaMortgageCalculator`, catalog `6af46f0fa27d8d1d4e98ff7d`). Inputs: home price, down payment %/$, term years, rate, VA eligibility, prior use, disability 10+%, funding fee financed/upfront. Results: monthly pay, house price, funding fee+%, down payment, loan amount, total payments, total interest, principal-vs-interest doughnut. Funding fees from published VA purchase table (va.gov); disability and surviving-spouse exempt. Fixed USD — no FX selectors. Activated.
- **Example:** $500,000 / 0% down / 30y / 7.319% first use → fee 2.15% = ---

### 2026-11-17 — Margin of Safety Calculator (Screenshot-First + FX)
- **Summary:** Shipped Margin of Safety Calculator on existing catalog slug `margin-of-safety-calculator` (`MarginOfSafetyCalculator`, catalog `6af46f0fa27d8d1d4e98ffa6`). Current/breakeven sales, per-unit section, MoS money/ratio/%/units. Independent FX on five money selectors. Activated.
- **Formulas:** MoS = Current − Breakeven; Ratio = MoS/Current; % = Ratio×100; Units = MoS/Selling Price; optional Current = Volume×Price. Cost price not used for breakeven.
- **Example:** 500,000 − 350,000 @ 50 → 150,000 / 0.30 / 30% / 3,000 units.
- **Important Files:** `frontend/src/tools/calculators/margin-of-safety/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-margin-of-safety-tool.ts`, `brain/*`.
- **Verification:** Catalog undeveloped before coding. Formula self-check. Mongo activated. Lint/builds/tests omitted per user. No push/pull/sync.

### 2026-11-17 — Debt-to-Capital Ratio Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt-to-Capital Ratio Calculator on existing catalog slug `debt-to-capital-ratio-calculator` (`DebtToCapitalRatioCalculator`, catalog `6af46f0fa27d8d1d4e98ff9a`). Three fields: interest bearing debt, shareholder's equity, dimensionless debt to capital ratio. Independent real FX. Activated.
- **Formulas:** Debt / (Debt + Equity). Debt + equity != 0.
- **Example:** 400,000 / 600,000 -> 0.40.
- **Important Files:** `frontend/src/tools/calculators/debt-to-capital-ratio/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-debt-to-capital-ratio-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.
0,750 financed; loan $510,750; monthly ≈ $3,508.15; interest ≈ $752,184.28.
- **Important Files:** `frontend/src/tools/calculators/va-mortgage/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-va-mortgage-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Student Loan Repayment Calculator | COVID-19 (Historical Notice)
- **Summary:** Shipped informational historical notice on existing catalog slug `student-loan-repayment-calculator-covid-19` (`StudentLoanRepaymentCovidCalculator`, catalog `6af46f0fa27d8d1d4e98ff6a`). No financial inputs, repayment formulas, or currency selectors. Notice covers COVID-era federal payment suspension with historical December 31, 2020 reference; states COVID-era calculations are no longer valid; does not claim current federal loans are paused or 0% interest; internal link to `/tools/loan-calculator`. Share result / Reload / disabled Clear / feedback controls. Activated.
- **Important Files:** `frontend/src/tools/calculators/student-loan-repayment-covid/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-student-loan-repayment-covid-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Add Mortgage Points Calculator (Screenshot-First + FX)
- **Summary:** Shipped Mortgage Points Calculator on existing catalog slug `mortgage-points-calculator` (`MortgagePointsCalculator`, catalog `6af46f0fa27d8d1d4e98ff79`). Mortgage setup + Option I/II points/cost/rate; optional discount % per point and upfront vs rolled payment type. Comparison table + annual balances chart. Independent FX on loan and both points-cost fields, normalized into loan currency. Activated.
- **Example:** PKR 250,000 / 30y / 3.25% Monthly (UK & US) → Option I 1 pt / 3% ≈ 1,054.01 payment, ~34.01 savings, 74 mos break-even; Option II 3 pt / 2.5% ≈ 987.80, ~100.21 savings, 75 mos.
- **Important Files:** `frontend/src/tools/calculators/mortgage-points/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-points-tool.ts`, `brain/*`.
- **Verification:** Reference math self-check vs Omni defaults. MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Mortgage Acceleration Calculator (Screenshot-First + FX)
- **Summary:** Shipped Mortgage Acceleration Calculator on existing catalog slug `mortgage-acceleration-calculator` (`MortgageAccelerationCalculator`, catalog `6af46f0fa27d8d1d4e98ff71`). Inputs: loan FX, acceleration type (accelerated biweekly default / ordinary biweekly / monthly overpayment), term, rate, optional fees & compounding, due date, extra payment FX. Scrollable payment summary compares without acceleration / accelerated / difference. Accelerated biweekly = M/2 every 14 days (26/yr); ordinary biweekly = (M×12)/26. Independent FX normalized into loan currency. Activated.
- **Example:** 300,000 PKR / 30y / 7.5% accelerated biweekly → monthly ≈ 2,097.54; biweekly ≈ 1,048.77; shorter term and lower interest vs baseline.
- **Important Files:** `frontend/src/tools/calculators/mortgage-acceleration/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-acceleration-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Mortgage Calculator with Taxes and Insurance (Screenshot-First + FX)
- **Summary:** Shipped Mortgage Calculator with Taxes and Insurance on existing catalog slug `mortgage-calculator-with-taxes-and-insurance` (`MortgageTaxesInsuranceCalculator`, catalog `6af46f0fa27d8d1d4e98ff74`). Omni inputs: home value, synced down payment, loan, rate, term, US/UK vs Canada method, payment frequency, first day, P&I payment. Further specifications: annual PMI %, property tax (% of home), homeowners insurance (annual money + FX), other periodic costs. Tax/insurance default 0; Payment stays P&I; escrow folds into total-with-costs and Other costs pie slice. Independent real FX. Activated.
- **Example:** 150,000 / 10% / 4.5% / 30y → payment ≈ 684.03; 360 payments ≈ 246,249.06; interest ≈ 111,249.06; PMI 73 × 56.25 = 4,106.25; total with costs ≈ 250,355.31.
- **Important Files:** `frontend/src/tools/calculators/mortgage-taxes-insurance/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-taxes-insurance-tool.ts`, `brain/*`.
- **Verification:** Formula self-check vs screenshot. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-17 — Add Mortgage Prepayment Calculator (Screenshot-First + FX)
- **Summary:** Shipped Mortgage Prepayment Calculator on existing catalog slug `mortgage-prepayment-calculator` (`MortgagePrepaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ff7a`). Current mortgage (amount FX, rate, term yrs/mos, Monthly US&UK / Canada method, due date) + prepayment options (payment frequency, periodic FX + start, lump-sum FX + paid-on). Compares baseline vs prepaid payoff/payment/#/term/interest/total; balances chart. Independent FX normalized into mortgage currency. Activated.
- **Example:** PKR 100,000 / 6% / 30y monthly → ≈ 599.55 payment; 360 payments; interest ≈ 115,838.19; total ≈ 215,838.19.
- **Important Files:** `frontend/src/tools/calculators/mortgage-prepayment/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-prepayment-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Interest-Only Mortgage Calculator (Screenshot-First + FX)
- **Summary:** Shipped Interest-Only Mortgage Calculator on existing catalog slug `interest-only-mortgage-calculator` (`InterestOnlyMortgageCalculator`, catalog `6af46f0fa27d8d1d4e98ff70`). Fields: loan amount, annual rate %, payment frequency radios (Daily / Monthly default / Quarterly / Yearly), frequency-labeled periodic payment, collapsible Interest-only period (yrs/mos + total interest paid). Formula: periodic = P × r / n (365/12/4/1); total IO interest = P × r × years. Independent real FX on loan, payment, and total currencies. No post-IO amortization schedule. Activated.
- **Example:** 350,000 at 4% monthly → 1,166.67; 10-year IO total interest → 140,000; principal unchanged.
- **Important Files:** `frontend/src/tools/calculators/interest-only-mortgage/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-interest-only-mortgage-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Biweekly Mortgage Calculator (Screenshot-First + FX)
- **Summary:** Shipped Biweekly Mortgage Calculator on existing catalog slug `biweekly-mortgage-calculator` (`BiweeklyMortgageCalculator`, catalog `6af46f0fa27d8d1d4e98ff6d`). Mortgage details (loan FX, term yrs/mos, rate) + compounding (Monthly UK & US / Semi-annually Canada), points %, upfront fee FX, extra payment FX. Payment summary compares without-acceleration monthly vs accelerated biweekly (half monthly every 14 days) vs difference. Closing costs added once to totals. Independent FX normalized into loan currency. Activated.
- **Example:** 150,000 PKR / 30y / 6% Monthly (UK & US) → monthly ≈ 899.33; biweekly ≈ 449.66; biweekly term ≈ 24 yrs 5 mos; interest ≈ 136,048.89; payment difference ≈ 74.94.
- **Important Files:** `frontend/src/tools/calculators/biweekly-mortgage/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-biweekly-mortgage-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Mortgage Amortization Calculator (Screenshot-First)
- **Summary:** Catalog row `mortgage-amortization-calculator` (`6af46f0fa27d8d1d4e98ff72`) had no frontend module. Implemented `MortgageAmortizationCalculator` to match reference: home price, down %, term years, rate, optional taxes/insurance/PMI/HOA/other, start month/year; monthly mortgage + cost table, out-of-pocket, summary, doughnut. Fixed USD (no FX selectors). Distinct from `amortization-calculator`. Activated.
- **Example:** $500k / 20% / 30y / 7.319% → mortgage ≈ $2,747.45; interest ≈ $589,082.16; with optionals out-of-pocket ≈ $3,872.45/mo · $1,394,082.16 total; payoff Nov. 2056.
- **Important Files:** `frontend/src/tools/calculators/mortgage-amortization/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-amortization-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Student Loan Payment Calculator (Screenshot-First + FX)
- **Summary:** Shipped Student Loan Payment Calculator on existing catalog slug `student-loan-payment-calculator` (`StudentLoanPaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ff69`). Loan specs + prepaid/loaned/origination fees with three repayment modes; text summary with Omni fee-inclusive APR and effective APR. Independent real FX on loan/prepaid/loaned. Activated.
- **Example:** 10,000 PKR / 5% nominal monthly / 6y / prepaid 200 / loaned 500 / 8% from loan → payment ≈ 169.10; total ≈ 12,375.33; APR ≈ 10.31%; EAR ≈ 10.81%.
- **Important Files:** `frontend/src/tools/calculators/student-loan-payment/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-student-loan-payment-tool.ts`, `brain/*`.
- **Verification:** Formula self-check vs screenshot. MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Mortgage Calculator UK (Screenshot-First)
- **Summary:** Shipped Mortgage Calculator UK on existing catalog slug `mortgage-calculator-uk` (`MortgageCalculatorUk`, catalog `6af46f0fa27d8d1d4e98ff73`). Home price (£), deposit %, term years, rate %; Include Optionals (taxes % of home, home/mortgage insurance £/yr, other £/yr); start month/year. Results: interest-only + monthly repayment, monthly/total cost table, out-of-pocket, loan/deposit/interest, doughnut. Fixed GBP (no FX). Distinct from Canadian / Home Mortgage / Home Loan / Interest-Only Mortgage. Activated.
- **Example:** £500,000 / 25% / 25y / 5% → interest-only £1,562.50, repayment ≈ £2,192.21, OOP ≈ £3,400.55/mo, lifetime ≈ £1,020,163.80.
- **Important Files:** `frontend/src/tools/calculators/mortgage-uk/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-uk-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Economic Injury Disaster Loan Emergency Advance (Historical Information Tool)
- **Summary:** Shipped Economic Injury Disaster Loan Emergency Advance (EIDL) on existing catalog slug `economic-injury-disaster-loan-emergency-advance-eidl` (`EidlCalculator`, catalog `6af46f0fa27d8d1d4e98ff52`). Screenshot-first implementation of a historical/discontinued CARES Act COVID-19 emergency relief tool. Displays an informational notice explaining that the up to $10,000 emergency grant program is closed and old calculations are invalid for new financing. Features an internal link to the active general `/tools/loan-calculator`. Pure engine returns expired status; no financial calculation inputs, interest rates, or currency dropdowns. Action buttons include Share result, Reload calculator, and disabled Clear all changes. Activated with guide, SEO, and embed.
- **Example:** Program status: expired; historical max: $10,000; redirects users seeking loan estimations to the active Loan Calculator.
- **Important Files:** `frontend/src/tools/calculators/eidl/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-eidl-tool.ts`, `brain/*`.
- **Verification:** Pure calculation tests pass (`eidl/calculation.test.ts`). Database assignment script verified record `6af46f0fa27d8d1d4e98ff52` active. Lint/builds/browser tests omitted per user instructions.

### 2026-11-16 — Interest-Only Mortgage Calculator (Screenshot-First + FX)
- **Summary:** Shipped Interest-Only Mortgage Calculator on existing catalog slug `interest-only-mortgage-calculator` (`InterestOnlyMortgageCalculator`, catalog `6af46f0fa27d8d1d4e98ff70`). Fields: loan amount, annual rate %, payment frequency radios (Daily / Monthly default / Quarterly / Yearly), frequency-labeled periodic payment, collapsible Interest-only period (yrs/mos + total interest paid). Formula: periodic = P × r / n (365/12/4/1); total IO interest = P × r × years. Independent real FX on loan, payment, and total currencies. No post-IO amortization schedule. Activated.
- **Example:** 350,000 at 4% monthly → 1,166.67; 10-year IO total interest → 140,000; principal unchanged.
- **Important Files:** `frontend/src/tools/calculators/interest-only-mortgage/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-interest-only-mortgage-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Student Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped Student Loan Calculator on existing catalog slug `student-loan-calculator` (`StudentLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff67`). Screenshot fields: loan balance, remaining term yrs/mos, interest rate % → monthly payment. Standard amortizing formula `M = P × r × (1+r)^n / ((1+r)^n − 1)` with `r = 0 → P/n`. Independent real FX on loan + payment; term/rate never convert. Activated.
- **Example:** 100,000 PKR / 10 yrs / 6% → monthly ≈ 1,110.21 PKR.
- **Important Files:** `frontend/src/tools/calculators/student-loan/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-student-loan-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Home Mortgage Calculator (Screenshot-First + FX)
- **Summary:** Shipped Home Mortgage Calculator on existing catalog slug `home-mortgage-calculator` (`HomeMortgageCalculator`, catalog `6af46f0fa27d8d1d4e98ff6f`). Reuses Home Loan Calculator patterns without modifying that module: home value, synced down payment amount/%, loan amount, rate, term years, US/UK vs Canada interest method, payment frequency, first day, payment; further specs PMI % + other costs; mortgage summary + principal/interest/PMI/other pie chart. Independent real FX on monetary selectors. Left undeveloped `mortgage-calculator` untouched. Activated.
- **Example:** 150,000 / 10% down / 4.5% / 30y monthly → payment ≈ 684.03; 360 pays ≈ 246,249.06; interest ≈ 111,249.06; PMI 0.5% → ≈ 4,106.25; total with costs ≈ 250,355.31.
- **Important Files:** `frontend/src/tools/calculators/home-mortgage/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-home-mortgage-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Home Loan EMI Calculator (Screenshot-First + FX)
- **Summary:** Shipped Home Loan EMI Calculator on existing catalog slug `home-loan-emi-calculator` (`HomeLoanEmiCalculator`, catalog `6af46f0fa27d8d1d4e98ff66`). Inputs: principal (FX), term yrs/mos, interest %. Results: EMI, total payable, total interest, principal-vs-interest chart (blue/red). Standard EMI formula; zero-rate = P/n. Principal converts on currency change; result currencies display-only. Activated. Distinct from Home Loan / Home Equity Loan.
- **Example:** P 1,000,000 / 240 mos / 8% → EMI ≈ 8,364.39; payable ≈ 2,007,453.60; interest ≈ 1,007,453.60.
- **Important Files:** `frontend/src/tools/calculators/home-loan-emi/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-home-loan-emi-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Home Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped Home Loan Calculator on existing catalog slug `home-loan-calculator` (`HomeLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff63`). Fields: home value, down payment amount/% sync, loan amount, rate, term years, interest method (US/UK monthly vs Canada semi-annual), payment frequency (incl. accelerated), first day, payment; further specs: annual PMI %, other periodic costs. Mortgage summary + principal/interest/PMI/other pie chart. Independent real FX on monetary selectors. Distinct from Home Loan EMI / Home Equity Loan. Activated.
- **Example:** 150,000 / 10% down / 4.5% / 30y monthly → payment ≈ 684.03; 360 pays ≈ 246,249.06; interest ≈ 111,249.06; PMI 0.5% → 56.25 × 73 = 4,106.25; total with costs ≈ 250,355.31.
- **Important Files:** `frontend/src/tools/calculators/home-loan/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-home-loan-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Student Loan Forgiveness Calculator (Historical / Not Currently Available)
- **Summary:** Shipped Student Loan Forgiveness Calculator on existing catalog slug `student-loan-forgiveness-calculator` (`StudentLoanForgivenessCalculator`, catalog `6af46f0fa27d8d1d4e98ff68`). Screenshot fields only: filing status Single/Married (default Single), annual income $, Pell Grants Yes checkbox, outstanding student debt $. No result cards invented. No forgiveness amount — historical 2022 relief rules are not verified in project data; shows Historical / Not Currently Available notice. Fixed USD. No PSLF/IDR. Activated.
- **Important Files:** `frontend/src/tools/calculators/student-loan-forgiveness/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-student-loan-forgiveness-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Home Loan EMI Calculator (Screenshot-First + FX)
- **Summary:** Shipped Home Loan EMI Calculator on existing catalog slug `home-loan-emi-calculator` (`HomeLoanEmiCalculator`, catalog `6af46f0fa27d8d1d4e98ff66`). Inputs: principal (FX), term yrs/mos, interest %. Results: EMI, total payable, total interest, principal-vs-interest chart (blue/red). Standard EMI formula; zero-rate = P/n. Principal converts on currency change; result currencies display-only. Activated. Left unrelated WIP `home-loan/` untouched.
- **Example:** P 1,000,000 / 240 mos / 8% → EMI ≈ 8,364.39; payable ≈ 2,007,453.60; interest ≈ 1,007,453.60.
- **Important Files:** `frontend/src/tools/calculators/home-loan-emi/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-home-loan-emi-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Student Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped Student Loan Calculator on existing catalog slug `student-loan-calculator` (`StudentLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff67`). Screenshot fields: loan balance, remaining term yrs/mos, interest rate % → monthly payment. Standard amortizing formula `M = P × r × (1+r)^n / ((1+r)^n − 1)` with `r = 0 → P/n`. Independent real FX on loan + payment; term/rate never convert. Activated.
- **Example:** 100,000 PKR / 10 yrs / 6% → monthly ≈ 1,110.21 PKR.
- **Important Files:** `frontend/src/tools/calculators/student-loan/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-student-loan-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Home Equity Loan Calculator
- **Summary:** Shipped Home Equity Loan Calculator on existing catalog slug `home-equity-loan-calculator` (`HomeEquityLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff64`). Inputs: loan amount, interest %, term years, Include closing costs checkbox (blocks results when checked — no verified fee rule). Results: monthly pay, total of n payments, total interest, principal-vs-interest doughnut. Fixed USD ($) — no FX selectors in the reference. Activated.
- **Example:** $150,000 / 8% / 15 yrs → monthly ≈ $1,433.48; 180 payments ≈ $258,026.06; interest ≈ $108,026.06.
- **Important Files:** `frontend/src/tools/calculators/home-equity-loan/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-home-equity-loan-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — RV Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped RV Loan Calculator on existing catalog slug `rv-loan-calculator` (`RvLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff61`). Screenshot sections: RV loan setup (price, down payment default 0.00, term yrs/mos, interest %/yr) and RV loan payments (loan amount, payment / mon, total paid, cost of loan). Independent real FX on all six monetary selectors; canonical = RV price currency; down payment normalized before P = V − D. Activated.
- **Example:** 100,000 PKR / 20,000 down / 5 yrs / 6% → loan 80,000; payment ≈ 1,546.62; total paid ≈ 92,797.45; cost ≈ 12,797.45.
- **Important Files:** `frontend/src/tools/calculators/rv-loan/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-rv-loan-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Quiz: Loan Balance Calculator
- **Summary:** Shipped educational Quiz: Loan Balance Calculator on existing catalog slug `quiz-loan-balance-calculator` (`QuizLoanBalanceCalculator`, catalog `6af46f0fa27d8d1d4e98ff60`). Five MC questions, score `/5` after all answered, deferred explanations until complete, internal link to Interest Rate Calculator. No FX. Distinct from Loan Balance Calculator. Activated.
- **Example:** Correct answers A/B/C/B/A → 5/5. Incomplete quiz shows “Please answer all questions to see your score!”
- **Important Files:** `frontend/src/tools/calculators/quiz-loan-balance/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-quiz-loan-balance-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Payday Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped Payday Loan Calculator on existing catalog slug `payday-loan-calculator` (`PaydayLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff5d`). Fields: loan amount, finance charge, term (days), APR %, APR amount, monthly fee %, monthly fee, total debt. Simple APR `(F/P)×(365/d)×100` with bidirectional F↔APR via edit-source tracking. APR amount = annualized F (`F×365/d`). Monthly fee = one `P×(q/100)` assessment. Total debt = P+F+monthly fee (APR amount not double-counted). Independent FX on five monetary selectors. Activated.
- **Example:** P 1,000 / F 150 / 14 days / q 0% → APR ≈ 391.0714%, APR amount ≈ 3,910.71, total debt 1,150.
- **Important Files:** `frontend/src/tools/calculators/payday-loan/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-payday-loan-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. Monthly-fee period treatment is a documented one-assessment assumption (reference omitted multi-month rules).

### 2026-11-16 — Pag-IBIG Housing Loan Calculator (partial, no invented rules)
- **Summary:** Shipped Pag-IBIG Housing Loan Calculator on existing catalog slug `pag-ibig-housing-loan-calculator` (`PagIbigHousingLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff5a`). Screenshot sections preserved. Computes monthly principal and interest from loan amount + screenshot fixed-pricing example `30 years (9.750%)`. Bidirectional annual↔monthly income. PHP denomination only (no FX selectors). Loanable amount, insurance premium, total amortization, and Yes-mode extra values left unavailable with explanations — no fabricated LTV/insurance/eligibility rules.
- **Example:** ₱1,000,000 / 30 yrs / 9.75% → monthly P&I ≈ ₱8,591.54 (reference note ≈ 8,591.74).
- **Important Files:** `frontend/src/tools/calculators/pag-ibig-housing-loan/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-pag-ibig-housing-loan-tool.ts`, `brain/*`.
- **Verification:** MongoDB activation targeted via assign script. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Partially Amortized Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped Partially Amortized Loan Calculator on existing catalog slug `partially-amortized-loan-calculator` (`PartiallyAmortizedLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff5b`). Fields: full loan, annual rate %/yr, amortization time, payment period → monthly payment, total paid, balloon, total. Monthly payment sized on N; balloon after K. Independent FX on five monetary selectors. Activated.
- **Example:** 100,000 PKR / 6% / amort 20y / pay 5y → M ≈ 716.43; paid ≈ 42,985.86; balloon ≈ 84,899.60; total ≈ 127,885.46.
- **Important Files:** `frontend/src/tools/calculators/partially-amortized-loan/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-partially-amortized-loan-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user. Result fields calculated only (no inverse editing).

### 2026-11-16 — LTV Calculator (Loan to Value)
- **Summary:** Shipped LTV Calculator on existing catalog slug `ltv-calculator-loan-to-value` (`LtvCalculator`, catalog `6af46f0fa27d8d1d4e98ff59`). Screenshot fields only: purchase price, down payment, loan amount, LTV %. Bidirectional driver (`downPayment` | `loanAmount` | `ltv`). Independent real FX on three money fields; normalize into purchase currency before math; LTV % never converted. Activated.
- **Example:** 200,000 PKR purchase + 40,000 down → loan 160,000 / LTV 80%. Alt: 200,000 + loan 180,000 → down 20,000 / LTV 90%.
- **Important Files:** `frontend/src/tools/calculators/ltv/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ltv-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Loan Balance Calculator (Screenshot-First + FX)
- **Summary:** Shipped Loan Balance Calculator on existing catalog slug `loan-balance-calculator` (`LoanBalanceCalculator`, catalog `6af46f0fa27d8d1d4e98ff56`). Screenshot fields only: loan principal, interest rate %, loan term yrs/mos, period yrs/mos → loan remaining. Standard monthly amortization remaining-balance formula. Independent FX on loan + loan remaining (Margin Interest pattern). Activated.
- **Example:** 100,000 PKR / 6% / 10 yrs / period 3 yrs → monthly ≈ 1,110.21; remaining ≈ 75,996.91 PKR (full-precision formula; screenshot note of ~76,717 not used).
- **Important Files:** `frontend/src/tools/calculators/loan-balance/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-loan-balance-tool.ts`, `brain/*`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Land Loan Calculator
- **Summary:** Shipped Land Loan Calculator on existing catalog slug `land-loan-calculator` (`LandLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff55`). Screenshot fields: land value, down payment % (default 10), bidirectional down payment amount, loan value, APR, yrs/mos term, payment frequency (Monthly default), number of payments; results periodic payment / total payment / total interest / periodic rate. Independent FX on all six monetary selectors. Activated.
- **Example:** 100,000 / 10% / 5 yrs / 6% / Monthly → down 10,000; loan 90,000; N 60; periodic rate 0.5%; payment ≈ 1,739.59; total ≈ 104,375.40; interest ≈ 14,375.40.
- **Important Files:** `frontend/src/tools/calculators/land-loan/*`, registries, `CURRENCY_CONVERSION_SLUGS`, sitemap, `backend/src/scripts/assign-land-loan-tool.ts`, `brain/*`.
- **Verification:** Mongo activation verified. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — FHA Loan Calculator
- **Summary:** Shipped FHA Loan Calculator on existing catalog slug `fha-loan-calculator` (`FhaLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff53`). Screenshot fields only; fixed 1.75% upfront MIP; monthly mortgage on base loan only; constant monthly MIP; total cost = total monthly × n. Independent FX on home price + eight monetary results. Activated.
- **Example:** 200,000 / 10% / 30 yrs / 3% / 0.85% MIP → down 20,000; base 180,000; upfront 3,150; mortgage ≈ 758.89; monthly MIP 127.50; total monthly ≈ 886.39; cost ≈ 319,099.41.
- **Important Files:** `frontend/src/tools/calculators/fha-loan/*`, registries, `CURRENCY_CONVERSION_SLUGS`, sitemap, `backend/src/scripts/assign-fha-loan-tool.ts`, `brain/*`.
- **Verification:** Mongo activation verified; worked-example math inspected via `tsx`. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Early Loan Payoff Calculator
- **Summary:** Shipped Early Loan Payoff Calculator on existing catalog slug `early-loan-payoff-calculator` (`EarlyLoanPayoffCalculator`, catalog `6af46f0fa27d8d1d4e98ff51`). Level + equal-principal decreasing schedules, extra monthly payments with baseline interest savings, balances chart (3 series), yearly repayment table, independent FX on loan balance + extra payment (normalize extra into loan currency). Balloon checkbox present but blocks results until a residual convention is confirmed. Activated.
- **Example:** 10,000 PKR / 10 yrs / 7.5% monthly compounding / no extra → monthly ≈ 118.70; total ≈ 14,244; interest ≈ 4,244.
- **Important Files:** `frontend/src/tools/calculators/early-loan-payoff/*`, registries, `CURRENCY_CONVERSION_SLUGS`, sitemap, `backend/src/scripts/assign-early-loan-payoff-tool.ts`, `brain/*`.
- **Verification:** Mongo activation verified; worked-example math inspected via `tsx`. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Boat Loan Calculator
- **Summary:** Shipped Boat Loan Calculator on existing catalog slug `boat-loan-calculator` (`BoatLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff4e`). Screenshot fields only: loan amount (empty default), term (5 yrs/mos), annual rate (5%), monthly payment, total interest. Independent FX on principal / payment / interest (Margin Interest pattern). Amortizing formula with zero-rate path. Activated.
- **Example:** 100,000 PKR / 5 yrs / 5% → payment ≈ 1,887.12; interest ≈ 13,227.40.
- **Important Files:** `frontend/src/tools/calculators/boat-loan/*`, registries, `CURRENCY_CONVERSION_SLUGS`, sitemap, `backend/src/scripts/assign-boat-loan-tool.ts`, `brain/*`.
- **Verification:** Mongo activation verified; worked-example math inspected via `tsx`. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Days to Years Calculator
- **Summary:** Shipped Days to Years Calculator on existing catalog slug `days-to-years-calculator` (`DaysToYearsCalculator`, catalog `6af46f17a27d8d1d4e990ba8`). Reuses Day Converter conversion engine; bidirectional days↔years via average Gregorian year 365.2425; common vs leap year guide and FAQs. Null pillar/subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-290 delivery for Conversion & Units time converter.
- **Important Files:** `frontend/src/tools/calculators/days-to-years/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-days-to-years-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Days to Weeks Calculator
- **Summary:** Shipped Days to Weeks Calculator on existing catalog slug `days-to-weeks-calculator` (`DaysToWeeksCalculator`, catalog `6af46f17a27d8d1d4e990ba7`). Reuses Day Converter conversion engine; bidirectional days↔weeks (exact ÷7); other quantities accordion; interactive examples; days 1–100 and weeks charts; combined HMS; FAQs. Null pillar/subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-289 delivery for Conversion & Units time converter.
- **Important Files:** `frontend/src/tools/calculators/days-to-weeks/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-days-to-weeks-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Days to Months Calculator
- **Summary:** Shipped Days to Months Calculator on existing catalog slug `days-to-months-calculator` (`DaysToMonthsCalculator`, catalog `6af46f17a27d8d1d4e990ba6`). Reuses Day Converter conversion engine; bidirectional days↔months; other units accordion; interactive examples; combined HMS; calendar month-length table and FAQs. Null pillar/subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-288 delivery for Conversion & Units time converter.
- **Important Files:** `frontend/src/tools/calculators/days-to-months/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-days-to-months-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Day Converter
- **Summary:** Shipped Day Converter on existing catalog slug `day-converter` (`DayConverter`, catalog `6af46f17a27d8d1d4e990ba5`). Bidirectional days ↔ years/months/weeks/hours/minutes/seconds; Gregorian averages 365.2425 d/yr and 30.436875 d/mo; fixed day subdivisions; combined HMS without 24 h wrap; guide and FAQs. Null pillar/subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-287 delivery for Conversion & Units time converter.
- **Important Files:** `frontend/src/tools/calculators/day-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-day-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cups to Quarts Converter
- **Summary:** Shipped Cups to Quarts Converter on existing catalog slug `cups-to-quarts-converter` (`CupsToQuartsConverter`, catalog `6af46f17a27d8d1d4e990b35`). Bidirectional cups ↔ quarts via liters; US customary/legal, metric, and UK cups; US liquid, US dry, and imperial quarts; conversion chart and FAQs. Null pillar/subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-286 delivery for Conversion & Units kitchen/volume converter.
- **Important Files:** `frontend/src/tools/calculators/cups-to-quarts/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cups-to-quarts-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cups to Pints Converter
- **Summary:** Shipped Cups to Pints Converter on existing catalog slug `cups-to-pints-converter` (`CupsToPintsConverter`, catalog `6af46f17a27d8d1d4e990b34`). Bidirectional cups ↔ pints via liters; US customary/legal, metric, and UK cups; US liquid, US dry, and imperial pints; conversion chart and FAQs. Null pillar/subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-285 delivery for Conversion & Units kitchen/volume converter.
- **Important Files:** `frontend/src/tools/calculators/cups-to-pints/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cups-to-pints-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cups to Oz Converter
- **Summary:** Shipped Cups to Oz Converter on existing catalog slug `cups-to-oz-converter` (`CupsToOzConverter`, catalog `6af46f17a27d8d1d4e990b33`). Bidirectional cups ↔ fluid ounces via liters; US customary/legal, metric, and UK cups; US and imperial fl oz; fluid-oz≠weight-oz copy; conversion chart and FAQs. Null pillar/subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-284 delivery for Conversion & Units kitchen/volume converter.
- **Important Files:** `frontend/src/tools/calculators/cups-to-oz/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cups-to-oz-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cups to Gallons Converter
- **Summary:** Shipped Cups to Gallons Converter on existing catalog slug `cups-to-gallons-converter` (`CupsToGallonsConverter`, catalog `6af46f17a27d8d1d4e990ac7`). Bidirectional cups ↔ gallons via liters; US customary/legal, metric, and UK cups; US/UK gallons; More Conversion Options; conversion chart and FAQs. Pillar `6af451d0a27d8d1d4e98f9e1` / null subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-283 delivery for Conversion & Units kitchen/volume converter.
- **Important Files:** `frontend/src/tools/calculators/cups-to-gallons/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cups-to-gallons-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cubic Meter to Ton Converter
- **Summary:** Shipped Cubic Meter to Ton Converter on existing catalog slug `cubic-meter-to-ton-converter` (`CubicMeterToTonConverter`, catalog `6af46f17a27d8d1d4e990ade`). Density-based bidirectional m³ ↔ metric/US/UK tons; default Liquids / fresh water 4 °C / 1000 kg/m³; material lookup and custom density; guide/FAQs with density table. Pillar `6af451d0a27d8d1d4e98f9e3` / null subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-282 delivery for Conversion & Units volume-to-mass calculator.
- **Important Files:** `frontend/src/tools/calculators/cubic-meter-to-ton/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cubic-meter-to-ton-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cubic Inches to Gallons Converter
- **Summary:** Shipped Cubic Inches to Gallons Converter on existing catalog slug `cubic-inches-to-gallons-converter` (`CubicInchesToGallonsConverter`, catalog `6af46f17a27d8d1d4e990ac6`). Bidirectional in³ ↔ US/UK gallons ↔ other units (L/mL/cm³/m³/ft³); exact 231 in³ per US gal and 4.54609 L per UK gal; empty default; guide/FAQs. Pillar `6af451d0a27d8d1d4e98f9e1` / null subPillar preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-281 delivery for Conversion & Units volume converter.
- **Important Files:** `frontend/src/tools/calculators/cubic-inches-to-gallons/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cubic-inches-to-gallons-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cubic Feet to Pounds Calculator
- **Summary:** Shipped Cubic Feet to Pounds Calculator on existing catalog slug `cubic-feet-to-pounds-calculator` (`CubicFeetToPoundsCalculator`, catalog `6af46f17a27d8d1d4e990af9`). Density-based bidirectional ft³ ↔ lb; default Non-metals / Concrete / 149.83 lb/ft³; material categories and custom density; density units lb/ft³, kg/m³, g/cm³, lb/in³, kg/L; guide/FAQs. Pillar `6af451d1a27d8d1d4e98f9e6` / subPillar `6af451d1a27d8d1d4e98f9e7` preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-280 delivery for Conversion & Units volume-to-mass calculator.
- **Important Files:** `frontend/src/tools/calculators/cubic-feet-to-pounds/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cubic-feet-to-pounds-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cubic Feet to Gallons Converter
- **Summary:** Shipped Cubic Feet to Gallons Converter on existing catalog slug `cubic-feet-to-gallons-converter` (`CubicFeetToGallonsConverter`, catalog `6af46f17a27d8d1d4e990af8`). Bidirectional ft³ ↔ US/UK gallons via exact cubic-meter factors; default US gal; conversion tables and FAQs. Pillar `6af451d1a27d8d1d4e98f9e6` / subPillar `6af451d1a27d8d1d4e98f9e7` preserved. Meta description kept ≤160. `indexable` left false.
- **Why:** TOOL-279 delivery for Conversion & Units volume converter.
- **Important Files:** `frontend/src/tools/calculators/cubic-feet-to-gallons/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cubic-feet-to-gallons-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cubic Feet to Cubic Meters Converter
- **Summary:** Shipped Cubic Feet to Cubic Meters Converter on existing catalog slug `cubic-feet-to-cubic-meters-converter` (`CubicFeetToCubicMetersConverter`, catalog `6af46f17a27d8d1d4e990af7`). Bidirectional ft³ ↔ m³ via reused `cubic-feet` helpers (exact 1 ft³ = 0.028316846592 m³); More Conversion Options (cm³/L/mL/US gal/in³/yd³); conversion table and FAQs. Pillar `6af451d1a27d8d1d4e98f9e6` / subPillar `6af451d1a27d8d1d4e98f9e7` preserved. Meta description shortened to schema maxLength 160. `indexable` left false.
- **Why:** TOOL-278 delivery for Conversion & Units volume converter.
- **Important Files:** `frontend/src/tools/calculators/cubic-feet-to-cubic-meters/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cubic-feet-to-cubic-meters-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add CM to MM Converter
- **Summary:** Shipped CM to MM Converter on existing catalog slug `cm-to-mm-converter` (`CmToMmConverter`, catalog `6af46f17a27d8d1d4e990b82`). Bidirectional cm ↔ mm via `centimeter/units` convertLength (exact 1 cm = 10 mm); conversion table and FAQs. Null pillar/subPillar preserved. Meta title shortened to schema maxLength 70. `indexable` left false.
- **Why:** TOOL-277 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/cm-to-mm/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cm-to-mm-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned on retry (`isDeveloped: true`; metaDescription trimmed to ≤160). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add CM to M Converter
- **Summary:** Shipped CM to M Converter on existing catalog slug `cm-to-m-converter` (`CmToMConverter`, catalog `6af46f17a27d8d1d4e990b81`). Bidirectional cm ↔ m via `centimeter/units` convertLength (exact 1 m = 100 cm); Other units selector defaults to inches; conversion table and FAQs. Null pillar/subPillar preserved. Meta title shortened to schema maxLength 70. `indexable` left false.
- **Why:** TOOL-276 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/cm-to-m/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cm-to-m-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add CM to KM Conversion
- **Summary:** Shipped CM to KM Conversion on existing catalog slug `cm-to-km-conversion` (`CmToKmConverter`, catalog `6af46f17a27d8d1d4e990b80`). Bidirectional cm ↔ km via `centimeter/units` convertLength (exact 1 km = 100,000 cm); collapsed Other metric/imperial units; conversion table and FAQs. Null pillar/subPillar preserved. Meta title shortened to schema maxLength 70. `indexable` left false.
- **Why:** TOOL-275 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/cm-to-km/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cm-to-km-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add CM to IN Converter
- **Summary:** Shipped CM to IN Converter on existing catalog slug `cm-to-in-converter` (`CmToInConverter`, catalog `6af46f17a27d8d1d4e990b7f`). Bidirectional cm ↔ in via reused `cm-height-conversion` helpers (exact 1 in = 2.54 cm); negatives rejected; conversion table and FAQs. Null pillar/subPillar preserved. Meta title shortened to schema maxLength 70. `indexable` left false.
- **Why:** TOOL-274 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/cm-to-in/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cm-to-in-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add CM to Ft In Converter
- **Summary:** Shipped CM to Ft In Converter on existing catalog slug `cm-to-ft-in-converter` (`CmToFtInConverter`, catalog `6af46f17a27d8d1d4e990b7e`). Bidirectional cm ↔ mixed feet/inches via reused `cm-height-conversion` helpers (exact 2.54 / 30.48); inches normalized 0–&lt;12; conversion table and FAQs. Null pillar/subPillar preserved. Meta title shortened to schema maxLength 70. `indexable` left false.
- **Why:** TOOL-273 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/cm-to-ft-in/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cm-to-ft-in-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Cent to Square Meter Converter
- **Summary:** Shipped Cent to Square Meter Converter on existing catalog slug `cent-to-square-meter-converter` (`CentToSquareMeterConverter`, catalog `6af46f17a27d8d1d4e990adc`). Bidirectional cent ↔ m² ↔ ft² via exact 1 cent = 40.468564224 m² = 435.6 ft²; negative areas rejected; conversion table and FAQs. Pillar `6af451d0a27d8d1d4e98f9e3` / null subPillar preserved when live matches brief. Meta title shortened to schema maxLength 70.
- **Why:** TOOL-272 delivery for Conversion & Units land-area converter.
- **Important Files:** `frontend/src/tools/calculators/cent-to-square-meter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cent-to-square-meter-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Centimeter Calculator
- **Summary:** Shipped Centimeter Calculator on existing catalog slug `centimeter-calculator` (`CentimeterCalculator`, catalog `6af46f17a27d8d1d4e990b7c`). Primary cm with collapsible Imperial/US and Metric groups, other-unit selectors (thou/fathom/… and µm/nm/…); exact meter-base factors; conversion table and FAQs. Null pillar/subPillar preserved. Meta title shortened to schema maxLength 70.
- **Why:** TOOL-271 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/centimeter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-centimeter-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add CM Height Conversion Calculator
- **Summary:** Shipped CM Height Conversion Calculator on existing catalog slug `cm-height-conversion-calculator` (`CmHeightConversionCalculator`, catalog `6af46f17a27d8d1d4e990b7d`). Bidirectional cm ↔ feet/inches with Other Units (m, mm, total in, decimal ft); exact 2.54 / 30.48; collapsed accordion; height chart and FAQs. Null pillar/subPillar preserved.
- **Why:** TOOL-270 delivery for Conversion & Units height converter.
- **Important Files:** `frontend/src/tools/calculators/cm-height-conversion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cm-height-conversion-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 61/153). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Metric to SAE Calculator
- **Summary:** Shipped Metric to SAE Calculator on existing catalog slug `metric-to-sae-calculator` (`MetricToSaeCalculator`, catalog `6af46f17a27d8d1d4e990b05`). Eight synchronized fields (mm/cm/m/km ↔ in/ft/yd/mi) via meter base; collapsible Metric/SAE groups; wrench size chart with safety note. Live pillar `6af451d1a27d8d1d4e98f9e8` preserved (brief listed …d2…98f8e8); subPillar null.
- **Why:** TOOL-269 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/metric-to-sae/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-metric-to-sae-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; live pillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Centigrade to Celsius Converter
- **Summary:** Shipped Centigrade to Celsius Converter on existing catalog slug `centigrade-to-celsius-converter` (`CentigradeToCelsiusConverter`, catalog `6af46f17a27d8d1d4e990b2d`). Identity °C = °centigrade; absolute-zero validation; chart and FAQs. Pillar `6af451d3a27d8d1d4e98f9f1` preserved (brief typo …d32…); subPillar null.
- **Why:** TOOL-268 delivery for Conversion & Units temperature converter.
- **Important Files:** `frontend/src/tools/calculators/centigrade-to-celsius/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-centigrade-to-celsius-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Celsius to Fahrenheit Converter
- **Summary:** Shipped Celsius to Fahrenheit Converter on existing catalog slug `celsius-to-fahrenheit-converter` (`CelsiusToFahrenheitConverter`, catalog `6af46f17a27d8d1d4e990b19`). Bidirectional °C↔°F via °F = (°C × 9/5) + 32; absolute-zero validation; conversion chart and FAQs. Live pillar `6af451d2a27d8d1d4e98f9ec` preserved (brief truncated …98fec); subPillar null.
- **Why:** TOOL-267 delivery for Conversion & Units temperature converter.
- **Important Files:** `frontend/src/tools/calculators/celsius-to-fahrenheit/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-celsius-to-fahrenheit-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; live pillar preserved). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Metric to Imperial Converter
- **Summary:** Shipped Metric to Imperial Converter on existing catalog slug `metric-to-imperial-converter` (`MetricToImperialConverter`, catalog `6af46f17a27d8d1d4e990b03`). Six categories (length/area/volume/mass/temperature/speed) with bidirectional metric↔imperial fields; US vs UK volume distinguished. Live pillar `6af451d1a27d8d1d4e98f9e8` preserved vs brief …d2…; subPillar null. Meta title shortened to schema maxLength 70.
- **Why:** TOOL-266 delivery for Conversion & Units metric↔imperial converter.
- **Important Files:** `frontend/src/tools/calculators/metric-to-imperial/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-metric-to-imperial-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; live pillar preserved; meta 60/142). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Celsius Converter
- **Summary:** Shipped Celsius Converter on existing catalog slug `celsius-converter` (`CelsiusConverter`, catalog `6af46f17a27d8d1d4e990b2c`). Eight-scale bidirectional temperature converter with Celsius internal reference (°C/°F/K/°R/°De/°N/°Ré/°Rø); absolute-zero validation; Celsius + other-units sections. Pillar `6af451d3a27d8d1d4e98f9f1` / null subPillar preserved. Meta title shortened to schema maxLength 70.
- **Why:** TOOL-265 delivery for Conversion & Units temperature converter.
- **Important Files:** `frontend/src/tools/calculators/celsius-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-celsius-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar as expected; meta 58/128). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Metric Converter
- **Summary:** Shipped Metric Converter on existing catalog slug `metric-converter` (`MetricConverter`, catalog `6af46f17a27d8d1d4e990b01`). Multi-category converter (length default with metric/imperial/other accordions; mass, area, volume, temperature affine, speed, time, energy, power, pressure, data storage decimal/binary). Live pillar `6af451d1a27d8d1d4e98f9e8` preserved vs brief …d2…; subPillar null. Meta title shortened to schema maxLength 70.
- **Why:** TOOL-264 delivery for Conversion & Units multi-dimension metric converter.
- **Important Files:** `frontend/src/tools/calculators/metric-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-metric-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; live pillar preserved; meta 58/148). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add CC to OZ Converter
- **Summary:** Shipped CC to OZ Converter on existing catalog slug `cc-to-oz-converter` (`CcToOzConverter`, catalog `6af46f17a27d8d1d4e990b32`). Exact bidirectional cc↔fluid oz via US 29.5735295625 and UK 28.4130625; volume only (not weight oz); empty default. Null pillar/subPillar preserved. Meta title shortened to schema maxLength 70.
- **Why:** TOOL-263 delivery for Conversion & Units volume converter.
- **Important Files:** `frontend/src/tools/calculators/cc-to-oz/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cc-to-oz-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 52/154). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Meter to Mile Converter
- **Summary:** Shipped Meter to Mile Converter on existing catalog slug `meter-to-mile-converter` (`MeterToMileConverter`, catalog `6af46f17a27d8d1d4e990b0a`). Exact bidirectional m↔mi via international statute mile (1 mi = 1609.344 m); Metric/Imperial sections; empty default. Live pillar `6af451d1a27d8d1d4e98f9e9` preserved vs brief …d2…; subPillar null.
- **Why:** TOOL-262 delivery for Conversion & Units distance converter.
- **Important Files:** `frontend/src/tools/calculators/meter-to-mile/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-meter-to-mile-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; live pillar preserved; meta 53/148). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add cc to mL Converter
- **Summary:** Shipped cc to mL Converter on existing catalog slug `cc-to-ml-converter` (`CcToMlConverter`, catalog `6af46f17a27d8d1d4e990b31`). Three-way cc↔mL↔L with exact 1 cc = 1 mL; empty default. Null pillar/subPillar preserved. Meta title shortened to schema maxLength 70.
- **Why:** TOOL-261 delivery for Conversion & Units volume converter.
- **Important Files:** `frontend/src/tools/calculators/cc-to-ml/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cc-to-ml-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 50/147). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Meters to Feet Converter
- **Summary:** Shipped Meters to Feet Converter on existing catalog slug `meters-to-feet-converter` (`MetersToFeetConverter`, catalog `6af46f17a27d8d1d4e990ae0`). Exact bidirectional m↔ft via international foot (1 ft = 0.3048 m); empty default; signed values allowed. Pillar `6af451d0a27d8d1d4e98f9e3` / null subPillar preserved.
- **Why:** TOOL-260 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/meters-to-feet/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-meters-to-feet-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar as expected; meta 54/152). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add cc to Liter Converter
- **Summary:** Shipped cc to Liter Converter on existing catalog slug `cc-to-liter-converter` (`CcToLiterConverter`, catalog `6af46f17a27d8d1d4e990b30`). Exact bidirectional cc↔L (1 L = 1000 cc); empty default; cm³/cc/mL label select. Null pillar/subPillar preserved.
- **Why:** TOOL-259 delivery for Conversion & Units volume converter.
- **Important Files:** `frontend/src/tools/calculators/cc-to-liter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cc-to-liter-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 52/159). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Meter Converter
- **Summary:** Shipped Meter Converter on existing catalog slug `meter-converter` (`MeterConverter`, catalog `6af46f17a27d8d1d4e990adb`). SI meter base with metric/imperial/other accordions, extra-unit selectors, and specialized units (nmi, R☉, ly, AU, Å, pc). Omni “kilotors” omitted. Pillar `6af451d0a27d8d1d4e98f9e3` / null subPillar preserved.
- **Why:** TOOL-258 delivery for Conversion & Units length converter.
- **Important Files:** `frontend/src/tools/calculators/meter-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-meter-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar as expected; meta 68/136). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add CC to Grams Converter
- **Summary:** Shipped CC to Grams Converter on existing catalog slug `cc-to-grams-converter` (`CcToGramsConverter`, catalog `6af46f17a27d8d1d4e990b2f`). Density-based bidirectional volume↔mass (internal g/cm³ + cc + g); Water ≈1 g/cm³ near 4 °C; ingredient presets + custom density; multi-unit density/volume/mass with physical-quantity preservation. Null pillar/subPillar preserved.
- **Why:** TOOL-257 delivery for Conversion & Units density converter.
- **Important Files:** `frontend/src/tools/calculators/cc-to-grams/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cc-to-grams-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 41/131). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Measurement Converter
- **Summary:** Shipped Measurement Converter on existing catalog slug `measurement-converter` (`MeasurementConverter`, catalog `6af46f17a27d8d1d4e990b91`). Extensible multi-dimension registry (length through angle), conversion-factor panel, precision modes, affine temperature, dimensional mismatch rejection. Null pillar/subPillar preserved.
- **Example:** 1500 m = 1.5 km; 100 km/h ≈ 27.7778 m/s; 0 °C = 32 °F; 1 bar = 100,000 Pa; 1 kWh = 3,600,000 J.
- **Important Files:** `frontend/src/tools/calculators/measurement-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-measurement-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 41/142). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Bar to PSIG Converter
- **Summary:** Shipped Bar to PSIG Converter on existing catalog slug `bar-to-psig-converter` (`BarToPsigConverter`, catalog `6af46f17a27d8d1d4e990b9c`). Absolute/gauge bar↔PSIG using factor 14.5037738007; editable atmospheric pressure (default 1.01325 bar); negative gauge/PSIG allowed; absolute negatives rejected. Null pillar/subPillar preserved.
- **Example:** 10 bar(a) ≈ 130.34 PSIG; 1.01325 bar(a) = 0 PSIG; 5 bar(g) ≈ 72.5189 PSIG; 100 PSIG ≈ 7.90799 bar(a).
- **Important Files:** `frontend/src/tools/calculators/bar-to-psig/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-bar-to-psig-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 41/149). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add mcg to mL Conversion
- **Summary:** Shipped mcg to mL Conversion on existing catalog slug `mcg-to-ml-conversion` (`McgToMlConverter`, catalog `6af46f17a27d8d1d4e990b50`). Medication concentration (example Vitamin B12 1,000 mcg/mL or custom) and density modes; never a fixed mcg↔mL factor; medication safety notice. Null pillar/subPillar preserved.
- **Example:** 500 mcg at 1,000 mcg/mL → 0.5 mL; 2 mL × 1,000 mcg/mL = 2,000 mcg; 1,000,000 mcg at 1 g/mL → 1 mL.
- **Important Files:** `frontend/src/tools/calculators/mcg-to-ml/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mcg-to-ml-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 40/141). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Bar to PSI Conversion
- **Summary:** Shipped Bar to PSI Conversion on existing catalog slug `bar-to-psi-conversion` (`BarToPsiConverter`, catalog `6af46f17a27d8d1d4e990ae4`). Bidirectional bar↔psi using Pa factors 100000 / ≈6894.757293; unit selectors; absolute negatives rejected. PSI Converter pillar preserved; subPillar null.
- **Example:** 1 bar ≈ 14.503774 psi; 3 bar ≈ 43.511321 psi; 45 bar ≈ 652.669820 psi; 100 psi ≈ 6.894757 bar.
- **Important Files:** `frontend/src/tools/calculators/bar-to-psi/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-bar-to-psi-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e4`, subPillar null; meta 41/140). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add L to gal Converter
- **Summary:** Shipped L to gal Converter on existing catalog slug `l-to-gal-converter` (`LToGalConverter`, catalog `6af46f17a27d8d1d4e990b47`). Bidirectional liters↔US/Imperial gallons using exact factors 3.785411784 / 4.54609; optional third unit (default US fl oz); unit switches preserve volume; negatives rejected. Null pillar/subPillar preserved.
- **Example:** 1 L ≈ 0.264172 US gal; 7 L ≈ 1.849204 US gal; 3 US gal = 11.356235352 L; 1 Imperial gal = 4.54609 L.
- **Important Files:** `frontend/src/tools/calculators/l-to-gal/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-l-to-gal-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 38/142). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Bar to ATM Conversion
- **Summary:** Shipped Bar to ATM Conversion on existing catalog slug `bar-to-atm-conversion` (`BarToAtmConverter`, catalog `6af46f17a27d8d1d4e990aed`). Bidirectional bar↔atm using exact Pa factors 100000/101325; default 1 bar; absolute negatives rejected. ATM pillar preserved; subPillar null.
- **Example:** 1 bar ≈ 0.986923 atm; 3 bar ≈ 2.960770 atm; 1 atm = 1.01325 bar; 5 atm = 5.06625 bar.
- **Important Files:** `frontend/src/tools/calculators/bar-to-atm/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-bar-to-atm-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d1a27d8d1d4e98f9e5`, subPillar null; meta 41/155). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Lot Size to Square Feet Calculator
- **Summary:** Shipped Lot Size to Square Feet Calculator on existing catalog slug `lot-size-to-square-feet-calculator` (`LotSizeToSqftCalculator`, catalog `6af46f17a27d8d1d4e990afe`). Width×length→ft² with multi-unit length/area, reverse solve, optional Unit and total price; default 50×100 ft. Pillar and subPillar preserved.
- **Example:** 50×100 ft = 5,000 ft²; 24×18 ft = 432 ft²; 15×12 yd = 1,620 ft²; 5,000 ft² × $20/ft² = $100,000.
- **Important Files:** `frontend/src/tools/calculators/lot-size-to-sqft/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-lot-size-to-sqft-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; live pillar `6af451d1a27d8d1d4e98f9e6` preserved vs brief …d2…; subPillar `6af46f0fae6d84bd3ef8f7e3`; meta 54/149). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Barometric Pressure Conversion
- **Summary:** Shipped Barometric Pressure Conversion on existing catalog slug `barometric-pressure-conversion` (`BarometricPressureConverter`, catalog `6af46f17a27d8d1d4e990b9d`). Four primary fields (atm/bar/Pa/psi) with shared Pa base and more-options units; default 1 atm; reuses pressure-conversion factors (Torr ≠ mmHg). Null pillar/subPillar preserved.
- **Example:** 1 atm = 101,325 Pa = 1.01325 bar ≈ 14.69595 psi; 1 hPa = 1 mbar; 12 bar ≈ 11.84308 atm.
- **Important Files:** `frontend/src/tools/calculators/barometric-pressure/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-barometric-pressure-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 50/154). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Lot Size to Acres Calculator
- **Summary:** Shipped Lot Size to Acres Calculator on existing catalog slug `lot-size-to-acres-calculator` (`LotSizeToAcresCalculator`, catalog `6af46f17a27d8d1d4e990b8f`). Width×length→acres with multi-unit length/area, reverse solve for missing side, optional Unit and total price; default 150×175 yd. Null pillar/subPillar preserved.
- **Example:** 150 yd × 175 yd ≈ 5.42355 ac; 100 ft × 200 ft = 20,000 ft² ≈ 0.45914 ac; 1 ac / 100 ft width → length 435.6 ft; 2 ac × $50,000/ac = $100,000.
- **Important Files:** `frontend/src/tools/calculators/lot-size-to-acres/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-lot-size-to-acres-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 48/149). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add ATM to Pascals Conversion
- **Summary:** Shipped ATM to Pascals Conversion on existing catalog slug `atm-to-pascals-conversion` (`AtmToPascalsConverter`, catalog `6af46f17a27d8d1d4e990aec`). Bidirectional atm↔Pa using exact factor 101,325; default 1 atm; absolute negatives rejected. Existing pillar preserved; subPillar null.
- **Example:** 1 atm = 101,325 Pa; 2.5 atm = 253,312.5 Pa; 202,650 Pa = 2 atm.
- **Important Files:** `frontend/src/tools/calculators/atm-to-pascals/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-atm-to-pascals-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d1a27d8d1d4e98f9e5`, subPillar null; meta 45/138). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Liter to cc Converter
- **Summary:** Shipped Liter to cc Converter on existing catalog slug `liter-to-cc-converter` (`LiterToCcConverter`, catalog `6af46f17a27d8d1d4e990b4c`). Bidirectional L↔cc using exact factor 1000; default 1 L; swap field order; negatives rejected. Null pillar/subPillar preserved.
- **Example:** 1 L = 1000 cc; 2.5 L = 2500 cc; 500 cc = 0.5 L.
- **Important Files:** `frontend/src/tools/calculators/liter-to-cc/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-liter-to-cc-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 41/131). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add ATM Conversion
- **Summary:** Shipped ATM Conversion on existing catalog slug `atm-conversion` (`AtmConversionCalculator`, catalog `6af46f17a27d8d1d4e990aeb`). Synced atm/bar/psi/Pa via Pa canonical; exact 1 atm = 101,325 Pa; PSI factor 6894.757293168; default 1 atm; negatives flagged as gauge-relative. Existing pillar preserved; subPillar null.
- **Example:** 1 atm = 1.01325 bar ≈ 14.6959488 psi = 101,325 Pa; 100,000 Pa = 1 bar.
- **Important Files:** `frontend/src/tools/calculators/atm-conversion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-atm-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d1a27d8d1d4e98f9e5`, subPillar null; meta 34/138). Full frontend `tsc` / production build not claimed. Optional extra units (kPa/mmHg/…) not added (ponytail; primary four match screenshot).

### 2026-11-16 — Add Liters to Pounds Calculator
- **Summary:** Shipped Liters to Pounds Calculator on existing catalog slug `liters-to-pounds-calculator` (`LitersToPoundsCalculator`, catalog `6af46f17a27d8d1d4e990b4e`). Density-based bidirectional L↔lb using exact 1 lb = 0.45359237 kg; category/ingredient presets; density units kg/m³–lb/ft³ via kg/L; default 5 L water @ 1000 kg/m³. Null pillar/subPillar preserved.
- **Example:** 5 L water @ 1 kg/L ≈ 11.023113 lb; 10 lb water ≈ 4.5359237 L.
- **Important Files:** `frontend/src/tools/calculators/liters-to-pounds/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-liters-to-pounds-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 47/142). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Angstrom to nm Converter
- **Summary:** Shipped Angstrom to nm Converter on existing catalog slug `angstrom-to-nm-converter` (`AngstromToNmConverter`, catalog `6af46f17a27d8d1d4e990b0e`). Three synced fields Å/nm/mil via nm canonical; exact 1 Å = 0.1 nm and 1 mil = 25,400 nm; scientific notation supported; default 14 Å. Existing pillar preserved; subPillar null.
- **Example:** 14 Å = 1.4 nm; 1 mil = 25,400 nm = 254,000 Å.
- **Important Files:** `frontend/src/tools/calculators/angstrom-to-nm/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-angstrom-to-nm-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d2a27d8d1d4e98f9ea`, subPillar null; meta 44/149). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Lbs to Stone Converter
- **Summary:** Shipped Lbs to Stone Converter on existing catalog slug `lbs-to-stone-converter` (`LbsToStoneConverter`, catalog `6af46f17a27d8d1d4e990b4b`). Bidirectional lb↔st using exact factor 14; default 140 lb; supplementary mixed stones+pounds readout; negatives rejected. Null pillar/subPillar preserved.
- **Example:** 140 lb = 10 st; 100 lb ≈ 7.142857143 st; 150 lb = 10 st 10 lb.
- **Important Files:** `frontend/src/tools/calculators/lbs-to-stone/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-lbs-to-stone-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 42/119). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Acres to Square Feet Converter
- **Summary:** Shipped Acres to Square Feet Converter on existing catalog slug `acres-to-square-feet-converter` (`AcresToSquareFeetConverter`, catalog `6af46f17a27d8d1d4e990afc`). Bidirectional ac↔ft² using exact factor 43,560; swap field order; default 1 acre; negatives rejected. Live pillar/subPillar preserved (brief pillar `…d2…` differed from Mongo `…d1…`).
- **Example:** 1 ac = 43,560 ft²; 0.5 ac = 21,780 ft²; 100 ft² ≈ 0.002295684 ac.
- **Important Files:** `frontend/src/tools/calculators/acres-to-square-feet/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-acres-to-square-feet-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d1a27d8d1d4e98f9e6`, subPillar `6af46f0fae6d84bd3ef8f7e3` preserved; meta 50/114). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Lbs to PSI Converter
- **Summary:** Shipped Lbs to PSI Converter on existing catalog slug `lbs-to-psi-converter` (`LbsToPsiConverter`, catalog `6af46f17a27d8d1d4e990ae7`). Bidirectional psf↔psi using exact factor 144; signed gauge/differential values allowed; clarifies that bare lbf is not pressure. Existing pillar preserved.
- **Example:** 144 psf = 1 psi; 100 psf ≈ 0.6944444444 psi; −144 psf = −1 psi.
- **Important Files:** `frontend/src/tools/calculators/lbs-to-psi/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-lbs-to-psi-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e4` preserved; meta 40/155). Full frontend `tsc` / production build not claimed. Optional force÷area mode not implemented (ponytail).

### 2026-11-16 — Add Acres to Hectares Converter
- **Summary:** Shipped Acres to Hectares Converter on existing catalog slug `acres-to-hectares-converter` (`AcresToHectaresConverter`, catalog `6af46f17a27d8d1d4e990b77`). Bidirectional ac↔ha using exact factor 0.40468564224; swap field order; default 10 acres; negative/blank validation.
- **Example:** 10 ac = 4.0468564224 ha; 1 ha ≈ 2.47105381467 ac.
- **Important Files:** `frontend/src/tools/calculators/acres-to-hectares/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-acres-to-hectares-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 47/154). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Lowercase to Uppercase Converter
- **Summary:** Shipped Lowercase to Uppercase Converter on existing catalog slug `lowercase-to-uppercase-converter` (`LowercaseToUppercaseConverter`, catalog `6af46f17a27d8d1d4e990bec`). Instant client-side `toUpperCase()` (default) with optional lowercase/title/sentence/toggle modes; Unicode code-point stats; copy/share.
- **Example:** `hello world` → `HELLO WORLD`; `straße` → `STRASSE`.
- **Important Files:** `frontend/src/tools/calculators/lowercase-to-uppercase/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-lowercase-to-uppercase-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 52/148). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Weird Units Converter
- **Summary:** Shipped Weird Units Converter on existing catalog slug `weird-units-converter` (`WeirdUnitsConverter`, catalog `6af46f17a27d8d1d4e990bf2`). Five categories (length/mass/time/area/volume) with documented weird references; bidirectional regular↔weird; CSS comparison; approximate biological/lifestyle refs labeled. Meta title shortened for schema maxLength 70.
- **Example:** 100 m ≈ 10,416.67 LEGO brick heights (9.6 mm studs-up); 1 km = 20 Olympic pool lengths.
- **Important Files:** `frontend/src/tools/calculators/weird-units/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-weird-units-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 59/145). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Leet-speak Translator
- **Summary:** Shipped Leet-speak Translator on existing catalog slug `leet-speak-translator` (`LeetSpeakTranslator`, catalog `6af46f17a27d8d1d4e990beb`). Bidirectional text↔leet with Classic (default) and Basic profiles; reverse uses 1→I and is labeled approximate. No multi-character Advanced ASCII style.
- **Example:** Classic `HELLO` → `H3110`; Basic `HELLO` → `H3LL0`; reverse `H3110` → `HEIIO`.
- **Important Files:** `frontend/src/tools/calculators/leet-speak/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-leet-speak-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned on retry (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 64/146). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Uppercase to Lowercase Converter
- **Summary:** Shipped Uppercase to Lowercase Converter on existing catalog slug `uppercase-to-lowercase-converter` (`UppercaseToLowercaseConverter`, catalog `6af46f17a27d8d1d4e990bf1`). Instant client-side `toLowerCase()`, multiline/Unicode/emoji preservation, character/word/line stats, copy/share. Meta title shortened for schema maxLength 70.
- **Example:** `HELLO WORLD` → `hello world`; `CAFÉ ÜBER` → `café über`.
- **Important Files:** `frontend/src/tools/calculators/uppercase-to-lowercase/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-uppercase-to-lowercase-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 64/151). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Knots to mph Converter
- **Summary:** Shipped Knots to mph Converter on existing catalog slug `knots-to-mph-converter` (`KnotsToMphConverter`, catalog `6af46f17a27d8d1d4e990c0a`). Five visible synced fields (kn/mph/km/h/ft/s/m/s) via shared speed m/s utilities; exact nautical/statute mile constants; Beaufort educational table.
- **Example:** 1 kn ≈ 1.150779448 mph; 10 kn ≈ 11.50779448 mph; 60 mph ≈ 52.13857453 kn.
- **Important Files:** `frontend/src/tools/calculators/knots-to-mph/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-knots-to-mph-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 70/142). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Temperature Conversion Calculator
- **Summary:** Shipped Temperature Conversion on existing catalog slug `temperature-conversion` (`TemperatureConversionCalculator`, catalog `6af46f17a27d8d1d4e990bf4`). Kelvin-canonical conversions for °C/°F/K plus Rankine/Réaumur/Rømer/Delisle/Newton; absolute-zero validation (incl. inverted Delisle). Meta title shortened for schema maxLength 70.
- **Example:** 0°C = 32°F = 273.15 K; 98.6°F ≈ 37°C; 300 K = 26.85°C.
- **Important Files:** `frontend/src/tools/calculators/temperature/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-temperature-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 59/140). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Knots to kph Converter
- **Summary:** Shipped Knots to kph Converter on existing catalog slug `knots-to-kph-converter` (`KnotsToKphConverter`, catalog `6af46f17a27d8d1d4e990c09`). Bidirectional kn↔km/h with exact 1.852 factor; expandable mph/m/s/ft/s via shared speed m/s utilities.
- **Example:** 10 kn = 18.52 km/h; 100 km/h ≈ 53.99568 kn.
- **Important Files:** `frontend/src/tools/calculators/knots-to-kph/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-knots-to-kph-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned on retry (`isDeveloped: true`, meta 58/141). Full frontend `tsc` / production build not claimed.

### 2026-11-16 — Add Speed Conversion Calculator
- **Summary:** Shipped Speed Conversion on existing catalog slug `speed-conversion` (`SpeedConversionCalculator`, catalog `6af46f17a27d8d1d4e990c0c`). Accordion groups for imperial/metric/other/run pace; m/s base; inverse pace (t = D/v); knots + vacuum c; Mach omitted. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 60 mph = 96.56064 km/h; 12 km/h → 5 min/km; 10 kn = 18.52 km/h.
- **Important Files:** `frontend/src/tools/calculators/speed/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-speed-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Conversion self-check passed (mph/km/h/m/s/knots/pace). Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 64/134). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch). Limitation: Mach not supported (medium/temperature dependent).

### 2026-11-16 — Add Joules to Volts Calculator
- **Summary:** Shipped Joules to Volts Calculator on existing catalog slug `joules-to-volts-calculator` (`JoulesToVoltsCalculator`, catalog `6af46f17a27d8d1d4e990bf8`). Three-way solve V=E/Q, E=VQ, Q=E/V with multi-unit energy/charge/voltage; signed values; division-by-zero guards; unit changes preserve SI quantity. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1000 J / 10 C = 100 V; 12 V × 5 C = 60 J; 240 J / 12 V = 20 C.
- **Important Files:** `frontend/src/tools/calculators/joules-to-volts/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-joules-to-volts-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 63/147). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch).

### 2026-11-16 — Add RMS to Watts Converter
- **Summary:** Shipped RMS to Watts Converter on existing catalog slug `rms-to-watts-converter` (`RmsToWattsConverter`, catalog `6af46f17a27d8d1d4e990bd0`). Primary bidirectional RMS↔peak for sinusoidal power waveforms (×√2); optional electrical-power accordion (V/I/PF, V/R, I/R, V_peak/R). Explicit non-universal amp-rating disclaimer. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 100 W RMS → ≈141.421 W peak; 120 V × 2 A × 0.8 PF = 192 W.
- **Important Files:** `frontend/src/tools/calculators/rms-to-watts/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-rms-to-watts-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 61/148). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch).

### 2026-11-16 — Add Hardness Conversion Calculator
- **Summary:** Shipped Hardness Conversion Calculator on existing catalog slug `hardness-conversion-calculator` (`HardnessConversionCalculator`, catalog `6af46f17a27d8d1d4e990bea`). Non-austenitic steel only; sparse ASTM E140-aligned soft (HRB) and hard (HRC) lookup tables; linear interpolation; no extrapolation; unavailable cells shown as em dash. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 40 HRC → 371 HBW / 392 HV; 300 HBW → ~32 HRC / ~317 HV (interpolated).
- **Important Files:** `frontend/src/tools/calculators/hardness/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-hardness-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 67/130 — title shortened to schema maxLength 70). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch). Limitation: no austenitic stainless / aluminum / copper / nickel tables; sparse educational chart (not a full licensed ASTM table dump).

### 2026-11-16 — Add Radiation Converter
- **Summary:** Shipped Radiation Converter on existing catalog slug `radiation-converter` (`RadiationConverter`, catalog `6af46f17a27d8d1d4e990bf0`). Independent accordion groups for absorbed dose (mGy/Gy/rad) and equivalent dose (µSv/mSv/rem); no universal Gy↔Sv conversion. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 250 mGy = 0.25 Gy = 25 rad; 50 mSv = 50,000 µSv = 5 rem.
- **Important Files:** `frontend/src/tools/calculators/radiation/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-radiation-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 59/140). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch). Limitation: no interactive w_R / tissue-weighting calculator (explained in guide).

### 2026-11-16 — Add Grams to Calories Calculator
- **Summary:** Shipped Grams to Calories Calculator on existing catalog slug `grams-to-calories-calculator` (`GramsToCaloriesCalculator`, catalog `6af46f17a27d8d1d4e990bf7`). Atwater factors (carbs/protein 4, fat 9, alcohol 7 kcal/g); alcohol modes grams / volume×ABV×0.789 / none (default); per-nutrient and total kcal with percentages. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 30 g carbs + 20 g protein + 10 g fat = 290 kcal; 355 mL at 5% ABV ≈ 14.00475 g ethanol ≈ 98.033 kcal.
- **Important Files:** `frontend/src/tools/calculators/grams-to-calories/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-grams-to-calories-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 48/154). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch).

### 2026-11-16 — Add Quarters to Dollars Calculator
- **Summary:** Shipped Quarters to Dollars Calculator on existing catalog slug `quarters-to-dollars-calculator` (`QuartersToDollarsCalculator`, catalog `6af46f17a27d8d1d4e990c04`). Bidirectional quarters↔dollars via integer-cent BigInt (1 quarter = 25¢ = $0.25; 4 quarters = $1); amounts not divisible by $0.25 show quarter-equivalents plus whole-coin remainder. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 25 quarters → $6.25; $10 → 40 quarters; $1.10 → 4.4 quarter-equivalents (4 whole + 10¢).
- **Important Files:** `frontend/src/tools/calculators/quarters-to-dollars/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-quarters-to-dollars-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 50/148). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch).

### 2026-11-16 — Add MPG to L/100 km Converter
- **Summary:** Shipped MPG to L/100 km Converter on existing catalog slug `mpg-to-l100-km-converter` (`MpgToL100Converter`, catalog `6af46f17a27d8d1d4e990bed`). Bidirectional US mpg / UK mpg / L/100 km / km/L via km/L canonical; factors derived from exact mile and gallon definitions; zero/negative rejected. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 30 US mpg ≈ 7.840486 L/100 km; 5 L/100 km = 20 km/L ≈ 47.043 US mpg; 40 UK mpg ≈ 7.062023 L/100 km.
- **Important Files:** `frontend/src/tools/calculators/mpg-to-l100/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mpg-to-l100-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 45/140). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch).

### 2026-11-16 — Add Quantity Converter
- **Summary:** Shipped Quantity Converter on existing catalog slug `quantity-converter` (`QuantityConverter`, catalog `6af46f17a27d8d1d4e990bd7`). Individual-units base with nine synchronized counting groups (pairs, decades, half-dozens, dozens, baker’s dozens, scores, grosses, great grosses); negatives rejected. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 dozen = 12 units; 1 baker’s dozen = 13; 1 gross = 144; 1 great gross = 1,728; 12 dozens = 1 gross.
- **Important Files:** `frontend/src/tools/calculators/quantity/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-quantity-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 38/127). Full frontend `tsc` / production build not claimed (pre-existing unrelated typing errors on branch).

### 2026-11-16 — Add Energy Conversion Calculator
- **Summary:** Shipped Energy Conversion Calculator on existing catalog slug `energy-conversion-calculator` (`EnergyConversionCalculator`, catalog `6af46f17a27d8d1d4e990bf6`). Joule-based unit registry with SI / big energies / microscopic / other accordion groups; US therm, IT BTU, CODATA 2018 Hartree/Rydberg; signed values allowed. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 kcal = 4184 J; 1 kWh = 3,600,000 J; 1 eV = 1.602176634×10⁻¹⁹ J; 1 ton TNT = 4.184×10⁹ J.
- **Important Files:** `frontend/src/tools/calculators/energy/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-energy-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 48/128). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Px to Em Converter
- **Summary:** Shipped Px to Em Converter on existing catalog slug `px-to-em-converter` (`PxToEmConverter`, catalog `6af46f17a27d8d1d4e990bce`). Configurable base font size (default 16px); bidirectional px/em/pt/% with CSS reference 1px = 0.75pt; base changes preserve the last conversion source field. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** base 16, 24px → 1.5em / 18pt / 150%; base 20, 30px → 1.5em / 22.5pt / 150%; 12pt → 16px.
- **Important Files:** `frontend/src/tools/calculators/px-to-em/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-px-to-em-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 38/132). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Dimes to Dollars Calculator
- **Summary:** Shipped Dimes to Dollars Calculator on existing catalog slug `dimes-to-dollars-calculator` (`DimesToDollarsCalculator`, catalog `6af46f17a27d8d1d4e990c01`). Bidirectional dimes↔dollars via integer-cent BigInt (1 dime = 10¢ = $0.10; 10 dimes = $1); dollar amounts not divisible by ten cents show dime-equivalents plus whole-coin remainder. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 dime → $0.10; 2000 dimes → $200.00; $25 → 250 dimes; $1.25 → 12.5 dime-equivalents (12 whole + 5¢).
- **Important Files:** `frontend/src/tools/calculators/dimes-to-dollars/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-dimes-to-dollars-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 47/138). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add PPM to mg/L Converter
- **Summary:** Shipped PPM to mg/L Converter on existing catalog slug `ppm-to-mgl-converter` (`PpmToMglConverter`, catalog `6af46f17a27d8d1d4e990bef`). Mass-based ppm ↔ mg/L via density (default 1000 kg/m³); density unit selector; optional molar mass ↔ molarity; source-field tracking. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 100 ppm at 1000 kg/m³ → 100 mg/L; at 1200 kg/m³ → 120 mg/L; 1000 mg/L NaCl (58.44 g/mol) → ≈ 0.0171116 mol/L.
- **Important Files:** `frontend/src/tools/calculators/ppm-to-mgl/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ppm-to-mgl-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 41/126). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Dimensional Analysis Calculator
- **Summary:** Shipped Dimensional Analysis Calculator on existing catalog slug `dimensional-analysis-calculator` (`DimensionalAnalysisCalculator`, catalog `6af46f17a27d8d1d4e990bd4`). Compare and convert modes; seven SI base + common derived quantities; dimension-vector engine; affine temperature (incl. Rankine); floating-point-tolerant comparison. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 m vs 3 ft → 1 m greater by ≈ 0.0856 m; 5 m → ≈ 16.4042 ft; 0°C = 273.15 K.
- **Important Files:** `frontend/src/tools/calculators/dimensional-analysis/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-dimensional-analysis-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 51/126). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add PPM Calculator
- **Summary:** Shipped PPM Calculator on existing catalog slug `ppm-calculator` (`PpmCalculator`, catalog `6af46f17a27d8d1d4e990bee`). Six synchronized fields (number, %, ‰, ppm, ppb, ppt) via dimensionless ratio; notice when ratio > 1; negatives rejected. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 ppm = 0.000001 = 0.0001% = 0.001‰ = 1,000 ppb = 1,000,000 ppt; 0.05% = 500 ppm.
- **Important Files:** `frontend/src/tools/calculators/ppm/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ppm-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 34/138). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Density Conversion
- **Summary:** Shipped Density Conversion on existing catalog slug `density-conversion` (`DensityConversion`, catalog `6af46f17a27d8d1d4e990b37`). Five synchronized fields (kg/dm³, kg/m³, lb/cu ft, lb/cu yd, lb/US gal) via kg/m³ base derived from exact pound/foot/yard/US-gallon constants; metric/imperial accordion groups; negatives rejected. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 kg/dm³ = 1000 kg/m³ ≈ 62.428 lb/cu ft ≈ 1685.555 lb/cu yd ≈ 8.345 lb/US gal.
- **Important Files:** `frontend/src/tools/calculators/density/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-density-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 38/148). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Power Converter
- **Summary:** Shipped Power Converter on existing catalog slug `power-converter` (`PowerConverter`, catalog `6af46f17a27d8d1d4e990bfa`). Nine synchronized editable fields across SI / horsepower / other accordion groups; watts base; distinct hp(I) vs PS; BTU(IT)/h; negatives allowed. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1000 W → 1 kW, 1,000,000 mW, ≈ 1.34102209 hp(I), ≈ 1.35962162 PS, ≈ 3412.14163 BTU/h.
- **Important Files:** `frontend/src/tools/calculators/power/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-power-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 35/133). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add dBm to Watts Calculator
- **Summary:** Shipped dBm to Watts Calculator on existing catalog slug `dbm-to-watts-calculator` (`DbmToWattsCalculator`, catalog `6af46f17a27d8d1d4e990bc8`). Four radio modes (dBm→W, dBm→mW, W→dBm, mW→dBm); clear inputs on mode change; negative dBm valid; zero/negative watts/mW rejected for →dBm. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 30 dBm = 1 W; 20 dBm = 100 mW; 10 W = 40 dBm; −30 dBm = 0.000001 W.
- **Important Files:** `frontend/src/tools/calculators/dbm-to-watts/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-dbm-to-watts-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 43/154). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Pennies to Dollars Calculator
- **Summary:** Shipped Pennies to Dollars Calculator on existing catalog slug `pennies-to-dollars-calculator` (`PenniesToDollarsCalculator`, catalog `6af46f17a27d8d1d4e990c03`). Bidirectional pennies↔dollars via integer-penny BigInt (100 pennies = $1); dollars at most two decimals; no FX. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 250 pennies = $2.50; $12.75 = 1,275 pennies; 1,000,000 pennies = $10,000.00.
- **Important Files:** `frontend/src/tools/calculators/pennies-to-dollars/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-pennies-to-dollars-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 49/152). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add CPS Calculator
- **Summary:** Shipped CPS Calculator on existing catalog slug `cps-calculator` (`CpsCalculator`, catalog `6af46f17a27d8d1d4e990bc7`). Nine bidirectional fields (cps, cpm, RPM, Hz, kHz, MHz, GHz, deg/s, rad/s); base cps; RPM/angular assume one cycle = one revolution. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 cps = 1 Hz = 60 RPM = 360 deg/s = 2π rad/s; 1 kHz = 1,000 cps = 60,000 RPM.
- **Important Files:** `frontend/src/tools/calculators/cps/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cps-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 34/125). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Paper Quantity Converter
- **Summary:** Shipped Paper Quantity Converter on existing catalog slug `paper-quantity-converter` (`PaperQuantityConverter`, catalog `6af46f17a27d8d1d4e990bd6`). Five bidirectional fields (sheets, quires, reams, bundles, bales) on modern paper-count standard (25 / 500 / 1,000 / 5,000 sheets); short-ream / historical notes educational only (not mixed into default math). Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 ream = 500 sheets = 20 quires = 0.5 bundle = 0.1 bale; 1,000 sheets = 2 reams = 1 bundle.
- **Important Files:** `frontend/src/tools/calculators/paper-quantity/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-paper-quantity-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 44/137). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Conversion Calculator
- **Summary:** Shipped universal Conversion Calculator on existing catalog slug `conversion-calculator` (`ConversionCalculator`, catalog `6af46f19a27d8d1d4e990dea`). Typed multi-category catalog (19 categories); linear base-unit factors; affine temperature; reciprocal fuel economy; bidirectional fields; swap units. Default 1 m → cm computed by engine. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 m = 100 cm; 0 °C = 32 °F; 1 MB = 1,000,000 B; 1 MiB = 1,048,576 B; 1 atm = 101,325 Pa.
- **Important Files:** `frontend/src/tools/calculators/conversion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 41/139). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Dividend Discount Model Calculator
- **Summary:** Shipped Dividend Discount Model Calculator on existing catalog slug `dividend-discount-model-calculator` (`DividendDiscountModelCalculator`, catalog `6af46f0fa27d8d1d4e990005`). Four screenshot sections: expected growth `g = ROE × (1 − payout)`, expected dividend `D₁ = D₀ × (1 + g)`, CAPM `Ke = Rf + β × MRP`, stock value `P₀ = D₁ / (Ke − g)` with Ke > g guard. Three independent FX selectors (D₀ / D₁ / P₀) via Margin Interest pattern; percentages and beta never convert. Activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true).
- **Example:** payout 40%, ROE 15%, D₀ 5 PKR, Rf 4%, MRP 6%, β 1.2 → g 9%, D₁ 5.45, Ke 11.2%, P₀ ≈ 247.73.
- **Important Files:** `frontend/src/tools/calculators/dividend-discount-model/*`, registries, `CURRENCY_CONVERSION_SLUGS`, sitemap, `backend/src/scripts/assign-dividend-discount-model-tool.ts`, `brain/*`.
- **Verification:** Mongo activation verified; worked-example math inspected via `tsx`. Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Nickels to Dollars Calculator
- **Summary:** Shipped Nickels to Dollars Calculator on existing catalog slug `nickels-to-dollars-calculator` (`NickelsToDollarsCalculator`, catalog `6af46f17a27d8d1d4e990c02`). Bidirectional nickels↔dollars via integer-cent BigInt (1 nickel = 5¢ = $0.05; 20 nickels = $1); dollar amounts not divisible by five cents show mathematical nickel units plus whole-coin remainder. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 2,000 nickels = $100.00; 1 billion nickels = $50,000,000.00; $1.02 → 20.4 nickel units (20 whole + $0.02 remainder).
- **Important Files:** `frontend/src/tools/calculators/nickels-to-dollars/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-nickels-to-dollars-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 49/155). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add CGS System of Units Converter
- **Summary:** Shipped CGS System of Units Converter on existing catalog slug `cgs-system-of-units-converter` (`CgsSystemOfUnitsConverter`, catalog `6af46f17a27d8d1d4e990bd3`). Quantity selector (default Acceleration); 16 mechanical SI↔CGS quantities with typed factors; bidirectional fields; electromagnetism covered educationally only (ESU/EMU/Gaussian distinguished — no ambiguous universal EM factors). Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 9.80665 m/s² = 980.665 Gal; 1 N = 100,000 dyn; 1 J = 10,000,000 erg; 1 Pa = 10 Ba.
- **Important Files:** `frontend/src/tools/calculators/cgs-system/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cgs-system-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 49/138). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Nm to Joules Calculator
- **Summary:** Shipped Nm to Joules Calculator on existing catalog slug `nm-to-joules-calculator` (`NmToJoulesCalculator`, catalog `6af46f17a27d8d1d4e990b11`). Independent N ↔ J/m and J ↔ N·m sections (factor 1); optional W = F d cos(θ); torque≠energy called out. Publishing flags and pillar preserved; `isDeveloped` set true after verification.
- **Example:** 10 N = 10 J/m; 50 J = 50 N·m; 10 N × 5 m × cos(0°) = 50 J; cos(60°) ≈ 25 J.
- **Important Files:** `frontend/src/tools/calculators/nm-to-joules/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-nm-to-joules-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d2a27d8d1d4e98f9ea`; subPillar null; meta 43/146). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Cents to Dollars Calculator
- **Summary:** Shipped Cents to Dollars Calculator on existing catalog slug `cents-to-dollars-calculator` (`CentsToDollarsCalculator`, catalog `6af46f17a27d8d1d4e990c00`). Bidirectional cents↔dollars with integer-cent BigInt arithmetic (100 ¢ = $1); dollars limited to two decimal places; no FX. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 250 ¢ = $2.50; $12.75 = 1,275 ¢; 123,456 ¢ = $1,234.56.
- **Important Files:** `frontend/src/tools/calculators/cents-to-dollars/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cents-to-dollars-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 47/154). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add Natural Gas Converter
- **Summary:** Shipped Natural Gas Converter on existing catalog slug `natural-gas-converter` (`NaturalGasConverter`, catalog `6af46f17a27d8d1d4e990bf9`). Volume and energy unit selectors; bidirectional volume↔energy via adjustable heating value (BTU/ft³, MJ/m³, kWh/m³); illustrative default 1038 BTU/ft³. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 100 CCF at 1038 BTU/ft³ = 103.8 therms = 10.38 MMBTU; 100 ft³ at 1050 BTU/ft³ = 105,000 BTU.
- **Important Files:** `frontend/src/tools/calculators/natural-gas/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-natural-gas-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 41/155). Full frontend `tsc` / production build not claimed (pre-existing unrelated currency typing errors on branch).

### 2026-11-16 — Add CCF to Therms Calculator
- **Summary:** Shipped CCF to Therms Calculator on existing catalog slug `ccf-to-therms-calculator` (`CcfToThermsCalculator`, catalog `6af46f17a27d8d1d4e990bf5`). Bidirectional CCF↔therms; illustrative default factor 1.038 (1038 BTU/ft³); custom therms/CCF and heating value stay synchronized. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 100 CCF × 1.038 = 103.8 therms; 50 CCF at 1050 BTU/ft³ → factor 1.05 → 52.5 therms.
- **Important Files:** `frontend/src/tools/calculators/ccf-to-therms/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ccf-to-therms-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 44/155). Full production build not run this pass.

### 2026-11-16 — Fix Carried Interest currency conversion
- **Summary:** Upgraded existing Carried Interest Calculator (`carried-interest-calculator`) from denomination-only synced selectors to real FX via Phase 2 `convertDraftMoneyFields` + `CurrencyRatesProvider`. Both initial and final fund values convert together so FX alone cannot invent profit or change fund return %, hurdle/carry ratios, or GP catch-up waterfall math. Hold period, hurdle %, and carry % never convert. Existing allocation formulas preserved. Slug already on `CURRENCY_CONVERSION_SLUGS`.
- **Important Files:** `frontend/src/tools/calculators/carried-interest/{CarriedInterestCalculator,CarriedInterestForm}.tsx`, `brain/{CURRENT_STATE,FRONTEND,CHANGELOG,CURRENCY_CONVERSION_PROGRESS}.md`.
- **Verification:** Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Cost of Equity independent FX conversion
- **Summary:** Upgraded existing Cost of Equity Calculator (`cost-of-equity-calculator`, catalog `6af46f10a27d8d1d4e990154`) from denomination-only currency to independent dividend/share-price FX selectors (Margin Interest pattern). Changing either currency converts that field's amount; validation normalizes dividend into share-price currency before Gordon Growth `(D₁/P₀)+g`. Growth % and cost-of-equity % never convert. D₁ convention preserved. No/CAPM mode remains unavailable. Slug added to `CURRENCY_CONVERSION_SLUGS`.
- **Example:** Same-currency D₁ 10 / P₀ 100 / g 3% → 13%. Mixed 10 USD / 2,770 PKR / g 3% with illustrative 1 USD = 277 PKR → 103%.
- **Important Files:** `frontend/src/tools/calculators/cost-of-equity/{types,validation,CostOfEquityForm,CostOfEquityCalculator,content,CostOfEquityGuideArticle,calculation.test}.ts(x)`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/app/embed/[slug]/page.tsx`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB record already active (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Currency conversion Phase 2 shared engine (ADR-021)
- **Summary:** Added pure `convertCurrency` (`amount × rates[target] / rates[source]`), unrounded `MoneyValue`, `useConvertibleMoneyField`, `normalizeAmountsToCurrency`, and client `CurrencyRatesProvider` fed by Phase 1 `getCurrencyRates`. Display rounding only via `roundMoneyAmount`. No calculator modules changed.
- **Important Files:** `frontend/src/tools/shared/{convert-currency,money-value,useConvertibleMoney,CurrencyRatesProvider,currency-rates}.ts(x)`, `frontend/src/server/currency/rates.ts`, agent currency rules, `brain/*`.
- **Verification:** `convert-currency.selfcheck.ts` passed (10 PKR ↔ USD @ 277 round-trip). Lint/builds/browser/calculator integration omitted per user.

### 2026-11-16 — Currency rates Phase 1 read path (ADR-017 / ADR-021)
- **Summary:** Exposed stored MongoDB `CurrencyRate` snapshots to the Next.js server. Added public `GET /api/v1/currency/rates` and server-only `getCurrencyRates` loader. 48-hour `isStale` flag; stale rates remain readable. Aligned tracked currency metadata to 54 codes. No calculator conversion wired yet.
- **Important Files:** `backend/src/modules/currency/{currency.router,currency.service,currency-metadata}.ts`, `backend/src/app.ts`, `frontend/src/server/currency/rates.ts`, `frontend/src/tools/shared/currency.ts`, `brain/{API_CONTRACTS,BACKEND,DATABASE,CURRENT_STATE,FRONTEND,ARCHITECTURE,DECISIONS,CHANGELOG}.md`.
- **Verification:** Service read against Mongo verified (`available: true`, USD base, `fetchedAt` 2026-11-13, `isStale: true`, 166 rates). Local `CURRENCY_EXCHANGE_API_KEY` missing (refresh blocked). Lint/builds/browser/tests omitted per user.

### 2026-11-16 — Add Cost of Equity Calculator (Screenshot-First)
- **Summary:** Shipped Cost of Equity Calculator on existing catalog slug `cost-of-equity-calculator` (`CostOfEquityCalculator`, catalog `6af46f10a27d8d1d4e990154`). Dividend Yes/No radio (Yes default). Yes mode: Dividend per share as D₁, current share price, growth rate % → cost of equity % via Gordon Growth `(D₁/P₀)+g`. Denomination currency (PKR). No mode switchable but CAPM inputs not invented (reference omitted them). Omega UI. Activated.
- **Example:** D₁ 5 / P₀ 100 / g 4% → 9%.
- **Important Files:** `frontend/src/tools/calculators/cost-of-equity/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cost-of-equity-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. No-mode CAPM fields unverified pending expanded screenshot.

### 2026-11-16 — Add Carried Interest Calculator (Screenshot-First)
- **Summary:** Shipped Carried Interest Calculator on existing catalog slug `carried-interest-calculator` (`CarriedInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff80`). Fund return (initial/final → %) + carry interest (hold default 10y, hurdle 0%, carry 20%, GP catch-up No default). Without catch-up: carry × profit above annually compounded hurdle. Yes mode: standard full catch-up (no extra fields; expanded Omni Yes screenshot not verified). Compact GP carry result. Denomination currency (PKR). Omega UI. Activated.
- **Example:** PKR 100,000 → 150,000 / 10y / 0% / 20% / No → return 50%, profit 50,000, GP carry 10,000.
- **Important Files:** `frontend/src/tools/calculators/carried-interest/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-carried-interest-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. GP catch-up Yes uses industry-standard full catch-up; not cross-checked against an expanded reference screenshot.

### 2026-11-16 — Add CAPM Calculator (Screenshot-First)
- **Summary:** Shipped CAPM Calculator on existing catalog slug `capm-calculator-capital-asset-pricing-model` (`CapmCalculator`, catalog `6af46f10a27d8d1d4e990152`). Five-field screenshot parity: Rf %, Rm %, unitless beta → asset risk premium % and expected return R %. Blank defaults; live recalc; signed beta and Rm &lt; Rf allowed. No currency. Distinct from Beta Stock / Jensen's Alpha / Expected Return. Omega UI. Activated.
- **Example:** Rf 4% / Rm 12% / β 1.2 → asset risk premium 9.6%, expected return 13.6%.
- **Important Files:** `frontend/src/tools/calculators/capm/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-capm-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-16 — Add Beta Stock Calculator (Screenshot-First)
- **Summary:** Shipped Beta Stock Calculator on existing catalog slug `beta-stock-calculator` (`BetaStockCalculator`, catalog `6af46f0fa27d8d1d4e99002e`). Four+ chronological asset/benchmark price pairs → daily returns → β = Cov/Var. Optional price line chart. Denomination currency (PKR). Omega UI. Activated.
- **Example:** Asset 50/55/50/60, Benchmark 100/110/100/120 → β = 1.00.
- **Important Files:** `frontend/src/tools/calculators/beta-stock/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-beta-stock-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add m/s to km/h Converter
- **Summary:** Shipped m/s to km/h Converter on existing catalog slug `ms-to-kmh-converter` (`MsToKmhConverter`, catalog `6af46f17a27d8d1d4e990c0b`). Main fields m/s, km/h, mph, ft/s, knots plus extras; canonical m/s; live bidirectional sync. Mach omitted. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 10 m/s = 36 km/h ≈ 22.3693629 mph ≈ 32.808399 ft/s ≈ 19.4384449 kn; 72 km/h = 20 m/s.
- **Important Files:** `frontend/src/tools/calculators/ms-to-kmh/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ms-to-kmh-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 41/143). Full production build not run this pass.

### 2026-11-15 — Add Angle Conversion Calculator
- **Summary:** Shipped Angle Conversion Calculator on existing catalog slug `angle-conversion-calculator` (`AngleConversionCalculator`, catalog `6af46f17a27d8d1d4e990bfb`). Degrees, DMS, radians, gradians, turns, π radians, plus arcminutes/arcseconds/microradians and NATO/Soviet/Swedish mils; canonical radians; live field sync. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 90° = π/2 rad = 100 gon = 0.25 turn = 0.5 π rad = 1,600 NATO mils; 45° 30′ 15″ ≈ 45.5041666667°.
- **Important Files:** `frontend/src/tools/calculators/angle-conversion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-angle-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null). Full production build not run this pass.

### 2026-11-15 — Add Zulu Time Converter
- **Summary:** Shipped Zulu Time Converter on existing catalog slug `zulu-time-converter` (`ZuluTimeConverter`, catalog `6af46f17a27d8d1d4e990bc3`). Country or IANA zone; conversion date; bidirectional Zulu↔local; DST from IANA rules; gap/fold handling reused from the Time Zones engine. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 2026-01-15 12:00Z → 07:00 EST (America/New_York, UTC−05); 2026-07-15 12:00Z → 08:00 EDT (UTC−04); 12:00Z → 17:30 IST / 17:45 NPT.
- **Important Files:** `frontend/src/tools/calculators/zulu-time/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-zulu-time-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 39/153). Full production build not run this pass.

### 2026-11-15 — Add Time Unit Converter
- **Summary:** Shipped Time Unit Converter on existing catalog slug `time-unit-converter` (`TimeUnitConverter`, catalog `6af46f17a27d8d1d4e990bbe`). Seven synchronized fields (years–seconds) plus extra units (ms, µs, ns, fortnights, decades, centuries, millennia). Average year 365.25 days; average month 1/12 of that year. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 24 hours = 1 day = 1,440 minutes = 86,400 seconds; 1 average year = 12 months = 365.25 days = 31,557,600 seconds.
- **Important Files:** `frontend/src/tools/calculators/time-unit/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-time-unit-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 39/153). Full production build not run this pass.

### 2026-11-15 — Add Years to Decades Calculator
- **Summary:** Shipped Years to Decades Calculator on existing catalog slug `years-to-decades-calculator` (`YearsToDecadesCalculator`, catalog `6af46f17a27d8d1d4e990bc2`). Bidirectional years↔decades (÷/× 10); DecimalValue path for large and negative values; live field sync. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 25 years = 2.5 decades; 4.5 decades = 45 years; 4,500,000,000 years = 450,000,000 decades.
- **Important Files:** `frontend/src/tools/calculators/years-to-decades/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-years-to-decades-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Backend `tsc --noEmit` passed. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 47/154). Full production build not run this pass.

### 2026-11-15 — Add Minutes to Hours Converter
- **Summary:** Shipped Minutes to Hours Converter on existing catalog slug `minutes-to-hours-converter` (`MinutesToHoursConverter`, catalog `6af46f17a27d8d1d4e990bb4`). Bidirectional hours/minutes/seconds plus HH:MM:SS duration (hours do not wrap at 24); canonical seconds via DecimalValue; negatives supported. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 150 min = 2.5 h = 9000 s = 02:30:00; 04:20:30 = 260.5 min; 1440 min = 24:00:00.
- **Important Files:** `frontend/src/tools/calculators/minutes-to-hours/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-minutes-to-hours-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 46/156). Full production build not run this pass.

### 2026-11-15 — Add Time Zones Converter
- **Summary:** Shipped Time Zones Converter on existing catalog slug `time-zones-converter` (`TimeZonesConverter`, catalog `6af46f17a27d8d1d4e990bbf`). Canonical instant + IANA `Intl` conversion; eastern/western accordions; add-city search; DST gap/fold handling; 12/24-hour display. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 2026-11-15 12:00 UTC → London 12:00 · Dubai 16:00 · Karachi 17:00 · Mumbai 17:30 · Tokyo 21:00 · New York 07:00.
- **Important Files:** `frontend/src/tools/calculators/time-zones/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-time-zones-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 40/155). Full production build not run this pass.

### 2026-11-15 — Add Military Time Converter
- **Summary:** Shipped Military Time Converter on existing catalog slug `military-time-converter` (`MilitaryTimeConverter`, catalog `6af46f17a27d8d1d4e990baf`). Bidirectional military↔12-hour conversion; HHMM and HH:MM input; hour/minute/AM-PM selectors; midnight/noon handling; hour and minutes charts. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1830 → 6:30 PM · 18:30; 12:00 AM → 0000; 12:00 PM → 1200; 7:45 PM → 1945.
- **Important Files:** `frontend/src/tools/calculators/military-time/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-military-time-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 43/158). Full production build not run this pass.

### 2026-11-15 — Add Mbps Calculator
- **Summary:** Shipped Mbps Calculator on existing catalog slug `mbps-calculator` (`MbpsCalculator`, catalog `6af46f17a27d8d1d4e990bcc`). Bidirectional Mbps↔MB/s plus SI bit/byte rate fields (bit/s, kbit/s, Gbit/s, B/s, kB/s, GB/s) via shared bits/s; primary section open by default; bits/bytes accordions; clickable examples. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 100 Mbit/s → 12.5 MB/s · 100000 kbit/s · 0.1 Gbit/s; 1 Gbit/s → 1000 Mbit/s · 125 MB/s.
- **Important Files:** `frontend/src/tools/calculators/mbps/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mbps-calculator-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 35/150). Full production build not run this pass.

### 2026-11-15 — Add Unix Time Converter
- **Summary:** Shipped Unix Time Converter on existing catalog slug `unix-time-converter` (`UnixTimeConverter`, catalog `6af46f17a27d8d1d4e990bd2`). Bidirectional Unix↔UTC; seconds/ms unit switch preserving instant; fixed-offset + IANA zone accordions; current/live clock. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** `0` → 1970-01-01T00:00:00Z; `2147483647` → 2038-01-19T03:14:07Z; default `1794744000` → 2026-11-15 12:00:00 UTC.
- **Important Files:** `frontend/src/tools/calculators/unix-time/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-unix-time-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 39/149). Full production build not run this pass.

### 2026-11-15 — Add kB to MB Converter
- **Summary:** Shipped kB to MB Converter on existing catalog slug `kb-to-mb-converter` (`KbToMbConverter`, catalog `6af46f17a27d8d1d4e990bca`). Bidirectional kB/KiB ↔ MB ↔ MiB via shared bytes; SI vs IEC labels; optional KiB input mode. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1024 kB → 1.024 MB · 0.9765625 MiB; 1024 KiB → 1 MiB · 1.048576 MB.
- **Important Files:** `frontend/src/tools/calculators/kb-to-mb/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-kb-to-mb-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 38/160). Full production build not run this pass.

### 2026-11-15 — Add Unicode Text Converter
- **Summary:** Shipped Unicode Text Converter on existing catalog slug `unicode-text-converter` (`UnicodeTextConverter`, catalog `6af46f17a27d8d1d4e990bd1`). Seven local styles (circled, negative circled, squared, negative squared, inverted, inverted reversed, mathematical monospace); grapheme-safe reverse; per-style copy; compatibility notice. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** `unicode` → circled `ⓤⓝⓘⓒⓞⓓⓔ`, negative circled `🅤🅝🅘🅒🅞🅓🅔`, monospace `𝚞𝚗𝚒𝚌𝚘𝚍𝚎`; `abc` inverted `ɐqɔ` / reversed `ɔqɐ`.
- **Important Files:** `frontend/src/tools/calculators/unicode-text/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-unicode-text-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 42/156). Full production build not run this pass.

### 2026-11-15 — Add HEX to RGB Converter
- **Summary:** Shipped HEX to RGB Converter on existing catalog slug `hex-to-rgb-converter` (`HexToRgbConverter`, catalog `6af46f17a27d8d1d4e990bc9`). HEX-first direction radios; optional shorthand 3-digit HEX checkbox; reuses RGB↔HEX engine from `rgb-to-hex`. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** `#FF8300` → `(255, 131, 0)`; `#F80` with shorthand → `(255, 136, 0)`; shorthand off rejects 3-digit with guidance.
- **Important Files:** `frontend/src/tools/calculators/hex-to-rgb/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-hex-to-rgb-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 40/129 — task meta trimmed to maxlength 160). Full production build not run this pass.

### 2026-11-15 — Add RGB to HEX Converter
- **Summary:** Shipped RGB to HEX Converter on existing catalog slug `rgb-to-hex-converter` (`RgbToHexConverter`, catalog `6af46f17a27d8d1d4e990bcf`). Bidirectional RGB↔HEX radios; 3/6-digit HEX; live preview; native picker; reuses Color Converter `rgbToHex`. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** RGB 255,100,50 → `#FF6432`; `#3498DB` → RGB 52,152,219; `#F00` → 255,0,0.
- **Important Files:** `frontend/src/tools/calculators/rgb-to-hex/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-rgb-to-hex-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 40/148). Full production build not run this pass.

### 2026-11-15 — Add Color Converter
- **Summary:** Shipped Color Converter on existing catalog slug `color-converter` (`ColorConverter`, catalog `6af46f17a27d8d1d4e990bc6`). Source-model dropdown (RGB default) with HEX/RGB/RGBA/HSL/HSLA/HSV/CMYK inputs, canonical sRGB+alpha engine, live checkerboard preview, native color picker, per-format copy, share/reload/clear. CMYK documented as mathematical approximation. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** RGB 255,100,50 → HEX `#FF6432`; RGB 224,224,224 → CMYK ≈ (0%, 0%, 0%, 12.16%).
- **Important Files:** `frontend/src/tools/calculators/color/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-color-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 35/151). Full production build not run this pass.

### 2026-11-15 — Add MB to GB Converter
- **Summary:** Shipped MB↔GB converter on existing catalog slug `mb-to-gb-converter` with Base-10 SI (÷/×1000) and Base-2 legacy binary (÷/×1024) modes. Bidirectional editable fields; mode switch keeps the edited number and recalculates the other. Publishing flags preserved; `isDeveloped` set true after verification. Live catalog `_id` is `6af46f17a27d8d1d4e990bcb` (task brief listed `…bcc`).
- **Example:** Decimal 1000 MB = 1 GB; 1024 MB = 1.024 GB. Binary-mode 1024 → 1; 512 → 0.5.
- **Important Files:** `frontend/src/tools/calculators/mb-to-gb/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mb-to-gb-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar/subPillar null; meta 38/152). Full production build not run this pass.

### 2026-11-15 — Add Week Over Week Calculator (Screenshot-First)
- **Summary:** Shipped Week Over Week Calculator on existing catalog slug `week-over-week-calculator` (`WeekOverWeekCalculator`, catalog `6af46f10a27d8d1d4e9900ef`). Value in initial week + following week → WoW % change ((F−I)/I)×100. Nonzero initial required; zero following allowed; signed %. Collapsed Weekly CAGR section without invented inputs (expanded screenshot required). Copy/share/reset. No currency. Omega UI. Activated.
- **Example:** 1,000 → 1,200 = +20%; 1,000 → 800 = −20%; 500 → 500 = 0%.
- **Important Files:** `frontend/src/tools/calculators/week-over-week/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-week-over-week-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. Weekly CAGR fields unverified pending expanded screenshot.

### 2026-11-15 — Add Sinking Fund Calculator (Screenshot-First)
- **Summary:** Shipped Sinking Fund Calculator on existing catalog slug `sinking-fund-calculator` (`SinkingFundCalculator`, catalog `6af46f10a27d8d1d4e9900e9`). Money to accumulate, annual interest rate %, compounding frequency (default Yearly), period years/months (default 5y 0m) → USSF factor and required contribution (FV × USSF). Zero-rate path 1/n. Months as months/12. Denomination currency. Omega UI. Activated.
- **Example:** PKR 100,000 @ 5%/yr yearly × 5y → USSF ≈ 0.180975; contribution ≈ 18,097.48.
- **Important Files:** `frontend/src/tools/calculators/sinking-fund/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-sinking-fund-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Time Value of Money Calculator (Screenshot-First)
- **Summary:** Shipped Time Value of Money Calculator on existing catalog slug `time-value-of-money-calculator` (`TimeValueOfMoneyCalculator`, catalog `6af46f10a27d8d1d4e9900eb`). Interest rate %, term years/months, compound frequency (default Yearly), bidirectional present/future value via last-edited money field. Distinct from Present Value and Future Value calculators. Denomination currency. Omega UI. Activated.
- **Example:** 10% / 2y / yearly / PV 10,000 → FV 12,100; reverse FV 12,100 → PV 10,000.
- **Important Files:** `frontend/src/tools/calculators/time-value-of-money/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-time-value-of-money-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Savings Interest Rate Calculator (Screenshot-First)
- **Summary:** Shipped Savings Interest Rate Calculator on existing catalog slug `savings-interest-rate-calculator` (`SavingsInterestRateCalculator`, catalog `6af46f0fa27d8d1d4e98ff90`). Main specs (goal, initial balance, term years, compounding) plus additional deposit (amount, frequency, beginning/end timing) → required annual nominal rate %, total deposited, yearly principal/interest/balance chart. Closed-form annuity with bisection. Fixed PKR (no currency selector). Distinct from Savings / Interest Rate / Investment. Omega UI. Activated.
- **Example:** Goal 100,000 / P 0 / 30y / monthly / PMT 100 end → ≈ 5.976%; deposited 36,000.
- **Important Files:** `frontend/src/tools/calculators/savings-interest-rate/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-savings-interest-rate-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Example rate verified via one-off tsx. Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Real Rate of Return Calculator (Screenshot-First)
- **Summary:** Shipped Real Rate of Return Calculator on existing catalog slug `real-rate-of-return-calculator` (`RealRateOfReturnCalculator`, catalog `6af46f0fa27d8d1d4e990017`). Three fields only: nominal rate %, inflation rate %, inline real rate %. Fisher equation (not nominal − inflation). No currency. Omega UI. Activated.
- **Example:** 10% nominal / 4% inflation → real ≈ 5.7692%.
- **Important Files:** `frontend/src/tools/calculators/real-rate-of-return/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-real-rate-of-return-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add ROI Calculator (Screenshot-First)
- **Summary:** Shipped ROI Calculator on existing catalog slug `roi-calculator` (`RoiCalculator`, catalog `6af46f10a27d8d1d4e9900e7`). Basic ROI (period, initial, optional contributions, linked rate/returned, ROI %, optional gain/loss) and Annualized ROI from dates. Time needed / compare gated pending screenshots. Denomination currency. Omega UI. Activated.
- **Example:** PKR 10,000 → 15,000 / 5y → ROI 50%; annualized ≈ 8.447%.
- **Important Files:** `frontend/src/tools/calculators/roi/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-roi-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.
### 2026-11-15 — Add Rate of Return Calculator (Screenshot-First)
- **Summary:** Shipped Rate of Return Calculator on existing catalog slug `rate-of-return-calculator` (`RateOfReturnCalculator`, catalog `6af46f0fa27d8d1d4e990013`). Main specifications (initial investment, final amount, investment length yrs/mos, compounding) plus interim periodic cash flows (deposit/withdrawal, frequency, end/beginning timing); statement result for annual nominal rate. Closed form without PMT; numerical solve with PMT. Distinct from Annualized Return / Annualized Rate of Return / Percentage Return. Denomination currency. Omega UI. Activated.
- **Example:** PKR 1,000 → 5,000 / 10 years / monthly compounding / PMT 0 → ≈ 16.203%.
- **Important Files:** `frontend/src/tools/calculators/rate-of-return/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-rate-of-return-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Simple Interest Calculator (Screenshot-First)
- **Summary:** Shipped Simple Interest Calculator on existing catalog slug `simple-interest-calculator` (`SimpleInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff88`). Principal, annual rate %/yr, term years/months → total interest and final balance. Collapsed "Total interest payment calculations" with copy/share/reset. Denomination currency. Omega UI. Activated.
- **Example:** PKR 100,000 @ 10%/yr for 2y 6m → interest 25,000; balance 125,000.
- **Important Files:** `frontend/src/tools/calculators/simple-interest/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-simple-interest-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Percentage Return Calculator (Screenshot-First)
- **Summary:** Shipped Percentage Return Calculator on existing catalog slug `percentage-return-calculator` (`PercentageReturnCalculator`, catalog `6af46f10a27d8d1d4e9900e2`). Basic gain/loss + % return; annualized CAGR with start/end/duration sync (365.25-day year); time-needed solve via ln formula. Compare checkbox present without invented comparison fields. Distinct from Annualized Return tools. Denomination currency. Omega UI. Activated.
- **Example:** PKR 10,000 → 12,100 over 2 years → gain 2,100; return 21%; annualized 10%.
- **Important Files:** `frontend/src/tools/calculators/percentage-return/*`, registry `keys.ts` (details/index/sitemap/tool.key already allowlisted), `backend/src/scripts/assign-percentage-return-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. Compare-with-another-investment field list missing from reference.

### 2026-11-15 — Add Present Value Calculator (Screenshot-First)
- **Summary:** Shipped Present Value Calculator on existing catalog slug `present-value-calculator` (`PresentValueCalculator`, catalog `6af46f10a27d8d1d4e9900e4`). Future value, periods, interest rate % → PV and total interest. Denomination currency. Omega UI. Activated.
- **Example:** FV 12,100 / 2 periods / 10% → PV 10,000, interest 2,100.
- **Important Files:** `frontend/src/tools/calculators/present-value/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-present-value-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add PVIFA Calculator (Screenshot-First)
- **Summary:** Shipped PVIFA Calculator on existing catalog slug `pvifa-calculator` (`PvifaCalculator`, catalog `6af46f10a27d8d1d4e9900e5`). Interest rate per period (r), periods (n), inline PVIFA; collapsed Additional settings with copy/share/reset. No currency. Omega UI. Activated.
- **Example:** 5% / 10 periods → PVIFA ≈ 7.7217.
- **Important Files:** `frontend/src/tools/calculators/pvifa/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-pvifa-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Optimal Hedge Ratio Calculator (Screenshot-First)
- **Summary:** Shipped Optimal Hedge Ratio Calculator on existing catalog slug `optimal-hedge-ratio-calculator` (`OptimalHedgeRatioCalculator`, catalog `6af46f10a27d8d1d4e9900e1`). Four unitless fields: spot σ, futures σ, correlation, inline optimal hedge ratio. Formula h* = ρ × (σs / σf). Distinct from Hedge Ratio Calculator. Omega UI. Activated.
- **Example:** σs 12 / σf 15 / ρ 0.8 → h* = 0.64.
- **Important Files:** `frontend/src/tools/calculators/optimal-hedge-ratio/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-optimal-hedge-ratio-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Opportunity Cost Calculator (Screenshot-First)
- **Summary:** Shipped Opportunity Cost Calculator on existing catalog slug `opportunity-cost-calculator` (`OpportunityCostCalculator`, catalog `6af46f10a27d8d1d4e9900e0`). Money to spend; invest section (return default 3%, years/months, tax default 12%, inflation default 2.5%); results total savings after tax + inflation-adjusted opportunity cost; optional supplementary Real FV and nominal gain. Denomination currency. Omega UI. Activated.
- **Example:** PKR 100,000 / 10% / 1y / tax 20% / inflation 5% → savings 108,000; opportunity cost ≈ 2,857.14.
- **Important Files:** `frontend/src/tools/calculators/opportunity-cost/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-opportunity-cost-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Perpetuity Calculator (Screenshot-First)
- **Summary:** Shipped Perpetuity Calculator on existing catalog slug `perpetuity-calculator` (`PerpetuityCalculator`, catalog `6af46f10a27d8d1d4e9900e3`). Dividend (D₁), discount rate %, growth rate % (default 0); inline present value via Gordon Growth. Discount must exceed growth. Denomination currency. Omega UI. Activated.
- **Example:** PKR 1,000 / 10% / 0% → PKR 10,000; PKR 1,000 / 10% / 4% → ≈ PKR 16,666.67.
- **Important Files:** `frontend/src/tools/calculators/perpetuity/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-perpetuity-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add NPV Calculator (Screenshot-First)
- **Summary:** Shipped NPV Calculator on existing catalog slug `npv-calculator-net-present-value` (`NpvCalculator`, catalog `6af46f10a27d8d1d4e9900df`). Discount rate, initial costs, Years 1–5 + show-more (max 9); NPV and expected cash flows (discounted PV of future CFs per OmniCalculator). Denomination currency. Omega UI. Activated.
- **Example:** 10% / PKR 10,000 / 4,000×3 years → NPV ≈ −52.59.
- **Important Files:** `frontend/src/tools/calculators/npv/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-npv-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Fix backend production build for Node start
- **Summary:** Switched `backend/tsconfig.json` emit from ESNext/`bundler` to CommonJS/`node` so `npm run build` + `npm start` (`node dist/server.js`) resolves relative imports on the server. Local `npm run dev` (`tsx`) unchanged.
- **Important Files:** `backend/tsconfig.json`, `brain/BACKEND.md`.
- **Verification:** `npm run build` emitted `require("./app")`; `node dist/server.js` connected Mongo and listened on port 5001.

### 2026-11-15 — Add NOPAT Calculator (Screenshot-First)
- **Summary:** Shipped NOPAT Calculator on existing catalog slug `nopat-calculator` (`NopatCalculator`, catalog `6af46f10a27d8d1d4e9900de`). Simple mode (operating profit × (1 − tax%/100)) and precise mode (income-statement reconstruction). Denomination currency. Omega UI. Activated.
- **Example:** PKR 500,000 @ 30% → NOPAT PKR 350,000.
- **Important Files:** `frontend/src/tools/calculators/nopat/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-nopat-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Mutual Fund Calculator (Screenshot-First)
- **Summary:** Shipped Mutual Fund Calculator on existing catalog slug `mutual-fund-calculator` (`MutualFundCalculator`, catalog `6af46f10a27d8d1d4e9900dc`). SIP (default) vs one-time lump sum; investment amount; expected annual return %; years/months; inline maturity value. Monthly compounding. Denomination currency. Omega UI. Activated.
- **Example:** SIP PKR 1,000 / 12% / 1 year → maturity ≈ PKR 12,682.50.
- **Important Files:** `frontend/src/tools/calculators/mutual-fund/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mutual-fund-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Money Market Account Calculator (Screenshot-First)
- **Summary:** Shipped Money Market Account Calculator on existing catalog slug `money-market-account-calculator` (`MoneyMarketAccountCalculator`, catalog `6af46f0fa27d8d1d4e9900da`). SIP (default) vs one-time; starting balance; recurring investment + frequency; expected annual return; years/months; results total deposit / total interest / future value. Monthly compounding default; other frequencies compound per contribution period; end-of-period deposits. Denomination currency. Omega UI. Activated. Registry keys were already present from a prior commit; this delivery adds the calculator module.
- **Example:** PKR 10,000 + 1,000/mo @ 6% × 1y → deposit 22,000, FV ≈ 22,952.34, interest ≈ 952.34.
- **Important Files:** `frontend/src/tools/calculators/money-market-account/*`, `backend/src/scripts/assign-money-market-account-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Moving Average Calculator (Screenshot-First)
- **Summary:** Shipped Moving Average Calculator on existing catalog slug `moving-average-calculator` (`MovingAverageCalculator`, catalog `6af46f0fa27d8d1d4e9900db`). Length N (≥2), three starter price fields with auto-trailing rows, incomplete guidance message, inline SMA of latest N prices. Denomination currency. Omega UI. Activated.
- **Example:** Length 3 with 100/120/140 → PKR 120; with fourth price 160 → PKR 140.
- **Important Files:** `frontend/src/tools/calculators/moving-average/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-moving-average-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add MIRR Calculator (Screenshot-First)
- **Summary:** Shipped MIRR Calculator on existing catalog row (slug shortened to `mirr-calculator`, `MirrCalculator`, catalog `6af46f0fa27d8d1d4e990016`). Financing/reinvestment rates, initial investment, Years 1–5 (+ expandable years), inline MIRR. Denomination currency. Omega UI. Activated.
- **Example:** PKR 1,000 / 10% finance / 8% reinvest / 500×3 years → MIRR ≈ 17.5%.
- **Important Files:** `frontend/src/tools/calculators/mirr/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mirr-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add MVA Calculator (Screenshot-First)
- **Summary:** Shipped MVA Calculator on existing catalog slug `mva-calculator` (`MvaCalculator`, catalog `6af46f10a27d8d1d4e9900dd`). Current share price, shares outstanding, inline current market value; capital invested, inline MVA. No debt/EV inputs. Denomination currency. Omega UI. Activated.
- **Example:** PKR 150 × 10,000 = PKR 1,500,000 market value; − PKR 1,000,000 capital = PKR 500,000 MVA.
- **Important Files:** `frontend/src/tools/calculators/mva/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mva-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Margin Interest Calculator (Screenshot-First)
- **Summary:** Shipped Margin Interest Calculator on existing catalog slug `margin-interest-calculator` (`MarginInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ffa5`). Four fields only: amount borrowed, annual rate %, days, inline margin interest. 360-day simple interest. Denomination currency. Omega UI. Activated.
- **Example:** PKR 100,000 × 12% × (30/360) = PKR 1,000.00.
- **Important Files:** `frontend/src/tools/calculators/margin-interest/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-margin-interest-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Jensen's Alpha Calculator (Screenshot-First)
- **Summary:** Shipped Jensen's Alpha Calculator on existing catalog slug `jensens-alpha-calculator` (`JensensAlphaCalculator`, catalog `6af46f0fa27d8d1d4e9900d7`). Portfolio return from beginning/ending values; risk-free rate, beta, market return (default 11%); inline Jensen's alpha. Denomination currency. Omega UI. Activated.
- **Example:** Beginning 10,000 / Ending 11,500 / Rf 4% / β 1.2 / Rm 11% → portfolio return 15%, expected 12.4%, alpha +2.6%.
- **Important Files:** `frontend/src/tools/calculators/jensens-alpha/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-jensens-alpha-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Compound Growth Calculator (Screenshot-First)
- **Summary:** Shipped Compound Growth Calculator on existing catalog slug `compound-growth-calculator` (`CompoundGrowthCalculator`, catalog `6af46f0fa27d8d1d4e9900c9`). Defaults match screenshot; period-by-period contributions; summary table; SVG balance chart; yearly breakdown disclosure. Denomination currency.
- **Example (standard r/n):** 1,000 @ 8% monthly + 50/mo beginning × 20y → final ≈ 34,574.16 (growth ≈ 21,574.16). Screenshot ~38,916 may use a different undocumented convention.
- **Important Files:** `frontend/src/tools/calculators/compound-growth/*`, registry, sitemap, tool.key, assign script, brain docs.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Compound Interest Calculator (Screenshot-First)
- **Summary:** Shipped Compound Interest Calculator on existing catalog slug `compound-interest-calculator` (`CompoundInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ff82`). Defaults 1000 / 8% / 20y / monthly; optional deposits; final balance + interest; balances views (bar/pie/table/cash details). Denomination currency. Omega UI. Activated.
- **Example:** 1,000 at 8% for 20 years monthly → ≈ 4,926.80 final, ≈ 3,926.80 interest.
- **Important Files:** `frontend/src/tools/calculators/compound-interest/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-compound-interest-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add CAGR Calculator (Screenshot-First)
- **Summary:** Shipped CAGR Calculator on existing catalog row (slug shortened to `cagr-calculator`, `CagrCalculator`, catalog `6af46f0fa27d8d1d4e9900c5`). Four fields with reverse solve; optional collapsed change-in-value; denomination currency. Omega UI. Activated.
- **Example:** Initial 10,000 / final 15,000 / 5 periods → CAGR ≈ 8.45%.
- **Important Files:** `frontend/src/tools/calculators/cagr/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cagr-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Bitcoin ETF Calculator (Screenshot-First)
- **Summary:** Shipped Bitcoin ETF Calculator on existing catalog slug `bitcoin-etf-calculator` (`BitcoinEtfCalculator`, catalog `6af46f0fa27d8d1d4e9900c4`). Custom ETF + manual expense ratio (no invented ticker fees), compounding FV, estimated expense fees + other costs. Denomination currency. Omega UI.
- **Assumptions:** Annual compounding; returns are estimates not guarantees; no live prices; no verified ETF expense catalog in-repo.
- **Important Files:** `frontend/src/tools/calculators/bitcoin-etf/*`, registry, `sitemap.ts`, `tool.key.ts`, `assign-bitcoin-etf-tool.ts`, brain docs.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Basis Point Calculator (Screenshot-First)
- **Summary:** Shipped Basis Point Calculator on existing catalog slug `basis-point-calculator` (`BasisPointCalculator`, catalog `6af46f0fa27d8d1d4e9900c3`). Linked decimal/percent/permille/bps conversion plus x bps of amount with denomination currency. Omega UI. Shared shell, SEO, embed.
- **Example:** 0.01 decimal = 1% = 10‰ = 100 bps; 1.5 bps of PKR 65,000 = PKR 9.75.
- **Important Files:** `frontend/src/tools/calculators/basis-point/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-basis-point-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Annualized Return Calculator (Screenshot-First)
- **Summary:** Shipped Annualized Return Calculator on existing catalog slug `annualized-return-calculator` (`AnnualizedReturnCalculator`, catalog `6af46f0fa27d8d1d4e9900bf`). Modes: total return % (default) or beginning/ending values; holding period years → annualized %. Blank start; denomination currency on values mode only. Omega UI. Activated.
- **Example:** Total return 50%, 3 years → ≈ 14.47%.
- **Important Files:** `frontend/src/tools/calculators/annualized-return/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-annualized-return-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Annualized Rate of Return Calculator (Screenshot-First)
- **Summary:** Shipped Annualized Rate of Return Calculator on existing catalog slug `annualized-rate-of-return-calculator` (`AnnualizedRateOfReturnCalculator`, catalog `6af46f0fa27d8d1d4e990014`). Compounding annualization with period radios (annual/quarterly/monthly/weekly/daily). Blank period rate; allow zero and negatives to −100%. Omega UI. Shared shell, SEO, embed.
- **Example:** Monthly 2% → ≈ 26.82% annualized.
- **Important Files:** `frontend/src/tools/calculators/annualized-rate-of-return/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-annualized-rate-of-return-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated. Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Tenure Calculator (Screenshot-First)
- **Summary:** Shipped Tenure Calculator on existing catalog slug `tenure-calculator` (`TenureCalculator`, catalog `6af46f0fa27d8d1d4e9900bb`). Average tenure = combined service ÷ employees (years); specific tenure = calendar end − start. Blank start; no currency. Omega UI. Activated.
- **Example:** 100 employees / 650 combined years → 6.5 years; 2020-01-01 to 2025-01-01 → 5 years.
- **Important Files:** `frontend/src/tools/calculators/tenure/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-tenure-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Smoker's CTC Calculator (Screenshot-First)
- **Summary:** Shipped Smoker's CTC Calculator on existing catalog id `6af46f0fa27d8d1d4e9900b9`, slug shortened to `smokers-ctc-calculator` (`SmokersCtcCalculator`). Smoke-break time, wage periods, collapsed work-day settings, labor cost while smoking, pack spend (1 cig/break), illustrative 11-min life line. Denomination currency (PKR). Omega UI. Activated.
- **Important Files:** `frontend/src/tools/calculators/smokers-ctc/*`, registry, `sitemap.ts`, `tool.key.ts`, `assign-smokers-ctc-tool.ts`, brain docs.
- **Verification:** MongoDB activated. Lint/builds/browser/tests omitted per user.

### 2026-11-15 — Add Sell-Through Rate Calculator (Screenshot-First)
- **Summary:** Shipped Sell-Through Rate Calculator on existing catalog slug `sell-through-rate-calculator` (`SellThroughRateCalculator`, catalog `6af46f0fa27d8d1d4e9900b8`). (Units sold ÷ units received) × 100. Blank start; received > 0; zero sold OK; reject sold > received. No currency. Omega UI. Shared shell, SEO, embed.
- **Example:** 150 sold / 200 received → 75%.
- **Important Files:** `frontend/src/tools/calculators/sell-through-rate/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-sell-through-rate-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add Profitability Index Calculator (Screenshot-First)
- **Summary:** Shipped Profitability Index Calculator on existing catalog slug `profitability-index-calculator` (`ProfitabilityIndexCalculator`, catalog `6af46f0fa27d8d1d4e9900b2`). PI = PV ÷ investment; compact interpretation. Denomination currency (PKR). Omega UI. Activated.
- **Important Files:** `frontend/src/tools/calculators/profitability-index/*`, registry, `sitemap.ts`, `tool.key.ts`, `assign-profitability-index-tool.ts`, brain docs.
- **Verification:** MongoDB activated. Lint/builds/browser/tests omitted per user.


### 2026-11-15 — Add ROAS Calculator (Screenshot-First)
- **Summary:** Shipped ROAS Calculator on existing catalog slug `roas-calculator` (`RoasCalculator`, catalog `6af46f0fa27d8d1d4e9900b5`). Ad spend, know-revenue Yes/No (default Yes), ad revenue → ROAS %; collapsed ad-only ROI (not overall business profit). Denomination currency (PKR). Omega UI. Shared shell, SEO, embed.
- **Example:** Spend PKR 10,000 / revenue PKR 40,000 → ROAS 400% (4×); ad-only ROI 300%.
- **Important Files:** `frontend/src/tools/calculators/roas/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-roas-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activation attempted; lint/builds/browser/automated tests omitted per user.


### 2026-11-15 — Add Safety Stock Calculator (Screenshot-First)
- **Summary:** Shipped Safety Stock Calculator on existing catalog slug `safety-stock-calculator` (`SafetyStockCalculator`, catalog `6af46f0fa27d8d1d4e99002f`). Basic section: max/avg daily usage + max/avg lead time (days) → safety stock and reorder point (ceil). Statistical section collapsed with note only (no invented inputs). Omega UI. Shared shell, SEO, embed.
- **Example:** 100 / 10 / 70 / 7 → SS 510, ROP 1,000.
- **Important Files:** `frontend/src/tools/calculators/safety-stock/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-safety-stock-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Formula self-check pass. Lint/builds/browser/unit-suite omitted per user.

### 2026-11-10 — Project Initialization & Independent App Restructure
- **Commits:** `b36a6ee`, `fe6444e`, `684a7e3`, `37c0d96`, `5f378c9`, `488c43f`
- **Summary:** Initialized ToolHub repository and migrated from an npm-workspace monorepo into completely independent `frontend/` (Next.js App Router) and `backend/` (Express + Mongoose) applications; configured root `.gitignore`.
- **Important Files:** `frontend/package.json`, `backend/package.json`, `.gitignore`, `backend/src/app.ts`, `backend/src/server.ts`, `frontend/src/server/api/client.ts`.
- **Verification:** Historical commits prior to Shared Brain setup (not re-run at this commit).

### 2026-11-10 — Public Website & Admin Dashboard UI Foundations
- **Commits:** `896ba49`, `9bfcd76`, `7a7605d`
- **Summary:** Implemented locked teal design system (`#087E8B` primary, `#163C43` dark accent, `#F7F8F6` canvas), 9 public `(website)` pages backed by `sample-data.ts`, and 13 isolated admin dashboard UI pages backed by `admin-mock-data.ts`.
- **Important Files:** `frontend/tailwind.config.ts`, `frontend/src/app/globals.css`, `frontend/src/app/(website)/*`, `frontend/src/app/admin/*`, `frontend/src/components/*`.
- **Verification:** Historical UI milestones (now covered by baseline frontend checks below).

### 2026-11-11 — Admin Authentication, Brand Refactor & PWA Assets
- **Commits:** `0f2407b`, `834082a`, `2122725`, `136359a`, `28efe0c`
- **Summary:** Implemented `AdminUser` & `AdminSession` models, Argon2id hashing, `HttpOnly` cookie session flow, Edge + Server admin route protection, rate limiting, account lockout, and `nodemailer` SMTP password reset; added PWA manifest/icons; refactored brand naming from Mega Tools to Omega Calculators.
- **Important Files:** `backend/src/modules/admins/admin-user.model.ts`, `backend/src/modules/auth/*`, `backend/src/services/email.service.ts`, `backend/src/scripts/create-admin.ts`, `frontend/src/middleware.ts`, `frontend/src/server/auth/*`, `frontend/src/app/manifest.json`.
- **Verification:** Note: `nodemailer` dependency added in `28efe0c` requires local `npm install` in `backend/` before `tsc --noEmit` passes.

### 2026-11-11 — Category Hierarchy, S3 Media Library, Tool Catalog & Public Catalog Endpoints
- **Commits:** `d56372b`, `bf487af`, `bc7c46b`, `fa6436b`, `db76e7a`, `bccdc1f`, `ef4ed1c`
- **Summary:**
  - Added collapsible dark admin nav (`admin-nav.tsx`) and dynamic pagination window (`TablePagination.tsx`).
  - Implemented 3-level `Category` (`category` / `pillar` / `sub_pillar`) CRUD, admin pages, and `seed-categories.ts`.
  - Implemented AWS S3 pre-signed browser upload flow, `MediaAsset` model, and `/admin/media`.
  - Implemented `Tool` catalog CRUD, placement validation, icon picker, `seed-tools.ts` (4,351 catalog entries), and public `/api/v1/catalog/categories` + `/api/v1/catalog/featured` wired to homepage `/`.
- **Important Files:** `backend/src/modules/categories/*`, `backend/src/modules/media/*`, `backend/src/modules/tools/*`, `backend/src/modules/catalog/*`, `backend/src/services/s3.service.ts`, `frontend/src/app/(website)/page.tsx`, `frontend/src/app/admin/(dashboard)/categories/*`, `media/*`, `tools/*`.
- **Verification:** Verified via file inspection and baseline checks (`media.key.ts`, `tool.key.ts`, `tool.copy.ts` self-checks pass; frontend `tsc --noEmit` and `next lint` pass with 0 errors; backend `tsc --noEmit` fails locally until `npm install` installs `nodemailer` and `@aws-sdk/*`).

### 2026-11-11 — Shared Project Brain, Ponytail Antigravity Adaptation & Cross-Agent Rules
- **Summary:** Inspected the entire repository and `.cursor/rules/ponytail.mdc`; preserved `.cursor/rules/ponytail.mdc` untouched; added `.cursor/rules/mega-tools-brain.mdc`, Antigravity rules `.agents/rules/ponytail.md` and `.agents/rules/mega-tools-brain.md`, root `AGENTS.md`, and all 13 topic-specific documents under `brain/`.
- **Important Files Changed:** `AGENTS.md`, `.agents/rules/ponytail.md`, `.agents/rules/mega-tools-brain.md`, `.cursor/rules/mega-tools-brain.mdc`, `brain/*.md`.
- **Verification Performed:**
  - Confirmed `.cursor/rules/ponytail.mdc` unmodified (`git diff` check).
  - Verified Antigravity (`trigger: always_on`) and Cursor (`alwaysApply: true`) rule syntax, no npm workspaces added, no `.env`/`.env.local` modified, and no secrets copied into documentation.
  - Observed `cd frontend && npm run type-check` (0 errors) and `npm run lint` (0 errors, 11 `<img>` warnings); observed `npx tsx` self-checks for `media.key.ts`, `tool.key.ts`, `tool.copy.ts` passing; documented local `backend` `tsc --noEmit` missing-dependency errors accurately in `brain/CURRENT_STATE.md`.
- **Commit Hash:** `cf87b79` (following `1deba07`).

### 2026-11-11 — Contact page redesign
- **Summary:** Rebuilt `/contact` with a compact headline and note sheet, a full-width form, an uneven support row, a three-step delivery note, and a quiet directory link. The form still only validates in the browser. A passed check says the message was not sent. Subject is a select: general inquiry, feature request, bug report, partnership, or other. Header and footer were not changed.
- **Important Files:** `frontend/src/app/(website)/contact/page.tsx`, `frontend/src/components/contact/ContactFormClient.tsx`.
- **Verification:** Desktop review of `http://localhost:3000/contact` covered empty-field errors, an invalid email, the disabled Checking state, and the not-sent result. Phone width (390) and tablet width (768) showed stacked content with no horizontal overflow. `cd frontend && npm run type-check` passed.

### 2026-11-11 — About page art direction
- **Summary:** Rebuilt `/about` as separate compositions: a product board in the hero, an editorial index for the story, a mixed platform layout (dark calculator panel, conversion line, code sample, ruled list), a numbered principles list, a typography-led value statement, and a full-width dark close. Live category and tool totals still come from `/catalog/categories`. Header and footer were not changed.
- **Important Files:** `frontend/src/app/(website)/about/page.tsx`.
- **Verification:** Desktop review of `http://localhost:3000/about` showed the hero board, platform panels, and numbered principles. Phone-width emulation was not available in this session.

### 2026-11-11 — Public About page redesign
- **Summary:** Replaced the About page layout and copy. Sections are hero, story, mission, offerings, principles, practical reasons to use the directory, and a closing pair of links. Category and tool totals are loaded from `GET /api/v1/catalog/categories` and omitted when the API is unavailable. No testimonials or invented history. Header and footer were not changed.
- **Important Files:** `frontend/src/app/(website)/about/page.tsx`, `brain/FRONTEND.md`, `brain/CURRENT_STATE.md`, `brain/TASKS.md`.
- **Verification:** Desktop review of `http://localhost:3000/about` showed the hero, live totals (19 categories, 4,351 tools), mission, principles, and footer. Phone-width emulation was blocked in this session, so the mobile layout was checked from the responsive classes only. `cd frontend && npm run type-check` passed (`tsc --noEmit`, 0 errors).

### 2026-11-11 — Implement Auto Loan Calculator & Allowlisted Tool Registry Wiring
- **Summary:** Added `executionType` and allowlisted `componentKey` to `Tool` schema/admin form/CLI assignment (`tool:assign`), added public `GET /api/v1/catalog/tools/:slug`, wired `/tools/[slug]` and `ToolWorkspace` to resolve allowlisted components while preserving MongoDB SEO metadata and sample fallback, and built the full client-side Auto Loan Calculator (`AutoLoanCalculator`) with integer-cent amortization, monthly/yearly views, SVG Principal vs. Interest chart, CSV export, informational guide/FAQs, and 14 unit test suites. Assigned `componentKey: 'AutoLoanCalculator'` to existing MongoDB record `auto-loan-calculator` (`6af46f0fa27d8d1d4e98ff4d`).
- **Important Files Changed:** `backend/src/modules/tools/*`, `backend/src/validation/admin-tool.schema.ts`, `backend/src/modules/catalog/*`, `backend/src/scripts/assign-tool-component.ts`, `backend/package.json`, `frontend/src/types/tool.ts`, `frontend/src/tools/registry/*`, `frontend/src/tools/calculators/auto-loan/*`, `frontend/src/server/catalog/tools.ts`, `frontend/src/server/tools/actions.ts`, `frontend/src/components/admin/forms/ToolForm.tsx`, `frontend/src/components/shared/ToolWorkspace.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `brain/*`.
- **Verification Performed:**
  - `cd backend && npm run type-check`, `npm run build`, and `npx tsx` self-checks (`tool.key.ts`, `media.key.ts`, `tool.copy.ts`) passed.
  - `cd frontend && npm run type-check` and `npm run lint` passed (0 errors, 11 pre-existing `<img>` warnings); `npm run build` compiled cleanly before failing at `Collecting page data` (`no direct app page entry found for /_not-found`) due to shared `.next/` contention with the concurrent `next dev` server.
  - `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\auto-loan\calculation.test.ts` passed (14 test suites).
  - Verified live HTTP 200 on `/api/v1/catalog/tools/auto-loan-calculator`, `/`, `/tools/auto-loan-calculator`, `/tools/age-calculator`, and `/about`, plus HTTP 404 on unknown slugs.
- **Commit Hash:** `062c763` (`feat(tools): implement auto loan calculator`).

### 2026-11-11 — Refine Auto Loan Calculator UI/UX, Two-Column Layout, TOC & Guide Content
- **Summary:** Refined the Auto Loan Calculator experience using a reference-inspired two-column responsive layout (`~60-65%` Left: Breadcrumbs, Category/Group/Client badges, Title, Intro, accessible 11-item `TableOfContents`, MongoDB-backed `RelatedCatalogTools` distinguishing `Preview Only` links vs non-link `Catalog Only` entries without broken 404 links, and 11 educational sections including formula, 36–72 month comparison, worked example, comparison tips, and FAQs; `~35-40%` Right on desktop and top-of-page below compact header on tablet/mobile: compact form with inline units & `InfoTooltip` popovers, Monthly Payment & Cost metrics, Donut Breakdown chart, inline/full-modal Amortization Schedule & CSV download). Extended `GET /api/v1/catalog/tools/:slug` with `relatedTools` from existing MongoDB sibling records and prevented 404 category breadcrumb links when a DB category slug lacks a `/categories/[slug]` route.
- **Important Files Changed:** `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/server/catalog/tools.ts`, `frontend/src/components/shared/RelatedCatalogTools.tsx`, `frontend/src/app/globals.css`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/auto-loan/{InfoTooltip,TableOfContents,AutoLoanGuideArticle,AutoLoanCalculator,AutoLoanForm,AutoLoanResults,AutoLoanChart,AmortizationTable,content,calculation.test}.ts*`, `brain/*`.
- **Verification Performed:**
  - `cd backend && npm run type-check && npm run build` passed (`0` errors); `GET /api/v1/catalog/tools/auto-loan-calculator` returned 6 real MongoDB `relatedTools`.
  - `cd frontend && npm run type-check` (`0` errors), `npm run lint` (`0` errors, 11 pre-existing `<img>` warnings), and `calculation.test.ts` (15 test suites passed).
  - Isolated production `next build` passed (`46/46` pages, exit `0`).
  - Headless Chromium CDP verification across `1440px` desktop (`60.2%`/`37.2%`, non-sticky right panel), `768px` tablet, and `375px` mobile (calculator directly below header, zero horizontal overflow) verified live Worked Example outputs, validation, Reset, tooltip, inline/modal schedule + `Escape`, FAQ toggle, TOC anchors + `scroll-margin-top`, zero 404 `<main>` links, and zero runtime exceptions.
- **Commit Hash:** Recorded on `feat(tools): refine auto loan calculator page and content`.

### 2026-11-11 — Final Auto Loan Calculator UI/UX Polish & Height-Aware Sticky Sidebar
- **Summary:** Performed a comprehensive UI/UX polish across the Auto Loan Calculator page and shared website chrome without altering calculation formulas or validation rules. Added `StickyCalculatorAside` (height-aware desktop `position: sticky` with bottom-pinned negative offset when taller than the viewport, automatic resize/content adjustment via `ResizeObserver`, dynamic keyboard-focus offset/blur restoration so focused controls clear the `64px` header without losing article scroll context, clean footer stop, and static flow below `1024px`). Balanced typography weights (`font-semibold` headings, `font-medium` labels, `font-normal` `16px`/`1.75` article body), standardized calculator inputs/selects/buttons to `h-11` (`44px` wrapper / `42px` inner input) with `autoComplete="off"`, aligned paired rows (`Auto Price | Down Payment`, `Loan Term | Interest Rate`, `Trade-in Value | Amount Owed`), fixed currency selector double-parentheses display (`USD ($)`), collapsed optional Sales Tax/Fees & Chart/Breakdown drawers by default so Monthly Payment results sit above the desktop fold, unified the 11 editorial guide sections into one bordered white card with subtle dividers, polished `RelatedCatalogTools` / `FAQAccordion` / `Footer` heading hierarchy, and prevented `768px` tablet `Header` overflow. Reconciled `brain/CURRENT_STATE.md` with `/contact` commit `ece3bce` while preserving prior local edits. **Financial calculation accuracy testing remains a separate pending next step.**
- **Important Files Changed:** `frontend/src/tools/calculators/auto-loan/{StickyCalculatorAside,AutoLoanCalculator,AutoLoanForm,AutoLoanResults,AutoLoanChart,AmortizationTable,TableOfContents,AutoLoanGuideArticle}.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/components/layout/{Header,Footer}.tsx`, `frontend/src/components/shared/{FAQAccordion,RelatedCatalogTools}.tsx`, `brain/{CURRENT_STATE,FRONTEND,DESIGN_SYSTEM,TASKS,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd frontend && npm run type-check` (`0` errors) and `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings).
  - `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\auto-loan\calculation.test.ts` (`15` test suites passed).
  - Isolated production `npx next build` (`46/46` routes compiled cleanly) + headless Chromium CDP verification on `next start` (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`): verified `0` horizontal/header overflow across all 6 viewports, `0px` paired input alignment drift, `1.75` body line-height ratio, above-fold Monthly Payment, sticky mid-scroll & footer clearance, keyboard-focus header clearance (`clearedHeader: true`), interactive drawers/Amortization Full View dialog, and `0` console/runtime errors.
- **Commit Hash:** Recorded on `d941890` (`style(tools): polish auto loan calculator UI and sticky layout`).

### 2026-11-11 — Remove Extra Auto Loan Badges & Fix Amortization Modal Portal Layering
- **Summary:** Addressed visual feedback on `/tools/auto-loan-calculator`: removed the three redundant pill badges above the Auto Loan Hero heading (breadcrumbs already show category context) and replaced pill status badges on `RelatedCatalogTools` cards with calm footer labels (`Open`, `Preview only`, `Catalog only`); moved the `AmortizationTable` Full View modal into `ReactDOM.createPortal(..., document.body)` at `z-[80]` with body scroll lock cleanup and added a portal focus-containment guard (`element.contains(target)`) + timer cleanup in `StickyCalculatorAside` so open `FAQAccordion` `rotate-180` chevrons never render above the modal overlay.
- **Important Files Changed:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/components/shared/RelatedCatalogTools.tsx`, `frontend/src/tools/calculators/auto-loan/{AmortizationTable,StickyCalculatorAside}.tsx`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd frontend && npm run type-check` (`0` errors), `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings), and `calculation.test.ts` (`15` test suites passed).
  - Isolated production `npx next build` (`46/46` routes) + headless Chromium CDP across all 6 viewports (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`): confirmed `heroBadgeTexts: []`, `relatedBadgeTexts: []`, `dialogInBody: true`, `modalNotOccludedByFaq: true` (`elementFromPoint` on rotated FAQ #6 chevron returns `TD` inside dialog), `clearedHeader: true`, `0` overflow across all viewports, and `0` console/runtime errors. Visual inspection of `desktop-1440-top.png` and `modal-fixed.png` confirmed clean badge-free layout and unobstructed dialog.
- **Commit Hash:** Recorded on `cfbe897` (`fix(tools): remove extra badges and portal amortization modal`).

### 2026-11-11 — Align Auto Loan Hero & Calculator Cards on Same Top Line
- **Summary:** Moved `Breadcrumbs` above the responsive two-column grid in `frontend/src/app/(website)/tools/[slug]/page.tsx` so the left Hero card (`Auto Loan Calculator`) and right sticky Calculator card (`Calculator`) start on the exact same horizontal top line (`heroTop === calcTop === 133px`, `0px` diff) on desktop viewports while preserving mobile/tablet top-to-bottom stacking.
- **Important Files Changed:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `brain/{CURRENT_STATE,TASKS,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd frontend && npm run type-check` (`0` errors), `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings), and `calculation.test.ts` (`15` test suites passed).
  - Isolated production `npx next build` + headless Chromium CDP across all 6 viewports (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`): verified `heroVsCalcCardTop.diff === 0` (`133px`/`133px`), `aboveFold900: true`, `clearedHeader: true`, `modalNotOccludedByFaq: true`, `0` overflow across all viewports, and visual confirmation in `desktop-1440-top.png`.
- **Commit Hash:** Recorded on `2b4ac12` (`style(tools): align auto loan hero and calculator cards`).

### 2026-11-12 — Implement Second Working Calculator: Loan Calculator (`LoanCalculator`)
- **Summary:** Implemented the complete client-side Loan Calculator (`LoanCalculator`) under `frontend/src/tools/calculators/loan/`, preserving all design/typography/sticky/accessibility conventions finalized on Auto Loan Calculator. Approved `LoanCalculator` in `backend/src/modules/tools/tool.key.ts` and `frontend/src/tools/registry/{keys,index}.ts`, generalized the two-column template in `frontend/src/app/(website)/tools/[slug]/page.tsx` via `TWO_COLUMN_TOOL_CONFIGS` without modifying Auto Loan calculations/UI, and bound the existing MongoDB `loan-calculator` record (`6af46f0fa27d8d1d4e98ff4c`) via `npm run tool:assign` while keeping existing metadata and SEO fields intact. Supports Amortized & Interest-Only loan modes (I/O period, post-I/O amortization or full-term principal due), Monthly (`12/yr`), Biweekly (`26/yr`), and Weekly (`52/yr`) schedules with nominal APR conversion, recurring (`every-payment`, calendar `monthly`, calendar `yearly`) and one-time extra payments capped cleanly against remaining balance with interest savings tracking, upfront vs. financed origination fees, integer-cent reconciliation, Principal/Interest donut + Remaining Balance Over Time SVGs, portaled `z-[80]` Period/Yearly amortization schedule + CSV export, 12 educational sections + worked example + FAQs, and 14 independent financial unit test suites.
- **Important Files Changed:** `backend/src/modules/tools/tool.key.ts`, `frontend/src/tools/registry/{keys,index}.ts`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/loan/{types,validation,calculation,calculation.test,content}.ts*`, `frontend/src/tools/calculators/loan/{LoanCalculator,LoanForm,LoanResults,LoanChart,LoanAmortizationTable,LoanGuideArticle}.tsx`, `brain/{CURRENT_STATE,FRONTEND,BACKEND,TASKS,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd backend && npm run tool:assign -- --slug loan-calculator --component LoanCalculator --execution client --activate`, `npm run type-check` (`0` errors), `npm run build`, and `npx tsx src/modules/tools/tool.key.ts` (`tool.key ok`).
  - `cd frontend && npm run type-check` (`0` errors) and `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings).
  - `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\loan\calculation.test.ts` (`14` suites passed) and `auto-loan/calculation.test.ts` (`15` suites passed).
  - Isolated production `npx next build` (`46/46` routes) + headless Chromium CDP across all 6 viewports (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`): verified `/` featured link, `/tools/loan-calculator` & `/tools/auto-loan-calculator` bidirectional live `Open` links, `0px` top-line card alignment (`133px`/`133px`), sticky sidebar & keyboard focus header clearance, Biweekly/Weekly/Extra/Interest-Only modes, dual SVG charts, portaled `z-[80]` modal (`modalNotOccludedByFaq: true`), `0` horizontal/header overflow across all viewports, and `0` console/runtime errors, plus visual inspection of desktop/modal/tablet/mobile screenshots.
- **Commit Hash:** Recorded on `600e382` (`feat(tools): implement loan calculator using shared tool design`).

### 2026-11-12 — Fix Native Date Input Picker Alignment in Calculator Forms
- **Summary:** Fixed `Loan Start Date` (`<input type="date">`) icon alignment where `display: flex` on the shared `Input` primitive caused Chromium to collapse the calendar picker icon into the left third of the box. Switched native `date` / `datetime-local` / `time` inputs in `frontend/src/components/ui/input.tsx` to `block` with consistent calendar icon styling, and added `autoComplete="off"` to `AutoLoanForm.tsx` start-date input. Both `/tools/auto-loan-calculator` and `/tools/loan-calculator` share the fix.
- **Important Files Changed:** `frontend/src/components/ui/input.tsx`, `frontend/src/tools/calculators/auto-loan/AutoLoanForm.tsx`, `brain/{CURRENT_STATE,FRONTEND,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd frontend && npm run type-check` (`0` errors), `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings), and `loan/calculation.test.ts` (`14` suites) + `auto-loan/calculation.test.ts` (`15` suites) passed.
  - Isolated production `npx next build` (`46/46` routes) + headless Chromium CDP screenshot (`auto-loan-date-fixed.png`) verified full-width `44px` (`380x44`) date input with right-aligned calendar icon and `Loan Calculator` live `Open` related card link.
- **Commit Hash:** Recorded on `style(ui): align date input picker indicator in shared Input`.

### 2026-11-12 — Publish a slice of browser tools
- **Summary:** Added `npm run tools:publish`. It turns on 15 browser tools in each category (all of them when a category has fewer) and marks 20 active browser tools as featured. Server and third-party tools are left alone. `tools:seed` still resets those flags.
- **Important Files:** `backend/src/scripts/publish-browser-tools.ts`, `backend/package.json`.
- **Verification:** `npx tsc --noEmit` passed. The script ran against `omega_calculators`: 273 tools activated, 17 categories at 15 active, Design & Graphics at 8, Developer & Misc Utilities at 12, and 20 featured including Auto Loan Calculator and Loan Calculator.

### 2026-11-12 — Local media storage driver
- **Summary:** Media uploads follow `STORAGE_DRIVER`. The default `local` writes `backend/uploads` and publishes them at `/uploads` through a Next.js rewrite. The browser sends those bytes to `/api/media-upload`, which forwards them to Express. `s3` still signs a direct browser PUT. Deleting a file uses its saved URL, so turning the driver to `s3` later sends new files to the bucket and leaves files already on disk where they are.
- **Important Files:** `backend/src/services/storage.ts`, `backend/src/services/local-storage.ts`, `backend/src/services/s3.service.ts`, `backend/src/config/env.ts`, `frontend/src/app/api/media-upload/route.ts`, `frontend/next.config.ts`.
- **Verification:** `npx tsx src/modules/media/media.key.ts` and `npx tsx src/services/local-storage.ts` passed. `npx tsc --noEmit` passed in `backend/` and `frontend/`. A probe file was served as HTTP 200 from `http://localhost:5001/uploads/...` and from `http://localhost:3000/uploads/...`. `PUT /api/v1/admin/media/object` without a session returned 401. The probe file was removed.

### 2026-11-12 — Shared server category list in the site chrome
- **Summary:** Header, footer, the mobile menu, the homepage, and the About totals all read `getPublicCategories()`. `React.cache()` keeps that Express call to one per request. The menu itself stays a client component, but it only receives the list. Category index and category detail pages still use sample data.
- **Important Files:** `frontend/src/server/catalog/categories.ts`, `frontend/src/components/layout/Header.tsx`, `Footer.tsx`, `MobileNavigation.tsx`.
- **Verification:** `npx tsc --noEmit` in `frontend/` passed.

### 2026-11-12 — Category icons on local storage
- **Summary:** Root categories gained `iconUrl` and `iconMedia`. `npm run categories:icons` downloads one Lucide SVG per category name, stores it with the local driver, and writes the `/uploads` URL onto the category. `GET /catalog/categories` returns `iconUrl`. Header, footer, mobile menu, and the homepage show that image.
- **Important Files:** `backend/src/modules/categories/category.model.ts`, `backend/src/scripts/attach-category-icons.ts`, `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/components/layout/Header.tsx`, `Footer.tsx`, `MobileNavigation.tsx`, `frontend/src/app/(website)/page.tsx`.
- **Verification:** Backend and frontend `npx tsc --noEmit` passed. The script attached 19 icons. `GET /catalog/categories` returned `/uploads/media/68ba4737-06c6-42a6-8087-e1d196515f8d.svg` for Finance & Business, and `http://localhost:3000` served that file as HTTP 200 `image/svg+xml`.

### 2026-11-12 — Live category index
- **Summary:** `/categories` loads root categories from `GET /catalog/categories` on the server. The page still filters that list in the browser. Cards use each category's `iconUrl` and tool count. Category detail pages still use sample data.
- **Important Files:** `frontend/src/app/(website)/categories/page.tsx`, `frontend/src/components/categories/CategoriesClient.tsx`, `frontend/src/components/shared/CategoryCard.tsx`.
- **Verification:** Frontend `npx tsc --noEmit` passed. `/categories` rendered the 19 live names, including Finance & Business, and the filter kept Physics only.

### 2026-11-12 — Category descriptions
- **Summary:** `npm run categories:descriptions` writes a short public description on each root category that still has an empty description. The admin create and edit forms already save `description`; the field is labeled Public description, and the admin tree shows the saved text. The public category cards render that description.
- **Important Files:** `backend/src/scripts/set-category-descriptions.ts`, `frontend/src/components/admin/forms/CategoryForm.tsx`, `frontend/src/components/shared/CategoryCard.tsx`, `frontend/src/app/admin/(dashboard)/categories/page.tsx`.
- **Verification:** The script updated 19 descriptions. `GET /catalog/categories` returned the Finance & Business sentence, and `/categories` showed it on the card.

### 2026-11-12 — Live category detail grouped by pillar
- **Summary:** `GET /catalog/categories/:slug` returns one active root category with its tools grouped under pillars and sub-pillars. Tools with no active pillar land in `ungrouped`. `/categories/[slug]` renders that tree. Active tools link to `/tools/[slug]`. Inactive catalog rows stay on the page and are not linked.
- **Important Files:** `backend/src/modules/catalog/catalog.service.ts`, `backend/src/modules/catalog/catalog.router.ts`, `frontend/src/server/catalog/categories.ts`, `frontend/src/app/(website)/categories/[slug]/page.tsx`.
- **Verification:** Backend and frontend `npx tsc --noEmit` passed. `GET /catalog/categories/finance-business` returned 644 tools, 33 pillars, and 385 ungrouped. A missing slug returned 404. `/categories/finance-business` rendered Loan Calculator, its Home Loan Calculator and Student Loan Calculator sub-pillars, and the Other tools section.

### 2026-11-12 — Category pages list active tools only
- **Summary:** `GET /catalog/categories/:slug` now returns tools with `isActive: true`. Pillars and sub-pillars that have no active tool are omitted. The category page links every listed tool.
- **Important Files:** `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/app/(website)/categories/[slug]/page.tsx`.
- **Verification:** `GET /catalog/categories/finance-business` returned 15 tools, and `/categories/finance-business` showed 15 Open links with no Catalog rows.

### 2026-11-12 — Paginated public tools directory
- **Summary:** `/tools` reads `GET /catalog/tools`. The list is active tools only, 24 per page, with a name search and category filter kept in the URL. Category pills count active tools.
- **Important Files:** `backend/src/modules/catalog/catalog.service.ts`, `backend/src/modules/catalog/catalog.router.ts`, `frontend/src/server/catalog/tools.ts`, `frontend/src/app/(website)/tools/page.tsx`.
- **Verification:** `/tools` compiled and listed 275 active tools, 24 per page. Page 2 showed tools 25-48. `?q=loan&category=finance-business` returned Auto Loan Calculator and Loan Calculator.



### 2026-11-12 — Dynamic tool SEO management + calculator standards lock
- **Summary:** Expanded optional Tool SEO fields (robots/social/schema/sitemap prefs), redesigned Admin Tool SEO UI with previews + media pickers, fixed public `generateMetadata`/canonical/`metadataBase`/JSON-LD via shared `lib/seo/tool-seo.ts`, and revalidate public tool paths on admin save. Locked `CALCULATOR_STANDARDS.md` + `SEO_STANDARDS.md` with matching Cursor/Antigravity rules. Also includes Loan page UI polish (unified intro card, sticky internal scroll, copy/CSV reliability, heading/icon cleanup).
- **Important Files:** `backend/src/modules/tools/{tool.model,tool.service}.ts`, `backend/src/validation/admin-tool.schema.ts`, `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/lib/seo/*`, `frontend/src/components/admin/forms/{ToolForm,ToolSeoSection}.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/config/site.ts`, `brain/{SEO_STANDARDS,CALCULATOR_STANDARDS,README,CHANGELOG,CURRENT_STATE,TASKS,DECISIONS}.md`, `.cursor/rules/calculator-standards.mdc`, `.agents/rules/calculator-standards.md`.
- **Verification:** Backend `tsc --noEmit` passed; frontend `tsc --noEmit` passed; `tool-seo.test.ts` ok; currency/loan/auto-loan unit tests passed.

### 2026-11-12 — Sticky calculator internal scroll + themed table scrollbar
- **Summary:** `StickyCalculatorAside` now caps to the viewport under the site header and scrolls internally (`overflow-y-auto` + `overscroll-contain`, scrollbar visually hidden) when amortization/results expand. Amortization schedule overflow uses a Deep Teal `brand-scroll` scrollbar. Two-column tool pages merge hero + TOC + Related into one left card.
- **Important Files:** `frontend/src/tools/calculators/auto-loan/StickyCalculatorAside.tsx`, `frontend/src/tools/calculators/auto-loan/AmortizationTable.tsx`, `frontend/src/tools/calculators/loan/LoanAmortizationTable.tsx`, `frontend/src/app/globals.css`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/auto-loan/TableOfContents.tsx`, `frontend/src/components/shared/RelatedCatalogTools.tsx`.

### 2026-11-12 — Shared 49-currency support + public canvas polish
- **Summary:** Added reusable `frontend/src/tools/shared/currency.ts` (`49` ISO display currencies, `Intl` fraction digits, denomination-only formatting) plus searchable accessible `CurrencySelect`. Wired into Auto Loan and Loan calculators without changing financial formulas or adding FX conversion. Public `(website)` canvas set to white; calculator panels use soft elevation shadow.
- **Important Files:** `frontend/src/tools/shared/{currency.ts,currency.test.ts,CurrencySelect.tsx}`, `frontend/src/tools/calculators/auto-loan/{types,calculation,AutoLoanCalculator,AutoLoanForm,content}.*`, `frontend/src/tools/calculators/loan/{types,LoanCalculator,LoanForm,content}.*`, `frontend/src/app/(website)/layout.tsx`, `brain/{CURRENT_STATE,FRONTEND,TASKS,DESIGN_SYSTEM,CHANGELOG}.md`.
- **Verification:** Frontend `tsc --noEmit` passed; `currency.test.ts` ok (`49` currencies); Loan `calculation.test.ts` 14/14; Auto Loan `calculation.test.ts` 15/15; `next lint` 0 errors (pre-existing `@next/next/no-img-element` warnings only).

### 2026-11-12 — Loan Calculator page list/icon polish
- **Summary:** On `/tools/loan-calculator`, removed the hero tool icon beside the title; simplified shared `TableOfContents` to a plain heading with `list-disc` bullets (no header icon / fancy `01` indexes); replaced Loan guide-article `CheckCircle` markers and circled ordered-step badges with plain bullets; flattened `RelatedCatalogTools` from nested cards into a plain two-column bullet link list.
- **Important Files:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/auto-loan/TableOfContents.tsx`, `frontend/src/tools/calculators/loan/LoanGuideArticle.tsx`, `frontend/src/components/shared/RelatedCatalogTools.tsx`.
- **Verification:** Frontend `npm run type-check` and `npm run lint` passed (0 errors; pre-existing `@next/next/no-img-element` warnings only).

### 2026-11-12 — Category menu presentation
- **Summary:** The header category menu is a two-column subject panel with no tool counts. The footer and mobile menu show the first seven categories, plus a link to the full index.

### 2026-11-12 — Reusable calculator embed system
- **Summary:** Added `/embed/[slug]` minimal layout reusing registry calculators; Tool `embedEnabled` (default false) + height/layout/domains fields through admin Embedding & Sharing; public Embed dialog when eligible; CSP `frame-ancestors` split; optional `/embed.js` auto-resize; locked `EMBED_STANDARDS.md`.
- **Important Files:** `backend/src/modules/tools/{tool.model,tool.service}.ts`, `backend/src/validation/admin-tool.schema.ts`, `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/app/embed/**`, `frontend/src/lib/embed/*`, `frontend/src/components/{admin/forms/ToolEmbedSection,tools/CalculatorEmbedDialog,embed/EmbedResizeReporter}.tsx`, `frontend/public/embed.js`, `frontend/next.config.ts`, `brain/EMBED_STANDARDS.md`.
- **Verification:** Backend `tsc --noEmit` passed; frontend `tsc --noEmit` passed; `tool-embed.test.ts` ok; `tool-seo.test.ts` ok; Loan 14/14 + Auto Loan 15/15 calculation tests passed; `next lint` 0 errors (pre-existing img warnings); `next build` passed including `/embed/[slug]`.

### 2026-11-12 — Tool detail page production audit & standards lock
- **Summary:** Added `robots.ts`/`sitemap.ts` (implemented tools only); FAQ JSON-LD synced to visible guide FAQs; related tools link only implemented calculators; pillar related query requires `isActive`; Embed dialog portal/focus-trap/scroll-lock; Embed control moved into calculator header for card alignment; locked `TOOL_DETAIL_PAGE_STANDARDS.md`.
- **Important Files:** `frontend/src/app/{robots,sitemap}.ts`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `RelatedCatalogTools.tsx`, `CalculatorEmbedDialog.tsx`, `backend/src/modules/catalog/catalog.service.ts`, `brain/TOOL_DETAIL_PAGE_STANDARDS.md`.
- **Verification:** Frontend/backend `tsc` pass; `tool-seo`/`tool-embed`/Loan 14/Auto Loan 15 tests pass; `next lint` 0 errors (pre-existing img warnings); `next build` pass with `/robots.txt` + `/sitemap.xml` routes.

### 2026-11-12 — Embed default-ON policy + restore Embed button
- **Summary:** Root cause of missing Embed button was `embedEnabled` defaulting to false and eligibility requiring strict `=== true`. Policy locked to enabled-by-default (`resolveEmbedEnabled`: only explicit `false` disables). Schema/API/admin/UI updated; `npm run tools:embed-defaults` corrects implemented tools that inherited the old false write.
- **Important Files:** `frontend/src/lib/embed/tool-embed.ts`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `backend/src/modules/tools/tool.model.ts`, `backend/src/modules/{tools,catalog}/*.ts`, `backend/src/scripts/enable-default-embeds.ts`, `brain/EMBED_STANDARDS.md`.
- **Verification:** Frontend `tsc` + `tool-embed.test.ts` ok; `next lint` 0 errors; backend `tsc` ok. `tools:embed-defaults` could not reach Mongo in this environment (timed out); operators should run it once when DB is available if any implemented tools still have `embedEnabled: false` stored.

### 2026-11-12 — Dummy ad placeholders on tool detail pages
- **Summary:** Added reusable `AdSlot` + typed placements for `/tools/[slug]` (top banner, in-article, bottom banner; sidebar off). Placeholder-only design; no AdSense/scripts; embeds excluded; locked `AD_STANDARDS.md`.
- **Important Files:** `frontend/src/components/ads/AdSlot.tsx`, `frontend/src/lib/ads/*`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `brain/AD_STANDARDS.md`, `.cursor/rules/ad-standards.mdc`, `.agents/rules/ad-standards.md`.
- **Verification:** Frontend `tsc --noEmit` passed; Loan 14/14 + Auto Loan 15/15 passed; `next lint` 0 errors (pre-existing img warnings); `next build` passed; `/embed/[slug]` remains without AdSlot imports.

### 2026-11-12 — Lock master Tool Detail Page standards & new-tool playbook
- **Summary:** Extracted and locked Loan Calculator (`/tools/loan-calculator`) as the official master Tool Detail Page. Expanded `TOOL_DETAIL_PAGE_STANDARDS.md` with code- and visually-verified layout/typography/sticky/SEO/ads/embed rules; added `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`; wired Cursor + Antigravity always-on rules and `AGENTS.md`; updated Brain index/state/frontend/design/decisions/tasks. No calculator UI or formula source changes.
- **Important Files:** `brain/TOOL_DETAIL_PAGE_STANDARDS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `.cursor/rules/tool-detail-page-standards.mdc`, `.agents/rules/tool-detail-page-standards.md`, `AGENTS.md`, `brain/{README,CURRENT_STATE,FRONTEND,DESIGN_SYSTEM,CALCULATOR_STANDARDS,DECISIONS,TASKS,CHANGELOG}.md`, `.cursor/rules/calculator-standards.mdc`, `.agents/rules/calculator-standards.md`.
- **Verification:** Live browser inspect of `http://192.168.100.152:3000/tools/loan-calculator` (header, breadcrumbs, ads, Embed in calculator header, H1, TOC, related Open/Coming soon, guide, FAQ, footer); cross-checked Tailwind/constants in `page.tsx`, `StickyCalculatorAside`, `LoanCalculator`/`LoanForm`, `AdSlot`, Container. Docs-only diff — no frontend calculator source modified. Dry-run: Percentage Calculator would follow playbook steps 1–19 without a new design brief.

### 2026-11-12 — Align Auto Loan Calculator with master Tool Detail Page standards
- **Summary:** Brought Auto Loan Calculator into compliance with the locked Loan Calculator master shell without changing financial formulas. Removed two-column intro tool icon; converted guide CheckCircle/numbered steps to plain `list-disc`; matched form spacing/`h-11`/Calculate–Reset classes; replaced trade-in equity pill badges with muted helper text; removed results top border wrapper; metric “Total Estimated Cost” uses `text-accent` like other cards.
- **Important Files:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/auto-loan/{AutoLoanCalculator,AutoLoanForm,AutoLoanGuideArticle,AutoLoanResults}.tsx`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Live `/tools/auto-loan-calculator` + `/embed/auto-loan-calculator` (Embed visible; ads on public page only; embed `noindex`; calculator functional). Desktop 1440 no horizontal overflow; mobile 375 screenshot. `npx tsc --noEmit` passed; `next lint` 0 errors (pre-existing img warnings); Auto Loan 15/15 + Loan 14/14 calculation tests passed; `next build` passed.

### 2026-11-13 — Swap two-column tool detail columns (calculator left)
- **Summary:** Flipped the shared two-column `/tools/[slug]` shell to calculator/guide left (~66%) and Calculators.com-style `ToolDetailSidebar` right (~34%: More tools list, other-topic links, dark country-rules pills). Full-width intro above the grid. Right sidebar is desktop-sticky under the header; left column scrolls with the page.
- **Important Files:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/components/shared/ToolDetailSidebar.tsx`, `frontend/src/tools/calculators/auto-loan/StickyCalculatorAside.tsx`, `brain/{TOOL_DETAIL_PAGE_STANDARDS,CALCULATOR_STANDARDS,CURRENT_STATE,DECISIONS,CHANGELOG}.md`.
- **Verification:** Frontend `npx tsc --noEmit` passed; ReadLints clean on touched TSX.

### 2026-11-13 — Promote Auto Loan as final master Tool Detail Page
- **Summary:** Declared latest Auto Loan Calculator the official master visual/architectural reference (ADR-016 supersedes ADR-014). Aligned remaining Loan Calculator form/amortization micro-styles (`tabular-nums`, `gap-3.5`, empty schedule placeholder). Updated Brain standards, playbook, Cursor/Antigravity rules, and `AGENTS.md`. Shared shell (sidebar, ads, SEO, embed) unchanged; no formula changes; Auto Loan visual design left intact.
- **Important Files:** `frontend/src/tools/calculators/loan/{LoanForm,LoanAmortizationTable}.tsx`, `frontend/src/components/shared/ToolDetailSidebar.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `brain/{TOOL_DETAIL_PAGE_STANDARDS,NEW_TOOL_DEVELOPMENT_PLAYBOOK,CALCULATOR_STANDARDS,DESIGN_SYSTEM,FRONTEND,CURRENT_STATE,DECISIONS,TASKS,CHANGELOG,README}.md`, `AGENTS.md`, `.cursor/rules/{tool-detail-page-standards.mdc,calculator-standards.mdc}`, `.agents/rules/{tool-detail-page-standards.md,calculator-standards.md}`.
- **Verification:** Live browser inspect Auto Loan + Loan at 1440px; `/embed/loan-calculator` functional (no ads). Loan 14/14 + Auto Loan 15/15 calculation suites passed; `npx tsc --noEmit` passed; `npm run lint` 0 errors (pre-existing img warnings); `npx next build` passed.

### 2026-11-13 — Add RREF Calculator with step-by-step elimination
- **Summary:** Shipped first matrix calculator under the Auto Loan master shell. Canonical catalog slug `reduced-row-echelon-form-calculator` (`RrefCalculator`): exact rational Gauss–Jordan RREF, step-by-step ops, rank/pivots/free columns/nullity, optional augmented analysis, 1×1–6×8 editor, educational guide, shared SEO/ads/embed. Assigned existing Mongo tool `6af46f14a27d8d1d4e990674` (no duplicate record).
- **Important Files:** `frontend/src/tools/calculators/rref/*`, `frontend/src/tools/registry/{keys,index}.ts`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-rref-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Precision policy:** Integers/fractions/decimals parsed to exact `Rational` (decimals via place-value, max 12 places); no `eval`; no float elimination.
- **Verification:** Live `/tools/reduced-row-echelon-form-calculator` (Embed, ads, H1, rank 2 / pivots 1,2 / nullity 1 on default matrix). RREF 20/20 + Loan 14/14 + Auto Loan 15/15 passed; `tsc` + lint (0 errors) + `next build` passed.

### 2026-11-13 — Add ARM Mortgage Calculator
- **Summary:** Shipped an adjustable-rate mortgage calculator on the existing catalog slug `arm-mortgage-calculator`. Supports 3/1 through 10/6 structures, user rate assumptions (constant, rising step, falling step), increase caps, lifetime ceiling, optional floor, remaining-balance re-amortization, housing costs outside interest, schedule, and charts. Uses the Auto Loan master shell, shared SEO, ads, and embed.
- **Assumptions:** Caps limit rate increases only. Index + margin is an entered assumption, not a live index. Currency is display-only. Introductory $250,000 / 30-year / 5.5% payment is $1,419.47.
- **Important Files:** `frontend/src/tools/calculators/arm-mortgage/*`, registry, `page.tsx`, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-arm-mortgage-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** ARM unit tests passed; `tsc --noEmit` passed; `next build` passed. Mongo record `6af46f0fa27d8d1d4e98ff6c` assigned.

### 2026-11-13 — Add 100 Day Calculator
- **Summary:** Shipped a calendar-day calculator on the existing catalog slug `100-day-calculator`. Add or subtract 1–100,000 days, or count signed days between two dates. Inclusive offset counts the start as day 1. Inclusive spans count both endpoints. Arithmetic uses UTC civil dates so daylight saving time cannot move the selected day. Shared Auto Loan shell, SEO, ads, and embed.
- **Counting:** Exclusive January 1, 2026 + 100 days = April 11, 2026. Inclusive = April 10, 2026. January 1 to January 10 is 9 exclusive and 10 inclusive. Identical dates are 0 exclusive and 1 inclusive.
- **Important Files:** `frontend/src/tools/calculators/hundred-day/*`, registry, `page.tsx`, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-hundred-day-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** 100-day, loan, auto-loan, RREF, and ARM unit suites passed. Mongo record `6af46f18a27d8d1d4e990d16` assigned. Typecheck, lint, and production build recorded with the implementation.

### 2026-11-13 — Add 12 Volt Wire Size Calculator
- **Summary:** Shipped a 12 V DC two-wire voltage-drop calculator on the existing catalog slug `12-volt-wire-size-calculator`. Shared conductor helpers use IEC 60228 resistivity and ASTM B258 AWG areas. The page shows the minimum area, the next listed metric size, and the next listed AWG size. Ampacity is explicitly unverified, so the result is not a code-compliant recommendation.
- **Example:** 12 V, 3%, copper, 10 A, 5 m, 50°C → 5.354 mm² minimum, 6 mm² and 9 AWG on the listed series. A 6 mm² loop drops about 0.321 V.
- **Important Files:** `frontend/src/tools/electrical/conductor.ts`, `frontend/src/tools/calculators/twelve-volt-wire/*`, registry, `page.tsx`, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-twelve-volt-wire-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Conductor tests passed with the loan, auto-loan, RREF, ARM, and 100-day suites from the same pass. Mongo record `6af46f15a27d8d1d4e99074d` assigned. Typecheck, lint, and production build recorded with this change.

### 2026-11-13 — Daily currency rate job
- **Summary:** Added `CurrencyRate` and `CurrencyRateHistory`. The API process schedules a local-midnight fetch (`0 0 * * *`). One USD quote is expanded into a conversion map for each tracked base currency. `npm run currency:fetch` runs the same save immediately.
- **Important Files:** `backend/src/modules/currency/*`, `backend/src/jobs/currency-rates.cron.ts`, `backend/src/scripts/fetch-currency-rates.ts`, `backend/src/server.ts`, `backend/src/config/env.ts`.
- **Verification:** `npx tsx src/jobs/currency-rates.cron.ts` printed `currency-rates cron ok`. `npm run currency:fetch` saved the tracked bases. Backend `npx tsc --noEmit` passed.

### 2026-11-13 — Currency job uses node-cron
- **Summary:** The midnight currency fetch is scheduled with `node-cron` (`0 0 * * *`, `noOverlap`) instead of a `setTimeout` loop.
- **Important Files:** `backend/src/jobs/currency-rates.cron.ts`, `backend/package.json`.
- **Verification:** `npx tsx src/jobs/currency-rates.cron.ts` printed `currency-rates cron ok`. Backend `npx tsc --noEmit` passed.

### 2026-11-13 — Tool pages 404 when the calculator is not registered
- **Summary:** `/tools/[slug]` calls `notFound()` when the active tool has no registered component or no page shell. Public `sample-data.ts` and the preview workspace are removed. Embeds for an unregistered key stay unavailable.
- **Important Files:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/registry/keys.ts`, `frontend/src/components/shared/ToolWorkspace.tsx`, `frontend/src/app/embed/[slug]/page.tsx`.
- **Verification:** Frontend `npx tsc --noEmit` passed. `/tools/100-day-calculator` rendered the calculator (200). `/tools/0-60-calculator` (`ZeroToSixtyCalculator`, active, not registered) returned the not-found page (404).

### 2026-11-13 — Tool guides and calculators load per tool
- **Summary:** Each calculator's guide, FAQs, and intro line live in that tool's `detail.tsx`. The shared tool page loads only that module. The client registry loads only the calculator being rendered, through a static `import()` path.
- **Important Files:** `frontend/src/tools/registry/index.ts`, `frontend/src/tools/registry/details.ts`, `frontend/src/tools/calculators/*/detail.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/components/shared/ToolWorkspace.tsx`.
- **Verification:** Frontend `npx tsc --noEmit` passed. `/tools/loan-calculator` rendered the calculator ($483.32) and the loan guide. `/tools/12-volt-wire-size-calculator` rendered its own guide and the 5.354 mm² result.

### 2026-11-13 — Add 0-60 Calculator
- **Summary:** Shipped an illustrative 0-60 mph estimator on the existing catalog slug `0-60-calculator`. A 5 ms integration uses traction-limited launch, power-limited force `P/v` with a 0.92 average-power factor, one shift delay, drag, rolling resistance, and grade. 0-100 km/h is integrated to its own speed. The result is not a manufacturer time. The guide lives in `zero-to-sixty/detail.tsx` and the calculator loads through the shared lazy registry.
- **Example:** 300 hp, 3,500 lb, RWD, 85% efficiency, automatic 0.15 s shift, standard dry tires, level road → 5.98 s to 60 mph, 6.25 s to 100 km/h, 255 wheel hp.
- **Important Files:** `frontend/src/tools/calculators/zero-to-sixty/*`, registry, `sitemap.ts`, `backend/src/scripts/assign-zero-to-sixty-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** 0-60 tests (25) passed with loan, auto-loan, RREF, and 12 V wire suites. Mongo record `6af46f19a27d8d1d4e990dbd` assigned. Frontend typecheck and lint passed. Production build recorded with this change. Public page and embed rendered after the calculator was registered.

### 2026-11-13 — Lock calculator module architecture
- **Summary:** Audited commits `e76f98b` through `70e1af3` against the tree. Locked the live calculator layout in `ARCHITECTURE.md` §7 (ADR-018): one `/tools/[slug]` route, `React.lazy` calculator chunks, per-tool `detail.tsx`, pure `calculation.ts` / `validation.ts`, and `notFound()` for unregistered keys. The playbook now starts with the mandatory checklist (architecture, reusable components, engine, validation, tests, SEO, embed, responsive QA). Cursor and Antigravity calculator rules point at that checklist. Auto Loan remains the visual master (ADR-016). No calculator source was edited. Documented gaps: `hundred-day` has no `types.ts`; `twelve-volt-wire` tests live under `electrical/`; shared aside and TOC still sit in `auto-loan/`; the component-key allowlist is duplicated in the backend.
- **Important Files:** `brain/ARCHITECTURE.md`, `brain/CALCULATOR_STANDARDS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/DECISIONS.md`, `AGENTS.md`, `.cursor/rules/calculator-standards.mdc`, `.agents/rules/calculator-standards.md`.
- **Verification:** File inspection of `frontend/src/tools/registry/`, each calculator folder, `tools/[slug]/page.tsx`, and `embed/[slug]/page.tsx`. Docs-only change; type-check and lint were not re-run.

### 2026-11-13 — Add 12-Hour Shift Pay Calculator
- **Summary:** Shipped a client-side shift pay estimate on the existing catalog slug `12-hour-shift-pay-calculator`. Overtime hours are shift length minus regular hours. The overtime wage starts at 1.5× the hourly wage and stays at a typed value after the field is edited. Week, month, and year totals use shifts per week and weeks per year, and the page states those assumptions. Display currency defaults to PKR and does not convert amounts. The 1.5× rate is labeled as an assumption, not a legal rule.
- **Example:** Wage 20, overtime wage 30, 8 regular hours, 12-hour shift → regular pay 160, overtime pay 120, shift pay 280, average 23.33. Five shifts and 52 weeks → weekly 1,400, yearly 72,800, monthly 6,066.67.
- **Important Files:** `frontend/src/tools/calculators/twelve-hour-shift-pay/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-twelve-hour-shift-pay-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (10 cases). Frontend `npx tsc --noEmit` and `npm run lint` passed (existing `<img>` warnings only). Mongo record `6af46f0fa27d8d1d4e99004f` assigned with embed enabled. Public page showed PKR 280.00, average PKR 23.33, weekly 1,400.00, monthly 6,066.67, yearly 72,800.00, regular pay 160.00, and overtime pay 120.00. A typed overtime wage of 40 stayed at 40 when the hourly wage changed to 25 (shift pay PKR 360.00). Regular hours 13 cleared the result and showed the range error. Reset restored the defaults. Embed returned `X-Robots-Tag: noindex, nofollow` and `Content-Security-Policy: frame-ancestors *` with no advertisement text. No horizontal overflow at 375px or 1280px. `npm run build` was not completed: the first attempt overlapped the dev server, and a later clean attempt failed on an unrelated uncommitted ARM form type error that was not part of this change. A later `tsc --noEmit` reported no errors.

### 2026-11-13 — Finish 12 Volt Wire Size Calculator results
- **Summary:** The existing `12-volt-wire-size-calculator` page now shows the permitted drop next to the percentage, converts metres/feet and °C/°F when the unit changes, and reports loop resistance and wiring loss for the voltage-drop area. The headline stays an estimate because ampacity is still not verified. Tool tests live in `calculation.test.ts`; shared resistivity and AWG checks stay in `electrical/conductor.test.ts`.
- **Example:** 12 V, 3%, copper, 10 A, 5 m, 50°C → 5.354 mm², 0.036 Ω, 3.6 W. Listed sizes 6 mm² (0.321 V drop, 11.679 V at the load) and 9 AWG. Aluminum at the same inputs is 8.800 mm².
- **Important Files:** `frontend/src/tools/calculators/twelve-volt-wire/*`, `frontend/src/tools/electrical/conductor.ts`, `brain/{CURRENT_STATE,FRONTEND,ARCHITECTURE,CALCULATOR_STANDARDS,TASKS,CHANGELOG,DECISIONS}.md`.
- **Verification:** `calculation.test.ts` and `conductor.test.ts` passed, along with loan (14), auto-loan (15), 0-60 (25), RREF (20), ARM, and 100-day suites. Browser: feet toggle 5 m → 16.4042 ft with the same 5 m result, negative current shows an inline error and clears the result, Reset restores the defaults and 5.354 mm². Aluminum at the defaults selects 10 mm² and 7 AWG. Embed returns `X-Robots-Tag: noindex, nofollow` and `Content-Security-Policy: frame-ancestors *`, with the safety notice and no article or ad slot. 375px embed width has no horizontal overflow. Catalog title and description match. Dev canonical is localhost, which the production resolver does not emit.

### 2026-11-13 — Tools development audit
- **Summary:** Added admin-only `/tools-audit`. Start Audit reads the live component registry, exports, and shared tool route on the Next.js server, classifies every catalog tool, and Express persists `Tool.isDeveloped` plus a `ToolAudit` report. The initial `true` default is not treated as proof. Needs Review does not overwrite a stored boolean. A build-time manifest covers servers that do not have the source tree. ADR-020.
- **Important Files:** `frontend/src/app/tools-audit/page.tsx`, `frontend/src/lib/tools-audit/`, `frontend/src/server/tools-audit/actions.ts`, `frontend/src/generated/component-manifest.json`, `backend/src/modules/tools/tool-audit.*`, `backend/src/modules/tools/tool.model.ts`.
- **Verification:** Frontend and backend `tsc --noEmit` passed. `classify.test.ts` passed against the live registry. Unsigned `/tools-audit` redirects to login. The page compiles and an invalid session is rejected. The audit API returns 401 without a session. Start Audit was not clicked because this session had no admin login.

### 2026-11-13 — Complete ARM Mortgage Calculator inputs and caps
- **Summary:** Extended the existing `arm-mortgage-calculator` module. The loan amount is home price minus a down payment (amount or percent). Structures include 3/1 through 10/6 and a custom fixed period plus adjustment interval. Each reset targets index + margin, with an optional rising or falling step after the first reset. Periodic caps limit increases and decreases. Lifetime increase and decrease caps set the ceiling and floor. Results separate that assumption from the payment if the rate rises as fast as the caps allow. Year and month schedules, the shared principal/interest chart, and the guide match those rules. No second slug, registry key, or Mongo record.
- **Example:** $250,000, no down payment, 30 years, 5.5%, 5/1, index 4.5, margin 2, caps 2/2/5 → introductory payment $1,419.47; first reset $1,560.75 at 6.5%; lifetime ceiling 10.5%.
- **Important Files:** `frontend/src/tools/calculators/arm-mortgage/*`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `npx tsx src/tools/calculators/arm-mortgage/calculation.test.ts` passed. Frontend `npx tsc --noEmit` passed. `npx next lint` on the ARM module reported no warnings or errors. Browser: default $400,000 / 20% down shows loan $320,000, initial P&I $1,816.92, first reset $1,997.76 at 6.500%, contract ceiling 10.500% and cap-path payment $2,773.62. A 100% down payment shows “Down payment must be less than the home price” and clears the result. Reset restores $1,816.92. A 0% initial rate shows $888.89. Embed and the public page share the dev server; a later embed request returned 500 from a corrupted `.next` cache (`routes-manifest.json` missing), not from the calculator module. `npx next build` compiled and type-checked, then failed on an unrelated invariant (`no direct app page entry found for /about`). Loan 14/14 and Auto Loan 15/15 still passed.

### 2026-11-13 — Lock incremental calculator commits
- **Summary:** ADR-019 requires new calculators to land as meaningful milestone commits (small 1–2, medium 2–3, large 3–5, more only when each extra commit is real). The Brain record is the last commit of that sequence and is pushed with the code. Empty commits are rejected. ADR-016 and ADR-018 are unchanged. No calculator source was edited.
- **Important Files:** `AGENTS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/CALCULATOR_STANDARDS.md`, `brain/DECISIONS.md`, `.cursor/rules/git-commits.mdc`, `.agents/rules/git-commits.md`.
- **Verification:** File inspection only. The two agent rule files state the same sequence, the same size bands, and the same push rule.

### 2026-11-13 — Add 3D Printer Buy vs Outsource Calculator
- **Summary:** Shipped a client-side ownership versus outsourcing comparison on the existing catalog slug `3d-printer-buy-vs-outsource-calculator`. Failed attempts reuse the same material, time, and labor. Shipping is per order. Break-even is omitted when the service is cheaper per successful part or the monthly margin cannot repay the printer. Display currency defaults to PKR and does not convert amounts.
- **Example:** 10 parts/month for 12 months, 40 g, 3 h, 10% failures, printer 50,000, resale 20,000, material 2,500/kg, 200 W at 30/kWh, maintenance 500, outsource 800/part → in-house 51,733.33, outsource 96,000, savings 44,266.67, break-even about 4.85 months (48.47 parts).
- **Important Files:** `frontend/src/tools/calculators/three-d-printer-buy-vs-outsource/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-three-d-printer-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (11 cases). Loan (14) and auto-loan (15) suites passed. Frontend `tsc --noEmit` and `npm run lint` passed (existing `<img>` warnings only). Mongo record `6af46f0fa27d8d1d4e99007b` assigned with embed enabled. A live page response included the title, in-house 51,733.33, outsourcing 96,000, and “Buy and operate”. Embed returned `X-Robots-Tag: noindex, nofollow` and `Content-Security-Policy: frame-ancestors *`, with the recommendation and no advertisement or guide heading. A later request returned 500 after overlapping dev and production builds deleted a `.next` chunk (`Cannot find module ./5611.js`). `npm run build` in the same window failed on an unrelated `apple-icon.png` invariant, not on this calculator.

### 2026-11-13 — Add 3x Rent Calculator
- **Summary:** Shipped a client-side rent-to-income screen on the existing catalog slug `3x-rent-calculator`. Required-income mode multiplies monthly rent by the guideline multiple (default 3) and by 12 for the year. Affordable-rent mode divides gross monthly income by the same multiple. Two or more tenants can split the requirement equally or by percents that add to 100%. Individual gross incomes are summed before the affordable-rent limit. Equal shares are an assumption. The 3× multiple is a screening guideline, not a legal rule. Display currency defaults to PKR and does not convert amounts.
- **Example:** Monthly rent 1,500 at 3× requires gross monthly income 4,500 and gross annual income 54,000. Two tenants splitting equally need 2,250 each per month. Combined incomes 2,000 and 2,500 support a maximum monthly rent of 1,500.
- **Important Files:** `frontend/src/tools/calculators/three-x-rent/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-three-x-rent-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,BACKEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (13 cases). Frontend `npx tsc --noEmit` passed. `npm run lint` passed with the existing `<img>` warnings only. Backend `npx tsc --noEmit` and `tool.key.ts` self-check passed. Mongo record `6af46f0fa27d8d1d4e98ffbb` assigned with embed enabled. Browser: rent 1,500 shows PKR 4,500 monthly and PKR 54,000 annual (33.33%). Two tenants show PKR 2,250 and PKR 27,000 each. Combined incomes 2,000 and 2,500 show maximum rent PKR 1,500. Negative rent shows an inline error and clears the result. Reset restores a blank rent, multiplier 3, and PKR. Embed returned `X-Robots-Tag: noindex, nofollow` and `Content-Security-Policy: frame-ancestors *`, with no advertisement and no guide. No horizontal overflow at 375px or 1280px. A clean `npm run build` passed after an overlapping dev/build run had left `.next` inconsistent.

### 2026-11-13 — Add A/R Days Calculator
- **Summary:** Shipped a client-side accounts-receivable days calculator on the existing catalog slug `ar-days-calculator`. The formula is (receivables / net credit sales) × days in the period. One explicit target is solved from the other three. Ending receivables and the average of the beginning and ending balances stay separate; the average is used only when that method is selected. Zero credit sales with a positive balance is undefined, and 0/0 is indeterminate. Display currency defaults to PKR and does not convert amounts. The page does not grade a day count as good or bad.
- **Example:** Receivables 50,000, net credit sales 100,000, 365 days → 182.5 days, period turnover 2. Beginning 40,000 and ending 60,000 average to the same 50,000 and the same 182.5 days.
- **Important Files:** `frontend/src/tools/calculators/ar-days/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ar-days-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Loan (14) and auto-loan (15) suites passed. Frontend `npx tsc --noEmit` passed. `npx next lint` on the A/R days module reported no warnings or errors. Backend `tool.key.ts` self-check passed. Mongo record `6af46f0fa27d8d1d4e99007c` assigned with embed enabled. Browser: defaults show 182.5 days, PKR 50,000, PKR 100,000, turnover 2. Average of 40,000 and 60,000 stays 182.5 and labels the average method. Net credit sales of 0 clears the result and explains that the ratio is undefined. Reset restores 50,000, 100,000, the ending method, and 182.5 days. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, and `Content-Security-Policy: frame-ancestors *`, with the form and 182.5 and without an advertisement or the guide heading. No horizontal overflow at 375px or 1280px. `npm run build` was not run while the dev server was serving this page.

### 2026-11-13 — Lock shared currency conversion
- **Summary:** ADR-021 requires future converting calculators to use the ADR-017 `CurrencyRate` map: `amount * rate[target] / rate[source]`, with the base rate set to 1. Denomination selectors stay formatting-only. No new cron, collection, or provider call was added. The daily job still does not write when the provider response fails, and no read route exists yet.
- **Important Files:** `AGENTS.md`, `brain/ARCHITECTURE.md`, `brain/CALCULATOR_STANDARDS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/DECISIONS.md`, `.cursor/rules/currency-conversion.mdc`, `.agents/rules/currency-conversion.md`.
- **Verification:** Compared `fetch-currency-rates.ts`, `currency-rates.cron.ts`, both Mongoose models, and `currency.ts` with the new rules. Both agent rule files state the same formula, the same 48-hour stale policy, and the same missing-read-route gap. No calculator source was edited.


### 2026-11-13 — Add 529 Calculator
- **Summary:** Shipped a client-side 529 college savings projection on the existing catalog slug `529-calculator`. Monthly return and fee rates are the annual percent divided by 12. Education costs inflate from an entered amount. Scholarships inflate with that rate, are capped at the year's cost, and are not also withdrawn. The balance at college start is separate from later withdrawals. The required monthly contribution uses bounded bisection and stays unsolved when there is no saving period and the target is still short. Display currency defaults to USD and does not convert amounts or change US tax treatment. No IRS dollar limit is stored.
- **Example:** Age 8 to 18, four years, 20,000 annual cost, 5% inflation, 10,000 balance, 250 per month, 6% return, 0.2% fee → college-start balance 58,363.63, total education cost 140,414.79, gap 80,515.19, required monthly contribution 682.99. Setting the monthly deposit to 0 updates the college-start balance to 17,835.45.
- **Important Files:** `frontend/src/tools/calculators/five-twenty-nine/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-five-twenty-nine-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (19 cases). Loan 14 and auto-loan 15 still passed. Frontend `tsc --noEmit` passed. ESLint on the calculator and registry files passed. Mongo record `6af46f10a27d8d1d4e9900f3` assigned with embed enabled. Public page title is 529 Calculator | Omega Calculators with robots index, follow. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, and `Content-Security-Policy: frame-ancestors *`, without an advertisement or the guide heading. No horizontal overflow at 320px. `npm run build` was not run while the dev server was serving the page.

### 2026-11-13 — Add 70/20/10 Rule Money Calculator
- **Summary:** Shipped a client-side budget split on the existing catalog slug `702010-rule-money-calculator`. The catalog slug drops the slashes in “70/20/10”. Needs, savings and debt, and lifestyle default to 70/20/10 of after-tax income. Custom percentages are used only when selected and only when they add up to 100%. Switching monthly and annual multiplies or divides the entered amounts once. Actual spending is compared with each allocation, and a zero allocation does not invent a usage percentage. Display currency defaults to PKR and does not convert amounts. The split is a guideline.
- **Example:** Monthly after-tax income 100,000 → needs 70,000, savings and debt 20,000, lifestyle 10,000. The same money for a year is income 1,200,000 and needs 840,000. Needs spending of 110,000 is 40,000 over that category and 10,000 over income.
- **Important Files:** `frontend/src/tools/calculators/seventy-twenty-ten-rule/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-seventy-twenty-ten-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Loan (14) and auto-loan (15) suites passed. `npx next lint` on this module reported no warnings or errors. Backend `tool.key.ts` self-check passed. Mongo record `6af46f10a27d8d1d4e9900f4` assigned with embed enabled. Browser: defaults show PKR 100,000, needs PKR 70,000, savings and debt PKR 20,000, lifestyle PKR 10,000, and annual income PKR 1,200,000. Annual mode shows income PKR 1,200,000 and needs PKR 840,000, and switching back restores PKR 100,000. Needs spending of 110,000 shows overspending PKR 10,000 and that category over by PKR 40,000. Custom percentages of 70, 20, and 9 show an alert that they add up to 99% and clear the result. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, and `Content-Security-Policy: frame-ancestors *`, with the form and 70,000 and without an advertisement or the guide heading. No horizontal overflow at 375px or 1280px. `npm run build` was not run while the dev server was serving this page.

### 2026-11-13 — Add 403(b) Calculator
- **Summary:** Shipped a client-side 403(b) projection on the existing catalog slug `403b-calculator`. Each period applies that year's salary, an employee percent or fixed deferral, and one employer formula (none, a percent of deferrals up to a salary cap, or a fixed percent of salary). The default period rate is the annual rate divided by the number of periods. Effective annual compounding is optional and is not mixed into the same run. Fees use the same convention and remain a separate line so the cent ledger reconciles. Inflation only deflates the displayed balance. Limits are off unless the user types them; no IRS dollar schedule is stored. Contribution, salary, and employer solvers each change one unknown. Traditional versus Roth is a label. Display currency defaults to USD and does not convert amounts.
- **Example:** Salary 60,000, employee deferral 6%, employer matches 50% of the first 6%, one year, no return → employee 3,600 and employer 1,800.
- **Important Files:** `frontend/src/tools/calculators/four-zero-three-b/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-403b-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,BACKEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (25 cases). Loan (14) and auto-loan (15) suites passed. `npx eslint` on `four-zero-three-b` passed. Frontend `tsc --noEmit` reported no errors in this module; the full project check failed on an unrelated `four-zero-one-k` tooltip type. Backend `tool.key.ts` self-check passed. Mongo record `6af46f10a27d8d1d4e9900f1` assigned with embed enabled. Browser default shows a nominal balance of $598,072.39, an inflation-adjusted balance of $330,178.36, and a first year of $3,600 employee and $1,800 employer. Contribution-needed mode against the $500,000 target solves 4.92% and a balance of $500,631.67. Retirement age equal to current age shows an error and clears the result. Reset restores $598,072.39. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, and `Content-Security-Policy: frame-ancestors *`, with no advertisement and no guide heading. No horizontal overflow at 345px. `npm run build` was not run while the dev server was using `.next`.

### 2026-11-13 — Add ADR Calculator
- **Summary:** Shipped a client-side hotel average daily rate on the existing catalog slug `adr-calculator`. ADR is room revenue divided by sold room-nights. The form can instead solve room revenue or room-nights. Solved room-nights that are not whole numbers stay visible and are explained. Occupancy and RevPAR appear only when available room-nights, or physical rooms times days, are entered. Sold room-nights cannot exceed that inventory. Room revenue excludes food, beverage, spa, and other non-room charges. Display currency defaults to PKR and does not convert amounts. A higher ADR is not described as automatically better.
- **Example:** Room revenue 150,000 and 100 room-nights sold → ADR 1,500. With 160 available room-nights, occupancy is 62.5% and RevPAR is 937.50. Revenue 1,000 divided by ADR 300 → 3.3333 room-nights.
- **Important Files:** `frontend/src/tools/calculators/adr/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-adr-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (11 cases). Mongo record `6af46f10a27d8d1d4e990110` assigned with embed enabled. Browser: 150,000 and 100 room-nights show PKR 1,500.00; 160 available room-nights show occupancy 62.5% and RevPAR PKR 937.50. Sold room-nights of 200 against 160 available clears the result. Reset returns the empty state. Reverse mode shows 3.3333 room-nights and the fractional-night note. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, and `Content-Security-Policy: frame-ancestors *`, with the form and without an advertisement or the guide heading. No horizontal overflow at 375px or 1280px. `npm run build` was not run while the dev server was serving this page.

### 2026-11-14 — Add 401(k) Calculator
- **Summary:** Shipped a client-side 401(k) projection on the existing catalog slug `401k-calculator`. Each period uses an effective annual rate, an employee percent or fixed deferral, and one employer formula. Fees stay a separate line so the cent ledger reconciles. Inflation only deflates the displayed balance. Limits are off unless the user types USD figures; no IRS dollar schedule is stored. Contribution-needed mode solves one employee unknown and says so when the target is unreachable. Traditional versus Roth is a label. Display currency defaults to USD and does not convert amounts.
- **Example:** Salary 80,000, employee deferral 6%, employer matches 50% of the first 6%, one year, no return → employee 4,800 and employer 2,400.
- **Important Files:** `frontend/src/tools/calculators/four-zero-one-k/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-401k-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,ARCHITECTURE,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Loan (14) and auto-loan (15) suites passed. `npx eslint` on `four-zero-one-k` passed. Frontend `tsc --noEmit` passed. Backend `tool.key.ts` self-check passed. Mongo record `6af46f10a27d8d1d4e9901b4` assigned with embed enabled. Browser defaults show $837,150.36 nominal, $462,166.34 inflation-adjusted, $400 and $200 per period, and 83.7% of the $1,000,000 progress target. Retirement age equal to current age shows an error and clears the result. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, and `Content-Security-Policy: frame-ancestors *`, with no advertisement and no guide heading. `npm run build` was not run while the dev server was using `.next`.

### 2026-11-13 — Add AFFO Calculator
- **Summary:** Shipped a client-side simplified REIT FFO and AFFO estimate on slug `affo-calculator`. The inactive catalog slug was renamed to this public slug. FFO adds eligible real-estate depreciation and eligible property-sale losses and subtracts eligible property-sale gains. Interest income is recorded and is not applied again. Simplified AFFO subtracts straight-line rent, recurring maintenance capex, and an incremental maintenance adjustment, then applies optional signed add-backs. Period and currency are labels. The result is not Nareit FFO, and AFFO minus FFO is not distributable cash.
- **Example:** Net income 1,000,000, eligible depreciation 400,000, losses 20,000, gains 50,000, straight-line rent 25,000, maintenance capex 120,000, noncash compensation 15,000, and debt-issuance amortization 5,000 give FFO 1,370,000 and AFFO 1,245,000.
- **Important Files:** `frontend/src/tools/calculators/affo/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-affo-tool.ts`.
- **Verification:** calculation.test.ts passed (10 cases). Frontend and backend tsc passed. ESLint on the AFFO module passed. tool.key.ts self-check passed. Mongo record `6af46f10a27d8d1d4e990111` assigned with embed enabled. Browser defaults show FFO 1,370,000 and AFFO 1,245,000. A production build was not run while the dev server was serving the page.

### 2026-11-14 — Lock calculator activation
- **Summary:** ADR-022 requires every developed calculator to be activated on its existing catalog row before delivery. The catalog has 4,351 tools. All 17 registered calculators were already `isActive`. Six of them had `isDeveloped: false` and were set true: 403(b), 529, 70/20/10, ADR, AFFO, and 401(k). Catalog rows without a module stayed inactive. Loan and Auto Loan remain `indexable: false`.
- **Important Files:** `frontend/src/tools/registry/activation.ts`, `AGENTS.md`, `brain/ARCHITECTURE.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/DECISIONS.md`, `.cursor/rules/tool-activation.mdc`, `.agents/rules/tool-activation.md`.
- **Verification:** `activation.test.ts` passed. Mongo update modified 6 documents. Public routes for the registered slugs were already active. `npm run build` was not run while the dev server was using `.next`.

### 2026-11-14 — Add Amortization Calculator
- **Summary:** Shipped a full-featured client-side Amortization Calculator on existing catalog slug `amortization-calculator` (`AmortizationCalculator`, catalog id `6af46f10a27d8d1d4e990149`). Implements Section A specifications (loan amount, term in years and months, annual nominal rate with 0% support, compounding frequencies across daily/weekly/biweekly/monthly/quarterly/semi-annual/annual, payment frequencies across weekly/biweekly/monthly/quarterly/semi-annual/annual, recurring extra payments) and Section B advanced extra payments (recurring payment start/end ranges, one-time lump-sum payments). Pure decimal-safe cents-based calculation engine avoids floating point drift and adjusts the final payment to reach exactly $0.00 ending balance. Includes interactive balance trajectory SVG curve with baseline comparison, Principal vs Interest composition breakdown, detailed period and yearly schedule tables, pagination, CSV export, full-screen portal modal, and 14 educational guide sections. Automatically activated in MongoDB (`isActive: true`, `isDeveloped: true`, `indexable: true`, `embedEnabled: true`).
- **Example:** Loan amount 10,000, 10 years (120 payments), 12.5% annual nominal interest, monthly compounding, monthly payment → regular payment $146.38/month, total interest $7,565.76, total amount paid $17,565.76. Total principal paid across schedule reconciles to exactly $10,000.00 with $0.00 ending balance. Adding $50/month extra payment reduces payoff duration to 72 months (4 years saved) and saves over $3,440 in interest.
- **Important Files:** `frontend/src/tools/calculators/amortization/*`, `frontend/src/tools/registry/{keys,index,details}.ts`, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-amortization-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (14 suites). Frontend `tsc --noEmit` passed (0 errors). Backend `tsc --noEmit` passed (0 errors). `npm run lint` passed (0 errors). Frontend production `npm run build` completed successfully in 90 seconds (19 static pages generated, `/tools/[slug]`, `/embed/[slug]`, `/sitemap.xml`, `/robots.txt`). Backend `tool.key.ts` self-check passed. MongoDB record `6af46f10a27d8d1d4e990149` updated and activated (`isActive: true`, `isDeveloped: true`, `indexable: true`, `embedEnabled: true`).

### 2026-11-14 — ARM Mortgage Calculator Reference Parity Audit & Correction
- **Summary:** Conducted a comprehensive functional and mathematical audit of the existing ARM Mortgage Calculator (`/tools/arm-mortgage-calculator`) against reference specifications. Preserved the canonical slug `arm-mortgage-calculator`, component key `ArmMortgageCalculator`, and Auto Loan master layout standards. Added direct Mortgage Balance input mode (alongside Home Price & Down Payment mode), manual Expected Rate Adjustment method with absolute Interest Rate Cap (supporting 10/1 ARM, 5/1 ARM, etc.), customizable compounding frequencies (monthly, Canadian semi-annual, annual), and upfront finance charges / closing costs. Identified that the reference screenshot's APR of 6.125% represents the arithmetic average note rate across the 20-year term, and surfaced both the reference average-rate APR and the Truth in Lending cash-flow actuarial APR (5.357%). Rebuilt results to prominently showcase the monthly payment range (PKR 1,649.89 – PKR 1,831.07), mortgage term, paid interest (PKR 162,983.32), additional costs (PKR 0.00), total payments (PKR 412,983.32), a dedicated Interest-Rate Adjustment Schedule table, and detailed CSV amortization export.
- **Example:** Mortgage balance PKR 250,000, 20-year term, 5% initial rate, 10/1 ARM, 0.5% expected annual adjustment, 8% rate cap → monthly payment range PKR 1,649.89 – PKR 1,831.07, APR 6.125% (actuarial 5.357%), paid interest PKR 162,983.32, additional costs PKR 0.00, total payments PKR 412,983.32.
- **Important Files:** `frontend/src/tools/calculators/arm-mortgage/{types.ts,calculation.ts,validation.ts,calculation.test.ts,ArmMortgageForm.tsx,ArmMortgageResults.tsx,ArmMortgageCalculator.tsx,content.ts}`, `brain/{CURRENT_STATE,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (all regression tests + reference scenario). Frontend `tsc --noEmit` passed (0 errors). Backend `tsc --noEmit` passed (0 errors). `npm run lint` passed (0 errors). Next.js production `npm run build` completed successfully (19 static pages, `/tools/[slug]`, `/embed/[slug]`). MongoDB record `6af46f10a27d8d1d4e9900f0` verified active with embed enabled.

### 2026-11-14 — Add Acreage Calculator
- **Summary:** Shipped a client-side rectangular acreage calculator on the existing catalog slug `acreage-calculator`. Width × length converts both sides to meters, then to acres and other land units. Area-conversion mode converts a known area without inventing dimensions. Optional unit price multiplies the area in the pricing unit; display currency is denomination-only. Shared Auto Loan shell, SEO, ads, and embed.
- **Example:** 220 yd × 220 yd → 10 acres (48,400 yd²). 1 acre = 43,560 ft² = 4,840 yd² = 4,046.8564224 m². 5 acres × 15,000 per acre → 75,000.
- **Important Files:** `frontend/src/tools/calculators/acreage/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-acreage-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` and eslint on the acreage module passed. Backend `tool.key.ts` self-check passed. Mongo record `6af46f17a27d8d1d4e990b76` assigned (`isActive`, `isDeveloped`, `indexable`, embed on). Browser: `/tools/acreage-calculator` shows 10 ac for 220 yd × 220 yd with guide and Embed. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, `frame-ancestors *`, calculator present, no ads or guide. `npm run build` was not run while the dev server was using `.next`.

### 2026-11-14 — Add Feet to Inches Calculator
- **Summary:** Shipped a client-side bidirectional feet ↔ inches converter on the existing catalog slug `feet-to-inches-calculator`. Source-field tracking keeps intermediate decimals such as `1.`. Collapsible other units use the international foot (0.3048 m). Publishing flags `isActive` and `indexable` were left unchanged; `isDeveloped` was set true after verification.
- **Example:** 1 ft = 12 in; 5.5 ft = 66 in; 18 in = 1.5 ft. One foot also equals 304.8 mm, 30.48 cm, 0.3048 m, 1/3 yd.
- **Important Files:** `frontend/src/tools/calculators/feet-to-inches/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-feet-to-inches-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` and eslint on the module passed. Backend `tool.key.ts` self-check passed. Mongo record `6af46f17a27d8d1d4e990af4` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`). Browser: `/tools/feet-to-inches-calculator` shows `1 ft = 12 in` with guide and Embed. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, calculator present, no ads or guide.

### 2026-11-14 — Add Acres to Square Miles Calculator
- **Summary:** Shipped a client-side bidirectional acres ↔ square miles converter on the existing catalog slug `acres-to-square-miles-calculator`. Uses the exact customary factor of 640 acres per square mile. Source-field tracking keeps intermediate decimals. Compact reference table and conversion explanation. Activated with `isDeveloped`, `isActive`, and `indexable` true.
- **Example:** 2,000 acres = 3.125 square miles; 640 acres = 1 square mile; 1 acre = 0.0015625 square miles.
- **Important Files:** `frontend/src/tools/calculators/acres-to-square-miles/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-acres-to-square-miles-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` and `npm run lint` passed (pre-existing `<img>` warnings only). Backend `tool.key.ts` self-check passed. Mongo record `6af46f17a27d8d1d4e990b08` assigned (`isActive`, `isDeveloped`, `indexable`, embed on). Browser: `/tools/acres-to-square-miles-calculator` shows 2,000 ac = 3.125 mi² with guide, Embed, and ads. Embed returns calculator only (no guide/ads). Dev catalog `canonicalUrl` remains localhost; production resolver skips localhost and uses `NEXT_PUBLIC_SITE_URL` / `SITE_URL`.

### 2026-11-14 — Add Height in Inches Calculator
- **Summary:** Shipped a client-side height converter on the existing catalog slug `height-in-inches-calculator`. Supports feet + inches, total inches, centimeters, and meters with exact factors 12 and 2.54. Excess inches normalize in the result (5 ft 14 in → 6 ft 2 in). Activated with `isDeveloped`, `isActive`, and `indexable` true.
- **Example:** 2 ft 4 in = 28 in = 71.12 cm; 5 ft 6 in = 66 in; 170 cm ≈ 66.9291 in; 1.75 m ≈ 68.8976 in.
- **Important Files:** `frontend/src/tools/calculators/height-in-inches/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-height-in-inches-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` and `npm run lint` passed (pre-existing `<img>` warnings only). Backend `tool.key.ts` self-check passed. Mongo record `6af46f17a27d8d1d4e990b89` assigned (`isActive`, `isDeveloped`, `indexable`, embed on). Browser: `/tools/height-in-inches-calculator` shows 2 ft 4 in = 28 in with guide and Embed. Embed returns `X-Robots-Tag: noindex, nofollow` and `frame-ancestors *`.

### 2026-11-14 — Add Acre to Are Conversion
- **Summary:** Shipped a client-side bidirectional acres ↔ ares converter on the existing catalog slug `acre-to-are-conversion`. Uses the exact factor 40.468564224 ares per acre. Publishing flags `isActive`, `indexable`, and `isFeatured` were preserved; `isDeveloped` was set true after verification.
- **Example:** 5 acres = 202.34282112 ares; 1 acre = 40.468564224 ares; 100 ares ≈ 2.47105381467 acres.
- **Important Files:** `frontend/src/tools/calculators/acre-to-are/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-acre-to-are-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` and `npm run lint` passed (pre-existing `<img>` warnings only). Backend `tool.key.ts` self-check passed. Mongo record `6af46f17a27d8d1d4e990b75` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Browser: `/tools/acre-to-are-conversion` shows 5 ac = 202.34282112 a with guide and Embed. Embed returns `X-Robots-Tag: noindex, nofollow` and `frame-ancestors *`.

### 2026-11-14 — Add Inches to Fraction Calculator
- **Summary:** Shipped a client-side inches ↔ fraction converter on the existing catalog slug `inches-to-fraction-calculator`. Parses decimals, fractions, and mixed numbers; rounds to 1/2–1/256 precision (default 1/16); other units use the original inch value. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1.375 → 1 3/8; 0.625 → 5/8; 3/8 → 0.375; 2 1/4 → 2.25; 1 in = 25.4 mm.
- **Important Files:** `frontend/src/tools/calculators/inches-to-fraction/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-inches-to-fraction-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` and module eslint passed. Backend `tool.key.ts` self-check passed. Mongo record `6af46f17a27d8d1d4e990b8b` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Browser: `/tools/inches-to-fraction-calculator` shows 1 3/8 inches. Embed returns `X-Robots-Tag: noindex, nofollow` and `frame-ancestors *`.

### 2026-11-14 — Add Mesh to Micron Converter
- **Summary:** Shipped a mesh/sieve opening converter on the existing catalog slug `mesh-to-micron-converter`. ASTM E11 nominal sieve lookup (29 designations), optional square woven-mesh calculation from mesh count + wire diameter, micron→nearest-sieve reverse lookup, and µm/mm/cm/in/mil equivalents. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification.
- **Example:** No. 100 → 150 µm; No. 200 → 75 µm; custom mesh 100 / wire 0.1 mm → 154 µm; 160 µm → nearest No. 100 (Δ 10 µm).
- **Important Files:** `frontend/src/tools/calculators/mesh-to-micron/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mesh-to-micron-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b92` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Browser: `/tools/mesh-to-micron-converter` shows No. 100 → 150 µm. Embed returns `X-Robots-Tag: noindex, nofollow` and `frame-ancestors *`.

### 2026-11-14 — Add Astronomical Unit Calculator
- **Summary:** Shipped a six-field astronomical distance converter on the existing catalog slug `astronomical-unit-calculator`. Canonical meters; exact IAU au, Julian light-year, geometric parsec, light-travel distance units, and metric/imperial selectors with six-way sync. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification.
- **Example:** 1 au = 149,597,870,700 m = 149,597,870.7 km ≈ 1.581250741×10⁻⁵ ly ≈ 4.848136811×10⁻⁶ pc ≈ 92,955,807.273 mi; vacuum light-travel ≈ 8 min 19 s.
- **Important Files:** `frontend/src/tools/calculators/astronomical-unit/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-astronomical-unit-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b7b` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Browser: `/tools/astronomical-unit-calculator` shows 1 au sync. Embed returns calculator panel with `frame-ancestors *` path.

### 2026-11-14 — Add Pixels to Inches Converter
- **Summary:** Shipped a bidirectional pixels ↔ inches converter on the existing catalog slug `pixels-to-inches-converter`. Configurable PPI (default 96) with source-field tracking on PPI change, compact presets, and mm/cm/ft more-options from the inch length. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification.
- **Example:** 192 px at 96 PPI = 2 in; 1080 px at 96 PPI = 11.25 in; 1080 px at 300 PPI = 3.6 in; PPI flip keeps the last-edited field.
- **Important Files:** `frontend/src/tools/calculators/pixels-to-inches/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-pixels-to-inches-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b9a` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Browser: `/tools/pixels-to-inches-converter` shows 192 px = 2 in. Embed loads calculator panel.

### 2026-11-14 — Add Decimeter to Meter Converter
- **Summary:** Shipped a bidirectional decimeters ↔ meters converter on the existing catalog slug `decimeter-to-meter-converter`. Exact factor `1 m = 10 dm`; more-options for mm/cm/km/in/ft/yd from the meter length. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification. Existing Meter Converter pillar association left unchanged.
- **Example:** 34.6 dm = 3.46 m; 10 dm = 1 m; 7.8 m = 78 dm.
- **Important Files:** `frontend/src/tools/calculators/decimeter-to-meter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-decimeter-to-meter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990adf` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar preserved). Browser: `/tools/decimeter-to-meter-converter` shows 34.6 dm = 3.46 m. Embed loads calculator panel.

### 2026-11-14 — Add Square Kilometers to Acres Conversion
- **Summary:** Shipped a bidirectional km² ↔ acres land-area converter on the existing catalog slug `square-kilometers-to-acres-conversion`. Exact SI km² and international acre via square meters; more-options for m²/ft²/yd²/ha/a/mi². Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification. Existing Kilometer Calculator pillar association left unchanged.
- **Example:** 5 km² ≈ 1,235.52690734 acres; 1 km² ≈ 247.105381467 acres; 100 acres = 0.40468564224 km².
- **Important Files:** `frontend/src/tools/calculators/square-kilometers-to-acres/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-square-kilometers-to-acres-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b1f` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d2a27d8d1d4e98f9ed` preserved). Browser: `/tools/square-kilometers-to-acres-conversion` shows 5 km² ≈ 1,235.53 ac. Embed eligible.

### 2026-11-14 — Add Feet and Inches Calculator
- **Summary:** Shipped mixed feet-and-inches arithmetic on the existing catalog slug `feet-and-inches-calculator`. Supports +/− of two lengths and ×/÷ by a dimensionless scalar; fractional/mixed inch parsing reused from Inches to Fraction; precision 1/2–1/256 (default 1/16); metric/decimal more-options from exact total inches. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification. Feet Converter pillar association left unchanged.
- **Example:** 5 ft 8 in + 2 ft 4 in = 8 ft 0 in; 2 ft 3 1/2 in + 1 ft 4 1/4 in = 3 ft 7 3/4 in; 2 ft − 3 ft 6 in = −1 ft 6 in.
- **Important Files:** `frontend/src/tools/calculators/feet-and-inches/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-feet-and-inches-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990af3` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d1a27d8d1d4e98f9e6` / Feet converter preserved). Browser: `/tools/feet-and-inches-calculator` shows 5 ft 8 in + 2 ft 4 in = 8 ft 0 in.

### 2026-11-14 — Add Yards to Acres Calculator
- **Summary:** Shipped a bidirectional square-yards ↔ acres land-area converter on the existing catalog slug `yards-to-acres-calculator`. Exact factor `1 acre = 4840 yd²`; more-options for ft²/m²/km²/ha/a. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification. Yard Conversion pillar association left unchanged. Educational copy distinguishes linear yards from square yards.
- **Example:** 9680 yd² = 2 acres; 4840 yd² = 1 acre; 2.5 acres = 12,100 yd².
- **Important Files:** `frontend/src/tools/calculators/yards-to-acres/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-yards-to-acres-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990ad9` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e2` / Yard Conversion preserved). Browser: `/tools/yards-to-acres-calculator` shows 9680 yd² = 2 acres.

### 2026-11-14 — Add CCF to Gallons Conversion
- **Summary:** Shipped a bidirectional CCF ↔ US liquid gallon water-volume converter on the existing catalog slug `ccf-to-gallons-conversion`. Exact ratio `1 CCF = 172800/231` US gal; more-options for ft³/m³/L/mL/US gal/imp gal. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification. Gallon Calculator pillar association left unchanged. Optional water-bill estimate skipped (usage charge is not a full bill; YAGNI).
- **Example:** 5 CCF ≈ 3740.25974026 US gal; 1 CCF ≈ 748.05194805 US gal; 1000 US gal ≈ 1.33680555556 CCF.
- **Important Files:** `frontend/src/tools/calculators/ccf-to-gallons/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ccf-to-gallons-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990ac5` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e1` / Gallon Calculator preserved). Browser: `/tools/ccf-to-gallons-conversion` shows 5 CCF ≈ 3740.25974025974 US gal.

### 2026-11-14 — Add Liters to Centiliters Converter
- **Summary:** Shipped a bidirectional liters ↔ centiliters metric volume converter on the existing catalog slug `liters-to-centiliters-converter`. Exact factor `1 L = 100 cL`; more-options for mL/dL/cm³/m³/US gal/US fl oz. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification. Existing `pillar: null` and `subPillar: null` left unchanged.
- **Example:** 2.5 L = 250 cL; 0.5 L = 50 cL; 25 cL = 0.25 L.
- **Important Files:** `frontend/src/tools/calculators/liters-to-centiliters/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-liters-to-centiliters-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b4d` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/liters-to-centiliters-converter` shows 2.5 L = 250 cL.

### 2026-11-14 — Add Cubic Feet Calculator
- **Summary:** Shipped a rectangular L×W×H volume calculator on the existing catalog slug `cubic-feet-calculator`. Converts each edge to meters, multiplies to m³, then to ft³ via exact `0.028316846592`. Independent units (mm–mi including dm); more-options in³/yd³/m³/cm³/L/mL/US gal/imp gal; separate find-missing-dimension panel. Publishing flags preserved; Feet Converter pillar and Cubic Feet Calculator subPillar left unchanged. Separate soil mode skipped (same L×W×H math; covered in guide).
- **Example:** 10 ft × 5 ft × 3 ft = 150 ft³; 12 in cube = 1 ft³; missing length for 120 ft³ with 5×4 ft = 6 ft.
- **Important Files:** `frontend/src/tools/calculators/cubic-feet/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cubic-feet-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990af6` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d1a27d8d1d4e98f9e6` / Feet Converter, subPillar `6af451d1a27d8d1d4e98f9e7` preserved). Browser: `/tools/cubic-feet-calculator` shows 10×5×3 ft = 150 ft³.

### 2026-11-14 — Add mcg to mg Converter
- **Summary:** Shipped a bidirectional micrograms ↔ milligrams mass converter on the existing catalog slug `mcg-to-mg-converter`. Exact factor `1 mg = 1000 mcg`; more-options for ng/mcg/mg/cg/dg/g/kg. Publishing flags preserved (`isActive` true); `isDeveloped` set true after verification. Existing `pillar: null` and `subPillar: null` left unchanged. Educational copy notes mcg = µg and that the tool does not recommend medication doses.
- **Example:** 250 mcg = 0.25 mg; 1000 mcg = 1 mg; 0.125 mg = 125 mcg.
- **Important Files:** `frontend/src/tools/calculators/mcg-to-mg/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mcg-to-mg-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b4f` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/mcg-to-mg-converter` shows 250 mcg = 0.25 mg.

### 2026-11-14 — Add Cubic Meter Calculator
- **Summary:** Shipped a rectangular volume calculator on the existing catalog slug `cubic-meter-calculator`. Height × length × width → m³ with independent length units (including dam); separate dimensions vs volume source modes so volume conversion does not invent edges; more-options ft³/yd³/in³/L/mL/US gal/imp gal; find-missing-dimension panel. Publishing flags preserved; Meter Converter pillar left unchanged; `subPillar` null.
- **Example:** 5 m × 4 m × 3 m = 60 m³; 100 ft³ = 2.8316846592 m³; missing length for 60 m³ with 4×3 m = 5 m.
- **Important Files:** `frontend/src/tools/calculators/cubic-meter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cubic-meter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990add` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; Meter Converter pillar `6af451d0a27d8d1d4e98f9e3`, `subPillar` null preserved). Browser: `/tools/cubic-meter-calculator` shows 5×4×3 m = 60 m³.

### 2026-11-14 — Add mg to mL Calculator
- **Summary:** Shipped a mass↔volume converter on the existing catalog slug `mg-to-ml-calculator`. Separate density mode (water ≈ 1000 mg/mL or custom density) and medication concentration mode (mg/mL or mg per stated volume). Never assumes 1 mg = 1 mL; custom concentration only (no invented medication catalog); on-form safety notice. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 100 mg at 20 mg/mL → 5 mL; 500 mg at 1000 mg/mL water density → 0.5 mL; 100 mg per 5 mL label → 20 mg/mL factor.
- **Important Files:** `frontend/src/tools/calculators/mg-to-ml/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mg-to-ml-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b53` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/mg-to-ml-calculator` shows 100 mg = 5 mL at 20 mg/mL.

### 2026-11-14 — Add Cubic Yards to Tons Calculator
- **Summary:** Shipped a density-based volume↔mass converter on the existing catalog slug `cubic-yards-to-tons-calculator`. Exact `1 yd³ = 0.764554857984 m³`; metric tonne / US short ton / imperial long ton; category radios with verified approximate presets (water, aluminum, iron, copper, steel, air, N₂, CO₂, ethanol); sand/gravel/soil custom-only. Publishing flags preserved; Yard Conversion pillar left unchanged; `subPillar` null.
- **Example:** 1 yd³ at 1000 kg/m³ → 0.764554857984 t; 5 yd³ at 1600 kg/m³ → 6.116438863872 t.
- **Important Files:** `frontend/src/tools/calculators/cubic-yards-to-tons/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cubic-yards-to-tons-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990ad3` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; Yard Conversion pillar `6af451d0a27d8d1d4e98f9e2`, `subPillar` null preserved). Browser: `/tools/cubic-yards-to-tons-calculator` shows 1 yd³ ≈ 0.76455 t at 1000 kg/m³.

### 2026-11-14 — Add mL to Cups Converter
- **Summary:** Shipped a bidirectional milliliters ↔ cups converter on the existing catalog slug `ml-to-cups-converter`. Exact cup standards: US customary 236.5882365 mL, US legal 240, metric 250, imperial 284.130625; cooking fraction presets; more-options for L/cL/US fl oz/tbsp/tsp/pt/qt/gal. Never treats 237 mL as an exact factor. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 2 US customary cups = 473.176473 mL; 500 mL → 2 metric cups; 1/2 US cup = 118.29411825 mL.
- **Important Files:** `frontend/src/tools/calculators/ml-to-cups/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ml-to-cups-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b57` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/ml-to-cups-converter` shows 2 US cups = 473.176473 mL.

### 2026-11-14 — Add Decagram to Gram Converter
- **Summary:** Shipped a bidirectional decagram ↔ gram metric mass converter on the existing catalog slug `decagram-to-gram-converter`. Exact factor `1 dag = 10 g`; more-options for µg/mg/cg/dg/g/dag/hg/kg/t; educational distinction between dag and dg. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 3 dag = 30 g; 125 g = 12.5 dag; 5 dag = 50 g = 0.05 kg.
- **Important Files:** `frontend/src/tools/calculators/decagram-to-gram/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-decagram-to-gram-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b36` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/decagram-to-gram-converter` shows 3 dag = 30 g.

### 2026-11-14 — Add Pint to Pound Conversion
- **Summary:** Shipped a density-based pint ↔ pound converter on the existing catalog slug `pint-to-pound-conversion`. Exact US liquid (473.176473 mL), imperial (568.26125 mL), and US dry (550.6104713575 mL) pint factors; exact avoirdupois pound (453.59237 g). Never assumes 1 pt = 1 lb. Water preset uses conventional ≈ 1 g/mL; milk/oil/honey/flour/sugar require custom density. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 1 US liquid pt @ 1 g/mL ≈ 1.04318 lb; 2 pt @ 0.8 g/mL ≈ 1.66908 lb; 1 lb @ 1 g/mL ≈ 0.95861 US liquid pt.
- **Important Files:** `frontend/src/tools/calculators/pint-to-pound/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-pint-to-pound-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b64` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/pint-to-pound-conversion` shows 1 US liquid pt ≈ 1.04318 lb.

### 2026-11-14 — Add Drops to mL Conversion
- **Summary:** Shipped a bidirectional drops ↔ milliliters converter on the existing catalog slug `drops-to-ml-conversion`. Default assumed factor 20 drops/mL (≈ 0.05 mL/drop); adjustable drops-per-mL and volume-per-drop; optional dropper calibration; more-options for µL/cL/L/cm³/US fl oz; medication safety note. Never claims drop size is a universal SI unit. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 100 drops @ 20 drops/mL ≈ 5 mL; 50 drops @ 25 drops/mL = 2 mL; 5 mL @ 25 drops/mL = 125 drops.
- **Important Files:** `frontend/src/tools/calculators/drops-to-ml/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-drops-to-ml-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b38` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/drops-to-ml-conversion` shows 100 drops ≈ 5 mL.

### 2026-11-14 — Add Pounds and Ounces Calculator
- **Summary:** Shipped a pounds/ounces mass converter and adder on the existing catalog slug `pounds-and-ounces-calculator`. Exact avoirdupois `1 lb = 16 oz` and `1 lb = 453.59237 g`; bidirectional decimal lb/oz; mixed lb+oz with ounce normalization; metric mg/g/kg/t and stones; multi-row addition with dynamic rows. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 2.5 lb = 40 oz = 2 lb 8 oz = 1133.980925 g; 2 lb 10 oz + 3 lb 9 oz = 6 lb 3 oz; 2 lb 20 oz normalizes to 3 lb 4 oz.
- **Important Files:** `frontend/src/tools/calculators/pounds-and-ounces/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-pounds-and-ounces-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b66` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/pounds-and-ounces-calculator` shows 2.5 lb = 40 oz and addition total 6 lb 3 oz.

### 2026-11-14 — Add oz to Cups Converter
- **Summary:** Shipped a bidirectional fluid-ounce ↔ cup volume converter on the existing catalog slug `oz-to-cups-converter`. Exact US fl oz (29.5735295625 mL) and Imperial fl oz (28.4130625 mL); cup standards US customary/legal/metric/Imperial via canonical mL; cooking fraction presets; more-options. Distinguishes fluid ounces from mass ounces. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 8 US fl oz = 1 US customary cup; 10 Imperial fl oz = 1 Imperial cup; 8 US fl oz ≈ 0.94635 metric cups.
- **Important Files:** `frontend/src/tools/calculators/oz-to-cups/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-oz-to-cups-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b63` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/oz-to-cups-converter` shows 8 US fl oz = 1 cup.

### 2026-11-14 — Add Gallon Calculator
- **Summary:** Shipped a multi-field gallon/volume converter plus water-weight mode on the existing catalog slug `gallon-calculator`. Exact US liquid (3.785411784 L), Imperial (4.54609 L), and US dry (4.40488377086 L) gallons; metric, cubic, qt/pt/fl oz/cups/spoons via canonical liters; water mass requires density (default ≈1 kg/L labeled approximate). Publishing flags preserved; Gallon Calculator pillar preserved; `subPillar` null.
- **Example:** 1 US gal = 3.785411784 L = 4 qt = 8 pt = 128 fl oz = 16 cups ≈ 0.13368 ft³; at 1 kg/L → ≈ 3.7854 kg ≈ 8.3454 lb.
- **Important Files:** `frontend/src/tools/calculators/gallon/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-gallon-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990ac4` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e1` preserved; `subPillar` null). Browser: `/tools/gallon-calculator` shows 1 US gal with synced liters/qt/pt/fl oz/cups.

### 2026-11-14 — Add Quarts to Pounds Conversion
- **Summary:** Shipped a density-based quarts ↔ pounds converter on the existing catalog slug `quarts-to-pounds-conversion`. Exact US liquid (946.352946 mL), Imperial (1136.5225 mL), and US dry (1101.220942715 mL) quarts; water ≈1 kg/L preset only; Show Ingredient Density checkbox; more-options. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 1 US liquid qt water @ 1 kg/L ≈ 2.08635 lb; 4 qt ≈ 8.34540 lb; 5 lb → ≈ 2.39653 US liquid qt.
- **Important Files:** `frontend/src/tools/calculators/quarts-to-pounds/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-quarts-to-pounds-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b6c` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/quarts-to-pounds-conversion` shows 1 US liquid qt ≈ 2.08635 lb.

### 2026-11-14 — Add Gallons to Pounds Converter
- **Summary:** Shipped a density-based gallons ↔ pounds converter on the existing catalog slug `gallons-to-pounds-converter`. Exact US liquid (3.785411784 L), Imperial (4.54609 L), and US dry gallons; water ≈1 kg/L preset only; Show Liquid Density checkbox; more-options. Publishing flags preserved with `isActive: false`; Gallon Calculator pillar preserved; `subPillar` null.
- **Example:** 1 US liquid gal water @ 1 kg/L ≈ 8.3454 lb; 5 gal @ 0.8 kg/L → 15.141647136 kg; 10 lb → ≈ 1.19826 US liquid gal.
- **Important Files:** `frontend/src/tools/calculators/gallons-to-pounds/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-gallons-to-pounds-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990acb` assigned (`isDeveloped: true`, `isActive: false`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e1` preserved; `subPillar` null). Public `/tools/gallons-to-pounds-converter` correctly 404s while inactive.

### 2026-11-14 — Add Volume Conversion
- **Summary:** Shipped a nine-field multi-unit volume converter on the existing catalog slug `volume-conversion`. Metric, US liquid/dry, Imperial, cooking, and cubic units via canonical liters; More Conversion Options; unit switches preserve physical volume. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 1 L = 1000 mL ≈ 0.26417 US gal; 1 US gal = 3.785411784 L = 4 qt = 8 pt = 16 cups = 128 fl oz = 256 tbsp = 768 tsp.
- **Important Files:** `frontend/src/tools/calculators/volume-conversion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-volume-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b73` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/volume-conversion` shows 1 L = 1000 mL with synced fields.

### 2026-11-14 — Add Grams To Ounces Calculator
- **Summary:** Shipped a bidirectional grams ↔ avoirdupois ounces mass converter on the existing catalog slug `grams-to-ounces-calculator`. Exact factor `1 oz = 28.349523125 g`; source-field tracking; mass≠fluid ounces notice; More Conversion Options; g↔oz charts and FAQs. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 100 g ≈ 3.527396195 oz; 5 oz = 141.747615625 g; 16 oz = 453.59237 g; 1 kg ≈ 35.27396195 oz.
- **Important Files:** `frontend/src/tools/calculators/grams-to-ounces/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-grams-to-ounces-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b41` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/grams-to-ounces-calculator` shows 100 g ≈ 3.527396194958 oz.

### 2026-11-14 — Add Weight Converter
- **Summary:** Shipped a multi-field mass converter on the existing catalog slug `weight-converter`. Canonical kilograms; metric, avoirdupois, troy, and scientific units; eight editable fields with independent unit dropdowns; More Conversion Options; mass≠force notice. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 1 kg = 1000 g = 1_000_000 mg ≈ 2.20462262185 lb ≈ 35.27396195 oz ≈ 0.1574730444 st; 1 troy oz = 31.1034768 g; 1 US short ton = 2000 lb.
- **Important Files:** `frontend/src/tools/calculators/weight-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-weight-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b74` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/weight-converter` shows 1 kg synced across fields.

### 2026-11-14 — Add kg to Gallons Converter
- **Summary:** Shipped a density-based kilograms ↔ gallons converter on the existing catalog slug `kg-to-gallons-converter`. Category/item selectors; verified density presets plus custom density; US liquid / Imperial / US dry gallons; bidirectional sync. Publishing flags preserved; Gallon Calculator pillar preserved; `subPillar` null.
- **Example:** 1 kg water @ ≈1 kg/L ≈ 0.264172 US gal; 5 kg ≈ 1.32086 US gal; 1 US gal water ≈ 3.785411784 kg; 10 kg @ 0.8 kg/L → 12.5 L ≈ 3.30215 US gal.
- **Important Files:** `frontend/src/tools/calculators/kg-to-gallons/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-kg-to-gallons-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990ace` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e1` preserved; `subPillar` null). Browser: `/tools/kg-to-gallons-converter` shows 1 kg ≈ 0.264172 US gal.

### 2026-11-14 — Add Force Converter
- **Summary:** Shipped a multi-field force converter on the existing catalog slug `force-converter`. Canonical newtons; SI, CGS, gravitational, and imperial units; seven editable fields with unit dropdowns; More Force Units; signed force components allowed. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 1 N = 0.001 kN = 100000 dyn ≈ 0.2248089431 lbf ≈ 101.9716213 gf ≈ 0.1019716213 kgf; 1 kgf = 9.80665 N; 1 lbf = 4.4482216152605 N; 1 tf = 9806.65 N.
- **Important Files:** `frontend/src/tools/calculators/force-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-force-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b9e` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/force-converter` shows 1 N synced across fields.

### 2026-11-14 — Add Nm to in-lbs Converter
- **Summary:** Shipped a bidirectional newton-meter ↔ inch-pound-force torque converter on the existing catalog slug `nm-to-in-lbs-converter`. Exact factor `1 in·lbf = 0.1129848290276167 N·m`; source-field tracking; signed torque; More Conversion Options; torque≠force/energy copy. Publishing flags preserved; existing category/pillar preserved; `subPillar` null.
- **Example:** 10 N·m ≈ 88.5074579133 in·lbf; 100 in·lbf = 11.29848290276167 N·m; 1 ft·lbf = 12 in·lbf = 1.3558179483314004 N·m.
- **Important Files:** `frontend/src/tools/calculators/nm-to-in-lbs/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-nm-to-in-lbs-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b10` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d2a27d8d1d4e98f9ea` preserved; `subPillar` null). Browser: `/tools/nm-to-in-lbs-converter` shows 10 N·m ≈ 88.507457913272 in·lbf.

### 2026-11-14 — Add Inch-lbs to Nm Converter
- **Summary:** Shipped the reverse torque converter on existing slug `inch-lbs-to-nm-converter` with inch-pounds first. Extracted shared `tools/shared/torque.ts` so both Nm↔in·lbf tools use one exact factor and other-units helper. Separate guide/SEO; publishing flags preserved; Inch Converter pillar preserved.
- **Example:** 100 in·lbf = 11.29848290276167 N·m; 10 N·m ≈ 88.5074579133 in·lbf; 1 ft·lbf = 12 in·lbf.
- **Important Files:** `frontend/src/tools/calculators/inch-lbs-to-nm/*`, `frontend/src/tools/shared/torque.ts`, nm-to-in-lbs re-export refactor, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-inch-lbs-to-nm-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `shared/torque.test.ts`, `nm-to-in-lbs/calculation.test.ts`, and `inch-lbs-to-nm/calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean. Mongo record `6af46f17a27d8d1d4e990b15` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d2a27d8d1d4e98f9eb` preserved; `subPillar` null). Browser: `/tools/inch-lbs-to-nm-converter` shows 100 in·lbf ≈ 11.298482902762 N·m.

### 2026-11-14 — Add Pressure Conversion
- **Summary:** Shipped a multi-field pressure converter on existing slug `pressure-conversion`. Canonical pascals; primary fields bar → psi → atm → Pa; unit dropdowns; More Conversion Options; Torr vs conventional mmHg documented; signed gauge/differential values allowed. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 1 bar = 100000 Pa = 100 kPa ≈ 14.503773773 psi ≈ 0.9869232667 atm; 1 atm = 101325 Pa = 1.01325 bar; 760 Torr = 1 atm.
- **Important Files:** `frontend/src/tools/calculators/pressure-conversion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-pressure-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean. Mongo record `6af46f17a27d8d1d4e990ba1` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/pressure-conversion` shows 1 bar ≈ 14.503773773 psi ≈ 0.986923267 atm = 100000 Pa.

### 2026-11-14 — Add Inch-Pounds to Foot-Pounds Converter
- **Summary:** Shipped a bidirectional inch-pound ↔ foot-pound torque converter on existing slug `inch-pounds-to-foot-pounds-converter`. Exact `1 ft·lbf = 12 in·lbf` helpers added to shared `tools/shared/torque.ts`. Simple two-field UI (in·lbf first); signed torque; no More Conversion Options accordion. Publishing flags preserved; Inch Converter pillar preserved.
- **Example:** 120 in·lbf = 10 ft·lbf; 24 in·lbf = 2 ft·lbf; 5 ft·lbf = 60 in·lbf; 100 in·lbf ≈ 8.333333333 ft·lbf.
- **Important Files:** `frontend/src/tools/calculators/inch-pounds-to-foot-pounds/*`, `frontend/src/tools/shared/torque.ts`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-inch-pounds-to-foot-pounds-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Shared torque, nm-to-in-lbs, inch-lbs-to-nm, and inch-pounds-to-foot-pounds tests passed. Frontend `tsc --noEmit` passed. Lint clean. Mongo record `6af46f17a27d8d1d4e990b16` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d2a27d8d1d4e98f9eb` preserved; `subPillar` null). Browser: `/tools/inch-pounds-to-foot-pounds-converter` shows 120 in·lbf = 10 ft·lbf.

### 2026-11-14 — Add PSI to GPM Calculator
- **Summary:** Shipped an ideal Bernoulli liquid-flow estimator on existing slug `psi-to-gpm-calculator`. Model `Q = Cd × A × √(2ΔP/ρ)` with SI canonical units; diameter↔area sync; absolute/gauge reference; default water ρ = 1000 kg/m³, Cd = 1, exit ≈ 1 atm; US gpm default. Clearly not a direct PSI↔GPM constant and not a full pipe-friction network model. Publishing flags preserved; PSI Converter pillar preserved; `subPillar` null.
- **Example:** 50 psia → ~14.696 psia, 2 cm ID, water, Cd = 1 → ≈ 109.87 US gpm (ideal discharge).
- **Important Files:** `frontend/src/tools/calculators/psi-to-gpm/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-psi-to-gpm-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean. Mongo record `6af46f17a27d8d1d4e990ae9` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e4` preserved; `subPillar` null). Browser: `/tools/psi-to-gpm-calculator` shows ≈ 109.87 US gpm for the default demo.

### 2026-11-14 — Add Lbs to Newtons Converter
- **Summary:** Shipped a bidirectional pound-force ↔ newton converter on existing slug `lbs-to-newtons-converter`. Reuses Force Converter `convertForce` and exact `1 lbf = 0.45359237 × 9.80665 N`. Simple lbf-first two-field UI; signed force; “lbs” clarified as pound-force not pound-mass. Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 10 lbf = 44.482216152605 N; 100 N ≈ 22.480894309 lbf.
- **Important Files:** `frontend/src/tools/calculators/lbs-to-newtons/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-lbs-to-newtons-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean. Mongo record `6af46f17a27d8d1d4e990b9f` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/lbs-to-newtons-converter` shows 10 lbf = 44.482216152605 N.

### 2026-11-14 — Add Torque to HP Calculator
- **Summary:** Shipped a shaft-power calculator on existing slug `torque-to-hp-calculator`. Canonical `P = τ × ω` with N·m / rad/s / W; reuses shared torque constants; mechanical hp (550 ft·lbf/s) and metric PS; independent input-pair reverse modes (torque+speed, power+speed, torque+power). Publishing flags preserved; `pillar`/`subPillar` left null.
- **Example:** 100 N·m @ 3000 rpm → ≈ 31415.93 W ≈ 31.416 kW ≈ 42.13 mechanical hp.
- **Important Files:** `frontend/src/tools/calculators/torque-to-hp/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-torque-to-hp-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean. Mongo record `6af46f17a27d8d1d4e990ba4` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null preserved). Browser: `/tools/torque-to-hp-calculator` shows the default demo.

### 2026-11-14 — Add Newton Meter Calculator
- **Summary:** Shipped a bidirectional newton-meter ↔ foot-pound-force torque converter on existing slug `newton-meter-calculator`. Reuses shared `tools/shared/torque.ts` (`1 ft·lbf = 1.3558179483314004 N·m`); N·m-first / ft·lbf-second with unit selectors; More Conversion Options; signed torque; N·m≠Joule notice. Publishing flags preserved; Meter Converter pillar preserved; `subPillar` null.
- **Example:** 10 N·m ≈ 7.3756214928 ft·lbf; 100 ft·lbf = 135.58179483314 N·m.
- **Important Files:** `frontend/src/tools/calculators/newton-meter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-newton-meter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean. Mongo record `6af46f17a27d8d1d4e990ae1` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d0a27d8d1d4e98f9e3` preserved; `subPillar` null). Browser: `/tools/newton-meter-calculator` shows 10 N·m ≈ 7.3756214928 ft·lbf.

### 2026-11-14 — Add Torr to atm Conversion
- **Summary:** Shipped bidirectional Torr ↔ atm pressure conversion on existing catalog slug `torr-to-atm-conversion`. Primary fields use exact `1 atm = 760 Torr`; expandable other units reuse the Pressure Conversion pascal engine (Pa, kPa, MPa, bar, mbar, psi, mmHg, inHg). Torr is not treated as identical to conventional mmHg. Publishing flags preserved; `isDeveloped` set true after verification. Live Mongo ATM Conversion pillar is `6af451d1a27d8d1d4e98f9e5` (task brief typo had `…d0…`).
- **Example:** 760 Torr = 1 atm; 380 Torr = 0.5 atm; 2 atm = 1520 Torr.
- **Important Files:** `frontend/src/tools/calculators/torr-to-atm/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-torr-to-atm-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module (existing `<img>` warnings elsewhere). Mongo record `6af46f17a27d8d1d4e990af1` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d1a27d8d1d4e98f9e5` preserved; `subPillar` null). Also fixed missing `IndependentKind` import in `torque-to-hp/calculation.ts` that blocked type-check.

### 2026-11-14 — Add Nm to ft-lbs Converter
- **Summary:** Shipped bidirectional N·m ↔ ft·lbf torque conversion on existing catalog slug `nm-to-ft-lbs-converter`. Reuses shared `tools/shared/torque.ts` (`nmToFtLbs` / `ftLbsToNm`); Other torque units accordion; signed torque; torque≠energy/force copy. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 10 N·m ≈ 7.3756214928 ft·lbf; 100 ft·lbf = 135.58179483314004 N·m; 1 ft·lbf = 12 in·lbf.
- **Important Files:** `frontend/src/tools/calculators/nm-to-ft-lbs/*`, `frontend/src/tools/shared/torque.ts`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-nm-to-ft-lbs-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` and `shared/torque.test.ts` passed. Frontend `tsc --noEmit` passed. Mongo record `6af46f17a27d8d1d4e990b0f` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; pillar `6af451d2a27d8d1d4e98f9ea` preserved; `subPillar` null).

### 2026-11-14 — Add Coordinates Converter
- **Summary:** Shipped DD ↔ DMS ↔ DDM geographic coordinates converter on existing catalog slug `coordinates-converter`. Canonical signed decimal degrees; hemisphere letters checkbox; latitude/longitude validation with minutes/seconds range and pole/antimeridian rules; display rounding carry. Publishing flags preserved; `isDeveloped` set true after verification. No UTM/MGRS/geocoding.
- **Example:** 40.7128°, −74.006° ↔ 40° 42′ 46.08″ N, 74° 0′ 21.6″ W ↔ 40° 42.768′ N, 74° 0.36′ W.
- **Important Files:** `frontend/src/tools/calculators/coordinates/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-coordinates-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Mongo record `6af46f17a27d8d1d4e990c05` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Lat Long to UTM Converter
- **Summary:** Shipped WGS84 latitude/longitude → UTM forward projection on existing catalog slug `lat-long-to-utm-converter`. DD and DMS inputs reuse Coordinates helpers; `proj4` ellipsoidal UTM; automatic zone with Norway/Svalbard exceptions; coverage −80°…84°; EPSG 326xx/327xx; easting/northing in meters. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** NYC 40.7128°, −74.006° → zone 18N, EPSG:32618, easting ≈ 583,959.372 m, northing ≈ 4,507,350.998 m; London zone 30N; Sydney zone 56S; Norway 60°, 6° → zone 32; Svalbard 78°, 20° → zone 33.
- **Important Files:** `frontend/src/tools/calculators/lat-long-to-utm/*`, `frontend/package.json` (`proj4`), registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-lat-long-to-utm-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Mongo record `6af46f17a27d8d1d4e990c07` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Degrees Minutes Seconds Calculator
- **Summary:** Shipped general-purpose bidirectional DMS ↔ decimal-degree angle converter on existing catalog slug `degrees-minutes-seconds-calculator`. Reuses Coordinates DMS helpers; sign applies to full magnitude (including −0°); no geographic bounds; angles may exceed 360°; clickable examples. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 47° 23′ 12″ = 47.3866666667°; 10.5797222222° → 10° 34′ 47″; −12° 30′ 0″ = −12.5°; 720° 30′ 0″ = 720.5°.
- **Important Files:** `frontend/src/tools/calculators/degrees-minutes-seconds/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-degrees-minutes-seconds-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Mongo record `6af46f17a27d8d1d4e990c06` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Scale Calculator
- **Summary:** Shipped length/area/volume scale converter on existing catalog slug `scale-calculator`. Modes: scale factor, scaled measurement, real measurement; linear k with k²/k³ multipliers; ratio parse (`1:100`, `2:1`); reuses Length/Area/Volume conversion engines; Map/Reality SVG; interactive examples. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 5 cm vs 10 m → k = 0.005 (1:200); 2.5 cm at 1:100 → 2.5 m; 100 m² at 1:10 → 1 m²; 8 m³ vs 1000 m³ → k = 0.2 (1:5).
- **Important Files:** `frontend/src/tools/calculators/scale/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-scale-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Mongo record `6af46f17a27d8d1d4e990c08` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Billion to Trillion Converter
- **Summary:** Shipped short-scale billion↔trillion converter on existing catalog slug `billion-to-trillion-converter`. Exact ×/÷1000 via string/BigInt decimal engine; absolute scientific notation (`1 × 10¹²`); default 1000 billion = 1 trillion; bidirectional source-field tracking; interactive examples. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 billion = 0.001 trillion = 1×10⁹; 1000 billion = 1 trillion = 1×10¹²; 500 billion = 0.5 trillion; 2.5 trillion = 2500 billion.
- **Important Files:** `frontend/src/tools/calculators/billion-to-trillion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-billion-to-trillion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Mongo record `6af46f17a27d8d1d4e990bd8` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Million to Lakh Converter
- **Summary:** Shipped million↔lakh converter on existing catalog slug `million-to-lakh-converter`. Exact ×/÷10 via reused string/BigInt decimal helpers; Indian + international absolute number formatting; default 1 million = 10 lakh; bidirectional source-field tracking; interactive examples. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 million = 10 lakh = 1,000,000 (intl) / 10,00,000 (Indian); 2.5 million = 25 lakh; 75 lakh = 7.5 million.
- **Important Files:** `frontend/src/tools/calculators/million-to-lakh/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-million-to-lakh-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bdd` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Cents to Euros Calculator
- **Summary:** Shipped euro cents↔euros denomination converter on existing catalog slug `cents-to-euros-calculator`. Exact ×/÷100 via reused string/BigInt decimal helpers (not FX); default 100 cents = €1; bidirectional source-field tracking; interactive examples. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 100 cents = €1.00; 250 cents = €2.50; €12.50 = 1,250 cents; 0.29 euro = 29 cents (no float artifact).
- **Important Files:** `frontend/src/tools/calculators/cents-to-euros/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-cents-to-euros-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bd9` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Million to Thousand Converter
- **Summary:** Shipped three-way millions↔thousands↔absolute decimal converter on existing catalog slug `million-to-thousand-converter`. Exact ×/÷1000 (and ×÷10⁶) via reused string/BigInt helpers; scientific notation on the decimal field; short-scale vs long-scale education; default 1 million = 1,000 thousands = 1,000,000. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 million = 1,000 thousands = 1,000,000 = 1×10⁶; 2.5 million = 2,500 thousands; 1e9 = 1,000 million.
- **Important Files:** `frontend/src/tools/calculators/million-to-thousand/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-million-to-thousand-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bde` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Crore to Lakh Converter
- **Summary:** Shipped crore↔lakh converter on existing catalog slug `crore-to-lakh-converter`. Exact ×/÷100 via reused string/BigInt helpers; Indian + international absolute formatting; default 1 crore = 100 lakh = 10,000,000; bidirectional source-field tracking; interactive examples. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 crore = 100 lakh = 10,000,000 (intl) / 1,00,00,000 (Indian); 2.7 crore = 270 lakh; 250 lakh = 2.5 crore.
- **Important Files:** `frontend/src/tools/calculators/crore-to-lakh/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-crore-to-lakh-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bda` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Number to Billion Converter
- **Summary:** Shipped short-scale number↔billion converter on existing catalog slug `number-to-billion-converter`. Exact ÷/×10⁹ via reused string/BigInt helpers; editable scientific notation; default 1,000,000,000 = 1 billion = 1×10⁹. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1,000,000,000 = 1 billion = 1×10⁹; 2,500,000,000 = 2.5 billion; 1e12 = 1,000 billion.
- **Important Files:** `frontend/src/tools/calculators/number-to-billion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-number-to-billion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bdf` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Crore to Million Converter
- **Summary:** Shipped crore↔million converter on existing catalog slug `crore-to-million-converter`. Exact ×/÷10 via reused string/BigInt helpers; Indian + international absolute formatting; default 1 crore = 10 million = 10,000,000; bidirectional source-field tracking; interactive examples. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 crore = 10 million = 10,000,000 (intl) / 1,00,00,000 (Indian); 12.75 crore = 127.5 million; 75 million = 7.5 crore.
- **Important Files:** `frontend/src/tools/calculators/crore-to-million/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-crore-to-million-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bdb` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Number to Million Converter
- **Summary:** Shipped short-scale number↔million converter on existing catalog slug `number-to-million-converter`. Exact ÷/×10⁶ via reused string/BigInt helpers; scientific notation in results; default 1,000,000 = 1 million = 1×10⁶. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1,000,000 = 1 million = 1×10⁶; 3,500,000 = 3.5 million; 500,000 = 0.5 million.
- **Important Files:** `frontend/src/tools/calculators/number-to-million/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-number-to-million-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be0` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Million to Billion Converter
- **Summary:** Shipped short-scale million↔billion↔full-number converter on existing catalog slug `million-to-billion-converter`. Exact ÷/×10³ between million/billion and ×10⁶/×10⁹ to absolute via reused string/BigInt helpers; scientific notation in results; default 1,000 million = 1 billion = 1,000,000,000. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1,000 million = 1 billion = 1,000,000,000; 2,500 million = 2.5 billion; 500 million = 0.5 billion.
- **Important Files:** `frontend/src/tools/calculators/million-to-billion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-million-to-billion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bdc` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Binary Converter
- **Summary:** Shipped signed two’s-complement binary converter on existing catalog slug `binary-converter`. Independent decimal→binary and binary→decimal sections; bit widths 8/16/32/64 via BigInt (`asUintN`/`asIntN`); exact-width binary required for decode; default signed 8-bit. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** −5 → 11111011 (8-bit); 00001010 → 10; 64-bit min/max round-trip beyond `Number.MAX_SAFE_INTEGER`.
- **Important Files:** `frontend/src/tools/calculators/binary/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-binary-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be1` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Gematria Calculator
- **Summary:** Shipped Gematria calculator on existing catalog slug `gematria-calculator`. Simple (A=1…Z=26), English (×6), English Jewish, and Hebrew Standard (Mispar Hechrechi with finals); live totals + letter breakdown; no silent Latin↔Hebrew transliteration. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** CAT → Simple 24 / English 144 / English Jewish 104; HELLO → 52 / 312 / 103; שלום → Hebrew 376.
- **Important Files:** `frontend/src/tools/calculators/gematria/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-gematria-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be6` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Binary to Hexadecimal Converter
- **Summary:** Shipped binary→hexadecimal converter on existing catalog slug `binary-to-hexadecimal-converter`. Direct 4-bit nibble mapping, BigInt decimal/octal, reverse hex→binary, expandable steps; precision-safe for values beyond `Number.MAX_SAFE_INTEGER`. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 10110110 → B6 / 182 / 266; 110101101 → 1AD; 2⁶⁴ binary → hex `10000000000000000`.
- **Important Files:** `frontend/src/tools/calculators/binary-to-hex/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-binary-to-hex-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be2` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Greek Gematria Calculator
- **Summary:** Shipped Greek isopsephy calculator on existing catalog slug `greek-gematria-calculator`. Traditional letter values (including stigma/digamma, koppa, sampi); NFD diacritic stripping with global regex; final sigma = 200; live total, breakdown, and reference table. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** ΑΛΦΑ → 532; ΛΟΓΟΣ / λόγος → 373; ΙΗΣΟΥΣ → 888; σος → 470.
- **Important Files:** `frontend/src/tools/calculators/greek-gematria/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-greek-gematria-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be7` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null).

### 2026-11-14 — Add Binary to Octal Converter
- **Summary:** Shipped binary↔octal converter on existing catalog slug `binary-to-octal-converter`. Exact three-bit triad lookup (no `parseInt`/`Number` for large integers); reverse octal→binary; expandable conversion steps; non-negative integers only. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 11010110₂ = 326₈; 1010₂ = 12₈; 472₈ = 100111010₂; round-trips and inputs beyond `Number.MAX_SAFE_INTEGER`.
- **Important Files:** `frontend/src/tools/calculators/binary-to-octal/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-binary-to-octal-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be3` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null; meta 70/148).

### 2026-11-14 — Add Hexadecimal Converter
- **Summary:** Shipped three-section hexadecimal converter on existing catalog slug `hexadecimal-converter`. Independent decimal→hex (BigInt), binary→hex (4-bit nibbles), and hex→decimal/binary; uppercase hex output; expandable steps; non-negative integers only. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 255₁₀ = FF₁₆; 11010110₂ = D6₁₆; 1A3F₁₆ = 6719₁₀ = 1101000111111₂; 2⁶⁴ round-trip beyond `Number.MAX_SAFE_INTEGER`.
- **Important Files:** `frontend/src/tools/calculators/hexadecimal/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-hexadecimal-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be8` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null; meta 65/145).

### 2026-11-14 — Add Decimal to Hexadecimal Converter
- **Summary:** Shipped bidirectional decimal↔hex converter on existing catalog slug `decimal-to-hexadecimal-converter`. Signed 16-bit range (−32768…32767); negatives as four-digit two’s complement; optional fixed-width padding; reverse hex→decimal with unsigned vs signed-16 interpretation. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 255₁₀ = FF₁₆; −10₁₀ = FFF6₁₆; FFFF₁₆ = 65535 (unsigned) or −1 (signed 16-bit); 123₁₀ = 7B₁₆.
- **Important Files:** `frontend/src/tools/calculators/decimal-to-hexadecimal/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-decimal-to-hexadecimal-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be4` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null; meta 52/151).

### 2026-11-14 — Add Roman Numerals Converter
- **Summary:** Shipped bidirectional Roman numerals converter on existing catalog slug `roman-numerals-converter`. Arabic↔Roman for 1–3999 with greedy value map, canonical regex validation, conversion steps, and full round-trip coverage. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 2026 = MMXXVI; 1994 = MCMXCIV; XLIX = 49; 3999 = MMMCMXCIX; round-trip for every n in 1…3999.
- **Important Files:** `frontend/src/tools/calculators/roman-numerals/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-roman-numerals-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (incl. 1–3999 round-trip). Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be9` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null; meta 44/148).

### 2026-11-14 — Screenshot-First Simplicity (ADR-023) + Simplify 12-Hour Shift Pay Calculator
- **Summary:** Locked ADR-023 so reference screenshots own functional scope while Auto Loan remains the visual master only. Simplified the live 12-Hour Shift Pay Calculator to three primary inputs (hourly wage, overtime hourly wage, regular hours) and five compact results (average hourly, day, week, month, year). Removed schedule fields, suggested 1.5× overtime tracking, and breakdown dashboards. Month uses weekly × 4.4; regular hours above 12 are rejected.
- **Example:** Defaults 20 / 30 / 8 → overtime 4 h, daily 280, average 23.33, week 1,400, month 6,160, year 72,800.
- **Important Files:** `frontend/src/tools/calculators/twelve-hour-shift-pay/*`, `backend/src/scripts/assign-twelve-hour-shift-pay-tool.ts`, `brain/{CALCULATOR_STANDARDS,NEW_TOOL_DEVELOPMENT_PLAYBOOK,DECISIONS,TOOL_DETAIL_PAGE_STANDARDS,CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`, `AGENTS.md`, `.cursor/rules/{calculator-standards,tool-detail-page-standards,screenshot-first-standards}.mdc`, `.agents/rules/{calculator-standards,tool-detail-page-standards,screenshot-first-standards}.md`.
- **Verification:** `calculation.test.ts` passed (11 cases). Frontend `tsc --noEmit` and `next lint` passed (existing `<img>` warnings only). Registry/sitemap/activation unchanged (`TwelveHourShiftPayCalculator`, slug `12-hour-shift-pay-calculator`). `npm run build` compiled and type-checked; failed later on unrelated Next invariant `no direct app page entry found for /_not-found`.

### 2026-11-14 — Add Decimal to Octal Converter
- **Summary:** Shipped bidirectional decimal↔octal converter on existing catalog slug `decimal-to-octal-converter`. BigInt exact precision for large integers; division-by-8 and positional steps; strict digit validation. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 125₁₀ = 175₈; 255₁₀ = 377₈; 2026₁₀ = 3752₈; round-trip 0…10000 plus values beyond `Number.MAX_SAFE_INTEGER`.
- **Important Files:** `frontend/src/tools/calculators/decimal-to-octal/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-decimal-to-octal-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990be5` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null; meta 46/147).

### 2026-11-14 — Add Byte Conversion Calculator
- **Summary:** Shipped interconnected byte/storage-unit converter on existing catalog slug `byte-conversion-calculator`. SI decimal prefixes (KB/MB/GB/TB/PB/EB = powers of 1000) stay distinct from IEC binary (KiB…EiB = powers of 1024); bits and nibbles included. Exact BigInt rational factors via shared decimal arithmetic; primary B/KB/MB/GB fields plus grouped extra-unit dropdown. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1000 B = 1 KB = 0.9765625 KiB = 8000 bit; 5 KiB = 5120 B = 5.12 KB; 1 bit = 0.125 B.
- **Important Files:** `frontend/src/tools/calculators/byte-conversion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-byte-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bc4` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null; meta 46/144).

### 2026-11-14 — Add Mbps to Gbps Converter
- **Summary:** Shipped interconnected Mbps ↔ Gbps ↔ GB/s data-rate converter on existing catalog slug `mbps-to-gbps-converter`. Exact SI bits/s factors (1 Gbps = 1000 Mbps; 1 GB/s = 8 Gbps = 8000 Mbps); bits (b) vs bytes (B) clarified. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1000 Mbps = 1 Gbps = 0.125 GB/s; 1 GB/s = 8000 Mbps = 8 Gbps; 2500 Mbps = 2.5 Gbps.
- **Important Files:** `frontend/src/tools/calculators/mbps-to-gbps/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mbps-to-gbps-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bcd` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null; meta 42/142).

### 2026-11-14 — Add Capacitance Converter
- **Summary:** Shipped interconnected SI capacitance converter on existing catalog slug `capacitance-converter`. Five editable fields F/mF/µF/nF/pF via exact farad BigInt rational factors. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 1 F = 1000 mF = 10⁶ µF = 10⁹ nF = 10¹² pF; 2.5 µF = 2500 nF = 2,500,000 pF; 470 pF = 0.47 nF.
- **Important Files:** `frontend/src/tools/calculators/capacitance/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-capacitance-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo record `6af46f17a27d8d1d4e990bc5` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`; `pillar`/`subPillar` null; meta 41/151).

### 2026-11-14 — Add Ares to Hectares Converter
- **Summary:** Shipped a bidirectional ares ↔ hectares land-area converter on the existing catalog slug `ares-to-hectares-converter`. Exact factor `1 ha = 100 a`. More conversion options cover m², km², ft², yd², acres, and land cents from canonical square meters. Publishing flags preserved (`isActive` left false); `isDeveloped` set true after verification.
- **Example:** 250 ares = 2.5 hectares; 3.75 hectares = 375 ares; 100 ares = 1 hectare.
- **Important Files:** `frontend/src/tools/calculators/ares-to-hectares/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ares-to-hectares-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b7a` assigned (`isDeveloped: true`, `isActive: false`, `indexable: false`, `isFeatured: false`). Public `/tools/ares-to-hectares-converter` correctly 404s while inactive.

### 2026-11-14 — Add Light Year Conversion
- **Summary:** Shipped a four-field astronomical distance converter on the existing catalog slug `light-year-conversion`. Julian-year light-year (`c × 31,557,600 s`), exact AU, and approximate parsec via `(648000/π) AU`. Metric/imperial/astro sections with independent unit selectors. Publishing flags preserved (`isActive` left false); `isDeveloped` set true after verification.
- **Example:** 1 ly = 9,460,730,472,580.8 km ≈ 5.87862537318×10¹² mi ≈ 63,241.077 AU; 1 pc ≈ 3.26156 ly.
- **Important Files:** `frontend/src/tools/calculators/light-year-conversion/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-light-year-conversion-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b8e` assigned (`isDeveloped: true`, `isActive: false`, `indexable: false`, `isFeatured: false`). Public `/tools/light-year-conversion` correctly 404s while inactive.

### 2026-11-14 — Add Ares to Cent Converter
- **Summary:** Shipped a bidirectional ares ↔ cents land-area converter on the existing catalog slug `ares-to-cent-converter`. Exact factors from 1 are = 100 m² and 1 cent = 1/100 international acre (40.468564224 m²). Publishing flags preserved (`isActive` left false); `isDeveloped` set true after verification.
- **Example:** 5 ares ≈ 12.3552690734 cents; 10 cents = 4.0468564224 ares; 1 are ≈ 2.47105381467 cents.
- **Important Files:** `frontend/src/tools/calculators/ares-to-cent/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ares-to-cent-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b79` assigned (`isDeveloped: true`, `isActive: false`, `indexable: false`, `isFeatured: false`). Public `/tools/ares-to-cent-converter` correctly 404s while inactive.

### 2026-11-14 — Add Length Converter
- **Summary:** Shipped a six-field length converter on the existing catalog slug `length-converter`. Twenty-five metric, imperial, nautical, and scientific units convert through canonical meters. All fields are editable; unit changes preserve physical length. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 100 m = 0.1 km = 10,000 cm ≈ 328.083989501 ft ≈ 3937.00787402 in ≈ 0.0621371192 mi; 1 mi = 1609.344 m; 1 nmi = 1852 m; 1 AU = 149597870700 m.
- **Important Files:** `frontend/src/tools/calculators/length-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-length-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Lint clean for the module. Mongo record `6af46f17a27d8d1d4e990b8d` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Browser: `/tools/length-converter` shows 100 m synced across six fields; Other units accordion updates from the meter base. Embed returns `X-Robots-Tag: noindex, nofollow` and `frame-ancestors *`.

### 2026-11-14 — Add Area Converter
- **Summary:** Shipped a five-field area converter on the existing catalog slug `area-converter`. Fifteen metric, imperial, and land units convert through canonical square meters. All fields are editable; unit changes preserve physical area. Publishing flags preserved; `isDeveloped` set true after verification.
- **Example:** 100 m² ≈ 1076.39104167 ft² = 1,000,000 cm² ≈ 119.59900463 yd² = 1 a; 1 acre = 4046.8564224 m²; 1 ha ≈ 2.47105381467 acres.
- **Important Files:** `frontend/src/tools/calculators/area-converter/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-area-converter-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Mongo record `6af46f17a27d8d1d4e990b78` assigned (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Browser: `/tools/area-converter` shows 100 m² synced across five fields. Embed returns `X-Robots-Tag: noindex, nofollow` and `frame-ancestors *`.

### 2026-11-14 — Refactor ARM Mortgage Calculator & Lock Screenshot-First Simplicity Standard
- **Summary:** Refactored the ARM Mortgage Calculator (`/tools/arm-mortgage-calculator`) to full parity with the Omni ARM reference screenshot and permanently locked the Screenshot-First Simplicity Standard (ADR-023) across project Brain and agent rules.
  - **Inputs:** Simplified to exactly 8 primary reference fields: Mortgage balance ($250,000 default with integrated currency selection), Term (20 years default), Interest rate at beginning (5.0% default), optional "Adjust compounding and fees" checkbox (revealing compounding frequency and upfront fees only when enabled), ARM type (10/1 ARM default), Adjustments by ("Manual setup" default), Expected adjustment (0.5% default), and Interest rate cap (8.0% default). Unrequested escrow fields and date inputs removed from UI.
  - **Results:** Compact primary results card showing monthly payment range ($1,649.89 – $1,831.07 / mo), reference APR (6.125%), actuarial APR (5.357%), mortgage term (20 years / 240 payments), total interest paid ($162,983.32), additional costs ($0.00), total payments ($412,983.32), and mortgage balance ($250,000). Expandable schedule & rate adjustment trajectory collapsed behind optional disclosure. Donut charts and payment comparison bars removed from main view.
  - **Rules & ADR-023:** Auto Loan is locked as the visual master (HOW it looks), not the functional master (WHAT it does). Functional scope is governed strictly by the reference screenshot. Currency selectors are included only when explicitly justified.
- **Important Files:** `frontend/src/tools/calculators/arm-mortgage/*`, `brain/CALCULATOR_STANDARDS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/TOOL_DETAIL_PAGE_STANDARDS.md`, `brain/DECISIONS.md`, `brain/CURRENT_STATE.md`, `brain/TASKS.md`, `brain/CHANGELOG.md`, `AGENTS.md`, `.agents/rules/*`, `.cursor/rules/*`.
- **Verification:** Unit tests in `calculation.test.ts` pass (verifying reference defaults, caps, Canadian compounding, fees, and calculations). Frontend `tsc --noEmit` and `npm run lint` pass with 0 errors.

### 2026-11-14 — Refactor A/R Days Calculator (Screenshot-First)
- **Commits:** `24dde60`, `38f1a9e`, `52dbac3`
- **Summary:** Refactored the existing A/R Days Calculator (`/tools/ar-days-calculator`, `ARDaysCalculator`) to screenshot-first simplicity (ADR-023). Removed reverse-solve modes, turnover cards, and the results dashboard. Main form is accounts receivable, net credit sales, number of days in the period (default 365), and inline A/R days. Optional Average balance calculation stays collapsed by default with beginning/ending inputs, calculated average, and explicit Use average A/R / Use ending A/R. Live calc; Reset only. Shared denomination currency; original guide/FAQs updated for forward DSO only.
- **Example:** 50,000 / 500,000 × 365 = 36.5 days.
- **Important Files:** `frontend/src/tools/calculators/ar-days/*`, `backend/src/scripts/assign-ar-days-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Module ESLint clean. Mongo activation and `/tools/ar-days-calculator` route verified after assign script.

### 2026-11-14 — Add Additional Funds Needed Calculator
- **Commits:** `010ee85`, `724137e`, (this Brain commit)
- **Summary:** Shipped a screenshot-first AFN calculator on the existing catalog slug `additional-funds-needed-calculator`. Exactly three money inputs (change in assets, liabilities, retained earnings) and one calculated AFN output using `AFN = ΔA − ΔL − ΔRE`. Blank defaults; signed changes allowed; negative AFN not clamped; denomination-only shared currency selectors; original guide/FAQs; shared SEO/ads/embed.
- **Example:** 100,000 − 30,000 − 20,000 = 50,000 additional funds needed.
- **Important Files:** `frontend/src/tools/calculators/additional-funds-needed/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-additional-funds-needed-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` 12 suites passed. `tool.key.ts` self-check passed. Lint clean for the AFN module. Mongo record `6af46f0fa27d8d1d4e99007e` activated (`isDeveloped: true`, `isActive: true`, `indexable: true`, `embedEnabled: true`).

### 2026-11-14 — Absence Percentage Calculator + ADR-023 verified activation lock
- **Commits:** `e43582c`, `8c99eb6`, (Brain/standards commit in this delivery)
- **Summary:** Shipped a compact Absence Percentage Calculator on existing catalog slug `absence-percentage-calculator` (`AbsencePercentageCalculator`, catalog `6af46f0fa27d8d1d4e99007d`). Four primary fields only: total employees, total workdays (per employee), total days absent, and absenteeism rate. Formula `(days absent ÷ (employees × workdays)) × 100`. No currency selector. Blank initial inputs; auto-calc on valid input. Strengthened ADR-023 with verified automatic activation checklist for Cursor and Antigravity.
- **Example:** 10 employees × 20 workdays, 8 absent → 4%.
- **Important Files:** `frontend/src/tools/calculators/absence-percentage/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-absence-percentage-tool.ts`, `AGENTS.md`, `brain/{CALCULATOR_STANDARDS,NEW_TOOL_DEVELOPMENT_PLAYBOOK,TOOL_DETAIL_PAGE_STANDARDS,DECISIONS,CURRENT_STATE,TASKS,CHANGELOG,FRONTEND}.md`, `.cursor/rules/{calculator-standards,tool-activation,screenshot-first-standards}.mdc`, `.agents/rules/{calculator-standards,tool-activation,screenshot-first-standards}.md`.
- **Verification:** `calculation.test.ts` passed. Backend `tool.key.ts` self-check passed. Mongo record activated (`isDeveloped: true`, `isActive: true`, `indexable: true`, `embedEnabled: true`).

### 2026-11-14 — Add Accumulated Depreciation Calculator
- **Summary:** Shipped a four-method accumulated depreciation calculator on existing catalog slug `accumulated-depreciation-calculator`. Methods: straight line (default), 200% declining balance with salvage floor true-up (no silent switch to straight-line), sum of the year's digits, and units of production (conditional production fields). Compact results show only accumulated depreciation and net book value. Shared `CurrencySelect` is denomination-only. Defaults: cost 25,000, life 15, years 2, salvage 3,000 ? 2,933.33 / 22,066.67.
- **Important Files:** `frontend/src/tools/calculators/accumulated-depreciation/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-accumulated-depreciation-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Frontend `tsc --noEmit` passed. Mongo record `6af46f0fa27d8d1d4e99003c` assigned (`isDeveloped: true`, `isActive: true`, `indexable: true`, `embedEnabled: true`). Catalog API returns the active tool.

### 2026-11-14 — Add Attrition Rate Calculator (Screenshot-First)
- **Summary:** Shipped a screenshot-first employee attrition rate calculator on existing catalog slug `attrition-rate-calculator` (`AttritionRateCalculator`, catalog `6af46f0fa27d8d1d4e99007f`). Exact 4-field card layout matching the reference screenshot: starting headcount, ending headcount, departures, and inline calculated attrition rate output with `%` suffix. Formula: `Average = (Start + End) / 2`, `Attrition rate (%) = (Left / Average) * 100`. All inputs initially blank; auto-calculates on valid non-negative inputs with non-zero average; allows rates > 100% without clamping. Zero currency dropdowns, zero charts, and zero unrequested inputs. Integrated share result clipboard action, reload calculator, clear changes, and satisfaction feedback widget. Guide article with formulas, examples, and FAQs; shared Auto Loan shell, SEO, and embed.
- **Example:** Start = 100, End = 90, Left = 10 → Average = 95, Attrition rate = 10.53%.
- **Important Files:** `frontend/src/tools/calculators/attrition-rate/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-attrition-rate-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Unit tests in `calculation.test.ts` pass. MongoDB record `6af46f0fa27d8d1d4e99007f` activated via `assign-attrition-rate-tool.ts` (`isDeveloped: true`, `isActive: true`, `indexable: true`, `embedEnabled: true`). Full builds/lint/browser tests omitted per user's explicit credit-saving instructions.

### 2026-11-15 — Add Revenue Per Employee Calculator (Screenshot-First)
- **Summary:** Shipped Revenue Per Employee Calculator on existing catalog slug `revenue-per-employee-calculator` (`RevenuePerEmployeeCalculator`, catalog `6af46f0fa27d8d1d4e990020`). Revenue ÷ number of employees. Blank start; whole-number employees > 0; zero revenue OK. Denomination currency (PKR). Omega UI. Shared shell, SEO, embed.
- **Example:** PKR 5,000,000 / 25 → PKR 200,000.
- **Important Files:** `frontend/src/tools/calculators/revenue-per-employee/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-revenue-per-employee-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-15 — Add SaaS Lifetime Value Calculator (Screenshot-First)
- **Summary:** Shipped SaaS Lifetime Value Calculator on existing catalog slug `saas-lifetime-value-calculator` (`SaasLifetimeValueCalculator`, catalog `6af46f0fa27d8d1d4e9900b6`). ARPA (or recurring revenue ÷ accounts), gross margin (default 100%), churn, account expansion (default 0), LTV. Zero churn → “No finite estimate”. Denomination currency. Omega UI.
- **Example:** ARPA 1,000 + expansion 100, GM 80%, churn 5% → LTV 17,600.
- **Important Files:** `frontend/src/tools/calculators/saas-lifetime-value/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-saas-lifetime-value-tool.ts`, `brain/{CURRENT_STATE,TASKS,CHANGELOG}.md`.
- **Verification:** Formula self-check for example LTV 17,600 and zero-churn null. Mongo activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.

### 2026-11-14 — Add Business Loan Calculator (Screenshot-First)
- **Summary:** Shipped a screenshot-first commercial business loan calculator on existing catalog slug `business-loan-calculator` (`BusinessLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ff4f`). Three clean sections matching reference screenshot: (1) Main specifications (nominal/effective known rate, interest rate, compound frequency, loan amount with PKR currency selector, loan term in years and months, payment frequency); (2) Additional fees (prepaid fee, loaned fee, origination fee %, repayment options: from loan, rolling into loan, out of pocket); (3) Results (callout message, net loan received, periodic payment, total interest, total payment, total finance charge, APR, and effective APR). Standard amortizing annuity formulas, frequency conversion via EAR, and exact root-finding APR under Truth in Lending. Reuses OmegaCalculators visual design, share/reset controls, guide article, SEO, and embed.
- **Example:** Loan 100,000 PKR, 5% nominal, 10 years monthly, 500 prepaid fee, 1,000 loaned fee, 8% origination deducted from loan → Net loan 92,000 PKR, periodic payment 1,071.26 PKR, total interest 27,551.40 PKR, total payment 129,051.40 PKR, total finance charge 37,051.40 PKR, APR 7.15%, effective APR 7.39%.
- **Important Files:** `frontend/src/tools/calculators/business-loan/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-business-loan-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Unit tests in `calculation.test.ts` pass for all modes and edge cases. MongoDB record `6af46f0fa27d8d1d4e98ff4f` activated via `assign-business-loan-tool.ts` (`isDeveloped: true`, `isActive: true`, `indexable: true`, `embedEnabled: true`). Lint/builds/browser tests omitted per user credit-saving instructions.
