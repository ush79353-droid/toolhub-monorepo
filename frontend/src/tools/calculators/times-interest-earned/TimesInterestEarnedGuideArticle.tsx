import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TIMES_INTEREST_EARNED_FAQS } from './content';

export function TimesInterestEarnedGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-tie-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Times Interest Earned Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The times interest earned (TIE) ratio compares earnings before interest and taxes
        (EBIT) with total interest for the same period. Analysts use it as a quick check of how
        comfortably operating earnings can service interest. It is a simple ratio, not a full
        credit model, and does not replace reading the financial statements.
      </p>

      <h2
        id="tie-ratio-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        TIE Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>TIE Ratio = EBIT ÷ Total Interest</p>
        <p className="mt-2">Total Interest &gt; 0</p>
        <p className="mt-2">
          When currencies differ, convert total interest into the EBIT currency, then divide.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>EBIT = 400,000 · Total interest = 100,000</p>
        <p>TIE ratio = 400,000 ÷ 100,000 = 4.00</p>
        <p>
          If EBIT is 0, the ratio is 0. Negative EBIT yields a negative ratio. Total interest
          must remain greater than zero.
        </p>
      </div>

      <h2
        id="tie-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TIMES_INTEREST_EARNED_FAQS]} />
      </div>
    </article>
  );
}
