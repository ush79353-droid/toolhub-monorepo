import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EBITDA_MARGIN_FAQS } from './content';

export function EbitdaMarginGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ebitda-margin"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is EBITDA Margin?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EBITDA margin compares earnings before interest, taxes, depreciation, and
        amortization with total revenues for the same period. Analysts use it as a quick
        check of operating profitability before financing and non-cash charges. It is a
        simple percentage, not a complete financial model.
      </p>

      <h2
        id="ebitda-margin-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EBITDA Margin Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EBITDA Margin (%) = (EBITDA ÷ Total Revenues) × 100</p>
        <p className="mt-2">Total Revenues ≠ 0</p>
        <p className="mt-2">
          When currencies differ, convert EBITDA into the total-revenues currency, then
          divide.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total revenues = 1,000,000 · EBITDA = 250,000</p>
        <p>EBITDA margin = (250,000 ÷ 1,000,000) × 100 = 25.00%</p>
        <p>
          If EBITDA is −50,000 with the same revenues, the margin is −5.00%. Zero
          revenues are blocked.
        </p>
      </div>

      <h2
        id="ebitda-margin-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EBITDA_MARGIN_FAQS]} />
      </div>
    </article>
  );
}
