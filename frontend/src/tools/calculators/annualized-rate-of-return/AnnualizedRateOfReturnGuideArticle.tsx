import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ANNUALIZED_RATE_OF_RETURN_FAQS } from './content';

export function AnnualizedRateOfReturnGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-annualized-rate-of-return"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Annualized Rate of Return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annualized rate of return expresses a period return as an equivalent yearly compounded rate.
        It helps compare returns measured over different periods on a common annual basis.
      </p>

      <h2
        id="annualized-rate-of-return-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annualized Rate of Return Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annualized Return (%) = ((1 + Period Rate / 100)^N − 1) × 100</p>
        <p className="mt-2">N = 1, 4, 12, 52, or 365 for annual, quarterly, monthly, weekly, or daily.</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Period = Monthly (N = 12)</p>
        <p>Period rate = 2%</p>
        <p>Annualized return = ((1.02)^12 − 1) × 100 ≈ 26.82%</p>
      </div>

      <h2
        id="annualized-rate-of-return-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ANNUALIZED_RATE_OF_RETURN_FAQS]} />
      </div>
    </article>
  );
}
