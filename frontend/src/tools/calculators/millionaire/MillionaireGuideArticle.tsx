import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MILLIONAIRE_FAQS } from './content';
import {
  calculateMillionaireGoal,
  formatMoneyWithSymbol,
} from './calculation';

export function MillionaireGuideArticle() {
  const sample = calculateMillionaireGoal({
    targetAmount: 1_000_000,
    initialSavings: 20_000,
    annualInterestRatePercent: 4,
    compoundFrequency: 'monthly',
    additionalDeposit: 1_000,
    depositTiming: 'end',
    inflationRatePercent: 2,
    currency: 'USD',
  });
  const money = (v: number) => formatMoneyWithSymbol(v, 'USD');

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        A millionaire calculator estimates how long it may take to accumulate
 one million dollars (or any savings target) given your starting
        balance, periodic deposits, and assumed investment return. Compound
        interest can accelerate growth; consistent contributions matter just as
        much. Inflation then shows what that future balance may be worth in
        today&apos;s purchasing power. Enter your own assumptions to explore
        timelines; results are estimates, not guaranteed investment outcomes.
      </p>

      <h2
        id="saving-a-million"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Saving a million
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Setting a clear financial goal anchors a plan. Initial savings give you
        a head start; periodic deposits build principal; compound interest adds
        growth on both. Starting earlier usually shortens the path because more
 periods can compound. Discipline (keeping deposits consistent) often
        matters more than chasing a slightly higher assumed return. Money you
        contribute and interest you earn are different: contributions are what
        you put in; interest is what the balance earns over time.
      </p>

      <h2
        id="how-long-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How long to save a million? Formulas needed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With periodic compounding and end-of-period deposits:
      </p>
      <div className="my-4 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FV = PV(1+i)ⁿ + PMT × ((1+i)ⁿ − 1) / i</p>
        <p className="mt-2">i = r / m</p>
      </div>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>FV</strong>: future value of savings
        </li>
        <li>
 <strong>PV</strong>: initial savings
        </li>
        <li>
 <strong>PMT</strong>: periodic contribution
        </li>
        <li>
 <strong>i</strong>: interest rate per period
        </li>
        <li>
 <strong>n</strong>: number of periods
        </li>
        <li>
 <strong>r</strong>; annual nominal rate ·<strong>m</strong>: 
          periods per year
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Beginning-of-period deposits (annuity due) multiply the contribution
        term by (1+i):
      </p>
      <div className="my-4 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FV = PV(1+i)ⁿ + PMT × ((1+i)ⁿ − 1) / i × (1+i)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Deposit timing, compounding frequency, contribution size, and the
        assumed annual rate all change how quickly you reach the target. When
        i = 0, FV = PV + PMT × n.
      </p>

      <h2
        id="sample-calculation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sample calculation on how to save a million dollars
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assumptions: goal {money(1_000_000)}, initial {money(20_000)}, 4% annual
        interest, monthly compounding, {money(1_000)} end-of-month deposits,
        2% inflation.
      </p>
      {sample && sample.goalReachable ? (
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
          <li>
            Monthly rate i = 0.04 / 12 ≈ {(0.04 / 12).toFixed(6)}.
          </li>
          <li>
            Solve for periods until balance ≥ {money(1_000_000)} → about{' '}
            {sample.totalPeriods} months ({sample.durationLabel}).
          </li>
          <li>
            Total contributions ≈ {money(sample.totalContributions)}.
          </li>
          <li>Interest earned ≈ {money(sample.totalInterest)}.</li>
          <li>Final savings ≈ {money(sample.finalSavings)}.</li>
          <li>
            Inflation-adjusted purchasing power ≈{' '}
            {money(sample.inflationAdjustedValue)}.
          </li>
        </ol>
      ) : (
        <p className="mt-3 text-sm text-rose-700">
          Sample calculation unavailable with current engine defaults.
        </p>
      )}

      <h2
        id="using-calculator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Using our millionaire calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Enter your financial goal</strong>: the amount you want to
          accumulate.
        </li>
        <li>
 <strong>Enter initial savings</strong>: money already saved.
        </li>
        <li>
 <strong>Enter annual interest rate</strong>: your estimated annual
          return.
        </li>
        <li>
 <strong>Select compounding frequency</strong>: how often interest
          compounds (deposits apply once per period).
        </li>
        <li>
 <strong>Enter additional deposits</strong>: contribution per period.
        </li>
        <li>
 <strong>Select deposit timing</strong>: beginning or end of each
          period.
        </li>
        <li>
 <strong>Review the estimated duration</strong>: years, months, and
          totals.
        </li>
        <li>
 <strong>Review inflation impact</strong>: purchasing power in
          today&apos;s dollars.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results depend on the assumptions you enter and are not guaranteed
        investment returns.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore related tools when available in the catalog, such as{' '}
        <Link
          href="/tools/savings-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Savings Calculator
        </Link>
        ,{' '}
        <Link
          href="/tools/compound-interest-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Compound Interest Calculator
        </Link>
        ,{' '}
        <Link
          href="/tools/emergency-fund-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Emergency Fund Calculator
        </Link>
        , and{' '}
        <Link
          href="/tools/fire-calculator-financial-independence-retire-early"
          className="text-primary underline-offset-2 hover:underline"
        >
          FIRE Calculator
        </Link>
        .
      </p>

      <h2
        id="millionaire-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...MILLIONAIRE_FAQS]} />
      </div>
    </article>
  );
}
