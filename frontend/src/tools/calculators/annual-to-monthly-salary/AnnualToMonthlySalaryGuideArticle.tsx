import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ANNUAL_TO_MONTHLY_SALARY_FAQS } from './content';

export function AnnualToMonthlySalaryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-annual-to-monthly"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Annual to Monthly Conversion?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual-to-monthly conversion turns a known yearly salary into equivalent monthly,
        weekly, daily, and hourly wages using your hours per week and standard week/year
        assumptions. Enter the annual amount you know; the other periods fill in.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your annual salary and choose its currency.</li>
        <li>Confirm hours per week (default 40).</li>
        <li>Read monthly, weekly, daily, and hourly wages; change a result currency to re-express that amount.</li>
      </ol>

      <h2
        id="wage-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wage Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly = Annual ÷ 12</p>
        <p>Weekly = Annual ÷ 52</p>
        <p>Daily = Annual ÷ (52 × 5)</p>
        <p>Hourly = Annual ÷ (52 × Hours Per Week)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Annual salary must be zero
        or greater; hours per week must be positive.
      </p>

      <h2
        id="working-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working-Week Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The year uses 52 paid weeks. Daily pay assumes a five-day working week
        (annual ÷ 260). Taxes, overtime, unpaid leave, and irregular schedules are not
        included.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual salary = 1,040,000 PKR</p>
        <p>Hours per week = 40</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67 PKR</p>
        <p>Weekly = 1,040,000 ÷ 52 = 20,000 PKR</p>
        <p>Daily = 1,040,000 ÷ 260 = 4,000 PKR</p>
        <p>Hourly = 1,040,000 ÷ (52 × 40) = 500 PKR</p>
      </div>

      <h2
        id="annual-to-monthly-salary-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ANNUAL_TO_MONTHLY_SALARY_FAQS]} />
      </div>
    </article>
  );
}
