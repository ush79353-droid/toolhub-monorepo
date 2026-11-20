import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ENDING_INVENTORY_FAQS } from './content';

export function EndingInventoryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ending-inventory"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Ending Inventory?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ending inventory is the value of goods and materials remaining at the
        end of an accounting period. It appears as a current asset (when
        applicable), links to cost of goods sold, and supports working-capital
        and inventory-turnover analysis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ending Inventory Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Ending Inventory = Starting Inventory + Net Purchases − COGS
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Ending Inventory
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify starting inventory on a consistent cost basis.</li>
        <li>Determine net purchases for the period.</li>
        <li>Identify COGS (not sales revenue).</li>
        <li>Add starting inventory and purchases; subtract COGS.</li>
        <li>Optionally compute average inventory and inventory turnover.</li>
        <li>Interpret the balance in context — avoid universal “good/bad” labels.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ending Inventory Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Starting inventory 25,000 + Net purchases 35,000 − COGS 45,000 = Ending
        inventory <strong>15,000</strong>. Average inventory = (25,000 + 15,000)
        / 2 = 20,000. Inventory turnover = 45,000 / 20,000 = <strong>2.25</strong>{' '}
        times.
      </p>

      <h2
        id="inventory-turnover"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Inventory Turnover?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Inventory Turnover = COGS / Average Inventory
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        The ratio is dimensionless — do not attach currency or percent symbols.
      </p>

      <h2
        id="how-turnover"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Inventory Turnover
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Average Inventory = (Starting + Ending) / 2
      </div>

      <h2
        id="cogs-unknown"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Ending Inventory When COGS Is Unknown
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When inventory turnover (T) is known along with beginning inventory (B)
        and net purchases (P):
      </p>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        COGS = T(2B + P) / (T + 2)
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Then Ending Inventory = B + P − COGS. This assumes a consistent cost
        basis and that turnover matches the same period.
      </p>

      <h2
        id="other-methods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Another Ending Inventory Calculation Method
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FIFO, LIFO, weighted-average cost, and specific identification are
        cost-flow or valuation methods. They are not direct substitutes for the
        basic inventory-flow equation above. LIFO is not permitted under IFRS
        but may be allowed under US GAAP.
      </p>

      <h2
        id="fifo-lifo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FIFO vs. LIFO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FIFO (first-in, first-out) tends to leave more recent costs in ending
        inventory when prices change. LIFO (last-in, first-out) tends to leave
        older costs in ending inventory and can raise COGS when prices rise.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Ending Inventory Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ending inventory affects balance-sheet valuation, profit via COGS,
        working capital, purchasing decisions, and cash-flow planning. See also
        the{' '}
        <a
          href="/tools/dio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DIO Calculator
        </a>
        .
      </p>

      <h2
        id="increase"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Causes Ending Inventory to Increase?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher purchases, lower COGS, seasonal buildup, production changes, or
        valuation effects can raise ending inventory.
      </p>

      <h2
        id="decrease"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Causes Ending Inventory to Decrease?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sales of inventory, lower purchasing, write-downs, shrinkage,
        obsolescence, or stock depletion can reduce ending inventory.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Ending Inventory Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using sales revenue instead of COGS.</li>
        <li>Ignoring purchase returns, allowances, or discounts.</li>
        <li>Mixing accounting periods or currencies.</li>
        <li>Double-counting freight costs.</li>
        <li>Treating negative ending inventory as a normal stock balance.</li>
        <li>Confusing inventory turnover with ending inventory.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Ending Inventory Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool uses a simplified inventory-flow equation. Valuation policies,
        physical counts, shrinkage, obsolescence, and manufacturing WIP may
        require adjustments. Turnover is an average ratio, not item-level
        movement. Educational estimates only — not accounting, audit, or
        investment advice.
      </p>

      <h2
        id="ending-inventory-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...ENDING_INVENTORY_FAQS]} />
      </div>
    </article>
  );
}
