# Currency Conversion Progress (Phase 3)

Tracks real FX conversion for the **105 currency-enabled calculators** from the Phase 3 selector audit (audit order preserved). Margin Interest was completed as a separate pilot and is listed once in the 105 table (not double-counted in totals).

## Totals

| Metric | Count |
|---|---:|
| Audit targets (105) | 105 |
| Complete (implementation) | 46 |
| Pending | 59 |
| Blocked | 0 |
| Manual verification Passed | 1 (pilot only) |
| Manual verification Pending | 5 (Batch 1) + 5 (Batch 2) + 5 (Batch 3) + 5 (Batch 4) + 5 (Batch 5) + 5 (Batch 6) + 5 (Batch 7) + 5 (Batch 8) + 5 (Batch 9) + 59 Pending tools |

## Pilot (outside batch numbering)

| Calculator | Slug | Status | Commit | Manual verification | Notes |
|---|---|---|---|---|---|
| Margin Interest Calculator | `margin-interest-calculator` | **Pilot Complete** | `b968634` (result currency: `b968634`; initial: `ac974d1`) | **Passed** | Independent borrowed + result currencies; shared selector pattern evolved in correction. Counted once in #85 below. |

## Batch map

Batches are 21 × 5 in audit order. Batch 17 includes Margin Interest (#85), already Pilot Complete.

## 105-calculator ledger

Status values: `Pending` / `Complete` / `Blocked`. Manual verification: `Pending` / `Passed` / `Failed`.

| # | Calculator | Slug | Batch | Status | Commit | Manual verification | Notes |
|---:|---|---|---:|---|---|---|---|
| 1 | 12-Hour Shift Pay | `12-hour-shift-pay-calculator` | 1 | Complete | acaa18a | Pending | Shared selector; converts wages; hours unchanged |
| 2 | 3x Rent | `3x-rent-calculator` | 1 | Complete | acaa18a | Pending | Shared selector; converts rent/income; multiplier/shares unchanged |
| 3 | 401(k) | `401k-calculator` | 1 | Complete | acaa18a | Pending | Shared selector; USD statutory limit fields not converted |
| 4 | 403(b) | `403b-calculator` | 1 | Complete | acaa18a | Pending | Shared selector; converts money fields incl. optional limits |
| 5 | 529 | `529-calculator` | 1 | Complete | acaa18a | Pending | Shared selector; converts costs/balances/contributions |
| 6 | 70/20/10 Rule Money | `702010-rule-money-calculator` | 2 | Complete | `3fa7edb` | Pending | Shared selector; converts income/spending; allocation % unchanged |
| 7 | ADR | `adr-calculator` | 2 | Complete | `3fa7edb` | Pending | Shared selector; converts room revenue + ADR; rooms/occupancy unchanged |
| 8 | Annualized Return | `annualized-return-calculator` | 2 | Complete | `3fa7edb` | Pending | Shared currency controls; converts beginning+ending together; return % economic |
| 9 | Appreciation | `appreciation-calculator` | 2 | Complete | `3fa7edb` | Pending | Shared currency; converts starting value; rate/duration unchanged |
| 10 | APY | `apy-calculator` | 2 | Complete | `3fa7edb` | Pending | Shared currency; converts deposit; APR/compounding/APY % unchanged |
| 11 | Basis Point | `basis-point-calculator` | 3 | Complete | `f4277e3` | Pending | Shared selectors; converts ofAmount; bps/%/ratios unchanged |
| 12 | Bitcoin ETF | `bitcoin-etf-calculator` | 3 | Complete | `f4277e3` | Pending | Shared selectors (×4); converts investment + other costs; ratios/years unchanged |
| 13 | CAGR | `cagr-calculator` | 3 | Complete | `f4277e3` | Pending | Shared selectors; converts initial + final together; CAGR %/periods unchanged |
| 14 | Capital Gains Yield | `capital-gains-yield-calculator` | 3 | Complete | `f4277e3` | Pending | Shared selectors (×3); converts bought + current; yield % unchanged |
| 15 | CD | `cd-calculator` | 3 | Complete | `f4277e3` | Pending | Shared selectors (×3); converts initial deposit; rate/term/compounding unchanged |
| 16 | Compound Growth | `compound-growth-calculator` | 4 | Complete | `81d17a1` | Pending | Shared selectors; converts deposit + contribution; rate/term/compounding unchanged |
| 17 | Compound Interest | `compound-interest-calculator` | 4 | Complete | `81d17a1` | Pending | Shared selector; converts principal + deposits; rate/term/compounding unchanged |
| 18 | Compound Interest Rate | `compound-interest-rate-calculator` | 4 | Complete | `81d17a1` | Pending | Shared selectors; converts initial+final together; implied rate/term unchanged |
| 19 | Continuous Compound Interest | `continuous-compound-interest-calculator` | 4 | Complete | `81d17a1` | Pending | Shared selectors; converts balance + deposits; r and t unchanged |
| 20 | DCF | `discounted-cash-flow-calculator-dcf` | 4 | Complete | `81d17a1` | Pending | Shared selectors; converts FCFF/EPS/cash/debt; rates/shares unchanged |
| 21 | Discount Rate | `discount-rate-calculator` | 5 | Complete | `191200c` | Pending | Shared selectors; converts PV/FV/CF together; solved rate % unchanged |
| 22 | Effective Annual Yield | `effective-annual-yield-calculator` | 5 | Complete | `191200c` | Pending | Shared selectors; converts face + coupon payment; yield % unchanged |
| 23 | Expected Utility | `expected-utility-calculator` | 5 | Complete | `191200c` | Pending | Shared selectors; converts payoffs; probabilities unchanged |
| 24 | Expense Ratio | `expense-ratio-calculator` | 5 | Complete | `191200c` | Pending | Shared selectors; converts initial + yearly investment; return/expense % unchanged |
| 25 | FD | `fd-calculator` | 5 | Complete | `191200c` | Pending | Shared selectors; converts principal; rate/term/compounding unchanged |
| 26 | Future Value | `future-value-calculator` | 6 | Complete | `2808b1d` | Pending | Shared selectors; converts PV + periodic amounts; rate/periods unchanged |
| 27 | Hedge Ratio | `hedge-ratio-calculator` | 6 | Complete | `2808b1d` | Pending | Shared selectors; converts exposure + hedge; ratio % unchanged |
| 28 | Holding Period Return | `holding-period-return-calculator` | 6 | Complete | `2808b1d` | Pending | Shared selectors (×3); converts prices + dividend; yield/HPR % unchanged |
| 29 | Impermanent Loss | `impermanent-loss-calculator` | 6 | Complete | `2808b1d` | Pending | Fiat deposit + token quote prices convert; quantities/IL % unchanged |
| 30 | Information Ratio | `information-ratio-calculator` | 6 | Complete | `2808b1d` | Pending | Shared selectors; converts beginning + ending; return/TE/IR % unchanged |
| 31 | Interest Rate | `interest-rate-calculator` | 7 | Complete | `b430f16` | Pending | Shared selector; converts loan/deposit cash flows together; solved rates unchanged |
| 32 | Investment | `investment-calculator` | 7 | Complete | `b430f16` | Pending | Shared selectors; converts principal + contributions; return/term/schedule unchanged |
| 33 | Investment Fee | `investment-fee-calculator` | 7 | Complete | `b430f16` | Pending | Shared selector; converts initial investment; fee % unchanged |
| 34 | IRR | `irr-calculator` | 7 | Complete | `b430f16` | Pending | Shared selectors; converts initial + yearly CF list; signs preserved; IRR % unchanged |
| 35 | 3D Printer Buy vs Outsource | `3d-printer-buy-vs-outsource-calculator` | 7 | Complete | `b430f16` | Pending | Header selector; converts buy/outsource costs; quantities/hours unchanged |
| 36 | Accumulated Depreciation | `accumulated-depreciation-calculator` | 8 | Complete | `6d0d7f1` | Pending | Header selector; converts asset cost + salvage; life/method/units unchanged |
| 37 | Additional Funds Needed | `additional-funds-needed-calculator` | 8 | Complete | `6d0d7f1` | Pending | Shared currency across rows; ΔA/ΔL/ΔRE convert together; AFN invariant to FX |
| 38 | A/R Days | `ar-days-calculator` | 8 | Complete | `6d0d7f1` | Pending | Receivables + credit sales convert; period days and A/R days unchanged |
| 39 | Average Collection Period | `average-collection-period-calculator` | 8 | Complete | `6d0d7f1` | Pending | Shared selectors (×4); money fields convert; days/turnover ratio unchanged |
| 40 | Average Fixed Cost | `average-fixed-cost-calculator` | 8 | Complete | `6d0d7f1` | Pending | Shared selectors (×2); fixed cost converts; unit count unchanged |
| 41 | Break-even | `break-even-calculator` | 9 | Complete | `fad37c0` | Pending | Shared selectors; revenue, cost, and fixed costs convert; break-even units unchanged |
| 42 | Build vs. Buy | `build-vs-buy-calculator` | 9 | Complete | `fad37c0` | Pending | Five synced selectors; buy cost and salary convert; build time and overhead % unchanged |
| 43 | Burn Rate | `burn-rate-calculator` | 9 | Complete | `fad37c0` | Pending | Balances and burn display convert; duration and runway units unchanged |
| 44 | Business Budget | `business-budget-calculator` | 9 | Complete | `fad37c0` | Pending | All income/expense/one-time lines convert; recurring periods unchanged |
| 45 | Business Loan | `business-loan-calculator` | 9 | Complete | `fad37c0` | Pending | Loan amount and fee cash convert; rate, term, and origination % unchanged |
| 46 | Business Valuation | `business-valuation-calculator` | 10 | Pending | — | Pending | |
| 47 | Consulting Fees | `consulting-fees-calculator` | 10 | Pending | — | Pending | |
| 48 | Contribution Margin | `contribution-margin-calculator` | 10 | Pending | — | Pending | |
| 49 | Cost Function | `cost-function-calculator` | 10 | Pending | — | Pending | |
| 50 | Cost of Doing Business | `cost-of-doing-business-calculator` | 10 | Pending | — | Pending | |
| 51 | Cost of Goods Sold | `cost-of-goods-sold-calculator` | 11 | Pending | — | Pending | |
| 52 | CPA | `cpa-calculator-cost-per-acquisition` | 11 | Pending | — | Pending | |
| 53 | CPC and CPM | `cpc-and-cpm-calculator` | 11 | Pending | — | Pending | |
| 54 | CPM | `cpm-calculator` | 11 | Pending | — | Pending | |
| 55 | CAC | `customer-acquisition-cost-calculator` | 11 | Pending | — | Pending | |
| 56 | Direct Material Price Variance | `direct-material-price-variance-calculator` | 12 | Pending | — | Pending | |
| 57 | EVM | `evm-calculator` | 12 | Pending | — | Pending | |
| 58 | Effective Corporate Tax Rate | `effective-corporate-tax-rate-calculator` | 12 | Pending | — | Pending | |
| 59 | EMV | `emv-calculator-expected-monetary-value` | 12 | Pending | — | Pending | |
| 60 | FIFO Inventory | `fifo-calculator-for-inventory` | 12 | Pending | — | Pending | |
| 61 | GMROI | `gmroi-calculator-gross-margin-return-on-investment` | 13 | Pending | — | Pending | |
| 62 | Google AdSense | `google-adsense-calculator` | 13 | Pending | — | Pending | |
| 63 | High-Low Method | `high-low-method-calculator` | 13 | Pending | — | Pending | |
| 64 | Labor Cost | `labor-cost-calculator` | 13 | Pending | — | Pending | |
| 65 | Lemonade Stand | `lemonade-stand-calculator` | 13 | Pending | — | Pending | |
| 66 | Lerner Index | `lerner-index-calculator` | 14 | Pending | — | Pending | |
| 67 | Liquid Net Worth | `liquid-net-worth-calculator` | 14 | Pending | — | Pending | |
| 68 | Man-Hours | `man-hours-calculator` | 14 | Pending | — | Pending | |
| 69 | Online Marketing Conversion | `online-marketing-conversion-calculator` | 14 | Pending | — | Pending | |
| 70 | Operating Asset Turnover | `operating-asset-turnover-calculator` | 14 | Pending | — | Pending | |
| 71 | Payback Period | `payback-period-calculator` | 15 | Pending | — | Pending | |
| 72 | Pre and Post Money Valuation | `pre-and-post-money-valuation-calculator` | 15 | Pending | — | Pending | |
| 73 | PVGO | `pvgo-calculator` | 15 | Pending | — | Pending | |
| 74 | Price / Quantity | `price-quantity-calculator` | 15 | Pending | — | Pending | |
| 75 | Profitability Index | `profitability-index-calculator` | 15 | Pending | — | Pending | |
| 76 | Revenue Per Employee | `revenue-per-employee-calculator` | 16 | Pending | — | Pending | |
| 77 | ROAS | `roas-calculator` | 16 | Pending | — | Pending | |
| 78 | SaaS Lifetime Value | `saas-lifetime-value-calculator` | 16 | Pending | — | Pending | |
| 79 | Sales Commission | `sales-commission-calculator` | 16 | Pending | — | Pending | |
| 80 | Smoker's CTC | `smokers-ctc-calculator` | 16 | Pending | — | Pending | |
| 81 | Software Contract Value | `software-contract-value-calculator` | 17 | Pending | — | Pending | |
| 82 | Website Ad Revenue | `website-ad-revenue-calculator` | 17 | Pending | — | Pending | |
| 83 | YouTube Money | `youtube-money-calculator` | 17 | Pending | — | Pending | |
| 84 | Jensen's Alpha | `jensens-alpha-calculator` | 17 | Pending | — | Pending | |
| 85 | Margin Interest | `margin-interest-calculator` | 17 | Complete | `b968634` | Passed | Pilot Complete (see Pilot section); Batch 17 slot already done |
| 86 | MVA | `mva-calculator` | 18 | Pending | — | Pending | |
| 87 | MIRR | `mirr-calculator` | 18 | Pending | — | Pending | |
| 88 | Money Market Account | `money-market-account-calculator` | 18 | Pending | — | Pending | |
| 89 | Moving Average | `moving-average-calculator` | 18 | Pending | — | Pending | |
| 90 | Mutual Fund | `mutual-fund-calculator` | 18 | Pending | — | Pending | |
| 91 | NOPAT | `nopat-calculator` | 19 | Pending | — | Pending | |
| 92 | NPV | `npv-calculator-net-present-value` | 19 | Pending | — | Pending | |
| 93 | Opportunity Cost | `opportunity-cost-calculator` | 19 | Pending | — | Pending | |
| 94 | Percentage Return | `percentage-return-calculator` | 19 | Pending | — | Pending | |
| 95 | Perpetuity | `perpetuity-calculator` | 19 | Pending | — | Pending | |
| 96 | Present Value | `present-value-calculator` | 20 | Pending | — | Pending | |
| 97 | Rate of Return | `rate-of-return-calculator` | 20 | Pending | — | Pending | |
| 98 | ROCE | `roce-calculator` | 20 | Pending | — | Pending | |
| 99 | ROI | `roi-calculator` | 20 | Pending | — | Pending | |
| 100 | Simple Interest | `simple-interest-calculator` | 20 | Pending | — | Pending | |
| 101 | Sinking Fund | `sinking-fund-calculator` | 21 | Pending | — | Pending | |
| 102 | Time Value of Money | `time-value-of-money-calculator` | 21 | Pending | — | Pending | |
| 103 | Treynor Ratio | `treynor-ratio-calculator` | 21 | Pending | — | Pending | |
| 104 | TTM | `ttm-calculator-trailing-twelve-months` | 21 | Pending | — | Pending | |
| 105 | Value at Risk (VaR) | `value-at-risk-calculator-var` | 21 | Pending | — | Pending | |

## Batch 1 notes

- Local commit: `fix(currency): integrate conversion batch 1 calculators` `acaa18acaab6635d847603a52ae1c9a56e4bf7e6`.
- Shared `/tools/[slug]` + embed routes load rates for: Margin Interest + Batch 1 slugs only.
- Single shared `CurrencySelect` per tool; all monetary draft fields convert together.
- 401(k): elective/catch-up/annual-additions limit fields remain USD (not converted).
- Formulas unchanged; rates via `getCurrencyRates` → `CurrencyRatesProvider` → `convertCurrency`.
- Manual verification left Pending for user reference comparison.

## Batch 2 notes

- Local commit: `fix(currency): integrate conversion batch 2 calculators` `3fa7edb39ad799723109bf2cad0c33a82032b8bb`.
- Provider slug allowlist extended for Batch 2 (and preserves prior Batch 1 + pilot slugs).
- 70/20/10 + ADR: shared header `CurrencySelect`; monetary amounts convert; percents / room counts / occupancy unchanged.
- Annualized Return / Appreciation / APY: existing dual currency controls stay synced (shared state); convert monetary inputs together so FX alone cannot invent return/appreciation; rates, durations, APY % unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 3 notes

- Local commit: `fix(currency): integrate conversion batch 3 calculators` `f4277e3fa12a77c8f730c45fe73db91f3b660614`.
- Provider slug allowlist extended for Batch 3 (preserves Batch 1, Batch 2, and Margin Interest).
- All five tools keep existing shared-currency selector wiring (multiple dropdowns, one currency).
- Monetary fields convert via `convertCurrency` / `convertDraftMoneyFields`; percents, bps, periods, rates unchanged.
- Bitcoin ETF: fiat investment/other costs only — no BTC quantity FX.
- Manual verification left Pending for user reference comparison.

## Batch 4 notes

- Local commit: `fix(currency): integrate conversion batch 4 calculators` `81d17a11fbd361cac80a127c8246a7c455046e8a`.
- Provider slug allowlist extended for Batch 4 (preserves prior batches + Margin Interest).
- Shared currency state across existing selectors; monetary draft fields convert together.
- Compound Interest Rate: initial+final convert together so FX alone cannot invent a rate change.
- DCF: cash-flow signs preserved via conversion of typed amounts; WACC/g/shares unconverted.
- Manual verification left Pending for user reference comparison.

## Batch 5 notes

- Local commit: `fix(currency): integrate conversion batch 5 calculators` `191200ce684139bbc2287cc15dfe04196d7f0c04`.
- Provider slug allowlist extended for Batch 5 (preserves prior batches + Margin Interest).
- Shared currency state across existing selectors; monetary draft fields convert together.
- Discount Rate: PV/FV/CF convert together so solved discount rate % is unchanged by FX alone.
- Effective Annual Yield / Expected Utility: monetary amounts only; percents and probabilities unchanged.
- Expense Ratio / FD: investment or principal draft fields convert; return/expense/rate/term unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 6 notes

- Local commit: `fix(currency): integrate conversion batch 6 calculators` `2808b1deee2ccda35b3582c234224cadc8c41e61`.
- Provider slug allowlist extended for Batch 6 (preserves prior batches + Margin Interest).
- Shared currency state across existing selectors; monetary draft fields convert together.
- Future Value: present value and periodic amounts convert; interest rate and periods unchanged.
- Hedge Ratio: exposure and hedge notionals convert; hedge ratio % unchanged.
- Holding Period Return: bought, current, and dividend convert; all yield percentages unchanged.
- Impermanent Loss: fiat deposit and token prices in quote currency convert; token quantities and IL % unchanged.
- Information Ratio: beginning and ending values convert; benchmark, tracking error, and IR unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 9 notes

- Local commit: `fix(currency): integrate conversion batch 9 calculators` `fad37c014cbb5bdd8d28365d99c83cd5a816cec2`.
- Provider slug allowlist extended for Batch 9 (preserves prior batches + Margin Interest).
- Break-even: revenue, variable cost, and fixed costs convert together; units and margin/markup % invariant to FX-only changes.
- Build vs. Buy: five synced selectors; annual buy cost and monthly salary convert; headcount, build duration, overhead %, and payback units unchanged.
- Burn Rate: initial and final balances convert; burn rate and runway monetary display scale; duration and runway time units unchanged.
- Business Budget: all income, salary, expense, and one-time lump amounts convert; period selectors and budget % mix unchanged.
- Business Loan: loan amount, prepaid fee, and loaned fee convert; interest rate, term, origination %, and APR formulas unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 8 notes

- Local commit: `fix(currency): integrate conversion batch 8 calculators` `6d0d7f1dea8c35c3c6d0656a79f5a4da3874144d`.
- Provider slug allowlist extended for Batch 8 (preserves prior batches + Margin Interest).
- Accumulated Depreciation: header currency; asset cost and salvage convert; useful life, years, units, and method unchanged.
- Additional Funds Needed: shared currency on all row selectors; asset/liability/retained-earnings deltas convert together.
- A/R Days: receivables and credit sales (incl. average section) convert; period days and A/R days invariant to equivalent FX.
- Average Collection Period: four synced selectors; monetary AR/sales fields convert; duration, turnover ratio, and collection days unchanged.
- Average Fixed Cost: total fixed cost converts; production quantity and per-unit average scale with FX.
- Manual verification left Pending for user reference comparison.

## Batch 7 notes

- Local commit: `fix(currency): integrate conversion batch 7 calculators` `b430f16ac01603deeeff838d9b3e2cf7f3331e5f`.
- Provider slug allowlist extended for Batch 7 (preserves prior batches + Margin Interest).
- Shared currency state across existing selectors; monetary draft fields convert together.
- Interest Rate: all loan/deposit amounts convert together so FX alone cannot change solved nominal/APR/EAR.
- Investment: principal and contribution amounts convert; rate, term, compounding, and contribution schedule unchanged.
- Investment Fee: initial investment converts; load/operating/redemption fee percentages unchanged.
- IRR: initial investment and each cash-flow year convert together with signs preserved; IRR % invariant to FX-only changes.
- 3D Printer Buy vs Outsource: in-house and outsource monetary inputs convert; parts, hours, watts, and failure rate unchanged.
- Manual verification left Pending for user reference comparison.

## Changelog

- 2026-11-16: Batch 9 (#41–#45) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 8 (#36–#40) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 7 (#31–#35) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 6 (#26–#30) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 5 (#21–#25) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 4 (#16–#20) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 3 (#11–#15) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 2 (#6–#10) implementation Complete; manual verification Pending.
- 2026-11-16: Created ledger from Phase 3 audit; recorded Margin Interest Pilot Complete; marked Batch 1 (#1–#5) Complete (implementation).



