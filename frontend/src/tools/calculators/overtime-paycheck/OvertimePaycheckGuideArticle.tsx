import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OVERTIME_FAQS } from './content';

export function OvertimePaycheckGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-overtime-pay"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Overtime Pay?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Overtime is work beyond regular scheduled hours. Many workplaces pay a premium; 
 often time-and-a-half (1.5×), for those extra hours. This calculator estimates
        regular pay, overtime pay, and combined total pay from your rate, schedule, and
        overtime hours.
      </p>

      <h2
        id="overtime-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Overtime Pay Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Overtime hourly rate = Regular hourly rate × Multiplier</p>
        <p className="mt-2">
          Regular monthly pay = Hourly rate × Weekly hours × 52/12
        </p>
        <p className="mt-2">
          Overtime monthly pay = Overtime hourly rate × Monthly overtime hours
        </p>
        <p className="mt-2">
          Total monthly pay = Regular monthly pay + Overtime monthly pay
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Regular pay = 500 PKR/hour · Regular work = 40 hours/week · Multiplier = 1.5</p>
        <p>Overtime = 20 hours/month</p>
        <p>Overtime rate = 500 × 1.5 = 750 PKR/hour</p>
        <p>Regular monthly = 500 × 40 × 52/12 ≈ 86,666.67</p>
        <p>Overtime monthly = 750 × 20 = 15,000</p>
        <p>Total monthly ≈ 101,666.67</p>
      </div>

      <h2
        id="overtime-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...OVERTIME_FAQS]} />
      </div>
    </article>
  );
}
