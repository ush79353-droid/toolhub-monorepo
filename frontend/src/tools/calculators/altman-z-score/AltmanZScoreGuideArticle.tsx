import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ALTMAN_Z_SCORE_FAQS } from './content';

export function AltmanZScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Altman Z-Score Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Altman Z-Score Calculator to assess a company&apos;s financial
        distress risk using five financial ratios. Enter working capital,
        retained earnings, EBIT, market value of equity, total assets, total
        liabilities, and sales to compute the original Altman Z-Score and see
        whether the result falls in the distress, grey, or safer zone. The
        score is a screening aid — not a guaranteed bankruptcy prediction.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Altman Z-Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Altman Z-Score combines liquidity, cumulative profitability,
        operating profitability, market-based leverage, and asset turnover into
        one weighted index. Edward I. Altman developed the original model as a
        multivariate financial distress screen for publicly traded manufacturing
        firms. Multiple ratios are used because no single metric captures
        distress risk alone. Investors, lenders, and analysts often use Z as an
        early-warning input alongside cash-flow and qualitative analysis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Altman Z-Score Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Z = 1.2X₁ + 1.4X₂ + 3.3X₃ + 0.6X₄ + 1.0X₅</p>
        <p>X₁ = Working Capital / Total Assets</p>
        <p>X₂ = Retained Earnings / Total Assets</p>
        <p>X₃ = EBIT / Total Assets</p>
        <p>X₄ = Market Value of Equity / Total Liabilities</p>
        <p>X₅ = Sales / Total Assets</p>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Ratio</th>
              <th className="py-2 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">X1</td>
              <td className="py-2">Short-term liquidity vs assets</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">X2</td>
              <td className="py-2">Cumulative profitability / maturity</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">X3</td>
              <td className="py-2">Operating return on assets</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">X4</td>
              <td className="py-2">Market equity cushion vs liabilities</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">X5</td>
              <td className="py-2">Asset turnover / sales efficiency</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Altman Z-Score
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Compute working capital (prefer CA − CL).</li>
        <li>Obtain retained earnings from the balance sheet (or roll forward).</li>
        <li>Enter EBIT, sales, total assets, and total liabilities for a consistent period.</li>
        <li>Enter market capitalization (shares × price), not book equity.</li>
        <li>Form X1–X5 and apply the original coefficients.</li>
        <li>Classify using distress (&lt;1.81), grey (1.81–2.99), safer (&gt;2.99).</li>
      </ol>

      <h2
        id="five-ratios"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding the Five Financial Ratios
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Working Capital to Total Assets
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        X1 measures net short-term liquidity relative to the asset base. Negative
        working capital lowers the score and can signal liquidity stress.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Retained Earnings to Total Assets
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        X2 captures cumulative profitability. Younger firms or firms with
        cumulative losses often show lower (even negative) RE/TA.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        EBIT to Total Assets
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        X3 is operating profitability before financing and tax. Negative EBIT
        reduces Z and is allowed in this calculator.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Market Value of Equity to Total Liabilities
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        X4 uses market capitalization over total liabilities. If liabilities are
        zero, X4 is undefined — this tool does not invent a substitute or show
        Infinity.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Sales to Total Assets
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        X5 is asset turnover. Higher sales per dollar of assets raise Z, holding
        other factors fixed.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Altman Z-Score
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Distress zone (Z &lt; 1.81): elevated distress risk under the original
        scheme. Grey zone (1.81–2.99): inconclusive. Safer zone (Z &gt; 2.99):
        comparatively stronger profile under the model. Thresholds are
        classification aids, not guarantees of bankruptcy or safety.
      </p>

      <h2
        id="good-score"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Altman Z-Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher scores generally indicate lower modeled distress risk for the
        original manufacturing sample. Cross-industry comparisons can mislead
        because capital intensity, margins, and leverage norms differ.
      </p>

      <h2
        id="negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can Altman Z-Score Be Negative?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes. Large negative working capital, retained earnings, or EBIT can drive
        Z below zero. Negative retained earnings are valid accounting outcomes
        and should not be rejected by the calculator.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Altman Z-Score Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current assets $1.5M, current liabilities $0.7M → NWC $0.8M. Retained
        earnings $1M, EBIT $0.5M, MVE $3M, total liabilities $2M, total assets
        $5M, sales $6M:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>X1 = 0.16 · X2 = 0.20 · X3 = 0.10 · X4 = 1.50 · X5 = 1.20</p>
        <p>Z = 0.192 + 0.280 + 0.330 + 0.900 + 1.200 = 2.902</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Z = 2.902 falls in the grey zone. Follow with cash-flow, debt maturity,
        liquidity, and industry analysis.
      </p>

      <h2
        id="public-private"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Altman Z-Score for Public vs. Private Companies
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The original model needs market equity and was calibrated mainly on
        public manufacturers. Private firms and nonmanufacturers often require
        Z′ or Z″ formulations with different coefficients and equity definitions.
        This calculator states that scope clearly and does not silently apply
        original weights to every company type.
      </p>

      <h2
        id="vs-ratios"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Altman Z-Score vs. Other Financial Ratios
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current and quick ratios focus on short-term liquidity; debt-to-equity
        and interest coverage emphasize leverage and debt service; ROA focuses on
        profitability; operating cash flow speaks to cash generation. Z blends
        several of these themes into one screen but does not replace
        ratio-by-ratio analysis.
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of Altman Z-Score
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Combines multiple financial indicators.</li>
        <li>Uses a transparent, standardized formula.</li>
        <li>Supports early distress screening and peer comparison when appropriate.</li>
        <li>Useful for tracking changes over reporting periods.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Altman Z-Score
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Historical calibration and industry sensitivity.</li>
        <li>Accounting policy differences and market-price volatility.</li>
        <li>Limited forward-looking and nonfinancial information.</li>
        <li>Not a guaranteed bankruptcy forecast or probability.</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use Altman Z-Score in Financial Analysis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Investors may screen portfolios for rising distress flags; lenders may
        triage credit files; owners may monitor trends after leverage changes.
        Always pair Z with statement quality checks, notes disclosures, and
        industry benchmarks.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/current-ratio-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Current Ratio Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/working-capital-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Working Capital Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/debt-to-equity-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Debt-to-Equity Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/return-on-assets-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Return on Assets Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/return-on-equity-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Return on Equity Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/ebit-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            EBIT Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/ebitda-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            EBITDA Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/enterprise-value-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Enterprise Value Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/market-capitalization-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Market Capitalization Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-coverage-ratio-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
            Interest Coverage Ratio Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="altman-z-score-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ALTMAN_Z_SCORE_FAQS]} />
      </div>
    </article>
  );
}
