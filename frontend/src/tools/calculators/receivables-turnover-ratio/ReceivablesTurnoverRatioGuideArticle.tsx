import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RECEIVABLES_TURNOVER_FAQS } from './content';

export function ReceivablesTurnoverRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-rtr"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Receivables Turnover Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The receivables turnover ratio measures how efficiently a company
        converts credit sales into collections relative to its average accounts
        receivable balance. It is an activity ratio used in working-capital and
        credit analysis.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover Ratio Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Turnover answers: how many times did net credit sales turn over average
        receivables during the period? It is reported in times — not as a
        percentage, currency amount, or interest rate.
      </p>

      <h2
        id="ar-explained"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Accounts Receivable Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accounts receivable are amounts customers owe for credit invoices. When
        customers pay, AR decreases and cash increases.
      </p>

      <h2
        id="net-credit-sales"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Net Credit Sales?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net credit sales are credit sales after applicable returns, allowances,
        and discounts. Do not substitute total revenue that includes cash sales.
      </p>

      <h2
        id="ncs-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Credit Sales Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        NCS = Gross Credit Sales − Applicable Deductions
      </div>

      <h2
        id="avg-ar"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Average Accounts Receivable?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A simple average of opening and closing AR for the same reporting period
        as net credit sales.
      </p>

      <h2
        id="avg-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average Accounts Receivable Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Average AR = (Opening AR + Closing AR) ÷ 2
      </div>

      <h2
        id="rtr-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Accounts Receivable Turnover Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        RTR = Net Credit Sales ÷ Average AR
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Receivables Turnover
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine net credit sales for the period.</li>
        <li>Find opening accounts receivable.</li>
        <li>Find closing accounts receivable.</li>
        <li>Average opening and closing AR.</li>
        <li>Divide net credit sales by average AR.</li>
        <li>Interpret the result in times per period.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Receivables Turnover Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company Alpha: Net credit sales $120,000; Opening AR $20,000; Closing AR
        $30,000. Average AR = <strong>$25,000</strong>. Turnover ={' '}
        <strong>4.8 times</strong>.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Receivables Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interpret turnover with payment terms, credit policy, customer mix,
        history, and industry norms — not as a standalone grade.
      </p>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Receivables Turnover Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal benchmark. Align comparisons with peers that use
        similar credit terms and revenue recognition.
      </p>

      <h2
        id="high"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        High Receivables Turnover Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        May indicate faster collections or tighter credit. Very high ratios can
        also reflect policies that discourage some credit sales.
      </p>

      <h2
        id="low"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Low Receivables Turnover Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        May indicate slower payments, longer terms, or collection friction —
        unless the industry normally carries longer receivable cycles.
      </p>

      <h2
        id="vs-dso"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover vs. DSO
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        DSO = Days in Period ÷ Receivables Turnover
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: turnover 8 over 365 days → DSO ≈ 45.63 days. Use the{' '}
        <a
          href="/tools/dso-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DSO Calculator
        </a>{' '}
        when you need an explicit days measure.
      </p>

      <h2
        id="ccc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover and the Cash Conversion Cycle
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Collection speed (via DSO) is a component of the cash conversion cycle
        alongside inventory and payables days.
      </p>

      <h2
        id="cash-flow"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover and Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Faster collections improve the timing of cash inflows from credit sales,
        though profitability is a separate question.
      </p>

      <h2
        id="working-capital"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover and Working Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Receivables are a current operating asset. Lower average AR for the same
        credit sales reduces capital tied up in customer balances.
      </p>

      <h2
        id="credit-policies"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Policies and Receivables Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Terms, limits, and collection processes shape both sales volume and
        average AR — and therefore turnover.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Receivables Turnover
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Prompt, accurate invoicing</li>
        <li>Clear payment terms</li>
        <li>Reminders and follow-up</li>
        <li>Credit checks and dispute resolution</li>
        <li>Appropriate early-payment incentives</li>
      </ul>

      <h2
        id="aging"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Accounts Receivable Aging
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aging reports show how overdue balances are distributed — useful context
        beyond a single turnover figure.
      </p>

      <h2
        id="retail"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover in Retail
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many retailers emphasize cash or card sales; where credit exists, keep
        cash sales out of the net credit sales input.
      </p>

      <h2
        id="manufacturing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover in Manufacturing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        B2B payment terms often stretch cycles; compare within manufacturing
        peer groups.
      </p>

      <h2
        id="services"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover in Service Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Milestone billing and retainers affect recognition timing and AR
        balances — keep definitions consistent.
      </p>

      <h2
        id="small-business"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover in Small Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Collection timing often drives cash planning. Align the sales period
        with opening and closing AR dates.
      </p>

      <h2
        id="vs-inventory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover vs. Inventory Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory turnover uses COGS and inventory; receivables turnover uses
        credit sales and AR. They measure different operating loops.
      </p>

      <h2
        id="vs-payables"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover vs. Payables Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Receivables track collecting from customers; payables track paying
        suppliers.
      </p>

      <h2
        id="vs-revenue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Receivables Turnover vs. Revenue
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue is a sales total. Turnover relates credit sales to average
        receivable balances.
      </p>

      <h2
        id="seasonal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Seasonal Changes and Receivables Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Seasonal businesses may need monthly averages; year-end two-point
        averages can misrepresent peak receivable balances.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using total sales instead of net credit sales</li>
        <li>Including cash sales</li>
        <li>Using only closing AR</li>
        <li>Mixing reporting periods or currencies</li>
        <li>Treating turnover as a percentage</li>
        <li>Displaying Infinity when average AR is zero</li>
        <li>Confusing turnover with DSO</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Receivables Turnover Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The ratio does not show individual invoice behavior, receivables
        quality, or write-off patterns. Two-point averages can miss seasonality.
        Educational use only — not personalized financial advice.
      </p>

      <h2
        id="rtr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...RECEIVABLES_TURNOVER_FAQS]} />
      </div>
    </article>
  );
}
