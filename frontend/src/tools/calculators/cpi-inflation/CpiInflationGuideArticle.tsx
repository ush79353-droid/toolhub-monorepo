import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CPI_INFLATION_FAQS } from './content';
import {
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
} from '../buying-power/us-cpi-u-annual';

export function CpiInflationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        CPI Inflation Calculator – Consumer Price Index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator compares the purchasing power of a monetary amount between
        two years using Consumer Price Index (CPI) data. Enter an amount, choose a
        base year and target year (or supply custom CPI index values), and read
        the inflation-adjusted equivalent, cumulative CPI change, compound average
        annual inflation, and purchasing-power change. Historical mode uses{' '}
        {US_CPI_SOURCE_NAME} series {US_CPI_SERIES_ID} annual averages (
        {US_CPI_MIN_YEAR}–{US_CPI_MAX_YEAR}).
      </p>

      <h2
        id="what-is-cpi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Consumer Price Index (CPI)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPI is an index that tracks average price change for a representative
        basket of consumer goods and services. Index values are not currency
        amounts. Inflation is measured from how that index changes over time.
      </p>

      <h2
        id="how-cpi-calculated"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Is CPI Calculated?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Define population and geography.</li>
        <li>Select representative goods and services.</li>
        <li>Collect price observations.</li>
        <li>Apply expenditure weights.</li>
        <li>Build component indexes and aggregate them.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Official CPI methods are more sophisticated than a simple fixed-basket
        classroom formula.
      </p>

      <h2
        id="cpi-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CPI Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CPI_t ≈ (Cost_t / Cost_base) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is an instructional approximation, not a full description of modern
        BLS index construction.
      </p>

      <h2
        id="what-is-cpi-inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is CPI Inflation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPI inflation is the percent change in the CPI between two observations.
        Positive values mean prices rose; negative values mean they fell
        (deflation over that span). Disinflation means inflation that is still
        positive but slower than before.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate CPI Inflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illustrative CPI pair (not official BLS values): 2010 = 220, 2020 = 260,
        amount $1,000.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Equivalent = 1000 × (260/220) ≈ $1,181.82</p>
        <p>Cumulative = (260/220 − 1)×100 ≈ 18.18%</p>
        <p>Annualized ≈ [(260/220)^(1/10) − 1]×100 ≈ 1.68%</p>
        <p>Purchasing-power change ≈ (220/260 − 1)×100 ≈ −15.38%</p>
      </div>

      <h2
        id="adjusted-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Inflation-Adjusted Value of Money
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>A_target = A_base × (CPI_target / CPI_base)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the same CPI series and period type (here: annual averages) for both
        years.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the CPI Inflation Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the monetary amount (USD).</li>
        <li>Select the base year (or enter custom base CPI).</li>
        <li>Select the target year (or custom target CPI).</li>
        <li>Read the equivalent value.</li>
        <li>Review cumulative and annualized inflation.</li>
        <li>Interpret purchasing-power change separately.</li>
      </ol>

      <h2
        id="cpi-vs-inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Consumer Price Index (CPI) vs. Inflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPI is the index; inflation is the rate of change. CPI is one common way
        to measure consumer-price inflation, not the only price index in economics.
      </p>

      <h2
        id="cpi-vs-col"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CPI vs. Cost of Living
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPI approximates broad cost-of-living change but cannot match every
        household because of spending mix, geography, substitution, quality
        adjustment, and special categories such as housing or healthcare.
      </p>

      <h2
        id="cpi-vs-gdp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CPI vs. GDP Deflator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPI emphasizes consumer purchases (including many imports). The GDP
        deflator covers domestically produced output more broadly with different
        weights and uses. They can diverge.
      </p>

      <h2
        id="headline-core"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Headline CPI vs. Core CPI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Headline (all-items) CPI includes food and energy. Core CPI often excludes
        them to highlight underlying trends — not because core is inherently a
        better personal cost-of-living measure.
      </p>

      <h2
        id="purchasing-power"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CPI and Purchasing Power
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When the index rises, a fixed nominal paycheck or cash balance typically
        buys less of the measured basket — groceries, rent, transport, and
        household goods in the statistical sense, not necessarily your exact cart.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Does Inflation Matter?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation affects budgets, wages, savings, retirement planning, borrowing
        and lending, real investment returns, business pricing, and economic
        policy.
      </p>

      <h2
        id="trends"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Historical CPI Inflation Trends
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual CPI inflation fluctuates with economic conditions. Long spans can
        show large cumulative change even when average annual rates look modest.
        Use verified BLS annual averages for historical claims — this tool embeds
        those observations rather than inventing them.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of CPI
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Individual spending patterns differ</li>
        <li>Geographic price variation</li>
        <li>Substitution and quality adjustment</li>
        <li>Publication lags and revisions</li>
        <li>Changing consumption baskets over long periods</li>
      </ul>

      <h2
        id="personal-finance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation and Personal Finance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        People use CPI to compare salaries across years, review savings in real
        terms, understand real returns, budget long-term goals, and sense-check
        retirement projections.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <a
            href="/tools/buying-power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Buying Power Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/present-value-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Present Value Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/future-value-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Future Value Calculator
          </a>
        </li>
        <li>
          <a
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Compound Interest Calculator
          </a>
        </li>
      </ul>

      <h2
        id="cpi-inflation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CPI_INFLATION_FAQS]} />
      </div>
    </article>
  );
}
