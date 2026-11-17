import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ILLINOIS_OVERTIME_FAQS } from './content';

export function IllinoisOvertimeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-illinois-overtime"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate regular monthly pay, overtime pay at a chosen multiplier (default 1.5×), and
        combined monthly total from a regular rate, regular work schedule, and overtime hours.
        Currency selectors use real FX; time units convert durations only.
      </p>

      <h2
        id="illinois-overtime-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Regular Monthly Pay = Hourly Rate × Weekly Hours × 52/12</p>
        <p>Overtime Hourly Rate = Hourly Rate × Overtime Multiplier</p>
        <p>Monthly Overtime Pay = Overtime Hourly Rate × Monthly Overtime Hours</p>
        <p>Total Monthly Pay = Regular Monthly Pay + Monthly Overtime Pay</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Regular pay = PKR 20 / hour · Regular work time = 40 hours / week</p>
        <p>Monthly regular = 20 × 40 × 52/12 = PKR 3,466.67</p>
        <p>Multiplier 1.5 → overtime rate = PKR 30 / hour</p>
        <p>10 overtime hours / month → overtime pay = PKR 300.00</p>
        <p>Total pay = 3,466.67 + 300.00 = PKR 3,766.67 / month</p>
      </div>

      <h2
        id="legal-limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Legal Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illinois overtime and FLSA rules can depend on weekly hours thresholds, exemptions, and
        other eligibility factors. This calculator does not verify those conditions and does not
        claim statutory compliance from monthly or weekly hours alone. It is an illustrative pay
        estimate, not legal advice.
      </p>

      <h2
        id="illinois-overtime-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ILLINOIS_OVERTIME_FAQS]} />
      </div>
    </article>
  );
}
