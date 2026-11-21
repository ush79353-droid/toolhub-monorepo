import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EBIT_FAQS } from './content';

export function EbitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ebit"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is EBIT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBIT means Earnings Before Interest and Taxes. It measures earnings
        after relevant operating costs but before interest expense and income
        taxes. Analysts use it to focus on operating performance before
        financing and tax effects. EBIT can differ from reported operating
        income depending on accounting presentation.
      </p>

      <h2
        id="ebit-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBIT Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        EBIT = Revenue − Operating Expenses
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        For this simplified calculator, operating expenses should include all
        relevant operating costs, including COGS where applicable. Equivalently:
      </p>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EBIT = Revenue − COGS − Other Operating Expenses
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        If the operating-expenses input already includes COGS, do not subtract
        COGS again. Exclude interest and income taxes.
      </p>

      <h2
        id="vs-ebitda"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBIT vs. EBITDA
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EBITDA = EBIT + Depreciation + Amortization
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Add back only D&amp;A included in the earnings measure being reconciled.
        EBITDA is not cash flow, operating cash flow, or free cash flow, and
        adjusted EBITDA may differ from standard EBITDA.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EBIT
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify revenue for the reporting period.</li>
        <li>Identify COGS and other operating expenses.</li>
        <li>Exclude interest and income tax expenses.</li>
        <li>Combine all relevant operating costs (without double-counting).</li>
        <li>Subtract operating expenses from revenue.</li>
        <li>Review and interpret positive, zero, or negative EBIT.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBIT Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue 50,000 − Operating expenses 24,000 → EBIT 26,000.
      </p>

      <h2
        id="from-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EBIT From Net Income
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EBIT = Net Income + Interest Expense + Income Tax Expense
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        This simplified reconciliation may need adjustments for interest income,
        non-operating items, discontinued operations, and other classifications.
      </p>

      <h2
        id="vs-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBIT vs. Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBIT is before interest and income taxes. Net income is after the
        applicable income-statement expenses and taxes, so the two can differ
        substantially.
      </p>

      <h2
        id="vs-operating-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBIT vs. Operating Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The terms often refer to similar earnings measures but may differ by
        reporting definition. They are not always identical.
      </p>

      <h2
        id="good-ebit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good EBIT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Absolute EBIT should be read with revenue, company size, industry,
        capital intensity, margins, and history. There is no universal EBIT
        target.
      </p>

      <h2
        id="ebit-margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is EBIT Margin?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EBIT Margin = (EBIT / Revenue) × 100
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: EBIT 25,000 on revenue 100,000 → margin 25%. Negative margins
        are valid when EBIT is negative.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is EBIT Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBIT supports operating-performance analysis, profitability comparison,
        cost management review, valuation discussions, and earnings sensitivity
 analysis; always with context.
      </p>

      <h2
        id="improve-ebit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can a Business Improve EBIT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Levers include sustainable revenue growth, pricing, cost management,
        productivity, waste reduction, operations optimization, and product mix.
        Higher EBIT does not automatically mean stronger cash flow.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common EBIT Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Excluding COGS from total operating costs.</li>
        <li>Subtracting COGS twice.</li>
        <li>Incorrectly subtracting interest or income taxes.</li>
        <li>Confusing EBIT with EBITDA or net income.</li>
        <li>Mixing reporting periods or currencies.</li>
        <li>Treating negative EBIT as invalid.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of EBIT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBIT is not cash flow. It excludes financing and tax effects.
        Depreciation, accounting policies, nonrecurring items, working capital,
        and capital expenditures affect interpretation. Different EBIT
        definitions reduce comparability. This tool provides educational
 estimates only; not accounting, audit, or investment advice.
      </p>

      <h2
        id="ebit-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...EBIT_FAQS]} />
      </div>
    </article>
  );
}
