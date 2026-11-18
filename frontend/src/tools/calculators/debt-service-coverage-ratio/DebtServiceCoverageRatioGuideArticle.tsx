import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEBT_SERVICE_COVERAGE_RATIO_FAQS } from './content';

export function DebtServiceCoverageRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-dscr"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Debt Service Coverage Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The debt service coverage ratio (DSCR) compares net operating income (NOI) with
        debt service for the same period. Real-estate and commercial lenders use it to
        see whether income can cover loan payments. A ratio above 1.0× means NOI exceeds
        debt service; below 1.0× means income alone is not enough. It is a quick screen,
        not a complete credit analysis.
      </p>

      <h2
        id="dscr-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DSCR Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly payment (amortizing):</p>
        <p className="mt-1">r = Annual Rate / 1200</p>
        <p>n = Term × 12 (when term is in years)</p>
        <p>Payment = P × r / (1 − (1+r)^(-n))</p>
        <p className="mt-1">Zero interest: Payment = P / n</p>
        <p className="mt-3">NOI builder (optional):</p>
        <p>NOI = (1 − expenses%) × (1 − vacancy%) × Gross Income</p>
        <p className="mt-3">DSCR = Monthly NOI ÷ Monthly Debt Service</p>
        <p className="mt-2">
          When currencies differ, convert payment and NOI into the total-loan currency,
          align both to monthly periods, then divide. Debt service must be &gt; 0.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan = 1,000,000 · Rate = 4%/yr · Term = 20 years</p>
        <p>
          Monthly payment ≈ 4,183.42 (standard amortization). If monthly NOI = 9,000,
          DSCR ≈ 9,000 ÷ 4,183.42 ≈ 2.15×.
        </p>
        <p className="mt-2">
          With gross income 12,000 / mo, expenses 20%, vacancy 5%: NOI = 0.80 × 0.95 ×
          12,000 = 9,120 → DSCR ≈ 2.18×.
        </p>
      </div>

      <h2
        id="dscr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEBT_SERVICE_COVERAGE_RATIO_FAQS]} />
      </div>
    </article>
  );
}
