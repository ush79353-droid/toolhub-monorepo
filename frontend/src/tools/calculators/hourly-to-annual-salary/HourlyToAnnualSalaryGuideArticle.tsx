import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOURLY_TO_ANNUAL_SALARY_FAQS } from './content';

export function HourlyToAnnualSalaryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-hourly-to-annual"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Hourly to Annual Conversion?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hourly-to-annual conversion turns a known hourly wage into equivalent weekly,
        monthly, daily, and annual salaries using your hours per week and days per
        week. Enter the hourly rate you know; the other periods fill in from a
        52-week year.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your hourly wage and choose its currency.</li>
        <li>Confirm hours per week (default 40) and days per week (default 5).</li>
        <li>
          Read annual, monthly, weekly, and daily pay; change a result currency to
          re-express that amount.
        </li>
      </ol>

      <h2
        id="salary-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Salary Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Weekly = Hourly × Hours Per Week</p>
        <p>Annual = Weekly × 52</p>
        <p>Monthly = Annual ÷ 12</p>
        <p>Per Day = Weekly ÷ Days Per Week</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Hourly wage must be
        zero or greater; hours and days per week must be positive.
      </p>

      <h2
        id="working-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working-Week Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The year uses 52 paid weeks. Daily pay uses your days-per-week input
        (default 5). Taxes, overtime, unpaid leave, and irregular schedules are not
        included.
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
        <p>Annual = 20,000 × 52 = 1,040,000 PKR</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67 PKR</p>
        <p>Per day = 20,000 ÷ 5 = 4,000 PKR</p>
      </div>

      <h2
        id="hourly-to-annual-salary-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOURLY_TO_ANNUAL_SALARY_FAQS]} />
      </div>
    </article>
  );
}
