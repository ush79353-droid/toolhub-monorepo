import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BILLABLE_HOURS_FAQS } from './content';

export function BillableHoursGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-billable-hours-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Billable Hours Calculator links a billable rate, the time worked, and the resulting
        billable value. Enter any two fields and leave the third blank to solve for rate, time, or
        value. Independent currencies on the money fields use stored Phase 2 exchange rates.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For capacity-based target rates from salary, see the{' '}
        <Link
          href="/tools/bill-rate-calculator"
          className="font-medium text-primary hover:underline"
        >
          Bill Rate Calculator
        </Link>
        . For consulting day/hour pricing from costs and income targets, see the{' '}
        <Link
          href="/tools/consulting-fees-calculator"
          className="font-medium text-primary hover:underline"
        >
          Consulting Fees Calculator
        </Link>
        .
      </p>

      <h2
        id="billable-hours-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Billable Value = Billable Rate × Billable Time</p>
        <p>Billable Rate = Billable Value ÷ Billable Time</p>
        <p>Billable Time = Billable Value ÷ Billable Rate</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rate and time units are normalized with exact second/minute/hour conversions before the
        multiply or divide. Money is normalized into the rate currency; time units are never
        FX-converted.
      </p>

      <h2
        id="billable-hours-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Rate 500 PKR/hr × Time 40 hrs → Value 20,000 PKR</p>
        <p>Rate 500 PKR/hr × Time 30 mins → Value 250 PKR</p>
        <p>Solving for time with value 20,000 and rate 500/hr returns 40 hrs</p>
      </div>

      <h2
        id="billable-hours-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BILLABLE_HOURS_FAQS]} />
      </div>
    </article>
  );
}
