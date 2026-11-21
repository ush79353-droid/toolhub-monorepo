import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DIO_FAQS } from './content';

export function DioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-dio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Days Inventory Outstanding?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Days Inventory Outstanding (DIO), also called days sales of inventory
        (DSI), estimates how many days a company holds inventory before selling
        it. It links average inventory balances to cost of goods sold (COGS)
        over a defined reporting period and is a core inventory-management and
        working-capital metric.
      </p>

      <h2
        id="dio-meaning"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Days Inventory Outstanding Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DIO describes an average holding period for the inventory stock as a
        whole. It is not a barcode-level tracker for each SKU. Interpretation
 depends on industry, product mix, demand, and operating conditions; 
        there is no universal ideal number of days.
      </p>

      <h2
        id="dio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Days Inventory Outstanding Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        DIO = (Average Inventory / COGS) × T
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average inventory, COGS, and T (days in the accounting period) must
        refer to the same company, currency, valuation basis, and reporting
        window.
      </p>

      <h2
        id="average-inventory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Inventory
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Average Inventory = (Starting Inventory + Ending Inventory) / 2
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: starting 500,000 and ending 750,000 → average 625,000. For
        highly seasonal businesses, averages built from monthly balances may be
        more representative than a two-point average.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate DIO
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine beginning inventory.</li>
        <li>Determine ending inventory.</li>
        <li>Calculate average inventory (or use a known period average).</li>
        <li>Identify COGS for the same reporting period.</li>
        <li>Determine the accounting period in days.</li>
        <li>Divide average inventory by COGS.</li>
        <li>Multiply by the period days to obtain DIO.</li>
        <li>Interpret the result with industry and operational context.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DIO Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Starting inventory 500,000 · Ending 750,000 → Average 625,000. COGS
        6,000,000 · Period 365 days → DIO = (625,000 / 6,000,000) × 365 ≈ 38.02
        days.
      </p>

      <h2
        id="why-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Calculate Days Inventory Outstanding?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DIO supports inventory turnover analysis, working-capital planning,
        holding-cost awareness, supply-chain and purchasing decisions, and cash
        flow discussions. It summarizes how long cost-basis inventory absorbs
        cash before sale.
      </p>

      <h2
        id="good-dio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good DIO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Appropriate DIO varies widely; grocery retailers often turn faster than
        heavy equipment or pharmaceutical manufacturers. Compare with relevant
        peers and prior periods rather than inventing universal good/bad
        thresholds.
      </p>

      <h2
        id="reduce-dio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce DIO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common levers include better demand forecasting, reducing excess stock,
        optimizing procurement and production planning, monitoring slow-moving
        SKUs, and reviewing inventory policies. Excessively aggressive cuts can
        increase stockout risk.
      </p>

      <h2
        id="vs-turnover"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DIO vs. Inventory Turnover
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Inventory Turnover = COGS / Average Inventory
        <br />
        DIO = T / Inventory Turnover (when turnover &gt; 0)
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        When average inventory is zero, turnover is undefined even if DIO from
        the primary formula is zero. This calculator computes DIO directly and
        reports turnover separately when defined.
      </p>

      <h2
        id="ccc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DIO and the Cash Conversion Cycle
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        CCC = DIO + DSO − DPO
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory holding days are one component of the operating cash cycle.
        Use the{' '}
        <Link
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Conversion Cycle Calculator
        </Link>{' '}
        when you also have receivable and payable day measures.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common DIO Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using revenue instead of COGS.</li>
        <li>Mixing financial periods or currencies.</li>
        <li>Using ending inventory alone without stating the approximation.</li>
        <li>Ignoring seasonal inventory swings.</li>
        <li>Dividing by zero COGS or displaying Infinity.</li>
        <li>Rounding intermediate steps too early.</li>
        <li>Comparing unrelated industries without context.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the DIO Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Beginning/ending averages may miss seasonality. Valuation methods and
        write-downs affect reported balances. DIO does not measure profitability
        or identify which SKUs are slow-moving. Short periods can be volatile.
        Cross-company comparisons require consistent accounting policies. This
 tool provides educational estimates only; not accounting, audit, or
        investment advice.
      </p>

      <h2
        id="dio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...DIO_FAQS]} />
      </div>
    </article>
  );
}
