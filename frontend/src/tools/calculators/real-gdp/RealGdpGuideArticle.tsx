import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REAL_GDP_FAQS } from './content';

export function RealGdpGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Real GDP Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gross domestic product summarizes the market value of final goods and
        services produced within an economy during a period. When that value is
        measured with current prices, the resulting total is nominal GDP. When
        the same volumes are valued at constant (base-year or reference) prices,
        the total is real GDP. Inflation-adjusted GDP lets analysts compare
        economic output across periods without confusing higher price tags with
        higher production. This calculator converts between nominal GDP, real
        GDP, and the GDP deflator using the standard textbook identities, with
        optional real GDP growth between two periods.
      </p>

      <h2
        id="what-is-real-gdp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Real GDP?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real GDP measures economic production valued at constant prices. A
        statistical agency chooses a base year (or a chain-linked reference) and
        revalues current-period quantities at those reference prices. The goal
        is to separate changes in quantities produced from changes in the
        overall price level. If an economy produces the same physical basket of
        goods and services as last year but every price doubles, nominal GDP
        roughly doubles while real GDP stays essentially unchanged (aside from
        measurement detail). Real GDP therefore tracks the volume of market
        output more closely than current-dollar totals.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Base years matter because the relative prices used to weight goods and
        services affect the measured growth path. Agencies periodically update
        base years or publish chain-volume measures that reduce substitution
        bias. For this calculator, treat the GDP deflator&apos;s reference level
        of 100 as the base-year price index against which the current period is
        compared.
      </p>

      <h2
        id="real-vs-nominal-gdp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Real GDP vs. Nominal GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal GDP uses current prices; real GDP uses constant prices.
        Inflation can push nominal GDP higher even when factories, offices, and
        services produce no additional volume. Conversely, falling prices can
        hold nominal GDP down while real output expands. Comparing the two
        series is how economists distinguish price-driven changes from
        quantity-driven changes.
      </p>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2 font-semibold text-accent">Aspect</th>
              <th className="px-3 py-2 font-semibold text-accent">Nominal GDP</th>
              <th className="px-3 py-2 font-semibold text-accent">Real GDP</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="px-3 py-2">Prices used</td>
              <td className="px-3 py-2">Current period</td>
              <td className="px-3 py-2">Constant / base-year</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">Reflects inflation</td>
              <td className="px-3 py-2">Yes (embedded)</td>
              <td className="px-3 py-2">Removed via deflator</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">Best for</td>
              <td className="px-3 py-2">Current-dollar size, budgets</td>
              <td className="px-3 py-2">Growth &amp; cycles</td>
            </tr>
            <tr>
              <td className="px-3 py-2">Can rise without more output?</td>
              <td className="px-3 py-2">Yes, via higher prices</td>
              <td className="px-3 py-2">Generally no</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="real-gdp-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Real GDP Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Real GDP = (Nominal GDP / GDP Deflator) × 100</p>
        <p>Nominal GDP = (Real GDP × GDP Deflator) / 100</p>
        <p>GDP Deflator = (Nominal GDP / Real GDP) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal GDP is the current-price total. The GDP deflator is an aggregate
        price index with base year 100. Real GDP is the inflation-adjusted
        total. Multiplying by 100 restores the conventional index scaling so
        that a deflator of 100 leaves real GDP equal to nominal GDP.
      </p>

      <h2
        id="calculate-real-gdp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Real GDP from Nominal GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example used by this calculator&apos;s defaults: nominal GDP =
        $25,000 billion ($25 trillion) and GDP deflator = 125.
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm units: both sides of the ratio use the same currency magnitude.</li>
        <li>Divide nominal GDP by the deflator: 25,000 ÷ 125 = 200.</li>
        <li>Multiply by 100: 200 × 100 = 20,000.</li>
        <li>
          Interpret: real GDP is $20,000 billion ($20 trillion) in base-year
 prices. A deflator of 125 means prices are 25% above the base year; 
          not necessarily that inflation was 25% in the latest year alone.
        </li>
      </ol>

      <h2
        id="gdp-deflator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the GDP Deflator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The GDP deflator is an economy-wide price index for domestically
        produced final goods and services. It links nominal GDP to real GDP and
        is typically expressed relative to a base year of 100. Unlike the
        Consumer Price Index (CPI), which tracks a household consumption basket
        (often including imports), the GDP deflator covers the composition of
 GDP (consumption, investment, government purchases, and net exports) 
        and focuses on domestic production. Import prices that raise CPI may not
        move the GDP deflator the same way.
      </p>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[24rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2 font-semibold text-accent">Deflator</th>
              <th className="px-3 py-2 font-semibold text-accent">
                Price-level vs base year
              </th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="px-3 py-2">80</td>
              <td className="px-3 py-2">20% below base-year level</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">100</td>
              <td className="px-3 py-2">Equals base-year level</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">110</td>
              <td className="px-3 py-2">10% above base-year level</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">125</td>
              <td className="px-3 py-2">25% above base-year level</td>
            </tr>
            <tr>
              <td className="px-3 py-2">150</td>
              <td className="px-3 py-2">50% above base-year level</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        These comparisons are with the base year, not annual inflation rates. A
        single deflator observation is not a one-year inflation percentage.
      </p>

      <h2
        id="calculate-deflator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the GDP Deflator
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        GDP Deflator = (Nominal GDP / Real GDP) × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: nominal $25 trillion and real $20 trillion → (25 / 20) × 100 =
        125. Select the calculator&apos;s &quot;GDP Deflator&quot; mode to solve
        for the index when both GDP figures are known. Real GDP must be positive
        to avoid division by zero.
      </p>

      <h2
        id="nominal-from-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Nominal GDP from Real GDP
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Nominal GDP = (Real GDP × GDP Deflator) / 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Original example: real GDP = $18,000 billion and deflator = 110 →
        nominal = (18,000 × 110) / 100 = $19,800 billion. Use &quot;Nominal
        GDP&quot; mode when you know constant-price output and the price index
        but need the current-dollar total.
      </p>

      <h2
        id="real-gdp-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Real GDP Growth Rate Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        g = (Rₜ − Rₜ₋₁) / Rₜ₋₁ × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rₜ is current-period real GDP and Rₜ₋₁ is previous-period real GDP.
        Example: previous real GDP $20 trillion, current $21 trillion → ((21 −
        20) / 20) × 100 = 5%. Real GDP growth measures the percentage change in
        inflation-adjusted output. Expand the optional growth section in the
        calculator to compute g from two real GDP observations (same magnitude).
      </p>

      <h2
        id="real-gdp-per-capita"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Real GDP per Capita
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        Real GDP per Capita = Real GDP / Population
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dividing real GDP by population yields a rough measure of economic
        output per person. It is not household income, median wages, or living
        standards. Distribution, non-market work, leisure, and public goods all
        matter for welfare. Use the dedicated{' '}
        <Link
          href="/tools/gdp-per-capita-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP per Capita Calculator
        </Link>{' '}
        when you have population figures.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Real GDP Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Policymakers and analysts watch real GDP for economic growth, recessions,
        and expansions; fiscal planning; monetary-policy context; productivity
        research; and international comparisons of output volumes. Businesses use
 real-growth trends when forecasting demand, capacity, and investment; 
        always alongside industry data, not as a standalone market-timing signal.
      </p>

      <h2
        id="inflation-effects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Inflation Affects Nominal and Real GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose an economy produces 100 identical widgets every year. In year 1
        each sells for $10 (nominal GDP $1,000). In year 2 each sells for $12
        with the same quantity. Nominal GDP rises to $1,200 (20%), but real GDP
        at year-1 prices remains $1,000. The GDP deflator would read 120. Price
        increases alone raised the current-dollar total; real output did not
        grow. That is why growth headlines usually emphasize real GDP.
      </p>

      <h2
        id="recessions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Real GDP and Economic Recessions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economists track changes in real GDP when analyzing contractions because
        falling inflation-adjusted output signals weaker production and income.
        Popular commentary sometimes defines a recession as two consecutive
        quarters of negative real GDP growth, but official dating committees may
        use broader criteria (employment, income, industrial production, and
        sales). Treat the two-quarter rule as a heuristic, not a universal law.
      </p>

      <h2
        id="cross-country"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Comparing Real GDP Across Countries
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cross-country comparisons face exchange-rate swings, differing price
        levels, and national-accounts methodologies. Purchasing-power parity
        (PPP) conversions attempt to compare living costs and output volumes more
        fairly than market FX alone. GDP per capita further adjusts for
        population. This basic Real GDP Calculator does not perform PPP
 conversion; use the{' '}
        <Link
          href="/tools/ppp-calculator-purchasing-power-parity"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PPP Calculator
        </Link>{' '}
        for purchasing-power comparisons. Currency selection here is denomination
        only (labels and formatting), not live exchange-rate conversion.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Real GDP
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Non-market activities (home production, informal work) are undercounted.</li>
        <li>Income inequality is invisible in a single aggregate.</li>
        <li>Environmental costs and resource depletion are poorly captured.</li>
        <li>Unpaid household work is largely excluded.</li>
        <li>Quality changes and new goods challenge price measurement.</li>
        <li>Statistical revisions can alter published history.</li>
        <li>Base-year and index methodology affect measured growth paths.</li>
        <li>Expenditure totals are not the same as well-being or happiness.</li>
      </ol>

      <h2
        id="business-investors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Businesses and Investors Use Real GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Firms use real GDP trends for demand forecasting, industry growth
        context, capital budgeting, and assessing macroeconomic risk. Investors
 watch real growth alongside inflation, policy rates, and earnings; 
        never as a reliable stand-alone stock-market timing indicator. Policy
        expectations and sector rotation often matter more than a single GDP
        print. Treat calculator results as educational identities, not forecasts.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose currency denomination and GDP magnitude (units through trillions).</li>
        <li>Select Calculate: Real GDP, Nominal GDP, or GDP Deflator.</li>
        <li>Enter the two known inputs; the third field updates automatically.</li>
        <li>Optionally expand real GDP growth and enter previous and current real GDP.</li>
        <li>Read the interpretation card, bar chart, and calculation steps.</li>
        <li>Reload restores the 25,000 billion / 125 → 20,000 example; Clear empties fields.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/gdp-deflator-formula-calculator" className="text-primary hover:underline">
            GDP Deflator Formula Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/gdp-growth-rate-calculator" className="text-primary hover:underline">
            GDP Growth Rate Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/gdp-per-capita-calculator" className="text-primary hover:underline">
            GDP per Capita Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/gdp-gap-calculator" className="text-primary hover:underline">
            GDP Gap Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/inflation-calculator" className="text-primary hover:underline">
            Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cpi-inflation-calculator-consumer-price-index"
            className="text-primary hover:underline"
          >
            CPI Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/ppp-calculator-purchasing-power-parity"
            className="text-primary hover:underline"
          >
            PPP Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/buying-power-calculator" className="text-primary hover:underline">
            Buying Power Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="real-gdp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...REAL_GDP_FAQS]} />
      </div>
    </article>
  );
}
