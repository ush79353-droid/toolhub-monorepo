import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RENTAL_COMMISSION_FAQS } from './content';

export function RentalCommissionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-rental-commission"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Rental Commission?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rental commission is the fee commonly charged by a letting agent or broker, often expressed
        as a fraction of one month&apos;s rent or as a percent of annual rent. This calculator
        converts between annual and monthly rent and estimates common half-month, one-month, and
        one-and-a-half-month fees plus a custom percentage. It does not add taxes, VAT, or other
        deductions.
      </p>

      <h2
        id="rental-commission-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Rent = Monthly Rent × 12</p>
        <p className="mt-2">Monthly Rent = Annual Rent ÷ 12</p>
        <p className="mt-2">½ month commission = Monthly Rent × 0.5</p>
        <p className="mt-2">1 month commission = Monthly Rent</p>
        <p className="mt-2">1½ months commission = Monthly Rent × 1.5</p>
        <p className="mt-2">Custom commission = Annual Rent × Custom % ÷ 100</p>
      </div>

      <h2
        id="currency-notes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currency Notes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Every money field has its own currency selector (default PKR). Inputs are normalized with
        stored FX rates before the formulas run; each result is then shown in its selected currency.
        The custom percentage is a pure ratio and is never FX-converted.
      </p>

      <h2
        id="rental-commission-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...RENTAL_COMMISSION_FAQS]} />
      </div>
    </article>
  );
}
