import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EBT_FAQS } from './content';

export function EbtGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ebt"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is EBT? What Is Earnings Before Tax?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Earnings Before Tax (EBT), also called pretax income, measures earnings
        after relevant operating and non-operating items but before income tax
        expense. It helps separate operating and financing results from tax
        effects.
      </p>

      <h2
        id="ebt-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBT Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        EBT = Revenue − COGS − SG&amp;A − D&amp;A − Interest + Other Income
      </div>

      <h2
        id="gross-profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Gross Profit
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Gross Profit = Revenue − COGS
      </div>

      <h2
        id="operating-expenses"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Operating Expenses
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Operating Expenses = SG&amp;A + D&amp;A
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
 Enter D&amp;A only when it is not already included in COGS or SG&amp;A; 
        do not subtract the same costs twice.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EBT
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify revenue and COGS; calculate gross profit.</li>
        <li>Identify SG&amp;A and uncounted D&amp;A; calculate operating expenses.</li>
        <li>Identify interest expenses and other income (or losses).</li>
        <li>
          Compute EBT = Gross profit − Operating expenses − Interest + Other
          income.
        </li>
        <li>Interpret positive, zero, or negative pretax earnings.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete EBT Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue 1,000,000 − COGS 300,000 → Gross profit 700,000. SG&amp;A 150,000
        + D&amp;A 50,000 → OpEx 200,000. Interest 20,000 · Other income 10,000 →
        EBT = 700,000 − 200,000 − 20,000 + 10,000 = 490,000.
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Importance of EBT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBT supports pretax profitability analysis, financing-cost review,
        business comparisons, and separating tax effects from operating and
        non-operating results.
      </p>

      <h2
        id="vs-ebit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBT vs. EBIT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under this structure, EBIT ≈ Gross profit − Operating expenses. EBT then
        subtracts interest and adds other income. See the{' '}
        <Link
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT Calculator
        </Link>
        .
      </p>

      <h2
        id="vs-ebitda"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBT vs. EBITDA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBITDA adds back D&amp;A to an EBIT measure. EBT is pretax earnings after
        interest and other income. See the{' '}
        <Link
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA Calculator
        </Link>
        .
      </p>

      <h2
        id="vs-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBT vs. Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income is after income tax expense. Simplified: Net income ≈ EBT −
        Income tax expense (actual taxes depend on law and adjustments).
      </p>

      <h2
        id="good-ebt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good EBT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Absolute EBT should be read with revenue, margins, interest burden,
        industry, size, and history. There is no universal benchmark.
      </p>

      <h2
        id="ebt-margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is EBT Margin?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EBT Margin = (EBT / Revenue) × 100
      </div>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can a Company Improve EBT?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Levers include sustainable revenue growth, COGS and gross-margin
        management, overhead efficiency, operating productivity, borrowing-cost
        review, and evaluating non-operating income. Higher EBT does not
        automatically improve cash flow.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common EBT Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing EBT with EBIT or EBITDA.</li>
        <li>Subtracting income taxes from EBT.</li>
        <li>Double-counting depreciation.</li>
        <li>Ignoring interest or misclassifying other income.</li>
        <li>Mixing periods or currencies.</li>
        <li>Rejecting legitimate pretax losses.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of EBT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBT is not cash flow, excludes income taxes, can be affected by
        nonrecurring items and interest structure, and does not alone explain
 liquidity or solvency. This tool provides educational estimates only; 
        not accounting, tax, audit, or investment advice.
      </p>

      <h2
        id="ebt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...EBT_FAQS]} />
      </div>
    </article>
  );
}
