# Currency Conversion Progress (Phase 3)

Tracks real FX conversion for the **105 currency-enabled calculators** from the Phase 3 selector audit (audit order preserved). Margin Interest was completed as a separate pilot and is listed once in the 105 table (not double-counted in totals).

## Totals

| Metric | Count |
|---|---:|
| Audit targets (105) | 105 |
| Complete (implementation) | 105 |
| Pending | 0 |
| Blocked | 0 |
| Manual verification Passed | 1 (pilot only) |
| Manual verification Pending | 104 (all batches except Margin Interest pilot Passed) |

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
| 46 | Business Valuation | `business-valuation-calculator` | 10 | Complete | `d4afaed149e66ef7c525cafdb09cff5423e22757` | Pending | Synced selectors; monetary inputs convert; discount %, multiples, shares, scale unchanged |
| 47 | Consulting Fees | `consulting-fees-calculator` | 10 | Complete | `d4afaed149e66ef7c525cafdb09cff5423e22757` | Pending | Header selector; operating costs and target income convert; billable days/hours unchanged |
| 48 | Contribution Margin | `contribution-margin-calculator` | 10 | Complete | `d4afaed149e66ef7c525cafdb09cff5423e22757` | Pending | Shared selectors; price, variable cost, fixed costs convert; units and margin % unchanged |
| 49 | Cost Function | `cost-function-calculator` | 10 | Complete | `d4afaed149e66ef7c525cafdb09cff5423e22757` | Pending | Shared selectors; fixed/variable/total costs convert; quantities and slopes unchanged |
| 50 | Cost of Doing Business | `cost-of-doing-business-calculator` | 10 | Complete | `d4afaed149e66ef7c525cafdb09cff5423e22757` | Pending | Synced selectors; annual cost converts; billable days unchanged |
| 51 | Cost of Goods Sold | `cost-of-goods-sold-calculator` | 11 | Complete | `fa3faaabdae4f1e80b14e9e2f368eb232086eb81` | Pending | Synced selectors; inventory and COGS amounts convert |
| 52 | CPA | `cpa-calculator-cost-per-acquisition` | 11 | Complete | `fa3faaabdae4f1e80b14e9e2f368eb232086eb81` | Pending | Synced selectors; CPC/spend/CPA convert; clicks and conversions unchanged |
| 53 | CPC and CPM | `cpc-and-cpm-calculator` | 11 | Complete | `fa3faaabdae4f1e80b14e9e2f368eb232086eb81` | Pending | Shared selector; CPC, total cost, CPM convert; impressions/clicks/CTR unchanged |
| 54 | CPM | `cpm-calculator` | 11 | Complete | `fa3faaabdae4f1e80b14e9e2f368eb232086eb81` | Pending | Per-campaign selector; cost and CPM convert; impressions unchanged |
| 55 | CAC | `customer-acquisition-cost-calculator` | 11 | Complete | `fa3faaabdae4f1e80b14e9e2f368eb232086eb81` | Pending | Synced selectors; marketing/sales/CAC convert; customer count unchanged |
| 56 | Direct Material Price Variance | `direct-material-price-variance-calculator` | 12 | Complete | `aec07c70cbb7f60c3c0b4633e0266c92070ab6b4` | Pending | Synced selectors; standard/actual rates convert; quantity and variance sign unchanged |
| 57 | EVM | `evm-calculator` | 12 | Complete | `aec07c70cbb7f60c3c0b4633e0266c92070ab6b4` | Pending | Synced selectors; budget and costs convert; progress % and CPI/SPI unchanged |
| 58 | Effective Corporate Tax Rate | `effective-corporate-tax-rate-calculator` | 12 | Complete | `aec07c70cbb7f60c3c0b4633e0266c92070ab6b4` | Pending | Shared selectors; EBT and tax paid convert; effective rate % invariant to FX |
| 59 | EMV | `emv-calculator-expected-monetary-value` | 12 | Complete | `aec07c70cbb7f60c3c0b4633e0266c92070ab6b4` | Pending | Shared selectors; risk impacts convert; probabilities and EMV weighting unchanged |
| 60 | FIFO Inventory | `fifo-calculator-for-inventory` | 12 | Complete | `aec07c70cbb7f60c3c0b4633e0266c92070ab6b4` | Pending | Synced selectors; lot prices and selling price convert; FIFO qty order and margin % unchanged |
| 61 | GMROI | `gmroi-calculator-gross-margin-return-on-investment` | 13 | Complete | 4c54e9005feb6746f68443d90ddd048eaffaf4b2 | Pending | Synced selectors; inventory and gross profit convert; GMROI ratio/% unchanged |
| 62 | Google AdSense | `google-adsense-calculator` | 13 | Complete | 4c54e9005feb6746f68443d90ddd048eaffaf4b2 | Pending | Synced selectors; CPC and revenue convert; pageviews/CTR/impressions unchanged |
| 63 | High-Low Method | `high-low-method-calculator` | 13 | Complete | 4c54e9005feb6746f68443d90ddd048eaffaf4b2 | Pending | Synced selectors; high/low costs and derived VC/fixed/total convert; units unchanged |
| 64 | Labor Cost | `labor-cost-calculator` | 13 | Complete | 4c54e9005feb6746f68443d90ddd048eaffaf4b2 | Pending | Synced selectors; wage and employer costs convert; hours and labor % unchanged |
| 65 | Lemonade Stand | `lemonade-stand-calculator` | 13 | Complete | 4c54e9005feb6746f68443d90ddd048eaffaf4b2 | Pending | Synced selector; all cost/price fields convert; servings unchanged |
| 66 | Lerner Index | `lerner-index-calculator` | 14 | Complete | 14b14abe0a1b0b1850d84dcd5582662f3a1cc1c7 | Pending | Synced selectors; price and marginal cost convert; Lerner index invariant |
| 67 | Liquid Net Worth | `liquid-net-worth-calculator` | 14 | Complete | 14b14abe0a1b0b1850d84dcd5582662f3a1cc1c7 | Pending | Synced selectors; assets and liabilities convert; negative net worth preserved |
| 68 | Man-Hours | `man-hours-calculator` | 14 | Complete | 14b14abe0a1b0b1850d84dcd5582662f3a1cc1c7 | Pending | Synced selectors (×3); hourly pay converts; people/hours/man-hours unchanged |
| 69 | Online Marketing Conversion | `online-marketing-conversion-calculator` | 14 | Complete | 14b14abe0a1b0b1850d84dcd5582662f3a1cc1c7 | Pending | Synced money selectors; spend and revenue convert; funnel counts and % unchanged |
| 70 | Operating Asset Turnover | `operating-asset-turnover-calculator` | 14 | Complete | 14b14abe0a1b0b1850d84dcd5582662f3a1cc1c7 | Pending | Synced selectors; assets and sales convert; turnover ratio invariant |
| 71 | Payback Period | `payback-period-calculator` | 15 | Complete | cf78d13c6333d9753395ff35f0d248c79eaea000 | Pending | Synced selectors; investment and cash flows convert; payback years unchanged |
| 72 | Pre and Post Money Valuation | `pre-and-post-money-valuation-calculator` | 15 | Complete | cf78d13c6333d9753395ff35f0d248c79eaea000 | Pending | Synced selector; investment and valuations convert; equity % unchanged |
| 73 | PVGO | `pvgo-calculator` | 15 | Complete | cf78d13c6333d9753395ff35f0d248c79eaea000 | Pending | Synced selectors; earnings and share price convert; EPS/PVGO method preserved |
| 74 | Price / Quantity | `price-quantity-calculator` | 15 | Complete | cf78d13c6333d9753395ff35f0d248c79eaea000 | Pending | Synced selector; prices and savings convert; quantities unchanged |
| 75 | Profitability Index | `profitability-index-calculator` | 15 | Complete | cf78d13c6333d9753395ff35f0d248c79eaea000 | Pending | Synced selectors; investment and PV convert; PI ratio invariant |
| 76 | Revenue Per Employee | `revenue-per-employee-calculator` | 16 | Complete | dced67764af8fc5daf1d80b436b097a1325cdaf9 | Pending | Synced selectors; revenue converts; employee count and per-head formula unchanged |
| 77 | ROAS | `roas-calculator` | 16 | Complete | dced67764af8fc5daf1d80b436b097a1325cdaf9 | Pending | Synced selectors; ad spend and revenue convert; ROAS %/ratio and ad-only ROI invariant |
| 78 | SaaS Lifetime Value | `saas-lifetime-value-calculator` | 16 | Complete | dced67764af8fc5daf1d80b436b097a1325cdaf9 | Pending | Synced selector; ARPA/revenue/expansion convert; margin %, churn %, accounts unchanged |
| 79 | Sales Commission | `sales-commission-calculator` | 16 | Complete | dced67764af8fc5daf1d80b436b097a1325cdaf9 | Pending | Header selector; monetary inputs convert; commission % and tier semantics unchanged |
| 80 | Smoker's CTC | `smokers-ctc-calculator` | 16 | Complete | dced67764af8fc5daf1d80b436b097a1325cdaf9 | Pending | Synced selectors; wage and pack price convert; time/holiday/life-days unchanged |
| 81 | Software Contract Value | `software-contract-value-calculator` | 17 | Complete | `137c28d5bd1423e33e32ff06b3cb6bf37c2f36a3` | Pending | Synced selectors; retail price converts; seats, discount %, and duration unchanged |
| 82 | Website Ad Revenue | `website-ad-revenue-calculator` | 17 | Complete | `137c28d5bd1423e33e32ff06b3cb6bf37c2f36a3` | Pending | Synced selectors (×2); page RPM converts; visits and page views unchanged |
| 83 | YouTube Money | `youtube-money-calculator` | 17 | Complete | `137c28d5bd1423e33e32ff06b3cb6bf37c2f36a3` | Pending | Synced selectors (×3); RPM converts; view counts and periods unchanged |
| 84 | Jensen's Alpha | `jensens-alpha-calculator` | 17 | Complete | `137c28d5bd1423e33e32ff06b3cb6bf37c2f36a3` | Pending | Synced selectors (×2); beginning and ending values convert; return % and alpha unchanged by FX alone |
| 85 | Margin Interest | `margin-interest-calculator` | 17 | Complete | `b968634` | Passed | Pilot Complete (see Pilot section); Batch 17 slot already done |
| 86 | MVA | `mva-calculator` | 18 | Complete | 6227e6f | Pending | Synced selectors (×2); share price + capital invested convert; shares outstanding and MVA sign unchanged |
| 87 | MIRR | `mirr-calculator` | 18 | Complete | 6227e6f | Pending | Synced selectors (×3); initial + yearly cash flows convert; financing/reinvestment rates and MIRR % unchanged |
| 88 | Money Market Account | `money-market-account-calculator` | 18 | Complete | 6227e6f | Pending | Synced selectors (×3); balance, recurring, and result amounts convert; SIP/one-time mode and return % unchanged |
| 89 | Moving Average | `moving-average-calculator` | 18 | Complete | 6227e6f | Pending | Synced selectors (×2); price series + SMA convert; lookback length unchanged |
| 90 | Mutual Fund | `mutual-fund-calculator` | 18 | Complete | 6227e6f | Pending | Synced selectors (×2); SIP/lump contributions and maturity convert; return % and periods unchanged |
| 91 | NOPAT | `nopat-calculator` | 19 | Complete | f5ac043 | Pending | Synced selectors (×2); operating profit and precise-mode money fields convert; tax rate % and modes unchanged |
| 92 | NPV | `npv-calculator-net-present-value` | 19 | Complete | f5ac043 | Pending | Synced selectors (×3); initial costs + all cash flows convert; signs and discount % unchanged |
| 93 | Opportunity Cost | `opportunity-cost-calculator` | 19 | Complete | f5ac043 | Pending | Synced selectors (×3); money to spend and savings outputs convert; tax/inflation/return % unchanged |
| 94 | Percentage Return | `percentage-return-calculator` | 19 | Complete | f5ac043 | Pending | Synced selectors (×2); invested and returned amounts convert; percentage and time modes unchanged |
| 95 | Perpetuity | `perpetuity-calculator` | 19 | Complete | f5ac043 | Pending | Synced selectors (×2); dividend and PV convert; discount and growth rates unchanged |
| 96 | Present Value | `present-value-calculator` | 20 | Complete | e18538a | Pending | Synced selectors (×2); future value converts; periods and rate % unchanged |
| 97 | Rate of Return | `rate-of-return-calculator` | 20 | Complete | e18538a | Pending | Synced selector; initial, final, and periodic cash flows convert; solved return % FX-invariant |
| 98 | ROCE | `return-on-capital-employed-calculator-roce` | 20 | Complete | e18538a | Pending | Synced selectors; EBIT and balance-sheet money fields convert; ROCE % unchanged |
| 99 | ROI | `roi-calculator` | 20 | Complete | e18538a | Pending | Synced selectors (×3); invested, contribution, and returned convert; ROI and annualized % FX-invariant |
| 100 | Simple Interest | `simple-interest-calculator` | 20 | Complete | e18538a | Pending | Synced selectors (×3); principal converts; rate % and term unchanged |
| 101 | Sinking Fund | `sinking-fund-calculator` | 21 | Complete | ae81dbb | Pending | Synced selectors (×2); target savings converts; USSF, rate %, compounding, period unchanged |
| 102 | Time Value of Money | `time-value-of-money-calculator` | 21 | Complete | ae81dbb | Pending | Synced selector; PV and FV convert together; rate, term, compounding unchanged |
| 103 | Treynor Ratio | `treynor-ratio-calculator` | 21 | Complete | ae81dbb | Pending | Synced selectors (×2); beginning and ending convert; return %, beta, Treynor % FX-invariant |
| 104 | TTM | `ttm-calculator-trailing-twelve-months` | 21 | Complete | ae81dbb | Pending | Synced selector; four quarterly flows convert; TTM sum scales; mode/order unchanged |
| 105 | Value at Risk (VaR) | `value-at-risk-calculator-var` | 21 | Complete | ae81dbb | Pending | Synced selectors (×2); portfolio value converts; σ, μ, probabilities, horizon unchanged |

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

## Phase 3 state

**ALL BATCHES COMPLETE** — 105/105 audit targets have FX conversion implementation. Manual QA remains Pending for every tool except the Margin Interest pilot (Passed).

## Batch 21 notes

- Local commit: `fix(currency): integrate conversion batch 21 calculators` `ae81dbbcb019308036e8a93915ffe3a3f17c586b`.
- Provider slug allowlist extended for Batch 21 (preserves prior batches + Margin Interest pilot).
- Sinking Fund: synced selectors (×2); money to accumulate converts; USSF factor, compounding frequency, rate %, and period unchanged.
- Time Value of Money: synced selector; present and future values convert together without circular edits; interest rate, term, and compounding unchanged.
- Treynor Ratio: synced selectors (×2); beginning and ending portfolio values convert; portfolio return %, risk-free rate, beta, and Treynor ratio invariant to FX-only changes.
- TTM: synced selector across quarters and TTM result; Q0–Q3 monetary flows convert; sum order and mode unchanged.
- Value at Risk (VaR): synced selectors (×2); portfolio value converts; VaR amount scales; standard deviation, expected return, tail probability, and horizon unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 20 notes

- Local commit: `fix(currency): integrate conversion batch 20 calculators` `e18538a36272f01413568060174fe65b681b4836`.
- Provider slug allowlist extended for Batch 20 (preserves prior batches + Margin Interest pilot).
- Present Value: synced selectors (×2); future value converts; present value and total interest follow; periods and periodic rate % unchanged.
- Rate of Return: synced selector; initial, final, and periodic cash flows convert before solving; nominal/effective rate semantics and return % FX-invariant.
- ROCE: synced selectors; EBIT, assets/liabilities/equity fields convert together; ROCE % invariant.
- ROI: synced selectors (×3); initial, contribution, and returned amounts convert; ROI, rate-of-return link, and annualized ROI % FX-invariant.
- Simple Interest: synced selectors (×3); principal converts; interest rate and term unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 19 notes

- Local commit: `fix(currency): integrate conversion batch 19 calculators` `f5ac043`.
- Provider slug allowlist extended for Batch 19 (preserves prior batches + Margin Interest pilot).
- NOPAT: synced selectors (×2); all money inputs in simple/precise modes convert; tax rate % and formula mode unchanged.
- NPV: synced selectors (×3); initial costs and every annual cash flow convert together; signs and discount % unchanged.
- Opportunity Cost: synced selectors (×3); money to spend converts; savings and opportunity-cost outputs follow; return/tax/inflation % unchanged.
- Percentage Return: synced selectors (×2); invested and returned amounts convert; gain/loss amounts and return % invariant to FX-only changes.
- Perpetuity: synced selectors (×2); dividend payment and present value convert; discount and growth rates unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 18 notes

- Local commit: `fix(currency): integrate conversion batch 18 calculators` `6227e6f`.
- Provider slug allowlist extended for Batch 18 (preserves prior batches + Margin Interest pilot).
- MVA: synced selectors (×2); share price and capital invested convert; shares outstanding and MVA sign unchanged.
- MIRR: synced selectors (×3); initial investment and yearly cash flows convert; financing/reinvestment rates and MIRR % unchanged.
- Money Market Account: synced selectors (×3); starting balance, recurring deposits, and projected amounts convert; SIP/one-time mode and return % unchanged.
- Moving Average: synced selectors (×2); price series and SMA convert; lookback length unchanged.
- Mutual Fund: synced selectors (×2); SIP/lump contributions and maturity convert; return %, periods, and compounding unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 17 notes

- Local commit: `fix(currency): integrate conversion batch 17 calculators` `137c28d5bd1423e33e32ff06b3cb6bf37c2f36a3`.
- Provider slug allowlist extended for Batch 17 (preserves prior batches + Margin Interest pilot).
- Software Contract Value: synced selectors; retail price converts; seats, discount %, and contract months unchanged.
- Website Ad Revenue: synced selectors (×2); page RPM converts; visits, page views per visit, and page view totals unchanged.
- YouTube Money: synced selectors (×3); RPM converts; view counts and revenue time periods unchanged.
- Jensen's Alpha: synced selectors (×2); beginning and ending portfolio values convert together; risk-free %, beta, market return %, and alpha % invariant to FX-only changes.
- Margin Interest (#85): **not modified** — Pilot Complete, manual verification Passed (reference implementation for this batch).
- Manual verification left Pending for user reference comparison.

## Batch 16 notes

- Local commit: `fix(currency): integrate conversion batch 16 calculators` `dced67764af8fc5daf1d80b436b097a1325cdaf9`.
- Provider slug allowlist extended for Batch 16 (preserves prior batches + Margin Interest).
- Revenue Per Employee: synced selectors (×2); revenue converts; employee count and revenue-per-employee ratio unchanged by FX alone.
- ROAS: synced selectors; ad spend and ad revenue convert; ROAS %, ratio, and ad-only ROI unchanged.
- SaaS Lifetime Value: synced selector across money fields; ARPA, recurring revenue, expansion, and LTV amounts convert; churn/margin % and account count unchanged.
- Sales Commission: header currency selector; sales, COGS, expenses, salary, and quota convert; percentage brackets and derived margins unchanged.
- Smoker's CTC: synced selectors on wage/pack and labor/cigarette outputs; wage and pack price convert; break times, schedules, and life-expectancy days unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 15 notes

- Local commit: `fix(currency): integrate conversion batch 15 calculators` `cf78d13c6333d9753395ff35f0d248c79eaea000`.
- Provider slug allowlist extended for Batch 15 (preserves prior batches + Margin Interest).
- Payback Period: synced selectors (×3 pattern); investment, steady annual CF, and irregular years convert; discount % and payback durations unchanged.
- Pre and Post Money Valuation: synced selector; investment, pre-money, and post-money convert; investor equity % unchanged.
- PVGO: synced selectors; earnings and share price convert; shares, cost of equity %, and PVGO sign/method unchanged.
- Price / Quantity: synced selector; pack prices and derived monetary outputs convert; unit quantities unchanged.
- Profitability Index: synced selectors; initial investment and PV of future CF convert; PI ratio invariant to FX-only changes.
- Manual verification left Pending for user reference comparison.

## Batch 14 notes

- Local commit: `fix(currency): integrate conversion batch 14 calculators` `14b14abe0a1b0b1850d84dcd5582662f3a1cc1c7`.
- Provider slug allowlist extended for Batch 14 (preserves prior batches + Margin Interest).
- Lerner Index: synced selectors; price and marginal cost convert; Lerner index decimal invariant to FX alone.
- Liquid Net Worth: synced selectors; liquid assets and liabilities convert; subtraction and negative outcomes preserved.
- Man-Hours: synced selectors (×3); hourly pay converts; people, hours, man-hours, and productivity unchanged.
- Online Marketing Conversion: synced money selectors; ad spend and revenue fields convert; visits, leads, customers, and conversion % unchanged.
- Operating Asset Turnover: synced selectors; operating asset components and sales convert; turnover multiple invariant.
- Manual verification left Pending for user reference comparison.

## Batch 13 notes

- Local commit: `fix(currency): integrate conversion batch 13 calculators` `4c54e9005feb6746f68443d90ddd048eaffaf4b2`.
- Provider slug allowlist extended for Batch 13 (preserves prior batches + Margin Interest).
- GMROI: synced selectors; starting/final/average inventory and gross profit convert; GMROI ratio and % invariant to FX alone.
- Google AdSense: synced selectors; CPC converts; impressions, clicks, CTR, and pageviews unchanged.
- High-Low Method: synced selectors; high and low activity costs convert; variable cost per unit, fixed cost, total cost scale; activity units unchanged.
- Labor Cost: synced selectors; pay rate, additional costs, revenue, and payroll outputs convert; hours and labor cost % unchanged.
- Lemonade Stand: synced selector across money fields; ingredient, cup, permit, selling price, and profit amounts convert; servings unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 12 notes

- Local commit: `fix(currency): integrate conversion batch 12 calculators` `aec07c70cbb7f60c3c0b4633e0266c92070ab6b4`.
- Provider slug allowlist extended for Batch 12 (preserves prior batches + Margin Interest).
- Direct Material Price Variance: synced selectors; standard and actual unit rates convert; quantity and favorable/unfavorable status unchanged.
- EVM: synced selectors; BAC budget and actual cost convert; scheduled/actual progress % and performance indices unchanged.
- Effective Corporate Tax Rate: shared selectors; earnings before tax and income tax paid convert; effective tax rate % unchanged by FX alone.
- EMV: shared selectors across risks and total; each risk impact converts; probabilities unchanged.
- FIFO Inventory: synced selectors; batch purchase prices and selling price convert; unit quantities and gross margin % unchanged.
- Progress commit: `Progress #56-60 Complete; totals 61/44; Batch 12 notes` `261515914f42ad48efa3a59c7fa3753f3d1ab6c5`.
- Manual verification left Pending for user reference comparison.

## Batch 11 notes

- Local commit: `fix(currency): integrate conversion batch 11 calculators` `fa3faaabdae4f1e80b14e9e2f368eb232086eb81`.
- Provider slug allowlist extended for Batch 11 (preserves prior batches + Margin Interest).
- Cost of Goods Sold: synced selectors; beginning inventory, purchases, ending inventory, and COGS display convert together.
- CPA: three synced selectors; average CPC converts; derived ad spend and CPA scale; clicks and conversions unchanged.
- CPC and CPM: shared selector; monetary fields (CPC, total cost, CPM) convert; impressions, clicks, and CTR unchanged.
- CPM: per-campaign currency selector; total cost and CPM convert; impressions unchanged; main and second campaigns independent.
- CAC: three synced selectors; marketing and sales costs convert; new customer count and CAC formula unchanged.
- Manual verification left Pending for user reference comparison.

## Batch 10 notes

- Local commit: `fix(currency): integrate conversion batch 10 calculators` `d4afaed149e66ef7c525cafdb09cff5423e22757`.
- Provider slug allowlist extended for Batch 10 (preserves prior batches + Margin Interest).
- Business Valuation: three synced selectors; cash flow, assets/liabilities, share price, and metric convert; discount %, multiples, shares, and cash-flow scale unchanged.
- Consulting Fees: display currency selector; all operating cost lines and target income convert; billable days and hours per day unchanged.
- Contribution Margin: shared selectors on money fields; price, variable cost, and fixed costs convert; unit count and margin % unchanged.
- Cost Function: shared selectors; fixed cost, variable per unit, and two-point total costs convert; quantities and derived cost-function slopes unchanged.
- Cost of Doing Business: synced input/result selectors; total annual cost converts; billable days unchanged.
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

## Out-of-ledger fixes

| Calculator | Slug | Status | Commit | Notes |
|---|---|---|---|---|
| Carried Interest Calculator | `carried-interest-calculator` | Complete | (see git) | Not in the 105 Phase 3 audit list; fixed on request. Synced selectors; initial+final convert together; %/years unchanged. |

## Changelog

- 2026-11-16: Carried Interest (`carried-interest-calculator`) out-of-ledger FX fix Complete; not in the 105 audit list.
- 2026-11-16: **Phase 3 ALL BATCHES COMPLETE** — Batch 21 (#101–#105) implementation Complete; totals 105/0 Complete/Pending; manual verification Pending.
- 2026-11-16: Batch 20 (#96–#100) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 19 (#91–#95) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 18 (#86–#90) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 17 (#81–#84) implementation Complete; #85 unchanged (pilot); manual verification Pending for #81–#84.
- 2026-11-16: Batch 16 (#76–#80) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 15 (#71–#75) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 14 (#66–#70) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 13 (#61–#65) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 12 (#56–#60) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 11 (#51–#55) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 10 (#46–#50) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 9 (#41–#45) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 8 (#36–#40) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 7 (#31–#35) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 6 (#26–#30) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 5 (#21–#25) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 4 (#16–#20) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 3 (#11–#15) implementation Complete; manual verification Pending.
- 2026-11-16: Batch 2 (#6–#10) implementation Complete; manual verification Pending.
- 2026-11-16: Created ledger from Phase 3 audit; recorded Margin Interest Pilot Complete; marked Batch 1 (#1–#5) Complete (implementation).

## Additional FX calculators (post Phase-3 105 audit)

| Calculator | Slug | Status | Notes |
|---|---|---|---|
| Mortgage Prepayment Calculator | `mortgage-prepayment-calculator` | Complete | Independent FX on mortgage amount, periodic prepayment, and lump-sum; normalize into mortgage currency before amortization. Manual verification Pending. |


