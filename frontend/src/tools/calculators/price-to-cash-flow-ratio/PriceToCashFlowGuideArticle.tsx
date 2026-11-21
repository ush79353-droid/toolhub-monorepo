import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRICE_TO_CASH_FLOW_FAQS } from './content';

export function PriceToCashFlowGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-pcf"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Price to Cash Flow?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The price-to-cash-flow (P/CF) ratio compares a share&apos;s market price
        with operating cash flow per share. It is a valuation multiple: how many
        times investors pay for each unit of cash flow. This calculator treats
        entered cash flow as operating cash flow for a consistent P/CF definition.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total operating cash flow and shares outstanding for the same period.</li>
        <li>Read cash flow per share (cash flow ÷ shares).</li>
        <li>
          Enter price per share to see the P/CF ratio (×). Change a money
          field&apos;s currency to convert that amount with stored FX rates;
          share counts and the ratio are never FX-converted.
        </li>
      </ol>

      <h2
        id="pcf-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price to Cash Flow Formulas
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Cash flow per share</strong> = Cash flow ÷ Shares outstanding
        </li>
        <li>
          <strong>Price to cash flow</strong> = Price per share ÷ Cash flow per
          share
        </li>
        <li>
          Equivalent: P/CF = Market capitalization ÷ Operating cash flow when
          market cap = price × shares
        </li>
      </ul>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash flow 10,000,000 · 1,000,000 shares → cash flow per share = 10.
        Price per share 150 → P/CF = 150 ÷ 10 = 15×.
      </p>

      <h2
        id="pcf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PRICE_TO_CASH_FLOW_FAQS]} />
      </div>
    </article>
  );
}
