import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRICE_TO_SALES_FAQS } from './content';

export function PriceToSalesGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ps"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Price to Sales?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The price-to-sales (P/S) ratio compares a share&apos;s market price with
        sales (revenue) per share. It is a valuation multiple: how many times
        investors pay for each unit of sales. This calculator uses the
        per-share form shown in the reference layout.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total sales and shares outstanding for the same period.</li>
        <li>Read sales per share (sales ÷ shares).</li>
        <li>
          Enter price per share to see the P/S ratio (×). Change a money
          field&apos;s currency to convert that amount with stored FX rates;
          share counts and the ratio are never FX-converted.
        </li>
      </ol>

      <h2
        id="ps-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price to Sales Formulas
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Sales per share</strong> = Sales ÷ Shares outstanding
        </li>
        <li>
          <strong>Price to sales</strong> = Price per share ÷ Sales per share
        </li>
        <li>
          Equivalent: P/S = Market capitalization ÷ Annual revenue when market
          cap = price × shares
        </li>
      </ul>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sales 10,000,000 · 1,000,000 shares → sales per share = 10. Price per
        share 50 → P/S = 50 ÷ 10 = 5×.
      </p>

      <h2
        id="ps-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PRICE_TO_SALES_FAQS]} />
      </div>
    </article>
  );
}
