import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SALARY_INFLATION_FAQS } from './content';

export function SalaryInflationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-salary-inflation"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Salary Inflation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Salary inflation compares a reference-period paycheck to what that same
        pay would need to be after one period of price inflation, then checks
        whether your current salary kept up. Unlike multi-year compound
        projections (see the{' '}
        <Link
          href="/tools/future-salary-calculator"
          className="font-semibold text-primary underline underline-offset-2"
        >
          Future Salary Calculator
        </Link>
        ), this tool applies a single inflation rate for one period only.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Enter salary in the reference period and choose its currency.
        </li>
        <li>
          Enter the inflation rate for that single period (%). Zero and
          deflation above −100% are allowed.
        </li>
        <li>
          Read the inflation-adjusted salary, then enter your current salary.
          Gain or loss updates automatically.
        </li>
        <li>
          Change any money field&apos;s currency to convert with stored FX
          rates. Inflation % never converts. Try the Beat inflation or
          Purchasing-power loss examples for sample inputs.
        </li>
      </ol>

      <h2
        id="salary-inflation-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Salary Inflation Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Inflation-Adjusted Salary = Reference Salary × (1 + Inflation Rate /
          100)
        </p>
        <p>Gain or Loss = Current Salary − Inflation-Adjusted Salary</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reference and current salaries are normalized into one currency before
        comparison. Amounts keep full precision and round only for display.
        This tool does not compound over multiple years or invent tax
        adjustments.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Reference salary = 100,000 PKR · Inflation = 5%</p>
        <p>Adjusted = 100,000 × 1.05 = 105,000 PKR</p>
        <p>Current salary = 110,000 PKR</p>
        <p>Gain or loss = 110,000 − 105,000 = +5,000 PKR (beat inflation)</p>
      </div>

      <h2
        id="salary-inflation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SALARY_INFLATION_FAQS]} />
      </div>
    </article>
  );
}
