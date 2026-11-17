import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INTEREST_COVERAGE_RATIO_FAQS } from './content';

export function InterestCoverageRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-interest-coverage-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Interest Coverage Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The interest coverage ratio compares earnings before interest and taxes (EBIT) with
        interest expense for the same period. Lenders and analysts use it as a quick check of
        how comfortably operating earnings can service interest. It is a simple ratio, not a
        full credit model, and does not replace reading the financial statements.
      </p>

      <h2
        id="interest-coverage-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interest Coverage Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Interest Coverage Ratio = EBIT ÷ Interest Expense</p>
        <p className="mt-2">Interest Expense &gt; 0</p>
        <p className="mt-2">
          When currencies differ, convert interest expense into the EBIT currency, then divide.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>EBIT = 400,000 · Interest expense = 100,000</p>
        <p>Interest coverage ratio = 400,000 ÷ 100,000 = 4.00</p>
        <p>
          If EBIT is 0, the ratio is 0. Negative EBIT yields a negative ratio. Interest expense
          must remain greater than zero.
        </p>
      </div>

      <h2
        id="interest-coverage-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INTEREST_COVERAGE_RATIO_FAQS]} />
      </div>
    </article>
  );
}
