import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EBITDA_FAQS } from './content';

export function EbitdaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="definition"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        EBITDA Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBITDA means Earnings Before Interest, Taxes, Depreciation, and
        Amortization. Analysts use it to compare operating earnings before
        financing, tax, and non-cash D&amp;A effects — with clear accounting
        assumptions.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate EBITDA
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        EBITDA = EBIT + D + A
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Add back only depreciation and amortization already deducted in the
        starting operating-profit measure.
      </p>

      <h2
        id="from-operating-profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA Formula From Operating Profit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Identify operating profit (EBIT under the selected definition), then add
        applicable amortization and depreciation. Do not add back expenses that
        were never deducted.
      </p>

      <h2
        id="from-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA Formula From Net Income
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EBITDA = NI + I + T + D + A
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        This simplified reconciliation may need adjustments for interest income,
        non-operating items, discontinued operations, and presentation
        differences.
      </p>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating profit 100,000 + Amortization 10,000 + Depreciation 20,000 →
        EBITDA 130,000.
      </p>

      <h2
        id="vs-ebit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA vs. EBIT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBIT includes D&amp;A when those expenses have been deducted. EBITDA adds
        them back. See the{' '}
        <a
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT Calculator
        </a>
        .
      </p>

      <h2
        id="vs-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA vs. Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income is after interest, taxes, and other applicable items. EBITDA
        excludes those effects by construction under the chosen reconciliation.
      </p>

      <h2
        id="vs-ocf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA vs. Operating Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBITDA generally does not capture working-capital changes, cash taxes,
        or other cash-flow statement adjustments. It is not a cash substitute.
      </p>

      <h2
        id="vs-fcf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA vs. Free Cash Flow
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        FCF ≈ Operating Cash Flow − Capital Expenditures
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        A business can show positive EBITDA and still have negative free cash
        flow when capital spending or working capital absorb cash.
      </p>

      <h2
        id="ebitda-margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is EBITDA Margin?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EBITDA Margin = (EBITDA / Revenue) × 100
      </div>

      <h2
        id="ebitda-multiple"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is an EBITDA Multiple?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        EV / EBITDA = Enterprise Value / EBITDA
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Multiples vary by industry, growth, capital intensity, and risk. Zero
        EBITDA makes the multiple undefined; negative EBITDA is generally not
        interpreted as a conventional positive-EBITDA valuation multiple.
      </p>

      <h2
        id="good-ebitda"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good EBITDA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Absolute EBITDA should be read with revenue, size, industry, capital
        intensity, margins, and history. There is no universal target.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is EBITDA Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It supports financial analysis, valuation discussions, operating
        comparisons, and trend monitoring — always alongside cash flow and debt
        context.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can a Business Improve EBITDA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common levers include sustainable revenue growth, cost management,
        productivity, pricing, product mix, and operational efficiency. Higher
        EBITDA does not automatically improve cash flow or enterprise value.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common EBITDA Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing EBIT and EBITDA.</li>
        <li>Double-counting depreciation or amortization.</li>
        <li>Adding back expenses not included in EBIT.</li>
        <li>Treating EBITDA as cash flow.</li>
        <li>Mixing periods or currencies.</li>
        <li>Ignoring negative EBITDA.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of EBITDA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBITDA excludes interest and taxes, adds back D&amp;A, does not deduct
        capital expenditures or working-capital cash needs, and may not reflect
        debt-servicing capacity. Adjusted EBITDA can differ from standard
        EBITDA. This tool provides educational estimates only — not accounting,
        audit, or investment advice.
      </p>

      <h2
        id="ebitda-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...EBITDA_FAQS]} />
      </div>
    </article>
  );
}
