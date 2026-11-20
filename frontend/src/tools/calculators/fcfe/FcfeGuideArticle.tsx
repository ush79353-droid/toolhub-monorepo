import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FCFE_FAQS } from './content';

export function FcfeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-fcfe"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is FCFE?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Free Cash Flow to Equity (FCFE) estimates residual cash flow potentially
        available to equity holders after operating cash generation, required
        reinvestment, and net debt financing. It supports equity valuation,
        forecasting, and capital-allocation analysis.
      </p>

      <h2
        id="fcfe-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FCFE Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        FCFE = NI + D&amp;A − CapEx − ΔNWC + Net Borrowing
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive CapEx and positive working-capital investment reduce FCFE.
        Positive net borrowing increases FCFE; debt repayment decreases it.
      </p>

      <h2
        id="from-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate FCFE From Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start with NI (already after interest and taxes), add D&amp;A, subtract
        CapEx and ΔNWC, then add net borrowing. Do not subtract interest or taxes
        again.
      </p>

      <h2
        id="from-ebit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate FCFE From EBIT
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        FCFE = (EBIT − Interest)(1 − t) + D&amp;A − CapEx − ΔNWC + NB
      </div>

      <h2
        id="from-ebitda"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate FCFE From EBITDA
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        FCFE = (EBITDA − D&amp;A − Interest)(1 − t) + D&amp;A − CapEx − ΔNWC + NB
      </div>

      <h2
        id="from-cfo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate FCFE From CFO
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        FCFE = CFO − CapEx + Net Borrowing
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        This assumes after-interest CFO. Interest classification differs across
        frameworks — reconcile if interest sits outside operating cash flow.
      </p>

      <h2
        id="from-fcff"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate FCFE From FCFF
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        FCFE = FCFF − Interest(1 − t) + Net Borrowing
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        See the{' '}
        <a
          href="/tools/fcff-calculator-free-cash-flow-to-firm"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FCFF Calculator
        </a>
        .
      </p>

      <h2
        id="net-borrowing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Net Borrowing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer Debt issued − Debt repaid. Ending debt − Beginning debt is a
        simplified estimate that may miss FX, acquisitions, conversions, and other
        noncash debt changes.
      </p>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete FCFE Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NI 500,000 · Beginning debt 200,000 · Ending debt 260,000 (NB = 60,000) ·
        D&amp;A 80,000 · CapEx 150,000 · ΔNWC 40,000 → FCFE ={' '}
        <strong>450,000</strong>.
      </p>

      <h2
        id="what-it-tells"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does FCFE Tell Investors?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FCFE informs equity cash generation, financial flexibility, reinvestment
        intensity, financing effects, and potential capacity for distributions —
        without guaranteeing dividends.
      </p>

      <h2
        id="vs-fcff"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FCFE vs. FCFF
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FCFF is unlevered cash flow to all capital providers; FCFE is residual
        equity cash flow after after-tax interest and net borrowing. Discount FCFE
        with cost of equity, not WACC.
      </p>

      <h2
        id="vs-dividends"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FCFE vs. Dividends
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Companies can have positive FCFE and pay no dividends, or distribute more
        than current-period FCFE using cash reserves.
      </p>

      <h2
        id="vs-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FCFE vs. Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net income is accrual earnings. FCFE adjusts for D&amp;A, CapEx, working
        capital, and net borrowing — they often differ in the same period.
      </p>

      <h2
        id="vs-cfo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FCFE vs. Operating Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CFO covers operating activities. FCFE also reflects CapEx and net
        borrowing under the after-interest convention.
      </p>

      <h2
        id="valuation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is FCFE Important in Valuation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Discounted FCFE models estimate equity value using cost of equity. Do not
        mix FCFE cash flows with a WACC discount rate designed for FCFF.
      </p>

      <h2
        id="good-fcfe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good FCFE?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Absolute FCFE depends on scale, industry, growth, reinvestment, and
        financing. Avoid universal thresholds.
      </p>

      <h2
        id="negative-fcfe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can FCFE Be Negative?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes — and it can reflect growth investment, large CapEx, working-capital
        needs, or debt repayment as well as weak operations.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can a Company Improve FCFE?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Levers include sustainable earnings, working-capital efficiency, disciplined
        CapEx, collections, and inventory management. Raising debt can mechanically
        increase FCFE without improving operations.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common FCFE Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing FCFE with FCFF.</li>
        <li>Forgetting net borrowing or using total debt instead of the change.</li>
        <li>Double-counting CapEx, D&amp;A, interest, taxes, or ΔNWC.</li>
        <li>Inconsistent tax treatments or discounting FCFE with WACC.</li>
        <li>Mixing periods or currencies; treating negative FCFE as an automatic error.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of FCFE
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FCFE depends on accounting and forecast assumptions; net borrowing and CapEx
        can be volatile; FCFE does not guarantee dividends; simplified models may omit
        preferred equity, minorities, leases, or complex financing. Educational
        estimates only — not accounting, valuation, or investment advice.
      </p>

      <h2
        id="fcfe-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={[...FCFE_FAQS]} />
      </div>
    </article>
  );
}
