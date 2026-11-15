import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { YEAR_OVER_YEAR_GROWTH_FAQS } from './content';

export function YearOverYearGrowthGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-yoy-growth"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Year-over-Year Growth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Year-over-year growth compares a value in one year with the same value in another year and
        expresses the change as a percent. Optionally, convert multi-year change into a compound
        annualized growth rate (CAGR).
      </p>

      <h2
        id="yoy-growth-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        YoY Growth Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>YoY Growth (%) = ((Final − Initial) ÷ Initial) × 100</p>
        <p>CAGR (%) = ((Final ÷ Initial)^(1 ÷ years) − 1) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial = 100,000; Final = 120,000 → YoY = +20%</p>
        <p>Initial = 100,000; Final = 85,000 → YoY = −15%</p>
        <p>Initial = 50,000; Final = 50,000 → YoY = 0%</p>
      </div>

      <h2
        id="yoy-growth-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...YEAR_OVER_YEAR_GROWTH_FAQS]} />
      </div>
    </article>
  );
}
