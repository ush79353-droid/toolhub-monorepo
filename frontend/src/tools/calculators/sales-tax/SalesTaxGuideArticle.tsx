import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SALES_TAX_FAQS } from './content';

export function SalesTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-sales-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Sales Tax Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator converts between a tax-exclusive net price and a tax-inclusive gross price
        for any sales tax percentage you enter. It does not look up ZIP or state rates.
      </p>

      <h2
        id="sales-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Tax Amount = Net Price × Sales Tax / 100</p>
        <p>Gross Price = Net Price + Tax Amount</p>
        <p>Net Price = Gross Price / (1 + Sales Tax / 100)</p>
        <p>Tax Amount = Gross Price − Net Price</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Sales tax = 10%</p>
        <p>Net price = 100 → Tax = 10 · Gross = 110</p>
        <p>Gross price = 110 → Net = 100 · Tax = 10</p>
      </div>

      <h2
        id="sales-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SALES_TAX_FAQS]} />
      </div>
    </article>
  );
}
