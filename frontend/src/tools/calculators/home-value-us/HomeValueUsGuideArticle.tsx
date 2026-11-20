import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HOME_VALUE_US_FAQS } from './content';

export function HomeValueUsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-home-value"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Value of My Home?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market value is an estimate of what a property might sell for under
        typical conditions. It often differs from the original purchase price as
        local demand, interest rates, employment, neighborhood quality, and
        property condition change. A metro home price index can estimate how
        broad market prices moved between two dates, but an individual house can
        outperform or underperform that index. This calculator produces an
        index-based estimate — not a professional appraisal.
      </p>

      <h2
        id="case-shiller"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find Home Value – Case-Shiller Index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The S&amp;P CoreLogic Case-Shiller Home Price Indices measure residential
        price changes with a repeat-sales methodology. Metropolitan series track
        how prices evolve across a metro area over time. Index ratios can scale a
        historical purchase price to another observation month. Publication lags
        and revisions mean the latest available month may trail the calendar.
        Index coverage is not a census of every US property transaction.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Data in this tool is retrieved from FRED (Federal Reserve Bank of St.
        Louis), which redistributes Case-Shiller series and CPI-U observations.
        Attribution: S&amp;P Dow Jones Indices LLC; U.S. Bureau of Labor
        Statistics; FRED.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Home Value Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select your US metropolitan area.</li>
        <li>Choose the year of purchase.</li>
        <li>Choose the month of purchase.</li>
        <li>Enter the original purchase price in USD.</li>
        <li>Select Present value or Past value.</li>
        <li>If Past value, choose the valuation year and month.</li>
        <li>Review the estimated indexed home value.</li>
        <li>Review nominal appreciation.</li>
        <li>Review inflation-adjusted change when CPI data aligns.</li>
        <li>Check the source series IDs and observation periods.</li>
      </ol>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Home Value Calculation Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Estimated Home Value = Purchase Price × (Valuation Index / Purchase
          Index)
        </p>
        <p>Nominal change $ = Estimated Value − Purchase Price</p>
        <p>
          Nominal change % = (Estimated Value / Purchase Price − 1) × 100
        </p>
      </div>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Hypothetical check: price $300,000 · purchase index 150 · valuation 225</p>
        <p>Estimated value = 300,000 × (225 / 150) = $450,000</p>
      </div>

      <h2
        id="nominal-vs-real"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Nominal vs. Real Home Value
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Nominal</strong> — dollar amounts without adjusting for general
          inflation
        </li>
        <li>
          <strong>Real</strong> — compares purchasing power after CPI adjustment
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A home can rise in nominal dollars while showing smaller real
        appreciation once inflation is considered.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Inflation Affects Home Values
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPI-U tracks consumer prices. Inflation-adjusted purchase price =
        purchase price × (valuation CPI / purchase CPI). Real appreciation uses
        the ratio of the home-price index ratio to the CPI ratio — not simple
        percentage subtraction.
      </p>

      <h2
        id="mortgage-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Mortgage Rates Affect Home Prices
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mortgage rates influence monthly payments and buyer demand. Higher rates
        can cool activity; lower rates can support it. Rates interact with
        inventory, incomes, and local conditions.
      </p>

      <h2
        id="improvements"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Home Improvements Affect Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Metro indices generally do not isolate renovations on one property.
        Kitchen updates, structural work, energy upgrades, and maintenance can
        change a home&apos;s actual market value relative to the metro average.
        Spending does not guarantee a dollar-for-dollar value increase.
      </p>

      <h2
        id="value-vs-equity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Home Value vs. Home Equity
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Home Equity ≈ Current Home Value − Outstanding Mortgage Balance</p>
        <p>Example: value $450,000 − mortgage $280,000 → equity ≈ $170,000</p>
      </div>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Home Value Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Index estimates are not appraisals. Results depend on the selected metro,
        can lag live markets, and may diverge from neighborhood or property-level
        outcomes. Methodology revisions and missing months can affect results.
        Informational use only — not financial, tax, or lending advice.
      </p>

      <h2
        id="home-value-us-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HOME_VALUE_US_FAQS]} />
      </div>
    </article>
  );
}
