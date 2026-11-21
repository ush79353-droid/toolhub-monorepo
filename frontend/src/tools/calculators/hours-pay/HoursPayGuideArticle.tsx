import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOURS_PAY_FAQS } from './content';

export function HoursPayGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-hours-pay"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Hours Pay Conversion?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hours-pay conversion turns a known daily, weekly, monthly, or annual pay
        amount into the other periods and an equivalent hourly wage. Enter the
        one pay period you know; working hours (hours/day, days/week, weeks/year)
        complete the conversion.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Enter daily, weekly, monthly, or annual pay (last edited field is
          authoritative) and choose its currency.
        </li>
        <li>
 Expand Working hours if needed; defaults are 8 hours/day, 5 days/week,
          and 52 weeks/year.
        </li>
        <li>
          Read the hourly wage result; change its currency to re-express that
          amount.
        </li>
      </ol>

      <h2
        id="pay-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pay Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>H = hours/day · D = days/week · W = weeks/year</p>
        <p>From daily: Weekly = Daily × D · Annual = Daily × D × W · Hourly = Daily ÷ H</p>
        <p>From weekly: Daily = Weekly ÷ D · Annual = Weekly × W · Hourly = Weekly ÷ (H × D)</p>
        <p>From monthly: Annual = Monthly × 12 · Weekly = Annual ÷ W · Hourly = Annual ÷ (H × D × W)</p>
        <p>From annual: Monthly = Annual ÷ 12 · Weekly = Annual ÷ W · Hourly = Annual ÷ (H × D × W)</p>
        <p>Monthly = Annual ÷ 12 (when derived from daily/weekly)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Pay must be zero
        or greater; hours/day, days/week, and weeks/year must be positive.
      </p>

      <h2
        id="working-hours-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working-Hours Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Defaults are 8 hours per day, 5 days per week, and 52 paid weeks per
        year. Taxes, overtime, bonuses, unpaid leave, and irregular schedules are
        not included. This is a time-based conversion, not a statutory payroll
        estimate.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Daily pay = 4,000 PKR · 8 hours/day · 5 days/week · 52 weeks/year</p>
        <p>Weekly = 4,000 × 5 = 20,000 PKR</p>
        <p>Annual = 4,000 × 5 × 52 = 1,040,000 PKR</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67 PKR</p>
        <p>Hourly = 4,000 ÷ 8 = 500 PKR</p>
      </div>

      <h2
        id="hours-pay-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOURS_PAY_FAQS]} />
      </div>
    </article>
  );
}
