import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GDP_GROWTH_FAQS } from './content';

export function GdpGrowthGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        GDP Growth Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GDP growth measures the percentage change in gross domestic product
        between two periods. Enter current and previous GDP to compute growth,
        or rearrange for either GDP level when the growth rate is known. Prefer
        real GDP when you want inflation-adjusted volume growth; nominal growth
        mixes prices and quantities. One negative print does not automatically
        define a recession.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is GDP Growth Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It is the percentage rise or fall in GDP relative to the earlier period.
        Expansion means positive growth; contraction means negative growth. GDP
        levels are stocks of output; growth rates are relative changes.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Growth Rate Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Growth (%) = ((GDP_current − GDP_previous) / GDP_previous) × 100
        </p>
        <p>Current = Previous × (1 + g/100)</p>
        <p>Previous = Current / (1 + g/100)</p>
      </div>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Economic Growth Rate
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine current-period GDP.</li>
        <li>Determine previous-period GDP.</li>
        <li>Subtract previous from current.</li>
        <li>Divide by previous GDP.</li>
        <li>Multiply by 100.</li>
        <li>Interpret expansion, contraction, or no change.</li>
      </ol>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Growth Rate Calculation Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Positive: (21−20)/20×100 = +5%</p>
        <p>Negative: (19−20)/20×100 = −5%</p>
        <p>Zero: (20−20)/20×100 = 0%</p>
        <p>Reverse: Previous 20, g=5% → Current 21</p>
      </div>

      <h2
        id="real-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Real GDP Growth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real GDP growth uses inflation-adjusted output so price changes do not
        masquerade as production growth. It is the usual concept behind “economic
        growth” in volume terms.
      </p>

      <h2
        id="nominal-vs-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nominal GDP Growth vs. Real GDP Growth
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Aspect</th>
              <th className="py-2 pr-3 font-semibold">Nominal</th>
              <th className="py-2 font-semibold">Real</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Prices</td>
              <td className="py-2 pr-3">Current</td>
              <td className="py-2">Constant / chained</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Use</td>
              <td className="py-2 pr-3">Cash aggregates</td>
              <td className="py-2">Volume / growth analysis</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="quarterly-vs-annual"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Quarterly vs. Annual GDP Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Quarter-over-quarter, year-over-year, annual totals, and annualized QoQ
        ((Current/Previous)⁴ − 1) answer different questions. Do not compare
        rates across period definitions without conversion. This calculator never
        annualizes silently.
      </p>

      <h2
        id="business-cycle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Growth Rate and the Business Cycle
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expansion, peak, contraction, trough, and recovery describe cyclical
        phases. GDP growth is one indicator among many used to read conditions.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why GDP Growth Matters
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Economic performance and living standards (with caveats)</li>
        <li>Employment, investment, and consumer spending</li>
        <li>Government revenue and public policy</li>
        <li>International comparisons (method differences remain)</li>
      </ul>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Growth and Inflation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal GDP, real GDP, and the GDP deflator interact, but growth and
        inflation are separate measures. Rising prices can inflate nominal growth
        without raising real output.
      </p>

      <h2
        id="vs-gap"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Growth vs. GDP Gap
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Growth compares periods; the{' '}
        <Link
          href="/tools/gdp-gap-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP gap
        </Link>{' '}
        compares actual output with estimated potential at a point in time.
      </p>

      <h2
        id="per-capita"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GDP Growth and GDP per Capita
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        If population grows 2% and real GDP grows 3%, per-capita growth is about
        1% — total growth alone can overstate gains per person.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting GDP Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Labor productivity, capital investment, technology, workforce growth,
        demand, public investment, trade, confidence, and monetary/fiscal
        conditions all influence growth paths.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of GDP Growth as an Economic Indicator
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Not a full measure of well-being or distribution</li>
        <li>Environmental and unpaid household work gaps</li>
        <li>Revisions and short-run volatility</li>
        <li>Must be read with other indicators</li>
      </ul>

      <h2
        id="facts"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interesting Facts About GDP Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Small differences in long-run compound growth can transform living
        standards over decades. Productivity growth is a central driver of
        sustained real GDP gains. Business cycles mean growth rates fluctuate
        even when trend growth is stable. Cross-country comparisons require
        consistent methods and careful interpretation of PPP-adjusted series.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the GDP Growth Rate Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose currency denomination and GDP measure (real/nominal).</li>
        <li>Select comparison period; optionally annualize quarterly QoQ.</li>
        <li>Pick mode: growth %, current GDP, or previous GDP.</li>
        <li>Enter the two known values with magnitudes.</li>
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
            href="/tools/fisher-effect-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Effect Calculator
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
      </ul>

      <h2
        id="gdp-growth-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GDP_GROWTH_FAQS]} />
      </div>
    </article>
  );
}
