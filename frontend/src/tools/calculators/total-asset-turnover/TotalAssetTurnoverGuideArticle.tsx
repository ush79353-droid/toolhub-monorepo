import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TOTAL_ASSET_TURNOVER_FAQS } from './content';

export function TotalAssetTurnoverGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-tat"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Total Asset Turnover?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total asset turnover (TAT) measures how efficiently a company uses its
        asset base to generate revenue. It compares period revenue with average
        total assets employed during that period. Analysts use it to study
 operational efficiency and asset utilization; not profit margins.
      </p>

      <h2
        id="tat-meaning"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total Asset Turnover Ratio Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A ratio of 2.00x means the business generated about 2 units of revenue
        for every 1 unit of average total assets. Higher turnover indicates more
        sales per unit of assets; it does not by itself prove higher
        profitability.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total Asset Turnover Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>TAT = Revenue / Average Total Assets</p>
        <p>Equivalent: TAT = 2 × Revenue / (Beginning Assets + Ending Assets)</p>
      </div>

      <h2
        id="average-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average Total Assets Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Average Assets = (Beginning Assets + Ending Assets) / 2</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses the simple two-point average. Firms with large
        intra-period asset swings may need monthly or quarterly averages for a
        more representative ratio.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Total Asset Turnover
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify beginning and ending total assets for the period.</li>
        <li>Compute average assets as their arithmetic mean.</li>
        <li>Identify revenue (net sales) for the same period.</li>
        <li>Divide revenue by average assets when the average is greater than zero.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Asset Turnover Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Company Alpha · Revenue = $10,000,000</p>
        <p>Beginning assets = $8,000,000 · Ending assets = $10,000,000</p>
        <p>Average assets = $9,000,000</p>
        <p>TAT = 10,000,000 / 9,000,000 ≈ 1.11x</p>
        <p>
          Interpretation: about $1.11 of revenue per $1 of average total assets.
        </p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select the currency label for monetary fields (denomination only).</li>
        <li>Enter beginning total assets.</li>
        <li>Enter ending total assets; average updates automatically.</li>
        <li>Enter period revenue; turnover updates automatically.</li>
        <li>Review the summary, breakdown, and interpretation.</li>
        <li>Use Share, Reload, or Clear as needed.</li>
      </ol>

      <h2
        id="what-counts-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Counts as Total Assets?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total assets typically include cash, receivables, inventory, prepaid
        expenses, property plant and equipment, intangibles, investments, and
        other recognized assets. Do not substitute current assets alone,
        shareholders’ equity, or net assets unless you intentionally redefine the
        metric.
      </p>

      <h2
        id="what-is-revenue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Revenue?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use net sales or comparable operating revenue for the period matching
        the asset balances. Revenue is not net income, operating income, gross
        profit, EBITDA, or cash flow.
      </p>

      <h2
        id="why-average"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Average Assets Are Used
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The income statement covers a period; the balance sheet is a snapshot.
        Averaging beginning and ending assets aligns the denominator with the
        period of revenue better than using ending assets alone.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Asset Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Low turnover often appears in capital-intensive businesses; high
        turnover is common in asset-light models. Always interpret against
 industry norms, business model, and multi-year trends; not a single
        absolute threshold.
      </p>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Total Asset Turnover Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ideal values differ by industry and strategy. A “good” ratio for a
        grocery retailer may be a poor fit for a utility. Benchmark peers with
        similar asset intensity and accounting policies.
      </p>

      <h2
        id="vs-fixed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total Asset Turnover vs. Fixed Asset Turnover
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Fixed Asset Turnover = Revenue / Average Net Fixed Assets</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed asset turnover focuses on PP&amp;E utilization. Total asset
        turnover includes current assets and other balance-sheet items as well.
      </p>

      <h2
        id="vs-inventory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total Asset Turnover vs. Inventory Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory turnover typically uses cost of goods sold and average
        inventory. It answers how quickly stock turns, not how much revenue the
        entire asset base supports.
      </p>

      <h2
        id="vs-profitability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Asset Turnover vs. Profitability and ROA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        High turnover with thin margins can produce modest profits; low turnover
        with high margins can also succeed. Return on assets connects the ideas
        when net income and assets are measured consistently.
      </p>

      <h2
        id="dupont"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Asset Turnover and the DuPont Analysis
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ROA ≈ Net Profit Margin × Asset Turnover</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expanded DuPont analysis also includes financial leverage to explain
 ROE. Margin, turnover, and leverage measure different drivers; keep
        definitions and periods aligned.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Businesses Improve Asset Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Raise sales, tighten inventory and receivables, retire idle assets,
        improve production and equipment utilization, and stage capital spending
        to demand. Selling assets can lift the ratio without improving long-term
 capability; judge changes in context.
      </p>

      <h2
        id="industry"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Industry Context
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retail often emphasizes inventory and store asset productivity.
        Manufacturing is capacity-driven and capital intensive. Service and many
        technology firms can be asset-light. Real estate and utilities typically
        show lower turnover because of large asset bases relative to periodic
        revenue.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Asset Turnover Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Industry variation, accounting standards, asset valuation,
        depreciation, leasing, seasonality, inflation, acquisitions, revenue
        recognition, and asset-light models all limit naive comparisons. Pair TAT
        with margins, cash flow, and peer analysis.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Asset Turnover Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using net income instead of revenue</li>
        <li>Using ending assets instead of average assets</li>
        <li>Using current assets instead of total assets</li>
        <li>Mixing reporting periods or currencies</li>
        <li>Treating empty inputs as zero</li>
        <li>Dividing by zero or displaying Infinity</li>
        <li>Rounding intermediate averages before dividing</li>
        <li>Treating high turnover as proof of profitability</li>
      </ul>

      <h2
        id="tat-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TOTAL_ASSET_TURNOVER_FAQS]} />
      </div>
    </article>
  );
}
