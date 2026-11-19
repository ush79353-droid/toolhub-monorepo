import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PROFIT_FAQS } from './content';

export function ProfitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-profit"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Profit Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates total profit from a buying cost and selling price that may
        each cover more than one unit, a sales quantity, and an optional percent discount on
        revenue. It does not add taxes, overhead, fees, or other unsupported costs.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter buying cost and how many units that cost covers (default 1).</li>
        <li>Enter selling price and how many units that price covers (default 1).</li>
        <li>Set quantity sold (default 1) and discount % (default 0).</li>
        <li>Read total cost, revenue, and total profit; change result currencies to re-express amounts.</li>
      </ol>

      <h2
        id="profit-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Profit Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Unit Cost = Cost / Cost Per</p>
        <p>Unit Selling Price = Price / Price Per</p>
        <p>Total Cost = Unit Cost × Quantity</p>
        <p>Revenue = Unit Selling Price × Quantity × (1 − Discount / 100)</p>
        <p>Total Profit = Revenue − Total Cost</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost-per and price-per must be greater than zero. Cost, price, and quantity must be
        zero or greater. Discount must be between 0% and 100%. Calculations keep full
        precision and round only for display.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cost = 100 PKR per 1 unit · Price = 150 PKR per 1 unit</p>
        <p>Quantity = 10 · Discount = 10%</p>
        <p>Unit cost = 100 · Unit price = 150</p>
        <p>Total cost = 100 × 10 = 1,000 PKR</p>
        <p>Revenue = 150 × 10 × (1 − 0.10) = 1,350 PKR</p>
        <p>Total profit = 1,350 − 1,000 = 350 PKR</p>
      </div>

      <h2
        id="profit-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...PROFIT_FAQS]} />
      </div>
    </article>
  );
}
