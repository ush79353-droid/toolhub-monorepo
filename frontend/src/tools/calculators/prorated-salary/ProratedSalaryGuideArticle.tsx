import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRORATED_SALARY_FAQS } from './content';

export function ProratedSalaryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-prorated-salary"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Prorated Salary?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prorated salary estimates pay for a partial month from your monthly (or
        normalized monthly) gross, the month’s scheduled working days, and the
        payable days you enter. This tool uses a civil calendar workweek model —
        it does not invent jurisdiction-specific payroll statutes beyond the
        explicit paid-holiday and paid-leave convention documented below.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose the year and month you are prorating.</li>
        <li>
          Enter gross salary with currency and pay period (day / week / month /
          year). Non-monthly amounts are normalized to a monthly figure first.
        </li>
        <li>
          Enter days worked, paid holidays, and approved leave as separate
          counts — do not list the same day in more than one field.
        </li>
        <li>
          Set days worked per week and pick distinct days off. The calculator
          counts eligible working days in that month from the real calendar.
        </li>
        <li>
          Read scheduled working days and prorated salary. Change the result
          currency to re-express the same amount.
        </li>
      </ol>

      <h2
        id="prorated-salary-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Proration Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Payable Days = Days Worked + Holidays + Approved Leave</p>
        <p>
          Scheduled Working Days = calendar days in month − selected days off
        </p>
        <p>
          Monthly Salary = normalize(gross, pay period) — month as-is; year ÷
          12; week × 52/12; day × scheduled working days
        </p>
        <p>
          Prorated Salary = Monthly Salary × Payable Days / Scheduled Working
          Days
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Holidays and approved leave are treated as paid/compensated. Zero
        scheduled working days blocks the result. Calculations keep full
        precision and round only for display.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>January 2025 · Five-day week · days off Sunday &amp; Saturday</p>
        <p>Scheduled working days = 23</p>
        <p>Days worked = 10 · Holidays = 1 · Approved leave = 1</p>
        <p>Payable days = 10 + 1 + 1 = 12</p>
        <p>Gross = 2,000 PKR / month</p>
        <p>Prorated = 2,000 × 12 / 23 ≈ 1,043.48 PKR</p>
      </div>

      <h2
        id="prorated-salary-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...PRORATED_SALARY_FAQS]} />
      </div>
    </article>
  );
}
