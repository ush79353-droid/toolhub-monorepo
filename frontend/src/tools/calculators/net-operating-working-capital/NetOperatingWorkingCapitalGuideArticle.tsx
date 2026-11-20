import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NET_OPERATING_WORKING_CAPITAL_FAQS } from './content';

export function NetOperatingWorkingCapitalGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-nowc"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Net Operating Working Capital?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net operating working capital (NOWC) measures the net short-term capital
        invested in ordinary operations: current operating assets minus current
        operating liabilities. It helps managers and analysts see how much
        funding is tied up in day-to-day trading activities.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Operating Working Capital Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        NOWC = COA − COL
        <br />
        COA = Cash + AR + Inventories
        <br />
        COL = AP + Accrued Expenses
      </div>

      <h2
        id="coa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Operating Assets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses operating cash, accounts receivable, and
        inventories. Prefer cash needed for operations rather than excess
        investment cash. Other operating current assets (such as prepaid
        expenses) may appear in fuller analyses.
      </p>

      <h2
        id="col"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Operating Liabilities
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accounts payable and accrued operating expenses are included. Short-term
        bank loans and other interest-bearing debt are financing liabilities and
        are excluded here.
      </p>

      <h2
        id="calc-coa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Current Operating Assets
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        COA = Cash + Accounts Receivable + Inventories
      </div>

      <h2
        id="calc-col"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Current Operating Liabilities
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        COL = Accounts Payable + Accrued Expenses
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate NOWC
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Sum cash, receivables, and inventories to get COA.</li>
        <li>Sum accounts payable and accrued expenses to get COL.</li>
        <li>Subtract COL from COA to get NOWC.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete NOWC Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company Alpha: Cash $1,000; AR $15,000; Inventories $5,000; AP $18,000;
        Accrued $2,000. COA = $21,000; COL = $20,000; NOWC ={' '}
        <strong>$1,000</strong>.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is NOWC Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOWC informs liquidity planning, operating efficiency, cash conversion,
        and how much capital growth will require as sales expand.
      </p>

      <h2
        id="pos-neg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Positive NOWC vs. Negative NOWC
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive NOWC means COA exceeds COL. Negative NOWC means COL exceeds
        COA. Neither result alone proves health or distress — industry and cash
        conversion matter.
      </p>

      <h2
        id="vs-wc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC vs. Working Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Working capital = current assets − current liabilities. NOWC narrows the
        set to operating items and typically excludes financing debt and
        non-operating financial assets.
      </p>

      <h2
        id="vs-noa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC vs. Net Operating Assets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOWC focuses on current operating capital. Net operating assets (NOA)
        can include longer-term operating assets such as property and equipment.
      </p>

      <h2
        id="vs-ccc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC vs. Cash Conversion Cycle
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The cash conversion cycle is measured in days. NOWC is measured in
        currency. They describe related operating themes from different angles.
      </p>

      <h2
        id="vs-current"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC vs. Current Ratio
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Current Ratio = Current Assets ÷ Current Liabilities
      </div>

      <h2
        id="ar"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC and Accounts Receivable
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher receivables increase COA and usually raise NOWC until cash is
        collected.
      </p>

      <h2
        id="inventory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC and Inventory
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Building inventory increases operating capital tied up until goods are
        sold and collected.
      </p>

      <h2
        id="ap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC and Accounts Payable
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Supplier credit raises COL and can reduce NOWC, funding operations
        without drawing cash immediately.
      </p>

      <h2
        id="cash-flow"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC and Operating Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Increases in non-cash operating working capital often use cash under the
        indirect method. Because this calculator includes cash in COA, do not
        plug its ΔNOWC directly into a cash-flow bridge without removing cash.
      </p>

      <h2
        id="change"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Change in NOWC
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        ΔNOWC = Ending NOWC − Beginning NOWC
      </div>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve NOWC Management
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Collect receivables faster</li>
        <li>Right-size inventory</li>
        <li>Negotiate supplier terms carefully</li>
        <li>Forecast cash needs</li>
        <li>Align operations with working-capital goals</li>
      </ul>

      <h2
        id="negative-ok"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Negative NOWC Is Not Always Bad
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advance payments, favorable payables, and rapid inventory turns can
        support negative operating working capital in some industries.
      </p>

      <h2
        id="analysis"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC in Financial Statement Analysis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Analysts reclassify balance-sheet lines into operating versus financing
        items. Classification judgment affects reported NOWC.
      </p>

      <h2
        id="valuation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOWC in Business Valuation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Growth often requires incremental operating working capital, which
        reduces free cash flow in forecasts.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common NOWC Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing NOWC with standard working capital</li>
        <li>Treating all cash as operating cash</li>
        <li>Including bank loans as operating liabilities</li>
        <li>Confusing AR with AP</li>
        <li>Mixing reporting dates or currencies</li>
        <li>Confusing NOWC with NOA or the cash conversion cycle</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the NOWC Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool uses a simplified five-input model. It may omit prepaid assets
        or other accruals, and cash classification requires care. A single NOWC
        figure does not prove liquidity or solvency. Educational use only — not
        personalized financial advice.
      </p>

      <h2
        id="nowc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...NET_OPERATING_WORKING_CAPITAL_FAQS]} />
      </div>
    </article>
  );
}
