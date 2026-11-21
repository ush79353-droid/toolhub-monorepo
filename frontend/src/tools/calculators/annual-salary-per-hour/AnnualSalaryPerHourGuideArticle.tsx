import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ANNUAL_SALARY_PER_HOUR_FAQS } from './content';

export function AnnualSalaryPerHourGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-salary-per-hour"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Salary per Hour Conversion?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Salary-per-hour conversion turns one known wage period into the others using your
 weekly hours. Enter hourly, daily, weekly, monthly, or annual pay, whichever you
 know, and the rest fill in from consistent week and year assumptions.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm hours per week (default 40).</li>
        <li>Enter any one wage amount and choose its currency.</li>
        <li>Read the other periods; change a field’s currency to re-express that amount.</li>
        <li>Edit a different wage field to make it the new authoritative input.</li>
      </ol>

      <h2
        id="wage-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wage Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Hours = Hours Per Week × 52</p>
        <p>Annual = Hourly × Annual Hours</p>
        <p>Weekly = Annual ÷ 52</p>
        <p>Monthly = Annual ÷ 12</p>
        <p>Daily = Weekly ÷ 5</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reverse conversions derive annual first from the authoritative field, then
        recalculate every other period. Amounts keep full precision and round only for
        display. Wages must be zero or greater; hours per week must be positive.
      </p>

      <h2
        id="working-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Working-Week Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The year uses 52 weeks. Daily pay assumes a five-day working week (weekly ÷ 5).
        Taxes, overtime, unpaid leave, and irregular schedules are not included.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hours per week = 40</p>
        <p>Hourly wage = 500 PKR (authoritative)</p>
        <p>Annual hours = 40 × 52 = 2,080</p>
        <p>Annual = 500 × 2,080 = 1,040,000 PKR</p>
        <p>Weekly = 1,040,000 ÷ 52 = 20,000 PKR</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67 PKR</p>
        <p>Daily = 20,000 ÷ 5 = 4,000 PKR</p>
      </div>

      <h2
        id="annual-salary-per-hour-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ANNUAL_SALARY_PER_HOUR_FAQS]} />
      </div>
    </article>
  );
}
