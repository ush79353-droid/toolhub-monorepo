import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REAL_RATE_OF_RETURN_FAQS } from './content';

export function RealRateOfReturnGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-real-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Real Rate of Return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The real rate of return is the inflation-adjusted yield of an investment. It shows how
        much purchasing power you gained or lost after prices changed.
      </p>

      <h2
        id="fisher-equation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fisher Equation
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Real Rate (%) = [((1 + Nominal / 100) / (1 + Inflation / 100)) − 1] × 100
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Nominal rate = 10%</p>
        <p>Inflation rate = 4%</p>
        <p>Real rate = ((1.10 / 1.04) − 1) × 100 ≈ 5.7692%</p>
      </div>

      <h2
        id="real-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...REAL_RATE_OF_RETURN_FAQS]} />
      </div>
    </article>
  );
}
