import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REVENUE_GROWTH_FAQS } from './content';

export function RevenueGrowthGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-revenue-growth"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Revenue Growth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total growth compares two revenue figures as a single percentage change.
        The growth rate section compounds that change across a number of periods
        (the same math as CAGR when periods are years).
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter initial and final revenue in the Total growth section.</li>
        <li>Read total growth % (undefined when initial revenue is zero).</li>
        <li>In Growth rate, enter initial, final, and number of periods.</li>
        <li>Read the compound growth rate % per period.</li>
      </ol>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total Growth (%) = (Final − Initial) / Initial × 100</p>
        <p>
          Growth Rate (%) = [(Final / Initial)^(1 / Periods) − 1] × 100
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial 100 · Final 120 → Total growth 20%</p>
        <p>Initial 100 · Final 161.051 · 5 periods → Growth rate ≈ 10%/period</p>
      </div>

      <h2
        id="revenue-growth-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...REVENUE_GROWTH_FAQS]} />
      </div>
    </article>
  );
}
