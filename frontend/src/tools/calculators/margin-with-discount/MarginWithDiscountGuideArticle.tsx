import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGIN_WITH_DISCOUNT_FAQS } from './content';

export function MarginWithDiscountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-margin-with-discount"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Margin With Discount?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pricing often starts from cost plus a target margin or markup, then a sale
        discount reduces the selling price. This calculator builds base revenue from
        cost and either base margin or base markup, applies the discount, and reports
        the true margin, true markup, and profit after the price cut.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter cost before discount and choose its currency.</li>
        <li>
          Enter base margin % or base markup % (or base revenue). The other values
          sync automatically; the last field you edit among those three is
          authoritative.
        </li>
        <li>Enter the discount percent (0–100). Zero means no discount.</li>
        <li>
          Read price after discount, true margin, true markup, and profit. Change
          result currencies to re-express money amounts without changing percents.
        </li>
      </ol>

      <h2
        id="margin-with-discount-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Base Revenue (from margin) = Cost / (1 − Base Margin/100)</p>
        <p>Base Revenue (from markup) = Cost × (1 + Base Markup/100)</p>
        <p>Price After Discount = Base Revenue × (1 − Discount/100)</p>
        <p>Profit = Price After Discount − Cost</p>
        <p>True Margin (%) = Profit / Price After Discount × 100</p>
        <p>True Markup (%) = Profit / Cost × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost must be zero or greater. Discount must be between 0% and 100%. Base
        margin must be less than 100% when deriving revenue. Calculations keep full
        precision and round only for display. Division by zero and non-finite results
        produce no output.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cost = 100 PKR</p>
        <p>Base margin = 25% → Base revenue = 100 / 0.75 ≈ 133.3333 PKR</p>
        <p>Synced base markup = (133.3333 − 100) / 100 × 100 ≈ 33.3333%</p>
        <p>Discount = 10% → Price after discount ≈ 120 PKR</p>
        <p>Profit ≈ 20 PKR</p>
        <p>True margin ≈ 16.6667%; True markup = 20%</p>
      </div>

      <h2
        id="margin-with-discount-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MARGIN_WITH_DISCOUNT_FAQS]} />
      </div>
    </article>
  );
}
