import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEFENSIVE_INTERVAL_RATIO_FAQS } from './content';

export function DefensiveIntervalRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Defensive Interval Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Defensive Interval Ratio Calculator to estimate how many days a
        business can cover average cash operating expenditures with qualifying
        defensive assets. Enter cash, marketable securities, receivables, annual
        operating expenses, and non-cash charges to compute defensive assets,
        daily cash spending, and the defensive interval in days. Reverse modes
        solve for required assets or maximum daily expenditure. Currency labels
        are denomination only and do not convert amounts.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Defensive Interval Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The defensive interval ratio (DIR) is a liquidity metric that answers a
        practical question: if operating cash inflows paused and no new
        financing arrived, how many days of average cash operating spending
        could liquid defensive assets cover? Expressing the answer in days makes
        short-term resilience easier to discuss than an abstract coverage
        multiple. Companies use DIR alongside other working-capital and cash-flow
 tools for planning, stress discussion, and liquidity monitoring; not as
        a standalone proof of solvency.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Defensive Interval Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>DIR = Defensive Assets ÷ Average Daily Cash Expenditure</p>
        <p>DA = Cash + Marketable Securities + Accounts Receivable</p>
        <p>DCE = (Operating Expenses − Non-Cash Charges) ÷ 365</p>
        <p>DIR = (C + MS + AR) ÷ ((OE − NCE) / 365)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses a 365-day year for the daily average. It does not
        silently substitute a 360-day convention. Keep expense definitions
        consistent and avoid double-subtracting depreciation if expenses are
        already stated on a cash-only basis.
      </p>

      <h2
        id="defensive-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Defensive Assets?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Defensive assets are resources expected to be available relatively quickly
        to meet cash operating needs: cash and cash equivalents, short-term
        marketable securities, and collectible accounts receivable. The form may
        label their subtotal “Current Assets” for reference consistency, but the
        tooltip clarifies that this is not total balance-sheet current assets.
        Inventory, prepaid expenses, and other less-liquid items are generally
        excluded because they may not convert into cash on the same timeline.
      </p>

      <h2
        id="daily-expenditure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Daily Cash Expenditure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start with annual operating expenses that include non-cash charges such
        as depreciation and amortization when those items sit inside the expense
        total. Subtract annual non-cash charges to approximate annual cash
        operating expenditure, then divide by 365. Non-cash charges must not
        exceed operating expenses in the standard mode. If cash expenditure is
 zero, DIR is undefined: the calculator reports that clearly instead of
        returning Infinity.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
 How to Calculate Defensive Interval Ratio; Step by Step
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company Alpha example:
      </p>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Metric</th>
              <th className="px-3 py-2 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {[
              ['Cash and cash equivalents', '$10,000,000'],
              ['Marketable securities', '$5,000,000'],
              ['Accounts receivable', '$17,000,000'],
              ['Annual operating expenses', '$110,000,000'],
              ['Annual non-cash charges', '$37,000,000'],
            ].map(([k, v]) => (
              <tr key={k} className="border-t border-border">
                <td className="px-3 py-2">{k}</td>
                <td className="px-3 py-2 tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Defensive assets = 10M + 5M + 17M = <strong>$32,000,000</strong>.
        </li>
        <li>
          Annual cash operating expenditure = 110M − 37M ={' '}
          <strong>$73,000,000</strong>.
        </li>
        <li>
          Daily cash expenditure = 73,000,000 ÷ 365 ={' '}
          <strong>$200,000/day</strong>.
        </li>
        <li>
          DIR = 32,000,000 ÷ 200,000 = <strong>160 days</strong>.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assumptions include accessible cash, convertible securities, expected
        receivable collections, stable average spending, and no new financing or
        operating inflows in the coverage window.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Defensive Interval Ratio Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose currency denomination (labels/symbols only).</li>
        <li>
          Select solve mode: DIR days, required defensive assets, or maximum
          daily expenditure.
        </li>
        <li>
          Enter the grouped inputs. Subtotals for defensive assets and daily
          expenditure update automatically in primary mode.
        </li>
        <li>
          Read the result card, interpretation, and expandable formula
          breakdown.
        </li>
        <li>Use Reload, Clear, Copy, or Share as needed.</li>
      </ol>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Defensive Interval Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Longer intervals generally mean more days of coverage from the measured
        defensive asset set. Shorter intervals suggest thinner near-term
        liquidity relative to average cash spending. Do not treat fixed cutoffs
        (for example, “above 90 days is always good” or “below 30 days means
        bankruptcy”) as universal standards. Industry cash cycles, credit access,
        seasonality, and asset quality all shape interpretation.
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Defensive Interval Ratio Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DIR supports liquidity planning, cash-runway style discussion, working-
        capital analysis, operational resilience reviews, financial risk
 management, and short-term budgeting conversations. It complements; and
 does not replace; cash-flow forecasts, covenant analysis, and liability
        maturity schedules.
      </p>

      <h2
        id="vs-current"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Defensive Interval Ratio vs. Current Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current ratio = current assets ÷ current liabilities. It includes a
        broader asset set and focuses on liability coverage. DIR focuses on days
        of cash operating expenditure coverage from a narrower liquid asset set
        and does not place current liabilities in the primary formula.
      </p>

      <h2
        id="vs-quick"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Defensive Interval Ratio vs. Quick Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Quick ratio typically compares cash, marketable securities, and
        receivables to current liabilities. DIR uses a similar liquid-asset idea
        but converts it into a days metric against average cash operating spend.
        Purpose, denominator, and interpretation therefore differ.
      </p>

      <h2
        id="vs-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Defensive Interval Ratio vs. Cash Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash ratio is a stricter liability-coverage measure using cash (and often
        cash equivalents / near-cash) versus current liabilities. DIR is broader
        than cash-only on the asset side (including securities and receivables)
        and answers a days-of-expenditure question rather than a liability
        multiple.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Defensive Interval Ratio
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Receivables may collect slower or incompletely.</li>
        <li>Marketable securities can face liquidity or valuation frictions.</li>
        <li>Cash may be restricted or otherwise unavailable.</li>
        <li>Spending can be seasonal or spike unexpectedly.</li>
        <li>Debt maturities and other obligations are outside the basic DIR.</li>
        <li>Accounting expenses may not equal cash outflows perfectly.</li>
      </ul>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can a Company Improve Its Defensive Interval Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Practical levers include faster collections, stronger receivable
        quality, larger usable cash buffers, careful use of short-term liquid
        investments, and disciplined cash operating costs. Raising DIR is not
 always identical to maximizing long-term business value; excess idle
        cash can carry opportunity costs.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </Link>
        ,{' '}
        <Link
          href="/tools/cash-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Ratio
        </Link>
        ,{' '}
        <Link
          href="/tools/working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Working Capital
        </Link>
        ,{' '}
        <Link
          href="/tools/burn-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Burn Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/operating-cash-flow-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Operating Cash Flow
        </Link>
        ,{' '}
        <Link
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Conversion Cycle
        </Link>
        ,{' '}
        <Link
          href="/tools/inventory-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inventory Turnover
        </Link>
        ,{' '}
        <Link
          href="/tools/debt-to-asset-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Asset
        </Link>
        , and{' '}
        <Link
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage
        </Link>
        .
      </p>

      <h2
        id="dir-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...DEFENSIVE_INTERVAL_RATIO_FAQS]} />
      </div>
    </article>
  );
}
