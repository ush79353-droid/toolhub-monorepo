import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RENT_INCREASE_FAQS } from './content';

export function RentIncreaseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-rent-increase"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Rent Increase?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Landlords and tenants often plan for annual rent changes. This calculator compounds an
        average yearly percent change over a chosen number of years to estimate expected future
        annual rent from today’s annual rent.
      </p>

      <h2
        id="rent-increase-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rent Increase Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Future Annual Rent = Current Annual Rent × (1 + Annual Change / 100)
          <sup>Years</sup>
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Current annual rent = PKR 120,000</p>
        <p>Average rent change = 5% per year</p>
        <p>Number of years = 3</p>
        <p>Future annual rent = 120,000 × (1.05)<sup>3</sup> = PKR 138,915.00</p>
      </div>

      <h2
        id="rent-increase-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...RENT_INCREASE_FAQS]} />
      </div>
    </article>
  );
}
