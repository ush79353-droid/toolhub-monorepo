import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WAGE_FAQS } from './content';

export function WageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-wage-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Wage Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A wage calculator turns one known pay rate into salary for other time
 frames using your hours per week. Enter hourly pay, or any other period
 amount, and see per-second through annual values under consistent week
        and year assumptions. Taxes, overtime, bonuses, and unpaid leave are not
        included.
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
        <li>
          Read the other periods under Salary for time frames; change a field&apos;s
          currency to re-express that amount.
        </li>
        <li>Edit a different wage field to make it the new authoritative input.</li>
      </ol>

      <h2
        id="wage-conversion-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wage Conversion Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Weekly = Hourly × Hours Per Week</p>
        <p>Annual = Weekly × 52</p>
        <p>Monthly = Annual ÷ 12</p>
        <p>Biweekly = Weekly × 2</p>
        <p>Daily = Weekly ÷ 5</p>
        <p>Per Minute = Hourly ÷ 60</p>
        <p>Per Second = Hourly ÷ 3600</p>
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
        <p>Hourly wage = 500 PKR (authoritative)</p>
        <p>Weekly = 500 × 40 = 20,000 PKR</p>
        <p>Annual = 20,000 × 52 = 1,040,000 PKR</p>
        <p>Monthly = 1,040,000 ÷ 12 ≈ 86,666.67 PKR</p>
        <p>Biweekly = 20,000 × 2 = 40,000 PKR</p>
        <p>Daily = 20,000 ÷ 5 = 4,000 PKR</p>
        <p>Per minute = 500 ÷ 60 ≈ 8.3333 PKR</p>
        <p>Per second = 500 ÷ 3600 ≈ 0.1389 PKR</p>
      </div>

      <h2
        id="wage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...WAGE_FAQS]} />
      </div>
    </article>
  );
}
