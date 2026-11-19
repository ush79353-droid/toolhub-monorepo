import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COMMERCIAL_LEASE_FAQS } from './content';

export function CommercialLeaseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-commercial-lease"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Commercial Lease Calculator estimates fully taxable commercial rent from leasable area, a
        base rental rate, and operating expenses charged per area per period. It also estimates a
        rental agent&apos;s fee as a percent of a chosen number of years of annual rent. It does not
        invent lease escalations, taxes, VAT, or maintenance fees beyond the operating-expense field.
      </p>

      <h2
        id="commercial-lease-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total rental rate = Base rental rate + Operating expenses</p>
        <p className="mt-2">Annual rent = Total rental rate (per area / year) × Area</p>
        <p className="mt-2">Monthly rent = Annual rent ÷ 12</p>
        <p className="mt-2">
          Agent fee = Annual rent × Equivalent years × Agent % ÷ 100
        </p>
      </div>

      <h2
        id="currency-and-units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currency &amp; Units
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Area uses m² or ft² (1 ft² = 0.09290304 m²). Rate periods yearly or monthly normalize to a
        per-year rate before multiplying by area. Every money field has its own currency (default
        PKR); amounts are FX-normalized with stored rates. Area units, periods, and the agent
        percentage are never currency-converted.
      </p>

      <h2
        id="commercial-lease-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...COMMERCIAL_LEASE_FAQS]} />
      </div>
    </article>
  );
}
