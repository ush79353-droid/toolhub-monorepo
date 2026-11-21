import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SELLING_LEAVE_DAYS_FAQS } from './content';

export function SellingLeaveDaysGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-leave-encashment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Selling Leave Days?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Selling leave days (leave encashment) converts unused paid time off into
        a cash estimate. This calculator multiplies a working-day daily rate by
        the leave days you choose to sell. It is an educational estimate — not a
        guarantee of employer policy or statutory entitlement.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select how your salary is paid (default Monthly).</li>
        <li>Enter base pay and choose its currency.</li>
        <li>Enter leave days to sell.</li>
        <li>Read the payout; change the result currency if needed.</li>
      </ol>

      <h2
        id="leave-payout-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Leave Payout Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual: Daily = Annual ÷ 260</p>
        <p>Monthly: Daily = (Monthly × 12) ÷ 260</p>
        <p>Weekly: Daily = Weekly ÷ 5</p>
        <p>Hourly: Daily = Hourly × 8</p>
        <p>Payout = Daily × Leave Days</p>
      </div>

      <h2
        id="working-day-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working-Day Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The estimate uses 52 paid weeks × 5 working days = 260 working days per
        year and 8 paid hours per working day. It does not use a 30-calendar-day
        month divisor and does not deduct tax.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly base pay = 60,000 PKR · Leave days = 5</p>
        <p>Annual = 60,000 × 12 = 720,000</p>
        <p>Daily = 720,000 ÷ 260 ≈ 2,769.230769</p>
        <p>Payout ≈ 13,846.15 PKR</p>
      </div>

      <h2
        id="selling-leave-days-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SELLING_LEAVE_DAYS_FAQS]} />
      </div>
    </article>
  );
}
