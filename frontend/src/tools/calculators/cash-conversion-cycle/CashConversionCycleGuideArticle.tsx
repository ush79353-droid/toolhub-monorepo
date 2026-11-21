import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CCC_FAQS } from './content';

export function CashConversionCycleGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ccc"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Cash Conversion Cycle?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The cash conversion cycle (CCC) measures how long cash remains tied up in
        operating working capital — typically inventory and accounts receivable —
        after accounting for the time taken to pay suppliers. It is expressed in
        days so managers can compare liquidity timing across periods and peers.
      </p>

      <h2
        id="ccc-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Conversion Cycle Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        CCC = DIO + DSO − DPO
        <br />
        DIO = (Average Inventory / COGS) × T
        <br />
        DSO = (Average AR / Revenue) × T
        <br />
        DPO = (Average AP / COGS) × T
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        T is the reporting period in days. This calculator uses total revenue for
        DSO and COGS for DPO as simplified defaults. Net credit sales and credit
        purchases can be more precise when available.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Cash Conversion Cycle
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose the reporting period (often 365 days).</li>
        <li>Enter total revenue for that period.</li>
        <li>Enter cost of goods sold.</li>
        <li>Enter or calculate average inventory.</li>
        <li>Enter or calculate average accounts receivable.</li>
        <li>Enter or calculate average accounts payable.</li>
        <li>Compute DIO, DSO, and DPO.</li>
        <li>CCC = DIO + DSO − DPO.</li>
      </ol>

      <h2
        id="what-ccc-tells"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does the Cash Conversion Cycle Tell Us?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A longer CCC usually means cash stays invested in inventory and
        receivables for more days. A shorter CCC often signals faster conversion
        into cash. Zero means inventory and collection days are offset by
        supplier days. Industry norms differ widely — compare within a business
        model rather than against a universal target.
      </p>

      <h2
        id="negative-ccc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Negative Cash Conversion Cycle
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Negative CCC can appear when customers pay (or inventory turns) before
        suppliers are paid. Fast turnover and strong supplier terms help, but a
        negative number alone does not prove healthy liquidity or profitability.
      </p>

      <h2
        id="reduce-ccc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce the Cash Conversion Cycle
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Improve inventory planning and reduce excess stock.</li>
        <li>Tighten receivable collection without harming sales.</li>
        <li>Negotiate supplier terms responsibly.</li>
        <li>Watch demand forecasts and working-capital policies together.</li>
      </ul>

      <h2
        id="dio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Days Inventory Outstanding
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DIO estimates how long inventory sits before sale: average inventory
        divided by COGS, scaled by the period length.
      </p>

      <h2
        id="dso"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Days Sales Outstanding
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DSO estimates collection time: average receivables divided by revenue
        (or preferably credit sales), scaled by the period.
      </p>

      <h2
        id="dpo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Days Payable Outstanding
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DPO estimates supplier payment timing. This tool defaults to COGS in the
        denominator; purchases may be better when they differ from COGS.
      </p>

      <h2
        id="operating-cycle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Operating Cycle vs. Cash Conversion Cycle
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Operating cycle = DIO + DSO
        <br />
        CCC = Operating cycle − DPO
      </div>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Conversion Cycle Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Period 365 days · Revenue $1,000,000 · COGS $800,000 · Avg inventory
        $100,000 · Avg AR $80,000 · Avg AP $70,000 → DIO 45.625 · DSO 29.2 · DPO
        31.9375 → CCC ≈ 42.89 days.
      </p>

      <h2
        id="common-mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common CCC Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Mixing revenue, COGS, and balances from different periods.</li>
        <li>Incorrect beginning/ending averages.</li>
        <li>Using total revenue when credit sales would fit better.</li>
        <li>Using COGS when purchases better represent payables.</li>
        <li>Dividing by zero or rounding intermediates too early.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Conversion Cycle Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Industry benchmarks vary; seasonal businesses may distort simple
        averages; classifications matter; negative CCC does not guarantee
        liquidity; CCC alone does not measure profitability. This tool provides
        educational estimates, not accounting or financing advice.
      </p>

      <section id="ccc-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...CCC_FAQS]} />
        </div>
      </section>
    </article>
  );
}
