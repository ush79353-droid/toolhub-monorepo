import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WORKING_CAPITAL_FAQS } from './content';

export function WorkingCapitalGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-wc"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Working Capital?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Working capital measures short-term liquidity: the cushion between
        current assets and current liabilities. Managers, lenders, and investors
        use it to gauge whether a business can fund day-to-day operations and
        meet near-term obligations.
      </p>

      <h2
        id="current-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Current Assets?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current assets are expected to be realized, sold, or consumed within the
 normal operating cycle or about one year, for example cash, receivables,
        inventory, short-term investments, and prepaid expenses. Do not confuse
        them with total assets.
      </p>

      <h2
        id="current-liabilities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Current Liabilities?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current liabilities are obligations due within the operating cycle or
 about one year; accounts payable, short-term loans, accruals, taxes
        payable, and the current portion of long-term debt, among others.
      </p>

      <h2
        id="wc-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Working Capital = Current Assets − Current Liabilities</p>
        <p>Example: 250,000 − 150,000 = 100,000</p>
      </div>

      <h2
        id="wc-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Working Capital Ratio = Current Assets / Current Liabilities</p>
        <p>Example: 300,000 / 150,000 = 2.00</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
 This ratio is the current ratio: a dimensionless liquidity measure. It
        is not the same as the monetary working capital balance.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Working Capital
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter current assets and current liabilities for the same date.</li>
        <li>Subtract liabilities from assets to get working capital.</li>
        <li>Divide assets by liabilities for the working capital ratio when CL &gt; 0.</li>
        <li>Optionally enter period revenue and beginning/ending balances for turnover.</li>
      </ol>

      <h2
        id="positive-vs-negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Positive Working Capital vs. Negative Working Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive WC means current assets exceed current liabilities. Negative WC
        means the reverse. Neither is automatically “good” or “bad” without
        industry context, cash timing, and covenant constraints.
      </p>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Working Capital Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ideal levels vary by industry and operating cycle. Benchmark peers and
        multi-year trends rather than a single universal threshold.
      </p>

      <h2
        id="net-wc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Net Working Capital?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net working capital is often used interchangeably with working capital
        (CA − CL). Some valuation models refine the definition (for example
        excluding excess cash). Always confirm the definition in your model.
      </p>

      <h2
        id="turnover"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover Ratio
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Beginning WC = Beginning CA − Beginning CL</p>
        <p>Ending WC = Ending CA − Ending CL</p>
        <p>Average WC = (Beginning WC + Ending WC) / 2</p>
        <p>Turnover = Revenue / Average WC</p>
      </div>

      <h2
        id="turnover-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital Turnover Calculation Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Company Alpha · Revenue = $1,500,000</p>
        <p>Beginning CA/CL = $400,000 / $250,000 → Beg WC = $150,000</p>
        <p>Ending CA/CL = $500,000 / $300,000 → End WC = $200,000</p>
        <p>Average WC = $175,000 · ΔWC = +$50,000</p>
        <p>Turnover ≈ 8.57x</p>
      </div>

      <h2
        id="change-in-wc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Changes in Working Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Change in WC = Ending WC − Beginning WC. Rising WC can absorb cash
 (growth in inventory or receivables). Falling WC can free cash; or
        signal stretched payables. Interpret alongside the cash flow statement.
      </p>

      <h2
        id="cash-flow"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Capital and Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Liquidity balances and cash movements are related but not identical. The
        cash conversion cycle (inventory, receivables, payables) helps explain
 how WC drives operating cash needs; especially for retail,
        manufacturing, and high-growth firms.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Working Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accelerate collections, right-size inventory, negotiate supplier terms
        without damaging relationships, and align short-term funding with liquid
        assets. Seasonal businesses should plan peak WC needs explicitly.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Working Capital Ratios
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Classification policies, seasonality, off-balance-sheet arrangements,
        quality of receivables/inventory, and industry norms limit single-ratio
        conclusions. Pair WC metrics with cash flow, coverage, and peer analysis.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Working Capital Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Mixing periods between income statement and balance sheet</li>
        <li>Treating empty inputs as zeros</li>
        <li>Dividing by zero liabilities or zero average WC</li>
        <li>Confusing WC amount with the WC ratio</li>
        <li>Using total assets instead of current assets</li>
        <li>Assuming positive WC always means strong cash flow</li>
      </ul>

      <h2
        id="wc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...WORKING_CAPITAL_FAQS]} />
      </div>
    </article>
  );
}
