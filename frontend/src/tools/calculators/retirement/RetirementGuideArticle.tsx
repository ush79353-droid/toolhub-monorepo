import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  LONGEVITY_SOURCE,
  US_AVG_RETIRED_WORKER_BENEFIT_MONTHLY,
  US_PENSION_SOURCE,
} from './longevity-defaults';
import { RETIREMENT_FAQS } from './content';

export function RetirementGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Retirement Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate how ongoing savings and an existing nest egg grow to retirement,
        how much level income those savings can support through life expectancy
        while returns continue, and whether that income plus a government pension
        covers your cost of living. Results are educational — not financial advice.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What It Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The tool reports projected savings at retirement, sustainable income from
        savings, total retirement income (pension + draw), budget coverage
        percentage, and money left (surplus or shortfall). All money figures are
        nominal — not inflation-adjusted.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas and Timing
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>n = max(0, retirementAge − currentAge)</p>
        <p>W = lifeExpectancy − max(currentAge, retirementAge)</p>
        <p>FV_lump = P0 × (1+r)<sup>n</sup></p>
        <p>FV_annuity = C × ((1+r)<sup>n</sup> − 1) / r &nbsp;(r = 0 → C×n)</p>
        <p>Nest egg = FV_lump + FV_annuity</p>
        <p>PMT = NestEgg × r / (1 − (1+r)<sup>−W</sup>) &nbsp;(r = 0 → NestEgg/W)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ongoing savings and pension/cost-of-living inputs can be entered monthly
        or yearly; the engine converts them to annual amounts. Display period
        switches only change how income results are shown.
      </p>

      <h2
        id="defaults"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Life Expectancy and Pension Defaults
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sex and country only seed suggestions. Life expectancy defaults follow{' '}
        {LONGEVITY_SOURCE} For the United States, government pension defaults to
        about ${US_AVG_RETIRED_WORKER_BENEFIT_MONTHLY.toLocaleString('en-US')} per
        month ({US_PENSION_SOURCE}). Other countries start at 0 so you can enter a
        jurisdiction-specific benefit.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm sex, ages, and country (or override life expectancy).</li>
        <li>Enter ongoing savings, amount already saved, and expected return.</li>
        <li>Set government pension and cost of living with matching periods.</li>
        <li>
          Read total savings, income from savings, budget coverage, and money left.
        </li>
      </ol>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Annual compounding and end-of-year contribution timing.</li>
        <li>Constant expected return before and after retirement.</li>
        <li>No taxes, fees, healthcare shocks, or sequence-of-returns stress tests.</li>
        <li>Currency changes formatting only — no FX conversion.</li>
      </ul>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age 40, retire at 67, life expectancy 81.4, already saved $50,000, save
        $500/month, 7% return, US average Social Security default, and $4,000/month
        cost of living. The engine grows the nest egg for 27 years, then amortizes
        withdrawals over about 14.4 years with continued 7% returns, and compares
        total income to living costs.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/early-retirement-calculator">Early Retirement Calculator</Link>
        </li>
        <li>
          <Link href="/tools/ira-calculator">IRA Calculator</Link>
        </li>
        <li>
          <Link href="/tools/pension-calculator">Pension Calculator</Link>
        </li>
        <li>
          <Link href="/tools/rmd-calculator-required-minimum-distributions-calculator">
            RMD Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="retirement-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...RETIREMENT_FAQS]} />
      </div>
    </article>
  );
}
