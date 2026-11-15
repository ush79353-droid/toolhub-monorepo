import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TTM_FAQS } from './content';

export function TtmGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-ttm" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is TTM?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trailing twelve months (TTM) estimates a full-year financial figure from the latest four
        reported quarters. Use it when you need a current run-rate for cash flow, dividends, or
        similar quarterly amounts.
      </p>

      <h2 id="ttm-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        TTM Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>TTM = Q0 + Q1 + Q2 + Q3</p>
        <p>Sum four consecutive quarterly values — do not average or ×4 annualize</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Q0 = 120,000; Q1 = 110,000; Q2 = 100,000; Q3 = 90,000</p>
        <p>TTM = 420,000</p>
      </div>

      <h2 id="ttm-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TTM_FAQS]} />
      </div>
    </article>
  );
}
