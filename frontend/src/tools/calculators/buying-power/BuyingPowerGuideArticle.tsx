import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BUYING_POWER_FAQS } from './content';
import {
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
} from './us-cpi-u-annual';

export function BuyingPowerGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Buying Power Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Buying power is what a sum of money can purchase. Over time, inflation and
        deflation change the general level of consumer prices, so the same
        nominal dollar amount can buy a different basket of groceries, rent,
        transportation, and household goods in different years. This calculator
        measures that change with historical US Consumer Price Index (CPI) data
        from the {US_CPI_SOURCE_NAME}, translating an amount from a reference
        year into an equivalent amount in a target year.
      </p>

      <h2
        id="time-affects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Time Affects the Buying Power of Money
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When consumer prices rise (inflation), each dollar usually stretches less
        far. When prices fall (deflation), each dollar can stretch further. The
        nominal face value printed on a bill does not change; the real value —
        purchasing power — does. Equal nominal amounts in two years therefore need
        not represent equal living standards. CPI summarizes a broad statistical
        basket; it is not every household&apos;s exact shopping list.
      </p>

      <h2
        id="what-is-pp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Purchasing Power?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Purchasing power links money to goods and services. It depends on the
        price level: higher prices reduce the purchasing power of a fixed nominal
        balance; lower prices increase it. Domestic purchasing power is not the
        same as a currency&apos;s foreign-exchange rate, which compares currencies
        across countries rather than price levels across time in one currency.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the Buying Power Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter an amount, choose the reference year (when that amount had its
        stated purchasing power), and choose a target year. The tool looks up
        annual-average CPI-U values and applies:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Adjusted Amount = Original Amount × (CPI_target / CPI_reference)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The dollar value output is the inflation-adjusted equivalent. Cumulative
        inflation and the inverse purchasing-power change of one nominal unit are
        shown in the details panel. Series: {US_CPI_SERIES_ID} (
        {US_CPI_MIN_YEAR}–{US_CPI_MAX_YEAR}).
      </p>

      <h2
        id="step-by-step"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Buying Power Step by Step
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The following uses an <strong>illustrative</strong> CPI pair for teaching
        only — not verified official BLS values for those years.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Amount $1,000 · Reference CPI 220 · Target CPI 260</p>
        <p>Ratio = 260 / 220 ≈ 1.181818</p>
        <p>Adjusted = 1,000 × 1.181818 ≈ $1,181.82</p>
        <p>Cumulative inflation ≈ 18.18%</p>
      </div>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Divide target CPI by reference CPI to get the ratio.</li>
        <li>Multiply the original amount by that ratio.</li>
        <li>Convert (ratio − 1) × 100 for cumulative inflation.</li>
        <li>
          Interpret the result as a general basket comparison, not a personal
          inflation experience.
        </li>
      </ol>

      <h2
        id="what-is-cpi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Consumer Price Index?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPI is an index number, not a currency amount. It tracks average price
        change for a representative consumer basket. Annual-average CPI averages
        monthly observations for a calendar year. BLS collects prices across
        categories and geographies; indexes can be revised, and no single series
        captures every household or region perfectly. This calculator uses
        annual-average CPI-U (not seasonally adjusted) consistently across years.
      </p>

      <h2
        id="inflation-vs-pp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation vs. Purchasing Power
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cumulative inflation measures how much the price index rose or fell.
        Purchasing-power change for one nominal currency unit uses the inverse
        CPI ratio and is not the same percentage with the opposite sign when the
        change is large. Example with the illustrative 220→260 case: inflation ≈
        +18.18%, while one nominal dollar&apos;s purchasing power changes by ≈
        −15.38%.
      </p>

      <h2
        id="nominal-vs-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nominal Money vs. Real Money
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal income is the paycheck number. Real income adjusts for price
        levels. A salary that rises from $50,000 to $55,000 (+10%) while prices
        rise 15% leaves the worker worse off in real terms. The same logic applies
        to savings balances and historical price comparisons: convert with CPI
        before judging living-standard change.
      </p>

      <h2
        id="compare-years"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Compare Money Across Different Years
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select the reference year for the original amount.</li>
        <li>Enter the amount in that year&apos;s dollars.</li>
        <li>Select the target year for the comparison.</li>
        <li>Confirm both years exist in the CPI dataset.</li>
        <li>Compute the CPI ratio and adjusted amount.</li>
        <li>Read inflation and purchasing-power change carefully.</li>
        <li>Remember the result is an index-based estimate.</li>
      </ol>

      <h2
        id="economy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Purchasing Power and the Economy
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation interacts with monetary policy, interest rates, wage growth,
        household budgets, and retirement planning. CPI alone does not explain
        every economic outcome — productivity, asset prices, and fiscal policy
        also matter — but price-level comparisons remain a core tool for
        long-horizon financial questions.
      </p>

      <h2
        id="causes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Causes Purchasing Power to Change?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Contributors can include supply and demand shifts, monetary conditions,
        production and energy costs, supply-chain disruptions, fiscal settings,
        productivity, import prices, and competition. These are possible factors,
        not universal explanations for every CPI movement.
      </p>

      <h2
        id="savings"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Inflation Affects Savings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash held with zero interest while consumer prices rise keeps its nominal
        balance but loses real purchasing power. Interest or investment returns
        may offset some of that loss; the net real return depends on whether
        earnings outpace inflation.
      </p>

      <h2
        id="vs-inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Buying Power vs. Inflation Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A buying power calculator translates an amount between two price levels.
        An inflation calculator often focuses on the percentage change in the
        index itself. Both can share the same CPI foundation; this page emphasizes
        the adjusted dollar equivalent and clearly separates inflation % from
        purchasing-power %.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Buying Power Calculations
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>CPI is an average; spending patterns differ by household.</li>
        <li>Regional inflation can diverge from the national index.</li>
        <li>Goods change in quality over long spans.</li>
        <li>Historical measurement methods have limitations.</li>
        <li>Different CPI series produce different results.</li>
        <li>Index values may be revised after first publication.</li>
        <li>Future years require assumptions; this tool does not invent them.</li>
        <li>Exchange rates and specific asset prices are not captured.</li>
      </ul>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Practical Applications
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use CPI-based comparisons for historical salaries and prices, wage-growth
        evaluation, savings and retirement discussions, and educational
        illustrations of long-term inflation — always with the caveat that the
        index is a general measure.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/salary-inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Salary Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/present-value-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Present Value Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/future-value-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Future Value Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/annual-income-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Annual Income Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/savings-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Savings Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="buying-power-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BUYING_POWER_FAQS]} />
      </div>
    </article>
  );
}
