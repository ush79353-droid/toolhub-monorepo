import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FFO_FAQS } from './content';

export function FfoGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ffo"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Funds From Operations (FFO)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Funds From Operations (FFO) is a non-GAAP performance measure widely used
        to analyze real estate investment trusts (REITs). It adjusts net income
        for selected real estate depreciation and amortization and certain gains
        and losses on real estate sales. FFO is not operating cash flow and not a
        guarantee of dividends.
      </p>

      <h2
        id="reit-meaning"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The FFO Meaning in Real Estate Investment Trusts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GAAP depreciation can make REIT net income less reflective of recurring
        property operations. FFO helps investors compare operating performance
        across periods and peers under a common reconciliation approach.
      </p>

      <h2
        id="ffo-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FFO Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        FFO = NI + D&amp;A − Gains + Losses
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interest income is generally retained in net income under standard REIT
        FFO and is not subtracted again unless you explicitly choose a custom
        adjusted convention.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate FFO
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine net income for the period.</li>
        <li>Identify qualifying real estate D&amp;A already deducted in NI.</li>
        <li>Identify qualifying property sale gains and losses in NI.</li>
        <li>Add D&amp;A, subtract gains, add losses.</li>
        <li>Apply optional custom interest-income exclusion only if selected.</li>
        <li>Interpret FFO with cash flow, leverage, and CapEx context.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete FFO Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NI 500,000 + D&amp;A 150,000 − Gains 125,000 + Losses 50,000 = Standard
        FFO <strong>575,000</strong>. Interest income of 75,000 does not change
        standard FFO; an optional adjusted result would be 500,000.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is FFO Important for REIT Investors?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FFO supports REIT operating analysis, peer comparison, trend review, and
        portfolio performance discussion — alongside cash flow and balance-sheet
        metrics.
      </p>

      <h2
        id="vs-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FFO vs. Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income includes depreciation charges and sale gains/losses. FFO
        adjusts selected items. FFO supplements — it does not replace — GAAP net
        income.
      </p>

      <h2
        id="vs-cfo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FFO vs. Operating Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating cash flow follows the cash-flow statement. FFO does not
        automatically include working-capital changes, recurring CapEx, or debt
        principal repayments.
      </p>

      <h2
        id="vs-ebitda"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FFO vs. EBITDA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBITDA adds back D&amp;A before interest and taxes. FFO starts from net
        income with REIT-specific sale adjustments. See the{' '}
        <Link
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA Calculator
        </Link>
        .
      </p>

      <h2
        id="vs-affo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FFO vs. AFFO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adjusted Funds From Operations (AFFO) often starts from FFO and subtracts
        recurring capital expenditures plus other issuer-defined items. AFFO is
        not universally standardized. Do not treat interest-income exclusion as
        standard AFFO.
      </p>

      <h2
        id="ffo-per-share"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is FFO Per Share?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        FFO Per Share = FFO / Weighted-Average Shares
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use a consistent FFO numerator and diluted/basic share count. FFO per
        share is not EPS or dividends per share.
      </p>

      <h2
        id="how-investors-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Investors Use FFO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common uses include historical FFO trends, FFO per share growth,
        price-to-FFO comparisons, and context for dividend discussions.
      </p>

      <h2
        id="good-ffo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good FFO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Evaluate FFO with REIT size, property sector, leverage, occupancy,
        financing costs, growth, and CapEx. Avoid universal benchmarks.
      </p>

      <h2
        id="negative-ffo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can FFO Be Negative?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes. Weak operations, large losses after adjustments, or unusual items
        can produce negative FFO without automatically implying insolvency.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common FFO Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing FFO with net income, cash flow, or AFFO.</li>
        <li>Adding back unrelated non-real-estate depreciation.</li>
        <li>Subtracting sale proceeds instead of accounting gains.</li>
        <li>Subtracting interest income under standard FFO without justification.</li>
        <li>Mixing periods, currencies, or inconsistent share counts.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of FFO
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FFO is non-GAAP, not cash flow, and does not automatically deduct
        recurring CapEx. Official Nareit reconciliations may include additional
        adjustments. Related:{' '}
        <Link
          href="/tools/fcfe-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FCFE Calculator
        </Link>
        . Educational estimates only — not accounting, audit, or investment advice.
      </p>

      <h2
        id="ffo-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...FFO_FAQS]} />
      </div>
    </article>
  );
}
