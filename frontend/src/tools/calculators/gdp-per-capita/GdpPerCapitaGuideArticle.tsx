import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GDP_PER_CAPITA_FAQS } from './content';

export function GdpPerCapitaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        GDP per Capita Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GDP per capita divides gross domestic product by population to summarize
        average economic output per person. Use it to compare scale-adjusted
        output, explore reverse calculations, and read real, nominal, or
 PPP-labeled figures; remembering it is not personal income, median
        wages, or wealth.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is GDP per Capita?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It is average output per resident under a chosen GDP measure. It
        supports development comparisons and productivity discussions but does
        not measure income equality or household prosperity directly.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP per Capita Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>GDPpc = GDP / Population</p>
        <p>GDP = GDPpc × Population</p>
        <p>Population = GDP / GDPpc</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $2 trillion ÷ 50 million people = $40,000 per person.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate GDP per Capita
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find GDP for the economy and period.</li>
        <li>Identify matching population.</li>
        <li>Align geography, period, and measure (real/nominal/PPP).</li>
        <li>Convert magnitudes to common units.</li>
        <li>Divide GDP by population.</li>
        <li>Interpret as average output, not each person’s pay.</li>
      </ol>

      <h2
        id="real-vs-nominal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Real GDP per Capita vs. Nominal GDP per Capita
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Aspect</th>
              <th className="py-2 pr-3 font-semibold">Real</th>
              <th className="py-2 font-semibold">Nominal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Prices</td>
              <td className="py-2 pr-3">Constant / chained</td>
              <td className="py-2">Current</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Best for</td>
              <td className="py-2 pr-3">Growth over time</td>
              <td className="py-2">Current-price snapshots</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="ppp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP per Capita at Purchasing Power Parity (PPP)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PPP adjusts for different price levels across countries, often using
        international dollars. PPP and market-exchange-rate rankings can differ
 substantially. This calculator labels PPP inputs; it does not invent
        conversion factors.
      </p>

      <h2
        id="countries"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Countries with the Highest GDP per Capita
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Published rankings depend on year, nominal vs PPP series, and whether
        small jurisdictions are included. Authoritative sources include the World
        Bank, IMF, OECD, and UN statistical databases. This page does not hardcode
        undated country ranks to avoid presenting invented or stale figures as
        current.
      </p>

      <h2
        id="united-states"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP per Capita in the United States
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US GDP per capita = US GDP ÷ US population for matching periods. Nominal
        and real series diverge with inflation; both revise over time. Use BEA
        and Census (or international databases) for dated values rather than a
        fixed number here.
      </p>

      <h2
        id="growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP per Capita and Economic Growth
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>(1 + g_pc) = (1 + g_GDP) / (1 + g_population)</p>
        <p>Approximation: g_pc ≈ g_GDP − g_population</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total GDP can grow while per-capita growth is weaker if population also
        rises. See the{' '}
        <Link
          href="/tools/gdp-growth-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Growth Rate Calculator
        </Link>
        .
      </p>

      <h2
        id="inequality"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP per Capita and Income Inequality
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Averages hide distribution. High GDP per capita can coexist with large
        gaps between mean and median incomes, concentrated wealth, and regional
        disparities.
      </p>

      <h2
        id="vs-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP per Capita vs. Average Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Output, wages, household income, disposable income, and median income
        answer different questions. Do not treat GDP per capita as a paycheck.
      </p>

      <h2
        id="vs-gni"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP per Capita vs. GNI per Capita
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GDP covers domestic production; GNI adjusts for net primary income from
        abroad. Per-capita versions divide each aggregate by population.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why GDP per Capita Matters
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Development and productivity comparisons</li>
        <li>Policy and investment context</li>
        <li>Long-run performance tracking</li>
        <li>Rough living-standard approximations (with caveats)</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of GDP per Capita
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Inequality and cost-of-living differences</li>
        <li>Unpaid work, informal activity, environment</li>
        <li>Health/education outcomes not fully captured</li>
        <li>Currency, population, and revision uncertainty</li>
      </ul>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP per Capita Calculation Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>$2T / 50M = $40,000</p>
        <p>$300B / 15M = $20,000</p>
        <p>$1.5T / 300M = $5,000</p>
        <p>$1.1T / 52M ≈ $21,153.85</p>
      </div>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret GDP per Capita Results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The same dollar figure can imply different living conditions depending on
        prices, public services, distribution, and economic structure. Pair GDPpc
        with complementary indicators.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the GDP per Capita Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose currency denomination and GDP measure label.</li>
        <li>Select mode: per capita, GDP, or population.</li>
        <li>Enter the two known values with magnitudes.</li>
        <li>Read the result and steps; remember the average-output caveat.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/gdp-growth-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Growth Rate Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gdp-gap-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Gap Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gdp-deflator-formula-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Deflator Formula Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cpi-inflation-calculator-consumer-price-index"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CPI Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/buying-power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Buying Power Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/productivity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Productivity Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/discretionary-income-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Discretionary Income Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="gdp-per-capita-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GDP_PER_CAPITA_FAQS]} />
      </div>
    </article>
  );
}
