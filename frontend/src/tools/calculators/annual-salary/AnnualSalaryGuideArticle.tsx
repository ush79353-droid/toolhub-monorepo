import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ANNUAL_SALARY_FAQS } from './content';

export function AnnualSalaryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-annual-salary"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Annual Salary From Hourly?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual salary from an hourly wage is the product of that wage, the hours you work
        each week, and the weeks you work each year. This calculator also estimates net
        hourly and net annual pay after a single flat tax percent you enter — not brackets,
        withholdings, or country-specific payroll rules.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm working hours per week (default 40) and weeks per year (default 52).</li>
        <li>Enter your hourly wage and choose its currency.</li>
        <li>Read the calculated annual salary; change its currency to re-express the same amount.</li>
        <li>
          In Net salary, set the flat tax percent (default 12%). Read net hourly and net annual
          with their own currencies.
        </li>
      </ol>

      <h2
        id="annual-salary-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Salary Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Salary = Hourly Wage × Hours Per Week × Weeks Per Year</p>
        <p>Net Hourly Wage = Hourly Wage × (1 − Tax / 100)</p>
        <p>Net Annual Salary = Annual Salary × (1 − Tax / 100)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculations keep full precision and round only for display. Invalid or non-finite
        inputs produce no result. Hours, weeks, and wages must be zero or greater; tax must
        be between 0% and 100%.
      </p>

      <h2
        id="flat-tax-note"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Simplified Flat Tax
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The tax field is a simplified flat-rate deduction for quick estimates. It is not a
        substitute for income-tax brackets, social contributions, benefits, or employer
        withholdings in any jurisdiction.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hourly wage = 500 PKR</p>
        <p>Hours per week = 40 · Weeks per year = 52</p>
        <p>Annual salary = 500 × 40 × 52 = 1,040,000 PKR</p>
        <p>Tax = 12%</p>
        <p>Net hourly = 500 × (1 − 0.12) = 440 PKR</p>
        <p>Net annual = 1,040,000 × (1 − 0.12) = 915,200 PKR</p>
      </div>

      <h2
        id="annual-salary-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ANNUAL_SALARY_FAQS]} />
      </div>
    </article>
  );
}
