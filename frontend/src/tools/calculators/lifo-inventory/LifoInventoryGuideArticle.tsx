import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LIFO_INVENTORY_FAQS } from './content';

export function LifoInventoryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-lifo"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is LIFO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LIFO (Last In, First Out) is an inventory cost-flow assumption. The costs
        of the most recently purchased units are assigned to Cost of Goods Sold
        first; older costs remain in ending inventory until newer layers are
        exhausted. It does not require shipping the newest physical units first.
      </p>

      <h2
        id="how-lifo-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the LIFO Method Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 With two batches (10 units at $10, then 15 at $15) selling 18 units
        costs 15 from the second batch and 3 from the first under LIFO.
      </p>

      <h2
        id="cogs-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LIFO Cost of Goods Sold Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        COGS = Σ (units sold from each layer × unit cost)
        <br />
        Deplete newest layer first
      </div>

      <h2
        id="ending-inventory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Ending Inventory Using LIFO
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Ending Inventory = Total Purchase Cost − LIFO COGS
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the LIFO Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter first-batch unit price and quantity.</li>
        <li>Enter second-batch unit price and quantity.</li>
        <li>Enter units sold (not more than available).</li>
        <li>Enter selling price per unit.</li>
        <li>Review LIFO COGS, ending inventory, revenue, and margin.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete LIFO Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        First 10 @ $10, second 15 @ $15, sell 18 @ $20. COGS = (15×15)+(3×10) ={' '}
        <strong>$255</strong>. Ending inventory = 7×10 = <strong>$70</strong>.
        Revenue = <strong>$360</strong>. Gross profit = <strong>$105</strong>.
        Margin ≈ <strong>29.17%</strong>.
      </p>

      <h2
        id="vs-fifo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LIFO vs. FIFO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FIFO assigns oldest costs to COGS first. For 10 @ $10 then 10 @ $15,
        selling 10 units: LIFO COGS $150 / ending $100; FIFO COGS $100 / ending
        $150.
      </p>

      <h2
        id="vs-average"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LIFO vs. Weighted Average Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Weighted average blends unit costs into one average applied to COGS and
        ending inventory. LIFO keeps discrete layers and depletes newest first.
      </p>

      <h2
        id="gross-profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How LIFO Affects Gross Profit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rising purchase costs often raise LIFO COGS and lower gross profit versus
        FIFO. Falling costs can reverse that pattern. Revenue is independent of
        the cost-flow method.
      </p>

      <h2
        id="ending-effects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How LIFO Affects Ending Inventory
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Older layers often remain on the balance sheet, so ending inventory may
        lag current replacement cost when prices rise.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LIFO and Inventory Inflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In inflationary purchase environments, matching recent costs to current
        sales can raise reported COGS relative to methods that leave newer costs
        in inventory.
      </p>

      <h2
        id="taxes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LIFO and Income Taxes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Where permitted, higher COGS can reduce taxable income in rising-cost
 periods. Tax outcomes depend on jurisdiction; this tool is educational,
        not tax advice.
      </p>

      <h2
        id="ifrs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is LIFO Allowed Under IFRS?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        IFRS prohibits LIFO as an inventory cost formula. The calculator remains
        available for learning and comparison.
      </p>

      <h2
        id="us-gaap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is LIFO Allowed Under US GAAP?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US GAAP permits LIFO when requirements are met. Confirm applicability
        with professional guidance.
      </p>

      <h2
        id="lifo-reserve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a LIFO Reserve?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LIFO reserve ≈ FIFO inventory − LIFO inventory. This two-batch LIFO tool
        does not compute a reserve without a FIFO run.
      </p>

      <h2
        id="liquidation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is LIFO Liquidation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory declines that pull older layers into COGS can temporarily
 change reported margins; sometimes called LIFO liquidation.
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of LIFO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        May better match recent acquisition costs with current sales where
 allowed; useful for analysis in rising-cost environments.
      </p>

      <h2
        id="disadvantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Disadvantages of LIFO
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Older costs in ending inventory</li>
        <li>Complexity and comparability issues</li>
        <li>Liquidation effects</li>
        <li>Not permitted under IFRS</li>
      </ul>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common LIFO Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using oldest layers first (FIFO by accident)</li>
        <li>Confusing purchase price with selling price</li>
        <li>Selling more units than available</li>
        <li>Using average cost instead of layered LIFO</li>
        <li>Treating missing inputs as zero</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the LIFO Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Two comparable purchase batches; purchase costs only (no freight/duties
 automation); no returns or write-downs; educational costing model; not a
        substitute for professional accounting judgment or jurisdiction rules.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
 Educational illustration only; not accounting, tax, or audit advice.
      </p>

      <h2
        id="lifo-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...LIFO_INVENTORY_FAQS]} />
      </div>
    </article>
  );
}
