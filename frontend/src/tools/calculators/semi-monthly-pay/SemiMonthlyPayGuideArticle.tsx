import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SEMI_MONTHLY_PAY_FAQS } from './content';

export function SemiMonthlyPayGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-semi-monthly-pay"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Semi-Monthly Pay?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Semi-monthly pay is compensation paid twice per month; 24 periods in a
        year. It is not the same as biweekly pay (every two weeks, 26 periods).
        Enter the one wage period you know; this calculator converts it to an
        equivalent semi-monthly amount and fills the other wage periods.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Enter hourly, daily, weekly, monthly, or yearly wage (last edited
          field is authoritative) and choose its currency.
        </li>
        <li>
          Confirm hours per week (default 40) and days per week (default 5)
          when relating hourly or daily wages.
        </li>
        <li>
          Read semi-monthly wage in the Answer section; change the result
          currency to re-express that amount.
        </li>
      </ol>

      <h2
        id="semi-monthly-pay-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Semi-Monthly Pay Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Weekly = Hourly × Hours/week  (or Daily × Days/week)</p>
        <p>Yearly = Weekly × 52</p>
        <p>Monthly = Yearly ÷ 12</p>
        <p>Semi-monthly = Yearly ÷ 24  (also Monthly ÷ 2)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Wages must be
        zero or greater; hours and days per week must be positive (days ≤ 7).
      </p>

      <h2
        id="working-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working Assumptions
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>52 paid weeks per year</li>
        <li>12 months per year</li>
        <li>24 semi-monthly periods (twice per month)</li>
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
        Hourly wage 500 with 40 hours/week → weekly 20,000 → yearly 1,040,000 →
        semi-monthly 1,040,000 ÷ 24 = 43,333.33. The same semi-monthly amount
        comes from monthly 86,666.67 (÷ 2).
      </p>

      <h2
        id="semi-monthly-pay-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...SEMI_MONTHLY_PAY_FAQS]} />
      </div>
    </article>
  );
}
