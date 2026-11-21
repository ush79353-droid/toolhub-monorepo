import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INFLATION_FAQS } from './content';

export function InflationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Inflation Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation changes what a dollar can buy. This calculator estimates
        inflation-adjusted monetary values using United States CPI-U annual
        averages (BLS series CUUR0000SA0) or a custom compound inflation rate.
        Compare purchasing power across years, read cumulative and annualized
        inflation, and separate the future dollars needed for the same basket
        from the purchasing power remaining if cash is held without return.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Inflation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation is a general rise in the price level of goods and services — not
        merely a jump in one item. As the broad price level rises, each unit of
        currency buys fewer goods: purchasing power falls. Economists track
        inflation with price indices such as the Consumer Price Index (CPI). A
        higher cost of living for households often accompanies inflation, but
        household experience can differ from any single national index.
      </p>

      <h2
        id="inflation-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Inflation Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The inflation rate is the percentage change in a price index over a
        chosen interval — month-over-month, year-over-year, or a longer span
        (cumulative). Annualized rates convert multi-year changes into a
        compound yearly pace. Positive rates mean rising prices; negative rates
        mean falling prices (deflation).
      </p>

      <h2
        id="how-to-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Inflation Rate
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Inflation Rate = ((CPI_new − CPI_old) / CPI_old) × 100</p>
        <p>Cumulative = ((CPI_target / CPI_reference) − 1) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hypothetical teaching example (not a BLS claim): CPI_old = 200, CPI_new
        = 260 → ((260 − 200) / 200) × 100 = 30% cumulative inflation.
      </p>

      <h2
        id="adjusted-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Inflation-Adjusted Value
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Adjusted Value = Original Value × (CPI_target / CPI_reference)</p>
        <p>Custom estimate: FV = PV × (1 + r)^t</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hypothetical: $1,000 with CPI 200 → 260 becomes $1,300 for equivalent
        basket purchasing power. Custom: $1,000 at 3% for 5 years → about
        $1,159.27. Custom results are model-based estimates, not forecasts.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Inflation Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose US historical data or Custom data.</li>
        <li>For historical, select Yearly frequency (quarterly monthly averages are not embedded in this build).</li>
        <li>Enter the original amount (With value).</li>
        <li>Choose the reference year (In).</li>
        <li>Choose the target year (In) and read I would have.</li>
        <li>Review cumulative inflation, annualized rate, and purchasing-power factor.</li>
        <li>For custom mode, enter annual rate %, time, and unit (years/months/quarters).</li>
      </ol>

      <h2
        id="purchasing-power"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Purchasing Power?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Purchasing power is how many goods and services a unit of money can buy.
        Inflation reduces the purchasing power of cash held without interest.
        Nominal balances can rise while real purchasing power falls. This
        calculator shows both the future dollars needed for the same basket and
        a purchasing-power factor for money held idle.
      </p>

      <h2
        id="cpi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation and the Consumer Price Index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPI tracks a weighted basket of consumer goods and services. Weights
        reflect expenditure patterns and change over time. CPI is widely used to
        measure consumer inflation, but it has limitations: substitution,
        quality change, regional differences, and series definitions (CPI-U vs
        CPI-W, NSA vs SA). This tool uses CPI-U US City Average, All Items, NSA
        annual averages (CUUR0000SA0, 1982-84=100).
      </p>

      <h2
        id="financial"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation in a Financial Context
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inflation interacts with savings yields, fixed-income coupons, mortgage
        rates, wage growth, and retirement planning. Nominal investment gains do
        not guarantee higher purchasing power — real returns subtract inflation.
        Borrowers with fixed-rate debt may benefit when unexpected inflation
        erodes real debt burdens; lenders face the opposite risk.
      </p>

      <h2
        id="savings"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Inflation Affects Savings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $10,000 under mattress for 10 years at 5% annual inflation keeps
        about 61% of its purchasing power (~$6,139 of today’s basket). If a
        deposit earns less than inflation after tax, real wealth still shrinks.
      </p>

      <h2
        id="interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation and Interest Rates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal interest rates include expected inflation; real rates strip it
        out. The Fisher relationship links nominal rates, real rates, and
        expected inflation. Central banks often respond to inflation when setting
        policy rates. See the{' '}
        <Link
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect Calculator
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/fisher-equation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Equation Calculator
        </Link>
        .
      </p>

      <h2
        id="wages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation and Wages
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A 4% nominal raise with 5% inflation is a real wage cut. Cost-of-living
        adjustments try to keep pace with CPI, but timing and coverage vary.
        Compare wage growth to the same CPI series used for living-cost claims.
      </p>

      <h2
        id="deflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Deflation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Deflation is a falling general price level (negative inflation). It can
        raise the real burden of debt and encourage delayed spending. Disinflation
        is different: inflation slows but prices may still rise.
      </p>

      <h2
        id="hyperinflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Hyperinflation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hyperinflation means extremely rapid price increases that devastate
        currency usefulness for savings and contracts. Consumers rush to spend;
        savings evaporate in real terms; monetary systems often break down.
        Precise statistical thresholds and peak monthly rates differ by study —
        verify primary sources before citing exact percentages.
      </p>

      <h2
        id="hyper-examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Historical Examples of Hyperinflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Often-cited educational cases include Weimar Germany in the early 1920s,
        Hungary after World War II, and Zimbabwe in the 2000s. Episodes differ in
        causes (war finance, fiscal collapse, monetary expansion), severity,
        duration, and policy response. This page does not invent peak rates;
        consult economic history references for dated statistics.
      </p>

      <h2
        id="investments"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation and Investments
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Stocks, bonds, cash, and real assets respond differently to inflation
        surprises. Inflation-linked bonds and real assets may help in some
        regimes, but no investment consistently hedges inflation every period.
        Focus on real (inflation-adjusted) returns for long-term planning.
      </p>

      <h2
        id="vs-col"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation vs. Cost of Living
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        National CPI inflation is an average basket. Your rent, commuting, and
        healthcare mix may move differently. Regional price levels and lifestyle
        choices create personal cost-of-living paths that diverge from headline
        CPI.
      </p>

      <h2
        id="vs-pp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation vs. Purchasing Power
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Aspect</th>
              <th className="py-2 pr-3 font-semibold">Inflation</th>
              <th className="py-2 font-semibold">Purchasing power</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Meaning</td>
              <td className="py-2 pr-3">Change in price level</td>
              <td className="py-2">Goods a dollar can buy</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Measurement</td>
              <td className="py-2 pr-3">Index % change</td>
              <td className="py-2">Inverse of price rise</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Practice</td>
              <td className="py-2 pr-3">Track CPI rates</td>
              <td className="py-2">Adjust money across time</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="vs-deflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation vs. Deflation vs. Disinflation
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Inflation: prices rising (positive rate).</li>
        <li>Deflation: prices falling (negative rate).</li>
        <li>Disinflation: inflation rate slowing while still positive.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Inflation Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>CPI coverage and basket weights</li>
        <li>Regional and household differences</li>
        <li>Data revisions and series breaks</li>
        <li>Annual averages vs monthly/quarterly detail</li>
        <li>Future inflation uncertainty in custom mode</li>
        <li>Nominal vs real interpretation mistakes</li>
      </ul>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Inflation Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Households, businesses, governments, central banks, investors, borrowers,
        and lenders all care about the price level because it reshapes real
        incomes, debt burdens, tax brackets, and investment returns. Reliable
        measurement and clear definitions matter as much as the headline rate.
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
            href="/tools/gdp-deflator-formula-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Deflator Formula Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fisher-effect-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Effect Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fisher-equation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Equation Calculator
          </Link>
        </li>
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
            href="/tools/gdp-per-capita-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP per Capita Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/maturity-value-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Maturity Value Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/currency-forward-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Currency Forward Calculator
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
        id="inflation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INFLATION_FAQS]} />
      </div>
    </article>
  );
}
