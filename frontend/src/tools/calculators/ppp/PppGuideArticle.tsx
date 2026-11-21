import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PPP_FAQS } from './content';
import { PPP_COUNTRIES, PPP_DATA_SOURCE, priceLevelVsUs } from './ppp-data';

export function PppGuideArticle() {
  const tableYear = 2023 as const;
  const rows = PPP_COUNTRIES.map((c) => ({
    name: c.name,
    pli: priceLevelVsUs(c, tableYear),
  }))
    .filter((r) => r.pli != null)
    .sort((a, b) => (b.pli ?? 0) - (a.pli ?? 0));

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        PPP Calculator — Purchasing Power Parity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Comparing salaries across borders with market exchange rates alone can
        mislead: a higher converted wage may buy less where prices are high. This
        PPP Calculator converts a source-country salary into a
        purchasing-power-equivalent amount in a target currency using GDP PPP
        conversion factors, then optionally compares that result with a
        same-year market exchange-rate conversion. Results are educational
        estimates — not employer offers or personalized cost-of-living quotes.
      </p>

      <h2
        id="what-stands-for"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does PPP Stand For?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PPP means Purchasing Power Parity. It asks how much currency is needed
        in each economy to buy a comparable basket, often expressed via
        international dollars. That is different from asking what a bank will
        give you today for one dollar on the FX market.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Purchasing Power Parity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PPP theory builds on the idea that identical goods should cost similar
        amounts after currency conversion (the law of one price) once trade and
        competition work. In practice, baskets differ, many services are
        nontradable, and market rates swing with capital flows. Statistical PPP
        factors from the International Comparison Program and World Bank WDI
        summarize national price levels for defined aggregates such as GDP.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does the PPP Calculator Work?
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose source and target countries (or enter factors manually).</li>
        <li>Enter salary and monthly/yearly period.</li>
        <li>Select a shared reference year for dataset mode.</li>
        <li>Load matching GDP PPP conversion factors.</li>
        <li>Convert salary to international dollars, then to target LCU.</li>
        <li>Optionally compare with same-year official market FX.</li>
      </ol>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        S_B = S_A × (PPP_B / PPP_A)
      </div>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Purchasing Power Parity Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hypothetical example: S_A = 50,000, PPP_A = 1, PPP_B = 2 → international
        dollars = 50,000; S_B = 100,000 target currency units. Under those
        factors, 100,000 target units match the purchasing power of 50,000 source
        units. This calculator&apos;s dataset mode uses World Bank WDI GDP PPP
        (PA.NUS.PPP), not a household-consumption series — so factors stay
        consistent across countries.
      </p>

      <h2
        id="ppp-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPP Exchange Rate Formula
      </h2>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        E_PPP = PPP_B / PPP_A
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Direction: target currency units per one source currency unit. Example:
        PPP_A = 1, PPP_B = 2 → E_PPP = 2. Do not reverse the quotation silently.
      </p>

      <h2
        id="vs-market"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPP vs. Market Exchange Rates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market rates clear FX markets and can be volatile. PPP rates summarize
        relative price levels and move slowly with benchmarks and estimates.
        Tradables may track FX more closely than housing or local services. For
        fair comparisons, this tool defaults to same-year official exchange rates
        from WDI rather than mixing historical PPP with today&apos;s spot.
      </p>

      <h2
        id="price-levels"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Price-Level Indices?
      </h2>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        R = E_PPP / E_M
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        With both rates quoted as target per source, R ≈ 1 (100%) means parity in
        that comparison; below 100% suggests lower aggregate prices in the target
        under this convention. National averages are not every city or category.
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Country</th>
              <th className="px-3 py-2 font-semibold">
                Price-level index vs US (PPP/FX × 100)
              </th>
              <th className="px-3 py-2 font-semibold">Year</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border">
                <td className="px-3 py-2 text-foreground/90">{r.name}</td>
                <td className="px-3 py-2 tabular-nums text-accent">
                  {r.pli!.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{tableYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Derived from {PPP_DATA_SOURCE} for {tableYear}. US ≈ 100 by construction.
        Not a live ranking feed.
      </p>

      <h2
        id="salary"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PPP Salary Comparison Between Countries
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use PPP to translate purchasing power of wages, then layer taxes,
        housing, healthcare, transport, and household needs. National PPP is not
        a city-level living-cost index.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Examples of Purchasing Power Parity
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Dataset default: United States → Canada, 2023 WDI GDP PPP factors, with
          same-year official FX for market comparison.
        </li>
        <li>
          Manual hypothetical: PPP_A = 1, PPP_B = 2, salary 50,000 → 100,000
          target units (illustrative only).
        </li>
        <li>
          Same-country check: identical factors return the original salary.
        </li>
      </ol>

      <h2
        id="absolute-relative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Absolute vs. Relative Purchasing Power Parity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Absolute PPP compares price levels at a point in time. Relative PPP links
        exchange-rate changes to inflation differentials over time. Do not confuse
        relative PPP theory with the cross-sectional salary formula S_B = S_A ×
        (PPP_B / PPP_A).
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Purchasing Power Parity Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PPP underpins international GDP comparisons, living-standard research,
        poverty analysis, and long-horizon exchange-rate discussions. Salary tools
        borrow the same conversion logic with clear caveats.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Purchasing Power Parity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consumption patterns, housing, nontradables, taxes/subsidies, regional
        prices, government services, publication lags, and methodological
        revisions all limit accuracy. GDP PPP is not personalized COL.
      </p>

      <h2
        id="negotiations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use PPP for International Salary Negotiations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Treat the PPP-adjusted figure as one input beside local wage surveys,
        taxes, benefits, housing, family costs, and FX exposure — never as a
        guaranteed equivalent standard of living.
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
            href="/tools/buying-power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Buying Power Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Inflation Calculator
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
            href="/tools/currency-forward-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Currency Forward Calculator
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
            href="/tools/gdp-deflator-formula-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Deflator Formula Calculator
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
        id="ppp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PPP_FAQS]} />
      </div>
    </article>
  );
}
