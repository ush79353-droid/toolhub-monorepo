# Development Changelog (`CHANGELOG.md`)

> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.

---

### 2026-11-19 — Add Average Return Calculator
- **Summary:** Shipped Average Return Calculator on existing catalog slug `average-return-calculator` (`AverageReturnCalculator`, catalog `6af46f0fa27d8d1d4e9900c2`, preserved `nameKey` `average return calculator`). Screenshot-first (ADR-023): dual independent sections — cash-flow money-weighted XIRR (starting/ending balance + dated deposits/withdrawals) and average/cumulative period returns (return % + years/months). Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false. Denomination-only CurrencySelect on cash-flow section (no FX).
- **Formulas:** XIRR Σ CFᵢ/(1+r)^((Dᵢ−D₀)/365)=0 (Newton + bisection); annualize (1+R)^(12/M)−1; arithmetic avg of annualized; cumulative ∏(1+Rᵢ)−1; overall annualized (1+cum)^(12/totalMonths)−1. Signs: −start/−deposit/+withdrawal/+end.
- **Example:** 10,000→12,100 over two years ≈ 10% XIRR; 10%/−2%/15% → cumulative 24.07%.
- **Important Files:** `frontend/src/tools/calculators/average-return/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add TRIR Calculator
- **Summary:** Shipped TRIR Calculator on existing catalog slug `trir-calculator` (`TrirCalculator`, catalog `6af46f0fa27d8d1d4e9900bc`, preserved `nameKey` `trir calculator`). Screenshot-first (ADR-023): hours worked, recordable injuries, TRIR; reverse hours/estimated cases; illustrative low/moderate/high bands with disclaimer. Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** TRIR = (I × 200,000) / H; Hours = (I × 200,000) / TRIR; Estimated I = TRIR × H / 200,000.
- **Example:** 2 cases · 2,000,000 hours → 0.20; 20 / 1,000,000 → 4.00; 50 / 1,000,000 → 10.00; 0 cases → 0.00.
- **Important Files:** `frontend/src/tools/calculators/trir/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add Remote vs. On-Location Workers Calculator
- **Summary:** Shipped Remote vs. On-Location Workers Calculator on existing catalog slug `remote-vs-on-location-workers-calculator` (`RemoteVsOnLocationWorkersCalculator`, catalog `6af46f0fa27d8d1d4e9900b4`, preserved `nameKey` `remote vs. on-location workers calculator`). Screenshot-first (ADR-023): period units; remote per-employee costs; on-location office-level costs with lease/own; extra expense rows; frequency→monthly normalization; denomination-only CurrencySelect. Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** Remote = N×A + N×R_monthly×T; On-location = O + (lease_monthly? + R_office)×T; per-employee = total/N when N>0; difference = TC_on − TC_remote.
- **Example:** 10 remote · 20k one-time · 5k/mo · 12 mo → 800k; own office 150k + 50k/mo → 750k.
- **Important Files:** `frontend/src/tools/calculators/remote-vs-on-location-workers/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add NPS Calculator
- **Summary:** Shipped NPS Calculator on existing catalog slug `nps-calculator` (`NpsCalculator`, catalog `6af46f0fa27d8d1d4e9900ab`, preserved `nameKey` `nps calculator`). Screenshot-first (ADR-023): scores 0–10 response counts; promoters/passives/detractors analysis; NPS with mix visualization. Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** PR=S9+S10; PA=S7+S8; DR=S0…S6; NPS=((PR−DR)/TR)×100 = %PR−%DR. Average score optional, never replaces NPS.
- **Example:** Spec Example A → promoters 50 · passives 25 · detractors 25 · NPS +25. Bounds ±100; all-passives → 0.
- **Important Files:** `frontend/src/tools/calculators/nps/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add Loss Ratio Calculator
- **Summary:** Shipped Loss Ratio Calculator on existing catalog slug `loss-ratio-calculator` (`LossRatioCalculator`, catalog `6af46f0fa27d8d1d4e9900a9`, preserved `nameKey` `loss ratio calculator`). Screenshot-first (ADR-023): Financial results accordion (earned premiums, claims paid, LAE); loss ratio %; interpretation + compact summary; denomination-only CurrencySelect (default PKR). Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** LR=((Claims Paid + Loss Adjustment Expenses) / Earned Premiums)×100; Total Loss-Related Costs = Claims + LAE; Premiums Remaining = Premiums − Total Costs (not net income).
- **Example:** Premiums 10,000,000 · Claims 3,500,000 · LAE 1,800,000 → LR 53.00%. Zero claims/expenses → 0%; ratios above 100% supported; zero premiums blocked.
- **Important Files:** `frontend/src/tools/calculators/loss-ratio/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add HR Software ROI Calculator
- **Summary:** Shipped HR Software ROI Calculator on existing catalog slug `hr-software-roi-calculator` (`HrSoftwareRoiCalculator`, catalog `6af46f0fa27d8d1d4e9900a4`, preserved `nameKey` `hr software roi calculator`). Screenshot-first (ADR-023): simple cost/benefit/ROI%; optional advanced itemized costs & benefits; evaluation period; BCR; payback estimate. Denomination-only CurrencySelect (default PKR). Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** ROI=((B−C)/C)×100; Net=B−C; BCR=B/C; recurring amounts scaled by billing frequency × period months; payback ≈ one-time / annual net recurring when positive.
- **Example:** Cost 500,000 · Benefit 750,000 → ROI 50% · net 250,000 · BCR 1.50.
- **Important Files:** `frontend/src/tools/calculators/hr-software-roi/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add DART Rate Calculator
- **Summary:** Shipped DART Rate Calculator on existing catalog slug `dart-rate-calculator` (`DartRateCalculator`, catalog `6af46f0fa27d8d1d4e990097`, preserved `nameKey` `dart rate calculator`). Screenshot-first (ADR-023): total DART incidents, total hours worked, DART rate; OSHA formula; reverse hours/estimated cases via last-edited driver. Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** Rate = (N × 200,000) / EH; Hours = (N × 200,000) / Rate; Estimated N = Rate × EH / 200,000.
- **Example:** 5 cases · 400,000 hours → 2.50; 0 cases · 200,000 hours → 0.00.
- **Important Files:** `frontend/src/tools/calculators/dart-rate/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add Customer Effort Score Calculator
- **Summary:** Shipped Customer Effort Score Calculator on existing catalog slug `customer-effort-score-calculator` (`CustomerEffortScoreCalculator`, catalog `6af46f0fa27d8d1d4e990095`, preserved `nameKey` `customer effort score calculator`). Screenshot-first (ADR-023): 1–5/1–7 scale selector; dynamic response counts; weighted CES; low/neutral/high effort %; collapsible median/mode/distribution. Lower score = less effort. Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** CES = Σ(score × count) / Σ(count). Scale 5 low=1–2 / neutral=3 / high=4–5; scale 7 low=1–3 / neutral=4 / high=5–7.
- **Example:** Responses [10,5,3,5,5] → total 28 · weighted 74 · CES 2.64/5.
- **Important Files:** `frontend/src/tools/calculators/customer-effort-score/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add Combined Ratio Calculator
- **Summary:** Shipped Combined Ratio Calculator on existing catalog slug `combined-ratio-calculator` (`CombinedRatioCalculator`, catalog `6af46f0fa27d8d1d4e99008a`, preserved `nameKey` `combined ratio calculator`). Screenshot-first (ADR-023): claim loss + loss adjustments + loss expense; premiums + underwriting expense + combined ratio %; reverse solve for UE/premiums/LE; loss/expense ratios, underwriting result & margin. Denomination-only CurrencySelect. Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** LE=CL+LA; LR=(LE/P)×100; ER=(UE/P)×100; CR=LR+ER; UE=(CR/100)×P−LE; P=(LE+UE)/(CR/100); UW result=P−LE−UE; margin=100−CR.
- **Example:** CL 40M · LA 5M · P 100M · UE 25M → LE 45M · CR 70% · UW result 30M. Reverse: CR 85% · P 80M · LE 50M → UE 18M.
- **Important Files:** `frontend/src/tools/calculators/combined-ratio/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add Weekly Pay Calculator
- **Summary:** Shipped Weekly Pay Calculator on existing catalog slug `weekly-pay-calculator` (`WeeklyPayCalculator`, catalog `6af46f0fa27d8d1d4e99007a`, preserved `nameKey` `weekly pay calculator`). Screenshot-first (ADR-023): bidirectional hourly/daily/monthly/annual gross pay via weekly hub; schedule hours/day, days/week, hours/week sync, paid weeks ↔ unpaid weeks (sum 52); examples; denomination-only CurrencySelect. Activated via `npm run tool:assign` with `--set-active` only — **`indexable` preserved false**; pillar/subPillar null; isFeatured left false.
- **Formulas:** Weekly from H×HPW, D×DPW, M×12/WPY, A/WPY; reverse via weekly hub. HPW = HPD×DPW; average weeks/month = WPY/12.
- **Example:** Hourly 18 · 8h · 5d · 52 weeks → weekly 720 · monthly 3,120 · annual 37,440. Monthly 4,000 → weekly ≈ 923.08 · annual 48,000.
- **Important Files:** `frontend/src/tools/calculators/weekly-pay/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign` without `--set-indexable`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add VAT Calculator
- **Summary:** Shipped VAT Calculator on existing catalog slug `vat-calculator` (`VatCalculator`, catalog `6af46f0fa27d8d1d4e990079`, preserved `nameKey` `vat calculator`). Screenshot-first (ADR-023): VAT excluded/included modes, custom rate (default 20% example), synchronized net/VAT/gross with last-edited driver, denomination-only CurrencySelect. Reverse VAT uses ÷(1+r/100). Activated via `npm run tool:assign` with `--set-active --set-indexable`; pillar/subPillar null; isFeatured left false.
- **Formulas:** Add: VAT = Net×(Rate/100), Gross = Net+VAT. Remove: Net = Gross/(1+Rate/100), VAT = Gross−Net. Money rounded once at currency fraction digits.
- **Example:** Net 100 · 20% → VAT 20 · Gross 120; Gross 120 · 20% → Net 100.
- **Important Files:** `frontend/src/tools/calculators/vat/*`, registry, sitemap, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign`. Three ADR-019 commits. Temporary files cleaned: YES.

### 2026-11-19 — Add Trump's Taxes vs. Your Taxes Calculator
- **Summary:** Shipped Trump's Taxes vs. Your Taxes Calculator on existing catalog slug `trumps-taxes-vs-your-taxes-calculator` (`TrumpsTaxesVsYourTaxesCalculator`, catalog `6af46f0fa27d8d1d4e990078`). Screenshot-first (ADR-023): your tax default $3,202; Trump tax default $750 with historical 2016/2017 labeling (not presented as 2019 liability); live ratio/difference/%; collapsible luxury and essentials lists; editable illustrative unit prices. Fixed USD (no FX). Activated via `npm run tool:assign` with `--set-active --set-indexable`; pillar/subPillar null preserved.
- **Formulas:** ratio = user/trump; difference = user−trump; % = (difference/trump)×100; quantity = floor(max(difference,0)/unitPrice).
- **Example:** 3,202 / 750 → ≈ 4.2693× · difference 2,452 · Dom Pérignon quantity 43 at default assumption prices.
- **Important Files:** `frontend/src/tools/calculators/trumps-taxes-vs-your-taxes/*`, registry `keys`/`index`/`details`, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activation via `tool:assign`. Three ADR-019 commits. Temporary files cleaned: YES (lookup script under `%TEMP%`).

### 2026-11-19 — Brain sync: frontend build green + Finance category dual-evidence audit
- **Summary:** Documented verified frontend production build (`npm run build` exit 0) after ESLint soft-warns, `noUnusedLocals`/`noUnusedParameters` off, optional `ToolPageDetail.countryRules`, and structural TS fixes across calculators. Recorded Finance & Business category audit (`6af451bba27d8d1d4e98f959`): Mongo `isDeveloped` + `IMPLEMENTED_TOOL_SLUGS` dual evidence (644 / 299 / 298 / 298). Temp audit script + Desktop xlsx stay outside git (ADR-025).
- **Important Files:** `frontend/eslint.config.mjs`, `frontend/tsconfig.json`, `frontend/src/tools/page-detail.ts`, `brain/CURRENT_STATE.md`, `brain/TASKS.md`, `brain/CHANGELOG.md`.
- **Verification:** `cd frontend && npm run build` passed. Temporary files cleaned: YES (repo); audit temps remain under `%TEMP%/omni-finance-audit` by design.

### 2026-11-19 — Add Unlevered Free Cash Flow Calculator
- **Summary:** Shipped Unlevered Free Cash Flow Calculator on existing catalog slug `unlevered-free-cash-flow-calculator` (`UnleveredFreeCashFlowCalculator`, catalog `6af46f0fa27d8d1d4e98fff8`). Screenshot-first (ADR-023): EBIT FX; Effective tax rate %; Depreciation and amortization FX; CapEx FX; Change in working capital FX → Unlevered free cash flow FX. Share/Reload/Clear/feedback. Independent Phase 2 FX; ETR never converts. FreeCashFlowCalculator / FcffCalculator / LeveredFreeCashFlowCalculator siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96b` / subPillar null.
- **Formulas:** NOPAT = EBIT × (1 − ETR / 100); UFCF = NOPAT + DA − CapEx − ΔWC. CapEx positive spending; negative ΔWC increases cash; no interest or debt repayments; ETR 0–100%; negative EBIT/UFCF allowed; full precision with display rounding only.
- **Example:** EBIT 400,000 PKR · ETR 25% · DA 50,000 · CapEx 80,000 · ΔWC 20,000 → NOPAT 300,000 · UFCF 250,000 PKR.
- **Important Files:** `frontend/src/tools/calculators/unlevered-free-cash-flow/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed (pure formula check + `calculation.test.ts` present). Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Triple Discount Calculator
- **Summary:** Shipped Triple Discount Calculator on existing catalog slug `triple-discount-calculator` (`TripleDiscountCalculator`, catalog `6af46f0fa27d8d1d4e98fff2`). Screenshot-first (ADR-023): Original price FX; 1st discount %; 2nd discount % (default 0); 3rd discount % (default 0); Final price FX; Price difference FX; collapsible Effective discount %. Share/Reload/Clear/feedback. Reused Double Discount UI/FX patterns without modifying that sibling. Independent Phase 2 FX; discount percents and effective % never convert. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Pillar `6af451bda27d8d1d4e98f96a` preserved; subPillar null.
- **Formulas:** Final = P×(1−D1/100)×(1−D2/100)×(1−D3/100); Diff = P−Final; Effective = [1−(1−D1/100)(1−D2/100)(1−D3/100)]×100. Clamp each discount 0–100%; nonnegative price; full precision with display rounding only.
- **Example:** 10,000 PKR · 20% · 20% · 20% → final 5,120 · difference 4,880 · effective 48.8%.
- **Important Files:** `frontend/src/tools/calculators/triple-discount/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Salary to Hourly Calculator
- **Summary:** Shipped Salary to Hourly Calculator on existing catalog slug `salary-to-hourly-calculator` (`SalaryToHourlyCalculator`, catalog `6af46f0fa27d8d1d4e990000`). Screenshot-first (ADR-023): Hourly wage FX ↔ Annual salary FX (last-edited authoritative; default annual); Hours/week default 40; Your wage as Daily/Monthly/Weekly/Biweekly FX; empty collapsed Other time intervals. Share/Reload/Clear/feedback. Independent Phase 2 FX; hours never convert. HourlyToSalaryWageCalculator patterns reused lightly (sibling untouched). Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96c` / subPillar `6af46f0dae6d84bd3ef8f7cf`.
- **Formulas:** Annual hours = Hours × 52; Annual = Hourly × annualHours; Hourly = Annual / annualHours; Weekly = Hourly × Hours; Biweekly = Weekly × 2; Monthly = Annual / 12; Daily = Weekly / 5. Full precision with display rounding only.
- **Example:** 1,040,000 PKR annual · 40h → hourly 500 · weekly 20,000 · biweekly 40,000 · monthly ≈ 86,666.67 · daily 4,000.
- **Important Files:** `frontend/src/tools/calculators/salary-to-hourly/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Salary Inflation Calculator
- **Summary:** Shipped Salary Inflation Calculator on existing catalog slug `salary-inflation-calculator` (`SalaryInflationCalculator`, catalog `6af46f0fa27d8d1d4e98fffc`). Screenshot-first (ADR-023): Reference salary FX; Inflation %; Inflation-adjusted salary FX; Current salary FX; Gain/Loss FX. Single-period only (no multi-year compounding). Share/Reload/Clear/feedback. Independent Phase 2 FX; normalize current into reference currency before comparison; inflation % never converts. FutureSalaryCalculator patterns reused lightly (sibling untouched). Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96c` / subPillar null.
- **Formulas:** Adjusted = Reference × (1 + Inflation/100); Gain/Loss = Current − Adjusted. Inflation > −100%; salaries ≥ 0; full precision with display rounding only.
- **Example:** 100,000 PKR · 5% · current 110,000 → adjusted 105,000 · gain 5,000; flat 100,000 vs 10% → adjusted 110,000 · loss −10,000.
- **Important Files:** `frontend/src/tools/calculators/salary-inflation/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Salary Calculator
- **Summary:** Shipped Salary Calculator on existing catalog slug `salary-calculator` (`SalaryCalculator`, catalog `6af46f0fa27d8d1d4e98fff9`). Screenshot-first (ADR-023): I get paid dropdown default Per hour (only verified mode); Pay per hour FX (label adapts); I work hours/day default 8; days/week default 5; Holidays/year 8; Paid vacation/year 15 → Hourly/Daily/Weekly/Monthly/Annual FX. Holidays and paid vacation are not subtracted from annual paid salary; 52-week convention disclosed. Share/Reload/Clear/feedback. Independent Phase 2 FX; hours/days/leave never convert. SalaryWithOvertimeCalculator and HourlyToAnnualSalaryCalculator siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96c` / subPillar null.
- **Formulas:** Weekly hours = Hours/day × Days/week; Weekly = Hourly × Weekly hours; Annual scheduled days = Days/week × 52; Annual = Hourly × Hours/day × Annual scheduled days; Monthly = Annual ÷ 12; Daily = Hourly × Hours/day. Full precision with display rounding only.
- **Example:** 500 PKR/hr · 8h/day · 5d/week → weekly 20,000 · annual 1,040,000 · monthly ≈ 86,666.67 · daily 4,000.
- **Important Files:** `frontend/src/tools/calculators/salary/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Quiz: Dividend Calculator
- **Summary:** Shipped educational Quiz: Dividend Calculator on existing catalog slug `quiz-dividend-calculator` (`QuizDividendCalculator`, catalog `6af46f0fa27d8d1d4e990008`). Screenshot-first (ADR-023) six-question quiz: dividend definition, why yield, yield formula, yield numeric (1%), reinvestment, compounding balance (≈ $2,593.74). Score `/6` + accuracy % after all answered; per-question correct/incorrect + explanations when checkbox checked and complete; Share/Reload/Clear/feedback; link to Dividend Yield Calculator. Fixed USD; no FX; not added to `CURRENCY_CONVERSION_SLUGS`. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96e` / subPillar null.
- **Answers:** Q1 B; Q2 C; Q3 A; Q4 1% (±0.05); Q5 B; Q6 `1000×(1.1)^10` ≈ 2593.74 (±1).
- **Important Files:** `frontend/src/tools/calculators/quiz-dividend/*`, registry `keys`/`index`/`details`, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Prorated Salary Calculator
- **Summary:** Shipped Prorated Salary Calculator on existing catalog slug `prorated-salary-calculator` (`ProratedSalaryCalculator`, catalog `6af46f0fa27d8d1d4e98fffb`). Screenshot-first (ADR-023): Year/Month calendar; Gross salary FX + pay period; Days worked; Holidays; Approved leave; Days worked per week; Days off → eligible working days + Prorated salary FX. Payable-day convention verified from screenshot (worked + paid holidays + paid leave). Share/Reload/Clear/feedback. Independent Phase 2 FX; day counts never convert. ProratedRentCalculator sibling untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96c` / subPillar null.
- **Formulas:** Scheduled = civil calendar days minus selected days off; Payable = Worked + Holidays + Leave; Monthly = month as-is / year÷12 / week×52/12 / day×scheduled; Prorated = Monthly × Payable / Scheduled. Zero scheduled blocked; payable cannot exceed scheduled; full precision with display rounding only.
- **Example:** Jan 2025 · Five-day · Sun/Sat off · 2,000 PKR/mo · 10+1+1 → 23 working days · ≈ 1,043.48 PKR.
- **Important Files:** `frontend/src/tools/calculators/prorated-salary/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Percentage Discount Calculator
- **Summary:** Shipped Percentage Discount Calculator on existing catalog slug `percentage-discount-calculator` (`PercentageDiscountCalculator`, catalog `6af46f0fa27d8d1d4e98fff1`). Screenshot-first (ADR-023): Price before discount FX; Discount %; Price after discount FX; You save FX. Link to advanced Discount Calculator (`/tools/discount-calculator`). Examples: new dress 20%; new bed 15%. Share/Reload/Clear/feedback. Independent Phase 2 FX; percent never converts. DiscountCalculator sibling untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bda27d8d1d4e98f96a` / subPillar null.
- **Formulas:** Discount Amount = Price × Discount / 100; Price After = Price − Amount; You Save = Amount. Price ≥ 0; discount 0–100 inclusive; full precision with display rounding only.
- **Example:** 5,000 PKR × 20% → after 4,000 · save 1,000; 25,000 × 15% → after 21,250 · save 3,750.
- **Important Files:** `frontend/src/tools/calculators/percentage-discount/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check present in `calculation.test.ts` (execution omitted per task). Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Operating Cash Flow Calculator
- **Summary:** Shipped Operating Cash Flow Calculator on existing catalog slug `operating-cash-flow-calculator` (`OperatingCashFlowCalculator`, catalog `6af46f0fa27d8d1d4e98fff7`). Screenshot-first (ADR-023): Net income, Depreciation, Amortization, ΔInventories, ΔAR, ΔAP, Income tax payable (change), Net other cash flows → Change in operating WC (WC cash adj) + Operating cash flow; empty collapsed Balance changes. Share/Reload/Clear/feedback. Independent Phase 2 FX. FreeCashFlow / FCFF / Levered FCF siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96b` / subPillar null.
- **Formulas:** WC cash adj = −ΔInv −ΔAR +ΔAP +ΔTaxPayable (ending − beginning); OCF = NI + Dep + Amort + WC adj + Other. Tax payable is a change, not a stock balance. Negative results allowed; full precision with display rounding only.
- **Example:** NI 100,000 · Dep 20,000 · Amort 5,000 · ΔInv 8,000 · ΔAR 4,000 · ΔAP 6,000 · ΔTax 1,000 · Other 2,000 → WC adj −5,000 · OCF 122,000.
- **Important Files:** `frontend/src/tools/calculators/operating-cash-flow/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Margin With Discount Calculator
- **Summary:** Shipped Margin With Discount Calculator on existing catalog slug `margin-with-discount-calculator` (`MarginWithDiscountCalculator`, catalog `6af46f0fa27d8d1d4e98fff0`). Screenshot-first (ADR-023): Cost before discount FX; Base margin %; Base markup %; Base revenue FX (last-edited among margin/markup/revenue authoritative); Discount % → Price after discount FX, True margin %, True markup %, Profit FX. Share/Reload/Clear/feedback. Independent Phase 2 FX; percents never convert. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bda27d8d1d4e98f96a` / subPillar null.
- **Formulas:** Base Revenue = Cost/(1−Margin/100) or Cost×(1+Markup/100); Price After Discount = Revenue×(1−Discount/100); Profit = Price−Cost; True Margin = Profit/Price×100; True Markup = Profit/Cost×100. Cost ≥ 0; discount 0–100; margin < 100 when deriving revenue; full precision with display rounding only.
- **Example:** Cost 100 · margin 25% · discount 10% → revenue ≈ 133.33 · price 120 · profit 20 · true margin ≈ 16.67% · true markup 20%.
- **Important Files:** `frontend/src/tools/calculators/margin-with-discount/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Levered Free Cash Flow Calculator
- **Summary:** Shipped Levered Free Cash Flow Calculator on existing catalog slug `levered-free-cash-flow-calculator` (`LeveredFreeCashFlowCalculator`, catalog `6af46f0fa27d8d1d4e98fff6`). Screenshot-first (ADR-023): EBITDA FX, CapEx FX, Net change in WC FX, Mandatory debt repayments FX → Levered FCF FX. Simplified-estimate disclosure (not full FCFE; EBITDA excludes cash interest/taxes). Share/Reload/Clear/feedback. Independent Phase 2 FX. FreeCashFlowCalculator and FcffCalculator siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96b` / subPillar null.
- **Formulas:** Levered FCF = EBITDA − CapEx − ΔWC − Debt repayments. CapEx and debt repayments are positive outflows; negative ΔWC and negative results allowed; full precision with display rounding only.
- **Example:** EBITDA 500,000 · CapEx 120,000 · ΔWC 30,000 · Debt 50,000 → Levered FCF 300,000.
- **Important Files:** `frontend/src/tools/calculators/levered-free-cash-flow/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Hourly to Salary - Wage Calculator
- **Summary:** Shipped Hourly to Salary - Wage Calculator on existing catalog slug `hourly-to-salary-wage-calculator` (`HourlyToSalaryWageCalculator`, catalog `6af46f0fa27d8d1d4e990002`). Screenshot-first (ADR-023): Hourly wage FX ↔ Annual salary FX (last-edited authoritative); Hours/week default 40; Your wage as Daily/Monthly/Weekly/Biweekly FX; empty collapsed Other time intervals. Share/Reload/Clear/feedback. Independent Phase 2 FX; hours never convert. Hourly to Annual / Annual Salary per Hour / Overtime siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96c` / subPillar `6af46f0dae6d84bd3ef8f7cf`. Prompt sourced from sibling Overtime folder (Wage Calculator section); Overtime tool not developed.
- **Formulas:** Annual = Hourly × Hours/week × 52; Hourly = Annual ÷ (Hours/week × 52); Weekly = Hourly × Hours/week; Biweekly = Weekly × 2; Monthly = Annual ÷ 12; Daily = Weekly ÷ 5. Wages ≥ 0; hours > 0; full precision with display rounding only.
- **Example:** 500 PKR · 40h → weekly 20,000 · annual 1,040,000 · biweekly 40,000 · monthly ≈ 86,666.67 · daily 4,000.
- **Important Files:** `frontend/src/tools/calculators/hourly-to-salary-wage/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Hourly to Annual Salary Calculator
- **Summary:** Shipped Hourly to Annual Salary Calculator on existing catalog slug `hourly-to-annual-salary-calculator` (`HourlyToAnnualSalaryCalculator`, catalog `6af46f0fa27d8d1d4e990001`). Screenshot-first (ADR-023): Data — Hourly wage FX, Hours/week default 40, Days/week default 5; Results — Annual salary, Monthly pay, Per week, Per day (all FX). Share/Reload/Clear/feedback. Independent Phase 2 FX; hours/days never convert. Annual Salary / Annual to Monthly / Annual Salary per Hour siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar `6af451bea27d8d1d4e98f96c` / subPillar `6af46f0dae6d84bd3ef8f7cf`.
- **Formulas:** Weekly = Hourly × Hours/week; Annual = Weekly × 52; Monthly = Annual ÷ 12; Per day = Weekly ÷ Days/week. Hourly ≥ 0; hours/days > 0; full precision with display rounding only.
- **Example:** 500 PKR · 40h · 5d → weekly 20,000 · annual 1,040,000 · monthly ≈ 86,666.67 · daily 4,000.
- **Important Files:** `frontend/src/tools/calculators/hourly-to-annual-salary/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Future Salary Calculator
- **Summary:** Shipped Future Salary Calculator on existing catalog slug `future-salary-calculator` (`FutureSalaryCalculator`, catalog `6af46f0fa27d8d1d4e98fffa`). Screenshot-first (ADR-023): Future salary — Current salary FX, Average salary change %/yr, Number of years, Expected future salary FX; Real future salary — Average inflation %, Real future salary FX; Example 1 Career growth / Example 2 Inflation check. Share/Reload/Clear/feedback. Independent Phase 2 FX; growth/inflation/years never convert. Annual salary siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar/subPillar. Pillar `6af451bea27d8d1d4e98f96c` / subPillar null preserved.
- **Formulas:** Future = Current × (1 + Growth%/100)^Years; Real = Future ÷ (1 + Inflation%/100)^Years. Zero growth/inflation allowed; rates > −100%; years ≥ 0; full precision with display rounding only.
- **Example:** 100,000 PKR · 5%/yr · 10 years · inflation 2% → future ≈ 162,889.46 · real ≈ 133,598.45.
- **Important Files:** `frontend/src/tools/calculators/future-salary/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Free Cash Flow Calculator
- **Summary:** Shipped Free Cash Flow Calculator on existing catalog slug `free-cash-flow-calculator` (`FreeCashFlowCalculator`, catalog `6af46f0fa27d8d1d4e98fff3`). Screenshot-first (ADR-023): FCF = OCF − CapEx (CapEx as positive spending); collapsible per-share (shares → FCF/share); yield via market cap; margin via revenue; stock price optional consistency only. Share/Reload/Clear/feedback; how-to-use → `#how-to-use`. Independent Phase 2 FX; shares/% never convert. FcffCalculator untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar/subPillar. Pillar `6af451bea27d8d1d4e98f96b` / subPillar null preserved.
- **Formulas:** FCF = OCF − CapEx; FCF/Share = FCF ÷ shares (shares > 0); Yield (%) = FCF ÷ Market Cap × 100; Margin (%) = FCF ÷ Revenue × 100. Negative FCF/yield/margin allowed; stock price alone does not invent market cap.
- **Example:** OCF 500,000 · CapEx 120,000 → FCF 380,000; shares 100,000 → 3.80/share; market cap 3,800,000 → yield 10%; revenue 2,000,000 → margin 19%.
- **Important Files:** `frontend/src/tools/calculators/free-cash-flow/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add FCFF Calculator — Free Cash Flow to Firm
- **Summary:** Shipped FCFF Calculator on existing catalog slug `fcff-calculator-free-cash-flow-to-firm` (`FcffCalculator`, catalog `6af46f0fa27d8d1d4e98fff5`). Screenshot-first (ADR-023): Source radios Net income (default) / EBITDA / EBIT / CFO with dynamic source-value FX; Adjustments D&A / Interest / Corporate tax % / CapEx / ΔNWC with source-aware show/hide; Result FCFF FX. Share/Reload/Clear/feedback; how-to-use → `#how-to-use`. Independent Phase 2 FX; tax % never converts. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar/subPillar. Pillar `6af451bea27d8d1d4e98f96b` / subPillar null preserved.
- **Formulas:** NI: FCFF = NI + D&A + Interest×(1−T) − CapEx − ΔNWC; EBITDA: FCFF = EBITDA×(1−T) + D&A×T − CapEx − ΔNWC; EBIT: FCFF = EBIT×(1−T) + D&A − CapEx − ΔNWC; CFO: FCFF = CFO + Interest×(1−T) − CapEx (no ΔNWC). CapEx/ΔNWC positive outflows; negative FCFF allowed; tax 0–100%.
- **Example:** NI 100,000 · D&A 20,000 · Interest 10,000 · T 25% · CapEx 30,000 · ΔNWC 5,000 → FCFF 92,500.
- **Important Files:** `frontend/src/tools/calculators/fcff/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Assert self-check present in `calculation.test.ts` (execution omitted per task). Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Dividend Yield Calculator
- **Summary:** Shipped Dividend Yield Calculator on existing catalog slug `dividend-yield-calculator` (`DividendYieldCalculator`, catalog `6af46f0fa27d8d1d4e990007`). Screenshot-first (ADR-023): Annual dividends — Dividends per period FX, Dividend frequency (Annually/Semiannually/Quarterly/Monthly; selection required), Annual dividends FX output; Dividend yield — Share price FX, Dividend yield %. Share/Reload/Clear/feedback; how-to-use → `#how-to-use`. Independent Phase 2 FX; yield % and frequency never convert. DividendDiscountModelCalculator and DividendPayoutRatioCalculator untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar/subPillar. Pillar `6af451bea27d8d1d4e98f96e` / subPillar null preserved.
- **Formulas:** Annual Dividends = Dividends per Period × Payments per Year; Dividend Yield (%) = Annual Dividends ÷ Share Price × 100. Full precision with display rounding only. Zero dividends allowed (0% yield); share price must be > 0; unselected frequency blocks results.
- **Example:** 2.50 PKR quarterly / share price 100 PKR → annual 10.00 · yield 10%.
- **Important Files:** `frontend/src/tools/calculators/dividend-yield/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** DDM and DividendPayoutRatio siblings untouched. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Dividend Payout Ratio Calculator
- **Summary:** Shipped Dividend Payout Ratio Calculator on existing catalog slug `dividend-payout-ratio-calculator` (`DividendPayoutRatioCalculator`, catalog `6af46f0fa27d8d1d4e990006`). Screenshot-first (ADR-023): Main — Total dividends FX, Net income FX, Dividend payout ratio %; Per share — Declared DPS FX, Diluted EPS FX, payout per share %; empty collapsed Diluted earnings per share (no invented fields; DDM sibling has no diluted-EPS builder). Share/Reload/Clear/feedback. Independent Phase 2 FX; payout % never converts. Zero NI/EPS → undefined (error), not 0%; >100% and negative ratios allowed with explanation. DividendDiscountModelCalculator untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar/subPillar. Pillar `6af451bea27d8d1d4e98f96e` / subPillar null preserved.
- **Formulas:** Company payout (%) = Total Dividends ÷ Net Income × 100; Per-share payout (%) = Declared DPS ÷ Diluted EPS × 100. Full precision with display rounding only.
- **Example:** 40,000 / 100,000 → 40%; DPS 2 / diluted EPS 5 → 40%.
- **Important Files:** `frontend/src/tools/calculators/dividend-payout-ratio/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** DividendDiscountModelCalculator sibling untouched. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Annual to Monthly Salary Calculator
- **Summary:** Shipped Annual to Monthly Salary Calculator on existing catalog slug `annual-to-monthly-salary-calculator` (`AnnualToMonthlySalaryCalculator`, catalog `6af46f0fa27d8d1d4e98ffff`). Screenshot-first (ADR-023): Your salary — Annual salary FX + Hours/week default 40; Other wage measures — Monthly/Weekly/Daily/Hourly FX outputs; empty collapsed More wage measures (no invented fields). Assumptions disclosed: monthly = annual/12; weekly = annual/52; daily = annual/(52×5); hourly = annual/(52×hours). Share/Reload/Clear/feedback. Independent Phase 2 FX; hours never convert. Annual Salary and Annual Salary per Hour siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar/subPillar. Pillar `6af451bea27d8d1d4e98f96c` / subPillar `6af451bea27d8d1d4e98f96d` preserved.
- **Formulas:** Monthly = Annual/12; Weekly = Annual/52; Daily = Annual/(52×5); Hourly = Annual/(52×Hours Per Week). Positive hours; nonnegative annual; full precision with display rounding only.
- **Example:** 1,040,000 PKR annual · 40 h → monthly ≈ 86,666.67 · weekly 20,000 · daily 4,000 · hourly 500.
- **Important Files:** `frontend/src/tools/calculators/annual-to-monthly-salary/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** AnnualSalaryCalculator and AnnualSalaryPerHourCalculator siblings untouched. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Annual Salary per Hour Calculator
- **Summary:** Shipped Annual Salary per Hour Calculator on existing catalog slug `annual-salary-per-hour-calculator` (`AnnualSalaryPerHourCalculator`, catalog `6af46f0fa27d8d1d4e98fffe`). Screenshot-first (ADR-023): Hours/week default 40; enter any one of Hourly/Daily/Weekly/Monthly/Annual with independent FX — last-edited field authoritative; empty collapsed Other periods (no invented fields). Assumptions disclosed: annual hours = hours×52; weekly = annual/52; monthly = annual/12; daily = weekly/5. Share/Reload/Clear/feedback. Independent Phase 2 FX; hours never convert. Annual Salary Calculator sibling untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar/subPillar. Pillar `6af451bea27d8d1d4e98f96c` / subPillar `6af451bea27d8d1d4e98f96d` preserved.
- **Formulas:** Annual Hours = Hours/Week × 52; Annual = Hourly × Annual Hours; Weekly = Annual/52; Monthly = Annual/12; Daily = Weekly/5. Reverse paths derive annual first from the authoritative field. Positive hours; nonnegative wages; full precision with display rounding only.
- **Example:** 500 PKR hourly · 40 h → annual 1,040,000 · weekly 20,000 · daily 4,000 · monthly ≈ 86,666.67.
- **Important Files:** `frontend/src/tools/calculators/annual-salary-per-hour/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** AnnualSalaryCalculator sibling untouched. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Annual Salary Calculator
- **Summary:** Shipped Annual Salary Calculator on existing catalog slug `annual-salary-calculator` (`AnnualSalaryCalculator`, catalog `6af46f0fa27d8d1d4e98fffd`). Screenshot-first (ADR-023): Working hours/week default 40; Working weeks/year default 52; Hourly wage FX; Annual salary FX; Net salary — Tax default 12% (simplified flat-rate label only), Net hourly FX, Net annual FX. Share/Reload/Clear/feedback. Reused Discount/Credit Card UI/FX patterns without modifying Salary With Overtime sibling. Independent Phase 2 FX; hours, weeks, and tax % never convert. Activated via `npm run tool:assign` with `--set-active --set-indexable` and expected pillar/subPillar. Pillar `6af451bea27d8d1d4e98f96c` / subPillar `6af451bea27d8d1d4e98f96d` preserved.
- **Formulas:** Annual Salary = Hourly Wage × Hours Per Week × Weeks Per Year; Net Hourly = Hourly × (1 − Tax/100); Net Annual = Annual × (1 − Tax/100). Nonnegative hours/weeks/wage; tax 0–100%; full precision with display rounding only.
- **Example:** 500 PKR · 40 h · 52 wk · 12% → annual 1,040,000 · net hourly 440 · net annual 915,200.
- **Important Files:** `frontend/src/tools/calculators/annual-salary/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** SalaryWithOvertimeCalculator sibling untouched. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Double Discount Calculator
- **Summary:** Shipped Double Discount Calculator on existing catalog slug `double-discount-calculator` (`DoubleDiscountCalculator`, catalog `6af46f0fa27d8d1d4e98ffef`). Screenshot-first (ADR-023): Original price FX; 1st discount %; 2nd discount %; Final price FX; Total savings FX; collapsible Effective discount %. Share/Reload/Clear/feedback. Reused Discount Calculator UI/FX patterns without modifying that sibling. Independent Phase 2 FX; discount percents and effective % never convert. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Pillar `6af451bda27d8d1d4e98f96a` preserved; subPillar null.
- **Formulas:** Final Price = Original Price × (1 − D1/100) × (1 − D2/100); Total Savings = Original Price − Final Price; Effective Discount (%) = D1 + D2 − (D1 × D2 / 100). Clamp each discount 0–100%; nonnegative price; full precision with display rounding only.
- **Example:** 10,000 PKR · 20% · 20% → final 6,400 · savings 3,600 · effective 36% (not 40%).
- **Important Files:** `frontend/src/tools/calculators/double-discount/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** DiscountCalculator sibling untouched. Inline math self-check + assert suite in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-19 — Add Discount Calculator
- **Summary:** Shipped Discount Calculator on existing catalog slug `discount-calculator` (`DiscountCalculator`, catalog `6af46f0fa27d8d1d4e98ffed`). Screenshot-first (ADR-023): What type of discount? default **% off** only (no BOGO/fixed-$ invented); Original price FX; Discount %; Tax included? Yes (default) / No as informational price labeling only — no tax rate applied (no Simple Discount / project tax specs found); After discount: You pay + You're saving with independent FX. Share/Reload/Clear/feedback. No Simple Discount Calculator route in repo — link omitted. Independent Phase 2 FX; percent and Yes/No never convert. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Pillar `6af451bda27d8d1d4e98f96a` preserved; subPillar null.
- **Formulas:** Discount Amount = Original Price × Discount Rate / 100; Final Price = Original Price − Discount Amount; Savings = Discount Amount. Clamp discount 0–100%; nonnegative price; full precision with display rounding only.
- **Tax assumption:** Yes/No labels whether the entered original price already includes tax vs excludes tax; calculator does not add/remove/invent a tax percentage.
- **Example:** 10,000 PKR · 20% → you pay 8,000 · you're saving 2,000 (identical for Tax Yes or No).
- **Important Files:** `frontend/src/tools/calculators/discount/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** No SimpleDiscount / simple-discount-calculator module or route. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Credit Cards Payoff Calculator
- **Summary:** Shipped Credit Cards Payoff Calculator on existing catalog slug `credit-cards-payoff-calculator` (`CreditCardsPayoffCalculator`, catalog `6af46f0fa27d8d1d4e98ffec`). Screenshot-first (ADR-023): monthly budget default $500 (fixed USD — no currency selectors / no FX / not in `CURRENCY_CONVERSION_SLUGS`); 6-row card table with Card 1/2/3 prefilled and blank rows 4–6; Show more input fields adds rows; Calculate/Clear + Share/Reload/feedback. Results: duration, total interest, total paid, optimal order, per-card payoff months, collapsible monthly schedule. New `credit-cards-payoff/` module; Debt Avalanche / Credit Card Payoff siblings untouched. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Pillar `6af451bda27d8d1d4e98f969` preserved; subPillar null.
- **Formulas:** Monthly interest = balance × (APR/100/12); pay minimums on all active cards; apply surplus to highest APR; roll payment capacity when a card hits zero; never exceed monthly budget; stuck when budget cannot amortize within 1,200 months.
- **Example:** $500 · Card 1 $4,600 @ 18.99% / $100 · Card 2 $3,900 @ 19.99% / $90 · Card 3 $6,000 @ 15.99% / $120 → order Card 2→1→3 · 3y 2m · interest ≈ $4,471.20 · paid ≈ $18,971.20 · payoffs months 16/28/38.
- **Important Files:** `frontend/src/tools/calculators/credit-cards-payoff/*`, registry `keys`/`index`/`details`, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Distinct undeveloped catalog row from Credit Card Payoff / Debt Avalanche. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Credit Card Payoff Calculator
- **Summary:** Shipped Credit Card Payoff Calculator on existing catalog slug `credit-card-payoff-calculator` (`CreditCardPayoffCalculator`, catalog `6af46f0fa27d8d1d4e98ffeb`). Screenshot-simple (ADR-023): Credit card balance FX, Interest rate APR %/yr, Monthly payment FX; results Paid off after (yrs/mos/days) and Total paid FX. No min-payment drawers or repayment-mode radios. New `credit-card-payoff/` module (Credit Card / Interest / Minimum Payment / Payment siblings untouched). Independent Phase 2 FX. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Pillar `6af451bda27d8d1d4e98f969` preserved; subPillar null.
- **Formulas:** monthlyRate = APR/100/12; interest = balance × monthlyRate; newBalance = balance + interest − payment; payment ≤ interest → never pays off; final partial month days ≈ round((finalPayment / monthlyPayment) × 30); 0% APR → months = balance / payment with the same day proration.
- **Example:** 2,000 PKR · 18% · 100/mo → ≈ 1y 11m 29d · total ≈ 2,395.65 PKR.
- **Important Files:** `frontend/src/tools/calculators/credit-card-payoff/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Distinct undeveloped catalog row from Credit Card / Interest / Minimum Payment / Payment. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Credit Card Payment Calculator
- **Summary:** Shipped Credit Card Payment Calculator on existing catalog slug `credit-card-payment-calculator` (`CreditCardPaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ffea`). Screenshot mode: Monthly payment with specified payback term only. Specs: balance FX (default 1,000 PKR), due date, APR 18%, payback yrs/mos (default 1y 0m); collapsible Minimum payment & compound settings (min % 3, floor FX 25, flat / % + interest, compounding default Daily 360). Results: required monthly payment, years/months, payoff date, total paid, interest. New `credit-card-payment/` module (Credit Card / Interest / Minimum Payment siblings untouched). Independent Phase 2 FX. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Pillar `6af451bda27d8d1d4e98f969` preserved; subPillar null.
- **Formulas:** n = years×12+months; period rate from compounding (Monthly APR/12; Daily 360/365); Payment = Balance×r/(1−(1+r)^(−n)); 0% APR → Balance/n; schedule with final-installment adjust; payment floored to card minimum; payoff date = due + n×28 days.
- **Example:** 1,000 PKR · 18% · 1y 0m · Daily 360 · due 11/18/2026 → ≈ 91.74/mo · Oct 20, 2027 · total ≈ 1,100.91 · interest ≈ 100.91.
- **Important Files:** `frontend/src/tools/calculators/credit-card-payment/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Distinct undeveloped catalog row from Credit Card / Interest / Minimum Payment. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Credit Card Minimum Payment Calculator
- **Summary:** Shipped Credit Card Minimum Payment Calculator on existing catalog slug `credit-card-minimum-payment-calculator` (`CreditCardMinimumPaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ffe9`). Screenshot sections: Specifications (statement balance FX default 1,500 PKR, due date, APR 18%, unchecked capitalization checkbox — default Daily 360; frequency select only when checked); Payment setting (min floor FX 25, min % 3, flat / % + interest radios, monthly fix add-on FX 0). Results: years/months, payoff date, total paid, interest, summary. New `credit-card-minimum-payment/` module (Credit Card / Interest siblings untouched). Independent Phase 2 FX. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Pillar `6af451bda27d8d1d4e98f969` preserved; subPillar null.
- **Formulas:** Default interest (Daily 360) = Balance × ((1 + APR/360)^30 − 1); Flat % = max(Floor, Balance × %); % + interest = max(Floor, Balance × % + Interest); Scheduled = Minimum + Monthly fixed (add-on); New Balance = Balance + Interest − capped payment; payoff date = due date + months.
- **Example:** 1,500 PKR · 18% · min 25 / 3% flat · Daily 360 · due 11/18/2026 → 7y 2m on 01/18/2034 · total ≈ 2,510.83 · interest ≈ 1,010.83.
- **Important Files:** `frontend/src/tools/calculators/credit-card-minimum-payment/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Distinct undeveloped catalog row from Credit Card / Credit Card Interest. Assert self-check passed in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Credit Card Interest Calculator
- **Summary:** Shipped Credit Card Interest Calculator on existing catalog slug `credit-card-interest-calculator` (`CreditCardInterestCalculator`, catalog `6af46f0fa27d8d1d4e98ffe8`). Screenshot sections: Specifications (balance FX, APR %, fixed/minimum radios, monthly fixed FX, additional FX); collapsible Minimum payment & compounding (min % default 3, floor FX default 25, flat or % + interest radios, Monthly compounding). Results: years/months, total paid, total interest, summary text. Reuses verified Credit Card Calculator payoff patterns in a new `credit-card-interest/` module (sibling left untouched). Independent Phase 2 FX. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Pillar `6af451bda27d8d1d4e98f969` preserved; subPillar null.
- **Formulas:** Monthly interest (default) = Balance × APR / 1200; payment = fixed+additional or max(floor, %×balance [+ interest])+additional; New Balance = Balance + Interest − capped payment; never-pays-off when payment ≤ interest.
- **Example:** 2,000 PKR · 18% · fixed 100 · monthly → 2y 0m; total ≈ 2,395.65; interest ≈ 395.65.
- **Important Files:** `frontend/src/tools/calculators/credit-card-interest/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Distinct undeveloped catalog row from Credit Card Calculator (`6af46f0fa27d8d1d4e98ffe7`). Assert self-check written in `calculation.test.ts`. Mongo activated. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Repair Simple Savings Calculator registration
- **Summary:** Completed integration for existing Simple Savings Calculator module on catalog slug `simple-savings-calculator` (`SimpleSavingsCalculator`, catalog `6af46f0fa27d8d1d4e98ffe0`). Registered keys/lazy/details/`tool.key`, sitemap, and both `CURRENCY_CONVERSION_SLUGS` lists. Reuses verified Savings Calculator engine (`simple-savings/calculation.ts` → `savings/calculation.ts`). Independent Phase 2 FX already present in module; slug wiring completed. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Savings Calculator pillar preserved; subPillar null. No formula rewrite.
- **Important Files:** `frontend/src/tools/registry/{keys,index,details}.ts`, `frontend/src/app/sitemap.ts`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Mongo before: empty `componentKey`, A/D/I false. After assign: componentKey set, A/D/I true, embed on. Runtime FX/browser/lint/builds omitted per task. One local repair commit — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Bond YTM Calculator
- **Summary:** Shipped Bond YTM Calculator on existing catalog slug `bond-ytm-calculator` (`BondYtmCalculator`, catalog `6af46f0fa27d8d1d4e98ffd9`). Screenshot fields: face value FX, bond price FX, annual coupon rate %, coupon frequency (default Annually), years to maturity, read-only Yield to maturity (YTM) %. Coupon-date price equation solved with bounded bisection (zero-coupon closed form); same numerical approach as Bond Yield without modifying that module. Independent Phase 2 FX; normalize price into face currency; %/years never convert. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Bond Calculator pillar preserved; subPillar null. Left Bond Yield / Current Yield / Equivalent Yield / Bond Price peers untouched.
- **Formula:** P = Σ C/(1+y/m)^t + F/(1+y/m)^N with C = F·(r/m), N = years·m; solve annual nominal y.
- **Example:** 1,000 PKR · 950 PKR · 5% · Annually · 10 years → YTM ≈ 5.6687%.
- **Important Files:** `frontend/src/tools/calculators/bond-ytm/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Separate undeveloped catalog row from Bond Yield (`bond-yield-calculator`). Solver self-check via tsx sample. Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f966`). Lint/typecheck/build/Playwright omitted per user. One local commit — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Rental Commission Calculator
- **Summary:** Shipped Rental Commission Calculator on existing catalog slug `rental-commission-calculator` (`RentalCommissionCalculator`, catalog `6af46f0fa27d8d1d4e98ffe4`). Screenshot sections: Rental Details (annual/monthly rent FX sync); Commission (½ / 1 / 1½ month outputs FX); Custom commission (percent default 15%, amount FX). Preset fees use exact month fractions; custom = annual × % / 100. Independent Phase 2 FX; percent never converted. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Commission Calculator pillar preserved; subPillar null.
- **Formulas:** Annual = Monthly × 12; Monthly = Annual ÷ 12; Half = Monthly × 0.5; One = Monthly; 1½ = Monthly × 1.5; Custom = Annual × % / 100.
- **Example:** monthly 10,000 → half 5,000 · one 10,000 · 1½ 15,000; annual 120,000 × 15% → custom 18,000.
- **Important Files:** `frontend/src/tools/calculators/rental-commission/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding; distinct from Commission / Real Estate / Realtor VAT peers. Assert self-check in `calculation.test.ts` (label % ≠ engine fractions). Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f968`). Lint/typecheck/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Real Estate Commission Calculator
- **Summary:** Shipped Real Estate Commission Calculator on existing catalog slug `real-estate-commission-calculator` (`RealEstateCommissionCalculator`, catalog `6af46f0fa27d8d1d4e98ffe2`). Screenshot fields: house price FX, commission %, commission amount FX, owner receives FX; how-to-use help; Share/Reload/Clear/feedback. Formulas: Commission = Price × Rate / 100; Owner = Price − Commission. Independent Phase 2 FX; percent never converted; no taxes/closing costs. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Three local commits; no push. Left Commission / Rental / Realtor VAT / Sales / True Cost tools untouched.
- **Example:** 10,000,000 PKR · 2% → commission 200,000; owner 9,800,000.
- **Important Files:** `frontend/src/tools/calculators/real-estate-commission/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog undeveloped before coding. Assert self-check in `calculation.test.ts` (written; suite not run per task). Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f968`). Temporary files cleaned: YES.

### 2026-11-18 — Add Credit Card Calculator
- **Summary:** Shipped Credit Card Calculator on existing catalog slug `credit-card-calculator` (`CreditCardCalculator`, catalog `6af46f0fa27d8d1d4e98ffe7`). Screenshot sections: Specifications (balance FX, APR %, fixed/minimum repayment radios, monthly fixed FX, additional FX); collapsible Minimum payment & compounding (floor FX, min %, flat or % + interest, monthly/daily_365/daily_360 compounding). Results: years/months to payoff, total paid, total interest. Independent Phase 2 FX normalize money into balance currency. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Credit Card Calculator pillar preserved; subPillar null.
- **Formulas:** Monthly interest (default) = Balance × APR / 1200; payment = fixed+additional or max(floor, %×balance [+ interest])+additional; New Balance = Balance + Interest − capped payment; never-pays-off when payment ≤ interest.
- **Example:** 2,000 PKR · 18% · fixed 100 · monthly → 2y 0m; total ≈ 2,395.65; interest ≈ 395.65.
- **Important Files:** `frontend/src/tools/calculators/credit-card/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding. `calculation.test.ts` assert self-check passed. Mongo assign in delivery report. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Savings Withdrawal Calculator
- **Summary:** Shipped Savings Withdrawal Calculator on existing catalog slug `savings-withdrawal-calculator` (`SavingsWithdrawalCalculator`, catalog `6af46f0fa27d8d1d4e98ffdf`). Screenshot-first: how-long mode only, balance FX, first withdrawal date, withdrawal FX, annual rate, Advanced settings disclosure without invented fields. Monthly interest-first withdrawal simulation with partial final withdrawal and never-deplete guard. Independent Phase 2 FX normalize withdrawal into balance currency. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Savings Calculator pillar preserved; subPillar null.
- **Formulas:** r = (annual/100)/12; each period balance ← balance×(1+r) then withdraw min(PMT, balance); duration months = withdrawal count; last date = first + (n−1) months.
- **Example:** 100,000 PKR · 500/mo · 2% · first 2026-11-18 → 20y 4m · 244 withdrawals · total ≈ 121,740.97 · interest ≈ 21,740.97 · last Feb 18, 2047.
- **Important Files:** `frontend/src/tools/calculators/savings-withdrawal/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding. `calculation.test.ts` assert self-check passed. Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f967`). Lint/typecheck/build/Playwright omitted per user. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Bond Equivalent Yield Calculator
- **Summary:** Shipped Bond Equivalent Yield Calculator on existing catalog slug `bond-equivalent-yield-calculator` (`BondEquivalentYieldCalculator`, catalog `6af46f0fa27d8d1d4e98ffd6`). Screenshot fields: bond price FX, face value FX, days to maturity, read-only BEY %. Investment-basis formula with 365-day year; discount/par only; not bank discount yield, YTM, or current yield. Independent Phase 2 FX; days and BEY % never convert. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Bond Calculator pillar preserved; subPillar null.
- **Formula:** BEY (%) = ((Face Value − Bond Price) / Bond Price) × (365 / Days to Maturity) × 100.
- **Example:** 980 PKR · 1,000 PKR · 180 days → ≈ 4.138322%.
- **Important Files:** `frontend/src/tools/calculators/bond-equivalent-yield/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding (`6af46f0fa27d8d1d4e98ffd6`). `calculation.test.ts` assert self-check passed. Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f966`). Lint/typecheck/build/Playwright omitted per user. Single local commit — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add True Cost of Real Estate Commission Calculator
- **Summary:** Shipped True Cost of Real Estate Commission Calculator on existing catalog slug `true-cost-of-real-estate-commission-calculator` (`TrueCostOfRealEstateCommissionCalculator`, catalog `6af46f0fa27d8d1d4e98ffe6`). Screenshot-first property + mortgage + commission-cost sections with independent Phase 2 FX on money fields. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Commission Calculator pillar preserved; subPillar null.
- **Formulas:** Loan = Price − Down; Apparent = Price × Buyer%; Commission amount = Price × (Seller% + Buyer%); Loan commission = Amount × Loan/Price; monthly amortizing payments on loan and on loan-commission (r = annual/12); Real = (Amount − loan commission) + monthly commission × n.
- **Example:** 300,000 · 60,000 down · 6% seller · 0% buyer · 30y · 7.83% → loan 240,000; commission 18,000; loan commission 14,400; monthly ≈ 1,732.68; real ≈ 41,025.81.
- **Important Files:** `frontend/src/tools/calculators/true-cost-real-estate-commission/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding; distinct from Real Estate Commission Calculator (`6af46f0fa27d8d1d4e98ffe2`). Inline math self-check. Mongo activated. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Commission Calculator
- **Summary:** Shipped Commission Calculator on existing catalog slug `commission-calculator` (`CommissionCalculator`, catalog `6af46f0fa27d8d1d4e98ffe1`). Screenshot-first bidirectional solve among Sales Price, Commission Rate %, and Commission $. Fixed USD (no FX). Leave exactly one field blank. Distinct from Sales Commission Calculator (untouched). Activated via `npm run tool:assign` with `--set-active --set-indexable`. Commission Calculator pillar preserved; subPillar null.
- **Formulas:** Commission = Sales Price × Rate / 100; Rate = Commission / Sales Price × 100; Sales Price = Commission / (Rate / 100). Zero is filled, not blank; zero denominators rejected; nonnegative inputs only.
- **Example:** $200,000 · 3% · blank → $6,000.00 commission.
- **Important Files:** `frontend/src/tools/calculators/commission/*`, registry `keys`/`index`/`details`, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding; separate from Sales Commission (`6af46f0fa27d8d1d4e98ffe5`). `calculation.test.ts` assert self-check passed. Mongo activated. Lint/typecheck/build/Playwright omitted per user. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Realtor Commission Calculator with VAT
- **Summary:** Shipped Realtor Commission Calculator with VAT on existing catalog slug `realtor-commission-calculator-with-vat` (`RealtorCommissionVatCalculator`, catalog `6af46f0fa27d8d1d4e98ffe3`). Screenshot fields: house price FX, commission %, VAT rate %, commission gross FX, owner receives FX; collapsible net commission + VAT amount. VAT-exclusive commission on house price only. Independent Phase 2 FX; percentages never converted. Share/Reload/Clear/feedback. Activated via `npm run tool:assign`. Separate from undeveloped Commission Calculator and Real Estate Commission Calculator.
- **Why:** TOOL-415 delivery for Finance & Business Commission Calculator pillar.
- **Important Files:** `frontend/src/tools/calculators/realtor-commission-vat/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding (`6af46f0fa27d8d1d4e98ffe3`). Formula self-check: 250,000 / 3% / 20% → 7,500 / 1,500 / 9,000 / 241,000. Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f968`). Lint/builds/Playwright omitted per user. Three local commits — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Savings Plan Calculator
- **Summary:** Shipped Savings Plan Calculator on existing catalog slug `savings-plan-calculator` (`SavingsPlanCalculator`, catalog `6af46f0fa27d8d1d4e98ffde`). Screenshot-first: plan frequency (weekly default), duration, fixed/growing deposit vs given final balance, put-aside FX, repeatedly-increased-by FX. Principal-only arithmetic series; no invented interest. Responsive principal bar chart + period balances table. Independent Phase 2 FX; durations never convert. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Savings Calculator pillar preserved; subPillar null.
- **Formulas:** Total = n × A + G × n × (n − 1) / 2; target mode A = (T − G × n × (n − 1) / 2) / n. Chart final balance matches closed form.
- **Example:** weekly · 52 · A=100 · G=0 → 5,200 PKR; G=10 → 18,460 PKR.
- **Important Files:** `frontend/src/tools/calculators/savings-plan/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding. `calculation.test.ts` assert self-check passed. Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f967`). Lint/typecheck/build/Playwright omitted per user. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Private Savings Calculator
- **Summary:** Shipped Private Savings Calculator on existing catalog slug `private-savings-calculator` (`PrivateSavingsCalculator`, catalog `6af46f0fa27d8d1d4e98ffdc`). Screenshot fields: total income FX, taxes FX, consumption FX, include-additional-parameters checkbox (no invented extra fields), private savings FX. Formula Sp = Y − T − C; zero/negative (dissaving) supported. Independent Phase 2 FX normalize into result currency. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Savings Calculator pillar preserved; subPillar null.
- **Why:** TOOL-412 delivery for Finance & Business private-savings identity calculator.
- **Important Files:** `frontend/src/tools/calculators/private-savings/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding. `calculation.test.ts` assert self-check (15,000 savings; −10,000 dissaving; mixed USD/PKR with rates → 11,200 PKR; missing rates block). Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f967`). Lint/builds/Playwright omitted per user. Local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Savings Goal Calculator
- **Summary:** Shipped Savings Goal Calculator on existing catalog slug `savings-goal-calculator` (`SavingsGoalCalculator`, catalog `6af46f0fa27d8d1d4e98ffdd`). Screenshot sections: Saving objectives (goal FX, reach-at-age / in-years, ages, starting savings FX); Saving conditions (interest %, compounding, inflation %); Periodic contribution (frequency, begin/end timing, annual XOR periodic growth). Results narrative: required periodic contribution, total contributions, total return. Independent Phase 2 FX normalize starting into goal currency. Share/Reload/Clear/feedback. Activated via `npm run tool:assign` with `--set-active --set-indexable`. Savings Calculator pillar preserved; subPillar null.
- **Formulas:** Years from ages or direct years; Nominal Target = Goal × (1+f)^years; i = (1+r/m)^(m/k)−1; Starting FV = Starting × (1+i)^n; growing annuity factor (end) ((1+i)^n−(1+g)^n)/(i−g), beginning ×(1+i); PMT = Gap / factor; Total Return = Final − Starting − Contributions. Annual and periodic growth are mutually exclusive.
- **Example:** 1,000,000 PKR · ages 32→65 · 4% monthly · monthly end · no inflation/growth → ≈ 1,218.67 / month; contributions ≈ 482,594.94; return ≈ 517,405.06.
- **Important Files:** `frontend/src/tools/calculators/savings-goal/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding. `calculation.test.ts` assert self-check passed (screenshot PMT, zero rate, already-funded, begin vs end, inflation). Mongo assign in delivery report. Lint/type-check/build/Playwright omitted per task. Three local commits only — no push/pull/sync. Temporary files cleaned: YES.

### 2026-11-18 — Add Savings Calculator
- **Summary:** Shipped Savings Calculator on existing catalog slug `savings-calculator` (`SavingsCalculator`, catalog `6af46f0fa27d8d1d4e98ffda`). Screenshot-first: Savings balance goal, Interest rate / APY, initial savings FX, rate, yrs/mos, compound frequency, optional inflation + deposit growth, additional deposits FX with frequency and begin/end timing. Narrative APY/final/deposits/principal/interest results plus three-segment pie. Independent Phase 2 FX. Registry/sitemap/`CURRENCY_CONVERSION_SLUGS`/`tool.key.ts` complete. Three local commits (UI → calc/FX → integration); no push.
- **Formulas:** APY = (1 + r/m)^m − 1; nominal from APY r = m((1+APY)^(1/m)−1); compounding-grid ledger with prorated deposits and begin/end timing; Final = Initial + Deposits + Interest; real FV = FV/(1+i)^t when inflation on.
- **Example:** 1,000 PKR · 1.3% nominal · monthly · 6y · 100 PKR monthly begin → APY ≈ 1.3077%.
- **Important Files:** `frontend/src/tools/calculators/savings/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog undeveloped before coding. Assert self-check written in `calculation.test.ts` (not run per task). Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f967`) after transient Atlas timeouts blocked `tool:assign`. Temporary files cleaned: YES.

### 2026-11-18 — Add Bond Calculator
- **Summary:** Shipped Bond Calculator on existing catalog slug `bond-calculator` (`BondCalculator`, catalog `6af46f0fa27d8d1d4e98ffd3`). Coupon-date solver: leave exactly one of Price/Face/Yield/Maturity/Annual coupon blank; frequency annually–monthly; coupon % or USD. Fixed USD. Activated via `npm run tool:assign`.
- **Why:** TOOL-410 delivery for Finance & Business Bond Calculator pillar.
- **Important Files:** `frontend/src/tools/calculators/bond/*`, registries, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** `calculation.test.ts` assert self-check (screenshot ≈ $97.3270; zero yield; zero-coupon YTM; round-trips; validation). Mongo `isDeveloped`/`isActive`/`indexable` true, embed on. Lint/type-check/build/Playwright omitted per task. Temporary files cleaned: YES.

### 2026-11-18 — Add Bond Price Calculator
- **Summary:** Shipped Bond Price Calculator on existing catalog slug `bond-price-calculator` (`BondPriceCalculator`, catalog `6af46f0fa27d8d1d4e98ffd7`). Screenshot sections: Coupon per period (face FX, annual coupon rate %, frequency dropdown default Annually, coupon per period FX, annual coupon FX); Bond price (years to maturity, YTM %, bond price FX). Formulas: Annual Coupon = F×r; Coupon/period = F×r/m; P = Σ (F r/m)/(1+y/m)^t + F/(1+y/m)^N; zero-YTM limit P = C×N+F. Regular coupon-date (clean price) assumption; fractional periods rejected. Independent Phase 2 FX. Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Why:** TOOL-408 delivery for Finance & Business Bond Calculator pillar.
- **Important Files:** `frontend/src/tools/calculators/bond-price/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** `calculation.test.ts` assert self-check (par/semi-annual/zero coupon/zero YTM/premium/discount/fractional reject). Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f966`). Module path landed in `c301e742` during a concurrent staging race (wrong title); this commit records TOOL-408 Bond Price delivery. Lint/builds/browser/automated tests omitted per user. Temporary files cleaned: YES.

### 2026-11-18 — Add Bond Yield Calculator
- **Summary:** Shipped Bond Yield Calculator on existing catalog slug `bond-yield-calculator` (`BondYieldCalculator`, catalog `6af46f0fa27d8d1d4e98ffd8`). Screenshot-first YTM (not current yield): face value FX, bond price FX, annual coupon rate %, coupon frequency (Annually default), years to maturity, read-only bond yield %. Bounded bisection on coupon-date price equation; zero-coupon closed form; premium/discount/par/negative-yield; N = years×m must be a whole period count. Independent Phase 2 FX; normalize bond price into face currency before solve. Activated (`isDeveloped`/`isActive`/`indexable` true, embed on). Bond Calculator pillar preserved; subPillar null.
- **Why:** TOOL-407 delivery for Finance Bond Yield Calculator.
- **Important Files:** `frontend/src/tools/calculators/bond-yield/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Solver check: par 1000/1000/5%/10y annually → ≈5%; discount 950 → ≈5.6687%; zero-coupon 800/0%/10y → ≈2.2565%. Mongo `tool:assign` with `--set-active --set-indexable`. No lint/typecheck/build per task scope. Temporary files cleaned: YES.

### 2026-11-18 — Bond Convexity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Bond Convexity Calculator on existing catalog slug `bond-convexity-calculator` (`BondConvexityCalculator`, catalog `6af46f0fa27d8d1d4e98ffd4`). Screenshot sections: Coupon per period (face FX, rate %, frequency Annually default / Semi / Quarterly / Monthly, coupon per period FX, annual coupon FX); Bond price (years, YTM %, price FX); Bond convexity (yield differential %, dimensionless output). Independent Phase 2 FX. Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Formulas:** Coupon/Period = Face × Rate / m; Annual Coupon = Face × Rate; Bond Price = PV(coupons) + PV(face) at r = y/m; Finite-difference convexity = (P₋ + P₊ − 2P₀) / (P₀ (Δy)²) in annual-yield units (not analytic Macaulay). Zero coupon allowed; Δy=0 and 1+r≤0 rejected.
- **Example:** 1,000 PKR · 5% · Annually · 10y · YTM 5% · Δy 0.01% → coupons 50/50, price 1,000, convexity ≈ 74.9977.
- **Important Files:** `frontend/src/tools/calculators/bond-convexity/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Inline formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f966`). Lint/builds/browser/automated suite omitted per user. Local commits only — no push/pull/sync.

### 2026-11-18 — Add Third Stimulus Check Calculator – American Rescue Plan
- **Summary:** Shipped Third Stimulus Check Calculator – American Rescue Plan on existing catalog slug `third-stimulus-check-calculator-american-rescue-plan` (`AmericanRescuePlanStimulusCalculator`, catalog `6af46f0fa27d8d1d4e98ffd2`). Screenshot fields: filed 2019 or 2020 taxes, filing status, dependents, 2019/2020 AGI USD, read-only “According to the bill, you could receive”; historical EIP3 notice; Share/Reload/Clear/feedback. Fixed USD (no FX). Activated via `npm run tool:assign` with `--set-active --set-indexable`.
- **Why:** TOOL-404 delivery for historical American Rescue Plan / I.R.C. §6428B third Economic Impact Payment estimator.
- **Important Files:** `frontend/src/tools/calculators/american-rescue-plan-stimulus/*`, registries, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** `calculation.test.ts` assert self-check (single $75k→$1,400; $77.5k→$700; $80k→$0; married+2@$150k→$5,600; HoH+1@$112.5k→$2,800; no-filing→$0). Mongo assign confirmed `isDeveloped`/`isActive`/`indexable` true, embed on, pillar preserved. Full frontend lint/type-check/build not run per task restriction.
### 2026-11-18 — Add Bond Current Yield Calculator
- **Summary:** Shipped Bond Current Yield Calculator on existing catalog slug `bond-current-yield-calculator` (`BondCurrentYieldCalculator`, catalog `6af46f0fa27d8d1d4e98ffd5`). Screenshot sections: Annual coupon payment (face FX, frequency Annually/Semiannually/Quarterly/Monthly, coupon rate %, coupon per period FX, annual coupon FX); Bond current yield (bond price FX, current yield %). Formulas: Annual Coupon = Face × Rate/100; Coupon Per Period = Annual ÷ N; Current Yield (%) = Annual ÷ Price × 100. Independent Phase 2 FX; not YTM. Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Why:** TOOL-402 delivery for Finance & Business Bond Calculator pillar.
- **Important Files:** `frontend/src/tools/calculators/bond-current-yield/*`, registry `keys`/`index`/`details`, `CURRENCY_CONVERSION_SLUGS` (tools + embed pages), `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, brain docs.
- **Verification:** Catalog undeveloped before coding (`6af46f0fa27d8d1d4e98ffd5`). Formula self-check: 1,000 / 5% / Annually / 980 → 50 / 50 / ≈5.102%. Mongo activated (`isDeveloped`/`isActive`/`indexable` true, embed on, pillar `6af451bda27d8d1d4e98f966`). Lint/builds/browser/automated tests omitted per user. Single local commit per user request.

### 2026-11-18 — Add Price Per Liter to Price Per Gallon Converter
- **Summary:** Shipped Price Per Liter to Price Per Gallon Converter on existing catalog slug price-per-liter-to-price-per-gallon-converter (PricePerLiterToGallonConverter, catalog 6af46f17a27d8d1d4e990ad0). Bidirectional price-per-volume $/L↔$/gal using US liquid 3.785411784 L and Imperial 4.54609 L; denomination-only CurrencySelect (no FX); empty default; negatives rejected. Gallon Calculator pillar preserved; subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-467b delivery for Conversion and Units price-per-liter-to-gallon converter.
- **Important Files:** frontend/src/tools/calculators/price-per-liter-to-gallon/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 L→3.785411784 US gal; 1.5→5.678117676; 2 L→9.09218 imp; 4 US gal→≈1.05669/L; PKR 300→1135.6235352; zero; round-trip; validation). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d0a27d8d1d4e98f9e1). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Yard to Mile Converter
- **Summary:** Shipped Yard to Mile Converter on existing catalog slug yard-to-mile-converter (YardToMileConverter, catalog 6af46f17a27d8d1d4e990b0c). Bidirectional yd↔mi via exact 1 mi = 1,760 yd; Equivalence in other units (in/ft/cm/m/km); conversion diagram + chart; empty default; negatives rejected. Mile Conversion Calculator pillar preserved; subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-466b delivery for Conversion and Units yard-to-mile converter.
- **Important Files:** frontend/src/tools/calculators/yard-to-mile/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1760→1 mi; 880→0.5; 440→0.25; 500≈0.28409; 3 mi→5280 yd; 2.5→4400; other-units ft=5280; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e9). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Yard to Meter Converter
- **Summary:** Shipped Yard to Meter Converter on existing catalog slug yard-to-meter-converter (YardToMeterConverter, catalog 6af46f17a27d8d1d4e990ad8). Bidirectional yd↔m via exact international yard (1 yd = 0.9144 m); Other length units accordion (mm/cm/in/ft/km/mi via shared length engine); empty default; negatives rejected. Yard Conversion pillar preserved; subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-465b delivery for Conversion and Units yard-to-meter converter.
- **Important Files:** frontend/src/tools/calculators/yard-to-meter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/10/50/100/120 yd→m; 10 m→≈10.936 yd; 100 yd other-units ft=300; round-trip; negatives rejected; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d0a27d8d1d4e98f9e2). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Yards to Meters Conversion
- **Summary:** Shipped Yards to Meters Conversion on existing catalog slug yards-to-meters-conversion (YardsToMetersConversion, catalog 6af46f17a27d8d1d4e990ada). Bidirectional yd↔m via exact international yard (1 yd = 0.9144 m); two-field real-time sync; empty default; negatives rejected. Yard Conversion pillar preserved; subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-464b delivery for Conversion and Units yards-to-meters converter.
- **Important Files:** frontend/src/tools/calculators/yards-to-meters/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/10/25/100/120 yd→m; 1 m→≈1.093613298 yd; 50 m→≈54.68 yd; round-trip; negatives rejected; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d0a27d8d1d4e98f9e2). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Yard Conversion
- **Summary:** Shipped Yard Conversion on existing catalog slug yard-conversion (YardConversionCalculator, catalog 6af46f17a27d8d1d4e990ad2). Bidirectional yards↔imperial/metric via exact international yard (1 yd = 0.9144 m); Imperial/US (in/ft/mi + ft/in) and Metric (mm/cm/m + other nm–km); empty default; negatives rejected. Yard Conversion pillar preserved; subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-463b delivery for Conversion and Units yard conversion calculator.
- **Important Files:** frontend/src/tools/calculators/yard-conversion/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 yd→3 ft/36 in/0.9144 m; 100 yd→91.44 m; 1760 yd→1 mi; 2.5 yd→7 ft 6 in; 7+12 in normalize; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d0a27d8d1d4e98f9e2). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Weeks to Years Converter
- **Summary:** Shipped Weeks to Years Converter on existing catalog slug weeks-to-years-converter (WeeksToYearsConverter, catalog 6af46f17a27d8d1d4e990bc1). Bidirectional weeks↔years via average Gregorian year (365.2425 days ≈ 52.1775 weeks); Time in other units (yrs/mos/days/hrs/min/sec/HMS); canonical seconds; empty default; negatives rejected. Null pillar/subPillar preserved. isActive preserved true; **indexable left false**.
- **Why:** TOOL-462b delivery for Conversion and Units weeks-to-years converter.
- **Important Files:** frontend/src/tools/calculators/weeks-to-years/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/20/50/72 weeks→years; 3 years→156.5325 weeks; days; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Weeks to Months Calculator
- **Summary:** Shipped Weeks to Months Calculator on existing catalog slug weeks-to-months-calculator (WeeksToMonthsCalculator, catalog 6af46f17a27d8d1d4e990bc0). Bidirectional weeks↔months via average Gregorian month (≈4.348125 weeks / 30.436875 days); Other time units (yrs/days/hrs/min/sec/HMS); canonical seconds; empty default; negatives rejected. Null pillar/subPillar preserved. isActive preserved true; **indexable left false**.
- **Why:** TOOL-461b delivery for Conversion and Units weeks-to-months converter.
- **Important Files:** frontend/src/tools/calculators/weeks-to-months/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/6/13/14 weeks→months; 6 months→≈26.09 weeks; 13 weeks=91 days; 1 week=168 hrs; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add tsp to mL Converter
- **Summary:** Shipped tsp to mL Converter on existing catalog slug tsp-to-ml-converter (TspToMlConverter, catalog 6af46f17a27d8d1d4e990b72). Bidirectional tsp↔mL with metric default (5 mL), US customary (4.92892159375), US nutrition = metric; Other related units default cm³/cc; metric conversion chart; empty default; negatives rejected. Null pillar/subPillar preserved. isActive preserved true; **indexable left false**.
- **Why:** TOOL-460b delivery for Conversion and Units teaspoon-to-milliliter converter.
- **Important Files:** frontend/src/tools/calculators/tsp-to-ml/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/2/0.5/0.25 metric tsp; 15 mL→3 tsp; US customary; us_nutrition; cc identity; chart fractions; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add tsp to grams Converter
- **Summary:** Shipped tsp to grams Converter on existing catalog slug tsp-to-grams-converter (TspToGramsConverter, catalog 6af46f17a27d8d1d4e990b71). Density-based US/metric tsp↔g; Ingredient + Type lookup default Sugar / Granulated sugar / 845 kg/m³; custom density kg/m³|g/mL|g/cm³; density accordion expanded by default; empty measures; negatives and non-positive density rejected. Null pillar/subPillar preserved. isActive preserved true; **indexable left false**.
- **Why:** TOOL-459b delivery for Conversion and Units teaspoon-to-gram ingredient converter.
- **Important Files:** frontend/src/tools/calculators/tsp-to-grams/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (845 kg/m³→0.845 g/mL; 1/2 US tsp sugar; metric tsp; fractional; round-trip; zero density throws; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Tbsp to mL Converter
- **Summary:** Shipped Tbsp to mL Converter on existing catalog slug tbsp-to-ml-converter (TbspToMlConverter, catalog 6af46f17a27d8d1d4e990b70). Bidirectional tbsp↔mL with US (14.78676478125), metric (15), and Australian (20) tablespoon standards; More relevant units accordion; empty default; negatives rejected. Null pillar/subPillar preserved. isActive preserved true; **indexable left false**.
- **Why:** TOOL-458b delivery for Conversion and Units tablespoon-to-milliliter converter.
- **Important Files:** frontend/src/tools/calculators/tbsp-to-ml/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (2 US→29.5735…; 2 metric→30; 2 AU→40; 100 mL→≈6.76 US tbsp; 0.5 metric→7.5; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add tbsp to Grams Converter (with Ingredient Weights)
- **Summary:** Shipped tbsp to Grams Converter (with Ingredient Weights) on existing catalog slug tbsp-to-grams-converter-with-ingredient-weights (TbspToGramsConverter, catalog 6af46f17a27d8d1d4e990b6f). Density-based US tbsp↔g (US_TABLESPOON_ML = 14.78676478125); ingredient dropdown default Butter 0.959 g/mL; Show ingredient density checkbox (off by default); empty measures; negatives rejected. Null pillar/subPillar preserved. isActive preserved true; **indexable left false**.
- **Why:** TOOL-457b delivery for Conversion and Units ingredient weight converter.
- **Important Files:** frontend/src/tools/calculators/tbsp-to-grams/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (US tbsp volume; water 2 tbsp→29.5735…; butter 2 tbsp≈28.36 g; sugar round-trip; gramsPerTablespoon; zero; invalid density NaN; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Stone to lbs Converter
- **Summary:** Shipped Stone to lbs Converter on existing catalog slug stone-to-lbs-converter (StoneToLbsConverter, catalog 6af46f17a27d8d1d4e990b6e). Synchronized st↔lb with exact 1 st = 14 lb plus other mass units (default kg) via weight-converter `convertMass`; empty default; negatives rejected. Null pillar/subPillar preserved. isActive preserved true; **indexable left false**.
- **Why:** TOOL-456b delivery for Conversion and Units stone to lbs converter.
- **Important Files:** frontend/src/tools/calculators/stone-to-lbs/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/8/18/120 st→lb, 150 lb→≈10.7142857143 st, 10 st→63.5029318 kg, 14 lb→6.35029318 kg; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Stone to kg Converter
- **Summary:** Shipped Stone to kg Converter on existing catalog slug stone-to-kg-converter (StoneToKgConverter, catalog 6af46f17a27d8d1d4e990b6d). Bidirectional st↔kg with exact 1 st = 6.35029318 kg (shared KG_PER_STONE); stone-first fields; reverse-conversion notice; empty default; negatives rejected. Null pillar/subPillar preserved. isActive preserved true; **indexable left false**.
- **Why:** TOOL-455b delivery for Conversion and Units stone to kg converter.
- **Important Files:** frontend/src/tools/calculators/stone-to-kg/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/8/10/15 st→kg, 70 kg→≈11.0231 st, zero, round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Square Yard Converter
- **Summary:** Shipped Square Yard Converter on existing catalog slug square-yard-converter (SquareYardConverter, catalog 6af46f17a27d8d1d4e990ad7). Multi-unit yd²-base sync: primary yd², common ft²/m²/ac (open by default), other in²/cm²/mm²/km²/mi²/ha; empty default; negatives rejected. Reuses square-feet-converter `convertArea` (1 yd² = 0.83612736 m²). Yard Conversion pillar preserved (live 6af451d0…; task listed …d2…); subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-454b delivery for Conversion and Units square yard converter.
- **Important Files:** frontend/src/tools/calculators/square-yard-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 yd²→9 ft² / 0.83612736 m², 10→8.3612736 m², 1 acre→4840 yd², 100 yd²→100/4840 ac, 1296 in², round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d0a27d8d1d4e98f9e2). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Square Miles to Square km Converter
- **Summary:** Shipped Square Miles to Square km Converter on existing catalog slug square-miles-to-square-km-converter (SquareMilesToSquareKmConverter, catalog 6af46f17a27d8d1d4e990b0b). Bidirectional mi²↔km² with exact 1 mi² = 2.589988110336 km² ((1.609344)²); Other Area Conversion Units accordion; empty default; negatives rejected. Reuses square-feet-converter `convertArea` for extras. Mile Conversion Calculator pillar preserved (live 6af451d1…; task listed …d2…); subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-453b delivery for Conversion and Units square miles to square km converter.
- **Important Files:** frontend/src/tools/calculators/square-miles-to-square-km/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 mi²→2.589988110336 km², 10→25.89988110336, 40→103.59952441344, 100 km²→≈38.6102158542 mi²; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e9). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Square Meters to Square Feet Converter
- **Summary:** Shipped Square Meters to Square Feet Converter on existing catalog slug square-meters-to-square-feet-converter (SquareMetersToSquareFeetConverter, catalog 6af46f17a27d8d1d4e990b00). Bidirectional m²↔ft² with exact 0.09290304 / 10.7639104167…; Other Conversion Options accordion; empty default; negatives rejected. Reuses square-feet-converter `convertArea` for extras. Pillar/subPillar preserved (live pillar 6af451d1…). isActive preserved true; **indexable left false**.
- **Why:** TOOL-452b delivery for Conversion and Units square meters to square feet converter.
- **Important Files:** frontend/src/tools/calculators/square-meters-to-square-feet/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 m²≈10.7639104167 ft², 10 m²≈107.639104167, 100 ft²→9.290304, 250→23.22576; round-trip; 1 m²→10,000 cm²; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Square Meter Converter
- **Summary:** Shipped Square Meter Converter on existing catalog slug square-meter-converter (SquareMeterConverter, catalog 6af46f17a27d8d1d4e990ae2). Multi-unit area sync via m² base (m²/ft² primary + Other Area Units: in²/yd²/cm²/mm²/km²/ac/ha/mi²); empty default; negatives rejected. Reuses square-feet-converter `convertArea`. Meter Converter pillar preserved (live 6af451d0…); subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-451b delivery for Conversion and Units square meter converter.
- **Important Files:** frontend/src/tools/calculators/square-meter-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 m²≈10.7639104167 ft², 100 ft²→9.290304 m², cm²/mm²/ha/km²/acre factors; round-trip; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Square Inch to Square Foot Converter
- **Summary:** Shipped Square Inch to Square Foot Converter on existing catalog slug square-inch-to-square-foot-converter (SquareInchToSquareFootConverter, catalog 6af46f17a27d8d1d4e990b17). Bidirectional in²↔ft² with exact ×144; empty default; negatives rejected. Inch Converter pillar preserved; subPillar null. isActive preserved true; **indexable left false**.
- **Why:** TOOL-450b delivery for Conversion and Units square inch to square foot converter.
- **Important Files:** frontend/src/tools/calculators/square-inch-to-square-foot/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (144→1, 36→0.25, 72→0.5, 400≈2.7777777778, 2.5 ft²→360 in²; round-trip; negatives rejected; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2…, subPillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Square Feet to Acres Calculator
- **Summary:** Shipped Square Feet to Acres Calculator on existing catalog slug square-feet-to-acres-calculator (SquareFeetToAcresCalculator, catalog 6af46f17a27d8d1d4e990aff). Bidirectional ft²↔ac with exact 43,560; expandable Other area units (mm²/cm²/m²/km²/in²/yd²/ha/mi², default m²); empty default; negatives rejected. Reuses square-feet-converter area map for equivalents. Pillar/subPillar preserved (live pillar 6af451d1…). isActive preserved true; **indexable left false**.
- **Why:** TOOL-449b delivery for Conversion and Units square feet to acres calculator.
- **Important Files:** frontend/src/tools/calculators/square-feet-to-acres/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (43560→1 ac, 21780→0.5, 2 ac→87120, 10000≈0.2295684114; other units 43560 ft²→4046.8564224 m² / 4840 yd²; negatives rejected; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Square Feet Converter
- **Summary:** Shipped Square Feet Converter on existing catalog slug square-feet-converter (SquareFeetConverter, catalog 6af46f17a27d8d1d4e990afb). Bidirectional ft² ↔ selectable area units via square-meter base (mm²/cm²/m²/km²/in²/ft²/yd²/ac/ha/mi²); empty default; destination defaults to m²; unit change preserves ft². Pillar/subPillar preserved (live pillar 6af451d1…). Meta title 41 chars. isActive preserved true; **indexable left false**.
- **Why:** TOOL-448b delivery for Conversion and Units square feet converter.
- **Important Files:** frontend/src/tools/calculators/square-feet-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 ft²→0.09290304 m², 100→9.290304, 1→144 in², 9→1 yd², 43560→1 ac, 10 m²→≈107.64 ft²; negatives rejected; share text). Mongo assigned via npm run tool:assign without --set-indexable (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Square Centimeters to Square Millimeters Converter
- **Summary:** Shipped Square Centimeters to Square Millimeters Converter on existing catalog slug square-centimeters-to-square-millimeters-converter (SquareCmToSquareMmConverter, catalog 6af46f17a27d8d1d4e990b9b). Bidirectional cm²↔mm² with exact ×100; non-negative areas; empty default; guide/chart/FAQs/notation notes. Null pillar/subPillar preserved. Meta title trimmed to <=70. **isActive left false** (explicit). indexable left true.
- **Why:** TOOL-447b delivery for Conversion and Units area converter.
- **Important Files:** frontend/src/tools/calculators/square-cm-to-square-mm/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1→100, 5→500, 500→50000; reverse 100→1, 250→2.5; 0/decimals; negatives rejected; share text). Mongo assigned via npm run tool:assign without --set-active (isDeveloped true, isActive false, indexable true, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Seconds to Years Conversion
- **Summary:** Shipped Seconds to Years Conversion on existing catalog slug seconds-to-years-conversion (SecondsToYearsConversion, catalog 6af46f17a27d8d1d4e990bbd). Bidirectional seconds↔years with Gregorian mean year 365.2425 days (31,556,952 s); Other time units accordion (mo/wk/d/h/min + HMS); signed durations; empty default; guide/chart/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-446b delivery for Conversion and Units seconds-to-years converter.
- **Important Files:** frontend/src/tools/calculators/seconds-to-years/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (31556952→1, 63113904→2, negatives, 0.5 yr; months≈12; HMS 2h30m→9000; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Seconds to Minutes Converter
- **Summary:** Shipped Seconds to Minutes Converter on existing catalog slug seconds-to-minutes-converter (SecondsToMinutesConverter, catalog 6af46f17a27d8d1d4e990bbc). Bidirectional seconds↔minutes with exact 60 s/min; signed durations; empty default; guide/chart/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-445b delivery for Conversion and Units seconds-to-minutes converter.
- **Important Files:** frontend/src/tools/calculators/seconds-to-minutes/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (60→1, 120→2, 30→0.5, 78→1.3, negatives; minutes→seconds; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Seconds to Hours Converter
- **Summary:** Shipped Seconds to Hours Converter on existing catalog slug seconds-to-hours-converter (SecondsToHoursConverter, catalog 6af46f17a27d8d1d4e990bbb). Bidirectional seconds↔hours with exact 3,600 s/hour; editable HMS breakdown with signed durations; empty default; guide/chart/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-444b delivery for Conversion and Units seconds-to-hours converter.
- **Important Files:** frontend/src/tools/calculators/seconds-to-hours/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (3600→1, 7200→2, 1800→0.5, negatives, 1920≈0.5333; HMS 7260→2h1m; 1h45m30s→6330; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Seconds to Days Converter
- **Summary:** Shipped Seconds to Days Converter on existing catalog slug seconds-to-days-converter (SecondsToDaysConverter, catalog 6af46f17a27d8d1d4e990bba). Bidirectional seconds↔days with exact 86,400 s/day (24-hour day); signed durations; empty default; guide/chart/FAQs. Null pillar/subPillar preserved. Meta description trimmed to <=160. Meta title <=70. indexable left false.
- **Why:** TOOL-443b delivery for Conversion and Units seconds-to-days converter.
- **Important Files:** frontend/src/tools/calculators/seconds-to-days/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (86400→1, 172800→2, 43200→0.5, negatives, 1e6≈11.574074074; days→seconds; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Seconds Converter
- **Summary:** Shipped Seconds Converter on existing catalog slug seconds-converter (SecondsConverter, catalog 6af46f17a27d8d1d4e990bb9). Bidirectional seconds↔min/hr/day/wk/mo/yr with average Gregorian year/month (31,556,952 / 2,629,746 sec); HMS compound fields; Time in other units accordion; signed durations; guide/chart/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-442b delivery for Conversion and Units seconds multi-unit time converter.
- **Important Files:** frontend/src/tools/calculators/seconds-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (60/3600/86400/604800/yrs/mos; HMS 3665 and 90.5; negatives; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Radians to Degrees Converter
- **Summary:** Shipped Radians to Degrees Converter on existing catalog slug radians-to-degrees-converter (RadiansToDegreesConverter, catalog 6af46f17a27d8d1d4e990bff). Bidirectional rad↔deg via shared angle-conversion Math.PI helpers; default π rad = 180°; restricted π expression input; Other angle units accordion (gon/turns/′/″/mrad); signed angles preserved; guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-441b delivery for Conversion and Units radians↔degrees angle converter.
- **Important Files:** frontend/src/tools/calculators/radians-to-degrees/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (π/2/π/4/1/−π/2; reverse; extras; π expressions; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Quarts to Gallons Converter
- **Summary:** Shipped Quarts to Gallons Converter on existing catalog slug quarts-to-gallons-converter (QuartsToGallonsConverter, catalog 6af46f17a27d8d1d4e990ad1). Bidirectional quarts↔gallons with US/UK (+ US dry qt) selectors via shared volume engine; default 4 US qt = 1 US gal; Other relevant units accordion (cups/pt/fl oz/mL/L/UK); guide/table/FAQs. Live pillar 6af451d0a27d8d1d4e98f9e1 preserved (task screenshot listed …d2…); subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-440b delivery for Conversion and Units quarts↔gallons volume converter.
- **Important Files:** frontend/src/tools/calculators/quarts-to-gallons/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–10 qt; reverse; UK same-system; extras 16 cups/8 pt/128 fl oz; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, live pillar preserved). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add PSI to Inches of Water Conversion
- **Summary:** Shipped PSI to Inches of Water Conversion on existing catalog slug psi-to-inches-of-water-conversion (PsiToInchesOfWaterConversion, catalog 6af46f17a27d8d1d4e990aea). Bidirectional psi↔inH₂O via shared Pascal-base engine with conventional inH₂O at 4 °C (PASCALS_PER_INH2O = 249.08891); empty default; signed numerical values; unit-only (not gauge↔absolute); not inHg; guide/table/FAQs document temperature convention. Pillar 6af451d0a27d8d1d4e98f9e4 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-439b delivery for Conversion and Units PSI↔inH₂O pressure converter.
- **Important Files:** frontend/src/tools/calculators/psi-to-inches-of-water/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0/1/2/5/8/10/15/20/30/50/100 psi; reverse round-trips; negatives; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar preserved). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add PSI to ATM Conversion
- **Summary:** Shipped PSI to ATM Conversion on existing catalog slug psi-to-atm-conversion (PsiToAtmConversion, catalog 6af46f17a27d8d1d4e990af0). Bidirectional psi↔atm via shared Pascal-base engine; empty default; signed numerical values; unit-only (not gauge↔absolute); guide/table/FAQs. Pillar 6af451d1a27d8d1d4e98f9e5 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-438b delivery for Conversion and Units PSI↔ATM pressure converter.
- **Important Files:** frontend/src/tools/calculators/psi-to-atm/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0/1/10/100/1000 psi; 1/2/5 atm reverse; negatives; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar preserved). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add PSI Converter
- **Summary:** Shipped PSI Converter on existing catalog slug psi-converter (PsiConverter, catalog 6af46f17a27d8d1d4e990ae3). PSI-centered multi-field converter with expandable bar/atm/Pa and more units via shared Pascal-base engine; default 1 psi; signed values allowed; clarifies PSI vs PSIG/PSIA; guide/table/FAQs. Pillar 6af451d0a27d8d1d4e98f9e4 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-437b delivery for Conversion and Units PSI pressure converter.
- **Important Files:** frontend/src/tools/calculators/psi-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 psi↔Pa/kPa/bar/atm; bar/atm/kPa reverse; negatives; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar preserved). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pressure Unit Conversion
- **Summary:** Shipped Pressure Unit Conversion on existing catalog slug pressure-unit-conversion (PressureUnitConversion, catalog 6af46f17a27d8d1d4e990ba2). Multi-field bar/psi/atm/Pa plus expandable kPa/MPa/hPa/mbar/mmHg/Torr/inHg/kgf·cm⁻² via shared Pascal-base engine; default 1 bar; signed values allowed; guide/chart/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-436b delivery for Conversion and Units universal pressure converter.
- **Important Files:** frontend/src/tools/calculators/pressure-unit-conversion/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (bar/atm/MPa/kPa/psi; Torr≠mmHg; negatives; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pounds to Stone Converter
- **Summary:** Shipped Pounds to Stone Converter on existing catalog slug pounds-to-stone-converter (PoundsToStoneConverter, catalog 6af46f17a27d8d1d4e990b6a). Bidirectional lb↔st with exact 14 lb per st; default 14 lb; secondary mixed stone+pounds; rejects negative mass; guide/charts/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-435b delivery for Conversion and Units pounds↔stone mass converter.
- **Important Files:** frontend/src/tools/calculators/pounds-to-stone/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–210 lb forward; st reverse; mixed 150/128/168; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pounds to Ounces Converter
- **Summary:** Shipped Pounds to Ounces Converter on existing catalog slug pounds-to-ounces-converter (PoundsToOuncesConverter, catalog 6af46f17a27d8d1d4e990b69). Bidirectional lb↔oz with exact 16 oz per lb; default 1 lb; rejects negative mass; mass ounces only (not fl oz); guide/charts/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-434b delivery for Conversion and Units pounds↔ounces mass converter.
- **Important Files:** frontend/src/tools/calculators/pounds-to-ounces/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–100 lb forward; oz reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pounds to lbs Converter
- **Summary:** Shipped Pounds to lbs Converter on existing catalog slug pounds-to-lbs-converter (PoundsToLbsConverter, catalog 6af46f17a27d8d1d4e990b68). Bidirectional identity pound↔lb (factor 1); default 1; rejects negative mass; preserves raw decimal strings; guide/chart/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-433b delivery for Conversion and Units pounds↔lbs identity converter.
- **Important Files:** frontend/src/tools/calculators/pounds-to-lbs/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0/0.5/1/2/5/10/12.5/22.5/100/1000; reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pounds to Grams Converter
- **Summary:** Shipped Pounds to Grams Converter on existing catalog slug pounds-to-grams-converter (PoundsToGramsConverter, catalog 6af46f17a27d8d1d4e990b67). Bidirectional lb↔g with exact 453.59237 g per lb; default 1 lb; rejects negative mass; guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-432b delivery for Conversion and Units pounds↔grams mass converter.
- **Important Files:** frontend/src/tools/calculators/pounds-to-grams/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/2/3/5/10/0.5 lb; 500/1000 g reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pints to Gallons Converter
- **Summary:** Shipped Pints to Gallons Converter on existing catalog slug pints-to-gallons-converter (PintsToGallonsConverter, catalog 6af46f17a27d8d1d4e990acf). Four-field US/UK pt↔gal sync via shared volume-conversion engine; accordion Pints/Gallons groups; default 1 US pt; rejects negative volume; guide/table/FAQs. Pillar preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-431b delivery for Conversion and Units US/UK pint↔gallon converter.
- **Important Files:** frontend/src/tools/calculators/pints-to-gallons/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (same-system 8×; cross-system mL; reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, live pillar 6af451d0a27d8d1d4e98f9e1 preserved). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pints to Cups Converter
- **Summary:** Shipped Pints to Cups Converter on existing catalog slug pints-to-cups-converter (PintsToCupsConverter, catalog 6af46f17a27d8d1d4e990b65). Bidirectional pt↔cup via liter factors; default 1 US liquid pt = 2 US cups; US/UK/metric cup and US liquid/dry/imperial pint selectors; rejects negative volume; guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-430b delivery for Conversion and Units kitchen volume pint↔cup converter.
- **Important Files:** frontend/src/tools/calculators/pints-to-cups/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (US pt↔cups; imperial match; mismatched metric; negatives rejected; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pa to psi Converter
- **Summary:** Shipped Pa to psi Converter on existing catalog slug pa-to-psi-converter (PaToPsiConversion, catalog 6af46f17a27d8d1d4e990ae8). Bidirectional Pa↔psi via shared pressure-conversion engine (exact PASCALS_PER_PSI); empty default; signed gauge values; guide/table/FAQs. Live pillar 6af451d0a27d8d1d4e98f9e4 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-429b delivery for Conversion and Units pascal↔psi pair converter.
- **Important Files:** frontend/src/tools/calculators/pa-to-psi/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/1000/101325 Pa; 1/10/30/122 psi; negatives; reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, live pillar preserved). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Pascal Conversion
- **Summary:** Shipped Pascal Conversion on existing catalog slug pascal-conversion (PascalConversion, catalog 6af46f17a27d8d1d4e990ba0). Multi-unit Pa↔bar/atm/psi/Torr plus kPa/MPa/mbar/mmHg via shared pressure-conversion engine; empty default; signed gauge values; conventional mmHg distinct from Torr; guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-428b delivery for Conversion and Units pascal pressure converter.
- **Important Files:** frontend/src/tools/calculators/pascal-conversion/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (Pa↔kPa/bar/atm/Torr/MPa/psi; negatives; mmHg≠Torr; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Ounces to Milliliters Converter
- **Summary:** Shipped Ounces to Milliliters Converter on existing catalog slug ounces-to-milliliters-converter (OuncesToMillilitersConverter, catalog 6af46f17a27d8d1d4e990b60). Bidirectional US/UK fluid ounces↔mL with exact 29.5735295625 / 28.4130625 mL per fl oz; US/UK selector; default 1 US fl oz; rejects negative volume; fluid ounces only (not mass oz); guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-427b delivery for Conversion and Units fluid ounces↔milliliters volume converter.
- **Important Files:** frontend/src/tools/calculators/ounces-to-milliliters/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (US/UK fl oz→mL; 100 mL reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add oz to cc Converter
- **Summary:** Shipped oz to cc Converter on existing catalog slug oz-to-cc-converter (OzToCcConverter, catalog 6af46f17a27d8d1d4e990b62). Bidirectional US/UK fluid ounces↔cc with exact 29.5735295625 / 28.4130625 cc per fl oz; US/UK selector; default 1 US fl oz; rejects negative volume; fluid ounces only (not mass oz); guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-426b delivery for Conversion and Units fluid ounces↔cubic centimeters volume converter.
- **Important Files:** frontend/src/tools/calculators/oz-to-cc/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (US/UK fl oz→cc; 100 cc reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Ounce to kg Converter
- **Summary:** Shipped Ounce to kg Converter on existing catalog slug ounce-to-kg-converter (OunceToKgConverter, catalog 6af46f17a27d8d1d4e990b5e). Three-field oz↔kg↔lb with exact avoirdupois 1 oz = 0.028349523125 kg and 1 lb = 16 oz; default 16 oz; rejects negative mass; mass ounces only; guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-425b delivery for Conversion and Units ounce↔kilogram mass converter.
- **Important Files:** frontend/src/tools/calculators/ounce-to-kg/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–100 oz→kg; reverse kg/lb; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Ounces to Pounds Converter
- **Summary:** Shipped Ounces to Pounds Converter on existing catalog slug ounces-to-pounds-converter (OuncesToPoundsConverter, catalog 6af46f17a27d8d1d4e990b61). Three-field oz↔lb↔kg with exact avoirdupois 1 lb = 16 oz and 1 lb = 0.45359237 kg; default 16 oz; rejects negative mass; mass ounces only; guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-424b delivery for Conversion and Units ounces↔pounds mass converter.
- **Important Files:** frontend/src/tools/calculators/ounces-to-pounds/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–64 oz; reverse lb; 16/32 oz→kg; 1 kg reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Ounces to Grams Converter
- **Summary:** Shipped Ounces to Grams Converter on existing catalog slug ounces-to-grams-converter (OuncesToGramsConverter, catalog 6af46f17a27d8d1d4e990b5f). Bidirectional exact avoirdupois oz↔g (1 oz = 28.349523125 g); default 1 oz; rejects negative mass; troy/fluid-ounce informational note; guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-423b delivery for Conversion and Units ounces↔grams mass converter.
- **Important Files:** frontend/src/tools/calculators/ounces-to-grams/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–16 oz; 100/250 g reverse; 453.59237 g = 16 oz; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add nm to m Converter
- **Summary:** Shipped nm to m Converter on existing catalog slug nm-to-m-converter (NmToMConverter, catalog 6af46f17a27d8d1d4e990b12). Bidirectional exact SI nm↔m (1 nm = 10⁻⁹ m; 1 m = 1e9 nm); default 100 nm; signed values; scientific notation for tiny meters; guide/table/FAQs. Pillar 6af451d2a27d8d1d4e98f9ea preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-422b delivery for Conversion and Units nanometers↔meters pair converter.
- **Important Files:** frontend/src/tools/calculators/nm-to-m/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1–1e9 nm; reverse 1/0.1/0.001 m; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ea). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add nm converter
- **Summary:** Shipped nm converter on existing catalog slug nm-converter (NmConverter, catalog 6af46f17a27d8d1d4e990b0d). Nanometer-primary multi-unit length conversion via shared meter-converter engine (1 nm = 10⁻⁹ m); Metric/Imperial/Others accordions with selectors (default µm/mi/Å); empty default; signed values; scientific notation for tiny lengths; guide/table/FAQs. Pillar 6af451d2a27d8d1d4e98f9ea preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-421b delivery for Conversion and Units nanometer length converter.
- **Important Files:** frontend/src/tools/calculators/nm-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (nm↔µm/mm/m/Å; 1 in/ft; reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ea). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add ms to Seconds Converter
- **Summary:** Shipped ms to Seconds Converter on existing catalog slug ms-to-seconds-converter (MsToSecondsConverter, catalog 6af46f17a27d8d1d4e990bb8). Bidirectional exact 1 s = 1000 ms; Other Units accordion (yr/mo/wk/d/h/min + mixed HMS); average Gregorian year/month (365.2425 days); empty default; signed durations; guide/chart/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-420b delivery for Conversion and Units milliseconds↔seconds time converter.
- **Important Files:** frontend/src/tools/calculators/ms-to-seconds/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–7000 ms; reverse seconds; 1 min; mixed HMS 3723000 ms; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add MPa to psig Conversion
- **Summary:** Shipped MPa to psig Conversion on existing catalog slug mpa-to-psig-conversion (MpaToPsigConversion, catalog 6af46f17a27d8d1d4e990b23). Bidirectional exact MPa(g)↔psig via shared pressure-conversion Pa engine (~145.03773773 psig/MPa(g)); no atmospheric offset; rejects inaccurate ~130.34 absolute-with-atm factor; empty default; negative gauge allowed; guide/chart/FAQs on gauge vs absolute. Pillar 6af451d2a27d8d1d4e98f9ee preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-419b delivery for Conversion and Units megapascal gauge↔psig pressure converter.
- **Important Files:** frontend/src/tools/calculators/mpa-to-psig/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–100 MPa(g); 150/300/1000 psig reverse; negative gauge; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ee). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add MPa to PSI Conversion
- **Summary:** Shipped MPa to PSI Conversion on existing catalog slug mpa-to-psi-conversion (MpaToPsiConversion, catalog 6af46f17a27d8d1d4e990b22). Bidirectional exact MPa↔psi via shared pressure-conversion Pa engine (~145.03773773 psi/MPa); empty default; signed gauge values; guide/chart/FAQs. Pillar 6af451d2a27d8d1d4e98f9ee preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-418b delivery for Conversion and Units megapascal↔psi pressure converter.
- **Important Files:** frontend/src/tools/calculators/mpa-to-psi/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1–100 MPa; 150/240/1000 psi reverse; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ee). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add MPa Conversion
- **Summary:** Shipped MPa Conversion on existing catalog slug mpa-conversion (MpaConversion, catalog 6af46f17a27d8d1d4e990b20). Bidirectional MPa↔bar↔psi↔atm↔Torr via shared pressure-conversion Pa engine; other-units accordion; empty default; signed gauge values; guide/table/FAQs. Pillar 6af451d2a27d8d1d4e98f9ee preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-417b delivery for Conversion and Units megapascal pressure converter.
- **Important Files:** frontend/src/tools/calculators/mpa-conversion/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 MPa factors; bar/atm/Torr reverse; 1000 kPa=1 MPa; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ee). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add Months to Years Calculator
- **Summary:** Shipped Months to Years Calculator on existing catalog slug months-to-years-calculator (MonthsToYearsCalculator, catalog 6af46f17a27d8d1d4e990bb7). Bidirectional exact 1 year = 12 months; decimal years plus editable years+months breakdown with normalize; empty default; signed same-sign remainder; guide/table/FAQs distinguishing decimal years vs yr+mo. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-416b delivery for Conversion and Units months↔years duration converter.
- **Important Files:** frontend/src/tools/calculators/months-to-years/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–120 months; yearsMonths split/normalize; reverse years; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mm to m Conversion
- **Summary:** Shipped mm to m Conversion on existing catalog slug mm-to-m-conversion (MmToMConversion, catalog 6af46f17a27d8d1d4e990b99). Bidirectional exact 1 m = 1000 mm; more-length-units accordion (cm/km/in/ft/yd/mi); empty default; signed values; guide/table/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-415b delivery for Conversion and Units millimeters↔meters length converter.
- **Important Files:** frontend/src/tools/calculators/mm-to-m/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1–100000 mm; reverse m; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mm to km Conversion
- **Summary:** Shipped mm to km Conversion on existing catalog slug mm-to-km-conversion (MmToKmConversion, catalog 6af46f17a27d8d1d4e990b98). Bidirectional exact 1 km = 1,000,000 mm; other-units accordion (m/cm/in/ft/yd/mi); empty default; signed values; tiny km decimals preserved; guide/table/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-414b delivery for Conversion and Units millimeters↔kilometers length converter.
- **Important Files:** frontend/src/tools/calculators/mm-to-km/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1–1e6 mm; reverse km; 1 mm ≠ formatted 0; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mm to Inches Conversion
- **Summary:** Shipped mm to Inches Conversion on existing catalog slug mm-to-inches-conversion (MmToInchesConversion, catalog 6af46f17a27d8d1d4e990b97). Bidirectional exact 25.4 mm = 1 in; empty default; signed values; guide/table/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-413b delivery for Conversion and Units millimeters↔inches length converter.
- **Important Files:** frontend/src/tools/calculators/mm-to-inches/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (25.4/127/254 mm; reverse in; 20/100/150 mm; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mm to Foot Converter
- **Summary:** Shipped mm to Foot Converter on existing catalog slug mm-to-foot-converter (MmToFootConverter, catalog 6af46f17a27d8d1d4e990b96). Bidirectional exact 304.8 mm = 1 ft via meter-converter; selectable other unit (cm/m/km/in/yd/mi/µm); empty default; signed values; guide/table/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-412b delivery for Conversion and Units millimeters↔feet length converter.
- **Important Files:** frontend/src/tools/calculators/mm-to-foot/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (304.8/1219.2/2438.4 mm; reverse ft; 150/1000 mm; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mm to ATM Converter
- **Summary:** Shipped mm to ATM Converter on existing catalog slug mm-to-atm-converter (MmToAtmConverter, catalog 6af46f17a27d8d1d4e990aee). Bidirectional conventional 760 mmHg = 1 atm; clarifies catalog “mm” means mmHg pressure not length; empty default; signed gauge values; guide/table/FAQs. ATM Conversion pillar 6af451d1a27d8d1d4e98f9e5 preserved; subPillar null. Meta title <=70. indexable left false. Distinct from MmhgToAtmConversion.
- **Why:** TOOL-411b delivery for Conversion and Units mmHg↔atm pressure converter under ATM Conversion pillar.
- **Important Files:** frontend/src/tools/calculators/mm-to-atm/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (760/380/150/475 mmHg; reverse atm; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e5). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mm Calculator
- **Summary:** Shipped mm Calculator on existing catalog slug mm-calculator (MmCalculator, catalog 6af46f17a27d8d1d4e990b95). Bidirectional eight-unit length sync (mm/cm/m/km/in/ft/yd/mi) via meter-converter engine; Input + Metric + Imperial/US accordions; empty default; nonnegative lengths; guide/table/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false. Distinct from MillimeterCalculator.
- **Why:** TOOL-410b delivery for Conversion and Units millimeter multi-unit length calculator.
- **Important Files:** frontend/src/tools/calculators/mm-calculator/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (10 mm=1 cm; 1000 mm=1 m; 25.4 mm=1 in; reverse factors; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add MmHg to Atm Conversion
- **Summary:** Shipped MmHg to Atm Conversion on existing catalog slug mmhg-to-atm-conversion (MmhgToAtmConversion, catalog 6af46f17a27d8d1d4e990aef). Bidirectional conventional 760 mmHg = 1 atm (Torr-equivalent; CIPM mmHg noted distinct); empty default; signed gauge values; other units accordion via atm→Pa; guide/table/FAQs. ATM Conversion pillar 6af451d1a27d8d1d4e98f9e5 preserved (brief typo 6af451da… corrected); subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-409b delivery for Conversion and Units mmHg↔atm pressure converter.
- **Important Files:** frontend/src/tools/calculators/mmhg-to-atm/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–7600 mmHg; reverse atm; 760 mmHg → 101325 Pa; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e5). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mL to µL Conversion
- **Summary:** Shipped mL to µL Conversion on existing catalog slug ml-to-ul-conversion (MlToUlConversion, catalog 6af46f17a27d8d1d4e990b5d). Bidirectional exact mL↔µL (1 mL = 1000 µL) with accordion other volume units via volume-conversion engine; µL/uL labeled; empty default; guide/table/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-408b delivery for Conversion and Units mL↔microliter volume converter.
- **Important Files:** frontend/src/tools/calculators/ml-to-ul/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0.001–10 mL ↔ µL; reverse 1/24/500/1000 µL; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mL to tsp Converter
- **Summary:** Shipped mL to tsp Converter on existing catalog slug ml-to-tsp-converter (MlToTspConverter, catalog 6af46f17a27d8d1d4e990b5c). Two-field bidirectional volume (mL / US·metric·Imp tsp); reuses volume-conversion engine; added shared `impTsp` (imperial gallon/768); exact US tsp 4.92892159375 mL (not silently 5); metric 5 mL; US tsp default; empty default; US conversion table + metric distinction; guide/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-407b delivery for Conversion and Units mL↔teaspoon volume converter.
- **Important Files:** frontend/src/tools/calculators/ml-to-tsp/*, volume-conversion/types.ts, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1–40 mL US tsp; metric 5/10 mL; 1 US tsp; 3 US tsp = 1 US tbsp; Imperial tsp; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mL to tbsp Converter
- **Summary:** Shipped mL to tbsp Converter on existing catalog slug ml-to-tbsp-converter (MlToTbspConverter, catalog 6af46f17a27d8d1d4e990b5b). Three-field bidirectional volume (mL / US·metric·AU·Imp tbsp / accordion other units default US cup); reuses volume-conversion engine; added shared `impTbsp` (imperial gallon/256 = 17.7581640625 mL); exact US tbsp 14.78676478125 mL; empty default; guide/chart/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-406b delivery for Conversion and Units mL↔tablespoon volume converter.
- **Important Files:** frontend/src/tools/calculators/ml-to-tbsp/*, volume-conversion/types.ts, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/15/30 mL US+metric tbsp; 1 US tbsp; 1 AU tbsp; 1 US cup = 16 US tbsp; Imperial tbsp; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mL to oz Converter
- **Summary:** Shipped mL to oz Converter on existing catalog slug ml-to-oz-converter (MlToOzConverter, catalog 6af46f17a27d8d1d4e990b5a). Three-field bidirectional volume converter (mL / US·UK fl oz / other units); reuses volume-conversion engine; exact 1 US fl oz = 29.5735295625 mL and 1 UK fl oz = 28.4130625 mL; default mL / US fl oz / m³; empty default; fl oz labeled as volume not mass; guide/chart/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-405b delivery for Conversion and Units mL↔fluid ounce volume converter.
- **Important Files:** frontend/src/tools/calculators/ml-to-oz/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/100/250 mL → US fl oz; 8 US fl oz → mL; UK fl oz; L/m³/cm³; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mL to lbs Conversion
- **Summary:** Shipped mL to lbs Conversion on existing catalog slug ml-to-lbs-conversion (MlToLbsConversion, catalog 6af46f17a27d8d1d4e990b59). Density-based bidirectional volume↔mass; reuses ml-to-kg / kg-to-ml substance presets and density engine; default mass unit lb; exact 1 lb = 0.45359237 kg; lb = (mL × ρ) / 453592.37; density accordion; volume/mass unit selects; empty volume/mass default; water ≈ 1000 kg/m³; guide/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-404b delivery for Conversion and Units density-based mL↔lb converter.
- **Important Files:** frontend/src/tools/calculators/ml-to-lbs/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (water 250/500/1000 mL → lb; 1/2 lb → mL; custom 850/910 kg/m³; reverse; share text; zero density rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mL to kg Converter
- **Summary:** Shipped mL to kg Converter on existing catalog slug ml-to-kg-converter (MlToKgConverter, catalog 6af46f17a27d8d1d4e990b58). Density-based bidirectional volume↔mass; reuses kg-to-ml substance presets and mlToKg/kgToMl engine; substance/custom density; volume units mL/L/cm³/m³/US fl oz and mass units kg/g/mg/lb/oz; empty volume/mass default; water ≈ 1000 kg/m³; guide/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-403b delivery for Conversion and Units density-based mL↔kg converter.
- **Important Files:** frontend/src/tools/calculators/ml-to-kg/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (water 250–2000 mL; custom 850/1250/800 kg/m³; L unit; reverse 2.5 kg; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Add mL to cc Converter
- **Summary:** Shipped mL to cc Converter on existing catalog slug ml-to-cc-converter (MlToCcConverter, catalog 6af46f17a27d8d1d4e990b56). Synchronized mL / L / cc (cm³); exact 1 mL = 1 cc = 1 cm³ and 1 L = 1000 mL; empty default; non-negative volumes; guide/FAQs/table. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-402b delivery for Conversion and Units mL↔cc volume converter.
- **Important Files:** frontend/src/tools/calculators/ml-to-cc/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1–1000 mL = cc; liters 0.25/0.5/1/2.5; 0/0.5/0.001; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed.

### 2026-11-18 — Second Stimulus Check Calculator – $900 Billion Bill (Screenshot-First, historical EIP2)
- **Summary:** Shipped Second Stimulus Check Calculator – $900 Billion Bill on existing catalog slug `second-stimulus-check-calculator-900-billion-bill` (`SecondStimulus900BillionCalculator`, catalog `6af46f0fa27d8d1d4e98ffce`). Screenshot fields: filed 2019 taxes, filing status, kids, 2019 AGI USD, read-only result; historical EIP2 notice; Share/Reload/Clear/feedback. Fixed USD (no FX). Activated via `npm run tool:assign`.
- **Rules (verified):** I.R.C. §6428A / IRS Pub. 5475 / CRS IN11575 — $600 single or HoH, $1,200 married joint, +$600 per qualifying child under 17; phase out 5% of AGI above $75,000 / $112,500 / $150,000. Filing=No → $0 (SSI/VA/RRB automatic paths acknowledged in copy, not modeled). Not a currently available benefit.
- **Example:** Single · 0 kids · AGI $75,000 → $600; $81,000 → $300; Married · 2 kids · AGI $150,000 → $2,400; $198,000 → $0.
- **Important Files:** `frontend/src/tools/calculators/second-stimulus-900-billion/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check (`calculation.test.ts`). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated suite omitted per user. Local commits only — no push/pull/sync.

### 2026-11-18 — Deferred Payment Loan Calculator (Screenshot-First + FX)
- **Summary:** Shipped Deferred Payment Loan Calculator on existing catalog slug `deferred-payment-loan-calculator` (`DeferredPaymentLoanCalculator`, catalog `6af46f0fa27d8d1d4e98ffc7`). Screenshot sections: Loan inputs (estimation Loan term / Monthly payment, amount FX, balance date, term, rate, compounding, original monthly payment FX), Loan deferment (capitalized / paid monthly / equal parts / interest-free; increased original term / increased extended / original payment extended; deferment from; deferred months), Payment summary narrative + horizontally scrollable w/o def. vs Deferment* vs Diff. table. Independent Phase 2 FX (Margin Interest pattern). Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Formulas:** Equivalent monthly rate from compounding; amortizing M; deferment compounds or accrues per treatment; post-deferment re-amortize or solve n from original payment. Cash totals are economically correct (no double-count of capitalized interest). Zero rate and impossible amortization combinations return validation errors.
- **Example:** 100,000 PKR / 10y / 5% monthly / 12 mo capitalized / increased original term → original M ≈ 1,060.66; balance after ≈ 105,116.19; post M ≈ 1,210.65 over 108 payments.
- **Important Files:** `frontend/src/tools/calculators/deferred-payment-loan/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. Local tool commit `ad3d6e43` — no push/pull/sync.

### 2026-11-18 — Second Stimulus Check Calculator – HEROES Act (Screenshot-First, historical)
- **Summary:** Shipped Second Stimulus Check Calculator – HEROES Act on existing catalog slug `second-stimulus-check-calculator-heroes-act` (`HeroesActStimulusCalculator`, catalog `6af46f0fa27d8d1d4e98ffd0`). Screenshot fields: filing status, dependents, AGI, “You could receive”; historical House-passage / Senate-timing notice; additional-payments and HEALS-vs-HEROES unemployment links; Share/Reload/Clear/feedback. Fixed USD (no FX). Activated via `npm run tool:assign`.
- **Rules:** House-passed H.R. 6800 (CRS IN11513): base $1,200 single/HoH or $2,400 married; +$1,200 per dependent (any age under IRC §152) capped at three; 5% AGI phase-out above $75,000 / $112,500 / $150,000. Distinct from CARES ($500 under-17) and later enacted EIPs. All results labeled historical/hypothetical — not claimable today.
- **Example:** Single · 0 dependents · AGI $75,000 → $1,200; AGI $87,000 → $600; married · 3 dependents · AGI $150,000 → $6,000; fourth dependent still $6,000.
- **Important Files:** `frontend/src/tools/calculators/heroes-act-stimulus/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check file present (`calculation.test.ts`; not executed per user). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated suite omitted per user. Local commits only — no push/pull/sync.

### 2026-11-18 — Second Stimulus Check Calculator - CASH Act (Screenshot-First, historical)
- **Summary:** Shipped Second Stimulus Check Calculator - CASH Act on existing catalog slug `second-stimulus-check-calculator-cash-act` (`CashActStimulusCalculator`, catalog `6af46f0fa27d8d1d4e98ffcf`). Screenshot fields: filed 2019 taxes, filing status, dependents, 2019 AGI, “You will receive”; supplemental “How much more will you get?” with dependents under 17 and additional vs enacted $600 EIP. Fixed USD (no FX). Historical proposal notice. Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Rules:** H.R.9051 CASH Act (House-passed, not enacted): base $2,000 single/HoH or $4,000 married; +$2,000 per dependent any age; 5% AGI phase-out above $75,000 / $112,500 / $150,000. Additional = max(0, CASH total − enacted $600 EIP). Dependents under 17 cannot exceed total dependents. “No” on 2019 filing → $0 with eligibility note. All results labeled historical/hypothetical.
- **Example:** married · 2 under-17 dependents · AGI 150,000 → $8,000 CASH total; $2,400 enacted; $5,600 more.
- **Important Files:** `frontend/src/tools/calculators/cash-act-stimulus/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check (`calculation.test.ts`). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated suite omitted per user. Local commits only — no push/pull/sync.

### 2026-11-18 — Second Stimulus Check Calculator (HEALS Act) (Screenshot-First, historical)
- **Summary:** Shipped Second Stimulus Check Calculator (HEALS Act) on existing catalog slug `second-stimulus-check-calculator-heals-act` (`HealsActStimulusCalculator`, catalog `6af46f0fa27d8d1d4e98ffcd`). Screenshot fields: filed 2019 taxes, filing status, dependents, 2019 AGI, “You will receive”. Fixed USD (no FX). Historical proposal notice + verified HEROES Act / unemployment HEALS-vs-HEROES reference links. Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Rules:** July 2020 Senate GOP HEALS proposal (never enacted as written): base $1,200 single/HoH or $2,400 married; +$500 per dependent any age (no cap); 5% AGI phase-out above $75,000 / $112,500 / $150,000. “No” on 2019 filing → $0 with eligibility note. All results labeled historical/hypothetical.
- **Example:** Single · 0 dependents · AGI $75,000 → $1,200; AGI $87,000 → $600; HoH · 1 dependent · AGI $112,500 → $1,700.
- **Important Files:** `frontend/src/tools/calculators/heals-act-stimulus/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check (`calculation.test.ts`). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated suite omitted per user. Local commits only — no push/pull/sync.

### 2026-11-18 — Stimulus Check Calculator (40k Cap) (Screenshot-First, historical)
- **Summary:** Shipped Stimulus Check Calculator (40k Cap) on existing catalog slug `stimulus-check-calculator-40k-cap` (`StimulusCheck40kCalculator`, catalog `6af46f0fa27d8d1d4e98ffcb`). Screenshot fields: filing status, dependents, AGI USD, read-only result; historical HEROES / McConnell notice; Share/Reload/Clear/feedback. Fixed USD (no FX). Activated via `npm run tool:assign`.
- **Assumptions (verified / documented):** HEROES Act amounts $1,200 / $2,400 / $1,200×≤3 dependents (CRS). McConnell 2020-07-06 ~$40,000 cut-off; married doubled to $80,000 in the named 40k-cap model; HoH uses $40,000. Phase-out for a hard $40k regime was never specified → hard cut-off (full amount at/below cap, else $0). Not an active benefit.
- **Example:** Single · 0 deps · AGI $40,000 → $1,200; $40,001 → $0. Married · 3 deps · AGI $80,000 → $6,000.
- **Important Files:** `frontend/src/tools/calculators/stimulus-check-40k/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula smoke-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. Local commits only — no push/pull/sync.

### 2026-11-18 — Mortgage with Extra Payments Calculator (Screenshot-First + FX)
- **Summary:** Shipped Mortgage with Extra Payments Calculator on existing catalog slug `mortgage-with-extra-payments-calculator` (`MortgageWithExtraPaymentsCalculator`, catalog `6af46f0fa27d8d1d4e98ffca`). Screenshot fields: original schedule (amount FX, rate, term, interest method, due date); extra specification (payment frequency, periodic extra FX + start, lump-sum FX + paid-on); comparison table Original / With extra / Difference. Accelerated bi-weekly = half monthly every 14 days (26/yr) even with zero cash extras. Real Phase 2 FX; rates/dates never converted. Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Formulas:** Monthly M from amortizing formula; With-extra schedule uses selected frequency payment + periodic extras from start date + lump sum on/after paid-on; interest accrues each period before principal reduction.
- **Example:** 135,000 PKR / 20y / 4.5% Monthly / accelerated bi-weekly → original ≈ 854.08 monthly / 20 yrs / interest ≈ 69,978; with extra ≈ 427.04 bi-weekly / ≈ 17 yrs 7 mos / lower interest.
- **Important Files:** `frontend/src/tools/calculators/mortgage-with-extra-payments/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check (`calculation.test.ts`). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated suite omitted per user. Local commits only — no push.

### 2026-11-18 — California Stimulus Check II Calculator (Screenshot-First, historical)
- **Summary:** Shipped California Stimulus Check II Calculator on existing catalog slug `california-stimulus-check-ii-calculator` (`CaliforniaStimulusCheckIiCalculator`, catalog `6af46f0fa27d8d1d4e98ffcc`). Screenshot sections: historical GSS II notice; CA AGI + 2020 residency; Tax file SSN/ITIN, GSS I qualification, child dependent; payment method + tax filing date. Fixed USD (no FX). Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Rules:** FTB PSB 2021-18 / Cal. Welf. & Inst. Code §8150.2 — CA AGI $1–$75,000 (non-MFS), residency > half of 2020, filing by 2021-10-15 (ITIN extension note to 2022-02-15). Payments: $500 / $600 / $1,000 / $1,100; GSS I without dependents → ineligible. Timing guidance labeled historical; program complete (no new GSS payments since 2022-07-15).
- **Example:** CA AGI 50,000 · resident Yes · SSN · GSS I No · dependent Yes · DD · filed 2021-04-15 → $1,100 historical estimate.
- **Important Files:** `frontend/src/tools/calculators/california-stimulus-check-ii/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check (`calculation.test.ts`). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated suite omitted per user. Local commits only — no push/pull/sync.

### 2026-11-18 — Loan Payment Calculator (Screenshot-First + FX)
- **Summary:** Shipped Loan Payment Calculator on existing catalog slug `loan-payment-calculator` (`LoanPaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ffc9`). Screenshot fields: loan amount, annual rate, term yrs/mos, payment frequency (default Yearly), number of installments, periodic interest rate, periodic loan payment, loan payment total. Independent Phase 2 FX on three money selectors (Margin Interest pattern). Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Formulas:** n = round((years + months/12) × payments per year); r = (annual%/100) / payments per year; Payment = P×r/(1−(1+r)^(−n)); r=0 → P/n; Total = Payment × n. Full precision; display rounding only.
- **Example:** 100,000 PKR / 5% / 5y / Yearly → n=5; r=5%; Payment ≈ 23,097.48; Total ≈ 115,487.40.
- **Important Files:** `frontend/src/tools/calculators/loan-payment/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. Local commit only — no push/pull/sync.

### 2026-11-18 — Balloon Payment Calculator (Screenshot-First + FX)
- **Summary:** Shipped Balloon Payment Calculator on existing catalog slug `balloon-payment-calculator` (`BalloonPaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ffc4`). Screenshot fields: loan amount + currency, amortization yrs/mos, balloon after yrs/mos, interest %, compounding method. Narrative results: monthly payment, balloon, total repayment, total monthly payments, total interest. Real FX converts loan amount on currency change (Margin Interest pattern); rate/durations never converted. No charts or amortization tables. Activated via `npm run tool:assign`.
- **Formulas:** Effective monthly r from compounding; M = P×r/(1−(1+r)^(−N)); r=0 → P/N; Balloon = P(1+r)^K − M×((1+r)^K − 1)/r; r=0 → P − M×K; Total = M×K + Balloon; Interest = Total − P. Require 0 < K ≤ N.
- **Example:** 200,000 PKR / 20y / balloon after 5y / 7% monthly → M ≈ 1,550.60; balloon ≈ 172,513.25; total ≈ 265,549.12; interest ≈ 65,549.12.
- **Important Files:** `frontend/src/tools/calculators/balloon-payment/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. Local commit `b2d5a423` — no push/pull/sync.

### 2026-11-18 — California Stimulus Check II Calculator (Screenshot-First, historical)
- **Summary:** Shipped California Stimulus Check II Calculator on existing catalog slug `california-stimulus-check-ii-calculator` (`CaliforniaStimulusCheckIiCalculator`, catalog `6af46f0fa27d8d1d4e98ffcc`). Screenshot sections: historical GSS II notice; CA AGI + 2020 residency; Tax file SSN/ITIN, GSS I qualification, child dependent; payment method + tax filing date. Fixed USD (no FX). Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Rules:** FTB PSB 2021-18 / Cal. Welf. & Inst. Code §8150.2 — CA AGI $1–$75,000 (non-MFS), residency > half of 2020, filing by 2021-10-15 (ITIN extension note to 2022-02-15). Payments: $500 / $600 / $1,000 / $1,100; GSS I without dependents → ineligible. Timing guidance labeled historical; program complete (no new GSS payments since 2022-07-15).
- **Example:** CA AGI 50,000 · resident Yes · SSN · GSS I No · dependent Yes · DD · filed 2021-04-15 → $1,100 historical estimate.
- **Important Files:** `frontend/src/tools/calculators/california-stimulus-check-ii/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check (`calculation.test.ts`). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated suite omitted per user. Local commits only — no push/pull/sync.

### 2026-11-18 — Coupon Payment Calculator (Screenshot-First + FX)
- **Summary:** Shipped Coupon Payment Calculator on existing catalog slug `coupon-payment-calculator` (`CouponPaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ffc6`). Screenshot fields: face value + currency, annual coupon rate %, payments per annum, coupon payment + independent currency. Collapsible Current yield with market price (face currency) and current yield %. Real Phase 2 FX (Margin Interest pattern). Share/Reload/Clear/feedback. Activated via `npm run tool:assign`.
- **Formulas:** Annual Coupon = Face × Rate/100; Coupon Payment = Annual Coupon ÷ Payments Per Annum; Current Yield (%) = Annual Coupon ÷ Market Price × 100.
- **Example:** 1,000 PKR · 5% · 2 payments → coupon payment 25 PKR; market 980 → current yield ≈ 5.102%.
- **Important Files:** `frontend/src/tools/calculators/coupon-payment/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. Local commit only — no push/pull/sync.

### 2026-11-18 — Bi-Weekly Mortgage Payment Calculator (Screenshot-First + FX)
- **Summary:** Shipped Bi-Weekly Mortgage Payment Calculator on existing catalog slug `bi-weekly-mortgage-payment-calculator` (`BiWeeklyMortgagePaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ffc5`). Inputs: mortgage amount FX, term yrs/mos, rate, extra payment FX, optional points/fee/compounding checkbox. Payment summary: Comparison with dropdown + horizontally scrollable Monthly vs Bi-weekly table (payment, term, payoff date, total interest, total payments). Accelerated biweekly = half monthly every 14 days (26/yr). Independent Phase 2 FX; rates/term never converted. Did not modify Biweekly Mortgage Calculator. Activated.
- **Formulas:** M = P×r/(1−(1+r)^(-n)); biweekly payment = M/2; schedules accrue period interest then apply payment + extra principal.
- **Example:** 300,000 / 30y / 7.5% → monthly ≈ 2,097.64; biweekly ≈ 1,048.82; earlier payoff and lower interest.
- **Important Files:** `frontend/src/tools/calculators/bi-weekly-mortgage-payment/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-18 — Rent vs. Buy Calculator (Screenshot-First + FX)
- **Summary:** Shipped Rent vs. Buy Calculator on existing catalog slug `rent-vs-buy-calculator` (`RentVsBuyCalculator`, catalog `6af46f0fa27d8d1d4e98ffc2`). Screenshot sections: staying period + money you have; Rent (price/agent/other/deposit increase rate → rent cost + total); Buy (property, mortgage rate/term, mortgage left, buying/realtor commissions, other fees, appreciation → buy cost + total). Independent Phase 2 FX on money fields; percentages/durations never converted. Did not modify Rent Calculator or Rent or Buy Calculator. Activated.
- **Formulas:** Total rent = rent payments + agent + other − deposit interest; Total buy = down payment + buying commission + mortgage payments + other fees + realtor commission + mortgage left − future property value; periodic costs = total ÷ staying months.
- **Example:** 5y · 50k · rent 2k/mo · deposit 2% · property 300k @ 5%/30y · buy 4% · realtor 7% · fees 2.3% · appreciation 2% → total rent ≈ 114,746.05 vs total buy ≈ 98,556.53 (prefer buy).
- **Important Files:** `frontend/src/tools/calculators/rent-vs-buy/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

### 2026-11-18 — Rent Split Calculator (Screenshot-First + FX)
- **Summary:** Shipped Rent Split Calculator on existing catalog slug `rent-split-calculator` (`RentSplitCalculator`, catalog `6af46f0fa27d8d1d4e98ffc1`). Screenshot fields: total rent + currency, bedroom count radios (One/Two/Three), per-bedroom people with `person(s)` suffix. Results: per-bedroom share + per-person rent. Real FX converts total rent only; people counts unchanged. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Total People = Σ bedroom people; Per-Person = Total Rent ÷ Total People; Bedroom Share = (People ÷ Total People) × Total Rent. Zero total people → no calculation.
- **Example:** 30,000 PKR · Bedroom 1 = 1 · Bedroom 2 = 2 → per-person 10,000; shares 10,000 / 20,000.
- **Important Files:** `frontend/src/tools/calculators/rent-split/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check (`calculation.test.ts`). MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser omitted per user.

### 2026-11-18 — Payment Calculator (Screenshot-First)
- **Summary:** Shipped Payment Calculator on existing catalog slug `payment-calculator` (`PaymentCalculator`, catalog `6af46f0fa27d8d1d4e98ffc3`). Modes: Fixed Term (default) and Fixed Payments. Results: monthly payment, totals, principal/interest doughnut, annual/monthly amortization, repayment line chart. Share/Reload/Clear/feedback. Activated.
- **Formulas:** r = APR/1200; n = years×12; Payment = P·r/(1−(1+r)^(-n)); r=0 → P/n. Fixed Payments: n = ln(PMT/(PMT−P·r))/ln(1+r). Total interest = repayment − principal. Final installment clears balance.
- **Currency:** Fixed USD display — no currency selectors (screenshot has none).
- **Example:** $200,000 / 15y / 6% → $1,687.71/mo; 180 payments; total ≈ $303,788.46; interest ≈ $103,788.46.
- **Important Files:** `frontend/src/tools/calculators/payment/*`, registries, sitemap, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-payment-tool.ts`, `brain/*`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check matched screenshot. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

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
=======
### 2026-11-17 — Add Minutes to Years Conversion
- **Summary:** Shipped Minutes to Years Conversion on existing catalog slug minutes-to-years-conversion (MinutesToYearsConversion, catalog 6af46f17a27d8d1d4e990bb6). Bidirectional minutes↔average years via Julian 365.25-day year (525,960 min); Other Time Units accordion (mo/wk/d/h/s + HMS); empty default; signed durations; guide/FAQs/table. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-372b delivery for Conversion and Units minutes-to-years converter.
- **Important Files:** frontend/src/tools/calculators/minutes-to-years/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0/0.5/1/2 yr; 525960→365.25 d/8766 h/31557600 s/12 mo; 60/1440/10080; HMS 2h30m15s; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Minutes to Seconds Converter
- **Summary:** Shipped Minutes to Seconds Converter on existing catalog slug minutes-to-seconds-converter (MinutesToSecondsConverter, catalog 6af46f17a27d8d1d4e990bb5). Bidirectional minutes↔seconds plus combined min|sec (remainder in [0, 60)); exact 1 min = 60 s; empty default; signed durations; 1.5 min ≠ 1 min 50 sec clarified; guide/FAQs/table. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-371b delivery for Conversion and Units minutes-to-seconds converter.
- **Important Files:** frontend/src/tools/calculators/minutes-to-seconds/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0–60 min → sec; reverse 30/90/150/300/3600; combined 2:52→172, 4:30→270, 125→2:5; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Minutes to Decimal Calculator
- **Summary:** Shipped Minutes to Decimal Calculator on existing catalog slug minutes-to-decimal-calculator (MinutesToDecimalCalculator, catalog 6af46f17a27d8d1d4e990bb3). Clock minutes ↔ synchronized decimal Hours/Minutes/Seconds as equivalent expressions of one duration (not additive HMS); exact 1 h = 60 min = 3600 s; empty default; signed durations; clock vs decimal clarified (1:30 ≠ 1.30); guide/FAQs/table. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-370b delivery for Conversion and Units minutes-to-decimal converter.
- **Important Files:** frontend/src/tools/calculators/minutes-to-decimal/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0/1/15/30/45/60/75/90/120/150 min → hours; 15/30/60 min → sec; 1.75 h = 105 min; 2.5 h = 150 min; 1800 s = 0.5 h; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Minutes to Days Calculator
- **Summary:** Shipped Minutes to Days Calculator on existing catalog slug minutes-to-days-calculator (MinutesToDaysCalculator, catalog 6af46f17a27d8d1d4e990bb2). Bidirectional minutes↔days via exact 1 day = 1440 min; example presets 1440→1 day and 180→0.125 days; collapsed Other equivalent amounts (sec/hrs/wks + HMS); reuses hour-converter engine; empty default; non-negative durations; chart/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-369b delivery for Conversion and Units minutes-to-days converter.
- **Important Files:** frontend/src/tools/calculators/minutes-to-days/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1440/720/360/180/30/45/2880/10080 min → days; 2.5 days = 3600 min; sec/hrs/wks helpers; HMS 150.5 → 2h30m30s; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Minute Converter
- **Summary:** Shipped Minute Converter on existing catalog slug minute-converter (MinuteConverter, catalog 6af46f17a27d8d1d4e990bb1). Minutes-centered bidirectional time converter: primary minutes plus years/months/weeks/days/hours/seconds and compound HMS; reuses hour-converter Gregorian seconds engine; exact 1 h = 60 min, 1 d = 1440 min, 1 wk = 10080 min; average Gregorian year 525949.2 min / month 43829.1 min; empty default; non-negative durations; chart/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-368b delivery for Conversion and Units minute converter.
- **Important Files:** frontend/src/tools/calculators/minute-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 min = 60 s; 60/120 min → h; 1440 → day; 10080 → week; Gregorian year/month; reverse; HMS 90/135.5/0.5 min and 150.5 → 2h30m30s; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add mil to mm Conversion
- **Summary:** Shipped mil to mm Conversion on existing catalog slug mil-to-mm-conversion (MilToMmConversion, catalog 6af46f17a27d8d1d4e990b2b). Bidirectional mil↔mm via exact 1 mil = 0.0254 mm (meter-converter mil/mm); empty default; signed lengths; mil ≠ mm/mile/milliradian clarified; chart/FAQs. Pillar 6af451d3a27d8d1d4e98f9f0 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-367b delivery for Conversion and Units mil-to-mm converter under mil Conversion pillar.
- **Important Files:** frontend/src/tools/calculators/mil-to-mm/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/5/7/10/12/20/25/50/100/250/500/1000 mil → mm; reverse; 5000/127 mils per mm; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d3a27d8d1d4e98f9f0). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add mil to inch Conversion
- **Summary:** Shipped mil to inch Conversion on existing catalog slug mil-to-inch-conversion (MilToInchConversion, catalog 6af46f17a27d8d1d4e990b2a). Bidirectional mil↔in via exact 1 mil = 0.001 in (meter-converter mil/in); empty default; signed lengths; mil ≠ mm/mile/milliradian clarified; chart/FAQs. Pillar 6af451d3a27d8d1d4e98f9f0 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-366b delivery for Conversion and Units mil-to-inch converter under mil Conversion pillar.
- **Important Files:** frontend/src/tools/calculators/mil-to-inch/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1/10/20/60/100/250/500/1000 mil → in; reverse 0.001–1 in; mil≠mm via 0.0254; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d3a27d8d1d4e98f9f0). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Milliseconds Converter
- **Summary:** Shipped Milliseconds Converter on existing catalog slug milliseconds-converter (MillisecondsConverter, catalog 6af46f17a27d8d1d4e990bb0). ms-centered bidirectional time converter: core ms/s/min/h/d plus other-unit selector (ns/µs/weeks/fortnights/years); reuses time-unit Decimal seconds engine; exact 1 s = 1000 ms; empty default; signed durations; Julian 365.25-day year documented (shared engine, not fixed 365); chart/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-365b delivery for Conversion and Units milliseconds converter.
- **Important Files:** frontend/src/tools/calculators/milliseconds/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 ms = 0.001 s; 1000 ms = 1 s; 60000 ms = 1 min; 3600000 ms = 1 h; 86400000 ms = 1 day; reverse; 500/220/2500/120000/7200000 cases; 1 ms = 1000 µs; 1 week = 604800000 ms; Julian year ms; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Millimeter Calculator
- **Summary:** Shipped Millimeter Calculator on existing catalog slug millimeter-calculator (MillimeterCalculator, catalog 6af46f17a27d8d1d4e990b94). Multi-group mm hub: Imperial in/ft/mi + yd/fur/ch/rd, Metric cm/m/km + um/nm/dm/dam/hm; exact 1 mm = 0.001 m and 1 in = 25.4 mm; empty default; signed lengths; chart/FAQs. Pillar/subPillar null preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-364b delivery for Conversion and Units millimeter hub.
- **Important Files:** frontend/src/tools/calculators/millimeter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 mm = 0.1 cm / 0.001 m; 10 mm = 1 cm; 1000 mm = 1 m; 25.4 mm = 1 in; 304.8 mm = 1 ft; 914.4 mm = 1 yd; 1609344 mm = 1 mi; 50.8/127/2500 cases; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Mile Conversion Calculator
- **Summary:** Shipped Mile Conversion Calculator on existing catalog slug mile-conversion-calculator (MileConversionCalculator, catalog 6af46f17a27d8d1d4e990b07). Multi-group statute-mile hub: Metric km/m/cm + mm/um/nm, Imperial yd/ft + in/fur/ch/rd, Others ly/au/nmi + pc/solarRadius/angstrom; exact 1 mi = 1609.344 m; empty default; signed lengths; statute ≠ nautical clarified; chart/FAQs. Live pillar 6af451d1a27d8d1d4e98f9e9 preserved (brief typo …d2…); subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-363b delivery for Conversion and Units statute-mile hub.
- **Important Files:** frontend/src/tools/calculators/mile-conversion/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 mi = 1609.344 m; 1.609344 km; 5280 ft; 1760 yd; 63360 in; 10 mi = 16.09344 km; 60 mi = 96.56064 km; 1 km ≈ 0.621371192237 mi; 1 nmi ≈ 1.150779448 mi; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e9). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add mil Conversion
- **Summary:** Shipped mil Conversion on existing catalog slug mil-conversion (MilConversion, catalog 6af46f17a27d8d1d4e990b28). Multi-group mil-centered length converter: Metric µm/mm/cm + other selector, Imperial in/ft + yd/mi, Others nmi/solarRadius + Å/ly/au; exact 1 mil = 0.0000254 m = 25.4 µm; empty default; signed lengths; mil ≠ mm clarified; chart/FAQs. Pillar 6af451d3a27d8d1d4e98f9f0 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-362b delivery for Conversion and Units mil hub under mil Conversion pillar.
- **Important Files:** frontend/src/tools/calculators/mil-conversion/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 mil = 0.001 in; 1000 mil = 1 in; 1 mil = 25.4 µm; 100 mil = 2.54 mm; 1 mm ≈ 39.37007874 mil; signed; share text). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d3a27d8d1d4e98f9f0). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add micron to mil Conversion Calculator
- **Summary:** Shipped micron to mil Conversion Calculator on existing catalog slug micron-to-mil-conversion-calculator (MicronToMilConversionCalculator, catalog 6af46f17a27d8d1d4e990b29). Bidirectional µm↔mil via exact 1 mil = 25.4 µm (meter-converter um/mil); More options accordion mm/cm/m/in/nm; empty default; signed lengths allowed; mil ≠ mm clarified; chart/FAQs. Pillar 6af451d3a27d8d1d4e98f9f0 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-361b delivery for Conversion and Units micron-to-mil converter under mil Conversion pillar.
- **Important Files:** frontend/src/tools/calculators/micron-to-mil/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (25.4 µm = 1 mil; 254 µm = 10 mil; 40 mil = 1016 µm; 1000 µm ≈ 39.37007874 mil; reverse; convertLength parity; signed lengths). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d3a27d8d1d4e98f9f0). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add mg to teaspoon Converter
- **Summary:** Shipped mg to teaspoon Converter on existing catalog slug mg-to-teaspoon-converter (MgToTeaspoonConverter, catalog 6af46f17a27d8d1d4e990b55). Density-based bidirectional mg↔tsp; US tsp 4.92892159375 mL default (metric 5 mL); reuses mg-to-tablespoon density helpers/substances; Salt default ≈ 1.217 g/mL; empty mass/volume; medication-dose disclaimer; original guide/examples/FAQs. Pillar null preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-360b delivery for Conversion and Units milligrams-to-teaspoons converter.
- **Important Files:** frontend/src/tools/calculators/mg-to-teaspoon/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 US tsp water = 4928.92159375 mg; 1 US tsp salt @ 1.217 ≈ 5998.50 mg; 6000 mg salt ≈ 1.00025 US tsp; metric 5 mL; zero density/negatives rejected; density unit normalize). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add mg to tablespoon Converter
- **Summary:** Shipped mg to tablespoon Converter on existing catalog slug mg-to-tablespoon-converter (MgToTablespoonConverter, catalog 6af46f17a27d8d1d4e990b54). Density-based bidirectional mg↔tbsp; US tbsp 14.78676478125 mL default (metric 15 / Australian 20); Salt default ≈ 1.217 g/mL with density unit normalize; ingredient presets + custom; empty mass/volume; medication-dose disclaimer; original guide/examples/FAQs. Pillar null preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-359b delivery for Conversion and Units milligrams-to-tablespoons converter.
- **Important Files:** frontend/src/tools/calculators/mg-to-tablespoon/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 US tbsp water = 14786.76478125 mg; 1 US tbsp salt @ 1.217 ≈ 17994.49 mg; 10000 mg salt ≈ 0.55573 US tbsp; metric/Australian factors; zero density/negatives rejected; density unit normalize). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add mg to lbs Converter
- **Summary:** Shipped mg to lbs Converter on existing catalog slug mg-to-lbs-converter (MgToLbsConverter, catalog 6af46f17a27d8d1d4e990b52). Bidirectional mg↔lb via exact 1 lb = 453,592.37 mg; milligrams-first UI; empty default; negatives rejected; tiny positive values preserved; original guide/table/FAQs. Pillar null preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-358b delivery for Conversion and Units milligrams-to-pounds converter.
- **Important Files:** frontend/src/tools/calculators/mg-to-lbs/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (453592.37 mg = 1 lb; 1000 mg ≈ 0.00220462262185 lb; 500 mg ≈ 0.001102311310925 lb; 0.5 lb = 226796.185 mg; zero; negatives rejected; tiny values not formatted as 0). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add mg to cc Conversion
- **Summary:** Shipped mg to cc Conversion on existing catalog slug mg-to-cc-conversion (MgToCcConverter, catalog 6af46f17a27d8d1d4e990b51). Medication concentration vs substance density modes; 1 cc = 1 mL; custom concentration only (no clinical presets); water approx 1 g/mL; bidirectional mg↔cc; mg/5 mL and density unit normalization; medication safety notice; empty default; original guide/FAQs. Pillar null preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-357b delivery for Conversion and Units milligram-to-cubic-centimeter converter.
- **Important Files:** frontend/src/tools/calculators/mg-to-cc/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (200 mg @ 50 mg/mL = 4 cc; 100 mg/5 mL → 20 mg/mL → 200 mg = 10 cc; water 5000 mg = 5 cc; oil 920 mg @ 0.92 g/mL = 1 cc; zero/negative/missing factor guards). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Metric to Standard Converter
- **Summary:** Shipped Metric to Standard Converter on existing catalog slug metric-to-standard-converter (MetricToStandardConverter, catalog 6af46f17a27d8d1d4e990b06). Multi-field hub for length/area/mass/volume/temperature with accordion groups; US vs UK volume differentiated; temperature affine + absolute-zero guard; empty default; category switch clears values; original guide/charts/FAQs. Live Metric Converter pillar 6af451d1a27d8d1d4e98f9e8 preserved (brief typo …d2…); subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-356b delivery for Conversion and Units metric-to-standard hub under Metric Converter pillar.
- **Important Files:** frontend/src/tools/calculators/metric-to-standard/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 m = 100 cm; 1 in = 2.54 cm; 1 ft = 0.3048 m; 1 mi = 1.609344 km; area/mass/volume factors; US≠UK gallon; 0°C=32°F; 100°C=212°F; −40°C=−40°F; absolute-zero reject). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e8). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add lbs to Pounds Converter
- **Summary:** Shipped lbs to Pounds Converter on existing catalog slug lbs-to-pounds-converter (LbsToPoundsConverter, catalog 6af46f17a27d8d1d4e990b4a). Identity lbs↔pounds (factor 1); default 1/1; reload restores defaults; clear empties; identity text sync preserves typing precision; negatives rejected; original guide/chart/FAQs. Pillar null preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-355b delivery for Conversion and Units lbs/pounds identity converter.
- **Important Files:** frontend/src/tools/calculators/lbs-to-pounds/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1=1; 22=22; 22.5=22.5; 100=100; 125 reverse; zero; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add lbs to kg Converter
- **Summary:** Shipped lbs to kg Converter on existing catalog slug lbs-to-kg-converter (LbsToKgConverter, catalog 6af46f17a27d8d1d4e990b49). Bidirectional lb↔kg via exact 1 lb = 0.45359237 kg (reuses weight-converter KG_PER_POUND); pounds-first UI; empty default; negatives rejected; original guide/table/FAQs. Pillar null preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-354b delivery for Conversion and Units pounds-to-kilograms converter.
- **Important Files:** frontend/src/tools/calculators/lbs-to-kg/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 lb = 0.45359237 kg; 100 lb = 45.359237 kg; 125 lb = 56.69904625 kg; 50 kg ≈ 110.231131 lb; zero; negatives rejected; weight-converter cross-check). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add lbs to g Converter
- **Summary:** Shipped lbs to g Converter on existing catalog slug lbs-to-g-converter (LbsToGConverter, catalog 6af46f17a27d8d1d4e990b48). Bidirectional lb↔g via exact 1 lb = 453.59237 g; pounds-first UI; empty default; negatives rejected; original guide/table/FAQs. Pillar null preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-353b delivery for Conversion and Units pounds-to-grams converter.
- **Important Files:** frontend/src/tools/calculators/lbs-to-g/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 lb = 453.59237 g; 5 lb = 2267.96185 g; 0.5 lb = 226.796185 g; 500 g ≈ 1.10231131 lb; 1000 g ≈ 2.20462262 lb; zero; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Land Area Calculator
- **Summary:** Shipped Land Area Calculator on existing catalog slug land-area-calculator (LandAreaCalculator, catalog 6af46f17a27d8d1d4e990b8c). Rectangular Area = Length × Width with independent length units and area output units; optional collapsed Unit and total price (currency denomination only); empty default m/m/m²; negatives rejected; regional land units omitted. Pillar null preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-352b delivery for Conversion and Units rectangular land area and optional land price estimator.
- **Important Files:** frontend/src/tools/calculators/land-area/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (10×20 m = 200 m²; 40×60 ft = 2400 ft²; 10 ft × 20 m ≈ 60.96 m²; 100×200 m = 2 ha; 200 m² × $150 = $30,000; 2 ac × $25,000 = $50,000; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add KSI to PSI Conversion
- **Summary:** Shipped KSI to PSI Conversion on existing catalog slug ksi-to-psi-conversion (KsiToPsiConversion, catalog 6af46f17a27d8d1d4e990ae6). Bidirectional ksi↔psi via exact 1 ksi = 1,000 psi; empty default; signed gauge values allowed; no absolute/gauge offset; original guide/table/FAQs. Pillar 6af451d0a27d8d1d4e98f9e4 (PSI Converter) preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-351b delivery for Conversion and Units ksi-to-psi converter under PSI Converter pillar.
- **Important Files:** frontend/src/tools/calculators/ksi-to-psi/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 ksi = 1000 psi; 5 ksi = 5000 psi; 150 ksi = 150000 psi; 5000 psi = 5 ksi; 0.75 ksi = 750 psi; round-trip; negatives accepted). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d0a27d8d1d4e98f9e4). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add KSI to MPa Converter
- **Summary:** Shipped KSI to MPa Converter on existing catalog slug ksi-to-mpa-converter (KsiToMpaConverter, catalog 6af46f17a27d8d1d4e990b21). Bidirectional ksi↔MPa via pressure-conversion convertPressure (1 ksi = 1000 psi); empty default; signed gauge values allowed; no absolute/gauge offset; original guide/table/FAQs. Pillar 6af451d2a27d8d1d4e98f9ee (MPa Conversion) preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-350b delivery for Conversion and Units ksi-to-megapascal converter under MPa Conversion pillar.
- **Important Files:** frontend/src/tools/calculators/ksi-to-mpa/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 ksi ≈ 6.894757293168 MPa; 5 ksi ≈ 34.473786 MPa; 100 MPa ≈ 14.503774 ksi; round-trip; negatives accepted). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ee). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kPa to psi Conversion
- **Summary:** Shipped kPa to psi Conversion on existing catalog slug kpa-to-psi-conversion (KpaToPsiConversion, catalog 6af46f17a27d8d1d4e990b27). Bidirectional kPa↔psi via pressure-conversion convertPressure; empty default; signed gauge values allowed; no absolute/gauge offset; original guide/table/FAQs. Pillar 6af451d2a27d8d1d4e98f9ef preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-349b delivery for Conversion and Units kilopascal-to-psi converter under kPa Converter pillar.
- **Important Files:** frontend/src/tools/calculators/kpa-to-psi/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (100 kPa ≈ 14.503773773 psi; 30 psi ≈ 206.842718795 kPa; 40 kPa ≈ 5.801509509 psi; 15 psi ≈ 103.421359397 kPa; round-trip; negatives accepted). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ef). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kPa to mmHg Conversion
- **Summary:** Shipped kPa to mmHg Conversion on existing catalog slug kpa-to-mmhg-conversion (KpaToMmhgConversion, catalog 6af46f17a27d8d1d4e990b26). Bidirectional kPa↔mmHg via conventional 101.325 kPa = 760 mmHg (MMHG_PER_KPA = 760000/101325, Torr-equivalent — distinct from CIPM mmHg in pressure-conversion); empty default; signed gauge values allowed; no absolute/gauge offset; original guide/table/FAQs. Pillar 6af451d2a27d8d1d4e98f9ef preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-348b delivery for Conversion and Units kilopascal-to-mmHg converter under kPa Converter pillar.
- **Important Files:** frontend/src/tools/calculators/kpa-to-mmhg/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (101.325 kPa = 760 mmHg; 1 kPa ≈ 7.50061683 mmHg; 7 kPa ≈ 52.5043 mmHg; 30 mmHg ≈ 3.99967 kPa; round-trip; negatives accepted). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ef). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kPa to atm Conversion
- **Summary:** Shipped kPa to atm Conversion on existing catalog slug kpa-to-atm-conversion (KpaToAtmConversion, catalog 6af46f17a27d8d1d4e990b25). Bidirectional kPa↔atm via exact 1 atm = 101.325 kPa; reuses pressure-conversion convertPressure; empty default; signed gauge values allowed; no absolute/gauge offset; original guide/table/FAQs. Pillar 6af451d2a27d8d1d4e98f9ef preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-347b delivery for Conversion and Units kilopascal-to-atmosphere converter under kPa Converter pillar.
- **Important Files:** frontend/src/tools/calculators/kpa-to-atm/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (101.325 kPa = 1 atm; 2 atm = 202.65 kPa; 20 kPa ≈ 0.19738465 atm; 2.5 atm = 253.3125 kPa; round-trip; negatives accepted). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ef). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kPa Converter
- **Summary:** Shipped kPa Converter on existing catalog slug kpa-converter (KpaConverter, catalog 6af46f17a27d8d1d4e990b24). Primary kPa with expandable bar/psi/atm; reuses pressure-conversion convertPressure; exact 1 bar = 100 kPa and 1 atm = 101.325 kPa; signed gauge values allowed; no absolute/gauge offset; original guide/table/FAQs. Pillar preserved from live row; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-346b delivery for Conversion and Units kilopascal multi-unit pressure converter.
- **Important Files:** frontend/src/tools/calculators/kpa-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (100 kPa = 1 bar; 1 atm = 101.325 kPa; 100 kPa ≈ 14.503774 psi; 30 psi ≈ 206.842719 kPa; round-trip; negatives accepted). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add km to Feet Conversion
- **Summary:** Shipped km to Feet Conversion on existing catalog slug km-to-feet-conversion (KmToFeetConversion, catalog 6af46f17a27d8d1d4e990af5). Bidirectional km↔ft via exact 1 ft = 0.3048 m; Other length units accordion (mm/cm/m/in/yd/mi); reuses meter-converter convertLength; empty default; negatives rejected; original guide/table/FAQs. Live Feet Converter pillar 6af451d1a27d8d1d4e98f9e6 preserved (brief typo …d2…); subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-345b delivery for Conversion and Units kilometers↔feet converter under Feet Converter pillar.
- **Important Files:** frontend/src/tools/calculators/km-to-feet/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 km ≈ 3280.839895 ft; 5 km ≈ 16404.199475 ft; 1000 ft = 0.3048 km; 5000 ft = 1.524 km; round-trip; meter-converter cross-check; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e6). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Kilometers to Miles Calculator
- **Summary:** Shipped Kilometers to Miles Calculator on existing catalog slug kilometers-to-miles-calculator (KilometersToMilesCalculator, catalog 6af46f17a27d8d1d4e990b1e). Bidirectional km↔mi via exact 1 mi = 1.609344 km; reuses formatLength; empty default; negatives rejected; original guide/table/FAQs. Kilometer Calculator pillar 6af451d2a27d8d1d4e98f9ed preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-344b delivery for Conversion and Units kilometers↔miles pair converter under Kilometer Calculator pillar.
- **Important Files:** frontend/src/tools/calculators/kilometers-to-miles/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 km ≈ 0.6213711922 mi; 10 km ≈ 6.21371192 mi; 5 mi = 8.04672 km; marathon 42.195 km ≈ 26.2188 mi; round-trip; meter-converter cross-check; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Kilometer to Meter Converter
- **Summary:** Shipped Kilometer to Meter Converter on existing catalog slug kilometer-to-meter-converter (KilometerToMeterConverter, catalog 6af46f17a27d8d1d4e990b1d). Bidirectional km↔m via exact 1 km = 1000 m; reuses formatLength; empty default; negatives rejected; original guide/table/FAQs. Kilometer Calculator pillar 6af451d2a27d8d1d4e98f9ed preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-343b delivery for Conversion and Units kilometers↔meters pair converter under Kilometer Calculator pillar.
- **Important Files:** frontend/src/tools/calculators/kilometer-to-meter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 km = 1000 m; 2.5 km = 2500 m; 2.535 km = 2535 m; 7500 m = 7.5 km; round-trip; meter-converter cross-check; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Kilometer Calculator
- **Summary:** Shipped Kilometer Calculator on existing catalog slug kilometer-calculator (KilometerCalculator, catalog 6af46f17a27d8d1d4e990b1c). Eight synced fields in three accordions (Kilometer / Metric / Imperial-US); reuses meter-converter convertLength; exact SI and international mile factors; negatives rejected; original guide/table/FAQs. Pillar 6af451d2a27d8d1d4e98f9ed preserved; subPillar null. Meta title <=70. **isActive left false**; indexable left false.
- **Why:** TOOL-342b delivery for Conversion and Units multi-unit kilometer length converter (inactive until authorized).
- **Important Files:** frontend/src/tools/calculators/kilometer-calculator/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 km = 1000 m / 100000 cm / 1000000 mm; ≈0.6213711922 mi; ≈3280.839895 ft; 1 mi = 1.609344 km; round-trip; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive false preserved, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kg to Stones Converter
- **Summary:** Shipped kg to Stones Converter on existing catalog slug kg-to-stones-converter (KgToStonesConverter, catalog 6af46f17a27d8d1d4e990b46). Bidirectional kg↔st via exact 1 st = 6.35029318 kg (14 lb); reuses weight-converter KG_PER_STONE + formatMass; empty default; negative mass rejected; original guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-341b delivery for Conversion and Units kilograms↔stones pair converter.
- **Important Files:** frontend/src/tools/calculators/kg-to-stones/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 kg ≈ 0.15747304 st; 70 kg ≈ 11.023113 st; 10 st = 63.5029318 kg; 14 st = 88.90410452 kg; weight-converter cross-check; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kg to Ounce Converter
- **Summary:** Shipped kg to Ounce Converter on existing catalog slug kg-to-ounce-converter (KgToOunceConverter, catalog 6af46f17a27d8d1d4e990b45). Bidirectional kg↔avoirdupois oz via exact 1 oz = 0.028349523125 kg; Other units accordion with troy oz, pounds+ounces remainder normalization, and more-units selector; reuses weight-converter constants + formatMass; empty default; negative mass rejected; original guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-340b delivery for Conversion and Units kilograms↔ounces pair converter with related mass units.
- **Important Files:** frontend/src/tools/calculators/kg-to-ounce/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 kg ≈ 35.27396195 oz; 16 oz = 0.45359237 kg; 1 kg ≈ 32.15074657 oz t; 1 kg → 2 lb 3.27396195 oz; weight-converter cross-check; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kg to mL Converter
- **Summary:** Shipped kg to mL Converter on existing catalog slug kg-to-ml-converter (KgToMlConverter, catalog 6af46f17a27d8d1d4e990b44). Density-based bidirectional kg↔mL via kg/m³ canonical; Water default 1000 kg/m³; collapsible density lookup; substance presets (milk 1030, olive oil 918, honey 1420, …); Custom density with unit normalization; empty mass/volume; negatives/zero density rejected. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-339b delivery for Conversion and Units mass↔milliliters via density.
- **Important Files:** frontend/src/tools/calculators/kg-to-ml/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (water 1 kg = 1000 mL; milk 1 kg ≈ 970.87 mL; olive oil 2 kg ≈ 2178.65 mL; honey 1000 mL = 1.42 kg; density unit normalization; zero/negative rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kg to Liter Converter
- **Summary:** Shipped kg to Liter Converter on existing catalog slug kg-to-liter-converter (KgToLiterConverter, catalog 6af46f17a27d8d1d4e990b43). Density-based bidirectional kg↔L; Fresh water default ≈ 1 kg/L; substance presets (olive oil 0.918, milk 1.03, honey 1.42, …); Custom density with kg/L·g/mL·g/cm³·kg/m³ normalization; empty mass/volume; negatives/zero density rejected. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-338b delivery for Conversion and Units mass↔volume via density.
- **Important Files:** frontend/src/tools/calculators/kg-to-liter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (water 1 kg = 1 L; olive oil 5 kg ≈ 5.4466 L; honey 2 L = 2.84 kg; milk 10 kg ≈ 9.7087 L; density unit normalization; zero/negative rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kg to lbs Converter
- **Summary:** Shipped kg to lbs Converter on existing catalog slug kg-to-lbs-converter (KgToLbsConverter, catalog 6af46f17a27d8d1d4e990b42). Bidirectional kg↔lb via exact international avoirdupois pound (1 lb = 0.45359237 kg); reuses weight-converter KG_PER_POUND + formatMass; empty default; negative mass rejected; original guide/table/FAQs. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-337b delivery for Conversion and Units kilograms↔pounds pair converter.
- **Important Files:** frontend/src/tools/calculators/kg-to-lbs/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 kg ≈ 2.20462262 lb; 50 kg ≈ 110.23113 lb; 100 lb = 45.359237 kg; weight-converter cross-check; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add kg/cm² to PSI Converter
- **Summary:** Shipped kg/cm² to psi Converter on existing catalog slug kgcm-to-psi-converter (KgCmToPsiConverter, catalog 6af46f17a27d8d1d4e990ae5). Bidirectional kgf/cm²↔psi via exact 98,066.5 / 6,894.757293168 Pa factor; empty default; signed gauge values allowed; original guide/table/FAQs. Live PSI Converter pillar `6af451d0a27d8d1d4e98f9e4` preserved (brief listed `…d2…`; refuse overwrite). Meta title <=70. indexable left false.
- **Why:** TOOL-336b delivery for Conversion and Units kgf/cm²↔PSI pair converter.
- **Important Files:** frontend/src/tools/calculators/kgcm-to-psi/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 kgf/cm² ≈ 14.223343 psi; 7 ≈ 99.563403; 100 psi ≈ 7.030696 kgf/cm²; negatives accepted; round-trips). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d0a27d8d1d4e98f9e4). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Kelvin to Fahrenheit Converter
- **Summary:** Shipped Kelvin to Fahrenheit Converter on existing catalog slug kelvin-to-fahrenheit-converter (KelvinToFahrenheitConverter, catalog 6af46f17a27d8d1d4e990b1b). Bidirectional K↔°F with exact (K−273.15)×9/5+32 and reverse; equivalent 1.8K−459.67 forms verified; absolute-zero validation (0 K / −459.67°F); empty default; formatTemp reuse; original guide/table/FAQs. Fahrenheit Converter pillar preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-335b delivery for Conversion and Units Kelvin↔Fahrenheit pair converter.
- **Important Files:** frontend/src/tools/calculators/kelvin-to-fahrenheit/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0 K = −459.67°F; 273.15 K = 32°F; 300 K = 80.33°F; 310.15 K = 98.6°F; 373.15 K = 212°F; −459.67°F = 0 K; equivalent formula pairs; absolute-zero bounds). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9ec). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Kelvin to Celsius Converter
- **Summary:** Shipped Kelvin to Celsius Converter on existing catalog slug kelvin-to-celsius-converter (KelvinToCelsiusConverter, catalog 6af46f17a27d8d1d4e990b2e). Bidirectional K↔°C with exact ±273.15 offset; absolute-zero validation (0 K / −273.15°C); empty default; formatTemp reuse from kelvin-converter; original guide/table/FAQs. Celsius Converter pillar preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-334b delivery for Conversion and Units Kelvin↔Celsius pair converter.
- **Important Files:** frontend/src/tools/calculators/kelvin-to-celsius/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0 K = −273.15°C; 100 K = −173.15°C; 273.15 K = 0°C; 300 K = 26.85°C; 373.15 K = 100°C; 0°C = 273.15 K; 100°C = 373.15 K; −40°C = 233.15 K; absolute-zero bounds). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d3a27d8d1d4e98f9f1). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Kelvin Converter
- **Summary:** Shipped Kelvin Converter on existing catalog slug kelvin-converter (KelvinConverter, catalog 6af46f17a27d8d1d4e990bf3). Eight bidirectional scales (K/°C/°F/°R/°De/°N/°Ré/°Rø) reusing celsius-converter temperature engine; absolute-zero rejection at 0 K; Kelvin-first UI; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-333b delivery for Conversion and Units Kelvin temperature hub.
- **Important Files:** frontend/src/tools/calculators/kelvin-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (0 K = −273.15°C / −459.67°F; 273.15 K = 0°C / 32°F; 300 K ≈ 26.85°C / 80.33°F; 373.15 K = 100°C / 212°F; round-trips; below absolute zero rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Katha to Square Feet Converter
- **Summary:** Shipped Katha to Square Feet Converter on existing catalog slug katha-to-square-feet-converter (KathaToSquareFeetConverter, catalog 6af46f17a27d8d1d4e990afd). Verified regional factors only (Nepal 3645 ft² default; Bangladesh/West Bengal 720; Assam 2880; Patna/Gaya/Aurangabad 1361.25; Saran 1742.4). Bidirectional katha↔ft²↔m²; pending regions documented (Chhattisgarh, generic Bihar, Bigha). Pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-332b delivery for Conversion and Units regional katha land-area converter.
- **Important Files:** frontend/src/tools/calculators/katha-to-sqft/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (Nepal 1 katha = 3645 ft² / 338.6315808 m²; 2 katha = 7290 ft²; reverse; Bangladesh 720; Assam 2880; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e6, subPillar 6af46f0fae6d84bd3ef8f7e3). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add in to cm Converter
- **Summary:** Shipped in to cm Converter on existing catalog slug in-to-cm-converter (InToCmConverter, catalog 6af46f17a27d8d1d4e990b8a). Bidirectional inches↔centimeters with exact 2.54 factor; empty default; signed values; original guide/examples/table/FAQs; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-331b delivery for Conversion and Units inches ↔ centimeters converter.
- **Important Files:** frontend/src/tools/calculators/in-to-cm/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 in = 2.54 cm; 12 in = 30.48 cm; 22 in = 55.88 cm; 72 in = 182.88 cm; 100 in = 254 cm; reverse 2.54 cm = 1 in; 100 cm ≈ 39.37007874 in; registry cross-check). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar null). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Inch to Meter Calculator
- **Summary:** Shipped Inch to Meter Calculator on existing catalog slug inch-to-meter-calculator (InchToMeterCalculator, catalog 6af46f17a27d8d1d4e990b14). Bidirectional inches↔meters with exact 0.0254 factor; feet-and-inches related units with remainder normalization; empty default; signed values; original guide/examples/table/FAQs; Inch Converter pillar preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-330b delivery for Conversion and Units inches ↔ meters converter.
- **Important Files:** frontend/src/tools/calculators/inch-to-meter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 in = 0.0254 m; 12 in = 0.3048 m; 72 in = 1.8288 m; 100 in = 2.54 m; 1 m ≈ 39.37007874 in; 5 ft 8 in = 1.7272 m; 4 ft 12 in normalizes to 5 ft 0 in; registry cross-check). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9eb). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Inches to Yard Conversion
- **Summary:** Shipped Inches to Yard Conversion on existing catalog slug inches-to-yard-conversion (InchesToYardConversion, catalog 6af46f17a27d8d1d4e990ad6). Bidirectional inches↔yards with exact 36:1 factor; empty default; signed values; original guide/examples/table/FAQs; Yard Conversion pillar preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-329b delivery for Conversion and Units inches ↔ yards converter.
- **Important Files:** frontend/src/tools/calculators/inches-to-yards/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (36 in = 1 yd; 72 in = 2 yd; 180 in = 5 yd; 18 in = 0.5 yd; reverse 5 yd = 180 in; registry cross-check; negatives/empty/NaN). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d0a27d8d1d4e98f9e2). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Inch Converter
- **Summary:** Shipped Inch Converter on existing catalog slug inch-converter (InchConverter, catalog 6af46f17a27d8d1d4e990b13). Primary inches + Metric/Imperial/Others (nmi, IAU solar radius, Julian ly) reusing meter-converter length engine; signed values allowed; empty default; Conversion & Units pillar preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-328b delivery for Conversion and Units inch length converter.
- **Important Files:** frontend/src/tools/calculators/inch-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 in = 25.4 mm / 2.54 cm / 0.0254 m; 12 in = 1 ft; 63360 in = 1 mi; reverse cm/mm/ft/yd/mi; nmi/ly/solarRadius finite). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d2a27d8d1d4e98f9eb). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Imperial to Metric Conversion
- **Summary:** Shipped Imperial to Metric Conversion on existing catalog slug imperial-to-metric-conversion (ImperialToMetricConversion, catalog 6af46f17a27d8d1d4e990b02). Branded wrapper over Imperial Calculator shared measurement hub (no duplicated conversion constants); original guide/tables/FAQs; Metric Converter pillar preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-327b delivery for Conversion and Units Metric Converter pillar imperial↔metric page.
- **Important Files:** frontend/src/tools/calculators/imperial-to-metric/*, imperial/ImperialCalculator branding props, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** imperial-to-metric + imperial calculation.test.ts passed. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false, pillar 6af451d1a27d8d1d4e98f9e8). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Imperial Calculator
- **Summary:** Shipped Imperial Calculator on existing catalog slug imperial-calculator (ImperialCalculator, catalog 6af46f17a27d8d1d4e990bd5). Multi-category Length/Area/Volume/Mass/Temperature converter reusing length/area/volume/weight/temperature unit registries; US vs Imperial gallons distinct; Kelvin temperature with absolute-zero guard; category switch clears values; empty default; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-326b delivery for Conversion and Units Imperial/US ↔ metric hub.
- **Important Files:** frontend/src/tools/calculators/imperial/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (12 in = 1 ft; 1 US gal = 3.785411784 L; 1 Imp gal = 4.54609 L; 1 lb = 0.45359237 kg; 0°C = 32°F; 0 K absolute-zero bound). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Hours to Years Converter
- **Summary:** Shipped Hours to Years Converter on existing catalog slug hours-to-years-converter (HoursToYearsConverter, catalog 6af46f17a27d8d1d4e990bae). Bidirectional hours↔years using average Gregorian year (8,765.82 hr); Other time units + HMS reusing hour-converter TIME_CONSTANTS; empty default; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-325b delivery for Conversion and Units hours ↔ years converter.
- **Important Files:** frontend/src/tools/calculators/hours-to-years/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (8765.82 hr = 1 yr; 5 yr = 43829.1 hr; 12 months = 1 yr; 31556952 s = 1 yr; 10h 30m 15s = 37815 s; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Hours to Week Conversion
- **Summary:** Shipped Hours to Week Conversion on existing catalog slug hours-to-week-conversion (HoursToWeekConversion, catalog 6af46f17a27d8d1d4e990bad). Bidirectional hours↔weeks (exact ÷168); Other time units + HMS reusing hour-converter TIME_CONSTANTS; average Gregorian year/month labeled; GCD week-fraction table; empty default; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-324b delivery for Conversion and Units hours ↔ weeks converter.
- **Important Files:** frontend/src/tools/calculators/hours-to-weeks/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (168 hr = 1 wk; 120 hr = 5/7 wk; 2.5 wk = 420 hr; 604800 s = 1 wk; 10h 30m 15s = 37815 s; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Hours to Seconds Converter
- **Summary:** Shipped Hours to Seconds Converter on existing catalog slug hours-to-seconds-converter (HoursToSecondsConverter, catalog 6af46f17a27d8d1d4e990bac). Bidirectional hours↔seconds plus editable HMS compound reusing hour-converter TIME_CONSTANTS; exact ×3600; empty default; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-323b delivery for Conversion and Units hours ↔ seconds converter.
- **Important Files:** frontend/src/tools/calculators/hours-to-seconds/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (13 hr = 46800 s; 1h 45m 30s = 6330 s; 0h 60m → 1h 0m; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Hours to Minutes Converter
- **Summary:** Shipped Hours to Minutes Converter on existing catalog slug hours-to-minutes-converter (HoursToMinutesConverter, catalog 6af46f17a27d8d1d4e990bab). Synced hrs/min/sec plus editable HMS compound reusing hour-converter TIME_CONSTANTS; exact ×60 / ×3600; empty default; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-322b delivery for Conversion and Units hours ↔ minutes converter.
- **Important Files:** frontend/src/tools/calculators/hours-to-minutes/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (7 hr = 420 min / 25200 s; 2h 15m 30s = 135.5 min; 0h 90m → 1h 30m; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Hours to Days Calculator
- **Summary:** Shipped Hours to Days Calculator on existing catalog slug hours-to-days-calculator (HoursToDaysCalculator, catalog 6af46f17a27d8d1d4e990baa). Bidirectional hours↔days (exact ÷24); Other Quantities + HMS reuse hour-converter TIME_CONSTANTS; GCD fraction table with 1–72 expand; empty default; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-321b delivery for Conversion and Units hours ↔ days calculator.
- **Important Files:** frontend/src/tools/calculators/hours-to-days/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (48 hr = 2 days; 100 hr ≈ 4.1666667 days; fraction labels 6→1/4, 36→3/2; HMS 2:30:45 → 0.1046875 day). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Hour Converter
- **Summary:** Shipped Hour Converter on existing catalog slug hour-converter (HourConverter, catalog 6af46f17a27d8d1d4e990ba9). Synced hrs/yrs/mos/wks/days/min/sec plus editable HMS compound from canonical seconds; exact 3600 s/hr and 168 hr/wk; average Gregorian year/month (8765.82 / 730.485 hr); empty default; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-320b delivery for Conversion and Units multi-field hour/time converter.
- **Important Files:** frontend/src/tools/calculators/hour-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (2 hr = 120 min / 7200 s; 1 yr = 8765.82 hr; 1 hr 75 min 90 sec → 2 hrs 16 min 30 sec; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Height Converter
- **Summary:** Shipped Height Converter on existing catalog slug height-converter (HeightConverter, catalog 6af46f17a27d8d1d4e990b88). Synced cm/m/m+cm/in/ft/ft+in plus other mm/km/yd/mi from canonical meters; exact 2.54 cm/in and 30.48 cm/ft; compound normalization; empty default; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-319b delivery for Conversion and Units multi-field height converter.
- **Important Files:** frontend/src/tools/calculators/height-converter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (170 cm = 1.7 m; 5 ft 10 in = 177.8 cm; 5 ft 14 in → 6 ft 2 in; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add Hectares to Acres Converter
- **Summary:** Shipped Hectares to Acres Converter on existing catalog slug hectares-to-acres-converter (HectaresToAcresConverter, catalog 6af46f17a27d8d1d4e990b87). Bidirectional ha↔ac with exact 1 ha = 10,000 m² and 1 international acre = 4,046.8564224 m²; simple two-field UI; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-318b delivery for Conversion and Units hectares ↔ acres land-area converter.
- **Important Files:** frontend/src/tools/calculators/hectares-to-acres/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 ha ≈ 2.4710538147 ac; 19 ac ≈ 7.68902720256 ha; negatives rejected). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed (pre-existing gallons-to-grams content.ts syntax error unrelated).

### 2026-11-17 — Add g to lbs Converter
- **Summary:** Shipped g to lbs Converter on existing catalog slug g-to-lbs-converter (GToLbsConverter, catalog 6af46f17a27d8d1d4e990b3a). Bidirectional grams↔pounds with exact 1 lb = 453.59237 g; simple two-field UI; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-317b delivery for Conversion and Units grams ↔ pounds mass converter.
- **Important Files:** frontend/src/tools/calculators/g-to-lbs/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (500 g ≈ 1.10231131 lb; 1 lb = 453.59237 g; 2 lb = 907.18474 g). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add g to tsp Converter
- **Summary:** Shipped g to tsp Converter on existing catalog slug g-to-tsp-converter (GToTspConverter, catalog 6af46f17a27d8d1d4e990b3b). Density-based mass↔volume with salt default 1217 kg/m³; US tsp 4.92892159375 mL distinct from metric tsp; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-316b delivery for Conversion and Units density-based grams ↔ teaspoons cooking converter.
- **Important Files:** frontend/src/tools/calculators/g-to-tsp/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (10 g water ≈ 2.0288 US tsp; salt @ 1.217; reverse 1 US tsp water = 4.92892159375 g). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add gr to ml Converter
- **Summary:** Shipped gr to ml Converter on existing catalog slug gr-to-ml-converter (GrToMlConverter, catalog 6af46f17a27d8d1d4e990b3d). Density-based mass↔volume with ingredient presets; default water 1 g/mL and mL; null pillar/subPillar preserved. Meta title <=70; meta description trimmed to <=160. indexable left false.
- **Why:** TOOL-315b delivery for Conversion and Units density-based grams ↔ milliliters converter (gr abbreviation branding).
- **Important Files:** frontend/src/tools/calculators/gr-to-ml/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (100 g water = 100 mL; milk ≈ 97.0874 mL; honey ≈ 70.4225 mL; reverse milk/honey). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gram to Liter Conversion
- **Summary:** Shipped Gram to Liter Conversion on existing catalog slug gram-to-liter-conversion (GramToLiterConversion, catalog 6af46f17a27d8d1d4e990b3e). Density-based mass↔volume with ingredient presets; default water 1000 kg/m³ and L; V_L = m_g / ρ_kg/m³; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-314b delivery for Conversion and Units density-based gram ↔ liter converter.
- **Important Files:** frontend/src/tools/calculators/gram-to-liter/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (100/500/1000 g water → 0.1/0.5/1 L; 200 g milk ≈ 0.19417 L; 2 L milk = 2060 g). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Grams to fl oz Converter
- **Summary:** Shipped Grams to fl oz Converter on existing catalog slug grams-to-fl-oz-converter (GramsToFlOzConverter, catalog 6af46f17a27d8d1d4e990b40). Density-based mass↔volume with substance presets; default water 1 g/mL and US fl oz; distinct US/UK fluid ounce factors; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-313b delivery for Conversion and Units density-based grams ↔ fluid ounces converter.
- **Important Files:** frontend/src/tools/calculators/grams-to-fl-oz/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (100 g water ≈ 3.3814 US fl oz / 3.5195 UK fl oz; honey ≈ 2.3813 US fl oz; 4 US fl oz milk ≈ 121.84 g). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Grams in mL Converter
- **Summary:** Shipped Grams in mL Converter on existing catalog slug grams-in-ml-converter (GramsInMlConverter, catalog 6af46f17a27d8d1d4e990b3f). Density-based mass↔volume with cooking ingredient presets; default water 1000 kg/m³; mass/volume unit selectors; density accordion expanded; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-312b delivery for Conversion and Units density-based grams ↔ milliliters converter.
- **Important Files:** frontend/src/tools/calculators/grams-in-ml/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (100 g water = 100 mL; 100 g honey ≈ 70.42 mL; 150 mL oil = 138 g; kg/m³↔g/mL; round-trip). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gal to kg Converter
- **Summary:** Shipped Gal to kg Converter on existing catalog slug gal-to-kg-converter (GalToKgConverter, catalog 6af46f17a27d8d1d4e990b3c). Density-based US/UK gal ↔ kg with other mass units; cubic-meter-to-ton materials reuse; density accordion default kg/L water; null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-311b delivery for Conversion and Units density-based gal ↔ kg converter.
- **Important Files:** frontend/src/tools/calculators/gal-to-kg/*, cubic-meter-to-ton materials reuse, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 US gal water = 3.785411784 kg; 1 UK gal = 4.54609 kg; milk @ 1.03; round-trip). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gallons to Tons Converter
- **Summary:** Shipped Gallons to Tons Converter on existing catalog slug gallons-to-tons-converter (GallonsToTonsConverter, catalog 6af46f17a27d8d1d4e990acd). Density-based volume↔mass with cubic-meter-to-ton materials reuse; US/UK/metric tons and multi volume units; density unit switching; negatives and zero density rejected. Pillar 6af451d0a27d8d1d4e98f9e1 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-310b delivery for Conversion and Units density-based gal ↔ tons converter.
- **Important Files:** frontend/src/tools/calculators/gallons-to-tons/*, cubic-meter-to-ton materials reuse, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 US gal water ≈ 0.0041727 US ton; UK gal→UK ton; round-trip). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gallons to Quarts Converter
- **Summary:** Shipped Gallons to Quarts Converter on existing catalog slug gallons-to-quarts-converter (GallonsToQuartsConverter, catalog 6af46f17a27d8d1d4e990acc). Bidirectional gallons↔quarts with US/UK unit selectors; unit switches preserve physical volume via liters; 1 gal = 4 qt same-system; negatives rejected; empty default. Pillar 6af451d0a27d8d1d4e98f9e1 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-309b delivery for Conversion and Units volume pair converter (gal to quarts).
- **Important Files:** frontend/src/tools/calculators/gallons-to-quarts/*, volume-conversion engine reuse, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 US gal = 4 US qt; 1 UK gal = 4 UK qt; cross-system via liters). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gallons to Pints Converter
- **Summary:** Shipped Gallons to Pints Converter on existing catalog slug gallons-to-pints-converter (GallonsToPintsConverter, catalog 6af46f17a27d8d1d4e990aca). Four-field sync US/UK gal + US/UK pt via volume-conversion liter engine; more-options mL/L/fl oz/qt/m³; negatives rejected; empty default. Pillar 6af451d0a27d8d1d4e98f9e1 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-308b delivery for Conversion and Units volume converter (gal to pints).
- **Important Files:** frontend/src/tools/calculators/gallons-to-pints/*, volume-conversion convertVolume reuse, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 US gal = 8 US pt; 1 UK gal = 8 UK pt; 1 US gal ≈ 6.661 UK pt). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gallons to Grams Conversion
- **Summary:** Shipped Gallons to Grams Conversion on existing catalog slug gallons-to-grams-conversion (GallonsToGramsConverter, catalog 6af46f17a27d8d1d4e990ac9). Density-based US gal ↔ grams with substance presets (water default 1000 kg/m³), editable density units, bidirectional sync; negatives and zero density rejected. Pillar 6af451d0a27d8d1d4e98f9e1 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-307b delivery for Conversion and Units density-based gal ↔ g converter.
- **Important Files:** frontend/src/tools/calculators/gallons-to-grams/*, cubic-feet formatMeasure reuse, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 US gal water @ 1000 kg/m³ = 3785.411784 g; milk @ 1030 ≈ 3898.97 g). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gallons to Cups Converter
- **Summary:** Shipped Gallons to Cups Converter on existing catalog slug gallons-to-cups-converter (GallonsToCupsConverter, catalog 6af46f17a27d8d1d4e990ac8). Bidirectional US gal ↔ US customary cups with exact factor 16; negatives rejected; empty default. Pillar 6af451d0a27d8d1d4e98f9e1 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-306b delivery for Conversion and Units volume pair converter (gal to cups).
- **Important Files:** frontend/src/tools/calculators/gallons-to-cups/*, cubic-feet formatMeasure reuse, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 gal = 16 cups; 8 cups = 0.5 gal). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gallons to Cubic Feet Converter
- **Summary:** Shipped Gallons to Cubic Feet Converter on existing catalog slug gallons-to-cubic-feet-converter (GallonsToCubicFeetConverter, catalog 6af46f17a27d8d1d4e990afa). Three-field sync US gal / UK gal / ft³ via exact liter factors; negatives rejected. Pillar 6af451d1a27d8d1d4e98f9e6 and subPillar 6af451d1a27d8d1d4e98f9e7 preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-305b delivery for Conversion and Units volume converter (gal to ft³).
- **Important Files:** frontend/src/tools/calculators/gallons-to-cubic-feet/*, cubic-feet formatMeasure reuse, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (1 US gal ≈ 0.133681 ft³; 1 ft³ ≈ 7.48052 US gal). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Gaj to Square Yard Converter
- **Summary:** Shipped Gaj to Square Yard Converter on existing catalog slug gaj-to-square-yard-converter (GajToSquareYardConverter, catalog 6af46f17a27d8d1d4e990ad5). Primary land-area gaj↔yd² at 1:1 with ft² helper; independent linear gaj↔yd accordion; negative area rejected. Pillar 6af451d0a27d8d1d4e98f9e2 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-304b delivery for Conversion and Units land-area gaj converter.
- **Important Files:** frontend/src/tools/calculators/gaj-to-square-yard/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (150 gaj = 150 yd² = 1350 ft²; linear 12 gaj = 12 yd). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add ft to m Converter
- **Summary:** Shipped ft to m Converter on existing catalog slug ft-to-m-converter (FtToMConverter, catalog 6af46f17a27d8d1d4e990b86). Bidirectional ft↔m with exact 0.3048; meter-converter registry cross-check. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-303b delivery for Conversion and Units length pair converter (ft to m).
- **Important Files:** frontend/src/tools/calculators/ft-to-m/*, meter-converter convertLength cross-check, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (10 ft = 3.048 m; 1.8288 m = 6 ft). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Foot to Centimeter Converter
- **Summary:** Shipped Foot to Centimeter Converter on existing catalog slug foot-to-centimeter-converter (FootToCentimeterConverter, catalog 6af46f17a27d8d1d4e990b85). Bidirectional ft↔cm with exact 30.48; More options mm/m/km/in/yd/mi via meter-converter registry. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-302b delivery for Conversion and Units length pair converter (ft to cm).
- **Important Files:** frontend/src/tools/calculators/foot-to-centimeter/*, meter-converter convertLength cross-check, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (6 ft = 182.88 cm; 152.4 cm = 5 ft). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Fluid Ounces to Pounds Conversion
- **Summary:** Shipped Fluid Ounces to Pounds Conversion on existing catalog slug fluid-ounces-to-pounds-conversion (FluidOuncesToPoundsConverter, catalog 6af46f17a27d8d1d4e990b39). Density-based volume↔mass with substance presets (water @ 1000 kg/m³), editable density units, US/Imp fl oz distinguished, bidirectional sync. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-301b delivery for Conversion and Units density-based fl oz ↔ lb converter.
- **Important Files:** frontend/src/tools/calculators/fluid-ounces-to-pounds/*, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed (16 US fl oz water ≈ 1.04318 lb; 1 lb water ≈ 15.3378 US fl oz). Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Feet to Yards Conversion
- **Summary:** Shipped Feet to Yards Conversion on existing catalog slug feet-to-yards-conversion (FeetToYardsConverter, catalog 6af46f17a27d8d1d4e990ad4). Bidirectional ft↔yd with feet first; exact 1 yd = 3 ft; cross-checks meter-converter length registry. Pillar 6af451d0a27d8d1d4e98f9e2 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-300b delivery for Conversion and Units length pair converter (ft to yd).
- **Important Files:** frontend/src/tools/calculators/feet-to-yards/*, meter-converter convertLength cross-check, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed; tool.key ok. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Feet to Miles Converter
- **Summary:** Shipped Feet to Miles Converter on existing catalog slug feet-to-miles-converter (FeetToMilesConverter, catalog 6af46f17a27d8d1d4e990b09). Bidirectional ft↔mi with feet first; exact 1 mi = 5,280 ft; cross-checks meter-converter length registry. Pillar 6af451d1a27d8d1d4e98f9e9 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-299b delivery for Conversion and Units length pair converter (ft to mi).
- **Important Files:** frontend/src/tools/calculators/feet-to-miles/*, meter-converter convertLength cross-check, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed; tool.key ok. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Feet Converter
- **Summary:** Shipped Feet Converter on existing catalog slug feet-converter (FeetConverter, catalog 6af46f17a27d8d1d4e990af2). Convert Feet / Metric / Imperial/US / Others accordions; meters as base; exact 1 ft = 0.3048 m; reuses meter-converter length factors via convertFeet. Pillar 6af451d1a27d8d1d4e98f9e6 preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-298b delivery for Conversion and Units length converter (feet focus).
- **Important Files:** frontend/src/tools/calculators/feet-converter/*, meter-converter types reused, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed; tool.key ok. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Fahrenheit to Celsius Converter
- **Summary:** Shipped Fahrenheit to Celsius Converter on existing catalog slug fahrenheit-to-celsius-converter (FahrenheitToCelsiusConverter, catalog 6af46f17a27d8d1d4e990b1a). Bidirectional °F↔°C with Fahrenheit first; reverse callout; reuses celsius-to-fahrenheit affine helpers; absolute-zero rejection. Pillar 6af451d2a27d8d1d4e98f9ec preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-297b delivery for Conversion and Units temperature pair converter (°F to °C focus).
- **Important Files:** frontend/src/tools/calculators/fahrenheit-to-celsius/*, celsius-to-fahrenheit helpers reused, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed; tool.key ok. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Fahrenheit Converter
- **Summary:** Shipped Fahrenheit Converter on existing catalog slug fahrenheit-converter (FahrenheitConverter, catalog 6af46f17a27d8d1d4e990b18). Primary °F; Other temperatures accordion for °C/K/°R/°De/°N/°Ré/°Rø; Kelvin-normalized path reusing Celsius Converter affine formulas; absolute-zero rejection. Pillar 6af451d2a27d8d1d4e98f9ec preserved; subPillar null. Meta title <=70. indexable left false.
- **Why:** TOOL-296b delivery for Conversion and Units temperature converter (Fahrenheit focus).
- **Important Files:** frontend/src/tools/calculators/fahrenheit-converter/*, celsius-converter formulas reused, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed; tool.key ok. Mongo assigned via npm run tool:assign after transient Atlas DNS timeouts (isDeveloped true, isActive true, indexable false, isFeatured false; pillar 6af451d2a27d8d1d4e98f9ec preserved). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add dm Converter
- **Summary:** Shipped dm Converter on existing catalog slug dm-converter (DmConverter, catalog 6af46f17a27d8d1d4e990b84). Primary decimeter field; Metric / Imperial/US / Others accordions; meters as base; non-negative validation; reuses meter-converter length factors/formatters via convertDm. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-295b delivery for Conversion and Units length converter (decimeter focus).
- **Important Files:** frontend/src/tools/calculators/dm-converter/*, meter-converter types reused, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed; tool.key ok. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — ADR-019: two-commit calculator delivery
- **Summary:** Amended ADR-019 from size-banded milestone commits (small 1–2 / medium 2–3 / large 3–5) to exactly two commits per new calculator: (1) all tool files, (2) Brain docs last. Synced Cursor/Antigravity git-commits rules, playbook Step 19, calculator standards, `AGENTS.md`, and related Brain references. No calculator source changed.
- **Why:** Agents were landing ~4 commits per tool; the team wants a fixed tool + Brain split only.
- **Important Files:** `.cursor/rules/git-commits.mdc`, `.agents/rules/git-commits.md`, `brain/DECISIONS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/CALCULATOR_STANDARDS.md`, `AGENTS.md`.
- **Verification:** Docs-only amendment; no runtime checks required.

### 2026-11-17 — Add Distance Converter
- **Summary:** Shipped Distance Converter on existing catalog slug distance-converter (DistanceConverter, catalog 6af46f17a27d8d1d4e990b83). Multi-field metric (mm/cm/m/km) and imperial/US (in/ft/yd/mi) groups plus other units (pm through pc); meters as base; non-negative validation; reuses length-converter factors/formatters. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-294b delivery for Conversion and Units length converter.
- **Important Files:** frontend/src/tools/calculators/distance-converter/*, length-converter types reused, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed; tool.key ok. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Degrees to Seconds Converter
- **Summary:** Shipped Degrees to Seconds Converter on existing catalog slug degrees-to-seconds-converter (DegreesToSecondsConverter, catalog 6af46f17a27d8d1d4e990bfe). Bidirectional degrees to arcseconds with exact factor 3600; expandable other units (arcminutes, radians, gradians, revolutions); empty default; angular-not-time copy; guide + table + FAQs. Reuses degreesToArcseconds/arcsecondsToDegrees on angle-conversion. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-293b delivery for Conversion and Units angle converter.
- **Important Files:** frontend/src/tools/calculators/degrees-to-seconds/*, frontend/src/tools/calculators/angle-conversion/calculation.ts, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain docs.
- **Verification:** calculation.test.ts passed; angle-conversion tests still pass; tool.key ok. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Degrees to Radians Converter
- **Summary:** Shipped Degrees to Radians Converter on existing catalog slug degrees-to-radians-converter (DegreesToRadiansConverter, catalog 6af46f17a27d8d1d4e990bfd). Bidirectional degrees ↔ radians via Math.PI; empty default; signed and >360 allowed; optional pi-fraction labels; guide + table + FAQs. Reuses hardened degreesToRadians/radiansToDegrees on angle-conversion/calculation.ts. Null pillar/subPillar preserved. Meta title <=70. indexable left false.
- **Why:** TOOL-292b delivery for Conversion & Units angle converter.
- **Important Files:** frontend/src/tools/calculators/degrees-to-radians/*, frontend/src/tools/calculators/angle-conversion/calculation.ts, registry, sitemap.ts, backend/src/modules/tools/tool.key.ts, brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md.
- **Verification:** calculation.test.ts passed; angle-conversion and degrees-to-minutes tests still pass; tool.key ok. Mongo assigned via npm run tool:assign (isDeveloped true, isActive true, indexable false, isFeatured false). Full frontend tsc / production build not claimed.

### 2026-11-17 — Add Degrees to Minutes Converter
- **Summary:** Shipped Degrees to Minutes Converter on existing catalog slug `degrees-to-minutes-converter` (`DegreesToMinutesConverter`, catalog `6af46f17a27d8d1d4e990bfc`). Bidirectional degrees ↔ arcminutes with exact factor 60; empty default; signed and >360° allowed; angular-not-time copy; guide + FAQs. Reuses new exact helpers on `angle-conversion/calculation.ts`. Null pillar/subPillar preserved. Meta title ≤70. `indexable` left false.
- **Why:** TOOL-291 delivery for Conversion & Units angle converter.
- **Important Files:** `frontend/src/tools/calculators/degrees-to-minutes/*`, `frontend/src/tools/calculators/angle-conversion/calculation.ts`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed; angle-conversion tests still pass; `tool.key ok`. Mongo assigned via `npm run tool:assign` (`isDeveloped: true`, `isActive: true`, `indexable: false`, `isFeatured: false`). Full frontend `tsc` / production build not claimed.

### 2026-11-17 — Reusable `tool:assign` only (delete per-tool assign scripts)
- **Summary:** Expanded `backend/src/scripts/assign-tool-component.ts` into the sole catalog assign CLI (`npm run tool:assign`) with required `--slug`/`--component`/`--id`/`--name`/`--short-description`/`--meta-title`/`--meta-description` plus optional pillar guards and `--set-active`/`--set-indexable`. Deleted ~349 one-off `assign-*-tool.ts` scripts and ~22 tmp/lookup/adapt helpers. Locked in Cursor/Antigravity tool-activation rules, `AGENTS.md`, and playbook Step 19c. Kept seeds/publish/admin/currency/category scripts only.
- **Why:** Per-tool assign scripts were one-time use and cluttered `backend/src/scripts/`; agents must pass content flags instead of inventing new files.
- **Important Files:** `backend/src/scripts/assign-tool-component.ts`, `.cursor/rules/tool-activation.mdc`, `.agents/rules/tool-activation.md`, `AGENTS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/BACKEND.md`, `brain/ARCHITECTURE.md`, `brain/DECISIONS.md`.
- **Verification:** Scripts folder reduced to 9 keepers. CLI help/header documented in script. Full Mongo smoke assign not re-run in this infra change.
>>>>>>> 187e375d1faf04a647ea7f218d044c71b4f0371b

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
<<<<<<< HEAD

=======
>>>>>>> 187e375d1faf04a647ea7f218d044c71b4f0371b
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
