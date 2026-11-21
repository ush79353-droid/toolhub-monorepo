import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LONG_TERM_CARE_FAQS } from './content';

export function LongTermCareGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Long-term care covers ongoing help with daily activities over an extended period. Costs can
        rise with healthcare inflation, so projecting daily or monthly rates into multi-year totals
        helps families plan. This calculator normalizes your rate to an annual baseline, then applies
        inflation year by year.
      </p>

      <h2
        id="what-is-ltc"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is long-term care?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Long-term care is assistance for people who need help with everyday activities over time; 
        distinct from short-term medical treatment. Services can include nursing home care,
        transportation, shopping help, meal preparation, medication management, adult day care, and
        assisted living. Needs vary with health, age, and personal circumstances.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use our long-term care cost calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose per day or per month.</li>
        <li>Enter the current care cost for that frequency.</li>
        <li>
 Review or edit cost of present year: the annual baseline (daily×365 or monthly×12). It is
          not a second expense added on top of the rate.
        </li>
        <li>Enter the number of years to project.</li>
        <li>Enter the expected annual inflation rate.</li>
        <li>Review the total and the annual projection table.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Healthcare inflation can raise care expenses substantially. Estimating future costs helps
        families prepare more effectively.
      </p>

      <h2
        id="ltc-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Would you like to know the formula used to calculate long-term care?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Daily: P = D × 365 · Monthly: P = M × 12</p>
        <p className="mt-2">Cₙ = P(1+i)ⁿ (n = completed inflation steps; year 1 uses n = 0)</p>
        <p className="mt-2">TC = P × ((1+i)ᴺ − 1) / i · If i = 0: TC = P × N</p>
      </div>

      <h2
        id="formula-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How our calculator uses the formula to calculate the cost of long-term care
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $7,500 per month, 4% inflation, 5 years.
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>P = 7,500 × 12 = $90,000.</li>
        <li>
          Annual costs: $90,000; $93,600; $97,344; $101,237.76; $105,287.27.
        </li>
        <li>Total ≈ $487,469.03.</li>
      </ol>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/emergency-fund-calculator" className="text-primary hover:underline">
            Emergency Fund Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fire-calculator-financial-independence-retire-early"
            className="text-primary hover:underline"
          >
            FIRE Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/salary-inflation-calculator" className="text-primary hover:underline">
            Salary Inflation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="ltc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...LONG_TERM_CARE_FAQS]} />
      </div>
    </article>
  );
}
