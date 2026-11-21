import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OHIO_SALES_TAX_FAQS } from './content';

export function OhioSalesTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ohio-sales-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Ohio Sales Tax?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ohio sales tax is a combined rate: the statewide base plus county and, in many
        places, transit authority add-ons. The correct rate depends on the taxing
 jurisdiction for the delivery or sale location, not a single number for every ZIP.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the purchase amount in USD.</li>
        <li>Enter a five-digit Ohio ZIP code (43001–45999).</li>
        <li>
          Review the unavailable-rate notice. Tax dollars are not calculated without a
          verified rate table.
        </li>
      </ol>

      <h2
        id="why-unavailable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Rates Are Unavailable
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This repository has no authorized Ohio Department of Taxation ZIP/jurisdiction rate
        dataset. Fabricating mappings would violate screenshot-first accuracy rules. When a
        verified table is added, this calculator can look up combined rates and compute{' '}
        <code>Sales Tax = Purchase × Rate / 100</code> and{' '}
        <code>Total = Purchase + Sales Tax</code>.
      </p>

      <h2
        id="ohio-sales-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3 not-prose">
        <FAQAccordion faqs={[...OHIO_SALES_TAX_FAQS]} />
      </div>
    </article>
  );
}
