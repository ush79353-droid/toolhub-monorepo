import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LABOR_COST_FAQS } from './content';

export function LaborCostGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-labor-cost"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Labor Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Labor cost is more than wages. It includes paid time off and additional employer costs such as
        taxes, insurance, benefits, overtime, and supplies, then expresses the total as an annual and
        hourly cost.
      </p>

      <h2
        id="labor-cost-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross Hours/Year = Weekly Hours × 52</p>
        <p>Gross Pay = Gross Hours/Year × Hourly Pay Rate</p>
        <p>Hours Not Worked = Absent Days × (Weekly Hours / 5)</p>
        <p>Net Hours Worked = Gross Hours/Year − Hours Not Worked</p>
        <p>Annual Payroll Labor Cost = Gross Pay + Additional Annual Employment Costs</p>
        <p>Hourly Labor Cost = Annual Payroll Labor Cost / Net Hours Worked</p>
        <p>Labor Cost Percentage = (Annual Payroll Labor Cost / Revenue) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Weekly hours = 40 → gross hours/year = 2,080</p>
        <p>Pay rate = PKR 10 → gross pay = PKR 20,800</p>
        <p>Absent days = 15 → hours not worked = 120 → net hours = 1,960</p>
        <p>Additional costs = PKR 3,900 → annual labor cost = PKR 24,700</p>
        <p>Hourly labor cost = 24,700 / 1,960 = PKR 12.60</p>
      </div>

      <h2 id="labor-cost-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LABOR_COST_FAQS]} />
      </div>
    </article>
  );
}
