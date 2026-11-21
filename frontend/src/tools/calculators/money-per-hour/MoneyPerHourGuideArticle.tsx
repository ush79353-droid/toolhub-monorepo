import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MONEY_PER_HOUR_FAQS } from './content';

export function MoneyPerHourGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-money-per-hour-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Money per Hour Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A money per hour calculator turns one known pay period — annual salary,
        monthly, biweekly, weekly, or daily wage — into an equivalent hourly rate
        using your hours per week. Taxes, overtime, bonuses, and unpaid leave are
        not included.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm hours per week (default 40).</li>
        <li>
          Enter any one period wage under Input any of the following and choose
          its currency.
        </li>
        <li>
          Read Money per hour in the Answer section; other period fields update
          for reference when a result is available.
        </li>
        <li>
          Edit a different wage field to make it the new authoritative input.
        </li>
      </ol>

      <h2
        id="hourly-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Hourly Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual hours = Hours Per Week × 52</p>
        <p>Hourly = Annual ÷ Annual Hours</p>
        <p>Hourly = (Monthly × 12) ÷ Annual Hours</p>
        <p>Hourly = Weekly ÷ Hours Per Week</p>
        <p>Hourly = Biweekly ÷ 2 ÷ Hours Per Week</p>
        <p>Hourly = (Daily × 5) ÷ Hours Per Week</p>
        <p>Weekly = Hourly × Hours Per Week</p>
        <p>Annual = Weekly × 52</p>
        <p>Monthly = Annual ÷ 12</p>
        <p>Biweekly = Weekly × 2</p>
        <p>Daily = Weekly ÷ 5</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reverse conversions derive the canonical hourly rate from the
        authoritative field, then recalculate every other period. Amounts keep
        full precision and round only for display. Wages must be zero or greater;
        hours per week must be positive.
      </p>

      <h2
        id="working-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working-Week Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The year uses 52 paid weeks. Daily pay assumes a five-day working week
        (weekly ÷ 5). Hours per week are never FX-converted.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hours per week = 40</p>
        <p>Annual salary = 1,040,000 PKR (authoritative)</p>
        <p>Annual hours = 40 × 52 = 2,080</p>
        <p>Money per hour = 1,040,000 ÷ 2,080 = 500 PKR</p>
        <p>Weekly = 500 × 40 = 20,000 PKR</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67 PKR</p>
        <p>Biweekly = 20,000 × 2 = 40,000 PKR</p>
        <p>Daily = 20,000 ÷ 5 = 4,000 PKR</p>
      </div>

      <h2
        id="money-per-hour-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...MONEY_PER_HOUR_FAQS]} />
      </div>
    </article>
  );
}
