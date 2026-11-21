import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOURLY_TO_SALARY_WITH_OVERTIME_FAQS } from './content';

export function HourlyToSalaryWithOvertimeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-hourly-ot"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Hourly to Salary with Overtime?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert an hourly (or other period) wage into regular pay, overtime pay,
        and total salary. Defaults assume 40 hours per week. The overtime
        multiplier is user-defined and does not establish legal overtime
        eligibility. This catalog tool is separate from Salary Calculator With
        Overtime; both share the same core overtime math.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter regular pay and regular work time (default 40 hours/week).</li>
        <li>Set the overtime multiplier (default 1.5) and overtime hours.</li>
        <li>
          Read total regular pay, overtime rate, overtime pay, and combined
          total pay. Change currency selectors to convert money with stored FX
          rates; hours and the multiplier never convert.
        </li>
      </ol>

      <h2
        id="ot-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Overtime hourly rate</strong> = Regular hourly rate ×
          Multiplier
        </li>
        <li>
          <strong>Monthly regular pay</strong> = Regular hourly × Weekly hours ×
          52/12
        </li>
        <li>
          <strong>Monthly overtime pay</strong> = Overtime hourly × Monthly
          overtime hours
        </li>
        <li>
          <strong>Total pay</strong> = Regular pay + Overtime pay
        </li>
      </ul>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Regular pay 500 / hour · 40 hours / week · multiplier 1.5 · 20 overtime
        hours / month → weekly hours 40 → monthly regular hours ≈ 173.33 →
        regular ≈ 86,666.67 · OT rate 750 · OT pay 15,000 · total ≈ 101,666.67
        / month.
      </p>

      <h2
        id="ot-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...HOURLY_TO_SALARY_WITH_OVERTIME_FAQS]} />
      </div>
    </article>
  );
}
