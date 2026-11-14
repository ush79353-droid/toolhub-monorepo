import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DMPV_FAQS } from './content';

export function DirectMaterialPriceVarianceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-price-variance"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Price Variance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Direct materials price variance shows how much more or less you spent on materials because the
        purchase price differed from the standard rate, for a given quantity.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Price Variance = (Actual Rate − Standard Rate) × Quantity</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive results are labeled Unfavorable; negative results are Favorable; zero is No variance.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Standard rate = 100 · Actual rate = 120 · Quantity = 500</p>
        <p>Variance = (120 − 100) × 500 = 10,000 (Unfavorable)</p>
      </div>

      <h2 id="dmpv-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DMPV_FAQS]} />
      </div>
    </article>
  );
}
