import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOURLY_TO_SALARY_WAGE_FAQS } from './content';

export function HourlyToSalaryWageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-hourly-to-salary"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Hourly to Salary Conversion?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hourly-to-salary conversion turns a known hourly wage into an equivalent
        annual salary (or the reverse) using hours per week and a 52-week year.
        Once that pair is set, daily, weekly, biweekly, and monthly pay follow
        from the same assumptions.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter hourly wage or annual salary and choose its currency.</li>
        <li>Confirm hours per week (default 40).</li>
        <li>
          Read the synced hourly/annual pair and the “Your wage as” breakdown;
          change a result currency to re-express that amount.
        </li>
      </ol>

      <h2
        id="wage-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wage Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual = Hourly × Hours Per Week × 52</p>
        <p>Hourly = Annual ÷ (Hours Per Week × 52)</p>
        <p>Weekly = Hourly × Hours Per Week</p>
        <p>Biweekly = Weekly × 2</p>
        <p>Monthly = Annual ÷ 12</p>
        <p>Daily = Weekly ÷ 5</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Wages must be
        zero or greater; hours per week must be positive.
      </p>

      <h2
        id="working-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working-Week Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The year uses 52 paid weeks. Daily pay assumes five working days per week
        (weekly ÷ 5). Taxes, overtime, unpaid leave, and irregular schedules are
        not included.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hourly wage = 500 PKR · Hours/week = 40</p>
        <p>Weekly = 500 × 40 = 20,000 PKR</p>
        <p>Annual = 500 × 40 × 52 = 1,040,000 PKR</p>
        <p>Biweekly = 20,000 × 2 = 40,000 PKR</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67 PKR</p>
        <p>Daily = 20,000 ÷ 5 = 4,000 PKR</p>
      </div>

      <h2
        id="hourly-to-salary-wage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOURLY_TO_SALARY_WAGE_FAQS]} />
      </div>
    </article>
  );
}
