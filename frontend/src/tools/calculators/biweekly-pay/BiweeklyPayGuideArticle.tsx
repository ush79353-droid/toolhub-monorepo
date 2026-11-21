import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BIWEEKLY_PAY_FAQS } from './content';

export function BiweeklyPayGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-biweekly-pay"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Biweekly Pay?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Biweekly pay is compensation paid every two weeks; 26 periods in a
        52-week year. It is not the same as semi-monthly pay (twice per month,
        24 periods). Enter the one wage period you know; this calculator
        converts it to an equivalent biweekly amount.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Enter annual, monthly, weekly, daily, or hourly wage (last edited
          field is authoritative) and choose its currency.
        </li>
        <li>
          Confirm hours per week (default 40) and days per week (default 5)
          when using hourly or daily wages.
        </li>
        <li>
          Read biweekly wage in the Answer section; change the result currency
          to re-express that amount.
        </li>
      </ol>

      <h2
        id="biweekly-pay-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Biweekly Pay Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>From annual: Biweekly = Annual Salary ÷ 26</p>
        <p>From monthly: Biweekly = Monthly Wage × 12 ÷ 26</p>
        <p>From weekly: Biweekly = Weekly Wage × 2</p>
        <p>From daily: Biweekly = Daily Wage × Days Per Week × 2</p>
        <p>From hourly: Biweekly = Hourly Wage × Hours Per Week × 2</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Wages must be
        zero or greater; hours and days per week must be positive.
      </p>

      <h2
        id="working-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Assumptions
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>52 paid weeks per year</li>
        <li>26 biweekly periods (every 14 days)</li>
        <li>Default schedule: 40 hours/week and 5 days/week</li>
        <li>No taxes, overtime, or deductions are modeled</li>
      </ul>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hourly wage 500 with 40 hours/week → biweekly = 500 × 40 × 2 = 40,000.
        The same biweekly amount comes from weekly 20,000 (×2), daily 4,000 at
        5 days/week (×5×2), or annual 1,040,000 (÷26).
      </p>

      <h2
        id="biweekly-pay-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BIWEEKLY_PAY_FAQS]} />
      </div>
    </article>
  );
}
