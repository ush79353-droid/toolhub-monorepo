| # | Calculator | Slug | Component | Registry | MongoDB | FX | Status | Issues |
|---|---|---|---|---|---|---|---|---|
| 1 | Car Interest Calculator | `car-interest-calculator` | `CarInterestCalculator` | OK | A/D/I/E | **FX gap** | **PARTIAL** | Has `CurrencySelect`+`convertCurrency` in `car-interest/*`, but slug **not** in `CURRENCY_CONVERSION_SLUGS` (`page.tsx`) so rates provider won’t load |
| 2 | Cash Back or Low Interest Calculator | `cash-back-or-low-interest-calculator` | `CashBackOrLowInterestCalculator` | OK | A/D/I/E | N/A | **DEVELOPED** | — |
| 3 | Interest Coverage Ratio Calculator | `interest-coverage-ratio-calculator` | `InterestCoverageRatioCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 4 | Interest Per Day Calculator | `interest-per-day-calculator` | `InterestPerDayCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 5 | Loan Interest Calculator | `loan-interest-calculator` | `LoanInterestCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Module exists (`loan-interest/*`); not in live keys/lazy/details/BE/sitemaps; FX helpers present, slug not in FX set |
| 6 | Post Judgment Interest Calculator | `post-judgment-interest-calculator` | `PostJudgmentInterestCalculator` | OK | A/D/I/E | N/A | **DEVELOPED** | — |
| 7 | TDS Interest Calculator | `tds-interest-calculator` | `TdsInterestCalculator` | **Incomplete** | A/D/I/E | N/A | **PARTIAL** | In keys allowlists but **no** `index.ts` lazy entry; missing both sitemaps |
| 8 | Times Interest Earned Ratio Calculator | `times-interest-earned-ratio-calculator` | `TimesInterestEarnedCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Module present; live registry absent; FX helpers w/o FX slug |
| 9 | Interest Rate Parity Calculator | `interest-rate-parity-calculator` | `InterestRateParityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same pattern as #8 |
| 10 | Debt Calculator | `debt-calculator` | `DebtCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | `debt/*` present; registry absent; FX helpers w/o FX slug |
| 11 | After-tax Cost of Debt Calculator | `after-tax-cost-of-debt-calculator` | `AfterTaxCostOfDebtCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 12 | Debt Avalanche Calculator | `debt-avalanche-calculator` | `DebtAvalancheCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 13 | Debt Service Coverage Ratio (DSCR) | `debt-service-coverage-ratio-calculator-dscr` | `DebtServiceCoverageRatioCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 14 | Debt Snowball Calculator | `debt-snowball-calculator` | `DebtSnowballCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 15 | Debt to Asset Ratio Calculator | `debt-to-asset-ratio-calculator` | `DebtToAssetRatioCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 16 | Debt to Equity Calculator | `debt-to-equity-calculator` | `DebtToEquityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 17 | Debt-to-Capital Ratio Calculator | `debt-to-capital-ratio-calculator` | `DebtToCapitalRatioCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 18 | Net Debt Calculator | `net-debt-calculator` | `NetDebtCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 19 | EBITDA Margin Calculator | `ebitda-margin-calculator` | `EbitdaMarginCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 20 | Gross Margin Calculator | `gross-margin-calculator` | `GrossMarginCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 21 | Margin and Markup Calculator | `margin-and-markup-calculator` | `MarginAndMarkupCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 22 | Margin and VAT Calculator | `margin-and-vat-calculator` | `MarginAndVatCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 23 | Margin Calculator Classic | `margin-calculator-classic` | `MarginCalculatorClassic` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 24 | Margin Call Calculator | `margin-call-calculator` | `MarginCallCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 25 | Margin of Safety Calculator | `margin-of-safety-calculator` | `MarginOfSafetyCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 26 | Operating Margin Calculator | `operating-margin-calculator` | `OperatingMarginCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 27 | Annuity Calculator | `annuity-calculator` | `AnnuityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | `annuity/*` present; registry absent |
| 28 | Annuity Payout Calculator | `annuity-payout-calculator` | `AnnuityPayoutCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 29 | Deferred Annuity Calculator | `deferred-annuity-calculator` | `DeferredAnnuityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 30 | Future Value of Annuity Calculator | `future-value-of-annuity-calculator` | `FutureValueOfAnnuityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 31 | Growing Annuity Calculator | `growing-annuity-calculator` | `GrowingAnnuityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 32 | Immediate Annuity Calculator | `immediate-annuity-calculator` | `ImmediateAnnuityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 33 | Lottery Annuity Calculator | `lottery-annuity-calculator` | `LotteryAnnuityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 34 | Loan Repayment / Loan Payoff | `loan-repayment-calculator-loan-payoff-calculator` | `LoanRepaymentCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | Treated as one tool |
| 35 | Present Value of Annuity Calculator | `present-value-of-annuity-calculator` | `PresentValueOfAnnuityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same annuity pattern |
| 36 | Variable Annuity Calculator | `variable-annuity-calculator` | `VariableAnnuityCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 37 | Overtime Calculator | `overtime-calculator` | `OvertimeCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | `overtime/*` present; registry absent |
| 38 | California Overtime Calculator | `california-overtime-calculator` | `CaliforniaOvertimeCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 39 | Florida Overtime Calculator | `florida-overtime-calculator` | `FloridaOvertimeCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 40 | Georgia Overtime Calculator | `georgia-overtime-calculator` | `GeorgiaOvertimeCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 41 | Illinois Overtime Calculator | `illinois-overtime-calculator` | `IllinoisOvertimeCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 42 | New York Overtime Calculator | `new-york-overtime-calculator` | `NewYorkOvertimeCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 43 | Overtime Paycheck Calculator | `overtime-paycheck-calculator` | `OvertimePaycheckCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 44 | Salary Calculator With Overtime | `salary-calculator-with-overtime` | `SalaryWithOvertimeCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 45 | Texas Overtime Calculator | `texas-overtime-calculator` | `TexasOvertimeCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 46 | Gross Rent Multiplier Calculator | `gross-rent-multiplier-calculator` | `GrossRentMultiplierCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | `gross-rent-multiplier/*` present; registry absent |
| 47 | Net Effective Rent Calculator | `net-effective-rent-calculator` | `NetEffectiveRentCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 48 | Prorated Rent Calculator | `prorated-rent-calculator` | `ProratedRentCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 49 | Rent Increase Calculator | `rent-increase-calculator` | `RentIncreaseCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same rent pattern |
| 50 | Rent or Buy Calculator | `rent-or-buy-calculator` | `RentOrBuyCalculator` | **Missing** | A/D/I/E | FX gap | **PARTIAL** | Same |
| 51 | Rent Split Calculator | `rent-split-calculator` | `RentSplitCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 52 | Rent vs. Buy Calculator | `rent-vs-buy-calculator` | `RentVsBuyCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 53 | Payment Calculator | `payment-calculator` | `PaymentCalculator` | OK | A/D/I/E | N/A | **DEVELOPED** | Fixed USD |
| 54 | Balloon Payment Calculator | `balloon-payment-calculator` | `BalloonPaymentCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 55 | Bi-Weekly Mortgage Payment Calculator | `bi-weekly-mortgage-payment-calculator` | `BiWeeklyMortgagePaymentCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 56 | Coupon Payment Calculator | `coupon-payment-calculator` | `CouponPaymentCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 57 | Deferred Payment Loan Calculator | `deferred-payment-loan-calculator` | `DeferredPaymentLoanCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 58 | Loan Payment Calculator | `loan-payment-calculator` | `LoanPaymentCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 59 | Mortgage with Extra Payments Calculator | `mortgage-with-extra-payments-calculator` | `MortgageWithExtraPaymentsCalculator` | OK | A/D/I/E | Phase2 (static) | **DEVELOPED** | — |
| 60 | Stimulus Check Calculator (40k Cap) | `stimulus-check-calculator-40k-cap` | `StimulusCheck40kCalculator` | OK | A/D/I/E | N/A | **DEVELOPED** | Historical / fixed USD |
| 61 | California Stimulus Check II Calculator | `california-stimulus-check-ii-calculator` | `CaliforniaStimulusCheckIiCalculator` | OK | A/D/I/E | N/A | **DEVELOPED** | Historical / fixed USD |
| 62 | Second Stimulus Check (HEALS Act) | `second-stimulus-check-calculator-heals-act` | `HealsActStimulusCalculator` | Soft gap | A/D/I/E | N/A | **PARTIAL** | In `keys.ts` + lazy/details/BE; **missing** `frontend/.../registry/tool.key.ts` APPROVED |
| 63 | Second Stimulus Check – $900 Billion Bill | `second-stimulus-check-calculator-900-billion-bill` | `SecondStimulus900BillionCalculator` | Soft gap | A/D/I/E | N/A | **PARTIAL** | Missing `frontend/src/app/sitemap.ts` entry (present in `registry/sitemap.ts`) |
| 64 | Second Stimulus Check – CASH Act | `second-stimulus-check-calculator-cash-act` | `CashActStimulusCalculator` | OK | A/D/I/E | N/A | **DEVELOPED** | Historical / fixed USD |
| 65 | Second Stimulus Check – HEROES Act | `second-stimulus-check-calculator-heroes-act` | `HeroesActStimulusCalculator` | OK | A/D/I/E | N/A | **DEVELOPED** | Historical / fixed USD |

MongoDB column shorthand: **A**=`isActive`, **D**=`isDeveloped`, **I**=`indexable`, **E**=`embedEnabled` (all true where shown).

---

## Calculators requiring attention