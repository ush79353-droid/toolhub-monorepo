import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGIN_SALES_TAX_FAQS } from './content';

export function MarginAndSalesTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-margin-sales-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Margin and Sales Tax?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter your cost and markup to get the net (pre-tax) selling price, margin,
        and profit. Apply a sales-tax percentage to see the gross customer price.
        Sales tax is not treated as profit.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter cost and choose its currency.</li>
        <li>Enter markup % (of cost). Zero markup is allowed.</li>
        <li>Read net price, margin %, and profit.</li>
        <li>Enter sales tax % to see the gross price charged to the customer.</li>
      </ol>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net Price = Cost × (1 + Markup / 100)</p>
        <p>Profit = Net Price − Cost</p>
        <p>Margin (%) = Profit / Net Price × 100</p>
        <p>Gross Price = Net Price × (1 + Sales Tax / 100)</p>
        <p>Sales Tax Amount = Gross Price − Net Price</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cost 100 · Markup 25% → Net 125 · Profit 25 · Margin 20%</p>
        <p>Sales tax 10% → Gross 137.50 · Tax amount 12.50</p>
      </div>

      <h2
        id="margin-sales-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...MARGIN_SALES_TAX_FAQS]} />
      </div>
    </article>
  );
}
