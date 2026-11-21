import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DISCOUNT_FAQS } from './content';

export function DiscountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-discount"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Percent-Off Discount?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A percent-off discount reduces an original (list) price by a stated percentage. This
        calculator finds the sale price you pay and the amount you save. Only the verified
        %&nbsp;off mode is available — other discount styles are not invented here.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm discount type is % off (the only supported mode).</li>
        <li>Enter the original price and choose its currency.</li>
        <li>Enter the discount percent (0–100). Zero discount is allowed.</li>
        <li>
          Choose Tax included? Yes if the price already includes tax, or No if it excludes tax.
          This does not change the numeric result.
        </li>
        <li>
          Read You pay and You&apos;re saving. Change their currencies to re-express the same
          results without changing the percent.
        </li>
      </ol>

      <h2
        id="discount-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Discount Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Discount Amount = Original Price × Discount Rate / 100</p>
        <p>Final Price (You pay) = Original Price − Discount Amount</p>
        <p>Savings (You&apos;re saving) = Discount Amount</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculations keep full precision and round only for display. Invalid or non-finite
        inputs produce no result. Final price is never negative when inputs are valid.
      </p>

      <h2
        id="tax-included"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax Included Labeling
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No verified tax rate exists for this tool in project specs or a Simple Discount sibling.
        Therefore <strong>Tax included?</strong> is informational only: Yes means the original
        price already includes tax; No means it excludes tax. The calculator does not add, remove,
        or invent a sales-tax percentage.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Original price = 10,000 PKR</p>
        <p>Discount = 20%</p>
        <p>Discount amount = 10,000 × 20 / 100 = 2,000 PKR</p>
        <p>You pay = 10,000 − 2,000 = 8,000 PKR</p>
        <p>You&apos;re saving = 2,000 PKR</p>
      </div>

      <h2
        id="discount-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DISCOUNT_FAQS]} />
      </div>
    </article>
  );
}
