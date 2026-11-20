import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DPO_FAQS } from './content';

export function DpoGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-dpo"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is DPO? The DPO Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Days Payable Outstanding (DPO) estimates how many days, on average, a
        company takes to pay its suppliers. It connects average accounts payable
        to purchases over a defined reporting period and helps short-term cash
        and working-capital analysis.
      </p>

      <h2
        id="dpo-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DPO Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        DPO = (Average AP / Purchases) × Days
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average AP, purchases, and days must refer to the same company,
        currency, and reporting window.
      </p>

      <h2
        id="average-ap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Accounts Payable
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Average AP = (Beginning AP + Ending AP) / 2
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: beginning 150,000 and ending 200,000 → average 175,000.
      </p>

      <h2
        id="purchases"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Purchases
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Purchases = COGS + Ending Inventory − Beginning Inventory
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        This inventory-flow estimate assumes consistent inventory accounting.
        Actual credit purchases are often preferable when measuring payables
        arising from supplier credit.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate DPO Using the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter beginning accounts payable.</li>
        <li>Enter ending accounts payable.</li>
        <li>Review average accounts payable.</li>
        <li>Enter beginning inventory.</li>
        <li>Enter ending inventory.</li>
        <li>Enter cost of goods sold.</li>
        <li>Review purchases (or enter purchases directly).</li>
        <li>Enter the reporting period in days.</li>
        <li>Review the DPO result and interpretation.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete DPO Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Beginning AP 150,000 · Ending AP 200,000 → Average AP 175,000. Beginning
        inventory 500,000 · Ending 400,000 · COGS 1,500,000 → Purchases
        1,400,000. Period 365 days → DPO = (175,000 / 1,400,000) × 365 = 45.625
        days (displayed 45.63).
      </p>

      <h2
        id="purpose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Purpose of Calculating DPO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DPO supports accounts payable management, cash-flow planning, supplier
        credit analysis, working-capital reviews, liquidity discussions, and
        payables turnover comparisons.
      </p>

      <h2
        id="good-dpo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good DPO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An appropriate DPO depends on negotiated payment terms, industry
        practice, liquidity, discounts, supplier relationships, purchasing
        patterns, and seasonality. There is no universal ideal number of days.
      </p>

      <h2
        id="improve-dpo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve DPO Responsibly
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Negotiate suitable terms, improve cash-flow forecasts, automate invoice
        processing, avoid unnecessary late-payment penalties, maintain supplier
        trust, and evaluate early-payment discounts against the cost of cash.
      </p>

      <h2
        id="vs-dio-dso"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DPO vs. DIO vs. DSO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DIO measures inventory holding days, DSO measures receivable collection
        days, and DPO measures supplier payment days. Together they describe
        different parts of the operating cash cycle.
      </p>

      <h2
        id="ccc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DPO and Cash Conversion Cycle
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        CCC = DIO + DSO − DPO
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Increasing DPO reduces measured CCC when other components are unchanged,
        but extending payments beyond agreed terms can create operational risk.
        Use the{' '}
        <a
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Conversion Cycle Calculator
        </a>{' '}
        for the full cycle.
      </p>

      <h2
        id="vs-turnover"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DPO vs. Accounts Payable Turnover
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        AP Turnover = Purchases / Average AP
        <br />
        DPO = Days / AP Turnover (when turnover &gt; 0)
      </div>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common DPO Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using revenue instead of purchases.</li>
        <li>Mixing reporting periods or currencies.</li>
        <li>Treating COGS and credit purchases as identical.</li>
        <li>Ignoring inventory changes when estimating purchases.</li>
        <li>Using ending AP alone without disclosure.</li>
        <li>Rounding intermediate steps too early.</li>
        <li>Dividing by zero purchases.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DPO Calculation Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Supplier terms vary. Period-end averages may miss seasonality. Purchase
        estimates may differ from actual credit purchases. Accounting
        classification influences results. DPO alone cannot determine supplier
        payment performance, and higher DPO does not always mean better cash
        management. This tool provides educational estimates only — not
        accounting, audit, or investment advice.
      </p>

      <h2
        id="dpo-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...DPO_FAQS]} />
      </div>
    </article>
  );
}
