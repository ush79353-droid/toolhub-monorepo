import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EOQ_FAQS } from './content';

export function EoqGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="eoq-meaning"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        The EOQ Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economic Order Quantity (EOQ) is the theoretically optimal replenishment
        size that minimizes the combined annual costs of placing orders and
        holding inventory under the classical inventory model. Ordering too often
        raises ordering costs; ordering too much raises holding costs.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EOQ
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify annual demand in inventory units per year.</li>
        <li>Identify the fixed cost per order (not purchase price).</li>
        <li>Identify annual holding cost per unit.</li>
        <li>Compute EOQ = √(2DS / H).</li>
        <li>Optionally compare nearby whole-unit quantities by total variable cost.</li>
      </ol>

      <h2
        id="eoq-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The EOQ Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        EOQ = √(2 × D × S / H)
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        D = annual demand (units/year), S = order cost (currency/order), H =
 holding cost (currency/unit/year). EOQ is in units per order; not
        currency or percent.
      </p>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete EOQ Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yearly demand 500,000 · Order cost 10 · Holding cost 4 → EOQ =
        √((2 × 500,000 × 10) / 4) = √2,500,000 ≈ <strong>1,581.14</strong>{' '}
        units. A business could plan near 1,581 units under the basic model;
        whole-unit choices should compare TC at nearby integers.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is EOQ Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EOQ supports inventory cost optimization, purchasing cadence, holding-cost
        control, working-capital planning, and replenishment design when the
        classical assumptions are reasonable.
      </p>

      <h2
        id="ordering-vs-holding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ordering Cost vs. Holding Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        As order quantity rises, you place fewer orders (lower annual ordering
        cost) but carry more average inventory (higher annual holding cost). EOQ
        balances those trade-offs.
      </p>

      <h2
        id="annual-ordering"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annual Ordering Cost
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Annual Ordering Cost = (D / Q) × S
      </div>

      <h2
        id="annual-holding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annual Holding Cost
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Annual Holding Cost = (Q / 2) × H
      </div>

      <h2
        id="total-cost"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total Annual Inventory Cost
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        TC(Q) = (D / Q) × S + (Q / 2) × H
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        This excludes annual purchase cost DP unless you add purchase price
        separately.
      </p>

      <h2
        id="orders-per-year"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Many Orders Should a Business Place Per Year?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Orders Per Year = D / EOQ
      </div>

      <h2
        id="vs-reorder"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EOQ vs. Reorder Point
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EOQ decides how much to order. Reorder point decides when to order
        (typically daily demand × lead time + safety stock).
      </p>

      <h2
        id="vs-safety"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EOQ vs. Safety Stock
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Safety stock buffers demand or lead-time variability. It does not
        automatically change the classical EOQ formula for cycle stock.
      </p>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EOQ Assumptions
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Reasonably constant, predictable demand.</li>
        <li>Fixed ordering cost per order.</li>
        <li>Constant holding cost per unit per year.</li>
        <li>Instant or single-batch replenishment; no planned stockouts.</li>
        <li>Constant purchase price; no quantity discounts.</li>
      </ul>

      <h2
        id="when-not-suitable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Is EOQ Not Suitable?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Highly unpredictable or seasonal demand, quantity discounts, warehouse
        limits, perishables, irregular production, supplier minimums, or highly
        variable ordering costs may require other models.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common EOQ Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using monthly demand as if it were annual.</li>
        <li>Using total annual holding cost instead of per-unit H.</li>
        <li>Using purchase price as ordering cost S.</li>
        <li>Mixing currencies or incompatible inventory units.</li>
        <li>Ignoring minimums, capacity, or confusing EOQ with reorder point.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EOQ Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EOQ is a simplified cost-optimization model, not a complete inventory
        system. Related tools:{' '}
        <Link
          href="/tools/ending-inventory-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Ending Inventory
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/dio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DIO
        </Link>
. Educational estimates only; not operational, accounting, or investment
        advice.
      </p>

      <h2
        id="eoq-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...EOQ_FAQS]} />
      </div>
    </article>
  );
}
