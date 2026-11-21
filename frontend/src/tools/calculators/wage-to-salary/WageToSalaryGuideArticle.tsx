import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WAGE_TO_SALARY_FAQS } from './content';

export function WageToSalaryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-wage-to-salary"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Wage to Salary Conversion?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Wage-to-salary conversion turns a known hourly, daily, or weekly wage into
        equivalent monthly and yearly salaries using your hours per week and days
        per week. Enter the one wage period you know; the calculator annualizes
        with 52 paid weeks.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Enter hourly, daily, or weekly wage (last edited field is authoritative)
          and choose its currency.
        </li>
        <li>Confirm hours per week (default 40) and days per week (default 5).</li>
        <li>
          Read monthly and yearly salary; change a result currency to re-express
          that amount.
        </li>
      </ol>

      <h2
        id="wage-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wage Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>From hourly: Weekly = Hourly × Hours Per Week</p>
        <p>From daily: Weekly = Daily × Days Per Week</p>
        <p>From weekly: Weekly = Entered Weekly Wage</p>
        <p>Yearly Salary = Weekly × 52</p>
        <p>Monthly Salary = Weekly × 52 ÷ 12</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Wages must be zero
        or greater; hours and days per week must be positive when used.
      </p>

      <h2
        id="working-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working-Week Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The year uses 52 paid weeks. Hours per week convert hourly wages; days per
        week convert daily wages. Taxes, overtime, bonuses, unpaid leave, and
        irregular schedules are not included.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hourly wage = 500 PKR · Hours/week = 40 · Days/week = 5</p>
        <p>Weekly = 500 × 40 = 20,000 PKR</p>
        <p>Yearly = 20,000 × 52 = 1,040,000 PKR</p>
        <p>Monthly = 20,000 × 52 ÷ 12 ≈ 86,666.67 PKR</p>
      </div>

      <h2
        id="wage-to-salary-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...WAGE_TO_SALARY_FAQS]} />
      </div>
    </article>
  );
}
