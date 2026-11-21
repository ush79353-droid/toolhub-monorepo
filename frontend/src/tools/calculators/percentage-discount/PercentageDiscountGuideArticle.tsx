import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PERCENTAGE_DISCOUNT_FAQS } from './content';

export function PercentageDiscountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-percentage-discount"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Percentage Discount?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A percentage discount reduces a list price by a stated percent. This calculator finds
        the price after discount and the amount you save. It does not invent tax rates, BOGO
        rules, or multi-step discount stacks.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the price before discount and choose its currency.</li>
        <li>Enter the discount percent (0–100). Zero and 100% are allowed.</li>
        <li>
          Read price after discount and you save. Change their currencies to re-express the same
          results without changing the percent.
        </li>
        <li>
          Use the examples to load a dress (20%) or bed (15%) sample. For a fuller discount
          workflow, open the{' '}
          <Link
            href="/tools/discount-calculator"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Discount Calculator
          </Link>
          .
        </li>
      </ol>

      <h2
        id="percentage-discount-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Discount Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Discount Amount = Price Before × Discount / 100</p>
        <p>Price After Discount = Price Before − Discount Amount</p>
        <p>You Save = Discount Amount</p>
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
        <p>Price before discount = 5,000 PKR (new dress)</p>
        <p>Discount = 20%</p>
        <p>Discount amount = 5,000 × 20 / 100 = 1,000 PKR</p>
        <p>Price after discount = 5,000 − 1,000 = 4,000 PKR</p>
        <p>You save = 1,000 PKR</p>
      </div>

      <h2
        id="percentage-discount-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...PERCENTAGE_DISCOUNT_FAQS]} />
      </div>
    </article>
  );
}
