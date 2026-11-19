import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOURLY_WAGE_FAQS } from './content';

export function HourlyWageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-hourly-wage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Hourly Wage Converter?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An hourly wage converter turns a pay rate per hour into equivalent amounts for
        shorter and longer time frames. This calculator uses a simple schedule:
        <strong> 5 working days per week</strong> and <strong>52 paid weeks per year</strong>.
        It does not invent overtime premiums, taxes, bonuses, or unpaid time off.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the hourly wage and choose its currency.</li>
        <li>Confirm hours per week (default 40). Hours are never currency-converted.</li>
        <li>
          Read per-second through annual results. Change any result currency to
          re-express the same amount without changing hours.
        </li>
      </ol>

      <h2
        id="hourly-wage-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wage Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Per second = H / 3600</p>
        <p>Per minute = H / 60</p>
        <p>Daily wage = H × W / 5</p>
        <p>Weekly wage = H × W</p>
        <p>Biweekly wage = H × W × 2</p>
        <p>Monthly wage = H × W × 52 / 12</p>
        <p>Annual salary = H × W × 52</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        H is hourly wage and W is hours per week. Hourly wage may be zero. Hours per
        week must be greater than zero. Calculations keep full precision and round only
        for display.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        H = 500 · W = 40. Per minute ≈ 8.3333; daily = 4,000; weekly = 20,000;
        biweekly = 40,000; monthly ≈ 86,666.67; annual = 1,040,000.
      </p>

      <h2
        id="hourly-wage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...HOURLY_WAGE_FAQS]} />
      </div>
    </article>
  );
}
