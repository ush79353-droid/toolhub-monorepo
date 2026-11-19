import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { YEARLY_WAGE_FAQS } from './content';

export function YearlyWageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-yearly-wage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Yearly Wage From Hourly?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yearly wage estimates annual gross pay from an hourly rate, weekly hours, and weeks worked
        in a year. This calculator also applies a simplified flat tax to show net hourly and net
        yearly figures. It does not model overtime, bonuses, or jurisdiction-specific payroll.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter working hours per week (default 40) and weeks per year (default 52, max 52).</li>
        <li>Enter hourly wage and choose its currency.</li>
        <li>Read yearly wage; change its currency to re-express the same gross amount.</li>
        <li>
          Open Net salary, set the flat tax percent (default 12%), and read net hourly and net
          yearly wages in their own currencies.
        </li>
      </ol>

      <h2
        id="yearly-wage-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wage Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Yearly Wage = Hourly Wage × Working Hours Per Week × Working Weeks Per Year</p>
        <p>Net Hourly Wage = Hourly Wage × (1 − Tax / 100)</p>
        <p>Net Yearly Wage = Yearly Wage × (1 − Tax / 100)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculations keep full precision and round only for display. Invalid or non-finite inputs
        produce no result.
      </p>

      <h2
        id="flat-tax-note"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Simplified Flat Tax
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tax is a single percentage (0–100%) applied evenly to hourly and yearly gross amounts. It
        is not a progressive bracket, payroll withholding schedule, or country-specific statutory
        deduction. Use it only as a quick estimate.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hourly wage = 500 · Hours/week = 40 · Weeks/year = 52 · Tax = 12%</p>
        <p>Yearly wage = 500 × 40 × 52 = 1,040,000</p>
        <p>Net hourly = 500 × (1 − 0.12) = 440</p>
        <p>Net yearly = 1,040,000 × (1 − 0.12) = 915,200</p>
      </div>

      <h2
        id="yearly-wage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...YEARLY_WAGE_FAQS]} />
      </div>
    </article>
  );
}
