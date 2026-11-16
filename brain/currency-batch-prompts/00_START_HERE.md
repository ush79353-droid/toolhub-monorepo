# OmegaCalculators — Currency Conversion Batches 4–21

This ZIP contains **18 standalone Cursor prompts**, one per batch, based **exactly** on the 105-currency-selector audit supplied by the user. Batches 1–3 already have separate prompts and are **not reissued here**.

## How to install and run

1. Extract this ZIP **inside your project's `brain/` folder**. It creates `brain/currency-batch-prompts/`. If you extract it at project root instead, move its `currency-batch-prompts/` folder into `brain/`.
2. To run just the next batch, paste this into Cursor:

   `Read brain/currency-batch-prompts/Batch_04.md and execute ONLY Batch 4. Update brain/CURRENCY_CONVERSION_PROGRESS.md. Stop after Batch 4 and report statuses and local commit hashes. Do not push.`

3. Review Cursor's report and manually check conversions against the reference website. To run a later batch, change only `Batch_04.md` and `Batch 4` to the chosen number.
4. **Don't ask Cursor to execute the entire folder**; one file = one approved batch. These prompts are instructions, not automation scripts.
5. If your `brain/CURRENCY_CONVERSION_PROGRESS.md` already exists, **preserve it**. The ZIP does not include or overwrite that tracking file.

## Scope

- Original audit: **142** submitted; **105** confirmed user/Cursor-owned tools with currency selectors; **35** without; **2** missing. Only audited 105 are conversion candidates.
- Batches 1–3: **15** planned targets, handled outside this ZIP; their actual code/manual QA statuses must come from `brain/CURRENCY_CONVERSION_PROGRESS.md`, not assumed.
- This ZIP: batches 4–21 = **90 audit rows**. Of these, **Margin Interest** (#85, Batch 17) is an already-verified pilot and is **audit-only**. Thus **89 possible new changes**, subject to existing status and code inspection.
- No colleague calculators, no global switch of `CurrencySelect`, no automatic next-batch execution, no push/pull/sync.
- Stored FX rates may be stale until the server's existing API key/cron issue is resolved; prompts require a warning and forbid silent 1:1 fallback.

## Batch index

| File | Tools | Notes |
|---|---|---|
| `Batch_04.md` | Compound Growth, Compound Interest, Compound Interest Rate, Continuous Compound Interest, DCF | Five to integrate |
| `Batch_05.md` | Discount Rate, Effective Annual Yield, Expected Utility, Expense Ratio, FD | Five to integrate |
| `Batch_06.md` | Future Value, Hedge Ratio, Holding Period Return, Impermanent Loss, Information Ratio | Five to integrate |
| `Batch_07.md` | Interest Rate, Investment, Investment Fee, IRR, 3D Printer Buy vs Outsource | Five to integrate |
| `Batch_08.md` | Accumulated Depreciation, Additional Funds Needed, A/R Days, Average Collection Period, Average Fixed Cost | Five to integrate |
| `Batch_09.md` | Break-even, Build vs. Buy, Burn Rate, Business Budget, Business Loan | Five to integrate |
| `Batch_10.md` | Business Valuation, Consulting Fees, Contribution Margin, Cost Function, Cost of Doing Business | Five to integrate |
| `Batch_11.md` | Cost of Goods Sold, CPA, CPC and CPM, CPM, CAC | Five to integrate |
| `Batch_12.md` | Direct Material Price Variance, EVM, Effective Corporate Tax Rate, EMV, FIFO Inventory | Five to integrate |
| `Batch_13.md` | GMROI, Google AdSense, High-Low Method, Labor Cost, Lemonade Stand | Five to integrate |
| `Batch_14.md` | Lerner Index, Liquid Net Worth, Man-Hours, Online Marketing Conversion, Operating Asset Turnover | Five to integrate |
| `Batch_15.md` | Payback Period, Pre and Post Money Valuation, PVGO, Price / Quantity, Profitability Index | Five to integrate |
| `Batch_16.md` | Revenue Per Employee, ROAS, SaaS Lifetime Value, Sales Commission, Smoker's CTC | Five to integrate |
| `Batch_17.md` | Software Contract Value, Website Ad Revenue, YouTube Money, Jensen's Alpha, Margin Interest | Four to integrate; Margin Interest audit-only |
| `Batch_18.md` | MVA, MIRR, Money Market Account, Moving Average, Mutual Fund | Five to integrate |
| `Batch_19.md` | NOPAT, NPV, Opportunity Cost, Percentage Return, Perpetuity | Five to integrate |
| `Batch_20.md` | Present Value, Rate of Return, ROCE, ROI, Simple Interest | Five to integrate |
| `Batch_21.md` | Sinking Fund, Time Value of Money, Treynor Ratio, TTM, Value at Risk (VaR) | Five to integrate |

## Future audit

After the last batch, give ChatGPT the updated `brain/CURRENCY_CONVERSION_PROGRESS.md` and the relevant Cursor completion reports. Audit the full **105-row** list for unimplemented/blocked conversion, incorrect ownership, missing FX loading, and manual verification still pending. A prompt-written status is **not** implementation proof; a static check is **not** a functional QA pass.
