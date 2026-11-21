import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DOUBLE_DISCOUNT_FAQS } from './content';

export function DoubleDiscountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-double-discount"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Double Discount?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A double discount applies two percent-off reductions one after another. The second
        discount acts on the already-reduced price, so the combined savings is less than
        simply adding the two percentages. This calculator finds the final price, total
        savings, and the single equivalent (effective) discount percent.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the original price and choose its currency.</li>
        <li>Enter the 1st discount percent (0–100). Zero is allowed.</li>
        <li>Enter the 2nd discount percent (0–100). Zero is allowed.</li>
        <li>
          Read Final price and Total savings. Change their currencies to re-express the same
          results without changing the percents.
        </li>
        <li>
          Expand Effective discount to see the single combined percent that matches both
          sequential discounts.
        </li>
      </ol>

      <h2
        id="double-discount-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Double Discount Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Final Price = Original Price × (1 − D1/100) × (1 − D2/100)</p>
        <p>Total Savings = Original Price − Final Price</p>
        <p>Effective Discount (%) = D1 + D2 − (D1 × D2 / 100)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculations keep full precision and round only for display. Invalid or non-finite
        inputs produce no result. Final price is never negative when inputs are valid.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Original price = 10,000 PKR</p>
        <p>1st discount = 20%</p>
        <p>2nd discount = 20%</p>
        <p>Final price = 10,000 × 0.8 × 0.8 = 6,400 PKR</p>
        <p>Total savings = 10,000 − 6,400 = 3,600 PKR</p>
        <p>Effective discount = 20 + 20 − (20 × 20 / 100) = 36%</p>
      </div>

      <h2
        id="double-discount-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DOUBLE_DISCOUNT_FAQS]} />
      </div>
    </article>
  );
}
