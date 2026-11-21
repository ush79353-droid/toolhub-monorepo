import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CALIFORNIA_SALES_TAX_FAQS } from './content';

export function CaliforniaSalesTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-california-sales-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is California Sales Tax?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        California sales and use tax combines the statewide base with district
        (county, city, and special district) add-ons. The correct combined rate
 depends on the exact sale or delivery location, not a single statewide
        number and not ZIP alone.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the purchase amount in USD.</li>
        <li>Enter the street address of the purchase location.</li>
        <li>Enter the city.</li>
        <li>Enter the five-digit California ZIP code.</li>
        <li>
 Review the estimated combined rate, tax, and total, or the unavailable
          notice when CDTFA cannot resolve a single jurisdiction.
        </li>
      </ol>

      <h2
        id="cdtfa-data"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Official CDTFA Data
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rates are looked up through the California Department of Tax and Fee
        Administration Tax Rate API (
        <code>GetRateByAddress</code>). When a single rate is returned, tax is
        estimated as{' '}
        <code>Tax = Purchase × Combined Rate</code> and{' '}
        <code>Total = Purchase + Tax</code>. Multiple or missing matches are not
        auto-resolved. Use is subject to the{' '}
        <a
          href="https://www.cdtfa.ca.gov/dataportal/policy.htm"
          target="_blank"
          rel="noreferrer"
        >
          CDTFA Open Data Portal Terms of Use
        </a>
        .
      </p>

      <h2
        id="california-sales-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3 not-prose">
        <FAQAccordion faqs={[...CALIFORNIA_SALES_TAX_FAQS]} />
      </div>
    </article>
  );
}
