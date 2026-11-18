import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COMMISSION_FAQS } from './content';

export function CommissionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-commission-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute any one of sales price, commission rate, or commission for a simple percentage
        commission structure when the other two values are known. Leave exactly one field blank.
        Money amounts are shown in USD.
      </p>

      <h2
        id="commission-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Commission = Sales Price × Commission Rate / 100</p>
        <p>Commission Rate = Commission / Sales Price × 100</p>
        <p>Sales Price = Commission / (Commission Rate / 100)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Sales price $200,000 · Commission rate 3% · Commission blank</p>
        <p>Commission = 200,000 × 3 / 100 = $6,000.00</p>
      </div>

      <h2
        id="commission-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COMMISSION_FAQS]} />
      </div>
    </article>
  );
}
