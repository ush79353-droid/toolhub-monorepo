import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TRIPLE_DISCOUNT_FAQS } from './content';

export function TripleDiscountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-triple-discount"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Triple Discount?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A triple discount applies three percent-off reductions one after another. Each
        later discount acts on the already-reduced price, so the combined savings is less
        than simply adding the three percentages. This calculator finds the final price,
        price difference (savings), and the single equivalent (effective) discount percent.
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
        <li>Enter the 2nd and 3rd discount percents (0–100). Both default to 0%.</li>
        <li>
          Read Final price and Price difference. Change their currencies to re-express the
          same results without changing the percents.
        </li>
        <li>
          Expand Effective discount to see the single combined percent that matches all
          three sequential discounts.
        </li>
      </ol>

      <h2
        id="triple-discount-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Triple Discount Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Final Price = Original Price × (1 − D1/100) × (1 − D2/100) × (1 − D3/100)
        </p>
        <p>Price Difference = Original Price − Final Price</p>
        <p>
          Effective Discount (%) = [1 − (1 − D1/100)(1 − D2/100)(1 − D3/100)] × 100
        </p>
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
        <p>3rd discount = 20%</p>
        <p>Final price = 10,000 × 0.8 × 0.8 × 0.8 = 5,120 PKR</p>
        <p>Price difference = 10,000 − 5,120 = 4,880 PKR</p>
        <p>Effective discount = [1 − 0.8 × 0.8 × 0.8] × 100 = 48.8%</p>
      </div>

      <h2
        id="triple-discount-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TRIPLE_DISCOUNT_FAQS]} />
      </div>
    </article>
  );
}
