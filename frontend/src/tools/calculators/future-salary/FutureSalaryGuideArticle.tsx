import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FUTURE_SALARY_FAQS } from './content';

export function FutureSalaryGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-future-salary"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Future Salary?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Future salary estimates how today’s pay compounds if it grows (or shrinks)
        at a steady annual rate. Real future salary then strips out inflation so
 you can compare purchasing power in today’s terms; not just the nominal
        paycheck figure years from now.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Enter current salary, average salary change per year (%), and number of
          years. Read expected (nominal) future salary.
        </li>
        <li>
          Enter average inflation (%) to see real future salary in today’s
          purchasing power.
        </li>
        <li>
          Change a money field&apos;s currency to convert that amount with stored
          FX rates. Growth, inflation, and years never convert. Try the Career
          growth or Inflation check examples to load sample inputs.
        </li>
      </ol>

      <h2
        id="future-salary-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Future Salary Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Future Salary = Current Salary × (1 + Growth Rate / 100)^Years</p>
        <p>
          Real Future Salary = Future Salary ÷ (1 + Inflation Rate / 100)^Years
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Growth and inflation may be zero or negative (above −100%). Years must
        be nonnegative. Amounts keep full precision and round only for display.
        This tool does not model taxes, promotions, or bonuses.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Current salary = 100,000 PKR · Growth = 5%/yr · Years = 10</p>
        <p>
          Future = 100,000 × (1.05)^10 ≈ 162,889.46 PKR
        </p>
        <p>Inflation = 2%/yr</p>
        <p>
          Real = 162,889.46 ÷ (1.02)^10 ≈ 133,598.45 PKR (today&apos;s purchasing
          power)
        </p>
      </div>

      <h2
        id="future-salary-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FUTURE_SALARY_FAQS]} />
      </div>
    </article>
  );
}
